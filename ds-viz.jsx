/* Data structures, tree, graph & DP visualizers */

const { useState: useStateDS, useEffect: useEffectDS, useMemo: useMemoDS } = React;

/* ===== Stack visualizer ===== */
function StackViz() {
  const [stack, setStack] = useStateDS([12, 7, 25]);
  const [val, setVal] = useStateDS("");
  const [highlight, setHighlight] = useStateDS(null);
  const [msg, setMsg] = useStateDS("");

  const push = () => {
    const n = parseInt(val);
    if (Number.isNaN(n)) return;
    setStack(s => [...s, n]);
    setHighlight(stack.length);
    setMsg(`Push ${n}`);
    setVal("");
    setTimeout(() => setHighlight(null), 600);
  };
  const pop = () => {
    if (!stack.length) { setMsg("Stack is empty!"); return; }
    setHighlight(stack.length - 1);
    setMsg(`Pop ${stack[stack.length - 1]}`);
    setTimeout(() => { setStack(s => s.slice(0, -1)); setHighlight(null); }, 350);
  };

  return (
    <div className="viz">
      <div className="viz-toolbar">
        <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="value" style={{ width: 80 }} />
        <button className="btn btn-primary btn-sm" onClick={push}>Push</button>
        <button className="btn btn-ghost btn-sm" onClick={pop}>Pop</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setStack([]); setMsg("Cleared"); }}>Clear</button>
        <div className="spacer" />
        <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{msg}</span>
      </div>
      <div className="viz-stage">
        <div className="stack-viz">
          {stack.map((v, i) => (
            <div key={i} className={"cell " + (i === highlight ? "cursor" : "")} style={{ width: 80 }}>
              {v}
              {i === stack.length - 1 && <span className="cell-label" style={{ right: -42, top: '50%', left: 'auto', transform: 'translateY(-50%)' }}>← top</span>}
            </div>
          ))}
          <div className="stack-base" />
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>base</div>
        </div>
      </div>
      <VarsPanel vars={{ size: stack.length, top: stack.length ? stack[stack.length - 1] : '—' }} />
    </div>
  );
}

/* ===== Queue visualizer ===== */
function QueueViz() {
  const [q, setQ] = useStateDS([3, 8, 14]);
  const [val, setVal] = useStateDS("");
  const [hi, setHi] = useStateDS(null);
  const [msg, setMsg] = useStateDS("");

  const enq = () => {
    const n = parseInt(val);
    if (Number.isNaN(n)) return;
    setQ(s => [...s, n]); setHi(q.length); setVal("");
    setMsg(`Enqueue ${n}`);
    setTimeout(() => setHi(null), 500);
  };
  const deq = () => {
    if (!q.length) { setMsg("Queue is empty!"); return; }
    setHi(0); setMsg(`Dequeue ${q[0]}`);
    setTimeout(() => { setQ(s => s.slice(1)); setHi(null); }, 350);
  };

  return (
    <div className="viz">
      <div className="viz-toolbar">
        <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="value" style={{ width: 80 }} />
        <button className="btn btn-primary btn-sm" onClick={enq}>Enqueue</button>
        <button className="btn btn-ghost btn-sm" onClick={deq}>Dequeue</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setQ([]); setMsg("Cleared"); }}>Clear</button>
        <div className="spacer" />
        <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{msg}</span>
      </div>
      <div className="viz-stage">
        <div className="queue-viz">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginRight: 6 }}>front →</span>
          {q.map((v, i) => (
            <div key={i} className={"cell " + (i === hi ? "cursor" : "")} style={{ width: 56 }}>{v}</div>
          ))}
          {!q.length && <span style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>empty</span>}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent-2)', marginLeft: 6 }}>← rear</span>
        </div>
      </div>
      <VarsPanel vars={{ size: q.length, front: q[0] ?? '—', rear: q[q.length - 1] ?? '—' }} />
    </div>
  );
}

/* ===== Linked List visualizer ===== */
function LinkedListViz() {
  const [list, setList] = useStateDS([10, 20, 30]);
  const [val, setVal] = useStateDS("");
  const [pos, setPos] = useStateDS(0);
  const [hi, setHi] = useStateDS(null);
  const [msg, setMsg] = useStateDS("");

  const insert = () => {
    const n = parseInt(val);
    if (Number.isNaN(n)) return;
    const p = Math.max(0, Math.min(list.length, parseInt(pos) || 0));
    const next = [...list.slice(0, p), n, ...list.slice(p)];
    setList(next); setHi(p); setVal("");
    setMsg(`Insert ${n} at index ${p}`);
    setTimeout(() => setHi(null), 700);
  };
  const remove = () => {
    const p = Math.max(0, Math.min(list.length - 1, parseInt(pos) || 0));
    if (!list.length) return;
    setHi(p); setMsg(`Delete index ${p} (value ${list[p]})`);
    setTimeout(() => { setList(l => l.filter((_, i) => i !== p)); setHi(null); }, 400);
  };

  return (
    <div className="viz">
      <div className="viz-toolbar">
        <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="value" style={{ width: 70 }} />
        <input type="number" value={pos} onChange={e => setPos(e.target.value)} placeholder="idx" style={{ width: 60 }} />
        <button className="btn btn-primary btn-sm" onClick={insert}>Insert</button>
        <button className="btn btn-ghost btn-sm" onClick={remove}>Delete</button>
        <div className="spacer" />
        <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{msg}</span>
      </div>
      <div className="viz-stage">
        <div className="ll-viz">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>head →</span>
          {list.map((v, i) => (
            <React.Fragment key={i}>
              <div className={"ll-node " + (i === hi ? "active" : "")}>
                <div className="ll-data">{v}</div>
                <div className="ll-next">{i < list.length - 1 ? '•' : '∅'}</div>
              </div>
              {i < list.length - 1 && <span className="ll-arrow">→</span>}
            </React.Fragment>
          ))}
          {!list.length && <span style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 12 }}>empty list</span>}
        </div>
      </div>
      <VarsPanel vars={{ length: list.length, head: list[0] ?? '—' }} />
    </div>
  );
}

/* ===== Hash Table visualizer ===== */
function HashViz() {
  const SIZE = 7;
  const [buckets, setBuckets] = useStateDS(Array.from({ length: SIZE }, () => []));
  const [k, setK] = useStateDS("");
  const [v, setV] = useStateDS("");
  const [hi, setHi] = useStateDS(null);
  const [msg, setMsg] = useStateDS("");

  const hashFn = (key) => {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % SIZE;
    return h;
  };
  const put = () => {
    if (!k) return;
    const h = hashFn(k);
    setBuckets(bs => {
      const nb = bs.map(b => [...b]);
      const exist = nb[h].findIndex(e => e.k === k);
      if (exist >= 0) nb[h][exist] = { k, v };
      else nb[h].push({ k, v });
      return nb;
    });
    setHi(h); setMsg(`hash("${k}") = ${h}`);
    setTimeout(() => setHi(null), 800);
    setK(""); setV("");
  };
  const del = () => {
    if (!k) return;
    const h = hashFn(k);
    setBuckets(bs => bs.map((b, i) => i === h ? b.filter(e => e.k !== k) : b));
    setHi(h); setMsg(`Delete "${k}" from bucket ${h}`);
    setTimeout(() => setHi(null), 700);
    setK("");
  };

  return (
    <div className="viz">
      <div className="viz-toolbar">
        <input type="text" value={k} onChange={e => setK(e.target.value)} placeholder="key" style={{ width: 80 }} />
        <input type="text" value={v} onChange={e => setV(e.target.value)} placeholder="value" style={{ width: 80 }} />
        <button className="btn btn-primary btn-sm" onClick={put}>Put</button>
        <button className="btn btn-ghost btn-sm" onClick={del}>Delete</button>
        <div className="spacer" />
        <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{msg}</span>
      </div>
      <div className="viz-stage">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: 480 }}>
          {buckets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="cell" style={{ width: 36, background: i === hi ? 'var(--warn)' : 'var(--bg-3)', color: i === hi ? '#0a0e14' : 'var(--text-2)' }}>{i}</div>
              <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {b.map((e, j) => (
                  <div key={j} className="ll-node" style={{ borderColor: i === hi ? 'var(--accent)' : 'var(--border)' }}>
                    <div className="ll-data" style={{ fontSize: 12 }}>{e.k}: <span style={{ color: 'var(--accent)' }}>{e.v}</span></div>
                  </div>
                ))}
                {!b.length && <span style={{ color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 11 }}>—</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Tree (BST) visualizer ===== */
function bstInsert(root, v) {
  if (!root) return { v, l: null, r: null };
  if (v < root.v) root.l = bstInsert(root.l, v);
  else if (v > root.v) root.r = bstInsert(root.r, v);
  return root;
}
function bstSearch(root, v, path = []) {
  if (!root) return path;
  path.push(root.v);
  if (v === root.v) return path;
  if (v < root.v) return bstSearch(root.l, v, path);
  return bstSearch(root.r, v, path);
}

function layoutTree(root) {
  // Returns { positions: { v: {x,y} }, edges: [[v1,v2]] }
  const positions = {};
  const edges = [];
  const W = 720, H = 280;
  function rec(node, lo, hi, depth) {
    if (!node) return;
    const x = (lo + hi) / 2;
    const y = 30 + depth * 60;
    positions[node.v] = { x, y };
    if (node.l) { edges.push([node.v, node.l.v]); rec(node.l, lo, x, depth + 1); }
    if (node.r) { edges.push([node.v, node.r.v]); rec(node.r, x, hi, depth + 1); }
  }
  rec(root, 30, W - 30, 0);
  return { positions, edges, W, H };
}

function TreeViz() {
  const [root, setRoot] = useStateDS(() => {
    let r = null;
    [50, 30, 70, 20, 40, 60, 80, 10, 35].forEach(v => { r = bstInsert(r, v); });
    return r;
  });
  const [val, setVal] = useStateDS("");
  const [search, setSearch] = useStateDS("");
  const [path, setPath] = useStateDS([]);
  const [msg, setMsg] = useStateDS("");

  const insert = () => {
    const n = parseInt(val);
    if (Number.isNaN(n)) return;
    setRoot(r => {
      const copy = JSON.parse(JSON.stringify(r));
      return bstInsert(copy, n);
    });
    setMsg(`Insert ${n}`); setVal(""); setPath([]);
  };
  const doSearch = async () => {
    const n = parseInt(search);
    if (Number.isNaN(n) || !root) return;
    const p = bstSearch(root, n, []);
    setPath([]);
    for (let i = 0; i < p.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setPath(p.slice(0, i + 1));
    }
    setMsg(p[p.length - 1] === n ? `Found ${n}!` : `${n} not found`);
  };

  const layout = useMemoDS(() => root ? layoutTree(root) : null, [root]);

  return (
    <div className="viz">
      <div className="viz-toolbar">
        <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="value" style={{ width: 70 }} />
        <button className="btn btn-primary btn-sm" onClick={insert}>Insert</button>
        <input type="number" value={search} onChange={e => setSearch(e.target.value)} placeholder="search" style={{ width: 70 }} />
        <button className="btn btn-ghost btn-sm" onClick={doSearch}>Search</button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setRoot(null); setPath([]); setMsg("Cleared"); }}>Clear</button>
        <div className="spacer" />
        <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--mono)' }}>{msg}</span>
      </div>
      <div className="viz-stage" style={{ padding: '20px 12px' }}>
        {layout ? (
          <svg className="tree-svg" viewBox={`0 0 ${layout.W} ${Math.max(layout.H, 60 + Object.keys(layout.positions).length * 20)}`}>
            {layout.edges.map(([a, b], i) => {
              const p1 = layout.positions[a], p2 = layout.positions[b];
              const onPath = path.includes(a) && path.includes(b) && Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;
              return <line key={i} className={"tree-edge " + (onPath ? "path" : "")} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
            })}
            {Object.entries(layout.positions).map(([v, p]) => {
              const inPath = path.includes(parseInt(v));
              const isLast = path[path.length - 1] === parseInt(v);
              return (
                <g key={v}>
                  <circle
                    cx={p.x} cy={p.y} r={18}
                    className="tree-node-circle"
                    fill={isLast ? 'var(--accent-3)' : (inPath ? 'var(--accent)' : 'var(--bg-3)')}
                    stroke={inPath ? 'var(--accent)' : 'var(--border)'}
                    strokeWidth={inPath ? 2 : 1.5}
                  />
                  <text x={p.x} y={p.y} className="tree-node-text" fill={isLast || inPath ? '#0a0e14' : 'var(--text-0)'}>{v}</text>
                </g>
              );
            })}
          </svg>
        ) : <div className="empty">Empty tree — insert a value</div>}
      </div>
      <VarsPanel vars={{ path: path.join(' → ') || '—', depth: path.length }} />
    </div>
  );
}

/* ===== Tree Traversal player ===== */
function TraversalViz() {
  // Fixed tree
  const tree = useMemoDS(() => {
    let r = null;
    [50, 30, 70, 20, 40, 60, 80].forEach(v => { r = bstInsert(r, v); });
    return r;
  }, []);
  const [type, setType] = useStateDS("inorder");

  const frames = useMemoDS(() => {
    const out = [];
    const visited = [];
    function pre(node) {
      if (!node) return;
      visited.push(node.v); out.push({ visited: [...visited], current: node.v });
      pre(node.l); pre(node.r);
    }
    function ino(node) {
      if (!node) return;
      ino(node.l);
      visited.push(node.v); out.push({ visited: [...visited], current: node.v });
      ino(node.r);
    }
    function pos(node) {
      if (!node) return;
      pos(node.l); pos(node.r);
      visited.push(node.v); out.push({ visited: [...visited], current: node.v });
    }
    if (type === "preorder") pre(tree);
    else if (type === "inorder") ino(tree);
    else pos(tree);
    return out;
  }, [type]);

  const player = usePlayer(() => frames, [frames]);
  const f = player.frame || { visited: [], current: null };
  const layout = layoutTree(tree);

  return (
    <div className="viz">
      <PlayerToolbar player={player} extraLeft={
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="preorder">Pre-order (Root, L, R)</option>
          <option value="inorder">In-order (L, Root, R)</option>
          <option value="postorder">Post-order (L, R, Root)</option>
        </select>
      } />
      <div className="viz-stage" style={{ flexDirection: 'column', gap: 12 }}>
        <svg className="tree-svg" viewBox={`0 0 ${layout.W} ${layout.H}`} style={{ height: 220 }}>
          {layout.edges.map(([a, b], i) => {
            const p1 = layout.positions[a], p2 = layout.positions[b];
            return <line key={i} className="tree-edge" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
          })}
          {Object.entries(layout.positions).map(([v, p]) => {
            const visited = f.visited.includes(parseInt(v));
            const isCurrent = f.current === parseInt(v);
            return (
              <g key={v}>
                <circle
                  cx={p.x} cy={p.y} r={18}
                  fill={isCurrent ? 'var(--warn)' : (visited ? 'var(--accent-3)' : 'var(--bg-3)')}
                  stroke={isCurrent ? 'var(--warn)' : 'var(--border)'}
                  strokeWidth={1.5}
                />
                <text x={p.x} y={p.y} className="tree-node-text" fill={isCurrent || visited ? '#0a0e14' : 'var(--text-0)'}>{v}</text>
              </g>
            );
          })}
        </svg>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text-1)' }}>
          Visited: <span style={{ color: 'var(--accent-3)' }}>[{f.visited.join(', ')}]</span>
        </div>
      </div>
    </div>
  );
}

/* ===== Graph (BFS / DFS / Dijkstra) ===== */
const SAMPLE_GRAPH = {
  nodes: [
    { id: 'A', x: 100, y: 80 },
    { id: 'B', x: 280, y: 50 },
    { id: 'C', x: 460, y: 100 },
    { id: 'D', x: 180, y: 200 },
    { id: 'E', x: 380, y: 220 },
    { id: 'F', x: 560, y: 230 },
    { id: 'G', x: 280, y: 320 },
  ],
  edges: [
    ['A', 'B', 4], ['A', 'D', 2], ['B', 'C', 3], ['B', 'E', 5],
    ['C', 'F', 2], ['D', 'E', 1], ['D', 'G', 6], ['E', 'F', 4], ['E', 'G', 3],
  ]
};

function adj(graph, weighted = false) {
  const m = {};
  graph.nodes.forEach(n => m[n.id] = []);
  graph.edges.forEach(([a, b, w]) => {
    m[a].push(weighted ? { to: b, w } : b);
    m[b].push(weighted ? { to: a, w } : a);
  });
  return m;
}

function genBFS(graph, start) {
  const A = adj(graph);
  const frames = [];
  const visited = new Set([start]);
  const queue = [start];
  const parent = {};
  frames.push({ visited: [...visited], queue: [...queue], current: null, edges: [] });
  while (queue.length) {
    const u = queue.shift();
    frames.push({ visited: [...visited], queue: [...queue], current: u, edges: edgesFromParent(parent) });
    for (const v of A[u]) {
      if (!visited.has(v)) {
        visited.add(v); queue.push(v); parent[v] = u;
        frames.push({ visited: [...visited], queue: [...queue], current: u, neighbor: v, edges: edgesFromParent(parent) });
      }
    }
  }
  return frames;
}
function genDFS(graph, start) {
  const A = adj(graph);
  const frames = [];
  const visited = new Set();
  const stack = [start];
  const parent = {};
  frames.push({ visited: [], stack: [...stack], current: null, edges: [] });
  while (stack.length) {
    const u = stack.pop();
    if (visited.has(u)) continue;
    visited.add(u);
    frames.push({ visited: [...visited], stack: [...stack], current: u, edges: edgesFromParent(parent) });
    for (const v of A[u].slice().reverse()) {
      if (!visited.has(v)) { stack.push(v); parent[v] = u; }
    }
  }
  return frames;
}
function genDijkstra(graph, start) {
  const A = adj(graph, true);
  const frames = [];
  const dist = {}; const prev = {};
  graph.nodes.forEach(n => dist[n.id] = Infinity);
  dist[start] = 0;
  const visited = new Set();
  frames.push({ dist: { ...dist }, visited: [], current: null, edges: [] });
  while (visited.size < graph.nodes.length) {
    let u = null, best = Infinity;
    for (const n of graph.nodes) if (!visited.has(n.id) && dist[n.id] < best) { best = dist[n.id]; u = n.id; }
    if (u === null) break;
    visited.add(u);
    frames.push({ dist: { ...dist }, visited: [...visited], current: u, edges: edgesFromParent(prev) });
    for (const { to, w } of A[u]) {
      if (visited.has(to)) continue;
      if (dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w; prev[to] = u;
        frames.push({ dist: { ...dist }, visited: [...visited], current: u, relaxing: to, edges: edgesFromParent(prev) });
      }
    }
  }
  return frames;
}
function edgesFromParent(parent) {
  return Object.entries(parent).map(([c, p]) => [p, c]);
}

function GraphViz({ algo = "bfs" }) {
  const [start, setStart] = useStateDS('A');
  const frames = useMemoDS(() => {
    if (algo === "bfs") return genBFS(SAMPLE_GRAPH, start);
    if (algo === "dfs") return genDFS(SAMPLE_GRAPH, start);
    return genDijkstra(SAMPLE_GRAPH, start);
  }, [algo, start]);
  const player = usePlayer(() => frames, [frames]);
  const f = player.frame || {};

  const visitedSet = new Set(f.visited || []);
  const pathEdges = new Set((f.edges || []).map(([a, b]) => a + '-' + b).concat((f.edges || []).map(([a, b]) => b + '-' + a)));

  return (
    <div className="viz">
      <PlayerToolbar player={player} extraLeft={
        <div className="ctrl-group">
          <span style={{ fontSize: 11 }}>Start</span>
          <select value={start} onChange={e => setStart(e.target.value)}>
            {SAMPLE_GRAPH.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
        </div>
      } />
      <div className="viz-stage" style={{ padding: 12 }}>
        <svg className="graph-svg" viewBox="0 0 660 380">
          {SAMPLE_GRAPH.edges.map(([a, b, w], i) => {
            const na = SAMPLE_GRAPH.nodes.find(n => n.id === a);
            const nb = SAMPLE_GRAPH.nodes.find(n => n.id === b);
            const onPath = pathEdges.has(a + '-' + b);
            return (
              <g key={i}>
                <line className={"graph-edge " + (onPath ? "path" : "")} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} />
                {algo === "dijkstra" && <text className="graph-edge-label" x={(na.x + nb.x) / 2} y={(na.y + nb.y) / 2 - 4}>{w}</text>}
              </g>
            );
          })}
          {SAMPLE_GRAPH.nodes.map(n => {
            const visited = visitedSet.has(n.id);
            const isCurrent = f.current === n.id;
            const dist = (f.dist && f.dist[n.id] !== undefined) ? f.dist[n.id] : null;
            return (
              <g key={n.id}>
                <circle
                  cx={n.x} cy={n.y} r={20}
                  fill={isCurrent ? 'var(--warn)' : (visited ? 'var(--accent-3)' : 'var(--bg-3)')}
                  stroke={isCurrent ? 'var(--warn)' : 'var(--border)'}
                  strokeWidth={1.5}
                />
                <text x={n.x} y={n.y} className="graph-node-text" fill={isCurrent || visited ? '#0a0e14' : 'var(--text-0)'}>{n.id}</text>
                {algo === "dijkstra" && dist !== null && (
                  <text x={n.x} y={n.y - 28} className="graph-edge-label" fill="var(--accent)" textAnchor="middle">
                    {dist === Infinity ? '∞' : dist}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="viz-info">
        {algo === "bfs" && <span>Queue:<b>[{(f.queue || []).join(', ')}]</b></span>}
        {algo === "dfs" && <span>Stack:<b>[{(f.stack || []).join(', ')}]</b></span>}
        <span>Visited:<b>[{(f.visited || []).join(', ')}]</b></span>
        <span>Current:<b>{f.current ?? '—'}</b></span>
      </div>
    </div>
  );
}

/* ===== DP: Fibonacci memo viz ===== */
function FibDPViz() {
  const [n, setN] = useStateDS(8);

  const frames = useMemoDS(() => {
    const memo = Array(n + 1).fill(null);
    const out = [];
    function fib(i, depth = 0) {
      if (memo[i] !== null) {
        out.push({ memo: [...memo], current: i, action: 'hit', depth });
        return memo[i];
      }
      out.push({ memo: [...memo], current: i, action: 'enter', depth });
      if (i <= 1) {
        memo[i] = i;
        out.push({ memo: [...memo], current: i, action: 'base', depth });
        return i;
      }
      const a = fib(i - 1, depth + 1);
      const b = fib(i - 2, depth + 1);
      memo[i] = a + b;
      out.push({ memo: [...memo], current: i, deps: [i - 1, i - 2], action: 'compute', depth });
      return memo[i];
    }
    fib(n);
    return out;
  }, [n]);

  const player = usePlayer(() => frames, [frames]);
  const f = player.frame || { memo: [], current: null };

  return (
    <div className="viz">
      <PlayerToolbar player={player} extraLeft={
        <div className="ctrl-group">
          <span style={{ fontSize: 11 }}>n</span>
          <input type="number" value={n} min="2" max="14" onChange={e => setN(Math.max(2, Math.min(14, parseInt(e.target.value) || 8)))} style={{ width: 50 }} />
        </div>
      } />
      <div className="viz-stage" style={{ flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-2)' }}>memo[i] for i = 0..{n}</div>
        <div className="dp-grid" style={{ gridTemplateColumns: `repeat(${n + 1}, 1fr)` }}>
          {(f.memo || []).map((v, i) => {
            const isCurrent = f.current === i;
            const isDep = (f.deps || []).includes(i);
            const isFinal = i === n && v !== null && f.action === 'compute';
            return (
              <div key={i} className={"dp-cell " + (isFinal ? 'final' : isCurrent ? 'current' : isDep ? 'dependency' : (v !== null ? 'computed' : ''))}>
                {v === null ? '—' : v}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n + 1}, 1fr)`, gap: 3, marginTop: -8 }}>
          {Array.from({ length: n + 1 }).map((_, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{i}</div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-1)' }}>
          fib({f.current ?? '—'}) {f.action === 'hit' ? '✓ memo hit' : f.action === 'base' ? '= base case' : f.action === 'compute' ? '= memo[i-1] + memo[i-2]' : ''}
        </div>
      </div>
    </div>
  );
}

window.DSVisualizers = { StackViz, QueueViz, LinkedListViz, HashViz, TreeViz, TraversalViz, GraphViz, FibDPViz };
