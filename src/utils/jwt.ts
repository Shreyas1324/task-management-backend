import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

// ─── Access Token ────────────────────────────────────────────────────────────

const ACCESS_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access_fallback_change_in_production";
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

// ─── Refresh Token ───────────────────────────────────────────────────────────

const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_fallback_change_in_production";
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

export function getRefreshTokenExpiry(): Date {
  const ms = parseDurationMs(REFRESH_EXPIRES_IN);
  return new Date(Date.now() + ms);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseDurationMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1]!);
  const unit = match[2] as "s" | "m" | "h" | "d";
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * multipliers[unit];
}
