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
   63a — L'HÔPITAL / Limit Method (เครื่องมือเปรียบเทียบ order of growth)
============================================================ */
function LHopitalDemo() {
  // pre-set examples from KMUTNB s_1.pdf p.30-33
  const EXAMPLES = [
    {
      key: 'ex1',
      label: 'T₁ = 100n  vs  T₂ = 0.01n²',
      f: (n) => 100 * n,
      g: (n) => 0.01 * n * n,
      ratio: (n) => (100 * n) / (0.01 * n * n),
      symbolic: 'lim (100n) / (0.01n²) = lim 10000/n = 0',
      verdict: 'T₁ &lt; T₂ → 100n ∈ O(0.01n²) (และ o-little ด้วย)',
      verdictColor: 'var(--accent)'
    },
    {
      key: 'ex2',
      label: 'T₁ = 1000 log n  vs  T₂ = n',
      f: (n) => 1000 * Math.log2(n),
      g: (n) => n,
      ratio: (n) => (1000 * Math.log2(n)) / n,
      symbolic: 'lim (1000 log n)/n = ∞/∞  → L\'Hôpital → lim (1000·1/(n ln 2))/1 = 0',
      verdict: 'T₁ &lt; T₂ → log n เติบโตช้ากว่า n เสมอ (ไม่ว่า constant ใหญ่แค่ไหน)',
      verdictColor: 'var(--accent)'
    },
    {
      key: 'ex3',
      label: 'T₁ = ½·n(n−1)  vs  T₂ = n²',
      f: (n) => 0.5 * n * (n - 1),
      g: (n) => n * n,
      ratio: (n) => (0.5 * n * (n - 1)) / (n * n),
      symbolic: 'lim ½n(n−1)/n² = lim ½(1 − 1/n) = ½',
      verdict: 'T₁ ≡ T₂ → Θ(n²) (limit = ค่าจำกัด > 0)',
      verdictColor: 'var(--accent-3)'
    },
    {
      key: 'ex4',
      label: 'T₁ = 2ⁿ  vs  T₂ = n¹⁰⁰',
      // ใช้ logarithm comparison เพื่อหลีกเลี่ยง float overflow (2^1000 = Infinity ใน JS)
      // log₂(ratio) = n - 100·log₂(n)
      f: (n) => Math.pow(2, Math.min(n, 50)),
      g: (n) => Math.pow(n, 100),
      ratio: (n) => {
        const log2Ratio = n - 100 * Math.log2(n);
        // คืน "log ratio" แทน ratio ตรงๆ — ค่าบวก = T₁ใหญ่กว่า; ลบ = T₂ใหญ่กว่า
        return Math.pow(2, Math.max(-1000, Math.min(1000, log2Ratio)));
      },
      symbolic: 'lim 2ⁿ/n¹⁰⁰ = ∞  (exponential ชนะ polynomial เสมอ ใช้ L\'Hôpital 100 ครั้งก็ได้)\n(แสดงผ่าน log₂ ratio = n − 100·log₂ n — หลีกเลี่ยง overflow ของ JS double)',
      verdict: 'T₁ &gt; T₂ → exponential เติบโตเร็วกว่า polynomial เสมอ (crossover ราว n ≈ 1000)',
      verdictColor: 'var(--pink)'
    },
  ];
  const [key, setKey] = useS14('ex1');
  const ex = EXAMPLES.find(e => e.key === key);
  const ns = [1, 10, 100, 1000, 10000, 100000];

  return (
    <div className="dsv">
      <div className="ctrls" style={{ flexWrap: 'wrap' }}>
        {EXAMPLES.map(e => (
          <button key={e.key} onClick={() => setKey(e.key)}
            style={{ background: key === e.key ? 'var(--accent)' : undefined, color: key === e.key ? '#000' : undefined }}>
            {e.label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-1)', padding: 10, borderRadius: 6, color: 'var(--text-1)' }}>
        {ex.symbolic}
      </div>
      <table className="cmp" style={{ marginTop: 12 }}>
        <thead><tr><th>n</th><th>f(n)</th><th>g(n)</th><th>ratio f/g</th><th>แนวโน้ม</th></tr></thead>
        <tbody>
          {ns.map(n => {
            const r = ex.ratio(n);
            const trend = !isFinite(r) ? '→ ∞' : r < 0.01 ? '→ 0' : r > 100 ? '→ ∞' : `→ ${r.toFixed(4)}`;
            return (
              <tr key={n}>
                <td className="mono">{n.toLocaleString()}</td>
                <td className="mono">{Number.isFinite(ex.f(n)) ? ex.f(n).toExponential(2) : '∞'}</td>
                <td className="mono">{Number.isFinite(ex.g(n)) ? ex.g(n).toExponential(2) : '∞'}</td>
                <td className="mono">{Number.isFinite(r) ? r.toExponential(2) : '∞'}</td>
                <td className="mono" style={{ color: 'var(--text-2)' }}>{trend}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="callout" style={{ borderColor: ex.verdictColor, marginTop: 10 }}>
        <div className="ttl" style={{ color: ex.verdictColor }}>สรุป</div>
        <span dangerouslySetInnerHTML={{ __html: ex.verdict }} />
      </div>
    </div>
  );
}

Lessons14["limit-lhopital"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        ใช้ <b>limit ratio</b> และ <b>กฎโลปิตา (L'Hôpital's rule)</b> เพื่อเปรียบเทียบลำดับการเติบโต (order of growth) ของฟังก์ชันเวลา 2 อันโดย<u>ไม่ต้อง</u>หา (c, n₀) มาพิสูจน์ตามนิยาม
      </div>

      <h3>1) Limit Ratio Method — ตัดสินจากค่า lim</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 15, lineHeight: 1.8 }}>
          ให้ f(n), g(n) เป็นฟังก์ชันเวลา 2 อัลกอริทึม:<br/>
          <span style={{ color: 'var(--text-2)' }}>┌</span> <b>lim<sub>n→∞</sub> f(n)/g(n) = 0</b> &nbsp;&nbsp; → &nbsp;&nbsp; f &lt; g &nbsp; <span style={{ color: 'var(--text-2)' }}>(f ∈ o(g))</span><br/>
          <span style={{ color: 'var(--text-2)' }}>┤</span> <b>lim<sub>n→∞</sub> f(n)/g(n) = c (0 &lt; c &lt; ∞)</b> &nbsp; → &nbsp; f ≡ g &nbsp; <span style={{ color: 'var(--text-2)' }}>(f ∈ Θ(g))</span><br/>
          <span style={{ color: 'var(--text-2)' }}>└</span> <b>lim<sub>n→∞</sub> f(n)/g(n) = ∞</b> &nbsp;&nbsp; → &nbsp;&nbsp; f &gt; g &nbsp; <span style={{ color: 'var(--text-2)' }}>(f ∈ ω(g))</span>
        </div>
      </div>

      <h3>2) L'Hôpital's Rule — เมื่อ ∞/∞ หรือ 0/0</h3>
      <p style={{ color: 'var(--text-1)' }}>
        ถ้า <code>lim f(n) = ∞</code> และ <code>lim g(n) = ∞</code> (หรือทั้งคู่ = 0) — limit ratio ติดในรูป <code>∞/∞</code> ใช้ <b>L'Hôpital</b>:
      </p>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', fontSize: 15 }}>
        lim<sub>n→∞</sub> f(n)/g(n)  =  lim<sub>n→∞</sub> f'(n)/g'(n)
      </div>
      <p style={{ color: 'var(--text-1)', fontSize: 13 }}>โดย f'(n), g'(n) คือ derivative ของ f และ g เทียบกับ n — ทำซ้ำได้จนกว่าจะหายติด</p>

      <h3>3) ตาราง derivative ที่ใช้บ่อย</h3>
      <table className="tbl">
        <thead><tr><th>f(n)</th><th>f'(n)</th><th>หมายเหตุ</th></tr></thead>
        <tbody>
          <tr><td className="mono">c (constant)</td><td className="mono">0</td><td>—</td></tr>
          <tr><td className="mono">n<sup>k</sup></td><td className="mono">k·n<sup>k−1</sup></td><td>k คงที่</td></tr>
          <tr><td className="mono">ln n</td><td className="mono">1/n</td><td>logarithm ฐานธรรมชาติ</td></tr>
          <tr><td className="mono">log<sub>b</sub> n</td><td className="mono">1/(n · ln b)</td><td>change of base</td></tr>
          <tr><td className="mono">e<sup>n</sup></td><td className="mono">e<sup>n</sup></td><td>derivative = ตัวเอง</td></tr>
          <tr><td className="mono">a<sup>n</sup></td><td className="mono">a<sup>n</sup> · ln a</td><td>ฐานอื่น</td></tr>
          <tr><td className="mono">f·g</td><td className="mono">f'·g + f·g'</td><td>product rule</td></tr>
        </tbody>
      </table>

      <h3>4) Demo — ลองเล่นกับ 4 ตัวอย่างจากชีท</h3>
      <LHopitalDemo />

      <WE14
        title="Worked Example: T₁ = 1000 log n  vs  T₂ = n"
        problem="ใช้ L'Hôpital พิสูจน์ว่า 1000 log n เติบโตช้ากว่า n"
        steps={[
          { title: "ตั้ง ratio", body: "lim<sub>n→∞</sub> (1000 log₂ n) / n", why: "เปรียบเทียบลำดับการเติบโต" },
          { title: "ตรวจสอบรูป", body: "n→∞ → log n → ∞, n → ∞ ⇒ <b>∞/∞</b>", why: "เข้าเงื่อนไข L'Hôpital" },
          { title: "หา derivative", body: "f'(n) = 1000 · (1/(n · ln 2))<br/>g'(n) = 1", why: "ใช้สูตร log แล้ว change of base" },
          { title: "แทนค่ากลับ", body: "lim<sub>n→∞</sub> [1000/(n · ln 2)] / 1<br/>= 1000/ln 2 · lim<sub>n→∞</sub> 1/n<br/>= 0", why: "1/n → 0 เมื่อ n → ∞" },
          { title: "สรุป", body: "lim = 0 → T₁ ∈ o(T₂)<br/>∴ 1000 log n &lt; n เมื่อ n ใหญ่พอ", why: "ไม่ว่า constant 1000 จะใหญ่แค่ไหน log โตช้ากว่า linear เสมอ" },
        ]}
        answer="∴ 1000 log n ∈ O(n) แต่ไม่ใช่ Ω(n) ▢"
        takeaway="constant ใหญ่ขนาดไหนก็ไม่ทำให้ log โตเท่า linear ได้"
      />

      <WE14
        title="Worked Example: T₁ = ½ n(n−1)  vs  T₂ = n²"
        problem="แสดงว่า ½n(n−1) = Θ(n²)"
        steps={[
          { title: "ตั้ง ratio", body: "lim<sub>n→∞</sub> [½ n (n−1)] / n²", why: "" },
          { title: "ลดรูป (ไม่ต้องใช้ L'Hôpital)", body: "= lim<sub>n→∞</sub> [½ (n² − n)] / n²<br/>= lim<sub>n→∞</sub> ½ (1 − 1/n)<br/>= ½ · 1  =  <b>½</b>", why: "หาร n² ทุกพจน์" },
          { title: "สรุป", body: "lim = ½ (ค่าจำกัด > 0) → T₁ ≡ T₂", why: "Θ" },
        ]}
        answer="∴ ½ n(n−1) = Θ(n²) ▢"
      />

      <CS14 title="L'Hôpital / Limit Method Cheat Sheet" sections={[
        { label: "เมื่อใดใช้ L'Hôpital", value: "เมื่อ lim ratio ติดในรูป ∞/∞ หรือ 0/0 — รูปแบบอื่นแยกเอง" },
        { label: "ทำซ้ำได้", value: "ถ้าหลัง derivative แล้วยังเป็น ∞/∞ → ใช้ L'Hôpital อีกครั้ง (และอีก จนกว่าจะคลี่)" },
        { label: "Trick พื้นฐาน", value: "polynomial / log → 0 เร็ว, polynomial / exponential → 0, exponential / polynomial → ∞" },
        { label: "Hierarchy", value: "1 ≪ log log n ≪ log n ≪ n^ε ≪ n ≪ n log n ≪ n² ≪ n^c ≪ 2ⁿ ≪ n! ≪ nⁿ" },
        { label: "เกี่ยวกับ Big-O", value: "lim = 0 → o(g) ⊂ O(g); lim = c → Θ; lim = ∞ → ω(g) ⊂ Ω(g)" },
      ]} />

      <PF14 items={[
        { trap: "ใช้ L'Hôpital กับรูปไม่ใช่ ∞/∞ หรือ 0/0", fix: "ต้องเช็คเงื่อนไขก่อน — เช่น 5/n ไม่ใช่ ∞/∞ → คำนวณตรงๆ ได้เลย" },
        { trap: "หา derivative ผิดของ log<sub>b</sub> n", fix: "(log<sub>b</sub> n)' = 1/(n · ln b) — มี ln b ไม่ใช่ ln n" },
        { trap: "คิดว่า constant ใหญ่ชนะ order ที่โตเร็วกว่า", fix: "1000000·n ยังคงเป็น O(n) — constant ไม่มีผลต่อ order" },
        { trap: "ใช้ L'Hôpital เมื่อทำได้ง่ายด้วยการลดรูป", fix: "ลองหาร n^k ทุกพจน์ก่อน — มักง่ายกว่า derivative" },
      ]} />

      <Quiz14 q={{
        question: "ถ้า lim<sub>n→∞</sub> f(n)/g(n) = 5 (ค่าจำกัด > 0) สรุปได้ว่า?",
        options: [
          "f(n) = O(g(n)) เท่านั้น",
          "f(n) = Ω(g(n)) เท่านั้น",
          "f(n) = Θ(g(n)) — ทั้ง O และ Ω",
          "f(n) &gt; g(n) เสมอ"
        ],
        answer: 2,
        explain: "limit เป็นค่าจำกัด > 0 หมายความว่าทั้งคู่ bound กันสองทาง → Θ"
      }} />

      <Quiz14 q={{
        question: "ตามชีท s_1.pdf p.32 — เปรียบเทียบ T₁ = 1000·log n กับ T₂ = n หลังใช้ L'Hôpital ได้ผลลัพธ์อะไร?",
        options: [
          "lim → 1 (เท่ากัน)",
          "lim → 0 (T₁ ช้ากว่า)",
          "lim → ∞ (T₁ เร็วกว่า)",
          "ไม่นิยาม"
        ],
        answer: 1,
        explain: "f' = 1000/(n ln 2), g' = 1 → lim 1000/(n ln 2) = 0 → T₁ ∈ o(T₂)"
      }} />

      <Quiz14 q={{
        question: "f(n) = 2ⁿ vs g(n) = n¹⁰⁰ — ผลของ limit ratio?",
        options: [
          "lim = 0",
          "lim = 1",
          "lim = ∞ (2ⁿ ชนะ)",
          "ขึ้นกับ constant"
        ],
        answer: 2,
        explain: "exponential ชนะ polynomial เสมอ — ใช้ L'Hôpital 100 ครั้งจะได้ 2ⁿ·(ln 2)¹⁰⁰ / 100! → ∞"
      }} />
    </React.Fragment>
  );
};

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

/* ============================================================
   64a — BIG-O EXERCISE BANK (30+ ข้อจาก KMUTNB ชีท)
   ที่มา: BIGO.pdf, exercise_1.pdf, hw_1_Timecomplexity1.pdf,
   hw_1_tnrecursive.pdf, แบบฝึกหัดที่ 2 tn.pdf, แบบฝึกหัดที่ 3 tn recursive.pdf
============================================================ */
const BIGO_EXERCISES = [
  // ============ Linear / Single Loop ============
  { id: 1, cat: 'loop', src: 'BIGO Q2 / exercise_1 1.1',
    q: `sum = 0;
for (i = 1; i < n; i = i+2)
  sum++;`,
    a: 'O(n)',
    explain: 'i เพิ่มทีละ 2 → จำนวนรอบ = n/2 → O(n)' },
  { id: 2, cat: 'loop', src: 'BIGO Q3 / exercise_1 1.3',
    q: `for (i = 1; i < n; i++)
  for (j = 1; j < n/2; j++)
    sum++;`,
    a: 'O(n²)',
    explain: 'outer n, inner n/2 → n × n/2 = n²/2 → O(n²)' },
  { id: 3, cat: 'loop', src: 'BIGO Q4 / exercise_1 1.4',
    q: `for (i = 1; i < n; i = i*2)
  sum++;`,
    a: 'O(log n)',
    explain: 'i ทวีคูณ → log₂ n รอบ' },
  { id: 4, cat: 'loop', src: 'BIGO Q5',
    q: `for (i = 1; i < n; i = i*2)
  sum++;`,
    a: 'O(log n)',
    explain: 'ตัวเดียวกับ Q3 — ยืนยัน i ทวีคูณ' },
  { id: 5, cat: 'loop', src: 'BIGO Q6 / exercise_1 1.6',
    q: `for (i = 0; i < n; i++)
  for (j = 0; j < i; j++)
    sum++;`,
    a: 'O(n²)',
    explain: 'inner วน 0..i-1 → Σ i = n(n-1)/2 → O(n²) (triangular)' },
  { id: 6, cat: 'loop', src: 'BIGO Q7 / hw_1 Q1.7',
    q: `sum = 0;
for (i = 0; i < n; i++) sum++;
val = 1;
for (j = 0; j < n*n; j++)
  val = val + n;`,
    a: 'O(n²)',
    explain: '2 loop ติดกัน (ไม่ซ้อน) → n + n² = O(n²) — เอาตัวโตเร็วกว่า' },
  { id: 7, cat: 'loop', src: 'BIGO Q8 / hw_1 Q1.8',
    q: `sum = 0;
for (i = 0; i < n; i = i+2) sum++;
for (j = 0; j < n/2; j = j+5)
  sum++;`,
    a: 'O(n)',
    explain: 'loop ทั้งสอง O(n) — เพิ่มแบบ constant step ไม่เปลี่ยน order' },
  { id: 8, cat: 'loop', src: 'BIGO Q9',
    q: `for (i = 0; i < n; i++)
  for (j = 1; j < n; j = j*2)
    for (k = 1; k < n; k = k+2)
      sum++;`,
    a: 'O(n² log n)',
    explain: 'outer n × middle log n × inner n/2 = (n²·log n)/2' },
  { id: 9, cat: 'loop', src: 'BIGO Q10',
    q: `sum = 0;
for (i = 1; i < n; i = i*2)
  for (j = 0; j < n; j++)
    sum++;`,
    a: 'O(n log n)',
    explain: 'outer log n × inner n → n log n' },
  { id: 10, cat: 'loop', src: 'BIGO Q11',
    q: `sum = 0;
for (i = 1; i < n; i = i*2)
  for (j = 0; j < i; j++)
    sum++;`,
    a: 'O(n)',
    explain: 'inner วน i (i = 1, 2, 4, 8, ..., n/2) → Σ 2^k = 2^(log n) − 1 ≈ n — geometric series' },
  // ============ Triple Loop / Polynomial ============
  { id: 11, cat: 'loop', src: 'BIGO Q12',
    q: `for (i = 1; i <= n*n; i++)
  for (j = 0; j < i; j++)
    sum++;`,
    a: 'O(n⁴)',
    explain: 'outer = n², inner = i → Σ_{i=1}^{n²} i = n²(n²+1)/2 ≈ n⁴/2' },
  { id: 12, cat: 'loop', src: 'exercise_1 1.7 / hw_1 Q1.6',
    q: `for (i = 0; i < n; i++)
  for (j = 0; j < i*i; j++)
    for (k = 0; k < j; k++)
      sum++;`,
    a: 'O(n⁵)',
    explain: 'inner สุด = Σ j = i²(i²-1)/2 ≈ i⁴/2; outer = Σ i⁴ ≈ n⁵/5 → O(n⁵)' },
  // ============ While loops + dependent vars ============
  { id: 13, cat: 'loop', src: 'hw_1 Q1.8',
    q: `count = 1;
while (n > 1) {
  count += 1;
  n = n / 2;
}`,
    a: 'O(log n)',
    explain: 'n หารด้วย 2 ทุกรอบ → log₂ n รอบ' },
  { id: 14, cat: 'loop', src: 'exercise_1 1.9',
    q: `count = 1;
while (n > 1) {
  count += 1;
  n = n / 3;
}`,
    a: 'O(log n)',
    explain: 'n หาร 3 → log₃ n รอบ — ฐาน log ไม่สำคัญใน Big-O' },
  { id: 15, cat: 'loop', src: 'hw_1 Q1.9 / exercise_1 1.10',
    q: `i = 0;
j = n;
while (i < j) {
  i = i + 3;
  j = j - 5;
}`,
    a: 'O(n)',
    explain: 'แต่ละรอบ i เพิ่ม 3, j ลด 5 → ระยะ j-i ลดทีละ 8 ต่อรอบ → n/8 รอบ → O(n)' },
  // ============ Worst / Best / Average ============
  { id: 16, cat: 'cases', src: 'BIGO Q1 (true/false)',
    q: `ถ้า T(n) = 100n + 5
ข้อใดถูก?
(ก) T(n) ∈ O(n)
(ข) T(n) ∈ O(n²)
(ค) T(n) ∈ Θ(n)
(ง) ถูกทุกข้อ`,
    a: '(ง) ถูกทุกข้อ',
    explain: 'O(n) ✓ (ตัวบนสุด), O(n²) ✓ (upper bound กว้างกว่า ก็ใช้ได้), Θ(n) ✓ (ตรงที่สุด) — Big-O เป็น upper bound ไม่ใช่ tight' },
  { id: 17, cat: 'cases', src: 'hw_1 Q2.1 / exercise_1 3.1',
    q: `function reverseArray(arr, start, end):
  while start < end:
    swap arr[start], arr[end]
    start = start + 1
    end = end - 1
หา W(n), B(n), A(n)`,
    a: 'ทั้งหมด Θ(n)',
    explain: 'loop เดิน start และ end เข้าหากัน — รอบ = (end-start)/2 ≈ n/2 ทุกกรณี (ไม่มี early exit) → Worst = Best = Average = Θ(n)' },
  { id: 18, cat: 'cases', src: 'hw_1 Q2.2 / exercise_1 3.2',
    q: `function bubbleSort(A):
  for i = 1 to n-1:
    for j = 0 to n-i-1:
      if A[j] > A[j+1]: swap
หา W(n), B(n), A(n)`,
    a: 'W = Θ(n²), B = Θ(n²), A = Θ(n²) (เปรียบเทียบ)',
    explain: 'Loop วน n(n-1)/2 ครั้งเสมอ ไม่ว่า input ใด — เพราะไม่มี early termination flag — Bubble Sort ทุกกรณี = Θ(n²) เพื่อนับการเปรียบเทียบ (swap อาจเปลี่ยนแต่ comparison ไม่)' },
  { id: 19, cat: 'cases', src: 'hw_1 Q2.3 / exercise_1 3.3',
    q: `Binary Search (iterative):
while (l ≤ r) {
  m = (l + r) / 2
  if A[m] == k: return m
  if A[m] < k: l = m+1 else: r = m-1
}
หา W(n), B(n), A(n)`,
    a: 'W = Θ(log n), B = Θ(1), A = Θ(log n)',
    explain: 'Best: เจอที่ middle ทันที → 1 ครั้ง. Worst: ไม่เจอ → log₂ n รอบ. Average: ≈ log n − 1' },
  // ============ Simplify Big-O ============
  { id: 20, cat: 'simplify', src: 'exercise_1 4.2',
    q: 'O(2n³ + 4n) = ?',
    a: 'O(n³)',
    explain: 'ตัด constant + เก็บพจน์ที่โตเร็วสุด' },
  { id: 21, cat: 'simplify', src: 'exercise_1 4.3',
    q: 'O(1/n + 1) = ?',
    a: 'O(1)',
    explain: '1/n → 0 เมื่อ n → ∞ — เหลือ constant 1' },
  { id: 22, cat: 'simplify', src: 'exercise_1 4.4',
    q: 'O(7n⁸ + 3n² − 4) = ?',
    a: 'O(n⁸)',
    explain: 'n⁸ ครอบงำ' },
  { id: 23, cat: 'simplify', src: 'exercise_1 4.5 (จากชีท 3.4)',
    q: 'O(5n + 4n log n) = ?',
    a: 'O(n log n)',
    explain: 'n log n > n เสมอเมื่อ n ≥ 2 — เก็บ n log n' },
  { id: 24, cat: 'simplify', src: 'exercise_1 4.5 (จากชีท 3.5)',
    q: 'O(n + log n + 8000) = ?',
    a: 'O(n)',
    explain: 'n > log n > constant — เก็บ n' },
  // ============ Order Ranking ============
  { id: 25, cat: 'rank', src: 'BIGO + exercise_1 Q6',
    q: `เรียงจากเติบโต<b>ช้าสุด</b>ไปเร็วสุด:
5n³+2n²+30,  7log n,  10n,  n¹⁰⁰,  5000000,  0.5n³,  n^(1/3),  100·2ⁿ`,
    a: '5000000 → 7log n → n^(1/3) → 10n → 5n³+2n²+30 ≡ 0.5n³ → n¹⁰⁰ → 100·2ⁿ',
    explain: 'O(1) ≪ O(log n) ≪ O(√n) ≪ O(n) ≪ O(n³) (5n³ ≡ 0.5n³ ใน Θ) ≪ O(n¹⁰⁰) ≪ O(2ⁿ)' },
  // ============ Recurrence Equations ============
  { id: 26, cat: 'recurrence', src: 'hw_1_tn Q1 / แบบฝึก 3 Q1',
    q: 'T(n) = T(n−1) + n,  T(0) = 1',
    a: 'T(n) = O(n²)',
    explain: 'T(n) = T(n-1) + n = T(n-2) + (n-1) + n = ... = T(0) + n + (n-1) + ... + 1 = 1 + n(n+1)/2 → O(n²)' },
  { id: 27, cat: 'recurrence', src: 'hw_1_tn Q2',
    q: 'T(n) = 2T(n−1) + n,  T(0) = 1',
    a: 'T(n) = O(2ⁿ)',
    explain: 'T(n) = 2T(n-1) + n; แทน T(n-1) → 4T(n-2) + 2(n-1) + n; ... = 2ⁿ T(0) + Σ 2^k·(n-k) → exponential 2ⁿ ครอบงำ polynomial → O(2ⁿ)' },
  { id: 28, cat: 'recurrence', src: 'hw_1_tn Q3 / Master Th',
    q: 'T(n) = 2T(n/2) + c,  T(1) = 1',
    a: 'T(n) = O(n)',
    explain: 'Master: a=2, b=2, d=0 → log_b a = 1 > d → Case 3 → O(n^1) = O(n). ตรง: Binary tree recursion สูง log n รอบ × c → cn' },
  { id: 29, cat: 'recurrence', src: 'hw_1_tn Q4 / Master Th',
    q: 'T(n) = 2T(n/2) + n,  T(1) = 1',
    a: 'T(n) = O(n log n)',
    explain: 'Master: a=2, b=2, d=1 → log_b a = 1 = d → Case 2 → O(n log n). นี่คือ Merge Sort' },
  { id: 30, cat: 'recurrence', src: 'hw_1_tn Q5',
    q: 'T(n) = 2T(n/2) + n²,  T(1) = 1',
    a: 'T(n) = O(n²)',
    explain: 'Master: a=2, b=2, d=2 → log_b a = 1 < 2 = d → Case 3 → O(n²)' },
  { id: 31, cat: 'recurrence', src: 'hw_1_tn Q6',
    q: 'T(n) = 27T(n/3) + n,  T(1) = 1',
    a: 'T(n) = O(n³)',
    explain: 'Master: a=27, b=3, d=1 → log_b a = log₃ 27 = 3 > d → Case 1 → O(n³)' },
  { id: 32, cat: 'recurrence', src: 'hw_1_tn Q7 / Binary Search',
    q: `int F(int arr[], int low, int high, int x) {
  if (low > high) return -1;
  int mid = (low+high)/2;
  if (x == arr[mid]) return mid;
  if (x < arr[mid])
    return F(arr, low, mid-1, x);
  else
    return F(arr, mid+1, high, x);
}`,
    a: 'T(n) = O(log n)',
    explain: 'recurrence: T(n) = T(n/2) + c → log n รอบ → Binary search' },
  // ============ Recursive Code ============
  { id: 33, cat: 'rec-code', src: 'BIGO Q13',
    q: `long power(long x, long n) {
  if (n == 0) return 1;
  else return x * power(x, n-1);
}`,
    a: 'T(n) = O(n)',
    explain: 'recurrence: T(n) = T(n-1) + c → linear (สิ้นเปลือง — ทำได้ดีกว่า)' },
  { id: 34, cat: 'rec-code', src: 'BIGO Q14',
    q: `long power(long x, long n) {
  if (n == 0) return 1;
  if (n == 1) return x;
  if ((n % 2) == 0) return power(x*x, n/2);
  else return power(x*x, n/2) * x;
}`,
    a: 'T(n) = O(log n)',
    explain: 'แบ่ง n เป็นครึ่ง + base case → T(n) = T(n/2) + c — Fast Power (Exponentiation by Squaring)' },
  { id: 35, cat: 'rec-code', src: 'BIGO Q15',
    q: `long power(long x, long n) {
  if (n == 0) return 1;
  if (n == 1) return x;
  if ((n % 2) == 0) return power(x, n/2) * power(x, n/2);
  else return power(x, n/2) * power(x, n/2) * x;
}`,
    a: 'T(n) = O(n)',
    explain: 'T(n) = 2T(n/2) + c — 2 recursive calls แทนที่จะ memo → O(n) (Master Case 1: a=2, b=2, d=0 → n^1) — ผิดพลาดที่เห็นบ่อย!' },
  { id: 36, cat: 'rec-code', src: 'แบบฝึก 2 Q1',
    q: `MaxElement(A[0..n-1]) {
  maxVal = A[0];
  for (i = 1; i <= n; i++)
    if (A[i] > maxVal) maxVal = A[i];
  return maxVal;
}`,
    a: 'T(n) = O(n)',
    explain: 'loop เดียว วน n ครั้ง — basic op = comparison' },
  { id: 37, cat: 'rec-code', src: 'แบบฝึก 2 Q5 — Euclidean GCD',
    q: `int gcd(int m, int n) {
  while (m != n) {
    if (m > n) m = m - n;
    else n = n - m;
  }
  return m;
}`,
    a: 'T(m,n) = O(max(m,n)) worst — ลบทีละ 1',
    explain: 'subtractive GCD — ถ้า m=100, n=1 → 99 iterations. Worst case linear in max(m,n) เมื่อ ratio mismatch. (ใช้ Euclidean modulo จะดีขึ้นเป็น O(log min(m,n)))' },
];

const BIGO_CATS = {
  loop: { label: '🔁 Loops', color: 'var(--accent)' },
  cases: { label: '⚖️ W/B/Avg cases', color: 'var(--accent-2)' },
  simplify: { label: '✂️ Simplify Big-O', color: 'var(--accent-3)' },
  rank: { label: '📊 Order ranking', color: 'var(--warn)' },
  recurrence: { label: '🔁 Recurrence T(n)', color: 'var(--pink)' },
  'rec-code': { label: '⛓ Recursive code', color: 'var(--success)' },
};

Lessons14["bigo-exercises"] = function () {
  const [cat, setCat] = useS14('all');
  const [show, setShow] = useS14({});
  const [score, setScore] = useS14({ right: 0, total: 0 });
  const list = useM14(() => cat === 'all' ? BIGO_EXERCISES : BIGO_EXERCISES.filter(e => e.cat === cat), [cat]);
  const toggle = (id, key) => setShow(s => ({ ...s, [`${id}-${key}`]: !s[`${id}-${key}`] }));
  const mark = (id, ok) => setScore(prev => ({ right: prev.right + (ok ? 1 : 0), total: prev.total + 1 }));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📚 Big-O Exercise Bank — {BIGO_EXERCISES.length} ข้อจากชีท KMUTNB</div>
        ครอบคลุม: <b>BIGO.pdf</b> 15 ข้อ · <b>exercise_1.pdf</b> · <b>hw_1_Timecomplexity1.pdf</b> · <b>hw_1_tnrecursive.pdf</b> · <b>แบบฝึกหัดที่ 2/3 tn</b>
        <br/><b>ลองตอบเอง</b> ก่อนกด "Show Answer" — บันทึกคะแนนได้
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        <button onClick={() => setCat('all')}
          style={{ background: cat === 'all' ? 'var(--accent)' : 'var(--bg-3)', color: cat === 'all' ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          🗂 ทั้งหมด ({BIGO_EXERCISES.length})
        </button>
        {Object.entries(BIGO_CATS).map(([k, v]) => {
          const count = BIGO_EXERCISES.filter(e => e.cat === k).length;
          return (
            <button key={k} onClick={() => setCat(k)}
              style={{ background: cat === k ? v.color : 'var(--bg-3)', color: cat === k ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              {v.label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
        <b>คะแนนของคุณ:</b> {score.right} / {score.total}
        {score.total > 0 && <span style={{ color: 'var(--text-2)', marginLeft: 8 }}>({Math.round(100 * score.right / score.total)}%)</span>}
        <button onClick={() => setScore({ right: 0, total: 0 })}
          style={{ marginLeft: 12, background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
          ↺ Reset
        </button>
      </div>

      {list.map(e => {
        const catInfo = BIGO_CATS[e.cat];
        return (
          <div key={e.id} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>Q{e.id}.</span>
              <span style={{ fontSize: 11, padding: '2px 8px', background: catInfo.color, color: '#000', borderRadius: 999 }}>{catInfo.label}</span>
              <span style={{ fontSize: 11, color: 'var(--text-2)' }}>📄 {e.src}</span>
            </div>
            <pre className="code" style={{ background: '#0a0e14', padding: 10, borderRadius: 4, fontSize: 13, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{e.q}</pre>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <button onClick={() => toggle(e.id, 'a')}
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ✓ {show[`${e.id}-a`] ? 'Hide' : 'Show'} Answer
              </button>
              <button onClick={() => mark(e.id, true)}
                style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ✅ ฉันตอบถูก
              </button>
              <button onClick={() => mark(e.id, false)}
                style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid #f87171', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ❌ ตอบผิด
              </button>
            </div>
            {show[`${e.id}-a`] && (
              <div style={{ padding: 10, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981', borderRadius: 4, fontSize: 13, lineHeight: 1.6 }}>
                <b>Answer:</b> {e.a}<br/>
                <span style={{ color: 'var(--text-2)' }}><b>Why:</b> {e.explain}</span>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-2)', borderRadius: 10, fontSize: 13 }}>
        <b style={{ color: 'var(--accent)' }}>💡 เคล็ดลับการสอบ T(n) / Big-O</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>Loop step *= 2</b> → log n รอบ</li>
          <li><b>Loop step += k</b> → n/k = O(n)</li>
          <li><b>Inner loop bound ขึ้นกับ i</b> → ใช้ summation (Σ)</li>
          <li><b>Recurrence T(n) = aT(n/b) + n^d</b> → Master Theorem</li>
          <li><b>Recurrence T(n) = T(n-1) + f(n)</b> → backward substitution</li>
          <li>เมื่อมี 2 พจน์ → เก็บที่โตเร็วกว่า (Big-O drop constants + smaller terms)</li>
        </ul>
      </div>
    </React.Fragment>
  );
};

window.LessonsPart14 = Lessons14;
