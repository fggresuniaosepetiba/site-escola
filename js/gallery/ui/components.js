function formatDate(dateValue) {
  if (!dateValue) return "Data nao informada";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Data nao informada";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function setStatus(target, message, isError) {
  target.textContent = message || "";
  target.classList.toggle("is-error", Boolean(isError));
}

export function createAlbumCard(album, onOpen) {
  const card = document.createElement("article");
  card.className = "glr-album-card";
  card.setAttribute("role", "button");
  card.tabIndex = 0;

  const cover = document.createElement("div");
  cover.className = "glr-album-cover";

  const coverImage = document.createElement("img");
  coverImage.src = `https://picsum.photos/seed/album-${album.id}/700/700`;
  coverImage.alt = `Capa do album ${album.nome || "Sem nome"}`;
  coverImage.loading = "lazy";
  cover.appendChild(coverImage);

  const title = document.createElement("h3");
  title.textContent = album.nome || "Album sem nome";

  const createdAt = document.createElement("p");
  createdAt.textContent = `Criado em ${formatDate(album.created_at)}`;

  card.appendChild(cover);
  card.appendChild(title);
  card.appendChild(createdAt);

  card.addEventListener("click", () => onOpen(album));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(album);
    }
  });

  return card;
}

function createMediaShell(item) {
  const card = document.createElement("article");
  card.className = "glr-media-card";

  const frame = document.createElement("div");
  frame.className = "glr-media-frame";

  const meta = document.createElement("div");
  meta.className = "glr-media-meta";

  const title = document.createElement("h4");
  title.textContent = item.displayTitle;

  const subtitle = document.createElement("p");
  subtitle.textContent = formatDate(item.created_at);

  meta.appendChild(title);
  meta.appendChild(subtitle);

  card.appendChild(frame);
  card.appendChild(meta);

  return { card, frame };
}

function createFotoCard(item) {
  const { card, frame } = createMediaShell(item);
  const img = document.createElement("img");
  img.src = item.safeUrl;
  img.alt = item.displayTitle;
  img.loading = "lazy";
  img.className = "glr-photo-trigger";
  img.dataset.fullUrl = item.safeUrl;
  img.dataset.title = item.displayTitle;
  frame.appendChild(img);
  return card;
}

function createVideoCard(item) {
  const { card, frame } = createMediaShell(item);
  const video = document.createElement("video");
  video.src = item.safeUrl;
  video.controls = true;
  video.preload = "metadata";
  frame.appendChild(video);
  return card;
}

function createYoutubeCard(item) {
  const { card, frame } = createMediaShell(item);
  const iframe = document.createElement("iframe");
  iframe.src = item.safeUrl;
  iframe.title = item.displayTitle;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  frame.appendChild(iframe);
  return card;
}

export function renderMediaList(container, items, typeLabel) {
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "glr-empty";
    empty.textContent = `Nenhum item de ${typeLabel} neste album ainda.`;
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    let node;
    if (item.tipo === "foto") node = createFotoCard(item);
    if (item.tipo === "video") node = createVideoCard(item);
    if (item.tipo === "youtube") node = createYoutubeCard(item);
    if (node) container.appendChild(node);
  });
}
