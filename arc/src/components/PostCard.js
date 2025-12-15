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
  onForumClick,
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const getUsername = (user) =>
    !user || typeof user === "string"
      ? "Unknown User"
      : user.username ||
        user.name ||
        user.email?.split("@")[0] ||
        "Unknown User";

  const isLiked = post.likes?.some((like) => {
    const likeId = typeof like === "string" ? like : like._id || like.id;
    return likeId === currentUserId;
  });

  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;
  const postAuthorId = post.user?._id || post.user?.id;
  const isOwner = postAuthorId && postAuthorId === currentUserId;

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

  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMins = Math.floor((now - postDate) / 60000);
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

  const handleLike = () => onLike(post._id);
  const handleDeletePost = () =>
    isOwner && window.confirm("Are you sure?") && onDelete(post._id);

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    try {
      setSubmittingComment(true);
      await onAddComment(post._id, commentContent);
      setCommentContent("");
      setShowComments(true);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?"))
      onDeleteComment(post._id, commentId);
  };

  const forumDisplay =
    post.forum && post.forum.trim() !== "" ? post.forum : "General Discussion";

  return (
    <article
      className="post-card"
      aria-label={`Post by ${getUsername(post.user)}`}
    >
      <header className="post-card-header">
        <div className="post-card-header-left">
          <div
            className="post-card-avatar"
            style={{ backgroundColor: getAvatarColor(post.user) }}
          />
          <div className="post-card-author-info">
            <span className="post-card-author">{getUsername(post.user)}</span>
            <div className="post-card-meta">
              <time className="post-card-timestamp" dateTime={post.date}>
                {formatTimestamp(post.date)}
              </time>
            </div>
          </div>
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

      {/* Forum display */}
      <div
        className="post-card-forum"
        onClick={() => forumDisplay && onForumClick?.(forumDisplay)}
        style={{ cursor: forumDisplay ? "pointer" : "default" }}
      >
        Forum: {forumDisplay}
      </div>

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
                    />
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
