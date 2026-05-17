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
