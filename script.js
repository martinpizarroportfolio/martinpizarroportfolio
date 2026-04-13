gsap.registerPlugin(ScrollTrigger);

// ===================== Hero: Partículas píxel =====================
(function initPixelParticles() {
    const titleEl = document.querySelector('.hero-big-title');
    const heroEl  = document.querySelector('.hero-ref');
    if (!titleEl || !heroEl) return;

    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position: 'absolute', inset: '0',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '3'
    });
    heroEl.style.position = 'relative';
    heroEl.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = heroEl.offsetWidth;
        H = canvas.height = heroEl.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function getTextBounds() {
        const r  = titleEl.getBoundingClientRect();
        const hr = heroEl.getBoundingClientRect();
        return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height };
    }

    function spawn() {
        const b    = getTextBounds();
        const size = Math.random() < 0.55 ? 2 : (Math.random() < 0.8 ? 3 : 4);
        return {
            x:     b.x + Math.random() * b.w,
            y:     b.y + Math.random() * b.h,
            size,
            vx:    (Math.random() - 0.5) * 0.9,
            vy:    -(Math.random() * 1.1 + 0.15),
            alpha: Math.random() * 0.55 + 0.25,
            decay: 0.004 + Math.random() * 0.006,
            color: Math.random() < 0.55 ? '#ffffff' : '#c5f000',
        };
    }

    function tick() {
        ctx.clearRect(0, 0, W, H);
        if (Math.random() < 0.55) particles.push(spawn());
        if (Math.random() < 0.20) particles.push(spawn());
        particles = particles.filter(p => p.alpha > 0.01);
        for (const p of particles) {
            p.x    += p.vx;
            p.y    += p.vy;
            p.vy   *= 0.985;
            p.vx   *= 0.992;
            p.alpha -= p.decay;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle   = p.color;
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }

    setTimeout(tick, 1400);
})();

// ===================== Hero: Movimiento cinético =====================
(function initKineticTitle() {
    const floatEl = document.querySelector('.hero-title-float');
    if (!floatEl) return;

    function nextMove() {
        gsap.to(floatEl, {
            y:        gsap.utils.random(-24, -4),
            x:        gsap.utils.random(-6, 6),
            rotation: gsap.utils.random(-0.4, 0.4),
            duration: gsap.utils.random(2, 4),
            ease:     'sine.inOut',
            onComplete: nextMove
        });
    }

    function jitter() {
        gsap.to(floatEl, {
            skewX:    gsap.utils.random(-0.3, 0.3),
            skewY:    gsap.utils.random(-0.15, 0.15),
            duration: gsap.utils.random(0.4, 1.0),
            ease:     'power1.inOut',
            onComplete: jitter
        });
    }

    setTimeout(() => { nextMove(); jitter(); }, 1300);
})();

// ===================== Cursor =====================
const cursor   = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.set(cursor, { x: mx, y: my });
});
(function loop() {
  fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
  gsap.set(follower, { x: fx, y: fy });
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .service-row').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(follower, { width: 48, height: 48, borderColor: 'rgba(255,255,0,.65)', duration: .3 });
    gsap.to(cursor,   { opacity: 0, duration: .2 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(follower, { width: 28, height: 28, borderColor: 'rgba(255,255,0,.45)', duration: .3 });
    gsap.to(cursor,   { opacity: 1, duration: .2 });
  });
});

// ===================== Loader + Hero intro =====================
const tl = gsap.timeline();

tl
  .to('.loader-fill', { width: '100%', duration: 1.1, ease: 'power1.inOut' }, 0)
  .to('.loader',      { yPercent: -100, duration: .9, ease: 'power3.inOut' }, 1.2)
  .to('.nav',         { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }, '-=.4')
  .fromTo('.hw-l',    { x: '-16vw', opacity: 0 }, { x: 0, opacity: 1, duration: .85, ease: 'power3.out' }, '-=.25')
  .fromTo('.hw-r',    { x: '16vw',  opacity: 0 }, { x: 0, opacity: 1, duration: .85, ease: 'power3.out' }, '<')
  .fromTo('.hero-caption', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .5 }, '-=.3')
  .add(fanOpen(), '-=.4');

function fanOpen() {
  // posiciones finales del abanico: 6 tarjetas
  const positions = [
    { x: -310, ry: -52, rz: -6, z: -60 },
    { x: -186, ry: -32, rz: -3, z: -30 },
    { x:  -62, ry: -11, rz: -1, z:   0 },
    { x:   62, ry:  11, rz:  1, z:   0 },
    { x:  186, ry:  32, rz:  3, z: -30 },
    { x:  310, ry:  52, rz:  6, z: -60 },
  ];
  const cards = gsap.utils.toArray('.fan-card');
  const tl = gsap.timeline();
  cards.forEach((card, i) => {
    const p = positions[i];
    tl.to(card, {
      x: p.x, rotateY: p.ry, rotateZ: p.rz, z: p.z,
      duration: 1.2, ease: 'expo.out',
    }, i * 0.06);
  });
  return tl;
}

// ===================== Scroll animations =====================
// About
gsap.fromTo('.about-pills',
  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7,
  scrollTrigger: { trigger: '.about-pills', start: 'top 85%' }});

gsap.fromTo('.about-headline',
  { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out',
  scrollTrigger: { trigger: '.about-headline', start: 'top 85%' }});

gsap.utils.toArray('.about-item').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: .7, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }});
});

// Services
gsap.fromTo('.services-headline',
  { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8,
  scrollTrigger: { trigger: '.services-headline', start: 'top 85%' }});

gsap.utils.toArray('.service-row').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: .5, delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' }});
});

// CTA
gsap.fromTo('.cta-headline',
  { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
  scrollTrigger: { trigger: '.cta-headline', start: 'top 80%' }});

// Hover: tarjeta se acerca
document.querySelectorAll('.fan-card').forEach((card, i) => {
  const positions = [
    { x: -310, ry: -52, rz: -6, z: -60 },
    { x: -186, ry: -32, rz: -3, z: -30 },
    { x:  -62, ry: -11, rz: -1, z:   0 },
    { x:   62, ry:  11, rz:  1, z:   0 },
    { x:  186, ry:  32, rz:  3, z: -30 },
    { x:  310, ry:  52, rz:  6, z: -60 },
  ];
  const p = positions[i];
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { z: 80, scale: 1.06, duration: .35, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { z: p.z, scale: 1, duration: .4, ease: 'power2.out' });
  });
});
