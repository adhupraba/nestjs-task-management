import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from "./tasks/tasks.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./services/database.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, TasksModule, AuthModule],
})
export class AppModule {}
