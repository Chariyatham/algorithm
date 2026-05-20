/* Lessons Part 18 — Advanced Graph: SCC, Articulation Points, Bridges, Bellman-Ford deep */

const { useState: useS18, useMemo: useM18 } = React;
const { Quiz: Quiz18 } = window.LessonComponents;
const { WorkedExample: WE18, CheatSheet: CS18, Pitfalls: PF18 } = window.LearningKit;

const Lessons18 = {};

/* ============================================================
   Shared Viz — SCC (Kosaraju 2-pass)
============================================================ */
function SCCViz() {
  // 6 nodes: 1→2, 2→3, 3→1, 2→4, 4→5, 5→6, 6→4
  // SCCs: {1,2,3} and {4,5,6}
  const nodes = ['1', '2', '3', '4', '5', '6'];
  const edges = [['1','2'],['2','3'],['3','1'],['2','4'],['4','5'],['5','6'],['6','4']];
  const positions = { '1':{x:60,y:70}, '2':{x:140,y:40}, '3':{x:140,y:120}, '4':{x:240,y:70}, '5':{x:340,y:40}, '6':{x:340,y:120} };

  const STEPS = [
    { phase: 1, msg: 'Pass 1: DFS บน G ปกติ — เริ่มที่ 1', visited: ['1'], stack: [], current: '1', transpose: false },
    { phase: 1, msg: 'DFS(1) → visit 2', visited: ['1','2'], stack: [], current: '2', transpose: false },
    { phase: 1, msg: 'DFS(2) → visit 3', visited: ['1','2','3'], stack: [], current: '3', transpose: false },
    { phase: 1, msg: '3→1 (visited) → DFS(3) finish → push', visited: ['1','2','3'], stack: ['3'], current: '3', transpose: false },
    { phase: 1, msg: 'DFS(2) → visit 4', visited: ['1','2','3','4'], stack: ['3'], current: '4', transpose: false },
    { phase: 1, msg: 'DFS(4) → visit 5 → visit 6', visited: ['1','2','3','4','5','6'], stack: ['3'], current: '6', transpose: false },
    { phase: 1, msg: '6→4 (visited) → finish 6,5,4', visited: ['1','2','3','4','5','6'], stack: ['3','6','5','4'], current: null, transpose: false },
    { phase: 1, msg: 'Finish 2, 1', visited: ['1','2','3','4','5','6'], stack: ['3','6','5','4','2','1'], current: null, transpose: false },
    { phase: 2, msg: 'Pass 2: Build G^T (reverse edges) → DFS ตามลำดับ stack', visited: [], stack: ['3','6','5','4','2','1'], current: null, transpose: true },
    { phase: 2, msg: 'Pop 1 → DFS2(1) บน G^T: visit 1, 3, 2 → SCC {1,3,2}', visited: ['1','3','2'], stack: ['3','6','5','4'], current: null, transpose: true, sccs: [['1','2','3']] },
    { phase: 2, msg: 'Pop 2,3 (visited). Pop 4 → DFS2(4): visit 4, 6, 5 → SCC {4,6,5}', visited: ['1','2','3','4','5','6'], stack: [], current: null, transpose: true, sccs: [['1','2','3'],['4','5','6']] },
  ];

  const [step, setStep] = useS18(0);
  const cur = STEPS[step];
  const visitedSet = new Set(cur.visited);
  const displayEdges = cur.transpose ? edges.map(([u, v]) => [v, u]) : edges;
  const sccColors = ['rgba(94,234,212,0.4)', 'rgba(168,139,250,0.4)'];

  const nodeColor = (n) => {
    if (cur.sccs) {
      for (let i = 0; i < cur.sccs.length; i++) if (cur.sccs[i].includes(n)) return sccColors[i];
    }
    if (cur.current === n) return '#fbbf24';
    if (visitedSet.has(n)) return 'rgba(94,234,212,0.25)';
    return 'var(--bg-3)';
  };

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <button onClick={() => setStep(0)}>↺ Reset</button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>▶</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Step {step + 1}/{STEPS.length} · Phase {cur.phase} {cur.transpose ? '(G^T)' : '(G)'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 10 }}>
        <svg width="100%" viewBox="0 0 420 180" style={{ background: 'var(--bg-1)', borderRadius: 6 }}>
          <defs>
            <marker id="scc-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-2)" />
            </marker>
          </defs>
          {displayEdges.map(([u, v], i) => {
            const pu = positions[u], pv = positions[v];
            const dx = pv.x - pu.x, dy = pv.y - pu.y, dist = Math.sqrt(dx*dx + dy*dy);
            const offsetX = (dx / dist) * 20, offsetY = (dy / dist) * 20;
            return <line key={i} x1={pu.x + offsetX} y1={pu.y + offsetY} x2={pv.x - offsetX} y2={pv.y - offsetY} stroke="var(--text-2)" strokeWidth={1.5} markerEnd="url(#scc-arr)" />;
          })}
          {nodes.map(n => (
            <g key={n}>
              <circle cx={positions[n].x} cy={positions[n].y} r={18} fill={nodeColor(n)} stroke="var(--accent-2)" strokeWidth={cur.current === n ? 3 : 2} />
              <text x={positions[n].x} y={positions[n].y + 5} fill="var(--text-0)" fontSize="14" fontWeight="700" textAnchor="middle">{n}</text>
            </g>
          ))}
        </svg>

        <div style={{ background: 'var(--bg-1)', padding: 8, borderRadius: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 700, marginBottom: 4 }}>STACK</div>
          {cur.stack.length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontSize: 12, fontStyle: 'italic' }}>(empty)</div>
          ) : cur.stack.slice().reverse().map((n, i) => (
            <div key={i} style={{ padding: '4px 8px', background: i === 0 ? 'rgba(94,234,212,0.2)' : 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 4, marginBottom: 2, fontFamily: 'monospace', textAlign: 'center', fontWeight: 600 }}>{n}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontSize: 13 }}>
        ► {cur.msg}
      </div>
      {cur.sccs && (
        <div style={{ marginTop: 4, padding: 8, background: 'rgba(168,139,250,0.08)', borderLeft: '3px solid #a78bfa', borderRadius: 4, fontFamily: 'monospace', fontSize: 13 }}>
          ✓ SCCs found: {cur.sccs.map((s, i) => '{' + s.join(',') + '}').join(', ')}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   82 — SCC (TARJAN & KOSARAJU)
============================================================ */
Lessons18["scc"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔗 Strongly Connected Components (SCC)</div>
        ใน <b>directed graph</b>: SCC คือกลุ่ม vertices ที่<b>ไปถึงกันได้สองทาง</b><br/>
        ⟺ มี path u → v และ v → u สำหรับทุกคู่ใน group เดียวกัน
      </div>

      <h3>ทำไมสำคัญ?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Condensation:</b> ย่อ SCC แต่ละอันเป็น single vertex → ได้ <b>DAG</b> (acyclic)</li>
        <li><b>Use case:</b> Implication graph (2-SAT), dependency analysis, web crawling</li>
        <li><b>Topological structure:</b> เห็น "cluster" ของระบบ</li>
      </ul>

      <h3>🎬 Interactive — Kosaraju 2-pass DFS animation</h3>
      <SCCViz />

      <h3>Algorithm 1: Kosaraju's (2 passes DFS)</h3>
      <pre className="code-block">{`function Kosaraju(G):
  // Pass 1: DFS on G, record finish times
  stack = []
  for each vertex v not visited:
    DFS1(v)
  function DFS1(u):
    mark visited
    for each (u → v) in G:
      if !visited[v]: DFS1(v)
    stack.push(u)         // post-order: push when DONE

  // Pass 2: DFS on G^T (transpose), in reverse finish order
  Gt = transpose(G)        // reverse all edges
  while stack not empty:
    u = stack.pop()
    if u not visited2:
      newSCC = []
      DFS2(u, newSCC)
      output newSCC

  function DFS2(u, scc):
    mark visited2
    scc.add(u)
    for each (u → v) in Gt:
      if !visited2[v]: DFS2(v, scc)`}</pre>

      <WE18
        title="Kosaraju Trace"
        problem={`Graph: 1→2, 2→3, 3→1, 2→4, 4→5, 5→6, 6→4
SCCs: {1,2,3}, {4,5,6}`}
        steps={[
          { title: "Pass 1: DFS on G", body: "Start at 1: visit 1, 2, 3 (cycle), then 4, 5, 6\nFinish times: 3, 1, 6, 5, 4, 2 (reverse order in stack)\nStack (top→bottom): 1, 2, 4, 5, 6, 3", why: "Post-order push" },
          { title: "Build G^T", body: "1→3, 3→2, 2→1, 4→2, 5→4, 6→5, 4→6", why: "Reverse all edges" },
          { title: "Pass 2: DFS on G^T in stack order", body: "Pop 1 → DFS2(1): visit 1, 3, 2 (cycle back) → SCC = {1, 3, 2}\nPop 2: visited\nPop 4 → DFS2(4): visit 4, 6, 5 → SCC = {4, 6, 5}\nPop 5, 6, 3: visited", why: "" },
        ]}
        answer="SCCs: {1, 2, 3}, {4, 5, 6} ▢ — O(V + E)"
      />

      <h3>ทำไม Kosaraju ถูก?</h3>
      <p>
        <b>Key insight:</b> ใน G^T การ DFS จาก node ที่มี finish time มากสุด<br/>
        → จะไปได้เฉพาะ SCC ของมันเท่านั้น (ไม่ "หลุด" ไป SCC อื่น)
      </p>
      <p>
        Reason: condensation DAG ใน G^T มี edges ในทิศ <b>opposite</b> ของ condensation DAG ใน G<br/>
        → node ที่ finish หลังสุดใน G อยู่ใน "source SCC" ของ DAG → ใน G^T มันอยู่ใน "sink"
      </p>

      <h3>Algorithm 2: Tarjan's (1 pass DFS, low-link values)</h3>
      <pre className="code-block">{`function Tarjan(G):
  index = 0
  stack = []
  for each vertex v:
    if v.index is undefined: strongconnect(v)

  function strongconnect(u):
    u.index = index
    u.lowlink = index
    index++
    stack.push(u)
    u.onStack = true

    for each (u → v) in G:
      if v.index is undefined:        // tree edge
        strongconnect(v)
        u.lowlink = min(u.lowlink, v.lowlink)
      elif v.onStack:                  // back/cross to current SCC
        u.lowlink = min(u.lowlink, v.index)

    // if u is root of SCC
    if u.lowlink == u.index:
      scc = []
      repeat:
        w = stack.pop()
        w.onStack = false
        scc.add(w)
      until w == u
      output scc`}</pre>

      <h3>Tarjan vs Kosaraju</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Kosaraju</th><th>Tarjan</th></tr></thead>
        <tbody>
          <tr><td>DFS passes</td><td>2</td><td>1</td></tr>
          <tr><td>Need transpose</td><td>Yes</td><td>No</td></tr>
          <tr><td>Constant factor</td><td>Larger</td><td>Smaller (1 pass)</td></tr>
          <tr><td>Implementation</td><td>Easy to understand</td><td>Tricky (low-link)</td></tr>
          <tr><td>Order of SCCs returned</td><td>Reverse topological</td><td>Reverse topological</td></tr>
        </tbody>
      </table>

      <h3>Application: 2-SAT</h3>
      <WE18
        title="2-SAT solved by SCC"
        problem="Given Boolean formula in 2-CNF (each clause has 2 literals) — is it satisfiable?"
        steps={[
          { title: "Build Implication Graph", body: "Each variable x → 2 nodes: x and ¬x\nClause (a ∨ b) → edges ¬a → b และ ¬b → a\n(if ¬a true → b must be true)", why: "Express logical implications" },
          { title: "Run SCC", body: "Find SCCs of implication graph", why: "" },
          { title: "Check Satisfiability", body: "ถ้า x และ ¬x อยู่ใน SCC เดียวกัน → unsatisfiable\nมิฉะนั้น → satisfiable", why: "x ↔ ¬x = ขัดแย้ง" },
          { title: "Find Assignment", body: "ลำดับ SCC ใน reverse topological:\n  x = true ถ้า SCC ของ x มาหลัง SCC ของ ¬x", why: "" },
        ]}
        answer="2-SAT แก้ได้ใน O(V + E) — เร็วมาก! (3-SAT เป็น NP-Complete) ▢"
      />

      <CS18 title="SCC Cheat Sheet" sections={[
        { label: "Kosaraju", value: "2-pass DFS + transpose<br/>O(V + E)" },
        { label: "Tarjan", value: "1-pass DFS + low-link<br/>O(V + E)" },
        { label: "Output", value: "Reverse topological order ของ SCCs" },
        { label: "Use", value: "2-SAT, condensation, dependency, web cycles" },
      ]} />

      <PF18 items={[
        { trap: "ใช้กับ undirected graph", fix: "SCC = directed concept. Undirected = ‘connected components’ — ใช้ BFS/DFS ธรรมดา" },
        { trap: "ใช้ DFS 1 ครั้งใน Kosaraju", fix: "ต้อง 2 ครั้ง — pass 2 ใน G^T ตามลำดับ finish time" },
        { trap: "Tarjan: ใช้ v.lowlink แทน v.index ใน back edge update", fix: "Back edge → ใช้ v.<b>index</b> (จุดที่ v ถูกเจอ), ไม่ใช่ lowlink" },
      ]} />

      <Quiz18 q={{
        question: "ถ้า DAG (acyclic directed graph) — มี SCC กี่อัน?",
        options: ["1 (ทั้งหมดเป็น 1 SCC)", "V (แต่ละ vertex เป็น SCC ของตัวเอง)", "ขึ้นกับ structure", "0"],
        answer: 1,
        explain: "DAG = ไม่มี cycle → ไม่มี ‘ไปและกลับ’ ระหว่าง 2 nodes → SCC แต่ละอันมี vertex เดียว → V SCCs"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   83 — ARTICULATION POINTS & BRIDGES
============================================================ */
Lessons18["articulation"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔪 Articulation Points & Bridges</div>
        <b>Articulation Point (cut vertex):</b> vertex ที่ถ้าลบแล้วทำให้ graph แตกเป็น &gt;1 components<br/>
        <b>Bridge (cut edge):</b> edge ที่ถ้าลบแล้วทำให้ graph แตกเป็น &gt;1 components<br/>
        <i>ใช้: network vulnerability, road systems, biconnected components</i>
      </div>

      <h3>Definitions</h3>
      <p>ใน <b>undirected connected graph</b>:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Articulation point u:</b> removing u disconnects graph</li>
        <li><b>Bridge (u,v):</b> removing edge disconnects graph</li>
        <li><b>Biconnected:</b> graph with no articulation point</li>
        <li><b>2-edge-connected:</b> graph with no bridge</li>
      </ul>

      <h3>Naive O(V·(V+E))</h3>
      <p>ลบทีละ vertex/edge → run BFS/DFS ตรวจ connectivity → ช้า</p>

      <h3>Tarjan's Algorithm — O(V+E) ด้วย Low-Link Values</h3>
      <pre className="code-block">{`disc[u] = discovery time (DFS order)
low[u] = min discovery time reachable from u
         via subtree + ≤1 back edge

DFS(u, parent):
  disc[u] = low[u] = timer++
  children = 0
  for each neighbor v of u:
    if v not visited:
      children++
      DFS(v, u)
      low[u] = min(low[u], low[v])

      // u is articulation point if:
      // 1. u is root AND has > 1 child
      // 2. u is non-root AND low[v] >= disc[u]
      if parent == null && children > 1:
        u is articulation
      if parent != null && low[v] >= disc[u]:
        u is articulation

      // (u, v) is bridge if low[v] > disc[u]
      if low[v] > disc[u]:
        (u, v) is bridge

    elif v != parent:  // back edge
      low[u] = min(low[u], disc[v])`}</pre>

      <WE18
        title="Why low[v] ≥ disc[u] → u is articulation?"
        problem="ทำความเข้าใจ condition"
        steps={[
          { title: "Setup", body: "u มี child v ใน DFS tree\nlow[v] = min reachable time จาก subtree(v)", why: "low บอกว่า subtree(v) ไปได้แค่ไหน upward" },
          { title: "If low[v] ≥ disc[u]", body: "subtree(v) ไปได้สูงสุดถึง u (ไม่เลย)\n→ ไม่มี back edge ไปก่อน u\n→ ลบ u → subtree(v) ตัดขาดจากส่วนบน", why: "ไม่มีทางอ้อม" },
          { title: "If low[v] < disc[u]", body: "subtree(v) ไปได้ถึงบรรพบุรุษของ u\n→ มีทางอ้อม\n→ ลบ u ไม่ตัด subtree(v)", why: "มี alternative path" },
          { title: "Bridge: low[v] > disc[u]", body: "Strict &gt; — ไม่มี back edge ใน subtree(v) ที่ไปถึง u เอง\n→ edge (u,v) เป็น bridge", why: "" },
        ]}
        answer="Low-link values ใช้บอก reachability หลังลบ ▢"
      />

      <h3>Special Case: Root</h3>
      <div className="callout warn">
        <div className="ttl">⚠ Root condition</div>
        Root ของ DFS tree เป็น articulation point ⟺ มี <b>&gt;1 child ใน DFS tree</b><br/>
        (ลบ root → children หลายตัวกลายเป็น disconnected components)
      </div>

      <WE18
        title="Trace: 5-node graph"
        problem={`Edges: (0,1), (1,2), (2,0), (1,3), (3,4)
DFS from 0`}
        steps={[
          { title: "Visit 0 → 1 → 2", body: "disc[0]=0, disc[1]=1, disc[2]=2\nFrom 2, back edge to 0 (visited, not parent) → low[2] = disc[0] = 0\nBacktrack to 1: low[1] = min(low[1], low[2]) = 0", why: "Back edge 2→0" },
          { title: "From 1 → 3 → 4", body: "disc[3]=3, disc[4]=4\nNo back edges → low[4] = 4, low[3] = 4", why: "" },
          { title: "Check 1: child 3", body: "low[3] = 4 ≥ disc[1] = 1 → 1 is articulation ✓\nAlso (1,3) is bridge: low[3]=4 > disc[1]=1 ✓", why: "Removing 1 disconnects {3,4}" },
          { title: "Check (3,4)", body: "low[4]=4 > disc[3]=3 → (3,4) is bridge ✓", why: "" },
          { title: "Root 0", body: "DFS children ของ 0 = 1 only → root has 1 child → not articulation", why: "" },
        ]}
        answer="Articulation points: {1, 3}. Bridges: {(1,3), (3,4)} ▢"
      />

      <h3>Biconnected Components</h3>
      <p>
        BCC = maximal subgraph without articulation point<br/>
        Algorithm: DFS + stack — pop edges เมื่อพบ articulation point → each pop = 1 BCC
      </p>

      <h3>Applications</h3>
      <table className="cmp">
        <thead><tr><th>Domain</th><th>Use</th></tr></thead>
        <tbody>
          <tr><td>Network design</td><td>Bridge = single point of failure</td></tr>
          <tr><td>Road network</td><td>Articulation = critical intersection</td></tr>
          <tr><td>Compiler</td><td>BCC of control flow graph</td></tr>
          <tr><td>Bioinformatics</td><td>Protein interaction networks</td></tr>
        </tbody>
      </table>

      <CS18 title="Cut Vertex/Edge Cheat Sheet" sections={[
        { label: "Articulation (non-root)", value: "low[v] ≥ disc[u] for some child v" },
        { label: "Articulation (root)", value: "≥ 2 children in DFS tree" },
        { label: "Bridge", value: "low[v] &gt; disc[u] (strict)" },
        { label: "Complexity", value: "O(V + E) — single DFS" },
      ]} />

      <PF18 items={[
        { trap: "Update low[u] ด้วย low[v] เมื่อ back edge", fix: "Back edge → ใช้ <b>disc[v]</b> (จุดที่ v ถูกเจอ) ไม่ใช่ low[v]" },
        { trap: "ไม่แยก root case", fix: "Root ใช้ condition พิเศษ (≥ 2 children)" },
        { trap: "ลืมเช็ค parent ใน back edge", fix: "<code>if v != parent</code> มิฉะนั้น tree edge ที่เพิ่งเดินกลับจะถูกนับเป็น back edge" },
      ]} />

      <Quiz18 q={{
        question: "ใน tree (acyclic connected graph) ทุก vertex ที่ไม่ใช่ leaf เป็น?",
        options: ["Articulation point", "Bridge", "Root", "Cycle"],
        answer: 0,
        explain: "Internal vertex ของ tree = articulation point เสมอ (ลบแล้วแตกแน่นอน). Edges ใน tree ทุกเส้น = bridge"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   84 — BELLMAN-FORD DEEP DIVE
============================================================ */
Lessons18["bellman-ford-deep"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔁 Bellman-Ford Deep Dive</div>
        Shortest path ใน weighted graph ที่<b>มี negative edges</b> ได้<br/>
        <b>+ Detect negative cycles</b> (Dijkstra ทำไม่ได้)
      </div>

      <h3>Algorithm</h3>
      <pre className="code-block">{`function BellmanFord(G, s):
  dist[v] = ∞ for all v
  dist[s] = 0
  parent[v] = null

  // Relax all edges V-1 times
  for i = 1 to V - 1:
    for each edge (u, v, w) in E:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        parent[v] = u

  // Detect negative cycle
  for each edge (u, v, w) in E:
    if dist[u] + w < dist[v]:
      // Negative cycle reachable from s
      return null

  return dist, parent`}</pre>

      <h3>ทำไม V-1 รอบ?</h3>
      <WE18
        title="Proof of correctness"
        problem="พิสูจน์ว่า V-1 iterations พอ (ถ้าไม่มี negative cycle)"
        steps={[
          { title: "Claim", body: "หลัง k iterations: dist[v] = shortest path จาก s ถึง v ที่ใช้ ≤ k edges", why: "Induction hypothesis" },
          { title: "Base (k=0)", body: "dist[s]=0, อื่น = ∞ → path 0 edges จาก s = s เอง ✓", why: "" },
          { title: "Inductive step (k → k+1)", body: "หลัง k iterations: dist ≤ shortest path k edges\nIteration k+1 relax ทุก edge\nสำหรับ vertex v ที่ shortest path มี k+1 edges = (s → ... → u → v):\n  dist[u] correct after k iterations\n  relaxing (u,v): dist[v] = dist[u] + w  ✓", why: "Induction" },
          { title: "Why V-1 iterations?", body: "Shortest path ใด ๆ ≤ V-1 edges (ถ้ายาวกว่า → ซ้ำ vertex → cycle → optimization ออก cycle ได้ ถ้าไม่ negative)\n→ V-1 iterations พอ", why: "" },
          { title: "Negative cycle detection", body: "หลัง V-1 iterations แล้ว ยังมี relaxation ที่ลด dist ได้\n→ มี cycle ที่ใส่เข้าทำให้ path สั้นลง\n→ negative cycle reachable", why: "Cycle ทำให้ relax ไม่หยุด" },
        ]}
        answer="V-1 iterations พอเสมอ ถ้าไม่มี negative cycle ▢"
      />

      <h3>Complexity</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Time</th><th>Space</th></tr></thead>
        <tbody>
          <tr><td>Bellman-Ford</td><td>O(V · E)</td><td>O(V)</td></tr>
          <tr><td>Dijkstra (min-heap)</td><td>O((V+E) log V)</td><td>O(V)</td></tr>
          <tr><td>SPFA (Shortest Path Faster Algorithm)</td><td>Avg O(E), worst O(VE)</td><td>O(V)</td></tr>
          <tr><td>Floyd-Warshall (all pairs)</td><td>O(V³)</td><td>O(V²)</td></tr>
        </tbody>
      </table>

      <h3>Bellman-Ford vs Dijkstra</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Bellman-Ford</th><th>Dijkstra</th></tr></thead>
        <tbody>
          <tr><td>Negative weights</td><td>✓ ได้</td><td>✗ ไม่ได้</td></tr>
          <tr><td>Negative cycle detection</td><td>✓ ได้</td><td>✗</td></tr>
          <tr><td>Speed</td><td>ช้ากว่า O(VE)</td><td>เร็ว O((V+E) log V)</td></tr>
          <tr><td>Distributed?</td><td>✓ (RIP routing)</td><td>ลำบาก</td></tr>
        </tbody>
      </table>

      <h3>Application 1: Currency Arbitrage</h3>
      <WE18
        title="หา arbitrage opportunity"
        problem="Currencies A, B, C — exchange rates → กำไรจากการเปลี่ยนเงิน?"
        steps={[
          { title: "Build Graph", body: "Vertex = currency\nEdge weight = -log(rate)\n(A → B with rate r → weight = -log(r))", why: "Product of rates &gt; 1 ⟺ sum of -log rates &lt; 0 (negative cycle!)" },
          { title: "Run Bellman-Ford", body: "Detect negative cycle = arbitrage exists\nCycle = sequence of trades ที่ให้กำไร", why: "" },
          { title: "Time", body: "O(V·E) — fast enough for small currency markets", why: "" },
        ]}
        answer="Negative cycle = arbitrage opportunity ▢"
      />

      <h3>Application 2: Constraint Systems</h3>
      <p>
        Difference constraints: x_j - x_i ≤ b_ij<br/>
        → สร้าง graph: edge from i → j weight b_ij<br/>
        → Shortest path from dummy source = feasible solution<br/>
        → Negative cycle = infeasible
      </p>

      <h3>SPFA Optimization</h3>
      <pre className="code-block">{`function SPFA(G, s):
  dist[s] = 0; queue = [s]; inQueue[s] = true
  while queue not empty:
    u = queue.dequeue()
    inQueue[u] = false
    for each (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        if not inQueue[v]:
          queue.enqueue(v); inQueue[v] = true
  // SPFA is heuristic — worst case still O(VE)`}</pre>

      <CS18 title="Bellman-Ford Cheat Sheet" sections={[
        { label: "Use", value: "Negative weights<br/>Negative cycle detection<br/>Distributed routing" },
        { label: "Time", value: "O(V · E)" },
        { label: "Correctness", value: "V-1 iterations → shortest path ≤ V-1 edges" },
        { label: "Cycle Detection", value: "Iteration V — ถ้า relax ได้อีก → negative cycle" },
      ]} />

      <PF18 items={[
        { trap: "ใช้ Dijkstra กับ negative edges", fix: "Dijkstra <b>ผิด</b> เมื่อมี negative edge — ใช้ BF" },
        { trap: "Detect cycle ที่ไม่ reachable จาก s", fix: "BF detect แค่ cycle ที่ reachable — ต้องใส่ super-source ที่เชื่อมทุก vertex ถ้าต้องการครอบคลุม" },
        { trap: "หยุดหลัง V-1 → ใช้ dist ที่ไม่ valid ถ้ามี cycle", fix: "ต้องเช็ค cycle ก่อนใช้ dist" },
      ]} />

      <Quiz18 q={{
        question: "ถ้า graph มี V = 100 vertices และ E = 5000 edges — Bellman-Ford ทำงานในเวลาเท่าใด?",
        options: ["50,000", "500,000", "5,000,000", "50,000,000"],
        answer: 1,
        explain: "O(V · E) = 100 × 5000 = 500,000 operations"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart18 = Lessons18;
