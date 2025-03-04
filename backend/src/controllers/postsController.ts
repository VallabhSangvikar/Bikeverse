import { Request, Response } from "express";
import { Post } from "../models/Post"; 

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { user, username, profilePic, title, caption, image } = req.body;

    if (!title || !caption || !image) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newPost = new Post({
      user,
      username,
      profilePic,
      title,
      caption,
      image,
      likes: [],
      comments: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch latest posts first
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Like/unlike a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId); // Like the post
    } else {
      post.likes.splice(index, 1); // Unlike the post
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

// Comment on a post (Fixed `createdAt` issue)
export const commentOnPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user, username, text } = req.body;

    if (!text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty!" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Fix: Added `createdAt` field
    post.comments.push({ user, username, text, createdAt: new Date() });

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error commenting on post", error });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};
