import { supabaseClient } from "../supabase-client.js";

export async function fetchMediasByAlbum(albumId) {
  if (!supabaseClient) {
    throw new Error("Supabase nao inicializado");
  }

  const { data, error } = await supabaseClient
    .from("medias")
    .select("id, album_id, tipo, titulo, url, created_at")
    .eq("album_id", albumId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Falha ao carregar midias");
  }

  return data || [];
}
