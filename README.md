# Paper Deadlines

A tiny static site that counts down to CS conference paper deadlines — a curated
**top-tier** set by default, and the full list of **KIISE / BK21-rated** venues
(BK21 CS IF ≥ 1) behind the **BK 학회 전체** toggle — plus any **personal**
deadlines I add.

Live: **https://wonleeyoung.github.io/deadlines/**

Each card shows the D-day countdown, the **BK21 CS IF** score, the **한국정보과학회
(KIISE)** grade, the deadline (abstract first when there is one), location, and a
link to the CFP / Google Calendar.

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
  bk: null,            // BK21 CS IF 1-4, or null
  kiise: null,         // "최우수" / "우수" / null
  abstract: null,
  paper: "2026-07-31T23:59:00+09:00",  // +09:00 = KST · AoE = -12:00 · PST = -08:00
  tz: "KST",
  where: "Yonsei University",
  when: "",
  link: "",
  estimated: false,
  topTier: true,       // true = always shown · false = only under the BK toggle
  note: "",
}
```

The list auto-sorts by the nearest upcoming deadline, shows a `D-`day badge,
colors it by urgency, and counts the abstract deadline first when there is one.
Personal entries are always visible, regardless of the BK toggle.

## Notes

- Conferences = **BK21 CS IF ≥ 1** ([Pusnow’s list](https://gist.github.com/Pusnow/6eb933355b5cb8d31ef1abcb3c3e1206))
  crossed with deadlines from [ccfddl](https://ccfddl.com/), researched **June 2026**.
- Entries tagged `~est` are estimated from previous years; `TBD` ones aren’t
  announced yet — confirm on the official CFP before relying on one.
- Pure HTML/CSS/JS. To preview locally just open `index.html`.

## Deploy

Hosted with GitHub Pages from the `main` branch (root). Push and it updates:

```bash
git push origin main
```

(Enable Pages once under **Settings → Pages → Branch: main / root**.)
