import React from 'react';
import '../Styles/HomePage.css';
import GameRow from '../components/GameRow';
import PostCard from '../components/PostCard';
import { FaCircle } from 'react-icons/fa';

const trendingGames = [
    { id: 1, title: 'Assassin\'s Creed Mirage', description: 'New Release' },
    { id: 2, title: 'Path of Exile 2', description: 'Upcoming' },
    { id: 3, title: 'Elden Ring', description: 'Popular RPG' },
    { id: 4, title: 'Stray', description: 'Indie Hit' },
];

const hotDiscussions = [
    {
        id: 1,
        author: 'PoE_Master',
        avatarColor: '#5c9d9f',
        timestamp: '1 hour ago',
        content: 'Path of Exile 2: What class are you starting with? I\'m thinking Monk.'
    },
    {
        id: 2,
        author: 'KojimaFan',
        avatarColor: '#dc98a4',
        timestamp: '3 hours ago',
        content: 'DS2 trailer looked amazing. Any theories on what Higgs\' role will be?'
    }
];

const onlineFriends = [
    { id: 1, name: 'Wraeclast' },
    { id: 2, name: 'Porter' },
];

const recommendedForums = [
    { id: 1, name: '# Death Stranding' },
    { id: 2, name: '# Hellblade' },
    { id: 3, name: '# Looking for Group (LFG)' },
];
// ------------------------

function HomePage() {
    return (
        <div>
            <div className="home-layout">

                <main className="home-feed">

                    <div className="welcome-box">
                        <h2>Welcome Back, [User]</h2>
                        <p>Here's what's new in your gaming world.</p>
                    </div>

                    <GameRow title="Trending Games" games={trendingGames} />

                    <h2>Hot Discussions</h2>
                    {hotDiscussions.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}

                </main>

                <aside className="home-sidebar">

                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <h3>Recommended Forums</h3>
                        </div>
                        <ul className="sidebar-card-list">
                            {recommendedForums.map(forum => (
                                <li key={forum.id}>{forum.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-card">
                        <div className="sidebar-card-header">
                            <h3>Online Friends</h3>
                        </div>
                        <ul className="sidebar-card-list">
                            {onlineFriends.map(friend => (
                                <li key={friend.id} className="friend-item">
                                    <div className="friend-info">
                                        <div className="friend-avatar-placeholder"></div>
                                        <span>{friend.name}</span>
                                    </div>
                                    <FaCircle className="friend-status" />
                                </li>
                            ))}
                        </ul>
                    </div>

                </aside>

            </div>
        </div>
    );
}

export default HomePage;