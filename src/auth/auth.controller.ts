import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthTypes } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // pipes can be used to convert the string to number for eg> parseIntPipe()
  // other pipes are there
  @Post("signup")
  signup(@Body() body: AuthTypes) {
    return this.authService.signup(body);
  }

  @Post("signin")
  signin(@Body() body: AuthTypes) {
    return this.authService.signin(body);
  }
}
