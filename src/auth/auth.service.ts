import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { User, Bookmark } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signin() {
    return { msg: 'signin' };
  }
  signup() {
    return { msg: 'signup' };
  }
}
