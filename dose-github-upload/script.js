/* Agrega las rutas a tus videos aquí. También puedes usar URLs directas a MP4. */
const videos = { reel: './assets/reel-hd.mp4', proyecto: './assets/proyecto-media5.mp4', servicio1: './assets/servicio-02.mp4', servicio2: './assets/producto-media1.mp4', servicio3: './assets/servicio-03.mp4', servicio4: './assets/servicio-04.mp4' };
document.querySelectorAll('[data-video]').forEach(slot => {
  const source = videos[slot.dataset.video];
  if (!source) return;
  const video = document.createElement('video');
  video.src = source;
  video.playsInline = true;
  video.preload = 'metadata';
  if (slot.dataset.video === 'reel') {
    video.muted = true;
    video.loop = true;
    video.autoplay = false;
    video.controls = true;
    video.setAttribute('aria-label', 'Reel de Estudio Dose');
  } else {
    video.controls = true;
    video.setAttribute('aria-label', slot.dataset.video === 'proyecto' ? 'Proyecto audiovisual de Estudio Dose' : 'Video del servicio audiovisual');
  }
  slot.replaceChildren(video);
  if (slot.dataset.video === 'reel' || slot.dataset.video === 'proyecto') {
    const cta = document.createElement('button');
    cta.type = 'button';
    cta.className = 'reel-play-cta';
    cta.textContent = slot.dataset.video === 'reel' ? 'Dale play. Mira la magia.' : '▶ Dale play';
    cta.setAttribute('aria-label', slot.dataset.video === 'reel' ? 'Reproducir el reel de Estudio Dose' : 'Reproducir el proyecto de Estudio Dose');
    cta.addEventListener('click', () => {
      video.muted = false;
      video.play().catch(() => { cta.disabled = false; });
    });
    video.addEventListener('play', () => {
      if (document.activeElement === cta) video.focus();
      cta.remove();
    }, { once: true });
    slot.append(cta);
  }
});

const track = document.querySelector('.cards');
const slides = [...track.querySelectorAll('.card')];
const dots = [...document.querySelectorAll('[data-slide]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
const endStyle = document.createElement('style');
endStyle.textContent = '.cards::after{display:none!important}.carousel-arrows button:disabled{opacity:.35;cursor:default}';
document.head.append(endStyle);
function syncArrows() {
  document.querySelector('[data-direction="-1"]').disabled = track.scrollLeft <= 1;
  document.querySelector('[data-direction="1"]').disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
}
function goToSlide(index) {
  const next = Math.max(0, Math.min(index, slides.length - 1));
  track.scrollTo({ left: slides[next].offsetLeft - slides[0].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
function updateCarousel() {
  const position = track.scrollLeft;
  syncArrows();
  activeSlide = slides.reduce((closest, slide, index) => Math.abs(slide.offsetLeft - slides[0].offsetLeft - position) < Math.abs(slides[closest].offsetLeft - slides[0].offsetLeft - position) ? index : closest, 0);
  if (position > 1 && position >= track.scrollWidth - track.clientWidth - 1) activeSlide = slides.length - 1;
  dots.forEach((dot, index) => { if (index === activeSlide) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
  document.querySelector('.carousel-status').textContent = `${String(activeSlide + 1).padStart(2, '0')} / 04`;
}
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => goToSlide(activeSlide + Number(button.dataset.direction))));
track.addEventListener('keydown', event => {
  if (event.target !== track) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1)); }
});
track.addEventListener('scroll', updateCarousel, { passive: true });
window.addEventListener('resize', updateCarousel);

updateCarousel();
