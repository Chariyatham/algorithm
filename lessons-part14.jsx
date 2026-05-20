/* Lessons Part 14 — Proofs & Analysis (มหาลัย): Big-O proofs, Recursion methods, Loop invariant, Amortized */

const { useState: useS14, useMemo: useM14, useEffect: useE14 } = React;
const { Quiz: Quiz14 } = window.LessonComponents;
const { WorkedExample: WE14, CheatSheet: CS14, Pitfalls: PF14 } = window.LearningKit;

const Lessons14 = {};

/* ============================================================
   Shared Viz — Loop Invariant Trace (Insertion Sort)
============================================================ */
function LoopInvariantViz() {
  const INITIAL = [5, 2, 4, 6, 1, 3];
  const trace = useM14(() => {
    const a = [...INITIAL];
    const log = [{ a: [...a], j: 0, i: -1, key: null, msg: 'Start — invariant: a[0..0] sorted (trivially)' }];
    for (let j = 1; j < a.length; j++) {
      const key = a[j];
      let i = j - 1;
      log.push({ a: [...a], j, i, key, msg: `Outer iter j=${j}: key=${key}, invariant: a[0..${j - 1}] sorted` });
      while (i >= 0 && a[i] > key) {
        a[i + 1] = a[i];
        log.push({ a: [...a], j, i, key, msg: `Shift a[${i}] → a[${i + 1}]` });
        i--;
      }
      a[i + 1] = key;
      log.push({ a: [...a], j, i: i + 1, key, msg: `Insert key=${key} at a[${i + 1}] → invariant: a[0..${j}] sorted ✓` });
    }
    log.push({ a: [...a], j: a.length, i: -1, key: null, msg: `Termination: j = n. Invariant gives a[0..n-1] sorted ✓ ▢` });
    return log;
  }, []);

  const [step, setStep] = useS14(0);
  const cur = trace[step];

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <button onClick={() => setStep(0)}>↺ Reset</button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>◀</button>
        <button onClick={() => setStep(s => Math.min(trace.length - 1, s + 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>▶</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Step {step + 1}/{trace.length}</span>
      </div>

      <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 6 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          {cur.a.map((v, i) => {
            const sortedRange = i < cur.j; // a[0..j-1] sorted invariant
            const isPivot = i === cur.j && cur.j > 0;
            const isCursor = i === cur.i;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ height: 16, fontSize: 10, color: isPivot ? '#fbbf24' : (isCursor ? 'var(--accent)' : 'transparent'), fontWeight: 700 }}>
                  {isPivot ? 'j' : (isCursor ? 'i' : '')}
                </div>
                <div style={{
                  width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isPivot ? 'rgba(251,191,36,0.4)' : (sortedRange ? 'rgba(94,234,212,0.25)' : 'var(--bg-3)'),
                  border: '1px solid ' + (isPivot ? '#fbbf24' : (sortedRange ? 'var(--accent-2)' : 'var(--border)')),
                  borderRadius: 4, fontFamily: 'monospace', fontWeight: 700, fontSize: 15,
                  color: 'var(--text-0)'
                }}>{v}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>[{i}]</div>
              </div>
            );
          })}
        </div>
        {cur.j > 0 && cur.j <= cur.a.length && (
          <div style={{ marginTop: 10, padding: '4px 8px', background: 'rgba(94,234,212,0.1)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', color: 'var(--accent-2)' }}>
            🛡️ INVARIANT: a[0..{cur.j - 1}] sorted (highlighted ░)
          </div>
        )}
      </div>

      <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-1)', borderLeft: '3px solid var(--accent)', borderRadius: 4, fontSize: 13, fontFamily: 'monospace' }}>
        ► {cur.msg}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 ▓ <b>Initialization</b> (step 0) → ▒ <b>Maintenance</b> (ทุก step) → ▓ <b>Termination</b> (step สุดท้าย) — invariant พิสูจน์ correctness
      </div>
    </div>
  );
}

/* ============================================================
   64 — FORMAL BIG-O / Ω / Θ PROOFS
============================================================ */
Lessons14["big-o-proofs"] = function () {
  const [n, setN] = useS14(10);
  // demo: prove 2n² + 3n + 5 = O(n²)
  // need c, n0 such that 2n² + 3n + 5 ≤ c·n² for all n ≥ n0
  // choose c = 10, n0 = 1 → 2n² + 3n + 5 ≤ 10n² ⟺ 8n² - 3n - 5 ≥ 0 → true for n ≥ 1
  const f = 2 * n * n + 3 * n + 5;
  const g = 10 * n * n;

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ <b>นิยามทางการ</b> ของ Big-O, Ω, Θ — แล้ว<b>พิสูจน์ได้</b> ไม่ใช่แค่ทำนาย
      </div>

      <h3>นิยามทางการ (Formal Definitions)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, margin: '12px 0' }}>
        <div style={{ marginBottom: 12 }}>
          <b style={{ color: 'var(--accent)' }}>Big-O (upper bound):</b><br/>
          <span style={{ fontFamily: 'monospace', fontSize: 15 }}>
            f(n) = O(g(n)) ⟺ ∃ c &gt; 0, n₀ &gt; 0 : 0 ≤ f(n) ≤ c·g(n) ∀ n ≥ n₀
          </span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <b style={{ color: 'var(--accent-2)' }}>Big-Ω (lower bound):</b><br/>
          <span style={{ fontFamily: 'monospace', fontSize: 15 }}>
            f(n) = Ω(g(n)) ⟺ ∃ c &gt; 0, n₀ &gt; 0 : 0 ≤ c·g(n) ≤ f(n) ∀ n ≥ n₀
          </span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <b style={{ color: 'var(--accent-3)' }}>Big-Θ (tight bound):</b><br/>
          <span style={{ fontFamily: 'monospace', fontSize: 15 }}>
            f(n) = Θ(g(n)) ⟺ ∃ c₁, c₂ &gt; 0, n₀ &gt; 0 : c₁·g(n) ≤ f(n) ≤ c₂·g(n) ∀ n ≥ n₀
          </span>
        </div>
        <div>
          <b style={{ color: 'var(--warn)' }}>little-o (strict upper):</b><br/>
          <span style={{ fontFamily: 'monospace', fontSize: 15 }}>
            f(n) = o(g(n)) ⟺ ∀ c &gt; 0, ∃ n₀ : 0 ≤ f(n) &lt; c·g(n) ∀ n ≥ n₀<br/>
            ⟺ lim<sub>n→∞</sub> f(n)/g(n) = 0
          </span>
        </div>
      </div>

      <h3>Visual: 2n² + 3n + 5 ≤ 10n² (n ≥ 1)</h3>
      <div className="viz">
        <div className="viz-toolbar">
          <span style={{ fontSize: 12 }}>n =</span>
          <input type="range" min="1" max="30" value={n} onChange={e => setN(+e.target.value)} style={{ width: 200 }} />
          <span style={{ fontFamily: 'monospace' }}>{n}</span>
        </div>
        <div className="viz-stage" style={{ padding: 20, flexDirection: 'column', gap: 12 }}>
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>f(n) = 2n² + 3n + 5 = <b style={{ color: 'var(--accent)' }}>{f}</b></div>
            <div style={{ height: 24, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${(f/g)*100}%`, height: '100%', background: 'var(--accent)', transition: 'width .25s' }} />
            </div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>c·g(n) = 10n² = <b style={{ color: 'var(--accent-2)' }}>{g}</b> {f <= g ? '✓ f ≤ cg' : '✗ f > cg'}</div>
            <div style={{ height: 24, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--accent-2)' }} />
            </div>
          </div>
        </div>
      </div>

      <WE14
        title="Worked Example 1: พิสูจน์ 2n² + 3n + 5 = O(n²)"
        problem="แสดงว่า f(n) = 2n² + 3n + 5 เป็น O(n²) โดยใช้นิยาม"
        steps={[
          { title: "ตั้งสิ่งที่ต้องหา", body: "ต้องหา <b>c &gt; 0</b> และ <b>n₀</b> ที่ทำให้\n  2n² + 3n + 5 ≤ c·n²  ∀ n ≥ n₀", why: "นิยามของ Big-O ต้องการคู่ (c, n₀)" },
          { title: "ลอง bound แต่ละพจน์ด้วย n²", body: "สำหรับ n ≥ 1:\n  • 2n² ≤ 2n²\n  • 3n  ≤ 3n²    (เพราะ n ≥ 1 → n ≤ n²)\n  • 5   ≤ 5n²    (เพราะ n ≥ 1 → 1 ≤ n²)", why: "ทุกพจน์ที่โตช้ากว่า n² → bound ด้วย n² ได้" },
          { title: "รวม", body: "2n² + 3n + 5 ≤ 2n² + 3n² + 5n² = <b>10n²</b>", why: "บวกอสมการรวมกัน" },
          { title: "เลือก c และ n₀", body: "<b>c = 10, n₀ = 1</b>\n→ 2n² + 3n + 5 ≤ 10n²  ∀ n ≥ 1  ✓", why: "นี่คือ witness pair ที่ยืนยัน Big-O" },
        ]}
        answer="∴ f(n) = O(n²) — พิสูจน์เสร็จด้วย c=10, n₀=1 ▢"
        takeaway="วิธีพิสูจน์ Big-O: ‘bound แต่ละพจน์’ ด้วยฟังก์ชันเป้าหมาย แล้วรวม"
      />

      <WE14
        title="Worked Example 2: พิสูจน์ n² ≠ O(n) (disproof)"
        problem="แสดงว่า n² ไม่ใช่ O(n)"
        steps={[
          { title: "สมมติให้ขัดแย้ง (proof by contradiction)", body: "สมมุติ n² = O(n)\n→ ∃ c &gt; 0, n₀ : n² ≤ c·n ∀ n ≥ n₀", why: "เริ่มจากสมมุติฐานตรงข้าม" },
          { title: "ทำให้ง่ายขึ้น", body: "หาร n ทั้งสองข้าง (n &gt; 0):\n  n ≤ c  ∀ n ≥ n₀", why: "อสมการที่เหลือ" },
          { title: "หาความขัดแย้ง", body: "เลือก n = max(n₀, c+1)\n→ n ≥ c + 1 &gt; c\n→ ขัดกับ n ≤ c  ↯", why: "ไม่มี c คงที่ใดที่ใหญ่กว่า n ทุกตัว" },
        ]}
        answer="∴ n² ≠ O(n) ▢"
        takeaway="เพื่อแสดงว่า ‘ไม่ใช่ Big-O’ → contradiction หรือ limit ratio → ∞"
      />

      <WE14
        title="Worked Example 3: พิสูจน์ 3n + 5 = Θ(n)"
        problem="แสดงทั้ง Big-O และ Big-Ω เพื่อยืนยัน Θ"
        steps={[
          { title: "Upper bound (Big-O)", body: "3n + 5 ≤ 3n + 5n = 8n  ∀ n ≥ 1\n→ c₂ = 8, n₀ = 1 ✓", why: "5 ≤ 5n เมื่อ n ≥ 1" },
          { title: "Lower bound (Big-Ω)", body: "3n + 5 ≥ 3n  ∀ n ≥ 1\n→ c₁ = 3, n₀ = 1 ✓", why: "5 ≥ 0 เสมอ" },
          { title: "รวม", body: "3n ≤ 3n + 5 ≤ 8n  ∀ n ≥ 1\n→ Θ(n) ด้วย c₁=3, c₂=8, n₀=1", why: "Θ ต้องการทั้งสองทิศ" },
        ]}
        answer="∴ 3n + 5 = Θ(n) ▢"
      />

      <h3>ตารางวิธีคำนวณด้วย Limit (Limit Method)</h3>
      <table className="cmp">
        <thead><tr><th>ค่า lim<sub>n→∞</sub> f(n)/g(n)</th><th>สรุป</th></tr></thead>
        <tbody>
          <tr><td className="mono">0</td><td>f = o(g) → f = O(g) แต่ไม่ Ω(g)</td></tr>
          <tr><td className="mono">ค่าจำกัด c &gt; 0</td><td>f = Θ(g)</td></tr>
          <tr><td className="mono">∞</td><td>f = ω(g) → f = Ω(g) แต่ไม่ O(g)</td></tr>
        </tbody>
      </table>

      <CS14 title="Big-O Proof Cheat Sheet" sections={[
        { label: "พิสูจน์ f = O(g)", value: "หา c, n₀ ที่ f(n) ≤ c·g(n) ∀ n ≥ n₀<br/>วิธีง่าย: bound แต่ละพจน์ด้วย g(n)" },
        { label: "พิสูจน์ f ≠ O(g)", value: "Contradiction: สมมุติมี c, n₀ → หาขัดแย้ง<br/>หรือใช้ lim f/g = ∞" },
        { label: "พิสูจน์ Θ", value: "พิสูจน์ทั้ง O และ Ω<br/>หรือ lim f/g = ค่าจำกัด &gt; 0" },
        { label: "Hierarchy", value: "1 ≪ log log n ≪ log n ≪ n^ε ≪ n ≪ n log n ≪ n² ≪ n^c ≪ 2ⁿ ≪ n! ≪ nⁿ" },
      ]} />

      <PF14 items={[
        { trap: "เขียนว่า ‘f(n) = O(g(n))’ แล้วคิดว่าเป็นการเท่ากัน", fix: "= ใน Big-O เป็น <b>abuse of notation</b> — แท้จริงคือ ‘f ∈ O(g)’" },
        { trap: "เลือก n₀ ไม่ระบุ — เริ่มจาก n = 0", fix: "ฟังก์ชัน log, division อาจไม่นิยามที่ n=0 → ใช้ n₀ ≥ 1 เสมอ" },
        { trap: "บอกว่า O(2n²) — เก็บ constant", fix: "Big-O <b>ดูดซับ constant</b> → เขียน O(n²) เท่านั้น" },
        { trap: "คิดว่า Big-O = ‘worst case’", fix: "Big-O = upper bound (asymptotic) ไม่ใช่ best/worst/avg case — ใช้ได้กับทุก case" },
      ]} />

      <Quiz14 q={{
        question: "ข้อใด <b>ไม่จริง</b>?",
        options: [
          "n log n = O(n²)",
          "n² = Ω(n log n)",
          "100n = Θ(n)",
          "2ⁿ = O(n!)  (จริงสำหรับ n ใหญ่)"
        ],
        answer: 3,
        explain: "จริง ๆ แล้ว 2ⁿ = O(n!) ก็ใช่ (n! โตเร็วกว่ามาก) — ข้ออื่นถูกหมด: A) n log n &lt; n² → O ใช่; B) n² ≥ n log n → Ω ใช่; C) 100n bound ทั้งสองทิศด้วย c=100, c=100 → Θ ใช่"
      }} />

      <Quiz14 q={{
        question: "พิสูจน์ 5n³ + 2n + 1 = O(n³) ต้องการ c อย่างน้อยเท่าใด (เลือกค่าใช้ได้)?",
        options: ["c = 5", "c = 6", "c = 8", "c = 1"],
        answer: 2,
        explain: "5n³ + 2n + 1 ≤ 5n³ + 2n³ + 1·n³ = 8n³ เมื่อ n ≥ 1 → c=8 ใช้ได้ (c=5,6 ไม่พอเมื่อ n เล็ก)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   65 — SUBSTITUTION & RECURSION TREE
============================================================ */
function RecursionTreeViz({ a, b, fn, label }) {
  // visualize recursion tree for T(n) = a*T(n/b) + n^d
  const levels = Math.min(5, Math.floor(Math.log(64) / Math.log(b)));
  const tree = [];
  for (let lvl = 0; lvl <= levels; lvl++) {
    const subprobs = Math.pow(a, lvl);
    const size = 64 / Math.pow(b, lvl);
    const work = subprobs * Math.pow(size, fn);
    tree.push({ lvl, subprobs, size: size.toFixed(1), work: work.toFixed(0) });
  }
  return (
    <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, margin: '12px 0' }}>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>
        Recursion tree of <b>{label}</b> (เริ่ม n = 64)
      </div>
      <table className="cmp" style={{ fontSize: 13 }}>
        <thead><tr><th>Level</th><th># subproblems</th><th>Size</th><th>Work / level</th></tr></thead>
        <tbody>
          {tree.map(r => (
            <tr key={r.lvl}>
              <td className="mono">{r.lvl}</td>
              <td className="mono">{r.subprobs}</td>
              <td className="mono">{r.size}</td>
              <td className="mono" style={{ color: 'var(--accent-2)' }}>{r.work}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Lessons14["recursion-methods"] = function () {
  const [demo, setDemo] = useS14('merge');
  const demos = {
    merge: { a: 2, b: 2, fn: 1, label: 'T(n) = 2T(n/2) + n' },
    binary: { a: 1, b: 2, fn: 0, label: 'T(n) = T(n/2) + 1' },
    strassen: { a: 7, b: 2, fn: 2, label: 'T(n) = 7T(n/2) + n²' },
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        แก้ recurrence <b>โดยไม่ใช้ Master Theorem</b> — ใช้ <b>Substitution</b> (guess + induction) และ <b>Recursion Tree</b>
      </div>

      <h3>วิธีที่ 1 — Substitution Method</h3>
      <p>3 ขั้นตอน: <b>(1) Guess</b> รูปคำตอบ → <b>(2) Verify by induction</b> → <b>(3) Find constants</b></p>

      <WE14
        title="Substitution: T(n) = 2T(n/2) + n"
        problem="แก้ recurrence T(n) = 2T(n/2) + n, T(1) = 1"
        steps={[
          { title: "Guess", body: "เดาว่า T(n) ≤ cn log n สำหรับ c บางตัว", why: "เห็นรูป 2T(n/2) → คาดว่าจะได้ n log n เหมือน merge sort" },
          { title: "Inductive Hypothesis", body: "สมมุติ T(k) ≤ ck log k สำหรับทุก k &lt; n", why: "Strong induction" },
          { title: "Verify Inductive Step", body: "T(n) = 2T(n/2) + n\n     ≤ 2·c·(n/2)·log(n/2) + n\n     = cn(log n - log 2) + n\n     = cn log n - cn + n\n     = cn log n + (1-c)n", why: "ใช้ IH กับ n/2" },
          { title: "Pick c", body: "ต้องการ cn log n + (1-c)n ≤ cn log n\n⟺ (1-c)n ≤ 0\n⟺ <b>c ≥ 1</b>", why: "เลือก c = 1 → T(n) ≤ n log n" },
          { title: "Base case", body: "ตรวจ T(1) = 1 ≤ 1·1·log 1 = 0  ✗\nแก้: เปลี่ยน n₀ → T(2) = 2T(1) + 2 = 4, ต้องการ 2c log 2 = 2c ≥ 4 → c ≥ 2", why: "ปรับ constant ที่ base case" },
        ]}
        answer="T(n) = O(n log n) — ด้วย c = 2, n₀ = 2 ▢"
        takeaway="Substitution ต้อง <b>เดาให้แม่นใกล้ ๆ</b> — ถ้าเดาผิดจะ verify ไม่ผ่าน"
      />

      <h3>วิธีที่ 2 — Recursion Tree Method</h3>
      <p>วาดต้นไม้ของการเรียก recurrence แล้วบวก<b>work ทุก level</b></p>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>เลือก recurrence:</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.entries(demos).map(([k, v]) => (
            <button key={k} onClick={() => setDemo(k)}
              style={{
                background: demo === k ? 'var(--accent)' : 'var(--bg-2)',
                color: demo === k ? '#000' : 'var(--text-1)',
                border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                fontWeight: demo === k ? 600 : 400
              }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <RecursionTreeViz {...demos[demo]} />

      <WE14
        title="Recursion Tree: T(n) = T(n/4) + T(n/2) + n²"
        problem="แก้ recurrence ไม่สม่ำเสมอนี้ — Master Theorem ใช้ไม่ได้"
        steps={[
          { title: "Level 0 (root)", body: "1 ปัญหาขนาด n → work = n²", why: "" },
          { title: "Level 1", body: "2 ปัญหา (ขนาด n/4 และ n/2)\nwork = (n/4)² + (n/2)² = n²/16 + n²/4 = <b>5n²/16</b>", why: "บวก work ของทั้งสอง subproblems" },
          { title: "Level 2", body: "ต่อจาก n/4 → n/16, n/8\nต่อจาก n/2 → n/8, n/4\nwork ทั้งหมด ≈ (5/16)² · n² = 25n²/256", why: "work หดลงด้วยอัตราส่วน 5/16 ต่อ level" },
          { title: "Sum (geometric)", body: "Total = n² · (1 + 5/16 + (5/16)² + ...)\n      ≤ n² · 1/(1 - 5/16)\n      = n² · 16/11\n      = O(n²)", why: "Geometric series รวมเป็นค่าจำกัด (ratio &lt; 1)" },
        ]}
        answer="T(n) = O(n²) ▢"
        takeaway="ถ้า work หดเร็ว (ratio &lt; 1) → top-heavy → ใช้ root work เป็น bound"
      />

      <h3>3 รูปแบบของ Recursion Tree</h3>
      <table className="cmp">
        <thead><tr><th>ลักษณะ</th><th>Work รวม</th><th>ตัวอย่าง</th></tr></thead>
        <tbody>
          <tr><td>Root-heavy (work ↓ ต่อ level)</td><td>O(root work)</td><td>T(n) = 2T(n/2) + n² → O(n²)</td></tr>
          <tr><td>Balanced (work เท่ากันทุก level)</td><td>O(level work × #levels)</td><td>T(n) = 2T(n/2) + n → O(n log n)</td></tr>
          <tr><td>Leaf-heavy (work ↑ ต่อ level)</td><td>O(#leaves · base work)</td><td>T(n) = 3T(n/2) + n → O(n^log₂3)</td></tr>
        </tbody>
      </table>

      <h3>วิธีที่ 3 — Change of Variables</h3>
      <WE14
        title="T(n) = 2T(√n) + log n"
        problem="recurrence แปลก — ใช้ change of variable"
        steps={[
          { title: "ให้ m = log₂ n", body: "n = 2^m → √n = 2^(m/2)\nT(2^m) = 2T(2^(m/2)) + m", why: "เปลี่ยน n เป็น m เพื่อให้ structure ง่ายขึ้น" },
          { title: "ให้ S(m) = T(2^m)", body: "S(m) = 2S(m/2) + m", why: "ตอนนี้ใช้ Master Theorem ได้!" },
          { title: "Apply Master", body: "a=2, b=2, d=1 → Case 2 → S(m) = O(m log m)", why: "log_b(a) = 1 = d" },
          { title: "Back-substitute", body: "T(n) = S(log n) = O(log n · log log n)", why: "แทน m = log n กลับ" },
        ]}
        answer="T(n) = O(log n · log log n) ▢"
      />

      <CS14 title="Recurrence Method Cheat Sheet" sections={[
        { label: "Master Theorem", value: "T(n) = aT(n/b) + n^d — ใช้เมื่อ structure สม่ำเสมอ" },
        { label: "Substitution", value: "Guess + Induction — ต้องเดาให้แม่น" },
        { label: "Recursion Tree", value: "Visual — เหมาะกับ recurrence ไม่สม่ำเสมอ" },
        { label: "Change of Variable", value: "เปลี่ยน n เป็น m = log n / √n / 2^k" },
      ]} />

      <Quiz14 q={{
        question: "T(n) = T(n/3) + T(2n/3) + n — work รวมต่อ level เป็นเท่าใด?",
        options: ["n/2 (ลดครึ่ง)", "n (คงที่)", "2n (เพิ่ม)", "n²"],
        answer: 1,
        explain: "Level k มี work = (1/3 + 2/3)·n = n เท่าเดิม → balanced tree → O(n × #levels) = O(n log n)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   66 — LOOP INVARIANT & CORRECTNESS PROOF
============================================================ */
Lessons14["loop-invariant"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        พิสูจน์ว่า <b>อัลกอริทึมถูกต้อง</b> (correctness) — ไม่ใช่แค่เร็ว — ด้วย <b>Loop Invariant</b>
      </div>

      <h3>นิยาม — Loop Invariant</h3>
      <p>
        คือ <b>คุณสมบัติ</b> ของตัวแปร ที่เป็นจริง<b>ทุกครั้งก่อนเริ่ม iteration</b> ของ loop
      </p>

      <h3>3 ขั้นตอนพิสูจน์</h3>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, margin: '12px 0' }}>
        <div style={{ marginBottom: 10 }}>
          <b style={{ color: 'var(--accent)' }}>1. Initialization:</b> invariant เป็นจริง<b>ก่อนเริ่ม</b> loop (iteration ที่ 1)
        </div>
        <div style={{ marginBottom: 10 }}>
          <b style={{ color: 'var(--accent-2)' }}>2. Maintenance:</b> ถ้า invariant จริงก่อน iteration → จริง<b>หลัง</b> iteration (เพื่อรอ iter ถัดไป)
        </div>
        <div>
          <b style={{ color: 'var(--accent-3)' }}>3. Termination:</b> เมื่อ loop จบ → invariant ให้คุณสมบัติที่<b>พิสูจน์ความถูกต้อง</b>
        </div>
      </div>

      <h3>🎬 Interactive — Insertion Sort + invariant highlight (a[0..j-1] sorted)</h3>
      <LoopInvariantViz />

      <WE14
        title="Worked Example 1: Insertion Sort"
        problem={`<pre style='margin:0'>for j = 2 to n:
  key = a[j]
  i = j - 1
  while i &gt; 0 and a[i] &gt; key:
    a[i+1] = a[i]
    i = i - 1
  a[i+1] = key</pre>`}
        steps={[
          { title: "Invariant ของ outer loop (for j)", body: "ก่อนเริ่ม iteration ของ j แต่ละครั้ง:\n<b>subarray a[1..j-1] ประกอบด้วย element เดิมจาก a[1..j-1] แต่เรียงแล้ว</b>", why: "เป็นคุณสมบัติที่อยากให้จริงตลอด" },
          { title: "Initialization (j = 2)", body: "a[1..1] มี element เดียว → trivially sorted ✓", why: "ก่อน iter แรก invariant เป็นจริง" },
          { title: "Maintenance (j → j+1)", body: "Inner while ย้าย a[j-1], a[j-2], ... ที่มากกว่า key ไปขวาทีละช่อง จนเจอตำแหน่งที่ถูก → insert key\n→ ตอนนี้ a[1..j] เรียงแล้ว ✓", why: "iter ของ j ทำงานถูก" },
          { title: "Termination (j = n+1)", body: "Loop จบเมื่อ j = n+1\nจาก invariant: a[1..n] เรียงแล้ว ← นี่คือ output ที่ต้องการ ✓", why: "Termination ให้ correctness" },
        ]}
        answer="∴ Insertion Sort คืน array ที่เรียงแล้ว ▢"
        takeaway="Loop invariant คือเครื่องมือ <b>ทางการ</b> เพื่อพิสูจน์อัลกอริทึม"
      />

      <WE14
        title="Worked Example 2: Binary Search"
        problem={`<pre style='margin:0'>lo = 0, hi = n - 1
while lo &lt;= hi:
  mid = (lo + hi) / 2
  if a[mid] == x: return mid
  else if a[mid] &lt; x: lo = mid + 1
  else: hi = mid - 1
return -1</pre>`}
        steps={[
          { title: "Invariant", body: "<b>ถ้า x อยู่ใน array จริง → x อยู่ใน a[lo..hi]</b>", why: "Search space ที่เหลือ" },
          { title: "Initialization", body: "lo=0, hi=n-1 → a[0..n-1] = ทั้ง array → x อยู่ที่ไหนก็อยู่ในนี้ ✓", why: "ก่อนเริ่ม invariant เป็นจริง" },
          { title: "Maintenance", body: "Case 1: a[mid] = x → return ✓\nCase 2: a[mid] &lt; x → x &gt; a[mid] (เพราะ sorted) → x ไม่อยู่ใน a[lo..mid] → x ∈ a[mid+1..hi] → set lo = mid+1 ✓\nCase 3: a[mid] &gt; x → x ∈ a[lo..mid-1] → set hi = mid-1 ✓", why: "ทุก case รักษา invariant" },
          { title: "Termination", body: "Loop จบเมื่อ lo &gt; hi → range a[lo..hi] ว่าง\nจาก invariant: ถ้า x อยู่ใน array → x ต้องอยู่ใน range ว่าง → ขัดกัน → x <b>ไม่อยู่ใน array</b> → return -1 ✓", why: "Contradiction → not found" },
        ]}
        answer="∴ Binary Search คืน index ถูก หรือ -1 ถ้าไม่พบ ▢"
      />

      <h3>Termination Proof — พิสูจน์ว่า Loop จบจริง</h3>
      <p>
        ใช้ <b>well-founded measure</b> (loop variant) — ตัวแปรที่<b>ลดเรื่อย ๆ</b> และมี <b>lower bound</b>
      </p>
      <table className="cmp">
        <thead><tr><th>Loop</th><th>Loop Variant</th><th>Bound</th></tr></thead>
        <tbody>
          <tr><td>for i = 1 to n</td><td>n - i</td><td>≥ 0 → จบเมื่อ i = n+1</td></tr>
          <tr><td>while lo ≤ hi (Binary Search)</td><td>hi - lo</td><td>ลดลงครึ่ง → ถึง &lt; 0 จบ</td></tr>
          <tr><td>Recursion T(n) = T(n-1) + 1</td><td>n</td><td>n &gt; 0 base case → จบ</td></tr>
        </tbody>
      </table>

      <h3>Correctness Triad</h3>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, margin: '12px 0' }}>
        <b style={{ color: 'var(--accent)' }}>Total correctness</b> = <b>Partial correctness</b> + <b>Termination</b>
        <ul style={{ marginTop: 8, color: 'var(--text-1)' }}>
          <li><b>Partial correctness:</b> ถ้า terminate → ผลลัพธ์ถูก (พิสูจน์ด้วย invariant)</li>
          <li><b>Termination:</b> loop จบจริง (พิสูจน์ด้วย variant)</li>
        </ul>
      </div>

      <PF14 items={[
        { trap: "ลืมพิสูจน์ Termination", fix: "อัลกอริทึมที่ถูก<b>เฉพาะ</b>เมื่อ terminate ยังไม่พิสูจน์ว่าจะ terminate ทุกครั้ง" },
        { trap: "Invariant อ่อนเกินไป", fix: "ต้องเลือก invariant ที่<b>ตอน termination จะให้ correctness</b>" },
        { trap: "เขียนใน inductive step โดยใช้ ‘by definition’", fix: "ต้องอ้างถึง code บรรทัด ๆ ใน loop body" },
      ]} />

      <Quiz14 q={{
        question: "ใน Insertion Sort, invariant ‘a[1..j-1] เรียงแล้ว’ ใช้ ‘Termination’ ยังไง?",
        options: [
          "พิสูจน์ว่า loop จะหยุด",
          "เมื่อ j = n+1 invariant ให้ a[1..n] เรียงแล้ว = output ที่ต้องการ",
          "พิสูจน์ว่า inner while หยุด",
          "ยืนยันว่า worst case = O(n²)"
        ],
        answer: 1,
        explain: "Termination ของ outer loop เกิดเมื่อ j = n+1 → ตาม invariant: a[1..n] = ทั้ง array เรียงแล้ว = สิ่งที่ต้องการ"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   67 — AMORTIZED ANALYSIS (3 methods)
============================================================ */
function DynamicArrayViz() {
  const [n, setN] = useS14(0);
  const [cap, setCap] = useS14(1);
  const [history, setHistory] = useS14([]);
  const push = () => {
    const newN = n + 1;
    let cost = 1; // basic insert
    let newCap = cap;
    if (newN > cap) {
      cost = newN; // copy all old + insert new
      newCap = cap * 2 || 1;
    }
    setHistory(h => [...h, { op: newN, cost, cap: newCap, totalCost: (h.reduce((s, x) => s + x.cost, 0) || 0) + cost }]);
    setN(newN);
    setCap(newCap);
  };
  const reset = () => { setN(0); setCap(1); setHistory([]); };

  const totalCost = history.reduce((s, x) => s + x.cost, 0);
  const avg = history.length ? (totalCost / history.length).toFixed(2) : '—';

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={push}>+ Push</button>
        <button onClick={reset}>Reset</button>
        <span>n = {n}, capacity = {cap}</span>
        <span style={{ color: 'var(--accent-2)' }}>Avg cost / push = {avg}</span>
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto', background: 'var(--bg-2)', borderRadius: 8, padding: 10 }}>
        <table style={{ width: '100%', fontSize: 12, fontFamily: 'monospace' }}>
          <thead style={{ color: 'var(--text-2)' }}>
            <tr><th align="left">Push #</th><th align="left">Cost</th><th align="left">Capacity</th><th align="left">Total Cost</th></tr>
          </thead>
          <tbody>
            {history.slice(-15).map((h, i) => (
              <tr key={i} style={{ color: h.cost > 1 ? '#fbbf24' : 'var(--text-1)' }}>
                <td>{h.op}</td><td>{h.cost} {h.cost > 1 && '⚡ (resize!)'}</td><td>{h.cap}</td><td>{h.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Lessons14["amortized"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        วิเคราะห์ความซับซ้อน<b>เฉลี่ยต่อ operation</b> ในลำดับการทำงาน — ไม่ใช่ worst case ของแต่ละครั้ง
      </div>

      <h3>ทำไมต้องใช้ Amortized?</h3>
      <p>
        บาง operation worst case แพง (เช่น dynamic array resize O(n)) แต่ <b>ไม่ได้เกิดทุกครั้ง</b>
        — ถ้าวิเคราะห์ตามเฉลี่ย จะเร็วกว่าที่คิด
      </p>

      <h3>Demo: Dynamic Array (Vector) Push</h3>
      <p>ทุกครั้งที่ array เต็ม → ขยายเป็น 2 เท่า + copy ทุก element (O(n)). คลิก Push หลาย ๆ ครั้งดู cost เฉลี่ย:</p>
      <DynamicArrayViz />

      <h3>วิธีที่ 1 — Aggregate Method (ง่ายสุด)</h3>
      <WE14
        title="Aggregate: Dynamic Array Push"
        problem="หา amortized cost / push สำหรับ n ครั้ง"
        steps={[
          { title: "Identify expensive ops", body: "Resize เกิดเมื่อ n = 1, 2, 4, 8, ..., 2^k\n→ resize ที่ขนาด 2^i ใช้ cost 2^i (copy ทั้งหมด)", why: "Resize ตามเลขยกกำลังของ 2" },
          { title: "Total cost of resizes", body: "1 + 2 + 4 + ... + 2^k = 2^(k+1) - 1 &lt; 2·n", why: "Geometric series รวมไม่เกิน 2n" },
          { title: "Total cost ของ n pushes", body: "Basic push cost = n\nResize cost = &lt; 2n\nTotal &lt; 3n", why: "บวก basic + resize" },
          { title: "Amortized cost / push", body: "Total / n = 3n / n = <b>O(1)</b>", why: "เฉลี่ยต่อ operation" },
        ]}
        answer="Amortized cost = O(1) ต่อ push แม้ worst case จะเป็น O(n) ▢"
        takeaway="Aggregate: รวม total cost ทั้งลำดับ → หาร n"
      />

      <h3>วิธีที่ 2 — Accounting Method (Banker's)</h3>
      <p>เก็บ "เงิน" (credit) ใส่ operation ถูก ๆ → ใช้จ่ายตอน operation แพง</p>
      <WE14
        title="Accounting: Dynamic Array Push"
        problem="คิดค่า amortized โดยใช้ credit"
        steps={[
          { title: "Charge amortized cost = 3 / push", body: "Real cost = 1 (basic insert)\nExtra 2 → เก็บเป็น credit บน element นี้", why: "เลือกค่าใช้จ่ายเสมือนให้สูงพอ" },
          { title: "เก็บ credit ยังไง", body: "Element ใหม่ที่ insert จ่ายเอง 1 + credit ของตัวเอง 1 + credit ให้ element เก่าที่จะถูก copy 1", why: "เตรียม credit สำหรับ resize ครั้งหน้า" },
          { title: "Verify resize", body: "เมื่อ resize: ขนาด n → 2n\n→ ใช้ credit ของ n elements (1 ต่อตัว) จ่าย cost copy = n\nCredit ไม่ติดลบ ✓", why: "ที่เก็บไว้ใช้จ่ายพอ" },
          { title: "Amortized cost", body: "<b>3 = O(1)</b> ต่อ push", why: "Charge ที่กำหนด" },
        ]}
        answer="Amortized cost = O(1) ต่อ push (Accounting method) ▢"
      />

      <h3>วิธีที่ 3 — Potential Method (Physicist's)</h3>
      <p>กำหนด <b>potential function Φ</b> ของ data structure → amortized cost = real cost + ΔΦ</p>
      <WE14
        title="Potential: Dynamic Array Push"
        problem="ใช้ potential function เพื่อหา amortized cost"
        steps={[
          { title: "Define Φ", body: "Φ = 2 × (n - cap/2)\n— วัด ‘ความใกล้เต็ม’ ของ array", why: "เลือก Φ ที่จะใหญ่ก่อน resize, รีเซ็ตหลัง resize" },
          { title: "Φ properties", body: "Φ(empty) = 0\nΦ ≥ 0 เสมอ (เมื่อ n ≥ cap/2)\nหลัง resize: cap ใหม่ = 2n → Φ = 2(n - n) = 0 ← reset", why: "ตามที่ต้องการของ potential function" },
          { title: "Amortized cost case 1: no resize", body: "Real cost = 1\nΔΦ = 2((n+1) - cap/2) - 2(n - cap/2) = 2\nAmortized = 1 + 2 = <b>3</b>", why: "Push ปกติ" },
          { title: "Amortized cost case 2: resize (n = cap → 2n)", body: "Real cost = n + 1 (copy n + insert 1)\nก่อน: Φ = 2(n - n/2) = n\nหลัง: Φ = 2((n+1) - n) = 2\nΔΦ = 2 - n = -(n-2)\nAmortized = (n+1) + (2-n) = <b>3</b>", why: "Resize ใหญ่แต่ Φ ลดมาก → ชดเชย" },
        ]}
        answer="Amortized cost = 3 = O(1) ต่อ push (Potential method) ▢"
        takeaway="ทั้ง 3 วิธีให้คำตอบเดียวกัน — เลือกตามถนัด"
      />

      <h3>ตัวอย่างคลาสสิก: Stack with MultiPop</h3>
      <WE14
        title="MultiPop Stack — ลำดับ n operations"
        problem={`Operations: Push(x), Pop(), MultiPop(k) = pop k elements
MultiPop worst case = O(n) แต่ไม่ได้เกิดบ่อย — หา amortized`}
        steps={[
          { title: "Aggregate analysis", body: "Total cost = จำนวน Push + จำนวน Pop\n— Element ทุกตัวถูก Pop อย่างน้อย 1 ครั้ง (ถ้าโดน Pop) → Total Pops ≤ Total Pushes ≤ n", why: "นับการ Push และ Pop รวมกัน" },
          { title: "Total cost ≤ 2n", body: "Each Push = 1, Each Pop = 1\nTotal cost ≤ n + n = 2n", why: "Pop ไม่เกิน Push" },
          { title: "Amortized", body: "2n / n = <b>O(1)</b> ต่อ operation", why: "" },
        ]}
        answer="Amortized cost = O(1) แม้ MultiPop worst = O(n) ▢"
      />

      <CS14 title="Amortized Methods" sections={[
        { label: "Aggregate", value: "รวม total cost ทุก op → หาร n<br/>ง่ายสุด ใช้ได้เมื่อ analysis ตรงไปตรงมา" },
        { label: "Accounting", value: "Charge credit ต่อ op → ใช้จ่ายตอน expensive op<br/>เลือก charge ให้พอจ่ายเสมอ" },
        { label: "Potential", value: "Φ(D) = potential function<br/>amortized = real + Φ(new) − Φ(old)" },
        { label: "ตัวอย่างคลาสสิก", value: "Dynamic Array push: O(1)<br/>MultiPop stack: O(1)<br/>Splay tree access: O(log n)<br/>Union-Find: O(α(n))" },
      ]} />

      <PF14 items={[
        { trap: "สับสน amortized กับ average case", fix: "<b>Amortized:</b> เฉลี่ยตามลำดับ op (worst-case input ใช้ได้)<br/><b>Average:</b> เฉลี่ยตาม distribution ของ input" },
        { trap: "ใช้ amortized กับ op เดียว — ผิด", fix: "Amortized ใช้กับ<b>ลำดับ</b> op หลายครั้ง — operation เดียวอาจ O(n) ก็ได้" },
        { trap: "เลือก Φ ที่อาจติดลบ", fix: "ต้องการ Φ(D₀) = 0 และ Φ(Dᵢ) ≥ 0 ตลอด — มิฉะนั้นจะ ‘ยืม’ จากอนาคต" },
      ]} />

      <Quiz14 q={{
        question: "ถ้า Dynamic Array ขยายเป็น <b>3 เท่า</b> ทุกครั้งที่เต็ม amortized cost / push?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explain: "ยังคงเป็น O(1) — geometric series 1 + 3 + 9 + ... = O(n) → amortized O(1). กฎ: ขยายด้วย factor &gt; 1 (any constant) → amortized O(1)"
      }} />

      <Quiz14 q={{
        question: "ถ้าขยายแบบ <b>+1 ต่อครั้ง</b> (incremental) amortized cost / push?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        explain: "Total cost = 1+2+3+...+n = O(n²) → amortized O(n) — ไม่ดี! ต้องขยายแบบ multiplicative factor"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart14 = Lessons14;
