import { AppDataSource } from "../config/database";
import { UserSession } from "../entities/UserSession";

export const SessionRepository = {
  create(data: { userId: string; refreshToken: string; expiresAt: Date }) {
    const repo = AppDataSource.getRepository(UserSession);
    return repo.save(repo.create(data));
  },

  findByToken(refreshToken: string) {
    return AppDataSource.getRepository(UserSession).findOne({ where: { refreshToken } });
  },

  deleteByToken(refreshToken: string) {
    return AppDataSource.getRepository(UserSession).delete({ refreshToken });
  },
};
