/* ============================================================
   Deadline tracker logic. Reads DEADLINES from data.js.
   ============================================================ */

const CATEGORY_ORDER = [
  "Real-Time & Embedded",
  "Mobile & Sensing",
  "Systems",
  "Machine Learning",
  "Computer Vision",
  "Robotics",
  "Personal",
];

const CATEGORY_COLOR = {
  "Real-Time & Embedded": "#d0682f",
  "Mobile & Sensing":     "#2f8fd0",
  "Systems":              "#8a5cd0",
  "Machine Learning":     "#2fb0a0",
  "Computer Vision":      "#c0497a",
  "Robotics":             "#5a9e3a",
  "Personal":             "#c79a2f",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY = 86400000;

/* ---------- date helpers ---------- */
// Read the calendar parts straight from the ISO string so the displayed
// date is the *official* one (e.g. "Sep 24, AoE"), not shifted into the
// viewer's local timezone. The countdown below stays timezone-exact.
function isoParts(iso) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return { y: +m[1], mo: +m[2], d: +m[3], hh: +m[4], mm: +m[5] };
}
function fmtDate(iso) {
  const p = isoParts(iso);
  return `${MONTHS[p.mo - 1]} ${p.d}, ${p.y}`;
}
function ts(iso) { return new Date(iso).getTime(); }

// The next sub-deadline you must hit: the abstract if it's still ahead,
// otherwise the paper deadline.
function targetOf(e) {
  if (e.abstract && ts(e.abstract) > Date.now()) return { iso: e.abstract, label: "abstract" };
  return { iso: e.paper, label: "paper" };
}
function isPassed(e) { return ts(e.paper) < Date.now(); }
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
       + "T" + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + "00Z";
}
function gcalLink(e, t) {
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
const state = { query: "", cats: new Set(), showPassed: false };

/* ---------- rendering ---------- */
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function cardHTML(e) {
  const t = targetOf(e);
  const passed = isPassed(e);
  const color = CATEGORY_COLOR[e.category] || "var(--muted)";

  let ddInner, ddCls;
  if (passed) {
    ddCls = "dd-passed";
    ddInner = `<span class="num">ended</span>`;
  } else {
    const d = daysLeft(t.iso);
    ddCls = ddClass(d);
    ddInner = `<span class="num">${d <= 0 ? "D-DAY" : "D-" + d}</span>`
            + `<span class="dday-label">to ${t.label}</span>`;
  }

  // abstract / paper line
  let dates = `<strong>Paper</strong> ${fmtDate(e.paper)}`;
  if (e.abstract) {
    const aPassed = ts(e.abstract) < Date.now();
    dates += `<span class="dot-sep">·</span><span class="${aPassed ? "sub-passed" : ""}">Abstract ${fmtDate(e.abstract)}</span>`;
  }
  dates += `<span class="dot-sep">·</span><span class="tz">${escapeHTML(e.tz)}</span>`;

  const est = e.estimated
    ? `<span class="est-badge" title="Estimated from previous years — confirm on the official site.">~est</span>`
    : "";

  const links = [];
  if (e.link) links.push(`<a href="${escapeHTML(e.link)}" target="_blank" rel="noopener">CFP ↗</a>`);
  if (!passed) links.push(`<a href="${gcalLink(e, t)}" target="_blank" rel="noopener">+ Calendar</a>`);

  const sub = [];
  if (e.where) sub.push(`📍 ${escapeHTML(e.where)}`);
  if (e.when) sub.push(`🗓 ${escapeHTML(e.when)}`);

  return `<article class="card ${passed ? "passed" : ""}" style="--cat:${color}">
    <div class="dday ${ddCls}">${ddInner}</div>
    <div class="card-body">
      <div class="card-top">
        <h3 class="card-name">${escapeHTML(e.name)}</h3>
        <span class="cat-tag" style="--cat:${color}">${escapeHTML(e.category)}</span>
        ${est}
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
  if (state.cats.size && !state.cats.has(e.category)) return false;
  if (!state.showPassed && isPassed(e)) return false;
  if (state.query) {
    const q = state.query.toLowerCase();
    const hay = (e.name + " " + e.full + " " + (e.where || "")).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sortDeadlines(a, b) {
  const pa = isPassed(a), pb = isPassed(b);
  if (pa !== pb) return pa ? 1 : -1;            // passed sink to the bottom
  if (pa) return ts(b.paper) - ts(a.paper);     // most-recently-passed first
  return ts(targetOf(a).iso) - ts(targetOf(b).iso); // soonest first
}

function render() {
  const items = DEADLINES.filter(passesFilter).sort(sortDeadlines);
  const list = document.getElementById("list");
  const summary = document.getElementById("summary");

  if (!items.length) {
    list.innerHTML = `<p class="empty">No deadlines match. Try clearing filters or showing passed ones.</p>`;
    summary.textContent = "";
    return;
  }

  list.innerHTML = items.map(cardHTML).join("");

  const upcoming = items.filter((e) => !isPassed(e));
  if (upcoming.length) {
    const next = upcoming[0];
    const d = daysLeft(targetOf(next).iso);
    summary.innerHTML = `Showing <strong>${upcoming.length}</strong> upcoming · next: `
      + `<strong>${escapeHTML(next.name)}</strong> in <strong>${d <= 0 ? "D-DAY" : "D-" + d}</strong>`;
  } else {
    summary.innerHTML = `<strong>${items.length}</strong> passed deadline(s).`;
  }
}

/* ---------- build the filter chips ---------- */
function buildChips() {
  const present = CATEGORY_ORDER.filter((c) => DEADLINES.some((e) => e.category === c));
  const wrap = document.getElementById("chips");
  wrap.innerHTML = present.map((c) =>
    `<button class="chip" data-cat="${escapeHTML(c)}" style="--chip-color:${CATEGORY_COLOR[c]}">`
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

  // theme toggle (same behavior as the CV site)
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  render();
  // keep the countdown fresh if the page is left open
  setInterval(render, 60000);
}

document.addEventListener("DOMContentLoaded", init);
