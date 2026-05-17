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
      frames.push({ line: 2, arr: [...a], marks, vars: { i, j, swaps, comparisons } });
      if (a[j] > a[j + 1]) {
        const ms = {};
        [...sorted].forEach(k => ms[k] = 'sorted');
        ms[j] = 'swap'; ms[j + 1] = 'swap';
        frames.push({ line: 3, arr: [...a], marks: ms, vars: { i, j, swaps, comparisons } });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        const ms2 = {};
        [...sorted].forEach(k => ms2[k] = 'sorted');
        ms2[j] = 'swap'; ms2[j + 1] = 'swap';
        frames.push({ line: 4, arr: [...a], marks: ms2, vars: { i, j, swaps, comparisons } });
      }
    }
    sorted.add(n - 1 - i);
  }
  sorted.add(0);
  const fm = {}; [...sorted].forEach(k => fm[k] = 'sorted');
  frames.push({ line: 7, arr: [...a], marks: fm, vars: { i: '-', j: '-', swaps, comparisons } });
  return frames;
}
const bubbleCode = [
  "void bubbleSort(int a[], int n) {",
  "  for (int i = 0; i < n - 1; i++) {",
  "    for (int j = 0; j < n - i - 1; j++) {",
  "      if (a[j] > a[j + 1]) {",
  "        swap(&a[j], &a[j + 1]);",
  "      }",
  "    }",
  "  }",
  "}",
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
    frames.push({ line: 2, arr: [...a], marks: { ...baseMarks }, vars: { i, j: '-', minIdx, comparisons, swaps } });
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const m = { ...baseMarks };
      m[minIdx] = 'cursor'; m[j] = 'compare';
      frames.push({ line: 4, arr: [...a], marks: m, vars: { i, j, minIdx, comparisons, swaps } });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        baseMarks[i] = 'cursor';
        const m2 = { ...baseMarks }; m2[minIdx] = 'cursor';
        frames.push({ line: 5, arr: [...a], marks: m2, vars: { i, j, minIdx, comparisons, swaps } });
      }
    }
    if (minIdx !== i) {
      const ms = {};
      for (let k = 0; k < i; k++) ms[k] = 'sorted';
      ms[i] = 'swap'; ms[minIdx] = 'swap';
      frames.push({ line: 7, arr: [...a], marks: ms, vars: { i, minIdx, comparisons, swaps } });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      const ms2 = { ...ms };
      frames.push({ line: 7, arr: [...a], marks: ms2, vars: { i, minIdx, comparisons, swaps } });
    }
  }
  const fm = {}; for (let k = 0; k < n; k++) fm[k] = 'sorted';
  frames.push({ line: 9, arr: [...a], marks: fm, vars: { comparisons, swaps } });
  return frames;
}
const selectionCode = [
  "void selectionSort(int a[], int n) {",
  "  for (int i = 0; i < n - 1; i++) {",
  "    int minIdx = i;",
  "    for (int j = i + 1; j < n; j++) {",
  "      if (a[j] < a[minIdx])",
  "        minIdx = j;",
  "    }",
  "    swap(&a[i], &a[minIdx]);",
  "  }",
  "}",
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
    frames.push({ line: 2, arr: [...a], marks: { ...sortedRange }, vars: { i, j: '-', key, comparisons, shifts } });
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      comparisons++;
      const m = { ...sortedRange }; m[j] = 'compare'; m[j + 1] = 'swap';
      frames.push({ line: 5, arr: [...a], marks: m, vars: { i, j, key, comparisons, shifts } });
      a[j + 1] = a[j];
      shifts++;
      j--;
    }
    a[j + 1] = key;
    const fm = {};
    for (let k = 0; k <= i; k++) fm[k] = 'sorted';
    frames.push({ line: 7, arr: [...a], marks: fm, vars: { i, j: j + 1, key, comparisons, shifts } });
  }
  return frames;
}
const insertionCode = [
  "void insertionSort(int a[], int n) {",
  "  for (int i = 1; i < n; i++) {",
  "    int key = a[i];",
  "    int j = i - 1;",
  "    while (j >= 0 && a[j] > key) {",
  "      a[j + 1] = a[j];",
  "      j--;",
  "    }",
  "    a[j + 1] = key;",
  "  }",
  "}",
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
    frames.push({ line: 2, arr: [...a], marks: m, vars: { l, r, mid, depth } });
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
      frames.push({ line: 6, arr: [...a], marks: mm, vars: { l, r, k, leftI: i, rightJ: j } });
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; }
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
    const done = {};
    for (let x = l; x <= r; x++) done[x] = 'sorted';
    frames.push({ line: 9, arr: [...a], marks: done, vars: { l, r, depth } });
  }
  frames.push({ line: 0, arr: [...a], marks: {}, vars: { l: 0, r: n - 1 } });
  rec(0, n - 1);
  const fm = {}; for (let i = 0; i < n; i++) fm[i] = 'sorted';
  frames.push({ line: 11, arr: [...a], marks: fm, vars: {} });
  return frames;
}
const mergeCode = [
  "void mergeSort(int a[], int l, int r) {",
  "  if (l >= r) return;",
  "  int mid = (l + r) / 2;",
  "  mergeSort(a, l, mid);",
  "  mergeSort(a, mid + 1, r);",
  "  // merge two halves",
  "  merge(a, l, mid, r);",
  "}",
  "// merge() copies left/right halves and",
  "// interleaves them back in order",
  "// → guarantees O(n log n)",
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
  "int partition(int a[], int lo, int hi) {",
  "  int pivot = a[hi];",
  "  int i = lo - 1;",
  "  for (int j = lo; j < hi; j++) {",
  "    if (a[j] <= pivot) {",
  "      i++;",
  "      swap(&a[i], &a[j]);",
  "    }",
  "  }",
  "  swap(&a[i + 1], &a[hi]);",
  "  return i + 1;",
  "}",
  "void quickSort(int a[], int lo, int hi) { ... }",
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
    frames.push({ line: 9, arr: [...a], marks: m, vars: { i, sortedCount: sorted.size } });
    heapify(i, 0);
  }
  sorted.add(0);
  const fm = {}; [...sorted].forEach(k => fm[k] = 'sorted');
  frames.push({ line: 12, arr: [...a], marks: fm, vars: {} });
  return frames;
}
const heapCode = [
  "void heapify(int a[], int n, int i) {",
  "  int largest = i;",
  "  int l = 2*i + 1, r = 2*i + 2;",
  "  if (l < n && a[l] > a[largest]) largest = l;",
  "  if (r < n && a[r] > a[largest]) largest = r;",
  "  if (largest != i) {",
  "    swap(&a[i], &a[largest]);",
  "    heapify(a, n, largest);",
  "  }",
  "}",
  "void heapSort(int a[], int n) {",
  "  for (int i = n/2 - 1; i >= 0; i--) heapify(a, n, i);",
  "  for (int i = n - 1; i > 0; i--) { swap(&a[0], &a[i]); heapify(a, i, 0); }",
  "}",
];

// ============ Linear Search ============
function genLinearSearch(arr, target) {
  const frames = [];
  frames.push({ line: 0, arr: [...arr], marks: {}, vars: { target, i: '-' } });
  for (let i = 0; i < arr.length; i++) {
    const m = {};
    for (let k = 0; k < i; k++) m[k] = 'miss';
    m[i] = 'cursor';
    frames.push({ line: 2, arr: [...arr], marks: m, vars: { target, i, 'a[i]': arr[i] } });
    if (arr[i] === target) {
      const f = { ...m }; f[i] = 'found';
      frames.push({ line: 3, arr: [...arr], marks: f, vars: { target, i, found: true } });
      return frames;
    }
  }
  const m = {}; for (let k = 0; k < arr.length; k++) m[k] = 'miss';
  frames.push({ line: 6, arr: [...arr], marks: m, vars: { target, found: false } });
  return frames;
}
const linearCode = [
  "int linearSearch(int a[], int n, int x) {",
  "  for (int i = 0; i < n; i++) {",
  "    if (a[i] == x)",
  "      return i;",
  "  }",
  "  return -1;",
  "}",
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
  "int binarySearch(int a[], int n, int x) {",
  "  int lo = 0, hi = n - 1;",
  "  while (lo <= hi) {",
  "    int mid = lo + (hi - lo) / 2;",
  "    if (a[mid] == x)",
  "      return mid;",
  "    else if (a[mid] < x)",
  "      lo = mid + 1;",
  "    else",
  "      hi = mid - 1;",
  "  }",
  "  return -1;",
  "}",
];

window.AlgorithmGenerators = {
  bubble: { gen: genBubbleSort, code: bubbleCode, name: "Bubble Sort", complexity: { time: "O(n²)", space: "O(1)" } },
  selection: { gen: genSelectionSort, code: selectionCode, name: "Selection Sort", complexity: { time: "O(n²)", space: "O(1)" } },
  insertion: { gen: genInsertionSort, code: insertionCode, name: "Insertion Sort", complexity: { time: "O(n²)", space: "O(1)" } },
  merge: { gen: genMergeSort, code: mergeCode, name: "Merge Sort", complexity: { time: "O(n log n)", space: "O(n)" } },
  quick: { gen: genQuickSort, code: quickCode, name: "Quick Sort", complexity: { time: "O(n log n) avg", space: "O(log n)" } },
  heap: { gen: genHeapSort, code: heapCode, name: "Heap Sort", complexity: { time: "O(n log n)", space: "O(1)" } },
  linear: { gen: genLinearSearch, code: linearCode, name: "Linear Search", complexity: { time: "O(n)", space: "O(1)" } },
  binary: { gen: genBinarySearch, code: binaryCode, name: "Binary Search", complexity: { time: "O(log n)", space: "O(1)" } },
};
