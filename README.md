# happy-birthday

Site de aniversário feito com **Vite + JavaScript**, **anime.js** (animações e scroll), **three.js** (efeito nas fotos) e **Lenis** (scroll suave).

## Rodar localmente

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

Para trocar o nome pela URL: `http://localhost:5173/?name=Mariana`

## Personalizar

| O quê | Onde |
|---|---|
| Textos, títulos e mensagens | `src/content.js` (trechos `{ accent: '...' }` ficam em vermelho) |
| Fotos | `public/fotos/01.jpg` … `14.jpg` (veja `public/fotos/LEIA-ME.txt`) |
| Vídeos curtos (tocam como GIF) | `public/videos/01.mp4` … `04.mp4` (veja `public/videos/LEIA-ME.txt`) |
| Cores e fontes | `src/styles/tokens.css` |

Enquanto uma foto ou vídeo não existir, aparece um bloco numerado no lugar.

## Estrutura

```
src/
  content.js               textos + lista de mídias
  render.js                monta o HTML a partir do content
  main.js                  ponto de entrada
  modules/
    smooth-scroll.js       Lenis + loop de animação compartilhado
    scroll-reveal.js       entradas e animações ligadas ao scroll (anime.js)
    cards.js               foto ampliada (lightbox)
    hover-distortion.js    efeito WebGL no hover das fotos (three.js)
    marquee.js             faixas de fotos/vídeos do footer
  styles/
    tokens.css  base.css  sections.css
```

## Publicar

```bash
npm run build      # gera dist/
npm run preview    # testa o dist/ localmente
```

No GitHub, o workflow `.github/workflows/deploy.yml` publica o `dist/` no GitHub Pages a cada push na `master`.
Ative uma vez em **Settings → Pages → Source → GitHub Actions**.
