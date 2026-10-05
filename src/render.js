/**
 * Monta o HTML de todas as seções a partir de content.js.
 * Nenhuma lógica de animação aqui — só estrutura semântica.
 */

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const pad = (n) => String(n).padStart(2, '0');

/** Converte ['texto', { accent: 'palavra' }] em HTML, com {name} substituído. */
function rich(parts, name, accentClass = 'accent') {
  const list = Array.isArray(parts) ? parts : [parts];
  return list
    .map((p) => {
      if (p && typeof p === 'object' && 'accent' in p) {
        return `<em class="${accentClass}">${esc(p.accent.replaceAll('{name}', name))}</em>`;
      }
      return esc(String(p).replaceAll('{name}', name));
    })
    .join('');
}

/** Texto puro (para aria-label / title). */
function plain(parts, name) {
  const list = Array.isArray(parts) ? parts : [parts];
  return list
    .map((p) => (p && typeof p === 'object' ? p.accent : String(p)))
    .join(' ')
    .replaceAll('{name}', name);
}

function media({ type = 'img', src, alt = '' }, label) {
  const inner =
    type === 'video'
      ? `<video src="${esc(src)}" muted loop playsinline preload="metadata" aria-hidden="true"></video>`
      : `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  return `<div class="media" data-label="${esc(label)}">${inner}</div>`;
}

function hero(c, name) {
  const lines = c.title
    .map((part) => `<span class="hero__line"><span class="hero__line-inner">${rich(part, name)}</span></span>`)
    .join('');
  return `
  <header class="hero section" id="inicio">
    <div class="hero__top" data-intro>
      <span class="label">${esc(c.kicker)}</span>
      <span class="label">${new Date().getFullYear()}</span>
    </div>
    <h1 class="hero__title" aria-label="${esc(plain(c.title, name))}">${lines}</h1>
    <div class="hero__bottom" data-intro>
      <p class="hero__sub">${esc(c.subtitle)}</p>
      <span class="label hero__hint" aria-hidden="true">Role para baixo</span>
    </div>
  </header>`;
}

function letter(c, name) {
  return `
  <section class="letter section" aria-labelledby="letter-label">
    <p class="label" id="letter-label">${esc(c.label)}</p>
    <div class="letter__body" data-reveal="block">
      ${c.paragraphs.map((p) => `<p data-reveal="lines">${rich(p, name)}</p>`).join('')}
      <p class="letter__sign" data-reveal="lines">— ${esc(c.signature)}</p>
    </div>
  </section>`;
}

function gallery(c, name) {
  const cards = c.items
    .map(
      (item, i) => `
      <article class="card" data-reveal="card">
        <header class="card__header">
          <span class="card__index">${pad(i + 1)}</span>
          <span class="card__meta">${esc(item.meta || '')}</span>
        </header>
        <button class="card__media" type="button" data-hover-media data-lightbox="${i}" aria-label="Ampliar foto: ${esc(item.title)}">
          ${media({ src: item.src, alt: item.title }, pad(i + 1))}
        </button>
        <footer class="card__footer">
          <h3 class="card__title">${esc(item.title)}</h3>
          <span class="card__cta" aria-hidden="true">ver</span>
        </footer>
      </article>`,
    )
    .join('');
  return `
  <section class="gallery section" aria-labelledby="gallery-title">
    <header class="section-head">
      <p class="label">${esc(c.label)}</p>
      <h2 class="section-title" id="gallery-title" data-reveal="lines">${rich(c.title, name)}</h2>
    </header>
    <div class="gallery__grid">${cards}</div>
  </section>`;
}

function messages(c, name) {
  const total = pad(c.items.length);
  const items = c.items
    .map(
      (m, i) => `
      <li class="message" style="--i:${i}">
        <div class="message__card">
          <span class="message__index">${pad(i + 1)} / ${total}</span>
          <p class="message__text">${rich(m, name)}</p>
        </div>
      </li>`,
    )
    .join('');
  return `
  <section class="messages section" aria-labelledby="messages-label">
    <header class="section-head section-head--light">
      <p class="label" id="messages-label">${esc(c.label)}</p>
    </header>
    <ol class="messages__stack">${items}</ol>
  </section>`;
}

function footer(c, name) {
  let n = 0;
  const rows = c.rows
    .map((row, r) => {
      const start = n;
      n += row.length;
      // A faixa é renderizada duas vezes: o loop anda -50% e recomeça sem emenda
      const items = row.map((m, i) => `<div class="marquee__item">${media(m, pad(start + i + 1))}</div>`).join('');
      return `
      <div class="marquee" data-marquee data-reverse="${r % 2 === 1}">
        <div class="marquee__track">${items}${items}</div>
      </div>`;
    })
    .join('');
  return `
  <footer class="footer section">
    <div class="footer__marquees" aria-hidden="true">${rows}</div>
    <div class="footer__closing">
      <h2 class="footer__title" data-reveal="lines">${rich(c.closing, name, 'accent accent--boxed')}</h2>
      <p class="footer__note label">${esc(c.note.replaceAll('{name}', name))}</p>
    </div>
  </footer>`;
}

function lightbox() {
  return `
  <div class="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" hidden>
    <button class="lightbox__close label" type="button">Fechar</button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
  </div>`;
}

/** Fotos/vídeos que ainda não existem viram um bloco bege numerado. */
function handleMissingMedia(root) {
  root.querySelectorAll('.media').forEach((box) => {
    const el = box.querySelector('img, video');
    const markMissing = () => box.classList.add('is-missing');
    el.addEventListener('error', markMissing, { once: true });
    if (el.tagName === 'IMG' && el.complete && el.naturalWidth === 0) markMissing();
  });
}

export function render(root, content) {
  const urlName = new URLSearchParams(location.search).get('name');
  const name = (urlName && urlName.trim().slice(0, 40)) || content.name;
  document.title = `Feliz aniversário, ${name}`;

  root.innerHTML = [
    hero(content.hero, name),
    letter(content.letter, name),
    gallery(content.gallery, name),
    messages(content.messages, name),
    footer(content.footer, name),
    lightbox(),
  ].join('');

  handleMissingMedia(root);
  return { name };
}
