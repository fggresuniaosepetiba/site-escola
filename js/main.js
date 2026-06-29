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

  /* ── Hero scroll → footer ────────────────────────────── */
  const heroScroll = document.querySelector('.hero__scroll');
  const footer = document.querySelector('footer');
  if (heroScroll && footer) {
    heroScroll.addEventListener('click', () => {
      footer.scrollIntoView({ behavior: 'smooth' });
    });
    heroScroll.style.cursor = 'pointer';
  }

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

  /* ── FAQ Accordion ───────────────────────────────────── */
  const faqGrid = document.getElementById('faqList');
  if (faqGrid && typeof faqData !== 'undefined') {
    const mid = Math.ceil(faqData.length / 2);
    const halves = [faqData.slice(0, mid), faqData.slice(mid)];

    halves.forEach((items) => {
      const ul = document.createElement('ul');
      ul.className = 'faq-list';
      ul.setAttribute('role', 'list');

      items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'faq-item';
        li.setAttribute('role', 'listitem');

        const button = document.createElement('button');
        button.className = 'faq-question';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', item.id + '-panel');
        button.setAttribute('id', item.id + '-btn');
        button.setAttribute('type', 'button');

        const textSpan = document.createElement('span');
        textSpan.className = 'faq-question__text';
        textSpan.textContent = item.question;

        const indicator = document.createElement('span');
        indicator.className = 'faq-indicator';
        indicator.setAttribute('aria-hidden', 'true');

        const barH = document.createElement('span');
        barH.className = 'faq-indicator__bar faq-indicator__bar--h';

        const barV = document.createElement('span');
        barV.className = 'faq-indicator__bar faq-indicator__bar--v';

        indicator.appendChild(barH);
        indicator.appendChild(barV);

        button.appendChild(textSpan);
        button.appendChild(indicator);

        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.setAttribute('id', item.id + '-panel');
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', item.id + '-btn');
        answer.setAttribute('hidden', '');

        const inner = document.createElement('div');
        inner.className = 'faq-answer__inner';
        inner.textContent = item.answer;
        answer.appendChild(inner);

        button.addEventListener('click', () => {
          const isOpen = li.classList.contains('is-open');
          if (isOpen) {
            li.classList.remove('is-open');
            button.setAttribute('aria-expanded', 'false');
            answer.removeAttribute('class');
            answer.classList.add('faq-answer');
            answer.setAttribute('hidden', '');
          } else {
            const parentUl = li.closest('.faq-list');
            const openInCol = parentUl.querySelectorAll('.faq-item.is-open');
            openInCol.forEach((openItem) => {
              openItem.classList.remove('is-open');
              const openBtn = openItem.querySelector('.faq-question');
              openBtn.setAttribute('aria-expanded', 'false');
              const openPanel = openItem.querySelector('.faq-answer');
              openPanel.removeAttribute('class');
              openPanel.classList.add('faq-answer');
              openPanel.setAttribute('hidden', '');
            });
            li.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
            answer.removeAttribute('class');
            answer.classList.add('faq-answer', 'is-open');
            answer.removeAttribute('hidden');
          }
        });

        li.appendChild(button);
        li.appendChild(answer);
        ul.appendChild(li);
      });

      faqGrid.appendChild(ul);
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