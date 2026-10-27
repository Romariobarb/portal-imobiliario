import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { photoBucket, storedPhotoPath } from "./photos";
export async function displayPhotos<T extends { url: string }>(supabase: SupabaseClient<Database>, images: T[]): Promise<T[]> {
  const paths = images.map(image => storedPhotoPath(image.url)).filter((path): path is string => !!path);
  if (!paths.length) return images;
  const { data, error } = await supabase.storage.from(photoBucket).createSignedUrls([...new Set(paths)], 300);
  if (error) throw new Error("Não foi possível carregar as fotos dos imóveis.");
  const urls = new Map(data?.map(item => [item.path, item.signedUrl]));
  return images.map(image => {
    const path = storedPhotoPath(image.url);
    if (!path) return image;
    const url = urls.get(path);
    if (!url) throw new Error("Uma foto do imóvel não está disponível.");
    return { ...image, url };
  });
}
