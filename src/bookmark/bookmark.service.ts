import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
	constructor(private prisma: PrismaService) {}

	async createBookmark(userId: number, dto: CreateBookmarkDto) {
		const bookmark = this.prisma.bookmark.create({
			data: {
				userId: userId,
				...dto,
			},
		});

		return bookmark;
	}

	async getBookmarks(userId: number) {
		return this.prisma.bookmark.findMany({
			where: {
				userId,
			},
		});
	}

	async getBookmarkById(userId: number, bookmarkId: number) {
		return this.prisma.bookmark.findFirst({
			where: {
				userId,
				id: bookmarkId,
			},
		});
	}

	async editBookmarkById(
		userId: number,
		bookmarkId: number,
		dto: EditBookmarkDto,
	) {
		// get the bookmark by id
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId,
			},
		});

		// check if the user onws the bookmark
		if (!bookmark || bookmark.userId !== userId)
			throw new ForbiddenException('Access to resources denied');

		return this.prisma.bookmark.update({
			where: {
				id: bookmarkId,
			},
			data: {
				...dto,
			},
		});
	}

	async deleteBookmarkById(userId: number, bookmarkId: number) {
		// get the bookmark by id
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId,
			},
		});

		// check if the user onws the bookmark
		if (!bookmark || bookmark.userId !== userId)
			throw new ForbiddenException('Access to resources denied');

		// delete it
		await this.prisma.bookmark.delete({
			where: {
				id: bookmarkId,
			},
		});
	}
}
