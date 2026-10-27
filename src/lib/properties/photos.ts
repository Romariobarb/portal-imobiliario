import { getSupabaseEnvironment } from "@/lib/supabase/env";
export const photoBucket = "property-photos";
export const maxPhotoBytes = 6 * 1024 * 1024;
export function storedPhotoUrl(path: string) {
  return `${getSupabaseEnvironment().url}/storage/v1/object/authenticated/${photoBucket}/${path}`;
}
export function storedPhotoPath(url: string): string | null {
  const prefix = `${getSupabaseEnvironment().url}/storage/v1/object/authenticated/${photoBucket}/`;
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length);
  return /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path) ? path : null;
}
