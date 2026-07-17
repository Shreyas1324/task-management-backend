import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { registerSchema, loginSchema, refreshTokenSchema, logoutSchema } from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { authLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), AuthController.register);
router.post("/login", authLimiter, validate(loginSchema), AuthController.login);
router.post("/refresh", validate(refreshTokenSchema), AuthController.refreshToken);
router.post("/logout", validate(logoutSchema), AuthController.logout);

export default router;
