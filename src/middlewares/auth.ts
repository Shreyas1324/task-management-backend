import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";
import { UserRepository } from "../repositories/user.repository";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).json({ code: 0, status: "FAIL", message: "AUTH_TOKEN_REQUIRED" });
    return;
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1]!;
  }

  try {
    const payload = verifyAccessToken(token);

    if (!payload?.userId || !payload?.email) {
      res.status(401).json({ code: 0, status: "FAIL", message: "INVALID_PAYLOAD" });
      return;
    }

    const user = await UserRepository.findById(payload.userId);
    if (!user) {
      res.status(401).json({ code: 0, status: "FAIL", message: "USER_NOT_FOUND" });
      return;
    }

    req.user = payload;
    next();
  } catch (err) {
    const error = err as Error;

    switch (error.name) {
      case "TokenExpiredError":
        res.status(401).json({ code: 0, status: "FAIL", message: "TOKEN_EXPIRED" });
        break;
      case "JsonWebTokenError":
        res.status(401).json({ code: 0, status: "FAIL", message: "TOKEN_MALFORMED" });
        break;
      case "NotBeforeError":
        res.status(401).json({ code: 0, status: "FAIL", message: "TOKEN_NOT_ACTIVE_YET" });
        break;
      default:
        next(err);
    }
  }
}
