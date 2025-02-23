import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const SIZES = [320, 640, 768, 1024, 1280, 1536];
const FORMATS = ['webp', 'jpg'] as const;

async function optimizeImages() {
  try {
    const images = await glob('public/**/*.{jpg,jpeg,png}');

    for (const image of images) {
      const filename = path.parse(image).name;
      const directory = path.dirname(image);

      for (const format of FORMATS) {
        for (const width of SIZES) {
          const outputPath = path.join(
            directory,
            'optimized',
            `${filename}-${width}.${format}`
          );

          await fs.mkdir(path.dirname(outputPath), { recursive: true });

          const pipeline = sharp(image).resize(width);
          
          if (format === 'webp') {
            await pipeline.webp({ quality: 80 }).toFile(outputPath);
          } else {
            await pipeline.jpeg({ quality: 80, progressive: true }).toFile(outputPath);
          }
        }
      }
    }

    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();