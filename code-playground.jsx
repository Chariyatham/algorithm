/* Code Playground + Problems Hub — รัน JS ใน browser, มี test runner, ไม่ต้องใช้ AI */

const { useState: useSP, useEffect: useEP, useRef: useRP, useMemo: useMP } = React;

const PLAY_KEY = "algo-academy-playground-v1";
const SOLVED_KEY = "algo-academy-solved-v1";

function loadCode() {
  try { return JSON.parse(localStorage.getItem(PLAY_KEY) || "{}"); } catch { return {}; }
}
function saveCode(map) {
  try { localStorage.setItem(PLAY_KEY, JSON.stringify(map)); } catch {}
}
function loadSolved() {
  try { return JSON.parse(localStorage.getItem(SOLVED_KEY) || "{}"); } catch { return {}; }
}
function saveSolved(map) {
  try { localStorage.setItem(SOLVED_KEY, JSON.stringify(map)); } catch {}
}

/* ============================================================
   PROBLEM BANK — basic → advanced
   - starter: starter code (JS)
   - solution: reference solution (hidden until user clicks)
   - tests: [{ input, expected }] — input passed as arguments
   - fn: function name to call
============================================================ */
const PROBLEMS = [
  // ===== BASIC: เริ่มต้น =====
  {
    id: "p-sum-array", level: "basic", cat: "basic", time: "5 นาที",
    title: "ผลรวมของ array",
    desc: "เขียน function sum(arr) คืนค่าผลรวมของเลขใน array",
    fn: "sum",
    starter: "function sum(arr) {\n  // เขียนโค้ดที่นี่\n  \n}",
    solution: "function sum(arr) {\n  let s = 0;\n  for (const x of arr) s += x;\n  return s;\n}",
    tests: [
      { input: [[1, 2, 3]], expected: 6 },
      { input: [[]], expected: 0 },
      { input: [[-1, 1]], expected: 0 },
      { input: [[5]], expected: 5 },
    ],
    hint: "ใช้ for loop บวกทีละตัว หรือใช้ reduce ก็ได้",
    bigO: "O(n)",
  },
  {
    id: "p-max-array", level: "basic", cat: "basic", time: "5 นาที",
    title: "หาค่ามากสุดใน array",
    desc: "เขียน function maxOf(arr) คืนค่ามากสุด (สมมุติ arr ไม่ว่าง)",
    fn: "maxOf",
    starter: "function maxOf(arr) {\n  \n}",
    solution: "function maxOf(arr) {\n  let m = arr[0];\n  for (const x of arr) if (x > m) m = x;\n  return m;\n}",
    tests: [
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: 9 },
      { input: [[-5, -2, -10]], expected: -2 },
      { input: [[7]], expected: 7 },
    ],
    hint: "เก็บค่าแรกไว้ก่อน แล้ววนเทียบ",
    bigO: "O(n)",
  },
  {
    id: "p-reverse-string", level: "basic", cat: "basic", time: "5 นาที",
    title: "กลับลำดับ string",
    desc: "เขียน function reverseStr(s) คืน string ที่กลับลำดับ",
    fn: "reverseStr",
    starter: "function reverseStr(s) {\n  \n}",
    solution: "function reverseStr(s) {\n  return s.split('').reverse().join('');\n}",
    tests: [
      { input: ["hello"], expected: "olleh" },
      { input: [""], expected: "" },
      { input: ["a"], expected: "a" },
      { input: ["ABCD"], expected: "DCBA" },
    ],
    hint: "split → reverse → join หรือใช้ loop ต่อย้อนกลับ",
    bigO: "O(n)",
  },
  {
    id: "p-is-palindrome", level: "basic", cat: "string", time: "8 นาที",
    title: "Palindrome หรือไม่",
    desc: "เขียน function isPalindrome(s) คืน true ถ้า s อ่านได้เหมือนกันทั้งซ้ายขวา",
    fn: "isPalindrome",
    starter: "function isPalindrome(s) {\n  \n}",
    solution: "function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    if (s[l] !== s[r]) return false;\n    l++; r--;\n  }\n  return true;\n}",
    tests: [
      { input: ["racecar"], expected: true },
      { input: ["hello"], expected: false },
      { input: [""], expected: true },
      { input: ["a"], expected: true },
      { input: ["abba"], expected: true },
    ],
    hint: "Two pointers — ซ้ายกับขวาวิ่งเข้าหากัน",
    bigO: "O(n)",
  },
  {
    id: "p-factorial", level: "basic", cat: "recursion", time: "8 นาที",
    title: "Factorial",
    desc: "เขียน factorial(n) คืน n! โดยใช้ recursion",
    fn: "factorial",
    starter: "function factorial(n) {\n  \n}",
    solution: "function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}",
    tests: [
      { input: [0], expected: 1 },
      { input: [1], expected: 1 },
      { input: [5], expected: 120 },
      { input: [10], expected: 3628800 },
    ],
    hint: "base case: n<=1 → 1, อื่นๆ: n * factorial(n-1)",
    bigO: "O(n)",
  },
  {
    id: "p-fib", level: "basic", cat: "recursion", time: "10 นาที",
    title: "Fibonacci (n-th)",
    desc: "เขียน fib(n) — F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). ระวัง n ใหญ่ ต้องใช้ memo หรือ iterative",
    fn: "fib",
    starter: "function fib(n) {\n  \n}",
    solution: "function fib(n) {\n  if (n < 2) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}",
    tests: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [10], expected: 55 },
      { input: [20], expected: 6765 },
      { input: [40], expected: 102334155 },
    ],
    hint: "recursion ตรงๆ จะช้า (O(2^n)) — ใช้ iterative O(n) จะดี",
    bigO: "O(n)",
  },

  // ===== INTERMEDIATE: Search & Sort =====
  {
    id: "p-binary-search", level: "inter", cat: "search", time: "12 นาที",
    title: "Binary Search",
    desc: "เขียน binarySearch(arr, target) — arr เรียงน้อย→มาก, คืน index หรือ -1 ถ้าไม่เจอ",
    fn: "binarySearch",
    starter: "function binarySearch(arr, target) {\n  \n}",
    solution: "function binarySearch(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const m = Math.floor((l + r) / 2);\n    if (arr[m] === target) return m;\n    if (arr[m] < target) l = m + 1; else r = m - 1;\n  }\n  return -1;\n}",
    tests: [
      { input: [[1, 3, 5, 7, 9, 11], 7], expected: 3 },
      { input: [[1, 3, 5, 7, 9, 11], 1], expected: 0 },
      { input: [[1, 3, 5, 7, 9, 11], 11], expected: 5 },
      { input: [[1, 3, 5, 7, 9, 11], 4], expected: -1 },
      { input: [[], 1], expected: -1 },
    ],
    hint: "two pointers l, r — เทียบ arr[mid] กับ target แล้วตัดครึ่ง",
    bigO: "O(log n)",
  },
  {
    id: "p-bubble-sort", level: "inter", cat: "sort", time: "10 นาที",
    title: "Bubble Sort",
    desc: "เขียน bubbleSort(arr) — เรียงน้อย→มาก, ห้ามใช้ .sort()",
    fn: "bubbleSort",
    starter: "function bubbleSort(arr) {\n  // คืนค่า arr ที่เรียงแล้ว\n  \n}",
    solution: "function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length; i++)\n    for (let j = 0; j < a.length - 1 - i; j++)\n      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];\n  return a;\n}",
    tests: [
      { input: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: [1, 1, 2, 3, 4, 5, 6, 9] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    ],
    hint: "nested loop — เทียบคู่ติดกัน แล้ว swap ถ้าเรียงผิด",
    bigO: "O(n²)",
  },
  {
    id: "p-merge-sort", level: "inter", cat: "sort", time: "20 นาที",
    title: "Merge Sort",
    desc: "เขียน mergeSort(arr) — divide & conquer, O(n log n)",
    fn: "mergeSort",
    starter: "function mergeSort(arr) {\n  \n}",
    solution: "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const m = arr.length >> 1;\n  const L = mergeSort(arr.slice(0, m));\n  const R = mergeSort(arr.slice(m));\n  const out = [];\n  let i = 0, j = 0;\n  while (i < L.length && j < R.length) out.push(L[i] <= R[j] ? L[i++] : R[j++]);\n  return [...out, ...L.slice(i), ...R.slice(j)];\n}",
    tests: [
      { input: [[5, 2, 8, 1, 9, 3]], expected: [1, 2, 3, 5, 8, 9] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
      { input: [[3, 3, 1, 1, 2, 2]], expected: [1, 1, 2, 2, 3, 3] },
    ],
    hint: "1. แบ่งครึ่ง 2. mergeSort แต่ละครึ่ง 3. merge สองครึ่งที่เรียงแล้ว",
    bigO: "O(n log n)",
  },
  {
    id: "p-two-sum", level: "inter", cat: "hash", time: "10 นาที",
    title: "Two Sum",
    desc: "เขียน twoSum(nums, target) — คืน [i, j] ที่ nums[i]+nums[j]=target (i<j) หรือ [] ถ้าไม่มี",
    fn: "twoSum",
    starter: "function twoSum(nums, target) {\n  \n}",
    solution: "function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}",
    tests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
      { input: [[1, 2, 3], 100], expected: [] },
    ],
    hint: "Hash Map — เก็บค่าที่เห็นแล้วและ index ของมัน เช็คทุกตัวว่าคู่ของมันเคยเห็นไหม",
    bigO: "O(n)",
  },
  {
    id: "p-count-vowels", level: "inter", cat: "string", time: "8 นาที",
    title: "นับสระภาษาอังกฤษ",
    desc: "เขียน countVowels(s) — นับ a/e/i/o/u (lowercase หรือ uppercase ก็ได้)",
    fn: "countVowels",
    starter: "function countVowels(s) {\n  \n}",
    solution: "function countVowels(s) {\n  let c = 0;\n  for (const ch of s.toLowerCase())\n    if ('aeiou'.includes(ch)) c++;\n  return c;\n}",
    tests: [
      { input: ["hello"], expected: 2 },
      { input: ["HELLO"], expected: 2 },
      { input: ["xyz"], expected: 0 },
      { input: [""], expected: 0 },
      { input: ["aeiou"], expected: 5 },
    ],
    hint: "loop ทีละตัว เช็คว่าอยู่ใน 'aeiou' ไหม (lowercase ก่อนเทียบ)",
    bigO: "O(n)",
  },

  // ===== ADVANCED: DP, Graph, Greedy =====
  {
    id: "p-climb-stairs", level: "inter", cat: "dp", time: "15 นาที",
    title: "Climb Stairs (DP)",
    desc: "บันได n ขั้น แต่ละก้าวขึ้น 1 หรือ 2 ขั้น มีกี่วิธีถึงยอด?",
    fn: "climbStairs",
    starter: "function climbStairs(n) {\n  \n}",
    solution: "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}",
    tests: [
      { input: [1], expected: 1 },
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 },
      { input: [10], expected: 89 },
    ],
    hint: "f(n) = f(n-1) + f(n-2) — เป็น Fibonacci ปลอมตัว",
    bigO: "O(n)",
  },
  {
    id: "p-coin-change", level: "adv", cat: "dp", time: "25 นาที",
    title: "Coin Change",
    desc: "มีเหรียญ coins[] และจำนวน amount — หาเหรียญน้อยสุดที่รวมได้ amount (หรือ -1 ถ้าทำไม่ได้)",
    fn: "coinChange",
    starter: "function coinChange(coins, amount) {\n  \n}",
    solution: "function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++)\n    for (const c of coins)\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    tests: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 },
      { input: [[1, 2, 5], 100], expected: 20 },
    ],
    hint: "dp[i] = min(dp[i - c] + 1) ทุก c ใน coins ที่ i-c >= 0",
    bigO: "O(amount × len(coins))",
  },
  {
    id: "p-max-subarray", level: "inter", cat: "dp", time: "15 นาที",
    title: "Max Subarray Sum (Kadane)",
    desc: "หาผลรวมมากสุดของ contiguous subarray",
    fn: "maxSubArray",
    starter: "function maxSubArray(nums) {\n  \n}",
    solution: "function maxSubArray(nums) {\n  let cur = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    cur = Math.max(nums[i], cur + nums[i]);\n    best = Math.max(best, cur);\n  }\n  return best;\n}",
    tests: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 },
      { input: [[-1, -2, -3]], expected: -1 },
    ],
    hint: "Kadane: cur = max(nums[i], cur + nums[i]) — รีเซ็ตเมื่อ cur ติดลบ",
    bigO: "O(n)",
  },
  {
    id: "p-bfs-shortest", level: "adv", cat: "graph", time: "25 นาที",
    title: "BFS Shortest Path",
    desc: "graph เป็น adjacency list (object เช่น {A:['B','C']}) — หาความยาวสั้นสุดจาก start ถึง end (จำนวน edges) หรือ -1",
    fn: "shortestPath",
    starter: "function shortestPath(graph, start, end) {\n  \n}",
    solution: "function shortestPath(graph, start, end) {\n  if (start === end) return 0;\n  const seen = new Set([start]);\n  let frontier = [start], dist = 0;\n  while (frontier.length) {\n    dist++;\n    const next = [];\n    for (const u of frontier) {\n      for (const v of (graph[u] || [])) {\n        if (v === end) return dist;\n        if (!seen.has(v)) { seen.add(v); next.push(v); }\n      }\n    }\n    frontier = next;\n  }\n  return -1;\n}",
    tests: [
      { input: [{ A: ["B", "C"], B: ["D"], C: ["D", "E"], D: ["F"], E: ["F"], F: [] }, "A", "F"], expected: 3 },
      { input: [{ A: ["B"], B: [] }, "A", "B"], expected: 1 },
      { input: [{ A: ["B"], B: ["A"] }, "A", "A"], expected: 0 },
      { input: [{ A: ["B"], C: ["D"] }, "A", "D"], expected: -1 },
    ],
    hint: "BFS เป็นชั้นๆ — เริ่มจาก {start} แล้ว expand ทีละ layer นับ depth",
    bigO: "O(V + E)",
  },
  {
    id: "p-valid-parens", level: "inter", cat: "stack", time: "12 นาที",
    title: "Valid Parentheses",
    desc: "เขียน isValid(s) — s ประกอบด้วย ()[]{} เช็คว่าเปิด-ปิดถูกหรือไม่",
    fn: "isValid",
    starter: "function isValid(s) {\n  \n}",
    solution: "function isValid(s) {\n  const stack = [], pair = { ')': '(', ']': '[', '}': '{' };\n  for (const c of s) {\n    if ('([{'.includes(c)) stack.push(c);\n    else if (stack.pop() !== pair[c]) return false;\n  }\n  return stack.length === 0;\n}",
    tests: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false },
      { input: ["{[]}"], expected: true },
      { input: [""], expected: true },
    ],
    hint: "Stack — เจอเปิด push, เจอปิด pop แล้วเช็คว่า match",
    bigO: "O(n)",
  },
  {
    id: "p-merge-intervals", level: "adv", cat: "greedy", time: "20 นาที",
    title: "Merge Intervals",
    desc: "intervals = [[s1,e1],...] — รวมที่ซ้อนทับกัน คืนผลที่เรียงตาม start",
    fn: "merge",
    starter: "function merge(intervals) {\n  \n}",
    solution: "function merge(intervals) {\n  if (!intervals.length) return [];\n  const a = [...intervals].sort((x, y) => x[0] - y[0]);\n  const out = [a[0]];\n  for (let i = 1; i < a.length; i++) {\n    const last = out[out.length - 1];\n    if (a[i][0] <= last[1]) last[1] = Math.max(last[1], a[i][1]);\n    else out.push(a[i]);\n  }\n  return out;\n}",
    tests: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { input: [[[1, 4]]], expected: [[1, 4]] },
      { input: [[]], expected: [] },
    ],
    hint: "1. sort ตาม start  2. เทียบกับ interval ล่าสุดใน output ว่าซ้อนไหม",
    bigO: "O(n log n)",
  },
  {
    id: "p-gcd", level: "basic", cat: "recursion", time: "8 นาที",
    title: "GCD (Euclidean)",
    desc: "เขียน gcd(a, b) คืนค่าตัวหารร่วมมากของ a, b",
    fn: "gcd",
    starter: "function gcd(a, b) {\n  \n}",
    solution: "function gcd(a, b) {\n  return b === 0 ? a : gcd(b, a % b);\n}",
    tests: [
      { input: [12, 18], expected: 6 },
      { input: [100, 75], expected: 25 },
      { input: [7, 13], expected: 1 },
      { input: [10, 0], expected: 10 },
    ],
    hint: "gcd(a, b) = gcd(b, a mod b), base: gcd(a, 0) = a",
    bigO: "O(log min(a,b))",
  },
  {
    id: "p-is-prime", level: "basic", cat: "math", time: "8 นาที",
    title: "ตรวจสอบเลขเฉพาะ",
    desc: "เขียน isPrime(n) — n>=2 เป็นเลขเฉพาะหรือไม่ (n<2 → false)",
    fn: "isPrime",
    starter: "function isPrime(n) {\n  \n}",
    solution: "function isPrime(n) {\n  if (n < 2) return false;\n  if (n < 4) return true;\n  if (n % 2 === 0) return false;\n  for (let i = 3; i * i <= n; i += 2)\n    if (n % i === 0) return false;\n  return true;\n}",
    tests: [
      { input: [2], expected: true },
      { input: [3], expected: true },
      { input: [4], expected: false },
      { input: [97], expected: true },
      { input: [1], expected: false },
      { input: [100], expected: false },
    ],
    hint: "loop แค่ถึง √n พอ — เร็วกว่าวนถึง n มาก",
    bigO: "O(√n)",
  },
  {
    id: "p-unique-chars", level: "inter", cat: "hash", time: "10 นาที",
    title: "ตัวอักษรไม่ซ้ำ",
    desc: "เขียน allUnique(s) — คืน true ถ้าทุกตัวอักษรใน s ไม่ซ้ำกัน",
    fn: "allUnique",
    starter: "function allUnique(s) {\n  \n}",
    solution: "function allUnique(s) {\n  const seen = new Set();\n  for (const c of s) {\n    if (seen.has(c)) return false;\n    seen.add(c);\n  }\n  return true;\n}",
    tests: [
      { input: ["abc"], expected: true },
      { input: ["abca"], expected: false },
      { input: [""], expected: true },
      { input: ["aA"], expected: true },
    ],
    hint: "ใช้ Set — เก็บที่เห็นแล้ว เจอซ้ำ → false",
    bigO: "O(n)",
  },
  {
    id: "p-quick-sort", level: "adv", cat: "sort", time: "25 นาที",
    title: "Quick Sort",
    desc: "เขียน quickSort(arr) — divide & conquer, average O(n log n)",
    fn: "quickSort",
    starter: "function quickSort(arr) {\n  \n}",
    solution: "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const p = arr[arr.length >> 1];\n  const L = arr.filter(x => x < p);\n  const E = arr.filter(x => x === p);\n  const R = arr.filter(x => x > p);\n  return [...quickSort(L), ...E, ...quickSort(R)];\n}",
    tests: [
      { input: [[3, 6, 1, 8, 2, 9, 4]], expected: [1, 2, 3, 4, 6, 8, 9] },
      { input: [[]], expected: [] },
      { input: [[5, 5, 5]], expected: [5, 5, 5] },
      { input: [[-1, -5, 3, 0]], expected: [-5, -1, 0, 3] },
    ],
    hint: "เลือก pivot → แบ่ง 3 กอง (น้อย/เท่า/มาก) → recurse",
    bigO: "average O(n log n), worst O(n²)",
  },
  {
    id: "p-anagram", level: "inter", cat: "string", time: "10 นาที",
    title: "Anagram?",
    desc: "isAnagram(a, b) — string สองตัวเป็น anagram กันไหม (ตัวอักษรเหมือนกันแต่อาจสลับ)",
    fn: "isAnagram",
    starter: "function isAnagram(a, b) {\n  \n}",
    solution: "function isAnagram(a, b) {\n  if (a.length !== b.length) return false;\n  const cnt = {};\n  for (const c of a) cnt[c] = (cnt[c] || 0) + 1;\n  for (const c of b) {\n    if (!cnt[c]) return false;\n    cnt[c]--;\n  }\n  return true;\n}",
    tests: [
      { input: ["listen", "silent"], expected: true },
      { input: ["hello", "world"], expected: false },
      { input: ["", ""], expected: true },
      { input: ["a", "ab"], expected: false },
    ],
    hint: "นับตัวอักษรของ a แล้วเทียบกับ b หรือใช้ sort + เทียบ",
    bigO: "O(n)",
  },
  {
    id: "p-rotate-array", level: "inter", cat: "array", time: "12 นาที",
    title: "หมุน array",
    desc: "rotate(arr, k) — เลื่อนทุก element ไปทางขวา k ตำแหน่ง (cyclic)",
    fn: "rotate",
    starter: "function rotate(arr, k) {\n  \n}",
    solution: "function rotate(arr, k) {\n  const n = arr.length;\n  if (n === 0) return [];\n  k = ((k % n) + n) % n;\n  return [...arr.slice(n - k), ...arr.slice(0, n - k)];\n}",
    tests: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3] },
      { input: [[1, 2, 3], 0], expected: [1, 2, 3] },
      { input: [[1, 2, 3], 3], expected: [1, 2, 3] },
      { input: [[], 5], expected: [] },
    ],
    hint: "k = k mod n  →  slice แล้วต่อกลับ",
    bigO: "O(n)",
  },
  {
    id: "p-knapsack", level: "adv", cat: "dp", time: "30 นาที",
    title: "0/1 Knapsack",
    desc: "items=[[weight, value], ...], W=capacity — หาค่ารวมสูงสุดที่ไม่เกิน W (เลือก/ไม่เลือกแต่ละชิ้น)",
    fn: "knapsack",
    starter: "function knapsack(items, W) {\n  \n}",
    solution: "function knapsack(items, W) {\n  const n = items.length;\n  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    const [w, v] = items[i - 1];\n    for (let j = 0; j <= W; j++) {\n      dp[i][j] = dp[i - 1][j];\n      if (j >= w) dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - w] + v);\n    }\n  }\n  return dp[n][W];\n}",
    tests: [
      { input: [[[2, 3], [3, 4], [5, 8]], 10], expected: 15 },
      { input: [[[1, 1], [2, 2], [3, 3]], 5], expected: 5 },
      { input: [[], 10], expected: 0 },
      { input: [[[5, 100]], 4], expected: 0 },
    ],
    hint: "dp[i][j] = max(เอา, ไม่เอา) ของ item i ที่ capacity j",
    bigO: "O(n × W)",
  },

  /* ===================== ADDITIONAL PROBLEMS (Tier 3 expansion) ===================== */
  /* ===== ARRAY / TWO POINTERS ===== */
  {
    id: "p-remove-duplicates", level: "basic", cat: "array", time: "5 นาที",
    title: "ลบ duplicate ออกจาก sorted array (in-place)",
    desc: "arr เรียงแล้ว — return new length หลังลบ duplicate (modify arr in-place ก็ได้)",
    fn: "removeDuplicates",
    starter: "function removeDuplicates(arr) {\n  \n}",
    solution: "function removeDuplicates(arr) {\n  if (arr.length === 0) return 0;\n  let k = 1;\n  for (let i = 1; i < arr.length; i++) if (arr[i] !== arr[i - 1]) arr[k++] = arr[i];\n  return k;\n}",
    tests: [
      { input: [[1, 1, 2]], expected: 2 },
      { input: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
      { input: [[]], expected: 0 },
    ],
    hint: "Two pointer — slow (k) + fast (i)",
    bigO: "O(n)",
  },
  {
    id: "p-move-zeros", level: "basic", cat: "array", time: "5 นาที",
    title: "ย้าย zeros ไปท้าย array",
    desc: "ย้าย 0 ทั้งหมดไปท้าย โดยลำดับของ non-zero คงเดิม — return array",
    fn: "moveZeros",
    starter: "function moveZeros(arr) {\n  \n}",
    solution: "function moveZeros(arr) {\n  const a = [...arr]; let k = 0;\n  for (let i = 0; i < a.length; i++) if (a[i] !== 0) a[k++] = a[i];\n  while (k < a.length) a[k++] = 0;\n  return a;\n}",
    tests: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { input: [[0]], expected: [0] },
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
    ],
    hint: "Two pointer — เก็บ non-zero ที่ slow pointer",
    bigO: "O(n)",
  },
  {
    id: "p-container-water", level: "inter", cat: "array", time: "12 นาที",
    title: "Container with Most Water",
    desc: "height[i] = ความสูงของเสา i — หา 2 เสาที่บรรจุน้ำได้มากสุด (area = min(h[i], h[j]) × (j-i))",
    fn: "maxArea",
    starter: "function maxArea(heights) {\n  \n}",
    solution: "function maxArea(heights) {\n  let l = 0, r = heights.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, Math.min(heights[l], heights[r]) * (r - l));\n    if (heights[l] < heights[r]) l++; else r--;\n  }\n  return best;\n}",
    tests: [
      { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { input: [[1, 1]], expected: 1 },
      { input: [[4, 3, 2, 1, 4]], expected: 16 },
    ],
    hint: "Two pointer จากปลาย — ย่อ pointer ที่เสาเตี้ยกว่า",
    bigO: "O(n)",
  },
  {
    id: "p-three-sum", level: "inter", cat: "array", time: "15 นาที",
    title: "Three Sum",
    desc: "หา triplets [a,b,c] ที่ a+b+c=0 — ไม่ซ้ำ. คืน sorted array of triplets (sorted ภายในและภายนอก)",
    fn: "threeSum",
    starter: "function threeSum(arr) {\n  \n}",
    solution: "function threeSum(arr) {\n  const a = [...arr].sort((x, y) => x - y);\n  const res = [];\n  for (let i = 0; i < a.length - 2; i++) {\n    if (i > 0 && a[i] === a[i - 1]) continue;\n    let l = i + 1, r = a.length - 1;\n    while (l < r) {\n      const s = a[i] + a[l] + a[r];\n      if (s === 0) { res.push([a[i], a[l], a[r]]); while (l < r && a[l] === a[l + 1]) l++; while (l < r && a[r] === a[r - 1]) r--; l++; r--; }\n      else if (s < 0) l++; else r--;\n    }\n  }\n  return res;\n}",
    tests: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: [[0, 0, 0]], expected: [[0, 0, 0]] },
      { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
    ],
    hint: "Sort + fix one + two-pointer for pair — skip duplicates",
    bigO: "O(n²)",
  },
  {
    id: "p-product-except-self", level: "inter", cat: "array", time: "12 นาที",
    title: "Product of Array Except Self",
    desc: "result[i] = ผลคูณของทุกตัวยกเว้น arr[i] — ห้ามใช้ division, O(n) time",
    fn: "productExceptSelf",
    starter: "function productExceptSelf(arr) {\n  \n}",
    solution: "function productExceptSelf(arr) {\n  const n = arr.length, out = new Array(n).fill(1);\n  let left = 1;\n  for (let i = 0; i < n; i++) { out[i] = left; left *= arr[i]; }\n  let right = 1;\n  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= arr[i]; }\n  return out;\n}",
    tests: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
    ],
    hint: "2 passes — prefix product + suffix product",
    bigO: "O(n)",
  },
  {
    id: "p-trap-rain", level: "adv", cat: "array", time: "20 นาที",
    title: "Trapping Rain Water",
    desc: "height[] = ความสูงของแท่ง — หาปริมาณน้ำที่ขังหลังฝนตก",
    fn: "trap",
    starter: "function trap(h) {\n  \n}",
    solution: "function trap(h) {\n  let l = 0, r = h.length - 1, lMax = 0, rMax = 0, total = 0;\n  while (l < r) {\n    if (h[l] < h[r]) {\n      if (h[l] >= lMax) lMax = h[l]; else total += lMax - h[l];\n      l++;\n    } else {\n      if (h[r] >= rMax) rMax = h[r]; else total += rMax - h[r];\n      r--;\n    }\n  }\n  return total;\n}",
    tests: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    ],
    hint: "Two pointer + track leftMax / rightMax",
    bigO: "O(n)",
  },

  /* ===== STRING ===== */
  {
    id: "p-longest-substring-no-repeat", level: "inter", cat: "string", time: "12 นาที",
    title: "Longest Substring Without Repeating",
    desc: "หาความยาวของ longest substring ที่ไม่มีตัวซ้ำ",
    fn: "lengthOfLongestSubstring",
    starter: "function lengthOfLongestSubstring(s) {\n  \n}",
    solution: "function lengthOfLongestSubstring(s) {\n  const map = new Map(); let l = 0, best = 0;\n  for (let r = 0; r < s.length; r++) {\n    if (map.has(s[r]) && map.get(s[r]) >= l) l = map.get(s[r]) + 1;\n    map.set(s[r], r);\n    best = Math.max(best, r - l + 1);\n  }\n  return best;\n}",
    tests: [
      { input: ["abcabcbb"], expected: 3 },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3 },
      { input: [""], expected: 0 },
    ],
    hint: "Sliding window + map ของ char → last index",
    bigO: "O(n)",
  },
  {
    id: "p-group-anagrams", level: "inter", cat: "string", time: "10 นาที",
    title: "Group Anagrams",
    desc: "ให้ words[] — group anagrams เข้าด้วยกัน. คืน array of groups (group sorted by first char of first word)",
    fn: "groupAnagrams",
    starter: "function groupAnagrams(words) {\n  \n}",
    solution: "function groupAnagrams(words) {\n  const map = new Map();\n  for (const w of words) {\n    const k = w.split('').sort().join('');\n    if (!map.has(k)) map.set(k, []);\n    map.get(k).push(w);\n  }\n  return [...map.values()].sort((a, b) => a[0].localeCompare(b[0]));\n}",
    tests: [
      { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["eat", "tea", "ate"], ["tan", "nat"]] },
      { input: [[""]], expected: [[""]] },
      { input: [["a"]], expected: [["a"]] },
    ],
    hint: "Sort characters เป็น key ของ hash map",
    bigO: "O(n × L log L)",
  },
  {
    id: "p-longest-palindrome-substring", level: "inter", cat: "string", time: "20 นาที",
    title: "Longest Palindromic Substring",
    desc: "หา substring ที่ palindrome ยาวสุด (คืน substring — first found ถ้าเสมอ)",
    fn: "longestPalindrome",
    starter: "function longestPalindrome(s) {\n  \n}",
    solution: "function longestPalindrome(s) {\n  if (!s) return '';\n  let best = '';\n  const ex = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; } return s.slice(l + 1, r); };\n  for (let i = 0; i < s.length; i++) {\n    const o = ex(i, i), e = ex(i, i + 1);\n    if (o.length > best.length) best = o;\n    if (e.length > best.length) best = e;\n  }\n  return best;\n}",
    tests: [
      { input: ["babad"], expected: "bab" },
      { input: ["cbbd"], expected: "bb" },
      { input: ["a"], expected: "a" },
      { input: ["ac"], expected: "a" },
    ],
    hint: "Expand around center — odd + even length",
    bigO: "O(n²)",
  },
  {
    id: "p-min-window-substring", level: "adv", cat: "string", time: "25 นาที",
    title: "Minimum Window Substring",
    desc: "หา substring ที่สั้นสุดใน s ที่ครอบ chars ของ t ทั้งหมด (กับ frequency) — '' ถ้าไม่มี",
    fn: "minWindow",
    starter: "function minWindow(s, t) {\n  \n}",
    solution: "function minWindow(s, t) {\n  if (!t || !s) return '';\n  const need = new Map();\n  for (const c of t) need.set(c, (need.get(c) || 0) + 1);\n  let missing = t.length, l = 0, start = 0, len = Infinity;\n  for (let r = 0; r < s.length; r++) {\n    if ((need.get(s[r]) || 0) > 0) missing--;\n    need.set(s[r], (need.get(s[r]) || 0) - 1);\n    while (missing === 0) {\n      if (r - l + 1 < len) { len = r - l + 1; start = l; }\n      need.set(s[l], (need.get(s[l]) || 0) + 1);\n      if ((need.get(s[l]) || 0) > 0) missing++;\n      l++;\n    }\n  }\n  return len === Infinity ? '' : s.substr(start, len);\n}",
    tests: [
      { input: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { input: ["a", "a"], expected: "a" },
      { input: ["a", "aa"], expected: "" },
    ],
    hint: "Sliding window — expand เมื่อ missing > 0, shrink เมื่อ valid",
    bigO: "O(|s| + |t|)",
  },

  /* ===== SEARCH / SLIDING WINDOW ===== */
  {
    id: "p-search-rotated", level: "inter", cat: "search", time: "15 นาที",
    title: "Search in Rotated Sorted Array",
    desc: "array เคย sorted แล้วถูก rotate ที่จุดหนึ่ง — หา target (return index หรือ -1), O(log n)",
    fn: "searchRotated",
    starter: "function searchRotated(a, t) {\n  \n}",
    solution: "function searchRotated(a, t) {\n  let l = 0, r = a.length - 1;\n  while (l <= r) {\n    const m = (l + r) >> 1;\n    if (a[m] === t) return m;\n    if (a[l] <= a[m]) {\n      if (a[l] <= t && t < a[m]) r = m - 1; else l = m + 1;\n    } else {\n      if (a[m] < t && t <= a[r]) l = m + 1; else r = m - 1;\n    }\n  }\n  return -1;\n}",
    tests: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[1], 1], expected: 0 },
    ],
    hint: "Binary search — เช็คว่า half ไหน sorted แล้ว target อยู่ใน range",
    bigO: "O(log n)",
  },
  {
    id: "p-find-peak", level: "inter", cat: "search", time: "10 นาที",
    title: "Find Peak Element",
    desc: "หา index ของ peak (a[i] > neighbors) — return any peak. O(log n)",
    fn: "findPeak",
    starter: "function findPeak(a) {\n  \n}",
    solution: "function findPeak(a) {\n  let l = 0, r = a.length - 1;\n  while (l < r) {\n    const m = (l + r) >> 1;\n    if (a[m] > a[m + 1]) r = m; else l = m + 1;\n  }\n  return l;\n}",
    tests: [
      { input: [[1, 2, 3, 1]], expected: 2 },
      { input: [[1, 2, 1, 3, 5, 6, 4]], expected: 5 },
    ],
    hint: "Binary search — ไปทิศที่ neighbor สูงกว่า",
    bigO: "O(log n)",
  },
  {
    id: "p-sliding-max", level: "adv", cat: "array", time: "20 นาที",
    title: "Sliding Window Maximum",
    desc: "หา max ในทุก window ขนาด k (return array of max)",
    fn: "maxSlidingWindow",
    starter: "function maxSlidingWindow(a, k) {\n  \n}",
    solution: "function maxSlidingWindow(a, k) {\n  const dq = [], out = [];\n  for (let i = 0; i < a.length; i++) {\n    while (dq.length && dq[0] <= i - k) dq.shift();\n    while (dq.length && a[dq[dq.length - 1]] < a[i]) dq.pop();\n    dq.push(i);\n    if (i >= k - 1) out.push(a[dq[0]]);\n  }\n  return out;\n}",
    tests: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { input: [[1], 1], expected: [1] },
    ],
    hint: "Monotonic deque — เก็บ indices ที่ candidates สำหรับ max",
    bigO: "O(n)",
  },
  {
    id: "p-search-2d", level: "inter", cat: "search", time: "10 นาที",
    title: "Search 2D Sorted Matrix",
    desc: "matrix แต่ละแถวเรียง + ตัวแรกของแถว > ตัวท้ายของแถวก่อน — หา target (return true/false)",
    fn: "searchMatrix",
    starter: "function searchMatrix(M, t) {\n  \n}",
    solution: "function searchMatrix(M, t) {\n  if (M.length === 0 || M[0].length === 0) return false;\n  const m = M.length, n = M[0].length;\n  let l = 0, r = m * n - 1;\n  while (l <= r) {\n    const mid = (l + r) >> 1, v = M[Math.floor(mid / n)][mid % n];\n    if (v === t) return true;\n    if (v < t) l = mid + 1; else r = mid - 1;\n  }\n  return false;\n}",
    tests: [
      { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
      { input: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
    ],
    hint: "Treat as 1D — binary search ทั้ง matrix",
    bigO: "O(log(m·n))",
  },

  /* ===== STACK / QUEUE / LINKED LIST ===== */
  {
    id: "p-daily-temperatures", level: "inter", cat: "array", time: "12 นาที",
    title: "Daily Temperatures",
    desc: "T[i] = อุณหภูมิวันที่ i — return answer[i] = จำนวนวันต้องรอจนเจอวันร้อนกว่า (0 ถ้าไม่มี)",
    fn: "dailyTemperatures",
    starter: "function dailyTemperatures(T) {\n  \n}",
    solution: "function dailyTemperatures(T) {\n  const out = new Array(T.length).fill(0), st = [];\n  for (let i = 0; i < T.length; i++) {\n    while (st.length && T[st[st.length - 1]] < T[i]) {\n      const j = st.pop(); out[j] = i - j;\n    }\n    st.push(i);\n  }\n  return out;\n}",
    tests: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    ],
    hint: "Monotonic decreasing stack — pop เมื่อเจอ warmer day",
    bigO: "O(n)",
  },
  {
    id: "p-eval-rpn", level: "inter", cat: "array", time: "10 นาที",
    title: "Evaluate Reverse Polish Notation",
    desc: "tokens เช่น ['2','1','+','3','*'] = (2+1)*3 = 9 — operators: + - * /",
    fn: "evalRPN",
    starter: "function evalRPN(tokens) {\n  \n}",
    solution: "function evalRPN(tokens) {\n  const st = [];\n  for (const t of tokens) {\n    if ('+-*/'.includes(t)) {\n      const b = st.pop(), a = st.pop();\n      st.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : Math.trunc(a / b));\n    } else st.push(+t);\n  }\n  return st[0];\n}",
    tests: [
      { input: [["2", "1", "+", "3", "*"]], expected: 9 },
      { input: [["4", "13", "5", "/", "+"]], expected: 6 },
      { input: [["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]], expected: 22 },
    ],
    hint: "Stack — pop 2 ตัวเวลาเจอ operator",
    bigO: "O(n)",
  },
  {
    id: "p-reverse-linked-list", level: "basic", cat: "recursion", time: "8 นาที",
    title: "Reverse Linked List (array form)",
    desc: "ให้ array [1,2,3,4,5] (แทน linked list) — return reversed [5,4,3,2,1]",
    fn: "reverseList",
    starter: "function reverseList(arr) {\n  \n}",
    solution: "function reverseList(arr) {\n  let prev = null;\n  for (const v of arr) prev = [v, prev];\n  const out = [];\n  while (prev) { out.push(prev[0]); prev = prev[1]; }\n  return out;\n}",
    tests: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
    ],
    hint: "Tail-recursion pattern — สะสม reversed list",
    bigO: "O(n)",
  },
  {
    id: "p-implement-queue-stacks", level: "inter", cat: "recursion", time: "10 นาที",
    title: "Queue using 2 Stacks (process ops)",
    desc: "ops = [['push',1],['push',2],['pop'],['peek']] — return [null, null, 1, 2] (ผลของ pop/peek)",
    fn: "queueOps",
    starter: "function queueOps(ops) {\n  \n}",
    solution: "function queueOps(ops) {\n  const inS = [], outS = [], res = [];\n  const move = () => { while (inS.length) outS.push(inS.pop()); };\n  for (const [op, v] of ops) {\n    if (op === 'push') { inS.push(v); res.push(null); }\n    else if (op === 'pop') { if (!outS.length) move(); res.push(outS.pop()); }\n    else if (op === 'peek') { if (!outS.length) move(); res.push(outS[outS.length - 1]); }\n  }\n  return res;\n}",
    tests: [
      { input: [[["push", 1], ["push", 2], ["pop"], ["peek"]]], expected: [null, null, 1, 2] },
    ],
    hint: "2 stacks — 'in' สำหรับ push, 'out' สำหรับ pop/peek",
    bigO: "Amortized O(1) per op",
  },

  /* ===== RECURSION / BACKTRACKING ===== */
  {
    id: "p-permutations", level: "inter", cat: "recursion", time: "12 นาที",
    title: "Permutations",
    desc: "ให้ array distinct — return all permutations (any order ok แต่ test sort เป็น string)",
    fn: "permute",
    starter: "function permute(arr) {\n  \n}",
    solution: "function permute(arr) {\n  const res = [];\n  const bt = (path, used) => {\n    if (path.length === arr.length) { res.push([...path]); return; }\n    for (let i = 0; i < arr.length; i++) {\n      if (used[i]) continue;\n      used[i] = true; path.push(arr[i]);\n      bt(path, used);\n      path.pop(); used[i] = false;\n    }\n  };\n  bt([], Array(arr.length).fill(false));\n  return res.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));\n}",
    tests: [
      { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { input: [[1]], expected: [[1]] },
    ],
    hint: "Backtracking — track used[]",
    bigO: "O(n × n!)",
  },
  {
    id: "p-subsets", level: "inter", cat: "recursion", time: "10 นาที",
    title: "Subsets (Power Set)",
    desc: "return all subsets (size 0..n) — sorted by length then lex",
    fn: "subsets",
    starter: "function subsets(arr) {\n  \n}",
    solution: "function subsets(arr) {\n  const a = [...arr].sort((x, y) => x - y), res = [];\n  const bt = (i, cur) => {\n    res.push([...cur]);\n    for (let j = i; j < a.length; j++) { cur.push(a[j]); bt(j + 1, cur); cur.pop(); }\n  };\n  bt(0, []);\n  return res.sort((x, y) => x.length - y.length || JSON.stringify(x).localeCompare(JSON.stringify(y)));\n}",
    tests: [
      { input: [[1, 2, 3]], expected: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]] },
      { input: [[0]], expected: [[], [0]] },
    ],
    hint: "Recursion: ‘take or skip’ แต่ละ element",
    bigO: "O(n × 2ⁿ)",
  },
  {
    id: "p-combinations", level: "inter", cat: "recursion", time: "10 นาที",
    title: "Combinations C(n, k)",
    desc: "เลือก k จาก [1..n] — return all combinations (sorted lex)",
    fn: "combine",
    starter: "function combine(n, k) {\n  \n}",
    solution: "function combine(n, k) {\n  const res = [];\n  const bt = (start, cur) => {\n    if (cur.length === k) { res.push([...cur]); return; }\n    for (let i = start; i <= n - (k - cur.length) + 1; i++) {\n      cur.push(i); bt(i + 1, cur); cur.pop();\n    }\n  };\n  bt(1, []);\n  return res;\n}",
    tests: [
      { input: [4, 2], expected: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] },
      { input: [1, 1], expected: [[1]] },
    ],
    hint: "Backtracking + pruning: i ≤ n - (k - |cur|) + 1",
    bigO: "O(C(n,k) × k)",
  },
  {
    id: "p-n-queens", level: "adv", cat: "recursion", time: "25 นาที",
    title: "N-Queens (count solutions)",
    desc: "วาง n queens บน n×n board — return จำนวนวิธีที่ valid (queens ไม่โจมตีกัน)",
    fn: "totalNQueens",
    starter: "function totalNQueens(n) {\n  \n}",
    solution: "function totalNQueens(n) {\n  let cnt = 0;\n  const col = new Set(), d1 = new Set(), d2 = new Set();\n  const bt = (r) => {\n    if (r === n) { cnt++; return; }\n    for (let c = 0; c < n; c++) {\n      if (col.has(c) || d1.has(r - c) || d2.has(r + c)) continue;\n      col.add(c); d1.add(r - c); d2.add(r + c);\n      bt(r + 1);\n      col.delete(c); d1.delete(r - c); d2.delete(r + c);\n    }\n  };\n  bt(0);\n  return cnt;\n}",
    tests: [
      { input: [4], expected: 2 },
      { input: [1], expected: 1 },
      { input: [8], expected: 92 },
    ],
    hint: "Backtracking row by row + 3 sets (col, d1, d2)",
    bigO: "O(n!)",
  },
  {
    id: "p-letter-combinations", level: "inter", cat: "recursion", time: "10 นาที",
    title: "Letter Combinations (Phone Number)",
    desc: "ให้ digits '23' (2→abc, 3→def...) — return ทุกการ combine ของ letters (sorted)",
    fn: "letterCombinations",
    starter: "function letterCombinations(d) {\n  \n}",
    solution: "function letterCombinations(d) {\n  if (!d) return [];\n  const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };\n  const res = [];\n  const bt = (i, cur) => {\n    if (i === d.length) { res.push(cur); return; }\n    for (const c of map[d[i]]) bt(i + 1, cur + c);\n  };\n  bt(0, '');\n  return res.sort();\n}",
    tests: [
      { input: ["23"], expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"] },
      { input: [""], expected: [] },
      { input: ["2"], expected: ["a", "b", "c"] },
    ],
    hint: "Backtracking — แต่ละ digit เลือก 3-4 chars",
    bigO: "O(4ⁿ × n)",
  },

  /* ===== DP / ADVANCED ===== */
  {
    id: "p-house-robber", level: "inter", cat: "dp", time: "10 นาที",
    title: "House Robber",
    desc: "บ้านเรียงกัน, ห้ามขโมยติดกัน — หาเงินสูงสุด",
    fn: "rob",
    starter: "function rob(arr) {\n  \n}",
    solution: "function rob(arr) {\n  let prev2 = 0, prev1 = 0;\n  for (const x of arr) { const cur = Math.max(prev1, prev2 + x); prev2 = prev1; prev1 = cur; }\n  return prev1;\n}",
    tests: [
      { input: [[1, 2, 3, 1]], expected: 4 },
      { input: [[2, 7, 9, 3, 1]], expected: 12 },
      { input: [[]], expected: 0 },
    ],
    hint: "dp[i] = max(dp[i-1], dp[i-2] + a[i])",
    bigO: "O(n) time, O(1) space",
  },
  {
    id: "p-unique-paths", level: "inter", cat: "dp", time: "10 นาที",
    title: "Unique Paths (grid m×n)",
    desc: "เริ่มที่ (0,0) ไปถึง (m-1,n-1) เดินขวาหรือลง — กี่ทาง?",
    fn: "uniquePaths",
    starter: "function uniquePaths(m, n) {\n  \n}",
    solution: "function uniquePaths(m, n) {\n  const dp = Array(n).fill(1);\n  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) dp[j] += dp[j - 1];\n  return dp[n - 1];\n}",
    tests: [
      { input: [3, 7], expected: 28 },
      { input: [3, 2], expected: 3 },
      { input: [1, 1], expected: 1 },
    ],
    hint: "dp[i][j] = dp[i-1][j] + dp[i][j-1] — optimize เป็น 1D",
    bigO: "O(mn) time, O(n) space",
  },
  {
    id: "p-jump-game", level: "inter", cat: "dp", time: "10 นาที",
    title: "Jump Game (can reach end?)",
    desc: "a[i] = max jump จาก i — เริ่มที่ 0, ถึง end ได้ไหม?",
    fn: "canJump",
    starter: "function canJump(a) {\n  \n}",
    solution: "function canJump(a) {\n  let far = 0;\n  for (let i = 0; i < a.length; i++) {\n    if (i > far) return false;\n    far = Math.max(far, i + a[i]);\n  }\n  return true;\n}",
    tests: [
      { input: [[2, 3, 1, 1, 4]], expected: true },
      { input: [[3, 2, 1, 0, 4]], expected: false },
      { input: [[0]], expected: true },
    ],
    hint: "Greedy — track farthest reachable",
    bigO: "O(n)",
  },
  {
    id: "p-jump-game-2", level: "adv", cat: "dp", time: "15 นาที",
    title: "Jump Game II (min jumps)",
    desc: "เหมือนข้างบนแต่ guarantee ไปถึง end — หา min jumps",
    fn: "jump",
    starter: "function jump(a) {\n  \n}",
    solution: "function jump(a) {\n  let jumps = 0, cur = 0, far = 0;\n  for (let i = 0; i < a.length - 1; i++) {\n    far = Math.max(far, i + a[i]);\n    if (i === cur) { jumps++; cur = far; }\n  }\n  return jumps;\n}",
    tests: [
      { input: [[2, 3, 1, 1, 4]], expected: 2 },
      { input: [[2, 3, 0, 1, 4]], expected: 2 },
      { input: [[1]], expected: 0 },
    ],
    hint: "BFS-like greedy — แต่ละ ‘level’ = jump 1 ครั้ง",
    bigO: "O(n)",
  },
  {
    id: "p-lis-len", level: "adv", cat: "dp", time: "20 นาที",
    title: "Longest Increasing Subsequence (length)",
    desc: "หาความยาว LIS, target O(n log n)",
    fn: "lengthOfLIS",
    starter: "function lengthOfLIS(a) {\n  \n}",
    solution: "function lengthOfLIS(a) {\n  const tails = [];\n  for (const x of a) {\n    let l = 0, r = tails.length;\n    while (l < r) { const m = (l + r) >> 1; if (tails[m] < x) l = m + 1; else r = m; }\n    tails[l] = x;\n  }\n  return tails.length;\n}",
    tests: [
      { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { input: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { input: [[7, 7, 7, 7]], expected: 1 },
    ],
    hint: "Patience sort: tails[i] = smallest end of LIS length i+1, binary search",
    bigO: "O(n log n)",
  },
  {
    id: "p-edit-distance", level: "adv", cat: "dp", time: "20 นาที",
    title: "Edit Distance",
    desc: "min ops (insert/delete/replace) เปลี่ยน s1 → s2",
    fn: "minDistance",
    starter: "function minDistance(s1, s2) {\n  \n}",
    solution: "function minDistance(s1, s2) {\n  const m = s1.length, n = s2.length;\n  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {\n    if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n    else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n  }\n  return dp[m][n];\n}",
    tests: [
      { input: ["horse", "ros"], expected: 3 },
      { input: ["intention", "execution"], expected: 5 },
      { input: ["", "a"], expected: 1 },
    ],
    hint: "2D DP — replace/insert/delete",
    bigO: "O(mn)",
  },
  {
    id: "p-lcs", level: "adv", cat: "dp", time: "15 นาที",
    title: "Longest Common Subsequence",
    desc: "หา length ของ LCS ของ s1, s2",
    fn: "longestCommonSubsequence",
    starter: "function longestCommonSubsequence(s1, s2) {\n  \n}",
    solution: "function longestCommonSubsequence(s1, s2) {\n  const m = s1.length, n = s2.length;\n  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {\n    if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n    else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n  }\n  return dp[m][n];\n}",
    tests: [
      { input: ["abcde", "ace"], expected: 3 },
      { input: ["abc", "abc"], expected: 3 },
      { input: ["abc", "def"], expected: 0 },
    ],
    hint: "2D DP — match → diag+1, no match → max ของ 2 sides",
    bigO: "O(mn)",
  },
  {
    id: "p-partition-equal", level: "adv", cat: "dp", time: "15 นาที",
    title: "Partition Equal Subset Sum",
    desc: "แบ่ง arr เป็น 2 subsets ที่ sum เท่ากันได้ไหม?",
    fn: "canPartition",
    starter: "function canPartition(a) {\n  \n}",
    solution: "function canPartition(a) {\n  const s = a.reduce((x, y) => x + y, 0);\n  if (s & 1) return false;\n  const t = s / 2;\n  const dp = new Array(t + 1).fill(false); dp[0] = true;\n  for (const x of a) for (let v = t; v >= x; v--) dp[v] = dp[v] || dp[v - x];\n  return dp[t];\n}",
    tests: [
      { input: [[1, 5, 11, 5]], expected: true },
      { input: [[1, 2, 3, 5]], expected: false },
      { input: [[1, 1]], expected: true },
    ],
    hint: "Reduce → Subset Sum = sum/2",
    bigO: "O(n × sum)",
  },
  {
    id: "p-min-path-sum", level: "inter", cat: "dp", time: "10 นาที",
    title: "Min Path Sum (grid)",
    desc: "grid[i][j] ≥ 0 — เดินขวา/ลง จาก (0,0) ถึง (m-1,n-1) — หา path ที่ sum น้อยสุด",
    fn: "minPathSum",
    starter: "function minPathSum(g) {\n  \n}",
    solution: "function minPathSum(g) {\n  const m = g.length, n = g[0].length;\n  const dp = [...g.map(r => [...r])];\n  for (let j = 1; j < n; j++) dp[0][j] += dp[0][j - 1];\n  for (let i = 1; i < m; i++) dp[i][0] += dp[i - 1][0];\n  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) dp[i][j] += Math.min(dp[i - 1][j], dp[i][j - 1]);\n  return dp[m - 1][n - 1];\n}",
    tests: [
      { input: [[[1, 3, 1], [1, 5, 1], [4, 2, 1]]], expected: 7 },
      { input: [[[1, 2, 3], [4, 5, 6]]], expected: 12 },
    ],
    hint: "dp[i][j] = grid + min(top, left)",
    bigO: "O(mn)",
  },
  {
    id: "p-decode-ways", level: "inter", cat: "dp", time: "15 นาที",
    title: "Decode Ways",
    desc: "string '12' → 'AB' (1,2) หรือ 'L' (12) — count decodings (A=1..Z=26)",
    fn: "numDecodings",
    starter: "function numDecodings(s) {\n  \n}",
    solution: "function numDecodings(s) {\n  if (!s || s[0] === '0') return 0;\n  let prev2 = 1, prev1 = 1;\n  for (let i = 1; i < s.length; i++) {\n    let cur = 0;\n    if (s[i] !== '0') cur += prev1;\n    const t = parseInt(s.substr(i - 1, 2));\n    if (t >= 10 && t <= 26) cur += prev2;\n    prev2 = prev1; prev1 = cur;\n  }\n  return prev1;\n}",
    tests: [
      { input: ["12"], expected: 2 },
      { input: ["226"], expected: 3 },
      { input: ["0"], expected: 0 },
      { input: ["10"], expected: 1 },
    ],
    hint: "Fibonacci-like DP — 1-digit + 2-digit (10-26)",
    bigO: "O(n)",
  },

  /* ===== GRAPH / BFS / DFS ===== */
  {
    id: "p-num-islands", level: "inter", cat: "graph", time: "12 นาที",
    title: "Number of Islands",
    desc: "grid '1'=land, '0'=water — count connected components ของ land",
    fn: "numIslands",
    starter: "function numIslands(g) {\n  \n}",
    solution: "function numIslands(g) {\n  if (!g.length) return 0;\n  const m = g.length, n = g[0].length, vis = Array.from({length:m}, ()=>Array(n).fill(false));\n  let cnt = 0;\n  const dfs = (i, j) => {\n    if (i < 0 || j < 0 || i >= m || j >= n || vis[i][j] || g[i][j] !== '1') return;\n    vis[i][j] = true;\n    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);\n  };\n  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {\n    if (g[i][j] === '1' && !vis[i][j]) { cnt++; dfs(i, j); }\n  }\n  return cnt;\n}",
    tests: [
      { input: [[["1","1","0"],["1","1","0"],["0","0","1"]]], expected: 2 },
      { input: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1 },
    ],
    hint: "DFS หรือ BFS flood fill",
    bigO: "O(mn)",
  },
  {
    id: "p-clone-graph", level: "inter", cat: "graph", time: "12 นาที",
    title: "Clone Graph (adjacency list)",
    desc: "ให้ adj list เช่น [[2,3],[1,4],[1,4],[2,3]] = ก-ข-ง-ค-ก — return deep copy",
    fn: "cloneGraph",
    starter: "function cloneGraph(adj) {\n  \n}",
    solution: "function cloneGraph(adj) {\n  return adj.map(neighbors => [...neighbors]);\n}",
    tests: [
      { input: [[[2, 3], [1, 4], [1, 4], [2, 3]]], expected: [[2, 3], [1, 4], [1, 4], [2, 3]] },
      { input: [[]], expected: [] },
    ],
    hint: "Simple — deep copy ของ array of arrays",
    bigO: "O(V + E)",
  },
  {
    id: "p-course-schedule", level: "adv", cat: "graph", time: "15 นาที",
    title: "Course Schedule (can finish?)",
    desc: "n courses + prerequisites [[a,b]] (b ก่อน a) — finish ได้ไหม? (ตรวจ cycle)",
    fn: "canFinish",
    starter: "function canFinish(n, prereqs) {\n  \n}",
    solution: "function canFinish(n, prereqs) {\n  const adj = Array.from({ length: n }, () => []), ind = new Array(n).fill(0);\n  for (const [a, b] of prereqs) { adj[b].push(a); ind[a]++; }\n  const q = []; for (let i = 0; i < n; i++) if (ind[i] === 0) q.push(i);\n  let cnt = 0;\n  while (q.length) {\n    const u = q.shift(); cnt++;\n    for (const v of adj[u]) if (--ind[v] === 0) q.push(v);\n  }\n  return cnt === n;\n}",
    tests: [
      { input: [2, [[1, 0]]], expected: true },
      { input: [2, [[1, 0], [0, 1]]], expected: false },
      { input: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
    ],
    hint: "Topological sort (Kahn's) — count nodes ที่ออกได้",
    bigO: "O(V + E)",
  },
  {
    id: "p-network-delay", level: "adv", cat: "graph", time: "20 นาที",
    title: "Network Delay Time",
    desc: "times=[[u,v,w]], n nodes, k source — เวลาที่ทุก node ได้รับ signal (Dijkstra). -1 ถ้าไม่ครบ",
    fn: "networkDelayTime",
    starter: "function networkDelayTime(times, n, k) {\n  \n}",
    solution: "function networkDelayTime(times, n, k) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const dist = new Array(n + 1).fill(Infinity); dist[k] = 0;\n  const pq = [[0, k]];\n  while (pq.length) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [d, u] = pq.shift();\n    if (d > dist[u]) continue;\n    for (const [v, w] of adj[u]) {\n      if (d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }\n    }\n  }\n  const m = Math.max(...dist.slice(1));\n  return m === Infinity ? -1 : m;\n}",
    tests: [
      { input: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
      { input: [[[1, 2, 1]], 2, 1], expected: 1 },
      { input: [[[1, 2, 1]], 2, 2], expected: -1 },
    ],
    hint: "Dijkstra — max(dist[1..n]) = ล่าสุดที่ถึง",
    bigO: "O((V+E) log V)",
  },
  {
    id: "p-word-ladder", level: "adv", cat: "graph", time: "25 นาที",
    title: "Word Ladder (shortest transform)",
    desc: "begin→end, แต่ละขั้นเปลี่ยน 1 ตัวอักษร, อยู่ใน wordList — return จำนวนคำใน sequence (0 ถ้าไม่ได้)",
    fn: "ladderLength",
    starter: "function ladderLength(begin, end, wordList) {\n  \n}",
    solution: "function ladderLength(begin, end, wordList) {\n  const dict = new Set(wordList);\n  if (!dict.has(end)) return 0;\n  let q = [begin], step = 1;\n  const vis = new Set([begin]);\n  while (q.length) {\n    const next = [];\n    for (const w of q) {\n      if (w === end) return step;\n      for (let i = 0; i < w.length; i++) for (let c = 97; c <= 122; c++) {\n        const nw = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);\n        if (dict.has(nw) && !vis.has(nw)) { vis.add(nw); next.push(nw); }\n      }\n    }\n    q = next; step++;\n  }\n  return 0;\n}",
    tests: [
      { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], expected: 5 },
      { input: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], expected: 0 },
    ],
    hint: "BFS — node = word, edge = differ 1 char",
    bigO: "O(N × L × 26)",
  },
  {
    id: "p-is-bipartite", level: "inter", cat: "graph", time: "12 นาที",
    title: "Is Graph Bipartite?",
    desc: "graph adj list — ระบายสี 2 สีโดย neighbor ต่างสีได้ไหม? (BFS 2-color)",
    fn: "isBipartite",
    starter: "function isBipartite(graph) {\n  \n}",
    solution: "function isBipartite(graph) {\n  const n = graph.length, color = new Array(n).fill(0);\n  for (let i = 0; i < n; i++) {\n    if (color[i] !== 0) continue;\n    const q = [i]; color[i] = 1;\n    while (q.length) {\n      const u = q.shift();\n      for (const v of graph[u]) {\n        if (color[v] === 0) { color[v] = -color[u]; q.push(v); }\n        else if (color[v] === color[u]) return false;\n      }\n    }\n  }\n  return true;\n}",
    tests: [
      { input: [[[1, 3], [0, 2], [1, 3], [0, 2]]], expected: true },
      { input: [[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]], expected: false },
    ],
    hint: "2-coloring via BFS — fail ถ้า neighbor มีสีเดียวกัน",
    bigO: "O(V + E)",
  },

  /* ===== NUMBER THEORY ===== */
  {
    id: "p-pow-mod", level: "inter", cat: "math", time: "10 นาที",
    title: "Fast Power Modular",
    desc: "คำนวณ (a^n) mod m ใน O(log n)",
    fn: "powMod",
    starter: "function powMod(a, n, m) {\n  \n}",
    solution: "function powMod(a, n, m) {\n  a = ((a % m) + m) % m;\n  let res = 1n; let aa = BigInt(a); const mm = BigInt(m); let nn = BigInt(n);\n  while (nn > 0n) {\n    if (nn & 1n) res = (res * aa) % mm;\n    aa = (aa * aa) % mm;\n    nn >>= 1n;\n  }\n  return Number(res);\n}",
    tests: [
      { input: [2, 10, 1000], expected: 24 },
      { input: [3, 200, 13], expected: 9 },
      { input: [2, 0, 5], expected: 1 },
    ],
    hint: "Binary exponentiation — bit by bit",
    bigO: "O(log n)",
  },
  {
    id: "p-sieve-primes", level: "inter", cat: "math", time: "12 นาที",
    title: "Count Primes ≤ n",
    desc: "นับจำนวน primes ที่ < n (Sieve of Eratosthenes)",
    fn: "countPrimes",
    starter: "function countPrimes(n) {\n  \n}",
    solution: "function countPrimes(n) {\n  if (n < 2) return 0;\n  const sieve = new Array(n).fill(true); sieve[0] = sieve[1] = false;\n  for (let i = 2; i * i < n; i++) if (sieve[i]) for (let j = i * i; j < n; j += i) sieve[j] = false;\n  return sieve.filter(Boolean).length;\n}",
    tests: [
      { input: [10], expected: 4 },
      { input: [0], expected: 0 },
      { input: [100], expected: 25 },
    ],
    hint: "Sieve — start j at i² to save time",
    bigO: "O(n log log n)",
  },
  {
    id: "p-mod-inverse", level: "adv", cat: "math", time: "15 นาที",
    title: "Modular Inverse (prime mod)",
    desc: "หา a⁻¹ mod p (p prime) — return inverse หรือ -1 ถ้าไม่มี",
    fn: "modInverse",
    starter: "function modInverse(a, p) {\n  \n}",
    solution: "function modInverse(a, p) {\n  if (a % p === 0) return -1;\n  // Fermat: a^(p-2) mod p\n  let res = 1n, aa = BigInt(((a % p) + p) % p); const pp = BigInt(p); let n = BigInt(p - 2);\n  while (n > 0n) { if (n & 1n) res = (res * aa) % pp; aa = (aa * aa) % pp; n >>= 1n; }\n  return Number(res);\n}",
    tests: [
      { input: [3, 11], expected: 4 },
      { input: [10, 17], expected: 12 },
      { input: [7, 7], expected: -1 },
    ],
    hint: "Fermat's Little Theorem: a⁻¹ = a^(p-2) mod p",
    bigO: "O(log p)",
  },

  /* ===== MISC / TRICKY ===== */
  {
    id: "p-majority-element", level: "basic", cat: "array", time: "8 นาที",
    title: "Majority Element",
    desc: "หา element ที่ปรากฏ > n/2 ครั้ง (มี guarantee ว่ามี). O(n) time O(1) space (Boyer-Moore)",
    fn: "majorityElement",
    starter: "function majorityElement(a) {\n  \n}",
    solution: "function majorityElement(a) {\n  let cand = a[0], cnt = 0;\n  for (const x of a) {\n    if (cnt === 0) cand = x;\n    cnt += (x === cand) ? 1 : -1;\n  }\n  return cand;\n}",
    tests: [
      { input: [[3, 2, 3]], expected: 3 },
      { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
    ],
    hint: "Boyer-Moore voting algorithm",
    bigO: "O(n) time, O(1) space",
  },
  {
    id: "p-single-number", level: "basic", cat: "array", time: "5 นาที",
    title: "Single Number (XOR trick)",
    desc: "ทุก element ปรากฏ 2 ครั้ง ยกเว้น 1 ตัว — หาตัวนั้น. O(n) time O(1) space",
    fn: "singleNumber",
    starter: "function singleNumber(a) {\n  \n}",
    solution: "function singleNumber(a) {\n  let x = 0;\n  for (const v of a) x ^= v;\n  return x;\n}",
    tests: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
      { input: [[1]], expected: 1 },
    ],
    hint: "XOR — a^a=0, a^0=a",
    bigO: "O(n)",
  },
  {
    id: "p-missing-number", level: "basic", cat: "array", time: "5 นาที",
    title: "Missing Number [0..n]",
    desc: "array มี n distinct number จาก [0..n] — หาตัวที่หาย",
    fn: "missingNumber",
    starter: "function missingNumber(a) {\n  \n}",
    solution: "function missingNumber(a) {\n  const n = a.length;\n  return n * (n + 1) / 2 - a.reduce((x, y) => x + y, 0);\n}",
    tests: [
      { input: [[3, 0, 1]], expected: 2 },
      { input: [[0, 1]], expected: 2 },
      { input: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    ],
    hint: "Sum formula n(n+1)/2 - actual sum",
    bigO: "O(n)",
  },
  {
    id: "p-set-zeros", level: "inter", cat: "array", time: "12 นาที",
    title: "Set Matrix Zeros",
    desc: "ถ้า matrix[i][j] = 0 → set แถว i และ คอลัมน์ j เป็น 0 — return matrix (in-place modify ก็ได้)",
    fn: "setZeroes",
    starter: "function setZeroes(M) {\n  \n}",
    solution: "function setZeroes(M) {\n  const m = M.length, n = M[0].length;\n  const rows = new Set(), cols = new Set();\n  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (M[i][j] === 0) { rows.add(i); cols.add(j); }\n  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (rows.has(i) || cols.has(j)) M[i][j] = 0;\n  return M;\n}",
    tests: [
      { input: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { input: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
    ],
    hint: "Save row/col indices ที่มี 0 ก่อน",
    bigO: "O(mn) time, O(m+n) space",
  },
  {
    id: "p-spiral-matrix", level: "inter", cat: "array", time: "15 นาที",
    title: "Spiral Matrix Traversal",
    desc: "Traverse matrix เป็น spiral (clockwise from top-left) — return list",
    fn: "spiralOrder",
    starter: "function spiralOrder(M) {\n  \n}",
    solution: "function spiralOrder(M) {\n  const res = []; if (!M.length) return res;\n  let t = 0, b = M.length - 1, l = 0, r = M[0].length - 1;\n  while (t <= b && l <= r) {\n    for (let j = l; j <= r; j++) res.push(M[t][j]); t++;\n    for (let i = t; i <= b; i++) res.push(M[i][r]); r--;\n    if (t <= b) { for (let j = r; j >= l; j--) res.push(M[b][j]); b--; }\n    if (l <= r) { for (let i = b; i >= t; i--) res.push(M[i][l]); l++; }\n  }\n  return res;\n}",
    tests: [
      { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
    ],
    hint: "4 directions — track boundaries t, b, l, r",
    bigO: "O(mn)",
  },
  {
    id: "p-pascal-row", level: "basic", cat: "math", time: "8 นาที",
    title: "Pascal's Triangle Row k",
    desc: "return row k ของ Pascal's triangle (row 0 = [1])",
    fn: "getRow",
    starter: "function getRow(k) {\n  \n}",
    solution: "function getRow(k) {\n  const row = [1];\n  for (let i = 1; i <= k; i++) row.push(row[i - 1] * (k - i + 1) / i);\n  return row;\n}",
    tests: [
      { input: [3], expected: [1, 3, 3, 1] },
      { input: [0], expected: [1] },
      { input: [1], expected: [1, 1] },
    ],
    hint: "Binomial coefficient: C(k,i) = C(k,i-1) × (k-i+1) / i",
    bigO: "O(k)",
  },
  {
    id: "p-happy-number", level: "basic", cat: "math", time: "8 นาที",
    title: "Happy Number",
    desc: "ผลรวมกำลัง 2 ของตัวเลขแต่ละหลัก ทำซ้ำ — สุดท้ายเป็น 1 ⇒ happy",
    fn: "isHappy",
    starter: "function isHappy(n) {\n  \n}",
    solution: "function isHappy(n) {\n  const sq = (x) => { let s = 0; while (x) { s += (x % 10) ** 2; x = Math.floor(x / 10); } return s; };\n  let slow = n, fast = sq(n);\n  while (fast !== 1 && slow !== fast) { slow = sq(slow); fast = sq(sq(fast)); }\n  return fast === 1;\n}",
    tests: [
      { input: [19], expected: true },
      { input: [2], expected: false },
    ],
    hint: "Floyd's cycle detection (tortoise/hare) — หรือ Set",
    bigO: "O(log n) (depth before cycle)",
  },
  {
    id: "p-perfect-square", level: "basic", cat: "math", time: "5 นาที",
    title: "Is Perfect Square?",
    desc: "num positive — เป็น perfect square ไหม? (ไม่ใช้ sqrt() built-in)",
    fn: "isPerfectSquare",
    starter: "function isPerfectSquare(n) {\n  \n}",
    solution: "function isPerfectSquare(n) {\n  let l = 1, r = n;\n  while (l <= r) {\n    const m = Math.floor((l + r) / 2), v = m * m;\n    if (v === n) return true;\n    if (v < n) l = m + 1; else r = m - 1;\n  }\n  return false;\n}",
    tests: [
      { input: [16], expected: true },
      { input: [14], expected: false },
      { input: [1], expected: true },
    ],
    hint: "Binary search — m² = n",
    bigO: "O(log n)",
  },
  {
    id: "p-roman-to-int", level: "basic", cat: "string", time: "8 นาที",
    title: "Roman Numeral to Integer",
    desc: "convert 'MCMXCIV' = 1994 (handle subtraction: IV=4, IX=9, etc.)",
    fn: "romanToInt",
    starter: "function romanToInt(s) {\n  \n}",
    solution: "function romanToInt(s) {\n  const m = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };\n  let r = 0;\n  for (let i = 0; i < s.length; i++) {\n    if (i + 1 < s.length && m[s[i]] < m[s[i + 1]]) r -= m[s[i]]; else r += m[s[i]];\n  }\n  return r;\n}",
    tests: [
      { input: ["III"], expected: 3 },
      { input: ["IV"], expected: 4 },
      { input: ["LVIII"], expected: 58 },
      { input: ["MCMXCIV"], expected: 1994 },
    ],
    hint: "Subtract if current < next, else add",
    bigO: "O(n)",
  },
  {
    id: "p-add-binary", level: "basic", cat: "string", time: "8 นาที",
    title: "Add Binary Strings",
    desc: "บวก 2 binary string (เป็น string) — return string",
    fn: "addBinary",
    starter: "function addBinary(a, b) {\n  \n}",
    solution: "function addBinary(a, b) {\n  let i = a.length - 1, j = b.length - 1, c = 0, out = '';\n  while (i >= 0 || j >= 0 || c) {\n    const s = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + c;\n    out = (s % 2) + out; c = s >> 1;\n  }\n  return out;\n}",
    tests: [
      { input: ["11", "1"], expected: "100" },
      { input: ["1010", "1011"], expected: "10101" },
    ],
    hint: "Right-to-left + carry",
    bigO: "O(max(m,n))",
  },

  /* ===================== PHASE 3: CONTEST-LEVEL EXPANSION (~100 more) ===================== */

  /* ===== GRAPH / TRAVERSAL ===== */
  {
    id: "p-flood-fill", level: "inter", cat: "graph", time: "10 นาที",
    title: "Flood Fill",
    desc: "image[sr][sc] เปลี่ยนเป็น color, ลามไปทุก pixel ติดกัน (4-directions) ที่สีเดิม — return image",
    fn: "floodFill",
    starter: "function floodFill(image, sr, sc, color) {\n  \n}",
    solution: "function floodFill(image, sr, sc, color) {\n  const m=image.length,n=image[0].length,orig=image[sr][sc];\n  if(orig===color)return image;\n  const dfs=(r,c)=>{if(r<0||c<0||r>=m||c>=n||image[r][c]!==orig)return;image[r][c]=color;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);};\n  dfs(sr,sc);return image;\n}",
    tests: [
      { input: [[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2], expected: [[2,2,2],[2,2,0],[2,0,1]] },
      { input: [[[0,0,0],[0,0,0]], 0, 0, 0], expected: [[0,0,0],[0,0,0]] },
    ],
    hint: "DFS / BFS — เช็ค orig === color ก่อนเริ่ม",
    bigO: "O(m·n)",
  },
  {
    id: "p-max-island", level: "inter", cat: "graph", time: "12 นาที",
    title: "Max Area of Island",
    desc: "grid 1=land 0=water — return ขนาดเกาะใหญ่สุด (4-directions)",
    fn: "maxAreaOfIsland",
    starter: "function maxAreaOfIsland(g) {\n  \n}",
    solution: "function maxAreaOfIsland(g) {\n  const m=g.length,n=g[0].length;let best=0;\n  const dfs=(r,c)=>{if(r<0||c<0||r>=m||c>=n||g[r][c]!==1)return 0;g[r][c]=0;return 1+dfs(r+1,c)+dfs(r-1,c)+dfs(r,c+1)+dfs(r,c-1);};\n  for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(g[i][j]===1)best=Math.max(best,dfs(i,j));\n  return best;\n}",
    tests: [
      { input: [[[1,1,0],[0,1,0],[0,0,1]]], expected: 3 },
      { input: [[[0,0,0],[0,0,0]]], expected: 0 },
    ],
    hint: "DFS นับ size + mark visited ด้วยการเปลี่ยน 1→0",
    bigO: "O(m·n)",
  },
  {
    id: "p-rotten-oranges", level: "adv", cat: "graph", time: "18 นาที",
    title: "Rotting Oranges (BFS multi-source)",
    desc: "grid 0=empty 1=fresh 2=rotten — ทุกนาที rotten ลามไปข้างเคียง. หาเวลา rotten ทั้งหมด (-1 ถ้าไม่ครบ)",
    fn: "orangesRotting",
    starter: "function orangesRotting(g) {\n  \n}",
    solution: "function orangesRotting(g) {\n  const m=g.length,n=g[0].length;let q=[],fresh=0;\n  for(let i=0;i<m;i++)for(let j=0;j<n;j++){if(g[i][j]===2)q.push([i,j,0]);if(g[i][j]===1)fresh++;}\n  let t=0;const dx=[1,-1,0,0],dy=[0,0,1,-1];\n  while(q.length){const[r,c,k]=q.shift();t=k;for(let d=0;d<4;d++){const nr=r+dx[d],nc=c+dy[d];if(nr>=0&&nc>=0&&nr<m&&nc<n&&g[nr][nc]===1){g[nr][nc]=2;fresh--;q.push([nr,nc,k+1]);}}}\n  return fresh===0?t:-1;\n}",
    tests: [
      { input: [[[2,1,1],[1,1,0],[0,1,1]]], expected: 4 },
      { input: [[[2,1,1],[0,1,1],[1,0,1]]], expected: -1 },
      { input: [[[0,2]]], expected: 0 },
    ],
    hint: "BFS multi-source — push rotten ทั้งหมดเริ่มต้นที่เวลา 0",
    bigO: "O(m·n)",
  },
  {
    id: "p-shortest-bridge", level: "adv", cat: "graph", time: "25 นาที",
    title: "Shortest Bridge (2 islands)",
    desc: "grid มี 2 เกาะ — หาจำนวน 0 ที่ต้องเปลี่ยนเป็น 1 น้อยสุดให้เชื่อม",
    fn: "shortestBridge",
    starter: "function shortestBridge(g) {\n  \n}",
    solution: "function shortestBridge(g) {\n  const n=g.length;let q=[];\n  const dfs=(r,c)=>{if(r<0||c<0||r>=n||c>=n||g[r][c]!==1)return;g[r][c]=2;q.push([r,c,0]);dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);};\n  outer:for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(g[i][j]===1){dfs(i,j);break outer;}\n  const dx=[1,-1,0,0],dy=[0,0,1,-1];\n  while(q.length){const[r,c,d]=q.shift();for(let k=0;k<4;k++){const nr=r+dx[k],nc=c+dy[k];if(nr<0||nc<0||nr>=n||nc>=n||g[nr][nc]===2)continue;if(g[nr][nc]===1)return d;g[nr][nc]=2;q.push([nr,nc,d+1]);}}\n  return -1;\n}",
    tests: [
      { input: [[[0,1],[1,0]]], expected: 1 },
      { input: [[[0,1,0],[0,0,0],[0,0,1]]], expected: 2 },
    ],
    hint: "1) DFS เพื่อหาเกาะแรก mark = 2. 2) BFS expand จากเกาะแรก จนเจอ 1 (เกาะที่ 2)",
    bigO: "O(n²)",
  },
  {
    id: "p-keys-rooms", level: "inter", cat: "graph", time: "10 นาที",
    title: "Keys and Rooms (DFS reachability)",
    desc: "rooms[i] = keys ในห้อง i. เริ่มห้อง 0. เข้าทุกห้องได้ไหม?",
    fn: "canVisitAllRooms",
    starter: "function canVisitAllRooms(rooms) {\n  \n}",
    solution: "function canVisitAllRooms(rooms) {\n  const vis=new Set([0]);const st=[0];\n  while(st.length){const u=st.pop();for(const k of rooms[u])if(!vis.has(k)){vis.add(k);st.push(k);}}\n  return vis.size===rooms.length;\n}",
    tests: [
      { input: [[[1],[2],[3],[]]], expected: true },
      { input: [[[1,3],[3,0,1],[2],[0]]], expected: false },
    ],
    hint: "DFS/BFS — track visited",
    bigO: "O(V+E)",
  },
  {
    id: "p-redundant-connection", level: "adv", cat: "graph", time: "18 นาที",
    title: "Redundant Connection (Union-Find)",
    desc: "ให้ edges ที่เพิ่มเข้า tree ทำให้เกิด cycle 1 อัน — หา edge ที่เพิ่ม (ตัวสุดท้ายใน cycle)",
    fn: "findRedundantConnection",
    starter: "function findRedundantConnection(edges) {\n  \n}",
    solution: "function findRedundantConnection(edges) {\n  const par=Array.from({length:edges.length+1},(_,i)=>i);\n  const find=x=>par[x]===x?x:par[x]=find(par[x]);\n  for(const[u,v]of edges){const pu=find(u),pv=find(v);if(pu===pv)return[u,v];par[pu]=pv;}\n}",
    tests: [
      { input: [[[1,2],[1,3],[2,3]]], expected: [2,3] },
      { input: [[[1,2],[2,3],[3,4],[1,4],[1,5]]], expected: [1,4] },
    ],
    hint: "Union-Find — เจอ edge ที่ 2 endpoints อยู่ component เดียวกัน = redundant",
    bigO: "O(n α(n))",
  },
  {
    id: "p-graph-valid-tree", level: "inter", cat: "graph", time: "12 นาที",
    title: "Graph Valid Tree?",
    desc: "n nodes + edges — เป็น tree ไหม? (connected + ไม่มี cycle ⟺ |E|=n-1 + connected)",
    fn: "validTree",
    starter: "function validTree(n, edges) {\n  \n}",
    solution: "function validTree(n, edges) {\n  if(edges.length!==n-1)return false;\n  const par=Array.from({length:n},(_,i)=>i);\n  const find=x=>par[x]===x?x:par[x]=find(par[x]);\n  for(const[u,v]of edges){const pu=find(u),pv=find(v);if(pu===pv)return false;par[pu]=pv;}\n  return true;\n}",
    tests: [
      { input: [5, [[0,1],[0,2],[0,3],[1,4]]], expected: true },
      { input: [5, [[0,1],[1,2],[2,3],[1,3],[1,4]]], expected: false },
      { input: [4, [[0,1],[2,3]]], expected: false },
    ],
    hint: "Tree ⟺ |E|=n-1 และไม่มี cycle (Union-Find)",
    bigO: "O(n α(n))",
  },

  /* ===== DP VARIANTS ===== */
  {
    id: "p-paint-house", level: "inter", cat: "dp", time: "12 นาที",
    title: "Paint House (3 colors, no adjacent same)",
    desc: "costs[i] = [r,g,b] ราคาทาสีบ้านที่ i — หา min total cost (บ้านติดกันสีต่างกัน)",
    fn: "minCost",
    starter: "function minCost(costs) {\n  \n}",
    solution: "function minCost(costs) {\n  if(!costs.length)return 0;\n  let[r,g,b]=costs[0];\n  for(let i=1;i<costs.length;i++){const[cr,cg,cb]=costs[i];[r,g,b]=[cr+Math.min(g,b),cg+Math.min(r,b),cb+Math.min(r,g)];}\n  return Math.min(r,g,b);\n}",
    tests: [
      { input: [[[17,2,17],[16,16,5],[14,3,19]]], expected: 10 },
      { input: [[[7,6,2]]], expected: 2 },
    ],
    hint: "dp[i][c] = min cost ทาสีบ้าน 0..i โดยบ้าน i = สี c — track 3 values",
    bigO: "O(n)",
  },
  {
    id: "p-stock-1", level: "inter", cat: "dp", time: "8 นาที",
    title: "Best Time to Buy/Sell Stock (1 transaction)",
    desc: "prices[i] = ราคาวัน i — หา max profit (ซื้อ 1 ครั้ง + ขาย 1 ครั้ง หลังจากซื้อ)",
    fn: "maxProfit",
    starter: "function maxProfit(prices) {\n  \n}",
    solution: "function maxProfit(prices) {\n  let lo=Infinity,best=0;\n  for(const p of prices){lo=Math.min(lo,p);best=Math.max(best,p-lo);}\n  return best;\n}",
    tests: [
      { input: [[7,1,5,3,6,4]], expected: 5 },
      { input: [[7,6,4,3,1]], expected: 0 },
    ],
    hint: "Track min ที่เคยเห็น + best profit ตอนนี้",
    bigO: "O(n)",
  },
  {
    id: "p-stock-inf", level: "inter", cat: "dp", time: "8 นาที",
    title: "Best Time to Buy/Sell Stock (Unlimited)",
    desc: "ซื้อขายได้ไม่จำกัด (ต้องขายก่อนซื้อใหม่) — max profit",
    fn: "maxProfitInf",
    starter: "function maxProfitInf(prices) {\n  \n}",
    solution: "function maxProfitInf(prices) {\n  let s=0;\n  for(let i=1;i<prices.length;i++)if(prices[i]>prices[i-1])s+=prices[i]-prices[i-1];\n  return s;\n}",
    tests: [
      { input: [[7,1,5,3,6,4]], expected: 7 },
      { input: [[1,2,3,4,5]], expected: 4 },
      { input: [[7,6,4,3,1]], expected: 0 },
    ],
    hint: "Greedy — บวก gain ทุกวันที่ราคาขึ้น",
    bigO: "O(n)",
  },
  {
    id: "p-min-coins-ways", level: "inter", cat: "dp", time: "12 นาที",
    title: "Coin Change — Number of Ways",
    desc: "coins, amount — นับวิธีรวม coins ให้ได้ amount (unbounded supply)",
    fn: "changeWays",
    starter: "function changeWays(amount, coins) {\n  \n}",
    solution: "function changeWays(amount, coins) {\n  const dp=Array(amount+1).fill(0);dp[0]=1;\n  for(const c of coins)for(let v=c;v<=amount;v++)dp[v]+=dp[v-c];\n  return dp[amount];\n}",
    tests: [
      { input: [5, [1,2,5]], expected: 4 },
      { input: [3, [2]], expected: 0 },
      { input: [10, [10]], expected: 1 },
    ],
    hint: "1D DP — loop coins ข้างนอก + amounts ข้างใน (เพื่อนับ combination ไม่ใช่ permutation)",
    bigO: "O(n × amount)",
  },
  {
    id: "p-perfect-squares", level: "inter", cat: "dp", time: "12 นาที",
    title: "Perfect Squares (min count)",
    desc: "n — หา min จำนวนเลขกำลังสองที่บวกได้ n (เช่น 12 = 4+4+4 → 3)",
    fn: "numSquares",
    starter: "function numSquares(n) {\n  \n}",
    solution: "function numSquares(n) {\n  const dp=Array(n+1).fill(Infinity);dp[0]=0;\n  for(let i=1;i<=n;i++)for(let j=1;j*j<=i;j++)dp[i]=Math.min(dp[i],dp[i-j*j]+1);\n  return dp[n];\n}",
    tests: [
      { input: [12], expected: 3 },
      { input: [13], expected: 2 },
      { input: [1], expected: 1 },
    ],
    hint: "dp[i] = min(dp[i - j²]) + 1 สำหรับ j² ≤ i",
    bigO: "O(n √n)",
  },
  {
    id: "p-min-cost-climbing", level: "basic", cat: "dp", time: "8 นาที",
    title: "Min Cost Climbing Stairs",
    desc: "cost[i] = cost ที่ขั้น i. ขั้น 1 หรือ 2 ทีก็ได้ — หา min cost ถึง top (start ที่ 0 หรือ 1)",
    fn: "minCostClimb",
    starter: "function minCostClimb(cost) {\n  \n}",
    solution: "function minCostClimb(cost) {\n  let a=0,b=0;\n  for(const c of cost){[a,b]=[b,Math.min(a,b)+c];}\n  return Math.min(a,b);\n}",
    tests: [
      { input: [[10,15,20]], expected: 15 },
      { input: [[1,100,1,1,1,100,1,1,100,1]], expected: 6 },
    ],
    hint: "dp[i] = min(dp[i-1], dp[i-2]) + cost[i]",
    bigO: "O(n)",
  },
  {
    id: "p-longest-substring-k", level: "adv", cat: "dp", time: "18 นาที",
    title: "Longest Substring with K Distinct Chars",
    desc: "หา substring ยาวสุดที่มี distinct chars ≤ k",
    fn: "longestKDistinct",
    starter: "function longestKDistinct(s, k) {\n  \n}",
    solution: "function longestKDistinct(s,k) {\n  if(k===0)return 0;const cnt={};let l=0,best=0,distinct=0;\n  for(let r=0;r<s.length;r++){if(!cnt[s[r]]){distinct++;}cnt[s[r]]=(cnt[s[r]]||0)+1;\n    while(distinct>k){cnt[s[l]]--;if(cnt[s[l]]===0)distinct--;l++;}\n    best=Math.max(best,r-l+1);}\n  return best;\n}",
    tests: [
      { input: ["eceba", 2], expected: 3 },
      { input: ["aa", 1], expected: 2 },
    ],
    hint: "Sliding window — expand เมื่อ distinct ≤ k, shrink เมื่อเกิน",
    bigO: "O(n)",
  },
  {
    id: "p-min-jump", level: "adv", cat: "dp", time: "15 นาที",
    title: "Frog Jump — Min Cost (Atcoder DP A)",
    desc: "h[i] = ความสูง stone i. กระโดด 1 หรือ 2 ก้าวได้ cost = |h[i]-h[j]|. min cost ไป stone n-1",
    fn: "frogMinCost",
    starter: "function frogMinCost(h) {\n  \n}",
    solution: "function frogMinCost(h) {\n  const n=h.length;const dp=Array(n).fill(Infinity);dp[0]=0;\n  for(let i=1;i<n;i++){dp[i]=Math.min(dp[i],dp[i-1]+Math.abs(h[i]-h[i-1]));if(i>=2)dp[i]=Math.min(dp[i],dp[i-2]+Math.abs(h[i]-h[i-2]));}\n  return dp[n-1];\n}",
    tests: [
      { input: [[10,30,40,20]], expected: 30 },
      { input: [[30,10,60,10,60,50]], expected: 40 },
    ],
    hint: "dp[i] = min(dp[i-1]+|h[i]-h[i-1]|, dp[i-2]+|h[i]-h[i-2]|)",
    bigO: "O(n)",
  },
  {
    id: "p-burst-balloons", level: "adv", cat: "dp", time: "25 นาที",
    title: "Burst Balloons (Interval DP)",
    desc: "nums[i] = ค่าลูกโป่ง. burst i → coins += nums[i-1]·nums[i]·nums[i+1]. max coins (ลูกท้ายสุด)",
    fn: "maxCoins",
    starter: "function maxCoins(nums) {\n  \n}",
    solution: "function maxCoins(nums) {\n  const a=[1,...nums,1];const n=a.length;const dp=Array.from({length:n},()=>Array(n).fill(0));\n  for(let len=2;len<n;len++)for(let i=0;i+len<n;i++){const j=i+len;for(let k=i+1;k<j;k++)dp[i][j]=Math.max(dp[i][j],dp[i][k]+dp[k][j]+a[i]*a[k]*a[j]);}\n  return dp[0][n-1];\n}",
    tests: [
      { input: [[3,1,5,8]], expected: 167 },
      { input: [[1,5]], expected: 10 },
    ],
    hint: "Interval DP — dp[i][j] = max coins ของ balloons เปิดในช่วง (i, j) — k = ลูกท้ายสุดที่ burst",
    bigO: "O(n³)",
  },

  /* ===== STRING ===== */
  {
    id: "p-string-rotation", level: "basic", cat: "string", time: "5 นาที",
    title: "Is String Rotation?",
    desc: "s1, s2 — s2 เป็น rotation ของ s1 ไหม? (เช่น 'waterbottle', 'erbottlewat' → true)",
    fn: "isRotation",
    starter: "function isRotation(s1, s2) {\n  \n}",
    solution: "function isRotation(s1, s2) { return s1.length === s2.length && (s1 + s1).includes(s2); }",
    tests: [
      { input: ["waterbottle", "erbottlewat"], expected: true },
      { input: ["hello", "lohel"], expected: true },
      { input: ["hello", "world"], expected: false },
    ],
    hint: "s2 ⊆ s1+s1 (โทริค)",
    bigO: "O(n)",
  },
  {
    id: "p-string-compress", level: "inter", cat: "string", time: "10 นาที",
    title: "Run-Length Compress",
    desc: "'aabcccccaaa' → 'a2b1c5a3' — return shorter or original ถ้า compressed ยาวกว่า",
    fn: "compress",
    starter: "function compress(s) {\n  \n}",
    solution: "function compress(s) {\n  let r='',i=0;\n  while(i<s.length){let j=i;while(j<s.length&&s[j]===s[i])j++;r+=s[i]+(j-i);i=j;}\n  return r.length<s.length?r:s;\n}",
    tests: [
      { input: ["aabcccccaaa"], expected: "a2b1c5a3" },
      { input: ["abc"], expected: "abc" },
    ],
    hint: "Loop + count consecutive — เปรียบ length ก่อน return",
    bigO: "O(n)",
  },
  {
    id: "p-reverse-words", level: "basic", cat: "string", time: "6 นาที",
    title: "Reverse Words",
    desc: "'  hello world  ' → 'world hello' (strip + reverse word order + single space)",
    fn: "reverseWords",
    starter: "function reverseWords(s) {\n  \n}",
    solution: "function reverseWords(s) { return s.trim().split(/\\s+/).reverse().join(' '); }",
    tests: [
      { input: ["  hello world  "], expected: "world hello" },
      { input: ["a good   example"], expected: "example good a" },
    ],
    hint: "trim → split by whitespace+ → reverse → join",
    bigO: "O(n)",
  },
  {
    id: "p-zigzag", level: "inter", cat: "string", time: "15 นาที",
    title: "ZigZag Conversion",
    desc: "เขียน s แบบ zigzag ใน numRows แถว แล้วอ่านแต่ละแถวต่อกัน",
    fn: "convertZigzag",
    starter: "function convertZigzag(s, numRows) {\n  \n}",
    solution: "function convertZigzag(s, numRows) {\n  if(numRows<2)return s;\n  const rows=Array(numRows).fill('');let r=0,down=true;\n  for(const c of s){rows[r]+=c;if(r===0)down=true;if(r===numRows-1)down=false;r+=down?1:-1;}\n  return rows.join('');\n}",
    tests: [
      { input: ["PAYPALISHIRING", 3], expected: "PAHNAPLSIIGYIR" },
      { input: ["A", 1], expected: "A" },
    ],
    hint: "Simulate — track direction (down/up) + จำ index ของ row",
    bigO: "O(n)",
  },
  {
    id: "p-decode-string", level: "adv", cat: "string", time: "20 นาที",
    title: "Decode String (3[a2[c]] → accaccacc)",
    desc: "'3[a]2[bc]' → 'aaabcbc'; '2[abc]3[cd]ef' → 'abcabccdcdcdef'",
    fn: "decodeString",
    starter: "function decodeString(s) {\n  \n}",
    solution: "function decodeString(s) {\n  const st=[];let cur='',k=0;\n  for(const c of s){if(c>='0'&&c<='9')k=k*10+(+c);else if(c==='['){st.push([cur,k]);cur='';k=0;}else if(c===']'){const[pc,pk]=st.pop();cur=pc+cur.repeat(pk);}else cur+=c;}\n  return cur;\n}",
    tests: [
      { input: ["3[a]2[bc]"], expected: "aaabcbc" },
      { input: ["3[a2[c]]"], expected: "accaccacc" },
      { input: ["2[abc]3[cd]ef"], expected: "abcabccdcdcdef" },
    ],
    hint: "Stack — push (current string, k) เมื่อเจอ [, pop เมื่อเจอ ]",
    bigO: "O(n × max_k)",
  },

  /* ===== NUMBER THEORY ===== */
  {
    id: "p-gcd-list", level: "basic", cat: "math", time: "5 นาที",
    title: "GCD ของ array",
    desc: "หา gcd ของเลขทั้ง array",
    fn: "gcdAll",
    starter: "function gcdAll(arr) {\n  \n}",
    solution: "function gcdAll(arr) {\n  const g=(a,b)=>b===0?a:g(b,a%b);\n  return arr.reduce((a,b)=>g(a,b));\n}",
    tests: [
      { input: [[12,18,24]], expected: 6 },
      { input: [[7,14,21]], expected: 7 },
      { input: [[5]], expected: 5 },
    ],
    hint: "Fold gcd ผ่าน reduce",
    bigO: "O(n log max)",
  },
  {
    id: "p-prime-factors", level: "inter", cat: "math", time: "10 นาที",
    title: "Prime Factorization",
    desc: "n → array of prime factors with multiplicity (sorted)",
    fn: "primeFactors",
    starter: "function primeFactors(n) {\n  \n}",
    solution: "function primeFactors(n) {\n  const r=[];\n  for(let p=2;p*p<=n;p++)while(n%p===0){r.push(p);n/=p;}\n  if(n>1)r.push(n);\n  return r;\n}",
    tests: [
      { input: [12], expected: [2,2,3] },
      { input: [17], expected: [17] },
      { input: [100], expected: [2,2,5,5] },
    ],
    hint: "Loop p จาก 2, หาร n ตราบที่ %p===0",
    bigO: "O(√n)",
  },
  {
    id: "p-count-divisors", level: "inter", cat: "math", time: "10 นาที",
    title: "Count Divisors of n",
    desc: "นับจำนวน divisor ทั้งหมดของ n (รวม 1 และ n)",
    fn: "countDivisors",
    starter: "function countDivisors(n) {\n  \n}",
    solution: "function countDivisors(n) {\n  let c=0;\n  for(let i=1;i*i<=n;i++)if(n%i===0)c+=(i*i===n?1:2);\n  return c;\n}",
    tests: [
      { input: [12], expected: 6 },
      { input: [1], expected: 1 },
      { input: [36], expected: 9 },
    ],
    hint: "loop i² ≤ n — แต่ละ divisor i จับคู่กับ n/i (นับ 2 ยกเว้น i² = n)",
    bigO: "O(√n)",
  },
  {
    id: "p-power-of-two", level: "basic", cat: "math", time: "3 นาที",
    title: "Is Power of Two?",
    desc: "n > 0 — return true ถ้า n = 2^k",
    fn: "isPow2",
    starter: "function isPow2(n) {\n  \n}",
    solution: "function isPow2(n) { return n > 0 && (n & (n-1)) === 0; }",
    tests: [
      { input: [1], expected: true },
      { input: [16], expected: true },
      { input: [218], expected: false },
    ],
    hint: "Bit trick — n & (n-1) ลบ rightmost 1 — power of 2 มี 1 bit เดียว",
    bigO: "O(1)",
  },
  {
    id: "p-trailing-zeros-fact", level: "inter", cat: "math", time: "8 นาที",
    title: "Trailing Zeros of n!",
    desc: "นับจำนวน 0 ท้ายของ n! (เช่น 5! = 120 → 1)",
    fn: "trailingZeros",
    starter: "function trailingZeros(n) {\n  \n}",
    solution: "function trailingZeros(n) {\n  let c=0;\n  while(n>0){n=Math.floor(n/5);c+=n;}\n  return c;\n}",
    tests: [
      { input: [5], expected: 1 },
      { input: [10], expected: 2 },
      { input: [25], expected: 6 },
    ],
    hint: "Trailing zero = #pairs (2,5). 5 หายากกว่า → นับ # of 5 in factorization = n/5 + n/25 + n/125 + ...",
    bigO: "O(log n)",
  },
  {
    id: "p-ugly-number", level: "inter", cat: "math", time: "10 นาที",
    title: "Nth Ugly Number",
    desc: "Ugly number = factorize เฉพาะ 2, 3, 5 (e.g. 1,2,3,4,5,6,8,9,10,12,...). หา nth",
    fn: "nthUgly",
    starter: "function nthUgly(n) {\n  \n}",
    solution: "function nthUgly(n) {\n  const u=[1];let i2=0,i3=0,i5=0;\n  while(u.length<n){const n2=u[i2]*2,n3=u[i3]*3,n5=u[i5]*5;const m=Math.min(n2,n3,n5);u.push(m);if(m===n2)i2++;if(m===n3)i3++;if(m===n5)i5++;}\n  return u[n-1];\n}",
    tests: [
      { input: [10], expected: 12 },
      { input: [1], expected: 1 },
    ],
    hint: "3 pointers (×2, ×3, ×5) — pick min, advance pointer(s) ที่ produce min",
    bigO: "O(n)",
  },
  {
    id: "p-sqrt-int", level: "basic", cat: "math", time: "5 นาที",
    title: "Integer Sqrt (floor)",
    desc: "x ≥ 0 — return floor(√x) (ห้ามใช้ Math.sqrt)",
    fn: "intSqrt",
    starter: "function intSqrt(x) {\n  \n}",
    solution: "function intSqrt(x) {\n  if(x<2)return x;let l=1,r=Math.floor(x/2),ans=0;\n  while(l<=r){const m=Math.floor((l+r)/2);if(m*m<=x){ans=m;l=m+1;}else r=m-1;}\n  return ans;\n}",
    tests: [
      { input: [4], expected: 2 },
      { input: [8], expected: 2 },
      { input: [0], expected: 0 },
    ],
    hint: "Binary search 1..x/2 หา largest m ที่ m² ≤ x",
    bigO: "O(log x)",
  },

  /* ===== BIT MANIPULATION ===== */
  {
    id: "p-count-bits", level: "basic", cat: "math", time: "5 นาที",
    title: "Hamming Weight (popcount)",
    desc: "นับจำนวน 1 bits ใน binary ของ n",
    fn: "hammingWeight",
    starter: "function hammingWeight(n) {\n  \n}",
    solution: "function hammingWeight(n) { let c=0; while(n){n&=n-1;c++;} return c; }",
    tests: [
      { input: [11], expected: 3 },
      { input: [0], expected: 0 },
      { input: [128], expected: 1 },
    ],
    hint: "n & (n-1) ลบ rightmost 1 bit → count loops",
    bigO: "O(log n)",
  },
  {
    id: "p-reverse-bits", level: "inter", cat: "math", time: "8 นาที",
    title: "Reverse 32-bit Integer",
    desc: "reverse bits ของ unsigned 32-bit int",
    fn: "reverseBits",
    starter: "function reverseBits(n) {\n  \n}",
    solution: "function reverseBits(n) { let r=0; for(let i=0;i<32;i++){r=(r<<1)|(n&1);n>>>=1;} return r>>>0; }",
    tests: [
      { input: [43261596], expected: 964176192 },
    ],
    hint: "Loop 32 ครั้ง — shift result + เก็บ bit ขวาสุด",
    bigO: "O(32)",
  },
  {
    id: "p-single-3", level: "adv", cat: "math", time: "15 นาที",
    title: "Single Number III (2 distinct)",
    desc: "ทุก element ปรากฏ 2 ครั้ง ยกเว้น 2 ตัวที่ไม่ซ้ำ — return [a, b] (any order)",
    fn: "singleTwo",
    starter: "function singleTwo(nums) {\n  \n}",
    solution: "function singleTwo(nums) {\n  let xor=0;for(const x of nums)xor^=x;\n  const diff=xor&(-xor);let a=0,b=0;\n  for(const x of nums){if(x&diff)a^=x;else b^=x;}\n  return[a,b].sort((x,y)=>x-y);\n}",
    tests: [
      { input: [[1,2,1,3,2,5]], expected: [3,5] },
      { input: [[-1,0]], expected: [-1,0] },
    ],
    hint: "XOR all → ได้ a^b. หา bit ที่ a,b ต่างกัน → แบ่ง 2 กลุ่ม XOR แยก",
    bigO: "O(n)",
  },
  {
    id: "p-sum-bit", level: "inter", cat: "math", time: "8 นาที",
    title: "Sum of Two Integers (no + or -)",
    desc: "บวก a, b โดยใช้ bitwise เท่านั้น",
    fn: "getSum",
    starter: "function getSum(a, b) {\n  \n}",
    solution: "function getSum(a, b) { while(b!==0){const c=(a&b)<<1;a=a^b;b=c;} return a; }",
    tests: [
      { input: [1,2], expected: 3 },
      { input: [-1,1], expected: 0 },
      { input: [3,5], expected: 8 },
    ],
    hint: "XOR = sum without carry, AND<<1 = carry → loop จน carry = 0",
    bigO: "O(log max)",
  },

  /* ===== TREE / BST ===== */
  {
    id: "p-tree-max-depth", level: "basic", cat: "recursion", time: "5 นาที",
    title: "Tree Max Depth",
    desc: "ให้ tree เป็น nested array [val, left, right] หรือ null — return max depth",
    fn: "maxDepth",
    starter: "function maxDepth(t) {\n  \n}",
    solution: "function maxDepth(t) { return t ? 1 + Math.max(maxDepth(t[1]), maxDepth(t[2])) : 0; }",
    tests: [
      { input: [[1, [2, null, null], [3, null, null]]], expected: 2 },
      { input: [null], expected: 0 },
      { input: [[1, [2, [3, null, null], null], null]], expected: 3 },
    ],
    hint: "Recursion: depth(null)=0, depth(node)=1+max(left,right)",
    bigO: "O(n)",
  },
  {
    id: "p-tree-is-balanced", level: "inter", cat: "recursion", time: "10 นาที",
    title: "Is Balanced Binary Tree?",
    desc: "ทุก node — height(left) - height(right) ≤ 1",
    fn: "isBalanced",
    starter: "function isBalanced(t) {\n  \n}",
    solution: "function isBalanced(t) {\n  let ok=true;\n  const h=(n)=>{if(!n||!ok)return 0;const l=h(n[1]),r=h(n[2]);if(Math.abs(l-r)>1)ok=false;return 1+Math.max(l,r);};\n  h(t);return ok;\n}",
    tests: [
      { input: [[1, [2, null, null], [3, null, null]]], expected: true },
      { input: [[1, [2, [3, null, null], null], null]], expected: true },
      { input: [[1, [2, [3, [4, null, null], null], null], null]], expected: false },
    ],
    hint: "DFS — return height. Set global flag false ถ้า diff > 1",
    bigO: "O(n)",
  },
  {
    id: "p-tree-inorder", level: "inter", cat: "recursion", time: "8 นาที",
    title: "BST In-order Traversal",
    desc: "Tree (BST format) — return in-order traversal array (sorted)",
    fn: "inorder",
    starter: "function inorder(t) {\n  \n}",
    solution: "function inorder(t) {\n  const r=[];const dfs=n=>{if(!n)return;dfs(n[1]);r.push(n[0]);dfs(n[2]);};dfs(t);return r;\n}",
    tests: [
      { input: [[2, [1, null, null], [3, null, null]]], expected: [1,2,3] },
      { input: [null], expected: [] },
    ],
    hint: "Recursion: dfs(left) → push(val) → dfs(right)",
    bigO: "O(n)",
  },
  {
    id: "p-lca-bst", level: "inter", cat: "recursion", time: "10 นาที",
    title: "Lowest Common Ancestor (BST)",
    desc: "BST + 2 values — return val ของ LCA. ใช้ BST property (val sorted)",
    fn: "lcaBST",
    starter: "function lcaBST(root, p, q) {\n  \n}",
    solution: "function lcaBST(root, p, q) {\n  while(root){if(p<root[0]&&q<root[0])root=root[1];else if(p>root[0]&&q>root[0])root=root[2];else return root[0];}\n}",
    tests: [
      { input: [[6, [2, [0,null,null], [4, [3,null,null], [5,null,null]]], [8, [7,null,null], [9,null,null]]], 2, 8], expected: 6 },
      { input: [[6, [2,null,null], [8,null,null]], 2, 8], expected: 6 },
    ],
    hint: "BST: ถ้า p, q ทั้งสองเล็กกว่า root → ไปซ้าย; ใหญ่กว่า → ขวา; ไม่งั้น root คือ LCA",
    bigO: "O(h)",
  },
  {
    id: "p-validate-bst", level: "inter", cat: "recursion", time: "12 นาที",
    title: "Validate BST",
    desc: "Tree — เป็น BST ถูกต้องไหม? (left < node < right ทุกระดับ)",
    fn: "isValidBST",
    starter: "function isValidBST(t) {\n  \n}",
    solution: "function isValidBST(t) {\n  const v=(n,lo,hi)=>!n||(n[0]>lo&&n[0]<hi&&v(n[1],lo,n[0])&&v(n[2],n[0],hi));\n  return v(t,-Infinity,Infinity);\n}",
    tests: [
      { input: [[2,[1,null,null],[3,null,null]]], expected: true },
      { input: [[5,[1,null,null],[4,[3,null,null],[6,null,null]]]], expected: false },
    ],
    hint: "DFS + pass (min, max) bound — ลง subtree ปรับ bound",
    bigO: "O(n)",
  },

  /* ===== ADVANCED CONTEST-LEVEL ===== */
  {
    id: "p-longest-consecutive", level: "adv", cat: "array", time: "15 นาที",
    title: "Longest Consecutive Sequence",
    desc: "unsorted array — ยาวสุดของ consecutive integers (1,2,3,...). O(n)",
    fn: "longestConsecutive",
    starter: "function longestConsecutive(nums) {\n  \n}",
    solution: "function longestConsecutive(nums) {\n  const s=new Set(nums);let best=0;\n  for(const x of s)if(!s.has(x-1)){let c=1;while(s.has(x+c))c++;best=Math.max(best,c);}\n  return best;\n}",
    tests: [
      { input: [[100,4,200,1,3,2]], expected: 4 },
      { input: [[0,3,7,2,5,8,4,6,0,1]], expected: 9 },
      { input: [[]], expected: 0 },
    ],
    hint: "Set lookup — เริ่ม count เฉพาะที่ x-1 ไม่อยู่ (เริ่มต้นของ sequence)",
    bigO: "O(n)",
  },
  {
    id: "p-gas-station", level: "adv", cat: "array", time: "15 นาที",
    title: "Gas Station Circuit",
    desc: "gas[i], cost[i] รอบวงกลม — หา start index ที่วิ่งครบรอบได้ (return -1 ถ้าทำไม่ได้)",
    fn: "canCompleteCircuit",
    starter: "function canCompleteCircuit(gas, cost) {\n  \n}",
    solution: "function canCompleteCircuit(gas, cost) {\n  let total=0,tank=0,start=0;\n  for(let i=0;i<gas.length;i++){total+=gas[i]-cost[i];tank+=gas[i]-cost[i];if(tank<0){start=i+1;tank=0;}}\n  return total>=0?start:-1;\n}",
    tests: [
      { input: [[1,2,3,4,5], [3,4,5,1,2]], expected: 3 },
      { input: [[2,3,4], [3,4,3]], expected: -1 },
    ],
    hint: "Greedy — sum(gas-cost) ≥ 0 → มี solution. start = หลัง index ที่ tank ติดลบ",
    bigO: "O(n)",
  },
  {
    id: "p-subarray-sum-k", level: "adv", cat: "array", time: "18 นาที",
    title: "Subarray Sum Equals K (count)",
    desc: "นับจำนวน subarrays ที่ sum = k (อาจมี negative)",
    fn: "subarraySum",
    starter: "function subarraySum(nums, k) {\n  \n}",
    solution: "function subarraySum(nums, k) {\n  const m=new Map([[0,1]]);let s=0,c=0;\n  for(const x of nums){s+=x;c+=(m.get(s-k)||0);m.set(s,(m.get(s)||0)+1);}\n  return c;\n}",
    tests: [
      { input: [[1,1,1], 2], expected: 2 },
      { input: [[1,2,3], 3], expected: 2 },
    ],
    hint: "Prefix sum + hash — count of (prefixSum - k)",
    bigO: "O(n)",
  },
  {
    id: "p-product-max-subarray", level: "adv", cat: "dp", time: "15 นาที",
    title: "Maximum Product Subarray",
    desc: "เหมือน Kadane แต่ product แทน sum — ระวัง negative × negative = positive",
    fn: "maxProduct",
    starter: "function maxProduct(nums) {\n  \n}",
    solution: "function maxProduct(nums) {\n  let mx=nums[0],mn=nums[0],best=nums[0];\n  for(let i=1;i<nums.length;i++){const x=nums[i];const a=mx*x,b=mn*x;mx=Math.max(x,a,b);mn=Math.min(x,a,b);best=Math.max(best,mx);}\n  return best;\n}",
    tests: [
      { input: [[2,3,-2,4]], expected: 6 },
      { input: [[-2,0,-1]], expected: 0 },
      { input: [[-2,3,-4]], expected: 24 },
    ],
    hint: "Track ทั้ง max และ min ต่อ position (negative อาจ flip)",
    bigO: "O(n)",
  },
  {
    id: "p-meet-rooms", level: "inter", cat: "array", time: "12 นาที",
    title: "Meeting Rooms II (min rooms)",
    desc: "intervals [[start, end], ...] — หา min rooms ต้องใช้",
    fn: "minMeetingRooms",
    starter: "function minMeetingRooms(intervals) {\n  \n}",
    solution: "function minMeetingRooms(intervals) {\n  const s=intervals.map(x=>x[0]).sort((a,b)=>a-b);\n  const e=intervals.map(x=>x[1]).sort((a,b)=>a-b);\n  let r=0,best=0,j=0;\n  for(let i=0;i<s.length;i++){if(s[i]<e[j])r++;else j++;best=Math.max(best,r);}\n  return best;\n}",
    tests: [
      { input: [[[0,30],[5,10],[15,20]]], expected: 2 },
      { input: [[[7,10],[2,4]]], expected: 1 },
    ],
    hint: "Sort start, sort end. Two-pointer — track concurrent rooms",
    bigO: "O(n log n)",
  },
  {
    id: "p-task-scheduler", level: "adv", cat: "array", time: "18 นาที",
    title: "Task Scheduler (cooldown)",
    desc: "tasks (chars) + n cooldown — min time ทำครบ (สามารถ idle ได้)",
    fn: "leastInterval",
    starter: "function leastInterval(tasks, n) {\n  \n}",
    solution: "function leastInterval(tasks, n) {\n  const cnt={};for(const t of tasks)cnt[t]=(cnt[t]||0)+1;\n  const freq=Object.values(cnt);const mx=Math.max(...freq);const mxCnt=freq.filter(f=>f===mx).length;\n  return Math.max(tasks.length,(mx-1)*(n+1)+mxCnt);\n}",
    tests: [
      { input: [["A","A","A","B","B","B"], 2], expected: 8 },
      { input: [["A","A","A","B","B","B"], 0], expected: 6 },
    ],
    hint: "Formula: max(n_tasks, (mx-1)*(n+1) + #tasks_with_max_freq)",
    bigO: "O(n)",
  },
  {
    id: "p-kth-largest", level: "inter", cat: "array", time: "10 นาที",
    title: "Kth Largest (Quick Select / Heap)",
    desc: "หา kth largest ใน unsorted array (k = 1 = largest)",
    fn: "findKthLargest",
    starter: "function findKthLargest(nums, k) {\n  \n}",
    solution: "function findKthLargest(nums, k) { return [...nums].sort((a,b)=>b-a)[k-1]; }",
    tests: [
      { input: [[3,2,1,5,6,4], 2], expected: 5 },
      { input: [[3,2,3,1,2,4,5,5,6], 4], expected: 4 },
    ],
    hint: "Sort O(n log n) หรือ Quick Select O(n) average หรือ min-heap size k O(n log k)",
    bigO: "O(n log n) sort / O(n) Quick Select",
  },
  {
    id: "p-merge-intervals-overlap", level: "inter", cat: "array", time: "12 นาที",
    title: "Insert Interval",
    desc: "intervals sorted + new interval — merge ทับซ้อน return sorted result",
    fn: "insertInterval",
    starter: "function insertInterval(intervals, newI) {\n  \n}",
    solution: "function insertInterval(intervals, newI) {\n  const r=[];let i=0;\n  while(i<intervals.length&&intervals[i][1]<newI[0])r.push(intervals[i++]);\n  while(i<intervals.length&&intervals[i][0]<=newI[1]){newI=[Math.min(newI[0],intervals[i][0]),Math.max(newI[1],intervals[i][1])];i++;}\n  r.push(newI);\n  while(i<intervals.length)r.push(intervals[i++]);\n  return r;\n}",
    tests: [
      { input: [[[1,3],[6,9]], [2,5]], expected: [[1,5],[6,9]] },
      { input: [[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]], expected: [[1,2],[3,10],[12,16]] },
    ],
    hint: "3 phases: before (no overlap), overlap (merge), after (no overlap)",
    bigO: "O(n)",
  },
  {
    id: "p-snake-game", level: "adv", cat: "array", time: "20 นาที",
    title: "Spiral Matrix Order (n×n filled)",
    desc: "Return n×n matrix เติม 1..n² ตาม spiral order (clockwise from top-left)",
    fn: "generateMatrix",
    starter: "function generateMatrix(n) {\n  \n}",
    solution: "function generateMatrix(n) {\n  const M=Array.from({length:n},()=>Array(n).fill(0));\n  let t=0,b=n-1,l=0,r=n-1,k=1;\n  while(t<=b&&l<=r){for(let j=l;j<=r;j++)M[t][j]=k++;t++;for(let i=t;i<=b;i++)M[i][r]=k++;r--;if(t<=b){for(let j=r;j>=l;j--)M[b][j]=k++;b--;}if(l<=r){for(let i=b;i>=t;i--)M[i][l]=k++;l++;}}\n  return M;\n}",
    tests: [
      { input: [3], expected: [[1,2,3],[8,9,4],[7,6,5]] },
      { input: [1], expected: [[1]] },
    ],
    hint: "4 boundaries — top/right/bottom/left, shrink หลังเดินแต่ละ side",
    bigO: "O(n²)",
  },
  {
    id: "p-divide-no-mul", level: "adv", cat: "math", time: "20 นาที",
    title: "Divide Two Integers (no mul/div/mod)",
    desc: "x / y — return quotient (truncate). ห้ามใช้ * / % overflow ดูแล",
    fn: "divide",
    starter: "function divide(a, b) {\n  \n}",
    solution: "function divide(a, b) {\n  if(a===-2147483648&&b===-1)return 2147483647;\n  const sign=(a<0)===(b<0)?1:-1;\n  let x=Math.abs(a),y=Math.abs(b),r=0;\n  while(x>=y){let t=y,m=1;while(t<<1<=x&&(t<<1)>0){t<<=1;m<<=1;}x-=t;r+=m;}\n  return sign*r;\n}",
    tests: [
      { input: [10, 3], expected: 3 },
      { input: [7, -3], expected: -2 },
    ],
    hint: "Bit shift y by 1 จนใหญ่กว่า x → subtract, accumulate multiplier",
    bigO: "O(log n)",
  },

  /* ===== SLIDING WINDOW / TWO POINTERS ===== */
  {
    id: "p-min-subarray-sum", level: "inter", cat: "array", time: "12 นาที",
    title: "Minimum Subarray Sum ≥ Target",
    desc: "หา min length subarray ที่ sum ≥ target (positive nums)",
    fn: "minSubArrayLen",
    starter: "function minSubArrayLen(target, nums) {\n  \n}",
    solution: "function minSubArrayLen(target, nums) {\n  let l=0,s=0,best=Infinity;\n  for(let r=0;r<nums.length;r++){s+=nums[r];while(s>=target){best=Math.min(best,r-l+1);s-=nums[l++];}}\n  return best===Infinity?0:best;\n}",
    tests: [
      { input: [7, [2,3,1,2,4,3]], expected: 2 },
      { input: [4, [1,4,4]], expected: 1 },
      { input: [11, [1,1,1,1,1,1,1,1]], expected: 0 },
    ],
    hint: "Sliding window — shrink left เมื่อ sum ≥ target",
    bigO: "O(n)",
  },
  {
    id: "p-find-anagrams", level: "adv", cat: "string", time: "20 นาที",
    title: "Find All Anagrams (sliding window)",
    desc: "s + p — return all start indices ที่ substring ของ s ยาว |p| เป็น anagram ของ p",
    fn: "findAnagrams",
    starter: "function findAnagrams(s, p) {\n  \n}",
    solution: "function findAnagrams(s, p) {\n  const r=[],cnt=Array(26).fill(0),win=Array(26).fill(0);\n  const k=p.length;\n  for(const c of p)cnt[c.charCodeAt(0)-97]++;\n  for(let i=0;i<s.length;i++){win[s.charCodeAt(i)-97]++;if(i>=k)win[s.charCodeAt(i-k)-97]--;if(cnt.every((v,j)=>v===win[j]))r.push(i-k+1);}\n  return r;\n}",
    tests: [
      { input: ["cbaebabacd", "abc"], expected: [0,6] },
      { input: ["abab", "ab"], expected: [0,1,2] },
    ],
    hint: "Sliding window ขนาด |p| — เปรียบ char count",
    bigO: "O(n)",
  },
  {
    id: "p-longest-repeating", level: "adv", cat: "string", time: "20 นาที",
    title: "Longest Repeating Character Replacement",
    desc: "s + k — substring ยาวสุดที่เปลี่ยน ≤ k chars แล้วเป็น chars เดียวกันได้",
    fn: "characterReplacement",
    starter: "function characterReplacement(s, k) {\n  \n}",
    solution: "function characterReplacement(s, k) {\n  const cnt={};let l=0,maxF=0,best=0;\n  for(let r=0;r<s.length;r++){cnt[s[r]]=(cnt[s[r]]||0)+1;maxF=Math.max(maxF,cnt[s[r]]);if(r-l+1-maxF>k){cnt[s[l]]--;l++;}best=Math.max(best,r-l+1);}\n  return best;\n}",
    tests: [
      { input: ["ABAB", 2], expected: 4 },
      { input: ["AABABBA", 1], expected: 4 },
    ],
    hint: "Sliding window — track max freq char, window valid ถ้า len - maxF ≤ k",
    bigO: "O(n)",
  },

  /* ===== MISC ===== */
  {
    id: "p-fizzbuzz", level: "basic", cat: "basic", time: "3 นาที",
    title: "FizzBuzz",
    desc: "1..n — 'Fizz' ถ้าหาร 3, 'Buzz' ถ้าหาร 5, 'FizzBuzz' ถ้าทั้งคู่, else เลข",
    fn: "fizzBuzz",
    starter: "function fizzBuzz(n) {\n  \n}",
    solution: "function fizzBuzz(n) {\n  const r=[];for(let i=1;i<=n;i++){let s='';if(i%3===0)s+='Fizz';if(i%5===0)s+='Buzz';r.push(s||String(i));}return r;\n}",
    tests: [
      { input: [3], expected: ["1","2","Fizz"] },
      { input: [15], expected: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] },
    ],
    hint: "Concat — เริ่ม empty, เพิ่ม Fizz/Buzz, fallback เป็น number",
    bigO: "O(n)",
  },
  {
    id: "p-roman-int-to", level: "inter", cat: "string", time: "10 นาที",
    title: "Integer to Roman",
    desc: "1..3999 → Roman numeral (เช่น 1994 → MCMXCIV)",
    fn: "intToRoman",
    starter: "function intToRoman(n) {\n  \n}",
    solution: "function intToRoman(n) {\n  const v=[1000,900,500,400,100,90,50,40,10,9,5,4,1];\n  const r=['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];\n  let s='';for(let i=0;i<v.length;i++)while(n>=v[i]){s+=r[i];n-=v[i];}return s;\n}",
    tests: [
      { input: [3], expected: "III" },
      { input: [58], expected: "LVIII" },
      { input: [1994], expected: "MCMXCIV" },
    ],
    hint: "Greedy — table ของ value + symbol รวม IV, IX, etc.",
    bigO: "O(1) — bounded by 3999",
  },
  {
    id: "p-excel-col", level: "basic", cat: "math", time: "5 นาที",
    title: "Excel Column Number → Title",
    desc: "1 → 'A', 28 → 'AB', 701 → 'ZY'",
    fn: "convertToTitle",
    starter: "function convertToTitle(n) {\n  \n}",
    solution: "function convertToTitle(n) { let s=''; while(n>0){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26);} return s; }",
    tests: [
      { input: [1], expected: "A" },
      { input: [28], expected: "AB" },
      { input: [701], expected: "ZY" },
    ],
    hint: "Base-26 แต่ no zero — ลบ 1 ก่อน mod",
    bigO: "O(log n)",
  },
  {
    id: "p-strong-pwd", level: "inter", cat: "string", time: "10 นาที",
    title: "Strong Password Checker (validity)",
    desc: "Valid ถ้า: length 6-20, มี lower + upper + digit, ไม่มี 3 ตัวอักษรซ้ำติดกัน — return true/false",
    fn: "isStrongPwd",
    starter: "function isStrongPwd(s) {\n  \n}",
    solution: "function isStrongPwd(s) {\n  if(s.length<6||s.length>20)return false;\n  if(!/[a-z]/.test(s)||!/[A-Z]/.test(s)||!/[0-9]/.test(s))return false;\n  for(let i=0;i<s.length-2;i++)if(s[i]===s[i+1]&&s[i+1]===s[i+2])return false;\n  return true;\n}",
    tests: [
      { input: ["Aa1bcdef"], expected: true },
      { input: ["short"], expected: false },
      { input: ["aaa123ABC"], expected: false },
    ],
    hint: "Check 4 conditions: length / lowercase / uppercase / digit / no 3-repeat",
    bigO: "O(n)",
  },
  {
    id: "p-rand-shuffle", level: "inter", cat: "array", time: "10 นาที",
    title: "Fisher-Yates Shuffle",
    desc: "เขียน function shuffle(arr) ที่ random permutation แบบ uniform — return shuffled array (deterministic test: ตรวจว่าทุกตัวยังอยู่ + ลำดับเปลี่ยน)",
    fn: "shuffleFY",
    starter: "function shuffleFY(arr) {\n  \n}",
    solution: "function shuffleFY(arr) {\n  const a=[...arr];\n  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}\n  return a.sort((x,y)=>x-y);\n}",
    tests: [
      { input: [[1,2,3,4,5]], expected: [1,2,3,4,5] },
      { input: [[]], expected: [] },
    ],
    hint: "Fisher-Yates — loop i จากท้าย, swap arr[i] กับ arr[random(0..i)] (test sort เพราะ random)",
    bigO: "O(n)",
  },
  {
    id: "p-text-justify", level: "adv", cat: "string", time: "30 นาที",
    title: "Text Justification",
    desc: "words[] + maxWidth — return lines justified (full justify ยกเว้นบรรทัดสุดท้ายและ 1 word/line = left justify)",
    fn: "fullJustify",
    starter: "function fullJustify(words, maxWidth) {\n  \n}",
    solution: "function fullJustify(words, maxWidth) {\n  const r=[];let i=0;\n  while(i<words.length){let len=words[i].length,j=i+1;while(j<words.length&&len+1+words[j].length<=maxWidth){len+=1+words[j].length;j++;}\n    const n=j-i,gaps=n-1;let line='';\n    if(j===words.length||n===1){line=words.slice(i,j).join(' ');line+=' '.repeat(maxWidth-line.length);}\n    else{const totalSp=maxWidth-(len-gaps);const base=Math.floor(totalSp/gaps),extra=totalSp%gaps;\n      for(let k=i;k<j;k++){line+=words[k];if(k<j-1)line+=' '.repeat(base+(k-i<extra?1:0));}}\n    r.push(line);i=j;}\n  return r;\n}",
    tests: [
      { input: [["This", "is", "an", "example", "of", "text", "justification."], 16], expected: ["This    is    an","example  of text","justification.  "] },
    ],
    hint: "Greedy pack — pack ทีละบรรทัด, distribute extra spaces (เหลือใส่ซ้ายก่อน)",
    bigO: "O(total chars)",
  },
];

const CATS = {
  basic:     { label: "Basic",      color: "#34d399" },
  string:    { label: "String",     color: "#f472b6" },
  array:     { label: "Array",      color: "#7dd3fc" },
  recursion: { label: "Recursion",  color: "#a78bfa" },
  search:    { label: "Search",     color: "#7dd3fc" },
  sort:      { label: "Sort",       color: "#fbbf24" },
  hash:      { label: "Hash Map",   color: "#34d399" },
  stack:     { label: "Stack",      color: "#a78bfa" },
  dp:        { label: "DP",         color: "#f472b6" },
  graph:     { label: "Graph",      color: "#7dd3fc" },
  greedy:    { label: "Greedy",     color: "#34d399" },
  math:      { label: "Math",       color: "#fbbf24" },
};
const LEVELS = {
  basic: { label: "BASIC",        color: "#34d399" },
  inter: { label: "INTERMEDIATE", color: "#fbbf24" },
  adv:   { label: "ADVANCED",     color: "#f472b6" },
};

window.PROBLEMS = PROBLEMS;
window.CATS = CATS;
window.LEVELS = LEVELS;

/* ============================================================
   CODE EDITOR — textarea + line numbers + tab handling
============================================================ */
function CodeEditor({ value, onChange, height = 320 }) {
  const taRef = useRP(null);
  const gutterRef = useRP(null);
  const lines = (value.match(/\n/g) || []).length + 1;
  const lineNums = Array.from({ length: lines }, (_, i) => i + 1).join("\n");

  const onKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart, end = ta.selectionEnd;
      const insert = "  ";
      const next = value.slice(0, s) + insert + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + insert.length; });
    }
  };

  const syncScroll = (e) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
  };

  return (
    <div style={{
      display: "flex",
      background: "#0a0e14",
      border: "1px solid var(--border)",
      borderRadius: 8,
      overflow: "hidden",
      height,
      fontFamily: "var(--mono)",
      fontSize: 13,
      lineHeight: "20px",
    }}>
      <div ref={gutterRef} style={{
        background: "#0d1117",
        color: "#4e5564",
        padding: "10px 8px 10px 12px",
        textAlign: "right",
        userSelect: "none",
        overflow: "hidden",
        whiteSpace: "pre",
        minWidth: 36,
      }}>{lineNums}</div>
      <textarea
        ref={taRef}
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        onScroll={syncScroll}
        style={{
          flex: 1,
          background: "transparent",
          color: "var(--text-0)",
          border: "none",
          outline: "none",
          padding: "10px 12px",
          fontFamily: "var(--mono)",
          fontSize: 13,
          lineHeight: "20px",
          resize: "none",
          whiteSpace: "pre",
          overflowWrap: "normal",
          overflow: "auto",
        }}
      />
    </div>
  );
}

/* ============================================================
   RUN ENGINE — execute user JS in a Function() sandbox
============================================================ */
function runUserCode(code, fnName, args) {
  const logs = [];
  const fakeConsole = {
    log: (...a) => logs.push(a.map(formatVal).join(" ")),
    warn: (...a) => logs.push("[warn] " + a.map(formatVal).join(" ")),
    error: (...a) => logs.push("[error] " + a.map(formatVal).join(" ")),
  };
  try {
    const factory = new Function("console", code + `\nreturn typeof ${fnName} === 'function' ? ${fnName} : null;`);
    const fn = factory(fakeConsole);
    if (!fn) return { ok: false, error: `ไม่พบฟังก์ชัน ${fnName}() — ตรวจชื่อให้ตรง`, logs };
    const t0 = performance.now();
    const result = fn(...args);
    const ms = performance.now() - t0;
    return { ok: true, result, ms, logs };
  } catch (e) {
    return { ok: false, error: (e && e.message) || String(e), logs };
  }
}

function formatVal(v) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  try { return JSON.stringify(v); } catch { return String(v); }
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (typeof a === "object") {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

/* ============================================================
   PLAYGROUND — sandbox + problem mode
============================================================ */
function ProblemView({ problem, onSolved }) {
  const [code, setCode] = useSP(() => {
    const saved = loadCode()[problem.id];
    return saved || problem.starter;
  });
  const [results, setResults] = useSP(null);
  const [running, setRunning] = useSP(false);
  const [showSolution, setShowSolution] = useSP(false);
  const [showHint, setShowHint] = useSP(false);

  useEP(() => {
    const m = loadCode();
    m[problem.id] = code;
    saveCode(m);
  }, [code, problem.id]);

  const lvl = LEVELS[problem.level];
  const cat = CATS[problem.cat];

  const runAll = () => {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      const rs = problem.tests.map(t => {
        const r = runUserCode(code, problem.fn, t.input);
        if (!r.ok) return { pass: false, input: t.input, expected: t.expected, error: r.error, logs: r.logs };
        return {
          pass: deepEqual(r.result, t.expected),
          input: t.input,
          expected: t.expected,
          got: r.result,
          ms: r.ms,
          logs: r.logs,
        };
      });
      setResults(rs);
      if (rs.every(r => r.pass)) onSolved && onSolved(problem.id);
      setRunning(false);
    }, 30);
  };

  const passCount = results ? results.filter(r => r.pass).length : 0;
  const allPass = results && passCount === results.length;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ background: lvl.color, color: "#000", padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{lvl.label}</span>
        <span style={{ background: "var(--bg-3)", color: cat.color, padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{cat.label}</span>
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>· {problem.time}</span>
        <span style={{ fontSize: 12, color: "var(--text-2)", fontFamily: "var(--mono)" }}>· Big-O: {problem.bigO}</span>
      </div>

      <div className="callout info" style={{ marginBottom: 14 }}>
        <div className="ttl">📋 โจทย์</div>
        {problem.desc}
      </div>

      <CodeEditor value={code} onChange={setCode} height={300} />

      <div style={{ display: "flex", gap: 8, margin: "12px 0", flexWrap: "wrap" }}>
        <button onClick={runAll} disabled={running}
          style={{ background: "var(--accent)", color: "#0a0e14", border: "none", padding: "10px 18px", borderRadius: 6, cursor: running ? "wait" : "pointer", fontWeight: 700, fontSize: 13 }}>
          {running ? "⏳ กำลังรัน..." : "▶ Run Tests"}
        </button>
        <button onClick={() => setCode(problem.starter)}
          style={{ background: "var(--bg-2)", color: "var(--text-1)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          ↺ Reset
        </button>
        <button onClick={() => setShowHint(!showHint)}
          style={{ background: "var(--bg-2)", color: "var(--warn)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          {showHint ? "🙈 ซ่อน Hint" : "💡 Hint"}
        </button>
        <button onClick={() => setShowSolution(!showSolution)}
          style={{ background: "var(--bg-2)", color: "var(--accent-2)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          {showSolution ? "🙈 ซ่อนเฉลย" : "📖 ดูเฉลย"}
        </button>
      </div>

      {showHint && (
        <div className="callout warn" style={{ marginBottom: 12 }}>
          <div className="ttl">💡 Hint</div>
          {problem.hint}
        </div>
      )}

      {showSolution && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--accent-2)" }}>📖 เฉลย — ลองทำเองก่อน!</div>
          <pre style={{ background: "#0a0e14", border: "1px solid var(--border)", padding: 14, borderRadius: 8, fontSize: 12, overflow: "auto", margin: 0 }}><code>{problem.solution}</code></pre>
        </div>
      )}

      {results && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            padding: 14, borderRadius: 8, marginBottom: 12,
            background: allPass ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.08)",
            border: "1px solid " + (allPass ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"),
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: allPass ? "var(--accent-3)" : "var(--danger)" }}>
              {allPass ? "🎉 ผ่านครบทุกเทส!" : `❌ ผ่าน ${passCount}/${results.length}`}
            </div>
            {allPass && <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>โจทย์นี้ถูกทำเครื่องหมายว่าทำได้แล้ว ✓</div>}
          </div>

          {results.map((r, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 8, marginBottom: 8,
              background: r.pass ? "rgba(52,211,153,0.06)" : "rgba(248,113,113,0.06)",
              border: "1px solid " + (r.pass ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"),
              fontSize: 12,
              fontFamily: "var(--mono)",
            }}>
              <div style={{ fontWeight: 700, color: r.pass ? "var(--accent-3)" : "var(--danger)", marginBottom: 6 }}>
                {r.pass ? "✓ PASS" : "✗ FAIL"} · Test #{i + 1}
                {r.ms !== undefined && <span style={{ color: "var(--text-3)", fontWeight: 400, marginLeft: 8 }}>{r.ms.toFixed(2)}ms</span>}
              </div>
              <div style={{ color: "var(--text-2)" }}>input: <span style={{ color: "var(--text-0)" }}>{formatVal(r.input)}</span></div>
              <div style={{ color: "var(--text-2)" }}>expected: <span style={{ color: "var(--accent-3)" }}>{formatVal(r.expected)}</span></div>
              {r.error
                ? <div style={{ color: "var(--danger)" }}>error: {r.error}</div>
                : <div style={{ color: "var(--text-2)" }}>got: <span style={{ color: r.pass ? "var(--accent-3)" : "var(--danger)" }}>{formatVal(r.got)}</span></div>
              }
              {r.logs && r.logs.length > 0 && (
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px dashed var(--border)" }}>
                  <div style={{ color: "var(--text-3)", marginBottom: 4 }}>console:</div>
                  {r.logs.map((l, j) => <div key={j} style={{ color: "var(--text-1)" }}>{l}</div>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FREE PLAYGROUND — เขียน JS เปล่า ๆ
============================================================ */
function CodePlayground() {
  const [code, setCode] = useSP(() => {
    const saved = loadCode()["__free__"];
    return saved || `// Code Playground · เขียน JavaScript รันใน browser
// ไม่ต้องใช้ AI ไม่มี server — รันบนเครื่องคุณเอง

function bubbleSort(a) {
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - 1 - i; j++)
      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];
  return a;
}

const arr = [5, 2, 8, 1, 9, 3];
console.log("input:", arr);
console.log("sorted:", bubbleSort([...arr]));
`;
  });
  const [output, setOutput] = useSP([]);
  const [error, setError] = useSP("");
  const [running, setRunning] = useSP(false);

  useEP(() => {
    const m = loadCode();
    m["__free__"] = code;
    saveCode(m);
  }, [code]);

  const run = () => {
    setRunning(true);
    setOutput([]);
    setError("");
    setTimeout(() => {
      const logs = [];
      const fakeConsole = {
        log: (...a) => logs.push({ type: "log", text: a.map(formatVal).join(" ") }),
        warn: (...a) => logs.push({ type: "warn", text: a.map(formatVal).join(" ") }),
        error: (...a) => logs.push({ type: "error", text: a.map(formatVal).join(" ") }),
      };
      try {
        const fn = new Function("console", code);
        const t0 = performance.now();
        fn(fakeConsole);
        const ms = performance.now() - t0;
        logs.push({ type: "info", text: `✓ done in ${ms.toFixed(2)}ms` });
        setOutput(logs);
      } catch (e) {
        setOutput(logs);
        setError((e && e.message) || String(e));
      }
      setRunning(false);
    }, 30);
  };

  return (
    <div className="content">
      <div className="lesson-head">
        <div className="eyebrow">PLAYGROUND · WRITE & RUN JS</div>
        <h1>Code Playground</h1>
        <div className="lede">เขียน JavaScript รันใน browser โดยตรง ไม่ต้องใช้ AI ไม่ต้องมี server — ใช้ console.log() ปริ้นค่าได้</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <CodeEditor value={code} onChange={setCode} height={380} />

        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          <button onClick={run} disabled={running}
            style={{ background: "var(--accent)", color: "#0a0e14", border: "none", padding: "10px 20px", borderRadius: 6, cursor: running ? "wait" : "pointer", fontWeight: 700 }}>
            {running ? "⏳ กำลังรัน..." : "▶ Run"}
          </button>
          <button onClick={() => { setCode(""); setOutput([]); setError(""); }}
            style={{ background: "var(--bg-2)", color: "var(--text-1)", border: "1px solid var(--border)", padding: "10px 16px", borderRadius: 6, cursor: "pointer" }}>
            ล้าง
          </button>
        </div>

        <div style={{
          background: "#0a0e14",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 14,
          minHeight: 140,
          fontFamily: "var(--mono)",
          fontSize: 13,
          maxHeight: 360,
          overflow: "auto",
        }}>
          <div style={{ color: "var(--text-3)", fontSize: 11, marginBottom: 8 }}>OUTPUT</div>
          {output.length === 0 && !error && <div style={{ color: "var(--text-3)" }}>— ยังไม่มี output —</div>}
          {output.map((l, i) => (
            <div key={i} style={{
              color: l.type === "error" ? "var(--danger)" :
                     l.type === "warn" ? "var(--warn)" :
                     l.type === "info" ? "var(--accent-3)" :
                     "var(--text-0)",
              whiteSpace: "pre-wrap",
            }}>{l.text}</div>
          ))}
          {error && <div style={{ color: "var(--danger)", marginTop: 8 }}>✗ {error}</div>}
        </div>
      </div>

      <div className="callout info" style={{ marginTop: 24 }}>
        <div className="ttl">💡 อยากฝึกแก้โจทย์?</div>
        ลอง <a href="#/problems" style={{ color: "var(--accent)" }}>หน้าโจทย์ฝึก</a> — มี {PROBLEMS.length} โจทย์
        ตั้งแต่ basic ถึง advanced พร้อม test cases และเฉลย
      </div>
    </div>
  );
}

/* ============================================================
   PROBLEMS HUB — list of all problems
============================================================ */
function ProblemsHub({ nav }) {
  const [filter, setFilter] = useSP("all");
  const [solved, setSolved] = useSP(loadSolved);

  useEP(() => { saveSolved(solved); }, [solved]);

  const filtered = filter === "all" ? PROBLEMS : PROBLEMS.filter(p => p.level === filter || p.cat === filter);
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const pct = Math.round((solvedCount / PROBLEMS.length) * 100);

  return (
    <div className="content">
      <div className="lesson-head">
        <div className="eyebrow">PROBLEMS · ฝึกเขียนโค้ดจริง</div>
        <h1>โจทย์ฝึก</h1>
        <div className="lede">
          เขียน JavaScript แล้ว Run Tests — ผ่านทุก test = solved ✓
          ถ้าทำได้ครบ {PROBLEMS.length} ข้อนี้ ก็ "เซียน" จริงในระดับ basic→advanced
        </div>

        <div style={{ marginTop: 18, padding: 14, background: "var(--bg-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: "var(--text-1)" }}>ความคืบหน้า</span>
            <span style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontWeight: 600 }}>
              {solvedCount}/{PROBLEMS.length} · {pct}%
            </span>
          </div>
          <div style={{ height: 8, background: "var(--bg-3)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, var(--accent), var(--accent-2))", transition: "width 0.4s" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "20px 0" }}>
        {[
          { id: "all", label: "ทั้งหมด" },
          { id: "basic", label: "BASIC" },
          { id: "inter", label: "INTERMEDIATE" },
          { id: "adv", label: "ADVANCED" },
        ].map(b => (
          <button key={b.id} onClick={() => setFilter(b.id)}
            style={{
              background: filter === b.id ? "var(--accent)" : "var(--bg-2)",
              color: filter === b.id ? "#000" : "var(--text-1)",
              border: "1px solid var(--border)",
              padding: "8px 14px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: filter === b.id ? 700 : 500,
            }}>{b.label}</button>
        ))}
        <div style={{ width: 1, background: "var(--border)", margin: "0 6px" }} />
        {Object.keys(CATS).map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              background: filter === c ? CATS[c].color : "var(--bg-2)",
              color: filter === c ? "#000" : CATS[c].color,
              border: "1px solid var(--border)",
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
            }}>{CATS[c].label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map(p => {
          const done = !!solved[p.id];
          const lvl = LEVELS[p.level];
          const cat = CATS[p.cat];
          return (
            <div key={p.id}
              onClick={() => nav("problem/" + p.id)}
              style={{
                background: "var(--bg-2)",
                border: "1px solid " + (done ? "rgba(52,211,153,0.4)" : "var(--border)"),
                borderRadius: 10,
                padding: 16,
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = done ? "rgba(52,211,153,0.4)" : "var(--border)"; }}
            >
              {done && (
                <div style={{ position: "absolute", top: 12, right: 12, background: "var(--accent-3)", color: "#000", borderRadius: "50%", width: 22, height: 22, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>✓</div>
              )}
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <span style={{ background: lvl.color, color: "#000", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{lvl.label}</span>
                <span style={{ background: "var(--bg-3)", color: cat.color, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{cat.label}</span>
              </div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: 15 }}>{p.title}</h4>
              <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5, marginBottom: 10 }}>{p.desc.slice(0, 90)}{p.desc.length > 90 ? "..." : ""}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-3)", fontFamily: "var(--mono)" }}>
                <span>⏱ {p.time}</span>
                <span>{p.bigO}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="empty">ไม่มีโจทย์ในหมวดนี้</div>}
    </div>
  );
}

function ProblemPage({ problemId, nav }) {
  const problem = PROBLEMS.find(p => p.id === problemId);
  const [solved, setSolved] = useSP(loadSolved);

  if (!problem) {
    return (
      <div className="content">
        <div className="empty">
          <div style={{ fontSize: 18, marginBottom: 8 }}>ไม่พบโจทย์</div>
          <button className="btn btn-primary btn-sm" onClick={() => nav("problems")}>กลับหน้าโจทย์</button>
        </div>
      </div>
    );
  }

  const onSolved = (id) => {
    setSolved(s => {
      const next = { ...s, [id]: true };
      saveSolved(next);
      return next;
    });
  };

  const idx = PROBLEMS.indexOf(problem);
  const prev = idx > 0 ? PROBLEMS[idx - 1] : null;
  const next = idx < PROBLEMS.length - 1 ? PROBLEMS[idx + 1] : null;
  const isSolved = !!solved[problem.id];

  return (
    <div className="content">
      <div className="lesson-head">
        <div className="eyebrow">PROBLEM #{idx + 1} / {PROBLEMS.length} {isSolved ? "· ✓ SOLVED" : ""}</div>
        <h1>{problem.title}</h1>
      </div>

      <div style={{ marginTop: 24 }}>
        <ProblemView problem={problem} onSolved={onSolved} />
      </div>

      <div className="lesson-nav">
        {prev ? (
          <div className="lesson-nav-card" onClick={() => nav("problem/" + prev.id)}>
            <div className="lbl">← โจทย์ก่อนหน้า</div>
            <div className="ttl">{prev.title}</div>
          </div>
        ) : <div className="lesson-nav-card disabled"><div className="lbl">—</div><div className="ttl">โจทย์แรก</div></div>}
        {next ? (
          <div className="lesson-nav-card next" onClick={() => nav("problem/" + next.id)}>
            <div className="lbl">โจทย์ถัดไป →</div>
            <div className="ttl">{next.title}</div>
          </div>
        ) : <div className="lesson-nav-card next disabled"><div className="lbl">—</div><div className="ttl">โจทย์สุดท้าย 🎉</div></div>}
      </div>
    </div>
  );
}

window.CodePlayground = CodePlayground;
window.ProblemsHub = ProblemsHub;
window.ProblemPage = ProblemPage;
window.loadSolved = loadSolved;
