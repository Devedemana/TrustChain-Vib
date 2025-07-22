// Advanced image processing and optimization utilities
export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
  preserveExif?: boolean;
  watermark?: string;
  resize?: 'cover' | 'contain' | 'fill';
}

export interface OptimizedImage {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  camera?: string;
  timestamp?: Date;
  location?: { lat: number; lng: number };
  exif?: Record<string, any>;
  colorProfile?: string;
  orientation?: number;
}

class ImageOptimizationService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private worker: Worker | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.initializeWorker();
    }
  }

  private initializeWorker(): void {
    // Create a web worker for CPU-intensive operations
    const workerScript = `
      self.onmessage = function(e) {
        const { imageData, operation, options } = e.data;
        
        switch (operation) {
          case 'compress':
            // Perform compression in worker thread
            const result = compressImageData(imageData, options);
            self.postMessage({ result });
            break;
          case 'filter':
            // Apply filters in worker thread
            const filtered = applyFilter(imageData, options);
            self.postMessage({ result: filtered });
            break;
        }
      };
      
      function compressImageData(imageData, options) {
        // Compression logic here
        return imageData;
      }
      
      function applyFilter(imageData, options) {
        // Filter logic here
        return imageData;
      }
    `;

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread');
    }
  }

  public async compressImage(
    file: File | Blob,
    options: ImageCompressionOptions = {}
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'webp',
      progressive = true,
      preserveExif = false
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = async () => {
        try {
          const result = await this.processImage(img, options);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (file instanceof File) {
        img.src = URL.createObjectURL(file);
      } else {
        img.src = URL.createObjectURL(file);
      }
    });
  }

  private async processImage(
    img: HTMLImageElement,
    options: ImageCompressionOptions
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'webp',
      resize = 'contain'
    } = options;

    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not supported');
    }

    // Calculate optimal dimensions
    const dimensions = this.calculateDimensions(
      img.width,
      img.height,
      maxWidth,
      maxHeight,
      resize
    );

    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Enable smooth scaling
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Apply background for transparent images
    if (format === 'jpeg') {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    // Draw the image
    this.ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

    // Apply post-processing filters
    await this.applyPostProcessing(options);

    // Convert to desired format
    const mimeType = this.getMimeType(format);
    const blob = await this.canvasToBlob(mimeType, quality);

    // Create data URL
    const dataUrl = await this.blobToDataUrl(blob);

    // Calculate compression metrics
    const originalSize = this.estimateOriginalSize(img.width, img.height);
    const compressedSize = blob.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      blob,
      dataUrl,
      width: dimensions.width,
      height: dimensions.height,
      originalSize,
      compressedSize,
      compressionRatio,
      format,
      metadata: await this.extractMetadata(img)
    };
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    resize: 'cover' | 'contain' | 'fill'
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    const maxAspectRatio = maxWidth / maxHeight;

    let width: number;
    let height: number;

    switch (resize) {
      case 'contain':
        if (aspectRatio > maxAspectRatio) {
          width = Math.min(maxWidth, originalWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(maxHeight, originalHeight);
          width = height * aspectRatio;
        }
        break;

      case 'cover':
        if (aspectRatio > maxAspectRatio) {
          height = maxHeight;
          width = height * aspectRatio;
        } else {
          width = maxWidth;
          height = width / aspectRatio;
        }
        break;

      case 'fill':
        width = maxWidth;
        height = maxHeight;
        break;

      default:
        width = Math.min(maxWidth, originalWidth);
        height = Math.min(maxHeight, originalHeight);
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  private async applyPostProcessing(options: ImageCompressionOptions): Promise<void> {
    if (!this.ctx || !this.canvas) return;

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    // Apply sharpening filter for better quality at smaller sizes
    this.applySharpeningFilter(data, this.canvas.width, this.canvas.height);

    // Apply noise reduction
    this.applyNoiseReduction(data, this.canvas.width, this.canvas.height);

    // Apply color optimization
    this.optimizeColors(data);

    this.ctx.putImageData(imageData, 0, 0);

    // Add watermark if specified
    if (options.watermark) {
      await this.addWatermark(options.watermark);
    }
  }

  private applySharpeningFilter(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): void {
    // Unsharp mask kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels only
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIndex = (ky + 1) * 3 + (kx + 1);
              sum += tempData[pixelIndex] * kernel[kernelIndex];
            }
          }
          const currentIndex = (y * width + x) * 4 + c;
          data[currentIndex] = Math.max(0, Math.min(255, sum));
        }
      }
    }
  }

  private applyNoiseReduction(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): void {
    // Simple median filter for noise reduction
    const radius = 1;
    const tempData = new Uint8ClampedArray(data);

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels only
          const values: number[] = [];
          
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const index = ((y + dy) * width + (x + dx)) * 4 + c;
              values.push(tempData[index]);
            }
          }
          
          values.sort((a, b) => a - b);
          const median = values[Math.floor(values.length / 2)];
          const currentIndex = (y * width + x) * 4 + c;
          data[currentIndex] = median;
        }
      }
    }
  }

  private optimizeColors(data: Uint8ClampedArray): void {
    // Apply gamma correction and color balance
    const gamma = 1.1;
    const gammaCorrection = Math.pow(1 / gamma, 1);

    for (let i = 0; i < data.length; i += 4) {
      // Gamma correction
      data[i] = Math.pow(data[i] / 255, gammaCorrection) * 255;     // Red
      data[i + 1] = Math.pow(data[i + 1] / 255, gammaCorrection) * 255; // Green
      data[i + 2] = Math.pow(data[i + 2] / 255, gammaCorrection) * 255; // Blue

      // Slight color enhancement
      data[i] = Math.min(255, data[i] * 1.02);     // Slightly boost red
      data[i + 1] = Math.min(255, data[i + 1] * 1.01); // Slightly boost green
      data[i + 2] = Math.min(255, data[i + 2] * 1.03); // Slightly boost blue
    }
  }

  private async addWatermark(watermarkText: string): Promise<void> {
    if (!this.ctx || !this.canvas) return;

    const fontSize = Math.max(12, Math.min(this.canvas.width / 20, 24));
    
    this.ctx.save();
    this.ctx.font = `${fontSize}px Arial, sans-serif`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'bottom';

    // Position watermark at bottom-right
    const x = this.canvas.width - 10;
    const y = this.canvas.height - 10;

    this.ctx.strokeText(watermarkText, x, y);
    this.ctx.fillText(watermarkText, x, y);
    this.ctx.restore();
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      'webp': 'image/webp',
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'png': 'image/png'
    };
    
    return mimeTypes[format.toLowerCase()] || 'image/jpeg';
  }

  private canvasToBlob(mimeType: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        mimeType,
        quality
      );
    });
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
      reader.readAsDataURL(blob);
    });
  }

  private estimateOriginalSize(width: number, height: number): number {
    // Estimate uncompressed size (4 bytes per pixel for RGBA)
    return width * height * 4;
  }

  private async extractMetadata(img: HTMLImageElement): Promise<ImageMetadata> {
    const metadata: ImageMetadata = {};

    try {
      // Try to extract EXIF data if available
      if ('getImageData' in img) {
        // This would require a more sophisticated EXIF reader
        // For now, we'll just capture basic info
        metadata.timestamp = new Date();
      }
    } catch (error) {
      console.warn('Could not extract image metadata:', error);
    }

    return metadata;
  }

  public async createWebPVersion(file: File | Blob): Promise<OptimizedImage> {
    return this.compressImage(file, {
      format: 'webp',
      quality: 0.85,
      maxWidth: 1920,
      maxHeight: 1080
    });
  }

  public async createThumbnail(
    file: File | Blob,
    size: number = 200
  ): Promise<OptimizedImage> {
    return this.compressImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.9,
      format: 'webp',
      resize: 'cover'
    });
  }

  public async createProgressiveJPEG(file: File | Blob): Promise<OptimizedImage> {
    return this.compressImage(file, {
      format: 'jpeg',
      quality: 0.85,
      progressive: true,
      maxWidth: 1920,
      maxHeight: 1080
    });
  }

  public async batchCompress(
    files: (File | Blob)[],
    options: ImageCompressionOptions = {},
    onProgress?: (completed: number, total: number) => void
  ): Promise<OptimizedImage[]> {
    const results: OptimizedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.compressImage(files[i], options);
        results.push(result);
        onProgress?.(i + 1, files.length);
      } catch (error) {
        console.error(`Failed to compress image ${i}:`, error);
        // Continue with next image
      }
    }
    
    return results;
  }

  public async compareFormats(
    file: File | Blob
  ): Promise<Record<string, OptimizedImage>> {
    const formats: Array<'webp' | 'jpeg' | 'png'> = ['webp', 'jpeg', 'png'];
    const results: Record<string, OptimizedImage> = {};

    const compressionPromises = formats.map(async (format) => {
      const result = await this.compressImage(file, { format, quality: 0.8 });
      return { format, result };
    });

    const compressedResults = await Promise.allSettled(compressionPromises);
    
    compressedResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results[result.value.format] = result.value.result;
      }
    });

    return results;
  }

  public getOptimalFormat(comparisons: Record<string, OptimizedImage>): string {
    let bestFormat = 'jpeg';
    let bestSize = Infinity;

    Object.entries(comparisons).forEach(([format, result]) => {
      if (result.compressedSize < bestSize) {
        bestSize = result.compressedSize;
        bestFormat = format;
      }
    });

    return bestFormat;
  }

  public cleanup(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export default ImageOptimizationService;
