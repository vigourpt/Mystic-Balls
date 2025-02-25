import React, { useState, useEffect } from 'react';
import { optimizeImage } from '../utils/imageOptimizer';

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
  const generateSrcSet = async () => {
    try {
      const widths = [320, 640, 768, 1024, 1280, 1536];
      const optimizedImages = await Promise.all(
        widths.map(async (width) => {
          const optimizedPath = await optimizeImage(src, '/optimized-images', [width]);
          return `${optimizedPath} ${width}w`;
        })
      );
      return optimizedImages.join(', ');
    } catch (error) {
      console.error('Error generating srcSet:', error);
      return '';
    }
  };

  return (
    <img
      src={imageSrc}
      srcSet={await generateSrcSet()}
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