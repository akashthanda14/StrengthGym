import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import all images
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';
import img7 from '../assets/7.jpg';
import img8 from '../assets/8.jpg';
import img9 from '../assets/9.jpg';

// Image interface
interface Image {
  src: string;
  caption: string;
}

// Component props
interface AppleCarouselProps {
  autoPlayInterval?: number;
}

const AppleCarousel: React.FC<AppleCarouselProps> = ({ 
  autoPlayInterval = 5000 
}) => {
  const images = [
    { src: img1},
    { src: img2},
    { src: img3},
    { src: img4},
    { src: img5},
    { src: img6},
    { src: img7},
    { src: img8},
    { src: img9},
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsTransitioning(false), 600);
  }, [images.length, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => setIsTransitioning(false), 600);
  }, [images.length, isTransitioning]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  useEffect(() => {
    let interval: number;
    
    if (isAutoPlaying) {
      interval = window.setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [goToNext, isAutoPlaying, autoPlayInterval]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const CarouselIndicators = () => {
    return (
      <div className="carousel-indicators">
        {Array.from({ length: images.length }).map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={carouselRef}
      className="carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel-track">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ transform: `translateX(${100 * (index - currentIndex)}%)` }}
            aria-hidden={index !== currentIndex}
          >
            <div className="image-wrapper">
              <img 
                src={image.src} 
                alt={`Slide ${index + 1}`} 
                className="carousel-image"
              />
            </div>
            <div className="caption-container">
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="carousel-control prev"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        className="carousel-control next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      <CarouselIndicators />

      <style>{`
        .carousel-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
          aspect-ratio: 16/9;
          background-color: #000;
        }

        .carousel-track {
          display: flex;
          height: 100%;
          width: 100%;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.42, 0, 0.58, 1);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .image-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .carousel-slide.active .carousel-image {
          transform: scale(1.05);
          transition: transform 8s ease;
        }

        .caption-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 24px;
          text-align: center;
          transform: translateY(100%);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .carousel-slide.active .caption-container {
          transform: translateY(0);
          opacity: 1;
          transition-delay: 0.3s;
        }

        .image-caption {
          font-size: 1.25rem;
          font-weight: 500;
          color: #fff;
          margin: 0;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        }

        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: #E50914;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
          backdrop-filter: blur(5px);
        }

        .carousel-container:hover .carousel-control {
          opacity: 1;
        }

        .carousel-control:hover {
          background-color: rgba(229, 9, 20, 0.9);
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-control.prev {
          left: 20px;
        }

        .carousel-control.next {
          right: 20px;
        }

        .carousel-indicators {
          position: absolute;
          bottom: 16px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          z-index: 10;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }

        .indicator-dot:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }

        .indicator-dot.active {
          background-color: #E50914;
          width: 10px;
          height: 10px;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .carousel-container {
            border-radius: 12px;
            aspect-ratio: 4/5;
          }
          
          .carousel-control {
            width: 40px;
            height: 40px;
            opacity: 0.7;
          }
          
          .image-caption {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .carousel-container {
            border-radius: 8px;
          }
          
          .carousel-control {
            width: 36px;
            height: 36px;
          }
          
          .caption-container {
            padding: 16px;
          }
          
          .image-caption {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AppleCarousel;