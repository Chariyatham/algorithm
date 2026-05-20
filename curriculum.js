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
    id: "cpp-deep",
    title: "🎓 C++ Foundations Deep",
    lessons: [
      { id: "cpp-io", num: "00a", title: "C++ I/O (cin/cout/getline/format)", level: "basic", time: "15 นาที", desc: "อ่าน input หลายแบบ, จัด format output, fast I/O สำหรับ contest" },
      { id: "cpp-pointers", num: "00b", title: "Pointers & References (Deep)", level: "basic", time: "20 นาที", desc: "pointer vs reference, nullptr, *p, &x, p->, ทำไม arr ≈ pointer" },
      { id: "cpp-memory", num: "00c", title: "Memory Model: Stack vs Heap", level: "basic", time: "18 นาที", desc: "ทำไม vector ดีกว่า raw array, new/delete, leak, smart pointer" },
      { id: "cpp-modern", num: "00d", title: "Modern C++ (auto, range-for, structured bindings)", level: "basic", time: "16 นาที", desc: "auto, range-for, [k,v] = pair, init-if, uniform init {}" },
    ]
  },
  {
    id: "stl-containers",
    title: "📦 STL Mastery — Containers",
    lessons: [
      { id: "stl-overview", num: "00e", title: "STL Overview — เลือก container อะไรเมื่อไหร่", level: "basic", time: "14 นาที", desc: "ภาพรวม STL: 3 categories, complexity table, decision tree" },
      { id: "stl-vector-deep", num: "00f", title: "std::vector — Deep Dive", level: "basic", time: "18 นาที", desc: "push_back/resize/reserve/capacity, amortized O(1) proof, iterator invalidation" },
      { id: "stl-string", num: "00g", title: "std::string — Operations", level: "basic", time: "15 นาที", desc: "substr/find/replace/concat/to_string/stoi/getline" },
      { id: "stl-iterators", num: "00h", title: "Iterators — Categories & Patterns", level: "basic", time: "16 นาที", desc: "5 categories, begin/end/rbegin, range-for เบื้องหลัง, invalidation" },
      { id: "stl-pair-tuple", num: "00i", title: "pair, tuple, Structured Bindings", level: "basic", time: "12 นาที", desc: "make_pair/get<>, auto [x,y] = p, multi-return, sort by .second" },
      { id: "stl-stack-queue", num: "00j", title: "std::stack & std::queue", level: "basic", time: "12 นาที", desc: "LIFO/FIFO adapters, ใช้แทน implementation เอง" },
      { id: "stl-deque", num: "00k", title: "std::deque — Double-Ended Queue", level: "inter", time: "14 นาที", desc: "push/pop ทั้ง 2 ปลาย O(1), sliding window, 0-1 BFS" },
      { id: "stl-priority-queue", num: "00l", title: "std::priority_queue — Heap", level: "inter", time: "16 นาที", desc: "max/min heap, custom comparator, Dijkstra, Top-K" },
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
    id: "recursion-pre",
    title: "🔁 Recursion (ต้องรู้ก่อน Merge/Quick Sort)",
    lessons: [
      { id: "recursion", num: "08.5", title: "Recursion พื้นฐาน (Pre-DAC)", level: "inter", time: "12 นาที", desc: "Base case + recursive case + call stack — ต้องเข้าใจก่อนเรียน Merge/Quick Sort" },
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
      { id: "hash-collision", num: "15a", title: "Hash Collision Handling", level: "inter", time: "12 นาที", desc: "Linear/Quadratic Probing + Chaining + Load Factor (ต่อจาก Hash Table)" },
    ]
  },
  {
    id: "stl-mastery",
    title: "🧮 STL Mastery — Set/Map/Algorithms",
    lessons: [
      { id: "stl-set-map", num: "15b", title: "std::set & std::map (Sorted)", level: "inter", time: "16 นาที", desc: "RB-tree, O(log n), lower/upper_bound, range query" },
      { id: "stl-unordered", num: "15c", title: "std::unordered_set & unordered_map (Hash)", level: "inter", time: "14 นาที", desc: "O(1) avg, anti-hash attack, custom hash" },
      { id: "stl-algorithms", num: "15d", title: "<algorithm> Library", level: "inter", time: "20 นาที", desc: "sort, find, binary_search, lower/upper_bound, accumulate, transform, ..." },
      { id: "cpp-lambda", num: "15e", title: "Lambda Functions", level: "inter", time: "16 นาที", desc: "[capture](params){body}, by-value/by-ref, generic lambda, mutable" },
      { id: "stl-bitset", num: "15f", title: "std::bitset — Fast Bit Ops", level: "inter", time: "12 นาที", desc: "Fixed-size bit array, popcount, ใช้แทน vector<bool>" },
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
  {
    id: "proofs",
    title: "📐 Proofs & Analysis (ระดับมหาลัย)",
    lessons: [
      { id: "big-o-proofs", num: "64", title: "Formal Big-O / Ω / Θ Proofs", level: "adv", time: "20 นาที", desc: "พิสูจน์จากนิยาม ∃c,n₀: T(n) ≤ cf(n) — Big-O, Omega, Theta, little-o" },
      { id: "recursion-methods", num: "65", title: "Substitution & Recursion Tree", level: "adv", time: "22 นาที", desc: "แก้ T(n) แบบไม่ใช้ Master — guess & induction + tree method" },
      { id: "loop-invariant", num: "66", title: "Loop Invariant & Correctness", level: "adv", time: "18 นาที", desc: "พิสูจน์ว่า algorithm ถูกต้อง — initialization, maintenance, termination" },
      { id: "amortized", num: "67", title: "Amortized Analysis (3 methods)", level: "adv", time: "24 นาที", desc: "Aggregate, Accounting, Potential — Dynamic Array, Stack with MultiPop" },
    ]
  },
  {
    id: "complexity",
    title: "🧠 Complexity Theory (NP)",
    lessons: [
      { id: "p-vs-np", num: "68", title: "P, NP, NP-Hard, NP-Complete", level: "adv", time: "20 นาที", desc: "Decision problems, polynomial verifiers, P vs NP คืออะไร" },
      { id: "reductions", num: "69", title: "Polynomial Reductions", level: "adv", time: "18 นาที", desc: "A ≤ₚ B — วิธีพิสูจน์ว่าปัญหา B ยากเทียบเท่า A" },
      { id: "np-complete-problems", num: "70", title: "NP-Complete Catalog", level: "adv", time: "25 นาที", desc: "SAT, 3-SAT, Clique, Vertex Cover, Independent Set, Hamiltonian Cycle, Subset Sum, TSP" },
      { id: "approximation", num: "71", title: "Approximation Algorithms", level: "adv", time: "18 นาที", desc: "Vertex Cover 2-approx, TSP 2-approx, Set Cover, ratio bounds" },
    ]
  },
  {
    id: "flow",
    title: "🌊 Network Flow",
    lessons: [
      { id: "max-flow", num: "72", title: "Max Flow — Ford-Fulkerson", level: "adv", time: "22 นาที", desc: "Residual graph, augmenting path, capacity constraints" },
      { id: "edmonds-karp", num: "73", title: "Edmonds-Karp (BFS-based)", level: "adv", time: "16 นาที", desc: "Ford-Fulkerson + BFS → O(VE²) guaranteed" },
      { id: "min-cut", num: "74", title: "Max-Flow Min-Cut Theorem", level: "adv", time: "18 นาที", desc: "ทฤษฎีบทคู่: max flow = min s-t cut — proof + examples" },
      { id: "bipartite-matching", num: "75", title: "Bipartite Matching", level: "adv", time: "16 นาที", desc: "Maximum matching reduces to max flow — König's theorem" },
    ]
  },
  {
    id: "adv-dp",
    title: "🎯 Advanced DP",
    lessons: [
      { id: "lis", num: "76", title: "LIS — Longest Increasing Subseq", level: "adv", time: "18 นาที", desc: "O(n²) DP + O(n log n) patience sort + reconstruction" },
      { id: "lcs", num: "77", title: "LCS — Longest Common Subseq", level: "adv", time: "18 นาที", desc: "2D DP table, traceback, diff/git ใช้" },
      { id: "edit-distance", num: "78", title: "Edit Distance (Levenshtein)", level: "adv", time: "18 นาที", desc: "Insert/Delete/Replace — spell check, DNA alignment" },
      { id: "matrix-chain", num: "79", title: "Matrix Chain Multiplication", level: "adv", time: "20 นาที", desc: "Interval DP — หา parenthesization ที่ใช้ multiply น้อยสุด" },
      { id: "bitmask-dp", num: "80", title: "Bitmask DP", level: "adv", time: "22 นาที", desc: "TSP O(n²·2ⁿ), Assignment problem, subset enumeration" },
      { id: "tree-dp", num: "81", title: "DP on Trees", level: "adv", time: "18 นาที", desc: "Subtree sum, diameter, max independent set on tree" },
    ]
  },
  {
    id: "adv-graph",
    title: "🕸️ Advanced Graph",
    lessons: [
      { id: "scc", num: "82", title: "SCC — Tarjan & Kosaraju", level: "adv", time: "22 นาที", desc: "Strongly Connected Components, condensation DAG" },
      { id: "articulation", num: "83", title: "Articulation Points & Bridges", level: "adv", time: "18 นาที", desc: "หา cut vertex / cut edge ด้วย DFS + low-link values" },
      { id: "bellman-ford-deep", num: "84", title: "Bellman-Ford Deep Dive", level: "adv", time: "16 นาที", desc: "Proof of correctness, negative cycle detection, applications" },
    ]
  },
  {
    id: "adv-strings",
    title: "🔤 Advanced Strings",
    lessons: [
      { id: "z-algorithm", num: "85", title: "Z-Algorithm", level: "adv", time: "18 นาที", desc: "Z-array O(n) — pattern matching, periodicity" },
      { id: "suffix-array", num: "86", title: "Suffix Array & LCP", level: "adv", time: "22 นาที", desc: "O(n log n) construction, LCP via Kasai, suffix-based queries" },
      { id: "manacher", num: "87", title: "Manacher (Longest Palindrome)", level: "adv", time: "16 นาที", desc: "Linear-time longest palindromic substring" },
      { id: "aho-corasick", num: "88", title: "Aho-Corasick (Multi-pattern)", level: "adv", time: "20 นาที", desc: "Trie + failure links — match หลาย pattern พร้อมกัน O(n+m+z)" },
    ]
  },
  {
    id: "number-theory",
    title: "🔢 Number Theory & Randomized",
    lessons: [
      { id: "ext-gcd", num: "89", title: "Extended Euclidean", level: "adv", time: "16 นาที", desc: "หา gcd + สัมประสิทธิ์ ax + by = gcd(a,b)" },
      { id: "mod-inverse", num: "90", title: "Modular Inverse", level: "adv", time: "14 นาที", desc: "Fermat's little theorem + Extended Euclidean สำหรับ a⁻¹ mod p" },
      { id: "sieve", num: "91", title: "Sieve of Eratosthenes + Linear Sieve", level: "inter", time: "14 นาที", desc: "หาเลขเฉพาะถึง n ใน O(n log log n) / O(n)" },
      { id: "fast-power", num: "92", title: "Fast Power (Exponentiation)", level: "inter", time: "12 นาที", desc: "aⁿ mod m ใน O(log n) — แก่นของ RSA, modular arithmetic" },
      { id: "randomized", num: "93", title: "Randomized Algorithms", level: "adv", time: "18 นาที", desc: "Las Vegas vs Monte Carlo, expected runtime, Miller-Rabin primality" },
      { id: "randomized-quicksort", num: "94", title: "Randomized QuickSort Analysis", level: "adv", time: "20 นาที", desc: "พิสูจน์ E[T(n)] = O(n log n) ด้วย indicator variables" },
    ]
  },
  {
    id: "design",
    title: "✍️ Design Problems (เขียน proof + ออกแบบ)",
    lessons: [
      { id: "design-greedy", num: "95", title: "Design: Greedy Problems", level: "adv", time: "—", desc: "5 โจทย์ออกแบบ greedy + proof of optimality (exchange argument)" },
      { id: "design-dp", num: "96", title: "Design: DP Problems", level: "adv", time: "—", desc: "5 โจทย์ออกแบบ — เขียน recurrence + base case + complexity" },
      { id: "design-graph", num: "97", title: "Design: Graph Problems", level: "adv", time: "—", desc: "5 โจทย์ — modeling ปัญหาเป็น graph + ใช้ algorithm อะไร" },
      { id: "design-reduce", num: "98", title: "Design: Reduction Problems", level: "adv", time: "—", desc: "5 โจทย์ — พิสูจน์ NP-hardness ด้วย reduction" },
      { id: "mock-exam-4", num: "99", title: "Mock Exam 4 — Advanced Topics 📝", level: "adv", time: "120 นาที", desc: "NP, Flow, Adv DP, Adv Graph, Strings, Number Theory" },
      { id: "textbook-mapping", num: "100", title: "📚 CLRS / Kleinberg Chapter Mapping", level: "basic", time: "—", desc: "เชื่อมโยงทุกหัวข้อกับบทใน CLRS, Kleinberg-Tardos, Sedgewick" },
      { id: "sm2-flashcards", num: "101", title: "🧠 SM-2 Spaced Repetition Flashcards", level: "adv", time: "5-15 นาที/วัน", desc: "Active recall + SM-2 algorithm — review ตามที่จะลืม (วิทยาศาสตร์การจำ)" },
    ]
  },
  {
    id: "tools-extra",
    title: "🚀 Tools เพิ่มเติม + Path",
    lessons: [
      { id: "learning-paths", num: "102", title: "🗺️ Learning Paths — เส้นทางตามเป้าหมาย", level: "basic", time: "—", desc: "1 เดือน / 3 เดือน / Midterm / Final / Contest — เลือก path เหมาะกับเป้าหมายคุณ" },
      { id: "cpp-sandbox", num: "103", title: "💻 C++ Online Compiler Sandbox", level: "inter", time: "—", desc: "เขียน + รัน C++ ใน Wandbox/Godbolt/OnlineGDB/Coliru — 8 templates พร้อมใช้" },
      { id: "mock-exam-5", num: "104", title: "📝 Mock Exam 5 — Thai University Style", level: "adv", time: "120 นาที", desc: "ข้อสอบ style จุฬาฯ/มก./มจธ./ลาดกระบัง — เน้นพิสูจน์ + trace + analysis" },
    ]
  },
  {
    id: "complete-resource",
    title: "🎯 Complete Learning Resource",
    lessons: [
      { id: "diagnostic-test", num: "105", title: "🧭 Diagnostic Test — รู้ตัวเองอยู่ตรงไหน", level: "basic", time: "10 นาที", desc: "Placement test 20 ข้อ → suggest learning path เหมาะกับ level คุณ" },
      { id: "mastery-tracker", num: "106", title: "📈 Mastery Tracker — radar chart per topic", level: "basic", time: "—", desc: "ภาพรวม strength/weakness ของคุณ + suggested topics ที่ควรทบทวน" },
      { id: "interview-prep", num: "107", title: "💼 Interview Prep — FAANG / Thai company", level: "adv", time: "—", desc: "Framework + pattern recognition + 30 โจทย์ที่ออกบ่อยใน SCB/Agoda/LINE/Google" },
      { id: "bug-hunt", num: "108", title: "🐛 Bug Hunt — หา bug ในโค้ดที่เขียนผิด", level: "inter", time: "—", desc: "15+ bugs ที่นักศึกษามือใหม่ทำบ่อย — debug แบบ active + progressive hints" },
      { id: "case-studies", num: "109", title: "🌍 Real-World Case Studies", level: "basic", time: "—", desc: "Google PageRank, Netflix recommendation, GPS routing, Bitcoin, JPEG, etc. — ใช้จริงที่ไหน" },
      { id: "common-mistakes", num: "110", title: "⚠️ Common Mistakes — Anti-Pattern Catalog", level: "inter", time: "—", desc: "50+ ข้อผิดพลาดที่พบบ่อย แยกหมวด: C++, Memory, Algo, Perf, STL, Graph, DP" },
      { id: "quick-ref", num: "111", title: "📖 Quick Reference — Algorithm Lookup", level: "basic", time: "—", desc: "ค้นหาเร็ว: time/space complexity + code snippet — 20+ algorithms" },
      { id: "notes", num: "112", title: "📓 Notes / Journal — บันทึกส่วนตัว", level: "basic", time: "—", desc: "เขียน note ต่อบท + export เป็น Markdown" },
      { id: "video-hub", num: "113", title: "📺 Video & Resource Hub", level: "basic", time: "—", desc: "รวม videos, courses, websites, books — Thai + English" },
      { id: "capstone", num: "114", title: "🎓 Capstone Projects — สร้างของจริง", level: "adv", time: "—", desc: "8 project ideas พร้อม full spec — เอาไปทำ portfolio ได้" },
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
