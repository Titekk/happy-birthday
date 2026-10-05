import * as THREE from 'three';
import { animate } from 'animejs';
import { onFrame } from './smooth-scroll.js';

/**
 * Hover nas fotos (referência: corentinbernadou.com, que usa three.js).
 * Um único canvas WebGL fixo desenha cada foto num plano alinhado à <img> original.
 * No hover: zoom leve, ondulação radial a partir do cursor e um pequeno desvio RGB.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uSize;      // tamanho do plano em px
  uniform vec2 uImage;     // tamanho natural da imagem
  uniform vec2 uMouse;     // cursor em UV
  uniform float uHover;    // 0..1
  uniform float uTime;
  uniform float uRadius;   // raio da borda em px
  varying vec2 vUv;

  // object-fit: cover
  vec2 cover(vec2 uv) {
    float rp = uSize.x / uSize.y;
    float ri = uImage.x / uImage.y;
    vec2 s = rp > ri ? vec2(1.0, ri / rp) : vec2(rp / ri, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 uv = vUv;

    // zoom
    uv = (uv - 0.5) / (1.0 + 0.07 * uHover) + 0.5;

    // ondulação a partir do cursor
    vec2 toMouse = vUv - uMouse;
    float d = length(toMouse * vec2(uSize.x / uSize.y, 1.0));
    float wave = sin(d * 22.0 - uTime * 2.6) * 0.010 * uHover * smoothstep(0.6, 0.0, d);
    uv += normalize(toMouse + 1e-4) * wave;

    // desvio RGB
    vec2 shift = vec2(0.0035 * uHover, 0.0);
    vec2 base = cover(uv);
    float r = texture2D(uTex, base + shift).r;
    float g = texture2D(uTex, base).g;
    float b = texture2D(uTex, base - shift).b;

    // bordas arredondadas iguais às do CSS
    float dist = roundedBox((vUv - 0.5) * uSize, uSize * 0.5, uRadius);
    float alpha = 1.0 - smoothstep(-1.0, 0.0, dist);

    gl_FragColor = vec4(r, g, b, alpha);
  }
`;

// A checagem de elegibilidade (mouse + WebGL + movimento) fica em main.js,
// antes do import dinâmico — assim o three.js nem é baixado no celular.
export function initHoverDistortion() {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.className = 'gl-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  document.body.appendChild(renderer.domElement);
  document.documentElement.classList.add('has-gl');

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera();
  camera.position.z = 10;
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  const setCamera = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    Object.assign(camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2, near: 0, far: 100 });
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  setCamera();
  window.addEventListener('resize', setCamera);

  const items = [];

  const addItem = (trigger, box, img) => {
    const texture = new THREE.Texture(img);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const uniforms = {
      uTex: { value: texture },
      uSize: { value: new THREE.Vector2(1, 1) },
      uImage: { value: new THREE.Vector2(img.naturalWidth, img.naturalHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uTime: { value: 0 },
      uRadius: { value: parseFloat(getComputedStyle(trigger).borderTopLeftRadius) || 0 },
    };
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true }),
    );
    scene.add(mesh);

    const item = { trigger, mesh, uniforms, mouse: new THREE.Vector2(0.5, 0.5), hoverAnim: null };
    items.push(item);
    box.classList.add('is-gl');

    const toUv = (e) => {
      const r = trigger.getBoundingClientRect();
      item.mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    const setHover = (value, duration) => {
      item.hoverAnim?.pause();
      item.hoverAnim = animate(uniforms.uHover, { value, duration, ease: 'outExpo' });
    };

    trigger.addEventListener('pointerenter', (e) => {
      toUv(e);
      uniforms.uMouse.value.copy(item.mouse);
      setHover(1, 900);
    });
    trigger.addEventListener('pointermove', toUv);
    trigger.addEventListener('pointerleave', () => setHover(0, 1100));
  };

  document.querySelectorAll('[data-hover-media]').forEach((trigger) => {
    const box = trigger.querySelector('.media');
    const img = box?.querySelector('img');
    if (!img) return;
    const ready = () => {
      if (img.naturalWidth > 0 && !box.classList.contains('is-missing')) addItem(trigger, box, img);
    };
    if (img.complete) ready();
    else img.addEventListener('load', ready, { once: true });
  });

  let last = 0;
  onFrame((time) => {
    const dt = last ? (time - last) / 1000 : 0;
    last = time;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (const it of items) {
      const r = it.trigger.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < vh && r.width > 0;
      it.mesh.visible = visible;
      if (!visible) continue;

      it.mesh.scale.set(r.width, r.height, 1);
      it.mesh.position.set(r.left + r.width / 2 - vw / 2, -(r.top + r.height / 2) + vh / 2, 0);
      it.uniforms.uSize.value.set(r.width, r.height);
      it.uniforms.uMouse.value.lerp(it.mouse, 0.12);
      it.uniforms.uTime.value += dt;
    }

    renderer.render(scene, camera);
  });
}
