# 🚀 Genome AI — Launch Kit

Everything needed to ship the launch: social banner, demo GIF, walkthrough video,
screenshots, and the Product Hunt gallery. Canonical site: **genomeai.space**.

---

## 1. 🖼️ Hero banner / OG image (1200 × 630)

- **File:** `public/og-image.jpg`
- **Used by:** GitHub social preview, Twitter/X card, LinkedIn, Open Graph meta in
  `index.html`.
- **Spec:** 1200 × 630, green/cream palette, Genome AI logo + DNA helix, tagline
  _"Engineer AI behavior with Digital DNA."_
- ✅ Generated. Referenced via `og:image` / `twitter:image` in `index.html`.

---

## 2. 🎞️ Demo GIF (20–30 seconds)

> Capture from the running app at **1440 × 900** (windowed), then export a looping GIF
> (≈ 12–15 fps, ≤ 8 MB) with [ScreenToGif](https://www.screentogif.com/) or LICEcap.

### Storyboard (≈ 8 scenes, ~3s each)

| # | Time | Action | On-screen caption |
|---|------|--------|-------------------|
| 1 | 0–3s | Landing hero loads; helix animates | "Stop prompting." |
| 2 | 3–6s | Scroll to **Interactive Editor**; drag the **Reasoning** slider up | "Drag a gene…" |
| 3 | 6–9s | Latency/Tokens/Cost metrics update live; behavior readout changes | "…watch behavior change." |
| 4 | 9–12s | Jump to **Playground**; type a task, hit **Run** | "Same prompt…" |
| 5 | 12–15s | Output streams in with reasoning trace + traits | "…different DNA, different answer." |
| 6 | 15–18s | Switch genome → re-run → visibly different tone/length | "Behavior, by design." |
| 7 | 18–21s | **Compare** — 2 genomes side-by-side, metrics table highlights the best | "Measure every genome." |
| 8 | 21–24s | **Benchmark** leaderboard fades in | "genomeai.space" |

**End card:** Genome AI logo + `genomeai.space` + "Behavior is programmable."

**Recording tips:**
- Hide cursor jitter; use smooth, slow drags.
- Keep the cream/green palette pop — no other windows behind.
- Add a subtle 4px brand-green border on the final frame.

---

## 3. 🎥 90-second walkthrough video

> 1920 × 1080, voice-over (calm, confident). Upload to YouTube + embed on the site.

### Script

**[0:00 – 0:08] Hook (over hero)**
"Every time you tweak an AI's behavior, you rewrite a prompt. What if behavior itself
was something you could engineer — and measure?"

**[0:08 – 0:22] The concept (Genome diagram)**
"Meet the Genome: ten tunable genes that define how an AI reasons, plans, verifies,
remembers, and communicates. A reusable blueprint — not a paragraph."

**[0:22 – 0:40] Editor (live)**
"In the Editor, you design a mind with sliders. Push Reasoning, and the agent thinks
deeper. Pull Risk, and it plays safe. Cost and latency update in real time — and every
gene explains what it does."

**[0:40 – 0:58] Playground**
"Run any task. The Genome Engine compiles those genes into the instructions, memory, and
tool policies the model runs. The result? A clear 'why this answer' tied to your genes."

**[0:58 – 1:15] Compare + Benchmark**
"Run multiple genomes on the same task and compare quality, latency, and cost
side-by-side. Then benchmark every genome across seven standardized task families —
strengths and weaknesses, scored."

**[1:15 – 1:30] CTA**
"Versioned, reproducible, model-agnostic. From prompt engineering to genome engineering.
Join the free beta at genomeai.space."

**Production notes:**
- Use the staging page at `/screenshots` for clean, consistent captures (no sign-in needed).
- Subtitle the whole video for sound-off viewing.
- End card = OG image.

---

## 4. 📸 Screenshots (Editor, Playground, Compare)

> Use the **`/screenshots`** staging page in the app — it renders each view at a fixed,
> polished, auth-free state ideal for capture. Capture at **2× retina, 1440 × 900**
> window, then trim to subject.

| # | View | What to show | File |
|---|------|--------------|------|
| 1 | **Editor** | Gene sliders grouped by category + live helix + "Why this answer" panel | `editor.png` |
| 2 | **Playground** | A task, the streaming output, reasoning trace, traits, metrics | `playground.png` |
| 3 | **Compare** | Two genomes side-by-side + the comparison metrics table (★ best) | `compare.png` |
| 4 | **Benchmark** | Leaderboard + category performance bars | `benchmark.png` |
| 5 | **Library** | Genome cards grid with gene sparklines | `library.png` |

**Capture checklist per shot:**
- [ ] Clean browser (no extension icons / bookmarks bar)
- [ ] Consistent time of day / no scrollbars
- [ ] Save as PNG (lossless); create 1270×760 crops for Product Hunt.

---

## 5. 🟧 Product Hunt gallery

Product Hunt needs: **1 gallery/OG image + up to 6 product media (1270 × 760)**.

### Gallery / OG image
- **File:** `public/ph-gallery.jpg`
- **Spec:** 1270 × 760 (4:3-ish landscape). Genome AI logo, tagline, a hero DNA helix,
  and three gene sliders. Green/cream. ✅ Generated.

### Tagline & description (for the PH listing)
- **Tagline (60 chars max):** `Engineer AI behavior with Digital DNA`
- **Description:** "Genome AI replaces prompt engineering with tunable genes. Design,
  test, benchmark, and version how an AI reasons, plans, verifies, remembers, and
  communicates — structured, measurable, and reusable."

### Ordered gallery media (1270 × 760)
1. **Hero** — landing page hero with the live genome card (or `ph-gallery.jpg`)
2. **Editor** — gene sliders + live behavior readout
3. **Playground** — a generated response with reasoning trace
4. **Compare** — two genomes, side-by-side metrics
5. **Benchmark** — ranked leaderboard
6. **Gallery card** — recap collage with `genomeai.space`

### Makers / first-comment ("We're live!") template
"👋 Hey Product Hunt! We built Genome AI to settle one bet: **behavior can be engineered
with genes, not prompts.** Drag a gene and watch the AI change in real time — then
benchmark it. It's in free beta, no signup needed to try the playground. We'd love your
feedback on which genes you'd add. AMA! 🧬"

---

## 6. ✅ Pre-launch checklist

- [ ] `npm run build` passes and `dist/index.html` deploys to genomeai.space
- [ ] `og-image.jpg`, `twitter:image`, and favicon set in `index.html`
- [ ] Demo GIF exported (≤ 8 MB, loops)
- [ ] 90s video uploaded + embedded
- [ ] 5 screenshots captured from `/screenshots`
- [ ] Product Hunt gallery (1 + 6) uploaded
- [ ] README LICENSE/CONTRIBUTING/COC merged
- [ ] Socials live: x.com/genomeai, github.com/genomeai

---

<p align="center"><em>Behavior is programmable.</em></p>
