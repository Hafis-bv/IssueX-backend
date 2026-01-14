import { Request, Response, Router } from "express";
import {
  forgot,
  login,
  logout,
  register,
  reset,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, (req: Request, res: Response) => {
  return res.json({ user: req.user });
});
router.post("/forgot-password", forgot);
router.post("/reset-password", reset);

export { router as authRouter };
