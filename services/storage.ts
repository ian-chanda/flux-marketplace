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

type UploadArgs = {
  bucket_name: string;
  uri: string;
  id: string;
  folderName?: string;
  imageName?: string;
  mimeType?: string;
};

// Shared upload primitive. Returns the in-bucket object path (NOT a URL) so
// callers decide whether the object is public (getPublicUrl) or private
// (createSignedUrl). Path convention `${id}/...` is what the storage RLS
// policies rely on to prove ownership.
const putFile = async ({
  bucket_name,
  uri,
  id,
  folderName,
  imageName,
  mimeType,
}: UploadArgs): Promise<string> => {
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

  return filePath;
};

export const uploadImage = async (args: UploadArgs) => {
  const filePath = await putFile(args);

  const { data } = supabase.storage
    .from(args.bucket_name)
    .getPublicUrl(filePath);

  // cache-buster: the URL is stored in the DB so `?t=` forces clients to
  // re-fetch after an upsert instead of serving a stale cached image
  return `${data.publicUrl}?t=${Date.now()}`;
};

// Private upload for sensitive media (e.g. verification documents). Stores and
// returns only the object path; read access is via a short-lived signed URL.
export const uploadPrivateFile = async (args: UploadArgs) => {
  return putFile(args);
};

export const createSignedUrl = async (
  bucket_name: string,
  path: string,
  expiresIn = 60 * 60
) => {
  const { data, error } = await supabase.storage
    .from(bucket_name)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;

  return data.signedUrl;
};
