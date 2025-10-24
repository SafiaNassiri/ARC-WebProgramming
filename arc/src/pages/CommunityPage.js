import React from 'react';
import '../Styles/CommunityPage.css';
import PostCard from '../components/PostCard';
import { FaImage, FaPaperPlane } from 'react-icons/fa';

const placeholderPosts = [
    {
        id: 1,
        author: 'GamerDude1998',
        avatarColor: '#c13d50',
        timestamp: '2 hours ago',
        content: 'Just finished the main story for Cyberpunk 2077: Phantom Liberty. What an incredible ride! The new ending is... a lot to process. What did everyone else think?'
    },
    {
        id: 2,
        author: 'PoE_Master',
        avatarColor: '#5c9d9f',
        timestamp: '5 hours ago',
        content: 'Looking for 2 more people to join our league start group for Path of Exile 2! We plan to go hard for the first 48 hours. Must have Discord. PM me!'
    },
    {
        id: 3,
        author: 'KojimaFan',
        avatarColor: '#dc98a4',
        timestamp: '1 day ago',
        content: 'Does anyone else just randomly boot up Death Stranding to deliver a few packages? There is something so relaxing about it.'
    }
];

function CommunityPage() {
    return (
        <div>
            <h1>Community Feed</h1>

            <div className="community-layout">

                <div className="community-feed">

                    <div className="create-post-box">
                        <textarea
                            className="create-post-input"
                            placeholder="Start a discussion..."
                            rows="3"
                        ></textarea>
                        <div className="create-post-actions">
                            <div className="create-post-icons">
                                <button title="Attach Image (coming soon)"><FaImage /></button>
                            </div>
                            <button className="create-post-submit" title="Post (coming soon)">
                                <FaPaperPlane /> <span>Post</span>
                            </button>
                        </div>
                    </div>

                    {placeholderPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}

                </div>

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
        </div>
    );
}

export default CommunityPage;