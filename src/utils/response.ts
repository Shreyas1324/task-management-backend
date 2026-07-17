import { Response } from "express";

export const ResponseHelper = {
  success(res: Response, message: string, data: unknown, statusCode = 200, total?: number): void {
    const payload: Record<string, unknown> = { code: 1, status: "SUCCESS", message, data };
    if (total !== undefined) payload.total = total;
    res.status(statusCode).json(payload);
  },
};
