import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Task } from "../entities/Task";
import { UserSession } from "../entities/UserSession";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_management",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  entities: [User, Task, UserSession],
  migrations: ["src/migrations/*.ts"],
});
