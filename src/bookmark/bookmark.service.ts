import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmark, EditBookmark } from "./types";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmark) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({ where: { userId } });
  }

  getBookmarksById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({ where: { id: bookmarkId, userId } });
  }

  async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmark) {
    // find the bookmark
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } });
    // check if the bookmark owns by the user
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // find the bookmark
    const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } });

    // check if the bookmark owns by the user
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }
    await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
  }
}
