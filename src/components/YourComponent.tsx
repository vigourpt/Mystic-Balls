import OptimizedImage from './OptimizedImage';

export const YourComponent = () => {
  return (
    <OptimizedImage
      src="/path/to/your/image.jpg"
      alt="Description"
      sizes="(max-width: 768px) 100vw, 50vw"
      loading="lazy"
      className="w-full h-auto"
    />
  );
};