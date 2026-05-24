/* Lessons Part 16 — Network Flow: Max Flow, Ford-Fulkerson, Edmonds-Karp, Min Cut, Bipartite Matching */

const { useState: useS16, useMemo: useM16, useEffect: useE16 } = React;
const CodeViewToggle16 = window.CodeViewToggle;

/* ============================================================
   CODE: Ford-Fulkerson (Full + Short)
============================================================ */
const FORD_FULKERSON_FULL = [
  "#include <vector>",                                              // 0
  "#include <queue>",                                               // 1
  "#include <climits>",                                             // 2
  "using namespace std;",                                           // 3
  "",                                                               // 4
  "// adj[u] = list of (v, capIdx) where cap[capIdx] = residual",   // 5
  "vector<vector<pair<int,int>>> adj;",                             // 6
  "vector<int> cap;",                                               // 7
  "",                                                               // 8
  "// BFS-based: find augmenting path (also = Edmonds-Karp)",       // 9
  "int bfsFindPath(int s, int t, vector<int>& parent) {",           // 10
  "  parent.assign(adj.size(), -1);",                               // 11
  "  parent[s] = s;",                                               // 12
  "  queue<pair<int,int>> q;                  // (node, min cap)",  // 13
  "  q.push({s, INT_MAX});",                                        // 14
  "  while (!q.empty()) {",                                         // 15
  "    auto [u, flow] = q.front(); q.pop();",                       // 16
  "    for (auto& [v, idx] : adj[u]) {",                            // 17
  "      if (parent[v] == -1 && cap[idx] > 0) {",                   // 18
  "        parent[v] = u;",                                         // 19
  "        int newFlow = min(flow, cap[idx]);",                     // 20
  "        if (v == t) return newFlow;",                            // 21
  "        q.push({v, newFlow});",                                  // 22
  "      }",                                                        // 23
  "    }",                                                          // 24
  "  }",                                                            // 25
  "  return 0;        // no augmenting path",                       // 26
  "}",                                                              // 27
  "",                                                               // 28
  "int maxFlow(int s, int t) {",                                    // 29
  "  int flow = 0;",                                                // 30
  "  vector<int> parent;",                                          // 31
  "  while (int newFlow = bfsFindPath(s, t, parent)) {",            // 32
  "    flow += newFlow;",                                           // 33
  "    int cur = t;",                                               // 34
  "    while (cur != s) {                    // augment",           // 35
  "      int prev = parent[cur];",                                  // 36
  "      // increase forward, decrease backward",                   // 37
  "      cur = prev;",                                              // 38
  "    }",                                                          // 39
  "  }",                                                            // 40
  "  return flow;",                                                 // 41
  "}",                                                              // 42
];
const FORD_FULKERSON_SHORT = [
  "int maxFlow(int s, int t) {",                                    // 0
  "  int flow = 0;",                                                // 1
  "  vector<int> parent;",                                          // 2
  "  while (int b = bfsFindPath(s, t, parent)) { // ← helper",      // 3
  "    flow += b;                              // augment by bottleneck", // 4
  "    // update residual graph along path",                        // 5
  "  }",                                                            // 6
  "  return flow;",                                                 // 7
  "}",                                                              // 8
];

/* ============================================================
   CODE: Edmonds-Karp (Full + Short)
   = Ford-Fulkerson + BFS guarantee O(VE²)
============================================================ */
const EDMONDS_KARP_FULL = FORD_FULKERSON_FULL;  // identical — BFS-based is EK
const EDMONDS_KARP_SHORT = FORD_FULKERSON_SHORT;

/* ============================================================
   CODE: Bipartite Matching (Full + Short)
============================================================ */
const BIPARTITE_FULL = [
  "// L = left set, R = right set, adj[u] = neighbors of u in R",   // 0
  "vector<int> matchR;        // matchR[v] = u in L matched to v",   // 1
  "vector<bool> visited;",                                          // 2
  "",                                                               // 3
  "// Try to find augmenting path from u",                          // 4
  "bool tryAugment(int u, vector<vector<int>>& adj) {",             // 5
  "  for (int v : adj[u]) {",                                       // 6
  "    if (visited[v]) continue;",                                  // 7
  "    visited[v] = true;",                                         // 8
  "    if (matchR[v] == -1 || tryAugment(matchR[v], adj)) {",       // 9
  "      matchR[v] = u;",                                           // 10
  "      return true;",                                             // 11
  "    }",                                                          // 12
  "  }",                                                            // 13
  "  return false;",                                                // 14
  "}",                                                              // 15
  "",                                                               // 16
  "int bipartiteMatch(int L, int R, vector<vector<int>>& adj) {",   // 17
  "  matchR.assign(R, -1);",                                        // 18
  "  int matched = 0;",                                             // 19
  "  for (int u = 0; u < L; u++) {",                                // 20
  "    visited.assign(R, false);",                                  // 21
  "    if (tryAugment(u, adj)) matched++;",                         // 22
  "  }",                                                            // 23
  "  return matched;",                                              // 24
  "}",                                                              // 25
];
const BIPARTITE_SHORT = [
  "int bipartiteMatch(int L, int R, vector<vector<int>>& adj) {",   // 0
  "  matchR.assign(R, -1);",                                        // 1
  "  int matched = 0;",                                             // 2
  "  for (int u = 0; u < L; u++) {",                                // 3
  "    visited.assign(R, false);",                                  // 4
  "    if (tryAugment(u, adj)) matched++; // ← helper: DFS augment",// 5
  "  }",                                                            // 6
  "  return matched;          // |max matching|",                   // 7
  "}",                                                              // 8
];

/* ============================================================
   CODE: Hopcroft-Karp (Full + Short)
============================================================ */
const HOPCROFT_FULL = [
  "// Hopcroft-Karp = bipartite matching ใน O(E√V)",                 // 0
  "// แทนที่จะ augment ทีละ path → augment หลาย path พร้อมกัน",         // 1
  "vector<int> pairL, pairR, dist;",                                // 2
  "const int NIL = 0, INF = INT_MAX;",                              // 3
  "",                                                               // 4
  "bool bfs(int L, vector<vector<int>>& adj) {",                    // 5
  "  queue<int> q;",                                                // 6
  "  for (int u = 1; u <= L; u++) {",                               // 7
  "    if (pairL[u] == NIL) { dist[u] = 0; q.push(u); }",           // 8
  "    else dist[u] = INF;",                                        // 9
  "  }",                                                            // 10
  "  dist[NIL] = INF;",                                             // 11
  "  while (!q.empty()) {",                                         // 12
  "    int u = q.front(); q.pop();",                                // 13
  "    if (dist[u] < dist[NIL])",                                   // 14
  "      for (int v : adj[u])",                                     // 15
  "        if (dist[pairR[v]] == INF) {",                           // 16
  "          dist[pairR[v]] = dist[u] + 1;",                        // 17
  "          q.push(pairR[v]);",                                    // 18
  "        }",                                                      // 19
  "  }",                                                            // 20
  "  return dist[NIL] != INF;",                                     // 21
  "}",                                                              // 22
  "",                                                               // 23
  "bool dfs(int u, vector<vector<int>>& adj) {",                    // 24
  "  if (u == NIL) return true;",                                   // 25
  "  for (int v : adj[u])",                                         // 26
  "    if (dist[pairR[v]] == dist[u] + 1 && dfs(pairR[v], adj)) {", // 27
  "      pairR[v] = u; pairL[u] = v;",                              // 28
  "      return true;",                                             // 29
  "    }",                                                          // 30
  "  dist[u] = INF;",                                               // 31
  "  return false;",                                                // 32
  "}",                                                              // 33
  "",                                                               // 34
  "int hopcroftKarp(int L, int R, vector<vector<int>>& adj) {",     // 35
  "  pairL.assign(L+1, NIL); pairR.assign(R+1, NIL); dist.assign(L+1, 0);", // 36
  "  int matching = 0;",                                            // 37
  "  while (bfs(L, adj))",                                          // 38
  "    for (int u = 1; u <= L; u++)",                               // 39
  "      if (pairL[u] == NIL && dfs(u, adj)) matching++;",          // 40
  "  return matching;",                                             // 41
  "}",                                                              // 42
];
const HOPCROFT_SHORT = [
  "int hopcroftKarp(int L, int R, vector<vector<int>>& adj) {",     // 0
  "  pairL.assign(L+1, NIL); pairR.assign(R+1, NIL);",              // 1
  "  int matching = 0;",                                            // 2
  "  while (bfs(L, adj)) {                  // ← phase: BFS layer", // 3
  "    for (int u = 1; u <= L; u++)",                               // 4
  "      if (pairL[u] == NIL && dfs(u, adj)) // ← augment many",    // 5
  "        matching++;",                                            // 6
  "  }",                                                            // 7
  "  return matching;          // O(E√V)",                          // 8
  "}",                                                              // 9
];
const { Quiz: Quiz16 } = window.LessonComponents;
const { WorkedExample: WE16, CheatSheet: CS16, Pitfalls: PF16 } = window.LearningKit;

const Lessons16 = {};

/* ============================================================
   Shared Viz — Bipartite Matching (augmenting path)
============================================================ */
function BipartiteMatchViz() {
  // L = {A, B, C, D}, R = {1, 2, 3, 4}
  const L = ['A', 'B', 'C', 'D'];
  const R = ['1', '2', '3', '4'];
  // Possible edges (graph)
  const possible = [['A','1'],['A','2'],['B','1'],['B','3'],['C','2'],['C','3'],['C','4'],['D','3'],['D','4']];

  // Hungarian-style augmenting path (simple BFS approach with sequential add)
  const STEPS = [
    { msg: 'เริ่ม — ยังไม่มี matching', matched: [] },
    { msg: 'Try A: เลือก edge (A,1) — ว่าง ✓', matched: [['A','1']] },
    { msg: 'Try B: edge (B,1) ติด A. Augment path B-1-A-2 → A ย้ายไป 2, B ได้ 1', matched: [['A','2'],['B','1']] },
    { msg: 'Try C: edge (C,2) ติด A. (C,3) ว่าง → C ได้ 3 ตรงๆ (ไม่ต้อง augment)', matched: [['A','2'],['B','1'],['C','3']] },
    { msg: 'Try D: edge (D,3) ติด C. Augment D-3-C-4 → C ย้ายไป 4, D ได้ 3 ✓ matching ครบ 4', matched: [['A','2'],['B','1'],['C','4'],['D','3']] },
  ];

  const [step, setStep] = useS16(0);
  const cur = STEPS[step];
  const matchedSet = new Set(cur.matched.map(([l, r]) => l + '-' + r));

  const lY = (i) => 40 + i * 50;
  const rY = (i) => 40 + i * 50;

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <button onClick={() => setStep(0)}>↺ Reset</button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>▶</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Step {step + 1}/{STEPS.length}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>Matched: <b>{cur.matched.length}/{L.length}</b></span>
      </div>

      <svg width="100%" viewBox="0 0 320 240" style={{ background: 'var(--bg-1)', borderRadius: 6 }}>
        {/* L labels */}
        <text x={80} y={20} fill="var(--accent-2)" fontSize="11" fontWeight="700" textAnchor="middle">L (left)</text>
        <text x={240} y={20} fill="#a78bfa" fontSize="11" fontWeight="700" textAnchor="middle">R (right)</text>

        {/* Possible edges (gray) */}
        {possible.map(([l, r], i) => {
          const li = L.indexOf(l), ri = R.indexOf(r);
          const isMatched = matchedSet.has(l + '-' + r);
          return (
            <line key={i}
              x1={100} y1={lY(li)} x2={220} y2={rY(ri)}
              stroke={isMatched ? '#10b981' : 'var(--border)'}
              strokeWidth={isMatched ? 3 : 1}
              strokeDasharray={isMatched ? '' : '3,3'}
              opacity={isMatched ? 1 : 0.5} />
          );
        })}

        {/* L nodes */}
        {L.map((n, i) => {
          const isMatched = cur.matched.some(([l]) => l === n);
          return (
            <g key={'l' + n}>
              <circle cx={80} cy={lY(i)} r={18} fill={isMatched ? 'rgba(94,234,212,0.3)' : 'var(--bg-3)'} stroke="var(--accent-2)" strokeWidth={2} />
              <text x={80} y={lY(i) + 5} fill="var(--text-0)" fontSize="14" fontWeight="700" textAnchor="middle">{n}</text>
            </g>
          );
        })}

        {/* R nodes */}
        {R.map((n, i) => {
          const isMatched = cur.matched.some(([, r]) => r === n);
          return (
            <g key={'r' + n}>
              <circle cx={240} cy={rY(i)} r={18} fill={isMatched ? 'rgba(168,139,250,0.3)' : 'var(--bg-3)'} stroke="#a78bfa" strokeWidth={2} />
              <text x={240} y={rY(i) + 5} fill="var(--text-0)" fontSize="14" fontWeight="700" textAnchor="middle">{n}</text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontSize: 13 }}>
        ► {cur.msg}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <b>Augmenting path</b> = พบ alternating path (matched, unmatched, matched, ...) ที่ปลายเป็น unmatched → ‘flip’ ทุก edge → +1 matching
      </div>
    </div>
  );
}

/* ============================================================
   Tiny BFS-based max-flow simulator for visualization
============================================================ */
function buildSampleFlow() {
  // Classic CLRS network: s, v1, v2, v3, v4, t (6 nodes)
  // capacities
  const cap = {};
  const add = (u, v, c) => { cap[u + '-' + v] = c; cap[v + '-' + u] = cap[v + '-' + u] || 0; };
  add('s', 'a', 10); add('s', 'b', 10);
  add('a', 'b', 2); add('a', 'c', 4); add('a', 'd', 8);
  add('b', 'd', 9);
  add('c', 't', 10);
  add('d', 'c', 6); add('d', 't', 10);
  return cap;
}

function computeMaxFlow(cap0) {
  const cap = { ...cap0 };
  const flow = {};
  Object.keys(cap).forEach(k => flow[k] = 0);
  const adj = {};
  Object.keys(cap).forEach(k => {
    const [u, v] = k.split('-');
    adj[u] = adj[u] || []; adj[v] = adj[v] || [];
    if (!adj[u].includes(v)) adj[u].push(v);
    if (!adj[v].includes(u)) adj[v].push(u);
  });
  const trace = [];
  let total = 0;
  while (true) {
    // BFS find augmenting path
    const parent = { s: null };
    const queue = ['s'];
    let found = false;
    while (queue.length) {
      const u = queue.shift();
      if (u === 't') { found = true; break; }
      for (const v of (adj[u] || [])) {
        if (parent[v] !== undefined) continue;
        const residual = (cap[u + '-' + v] || 0) - (flow[u + '-' + v] || 0);
        if (residual > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }
    if (!found) break;
    // Find bottleneck
    let node = 't', path = ['t'];
    let bottleneck = Infinity;
    while (parent[node]) {
      const p = parent[node];
      path.unshift(p);
      const res = cap[p + '-' + node] - flow[p + '-' + node];
      bottleneck = Math.min(bottleneck, res);
      node = p;
    }
    // Update flow
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i], v = path[i + 1];
      flow[u + '-' + v] = (flow[u + '-' + v] || 0) + bottleneck;
      flow[v + '-' + u] = (flow[v + '-' + u] || 0) - bottleneck;
    }
    total += bottleneck;
    trace.push({ path: path.join(' → '), bottleneck, total });
  }
  return { total, trace, flow, cap };
}

function MaxFlowViz() {
  const [step, setStep] = useS16(-1);
  const { total, trace, flow, cap } = useM16(() => computeMaxFlow(buildSampleFlow()), []);

  const visibleTrace = step < 0 ? [] : trace.slice(0, step + 1);
  const currentFlow = {};
  Object.keys(cap).forEach(k => currentFlow[k] = 0);
  // recompute flow up to step
  if (step >= 0) {
    const c2 = { ...cap };
    const f2 = {}; Object.keys(c2).forEach(k => f2[k] = 0);
    for (let s = 0; s <= step && s < trace.length; s++) {
      const path = trace[s].path.split(' → ');
      const b = trace[s].bottleneck;
      for (let i = 0; i < path.length - 1; i++) {
        f2[path[i] + '-' + path[i + 1]] = (f2[path[i] + '-' + path[i + 1]] || 0) + b;
        f2[path[i + 1] + '-' + path[i]] = (f2[path[i + 1] + '-' + path[i]] || 0) - b;
      }
    }
    Object.assign(currentFlow, f2);
  }

  const positions = {
    s: { x: 30, y: 140 }, a: { x: 150, y: 60 }, b: { x: 150, y: 220 },
    c: { x: 290, y: 60 }, d: { x: 290, y: 200 }, t: { x: 420, y: 140 }
  };
  const edges = [
    ['s', 'a'], ['s', 'b'], ['a', 'b'], ['a', 'c'], ['a', 'd'],
    ['b', 'd'], ['c', 't'], ['d', 'c'], ['d', 't']
  ];

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(-1)}>Reset</button>
        <button onClick={() => setStep(s => Math.max(-1, s - 1))} disabled={step < 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(trace.length - 1, s + 1))} disabled={step >= trace.length - 1}>▶</button>
        <span>Iteration {step + 1} / {trace.length}</span>
        <span style={{ color: 'var(--accent-2)', marginLeft: 'auto' }}>Current total flow: <b>{step < 0 ? 0 : trace[step].total}</b> / Max = {total}</span>
      </div>

      <svg width="480" height="280" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
        {edges.map(([u, v]) => {
          const p1 = positions[u], p2 = positions[v];
          const f = currentFlow[u + '-' + v] || 0;
          const c = cap[u + '-' + v];
          const used = f / c;
          const color = f > 0 ? '#10b981' : '#64748b';
          return (
            <g key={u + v}>
              <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={f > 0 ? 3 : 1.5} markerEnd="url(#arr)" />
              <text x={(p1.x + p2.x) / 2 + 5} y={(p1.y + p2.y) / 2 - 6} fontSize="11" fill={color} fontWeight="600">
                {f}/{c}
              </text>
            </g>
          );
        })}
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#64748b" />
          </marker>
        </defs>
        {Object.entries(positions).map(([id, p]) => (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r="20" fill={id === 's' || id === 't' ? '#a78bfa' : 'var(--bg-3)'} stroke="var(--accent)" strokeWidth="2" />
            <text x={p.x} y={p.y + 5} fontSize="14" fontWeight="700" fill="var(--text-0)" textAnchor="middle">{id}</text>
          </g>
        ))}
      </svg>

      {step >= 0 && (
        <div style={{ marginTop: 10, padding: 10, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}>
          <b>Path:</b> {trace[step].path} <span style={{ color: 'var(--accent)', marginLeft: 12 }}>Bottleneck = {trace[step].bottleneck}</span>
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-2)' }}>
        Network ตัวอย่าง CLRS — s = source, t = sink. ใช้ Edmonds-Karp (BFS) หา augmenting path
      </div>
    </div>
  );
}

/* ============================================================
   72 — MAX FLOW — FORD-FULKERSON
============================================================ */
Lessons16["max-flow"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🌊 Max Flow Problem</div>
        Network: graph มี <b>source s</b>, <b>sink t</b>, edge แต่ละเส้นมี <b>capacity</b><br/>
        หาว่าจะส่ง flow ได้สูงสุดเท่าไรจาก s ถึง t
      </div>

      <h3>นิยามทางการ</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        Flow f: E → ℝ⁺ ต้อง satisfy:
        <ol style={{ marginTop: 8, color: 'var(--text-1)' }}>
          <li><b>Capacity constraint:</b> 0 ≤ f(u,v) ≤ c(u,v) ทุก edge</li>
          <li><b>Flow conservation:</b> ∑inflow = ∑outflow สำหรับทุก vertex ที่ไม่ใช่ s, t</li>
        </ol>
        <b>|f| = ∑outflow(s) = ∑inflow(t) → ค่าที่ต้องการให้สูงสุด</b>
      </div>

      <h3>ตัวอย่าง — Network</h3>
      <MaxFlowViz />

      <h3>Ford-Fulkerson — C++ Code</h3>
      <CodeViewToggle16
        code={FORD_FULKERSON_FULL}
        codeShort={FORD_FULKERSON_SHORT}
        helperName="bfsFindPath()"
      />

      <h3>Residual Graph (G_f)</h3>
      <p>
        สำหรับแต่ละ edge (u,v) ใน G ที่มี flow f(u,v):
      </p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Forward edge (u,v):</b> capacity = c(u,v) - f(u,v) — ยังส่งได้เท่าไร</li>
        <li><b>Backward edge (v,u):</b> capacity = f(u,v) — ยกเลิก flow ได้เท่าไร</li>
      </ul>

      <WE16
        title="ทำไมต้องมี Backward Edge?"
        problem="เพื่อ ‘แก้ทาง’ ที่เลือกผิดในรอบก่อน"
        steps={[
          { title: "Greedy ผิด", body: "ถ้าไม่มี backward edge:\nรอบแรกเลือก path ผิด → ติด suboptimal\nไม่มี way ‘undo’", why: "Pure greedy ไม่พอ" },
          { title: "Backward edge = undo", body: "Send flow ทิศ backward = ยกเลิก flow เดิมในทิศ forward\nสร้าง degree of freedom", why: "อนุญาตให้แก้การตัดสินใจ" },
          { title: "Augmenting path", body: "Path s → t ใน G_f (ใช้ทั้ง forward + backward edge ของ residual)", why: "อาจไม่ใช่ simple path ใน G เดิม" },
        ]}
        answer="Backward edge ทำให้ Ford-Fulkerson ได้ <b>global optimum</b> ไม่ใช่แค่ local"
        takeaway="Residual graph คือหัวใจของ flow algorithms"
      />

      <h3>Complexity</h3>
      <table className="cmp">
        <thead><tr><th>วิธีเลือก augmenting path</th><th>Time</th><th>ปัญหา</th></tr></thead>
        <tbody>
          <tr><td>DFS ใด ๆ (vanilla FF)</td><td>O(E · |f*|)</td><td>ขึ้นกับค่า max flow (อาจช้ามากถ้า capacity ใหญ่)</td></tr>
          <tr><td>BFS (Edmonds-Karp)</td><td>O(VE²)</td><td>Polynomial guarantee — ไม่ขึ้นกับค่า capacity</td></tr>
          <tr><td>Dinic's algorithm</td><td>O(V²E)</td><td>เร็วในทาง practical</td></tr>
        </tbody>
      </table>

      <h3>ปัญหาที่ Ford-Fulkerson แบบ ไม่ใช้ BFS ช้าได้</h3>
      <div className="callout warn">
        <div className="ttl">⚠ Pathological example</div>
        หาก capacity เป็นตัวเลขใหญ่ และ vanilla FF เลือก path "ผ่าน edge ที่มี cap = 1"<br/>
        → augment ทีละ 1 → ใช้ O(|f*|) iterations ซึ่งอาจเป็น 10⁹+<br/><br/>
        แก้: ใช้ BFS (Edmonds-Karp) — รับประกัน O(VE²)
      </div>

      <PF16 items={[
        { trap: "ลืม backward edge → ติด local optimum", fix: "Always model residual graph ให้สมบูรณ์" },
        { trap: "Flow ไม่ conserve ที่ intermediate vertex", fix: "ตรวจ ∑inflow = ∑outflow ที่ทุก vertex (ไม่ใช่ s, t)" },
        { trap: "ใช้ FF กับ capacity ไม่ใช่ integer → อาจไม่ terminate", fix: "Capacities integer → terminate แน่; irrational อาจวน → ใช้ Edmonds-Karp" },
      ]} />

      <Quiz16 q={{
        question: "ใน augmenting path P, bottleneck คือ?",
        options: [
          "Edge ที่มี capacity น้อยสุดใน P",
          "Edge ที่มี residual น้อยสุดใน P",
          "Sum ของ flow ทุก edge",
          "Edge แรกของ P"
        ],
        answer: 1,
        explain: "Bottleneck = min ของ residual capacity (c - f) ตลอด path — บอกว่าเพิ่ม flow ได้กี่ครั้ง"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   73 — EDMONDS-KARP
============================================================ */
Lessons16["edmonds-karp"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Edmonds-Karp = Ford-Fulkerson + BFS</div>
        เลือก augmenting path ที่ <b>สั้นที่สุด</b> (จำนวน edge น้อยสุด) ด้วย BFS<br/>
        → guarantee O(VE²) เวลา ไม่ขึ้นกับค่า capacity
      </div>

      <h3>Edmonds-Karp — C++ Code</h3>
      <CodeViewToggle16
        code={EDMONDS_KARP_FULL}
        codeShort={EDMONDS_KARP_SHORT}
        helperName="bfsFindPath()"
      />

      <h3>Visualization (ใช้ BFS เลือก path)</h3>
      <MaxFlowViz />

      <h3>Complexity Proof Sketch — O(VE²)</h3>
      <WE16
        title="ทำไม Edmonds-Karp = O(VE²)?"
        problem="พิสูจน์ guarantee"
        steps={[
          { title: "Lemma 1", body: "Shortest distance d(s,v) ใน G_f <b>ไม่ลดลง</b> หลัง augmentation", why: "BFS เลือก shortest path → distance monotonically increasing" },
          { title: "Lemma 2", body: "Edge (u,v) เป็น ‘critical’ (bottleneck) ในรอบหนึ่ง\n→ ครั้งถัดไปที่ (u,v) จะ critical อีก ต้อง d(s,u) เพิ่มขึ้น ≥ 2", why: "เพราะ flow ใน (u,v) → ไม่อยู่ใน G_f → ต้องรอ flow reverse ผ่าน (v,u)" },
          { title: "Lemma 3", body: "d(s,u) ≤ V → edge (u,v) เป็น critical ได้ไม่เกิน V/2 ครั้ง\n→ จำนวน critical events ทั้งหมด ≤ E · V/2 = O(VE)", why: "" },
          { title: "Total time", body: "แต่ละ iteration = 1 critical edge อย่างน้อย\n→ iterations ≤ O(VE)\nแต่ละ BFS = O(E)\n→ <b>Total = O(VE²)</b>", why: "" },
        ]}
        answer="Edmonds-Karp = O(VE²) ไม่ขึ้นกับค่า capacity ▢"
      />

      <h3>เทียบ Vanilla FF vs Edmonds-Karp</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Vanilla Ford-Fulkerson</th><th>Edmonds-Karp</th></tr></thead>
        <tbody>
          <tr><td>Path selection</td><td>DFS ใด ๆ</td><td>BFS (shortest path)</td></tr>
          <tr><td>Time</td><td>O(E · |f*|)</td><td>O(VE²)</td></tr>
          <tr><td>Capacity ใหญ่</td><td>ช้ามาก ⚠</td><td>เร็วเสมอ</td></tr>
          <tr><td>Capacity ไม่ใช่ integer</td><td>อาจไม่ terminate</td><td>Terminate เสมอ</td></tr>
        </tbody>
      </table>

      <CS16 title="Flow Algorithms Cheat Sheet" sections={[
        { label: "Ford-Fulkerson (DFS)", value: "O(E · max_flow)<br/>ขึ้นกับ capacity" },
        { label: "Edmonds-Karp (BFS)", value: "O(VE²)<br/>Strongly polynomial" },
        { label: "Dinic's", value: "O(V²E)<br/>เร็วในทาง practical, unit cap = O(E√V)" },
        { label: "Push-Relabel", value: "O(V²E) หรือ O(V³)<br/>ดีที่สุดสำหรับ dense graphs" },
      ]} />

      <Quiz16 q={{
        question: "BFS เลือก augmenting path แบบไหน?",
        options: [
          "Path ที่มี bottleneck ใหญ่สุด",
          "Path ที่สั้นที่สุด (จำนวน edge น้อยสุด)",
          "Path แบบ random",
          "Path ที่มี flow น้อยสุด"
        ],
        answer: 1,
        explain: "BFS หา shortest path เสมอ (in terms of edge count) — นี่คือกุญแจของ Edmonds-Karp"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   74 — MAX-FLOW MIN-CUT THEOREM
============================================================ */
Lessons16["min-cut"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⚖️ Max-Flow Min-Cut Theorem</div>
        ทฤษฎีบทคู่ที่สวยงาม: <b>max flow = min s-t cut</b><br/>
        หนึ่งในผลที่สำคัญที่สุดใน combinatorial optimization
      </div>

      <h3>นิยาม — s-t Cut</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b>s-t cut (S, T)</b> = partition ของ vertices ที่ <b>s ∈ S, t ∈ T</b><br/>
        <b>Capacity ของ cut</b> = ∑ c(u,v) สำหรับทุก edge u ∈ S, v ∈ T<br/>
        (นับเฉพาะ <b>edge ที่ข้ามจาก S ไป T</b>, ไม่ใช่ T ไป S)
      </div>

      <h3>Theorem</h3>
      <div className="callout warn">
        <div className="ttl">🎯 Max-Flow Min-Cut Theorem (Ford-Fulkerson 1956)</div>
        ใน flow network ใด ๆ:<br/>
        <b style={{ fontSize: 18 }}>max |f| = min c(S, T)</b><br/><br/>
        — Maximum flow มีค่าเท่ากับ <b>capacity ของ minimum s-t cut</b>
      </div>

      <WE16
        title="Proof of Max-Flow Min-Cut"
        problem="พิสูจน์ทฤษฎีบทนี้"
        steps={[
          { title: "Weak Duality: max_flow ≤ min_cut", body: "สำหรับ flow f และ cut (S,T) ใด ๆ:\n|f| = ∑(out of S) f − ∑(into S) f\n   ≤ ∑(out of S) c\n   = c(S, T)\n\n→ ทุก flow ≤ ทุก cut → max ≤ min", why: "Flow ออกจาก S ผ่าน edges ที่มี capacity → bound ด้วย capacity ทั้งหมด" },
          { title: "Strong Duality: ค่าเท่ากัน", body: "ให้ f* = max flow (Ford-Fulkerson terminate)\n→ ไม่มี augmenting path ใน G_f*\n\nให้ S = {vertices ที่ reachable จาก s ใน G_f*}, T = V \\ S\n(s ∈ S, t ∈ T)", why: "Cut ที่สร้างจาก residual graph" },
          { title: "ตรวจสอบ |f*| = c(S, T)", body: "Edge (u,v) ที่ u ∈ S, v ∈ T:\n→ ไม่มี residual capacity (มิฉะนั้น v reachable)\n→ f(u,v) = c(u,v)\n\nEdge (v,u) ที่ v ∈ T, u ∈ S:\n→ ไม่มี residual capacity ฝั่ง v→u\n→ f(v,u) = 0\n\n→ |f*| = ∑(S→T) c(u,v) − 0 = c(S,T) ✓", why: "Saturate edges ขาออก + ไม่มี edge ขาเข้า" },
        ]}
        answer="∴ max |f| = min c(S, T) ▢"
        takeaway="ทำให้ max-flow บอก<b>คอขวด</b>ของ network ทันที"
      />

      <h3>การใช้งาน</h3>
      <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li><b>Network reliability:</b> หา edge ที่ถ้าถูกตัดแล้วทำให้ disconnect</li>
        <li><b>Image segmentation:</b> หา ‘ขอบ’ ระหว่าง foreground/background</li>
        <li><b>Project selection:</b> เลือก project ให้ profit สูงสุด (lossless reduction → min cut)</li>
        <li><b>Bipartite matching:</b> max matching = max flow ใน network ที่สร้างขึ้น</li>
      </ul>

      <WE16
        title="ใช้: Image Segmentation"
        problem="แยก foreground/background ด้วย min cut"
        steps={[
          { title: "Model", body: "Pixels เป็น vertices\nSource s = ‘foreground prior’, sink t = ‘background prior’\nEdge s→pixel = ความน่าจะเป็น fg\nEdge pixel→t = ความน่าจะเป็น bg\nEdge pixel↔neighbor = smoothness penalty", why: "Convert problem เป็น flow" },
          { title: "Solve", body: "Run max-flow → ได้ min cut\nCut แบ่ง pixels เป็น 2 กลุ่ม (S = fg, T = bg)", why: "" },
          { title: "Why optimal?", body: "Cut value = ความไม่ตรงกับ prior + edge penalty ตามขอบ\n→ min cut = segmentation ที่ดีที่สุด", why: "Bayesian optimal under model" },
        ]}
        answer="Min-cut → optimal segmentation ▢ (Boykov-Kolmogorov ใช้)"
      />

      <h3>Algorithm สำหรับ Min Cut</h3>
      <ol style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li>Run Ford-Fulkerson/Edmonds-Karp → ได้ max flow f*</li>
        <li>BFS ใน residual graph G_f* จาก s → ได้ S = {`{vertices reachable}`}</li>
        <li>T = V \ S</li>
        <li>Min cut = edges (u,v) ที่ u ∈ S, v ∈ T</li>
      </ol>

      <PF16 items={[
        { trap: "นับ edge ทั้ง 2 ทิศใน cut", fix: "Cut capacity = <b>เฉพาะ S → T</b> (ไม่ใช่ T → S)" },
        { trap: "Cut ที่ไม่ separate s, t", fix: "ต้อง s ∈ S, t ∈ T เท่านั้น" },
        { trap: "Min cut อาจมีหลายอัน", fix: "Max flow ค่าเดียว แต่ cut อาจไม่ unique — algorithm ให้ S = reachable" },
      ]} />

      <Quiz16 q={{
        question: "ใน network ตัวอย่าง CLRS (s, a, b, c, d, t) max flow = 19 ซึ่งเท่ากับอะไร?",
        options: ["Capacity ของ edge s→a + s→b = 20", "Min s-t cut capacity = 19", "จำนวน edges = 9", "Capacity ของ edge c→t + d→t = 20"],
        answer: 1,
        explain: "ตามทฤษฎีบท Max-Flow Min-Cut: max flow = min cut → 19 — Cut อาจคือ {s,a,b,d} | {c,t}: c(a,c) + c(d,c) + c(d,t) = 4+6+10 = 20... จริง ๆ min cut ของ network นี้ = 19"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   75 — BIPARTITE MATCHING
============================================================ */
Lessons16["bipartite-matching"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">💞 Bipartite Matching</div>
        Graph แบ่งเป็น 2 ฝั่ง L, R — ต้องการเลือก edge มากที่สุดที่ <b>ไม่มี vertex ใช้ซ้ำ</b>
      </div>

      <h3>ตัวอย่างปัญหา</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Job assignment:</b> n คน, m งาน — ใครทำงานไหนได้ → max matching</li>
        <li><b>Marriage problem:</b> ผู้ชาย — ผู้หญิง</li>
        <li><b>School admission:</b> นักเรียน — โรงเรียน</li>
      </ul>

      <h3>🎬 Interactive — Bipartite Matching (4×4, augmenting path)</h3>
      <BipartiteMatchViz />

      <h3>Reduction → Max Flow</h3>
      <WE16
        title="Bipartite Matching ≤ Max Flow"
        problem="แปลง matching เป็น flow problem"
        steps={[
          { title: "Construction", body: "เพิ่ม super source s และ super sink t\ns → ทุก vertex ใน L (capacity 1)\nL → R edges จาก graph เดิม (capacity 1)\nR → t (capacity 1)", why: "1 = แต่ละ vertex ใช้ได้ครั้งเดียว" },
          { title: "Max flow = max matching", body: "Integer max flow ใน network นี้\n= จำนวน edges L→R ที่ใช้ flow = 1\n= matching ขนาดสูงสุด", why: "Capacity 1 บังคับให้แต่ละ vertex ถูก match อย่างมาก 1 ครั้ง" },
          { title: "Complexity", body: "Network มี O(V+E) edges, max flow ≤ min(|L|, |R|) ≤ V\n→ Ford-Fulkerson O(VE)\nหรือ Hopcroft-Karp O(E√V)", why: "Optimization สำหรับ unit-cap" },
        ]}
        answer="Max matching = Max flow ใน network ที่สร้างขึ้น ▢"
      />

      <h3>Hopcroft-Karp — O(E√V)</h3>
      <p>
        เร็วกว่า vanilla flow โดยใช้ <b>multiple augmenting paths ต่อ phase</b>:
      </p>
      <CodeViewToggle16
        code={HOPCROFT_FULL}
        codeShort={HOPCROFT_SHORT}
        helperName="bfs() + dfs()"
      />

      <h3>Bipartite Matching (Vanilla) — C++ Code</h3>
      <CodeViewToggle16
        code={BIPARTITE_FULL}
        codeShort={BIPARTITE_SHORT}
        helperName="tryAugment()"
      />

      <h3>König's Theorem (Bipartite Graph)</h3>
      <div className="callout warn">
        <div className="ttl">🎯 ทฤษฎีบท König</div>
        ใน bipartite graph: <b>max matching = min vertex cover</b><br/><br/>
        (ใน general graph: max matching ≤ min vertex cover ≤ 2·max matching)
      </div>

      <WE16
        title="Hungarian Algorithm: Min-Cost Bipartite Matching"
        problem="ถ้า edge มี cost — หา perfect matching ที่ cost น้อยสุด"
        steps={[
          { title: "Reduce → Min-Cost Max-Flow", body: "เพิ่ม cost ให้ edge L→R\nMin-Cost Max-Flow algorithm → optimal", why: "Generalization" },
          { title: "Hungarian Algorithm", body: "Specialized O(V³) สำหรับ assignment problem (matching ที่ |L| = |R|)\nใช้ duality + reduced costs", why: "เร็วกว่า general MCMF" },
          { title: "Application", body: "Object tracking, sensor assignment, scheduling", why: "" },
        ]}
        answer="Hungarian = O(V³) สำหรับ assignment optimal ▢"
      />

      <CS16 title="Matching Algorithms" sections={[
        { label: "Bipartite (unweighted)", value: "Ford-Fulkerson O(VE)<br/>Hopcroft-Karp O(E√V)" },
        { label: "Bipartite (weighted)", value: "Hungarian O(V³)<br/>Min-Cost Max-Flow" },
        { label: "General graph (unweighted)", value: "Blossom (Edmonds) O(V³)" },
        { label: "König's Theorem", value: "Bipartite: max matching = min vertex cover" },
      ]} />

      <PF16 items={[
        { trap: "Graph ไม่ bipartite → ใช้ flow reduction", fix: "Bipartiteness สำคัญ — Blossom algorithm สำหรับ general (ซับซ้อนกว่ามาก)" },
        { trap: "ใช้ greedy → suboptimal", fix: "Greedy ไม่ optimal — ต้อง augmenting path เพื่อ ‘แลก’ matching เดิม" },
        { trap: "ลืม integer capacity 1", fix: "บังคับให้ flow แต่ละ edge = 0 หรือ 1 → ได้ valid matching" },
      ]} />

      <Quiz16 q={{
        question: "ใน bipartite graph ที่ |L| = 5, |R| = 7, จำนวน edges = 15 — max matching เป็น?",
        options: ["= 5 เสมอ", "≤ 5 (จำกัดด้วย L ที่เล็กกว่า)", "= 15", "≤ 7"],
        answer: 1,
        explain: "Max matching ≤ min(|L|, |R|) = 5 — แต่อาจน้อยกว่าถ้า structure ของ edges ไม่ allow"
      }} />

      <Quiz16 q={{
        question: "ใน bipartite graph ที่ max matching = 8 — min vertex cover เป็น?",
        options: ["8 (โดย König)", "16", "≤ 8", "≥ 8"],
        answer: 0,
        explain: "König's Theorem: bipartite → max matching = min vertex cover เท่ากันเป๊ะ"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart16 = Lessons16;
