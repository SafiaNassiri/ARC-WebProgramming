import React, { useState } from 'react';
import Card from '../components/Card';
import PostCard from '../components/PostCard';
import '../Styles/ProfilePage.css';

import { FaGamepad, FaTrophy, FaPenSquare, FaCheckCircle } from 'react-icons/fa';

// Placeholder Data
const myLibrary = [
    { id: 1, title: 'Path of Exile', description: '3000+ Hours' },
    { id: 2, title: 'Death Stranding', description: 'All Achievements' },
    { id: 3, title: 'Assassin\'s Creed Mirage', description: '100% Sync' },
    { id: 4, title: 'Hellblade: Senua\'s Sacrifice', description: 'Completed' },
];

const myAchievements = [
    { id: 1, title: 'Wraeclast Wanderer', game: 'Path of Exile' },
    { id: 2, title: 'Great Deliverer', game: 'Death Stranding' },
    { id: 3, title: 'The Last Hidden One', game: 'AC: Mirage' },
    { id: 4, title: 'Platinum', game: 'Elden Ring' },
];

const myPosts = [
    {
        id: 1,
        author: 'YourGamerTag',
        avatarColor: 'var(--accent-primary)',
        timestamp: '2 days ago',
        content: 'Finally got the platinum for Elden Ring. What a masterpiece. That last boss was something else!'
    }
];

function ProfilePage() {
    const [activeTab, setActiveTab] = useState('library');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'library':
                return (
                    <div className="profile-game-library">
                        {myLibrary.map(game => (
                            <Card
                                key={game.id}
                                title={game.title}
                                description={game.description}
                            />
                        ))}
                    </div>
                );
            case 'achievements':
                return (
                    <div className="achievements-grid">
                        {myAchievements.map(ach => (
                            <div key={ach.id} className="achievement-card">
                                <FaCheckCircle className="achievement-icon" />
                                <div className="achievement-info">
                                    <h3 className="achievement-title">{ach.title}</h3>
                                    <p className="achievement-game">{ach.game}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'posts':
                return (
                    <div className="my-posts-feed">
                        {myPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="profile-header">
                <div className="profile-avatar"></div>
                <div className="profile-info">
                    <h1 className="profile-username">YourGamerTag</h1>
                    <p className="profile-bio">
                        Lover of ARPGs and story-heavy games.
                        Tracking my journey across all platforms.
                    </p>
                </div>
            </div>

            <nav className="profile-tabs">
                <button
                    className={`profile-tab-button ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => setActiveTab('library')}
                >
                    <FaGamepad /> <span>Game Library</span>
                </button>
                <button
                    className={`profile-tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                >
                    <FaTrophy /> <span>Achievements</span>
                </button>
                <button
                    className={`profile-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <FaPenSquare /> <span>My Posts</span>
                </button>
            </nav>

            <div className="profile-tab-content">
                {renderTabContent()}
            </div>

        </div>
    );
}

export default ProfilePage;