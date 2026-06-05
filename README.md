# Paper Deadlines

A tiny static site that counts down to top-tier CS conference paper deadlines —
curated for real-time, embedded, mobile, systems, ML, vision, and robotics —
and to whatever **personal** deadlines I add.

Live: **https://wonleeyoung.github.io/deadlines/**

## Add / edit a deadline

Everything lives in [`data.js`](data.js) — no build step, no framework.

- **Conferences** are in the `CONFERENCES` array.
- **Your own deadlines** go in the `PERSONAL` array at the top (use `category: "Personal"`).

Copy one block and fill in the fields. Write the deadline as ISO 8601 **with the
timezone offset** so the countdown is exact everywhere:

```js
{
  name: "Grant report",
  full: "Annual progress report",
  category: "Personal",
  abstract: null,
  paper: "2026-07-31T23:59:00+09:00",  // +09:00 = KST · AoE = -12:00 · PST = -08:00
  tz: "KST",
  where: "Yonsei University",
  when: "",
  link: "",
  estimated: false,
  note: "",
}
```

The list auto-sorts by the nearest upcoming deadline, shows a `D-`day badge,
colors it by urgency, and counts the abstract deadline first when there is one.

## Notes

- Conference dates were researched **June 2026**. Entries tagged `~est` are
  estimated from previous years (next-cycle CFP not posted yet) — confirm on the
  official site before relying on one.
- Pure HTML/CSS/JS. To preview locally just open `index.html`.

## Deploy

Hosted with GitHub Pages from the `main` branch (root). Push and it updates:

```bash
git push origin main
```

(Enable Pages once under **Settings → Pages → Branch: main / root**.)
