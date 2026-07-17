import { TaskRepository } from "../repositories/task.repository";

function createError(message: string, statusCode: number): Error {
  return Object.assign(new Error(message), { statusCode });
}

export const TaskService = {
  async create(userId: string, data: { title: string; description?: string; completed?: boolean }) {
    const isCompleted = data.completed ?? false;
    if (!isCompleted) {
      const hasDuplicate = await TaskRepository.hasDuplicateIncompleteTitle(userId, data.title);
      if (hasDuplicate) {
        throw createError("An incomplete task with this title already exists", 409);
      }
    }
    return TaskRepository.save({ ...data, userId });
  },

  async getAll(
    userId: string,
    options: { page: number; limit: number; search?: string; completed?: boolean }
  ) {
    const [tasks, total] = await TaskRepository.findByUser(userId, options);
    const { page, limit } = options;

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(
    id: string,
    userId: string,
    data: { title?: string; description?: string; completed?: boolean }
  ) {
    const task = await TaskRepository.findByIdAndUser(id, userId);
    if (!task) {
      throw createError("Task not found", 404);
    }

    const targetTitle = data.title ?? task.title;
    const targetCompleted = data.completed ?? task.completed;

    if (!targetCompleted) {
      const hasDuplicate = await TaskRepository.hasDuplicateIncompleteTitle(userId, targetTitle, id);
      if (hasDuplicate) {
        throw createError("An incomplete task with this title already exists", 409);
      }
    }

    return TaskRepository.update(task, data);
  },

  async delete(id: string, userId: string) {
    const task = await TaskRepository.findByIdAndUser(id, userId);
    if (!task) {
      throw createError("Task not found", 404);
    }
    await TaskRepository.remove(task);
  },
};
