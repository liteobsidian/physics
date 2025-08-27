import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { User, UserTokens } from "../models/index.js";
import { updateTokens, verifyAndRefreshTokens } from "../middlewares/auth.middleware.js";

const router = express.Router();
const authController = new AuthController({ User, UserTokens });

router.post("/register", authController.registerUser.bind(authController));
router.post("/login", authController.loginUser.bind(authController));
router.get("/confirm.register/:token", authController.confirmRegister.bind(authController));
router.get("/update-tokens", updateTokens, (req, res, next) => {
    res.status(200).json({ message: "Токены обновлены" });
});
router.delete("/log-out", updateTokens, authController.logOut.bind(authController));

export default router;
