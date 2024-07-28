import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTypes } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // pipes can be used to convert the string to number for eg> parseIntPipe()
  // other pipes are there
  @Post('signup')
  signup(@Body() body: AuthTypes) {
    console.log(body);
    return this.authService.signup();
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
