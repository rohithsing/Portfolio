/* Rohith Singh · portfolio
   One knob — temperature — sets the tone the whole site writes in. */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const gauss = () => {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ---------- colours from CSS tokens ---------- */
  const C = {};
  function readColors() {
    const s = getComputedStyle(root);
    ['bg', 'paper', 'ink', 'ink-2', 'ink-3', 'line', 'acc', 'acc-2', 'indigo', 'scr', 'scr-2', 'scr-ink', 'scr-ink-2', 'scr-line']
      .forEach((k) => { C[k] = s.getPropertyValue('--' + k).trim(); });
  }
  readColors();

  function fit(cv) {
    const r = cv.getBoundingClientRect(), d = DPR();
    cv.width = Math.max(1, Math.round(r.width * d));
    cv.height = Math.max(1, Math.round(r.height * d));
    const ctx = cv.getContext('2d');
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { ctx, w: r.width, h: r.height };
  }

  /* ---------- theme ---------- */
  const saved = store.get('theme');
  if (saved) root.dataset.theme = saved;
  $('#theme').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
    readColors();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);

  /* ---------- top bar, progress, active section ---------- */
  const top = $('.top'), prog = $('#progress');
  const onScroll = () => {
    top.classList.toggle('is-scrolled', scrollY > 10);
    const max = root.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const navLinks = $$('.top__nav a');
  const navIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach((s) => navIO.observe(s));

  /* ---------- reveal on scroll ---------- */
  $$('.sec .label, .sec .title, .sec .lede, .llm, .facts, .proj, .timeline li, .talk__grid').forEach((el) => el.classList.add('rv'));
  const revealIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
  }), { threshold: 0.08 });
  $$('.rv').forEach((el) => revealIO.observe(el));

  /* =====================================================================
     TEMPERATURE → TONE.
     Low T = formal and concise (recruiter mode), high T = playful.
     It rewrites the copy, drives the describe-me sampler, the chat's
     voice and the drafted message, and adds noise to the hero name.
     ===================================================================== */
  let T = 0.7;
  const toneOf = (t) => (t < 0.4 ? 'formal' : t <= 1.2 ? 'balanced' : 'playful');
  let tone = toneOf(T);
  const tListeners = [];
  const onT = (fn) => tListeners.push(fn);

  const COPY = {
    hero: {
      formal: 'AI/ML engineer. I build, evaluate and ship machine-learning systems on real-world data.',
      balanced: 'AI/ML engineer in training. I build models on real, messy data.',
      playful: 'I teach machines to learn, then argue with them about their loss function.',
    },
    about: {
      formal: 'A small language model summarises my profile one phrase at a time. Select a phrase, or press <b>sample</b>.',
      balanced: 'A language model picks the next word by probability. Click a word to choose it, or press <b>sample</b>. Raise the temperature and the unlikely, sillier words get more chances.',
      playful: 'A language model is about to describe me. Turn the temperature up and it starts making things up. Pick words yourself, or let it roll the dice with <b>sample</b>.',
    },
    work: {
      formal: 'Five projects, each with a working demo. Links lead to the code, the paper and the live apps. <b>trace skills</b> shows which skills each one used.',
      balanced: 'Every project has a tiny working toy. Play with one, then press <b>trace skills</b> to watch it fire through the network below.',
      playful: 'Five models, five tiny toys. Poke them, they don\'t bite. Then hit <b>trace skills</b> and watch the neurons panic.',
    },
    network: {
      formal: 'Roles and projects form the hidden layer; skills form the output layer. Hover a skill to see where it was applied, or a role to see the skills it required.',
      balanced: 'Roles and projects are the hidden layer; skills are the output layer. Scroll and the one at the reading line runs forward into its skills. Hover a skill to send its gradient backward.',
      playful: 'My brain, drawn as a neural net. Hover a skill and the blame flows backward to whatever taught it. Hover a job and watch everything it made me learn light up.',
    },
    talk: {
      formal: 'Open to AI/ML Engineer, ML Engineer, GenAI, Data Scientist, Data Analyst and Data Engineer roles. The assistant below drafts an introductory message for you.',
      balanced: 'AI/ML Engineer, ML Engineer, GenAI, Data Scientist, Data Analyst and Data Engineer. Chat with the tiny model below and it will write the first message for you.',
      playful: 'AI/ML, ML, GenAI, data science, data analysis, data engineering: if it has data in it, I\'m in. The tiny model below will even write your message. Low effort, high reward.',
    },
    foot: {
      formal: 'Thank you for visiting.',
      balanced: 'loss converged. thanks for scrolling ♥',
      playful: 'global minimum reached. you may now close the tab (please don\'t).',
    },
  };

  function applyTone(flash) {
    $$('[data-tone]').forEach((el) => {
      const html = COPY[el.dataset.tone] && COPY[el.dataset.tone][tone];
      if (!html || el.innerHTML === html) return;
      el.innerHTML = html;
      if (flash && !reduced) {
        el.classList.add('is-retoned');
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-retoned')));
      }
    });
  }

  const tRange = $('#temp-range'), tBox = $('#temp');
  function setT(v, flash) {
    T = v;
    $('#temp-val').textContent = v.toFixed(1);
    $$('[data-tval]').forEach((el) => { el.textContent = v.toFixed(1); });
    const next = toneOf(v);
    const changed = next !== tone;
    tone = next;
    tBox.dataset.tone = tone;
    $('#temp-tone').textContent = tone;
    if (changed || !flash) applyTone(flash);
    tListeners.forEach((fn) => fn(v, changed));
    store.set('temp', v);
  }
  tRange.addEventListener('input', () => { tBox.classList.remove('is-hint'); setT(parseFloat(tRange.value), true); });
  if (!store.get('temp')) { // first visit: show what the knob does for a few seconds
    setTimeout(() => tBox.classList.add('is-hint'), 2200);
    setTimeout(() => tBox.classList.remove('is-hint'), 8200);
  }
  const savedT = parseFloat(store.get('temp'));
  if (!isNaN(savedT)) tRange.value = savedT;
  setT(parseFloat(tRange.value), false);

  /* =====================================================================
     HERO: the name, generated by reverse diffusion. The cursor adds noise.
     ===================================================================== */
  (function hero() {
    const cv = $('#diffuse'), tStep = $('#t-step');
    let ctx, w, h, P = [], tGlobal = 1, visible = true, gap = 4;
    const ptr = { x: -1e4, y: -1e4, active: false };

    function layout() {
      const narrow = cv.parentElement.getBoundingClientRect().width < 620;
      cv.style.height = narrow ? Math.min(cv.getBoundingClientRect().width * 0.62, 340) + 'px' : '';
      ({ ctx, w, h } = fit(cv));
      gap = w < 620 ? 3 : w < 1000 ? 4 : 5;

      const off = document.createElement('canvas');
      off.width = Math.ceil(w); off.height = Math.ceil(h);
      const o = off.getContext('2d');
      const words = ['Rohith', 'Singh'];
      const font = (s, i) => `${i ? 'italic ' : ''}400 ${s}px "Instrument Serif", Georgia, serif`;
      o.font = font(100, 0);
      const m0 = o.measureText(words[0]);
      o.font = font(100, 1);
      const m1 = o.measureText(words[1]), sp = 22;
      const asc = Math.max(m0.actualBoundingBoxAscent, m1.actualBoundingBoxAscent);
      const desc = Math.max(m0.actualBoundingBoxDescent, m1.actualBoundingBoxDescent);
      let size, lines;
      if (!narrow) {
        size = Math.min(100 * (w * 0.97) / (m0.width + sp + m1.width), 100 * (h * 0.92) / (asc + desc));
        const k = size / 100, y = (h - (asc + desc) * k) / 2 + asc * k;
        lines = [[0, 2, y], [1, 2 + (m0.width + sp) * k, y]];
      } else {
        size = Math.min(100 * (w * 0.97) / Math.max(m0.width, m1.width), 100 * (h * 0.47) / (asc + desc));
        const k = size / 100, lh = (asc + desc) * k, y0 = (h - lh * 2.02) / 2 + asc * k;
        lines = [[0, 2, y0], [1, 2, y0 + lh * 1.02]];
      }
      lines.forEach(([i, x, y]) => { o.font = font(size, i); o.fillStyle = i ? '#0f0' : '#f00'; o.fillText(words[i], x, y); });
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const had = P.length;
      P = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          const k = (y * off.width + x) * 4;
          if (data[k + 3] < 140) continue;
          P.push({ tx: x, ty: y, word: data[k + 1] > data[k] ? 1 : 0, ex: gauss(), ey: gauss(), d: 0, j: Math.random() * 6.28 });
        }
      }
      if (had) tGlobal = Math.max(tGlobal, 0.35);
    }

    const sigma = (t) => t * t * Math.max(w, h) * 0.45;

    function frame(now) {
      if (!visible) return;
      const floor = clamp((T - 1.2) / 0.8, 0, 1) * 0.1;  // playful temperatures leave a little noise in
      if (tGlobal > 0) tGlobal = Math.max(0, tGlobal - (reduced ? 1 : 0.0075));
      const sG = sigma(Math.max(tGlobal, floor));
      const R = Math.max(60, w * 0.08);
      let maxD = 0;
      ctx.clearRect(0, 0, w, h);
      const sz = gap * 0.78;
      for (const p of P) {
        if (ptr.active) {
          const dx = p.tx - ptr.x, dy = p.ty - ptr.y, dd = dx * dx + dy * dy;
          if (dd < R * R) p.d = Math.min(1, p.d + (1 - Math.sqrt(dd) / R) * 0.22);
        }
        p.d *= 0.955;
        if (p.d < 0.002) p.d = 0;
        if (p.d > maxD) maxD = p.d;
        const s = sG + p.d * R * 0.9;
        const jit = s > 0.5 ? Math.min(s, 30) * 0.06 : 0;
        const x = p.tx + p.ex * s + Math.cos(now * 0.004 + p.j) * jit;
        const y = p.ty + p.ey * s + Math.sin(now * 0.005 + p.j) * jit;
        ctx.fillStyle = p.d > 0.25 ? C.indigo : p.word ? C.acc : C.ink;
        ctx.globalAlpha = 1 - Math.min(0.6, s / (w * 0.5));
        ctx.fillRect(x, y, sz, sz);
      }
      ctx.globalAlpha = 1;
      tStep.textContent = String(Math.round(1000 * Math.max(tGlobal * tGlobal, maxD * 0.7, floor))).padStart(4, '0');
      requestAnimationFrame(frame);
    }

    function setPtr(e) {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.active = true;
    }
    cv.addEventListener('pointermove', setPtr);
    cv.addEventListener('pointerdown', setPtr);
    cv.addEventListener('pointerleave', () => { ptr.active = false; });
    cv.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') ptr.active = false; });
    cv.addEventListener('dblclick', () => { tGlobal = 1; });

    new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting;
      if (visible && !was) requestAnimationFrame(frame);
    }).observe(cv);
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 150); });
    (document.fonts ? Promise.all([document.fonts.load('italic 400 80px "Instrument Serif"'), document.fonts.load('400 80px "Instrument Serif"')]) : Promise.resolve())
      .catch(() => {}).then(() => { layout(); requestAnimationFrame(frame); });
  })();

  /* =====================================================================
     01 · describe-me: a next-token sampler at the page temperature.
     ===================================================================== */
  (function llm() {
    const out = $('#llm-out'), cands = $('#llm-cands');
    // [text, logit, silly?]
    const STEPS = [
      { pre: 'Rohith is', opts: [['an AI/ML engineer in the making', 2.2], ['a final-year AI & ML student', 2.0], ['a data scientist at heart', 1.5], ['a data engineer who loves clean pipelines', 1.1], ['a human gradient descent', -0.4, 1], ['powered entirely by chai', -1.0, 1]] },
      { pre: 'who builds', opts: [['deep RL agents', 1.8], ['medical-imaging GANs', 1.7], ['LLM-powered tools', 1.7], ['ML models on messy real data', 1.6], ['dashboards that tell a story', 1.1], ['way too many side projects', -0.5, 1]] },
      { pre: ', and co-authored', opts: [['an IEEE CCIC 2026 paper', 2.4], ['a paper on IEEE Xplore', 1.8], ['an 89.54%-accurate classifier', 1.1], ['a dangerously long README', -0.8, 1]] },
      { pre: '. Open to', opts: [['AI/ML Engineer roles', 2.0], ['Data Scientist roles', 1.8], ['ML Engineer roles', 1.8], ['GenAI / LLM Engineer roles', 1.6], ['Data Analyst roles', 1.5], ['Data Engineer roles', 1.5], ['unlimited GPU credits', -0.9, 1]] },
      { pre: 'in', opts: [['Hyderabad, India', 2.6], ['a Jupyter notebook', -0.8, 1], ['latent space', -1.2, 1]] },
    ];
    let step = 0, picked = [], busy = false;

    const probs = (opts) => {
      const t = Math.max(T, 0.05), m = Math.max(...opts.map((o) => o[1]));
      const ex = opts.map((o) => Math.exp((o[1] - m) / t));
      const z = ex.reduce((a, b) => a + b, 0);
      return ex.map((e) => e / z);
    };

    function render() {
      out.innerHTML = '';
      STEPS.forEach((s, i) => {
        if (i > step || i >= STEPS.length) return;
        const pre = document.createElement('span');
        pre.textContent = (i && !/^[,.]/.test(s.pre) ? ' ' : '') + s.pre + ' ';
        out.appendChild(pre);
        if (picked[i]) {
          const t = document.createElement('span');
          t.className = 'tok' + (picked[i].silly ? ' tok--silly' : '');
          t.textContent = picked[i].text;
          out.appendChild(t);
        }
      });
      if (step >= STEPS.length) out.appendChild(document.createTextNode('.'));
      const cur = document.createElement('span'); cur.className = 'cursor'; out.appendChild(cur);
      renderCands();
    }

    function renderCands() {
      cands.innerHTML = '';
      if (step >= STEPS.length) {
        const lp = picked.reduce((a, p) => a + Math.log(p.p), 0) / picked.length;
        const silly = picked.filter((p) => p.silly).length;
        const d = document.createElement('p');
        d.className = 'mono llm__end';
        d.innerHTML = `&lt;eos&gt; · sampled at T = ${T.toFixed(1)} · perplexity <b>${Math.exp(-lp).toFixed(2)}</b> · ${silly ? silly + ' hallucination' + (silly > 1 ? 's' : '') + ' 👀' : 'all facts ✓'}`;
        cands.appendChild(d);
        return;
      }
      const s = STEPS[step], ps = probs(s.opts);
      s.opts.map((o, i) => ({ o, p: ps[i], i })).sort((a, b) => b.p - a.p).forEach(({ o, p, i }) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'cand'; b.dataset.i = i;
        b.style.setProperty('--p', p.toFixed(3));
        b.innerHTML = `<span></span><span class="cand__p">${p.toFixed(2)}</span><i class="cand__bar"></i>`;
        b.firstChild.textContent = o[0];
        b.addEventListener('click', () => { if (!busy) choose(i); });
        cands.appendChild(b);
      });
    }

    function choose(i) {
      const s = STEPS[step], p = probs(s.opts)[i];
      const btn = cands.querySelector(`[data-i="${i}"]`);
      if (btn) btn.classList.add('is-picked');
      picked[step] = { text: s.opts[i][0], silly: !!s.opts[i][2], p };
      step++;
      setTimeout(render, 180);
    }
    function sampleIdx() {
      const ps = probs(STEPS[step].opts);
      let r = Math.random();
      for (let i = 0; i < ps.length; i++) { r -= ps[i]; if (r <= 0) return i; }
      return ps.length - 1;
    }
    function autocomplete() {
      if (busy) return;
      if (step >= STEPS.length) reset();
      busy = true;
      const tick = () => {
        if (step >= STEPS.length) { busy = false; return; }
        const i = sampleIdx();
        const btn = cands.querySelector(`[data-i="${i}"]`);
        if (btn) btn.classList.add('is-picked');
        setTimeout(() => { choose(i); setTimeout(tick, 650); }, 380);
      };
      tick();
    }
    function reset() { step = 0; picked = []; render(); }

    $('#llm-sample').addEventListener('click', () => { if (step < STEPS.length && !busy) choose(sampleIdx()); });
    $('#llm-greedy').addEventListener('click', autocomplete);
    $('#llm-reset').addEventListener('click', () => { if (!busy) reset(); });
    onT(() => {
      if (!busy) { renderCands(); return; }
      const ps = probs(STEPS[Math.min(step, STEPS.length - 1)].opts);
      $$('.cand', cands).forEach((b) => b.style.setProperty('--p', ps[b.dataset.i].toFixed(3)));
    });
    render();

    let played = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !played) { played = true; setTimeout(autocomplete, 500); }
    }, { threshold: 0.5 }).observe($('.llm'));
  })();

  /* ---------- count-up facts ---------- */
  const countIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = reduced ? 1 : 1400;
    const step = (now) => {
      const k = clamp((now - t0) / dur, 0, 1), e2 = 1 - Math.pow(1 - k, 3);
      el.textContent = (to * e2).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* =====================================================================
     02 · PROJECT TOYS. Canvas toys share one loop and pause off-screen.
     ===================================================================== */
  const toys = [];
  function addToy(cv, make) {
    const toy = { cv, visible: false };
    Object.assign(toy, make(cv, toy));
    toy.resize = () => { Object.assign(toy, fit(cv)); if (toy.onResize) toy.onResize(); };
    toy.resize();
    toys.push(toy);
    new IntersectionObserver(([e]) => { toy.visible = e.isIntersecting; }).observe(cv);
  }
  let lastT = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - lastT); lastT = now;
    toys.forEach((t) => { if (t.visible) t.draw(dt, now); });
    requestAnimationFrame(loop);
  }
  let rtt;
  addEventListener('resize', () => { clearTimeout(rtt); rtt = setTimeout(() => toys.forEach((t) => t.resize()), 150); });
  const localXY = (cv, e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  // --- personality: drag the trait dots, the classifier re-predicts live
  addToy($('[data-toy="radar"]'), (cv, toy) => {
    const TR = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
    // 18 prototype personalities: one dominant trait, a pair of traits, or an overall shape
    const PROTO = [];
    const SINGLE = ['the Explorer', 'the Planner', 'the Extravert', 'the Harmoniser', 'the Sensitive'];
    SINGLE.forEach((n, i) => PROTO.push([n, [0, 1, 2, 3, 4].map((k) => (k === i ? 0.92 : 0.38))]));
    const PAIR = { '0,1': 'the Architect', '0,2': 'the Visionary', '0,3': 'the Idealist', '0,4': 'the Artist', '1,2': 'the Leader',
      '1,3': 'the Guardian', '1,4': 'the Perfectionist', '2,3': 'the Entertainer', '2,4': 'the Performer', '3,4': 'the Empath' };
    Object.entries(PAIR).forEach(([k, n]) => { const [a, b] = k.split(',').map(Number); PROTO.push([n, [0, 1, 2, 3, 4].map((t) => (t === a || t === b ? 0.86 : 0.3))]); });
    PROTO.push(['the All-rounder', [0.88, 0.88, 0.88, 0.88, 0.88]], ['the Minimalist', [0.2, 0.2, 0.2, 0.2, 0.2]], ['the Balanced', [0.55, 0.55, 0.55, 0.55, 0.55]]);
    const cap = $('#radar-cap');
    let cur = [0.5, 0.5, 0.5, 0.5, 0.5], tgt = cur.slice(), timer = 0, drag = -1, userAt = -1e9, hover = -1, lastProto = -1;
    const geom = () => ({ cx: toy.w / 2, cy: toy.h * 0.46, R: Math.min(toy.w, toy.h) * 0.32 });
    const dir = (i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; return [Math.cos(a), Math.sin(a)]; };
    function predict(vals, who) {
      const ex = PROTO.map(([, p]) => Math.exp(-p.reduce((s, x, i) => s + (x - vals[i]) ** 2, 0) * 9));
      const z = ex.reduce((a, b) => a + b, 0);
      const order = ex.map((e, i) => i).sort((a, b) => ex[b] - ex[a]);
      cap.innerHTML = `${who} → <b>${PROTO[order[0]][0]}</b> · p = ${(ex[order[0]] / z).toFixed(2)} <span class="dim">· runner-up ${PROTO[order[1]][0]}</span>`;
    }
    const next = () => {
      let k;
      do k = Math.floor(Math.random() * PROTO.length); while (k === lastProto);
      lastProto = k;
      tgt = PROTO[k][1].map((v) => clamp(v + (Math.random() - 0.5) * 0.14, 0.08, 1));
      predict(tgt, 'new respondent');
    };
    next();
    const nearest = (x, y) => {
      const { cx, cy, R } = geom();
      let best = -1, bd = 28 * 28;
      cur.forEach((v, i) => { const [dx, dy] = dir(i); const d = (cx + dx * R * v - x) ** 2 + (cy + dy * R * v - y) ** 2; if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const setFrom = (x, y) => {
      const { cx, cy, R } = geom(), [dx, dy] = dir(drag);
      cur[drag] = tgt[drag] = clamp(((x - cx) * dx + (y - cy) * dy) / R, 0.08, 1);
      predict(cur, 'your answers');
    };
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', (e) => {
      const [x, y] = localXY(cv, e);
      drag = nearest(x, y);
      if (drag < 0) return;
      cv.setPointerCapture(e.pointerId); userAt = performance.now(); tgt = cur.slice(); setFrom(x, y);
    });
    cv.addEventListener('pointermove', (e) => {
      const [x, y] = localXY(cv, e);
      if (drag >= 0) { userAt = performance.now(); setFrom(x, y); } else { hover = nearest(x, y); cv.style.cursor = hover >= 0 ? 'grab' : 'default'; }
    });
    cv.addEventListener('pointerup', () => { drag = -1; });
    return {
      draw(dt) {
        const { ctx, w, h } = this, { cx, cy, R } = geom();
        const idle = performance.now() - userAt > 6000;
        timer += dt;
        if (idle && timer > 2600) { timer = 0; next(); }
        if (drag < 0) cur = cur.map((v, i) => lerp(v, tgt[i], 0.08));
        ctx.clearRect(0, 0, w, h);
        const pt = (i, r) => { const [dx, dy] = dir(i); return [cx + dx * R * r, cy + dy * R * r]; };
        ctx.strokeStyle = C['scr-line']; ctx.lineWidth = 1;
        for (let ring = 1; ring <= 4; ring++) {
          ctx.beginPath();
          for (let i = 0; i <= 5; i++) { const [x, y] = pt(i % 5, ring / 4); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
        }
        for (let i = 0; i < 5; i++) { const [x, y] = pt(i, 1); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); }
        ctx.font = '11px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let i = 0; i < 5; i++) {
          const [x, y] = pt(i, 1.2);
          ctx.fillStyle = i === hover || i === drag ? C.acc : C['scr-ink-2'];
          ctx.fillText(i === hover || i === drag ? TR[i] : TR[i][0], x, y);
        }
        ctx.beginPath();
        for (let i = 0; i <= 5; i++) { const [x, y] = pt(i % 5, cur[i % 5]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.globalAlpha = 0.25; ctx.fillStyle = C.acc; ctx.fill();
        ctx.globalAlpha = 1; ctx.strokeStyle = C.acc; ctx.lineWidth = 2; ctx.stroke();
        for (let i = 0; i < 5; i++) {
          const [x, y] = pt(i, cur[i]);
          ctx.beginPath(); ctx.arc(x, y, i === hover || i === drag ? 8 : 6, 0, 7);
          ctx.fillStyle = C.acc; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
        }
      },
    };
  });

  // --- spectrum: the RL agent vs a fixed-schedule baseline on the same licensed-user traffic.
  //     Click a channel to park a licensed user on it.
  addToy($('[data-toy="spectrum"]'), (cv, toy) => {
    const N = 10, ROWS = 11, PAD = 14, HEAD = 22, BOTTOM = 50;
    let rows = [], occ = Array.from({ length: N }, () => Math.random() < 0.35), jam = new Array(N).fill(false);
    let agent = 3, base = 7, acc = 0, off = 0, hoverC = -1, steps = 0, rlHit = 0, baseHit = 0, flash = 0;
    const el = { rl: $('#sp-rl'), base: $('#sp-base'), pu: $('#sp-pu') };
    const colAt = (x) => { const cw = (toy.w - PAD * 2) / N; const c = Math.floor((x - PAD) / cw); return c >= 0 && c < N ? c : -1; };
    const newRow = () => {
      occ = occ.map((o, i) => jam[i] || (Math.random() < (o ? 0.22 : 0.12) ? !o : o));
      if (occ.every(Boolean)) { const free = jam.map((j, i) => (j ? -1 : i)).filter((i) => i >= 0); occ[pick(free)] = false; }
      steps++;
      // baseline: a fixed round-robin schedule that never checks who is on the channel
      if (steps % 5 === 0) base = (base + 3) % N;
      // RL policy: sense, then hop to the nearest free channel
      if (occ[agent]) {
        let best = -1, bd = 99;
        occ.forEach((o, i) => { if (!o && Math.abs(i - agent) < bd) { bd = Math.abs(i - agent); best = i; } });
        agent = best; flash = 1;
      }
      const bc = occ[base];
      if (bc) baseHit++;
      if (occ[agent]) rlHit++;
      rows.unshift({ occ: occ.slice(), agent, base, bc });
      if (rows.length > ROWS + 1) rows.pop();
      el.rl.textContent = rlHit;
      el.base.textContent = `${baseHit} (${Math.round((100 * baseHit) / steps)}%)`;
      el.pu.textContent = `${occ.filter(Boolean).length}/${N}`;
    };
    for (let i = 0; i < ROWS; i++) newRow();
    cv.addEventListener('pointermove', (e) => { hoverC = colAt(localXY(cv, e)[0]); cv.style.cursor = hoverC >= 0 ? 'pointer' : 'default'; });
    cv.addEventListener('pointerleave', () => { hoverC = -1; });
    cv.addEventListener('click', (e) => {
      const c = colAt(localXY(cv, e)[0]);
      if (c < 0) return;
      if (!jam[c] && jam.filter(Boolean).length >= N - 1) return; // always leave one channel free
      jam[c] = !jam[c];
    });
    const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
    return {
      draw(dt) {
        const { ctx, w, h } = this;
        acc += dt; off = acc / 340;
        if (acc > 340) { acc = 0; off = 0; newRow(); }
        flash = Math.max(0, flash - dt / 500);
        ctx.clearRect(0, 0, w, h);
        const cw = (w - PAD * 2) / N, rh = (h - PAD - HEAD - BOTTOM) / ROWS, y0 = PAD + HEAD;
        ctx.font = '10px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let c = 0; c < N; c++) {
          const x = PAD + c * cw;
          if (c === hoverC || jam[c]) { ctx.fillStyle = jam[c] ? 'rgba(189,184,255,.14)' : 'rgba(255,255,255,.05)'; ctx.fillRect(x, PAD, cw, h - PAD - BOTTOM); }
          ctx.fillStyle = jam[c] ? '#bdb8ff' : C['scr-ink-2'];
          ctx.fillText(jam[c] ? '■' : String(c + 1), x + cw / 2, PAD + 8);
        }
        ctx.save(); ctx.beginPath(); ctx.rect(PAD, y0, w - PAD * 2, h - y0 - BOTTOM); ctx.clip();
        rows.forEach((r, ri) => {
          const y = y0 + (ri - 1 + off) * rh, fade = 1 - ri / (ROWS + 1);
          for (let c = 0; c < N; c++) {
            const x = PAD + c * cw;
            if (r.occ[c]) { ctx.globalAlpha = 0.8 * fade; ctx.fillStyle = '#bdb8ff'; ctx.fillRect(x + 3, y + 2, cw - 6, rh - 4); }
            else { ctx.globalAlpha = 0.6 * fade; ctx.fillStyle = C['scr-line']; ctx.fillRect(x + cw / 2 - 1, y + rh / 2 - 1, 2, 2); }
          }
          // baseline: hollow box, or a red cross where it hit a licensed user
          const bx = PAD + r.base * cw;
          ctx.globalAlpha = fade;
          if (r.bc) {
            ctx.strokeStyle = '#ff2d55'; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.moveTo(bx + 6, y + 4); ctx.lineTo(bx + cw - 6, y + rh - 4); ctx.moveTo(bx + cw - 6, y + 4); ctx.lineTo(bx + 6, y + rh - 4); ctx.stroke();
          } else { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.5; rr(ctx, bx + 4, y + 3, cw - 8, rh - 6, 4); ctx.stroke(); }
          // RL agent: solid orange
          ctx.fillStyle = C.acc;
          rr(ctx, PAD + r.agent * cw + 3, y + 2, cw - 6, rh - 4, 5); ctx.fill();
        });
        ctx.restore(); ctx.globalAlpha = 1;
        if (flash > 0) { // "dodged" pops up where the agent just hopped
          ctx.globalAlpha = flash; ctx.fillStyle = C.acc; ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.fillText('dodged ↷', clamp(PAD + agent * cw + cw / 2, 40, w - 40), y0 + rh * 1.7);
          ctx.globalAlpha = 1;
        }
      },
    };
  });

  // --- X-ray: drag the split between the low-res input and the GAN output
  addToy($('[data-toy="xray"]'), (cv, toy) => {
    let hi, lo, split = 0.5, auto = true, tt = 0, down = false;
    function paint() {
      const { w, h } = toy, d = DPR();
      hi = document.createElement('canvas'); hi.width = w * d; hi.height = h * d;
      const g = hi.getContext('2d'); g.scale(d, d);
      g.fillStyle = '#0b0d14'; g.fillRect(0, 0, w, h);
      const cx = w / 2, top = h * 0.14, bot = h * 0.95;
      [-1, 1].forEach((s) => {
        const grd = g.createRadialGradient(cx + s * w * 0.17, h * 0.55, 5, cx + s * w * 0.17, h * 0.55, w * 0.22);
        grd.addColorStop(0, '#1b1f28'); grd.addColorStop(1, '#3b4254');
        g.fillStyle = grd;
        g.beginPath(); g.ellipse(cx + s * w * 0.17, h * 0.56, w * 0.14, h * 0.36, s * 0.08, 0, 7); g.fill();
      });
      g.fillStyle = 'rgba(200,210,225,.28)';
      g.beginPath(); g.ellipse(cx + w * 0.04, h * 0.66, w * 0.08, h * 0.15, -0.4, 0, 7); g.fill();
      for (let y = top; y < bot; y += h * 0.055) {
        g.fillStyle = 'rgba(225,230,238,.55)';
        g.beginPath();
        if (g.roundRect) g.roundRect(cx - w * 0.022, y, w * 0.044, h * 0.042, 3); else g.rect(cx - w * 0.022, y, w * 0.044, h * 0.042);
        g.fill();
      }
      g.lineCap = 'round';
      for (let i = 0; i < 9; i++) {
        const y = h * 0.22 + i * h * 0.07, span = w * (0.2 + Math.sin((i / 8) * Math.PI) * 0.1);
        g.strokeStyle = `rgba(230,236,245,${0.62 - i * 0.03})`; g.lineWidth = Math.max(2, h * 0.018);
        [-1, 1].forEach((s) => {
          g.beginPath(); g.moveTo(cx + s * w * 0.03, y);
          g.bezierCurveTo(cx + s * span * 0.9, y - h * 0.07, cx + s * span * 1.25, y + h * 0.02, cx + s * span * 1.05, y + h * 0.12);
          g.stroke();
        });
      }
      g.lineWidth = Math.max(3, h * 0.022); g.strokeStyle = 'rgba(235,240,248,.7)';
      [-1, 1].forEach((s) => { g.beginPath(); g.moveTo(cx + s * w * 0.03, h * 0.17); g.quadraticCurveTo(cx + s * w * 0.18, h * 0.1, cx + s * w * 0.33, h * 0.15); g.stroke(); });
      const f = 11, small = document.createElement('canvas');
      small.width = Math.max(4, Math.round(w / f)); small.height = Math.max(3, Math.round(h / f));
      const sg = small.getContext('2d'); sg.drawImage(hi, 0, 0, small.width, small.height);
      const id = sg.getImageData(0, 0, small.width, small.height);
      for (let i = 0; i < id.data.length; i += 4) { const n = (Math.random() - 0.5) * 34; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n; }
      sg.putImageData(id, 0, 0);
      lo = document.createElement('canvas'); lo.width = hi.width; lo.height = hi.height;
      const lg = lo.getContext('2d'); lg.imageSmoothingEnabled = false; lg.drawImage(small, 0, 0, lo.width, lo.height);
    }
    const setFrom = (e) => { split = clamp(localXY(cv, e)[0] / toy.w, 0.02, 0.98); auto = false; };
    cv.addEventListener('pointerdown', (e) => { down = true; setFrom(e); });
    cv.addEventListener('pointermove', (e) => { if (down || e.pointerType === 'mouse') setFrom(e); });
    addEventListener('pointerup', () => { down = false; });
    return {
      onResize: paint,
      draw(dt) {
        const { ctx, w, h } = this;
        if (auto) { tt += dt; split = 0.5 + Math.sin(tt / 1400) * 0.32; }
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(hi, 0, 0, w, h);
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w * split, h); ctx.clip(); ctx.drawImage(lo, 0, 0, w, h); ctx.restore();
        const x = w * split;
        ctx.fillStyle = C.acc; ctx.fillRect(x - 1, 0, 2, h);
        ctx.beginPath(); ctx.arc(x, h / 2, 14, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('⇆', x, h / 2 + 1);
        ctx.font = '10px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.textAlign = 'left'; ctx.fillText('low-res input', 12, 16);
        ctx.textAlign = 'right'; ctx.fillText('ESRGAN 2×', w - 12, 16);
      },
    };
  });

  // --- Cognify: pick a topic and a level, a learning track is generated step by step
  (function cognify() {
    const box = $('#cog');
    const TOPICS = {
      ml: ['Machine learning', ['Python & NumPy basics', 'Pandas & data cleaning', 'Linear & logistic regression', 'Trees, XGBoost & evaluation', 'Neural nets in PyTorch', 'CNNs & transfer learning', 'Deploy a model with FastAPI']],
      data: ['Data analysis', ['Spreadsheets to SQL', 'SQL joins & window functions', 'Pandas for analysis', 'Charts with Plotly', 'Statistics & A/B tests', 'Dashboards in Power BI', 'Tell a story with data']],
      web: ['Web dev', ['HTML & CSS foundations', 'JavaScript essentials', 'React components & state', 'REST APIs with Django', 'Auth & databases', 'Testing & CI', 'Ship to production']],
    };
    const LEVELS = { new: ['new', 0], some: ['some', 1], pro: ['pro', 2] };
    const MENTOR = {
      new: (t) => `New to ${t.toLowerCase()}? No jargon yet. We start hands-on and build up.`,
      some: (t, s) => `You know the basics, so your track jumps straight to <b>${s}</b>.`,
      pro: () => 'Pro mode: fewer lectures, more projects, and a capstone at the end.',
    };
    let topic = 'ml', level = 'new', user = false, visible = false, gen = 0;
    box.innerHTML = `
      <div class="cog__row"><span class="cog__lbl">learn</span>${Object.entries(TOPICS).map(([k, [n]]) => `<button type="button" class="tbtn" data-topic="${k}">${n}</button>`).join('')}</div>
      <div class="cog__row"><span class="cog__lbl">level</span>${Object.keys(LEVELS).map((k) => `<button type="button" class="tbtn" data-level="${k}">${k}</button>`).join('')}</div>
      <div class="cog__track" aria-live="polite"></div>
      <div class="cog__mentor"></div>`;
    const track = $('.cog__track', box), mentor = $('.cog__mentor', box);
    const NOISE = '#%&@$*+=-:;!?01<>/|~^';
    function generate() {
      const id = ++gen;
      $$('[data-topic]', box).forEach((b) => b.classList.toggle('is-on', b.dataset.topic === topic));
      $$('[data-level]', box).forEach((b) => b.classList.toggle('is-on', b.dataset.level === level));
      const [name, all] = TOPICS[topic], start = LEVELS[level][1];
      const steps = all.slice(start, start + 5);
      track.innerHTML = steps.map((s, i) => `<div class="cog__step"><span></span> <em>· ${[3, 5, 6, 8, 10][i] + start * 2}h</em></div>`).join('');
      mentor.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
      $$('.cog__step', track).forEach((el, i) => {
        const span = el.firstChild, text = steps[i];
        setTimeout(() => {
          if (id !== gen) return;
          el.classList.add('is-in');
          let t = 10; // denoise the label over a few frames
          const tick = () => {
            if (id !== gen) return;
            span.textContent = text.split('').map((ch, j) => (ch === ' ' || j / text.length < 1 - t / 10 ? ch : NOISE[(Math.random() * NOISE.length) | 0])).join('');
            if (t-- > 0) setTimeout(tick, 35); else span.textContent = text;
          };
          tick();
        }, reduced ? 0 : i * 260);
      });
      setTimeout(() => { if (id === gen) mentor.innerHTML = `<b>mentor:</b> ${MENTOR[level](name, steps[0])}`; }, reduced ? 0 : 1500);
    }
    box.addEventListener('click', (e) => {
      const b = e.target.closest('.tbtn');
      if (!b) return;
      user = true;
      if (b.dataset.topic) topic = b.dataset.topic;
      if (b.dataset.level) level = b.dataset.level;
      generate();
    });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);
    const combos = [['ml', 'new'], ['data', 'some'], ['web', 'pro'], ['ml', 'some'], ['data', 'new']];
    let ci = 0;
    setInterval(() => {
      if (user || !visible) return;
      ci = (ci + 1) % combos.length; [topic, level] = combos[ci]; generate();
    }, 6500);
    generate();
  })();

  // --- Chiron: tap a question, get a triaged answer
  (function chiron() {
    const box = $('#chat');
    const QA = [
      ['Headache + fever', 'Headache and a mild fever since yesterday.', 'Severity: <b>low</b>. Rest, fluids, paracetamol if needed. See a doctor if it lasts 3+ days.'],
      ['Ibuprofen + BP meds?', 'Can I take ibuprofen with my BP meds?', '<b>⚠ Interaction:</b> NSAIDs can raise blood pressure and weaken some BP meds. Check with a pharmacist first.'],
      ['Pharmacy nearby?', 'Any pharmacy nearby?', '📍 <b>2 pharmacies</b> within 1 km, open now. Tap for directions.'],
      ['Chest pain', 'Sudden chest pain and short of breath.', '<b>🚨 Emergency:</b> call 108 now. Nearest emergency department: <b>1.4 km</b>.'],
    ];
    box.innerHTML = `<div class="chat__log"></div><div class="chat__asks">${QA.map((q, i) => `<button type="button" class="tbtn" data-q="${i}">${q[0]}</button>`).join('')}</div>`;
    const log = $('.chat__log', box);
    let busy = false, user = false, visible = false, ai = 0, queued = -1;
    function add(cls, html) {
      const m = document.createElement('div'); m.className = 'msg ' + cls; m.innerHTML = html;
      log.appendChild(m);
      while (log.children.length > 4) log.firstChild.remove();
      return m;
    }
    function ask(i) {
      if (busy) return;
      busy = true;
      $$('.tbtn', box).forEach((b) => b.classList.toggle('is-on', +b.dataset.q === i));
      add('msg--u', QA[i][1]);
      setTimeout(() => {
        const t = add('msg--b dots', '<i></i><i></i><i></i>');
        setTimeout(() => {
          t.classList.remove('dots'); t.innerHTML = QA[i][2]; busy = false;
          if (queued >= 0) { const q = queued; queued = -1; setTimeout(() => ask(q), 250); }
        }, reduced ? 0 : 900);
      }, 300);
    }
    box.addEventListener('click', (e) => {
      const b = e.target.closest('.tbtn');
      if (!b) return;
      user = true;
      if (busy) { queued = +b.dataset.q; b.classList.add('is-on'); } else ask(+b.dataset.q);
    });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);
    setInterval(() => { if (!user && visible && !busy) { ask(ai); ai = (ai + 1) % QA.length; } }, 3600);
  })();

  requestAnimationFrame(loop);

  /* ---------- trace skills: jump into the network and run that project forward ---------- */
  $$('.trace').forEach((b) => b.addEventListener('click', () => { if (window.NET) window.NET.trace(b.dataset.trace); }));

  /* ---------- timeline line draw ---------- */
  const tlIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-in'); }), { threshold: 0.5 });
  $$('.timeline li').forEach((li) => tlIO.observe(li));

  /* =====================================================================
     05 · CERTIFICATES — each card takes its issuer's colour on hover.
     ===================================================================== */
  (function certs() {
    const A = 'assets/Certificates/';
    // [slug, title, meta, pdf, brand colour (mostly sampled from the certificate), optional dark text for light brands]
    const CERTS = [
      ['ieee', 'IEEE CCIC 2026 · Paper co-author', 'Mohan Babu University · Feb 2026', 'ieee certificate.pdf', '#1e5374'],
      ['ibm-internship', 'Artificial Intelligence Internship', 'IBM SkillsBuild × CSRBOX · 2024', 'IBM AI Internship Certificate.pdf', '#1d6ca6'],
      ['sap-code-unnati', 'AI/ML, Deep Learning & Edge Computing', 'SAP Code Unnati × Edunet · 2025–26', 'SAP.pdf', '#1f8fc7'],
      ['nptel-java', 'Programming in Java · Elite', 'NPTEL · IIT Kharagpur · 2025', 'NPTEL Java.pdf', '#ac3227'],
      ['sap-data-models', 'Data Models & Transforming Data', 'SAP Learning · 2026', 'Designing Data Models.pdf', '#b52877'],
      ['sap-stories', 'Data Storytelling in SAP Analytics Cloud', 'SAP Learning · 2026', 'Designing Stories in SAP Analytics.pdf', '#9c2168'],
      ['agentathon', 'Agentathon 2025 · Agentic AI Hackathon', 'GDG Hyderabad · Dec 2025', 'Rohith_Agentathon_2025.pdf', '#f4b400', '#1d1a10'],
      ['anthropic-ai-fluency', 'AI Fluency: Framework & Foundations', 'Anthropic', 'Claude AI Fluency.pdf', '#6f8455'],
      ['ibm-genai', 'Introduction to Generative AI', 'IBM SkillsBuild · 2026', 'Intro to GenAI.pdf', '#5d626b'],
      ['ai-hackday', 'AI Hackday 2025', 'AI Club, KGRCET · Jan 2025', 'kgrcet hackday participation.pdf', '#d4a531', '#1d1a10'],
      ['buildverse-volunteer', 'Volunteer · Buildverse.AI Hackathon', 'AI Club, KGRCET · 2025', 'Volunteer.pdf', '#d4a531', '#1d1a10'],
      ['codeapt-placement', 'Placement Training 3', 'Codeapt · 2026', 'Placement_Training_3.pdf', '#3b5c84'],
      ['codeapt-python', 'Python Day 1', 'Codeapt · 2026', 'PYTHON_Day1.pdf', '#2f6f8f'],
      ['elewayte-webinar', 'Career Counselling Webinar', 'Elewayte · May 2024', 'waste participation.pdf', '#7a1f33'],
    ];
    // public verification / publication links, by slug
    const VERIFY = {
      'ieee': 'https://ieeexplore.ieee.org/document/11486116',
      'sap-code-unnati': 'https://codeunnati.edunetfoundation.com/verify-certificate26/CU26_33604',
      'nptel-java': 'https://nptel.ac.in/noc/E_Certificate/NPTEL25CS57S114700571204432292',
      'sap-data-models': 'https://badger.learning.sap.com/verify/xymyb-roruc-tulap-rigen-fenuk',
      'sap-stories': 'https://badger.learning.sap.com/verify/xytyg-gytid-canyb-bavom-kolom',
      'codeapt-placement': 'https://itseasynow.in/certificates/verify/9938abdd-26a3-475a-9550-87876aa946ba',
      'codeapt-python': 'https://itseasynow.in/certificates/verify/48b83c8b-1d2f-436e-91e7-c93201b44f7d',
    };
    const SHOW = 8;
    const list = $('#cert-list'), more = $('#cert-more'), dlg = $('#viewer');
    let cur = 0;
    CERTS.forEach(([slug, title, meta, , brand, ink], i) => {
      const li = document.createElement('li');
      if (i >= SHOW) li.className = 'is-hidden';
      li.innerHTML = `<button class="cert" type="button" style="--brand:${brand}${ink ? ';--brand-ink:' + ink : ''}"><span class="cert__img"><img loading="lazy" alt="" src="${A}thumbs/${slug}.jpg"></span><b></b><span class="mono"><i class="cert__dot"></i></span></button>`;
      li.querySelector('b').textContent = title;
      li.querySelector('.mono').append(meta);
      li.querySelector('button').addEventListener('click', () => open(i));
      list.appendChild(li);
    });
    more.textContent = `show all ${CERTS.length}`;
    more.addEventListener('click', () => {
      const hidden = $$('.is-hidden', list);
      if (hidden.length) { hidden.forEach((l) => l.classList.remove('is-hidden')); more.textContent = 'show fewer'; }
      else { $$('li', list).forEach((l, i) => { if (i >= SHOW) l.classList.add('is-hidden'); }); more.textContent = `show all ${CERTS.length}`; }
    });
    function open(i) {
      cur = (i + CERTS.length) % CERTS.length;
      const [slug, title, meta, pdf, brand] = CERTS[cur];
      $('.viewer__box', dlg).style.setProperty('--brand', brand);
      $('.viewer__img', dlg).src = `${A}preview/${slug}.jpg`;
      $('.viewer__img', dlg).alt = title + ' certificate';
      $('#viewer-title').textContent = title;
      $('.viewer__meta', dlg).textContent = meta;
      $('.viewer__pdf', dlg).href = A + encodeURIComponent(pdf);
      const v = $('.viewer__verify', dlg);
      v.hidden = !VERIFY[slug];
      v.href = VERIFY[slug] || '#';
      v.textContent = slug === 'ieee' ? 'view on IEEE Xplore ↗' : 'verify ↗';
      if (!dlg.open) dlg.showModal();
    }
    $('.viewer__x', dlg).addEventListener('click', () => dlg.close());
    $('.viewer__prev', dlg).addEventListener('click', () => open(cur - 1));
    $('.viewer__next', dlg).addEventListener('click', () => open(cur + 1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') open(cur - 1); if (e.key === 'ArrowRight') open(cur + 1); });
  })();

  /* =====================================================================
     06 · TALK: a tiny scripted model. Its voice follows the temperature,
     and it drafts the first message for the visitor.
     ===================================================================== */
  (function talk() {
    const log = $('#convo-log'), form = $('#convo-form'), inp = $('#convo-in');
    const MAIL = 'rohitsingh767194@gmail.com', WA = '917671948680';
    const SAY = {
      greet: {
        formal: 'Hello. I am Rohith\'s contact assistant. May I have your name?',
        balanced: 'Hi! I\'m a tiny model trained on Rohith\'s inbox. What\'s your name?',
        playful: 'Hey there, human 👋 I\'m a very small language model with one job: getting you to message Rohith. What do I call you?',
      },
      empty: {
        formal: 'Please enter a name to continue.',
        balanced: 'I need at least one token to work with. What\'s your name?',
        playful: 'Zero tokens in, zero tokens out. Give me a name, any name.',
      },
      intent: {
        formal: (n) => `Thank you, ${n}. What is the purpose of your message?`,
        balanced: (n) => `Nice to meet you, ${n}! What brings you here?`,
        playful: (n) => `${n}! Great name, 10/10 tokens. So, what's the plan?`,
      },
      draft: {
        formal: 'Here is a draft. You may edit it before sending.',
        balanced: 'Here\'s a draft. Edit anything, then pick where to send it.',
        playful: 'Draft generated at a spicy temperature. Edit freely, I won\'t be offended.',
      },
      redraft: {
        formal: 'I have updated the draft with your note.',
        balanced: 'Updated the draft with that.',
        playful: 'Fine-tuned on your feedback. Here\'s v2.',
      },
      sent: {
        formal: 'The message is ready in a new tab. Rohith will respond as soon as possible.',
        balanced: 'Opened it in a new tab. Rohith usually replies within a day.',
        playful: 'Deployed to production 🚀 Rohith usually replies within a day (faster if there\'s chai involved).',
      },
    };
    const INTENTS = [
      ['hire', 'Hiring for an AI/ML or data role'],
      ['collab', 'A project or collaboration'],
      ['hi', 'Just saying hi'],
    ];
    const BODY = {
      hire: {
        formal: 'Dear Rohith,\n\nI came across your portfolio and would like to discuss an AI/ML or data role with you. Could you share your availability for a brief call?',
        balanced: 'Hi Rohith,\n\nI found your portfolio and I\'d like to talk to you about an AI/ML / data role. When are you free for a quick call?',
        playful: 'Hey Rohith!\n\nYour portfolio passed our vibe check with p = 0.99. Want to chat about an AI/ML or data role on our team?',
      },
      collab: {
        formal: 'Dear Rohith,\n\nI am interested in collaborating with you on a project. Could we schedule a short discussion?',
        balanced: 'Hi Rohith,\n\nI have a project idea and I think you\'d be a great fit to collaborate. Up for a chat?',
        playful: 'Hey Rohith,\n\nI have a project idea and a suspicious amount of enthusiasm. Want to build something together?',
      },
      hi: {
        formal: 'Hello Rohith,\n\nI enjoyed going through your portfolio. Best wishes with your work.',
        balanced: 'Hi Rohith,\n\nJust stopped by to say your portfolio is great!',
        playful: 'Hi Rohith!\n\nStirred your name, broke your model, loved every second. 10/10 would scroll again.',
      },
    };
    const SIGN = { formal: 'Best regards,', balanced: 'Thanks,', playful: 'Cheers,' };
    let stage = 'name', name = '', via = 'gmail', started = false, draftEl = null;

    const scrollDown = () => { log.scrollTop = log.scrollHeight; };
    function me(text) {
      const m = document.createElement('div'); m.className = 'cmsg cmsg--me';
      m.innerHTML = `<span class="cmsg__who">you</span>${esc(text)}`;
      log.appendChild(m); scrollDown();
    }
    function bot(html, then) {
      const m = document.createElement('div'); m.className = 'cmsg cmsg--bot';
      m.innerHTML = '<span class="cmsg__who">rohith-inbox-mini</span><span class="dots"><i></i><i></i><i></i></span>';
      log.appendChild(m); scrollDown();
      setTimeout(() => { m.lastChild.remove(); m.insertAdjacentHTML('beforeend', html); scrollDown(); if (then) then(); }, reduced ? 0 : 650);
      return m;
    }
    function chips() {
      const c = document.createElement('div'); c.className = 'cchips';
      c.innerHTML = INTENTS.map(([k, l]) => `<button type="button" class="cchip" data-intent="${k}">${l}</button>`).join('');
      c.addEventListener('click', (e) => { const b = e.target.closest('.cchip'); if (b && stage === 'intent') { c.remove(); answerIntent(b.textContent, b.dataset.intent); } });
      log.appendChild(c); scrollDown();
    }
    function makeDraft(intent, note) {
      let body = intent === 'custom' ? `${{ formal: 'Dear Rohith,', balanced: 'Hi Rohith,', playful: 'Hey Rohith!' }[tone]}\n\n${note}` : BODY[intent][tone];
      if (intent !== 'custom' && note) body += `\n\n${note}`;
      return `${body}\n\n${SIGN[tone]}\n${name}`;
    }
    function showDraft(text) {
      if (draftEl) draftEl.remove();
      draftEl = document.createElement('div'); draftEl.className = 'cdraft';
      draftEl.innerHTML = `<label class="sr" for="cdraft-t">Draft message</label><textarea id="cdraft-t"></textarea>
        <div class="cdraft__row mono">
          <div class="cdraft__via" role="radiogroup" aria-label="Send via">
            <button type="button" role="radio" data-via="gmail" aria-checked="${via === 'gmail'}">gmail</button>
            <button type="button" role="radio" data-via="whatsapp" aria-checked="${via === 'whatsapp'}">whatsapp</button>
          </div>
          <button type="button" class="btn btn--acc btn--sm cdraft__go">deploy() → ${via === 'gmail' ? 'Gmail' : 'WhatsApp'}</button>
        </div>`;
      $('textarea', draftEl).value = text;
      draftEl.addEventListener('click', (e) => {
        const v = e.target.closest('[data-via]');
        if (v) {
          via = v.dataset.via;
          $$('[data-via]', draftEl).forEach((b) => b.setAttribute('aria-checked', String(b === v)));
          $('.cdraft__go', draftEl).textContent = `deploy() → ${via === 'gmail' ? 'Gmail' : 'WhatsApp'}`;
        }
        if (e.target.closest('.cdraft__go')) send($('textarea', draftEl).value);
      });
      log.appendChild(draftEl); scrollDown();
    }
    let lastIntent = 'hi';
    function answerIntent(text, key) {
      me(text);
      lastIntent = key || 'custom';
      stage = 'draft';
      bot(SAY.draft[tone], () => showDraft(makeDraft(lastIntent, key ? '' : text)));
    }
    function send(msg) {
      const url = via === 'gmail'
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${MAIL}&su=${encodeURIComponent('Hello from your portfolio' + (name ? ' · ' + name : ''))}&body=${encodeURIComponent(msg)}`
        : `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener');
      bot(SAY.sent[tone]);
    }
    function start() {
      log.innerHTML = ''; stage = 'name'; name = ''; draftEl = null; started = true;
      bot(SAY.greet[tone]);
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = inp.value.trim();
      inp.value = '';
      if (stage === 'name') {
        if (!text) { bot(SAY.empty[tone]); return; }
        me(text);
        name = text.slice(0, 40);
        stage = 'intent';
        bot(SAY.intent[tone](esc(name)), chips);
      } else if (stage === 'intent') {
        if (!text) return;
        const c = $('.cchips', log); if (c) c.remove();
        answerIntent(text, null);
      } else if (text) {
        me(text);
        const current = draftEl ? $('textarea', draftEl).value : '';
        bot(SAY.redraft[tone], () => showDraft(current ? current.replace(/\n\n([^\n]*)\n([^\n]*)$/, `\n\n${text}\n\n$1\n$2`) : makeDraft(lastIntent, text)));
      }
    });
    $('#convo-reset').addEventListener('click', start);
    onT((v, changed) => {
      $('#convo-t').textContent = 'T=' + v.toFixed(1);
      // before the visitor has said anything, re-greet in the new voice
      if (changed && started && stage === 'name' && !$('.cmsg--me', log)) start();
    });
    $('#convo-t').textContent = 'T=' + T.toFixed(1);
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) start(); }, { threshold: 0.3 }).observe($('#convo'));
  })();

})();
