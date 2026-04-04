import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser( @Param('id') userId: string ) {
    return ;
  }

  @Get(':id/posts')
  async getUserPosts( @Param('id') userId: string ) {
    return ;
  }

  @Get(':id/likes')
  async getUserLikes( @Param('id') userId: string ) {
    return ;
  }
}
