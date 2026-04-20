/* ============================================================
   G.R.E.S. União de Sepetiba — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar: muda opacidade ao rolar ──────────────────── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 60
      ? 'rgba(21, 21, 195, 0.97)'
      : 'rgba(21, 21, 195, 0.88)';
  });

  /* ── Carousel "Comunidade em Ação" ────────────────────── */
  const track   = document.querySelector('.carousel-track');
  const btnPrev = document.querySelector('.carousel-btn.prev');
  const btnNext = document.querySelector('.carousel-btn.next');

  if (track && btnPrev && btnNext) {
    const cardWidth = () => {
      const card = track.querySelector('.carousel-card');
      return card ? card.offsetWidth + 24 : 424;
    };
    btnNext.addEventListener('click', () => track.scrollBy({ left:  cardWidth(), behavior: 'smooth' }));
    btnPrev.addEventListener('click', () => track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
  }

  /* ── Patrocinadores: bloco único que entra e sai ─────────
   *
   * O grupo de logos começa totalmente fora da tela à DIREITA,
   * desliza para a esquerda passando pelo centro, e sai pela
   * esquerda. Ao terminar, reinicia da direita — sem repetição.
   *
   * A velocidade é constante: 80px/s (ajuste PX_PER_SEC).
   * ──────────────────────────────────────────────────────── */
  const group = document.getElementById('patrGroup');

  if (group) {
    const PX_PER_SEC = 80;

    const setup = () => {
      const vw        = window.innerWidth;
      const groupW    = group.offsetWidth;

      // começa logo após a borda direita da tela
      const startPx   = vw;
      // termina quando a última logo sai pela borda esquerda
      const endPx     = -groupW;

      // distância total percorrida
      const totalDist = startPx - endPx;           // vw + groupW
      const duration  = totalDist / PX_PER_SEC;    // segundos

      group.style.setProperty('--patr-start', `${startPx}px`);
      group.style.setProperty('--patr-end',   `${endPx}px`);
      group.style.setProperty('--patr-dur',   `${duration}s`);

      // reinicia a animação do zero
      group.style.animation = 'none';
      // força reflow para o browser aplicar o reset
      void group.offsetWidth;
      group.style.animation = '';
    };

    setup();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 200);
    });
  }

});

const audio = document.getElementById("sambaAudio");
const button = document.getElementById("playButton");

button.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    button.innerHTML = 'Pausar <span class="material-symbols-outlined">pause_circle</span>';
  } else {
    audio.pause();
    button.innerHTML = 'Ouça Agora <span class="material-symbols-outlined">play_circle</span>';
  }
});