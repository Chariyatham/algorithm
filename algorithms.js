/* Algorithm step generators — produce frames for the Player */
/* Each generator returns array of frames: { line, vars, marks, ...specifics } */

// ============ Bubble Sort ============
function genBubbleSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  const sorted = new Set();
  frames.push({ line: 0, arr: [...a], marks: {}, vars: { i: '-', j: '-', swaps: 0, comparisons: 0 } });
  let swaps = 0, comparisons = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const marks = {};
      [...sorted].forEach(k => marks[k] = 'sorted');
      marks[j] = 'compare'; marks[j + 1] = 'compare';
      comparisons++;
      frames.push({ line: 4, arr: [...a], marks, vars: { i, j, swaps, comparisons } });
      if (a[j] > a[j + 1]) {
        const ms = {};
        [...sorted].forEach(k => ms[k] = 'sorted');
        ms[j] = 'swap'; ms[j + 1] = 'swap';
        frames.push({ line: 5, arr: [...a], marks: ms, vars: { i, j, swaps, comparisons } });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        const ms2 = {};
        [...sorted].forEach(k => ms2[k] = 'sorted');
        ms2[j] = 'swap'; ms2[j + 1] = 'swap';
        frames.push({ line: 5, arr: [...a], marks: ms2, vars: { i, j, swaps, comparisons } });
      }
    }
    sorted.add(n - 1 - i);
  }
  sorted.add(0);
  const fm = {}; [...sorted].forEach(k => fm[k] = 'sorted');
  frames.push({ line: 9, arr: [...a], marks: fm, vars: { i: '-', j: '-', swaps, comparisons } });
  return frames;
}
const bubbleCode = [
  "void bubbleSort(vector<int>& a) {",                              // 0
  "  int n = a.size();",                                            // 1
  "  for (int i = 0; i < n - 1; i++) {",                            // 2
  "    for (int j = 0; j < n - i - 1; j++) {",                      // 3
  "      if (a[j] > a[j + 1]) {",                                   // 4
  "        swap(a[j], a[j + 1]);",                                  // 5
  "      }",                                                        // 6
  "    }",                                                          // 7
  "  }",                                                            // 8
  "}",                                                              // 9
];

// ============ Selection Sort ============
function genSelectionSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const baseMarks = {};
    for (let k = 0; k < i; k++) baseMarks[k] = 'sorted';
    baseMarks[minIdx] = 'cursor';
    frames.push({ line: 3, arr: [...a], marks: { ...baseMarks }, vars: { i, j: '-', minIdx, comparisons, swaps } });
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const m = { ...baseMarks };
      m[minIdx] = 'cursor'; m[j] = 'compare';
      frames.push({ line: 5, arr: [...a], marks: m, vars: { i, j, minIdx, comparisons, swaps } });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        baseMarks[i] = 'cursor';
        const m2 = { ...baseMarks }; m2[minIdx] = 'cursor';
        frames.push({ line: 6, arr: [...a], marks: m2, vars: { i, j, minIdx, comparisons, swaps } });
      }
    }
    if (minIdx !== i) {
      const ms = {};
      for (let k = 0; k < i; k++) ms[k] = 'sorted';
      ms[i] = 'swap'; ms[minIdx] = 'swap';
      frames.push({ line: 8, arr: [...a], marks: ms, vars: { i, minIdx, comparisons, swaps } });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      const ms2 = { ...ms };
      frames.push({ line: 8, arr: [...a], marks: ms2, vars: { i, minIdx, comparisons, swaps } });
    }
  }
  const fm = {}; for (let k = 0; k < n; k++) fm[k] = 'sorted';
  frames.push({ line: 10, arr: [...a], marks: fm, vars: { comparisons, swaps } });
  return frames;
}
const selectionCode = [
  "void selectionSort(vector<int>& a) {",                           // 0
  "  int n = a.size();",                                            // 1
  "  for (int i = 0; i < n - 1; i++) {",                            // 2
  "    int minIdx = i;",                                            // 3
  "    for (int j = i + 1; j < n; j++) {",                          // 4
  "      if (a[j] < a[minIdx])",                                    // 5
  "        minIdx = j;",                                            // 6
  "    }",                                                          // 7
  "    swap(a[i], a[minIdx]);",                                     // 8
  "  }",                                                            // 9
  "}",                                                              // 10
];

// ============ Insertion Sort ============
function genInsertionSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  let shifts = 0, comparisons = 0;
  frames.push({ line: 0, arr: [...a], marks: { 0: 'sorted' }, vars: { i: 0, j: '-', key: a[0], comparisons, shifts } });
  for (let i = 1; i < n; i++) {
    const key = a[i];
    const sortedRange = {};
    for (let k = 0; k < i; k++) sortedRange[k] = 'sorted';
    sortedRange[i] = 'cursor';
    frames.push({ line: 3, arr: [...a], marks: { ...sortedRange }, vars: { i, j: '-', key, comparisons, shifts } });
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      comparisons++;
      const m = { ...sortedRange }; m[j] = 'compare'; m[j + 1] = 'swap';
      frames.push({ line: 6, arr: [...a], marks: m, vars: { i, j, key, comparisons, shifts } });
      a[j + 1] = a[j];
      shifts++;
      j--;
    }
    a[j + 1] = key;
    const fm = {};
    for (let k = 0; k <= i; k++) fm[k] = 'sorted';
    frames.push({ line: 9, arr: [...a], marks: fm, vars: { i, j: j + 1, key, comparisons, shifts } });
  }
  return frames;
}
const insertionCode = [
  "void insertionSort(vector<int>& a) {",                           // 0
  "  int n = a.size();",                                            // 1
  "  for (int i = 1; i < n; i++) {",                                // 2
  "    int key = a[i];",                                            // 3
  "    int j = i - 1;",                                             // 4
  "    while (j >= 0 && a[j] > key) {",                             // 5
  "      a[j + 1] = a[j];",                                         // 6
  "      j--;                                                              ", // 7
  "    }",                                                          // 8
  "    a[j + 1] = key;",                                            // 9
  "  }",                                                            // 10
  "}",                                                              // 11
];

// ============ Shell Sort ============
// Default sequence: Shell's original (n/2, n/4, ..., 1) — what the KMUTNB sheet calls "Knuth's"
function genShellSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  let comparisons = 0, shifts = 0;
  const gaps = [];
  for (let g = Math.floor(n / 2); g >= 1; g = Math.floor(g / 2)) gaps.push(g);
  frames.push({ line: 0, arr: [...a], marks: {}, vars: { n, gaps: gaps.join(','), comparisons, shifts } });
  for (const gap of gaps) {
    // Highlight all elements that belong to the same group (one color = one group)
    // We use 'pivot' to mark the "anchor" of each group at start of pass
    const groupMarks = {};
    for (let s = 0; s < gap; s++) groupMarks[s] = 'pivot';
    frames.push({ line: 2, arr: [...a], marks: groupMarks, vars: { gap, msg: `เริ่ม gap = ${gap}`, comparisons, shifts } });
    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j = i;
      const mStart = {};
      mStart[i] = 'cursor';
      if (i - gap >= 0) mStart[i - gap] = 'compare';
      frames.push({ line: 3, arr: [...a], marks: mStart, vars: { gap, i, key: temp, comparisons, shifts } });
      while (j >= gap && a[j - gap] > temp) {
        comparisons++;
        const m = {};
        m[j] = 'swap';
        m[j - gap] = 'swap';
        a[j] = a[j - gap];
        shifts++;
        frames.push({ line: 7, arr: [...a], marks: m, vars: { gap, i, j, jPrev: j - gap, key: temp, comparisons, shifts } });
        j -= gap;
      }
      a[j] = temp;
      const mPlace = {};
      mPlace[j] = 'sorted';
      frames.push({ line: 10, arr: [...a], marks: mPlace, vars: { gap, i, j, key: temp, comparisons, shifts } });
    }
    frames.push({ line: 11, arr: [...a], marks: {}, vars: { gap, msg: `จบรอบ gap = ${gap}`, comparisons, shifts } });
  }
  const fm = {}; for (let k = 0; k < n; k++) fm[k] = 'sorted';
  frames.push({ line: 12, arr: [...a], marks: fm, vars: { comparisons, shifts } });
  return frames;
}
const shellCode = [
  "void shellSort(vector<int>& a) {",                               // 0
  "  int n = a.size();",                                            // 1
  "  for (int gap = n/2; gap > 0; gap /= 2) {",                     // 2
  "    for (int i = gap; i < n; i++) {",                            // 3
  "      int temp = a[i];",                                         // 4
  "      int j = i;",                                               // 5
  "      while (j >= gap && a[j-gap] > temp) {",                    // 6
  "        a[j] = a[j - gap];",                                     // 7
  "        j -= gap;",                                              // 8
  "      }",                                                        // 9
  "      a[j] = temp;",                                             // 10
  "    }",                                                          // 11
  "  }  // gap loop",                                               // 12
  "}",                                                              // 13
];

// ============ Merge Sort ============
// Steps through EVERY line of merge() (lines 0-8) and mergeSort() (9-15)
// — ไม่ใช่แค่กระโดดบรรทัด 5 ครั้งเดียวเหมือนเดิม
function genMergeSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  const fmt = (arr) => '[' + arr.join(',') + ']';
  const push = (line, vars, markFn) => {
    frames.push({ line, arr: [...a], marks: markFn ? markFn() : {}, vars });
  };
  function rec(l, r, depth = 0) {
    push(9, { call: `mergeSort(l=${l}, r=${r})`, depth }, () => {
      const m = {}; for (let x = l; x <= r; x++) m[x] = 'compare'; return m;
    });
    push(10, { l, r, depth, check: `l>=r? ${l >= r}` });
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    push(11, { l, r, mid, depth }, () => {
      const m = {}; for (let x = l; x <= r; x++) m[x] = 'dim'; m[mid] = 'pivot'; return m;
    });
    push(12, { l, mid, recurse: 'left' });
    rec(l, mid, depth + 1);
    push(13, { mid: mid + 1, r, recurse: 'right' });
    rec(mid + 1, r, depth + 1);
    push(14, { l, mid, r, action: 'call merge()' }, () => {
      const m = {}; for (let x = l; x <= mid; x++) m[x] = 'compare';
      for (let x = mid + 1; x <= r; x++) m[x] = 'pivot'; return m;
    });

    // ----- enter merge() — step through every body line -----
    push(0, { l, mid, r, action: 'enter merge()' }, () => {
      const m = {}; for (let x = l; x <= mid; x++) m[x] = 'compare';
      for (let x = mid + 1; x <= r; x++) m[x] = 'pivot'; return m;
    });
    const left = a.slice(l, mid + 1);
    push(1, { 'left[]': fmt(left), 'left.size': left.length }, () => {
      const m = {}; for (let x = l; x <= mid; x++) m[x] = 'compare';
      for (let x = mid + 1; x <= r; x++) m[x] = 'dim'; return m;
    });
    const right = a.slice(mid + 1, r + 1);
    push(2, { 'left[]': fmt(left), 'right[]': fmt(right), 'right.size': right.length }, () => {
      const m = {}; for (let x = l; x <= mid; x++) m[x] = 'dim';
      for (let x = mid + 1; x <= r; x++) m[x] = 'pivot'; return m;
    });
    let i = 0, j = 0, k = l;
    push(3, { i, j, k, 'left[]': fmt(left), 'right[]': fmt(right) }, () => {
      const m = {}; for (let x = l; x <= r; x++) m[x] = 'dim'; m[k] = 'cursor'; return m;
    });
    while (i < left.length && j < right.length) {
      push(4, { i, j, k, 'left[i]': left[i], 'right[j]': right[j], check: `i<${left.length} && j<${right.length}? true` }, () => {
        const m = {}; for (let x = l; x <= r; x++) m[x] = 'dim';
        for (let x = l; x < k; x++) m[x] = 'sorted'; m[k] = 'cursor'; return m;
      });
      const winner = left[i] <= right[j];
      push(5, { i, j, k, 'left[i]': left[i], 'right[j]': right[j], choose: winner ? `left[${i}]=${left[i]} ≤ right[${j}]=${right[j]} → ใช้ left` : `left[${i}]=${left[i]} > right[${j}]=${right[j]} → ใช้ right`, 'a[k]': winner ? left[i] : right[j] }, () => {
        const m = {}; for (let x = l; x <= r; x++) m[x] = 'dim';
        for (let x = l; x < k; x++) m[x] = 'sorted'; m[k] = 'swap'; return m;
      });
      if (winner) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; }
    }
    push(4, { i, j, k, check: `i<${left.length} && j<${right.length}? false → ออก loop` });
    while (i < left.length) {
      push(6, { i, k, 'left[i]': left[i], drain: 'ก๊อปที่เหลือจาก left' }, () => {
        const m = {}; for (let x = l; x <= r; x++) m[x] = 'dim';
        for (let x = l; x < k; x++) m[x] = 'sorted'; m[k] = 'swap'; return m;
      });
      a[k++] = left[i++];
    }
    while (j < right.length) {
      push(7, { j, k, 'right[j]': right[j], drain: 'ก๊อปที่เหลือจาก right' }, () => {
        const m = {}; for (let x = l; x <= r; x++) m[x] = 'dim';
        for (let x = l; x < k; x++) m[x] = 'sorted'; m[k] = 'swap'; return m;
      });
      a[k++] = right[j++];
    }
    push(8, { l, mid, r, depth, done: 'merge() เสร็จ → [' + a.slice(l, r + 1).join(',') + ']' }, () => {
      const m = {}; for (let x = l; x <= r; x++) m[x] = 'sorted'; return m;
    });
  }
  push(9, { call: `mergeSort(l=0, r=${n - 1})`, depth: 0, action: 'top-level' });
  rec(0, n - 1);
  push(15, { done: true }, () => {
    const m = {}; for (let i = 0; i < n; i++) m[i] = 'sorted'; return m;
  });
  return frames;
}
const mergeCode = [
  "void merge(vector<int>& a, int l, int mid, int r) {",            // 0
  "  vector<int> left(a.begin()+l, a.begin()+mid+1);",              // 1
  "  vector<int> right(a.begin()+mid+1, a.begin()+r+1);",           // 2
  "  int i = 0, j = 0, k = l;",                                     // 3
  "  while (i < left.size() && j < right.size())",                  // 4
  "    a[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];",   // 5
  "  while (i < left.size()) a[k++] = left[i++];",                  // 6
  "  while (j < right.size()) a[k++] = right[j++];",                // 7
  "}",                                                              // 8
  "void mergeSort(vector<int>& a, int l, int r) {",                 // 9
  "  if (l >= r) return;",                                          // 10
  "  int mid = (l + r) / 2;",                                       // 11
  "  mergeSort(a, l, mid);",                                        // 12
  "  mergeSort(a, mid + 1, r);",                                    // 13
  "  merge(a, l, mid, r);",                                         // 14
  "}",                                                              // 15
];

// ============ Quick Sort (Lomuto) ============
// Steps through EVERY line of partition() (0-11) and quickSort() (12-18)
function genQuickSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  let comparisons = 0, swaps = 0;
  const push = (line, vars, markFn) => {
    frames.push({ line, arr: [...a], marks: markFn ? markFn() : {}, vars });
  };
  function partition(lo, hi) {
    push(0, { call: `partition(lo=${lo}, hi=${hi})` }, () => {
      const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'compare'; return m;
    });
    const pivot = a[hi];
    push(1, { lo, hi, pivot: `a[${hi}] = ${pivot}` }, () => {
      const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim'; m[hi] = 'pivot'; return m;
    });
    let i = lo - 1;
    push(2, { lo, hi, pivot, i, note: 'i = lo-1 (left-side boundary)' }, () => {
      const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim'; m[hi] = 'pivot'; return m;
    });
    for (let j = lo; j < hi; j++) {
      push(3, { i, j, pivot, check: `j<${hi}? ${j < hi}` }, () => {
        const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim';
        m[hi] = 'pivot'; m[j] = 'cursor'; if (i >= lo) m[i] = 'compare';
        return m;
      });
      comparisons++;
      push(4, { i, j, 'a[j]': a[j], pivot, check: `${a[j]} <= ${pivot}? ${a[j] <= pivot}`, comparisons }, () => {
        const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim';
        m[hi] = 'pivot'; m[j] = 'compare'; if (i >= lo) m[i] = 'cursor';
        return m;
      });
      if (a[j] <= pivot) {
        i++;
        push(5, { i, j, note: 'i++ — ขยายพื้นที่ ≤ pivot' }, () => {
          const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim';
          m[hi] = 'pivot'; m[i] = 'cursor'; m[j] = 'compare'; return m;
        });
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;
          push(6, { i, j, swap: `swap(a[${i}], a[${j}])`, swaps }, () => {
            const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim';
            m[hi] = 'pivot'; m[i] = 'swap'; m[j] = 'swap'; return m;
          });
        } else {
          push(6, { i, j, note: 'i == j → swap ตัวเอง (ข้าม)' }, () => {
            const m = {}; for (let x = lo; x <= hi; x++) m[x] = 'dim';
            m[hi] = 'pivot'; m[i] = 'cursor'; return m;
          });
        }
      }
    }
    push(8, { note: 'จบ for loop' });
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    swaps++;
    push(9, { swap: `swap(a[${i + 1}], a[${hi}])`, note: 'วาง pivot ที่ตำแหน่งสุดท้าย', swaps }, () => {
      const m = {}; m[i + 1] = 'swap'; m[hi] = 'swap'; return m;
    });
    push(10, { return: i + 1, note: `pivot อยู่ที่ index ${i + 1}` }, () => {
      const m = {}; m[i + 1] = 'sorted'; return m;
    });
    return i + 1;
  }
  function qs(lo, hi) {
    push(12, { call: `quickSort(lo=${lo}, hi=${hi})` });
    push(13, { lo, hi, check: `lo<hi? ${lo < hi}` });
    if (lo < hi) {
      push(14, { lo, hi, action: 'call partition()' });
      const p = partition(lo, hi);
      push(15, { recurse: 'left', range: `[${lo}..${p - 1}]` });
      qs(lo, p - 1);
      push(16, { recurse: 'right', range: `[${p + 1}..${hi}]` });
      qs(p + 1, hi);
    }
  }
  push(12, { call: `quickSort(lo=0, hi=${n - 1})`, action: 'top-level' });
  qs(0, n - 1);
  push(18, { done: true, comparisons, swaps }, () => {
    const m = {}; for (let i = 0; i < n; i++) m[i] = 'sorted'; return m;
  });
  return frames;
}
const quickCode = [
  "int partition(vector<int>& a, int lo, int hi) {",                // 0
  "  int pivot = a[hi];",                                           // 1
  "  int i = lo - 1;",                                              // 2
  "  for (int j = lo; j < hi; j++) {",                              // 3
  "    if (a[j] <= pivot) {",                                       // 4
  "      i++;",                                                     // 5
  "      swap(a[i], a[j]);",                                        // 6
  "    }",                                                          // 7
  "  }",                                                            // 8
  "  swap(a[i + 1], a[hi]);",                                       // 9
  "  return i + 1;",                                                // 10
  "}",                                                              // 11
  "void quickSort(vector<int>& a, int lo, int hi) {",               // 12
  "  if (lo < hi) {",                                               // 13
  "    int p = partition(a, lo, hi);",                              // 14
  "    quickSort(a, lo, p - 1);",                                   // 15
  "    quickSort(a, p + 1, hi);",                                   // 16
  "  }",                                                            // 17
  "}",                                                              // 18
];

// ============ Heap Sort ============
// Steps through EVERY line of heapify() (0-9) and heapSort() (10-17)
function genHeapSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  const push = (line, vars, markFn) => {
    frames.push({ line, arr: [...a], marks: markFn ? markFn() : {}, vars });
  };
  const sortedSet = new Set();
  const dimSorted = (m) => { [...sortedSet].forEach(k => m[k] = 'sorted'); return m; };

  function heapify(size, i) {
    push(0, { call: `heapify(n=${size}, i=${i})`, 'a[i]': a[i] }, () => {
      const m = dimSorted({}); m[i] = 'cursor'; return m;
    });
    let largest = i;
    push(1, { largest, note: 'สมมุติ root เป็นตัวมากสุดก่อน' }, () => {
      const m = dimSorted({}); m[largest] = 'cursor'; return m;
    });
    const l = 2 * i + 1, r = 2 * i + 2;
    push(2, { i, l, r, 'a[l]': l < size ? a[l] : '—', 'a[r]': r < size ? a[r] : '—' }, () => {
      const m = dimSorted({}); m[i] = 'cursor';
      if (l < size) m[l] = 'compare'; if (r < size) m[r] = 'compare'; return m;
    });
    push(3, { l, size, check: l < size ? `a[${l}]=${a[l]} > a[${largest}]=${a[largest]}? ${a[l] > a[largest]}` : 'l ≥ size — ไม่มี left child' }, () => {
      const m = dimSorted({}); m[largest] = 'cursor'; if (l < size) m[l] = 'compare'; return m;
    });
    if (l < size && a[l] > a[largest]) largest = l;
    push(4, { r, size, check: r < size ? `a[${r}]=${a[r]} > a[${largest}]=${a[largest]}? ${a[r] > a[largest]}` : 'r ≥ size — ไม่มี right child' }, () => {
      const m = dimSorted({}); m[largest] = 'cursor'; if (r < size) m[r] = 'compare'; return m;
    });
    if (r < size && a[r] > a[largest]) largest = r;
    push(5, { largest, i, check: `largest != i? ${largest !== i}` }, () => {
      const m = dimSorted({}); m[i] = 'cursor'; m[largest] = 'compare'; return m;
    });
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      push(6, { swap: `swap(a[${i}], a[${largest}])` }, () => {
        const m = dimSorted({}); m[i] = 'swap'; m[largest] = 'swap'; return m;
      });
      push(7, { 'recurse on': largest, note: 'sift-down ต่อจาก largest' }, () => {
        const m = dimSorted({}); m[largest] = 'cursor'; return m;
      });
      heapify(size, largest);
    }
    push(9, { return: 'heapify เสร็จ', i });
  }

  push(10, { call: 'heapSort(a)', action: 'top-level' });
  push(11, { n });
  push(12, { build: 'build max-heap จาก bottom-up' });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  push(13, { phase: 'extract phase — swap root → re-heapify' });
  for (let i = n - 1; i > 0; i--) {
    push(13, { i, check: `i>0? ${i > 0}` }, () => dimSorted({ [0]: 'pivot' }));
    [a[0], a[i]] = [a[i], a[0]];
    sortedSet.add(i);
    push(14, { swap: `swap(a[0]=root, a[${i}])`, note: 'root ใหญ่สุดถูกย้ายไปท้าย → sorted' }, () => {
      const m = dimSorted({}); m[0] = 'cursor'; return m;
    });
    push(15, { 'reheapify size': i }, () => {
      const m = dimSorted({}); m[0] = 'cursor'; return m;
    });
    heapify(i, 0);
  }
  sortedSet.add(0);
  push(17, { done: true }, () => {
    const m = {}; for (let k = 0; k < n; k++) m[k] = 'sorted'; return m;
  });
  return frames;
}
const heapCode = [
  "void heapify(vector<int>& a, int n, int i) {",                   // 0
  "  int largest = i;",                                             // 1
  "  int l = 2*i + 1, r = 2*i + 2;",                                // 2
  "  if (l < n && a[l] > a[largest]) largest = l;",                 // 3
  "  if (r < n && a[r] > a[largest]) largest = r;",                 // 4
  "  if (largest != i) {",                                          // 5
  "    swap(a[i], a[largest]);",                                    // 6
  "    heapify(a, n, largest);",                                    // 7
  "  }",                                                            // 8
  "}",                                                              // 9
  "void heapSort(vector<int>& a) {",                                // 10
  "  int n = a.size();",                                            // 11
  "  for (int i = n/2 - 1; i >= 0; i--) heapify(a, n, i);",         // 12
  "  for (int i = n - 1; i > 0; i--) {",                            // 13
  "    swap(a[0], a[i]);",                                          // 14
  "    heapify(a, i, 0);",                                          // 15
  "  }",                                                            // 16
  "}",                                                              // 17
];

// ============ Linear Search ============
function genLinearSearch(arr, target) {
  const frames = [];
  frames.push({ line: 0, arr: [...arr], marks: {}, vars: { target, i: '-' } });
  for (let i = 0; i < arr.length; i++) {
    const m = {};
    for (let k = 0; k < i; k++) m[k] = 'miss';
    m[i] = 'cursor';
    frames.push({ line: 3, arr: [...arr], marks: m, vars: { target, i, 'a[i]': arr[i] } });
    if (arr[i] === target) {
      const f = { ...m }; f[i] = 'found';
      frames.push({ line: 4, arr: [...arr], marks: f, vars: { target, i, found: true } });
      return frames;
    }
  }
  const m = {}; for (let k = 0; k < arr.length; k++) m[k] = 'miss';
  frames.push({ line: 6, arr: [...arr], marks: m, vars: { target, found: false } });
  return frames;
}
const linearCode = [
  "int linearSearch(const vector<int>& a, int x) {",                // 0
  "  int n = a.size();",                                            // 1
  "  for (int i = 0; i < n; i++) {",                                // 2
  "    if (a[i] == x)",                                             // 3
  "      return i;",                                                // 4
  "  }",                                                            // 5
  "  return -1;",                                                   // 6
  "}",                                                              // 7
];

// ============ Binary Search ============
function genBinarySearch(arr, target) {
  // arr should be sorted
  const sorted = [...arr].sort((a, b) => a - b);
  const frames = [];
  let lo = 0, hi = sorted.length - 1;
  frames.push({ line: 0, arr: sorted, marks: {}, labels: { 0: 'lo', [hi]: 'hi' }, vars: { target, lo, hi } });
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const m = {};
    for (let k = 0; k < lo; k++) m[k] = 'miss';
    for (let k = hi + 1; k < sorted.length; k++) m[k] = 'miss';
    m[lo] = 'lo'; m[hi] = 'hi'; m[mid] = 'mid';
    frames.push({ line: 3, arr: sorted, marks: m, labels: { [lo]: 'lo', [hi]: 'hi', [mid]: 'mid' }, vars: { target, lo, hi, mid, 'a[mid]': sorted[mid] } });
    if (sorted[mid] === target) {
      const f = { ...m }; f[mid] = 'found';
      frames.push({ line: 4, arr: sorted, marks: f, labels: { [mid]: 'found!' }, vars: { target, mid, found: true } });
      return frames;
    } else if (sorted[mid] < target) {
      lo = mid + 1;
      frames.push({ line: 6, arr: sorted, marks: m, labels: { [mid]: 'too small' }, vars: { target, lo, hi } });
    } else {
      hi = mid - 1;
      frames.push({ line: 8, arr: sorted, marks: m, labels: { [mid]: 'too large' }, vars: { target, lo, hi } });
    }
  }
  const m = {}; for (let k = 0; k < sorted.length; k++) m[k] = 'miss';
  frames.push({ line: 11, arr: sorted, marks: m, vars: { target, found: false } });
  return frames;
}
const binaryCode = [
  "int binarySearch(const vector<int>& a, int x) {",                // 0
  "  int lo = 0, hi = a.size() - 1;",                               // 1
  "  while (lo <= hi) {",                                           // 2
  "    int mid = lo + (hi - lo) / 2;",                              // 3
  "    if (a[mid] == x)",                                           // 4
  "      return mid;",                                              // 5
  "    else if (a[mid] < x)",                                       // 6
  "      lo = mid + 1;",                                            // 7
  "    else",                                                       // 8
  "      hi = mid - 1;",                                            // 9
  "  }",                                                            // 10
  "  return -1;",                                                   // 11
  "}",                                                              // 12
];

// ============ Short versions (helper hidden as function call) ============

// Merge sort — full code is mergeCode (16 lines). Short = main mergeSort + merge() เป็น 1 บรรทัด
const mergeCodeShort = [
  "void mergeSort(vector<int>& a, int l, int r) {",                 // 0
  "  if (l >= r) return;",                                          // 1
  "  int mid = (l + r) / 2;",                                       // 2
  "  mergeSort(a, l, mid);                  // recurse left",       // 3
  "  mergeSort(a, mid + 1, r);              // recurse right",      // 4
  "  merge(a, l, mid, r);                   // merge two halves",   // 5
  "}",                                                              // 6
];
// map full line → short line (frames ใช้ line ของ full)
// full: 0-8 = merge() body, 9-15 = mergeSort() body
// short: 0=void mergeSort, 1=if l>=r, 2=mid, 3=recurse left, 4=recurse right, 5=merge call, 6=}
const mergeLineMap = {
  // merge() body — ทั้งหมด collapse → "merge(...)" call ใน short
  0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5,
  // mergeSort() body — map 1:1
  9: 0,   // void mergeSort
  10: 1,  // if (l >= r) return
  11: 2,  // int mid
  12: 3,  // mergeSort(a, l, mid)
  13: 4,  // mergeSort(a, mid+1, r)
  14: 5,  // merge(a, l, mid, r)
  15: 6,  // }
};

// Quick sort — full code is quickCode (19 lines). Short = main quickSort + partition() as 1 call
const quickCodeShort = [
  "void quickSort(vector<int>& a, int lo, int hi) {",               // 0
  "  if (lo < hi) {",                                               // 1
  "    int p = partition(a, lo, hi);    // ← partition + return pivot pos", // 2
  "    quickSort(a, lo, p - 1);         // recurse left",           // 3
  "    quickSort(a, p + 1, hi);         // recurse right",           // 4
  "  }",                                                            // 5
  "}",                                                              // 6
];
// full lines: 0-11 = partition() body, 12-18 = quickSort() body
// short: 0=quickSort sig, 1=if lo<hi, 2=p=partition(), 3=recurse left, 4=recurse right, 5=}, 6=}
const quickLineMap = {
  // partition() body — ทั้งหมด collapse → "partition()" call (line 2) ใน short
  0: 2, 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2,
  // quickSort() body — map 1:1
  12: 0,  // void quickSort signature
  13: 1,  // if (lo < hi)
  14: 2,  // p = partition(...)
  15: 3,  // recurse left
  16: 4,  // recurse right
  17: 5,  // }
  18: 6,  // }
};

// Heap sort — full code is heapCode (18 lines). Short = main heapSort + heapify() as 1 call
const heapCodeShort = [
  "void heapSort(vector<int>& a) {",                                // 0
  "  int n = a.size();",                                            // 1
  "  // 1) build max-heap จาก bottom-up",                            // 2
  "  for (int i = n/2 - 1; i >= 0; i--)",                           // 3
  "    heapify(a, n, i);              // ← sift down (max-heapify)", // 4
  "  // 2) sort: swap root กับ end แล้ว re-heapify",                  // 5
  "  for (int i = n - 1; i > 0; i--) {",                            // 6
  "    swap(a[0], a[i]);",                                          // 7
  "    heapify(a, i, 0);              // ← re-heapify",              // 8
  "  }",                                                            // 9
  "}",                                                              // 10
];
// full: 0-9 heapify() body, 10-17 heapSort() body
// short: 0=heapSort sig, 1=n, 2=build comment, 3=for build, 4=heapify (call), 5=sort comment, 6=for sort, 7=swap, 8=heapify, 9=}, 10=}
const heapLineMap = {
  // heapify() body — ทั้งหมด collapse → heapify call (line 4 in short, used in build phase)
  0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4,
  // heapSort() body — map 1:1
  10: 0,  // void heapSort
  11: 1,  // int n
  12: 3,  // for build heap
  13: 6,  // for sort loop
  14: 7,  // swap(a[0], a[i])
  15: 8,  // heapify(a, i, 0) — re-heapify
  16: 9,
  17: 10, // }
};

// Schema:
//   gen           — frame generator
//   code          — pseudocode array (เต็ม, default mode)
//   hasHelper     — true ถ้ามี Short version
//   codeShort     — pseudocode array (สั้น, ซ่อน helper impl)
//   lineMapShort  — { fullLineIdx: shortLineIdx } map สำหรับ highlight
//   helperName    — ชื่อ helper (สำหรับ tooltip)
window.AlgorithmGenerators = {
  bubble:    { gen: genBubbleSort,    code: bubbleCode,    name: "Bubble Sort",    complexity: { time: "O(n²)",            space: "O(1)" },     hasHelper: false },
  shell:     { gen: genShellSort,     code: shellCode,     name: "Shell Sort",     complexity: { time: "O(n^1.3) – O(n²)", space: "O(1)" },     hasHelper: false },
  selection: { gen: genSelectionSort, code: selectionCode, name: "Selection Sort", complexity: { time: "O(n²)",            space: "O(1)" },     hasHelper: false },
  insertion: { gen: genInsertionSort, code: insertionCode, name: "Insertion Sort", complexity: { time: "O(n²)",            space: "O(1)" },     hasHelper: false },
  merge:     { gen: genMergeSort,     code: mergeCode,     name: "Merge Sort",     complexity: { time: "O(n log n)",       space: "O(n)" },     hasHelper: true,  codeShort: mergeCodeShort,    lineMapShort: mergeLineMap,    helperName: "merge()" },
  quick:     { gen: genQuickSort,     code: quickCode,     name: "Quick Sort",     complexity: { time: "O(n log n) avg",   space: "O(log n)" }, hasHelper: true,  codeShort: quickCodeShort,    lineMapShort: quickLineMap,    helperName: "partition()" },
  heap:      { gen: genHeapSort,      code: heapCode,      name: "Heap Sort",      complexity: { time: "O(n log n)",       space: "O(1)" },     hasHelper: true,  codeShort: heapCodeShort,     lineMapShort: heapLineMap,     helperName: "heapify()" },
  linear:    { gen: genLinearSearch,  code: linearCode,    name: "Linear Search",  complexity: { time: "O(n)",             space: "O(1)" },     hasHelper: false },
  binary:    { gen: genBinarySearch,  code: binaryCode,    name: "Binary Search",  complexity: { time: "O(log n)",         space: "O(1)" },     hasHelper: false },
};
