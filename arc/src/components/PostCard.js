import React from 'react';
import '../Styles/PostCard.css';
import { FaHeart, FaCommentAlt } from 'react-icons/fa';

function PostCard({ post }) {
    const { author, avatarColor, timestamp, content } = post;

    return (
        <div className="post-card">
            <div className="post-card-header">
                <div
                    className="post-card-avatar"
                    style={{ backgroundColor: avatarColor || 'var(--accent-primary)' }}
                ></div>
                <div className="post-card-author-info">
                    <span className="post-card-author">{author}</span>
                    <span className="post-card-timestamp">{timestamp}</span>
                </div>
            </div>
            <div className="post-card-content">
                <p>{content}</p>
            </div>
            <div className="post-card-footer">
                <button className="post-card-button">
                    <FaHeart /> <span>Like</span>
                </button>
                <button className="post-card-button">
                    <FaCommentAlt /> <span>Comment</span>
                </button>
            </div>
        </div>
    );
}

export default PostCard;