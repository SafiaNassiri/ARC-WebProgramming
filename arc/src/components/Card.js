/**
 * Displays a single game card, typically used in carousels or grids.
 * It shows the game's image, title, and a brief description (like its rating).
 *
 * Props:
 * - game: An object containing game details (id, title, description, imageUrl)
 */

import React from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import '../Styles/Card.css';

function Card({ game }) {
    // Destructure game properties
    const { id, title, description, imageUrl } = game;
    const { favoriteGames, addFavoriteGame, removeFavoriteGame } = useAuth();
    const isFavorited = favoriteGames.some(favGame => favGame.gameId === id);
    const handleToggleFavorite = () => {
        if (isFavorited) {
            removeFavoriteGame(id);
        } else {
            addFavoriteGame({ 
                gameId: id, 
                title: title, 
                imageUrl: imageUrl, 
                description: description 
            });
        }
    };

    // Use a placeholder if the game has no background image
    const displayImage = imageUrl || 'https.via.placeholder.com/400x300?text=No+Image';
    return (
        <article className="game-card" key={id}>
            <div className="game-card-image-container">
                <img
                    src={displayImage}
                    alt={title || 'Game poster'}
                    className="game-card-image"
                />
            </div>
            <div className="game-card-content">
                <h3 className="game-card-title">{title || 'Game Title'}</h3>
                <p className="game-card-description">{description || 'No rating available'}</p>

                <button
                    className="game-card-favorite-btn"
                    onClick={handleToggleFavorite}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorited ? <FaHeart /> : <FaRegHeart />}
                </button>

            </div>
        </article>
    );
}

export default Card;