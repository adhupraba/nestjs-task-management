import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../types/task-status.enum";

export class TastStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [TaskStatus.OPEN, TaskStatus.IN_PORGRESS, TaskStatus.DONE];

  transform(value: any, metadata: ArgumentMetadata) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`'${value}' is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
}
