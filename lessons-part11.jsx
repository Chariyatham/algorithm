/* Lessons Part 11 — AI Tutor + Missing Lessons + QoL Features */

const { useState: useS11, useMemo: useM11, useEffect: useE11, useRef: useR11 } = React;
const { Quiz: Quiz11 } = window.LessonComponents;
const { WorkedExample: WE11, CheatSheet: CS11, Pitfalls: PF11 } = window.LearningKit;

const Lessons11 = {};

/* ============================================================
   55 — AI TUTOR CHAT (multi-mode)
============================================================ */
Lessons11["ai-tutor"] = function () {
  const AI_OK = typeof window.claude?.complete === 'function';
  if (!AI_OK) {
    return (
      <div className="callout warn">
        <div className="ttl">🤖 AI Tutor · ต้องใช้ Claude</div>
        บทเรียนนี้คุยกับ AI ของ Claude ซึ่งใช้ได้บน <b>claude.ai</b> เท่านั้น —
        บนเว็บที่ host ทั่วไป (เช่น GitHub Pages) จะใช้ฟีเจอร์นี้ไม่ได้<br/><br/>
        ทดลอง: ลองไปที่ <a href="#/playground" style={{ color: 'var(--accent)' }}>Code Playground</a> หรือ
        <a href="#/problems" style={{ color: 'var(--accent)', marginLeft: 6 }}>โจทย์ฝึก</a> ที่รันใน browser ได้เลยฟรีไม่ต้องใช้ AI
      </div>
    );
  }
  const [mode, setMode] = useS11('chat');
  const [input, setInput] = useS11('');
  const [chat, setChat] = useS11([]);
  const [loading, setLoading] = useS11(false);

  const presets = {
    chat: [
      "อธิบาย Big-O แบบที่เด็ก 10 ขวบเข้าใจ",
      "Quick sort กับ Merge sort ต่างกันยังไง ใช้แบบไหนดี?",
      "ทำไม Dijkstra ใช้กับ negative weight ไม่ได้?",
      "ตอนเขียนสอบ ถ้าเจอโจทย์ที่มี 'shortest path' ควรใช้อะไร?",
    ],
    solve: [
      "หา shortest path จาก A→F ใน graph weighted นี้ ทีละ step",
      "0/1 Knapsack: W=10, items=[(w=2,v=3),(w=3,v=4),(w=5,v=8)] หา max value",
      "วิเคราะห์ Big-O ของ Insertion Sort ทุก case",
      "อธิบาย Strassen M1-M7 ทำไมถึงได้ผลรวมที่ถูกต้อง",
    ],
    explain: [
      "void f(int n) {\n  for(int i=1;i<n;i*=2)\n    for(int j=0;j<i;j++)\n      cout << j;\n}",
      "int gcd(int a, int b) {\n  return b == 0 ? a : gcd(b, a%b);\n}",
      "// อะไรคือ pattern\nfor(int l=0,r=n-1; l<r;) {\n  if(a[l]+a[r]==t) return {l,r};\n  if(a[l]+a[r]<t) l++; else r--;\n}",
    ]
  };

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setChat(c => [...c, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const sys = {
        chat: "คุณคือติวเตอร์อัลกอริทึมที่อธิบายภาษาไทยกระชับและเข้าใจง่าย ใช้ตัวอย่างจริง ไม่ verbose ตอบไม่เกิน 200 คำ",
        solve: "คุณคือติวเตอร์อัลกอริทึม แก้โจทย์ทีละ step ภาษาไทย: 1) ระบุประเภทโจทย์ 2) เลือก algorithm 3) แก้ทีละ step ด้วยตัวเลขจริง 4) สรุปคำตอบ + complexity",
        explain: "คุณคือ code reviewer ภาษาไทย: 1) บอกว่า code นี้ทำอะไร 2) วิเคราะห์ Big-O ทีละบรรทัด 3) ระบุ pattern (D&C/DP/Greedy/...) 4) หาบั๊ก/edge case ถ้ามี กระชับ ไม่เกิน 250 คำ"
      };
      const prompt = `${sys[mode]}\n\nคำถาม:\n${text}`;
      const r = await window.claude.complete(prompt);
      setChat(c => [...c, { role: 'assistant', content: r }]);
    } catch (e) {
      setChat(c => [...c, { role: 'assistant', content: 'เกิดข้อผิดพลาด: ' + (e.message || e) }]);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🤖 AI Tutor — ติวเตอร์ส่วนตัว 24/7</div>
        ถามอะไรก็ได้ — แก้โจทย์ให้ดูทีละ step / อธิบายโค้ดให้ฟัง / ถามแบบเด็ก 5 ขวบ
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[
          { id: 'chat', label: '💬 ถาม-ตอบ', desc: 'อธิบายเนื้อหา' },
          { id: 'solve', label: '✏️ แก้โจทย์', desc: 'ทีละ step' },
          { id: 'explain', label: '🔍 อธิบายโค้ด', desc: 'paste C++' },
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setChat([]); }}
            style={{ flex: 1, background: mode === m.id ? 'var(--accent)' : 'var(--bg-2)', color: mode === m.id ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '10px', borderRadius: 6, cursor: 'pointer', fontWeight: mode === m.id ? 600 : 400 }}>
            {m.label}<div style={{ fontSize: 11, opacity: 0.7 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {chat.length === 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>💡 ตัวอย่างคำถาม:</div>
          {presets[mode].map((p, i) => (
            <button key={i} onClick={() => send(p)}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'var(--bg-2)', color: 'var(--text-1)', border: '1px solid var(--border)', padding: 10, borderRadius: 6, cursor: 'pointer', marginBottom: 6, fontSize: 13, fontFamily: mode === 'explain' ? 'monospace' : 'inherit', whiteSpace: 'pre-wrap' }}>
              {p}
            </button>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--bg-1)', borderRadius: 10, padding: 12, minHeight: 200, marginBottom: 12, maxHeight: 600, overflowY: 'auto' }}>
        {chat.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: m.role === 'user' ? 'var(--accent)' : '#10b981', fontWeight: 700, marginBottom: 4 }}>
              {m.role === 'user' ? '👤 คุณ' : '🤖 ติวเตอร์'}
            </div>
            <div style={{ background: m.role === 'user' ? 'var(--bg-2)' : 'rgba(16,185,129,0.06)', padding: 10, borderRadius: 6, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, fontFamily: m.role === 'user' && mode === 'explain' ? 'monospace' : 'inherit' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: 'var(--text-2)', fontSize: 13 }}>⏳ ติวเตอร์กำลังคิด...</div>}
        {chat.length === 0 && !loading && <div style={{ color: 'var(--text-3)', textAlign: 'center', paddingTop: 60 }}>เลือกตัวอย่างด้านบน หรือพิมพ์คำถามด้านล่าง</div>}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(input); }}
          placeholder={mode === 'explain' ? 'paste C++ code...' : 'พิมพ์คำถาม (Cmd/Ctrl+Enter ส่ง)'}
          style={{ flex: 1, padding: 10, fontSize: 13, background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6, fontFamily: mode === 'explain' ? 'monospace' : 'inherit', resize: 'vertical', minHeight: 60 }} />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: loading || !input.trim() ? 0.5 : 1 }}>
          ส่ง →
        </button>
      </div>

      {chat.length > 0 && (
        <button onClick={() => setChat([])} style={{ marginTop: 8, background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          🗑️ ล้างประวัติ
        </button>
      )}
    </React.Fragment>
  );
};

/* ============================================================
   56 — BELLMAN-FORD
============================================================ */
Lessons11["bellman-ford"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Bellman-Ford — Shortest Path กับ Negative Weight</div>
        ใช้แทน Dijkstra เมื่อกราฟมี <b>negative edge weight</b> (แต่ห้ามมี negative cycle)<br />
        Time: <b>O(V · E)</b> ช้ากว่า Dijkstra แต่ทนกับ negative
      </div>

      <h3>หลักการ — Relax ทุก edge V-1 ครั้ง</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>กำหนด <code>dist[src] = 0</code>, อื่น ๆ = ∞</li>
        <li>ทำซ้ำ V−1 รอบ: สำหรับทุก edge (u,v,w) ถ้า <code>dist[u]+w &lt; dist[v]</code> → update</li>
        <li>รอบที่ V: ถ้ายัง relax ได้ → มี <b>negative cycle</b></li>
      </ol>

      <pre className="code">{`bool bellmanFord(int V, vector<tuple<int,int,int>>& edges, int src, vector<int>& dist) {
  dist.assign(V, INT_MAX);
  dist[src] = 0;
  for (int i = 0; i < V - 1; i++) {
    for (auto [u, v, w] : edges) {
      if (dist[u] != INT_MAX && dist[u] + w < dist[v])
        dist[v] = dist[u] + w;
    }
  }
  // detect negative cycle
  for (auto [u, v, w] : edges)
    if (dist[u] != INT_MAX && dist[u] + w < dist[v])
      return false;     // negative cycle exists
  return true;
}`}</pre>

      <WE11
        title="Bellman-Ford กับ graph 5 nodes"
        problem="edges: A→B(6), A→C(7), B→C(8), B→D(5), B→E(-4), C→D(-3), C→E(9), D→E(7), E→A(2)\nหา shortest จาก A"
        steps={[
          { title: "Init", body: "dist = [0, ∞, ∞, ∞, ∞]" },
          { title: "Pass 1", body: "A→B: dist[B] = 6\nA→C: dist[C] = 7\nC→D: dist[D] = 7 + (-3) = 4\nB→E: dist[E] = 6 + (-4) = 2 (ใช้ B=6)" },
          { title: "Pass 2", body: "เช็คทุก edge อีก — อาจ relax เพิ่ม:\nE→A: 2+2=4 > 0 → ไม่ update\nD→E: 4+7=11 > 2 → ไม่ update" },
          { title: "หลัง V-1=4 passes", body: "dist = [0, 2, 7, 4, -2]\nลอง pass V (เช็ค negative cycle) — ไม่มี relax → no negative cycle ✓" },
        ]}
        answer="dist[A→B]=2, A→C=7, A→D=4, A→E=-2"
        takeaway="Bellman-Ford ช้ากว่า Dijkstra แต่ <b>handle negative</b> ได้ + ตรวจ negative cycle ได้"
      />

      <CS11 title="Bellman-Ford" sections={[
        { label: "TIME / SPACE", value: "O(V·E) / O(V)", mono: true },
        { label: "vs DIJKSTRA", value: "Dijkstra เร็วกว่า แต่ห้าม negative<br>BF ช้ากว่า แต่ทน negative + ตรวจ neg cycle" },
        { label: "USE WHEN", value: "Graph มี negative weight<br>ต้องตรวจ negative cycle<br>Currency arbitrage" },
      ]} />

      <PF11 items={[
        { trap: "ใช้ Bellman-Ford กับ unweighted graph", fix: "ผิด! ใช้ BFS เร็วกว่า O(V+E)" },
        { trap: "ลืม V-1 รอบ — แค่ relax 1 รอบ", fix: "ต้องครบ V-1 — ไม่งั้นบางเส้นทางยังไม่ converge" },
        { trap: "ไม่เช็ค dist[u] != INT_MAX", fix: "INT_MAX + w → overflow! ต้องเช็คก่อน" },
      ]} />

      <Quiz11 q="Bellman-Ford ใช้กี่รอบในการ relax (ไม่นับการเช็ค neg cycle)?"
        options={["V", "V-1", "E", "V·E"]} answer={1} explain="V-1 ครั้ง — เพราะ shortest path ยาวสุด V-1 edges" />
    </React.Fragment>
  );
};

/* ============================================================
   57 — FLOYD-WARSHALL
============================================================ */
Lessons11["floyd-warshall"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Floyd-Warshall — All-Pairs Shortest Path</div>
        หา shortest path ระหว่าง<b>ทุกคู่ของ node</b> ในกราฟ weighted<br />
        Time: <b>O(V³)</b> — เหมาะกับ dense graph
      </div>

      <h3>หลักการ — DP บน intermediate vertex</h3>
      <pre className="code">{`// dist[i][j] = shortest path from i to j
// ใช้เฉพาะ vertex 0..k เป็น intermediate

for k = 0 to V-1:
  for i = 0 to V-1:
    for j = 0 to V-1:
      if dist[i][k] + dist[k][j] < dist[i][j]:
        dist[i][j] = dist[i][k] + dist[k][j]`}</pre>

      <p style={{ color: 'var(--text-1)' }}>idea: ลองดูว่าผ่าน node k จะสั้นกว่าตรงไปไหม → ทำกับทุก k ทุกคู่</p>

      <pre className="code">{`void floydWarshall(vector<vector<int>>& dist, int n) {
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++)
      for (int j = 0; j < n; j++)
        if (dist[i][k] != INF && dist[k][j] != INF)
          dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
}`}</pre>

      <CS11 title="Floyd-Warshall" sections={[
        { label: "TIME / SPACE", value: "O(V³) / O(V²)", mono: true },
        { label: "vs OTHERS", value: "Dijkstra V times: O(V·(V+E)log V)<br>BF V times: O(V²E)<br>Floyd: O(V³) — ดีกว่าเมื่อ dense" },
        { label: "USE WHEN", value: "ต้องการ all pairs<br>V เล็ก (V ≤ 500)<br>dense graph (E ≈ V²)<br>มี negative weight (ไม่มี neg cycle)" },
      ]} />

      <PF11 items={[
        { trap: "ลำดับ loop เป็น i,j,k", fix: "ต้อง <b>k นอกสุด</b> — เพราะ DP บน intermediate vertex" },
        { trap: "ไม่ check INF ก่อนบวก", fix: "INF + INF overflow! เช็ค dist[i][k] != INF" },
      ]} />

      <Quiz11 q="Floyd-Warshall complexity?"
        options={["O(V²)", "O(V³)", "O(V² log V)", "O(VE)"]} answer={1} explain="3 loop ซ้อน — V × V × V = V³" />
    </React.Fragment>
  );
};

/* ============================================================
   57b — WARSHALL'S TRANSITIVE CLOSURE
   distinct from Floyd-Warshall — boolean reachability instead of shortest path
============================================================ */
function WarshallTCViz() {
  // KMUTNB graph_explor sheet example: 5 vertices, directed edges
  // 0→1, 1→2, 2→0, 3→4 (two components)
  // Or use sheet's diagram: vertices A,B,C,D with edges A→B, B→C, C→D
  // We'll demo: 4 vertices, edges 0→1, 1→2, 2→3
  const N = 4;
  const edges = [[0, 1], [1, 2], [2, 3], [3, 1]];
  // initial adjacency
  const init = Array.from({ length: N }, () => Array(N).fill(0));
  for (const [u, v] of edges) init[u][v] = 1;

  // Compute snapshot after considering intermediate vertex k = 0, 1, ..., N-1
  const snapshots = [init.map(r => [...r])];
  {
    const R = init.map(r => [...r]);
    for (let k = 0; k < N; k++) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          R[i][j] = R[i][j] || (R[i][k] && R[k][j]);
        }
      }
      snapshots.push(R.map(r => [...r]));
    }
  }
  const [step, setStep] = useS11(0);
  const cur = snapshots[step];
  const stepLabel = step === 0
    ? 'เริ่มต้น — R = adjacency matrix ของกราฟ'
    : `หลังพิจารณา intermediate vertex k = ${step - 1}`;
  // Determine "new" cells (filled in this step compared with previous)
  const prev = step > 0 ? snapshots[step - 1] : null;

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {step + 1} / {snapshots.length}</span>
        <button onClick={() => setStep(Math.min(snapshots.length - 1, step + 1))} disabled={step >= snapshots.length - 1}>▶</button>
        <button onClick={() => setStep(0)}>↺</button>
      </div>
      <div className="callout info" style={{ marginTop: 8 }}>
        <div className="ttl">{stepLabel}</div>
        <span style={{ color: 'var(--text-1)' }}>
          {step === 0
            ? `Edge: ${edges.map(([u, v]) => `${u}→${v}`).join(', ')}`
            : `กฎ: R[i][j] = R[i][j] OR (R[i][${step - 1}] AND R[${step - 1}][j])`}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Matrix */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>R matrix:</div>
          <table className="tbl" style={{ width: 'auto' }}>
            <thead>
              <tr>
                <th></th>
                {[...Array(N).keys()].map(j => <th key={j} style={{ textAlign: 'center', width: 36 }}>{j}</th>)}
              </tr>
            </thead>
            <tbody>
              {cur.map((row, i) => (
                <tr key={i}>
                  <th style={{ textAlign: 'center' }}>{i}</th>
                  {row.map((v, j) => {
                    const isNew = prev && v === 1 && prev[i][j] === 0;
                    const isK = step > 0 && (i === step - 1 || j === step - 1);
                    return (
                      <td key={j} style={{
                        textAlign: 'center',
                        background: isNew ? 'var(--success)' : isK ? 'var(--bg-1)' : 'var(--bg-2)',
                        color: isNew ? '#000' : v === 1 ? 'var(--accent)' : 'var(--text-2)',
                        fontFamily: 'monospace',
                        fontWeight: v === 1 ? 'bold' : 'normal',
                      }}>{v}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Graph diagram (simple SVG) */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>Directed graph:</div>
          <svg viewBox="0 0 200 180" style={{ background: 'var(--bg-2)', borderRadius: 6, width: 200, height: 180 }}>
            <defs>
              <marker id="arr-w" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-1)" />
              </marker>
            </defs>
            {[{ x: 40, y: 40, l: '0' }, { x: 160, y: 40, l: '1' }, { x: 160, y: 140, l: '2' }, { x: 40, y: 140, l: '3' }].map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="16" fill={step > 0 && i === step - 1 ? 'var(--warn)' : 'var(--accent)'} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fill="#000" fontWeight="bold">{p.l}</text>
              </g>
            ))}
            {/* edges with arrows */}
            <line x1="56" y1="40" x2="144" y2="40" stroke="var(--text-1)" strokeWidth="1.5" markerEnd="url(#arr-w)" />
            <line x1="160" y1="56" x2="160" y2="124" stroke="var(--text-1)" strokeWidth="1.5" markerEnd="url(#arr-w)" />
            <line x1="144" y1="140" x2="56" y2="140" stroke="var(--text-1)" strokeWidth="1.5" markerEnd="url(#arr-w)" />
            {/* 3→1: curved */}
            <path d="M 50,128 Q 100,80 150,52" fill="none" stroke="var(--text-1)" strokeWidth="1.5" markerEnd="url(#arr-w)" />
          </svg>
        </div>
      </div>
      {step === snapshots.length - 1 && (
        <div className="callout success" style={{ marginTop: 12 }}>
          <div className="ttl">✓ Transitive closure ครบ</div>
          R[i][j] = 1 ⇔ มี path จาก i ไป j (อาจตรง หรือผ่านหลายขั้นก็ได้)
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-2)' }}>
        <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--success)', marginRight: 6, borderRadius: 2 }}></span>cell ใหม่ที่เปลี่ยน 0 → 1 ในรอบนี้
        &nbsp; <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--bg-1)', marginRight: 6, borderRadius: 2, border: '1px solid var(--bg-3)' }}></span>row/col ของ k
      </div>
    </div>
  );
}

Lessons11["warshall-tc"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Warshall's Transitive Closure — มี "path" ระหว่าง u → v ไหม?</div>
        ไม่ใช่ Floyd-Warshall (shortest path)! Warshall's TC ตอบคำถาม <b>reachability</b> เป็น boolean:
        R[i][j] = 1 ⇔ มีเส้นทางจาก i ไป j (จะตรงหรือผ่าน intermediate vertex ก็ได้)
      </div>

      <h3>ความแตกต่างจาก Floyd-Warshall</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Warshall TC</th><th>Floyd-Warshall</th></tr></thead>
        <tbody>
          <tr><td>ตอบ</td><td>มี path ไหม (boolean)</td><td>ระยะทางสั้นสุดเท่าไร (numeric)</td></tr>
          <tr><td>ค่าในเมทริกซ์</td><td>0 / 1</td><td>distance (≥ 0, ∞)</td></tr>
          <tr><td>operator ใน DP</td><td>OR, AND</td><td>min, +</td></tr>
          <tr><td>กราฟ</td><td>directed (unweighted) ก็พอ</td><td>weighted</td></tr>
          <tr><td>Time / Space</td><td>O(V³) / O(V²)</td><td>O(V³) / O(V²)</td></tr>
        </tbody>
      </table>

      <h3>แนวคิด — DP บน intermediate vertex</h3>
      <p style={{ color: 'var(--text-1)' }}>เช่นเดียวกับ Floyd: พิจารณาว่ามี vertex <code>k</code> เป็นทางเชื่อมจาก i → j ได้ไหม</p>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 15, lineHeight: 1.7 }}>
          R<sub>k</sub>[i][j] = R<sub>k-1</sub>[i][j] <span style={{ color: 'var(--accent)' }}>OR</span>
          (R<sub>k-1</sub>[i][k] <span style={{ color: 'var(--accent-2)' }}>AND</span> R<sub>k-1</sub>[k][j])
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
          "มี path i→j โดยใช้ vertex 0..k เป็น intermediate ก็ต่อเมื่อ มี path เดิม หรือ ผ่าน k"
        </div>
      </div>

      <h3>Pseudocode</h3>
      <pre className="code">{`// Initialize: R = adjacency matrix
for k = 0 to n-1:
  for i = 0 to n-1:
    for j = 0 to n-1:
      R[i][j] = R[i][j] OR (R[i][k] AND R[k][j])`}</pre>

      <h3>Demo — graph 4 vertices (0→1→2→3→1)</h3>
      <WarshallTCViz />

      <h3>C++ Implementation</h3>
      <pre className="code">{`void warshall(vector<vector<int>>& R, int n) {
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++)
      for (int j = 0; j < n; j++)
        R[i][j] = R[i][j] || (R[i][k] && R[k][j]);
}`}</pre>

      <h3>การประยุกต์</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Reachability query</b> — ตอบล่วงหน้าว่า u ไปถึง v ได้ไหม (precompute O(V³), query O(1))</li>
        <li><b>Connected component</b> ในกราฟทิศทาง: i, j อยู่ component เดียวกัน ⇔ R[i][j] ∧ R[j][i]</li>
        <li><b>Compiler / Dataflow</b> — ตัวแปร x ถูก def แล้ว reach ถึง use ไหน</li>
        <li><b>Relation closure</b> — เปลี่ยน relation ให้เป็น transitive</li>
      </ul>

      <CS11 title="Warshall TC vs Floyd-Warshall" sections={[
        { label: "WARSHALL TC", value: "R[i][j] ∈ {0,1}<br>OR / AND<br>O(V³) / O(V²)<br>ตอบ: มี path ไหม", mono: true },
        { label: "FLOYD-WARSHALL", value: "dist[i][j] ∈ ℤ ∪ {∞}<br>min / +<br>O(V³) / O(V²)<br>ตอบ: ระยะสั้นสุด", mono: true },
        { label: "เทียบ BFS×V", value: "Warshall: O(V³)<br>BFS×V: O(V·(V+E)) — ดีกว่าเมื่อ sparse" },
      ]} />

      <PF11 items={[
        { trap: "เขียน R[i][j] = R[i][k] && R[k][j] (ไม่มี OR)", fix: "ต้อง OR กับค่าเดิม — ไม่งั้นค่าเดิมหาย" },
        { trap: "ใช้กับ shortest path", fix: "Warshall TC ไม่บอกระยะทาง — ใช้ Floyd-Warshall แทน" },
        { trap: "ลืม init diagonal: R[i][i] = 1", fix: "บางตำราถือว่า i reach i ในตัวเอง — เช็คโจทย์ว่านิยามอย่างไร" },
      ]} />

      <Quiz11 q="กำหนดกราฟทิศทาง 0→1, 1→2, 2→3, 3→1. หา R[0][3]?"
        options={["0", "1", "ขึ้นกับ k", "ไม่นิยาม"]}
        answer={1}
        explain="path 0→1→2→3 มี → R[0][3] = 1" />

      <Quiz11 q="ความต่างหลักของ Warshall TC กับ Floyd-Warshall?"
        options={[
          "ความเร็วต่างกัน",
          "ใช้ operator ต่างกัน (OR/AND vs min/+) — ตอบคำถามคนละแบบ",
          "Warshall ใช้กับ undirected เท่านั้น",
          "Floyd ต้องเรียงเรนเดอร์ก่อน"
        ]}
        answer={1}
        explain="โครงสร้าง 3-loop เหมือนกัน แต่ Warshall = boolean reachability, Floyd = numeric distance" />
    </React.Fragment>
  );
};

/* ============================================================
   58 — COUNTING / RADIX SORT
============================================================ */
Lessons11["counting-sort"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Counting Sort & Radix Sort — Linear-time sorting</div>
        Sort ที่<b>ไม่ใช้การเปรียบเทียบ</b> → ทะลุ lower bound O(n log n) ของ comparison sort<br />
        ใช้ได้เมื่อข้อมูลเป็นจำนวนเต็มในช่วงจำกัด
      </div>

      <h3>Counting Sort — O(n + k)</h3>
      <p style={{ color: 'var(--text-1)' }}>k = ค่ามากสุด — เก็บจำนวนของแต่ละค่าใน <code>count[]</code></p>
      <pre className="code">{`void countingSort(vector<int>& a) {
  int mx = *max_element(a.begin(), a.end());
  vector<int> count(mx + 1, 0);

  // นับ
  for (int x : a) count[x]++;

  // cumulative — ทำให้ stable
  for (int i = 1; i <= mx; i++) count[i] += count[i-1];

  // เขียนกลับจากท้าย (stable)
  vector<int> out(a.size());
  for (int i = a.size() - 1; i >= 0; i--) {
    out[--count[a[i]]] = a[i];
  }
  a = out;
}`}</pre>

      <WE11
        title="Counting Sort กับ [4, 2, 2, 8, 3, 3, 1]"
        problem="step-by-step"
        steps={[
          { title: "นับความถี่", body: "count: [0,1,2,2,1,0,0,0,1]\n(index = ค่า; value = นับ)" },
          { title: "Cumulative", body: "count: [0,1,3,5,6,6,6,6,7]\n→ count[i] = จำนวนที่ ≤ i" },
          { title: "Place ใน output (จากท้าย — stable)", body: "i=6: a[6]=1, count[1]-- =0, out[0]=1\ni=5: a[5]=3, count[3]-- =4, out[4]=3\n... ต่อ" },
        ]}
        answer="[1, 2, 2, 3, 3, 4, 8]"
        takeaway="O(n+k) — เร็วมากเมื่อ k ไม่ใหญ่; ถ้า k = n² → ช้ากว่า merge sort"
      />

      <h3>Radix Sort — O(d · (n + k))</h3>
      <p style={{ color: 'var(--text-1)' }}>เรียงทีละหลัก (digit) ใช้ counting sort เป็น subroutine — d = จำนวนหลัก</p>
      <pre className="code">{`// LSD radix sort (least significant digit first)
void radixSort(vector<int>& a) {
  int mx = *max_element(a.begin(), a.end());
  for (int exp = 1; mx / exp > 0; exp *= 10)
    countingSortByDigit(a, exp);
}

void countingSortByDigit(vector<int>& a, int exp) {
  int n = a.size();
  vector<int> out(n), count(10, 0);
  for (int x : a) count[(x / exp) % 10]++;
  for (int i = 1; i < 10; i++) count[i] += count[i-1];
  for (int i = n - 1; i >= 0; i--)
    out[--count[(a[i] / exp) % 10]] = a[i];
  a = out;
}`}</pre>

      <CS11 title="Linear Sort" sections={[
        { label: "COUNTING", value: "Time O(n+k)<br>Space O(n+k)<br>Stable ✓<br>เหมาะ k ไม่ใหญ่", mono: true },
        { label: "RADIX", value: "Time O(d(n+k))<br>d = หลัก, k = 10<br>Stable ✓<br>เหมาะกับ integer ขนาดคงที่", mono: true },
        { label: "BUCKET", value: "Time O(n+k) avg<br>O(n²) worst<br>เหมาะข้อมูลกระจายสม่ำเสมอ" },
        { label: "WHEN TO USE", value: "ข้อมูลเป็น int + range ไม่ใหญ่<br>ต้องการ stable<br>เปรียบเทียบ string ตามตัวอักษร" },
      ]} />

      <PF11 items={[
        { trap: "Counting sort กับ k = 10⁹", fix: "memory ระเบิด! ใช้ได้แค่ k เล็ก" },
        { trap: "เขียนกลับ output จากด้านหน้า", fix: "ต้องจากท้ายเพื่อ stable" },
        { trap: "Radix sort กับ floating point", fix: "ต้องแปลงเป็น int หรือ bucket sort แทน" },
      ]} />

      <Quiz11 q="Counting sort 100 ค่าที่อยู่ในช่วง 0-1000000 ดีไหม?"
        options={["ดี O(n)", "ไม่ดี memory O(10⁶)", "ดีถ้าเรียงแล้ว", "ไม่มีผล"]}
        answer={1} explain="k=10⁶ → ใช้ memory เกินจำเป็น; ใช้ Quicksort หรือ Merge sort ดีกว่า" />
    </React.Fragment>
  );
};

/* ============================================================
   58b — BUCKET SORT (digit-based, ตามชีท week_2)
============================================================ */
function BucketSortViz() {
  // KMUTNB sheet example: 29, 25, 3, 49, 9, 37, 21, 43
  const INITIAL = [29, 25, 3, 49, 9, 37, 21, 43];
  const [step, setStep] = useS11(0);
  const arr = INITIAL;
  const n = arr.length;
  const digits = ['ones', 'tens'];
  // Compute pass results
  const passes = [];
  {
    let cur = [...arr];
    for (let exp = 1, label = 0; label < 2; exp *= 10, label++) {
      const buckets = Array.from({ length: 10 }, () => []);
      for (const x of cur) buckets[Math.floor(x / exp) % 10].push(x);
      const collected = [].concat(...buckets);
      passes.push({ digit: label === 0 ? 'หลักหน่วย (ones)' : 'หลักสิบ (tens)', exp, before: [...cur], buckets, after: collected });
      cur = collected;
    }
  }
  // 5 steps: 0=initial, 1=after pass1 distribute, 2=after pass1 collect, 3=after pass2 distribute, 4=sorted
  const STEPS = [
    { title: '1) เริ่มต้น', desc: `อาเรย์: [${arr.join(', ')}]` },
    { title: '2) Pass หลักหน่วย — แจก buckets[d] = (x ÷ 1) mod 10', desc: 'เลขแต่ละตัวลงตามหลักหน่วยของมัน' },
    { title: '3) Pass หลักหน่วย — เก็บกลับเป็นอาเรย์', desc: `เรียงตาม bucket index 0→9: [${passes[0].after.join(', ')}]` },
    { title: '4) Pass หลักสิบ — แจก buckets[d] = (x ÷ 10) mod 10', desc: 'เลขลงตามหลักสิบ — ข้อมูลถูก stable เรียงตามหลักหน่วยอยู่แล้ว' },
    { title: '5) เก็บกลับ — เรียงเสร็จ', desc: `ผลลัพธ์: [${passes[1].after.join(', ')}] ✓` },
  ];
  const cur = STEPS[step];
  // pick which pass's buckets to display
  const showBuckets = step === 1 ? passes[0].buckets : step === 3 ? passes[1].buckets : null;
  const before = step <= 2 ? passes[0].before : passes[1].before;
  const after = step <= 1 ? null : step === 2 ? passes[0].after : step >= 4 ? passes[1].after : null;

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {step + 1} / {STEPS.length}</span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step >= STEPS.length - 1}>▶</button>
        <button onClick={() => setStep(0)}>↺</button>
      </div>
      <div className="callout info" style={{ marginTop: 8 }}>
        <div className="ttl">{cur.title}</div>
        <span style={{ color: 'var(--text-1)' }}>{cur.desc}</span>
      </div>
      {/* before array */}
      <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-2)' }}>Input:</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
        {before.map((v, i) => (
          <div key={i} className="cell" style={{ background: 'var(--bg-2)', color: 'var(--text-0)', minWidth: 36 }}>{v}</div>
        ))}
      </div>
      {/* buckets grid */}
      {showBuckets && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>Buckets (index = digit ที่กำลังพิจารณา):</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
            {showBuckets.map((b, d) => (
              <div key={d} style={{ background: 'var(--bg-1)', border: '1px solid var(--bg-3)', borderRadius: 6, padding: 4, minHeight: 60 }}>
                <div style={{ fontSize: 10, color: 'var(--text-2)', textAlign: 'center', marginBottom: 4 }}>{d}</div>
                {b.map((v, i) => (
                  <div key={i} className="cell" style={{ background: 'var(--accent)', color: '#000', fontSize: 11, padding: '2px 4px', margin: '2px 0', textAlign: 'center' }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* after array */}
      {after && (
        <>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-2)' }}>หลัง collect:</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
            {after.map((v, i) => (
              <div key={i} className="cell" style={{ background: step === 4 ? 'var(--success)' : 'var(--accent-3)', color: '#000', minWidth: 36 }}>{v}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

Lessons11["bucket-sort"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Bucket Sort — เรียงด้วย "ถัง" (digit-based, ตามชีท KMUTNB)</div>
        ใช้ "ถัง 10 ใบ" (bucket 0–9) แจกข้อมูลตามหลักของเลข เริ่มจากหลักหน่วย → หลักสิบ → ... จนครบทุกหลัก
        — เป็นวิธีหนึ่งของ <b>LSD Radix-by-digit</b>
      </div>

      <h3>แนวคิด</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>สร้างถัง 10 ใบ (index 0 ถึง 9)</li>
        <li>แจกแต่ละเลขใน input ลงถัง <code>buckets[(x ÷ exp) mod 10]</code> เริ่มจาก exp = 1 (หลักหน่วย)</li>
        <li>เก็บกลับเป็นอาเรย์ตามลำดับ bucket index (0 → 9)</li>
        <li>ไป exp = 10, 100, ... ทำซ้ำจนหมดหลัก</li>
        <li><b>สำคัญ</b>: ต้อง stable (ลำดับเดิมในถังเดียวกันต้องคงเดิม) ไม่งั้น sort ผิด</li>
      </ol>

      <h3>ตัวอย่าง — week_2 p.52-54 (n = 8)</h3>
      <BucketSortViz />

      <h3>Pseudocode</h3>
      <pre className="code">{`void bucketSort(int a[], int n) {
  int mx = max(a, a+n);
  // ทำทีละหลัก: ones → tens → hundreds → ...
  for (int exp = 1; mx / exp > 0; exp *= 10) {
    vector<int> buckets[10];
    for (int i = 0; i < n; i++)
      buckets[(a[i] / exp) % 10].push_back(a[i]);

    int k = 0;
    for (int d = 0; d < 10; d++)
      for (int v : buckets[d])
        a[k++] = v;     // stable: เก็บตามลำดับเดิม
  }
}`}</pre>

      <h3>Complexity</h3>
      <table className="tbl">
        <thead><tr><th>กรณี</th><th>เวลา</th><th>หมายเหตุ</th></tr></thead>
        <tbody>
          <tr><td>เวลา</td><td>O(d · (n + k))</td><td>d = จำนวนหลัก, k = 10</td></tr>
          <tr><td>เวลา (n ใหญ่, ตัวเลขจำกัด)</td><td>O(n)</td><td>เมื่อ d คงที่</td></tr>
          <tr><td>พื้นที่</td><td>O(n + k)</td><td>สำหรับ buckets</td></tr>
        </tbody>
      </table>

      <h3>เปรียบเทียบกับ Counting / Radix</h3>
      <table className="cmp">
        <thead><tr><th>แบบ</th><th>หลักการ</th><th>เมื่อใช้</th></tr></thead>
        <tbody>
          <tr><td>Bucket (digit-based)</td><td>10 ถัง ตามหลัก</td><td>integer หลายหลัก, k คงที่</td></tr>
          <tr><td>Counting</td><td>count[ค่า] ของแต่ละค่า</td><td>integer, k ไม่ใหญ่</td></tr>
          <tr><td>Radix (LSD)</td><td>Counting Sort เป็น subroutine ทีละหลัก</td><td>integer, k ใหญ่</td></tr>
        </tbody>
      </table>

      <PF11 items={[
        { trap: "ใช้กับ floating point หรือเลขลบ", fix: "ต้อง normalize เป็น int positive ก่อน — หรือใช้ Counting/Comparison sort" },
        { trap: "ลืม stable — ลำดับในถังพัง", fix: "ใช้ queue (FIFO) ในถัง — push เข้าท้าย pop จากหน้า" },
        { trap: "คิดว่า O(n) เสมอ", fix: "d = log₁₀(max) — ถ้าค่าใหญ่มาก d ก็มาก → ไม่ได้ดีกว่า quicksort เสมอ" },
      ]} />

      <Quiz11 q="Bucket Sort กับ [29, 25, 3, 49, 9, 37, 21, 43] — หลัง pass หลักหน่วย จะได้ลำดับ?"
        options={[
          "[3, 9, 21, 25, 29, 37, 43, 49]",
          "[21, 3, 43, 25, 37, 29, 9, 49]",
          "[3, 21, 25, 29, 37, 43, 49, 9]",
          "[29, 25, 3, 49, 9, 37, 21, 43]"
        ]}
        answer={1}
        explain="แจกตามหลักหน่วย: bucket[1]={21}, bucket[3]={3,43}, bucket[5]={25}, bucket[7]={37}, bucket[9]={29,49,9} → เก็บกลับเรียงตาม index ถัง" />

      <Quiz11 q="ถ้าเลขใหญ่ถึง 1,000,000,000 (9 หลัก) Bucket Sort ทำงาน?"
        options={[
          "O(n)",
          "O(9 · (n + 10)) = O(n)",
          "O(n²)",
          "ใช้ไม่ได้"
        ]}
        answer={1}
        explain="d = 9 หลัก เป็น constant → O(d·n) = O(n) แต่ค่า constant ใหญ่กว่าตอน d เล็ก" />
    </React.Fragment>
  );
};

/* ============================================================
   59 — TRIE
============================================================ */
function TrieViz() {
  const [words, setWords] = useS11(['cat', 'car', 'card', 'care', 'careful', 'cars', 'dog']);
  const [input, setInput] = useS11('');
  const [search, setSearch] = useS11('');

  const trie = useM11(() => {
    const root = { children: {}, end: false };
    for (const w of words) {
      let cur = root;
      for (const c of w) {
        if (!cur.children[c]) cur.children[c] = { children: {}, end: false };
        cur = cur.children[c];
      }
      cur.end = true;
    }
    return root;
  }, [words]);

  const searchPath = useM11(() => {
    if (!search) return new Set();
    const path = new Set();
    let cur = trie;
    let id = '';
    for (const c of search) {
      id += c;
      path.add(id);
      cur = cur.children[c];
      if (!cur) break;
    }
    return path;
  }, [search, trie]);

  function renderNode(node, char, prefix, depth) {
    const id = prefix + char;
    const onPath = searchPath.has(id);
    const childChars = Object.keys(node.children).sort();
    return (
      <div key={id} style={{ marginLeft: depth * 16 }}>
        <span style={{
          display: 'inline-block', padding: '3px 10px', margin: '2px 0', borderRadius: 4,
          background: onPath ? 'var(--accent)' : node.end ? 'rgba(16,185,129,0.2)' : 'var(--bg-3)',
          color: onPath ? '#000' : 'var(--text-0)',
          fontFamily: 'monospace', fontWeight: 600,
          border: node.end ? '1px solid #10b981' : '1px solid transparent'
        }}>{char || 'root'}{node.end && ' ✓'}</span>
        {childChars.map(c => renderNode(node.children[c], c, id, depth + 1))}
      </div>
    );
  }

  return (
    <div className="dsv">
      <div className="ctrls">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="คำใหม่" style={{ width: 120 }} />
        <button onClick={() => { if (input) { setWords([...words, input]); setInput(''); } }}>+ Insert</button>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้น prefix" style={{ width: 120 }} />
        <button onClick={() => setWords(['cat', 'car', 'card', 'care', 'careful', 'cars', 'dog'])}>🔄 Reset</button>
      </div>
      <div style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        {renderNode(trie, '', '', 0)}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        🟢 มี ✓ = ปลายคำ &nbsp; 🟡 เน้น = path ของ search
      </div>
    </div>
  );
}

Lessons11["trie"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Trie — Prefix Tree</div>
        เก็บ string แบบ tree โดย<b>แชร์ prefix</b> — ค้นคำ / autocomplete / spell check<br />
        Insert/Search/Delete: <b>O(L)</b> เมื่อ L = ความยาวคำ
      </div>

      <h3>โครงสร้าง</h3>
      <pre className="code">{`struct TrieNode {
  TrieNode* children[26];  // หรือ unordered_map<char, TrieNode*>
  bool isEnd;
  TrieNode() : isEnd(false) { fill(children, children+26, nullptr); }
};

class Trie {
  TrieNode* root;
public:
  Trie() { root = new TrieNode(); }
  void insert(string w) {
    TrieNode* cur = root;
    for (char c : w) {
      int i = c - 'a';
      if (!cur->children[i]) cur->children[i] = new TrieNode();
      cur = cur->children[i];
    }
    cur->isEnd = true;
  }
  bool search(string w) {
    TrieNode* cur = root;
    for (char c : w) {
      int i = c - 'a';
      if (!cur->children[i]) return false;
      cur = cur->children[i];
    }
    return cur->isEnd;
  }
  bool startsWith(string p) {  // ใช้ autocomplete
    TrieNode* cur = root;
    for (char c : p) {
      int i = c - 'a';
      if (!cur->children[i]) return false;
      cur = cur->children[i];
    }
    return true;
  }
};`}</pre>

      <h3>🧪 Live Trie</h3>
      <TrieViz />

      <CS11 title="Trie" sections={[
        { label: "TIME", value: "Insert/Search: O(L)<br>Prefix search: O(L)", mono: true },
        { label: "SPACE", value: "O(ALPHABET_SIZE × N × L) worst<br>ลด memory ด้วย compressed trie / suffix tree" },
        { label: "USES", value: "Autocomplete (Google search)<br>Spell check<br>IP routing<br>Longest common prefix<br>Word puzzles" },
        { label: "vs HASH", value: "Hash: O(L) avg แต่ collision\nTrie: O(L) garantee + prefix ops O(L)" },
      ]} />

      <Quiz11 q="ค้น autocomplete 'car' ใน Trie ที่มี [car, card, care, cat] ได้กี่คำ?"
        options={["1", "2", "3", "4"]} answer={2} explain="car, card, care (cat ไม่ใช่ prefix 'car')" />
    </React.Fragment>
  );
};

/* ============================================================
   60 — UNION-FIND / DSU
============================================================ */
function DSUViz() {
  const N = 8;
  const [parent, setParent] = useS11(Array.from({ length: N }, (_, i) => i));
  const [size, setSize] = useS11(Array(N).fill(1));
  const [a, setA] = useS11('0');
  const [b, setB] = useS11('1');
  const [msg, setMsg] = useS11('');

  const find = (p, i) => {
    while (p[i] !== i) i = p[i];
    return i;
  };

  const union = () => {
    const i = +a, j = +b;
    if (isNaN(i) || isNaN(j)) return;
    const p = [...parent], s = [...size];
    const ri = find(p, i), rj = find(p, j);
    if (ri === rj) { setMsg(`${i}, ${j} อยู่กลุ่มเดียวกันแล้ว`); return; }
    // union by size
    if (s[ri] < s[rj]) { p[ri] = rj; s[rj] += s[ri]; }
    else { p[rj] = ri; s[ri] += s[rj]; }
    setParent(p); setSize(s);
    setMsg(`Union(${i}, ${j}) → ใส่ใต้ root ${s[ri] >= s[rj] ? ri : rj}`);
  };

  const findOp = () => {
    const i = +a;
    if (isNaN(i)) return;
    setMsg(`find(${i}) = ${find(parent, i)}`);
  };

  return (
    <div className="dsv">
      <div className="ctrls">
        <input type="number" value={a} onChange={e => setA(e.target.value)} style={{ width: 60 }} placeholder="i" />
        <input type="number" value={b} onChange={e => setB(e.target.value)} style={{ width: 60 }} placeholder="j" />
        <button onClick={union}>Union(i,j)</button>
        <button onClick={findOp}>Find(i)</button>
        <button onClick={() => { setParent(Array.from({ length: N }, (_, i) => i)); setSize(Array(N).fill(1)); setMsg(''); }}>🔄 Reset</button>
      </div>
      <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 10 }}>{msg}</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {parent.map((p, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 13 }}>
            <div style={{
              width: 40, height: 40, background: find(parent, i) === i ? 'var(--accent)' : 'var(--bg-3)',
              color: find(parent, i) === i ? '#000' : 'var(--text-0)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
            }}>{i}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>→ {p}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <b>Groups:</b>
        {(() => {
          const groups = {};
          for (let i = 0; i < N; i++) {
            const r = find(parent, i);
            if (!groups[r]) groups[r] = [];
            groups[r].push(i);
          }
          return Object.entries(groups).map(([r, g]) => (
            <span key={r} style={{ display: 'inline-block', margin: '4px 6px', padding: '4px 10px', background: 'var(--bg-3)', borderRadius: 4, fontFamily: 'monospace' }}>
              {`{${g.join(',')}}`}
            </span>
          ));
        })()}
      </div>
    </div>
  );
}

Lessons11["union-find"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Union-Find (Disjoint Set Union)</div>
        เก็บกลุ่ม (set) ที่ไม่ซ้อนกัน — รองรับ 2 operation: <b>find(x)</b> หา root, <b>union(x,y)</b> รวมกลุ่ม<br />
        ใช้ใน Kruskal MST, Connected Components, Cycle Detection
      </div>

      <h3>โค้ดพื้นฐาน</h3>
      <pre className="code">{`class DSU {
  vector<int> parent, rank_;
public:
  DSU(int n) : parent(n), rank_(n, 0) {
    iota(parent.begin(), parent.end(), 0);
  }
  int find(int x) {
    if (parent[x] != x)
      parent[x] = find(parent[x]);   // path compression!
    return parent[x];
  }
  bool union_(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return false;     // already same set
    // union by rank
    if (rank_[rx] < rank_[ry]) swap(rx, ry);
    parent[ry] = rx;
    if (rank_[rx] == rank_[ry]) rank_[rx]++;
    return true;
  }
};`}</pre>

      <h3>🧪 Live DSU</h3>
      <DSUViz />

      <h3>Optimization 2 อย่าง</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Path Compression</b> — ตอน find ทำให้ทุก node ใน path ชี้ตรงไป root → ทำให้ tree แบน</li>
        <li><b>Union by Rank/Size</b> — รวม tree เล็กเข้าใต้ tree ใหญ่ → tree ไม่สูง</li>
      </ol>
      <p style={{ color: 'var(--text-1)' }}>ทั้งสองรวมกัน → <b>amortized O(α(n))</b> ≈ O(1) (α = inverse Ackermann)</p>

      <CS11 title="Union-Find" sections={[
        { label: "TIME (with both opts)", value: "find: ~O(1) amortized<br>union: ~O(1) amortized", mono: true },
        { label: "USES", value: "Kruskal MST<br>Connected Components<br>Cycle detection (undirected)<br>Image segmentation<br>Online connectivity" },
        { label: "PATTERN", value: "เมื่อต้องเช็คว่า 2 ตัวอยู่กลุ่มเดียวกันไหม + รวมกลุ่ม → DSU" },
      ]} />

      <PF11 items={[
        { trap: "ลืม path compression", fix: "Worst case O(n) ต่อ operation! ใส่ <code>parent[x] = find(parent[x])</code>" },
        { trap: "Init แค่ <code>vector&lt;int&gt; parent(n)</code>", fix: "ทุก parent[i] = 0 ผิด! ต้อง <code>iota</code> ให้ parent[i] = i" },
      ]} />

      <Quiz11 q="DSU ใช้ใน MST algorithm ไหน?"
        options={["Prim", "Kruskal", "ทั้งคู่", "ไม่ใช้"]} answer={1} explain="Kruskal ใช้ DSU เช็คว่า edge ทำให้เกิด cycle ไหม; Prim ใช้ min-heap" />
    </React.Fragment>
  );
};

/* ============================================================
   61 — SEGMENT TREE / FENWICK
============================================================ */
Lessons11["segment-tree"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Segment Tree & Fenwick (BIT)</div>
        Range query + Point update ใน <b>O(log n)</b> — เร็วกว่า prefix sum ที่ update O(n)
      </div>

      <h3>ปัญหาที่แก้</h3>
      <p style={{ color: 'var(--text-1)' }}>มี array a[0..n-1] รองรับ 2 operation:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>update(i, v)</b> — เปลี่ยน a[i] = v</li>
        <li><b>query(l, r)</b> — คืน sum (หรือ min/max) ของ a[l..r]</li>
      </ul>

      <table className="tbl">
        <thead><tr><th>วิธี</th><th>update</th><th>query</th></tr></thead>
        <tbody>
          <tr><td>Naive</td><td>O(1)</td><td>O(n)</td></tr>
          <tr><td>Prefix Sum</td><td>O(n)</td><td>O(1)</td></tr>
          <tr><td><b>Segment Tree</b></td><td>O(log n)</td><td>O(log n)</td></tr>
          <tr><td>Fenwick (BIT)</td><td>O(log n)</td><td>O(log n)</td></tr>
        </tbody>
      </table>

      <h3>Segment Tree</h3>
      <pre className="code">{`class SegTree {
  vector<int> tree;
  int n;
public:
  SegTree(vector<int>& a) : n(a.size()), tree(4*a.size()) {
    build(a, 1, 0, n-1);
  }
  void build(vector<int>& a, int v, int l, int r) {
    if (l == r) { tree[v] = a[l]; return; }
    int m = (l+r)/2;
    build(a, 2*v, l, m);
    build(a, 2*v+1, m+1, r);
    tree[v] = tree[2*v] + tree[2*v+1];
  }
  int query(int v, int tl, int tr, int l, int r) {
    if (l > r) return 0;
    if (l == tl && r == tr) return tree[v];
    int tm = (tl+tr)/2;
    return query(2*v, tl, tm, l, min(r,tm))
         + query(2*v+1, tm+1, tr, max(l,tm+1), r);
  }
  void update(int v, int tl, int tr, int pos, int val) {
    if (tl == tr) { tree[v] = val; return; }
    int tm = (tl+tr)/2;
    if (pos <= tm) update(2*v, tl, tm, pos, val);
    else update(2*v+1, tm+1, tr, pos, val);
    tree[v] = tree[2*v] + tree[2*v+1];
  }
};`}</pre>

      <h3>Fenwick Tree (Binary Indexed Tree) — เบาและเร็ว</h3>
      <pre className="code">{`class BIT {
  vector<int> bit;
public:
  BIT(int n) : bit(n+1, 0) {}
  void update(int i, int delta) {       // i เป็น 1-indexed
    for (; i < (int)bit.size(); i += i & -i)
      bit[i] += delta;
  }
  int query(int i) {                    // sum ของ a[1..i]
    int s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];
    return s;
  }
  int rangeQuery(int l, int r) {
    return query(r) - query(l-1);
  }
};`}</pre>

      <CS11 title="Segment Tree / BIT" sections={[
        { label: "SEG TREE", value: "Time O(log n)<br>Space O(4n)<br>Flexible (any associative op)" },
        { label: "FENWICK BIT", value: "Time O(log n)<br>Space O(n) — เล็กกว่า<br>เร็วกว่าด้วย bit trick<br>แต่ทำได้แค่ prefix" },
        { label: "USES", value: "Range sum/min/max query<br>Inversion count<br>Online statistics<br>Competitive programming" },
      ]} />

      <Quiz11 q="หา sum ของ a[3..7] ใน array 10 ตัว — segment tree complexity?"
        options={["O(1)", "O(log n)", "O(n)", "O(n log n)"]} answer={1} />
    </React.Fragment>
  );
};

/* ============================================================
   62 — ALGORITHM QUEST (mini game)
============================================================ */
const QUEST_LEVELS = [
  { boss: '🐺 หมาป่าน้อย', q: 'หา Big-O ของ Linear Search?', a: 'O(n)', hp: 1, hint: 'ดูทีละช่อง' },
  { boss: '🦊 จิ้งจอก', q: 'Bubble sort 1 pass [3,1,2]?', a: '[1,2,3]', hp: 2, hint: '(3,1)→swap, (3,2)→swap' },
  { boss: '🐻 หมีน้อย', q: 'Binary search ต้องการ array แบบไหน?', a: 'sorted', hp: 2, hint: 'เรียงแล้ว' },
  { boss: '🐯 เสือ', q: 'T(n) = 2T(n/2) + n → Big-O?', a: 'O(n log n)', hp: 3, hint: 'Master theorem case 2 / merge sort' },
  { boss: '🦁 สิงโต', q: 'DS ที่ BFS ใช้?', a: 'queue', hp: 3, hint: 'FIFO' },
  { boss: '🐉 มังกร', q: 'Permutation 5 ตัวมีกี่แบบ?', a: '120', hp: 4, hint: '5!' },
  { boss: '👹 ปีศาจ', q: 'Strassen ลด multiplication จาก 8 → ?', a: '7', hp: 5, hint: 'M1-M7' },
  { boss: '👑 ราชาขั้นสุด', q: 'Recurrence ของ Tower of Hanoi T(n) = ?', a: '2T(n-1)+1', hp: 6, hint: 'doubling pattern' },
];

Lessons11["quest"] = function () {
  const [lv, setLv] = useS11(0);
  const [hp, setHp] = useS11(QUEST_LEVELS[0].hp);
  const [ans, setAns] = useS11('');
  const [msg, setMsg] = useS11('');
  const [done, setDone] = useS11(false);
  const [showHint, setShowHint] = useS11(false);

  const boss = QUEST_LEVELS[lv];

  const attack = () => {
    const correct = ans.trim().toLowerCase().replace(/\s/g, '') === boss.a.toLowerCase().replace(/\s/g, '');
    if (correct) {
      const newHp = hp - 1;
      if (newHp === 0) {
        if (lv + 1 >= QUEST_LEVELS.length) {
          setMsg('🏆 ชนะทุกด่าน! คุณคือ Algorithm Master!');
          setDone(true);
        } else {
          setMsg(`⚔️ คุณกำจัด ${boss.boss} ได้! ไปด่านต่อไป...`);
          setTimeout(() => {
            setLv(lv + 1);
            setHp(QUEST_LEVELS[lv + 1].hp);
            setMsg('');
            setAns('');
            setShowHint(false);
          }, 1500);
        }
      } else {
        setHp(newHp);
        setMsg(`💥 โจมตี! ${boss.boss} เหลือ HP ${newHp}/${boss.hp}`);
        setAns('');
      }
    } else {
      setMsg(`❌ ตอบไม่ถูก! ${boss.boss} โจมตีกลับ!`);
    }
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⚔️ Algorithm Quest — RPG เรียน Algorithm</div>
        ตอบโจทย์ถูก = โจมตี boss · ตอบผิด = โดนตี · ผ่านทุกด่าน = master!
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(94,234,212,0.1), rgba(168,139,250,0.1))', padding: 20, borderRadius: 12, textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>ด่านที่ {lv + 1} / {QUEST_LEVELS.length}</div>
        <div style={{ fontSize: 48, margin: '10px 0' }}>{boss.boss.split(' ')[0]}</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{boss.boss}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
          {Array.from({ length: boss.hp }).map((_, i) => (
            <div key={i} style={{ width: 24, height: 14, background: i < hp ? '#f87171' : 'var(--bg-3)', borderRadius: 2 }}></div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>HP {hp}/{boss.hp}</div>
      </div>

      {!done && (
        <React.Fragment>
          <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 8, marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, marginBottom: 6 }}>📜 โจทย์ของ boss:</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 10 }}>{boss.q}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={ans} onChange={e => setAns(e.target.value)} onKeyDown={e => e.key === 'Enter' && attack()}
                placeholder="ตอบที่นี่ → กด Enter โจมตี"
                style={{ flex: 1, padding: 10, fontSize: 14, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }} />
              <button onClick={attack} style={{ background: '#f87171', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>⚔️ โจมตี!</button>
            </div>
            <button onClick={() => setShowHint(true)} style={{ marginTop: 6, background: 'transparent', color: '#fbbf24', border: '1px solid #fbbf24', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
              💡 ขอ hint
            </button>
            {showHint && <div style={{ marginTop: 6, color: '#fbbf24', fontSize: 13 }}>💡 {boss.hint}</div>}
          </div>
        </React.Fragment>
      )}

      {msg && <div className="callout" style={{ background: done ? 'rgba(16,185,129,0.15)' : 'var(--bg-2)' }}>{msg}</div>}

      {done && (
        <button onClick={() => { setLv(0); setHp(QUEST_LEVELS[0].hp); setDone(false); setMsg(''); setAns(''); }}
          style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          🔄 เล่นใหม่
        </button>
      )}
    </React.Fragment>
  );
};

/* ============================================================
   BOOKMARK + THEME + EXPORT NOTES — Floating widgets
============================================================ */
function Bookmark() {
  const route = window.location.hash.replace(/^#\/?/, '') || 'home';
  const [bm, setBm] = useS11(() => {
    try { return JSON.parse(localStorage.getItem('algo-bookmarks') || '[]'); } catch { return []; }
  });
  if (route === 'home') return null;
  const isMarked = bm.includes(route);
  const toggle = () => {
    const next = isMarked ? bm.filter(x => x !== route) : [...bm, route];
    setBm(next);
    localStorage.setItem('algo-bookmarks', JSON.stringify(next));
  };
  return (
    <button onClick={toggle} title={isMarked ? 'เอาออกจาก bookmark' : 'เพิ่ม bookmark'}
      style={{
        position: 'fixed', right: 16, bottom: 116, zIndex: 100,
        background: isMarked ? '#fbbf24' : 'var(--bg-2)', color: isMarked ? '#000' : 'var(--text-1)',
        border: '1px solid ' + (isMarked ? '#fbbf24' : 'var(--border)'),
        padding: '8px 12px', borderRadius: 22, cursor: 'pointer', fontSize: 14, fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
      {isMarked ? '⭐' : '☆'}
    </button>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useS11(() => localStorage.getItem('algo-theme') !== 'light');
  useE11(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('algo-theme', dark ? 'dark' : 'light');
    // toggle CSS vars
    const r = document.documentElement.style;
    if (!dark) {
      r.setProperty('--bg-1', '#f8fafc');
      r.setProperty('--bg-2', '#ffffff');
      r.setProperty('--bg-3', '#e2e8f0');
      r.setProperty('--text-0', '#0f172a');
      r.setProperty('--text-1', '#334155');
      r.setProperty('--text-2', '#64748b');
      r.setProperty('--text-3', '#94a3b8');
      r.setProperty('--border', '#cbd5e1');
    } else {
      r.removeProperty('--bg-1'); r.removeProperty('--bg-2'); r.removeProperty('--bg-3');
      r.removeProperty('--text-0'); r.removeProperty('--text-1'); r.removeProperty('--text-2'); r.removeProperty('--text-3');
      r.removeProperty('--border');
    }
  }, [dark]);
  return (
    <button onClick={() => setDark(!dark)} title="Theme"
      style={{
        position: 'fixed', right: 16, bottom: 168, zIndex: 100,
        background: 'var(--bg-2)', color: 'var(--text-1)', border: '1px solid var(--border)',
        padding: '8px 12px', borderRadius: 22, cursor: 'pointer', fontSize: 14,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
      {dark ? '🌙' : '☀️'}
    </button>
  );
}

/* ============================================================
   63 — BOOKMARKS + EXPORT NOTES (full page)
============================================================ */
Lessons11["bookmarks"] = function () {
  const [bm, setBm] = useS11(() => {
    try { return JSON.parse(localStorage.getItem('algo-bookmarks') || '[]'); } catch { return []; }
  });
  const [notes, setNotes] = useS11(() => {
    try { return JSON.parse(localStorage.getItem('algo-notes') || '{}'); } catch { return {}; }
  });

  const items = bm.map(id => window.ALL_LESSONS.find(l => l.id === id)).filter(Boolean);

  const exportNotes = () => {
    let md = '# 📓 Algorithm Academy Notes\n\n';
    md += `Exported: ${new Date().toLocaleString()}\n\n`;
    for (const [id, text] of Object.entries(notes)) {
      if (!text || !text.trim()) continue;
      const l = window.ALL_LESSONS.find(x => x.id === id);
      const title = l ? `${l.num} · ${l.title}` : id;
      md += `## ${title}\n\n${text}\n\n---\n\n`;
    }
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algo-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const noteCount = Object.values(notes).filter(t => t && t.trim()).length;

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⭐ Bookmarks & Notes Export</div>
        บทที่กดดาวไว้ + export โน้ตทุกบทเป็น Markdown สำหรับเก็บ/พิมพ์
      </div>

      <h3>⭐ Bookmarked Lessons ({items.length})</h3>
      {items.length === 0 ? (
        <div style={{ color: 'var(--text-3)', padding: 20, textAlign: 'center' }}>ยังไม่มี bookmark — กดดาวที่มุมขวาล่างในหน้าบทเรียน</div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {items.map(l => (
            <a key={l.id} href={'#/' + l.id}
              style={{ display: 'block', background: 'var(--bg-2)', padding: 12, borderRadius: 8, textDecoration: 'none', color: 'var(--text-0)' }}>
              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{l.sectionTitle.toUpperCase()}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{l.num} · {l.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{l.desc}</div>
            </a>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>📓 Export Notes</h3>
      <p style={{ color: 'var(--text-1)' }}>คุณจดโน้ตไว้ <b>{noteCount}</b> บท — กด export ได้เป็น Markdown</p>
      <button onClick={exportNotes} disabled={noteCount === 0}
        style={{ background: noteCount ? 'var(--accent)' : 'var(--bg-3)', color: noteCount ? '#000' : 'var(--text-3)', padding: '10px 20px', border: 'none', borderRadius: 6, cursor: noteCount ? 'pointer' : 'not-allowed', fontWeight: 600 }}>
        📥 Download notes.md
      </button>
    </React.Fragment>
  );
};

window.LessonsPart11 = Lessons11;
window.Bookmark = Bookmark;
window.ThemeToggle = ThemeToggle;
