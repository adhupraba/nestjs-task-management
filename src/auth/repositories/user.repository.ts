import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import bcrypt from "bcrypt";

@Injectable()
export class UserRepository extends Repository<User> {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;

      const user = new User();
      user.username = username;
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);

      await user.save();
    } catch (err) {
      console.error("signup error =>", err.message);

      // unique constraint error code
      if (err.code === "23505") {
        throw new ConflictException("Username already exists");
      }

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ where: { username } });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
