/* Lessons Part 5 — Race, Pattern Trainer, Advanced Visualizers, Mock Exam */

const { useState: useS5, useMemo: useM5, useEffect: useE5, useRef: useR5 } = React;
const { Quiz: Quiz5 } = window.LessonComponents;

const Lessons5 = {};

/* ============================================================
   33 — ALGORITHM RACE
============================================================ */
function generateInput(kind, n) {
  if (kind === 'random') return Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
  if (kind === 'sorted') return Array.from({ length: n }, (_, i) => i + 1);
  if (kind === 'reversed') return Array.from({ length: n }, (_, i) => n - i);
  if (kind === 'few-unique') return Array.from({ length: n }, () => [3, 7, 1, 9, 5][Math.floor(Math.random() * 5)]);
  if (kind === 'nearly-sorted') {
    const a = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = 0; i < Math.floor(n / 10); i++) {
      const x = Math.floor(Math.random() * n), y = Math.floor(Math.random() * n);
      [a[x], a[y]] = [a[y], a[x]];
    }
    return a;
  }
  return [];
}

function countOps(algo, arr) {
  const a = [...arr];
  let cmp = 0, swp = 0;
  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++)
      for (let j = 0; j < a.length - 1 - i; j++) {
        cmp++;
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swp++; }
      }
  } else if (algo === 'selection') {
    for (let i = 0; i < a.length; i++) {
      let mn = i;
      for (let j = i + 1; j < a.length; j++) { cmp++; if (a[j] < a[mn]) mn = j; }
      if (mn !== i) { [a[i], a[mn]] = [a[mn], a[i]]; swp++; }
    }
  } else if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) { cmp++; if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; swp++; j--; } else break; }
    }
  } else if (algo === 'merge') {
    function merge(l, m, r) {
      const tmp = [];
      let i = l, j = m + 1;
      while (i <= m && j <= r) { cmp++; if (a[i] <= a[j]) tmp.push(a[i++]); else tmp.push(a[j++]); }
      while (i <= m) tmp.push(a[i++]);
      while (j <= r) tmp.push(a[j++]);
      for (let k = 0; k < tmp.length; k++) { a[l + k] = tmp[k]; swp++; }
    }
    function ms(l, r) { if (l < r) { const m = (l + r) >> 1; ms(l, m); ms(m + 1, r); merge(l, m, r); } }
    ms(0, a.length - 1);
  } else if (algo === 'quick') {
    function qs(lo, hi) {
      if (lo >= hi) return;
      const piv = a[hi]; let i = lo - 1;
      for (let j = lo; j < hi; j++) { cmp++; if (a[j] <= piv) { i++;[a[i], a[j]] = [a[j], a[i]]; swp++; } }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]]; swp++;
      qs(lo, i); qs(i + 2, hi);
    }
    qs(0, a.length - 1);
  }
  return { cmp, swp, total: cmp + swp };
}

Lessons5["race"] = function () {
  const [n, setN] = useS5(30);
  const [kind, setKind] = useS5('random');
  const [results, setResults] = useS5(null);

  const run = () => {
    const arr = generateInput(kind, n);
    const algos = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
    const r = algos.map(a => ({ name: a, ...countOps(a, arr) }));
    r.sort((a, b) => a.total - b.total);
    setResults(r);
  };

  const max = results ? Math.max(...results.map(r => r.total)) : 1;
  const COLORS = { bubble: '#fbbf24', selection: '#fb923c', insertion: '#f87171', merge: '#a78bfa', quick: '#5eead4' };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🏎️ Algorithm Race — แข่ง 5 sorts บน input เดียวกัน</div>
        เห็นภาพชัดว่าทำไม sort แต่ละแบบเร็ว/ช้าต่างกัน ใน input รูปแบบต่างๆ
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '14px 0' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>ขนาด input (n)</div>
          <input type="range" min="10" max="100" value={n} onChange={e => setN(+e.target.value)} style={{ width: '100%' }} />
          <div style={{ textAlign: 'center', color: 'var(--accent-2)', fontFamily: 'monospace' }}>n = {n}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>รูปแบบ input</div>
          <select value={kind} onChange={e => setKind(e.target.value)}
            style={{ width: '100%', padding: 8, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }}>
            <option value="random">Random</option>
            <option value="sorted">Sorted (เรียงแล้ว)</option>
            <option value="reversed">Reversed (กลับด้าน)</option>
            <option value="few-unique">Few unique (ซ้ำเยอะ)</option>
            <option value="nearly-sorted">Nearly sorted</option>
          </select>
        </div>
      </div>

      <button onClick={run} style={{ background: 'var(--accent)', color: '#000', padding: '10px 24px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
        🏁 START RACE
      </button>

      {results && (
        <div style={{ marginTop: 18 }}>
          <h3>🏆 Leaderboard</h3>
          {results.map((r, i) => (
            <div key={r.name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-1)' }}>
                  <b>#{i + 1}</b> {r.name.toUpperCase()} {i === 0 && '🏆'}
                </span>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-2)' }}>
                  {r.cmp} cmp · {r.swp} swap · <b style={{ color: 'var(--accent-2)' }}>{r.total} ops</b>
                </span>
              </div>
              <div style={{ background: 'var(--bg-1)', height: 22, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  background: COLORS[r.name], height: '100%',
                  width: `${(r.total / max) * 100}%`,
                  transition: 'width .8s ease-out'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3>💡 ดูยังไงให้เข้าใจ</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Random:</b> Merge/Quick ชนะชัด — Bubble/Insertion ช้าตามทฤษฎี O(n²)</li>
        <li><b>Sorted:</b> Insertion เร็วสุด O(n)! แต่ <b>Quick worst case O(n²)</b> — pivot ไม่ดี</li>
        <li><b>Reversed:</b> Insertion ช้าสุด — ทุก insert ต้องเลื่อนทุกตัวก่อนหน้า</li>
        <li><b>Few unique:</b> swap น้อยแต่ comparison เยอะ</li>
        <li><b>Nearly sorted:</b> Insertion ชนะสบาย — เลื่อนน้อยมาก</li>
      </ul>
      <div className="callout success">
        <div className="ttl">Insight</div>
        "ดีที่สุด" ขึ้นกับ input — ไม่มี one-size-fits-all นี่คือเหตุผลที่ <code>std::sort()</code> ใช้ <b>introsort</b> (quick + heap + insertion ผสม)
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   38 — PATTERN TRAINER
============================================================ */
const PATTERNS = ['Brute Force', 'Divide & Conquer', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Two Pointers', 'Sliding Window'];

const PT_QUESTIONS = [
  {
    code: `for (int i = 0; i < n; i++)
  for (int j = i+1; j < n; j++)
    if (a[i] + a[j] == target)
      return {i, j};`,
    answer: 'Brute Force',
    explain: 'Loop ซ้อน 2 ชั้น ลองทุกคู่ — O(n²) brute force'
  },
  {
    code: `int l = 0, r = n - 1;
while (l < r) {
  if (a[l] + a[r] == target) return {l, r};
  if (a[l] + a[r] < target) l++;
  else r--;
}`,
    answer: 'Two Pointers',
    explain: 'pointer ซ้าย-ขวาขยับเข้าหากันบน sorted array — O(n)'
  },
  {
    code: `int sum = 0;
for (int i = 0; i < k; i++) sum += a[i];
int best = sum;
for (int i = k; i < n; i++) {
  sum += a[i] - a[i-k];
  best = max(best, sum);
}`,
    answer: 'Sliding Window',
    explain: 'เพิ่มตัวขวา ลบตัวซ้าย ขนาด window คงที่ k — O(n)'
  },
  {
    code: `void mergeSort(vector<int>& a, int l, int r) {
  if (l >= r) return;
  int m = (l + r) / 2;
  mergeSort(a, l, m);
  mergeSort(a, m+1, r);
  merge(a, l, m, r);
}`,
    answer: 'Divide & Conquer',
    explain: 'แบ่งครึ่ง → recurse ทั้ง 2 ฝั่ง → combine'
  },
  {
    code: `vector<int> dp(n+1, 0);
dp[0] = 1;
for (int c : coins)
  for (int x = c; x <= amount; x++)
    dp[x] += dp[x-c];`,
    answer: 'Dynamic Programming',
    explain: 'มี dp[] table + recurrence ใช้ค่าเก่า — coin change DP'
  },
  {
    code: `void perm(vector<int>& a, int l, int r) {
  if (l == r) { print(a); return; }
  for (int i = l; i <= r; i++) {
    swap(a[l], a[i]);
    perm(a, l+1, r);
    swap(a[l], a[i]);  // undo
  }
}`,
    answer: 'Backtracking',
    explain: 'มี swap + recurse + undo (swap กลับ) — pattern backtracking ชัดเจน'
  },
  {
    code: `sort(activities.begin(), activities.end(),
  [](Act a, Act b) { return a.f < b.f; });
int count = 1, lastF = activities[0].f;
for (int i = 1; i < n; i++)
  if (activities[i].s >= lastF) {
    count++;
    lastF = activities[i].f;
  }`,
    answer: 'Greedy',
    explain: 'sort ตาม finish time + เลือก local optimum — Activity Selection'
  },
  {
    code: `int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
  vector<vector<int>> M(n+1, vector<int>(W+1, 0));
  for (int i = 1; i <= n; i++)
    for (int w = 0; w <= W; w++) {
      M[i][w] = M[i-1][w];
      if (wt[i-1] <= w)
        M[i][w] = max(M[i][w], M[i-1][w-wt[i-1]] + val[i-1]);
    }
  return M[n][W];
}`,
    answer: 'Dynamic Programming',
    explain: 'M[i][w] table 2D + recurrence — 0/1 Knapsack DP'
  },
  {
    code: `int binarySearch(vector<int>& a, int target) {
  int lo = 0, hi = a.size() - 1;
  while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    answer: 'Divide & Conquer',
    explain: 'แบ่งครึ่งทุกครั้ง ตามค่า target — D&C แบบ iterative'
  },
  {
    code: `void nQueens(int row, vector<int>& placement) {
  if (row == n) { record(placement); return; }
  for (int col = 0; col < n; col++) {
    if (safe(row, col, placement)) {
      placement[row] = col;
      nQueens(row + 1, placement);
      placement[row] = -1;  // undo
    }
  }
}`,
    answer: 'Backtracking',
    explain: 'try → recurse → undo, มี pruning ด้วย safe()'
  },
  {
    code: `sort(items, [](Item a, Item b) {
  return a.value/a.weight > b.value/b.weight;
});
double total = 0;
for (auto& it : items) {
  if (W >= it.weight) { total += it.value; W -= it.weight; }
  else { total += it.value * (W / it.weight); break; }
}`,
    answer: 'Greedy',
    explain: 'sort ตาม value/weight ratio + ใส่ตามลำดับ — Fractional Knapsack'
  },
  {
    code: `int maxSum = INT_MIN;
for (int i = 0; i < n; i++) {
  int sum = 0;
  for (int j = i; j < n; j++) {
    sum += a[j];
    maxSum = max(maxSum, sum);
  }
}`,
    answer: 'Brute Force',
    explain: 'ลอง subarray ทุกแบบ O(n²) — brute force ของ Maximum Subarray'
  },
];

Lessons5["pattern-trainer"] = function () {
  const [idx, setIdx] = useS5(0);
  const [picked, setPicked] = useS5(null);
  const [show, setShow] = useS5(false);
  const [score, setScore] = useS5({ correct: 0, total: 0, streak: 0 });
  const q = PT_QUESTIONS[idx];

  const submit = () => {
    if (picked === null) return;
    setShow(true);
    const isCorrect = picked === q.answer;
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
      streak: isCorrect ? s.streak + 1 : 0
    }));
  };
  const next = () => {
    setIdx((idx + 1) % PT_QUESTIONS.length);
    setPicked(null); setShow(false);
  };
  const reset = () => {
    setIdx(0); setPicked(null); setShow(false);
    setScore({ correct: 0, total: 0, streak: 0 });
  };

  const acc = score.total ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Pattern Recognition Trainer</div>
        ดู code → ระบุว่าเป็น pattern อะไร — ฝึกตา + สมองให้แม่น เพราะข้อสอบมัก<b>ให้ code มาแล้วถาม</b>ว่า "วิธีอะไร, complexity เท่าไร"
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '14px 0' }}>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fbbf24' }}>{score.streak}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Streak 🔥</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-2)' }}>{score.correct}/{score.total}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Correct</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{acc}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Accuracy</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{idx + 1}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Q #</div>
        </div>
      </div>

      <pre className="code" style={{ minHeight: 160 }}>{q.code}</pre>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginTop: 12 }}>
        {PATTERNS.map(p => {
          let style = { background: 'var(--bg-2)', color: 'var(--text-1)', border: '1px solid var(--border)' };
          if (show) {
            if (p === q.answer) style = { background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981' };
            else if (p === picked) style = { background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444' };
          } else if (picked === p) {
            style = { background: 'rgba(94,234,212,0.15)', color: 'var(--accent-2)', border: '1px solid var(--accent-2)' };
          }
          return (
            <button key={p} onClick={() => !show && setPicked(p)}
              style={{ ...style, padding: '10px', borderRadius: 6, cursor: show ? 'default' : 'pointer', fontSize: 13, fontWeight: 500 }}>
              {p}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        {!show ? (
          <button onClick={submit} disabled={picked === null}
            style={{ background: 'var(--accent)', color: '#000', padding: '10px 20px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: picked === null ? 'not-allowed' : 'pointer', opacity: picked === null ? 0.5 : 1 }}>
            ตรวจคำตอบ
          </button>
        ) : (
          <button onClick={next} style={{ background: 'var(--accent)', color: '#000', padding: '10px 20px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
            Next ▶
          </button>
        )}
        <button onClick={reset} style={{ background: 'transparent', color: 'var(--text-2)', padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
          🔄 เริ่มใหม่
        </button>
      </div>

      {show && (
        <div className={picked === q.answer ? "callout success" : "callout warn"} style={{ marginTop: 12 }}>
          <div className="ttl">{picked === q.answer ? '✓ ถูกต้อง!' : '✗ ยังไม่ถูก'}</div>
          คำตอบ: <b>{q.answer}</b> — {q.explain}
        </div>
      )}
    </React.Fragment>
  );
};

/* ============================================================
   39 — ADVANCED VISUALIZERS (Karatsuba, Strassen M1-M7, Floyd, QS3)
============================================================ */
function KaratsubaViz() {
  const [X, setX] = useS5(1234);
  const [Y, setY] = useS5(5678);
  const [steps, setSteps] = useS5([]);
  const [idx, setIdx] = useS5(0);

  const run = () => {
    const log = [];
    function k(x, y, depth) {
      log.push({ depth, type: 'call', x, y });
      if (x < 10 || y < 10) {
        log.push({ depth, type: 'base', x, y, result: x * y });
        return x * y;
      }
      const n = Math.max(String(x).length, String(y).length);
      const m = Math.floor(n / 2);
      const p = Math.pow(10, m);
      const a = Math.floor(x / p), b = x % p;
      const c = Math.floor(y / p), d = y % p;
      log.push({ depth, type: 'split', a, b, c, d, m });
      const z2 = k(a, c, depth + 1);
      const z0 = k(b, d, depth + 1);
      const z1 = k(a + b, c + d, depth + 1) - z2 - z0;
      const result = z2 * Math.pow(10, 2 * m) + z1 * p + z0;
      log.push({ depth, type: 'combine', z0, z1, z2, result });
      return result;
    }
    k(X, Y, 0);
    setSteps(log); setIdx(0);
  };

  const cur = steps[idx];

  return (
    <div className="dsv">
      <div className="ctrls">
        <label>X = <input type="number" value={X} onChange={e => setX(+e.target.value || 0)} style={{ width: 80 }} /></label>
        <label>Y = <input type="number" value={Y} onChange={e => setY(+e.target.value || 0)} style={{ width: 80 }} /></label>
        <button onClick={run}>▶ Run Karatsuba</button>
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {idx + 1} / {steps.length || 0}</span>
        <button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx >= steps.length - 1}>▶</button>
      </div>
      {cur && (
        <div style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, marginLeft: cur.depth * 24 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>depth {cur.depth} · {cur.type}</div>
          {cur.type === 'call' && <div>karatsuba({cur.x}, {cur.y})</div>}
          {cur.type === 'base' && <div style={{ color: '#10b981' }}>base case: {cur.x} × {cur.y} = <b>{cur.result}</b></div>}
          {cur.type === 'split' && <div style={{ fontFamily: 'monospace' }}>X = {cur.a}·10^{cur.m} + {cur.b}<br />Y = {cur.c}·10^{cur.m} + {cur.d}</div>}
          {cur.type === 'combine' && <div style={{ fontFamily: 'monospace' }}>z2={cur.z2}, z1={cur.z1}, z0={cur.z0} → <b style={{ color: 'var(--accent-2)' }}>{cur.result}</b></div>}
        </div>
      )}
      <div className="callout success" style={{ marginTop: 12 }}>
        <div className="ttl">Insight</div>
        ทุก call มี <b>3 sub-multiply</b> (ไม่ใช่ 4) — z2, z0, z1 — นี่คือเหตุผลที่ Karatsuba เร็วกว่า naive: T(n) = 3T(n/2) + O(n) → O(n^1.585)
      </div>
    </div>
  );
}

function StrassenViz() {
  const [step, setStep] = useS5(0);
  const A = [[1, 2], [3, 4]];
  const B = [[5, 6], [7, 8]];
  const M = [
    { name: 'M1', formula: '(A11+A22)(B11+B22)', val: (1 + 4) * (5 + 8) },
    { name: 'M2', formula: '(A21+A22) · B11', val: (3 + 4) * 5 },
    { name: 'M3', formula: 'A11 · (B12-B22)', val: 1 * (6 - 8) },
    { name: 'M4', formula: 'A22 · (B21-B11)', val: 4 * (7 - 5) },
    { name: 'M5', formula: '(A11+A12) · B22', val: (1 + 2) * 8 },
    { name: 'M6', formula: '(A21-A11)(B11+B12)', val: (3 - 1) * (5 + 6) },
    { name: 'M7', formula: '(A12-A22)(B21+B22)', val: (2 - 4) * (7 + 8) },
  ];
  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>{step + 1}/7</span>
        <button onClick={() => setStep(Math.min(6, step + 1))} disabled={step >= 6}>▶</button>
        <button onClick={() => setStep(0)}>🔄 Reset</button>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <div>A = <code>[[1,2],[3,4]]</code></div>
        <div>B = <code>[[5,6],[7,8]]</code></div>
      </div>
      {M.map((m, i) => (
        <div key={i} style={{
          background: i === step ? 'rgba(94,234,212,0.15)' : 'var(--bg-1)',
          border: i === step ? '1px solid var(--accent-2)' : '1px solid transparent',
          padding: 10, borderRadius: 6, marginBottom: 6, opacity: i <= step ? 1 : 0.4
        }}>
          <span style={{ color: 'var(--accent-2)', fontWeight: 600, fontFamily: 'monospace' }}>{m.name}</span>
          <span style={{ marginLeft: 12, fontFamily: 'monospace', fontSize: 13 }}>= {m.formula}</span>
          {i <= step && <span style={{ marginLeft: 12, color: '#10b981', fontFamily: 'monospace' }}>= {m.val}</span>}
        </div>
      ))}
      {step === 6 && (
        <div className="callout success" style={{ marginTop: 12 }}>
          <div className="ttl">เสร็จ! รวมเป็น C:</div>
          <pre style={{ margin: 0 }}>{`C11 = M1+M4-M5+M7 = ${M[0].val + M[3].val - M[4].val + M[6].val}
C12 = M3+M5         = ${M[2].val + M[4].val}
C21 = M2+M4         = ${M[1].val + M[3].val}
C22 = M1-M2+M3+M6 = ${M[0].val - M[1].val + M[2].val + M[5].val}`}</pre>
          <div style={{ marginTop: 8 }}>ใช้แค่ <b>7 multiplication</b> (ปกติใช้ 8) → O(n^2.807)</div>
        </div>
      )}
    </div>
  );
}

function FloydViz() {
  const INF = 999;
  const init = [
    [0, 3, INF, 7],
    [8, 0, 2, INF],
    [5, INF, 0, 1],
    [2, INF, INF, 0]
  ];
  const [k, setK] = useS5(-1);
  const matrix = useM5(() => {
    const D = init.map(r => [...r]);
    const n = 4;
    for (let kk = 0; kk <= k; kk++) {
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          if (D[i][kk] + D[kk][j] < D[i][j]) D[i][j] = D[i][kk] + D[kk][j];
    }
    return D;
  }, [k]);
  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setK(-1)}>🔄 Reset</button>
        <button onClick={() => setK(Math.min(3, k + 1))} disabled={k >= 3}>⏭ Step k = {k + 1}</button>
        <span style={{ color: 'var(--text-2)' }}>k = {k < 0 ? 'initial' : k}</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl" style={{ fontFamily: 'monospace' }}>
          <thead><tr><th></th>{[0, 1, 2, 3].map(j => <th key={j}>{j}</th>)}</tr></thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <th>{i}</th>
                {row.map((v, j) => <td key={j} style={{ color: v === INF ? 'var(--text-3)' : 'var(--accent-2)' }}>{v === INF ? '∞' : v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ color: 'var(--text-1)', marginTop: 8, fontSize: 13 }}>
        แต่ละ k iteration: <code>D[i][j] = min(D[i][j], D[i][k] + D[k][j])</code>
      </div>
    </div>
  );
}

Lessons5["advanced-viz"] = function () {
  const [tab, setTab] = useS5('karatsuba');
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔬 Advanced Visualizers</div>
        4 algorithms ที่ดูยากสุด: Karatsuba · Strassen M1-M7 · Floyd-Warshall · Quick Select 3-way
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'karatsuba', label: '1. Karatsuba' },
          { id: 'strassen', label: '2. Strassen M1-M7' },
          { id: 'floyd', label: '3. Floyd-Warshall' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? 'var(--bg-2)' : 'transparent',
              color: tab === t.id ? 'var(--accent-2)' : 'var(--text-2)',
              border: 'none', borderBottom: tab === t.id ? '2px solid var(--accent-2)' : '2px solid transparent',
              padding: '10px 16px', cursor: 'pointer', fontSize: 13
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'karatsuba' && <React.Fragment>
        <h3>Karatsuba — คูณเลขใหญ่</h3>
        <pre className="code">{`function karatsuba(x, y):
  if x < 10 or y < 10: return x * y
  m = max(len(x), len(y)) / 2
  a, b = x / 10^m, x mod 10^m
  c, d = y / 10^m, y mod 10^m
  z2 = karatsuba(a, c)
  z0 = karatsuba(b, d)
  z1 = karatsuba(a+b, c+d) - z2 - z0
  return z2·10^(2m) + z1·10^m + z0`}</pre>
        <KaratsubaViz />
      </React.Fragment>}

      {tab === 'strassen' && <React.Fragment>
        <h3>Strassen — M1 ถึง M7 ทีละสูตร</h3>
        <StrassenViz />
      </React.Fragment>}

      {tab === 'floyd' && <React.Fragment>
        <h3>Floyd-Warshall — All-pairs Shortest Path</h3>
        <pre className="code">{`for k = 0..n-1:
  for i = 0..n-1:
    for j = 0..n-1:
      D[i][j] = min(D[i][j], D[i][k] + D[k][j])`}</pre>
        <FloydViz />
        <div className="callout">Complexity: O(V³) — เหมาะ dense graph</div>
      </React.Fragment>}
    </React.Fragment>
  );
};

/* ============================================================
   40 — MOCK EXAM
============================================================ */
const MIDTERM = [
  {
    q: "1. หา Big-O: <code>for (i=1; i<n; i*=3) sum++;</code>",
    pts: 5,
    a: "O(log n)",
    explain: "i = 1, 3, 9, 27, ... → log₃(n) รอบ → O(log n)"
  },
  {
    q: "2. หา Big-O: ลูปซ้อน <code>for(i=0;i<n;i++) for(j=i;j<n;j*=2) sum++;</code>",
    pts: 7,
    a: "O(n log n)",
    explain: "j เริ่มที่ i, *= 2 → log(n/i) รอบ; รวม Σ log(n/i) ≤ n log n"
  },
  {
    q: "3. แก้ recurrence: T(n) = 2T(n−1) + n, T(1) = 1",
    pts: 8,
    a: "O(2ⁿ)",
    explain: "T(n) = 2T(n-1)+n = 4T(n-2)+2(n-1)+n = ... = 2ⁿ·T(0) + Σ2^i(n-i) → O(2ⁿ)"
  },
  {
    q: "4. Master Theorem: T(n) = 4T(n/2) + n³",
    pts: 5,
    a: "O(n³)",
    explain: "a=4, b=2, d=3; log₂4 = 2; d=3 > 2 → Case 3 → O(n^d) = O(n³)"
  },
  {
    q: "5. Master Theorem: T(n) = 9T(n/3) + n²",
    pts: 5,
    a: "O(n² log n)",
    explain: "a=9, b=3, d=2; log₃9 = 2 = d → Case 2 → O(n² log n)"
  },
  {
    q: "6. ทำ Bubble Sort 1 รอบกับ [5, 1, 4, 2, 8] ได้อะไร?",
    pts: 5,
    a: "[1, 4, 2, 5, 8]",
    explain: "เปรียบเทียบทีละคู่: (5,1)→swap, (5,4)→swap, (5,2)→swap, (5,8)→keep"
  },
  {
    q: "7. Binary Search หา 22 ใน [10,12,13,16,18,19,20,22,23,24] ใช้กี่รอบ?",
    pts: 5,
    a: "3 รอบ",
    explain: "mid=4(18) → 18<22 → ขวา; mid=7(22) → พบ! ใช้ 2 รอบ (หรือ 3 รวม comparison)"
  },
  {
    q: "8. Quick Sort partition [6,2,8,1,5] โดย pivot=ตัวสุดท้าย ได้อะไร?",
    pts: 8,
    a: "[2, 1, 5, 6, 8]",
    explain: "pivot=5: 6≥5,2<5,8≥5,1<5 → pre-pivot [2,1] post-pivot [6,8]"
  },
  {
    q: "9. Merge sort [4,2,3,1] เขียน recursion tree",
    pts: 12,
    a: "[4,2,3,1] → [4,2]+[3,1] → [4]+[2]+[3]+[1] → merge: [2,4]+[1,3] → [1,2,3,4]",
    explain: ""
  },
  {
    q: "10. Quick Select k=3 ใน [7, 2, 5, 1, 9] pivot=ตัวแรก",
    pts: 10,
    a: "5",
    explain: "pivot=7: L=[2,5,1], E=[7], G=[9]. k=3 ≤ |L|=3 → recurse L; pivot=2: L=[1], E=[2], G=[5]. k=3 > |L|+|E|=2 → recurse G with k=1; pivot=5 → answer=5"
  },
  {
    q: "11. Strassen ใช้ multiplication กี่ครั้งสำหรับเมตริกซ์ย่อย?",
    pts: 5,
    a: "7",
    explain: "M1-M7 แทนที่ DAC ปกติที่ใช้ 8"
  },
  {
    q: "12. Master Theorem ของ Strassen?",
    pts: 5,
    a: "T(n) = 7T(n/2) + O(n²) → O(n^log₂7) ≈ O(n^2.807)",
    explain: "log₂7 ≈ 2.807, d=2 < 2.807 → Case 1"
  },
  {
    q: "13. คำนวณ Fibonacci F(8) แบบ DP",
    pts: 5,
    a: "21",
    explain: "0,1,1,2,3,5,8,13,21"
  },
  {
    q: "14. Selection Sort กับ [29, 10, 14, 37, 13] รอบที่ 1",
    pts: 5,
    a: "[10, 29, 14, 37, 13]",
    explain: "หาตัวน้อยสุดใน array ทั้งหมด (10 ที่ index 1) → swap กับ index 0"
  },
  {
    q: "15. Insertion Sort [8, 3, 5, 1, 9] หลังประมวลผล element ที่ 3 (1)",
    pts: 10,
    a: "[1, 3, 5, 8, 9]",
    explain: "หลัง 1 ถูก insert: เลื่อน 8,5,3 ไปขวา ใส่ 1 ที่ตำแหน่ง 0; แล้ว 9 อยู่ที่ตำแหน่งเดิม"
  },
];

const FINAL = [
  {
    q: "1. Fractional Knapsack: W=50, items={(20,100),(30,120),(10,60)} (w,v) → max value?",
    pts: 10,
    a: "240",
    explain: "ratio: 60/10=6, 100/20=5, 120/30=4. ใส่ทั้งหมด: 10+20=30 (60+100=160) เหลือ W=20 ใส่ 20/30 ของ item 3 = 80 → รวม 240"
  },
  {
    q: "2. Activity Selection (s,f): {(1,4),(3,5),(0,6),(5,7),(8,9),(5,9)} ได้กี่ activity?",
    pts: 10,
    a: "4 — (1,4),(5,7),(8,9) หรือเรียงตาม finish: (1,4),(5,7),(8,9) = 3 จริง ๆ",
    explain: "เรียงตาม f: (1,4),(3,5),(0,6),(5,7),(5,9),(8,9). เลือก: (1,4) → next start≥4 → (5,7) → (8,9) = 3"
  },
  {
    q: "3. 0/1 Knapsack DP: W=5, w=[1,2,3], v=[6,10,12] → max?",
    pts: 12,
    a: "22",
    explain: "เลือก item 2(w=2,v=10) + item 3(w=3,v=12) = w=5, v=22"
  },
  {
    q: "4. Subset Sum {3,4,5,2,1} target=8 → กี่เซต?",
    pts: 8,
    a: "4 เซต: {3,4,1},{3,5},{4,2,1+1?},... จริง ๆ {3,4,1},{3,5},{2,4,1+?}...",
    explain: "{3,5}, {3,4,1}, {5,2,1}, {4,3,1} (ไม่ซ้ำ): จริง ๆ คือ {3,5}, {3,4,1}, {5,2,1} = 3 เซต"
  },
  {
    q: "5. N-Queens n=4 มีกี่ solution?",
    pts: 5,
    a: "2",
    explain: "(2,4,1,3) และ (3,1,4,2)"
  },
  {
    q: "6. Permutation ของ {A,B,C,D} มีกี่ตัว?",
    pts: 3,
    a: "24 (4!)",
    explain: "n! = 4! = 24"
  },
  {
    q: "7. Subset ของ {a,b,c,d,e} มีกี่เซต?",
    pts: 3,
    a: "32 (2⁵)",
    explain: "2^n = 2^5 = 32 (รวม empty set)"
  },
  {
    q: "8. BFS จาก 0 ใน adj list {0:[1,2],1:[3],2:[3,4],3:[5],4:[],5:[]}",
    pts: 8,
    a: "0,1,2,3,4,5",
    explain: "ระดับ 0: {0}; 1: {1,2}; 2: {3,4}; 3: {5}"
  },
  {
    q: "9. DFS จาก 0 ใน adj list เดียวกัน",
    pts: 8,
    a: "0,1,3,5,2,4",
    explain: "ลึกก่อน: 0→1→3→5; backtrack → 2→4"
  },
  {
    q: "10. Cycle Detection: กราฟ 0→1, 1→2, 2→3, 3→1 มีวงวนไหม?",
    pts: 8,
    a: "มี",
    explain: "1→2→3→1 เป็น cycle"
  },
  {
    q: "11. Topological Sort {0:[1,2],1:[3],2:[3],3:[]}",
    pts: 8,
    a: "0,1,2,3 หรือ 0,2,1,3",
    explain: "indeg: 0→0, 1→1, 2→1, 3→2; เริ่มจาก 0; ลด indeg ของ 1,2 → push ทั้งสอง"
  },
  {
    q: "12. Dijkstra จาก A: A→B(4), A→C(1), C→B(2), B→D(1) → ระยะ A→D?",
    pts: 10,
    a: "4 (A→C→B→D = 1+2+1)",
    explain: "A→C=1, A→B via C = 3, A→D via B = 4 (เทียบ A→B→D = 5)"
  },
  {
    q: "13. ตัด greedy choice — Coin {1,5,10,25} จ่าย 30 ใช้กี่เหรียญน้อยสุด?",
    pts: 5,
    a: "2 (25+5)",
    explain: "Greedy เลือกเหรียญใหญ่ก่อน — ใช้กับ canonical coin system ได้"
  },
  {
    q: "14. Greedy ใช้ไม่ได้: Coin {1,3,4} จ่าย 6 — Greedy ได้กี่เหรียญ vs DP?",
    pts: 7,
    a: "Greedy 3 (4+1+1), DP 2 (3+3)",
    explain: "เคสที่ Greedy ผิด — ต้องใช้ DP ถึงได้คำตอบ optimum"
  },
  {
    q: "15. Recurrence ของ Tower of Hanoi T(n)?",
    pts: 5,
    a: "T(n) = 2T(n-1) + 1 → O(2ⁿ)",
    explain: "ย้าย n-1 ไป peg กลาง, ย้าย n ไป peg ปลาย, ย้าย n-1 ไป peg ปลาย"
  },
];

Lessons5["mock-exam"] = function () {
  const [tab, setTab] = useS5('mid');
  const [showAns, setShowAns] = useS5({});
  const [seconds, setSeconds] = useS5(0);
  const [running, setRunning] = useS5(false);

  useE5(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const exam = tab === 'mid' ? MIDTERM : FINAL;
  const totalPts = exam.reduce((s, q) => s + q.pts, 0);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📝 Mock Exam — ข้อสอบจำลอง</div>
        ใช้กระดาษ + ปากกา ทำโดยไม่เปิดเฉลย หมดเวลาตรวจกับเฉลย → ดูข้อที่ผิด → ย้อนไปอ่านหัวข้อนั้น
      </div>

      <div style={{ display: 'flex', gap: 6, margin: '14px 0', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => { setTab('mid'); setShowAns({}); }}
          style={{
            background: tab === 'mid' ? 'var(--bg-2)' : 'transparent',
            color: tab === 'mid' ? 'var(--accent-2)' : 'var(--text-2)',
            border: 'none', borderBottom: tab === 'mid' ? '2px solid var(--accent-2)' : '2px solid transparent',
            padding: '10px 16px', cursor: 'pointer'
          }}>
          📝 Mock Midterm (90 นาที, {MIDTERM.reduce((s, q) => s + q.pts, 0)} คะแนน)
        </button>
        <button onClick={() => { setTab('final'); setShowAns({}); }}
          style={{
            background: tab === 'final' ? 'var(--bg-2)' : 'transparent',
            color: tab === 'final' ? 'var(--accent-2)' : 'var(--text-2)',
            border: 'none', borderBottom: tab === 'final' ? '2px solid var(--accent-2)' : '2px solid transparent',
            padding: '10px 16px', cursor: 'pointer'
          }}>
          📝 Mock Final (90 นาที, {FINAL.reduce((s, q) => s + q.pts, 0)} คะแนน)
        </button>
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 28, fontFamily: 'monospace', color: 'var(--accent-2)', fontWeight: 700 }}>⏱️ {fmt(seconds)}</div>
        <button onClick={() => setRunning(!running)}
          style={{ background: running ? 'var(--bg-3)' : 'var(--accent)', color: running ? 'var(--text-0)' : '#000', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={() => { setSeconds(0); setRunning(false); }}
          style={{ background: 'transparent', color: 'var(--text-2)', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
          🔄 Reset
        </button>
        <span style={{ color: 'var(--text-2)', fontSize: 13 }}>เป้าหมาย: 90 นาที / {totalPts} คะแนน</span>
      </div>

      {exam.map((q, i) => (
        <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: q.q }} />
            <span style={{ background: 'var(--bg-3)', padding: '2px 10px', borderRadius: 12, fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{q.pts} คะแนน</span>
          </div>
          {!showAns[i] ? (
            <button onClick={() => setShowAns({ ...showAns, [i]: true })}
              style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, marginTop: 6 }}>
              ดูเฉลย
            </button>
          ) : (
            <div style={{ marginTop: 8, padding: 10, background: 'var(--bg-1)', borderRadius: 6, borderLeft: '3px solid #10b981' }}>
              <div style={{ color: '#10b981', fontWeight: 600, fontFamily: 'monospace' }}>✓ {q.a}</div>
              {q.explain && <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>{q.explain}</div>}
            </div>
          )}
        </div>
      ))}

      <div className="callout success">
        <div className="ttl">เคล็ดเตรียมสอบ</div>
        <ol style={{ margin: 0 }}>
          <li>ทำข้อสอบโดย<b>จับเวลา</b>จริง — 90 นาที ห้ามเกิน</li>
          <li>เขียน<b>วิธีคิด</b>ทุกขั้นตอน (อาจารย์ให้คะแนน 60% เป็น process)</li>
          <li>ผิดข้อไหน → ย้อนไปอ่านหัวข้อนั้น แล้วลองทำใหม่</li>
          <li>ใช้ Master Theorem Calculator + Recurrence Solver เป็นตัวเช็ค</li>
        </ol>
      </div>
    </React.Fragment>
  );
};

window.LessonsPart5 = Lessons5;
