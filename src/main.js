import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { content } from './content.js';
import { render } from './render.js';
import { initSmoothScroll, motionOK } from './modules/smooth-scroll.js';
import { initReveals } from './modules/scroll-reveal.js';
import { initCards } from './modules/cards.js';
import { initMarquees } from './modules/marquee.js';

/** Só carrega o three.js se o efeito puder rodar (mouse + WebGL + movimento permitido). */
function canUseHoverGL() {
  if (!motionOK || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const root = document.getElementById('app');
render(root, content);

initSmoothScroll();
initReveals({ motion: motionOK });
initCards({ items: content.gallery.items, motion: motionOK });
initMarquees({ motion: motionOK });

if (canUseHoverGL()) {
  import('./modules/hover-distortion.js').then((m) => m.initHoverDistortion());
}
