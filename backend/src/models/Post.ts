import mongoose, { Schema, Document } from "mongoose";

// Define TypeScript interface for Post
export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  username: string;
  profilePic?: string;
  title: string;
  caption: string;
  image: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    username: string;
    text: string;
    createdAt: Date;
  }[];
}

const PostSchema = new Schema<IPost>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true, trim: true },
    profilePic: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    caption: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true, trim: true },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
 
export const Post = mongoose.model<IPost>("Post", PostSchema);
