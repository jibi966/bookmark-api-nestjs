import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { BookmarkService } from "./bookmark.service";
import { GetUser } from "../auth/decorator";
import { CreateBookmark, EditBookmark } from "./types";

@UseGuards(JwtGuard)
@Controller("bookmarks")
export class BookmarkController {
  constructor(private bookmarService: BookmarkService) {}

  @Post()
  createBookmark(@GetUser("id") userId: number, @Body() dto: CreateBookmark) {
    return this.bookmarService.createBookmark(userId, dto);
  }

  @Get()
  getBookmarks(@GetUser("id") userId: number) {
    return this.bookmarService.getBookmarks(userId);
  }

  @Get(":id")
  getBookmarksById(@GetUser("id") userId: number, @Param("id", ParseIntPipe) bookmarkId: number) {
    return this.bookmarService.getBookmarksById(userId, bookmarkId);
  }

  @Patch(":id")
  editBookmarkById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmark,
  ) {
    return this.bookmarService.editBookmarkById(userId, bookmarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  deleteBookmarkById(@GetUser("id") userId: number, @Param("id", ParseIntPipe) bookmarkId: number) {
    return this.bookmarService.deleteBookmarkById(userId, bookmarkId);
  }
}
