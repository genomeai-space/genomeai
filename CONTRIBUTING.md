# Contributing to Genome AI

Thanks for your interest in Genome AI! 🧬 This project exists to prove one idea:
**AI behavior can be engineered through Digital DNA rather than prompt engineering.**

We welcome contributions that reinforce that vision — structured, measurable, reusable
behavior.

## 🧭 Ways to contribute

- 🐛 **Report bugs** — something broken or unexpected? Open a
  [bug report](https://github.com/genomeai/genomeai/issues/new?template=bug_report.md).
- ✨ **Suggest features** — have an idea for a new gene, view, or metric? Open a
  [feature request](https://github.com/genomeai/genomeai/issues/new?template=feature_request.md).
- 🎨 **Improve the UI** — polish, accessibility, responsive fixes.
- 🧠 **Tune the engine** — better phrase banks, smarter metrics, more accurate benchmarks.
- 📝 **Docs & examples** — clarify the Genome Standard, write guides.

## 🚀 Getting started

```bash
git clone https://github.com/genomeai/genomeai.git
cd genomeai
npm install
npm run dev
```

Open the printed local URL. No env vars or API keys are required — the behavior and
benchmark engines are fully simulated and deterministic.

## 🔄 Pull request workflow

1. **Fork** the repo and create a branch:
   `git checkout -b feat/your-feature`
2. **Make your changes.** Keep them focused — one concern per PR.
3. **Build to verify:**
   ```bash
   npm run build
   ```
4. **Commit** using clear messages (e.g. `feat(editor): add gene presets`).
5. **Open a pull request** and fill in the template.

## 🧬 Project conventions

- **Design language:** green/cream bio-tech palette (`forest`, `moss`, `leaf`,
  `mint`, `cream`). DNA helix motif. See `src/index.css` for theme tokens.
- **No prompts to define behavior** — every behavior comes from genes. New behaviors
  should map to tunable genes, not hard-coded strings.
- **Determinism first** — outputs must be reproducible for a given (prompt + genome).
- **Components:** UI primitives live in `src/components/ui`, landing sections in
  `src/components/landing`, workspace views in `src/components/dashboard`.
- **State:** single store in `src/lib/store.tsx` with `localStorage` persistence.

## ✅ Code style

- TypeScript everywhere; avoid `any`.
- Use the `cn()` helper (`src/utils/cn`) for conditional classes.
- Keep components small and composable.

## 💬 Questions?

Open a [discussion](https://github.com/genomeai/genomeai/discussions) or email
[contact@genomeai.space](mailto:contact@genomeai.space).

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
