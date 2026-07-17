import { Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { AuthRequest } from "../middlewares/auth";
import { ResponseHelper } from "../utils/response";

export const TaskController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.create(req.user!.userId, req.body);
      ResponseHelper.success(res, "Task created successfully", task, 201);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, completed } = req.query as unknown as {
        page: number;
        limit: number;
        search?: string;
        completed?: boolean;
      };
      const result = await TaskService.getAll(req.user!.userId, { page, limit, search, completed });
      ResponseHelper.success(res, "Tasks fetched successfully", result, 200, result.pagination.total);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.update(req.params.id, req.user!.userId, req.body);
      ResponseHelper.success(res, "Task updated successfully", task);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await TaskService.delete(req.params.id, req.user!.userId);
      ResponseHelper.success(res, "Task deleted successfully", null);
    } catch (err) {
      next(err);
    }
  },
};
