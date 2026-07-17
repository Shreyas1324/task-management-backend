import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export const UserRepository = {
  findByEmail(email: string) {
    return AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
  },

  findById(id: string) {
    return AppDataSource.getRepository(User).findOne({ where: { id } });
  },

  save(data: Partial<User>) {
    const repo = AppDataSource.getRepository(User);
    return repo.save(repo.create(data));
  },
};
