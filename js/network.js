/* network: experience & skills as a neural net.
   Hovering a skill (output unit) sends a gradient backward — in orange — to every
   role/project (hidden unit) that used it. Hovering a role runs it forward — in
   indigo — into the skills it produced. While you scroll, the role at the reading
   line runs forward on its own. Project cards call NET.trace(id) to jump here.
   Wires are re-routed from live element positions each frame, so they stay attached
   while the page and the sticky skill column move. */
(function () {
  'use strict';
  const bp = document.getElementById('bp');
  if (!bp) return;
  const svg = document.getElementById('bp-svg');
  const caption = document.getElementById('bp-caption');
  const NS = 'http://www.w3.org/2000/svg';
  const DEFAULT_CAPTION = caption.textContent;
  const wideMQ = matchMedia('(min-width: 900px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();

  const entries = Array.from(bp.querySelectorAll('.hnode')).map((el) => {
    const uses = {};
    el.dataset.uses.split(/\s+/).forEach((pair) => { const [k, v] = pair.split(':'); uses[k] = parseFloat(v); });
    return { el, uses, grad: el.querySelector('.hnode__grad'), title: el.querySelector('h3') };
  });
  const skills = Array.from(bp.querySelectorAll('.skill'));
  const LABEL = {};
  skills.forEach((s) => { LABEL[s.dataset.skill] = s.textContent.trim(); });

  let links = [], mode = null, user = false, autoEntry = null, autoAcc = 0, sectionVisible = false, pinnedUntil = 0, pinY = null;

  function mk(tag, cls) {
    const el = document.createElementNS(NS, tag);
    if (cls) el.setAttribute('class', cls);
    svg.appendChild(el);
    return el;
  }

  function clear() {
    links = []; mode = null; svg.innerHTML = '';
    entries.forEach((e) => { e.el.classList.remove('grad-hit', 'fwd-src'); e.el.style.removeProperty('--g'); e.grad.textContent = ''; });
    skills.forEach((s) => { s.classList.remove('is-source', 'fwd-hit'); s.style.removeProperty('--g'); });
    caption.textContent = DEFAULT_CAPTION;
  }

  const anchorY = (r, otherMid) => { const inset = Math.min(18, r.height / 2); return clamp(otherMid, r.top + inset, r.bottom - inset); };

  function route(a, b, box, jit) {
    const side = a.right <= b.left + 8 || b.right <= a.left + 8;
    if (side) {
      const lr = a.left < b.left;
      const x0 = (lr ? a.right : a.left) - box.left, x1 = (lr ? b.left : b.right) - box.left;
      const ya = anchorY(a, b.top + b.height / 2);
      const y0 = ya - box.top, y1 = anchorY(b, ya) - box.top;
      const bend = Math.max(40, Math.abs(x1 - x0) * 0.5), s = lr ? 1 : -1;
      return { d: `M${x0},${y0} C${x0 + s * bend},${y0} ${x1 - s * bend},${y1} ${x1},${y1}`, x0, y0, x1, y1 };
    }
    const up = a.top > b.top;
    const x0 = a.left + a.width / 2 - box.left, y0 = (up ? a.top : a.bottom) - box.top;
    const x1 = b.left + 24 + jit * Math.max(0, b.width - 48) - box.left, y1 = (up ? b.bottom : b.top) - box.top;
    const my = (y0 + y1) / 2;
    return { d: `M${x0},${y0} C${x0},${my} ${x1},${my} ${x1},${y1}`, x0, y0, x1, y1 };
  }

  function link(from, to, strength, color, delay, onArrive) {
    const glow = mk('path', 'bp-glow'), base = mk('path', 'bp-base'), pulse = mk('path', 'bp-pulse');
    const p0 = mk('circle', 'bp-port'), p1 = mk('circle', 'bp-port bp-port--end'), head = mk('circle', 'bp-head');
    [glow, base, pulse, p0, p1, head].forEach((el) => el.style.setProperty('--c', color));
    base.style.strokeWidth = (0.8 + strength * 1.6).toFixed(2);
    pulse.style.strokeWidth = (1.4 + strength * 2).toFixed(2);
    glow.style.strokeWidth = (5 + strength * 5).toFixed(2);
    p0.setAttribute('r', 2.6); p1.setAttribute('r', 0); head.setAttribute('r', 3.4);
    links.push({
      from, to, strength, glow, base, pulse, p0, p1, head, onArrive,
      jit: hash(links.length * 7.31 + strength * 13), start: performance.now() + delay,
      dur: reduced ? 1 : 620 + (1 - strength) * 260, arrived: false, arrivedAt: 0, flow: 1300 + (1 - strength) * 900,
    });
  }

  function tick(dt) {
    followScroll(dt);
    if (!links.length) return;
    const box = bp.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('width', box.width); svg.setAttribute('height', box.height);
    const rects = new Map(), wide = wideMQ.matches;
    const rect = (el) => {
      let r = rects.get(el);
      if (r) return r;
      r = el.getBoundingClientRect();
      if (wide && el.classList.contains('skill')) { // plug into the panel edge on the chip's row
        const g = el.closest('.skill-group').getBoundingClientRect();
        r = { left: g.left, right: g.left + 1, top: r.top, bottom: r.bottom, width: 1, height: r.height };
      }
      rects.set(el, r);
      return r;
    };
    const now = performance.now();
    for (const l of links) {
      const g = route(rect(l.from), rect(l.to), box, l.jit);
      l.glow.setAttribute('d', g.d); l.base.setAttribute('d', g.d); l.pulse.setAttribute('d', g.d);
      l.p0.setAttribute('cx', g.x0); l.p0.setAttribute('cy', g.y0);
      l.p1.setAttribute('cx', g.x1); l.p1.setAttribute('cy', g.y1);
      const len = l.base.getTotalLength() || 1;
      const t = (now - l.start) / l.dur;
      if (t < 0) { l.base.style.opacity = '0'; l.p0.style.opacity = '0'; continue; }
      l.base.style.opacity = ''; l.p0.style.opacity = '';
      const k = Math.min(1, t), e = 1 - Math.pow(1 - k, 3);
      l.base.style.strokeDasharray = `${len} ${len}`;
      l.base.style.strokeDashoffset = `${len * (1 - e)}`;
      const seg = Math.min(len * 0.35, 46 + l.strength * 34);
      const h = !l.arrived ? e * len : (((now - l.arrivedAt) / l.flow) % 1) * (len + seg);
      const dash = `${seg} ${len + seg}`, off = `${seg - h}`;
      l.pulse.style.strokeDasharray = dash; l.pulse.style.strokeDashoffset = off;
      l.glow.style.strokeDasharray = dash; l.glow.style.strokeDashoffset = off;
      if (!l.arrived) {
        const pt = l.base.getPointAtLength(len * e);
        l.head.setAttribute('cx', pt.x); l.head.setAttribute('cy', pt.y); l.head.style.opacity = '1';
      } else l.head.style.opacity = '0';
      if (k >= 1 && !l.arrived) {
        l.arrived = true; l.arrivedAt = now;
        l.p1.setAttribute('r', 2.6); l.p1.classList.add('is-hit');
        if (l.onArrive) l.onArrive();
      }
    }
  }

  function backward(skill) {
    clear();
    mode = 'backward';
    const id = skill.dataset.skill, color = css('--acc');
    skill.classList.add('is-source');
    const hits = entries.filter((e) => e.uses[id] !== undefined);
    let norm = 0;
    hits.forEach((e, i) => {
      const g = e.uses[id];
      norm += g * g;
      link(skill, e.el, g, color, i * 110, () => {
        e.el.classList.add('grad-hit');
        e.el.style.setProperty('--g', g);
        e.grad.textContent = `∂L/∂w = ${g.toFixed(2)}`;
      });
    });
    caption.style.color = color;
    caption.textContent = `backward(): ∂L/∂[${LABEL[id]}] → ${hits.length} hidden unit${hits.length === 1 ? '' : 's'} · ‖∇‖ = ${Math.sqrt(norm).toFixed(2)}`;
  }

  function forward(entry, how) {
    clear();
    mode = how === 'scroll' ? 'auto' : 'forward';
    const ids = Object.keys(entry.uses).sort((a, b) => entry.uses[b] - entry.uses[a]);
    const color = css('--indigo');
    entry.el.classList.add('fwd-src');
    ids.forEach((id, i) => {
      const s = skills.find((x) => x.dataset.skill === id);
      if (!s) return;
      const w = entry.uses[id];
      link(entry.el, s, w, color, i * 55, () => { s.classList.add('fwd-hit'); s.style.setProperty('--g', w); });
    });
    caption.style.color = color;
    caption.textContent = `forward(${how}): ${entry.title.textContent.split('·')[0].trim()} → ${ids.length} output units`;
  }

  function followScroll(dt) {
    autoAcc += dt;
    if (autoAcc < 0.12) return;
    autoAcc = 0;
    if (pinY !== null) { if (performance.now() < pinnedUntil || Math.abs(scrollY - pinY) < 220) return; pinY = null; }
    if (user || reduced || !wideMQ.matches || performance.now() < pinnedUntil) return;
    if (!sectionVisible) { if (mode === 'auto') { clear(); autoEntry = null; } return; }
    const line = innerHeight * 0.42;
    let best = null, bestD = Infinity;
    for (const e of entries) {
      const r = e.el.getBoundingClientRect();
      if (r.bottom < 60 || r.top > innerHeight - 60) continue;
      const d = line < r.top ? r.top - line : line > r.bottom ? line - r.bottom : 0;
      if (d < bestD) { bestD = d; best = e; }
    }
    if (!best) { if (mode === 'auto') { clear(); autoEntry = null; } return; }
    if (best !== autoEntry || mode !== 'auto') { autoEntry = best; forward(best, 'scroll'); }
  }

  function release() { user = false; autoEntry = null; clear(); }

  skills.forEach((s) => {
    s.addEventListener('pointerenter', () => { user = true; backward(s); });
    s.addEventListener('focus', () => { user = true; backward(s); });
    s.addEventListener('click', () => { user = true; backward(s); });
  });
  entries.forEach((e) => {
    e.el.addEventListener('pointerenter', (ev) => { if (ev.pointerType === 'mouse') { user = true; forward(e, 'hover'); } });
  });
  bp.addEventListener('pointerleave', (ev) => { if (ev.pointerType === 'mouse') release(); });
  bp.addEventListener('focusout', (ev) => { if (!bp.contains(ev.relatedTarget)) release(); });
  bp.querySelector('.bp__skills').addEventListener('pointerleave', (ev) => {
    if (ev.pointerType === 'mouse' && !(ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('.hnode'))) release();
  });

  new IntersectionObserver(([e]) => { sectionVisible = e.isIntersecting; }).observe(bp);

  // called by the "trace skills" buttons on project cards
  window.NET = {
    trace(id) {
      const entry = entries.find((e) => e.el.id === id);
      if (!entry) return;
      entry.el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      user = false;
      pinnedUntil = performance.now() + 2600;
      setTimeout(() => {
        entry.el.classList.remove('is-traced'); void entry.el.offsetWidth; entry.el.classList.add('is-traced');
        forward(entry, 'trace');
        autoEntry = entry;
        pinnedUntil = performance.now() + 1200; // then hold until the visitor scrolls away
        pinY = scrollY;
      }, reduced ? 0 : 650);
    },
  };

  let last = performance.now();
  (function frame(now) {
    const dt = Math.min(0.034, (now - last) / 1000); last = now;
    tick(dt);
    requestAnimationFrame(frame);
  })(last);
})();
