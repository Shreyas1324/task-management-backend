import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { SessionRepository } from "../repositories/session.repository";
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } from "../utils/jwt";

function createError(message: string, statusCode: number): Error {
  return Object.assign(new Error(message), { statusCode });
}

function buildTokens(userId: string, email: string) {
  return {
    accessToken: signAccessToken({ userId, email }),
    refreshToken: signRefreshToken({ userId, email }),
  };
}

export const AuthService = {
  async register(name: string, email: string, password: string) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw createError("Email is already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.save({ name, email, password: hashedPassword });
    const { accessToken, refreshToken } = buildTokens(user.id, user.email);

    await SessionRepository.create({ userId: user.id, refreshToken, expiresAt: getRefreshTokenExpiry() });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw createError("Invalid email or password", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError("Invalid email or password", 401);

    const { accessToken, refreshToken } = buildTokens(user.id, user.email);
    await SessionRepository.create({ userId: user.id, refreshToken, expiresAt: getRefreshTokenExpiry() });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  },

  async refresh(token: string) {
    let payload: { userId: string; email: string };
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      const error = err as Error;
      throw createError(error.name === "TokenExpiredError" ? "REFRESH_TOKEN_EXPIRED" : "REFRESH_TOKEN_INVALID", 401);
    }

    const session = await SessionRepository.findByToken(token);
    if (!session) throw createError("SESSION_NOT_FOUND", 401);

    if (session.expiresAt < new Date()) {
      await SessionRepository.deleteByToken(token);
      throw createError("REFRESH_TOKEN_EXPIRED", 401);
    }

    const accessToken = signAccessToken({ userId: payload.userId, email: payload.email });

    return { accessToken };
  },

  async logout(refreshToken: string) {
    await SessionRepository.deleteByToken(refreshToken);
  },
};
