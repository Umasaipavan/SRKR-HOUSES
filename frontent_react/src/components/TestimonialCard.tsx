import React, { useState } from 'react';
import { Repeat } from 'lucide-react';

export function TestimonialCard({ image, quote, author, position, className = '', style = {}, isInteractive = true }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e) => {
    if (!isInteractive) return;
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`gallery-card ${isFlipped ? 'flipped' : ''} ${className}`}
      style={style}
    >
      <div className="gallery-card-inner">
        <div className="gallery-card-front">
          <div className="gallery-card-content">
            <div className="gallery-card-image w-20 h-20 mb-6">
              <img
                src={image}
                alt={author}
                className="w-full h-full object-cover"
              />
            </div>
            <blockquote className="gallery-card-quote mb-6">{quote}</blockquote>
            <div>
              <cite className="gallery-card-author block not-italic">{author}</cite>
              <span className="gallery-card-position">{position}</span>
            </div>
            {isInteractive && (
              <button 
                className="gallery-card-flip-button"
                onClick={handleFlip}
                aria-label="Flip card"
              >
                <Repeat className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="gallery-card-back">
          <div className="gallery-card-content flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white mb-4">About {author}</h3>
            <p className="text-gray-300 mb-6">
              {position} with extensive experience in digital banking and financial technology.
            </p>
            <div className="space-y-2 text-left w-full">
              <p className="text-purple-300">• Industry Expert</p>
              <p className="text-purple-300">• Digital Innovation Leader</p>
              <p className="text-purple-300">• Financial Technology Advocate</p>
            </div>
            {isInteractive && (
              <button 
                className="gallery-card-flip-button"
                onClick={handleFlip}
                aria-label="Flip card back"
              >
                <Repeat className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}