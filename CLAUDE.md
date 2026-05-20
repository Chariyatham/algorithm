# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Algorithm Academy** — a single-page Thai-language site for teaching algorithms & data structures through step-by-step animations, embedded quizzes, and a JavaScript code playground. UI strings are Thai; treat them as content, not configuration.

## Running locally

No build step. The site is served as static files. React, ReactDOM, and Babel Standalone are loaded from CDN by `index.html`, and every `.jsx` file is transformed in the browser via `<script type="text/babel">`.

```bash
python3 -m http.server 8000      # or: npx serve .
```

Then open `http://localhost:8000`. **Opening `index.html` via `file://` will not work** — the CDN scripts need an HTTP origin.

No `package.json`, no test runner, no linter. Deployment is automatic via `.github/workflows/deploy.yml` on push to `main`/`master`.

## Architecture: load order is the API

Because there is no module system, every file dumps its exports onto `window.*` and later files consume them. The load order in `index.html` IS the dependency graph — do not reorder `<script>` tags without checking what each file pulls off `window`.

Order: `curriculum.js` → `algorithms.js` → `player.jsx` → `ds-viz.jsx` → `lesson-components.jsx` → `lessons-part1..24.jsx` → `code-playground.jsx` → `app.jsx`.

Parts 14–21 are the university-level expansion: proofs/analysis, NP-completeness, network flow, advanced DP, advanced graph, advanced strings, number theory + randomized, and design problems + textbook mapping + SM-2 flashcards.

Parts 22–24 are the C++/STL deep-dive (added for beginner→mastery progression): C++ I/O + pointers + memory model + modern C++ (part 22), STL containers — vector deep, string, iterators, pair/tuple, stack/queue, deque, priority_queue (part 23), STL set/map/unordered + algorithms + lambda + bitset (part 24).

Part 25 adds the **C++ Online Compiler sandbox** (cpp-sandbox — copy code → open in Wandbox/Godbolt/OnlineGDB/Coliru, 8 templates), **Learning Paths** (1-month / 3-month / midterm / final / contest tracks with progress tracking), and **Mock Exam 5** (Thai University style — Chulalongkorn / KU / KMUTT / KMITL — proof-heavy + trace-heavy questions).

Several interactive **viz components** were added inline to specific lessons: `MemoryDiagramViz` (part 22, cpp-pointers + cpp-memory), `VectorResizeViz` and `HeapTreeViz` (part 23), `BSTInsertViz` (part 24, stl-set-map), step-trace DP table for Edit Distance (part 17), `ChainingViz` (part 8, hash-collision). Plus 10 more viz: `StackQueueDeque`, `IteratorMovement` (part 23), `BitmaskTSP`, `MatrixChain` (part 17), `SCC` (part 18), `BipartiteMatch` (part 16), `Manacher`, `AhoCorasick` (part 19), `Bitset` (part 24), `LoopInvariant` (part 14). All viz are SVG-based with step/play controls.

Part 26 — **Complete Learning Resource** — adds 10 meta-features that turn the site from a textbook into a full learning platform: `diagnostic-test` (20-question placement → suggest path), `mastery-tracker` (radar chart per topic, reads localStorage progress), `interview-prep` (FAANG + Thai company framework + 30 problems), `bug-hunt` (15 broken-code exercises with progressive hints), `case-studies` (10 real-world apps: PageRank, Netflix, GPS, etc.), `common-mistakes` (50+ anti-patterns by category), `quick-ref` (searchable algorithm complexity + snippets), `notes` (per-lesson journal with Markdown export), `video-hub` (curated external resources with search links), `capstone` (8 project ideas with full specs).

### The `window.*` contract

| Global | Producer | Consumed by |
|---|---|---|
| `CURRICULUM`, `ALL_LESSONS`, `TOTAL_LESSONS` | `curriculum.js` | `app.jsx` sidebar/home, `lessons-part*` for lesson lookup |
| `AlgorithmGenerators[key]` (`{gen, code, name, complexity}`) | `algorithms.js` | `SortLessonViz` / `SearchLessonViz` in `lesson-components.jsx` |
| `usePlayer`, `PlayerToolbar`, `CodeBlock`, `Bars`, `Cells`, `VarsPanel`, `ArrayInput` | `player.jsx` | All lesson and viz components |
| `DSVisualizers` (Stack/Queue/LinkedList/Hash/Tree/Traversal/Graph/FibDP) | `ds-viz.jsx` | `lessons-part1`, `lessons-part2` |
| `LessonComponents` (`SortLessonViz`, `SearchLessonViz`, `Quiz`, `DragOrder`) | `lesson-components.jsx` | Every lesson part |
| `LearningKit` (`WorkedExample`, `CheatSheet`, `Pitfalls`) | `lessons-part6.jsx` | `lessons-part7`, `8`, `11` |
| `LessonsPart1..LessonsPart13` (map `id` → component) | each `lessons-partN.jsx` | `app.jsx` lesson router |
| `PROBLEMS` | `code-playground.jsx` | `app.jsx` sidebar count + problem router |
| `NotesPanel` | `lessons-part9.jsx` (later wrapped in `lessons-part12.jsx`) | `app.jsx` floating panel |
| `claude.complete(...)` | **claude.ai artifact runtime only** | AI features (see below) |

### Lesson routing

`app.jsx` resolves a `lessonId` by chaining `window.LessonsPart1[id] || window.LessonsPart2[id] || ...` through all 13 parts (see ~line 309 in `app.jsx`). When adding a new lesson:

1. Add metadata to `CURRICULUM` in `curriculum.js` (the `id` field is the lookup key).
2. Define `Lessons[id] = function() { ... }` in one of the `lessons-part*.jsx` files.
3. Ensure that file ends with `window.LessonsPartN = Lessons;` (each part file uses its own local `Lessons` variable, sometimes aliased — `Lessons2`, `Lessons3`, etc.).
4. If `app.jsx`'s lookup chain doesn't already include your part number, add it there.

### Animation framework

`usePlayer(framesFactory, deps)` in `player.jsx` is the engine. Algorithm generators in `algorithms.js` return an array of **frames**: `{ line, arr, marks, vars, ... }`. `line` highlights pseudocode in `<CodeBlock>`; `marks` is `{ index: 'compare'|'swap'|'sorted'|'pivot'|'cursor'|'dim' }` for `<Bars>`/`<Cells>`. When adding a new algorithm, register it in the `window.AlgorithmGenerators = { ... }` block at the bottom of `algorithms.js`.

### AI features are runtime-gated

Anywhere that calls `window.claude.complete(...)` first checks `typeof window.claude?.complete === 'function'` and renders `null` / hides UI if absent. This is what lets the site work both on claude.ai (AI on, Anthropic-funded) and on GitHub Pages (AI components hidden, rest of site intact). Preserve this gate when touching `lessons-part12.jsx` (`AskAI`), `lessons-part11.jsx`, and `lessons-part9.jsx`.

### Persistence

Progress lives in `localStorage` only. Keys: `algo-academy-progress-v1`, `algo-academy-streak-v1`, `algo-academy-playground-v1`, `algo-academy-solved-v1`. Bump the `-v1` suffix if you make breaking shape changes — `app.jsx` does not migrate.

## Conventions worth knowing

- React hooks are pulled off the global `React` object with **aliased names per file** (e.g. `useStateLC`, `useS12`, `useSP`) to avoid redeclaration collisions across script-tag-loaded files that share the global scope. Follow this pattern in new files.
- Pseudocode in `algorithms.js` is written as a `const xxxCode = [ "line 1", "line 2", ... ]` array; the `line` index in each frame must match.
- `scraps/` and `uploads/` contain legacy/standalone HTML experiments and assets — they are not loaded by `index.html` and shouldn't be referenced from runtime code.
