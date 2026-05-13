const VALID_TYPES = ["foto", "video", "youtube"];

function getYoutubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return parsed.pathname.replace("/", "") || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1] || null;
      }
    }
  } catch (_) {
    return null;
  }

  return null;
}

function toEmbedUrl(inputUrl) {
  const youtubeId = getYoutubeId(inputUrl);
  if (!youtubeId) return null;
  return `https://www.youtube.com/embed/${youtubeId}`;
}

export function normalizeMediaItem(item) {
  const tipo = (item.tipo || "").toLowerCase();
  if (!VALID_TYPES.includes(tipo)) return null;

  if (tipo === "youtube") {
    const embedUrl = toEmbedUrl(item.url);
    if (!embedUrl) return null;

    return {
      ...item,
      tipo,
      safeUrl: embedUrl,
      displayTitle: item.titulo || "Video do Youtube",
    };
  }

  return {
    ...item,
    tipo,
    safeUrl: item.url,
    displayTitle: item.titulo || (tipo === "foto" ? "Foto" : "Video"),
  };
}

export function splitByType(medias) {
  return medias.reduce(
    (acc, current) => {
      const normalized = normalizeMediaItem(current);
      if (!normalized) return acc;

      acc[normalized.tipo].push(normalized);
      return acc;
    },
    { foto: [], video: [], youtube: [] }
  );
}
