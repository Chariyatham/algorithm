/* Lessons Part 4 — Foundations, Master Theorem, Calculator, Recurrence Solver, Glossary, Concept Map */

const { useState: useS4, useMemo: useM4, useEffect: useE4 } = React;
const { Quiz: Quiz4 } = window.LessonComponents;

const Lessons4 = {};

/* ============================================================
   00 — FOUNDATIONS (C++ พื้นฐาน)
============================================================ */
Lessons4["foundations"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">หน้านี้สำหรับใคร?</div>
        ถ้าคุณ<b>ยังไม่เคยเขียน C++</b> หรือไม่แน่ใจในพื้นฐาน — อ่านหน้านี้ก่อน อย่ารีบข้าม
        ไปบทอัลกอริทึม จะงงครึ่งทาง
      </div>

      <h3>1. Algorithm คืออะไร?</h3>
      <p style={{ color: 'var(--text-1)' }}>
        Algorithm = <b>ขั้นตอนการแก้ปัญหาที่ชัดเจน</b> ทำตามแล้วได้คำตอบเสมอ
      </p>
      <div style={{ background: 'var(--bg-2)', padding: 16, borderRadius: 10, margin: '12px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>ตัวอย่างชีวิตประจำวัน — ทำไข่เจียว:</div>
        <ol style={{ margin: 0, color: 'var(--text-1)' }}>
          <li>ตั้งกระทะ ใส่น้ำมัน</li>
          <li>ตอกไข่ใส่ชาม คนให้เข้ากัน</li>
          <li>เทไข่ลงกระทะ รอ 1 นาที</li>
          <li>พลิก รออีก 30 วิ ตักออก</li>
        </ol>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>
          มี <b>input</b> (ไข่ + น้ำมัน), <b>process</b> (ขั้นตอน), <b>output</b> (ไข่เจียว)
        </div>
      </div>

      <h3>2. Hello World — โปรแกรมแรก</h3>
      <pre className="code">{`#include <iostream>     // ดึง library สำหรับ input/output
using namespace std;    // ไม่ต้องเขียน std:: หน้าทุกคำ

int main() {            // จุดเริ่มต้นของโปรแกรม
  cout << "Hello!" << endl;
  return 0;
}`}</pre>
      <div style={{ background: 'var(--bg-1)', padding: 12, borderRadius: 8, margin: '8px 0', fontFamily: 'monospace', fontSize: 13 }}>
        <div style={{ color: 'var(--text-2)' }}># compile</div>
        <div style={{ color: 'var(--accent-2)' }}>g++ hello.cpp -o hello</div>
        <div style={{ color: 'var(--text-2)', marginTop: 4 }}># run</div>
        <div style={{ color: 'var(--accent-2)' }}>./hello</div>
      </div>

      <h3>3. Variable & Type — ตัวแปร</h3>
      <pre className="code">{`int    age = 20;          // จำนวนเต็ม (4 byte)
double height = 175.5;    // ทศนิยม (~15 หลัก)
char   grade = 'A';       // อักขระเดียว
string name = "Kim";      // ข้อความ — ต้อง #include <string>
bool   isStudent = true;  // จริง/เท็จ`}</pre>
      <table className="tbl">
        <thead><tr><th>Type</th><th>ขนาด</th><th>ค่าได้แค่</th></tr></thead>
        <tbody>
          <tr><td>int</td><td>4 byte</td><td>−2.1×10⁹ ถึง 2.1×10⁹</td></tr>
          <tr><td>long long</td><td>8 byte</td><td>±9.2×10¹⁸ — ใช้เมื่อจำนวนใหญ่</td></tr>
          <tr><td>double</td><td>8 byte</td><td>ทศนิยม ~15 หลัก</td></tr>
          <tr><td>char</td><td>1 byte</td><td>อักขระเดียว 'A'</td></tr>
          <tr><td>bool</td><td>1 byte</td><td>true / false</td></tr>
        </tbody>
      </table>

      <h3>4. if / else / for / while</h3>
      <pre className="code">{`// if-else
if (score >= 80) cout << "A";
else if (score >= 70) cout << "B";
else cout << "C";

// for
for (int i = 0; i < n; i++)
  cout << i << " ";

// while
int i = 0;
while (i < n) { cout << i; i++; }`}</pre>

      <h3>5. Array & Vector</h3>
      <pre className="code">{`// Array — ขนาดคงที่
int a[5] = {3, 1, 4, 1, 5};
cout << a[0];      // 3

// Vector — ขนาดเปลี่ยนได้ (ใช้บ่อยกว่า)
#include <vector>
vector<int> v = {3, 1, 4};
v.push_back(5);    // เพิ่มท้าย
v.size();          // 4
v[2];              // 4`}</pre>

      <h3>6. Function</h3>
      <pre className="code">{`// return type, ชื่อ, parameter
int sum(int a, int b) {
  return a + b;
}

// pass by reference (& = แก้ค่าเดิมได้)
void doubleIt(int& x) {
  x *= 2;
}

int main() {
  int n = 5;
  doubleIt(n);     // n เป็น 10 แล้ว
  cout << sum(3, 4);
}`}</pre>

      <h3>7. คิดเป็น Algorithm</h3>
      <p style={{ color: 'var(--text-1)' }}>ก่อนเขียนโค้ด ลองตอบ 3 คำถามนี้:</p>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Input</b> — รับอะไรมา? type อะไร? ขนาดเท่าไหร่?</li>
        <li><b>Process</b> — ขั้นตอนอะไรบ้าง? เขียนเป็นภาษาไทยทีละ step ก่อน</li>
        <li><b>Output</b> — คืนอะไรกลับ? format ยังไง?</li>
      </ol>

      <div className="callout success">
        <div className="ttl">พร้อมแล้ว!</div>
        ถ้าเข้าใจทั้งหมดข้างบน ไปบทถัดไปได้เลย — <b>Algorithm คืออะไร</b> และ <b>Big-O</b>
      </div>

      <Quiz4 q={{
        question: "อะไรคือ <b>ไม่ใช่</b> ส่วนประกอบของ algorithm?",
        options: ["Input", "Process", "Output", "Comment"],
        answer: 3, explain: "Comment เป็นแค่คำอธิบายในโค้ด — ไม่ใช่ส่วนประกอบของ algorithm"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   03 — MASTER THEOREM (เนื้อหา)
============================================================ */
Lessons4["master-theorem"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Master Theorem — สูตรลัดแก้ Recurrence</div>
        ใช้เมื่อ recurrence อยู่ในรูป <b>T(n) = a·T(n/b) + O(n^d)</b> เช่น Merge Sort, Binary Search, Strassen
      </div>

      <h3>สูตรกลาง</h3>
      <div style={{ background: 'var(--bg-2)', padding: 18, borderRadius: 10, fontFamily: 'monospace', fontSize: 16, textAlign: 'center', margin: '12px 0', color: 'var(--accent-2)' }}>
        T(n) = a · T(n/b) + O(n<sup>d</sup>)
      </div>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>a</b> = จำนวน sub-problem (ต้อง ≥ 1)</li>
        <li><b>b</b> = หารปัญหาด้วยอะไร (ต้อง &gt; 1)</li>
        <li><b>d</b> = exponent ของงานรวม (combine work)</li>
      </ul>

      <h3>3 cases</h3>
      <table className="tbl">
        <thead><tr><th>เงื่อนไข</th><th>คำตอบ</th><th>สื่อความว่า</th></tr></thead>
        <tbody>
          <tr><td>d &lt; log<sub>b</sub>(a)</td><td>O(n<sup>log<sub>b</sub>a</sup>)</td><td>recursion ครอบงำ</td></tr>
          <tr><td>d = log<sub>b</sub>(a)</td><td>O(n<sup>d</sup> log n)</td><td>balanced</td></tr>
          <tr><td>d &gt; log<sub>b</sub>(a)</td><td>O(n<sup>d</sup>)</td><td>combine ครอบงำ</td></tr>
        </tbody>
      </table>

      <h3>ตัวอย่าง</h3>
      <table className="tbl">
        <thead><tr><th>Algorithm</th><th>Recurrence</th><th>a, b, d</th><th>log<sub>b</sub>a</th><th>Case</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>Merge Sort</td><td>2T(n/2) + n</td><td>2, 2, 1</td><td>1</td><td>2</td><td>O(n log n)</td></tr>
          <tr><td>Binary Search</td><td>T(n/2) + 1</td><td>1, 2, 0</td><td>0</td><td>2</td><td>O(log n)</td></tr>
          <tr><td>Strassen</td><td>7T(n/2) + n²</td><td>7, 2, 2</td><td>2.807</td><td>1</td><td>O(n^2.807)</td></tr>
          <tr><td>Karatsuba</td><td>3T(n/2) + n</td><td>3, 2, 1</td><td>1.585</td><td>1</td><td>O(n^1.585)</td></tr>
          <tr><td>Naive Matrix</td><td>8T(n/2) + n²</td><td>8, 2, 2</td><td>3</td><td>1</td><td>O(n³)</td></tr>
          <tr><td>findMax D&C</td><td>2T(n/2) + 1</td><td>2, 2, 0</td><td>1</td><td>1</td><td>O(n)</td></tr>
        </tbody>
      </table>

      <h3>วิธีจำง่าย ๆ</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>คำนวณ log<sub>b</sub>(a)</li>
        <li>เทียบกับ d</li>
        <li>เลือก case จากการเปรียบเทียบ</li>
      </ol>

      <div className="callout warn">
        <div className="ttl">⚠️ Master Theorem ใช้ไม่ได้เมื่อ</div>
        <ul style={{ margin: 0 }}>
          <li>T(n) = T(n−1) + ... (ลด n แบบ −1 ไม่ใช่ /b) → ใช้ substitution แทน</li>
          <li>recurrence ไม่ smooth (เช่น a, b เปลี่ยนตาม n)</li>
          <li>combine work ไม่ใช่ polynomial เช่น n log n</li>
        </ul>
      </div>

      <Quiz4 q={{
        question: "T(n) = 4T(n/2) + n² → คำตอบ?",
        options: ["O(n²)", "O(n² log n)", "O(n³)", "O(n^4)"],
        answer: 1, explain: "a=4, b=2, d=2 → log₂4 = 2 = d → Case 2 → O(n² log n)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   36 — MASTER THEOREM CALCULATOR
============================================================ */
Lessons4["master-calc"] = function () {
  const [a, setA] = useS4(2);
  const [b, setB] = useS4(2);
  const [d, setD] = useS4(1);

  const result = useM4(() => {
    if (a < 1 || b <= 1 || d < 0) return { error: 'a ≥ 1, b > 1, d ≥ 0 เท่านั้น' };
    const logBA = Math.log(a) / Math.log(b);
    const epsilon = 0.001;
    let caseNum, pretty, explain;
    if (d < logBA - epsilon) {
      caseNum = 1;
      const exp = logBA;
      if (Math.abs(exp - Math.round(exp)) < 0.01) {
        const r = Math.round(exp);
        pretty = r === 0 ? 'O(1)' : r === 1 ? 'O(n)' : r === 2 ? 'O(n²)' : r === 3 ? 'O(n³)' : `O(n^${r})`;
      } else pretty = `O(n^${exp.toFixed(3)})`;
      explain = `d (${d}) < log_${b}(${a}) = ${logBA.toFixed(3)} → recursion ครอบงำ`;
    } else if (Math.abs(d - logBA) < epsilon) {
      caseNum = 2;
      pretty = d === 0 ? 'O(log n)' : d === 1 ? 'O(n log n)' : `O(n^${d} log n)`;
      explain = `d (${d}) = log_${b}(${a}) = ${logBA.toFixed(3)} → balanced`;
    } else {
      caseNum = 3;
      pretty = d === 0 ? 'O(1)' : d === 1 ? 'O(n)' : d === 2 ? 'O(n²)' : d === 3 ? 'O(n³)' : `O(n^${d})`;
      explain = `d (${d}) > log_${b}(${a}) = ${logBA.toFixed(3)} → combine ครอบงำ`;
    }
    return { caseNum, pretty, explain, logBA: logBA.toFixed(3) };
  }, [a, b, d]);

  const presets = [
    { name: 'Merge Sort', a: 2, b: 2, d: 1 },
    { name: 'Binary Search', a: 1, b: 2, d: 0 },
    { name: 'Strassen', a: 7, b: 2, d: 2 },
    { name: 'Karatsuba', a: 3, b: 2, d: 1 },
    { name: 'Naive Matrix', a: 8, b: 2, d: 2 },
    { name: 'findMax DAC', a: 2, b: 2, d: 0 },
    { name: 'Quick Sort avg', a: 2, b: 2, d: 1 },
  ];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🧮 Master Theorem Calculator</div>
        ใส่ค่า a, b, d → ได้ T(n) ทันที พร้อมขั้นตอนการคิด
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 22, borderRadius: 12, margin: '14px 0', textAlign: 'center', fontFamily: 'monospace', fontSize: 18 }}>
        T(n) = <b style={{ color: 'var(--accent-2)' }}>{a}</b>·T(n / <b style={{ color: 'var(--accent-2)' }}>{b}</b>) + O(n<sup style={{ color: 'var(--accent-2)' }}>{d}</sup>)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>a (sub-problems) ≥ 1</div>
          <input type="number" min="1" value={a} onChange={e => setA(+e.target.value || 1)} style={{ width: '100%', padding: 8, fontSize: 16, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>b (divide by) &gt; 1</div>
          <input type="number" min="2" value={b} onChange={e => setB(+e.target.value || 2)} style={{ width: '100%', padding: 8, fontSize: 16, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>d (combine work n^d) ≥ 0</div>
          <input type="number" min="0" step="0.5" value={d} onChange={e => setD(+e.target.value)} style={{ width: '100%', padding: 8, fontSize: 16, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }} />
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {presets.map(p => (
          <button key={p.name} onClick={() => { setA(p.a); setB(p.b); setD(p.d); }}
            style={{ background: 'var(--bg-2)', color: 'var(--text-1)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            {p.name}
          </button>
        ))}
      </div>

      {result.error ? (
        <div className="callout warn" style={{ marginTop: 14 }}>{result.error}</div>
      ) : (
        <div style={{ marginTop: 18, background: 'var(--bg-2)', padding: 18, borderRadius: 10 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}><b>Step 1:</b> a = {a}, b = {b}, d = {d}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}><b>Step 2:</b> log<sub>{b}</sub>({a}) = {result.logBA}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}><b>Step 3:</b> เทียบ d ({d}) กับ log_b(a) ({result.logBA})</div>

          {[1, 2, 3].map(c => (
            <div key={c} style={{
              padding: 10, marginBottom: 6, borderRadius: 6,
              background: result.caseNum === c ? 'rgba(94,234,212,0.12)' : 'var(--bg-1)',
              border: result.caseNum === c ? '1px solid var(--accent-2)' : '1px solid transparent',
              opacity: result.caseNum === c ? 1 : 0.5
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}><b>Case {c}:</b> {c === 1 ? 'd < log_b(a) → O(n^log_b(a))' : c === 2 ? 'd = log_b(a) → O(n^d · log n)' : 'd > log_b(a) → O(n^d)'}</div>
              {result.caseNum === c && <div style={{ marginTop: 6, color: 'var(--accent-2)', fontSize: 13 }}>→ {result.explain} ✓</div>}
            </div>
          ))}

          <div style={{ marginTop: 14, padding: 16, background: 'var(--bg-1)', borderRadius: 8, fontSize: 24, fontFamily: 'monospace', textAlign: 'center', color: 'var(--accent-2)' }}>
            T(n) = {result.pretty}
          </div>
        </div>
      )}

      <h3>📊 Quick Reference</h3>
      <table className="tbl">
        <thead><tr><th>Recurrence</th><th>Case</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>2T(n/2) + 1</td><td>1</td><td>O(n)</td></tr>
          <tr><td>2T(n/2) + n</td><td>2</td><td>O(n log n)</td></tr>
          <tr><td>2T(n/2) + n²</td><td>3</td><td>O(n²)</td></tr>
          <tr><td>3T(n/2) + n</td><td>1</td><td>O(n^1.585)</td></tr>
          <tr><td>4T(n/2) + n²</td><td>2</td><td>O(n² log n)</td></tr>
          <tr><td>7T(n/2) + n²</td><td>1</td><td>O(n^2.807)</td></tr>
          <tr><td>T(n/2) + 1</td><td>2</td><td>O(log n)</td></tr>
        </tbody>
      </table>
    </React.Fragment>
  );
};

/* ============================================================
   37 — RECURRENCE SOLVER (substitution)
============================================================ */
Lessons4["recurrence-solver"] = function () {
  const PRESETS = [
    {
      label: "T(n) = T(n-1) + c",
      ans: "O(n)",
      steps: [
        "T(n) = T(n-1) + c",
        "    = T(n-2) + c + c = T(n-2) + 2c",
        "    = T(n-3) + 3c",
        "    = T(n-k) + k·c",
        "k = n: T(n) = T(0) + n·c = O(n)"
      ]
    },
    {
      label: "T(n) = T(n-1) + n",
      ans: "O(n²)",
      steps: [
        "T(n) = T(n-1) + n",
        "    = T(n-2) + (n-1) + n",
        "    = T(n-3) + (n-2) + (n-1) + n",
        "    = T(n-k) + Σ(n-k+1..n)",
        "k = n: T(n) = T(0) + (1+2+...+n) = n(n+1)/2 = O(n²)"
      ]
    },
    {
      label: "T(n) = 2T(n-1) + 1",
      ans: "O(2ⁿ)",
      steps: [
        "T(n) = 2T(n-1) + 1",
        "    = 2[2T(n-2) + 1] + 1 = 4T(n-2) + 2 + 1",
        "    = 8T(n-3) + 4 + 2 + 1",
        "    = 2^k · T(n-k) + (2^k - 1)",
        "k = n: T(n) = 2^n · T(0) + 2^n - 1 = O(2ⁿ)"
      ]
    },
    {
      label: "T(n) = T(n/2) + 1  (Binary Search)",
      ans: "O(log n)",
      steps: [
        "T(n) = T(n/2) + 1",
        "    = T(n/4) + 1 + 1",
        "    = T(n/8) + 1 + 1 + 1",
        "    = T(n/2^k) + k",
        "หยุดเมื่อ n/2^k = 1 → k = log₂n",
        "T(n) = T(1) + log n = O(log n)"
      ]
    },
    {
      label: "T(n) = T(n/2) + n",
      ans: "O(n)",
      steps: [
        "T(n) = T(n/2) + n",
        "    = T(n/4) + n/2 + n",
        "    = T(n/8) + n/4 + n/2 + n",
        "    = T(n/2^k) + n(1 + 1/2 + 1/4 + ... + 1/2^(k-1))",
        "geometric series → ≤ 2n",
        "T(n) = O(n)"
      ]
    },
    {
      label: "T(n) = 2T(n/2) + 1",
      ans: "O(n)",
      steps: [
        "T(n) = 2T(n/2) + 1",
        "    = 2[2T(n/4) + 1] + 1 = 4T(n/4) + 2 + 1",
        "    = 8T(n/8) + 4 + 2 + 1",
        "    = 2^k · T(n/2^k) + (2^k - 1)",
        "k = log n → 2^k = n",
        "T(n) = n·T(1) + n - 1 = O(n)"
      ]
    },
    {
      label: "T(n) = 2T(n/2) + n  (Merge Sort)",
      ans: "O(n log n)",
      steps: [
        "T(n) = 2T(n/2) + n",
        "    = 2[2T(n/4) + n/2] + n = 4T(n/4) + n + n",
        "    = 8T(n/8) + n + n + n",
        "    = 2^k · T(n/2^k) + k·n",
        "k = log n: T(n) = n·T(1) + n·log n = O(n log n)"
      ]
    },
    {
      label: "T(n) = 2T(n/2) + n²",
      ans: "O(n²)",
      steps: [
        "T(n) = 2T(n/2) + n²",
        "    = 2[2T(n/4) + n²/4] + n² = 4T(n/4) + n²/2 + n²",
        "    = 8T(n/8) + n²/4 + n²/2 + n²",
        "    = 2^k · T(n/2^k) + n²(1 + 1/2 + 1/4 + ...)",
        "geometric series → ≤ 2n²",
        "T(n) = O(n²)"
      ]
    },
    {
      label: "T(n) = T(n-1) + T(n-2) + 1  (Fibonacci)",
      ans: "O(2ⁿ) ≈ O(φⁿ)",
      steps: [
        "T(n) = T(n-1) + T(n-2) + 1",
        "ขอบบน: T(n) ≤ 2·T(n-1) + 1 → O(2ⁿ)",
        "ขอบล่าง: T(n) ≥ 2·T(n-2) → O(2^(n/2)) = O((√2)ⁿ)",
        "ค่าจริง: T(n) = Θ(φⁿ) เมื่อ φ = (1+√5)/2 ≈ 1.618"
      ]
    },
  ];

  const [picked, setPicked] = useS4(0);
  const cur = PRESETS[picked];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔁 Recurrence Solver — Substitution Method</div>
        สำหรับ recurrence ที่ Master Theorem ใช้ไม่ได้ — แทนค่าซ้ำ ๆ จนเห็น pattern
      </div>

      <h3>เลือก recurrence</h3>
      <select value={picked} onChange={e => setPicked(+e.target.value)}
        style={{ width: '100%', padding: 10, fontSize: 14, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'monospace' }}>
        {PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
      </select>

      <div style={{ marginTop: 18, background: 'var(--bg-2)', padding: 18, borderRadius: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>วิธีคิด step-by-step:</div>
        {cur.steps.map((s, i) => (
          <div key={i} style={{ padding: '6px 10px', marginBottom: 4, fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-1)', borderRadius: 6, borderLeft: '3px solid var(--accent-2)' }}>
            <span style={{ color: 'var(--text-2)', marginRight: 8 }}>{i + 1}.</span>
            <span style={{ color: 'var(--text-0)' }}>{s}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: 14, background: 'var(--bg-1)', borderRadius: 8, fontSize: 22, fontFamily: 'monospace', textAlign: 'center', color: 'var(--accent-2)' }}>
          T(n) = {cur.ans}
        </div>
      </div>

      <h3>เคล็ดในการแก้ recurrence</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>แทนค่าทีละชั้น</b> 2-3 ชั้น แล้วหา pattern</li>
        <li><b>เขียนเป็น T(n - k)</b> หรือ <b>T(n / 2^k)</b> + summation</li>
        <li><b>หา k</b> ที่ทำให้ถึง base case (T(0) หรือ T(1))</li>
        <li><b>คำนวณ summation</b> — ส่วนใหญ่เป็น arithmetic หรือ geometric</li>
      </ol>

      <h3>Summation ที่ต้องจำ</h3>
      <table className="tbl">
        <thead><tr><th>Summation</th><th>Closed form</th></tr></thead>
        <tbody>
          <tr><td>1 + 2 + 3 + ... + n</td><td>n(n+1)/2 = O(n²)</td></tr>
          <tr><td>1 + 2 + 4 + ... + 2ⁿ</td><td>2ⁿ⁺¹ − 1 = O(2ⁿ)</td></tr>
          <tr><td>1 + 1/2 + 1/4 + ... (geometric &lt; 1)</td><td>≤ 2 (constant)</td></tr>
          <tr><td>log 1 + log 2 + ... + log n</td><td>O(n log n)</td></tr>
          <tr><td>1² + 2² + ... + n²</td><td>n(n+1)(2n+1)/6 = O(n³)</td></tr>
        </tbody>
      </table>
    </React.Fragment>
  );
};

/* ============================================================
   37a — RECURRENCE EXERCISE BANK (24 ข้อ — practice mode)
   ที่มา: hw_1_tnrecursive (7) + เฉลย big o (3) + Master Theorem applications
============================================================ */
const RECURRENCE_BANK = [
  { id: 1, technique: 'sub-back', src: 'เฉลย big o Q13',
    q: 'T(n) = T(n−1) + c,  T(0) = 0',
    a: 'O(n)',
    steps: [
      'T(n) = T(n-1) + c',
      'T(n-1) = T(n-2) + c → T(n) = T(n-2) + 2c',
      'T(n-2) = T(n-3) + c → T(n) = T(n-3) + 3c',
      'Pattern: T(n) = T(n-k) + k·c',
      'หยุดเมื่อ n - k = 0 → k = n',
      'T(n) = T(0) + n·c = n·c → O(n)'
    ] },
  { id: 2, technique: 'sub-back', src: 'hw_1_tn Q1 / แบบฝึก 3 Q1',
    q: 'T(n) = T(n−1) + n,  T(0) = 1',
    a: 'O(n²)',
    steps: [
      'T(n) = T(n-1) + n',
      'T(n) = [T(n-2) + (n-1)] + n = T(n-2) + (n-1) + n',
      'T(n) = T(n-3) + (n-2) + (n-1) + n',
      'Pattern: T(n) = T(n-k) + Σ_{i=n-k+1}^{n} i',
      'k = n: T(n) = T(0) + (1 + 2 + ... + n) = 1 + n(n+1)/2',
      'T(n) = O(n²)'
    ] },
  { id: 3, technique: 'sub-back', src: 'hw_1_tn Q2',
    q: 'T(n) = 2T(n−1) + n,  T(0) = 1',
    a: 'O(2ⁿ)',
    steps: [
      'T(n) = 2T(n-1) + n',
      'T(n) = 2[2T(n-2) + (n-1)] + n = 4T(n-2) + 2(n-1) + n',
      'T(n) = 8T(n-3) + 4(n-2) + 2(n-1) + n',
      'Pattern: T(n) = 2^k · T(n-k) + Σ_{i=0}^{k-1} 2^i · (n - i)',
      'k = n: T(n) = 2^n · T(0) + polynomial term ≤ 2^n · (n+1)',
      'พจน์ 2^n ครอบงำ → T(n) = O(2ⁿ)'
    ] },
  { id: 4, technique: 'sub-back', src: 'เพิ่มเติม',
    q: 'T(n) = T(n−2) + 1,  T(0) = T(1) = 1',
    a: 'O(n)',
    steps: [
      'T(n) = T(n-2) + 1 = T(n-4) + 2 = T(n-6) + 3 = ...',
      'Pattern: T(n) = T(n - 2k) + k',
      'หยุดเมื่อ n - 2k = 0 (หรือ 1) → k = n/2',
      'T(n) = T(0) + n/2 ≈ n/2 → O(n)'
    ] },
  { id: 5, technique: 'sub-half', src: 'เฉลย big o Q14',
    q: 'T(n) = T(n/2) + c,  T(1) = 1',
    a: 'O(log n)',
    steps: [
      'T(n) = T(n/2) + c',
      'T(n) = T(n/4) + 2c = T(n/8) + 3c',
      'Pattern: T(n) = T(n/2^k) + k·c',
      'หยุดเมื่อ n/2^k = 1 → 2^k = n → k = log₂n',
      'T(n) = T(1) + c·log n = 1 + c·log n → O(log n)'
    ] },
  { id: 6, technique: 'sub-half', src: 'hw_1_tn Q3 / เฉลย big o Q15',
    q: 'T(n) = 2T(n/2) + c,  T(1) = 1',
    a: 'O(n)',
    steps: [
      'T(n) = 2T(n/2) + c',
      'T(n) = 2[2T(n/4) + c] + c = 4T(n/4) + 2c + c',
      'T(n) = 8T(n/8) + 4c + 2c + c',
      'Pattern: T(n) = 2^k · T(n/2^k) + c·(2^k - 1)',
      'k = log n → 2^k = n',
      'T(n) = n·T(1) + c·(n-1) = (1+c)n - c → O(n)'
    ] },
  { id: 7, technique: 'sub-half', src: 'hw_1_tn Q4 (Merge Sort)',
    q: 'T(n) = 2T(n/2) + n,  T(1) = 1',
    a: 'O(n log n)',
    steps: [
      'T(n) = 2T(n/2) + n',
      'T(n) = 2[2T(n/4) + n/2] + n = 4T(n/4) + n + n',
      'T(n) = 8T(n/8) + n + n + n',
      'Pattern: T(n) = 2^k · T(n/2^k) + k·n',
      'k = log n: T(n) = n·T(1) + n·log n → O(n log n)',
      '📌 นี่คือ Merge Sort recurrence'
    ] },
  { id: 8, technique: 'sub-half', src: 'hw_1_tn Q5',
    q: 'T(n) = 2T(n/2) + n²,  T(1) = 1',
    a: 'O(n²)',
    steps: [
      'T(n) = 2T(n/2) + n²',
      'T(n) = 2[2T(n/4) + n²/4] + n² = 4T(n/4) + n²/2 + n²',
      'T(n) = 8T(n/8) + n²/4 + n²/2 + n²',
      'Pattern: T(n) = 2^k · T(n/2^k) + n² · Σ (1/2)^i (geometric)',
      'Geometric sum ≤ 2 → T(n) ≤ 2n² + n·T(1) → O(n²)'
    ] },
  { id: 9, technique: 'sub-half', src: 'hw_1_tn Q6',
    q: 'T(n) = 27T(n/3) + n,  T(1) = 1',
    a: 'O(n³)',
    steps: [
      'T(n) = 27T(n/3) + n',
      'T(n) = 27[27T(n/9) + n/3] + n = 27² · T(n/9) + 9n + n',
      'Pattern: T(n) = 27^k · T(n/3^k) + n · Σ 9^i',
      'k = log₃n → 3^k = n → 27^k = n³',
      'T(n) = n³ · T(1) + n·(9^k - 1)/(9-1) ≈ n·9^k/8 = n · n^log₃9 /8 = n · n² /8 = n³/8',
      'T(n) = O(n³) — เพราะ n³·T(1) ครอบงำ'
    ] },
  { id: 10, technique: 'master-1', src: 'เพิ่มเติม (Master Case 1)',
    q: 'T(n) = 4T(n/2) + n',
    a: 'O(n²)',
    steps: [
      'a = 4, b = 2, d = 1',
      'log_b(a) = log₂4 = 2 > d = 1 → Case 1',
      'T(n) = O(n^log_b a) = O(n²)'
    ] },
  { id: 11, technique: 'master-2', src: 'Merge Sort (Master Case 2)',
    q: 'T(n) = 2T(n/2) + n  (Merge Sort)',
    a: 'O(n log n)',
    steps: [
      'a = 2, b = 2, d = 1',
      'log_b(a) = 1 = d → Case 2',
      'T(n) = O(n^d · log n) = O(n log n)'
    ] },
  { id: 12, technique: 'master-3', src: 'Master Case 3',
    q: 'T(n) = 2T(n/2) + n²',
    a: 'O(n²)',
    steps: [
      'a = 2, b = 2, d = 2',
      'log_b(a) = 1 < d = 2 → Case 3',
      'T(n) = O(n^d) = O(n²) — work dominated by combining step',
      'verify regularity: a·f(n/b) = 2·(n/2)² = n²/2 ≤ c·f(n) ✓ for c = 1/2'
    ] },
  { id: 13, technique: 'master-3', src: 'Strassen',
    q: 'T(n) = 7T(n/2) + n²  (Strassen)',
    a: 'O(n^log₂7) ≈ O(n^2.807)',
    steps: [
      'a = 7, b = 2, d = 2',
      'log_b(a) = log₂7 ≈ 2.807 > d = 2 → Case 1',
      'T(n) = O(n^log_b a) = O(n^log₂7) ≈ O(n^2.807)',
      '📌 ดีกว่า matrix multiplication ธรรมดา O(n³)'
    ] },
  { id: 14, technique: 'master-3', src: 'Matrix Mult DAC',
    q: 'T(n) = 8T(n/2) + n²  (Matrix Mult DAC ปกติ)',
    a: 'O(n³)',
    steps: [
      'a = 8, b = 2, d = 2',
      'log_b(a) = log₂8 = 3 > d = 2 → Case 1',
      'T(n) = O(n^log_b a) = O(n³)',
      '📌 ทำไม Matrix Mult DAC ปกติไม่ดีกว่า O(n³) — เพราะ a=8 ไม่ใช่ 7 (Strassen)'
    ] },
  { id: 15, technique: 'master-2', src: 'Master Case 2 with log',
    q: 'T(n) = 2T(n/2) + n log n',
    a: 'O(n log²n)',
    steps: [
      'f(n) = n log n = Θ(n · log^1 n)',
      'log_b(a) = 1, แต่ f(n) มี log factor → ต้องใช้ Master Generalized',
      'Case 2 with f(n) = Θ(n · log^k n) → T(n) = Θ(n · log^(k+1) n)',
      'ดังนั้น T(n) = Θ(n log² n)'
    ] },
  { id: 16, technique: 'tricky', src: 'เพิ่มเติม (tricky)',
    q: 'T(n) = T(√n) + 1,  T(2) = 1',
    a: 'O(log log n)',
    steps: [
      'Substitute n = 2^m → T(2^m) = T(2^(m/2)) + 1',
      'Let S(m) = T(2^m) → S(m) = S(m/2) + 1',
      'แก้ได้ S(m) = O(log m) (จาก case T(n/2) + 1)',
      'แทนกลับ m = log₂n → T(n) = O(log m) = O(log log n)'
    ] },
  { id: 17, technique: 'tricky', src: 'CLRS (asymmetric split)',
    q: 'T(n) = T(n/3) + T(2n/3) + n',
    a: 'O(n log n)',
    steps: [
      'Recursion tree: ทุก level ทำงานรวม n (เพราะ n/3 + 2n/3 = n)',
      'Tree height: ทาง deeper path คือ (2/3)^h·n = 1 → h = log_{3/2} n ≈ log n',
      'Total = n · log n = O(n log n)',
      '📌 มักออกใน CLRS — ไม่อยู่ใน Master Theorem ตรง ๆ'
    ] },
  { id: 18, technique: 'tricky', src: 'Fibonacci recursion',
    q: 'T(n) = T(n−1) + T(n−2) + 1,  T(0) = T(1) = 1',
    a: 'O(φⁿ) ≈ O(1.618ⁿ)',
    steps: [
      'Upper bound: T(n) ≤ 2T(n-1) + 1 → O(2ⁿ)',
      'Lower bound: T(n) ≥ 2T(n-2) → O(2^(n/2)) = O((√2)ⁿ)',
      'Exact: รากของ x² = x + 1 → φ = (1+√5)/2 ≈ 1.618',
      'T(n) = Θ(φⁿ) — Fibonacci grows as golden ratio',
      '📌 ทำไม Fibonacci recursive ช้า — ลด O(n) ด้วย memoization'
    ] },
  { id: 19, technique: 'tricky', src: 'เพิ่มเติม',
    q: 'T(n) = 2T(n/4) + √n',
    a: 'O(√n · log n)',
    steps: [
      'a = 2, b = 4, d = 1/2',
      'log_b(a) = log₄ 2 = 1/2 = d → Case 2',
      'T(n) = O(n^d · log n) = O(n^(1/2) · log n) = O(√n · log n)'
    ] },
  { id: 20, technique: 'tricky', src: 'BIGO Q15 — recompute without memo',
    q: `Recursive code:
long power(long x, long n) {
  if (n == 0) return 1;
  if (n == 1) return x;
  if ((n%2)==0)
    return power(x, n/2) * power(x, n/2);
  else
    return power(x, n/2) * power(x, n/2) * x;
}
หา T(n)`,
    a: 'O(n)',
    steps: [
      'Recurrence: T(n) = 2T(n/2) + c (2 recursive calls ไม่ memo)',
      'Master: a=2, b=2, d=0 → log_b a = 1 > 0 → Case 1',
      'T(n) = O(n^log_b a) = O(n)',
      '📌 ผิดพลาด: ถึงแม้ดูเหมือนแบ่งครึ่ง แต่ recompute 2 ครั้ง → ไม่ใช่ O(log n)',
      'แก้: เก็บผลใน variable → ใช้ 1 recursive call → T(n) = T(n/2) + c → O(log n)'
    ] },
  { id: 21, technique: 'rec-tree', src: 'CLRS recursion tree',
    q: 'T(n) = 3T(n/4) + n  — ใช้ recursion tree',
    a: 'O(n)',
    steps: [
      'Recursion tree:',
      'Level 0: 1 node, size n, work = n',
      'Level 1: 3 nodes, size n/4, work each = n/4 → total 3n/4',
      'Level 2: 9 nodes, size n/16, total = 9·n/16 = (9/16)·n',
      'Level k: 3^k nodes, work each n/4^k → total = (3/4)^k · n',
      'Sum: Σ (3/4)^k · n = n · 1/(1-3/4) = 4n  (geometric)',
      'T(n) = O(n) — leaves contribute O(n^log₄3) ≈ O(n^0.79) < O(n)'
    ] },
  { id: 22, technique: 'rec-tree', src: 'Tower of Hanoi',
    q: 'T(n) = 2T(n−1) + 1,  T(1) = 1  (Tower of Hanoi)',
    a: 'O(2ⁿ)',
    steps: [
      'Backward substitution:',
      'T(n) = 2T(n-1) + 1 = 2[2T(n-2) + 1] + 1 = 4T(n-2) + 2 + 1',
      'T(n) = 8T(n-3) + 4 + 2 + 1',
      'Pattern: T(n) = 2^k · T(n-k) + (2^k - 1)',
      'k = n-1: T(n) = 2^(n-1)·T(1) + 2^(n-1) - 1 = 2^n - 1',
      'T(n) = O(2ⁿ)'
    ] },
  { id: 23, technique: 'rec-tree', src: 'Quick Sort worst case',
    q: 'T(n) = T(n−1) + n  (Quick Sort worst case — bad pivot)',
    a: 'O(n²)',
    steps: [
      'Same as ID #2 — worst case ของ Quick Sort เมื่อ pivot แย่ที่สุด',
      'T(n) = T(n-1) + n → O(n²)',
      '📌 average case ของ Quick Sort = T(n) = 2T(n/2) + n = O(n log n)'
    ] },
  { id: 24, technique: 'rec-tree', src: 'BFPRT Median of Medians',
    q: 'T(n) = T(7n/10) + T(n/5) + n  (Median of Medians)',
    a: 'O(n)',
    steps: [
      'Recursion tree: work ที่ level k = (7/10 + 1/5)^k · n = (9/10)^k · n',
      'Sum: Σ (9/10)^k · n = n · 1/(1 - 9/10) = 10n  (geometric)',
      'T(n) = O(n)',
      '📌 ใช้ใน worst-case O(n) selection algorithm (Quick Select with deterministic pivot)'
    ] },
];

const RECURRENCE_TECHNIQUES = {
  'sub-back': { label: '⬅ Backward T(n-k)', color: 'var(--accent)' },
  'sub-half': { label: '⬇ Backward T(n/2^k)', color: 'var(--accent-2)' },
  'master-1': { label: '🎯 Master Case 1', color: 'var(--accent-3)' },
  'master-2': { label: '🎯 Master Case 2', color: 'var(--warn)' },
  'master-3': { label: '🎯 Master Case 3', color: 'var(--pink)' },
  'tricky': { label: '🧠 Tricky / non-standard', color: 'var(--danger)' },
  'rec-tree': { label: '🌳 Recursion tree', color: 'var(--success)' },
};

Lessons4["recurrence-bank"] = function () {
  const [tech, setTech] = useS4('all');
  const [show, setShow] = useS4({});
  const [score, setScore] = useS4({ right: 0, total: 0 });
  const toggle = (id, key) => setShow(s => ({ ...s, [`${id}-${key}`]: !s[`${id}-${key}`] }));
  const mark = (ok) => setScore(p => ({ right: p.right + (ok ? 1 : 0), total: p.total + 1 }));
  const list = tech === 'all' ? RECURRENCE_BANK : RECURRENCE_BANK.filter(e => e.technique === tech);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔁 Recurrence Bank — {RECURRENCE_BANK.length} ข้อ practice</div>
        ครอบคลุม: backward substitution (T(n-k), T(n/2^k)), <b>Master Theorem 3 cases</b>, recursion tree, tricky non-standard
        <br/>ที่มา: hw_1_tnrecursive (7), เฉลย big o (3), Master Theorem applications, CLRS classics
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        <button onClick={() => setTech('all')}
          style={{ background: tech === 'all' ? 'var(--accent)' : 'var(--bg-3)', color: tech === 'all' ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          🗂 ทั้งหมด ({RECURRENCE_BANK.length})
        </button>
        {Object.entries(RECURRENCE_TECHNIQUES).map(([k, v]) => {
          const count = RECURRENCE_BANK.filter(e => e.technique === k).length;
          return (
            <button key={k} onClick={() => setTech(k)}
              style={{ background: tech === k ? v.color : 'var(--bg-3)', color: tech === k ? '#000' : 'var(--text-1)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              {v.label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
        <b>คะแนน:</b> {score.right} / {score.total}
        {score.total > 0 && <span style={{ color: 'var(--text-2)', marginLeft: 8 }}>({Math.round(100 * score.right / score.total)}%)</span>}
        <button onClick={() => setScore({ right: 0, total: 0 })} style={{ marginLeft: 12, background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>↺ Reset</button>
      </div>

      {list.map(e => {
        const t = RECURRENCE_TECHNIQUES[e.technique];
        return (
          <div key={e.id} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>Q{e.id}.</span>
              <span style={{ fontSize: 11, padding: '2px 8px', background: t.color, color: '#000', borderRadius: 999 }}>{t.label}</span>
              <span style={{ fontSize: 11, color: 'var(--text-2)' }}>📄 {e.src}</span>
            </div>
            <pre className="code" style={{ background: '#0a0e14', padding: 10, borderRadius: 4, fontSize: 13, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{e.q}</pre>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              <button onClick={() => toggle(e.id, 'a')}
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ✓ {show[`${e.id}-a`] ? 'Hide' : 'Show'} Answer + Steps
              </button>
              <button onClick={() => mark(true)}
                style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ✅ ฉันตอบถูก
              </button>
              <button onClick={() => mark(false)}
                style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid #f87171', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                ❌ ตอบผิด
              </button>
            </div>
            {show[`${e.id}-a`] && (
              <div style={{ padding: 10, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981', borderRadius: 4, fontSize: 13, lineHeight: 1.7 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--accent-2)', marginBottom: 6 }}>T(n) = {e.a}</div>
                {e.steps.map((s, i) => (
                  <div key={i} style={{ padding: '4px 8px', marginBottom: 3, fontFamily: 'monospace', fontSize: 12, background: 'var(--bg-1)', borderRadius: 4 }}>
                    <span style={{ color: 'var(--text-2)', marginRight: 6 }}>{i + 1}.</span>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 20, padding: 14, background: 'var(--bg-2)', borderRadius: 10, fontSize: 13 }}>
        <b style={{ color: 'var(--accent)' }}>💡 Decision Tree ในการเลือกเทคนิค</b>
        <pre style={{ marginTop: 6, fontSize: 12, color: 'var(--text-1)', lineHeight: 1.6 }}>{`Recurrence รูป ?
├── T(n) = aT(n/b) + n^d  → ใช้ Master Theorem
│     ├── log_b(a) > d  → O(n^log_b a)        [Case 1]
│     ├── log_b(a) = d  → O(n^d · log n)      [Case 2]
│     └── log_b(a) < d  → O(n^d)              [Case 3]
├── T(n) = T(n-k) + f(n)  → Backward sub ⟹ Σf(n)
├── T(n) = T(√n) + c     → substitute m = log n
├── T(n) = T(αn) + T(βn) + n  (α+β < 1)  → recursion tree
└── ไม่เข้ารูปใดเลย         → ใช้ recursion tree / forward sub`}</pre>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   41 — GLOSSARY
============================================================ */
const GLOSSARY = [
  { term: "Algorithm", def: "ขั้นตอนการแก้ปัญหาที่ชัดเจน มี input → process → output", cat: "พื้นฐาน" },
  { term: "Big-O", def: "สัญลักษณ์บอก upper bound ของเวลาทำงาน เมื่อ n → ∞", cat: "พื้นฐาน" },
  { term: "Big-Omega (Ω)", def: "lower bound — เร็วอย่างน้อยเท่าไร", cat: "พื้นฐาน" },
  { term: "Big-Theta (Θ)", def: "tight bound — เร็วเท่ากับขอบบนและล่าง", cat: "พื้นฐาน" },
  { term: "Best/Average/Worst case", def: "input ที่ดี/เฉลี่ย/แย่ที่สุด ที่ทำให้ algorithm เร็ว/ช้าต่างกัน", cat: "พื้นฐาน" },
  { term: "Recurrence Relation", def: "สมการที่ T(n) นิยามด้วย T ของ n ที่เล็กกว่า เช่น T(n) = 2T(n/2) + n", cat: "พื้นฐาน" },
  { term: "Master Theorem", def: "สูตรลัดแก้ recurrence รูป T(n) = a·T(n/b) + O(n^d)", cat: "พื้นฐาน" },
  { term: "Substitution Method", def: "วิธีแก้ recurrence โดยแทนค่าซ้ำ ๆ จนเห็น pattern", cat: "พื้นฐาน" },

  { term: "Linear Search", def: "ค้นหาทีละช่อง O(n)", cat: "Search" },
  { term: "Binary Search", def: "แบ่งครึ่งทุกครั้ง O(log n) ต้องเรียงข้อมูลก่อน", cat: "Search" },
  { term: "Interpolation Search", def: "ประมาณตำแหน่งจากค่า O(log log n) เมื่อข้อมูลกระจายสม่ำเสมอ", cat: "Search" },

  { term: "Bubble Sort", def: "เปรียบเทียบทีละคู่ ดันตัวมากไปขวา O(n²)", cat: "Sort" },
  { term: "Selection Sort", def: "หาตัวน้อยสุดสลับมาด้านหน้า O(n²)", cat: "Sort" },
  { term: "Insertion Sort", def: "แทรกในตำแหน่งที่ถูก เหมือนเรียงไพ่ O(n²) แต่ best O(n)", cat: "Sort" },
  { term: "Merge Sort", def: "Divide & Conquer แบ่งครึ่งแล้ว merge O(n log n) เสถียร", cat: "Sort" },
  { term: "Quick Sort", def: "เลือก pivot แบ่งสองข้าง O(n log n) เฉลี่ย worst O(n²)", cat: "Sort" },
  { term: "Heap Sort", def: "ใช้ max-heap O(n log n) in-place ไม่เสถียร", cat: "Sort" },
  { term: "Stable Sort", def: "ถ้ามีค่าเท่ากัน 2 ตัว ลำดับเดิมคงไว้", cat: "Sort" },
  { term: "In-place", def: "ใช้พื้นที่เพิ่ม O(1) ไม่ต้องสร้าง array ใหม่", cat: "Sort" },

  { term: "Stack", def: "LIFO — Last In First Out ใช้ใน recursion, undo, parser", cat: "DS" },
  { term: "Queue", def: "FIFO — First In First Out ใช้ใน BFS, scheduling", cat: "DS" },
  { term: "Linked List", def: "node มี pointer ชี้ next — insert/delete O(1) แต่ access O(n)", cat: "DS" },
  { term: "Hash Table", def: "เก็บคู่ key-value โดยใช้ hash function — เฉลี่ย O(1)", cat: "DS" },
  { term: "Collision", def: "เมื่อ hash function map คนละ key ไปช่องเดียว — แก้ด้วย chaining/open addressing", cat: "DS" },
  { term: "Binary Tree", def: "ต้นไม้ที่แต่ละ node มีลูกได้สูงสุด 2", cat: "DS" },
  { term: "Binary Search Tree (BST)", def: "Binary tree ที่ left < root < right — search O(log n) เฉลี่ย", cat: "DS" },
  { term: "Heap", def: "complete binary tree ที่ parent ≥ (หรือ ≤) ลูก — root คือ max/min", cat: "DS" },
  { term: "Priority Queue", def: "queue ที่ pop ตัวสำคัญสุดก่อน — implement ด้วย heap", cat: "DS" },

  { term: "Divide & Conquer", def: "แบ่งปัญหาครึ่ง → แก้ → รวม — Merge sort, Quick sort, Binary search", cat: "Paradigm" },
  { term: "Greedy", def: "เลือก local optimum ทุก step โดยไม่ย้อนแก้", cat: "Paradigm" },
  { term: "Dynamic Programming (DP)", def: "Recursion + memoization — แก้ overlapping sub-problems", cat: "Paradigm" },
  { term: "Memoization", def: "เก็บคำตอบของ sub-problem ไว้ใช้ซ้ำ — top-down DP", cat: "Paradigm" },
  { term: "Tabulation", def: "DP แบบ bottom-up เติมตารางจากเล็กไปใหญ่", cat: "Paradigm" },
  { term: "Optimal Substructure", def: "คำตอบของปัญหาประกอบจากคำตอบ sub-problem", cat: "Paradigm" },
  { term: "Overlapping Sub-problems", def: "sub-problem เดียวกันถูกคำนวณซ้ำ → ใช้ DP", cat: "Paradigm" },
  { term: "Greedy Choice Property", def: "เลือก local optimum แล้วยังนำไปสู่ global optimum", cat: "Paradigm" },
  { term: "Backtracking", def: "DFS ในต้นไม้คำตอบ + ตัดกิ่งที่ไม่ valid", cat: "Paradigm" },
  { term: "Pruning", def: "ตัดกิ่งของ search tree ที่รู้ว่าไม่นำไปสู่คำตอบ", cat: "Paradigm" },
  { term: "Exhaustive Search", def: "Brute force — ลองทุกความเป็นไปได้", cat: "Paradigm" },

  { term: "Graph", def: "G = (V, E) — vertex + edge", cat: "Graph" },
  { term: "Directed Graph", def: "edge มีทิศทาง", cat: "Graph" },
  { term: "Undirected Graph", def: "edge ไม่มีทิศทาง — สองทาง", cat: "Graph" },
  { term: "Weighted Graph", def: "edge มีน้ำหนัก/cost", cat: "Graph" },
  { term: "DAG", def: "Directed Acyclic Graph — ไม่มีวงวน → topological sort ได้", cat: "Graph" },
  { term: "Adjacency Matrix", def: "เก็บกราฟใน 2D array — O(V²) space — เหมาะ dense", cat: "Graph" },
  { term: "Adjacency List", def: "เก็บกราฟใน array of list — O(V+E) space — เหมาะ sparse", cat: "Graph" },
  { term: "BFS", def: "Breadth-First Search — เดินระดับต่อระดับ ใช้ queue", cat: "Graph" },
  { term: "DFS", def: "Depth-First Search — เดินลึกก่อน ใช้ stack/recursion", cat: "Graph" },
  { term: "Cycle Detection", def: "ตรวจวงวน — DAG ใช้ DFS + recStack", cat: "Graph" },
  { term: "Topological Sort", def: "เรียง DAG ให้ทุก edge u→v มี u อยู่ก่อน v", cat: "Graph" },
  { term: "Shortest Path", def: "เส้นทางสั้นสุด — Dijkstra (no negative), Bellman-Ford (มี negative)", cat: "Graph" },
  { term: "Dijkstra", def: "shortest path 1 source → all — ใช้ min-heap O((V+E)log V)", cat: "Graph" },
  { term: "MST", def: "Minimum Spanning Tree — Prim, Kruskal", cat: "Graph" },

  { term: "Recursion", def: "ฟังก์ชันที่เรียกตัวเอง — ต้องมี base case + recursive case", cat: "Recursion" },
  { term: "Base Case", def: "เคสที่หยุด recursion — ตอบทันทีไม่เรียกตัวเอง", cat: "Recursion" },
  { term: "Tail Recursion", def: "การเรียก recursive เป็นคำสั่งสุดท้าย — compiler optimize เป็น loop ได้", cat: "Recursion" },
  { term: "Stack Overflow", def: "เรียก recursion ลึกเกินไป จน stack เต็ม", cat: "Recursion" },

  { term: "Strassen", def: "matrix mult ลด 8 → 7 → O(n^2.807)", cat: "Advanced" },
  { term: "Karatsuba", def: "คูณเลขใหญ่ลด 4 → 3 → O(n^1.585)", cat: "Advanced" },
  { term: "Floyd-Warshall", def: "all-pairs shortest path O(V³)", cat: "Advanced" },
  { term: "Quick Select", def: "หา kth smallest โดยไม่ sort O(n) เฉลี่ย", cat: "Advanced" },
  { term: "0/1 Knapsack", def: "หยิบหรือไม่หยิบ — DP O(nW)", cat: "Advanced" },
  { term: "Fractional Knapsack", def: "หั่นได้ — Greedy เรียง v/w O(n log n)", cat: "Advanced" },
  { term: "N-Queens", def: "วาง queen N ตัวไม่ให้กินกัน — backtracking", cat: "Advanced" },
  { term: "Activity Selection", def: "เลือก activity ที่ไม่ทับกัน — Greedy เรียงตาม finish time", cat: "Advanced" },
];

Lessons4["glossary"] = function () {
  const [q, setQ] = useS4("");
  const [cat, setCat] = useS4("ทั้งหมด");
  const cats = ["ทั้งหมด", ...Array.from(new Set(GLOSSARY.map(g => g.cat)))];
  const filtered = GLOSSARY.filter(g =>
    (cat === "ทั้งหมด" || g.cat === cat) &&
    (q === "" || g.term.toLowerCase().includes(q.toLowerCase()) || g.def.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📖 Glossary — ศัพท์เทคนิคทั้งหมด</div>
        ค้นหาได้ทั้งคำและความหมาย — รวม {GLOSSARY.length} คำ
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '14px 0', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="🔍 ค้นหา..."
          value={q} onChange={e => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 10, fontSize: 14, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }}
        />
        <select value={cat} onChange={e => setCat(e.target.value)}
          style={{ padding: 10, fontSize: 14, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {filtered.map(g => (
          <div key={g.term} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 8, borderLeft: '3px solid var(--accent-2)' }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.04em' }}>{g.cat.toUpperCase()}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-0)', margin: '4px 0' }}>{g.term}</div>
            <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{g.def}</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="callout warn" style={{ marginTop: 14 }}>ไม่พบคำที่ค้นหา</div>
      )}
    </React.Fragment>
  );
};

/* ============================================================
   42 — CONCEPT MAP
============================================================ */
Lessons4["concept-map"] = function () {
  const NODES = [
    { id: 'foundations', label: 'Foundations', x: 100, y: 50, color: '#94a3b8' },
    { id: 'big-o', label: 'Big-O', x: 280, y: 50, color: '#94a3b8' },
    { id: 'recursion', label: 'Recursion', x: 460, y: 50, color: '#94a3b8' },
    { id: 'master-theorem', label: 'Master\nTheorem', x: 640, y: 50, color: '#94a3b8' },

    { id: 'linear-search', label: 'Linear\nSearch', x: 100, y: 170, color: '#5eead4' },
    { id: 'binary-search', label: 'Binary\nSearch', x: 240, y: 170, color: '#5eead4' },
    { id: 'bubble-sort', label: 'Bubble', x: 380, y: 170, color: '#fbbf24' },
    { id: 'selection-sort', label: 'Selection', x: 500, y: 170, color: '#fbbf24' },
    { id: 'insertion-sort', label: 'Insertion', x: 620, y: 170, color: '#fbbf24' },

    { id: 'merge-sort', label: 'Merge\nSort', x: 100, y: 290, color: '#a78bfa' },
    { id: 'quick-sort', label: 'Quick\nSort', x: 240, y: 290, color: '#a78bfa' },
    { id: 'heap-sort', label: 'Heap\nSort', x: 380, y: 290, color: '#fbbf24' },
    { id: 'quick-select', label: 'Quick\nSelect', x: 520, y: 290, color: '#a78bfa' },
    { id: 'strassen', label: 'Strassen', x: 660, y: 290, color: '#a78bfa' },

    { id: 'stack', label: 'Stack', x: 60, y: 410, color: '#60a5fa' },
    { id: 'queue', label: 'Queue', x: 170, y: 410, color: '#60a5fa' },
    { id: 'tree-basic', label: 'Tree', x: 280, y: 410, color: '#60a5fa' },
    { id: 'bst', label: 'BST', x: 380, y: 410, color: '#60a5fa' },
    { id: 'hashing', label: 'Hash', x: 480, y: 410, color: '#60a5fa' },
    { id: 'graph-rep', label: 'Graph\nRep', x: 600, y: 410, color: '#60a5fa' },

    { id: 'bfs', label: 'BFS', x: 60, y: 530, color: '#f472b6' },
    { id: 'dfs', label: 'DFS', x: 170, y: 530, color: '#f472b6' },
    { id: 'cycle-detect', label: 'Cycle\nDetect', x: 290, y: 530, color: '#f472b6' },
    { id: 'topo-sort', label: 'Topo\nSort', x: 420, y: 530, color: '#f472b6' },
    { id: 'dijkstra', label: 'Dijkstra', x: 550, y: 530, color: '#f472b6' },

    { id: 'exhaustive', label: 'Exhaustive', x: 60, y: 650, color: '#f87171' },
    { id: 'backtracking', label: 'Back-\ntracking', x: 200, y: 650, color: '#f87171' },
    { id: 'greedy', label: 'Greedy', x: 340, y: 650, color: '#f87171' },
    { id: 'dp', label: 'DP', x: 460, y: 650, color: '#f87171' },
  ];

  const EDGES = [
    ['foundations', 'big-o'], ['big-o', 'recursion'], ['recursion', 'master-theorem'],
    ['big-o', 'linear-search'], ['big-o', 'binary-search'], ['big-o', 'bubble-sort'], ['big-o', 'selection-sort'], ['big-o', 'insertion-sort'],
    ['recursion', 'merge-sort'], ['recursion', 'quick-sort'], ['merge-sort', 'master-theorem'],
    ['quick-sort', 'quick-select'], ['merge-sort', 'strassen'], ['recursion', 'heap-sort'],
    ['stack', 'queue'], ['queue', 'bfs'], ['stack', 'dfs'],
    ['tree-basic', 'bst'], ['tree-basic', 'heap-sort'],
    ['graph-rep', 'bfs'], ['graph-rep', 'dfs'],
    ['dfs', 'cycle-detect'], ['dfs', 'topo-sort'], ['dfs', 'backtracking'],
    ['recursion', 'exhaustive'], ['exhaustive', 'backtracking'],
    ['greedy', 'dp'], ['recursion', 'dp'],
  ];

  const findNode = id => NODES.find(n => n.id === id);
  const [hover, setHover] = useS4(null);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🗺️ Concept Map — ภาพรวมหลักสูตร</div>
        เห็นความสัมพันธ์ระหว่างหัวข้อทั้งหมด — คลิกที่ node เพื่อไปหน้านั้น
      </div>

      <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12, fontSize: 13, color: 'var(--text-2)' }}>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#94a3b8', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>พื้นฐาน</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#5eead4', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>Search</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#fbbf24', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>Sort พื้นฐาน</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#a78bfa', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>D&C</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#60a5fa', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>Data Struct</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#f472b6', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>Graph</span>
        <span><span style={{ display: 'inline-block', width: 14, height: 14, background: '#f87171', borderRadius: 3, marginRight: 6, verticalAlign: 'middle' }}></span>Paradigm</span>
      </div>

      <div style={{ background: 'var(--bg-1)', borderRadius: 12, padding: 12, overflowX: 'auto' }}>
        <svg width="780" height="720" style={{ minWidth: 780 }}>
          {EDGES.map(([from, to], i) => {
            const a = findNode(from), b = findNode(to);
            if (!a || !b) return null;
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(148,163,184,0.3)" strokeWidth="1.5" />;
          })}
          {NODES.map(n => (
            <g key={n.id} style={{ cursor: 'pointer' }}
              onClick={() => { window.location.hash = '/' + n.id; window.scrollTo(0, 0); }}
              onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
              <rect x={n.x - 50} y={n.y - 22} width="100" height="44" rx="8"
                fill={hover === n.id ? n.color : 'var(--bg-2)'}
                stroke={n.color} strokeWidth={hover === n.id ? 3 : 2} />
              {n.label.split('\n').map((line, i, arr) => (
                <text key={i} x={n.x} y={n.y + (i - (arr.length - 1) / 2) * 14 + 4} textAnchor="middle"
                  fill={hover === n.id ? '#000' : 'var(--text-0)'} fontSize="12" fontWeight="600">
                  {line}
                </text>
              ))}
            </g>
          ))}
        </svg>
      </div>

      <h3>📚 ลำดับการเรียนแนะนำ</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>รากฐาน:</b> Foundations → Big-O → Recursion → Master Theorem</li>
        <li><b>Search & Sort:</b> Linear/Binary → Bubble/Selection/Insertion → Merge/Quick/Heap</li>
        <li><b>Data Structure:</b> Stack → Queue → Linked List → Hash → Tree → BST</li>
        <li><b>D&C ขั้นสูง:</b> Quick Select → Matrix Mult → Strassen</li>
        <li><b>Graph:</b> Graph Rep → BFS → DFS → Cycle → Topo Sort → Dijkstra</li>
        <li><b>Paradigm:</b> Exhaustive → Backtracking → Greedy → DP</li>
        <li><b>เตรียมสอบ:</b> Pattern Trainer → Master Calc → Mock Exam</li>
      </ol>
    </React.Fragment>
  );
};

window.LessonsPart4 = Lessons4;
