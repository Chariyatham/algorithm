/* Lessons Part 29 — Animation Visualizers
   Step-by-step animations for Graph + DP algorithms */

const { useState: useS29, useMemo: useM29, useEffect: useE29 } = React;
const { Quiz: Quiz29 } = window.LessonComponents;
const CodeViewToggle = window.CodeViewToggle;

const Lessons29 = {};

/* ============================================================
   Shared: Step Player Hook (lightweight)
============================================================ */
function useStepper(frames) {
  const [idx, setIdx] = useS29(0);
  const [playing, setPlaying] = useS29(false);
  const [speed, setSpeed] = useS29(1);
  useE29(() => { setIdx(0); setPlaying(false); }, [frames.length]);
  useE29(() => {
    if (!playing) return;
    if (idx >= frames.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx(i => Math.min(frames.length - 1, i + 1)), 800 / speed);
    return () => clearTimeout(t);
  }, [playing, idx, speed, frames.length]);
  return {
    idx, frame: frames[idx] || frames[0] || {}, frames, playing, speed,
    play: () => { if (idx >= frames.length - 1) setIdx(0); setPlaying(true); },
    pause: () => setPlaying(false),
    step: () => { setPlaying(false); setIdx(i => Math.min(frames.length - 1, i + 1)); },
    back: () => { setPlaying(false); setIdx(i => Math.max(0, i - 1)); },
    reset: () => { setPlaying(false); setIdx(0); },
    toggle: () => setPlaying(p => !p),
    setSpeed,
  };
}

function StepperBar({ p }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, background: 'var(--bg-3)', padding: 8, borderRadius: 8 }}>
      <button onClick={p.reset}>↺</button>
      <button onClick={p.back} disabled={p.idx === 0}>◀</button>
      <button onClick={p.toggle} style={{ background: 'var(--accent)', color: '#000', fontWeight: 700 }}>{p.playing ? '⏸ Pause' : '▶ Play'}</button>
      <button onClick={p.step} disabled={p.idx >= p.frames.length - 1}>▶|</button>
      <span style={{ fontSize: 11, marginLeft: 8 }}>Speed</span>
      <input type="range" min="0.5" max="3" step="0.5" value={p.speed} onChange={e => p.setSpeed(+e.target.value)} style={{ width: 80 }} />
      <span style={{ fontFamily: 'monospace', fontSize: 11, marginLeft: 8 }}>{p.idx + 1} / {p.frames.length}</span>
    </div>
  );
}

/* ============================================================
   Fixed graph layout used by BFS/DFS/Dijkstra demos
============================================================ */
const G_NODES = [
  { id: 0, x: 80, y: 80, label: 'A' },
  { id: 1, x: 200, y: 60, label: 'B' },
  { id: 2, x: 320, y: 100, label: 'C' },
  { id: 3, x: 100, y: 200, label: 'D' },
  { id: 4, x: 220, y: 200, label: 'E' },
  { id: 5, x: 340, y: 220, label: 'F' },
  { id: 6, x: 180, y: 320, label: 'G' },
];
const G_EDGES = [
  { u: 0, v: 1, w: 4 }, { u: 0, v: 3, w: 2 },
  { u: 1, v: 2, w: 3 }, { u: 1, v: 4, w: 5 },
  { u: 2, v: 5, w: 2 }, { u: 3, v: 4, w: 1 },
  { u: 4, v: 5, w: 4 }, { u: 4, v: 6, w: 6 },
  { u: 5, v: 6, w: 3 }, { u: 3, v: 6, w: 8 },
];

function GraphSvg({ frame, weighted = false, directed = false }) {
  const { visited = new Set(), queue = [], current = -1, dist = {}, parent = {}, mst = new Set() } = frame;
  const adjOf = (u) => G_EDGES.filter(e => e.u === u || e.v === u);

  return (
    <svg width="100%" viewBox="0 0 420 380" style={{ background: 'var(--bg-2)', borderRadius: 10 }}>
      {/* edges */}
      {G_EDGES.map((e, i) => {
        const a = G_NODES[e.u], b = G_NODES[e.v];
        const inMST = mst.has(`${Math.min(e.u, e.v)}-${Math.max(e.u, e.v)}`);
        const onPath = parent[e.v] === e.u || parent[e.u] === e.v;
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={inMST ? 'var(--accent-3)' : onPath ? 'var(--accent)' : 'var(--border)'}
              strokeWidth={inMST || onPath ? 3 : 1.5} />
            {weighted && (
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4}
                fontSize="12" fill="var(--warn)" fontFamily="monospace"
                textAnchor="middle"
                style={{ paintOrder: 'stroke', stroke: 'var(--bg-2)', strokeWidth: 3 }}>
                {e.w}
              </text>
            )}
          </g>
        );
      })}
      {/* nodes */}
      {G_NODES.map(n => {
        const isVisited = visited.has(n.id);
        const isCurrent = current === n.id;
        const inQueue = queue.includes(n.id);
        const fill = isCurrent ? 'var(--warn)' : isVisited ? 'var(--accent-3)' : inQueue ? 'var(--accent)' : 'var(--bg-3)';
        const stroke = isCurrent ? 'var(--warn)' : 'var(--border)';
        const d = dist[n.id];
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth={isCurrent ? 3 : 1.5} />
            <text x={n.x} y={n.y + 5} fontSize="14" fontWeight="700"
              fill={isVisited || isCurrent || inQueue ? '#000' : 'var(--text-1)'}
              textAnchor="middle">{n.label}</text>
            {d !== undefined && d !== Infinity && (
              <text x={n.x} y={n.y - 30} fontSize="11" fill="var(--accent)" fontFamily="monospace"
                textAnchor="middle"
                style={{ paintOrder: 'stroke', stroke: 'var(--bg-2)', strokeWidth: 3 }}>
                d={d}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   136 — BFS Animated
============================================================ */
function bfsFrames(start = 0) {
  const adj = {};
  G_NODES.forEach(n => adj[n.id] = []);
  G_EDGES.forEach(e => { adj[e.u].push(e.v); adj[e.v].push(e.u); });
  const frames = [];
  const visited = new Set([start]);
  const queue = [start];
  const parent = { [start]: -1 };
  // codeLine ชี้บรรทัดใน BFS_CODE (ดู Lessons29["bfs-anim"] ด้านล่าง)
  frames.push({ visited: new Set(visited), queue: [...queue], current: -1, parent: { ...parent }, msg: `เริ่ม ใส่ ${G_NODES[start].label} ลง queue`, codeLine: 13 });
  while (queue.length) {
    const u = queue.shift();
    frames.push({ visited: new Set(visited), queue: [...queue], current: u, parent: { ...parent }, msg: `dequeue ${G_NODES[u].label}`, codeLine: 16 });
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v); queue.push(v); parent[v] = u;
        frames.push({ visited: new Set(visited), queue: [...queue], current: u, parent: { ...parent }, msg: `เยี่ยม ${G_NODES[v].label} จาก ${G_NODES[u].label} — enqueue`, codeLine: 22 });
      }
    }
  }
  frames.push({ visited: new Set(visited), queue: [], current: -1, parent: { ...parent }, msg: 'เสร็จสิ้น', codeLine: 26 });
  return frames;
}

Lessons29["bfs-anim"] = function () {
  const frames = useM29(() => bfsFrames(0), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 BFS Animation</div>
        ดู Queue + Visited set เคลื่อนไหวทีละ step
      </div>
      <StepperBar p={p} />
      <GraphSvg frame={p.frame} />
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13, minHeight: 36 }}>
        💬 {p.frame.msg}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>Queue (FIFO)</div>
          <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent)' }}>
            [{(p.frame.queue || []).map(id => G_NODES[id].label).join(', ')}]
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>Visited</div>
          <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent-3)' }}>
            {`{${[...(p.frame.visited || [])].map(id => G_NODES[id].label).join(', ')}}`}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด BFS (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <queue>",                              // 0
        "#include <vector>",                              // 1
        "using namespace std;",                           // 2
        "",                                               // 3
        "// BFS จาก start — เยี่ยม node ระดับต่อระดับ",      // 4
        "vector<int> bfs(vector<vector<int>>& adj,",      // 5
        "                int start) {",                   // 6
        "  int n = adj.size();",                          // 7
        "  vector<bool> visited(n, false);",              // 8
        "  vector<int> parent(n, -1);",                   // 9
        "  queue<int> q;",                                // 10
        "",                                               // 11
        "  visited[start] = true;",                       // 12
        "  q.push(start);                  // ← เริ่ม",   // 13
        "",                                               // 14
        "  while (!q.empty()) {",                         // 15
        "    int u = q.front(); q.pop();   // ← dequeue", // 16
        "    // เยี่ยม u (process node)",                  // 17
        "    for (int v : adj[u]) {",                     // 18
        "      if (!visited[v]) {",                       // 19
        "        visited[v] = true;",                     // 20
        "        parent[v] = u;",                         // 21
        "        q.push(v);                // ← enqueue", // 22
        "      }",                                        // 23
        "    }",                                          // 24
        "  }",                                            // 25
        "  return parent;                   // ← จบ",     // 26
        "}",                                              // 27
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="ทำไม BFS ใช้ Queue ไม่ใช่ Stack?"
        options={[
          "Queue เร็วกว่า",
          "FIFO ทำให้เยี่ยม node ใกล้ start ก่อน (ระดับต่อระดับ)",
          "Stack ใช้ memory มากกว่า",
          "ไม่เกี่ยว — ใช้อันไหนก็ได้"
        ]}
        answer={1}
        explain="Queue → เยี่ยม level k ทั้งหมดก่อน level k+1 → shortest path บน unweighted graph"
      />
      <Quiz29
        q="BFS บน unweighted graph คำนวณอะไรได้?"
        options={[
          "Topological sort",
          "Shortest path (จำนวน edges) จาก start ไปทุก node",
          "Minimum spanning tree",
          "Strongly Connected Components"
        ]}
        answer={1}
        explain="BFS เยี่ยม level by level → distance = level number"
      />
    </React.Fragment>
  );
};

/* ============================================================
   137 — DFS Animated
============================================================ */
function dfsFrames(start = 0) {
  const adj = {};
  G_NODES.forEach(n => adj[n.id] = []);
  G_EDGES.forEach(e => { adj[e.u].push(e.v); adj[e.v].push(e.u); });
  for (const k in adj) adj[k].sort((a, b) => a - b);
  const frames = [];
  const visited = new Set();
  const parent = {};
  const stk = [];
  function dfs(u, p) {
    visited.add(u);
    parent[u] = p;
    stk.push(u);
    // codeLine ชี้ DFS_CODE (ดู Lessons29["dfs-anim"])
    frames.push({ visited: new Set(visited), queue: [...stk], current: u, parent: { ...parent }, msg: `เยี่ยม ${G_NODES[u].label} (push stack)`, codeLine: 8 });
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        frames.push({ visited: new Set(visited), queue: [...stk], current: u, parent: { ...parent }, msg: `${G_NODES[u].label} → ${G_NODES[v].label} (recurse)`, codeLine: 13 });
        dfs(v, u);
        frames.push({ visited: new Set(visited), queue: [...stk], current: u, parent: { ...parent }, msg: `กลับมาที่ ${G_NODES[u].label}`, codeLine: 13 });
      }
    }
    stk.pop();
    frames.push({ visited: new Set(visited), queue: [...stk], current: u, parent: { ...parent }, msg: `เสร็จ ${G_NODES[u].label} (pop stack)`, codeLine: 17 });
  }
  dfs(start, -1);
  frames.push({ visited: new Set(visited), queue: [], current: -1, parent: { ...parent }, msg: 'เสร็จสิ้น', codeLine: 19 });
  return frames;
}

Lessons29["dfs-anim"] = function () {
  const frames = useM29(() => dfsFrames(0), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 DFS Animation</div>
        ดู Recursion Stack ลึกขึ้นและกลับขึ้นมา
      </div>
      <StepperBar p={p} />
      <GraphSvg frame={p.frame} />
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13, minHeight: 36 }}>
        💬 {p.frame.msg}
      </div>
      <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, marginTop: 10 }}>
        <div style={{ color: 'var(--text-2)', fontSize: 12 }}>Call Stack (LIFO)</div>
        <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--accent-2)' }}>
          [{(p.frame.queue || []).map(id => G_NODES[id].label).join(' → ')}]
        </div>
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด DFS (เต็ม, recursive)</h3>
      <CodeViewToggle code={[
        "#include <vector>",                              // 0
        "using namespace std;",                           // 1
        "",                                               // 2
        "vector<vector<int>> adj;",                       // 3
        "vector<bool> visited;",                          // 4
        "vector<int> parent;",                            // 5
        "",                                               // 6
        "void dfs(int u, int p = -1) {",                  // 7
        "  visited[u] = true;             // ← push",     // 8
        "  parent[u] = p;",                               // 9
        "  // เยี่ยม u (process)",                          // 10
        "",                                               // 11
        "  for (int v : adj[u]) {",                       // 12
        "    if (!visited[v]) {           // ← recurse",  // 13
        "      dfs(v, u);",                               // 14
        "    }",                                          // 15
        "  }",                                            // 16
        "  // จบ u (กลับขึ้น parent)       // ← pop",      // 17
        "}",                                              // 18
        "",                                               // 19
        "// เรียกใช้:",                                    // 20
        "// visited.assign(n, false);",                   // 21
        "// parent.assign(n, -1);",                       // 22
        "// dfs(start);",                                 // 23
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="DFS ใช้ memory เท่าไหร่ในกรณีแย่สุด?"
        options={["O(1)", "O(log n)", "O(n) — recursion stack ลึกได้ถึง n", "O(n²)"]}
        answer={2}
        explain="กราฟเป็น chain → recursion ลึก n → stack ใช้ O(n)"
      />
      <Quiz29
        q="DFS ใช้แก้ปัญหาอะไรได้บ้าง?"
        options={[
          "Connected components, cycle detection, topological sort",
          "Shortest path บน weighted graph",
          "MST",
          "Bipartite matching ตรง ๆ"
        ]}
        answer={0}
        explain="DFS ดีกับ traversal-based problems — สำหรับ shortest path/MST ใช้ Dijkstra/Prim"
      />
    </React.Fragment>
  );
};

/* ============================================================
   138 — Dijkstra Animated
============================================================ */
function dijkstraFrames(start = 0) {
  const adj = {};
  G_NODES.forEach(n => adj[n.id] = []);
  G_EDGES.forEach(e => {
    adj[e.u].push({ to: e.v, w: e.w });
    adj[e.v].push({ to: e.u, w: e.w });
  });
  const n = G_NODES.length;
  const dist = {}; G_NODES.forEach(nd => dist[nd.id] = Infinity);
  dist[start] = 0;
  const parent = {};
  const visited = new Set();
  const frames = [];
  // codeLine ชี้ DIJKSTRA_CODE (ดู Lessons29["dijkstra-anim"])
  frames.push({ visited: new Set(), queue: [start], current: -1, dist: { ...dist }, parent: {}, msg: `เริ่ม dist[${G_NODES[start].label}] = 0`, codeLine: 12 });
  for (let iter = 0; iter < n; iter++) {
    let u = -1, best = Infinity;
    for (const nd of G_NODES) {
      if (!visited.has(nd.id) && dist[nd.id] < best) { best = dist[nd.id]; u = nd.id; }
    }
    if (u === -1) break;
    visited.add(u);
    frames.push({ visited: new Set(visited), queue: [], current: u, dist: { ...dist }, parent: { ...parent }, msg: `เลือก ${G_NODES[u].label} (dist=${best}) — ขั้นต่ำใน unvisited`, codeLine: 16 });
    for (const { to: v, w } of adj[u]) {
      if (!visited.has(v) && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        parent[v] = u;
        frames.push({ visited: new Set(visited), queue: [], current: u, dist: { ...dist }, parent: { ...parent }, msg: `relax ${G_NODES[u].label}→${G_NODES[v].label}: dist[${G_NODES[v].label}] = ${dist[v]}`, codeLine: 22 });
      }
    }
  }
  frames.push({ visited: new Set(visited), queue: [], current: -1, dist: { ...dist }, parent: { ...parent }, msg: 'เสร็จสิ้น', codeLine: 27 });
  return frames;
}

Lessons29["dijkstra-anim"] = function () {
  const frames = useM29(() => dijkstraFrames(0), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Dijkstra Animation</div>
        ดู distance ปรับและ priority queue เลือก node ที่ dist ต่ำสุด
      </div>
      <StepperBar p={p} />
      <GraphSvg frame={p.frame} weighted />
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13, minHeight: 36 }}>
        💬 {p.frame.msg}
      </div>

      <h3 style={{ marginTop: 16 }}>Distance Table</h3>
      <table style={{ background: 'var(--bg-2)', borderRadius: 8, fontFamily: 'monospace', width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr>{G_NODES.map(n => <th key={n.id} style={{ padding: 8 }}>{n.label}</th>)}</tr>
        </thead>
        <tbody>
          <tr>
            {G_NODES.map(n => {
              const d = p.frame.dist ? p.frame.dist[n.id] : Infinity;
              return <td key={n.id} style={{ padding: 8, textAlign: 'center', color: d === Infinity ? 'var(--text-3)' : 'var(--accent)' }}>{d === Infinity ? '∞' : d}</td>;
            })}
          </tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: 16 }}>โค้ด Dijkstra (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <queue>",                                       // 0
        "#include <vector>",                                       // 1
        "#include <climits>",                                      // 2
        "using namespace std;",                                    // 3
        "typedef pair<int,int> pii;  // (dist, node)",             // 4
        "",                                                        // 5
        "vector<int> dijkstra(",                                   // 6
        "    vector<vector<pii>>& adj,  // adj[u] = {(v,w),...}",  // 7
        "    int start) {",                                        // 8
        "  int n = adj.size();",                                   // 9
        "  vector<int> dist(n, INT_MAX);",                         // 10
        "  vector<int> parent(n, -1);",                            // 11
        "  dist[start] = 0;             // ← เริ่ม",                // 12
        "  priority_queue<pii, vector<pii>, greater<>> pq;",       // 13
        "  pq.push({0, start});",                                  // 14
        "",                                                        // 15
        "  while (!pq.empty()) {",                                 // 16 ← เลือก u
        "    auto [d, u] = pq.top(); pq.pop();",                   // 17
        "    if (d > dist[u]) continue;  // outdated",             // 18
        "",                                                        // 19
        "    for (auto& [v, w] : adj[u]) {",                       // 20
        "      if (dist[u] + w < dist[v]) {",                      // 21
        "        dist[v] = dist[u] + w;   // ← relax",             // 22
        "        parent[v] = u;",                                  // 23
        "        pq.push({dist[v], v});",                          // 24
        "      }",                                                 // 25
        "    }",                                                   // 26
        "  }",                                                     // 27 ← จบ
        "  return dist;",                                          // 28
        "}",                                                       // 29
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="Dijkstra ทำงานบน graph ที่มี negative edge ได้ไหม?"
        options={[
          "ได้",
          "ไม่ได้ — ใช้ Bellman-Ford แทน",
          "ได้ถ้า DAG",
          "ได้ถ้าใช้ priority queue"
        ]}
        answer={1}
        explain="Dijkstra สมมติเมื่อ pop node ออก = ระยะสั้นสุด — neg edge ทำให้ assumption ผิด"
      />
      <Quiz29
        q="Dijkstra complexity ด้วย binary heap?"
        options={["O(V²)", "O((V+E) log V)", "O(VE)", "O(V + E)"]}
        answer={1}
        explain="แต่ละ node pop ครั้ง = log V, edge push ทั้งหมด ≤ E ครั้ง"
      />
    </React.Fragment>
  );
};

/* ============================================================
   139 — Prim's MST Animated
============================================================ */
function primFrames(start = 0) {
  const adj = {};
  G_NODES.forEach(n => adj[n.id] = []);
  G_EDGES.forEach(e => {
    adj[e.u].push({ to: e.v, w: e.w });
    adj[e.v].push({ to: e.u, w: e.w });
  });
  const visited = new Set([start]);
  const mst = new Set();
  const frames = [];
  let total = 0;
  // codeLine ชี้ PRIM_CODE (ดู Lessons29["prim-anim"])
  frames.push({ visited: new Set(visited), mst: new Set(mst), current: start, msg: `เริ่มที่ ${G_NODES[start].label} — total = 0`, total, codeLine: 14 });
  while (visited.size < G_NODES.length) {
    let best = null;
    for (const u of visited) {
      for (const { to: v, w } of adj[u]) {
        if (!visited.has(v) && (best === null || w < best.w)) {
          best = { u, v, w };
        }
      }
    }
    if (!best) break;
    visited.add(best.v);
    const key = `${Math.min(best.u, best.v)}-${Math.max(best.u, best.v)}`;
    mst.add(key);
    total += best.w;
    frames.push({
      visited: new Set(visited), mst: new Set(mst), current: best.v,
      msg: `เพิ่ม edge ${G_NODES[best.u].label}—${G_NODES[best.v].label} (w=${best.w}) | total = ${total}`,
      total, codeLine: 22
    });
  }
  return frames;
}

Lessons29["prim-anim"] = function () {
  const frames = useM29(() => primFrames(0), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Prim's MST Animation</div>
        ขยาย MST จาก node เริ่มต้น โดยเลือก edge น้ำหนักต่ำสุดที่ออกจาก visited set
      </div>
      <StepperBar p={p} />
      <GraphSvg frame={p.frame} weighted />
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13, minHeight: 36 }}>
        💬 {p.frame.msg}
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด Prim's MST (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <queue>",                                            // 0
        "#include <vector>",                                            // 1
        "using namespace std;",                                         // 2
        "typedef tuple<int,int,int> tup;  // (w, u, v)",                // 3
        "typedef pair<int,int> pii;       // (v, w)",                   // 4
        "",                                                             // 5
        "int prim(",                                                    // 6
        "    vector<vector<pii>>& adj,  // adj[u] = {(v,w),...}",       // 7
        "    int start) {",                                             // 8
        "  int n = adj.size();",                                        // 9
        "  vector<bool> inMST(n, false);",                              // 10
        "  priority_queue<tup, vector<tup>, greater<>> pq;",            // 11
        "  int total = 0;",                                             // 12
        "",                                                             // 13
        "  inMST[start] = true;            // ← เริ่ม",                  // 14
        "  for (auto& [v, w] : adj[start])",                            // 15
        "    pq.push({w, start, v});",                                  // 16
        "",                                                             // 17
        "  while (!pq.empty()) {",                                      // 18
        "    auto [w, u, v] = pq.top(); pq.pop();",                     // 19
        "    if (inMST[v]) continue;",                                  // 20
        "",                                                             // 21
        "    inMST[v] = true;              // ← เพิ่ม edge",             // 22
        "    total += w;",                                              // 23
        "    // add edge (u, v) to MST",                                // 24
        "",                                                             // 25
        "    for (auto& [x, ww] : adj[v])",                             // 26
        "      if (!inMST[x]) pq.push({ww, v, x});",                    // 27
        "  }",                                                          // 28
        "  return total;",                                              // 29
        "}",                                                            // 30
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="Prim's vs Kruskal's MST — ต่างกันยังไง?"
        options={[
          "Prim เริ่มจาก node, Kruskal เริ่มจาก edges sorted",
          "Prim ใช้ DFS, Kruskal ใช้ BFS",
          "Prim ทำงานบน DAG เท่านั้น",
          "เหมือนกันทุกประการ"
        ]}
        answer={0}
        explain="Prim grow tree จาก start; Kruskal sort edges แล้วเลือกถ้าไม่สร้าง cycle (Union-Find)"
      />
      <Quiz29
        q="MST ของ graph ที่ disconnected มีอะไร?"
        options={[
          "มีอยู่เสมอ",
          "ไม่มี — ต้องเป็น Minimum Spanning Forest (1 tree per component)",
          "Compile error",
          "ไม่เกี่ยว"
        ]}
        answer={1}
        explain="MST ต้องการ connected graph ถ้าไม่ — ได้ MSF แทน"
      />
    </React.Fragment>
  );
};

/* ============================================================
   140 — DP Table Fill: LIS (O(n²) DP)
============================================================ */
function lisFrames(a) {
  const n = a.length;
  const dp = new Array(n).fill(1);
  const frames = [];
  // codeLine ชี้ LIS_CODE (ดู Lessons29["dp-lis-anim"])
  frames.push({ dp: [...dp], i: -1, j: -1, msg: 'เริ่ม: ทุก dp[i] = 1 (อย่างน้อยตัวเอง)', codeLine: 7 });
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const updated = a[j] < a[i] && dp[j] + 1 > dp[i];
      if (updated) {
        dp[i] = dp[j] + 1;
      }
      frames.push({ dp: [...dp], i, j, msg: `เปรียบ a[${j}]=${a[j]} < a[${i}]=${a[i]}? ${a[j] < a[i] ? `dp[${i}]=${dp[i]}` : 'ไม่ใช่'}`, codeLine: updated ? 13 : 12 });
    }
  }
  frames.push({ dp: [...dp], i: -1, j: -1, msg: `เสร็จ — LIS = ${Math.max(...dp)}`, codeLine: 19 });
  return frames;
}

Lessons29["dp-lis-anim"] = function () {
  const a = [10, 22, 9, 33, 21, 50, 41, 60];
  const frames = useM29(() => lisFrames(a), []);
  const p = useStepper(frames);
  const max = Math.max(...(p.frame.dp || [1]));
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 LIS DP Fill — O(n²)</div>
        ดู dp[i] = LIS ที่ลงท้ายด้วย a[i] เติมทีละช่อง
      </div>
      <StepperBar p={p} />
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {a.map((v, i) => (
            <div key={i} style={{
              width: 44, textAlign: 'center', padding: 6,
              background: i === p.frame.i ? 'var(--warn)' : i === p.frame.j ? 'var(--accent)' : 'var(--bg-3)',
              color: i === p.frame.i || i === p.frame.j ? '#000' : 'var(--text-0)',
              borderRadius: 6, fontFamily: 'monospace', fontWeight: 600
            }}>{v}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(p.frame.dp || []).map((v, i) => (
            <div key={i} style={{
              width: 44, textAlign: 'center', padding: 6,
              background: 'var(--bg-3)',
              color: v === max ? 'var(--accent-3)' : 'var(--text-1)',
              borderRadius: 6, fontFamily: 'monospace',
              border: v === max ? '2px solid var(--accent-3)' : '1px solid var(--border)'
            }}>{v}</div>
          ))}
        </div>
        <div style={{ marginTop: 8, color: 'var(--text-2)', fontSize: 12 }}>
          แถวบน: array a[] | แถวล่าง: dp[i] = LIS ที่ลงท้าย a[i]
        </div>
      </div>
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13 }}>
        💬 {p.frame.msg}
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด LIS — O(n²) DP (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <vector>",                              // 0
        "#include <algorithm>",                           // 1
        "using namespace std;",                           // 2
        "",                                               // 3
        "// dp[i] = LIS ที่ลงท้ายด้วย a[i]",                // 4
        "int lis(vector<int>& a) {",                      // 5
        "  int n = a.size();",                            // 6
        "  vector<int> dp(n, 1);    // ← เริ่ม dp = 1",   // 7
        "  vector<int> prev(n, -1); // สำหรับ reconstruct",// 8
        "",                                               // 9
        "  for (int i = 1; i < n; i++) {",                // 10
        "    for (int j = 0; j < i; j++) {",              // 11
        "      if (a[j] < a[i] &&",                       // 12 ← compare
        "          dp[j] + 1 > dp[i]) {                                                  // ← update", // 13
        "        dp[i] = dp[j] + 1;",                     // 14
        "        prev[i] = j;",                           // 15
        "      }",                                        // 16
        "    }",                                          // 17
        "  }",                                            // 18
        "  return *max_element(dp.begin(), dp.end()); // ← จบ", // 19
        "}",                                              // 20
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="LIS O(n²) DP จะลดเป็น O(n log n) ได้ยังไง?"
        options={[
          "ใช้ memoization",
          "ใช้ patience sort + binary search (lower_bound)",
          "ใช้ greedy",
          "ลดไม่ได้"
        ]}
        answer={1}
        explain="เก็บ tail[k] = smallest end-element ของ LIS length k+1 → binary search update"
      />
      <Quiz29
        q="dp[i] = ?"
        options={[
          "LIS ของ a[0..i]",
          "LIS ที่ลงท้ายด้วย a[i]",
          "Index ของตัวต่อใน LIS",
          "Length ของ a"
        ]}
        answer={1}
        explain="คำตอบสุดท้าย = max ของ dp[i] ทุก i"
      />
    </React.Fragment>
  );
};

/* ============================================================
   141 — DP Table Fill: LCS
============================================================ */
function lcsFrames(s, t) {
  const m = s.length, n = t.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const frames = [];
  // codeLine ชี้ LCS_CODE (ดู Lessons29["dp-lcs-anim"])
  frames.push({ dp: dp.map(r => [...r]), i: -1, j: -1, msg: 'เริ่ม — แถว 0 และ คอลัมน์ 0 เป็น 0', codeLine: 7 });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s[i - 1] === t[j - 1];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      frames.push({
        dp: dp.map(r => [...r]), i, j,
        msg: match
          ? `${s[i - 1]}=${t[j - 1]} ✓ → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`
          : `${s[i - 1]}≠${t[j - 1]} → max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`,
        codeLine: match ? 12 : 14
      });
    }
  }
  return frames;
}

Lessons29["dp-lcs-anim"] = function () {
  const s = "ABCBDAB", t = "BDCAB";
  const frames = useM29(() => lcsFrames(s, t), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 LCS DP Fill — 2D Table</div>
        s = "{s}", t = "{t}" — fill ทีละช่อง ดูว่าตัวอักษรตรงกันจะ +1
      </div>
      <StepperBar p={p} />
      <div style={{ overflowX: 'auto', background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
        <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace' }}>
          <thead>
            <tr>
              <th style={{ width: 36, padding: 6 }}></th>
              <th style={{ width: 36, padding: 6, color: 'var(--text-3)' }}>ε</th>
              {t.split('').map((c, j) => <th key={j} style={{ width: 36, padding: 6, color: 'var(--accent)' }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {(p.frame.dp || []).map((row, i) => (
              <tr key={i}>
                <th style={{ padding: 6, color: i === 0 ? 'var(--text-3)' : 'var(--accent-2)' }}>{i === 0 ? 'ε' : s[i - 1]}</th>
                {row.map((v, j) => {
                  const isCur = i === p.frame.i && j === p.frame.j;
                  return (
                    <td key={j} style={{
                      padding: 6, textAlign: 'center',
                      background: isCur ? 'var(--warn)' : 'var(--bg-3)',
                      color: isCur ? '#000' : (v > 0 ? 'var(--accent-3)' : 'var(--text-3)'),
                      border: '1px solid var(--border)',
                      fontWeight: isCur ? 700 : 500,
                    }}>{v}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13 }}>
        💬 {p.frame.msg}
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด LCS (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <vector>",                                       // 0
        "#include <string>",                                       // 1
        "#include <algorithm>",                                    // 2
        "using namespace std;",                                    // 3
        "",                                                        // 4
        "int lcs(string s, string t) {",                           // 5
        "  int m = s.size(), n = t.size();",                       // 6
        "  vector<vector<int>> dp(m+1, vector<int>(n+1, 0)); // ← init", // 7
        "",                                                        // 8
        "  for (int i = 1; i <= m; i++) {",                        // 9
        "    for (int j = 1; j <= n; j++) {",                      // 10
        "      if (s[i-1] == t[j-1]) {",                           // 11
        "        dp[i][j] = dp[i-1][j-1] + 1;   // ← match",       // 12
        "      } else {",                                          // 13
        "        dp[i][j] = max(dp[i-1][j],     // ← no match",    // 14
        "                       dp[i][j-1]);",                     // 15
        "      }",                                                 // 16
        "    }",                                                   // 17
        "  }",                                                     // 18
        "  return dp[m][n];  // LCS length",                       // 19
        "}",                                                       // 20
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="LCS ของ 'ABC' และ 'AC' = ?"
        options={["0", "1", "2", "3"]}
        answer={2}
        explain="A และ C เป็น common subsequence — ความยาว 2"
      />
      <Quiz29
        q="LCS complexity?"
        options={["O(n + m)", "O(n · m)", "O((n+m) log n)", "O(n · m · k)"]}
        answer={1}
        explain="DP table ขนาด (n+1) × (m+1) — fill ทุก cell ใน O(1)"
      />
    </React.Fragment>
  );
};

/* ============================================================
   142 — DP Table Fill: 0/1 Knapsack
============================================================ */
function knapsackFrames(w, v, W) {
  const n = w.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const frames = [];
  // codeLine ชี้ KNAPSACK_CODE (ดู Lessons29["dp-knapsack-anim"])
  frames.push({ dp: dp.map(r => [...r]), i: -1, j: -1, msg: 'เริ่ม — แถว 0 ทุกค่า = 0 (ไม่มี item)', codeLine: 7 });
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= W; j++) {
      const overflow = w[i - 1] > j;
      if (overflow) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - w[i - 1]] + v[i - 1]);
      }
      frames.push({
        dp: dp.map(r => [...r]), i, j,
        msg: overflow
          ? `item ${i} (w=${w[i - 1]}) > cap ${j} → ใช้ค่าเดิม = ${dp[i][j]}`
          : `เลือก max(ไม่เอา=${dp[i - 1][j]}, เอา=${dp[i - 1][j - w[i - 1]] + v[i - 1]}) = ${dp[i][j]}`,
        codeLine: overflow ? 13 : 16
      });
    }
  }
  return frames;
}

Lessons29["dp-knapsack-anim"] = function () {
  const w = [2, 3, 4, 5];
  const v = [3, 4, 5, 6];
  const W = 8;
  const frames = useM29(() => knapsackFrames(w, v, W), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 0/1 Knapsack DP Fill</div>
        items: w={JSON.stringify(w)}, v={JSON.stringify(v)}, capacity W={W}
      </div>
      <StepperBar p={p} />
      <div style={{ overflowX: 'auto', background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
        <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ padding: 4, color: 'var(--text-3)' }}>i\\w</th>
              {Array.from({ length: W + 1 }, (_, j) => <th key={j} style={{ padding: 4, width: 30, color: 'var(--accent)' }}>{j}</th>)}
            </tr>
          </thead>
          <tbody>
            {(p.frame.dp || []).map((row, i) => (
              <tr key={i}>
                <th style={{ padding: 4, color: 'var(--accent-2)' }}>{i}</th>
                {row.map((val, j) => {
                  const isCur = i === p.frame.i && j === p.frame.j;
                  return (
                    <td key={j} style={{
                      padding: 4, textAlign: 'center',
                      background: isCur ? 'var(--warn)' : 'var(--bg-3)',
                      color: isCur ? '#000' : (val > 0 ? 'var(--accent-3)' : 'var(--text-3)'),
                      border: '1px solid var(--border)',
                    }}>{val}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13 }}>
        💬 {p.frame.msg}
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด 0/1 Knapsack (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <vector>",                                                 // 0
        "#include <algorithm>",                                              // 1
        "using namespace std;",                                              // 2
        "",                                                                  // 3
        "int knapsack(vector<int>& w, vector<int>& v, int W) {",             // 4
        "  int n = w.size();",                                               // 5
        "  // dp[i][j] = max value โดยใช้ item 1..i, capacity j",             // 6
        "  vector<vector<int>> dp(n+1, vector<int>(W+1, 0)); // ← init",     // 7
        "",                                                                  // 8
        "  for (int i = 1; i <= n; i++) {",                                  // 9
        "    for (int j = 0; j <= W; j++) {",                                // 10
        "      if (w[i-1] > j) {",                                           // 11
        "        // item เกิน capacity — ไม่เอาได้อย่างเดียว",                  // 12
        "        dp[i][j] = dp[i-1][j];               // ← overflow",        // 13
        "      } else {",                                                    // 14
        "        // เลือก max(ไม่เอา, เอา item i)",                            // 15
        "        dp[i][j] = max(dp[i-1][j],          // ← เลือก max",        // 16
        "                       dp[i-1][j-w[i-1]] + v[i-1]);",               // 17
        "      }",                                                           // 18
        "    }",                                                             // 19
        "  }",                                                               // 20
        "  return dp[n][W];",                                                // 21
        "}",                                                                 // 22
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="0/1 Knapsack complexity?"
        options={["O(n)", "O(n · W)", "O(2^n)", "O(n log W)"]}
        answer={1}
        explain="DP table n × W — แต่ละ cell O(1) — pseudo-polynomial เพราะขึ้นกับค่า W"
      />
      <Quiz29
        q="ทำไม 0/1 Knapsack ไม่ใช่ NP-Hard ทั้งที่คล้าย Subset Sum?"
        options={[
          "เพราะมี recurrence",
          "เป็น pseudo-polynomial — O(n · W) — polynomial ใน 'value' ของ W ไม่ใช่ 'bits'",
          "เพราะ items น้อย",
          "ผิด — เป็น NP-Hard"
        ]}
        answer={1}
        explain="ใน strict sense W เป็น exponential ใน input bits — แต่ pseudo-poly ใช้ได้กับ W ขนาดเหมาะสม"
      />
    </React.Fragment>
  );
};

/* ============================================================
   143 — DP Table Fill: Edit Distance
============================================================ */
function editFrames(s, t) {
  const m = s.length, n = t.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  const frames = [];
  // codeLine ชี้ EDIT_CODE (ดู Lessons29["dp-edit-anim"])
  frames.push({ dp: dp.map(r => [...r]), i: -1, j: -1, msg: 'เริ่ม: dp[i][0] = i (ลบทั้งหมด), dp[0][j] = j (เพิ่มทั้งหมด)', codeLine: 10 });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s[i - 1] === t[j - 1];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
      frames.push({
        dp: dp.map(r => [...r]), i, j,
        msg: match
          ? `${s[i - 1]}=${t[j - 1]} → dp = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`
          : `${s[i - 1]}≠${t[j - 1]} → 1 + min(del=${dp[i - 1][j]}, ins=${dp[i][j - 1]}, rep=${dp[i - 1][j - 1]}) = ${dp[i][j]}`,
        codeLine: match ? 16 : 19
      });
    }
  }
  return frames;
}

Lessons29["dp-edit-anim"] = function () {
  const s = "kitten", t = "sitting";
  const frames = useM29(() => editFrames(s, t), []);
  const p = useStepper(frames);
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Edit Distance (Levenshtein) DP Fill</div>
        s = "{s}", t = "{t}" — แปลงด้วย insert/delete/replace
      </div>
      <StepperBar p={p} />
      <div style={{ overflowX: 'auto', background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
        <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace' }}>
          <thead>
            <tr>
              <th style={{ width: 36, padding: 6 }}></th>
              <th style={{ width: 36, padding: 6, color: 'var(--text-3)' }}>ε</th>
              {t.split('').map((c, j) => <th key={j} style={{ width: 36, padding: 6, color: 'var(--accent)' }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {(p.frame.dp || []).map((row, i) => (
              <tr key={i}>
                <th style={{ padding: 6, color: i === 0 ? 'var(--text-3)' : 'var(--accent-2)' }}>{i === 0 ? 'ε' : s[i - 1]}</th>
                {row.map((v, j) => {
                  const isCur = i === p.frame.i && j === p.frame.j;
                  return (
                    <td key={j} style={{
                      padding: 6, textAlign: 'center',
                      background: isCur ? 'var(--warn)' : 'var(--bg-3)',
                      color: isCur ? '#000' : 'var(--accent-3)',
                      border: '1px solid var(--border)',
                      fontWeight: isCur ? 700 : 500,
                    }}>{v}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 13 }}>
        💬 {p.frame.msg}
      </div>

      <h3 style={{ marginTop: 16 }}>โค้ด Edit Distance (เต็ม)</h3>
      <CodeViewToggle code={[
        "#include <vector>",                                          // 0
        "#include <string>",                                          // 1
        "#include <algorithm>",                                       // 2
        "using namespace std;",                                       // 3
        "",                                                           // 4
        "int editDistance(string s, string t) {",                     // 5
        "  int m = s.size(), n = t.size();",                          // 6
        "  vector<vector<int>> dp(m+1, vector<int>(n+1, 0));",        // 7
        "",                                                           // 8
        "  // base: ลบทั้งหมด / เพิ่มทั้งหมด",                            // 9
        "  for (int i = 0; i <= m; i++) dp[i][0] = i; // ← init",     // 10
        "  for (int j = 0; j <= n; j++) dp[0][j] = j;",               // 11
        "",                                                           // 12
        "  for (int i = 1; i <= m; i++) {",                           // 13
        "    for (int j = 1; j <= n; j++) {",                         // 14
        "      if (s[i-1] == t[j-1]) {",                              // 15
        "        dp[i][j] = dp[i-1][j-1];        // ← match (ฟรี)",   // 16
        "      } else {",                                             // 17
        "        // 1 + min(delete, insert, replace)",                // 18
        "        dp[i][j] = 1 + min({                                                  // ← no match", // 19
        "          dp[i-1][j],      // delete s[i-1]",                // 20
        "          dp[i][j-1],      // insert t[j-1]",                // 21
        "          dp[i-1][j-1]     // replace s[i-1] → t[j-1]",      // 22
        "        });",                                                // 23
        "      }",                                                    // 24
        "    }",                                                      // 25
        "  }",                                                        // 26
        "  return dp[m][n];",                                         // 27
        "}",                                                          // 28
      ]} line={p.frame.codeLine} />

      <Quiz29
        q="Edit distance ระหว่าง 'cat' กับ 'cat' เท่าไหร่?"
        options={["0", "1", "3", "4"]}
        answer={0}
        explain="string เดียวกัน — ไม่ต้องแก้เลย"
      />
      <Quiz29
        q="Edit distance ของ 'kitten' กับ 'sitting' = ?"
        options={["2", "3", "5", "7"]}
        answer={1}
        explain="k→s, e→i, +g = 3 operations"
      />
      <Quiz29
        q="Edit distance ใช้ใน application อะไร?"
        options={[
          "Spell checker, DNA alignment, diff (git)",
          "Sorting",
          "Hashing",
          "Compilation"
        ]}
        answer={0}
        explain="Levenshtein ใช้กว้างใน NLP, bioinformatics, version control"
      />
    </React.Fragment>
  );
};

window.LessonsPart29 = Lessons29;
