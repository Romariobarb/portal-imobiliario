"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { maxPhotoBytes, photoBucket, storedPhotoPath, storedPhotoUrl } from "@/lib/properties/photos";
export default function PropertyPhotos({ initialUrls, onBusy }: { initialUrls: string[]; onBusy: (busy: boolean) => void }) {
  const [photos, setPhotos] = useState(initialUrls.map(url => ({ url, preview: storedPhotoPath(url) ? "" : url })));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const client = createClient();
    Promise.all(initialUrls.map(async url => {
      const path = storedPhotoPath(url);
      if (!path) return { url, preview: url };
      const { data } = await client.storage.from(photoBucket).createSignedUrl(path, 3600);
      return { url, preview: data?.signedUrl ?? "" };
    })).then(items => { if (active) setPhotos(current => current.map(photo => items.find(item => item.url === photo.url) ?? photo)); });
    return () => { active = false; };
  }, []);
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    if (photos.length + files.length > 20) { setError("Selecione até 20 fotos no total."); return; }
    const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    if (Array.from(files).some(file => !extensions[file.type] || !file.size || file.size > maxPhotoBytes)) {
      setError("Use fotos JPG, PNG ou WebP de até 6 MB cada."); return;
    }
    setBusy(true); onBusy(true);
    try {
      const client = createClient();
      const { data: { user } } = await client.auth.getUser();
      if (!user) throw new Error("Sua sessão expirou. Entre novamente.");
      for (const file of Array.from(files)) {
        try { const image = await createImageBitmap(file); image.close(); }
        catch { throw new Error("Um arquivo não é uma foto válida. Selecione outra imagem."); }
        const path = `${user.id}/${crypto.randomUUID()}.${extensions[file.type]}`;
        const { error: uploadError } = await client.storage.from(photoBucket).upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw new Error("Não foi possível enviar uma foto. Confira sua aprovação e tente novamente.");
        const { data, error: readError } = await client.storage.from(photoBucket).createSignedUrl(path, 3600);
        if (readError || !data) throw new Error("A foto foi enviada, mas a prévia não carregou. Tente novamente.");
        setPhotos(current => [...current, { url: storedPhotoUrl(path), preview: data.signedUrl }]);
      }
    } catch (cause) { setError((cause as Error).message); }
    finally { setBusy(false); onBusy(false); }
  }
  return <section className="space-y-4" aria-label="Fotos do imóvel">
    <input type="hidden" name="images" value={photos.map(photo => photo.url).join("\n")} />
    <label className="block text-sm font-medium">Fotos do imóvel<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={event => { void upload(event.target.files); event.target.value = ""; }} className="mt-2 block w-full rounded-md border border-[#DCD8D0] p-3 file:mr-3 file:rounded-md file:border-0 file:bg-[#0E1E3A] file:px-3 file:py-2 file:text-white" /></label>
    <p className="text-sm text-[#57544F]">Até 20 fotos, em JPG, PNG ou WebP, com até 6 MB cada. A primeira foto será a capa.</p>
    {busy && <p role="status">Enviando fotos… Aguarde antes de salvar.</p>}{error && <p role="alert" className="text-red-800">{error}</p>}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{photos.map((photo,index) => <div key={photo.url} className="rounded-md border border-[#DCD8D0] p-2">{photo.preview ? <img src={photo.preview} alt={`Foto ${index+1} do imóvel`} className="h-28 w-full rounded object-cover" /> : <p className="p-4 text-sm">Prévia indisponível</p>}<p className="my-2 text-xs">{index === 0 ? "Capa" : `Foto ${index+1}`}</p><div className="flex flex-wrap gap-2"><button type="button" disabled={busy || index===0} className="text-xs underline disabled:opacity-40" onClick={() => setPhotos(current => [current[index], ...current.filter((_,i) => i !== index)])}>Usar como capa</button><button type="button" disabled={busy} className="text-xs text-red-800 underline" onClick={() => setPhotos(current => current.filter((_,i) => i !== index))}>Remover</button></div></div>)}</div>
    <p className="text-xs text-[#57544F]">As fotos ficam reservadas até a aprovação do anúncio. Remover uma foto aqui altera o anúncio ao salvar.</p>
  </section>;
}
