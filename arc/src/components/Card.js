import React, { useState } from "react";
import { FaRegHeart, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import "../Styles/Card.css";

function Card({ game }) {
  const { id, _id, title, name, description, imageUrl } = game;
  const gameId = game.gameId || id || _id; // ensure matches favoriteGames
  const { favoriteGames, addFavoriteGame, removeFavoriteGame } = useAuth();

  const [tooltipMessage, setTooltipMessage] = useState("");
  const [showTooltipFlag, setShowTooltipFlag] = useState(false);

  const isFavorited = favoriteGames.some(
    (favGame) => (favGame.gameId || favGame.id) === gameId
  );

  const displayTitle = title || name || "Game Title";

  const showTooltip = (msg) => {
    setTooltipMessage(msg);
    setShowTooltipFlag(true);
    setTimeout(() => setShowTooltipFlag(false), 2500);
  };

  // Add to favorites
  const handleFavorite = async () => {
    if (!isFavorited) {
      try {
        await addFavoriteGame(game);
        showTooltip("Added to favorites!");
      } catch (err) {
        console.error(err);
        showTooltip("Failed to add favorite!");
      }
    }
  };

  // Remove from favorites
  const handleRemove = async () => {
    try {
      await removeFavoriteGame(gameId);
      showTooltip("Removed from favorites!");
    } catch (err) {
      console.error(err);
      showTooltip("Failed to remove favorite!");
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

        <button
          className="game-card-remove-btn"
          onClick={handleRemove}
          aria-label="Remove from favorites"
        >
          <FaTimes color="red" />
        </button>
      </div>

      <div className="game-card-content">
        <h3 className="game-card-title">{displayTitle}</h3>
        <p className="game-card-description">
          {description || "No description available"}
        </p>

        {!isFavorited && (
          <button
            className="game-card-favorite-btn"
            onClick={handleFavorite}
            aria-label="Add to favorites"
          >
            <FaRegHeart />
          </button>
        )}

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
