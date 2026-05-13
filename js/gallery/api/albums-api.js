import { supabaseClient } from "../supabase-client.js";

export async function fetchAlbums() {
  if (!supabaseClient) {
    throw new Error("Supabase nao inicializado");
  }

  const { data, error } = await supabaseClient
    .from("albums")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Falha ao carregar albuns");
  }

  return (data || []).map((album) => ({
    ...album,
    nome: album.title,
  }));
}
