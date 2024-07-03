import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  signup(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signup(authCredentialsDto);
  }

  @Post("/signin")
  signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
    return this.authService.signin(authCredentialsDto);
  }
}
