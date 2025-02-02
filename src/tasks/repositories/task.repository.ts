import { DataSource, Repository } from "typeorm";
import { Task } from "../entities/task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "../types/task-status.enum";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetTasksFilterDto } from "../dto/get-tasks-filter.dto";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger(TaskRepository.name);

  @InjectRepository(Task)
  private readonly taskRepository: Repository<Task>;

  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder("task");

    query.where("task.userId = :userId", { userId: user.id });

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere("(task.title LIKE :search OR task.description LIKE :search)", { search: `%${search}%` });
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        err.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Data: ${JSON.stringify(createTaskDto)}`,
        err.stack
      );
      throw new InternalServerErrorException();
    }

    delete task.user;

    return task;
  }
}
