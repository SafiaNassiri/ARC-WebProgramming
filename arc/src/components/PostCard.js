/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Displays an individual post with full interaction capabilities:
 * - Like/unlike functionality
 * - Comment section with add/delete
 * - Delete post (if user is owner)
 */

import React, { useState } from "react";
import { FaHeart, FaCommentAlt, FaTrash, FaPaperPlane } from "react-icons/fa";
import "../Styles/PostCard.css";

function PostCard({
  post,
  currentUserId,
  onDelete,
  onLike,
  onAddComment,
  onDeleteComment,
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Get username - handle both username and name fields
  const getUsername = (user) => {
    return user?.username || user?.name || "Unknown User";
  };

  // Check if current user has liked this post
  const isLiked = post.likes?.some((like) => {
    const likeId = typeof like === "string" ? like : like._id || like.id;
    return likeId === currentUserId;
  });
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  // Check if current user is the post author
  const postAuthorId = post.user?._id || post.user?.id;
  const isOwner = postAuthorId && postAuthorId === currentUserId;

  // Generate a color based on username (consistent avatar color)
  const getAvatarColor = (user) => {
    const colors = [
      "#c13d50",
      "#5c9d9f",
      "#dc98a4",
      "#8b5a8e",
      "#4a7c8e",
      "#c17d3d",
    ];
    const username = getUsername(user);
    if (!username || username === "Unknown User") return colors[0];
    const index = username
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Format date to relative time
  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return postDate.toLocaleDateString();
  };

  const handleLike = () => {
    onLike(post._id);
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    try {
      setSubmittingComment(true);
      await onAddComment(post._id, commentContent);
      setCommentContent("");
      setShowComments(true);
    } catch (err) {
      console.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post._id);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      onDeleteComment(post._id, commentId);
    }
  };

  return (
    <article
      className="post-card"
      aria-label={`Post by ${getUsername(post.user)}`}
    >
      <header className="post-card-header">
        <div
          className="post-card-avatar"
          style={{ backgroundColor: getAvatarColor(post.user) }}
          aria-hidden="true"
        ></div>

        <div className="post-card-author-info">
          <span className="post-card-author">{getUsername(post.user)}</span>
          <time className="post-card-timestamp" dateTime={post.date}>
            {formatTimestamp(post.date)}
          </time>
        </div>

        {isOwner && (
          <button
            type="button"
            className="post-delete-button"
            onClick={handleDeletePost}
            aria-label="Delete post"
            title="Delete post"
          >
            <FaTrash />
          </button>
        )}
      </header>

      <div className="post-card-content">
        <p>{post.content}</p>
      </div>

      <footer className="post-card-footer">
        <button
          type="button"
          className={`post-card-button ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
        >
          <FaHeart aria-hidden="true" />
          <span>
            {likeCount > 0
              ? `${likeCount} ${likeCount === 1 ? "Like" : "Likes"}`
              : "Like"}
          </span>
        </button>
        <button
          type="button"
          className={`post-card-button ${showComments ? "active" : ""}`}
          onClick={() => setShowComments(!showComments)}
          aria-label="Toggle comments"
        >
          <FaCommentAlt aria-hidden="true" />
          <span>
            {commentCount > 0
              ? `${commentCount} ${commentCount === 1 ? "Comment" : "Comments"}`
              : "Comment"}
          </span>
        </button>
      </footer>

      {showComments && (
        <div className="comments-section">
          <div className="add-comment">
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows="2"
              disabled={submittingComment}
            />
            <button
              className="comment-submit-button"
              onClick={handleCommentSubmit}
              disabled={submittingComment || !commentContent.trim()}
            >
              <FaPaperPlane />
              <span>{submittingComment ? "Sending..." : "Send"}</span>
            </button>
          </div>

          <div className="comments-list">
            {commentCount === 0 ? (
              <p className="no-comments">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <div
                      className="comment-avatar"
                      style={{ backgroundColor: getAvatarColor(comment.user) }}
                    ></div>
                    <div className="comment-info">
                      <span className="comment-author">
                        {getUsername(comment.user)}
                      </span>
                      <time className="comment-timestamp">
                        {formatTimestamp(comment.date)}
                      </time>
                    </div>
                    {(comment.user?._id === currentUserId ||
                      comment.user?.id === currentUserId) && (
                      <button
                        className="comment-delete-button"
                        onClick={() => handleDeleteComment(comment._id)}
                        aria-label="Delete comment"
                        title="Delete comment"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default PostCard;
