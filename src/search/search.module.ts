import { Module } from '@nestjs/common';
import { ConversationsModule } from '../conversations/conversations.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
@Module({ imports: [ConversationsModule], controllers: [SearchController], providers: [SearchService] })
export class SearchModule {}
