document.addEventListener('DOMContentLoaded', () => {
  const galleryRoot = document.querySelector('.gallery');
  if (!galleryRoot) {
    console.error('🔴 .gallery não foi encontrada no DOM.');
    return;
  }

  const thumbs = Array.from(galleryRoot.querySelectorAll('img'));
  if (!thumbs.length) {
    console.error('🔴 Não foram encontradas imagens dentro de .gallery.');
    return;
  }

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const btnClose = document.getElementById('lbClose');
  const btnPrev = document.getElementById('lbPrev');
  const btnNext = document.getElementById('lbNext');

  if (!lightbox || !lbImg || !btnClose || !btnPrev || !btnNext) {
    console.error('🔴 Elementos do lightbox em falta no HTML.');
    return;
  }

  let current = 0;

  function openAt(index) {
    current = (index + thumbs.length) % thumbs.length;
    const t = thumbs[current];
    const fullSrc = t.dataset.full || t.src;
    lbImg.src = fullSrc;
    lbCaption.textContent = t.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeBox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
  }

  function next() { openAt(current + 1); }
  function prev() { openAt(current - 1); }

  // Delegação de eventos na galeria
  galleryRoot.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img || !galleryRoot.contains(img)) return;
    e.preventDefault();
    const idx = thumbs.indexOf(img);
    if (idx > -1) openAt(idx);
  });

  btnClose.addEventListener('click', closeBox);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  // Fechar ao clicar fora da imagem
  lightbox.addEventListener('click', (e) => {
    const inside = e.target.closest('.lb-viewport, .lb-nav, .lb-close');
    if (!inside) closeBox();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Swipe mobile
  let startX = null;
  lbImg.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; });
  lbImg.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].screenX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    startX = null;
  });

  console.log(`✅ Waterfall/Modal ativo com ${thumbs.length} imagens.`);
});
