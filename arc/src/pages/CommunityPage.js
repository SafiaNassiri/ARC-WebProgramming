/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Displays the Community Feed where users can view posts,
 * create new posts, and interact with the community.
 */

import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import "../Styles/CommunityPage.css";
import PostCard from "../components/PostCard";
import { FaImage, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      console.log("Fetched posts from API:", res.data);
      if (res.data.length > 0) {
        console.log("First post structure:", res.data[0]);
        console.log("First post user:", res.data[0].user);
      }
      setPosts(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/posts", {
        content: postContent,
      });

      console.log("New post created:", res.data);
      console.log("New post user:", res.data.user);

      // Add new post to the top of the list
      setPosts([res.data, ...posts]);
      setPostContent("");
      setError(null);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post.");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await api.put(`/posts/like/${postId}`);

      // Update the post's likes in state
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, likes: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    try {
      const res = await api.post(`/posts/comment/${postId}`, {
        content: commentContent,
      });

      // Update the post's comments in state
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
      throw err;
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await api.delete(`/posts/comment/${postId}/${commentId}`);

      // Update the post's comments in state
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <main className="community-page">
      <header className="community-header">
        <h1>Community Feed</h1>
      </header>

      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            margin: "1rem 0",
            backgroundColor: "var(--error-bg, #fee)",
            color: "var(--error-text, #c00)",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <div className="community-layout">
        <section className="community-feed">
          <div className="create-post-box">
            <textarea
              className="create-post-input"
              placeholder="Start a discussion..."
              rows="3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={submitting}
            ></textarea>
            <div className="create-post-actions">
              <div className="create-post-icons">
                <button title="Attach Image (coming soon)" disabled>
                  <FaImage />
                </button>
              </div>
              <button
                className="create-post-submit"
                onClick={handlePostSubmit}
                disabled={submitting || !postContent.trim()}
                title={submitting ? "Posting..." : "Post"}
              >
                <FaPaperPlane />
                <span>{submitting ? "Posting..." : "Post"}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div
              className="loading-message"
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--text-secondary)",
              }}
            >
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div
              className="no-posts-message"
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--text-secondary)",
              }}
            >
              No posts yet. Be the first to start a discussion!
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id || user?.id}
                onDelete={handleDeletePost}
                onLike={handleLikePost}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
              />
            ))
          )}
        </section>

        <aside className="community-sidebar">
          <div className="groups-card">
            <div className="groups-card-header">
              <h3>Forums</h3>
            </div>
            <ul className="groups-card-list">
              <li># General Discussion</li>
              <li># Looking for Group (LFG)</li>
              <li># Path of Exile</li>
              <li># Death Stranding</li>
              <li># Off-Topic</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CommunityPage;
