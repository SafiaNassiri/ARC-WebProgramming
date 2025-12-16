/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: December 2025
 * Card component for displaying game search results with favorite toggle
 */

import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../Styles/SearchGameCard.css";

function SearchGameCard({
  game,
  isFavorited,
  onAddToFavorites,
  onRemoveFromFavorites,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        await onRemoveFromFavorites(game.id);
      } else {
        await onAddToFavorites(game);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-game-card">
      <div className="search-game-image-wrapper">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            className="search-game-image"
          />
        ) : (
          <div className="search-game-no-image">No Image</div>
        )}
        <button
          className={`favorite-toggle-btn ${isFavorited ? "favorited" : ""}`}
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isFavorited ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="search-game-info">
        <h3 className="search-game-title">{game.title}</h3>
        <p className="search-game-rating">
          {game.rating > 0 ? `⭐ ${game.rating.toFixed(1)} / 5.0` : "Not rated"}
        </p>
      </div>
    </div>
  );
}

export default SearchGameCard;
