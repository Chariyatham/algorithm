/* Course catalog and lesson content data */
/* eslint-disable no-unused-vars */

const CURRICULUM = [
  {
    id: "intro",
    title: "เริ่มต้น",
    lessons: [
      { id: "foundations", num: "00", title: "Foundations (C++ พื้นฐาน)", level: "basic", time: "12 นาที", desc: "ก่อนเริ่มอัลกอริทึม — algorithm คืออะไร, C++ syntax, vector, ฟังก์ชัน" },
      { id: "what-is-algo", num: "01", title: "Algorithm คืออะไร?", level: "basic", time: "8 นาที", desc: "ทำความเข้าใจอัลกอริทึม คุณสมบัติที่ดี และทำไมเราต้องเรียน" },
      { id: "big-o", num: "02", title: "Big-O Notation", level: "basic", time: "15 นาที", desc: "วิเคราะห์ความซับซ้อนของเวลาและพื้นที่ พร้อม animation เปรียบเทียบ" },
      { id: "master-theorem", num: "03", title: "Master Theorem", level: "inter", time: "12 นาที", desc: "T(n) = aT(n/b) + O(n^d) — แก้ recurrence ใน 30 วินาที" },
    ]
  },
  {
    id: "search",
    title: "การค้นหา (Searching)",
    lessons: [
      { id: "linear-search", num: "03", title: "Linear Search", level: "basic", time: "10 นาที", desc: "ค้นหาแบบตรงไปตรงมา O(n) ดูทีละช่อง" },
      { id: "binary-search", num: "04", title: "Binary Search", level: "basic", time: "12 นาที", desc: "แบ่งครึ่งทุกครั้ง O(log n) เร็วกว่ามาก" },
      { id: "interpolation-search", num: "05", title: "Interpolation Search", level: "inter", time: "10 นาที", desc: "ประมาณตำแหน่งจากค่า ดีเมื่อข้อมูลกระจายสม่ำเสมอ" },
    ]
  },
  {
    id: "sort",
    title: "การจัดเรียง (Sorting)",
    lessons: [
      { id: "bubble-sort", num: "06", title: "Bubble Sort", level: "basic", time: "10 นาที", desc: "อัลกอริทึมพื้นฐานที่สุด เปรียบเทียบทีละคู่" },
      { id: "selection-sort", num: "07", title: "Selection Sort", level: "basic", time: "10 นาที", desc: "หาตัวน้อยสุดแล้วสลับไปข้างหน้า" },
      { id: "insertion-sort", num: "08", title: "Insertion Sort", level: "basic", time: "10 นาที", desc: "แทรกเข้าไปในตำแหน่งที่ถูก เหมือนเรียงไพ่" },
      { id: "merge-sort", num: "09", title: "Merge Sort", level: "inter", time: "15 นาที", desc: "Divide & Conquer แบ่งครึ่งแล้วรวมกลับ O(n log n)" },
      { id: "quick-sort", num: "10", title: "Quick Sort", level: "inter", time: "15 นาที", desc: "เลือก pivot แล้วแบ่ง โดยเฉลี่ย O(n log n)" },
      { id: "heap-sort", num: "11", title: "Heap Sort", level: "adv", time: "18 นาที", desc: "ใช้ Heap จัดเรียง O(n log n) ใน-place" },
    ]
  },
  {
    id: "ds",
    title: "โครงสร้างข้อมูล (Data Structures)",
    lessons: [
      { id: "stack", num: "12", title: "Stack", level: "basic", time: "10 นาที", desc: "LIFO — Last In First Out" },
      { id: "queue", num: "13", title: "Queue", level: "basic", time: "10 นาที", desc: "FIFO — First In First Out" },
      { id: "linked-list", num: "14", title: "Linked List", level: "inter", time: "14 นาที", desc: "Node ที่มี pointer ชี้ไปยังถัดไป" },
      { id: "hashing", num: "15", title: "Hash Table", level: "inter", time: "14 นาที", desc: "Map key→value ด้วย hash function ค่าเฉลี่ย O(1)" },
    ]
  },
  {
    id: "tree",
    title: "Tree & BST",
    lessons: [
      { id: "tree-basic", num: "16", title: "Binary Tree พื้นฐาน", level: "inter", time: "12 นาที", desc: "โครงสร้างต้นไม้ Traversal: pre/in/post-order" },
      { id: "bst", num: "17", title: "Binary Search Tree", level: "inter", time: "16 นาที", desc: "Insert / Search / Delete ใน BST" },
      { id: "avl-tree", num: "17b", title: "AVL Tree (self-balancing)", level: "adv", time: "16 นาที", desc: "BST ที่ balance อัตโนมัติ — 4 cases ของ rotation" },
    ]
  },
  {
    id: "strings",
    title: "String Algorithms",
    lessons: [
      { id: "string-match", num: "17c", title: "String Matching — KMP & Rabin-Karp", level: "adv", time: "16 นาที", desc: "หา pattern ใน text — O(n+m) ด้วย LPS array" },
    ]
  },
  {
    id: "advanced-ds",
    title: "DS ขั้นสูง & Compression",
    lessons: [
      { id: "hash-collision", num: "17d", title: "Hash Collision Handling", level: "inter", time: "12 นาที", desc: "Linear/Quadratic Probing + Chaining + Load Factor" },
      { id: "huffman", num: "17e", title: "Huffman Coding", level: "adv", time: "14 นาที", desc: "Greedy compression — ZIP, JPEG, MP3 ใช้" },
    ]
  },
  {
    id: "dac",
    title: "Divide & Conquer",
    lessons: [
      { id: "quick-select", num: "18", title: "Quick Select", level: "inter", time: "12 นาที", desc: "หาค่าน้อยสุดอันดับ k โดยไม่ต้อง sort ทั้งหมด" },
      { id: "matrix-mult", num: "19", title: "Matrix Multiplication", level: "adv", time: "14 นาที", desc: "การคูณเมตริกซ์แบบปกติ O(n³) และแบบ DAC" },
      { id: "strassen", num: "20", title: "Strassen's Algorithm", level: "adv", time: "14 นาที", desc: "ลด multiplication จาก 8 → 7 ครั้ง O(n^2.81)" },
    ]
  },
  {
    id: "graph",
    title: "Graph",
    lessons: [
      { id: "graph-rep", num: "21", title: "Graph Representation", level: "inter", time: "12 นาที", desc: "Adjacency Matrix vs Adjacency List" },
      { id: "bfs", num: "22", title: "Breadth-First Search (BFS)", level: "inter", time: "14 นาที", desc: "ค้นหาแบบกว้าง ใช้ Queue ระดับต่อระดับ" },
      { id: "dfs", num: "23", title: "Depth-First Search (DFS)", level: "inter", time: "14 นาที", desc: "ค้นหาแบบลึก ใช้ Stack/Recursion" },
      { id: "cycle-detect", num: "24", title: "Cycle Detection", level: "adv", time: "12 นาที", desc: "ตรวจวงวนในกราฟทิศทางด้วย DFS + recursion stack" },
      { id: "topo-sort", num: "25", title: "Topological Sort", level: "adv", time: "12 นาที", desc: "เรียงลำดับ DAG — งานต้องทำก่อนหลัง" },
      { id: "dijkstra", num: "26", title: "Dijkstra's Algorithm", level: "adv", time: "20 นาที", desc: "Shortest path ใน weighted graph (น้ำหนักไม่ติดลบ)" },
      { id: "mst", num: "26b", title: "MST — Prim & Kruskal", level: "adv", time: "16 นาที", desc: "Minimum Spanning Tree — Union-Find, min-heap" },
    ]
  },
  {
    id: "advanced",
    title: "เทคนิคขั้นสูง (Advanced)",
    lessons: [
      { id: "recursion", num: "27", title: "Recursion พื้นฐาน", level: "inter", time: "12 นาที", desc: "ฟังก์ชันที่เรียกตัวเอง — base case + recursive case" },
      { id: "exhaustive", num: "28", title: "Exhaustive Search", level: "inter", time: "14 นาที", desc: "Brute force สำรวจคำตอบทุกแบบ — Permutation, Subset" },
      { id: "backtracking", num: "29", title: "Backtracking", level: "adv", time: "16 นาที", desc: "N-Queens, Subset Sum, Sudoku — ตัดกิ่งคำตอบ" },
      { id: "greedy", num: "30", title: "Greedy Algorithms", level: "adv", time: "14 นาที", desc: "Fractional Knapsack, Tape Storage, Activity selection" },
      { id: "dp", num: "31", title: "Dynamic Programming", level: "adv", time: "20 นาที", desc: "Fibonacci, 0/1 Knapsack, Subset Sum — ใช้ memorization" },
    ]
  },
  {
    id: "lab",
    title: "Lab & แบบฝึกหัด",
    lessons: [
      { id: "compare", num: "32", title: "Compare Mode", level: "adv", time: "—", desc: "เปรียบเทียบ 2 อัลกอริทึมพร้อมกัน บนข้อมูลชุดเดียว" },
      { id: "race", num: "33", title: "Algorithm Race 🏁", level: "adv", time: "—", desc: "แข่ง 5 sorts บน input ต่าง ๆ — random, sorted, reversed, few-unique" },
      { id: "playground", num: "34", title: "Playground", level: "adv", time: "—", desc: "ทดลองรัน algorithms กับ input ของตัวเอง" },
      { id: "exercises", num: "35", title: "แบบฝึกหัดรวม", level: "adv", time: "—", desc: "โจทย์จากชั้นเรียน — Big-O, Sort, DAC, Greedy, DP, Backtracking" },
    ]
  },
  {
    id: "tools",
    title: "Tools เตรียมสอบ",
    lessons: [
      { id: "master-calc", num: "36", title: "Master Theorem Calculator 🧮", level: "adv", time: "—", desc: "กรอก a, b, d → ได้ T(n) + step ทั้งหมด" },
      { id: "recurrence-solver", num: "37", title: "Recurrence Solver 🔁", level: "adv", time: "—", desc: "แก้ T(n) แบบ substitution — เห็นทุก step" },
      { id: "pattern-trainer", num: "38", title: "Pattern Trainer 🎯", level: "adv", time: "—", desc: "ดูโค้ด → เดา pattern: D&C/DP/Greedy/Backtracking/..." },
      { id: "advanced-viz", num: "39", title: "Advanced Visualizers 🔬", level: "adv", time: "—", desc: "Karatsuba · Strassen M1-M7 · Floyd-Warshall · Quick Select 3-way" },
      { id: "mock-exam", num: "40", title: "Mock Exam 📝", level: "adv", time: "90+90 นาที", desc: "Midterm + Final จำลอง พร้อมเฉลยทีละ step" },
      { id: "glossary", num: "41", title: "Glossary 📖", level: "basic", time: "—", desc: "ศัพท์เทคนิคทั้งหมด ค้นหาได้" },
      { id: "concept-map", num: "42", title: "Concept Map 🗺️", level: "basic", time: "—", desc: "แผนผังความสัมพันธ์ระหว่างหัวข้อ — เห็นภาพรวมทั้งหลักสูตร" },
      { id: "decision-tree", num: "43", title: "Decision Tree 🌲", level: "adv", time: "—", desc: "เจอโจทย์ใช้ algorithm อะไร — checklist ก่อนเขียนคำตอบ + keyword lookup" },
      { id: "flashcards", num: "44", title: "Flashcards 🃏", level: "basic", time: "—", desc: "ทบทวนแบบ active recall — 35+ การ์ด แยกหมวด ติดตามผล" },
      { id: "bigo-analyzer", num: "45", title: "Big-O Analyzer 📐", level: "adv", time: "—", desc: "วิเคราะห์ code ทีละบรรทัด — เห็นว่า n+1, n², log n มาจากไหน" },
      { id: "practice-bank", num: "46", title: "Practice Bank 🧪", level: "adv", time: "—", desc: "50+ โจทย์แยกหัวข้อ — easy/medium/hard พร้อม hint + เฉลย" },
      { id: "daily-streak", num: "47", title: "Daily Streak 🔥", level: "basic", time: "5 นาที/วัน", desc: "5 โจทย์/วัน — สร้าง habit เรียนทุกวัน" },
      { id: "mastery", num: "48", title: "Topic Mastery 📈", level: "basic", time: "—", desc: "ภาพรวมการเรียน — หมวดไหนแน่น/อ่อน + แนะนำขั้นต่อไป" },
      { id: "sandbox", num: "49", title: "Code Sandbox 💻", level: "adv", time: "—", desc: "เขียน C++ ได้เลย — รัน/วิเคราะห์ Big-O/Trace/Review (Claude-powered)" },
      { id: "print-cheatsheet", num: "50", title: "Print Cheat Sheet 🖨️", level: "basic", time: "—", desc: "รวมทุก cheat sheet เป็น PDF ใบเดียวก่อนสอบ" },
      { id: "code-solutions", num: "51", title: "Code Solutions Bank 💾", level: "adv", time: "—", desc: "เฉลยโค้ด C++ เต็มทุก assignment — copy ไปส่งได้เลย 16+ ข้อ" },
      { id: "mock-exam-2", num: "52", title: "Mock Exam 2 📝", level: "adv", time: "90 นาที", desc: "ชุดที่ 2 — Big-O, Sort, DAC, AVL, Hash, KMP, Huffman" },
      { id: "mock-exam-3", num: "53", title: "Mock Exam 3 📝", level: "adv", time: "90 นาที", desc: "ชุดที่ 3 — Greedy, DP, Backtracking, Graph, MST" },
      { id: "timed-drill", num: "54", title: "Timed Drill ⏱️", level: "adv", time: "5-30 นาที", desc: "จับเวลาแก้โจทย์ — ฝึกตอบเร็วในสนามจริง" },
      { id: "ai-tutor", num: "55", title: "AI Tutor 🤖", level: "adv", time: "—", desc: "แชทถาม Claude ได้ — อธิบาย / แก้โจทย์ / รีวิวโค้ด" },
      { id: "quest", num: "56", title: "Algorithm Quest ⚔️", level: "basic", time: "—", desc: "RPG mini game — ตอบโจทย์ถูก = โจมตี boss" },
      { id: "bookmarks", num: "57", title: "Bookmarks & Export 📥", level: "basic", time: "—", desc: "บทที่กดดาว + export โน้ตเป็น Markdown" },
    ]
  },
  {
    id: "more",
    title: "Algorithm เพิ่มเติม",
    lessons: [
      { id: "bellman-ford", num: "58", title: "Bellman-Ford", level: "adv", time: "14 นาที", desc: "Shortest path กับ negative weight + ตรวจ negative cycle" },
      { id: "floyd-warshall", num: "59", title: "Floyd-Warshall", level: "adv", time: "12 นาที", desc: "All-pairs shortest path O(V³)" },
      { id: "counting-sort", num: "60", title: "Counting / Radix Sort", level: "inter", time: "14 นาที", desc: "Linear-time sort — ไม่ใช้การเปรียบเทียบ" },
      { id: "trie", num: "61", title: "Trie (Prefix Tree)", level: "inter", time: "12 นาที", desc: "Autocomplete / Spell check — Insert/Search O(L)" },
      { id: "union-find", num: "62", title: "Union-Find (DSU)", level: "inter", time: "14 นาที", desc: "Disjoint Set — path compression + union by rank" },
      { id: "segment-tree", num: "63", title: "Segment Tree & BIT", level: "adv", time: "16 นาที", desc: "Range query + Point update O(log n)" },
    ]
  },
];

// Flatten lesson list with prev/next links
const ALL_LESSONS = (() => {
  const flat = [];
  CURRICULUM.forEach(sec => sec.lessons.forEach(l => flat.push({ ...l, sectionId: sec.id, sectionTitle: sec.title })));
  return flat.map((l, i) => ({
    ...l,
    prev: flat[i - 1] || null,
    next: flat[i + 1] || null,
  }));
})();

const TOTAL_LESSONS = ALL_LESSONS.length;

window.CURRICULUM = CURRICULUM;
window.ALL_LESSONS = ALL_LESSONS;
window.TOTAL_LESSONS = TOTAL_LESSONS;
