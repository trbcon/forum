import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor( private readonly prismaService: PrismaService ) {}

    async getUser( username: string ) {
        const user = await this.prismaService.user.findUnique({
            where: { username },
        });

        return user;
    }

    async getUserPosts( username: string ) {
        const user = await this.prismaService.user.findUnique({
            where: { username },
            include: { posts: true }
        });

        if (!user) throw new NotFoundException('Пользователь не найден');
        return user.posts;
    }
    
    async getUserLikes( username: string ) {
        const user = await this.prismaService.user.findUnique({
            where: { username },
            include: { likes: true }
        });

        if (!user) throw new NotFoundException('Пользователь не найден');
        return user.likes;
    }
}
