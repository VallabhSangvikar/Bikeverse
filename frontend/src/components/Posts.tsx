import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  _id: string;
  user: string;
  username: string;
  profilePic?: string;
  title: string;
  caption: string;
  image: string;
  likes: string[];
  comments: { user: string; username: string; text: string }[];
}

// Mock user object (Replace with real authentication data)
const currentUser = {
  _id: "67bb166bef444c03d2fa4213",
  username: "John Doe",
  profilePic: "https://www.google.com/imgres?q=profile%20picture%20placeholder&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F7%2F7c%2FProfile_avatar_placeholder_large.png%3F20150327203541&imgrefurl=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AProfile_avatar_placeholder_large.png&docid=xZyB11jLps67TM&tbnid=gp8LDHLwxDk-WM&vet=12ahUKEwiMnNSYl9yLAxWPSWwGHSQmB_YQM3oECBcQAA..i&w=360&h=360&hcb=2&ved=2ahUKEwiMnNSYl9yLAxWPSWwGHSQmB_YQM3oECBcQAA",
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", caption: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts.");
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await axios.put(`http://localhost:3000/api/posts/${postId}/like`, {
        userId: currentUser._id,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(currentUser._id)
                  ? post.likes.filter((id) => id !== currentUser._id)
                  : [...post.likes, currentUser._id],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText[postId]?.trim()) return;
    try {
      const newComment = {
        user: currentUser._id,
        username: currentUser.username,
        text: commentText[postId],
      };

      await axios.post(`http://localhost:3000/api/posts/${postId}/comment`, newComment);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        )
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" })); // Clear input field
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.title || !newPost.caption || !newPost.image) {
      console.error("❌ Error: All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const postData = {
        user: currentUser._id,
        username: currentUser.username,
        profilePic: currentUser.profilePic,
        ...newPost,
      };

      await axios.post("http://localhost:3000/api/posts", postData);
      setNewPost({ title: "", caption: "", image: "" });
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      console.error("❌ Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 New Delete Post Function
  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId)); // Remove post from UI
    } catch (error) {
      console.error("❌ Error deleting post:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Community Posts</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Create Post"}
        </button>
      </div>

      {/* New Post Form */}
      {showForm && (
        <div className="p-4 bg-white rounded-lg shadow-md border mb-6">
          <h2 className="text-lg font-semibold mb-2">Create a New Post</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded-md my-2"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Caption"
            className="w-full p-2 border rounded-md my-2"
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-2 border rounded-md my-2"
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
            onClick={handlePostSubmit}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Posts List */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="bg-white shadow-md rounded-lg p-4 mb-4 border">
            {/* User Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={"https://www.google.com/imgres?q=profile%20picture%20placeholder&imgurl=https%3A%2F%2Fas1.ftcdn.net%2Fv2%2Fjpg%2F07%2F95%2F95%2F14%2F1000_F_795951406_h17eywwIo36DU2L8jXtsUcEXqPeScBUq.jpg&imgrefurl=https%3A%2F%2Fwww.freevector.com%2Fvector%2Fprofile-placeholder&docid=O5_Ts2yzmY0cEM&tbnid=qiCV3fgQUJKWfM&vet=12ahUKEwiMnNSYl9yLAxWPSWwGHSQmB_YQM3oECBoQAA..i&w=1000&h=1000&hcb=2&ved=2ahUKEwiMnNSYl9yLAxWPSWwGHSQmB_YQM3oECBoQAA"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <h3 className="text-lg font-semibold">{post.username}</h3>
              </div>

              {/* 🗑 Delete Button (Only for Post Owner) */}
              {post.user === currentUser._id && (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeletePost(post._id)}
                >
                  🗑 Delete
                </button>
              )}
            </div>

            {/* Post Content */}
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.caption}</p>
            {post.image && <img src={post.image} alt="Post" className="w-full rounded-md my-3" />}

            {/* Actions */}
            <div className="flex items-center space-x-4 text-gray-600">
              <button
                className="flex items-center space-x-1 hover:text-blue-500"
                onClick={() => handleLike(post._id)}
              >
                👍 <span>{post.likes.length}</span>
              </button>
              <button
                className="flex items-center space-x-1 hover:text-green-500"
                onClick={() => setExpandedPostId(expandedPostId === post._id ? null : post._id)}
              >
                💬 <span>{post.comments.length}</span>
              </button>
            </div>

            {/* Comment Section */}
            {expandedPostId === post._id && (
              <div className="mt-2 p-2 border rounded-md bg-gray-100">
                {post.comments.map((comment, index) => (
                  <div key={index} className="p-1 border-b">
                    <strong>{comment.username}:</strong> {comment.text}
                  </div>
                ))}

                <input
                  type="text"
                  className="w-full p-2 border rounded-md mt-2"
                  placeholder="Write a comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleComment(post._id)}
                />
              </div>
            )}
          </div> // 
        ))
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}

            
    </div>
  );
};

export default Posts;
