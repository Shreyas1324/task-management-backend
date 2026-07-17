import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  taskIdSchema,
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
} from "../validators/task.validator";

const router = Router();

router.use(authenticate);

router.post("/", validate(createTaskSchema), TaskController.create);
router.get("/", validate(listTasksSchema, "query"), TaskController.getAll);
router.put("/:id", validate(taskIdSchema, "params"), validate(updateTaskSchema), TaskController.update);
router.delete("/:id", validate(taskIdSchema, "params"), TaskController.delete);

export default router;
