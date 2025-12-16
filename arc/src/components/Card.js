/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Updated Card component with filled/empty heart toggle
 */

import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "../Styles/Card.css";

function Card({ game }) {
  const { id, _id, title, name, description, imageUrl, rating } = game;
  const gameId = String(game.gameId || id || _id);
  const { favoriteGames, toggleFavoriteGame, isAuthenticated } = useAuth();

  const [tooltipMessage, setTooltipMessage] = useState("");
  const [showTooltipFlag, setShowTooltipFlag] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Check if this game is in favorites
  const isFavorited = favoriteGames.some(
    (favGame) => String(favGame.gameId || favGame.id) === gameId
  );

  const displayTitle = title || name || "Game Title";

  const showTooltip = (msg) => {
    setTooltipMessage(msg);
    setShowTooltipFlag(true);
    setTimeout(() => setShowTooltipFlag(false), 2500);
  };

  // Toggle favorite status
  const handleHeartClick = async () => {
    if (!isAuthenticated) {
      showTooltip("Please log in to add favorites!");
      return;
    }

    if (isToggling) return; // Prevent double-clicks

    setIsToggling(true);
    try {
      await toggleFavoriteGame({
        id: gameId,
        title: displayTitle,
        imageUrl: imageUrl,
        rating: rating || 0,
      });

      // Show appropriate message
      if (isFavorited) {
        showTooltip("Removed from favorites!");
      } else {
        showTooltip("Added to favorites!");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      showTooltip("Failed to update favorites!");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article className="game-card" key={gameId}>
      <div className="game-card-image-container">
        <img
          src={imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={displayTitle}
          className="game-card-image"
        />

        {/* Heart button - always visible, toggles between filled/empty */}
        <button
          className={`game-card-favorite-btn ${isFavorited ? "favorited" : ""}`}
          onClick={handleHeartClick}
          disabled={isToggling}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isFavorited ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="game-card-content">
        <h3 className="game-card-title">{displayTitle}</h3>
        <p className="game-card-description">
          {description || "No description available"}
        </p>

        {/* Tooltip */}
        {tooltipMessage && (
          <div className={`tooltip ${showTooltipFlag ? "show" : ""}`}>
            {tooltipMessage}
          </div>
        )}
      </div>
    </article>
  );
}

export default Card;
