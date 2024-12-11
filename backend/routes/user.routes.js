import express from "express"
import { getUserProfile, followUnfollowUser, getSuggestedDevelopers, updateProfile } from "../controllers/user.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/suggested", protectRoute, getSuggestedDevelopers)
router.post("/follow/:idx", protectRoute, followUnfollowUser)
router.post("/update", protectRoute, updateProfile)


export default router

// krishi26 yeehaw
// dev_patel 12deev