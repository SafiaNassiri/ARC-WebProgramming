import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import "../Styles/CommunityPage.css";
import PostCard from "../components/PostCard";
import { FaPaperPlane } from "react-icons/fa";
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
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [selectedForum, setSelectedForum] = useState(FORUMS[0]);
  const [activeForum, setActiveForum] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/posts");
      console.log("Posts fetched:", res.data);
      setAllPosts(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts =
    activeForum === "All"
      ? allPosts
      : allPosts.filter((post) => post.forum === activeForum);

  const handlePostSubmit = async () => {
    if (!postContent.trim()) return;
    try {
      setSubmitting(true);
      console.log("Submitting post to forum:", selectedForum);
      const res = await api.post("/posts", {
        content: postContent,
        forum: selectedForum,
      });
      // Make sure the forum comes back populated
      const newPost = { ...res.data, forum: res.data.forum || selectedForum };
      setAllPosts([newPost, ...allPosts]);
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
      setAllPosts(allPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post.");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await api.put(`/posts/like/${postId}`);
      setAllPosts(
        allPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    const res = await api.post(`/posts/comment/${postId}`, {
      content: commentContent,
    });
    setAllPosts(
      allPosts.map((post) =>
        post._id === postId ? { ...post, comments: res.data } : post
      )
    );
  };

  const handleDeleteComment = async (postId, commentId) => {
    const res = await api.delete(`/posts/comment/${postId}/${commentId}`);
    setAllPosts(
      allPosts.map((post) =>
        post._id === postId ? { ...post, comments: res.data } : post
      )
    );
  };

  return (
    <main className="community-page">
      <header className="community-header">
        <h1>Community Feed</h1>
        <div className="active-forum-label">
          Showing:{" "}
          <strong>{activeForum === "All" ? "All Posts" : activeForum}</strong>
          {activeForum !== "All" && (
            <button
              className="clear-filter-btn"
              onClick={() => setActiveForum("All")}
            >
              Clear Filter
            </button>
          )}
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="community-layout">
        <section className="community-feed">
          <div className="create-post-box">
            <textarea
              placeholder="Start a discussion..."
              rows="3"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={submitting}
            />
            <div className="create-post-actions">
              <select
                value={selectedForum}
                onChange={(e) => setSelectedForum(e.target.value)}
              >
                {FORUMS.map((forum) => (
                  <option key={forum} value={forum}>
                    {forum}
                  </option>
                ))}
              </select>
              <button
                onClick={handlePostSubmit}
                disabled={submitting || !postContent.trim()}
                className="create-post-submit"
              >
                <FaPaperPlane /> Post
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p>
              {activeForum === "All"
                ? "No posts yet."
                : `No posts in ${activeForum} yet.`}
            </p>
          ) : (
            filteredPosts.map((post) => (
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
          <ul>
            <li
              className={activeForum === "All" ? "active" : ""}
              onClick={() => setActiveForum("All")}
            >
              # All Posts
            </li>
            {FORUMS.map((forum) => (
              <li
                key={forum}
                className={activeForum === forum ? "active" : ""}
                onClick={() => setActiveForum(forum)}
              >
                # {forum}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}

export default CommunityPage;
