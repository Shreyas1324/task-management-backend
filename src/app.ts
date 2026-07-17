import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { httpLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? []
        : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(httpLogger);

app.get("/health", (_req, res) => {
  res.json({ code: 1, status: "SUCCESS", message: "Server is healthy" });
});

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ code: 0, status: "FAIL", message: "ROUTE_NOT_FOUND" });
});

app.use(errorHandler);

export default app;
