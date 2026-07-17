import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ResponseHelper } from "../utils/response";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
      };
      const result = await AuthService.register(name, email, password);
      ResponseHelper.success(res, "Registered successfully", result, 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await AuthService.login(email, password);
      ResponseHelper.success(res, "Logged in successfully", result);
    } catch (err) {
      next(err);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      const result = await AuthService.refresh(refreshToken);
      ResponseHelper.success(res, "Token refreshed successfully", result);
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      await AuthService.logout(refreshToken);
      ResponseHelper.success(res, "Logged out successfully", null);
    } catch (err) {
      next(err);
    }
  },
};
