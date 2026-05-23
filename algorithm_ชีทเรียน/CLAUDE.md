# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository nature

This is **coursework for an algorithms class**, not an application. It is a flat collection of:

- Lecture/assignment/homework PDFs at the repo root (Big O, recursion, sort/search, divide & conquer, DP, greedy, backtracking, exhaustive search, graphs). Some filenames are in Thai.
- Small standalone C++ programs grouped by lab/week in subdirectories. There is no shared library, no build system file (no `Makefile`, `CMakeLists.txt`, `package.json`), no tests, and no README.

Each `.cpp` file is self-contained with its own `main()`. Programs are interactive — they read input from `stdin` (often after printing prompts like `"enter N: "`) and print results to `stdout`. There is no inter-file dependency to track.

## Layout

- `lab/` — backtracking exercises: permutations (`p_fo_n.cpp`), seating arrangement (`seating.cpp`), subset-sum (`w2.cpp`), n-queens variant using diagonal check (`w3.cpp`), 0/1 knapsack via subset enumeration (`w4.cpp`).
- `labSortLab2/` — divide & conquer sorting: `merge_sort.cpp`, `quick_sort.cpp`, plus a sorting-based longest-consecutive exercise (`lab2_q4.cpp`). The sort files print intermediate split/merge/partition state for didactic tracing — preserve this output when editing.
- `labWeak2/` — intro recursion: `findMax.cpp`, `findSum.cpp`.
- `tranning/` — short practice snippets (`1.cpp`, `2.cpp`).
- `recursive_multiplication.txt` — a C (not C++) reference implementation of recursive Strassen-style matrix multiply, despite the `.txt` extension.

## Building and running

There is no project-level build. Compile and run a single file directly:

```bash
g++ -std=c++17 -Wall path/to/file.cpp -o /tmp/a.out && /tmp/a.out
```

Most programs read from stdin, so pipe input or type interactively.

The `lab/`, `labSortLab2/`, and `tranning/` folders are configured for the **VS Code C/C++ Runner** extension (see `.vscode/settings.json`, `launch.json`, `c_cpp_properties.json`):

- Compilers: `gcc` / `g++`, debugger `gdb`.
- Build output goes to `build/Debug/outDebug` within each lab folder.
- Strict warnings are enabled (`-Wall -Wextra -Wpedantic -Wshadow -Wconversion -Wsign-conversion …`). Code in the repo currently triggers some of these (e.g., signed/unsigned comparison in `lab/seating.cpp:12`); if you fix one, do not silently rewrite unrelated code in the same file.
- The `launch.json` files contain hard-coded absolute paths under `/home/kim/Downloads/ปี 3T2/algorithm/...` (Thai path component) that do not match the current repo location at `/home/kim/Downloads/algorithm/`. Debug-launch via VS Code will not work without updating these; running the binary directly does work.

## Code conventions used here

These are observations, not rules to enforce — match the surrounding file's style when editing it:

- `using namespace std;` is used throughout. Globals (`n`, `target`, `vector<int> A`, etc.) are common; recursive helpers mutate them rather than passing parameters.
- 1-indexed arrays appear in several backtracking files (`x[1..n]` with `A[i-1]`), mirroring the lecture-slide pseudocode. Do not "fix" this to 0-indexing — it makes the code stop matching the assignment.
- Thai-language comments appear inline (e.g., `// เรียงงง`, `//ระวังห้ามเป็น int เดะมันตัดเศษ`). Leave them as-is.
- Tracing `cout` statements inside sort/partition/merge are intentional teaching output, not debug leftovers.
