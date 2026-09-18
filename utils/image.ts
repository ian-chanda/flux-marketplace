import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// HEIC (iPhone default) can't be decoded by RN <Image> on Android (renders white/blank).
// Re-encode any picked photo to JPEG so uploads always display.
export async function toJpeg(uri: string): Promise<string> {
  try {
    const context = ImageManipulator.manipulate(uri);
    const image = await context.renderAsync();
    const result = await image.saveAsync({ compress: 0.8, format: SaveFormat.JPEG });
    return result.uri;
  } catch {
    return uri;
  }
}

export async function toJpegMany(uris: string[]): Promise<string[]> {
  return Promise.all(uris.map(toJpeg));
}