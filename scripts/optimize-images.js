import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { glob } from 'glob';

// Get the current file's directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGE_DIR = path.join(__dirname, '../public/images');
const QUALITY = 80; // Quality for JPEG/WebP (1-100)
const WIDTH = 800; // Max width for resizing
const CONCURRENCY = 4; // Number of images to process in parallel

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Skip if already optimized or not a supported format
    if (!SUPPORTED_FORMATS.includes(ext) || filePath.endsWith('.webp')) {
      console.log(`Skipping ${filePath}`);
      return { filePath, optimized: false, reason: 'Not a supported format or already optimized' };
    }

    // Get original file stats
    const originalStats = await fs.stat(filePath);
    
    // Process image with sharp
    await sharp(filePath)
      .resize({
        width: WIDTH,
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ 
        quality: QUALITY,
        alphaQuality: 80,
        effort: 6 // Higher effort = better compression but slower
      })
      .toFile(outputPath);
    
    // Get optimized file stats
    const optimizedStats = await fs.stat(outputPath);
    const savings = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(2);
    
    console.log(`Optimized ${path.basename(filePath)}: ${(originalStats.size / 1024).toFixed(2)}KB → ${(optimizedStats.size / 1024).toFixed(2)}KB (${savings}% savings)`);
    
    return { 
      filePath, 
      optimized: true, 
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error.message);
    return { filePath, optimized: false, error: error.message };
  }
}

async function main() {
  try {
    console.log('Starting image optimization...');
    
    // Find all image files in the images directory
    const files = await glob(`${IMAGE_DIR}/**/*.{jpg,jpeg,png}`, { nodir: true });
    
    if (files.length === 0) {
      console.log('No images found to optimize.');
      return;
    }
    
    console.log(`Found ${files.length} images to optimize.`);
    
    // Process images in batches to avoid memory issues
    const batchSize = CONCURRENCY;
    let processed = 0;
    let totalSavings = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(file => optimizeImage(file)));
      
      // Update statistics
      results.forEach(result => {
        if (result.optimized) {
          totalSavings += result.savings * result.originalSize / 100;
          totalOriginalSize += result.originalSize;
          totalOptimizedSize += result.optimizedSize;
        }
        processed++;
        process.stdout.write(`\rProgress: ${processed}/${files.length} (${Math.round((processed / files.length) * 100)}%)`);
      });
    }
    
    // Print summary
    console.log('\n\nOptimization complete!');
    console.log(`Total images processed: ${files.length}`);
    console.log(`Total original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Total optimized size: ${(totalOptimizedSize / (1024 * 1024)).toFixed(2)} MB`);    
    console.log(`Total space saved: ${(totalSavings / (1024 * 1024)).toFixed(2)} MB (${(totalSavings / totalOriginalSize * 100).toFixed(2)}% reduction)`);
    
  } catch (error) {
    console.error('Error during optimization:', error);
    process.exit(1);
  }
}

// Run the script
main();
