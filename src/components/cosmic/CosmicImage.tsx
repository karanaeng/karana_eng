import React, { useState } from 'react';

interface CosmicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title?: string;
  fallbackGradient?: string;
}

export const CosmicImage: React.FC<CosmicImageProps> = ({
  src,
  alt,
  className = '',
  title = 'Karana Concept',
  fallbackGradient,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate a deterministic cosmic gradient based on the title string
  const getGradient = () => {
    if (fallbackGradient) return fallbackGradient;
    
    const colors = [
      'from-cosmic-surface via-cosmic-black to-black',
      'from-slate-900 via-cosmic-surface to-black',
      'from-cyan-950 via-cosmic-surface to-black',
      'from-zinc-900 via-cosmic-black to-black',
      'from-neutral-800 via-cosmic-surface to-black',
    ];
    
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black select-none ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-gray-900 via-cosmic-black to-gray-900 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-cosmic-gold/30 border-t-cosmic-gold rounded-full animate-spin" />
        </div>
      )}

      {/* Actual Image */}
      {!hasError && src && (
        <img
          src={src}
          alt={alt || title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          loading="lazy"
          {...props}
        />
      )}

      {/* Premium Dynamic Glassmorphic Fallback */}
      {(hasError || !src) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b ${getGradient()} transition-all duration-500`}
        >
          {/* Cosmic accent grid or patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
          
          {/* Cosmic soft glow sphere */}
          <div className="absolute w-40 h-40 rounded-full bg-cosmic-gold/10 blur-3xl" />
          
          <div className="relative z-10 text-center flex flex-col items-center">
            {/* Elegant glassmorphic badge with initials */}
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center mb-4 shadow-2xl">
              <span className="text-2xl font-black font-montserrat text-glow-gold text-cosmic-gold tracking-wider">
                {getInitials(title)}
              </span>
            </div>
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">
              CONCEPT ARCHIVE
            </span>
            <span className="text-sm font-bold text-white/80 font-montserrat max-w-[80%] line-clamp-1">
              {title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
