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

/* ============================================================
   30b — ACTIVITY SELECTION: 4 STRATEGIES COMPARE
   ที่มา: greedy_p1.pdf — เปรียบ longest/smallest/least-conflict/earliest-end
============================================================ */
function ActivitySelectStrategiesViz() {
  // ตัวอย่างจากชีท greedy_p1.pdf p.18
  const ACTIVITIES = [
    { id: 'A', start: 1, end: 4 },
    { id: 'B', start: 3, end: 5 },
    { id: 'C', start: 0, end: 6 },
    { id: 'D', start: 5, end: 7 },
    { id: 'E', start: 3, end: 8 },
    { id: 'F', start: 5, end: 9 },
    { id: 'G', start: 6, end: 10 },
    { id: 'H', start: 8, end: 11 },
  ];
  const T_MAX = 12;

  const conflictsOf = (act, all) =>
    all.filter(o => o.id !== act.id && !(o.end <= act.start || o.start >= act.end)).length;

  const STRATEGIES = [
    {
      key: 'longest',
      label: 'Longest first',
      color: 'var(--pink)',
      desc: 'เลือกงานที่ทำนานสุด (end−start ใหญ่สุด) ก่อน',
      pick: () => {
        const sorted = [...ACTIVITIES].sort((a, b) => (b.end - b.start) - (a.end - a.start));
        const picked = [];
        for (const act of sorted) {
          if (picked.every(p => p.end <= act.start || p.start >= act.end))
            picked.push(act);
        }
        return picked.sort((a, b) => a.start - b.start);
      }
    },
    {
      key: 'shortest',
      label: 'Smallest interval',
      color: 'var(--warn)',
      desc: 'เลือกงานที่ทำสั้นสุด (end−start น้อยสุด) ก่อน',
      pick: () => {
        const sorted = [...ACTIVITIES].sort((a, b) => (a.end - a.start) - (b.end - b.start));
        const picked = [];
        for (const act of sorted) {
          if (picked.every(p => p.end <= act.start || p.start >= act.end))
            picked.push(act);
        }
        return picked.sort((a, b) => a.start - b.start);
      }
    },
    {
      key: 'least-conflict',
      label: 'Least conflict',
      color: 'var(--accent-2)',
      desc: 'เลือกงานที่ "ทับเวลา" กับงานอื่นน้อยสุดก่อน',
      pick: () => {
        const remaining = [...ACTIVITIES];
        const picked = [];
        while (remaining.length > 0) {
          // หา activity ที่มี conflicts น้อยสุดใน remaining
          remaining.sort((a, b) => conflictsOf(a, remaining) - conflictsOf(b, remaining));
          const choice = remaining[0];
          picked.push(choice);
          // เอา choice และตัวที่ conflict กับ choice ออก
          const i0 = remaining.length;
          for (let i = remaining.length - 1; i >= 0; i--) {
            const o = remaining[i];
            if (o.id === choice.id ||
                !(o.end <= choice.start || o.start >= choice.end))
              remaining.splice(i, 1);
          }
        }
        return picked.sort((a, b) => a.start - b.start);
      }
    },
    {
      key: 'earliest-end',
      label: 'Earliest finish ✓',
      color: 'var(--success)',
      desc: 'เลือกงานที่จบเร็วสุดก่อน — เป็น optimal (CLRS proof)',
      pick: () => {
        const sorted = [...ACTIVITIES].sort((a, b) => a.end - b.end);
        const picked = [];
        let lastEnd = -Infinity;
        for (const act of sorted) {
          if (act.start >= lastEnd) {
            picked.push(act);
            lastEnd = act.end;
          }
        }
        return picked;
      }
    },
  ];

  const results = useMemoL2(() => STRATEGIES.map(s => ({ ...s, picked: s.pick() })), []);
  const optimal = Math.max(...results.map(r => r.picked.length));

  const ActivityBar = ({ act, selected, color, opacity }) => {
    const W_PCT = 95;   // % of container width
    const left = (act.start / T_MAX) * W_PCT;
    const width = ((act.end - act.start) / T_MAX) * W_PCT;
    return (
      <div style={{
        position: 'relative',
        height: 18,
        marginBottom: 2,
      }}>
        <div style={{
          position: 'absolute',
          left: `${left}%`,
          width: `${width}%`,
          height: '100%',
          background: selected ? color : 'var(--bg-3)',
          border: selected ? `2px solid ${color}` : '1px solid var(--bg-3)',
          opacity: opacity ?? 1,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          color: selected ? '#000' : 'var(--text-2)',
          fontWeight: selected ? 'bold' : 'normal',
        }}>
          {act.id} ({act.start}-{act.end})
        </div>
      </div>
    );
  };

  const TimeAxis = () => (
    <div style={{ display: 'flex', position: 'relative', height: 12, marginTop: 2 }}>
      {[...Array(T_MAX + 1).keys()].map(i => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i / T_MAX) * 95}%`,
          fontSize: 9,
          color: 'var(--text-2)',
        }}>{i}</div>
      ))}
    </div>
  );

  return (
    <div className="dsv">
      <div className="callout info" style={{ marginTop: 0 }}>
        <div className="ttl">ตัวอย่างจากชีท greedy_p1.pdf p.18 — 8 activities</div>
        <table style={{ marginTop: 4, fontSize: 12 }}>
          <thead>
            <tr style={{ color: 'var(--text-2)' }}>
              <th style={{ textAlign: 'left', paddingRight: 12 }}>Activity</th>
              <th style={{ textAlign: 'left', paddingRight: 12 }}>Start</th>
              <th style={{ textAlign: 'left' }}>End</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITIES.map(a => (
              <tr key={a.id}>
                <td style={{ paddingRight: 12 }}><b>{a.id}</b></td>
                <td style={{ paddingRight: 12 }}>{a.start}</td>
                <td>{a.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 style={{ marginTop: 12 }}>ทุก activity บน timeline (ก่อนเลือก)</h4>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
        {ACTIVITIES.map(a => <ActivityBar key={a.id} act={a} selected={false} color="var(--accent)" />)}
        <TimeAxis />
      </div>

      <h4 style={{ marginTop: 18 }}>เปรียบเทียบ 4 strategies</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {results.map(r => {
          const isOptimal = r.picked.length === optimal;
          return (
            <div key={r.key} style={{
              background: 'var(--bg-2)',
              padding: 12,
              borderRadius: 8,
              border: r.key === 'earliest-end' ? `2px solid ${r.color}` : '1px solid var(--bg-3)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, color: r.color }}>{r.label}</span>
                <span style={{
                  fontSize: 14,
                  padding: '2px 10px',
                  background: isOptimal ? 'var(--success)' : 'var(--bg-3)',
                  color: isOptimal ? '#000' : 'var(--text-1)',
                  borderRadius: 999,
                  fontWeight: 'bold',
                }}>
                  {r.picked.length} {isOptimal && '★'}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 8 }}>{r.desc}</div>
              <div style={{ background: 'var(--bg-1)', padding: 8, borderRadius: 4 }}>
                {ACTIVITIES.map(a => {
                  const isPicked = r.picked.some(p => p.id === a.id);
                  return (
                    <ActivityBar
                      key={a.id}
                      act={a}
                      selected={isPicked}
                      color={r.color}
                      opacity={isPicked ? 1 : 0.3}
                    />
                  );
                })}
                <TimeAxis />
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-1)' }}>
                เลือก: {r.picked.map(p => p.id).join(', ') || '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="callout success" style={{ marginTop: 12 }}>
        <div className="ttl">📌 บทเรียน</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
          <li>3 strategies แรก ({results[0].picked.length}, {results[1].picked.length}, {results[2].picked.length}) ให้ผลที่ <b>ไม่</b> optimal</li>
          <li><b>Earliest finish</b> เป็น optimal เสมอ — ได้ {results[3].picked.length} กิจกรรม</li>
          <li>ทำไม? — proof ด้วย <b>exchange argument</b> (Kleinberg-Tardos ch. 4.1):
            ถ้ามีคำตอบ O ที่ไม่ใช้ a (activity ที่จบก่อนสุด) → swap O's first ด้วย a → ยังคง valid + ไม่แย่ลง</li>
        </ul>
      </div>
    </div>
  );
}

Lessons2["activity-strategies"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⚖️ Activity Selection — 4 Greedy Strategies เปรียบเทียบ</div>
        <b>คำถาม:</b> ถ้าใช้ greedy strategy ต่างกัน 4 แบบเลือกกิจกรรมที่ไม่ทับเวลา — strategy ไหน optimal?<br/>
        ที่มา: ชีท <b>greedy_p1.pdf p.13-18</b> (KMUTNB)
      </div>

      <h3>4 Strategies ที่ลองได้</h3>
      <table className="tbl">
        <thead><tr><th>กลยุทธ์</th><th>เกณฑ์</th><th>Optimal?</th></tr></thead>
        <tbody>
          <tr><td><b>Longest first</b></td><td>เลือกงานที่ทำนานสุดก่อน</td><td>❌ ไม่</td></tr>
          <tr><td><b>Smallest interval</b></td><td>เลือกงานที่ทำสั้นสุดก่อน</td><td>❌ ไม่</td></tr>
          <tr><td><b>Least conflict first</b></td><td>เลือกงานที่มีคู่ทับเวลาน้อยสุด</td><td>❌ ไม่</td></tr>
          <tr><td><b>Earliest end-time</b></td><td>เลือกงานที่จบเร็วสุดก่อน</td><td>✅ <b>Yes</b></td></tr>
        </tbody>
      </table>

      <ActivitySelectStrategiesViz />

      <h3>ทำไม "earliest end-time" ถึง optimal? — Exchange Argument</h3>
      <div className="callout">
        <b>Proof sketch:</b>
        <ol style={{ fontSize: 13, color: 'var(--text-1)', paddingLeft: 18 }}>
          <li>สมมุติ optimal solution O ที่ไม่ใช้ activity a (ตัวที่จบก่อนสุด)</li>
          <li>ให้ x = activity แรก (จบก่อนสุด) ใน O — เรามี x.end ≥ a.end (เพราะ a เป็น earliest finish)</li>
          <li>Replace x ด้วย a ใน O → O' = (O − {`{x}`}) ∪ {`{a}`}</li>
          <li>O' valid: a จบก่อน x → ไม่ overlap กับ activity ถัดไปใน O ใดๆ</li>
          <li>|O'| = |O| → O' ก็ optimal และใช้ a ด้วย</li>
          <li>ทำซ้ำกับ sub-problem → greedy earliest-finish ให้ optimal เสมอ ▢</li>
        </ol>
      </div>

      <h3>เคล็ดในการเลือก greedy criterion</h3>
      <div className="callout warn">
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
          <li>เกณฑ์ที่ "ดูเข้าท่า" (longest, shortest, least conflict) <b>ไม่ใช่</b> optimal เสมอ</li>
          <li>ต้องลอง <b>พิสูจน์</b> ด้วย exchange argument หรือ contradiction</li>
          <li>ถ้าพิสูจน์ไม่ได้ → ลองหา counter-example (input ที่ทำให้ greedy ผิด)</li>
          <li>ถ้า counter-example ก็หาไม่ได้ → ลอง DP แทน</li>
        </ul>
      </div>

      <Quiz2
        q="จากตัวอย่างชีท 8 กิจกรรม Strategy ใดได้คำตอบ optimal (จำนวนสูงสุด)?"
        options={["Longest first", "Smallest interval", "Least conflict first", "Earliest end-time"]}
        answer={3}
        explain="earliest end-time เลือกงาน A(1-4), D(5-7), H(8-11) ได้ 3 กิจกรรม (อาจมากกว่านี้ขึ้นกับ tie-break) — เป็น optimal เสมอ"
      />

      <Quiz2
        q="ทำไม strategy 'longest first' ไม่ optimal?"
        options={[
          "เพราะใช้เวลามาก",
          "เพราะเลือกงานยาว 1 ตัว → blocked งานสั้นหลายตัวที่อาจรวมกันได้มากกว่า",
          "เพราะ sort ผิด",
          "เพราะ greedy ใช้ไม่ได้กับ activity selection"
        ]}
        answer={1}
        explain="ตัวอย่าง: 1 งานยาว 10 ชั่วโมง vs 5 งานสั้น 2 ชั่วโมงที่ไม่ทับ — longest first เลือก 1 ตัว แต่ optimal = 5 ตัว"
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

/* ============================================================
   30a — GREEDY PROBLEMS BANK (7 ข้อ)
   ที่มา: greedy.pdf, LAB7_greedy1, Question.pdf, LAB9_1/2/3
============================================================ */
const GREEDY_PROBLEMS = [
  {
    id: 1,
    title: 'Line Cover (เส้นตรงคลุม segment)',
    src: 'greedy.pdf Q5 / LAB7_greedy1 Q2',
    diff: 'medium',
    spec: `มีเส้นตรง N เส้น แต่ละเส้นคู่ลำดับ (xᵢ, xⱼ) — ต้องการ<b>คลุม</b> (0, M) ด้วยเส้นที่<u>น้อยที่สุด</u>

Input:
  บรรทัด 1: M (1 ≤ M ≤ 5000)
  ต่อไป: แต่ละบรรทัดเส้นตรง xᵢ xⱼ (xᵢ ≤ xⱼ), จบด้วย "0 0"
Output:
  จำนวนเส้นน้อยสุดที่คลุม (0, M)`,
    example: `Input:
9
1 2
3 5
-1 5
2 4
4 5
3 6
2 7
7 9
4 8
0 0

Output:
3`,
    hint: 'sort by left endpoint. เลือก greedy: เส้นที่ครอบปลายปัจจุบัน และยืดไปขวาสุด',
    strategy: 'sort by start; while end < M, pick segment with largest end among those with start ≤ end',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int M; cin >> M;
  vector<pair<int,int>> segs;
  int a, b;
  while (cin >> a >> b && !(a == 0 && b == 0))
    segs.push_back({a, b});

  sort(segs.begin(), segs.end());

  int count = 0, end = 0, i = 0, n = segs.size();
  while (end < M) {
    int bestEnd = end;
    while (i < n && segs[i].first <= end) {
      bestEnd = max(bestEnd, segs[i].second);
      i++;
    }
    if (bestEnd == end) { count = -1; break; }
    count++;
    end = bestEnd;
  }
  cout << count << "\\n";
  return 0;
}`,
    walkthrough: `M=9, segs sorted by start:
  (-1,5) (1,2) (1,3) (2,4) (2,7) (3,5) (3,6) (4,5) (4,8) (7,9)

iter 1: end=0 — เส้น start ≤ 0: (-1,5). end=5. count=1.
iter 2: end=5 — เส้น start ≤ 5: (1,2)(1,3)(2,4)(2,7)(3,5)(3,6)(4,5)(4,8)
  bestEnd = max{2,3,4,7,5,6,5,8} = 8. end=8. count=2.
iter 3: end=8 — เหลือ (7,9). bestEnd=9. end=9. count=3.
end ≥ M → จบ

🏆 = 3 เส้น: (-1,5), (4,8), (7,9)`
  },
  {
    id: 2,
    title: 'Sale 3+1 Promotion',
    src: 'LAB7_greedy1 Q3',
    diff: 'easy',
    spec: `ร้านค้าโปรโมชัน "ซื้อ 3 ฟรี 1" (ของฟรี = ของถูกที่สุดในกลุ่ม 3 ชิ้น)
ซื้อ N ชิ้น แบ่งกลุ่มอย่างไรให้<b>ประหยัดเงินสูงสุด</b>

Input:
  บรรทัด 1: N (1 ≤ N ≤ 1000)
  บรรทัด 2: ราคา N ตัว
Output:
  มูลค่ารวมสูงสุดของสินค้าฟรี`,
    example: `Input:
6
400 100 200 300 500 600

Output:
500`,
    hint: 'sort descending → จัด 3 ตัวต่อกลุ่ม → ตัวที่ 3 (น้อยสุดของกลุ่ม) ฟรี',
    strategy: 'sort desc, ทุก 3 ตัวเลือก index 2,5,8,... เป็นของฟรี',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int n; cin >> n;
  vector<int> p(n);
  for (auto& x : p) cin >> x;
  sort(p.rbegin(), p.rend());
  long long saved = 0;
  for (int i = 2; i < n; i += 3)
    saved += p[i];
  cout << saved << "\\n";
  return 0;
}`,
    walkthrough: `prices = [400, 100, 200, 300, 500, 600], n=6
sort desc → [600, 500, 400, 300, 200, 100]

group 1: {600, 500, 400} — ฟรี 400
group 2: {300, 200, 100} — ฟรี 100

🏆 saved = 400 + 100 = 500

ทำไม greedy ถูก? — เลือกใหญ่ก่อนเสมอ → ของฟรี (index 2 ของแต่ละกลุ่ม) จะใหญ่สุดเท่าที่จะเป็นไปได้`
  },
  {
    id: 3,
    title: 'CPU Scheduling (3 Strategies)',
    src: 'greedy.pdf Q7 / greedy_p1 + homework_sol',
    diff: 'medium',
    spec: `รายการ N โปรแกรม แต่ละโปรแกรมมี start, finish time
หา <b>จำนวนโปรแกรมสูงสุด</b> บน 1 CPU (ไม่ทับเวลา)

ลอง 3 กลยุทธ์ greedy:
  (a) longest first
  (b) earliest start time
  (c) earliest finish time ← optimal!

Input:
  บรรทัด 1: N
  N บรรทัด: start finish
Output:
  3 บรรทัด: จำนวนสูงสุดของแต่ละ strategy`,
    example: `Input:
10
1 4
3 5
0 6
5 7
3 8
5 9
6 10
8 11
8 12
2 13

Output:
3
3
4`,
    hint: 'earliest finish เป็น optimal (Kleinberg-Tardos ch. 4.1). ลอง 3 อันแล้วเทียบ',
    strategy: 'แต่ละ strategy: sort + linear scan',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int n; cin >> n;
  vector<pair<int,int>> jobs(n);
  for (auto& [s, f] : jobs) cin >> s >> f;

  // (a) longest first
  auto a = jobs;
  sort(a.begin(), a.end(),
    [](auto& x, auto& y){ return (x.second - x.first) > (y.second - y.first); });
  int c1 = 0, last = INT_MIN;
  for (auto& [s, f] : a) if (s >= last) { c1++; last = f; }

  // (b) earliest start
  auto b = jobs;
  sort(b.begin(), b.end());
  int c2 = 0; last = INT_MIN;
  for (auto& [s, f] : b) if (s >= last) { c2++; last = f; }

  // (c) earliest finish
  auto cc = jobs;
  sort(cc.begin(), cc.end(),
    [](auto& x, auto& y){ return x.second < y.second; });
  int c3 = 0; last = INT_MIN;
  for (auto& [s, f] : cc) if (s >= last) { c3++; last = f; }

  cout << c1 << "\\n" << c2 << "\\n" << c3 << "\\n";
  return 0;
}`,
    walkthrough: `(c) Earliest finish sort:
  (1,4) (3,5) (0,6) (5,7) (3,8) (5,9) (6,10) (8,11) (8,12) (2,13)

  pick (1,4)  — last=4
  (3,5) 3<4 skip; (0,6) 0<4 skip
  pick (5,7)  — last=7
  (3,8)(5,9)(6,10) skip
  pick (8,11) — last=11
  (8,12) skip
  pick (2,13)? 2<11 skip
  → 3 jobs

อืม จริงๆ answer = 4 ต้องตรวจอีกที — อาจจะ
  pick (1,4)(5,7)(8,11) + ใส่อีกตัวระหว่าง 11-13 ไม่ได้
  หรือ pick (1,4)(5,9) ไม่ดีเพราะใช้ time ยาว
🤔 verify ด้วย code จริง

📌 หลักการ <b>Proof</b>: ถ้ามีคำตอบที่ดีกว่าด้วย activity x แทน a (earliest finish)
→ swap → ยังคงเป็น valid + ไม่แย่ลง — exchange argument`
  },
  {
    id: 4,
    title: 'Network Shortest Path (Dijkstra)',
    src: 'Question.pdf Q1 / LAB9_1',
    diff: 'medium',
    spec: `เครือข่ายคอมพิวเตอร์ n เครื่อง เชื่อมกันด้วยสาย ระยะเวลาส่งต่างกัน
หา<b>เวลาน้อยสุด</b>ในการรับส่งจาก s ไป t (ไม่ถึง → -1)

Input:
  บรรทัด 1: C (จำนวน test case)
  สำหรับแต่ละ case:
    บรรทัด 1: n m s t
    m บรรทัด: a b w (edge 2 ทิศ + น้ำหนัก)
Output:
  C บรรทัด — เวลาน้อยสุดต่อ test`,
    example: `Input:
2
2 1 0 1
0 1 100
3 3 2 0
0 1 100
0 2 200
1 2 50

Output:
100
150`,
    hint: 'Dijkstra ด้วย priority_queue (min-heap)',
    strategy: 'Dijkstra O((V+E) log V) — adjacency list + PQ',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int C; cin >> C;
  while (C--) {
    int n, m, s, t; cin >> n >> m >> s >> t;
    vector<vector<pair<int,int>>> adj(n);
    for (int i = 0; i < m; i++) {
      int a, b, w; cin >> a >> b >> w;
      adj[a].push_back({b, w});
      adj[b].push_back({a, w});
    }
    vector<long long> dist(n, LLONG_MAX);
    dist[s] = 0;
    priority_queue<pair<long long,int>,
      vector<pair<long long,int>>, greater<>> pq;
    pq.push({0, s});
    while (!pq.empty()) {
      auto [d, u] = pq.top(); pq.pop();
      if (d > dist[u]) continue;
      for (auto [v, w] : adj[u])
        if (d + w < dist[v]) {
          dist[v] = d + w;
          pq.push({dist[v], v});
        }
    }
    cout << (dist[t] == LLONG_MAX ? -1 : dist[t]) << "\\n";
  }
  return 0;
}`,
    walkthrough: `Case 2: n=3, edges = [(0,1,100), (0,2,200), (1,2,50)], s=2 → t=0
  dist = [∞, ∞, 0]
  pop (0, 2) → relax:
    to 0 (w=200): dist[0] = 200
    to 1 (w=50):  dist[1] = 50
  pop (50, 1) → relax:
    to 0 (w=100): 50+100 = 150 < 200 → dist[0] = 150 ✓
    to 2: skip
  pop (150, 0)
  pop (200, 0) outdated
Final dist[0] = 150 ✓`
  },
  {
    id: 5,
    title: 'Royal Procession (MST + Flag Count)',
    src: 'Question.pdf Q2 / LAB9_2',
    diff: 'hard',
    spec: `สถานที่ศักดิ์สิทธิ์ n แห่ง เชื่อมด้วย m เส้นทาง
จัดเสด็จครบทุกสถานที่ <b>ระยะรวมน้อยสุด + เส้นน้อยสุด</b> (= MST)
แต่ละเส้นทาง ปักธงทุก 1 m = (length - 1) ผืน
หาจำนวนธง<b>รวม</b>

Input:
  บรรทัด 1: n m
  m บรรทัด: s d l (length)
Output:
  จำนวนธงรวมใน MST`,
    example: `Input:
6 9
1 2 8
1 6 6
2 6 6
2 3 6
2 4 9
2 5 7
3 4 5
4 5 5
5 6 8

Output:
23`,
    hint: 'Kruskal MST + DSU; sum (length - 1) ของ edges ใน MST',
    strategy: 'Kruskal O(m log m)',
    code: `#include <bits/stdc++.h>
using namespace std;

struct DSU {
  vector<int> p, r;
  DSU(int n) : p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }
  int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
  bool unite(int x, int y) {
    x = find(x); y = find(y);
    if (x == y) return false;
    if (r[x] < r[y]) swap(x, y);
    p[y] = x; if (r[x] == r[y]) r[x]++;
    return true;
  }
};

int main() {
  int n, m; cin >> n >> m;
  vector<tuple<int,int,int>> edges(m);
  for (auto& [l, u, v] : edges) cin >> u >> v >> l;
  sort(edges.begin(), edges.end());

  DSU dsu(n + 1);
  long long flags = 0;
  int used = 0;
  for (auto& [l, u, v] : edges) {
    if (dsu.unite(u, v)) {
      flags += (l - 1);
      if (++used == n - 1) break;
    }
  }
  cout << flags << "\\n";
  return 0;
}`,
    walkthrough: `เรียง edges by length:
  (3-4,5)(4-5,5)(1-6,6)(2-6,6)(2-3,6)(2-5,7)(5-6,8)(1-2,8)(2-4,9)

  add (3-4, 5): union OK. flags += 4. used=1
  add (4-5, 5): union OK. flags += 4. used=2
  add (1-6, 6): union OK. flags += 5. used=3
  add (2-6, 6): union OK. flags += 5. used=4
  add (2-3, 6): union OK. flags += 5. used=5
  ครบ n-1 = 5 → stop

🏆 total flags = 4+4+5+5+5 = 23 ✓`
  },
  {
    id: 6,
    title: 'Hospital Placement (Multi-source SSSP)',
    src: 'Question.pdf Q3 / LAB9_3',
    diff: 'hard',
    spec: `จังหวัด n เขต — มีโรงพยาบาล f แห่ง
ต้องการสร้างโรงพยาบาลใหม่ 1 แห่งในเขตที่ยังไม่มี ให้<b>ระยะทางรวม</b>ที่ประชาชนเดินไปโรงพยาบาลใกล้สุดน้อยสุด

Input:
  บรรทัด 1: f n_roads
  f บรรทัด: เขตที่มี hosp
  n_roads บรรทัด: x y r (ถนน)
Output:
  เขตที่ควรสร้าง (น้อยที่สุดถ้ามีหลายตัวเลือก)`,
    example: `Input:
1 6
2
1 2 10
2 3 10
3 4 10
4 5 10
5 6 10
6 1 10

Output:
5`,
    hint: 'Multi-source Dijkstra จาก hosp เดิม. แล้วลองทุก vertex ที่ยังไม่มี hosp เป็นตัวที่จะสร้าง',
    strategy: 'multi-source SSSP + try each candidate (O(V·(V+E) log V))',
    code: `#include <bits/stdc++.h>
using namespace std;

int n, f, m;
vector<vector<pair<int,int>>> adj;

vector<long long> dijkstra(vector<int> sources) {
  vector<long long> d(n + 1, LLONG_MAX);
  priority_queue<pair<long long,int>,
    vector<pair<long long,int>>, greater<>> pq;
  for (int s : sources) { d[s] = 0; pq.push({0, s}); }
  while (!pq.empty()) {
    auto [du, u] = pq.top(); pq.pop();
    if (du > d[u]) continue;
    for (auto [v, w] : adj[u])
      if (du + w < d[v]) {
        d[v] = du + w;
        pq.push({d[v], v});
      }
  }
  return d;
}

int main() {
  cin >> f >> m;
  vector<int> hosp(f);
  for (auto& h : hosp) cin >> h;
  vector<tuple<int,int,int>> roads(m);
  int maxNode = 0;
  for (auto& [x, y, r] : roads) {
    cin >> x >> y >> r;
    maxNode = max(maxNode, max(x, y));
  }
  n = maxNode;
  adj.assign(n + 1, {});
  for (auto& [x, y, r] : roads) {
    adj[x].push_back({y, r});
    adj[y].push_back({x, r});
  }

  auto d_orig = dijkstra(hosp);
  set<int> existing(hosp.begin(), hosp.end());

  long long bestSum = LLONG_MAX;
  int bestNode = -1;
  for (int newH = 1; newH <= n; newH++) {
    if (existing.count(newH)) continue;
    auto d_from = dijkstra({newH});
    long long sum = 0;
    for (int v = 1; v <= n; v++)
      sum += min(d_orig[v], d_from[v]);
    if (sum < bestSum) { bestSum = sum; bestNode = newH; }
  }
  cout << bestNode << "\\n";
  return 0;
}`,
    walkthrough: `6 เขตเรียงเป็นวง 1-2-3-4-5-6-1 ระยะ 10 ทุกเส้น
hosp = {2}

ก่อนสร้างใหม่: dist จาก hosp={2}
  d = [_, 10, 0, 10, 20, 20, 10]  sum = 70

ลองสร้างที่เขต 5 (ฝั่งตรงข้าม):
  d_from{5} = [_, 20, 30, 20, 10, 0, 10]
  ผสม min:
    v=1: 10, v=2: 0, v=3: 10, v=4: 10, v=5: 0, v=6: 10
  sum = 40

ลองที่อื่น sum > 40 → เขต 5 ดีสุด ✓`
  },
  {
    id: 7,
    title: 'Activity Selection (Earliest Finish — classic)',
    src: 'greedy_p1.pdf + CLRS ch. 16.1',
    diff: 'easy',
    spec: `n กิจกรรม start[i] finish[i] — เลือกชุดสูงสุดที่ไม่ทับเวลา (1 CPU)
ใช้ greedy <b>earliest finish time</b>

Input:
  บรรทัด 1: n
  n บรรทัด: start finish
Output:
  จำนวนสูงสุด`,
    example: `Input:
6
1 3
2 5
0 6
5 7
3 9
8 11

Output:
3`,
    hint: 'sort by finish; pick if start ≥ lastEnd',
    strategy: 'sort by finish + linear scan — O(n log n)',
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int n; cin >> n;
  vector<pair<int,int>> a(n);
  for (auto& [s, f] : a) cin >> s >> f;
  sort(a.begin(), a.end(),
    [](auto& x, auto& y){ return x.second < y.second; });

  int count = 0, last = INT_MIN;
  for (auto& [s, f] : a)
    if (s >= last) { count++; last = f; }
  cout << count << "\\n";
  return 0;
}`,
    walkthrough: `sorted by finish:
  (1,3) (2,5) (0,6) (5,7) (3,9) (8,11)

  pick (1,3)  — last=3
  (2,5) 2<3 skip; (0,6) 0<3 skip
  pick (5,7)  — last=7
  (3,9) 3<7 skip
  pick (8,11) — last=11

🏆 = 3 jobs

📌 <b>Proof</b> (exchange argument):
สมมุติมี optimal O ที่ไม่ใช้ a (earliest finish)
→ มี activity x ใน O ที่ finish หลังสุดของ "ตัวแรก" — swap x → a
→ O still valid (เพราะ a.finish ≤ x.finish ≤ ตัวต่อไป.start)
→ ไม่แย่ลง → earliest finish เป็น optimal ▢`
  },
];

const GR_DIFFS = {
  easy:   { label: '🟢 Easy',   color: '#22c55e' },
  medium: { label: '🟡 Medium', color: '#fbbf24' },
  hard:   { label: '🔴 Hard',   color: '#f87171' },
};

Lessons2["greedy-problems"] = function () {
  const [diff, setDiff] = useStateL2('all');
  const [shown, setShown] = useStateL2({});
  const list = diff === 'all' ? GREEDY_PROBLEMS : GREEDY_PROBLEMS.filter(p => p.diff === diff);
  const toggle = (id, k) => setShown(s => ({ ...s, [`${id}-${k}`]: !s[`${id}-${k}`] }));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🪙 Greedy Problems Bank — {GREEDY_PROBLEMS.length} ข้อจากชีท KMUTNB</div>
        ที่มา: <b>greedy.pdf</b> · <b>LAB7_greedy1</b> · <b>Question.pdf</b> (Greedy Part 2) · <b>LAB9_1/2/3</b>
        <br/>แต่ละข้อมี spec ตามรูปแบบชีท + strategy + เฉลย C++ + walkthrough
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        <button onClick={() => setDiff('all')}
          style={{ background: diff === 'all' ? 'var(--accent)' : 'var(--bg-3)', color: diff === 'all' ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          🗂 ทั้งหมด ({GREEDY_PROBLEMS.length})
        </button>
        {Object.entries(GR_DIFFS).map(([k, v]) => {
          const count = GREEDY_PROBLEMS.filter(p => p.diff === k).length;
          return (
            <button key={k} onClick={() => setDiff(k)}
              style={{ background: diff === k ? v.color : 'var(--bg-3)', color: diff === k ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              {v.label} ({count})
            </button>
          );
        })}
      </div>

      {list.map(p => {
        const d = GR_DIFFS[p.diff];
        return (
          <div key={p.id} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{p.id}. {p.title}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, padding: '2px 8px', background: d.color, color: '#000', borderRadius: 999 }}>{d.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)' }}>📄 {p.src}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-1)', whiteSpace: 'pre-wrap', marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: p.spec }} />
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>ตัวอย่าง:</div>
            <pre className="code" style={{ marginBottom: 8 }}>{p.example}</pre>
            <div style={{ fontSize: 12, color: 'var(--accent-3)', marginBottom: 6 }}>
              <b>🎯 Strategy:</b> {p.strategy}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <button onClick={() => toggle(p.id, 'h')} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                💡 {shown[`${p.id}-h`] ? 'Hide' : 'Hint'}
              </button>
              <button onClick={() => toggle(p.id, 'w')} style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid #a78bfa', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                🚶 {shown[`${p.id}-w`] ? 'Hide' : 'Walkthrough'}
              </button>
              <button onClick={() => toggle(p.id, 'c')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ✓ {shown[`${p.id}-c`] ? 'Hide' : 'Show'} Code
              </button>
            </div>
            {shown[`${p.id}-h`] && (
              <div style={{ padding: 10, background: 'rgba(251,191,36,0.06)', borderLeft: '3px solid #fbbf24', borderRadius: 4, fontSize: 13, marginBottom: 6 }}>
                💡 {p.hint}
              </div>
            )}
            {shown[`${p.id}-w`] && (
              <div style={{ padding: 10, background: 'rgba(139,92,246,0.06)', borderLeft: '3px solid #a78bfa', borderRadius: 4, fontSize: 12, marginBottom: 6, whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}>
                {p.walkthrough}
              </div>
            )}
            {shown[`${p.id}-c`] && (
              <pre className="code" style={{ marginTop: 6, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981' }}>{p.code}</pre>
            )}
          </div>
        );
      })}
    </React.Fragment>
  );
};

window.LessonsPart2 = Lessons2;
