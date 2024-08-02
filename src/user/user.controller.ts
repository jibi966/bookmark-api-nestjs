import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";
import { User } from "@prisma/client";
import { UserService } from "./user.service";
import { EditUser } from "./types";

@Controller("users")
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get("me")
  getme(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser("id") userId: number, @Body() dto: EditUser) {
    return this.userService.editUser(userId, dto);
  }
}
