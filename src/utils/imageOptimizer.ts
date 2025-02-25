import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

/**
 * Optimizes an image by resizing it to multiple dimensions and converting it to WebP format.
 * @param inputPath - The path to the input image.
 * @param outputDir - The directory where optimized images will be saved.
 * @param sizes - An array of widths to resize the image to.
 * @param quality - The quality of the output WebP images (default: 80).
 */
export async function optimizeImage(
  inputPath: string,
  outputDir: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1536],
  quality: number = 80
): Promise<void> {
  try {
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Process the image for each size
    for (const width of sizes) {
      const outputFilePath = path.join(
        outputDir,
        `${path.basename(inputPath, path.extname(inputPath))}-${width}.webp`
      );

      // Resize and convert to WebP
      await sharp(inputPath)
        .resize(width)
        .webp({ quality })
        .toFile(outputFilePath);

      console.log(`Optimized image saved: ${outputFilePath}`);
    }
  } catch (error) {
    console.error(`Error optimizing image (${inputPath}):`, error);
    throw error;
  }
}
