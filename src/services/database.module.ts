import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        url: configService.getOrThrow("DATABASE_URL"),
        entities: [__dirname + "/../**/*.entity.ts"],
        autoLoadEntities: true,
        synchronize: configService.get("DATABASE_SYNC") === "true",
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
