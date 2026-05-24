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
function genMergeSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  function rec(l, r, depth = 0) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    const m = {};
    for (let k = l; k <= r; k++) m[k] = 'compare';
    frames.push({ line: 11, arr: [...a], marks: m, vars: { l, r, mid, depth } });
    rec(l, mid, depth + 1);
    rec(mid + 1, r, depth + 1);
    // merge
    const left = a.slice(l, mid + 1);
    const right = a.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      const mm = {};
      for (let x = l; x <= r; x++) mm[x] = 'dim';
      mm[k] = 'cursor';
      frames.push({ line: 5, arr: [...a], marks: mm, vars: { l, r, k, leftI: i, rightJ: j } });
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; }
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
    const done = {};
    for (let x = l; x <= r; x++) done[x] = 'sorted';
    frames.push({ line: 14, arr: [...a], marks: done, vars: { l, r, depth } });
  }
  frames.push({ line: 9, arr: [...a], marks: {}, vars: { l: 0, r: n - 1 } });
  rec(0, n - 1);
  const fm = {}; for (let i = 0; i < n; i++) fm[i] = 'sorted';
  frames.push({ line: 15, arr: [...a], marks: fm, vars: {} });
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
function genQuickSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  let comparisons = 0, swaps = 0;
  function partition(lo, hi) {
    const pivot = a[hi];
    let i = lo - 1;
    const base = {};
    base[hi] = 'pivot';
    frames.push({ line: 2, arr: [...a], marks: { ...base }, vars: { lo, hi, pivot, i, comparisons, swaps } });
    for (let j = lo; j < hi; j++) {
      comparisons++;
      const m = { ...base }; m[j] = 'compare'; if (i >= lo) m[i] = 'cursor';
      frames.push({ line: 4, arr: [...a], marks: m, vars: { lo, hi, pivot, i, j, comparisons, swaps } });
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;
          const m2 = { ...base }; m2[i] = 'swap'; m2[j] = 'swap';
          frames.push({ line: 6, arr: [...a], marks: m2, vars: { lo, hi, pivot, i, j, comparisons, swaps } });
        }
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    swaps++;
    const finalM = {}; finalM[i + 1] = 'sorted';
    frames.push({ line: 9, arr: [...a], marks: finalM, vars: { lo, hi, pivotPos: i + 1, comparisons, swaps } });
    return i + 1;
  }
  function qs(lo, hi) {
    if (lo < hi) {
      const p = partition(lo, hi);
      qs(lo, p - 1);
      qs(p + 1, hi);
    }
  }
  frames.push({ line: 0, arr: [...a], marks: {}, vars: {} });
  qs(0, n - 1);
  const fm = {}; for (let i = 0; i < n; i++) fm[i] = 'sorted';
  frames.push({ line: 12, arr: [...a], marks: fm, vars: { comparisons, swaps } });
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
function genHeapSort(input) {
  const a = [...input];
  const frames = [];
  const n = a.length;
  function heapify(size, root) {
    let largest = root;
    const l = 2 * root + 1, r = 2 * root + 2;
    const m = {};
    m[root] = 'cursor'; if (l < size) m[l] = 'compare'; if (r < size) m[r] = 'compare';
    frames.push({ line: 2, arr: [...a], marks: m, vars: { root, l, r, size } });
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      const m2 = {}; m2[root] = 'swap'; m2[largest] = 'swap';
      frames.push({ line: 6, arr: [...a], marks: m2, vars: { root, largest, size } });
      heapify(size, largest);
    }
  }
  frames.push({ line: 0, arr: [...a], marks: {}, vars: {} });
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  const sorted = new Set();
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    const m = {};
    [...sorted].forEach(k => m[k] = 'sorted');
    m[0] = 'pivot';
    frames.push({ line: 14, arr: [...a], marks: m, vars: { i, sortedCount: sorted.size } });
    heapify(i, 0);
  }
  sorted.add(0);
  const fm = {}; [...sorted].forEach(k => fm[k] = 'sorted');
  frames.push({ line: 17, arr: [...a], marks: fm, vars: {} });
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
// full: 5=interleave (in merge() body), 9=mergeSort start, 11=mid, 14=merge() call, 15=}
const mergeLineMap = {
  5: 5,   // interleave (in merge() impl) → highlight "merge(...)" call ใน short
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
// full lines: 0-11 = partition(), 12-18 = quickSort()
// frame uses: 0(initial), 2(start partition), 4(if compare), 6(swap inside), 9(final swap), 12(done — quickSort signature)
const quickLineMap = {
  0: 2,   // partition start → "partition()" call in short
  1: 2,
  2: 2,   // i = lo - 1 → still partition
  3: 2,
  4: 2,   // if compare → partition
  5: 2,
  6: 2,   // swap inside partition → partition call
  7: 2,
  8: 2,
  9: 2,   // final pivot swap → still partition
  10: 2,
  11: 2,
  12: 0,  // void quickSort signature
  13: 1,
  14: 2,  // p = partition(...)
  15: 3,  // recurse left
  16: 4,  // recurse right
  17: 5,
  18: 6,
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
// full: 0-9 heapify(), 10-17 heapSort()
// frames: 0(initial), 2(children check in heapify), 6(swap in heapify), 14(sort-loop swap), 17(final)
const heapLineMap = {
  0: 4,   // heapify start → heapify call line in short
  1: 4,
  2: 4,   // children check → heapify call
  3: 4,
  4: 4,
  5: 4,
  6: 4,   // swap in heapify → heapify call
  7: 4,
  8: 4,
  9: 4,
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
