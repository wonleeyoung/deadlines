/* ============================================================
   Deadline tracker logic. Reads DEADLINES from data.js.
   ============================================================ */

const CATEGORY_ORDER = [
  "AI / ML", "Systems / Architecture", "Networking / Mobile", "Security",
  "Database / Data Mining", "Software Eng / PL", "Theory", "HCI",
  "Graphics / Multimedia", "Real-Time & Embedded", "Robotics",
  "Interdisciplinary", "Personal",
];

const CATEGORY_COLOR = {
  "AI / ML": "#13a89e",
  "Systems / Architecture": "#8257d6",
  "Networking / Mobile": "#2f8fd0",
  "Security": "#d8463d",
  "Database / Data Mining": "#c7902a",
  "Software Eng / PL": "#4a9e3a",
  "Theory": "#6366d8",
  "HCI": "#c84f93",
  "Graphics / Multimedia": "#e07b2a",
  "Real-Time & Embedded": "#b85c3c",
  "Robotics": "#7f8c2a",
  "Interdisciplinary": "#888890",
  "Personal": "#2aa0c0",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY = 86400000;

/* ---------- date helpers ---------- */
function isoParts(iso) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return { y: +m[1], mo: +m[2], d: +m[3] };
}
function fmtDate(iso) {
  const p = isoParts(iso);
  return `${MONTHS[p.mo - 1]} ${p.d}, ${p.y}`;
}
function ts(iso) { return new Date(iso).getTime(); }

function isTBD(e) { return !e.paper; }
function expiryOf(e) {
  if (e.paper) return ts(e.paper);
  // A date-only deadline is certainly over only once that day has ended everywhere.
  // This bound is for filtering/sorting; it is not a claimed submission cutoff.
  return e.paperDate ? ts(e.paperDate + "T23:59:59.999-12:00") : NaN;
}
function isPassed(e) { return expiryOf(e) < Date.now(); }

// next sub-deadline to hit: abstract if still ahead, else the paper deadline
function targetOf(e) {
  if (e.abstract && ts(e.abstract) > Date.now()) return { iso: e.abstract, label: "abstract" };
  return { iso: e.paper, label: "paper" };
}
function daysLeft(iso) { return Math.ceil((ts(iso) - Date.now()) / DAY); }

function ddClass(d) {
  if (d <= 7) return "dd-urgent";
  if (d <= 30) return "dd-soon";
  if (d <= 90) return "dd-ok";
  return "dd-far";
}

/* ---------- Google Calendar link ---------- */
function pad(n) { return String(n).padStart(2, "0"); }
function gcalStamp(date) {
  return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate())
       + "T" + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + "Z";
}
function gcalLink(e, t) {
  if (!t.iso) return null;
  const end = new Date(t.iso);
  const start = new Date(end.getTime() - 30 * 60000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.name} — ${t.label} deadline`,
    dates: `${gcalStamp(start)}/${gcalStamp(end)}`,
    details: `${e.full}\n${t.label} deadline (${e.tz}).${e.note ? "\n" + e.note : ""}\n${e.link || ""}`,
    location: e.where || "",
  });
  return "https://calendar.google.com/calendar/render?" + params.toString();
}

/* ---------- state ---------- */
const state = { query: "", cats: new Set(), showPassed: false, bkMode: false };

/* an entry is in scope when it's curated top-tier, personal, or BK mode is on */
function inScope(e) { return e.topTier || e.category === "Personal" || state.bkMode; }

/* ---------- rendering ---------- */
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function cardHTML(e) {
  const tbd = isTBD(e), passed = isPassed(e);
  const dateOnly = tbd && e.paperDate;
  const rolling = tbd && e.deadlineStatus === "rolling";
  const color = CATEGORY_COLOR[e.category] || "var(--muted)";

  let ddInner, ddCls;
  if (passed) {
    ddCls = "dd-passed"; ddInner = `<span class="num">ended</span>`;
  } else if (tbd) {
    ddCls = "dd-tbd"; ddInner = `<span class="num">${rolling ? "open" : dateOnly ? "date" : "TBD"}</span>`;
  } else {
    const t = targetOf(e), d = daysLeft(t.iso);
    ddCls = ddClass(d);
    ddInner = `<span class="num">${d <= 0 ? "D-DAY" : "D-" + d}</span>`
            + `<span class="dday-label">to ${t.label}</span>`;
  }

  const bk = e.bk != null
    ? `<span class="bk-badge bk-${e.bk}" title="BK21플러스 CS IF ${e.bk} / 4">BK ${e.bk}</span>` : "";
  const kiise = e.kiise
    ? `<span class="kiise-badge ${e.kiise === "최우수" ? "k-top" : "k-good"}" title="한국정보과학회 등급">${escapeHTML(e.kiise)}</span>` : "";
  const est = (e.estimated && (!tbd || dateOnly))
    ? `<span class="est-badge" title="Estimated from previous years — confirm on the official site.">~est</span>` : "";
  const precision = dateOnly
    ? `<span class="est-badge" title="${e.estimated ? "The day is estimated; the cutoff time and timezone are unconfirmed." : "The day is confirmed; the cutoff time and timezone are not."}">Date only</span>` : "";

  // dates line
  let dates;
  if (rolling) {
    dates = `<strong>Rolling submissions</strong><span class="dot-sep">·</span>No fixed deadline`;
  } else if (dateOnly) {
    dates = `<strong>${e.estimated ? "Estimated paper" : "Paper"}</strong> ${fmtDate(e.paperDate)}`;
    const abstractDay = e.abstractDate || e.abstract;
    if (abstractDay) dates += `<span class="dot-sep">·</span><strong>Abstract</strong> ${fmtDate(abstractDay)}`;
    dates += `<span class="dot-sep">·</span><span class="tbd-text">Time / timezone unconfirmed</span>`;
  } else if (tbd) {
    dates = `<span class="tbd-text">Deadline not confirmed</span>`;
  } else {
    dates = `<strong>Paper</strong> ${fmtDate(e.paper)}`;
    if (e.abstract) {
      const aPassed = ts(e.abstract) < Date.now();
      dates += `<span class="dot-sep">·</span><span class="${aPassed ? "sub-passed" : ""}">Abstract ${fmtDate(e.abstract)}</span>`;
    }
    if (e.tz) dates += `<span class="dot-sep">·</span><span class="tz">${escapeHTML(e.tz)}</span>`;
  }

  const links = [];
  if (e.link) {
    const dblp = /^https?:\/\/(?:www\.)?dblp\.org(?:[/:?#]|$)/i.test(e.link);
    const label = dblp ? "DBLP ↗" : (tbd ? "Official ↗" : "CFP ↗");
    links.push(`<a href="${escapeHTML(e.link)}" target="_blank" rel="noopener">${label}</a>`);
  }
  if (!passed && !tbd) links.push(`<a href="${gcalLink(e, targetOf(e))}" target="_blank" rel="noopener">+ Calendar</a>`);

  const sub = [];
  if (e.where) sub.push(`📍 ${escapeHTML(e.where)}`);
  if (e.when) sub.push(`🗓 ${escapeHTML(e.when)}`);

  return `<article class="card ${passed ? "passed" : ""} ${tbd ? "tbd" : ""}" style="--cat:${color}">
    <div class="dday ${ddCls}">${ddInner}</div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="card-name">${escapeHTML(e.name)}</h3>
        ${bk}${kiise}
        <span class="cat-tag" style="--cat:${color}">${escapeHTML(e.category)}</span>
        ${est}${precision}
      </div>
      <p class="card-full">${escapeHTML(e.full)}</p>
      <p class="card-meta">${dates}</p>
      <p class="card-sub">
        ${sub.map((s) => `<span>${s}</span>`).join("")}
        ${links.join("")}
      </p>
      ${e.note ? `<p class="card-note">${escapeHTML(e.note)}</p>` : ""}
    </div>
  </article>`;
}

function passesFilter(e) {
  if (!inScope(e)) return false;
  if (state.cats.size && !state.cats.has(e.category)) return false;
  if (!state.showPassed && isPassed(e)) return false;
  if (state.query) {
    const q = state.query.toLowerCase();
    const hay = (e.name + " " + e.full + " " + e.category + " " + (e.where || "")).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

// rank: 0 = upcoming dated, 1 = TBD, 2 = passed
function rankOf(e) { return isPassed(e) ? 2 : (isTBD(e) ? 1 : 0); }
function sortDeadlines(a, b) {
  const ra = rankOf(a), rb = rankOf(b);
  if (ra !== rb) return ra - rb;
  if (ra === 0) return ts(targetOf(a).iso) - ts(targetOf(b).iso);   // soonest first
  if (ra === 1) return (b.bk || 0) - (a.bk || 0) || a.name.localeCompare(b.name); // TBD: by BK
  return expiryOf(b) - expiryOf(a);                                 // passed: most recent first
}

function render() {
  const items = DEADLINES.filter(passesFilter).sort(sortDeadlines);
  const list = document.getElementById("list");
  const summary = document.getElementById("summary");

  if (!items.length) {
    list.innerHTML = `<p class="empty">No deadlines match. Try clearing filters or toggling “BK 학회 전체”.</p>`;
    summary.textContent = "";
    return;
  }
  list.innerHTML = items.map(cardHTML).join("");

  const upcoming = items.filter((e) => !isPassed(e) && !isTBD(e));
  const scopeNote = state.bkMode ? `BK21 CS IF ≥ 1` : `top-tier`;
  if (upcoming.length) {
    const next = upcoming[0], d = daysLeft(targetOf(next).iso);
    summary.innerHTML = `<strong>${items.length}</strong> shown (${scopeNote}) · `
      + `next: <strong>${escapeHTML(next.name)}</strong> in <strong>${d <= 0 ? "D-DAY" : "D-" + d}</strong>`;
  } else {
    summary.innerHTML = `<strong>${items.length}</strong> shown (${scopeNote})`;
  }
}

/* ---------- filter chips (scoped to what's currently shown) ---------- */
function presentCategories() {
  const s = new Set(DEADLINES.filter(inScope).map((e) => e.category));
  return CATEGORY_ORDER.filter((c) => s.has(c));
}
function buildChips() {
  const present = presentCategories();
  // drop any active filters that are no longer available
  state.cats.forEach((c) => { if (!present.includes(c)) state.cats.delete(c); });

  const wrap = document.getElementById("chips");
  wrap.innerHTML = present.map((c) =>
    `<button class="chip ${state.cats.has(c) ? "active" : ""}" data-cat="${escapeHTML(c)}" style="--chip-color:${CATEGORY_COLOR[c]}">`
    + `<span class="dot"></span>${escapeHTML(c)}</button>`).join("");

  wrap.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = btn.dataset.cat;
      if (state.cats.has(c)) { state.cats.delete(c); btn.classList.remove("active"); }
      else { state.cats.add(c); btn.classList.add("active"); }
      render();
    });
  });
}

/* ---------- wire up ---------- */
function init() {
  buildChips();

  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    render();
  });
  document.getElementById("show-passed").addEventListener("change", (e) => {
    state.showPassed = e.target.checked;
    render();
  });
  document.getElementById("bk-toggle").addEventListener("click", (e) => {
    state.bkMode = !state.bkMode;
    e.currentTarget.classList.toggle("active", state.bkMode);
    e.currentTarget.setAttribute("aria-pressed", String(state.bkMode));
    buildChips();   // category set changes with scope
    render();
  });

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  render();
  setInterval(render, 60000);  // keep countdowns fresh
}

document.addEventListener("DOMContentLoaded", init);
