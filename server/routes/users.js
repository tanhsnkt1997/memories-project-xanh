import express from "express";
import { signin, signup, refreshToken } from "./../controllers/users.js";


const router = express.Router();
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/refreshToken", refreshToken);

export default router;
