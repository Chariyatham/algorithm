/* Lessons Part 27 — Math Primer + Beginner C++ + Bit Manipulation
   Prerequisite onramp ก่อนเริ่ม algorithms จริง */

const { useState: useS27, useMemo: useM27 } = React;
const { Quiz: Quiz27 } = window.LessonComponents;
const { CheatSheet: CS27, Pitfalls: PF27 } = window.LearningKit || {};

const Lessons27 = {};

/* ============================================================
   115 — Mathematical Induction
============================================================ */
Lessons27["math-induction"] = function () {
  const [n, setN] = useS27(5);
  const sum = (n * (n + 1)) / 2;
  const steps = [];
  let s = 0;
  for (let i = 1; i <= n; i++) { s += i; steps.push({ i, s }); }

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ <b>Mathematical Induction</b> — เครื่องมือพิสูจน์ที่ใช้ในเกือบทุก algorithm proof
      </div>

      <h3>หลักการ Induction (อุปนัย)</h3>
      <p>ถ้าจะพิสูจน์ <code>P(n)</code> เป็นจริงสำหรับทุก n ≥ 1:</p>
      <ol style={{ color: 'var(--text-1)', lineHeight: 1.9 }}>
        <li><b>Base Case:</b> พิสูจน์ <code>P(1)</code> จริง</li>
        <li><b>Inductive Hypothesis:</b> สมมติ <code>P(k)</code> จริง สำหรับ k บางตัว</li>
        <li><b>Inductive Step:</b> พิสูจน์ว่า <code>P(k) ⇒ P(k+1)</code></li>
        <li>สรุป: <code>P(n)</code> จริงสำหรับทุก n ≥ 1 ✓</li>
      </ol>

      <h3>ตัวอย่างคลาสสิก: พิสูจน์ 1+2+…+n = n(n+1)/2</h3>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, fontFamily: 'monospace', fontSize: 13 }}>
        <div><b>Base:</b> n=1 → LHS=1, RHS=1·2/2=1 ✓</div>
        <div style={{ marginTop: 8 }}><b>Hypothesis:</b> สมมติ 1+2+…+k = k(k+1)/2</div>
        <div style={{ marginTop: 8 }}><b>Step:</b> พิสูจน์ 1+2+…+k+(k+1) = (k+1)(k+2)/2</div>
        <div style={{ marginLeft: 24, marginTop: 4 }}>LHS = k(k+1)/2 + (k+1) <span style={{ color: 'var(--text-3)' }}>← ใช้ hypothesis</span></div>
        <div style={{ marginLeft: 24 }}>    = (k+1)[k/2 + 1] = (k+1)(k+2)/2 = RHS ✓</div>
        <div style={{ marginTop: 8, color: 'var(--accent-3)' }}>∴ P(n) จริงสำหรับทุก n ≥ 1 ∎</div>
      </div>

      <h3>ลองดูผลรวมจริง</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <label>n =</label>
        <input type="range" min="1" max="20" value={n} onChange={e => setN(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ fontFamily: 'monospace', minWidth: 40 }}>{n}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {steps.map((st, i) => (
          <div key={i} style={{ background: 'var(--bg-3)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontFamily: 'monospace' }}>
            +{st.i} → {st.s}
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        สูตร: n(n+1)/2 = {n}·{n + 1}/2 = <b style={{ color: 'var(--accent)' }}>{sum}</b>
      </div>

      <h3>Induction ใช้ที่ไหนในวิชา Algorithm?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Loop Invariant</b> — พิสูจน์ correctness ของ loop (เป็น induction บน iteration)</li>
        <li><b>Big-O proofs</b> — แก้ T(n) = 2T(n/2) + n แบบ substitution</li>
        <li><b>Tree properties</b> — height ของ binary tree ที่มี n nodes</li>
        <li><b>Greedy correctness</b> — exchange argument มักเป็น induction</li>
      </ul>

      <h3>Strong Induction (อุปนัยแบบเข้ม)</h3>
      <p>แทนที่จะสมมติแค่ P(k), สมมติ <b>P(1), P(2), …, P(k) ทั้งหมด</b> จริง → ใช้พิสูจน์ P(k+1)</p>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
        <b>เมื่อไหร่ใช้?</b> เมื่อ recursion เรียก subproblem ขนาดเล็กกว่า "หลายขนาด" เช่น Merge Sort เรียก T(n/2) สองครั้ง — induction ต้องใช้ P(n/2) ทั้งคู่
      </div>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8, marginTop: 12 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ ข้อผิดพลาดที่พบบ่อย</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>ลืม Base case — proof <b>ไม่ valid</b> ถ้าไม่พิสูจน์ P(1)</li>
          <li>สับสน "สมมติ P(k)" (hypothesis) กับ "พิสูจน์ P(k)" (สิ่งที่ผิด — กลายเป็น circular)</li>
          <li>Strong induction ต้องใช้ <b>หลาย</b> base case บางครั้ง (เช่น Fibonacci ต้อง F(0), F(1))</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/loop-invariant" style={{ color: 'var(--accent)' }}>Loop Invariant (บท 66)</a> — induction บน loop iteration</p>
      <p>📚 <a href="#/recursion-methods" style={{ color: 'var(--accent)' }}>Substitution method (บท 65)</a> — induction แก้ recurrence</p>

      <Quiz27
        q="Inductive Step ที่ถูกต้องคือ?"
        options={[
          "พิสูจน์ P(1) จริง",
          "สมมติ P(n) จริง สำหรับทุก n",
          "พิสูจน์ว่า P(k) ⇒ P(k+1)",
          "นับจำนวน case"
        ]}
        answer={2}
        explain="Inductive Step คือการพิสูจน์ implication: ถ้า P(k) จริง แล้ว P(k+1) ก็จริง — ไม่ใช่พิสูจน์ P(k) เอง"
      />
      <Quiz27
        q="Strong Induction ต่างจาก induction ปกติยังไง?"
        options={[
          "ใช้ base case 2 ตัว",
          "สมมติ P(1)…P(k) ทั้งหมดจริง แล้วพิสูจน์ P(k+1)",
          "ไม่ต้อง base case",
          "ใช้ Big-O แทน"
        ]}
        answer={1}
        explain="Strong induction ทรงพลังกว่าเมื่อ recursion ลึกเรียก subproblem หลายขนาด"
      />
      <Quiz27
        q="ทำไม induction ใช้พิสูจน์ correctness ของ loop ได้?"
        options={[
          "Loop ต้อง terminate",
          "Loop iteration คล้าย step ของ induction (1, 2, 3, …)",
          "Loop เร็วกว่า recursion",
          "ไม่เกี่ยวข้องกัน"
        ]}
        answer={1}
        explain="Loop Invariant = property ที่จริงทุก iteration — initialization (base) + maintenance (step) + termination"
      />
    </React.Fragment>
  );
};

/* ============================================================
   116 — Summation Formulas
============================================================ */
Lessons27["math-summation"] = function () {
  const [n, setN] = useS27(10);
  const linear = (n * (n + 1)) / 2;
  const square = (n * (n + 1) * (2 * n + 1)) / 6;
  const cube = Math.pow((n * (n + 1)) / 2, 2);
  const geom = (Math.pow(2, n + 1) - 1);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        จำสูตร summation ที่ใช้ <b>วิเคราะห์ Big-O</b> ของ nested loop ได้แม่นยำ
      </div>

      <h3>5 สูตรต้องจำ</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-2)', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'var(--bg-3)' }}>
            <th style={{ padding: 10, textAlign: 'left' }}>Series</th>
            <th style={{ padding: 10, textAlign: 'left' }}>สูตรปิด</th>
            <th style={{ padding: 10, textAlign: 'left' }}>Big-O</th>
          </tr>
        </thead>
        <tbody style={{ fontFamily: 'monospace', fontSize: 13 }}>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1+1+…+1 (n เทอม)</td><td>n</td><td>O(n)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1+2+3+…+n</td><td>n(n+1)/2</td><td>O(n²)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1²+2²+…+n²</td><td>n(n+1)(2n+1)/6</td><td>O(n³)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1³+2³+…+n³</td><td>[n(n+1)/2]²</td><td>O(n⁴)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1+2+4+…+2ⁿ (geometric)</td><td>2ⁿ⁺¹−1</td><td>O(2ⁿ)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1+r+r²+…+rⁿ (r≠1)</td><td>(rⁿ⁺¹−1)/(r−1)</td><td>O(rⁿ)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 10 }}>1/1+1/2+…+1/n (harmonic)</td><td>≈ ln n + γ</td><td>O(log n)</td></tr>
        </tbody>
      </table>

      <h3>ทดลอง n = {n}</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <label>n =</label>
        <input type="range" min="1" max="20" value={n} onChange={e => setN(+e.target.value)} style={{ flex: 1 }} />
        <span style={{ fontFamily: 'monospace', minWidth: 40 }}>{n}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>Σi (i=1..{n})</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--accent)' }}>{linear}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>Σi²</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--accent-2)' }}>{square}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>Σi³</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--accent-3)' }}>{cube}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>2⁰+2¹+…+2ⁿ</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: 'var(--warn)' }}>{geom}</div>
        </div>
      </div>

      <h3>ใช้วิเคราะห์ nested loop</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <pre style={{ margin: 0, color: 'var(--text-0)' }}>{`for (i = 1; i <= n; i++)
  for (j = 1; j <= i; j++)
    ops++;`}</pre>
        <div style={{ marginTop: 8, color: 'var(--text-1)' }}>
          ops = Σ(i=1..n) i = n(n+1)/2 = O(n²)
        </div>
      </div>

      <h3>Telescoping (ตัดทอน)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <div>Σ [f(i+1) − f(i)] = f(n+1) − f(1)</div>
        <div style={{ marginTop: 8, color: 'var(--text-2)' }}>// เทอมกลางหักล้างหมด</div>
        <div style={{ marginTop: 8 }}>ตัวอย่าง: Σ 1/[i(i+1)] = Σ [1/i − 1/(i+1)] = 1 − 1/(n+1)</div>
      </div>

      <Quiz27
        q="for(i=1;i<=n;i++) for(j=1;j<=n;j++) for(k=1;k<=j;k++) Big-O?"
        options={["O(n²)", "O(n² log n)", "O(n³)", "O(n⁴)"]}
        answer={2}
        explain="inner: Σj = O(n²) → คูณ n รอบนอก = O(n³)"
      />
      <Quiz27
        q="Σ(i=1..n) 1 = ?"
        options={["1", "n", "n²", "log n"]}
        answer={1}
        explain="บวก 1 ทั้งหมด n เทอม = n"
      />
      <Quiz27
        q="Harmonic series 1/1 + 1/2 + 1/3 + … + 1/n เป็น Θ ของอะไร?"
        options={["O(1)", "O(log n)", "O(√n)", "O(n)"]}
        answer={1}
        explain="H(n) ≈ ln n + γ — สำคัญในการวิเคราะห์ Quick Sort, Union-Find (กับ path compression)"
      />
    </React.Fragment>
  );
};

/* ============================================================
   117 — Logarithm Rules
============================================================ */
Lessons27["math-log"] = function () {
  const [base, setBase] = useS27(2);
  const [x, setX] = useS27(8);
  const val = Math.log(x) / Math.log(base);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ <b>log</b> ที่ใช้ในทุก algorithm: binary search, heap, balanced BST, divide & conquer
      </div>

      <h3>นิยาม</h3>
      <p><code>log_b(x) = y</code> หมายถึง <code>b^y = x</code> — "ยกกำลังกี่ครั้งของ b จะได้ x"</p>

      <h3>ลองคำนวณ</h3>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12, background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
        <label>base =</label>
        <input type="number" min="2" max="10" value={base} onChange={e => setBase(Math.max(2, +e.target.value || 2))} style={{ width: 60, padding: 4 }} />
        <label>x =</label>
        <input type="number" min="1" value={x} onChange={e => setX(Math.max(1, +e.target.value || 1))} style={{ width: 80, padding: 4 }} />
        <div style={{ fontFamily: 'monospace', fontSize: 16 }}>
          log<sub>{base}</sub>({x}) = <b style={{ color: 'var(--accent)' }}>{val.toFixed(4)}</b>
        </div>
      </div>

      <h3>กฎสำคัญ 7 ข้อ</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', fontSize: 13.5, lineHeight: 1.9 }}>
        <div>1. <b>log(xy)</b> = log x + log y</div>
        <div>2. <b>log(x/y)</b> = log x − log y</div>
        <div>3. <b>log(x^k)</b> = k · log x</div>
        <div>4. <b>log_b(b)</b> = 1, <b>log_b(1)</b> = 0</div>
        <div>5. <b>b^(log_b(x))</b> = x</div>
        <div>6. <b>Change of base:</b> log_a(x) = log_b(x) / log_b(a)</div>
        <div>7. <b>log_a(b) · log_b(c)</b> = log_a(c)</div>
      </div>

      <h3>Big-O และ log</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
        <p>ใน Big-O, <b>fase ของ log ไม่สำคัญ</b> เพราะ log_a(n) = log_b(n) / log_b(a) — ค่าคงที่</p>
        <p>ดังนั้นเราเขียน <code>O(log n)</code> เฉย ๆ ไม่ต้องบอกว่า log อะไร</p>
      </div>

      <h3>ทำไม Binary Search = O(log n)?</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <div>ทุกรอบ ขนาดข้อมูลลดครึ่ง: n → n/2 → n/4 → … → 1</div>
        <div>กี่รอบจะลดเหลือ 1? n/2^k = 1 → 2^k = n → <b style={{ color: 'var(--accent)' }}>k = log₂ n</b></div>
        <div style={{ marginTop: 8, color: 'var(--text-2)' }}>// n=1,000,000 → 20 รอบเท่านั้น</div>
      </div>

      <h3>ตารางอ้างอิงที่ต้องจำ</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse', fontFamily: 'monospace' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>n</th><th>log₂ n</th><th>n log n</th><th>n²</th></tr>
        </thead>
        <tbody>
          {[10, 100, 1000, 10000, 1000000].map(nn => (
            <tr key={nn} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: 8 }}>{nn.toLocaleString()}</td>
              <td>{Math.log2(nn).toFixed(1)}</td>
              <td>{(nn * Math.log2(nn)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
              <td>{(nn * nn).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Quiz27
        q="log₂(1024) เท่ากับเท่าไหร่?"
        options={["8", "10", "12", "1024"]}
        answer={1}
        explain="1024 = 2¹⁰ ดังนั้น log₂(1024) = 10"
      />
      <Quiz27
        q="log(xy) = ?"
        options={["log(x) · log(y)", "log(x) + log(y)", "log(x) − log(y)", "log(x) / log(y)"]}
        answer={1}
        explain="กฎพื้นฐาน: log ของผลคูณ = ผลบวกของ log"
      />
      <Quiz27
        q="n = 10⁶ → ⌈log₂ n⌉ ≈ ?"
        options={["10", "20", "30", "100"]}
        answer={1}
        explain="2²⁰ ≈ 10⁶ — ใช้เป็น LOG ใน binary lifting"
      />
    </React.Fragment>
  );
};

/* ============================================================
   118 — Combinatorics Primer
============================================================ */
Lessons27["math-combinatorics"] = function () {
  const [n, setN] = useS27(5);
  const [r, setR] = useS27(2);
  const fact = (k) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
  const nCr = fact(n) / (fact(r) * fact(n - r));
  const nPr = fact(n) / fact(n - r);

  // Pascal's triangle
  const tri = [];
  for (let i = 0; i < 7; i++) {
    const row = [];
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) row.push(1);
      else row.push(tri[i - 1][j - 1] + tri[i - 1][j]);
    }
    tri.push(row);
  }

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        นับของได้ — ใช้ใน backtracking, DP, probability, hashing analysis
      </div>

      <h3>3 หลักนับพื้นฐาน</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Sum rule:</b> งาน A หรือ B = a + b วิธี (mutually exclusive)</li>
        <li><b>Product rule:</b> งาน A และ B = a · b วิธี</li>
        <li><b>Pigeonhole:</b> ใส่ n+1 ของ ใน n ช่อง → มีช่องที่มี ≥ 2 ของ</li>
      </ul>

      <h3>Permutation vs Combination</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace' }}>
        <div><b>n!</b> = n × (n−1) × … × 1 (ทั้งหมด permutation ของ n ของ)</div>
        <div><b>P(n,r)</b> = n!/(n−r)! (เลือก r ของ จาก n เรียงลำดับ)</div>
        <div><b>C(n,r)</b> = n!/(r!(n−r)!) (เลือก r ของ จาก n ไม่เรียง)</div>
        <div style={{ marginTop: 10, color: 'var(--text-2)' }}>
          // หรือ "nCr" = "n choose r"
        </div>
      </div>

      <h3>ทดลอง</h3>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
        <label>n =</label>
        <input type="range" min="1" max="10" value={n} onChange={e => setN(+e.target.value)} />
        <span style={{ fontFamily: 'monospace', minWidth: 24 }}>{n}</span>
        <label>r =</label>
        <input type="range" min="0" max={n} value={Math.min(r, n)} onChange={e => setR(+e.target.value)} />
        <span style={{ fontFamily: 'monospace', minWidth: 24 }}>{Math.min(r, n)}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>n!</div>
          <div style={{ fontFamily: 'monospace', fontSize: 20, color: 'var(--accent)' }}>{fact(n).toLocaleString()}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>P({n},{Math.min(r, n)})</div>
          <div style={{ fontFamily: 'monospace', fontSize: 20, color: 'var(--accent-2)' }}>{nPr.toLocaleString()}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
          <div style={{ color: 'var(--text-2)', fontSize: 12 }}>C({n},{Math.min(r, n)})</div>
          <div style={{ fontFamily: 'monospace', fontSize: 20, color: 'var(--accent-3)' }}>{nCr.toLocaleString()}</div>
        </div>
      </div>

      <h3>Pascal's Triangle</h3>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, fontFamily: 'monospace', textAlign: 'center' }}>
        {tri.map((row, i) => (
          <div key={i} style={{ marginBottom: 4 }}>
            {row.map((v, j) => (
              <span key={j} style={{
                display: 'inline-block', width: 36, color: 'var(--accent)', fontWeight: 600
              }}>{v}</span>
            ))}
          </div>
        ))}
        <div style={{ marginTop: 8, color: 'var(--text-2)', fontSize: 12 }}>
          แถวที่ n, ตำแหน่งที่ k = C(n,k) — ทุกตัว = ผลรวม 2 ตัวบน
        </div>
      </div>

      <h3>Stars and Bars</h3>
      <p>วิธีแจก n ของ ให้คน k คน (อาจได้ 0) = <code>C(n+k−1, k−1)</code></p>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
        ตัวอย่าง: 5 ลูกอม → 3 คน = C(7,2) = 21 วิธี
      </div>

      <h3>ใช้ที่ไหนในวิชา?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Subset enumeration:</b> 2ⁿ subsets, C(n,k) subsets ขนาด k</li>
        <li><b>Bitmask DP:</b> วน 2ⁿ states</li>
        <li><b>DP on combinations:</b> C(n,r) มี recurrence C(n,r) = C(n−1,r−1) + C(n−1,r)</li>
        <li><b>Probability:</b> P = ดี/ทั้งหมด</li>
      </ul>

      <Quiz27
        q="เลือก 3 คนจาก 10 ทำกรรมการ (ไม่เรียงลำดับ) มีกี่วิธี?"
        options={["30", "120", "720", "1000"]}
        answer={1}
        explain="C(10,3) = 10!/(3!·7!) = 120"
      />
      <Quiz27
        q="จัด 10 คนเข้าแถว (เรียงลำดับ) มีกี่วิธี?"
        options={["10", "100", "10!", "2¹⁰"]}
        answer={2}
        explain="Permutation ทั้งหมดของ n สิ่ง = n! = 10! = 3,628,800"
      />
      <Quiz27
        q="Set {1,2,3,4} มี subset ทั้งหมดกี่ตัว?"
        options={["4", "8", "16", "24"]}
        answer={2}
        explain="|P(A)| = 2^|A| = 2⁴ = 16 (รวม empty set และ A เอง)"
      />
    </React.Fragment>
  );
};

/* ============================================================
   119 — Probability Primer
============================================================ */
Lessons27["math-probability"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        Probability พื้นฐาน + Expected Value — ก่อนเรียน Randomized Algorithms
      </div>

      <h3>นิยาม</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Sample space (Ω):</b> เซตของผลลัพธ์ที่เป็นไปได้ทั้งหมด</li>
        <li><b>Event (E):</b> subset ของ Ω</li>
        <li><b>P(E)</b> = |E| / |Ω| (เมื่อทุกผลเท่ากัน)</li>
      </ul>

      <h3>กฎสำคัญ</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', lineHeight: 1.9 }}>
        <div>0 ≤ P(E) ≤ 1</div>
        <div>P(¬E) = 1 − P(E) <span style={{ color: 'var(--text-2)' }}>// complement</span></div>
        <div>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div>
        <div>P(A | B) = P(A ∩ B) / P(B) <span style={{ color: 'var(--text-2)' }}>// conditional</span></div>
        <div>P(A ∩ B) = P(A) · P(B) <span style={{ color: 'var(--text-2)' }}>// ถ้า A,B independent</span></div>
      </div>

      <h3>Expected Value (ค่าคาดหวัง)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace' }}>
        <div>E[X] = Σ x · P(X=x)</div>
        <div style={{ marginTop: 8, color: 'var(--text-2)' }}>// "ค่าเฉลี่ยถ้าทดลองหลาย ๆ ครั้ง"</div>
      </div>

      <h3>ตัวอย่าง: ทอยลูกเต๋า</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8 }}>
        <div>E[X] = 1·(1/6) + 2·(1/6) + … + 6·(1/6) = 21/6 = 3.5</div>
      </div>

      <h3>Linearity of Expectation (สำคัญมาก!)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 15 }}>E[X + Y] = E[X] + E[Y]</div>
        <div style={{ marginTop: 8, color: 'var(--text-1)' }}>
          แม้ X, Y <b>ไม่ independent</b> ก็ใช้ได้ — เครื่องมือทรงพลังในการวิเคราะห์ randomized algos
        </div>
      </div>

      <h3>Indicator Random Variable</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <div>X_i = 1 ถ้า event เกิด, 0 ถ้าไม่</div>
        <div>E[X_i] = 1·P(event) + 0·P(¬event) = P(event)</div>
        <div style={{ marginTop: 8, color: 'var(--text-2)' }}>// ใช้พิสูจน์ Randomized QuickSort = O(n log n) avg</div>
      </div>

      <h3>Las Vegas vs Monte Carlo</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>ประเภท</th><th>คำตอบ</th><th>เวลา</th><th>ตัวอย่าง</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}>
            <td style={{ padding: 8 }}><b>Las Vegas</b></td>
            <td>ถูกเสมอ</td><td>คาดหวัง</td><td>Randomized QuickSort</td>
          </tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}>
            <td style={{ padding: 8 }}><b>Monte Carlo</b></td>
            <td>อาจผิด (prob ต่ำ)</td><td>fix</td><td>Miller-Rabin Primality</td>
          </tr>
        </tbody>
      </table>

      <Quiz27
        q="โยนเหรียญ 3 ครั้ง P(หัวอย่างน้อย 1 ครั้ง)?"
        options={["1/8", "3/8", "7/8", "1"]}
        answer={2}
        explain="1 − P(ก้อยทุกครั้ง) = 1 − (1/2)³ = 7/8"
      />
      <Quiz27
        q="ทอยลูกเต๋า 2 ลูก E[ผลรวม] = ?"
        options={["3.5", "7", "6", "12"]}
        answer={1}
        explain="Linearity: E[X+Y] = E[X] + E[Y] = 3.5 + 3.5 = 7"
      />
      <Quiz27
        q="Linearity of Expectation ใช้ได้แม้ X, Y ไม่ independent?"
        options={[
          "ไม่ — ต้อง independent เสมอ",
          "ใช่ — Linearity ทรงพลังเพราะใช้ได้ไม่ว่าจะ dependent หรือไม่",
          "ใช้ได้แค่กับ uniform distribution",
          "ใช้ได้แค่กับ discrete"
        ]}
        answer={1}
        explain="นี่คือเหตุผลที่ Linearity ใช้พิสูจน์ Randomized QuickSort = O(n log n) ได้"
      />
    </React.Fragment>
  );
};

/* ============================================================
   120 — Set Theory & Relations
============================================================ */
Lessons27["math-set-relations"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        Set, Relation, Function — ภาษาที่ใช้บรรยาย graph, hash, equivalence
      </div>

      <h3>Set Operations</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', lineHeight: 2 }}>
        <div>A ∪ B = ทุก x ใน A <b>หรือ</b> B</div>
        <div>A ∩ B = ทุก x ใน A <b>และ</b> B</div>
        <div>A \ B = x ใน A แต่ไม่ใน B</div>
        <div>A × B = {`{(a,b) | a∈A, b∈B}`} <span style={{ color: 'var(--text-2)' }}>// Cartesian product</span></div>
        <div>P(A) = power set, |P(A)| = 2^|A|</div>
        <div>|A ∪ B| = |A| + |B| − |A ∩ B| <span style={{ color: 'var(--text-2)' }}>// inclusion-exclusion</span></div>
      </div>

      <h3>Relations</h3>
      <p>R ⊆ A × B — เซตของคู่อันดับ</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Reflexive:</b> ∀a, (a,a) ∈ R</li>
        <li><b>Symmetric:</b> (a,b) ∈ R ⇒ (b,a) ∈ R</li>
        <li><b>Transitive:</b> (a,b),(b,c) ∈ R ⇒ (a,c) ∈ R</li>
        <li><b>Equivalence:</b> R และ S และ T พร้อมกัน → แบ่ง partition ได้</li>
        <li><b>Partial Order:</b> R และ T และ antisymmetric — ใช้ใน topological sort!</li>
      </ul>

      <h3>Functions</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
        <div><b>Injective (1-1):</b> f(a)=f(b) ⇒ a=b</div>
        <div><b>Surjective (onto):</b> ทุก y ∈ B มี x ∈ A ที่ f(x)=y</div>
        <div><b>Bijective:</b> 1-1 และ onto — มี inverse</div>
      </div>

      <h3>ใช้ที่ไหน?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Graph = (V, E)</b> โดย E ⊆ V × V</li>
        <li><b>Hash function:</b> f: keys → buckets (ต้องการ uniform)</li>
        <li><b>Equivalence class:</b> Union-Find ใช้!</li>
        <li><b>Partial order:</b> Topological sort, DAG, precedence</li>
        <li><b>Power set:</b> bitmask DP — วน 2ⁿ subsets</li>
      </ul>

      <Quiz27
        q="|A|=3, |B|=4 → |A × B| = ?"
        options={["7", "12", "16", "81"]}
        answer={1}
        explain="Cartesian product: |A × B| = |A| · |B| = 3 · 4 = 12"
      />
      <Quiz27
        q="Relation 'หารลงตัว' (a R b ⟺ a | b) บน positive integers มี property ไหน?"
        options={[
          "Reflexive + Symmetric (equivalence)",
          "Reflexive + Antisymmetric + Transitive (partial order)",
          "Symmetric เท่านั้น",
          "ไม่มี property ใด"
        ]}
        answer={1}
        explain="a|a (reflexive), a|b ∧ b|a → a=b (antisymmetric), a|b ∧ b|c → a|c (transitive) — partial order"
      />
      <Quiz27
        q="f: A → B เป็น bijection หมายถึง?"
        options={[
          "f เป็น injective อย่างเดียว",
          "f เป็น surjective อย่างเดียว",
          "f เป็นทั้ง injective + surjective — มี inverse",
          "|A| = |B| เสมอ"
        ]}
        answer={2}
        explain="Bijection: 1-1 + onto — f มี f⁻¹ ที่ก็เป็น bijection"
      />
    </React.Fragment>
  );
};

/* ============================================================
   121 — C++ Variables & Types
============================================================ */
Lessons27["cpp-variables"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ variable, type, scope, const — พื้นฐานก่อนทุกอย่าง
      </div>

      <h3>ประกาศตัวแปร</h3>
      <CodeBlock code={[
        "int x = 10;          // จำนวนเต็ม 32-bit",
        "long long big = 1e18; // 64-bit (ใช้กับเลขใหญ่)",
        "double pi = 3.14;    // จุดทศนิยม 64-bit",
        "char c = 'A';        // 1 byte",
        "bool flag = true;    // true/false",
        "string s = \"hi\";    // ต้อง #include <string>",
        "auto y = 42;         // C++ เดาเองว่า int",
      ]} />

      <h3>ตารางช่วงค่า</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Type</th><th>ขนาด</th><th>ช่วงค่า</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>int</td><td>4 bytes</td><td>−2.1×10⁹ ถึง 2.1×10⁹</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>long long</td><td>8 bytes</td><td>−9.2×10¹⁸ ถึง 9.2×10¹⁸</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>unsigned int</td><td>4 bytes</td><td>0 ถึง 4.2×10⁹</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>double</td><td>8 bytes</td><td>~15-16 หลักนัยสำคัญ</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>char</td><td>1 byte</td><td>−128 ถึง 127</td></tr>
        </tbody>
      </table>

      <h3>const (ห้ามแก้)</h3>
      <CodeBlock code={[
        "const int MAX = 1000;",
        "MAX = 2000;  // ❌ error — แก้ไม่ได้",
        "",
        "const double PI = 3.14159;",
      ]} />

      <h3>Operators ที่ต้องรู้</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', fontSize: 13.5, lineHeight: 1.9 }}>
        <div><b>+, −, *, /, %</b> — บวก ลบ คูณ หาร mod (เศษ)</div>
        <div><b>==, !=, &lt;, &lt;=, &gt;, &gt;=</b> — เปรียบเทียบ → bool</div>
        <div><b>&&, ||, !</b> — and, or, not (logical)</div>
        <div><b>++, −−</b> — เพิ่ม/ลด 1</div>
        <div><b>+=, −=, *=, /=, %=</b> — รวบรัด: x += 5 = x = x + 5</div>
      </div>

      <h3>Integer Overflow ⚠️</h3>
      <CodeBlock code={[
        "int a = 1000000, b = 1000000;",
        "int c = a * b;  // ❌ overflow! 10^12 เกิน int",
        "",
        "long long c = (long long)a * b;  // ✓ cast ก่อนคูณ",
      ]} />

      <h3>Floating Point ⚠️</h3>
      <CodeBlock code={[
        "double a = 0.1 + 0.2;  // = 0.30000000000000004 (ไม่ใช่ 0.3!)",
        "if (a == 0.3) {...}     // ❌ อาจ false",
        "if (abs(a - 0.3) < 1e-9) {...}  // ✓ เปรียบเทียบด้วย epsilon",
      ]} />

      <Quiz27
        q="int a = 2147483647; a + 1 = ?"
        options={["2147483648", "−2147483648 (overflow)", "0", "Compile error"]}
        answer={1}
        explain="int max + 1 ห่อกลับเป็น int min — เรียก signed integer overflow (undefined behavior จริง ๆ)"
      />
      <Quiz27
        q="ทำไม 0.1 + 0.2 != 0.3 ใน C++?"
        options={[
          "Compiler bug",
          "Floating point ไม่สามารถเก็บ 0.1, 0.2 ได้แม่นยำ (binary repr)",
          "ใช้ int แทน double",
          "Promotion ผิด"
        ]}
        answer={1}
        explain="0.1 = 0.0001100110011...₂ (infinite repeating) — เก็บได้เฉพาะ approximation"
      />
      <Quiz27
        q="ใช้ type ไหนกับเลข 10^15?"
        options={["int", "long long", "double", "string"]}
        answer={1}
        explain="int max ≈ 2.1×10⁹ — เกิน; long long max ≈ 9.2×10¹⁸ — พอ"
      />
    </React.Fragment>
  );
};

/* ============================================================
   122 — C++ Control Flow
============================================================ */
Lessons27["cpp-control-flow"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        if/else, while, for, switch, break, continue — โครงสร้างควบคุมทั้งหมด
      </div>

      <h3>if / else</h3>
      <CodeBlock code={[
        "if (x > 0) {",
        "  cout << \"บวก\";",
        "} else if (x < 0) {",
        "  cout << \"ลบ\";",
        "} else {",
        "  cout << \"ศูนย์\";",
        "}",
      ]} />

      <h3>while (เงื่อนไขก่อน)</h3>
      <CodeBlock code={[
        "int i = 0;",
        "while (i < 10) {",
        "  cout << i << ' ';",
        "  i++;",
        "}",
        "// output: 0 1 2 3 4 5 6 7 8 9",
      ]} />

      <h3>do-while (ทำก่อนแล้วเช็ค)</h3>
      <CodeBlock code={[
        "int x;",
        "do {",
        "  cin >> x;",
        "} while (x < 0);  // วนจนกว่าจะรับเลขไม่ติดลบ",
      ]} />

      <h3>for (3 ส่วน: init; cond; update)</h3>
      <CodeBlock code={[
        "for (int i = 0; i < n; i++) {",
        "  cout << arr[i] << ' ';",
        "}",
        "",
        "// range-for (C++11+) สะอาดกว่า",
        "for (int x : arr) cout << x << ' ';",
        "",
        "// แก้ค่าใน array — ต้อง &",
        "for (int& x : arr) x *= 2;",
      ]} />

      <h3>switch</h3>
      <CodeBlock code={[
        "switch (op) {",
        "  case '+': result = a + b; break;",
        "  case '−': result = a − b; break;",
        "  case '*': result = a * b; break;",
        "  default:  cerr << \"unknown\"; break;",
        "}",
      ]} />

      <h3>break / continue</h3>
      <CodeBlock code={[
        "for (int i = 0; i < 10; i++) {",
        "  if (i == 3) continue;  // ข้าม รอบนี้",
        "  if (i == 7) break;     // ออก loop เลย",
        "  cout << i << ' ';",
        "}",
        "// output: 0 1 2 4 5 6",
      ]} />

      <h3>Nested Loop = nested complexity</h3>
      <CodeBlock code={[
        "for (int i = 0; i < n; i++)",
        "  for (int j = 0; j < n; j++)",
        "    op();  // O(n²) ops",
      ]} />

      <h3>Pitfalls ที่เจอบ่อย</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>= vs ==</b> — `if(x=5)` ไม่ใช่เปรียบเทียบ! (assign แล้ว = 5 = true)</li>
        <li><b>off-by-one</b> — `i &lt;= n` vs `i &lt; n` ตรวจให้แม่น</li>
        <li><b>infinite loop</b> — ลืม update ตัวแปร loop</li>
        <li><b>uninitialized var</b> — ค่ามั่ว ถ้าไม่ assign ก่อนใช้</li>
      </ul>

      <Quiz27
        q="for(int i=1; i<=n; i+=2) ทำกี่รอบเมื่อ n=10?"
        options={["4", "5", "10", "infinite"]}
        answer={1}
        explain="i = 1, 3, 5, 7, 9 → 5 รอบ"
      />
      <Quiz27
        q="if (x = 5) {...} จะเกิดอะไร?"
        options={[
          "Compile error",
          "เป็น true เสมอ (เพราะ 5 ≠ 0) — น่าจะเป็น bug! ใช้ ==",
          "เป็น false",
          "เปรียบเทียบ x กับ 5"
        ]}
        answer={1}
        explain="= คือ assign — return ค่าที่ assign (5) เป็น truthy — bug ที่เจอบ่อย"
      />
      <Quiz27
        q="break กับ continue ต่างกันยังไง?"
        options={[
          "เหมือนกัน",
          "break ออก loop, continue ข้าม iteration นี้ไปรอบถัดไป",
          "break ข้าม iteration, continue ออก loop",
          "ใช้กับ switch เท่านั้น"
        ]}
        answer={1}
        explain="break = exit loop, continue = skip rest of current iteration"
      />
    </React.Fragment>
  );
};

/* ============================================================
   123 — C++ Functions
============================================================ */
Lessons27["cpp-functions"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        Function — ก้อนโค้ดที่ใช้ซ้ำได้ + recursion เริ่มต้น
      </div>

      <h3>Syntax</h3>
      <CodeBlock code={[
        "returnType name(paramType1 p1, paramType2 p2) {",
        "  // body",
        "  return value;",
        "}",
        "",
        "int add(int a, int b) {",
        "  return a + b;",
        "}",
      ]} />

      <h3>Pass by Value vs Reference</h3>
      <CodeBlock code={[
        "void f1(int x) { x = 100; }     // copy — ไม่กระทบของจริง",
        "void f2(int& x) { x = 100; }    // reference — แก้ของจริง",
        "void f3(const int& x) { ... }   // อ่านอย่างเดียว (ดีกับ string/vector ใหญ่)",
        "",
        "int a = 5;",
        "f1(a); cout << a;  // 5",
        "f2(a); cout << a;  // 100",
      ]} />

      <h3>ทำไมต้อง const &?</h3>
      <CodeBlock code={[
        "// ❌ copy ทั้ง vector — ช้า ถ้า vector ใหญ่",
        "int sum(vector<int> v) { ... }",
        "",
        "// ✓ ไม่ copy + ไม่ให้แก้",
        "int sum(const vector<int>& v) { ... }",
      ]} />

      <h3>Default Arguments</h3>
      <CodeBlock code={[
        "void greet(string name, string lang = \"th\") {",
        "  if (lang == \"th\") cout << \"สวัสดี \" << name;",
        "  else cout << \"Hello \" << name;",
        "}",
        "greet(\"กิม\");          // ใช้ \"th\"",
        "greet(\"Kim\", \"en\");    // ใช้ \"en\"",
      ]} />

      <h3>Function Overloading</h3>
      <CodeBlock code={[
        "int max(int a, int b) { return a>b ? a : b; }",
        "double max(double a, double b) { return a>b ? a : b; }",
        "// C++ เลือก version ตาม type ที่ส่ง",
      ]} />

      <h3>Recursion (เรียกตัวเอง)</h3>
      <CodeBlock code={[
        "int fact(int n) {",
        "  if (n <= 1) return 1;     // base case",
        "  return n * fact(n − 1);   // recursive case",
        "}",
        "",
        "// call stack สำหรับ fact(4):",
        "// fact(4) → 4 * fact(3)",
        "//          → 3 * fact(2)",
        "//                   → 2 * fact(1)",
        "//                            → 1",
        "// คืนกลับ: 1 → 2 → 6 → 24",
      ]} />

      <h3>Scope</h3>
      <CodeBlock code={[
        "int g = 10;          // global",
        "",
        "void f() {",
        "  int x = 5;         // local — ใช้ได้ใน f เท่านั้น",
        "  for (int i = 0; i < 3; i++) {",
        "    int y = i;       // ใช้ได้ใน for เท่านั้น",
        "  }",
        "  // y ใช้ไม่ได้แล้ว",
        "}",
      ]} />

      <h3>Forward Declaration</h3>
      <p>ถ้า A เรียก B และ B เรียก A → ต้องประกาศ prototype ก่อน</p>
      <CodeBlock code={[
        "void B();           // prototype",
        "",
        "void A() { B(); }",
        "void B() { A(); }",
      ]} />

      <Quiz27
        q="void f(int& x) ต่างจาก void f(int x) ยังไง?"
        options={[
          "เร็วกว่าเฉย ๆ",
          "แบบแรกแก้ค่าจริง แบบหลังคัดลอก",
          "เหมือนกัน",
          "แบบแรก compile ไม่ผ่าน"
        ]}
        answer={1}
        explain="& คือ reference — function แก้ค่าตัวแปรเดิมได้ ไม่ใช่คัดลอก"
      />
      <Quiz27
        q="ทำไม const vector&lt;int&gt;&amp; ดีกว่า vector&lt;int&gt; เป็น parameter?"
        options={[
          "ไม่ต่างกัน",
          "ไม่ copy vector ใหญ่ + กัน function เผลอแก้",
          "เร็วกว่า เพราะ vector คือ pointer",
          "Compile ง่ายกว่า"
        ]}
        answer={1}
        explain="& หลีกเลี่ยง copy O(n), const กัน mutation — best practice"
      />
      <Quiz27
        q="Recursion ที่ลืม base case จะเกิดอะไร?"
        options={[
          "Compile error",
          "Stack overflow (runtime crash)",
          "Output มั่ว",
          "ทำงานช้า"
        ]}
        answer={1}
        explain="เรียกตัวเองไม่หยุด → stack frame ซ้อนจน stack เต็ม → SIGSEGV"
      />
    </React.Fragment>
  );
};

/* ============================================================
   124 — Bit Manipulation 101
============================================================ */
function BitViz({ a, b }) {
  const bits = (x, n = 8) => x.toString(2).padStart(n, '0').split('');
  const showRow = (lbl, x, color) => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontFamily: 'monospace', marginBottom: 4 }}>
      <span style={{ width: 60, color: 'var(--text-2)' }}>{lbl}</span>
      <span style={{ color: 'var(--text-2)', minWidth: 30 }}>{x}</span>
      <span style={{ display: 'flex', gap: 2 }}>
        {bits(x).map((b, i) => (
          <span key={i} style={{
            display: 'inline-block', width: 22, height: 22, lineHeight: '22px',
            background: b === '1' ? color : 'var(--bg-3)', color: b === '1' ? '#000' : 'var(--text-3)',
            textAlign: 'center', borderRadius: 4, fontWeight: 700
          }}>{b}</span>
        ))}
      </span>
    </div>
  );
  return (
    <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
      {showRow('A', a, 'var(--accent)')}
      {showRow('B', b, 'var(--accent-2)')}
      <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
      {showRow('A & B', a & b, 'var(--accent-3)')}
      {showRow('A | B', a | b, 'var(--warn)')}
      {showRow('A ^ B', a ^ b, 'var(--pink)')}
      {showRow('~A', (~a) & 0xff, 'var(--danger)')}
      {showRow('A << 1', (a << 1) & 0xff, 'var(--accent)')}
      {showRow('A >> 1', a >> 1, 'var(--accent)')}
    </div>
  );
}

Lessons27["bit-manip-101"] = function () {
  const [a, setA] = useS27(12);
  const [b, setB] = useS27(10);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        Bit ops — ใช้ใน bitmask DP, bitset, hashing, compression, optimization
      </div>

      <h3>6 Operators</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse', fontFamily: 'monospace' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Op</th><th>ชื่อ</th><th>กฎ</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>&</td><td>AND</td><td>1 เฉพาะเมื่อทั้งคู่ = 1</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>|</td><td>OR</td><td>1 เมื่ออย่างน้อย 1 ตัว = 1</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>^</td><td>XOR</td><td>1 เมื่อต่างกัน (a^a = 0)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>~</td><td>NOT</td><td>กลับทุก bit</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>&lt;&lt;</td><td>Shift left</td><td>คูณ 2 (เลื่อนซ้าย k ครั้ง = ×2^k)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>&gt;&gt;</td><td>Shift right</td><td>หาร 2 ลงล่าง</td></tr>
        </tbody>
      </table>

      <h3>ทดลองสด</h3>
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        <div>
          <label>A: </label>
          <input type="number" min="0" max="255" value={a} onChange={e => setA(Math.max(0, Math.min(255, +e.target.value || 0)))} style={{ width: 70 }} />
        </div>
        <div>
          <label>B: </label>
          <input type="number" min="0" max="255" value={b} onChange={e => setB(Math.max(0, Math.min(255, +e.target.value || 0)))} style={{ width: 70 }} />
        </div>
      </div>
      <BitViz a={a} b={b} />

      <h3>Bit Tricks ที่ต้องรู้</h3>
      <CodeBlock code={[
        "// 1. ตรวจ bit ที่ตำแหน่ง i",
        "bool on = (x >> i) & 1;",
        "",
        "// 2. set bit ที่ตำแหน่ง i เป็น 1",
        "x |= (1 << i);",
        "",
        "// 3. clear bit ที่ตำแหน่ง i เป็น 0",
        "x &= ~(1 << i);",
        "",
        "// 4. toggle bit (กลับ 0↔1)",
        "x ^= (1 << i);",
        "",
        "// 5. นับ bit ที่เป็น 1 (popcount)",
        "int cnt = __builtin_popcount(x);  // GCC builtin",
        "",
        "// 6. x เป็นเลข 2 ยกกำลังไหม?",
        "bool pow2 = x > 0 && (x & (x − 1)) == 0;",
        "",
        "// 7. lowest set bit",
        "int low = x & (−x);",
        "",
        "// 8. clear lowest set bit",
        "x &= (x − 1);",
        "",
        "// 9. สลับ 2 ตัวแปรไม่ใช้ตัวกลาง (เก๋)",
        "a ^= b; b ^= a; a ^= b;",
      ]} />

      <h3>Subset Enumeration</h3>
      <CodeBlock code={[
        "// วน subset ทุกแบบของ {0,1,…,n−1}",
        "for (int mask = 0; mask < (1 << n); mask++) {",
        "  for (int i = 0; i < n; i++) {",
        "    if (mask & (1 << i)) {",
        "      // bit i อยู่ใน subset",
        "    }",
        "  }",
        "}",
        "",
        "// วน subset ของ subset (sum over subsets — Bitmask DP)",
        "for (int sub = mask; sub > 0; sub = (sub − 1) & mask) {",
        "  // sub คือ subset ของ mask",
        "}",
      ]} />

      <h3>ใช้ที่ไหน?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Bitmask DP</b> (TSP, Assignment) — เก็บ state เป็น bit</li>
        <li><b>std::bitset</b> — array of bool ที่เร็ว 64× กว่า vector&lt;bool&gt;</li>
        <li><b>Flags</b> — `READ | WRITE | EXEC`</li>
        <li><b>Modular hash</b> — 2^k % p ด้วย shift</li>
        <li><b>Sieve</b> — Bit Sieve ประหยัด memory 8×</li>
        <li><b>SOS DP</b> (Sum over Subsets)</li>
      </ul>

      <Quiz27
        q="x & (x − 1) ทำอะไร?"
        options={[
          "เพิ่ม x ขึ้น 1",
          "clear lowest set bit ของ x",
          "นับจำนวน bit",
          "กลับ bit ทั้งหมด"
        ]}
        answer={1}
        explain="เช่น x=12=1100, x−1=11=1011, x&(x−1)=1000=8 — เคลียร์ bit ตำแหน่งต่ำสุดที่เป็น 1"
      />
      <Quiz27
        q="ตรวจว่า x เป็น 2 ยกกำลังด้วยวิธีไหน?"
        options={[
          "x % 2 == 0",
          "x &gt; 0 &amp;&amp; (x & (x − 1)) == 0",
          "log2(x) เป็น integer",
          "x &amp; 1 == 1"
        ]}
        answer={1}
        explain="2^k มี bit ตัวเดียว → x&(x−1) clear bit นั้น → ได้ 0"
      />
      <Quiz27
        q="(1 &lt;&lt; 5) = ?"
        options={["5", "10", "32", "25"]}
        answer={2}
        explain="1 shift left 5 ครั้ง = 2^5 = 32"
      />
    </React.Fragment>
  );
};

window.LessonsPart27 = Lessons27;
