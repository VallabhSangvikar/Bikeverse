import express from "express";
import {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  deletePost,
} from "../controllers/postsController";

const router = express.Router();

// Create a new post
router.post("/", createPost);

// Get all posts
router.get("/", getAllPosts);

// Like/unlike a post
router.put("/:id/like", likePost);

// Comment on a post
router.post("/:id/comment", commentOnPost);

// Delete a post
router.delete("/:id", deletePost);

export default router;
