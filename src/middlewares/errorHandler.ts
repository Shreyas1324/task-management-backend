import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = statusCode < 500 ? err.message : "INTERNAL_SERVER_ERROR";

  if (statusCode >= 500) {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    console.error(`[ERROR] [${timestamp}] ${req.method}:${req.originalUrl}`);
    console.error(`        Message : ${err.message}`);
    console.error(`        Stack   : ${err.stack}`);
  }

  res.status(statusCode).json({ code: 0, status: "FAIL", message });
}
