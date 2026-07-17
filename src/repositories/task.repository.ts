import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";

export const TaskRepository = {
  findByIdAndUser(id: string, userId: string) {
    return AppDataSource.getRepository(Task).findOne({ where: { id, userId } });
  },

  save(data: Partial<Task>) {
    const repo = AppDataSource.getRepository(Task);
    return repo.save(repo.create(data));
  },

  update(task: Task, data: Partial<Task>) {
    const repo = AppDataSource.getRepository(Task);
    return repo.save(Object.assign(task, data));
  },

  remove(task: Task) {
    return AppDataSource.getRepository(Task).remove(task);
  },

  async findByUser(
    userId: string,
    options: {
      page: number;
      limit: number;
      search?: string;
      completed?: boolean;
    }
  ) {
    const { page, limit, search, completed } = options;

    const query = AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .where("task.userId = :userId", { userId })
      .orderBy("task.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.andWhere("LOWER(task.title) LIKE LOWER(:search)", {
        search: `%${search}%`,
      });
    }

    if (completed !== undefined) {
      query.andWhere("task.completed = :completed", { completed });
    }

    return query.getManyAndCount();
  },

  async hasDuplicateIncompleteTitle(userId: string, title: string, excludeId?: string): Promise<boolean> {
    const query = AppDataSource.getRepository(Task)
      .createQueryBuilder("task")
      .where("task.userId = :userId", { userId })
      .andWhere("task.completed = :completed", { completed: false })
      .andWhere("LOWER(task.title) = LOWER(:title)", { title: title.trim() });

    if (excludeId) {
      query.andWhere("task.id != :excludeId", { excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  },
};
