import { Request, Response, Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, (req: Request, res: Response) => {
  return res.json({ user: req.user });
});

export { router as authRouter };
