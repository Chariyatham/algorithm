/* Lesson content — Thai explanations with embedded visualizers */
/* Each lesson exports a React component as window.Lessons[id] */

const { useState: useStateLC, useMemo: useMemoLC, useEffect: useEffectLC } = React;
const { SortLessonViz, SearchLessonViz, Quiz, DragOrder } = window.LessonComponents;
const { StackViz, QueueViz, LinkedListViz, HashViz, TreeViz, TraversalViz, GraphViz, FibDPViz } = window.DSVisualizers;

const Lessons = {};

// ============ 01: What is Algorithm ============
Lessons["what-is-algo"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">เป้าหมาย</div>
        เข้าใจว่าอัลกอริทึมคืออะไร คุณสมบัติที่ดี และทำไมเราต้องเรียน
      </div>
      <h3>นิยาม</h3>
      <p>
        <b>Algorithm (อัลกอริทึม)</b> คือ ลำดับขั้นตอน (steps) ที่ชัดเจนและจำกัดจำนวน
        ใช้สำหรับแก้ปัญหาหรือคำนวณผลลัพธ์ที่ต้องการ
      </p>
      <p>
        ลองนึกถึง "สูตรอาหาร" — มี <b>ขั้นตอน</b> ที่ต้องทำตามลำดับ มี <b>วัตถุดิบ (input)</b> และให้ <b>ผลลัพธ์ (output)</b>
      </p>

      <h3>คุณสมบัติของอัลกอริทึมที่ดี</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Input</b> — รับข้อมูลเข้า 0 ตัวขึ้นไป</li>
        <li><b>Output</b> — ให้ผลลัพธ์อย่างน้อย 1 ตัว</li>
        <li><b>Definiteness</b> — แต่ละขั้นตอนต้องชัดเจน ไม่กำกวม</li>
        <li><b>Finiteness</b> — ต้องสิ้นสุดในขั้นตอนจำกัด</li>
        <li><b>Effectiveness</b> — แต่ละขั้นตอนทำได้จริง พื้นฐานพอ</li>
      </ol>

      <h3>ตัวอย่างง่าย ๆ: หาค่ามากที่สุดในอาเรย์</h3>
      <CodeBlock code={[
        "int findMax(int a[], int n) {",
        "  int max = a[0];",
        "  for (int i = 1; i < n; i++) {",
        "    if (a[i] > max)",
        "      max = a[i];",
        "  }",
        "  return max;",
        "}",
      ]} />

      <div className="callout tip">
        <div className="ttl">ทำไมต้องเรียน?</div>
        อัลกอริทึมที่ดีกว่าทำให้โปรแกรมเร็วกว่าเป็น <b>ล้านเท่า</b> เมื่อข้อมูลใหญ่ขึ้น
        เช่น ค้นหาในข้อมูล 1,000,000 ตัว: Linear Search ใช้ ~1,000,000 ครั้ง แต่ Binary Search ใช้แค่ ~20 ครั้ง!
      </div>

      <Quiz
        q="ข้อใด ไม่ใช่ คุณสมบัติของอัลกอริทึมที่ดี?"
        options={[
          "ต้องสิ้นสุดในจำนวนขั้นจำกัด",
          "แต่ละขั้นตอนต้องชัดเจน ไม่กำกวม",
          "ต้องใช้ภาษา C เท่านั้น",
          "ต้องให้ผลลัพธ์อย่างน้อย 1 ตัว"
        ]}
        answer={2}
        explain="อัลกอริทึมเป็นแนวคิดที่ไม่ขึ้นกับภาษาโปรแกรม สามารถเขียนเป็น Pseudocode, ภาษาธรรมชาติ หรือภาษาโปรแกรมใดก็ได้"
      />
    </React.Fragment>
  );
};

// ============ 02: Big-O ============
Lessons["big-o"] = function () {
  const [n, setN] = useStateLC(20);
  const data = [
    { name: "O(1)", val: 1, color: "var(--accent-3)" },
    { name: "O(log n)", val: Math.log2(n), color: "var(--accent)" },
    { name: "O(n)", val: n, color: "var(--accent-2)" },
    { name: "O(n log n)", val: n * Math.log2(n), color: "var(--warn)" },
    { name: "O(n²)", val: n * n, color: "var(--pink)" },
    { name: "O(2ⁿ)", val: Math.pow(2, Math.min(n, 20)), color: "var(--danger)" },
  ];
  const max = Math.max(...data.map(d => d.val));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">เป้าหมาย</div>
        วิเคราะห์ "ความซับซ้อนของเวลา" (Time Complexity) ของอัลกอริทึม เพื่อรู้ว่าตัวไหนเร็วกว่ากันเมื่อข้อมูลใหญ่
      </div>

      <h3>Big-O คืออะไร?</h3>
      <p>
        <b>Big-O Notation</b> คือ การอธิบายว่าอัลกอริทึม "เติบโต" (grow) อย่างไรเมื่อ input ใหญ่ขึ้น
        เราสนใจว่า "เวลาที่ใช้" หรือ "หน่วยความจำที่ใช้" เป็นฟังก์ชันของขนาด input <span className="kbd">n</span>
      </p>

      <h3>Visual: เปรียบเทียบการเติบโต (n = {n})</h3>
      <div className="viz">
        <div className="viz-toolbar">
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>n =</span>
          <input type="range" className="slider" min="5" max="50" value={n} onChange={e => setN(parseInt(e.target.value))} style={{ width: 200 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{n}</span>
        </div>
        <div className="viz-stage" style={{ padding: '20px 24px' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, fontFamily: 'var(--mono)', fontSize: 12, color: d.color }}>{d.name}</div>
                <div style={{ flex: 1, height: 24, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${Math.min(100, (d.val / max) * 100)}%`,
                    height: '100%',
                    background: d.color,
                    transition: 'width 0.3s',
                    borderRadius: 4,
                  }} />
                </div>
                <div style={{ width: 90, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-1)' }}>
                  {d.val < 1000 ? Math.round(d.val) : d.val.toExponential(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3>ตารางเปรียบเทียบ</h3>
      <table className="cmp">
        <thead>
          <tr><th>ความซับซ้อน</th><th>ชื่อ</th><th>ตัวอย่าง</th><th>n=10</th><th>n=1,000</th></tr>
        </thead>
        <tbody>
          <tr><td className="mono">O(1)</td><td>Constant</td><td>การเข้าถึง array[i]</td><td className="mono">1</td><td className="mono">1</td></tr>
          <tr><td className="mono">O(log n)</td><td>Logarithmic</td><td>Binary Search</td><td className="mono">~3</td><td className="mono">~10</td></tr>
          <tr><td className="mono">O(n)</td><td>Linear</td><td>Linear Search</td><td className="mono">10</td><td className="mono">1,000</td></tr>
          <tr><td className="mono">O(n log n)</td><td>Linearithmic</td><td>Merge Sort</td><td className="mono">~33</td><td className="mono">~10,000</td></tr>
          <tr><td className="mono">O(n²)</td><td>Quadratic</td><td>Bubble Sort</td><td className="mono">100</td><td className="mono">1,000,000</td></tr>
          <tr><td className="mono">O(2ⁿ)</td><td>Exponential</td><td>Recursive Fibonacci</td><td className="mono">1,024</td><td className="mono">~10³⁰⁰</td></tr>
        </tbody>
      </table>

      <h3>กฎพื้นฐาน 3 ข้อ</h3>
      <div className="callout tip">
        <div className="ttl">1. ตัด Constant</div>
        <span style={{ fontFamily: 'var(--mono)' }}>O(2n) → O(n)</span>, <span style={{ fontFamily: 'var(--mono)' }}>O(100) → O(1)</span>
      </div>
      <div className="callout tip">
        <div className="ttl">2. เก็บแค่พจน์ที่โตเร็วที่สุด</div>
        <span style={{ fontFamily: 'var(--mono)' }}>O(n² + n) → O(n²)</span>
      </div>
      <div className="callout tip">
        <div className="ttl">3. Loop ซ้อนกัน = คูณกัน</div>
        <span style={{ fontFamily: 'var(--mono)' }}>for i: for j: → O(n × n) = O(n²)</span>
      </div>

      <h3>ลองวิเคราะห์โค้ดนี้</h3>
      <pre className="code-block">
        <code>{`for (int i = 0; i < n; i++) {
  for (int j = 0; j < n; j++) {
    sum += a[i] * b[j];
  }
}`}</code>
      </pre>

      <Quiz
        q="โค้ดข้างบนมี time complexity เท่าใด?"
        options={[
          "O(n)",
          "O(n²)",
          "O(n log n)",
          "O(log n)"
        ]}
        answer={1}
        explain="มี loop ซ้อน 2 ชั้น (i และ j) แต่ละ loop วน n ครั้ง รวมเป็น n × n = O(n²) — ตัวอย่างนี้คือพื้นฐานของ Bubble Sort นั่นเอง"
      />
    </React.Fragment>
  );
};

// ============ 03: Linear Search ============
Lessons["linear-search"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">เป้าหมาย</div>
        เข้าใจการค้นหาแบบ Linear Search ที่ดูทีละช่องตั้งแต่ต้นจนจบ
      </div>
      <h3>หลักการ</h3>
      <p>เริ่มจากช่องแรก ตรวจสอบทีละช่องว่าตรงกับค่าที่ต้องการหรือไม่ ถ้าเจอ → คืนตำแหน่ง ถ้าจนจบไม่เจอ → คืน -1</p>

      <h3>Animation</h3>
      <SearchLessonViz algoKey="linear" defaultArr={[34, 12, 87, 5, 56, 19, 73, 41]} target={56} />

      <h3>วิเคราะห์ความซับซ้อน</h3>
      <table className="cmp">
        <thead><tr><th>กรณี</th><th>Time</th><th>เมื่อไหร่?</th></tr></thead>
        <tbody>
          <tr><td>Best</td><td className="mono">O(1)</td><td>ค่าอยู่ตำแหน่งแรก</td></tr>
          <tr><td>Average</td><td className="mono">O(n)</td><td>ค่าอยู่กลาง ๆ</td></tr>
          <tr><td>Worst</td><td className="mono">O(n)</td><td>ค่าอยู่ตำแหน่งสุดท้าย / ไม่เจอ</td></tr>
        </tbody>
      </table>

      <div className="callout tip">
        <div className="ttl">ใช้เมื่อไหร่?</div>
        เมื่อข้อมูล <b>ไม่ได้เรียง</b> (unsorted) หรือข้อมูลน้อยมาก ๆ — ง่ายและเขียนเร็ว
      </div>

      <Quiz
        q="ถ้ามีข้อมูล 1,000,000 ตัว และค่าที่หาอยู่กลางอาเรย์ Linear Search ต้องเทียบประมาณกี่ครั้ง?"
        options={["~20 ครั้ง", "~1,000 ครั้ง", "~500,000 ครั้ง", "~1,000,000 ครั้ง"]}
        answer={2}
        explain="โดยเฉลี่ย ค่าอยู่กลาง ๆ จะใช้ประมาณ n/2 = 500,000 ครั้ง — Linear Search ช้ามากเมื่อข้อมูลใหญ่"
      />
    </React.Fragment>
  );
};

// ============ 04: Binary Search ============
Lessons["binary-search"] = function () {
  return (
    <React.Fragment>
      <div className="callout warn">
        <div className="ttl">⚠ เงื่อนไขสำคัญ</div>
        Binary Search ใช้ได้ <b>เฉพาะกับข้อมูลที่เรียงแล้ว (sorted)</b> เท่านั้น!
      </div>

      <h3>หลักการ "แบ่งครึ่ง"</h3>
      <p>
        เปรียบเทียบกับ "การเดาตัวเลข 1-100": แทนที่จะเดาทีละตัว เราเดาที่กลาง (50) ก่อน
        ถ้ามากเกินไปก็ไปครึ่งล่าง ถ้าน้อยเกินไปก็ไปครึ่งบน — ทุกครั้งตัดข้อมูลครึ่งหนึ่ง!
      </p>

      <h3>Animation</h3>
      <SearchLessonViz algoKey="binary" defaultArr={[5, 12, 19, 23, 34, 41, 56, 67, 73, 87]} target={41} />

      <h3>ทำไมเร็วกว่า Linear Search มาก?</h3>
      <p>เพราะทุก step ตัดข้อมูลทิ้งครึ่งหนึ่ง → จำนวน step คือ <span className="kbd">log₂(n)</span></p>
      <table className="cmp">
        <thead><tr><th>n</th><th>Linear (worst)</th><th>Binary (worst)</th></tr></thead>
        <tbody>
          <tr><td className="mono">10</td><td className="mono">10</td><td className="mono">~4</td></tr>
          <tr><td className="mono">1,000</td><td className="mono">1,000</td><td className="mono">~10</td></tr>
          <tr><td className="mono">1,000,000</td><td className="mono">1,000,000</td><td className="mono">~20</td></tr>
          <tr><td className="mono">1,000,000,000</td><td className="mono">1,000,000,000</td><td className="mono">~30</td></tr>
        </tbody>
      </table>

      <Quiz
        q="ถ้าค้นหาในอาเรย์ที่มี 1,024 ช่อง Binary Search จะใช้กี่ขั้นตอนในกรณีแย่สุด?"
        options={["10 ขั้น", "32 ขั้น", "100 ขั้น", "1,024 ขั้น"]}
        answer={0}
        explain="log₂(1024) = 10 — ทุกครั้งแบ่งครึ่ง: 1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1"
      />
    </React.Fragment>
  );
};

// ============ 05-10: Sorting algorithms ============
const sortLessonTemplate = (algoKey, intro, extras) => () => {
  const A = window.AlgorithmGenerators[algoKey];
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">{A.name}</div>
        Time: <span style={{ fontFamily: 'var(--mono)' }}>{A.complexity.time}</span> &nbsp;·&nbsp;
        Space: <span style={{ fontFamily: 'var(--mono)' }}>{A.complexity.space}</span>
      </div>
      {intro}
      <h3>Animation</h3>
      <SortLessonViz algoKey={algoKey} />
      {extras}
    </React.Fragment>
  );
};

Lessons["bubble-sort"] = sortLessonTemplate("bubble", (
  <React.Fragment>
    <h3>หลักการ</h3>
    <p>เปรียบเทียบ "ทีละคู่ที่อยู่ติดกัน" ถ้าผิดลำดับก็สลับ ทำซ้ำหลายรอบจนไม่มีการสลับ — ค่าใหญ่จะ "ลอย" (bubble up) ไปท้ายอาเรย์เหมือนฟองอากาศ</p>
    <ol style={{ color: 'var(--text-1)' }}>
      <li>วน i จาก 0 ถึง n-2</li>
      <li>วน j จาก 0 ถึง n-i-2</li>
      <li>ถ้า a[j] &gt; a[j+1] → สลับ</li>
      <li>หลัง loop i รอบ ค่าที่ใหญ่ที่สุดจะอยู่ท้าย</li>
    </ol>
  </React.Fragment>
), (
  <React.Fragment>
    <Quiz
      q="Bubble Sort ใช้กี่ครั้งของการเปรียบเทียบในกรณีแย่สุด ถ้า n=5?"
      options={["5", "10", "20", "25"]}
      answer={1}
      explain="กรณีแย่สุดต้องเปรียบเทียบ n(n-1)/2 = 5×4/2 = 10 ครั้ง"
    />
    <DragOrder
      prompt="เรียงขั้นตอน Bubble Sort ให้ถูกต้อง:"
      items={["วน i = 0 ถึง n-2", "เริ่มต้น: รับอาเรย์ a[]", "วน j = 0 ถึง n-i-2", "ถ้า a[j] > a[j+1] ให้ swap", "จบ: อาเรย์ถูกเรียง"]}
      correct={["เริ่มต้น: รับอาเรย์ a[]", "วน i = 0 ถึง n-2", "วน j = 0 ถึง n-i-2", "ถ้า a[j] > a[j+1] ให้ swap", "จบ: อาเรย์ถูกเรียง"]}
    />
  </React.Fragment>
));

Lessons["selection-sort"] = sortLessonTemplate("selection", (
  <React.Fragment>
    <h3>หลักการ</h3>
    <p>หาตัวที่ "น้อยที่สุด" ในส่วนที่ยังไม่เรียง แล้วสลับไปไว้หน้าสุด ทำซ้ำจนครบ — เหมือนเลือกของชิ้นเล็กที่สุดออกมาก่อน</p>
    <p>ต่างจาก Bubble Sort ตรงที่ <b>swap น้อยกว่า</b> (อย่างมาก n-1 ครั้ง) แม้จะเปรียบเทียบเท่ากัน</p>
  </React.Fragment>
));

// ============ Shell Sort (gap sequences) ============
function ShellGapSeqDemo() {
  const [n, setN] = useStateLC(8);
  const seqs = {
    shell: {
      name: "Shell's original (n/2 ÷ 2)",
      compute: (N) => { const a = []; for (let g = Math.floor(N / 2); g >= 1; g = Math.floor(g / 2)) a.push(g); return a; },
      note: "n/2, n/4, ..., 1 — ง่ายสุด แต่ไม่เร็วสุด — Big-O แย่สุด O(n²)"
    },
    knuth: {
      name: "Knuth (3·k + 1)",
      compute: (N) => { const a = []; let k = 1; while (k < N) { a.push(k); k = 3 * k + 1; } return a.reverse(); },
      note: "1, 4, 13, 40, 121, ... — เลือก k ใหญ่สุด ≤ n — Big-O เฉลี่ย O(n^1.5)"
    },
    hibbard: {
      name: "Hibbard (2^i − 1)",
      compute: (N) => { const a = []; for (let i = 1; (1 << i) - 1 < N; i++) a.push((1 << i) - 1); return a.reverse(); },
      note: "1, 3, 7, 15, 31, ... — Big-O O(n^1.5) worst case (พิสูจน์ได้)"
    },
    sedgewick: {
      name: "Sedgewick (primes)",
      compute: (N) => {
        const primes = [1, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        return primes.filter(p => p < N).reverse();
      },
      note: "1, 3, 5, 7, 11, 13, ... — KMUTNB sheet ใช้แบบนี้ใน LAB2"
    },
  };
  return (
    <div className="dsv">
      <div className="ctrls">
        <label>n = <input type="number" min="2" max="50" value={n} onChange={e => setN(+e.target.value || 2)} style={{ width: 60 }} /></label>
      </div>
      <table className="tbl" style={{ marginTop: 10 }}>
        <thead><tr><th>ลำดับ</th><th>ค่า gap สำหรับ n={n}</th><th>หมายเหตุ</th></tr></thead>
        <tbody>
          {Object.entries(seqs).map(([k, s]) => (
            <tr key={k}>
              <td>{s.name}</td>
              <td className="mono">{s.compute(n).join(', ')}</td>
              <td style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Lessons["shell-sort"] = sortLessonTemplate("shell", (
  <React.Fragment>
    <h3>หลักการ — Insertion Sort + gap</h3>
    <p>
      ปรับปรุง Insertion Sort โดย <b>ไม่เลื่อนทีละ 1 ตำแหน่ง</b> แต่เลื่อนทีละ <code>gap</code> ก่อน
      (เปรียบเทียบ a[i] กับ a[i−gap]) ค่อยๆ ลด gap จนเหลือ 1 → รอบสุดท้ายเหมือน Insertion Sort
      แต่ข้อมูลถูก "เกือบเรียง" ไว้แล้ว → เร็วกว่ามาก
    </p>
    <ol style={{ color: 'var(--text-1)' }}>
      <li>เลือกลำดับของ gap (เช่น <code>n/2, n/4, ..., 1</code>)</li>
      <li>สำหรับแต่ละ gap ทำ Insertion Sort แบบกระโดด — เปรียบเทียบ a[j] กับ a[j−gap]</li>
      <li>เมื่อ gap = 1 → Insertion Sort เต็มรูปแบบ แต่ตอนนี้ array เกือบเรียงแล้ว → O(n)</li>
    </ol>
    <h3>ลำดับ gap (gap sequences)</h3>
    <ShellGapSeqDemo />
    <p style={{ color: 'var(--text-1)' }}>
      <b>การเลือกลำดับสำคัญมาก</b> — ลำดับที่ดีให้ <code>O(n^1.3) − O(n^1.5)</code> ขณะที่ Shell's original อาจช้าถึง <code>O(n²)</code> ใน worst case
    </p>
  </React.Fragment>
), (
  <React.Fragment>
    <h3>ตัวอย่าง KMUTNB LAB 2 (Sedgewick: gap = {`{5, 3, 2, 1}`})</h3>
    <pre className="code">{`Input:  16 25 2 54 36 9 12 66      // (n = 8)

gap=5 → groups: (0,5)(1,6)(2,7)(3)(4)
       sort each: (16,9)→9,16  (25,12)→12,25  (2,66)→ok
       → 9 12 2 54 36 16 25 66

gap=3 → groups: (0,3,6)(1,4,7)(2,5)
       sort each: (9,54,25)→9,25,54  (12,36,66)→ok  (2,16)→ok
       → 9 12 2 25 36 16 54 66

gap=2 → groups: (0,2,4,6)(1,3,5,7)
       sort each: (9,2,36,54)→2,9,36,54  (12,25,16,66)→12,16,25,66
       → 2 12 9 16 36 25 54 66

gap=1 → standard insertion sort (array เกือบเรียงแล้ว → O(n))
       → 2 9 12 16 25 36 54 66   ✓ sorted`}</pre>
    <Quiz
      q="ทำไม Shell Sort เร็วกว่า Insertion Sort?"
      options={[
        "เพราะใช้ recursion",
        "เพราะกระโดดเปรียบเทียบทีละ gap → ค่าที่อยู่ผิดที่ไกล ๆ ถูกย้ายเร็วขึ้น",
        "เพราะใช้ partition แบบ Quick Sort",
        "เพราะใช้หน่วยความจำเพิ่ม"
      ]}
      answer={1}
      explain="Insertion Sort ปกติเลื่อนทีละ 1 → ค่าผิดที่ไกลใช้เวลานาน. Shell Sort กระโดดทีละ gap → ลดจำนวน shift ได้มาก"
    />
    <Quiz
      q="ใน LAB 2 ใช้ Sedgewick {1,3,5,7,...} กับ n=8 → gap แรกที่ทำให้เกิดการเปลี่ยนแปลงคือ?"
      options={["7", "5", "3", "1"]}
      answer={1}
      explain="gap=7: เปรียบเทียบแค่ (a[0],a[7]) = (16,66) — เรียงแล้ว ไม่เกิดการเปลี่ยน. gap=5: เกิดการสลับครั้งแรก"
    />
  </React.Fragment>
));

Lessons["insertion-sort"] = sortLessonTemplate("insertion", (
  <React.Fragment>
    <h3>หลักการ — เหมือนเรียงไพ่ในมือ</h3>
    <p>หยิบไพ่ใบใหม่มาแทรกในตำแหน่งที่ถูกในส่วนที่เรียงแล้ว — ส่วนซ้ายของอาเรย์จะ "เรียงตลอด" และค่อย ๆ ใหญ่ขึ้น</p>
    <div className="callout tip">
      <div className="ttl">เร็วเมื่อข้อมูลใกล้เรียงแล้ว</div>
      ถ้าอาเรย์เกือบเรียงอยู่แล้ว Insertion Sort เร็วเทียบเท่า O(n) — เป็น sort ที่ดีสำหรับ <b>data ที่ใกล้เรียงแล้ว</b>
    </div>
  </React.Fragment>
));

Lessons["merge-sort"] = sortLessonTemplate("merge", (
  <React.Fragment>
    <h3>หลักการ — Divide & Conquer</h3>
    <ol style={{ color: 'var(--text-1)' }}>
      <li><b>Divide:</b> แบ่งอาเรย์ครึ่งซ้าย/ขวา</li>
      <li><b>Conquer:</b> เรียกตัวเองกับครึ่งซ้ายและครึ่งขวา (recursion)</li>
      <li><b>Combine:</b> รวม (merge) สองครึ่งที่เรียงแล้วกลับเข้าเป็นอาเรย์เดียว</li>
    </ol>
    <p>การ "merge" สองอาเรย์ที่เรียงแล้วใช้เวลา O(n) และจำนวนชั้นการแบ่งคือ log n → รวมเป็น <b>O(n log n)</b> ทุกกรณี</p>
  </React.Fragment>
), (
  <Quiz
    q="ทำไม Merge Sort ต้องใช้ space O(n)?"
    options={[
      "เพราะมี recursion",
      "เพราะต้องสร้างอาเรย์ชั่วคราวเพื่อ merge",
      "เพราะใช้ stack ภายใน",
      "ทุกข้อข้างต้น"
    ]}
    answer={1}
    explain="ขั้นตอน merge ต้องคัดลอกข้อมูลครึ่งซ้าย/ขวาไปเก็บในอาเรย์ชั่วคราวก่อน แล้วค่อย merge กลับเข้าอาเรย์หลัก — ใช้ memory เพิ่ม O(n)"
  />
));

// ============ Median-of-Three Pivot Viz ============
// Source: week_2 p.40-41, LAB3 ข้อ 1, รวม code midterm.pdf
function MedianOfThreeViz() {
  const PRESETS = {
    'lab3': [16, 25, 2, 54, 36, 9, 12, 66],
    'mid-large': [25, 16, 2, 9, 36, 54, 12, 66],
    'sorted-3': [5, 9, 12, 18, 22, 30, 41, 50],
    'reversed': [80, 70, 60, 50, 40, 30, 20, 10],
  };
  const [preset, setPreset] = useStateLC('mid-large');
  const [step, setStep] = useStateLC(0);
  const arr0 = PRESETS[preset];

  // Pre-compute step-by-step transformations
  const trace = useMemoLC(() => {
    const n = arr0.length;
    const low = 0, high = n - 1;
    const mid = low + Math.floor((high - low) / 2);
    const log = [];
    let a = [...arr0];

    log.push({ arr: [...a], msg: `เริ่มต้น — low=${low}, mid=${mid}, high=${high}`, marks: { [low]: 'l', [mid]: 'm', [high]: 'h' }, action: null });

    // step 1: if a[low] > a[mid] swap
    if (a[low] > a[mid]) {
      log.push({ arr: [...a], msg: `เปรียบเทียบ a[low]=${a[low]} > a[mid]=${a[mid]} → swap`, marks: { [low]: 'cmp-l', [mid]: 'cmp-m' }, action: 'compare-LM' });
      [a[low], a[mid]] = [a[mid], a[low]];
      log.push({ arr: [...a], msg: `หลัง swap (low, mid)`, marks: { [low]: 'l', [mid]: 'm', [high]: 'h' }, action: 'swap-LM' });
    } else {
      log.push({ arr: [...a], msg: `เปรียบเทียบ a[low]=${a[low]} ≤ a[mid]=${a[mid]} → no swap`, marks: { [low]: 'cmp-l', [mid]: 'cmp-m' }, action: 'compare-LM-ok' });
    }

    // step 2: if a[low] > a[high] swap
    if (a[low] > a[high]) {
      log.push({ arr: [...a], msg: `เปรียบเทียบ a[low]=${a[low]} > a[high]=${a[high]} → swap`, marks: { [low]: 'cmp-l', [high]: 'cmp-h' }, action: 'compare-LH' });
      [a[low], a[high]] = [a[high], a[low]];
      log.push({ arr: [...a], msg: `หลัง swap (low, high)`, marks: { [low]: 'l', [mid]: 'm', [high]: 'h' }, action: 'swap-LH' });
    } else {
      log.push({ arr: [...a], msg: `เปรียบเทียบ a[low]=${a[low]} ≤ a[high]=${a[high]} → no swap`, marks: { [low]: 'cmp-l', [high]: 'cmp-h' }, action: 'compare-LH-ok' });
    }

    // step 3: if a[mid] > a[high] swap
    if (a[mid] > a[high]) {
      log.push({ arr: [...a], msg: `เปรียบเทียบ a[mid]=${a[mid]} > a[high]=${a[high]} → swap`, marks: { [mid]: 'cmp-m', [high]: 'cmp-h' }, action: 'compare-MH' });
      [a[mid], a[high]] = [a[high], a[mid]];
      log.push({ arr: [...a], msg: `หลัง swap (mid, high)`, marks: { [low]: 'l', [mid]: 'm', [high]: 'h' }, action: 'swap-MH' });
    } else {
      log.push({ arr: [...a], msg: `เปรียบเทียบ a[mid]=${a[mid]} ≤ a[high]=${a[high]} → no swap`, marks: { [mid]: 'cmp-m', [high]: 'cmp-h' }, action: 'compare-MH-ok' });
    }

    // Now a[low] ≤ a[mid] ≤ a[high]
    log.push({ arr: [...a], msg: `✓ ตอนนี้ a[low]=${a[low]} ≤ a[mid]=${a[mid]} ≤ a[high]=${a[high]} — median = a[mid] = ${a[mid]}`, marks: { [low]: 'sorted-3', [mid]: 'median', [high]: 'sorted-3' }, action: 'verified' });

    // step 4: swap a[mid] with a[high-1] to "hide" pivot
    log.push({ arr: [...a], msg: `Swap a[mid] กับ a[high-1] (=${a[high - 1]}) — ซ่อน pivot ไว้ที่ high-1`, marks: { [mid]: 'cmp-m', [high - 1]: 'cmp-h' }, action: 'pre-hide' });
    [a[mid], a[high - 1]] = [a[high - 1], a[mid]];
    const pivot = a[high - 1];
    log.push({ arr: [...a], msg: `✓ Pivot = ${pivot} อยู่ที่ a[${high - 1}] (พร้อม partition)`, marks: { [low]: 'sorted-3', [high - 1]: 'pivot', [high]: 'sorted-3' }, action: 'done' });

    return { log, pivot, midIdx: mid, lowIdx: low, highIdx: high };
  }, [preset]);

  // Reset step when preset changes
  useEffectLC(() => { setStep(0); }, [preset]);

  const cur = trace.log[Math.min(step, trace.log.length - 1)];
  const colorOf = (i) => {
    const m = cur.marks[i];
    if (m === 'l' || m === 'h') return 'var(--accent)';
    if (m === 'm') return 'var(--warn)';
    if (m === 'cmp-l' || m === 'cmp-h') return 'var(--pink)';
    if (m === 'cmp-m') return 'var(--danger)';
    if (m === 'sorted-3') return 'rgba(16,185,129,0.4)';
    if (m === 'median' || m === 'pivot') return 'var(--success)';
    return 'var(--bg-2)';
  };

  return (
    <div className="dsv">
      <div className="ctrls" style={{ flexWrap: 'wrap' }}>
        <label>Preset:&nbsp;
          <select value={preset} onChange={e => setPreset(e.target.value)}
            style={{ padding: '4px 8px', background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }}>
            <option value="lab3">LAB 3: [16,25,2,54,36,9,12,66] (already sorted 3)</option>
            <option value="mid-large">[25,16,2,9,36,54,12,66] (need 1 swap)</option>
            <option value="sorted-3">[5,9,12,18,22,30,41,50] (perfectly sorted)</option>
            <option value="reversed">[80,70,60,50,40,30,20,10] (reversed)</option>
          </select>
        </label>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {Math.min(step + 1, trace.log.length)} / {trace.log.length}</span>
        <button onClick={() => setStep(Math.min(trace.log.length - 1, step + 1))} disabled={step >= trace.log.length - 1}>▶</button>
        <button onClick={() => setStep(0)}>↺</button>
      </div>

      <div className="callout info" style={{ marginTop: 8 }}>
        <div className="ttl">{cur.msg}</div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 10 }}>
        {cur.arr.map((v, i) => {
          const m = cur.marks[i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="cell" style={{
                background: colorOf(i),
                color: m === 'median' || m === 'pivot' ? '#000' : 'var(--text-0)',
                minWidth: 38,
                fontWeight: m === 'median' || m === 'pivot' ? 'bold' : 'normal'
              }}>{v}</div>
              <div style={{ fontSize: 10, marginTop: 2, color: 'var(--text-2)' }}>
                {i === trace.lowIdx && 'low'}
                {i === trace.midIdx && cur.marks[i] !== 'pivot' && 'mid'}
                {i === trace.highIdx && 'high'}
                {m === 'pivot' && '↑ pivot'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-2)' }}>
        <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--accent)', marginRight: 6, borderRadius: 2 }}></span>endpoint (low/high)
        &nbsp; <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--warn)', marginRight: 6, borderRadius: 2 }}></span>middle
        &nbsp; <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--danger)', marginRight: 6, borderRadius: 2 }}></span>กำลังเปรียบเทียบ
        &nbsp; <span style={{ display: 'inline-block', width: 10, height: 10, background: 'var(--success)', marginRight: 6, borderRadius: 2 }}></span>median / pivot
      </div>
    </div>
  );
}

Lessons["quick-sort"] = sortLessonTemplate("quick", (
  <React.Fragment>
    <h3>หลักการ — Pivot Partition</h3>
    <ol style={{ color: 'var(--text-1)' }}>
      <li>เลือก <b>pivot</b> (เช่น ตัวสุดท้าย)</li>
      <li><b>Partition:</b> จัดให้ค่าน้อยกว่า pivot อยู่ซ้าย, มากกว่าอยู่ขวา</li>
      <li>เรียกตัวเองกับครึ่งซ้ายและครึ่งขวา</li>
    </ol>
    <div className="callout warn">
      <div className="ttl">⚠ Worst case</div>
      ถ้าเลือก pivot ไม่ดี (เช่น เลือกตัวเล็กสุดหรือใหญ่สุดทุกครั้ง) จะกลายเป็น <b>O(n²)</b>!
      วิธีแก้: เลือก pivot สุ่ม หรือ median-of-three
    </div>
  </React.Fragment>
), (
  <React.Fragment>
    <h3>🎯 Median-of-Three Pivot — KMUTNB week_2 + LAB 3</h3>
    <p style={{ color: 'var(--text-1)' }}>
      วิธีเลือก pivot ที่ดีกว่า — แทนที่จะเลือก <code>a[low]</code> หรือ <code>a[high]</code> เฉย ๆ
      (ซึ่ง worst-case O(n²) เมื่อข้อมูลเรียงมาแล้ว) ให้ดู 3 ตำแหน่ง <b>low, mid, high</b> แล้วเลือก
      ค่ากลาง (median) เป็น pivot
    </p>

    <h3>ขั้นตอน (สูตรจากชีท)</h3>
    <ol style={{ color: 'var(--text-1)' }}>
      <li>คำนวณ <code>mid = low + (high - low) / 2</code></li>
      <li>เรียง 3 ตำแหน่งให้ <code>a[low] ≤ a[mid] ≤ a[high]</code> ด้วยการ swap ทีละคู่:
        <ul>
          <li>ถ้า a[low] &gt; a[mid] → swap</li>
          <li>ถ้า a[low] &gt; a[high] → swap</li>
          <li>ถ้า a[mid] &gt; a[high] → swap</li>
        </ul>
      </li>
      <li>ตอนนี้ <code>a[mid]</code> คือ median — swap กับ <code>a[high-1]</code> เพื่อ "ซ่อน" pivot</li>
      <li>ทำ partition แบบปกติด้วย pivot = <code>a[high-1]</code></li>
    </ol>

    <MedianOfThreeViz />

    <h3>Pseudocode (จาก รวม code midterm.pdf)</h3>
    <pre className="code">{`int medianOfThree(vector<int>& a, int low, int high) {
  int mid = low + (high - low) / 2;
  if (a[low] > a[mid])  swap(a[low],  a[mid]);
  if (a[low] > a[high]) swap(a[low],  a[high]);
  if (a[mid] > a[high]) swap(a[mid],  a[high]);
  // a[mid] is now median — hide pivot at high-1
  swap(a[mid], a[high - 1]);
  return a[high - 1];   // pivot value
}

int partitionMedian(vector<int>& a, int low, int high) {
  int pivot = medianOfThree(a, low, high);
  int i = low, j = high - 1;
  while (true) {
    while (a[++i] < pivot);
    while (a[--j] > pivot);
    if (i < j) swap(a[i], a[j]);
    else break;
  }
  swap(a[i], a[high - 1]);   // restore pivot
  return i;
}`}</pre>

    <h3>เหตุผลที่ดีกว่า fixed pivot</h3>
    <table className="tbl">
      <thead><tr><th>วิธี pivot</th><th>Worst case</th><th>Average</th><th>ดีตรงไหน</th></tr></thead>
      <tbody>
        <tr><td>fixed: a[low] หรือ a[high]</td><td>O(n²) เมื่อ sorted</td><td>O(n log n)</td><td>เขียนง่าย</td></tr>
        <tr><td>random pivot</td><td>O(n²) แต่ <i>น้อยมาก</i></td><td>O(n log n)</td><td>กระจาย worst case</td></tr>
        <tr><td><b>median-of-three</b></td><td>O(n²) ยังเป็นไปได้ทางทฤษฎี</td><td>O(n log n) ดีขึ้น</td><td>กัน sorted input + ลด constant</td></tr>
      </tbody>
    </table>

    <div className="callout success">
      <div className="ttl">💡 ทำไมใช้ในการสอบ Lab</div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li><b>LAB 3 ข้อ 1</b> ของ KMUTNB ใช้ median-of-three ใน Quick Select</li>
        <li>คำตอบใน <b>รวม code midterm.pdf</b> มี <code>partitionMedian</code> ครบ</li>
        <li>ออกในข้อสอบ <b>วิเคราะห์ความแตกต่าง</b> ระหว่าง partition ปกติกับ median-of-three</li>
      </ul>
    </div>

    <Quiz
      q="ทำไมต้อง swap a[mid] กับ a[high-1] หลังจากเรียง 3 ตัวแล้ว?"
      options={[
        "เพื่อให้ array สวยขึ้น",
        "เพื่อให้ pivot อยู่ใกล้ high — partition loop ไม่ต้องเช็ค bound ที่ a[high]",
        "เพื่อให้ partition เริ่มจาก mid",
        "เพื่อให้ median อยู่ index 0"
      ]}
      answer={1}
      explain="หลังเรียง 3 ตัว a[high] เป็นค่ามากสุดอยู่แล้ว — มัน 'guard' ว่า j-- ไม่หลุดเลย high. ส่วน a[low] เป็นค่าน้อยสุด guard ว่า i++ ไม่หลุดเลย low. ดังนั้น loop ภายในไม่ต้องเช็ค bound — เร็วขึ้น"
    />

    <Quiz
      q="LAB 3 ใช้ arr = [16,25,2,54,36,9,12,66] — หลัง medianOfThree(0, 7) ค่า pivot คือ?"
      options={["16", "54", "66", "9"]}
      answer={1}
      explain="low=16, mid=A[3]=54, high=66 — 16 ≤ 54 ≤ 66 (sorted แล้ว ไม่ swap) → median = 54 — pivot ถูกซ่อนไว้ที่ A[high-1]=A[6]"
    />
  </React.Fragment>
));

Lessons["heap-sort"] = sortLessonTemplate("heap", (
  <React.Fragment>
    <h3>หลักการ — ใช้ Max-Heap</h3>
    <ol style={{ color: 'var(--text-1)' }}>
      <li>สร้าง <b>Max-Heap</b> จากอาเรย์ (ตัวใหญ่สุดอยู่บน)</li>
      <li>สลับ root (ใหญ่สุด) กับช่องสุดท้าย — ตัวใหญ่สุดเข้าที่</li>
      <li>ลดขนาด heap ลง 1 แล้ว heapify ใหม่</li>
      <li>ทำซ้ำจนเหลือ 1 ตัว</li>
    </ol>
    <p>เป็น sort ที่ <b>O(n log n) ทุกกรณี</b> และใช้ space แค่ O(1) (in-place) — แต่ในทางปฏิบัติ Quick Sort มักเร็วกว่าเพราะ cache-friendlier</p>
  </React.Fragment>
));

// ============ Data Structures ============
Lessons["stack"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Stack — LIFO</div>
        Last In, First Out — ตัวที่เข้าทีหลัง ออกก่อน เหมือนการวางจานซ้อนกัน
      </div>
      <h3>Operations พื้นฐาน</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>push(x)</b> — ใส่ x เข้าไปด้านบน &nbsp; <span className="kbd">O(1)</span></li>
        <li><b>pop()</b> — เอาตัวบนออก คืนค่า &nbsp; <span className="kbd">O(1)</span></li>
        <li><b>top() / peek()</b> — ดูตัวบนโดยไม่เอาออก &nbsp; <span className="kbd">O(1)</span></li>
        <li><b>isEmpty()</b> — เช็คว่าว่างไหม &nbsp; <span className="kbd">O(1)</span></li>
      </ul>
      <h3>Lab — ทดลองเอง</h3>
      <StackViz />
      <h3>โค้ด C (Stack ด้วย array)</h3>
      <CodeBlock code={[
        "#define MAX 100",
        "int stack[MAX];",
        "int top = -1;",
        "",
        "void push(int x) {",
        "  if (top < MAX - 1) stack[++top] = x;",
        "}",
        "int pop() {",
        "  if (top >= 0) return stack[top--];",
        "  return -1;",
        "}",
      ]} />
      <h3>การประยุกต์ใช้</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Function call stack ในภาษาโปรแกรม</li>
        <li>Undo / Redo</li>
        <li>ตรวจสอบวงเล็บปิดเปิด <span className="kbd">{`( [ { } ] )`}</span></li>
        <li>แปลง Infix → Postfix</li>
        <li>DFS (Depth-First Search)</li>
      </ul>
      <Quiz
        q='ลำดับ push: 1, 2, 3, 4 แล้ว pop 2 ครั้ง ค่าที่ pop ได้คืออะไร?'
        options={["1, 2", "4, 3", "3, 4", "2, 1"]}
        answer={1}
        explain="LIFO — ตัวที่เข้าทีหลัง (4) ออกก่อน แล้ว 3 ออกถัดมา"
      />
    </React.Fragment>
  );
};

Lessons["queue"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Queue — FIFO</div>
        First In, First Out — ตัวที่เข้าก่อน ออกก่อน เหมือนการต่อแถว
      </div>
      <h3>Operations</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>enqueue(x)</b> — ใส่ที่ท้ายแถว &nbsp; <span className="kbd">O(1)</span></li>
        <li><b>dequeue()</b> — เอาตัวหน้าออก &nbsp; <span className="kbd">O(1)</span></li>
        <li><b>front()</b> — ดูตัวหน้า &nbsp; <span className="kbd">O(1)</span></li>
      </ul>
      <h3>Lab</h3>
      <QueueViz />
      <h3>การประยุกต์ใช้</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>BFS (Breadth-First Search)</li>
        <li>Job scheduling / printer queue</li>
        <li>Buffer ใน I/O</li>
      </ul>
      <Quiz
        q="ความแตกต่างหลักระหว่าง Stack และ Queue คืออะไร?"
        options={[
          "Stack เร็วกว่า Queue",
          "Stack เป็น LIFO, Queue เป็น FIFO",
          "Stack ใช้ array ได้, Queue ใช้ไม่ได้",
          "ไม่มีความแตกต่าง"
        ]}
        answer={1}
        explain="ทั้งสองมี O(1) เท่ากัน ความต่างคือลำดับเข้าออก: Stack เอาตัวบน (เข้าทีหลัง) Queue เอาตัวหน้า (เข้าก่อน)"
      />
    </React.Fragment>
  );
};

Lessons["linked-list"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Linked List</div>
        โครงสร้างข้อมูลที่ประกอบด้วย <b>Node</b> แต่ละ node มี <b>data</b> และ <b>pointer</b> ชี้ไปยัง node ถัดไป
      </div>
      <h3>Lab — ทดลอง Insert / Delete</h3>
      <LinkedListViz />
      <h3>เปรียบเทียบกับ Array</h3>
      <table className="cmp">
        <thead><tr><th>Operation</th><th>Array</th><th>Linked List</th></tr></thead>
        <tbody>
          <tr><td>เข้าถึงด้วย index</td><td className="mono">O(1)</td><td className="mono">O(n)</td></tr>
          <tr><td>Insert ที่หัว</td><td className="mono">O(n)</td><td className="mono">O(1)</td></tr>
          <tr><td>Insert ที่ท้าย</td><td className="mono">O(1)*</td><td className="mono">O(n) หรือ O(1)†</td></tr>
          <tr><td>Delete ที่หัว</td><td className="mono">O(n)</td><td className="mono">O(1)</td></tr>
          <tr><td>ใช้ memory</td><td>ติดต่อกัน</td><td>กระจาย + pointer</td></tr>
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: 'var(--text-2)' }}>* Dynamic array (amortized) &nbsp; † ถ้ามี tail pointer</p>
      <h3>โค้ด C — Node และ Insert ที่หัว</h3>
      <CodeBlock code={[
        "struct Node {",
        "  int data;",
        "  struct Node *next;",
        "};",
        "",
        "void insertHead(struct Node **head, int v) {",
        "  struct Node *n = malloc(sizeof(struct Node));",
        "  n->data = v;",
        "  n->next = *head;",
        "  *head = n;",
        "}",
      ]} />
      <Quiz
        q="ทำไม Insert ที่ตำแหน่ง k ใน Linked List จึงเป็น O(n) ไม่ใช่ O(1)?"
        options={[
          "เพราะ malloc ช้า",
          "เพราะต้องเดินไล่หา node ที่ตำแหน่ง k-1 ก่อน",
          "เพราะ pointer ใหญ่เกินไป",
          "Linked List ไม่มี Insert"
        ]}
        answer={1}
        explain="แม้การเชื่อม pointer จะใช้แค่ O(1) แต่การไปถึงตำแหน่ง k ต้องเดินจาก head ผ่าน node ทีละตัว = O(k) ในกรณีแย่สุด O(n)"
      />
    </React.Fragment>
  );
};

Lessons["hashing"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Hash Table</div>
        เก็บคู่ <b>(key, value)</b> โดยใช้ <b>hash function</b> แปลง key เป็น index ของอาเรย์
        — ค้นหา/ใส่/ลบ เฉลี่ย <span className="kbd">O(1)</span>
      </div>
      <h3>Hash Function</h3>
      <p>แปลง key (string, number, ...) เป็นเลขจำนวนเต็มในช่วงของขนาด table — ตัวอย่าง:</p>
      <CodeBlock code={[
        "int hash(char *key, int size) {",
        "  int h = 0;",
        "  for (int i = 0; key[i]; i++)",
        "    h = (h * 31 + key[i]) % size;",
        "  return h;",
        "}",
      ]} />
      <h3>การชนกัน (Collision)</h3>
      <p>เมื่อ key สองตัว hash เป็น index เดียวกัน เราต้องจัดการ:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Chaining:</b> แต่ละ bucket เก็บเป็น linked list (ที่เห็นใน Lab ด้านล่าง)</li>
        <li><b>Open Addressing:</b> ถ้าชน → ลองช่องถัดไป (linear/quadratic probing)</li>
      </ul>
      <h3>Lab — Hash Table แบบ Chaining (size = 7)</h3>
      <HashViz />
      <Quiz
        q="ทำไม Hash Table ถึงเป็น O(1) เฉลี่ย แต่ worst case เป็น O(n)?"
        options={[
          "เพราะ hash function อาจช้า",
          "เพราะ collision อาจทำให้ทุก key ตกใน bucket เดียว",
          "เพราะใช้ memory เยอะ",
          "เพราะต้อง rehash ทุกครั้ง"
        ]}
        answer={1}
        explain="ถ้า hash function แย่หรือเจอ key หลายตัวที่ hash ตรงกัน ทุกตัวอาจอยู่ใน bucket เดียว → ค้นหาต้องไล่ทั้งหมด = O(n)"
      />
    </React.Fragment>
  );
};

window.LessonsPart1 = Lessons;
