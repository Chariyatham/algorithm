/* Lessons Part 26 — Complete Learning Resource:
   Diagnostic, Mastery Tracker, Interview Prep, Bug Hunt, Case Studies,
   Common Mistakes, Quick Reference, Notes, Video Hub, Capstone Projects */

const { useState: useS26, useMemo: useM26, useEffect: useE26 } = React;
const { Quiz: Quiz26 } = window.LessonComponents;
const { CheatSheet: CS26 } = window.LearningKit;

const Lessons26 = {};

/* ============================================================
   105 — DIAGNOSTIC TEST (Placement)
============================================================ */
const DIAGNOSTIC_QUESTIONS = [
  { q: "Big-O ของ Binary Search?", opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], ans: 1, topic: "basics" },
  { q: "n=1000, O(n²) ทำกี่ operations?", opts: ["1,000", "1,000,000", "1,000,000,000", "log 1000"], ans: 1, topic: "basics" },
  { q: "Stack ใช้รูปแบบไหน?", opts: ["FIFO", "LIFO", "Random", "Priority"], ans: 1, topic: "ds" },
  { q: "ใช้ DS อะไรสำหรับ BFS?", opts: ["Stack", "Queue", "Heap", "Tree"], ans: 1, topic: "graph" },
  { q: "Merge Sort time complexity?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], ans: 1, topic: "sort" },
  { q: "Quick Sort worst case?", opts: ["O(n log n)", "O(n²)", "O(n)", "O(2ⁿ)"], ans: 1, topic: "sort" },
  { q: "Hash Table avg lookup?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], ans: 0, topic: "ds" },
  { q: "Dijkstra ใช้กับ graph แบบไหน?", opts: ["Negative weight ได้", "Non-negative weight", "Unweighted เท่านั้น", "DAG เท่านั้น"], ans: 1, topic: "graph" },
  { q: "DP กับ Memoization ต่างกันยังไง?", opts: ["DP = top-down, Memo = bottom-up", "DP = bottom-up, Memo = top-down recursion + cache", "ไม่ต่างกัน", "DP เป็น greedy"], ans: 1, topic: "paradigm" },
  { q: "0/1 Knapsack time?", opts: ["O(n)", "O(n log n)", "O(n × W)", "O(2ⁿ)"], ans: 2, topic: "dp" },
  { q: "Master Theorem T(n) = 2T(n/2) + n ให้?", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], ans: 1, topic: "math" },
  { q: "ทำไม push_back ของ vector เป็น amortized O(1)?", opts: ["Memory pre-allocate", "Geometric resize (×2) → amortized O(1)", "Linked list internally", "Hash table"], ans: 1, topic: "cpp" },
  { q: "Pointer vs Reference ใน C++?", opts: ["เหมือนกันทุกประการ", "Pointer มี nullptr ได้, reference ต้องผูกตอนสร้าง", "Reference เร็วกว่า", "Pointer เป็น const เสมอ"], ans: 1, topic: "cpp" },
  { q: "ปัญหา NP-Complete หมายถึง?", opts: ["แก้ไม่ได้แน่นอน", "NP ∩ NP-Hard — 'ยากที่สุดใน NP'", "ใช้ poly time", "ใช้ exponential ทุกกรณี"], ans: 1, topic: "np" },
  { q: "Network Flow Max-Flow Min-Cut Theorem?", opts: ["max flow > min cut", "max flow = min cut", "max flow < min cut", "ไม่เกี่ยวข้องกัน"], ans: 1, topic: "flow" },
  { q: "BFS หรือ Dijkstra สำหรับ unweighted shortest path?", opts: ["BFS เร็วกว่า + ใช้ง่ายกว่า", "Dijkstra ใช้ได้เท่านั้น", "ทั้งสองเท่ากัน", "ใช้ DFS"], ans: 0, topic: "graph" },
  { q: "LIS (Longest Increasing Subsequence) เร็วสุดทำได้?", opts: ["O(n²) DP", "O(n log n) patience sort + binary search", "O(n) เสมอ", "O(2ⁿ)"], ans: 1, topic: "dp" },
  { q: "ปัญหา TSP คือ?", opts: ["Polynomial — Dijkstra", "NP-Hard — Held-Karp O(n²·2ⁿ) ดีสุด exact", "Greedy ได้", "DAG เสมอ"], ans: 1, topic: "np" },
  { q: "STL std::set ใช้ data structure ภายในคือ?", opts: ["Hash table", "Red-Black Tree", "Array", "Linked list"], ans: 1, topic: "cpp" },
  { q: "Loop Invariant ใช้ทำอะไร?", opts: ["พิสูจน์ correctness ของ algorithm", "วัด time complexity", "Reset variables", "Optimize loops"], ans: 0, topic: "proofs" },
];

const SUGGEST_PATHS = {
  beginner: { name: "🌱 เริ่มต้นใหม่", path: "1month", msg: "ยังไม่มีพื้นฐาน — แนะนำ Crash Course 1 เดือน เริ่มจาก Foundations" },
  intermediate: { name: "📚 ปานกลาง", path: "3month", msg: "เข้าใจ basic แล้ว — แนะนำ Complete Course 3 เดือนเพื่อลึกซึ้ง" },
  advanced: { name: "🚀 แข็งแกร่ง", path: "contest", msg: "แม่นแล้ว — แนะนำ Competitive Programming track หรือเตรียม Final/Interview" },
  master: { name: "👑 มาสเตอร์", path: "contest", msg: "ระดับขั้นสูง — โจทย์ contest + design problems + research papers" },
};

Lessons26["diagnostic-test"] = function () {
  const [phase, setPhase] = useS26('intro'); // intro | quiz | result
  const [idx, setIdx] = useS26(0);
  const [answers, setAnswers] = useS26({});

  const start = () => { setPhase('quiz'); setIdx(0); setAnswers({}); };

  const answer = (a) => {
    const next = { ...answers, [idx]: a };
    setAnswers(next);
    if (idx < DIAGNOSTIC_QUESTIONS.length - 1) setIdx(i => i + 1);
    else setPhase('result');
  };

  const result = useM26(() => {
    if (phase !== 'result') return null;
    const correct = DIAGNOSTIC_QUESTIONS.filter((q, i) => answers[i] === q.ans).length;
    const total = DIAGNOSTIC_QUESTIONS.length;
    const pct = Math.round((correct / total) * 100);
    let level = 'beginner';
    if (pct >= 85) level = 'master';
    else if (pct >= 65) level = 'advanced';
    else if (pct >= 40) level = 'intermediate';

    // per-topic breakdown
    const byTopic = {};
    DIAGNOSTIC_QUESTIONS.forEach((q, i) => {
      if (!byTopic[q.topic]) byTopic[q.topic] = { correct: 0, total: 0 };
      byTopic[q.topic].total++;
      if (answers[i] === q.ans) byTopic[q.topic].correct++;
    });
    return { correct, total, pct, level, byTopic };
  }, [phase, answers]);

  if (phase === 'intro') {
    return (
      <React.Fragment>
        <div className="callout info">
          <div className="ttl">🧭 Diagnostic Test — รู้ตัวเองอยู่ตรงไหน</div>
          ทำ <b>20 ข้อ multiple choice</b> (~10 นาที) → ระบบจะวิเคราะห์<b>ระดับ</b>คุณและแนะนำเส้นทางที่เหมาะ
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 20, borderRadius: 12, margin: '14px 0' }}>
          <h3 style={{ marginTop: 0 }}>🎯 ทดสอบจะวัดอะไร?</h3>
          <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
            <li>Big-O & Complexity Analysis</li>
            <li>Data Structures (Array, Stack, Queue, Hash, Tree)</li>
            <li>Sorting & Searching</li>
            <li>Graph Algorithms (BFS, DFS, Dijkstra)</li>
            <li>Dynamic Programming</li>
            <li>NP-Completeness</li>
            <li>C++ / STL</li>
            <li>Proofs & Recurrences</li>
          </ul>
          <button onClick={start} style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15, marginTop: 8 }}>▶ เริ่มทำเลย</button>
        </div>
      </React.Fragment>
    );
  }

  if (phase === 'quiz') {
    const q = DIAGNOSTIC_QUESTIONS[idx];
    return (
      <React.Fragment>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${((idx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--text-2)' }}>{idx + 1} / {DIAGNOSTIC_QUESTIONS.length}</span>
        </div>

        <div style={{ background: 'var(--bg-2)', padding: 20, borderRadius: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: 'var(--text-0)' }} dangerouslySetInnerHTML={{ __html: q.q }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {q.opts.map((o, i) => (
              <button key={i} onClick={() => answer(i)}
                style={{
                  background: 'var(--bg-3)', color: 'var(--text-0)',
                  border: '1px solid var(--border)', padding: 12, borderRadius: 6,
                  cursor: 'pointer', textAlign: 'left', fontSize: 14,
                  transition: 'all 0.15s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-0)'; }}>
                <b>{String.fromCharCode(65 + i)}</b> &nbsp; {o}
              </button>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

  // Result phase
  const sugg = SUGGEST_PATHS[result.level];
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎉 ผลการทดสอบ</div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(94,234,212,0.15), rgba(168,139,250,0.15))', padding: 20, borderRadius: 12, textAlign: 'center', margin: '14px 0' }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--accent-2)' }}>{result.pct}%</div>
        <div style={{ fontSize: 16, color: 'var(--text-1)' }}>{result.correct} / {result.total} ถูก</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10, color: 'var(--accent)' }}>{sugg.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>{sugg.msg}</div>
      </div>

      <h3>📊 รายหมวด</h3>
      <table className="cmp">
        <thead><tr><th>หมวด</th><th>คะแนน</th><th>สถานะ</th></tr></thead>
        <tbody>
          {Object.entries(result.byTopic).map(([t, { correct, total }]) => {
            const p = (correct / total) * 100;
            const status = p >= 75 ? ['✅ แข็ง', '#10b981'] : p >= 50 ? ['⚡ พอใช้', '#fbbf24'] : ['⚠️ ต้องทบทวน', '#f87171'];
            return (
              <tr key={t}>
                <td><b>{t}</b></td>
                <td className="mono">{correct}/{total} ({Math.round(p)}%)</td>
                <td style={{ color: status[1] }}>{status[0]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={() => { window.location.hash = '/learning-paths'; }}
          style={{ flex: 1, background: 'var(--accent)', color: '#000', padding: 14, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
          🗺️ ไปยัง Learning Path "{sugg.path}"
        </button>
        <button onClick={start} style={{ background: 'var(--bg-3)', color: 'var(--text-1)', padding: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          ↺ ทำใหม่
        </button>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   106 — MASTERY TRACKER (Per-topic dashboard)
============================================================ */
const TOPIC_LESSONS = {
  "C++ Basics": ['foundations', 'cpp-io', 'cpp-pointers', 'cpp-memory', 'cpp-modern'],
  "STL": ['stl-overview', 'stl-vector-deep', 'stl-string', 'stl-iterators', 'stl-pair-tuple', 'stl-stack-queue', 'stl-deque', 'stl-priority-queue', 'stl-set-map', 'stl-unordered', 'stl-algorithms', 'cpp-lambda', 'stl-bitset'],
  "Big-O & Math": ['big-o', 'master-theorem', 'big-o-proofs', 'recursion-methods', 'loop-invariant', 'amortized'],
  "Search": ['linear-search', 'binary-search', 'interpolation-search'],
  "Sort": ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort', 'counting-sort'],
  "Data Structures": ['stack', 'queue', 'linked-list', 'hashing', 'hash-collision', 'tree-basic', 'bst', 'avl-tree', 'trie', 'union-find', 'segment-tree'],
  "Graph": ['graph-rep', 'bfs', 'dfs', 'cycle-detect', 'topo-sort', 'dijkstra', 'bellman-ford', 'floyd-warshall', 'mst', 'scc', 'articulation'],
  "Paradigms": ['recursion', 'exhaustive', 'backtracking', 'greedy', 'dp', 'quick-select', 'matrix-mult', 'strassen'],
  "Advanced DP": ['lis', 'lcs', 'edit-distance', 'matrix-chain', 'bitmask-dp', 'tree-dp'],
  "Strings": ['string-match', 'z-algorithm', 'suffix-array', 'manacher', 'aho-corasick'],
  "Number Theory": ['ext-gcd', 'mod-inverse', 'sieve', 'fast-power', 'randomized', 'randomized-quicksort'],
  "Network Flow": ['max-flow', 'edmonds-karp', 'min-cut', 'bipartite-matching'],
  "NP / Complexity": ['p-vs-np', 'reductions', 'np-complete-problems', 'approximation'],
};

Lessons26["mastery-tracker"] = function () {
  const [progress, setProgress] = useS26(() => {
    try { return JSON.parse(localStorage.getItem('algo-academy-progress-v1') || '{}'); } catch { return {}; }
  });
  const [solved, setSolved] = useS26(() => {
    try { return JSON.parse(localStorage.getItem('algo-academy-solved-v1') || '{}'); } catch { return {}; }
  });

  const topicStats = useM26(() => {
    return Object.entries(TOPIC_LESSONS).map(([topic, ids]) => {
      const done = ids.filter(id => progress[id]).length;
      const total = ids.length;
      return { topic, done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
    });
  }, [progress]);

  const totalSolved = Object.keys(solved).length;
  const totalDone = Object.values(progress).filter(Boolean).length;
  const avgMastery = topicStats.length ? Math.round(topicStats.reduce((s, t) => s + t.pct, 0) / topicStats.length) : 0;

  // Radar chart (SVG)
  const cx = 200, cy = 200, R = 150;
  const N = topicStats.length;
  const angle = (i) => (i * 2 * Math.PI / N) - Math.PI / 2;
  const point = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const polyPts = topicStats.map((t, i) => point(i, R * t.pct / 100).join(',')).join(' ');
  const axisPts = topicStats.map((_, i) => point(i, R).join(',')).join(' ');

  // strongest / weakest
  const sorted = [...topicStats].sort((a, b) => b.pct - a.pct);
  const strongest = sorted.slice(0, 3);
  const weakest = sorted.slice(-3).reverse();

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📈 Mastery Tracker — แผนที่ความเก่งของคุณ</div>
        ดูภาพรวมว่าจุดไหนเก่งจุดไหนต้องเพิ่ม — base on lessons completed + problems solved
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, margin: '14px 0' }}>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-2)' }}>{avgMastery}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Avg Mastery</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{totalDone}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Lessons Done</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{totalSolved}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Problems Solved</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#a78bfa' }}>{topicStats.filter(t => t.pct === 100).length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Topics Mastered</div>
        </div>
      </div>

      <h3>🎯 Radar Chart — Mastery per Topic</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, display: 'flex', justifyContent: 'center' }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Axis circles */}
          {[0.25, 0.5, 0.75, 1].map(s => (
            <circle key={s} cx={cx} cy={cy} r={R * s} fill="none" stroke="var(--bg-3)" strokeWidth={1} />
          ))}
          {/* Axes */}
          {topicStats.map((_, i) => {
            const [x, y] = point(i, R);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--bg-3)" strokeWidth={1} />;
          })}
          {/* Polygon */}
          <polygon points={polyPts} fill="rgba(94,234,212,0.25)" stroke="var(--accent-2)" strokeWidth={2} />
          {/* Vertices */}
          {topicStats.map((t, i) => {
            const [x, y] = point(i, R * t.pct / 100);
            return <circle key={i} cx={x} cy={y} r={4} fill="var(--accent)" />;
          })}
          {/* Labels */}
          {topicStats.map((t, i) => {
            const [x, y] = point(i, R + 22);
            return <text key={i} x={x} y={y} fontSize="10" fill="var(--text-1)" textAnchor="middle" dominantBaseline="middle">{t.topic}</text>;
          })}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
        <div style={{ background: 'rgba(16,185,129,0.08)', padding: 12, borderLeft: '3px solid #10b981', borderRadius: 6 }}>
          <b style={{ color: '#10b981' }}>💪 Strongest Topics</b>
          {strongest.map(t => (
            <div key={t.topic} style={{ marginTop: 4, fontSize: 13 }}>
              <span style={{ color: 'var(--text-1)' }}>{t.topic}</span>
              <span style={{ float: 'right', color: '#10b981', fontFamily: 'monospace' }}>{t.pct}%</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(248,113,113,0.08)', padding: 12, borderLeft: '3px solid #f87171', borderRadius: 6 }}>
          <b style={{ color: '#f87171' }}>⚠️ Weakest Topics — แนะนำให้ทบทวน</b>
          {weakest.map(t => (
            <div key={t.topic} style={{ marginTop: 4, fontSize: 13 }}>
              <span style={{ color: 'var(--text-1)' }}>{t.topic}</span>
              <span style={{ float: 'right', color: '#f87171', fontFamily: 'monospace' }}>{t.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>📋 Per-Topic Progress</h3>
      <table className="cmp">
        <thead><tr><th>Topic</th><th>Progress</th><th>%</th></tr></thead>
        <tbody>
          {topicStats.map(t => (
            <tr key={t.topic}>
              <td><b>{t.topic}</b></td>
              <td>
                <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden', minWidth: 100 }}>
                  <div style={{ width: t.pct + '%', height: '100%', background: t.pct === 100 ? '#10b981' : (t.pct >= 50 ? 'var(--accent)' : '#fbbf24'), transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-3)' }}>{t.done}/{t.total}</span>
              </td>
              <td className="mono">{t.pct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

/* ============================================================
   107 — INTERVIEW PREP (FAANG + Thai company style)
============================================================ */
const INTERVIEW_CATEGORIES = {
  framework: {
    label: "📋 Whiteboard Framework",
    items: [
      { title: "5-Step Framework", body: "1. <b>Clarify</b> — input format, constraints, edge cases (พูดออกเสียง!)<br/>2. <b>Approach</b> — brute force ก่อน → optimize<br/>3. <b>Code</b> — เขียนช้า ๆ พูดออกเสียง<br/>4. <b>Test</b> — trace ด้วย example + edge cases<br/>5. <b>Optimize</b> — เวลา/space + ทำได้ดีกว่าไหม?" },
      { title: "การพูดที่ดีในห้องสัมภาษณ์", body: "✓ คิดเสียง: \"ฉันคิดว่าน่าจะใช้ HashMap เพราะ...\"<br/>✓ ถามคำถาม: \"input เป็น sorted หรือเปล่า?\"<br/>✓ ยอมรับ: \"ฉันยังไม่เคยเจอปัญหานี้ ขอลองคิดสักครู่\"<br/>✗ เงียบ: interviewer จะคิดว่าตันแล้ว" },
      { title: "Pattern Recognition (Keyword → Algorithm)", body: "'shortest path unweighted' → BFS<br/>'shortest path weighted' → Dijkstra<br/>'sliding window' → 2 pointers + map<br/>'top K' → heap หรือ quickselect<br/>'subset / permutation' → backtracking<br/>'overlap intervals' → sort + greedy<br/>'minimum / maximum DP' → dp[i][...]<br/>'cycle in graph' → DFS+stack หรือ Union-Find<br/>'string matching' → KMP / Z / Rabin-Karp<br/>'parentheses / nested' → stack" },
    ]
  },
  faang: {
    label: "🌐 FAANG Style (Google/Meta/Amazon)",
    items: [
      { title: "Two Sum + variants", body: "ขั้น 1: 2 sum (basic)<br/>ขั้น 2: 3sum, 4sum<br/>ขั้น 3: closest sum<br/>ทุกข้อต้องเห็น hash + 2-pointer + sort tricks" },
      { title: "Tree Problems", body: "Mirror tree, lowest common ancestor (LCA), serialize/deserialize, validate BST, kth smallest, recover BST" },
      { title: "Sliding Window", body: "Longest substring without repeat, min window substring, longest repeating char replacement, find anagrams" },
      { title: "Dynamic Programming Classics", body: "Climbing stairs, house robber, coin change, longest common subseq, edit distance, longest increasing subseq, regex matching" },
      { title: "Graph & Topological", body: "Course schedule (cycle in DAG), clone graph, word ladder, network delay, alien dictionary" },
      { title: "Backtracking", body: "Permutations, N-Queens, Sudoku, word search, generate parentheses, palindrome partition" },
    ]
  },
  thai: {
    label: "🇹🇭 Thai Company Style",
    items: [
      { title: "SCB Tech Bootcamp typical", body: "Mock array problem (Two sum / Trapping rain water style)<br/>Recursion (binary tree)<br/>Behavioral: \"เล่าโปรเจคที่ผ่านมา\"" },
      { title: "Agoda Engineering", body: "Heavier on DP + Graph<br/>Edge case-heavy problems<br/>System design (มี junior level)" },
      { title: "LINE MAN Wongnai", body: "Real-world: route optimization (Dijkstra variant)<br/>Recommendation algorithm (collaborative filtering)<br/>SQL + algorithmic thinking" },
      { title: "KBTG (Kasikorn)", body: "Quantitative: probability + algorithm<br/>Financial calculation problems<br/>System design ระบบ banking" },
      { title: "Google Bangkok / Tech roles", body: "Same as global Google: 4-5 rounds, ทุก round 45 min<br/>เน้น optimal + clean code<br/>มี follow-up เสมอ — เตรียม optimize ต่อ" },
    ]
  },
  questions: {
    label: "💯 30 โจทย์ฝึก (จัดเรียง difficulty)",
    items: [
      { title: "Easy (10 ข้อ)", body: "1. Two Sum<br/>2. Valid Parentheses<br/>3. Reverse Linked List<br/>4. Maximum Subarray (Kadane)<br/>5. Climb Stairs<br/>6. Best Time to Buy/Sell Stock<br/>7. Linked List Cycle<br/>8. Invert Binary Tree<br/>9. Valid Anagram<br/>10. Merge Two Sorted Lists" },
      { title: "Medium (15 ข้อ)", body: "1. Add Two Numbers (linked list)<br/>2. Longest Substring Without Repeating<br/>3. 3Sum<br/>4. Group Anagrams<br/>5. Spiral Matrix<br/>6. Jump Game<br/>7. Merge Intervals<br/>8. Word Search (backtracking)<br/>9. Validate BST<br/>10. Subsets<br/>11. Permutations<br/>12. Coin Change<br/>13. Number of Islands<br/>14. Course Schedule<br/>15. Word Break" },
      { title: "Hard (5 ข้อ)", body: "1. Median of Two Sorted Arrays<br/>2. Regular Expression Matching<br/>3. Merge K Sorted Lists<br/>4. Trapping Rain Water<br/>5. Word Ladder II (BFS all paths)" },
    ]
  },
};

Lessons26["interview-prep"] = function () {
  const [cat, setCat] = useS26('framework');
  const c = INTERVIEW_CATEGORIES[cat];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">💼 Interview Prep — เตรียมสัมภาษณ์ Tech Company</div>
        Framework + pattern recognition + 30 โจทย์ที่ FAANG/Thai company ออกบ่อย
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0' }}>
        {Object.entries(INTERVIEW_CATEGORIES).map(([k, v]) => (
          <button key={k} onClick={() => setCat(k)}
            style={{
              background: cat === k ? 'var(--accent)' : 'var(--bg-2)',
              color: cat === k ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13,
              fontWeight: cat === k ? 700 : 400
            }}>
            {v.label}
          </button>
        ))}
      </div>

      <h3>{c.label}</h3>
      {c.items.map((it, i) => (
        <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10, borderLeft: '3px solid var(--accent-2)' }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-2)', marginBottom: 6 }}>{it.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: it.body }} />
        </div>
      ))}

      {cat === 'framework' && (
        <CS26 title="🎯 Interview Tips" sections={[
          { label: "Time", value: "45 min ปกติ — 5 clarify, 10 design, 20 code, 10 test/optimize" },
          { label: "Code Quality", value: "Variable name ชัด, no magic numbers, handle null/empty" },
          { label: "Big-O", value: "พูด time + space เสมอ" },
          { label: "Test", value: "ตัวอย่างจาก problem + edge cases (empty, 1 elem, max size, negative)" },
          { label: "Follow-up", value: "เตรียม ‘ถ้าให้ทำ scale ใหญ่ขึ้นจะแก้ยังไง’" },
        ]} />
      )}
    </React.Fragment>
  );
};

/* ============================================================
   108 — BUG HUNT (find/fix bugs)
============================================================ */
const BUGS = [
  {
    title: "Bug 1: Off-by-one ใน Binary Search",
    code: `int binarySearch(vector<int>& a, int x) {
  int lo = 0, hi = a.size();   // BUG: ควรเป็น size() - 1
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    if (a[mid] == x) return mid;
    else if (a[mid] < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    bug: "Line 2: <code>hi = a.size()</code> ผิด — ควรเป็น <code>a.size() - 1</code>",
    fix: "<code>int hi = a.size() - 1;</code> เพราะ index สุดท้าย = n-1. แบบเดิม a[hi] = a[size()] = out of bound → undefined",
    hint: "หา edge case: ถ้า x = a[0] โค้ดจะ access a[size()/2] แล้ว... แต่ปัญหาคือเงื่อนไข loop"
  },
  {
    title: "Bug 2: Integer Overflow ใน Sum",
    code: `int sumLarge(vector<int>& a) {
  int s = 0;
  for (int x : a) s += x;
  return s;
}`,
    bug: "<code>int s</code> overflow ถ้า sum &gt; 2^31",
    fix: "ใช้ <code>long long s = 0;</code> แทน. รวมเลขใหญ่ใน contest บ่อยมาก",
    hint: "n = 10⁵ และแต่ละตัว ≤ 10⁵ → sum สูงสุด 10¹⁰ &gt; INT_MAX (≈ 2.1×10⁹)"
  },
  {
    title: "Bug 3: Reference to Local Variable",
    code: `int& getValue() {
  int x = 42;
  return x;   // BUG!
}

int main() {
  int& r = getValue();
  cout << r;   // undefined
}`,
    bug: "Return reference ของ local variable <code>x</code> ซึ่งตายหลัง function จบ → dangling reference",
    fix: "Return by value: <code>int getValue() { ... return x; }</code> หรือ allocate บน heap (ใช้ smart pointer)",
    hint: "x อยู่ใน stack — เกิดอะไรขึ้นเมื่อ function จบ?"
  },
  {
    title: "Bug 4: Modifying Container while Iterating",
    code: `vector<int> v = {1, 2, 3, 4, 5};
for (auto it = v.begin(); it != v.end(); ++it) {
  if (*it % 2 == 0) v.erase(it);   // BUG!
}`,
    bug: "<code>v.erase(it)</code> ทำให้ iterator <code>it</code> invalid → behavior undefined",
    fix: "<code>it = v.erase(it);</code> (erase return next iterator). หรือใช้ <b>erase-remove idiom</b>:<br/><code>v.erase(remove_if(v.begin(), v.end(), [](int x){return x%2==0;}), v.end());</code>",
    hint: "erase invalidate iterator ที่ตำแหน่งและหลัง — จะ ++it จาก invalid ไม่ได้"
  },
  {
    title: "Bug 5: Hash Map พลาด key",
    code: `unordered_map<string, int> ages;
ages["alice"] = 30;

string name = "bob";
cout << ages[name];   // จะ ‘สร้าง’ entry "bob" = 0 อัตโนมัติ!`,
    bug: "<code>map[key]</code> ที่ key ไม่มี → <b>สร้าง entry default value</b> (0 สำหรับ int)",
    fix: "ใช้ <code>ages.count(name)</code> หรือ <code>ages.find(name) != ages.end()</code> ตรวจก่อน",
    hint: "ลอง <code>ages.size()</code> หลัง <code>cout</code> — จะเป็น 2 (มี alice + bob ที่สร้างใหม่)"
  },
  {
    title: "Bug 6: DFS Infinite Recursion",
    code: `void dfs(int u, vector<vector<int>>& adj) {
  cout << u << " ";
  for (int v : adj[u]) dfs(v, adj);   // BUG!
}`,
    bug: "ไม่มี <code>visited[]</code> → ถ้ามี cycle → infinite recursion → stack overflow",
    fix: "เพิ่ม <code>visited</code>:<br/><code>void dfs(int u, vector&lt;vector&lt;int&gt;&gt;&amp; adj, vector&lt;bool&gt;&amp; visited) {<br/>&nbsp;&nbsp;if (visited[u]) return;<br/>&nbsp;&nbsp;visited[u] = true; ...<br/>}</code>",
    hint: "อะไรเกิดขึ้นถ้า graph มี edge (1, 2) และ (2, 1)?"
  },
  {
    title: "Bug 7: Division by Zero ใน Average",
    code: `double avg(vector<int>& v) {
  int sum = 0;
  for (int x : v) sum += x;
  return (double)sum / v.size();   // BUG ถ้า v ว่าง
}`,
    bug: "<code>v.size() == 0</code> → division by zero → NaN/Inf",
    fix: "ตรวจก่อน: <code>if (v.empty()) return 0;</code>",
    hint: "Edge case: input ว่าง"
  },
  {
    title: "Bug 8: String comparison wrong",
    code: `string a = getInput(), b = getInput();
if (a == b) {   // ทำงานปกติ
  ...
}
// แต่ถ้า user comparison case-insensitive:
if (a.tolower() == b.tolower()) { ... }   // BUG!`,
    bug: "<code>std::string</code> ไม่มี <code>.tolower()</code> method!",
    fix: "ใช้ <code>transform(a.begin(), a.end(), a.begin(), ::tolower);</code> ก่อนเปรียบเทียบ",
    hint: "C++ string ไม่ใช่ Java/Python — ต้องใช้ <code>&lt;algorithm&gt;</code> + <code>&lt;cctype&gt;</code>"
  },
  {
    title: "Bug 9: Greedy ใช้ผิด",
    code: `// "Coin change: หา min coins ที่บวกได้ amount"
int coinChange(vector<int>& coins, int amount) {
  sort(coins.rbegin(), coins.rend());
  int cnt = 0;
  for (int c : coins) {
    cnt += amount / c;
    amount %= c;
  }
  return cnt;
}
// Test: coins = [1, 3, 4], amount = 6 → ต้องได้ 2 (3+3)
// แต่ greedy ได้: 4 + 1 + 1 = 3 ❌`,
    bug: "Greedy ใช้ไม่ได้กับทุก coin system — ใช้ได้กับ ‘canonical’ เช่น {1,5,10,25}",
    fix: "ใช้ <b>DP</b>: <code>dp[v] = min over c: dp[v-c] + 1</code>",
    hint: "ลอง coins = [1, 3, 4], amount = 6 — greedy ตอบเท่าไร?"
  },
  {
    title: "Bug 10: Priority Queue Max vs Min",
    code: `// "หา 5 smallest elements"
priority_queue<int> pq;   // BUG: default = max-heap!
for (int x : nums) {
  pq.push(x);
  if (pq.size() > 5) pq.pop();   // ตั้งใจ pop ตัวใหญ่สุด แต่ pop ตัวเล็กสุดแทน
}`,
    bug: "<code>priority_queue&lt;int&gt;</code> = <b>max-heap</b> default → pop max, แต่เราต้องการ pop max เพื่อเก็บ 5 small. Logic flipped",
    fix: "ใช้ min-heap: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;&gt;&gt; pq;</code> และ pop min เพื่อเก็บ 5 large. หรือใช้ max-heap แล้วเปลี่ยน semantics ให้ถูก",
    hint: "ทบทวน: default = max หรือ min?"
  },
  {
    title: "Bug 11: 2D Array Init ผิด",
    code: `vector<vector<int>> g(n, vector<int>(n, 0));
for (int i = 0; i < n; i++)
  for (int j = 0; j < n; j++)
    g[i][j] = i * j;
// later...
auto cp = g;
cp[0][0] = 999;
cout << g[0][0];   // อะไรเกิดขึ้น?`,
    bug: "ไม่มี bug! แต่ confused คนเขียนเสมอว่า assignment เป็น reference หรือ copy",
    fix: "<code>auto cp = g;</code> = <b>deep copy</b> สำหรับ <code>std::vector</code>. <code>g[0][0]</code> ยัง = 0",
    hint: "ลอง print ดู — vector copy ลึกหรือตื้น?"
  },
  {
    title: "Bug 12: Recursive Fibonacci ช้ามาก",
    code: `int fib(int n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}
// fib(40) ใช้เวลา 10+ วินาที!`,
    bug: "Exponential O(2ⁿ) — recompute ซ้ำ ๆ",
    fix: "Memoization: <code>vector&lt;int&gt; memo(n+1, -1);</code><br/><code>if (memo[n] != -1) return memo[n];</code><br/><code>return memo[n] = fib(n-1) + fib(n-2);</code>",
    hint: "fib(40) เรียก fib(38) กี่ครั้ง? fib(37) กี่ครั้ง?"
  },
  {
    title: "Bug 13: Sort เปรียบเทียบ Float ผิด",
    code: `vector<double> v = {1.0, 2.5, 1.0001};
sort(v.begin(), v.end(), [](double a, double b) {
  return a - b;   // BUG!
});`,
    bug: "Comparator ต้อง return <b>bool</b> (a &lt; b) ไม่ใช่ <b>difference</b>. <code>return a - b</code> → ถ้า diff &gt; 0 → true → ผิด direction",
    fix: "<code>return a &lt; b;</code> (ascending) หรือ <code>return a &gt; b;</code> (descending)",
    hint: "C++ comparator returns bool — sort needs strict less-than"
  },
  {
    title: "Bug 14: Modulo Negative",
    code: `int n = -5, m = 3;
int r = n % m;   // r = -2 ใน C++ ไม่ใช่ 1`,
    bug: "<code>%</code> ใน C++ คืน sign ของ operand ซ้าย → <code>-5 % 3 = -2</code> (ไม่ใช่ 1 เหมือน Python)",
    fix: "<code>int r = ((n % m) + m) % m;</code> เพื่อให้ result เป็น [0, m)",
    hint: "ลอง <code>(-5) % 3</code> ใน C++ vs Python — ผลต่างกัน"
  },
  {
    title: "Bug 15: Pass by Value (copy ใหญ่)",
    code: `int sumAll(vector<int> v) {   // copies entire vector!
  int s = 0;
  for (int x : v) s += x;
  return s;
}
// ถ้า v มี 10⁷ ตัว — copy ทุกครั้งที่เรียก = ช้า`,
    bug: "Pass by value → copy ทั้ง vector → O(n) overhead ต่อการเรียก",
    fix: "Pass by const reference: <code>int sumAll(const vector&lt;int&gt;&amp; v) { ... }</code>",
    hint: "vector มี data ใน heap — แต่ copy constructor ก็ deep copy ทุก element"
  },
];

Lessons26["bug-hunt"] = function () {
  const [idx, setIdx] = useS26(0);
  const [show, setShow] = useS26({ hint: false, bug: false, fix: false });

  const cur = BUGS[idx];
  const toggle = (k) => setShow(s => ({ ...s, [k]: !s[k] }));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🐛 Bug Hunt — หา bug ในโค้ดที่เขียนผิด</div>
        ฝึก <b>debugging</b> แบบ active — อ่านโค้ด → หา bug → ลองเฉลย<br/>
        เหมาะกับ code review skill + เตรียมสัมภาษณ์
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '14px 0' }}>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>◀ ก่อนหน้า</button>
        <span style={{ flex: 1, textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-2)' }}>
          Bug {idx + 1} / {BUGS.length}
        </span>
        <button onClick={() => { setIdx(i => Math.min(BUGS.length - 1, i + 1)); setShow({ hint: false, bug: false, fix: false }); }} disabled={idx === BUGS.length - 1}>ถัดไป ▶</button>
        <select value={idx} onChange={e => { setIdx(+e.target.value); setShow({ hint: false, bug: false, fix: false }); }}
          style={{ padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }}>
          {BUGS.map((b, i) => <option key={i} value={i}>{b.title}</option>)}
        </select>
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 18, borderRadius: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}>{cur.title}</div>
        <pre style={{ background: '#0a0e14', color: 'var(--text-0)', padding: 14, borderRadius: 6, overflow: 'auto', fontSize: 13, lineHeight: 1.5, fontFamily: 'monospace' }}>{cur.code}</pre>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <button onClick={() => toggle('hint')} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
            💡 {show.hint ? 'Hide' : 'Show'} Hint
          </button>
          <button onClick={() => toggle('bug')} style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid #f87171', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
            🐛 {show.bug ? 'Hide' : 'Show'} Bug
          </button>
          <button onClick={() => toggle('fix')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' }}>
            ✓ {show.fix ? 'Hide' : 'Show'} Fix
          </button>
        </div>

        {show.hint && (
          <div style={{ marginTop: 10, padding: 12, background: 'rgba(251,191,36,0.08)', borderLeft: '3px solid #fbbf24', borderRadius: 4 }}>
            <b style={{ color: '#fbbf24' }}>💡 Hint:</b> <span dangerouslySetInnerHTML={{ __html: cur.hint }} />
          </div>
        )}
        {show.bug && (
          <div style={{ marginTop: 8, padding: 12, background: 'rgba(248,113,113,0.08)', borderLeft: '3px solid #f87171', borderRadius: 4 }}>
            <b style={{ color: '#f87171' }}>🐛 Bug:</b> <span dangerouslySetInnerHTML={{ __html: cur.bug }} />
          </div>
        )}
        {show.fix && (
          <div style={{ marginTop: 8, padding: 12, background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', borderRadius: 4 }}>
            <b style={{ color: '#10b981' }}>✓ Fix:</b> <span dangerouslySetInnerHTML={{ __html: cur.fix }} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   109 — CASE STUDIES (real-world algorithm applications)
============================================================ */
const CASES = [
  {
    icon: "🌐", title: "Google PageRank",
    desc: "เรียงเว็บใน search results ตาม ‘importance’",
    algos: ["Eigenvector centrality", "Power iteration", "Random walk on graph"],
    detail: "Web เป็น <b>directed graph</b> (page → link). PageRank ของ page = importance, คำนวณจาก <b>linear algebra</b>:<br/><br/>PR(p) = (1-d)/N + d · Σ PR(in_p)/L(in_p)<br/><br/>โดย d ≈ 0.85 = damping factor. คำนวณด้วย iterative method จน converge. Eigenvalue decomposition.<br/><br/><b>เหตุผลที่ปฏิวัติ search:</b> ก่อน Google เรียงตาม keyword match — Google เรียงตาม ‘เว็บอื่นชี้มาเท่าไร’ → robust กว่าเยอะ",
    related: ["graph-rep", "matrix-mult"]
  },
  {
    icon: "🗺️", title: "Google Maps / GPS Routing",
    desc: "หาทางลัดจากบ้านไปที่ทำงาน",
    algos: ["Dijkstra's algorithm", "A* search", "Contraction Hierarchies"],
    detail: "ถนนเป็น <b>weighted graph</b> (intersection = node, road = edge with travel time).<br/><br/>Dijkstra ตรง ๆ ช้าเกินสำหรับเมืองทั้งเมือง (10⁶+ nodes). ใช้ <b>A*</b>: เพิ่ม heuristic = straight-line distance ไปยัง goal → expand เฉพาะทิศที่มีประโยชน์.<br/><br/>Production (Google Maps): <b>Contraction Hierarchies</b> — preprocess graph เพื่อ query เร็ว 1000× กว่า Dijkstra ปกติ",
    related: ["dijkstra", "graph-rep"]
  },
  {
    icon: "🎬", title: "Netflix Recommendation",
    desc: "‘เพราะคุณดู X คุณอาจชอบ Y’",
    algos: ["Collaborative filtering", "Matrix factorization (SVD)", "Deep learning embeddings"],
    detail: "User-Movie matrix ขนาด millions × millions, sparse (ส่วนใหญ่ว่าง)<br/><br/><b>Collaborative filtering:</b> หา ‘similar users’ ด้วย cosine similarity → suggest movies ที่ similar users ชอบ.<br/><br/><b>Matrix factorization:</b> R ≈ U · V^T ขนาด user × k และ k × movie (k = latent features เช่น ‘ชอบ horror’, ‘ชอบ romance’) → fill missing entries.<br/><br/>Netflix Prize 2009 ($1M) — เพิ่ม accuracy 10% โดย ensemble ของ algorithms",
    related: ["matrix-mult"]
  },
  {
    icon: "📷", title: "JPEG Image Compression",
    desc: "ลดขนาดรูป 10× โดยตา human เห็นไม่ค่อยต่าง",
    algos: ["Discrete Cosine Transform (DCT)", "Huffman coding", "Run-length encoding"],
    detail: "1. แบ่ง image เป็น 8×8 blocks<br/>2. <b>DCT</b> แต่ละ block → frequency domain<br/>3. <b>Quantization</b> — round ค่า frequency สูง (มนุษย์ไม่เห็น) ทิ้ง<br/>4. <b>Huffman coding</b> ของ result → file ขนาดเล็ก<br/><br/>JPEG ใช้ <b>perceptual</b> — human ตาแยก low frequency ดีกว่า high → compress aggressive ที่ high freq.<br/><br/>Quality 80% → file 1/10 ของ original, มองด้วยตาเปล่าไม่ต่าง",
    related: ["huffman"]
  },
  {
    icon: "📝", title: "Git Diff / Merge",
    desc: "ดู ‘เปลี่ยนอะไรในไฟล์’ + merge หลายคนแก้พร้อมกัน",
    algos: ["Longest Common Subsequence (LCS)", "Myers diff algorithm"],
    detail: "git diff ใช้ <b>LCS</b> หา ‘บรรทัดที่เหมือนกัน’ ใน 2 versions → ที่เหลือคือ insert/delete.<br/><br/>แต่ LCS classic O(mn) ช้าเกินสำหรับไฟล์ใหญ่. <b>Myers algorithm</b> (1986) → O((m+n)·D) โดย D = #differences. ถ้า diff น้อย → very fast.<br/><br/>3-way merge (when 2 people edit same file): หา common ancestor → diff ทั้ง 2 side → apply ทั้งคู่ → conflict ถ้าทับซ้อน",
    related: ["lcs", "edit-distance"]
  },
  {
    icon: "🔤", title: "Spell Check / Autocorrect",
    desc: "Word/Google Docs แนะนำ ‘คุณหมายถึง XXX?’",
    algos: ["Edit Distance (Levenshtein)", "BK-Tree", "Trie + dynamic programming"],
    detail: "Compute edit distance ระหว่าง typed word กับ dictionary words → suggest top-K ที่ distance น้อยสุด.<br/><br/>Naive: compute distance กับทุก word in dict = O(|dict| × m × n) — ช้าเกิน<br/><br/><b>BK-Tree</b>: tree ที่ partition words ตาม distance → query เร็วกว่ามาก. Google ใช้ optimization ที่ scale มาก",
    related: ["edit-distance", "trie"]
  },
  {
    icon: "₿", title: "Bitcoin / Blockchain",
    desc: "Cryptocurrency + smart contracts",
    algos: ["SHA-256 (hash)", "Merkle Tree", "ECDSA (signatures)", "Proof of Work"],
    detail: "Block = list of transactions + previous block hash → <b>chain</b>.<br/><br/><b>Hash function</b> (SHA-256): transaction → 256-bit hash ที่ irreversible.<br/><br/><b>Merkle Tree</b>: ทุก transaction hash, hash ทีละคู่, ... → root hash. ใช้ verify transaction โดยไม่ต้อง download ทั้ง chain.<br/><br/><b>Proof of Work</b>: หา nonce ที่ทำให้ hash(block) เริ่มด้วย N zeros → ใช้ computational power เยอะ → secure (เปลี่ยน history ต้อง recompute ทุกอย่าง)",
    related: ["hashing", "tree-basic"]
  },
  {
    icon: "🧬", title: "DNA Sequence Alignment",
    desc: "เปรียบเทียบ DNA — หา mutations, similarity",
    algos: ["Smith-Waterman (local alignment)", "Needleman-Wunsch (global)", "BLAST"],
    detail: "DNA = string ของ {A, C, G, T}. ต้องการ align 2 sequences หา similarity + mutations.<br/><br/><b>Needleman-Wunsch</b> = LCS variant ที่มี score matrix (match = +1, mismatch = -1, gap = -2) → DP O(mn).<br/><br/>BLAST = heuristic ที่ scale ได้ — search billion-bp genome ในวินาที. ใช้ใน research + medical diagnosis",
    related: ["lcs", "edit-distance"]
  },
  {
    icon: "🎮", title: "Game AI Pathfinding",
    desc: "Unit ใน RTS game หา path ไปยัง target อัตโนมัติ",
    algos: ["A* search", "Jump Point Search", "Hierarchical Pathfinding"],
    detail: "Grid map → graph (each cell = node). A* ใช้ heuristic Manhattan / Euclidean distance.<br/><br/>RTS scale ใหญ่ (1000+ units) → optimize เพิ่ม:<br/>• <b>Jump Point Search</b>: ข้าม nodes ที่ symmetric ใน open grid → 10× เร็วกว่า A* ปกติ<br/>• <b>HPA*</b>: ทำ macro path บน abstract graph ก่อน แล้ว micro path ใน region",
    related: ["dijkstra", "bfs"]
  },
  {
    icon: "📦", title: "Amazon Warehouse Picking",
    desc: "Robot ใน warehouse ของ Amazon เก็บ order optimal",
    algos: ["Traveling Salesman Problem (TSP)", "Vehicle Routing Problem", "Approximation algorithms"],
    detail: "Order มาที่ warehouse → robot ต้อง pick items จากหลาย shelves → กลับมา packing. ต้องการ <b>shortest path ผ่านทุก item</b> → TSP (NP-Hard!).<br/><br/>Solution: <b>approximation</b> + heuristics:<br/>• Christofides 1.5-approx (metric TSP)<br/>• Nearest neighbor heuristic (fast แต่ไม่ optimal)<br/>• 2-opt / Lin-Kernighan local search<br/><br/>Real-time pickup planning ใน Amazon Robotics — scale หลายพัน robot",
    related: ["np-complete-problems", "approximation", "bitmask-dp"]
  },
];

Lessons26["case-studies"] = function () {
  const [idx, setIdx] = useS26(0);
  const c = CASES[idx];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🌍 Real-World Case Studies — Algorithm ใช้ที่ไหนบ้าง</div>
        ทุกบทที่เรียน ใช้จริงในระบบที่คุณใช้ทุกวัน — มาดูว่า Google, Netflix, Amazon ใช้ algorithm อะไรบ้าง
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6, margin: '14px 0' }}>
        {CASES.map((cc, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{
              background: idx === i ? 'var(--accent)' : 'var(--bg-2)',
              color: idx === i ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: 10, borderRadius: 8, cursor: 'pointer',
              textAlign: 'center', fontSize: 11
            }}>
            <div style={{ fontSize: 22 }}>{cc.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{cc.title.split(' /')[0]}</div>
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 20, borderRadius: 12 }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
        <h3 style={{ marginTop: 0, color: 'var(--accent)' }}>{c.title}</h3>
        <div style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 14, fontStyle: 'italic' }}>{c.desc}</div>

        <div style={{ background: 'rgba(94,234,212,0.06)', padding: 12, borderRadius: 8, marginBottom: 14 }}>
          <b style={{ color: 'var(--accent-2)' }}>🛠️ Algorithms ใช้:</b>
          <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
            {c.algos.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>

        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: c.detail }} />

        {c.related && c.related.length > 0 && (
          <div style={{ marginTop: 14, padding: 10, background: 'rgba(168,139,250,0.08)', borderRadius: 6 }}>
            <b style={{ color: '#a78bfa' }}>📚 บทที่เกี่ยวข้องในเว็บ:</b>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {c.related.map(id => {
                const lesson = (window.ALL_LESSONS || []).find(l => l.id === id);
                if (!lesson) return null;
                return (
                  <button key={id} onClick={() => { window.location.hash = '/' + id; }}
                    style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: '1px solid #a78bfa', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    → {lesson.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   110 — COMMON MISTAKES (50+ anti-patterns)
============================================================ */
const MISTAKES = [
  // C++ basics
  { cat: "C++", bad: "<code>int x; cout &lt;&lt; x;</code>", good: "<code>int x = 0; cout &lt;&lt; x;</code>", why: "Uninitialized local variable = garbage value (undefined behavior)" },
  { cat: "C++", bad: "<code>if (a = 5)</code>", good: "<code>if (a == 5)</code>", why: "= คือ assignment ไม่ใช่ comparison. Compiler บางตัวเตือน แต่ไม่ error" },
  { cat: "C++", bad: "<code>for (int i = 0; i &lt; v.size() - 1; i++)</code>", good: "<code>for (int i = 0; i + 1 &lt; v.size(); i++)</code>", why: "ถ้า v.empty() → v.size() = 0 → 0 - 1 = MAX (unsigned overflow!) → infinite loop" },
  { cat: "C++", bad: "<code>vector&lt;int&gt; v(5, 2);  // [5, 2]?</code>", good: "<code>v(5, 2) = [2,2,2,2,2], v{5, 2} = [5, 2]</code>", why: "() = size + fill, {} = initializer list — 2 syntax ที่ต่างกันมาก" },
  { cat: "C++", bad: "<code>char* s = \"hello\";</code>", good: "<code>const char* s = \"hello\";</code> หรือ <code>string s = \"hello\";</code>", why: "String literal เป็น <b>read-only</b> — modify จะ segfault (undefined behavior)" },
  { cat: "C++", bad: "<code>int arr[n];</code> (n = runtime)", good: "<code>vector&lt;int&gt; arr(n);</code>", why: "VLA (variable-length array) ไม่ใช่ standard C++ — ใช้ vector" },

  // Memory
  { cat: "Memory", bad: "<code>int* p = new int[100]; ... delete p;</code>", good: "<code>delete[] p;</code>", why: "Array บน heap ต้อง delete[] เสมอ — delete ผิด → undefined" },
  { cat: "Memory", bad: "<code>delete p; ... delete p;</code>", good: "<code>delete p; p = nullptr;</code>", why: "Double delete = undefined. Set nullptr ให้ delete second ครั้งเป็น no-op" },
  { cat: "Memory", bad: "<code>int* getPtr() { int x = 5; return &amp;x; }</code>", good: "<code>int getVal() { return 5; }</code>", why: "Return address ของ local → dangling pointer (local ตายหลัง return)" },
  { cat: "Memory", bad: "<code>int arr[10000000];</code> (in main)", good: "<code>vector&lt;int&gt; arr(10000000);</code>", why: "Stack มี ~8MB. 10⁷ ints = 40MB → stack overflow" },

  // Algorithm correctness
  { cat: "Algo", bad: "Binary search: <code>mid = (lo + hi) / 2;</code>", good: "<code>mid = lo + (hi - lo) / 2;</code>", why: "lo + hi อาจ overflow int (เช่น lo = hi = 10⁹). Subtract trick avoid overflow" },
  { cat: "Algo", bad: "DFS without visited[] → infinite loop on cycle", good: "ใช้ visited[] + check ก่อน recurse", why: "Graph ที่มี cycle → infinite recursion → stack overflow" },
  { cat: "Algo", bad: "Quick Sort: pivot = first element on sorted input", good: "Random pivot or median-of-3", why: "Sorted input + first/last pivot → O(n²) worst case" },
  { cat: "Algo", bad: "Dijkstra with negative edges", good: "ใช้ Bellman-Ford แทน", why: "Dijkstra assumes greedy choice valid — negative edges ทำให้ assumption ผิด" },
  { cat: "Algo", bad: "Greedy coin change for {1, 3, 4}, amount 6", good: "ใช้ DP", why: "Greedy = 4+1+1 = 3 coins. Optimal = 3+3 = 2 coins. Greedy works only for canonical systems" },

  // Complexity / Performance
  { cat: "Perf", bad: "Cumulative sum: <code>for i: sum += array[0..i].sum()</code>", good: "Prefix sum O(n) once", why: "Nested sum = O(n²) — prefix sum precompute = O(n)" },
  { cat: "Perf", bad: "Check duplicate: <code>for i, j: if a[i]==a[j]</code>", good: "Hash set / sort + linear scan", why: "O(n²) — hash O(n) avg" },
  { cat: "Perf", bad: "<code>string s; for: s = s + c;</code>", good: "<code>s.reserve(n); s += c;</code> หรือ <code>vector&lt;char&gt;</code>", why: "Repeated string concat = O(n²) (copy ทั้ง s ใหม่ทุกครั้ง)" },
  { cat: "Perf", bad: "Pass vector by value: <code>void f(vector&lt;int&gt; v)</code>", good: "<code>void f(const vector&lt;int&gt;&amp; v)</code>", why: "Copy ทั้ง vector ทุกการเรียก = O(n) overhead" },
  { cat: "Perf", bad: "<code>endl</code> ใน hot loop", good: "<code>\"\\n\"</code>", why: "endl flush buffer ทุกครั้ง — ช้ามากใน loop 10⁶+" },
  { cat: "Perf", bad: "Forget <code>ios_base::sync_with_stdio(false)</code>", good: "เพิ่มที่ต้น main สำหรับ contest", why: "Default cin/cout sync กับ scanf/printf — overhead เยอะ" },
  { cat: "Perf", bad: "Recursive Fibonacci ตรง ๆ", good: "Memoization หรือ iterative", why: "Recursive = O(2ⁿ). fib(50) อาจรันชั่วโมง" },

  // Integer / Overflow
  { cat: "Math", bad: "<code>int factorial(int n)</code>", good: "<code>long long factorial(int n)</code>", why: "20! = 2.4×10¹⁸ — เกิน int (2.1×10⁹)" },
  { cat: "Math", bad: "<code>int sum = a + b;</code> เมื่อ a, b large", good: "<code>long long sum = (long long)a + b;</code>", why: "Cast operand ก่อน บวก เพื่อ promote" },
  { cat: "Math", bad: "<code>(-5) % 3</code> expects 1", good: "<code>((-5 % 3) + 3) % 3</code>", why: "C++ % คืน sign ของ left operand — ต่างจาก Python/Ruby" },
  { cat: "Math", bad: "<code>pow(2, 30)</code> in performance loop", good: "<code>1 &lt;&lt; 30</code> หรือ pre-compute", why: "pow() ใช้ double — slow + may lose precision" },

  // STL
  { cat: "STL", bad: "<code>map[k]</code> when k may not exist", good: "<code>map.count(k)</code> ก่อน หรือ <code>map.find(k)</code>", why: "[] สร้าง entry default ถ้า key หาย → side effect" },
  { cat: "STL", bad: "<code>multiset.erase(5)</code>", good: "<code>multiset.erase(multiset.find(5))</code>", why: ".erase(value) ลบ ทุก occurrence. ลบ 1 ตัวต้อง .find() ก่อน" },
  { cat: "STL", bad: "<code>sort(set.begin(), set.end())</code>", good: "Set ก็ sorted อยู่แล้ว — ไม่ต้อง sort", why: "Set ใช้ bidirectional iterator — sort ต้อง random access → compile error" },
  { cat: "STL", bad: "<code>priority_queue&lt;int&gt;</code> for min-heap", good: "<code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;&gt;&gt;</code>", why: "Default = max-heap. Min-heap ต้องระบุ explicitly" },
  { cat: "STL", bad: "<code>v.erase(it); ++it;</code>", good: "<code>it = v.erase(it);</code>", why: "erase invalidate iterator — ++it บน invalid = undefined" },
  { cat: "STL", bad: "<code>vector&lt;bool&gt;</code> for fast bit ops", good: "<code>bitset&lt;N&gt;</code> หรือ <code>vector&lt;char&gt;</code>", why: "vector&lt;bool&gt; เป็น special — slow access เพราะ proxy reference" },
  { cat: "STL", bad: "Use <code>unordered_map</code> in Codeforces", good: "<code>map</code> หรือ custom hash", why: "Default hash function predictable → anti-hash test → TLE" },

  // Graph
  { cat: "Graph", bad: "Adjacency matrix for sparse graph 10⁵ nodes", good: "Adjacency list", why: "10⁵ × 10⁵ = 10¹⁰ cells = 40GB. Adj list = O(V+E)" },
  { cat: "Graph", bad: "BFS ใช้ stack", good: "BFS ใช้ <b>queue</b>", why: "Stack → DFS. Queue → BFS (FIFO เพื่อ level-order)" },
  { cat: "Graph", bad: "Topological sort with cycle detection skipped", good: "Always check ‘visited all nodes?’ at end", why: "Cycle → not all visited → topo sort impossible" },
  { cat: "Graph", bad: "Dijkstra without ‘outdated entry’ check", good: "<code>if (d &gt; dist[u]) continue;</code>", why: "PQ อาจมี duplicate (u, d) ที่ outdated — process ซ้ำ = wrong + slow" },
  { cat: "Graph", bad: "Union-Find without path compression", good: "<code>par[x] = find(par[x])</code> in find()", why: "Without compression: tree may degenerate → O(n) per find" },

  // DP
  { cat: "DP", bad: "Recursive DP without memo", good: "Add <code>vector&lt;int&gt; memo</code> + check", why: "Exponential blowup จาก overlapping subproblems" },
  { cat: "DP", bad: "Memo storage too small", good: "Index ถูก — start from 0 หรือ 1 consistent", why: "off-by-one ใน memo → wrong cache hit/miss" },
  { cat: "DP", bad: "2D DP with O(n²) memory when O(n) works", good: "Roll-over: keep last 1-2 rows", why: "Memory limit อาจ exceed — space optimization บางทีจำเป็น" },

  // Recursion
  { cat: "Recursion", bad: "No base case", good: "Always check base FIRST", why: "Infinite recursion → stack overflow" },
  { cat: "Recursion", bad: "Deep recursion >10⁵ levels", good: "Convert to iteration + stack", why: "Stack limit ~10⁴-10⁵ — depends on per-frame size" },

  // Input/Output
  { cat: "I/O", bad: "<code>cin &gt;&gt; n; getline(cin, s);</code>", good: "<code>cin &gt;&gt; n; cin.ignore(); getline(cin, s);</code>", why: ">> ทิ้ง newline ไว้ → getline อ่าน empty string" },
  { cat: "I/O", bad: "<code>scanf + cout</code> mixed", good: "ใช้แค่ฝั่งใดฝั่งหนึ่ง", why: "Default sync ทำให้ work — แต่ sync_with_stdio(false) แตกหัก" },
  { cat: "I/O", bad: "Forget newline at end of output", good: "<code>cout &lt;&lt; \"...\" &lt;&lt; endl;</code>", why: "บาง judge เคร่ง — ไม่มี trailing newline = Wrong Answer" },

  // Patterns
  { cat: "Pattern", bad: "Brute force when O(n) hash possible", good: "Recognize ‘find pair sum = k’ → hash", why: "Two Sum pattern — hash O(n) vs nested loop O(n²)" },
  { cat: "Pattern", bad: "Sort + linear scan when 1-pass possible", good: "Find max/min in 1 pass", why: "Sort = O(n log n), single pass = O(n)" },
  { cat: "Pattern", bad: "Greedy ก่อนพิสูจน์", good: "Always check counterexample + exchange argument", why: "Greedy ผิดง่าย — ลอง 3-5 ตัวอย่างเล็ก ๆ ก่อน" },
  { cat: "Pattern", bad: "DFS recursive on deep tree", good: "Iterative + explicit stack", why: "Tree balanced lower depth, skewed deeper — convert ถ้า depth &gt; 10⁵" },
  { cat: "Pattern", bad: "Hardcode magic numbers", good: "<code>const int MOD = 1e9 + 7;</code>", why: "Readable + 1 place to change. Bug-prone otherwise" },

  // Compilation
  { cat: "Compile", bad: "Forget <code>#include &lt;algorithm&gt;</code>", good: "ใช้ <code>#include &lt;bits/stdc++.h&gt;</code> (GCC only)", why: "STL function ทุกตัวต้องมี header ที่เหมาะสม" },
  { cat: "Compile", bad: "<code>using namespace std;</code> in header", good: "Only in .cpp file, not .h", why: "Header included ทุก .cpp → pollute namespace ทั่วโปรเจค" },
];

Lessons26["common-mistakes"] = function () {
  const [cat, setCat] = useS26('ทั้งหมด');
  const cats = ['ทั้งหมด', ...Array.from(new Set(MISTAKES.map(m => m.cat)))];
  const filtered = cat === 'ทั้งหมด' ? MISTAKES : MISTAKES.filter(m => m.cat === cat);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⚠️ Common Mistakes — Anti-Pattern Catalog (50+ ข้อ)</div>
        รวมข้อผิดพลาดที่ <b>นักศึกษามือใหม่/มืออาชีพ</b> ทำบ่อย — รู้ไว้ก่อนเขียนผิดเอง
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{
              background: cat === c ? 'var(--accent)' : 'var(--bg-2)',
              color: cat === c ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 16, cursor: 'pointer', fontSize: 12, fontWeight: cat === c ? 600 : 400
            }}>
            {c} {c !== 'ทั้งหมด' && <span style={{ opacity: 0.6 }}>({MISTAKES.filter(m => m.cat === c).length})</span>}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 10 }}>
        {filtered.map((m, i) => (
          <div key={i} style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'inline-block', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 4, fontSize: 10, color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>{m.cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ padding: 8, background: 'rgba(248,113,113,0.08)', borderLeft: '3px solid #f87171', borderRadius: 4, fontSize: 12 }}>
                <b style={{ color: '#f87171' }}>❌ Bad:</b> <span dangerouslySetInnerHTML={{ __html: m.bad }} />
              </div>
              <div style={{ padding: 8, background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', borderRadius: 4, fontSize: 12 }}>
                <b style={{ color: '#10b981' }}>✓ Good:</b> <span dangerouslySetInnerHTML={{ __html: m.good }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', padding: 6 }}>
                💡 {m.why}
              </div>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   111 — QUICK REFERENCE (algorithm + complexity lookup)
============================================================ */
const QUICK_REF = [
  { name: "Binary Search", time: "O(log n)", space: "O(1)", note: "Sorted array — divide & conquer", snippet: "int lo=0, hi=n-1;\nwhile (lo<=hi) {\n  int m=lo+(hi-lo)/2;\n  if (a[m]==x) return m;\n  else if (a[m]<x) lo=m+1;\n  else hi=m-1;\n}\nreturn -1;" },
  { name: "BFS", time: "O(V+E)", space: "O(V)", note: "Shortest path unweighted, level-order", snippet: "queue<int> q; q.push(s);\nvis[s]=true;\nwhile (!q.empty()) {\n  int u=q.front(); q.pop();\n  for (int v:adj[u]) if (!vis[v]) {\n    vis[v]=true; q.push(v);\n  }\n}" },
  { name: "DFS", time: "O(V+E)", space: "O(V)", note: "Topological sort, cycle, components", snippet: "void dfs(int u) {\n  vis[u]=true;\n  for (int v:adj[u]) if (!vis[v]) dfs(v);\n}" },
  { name: "Dijkstra", time: "O((V+E) log V)", space: "O(V)", note: "Shortest path, non-negative weights", snippet: "priority_queue<pii, vector<pii>, greater<>> pq;\ndist[s]=0; pq.push({0,s});\nwhile (!pq.empty()) {\n  auto [d,u]=pq.top(); pq.pop();\n  if (d>dist[u]) continue;\n  for (auto [v,w]:adj[u])\n    if (d+w<dist[v]) {\n      dist[v]=d+w;\n      pq.push({dist[v],v});\n    }\n}" },
  { name: "Bellman-Ford", time: "O(V·E)", space: "O(V)", note: "Negative weights, detect negative cycle", snippet: "for (int i=0; i<V-1; i++)\n  for (auto [u,v,w]:edges)\n    if (dist[u]+w<dist[v])\n      dist[v]=dist[u]+w;\n// 1 more iter to detect cycle" },
  { name: "Floyd-Warshall", time: "O(V³)", space: "O(V²)", note: "All-pairs shortest path", snippet: "for (int k=0; k<n; k++)\n  for (int i=0; i<n; i++)\n    for (int j=0; j<n; j++)\n      d[i][j]=min(d[i][j], d[i][k]+d[k][j]);" },
  { name: "Merge Sort", time: "O(n log n)", space: "O(n)", note: "Stable, DAC", snippet: "void merge(int l,int m,int r){...}\nvoid sort(int l,int r){\n  if(l<r){int m=(l+r)/2;\n    sort(l,m); sort(m+1,r); merge(l,m,r);}\n}" },
  { name: "Quick Sort", time: "O(n log n) avg, O(n²) worst", space: "O(log n)", note: "In-place, not stable, random pivot", snippet: "int part(int l,int r){ /* Lomuto */ }\nvoid sort(int l,int r){\n  if(l<r){int p=part(l,r);\n    sort(l,p-1); sort(p+1,r);}\n}" },
  { name: "Heap Sort", time: "O(n log n)", space: "O(1)", note: "In-place, not stable", snippet: "make_heap(v.begin(),v.end());\nsort_heap(v.begin(),v.end());" },
  { name: "Counting Sort", time: "O(n+k)", space: "O(k)", note: "k=value range, stable", snippet: "vector<int> cnt(k+1,0);\nfor(int x:v) cnt[x]++;\n// prefix sum + place" },
  { name: "Union-Find (DSU)", time: "O(α(n)) per op", space: "O(n)", note: "Path compression + union by rank", snippet: "int find(int x){\n  if(par[x]==x) return x;\n  return par[x]=find(par[x]);\n}\nvoid uni(int a,int b){\n  par[find(a)]=find(b);\n}" },
  { name: "KMP", time: "O(n+m)", space: "O(m)", note: "Pattern matching, LPS array", snippet: "// build LPS\n// scan text" },
  { name: "Z-Algorithm", time: "O(n)", space: "O(n)", note: "Pattern, periodicity, palindrome", snippet: "// Z[i] = longest prefix-match\n// use Z-box invariant" },
  { name: "0/1 Knapsack DP", time: "O(n·W)", space: "O(W)", note: "Pseudo-poly", snippet: "for(int i=0;i<n;i++)\n  for(int w=W;w>=wt[i];w--)\n    dp[w]=max(dp[w],dp[w-wt[i]]+val[i]);" },
  { name: "LIS (n log n)", time: "O(n log n)", space: "O(n)", note: "Patience sort", snippet: "vector<int> tails;\nfor(int x:a){\n  auto it=lower_bound(tails.begin(),tails.end(),x);\n  if(it==tails.end()) tails.push_back(x);\n  else *it=x;\n}\nreturn tails.size();" },
  { name: "LCS", time: "O(m·n)", space: "O(m·n)", note: "Diff, edit distance", snippet: "if(s1[i]==s2[j]) dp[i][j]=dp[i-1][j-1]+1;\nelse dp[i][j]=max(dp[i-1][j],dp[i][j-1]);" },
  { name: "Edit Distance", time: "O(m·n)", space: "O(m·n)", note: "Levenshtein", snippet: "if(s1[i]==s2[j]) dp[i][j]=dp[i-1][j-1];\nelse dp[i][j]=1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});" },
  { name: "Sieve of Eratosthenes", time: "O(n log log n)", space: "O(n)", note: "Find all primes ≤ n", snippet: "for(int i=2;i*i<=n;i++)\n  if(sieve[i])\n    for(int j=i*i;j<=n;j+=i)\n      sieve[j]=false;" },
  { name: "Fast Power", time: "O(log n)", space: "O(1)", note: "a^n mod m", snippet: "ll pw(ll a,ll n,ll m){\n  ll r=1; a%=m;\n  while(n>0){\n    if(n&1) r=r*a%m;\n    a=a*a%m; n>>=1;\n  }\n  return r;\n}" },
  { name: "Extended Euclidean", time: "O(log min(a,b))", space: "O(log)", note: "ax+by=gcd(a,b)", snippet: "int extGCD(int a,int b,int&x,int&y){\n  if(!b){x=1;y=0; return a;}\n  int x1,y1, g=extGCD(b,a%b,x1,y1);\n  x=y1; y=x1-(a/b)*y1;\n  return g;\n}" },
];

Lessons26["quick-ref"] = function () {
  const [q, setQ] = useS26('');
  const filtered = QUICK_REF.filter(r =>
    !q || r.name.toLowerCase().includes(q.toLowerCase()) ||
    r.note.toLowerCase().includes(q.toLowerCase()) ||
    r.time.includes(q)
  );

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📖 Quick Reference — Algorithm Lookup</div>
        ค้นหาเร็ว: time/space complexity + code snippet — ใช้ก่อนสอบหรือตอนเขียนโค้ดจริง
      </div>

      <input value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 ค้นหา: 'BFS', 'O(log n)', 'sort', ..."
        style={{ width: '100%', padding: 12, fontSize: 14, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6, margin: '14px 0' }} />

      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10 }}>
        แสดง {filtered.length} / {QUICK_REF.length} algorithms
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 10 }}>
        {filtered.map((r, i) => (
          <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>{r.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(94,234,212,0.15)', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', color: 'var(--accent-2)' }}>⏱ {r.time}</span>
              <span style={{ background: 'rgba(168,139,250,0.15)', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', color: '#a78bfa' }}>💾 {r.space}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{r.note}</div>
            <pre style={{ background: '#0a0e14', padding: 10, borderRadius: 4, fontSize: 11, color: 'var(--text-0)', overflow: 'auto', margin: 0, lineHeight: 1.4 }}>{r.snippet}</pre>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   112 — NOTES / JOURNAL (per-lesson notes)
============================================================ */
const NOTES_KEY = "algo-academy-notes-v1";

Lessons26["notes"] = function () {
  const [notes, setNotes] = useS26(() => {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); } catch { return {}; }
  });
  const [selected, setSelected] = useS26('');
  const [text, setText] = useS26('');

  useE26(() => {
    if (selected) setText(notes[selected] || '');
  }, [selected]);

  const lessons = (window.ALL_LESSONS || []);
  const noteIds = Object.keys(notes).filter(k => notes[k] && notes[k].trim());

  const save = () => {
    if (!selected) return;
    const newNotes = { ...notes };
    if (text.trim()) newNotes[selected] = text;
    else delete newNotes[selected];
    setNotes(newNotes);
    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
  };

  const exportMd = () => {
    let md = `# Algorithm Academy Notes\n\nExport date: ${new Date().toLocaleString('th-TH')}\n\n`;
    noteIds.forEach(id => {
      const l = lessons.find(x => x.id === id);
      md += `## ${l ? l.title : id}\n\n${notes[id]}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'algorithm-notes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalChars = noteIds.reduce((s, id) => s + (notes[id] || '').length, 0);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📓 Notes / Journal — บันทึกส่วนตัวต่อบท</div>
        เขียน note สรุปสิ่งที่เรียน — เก็บใน browser (localStorage) — export เป็น Markdown ได้
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, margin: '14px 0' }}>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-2)' }}>{noteIds.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>บทมี note</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{totalChars.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ตัวอักษรรวม</div>
        </div>
        <button onClick={exportMd} disabled={noteIds.length === 0}
          style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          📥 Export ทั้งหมดเป็น .md
        </button>
      </div>

      <h3>เลือกบทเพื่อจดบันทึก</h3>
      <select value={selected} onChange={e => setSelected(e.target.value)}
        style={{ width: '100%', padding: 10, fontSize: 14, background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 10 }}>
        <option value="">— เลือกบทเรียน —</option>
        {lessons.map(l => (
          <option key={l.id} value={l.id}>
            {notes[l.id] ? '📝 ' : '○ '}{l.title}
          </option>
        ))}
      </select>

      {selected && (
        <React.Fragment>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder={`เขียน note สำหรับบท ‘${(lessons.find(l => l.id === selected) || {}).title || ''}’...\n\nเช่น:\n- Big-O ของ algorithm นี้\n- ตัวอย่างที่เข้าใจดี\n- จุดที่งง / ต้องกลับมาอ่านใหม่\n- โจทย์ที่ทำผิด + วิธีแก้`}
            style={{
              width: '100%', minHeight: 280, padding: 14,
              background: 'var(--bg-1)', color: 'var(--text-0)',
              border: '1px solid var(--border)', borderRadius: 6,
              fontFamily: 'monospace', fontSize: 14, lineHeight: 1.6, resize: 'vertical'
            }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={save} style={{ background: 'var(--accent)', color: '#000', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              💾 Save note
            </button>
            <span style={{ color: 'var(--text-2)', fontSize: 12, alignSelf: 'center' }}>
              {text.length} chars · {text.split('\n').length} lines
            </span>
          </div>
        </React.Fragment>
      )}

      {noteIds.length > 0 && (
        <React.Fragment>
          <h3 style={{ marginTop: 22 }}>📚 บทที่มี note ({noteIds.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {noteIds.map(id => {
              const l = lessons.find(x => x.id === id);
              return (
                <div key={id} onClick={() => setSelected(id)}
                  style={{ padding: 10, background: selected === id ? 'rgba(94,234,212,0.15)' : 'var(--bg-2)', border: '1px solid ' + (selected === id ? 'var(--accent-2)' : 'var(--border)'), borderRadius: 6, cursor: 'pointer' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>📝 {l ? l.title : id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {notes[id].slice(0, 100)}{notes[id].length > 100 ? '...' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

/* ============================================================
   113 — VIDEO HUB (curated learning resources)
============================================================ */
const VIDEO_RESOURCES = [
  {
    cat: "🎓 Full Courses (Free)",
    items: [
      { name: "MIT 6.006 — Introduction to Algorithms", source: "MIT OpenCourseWare", desc: "Course พื้นฐานระดับ MIT — Big-O, sort, DS, graph, DP", search: "MIT OCW 6.006 Introduction to Algorithms" },
      { name: "MIT 6.046 — Design and Analysis of Algorithms", source: "MIT OpenCourseWare", desc: "ต่อจาก 6.006 — advanced: amortized, network flow, NP, approximation", search: "MIT OCW 6.046" },
      { name: "Princeton — Algorithms Part I & II (Sedgewick)", source: "Coursera", desc: "Java-based, ดี structure ครบ + visualizations", search: "Coursera Princeton Algorithms Sedgewick" },
      { name: "Stanford — Algorithms Specialization (Roughgarden)", source: "Coursera", desc: "Mathematical + design — เน้น proof + analysis", search: "Coursera Stanford Algorithms Roughgarden" },
    ]
  },
  {
    cat: "📺 YouTube Channels — Algorithm Focused",
    items: [
      { name: "William Fiset", source: "YouTube", desc: "Graph algorithms ครบมาก (Union-Find, SCC, network flow) — Java code", search: "YouTube William Fiset graph theory" },
      { name: "Errichto Algorithms", source: "YouTube", desc: "Competitive programming — clear English explanations", search: "YouTube Errichto algorithms" },
      { name: "Tushar Roy — Coding Made Simple", source: "YouTube", desc: "DP problems แก้ละเอียดมาก — มี trace ทุก step", search: "YouTube Tushar Roy coding simple" },
      { name: "Abdul Bari", source: "YouTube", desc: "Hindi/English — explain algorithm ด้วยมือ บน whiteboard", search: "YouTube Abdul Bari algorithms" },
      { name: "back to back SWE", source: "YouTube", desc: "Interview problems — focused, articulate", search: "YouTube back to back SWE" },
    ]
  },
  {
    cat: "🎨 Visual Learning",
    items: [
      { name: "3Blue1Brown", source: "YouTube", desc: "Math + algorithm visualizations ระดับ god-tier", search: "YouTube 3blue1brown" },
      { name: "VisuAlgo.net", source: "Website", desc: "Interactive visualization ของ algorithms ครบทุกตัว", search: "visualgo.net" },
      { name: "Algorithm Visualizer", source: "Website", desc: "Code → animation ที่ scroll ด้วย", search: "algorithm-visualizer.org" },
    ]
  },
  {
    cat: "🇹🇭 Thai Resources",
    items: [
      { name: "BorntoDev — Algorithm ภาษาไทย", source: "YouTube", desc: "เริ่มต้น algorithm ภาษาไทย — เหมาะมือใหม่", search: "YouTube BorntoDev algorithm" },
      { name: "อาจารย์ปวริศ — Algorithm จุฬาฯ", source: "YouTube", desc: "บรรยายระดับมหาลัย ภาษาไทย", search: "YouTube ปวริศ algorithm" },
      { name: "Mike Codeguide", source: "YouTube", desc: "เริ่มต้น programming + algorithm ภาษาไทย", search: "YouTube Mike Codeguide" },
    ]
  },
  {
    cat: "🏆 Competitive Programming",
    items: [
      { name: "CP-Algorithms (cp-algorithms.com)", source: "Website", desc: "Reference site — algorithm + implementation ครบ", search: "cp-algorithms.com" },
      { name: "USACO Guide", source: "Website", desc: "Structured progression bronze→platinum", search: "usaco.guide" },
      { name: "Codeforces EDU", source: "Website", desc: "Step-by-step modules + interactive problems", search: "codeforces.com/edu" },
      { name: "AtCoder Educational DP Contest", source: "AtCoder", desc: "26 DP problems classics", search: "AtCoder Educational DP Contest" },
      { name: "Competitive Programming Handbook (Halim)", source: "PDF/Book", desc: "หนังสือฟรี — bible ของ ICPC", search: "Competitive Programming 4 Halim PDF" },
    ]
  },
  {
    cat: "📚 Textbooks (must-have)",
    items: [
      { name: "CLRS — Introduction to Algorithms (4th ed.)", source: "Cormen et al.", desc: "Bible ของ algorithm — มี exercises เยอะ", search: "CLRS 4th edition" },
      { name: "Algorithm Design — Kleinberg & Tardos", source: "Kleinberg & Tardos", desc: "Reader-friendly — เน้น design + intuition", search: "Algorithm Design Kleinberg Tardos" },
      { name: "Algorithms — Sedgewick & Wayne", source: "Princeton", desc: "Code-first, มี visualization", search: "Algorithms Sedgewick 4th edition" },
      { name: "The Algorithm Design Manual — Skiena", source: "Skiena", desc: "Practical — ‘war stories’ + war room style", search: "Algorithm Design Manual Skiena" },
    ]
  },
];

Lessons26["video-hub"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📺 Video & Resource Hub</div>
        คอลเลคชั่นแหล่งเรียนรู้ที่<b>เชื่อถือได้</b> — videos, courses, websites, books<br/>
        เว็บนี้ครอบคลุมเนื้อหา แต่ <b>fluency</b> มาจากการดู/ฟัง/อ่านหลายมุม
      </div>

      {VIDEO_RESOURCES.map((sec, si) => (
        <div key={si} style={{ marginBottom: 22 }}>
          <h3>{sec.cat}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {sec.items.map((it, ii) => (
              <div key={ii} style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{it.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>📌 {it.source}</div>
                <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5, marginBottom: 8 }}>{it.desc}</div>
                <button onClick={() => {
                  const q = encodeURIComponent(it.search);
                  window.open(`https://www.google.com/search?q=${q}`, '_blank');
                }}
                  style={{ background: 'var(--bg-3)', color: 'var(--accent-2)', border: '1px solid var(--accent-2)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                  🔍 ค้นหา "{it.search}"
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="callout tip">
        <div className="ttl">💡 วิธีใช้ resources ให้คุ้ม</div>
        <ol style={{ marginTop: 4, color: 'var(--text-1)' }}>
          <li><b>เรียนจากเว็บนี้ก่อน</b> — เพื่อรู้ structure + พื้นฐาน</li>
          <li><b>ดู video</b> — ฟัง explanation อีกมุม อาจมี ‘aha moment’</li>
          <li><b>อ่าน textbook</b> — ลึกที่สุด มี proof แบบ formal</li>
          <li><b>ทำ practice site</b> — Codeforces, LeetCode — สร้าง muscle memory</li>
        </ol>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   114 — CAPSTONE PROJECTS (apply algorithms to real projects)
============================================================ */
const CAPSTONE = [
  {
    icon: "🗺️",
    title: "Maze Solver Visualizer",
    diff: "⭐⭐ Beginner-Intermediate",
    desc: "เว็บที่ user วาด maze ด้วย mouse → กดปุ่ม → animate BFS/DFS/A* หา shortest path",
    skills: ["BFS", "DFS", "A* search", "Canvas/SVG drawing"],
    spec: "1. Grid (20×20) — click เปลี่ยน wall/start/end<br/>2. Algorithm dropdown: BFS, DFS, Dijkstra, A*<br/>3. Animate visited cells + final path<br/>4. Compare metrics: cells visited, path length, time<br/>5. Generate random maze (recursive backtracking)",
    related: ["bfs", "dfs", "dijkstra"]
  },
  {
    icon: "⌨️",
    title: "Autocomplete System",
    diff: "⭐⭐⭐ Intermediate",
    desc: "Input box ที่ type ตัวอักษร → แสดง suggestions ใต้ผ่าน trie-based search",
    skills: ["Trie", "Levenshtein distance", "Ranking"],
    spec: "1. Load dictionary (100K+ words)<br/>2. Type 'pro' → show ['program', 'project', 'professional', ...]<br/>3. Typo: 'prgr' → suggest 'program' (edit distance ≤ 2)<br/>4. Frequency-based ranking<br/>5. Cache recent searches",
    related: ["trie", "edit-distance"]
  },
  {
    icon: "🎵",
    title: "Music Recommender (Collaborative Filtering)",
    diff: "⭐⭐⭐⭐ Advanced",
    desc: "User rate เพลง → ระบบ recommend เพลงใหม่จาก similar users",
    skills: ["Matrix factorization", "Cosine similarity", "K-nearest neighbors"],
    spec: "1. User-song rating matrix (sparse)<br/>2. Find K similar users (cosine sim)<br/>3. Recommend songs they liked but current user hasn't heard<br/>4. Optional: SVD for matrix factorization<br/>5. UI: show top-10 recs + ‘why this rec’",
    related: ["matrix-mult"]
  },
  {
    icon: "📅",
    title: "Class Scheduler",
    diff: "⭐⭐⭐ Intermediate",
    desc: "Input: courses + prerequisites + time slots — output: feasible schedule (เช่นมหาลัย)",
    skills: ["Topological sort", "Graph coloring", "Constraint satisfaction"],
    spec: "1. Course list + prereq edges<br/>2. Topological sort → semester ordering<br/>3. Time slot assignment (graph coloring — no conflict)<br/>4. Detect: ‘ไม่สามารถ schedule ได้’ → which prereq cycle?<br/>5. Visualize timetable",
    related: ["topo-sort", "cycle-detect"]
  },
  {
    icon: "💸",
    title: "Currency Arbitrage Detector",
    diff: "⭐⭐⭐⭐ Advanced",
    desc: "Real-time exchange rates → หา trading cycle ที่ทำกำไร",
    skills: ["Bellman-Ford (negative cycle detection)", "Graph modeling", "Log transformation"],
    spec: "1. Fetch FX rates (could use mock data)<br/>2. Build graph: vertex = currency, edge = -log(rate)<br/>3. Bellman-Ford → negative cycle = arbitrage<br/>4. Output: trading sequence + expected profit<br/>5. Alert when found",
    related: ["bellman-ford"]
  },
  {
    icon: "🗜️",
    title: "Text Compressor (Huffman)",
    diff: "⭐⭐⭐ Intermediate",
    desc: "Upload text file → compress to .huff → decompress",
    skills: ["Huffman coding", "Priority queue", "File I/O", "Bit manipulation"],
    spec: "1. Read text → count char frequency<br/>2. Build Huffman tree (PQ)<br/>3. Generate codes — encode text<br/>4. Save: tree + bitstream<br/>5. Decode back — verify lossless<br/>6. Show compression ratio",
    related: ["huffman"]
  },
  {
    icon: "🔍",
    title: "Mini Search Engine",
    diff: "⭐⭐⭐⭐⭐ Hard",
    desc: "Index 100+ web pages → search by keyword → rank results",
    skills: ["Trie / hash index", "TF-IDF", "PageRank (simplified)", "Tokenization"],
    spec: "1. Crawl/load corpus (e.g., Wikipedia subset)<br/>2. Tokenize + build inverted index<br/>3. Query → match docs<br/>4. Rank by TF-IDF or simple PageRank<br/>5. UI: query box + ranked results + snippet",
    related: ["hashing", "trie"]
  },
  {
    icon: "🎮",
    title: "Sudoku Solver + Generator",
    diff: "⭐⭐ Intermediate",
    desc: "Generate valid Sudoku puzzle → user solve → can auto-solve too",
    skills: ["Backtracking", "Constraint propagation", "Random generation"],
    spec: "1. 9×9 grid input UI<br/>2. Solve button: backtracking with constraint check<br/>3. Generate puzzle: start with full solution, remove cells (random, ensure unique solution)<br/>4. Difficulty levels: easy/medium/hard<br/>5. Hint button: show 1 step",
    related: ["backtracking"]
  },
];

Lessons26["capstone"] = function () {
  const [idx, setIdx] = useS26(0);
  const c = CAPSTONE[idx];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎓 Capstone Projects — เอา algorithm ไปใช้จริง</div>
        จะ <b>เก่งจริง</b> ต้องสร้างของจริง — ทำ 1-2 projects เหล่านี้ จะรู้ว่าเข้าใจหรือยัง<br/>
        ใส่ใน portfolio สมัครงานได้ด้วย!
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 6, margin: '14px 0' }}>
        {CAPSTONE.map((cp, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{
              background: idx === i ? 'var(--accent)' : 'var(--bg-2)',
              color: idx === i ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: 10, borderRadius: 8, cursor: 'pointer',
              textAlign: 'center', fontSize: 11
            }}>
            <div style={{ fontSize: 22 }}>{cp.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{cp.title.split(' (')[0]}</div>
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 36 }}>{c.icon}</span>
          <div>
            <h3 style={{ margin: 0, color: 'var(--accent)' }}>{c.title}</h3>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.diff}</div>
          </div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-1)', marginBottom: 14, fontStyle: 'italic' }}>{c.desc}</div>

        <div style={{ background: 'rgba(94,234,212,0.06)', padding: 12, borderRadius: 8, marginBottom: 14 }}>
          <b style={{ color: 'var(--accent-2)' }}>🛠️ Skills:</b>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {c.skills.map((s, i) => (
              <span key={i} style={{ background: 'var(--bg-3)', padding: '2px 10px', borderRadius: 12, fontSize: 12, color: 'var(--accent-2)' }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 8, marginBottom: 12 }}>
          <b style={{ color: 'var(--accent)' }}>📋 Specification:</b>
          <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.8, marginTop: 6 }} dangerouslySetInnerHTML={{ __html: c.spec }} />
        </div>

        {c.related && c.related.length > 0 && (
          <div style={{ padding: 10, background: 'rgba(168,139,250,0.08)', borderRadius: 6 }}>
            <b style={{ color: '#a78bfa' }}>📚 บทเรียนที่เกี่ยวข้อง:</b>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
              {c.related.map(id => {
                const lesson = (window.ALL_LESSONS || []).find(l => l.id === id);
                if (!lesson) return null;
                return (
                  <button key={id} onClick={() => { window.location.hash = '/' + id; }}
                    style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: '1px solid #a78bfa', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    → {lesson.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <CS26 title="🏁 วิธีเริ่ม Project ของคุณ" sections={[
        { label: "1. Setup", value: "Git repo + README + tech stack (React + JS / Python + Flask / etc.)" },
        { label: "2. MVP", value: "Minimum viable — แค่ core algorithm + simple UI ก่อน" },
        { label: "3. Iterate", value: "เพิ่ม feature ทีละ 1 — test ทุกครั้ง" },
        { label: "4. Polish", value: "UX, animation, edge cases, performance" },
        { label: "5. Deploy", value: "GitHub Pages (free) / Vercel / Netlify — link ใน portfolio" },
      ]} />
    </React.Fragment>
  );
};

window.LessonsPart26 = Lessons26;
