import React from 'react';
import Card from './Card';
import '../Styles/GameRow.css';

function GameRow({ title, games }) {
    return (
        <section className="game-row">
            <h2 className="game-row-title">{title}</h2>
            <div className="game-row-scroll">
                {games.map(game => (
                    <div className="game-row-item" key={game.id}>
                        <Card
                            title={game.title}
                            description={game.description}
                            imageUrl={game.imageUrl}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default GameRow;