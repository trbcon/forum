import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class PostService {

    constructor (
            private readonly prismaService: PrismaService, 
            // private readonly configService: ConfigService,
        ) {}

    async create( user, dto: CreateDto ) {
        const { paragraph, text } = dto;

        const authorName = 'k';

        const post = await this.prismaService.post.create({ data: {
            paragraph,
            text,
            likes: 0,

            author: {
                connect:{
                    username: authorName,
                }
            }
        }});

        return post;
    }

    async like( post ) {
        return null;
    }

    async delete( post ) {
        return null;
    }

    async commentCreate( user, post) {
        return null;
    }

    async commentDelete( user, post) {
        return null;
    }
}
