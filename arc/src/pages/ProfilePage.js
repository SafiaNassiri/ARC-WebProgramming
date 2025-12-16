/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Functional profile page with Game Library and My Posts
 */

import React, { useState } from "react";
import Card from "../components/Card";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utils/api";
import "../Styles/ProfilePage.css";
import { FaGamepad, FaPenSquare } from "react-icons/fa";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("library");
  const { user, favoriteGames, posts } = useAuth();
  const [uploading, setUploading] = useState(false);

  // Filter posts by current user
  const userPosts = Array.isArray(posts)
    ? posts.filter((post) => {
        const postUserId = post.user?._id || post.user?.id || post.user;
        const currentUserId = user?._id || user?.id;
        return postUserId === currentUserId;
      })
    : [];

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      // Posts will be updated via parent component
      window.location.reload(); // Temporary - ideally update context
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  // Handle like post
  const handleLikePost = async (postId) => {
    try {
      await api.put(`/posts/like/${postId}`);
      // Will be updated via state management
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Handle add comment
  const handleAddComment = async (postId, commentContent) => {
    try {
      await api.post(`/posts/comment/${postId}`, { content: commentContent });
    } catch (err) {
      console.error("Error adding comment:", err);
      throw err;
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.delete(`/posts/comment/${postId}/${commentId}`);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      await api.post("/auth/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload(); // simple refresh
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "library":
        return (
          <div className="profile-game-library">
            {favoriteGames.length > 0 ? (
              favoriteGames.map((game) => (
                <Card
                  key={game.gameId || game.id}
                  game={{
                    id: game.gameId,
                    gameId: game.gameId,
                    title: game.name,
                    imageUrl: game.imageUrl,
                    rating: game.rating,
                    description: game.rating
                      ? `Rating: ${game.rating.toFixed(1)} / 5.0`
                      : "No rating",
                  }}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't added any favorite games yet.</p>
                <p>Go to the Discover page to find and favorite games!</p>
              </div>
            )}
          </div>
        );

      case "posts":
        return (
          <div className="my-posts-feed">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
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
            ) : (
              <div className="empty-state">
                <p>You haven't made any posts yet.</p>
                <p>Go to the Community page to share your thoughts!</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="loading-profile">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {user.avatar ? (
              <img
                src={`http://localhost:5000${user.avatar}`}
                alt="Profile Avatar"
                className="avatar-img"
              />
            ) : (
              <span className="avatar-letter">
                {user.username?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>

          {/* Upload button */}
          <label className="avatar-upload-btn">
            {uploading ? "Uploading..." : "Change Avatar"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              hidden
            />
          </label>
        </div>

        <div className="profile-info">
          <h1 className="profile-username">{user.username}</h1>

          <p className="profile-bio">
            {user.bio || "No bio yet. Add one in Settings!"}
          </p>

          <p className="profile-join-date">
            Joined {formatJoinDate(user.date)}
          </p>

          <div className="profile-stats">
            <span className="stat">
              <strong>{favoriteGames.length}</strong> Games
            </span>
            <span className="stat-divider">•</span>
            <span className="stat">
              <strong>{userPosts.length}</strong> Posts
            </span>
          </div>
        </div>
      </div>

      <nav className="profile-tabs">
        <button
          className={`profile-tab-button ${
            activeTab === "library" ? "active" : ""
          }`}
          onClick={() => setActiveTab("library")}
        >
          <FaGamepad />
          <span>Game Library</span>
          <span className="tab-count">({favoriteGames.length})</span>
        </button>
        <button
          className={`profile-tab-button ${
            activeTab === "posts" ? "active" : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          <FaPenSquare />
          <span>My Posts</span>
          <span className="tab-count">({userPosts.length})</span>
        </button>
      </nav>

      <div className="profile-tab-content">{renderTabContent()}</div>
    </div>
  );
}

export default ProfilePage;
