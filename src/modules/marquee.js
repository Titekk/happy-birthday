import { animate } from 'animejs';
import { onFrame, scrollVelocity } from './smooth-scroll.js';

/**
 * Faixas de fotos/vídeos em loop infinito no footer (referência: damngoodbrands.com).
 * Cada faixa está duplicada no HTML, então andar -50% fecha o ciclo sem emenda.
 * A velocidade acelera um pouco com a velocidade do scroll.
 */

const PX_PER_SECOND = 45;

function playVideosWhenVisible(root) {
  const videos = root.querySelectorAll('.footer video');
  if (!videos.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (target.closest('.media')?.classList.contains('is-missing')) return;
        isIntersecting ? target.play().catch(() => {}) : target.pause();
      });
    },
    { rootMargin: '100px' },
  );
  videos.forEach((v) => io.observe(v));
}

export function initMarquees({ motion }) {
  const anims = [];

  document.querySelectorAll('[data-marquee]').forEach((row) => {
    const track = row.querySelector('.marquee__track');
    const reverse = row.dataset.reverse === 'true';
    const period = track.scrollWidth / 2;
    if (!motion || !period) return;

    anims.push(
      animate(track, {
        translateX: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
        duration: (period / PX_PER_SECOND) * 1000,
        ease: 'linear',
        loop: true,
      }),
    );
  });

  if (motion) playVideosWhenVisible(document);

  // acelera com o scroll e volta suavemente ao normal
  let speed = 1;
  onFrame(() => {
    const target = 1 + Math.min(Math.abs(scrollVelocity()) * 0.12, 4);
    speed += (target - speed) * 0.08;
    anims.forEach((a) => (a.speed = speed));
  });
}
