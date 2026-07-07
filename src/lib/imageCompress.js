const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image file."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function compressImageFile(file) {
  if (!file?.type?.startsWith("image/")) return file;
  if (file.type === "image/gif") return file;

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  if (scale >= 1 && file.size <= 512 * 1024) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(image, 0, 0, width, height);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(canvas, outputType, JPEG_QUALITY);
  const extension = outputType === "image/png" ? "png" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

  return new File([blob], `${baseName}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}
