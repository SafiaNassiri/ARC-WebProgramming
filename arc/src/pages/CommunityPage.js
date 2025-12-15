/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Community page with functional forum filtering
 */

import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import "../Styles/CommunityPage.css";
import PostCard from "../components/PostCard";
import { FaImage, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const FORUMS = [
  "General Discussion",
  "Looking for Group (LFG)",
  "Path of Exile",
  "Death Stranding",
  "Off-Topic",
];

function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [selectedForum, setSelectedForum] = useState("General Discussion");
  const [activeForum, setActiveForum] = useState("All"); // For filtering view
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts when component mounts or when active forum changes
  useEffect(() => {
    fetchPosts();
  }, [activeForum]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = activeForum !== "All" ? { forum: activeForum } : {};
      const res = await api.get("/posts", { params });
      console.log("Fetched posts from API:", res.data);
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
        forum: selectedForum,
      });

      console.log("New post created:", res.data);

      // Add new post to the list if it matches current filter
      if (activeForum === "All" || activeForum === selectedForum) {
        setPosts([res.data, ...posts]);
      }

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

      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, comments: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleForumClick = (forum) => {
    setActiveForum(forum);
  };

  return (
    <main className="community-page">
      <header className="community-header">
        <h1>Community Feed</h1>
        {activeForum !== "All" && (
          <p className="active-forum-label">
            Viewing: <strong>{activeForum}</strong>
            <button
              className="clear-filter-btn"
              onClick={() => setActiveForum("All")}
            >
              Show All
            </button>
          </p>
        )}
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
            <div className="post-forum-selector">
              <label htmlFor="forum-select">Forum:</label>
              <select
                id="forum-select"
                value={selectedForum}
                onChange={(e) => setSelectedForum(e.target.value)}
                className="forum-select"
              >
                {FORUMS.map((forum) => (
                  <option key={forum} value={forum}>
                    {forum}
                  </option>
                ))}
              </select>
            </div>
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
              {activeForum === "All"
                ? "No posts yet. Be the first to start a discussion!"
                : `No posts in ${activeForum} yet. Be the first!`}
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
              <li
                className={activeForum === "All" ? "active" : ""}
                onClick={() => handleForumClick("All")}
              >
                # All Posts
              </li>
              {FORUMS.map((forum) => (
                <li
                  key={forum}
                  className={activeForum === forum ? "active" : ""}
                  onClick={() => handleForumClick(forum)}
                >
                  # {forum}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CommunityPage;
