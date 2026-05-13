import { validateSupabaseConfig } from "../supabase-client.js";
import { fetchAlbums } from "../api/albums-api.js";
import { fetchMediasByAlbum } from "../api/medias-api.js";
import { splitByType } from "../services/media-normalizer.js";
import { createAlbumCard, renderMediaList, setStatus } from "../ui/components.js";

const state = {
  selectedAlbum: null,
  currentTab: "foto",
  mediasByType: { foto: [], video: [], youtube: [] },
};

const el = {
  albumsView: document.getElementById("albumsView"),
  albumView: document.getElementById("albumView"),
  albumsGrid: document.getElementById("albumsGrid"),
  albumsStatus: document.getElementById("albumsStatus"),
  mediasStatus: document.getElementById("mediasStatus"),
  albumsCounter: document.getElementById("albumsCounter"),
  selectedAlbumTitle: document.getElementById("selectedAlbumTitle"),
  btnBackAlbums: document.getElementById("btnBackAlbums"),
  tabs: Array.from(document.querySelectorAll(".glr-tab")),
  panels: {
    foto: document.getElementById("panel-foto"),
    video: document.getElementById("panel-video"),
    youtube: document.getElementById("panel-youtube"),
  },
  lightbox: document.getElementById("photoLightbox"),
  lightboxContent: document.getElementById("lightboxContent"),
  lightboxImage: document.getElementById("lightboxImage"),
  lightboxClose: document.getElementById("lightboxClose"),
  countFoto: document.getElementById("count-foto"),
  countVideo: document.getElementById("count-video"),
  countYoutube: document.getElementById("count-youtube"),
};

function switchView(showAlbum) {
  el.albumsView.classList.toggle("glr-hidden", showAlbum);
  el.albumView.classList.toggle("glr-hidden", !showAlbum);
}

function updateTabSelection(nextTab) {
  state.currentTab = nextTab;

  el.tabs.forEach((tab) => {
    const isCurrent = tab.dataset.tab === nextTab;
    tab.classList.toggle("is-active", isCurrent);
    tab.setAttribute("aria-selected", String(isCurrent));
  });

  Object.entries(el.panels).forEach(([type, panel]) => {
    panel.classList.toggle("is-active", type === nextTab);
  });
}

function updateCounts() {
  el.countFoto.textContent = String(state.mediasByType.foto.length);
  el.countVideo.textContent = String(state.mediasByType.video.length);
  el.countYoutube.textContent = String(state.mediasByType.youtube.length);
}

function renderPanels() {
  renderMediaList(el.panels.foto, state.mediasByType.foto, "fotos");
  renderMediaList(el.panels.video, state.mediasByType.video, "videos");
  renderMediaList(el.panels.youtube, state.mediasByType.youtube, "youtube");
}

async function openAlbum(album) {
  state.selectedAlbum = album;
  state.currentTab = "foto";
  switchView(true);
  updateTabSelection("foto");
  el.selectedAlbumTitle.textContent = album.nome || "Album";
  setStatus(el.mediasStatus, "Carregando midias...", false);

  try {
    const medias = await fetchMediasByAlbum(album.id);
    state.mediasByType = splitByType(medias);
    updateCounts();
    renderPanels();
    setStatus(el.mediasStatus, "", false);
  } catch (error) {
    console.error(error);
    state.mediasByType = { foto: [], video: [], youtube: [] };
    updateCounts();
    renderPanels();
    setStatus(el.mediasStatus, "Nao foi possivel carregar as midias deste album.", true);
  }
}

function bindEvents() {
  el.btnBackAlbums.addEventListener("click", () => {
    state.selectedAlbum = null;
    switchView(false);
    setStatus(el.mediasStatus, "", false);
  });

  el.tabs.forEach((tabButton) => {
    tabButton.addEventListener("click", () => {
      updateTabSelection(tabButton.dataset.tab);
    });
  });

  el.panels.foto.addEventListener("click", (event) => {
    const image = event.target.closest(".glr-photo-trigger");
    if (!image) return;

    event.preventDefault();
    event.stopPropagation();
    openLightbox(image.dataset.fullUrl, image.alt);
  });

  el.lightboxClose.addEventListener("click", closeLightbox);

  el.lightboxContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  el.lightbox.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !el.lightbox.classList.contains("glr-hidden")) {
      closeLightbox();
    }
  });
}

function openLightbox(url, alt) {
  if (!url) return;

  el.lightboxImage.src = url;
  el.lightboxImage.alt = alt || "Visualizacao da foto";
  el.lightbox.classList.remove("glr-hidden");
  el.lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (el.lightbox.classList.contains("glr-hidden")) return;

  el.lightbox.classList.add("glr-hidden");
  el.lightbox.setAttribute("aria-hidden", "true");
  el.lightboxImage.src = "";
  document.body.style.overflow = "";
}

function renderAlbums(albums) {
  el.albumsGrid.innerHTML = "";
  el.albumsCounter.textContent = `${albums.length} albuns`;

  if (!albums.length) {
    setStatus(el.albumsStatus, "Nenhum album encontrado no Supabase.", false);
    return;
  }

  setStatus(el.albumsStatus, "", false);

  albums.forEach((album) => {
    el.albumsGrid.appendChild(createAlbumCard(album, openAlbum));
  });
}

async function init() {
  bindEvents();

  const configStatus = validateSupabaseConfig();
  if (!configStatus.ok) {
    setStatus(el.albumsStatus, configStatus.message, true);
    return;
  }

  setStatus(el.albumsStatus, "Carregando albuns...", false);

  try {
    const albums = await fetchAlbums();
    renderAlbums(albums);
  } catch (error) {
    console.error(error);
    setStatus(el.albumsStatus, "Nao foi possivel carregar os albuns. Verifique tabelas e policies.", true);
  }
}

init();
