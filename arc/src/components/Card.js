import React from 'react';
import '../Styles/Card.css';

function Card({ title, description, imageUrl }) {

    const placeholderImage = "https://via.placeholder.com/400x225.png?text=A.R.C.";
    const displayImage = imageUrl || placeholderImage;

    return (
        <div className="card">
            <div
                className="card-image"
                style={{ backgroundImage: `url(${displayImage})` }}
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