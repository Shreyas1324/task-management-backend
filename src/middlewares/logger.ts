import { Request, Response, NextFunction } from "express";

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    console.log(
      `[${timestamp}] ${req.method}:${req.originalUrl} ${res.statusCode} ${duration}ms body:${JSON.stringify(req.body)}`
    );
  });

  next();
}
