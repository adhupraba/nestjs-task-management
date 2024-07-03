import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TastStatusValidationPipe } from "./pipes/task-status-validation.pipe";
import { Task } from "./entities/task.entity";
import { TaskStatus } from "./types/task-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/entities/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger(TasksController.name);

  constructor(private tasksService: TasksService) {}

  @Get() // ! if path is not passed it is considered as /tasks/ path
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User) {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get("/:id")
  getTaskById(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post("/")
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Filters ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", TastStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete("/:id")
  deleteTask(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<boolean> {
    return this.tasksService.deleteTask(id, user);
  }
}
