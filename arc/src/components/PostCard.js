/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Displays an individual post within the A.R.C. community feed.
 * Each post includes:
 *  - Author info (name + avatar color)
 *  - Timestamp of the post
 *  - Post content
 *  - Action buttons (Like & Comment)
 */

import React from 'react';
import { FaHeart, FaCommentAlt } from 'react-icons/fa';
import '../Styles/PostCard.css';

// Renders a post card with author, timestamp, and post content. Includes placeholder buttons for future interactions.
function PostCard({ post }) {
    const { author, avatarColor, timestamp, content } = post;

    return (
        <article className="post-card" aria-label={`Post by ${author}`}>
            <header className="post-card-header">
                <div
                    className="post-card-avatar"
                    style={{ backgroundColor: avatarColor || 'var(--accent-primary)' }}
                    aria-hidden="true"
                ></div>

                <div className="post-card-author-info">
                    <span className="post-card-author">{author}</span>
                    <time className="post-card-timestamp" dateTime={timestamp}>
                        {timestamp}
                    </time>
                </div>
            </header>
            <div className="post-card-content">
                <p>{content}</p>
            </div>
            <footer className="post-card-footer">
                <button
                    type="button"
                    className="post-card-button"
                    aria-label="Like this post"
                >
                    <FaHeart aria-hidden="true" /> <span>Like</span>
                </button>
                <button
                    type="button"
                    className="post-card-button"
                    aria-label="Comment on this post"
                >
                    <FaCommentAlt aria-hidden="true" /> <span>Comment</span>
                </button>
            </footer>
        </article>
    );
}

export default PostCard;
