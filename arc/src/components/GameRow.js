/**
 * Displays a horizontally scrollable list of game cards with left/right navigation arrows.
 * Each card represents an individual game object.
 */

import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from './Card';
import '../Styles/GameRow.css';

function GameRow({ title, games = [] }) {
    const scrollContainerRef = useRef(null);
    const scrollLeft = () => { scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' }); };
    const scrollRight = () => { scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' }); };

    // Handle empty or missing game list
    if (games.length === 0) {
        return (
            <section className="game-row">
                <h2 className="game-row-title">{title}</h2>
                <p className="game-row-empty">No games to display.</p>
            </section>
        );
    }

    return (
        <section className="game-row">
            <h2 className="game-row-title">{title}</h2>
            <div className="game-row-wrapper">
                <button
                    className="scroll-arrow left-arrow"
                    onClick={scrollLeft}
                    aria-label="Scroll left"
                >
                    <FaChevronLeft />
                </button>
                <div className="game-row-scroll" ref={scrollContainerRef}>
                    {games.map(({ id, ...game }) => (
                        <div className="game-row-item" key={id}>
                            <Card game={{ id, ...game }} />
                        </div>
                    ))}
                </div>
                <button
                    className="scroll-arrow right-arrow"
                    onClick={scrollRight}
                    aria-label="Scroll right"
                >
                    <FaChevronRight />
                </button>
            </div>
        </section>
    );
}

export default GameRow;
