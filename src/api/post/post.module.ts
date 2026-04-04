import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { InfraModule } from 'src/infra/infra.module';

@Module({
  imports: [InfraModule], 
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
