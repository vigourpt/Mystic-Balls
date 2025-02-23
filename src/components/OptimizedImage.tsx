import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  loading = 'lazy'
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isWebpSupported, setIsWebpSupported] = useState<boolean>(true);

  useEffect(() => {
    // Check WebP support
    const checkWebP = async () => {
      const webP = new Image();
      webP.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
      const supported = await new Promise((resolve) => {
        webP.onload = () => resolve(true);
        webP.onerror = () => resolve(false);
      });
      setIsWebpSupported(!!supported);
    };
    checkWebP();
  }, []);

  // Generate srcset for different sizes
  const generateSrcSet = () => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    const extension = isWebpSupported ? 'webp' : 'jpg';
    
    return widths
      .map(width => {
        const imgPath = src.replace(/\.(jpg|jpeg|png)$/, `.${extension}`);
        return `${imgPath}?w=${width} ${width}w`;
      })
      .join(', ');
  };

  return (
    <img
      src={imageSrc}
      srcSet={generateSrcSet()}
      sizes={sizes}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => {
        // Fallback to original format if WebP fails
        if (isWebpSupported) {
          setIsWebpSupported(false);
          setImageSrc(src);
        }
      }}
    />
  );
};

export default OptimizedImage;