import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

/**
 * Represents a rectangular region in an image
 */
type Rect = { x: number; y: number; width: number; height: number };

/**
 * Converts a File to a Canvas element with optional resizing
 * @param file The image file to convert
 * @param maxSize Maximum dimension (default: 1920)
 * @returns Canvas element with the image
 */
export async function fileToCanvas(file: File, maxSize: number = 1920): Promise<HTMLCanvasElement> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only run in the browser');
  }

  const img = new Image();
  const url = URL.createObjectURL(file);
  
  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });

  // Calculate new dimensions while maintaining aspect ratio
  let { width, height } = img;
  if (width > height && width > maxSize) {
    height *= maxSize / width;
    width = maxSize;
  } else if (height > maxSize) {
    width *= maxSize / height;
    height = maxSize;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  return canvas;
}

/**
 * Detects faces in an image using the best available method
 * @param canvas Canvas element containing the image
 * @returns Array of face rectangles
 */
async function detectFacesRects(canvas: HTMLCanvasElement): Promise<Rect[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  // Try native FaceDetector API first if available and in secure context
  const anyWin = window as any;
  if (anyWin.FaceDetector && window.isSecureContext) {
    try {
      const detector = new anyWin.FaceDetector({ 
        fastMode: true, 
        maxDetectedFaces: 10 
      });
      const faces = await detector.detect(canvas);
      return faces.map((f: any) => ({
        x: Math.max(0, f.boundingBox.x - f.boundingBox.width * 0.2),
        y: Math.max(0, f.boundingBox.y - f.boundingBox.height * 0.2),
        width: Math.min(canvas.width - f.boundingBox.x, f.boundingBox.width * 1.4),
        height: Math.min(canvas.height - f.boundingBox.y, f.boundingBox.height * 1.4)
      }));
    } catch (error) {
      console.warn('FaceDetector API failed, falling back to TensorFlow.js', error);
    }
  }

  // Fall back to TensorFlow.js
  try {
    // Dynamically import TF.js and BlazeFace to reduce initial bundle size
    const [tf, blazeface] = await Promise.all([
      import('@tensorflow/tfjs'),
      import('@tensorflow-models/blazeface')
    ]);
    
    await tf.ready();
    await tf.setBackend('webgl');
    
    const model = await blazeface.load();
    const predictions = await model.estimateFaces(canvas, false);
    
    return predictions.map(pred => {
      const [x1, y1] = pred.topLeft;
      const [x2, y2] = pred.bottomRight;
      const width = x2 - x1;
      const height = y2 - y1;
      
      return {
        x: Math.max(0, x1 - width * 0.2),
        y: Math.max(0, y1 - height * 0.2),
        width: Math.min(canvas.width - x1, width * 1.4),
        height: Math.min(canvas.height - y1, height * 1.4)
      };
    });
  } catch (error) {
    console.error('Face detection failed:', error);
    return [];
  }
}

/**
 * Applies pixelation to a region of a canvas
 * @param ctx Canvas rendering context
 * @param rect Region to pixelate
 * @param scale Pixelation scale (0-1, lower = more pixelated)
 */
function pixelateRegion(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  scale: number = 0.05
) {
  const { x, y, width, height } = rect;
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = Math.max(1, Math.floor(w * scale));
  tempCanvas.height = Math.max(1, Math.floor(h * scale));
  
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(
    ctx.canvas,
    x, y, w, h,
    0, 0, tempCanvas.width, tempCanvas.height
  );
  
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    tempCanvas,
    0, 0, tempCanvas.width, tempCanvas.height,
    x, y, w, h
  );
  ctx.imageSmoothingEnabled = true;
}

/**
 * Blurs faces in an image
 * @param file The image file to process
 * @param opts Options for processing
 * @param opts.pixelateScale Pixelation scale (0-1, lower = more pixelated)
 * @param opts.maxSize Maximum dimension of the output image
 * @returns Blob with the processed image (JPEG format, quality 0.85)
 */
export async function blurFaces(
  file: File,
  opts: { pixelateScale?: number; maxSize?: number } = {}
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only run in the browser');
  }

  const { pixelateScale = 0.05, maxSize = 1920 } = opts;
  
  try {
    // Load and resize the image
    const canvas = await fileToCanvas(file, maxSize);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Detect faces
    const faceRects = await detectFacesRects(canvas);
    
    // Apply pixelation to each detected face
    for (const rect of faceRects) {
      pixelateRegion(ctx, rect, pixelateScale);
    }

    // Convert to blob with JPEG format and quality 0.85 (strips EXIF data)
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.85
      );
    });
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : String(error)}`);
  }
}