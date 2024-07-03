import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./entities/task.entity";
import { TaskStatus } from "./types/task-status.enum";
import { TaskRepository } from "./repositories/task.repository";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User) {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

    if (!found) {
      throw new NotFoundException("Task not found");
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();

    return task;
  }

  async deleteTask(id: number, user: User): Promise<boolean> {
    const res = await this.taskRepository.delete({ id, userId: user.id });

    if (res.affected === 0) {
      throw new NotFoundException("Task not found");
    }

    return true;
  }
}
