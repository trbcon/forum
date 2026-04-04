import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { Authorization } from 'src/common/decorators/authorization.decorator';
import { Authorizated } from 'src/common/decorators/authorizated.decorator';
// import { CreateCommentDto } from './dto/create.comment.dto';
import { CreateDto } from './dto/create.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Authorization()
  @Post('create')
  async create( @Authorizated() user: any, @Body() dto: CreateDto ) {
    return await this.postService.create(user, dto);
  }

  @Authorization()
  @Delete(':id/delete')
  async delete( @Authorizated() user: any, @Param('id') postID: string ) {
    return await this.postService.delete( user, postID );
  }

  @Authorization()
  @Post(':id/like')
  async like( @Authorizated() user: any, @Param('id') postID: string ) {
    return await this.postService.toggleLike( user.id, postID );
  }
}
