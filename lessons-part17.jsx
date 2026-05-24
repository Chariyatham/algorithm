/* Lessons Part 17 — Advanced DP: LIS, LCS, Edit Distance, Matrix Chain, Bitmask DP, Tree DP */

const { useState: useS17, useMemo: useM17 } = React;
const CodeViewToggle17 = window.CodeViewToggle;

/* Code arrays */
const MATRIX_CHAIN_FULL = [
  "// Matrix Chain Multiplication — interval DP O(n³)",             // 0
  "int matrixChain(vector<int>& p) {",                              // 1
  "  int n = p.size() - 1;             // n matrices",              // 2
  "  vector<vector<int>> m(n+1, vector<int>(n+1, 0));",             // 3
  "  for (int len = 2; len <= n; len++) {     // chain length",     // 4
  "    for (int i = 1; i + len - 1 <= n; i++) {",                   // 5
  "      int j = i + len - 1;",                                     // 6
  "      m[i][j] = INT_MAX;",                                       // 7
  "      for (int k = i; k < j; k++) {        // split point",      // 8
  "        int cost = m[i][k] + m[k+1][j]",                         // 9
  "                 + p[i-1] * p[k] * p[j];",                       // 10
  "        if (cost < m[i][j]) m[i][j] = cost;",                    // 11
  "      }",                                                        // 12
  "    }",                                                          // 13
  "  }",                                                            // 14
  "  return m[1][n];",                                              // 15
  "}",                                                              // 16
];
const BITMASK_TSP_FULL = [
  "// Bitmask DP TSP — O(n² · 2ⁿ)",                                  // 0
  "// dp[mask][i] = min cost visiting cities in 'mask', ending at i",// 1
  "int tsp(vector<vector<int>>& dist) {",                           // 2
  "  int n = dist.size();",                                         // 3
  "  vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX));",     // 4
  "  dp[1][0] = 0;             // start at city 0",                 // 5
  "",                                                               // 6
  "  for (int mask = 1; mask < (1 << n); mask++) {",                // 7
  "    if (!(mask & 1)) continue;     // must include city 0",      // 8
  "    for (int last = 0; last < n; last++) {",                     // 9
  "      if (!(mask & (1 << last))) continue;",                     // 10
  "      if (dp[mask][last] == INT_MAX) continue;",                 // 11
  "      // try going to city 'next'",                              // 12
  "      for (int next = 0; next < n; next++) {",                   // 13
  "        if (mask & (1 << next)) continue;",                      // 14
  "        int newMask = mask | (1 << next);",                      // 15
  "        int newCost = dp[mask][last] + dist[last][next];",       // 16
  "        if (newCost < dp[newMask][next])",                       // 17
  "          dp[newMask][next] = newCost;",                         // 18
  "      }",                                                        // 19
  "    }",                                                          // 20
  "  }",                                                            // 21
  "  // close cycle: return to city 0",                             // 22
  "  int ans = INT_MAX;",                                           // 23
  "  int full = (1 << n) - 1;",                                     // 24
  "  for (int i = 1; i < n; i++)",                                  // 25
  "    if (dp[full][i] != INT_MAX)",                                // 26
  "      ans = min(ans, dp[full][i] + dist[i][0]);",                // 27
  "  return ans;",                                                  // 28
  "}",                                                              // 29
];
const LIS_DP_FULL = [
  "// LIS O(n²) DP",                                                // 0
  "int lis(vector<int>& a) {",                                      // 1
  "  int n = a.size();",                                            // 2
  "  vector<int> dp(n, 1);",                                        // 3
  "  for (int i = 1; i < n; i++)",                                  // 4
  "    for (int j = 0; j < i; j++)",                                // 5
  "      if (a[j] < a[i] && dp[j] + 1 > dp[i])",                    // 6
  "        dp[i] = dp[j] + 1;",                                     // 7
  "  return *max_element(dp.begin(), dp.end());",                   // 8
  "}",                                                              // 9
];
const LIS_PATIENCE_SHORT = [
  "// O(n log n) — patience sort with std::lower_bound",            // 0
  "int lis(vector<int>& a) {",                                      // 1
  "  vector<int> tails;",                                           // 2
  "  for (int x : a) {",                                            // 3
  "    auto it = lower_bound(tails.begin(), tails.end(), x);",      // 4
  "    if (it == tails.end()) tails.push_back(x);",                 // 5
  "    else *it = x;",                                              // 6
  "  }",                                                            // 7
  "  return tails.size();",                                         // 8
  "}",                                                              // 9
];
const LCS_FULL = [
  "// LCS — Longest Common Subsequence, O(m·n) DP",                 // 0
  "int lcs(const string& s, const string& t) {",                    // 1
  "  int m = s.size(), n = t.size();",                              // 2
  "  vector<vector<int>> dp(m+1, vector<int>(n+1, 0));",            // 3
  "  for (int i = 1; i <= m; i++)",                                 // 4
  "    for (int j = 1; j <= n; j++)",                               // 5
  "      if (s[i-1] == t[j-1])",                                    // 6
  "        dp[i][j] = dp[i-1][j-1] + 1;",                           // 7
  "      else",                                                     // 8
  "        dp[i][j] = max(dp[i-1][j], dp[i][j-1]);",                // 9
  "  return dp[m][n];",                                             // 10
  "}",                                                              // 11
];
const EDIT_DIST_FULL = [
  "// Edit Distance (Levenshtein) — O(m·n) DP",                     // 0
  "int editDistance(const string& s, const string& t) {",           // 1
  "  int m = s.size(), n = t.size();",                              // 2
  "  vector<vector<int>> dp(m+1, vector<int>(n+1));",               // 3
  "  for (int i = 0; i <= m; i++) dp[i][0] = i;     // delete all", // 4
  "  for (int j = 0; j <= n; j++) dp[0][j] = j;     // insert all", // 5
  "  for (int i = 1; i <= m; i++)",                                 // 6
  "    for (int j = 1; j <= n; j++)",                               // 7
  "      if (s[i-1] == t[j-1])",                                    // 8
  "        dp[i][j] = dp[i-1][j-1];                  // match",     // 9
  "      else",                                                     // 10
  "        dp[i][j] = 1 + min({",                                   // 11
  "          dp[i-1][j],      // delete s[i-1]",                    // 12
  "          dp[i][j-1],      // insert t[j-1]",                    // 13
  "          dp[i-1][j-1]});  // replace",                          // 14
  "  return dp[m][n];",                                             // 15
  "}",                                                              // 16
];
const { Quiz: Quiz17 } = window.LessonComponents;
const { WorkedExample: WE17, CheatSheet: CS17, Pitfalls: PF17 } = window.LearningKit;

const Lessons17 = {};

/* ============================================================
   Shared Viz — Matrix Chain Interval DP
============================================================ */
function MatrixChainViz() {
  const [p, setP] = useS17([30, 35, 15, 5, 10, 20, 25]);
  const [step, setStep] = useS17(-1);

  const result = useM17(() => {
    const n = p.length - 1; // number of matrices
    const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    const trace = [];
    for (let len = 2; len <= n; len++) {
      for (let i = 1; i + len - 1 <= n; i++) {
        const j = i + len - 1;
        m[i][j] = Infinity;
        let bestK = -1;
        for (let k = i; k < j; k++) {
          const cost = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
          if (cost < m[i][j]) { m[i][j] = cost; bestK = k; }
        }
        trace.push({ i, j, val: m[i][j], k: bestK, len });
      }
    }
    return { m, n, trace, answer: m[1][n] };
  }, [p]);

  const upTo = step < 0 ? result.trace.length - 1 : step;
  const partial = Array.from({ length: result.n + 1 }, () => Array(result.n + 1).fill(null));
  for (let i = 1; i <= result.n; i++) partial[i][i] = 0;
  for (let k = 0; k <= upTo && k < result.trace.length; k++) {
    const t = result.trace[k];
    partial[t.i][t.j] = t.val;
  }
  const cur = step >= 0 && step < result.trace.length ? result.trace[step] : null;

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
        <button onClick={() => setStep(0)}>↺ Start</button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step <= 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(result.trace.length - 1, (s < 0 ? 0 : s) + 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>▶</button>
        <button onClick={() => setStep(-1)}>Show All</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{step < 0 ? 'Final' : `Step ${step + 1}/${result.trace.length}`}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>min cost = <b>{result.answer}</b></span>
      </div>

      <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-2)', fontFamily: 'monospace' }}>
        dimensions p = [{p.join(', ')}] → matrices A₁..A{result.n}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 12, fontFamily: 'monospace' }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--bg-3)', padding: '4px 8px' }}>m[i][j]</th>
              {Array.from({ length: result.n }, (_, j) => (
                <th key={j} style={{ background: 'var(--bg-3)', padding: '4px 8px', color: 'var(--text-2)', minWidth: 50 }}>j={j + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: result.n }, (_, i) => i + 1).map(i => (
              <tr key={i}>
                <th style={{ background: 'var(--bg-3)', padding: '4px 8px', color: 'var(--text-2)' }}>i={i}</th>
                {Array.from({ length: result.n }, (_, j) => j + 1).map(j => {
                  const v = partial[i][j];
                  const isCur = cur && cur.i === i && cur.j === j;
                  const isEmpty = j < i;
                  return (
                    <td key={j} style={{
                      padding: '4px 8px', textAlign: 'center',
                      background: isEmpty ? 'var(--bg-3)' : (isCur ? 'var(--accent)' : 'var(--bg-2)'),
                      color: isEmpty ? 'var(--text-3)' : (isCur ? '#000' : 'var(--text-0)'),
                      fontWeight: isCur ? 700 : 400,
                      border: '1px solid var(--bg-3)'
                    }}>
                      {isEmpty ? '·' : (v === null ? '·' : v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cur && (
        <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
          m[{cur.i}][{cur.j}] = <b>{cur.val}</b> · best split k = {cur.k} (length {cur.len})<br />
          = m[{cur.i}][{cur.k}] + m[{cur.k + 1}][{cur.j}] + p[{cur.i - 1}]·p[{cur.k}]·p[{cur.j}]
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <b>Interval DP</b> — fill by length (2, 3, ..., n). Each cell ลอง split ทุก k ใน [i, j-1]
      </div>
    </div>
  );
}

/* ============================================================
   Shared Viz — Bitmask DP (TSP states)
============================================================ */
function BitmaskTSPViz() {
  const N = 4;
  // distance matrix
  const dist = [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]];
  const [step, setStep] = useS17(0);

  // generate all reachable (mask, last) states in order of popcount
  // ตัด state (mask, last=0) ที่ popcount>1 ออก เพราะไม่มี predecessor ตามนิยาม
  // (TSP เริ่มที่ 0 → ถ้า last=0 และเยี่ยมหลายเมืองแล้ว = วนกลับ ไม่ใช่ subpath ปกติ)
  const states = useM17(() => {
    const all = [];
    for (let mask = 1; mask < (1 << N); mask++) {
      if (!(mask & 1)) continue; // must include city 0
      const popcount = mask.toString(2).split('').filter(x => x === '1').length;
      for (let last = 0; last < N; last++) {
        if (!(mask & (1 << last))) continue;
        // last=0 valid เฉพาะตอน mask = {0} (popcount=1) — เป็น base state
        if (last === 0 && popcount > 1) continue;
        all.push({ mask, last });
      }
    }
    // sort by popcount then mask
    all.sort((a, b) => {
      const pa = Number(a.mask.toString(2).split('').filter(x => x === '1').length);
      const pb = Number(b.mask.toString(2).split('').filter(x => x === '1').length);
      return pa - pb || a.mask - b.mask;
    });
    return all;
  }, []);

  // compute dp values up to step
  const dp = {};
  dp[(1 << 0) + ':0'] = 0;
  for (let k = 0; k <= Math.min(step, states.length - 1); k++) {
    const { mask, last } = states[k];
    const key = mask + ':' + last;
    if (key in dp) continue;
    let best = Infinity;
    const prevMask = mask ^ (1 << last);
    for (let p = 0; p < N; p++) {
      if (!(prevMask & (1 << p))) continue;
      const prev = dp[prevMask + ':' + p];
      if (prev !== undefined && prev + dist[p][last] < best) best = prev + dist[p][last];
    }
    if (best < Infinity) dp[key] = best;
  }

  // Final answer when complete
  const fullMask = (1 << N) - 1;
  let finalAns = Infinity;
  for (let i = 1; i < N; i++) {
    const v = dp[fullMask + ':' + i];
    if (v !== undefined && v + dist[i][0] < finalAns) finalAns = v + dist[i][0];
  }

  const fmt = (mask) => '{' + Array.from({ length: N }, (_, i) => mask & (1 << i) ? i : -1).filter(x => x >= 0).join(',') + '}';

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <button onClick={() => setStep(0)}>↺ Reset</button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(states.length - 1, s + 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>▶</button>
        <button onClick={() => setStep(states.length - 1)}>Fill All</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>State {step + 1}/{states.length}</span>
        {step === states.length - 1 && <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>TSP min = <b>{finalAns}</b></span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 4, padding: 8, background: 'var(--bg-1)', borderRadius: 6, maxHeight: 280, overflowY: 'auto' }}>
        {states.map((s, i) => {
          const key = s.mask + ':' + s.last;
          const v = dp[key];
          const isFilled = i <= step && v !== undefined;
          const isCur = i === step;
          return (
            <div key={i} style={{
              padding: '6px 8px',
              background: isCur ? 'var(--accent)' : (isFilled ? 'rgba(94,234,212,0.15)' : 'var(--bg-3)'),
              color: isCur ? '#000' : (isFilled ? 'var(--text-0)' : 'var(--text-3)'),
              border: '1px solid ' + (isCur ? 'var(--accent)' : 'var(--border)'),
              borderRadius: 4, fontFamily: 'monospace', fontSize: 10,
              fontWeight: isCur ? 700 : 400
            }}>
              <div>mask={fmt(s.mask)}</div>
              <div>last={s.last} →<b style={{ marginLeft: 4 }}>{isFilled ? v : '?'}</b></div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <code>dp[mask][last]</code> = min cost เริ่มที่ city 0 → เยี่ยม cities ใน mask → จบที่ city <code>last</code>. Total states = O(n · 2ⁿ)
      </div>
    </div>
  );
}

/* ============================================================
   DP Table Viz — generic 2D table
============================================================ */
function DPTable({ rows, cols, table, hi, rowLabels, colLabels }) {
  return (
    <div style={{ overflowX: 'auto', margin: '12px 0' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 13, fontFamily: 'monospace', minWidth: 'min-content' }}>
        <thead>
          <tr>
            <th style={{ background: 'var(--bg-3)', padding: '6px 10px', minWidth: 40 }}></th>
            {colLabels.map((c, j) => (
              <th key={j} style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)', minWidth: 40 }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              <th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>{rowLabels[i]}</th>
              {row.map((v, j) => (
                <td key={j} style={{
                  padding: '6px 10px',
                  textAlign: 'center',
                  background: hi && hi.r === i && hi.c === j ? 'var(--accent)' : 'var(--bg-2)',
                  color: hi && hi.r === i && hi.c === j ? '#000' : 'var(--text-0)',
                  fontWeight: hi && hi.r === i && hi.c === j ? 700 : 400,
                  border: '1px solid var(--bg-3)'
                }}>
                  {v === Infinity ? '∞' : v === -Infinity ? '-∞' : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
   76 — LIS — LONGEST INCREASING SUBSEQUENCE
============================================================ */
function LISViz() {
  const [seq, setSeq] = useS17([10, 9, 2, 5, 3, 7, 101, 18]);
  const [text, setText] = useS17("10,9,2,5,3,7,101,18");

  const result = useM17(() => {
    const n = seq.length;
    const dp = Array(n).fill(1);
    const prev = Array(n).fill(-1);
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (seq[j] < seq[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          prev[i] = j;
        }
      }
    }
    // reconstruct (track indices ที่อยู่ใน LIS เพื่อ highlight ตามตำแหน่ง ไม่ใช่ค่า)
    let maxI = 0;
    for (let i = 1; i < n; i++) if (dp[i] > dp[maxI]) maxI = i;
    const lis = [];
    const lisIdx = new Set();
    let cur = maxI;
    while (cur !== -1) { lis.unshift(seq[cur]); lisIdx.add(cur); cur = prev[cur]; }
    return { dp, lis, lisIdx, len: dp[maxI] };
  }, [seq]);

  const apply = () => {
    const arr = text.split(',').map(s => parseInt(s.trim())).filter(n => !Number.isNaN(n));
    if (arr.length >= 1) setSeq(arr);
  };

  return (
    <div className="dsv">
      <div className="ctrls">
        <input value={text} onChange={e => setText(e.target.value)} onBlur={apply}
          onKeyDown={e => e.key === 'Enter' && apply()}
          style={{ width: 300, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
        <button onClick={apply}>Apply</button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
        {seq.map((v, i) => {
          const inLIS = result.lisIdx.has(i);
          return (
            <div key={i} style={{
              padding: '8px 12px',
              background: inLIS ? 'var(--accent-2)' : 'var(--bg-3)',
              color: inLIS ? '#000' : 'var(--text-0)',
              borderRadius: 6, fontFamily: 'monospace', fontWeight: 600
            }}>
              {v}<sub style={{ fontSize: 10, opacity: 0.6 }}>dp={result.dp[i]}</sub>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 6 }}>
        <b style={{ color: 'var(--accent-2)' }}>LIS length = {result.len}</b>
        <div style={{ fontFamily: 'monospace', fontSize: 13, marginTop: 4 }}>One LIS: [{result.lis.join(', ')}]</div>
      </div>
    </div>
  );
}

Lessons17["lis"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📈 Longest Increasing Subsequence (LIS)</div>
        ให้ลำดับเลข — หา <b>subsequence</b> ที่เพิ่มขึ้นและยาวที่สุด (ไม่ต้องติดกัน)
      </div>

      <h3>ตัวอย่าง</h3>
      <LISViz />

      <h3>LIS — C++ Code</h3>
      <CodeViewToggle17
        code={LIS_DP_FULL}
        codeShort={LIS_PATIENCE_SHORT}
        helperName="std::lower_bound (O(n log n))"
      />

      <h3>วิธีที่ 1 — DP O(n²)</h3>
      <pre className="code-block">{`dp[i] = LIS length ที่ลงท้ายด้วย a[i]
dp[i] = 1 + max(dp[j] : j < i AND a[j] < a[i])
        (ถ้าไม่มี j ที่ใช้ได้ → dp[i] = 1)
ตอบ = max(dp[0..n-1])`}</pre>

      <WE17
        title="DP O(n²) — Trace [10, 9, 2, 5, 3, 7, 101, 18]"
        problem="หา LIS length"
        steps={[
          { title: "i=0 (a=10)", body: "dp[0] = 1 (single element)", why: "base" },
          { title: "i=1 (a=9)", body: "ไม่มี j ที่ a[j] &lt; 9 → dp[1] = 1", why: "10 &gt; 9" },
          { title: "i=2 (a=2)", body: "ไม่มี j ที่ a[j] &lt; 2 → dp[2] = 1", why: "" },
          { title: "i=3 (a=5)", body: "a[2]=2 &lt; 5 → dp[3] = dp[2]+1 = 2", why: "" },
          { title: "i=4 (a=3)", body: "a[2]=2 &lt; 3 → dp[4] = dp[2]+1 = 2", why: "" },
          { title: "i=5 (a=7)", body: "a[2,3,4]={2,5,3} ทุกตัว &lt; 7 → dp[5] = max(dp[2],dp[3],dp[4])+1 = 3", why: "" },
          { title: "i=6 (a=101)", body: "ทุกตัวก่อนหน้า &lt; 101 → dp[6] = max(dp[0..5])+1 = 4", why: "" },
          { title: "i=7 (a=18)", body: "a[0,2,3,4,5]={10,2,5,3,7} → dp[7] = dp[5]+1 = 4", why: "" },
        ]}
        answer="LIS length = max(dp) = 4 — One LIS: [2,3,7,18] ▢"
      />

      <h3>วิธีที่ 2 — Patience Sort O(n log n)</h3>
      <pre className="code-block">{`tails = []
for x in seq:
  i = lower_bound(tails, x)  // binary search
  if i == len(tails):
    tails.append(x)
  else:
    tails[i] = x
return len(tails)`}</pre>
      <p>
        <b>tails[i]</b> = smallest tail value ของ LIS ความยาว i+1 ที่พบจนถึงตอนนี้<br/>
        Binary search → O(log n) ต่อ element → <b>O(n log n)</b> total
      </p>

      <WE17
        title="O(n log n) Trace — [10, 9, 2, 5, 3, 7, 101, 18]"
        problem="ดู tails array เปลี่ยนไป"
        steps={[
          { title: "x=10", body: "tails = [10]", why: "เริ่ม" },
          { title: "x=9", body: "lower_bound(9) = 0 → replace → tails = [9]", why: "9 เล็กกว่า → ดีกว่า" },
          { title: "x=2", body: "lower_bound(2) = 0 → tails = [2]", why: "" },
          { title: "x=5", body: "lower_bound(5) = 1 (end) → append → tails = [2, 5]", why: "extend LIS" },
          { title: "x=3", body: "lower_bound(3) = 1 → tails = [2, 3]", why: "3 ดีกว่า 5 สำหรับ LIS ความยาว 2" },
          { title: "x=7", body: "append → tails = [2, 3, 7]", why: "" },
          { title: "x=101", body: "append → tails = [2, 3, 7, 101]", why: "" },
          { title: "x=18", body: "lower_bound(18) = 3 → tails = [2, 3, 7, 18]", why: "" },
        ]}
        answer="len(tails) = 4 = LIS length ▢ — แต่ tails ไม่ใช่ LIS จริง! ต้องเก็บ predecessor"
        takeaway="O(n log n) คือทาง win สำหรับ n &gt; 10⁴"
      />

      <h3>Variants</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Longest Non-decreasing:</b> ใช้ upper_bound แทน lower_bound</li>
        <li><b>Longest Decreasing:</b> reverse array แล้วทำ LIS</li>
        <li><b>LIS count:</b> นับจำนวน LIS — ใช้ DP เพิ่ม cnt[i]</li>
        <li><b>Box Stacking, Russian Doll Envelopes:</b> sort + LIS</li>
      </ul>

      <CS17 title="LIS Cheat Sheet" sections={[
        { label: "DP O(n²)", value: "dp[i] = max(dp[j])+1 over j&lt;i, a[j]&lt;a[i]<br/>+ prev[] สำหรับ reconstruction" },
        { label: "Patience O(n log n)", value: "tails[] + binary search<br/>tails[k] = smallest tail of length k+1" },
        { label: "Strictly vs Non-decreasing", value: "lower_bound vs upper_bound" },
        { label: "Application", value: "Box stacking, version control, bioinformatics" },
      ]} />

      <PF17 items={[
        { trap: "Subsequence vs Substring", fix: "<b>Subsequence</b> ไม่ต้องติดกัน, <b>Substring</b> ต้องติดกัน — LIS = subsequence" },
        { trap: "O(n log n) ให้ tails = LIS — ผิด", fix: "tails เป็นเครื่องมือคำนวณ length เท่านั้น ไม่ใช่ LIS จริง" },
        { trap: "Strict vs ≤ — ผิด", fix: "Strict ใช้ lower_bound, ≤ ใช้ upper_bound" },
      ]} />

      <Quiz17 q={{
        question: "ใน [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5] LIS length เป็น?",
        options: ["3", "4", "5", "6"],
        answer: 1,
        explain: "[1, 4, 5, 9] หรือ [1, 2, 5, 6] ยาว 4 — หรือ [1, 4, 5, 6] = 4 — ไม่มี subsequence เพิ่มยาว 5"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   77 — LCS — LONGEST COMMON SUBSEQUENCE
============================================================ */
function LCSViz() {
  const [s1, setS1] = useS17("ABCBDAB");
  const [s2, setS2] = useS17("BDCAB");
  const [step, setStep] = useS17(-1);

  const result = useM17(() => {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const trace = [];
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        trace.push({ i, j, val: dp[i][j], match: s1[i - 1] === s2[j - 1] });
      }
    }
    // reconstruct
    let i = m, j = n;
    const lcs = [];
    while (i > 0 && j > 0) {
      if (s1[i - 1] === s2[j - 1]) { lcs.unshift(s1[i - 1]); i--; j--; }
      else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
      else j--;
    }
    return { dp, lcs: lcs.join(''), len: dp[m][n], trace };
  }, [s1, s2]);

  const cur = step >= 0 && step < result.trace.length ? result.trace[step] : null;
  const rowLabels = ['∅', ...s1.split('')];
  const colLabels = ['∅', ...s2.split('')];

  return (
    <div className="dsv">
      <div className="ctrls">
        <input value={s1} onChange={e => { setS1(e.target.value.toUpperCase()); setStep(-1); }} placeholder="s1" style={{ width: 120, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
        <input value={s2} onChange={e => { setS2(e.target.value.toUpperCase()); setStep(-1); }} placeholder="s2" style={{ width: 120, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
        <button onClick={() => setStep(-1)}>Reset</button>
        <button onClick={() => setStep(s => Math.max(-1, s - 1))} disabled={step < 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(result.trace.length - 1, s + 1))} disabled={step >= result.trace.length - 1}>▶</button>
        <button onClick={() => setStep(result.trace.length - 1)}>End</button>
        <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>LCS = <b>{result.lcs || '∅'}</b> (len {result.len})</span>
      </div>
      <DPTable rowLabels={rowLabels} colLabels={colLabels} table={result.dp} hi={cur ? { r: cur.i, c: cur.j } : null} />
      {cur && (
        <div style={{ padding: 10, background: cur.match ? 'rgba(16,185,129,0.1)' : 'rgba(94,234,212,0.08)', borderLeft: '3px solid ' + (cur.match ? '#10b981' : 'var(--accent-2)'), borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}>
          dp[{cur.i}][{cur.j}] = {cur.val} — s1[{cur.i - 1}]='{s1[cur.i - 1]}', s2[{cur.j - 1}]='{s2[cur.j - 1]}' {cur.match ? '✓ MATCH' : '✗ no match → take max'}
        </div>
      )}
    </div>
  );
}

Lessons17["lcs"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📜 Longest Common Subsequence (LCS)</div>
        ให้ 2 strings — หา subsequence ที่ปรากฏใน <b>ทั้งสอง</b> string และยาวที่สุด<br/>
        <i>ใช้ใน: diff/git, DNA alignment, plagiarism detection</i>
      </div>

      <h3>Interactive Visualizer</h3>
      <LCSViz />

      <h3>LCS — C++ Code</h3>
      <CodeViewToggle17 code={LCS_FULL} />

      <h3>Recurrence</h3>
      <pre className="code-block">{`dp[i][j] = LCS ของ s1[0..i-1] และ s2[0..j-1]

dp[i][j] = | 0,                          if i=0 or j=0
           | dp[i-1][j-1] + 1,           if s1[i-1] == s2[j-1]
           | max(dp[i-1][j], dp[i][j-1]) otherwise

Answer = dp[m][n]
Time: O(mn), Space: O(mn) → optimize O(min(m,n))`}</pre>

      <WE17
        title="ทำไม recurrence นี้ถูก?"
        problem="พิสูจน์ correctness"
        steps={[
          { title: "Case 1: s1[i-1] == s2[j-1]", body: "ตัวสุดท้ายตรงกัน → ใส่เข้า LCS\n→ ที่เหลือคือ LCS ของ s1[0..i-2] กับ s2[0..j-2]\n→ dp[i][j] = dp[i-1][j-1] + 1", why: "Optimal substructure" },
          { title: "Case 2: ไม่ตรง", body: "ตัวสุดท้ายอย่างน้อย 1 ฝั่งไม่อยู่ใน LCS\n→ ตัด s1[i-1] (→ dp[i-1][j]) หรือ s2[j-1] (→ dp[i][j-1])\n→ เลือก max", why: "ลอง 2 ทาง เลือกที่ดีกว่า" },
          { title: "Optimal substructure", body: "LCS ของ prefix sub-problem ก็ต้อง optimal\n→ valid DP", why: "" },
        ]}
        answer="Recurrence ถูกต้อง — O(mn) time ▢"
      />

      <h3>Reconstruction</h3>
      <pre className="code-block">{`i = m, j = n
LCS = ""
while i > 0 and j > 0:
  if s1[i-1] == s2[j-1]:
    LCS = s1[i-1] + LCS
    i--; j--
  elif dp[i-1][j] >= dp[i][j-1]: i--
  else: j--
return LCS`}</pre>

      <h3>Space Optimization → O(min(m,n))</h3>
      <p>เก็บแค่ 2 rows (current + previous) — แต่<b>เสีย reconstruction</b> (ต้องเก็บ full table หรือใช้ Hirschberg's algorithm)</p>

      <h3>Applications</h3>
      <table className="cmp">
        <thead><tr><th>Application</th><th>Details</th></tr></thead>
        <tbody>
          <tr><td>git diff</td><td>หา line ที่เหมือนกัน → แสดง diff</td></tr>
          <tr><td>DNA alignment</td><td>วัดความใกล้เคียงของ DNA sequences</td></tr>
          <tr><td>Plagiarism detection</td><td>คล้ายกัน ≥ threshold</td></tr>
          <tr><td>Spell correction</td><td>คล้าย LCS แต่เพิ่ม insert/delete cost → Edit Distance</td></tr>
        </tbody>
      </table>

      <CS17 title="LCS Cheat Sheet" sections={[
        { label: "DP", value: "O(mn) time, O(mn) space<br/>Reconstruct: O(m+n)" },
        { label: "Space-Opt", value: "O(min(m,n)) — เก็บ 2 rows" },
        { label: "Variants", value: "Longest Common Substring (ต้องติดกัน)<br/>Shortest Common Supersequence<br/>Edit Distance" },
        { label: "Hirschberg", value: "O(mn) time + O(min(m,n)) space + reconstruction" },
      ]} />

      <PF17 items={[
        { trap: "Substring vs Subsequence", fix: "<b>Subsequence</b> = ลำดับใน string, ไม่ต้องติดกัน. <b>Substring</b> = ติดกัน" },
        { trap: "LCS อาจไม่ unique", fix: "อาจมีหลาย LCS ที่ยาวเท่ากัน — algorithm คืน 1 อันใด ๆ" },
        { trap: "Space-opt loses traceback", fix: "ใช้ Hirschberg แทน — divide & conquer ผสม DP" },
      ]} />

      <Quiz17 q={{
        question: "LCS ของ 'AGGTAB' และ 'GXTXAYB' เป็นเท่าใด?",
        options: ["3", "4", "5", "6"],
        answer: 1,
        explain: "GTAB หรือ AGTB → ยาว 4"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   78 — EDIT DISTANCE (LEVENSHTEIN)
============================================================ */
Lessons17["edit-distance"] = function () {
  const [s1, setS1] = useS17("kitten");
  const [s2, setS2] = useS17("sitting");
  const [step, setStep] = useS17(-1);

  const result = useM17(() => {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const trace = [];
    for (let i = 0; i <= m; i++) { dp[i][0] = i; trace.push({ i, j: 0, val: i, op: 'base-row' }); }
    for (let j = 1; j <= n; j++) { dp[0][j] = j; trace.push({ i: 0, j, val: j, op: 'base-col' }); }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          trace.push({ i, j, val: dp[i][j], op: 'match', from: [[i - 1, j - 1]] });
        } else {
          const del = dp[i - 1][j], ins = dp[i][j - 1], rep = dp[i - 1][j - 1];
          const min = Math.min(del, ins, rep);
          dp[i][j] = 1 + min;
          let opType = 'replace';
          if (rep === min) opType = 'replace';
          else if (del === min) opType = 'delete';
          else opType = 'insert';
          trace.push({ i, j, val: dp[i][j], op: opType, from: [[i - 1, j], [i, j - 1], [i - 1, j - 1]] });
        }
      }
    }
    return { dp, dist: dp[m][n], trace };
  }, [s1, s2]);

  // Build partial DP table up to current step
  const m = s1.length, n = s2.length;
  const partialDP = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
  const upTo = step < 0 ? result.trace.length - 1 : step;
  for (let k = 0; k <= upTo && k < result.trace.length; k++) {
    const { i, j, val } = result.trace[k];
    partialDP[i][j] = val;
  }
  const cur = step >= 0 && step < result.trace.length ? result.trace[step] : null;
  const fromSet = new Set((cur && cur.from || []).map(([a, b]) => a + ',' + b));

  const rowLabels = ['∅', ...s1.split('')];
  const colLabels = ['∅', ...s2.split('')];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📝 Edit Distance (Levenshtein)</div>
        จำนวน operation น้อยสุดที่เปลี่ยน s1 → s2 — operations: <b>Insert, Delete, Replace</b><br/>
        <i>ใช้: spell check, DNA mutation distance, autocorrect</i>
      </div>

      <div className="dsv">
        <div className="ctrls" style={{ flexWrap: 'wrap' }}>
          <input value={s1} onChange={e => { setS1(e.target.value); setStep(-1); }} placeholder="s1" style={{ width: 120, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
          <input value={s2} onChange={e => { setS2(e.target.value); setStep(-1); }} placeholder="s2" style={{ width: 120, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
          <button onClick={() => setStep(0)}>↺ Start</button>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step <= 0}>◀</button>
          <button onClick={() => setStep(s => Math.min(result.trace.length - 1, (s < 0 ? 0 : s) + 1))}>▶</button>
          <button onClick={() => setStep(-1)} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>Show All</button>
          <span style={{ color: 'var(--text-2)', fontSize: 12 }}>
            {step < 0 ? 'Final' : `Step ${step + 1}/${result.trace.length}`}
          </span>
          <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>Edit Distance = <b>{result.dist}</b></span>
        </div>

        {/* Custom DP table with step highlighting */}
        <div style={{ overflowX: 'auto', margin: '12px 0' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, fontFamily: 'monospace' }}>
            <thead>
              <tr>
                <th style={{ background: 'var(--bg-3)', padding: '6px 10px', minWidth: 40 }}></th>
                {colLabels.map((c, j) => (
                  <th key={j} style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)', minWidth: 40 }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partialDP.map((row, i) => (
                <tr key={i}>
                  <th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>{rowLabels[i]}</th>
                  {row.map((v, j) => {
                    const isCur = cur && cur.i === i && cur.j === j;
                    const isFrom = fromSet.has(i + ',' + j);
                    return (
                      <td key={j} style={{
                        padding: '6px 10px',
                        textAlign: 'center',
                        background: isCur ? 'var(--accent)' : (isFrom ? 'rgba(251,191,36,0.3)' : 'var(--bg-2)'),
                        color: isCur ? '#000' : 'var(--text-0)',
                        fontWeight: isCur ? 700 : 400,
                        border: '1px solid var(--bg-3)'
                      }}>
                        {v === null ? '·' : v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cur && cur.op !== 'base-row' && cur.op !== 'base-col' && (
          <div style={{ padding: 10, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 6, fontSize: 13, fontFamily: 'monospace' }}>
            dp[{cur.i}][{cur.j}] = <b>{cur.val}</b> — s1[{cur.i - 1}]='{s1[cur.i - 1]}', s2[{cur.j - 1}]='{s2[cur.j - 1]}'
            {cur.op === 'match' && <span style={{ color: '#10b981' }}> ✓ MATCH → คัดมาจาก diag</span>}
            {cur.op === 'replace' && <span style={{ color: '#fbbf24' }}> ✗ REPLACE (cost 1 + diag)</span>}
            {cur.op === 'delete' && <span style={{ color: '#f87171' }}> ⤴ DELETE (cost 1 + top)</span>}
            {cur.op === 'insert' && <span style={{ color: '#f87171' }}> ⤵ INSERT (cost 1 + left)</span>}
          </div>
        )}
      </div>

      <h3>Recurrence</h3>
      <pre className="code-block">{`dp[i][j] = edit distance ของ s1[0..i-1] และ s2[0..j-1]

Base: dp[0][j] = j (insert j chars)
      dp[i][0] = i (delete i chars)

if s1[i-1] == s2[j-1]:
  dp[i][j] = dp[i-1][j-1]            // no op
else:
  dp[i][j] = 1 + min(
    dp[i-1][j],      // delete s1[i-1]
    dp[i][j-1],      // insert s2[j-1]
    dp[i-1][j-1]     // replace s1[i-1] → s2[j-1]
  )`}</pre>

      <h3>Edit Distance — C++ Code</h3>
      <CodeViewToggle17 code={EDIT_DIST_FULL} />

      <WE17
        title="Trace: kitten → sitting (3 ops)"
        problem="หา edit distance + operations"
        steps={[
          { title: "Step 1", body: "kitten → sitten (replace k → s)", why: "ตัวที่ 1 ต่างกัน" },
          { title: "Step 2", body: "sitten → sittin (replace e → i)", why: "ตัวที่ 5 ต่างกัน" },
          { title: "Step 3", body: "sittin → sitting (insert g ที่ท้าย)", why: "s2 ยาวกว่า 1 ตัว" },
        ]}
        answer="Edit distance = 3 ▢"
      />

      <h3>Variants</h3>
      <table className="cmp">
        <thead><tr><th>Variant</th><th>เปลี่ยน Recurrence</th></tr></thead>
        <tbody>
          <tr><td>LCS</td><td>เฉพาะ insert/delete (no replace) — max แทน min</td></tr>
          <tr><td>Damerau-Levenshtein</td><td>เพิ่ม transpose (สลับตัวติดกัน)</td></tr>
          <tr><td>Weighted Edit Distance</td><td>cost ต่างกัน เช่น insert=1, delete=2, replace=3</td></tr>
          <tr><td>Hamming Distance</td><td>ต้องยาวเท่ากัน — เฉพาะ replace</td></tr>
        </tbody>
      </table>

      <CS17 title="Edit Distance Cheat Sheet" sections={[
        { label: "Time/Space", value: "O(mn) / O(mn)<br/>Space-opt: O(min(m,n))" },
        { label: "Operations", value: "Insert, Delete, Replace (each cost 1)" },
        { label: "Application", value: "Spell check, DNA, autocorrect, fuzzy search" },
        { label: "Lower bound", value: "|len(s1) − len(s2)|" },
      ]} />

      <Quiz17 q={{
        question: "Edit distance ของ 'horse' → 'ros' เป็น?",
        options: ["2", "3", "4", "5"],
        answer: 1,
        explain: "horse → rorse (replace h→r) → rose (delete r ตัวที่สอง) → ros (delete e) = 3 ops"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   79 — MATRIX CHAIN MULTIPLICATION
============================================================ */
Lessons17["matrix-chain"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📐 Matrix Chain Multiplication</div>
        Multiply A₁ · A₂ · ... · Aₙ — order สำคัญ! (associative แต่ไม่ commutative)<br/>
        เลือก parenthesization ที่ใช้ scalar multiplications <b>น้อยสุด</b>
      </div>

      <h3>ทำไม Order สำคัญ?</h3>
      <p>Multiplying A (p×q) × B (q×r) ใช้ p·q·r scalar multiplications</p>
      <pre className="code-block">{`A₁ (10×30) · A₂ (30×5) · A₃ (5×60)

วิธีที่ 1: (A₁A₂)A₃
  A₁A₂ = 10·30·5 = 1500
  result × A₃ = 10·5·60 = 3000
  Total = 4500

วิธีที่ 2: A₁(A₂A₃)
  A₂A₃ = 30·5·60 = 9000
  A₁ × result = 10·30·60 = 18000
  Total = 27000  // แพงกว่า 6 เท่า!`}</pre>

      <h3>🎬 Interactive — เดิน interval DP ทีละ length</h3>
      <MatrixChainViz />

      <h3>Matrix Chain — C++ Code</h3>
      <CodeViewToggle17 code={MATRIX_CHAIN_FULL} />

      <h3>Interval DP — Recurrence</h3>
      <pre className="code-block">{`dimensions: p[0], p[1], ..., p[n]   (matrix i = p[i-1] × p[i])

m[i][j] = min cost ของการคูณ A_i ... A_j

m[i][i] = 0                                   // single matrix
m[i][j] = min over k in [i, j-1]:
            m[i][k] + m[k+1][j] + p[i-1]·p[k]·p[j]

Answer = m[1][n]
Time: O(n³), Space: O(n²)`}</pre>

      <WE17
        title="Trace: dimensions = [30, 35, 15, 5, 10, 20, 25]"
        problem="หา min cost ของ A₁·A₂·...·A₆"
        steps={[
          { title: "Setup", body: "A₁: 30×35, A₂: 35×15, A₃: 15×5, A₄: 5×10, A₅: 10×20, A₆: 20×25", why: "p[] กำหนด dimensions" },
          { title: "Length 2", body: "m[1][2] = 30·35·15 = 15750\nm[2][3] = 35·15·5 = 2625\nm[3][4] = 15·5·10 = 750\nm[4][5] = 5·10·20 = 1000\nm[5][6] = 10·20·25 = 5000", why: "คำนวณ pairs" },
          { title: "Length 3", body: "m[1][3] = min(m[1][1]+m[2][3]+30·35·5, m[1][2]+m[3][3]+30·15·5)\n       = min(0+2625+5250, 15750+0+2250) = 7875\nm[2][4] = min over k: 4375\nm[3][5] = 2500\nm[4][6] = 3500", why: "ลอง split ทุก k" },
          { title: "Continue length 4, 5, 6", body: "(ละไว้ — full table O(n²) entries)\nm[1][6] = <b>15125</b>", why: "Final answer" },
        ]}
        answer="Min cost = 15125 — parenthesization: ((A₁(A₂A₃))((A₄A₅)A₆))"
      />

      <h3>Implementation</h3>
      <pre className="code-block">{`function MatrixChain(p[0..n]):
  m = 2D array (n+1) x (n+1), init 0
  s = 2D array สำหรับ traceback

  for len = 2 to n:
    for i = 1 to n - len + 1:
      j = i + len - 1
      m[i][j] = ∞
      for k = i to j - 1:
        cost = m[i][k] + m[k+1][j] + p[i-1]·p[k]·p[j]
        if cost < m[i][j]:
          m[i][j] = cost
          s[i][j] = k
  return m[1][n], s

function printOptimalParens(s, i, j):
  if i == j: print "A_" + i
  else:
    print "("
    printOptimalParens(s, i, s[i][j])
    printOptimalParens(s, s[i][j]+1, j)
    print ")"`}</pre>

      <h3>Other Interval DP Problems</h3>
      <table className="cmp">
        <thead><tr><th>Problem</th><th>Recurrence</th></tr></thead>
        <tbody>
          <tr><td>Optimal BST</td><td>m[i][j] = min over root k</td></tr>
          <tr><td>Burst Balloons</td><td>m[i][j] = max coins, last balloon = k</td></tr>
          <tr><td>Palindrome Partitioning</td><td>min cuts to make all palindromes</td></tr>
          <tr><td>Egg Dropping (variant)</td><td>min trials to find threshold</td></tr>
        </tbody>
      </table>

      <CS17 title="Interval DP Pattern" sections={[
        { label: "Recurrence", body: "dp[i][j] = best of split at k for k in [i, j-1]", value: "dp[i][j] = best of (dp[i][k] + dp[k+1][j] + cost)" },
        { label: "Order", value: "Fill by <b>length</b> (small intervals first)" },
        { label: "Time", value: "O(n³) — n² intervals × n splits" },
      ]} />

      <Quiz17 q={{
        question: "Time complexity ของ Matrix Chain Multiplication DP?",
        options: ["O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)"],
        answer: 1,
        explain: "n² intervals × n splits each = O(n³). Naive brute force = O(2ⁿ)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   80 — BITMASK DP
============================================================ */
Lessons17["bitmask-dp"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎭 Bitmask DP</div>
        ใช้ <b>bit ของ integer</b> แทน subset — แต่ละ bit = element อยู่ใน subset หรือไม่<br/>
        <i>ใช้: TSP, Assignment problem, Subset enumeration</i>
      </div>

      <h3>Bit Tricks Recap</h3>
      <pre className="code-block">{`mask & (1 &lt;&lt; i)      // ตรวจว่า bit i อยู่ใน mask ไหม
mask | (1 &lt;&lt; i)      // เพิ่ม bit i
mask & ~(1 &lt;&lt; i)     // ลบ bit i
mask ^ (1 &lt;&lt; i)      // toggle bit i
__builtin_popcount(m) // count set bits (C++)
mask & (mask - 1)    // ลบ rightmost bit ที่ตั้ง`}</pre>

      <h3>TSP — Held-Karp Algorithm O(n² · 2ⁿ)</h3>
      <p>
        Naive TSP: ลองทุก permutation = O(n!) — n=15 → 10¹²<br/>
        Held-Karp: O(n² · 2ⁿ) — n=20 → ~4×10⁸ (เร็วกว่าเยอะ)
      </p>

      <pre className="code-block">{`dp[mask][i] = min cost visiting cities in 'mask', ending at city i
  (mask รวม city i ด้วย)

Base: dp[{0}][0] = 0  (start at city 0)

Transition: dp[mask | (1&lt;&lt;j)][j] = min(dp[mask][i] + dist[i][j])
  for all i in mask, j not in mask

Answer: min over i: dp[full_mask][i] + dist[i][0]   (return to start)`}</pre>

      <h3>🎬 Interactive — TSP states (4 cities) เห็น dp[mask][last] เติมทีละช่อง</h3>
      <BitmaskTSPViz />

      <h3>Bitmask TSP — C++ Code</h3>
      <CodeViewToggle17 code={BITMASK_TSP_FULL} />

      <WE17
        title="TSP for 4 cities — illustrate state"
        problem="dist matrix:\n[[0, 10, 15, 20],\n [10, 0, 35, 25],\n [15, 35, 0, 30],\n [20, 25, 30, 0]]"
        steps={[
          { title: "States", body: "mask ใช้ 4 bits → 2⁴ = 16 masks\nแต่ละ mask × 4 endings = 64 states", why: "" },
          { title: "Start", body: "dp[0001][0] = 0", why: "เริ่มที่ city 0" },
          { title: "Expand", body: "From dp[0001][0]: go to 1, 2, 3\ndp[0011][1] = 10\ndp[0101][2] = 15\ndp[1001][3] = 20", why: "" },
          { title: "Continue all combinations", body: "... fill 64 states total\nFinal answer: min(dp[1111][i] + dist[i][0]) for i=1,2,3", why: "" },
          { title: "TSP solution", body: "Optimal cycle: 0 → 1 → 3 → 2 → 0\nCost: 10 + 25 + 30 + 15 = <b>80</b>", why: "ตามที่ Held-Karp คำนวณ" },
        ]}
        answer="Min TSP cost = 80 — O(n² · 2ⁿ) ▢"
      />

      <h3>Subset Enumeration Patterns</h3>
      <pre className="code-block">{`// Enumerate ALL subsets of {0, ..., n-1}
for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++) {
  // process mask
}

// Enumerate subsets OF a given mask
for (int sub = mask; sub &gt; 0; sub = (sub - 1) &amp; mask) {
  // process sub (sub is a subset of mask)
}

// Iterate set bits in mask
for (int b = mask; b; b &amp;= b - 1) {
  int bit = __builtin_ctz(b);  // lowest set bit index
  // process bit
}`}</pre>

      <h3>Assignment Problem (Hungarian via Bitmask)</h3>
      <p>
        n คน × n งาน → cost[i][j] = i ทำงาน j สิ้นเปลือง — หา assignment ที่ cost รวมต่ำสุด
      </p>
      <pre className="code-block">{`dp[mask] = min cost when first popcount(mask) people are assigned to tasks in mask

Base: dp[0] = 0
Transition:
  i = popcount(mask)  // person to assign next
  for each j not in mask:
    dp[mask | (1&lt;&lt;j)] = min(dp[mask | (1&lt;&lt;j)], dp[mask] + cost[i][j])

Answer: dp[full_mask]
Time: O(n · 2ⁿ)`}</pre>

      <h3>Other Bitmask DP Problems</h3>
      <table className="cmp">
        <thead><tr><th>Problem</th><th>State</th></tr></thead>
        <tbody>
          <tr><td>TSP (Held-Karp)</td><td>dp[mask][last] — visited set + current city</td></tr>
          <tr><td>Assignment</td><td>dp[mask] — used tasks</td></tr>
          <tr><td>Min cost Hamiltonian path</td><td>dp[mask][v] — same as TSP</td></tr>
          <tr><td>Subset Sum (small n)</td><td>iterate subsets</td></tr>
          <tr><td>Profile DP (grid filling)</td><td>dp[row][mask] — mask = current row state</td></tr>
        </tbody>
      </table>

      <CS17 title="Bitmask DP Cheat Sheet" sections={[
        { label: "When", value: "n ≤ ~20 (เพราะ 2ⁿ states)" },
        { label: "State", value: "Usually dp[mask] หรือ dp[mask][last]" },
        { label: "TSP", value: "O(n²·2ⁿ) ดีกว่า n!" },
        { label: "Pitfall", value: "n=25+ → ใช้ memory เยอะ (2²⁵ × 25 × 4B = 3.3GB)" },
      ]} />

      <PF17 items={[
        { trap: "n &gt; 20 → memory overflow", fix: "Bitmask DP มัก hard limit ที่ n ≈ 20" },
        { trap: "ใช้ int แทน long long สำหรับ mask", fix: "ถ้า n &gt; 30 → ใช้ long long (64-bit)" },
        { trap: "Iterate subsets ผิด", fix: "<code>for (int s = mask; s; s = (s-1) &amp; mask)</code> — รวม s = 0 ต้องวน after-loop" },
      ]} />

      <Quiz17 q={{
        question: "TSP Held-Karp ใช้ memory เท่าใดสำหรับ n cities?",
        options: ["O(n)", "O(n²)", "O(n · 2ⁿ)", "O(n!)"],
        answer: 2,
        explain: "dp[mask][last] — 2ⁿ masks × n last positions = O(n · 2ⁿ)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   81 — DP ON TREES
============================================================ */
Lessons17["tree-dp"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🌳 DP on Trees</div>
        คำนวณคำตอบของ subtree → รวมขึ้นสู่ root ด้วย DFS<br/>
        Pattern: post-order traversal + DP combine children
      </div>

      <h3>Pattern พื้นฐาน</h3>
      <pre className="code-block">{`function solve(u, parent):
  dp[u] = base case for leaf
  for each child v of u (v != parent):
    solve(v, u)
    combine(dp[u], dp[v])
  return dp[u]

solve(root, -1)`}</pre>

      <h3>ตัวอย่าง 1: Subtree Sum</h3>
      <pre className="code-block">{`dp[u] = sum of values in subtree rooted at u

function dfs(u, parent):
  dp[u] = val[u]
  for v in adj[u]:
    if v != parent:
      dfs(v, u)
      dp[u] += dp[v]`}</pre>

      <h3>ตัวอย่าง 2: Tree Diameter</h3>
      <p>
        <b>Diameter</b> = longest path ระหว่าง 2 nodes ใน tree
      </p>
      <WE17
        title="Tree Diameter — DP on Tree"
        problem="หา longest path ใน tree"
        steps={[
          { title: "Observation", body: "ใน subtree ที่มี root u:\n  longest path ที่ผ่าน u = max1(depth of child) + max2(depth of another child) + 2\n  ถ้ามี 1 child → ใช้แค่ max1 + 1\n  ถ้า leaf → 0", why: "Path ผ่าน u = ลงไป 2 sides" },
          { title: "DP value", body: "depth[u] = 1 + max(depth[v]) for child v\n            (0 ถ้า leaf)\nans = max over all u: max1 + max2 + 2 (paths through u)", why: "Track 2 longest paths" },
          { title: "Algorithm", body: "DFS:\n  depth[u] = 0\n  longest_so_far = 0\n  second_longest = 0\n  for each child v:\n    DFS(v)\n    d = depth[v] + 1\n    if d > longest_so_far:\n      second_longest = longest_so_far\n      longest_so_far = d\n    elif d > second_longest:\n      second_longest = d\n  depth[u] = longest_so_far\n  ans = max(ans, longest_so_far + second_longest)", why: "" },
          { title: "Alternative — 2 BFS", body: "BFS from any node → ได้ farthest node u\nBFS from u → ได้ farthest node v\nDistance(u, v) = diameter\nO(V) — 2 traversals", why: "Trick สำหรับ tree" },
        ]}
        answer="Tree diameter ใน O(V) ▢"
      />

      <h3>ตัวอย่าง 3: Max Independent Set on Tree</h3>
      <p>
        เลือก subset ของ vertices ที่ไม่มี edge ระหว่างกัน — มากสุด<br/>
        (NP-Hard บน general graph, แต่ <b>polynomial บน tree</b>)
      </p>
      <pre className="code-block">{`dp[u][0] = max IS size of subtree(u), u NOT included
dp[u][1] = max IS size of subtree(u), u included

Recurrence:
  dp[u][0] = sum over children v: max(dp[v][0], dp[v][1])
  dp[u][1] = 1 + sum over children v: dp[v][0]
    (ถ้า u รวม → children ไม่รวมได้)

Answer: max(dp[root][0], dp[root][1])
Time: O(V)`}</pre>

      <WE17
        title="Trace MIS on small tree"
        problem={`Tree:
    1
   / \\
  2   3
 / \\
4   5`}
        steps={[
          { title: "Leaves: 4, 5, 3", body: "dp[4] = [0, 1]\ndp[5] = [0, 1]\ndp[3] = [0, 1]", why: "Leaf — include = 1, exclude = 0" },
          { title: "Node 2", body: "dp[2][0] = max(dp[4]) + max(dp[5]) = 1+1 = 2\ndp[2][1] = 1 + dp[4][0] + dp[5][0] = 1+0+0 = 1\ndp[2] = [2, 1]", why: "Exclude 2: เลือก 4, 5 ทั้งคู่" },
          { title: "Node 1 (root)", body: "dp[1][0] = max(dp[2]) + max(dp[3]) = 2+1 = 3\ndp[1][1] = 1 + dp[2][0] + dp[3][0] = 1+2+0 = 3\ndp[1] = [3, 3]", why: "" },
          { title: "Answer", body: "max(dp[1]) = 3 → IS = {4, 5, 3} หรือ {1, 4, 5}", why: "" },
        ]}
        answer="Max IS = 3 ▢"
      />

      <h3>ตัวอย่าง 4: Re-rooting Technique</h3>
      <p>
        คำนวณ <b>คำตอบสำหรับทุก root</b> ใน O(V) — ใช้ DP 2 ครั้ง:
      </p>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>DFS แรก: คำนวณ dp[u] สำหรับ subtree</li>
        <li>DFS สอง: คำนวณ ans[u] โดยใช้ dp[parent] + ‘ส่วนที่เหลือ’ ของ tree</li>
      </ol>
      <p>ตัวอย่าง: หา sum of distances from each node to all others — O(V)</p>

      <h3>Tree DP Problems คลาสสิก</h3>
      <table className="cmp">
        <thead><tr><th>Problem</th><th>DP State</th></tr></thead>
        <tbody>
          <tr><td>Subtree sum/count</td><td>dp[u] = aggregate of subtree</td></tr>
          <tr><td>Tree diameter</td><td>track top-2 child depths</td></tr>
          <tr><td>Max Independent Set</td><td>dp[u][0/1]</td></tr>
          <tr><td>Min Vertex Cover</td><td>dp[u][0/1]</td></tr>
          <tr><td>Tree coloring</td><td>dp[u][color]</td></tr>
          <tr><td>Path counting</td><td>dp[u][k] = paths of length k from u</td></tr>
          <tr><td>Centroid decomposition</td><td>recursive divide on centroids</td></tr>
        </tbody>
      </table>

      <CS17 title="Tree DP Cheat Sheet" sections={[
        { label: "Pattern", value: "Post-order DFS → combine children" },
        { label: "Common state", value: "dp[u][0/1] for include/exclude<br/>dp[u][k] for ‘take k from subtree’" },
        { label: "Re-rooting", value: "2-pass DFS for all-roots answers" },
        { label: "Tree DP เร็ว", value: "O(V) สำหรับปัญหา NP-hard บน general graph!" },
      ]} />

      <Quiz17 q={{
        question: "Max Independent Set บน general graph เป็น NP-hard. บน tree?",
        options: ["NP-hard เช่นกัน", "O(V) — DP on tree", "O(V²)", "O(2ⁿ)"],
        answer: 1,
        explain: "Tree DP แก้ได้ใน O(V) — เป็นตัวอย่างคลาสสิกของปัญหา NP-hard ที่ tractable บน special graph"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart17 = Lessons17;
