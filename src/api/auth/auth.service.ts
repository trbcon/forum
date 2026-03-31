import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/index';
import { hash, verify } from 'argon2';
import { Response, Request } from 'express';
import { isDev } from 'src/common/utils/index'

@Injectable()
export class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_ACCESS_TOKEN_TTL: string;
    private readonly JWT_REFRESH_TOKEN_TTL: string;
    private readonly COOKIE_DOMAIN: string;

    constructor (
        private readonly prismaService: PrismaService, 
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
        this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET');
        this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL');
        this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
    }

    async register( res: Response, dto: RegisterRequest ) {
        const { username, email, password } = dto;
        const existUsername = await this.prismaService.user.findUnique({
            where: {
                username
            }
        });

        const existEmail = await this.prismaService.user.findUnique({
            where: { 
                email
            }
        });

        if (existUsername || existEmail) { throw new ConflictException('Пользователь с такими данными уже зарегестрирован')}

        const user = await this.prismaService.user.create({
            data: {
                username,
                email, 
                password: await hash(password),
            }
        })

        // return this.generateTokens(user.id);

        return this.auth(res, user.id);
    }

    async login( res: Response, dto: LoginRequest ) {
        const { username, email, password } = dto;
        const user = await this.prismaService.user.findUnique({
            where: {
                username,
                email,
            },
            select: {
                id: true,
                password: true,
            }
        });

        if(!user) throw new NotFoundException('Пользователь с такими данными не найден');

        const isValidPassword = await verify(user.password, password);

        if (!isValidPassword) {
            throw new NotFoundException('Пользователь не найден');
        }

        // return this.generateTokens(user.id);
        return this.auth(res, user.id);
    }

    async logout( res: Response ) {
        this.setCookies(res, 'refreshToken', new Date(0))
        return true;
    }

    async refresh( req: Request, res: Response) {
        const refreshToken = req.cookies['refreshToken'];

        if(!refreshToken) throw new UnauthorizedException('Недействительный токен');

        const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

        if(payload) {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.id,
                },
                select: {
                    id: true,
                }
            });

            if(!user) throw new NotFoundException('Пользователь не найден');

            return this.auth(res, user.id);
        }
    }
    
    private generateTokens(id: string) {
        const payload:JwtPayload = { id };
        // const payload: string = id;

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL as any,
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL as any,
        });

        return {
            accessToken,
            refreshToken
        }
    }

    private auth( res: Response, id: string ) {
        const { accessToken, refreshToken } = this.generateTokens(id);

        this.setCookies(
            res,
            refreshToken,
            new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        );

        return { accessToken };
    }

    async validate( id: string ) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id
            }
        })

        if(!user) throw new NotFoundException('Пользователь не найден');

        return user
    }

    private setCookies(res: Response, value: string, expires: Date) {
        res.cookie('refreshToken',  value, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
            secure: !isDev(this.configService),
            sameSite: isDev(this.configService) ? 'none' : 'lax',
        });
    }
}
