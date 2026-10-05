import { animate } from 'animejs';
import { lockScroll } from './smooth-scroll.js';

/**
 * Clique na foto de um card abre a foto ampliada (lightbox).
 * Fecha com o botão, clique fora da foto ou tecla Esc.
 */
export function initCards({ items, motion }) {
  const box = document.querySelector('.lightbox');
  const img = box.querySelector('.lightbox__img');
  const caption = box.querySelector('.lightbox__caption');
  const closeBtn = box.querySelector('.lightbox__close');
  let opener = null;

  const open = (i, trigger) => {
    const item = items[i];
    if (!item || trigger.querySelector('.media.is-missing')) return;
    opener = trigger;
    img.src = item.src;
    img.alt = item.title;
    caption.textContent = item.title;
    box.hidden = false;
    lockScroll(true);
    closeBtn.focus();
    if (motion) {
      animate(box, { opacity: [0, 1], duration: 400, ease: 'outQuad' });
      animate(img, { scale: [0.94, 1], opacity: [0, 1], duration: 900, ease: 'outExpo' });
    }
  };

  const close = () => {
    if (box.hidden) return;
    const done = () => {
      box.hidden = true;
      lockScroll(false);
      opener?.focus();
    };
    if (motion) animate(box, { opacity: [1, 0], duration: 300, ease: 'inQuad', onComplete: done });
    else done();
  };

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => open(Number(trigger.dataset.lightbox), trigger));
  });
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
