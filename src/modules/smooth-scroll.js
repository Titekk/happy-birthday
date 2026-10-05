import Lenis from 'lenis';

/**
 * Scroll suave (Lenis, como no eloqwnt) + um único loop de requestAnimationFrame
 * compartilhado com o three.js e o marquee.
 */

export const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const subscribers = new Set();
let lenis = null;

/** Registra uma função chamada a cada frame. Retorna a função de cancelamento. */
export function onFrame(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Velocidade atual do scroll (px/frame). 0 sem Lenis. */
export function scrollVelocity() {
  return lenis ? lenis.velocity : 0;
}

export function lockScroll(locked) {
  if (!lenis) {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    return;
  }
  locked ? lenis.stop() : lenis.start();
}

export function initSmoothScroll() {
  if (motionOK) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
  }

  const loop = (time) => {
    lenis?.raf(time);
    subscribers.forEach((fn) => fn(time));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return lenis;
}
