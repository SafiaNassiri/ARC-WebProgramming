import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Correct path assumed
import '../Styles/Card.css'; // Adjust path if needed
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function Card({ game }) {
    // --- MOVED HOOK CALL TO THE TOP ---
    // Get the data and functions BEFORE any conditional returns
    const {
        isAuthenticated,
        addFavoriteGame,
        removeFavoriteGame,
        favoriteGames
    } = useAuth();

    // Now it's safe to have an early return if 'game' is missing
    if (!game) {
        return (
            <div className="card">
                <div className="card-content">
                    <p className="card-description">Error: Game data missing.</p>
                </div>
            </div>
        );
    }

    // Check if this game is already in our favorites list
    const isFavorite = favoriteGames.some(favGame => favGame.gameId === game.id?.toString());

    // --- (Rest of the component remains the same) ---

    const placeholderImage = "https://placehold.co/400x225/5c9d9f/FFFFFF?text=A.R.C.";
    const displayImage = game.imageUrl || game.image || placeholderImage;
    const title = game.title || game.name || "Untitled Game";
    const description = game.description;

    const handleFavoriteClick = () => {
        if (!isAuthenticated) {
            console.log("Please log in to favorite games.");
            return;
        }
        if (!game.id) {
            console.error("Cannot favorite game: Missing game ID.");
            return;
        }

        if (isFavorite) {
            removeFavoriteGame(game.id.toString());
        } else {
            addFavoriteGame({
                gameId: game.id.toString(),
                name: game.title || game.name || "Unknown Game",
                image: game.imageUrl || game.image || placeholderImage
            });
        }
    };

    return (
        <div className="card">
            {isAuthenticated && (
                <button
                    className="favorite-btn"
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite ? <FaHeart className="icon-filled" /> : <FaRegHeart className="icon-empty" />}
                </button>
            )}

            <div
                className="card-image"
                style={{ backgroundImage: `url(${displayImage})` }}
                role="img"
                aria-label={title}
            >
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                {description && <p className="card-description">{description}</p>}
            </div>
        </div>
    );
}

export default Card;

