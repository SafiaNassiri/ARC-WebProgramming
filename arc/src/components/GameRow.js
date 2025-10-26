import React, { useRef } from 'react'; // 1. Import useRef
import Card from './Card';
import '../Styles/GameRow.css'; // Adjust path if needed
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Icons for arrows

function GameRow({ title, games }) {
    // 2. Create a ref to attach to the scrollable div
    const scrollContainerRef = useRef(null);

    // 3. Function to scroll left
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            // Scroll by roughly the width of one card item + gap
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    // 4. Function to scroll right
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (!games || games.length === 0) {
        return (
            <section className="game-row">
                <h2 className="game-row-title">{title}</h2>
                <p>No games to display.</p>
            </section>
        );
    }

    return (
        <section className="game-row">
            <h2 className="game-row-title">{title}</h2>
            {/* 5. Add a wrapper for positioning arrows */}
            <div className="game-row-wrapper">
                {/* 6. Add Left Arrow Button */}
                <button className="scroll-arrow left-arrow" onClick={scrollLeft} aria-label="Scroll left">
                    <FaChevronLeft />
                </button>

                {/* 7. Attach the ref to the scrollable div */}
                <div className="game-row-scroll" ref={scrollContainerRef}>
                    {games.map(game => (
                        <div className="game-row-item" key={game.id}>
                            <Card game={game} />
                        </div>
                    ))}
                </div>

                {/* 8. Add Right Arrow Button */}
                <button className="scroll-arrow right-arrow" onClick={scrollRight} aria-label="Scroll right">
                    <FaChevronRight />
                </button>
            </div>
        </section>
    );
}

export default GameRow;

