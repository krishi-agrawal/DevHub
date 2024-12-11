import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { createPost, deletePost, commentOnPost, deleteComment, likeUnlikePost} from "../controllers/post.controller.js"

const router = express.Router()
router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
router.post("/:id/comment", protectRoute, commentOnPost)
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment)
router.post("/:id/like", protectRoute, likeUnlikePost)

export default router