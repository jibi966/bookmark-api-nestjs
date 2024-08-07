import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUser } from "./types";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, editUser: EditUser) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...editUser,
      },
    });

    delete user.hashedPassword;
    return user;
  }
}
