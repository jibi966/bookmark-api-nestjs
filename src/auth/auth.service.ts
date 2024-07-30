import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthTypes } from "./types";
import * as argon2 from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
// import { User, Bookmark } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(body: AuthTypes) {
    try {
      const hash = await argon2.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          hashedPassword: hash,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // if dupliucate occures
          throw new ForbiddenException("Invalid Credentials");
        }
      }
      throw error;
    }
  }
  async signin(body: AuthTypes) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new ForbiddenException("Incorrect Credentials");
    }
    // eslint-disable-next-line prettier/prettier
    const passwordMatches = await argon2.verify(user.hashedPassword, body.password);
    if (!passwordMatches) {
      throw new ForbiddenException("Incorrect Credentials");
    }
    return user;
  }
}
