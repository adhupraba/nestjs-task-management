import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UserRepository } from "./repositories/user.repository";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./types/jwt-payload.interface";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signup(authCredentialsDto);
  }

  async signin(authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!username) throw new UnauthorizedException("Invalid credentials");

    const payload: JwtPayload = { username };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT token for user "${username}" with payload ${JSON.stringify(payload)}`);

    return { token };
  }
}
