import { supabase } from "@/lib/supabase";

// use this when you want to upload an image
// it returns the image url that you can upload to the db table or sumn
export const uploadImage = async ({
  bucket_name,
  uri,
  id,
  folderName,
  imageName,
}: {
  bucket_name: string;
  uri: string;
  id: string;
  folderName?: string;
  imageName?: string;
}) => {
  const name = imageName ?? Date.now();

  const fileExtension = uri.split(".").pop() ?? "jpeg";

  const filePath = folderName
    ? `${id}/${folderName}/${name}.${fileExtension}`
    : `${id}/${name}.${fileExtension}`;

  console.log("the file path: ", filePath)

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket_name)
    .upload(filePath, arrayBuffer, {
      upsert: true,
      contentType: `image/${fileExtension}`,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket_name).getPublicUrl(filePath);

  return data.publicUrl;
};
