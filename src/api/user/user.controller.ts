import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async getUser( @Param('username') username: string ) {
    return await this.getUser(username);
  }

  @Get(':username/posts')
  async getUserPosts( @Param('username') username: string ) {
    return await this.getUserPosts(username);
  }

  @Get(':username/likes')
  async getUserLikes( @Param('username') username: string ) {
    return await this.getUserLikes(username);
  }
}
