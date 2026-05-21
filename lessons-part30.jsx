/* Lessons Part 30 — Interactive Tools (Expanded)
   Custom Graph Editor, Manual Trace (7 algos), Fill-in DP (6 problems) */

const { useState: useS30, useMemo: useM30, useEffect: useE30, useRef: useR30 } = React;
const { Quiz: Quiz30 } = window.LessonComponents;

const Lessons30 = {};

/* ============================================================
   144 — Custom Graph Editor + Run Algorithm
============================================================ */
Lessons30["graph-editor"] = function () {
  const [nodes, setNodes] = useS30([
    { id: 0, x: 100, y: 100 }, { id: 1, x: 250, y: 100 },
    { id: 2, x: 400, y: 100 }, { id: 3, x: 175, y: 240 },
    { id: 4, x: 325, y: 240 },
  ]);
  const [edges, setEdges] = useS30([
    { u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 1 },
    { u: 0, v: 3, w: 1 }, { u: 1, v: 3, w: 1 },
    { u: 1, v: 4, w: 1 }, { u: 3, v: 4, w: 1 },
    { u: 2, v: 4, w: 1 },
  ]);
  const [mode, setMode] = useS30('add-node');
  const [pendingEdge, setPendingEdge] = useS30(null);
  const [startNode, setStartNode] = useS30(0);
  const [algo, setAlgo] = useS30('bfs');
  const [frames, setFrames] = useS30([]);
  const [idx, setIdx] = useS30(0);
  const [playing, setPlaying] = useS30(false);
  const svgRef = useR30(null);
  const nextId = useM30(() => nodes.length ? Math.max(...nodes.map(n => n.id)) + 1 : 0, [nodes]);

  useE30(() => {
    if (!playing || idx >= frames.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 700);
    return () => clearTimeout(t);
  }, [playing, idx, frames.length]);

  const handleSvgClick = (e) => {
    if (mode !== 'add-node') return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 340;
    setNodes(ns => [...ns, { id: nextId, x: Math.round(x), y: Math.round(y) }]);
  };

  const handleNodeClick = (n, e) => {
    e.stopPropagation();
    if (mode === 'delete') {
      setNodes(ns => ns.filter(x => x.id !== n.id));
      setEdges(es => es.filter(e => e.u !== n.id && e.v !== n.id));
    } else if (mode === 'add-edge') {
      if (pendingEdge === null) setPendingEdge(n.id);
      else if (pendingEdge === n.id) setPendingEdge(null);
      else {
        const exists = edges.some(e => (e.u === pendingEdge && e.v === n.id) || (e.v === pendingEdge && e.u === n.id));
        if (!exists) setEdges(es => [...es, { u: pendingEdge, v: n.id, w: 1 }]);
        setPendingEdge(null);
      }
    } else if (mode === 'start') {
      setStartNode(n.id);
    }
  };

  const handleEdgeClick = (e, ev) => {
    ev.stopPropagation();
    if (mode === 'delete') {
      setEdges(es => es.filter(x => !(x.u === e.u && x.v === e.v)));
    } else if (mode === 'add-edge') {
      const newW = prompt('น้ำหนัก edge:', e.w);
      if (newW !== null) {
        const w = parseInt(newW) || 1;
        setEdges(es => es.map(x => (x.u === e.u && x.v === e.v) ? { ...x, w } : x));
      }
    }
  };

  const adj = useM30(() => {
    const a = {};
    nodes.forEach(n => a[n.id] = []);
    edges.forEach(e => {
      a[e.u].push({ to: e.v, w: e.w });
      a[e.v].push({ to: e.u, w: e.w });
    });
    return a;
  }, [nodes, edges]);

  const runAlgo = () => {
    if (!nodes.find(n => n.id === startNode)) {
      alert('Start node ไม่มีอยู่'); return;
    }
    const fs = [];
    if (algo === 'bfs') {
      const visited = new Set([startNode]);
      const q = [startNode];
      fs.push({ visited: new Set(visited), queue: [...q], current: -1 });
      while (q.length) {
        const u = q.shift();
        fs.push({ visited: new Set(visited), queue: [...q], current: u });
        for (const { to: v } of adj[u]) {
          if (!visited.has(v)) {
            visited.add(v); q.push(v);
            fs.push({ visited: new Set(visited), queue: [...q], current: u });
          }
        }
      }
    } else if (algo === 'dfs') {
      const visited = new Set();
      const stk = [];
      function dfs(u) {
        visited.add(u); stk.push(u);
        fs.push({ visited: new Set(visited), queue: [...stk], current: u });
        for (const { to: v } of adj[u]) if (!visited.has(v)) dfs(v);
        stk.pop();
      }
      dfs(startNode);
    } else if (algo === 'dijkstra') {
      const dist = {}; nodes.forEach(n => dist[n.id] = Infinity);
      dist[startNode] = 0;
      const visited = new Set();
      fs.push({ visited: new Set(visited), queue: [], current: -1, dist: { ...dist } });
      for (let it = 0; it < nodes.length; it++) {
        let u = -1, best = Infinity;
        for (const n of nodes) {
          if (!visited.has(n.id) && dist[n.id] < best) { best = dist[n.id]; u = n.id; }
        }
        if (u === -1) break;
        visited.add(u);
        fs.push({ visited: new Set(visited), queue: [], current: u, dist: { ...dist } });
        for (const { to: v, w } of adj[u]) {
          if (!visited.has(v) && dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            fs.push({ visited: new Set(visited), queue: [], current: u, dist: { ...dist } });
          }
        }
      }
    }
    setFrames(fs); setIdx(0); setPlaying(true);
  };

  const frame = frames[idx] || {};

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Custom Graph Editor</div>
        วาดกราฟเอง แล้วกด <b>Run</b> เพื่อรัน BFS / DFS / Dijkstra บนกราฟของคุณ
      </div>

      <h3>เครื่องมือ</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {['add-node', 'add-edge', 'start', 'delete'].map(m => (
          <button key={m} onClick={() => { setMode(m); setPendingEdge(null); }}
            style={{
              background: mode === m ? 'var(--accent)' : 'var(--bg-3)',
              color: mode === m ? '#000' : 'var(--text-0)',
              padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600
            }}>
            {m === 'add-node' ? '➕ Node' : m === 'add-edge' ? '➜ Edge' : m === 'start' ? '🏁 Start' : '🗑 Delete'}
          </button>
        ))}
        <button onClick={() => { setNodes([]); setEdges([]); setFrames([]); }}
          style={{ background: 'var(--bg-3)', color: 'var(--danger)', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
          Clear all
        </button>
      </div>

      <div style={{ background: 'var(--bg-3)', padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 12, color: 'var(--text-1)' }}>
        Mode: <b>{mode}</b> — {mode === 'add-node' ? 'คลิกที่ canvas' : mode === 'add-edge' ? 'คลิก 2 node (หรือคลิก edge เพื่อแก้น้ำหนัก)' : mode === 'start' ? 'คลิก node ที่จะเป็นจุดเริ่ม' : 'คลิก node/edge เพื่อลบ'}
        {pendingEdge !== null && <span style={{ color: 'var(--warn)', marginLeft: 8 }}>(รอ node ที่ 2 จากนี้: {pendingEdge})</span>}
      </div>

      <svg ref={svgRef} viewBox="0 0 500 340" width="100%" onClick={handleSvgClick}
        style={{ background: 'var(--bg-2)', borderRadius: 10, cursor: mode === 'add-node' ? 'crosshair' : 'default', userSelect: 'none' }}>
        {edges.map((e, i) => {
          const a = nodes.find(n => n.id === e.u), b = nodes.find(n => n.id === e.v);
          if (!a || !b) return null;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="var(--border)" strokeWidth={6} style={{ cursor: mode === 'delete' || mode === 'add-edge' ? 'pointer' : 'default' }}
                onClick={(ev) => handleEdgeClick(e, ev)} opacity="0.01" />
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--text-3)" strokeWidth={2} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} fill="var(--warn)" fontSize="12"
                textAnchor="middle" fontFamily="monospace"
                style={{ paintOrder: 'stroke', stroke: 'var(--bg-2)', strokeWidth: 3 }}>{e.w}</text>
            </g>
          );
        })}
        {nodes.map(n => {
          const isCur = frame.current === n.id;
          const isVis = frame.visited && frame.visited.has(n.id);
          const inQ = frame.queue && frame.queue.includes(n.id);
          const isStart = n.id === startNode;
          const fill = isCur ? 'var(--warn)' : isVis ? 'var(--accent-3)' : inQ ? 'var(--accent)' : isStart ? 'var(--accent-2)' : 'var(--bg-3)';
          const d = frame.dist && frame.dist[n.id];
          return (
            <g key={n.id} onClick={(e) => handleNodeClick(n, e)} style={{ cursor: 'pointer' }}>
              <circle cx={n.x} cy={n.y} r={20}
                fill={fill}
                stroke={pendingEdge === n.id ? 'var(--warn)' : isStart ? 'var(--accent-2)' : 'var(--border)'}
                strokeWidth={pendingEdge === n.id || isStart ? 3 : 1.5} />
              <text x={n.x} y={n.y + 5} fontSize="14" fontWeight="700"
                fill={isCur || isVis || inQ || isStart ? '#000' : 'var(--text-1)'}
                textAnchor="middle">{n.id}</text>
              {d !== undefined && d !== Infinity && (
                <text x={n.x} y={n.y - 26} fontSize="10" fill="var(--accent)" fontFamily="monospace"
                  textAnchor="middle"
                  style={{ paintOrder: 'stroke', stroke: 'var(--bg-2)', strokeWidth: 3 }}>d={d}</text>
              )}
            </g>
          );
        })}
      </svg>

      <h3 style={{ marginTop: 14 }}>รัน Algorithm</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <label>Start: <input type="number" value={startNode} onChange={e => setStartNode(+e.target.value)} style={{ width: 50 }} /></label>
        <select value={algo} onChange={e => setAlgo(e.target.value)}>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="dijkstra">Dijkstra</option>
        </select>
        <button onClick={runAlgo} style={{ background: 'var(--accent)', color: '#000', padding: '6px 14px', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>▶ Run</button>
        {frames.length > 0 && (
          <>
            <button onClick={() => setIdx(0)}>↺</button>
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>◀</button>
            <button onClick={() => setPlaying(p => !p)}>{playing ? '⏸' : '▶'}</button>
            <button onClick={() => setIdx(i => Math.min(frames.length - 1, i + 1))} disabled={idx >= frames.length - 1}>▶|</button>
            <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{idx + 1} / {frames.length}</span>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   145 — Manual Trace Mode (Active Recall) — Expanded
============================================================ */

// puzzle generators - each returns { initial, generateOptions(state), isDone(state) }
const TRACE_PUZZLES = {
  bubble: {
    name: 'Bubble Sort',
    initial: () => [5, 2, 4, 1, 3].slice().sort(() => Math.random() - 0.5),
    generateOptions: (a) => {
      let firstSwap = -1;
      for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) { firstSwap = i; break; }
      if (firstSwap === -1) return [{ a, label: '✓ sort เสร็จแล้ว!', correct: true, done: true }];
      const correct = [...a]; [correct[firstSwap], correct[firstSwap + 1]] = [correct[firstSwap + 1], correct[firstSwap]];
      const opts = [{ a: correct, label: `swap (${firstSwap}, ${firstSwap + 1}) — เจอ inversion แรก`, correct: true }];
      for (let i = 0; i < a.length - 1 && opts.length < 4; i++) {
        if (i === firstSwap) continue;
        const w = [...a]; [w[i], w[i + 1]] = [w[i + 1], w[i]];
        opts.push({ a: w, label: `swap (${i}, ${i + 1})`, correct: false });
      }
      return opts.sort(() => Math.random() - 0.5);
    }
  },
  selection: {
    name: 'Selection Sort',
    initial: () => [5, 2, 4, 1, 3].slice().sort(() => Math.random() - 0.5),
    generateOptions: (a, state) => {
      const r = state.round || 0;
      if (r >= a.length - 1) return [{ a, label: '✓ sort เสร็จแล้ว!', correct: true, done: true }];
      let minIdx = r;
      for (let i = r + 1; i < a.length; i++) if (a[i] < a[minIdx]) minIdx = i;
      const correct = [...a]; [correct[r], correct[minIdx]] = [correct[minIdx], correct[r]];
      const opts = [{ a: correct, label: `min ใน [${r}..${a.length - 1}] = a[${minIdx}]=${a[minIdx]}, swap กับ a[${r}]`, correct: true, nextState: { round: r + 1 } }];
      for (let i = r + 1; i < a.length && opts.length < 3; i++) {
        if (i === minIdx) continue;
        const w = [...a]; [w[r], w[i]] = [w[i], w[r]];
        opts.push({ a: w, label: `swap a[${r}] ↔ a[${i}]`, correct: false });
      }
      return opts.sort(() => Math.random() - 0.5);
    }
  },
  insertion: {
    name: 'Insertion Sort',
    initial: () => [5, 2, 4, 1, 3].slice().sort(() => Math.random() - 0.5),
    generateOptions: (a, state) => {
      const i = state.round || 1;
      if (i >= a.length) return [{ a, label: '✓ sort เสร็จแล้ว!', correct: true, done: true }];
      // insertion: take a[i] and place into sorted prefix
      const correct = [...a];
      const key = correct[i];
      let j = i - 1;
      while (j >= 0 && correct[j] > key) { correct[j + 1] = correct[j]; j--; }
      correct[j + 1] = key;
      const opts = [{ a: correct, label: `แทรก a[${i}]=${key} ใน prefix sorted [0..${i - 1}]`, correct: true, nextState: { round: i + 1 } }];
      // wrong: swap i with random earlier
      for (let k = 0; k < i && opts.length < 3; k++) {
        const w = [...a]; [w[i], w[k]] = [w[k], w[i]];
        opts.push({ a: w, label: `swap a[${i}] ↔ a[${k}]`, correct: false });
      }
      return opts.sort(() => Math.random() - 0.5);
    }
  },
  binsearch: {
    name: 'Binary Search',
    initial: () => ({ a: [1, 3, 5, 7, 9, 11, 13, 15, 17], target: [3, 7, 11, 13, 17][Math.floor(Math.random() * 5)], lo: 0, hi: 8 }),
    generateOptions: (st) => {
      const { a, target, lo, hi } = st;
      if (lo > hi) return [{ st, label: `❌ ไม่พบ`, correct: true, done: true }];
      const mid = Math.floor((lo + hi) / 2);
      if (a[mid] === target) return [{ st: { ...st, found: mid }, label: `✓ a[${mid}]=${target} — พบที่ index ${mid}!`, correct: true, done: true }];
      const correct = a[mid] < target
        ? { st: { ...st, lo: mid + 1 }, label: `mid=${mid}, a[${mid}]=${a[mid]} < ${target} → lo = mid+1 = ${mid + 1}`, correct: true }
        : { st: { ...st, hi: mid - 1 }, label: `mid=${mid}, a[${mid}]=${a[mid]} > ${target} → hi = mid−1 = ${mid - 1}`, correct: true };
      const wrong = a[mid] < target
        ? { st: { ...st, hi: mid - 1 }, label: `set hi = mid−1`, correct: false }
        : { st: { ...st, lo: mid + 1 }, label: `set lo = mid+1`, correct: false };
      return [correct, wrong].sort(() => Math.random() - 0.5);
    }
  },
  bfs: {
    name: 'BFS',
    initial: () => ({
      adj: { 0: [1, 2], 1: [0, 3, 4], 2: [0, 4], 3: [1, 5], 4: [1, 2, 5], 5: [3, 4] },
      queue: [0], visited: new Set([0]), order: [],
    }),
    generateOptions: (st) => {
      const { adj, queue, visited, order } = st;
      if (queue.length === 0) return [{ st, label: `✓ เยี่ยมครบ! Order: [${order.join(', ')}]`, correct: true, done: true }];
      const u = queue[0];
      const newOrder = [...order, u];
      const newQueue = queue.slice(1);
      const newVisited = new Set(visited);
      const newlyEnqueued = [];
      for (const v of adj[u]) {
        if (!newVisited.has(v)) { newVisited.add(v); newQueue.push(v); newlyEnqueued.push(v); }
      }
      const correct = { st: { ...st, queue: newQueue, visited: newVisited, order: newOrder }, label: `dequeue ${u} → enqueue [${newlyEnqueued.join(', ')}]`, correct: true };
      // wrong: dequeue last instead of first
      if (queue.length > 1) {
        const fakeU = queue[queue.length - 1];
        const wrong = { st: { ...st, queue: queue.slice(0, -1), order: [...order, fakeU] }, label: `dequeue ${fakeU} (จากท้าย — ผิด!)`, correct: false };
        return [correct, wrong].sort(() => Math.random() - 0.5);
      }
      return [correct];
    }
  },
  partition: {
    name: 'QuickSort Partition (Lomuto)',
    initial: () => ({ a: [5, 2, 7, 1, 4, 6, 3].slice().sort(() => Math.random() - 0.5), pivot: null, i: -1, j: 0 }),
    generateOptions: (st) => {
      const { a, i, j } = st;
      const n = a.length;
      const pivot = a[n - 1];
      if (j >= n - 1) {
        const correct = [...a];
        [correct[i + 1], correct[n - 1]] = [correct[n - 1], correct[i + 1]];
        return [{ st: { ...st, a: correct, done: true }, label: `✓ swap a[${i + 1}] ↔ a[${n - 1}] (pivot) → pivot อยู่ที่ ${i + 1}`, correct: true, done: true }];
      }
      // current j: if a[j] <= pivot then i++, swap a[i], a[j]
      if (a[j] <= pivot) {
        const correct = [...a];
        [correct[i + 1], correct[j]] = [correct[j], correct[i + 1]];
        return [
          { st: { ...st, a: correct, i: i + 1, j: j + 1 }, label: `a[${j}]=${a[j]} ≤ pivot=${pivot} → i++=${i + 1}, swap a[${i + 1}] ↔ a[${j}]`, correct: true },
          { st: { ...st, j: j + 1 }, label: `ข้าม (ไม่ swap)`, correct: false },
        ];
      } else {
        return [
          { st: { ...st, j: j + 1 }, label: `a[${j}]=${a[j]} > pivot=${pivot} → ข้าม j++`, correct: true },
          { st: { ...st, a: a.slice(), i: i + 1, j: j + 1 }, label: `i++, swap (แม้ a[j] > pivot — ผิด!)`, correct: false },
        ];
      }
    }
  },
  heap: {
    name: 'Max Heap Insert',
    initial: () => ({ heap: [10, 8, 9, 5, 6, 3], inserting: 12, pos: -1 }),
    generateOptions: (st) => {
      const { heap, inserting, pos } = st;
      if (pos === -1) {
        return [{ st: { ...st, heap: [...heap, inserting], pos: heap.length }, label: `เพิ่ม ${inserting} ที่ตำแหน่งสุดท้าย (index ${heap.length})`, correct: true }];
      }
      if (pos === 0) return [{ st, label: `✓ ${inserting} ถึง root — heap สมบูรณ์!`, correct: true, done: true }];
      const parent = Math.floor((pos - 1) / 2);
      if (heap[pos] > heap[parent]) {
        const newH = [...heap]; [newH[pos], newH[parent]] = [newH[parent], newH[pos]];
        return [
          { st: { ...st, heap: newH, pos: parent }, label: `${heap[pos]} > parent ${heap[parent]} → swap up`, correct: true },
          { st: { ...st, pos: -2 }, label: `หยุด (parent น้อยกว่า — ควร swap!)`, correct: false },
        ];
      } else {
        return [
          { st: { ...st, pos: -2 }, label: `✓ ${heap[pos]} ≤ parent ${heap[parent]} → หยุด, heap สมบูรณ์`, correct: true, done: true },
          { st: { ...st, pos: parent }, label: `swap up (แม้ ≤ parent — ผิด)`, correct: false },
        ];
      }
    }
  },
};

Lessons30["manual-trace"] = function () {
  const [puzzleKey, setPuzzleKey] = useS30('bubble');
  const [state, setState] = useS30(TRACE_PUZZLES.bubble.initial());
  const [history, setHistory] = useS30([{ state: TRACE_PUZZLES.bubble.initial(), note: 'เริ่ม' }]);
  const [feedback, setFeedback] = useS30('');
  const [done, setDone] = useS30(false);

  useE30(() => {
    const init = TRACE_PUZZLES[puzzleKey].initial();
    setState(init);
    setHistory([{ state: init, note: 'เริ่ม' }]);
    setFeedback('');
    setDone(false);
  }, [puzzleKey]);

  const isArr = Array.isArray(state);
  const cur = history[history.length - 1].state;
  const opts = useM30(() => TRACE_PUZZLES[puzzleKey].generateOptions(cur, cur), [history, puzzleKey]);

  const pick = (o) => {
    if (o.correct) {
      const newState = o.a !== undefined ? o.a : o.st;
      setState(newState);
      setHistory(h => [...h, { state: newState, note: o.label }]);
      if (o.done) { setDone(true); setFeedback('🎉 ' + o.label); }
      else setFeedback('✅ ถูกต้อง! ขั้นถัดไป →');
    } else {
      setFeedback(`❌ ผิด — ลองดูใหม่. ที่ถูกคือ "${opts.find(x => x.correct)?.label || ''}"`);
    }
  };

  const reset = () => {
    const init = TRACE_PUZZLES[puzzleKey].initial();
    setState(init); setHistory([{ state: init, note: 'เริ่ม' }]); setFeedback(''); setDone(false);
  };

  // render state
  const renderState = (st) => {
    if (Array.isArray(st)) {
      return (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {st.map((v, i) => (
            <div key={i} style={{
              width: 44, height: 44, lineHeight: '44px', textAlign: 'center',
              background: 'var(--bg-3)', borderRadius: 6, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: 'var(--accent)'
            }}>{v}</div>
          ))}
        </div>
      );
    }
    if (st.a !== undefined && st.target !== undefined) {
      // binary search
      return (
        <div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 8 }}>
            {st.a.map((v, i) => {
              const inRange = i >= st.lo && i <= st.hi;
              const found = i === st.found;
              return (
                <div key={i} style={{
                  width: 44, height: 44, lineHeight: '44px', textAlign: 'center',
                  background: found ? 'var(--accent-3)' : inRange ? 'var(--bg-3)' : 'transparent',
                  border: i === Math.floor((st.lo + st.hi) / 2) && st.lo <= st.hi ? '2px solid var(--warn)' : '1px solid var(--border)',
                  borderRadius: 6, fontFamily: 'monospace', fontSize: 16, fontWeight: 700,
                  color: found ? '#000' : inRange ? 'var(--accent)' : 'var(--text-3)'
                }}>{v}</div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', color: 'var(--text-1)', fontFamily: 'monospace', fontSize: 13 }}>
            target = <b style={{ color: 'var(--accent-3)' }}>{st.target}</b> | lo={st.lo}, hi={st.hi}
          </div>
        </div>
      );
    }
    if (st.queue !== undefined) {
      // BFS
      return (
        <div>
          <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 6, marginBottom: 6 }}>
            <b style={{ color: 'var(--accent)' }}>Queue (front→back):</b> [{st.queue.join(', ')}]
          </div>
          <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 6, marginBottom: 6 }}>
            <b style={{ color: 'var(--accent-3)' }}>Visited:</b> {`{${[...st.visited].join(', ')}}`}
          </div>
          <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 6 }}>
            <b style={{ color: 'var(--accent-2)' }}>Order ที่เยี่ยม:</b> [{st.order.join(' → ')}]
          </div>
        </div>
      );
    }
    if (st.a !== undefined && st.i !== undefined) {
      // partition
      return (
        <div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 6 }}>
            {st.a.map((v, i) => (
              <div key={i} style={{
                width: 40, height: 40, lineHeight: '40px', textAlign: 'center',
                background: i === st.a.length - 1 ? 'var(--accent-3)' : i === st.j ? 'var(--warn)' : i <= st.i ? 'var(--accent)' : 'var(--bg-3)',
                color: i === st.a.length - 1 || i === st.j || i <= st.i ? '#000' : 'var(--text-0)',
                borderRadius: 6, fontFamily: 'monospace', fontSize: 16, fontWeight: 700
              }}>{v}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', fontSize: 11, fontFamily: 'monospace' }}>
            {st.a.map((_, i) => (
              <span key={i} style={{ width: 40, textAlign: 'center', color: 'var(--text-3)' }}>
                {i === st.i ? 'i' : i === st.j ? 'j' : i === st.a.length - 1 ? 'pivot' : ''}
              </span>
            ))}
          </div>
        </div>
      );
    }
    if (st.heap !== undefined) {
      // heap
      return (
        <div>
          <div style={{ background: 'var(--bg-3)', padding: 8, borderRadius: 6, marginBottom: 8, fontFamily: 'monospace' }}>
            Inserting: <b style={{ color: 'var(--warn)' }}>{st.inserting}</b> | current pos: {st.pos < 0 ? '—' : st.pos}
          </div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {st.heap.map((v, i) => (
              <div key={i} style={{
                width: 40, height: 40, lineHeight: '40px', textAlign: 'center',
                background: i === st.pos ? 'var(--warn)' : 'var(--bg-3)',
                color: i === st.pos ? '#000' : 'var(--accent)',
                borderRadius: 6, fontFamily: 'monospace', fontSize: 16, fontWeight: 700
              }}>{v}</div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-2)', fontFamily: 'monospace', textAlign: 'center' }}>
            (array-as-heap: parent of i = (i−1)/2)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Manual Trace — Active Recall ({Object.keys(TRACE_PUZZLES).length} algorithms)</div>
        แทนที่จะดู animation เฉย ๆ — <b>เลือก step ถัดไปเอง</b> ระบบเช็คให้
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {Object.entries(TRACE_PUZZLES).map(([k, p]) => (
          <button key={k} onClick={() => setPuzzleKey(k)} style={{
            background: puzzleKey === k ? 'var(--accent)' : 'var(--bg-3)',
            color: puzzleKey === k ? '#000' : 'var(--text-0)',
            padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13
          }}>{p.name}</button>
        ))}
        <button onClick={reset} style={{ background: 'var(--bg-3)', color: 'var(--text-0)', padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>🔀 Reset</button>
      </div>

      <h3>สถานะปัจจุบัน</h3>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, marginBottom: 10 }}>
        {renderState(cur)}
      </div>

      {!done && (
        <>
          <h3>ขั้นถัดไปคือ?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {opts.map((o, i) => (
              <button key={i} onClick={() => pick(o)} style={{
                background: 'var(--bg-3)', color: 'var(--text-0)', padding: 12, border: 'none', borderRadius: 8,
                cursor: 'pointer', textAlign: 'left', fontSize: 13
              }}>{o.label}</button>
            ))}
          </div>
        </>
      )}

      {feedback && (
        <div style={{
          background: feedback.startsWith('✅') || feedback.startsWith('🎉') ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
          padding: 10, borderRadius: 8, color: feedback.startsWith('✅') || feedback.startsWith('🎉') ? 'var(--accent-3)' : 'var(--danger)',
          fontWeight: 600
        }}>{feedback}</div>
      )}

      <h3 style={{ marginTop: 14 }}>ประวัติ</h3>
      <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: 4, color: 'var(--text-1)' }}>
            <span style={{ color: 'var(--text-3)' }}>[{i}]</span> {h.note}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   146 — Fill-in DP Table — Expanded
============================================================ */

const DP_PUZZLES = {
  lcs: {
    name: 'LCS',
    desc: 'Longest Common Subsequence',
    s: 'AGCAT', t: 'GAC',
    init: (m, n) => {
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      return dp;
    },
    fill: (dp, s, t) => {
      const m = s.length, n = t.length;
      for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
          dp[i][j] = s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      return dp;
    },
    rows: (s) => ['ε', ...s.split('')],
    cols: (t) => ['ε', ...t.split('')],
    rec: [
      "// แถว 0 และ คอลัมน์ 0 = 0",
      "if (s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1] + 1;",
      "else                  dp[i][j] = max(dp[i-1][j], dp[i][j-1]);",
    ]
  },
  edit: {
    name: 'Edit Distance',
    desc: 'Levenshtein distance',
    s: 'abc', t: 'yabd',
    init: (m, n) => {
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      return dp;
    },
    fill: (dp, s, t) => {
      const m = s.length, n = t.length;
      for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
          dp[i][j] = s[i - 1] === t[j - 1] ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      return dp;
    },
    rows: (s) => ['ε', ...s.split('')],
    cols: (t) => ['ε', ...t.split('')],
    rec: [
      "// dp[i][0] = i, dp[0][j] = j",
      "if (s[i-1] == t[j-1]) dp[i][j] = dp[i-1][j-1];",
      "else dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});",
    ]
  },
  lis: {
    name: 'LIS',
    desc: 'Longest Increasing Subsequence (1D)',
    arr: [3, 1, 4, 1, 5, 9, 2, 6],
    is1D: true,
    init: (n) => new Array(n).fill(1),
    fill: (dp, a) => {
      for (let i = 1; i < a.length; i++)
        for (let j = 0; j < i; j++)
          if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
      return dp;
    },
    rec: [
      "// dp[i] = LIS ที่ลงท้ายด้วย a[i]",
      "// init: dp[i] = 1 ทุก i",
      "for (int i = 1; i < n; i++)",
      "  for (int j = 0; j < i; j++)",
      "    if (a[j] < a[i])",
      "      dp[i] = max(dp[i], dp[j] + 1);",
      "answer = *max_element(dp.begin(), dp.end());",
    ]
  },
  knapsack: {
    name: '0/1 Knapsack',
    desc: 'Max value with weight ≤ W',
    w: [2, 3, 4, 5], v: [3, 4, 5, 6], W: 8,
    init: (m, n) => Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0)),
    fill: (dp, w, v, W) => {
      const n = w.length;
      for (let i = 1; i <= n; i++)
        for (let j = 0; j <= W; j++) {
          if (w[i - 1] > j) dp[i][j] = dp[i - 1][j];
          else dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - w[i - 1]] + v[i - 1]);
        }
      return dp;
    },
    rows: () => ['0', '1 (w=2,v=3)', '2 (w=3,v=4)', '3 (w=4,v=5)', '4 (w=5,v=6)'],
    cols: (W) => Array.from({ length: W + 1 }, (_, j) => `w=${j}`),
    rec: [
      "for (int i = 1; i <= n; i++)",
      "  for (int j = 0; j <= W; j++) {",
      "    if (w[i-1] > j) dp[i][j] = dp[i-1][j];",
      "    else dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i-1]] + v[i-1]);",
      "  }",
    ]
  },
  coinchange: {
    name: 'Coin Change',
    desc: 'Min coins to make value V (coins: 1, 3, 4)',
    coins: [1, 3, 4], V: 8,
    is1D: true,
    init: (n) => { const dp = new Array(n + 1).fill(99); dp[0] = 0; return dp; },
    fill: (dp, coins, V) => {
      for (let v = 1; v <= V; v++)
        for (const c of coins)
          if (c <= v && dp[v - c] + 1 < dp[v]) dp[v] = dp[v - c] + 1;
      return dp;
    },
    rec: [
      "// dp[v] = min coins to make value v",
      "// init: dp[0] = 0, dp[1..V] = ∞",
      "for (int v = 1; v <= V; v++)",
      "  for (int c : coins)",
      "    if (c <= v) dp[v] = min(dp[v], dp[v-c] + 1);",
    ]
  },
  subsetsum: {
    name: 'Subset Sum',
    desc: 'มี subset ของ a ที่ sum = S ไหม? (boolean → แสดงเป็น 0/1)',
    arr: [3, 4, 5, 6], S: 9,
    init: (m, n) => {
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = 1;
      return dp;
    },
    fill: (dp, a, S) => {
      const n = a.length;
      for (let i = 1; i <= n; i++)
        for (let s = 1; s <= S; s++) {
          if (a[i - 1] > s) dp[i][s] = dp[i - 1][s];
          else dp[i][s] = dp[i - 1][s] || dp[i - 1][s - a[i - 1]];
        }
      return dp;
    },
    rows: () => ['0 items', '1 (a=3)', '2 (a=4)', '3 (a=5)', '4 (a=6)'],
    cols: (S) => Array.from({ length: S + 1 }, (_, j) => `s=${j}`),
    rec: [
      "// dp[i][s] = true ถ้ามี subset ของ a[0..i) ที่ sum = s",
      "// dp[i][0] = true, dp[0][s>0] = false",
      "if (a[i-1] > s) dp[i][s] = dp[i-1][s];",
      "else dp[i][s] = dp[i-1][s] || dp[i-1][s-a[i-1]];",
    ]
  },
};

Lessons30["fill-dp"] = function () {
  const [puzzleKey, setPuzzleKey] = useS30('lcs');
  const [userTable, setUserTable] = useS30({});
  const [feedback, setFeedback] = useS30({});

  const p = DP_PUZZLES[puzzleKey];

  // compute correct table
  const correct = useM30(() => {
    if (p.is1D) {
      if (p.arr) {
        const dp = p.init(p.arr.length);
        return p.fill(dp, p.arr);
      } else {
        const dp = p.init(p.V);
        return p.fill(dp, p.coins, p.V);
      }
    } else {
      if (p.s !== undefined) {
        const dp = p.init(p.s.length, p.t.length);
        return p.fill(dp, p.s, p.t);
      } else if (p.w) {
        const dp = p.init(p.w.length, p.W);
        return p.fill(dp, p.w, p.v, p.W);
      } else if (p.arr && p.S !== undefined) {
        const dp = p.init(p.arr.length, p.S);
        return p.fill(dp, p.arr, p.S);
      }
    }
  }, [puzzleKey]);

  useE30(() => { setUserTable({}); setFeedback({}); }, [puzzleKey]);

  const updateCell = (i, j, val) => {
    const k = j === undefined ? `${i}` : `${i},${j}`;
    setUserTable(u => ({ ...u, [k]: val }));
    const v = parseInt(val);
    const c = j === undefined ? correct[i] : correct[i][j];
    if (val === '') setFeedback(f => { const nf = { ...f }; delete nf[k]; return nf; });
    else if (v === c) setFeedback(f => ({ ...f, [k]: 'ok' }));
    else setFeedback(f => ({ ...f, [k]: 'no' }));
  };

  const fillInit = () => {
    const next = {}, fb = {};
    if (p.is1D) {
      if (puzzleKey === 'lis') {
        // dp[i] = 1 initially
        correct.forEach((_, i) => { next[`${i}`] = '1'; fb[`${i}`] = 'ok'; });
      } else if (puzzleKey === 'coinchange') {
        // dp[0] = 0, rest = -1 (we use 99 internally so leave others blank)
        next['0'] = '0'; fb['0'] = 'ok';
      }
    } else {
      // 2D: init row/col 0
      correct.forEach((row, i) => {
        if (i === 0) row.forEach((_, j) => { next[`0,${j}`] = String(correct[0][j]); fb[`0,${j}`] = 'ok'; });
        else { next[`${i},0`] = String(correct[i][0]); fb[`${i},0`] = 'ok'; }
      });
    }
    setUserTable(u => ({ ...u, ...next }));
    setFeedback(f => ({ ...f, ...fb }));
  };

  const reveal = () => {
    const next = {}, fb = {};
    if (p.is1D) {
      correct.forEach((v, i) => { next[`${i}`] = String(v); fb[`${i}`] = 'ok'; });
    } else {
      correct.forEach((row, i) => row.forEach((v, j) => { next[`${i},${j}`] = String(v); fb[`${i},${j}`] = 'ok'; }));
    }
    setUserTable(next); setFeedback(fb);
  };

  const reset = () => { setUserTable({}); setFeedback({}); };

  const total = p.is1D ? correct.length : correct.length * correct[0].length;
  const correctCnt = Object.values(feedback).filter(v => v === 'ok').length;

  const renderTable = () => {
    if (p.is1D) {
      // 1D: array of cells
      const labels = p.arr || Array.from({ length: p.V + 1 }, (_, i) => i);
      return (
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {labels.map((lbl, i) => (
              <div key={i} style={{ width: 50, textAlign: 'center', fontSize: 12, color: 'var(--accent)', fontFamily: 'monospace' }}>{p.arr ? `a[${i}]=${lbl}` : lbl}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {correct.map((_, i) => {
              const val = userTable[`${i}`] || '';
              const fb = feedback[`${i}`];
              return (
                <input key={i} type="text" value={val}
                  onChange={e => updateCell(i, undefined, e.target.value)}
                  style={{
                    width: 46, height: 46, textAlign: 'center',
                    background: fb === 'ok' ? 'rgba(52,211,153,0.2)' : fb === 'no' ? 'rgba(248,113,113,0.2)' : 'var(--bg-3)',
                    color: fb === 'ok' ? 'var(--accent-3)' : fb === 'no' ? 'var(--danger)' : 'var(--text-0)',
                    border: `1px solid ${fb === 'ok' ? 'var(--accent-3)' : fb === 'no' ? 'var(--danger)' : 'var(--border)'}`,
                    fontFamily: 'monospace', fontSize: 16, fontWeight: 600, borderRadius: 6
                  }} />
              );
            })}
          </div>
        </div>
      );
    }
    // 2D
    const rowLabels = p.rows ? p.rows(p.s || p.w || p.arr) : null;
    const colLabels = p.cols ? p.cols(p.t || p.W || p.S) : null;
    return (
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace' }}>
        <thead>
          <tr>
            <th style={{ padding: 4, width: 80, color: 'var(--text-3)' }}></th>
            {(colLabels || correct[0].map((_, j) => j)).map((lbl, j) => (
              <th key={j} style={{ padding: 4, color: 'var(--accent)', minWidth: 44, fontSize: 11 }}>{lbl}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {correct.map((row, i) => (
            <tr key={i}>
              <th style={{ padding: 4, color: 'var(--accent-2)', textAlign: 'right', fontSize: 11 }}>
                {rowLabels ? rowLabels[i] : i}
              </th>
              {row.map((_, j) => {
                const k = `${i},${j}`;
                const val = userTable[k] || '';
                const fb = feedback[k];
                return (
                  <td key={j} style={{ padding: 2 }}>
                    <input type="text" value={val}
                      onChange={e => updateCell(i, j, e.target.value)}
                      style={{
                        width: 40, height: 40, textAlign: 'center',
                        background: fb === 'ok' ? 'rgba(52,211,153,0.2)' : fb === 'no' ? 'rgba(248,113,113,0.2)' : 'var(--bg-3)',
                        color: fb === 'ok' ? 'var(--accent-3)' : fb === 'no' ? 'var(--danger)' : 'var(--text-0)',
                        border: `1px solid ${fb === 'ok' ? 'var(--accent-3)' : fb === 'no' ? 'var(--danger)' : 'var(--border)'}`,
                        fontFamily: 'monospace', fontSize: 14, fontWeight: 600, borderRadius: 6
                      }} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Fill-in DP Table — เติม cell เอง ({Object.keys(DP_PUZZLES).length} problems)</div>
        คลิก cell แล้วใส่ค่า — ระบบเช็คทันที (เขียว = ถูก, แดง = ผิด)
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {Object.entries(DP_PUZZLES).map(([k, pp]) => (
          <button key={k} onClick={() => setPuzzleKey(k)} style={{
            background: puzzleKey === k ? 'var(--accent)' : 'var(--bg-3)',
            color: puzzleKey === k ? '#000' : 'var(--text-0)',
            padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12
          }}>{pp.name}</button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-3)', padding: 8, borderRadius: 6, marginBottom: 10, fontSize: 13, color: 'var(--text-1)' }}>
        <b>{p.name}:</b> {p.desc}
        {p.s !== undefined && <span style={{ marginLeft: 10, fontFamily: 'monospace' }}>s="{p.s}", t="{p.t}"</span>}
        {p.arr && <span style={{ marginLeft: 10, fontFamily: 'monospace' }}>a=[{p.arr.join(',')}]{p.S !== undefined ? `, S=${p.S}` : ''}</span>}
        {p.w && <span style={{ marginLeft: 10, fontFamily: 'monospace' }}>w=[{p.w.join(',')}], v=[{p.v.join(',')}], W={p.W}</span>}
        {p.coins && <span style={{ marginLeft: 10, fontFamily: 'monospace' }}>coins={p.coins.join(',')}, V={p.V}</span>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={fillInit} style={{ background: 'var(--bg-3)', padding: '6px 10px', border: 'none', borderRadius: 6, color: 'var(--text-0)' }}>📝 Fill init values</button>
        <button onClick={reset} style={{ background: 'var(--bg-3)', padding: '6px 10px', border: 'none', borderRadius: 6, color: 'var(--text-0)' }}>🗑 Reset</button>
        <button onClick={reveal} style={{ background: 'var(--bg-3)', padding: '6px 10px', border: 'none', borderRadius: 6, color: 'var(--warn)' }}>👁 Reveal</button>
        <div style={{ marginLeft: 'auto', fontFamily: 'monospace' }}>{correctCnt} / {total} ✓</div>
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, overflowX: 'auto' }}>
        {renderTable()}
      </div>

      <h3 style={{ marginTop: 14 }}>Recurrence ที่ใช้</h3>
      <CodeBlock code={p.rec} />

      {p.is1D && puzzleKey === 'coinchange' && (
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, marginTop: 10, fontSize: 13, color: 'var(--text-1)' }}>
          💡 Hint: ถ้าทำ coin = c ไม่ได้ (v &lt; c) ข้าม. ค่า "∞" แสดงเป็น <code>99</code> ใน demo นี้
        </div>
      )}
    </React.Fragment>
  );
};

window.LessonsPart30 = Lessons30;
