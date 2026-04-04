import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor( private readonly prismaService: PrismaService ) {}

    async getUser() {}

    async getUserPosts() {}
    
    async getUserLikes() {}
}
