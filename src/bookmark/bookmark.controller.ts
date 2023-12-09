import {
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
	constructor(private bookmarkService: BookmarkService) {}

	@Post()
	createBookmark(@GetUser('id') userId: number) {}

	@Get()
	getBookmarks(@GetUser('id') userId: number) {}

	@Get()
	getBookmarkById(@GetUser('id') userId: number) {}

	@Patch()
	editBookmarkById(@GetUser('id') userId: number) {}

	@Delete()
	deleteBookmarkById(@GetUser('id') userId: number) {}
}
