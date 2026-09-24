/* =========================================================
   Blue Ember Concepts — main.js
   Built by JCommerce & Tech

   1. Home tour steps   (projects + config live in data.js)
   2. Helpers
   3. Header + nav
   4. Ember background
   5. Work grid + case-study drawer
   6. Lightbox
   7. Project brief (quote builder)
   8. Client desk (reorder portal)
   9. BizPlej
   10. Site tour
   11. Work archive page, loader, 3D phone, scroll scene, parallax
   12. Init
   ========================================================= */

/* ---------- 1. Home tour (content lives in data.js) ---------- */
const TOUR = [
  { title: "Welcome to your new site", text: "This is a working preview of the new blueemberja.com, built by JCommerce & Tech. The next steps take about a minute and show you everything that changed.", target: null },
  { title: "A first impression that says who you are", text: "Your motto leads, your work is on the table, and the four dimensions sit right under it as quick links. Behind it all, a flame drawn in halftone, like a print.", target: ".hero-inner" },
  { title: "Services linked to proof", text: "Each dimension explains what you do in plain words and links straight to real projects that show it.", target: ".dims" },
  { title: "Digital, in 3D", text: "Scroll through this scene and a phone turns in 3D while your real social posts scroll on its screen. The floating pieces drift at different depths, and two animation slots are ready for motion pieces from your reel.", target: ".scene-stage" },
  { title: "Your work, finally on show", text: "Every project opens in a drawer with the full story, results, client quotes and a gallery sorted into Print, Social and Display. Videos only load when tapped, so the site stays fast. The full archive page shows every piece, sorted by medium. This replaces the old untitled portfolio pages.", target: "#workGrid" },
  { title: "Briefs instead of missed calls", text: "The old contact form is replaced by four quick questions: services, project type, timeline and budget. The finished brief lands in your WhatsApp or project inbox, ready to quote.", target: "#brief" },
  { title: "Reorders without the phone tag", text: "Returning clients sign in to the client desk, see everything you have printed for them and request a reprint in a few taps. Try it with the demo account.", target: ".desk-grid" },
  { title: "BizPlej, back in the spotlight", text: "Guests can RSVP from any phone. Set the next date in one line of settings and a live countdown appears.", target: ".bizplej-grid" },
  { title: "WhatsApp is always one tap away", text: "Your WhatsApp number was hidden on the contact page. Now it follows visitors down every page.", target: ".wa-float" },
  { title: "A page for everything", text: "Services, Work, Studio and BizPlej each have their own page now, all linked from the menu. Each service page sends visitors straight into a brief with that service already chosen.", target: "#siteNav" },
  { title: "What happens next", text: "Send your latest work so the archive shows today’s Blue Ember, confirm the budget ranges, and we connect the database, set up hosting and go live.", target: null },
];

/* ---------- 2. Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  session(k) { try { sessionStorage.setItem(k, "1"); } catch { /* storage unavailable */ } },
};

/* Close any modal dialog when its backdrop is clicked */
function closeOnBackdrop(dialog) {
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  $$("[data-close]", dialog).forEach((b) => b.addEventListener("click", () => dialog.close()));
}

/* The image fallback chain lives in each page's <head> so it is listening before the first image loads. */

/* ---------- 3. Header + nav ---------- */
function initHeader() {
  const header = $("#siteHeader");
  const toggle = $("#navToggle");
  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
  $$("#siteNav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- 4. Halftone flame ----------
   The flame is drawn as a print dot screen: dot size follows the heat.
   It rises from beneath an anchor (the fanned prints, a title, a logo),
   leans toward the pointer, throws sparks, and can be dimmed (the loader
   uses that to ignite it as the site loads). Colours are bucketed so each
   frame is a handful of fills, not thousands. */
function createFlame(canvas, { anchor = null, tone = "azure", interactive = false, intensity = 1 } = {}) {
  const ctx = canvas.getContext("2d");
  const host = canvas.parentElement;
  const bands = tone === "ember"
    ? ["96,34,12", "196,82,36", "242,117,58", "255,178,132", "90,176,255"]    // orange flame, azure core
    : ["11,74,162", "24,118,230", "90,176,255", "205,235,255", "242,117,58"]; // azure flame, ember core
  const alphas = [0.5, 0.7, 0.85, 0.95, 1];
  const pointer = { x: 0, y: 0, heat: 0, on: false };
  const sparks = [];
  let w, h, s, homeX, fx, base, width, t = 0, running = false, raf, last = 0;
  let level = intensity, target = intensity;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, w && w < 700 ? 1.5 : 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    s = w < 700 ? 10 : 13;
    if (anchor) {
      const c = canvas.getBoundingClientRect(), a = anchor.getBoundingClientRect();
      homeX = a.left - c.left + a.width / 2;
      base = Math.min(h, a.bottom - c.top + s * (w < 700 ? 0.5 : 2));
      width = Math.max(a.width, 160);
    } else {
      homeX = w * (w >= 1000 ? 0.72 : 0.6); base = h; width = w * (w >= 1000 ? 0.4 : 0.8);
    }
    fx ??= homeX;
  };

  const heat = (x, y) => {
    const ny = Math.min(1, y / base);                        // 0 at top, 1 at the flame's base
    const spread = width * 0.5 * (0.28 + 0.9 * ny);
    const sway = Math.sin(t * 0.9 + ny * 3) * w * 0.025 * (1 - ny);
    const dx = (x - fx - sway) / spread;
    let v = Math.exp(-dx * dx) * Math.pow(ny, 1.35);
    const dx2 = (x - fx + spread * 0.95) / (spread * 0.45);   // a smaller second tongue
    v += 0.32 * Math.exp(-dx2 * dx2) * Math.pow(ny, 2.4);
    v *= 0.8 + 0.2 * Math.sin(x * 0.017 + t * 1.6) * Math.sin(y * 0.02 - t * 2.2); // flicker
    if (y > base) { const f = (y - base) / (s * 2.5); v *= Math.exp(-f * f); }     // fade below base
    v *= level;
    // Sparks: hot spots that break off the tip and rise
    for (const sp of sparks) {
      const ddy = y - sp.y;
      if (ddy > s * 3 || ddy < -s * 3) continue;
      const ddx = x - sp.x;
      v += sp.life * 0.7 * Math.exp(-(ddx * ddx + ddy * ddy) / (s * s * 1.6));
    }
    // Pointer: dots swell around the cursor or finger, like a lens
    if (pointer.heat > 0.01) {
      const px = x - pointer.x, py = y - pointer.y;
      v += 0.42 * pointer.heat * Math.exp(-(px * px + py * py) / (s * s * 42));
    }
    return Math.min(1, v);
  };

  const step = () => {
    t += 0.035;
    level += (target - level) * 0.08;
    pointer.heat += ((pointer.on ? 1 : 0) - pointer.heat) * 0.08;
    const lean = pointer.on ? (pointer.x - homeX) * 0.22 : 0;
    fx += (homeX + lean - fx) * 0.06;
    if (level > 0.5 && sparks.length < (w < 700 ? 3 : 6) && Math.random() < 0.06) {
      sparks.push({ x: fx + (Math.random() - 0.5) * width * 0.35, y: base * (0.45 + Math.random() * 0.15), vy: s * (0.18 + Math.random() * 0.2), drift: (Math.random() - 0.5) * 0.6, life: 1 });
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.y -= sp.vy; sp.x += sp.drift; sp.life -= 0.012;
      if (sp.life <= 0 || sp.y < -s) sparks.splice(i, 1);
    }
  };

  const draw = () => {
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const buckets = [[], [], [], [], []];
    const rowH = s * 0.866;
    for (let j = 0, y = 0; y < h + s; j++, y = j * rowH) {
      for (let x = (j % 2) * s / 2; x < w + s; x += s) {
        const v = heat(x, y);
        const r = s * 0.46 * Math.pow(v, 0.75); // dots never quite touch, so it reads as print
        if (r < 0.45) continue;
        const b = v > 0.94 ? 4 : v > 0.7 ? 3 : v > 0.45 ? 2 : v > 0.2 ? 1 : 0;
        buckets[b].push(x, y, r);
      }
    }
    buckets.forEach((pts, b) => {
      ctx.fillStyle = `rgba(${bands[b]},${alphas[b]})`;
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 3) {
        ctx.moveTo(pts[i] + pts[i + 2], pts[i + 1]);
        ctx.arc(pts[i], pts[i + 1], pts[i + 2], 0, Math.PI * 2);
      }
      ctx.fill();
    });
  };

  const frameGap = () => (w < 700 ? 42 : 33); // ~24fps on phones, ~30fps elsewhere
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (now - last < frameGap()) return;
    last = now; step(); draw();
  };
  const start = () => { if (!running && !reducedMotion) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize(); draw();
  const remeasure = () => { resize(); draw(); };
  window.addEventListener("load", remeasure);
  let timer;
  window.addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(remeasure, 150); });
  new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  if (interactive && !reducedMotion) {
    const at = (cx, cy) => { const r = canvas.getBoundingClientRect(); pointer.x = cx - r.left; pointer.y = cy - r.top; pointer.on = true; };
    host.addEventListener("pointermove", (e) => at(e.clientX, e.clientY), { passive: true });
    host.addEventListener("touchmove", (e) => at(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    host.addEventListener("pointerleave", () => { pointer.on = false; });
    host.addEventListener("touchend", () => { pointer.on = false; });
  }

  return {
    setIntensity(v) { target = v; if (reducedMotion) { level = v; draw(); } },
    remeasure,
  };
}

function initFlames() {
  $$("canvas[data-flame]").forEach((c) => {
    if (c.dataset.flame === "loader") return; // the loader drives its own
    const host = c.parentElement;
    const anchor = $("[data-flame-anchor]", host) || $(".fan", host) || $(".page-title", host);
    createFlame(c, { anchor, tone: c.dataset.tone, interactive: true, intensity: c.dataset.intensity ? +c.dataset.intensity : 1 });
  });
}

/* Fanned prints: up to three pieces dealt on a tilt */
const fanHTML = (items, cls = "") => `
  <div class="fan ${cls}">
    ${items.map((it, i) => `
      <button class="fan-card" data-fan="${i}" aria-label="View ${esc(it.caption)}">
        <img ${imgAttrs(it.src, 640)} alt="${esc(it.caption)}" loading="lazy" decoding="async">
      </button>`).join("")}
  </div>`;

/* ---------- 5. Work grid + drawer ---------- */
const drawer = { el: null, body: null, current: null, list: [] };

function renderWork(filter = "all") {
  const grid = $("#workGrid");
  const items = PROJECTS.filter((p) => filter === "all" || p.tags.includes(filter));
  grid.innerHTML = items.map((p, i) => `
    <a class="work-card${i === 0 ? " is-lead" : ""}" href="#project-${p.id}" data-open-project="${p.id}">
      <figure class="work-media">
        <img ${imgAttrs(p.cover, 640, p.coverFallback)} alt="" loading="lazy" decoding="async">
      </figure>
      <div class="work-info">
        <span class="work-client">${esc(p.client)}</span>
        <span class="work-title">${esc(p.title)}</span>
        <span class="work-meta">${esc(p.meta)}</span>
        <span class="work-open">View case study</span>
      </div>
    </a>`).join("");
  $("#workEmpty").hidden = items.length > 0;
}

/* Reusable single-choice filter chips */
function bindChips(group, onPick) {
  const chips = $$(".chip", group);
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
    onPick(chip.dataset.filter);
  }));
}

function initHomeWork() {
  if (!$("#workGrid")) return;
  renderWork();
  bindChips($("#workFilters"), renderWork);
}

function initDrawer() {
  drawer.el = $("#drawer");
  if (!drawer.el) return;
  drawer.body = $("#drawerBody");
  closeOnBackdrop(drawer.el);
  drawer.el.addEventListener("close", () => {
    // Stop any playing video and tidy the URL
    $$("iframe", drawer.body).forEach((f) => f.remove());
    if (location.hash.startsWith("#project-")) history.replaceState(null, "", location.pathname + location.search);
  });
  enableSwipeDown(drawer.el);

  // Any element with data-open-project opens that case study
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-project]");
    if (!trigger) return;
    e.preventDefault();
    openProject(trigger.dataset.openProject);
  });

  const fromHash = location.hash.match(/^#project-(.+)$/);
  if (fromHash) openProject(fromHash[1]);
}

function openProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  drawer.current = p;
  const cats = Object.keys(p.gallery);
  const total = cats.reduce((n, c) => n + p.gallery[c].length, 0);
  const next = PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];

  drawer.body.innerHTML = `
    <figure class="cs-hero"><img ${imgAttrs(p.cover, 1400, p.coverFallback)} alt="${esc(p.title)}"></figure>
    <p class="cs-client">${esc(p.client)}</p>
    <h2 class="cs-title" id="drawerTitle">${esc(p.title)}</h2>
    <div class="cs-body">
      <div class="cs-story">
        ${p.story.map((s) => `<p>${esc(s)}</p>`).join("")}
        ${p.quote ? `<figure class="cs-quote"><blockquote>“${esc(p.quote.text)}”</blockquote><figcaption>${esc(p.quote.by)}</figcaption></figure>` : ""}
      </div>
      <aside class="cs-side">
        <div><h3>Result</h3><p class="cs-result">${esc(p.result)}</p></div>
        <div><h3>What we delivered</h3><ul>${p.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
      </aside>
    </div>

    <div class="cs-gallery-head">
      <h3>The work</h3>
      ${cats.length > 1 ? `<div class="cs-tabs" role="group" aria-label="Filter gallery">
        <button class="chip is-active" data-cat="all" aria-pressed="true">All<span class="cs-count">${total}</span></button>
        ${cats.map((c) => `<button class="chip" data-cat="${c}" aria-pressed="false">${c}<span class="cs-count">${p.gallery[c].length}</span></button>`).join("")}
      </div>` : ""}
    </div>
    <div class="gallery" id="gallery"></div>

    ${p.videos.length ? `
      <div class="cs-gallery-head"><h3>Film</h3></div>
      <div class="videos">${p.videos.map((v) => `
        <div class="video"><button data-video="${v}" aria-label="Play video">
          <img src="https://i.ytimg.com/vi/${v}/hqdefault.jpg" alt="" loading="lazy">
        </button></div>`).join("")}
      </div>` : ""}

    <div class="cs-next">
      <span>Next project</span>
      <button class="btn btn-ghost" data-open-project="${next.id}">${esc(next.title)}</button>
    </div>`;

  renderGallery("all");
  $$(".cs-tabs .chip", drawer.body).forEach((chip) => chip.addEventListener("click", () => {
    $$(".cs-tabs .chip", drawer.body).forEach((c) => { c.classList.toggle("is-active", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
    renderGallery(chip.dataset.cat);
  }));
  // Video facade: the YouTube player only loads when asked for
  $$("[data-video]", drawer.body).forEach((b) => b.addEventListener("click", () => {
    b.parentElement.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }));

  history.replaceState(null, "", `#project-${p.id}`);
  if (!drawer.el.open) drawer.el.showModal();
  drawer.body.scrollTop = 0;
}

function renderGallery(cat) {
  const p = drawer.current;
  drawer.list = cat === "all" ? Object.values(p.gallery).flat() : p.gallery[cat];
  $("#gallery").innerHTML = drawer.list.map((g, i) => `
    <button class="gallery-item" data-index="${i}" aria-label="View ${esc(g.caption)}">
      <img ${imgAttrs(g.src, 640)} alt="${esc(g.caption)}" loading="lazy" decoding="async">
    </button>`).join("");
  $$(".gallery-item", drawer.body).forEach((b) => b.addEventListener("click", () => lightbox.open(drawer.list, +b.dataset.index)));
}

/* Drag the sheet's top bar down to close it on phones */
function enableSwipeDown(dialog) {
  const bar = $(".drawer-bar", dialog);
  let startY = null, dy = 0;
  bar.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; dialog.style.transition = "none"; }, { passive: true });
  bar.addEventListener("touchmove", (e) => {
    if (startY === null) return;
    dy = Math.max(0, e.touches[0].clientY - startY);
    dialog.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  bar.addEventListener("touchend", () => {
    dialog.style.transition = ""; dialog.style.transform = "";
    if (dy > 110) dialog.close();
    startY = null; dy = 0;
  });
}

/* ---------- 6. Lightbox ---------- */
const lightbox = {
  el: null, list: [], i: 0,
  init() {
    this.el = $("#lightbox");
    closeOnBackdrop(this.el);
    $$("[data-lb]", this.el).forEach((b) => b.addEventListener("click", () => this.step(+b.dataset.lb)));
    this.el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") this.step(1);
      if (e.key === "ArrowLeft") this.step(-1);
    });
    let x0 = null;
    const imgEl = $("#lbImg");
    imgEl.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    imgEl.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
      x0 = null;
    });
  },
  open(list, i) { this.list = list; this.i = i; this.show(); this.el.showModal(); },
  step(d) { this.i = (this.i + d + this.list.length) % this.list.length; this.show(); },
  show() {
    const item = this.list[this.i];
    setPic($("#lbImg"), item.src, 1400);
    $("#lbImg").alt = item.caption;
    $("#lbCap").textContent = `${item.caption}  ${this.i + 1} of ${this.list.length}`;
  },
};

/* ---------- 7. Project brief ---------- */
function initBrief() {
  const form = $("#brief");
  const panels = $$(".brief-panel", form);
  const dots = $$(".brief-steps li", form);
  const back = $("#briefBack"), next = $("#briefNext"), send = $("#briefSend"), err = $("#briefError");
  let step = 1;
  const last = panels.length;

  const values = () => {
    const d = new FormData(form);
    return {
      services: d.getAll("services"), type: d.get("type") || "", timeline: d.get("timeline") || "",
      details: (d.get("details") || "").trim(), budget: d.get("budget") || "",
      name: (d.get("name") || "").trim(), company: (d.get("company") || "").trim(), phone: (d.get("phone") || "").trim(),
    };
  };

  const checks = {
    1: (v) => v.services.length ? "" : "Choose at least one service to continue.",
    2: (v) => !v.type ? "Choose the type of project." : !v.timeline ? "Choose a timeline." : "",
    3: (v) => v.budget ? "" : "Choose a budget range, or pick “Not sure yet”.",
    4: (v) => !v.name ? "Add your name so we know who to reply to." : v.phone.replace(/\D/g, "").length < 7 ? "Add a phone or WhatsApp number we can reach." : "",
  };

  const summary = (v) => `
    <dl>
      <dt>Services</dt><dd>${esc(v.services.join(", "))}</dd>
      <dt>Project</dt><dd>${esc(v.type)}, ${esc(v.timeline.toLowerCase())}</dd>
      <dt>Budget</dt><dd>${esc(v.budget)}</dd>
    </dl>`;

  const go = (n) => {
    step = n;
    panels.forEach((p) => p.classList.toggle("is-active", +p.dataset.step === step));
    dots.forEach((d, i) => { d.classList.toggle("is-current", i + 1 === step); d.classList.toggle("is-done", i + 1 < step); });
    back.hidden = step === 1;
    next.hidden = step === last;
    send.hidden = step !== last;
    err.textContent = "";
    if (step === last) $("#briefSummary").innerHTML = summary(values());
  };

  next.addEventListener("click", () => {
    const problem = checks[step](values());
    if (problem) { err.textContent = problem; return; }
    go(step + 1);
    form.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  });
  back.addEventListener("click", () => go(step - 1));

  $$("[data-send]", form).forEach((b) => b.addEventListener("click", () => {
    const v = values();
    const problem = checks[4](v);
    if (problem) { err.textContent = problem; return; }
    const text = [
      "New project brief from blueemberja.com", "",
      `Name: ${v.name}`, v.company && `Company: ${v.company}`, `Phone: ${v.phone}`,
      `Services: ${v.services.join(", ")}`, `Project: ${v.type}`, `Timeline: ${v.timeline}`, `Budget (JMD): ${v.budget}`,
      v.details && `Details: ${v.details}`,
    ].filter(Boolean).join("\n");
    const url = b.dataset.send === "whatsapp"
      ? waLink(text)
      : `mailto:${CONFIG.projectEmail}?subject=${encodeURIComponent(`Project brief: ${v.company || v.name}`)}&body=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  }));

  // Arriving from a service page (index.html?service=design#start) ticks that service
  const fromUrl = new URLSearchParams(location.search).get("service");
  if (fromUrl) {
    const box = $(`input[name="services"][value="${fromUrl[0].toUpperCase() + fromUrl.slice(1)}"]`, form);
    if (box) box.checked = true;
  }

  // "Start a décor project" style links preselect a service
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-preselect]");
    if (!t) return;
    const box = $(`input[name="services"][value="${t.dataset.preselect[0].toUpperCase() + t.dataset.preselect.slice(1)}"]`, form);
    if (box) box.checked = true;
    go(1);
    if (t.dataset.goto) $("#" + t.dataset.goto).scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
}

/* ---------- 8. Client desk ---------- */
function initDesk() {
  const dialog = $("#deskDialog");
  const body = $("#deskBody");
  const qty = {};
  closeOnBackdrop(dialog);
  enableSwipeDown(dialog);

  const login = () => {
    body.innerHTML = `
      <form class="desk-login" id="deskLogin">
        <h2 id="deskTitle">Client desk</h2>
        <p>Sign in to see your print history and request reprints.</p>
        <p class="desk-demo-note">Preview mode: sign in with the demo account below.</p>
        <label class="field"><span>Email</span><input type="email" value="marketing@democlient.jm" readonly></label>
        <label class="field"><span>Access code</span><input type="password" value="demo-access" readonly></label>
        <button class="btn btn-flame" type="submit">Sign in</button>
      </form>`;
    $("#deskLogin").addEventListener("submit", (e) => { e.preventDefault(); dashboard(); });
  };

  const trayText = () => {
    const picked = DESK_DEMO.items.filter((i) => qty[i.id] > 0);
    return picked.length ? picked.map((i) => `${qty[i.id]} ${i.unit}`).join(", ") : "Nothing selected yet";
  };

  const dashboard = () => {
    body.innerHTML = `
      <header class="desk-head">
        <h2 id="deskTitle">Welcome back</h2>
        <p>${esc(DESK_DEMO.client)}. Choose quantities and send one reprint request.</p>
      </header>
      <div class="desk-items">
        ${DESK_DEMO.items.map((i) => `
          <article class="desk-item">
            <img ${imgAttrs(i.src, 320)} alt="" loading="lazy">
            <div><h3>${esc(i.name)}</h3><p>${esc(i.spec)}</p><p>${esc(i.last)}</p></div>
            <div class="desk-item-actions">
              <div class="stepper" aria-label="Quantity for ${esc(i.name)}">
                <button type="button" data-id="${i.id}" data-d="-1" aria-label="Fewer">−</button>
                <output id="q-${i.id}">${qty[i.id] || 0}</output>
                <button type="button" data-id="${i.id}" data-d="1" aria-label="More">+</button>
              </div>
            </div>
          </article>`).join("")}
      </div>
      <div class="desk-tray">
        <p>Request: <b id="trayText">${trayText()}</b></p>
        <button class="btn btn-flame" id="sendReprint">Send reprint request</button>
      </div>`;

    $$(".stepper button", body).forEach((b) => b.addEventListener("click", () => {
      const item = DESK_DEMO.items.find((i) => i.id === b.dataset.id);
      qty[item.id] = Math.max(0, (qty[item.id] || 0) + item.step * +b.dataset.d);
      $(`#q-${item.id}`).textContent = qty[item.id];
      $("#trayText").textContent = trayText();
    }));
    $("#sendReprint").addEventListener("click", () => {
      const picked = DESK_DEMO.items.filter((i) => qty[i.id] > 0);
      if (!picked.length) { $("#trayText").textContent = "Add at least one item first"; return; }
      const text = [`Reprint request: ${DESK_DEMO.client}`, "", ...picked.map((i) => `${i.name} (${i.spec}): ${qty[i.id]} ${i.unit}`)].join("\n");
      window.open(waLink(text), "_blank", "noopener");
    });
  };

  $("#openDesk").addEventListener("click", () => { login(); dialog.showModal(); });
}

/* ---------- 9. BizPlej ---------- */
function initBizplej() {
  const box = $("#countdown");
  if (!CONFIG.bizplejDate) {
    $("#rsvpTitle").textContent = "Join the guest list";
    box.innerHTML = `<p class="countdown-note">The next BizPlej date is being set. Join the guest list and your invitation arrives first.</p>`;
  } else {
    const target = new Date(CONFIG.bizplejDate).getTime();
    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0) { box.innerHTML = `<p class="countdown-note">BizPlej is happening now. See you there.</p>`; return clearInterval(timer); }
      const u = { Days: Math.floor(ms / 864e5), Hours: Math.floor(ms / 36e5) % 24, Minutes: Math.floor(ms / 6e4) % 60, Seconds: Math.floor(ms / 1e3) % 60 };
      box.innerHTML = `<div class="countdown-units">${Object.entries(u).map(([k, v]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${k}</span></div>`).join("")}</div>`;
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  $("#rsvp").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const name = (d.get("name") || "").trim(), company = (d.get("company") || "").trim();
    const err = $("#rsvpError");
    if (!name || !company) { err.textContent = "Add your name and company to reserve."; return; }
    err.textContent = "";
    window.open(waLink(`BizPlej RSVP\n\nName: ${name}\nCompany: ${company}\nGuests: ${d.get("guests")}`), "_blank", "noopener");
  });
}

/* ---------- 10. Site tour ---------- */
function initTour() {
  const el = $("#tour");
  const back = $("#tourBack"), next = $("#tourNext");
  let i = 0, lit = null;

  const highlight = (sel) => {
    lit?.classList.remove("tour-target");
    lit = sel ? $(sel) : null;
    if (!lit) return;
    lit.classList.add("tour-target");
    if (getComputedStyle(lit).position !== "fixed") lit.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const render = () => {
    const s = TOUR[i];
    $("#tourCount").textContent = `${i + 1} of ${TOUR.length}`;
    $("#tourTitle").textContent = s.title;
    $("#tourText").textContent = s.text;
    $("#tourBar").style.width = `${((i + 1) / TOUR.length) * 100}%`;
    back.hidden = i === 0;
    next.textContent = i === 0 ? "Start the tour" : i === TOUR.length - 1 ? "Finish" : "Next";
    highlight(s.target);
  };

  const open = () => { i = 0; render(); el.show(); document.body.classList.add("tour-open"); };
  const close = () => { el.close(); };

  el.addEventListener("close", () => {
    highlight(null);
    document.body.classList.remove("tour-open");
    storage.set(CONFIG.tourKey, "1");
  });
  next.addEventListener("click", () => (i === TOUR.length - 1 ? close() : (i++, render())));
  back.addEventListener("click", () => { i--; render(); });
  $$("[data-close]", el).forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && el.open) close(); });
  $("#openTour").addEventListener("click", (e) => { e.preventDefault(); open(); });

  // First visit: open once the intro loader has lifted
  const openWhenReady = () => document.documentElement.classList.contains("is-loading") ? setTimeout(openWhenReady, 300) : setTimeout(open, 1200);
  if (location.hash === "#tour" || !storage.get(CONFIG.tourKey)) openWhenReady(); // other pages link here with #tour
}

/* ---------- 11. Work archive page ---------- */
const allPieces = () => PROJECTS.flatMap((p) =>
  Object.entries(p.gallery).flatMap(([medium, list]) =>
    list.map((g) => ({ ...g, medium, caption: `${g.caption}, ${p.client}` }))));

/* The three fan pieces for a project, with captions from its gallery */
const fanItems = (p) => {
  const all = Object.values(p.gallery).flat();
  return (p.fan || all.slice(0, 3).map((g) => g.src.replace(UP, ""))).map((file) => {
    const found = all.find((g) => g.src === UP + file);
    return { src: UP + file, caption: found ? `${found.caption}, ${p.client}` : p.client };
  });
};

function renderArchive(filter = "all") {
  const list = $("#archiveList");
  const projects = PROJECTS.filter((p) => filter === "all" || p.tags.includes(filter));
  list.innerHTML = projects.map((p) => {
    const count = Object.values(p.gallery).flat().length + p.videos.length;
    return `
    <article class="archive-row">
      ${fanHTML(fanItems(p), "archive-fan")}
      <div class="archive-text">
        <p class="work-client">${esc(p.client)}</p>
        <h2 class="archive-title">${esc(p.title)}</h2>
        <p class="archive-result">${esc(p.result)}</p>
        <p class="archive-meta">${esc(p.deliverables.join(", "))}</p>
        <a class="btn btn-ghost" href="#project-${p.id}" data-open-project="${p.id}">Open case study, ${count} pieces</a>
      </div>
    </article>`;
  }).join("");
  $("#archiveEmpty").hidden = projects.length > 0;
  $$(".archive-row", list).forEach((row, r) => {
    const pieces = fanItems(projects[r]);
    $$(".fan-card", row).forEach((c) => c.addEventListener("click", () => lightbox.open(pieces, +c.dataset.fan)));
  });
}

function initArchive() {
  if (!$("#archiveList")) return;
  const pieces = allPieces();
  $("#archiveCount").textContent = `${PROJECTS.length} case studies and ${pieces.length} pieces of work, from identity to point of sale.`;
  renderArchive();
  bindChips($("#archiveFilters"), renderArchive);

  // The wall: every piece, filterable by medium, revealed in batches
  const wall = $("#wall"), more = $("#wallMore");
  const media = [...new Set(pieces.map((x) => x.medium))];
  $("#wallFilters").innerHTML = ["All", ...media].map((m, i) =>
    `<button class="chip${i ? "" : " is-active"}" data-filter="${m === "All" ? "all" : m}" aria-pressed="${!i}">${m}</button>`).join("");
  const BATCH = 12;
  let shown = BATCH, current = pieces;

  const draw = () => {
    wall.innerHTML = current.slice(0, shown).map((g, i) => `
      <button class="gallery-item" data-index="${i}" aria-label="View ${esc(g.caption)}">
        <img ${imgAttrs(g.src, 640)} alt="${esc(g.caption)}" loading="lazy" decoding="async">
      </button>`).join("");
    more.hidden = shown >= current.length;
    more.textContent = `Show more (${current.length - shown} left)`;
  };
  wall.addEventListener("click", (e) => {
    const b = e.target.closest(".gallery-item");
    if (b) lightbox.open(current, +b.dataset.index);
  });
  more.addEventListener("click", () => { shown += BATCH; draw(); });
  bindChips($("#wallFilters"), (m) => {
    current = m === "all" ? pieces : pieces.filter((x) => x.medium === m);
    shown = BATCH;
    draw();
  });
  draw();
}

/* Services page: highlight the section in view in the sticky sub-nav */
function initSubnav() {
  const links = $$(".subnav a");
  if (!links.length) return;
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove("is-active"));
      const a = byId.get(e.target.id);
      a.classList.add("is-active");
      a.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Loader ----------
   The saber traces the Blue Ember logo as the first screen loads, so the
   drawing IS the progress bar, while the flame beneath ignites with it.
   It waits for what the first screen needs (fonts, logo, hero images);
   everything further down loads quietly as you scroll, so slow
   connections are never stuck behind the whole site. Once per visit. */
function initLoader() {
  const root = document.documentElement;
  const el = $("#loader");
  if (!el) return;
  if (!root.classList.contains("is-loading")) { el.remove(); return; }

  const flame = createFlame($(".loader-flame", el), { anchor: $(".loader-logo", el), intensity: 0.05 });
  const pctEl = $("#loaderPct");

  // What the first screen needs
  const tasks = [
    document.fonts.load('700 1em "Syne"'),
    document.fonts.load('400 1em "Instrument Sans"'),
    ...$$(".site-header img, .hero img, .page-hero img")
      .filter((im) => im.getAttribute("src") && im.getBoundingClientRect().top < window.innerHeight) // first screen only
      .map(imageReady),
  ];
  let done = 0;
  tasks.forEach((p) => p.finally(() => done++));

  const started = performance.now();
  const MIN_MS = reducedMotion ? 300 : 1600;   // long enough to see the saber work
  const MAX_MS = 12000;                        // on very slow connections, open anyway
  let shown = 0, finished = false;

  const tick = (now) => {
    if (finished) return;
    const elapsed = now - started;
    const real = elapsed > MAX_MS ? 1 : done / tasks.length;
    const pace = Math.min(1, elapsed / MIN_MS);           // never faster than MIN_MS
    shown += (Math.min(real, pace) - shown) * 0.12;
    if (real === 1 && pace === 1 && shown > 0.995) shown = 1;
    el.style.setProperty("--prog", shown.toFixed(4));
    pctEl.textContent = Math.round(shown * 100);
    flame.setIntensity(0.05 + 0.95 * shown);
    if (shown === 1) return complete();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  function complete() {
    finished = true;
    el.classList.add("is-complete");                      // logo fills in
    setTimeout(() => {
      el.classList.add("is-done");                        // loader lifts, the page flame carries on
      root.classList.remove("is-loading");
      storage.session("be-loaded");
      setTimeout(() => el.remove(), 900);
    }, reducedMotion ? 100 : 650);
  }
}

/* Resolves when an image has loaded, or has run out of fallbacks */
function imageReady(im) {
  return new Promise((resolve) => {
    if (im.complete && im.naturalWidth) return resolve();
    im.addEventListener("load", resolve, { once: true });
    im.addEventListener("error", function onErr() {
      if (im.dataset.retrying) { delete im.dataset.retrying; return; } // a fallback is loading
      im.removeEventListener("error", onErr); resolve();
    });
  });
}

/* ---------- 3D phone ----------
   Front glass, back panel and stacked edge slices give it real depth. */
const phoneHTML = (auto) => {
  const posts = PHONE_FEED.map((p) => `
    <article class="ph-post">
      <header><span class="ph-avatar">${esc(p.name[0])}</span><b>${esc(p.name)}</b></header>
      <img ${imgAttrs(p.src, 640)} alt="" loading="lazy" decoding="async">
      <p>${esc(p.caption)}</p>
    </article>`).join("");
  const slices = Array.from({ length: 10 }, (_, i) => `<span class="ph-slice" style="--i:${i}"></span>`).join("");
  return `
    <div class="ph-body">
      ${slices}
      <div class="ph-face ph-back"><span class="ph-camera"></span><img class="ph-logo" src="logo.svg" alt=""></div>
      <div class="ph-face ph-front">
        <div class="ph-screen">
          <div class="ph-status"><span>9:41</span><span class="ph-island"></span><span class="ph-bat"></span></div>
          <div class="ph-feed">${posts}${auto ? posts : ""}</div>
          <span class="ph-glare"></span>
        </div>
      </div>
    </div>`;
};

function initPhones() {
  $$("[data-phone]").forEach((el) => { el.innerHTML = phoneHTML(el.classList.contains("phone-auto")); });
}

/* ---------- Scroll scene ----------
   JS only publishes scroll progress as --p (0 to 1); CSS does the motion. */
function initScenes() {
  const scenes = $$(".scene");
  if (!scenes.length || reducedMotion) return;
  let ticking = false;

  const measure = (scene) => {
    const feed = $(".ph-feed", scene), screen = $(".ph-screen", scene);
    if (feed && screen) scene.style.setProperty("--travel", `${Math.max(0, feed.scrollHeight - screen.clientHeight * 0.85)}px`);
  };
  const update = () => {
    ticking = false;
    scenes.forEach((scene) => {
      const r = scene.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / range));
      scene.style.setProperty("--p", p.toFixed(4));
      const steps = $$(".scene-step", scene);
      const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach((s, i) => s.classList.toggle("is-active", i === active));
      $$(".scene-dots span", scene).forEach((d, i) => d.classList.toggle("is-active", i === active));
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  scenes.forEach(measure);
  window.addEventListener("load", () => { scenes.forEach(measure); update(); });
  window.addEventListener("resize", () => { scenes.forEach(measure); onScroll(); });
  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

/* ---------- Work tickers: rows of real pieces that drift sideways ----------
   data-ticker is where in the archive the row starts, so rows differ. */
function initTickers() {
  const pieces = allPieces();
  $$("[data-ticker]").forEach((el) => {
    const start = +el.dataset.ticker || 0;
    const row = Array.from({ length: 14 }, (_, i) => pieces[(start + i) % pieces.length]);
    const html = row.map((g) => `<span class="ticker-item"><img ${imgAttrs(g.src, 320)} alt="" decoding="async"></span>`).join("");
    const eager = el.closest(".hero"); // the hero row is on screen at once
    el.innerHTML = `<div class="ticker-track">${eager ? html : html.replaceAll(" src=", " data-src=")}${html.replaceAll(" src=", " data-src=")}</div>`;
    // Rows (and the duplicate half) load only as they come near the screen
    new IntersectionObserver(([en], io) => {
      if (!en.isIntersecting) return;
      $$("img[data-src]", el).forEach((im) => { im.src = im.dataset.src; im.removeAttribute("data-src"); });
      io.disconnect();
    }, { rootMargin: "400px" }).observe(el);
  });
}

/* ---------- Light parallax for anything with data-speed ---------- */
function initParallax() {
  const els = $$("[data-speed]");
  if (!els.length || reducedMotion) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
      el.style.translate = `0 ${offset.toFixed(1)}px`;
    });
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- 12. Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initHeader();
  initPhones();
  initTickers();
  initLoader();
  initScenes();
  initParallax();
  initFlames();
  initHomeWork();
  initDrawer();
  initArchive();
  initSubnav();
  if ($("#lightbox")) lightbox.init();
  if ($("#brief")) initBrief();
  if ($("#openDesk")) initDesk();
  if ($("#countdown")) initBizplej();
  if ($("#tour")) initTour();
});


/* ===== Scroll reveals: sections settle onto the sheet (progressive, motion-safe) ===== */
document.addEventListener("DOMContentLoaded", function () {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var SELECTORS = [
    ".section-head", ".dim", ".work-card", ".quote", ".svc",
    ".stats-grid > div", ".visit-grid > div", ".client-grid > li",
    ".svc-list > li", ".fact"
  ];
  var els = document.querySelectorAll(SELECTORS.join(", "));
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -5% 0px", threshold: 0 });
  els.forEach(function (el) {
    el.classList.add("rv");
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    if (sibs) el.style.setProperty("--rvd", Math.min(sibs, 5) * 70 + "ms");
    io.observe(el);
  });
});

/* ===== Active nav: the page you are on is underlined in the rule ===== */
(function () {
  var here = (location.pathname.split("/").pop() || "index.html").split("#")[0];
  document.querySelectorAll(".nav a:not(.btn)").forEach(function (a) {
    var href = (a.getAttribute("href") || "").trim();
    if (!href || href.indexOf("#") !== -1) return;
    if (href.split("#")[0] === here) a.setAttribute("aria-current", "page");
  });
})();


// Before/after transformation slider
const cmpStage = document.querySelector('.compare-stage');
if (cmpStage) {
  const cmpRange = cmpStage.querySelector('.compare-range');
  const setCmp = v => cmpStage.style.setProperty('--cx', v + '%');
  let cmpUser = false;
  setCmp(cmpRange.value);
  cmpRange.addEventListener('input', () => {
    cmpUser = true;
    cmpStage.classList.add('is-used');
    setCmp(cmpRange.value);
  });
  // One-time demo sweep when the stage scrolls into view
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    let cmpDemoDone = false;
    const cmpDemo = entries => {
      if (cmpDemoDone || cmpUser) return;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        cmpDemoDone = true;
        const t0 = performance.now(), dur = 2200;
        const step = now => {
          if (cmpUser) return;
          const t = Math.min(1, (now - t0) / dur);
          const pos = 50 + 22 * Math.sin(t * Math.PI * 2);
          setCmp(pos.toFixed(2) + '%');
          if (t < 1) requestAnimationFrame(step);
          else { setCmp('50%'); cmpRange.value = 50; }
        };
        requestAnimationFrame(step);
        break;
      }
    };
    new IntersectionObserver(cmpDemo, { threshold: 0.45 }).observe(cmpStage);
  }
}
