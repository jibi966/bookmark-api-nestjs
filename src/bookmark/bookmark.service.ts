import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmark, EditBookmark } from "./types";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmark) {}

  async getBookmarks(userId: number) {}

  async getBookmarksById(userId: number, bookmarkId: number) {}

  async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmark) {}

  async deleteBookmarkById(userId: number, bookmarkId: number) {}
}
