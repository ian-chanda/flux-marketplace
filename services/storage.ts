import { File } from "expo-file-system";
import { supabase } from "@/lib/supabase";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  gif: "image/gif",
};

export const uploadImage = async ({
  bucket_name,
  uri,
  id,
  folderName,
  imageName,
  mimeType,
}: {
  bucket_name: string;
  uri: string;
  id: string;
  folderName?: string;
  imageName?: string;
  mimeType?: string;
}) => {
  const name = imageName ?? Date.now().toString();

  const rawExt = (uri.split(".").pop() ?? "").toLowerCase().split(/[?#]/)[0];
  const ext = /^[a-z0-9]+$/.test(rawExt) && rawExt !== "txt" ? rawExt : "jpg";
  const mime = mimeType ?? MIME_BY_EXT[ext] ?? "image/jpeg";

  const filePath = folderName
    ? `${id}/${folderName}/${name}.${ext}`
    : `${id}/${name}.${ext}`;

  // new File().arrayBuffer() is native — reliable on both iOS and Android,
  // no deprecation warnings, no fetch(file://) issues
  const file = new File(uri);
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket_name)
    .upload(filePath, arrayBuffer, {
      upsert: true,
      contentType: mime,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket_name).getPublicUrl(filePath);

  // cache-buster: the URL is stored in the DB so `?t=` forces clients to
  // re-fetch after an upsert instead of serving a stale cached image
  return `${data.publicUrl}?t=${Date.now()}`;
};
