import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
    constructor () {}

    @OnEvent('post.liked')
    handlePostLikedEvent( payload: any ) {
        console.log(`${payload.authorId}, твой пост лайкнул ${payload.username}`);
    }

    @OnEvent('comment.new')
    handleNewComment( payload: any ) {
        console.log(`${payload.selfName}, твой пост ${payload.postName} прокоментировал пользователь ${payload.username}: ${payload.postName}`);
    }
}
