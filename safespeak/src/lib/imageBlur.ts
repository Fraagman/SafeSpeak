import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
type Rect = { x: number; y: number; width: number; height: number };

export async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej; });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!; ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(img.src);
  return canvas; // Re-encoding strips EXIF
}

async function detectFacesRects(canvas: HTMLCanvasElement): Promise<Rect[]> {
  const anyWin = window as any;
  if (anyWin.FaceDetector) {
    try {
      const detector = new anyWin.FaceDetector({ fastMode: true, maxDetectedFaces: 10 });
      const faces = await detector.detect(canvas);
      return faces.map((f: any) => ({ x: f.boundingBox.x, y: f.boundingBox.y, width: f.boundingBox.width, height: f.boundingBox.height }));
    } catch {}
  }
  const model = await blazeface.load();
  const preds = await model.estimateFaces(canvas as any, false);
  return preds.map((p: any) => { const [x1,y1]=p.topLeft; const [x2,y2]=p.bottomRight; return { x:x1, y:y1, width:x2-x1, height:y2-y1 }; });
}

function pixelateRegion(ctx: CanvasRenderingContext2D, rect: Rect, scale = 0.05) {
  const { x, y, width, height } = rect;
  const w = Math.max(1, Math.floor(width)), h = Math.max(1, Math.floor(height));
  const tmp = document.createElement("canvas");
  tmp.width = Math.max(1, Math.floor(w * scale)); tmp.height = Math.max(1, Math.floor(h * scale));
  const tctx = tmp.getContext("2d")!;
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(ctx.canvas, x, y, w, h, 0, 0, tmp.width, tmp.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, x, y, w, h);
}

export async function blurFaces(file: File): Promise<Blob> {
  const canvas = await fileToCanvas(file);
  const ctx = canvas.getContext("2d")!;
  const rects = await detectFacesRects(canvas);
  for (const r of rects) pixelateRegion(ctx, r, 0.05);
  const blob: Blob = await new Promise((res) => canvas.toBlob(b => res(b!), "image/jpeg", 0.85));
  return blob;
}