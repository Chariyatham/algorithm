/* Lessons part 2: Tree, Graph, Recursion, Greedy, DP, Compare, Playground */

const { useState: useStateL2, useMemo: useMemoL2 } = React;
const { SortLessonViz: SLV2, SearchLessonViz: SrLV2, Quiz: Quiz2, DragOrder: DO2 } = window.LessonComponents;
const { TreeViz: TV2, TraversalViz: TrV2, GraphViz: GV2, FibDPViz: FibV2 } = window.DSVisualizers;

const Lessons2 = {};

// ============ 15: Binary Tree basic ============
Lessons2["tree-basic"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Binary Tree</div>
        โครงสร้างแบบลำดับชั้น แต่ละ node มีลูกได้สูงสุด 2 ตัว — <b>left</b> และ <b>right</b>
      </div>
      <h3>คำศัพท์สำคัญ</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Root</b> — node บนสุด ไม่มี parent</li>
        <li><b>Leaf</b> — node ที่ไม่มีลูก</li>
        <li><b>Depth</b> — ระยะจาก root ถึง node นั้น</li>
        <li><b>Height</b> — ระยะจาก node ถึง leaf ที่ไกลสุด</li>
      </ul>
      <h3>Tree Traversal — 3 แบบ</h3>
      <p>การเดินไล่ทุก node ใน tree ทำได้ 3 รูปแบบหลัก ที่ต่างกันแค่ลำดับว่าจะเยี่ยม root ก่อน/กลาง/หลัง:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Pre-order:</b> Root → Left → Right (ใช้สำหรับ copy tree)</li>
        <li><b>In-order:</b> Left → Root → Right (ใน BST จะได้ค่าเรียงจากน้อยไปมาก!)</li>
        <li><b>Post-order:</b> Left → Right → Root (ใช้สำหรับลบ tree)</li>
      </ul>
      <h3>Animation</h3>
      <TrV2 />
      <h3>โค้ด C — In-order Traversal</h3>
      <CodeBlock code={[
        "struct Node { int v; struct Node *l, *r; };",
        "",
        "void inorder(struct Node *root) {",
        "  if (!root) return;",
        "  inorder(root->l);",
        "  printf(\"%d \", root->v);",
        "  inorder(root->r);",
        "}",
      ]} />
      <Quiz2
        q="In-order traversal ของ BST จะให้ผลลัพธ์อย่างไร?"
        options={["ค่าแบบสุ่ม", "ค่าจากน้อยไปมาก", "ค่าจากมากไปน้อย", "เฉพาะ leaf node"]}
        answer={1}
        explain="In-order ของ BST = เรียง — เพราะกฎของ BST: ซ้าย < root < ขวา ทุก node การเดิน L → Root → R จึงให้ค่าจากน้อยไปมาก"
      />
    </React.Fragment>
  );
};

// ============ 16: BST ============
Lessons2["bst"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Binary Search Tree (BST)</div>
        Binary Tree ที่มี <b>กฎ</b>: สำหรับทุก node — <b>ซ้าย &lt; node &lt; ขวา</b>
      </div>
      <h3>ทำไมถึงเรียก "Search Tree"?</h3>
      <p>เพราะกฎข้างต้นทำให้การค้นหามี behavior เหมือน Binary Search — ทุกขั้นเราตัดครึ่ง subtree หนึ่งทิ้งได้!</p>
      <h3>Lab — สร้าง BST ของคุณเอง</h3>
      <TV2 />
      <h3>Operations</h3>
      <table className="cmp">
        <thead><tr><th>Operation</th><th>Average</th><th>Worst (skewed)</th></tr></thead>
        <tbody>
          <tr><td>Insert</td><td className="mono">O(log n)</td><td className="mono">O(n)</td></tr>
          <tr><td>Search</td><td className="mono">O(log n)</td><td className="mono">O(n)</td></tr>
          <tr><td>Delete</td><td className="mono">O(log n)</td><td className="mono">O(n)</td></tr>
        </tbody>
      </table>
      <div className="callout warn">
        <div className="ttl">⚠ Skewed Tree</div>
        ถ้า insert ตามลำดับเรียง (เช่น 1, 2, 3, 4, 5) BST จะกลายเป็นเส้นตรง = Linked List → ทุก operation เป็น O(n)
        วิธีแก้: ใช้ <b>Self-balancing BST</b> เช่น AVL Tree หรือ Red-Black Tree
      </div>
      <h3>โค้ด C — Insert</h3>
      <CodeBlock code={[
        "struct Node *insert(struct Node *root, int v) {",
        "  if (!root) {",
        "    struct Node *n = malloc(sizeof(struct Node));",
        "    n->v = v; n->l = n->r = NULL;",
        "    return n;",
        "  }",
        "  if (v < root->v) root->l = insert(root->l, v);",
        "  else if (v > root->v) root->r = insert(root->r, v);",
        "  return root;",
        "}",
      ]} />
      <Quiz2
        q="ใน BST ที่ balanced หาค่าใน 1,000,000 node ใช้ประมาณกี่ขั้น?"
        options={["~10 ขั้น", "~20 ขั้น", "~1000 ขั้น", "~1,000,000 ขั้น"]}
        answer={1}
        explain="log₂(1,000,000) ≈ 20 — BST ที่สมดุลให้ผลใกล้เคียง Binary Search"
      />
    </React.Fragment>
  );
};

// ============ 17: BFS ============
Lessons2["bfs"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Breadth-First Search (BFS)</div>
        ค้นหา/เดินใน graph แบบ "ระดับต่อระดับ" — ใช้ <b>Queue (FIFO)</b>
      </div>
      <h3>หลักการ</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>ใส่ start node ลงใน queue และ mark visited</li>
        <li>หยิบ node หน้าสุดของ queue (u)</li>
        <li>สำหรับเพื่อนบ้านของ u ที่ยังไม่ visited → mark visited + ใส่ลง queue</li>
        <li>ทำซ้ำจนกว่า queue ว่าง</li>
      </ol>
      <h3>Animation</h3>
      <GV2 algo="bfs" />
      <h3>โค้ด Pseudocode</h3>
      <CodeBlock code={[
        "BFS(graph, start):",
        "  queue = [start]",
        "  visited = {start}",
        "  while queue is not empty:",
        "    u = queue.dequeue()",
        "    for v in neighbors(u):",
        "      if v not in visited:",
        "        visited.add(v)",
        "        queue.enqueue(v)",
      ]} />
      <h3>การประยุกต์ใช้</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>หา <b>shortest path</b> ใน graph ที่ <b>ไม่มี weight</b> (จำนวน edge น้อยสุด)</li>
        <li>หา connected components</li>
        <li>Web crawler</li>
        <li>Social network: หาเพื่อนระดับ k</li>
      </ul>
      <Quiz2
        q="BFS ใช้ data structure อะไร?"
        options={["Stack", "Queue", "Heap", "Hash Table"]}
        answer={1}
        explain="BFS ใช้ Queue เพื่อให้เยี่ยม node แบบ FIFO — เยี่ยม node ที่อยู่ใกล้ start ก่อน"
      />
    </React.Fragment>
  );
};

// ============ 18: DFS ============
Lessons2["dfs"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Depth-First Search (DFS)</div>
        ค้นหาแบบ "ลึกก่อนกว้าง" — ลงไปจนสุดทางก่อนค่อยย้อน ใช้ <b>Stack</b> หรือ <b>Recursion</b>
      </div>
      <h3>Animation</h3>
      <GV2 algo="dfs" />
      <h3>โค้ด — Recursive DFS</h3>
      <CodeBlock code={[
        "void dfs(int u, bool *visited) {",
        "  visited[u] = true;",
        "  printf(\"%d \", u);",
        "  for (each neighbor v of u) {",
        "    if (!visited[v])",
        "      dfs(v, visited);",
        "  }",
        "}",
      ]} />
      <h3>BFS vs DFS — เปรียบเทียบ</h3>
      <table className="cmp">
        <thead><tr><th>คุณสมบัติ</th><th>BFS</th><th>DFS</th></tr></thead>
        <tbody>
          <tr><td>Data structure</td><td className="mono">Queue</td><td className="mono">Stack / Recursion</td></tr>
          <tr><td>Memory</td><td>O(width)</td><td>O(depth)</td></tr>
          <tr><td>Shortest path (unweighted)</td><td>✓ ใช่</td><td>✗ ไม่</td></tr>
          <tr><td>หา cycle</td><td>ใช้ได้</td><td>ใช้ดีกว่า</td></tr>
          <tr><td>Topological sort</td><td>(Kahn's)</td><td>✓ ใช้บ่อย</td></tr>
        </tbody>
      </table>
      <Quiz2
        q="ถ้าต้องการหา shortest path (จำนวน edge น้อยสุด) จาก node A ไป B ใน graph ที่ไม่มี weight ควรใช้?"
        options={["BFS", "DFS", "ใช้ตัวไหนก็ได้", "Dijkstra"]}
        answer={0}
        explain="BFS เยี่ยม node แบบระดับต่อระดับ ครั้งแรกที่เจอ B จะเป็น path ที่สั้นที่สุดในแง่ของจำนวน edge"
      />
    </React.Fragment>
  );
};

// ============ 19: Dijkstra ============
Lessons2["dijkstra"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Dijkstra's Algorithm</div>
        หา shortest path จาก node ต้นทางไปทุก node อื่นใน graph ที่มี <b>weight ไม่ติดลบ</b>
      </div>
      <h3>หลักการ — Greedy</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>กำหนด dist[start] = 0, อื่น ๆ = ∞</li>
        <li>เลือก node ที่ยังไม่ visited และ dist น้อยสุด เรียกว่า u</li>
        <li>Mark u เป็น visited (dist ของ u finalize แล้ว)</li>
        <li>สำหรับเพื่อนบ้าน v ของ u: ถ้า dist[u] + w(u,v) &lt; dist[v] → update (relax)</li>
        <li>ทำซ้ำจนกว่าจะ visit ครบทุก node</li>
      </ol>
      <h3>Animation</h3>
      <GV2 algo="dijkstra" />
      <div className="callout warn">
        <div className="ttl">⚠ ข้อจำกัด</div>
        Dijkstra ใช้ <b>ไม่ได้</b> กับ weight ติดลบ! — สำหรับกรณีนั้นใช้ <b>Bellman-Ford</b> แทน
      </div>
      <h3>Time Complexity</h3>
      <table className="cmp">
        <thead><tr><th>Implementation</th><th>Time</th></tr></thead>
        <tbody>
          <tr><td>Array (เลือก min ทีละครั้ง)</td><td className="mono">O(V²)</td></tr>
          <tr><td>Min-Heap (Priority Queue)</td><td className="mono">O((V + E) log V)</td></tr>
          <tr><td>Fibonacci Heap</td><td className="mono">O(E + V log V)</td></tr>
        </tbody>
      </table>
      <Quiz2
        q="ถ้า graph มี edge weight ติดลบ ควรใช้อะไรแทน Dijkstra?"
        options={["BFS", "DFS", "Bellman-Ford", "Heap Sort"]}
        answer={2}
        explain="Bellman-Ford จัดการ negative weight ได้ และยังตรวจจับ negative cycle ได้ด้วย ใช้เวลา O(VE)"
      />
    </React.Fragment>
  );
};

// ============ 20: Recursion & Backtracking ============
Lessons2["recursion"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Recursion</div>
        ฟังก์ชันที่เรียก "ตัวเอง" — แก้ปัญหาใหญ่โดยแบ่งเป็นปัญหาย่อยที่เหมือนกัน
      </div>
      <h3>3 ส่วนสำคัญของฟังก์ชัน Recursive</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Base case</b> — เงื่อนไขหยุด (ไม่หยุด = stack overflow!)</li>
        <li><b>Recursive case</b> — เรียกตัวเองด้วย input ที่เล็กลง</li>
        <li><b>Combine</b> — ใช้ผลลัพธ์ของ recursive call</li>
      </ol>
      <h3>ตัวอย่าง: Factorial</h3>
      <CodeBlock code={[
        "int factorial(int n) {",
        "  if (n <= 1) return 1;          // base case",
        "  return n * factorial(n - 1);   // recursive case",
        "}",
      ]} />
      <p style={{ color: 'var(--text-2)', fontSize: 13 }}>
        factorial(4) → 4 × factorial(3) → 4 × (3 × factorial(2)) → 4 × 3 × (2 × factorial(1)) → 4 × 3 × 2 × 1 = 24
      </p>
      <h3>Backtracking — ลองทุกความเป็นไปได้แล้วถอย</h3>
      <p>ใช้ recursion + "ลอง → ตรวจ → ถ้าไม่ดีก็ถอย" เช่น แก้เขาวงกต, N-Queens, Sudoku</p>
      <CodeBlock code={[
        "// แม่แบบ Backtracking",
        "bool solve(state) {",
        "  if (isSolved(state)) return true;",
        "  for (each choice) {",
        "    apply(choice);",
        "    if (solve(state)) return true;",
        "    undo(choice);    // ← backtrack",
        "  }",
        "  return false;",
        "}",
      ]} />
      <DO2
        prompt="เรียงขั้นตอน Recursive Function ให้ถูก:"
        items={["เรียก function ตัวเอง", "ตรวจ base case (หยุดได้?)", "รับ parameter", "รวมผลลัพธ์ + return"]}
        correct={["รับ parameter", "ตรวจ base case (หยุดได้?)", "เรียก function ตัวเอง", "รวมผลลัพธ์ + return"]}
      />
      <Quiz2
        q="ถ้าลืมเขียน base case จะเกิดอะไรขึ้น?"
        options={[
          "โปรแกรมรันช้า",
          "เกิด Stack Overflow",
          "Compile error",
          "ไม่มีอะไรเกิดขึ้น"
        ]}
        answer={1}
        explain="ฟังก์ชันจะเรียกตัวเองไม่หยุด → call stack เต็ม → Stack Overflow (segfault) — base case จึงสำคัญที่สุด!"
      />
    </React.Fragment>
  );
};

// ============ 21: Greedy ============
Lessons2["greedy"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Greedy Algorithm</div>
        เลือก "ตัวเลือกที่ดีที่สุด ณ ตอนนี้" เสมอ โดยหวังว่าจะนำไปสู่คำตอบที่ดีที่สุดในที่สุด
      </div>
      <h3>ตัวอย่างคลาสสิก: ทอนเงิน (Coin Change)</h3>
      <p>มีเหรียญ {`{1, 5, 10, 25}`} บาท ต้องการทอน 30 บาท ใช้เหรียญน้อยสุด:</p>
      <p><b>Greedy:</b> เลือกเหรียญใหญ่สุดที่ ≤ จำนวนที่เหลือ → 25 + 5 = <span style={{ color: 'var(--accent-3)' }}>2 เหรียญ ✓</span></p>
      <CodeBlock code={[
        "int coinChange(int amount, int coins[], int n) {",
        "  // ต้องเรียง coins จากมากไปน้อย",
        "  int count = 0;",
        "  for (int i = 0; i < n; i++) {",
        "    while (amount >= coins[i]) {",
        "      amount -= coins[i];",
        "      count++;",
        "    }",
        "  }",
        "  return amount == 0 ? count : -1;",
        "}",
      ]} />
      <div className="callout warn">
        <div className="ttl">⚠ Greedy ไม่ใช่ทุกครั้งจะให้คำตอบที่ดีที่สุด</div>
        เช่น เหรียญ {`{1, 3, 4}`} ทอน 6 บาท:<br />
        <b>Greedy:</b> 4 + 1 + 1 = 3 เหรียญ<br />
        <b>Optimal:</b> 3 + 3 = <span style={{ color: 'var(--accent-3)' }}>2 เหรียญ</span><br />
        ในกรณีนี้ Greedy ใช้ไม่ได้ ต้องใช้ DP แทน!
      </div>
      <h3>เมื่อไหร่ Greedy ใช้ได้?</h3>
      <p>เมื่อปัญหามี <b>Greedy Choice Property</b> และ <b>Optimal Substructure</b> — ตัวอย่าง:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Activity Selection (เลือกกิจกรรมไม่ทับเวลา)</li>
        <li>Huffman Coding (compression)</li>
        <li>Dijkstra's Algorithm</li>
        <li>Minimum Spanning Tree (Kruskal, Prim)</li>
      </ul>
      <Quiz2
        q="ความแตกต่างหลักระหว่าง Greedy และ Dynamic Programming คืออะไร?"
        options={[
          "Greedy เร็วกว่าเสมอ",
          "Greedy เลือกเฉพาะ ณ ตอนนั้น ไม่ย้อนกลับ DP พิจารณาทุกความเป็นไปได้",
          "DP ใช้ recursion เท่านั้น",
          "ไม่ต่างกัน"
        ]}
        answer={1}
        explain="Greedy ทำการตัดสินใจครั้งเดียวต่อขั้น ไม่ย้อน → เร็วแต่อาจไม่ optimal; DP ลองทุกทางและเก็บผล → optimal เสมอแต่ใช้ memory เยอะกว่า"
      />
    </React.Fragment>
  );
};

// ============ 22: DP ============
Lessons2["dp"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Dynamic Programming (DP)</div>
        แก้ปัญหาด้วยการ <b>เก็บคำตอบของปัญหาย่อย</b> ไม่ต้องคำนวณซ้ำ
      </div>
      <h3>เมื่อไหร่ใช้ DP?</h3>
      <p>เมื่อปัญหามี 2 คุณสมบัติ:</p>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Overlapping subproblems</b> — ปัญหาย่อยซ้ำกันหลายครั้ง</li>
        <li><b>Optimal substructure</b> — คำตอบรวมประกอบจากคำตอบของปัญหาย่อย</li>
      </ol>
      <h3>ตัวอย่าง: Fibonacci</h3>
      <p>Recursive แบบไร้เดียงสาคำนวณซ้ำเยอะ — fib(5) เรียก fib(2) ถึง 3 ครั้ง! complexity = <span className="kbd">O(2ⁿ)</span></p>
      <p><b>Memoization (Top-down):</b> เก็บผลที่คำนวณแล้วใน array</p>
      <FibV2 />
      <CodeBlock code={[
        "int memo[100];",
        "int fib(int n) {",
        "  if (n <= 1) return n;",
        "  if (memo[n] != -1) return memo[n];   // ← cache hit",
        "  return memo[n] = fib(n-1) + fib(n-2);",
        "}",
      ]} />
      <p><b>Tabulation (Bottom-up):</b> สร้างคำตอบจากเล็กไปใหญ่</p>
      <CodeBlock code={[
        "int fib(int n) {",
        "  int dp[n+1];",
        "  dp[0] = 0; dp[1] = 1;",
        "  for (int i = 2; i <= n; i++)",
        "    dp[i] = dp[i-1] + dp[i-2];",
        "  return dp[n];",
        "}",
      ]} />
      <p>ทั้งสองวิธีลด complexity จาก O(2ⁿ) เหลือ <b>O(n)</b>!</p>
      <h3>Memoization vs Tabulation</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Top-down (Memo)</th><th>Bottom-up (Tab)</th></tr></thead>
        <tbody>
          <tr><td>วิธี</td><td>Recursion + cache</td><td>Loop + array</td></tr>
          <tr><td>คำนวณ</td><td>เฉพาะที่ต้องการ</td><td>ทั้งหมดเรียงตามลำดับ</td></tr>
          <tr><td>Stack overhead</td><td>มี</td><td>ไม่มี</td></tr>
          <tr><td>เขียนง่าย</td><td>ถ้ารู้สูตร recursive</td><td>เมื่อเห็น order ชัดเจน</td></tr>
        </tbody>
      </table>
      <h3>ปัญหา DP ที่ควรรู้</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>0/1 Knapsack</li>
        <li>Longest Common Subsequence (LCS)</li>
        <li>Edit Distance</li>
        <li>Coin Change (จำนวนวิธี / จำนวนเหรียญน้อยสุด)</li>
        <li>Matrix Chain Multiplication</li>
      </ul>
      <Quiz2
        q="DP ลด complexity ของ Fibonacci จาก O(2ⁿ) เหลือเท่าใด?"
        options={["O(1)", "O(log n)", "O(n)", "O(n²)"]}
        answer={2}
        explain="เพราะคำนวณแต่ละ fib(i) แค่ครั้งเดียว และมี n+1 ค่าให้คำนวณ → O(n)"
      />
    </React.Fragment>
  );
};

// ============ 23: Compare Mode ============
Lessons2["compare"] = function () {
  const [arr, setArr] = useStateL2([42, 7, 19, 88, 3, 56, 31, 64, 25, 91, 14, 47]);
  const [algoA, setAlgoA] = useStateL2("bubble");
  const [algoB, setAlgoB] = useStateL2("quick");

  const A = window.AlgorithmGenerators[algoA];
  const B = window.AlgorithmGenerators[algoB];

  const playerA = usePlayer(() => A.gen([...arr]), [arr, algoA]);
  const playerB = usePlayer(() => B.gen([...arr]), [arr, algoB]);

  // Synchronized play
  const playBoth = () => { playerA.play(); playerB.play(); };
  const pauseBoth = () => { playerA.pause(); playerB.pause(); };
  const resetBoth = () => { playerA.reset(); playerB.reset(); };
  const stepBoth = () => { playerA.step(); playerB.step(); };

  const fA = playerA.frame || {};
  const fB = playerB.frame || {};
  const opts = ["bubble", "selection", "insertion", "merge", "quick", "heap"];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Compare Mode</div>
        เปรียบเทียบ 2 อัลกอริทึมการเรียงลำดับด้วยข้อมูลชุดเดียวกัน — เห็นได้ว่าตัวไหนเร็วกว่า
      </div>

      <div className="viz">
        <div className="viz-toolbar">
          <ArrayInput value={arr} onChange={setArr} max={20} />
          <button className="btn btn-primary btn-sm" onClick={playerA.playing || playerB.playing ? pauseBoth : playBoth}>
            {playerA.playing || playerB.playing ? "Pause Both" : "Play Both"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={stepBoth}>Step Both</button>
          <button className="btn btn-ghost btn-sm" onClick={resetBoth}>Reset</button>
          <div className="ctrl-group" style={{ marginLeft: 8 }}>
            <span style={{ fontSize: 11 }}>Speed</span>
            <input className="slider" type="range" min="0.25" max="4" step="0.25" value={playerA.speed}
              onChange={e => { const s = parseFloat(e.target.value); playerA.setSpeed(s); playerB.setSpeed(s); }} />
            <span style={{ fontSize: 11 }}>{playerA.speed}x</span>
          </div>
        </div>
        <div className="viz-split">
          <div className="viz-stage">
            <span className="stage-label">A · {A.name}</span>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <select value={algoA} onChange={e => setAlgoA(e.target.value)} style={{ alignSelf: 'flex-end' }}>
                {opts.map(k => <option key={k} value={k}>{window.AlgorithmGenerators[k].name}</option>)}
              </select>
              <Bars data={fA.arr || arr} marks={fA.marks || {}} />
            </div>
          </div>
          <div className="viz-stage">
            <span className="stage-label">B · {B.name}</span>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <select value={algoB} onChange={e => setAlgoB(e.target.value)} style={{ alignSelf: 'flex-end' }}>
                {opts.map(k => <option key={k} value={k}>{window.AlgorithmGenerators[k].name}</option>)}
              </select>
              <Bars data={fB.arr || arr} marks={fB.marks || {}} />
            </div>
          </div>
        </div>
        <div className="viz-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <span style={{ color: 'var(--accent)' }}>{A.name}</span>
            <span style={{ marginLeft: 12 }}>steps:<b>{playerA.frames.length}</b></span>
            <span style={{ marginLeft: 12 }}>step:<b>{playerA.idx + 1}</b></span>
            <span style={{ marginLeft: 12 }}>complexity:<b>{A.complexity.time}</b></span>
          </div>
          <div>
            <span style={{ color: 'var(--accent-2)' }}>{B.name}</span>
            <span style={{ marginLeft: 12 }}>steps:<b>{playerB.frames.length}</b></span>
            <span style={{ marginLeft: 12 }}>step:<b>{playerB.idx + 1}</b></span>
            <span style={{ marginLeft: 12 }}>complexity:<b>{B.complexity.time}</b></span>
          </div>
        </div>
      </div>

      <div className="callout tip" style={{ marginTop: 22 }}>
        <div className="ttl">Tips</div>
        ลอง compare <b>Bubble</b> vs <b>Quick</b> ด้วยข้อมูลขนาดต่าง ๆ จะเห็นว่ายิ่งข้อมูลใหญ่ ความต่างยิ่งชัด
      </div>
    </React.Fragment>
  );
};

// ============ 24: Playground ============
Lessons2["playground"] = function () {
  const [arr, setArr] = useStateL2([42, 7, 19, 88, 3, 56, 31, 64]);
  const [algoKey, setAlgoKey] = useStateL2("bubble");
  const A = window.AlgorithmGenerators[algoKey];
  const player = usePlayer(() => A.gen([...arr]), [arr, algoKey]);
  const f = player.frame || {};

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Playground</div>
        ทดลองรันอัลกอริทึมไหนก็ได้กับข้อมูลของคุณเอง — และทำ Quiz รวมตรวจสอบความเข้าใจ
      </div>
      <div className="viz">
        <div className="viz-toolbar">
          <select value={algoKey} onChange={e => setAlgoKey(e.target.value)}>
            {Object.keys(window.AlgorithmGenerators).filter(k => !["linear", "binary"].includes(k)).map(k =>
              <option key={k} value={k}>{window.AlgorithmGenerators[k].name}</option>
            )}
          </select>
          <ArrayInput value={arr} onChange={setArr} max={30} />
        </div>
        <PlayerToolbar player={player} />
        <div className="viz-stage">
          <Bars data={f.arr || arr} marks={f.marks || {}} />
        </div>
        <VarsPanel vars={f.vars || {}} />
        <div style={{ borderTop: '1px solid var(--border-soft)', padding: '14px 18px' }}>
          <CodeBlock code={A.code} highlight={[f.line]} />
        </div>
      </div>

      <h3>Quiz รวม — Final Check</h3>
      <Quiz2
        q="อัลกอริทึมเรียงลำดับใดมี time complexity O(n log n) <b>ทุกกรณี</b> (best/avg/worst เท่ากัน)?"
        options={["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"]}
        answer={2}
        explain="Merge Sort เป็น O(n log n) ทุกกรณี เพราะแบ่งครึ่งและ merge เสมอ — Quick Sort เฉลี่ย O(n log n) แต่ worst เป็น O(n²)"
      />
      <Quiz2
        q="ใน graph ที่มี V=10, E=15 BFS ใช้เวลาเท่าใด?"
        options={["O(V)", "O(E)", "O(V + E)", "O(V × E)"]}
        answer={2}
        explain="BFS เยี่ยมทุก node (V) และตรวจทุก edge (E) → O(V + E)"
      />
      <Quiz2
        q="DP กับ Greedy ตัวไหนการันตี optimal solution?"
        options={["Greedy", "DP", "ทั้งคู่", "ไม่มีตัวไหน"]}
        answer={1}
        explain="DP พิจารณาทุก subproblem จึง optimal เสมอ; Greedy เร็วกว่าแต่ optimal เฉพาะปัญหาที่มี Greedy Choice Property"
      />
      <Quiz2
        q="คุณต้อง insert ตัวเลข 1,000 ตัวลงในโครงสร้าง แล้วค้นหา 1,000 ครั้ง ตัวไหนรวมเร็วสุด?"
        options={[
          "Sorted Array (binary search)",
          "Linked List",
          "Hash Table (avg)",
          "BST (balanced)"
        ]}
        answer={2}
        explain="Hash Table: insert + search เฉลี่ย O(1) ต่อ operation → 2,000 × O(1) = O(n) — เร็วที่สุดในกรณีทั่วไป (แม้ worst case อาจเป็น O(n²))"
      />
    </React.Fragment>
  );
};

window.LessonsPart2 = Lessons2;
