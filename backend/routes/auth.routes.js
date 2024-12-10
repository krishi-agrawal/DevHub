import express from "express"
import {signup, login, logout, getme} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", protectRoute, getme)

export default router