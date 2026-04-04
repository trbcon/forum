import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostService {

    constructor (
            private readonly prismaService: PrismaService, 
            // private readonly configService: ConfigService,
            private readonly eventEmitter: EventEmitter2,
        ) {}

    async create( user, dto: CreateDto ) {
        const { paragraph, text } = dto;

        const authorName = user.username;

        const post = await this.prismaService.post.create({ data: {
            paragraph,
            text,
            author: {
                connect:{
                    username: authorName,
                }
            }
        }});

        return post;
    }

    async toggleLike( user, postId: string ) {
        const userId = user.id;

        const existLike = await this.prismaService.like.findUnique({
            where: {
                userId_postId: { userId, postId }
            }
        });

        const post = await this.prismaService.post.findUnique({
            where: {
                id: postId,
            }
        });

        if (!post) throw new NotFoundException('Такого поста не существует');

        if (existLike) {
            return this.prismaService.like.delete({ where: { id: existLike.id } });
        }

        this.eventEmitter.emit('post.liked', {
            postId,
            username: user.username,
            authorId: post.authorName,
        });

        return this.prismaService.like.create({
            data: { userId, postId }
        });


    }

    async delete( user, postID ) {
        return this.prismaService.post.delete({
            where: {
                id: postID,
            }
        });
    }

    async commentCreate( user, post, dto: CreateCommentDto ) {
        const { text } = dto;

        const authorName = user.username;
        const postID = post.id;

        const comment = await this.prismaService.comment.create({ data: {
            text,

            author: {
                connect:{
                    username: authorName,
                }
            },
            post: {
                connect: {
                    id: postID,
                }
            }
        }});

        return comment;
    }

    async commentDelete( commentID ) {
        return this.prismaService.comment.delete({
            where: {
                id: commentID,
            }
        });
    }
}
