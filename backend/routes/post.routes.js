import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  deleteComment,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../controllers/post.controller.js";

const router = express.Router();
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/:id/comment", protectRoute, commentOnPost);
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);
router.post("/:id/like", protectRoute, likeUnlikePost);
router.get("/all", protectRoute, getAllPosts);
router.get("/like/:id", protectRoute, getLikedPosts); //get post liked by a developer
router.get("/following", protectRoute, getFollowingPosts); //get the posts of everyone you are following
router.get("/user/:username", protectRoute, getUserPosts); //get the posts of a user from their username

export default router;
