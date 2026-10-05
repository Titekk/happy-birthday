import { animate, stagger, onScroll, splitText, utils, createTimeline } from 'animejs';

/**
 * Animações de entrada e de scroll (referência: eloqwnt.com).
 * - Hero: linhas do título sobem de dentro de uma máscara.
 * - [data-reveal="block"]: container sobe e "abre" o recorte, sincronizado ao scroll.
 * - [data-reveal="lines"]: texto revelado linha a linha.
 * - [data-reveal="card"]: cards sobem ao entrar na tela.
 * - Mensagens: o card de baixo encolhe enquanto o próximo empilha por cima.
 */

function heroIntro() {
  const lines = document.querySelectorAll('.hero__line-inner');
  const intro = document.querySelectorAll('[data-intro]');
  utils.set(lines, { translateY: '110%' });
  utils.set(intro, { opacity: 0, translateY: 16 });

  createTimeline({ defaults: { ease: 'outExpo' } })
    .add(lines, { translateY: ['110%', '0%'], duration: 1400, delay: stagger(110) }, 150)
    .add(intro, { opacity: [0, 1], translateY: [16, 0], duration: 1000, delay: stagger(120) }, 700);
}

function blocks() {
  document.querySelectorAll('[data-reveal="block"]').forEach((el) => {
    animate(el, {
      translateY: [140, 0],
      clipPath: ['inset(10% 7% 0% 7% round 14px)', 'inset(0% 0% 0% 0% round 14px)'],
      ease: 'linear',
      autoplay: onScroll({ target: el, enter: 'bottom top', leave: 'center top', sync: 0.25 }),
    });
  });
}

function lines() {
  document.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
    // addEffect recria a animação se o texto for re-quebrado (resize / troca de fonte)
    splitText(el, { lines: { wrap: 'clip' } }).addEffect(({ lines: ls }) => {
      utils.set(ls, { translateY: '105%' });
      return animate(ls, {
        translateY: ['105%', '0%'],
        duration: 1100,
        delay: stagger(80),
        ease: 'outExpo',
        autoplay: onScroll({ target: el, enter: 'bottom-=10% top' }),
      });
    });
  });
}

function cards() {
  document.querySelectorAll('[data-reveal="card"]').forEach((el, i) => {
    utils.set(el, { opacity: 0, translateY: 90 });
    animate(el, {
      opacity: [0, 1],
      translateY: [90, 0],
      duration: 1300,
      delay: (i % 2) * 120,
      ease: 'outExpo',
      autoplay: onScroll({ target: el, enter: 'bottom-=5% top' }),
    });
  });
}

function messageStack() {
  const items = [...document.querySelectorAll('.message')];
  items.slice(0, -1).forEach((li, i) => {
    const card = li.querySelector('.message__card');
    const next = items[i + 1];
    animate(card, {
      scale: [1, 0.93],
      ease: 'linear',
      autoplay: onScroll({ target: next, enter: 'bottom top', leave: 'center top', sync: true }),
    });
  });
}

export function initReveals({ motion }) {
  if (!motion) return; // movimento reduzido: tudo fica estático e legível
  heroIntro();
  blocks();
  lines();
  cards();
  messageStack();
}
