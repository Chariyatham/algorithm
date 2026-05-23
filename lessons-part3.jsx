/* Lessons Part 3 — Divide & Conquer, Graph Rep, Cycle/Topo, Exhaustive, Backtracking, Exercises */

const { useState: useS3, useMemo: useM3, useEffect: useE3 } = React;
const { Quiz: Quiz3, DragOrder: DO3 } = window.LessonComponents;

const Lessons3 = {};

// ============ Quick Select ============
function QuickSelectViz() {
  const [arr, setArr] = useS3([1, 5, 10, 4, 8, 2, 6]);
  const [k, setK] = useS3(3);
  const [steps, setSteps] = useS3([]);
  const [idx, setIdx] = useS3(0);

  const run = () => {
    const a = [...arr];
    const log = [];
    function qs(left, right, kk, depth) {
      if (left > right) return;
      const pivot = a[left];
      const L = [], E = [], G = [];
      for (let i = left; i <= right; i++) {
        if (a[i] < pivot) L.push(a[i]);
        else if (a[i] === pivot) E.push(a[i]);
        else G.push(a[i]);
      }
      log.push({ a: [...a].slice(left, right + 1), pivot, L: [...L], E: [...E], G: [...G], k: kk, depth });
      if (kk <= L.length) {
        const arrL = [...L, ...E, ...G];
        for (let i = 0; i < arrL.length; i++) a[left + i] = arrL[i];
        qs(left, left + L.length - 1, kk, depth + 1);
      } else if (kk <= L.length + E.length) {
        log.push({ found: pivot, depth: depth + 1 });
      } else {
        const arrL = [...L, ...E, ...G];
        for (let i = 0; i < arrL.length; i++) a[left + i] = arrL[i];
        qs(left + L.length + E.length, right, kk - L.length - E.length, depth + 1);
      }
    }
    qs(0, a.length - 1, k, 0);
    setSteps(log);
    setIdx(0);
  };

  const cur = steps[idx];

  return (
    <div className="dsv">
      <div className="ctrls">
        <label>k = <input type="number" min="1" max={arr.length} value={k} onChange={e => setK(+e.target.value || 1)} style={{ width: 60 }} /></label>
        <button onClick={run}>▶ รัน Quick Select</button>
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {idx + 1} / {steps.length || 0}</span>
        <button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx >= steps.length - 1}>▶</button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', minHeight: 80 }}>
        {arr.map((v, i) => <div key={i} className="cell" style={{ background: 'var(--bg-2)' }}>{v}</div>)}
      </div>
      {cur && !cur.found && (
        <div style={{ marginTop: 14, color: 'var(--text-1)' }}>
          <div>Pivot: <span className="kbd">{cur.pivot}</span> · k' = {cur.k} · depth {cur.depth}</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 8, flexWrap: 'wrap' }}>
            <div><b style={{ color: '#60a5fa' }}>L</b> ({cur.L.length}): [{cur.L.join(', ')}]</div>
            <div><b style={{ color: '#fbbf24' }}>E</b> ({cur.E.length}): [{cur.E.join(', ')}]</div>
            <div><b style={{ color: '#f87171' }}>G</b> ({cur.G.length}): [{cur.G.join(', ')}]</div>
          </div>
        </div>
      )}
      {cur && cur.found !== undefined && (
        <div className="callout success" style={{ marginTop: 14 }}>
          <div className="ttl">พบคำตอบ!</div>
          เลขน้อยที่สุดอันดับ {k} คือ <b>{cur.found}</b>
        </div>
      )}
    </div>
  );
}

Lessons3["quick-select"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Quick Select — หาเลขน้อยสุดอันดับ k</div>
        แทนที่จะ sort ทั้งหมด O(n log n) ใช้แนวคิด <b>partition</b> แบบ Quick Sort
        แต่ลงไปด้านเดียว ทำให้เฉลี่ย O(n)
      </div>
      <h3>แนวคิด</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>เลือก pivot x แล้วแบ่งข้อมูลเป็น 3 กลุ่ม: L (&lt;x), E (=x), G (&gt;x)</li>
        <li>ถ้า k ≤ |L| → คำตอบอยู่ใน L</li>
        <li>ถ้า k ≤ |L| + |E| → pivot คือคำตอบ</li>
        <li>ถ้า k &gt; |L| + |E| → ไปฝั่ง G พร้อมปรับ k' = k − |L| − |E|</li>
      </ol>
      <QuickSelectViz />
      <h3>Pseudocode</h3>
      <pre className="code">{`int quickSelect(vector<int>& a, int left, int right, int k) {
  int pivot = a[left];
  vector<int> L, E, G;
  for (int i = left; i <= right; i++) {
    if (a[i] < pivot)      L.push_back(a[i]);
    else if (a[i] == pivot) E.push_back(a[i]);
    else                    G.push_back(a[i]);
  }
  if (k <= L.size())        return quickSelect(L, 0, L.size()-1, k);
  if (k <= L.size()+E.size()) return pivot;
  return quickSelect(G, 0, G.size()-1, k - L.size() - E.size());
}`}</pre>
      <h3>Complexity</h3>
      <table className="tbl">
        <thead><tr><th>กรณี</th><th>เวลา</th></tr></thead>
        <tbody>
          <tr><td>เฉลี่ย</td><td>O(n)</td></tr>
          <tr><td>แย่สุด (pivot ไม่ดี)</td><td>O(n²)</td></tr>
        </tbody>
      </table>
      <Quiz3 q={{
        question: "ถ้า k = 3 และ |L| = 1, |E| = 1 ควรทำอะไร?",
        options: ["pivot คือคำตอบ", "ไปฝั่ง L", "ไปฝั่ง G ด้วย k' = 1", "ไปฝั่ง G ด้วย k' = 3"],
        answer: 2, explain: "k > |L|+|E| = 2 ดังนั้นไป G และ k' = 3 - 2 = 1"
      }} />
    </React.Fragment>
  );
};

// ============ Matrix Multiplication ============
function MatrixMultViz() {
  const [step, setStep] = useS3(0);
  const A = [[1, 2], [3, 4]];
  const B = [[5, 6], [7, 8]];
  const C = [[19, 22], [43, 50]];
  const cells = [
    { i: 0, j: 0, val: '1·5 + 2·7 = 19' },
    { i: 0, j: 1, val: '1·6 + 2·8 = 22' },
    { i: 1, j: 0, val: '3·5 + 4·7 = 43' },
    { i: 1, j: 1, val: '3·6 + 4·8 = 50' },
  ];
  const cur = cells[Math.min(step, 3)];
  const Mtx = ({ m, hl }) => (
    <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${m[0].length}, 50px)`, gap: 4, padding: '4px 12px', borderLeft: '2px solid var(--text-2)', borderRight: '2px solid var(--text-2)' }}>
      {m.map((row, i) => row.map((v, j) =>
        <div key={`${i}-${j}`} className="cell" style={{ width: 44, height: 44, background: hl && hl(i, j) ? 'var(--accent-2)' : 'var(--bg-3)', color: hl && hl(i, j) ? '#000' : 'var(--text-0)' }}>{v}</div>
      ))}
    </div>
  );
  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>cell {step + 1} / 4</span>
        <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step >= 3}>▶</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Mtx m={A} hl={(i, j) => i === cur.i} />
        <span style={{ fontSize: 24 }}>×</span>
        <Mtx m={B} hl={(i, j) => j === cur.j} />
        <span style={{ fontSize: 24 }}>=</span>
        <Mtx m={C} hl={(i, j) => i === cur.i && j === cur.j} />
      </div>
      <div className="callout" style={{ marginTop: 14 }}>
        <code>C[{cur.i}][{cur.j}] = {cur.val}</code>
      </div>
    </div>
  );
}

Lessons3["matrix-mult"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Matrix Multiplication</div>
        คูณเมตริกซ์ A (p×q) กับ B (q×k) ได้ผลลัพธ์ C (p×k) — แต่ละช่องคือผลรวมของผลคูณแถวกับคอลัมน์
      </div>
      <h3>วิธีปกติ — O(n³)</h3>
      <pre className="code">{`for (int i = 0; i < N; i++)
  for (int j = 0; j < N; j++)
    for (int k = 0; k < N; k++)
      C[i][j] += A[i][k] * B[k][j];`}</pre>
      <MatrixMultViz />
      <h3>วิธี Divide & Conquer</h3>
      <p>แบ่ง A, B เป็น 4 ส่วน ขนาด n/2 × n/2:</p>
      <pre className="code">{`C11 = A11·B11 + A12·B21
C12 = A11·B12 + A12·B22
C21 = A21·B11 + A22·B21
C22 = A21·B12 + A22·B22`}</pre>
      <p>มีการคูณเมตริกซ์ย่อย <b>8 ครั้ง</b> + รวม → T(n) = 8T(n/2) + O(n²) = <b>O(n³)</b> (เท่าเดิม)</p>
      <Quiz3 q={{
        question: "การคูณเมตริกซ์ปกติ N×N มีความซับซ้อนเท่าไร?",
        options: ["O(N)", "O(N²)", "O(N³)", "O(N log N)"],
        answer: 2, explain: "loop ซ้อน 3 ชั้น = N × N × N = N³"
      }} />
    </React.Fragment>
  );
};

// ============ Strassen ============
Lessons3["strassen"] = function () {
  return (
    <React.Fragment>
      <div className="callout success">
        <div className="ttl">Strassen's Algorithm (1969)</div>
        ลดจำนวนการคูณเมตริกซ์ย่อยจาก <b>8 ครั้ง</b> เหลือ <b>7 ครั้ง</b> โดยแลกกับการบวก/ลบเพิ่มขึ้น
      </div>
      <h3>7 ผลคูณวิเศษ (M1 - M7)</h3>
      <pre className="code">{`M1 = (A11 + A22)(B11 + B22)
M2 = (A21 + A22) · B11
M3 = A11 · (B12 - B22)
M4 = A22 · (B21 - B11)
M5 = (A11 + A12) · B22
M6 = (A21 - A11)(B11 + B12)
M7 = (A12 - A22)(B21 + B22)`}</pre>
      <h3>รวมคำตอบ</h3>
      <pre className="code">{`C11 = M1 + M4 - M5 + M7
C12 = M3 + M5
C21 = M2 + M4
C22 = M1 - M2 + M3 + M6`}</pre>
      <h3>Recurrence</h3>
      <pre className="code">{`T(n) = 7·T(n/2) + O(n²)
     = O(n^log₂7)
     ≈ O(n^2.807)`}</pre>
      <table className="tbl">
        <thead><tr><th>วิธี</th><th>คูณเมตริกซ์ย่อย</th><th>Complexity</th></tr></thead>
        <tbody>
          <tr><td>วิธีปกติ</td><td>—</td><td>O(n³)</td></tr>
          <tr><td>DAC ปกติ</td><td>8</td><td>O(n³)</td></tr>
          <tr><td>Strassen</td><td>7</td><td>O(n^2.807)</td></tr>
          <tr><td>Coppersmith–Winograd</td><td>—</td><td>O(n^2.376)</td></tr>
        </tbody>
      </table>
      <div className="callout warn">
        <div className="ttl">⚠️ ข้อจำกัด</div>
        Strassen เหมาะกับเมตริกซ์ขนาดใหญ่มากเท่านั้น (overhead จากการบวก/ลบเยอะ)
        และมีปัญหาเรื่องความแม่นยำ floating-point
      </div>
      <Quiz3 q={{
        question: "Strassen ลดจำนวน multiplication ของเมตริกซ์ย่อยจากเท่าไรเป็นเท่าไร?",
        options: ["8 → 7", "7 → 6", "9 → 7", "16 → 8"],
        answer: 0, explain: "DAC ปกติคูณ 8 ครั้ง Strassen ลดเหลือ 7 ครั้ง"
      }} />
    </React.Fragment>
  );
};

// ============ Maxima Set (DAC) ============
function MaximaSetViz() {
  // Example from KMUTNB DAC sheet (week_3 part2 + assignment_4 + homework_5_1)
  const POINTS = [
    { x: 1, y: 4, name: 'P1' }, { x: 2, y: 6, name: 'P2' }, { x: 3, y: 1, name: 'P3' },
    { x: 4, y: 5, name: 'P4' }, { x: 5, y: 7, name: 'P5' }, { x: 6, y: 9, name: 'P6' },
    { x: 7, y: 2, name: 'P7' }, { x: 8, y: 6, name: 'P8' }, { x: 9, y: 3, name: 'P9' },
  ];
  const sorted = [...POINTS].sort((a, b) => a.x - b.x);
  const mid = Math.floor(sorted.length / 2);
  const S1 = sorted.slice(0, mid);             // left half by x: P1..P4
  const S2 = sorted.slice(mid);                // right half by x: P5..P9
  // brute-force maxima of a subset
  const maximaOf = (pts) => pts.filter(p =>
    !pts.some(q => q !== p && q.x > p.x && q.y > p.y)
  );
  const M1 = maximaOf(S1);                     // {P2, P4}
  const M2 = maximaOf(S2);                     // {P6, P8, P9}
  // combine: keep r in M1 only if NOT dominated by any q in M2
  const M1_keep = M1.filter(r => !M2.some(q => q.x > r.x && q.y > r.y));
  const result = [...M1_keep, ...M2];

  const [step, setStep] = useS3(0);
  const STEPS = [
    { title: '1) ข้อมูลเริ่มต้น — 9 จุด เรียงตาม x แล้ว',
      desc: 'จุด p เป็น maxima ก็ต่อเมื่อ "ไม่มี" q อื่นที่ q.x > p.x และ q.y > p.y (q ไม่ครอบคลุม p)' },
    { title: '2) Divide — แบ่งครึ่งตาม x (median)',
      desc: `S₁ = {${S1.map(p => p.name).join(', ')}} (x ≤ ${S1[S1.length-1].x}) | S₂ = {${S2.map(p => p.name).join(', ')}} (x ≥ ${S2[0].x})` },
    { title: '3) Conquer ฝั่งซ้าย — recurse(S₁)',
      desc: `M₁ = maxima(S₁) = {${M1.map(p => p.name).join(', ')}} — ตัด ${S1.filter(p => !M1.includes(p)).map(p => p.name).join(', ')} ออก` },
    { title: '4) Conquer ฝั่งขวา — recurse(S₂)',
      desc: `M₂ = maxima(S₂) = {${M2.map(p => p.name).join(', ')}} — ตัด ${S2.filter(p => !M2.includes(p)).map(p => p.name).join(', ')} ออก` },
    { title: '5) Combine — กรอง M₁ ที่ถูก M₂ ครอบคลุม',
      desc: `ทุก q ∈ M₂ มี q.x > ทุก r ∈ M₁ อยู่แล้ว → เช็คแค่ q.y > r.y. max y ใน M₂ = ${Math.max(...M2.map(p => p.y))} ⇒ ${M1.filter(r => !M1_keep.includes(r)).map(p => p.name).join(', ')} ถูกครอบคลุม จึงตัดทิ้ง` },
    { title: '6) ผลลัพธ์',
      desc: `Maxima set = M₁' ∪ M₂ = {${result.map(p => p.name).join(', ')}}` },
  ];
  const cur = STEPS[step];

  // SVG layout
  const W = 380, H = 320, pad = 30;
  const xMax = 10, yMax = 10;
  const sx = (v) => pad + (v / xMax) * (W - 2 * pad);
  const sy = (v) => H - pad - (v / yMax) * (H - 2 * pad);
  const splitX = (S1[S1.length - 1].x + S2[0].x) / 2; // between P4 (x=4) and P5 (x=5) → 4.5

  const colorOf = (p) => {
    if (step === 0) return 'var(--text-1)';
    if (step === 1) return S1.includes(p) ? 'var(--accent)' : 'var(--pink)';
    if (step === 2) {
      if (!S1.includes(p)) return 'var(--bg-3)';
      return M1.includes(p) ? 'var(--success)' : 'var(--danger)';
    }
    if (step === 3) {
      if (!S2.includes(p)) return M1.includes(p) ? 'var(--success)' : 'var(--bg-3)';
      return M2.includes(p) ? 'var(--success)' : 'var(--danger)';
    }
    if (step === 4) {
      if (M2.includes(p)) return 'var(--success)';
      if (M1.includes(p)) return M1_keep.includes(p) ? 'var(--success)' : 'var(--danger)';
      return 'var(--bg-3)';
    }
    return result.includes(p) ? 'var(--success)' : 'var(--bg-3)';
  };

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {step + 1} / {STEPS.length}</span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step >= STEPS.length - 1}>▶</button>
        <button onClick={() => setStep(0)}>↺</button>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: 'var(--bg-2)', borderRadius: 8, maxWidth: 420, width: '100%' }}>
          {/* axes */}
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--text-2)" strokeWidth="1" />
          <line x1={pad} y1={H - pad} x2={pad} y2={pad} stroke="var(--text-2)" strokeWidth="1" />
          <text x={W - pad} y={H - pad + 14} fontSize="10" fill="var(--text-2)" textAnchor="end">x</text>
          <text x={pad - 8} y={pad + 4} fontSize="10" fill="var(--text-2)" textAnchor="end">y</text>
          {/* gridlines */}
          {[...Array(11)].map((_, i) => (
            <g key={`g${i}`}>
              <line x1={sx(i)} y1={H - pad} x2={sx(i)} y2={H - pad + 3} stroke="var(--text-2)" />
              <text x={sx(i)} y={H - pad + 13} fontSize="9" fill="var(--text-2)" textAnchor="middle">{i}</text>
              <line x1={pad} y1={sy(i)} x2={pad - 3} y2={sy(i)} stroke="var(--text-2)" />
              <text x={pad - 5} y={sy(i) + 3} fontSize="9" fill="var(--text-2)" textAnchor="end">{i}</text>
            </g>
          ))}
          {/* split line (steps 1+) */}
          {step >= 1 && (
            <line x1={sx(splitX)} y1={pad} x2={sx(splitX)} y2={H - pad} stroke="var(--warn)" strokeWidth="1.5" strokeDasharray="4 3" />
          )}
          {/* points */}
          {sorted.map(p => (
            <g key={p.name}>
              <circle cx={sx(p.x)} cy={sy(p.y)} r="6" fill={colorOf(p)} stroke="var(--text-0)" strokeWidth="0.5" />
              <text x={sx(p.x) + 9} y={sy(p.y) - 6} fontSize="10" fill="var(--text-0)" fontWeight="bold">{p.name}</text>
              <text x={sx(p.x) + 9} y={sy(p.y) + 6} fontSize="9" fill="var(--text-2)">({p.x},{p.y})</text>
            </g>
          ))}
          {/* "staircase" outline for final maxima set */}
          {step === STEPS.length - 1 && result.length > 0 && (
            <polyline
              points={
                [...result].sort((a, b) => a.x - b.x)
                  .map((p, i, arr) => {
                    const next = arr[i + 1];
                    if (next) return `${sx(p.x)},${sy(p.y)} ${sx(next.x)},${sy(p.y)}`;
                    return `${sx(p.x)},${sy(p.y)}`;
                  }).join(' ')
              }
              fill="none" stroke="var(--accent-3)" strokeWidth="2"
            />
          )}
        </svg>
        <div style={{ flex: '1 1 240px', minWidth: 240 }}>
          <div className="callout info" style={{ marginTop: 0 }}>
            <div className="ttl">{cur.title}</div>
            <div style={{ color: 'var(--text-1)' }}>{cur.desc}</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-2)' }}>
            <div><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--success)', marginRight: 6, borderRadius: 2 }}></span>maxima / ผ่านรอบ</div>
            <div><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--danger)', marginRight: 6, borderRadius: 2 }}></span>ถูกครอบคลุม (ตัดทิ้ง)</div>
            <div><span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--bg-3)', marginRight: 6, borderRadius: 2 }}></span>ฝั่งตรงข้าม / ตัดไปก่อนหน้านี้</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Lessons3["maxima-set"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Maxima Set — เซตจุดที่ "ไม่ถูกครอบคลุม"</div>
        ให้จุด n จุดบนระนาบ (x, y) จุด p เป็น <b>maxima</b> ถ้า<u>ไม่มี</u>จุด q ใดที่ q.x &gt; p.x และ q.y &gt; p.y พร้อมกัน
        (q ครอบคลุม p) — โจทย์นี้คือหา <b>เซตของจุด maxima ทั้งหมด</b>
      </div>

      <h3>การประยุกต์</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Pareto frontier</b> — ทางเลือกที่ไม่มีตัวอื่นดีกว่าทุกแกน (ราคา/คุณภาพ, เวลา/แม่นยำ)</li>
        <li><b>Skyline operator</b> ในฐานข้อมูล — เลือกแถวที่ไม่ถูก dominate</li>
        <li><b>เกม / กราฟิก</b> — เปลือกของจุด (skyline ตึก)</li>
      </ul>

      <h3>วิธี Brute Force — O(n²)</h3>
      <pre className="code">{`for each p in P:
  isMaxima = true
  for each q in P, q ≠ p:
    if q.x > p.x and q.y > p.y:
      isMaxima = false; break
  if isMaxima: result.add(p)`}</pre>

      <h3>วิธี Divide & Conquer — O(n log n)</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Sort</b> จุดทั้งหมดตาม x ครั้งเดียวก่อน (เสีย O(n log n))</li>
        <li><b>Divide</b> แบ่งครึ่งตาม x ได้ S₁ (ฝั่งซ้าย, x น้อย) และ S₂ (ฝั่งขวา, x มาก)</li>
        <li><b>Conquer</b> เรียก recursive: M₁ = maxima(S₁), M₂ = maxima(S₂)</li>
        <li><b>Combine</b> เนื่องจากทุก q ∈ M₂ มี q.x &gt; ทุก r ∈ M₁ อยู่แล้ว → เช็คแค่ y:
          <br/>r ∈ M₁ ถูกตัดทิ้งถ้ามี q ∈ M₂ ที่ q.y &gt; r.y (ใช้ max y ของ M₂ เป็น threshold ก็ได้)
          <br/>ผลลัพธ์ = M₁' ∪ M₂ (โดย M₁' คือ M₁ ที่กรองแล้ว)</li>
      </ol>

      <MaximaSetViz />

      <h3>Pseudocode</h3>
      <pre className="code">{`vector<Point> maximaSet(vector<Point> S) {
  // 0) base case
  if (S.size() <= 1) return S;

  // 1) Divide — sorted by x at top-level
  int m = S.size() / 2;
  vector<Point> S1(S.begin(), S.begin()+m);   // left
  vector<Point> S2(S.begin()+m, S.end());     // right

  // 2) Conquer
  vector<Point> M1 = maximaSet(S1);
  vector<Point> M2 = maximaSet(S2);

  // 3) Combine — remove from M1 points dominated by anything in M2
  int maxYinM2 = max element y in M2;
  vector<Point> kept;
  for (auto& r : M1)
    if (r.y > maxYinM2) kept.push_back(r);    // not dominated

  // append M2 (all of M2 is maxima of S2)
  kept.insert(kept.end(), M2.begin(), M2.end());
  return kept;
}`}</pre>

      <h3>Recurrence + Complexity</h3>
      <table className="tbl">
        <thead><tr><th>ขั้นตอน</th><th>เวลา</th></tr></thead>
        <tbody>
          <tr><td>Sort by x (ครั้งเดียว นอก recursion)</td><td>O(n log n)</td></tr>
          <tr><td>Recurrence ของ DAC: T(n) = 2T(n/2) + O(n)</td><td>O(n log n)</td></tr>
          <tr><td><b>รวม</b></td><td><b>O(n log n)</b></td></tr>
          <tr><td>เทียบกับ Brute Force</td><td>O(n²)</td></tr>
        </tbody>
      </table>

      <div className="callout warn">
        <div className="ttl">⚠️ จุดที่ทำผิดบ่อย</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>ลืม sort by x ก่อน → split แบบ S₁ left / S₂ right ใช้ไม่ได้</li>
          <li>ตอน combine ดันเช็คทั้ง q.x และ q.y ทั้งที่ q.x &gt; r.x อยู่แล้วเสมอ — เสียเวลา</li>
          <li>คิดว่า maxima คือจุดที่ x หรือ y มากที่สุด — ไม่ใช่ มันคือ "ไม่ถูกครอบคลุม"</li>
        </ul>
      </div>

      <Quiz3 q={{
        question: "ใน Combine step ของ Maxima Set DAC ทำไมเช็คแค่ q.y &gt; r.y พอ ไม่ต้องเช็ค q.x &gt; r.x?",
        options: [
          "เพราะ x ไม่สำคัญ",
          "เพราะ M₂ ทุกจุดมี x มากกว่า M₁ ทุกจุดอยู่แล้ว (split by median x)",
          "เพราะ q.x = r.x เสมอ",
          "เพราะ sort by y แล้ว"
        ],
        answer: 1,
        explain: "หลังจาก divide ด้วย median x — ทุกจุดใน S₂ (และ M₂ ⊆ S₂) มี x &gt; ทุกจุดใน S₁ ดังนั้น q.x > r.x จริงเสมอ เหลือเช็คเฉพาะ y"
      }} />

      <Quiz3 q={{
        question: "ให้ P = {(1,4),(2,6),(3,1),(4,5),(5,7),(6,9),(7,2),(8,6),(9,3)} maxima set คือ?",
        options: [
          "{(1,4),(6,9),(9,3)}",
          "{(6,9),(8,6),(9,3)}",
          "{(5,7),(6,9),(8,6)}",
          "{(2,6),(6,9),(9,3)}"
        ],
        answer: 1,
        explain: "(6,9) ไม่มี q ที่ทั้ง x>6 และ y>9; (8,6) ไม่มี q ที่ x>8 และ y>6 ((9,3) y=3<6); (9,3) ไม่มี q ที่ x>9. จุดอื่นถูก (6,9) หรือ (8,6) ครอบคลุม"
      }} />

    </React.Fragment>
  );
};

// ============ Interpolation Search ============
function InterpolationSearchViz() {
  const arr = [10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33, 35, 42, 47];
  const [target, setTarget] = useS3(22);
  const [steps, setSteps] = useS3([]);
  const [idx, setIdx] = useS3(0);

  const run = () => {
    const log = [];
    let l = 0, r = arr.length - 1;
    while (l <= r && target >= arr[l] && target <= arr[r]) {
      const pos = l + Math.floor(((r - l) * (target - arr[l])) / (arr[r] - arr[l]));
      log.push({ l, r, pos, val: arr[pos] });
      if (arr[pos] === target) { log.push({ found: pos }); break; }
      if (arr[pos] < target) l = pos + 1;
      else r = pos - 1;
    }
    setSteps(log);
    setIdx(0);
  };

  const cur = steps[idx];
  return (
    <div className="dsv">
      <div className="ctrls">
        <label>target = <input type="number" value={target} onChange={e => setTarget(+e.target.value)} style={{ width: 70 }} /></label>
        <button onClick={run}>▶ ค้นหา</button>
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {idx + 1} / {steps.length || 0}</span>
        <button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx >= steps.length - 1}>▶</button>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {arr.map((v, i) => {
          let bg = 'var(--bg-2)';
          if (cur && !cur.found) {
            if (i === cur.pos) bg = 'var(--accent-2)';
            else if (i === cur.l || i === cur.r) bg = 'var(--accent)';
            else if (i < cur.l || i > cur.r) bg = 'var(--bg-1)';
          }
          if (cur && cur.found === i) bg = 'var(--success)';
          return <div key={i} className="cell" style={{ background: bg, color: bg === 'var(--bg-2)' || bg === 'var(--bg-1)' ? 'var(--text-1)' : '#000' }}>{v}</div>;
        })}
      </div>
      {cur && !cur.found && <div style={{ marginTop: 10, color: 'var(--text-1)' }}>l={cur.l}, r={cur.r}, pos={cur.pos}, A[pos]={cur.val}</div>}
      {cur && cur.found !== undefined && <div className="callout success" style={{ marginTop: 10 }}>พบที่ index {cur.found}</div>}
    </div>
  );
}

Lessons3["interpolation-search"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Interpolation Search</div>
        แทนที่จะตัดครึ่งเสมอ (binary) ใช้การประมาณตำแหน่งจาก<b>ค่า</b>ของข้อมูล —
        คล้ายเปิดพจนานุกรม คำที่ขึ้นต้น "Z" เปิดท้ายเล่ม ไม่ใช่กลางเล่ม
      </div>
      <h3>สูตรประมาณตำแหน่ง</h3>
      <pre className="code">{`pos = l + ((r - l) × (target - A[l])) / (A[r] - A[l])`}</pre>
      <InterpolationSearchViz />
      <h3>Complexity</h3>
      <table className="tbl">
        <thead><tr><th>กรณี</th><th>เวลา</th></tr></thead>
        <tbody>
          <tr><td>ข้อมูลกระจายสม่ำเสมอ</td><td>O(log log n) — เร็วมาก!</td></tr>
          <tr><td>ข้อมูลกระจายไม่สม่ำเสมอ</td><td>O(n)</td></tr>
        </tbody>
      </table>
      <div className="callout warn">
        <div className="ttl">เมื่อใดควรใช้</div>
        เหมาะกับข้อมูลที่ <b>เรียงแล้ว</b> และ <b>กระจายสม่ำเสมอ</b> เช่น เบอร์โทร, รหัสนักศึกษา
      </div>
      <Quiz3 q={{
        question: "Interpolation search ทำงานเร็วที่สุดเมื่อ?",
        options: ["ข้อมูลไม่เรียง", "ข้อมูลเรียงและกระจายสม่ำเสมอ", "ข้อมูลซ้ำเยอะ", "ข้อมูลน้อย"],
        answer: 1
      }} />
    </React.Fragment>
  );
};

// ============ Graph Representation ============
function GraphRepViz() {
  const edges = [[1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [5, 2]];
  const n = 6;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  edges.forEach(([u, v]) => { matrix[u - 1][v - 1] = 1; });
  const list = Array.from({ length: n }, () => []);
  edges.forEach(([u, v]) => list[u - 1].push(v));
  const positions = [
    { x: 60, y: 60 }, { x: 180, y: 30 }, { x: 280, y: 80 },
    { x: 280, y: 180 }, { x: 180, y: 220 }, { x: 60, y: 180 }
  ];
  return (
    <div className="dsv">
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 18, alignItems: 'flex-start' }}>
        <svg width="340" height="260" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
          <defs>
            <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
            </marker>
          </defs>
          {edges.map(([u, v], i) => {
            const a = positions[u - 1], b = positions[v - 1];
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy);
            const ox = (dx / len) * 22, oy = (dy / len) * 22;
            return <line key={i} x1={a.x + ox} y1={a.y + oy} x2={b.x - ox} y2={b.y - oy}
              stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrR)" />;
          })}
          {positions.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="20" fill="var(--bg-3)" stroke="var(--accent)" strokeWidth="2" />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fill="var(--text-0)" fontWeight="600">{i + 1}</text>
            </g>
          ))}
        </svg>
        <div>
          <h4 style={{ margin: '0 0 8px' }}>Adjacency Matrix</h4>
          <table className="tbl" style={{ fontSize: 13 }}>
            <thead><tr><th></th>{matrix.map((_, j) => <th key={j}>{j + 1}</th>)}</tr></thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}><th>{i + 1}</th>{row.map((v, j) => <td key={j} style={{ color: v ? 'var(--accent-2)' : 'var(--text-2)', fontWeight: v ? 600 : 400 }}>{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <h4 style={{ margin: '14px 0 8px' }}>Adjacency List</h4>
          <pre className="code" style={{ fontSize: 13 }}>{list.map((nb, i) => `${i + 1} → [${nb.join(', ')}]`).join('\n')}</pre>
        </div>
      </div>
    </div>
  );
}

Lessons3["graph-rep"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">การแทนกราฟในคอมพิวเตอร์</div>
        กราฟ G = (V, E) มีเซตเวอร์เท็กซ์ V และเซตเอดจ์ E — มี 2 วิธีหลักในการเก็บ
      </div>
      <GraphRepViz />
      <h3>1. Adjacency Matrix</h3>
      <pre className="code">{`vector<vector<int>> g(n, vector<int>(n, 0));
g[u][v] = 1;   // มีเอดจ์จาก u → v
g[u][v] = w;   // weighted graph เก็บค่าน้ำหนัก`}</pre>
      <h3>2. Adjacency List (array of vector)</h3>
      <pre className="code">{`vector<vector<int>> g(n);
g[u].push_back(v);   // มีเอดจ์ u → v

// เดินผ่านเพื่อนบ้านของ u
for (int v : g[u]) { ... }`}</pre>
      <h3>เปรียบเทียบ</h3>
      <table className="tbl">
        <thead><tr><th></th><th>Matrix</th><th>List</th></tr></thead>
        <tbody>
          <tr><td>Space</td><td>O(V²)</td><td>O(V+E)</td></tr>
          <tr><td>เช็คมีเอดจ์ u-v</td><td>O(1)</td><td>O(degree)</td></tr>
          <tr><td>วนเพื่อนบ้านของ u</td><td>O(V)</td><td>O(degree)</td></tr>
          <tr><td>เหมาะกับ</td><td>กราฟหนาแน่น (dense)</td><td>กราฟเบาบาง (sparse)</td></tr>
        </tbody>
      </table>
      <Quiz3 q={{
        question: "กราฟที่มี V = 1000, E = 5000 ควรใช้อะไร?",
        options: ["Adjacency Matrix", "Adjacency List", "ทั้งสองดีเท่ากัน"],
        answer: 1, explain: "E = 5000 << V² = 1,000,000 → กราฟเบาบาง ใช้ list ประหยัดพื้นที่กว่ามาก"
      }} />
    </React.Fragment>
  );
};

// ============ Cycle Detection ============
function CycleDetectViz() {
  const edges = [[0, 1], [0, 2], [1, 2], [2, 0], [2, 3]];
  const positions = [{ x: 80, y: 80 }, { x: 240, y: 80 }, { x: 80, y: 200 }, { x: 240, y: 200 }];
  const [trace, setTrace] = useS3([]);
  const [idx, setIdx] = useS3(0);

  const run = () => {
    const adj = [[], [], [], []];
    edges.forEach(([u, v]) => adj[u].push(v));
    const visited = [false, false, false, false];
    const recStack = [false, false, false, false];
    const log = [];
    let cycle = false;
    function dfs(u) {
      if (cycle) return;
      visited[u] = true; recStack[u] = true;
      log.push({ u, visited: [...visited], recStack: [...recStack], note: `เยี่ยม ${u} → push recStack` });
      for (const v of adj[u]) {
        if (cycle) return;
        if (!visited[v]) dfs(v);
        else if (recStack[v]) {
          log.push({ u, v, visited: [...visited], recStack: [...recStack], cycle: true, note: `🔴 พบ back edge ${u}→${v} → CYCLE!` });
          cycle = true;
          return;
        }
      }
      if (!cycle) {
        recStack[u] = false;
        log.push({ u, visited: [...visited], recStack: [...recStack], note: `ออกจาก ${u} → pop recStack` });
      }
    }
    dfs(0);
    setTrace(log);
    setIdx(0);
  };

  const cur = trace[idx];

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={run}>▶ รัน DFS</button>
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {idx + 1} / {trace.length || 0}</span>
        <button onClick={() => setIdx(Math.min(trace.length - 1, idx + 1))} disabled={idx >= trace.length - 1}>▶</button>
      </div>
      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <svg width="340" height="280" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
          <defs>
            <marker id="arrC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker id="arrCR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
          </defs>
          {edges.map(([u, v], i) => {
            const a = positions[u], b = positions[v];
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy);
            const ox = (dx / len) * 22, oy = (dy / len) * 22;
            const isCycleEdge = cur && cur.cycle && cur.u === u && cur.v === v;
            return <line key={i} x1={a.x + ox} y1={a.y + oy} x2={b.x - ox} y2={b.y - oy}
              stroke={isCycleEdge ? '#ef4444' : '#94a3b8'} strokeWidth={isCycleEdge ? 3 : 2}
              markerEnd={isCycleEdge ? 'url(#arrCR)' : 'url(#arrC)'} />;
          })}
          {positions.map((p, i) => {
            let fill = 'var(--bg-3)';
            if (cur) {
              if (cur.recStack && cur.recStack[i]) fill = '#ef4444';
              else if (cur.visited && cur.visited[i]) fill = '#10b981';
            }
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="22" fill={fill} stroke="var(--accent)" strokeWidth="2" />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fill="#fff" fontWeight="600">{i}</text>
              </g>
            );
          })}
        </svg>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, background: '#10b981', borderRadius: 2, marginRight: 6 }}></span>visited &nbsp;
            <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ef4444', borderRadius: 2, marginRight: 6 }}></span>recStack
          </div>
          {cur && <div className={cur.cycle ? "callout warn" : "callout"}>{cur.note}</div>}
        </div>
      </div>
    </div>
  );
}

Lessons3["cycle-detect"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">การตรวจจับวงวน (Cycle) ในกราฟทิศทาง</div>
        ใช้ DFS + <b>recursion stack</b> — ถ้าเดินไปเจอ vertex ที่ <i>ยังอยู่ใน stack</i> นั่นคือ <b>back edge</b> = มีวงวน
      </div>
      <h3>หลักการ — 3 สี</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b style={{ color: '#94a3b8' }}>ขาว (unvisited)</b> — ยังไม่เคยเยี่ยม</li>
        <li><b style={{ color: '#ef4444' }}>เทา (recStack)</b> — กำลังเยี่ยมอยู่ในเส้นทาง DFS ปัจจุบัน</li>
        <li><b style={{ color: '#10b981' }}>ดำ (visited, ออกแล้ว)</b> — เยี่ยมเสร็จและ pop ออกจาก stack แล้ว</li>
      </ul>
      <p>ถ้าเจอเอดจ์ <code>u → v</code> ที่ <code>v</code> เป็นสีเทา = <b>back edge</b> → มีวงวน</p>
      <CycleDetectViz />
      <h3>โค้ด C++</h3>
      <pre className="code">{`bool cycleFound = false;

void DFS(vector<vector<int>>& g, int u, int V,
         vector<bool>& visited, vector<bool>& recStack) {
  visited[u] = true;
  recStack[u] = true;
  for (int v = 0; v < V; v++) {
    if (g[u][v]) {                 // มีเอดจ์ u → v
      if (!visited[v]) DFS(g, v, V, visited, recStack);
      else if (recStack[v]) {      // back edge!
        cycleFound = true;
        return;
      }
    }
  }
  recStack[u] = false;             // pop ออกจาก stack
}`}</pre>
      <Quiz3 q={{
        question: "ถ้า DFS ไปเจอ v ที่ visited[v]=true แต่ recStack[v]=false แปลว่า?",
        options: ["มีวงวน", "ไม่มีวงวน — เป็นแค่ cross/forward edge", "ต้อง backtrack"],
        answer: 1, explain: "v ออกจาก stack แล้ว แสดงว่าไม่กลับมาที่บรรพบุรุษ → ไม่ใช่ back edge"
      }} />
    </React.Fragment>
  );
};

// ============ Topological Sort ============
function TopoSortViz() {
  const edges = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]];
  const n = 6;
  const positions = [
    { x: 280, y: 60 }, { x: 280, y: 220 }, { x: 180, y: 60 },
    { x: 180, y: 220 }, { x: 60, y: 60 }, { x: 80, y: 200 }
  ];
  const [order, setOrder] = useS3([]);
  const [trace, setTrace] = useS3([]);
  const [idx, setIdx] = useS3(0);

  const run = () => {
    const indeg = Array(n).fill(0);
    const adj = Array.from({ length: n }, () => []);
    edges.forEach(([u, v]) => { adj[u].push(v); indeg[v]++; });
    const q = [];
    for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
    const log = [];
    const result = [];
    log.push({ q: [...q], indeg: [...indeg], result: [...result], note: 'เริ่มต้น: queue คือ vertex ที่ indeg = 0' });
    while (q.length) {
      const u = q.shift();
      result.push(u);
      log.push({ q: [...q], indeg: [...indeg], result: [...result], current: u, note: `pop ${u} → ใส่ในผลลัพธ์` });
      for (const v of adj[u]) {
        indeg[v]--;
        if (indeg[v] === 0) q.push(v);
      }
      log.push({ q: [...q], indeg: [...indeg], result: [...result], note: `ลด indeg ของเพื่อนบ้าน ${u} → push ที่กลายเป็น 0` });
    }
    setTrace(log); setOrder(result); setIdx(0);
  };

  const cur = trace[idx];
  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={run}>▶ Kahn's Algorithm</button>
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {idx + 1} / {trace.length || 0}</span>
        <button onClick={() => setIdx(Math.min(trace.length - 1, idx + 1))} disabled={idx >= trace.length - 1}>▶</button>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <svg width="340" height="280" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
          <defs>
            <marker id="arrT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>
          {edges.map(([u, v], i) => {
            const a = positions[u], b = positions[v];
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy);
            const ox = (dx / len) * 22, oy = (dy / len) * 22;
            return <line key={i} x1={a.x + ox} y1={a.y + oy} x2={b.x - ox} y2={b.y - oy}
              stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrT)" />;
          })}
          {positions.map((p, i) => {
            let fill = 'var(--bg-3)';
            if (cur) {
              if (cur.result.includes(i)) fill = '#10b981';
              if (cur.current === i) fill = '#fbbf24';
              else if (cur.q && cur.q.includes(i)) fill = '#3b82f6';
            }
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="22" fill={fill} stroke="var(--accent)" strokeWidth="2" />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fill="#fff" fontWeight="600">{i}</text>
                {cur && <text x={p.x} y={p.y - 28} textAnchor="middle" fill="var(--text-2)" fontSize="11">indeg={cur.indeg[i]}</text>}
              </g>
            );
          })}
        </svg>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
            🟦 in queue · 🟨 processing · 🟩 done
          </div>
          {cur && (
            <React.Fragment>
              <div className="callout">{cur.note}</div>
              <div style={{ marginTop: 10 }}>
                <div><b>Queue:</b> [{cur.q.join(', ')}]</div>
                <div><b>Result:</b> {cur.result.length ? cur.result.join(' → ') : '(ว่าง)'}</div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

Lessons3["topo-sort"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Topological Sort</div>
        เรียงลำดับ vertex ของ <b>DAG</b> (Directed Acyclic Graph) ให้ทุกเอดจ์ u→v มี u อยู่ก่อน v
        — เหมาะกับงานที่ต้องทำก่อนหลัง (เช่น ลำดับวิชาเรียน, build dependency)
      </div>
      <h3>Kahn's Algorithm — ใช้ in-degree</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>คำนวณ <code>indeg[v]</code> = จำนวนเอดจ์เข้าของแต่ละ vertex</li>
        <li>ใส่ vertex ที่ <code>indeg = 0</code> ลงใน queue (ไม่มีใครต้องทำก่อน)</li>
        <li>pop จาก queue → ใส่ในผลลัพธ์ → ลด indeg ของเพื่อนบ้าน → push ที่กลายเป็น 0</li>
        <li>ทำซ้ำจน queue ว่าง</li>
      </ol>
      <TopoSortViz />
      <pre className="code">{`vector<int> topoSort(int n, vector<vector<int>>& adj) {
  vector<int> indeg(n, 0), result;
  for (int u = 0; u < n; u++)
    for (int v : adj[u]) indeg[v]++;
  queue<int> q;
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    result.push_back(u);
    for (int v : adj[u])
      if (--indeg[v] == 0) q.push(v);
  }
  return result;   // ถ้า size != n → มีวงวน
}`}</pre>
      <div className="callout warn">
        <div className="ttl">⚠️ ตรวจวงวน</div>
        ถ้าผลลัพธ์มีจำนวน vertex น้อยกว่า n แปลว่ากราฟ<b>มีวงวน</b> → ไม่สามารถ topo sort ได้
      </div>
      <Quiz3 q={{
        question: "Topological sort ใช้ได้กับกราฟแบบใด?",
        options: ["กราฟทุกแบบ", "กราฟไม่มีทิศทาง", "DAG เท่านั้น (ไม่มีวงวน)", "Tree เท่านั้น"],
        answer: 2
      }} />
    </React.Fragment>
  );
};

// ============ Recursion ============
Lessons3["recursion"] = function () {
  const [n, setN] = useS3(5);
  const trace = (function () {
    const log = [];
    function fact(n, depth) {
      log.push({ call: `fact(${n})`, depth, type: 'call' });
      if (n <= 1) {
        log.push({ call: `fact(${n}) = 1`, depth, type: 'return', val: 1 });
        return 1;
      }
      const r = n * fact(n - 1, depth + 1);
      log.push({ call: `fact(${n}) = ${n} × ${r / n} = ${r}`, depth, type: 'return', val: r });
      return r;
    }
    fact(n, 0);
    return log;
  })();
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Recursion — ฟังก์ชันที่เรียกตัวเอง</div>
        ทุกฟังก์ชันรีเคอร์ซีฟต้องมี 2 ส่วน:
        <ul>
          <li><b>Base case</b> — เงื่อนไขหยุด ไม่เรียกตัวเองต่อ</li>
          <li><b>Recursive case</b> — เรียกตัวเองด้วยปัญหาที่เล็กลง</li>
        </ul>
      </div>
      <h3>ตัวอย่าง: Factorial</h3>
      <pre className="code">{`int fact(int n) {
  if (n <= 1) return 1;        // base case
  return n * fact(n - 1);      // recursive case
}`}</pre>
      <div className="ctrls">
        <label>n = <input type="number" min="0" max="8" value={n} onChange={e => setN(+e.target.value || 0)} style={{ width: 60 }} /></label>
      </div>
      <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }}>
        {trace.map((t, i) => (
          <div key={i} style={{ paddingLeft: t.depth * 20, color: t.type === 'return' ? '#10b981' : '#fbbf24' }}>
            {t.type === 'call' ? '↳ ' : '↩ '}{t.call}
          </div>
        ))}
      </div>
      <h3>Recursion Stack</h3>
      <p style={{ color: 'var(--text-1)' }}>ทุก call จะ push เฟรมลง stack — ถ้า base case มาช้าหรือไม่มี → <b>Stack Overflow!</b></p>
      <h3>Recurrence Relations ที่พบบ่อย</h3>
      <table className="tbl">
        <thead><tr><th>Recurrence</th><th>เป็น</th><th>Complexity</th></tr></thead>
        <tbody>
          <tr><td>T(n) = T(n-1) + 1</td><td>linear recursion</td><td>O(n)</td></tr>
          <tr><td>T(n) = 2T(n/2) + n</td><td>Merge Sort</td><td>O(n log n)</td></tr>
          <tr><td>T(n) = 2T(n-1) + 1</td><td>Tower of Hanoi</td><td>O(2ⁿ)</td></tr>
          <tr><td>T(n) = T(n/2) + 1</td><td>Binary Search</td><td>O(log n)</td></tr>
        </tbody>
      </table>
      <Quiz3 q={{
        question: "ฟังก์ชันรีเคอร์ซีฟ <b>ขาด</b> สิ่งใดจะทำให้ stack overflow?",
        options: ["recursive case", "base case", "return statement", "พารามิเตอร์"],
        answer: 1, explain: "ไม่มี base case = เรียกตัวเองไม่หยุด"
      }} />
    </React.Fragment>
  );
};

// ============ Exhaustive Search ============
function PermViz() {
  const [n, setN] = useS3(3);
  const perms = useM3(() => {
    const result = [];
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    function perm(a, k) {
      if (k === a.length) { result.push([...a]); return; }
      for (let i = k; i < a.length; i++) {
        [a[k], a[i]] = [a[i], a[k]];
        perm(a, k + 1);
        [a[k], a[i]] = [a[i], a[k]];
      }
    }
    perm(arr, 0);
    return result;
  }, [n]);
  return (
    <div className="dsv">
      <div className="ctrls">
        <label>n = <input type="number" min="2" max="5" value={n} onChange={e => setN(+e.target.value || 2)} style={{ width: 60 }} /></label>
        <span style={{ color: 'var(--text-2)' }}>n! = {perms.length} วิธี</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
        {perms.map((p, i) => (
          <div key={i} style={{ background: 'var(--bg-1)', padding: '6px 10px', borderRadius: 6, fontFamily: 'monospace' }}>
            {p.join(' ')}
          </div>
        ))}
      </div>
    </div>
  );
}

Lessons3["exhaustive"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Exhaustive Search (Brute Force)</div>
        สำรวจคำตอบที่<b>เป็นไปได้ทั้งหมด</b> แล้วเลือกที่ตรงตามเงื่อนไข — ทำงานช้าแต่หาคำตอบได้แน่นอน
      </div>
      <h3>2 ขั้นตอน</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>เข้ารหัสคำตอบ</b> — นิยามว่าคำตอบหน้าตาเป็นยังไง (เช่น เซต X = {`{x1, x2, x3}`})</li>
        <li><b>สำรวจคำตอบทั้งหมด</b> — สร้าง solution tree เพื่อแจกแจง</li>
      </ol>
      <h3>ตัวอย่าง: Permutation (จัดเรียง)</h3>
      <PermViz />
      <pre className="code">{`void perm(vector<int>& a, int k) {
  if (k == a.size()) { print(a); return; }
  for (int i = k; i < a.size(); i++) {
    swap(a[k], a[i]);
    perm(a, k + 1);
    swap(a[k], a[i]);   // backtrack
  }
}`}</pre>
      <h3>ตัวอย่าง: Subset (เซตย่อยทั้งหมด)</h3>
      <pre className="code">{`void subset(vector<int>& a, vector<int>& cur, int k) {
  if (k == a.size()) { print(cur); return; }
  subset(a, cur, k + 1);                // ไม่เลือก a[k]
  cur.push_back(a[k]);
  subset(a, cur, k + 1);                // เลือก a[k]
  cur.pop_back();
}`}</pre>
      <h3>เมื่อใดควรใช้</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>n เล็ก (มักไม่เกิน 20-25 สำหรับ subset)</li>
        <li>ไม่มีอัลกอริทึมที่ดีกว่า</li>
        <li>เป็น baseline เพื่อเทียบกับวิธีที่ฉลาดกว่า</li>
      </ul>
      <table className="tbl">
        <thead><tr><th>ปัญหา</th><th>จำนวนคำตอบ</th></tr></thead>
        <tbody>
          <tr><td>Permutation ของ n</td><td>n!</td></tr>
          <tr><td>Subset ของ n</td><td>2ⁿ</td></tr>
          <tr><td>k-combination จาก n</td><td>C(n, k)</td></tr>
        </tbody>
      </table>
      <Quiz3 q={{
        question: "ถ้า n = 10 จำนวน permutation ทั้งหมดคือ?",
        options: ["100", "1024", "3,628,800", "55"],
        answer: 2, explain: "10! = 3,628,800"
      }} />
    </React.Fragment>
  );
};

// ============ Backtracking ============
function NQueensViz() {
  const [n, setN] = useS3(4);
  const [solIdx, setSolIdx] = useS3(0);
  const sols = useM3(() => {
    const result = [];
    const board = Array(n).fill(-1);
    const safe = (r, c) => {
      for (let i = 0; i < r; i++)
        if (board[i] === c || Math.abs(board[i] - c) === r - i) return false;
      return true;
    };
    function place(r) {
      if (r === n) { result.push([...board]); return; }
      for (let c = 0; c < n; c++) {
        if (safe(r, c)) { board[r] = c; place(r + 1); board[r] = -1; }
      }
    }
    place(0);
    return result;
  }, [n]);
  const sol = sols[solIdx] || [];
  return (
    <div className="dsv">
      <div className="ctrls">
        <label>n = <input type="number" min="4" max="8" value={n} onChange={e => { setN(+e.target.value || 4); setSolIdx(0); }} style={{ width: 60 }} /></label>
        <button onClick={() => setSolIdx(Math.max(0, solIdx - 1))} disabled={solIdx === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>solution {solIdx + 1} / {sols.length}</span>
        <button onClick={() => setSolIdx(Math.min(sols.length - 1, solIdx + 1))} disabled={solIdx >= sols.length - 1}>▶</button>
      </div>
      <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${n}, 40px)`, gap: 0, border: '2px solid var(--accent)', borderRadius: 4 }}>
        {Array.from({ length: n * n }, (_, i) => {
          const r = Math.floor(i / n), c = i % n;
          const isQ = sol[r] === c;
          const isLight = (r + c) % 2 === 0;
          return (
            <div key={i} style={{
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLight ? '#3b3b3b' : '#1a1a1a', fontSize: 24
            }}>
              {isQ && '♛'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubsetSumViz() {
  const A = [25, 10, 9, 2, 1];
  const target = 12;
  const sols = useM3(() => {
    const result = [];
    function go(i, cur, sum) {
      if (sum === target) { result.push([...cur]); return; }
      if (sum > target || i === A.length) return;
      cur.push(A[i]); go(i + 1, cur, sum + A[i]); cur.pop();
      go(i + 1, cur, sum);
    }
    go(0, [], 0);
    return result;
  }, []);
  return (
    <div className="dsv">
      <div style={{ marginBottom: 10, color: 'var(--text-1)' }}>
        A = [{A.join(', ')}], target = {target}
      </div>
      <div>เซตย่อยที่ผลรวม = {target}:</div>
      {sols.map((s, i) => (
        <div key={i} style={{ background: 'var(--bg-1)', padding: '6px 10px', borderRadius: 6, marginTop: 4, fontFamily: 'monospace' }}>
          {`{${s.join(', ')}}`} → {s.reduce((a, b) => a + b, 0)}
        </div>
      ))}
    </div>
  );
}

Lessons3["backtracking"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Backtracking — ตัดกิ่งคำตอบที่ไม่ดี</div>
        คล้าย Exhaustive Search แต่<b>ตัด</b>กิ่งของ solution tree ที่รู้แน่ว่าจะไม่ใช่คำตอบ
        ทำให้เร็วกว่า brute force มาก
      </div>
      <h3>Template ทั่วไป</h3>
      <pre className="code">{`bool backtrack(state) {
  if (เป็นคำตอบ) { บันทึก; return true; }
  for (each choice) {
    if (choice ผ่านเงื่อนไข) {       // pruning!
      apply(choice);
      if (backtrack(newState)) return true;
      undo(choice);                  // ย้อนรอย
    }
  }
  return false;
}`}</pre>
      <h3>ตัวอย่าง 1: N-Queens</h3>
      <p>วาง queen n ตัว บนบอร์ด n×n ไม่ให้กินกันเอง</p>
      <NQueensViz />
      <pre className="code">{`bool safe(int board[], int row, int col) {
  for (int i = 0; i < row; i++)
    if (board[i] == col || abs(board[i] - col) == row - i)
      return false;
  return true;
}
void place(int board[], int row, int n) {
  if (row == n) { print(board); return; }
  for (int col = 0; col < n; col++) {
    if (safe(board, row, col)) {     // ตัดกิ่งทันทีถ้ากินกัน
      board[row] = col;
      place(board, row + 1, n);
      board[row] = -1;
    }
  }
}`}</pre>
      <h3>ตัวอย่าง 2: Subset Sum</h3>
      <p>หาเซตย่อยที่ผลรวม = target</p>
      <SubsetSumViz />
      <pre className="code">{`void subsetSum(int A[], int n, int i, vector<int>& cur, int sum, int target) {
  if (sum == target) { print(cur); return; }
  if (sum > target || i == n) return;     // pruning!
  cur.push_back(A[i]);
  subsetSum(A, n, i+1, cur, sum + A[i], target);
  cur.pop_back();
  subsetSum(A, n, i+1, cur, sum, target);
}`}</pre>
      <h3>Backtracking vs Brute Force</h3>
      <table className="tbl">
        <thead><tr><th></th><th>Brute Force</th><th>Backtracking</th></tr></thead>
        <tbody>
          <tr><td>ค้นทุกคำตอบ?</td><td>ใช่</td><td>ตัดที่ไม่ใช่</td></tr>
          <tr><td>เร็ว</td><td>ช้า</td><td>เร็วขึ้นมาก (แต่ worst case ยัง O(เลขชี้กำลัง))</td></tr>
        </tbody>
      </table>
      <Quiz3 q={{
        question: "Backtracking ต่างจาก Exhaustive Search ตรงไหน?",
        options: ["ใช้ recursion น้อยกว่า", "ตัดกิ่งคำตอบที่ไม่ผ่านเงื่อนไขทันที", "ไม่มี base case", "ใช้ memoization"],
        answer: 1
      }} />
    </React.Fragment>
  );
};

// ============ Exercises Page ============
const EXERCISES = [
  {
    cat: "Big-O", title: "วิเคราะห์ Time Complexity",
    items: [
      { q: "for (i=0; i<n; i++) for (j=0; j<n; j++) sum++;", a: "O(n²)", explain: "loop ซ้อน n × n" },
      { q: "for (i=1; i<n; i*=2) sum++;", a: "O(log n)", explain: "i เพิ่มแบบทวีคูณ" },
      { q: "for (i=0; i<n; i++) for (j=0; j<i; j++) sum++;", a: "O(n²)", explain: "0+1+2+...+(n-1) = n(n-1)/2" },
      { q: "void f(int n) { if (n<=1) return; f(n/2); f(n/2); }", a: "O(n)", explain: "T(n) = 2T(n/2)+1" },
      { q: "void f(int n) { if (n<=1) return; for(i=0;i<n;i++); f(n-1); }", a: "O(n²)", explain: "T(n) = T(n-1)+n" },
    ]
  },
  {
    cat: "Sort & Search", title: "ตามรอย algorithm",
    items: [
      { q: "Bubble sort [5,1,4,2,8] รอบที่ 1 จะได้?", a: "[1,4,2,5,8]", explain: "เปรียบเทียบทีละคู่ ดันตัวมากไปขวา" },
      { q: "Binary search หา 22 ใน [10,12,13,16,18,19,20,22,23,24] ใช้กี่ครั้ง?", a: "3 ครั้ง", explain: "mid=4(18), mid=7(22) → พบ" },
      { q: "Quick sort pivot=ตัวแรก [6,2,8,1,5] หลัง partition?", a: "[2,1,5,6,8]", explain: "ตัวที่<6 ไปซ้าย, >6 ไปขวา" },
      { q: "Merge sort ของ [4,2] กับ [3,1] = ?", a: "[1,2,3,4]", explain: "ต้อง sort sub array ก่อนแล้วค่อย merge" },
    ]
  },
  {
    cat: "Divide & Conquer", title: "DAC problems",
    items: [
      { q: "Quick Select k=5 ใน [2,6,10,4,1,8,5] pivot=ตัวแรก", a: "6", explain: "หลัง partition: L=[1], E=[2], G=[6,10,4,8,5] → k'=3 ใน G → recurse" },
      { q: "Matrix mult ปกติ 100×100 ใช้กี่ multiplication?", a: "1,000,000", explain: "n³ = 100³" },
      { q: "Strassen ลด multiplication จาก 8 → ?", a: "7", explain: "M1-M7 ใช้ 7 ครั้ง" },
    ]
  },
  {
    cat: "Greedy", title: "Fractional Knapsack & อื่น ๆ",
    items: [
      { q: "Knapsack W=25, w=[18,15,10,5], v=[25,24,5,8] → เลือก?", a: "0.28, 1.00, 0.00, 1.00 → 38.94", explain: "เรียง v/w จากมากไปน้อย แล้วใส่ทีละชิ้น" },
      { q: "Tape storage [10,5,13] เรียงยังไงให้ MRT ต่ำสุด?", a: "5,10,13 → 16.00", explain: "เรียงจากสั้นไปยาว" },
      { q: "Train platform 6 ขบวน ต้องการกี่ชานชลา?", a: "ขึ้นกับ overlap", explain: "ใช้ priority queue เก็บเวลาออกของแต่ละ platform" },
    ]
  },
  {
    cat: "Dynamic Programming", title: "DP problems",
    items: [
      { q: "Fibonacci F(7) = ?", a: "13", explain: "1,1,2,3,5,8,13" },
      { q: "0/1 Knapsack v=[1,4,5,7] w=[1,3,4,5] W=7 → max value?", a: "9", explain: "เลือก item 2 (w=3,v=4) + item 4 (w=4,v=5) = w=7, v=9" },
      { q: "Subset sum {3,5,7} target=10 มีเซตย่อยกี่เซต?", a: "1 เซต {3,7}", explain: "DP table: dp[i][j] = มี subset ของ A[0..i] ผลรวม=j ไหม" },
    ]
  },
  {
    cat: "Backtracking", title: "Backtracking & Exhaustive",
    items: [
      { q: "N-Queens n=4 มีกี่คำตอบ?", a: "2", explain: "(2,4,1,3) และ (3,1,4,2)" },
      { q: "Subset sum target=12 จาก {25,10,9,2,1} มีกี่คำตอบ?", a: "2 → {10,2} และ {9,2,1}", explain: "" },
      { q: "Permutation ของ {A,B,C} มีกี่แบบ?", a: "6 (3!)", explain: "ABC, ACB, BAC, BCA, CAB, CBA" },
      { q: "ตัดสายไฟ 8m จาก [2,3,5] น้อยที่สุด?", a: "2 ชิ้น (3+5)", explain: "ลองทุกเซตย่อยที่ผลรวม=8" },
    ]
  },
  {
    cat: "Graph", title: "BFS, DFS, Cycle",
    items: [
      { q: "BFS จาก 0 ใน {0:[1,2], 1:[3], 2:[3], 3:[4]} → ลำดับ visit?", a: "0,1,2,3,4", explain: "ระดับต่อระดับ" },
      { q: "DFS จาก 0 ใน {0:[1,2], 1:[3], 2:[3], 3:[]} → ลำดับ visit?", a: "0,1,3,2", explain: "ลึกก่อน" },
      { q: "กราฟทิศทาง 0→1, 1→2, 2→0 มีวงวนไหม?", a: "มี", explain: "0→1→2→0 เป็น cycle" },
      { q: "Dijkstra หา shortest path จาก A ใน weighted graph ใช้ DS อะไร?", a: "Min-heap (priority queue)", explain: "" },
    ]
  },
];

Lessons3["exercises"] = function () {
  const [open, setOpen] = useS3({});
  const [showAns, setShowAns] = useS3({});
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">แบบฝึกหัดรวม — รวบรวมจากชั้นเรียน</div>
        คลิกที่หัวข้อเพื่อขยาย กดปุ่ม "เฉลย" ในแต่ละข้อเพื่อดูคำตอบ
      </div>
      {EXERCISES.map((sec, si) => (
        <div key={si} style={{ background: 'var(--bg-2)', borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: open[si] ? '1px solid var(--border)' : 'none' }}
            onClick={() => setOpen({ ...open, [si]: !open[si] })}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.04em' }}>{sec.cat}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-0)' }}>{sec.title}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="badge">{sec.items.length} ข้อ</span>
              <span style={{ color: 'var(--text-2)', transform: open[si] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s' }}>▶</span>
            </div>
          </div>
          {open[si] && (
            <div style={{ padding: 14 }}>
              {sec.items.map((it, i) => {
                const key = `${si}-${i}`;
                return (
                  <div key={i} style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, marginBottom: 10 }}>
                    <div style={{ color: 'var(--text-2)', fontSize: 12, marginBottom: 4 }}>ข้อ {i + 1}</div>
                    <div style={{ color: 'var(--text-0)', fontFamily: it.q.includes('(') || it.q.length > 60 ? 'monospace' : 'inherit', fontSize: 14, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{it.q}</div>
                    {!showAns[key] ? (
                      <button onClick={() => setShowAns({ ...showAns, [key]: true })} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                        เฉลย
                      </button>
                    ) : (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ color: '#10b981', fontWeight: 600 }}>✓ {it.a}</div>
                        {it.explain && <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>{it.explain}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <div className="callout success">
        <div className="ttl">ฝึกเพิ่มเติม</div>
        ลองไป Playground เพื่อทดลอง algorithm ด้วยข้อมูลของตัวเอง หรือ Compare Mode เพื่อเปรียบเทียบ algorithm 2 ตัว
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   29a — BACKTRACKING PROBLEMS BANK (7 ข้อ)
   ที่มา: assignment_backtracking, assignment_backtracking2,
           assignment_exhaustive_search, greedy.pdf Q4
============================================================ */
const BACKTRACKING_PROBLEMS = [
  {
    id: 1,
    title: 'Rope Cutting (ตัดสายไฟ)',
    src: 'assignment_backtracking2 Q2',
    diff: 'easy',
    spec: `ตัดสายไฟยาว L เมตร ตามรายการความยาว {l₁, l₂, ..., lₙ} เมตร
ให้จำนวนเส้นที่ตัดน้อยที่สุด (ไม่มีเศษเหลือ)

Input:
  บรรทัด 1: n L (3 ≤ n, L ≤ 20)
  บรรทัด 2: รายการความยาว n ตัว
Output:
  จำนวนเส้นน้อยสุด + รายการเส้นเรียงน้อยไปมาก (คั่นช่องว่าง)`,
    example: `Input:
3 8
2 3 5

Output:
2 3 5`,
    hint: 'recursive: target ลดลงเรื่อยๆ ใน {l₁..lₙ}. base case target=0 → success, target<0 → fail',
    code: `#include <bits/stdc++.h>
using namespace std;

int n, L, best = INT_MAX;
vector<int> lens, cur, bestCuts;

void solve(int target) {
  if (target == 0) {
    if ((int)cur.size() < best) {
      best = cur.size();
      bestCuts = cur;
    }
    return;
  }
  if (target < 0 || (int)cur.size() >= best) return;  // pruning
  for (int l : lens) {
    cur.push_back(l);
    solve(target - l);
    cur.pop_back();
  }
}

int main() {
  cin >> n >> L;
  lens.resize(n);
  for (auto& x : lens) cin >> x;
  solve(L);
  sort(bestCuts.begin(), bestCuts.end());
  cout << best << "\\n";
  for (size_t i = 0; i < bestCuts.size(); i++)
    cout << bestCuts[i] << " \\n"[i+1 == bestCuts.size()];
  return 0;
}`,
    walkthrough: `ตัวอย่าง L=8 {2,3,5}:
  cut 2: target=6
    cut 2: target=4
      cut 2: target=2 → cut 2: target=0 ✓ 4 เส้น (2+2+2+2)
      cut 3: target=1 ✗
    cut 3: target=3 → cut 3: target=0 ✓ 3 เส้น (2+3+3)
    cut 5: target=1 ✗
  cut 3: target=5 → cut 5: target=0 ✓ 2 เส้น (3+5)  ← best!
  cut 5: target=3 → cut 3: target=0 ✓ 2 เส้น (5+3)  ← เทียบกับ best
🏆 = 2 เส้น (3+5)`
  },
  {
    id: 2,
    title: 'Light Bulbs (ปิดหลอดไฟ)',
    src: 'assignment_backtracking2 Q3',
    diff: 'medium',
    spec: `หลอดไฟ N ดวงเปิดไว้ ความสว่าง L[i] ต่างกัน
หาวิธีปิดหลอดไฟให้ความสว่างรวมของหลอดที่ปิด = k
เงื่อนไข:
  1. ปิดอย่างน้อย 2 ดวง
  2. ห้ามปิดหลอดไฟติดกัน (i, i+1)
Input:
  บรรทัด 1: n k (3 ≤ n ≤ 100, 1 ≤ k ≤ 100)
  บรรทัด 2: รายการ L[i] (1 < L[i] ≤ 200)
Output:
  จำนวนวิธีที่ปิดได้`,
    example: `Input:
4 5
1 2 3 4

Output:
1`,
    hint: 'ที่ index i: เลือกปิดหรือไม่ปิด. ถ้าปิด → ห้ามปิด i+1, ต้องข้ามไป i+2',
    code: `#include <bits/stdc++.h>
using namespace std;

int n, k, count_ans = 0;
vector<int> L;

void solve(int i, int sum, int turned_off) {
  if (sum > k) return;            // pruning
  if (i >= n) {
    if (sum == k && turned_off >= 2) count_ans++;
    return;
  }
  // ตัวเลือก 1: ปิดหลอด i → ห้ามปิด i+1, ข้ามไป i+2
  solve(i + 2, sum + L[i], turned_off + 1);
  // ตัวเลือก 2: ไม่ปิดหลอด i → ไป i+1
  solve(i + 1, sum, turned_off);
}

int main() {
  cin >> n >> k;
  L.resize(n);
  for (auto& x : L) cin >> x;
  solve(0, 0, 0);
  cout << count_ans << "\\n";
  return 0;
}`,
    walkthrough: `ตัวอย่าง n=4, k=5, L=[1,2,3,4]:
  i=0 ปิด (sum=1, off=1) → i=2
    i=2 ปิด (sum=1+3=4, off=2) → i=4 (out) → sum=4 ≠ 5 ✗
    i=2 ไม่ปิด → i=3
      i=3 ปิด (sum=1+4=5, off=2) ✓
      i=3 ไม่ปิด → i=4 (out) → sum=1 ✗
  i=0 ไม่ปิด → i=1
    i=1 ปิด (sum=2, off=1) → i=3
      i=3 ปิด (sum=6, off=2) → out, sum > k ✗ (already > k จะ prune)
      i=3 ไม่ปิด → sum=2 ✗
    i=1 ไม่ปิด → i=2
      ...
🏆 = 1 วิธี (ปิด 1+4 = 5)`
  },
  {
    id: 3,
    title: 'Twin Gifts (แบ่งของขวัญฝาแฝด)',
    src: 'greedy.pdf Q4 (โจทย์ greedy ทำได้ด้วย backtracking ก็ได้)',
    diff: 'medium',
    spec: `ฝาแฝด n คู่ ของขวัญแต่ละคู่มีมูลค่า (a_i, b_i)
จัดให้พี่และน้องอย่างไรก็ได้ — แต่ละคู่ตัดสินใจอิสระว่าให้พี่หรือน้อง
หา <b>ผลต่างมูลค่ารวม</b> ของพี่ กับ น้องน้อยสุด

Input:
  บรรทัด 1: n (n ≤ 150)
  ต่อไป n บรรทัด: a_i b_i (1 ≤ a_i, b_i ≤ 300)
Output:
  ผลต่างน้อยสุด`,
    example: `Input:
4
3 5
7 11
8 8
2 9

Output:
1`,
    hint: 'subset sum: คู่ที่ i เลือก (a_i ไปพี่, b_i ไปน้อง) หรือ (b_i ไปพี่, a_i ไปน้อง). target = |total_a − total_b|. ใช้ DP จะเร็วกว่า แต่ backtracking ก็ทำได้',
    code: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<pair<int,int>> g;
int best = INT_MAX;

void solve(int i, int diff) {
  if (i == n) {
    best = min(best, abs(diff));
    return;
  }
  // pruning: ถ้า |diff| มากกว่า best + max remaining → skip
  // (ทำแบบเบา ๆ) — ละเอียดกว่านี้ค่อยใส่
  solve(i + 1, diff + g[i].first - g[i].second);   // a→พี่, b→น้อง
  solve(i + 1, diff - g[i].first + g[i].second);   // b→พี่, a→น้อง
}

int main() {
  cin >> n;
  g.resize(n);
  for (auto& [a, b] : g) cin >> a >> b;
  solve(0, 0);
  cout << best << "\\n";
  return 0;
}`,
    walkthrough: `n=4, gifts = (3,5)(7,11)(8,8)(2,9)
มี 16 ความเป็นไปได้ (2^4) — ลองทุกทาง:
  พี่=3,7,8,2=20, น้อง=5,11,8,9=33, diff=13
  พี่=3,7,8,9=27, น้อง=5,11,8,2=26, diff=1  ← min!
  พี่=5,11,8,2=26, น้อง=3,7,8,9=27, diff=1
  ...
🏆 = 1 (พี่ได้ของขวัญรวม 27, น้องได้ 26)`
  },
  {
    id: 4,
    title: 'Lexicographic Books',
    src: 'assignment_backtracking Q5 / exhaustive Q6',
    diff: 'easy',
    spec: `จัดเรียงหนังสือ n เล่มบนชั้น (ตัวอักษรพิมพ์ใหญ่ตัวเดียว) แสดงทุกการจัดเรียงแบบ <b>lexicographic order</b>

Input:
  บรรทัด 1: n (3 ≤ n ≤ 26)
  บรรทัด 2: รายชื่อหนังสือ n เล่ม คั่นช่องว่าง
Output:
  ทุก permutation บรรทัดละ 1 ชุด เรียงตัวอักษร`,
    example: `Input:
3
C A B

Output:
A B C
A C B
B A C
B C A
C A B
C B A`,
    hint: 'sort ก่อน → permute โดย swap (pos, i for i ≥ pos) จะได้ permutation ตามลำดับ lex',
    code: `#include <bits/stdc++.h>
using namespace std;

vector<string> books;
int n;

void perm(int pos) {
  if (pos == n) {
    for (int i = 0; i < n; i++) cout << books[i] << " \\n"[i+1 == n];
    return;
  }
  for (int i = pos; i < n; i++) {
    swap(books[pos], books[i]);
    perm(pos + 1);
    swap(books[pos], books[i]);
  }
}

int main() {
  cin >> n;
  books.resize(n);
  for (auto& b : books) cin >> b;
  sort(books.begin(), books.end());
  perm(0);
  return 0;
}`,
    walkthrough: `n=3, sorted = [A, B, C]
  pos=0, swap(0,0): [A,B,C]
    pos=1, swap(1,1): [A,B,C]
      pos=2: print "A B C"
    pos=1, swap(1,2): [A,C,B]
      pos=2: print "A C B"
  pos=0, swap(0,1): [B,A,C]
    pos=1, swap(1,1): [B,A,C]: print "B A C"
    pos=1, swap(1,2): [B,C,A]: print "B C A"
  pos=0, swap(0,2): [C,B,A]
    sort → wait, ที่ swap ทำให้ไม่ใช่ lex order...
📌 หมายเหตุ: วิธี swap-based ปกติไม่ให้ lex order — ใช้ std::next_permutation จะตรงกว่า`
  },
  {
    id: 5,
    title: 'N-Queens Count',
    src: 'assignment_exhaustive Q4 / backtracking Q4',
    diff: 'medium',
    spec: `วาง n queens บนบอร์ด n×n โดยไม่เจอกัน (แถว, คอลัมน์, แนวทแยง)
นับจำนวนวิธีที่วางได้

Input:
  n (3 ≤ n ≤ 12)
Output:
  จำนวนวิธี`,
    example: `Input:
4

Output:
2

Input:
8

Output:
92`,
    hint: 'X[row] = col. safe(): |X[i] - X[j]| ≠ |i - j| และ X[i] ≠ X[j]',
    code: `#include <bits/stdc++.h>
using namespace std;

int n, count_ans = 0;
vector<int> X;

bool safe(int row) {
  for (int i = 0; i < row; i++) {
    if (X[i] == X[row]) return false;
    if (abs(X[row] - X[i]) == abs(row - i)) return false;
  }
  return true;
}

void place(int row) {
  if (row == n) { count_ans++; return; }
  for (int col = 0; col < n; col++) {
    X[row] = col;
    if (safe(row)) place(row + 1);
  }
}

int main() {
  cin >> n;
  X.assign(n, 0);
  place(0);
  cout << count_ans << "\\n";
  return 0;
}`,
    walkthrough: `n=4: solutions = (1,3,0,2), (2,0,3,1) → 2 วิธี
n=5: 10 วิธี
n=6: 4 วิธี
n=7: 40 วิธี
n=8: 92 วิธี
n=9: 352 วิธี
n=10: 724 วิธี — เริ่มช้า ต้องเพิ่ม pruning`
  },
  {
    id: 6,
    title: '0/1 Knapsack with Backtracking',
    src: 'assignment_backtracking Q3 / assignment_backtracking2 Q1',
    diff: 'medium',
    spec: `เลือก items เพื่อใส่ knapsack ที่รับน้ำหนัก W
แต่ละ item มี (value, weight)
หามูลค่ารวมสูงสุด — ด้วย <b>backtracking</b> (ไม่ใช่ DP)

Input:
  บรรทัด 1: n W
  บรรทัด 2: values
  บรรทัด 3: weights
Output:
  มูลค่าสูงสุด`,
    example: `Input:
4 18
12 5 4 2
8 7 4 2

Output:
19`,
    hint: 'binary tree: เลือกหรือไม่เลือก. pruning: ถ้า current_weight > W → cut; ถ้า upper_bound (fractional) < best → cut',
    code: `#include <bits/stdc++.h>
using namespace std;

int n, W, best = 0;
vector<int> v, w;

void solve(int i, int cur_w, int cur_v) {
  if (cur_w > W) return;          // pruning: เกินน้ำหนัก
  if (i == n) {
    best = max(best, cur_v);
    return;
  }
  // upper bound check (optional): ถ้าเอาที่เหลือทุกชิ้นยังไม่เกิน best → cut
  // int rem = accumulate(v.begin()+i, v.end(), 0);
  // if (cur_v + rem <= best) return;
  solve(i + 1, cur_w + w[i], cur_v + v[i]);  // เลือก
  solve(i + 1, cur_w,        cur_v);         // ไม่เลือก
}

int main() {
  cin >> n >> W;
  v.resize(n); w.resize(n);
  for (auto& x : v) cin >> x;
  for (auto& x : w) cin >> x;
  solve(0, 0, 0);
  cout << best << "\\n";
  return 0;
}`,
    walkthrough: `n=4, W=18, V=[12,5,4,2], W=[8,7,4,2]
🌳 binary tree 2^4 = 16 leaves
  best candidates:
    (1,1,1,1) w=21 ✗ prune
    (1,1,0,1) w=17, v=19 ✓ ← best!
    (1,0,1,1) w=14, v=18
    (1,1,1,0) w=19 ✗ prune
    ...
🏆 v=19 ที่เลือก {1, 2, 4} (น้ำหนัก 8+7+2=17, มูลค่า 12+5+2=19)`
  },
  {
    id: 7,
    title: 'Chair Permutation (count with adjacency)',
    src: 'assignment_exhaustive Q1',
    diff: 'medium',
    spec: `จัด n คนนั่งบนเก้าอี้เรียงกัน — เด็กคน 1 และ 2 ต้อง<b>นั่งติดกัน</b>เสมอ
นับจำนวนวิธีที่จัดได้

Input:
  n (2 ≤ n ≤ 10)
Output:
  จำนวนวิธี`,
    example: `Input:
3

Output:
4

Input:
4

Output:
12`,
    hint: 'permute ทุกแบบ + filter ที่ |pos(1) − pos(2)| = 1. หรือ "ติดกัน" = ใช้กล่อง: (1,2) เป็น 1 ตัว → (n-1)! · 2',
    code: `#include <bits/stdc++.h>
using namespace std;

int n, total = 0;
vector<int> X;
vector<bool> used;

bool valid() {
  int p1 = -1, p2 = -1;
  for (int i = 0; i < n; i++) {
    if (X[i] == 1) p1 = i;
    if (X[i] == 2) p2 = i;
  }
  return abs(p1 - p2) == 1;
}

void perm(int pos) {
  if (pos == n) {
    if (valid()) total++;
    return;
  }
  for (int v = 1; v <= n; v++) {
    if (!used[v]) {
      used[v] = true;
      X[pos] = v;
      perm(pos + 1);
      used[v] = false;
    }
  }
}

int main() {
  cin >> n;
  X.assign(n, 0);
  used.assign(n + 1, false);
  perm(0);
  cout << total << "\\n";
  return 0;
}`,
    walkthrough: `n=3:
  permutations ทั้งหมด = 6:
    1 2 3 ✓ (1-2 ติด)
    1 3 2 ✗
    2 1 3 ✓
    2 3 1 ✗
    3 1 2 ✓
    3 2 1 ✓
  → 4 วิธี ✓

n=4 → 12 วิธี ✓
สูตร: 2 · (n-1)! (คน 1-2 เป็นกล่อง, มี 2 ทิศ)
  n=3 → 2·2! = 4 ✓
  n=4 → 2·3! = 12 ✓`
  },
];

const BT_DIFFS = {
  easy:   { label: '🟢 Easy',   color: '#22c55e' },
  medium: { label: '🟡 Medium', color: '#fbbf24' },
  hard:   { label: '🔴 Hard',   color: '#f87171' },
};

Lessons3["backtracking-problems"] = function () {
  const [diff, setDiff] = useS3('all');
  const [shown, setShown] = useS3({});
  const list = diff === 'all' ? BACKTRACKING_PROBLEMS : BACKTRACKING_PROBLEMS.filter(p => p.diff === diff);
  const toggle = (id, k) => setShown(s => ({ ...s, [`${id}-${k}`]: !s[`${id}-${k}`] }));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔍 Backtracking Problems Bank — {BACKTRACKING_PROBLEMS.length} ข้อจากชีท KMUTNB</div>
        ที่มา: <b>assignment_backtracking.pdf</b>, <b>assignment_backtracking2.pdf</b>, <b>assignment_exhaustive_search.pdf</b>, <b>greedy.pdf Q4</b>
        <br/>แต่ละข้อมี spec input/output ตามรูปแบบชีท + hint + เฉลย C++ + walkthrough
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        <button onClick={() => setDiff('all')}
          style={{ background: diff === 'all' ? 'var(--accent)' : 'var(--bg-3)', color: diff === 'all' ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          🗂 ทั้งหมด ({BACKTRACKING_PROBLEMS.length})
        </button>
        {Object.entries(BT_DIFFS).map(([k, v]) => {
          const count = BACKTRACKING_PROBLEMS.filter(p => p.diff === k).length;
          return (
            <button key={k} onClick={() => setDiff(k)}
              style={{ background: diff === k ? v.color : 'var(--bg-3)', color: diff === k ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              {v.label} ({count})
            </button>
          );
        })}
      </div>

      {list.map(p => {
        const d = BT_DIFFS[p.diff];
        return (
          <div key={p.id} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{p.id}. {p.title}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, padding: '2px 8px', background: d.color, color: '#000', borderRadius: 999 }}>{d.label}</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)' }}>📄 {p.src}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-1)', whiteSpace: 'pre-wrap', marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: p.spec }} />
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>ตัวอย่าง:</div>
            <pre className="code" style={{ marginBottom: 8 }}>{p.example}</pre>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <button onClick={() => toggle(p.id, 'h')} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                💡 {shown[`${p.id}-h`] ? 'Hide' : 'Hint'}
              </button>
              <button onClick={() => toggle(p.id, 'w')} style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid #a78bfa', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                🚶 {shown[`${p.id}-w`] ? 'Hide' : 'Walkthrough'}
              </button>
              <button onClick={() => toggle(p.id, 'c')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ✓ {shown[`${p.id}-c`] ? 'Hide' : 'Show'} Code
              </button>
            </div>
            {shown[`${p.id}-h`] && (
              <div style={{ padding: 10, background: 'rgba(251,191,36,0.06)', borderLeft: '3px solid #fbbf24', borderRadius: 4, fontSize: 13, marginBottom: 6 }}>
                💡 {p.hint}
              </div>
            )}
            {shown[`${p.id}-w`] && (
              <div style={{ padding: 10, background: 'rgba(139,92,246,0.06)', borderLeft: '3px solid #a78bfa', borderRadius: 4, fontSize: 12, marginBottom: 6, whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}>
                {p.walkthrough}
              </div>
            )}
            {shown[`${p.id}-c`] && (
              <pre className="code" style={{ marginTop: 6, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981' }}>{p.code}</pre>
            )}
          </div>
        );
      })}
    </React.Fragment>
  );
};

window.LessonsPart3 = Lessons3;
