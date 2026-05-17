/* Lessons Part 6 — Worked Examples + Cheat Sheets + Decision Tree + Flashcards + Big-O Analyzer */

const { useState: useS6, useMemo: useM6, useEffect: useE6 } = React;

const Lessons6 = {};

/* ============================================================
   WORKED EXAMPLE — generic step-by-step component
============================================================ */
function WorkedExample({ title, problem, steps, answer, takeaway }) {
  const [idx, setIdx] = useS6(0);
  const [showAll, setShowAll] = useS6(false);

  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, margin: '16px 0' }}>
      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>WORKED EXAMPLE</div>
      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{title}</div>
      <div style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, marginBottom: 12, fontFamily: 'monospace', fontSize: 14 }}>
        <span style={{ color: 'var(--text-2)' }}>📋 Problem: </span>
        <span dangerouslySetInnerHTML={{ __html: problem }} />
      </div>

      {!showAll ? (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
              style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>◀ ก่อนหน้า</button>
            <span style={{ color: 'var(--text-2)', fontFamily: 'monospace', fontSize: 13 }}>Step {idx + 1} / {steps.length}</span>
            <button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1}
              style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: idx === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === steps.length - 1 ? 0.4 : 1, fontWeight: 600 }}>ถัดไป ▶</button>
            <button onClick={() => setShowAll(true)} style={{ background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>ดูทุก step</button>
          </div>

          <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 8, borderLeft: '3px solid var(--accent-2)', minHeight: 90 }}>
            <div style={{ fontSize: 13, color: 'var(--accent-2)', fontWeight: 600, marginBottom: 6 }}>{steps[idx].title}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-0)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: steps[idx].body }} />
            {steps[idx].why && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' }}>💡 ทำไม: {steps[idx].why}</div>}
          </div>

          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, background: i <= idx ? 'var(--accent-2)' : 'var(--bg-3)', borderRadius: 2, transition: 'background .2s' }}></div>
            ))}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button onClick={() => setShowAll(false)} style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, marginBottom: 10 }}>← Step mode</button>
          {steps.map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, borderLeft: '3px solid var(--accent-2)', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--accent-2)', fontWeight: 600, marginBottom: 4 }}>Step {i + 1}: {s.title}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: s.body }} />
              {s.why && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' }}>💡 {s.why}</div>}
            </div>
          ))}
        </React.Fragment>
      )}

      <div style={{ marginTop: 14, padding: 12, background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', borderRadius: 6 }}>
        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, letterSpacing: '0.08em' }}>✓ ANSWER</div>
        <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-0)', marginTop: 4 }} dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
      {takeaway && (
        <div style={{ marginTop: 8, padding: 10, background: 'var(--bg-1)', borderRadius: 6, fontSize: 13, color: 'var(--text-1)' }}>
          <b>🎯 Takeaway:</b> {takeaway}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CHEAT SHEET component — quick reference card
============================================================ */
function CheatSheet({ title, sections }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(94,234,212,0.06), rgba(168,139,250,0.06))', border: '1px solid var(--accent-2)', borderRadius: 12, padding: 18, margin: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>📋</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-2)' }}>CHEAT SHEET — {title}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-0)', fontFamily: s.mono ? 'monospace' : 'inherit', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: s.value }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PITFALLS / GOTCHAS component
============================================================ */
function Pitfalls({ items }) {
  return (
    <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 12, padding: 18, margin: '16px 0' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24', marginBottom: 10 }}>⚠️ Pitfalls — ที่อาจารย์ชอบหลอก</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ background: '#fbbf24', color: '#000', minWidth: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: it.trap }} />
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }} dangerouslySetInnerHTML={{ __html: '✓ ' + it.fix }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.LearningKit = { WorkedExample, CheatSheet, Pitfalls };

/* ============================================================
   43 — DECISION TREE: เจอโจทย์แบบนี้ → ใช้อะไร
============================================================ */
const DECISION_PATHS = [
  {
    icon: '🔍',
    name: 'ค้นหาในข้อมูล',
    paths: [
      { q: 'ข้อมูลเรียงแล้ว?', yes: 'binary-search', yes_label: 'Binary Search O(log n)', no_q: 'ข้อมูลกระจายสม่ำเสมอ?', no_yes: 'interpolation-search', no_yes_label: 'Interpolation Search', no_no: 'linear-search', no_no_label: 'Linear Search O(n)' },
    ]
  },
  {
    icon: '📊',
    name: 'จัดเรียงข้อมูล',
    paths: [
      { q: 'ข้อมูลน้อย (n < 50)?', yes_label: 'Insertion Sort — code สั้น cache friendly', yes: 'insertion-sort' },
      { q: 'ต้องการเสถียร (stable)?', yes_label: 'Merge Sort — O(n log n) เสถียร', yes: 'merge-sort' },
      { q: 'ต้องการ in-place + เร็วเฉลี่ย?', yes_label: 'Quick Sort — random pivot กัน worst', yes: 'quick-sort' },
      { q: 'ต้องการ worst case ดี + in-place?', yes_label: 'Heap Sort — O(n log n) garantee', yes: 'heap-sort' },
    ]
  },
  {
    icon: '🎯',
    name: 'หา Top-K / k-th smallest',
    paths: [
      { q: 'k คงที่และเล็ก?', yes_label: 'Min/Max Heap O(n log k)', yes: 'heap-sort' },
      { q: 'แค่ k-th element เดียว?', yes_label: 'Quick Select O(n) เฉลี่ย', yes: 'quick-select' },
    ]
  },
  {
    icon: '🌳',
    name: 'เก็บข้อมูลที่ insert/search/delete บ่อย',
    paths: [
      { q: 'ต้องการเรียงตลอด + traversal?', yes_label: 'BST (balanced)', yes: 'bst' },
      { q: 'แค่ lookup ด้วย key?', yes_label: 'Hash Table O(1) เฉลี่ย', yes: 'hashing' },
      { q: 'lookup ลำดับ (FIFO/LIFO)?', yes_label: 'Stack หรือ Queue', yes: 'stack' },
    ]
  },
  {
    icon: '🗺️',
    name: 'Graph traversal / shortest path',
    paths: [
      { q: 'หาเส้นทางสั้นสุด unweighted?', yes_label: 'BFS — ระดับต่อระดับ', yes: 'bfs' },
      { q: 'แค่เดินดูทุก node?', yes_label: 'DFS — recursion / stack', yes: 'dfs' },
      { q: 'shortest path น้ำหนัก ≥ 0?', yes_label: 'Dijkstra + min-heap', yes: 'dijkstra' },
      { q: 'มีวงวนไหม (DAG)?', yes_label: 'Cycle Detection (DFS+recStack)', yes: 'cycle-detect' },
      { q: 'เรียงงานก่อนหลัง (DAG)?', yes_label: 'Topological Sort', yes: 'topo-sort' },
    ]
  },
  {
    icon: '💎',
    name: 'Optimization (max/min)',
    paths: [
      { q: 'หั่นได้ + เรียง local optimum ได้?', yes_label: 'Greedy — Fractional Knapsack, Activity', yes: 'greedy' },
      { q: 'มี overlapping sub-problems?', yes_label: 'DP — 0/1 Knapsack, Coin Change', yes: 'dp' },
      { q: 'ลองทุกแบบและตัดกิ่ง?', yes_label: 'Backtracking — N-Queens, Subset Sum', yes: 'backtracking' },
      { q: 'ลองทุกแบบไม่มีตัด?', yes_label: 'Exhaustive — Permutation', yes: 'exhaustive' },
    ]
  },
  {
    icon: '🧮',
    name: 'แก้ Recurrence T(n) = ?',
    paths: [
      { q: 'รูป a·T(n/b) + n^d?', yes_label: 'Master Theorem (Calc)', yes: 'master-calc' },
      { q: 'รูป T(n-c) หรือ 2T(n-1)?', yes_label: 'Substitution / Recurrence Solver', yes: 'recurrence-solver' },
    ]
  },
];

Lessons6["decision-tree"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🌲 Decision Tree — เจอโจทย์ใช้อะไร</div>
        ใช้เป็น checklist ก่อนเขียนคำตอบในข้อสอบ — เห็นโจทย์ → ไล่ลง tree → รู้ทันทีว่าใช้ algorithm อะไร
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16, marginTop: 14 }}>
        {DECISION_PATHS.map((cat, ci) => (
          <div key={ci} style={{ background: 'var(--bg-2)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>{cat.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-0)' }}>{cat.name}</span>
            </div>
            {cat.paths.map((p, pi) => (
              <div key={pi} style={{ marginBottom: 12, paddingLeft: 8, borderLeft: '2px solid var(--bg-3)' }}>
                <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 4 }}><b>Q:</b> {p.q}</div>
                {p.yes_label && (
                  <div style={{ marginLeft: 14, fontSize: 13, padding: '6px 10px', background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', borderRadius: 4, marginBottom: 4, cursor: p.yes ? 'pointer' : 'default' }}
                    onClick={() => p.yes && (window.location.hash = '/' + p.yes)}>
                    <b style={{ color: '#10b981' }}>✓ Yes:</b> <span style={{ color: 'var(--text-0)' }}>{p.yes_label}</span>
                  </div>
                )}
                {p.no_q && (
                  <div style={{ marginLeft: 14 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}><b>No → Q:</b> {p.no_q}</div>
                    <div style={{ marginLeft: 14, fontSize: 13, padding: '4px 10px', background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981', borderRadius: 4, marginBottom: 2, cursor: 'pointer' }}
                      onClick={() => window.location.hash = '/' + p.no_yes}>
                      <b style={{ color: '#10b981' }}>Yes:</b> {p.no_yes_label}
                    </div>
                    <div style={{ marginLeft: 14, fontSize: 13, padding: '4px 10px', background: 'rgba(248,113,113,0.06)', borderLeft: '3px solid #f87171', borderRadius: 4, cursor: 'pointer' }}
                      onClick={() => window.location.hash = '/' + p.no_no}>
                      <b style={{ color: '#f87171' }}>No:</b> {p.no_no_label}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 22 }}>📋 Quick Lookup — Keyword → Algorithm</h3>
      <table className="tbl">
        <thead><tr><th>คำในโจทย์</th><th>มัก = algorithm</th></tr></thead>
        <tbody>
          <tr><td>"shortest path", "fastest"</td><td>BFS (unweighted) / Dijkstra (weighted)</td></tr>
          <tr><td>"all pairs"</td><td>Floyd-Warshall O(V³)</td></tr>
          <tr><td>"order of tasks", "prerequisite"</td><td>Topological Sort</td></tr>
          <tr><td>"deadline + profit"</td><td>Greedy (Job Sequencing)</td></tr>
          <tr><td>"hai หรือไม่หยิบ", "0/1"</td><td>0/1 Knapsack (DP)</td></tr>
          <tr><td>"หั่นได้"</td><td>Fractional Knapsack (Greedy)</td></tr>
          <tr><td>"เลือก k ตัว"</td><td>Combination (Backtracking)</td></tr>
          <tr><td>"จัดเรียง n!", "ทุกการสลับ"</td><td>Permutation (Exhaustive)</td></tr>
          <tr><td>"k-th smallest", "median"</td><td>Quick Select O(n)</td></tr>
          <tr><td>"window ขนาด k"</td><td>Sliding Window</td></tr>
          <tr><td>"sum = target", "two sum sorted"</td><td>Two Pointers</td></tr>
          <tr><td>"matching pair", "duplicate"</td><td>Hash Table</td></tr>
          <tr><td>"min cost spanning"</td><td>MST — Prim / Kruskal</td></tr>
          <tr><td>"กี่วิธี (count ways)"</td><td>DP (มัก)</td></tr>
          <tr><td>"recursion ลึกซ้ำ"</td><td>Memoization (DP)</td></tr>
        </tbody>
      </table>
    </React.Fragment>
  );
};

/* ============================================================
   44 — FLASHCARDS (spaced repetition)
============================================================ */
const FLASHCARDS = [
  { front: "Big-O ของ Linear Search?", back: "Worst/Avg: O(n)<br>Best: O(1)<br><br>เพราะดูทีละช่อง — เจอเร็วสุดที่ตำแหน่งแรก, ช้าสุดต้องดูทุกช่อง", cat: "Search" },
  { front: "Big-O ของ Binary Search?", back: "O(log n) — แบ่งครึ่งทุกครั้ง<br>เงื่อนไข: ข้อมูล<b>ต้องเรียงแล้ว</b>", cat: "Search" },
  { front: "Big-O ของ Interpolation Search?", back: "Avg: O(log log n) — ข้อมูลกระจายสม่ำเสมอ<br>Worst: O(n) — ข้อมูลไม่สม่ำเสมอ", cat: "Search" },

  { front: "Big-O ของ Bubble Sort?", back: "Worst/Avg: O(n²)<br>Best: O(n) — ถ้าเรียงแล้วและใช้ flag<br>Stable: ใช่<br>In-place: ใช่", cat: "Sort" },
  { front: "Big-O ของ Selection Sort?", back: "ทุกกรณี: O(n²) — ต้องสแกนหา min ทุกครั้ง<br>Stable: ไม่<br>In-place: ใช่<br>Swap: O(n) — น้อยกว่า bubble", cat: "Sort" },
  { front: "Big-O ของ Insertion Sort?", back: "Worst/Avg: O(n²)<br>Best: O(n) — ข้อมูลเรียงแล้ว<br>Stable: ใช่<br>เร็วสำหรับ n เล็ก/nearly sorted", cat: "Sort" },
  { front: "Big-O ของ Merge Sort?", back: "ทุกกรณี: O(n log n)<br>Space: O(n) — ไม่ in-place<br>Stable: ใช่<br>Recurrence: T(n) = 2T(n/2) + n", cat: "Sort" },
  { front: "Big-O ของ Quick Sort?", back: "Avg: O(n log n)<br>Worst: O(n²) — pivot ไม่ดี<br>Best: O(n log n)<br>Space: O(log n) — recursion stack<br>Stable: ไม่", cat: "Sort" },
  { front: "Big-O ของ Heap Sort?", back: "ทุกกรณี: O(n log n)<br>Space: O(1) — in-place<br>Stable: ไม่<br>Build heap: O(n)", cat: "Sort" },

  { front: "Master Theorem 3 cases?", back: "T(n) = a·T(n/b) + O(n^d), เปรียบ d กับ log_b(a):<br>• d &lt; log_b(a) → O(n^log_b(a))<br>• d = log_b(a) → O(n^d log n)<br>• d &gt; log_b(a) → O(n^d)", cat: "Math" },
  { front: "Recurrence ของ Merge Sort?", back: "T(n) = 2T(n/2) + n<br>a=2, b=2, d=1<br>log₂2 = 1 = d → Case 2 → <b>O(n log n)</b>", cat: "Math" },
  { front: "Recurrence ของ Strassen?", back: "T(n) = 7T(n/2) + n²<br>a=7, b=2, d=2<br>log₂7 ≈ 2.807 &gt; d=2 → Case 1 → <b>O(n^2.807)</b>", cat: "Math" },
  { front: "Recurrence ของ Binary Search?", back: "T(n) = T(n/2) + 1<br>a=1, b=2, d=0<br>log₂1 = 0 = d → Case 2 → <b>O(log n)</b>", cat: "Math" },
  { front: "ผลรวม 1 + 2 + ... + n?", back: "n(n+1)/2 = O(n²)", cat: "Math" },
  { front: "ผลรวม 1 + 2 + 4 + ... + 2ⁿ?", back: "2^(n+1) - 1 = O(2ⁿ)", cat: "Math" },

  { front: "Stack vs Queue?", back: "Stack — LIFO — push/pop ปลายเดียว<br>Queue — FIFO — enqueue ปลายหนึ่ง dequeue อีกปลาย", cat: "DS" },
  { front: "Hash Table — เฉลี่ย / worst?", back: "Avg: O(1) — hash function ดี + ไม่ collide<br>Worst: O(n) — collide ทุกตัว → linked list ยาว", cat: "DS" },
  { front: "BST — average vs worst?", back: "Avg (balanced): O(log n)<br>Worst (skewed/sorted insert): O(n)<br>แก้: AVL / Red-Black Tree", cat: "DS" },
  { front: "Heap — find max / insert / extract?", back: "find max: O(1) — root เลย<br>insert: O(log n) — bubble up<br>extract max: O(log n) — sift down", cat: "DS" },

  { front: "BFS — ใช้ DS อะไร? ใช้ทำอะไรดี?", back: "ใช้ <b>Queue</b><br>เหมาะ: shortest path ใน unweighted graph<br>Time: O(V + E)", cat: "Graph" },
  { front: "DFS — ใช้ DS อะไร? ใช้ทำอะไรดี?", back: "ใช้ <b>Stack</b> หรือ <b>Recursion</b><br>เหมาะ: cycle detect, topo sort, backtracking<br>Time: O(V + E)", cat: "Graph" },
  { front: "Dijkstra — ใช้กับกราฟแบบไหน?", back: "Weighted graph ที่<b>น้ำหนักไม่ติดลบ</b><br>ใช้ min-heap + relaxation<br>Time: O((V+E) log V)", cat: "Graph" },
  { front: "Topological Sort ใช้ได้กับกราฟแบบไหน?", back: "<b>DAG</b> เท่านั้น (Directed Acyclic Graph)<br>ถ้ามี cycle → topo sort ไม่ได้<br>วิธี: DFS post-order reversed หรือ Kahn (in-degree)", cat: "Graph" },
  { front: "Adjacency List vs Matrix?", back: "<b>Matrix:</b> O(V²) space, edge lookup O(1) — เหมาะ dense<br><b>List:</b> O(V+E) space, neighbor scan O(deg) — เหมาะ sparse", cat: "Graph" },

  { front: "Greedy ทำงานได้เมื่อ?", back: "1. <b>Greedy choice property</b> — local optimum นำไป global<br>2. <b>Optimal substructure</b><br>ตัวอย่าง: Fractional Knapsack, Activity Selection", cat: "Paradigm" },
  { front: "DP ใช้เมื่อ?", back: "1. <b>Overlapping sub-problems</b><br>2. <b>Optimal substructure</b><br>ตัวอย่าง: Fibonacci, 0/1 Knapsack, Coin Change", cat: "Paradigm" },
  { front: "Backtracking ต่างจาก Brute Force?", back: "Brute Force: ลองทุกแบบ<br><b>Backtracking:</b> ลองแบบมี <b>pruning</b> — ตัดกิ่งที่รู้ว่าไม่ valid<br>เช่น N-Queens — ตรวจ safe ก่อน recurse", cat: "Paradigm" },
  { front: "0/1 vs Fractional Knapsack?", back: "<b>0/1:</b> หยิบหรือไม่หยิบ — DP O(nW)<br><b>Fractional:</b> หั่นได้ — Greedy O(n log n) เรียง v/w", cat: "Paradigm" },

  { front: "Permutation n ตัว — กี่แบบ?", back: "n! แบบ<br>n=4 → 24, n=5 → 120, n=10 → 3,628,800", cat: "Math" },
  { front: "Subset n ตัว — กี่เซต?", back: "2ⁿ เซต (รวม empty set)<br>n=5 → 32, n=10 → 1024", cat: "Math" },
  { front: "Combination C(n,k)?", back: "C(n,k) = n! / (k!·(n-k)!)<br>= จำนวนวิธีเลือก k ตัวจาก n โดยไม่สนใจลำดับ", cat: "Math" },

  { front: "Fibonacci recursive vs DP?", back: "Recursive: O(2ⁿ) — overlapping<br>DP/Memo: O(n) — เก็บคำตอบเก่า<br>Iterative + 2 vars: O(n) time, O(1) space", cat: "Paradigm" },
  { front: "Tower of Hanoi T(n)?", back: "T(n) = 2T(n-1) + 1<br>= O(2ⁿ)<br>n=64 → 1.8×10¹⁹ moves", cat: "Math" },
  { front: "Strassen ใช้ multiplication กี่ครั้ง?", back: "<b>7</b> ครั้ง (M1-M7) แทน 8 ครั้งของ Naive DAC<br>→ T(n) = 7T(n/2) + n² = O(n^2.807)", cat: "Advanced" },
  { front: "Karatsuba ใช้ multiplication กี่ครั้ง?", back: "<b>3</b> ครั้ง แทน 4 ของ naive<br>z2, z0, z1 (= z2+z0+z1 จากการคูณ 1 ครั้ง)<br>T(n) = 3T(n/2) + n = O(n^1.585)", cat: "Advanced" },
];

Lessons6["flashcards"] = function () {
  const [cat, setCat] = useS6('ทั้งหมด');
  const cards = useM6(() => cat === 'ทั้งหมด' ? FLASHCARDS : FLASHCARDS.filter(c => c.cat === cat), [cat]);
  const [idx, setIdx] = useS6(0);
  const [flipped, setFlipped] = useS6(false);
  const [stats, setStats] = useS6({ known: 0, review: 0 });

  useE6(() => { setIdx(0); setFlipped(false); }, [cat]);

  const cats = ['ทั้งหมด', ...Array.from(new Set(FLASHCARDS.map(c => c.cat)))];
  const card = cards[idx % cards.length];

  const next = () => { setIdx(i => (i + 1) % cards.length); setFlipped(false); };
  const know = () => { setStats(s => ({ ...s, known: s.known + 1 })); next(); };
  const review = () => { setStats(s => ({ ...s, review: s.review + 1 })); next(); };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🃏 Flashcards — ทบทวนแบบ active recall</div>
        เห็นคำถาม → ลองตอบในใจ/พูดออกเสียง → กลับการ์ด → เช็คตัวเอง<br />
        วิธี<b>active recall</b> มีงานวิจัยยืนยันว่าจำได้ดีกว่าอ่านซ้ำ ๆ 2-3 เท่า
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{
              background: cat === c ? 'var(--accent)' : 'var(--bg-2)',
              color: cat === c ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13, fontWeight: cat === c ? 600 : 400
            }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{stats.known}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>รู้แล้ว ✓</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>{stats.review}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ทบทวน 🔄</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-2)' }}>{idx + 1}/{cards.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>การ์ด</div>
        </div>
      </div>

      <div onClick={() => setFlipped(!flipped)}
        style={{
          background: flipped ? 'linear-gradient(135deg, rgba(94,234,212,0.12), rgba(168,139,250,0.12))' : 'var(--bg-2)',
          border: '1px solid ' + (flipped ? 'var(--accent-2)' : 'var(--border)'),
          borderRadius: 14, padding: 30, minHeight: 240, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',
          transition: 'all .25s'
        }}>
        <div style={{ fontSize: 11, color: flipped ? 'var(--accent-2)' : 'var(--text-2)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 14 }}>
          {flipped ? '← ANSWER' : 'QUESTION →'}  คลิกเพื่อพลิก
        </div>
        <div style={{ fontSize: flipped ? 16 : 22, fontWeight: 600, color: 'var(--text-0)', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: flipped ? card.back : card.front }} />
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 14 }}>หมวด: {card.cat}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        {!flipped ? (
          <button onClick={() => setFlipped(true)} style={{ flex: 1, background: 'var(--accent)', color: '#000', padding: 12, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>🔄 พลิกการ์ด</button>
        ) : (
          <React.Fragment>
            <button onClick={review} style={{ flex: 1, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>🔄 ต้องทบทวนอีก</button>
            <button onClick={know} style={{ flex: 1, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>✓ จำได้แล้ว</button>
          </React.Fragment>
        )}
      </div>

      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button onClick={() => { setIdx((idx - 1 + cards.length) % cards.length); setFlipped(false); }} style={{ flex: 1, background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: 8, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>◀ Prev</button>
        <button onClick={() => { setStats({ known: 0, review: 0 }); setIdx(0); setFlipped(false); }} style={{ flex: 1, background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: 8, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>🔄 รีเซ็ต</button>
        <button onClick={next} style={{ flex: 1, background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: 8, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Skip ▶</button>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   45 — BIG-O ANALYZER (analyze code line-by-line)
============================================================ */
const ANALYZE_EXAMPLES = [
  {
    name: "Single loop",
    code: [
      { line: "for (int i = 0; i < n; i++) {", cost: "n+1", note: "ตรวจ i &lt; n รัน n+1 ครั้ง" },
      { line: "  sum += a[i];", cost: "n", note: "ทำ n ครั้ง" },
      { line: "}", cost: "—", note: "" }
    ],
    total: "T(n) = 2n + 1 = O(n)"
  },
  {
    name: "Nested loop",
    code: [
      { line: "for (int i = 0; i < n; i++) {", cost: "n+1", note: "outer loop" },
      { line: "  for (int j = 0; j < n; j++) {", cost: "n(n+1)", note: "inner ทำ n ครั้งของ outer" },
      { line: "    cnt++;", cost: "n²", note: "n × n ครั้ง" },
      { line: "  }", cost: "—", note: "" },
      { line: "}", cost: "—", note: "" }
    ],
    total: "T(n) = n² + 2n + 1 = O(n²)"
  },
  {
    name: "Triangular nested",
    code: [
      { line: "for (int i = 0; i < n; i++) {", cost: "n+1", note: "" },
      { line: "  for (int j = i+1; j < n; j++) {", cost: "≤ Σ(n-i)", note: "j เริ่มที่ i+1" },
      { line: "    cnt++;", cost: "n(n-1)/2", note: "= 1+2+...+(n-1)" },
      { line: "  }", cost: "—", note: "" },
      { line: "}", cost: "—", note: "" }
    ],
    total: "T(n) = n(n-1)/2 + ... = O(n²)"
  },
  {
    name: "Logarithmic loop",
    code: [
      { line: "for (int i = 1; i < n; i *= 2) {", cost: "log₂n", note: "i = 1,2,4,8,...,n" },
      { line: "  sum++;", cost: "log₂n", note: "" },
      { line: "}", cost: "—", note: "" }
    ],
    total: "T(n) = 2·log₂n + 1 = O(log n)"
  },
  {
    name: "Loop ที่ multiply by 3",
    code: [
      { line: "for (int i = 1; i < n; i *= 3) {", cost: "log₃n", note: "i = 1,3,9,27,...,n" },
      { line: "  sum++;", cost: "log₃n", note: "" },
      { line: "}", cost: "—", note: "" }
    ],
    total: "T(n) = 2·log₃n = O(log n) — base ของ log ไม่สำคัญ"
  },
  {
    name: "Loop คู่ — outer linear, inner log",
    code: [
      { line: "for (int i = 0; i < n; i++) {", cost: "n+1", note: "" },
      { line: "  for (int j = 1; j < n; j *= 2) {", cost: "n·log n", note: "" },
      { line: "    sum++;", cost: "n·log n", note: "" },
      { line: "  }", cost: "—", note: "" },
      { line: "}", cost: "—", note: "" }
    ],
    total: "T(n) = n·log n + ... = O(n log n)"
  },
  {
    name: "Recursion (Fibonacci)",
    code: [
      { line: "int fib(int n) {", cost: "—", note: "" },
      { line: "  if (n <= 1) return n;", cost: "1", note: "base case" },
      { line: "  return fib(n-1) + fib(n-2);", cost: "T(n-1) + T(n-2)", note: "recurrence" }
    ],
    total: "T(n) = T(n-1) + T(n-2) + O(1) = O(2ⁿ)"
  },
  {
    name: "Recursion (Binary Search)",
    code: [
      { line: "int bs(int a[], int l, int r, int x) {", cost: "—", note: "" },
      { line: "  if (l > r) return -1;", cost: "1", note: "" },
      { line: "  int m = (l+r)/2;", cost: "1", note: "" },
      { line: "  if (a[m] == x) return m;", cost: "1", note: "" },
      { line: "  if (a[m] < x) return bs(a,m+1,r,x);", cost: "T(n/2)", note: "ครึ่งขวา" },
      { line: "  else return bs(a,l,m-1,x);", cost: "T(n/2)", note: "ครึ่งซ้าย — แค่ฝั่งใดฝั่งหนึ่ง" }
    ],
    total: "T(n) = T(n/2) + O(1) → Master Case 2 → O(log n)"
  },
];

Lessons6["bigo-analyzer"] = function () {
  const [pick, setPick] = useS6(0);
  const ex = ANALYZE_EXAMPLES[pick];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📐 Big-O Analyzer — วิเคราะห์ทีละบรรทัด</div>
        ดู<b>วิธีนับจริง</b> ทีละบรรทัด ไม่ใช่จำสูตร — เห็นว่า <b>n+1, n², log n</b> มาจากไหน
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>เลือก pattern ที่อยากเห็น:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ANALYZE_EXAMPLES.map((e, i) => (
            <button key={i} onClick={() => setPick(i)}
              style={{
                background: pick === i ? 'var(--accent)' : 'var(--bg-2)',
                color: pick === i ? '#000' : 'var(--text-1)',
                border: '1px solid var(--border)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                fontWeight: pick === i ? 600 : 400
              }}>
              {i + 1}. {e.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', background: 'var(--bg-3)', padding: '8px 12px', fontSize: 11, color: 'var(--text-2)', fontWeight: 600, letterSpacing: '0.08em' }}>
          <span>CODE</span><span style={{ textAlign: 'center' }}>COST</span><span>HOW</span>
        </div>
        {ex.code.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, borderBottom: '1px solid var(--bg-3)' }}>
            <span style={{ color: 'var(--text-0)' }}>{row.line}</span>
            <span style={{ textAlign: 'center', color: 'var(--accent-2)', fontWeight: 600 }}>{row.cost}</span>
            <span style={{ color: 'var(--text-2)', fontSize: 12 }} dangerouslySetInnerHTML={{ __html: row.note }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: 16, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 8 }}>
        <div style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>TOTAL</div>
        <div style={{ fontFamily: 'monospace', fontSize: 16, color: 'var(--text-0)' }}>{ex.total}</div>
      </div>

      <h3 style={{ marginTop: 22 }}>📐 Rules of Thumb (ใช้สอบ)</h3>
      <table className="tbl">
        <thead><tr><th>Pattern</th><th>Big-O</th></tr></thead>
        <tbody>
          <tr><td>1 statement — ไม่มี loop</td><td>O(1)</td></tr>
          <tr><td>1 loop — i++ จาก 0 ถึง n</td><td>O(n)</td></tr>
          <tr><td>1 loop — i *= c (c &gt; 1) จาก 1 ถึง n</td><td>O(log n)</td></tr>
          <tr><td>2 loop ซ้อน — แต่ละลูป n</td><td>O(n²)</td></tr>
          <tr><td>2 loop ซ้อน — outer n, inner log n</td><td>O(n log n)</td></tr>
          <tr><td>2 loop ติดกัน (ไม่ซ้อน)</td><td>O(n) — เอาตัวมากสุด</td></tr>
          <tr><td>Recursion T(n) = T(n-1) + 1</td><td>O(n)</td></tr>
          <tr><td>Recursion T(n) = T(n-1) + n</td><td>O(n²)</td></tr>
          <tr><td>Recursion T(n) = 2T(n-1) + 1</td><td>O(2ⁿ)</td></tr>
          <tr><td>Recursion T(n) = T(n/2) + 1</td><td>O(log n)</td></tr>
          <tr><td>Recursion T(n) = 2T(n/2) + n</td><td>O(n log n)</td></tr>
          <tr><td>Recursion T(n) = 2T(n/2) + 1</td><td>O(n)</td></tr>
        </tbody>
      </table>

      <h3>🎯 ทริคสอบ</h3>
      <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li><b>หา loop ในสุด</b> — มันคือ inner work ที่ทำซ้ำ</li>
        <li><b>นับจำนวนครั้ง</b> ของ inner work — นี่คือ T(n)</li>
        <li><b>ตัด constant</b> และ <b>ตัด lower order</b> เหลือเฉพาะตัวสำคัญสุด</li>
        <li><b>log มี base ไม่สำคัญ</b> — log₂n, log₃n, ln n ทั้งหมด = O(log n)</li>
        <li>i *= 2 → log n, i *= 3 → log n, i² &lt; n → log log n</li>
      </ul>
    </React.Fragment>
  );
};

window.LessonsPart6 = Lessons6;
