/* Lessons Part 15 — Complexity Theory: P, NP, NP-Complete, Reductions, Approximation */

const { useState: useS15, useMemo: useM15 } = React;
const { Quiz: Quiz15 } = window.LessonComponents;
const { WorkedExample: WE15, CheatSheet: CS15, Pitfalls: PF15 } = window.LearningKit;

const Lessons15 = {};

/* ============================================================
   68 — P, NP, NP-HARD, NP-COMPLETE
============================================================ */
Lessons15["p-vs-np"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ <b>ลำดับชั้นความซับซ้อน</b> — P, NP, NP-Hard, NP-Complete และทำไม "P vs NP" คือคำถามล้านดอลลาร์
      </div>

      <h3>Decision Problem (ปัญหาที่ตอบ Yes/No)</h3>
      <p>
        ความซับซ้อนนิยามบน <b>decision problems</b> — ปัญหาที่คำตอบเป็นแค่ Yes หรือ No
      </p>
      <table className="cmp">
        <thead><tr><th>Optimization problem</th><th>Decision version</th></tr></thead>
        <tbody>
          <tr><td>หา shortest path</td><td>มี path ความยาว ≤ k ไหม?</td></tr>
          <tr><td>หา largest clique</td><td>มี clique ขนาด ≥ k ไหม?</td></tr>
          <tr><td>SAT — หา assignment ที่ทำให้สูตรเป็นจริง</td><td>มี assignment ที่ satisfy ไหม?</td></tr>
        </tbody>
      </table>

      <h3>คลาส P (Polynomial Time)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b style={{ color: '#10b981' }}>P</b> = ปัญหาที่<b>แก้ได้</b>ใน polynomial time<br/>
        ⟺ มี algorithm O(n^k) สำหรับ k คงที่
      </div>
      <p><b>ตัวอย่าง:</b> Sorting O(n log n), Shortest Path O(V²), Linear Programming, GCD</p>

      <h3>คลาส NP (Nondeterministic Polynomial)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b style={{ color: '#fbbf24' }}>NP</b> = ปัญหาที่<b>ตรวจคำตอบ</b>ได้ใน polynomial time<br/>
        ⟺ ถ้ามีคน "บอก" คำตอบ (certificate) → verify ได้ใน O(n^k)
      </div>

      <WE15
        title="ตัวอย่าง: SAT ∈ NP"
        problem="แสดงว่า Boolean SAT (Satisfiability) อยู่ใน NP"
        steps={[
          { title: "Problem", body: "Input: Boolean formula φ เช่น (x₁ ∨ ¬x₂) ∧ (x₂ ∨ x₃)\nOutput: Yes ถ้ามี assignment ที่ทำให้ φ เป็น true", why: "นี่คือ decision problem" },
          { title: "Certificate", body: "Assignment เช่น x₁=T, x₂=F, x₃=T\nขนาด = n bit (n = จำนวน variable)", why: "Certificate ต้องเป็น polynomial size" },
          { title: "Verifier", body: "แทน assignment ใน φ → evaluate Boolean expression → O(|φ|)\n→ poly time ✓", why: "Verify ได้เร็ว" },
        ]}
        answer="∴ SAT ∈ NP ▢"
        takeaway="NP ไม่ได้แปลว่า ‘แก้ไม่ได้ใน poly time’ — แปลว่า ‘ตรวจคำตอบได้ใน poly time’"
      />

      <h3>P ⊆ NP</h3>
      <p>
        ทุกปัญหาใน P ก็อยู่ใน NP — ถ้าแก้ได้ใน poly time, ก็แค่ <b>เพิกเฉย certificate แล้วแก้</b> เพื่อ verify
      </p>

      <h3>คลาส NP-Hard และ NP-Complete</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b style={{ color: '#f87171' }}>NP-Hard</b> = ปัญหา H ที่ทุกปัญหาใน NP <b>ลด (reduce) มาที่ H ได้</b>ใน poly time<br/>
        ⟺ "ยากอย่างน้อยเท่ากับ" ทุกปัญหา NP<br/><br/>
        <b style={{ color: '#a78bfa' }}>NP-Complete</b> = NP-Hard <b>AND</b> อยู่ใน NP เอง<br/>
        ⟺ ‘ปัญหาที่ยากที่สุดใน NP’
      </div>

      <h3>แผนผังคลาส</h3>
      <div style={{ background: 'var(--bg-2)', padding: 20, borderRadius: 10, margin: '12px 0', textAlign: 'center' }}>
        <svg width="500" height="280" viewBox="0 0 500 280">
          {/* NP outer circle */}
          <ellipse cx="200" cy="140" rx="180" ry="120" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth="2" />
          <text x="60" y="35" fill="#fbbf24" fontSize="16" fontWeight="700">NP</text>
          {/* P inner circle */}
          <ellipse cx="130" cy="140" rx="80" ry="60" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="2" />
          <text x="115" y="148" fill="#10b981" fontSize="16" fontWeight="700">P</text>
          {/* NP-Complete (intersection of NP and NP-Hard) */}
          <ellipse cx="290" cy="140" rx="60" ry="50" fill="rgba(168,139,250,0.2)" stroke="#a78bfa" strokeWidth="2" />
          <text x="252" y="145" fill="#a78bfa" fontSize="13" fontWeight="700">NP-Comp</text>
          {/* NP-Hard region */}
          <ellipse cx="380" cy="140" rx="100" ry="100" fill="rgba(248,113,113,0.08)" stroke="#f87171" strokeWidth="2" strokeDasharray="5,5" />
          <text x="430" y="245" fill="#f87171" fontSize="14" fontWeight="700">NP-Hard</text>
          {/* Examples */}
          <text x="100" y="170" fontSize="10" fill="var(--text-2)">Sort</text>
          <text x="100" y="130" fontSize="10" fill="var(--text-2)">BFS</text>
          <text x="260" y="160" fontSize="10" fill="var(--text-2)">SAT</text>
          <text x="265" y="125" fontSize="10" fill="var(--text-2)">Clique</text>
          <text x="385" y="160" fontSize="10" fill="var(--text-2)">Halting</text>
          <text x="385" y="180" fontSize="10" fill="var(--text-2)">(not in NP)</text>
        </svg>
      </div>

      <h3>คำถาม P vs NP (รางวัล $1M)</h3>
      <div className="callout warn">
        <div className="ttl">💰 Clay Millennium Prize</div>
        คำถาม: <b>P = NP หรือไม่?</b><br/><br/>
        ถ้า <b>P = NP</b> → ทุกปัญหาที่ verify ได้เร็ว ก็แก้ได้เร็ว → SAT, Cryptography แตกหมด<br/>
        ถ้า <b>P ≠ NP</b> (เชื่อว่าจริง) → มีปัญหาที่ยากแก้ตลอด แม้ตรวจคำตอบจะง่าย<br/><br/>
        <b>ยังไม่มีใครพิสูจน์ทั้งสองทาง</b> ตั้งแต่ปี 1971 (Cook-Levin)
      </div>

      <h3>Cook-Levin Theorem (1971)</h3>
      <p>
        <b>SAT เป็น NP-Complete</b> — ทุกปัญหา NP ลดมาที่ SAT ได้ใน poly time<br/>
        นี่คือ NP-Complete <b>ตัวแรก</b>ที่พิสูจน์ — เปิดทางให้พิสูจน์ NP-C ตัวอื่น ๆ ด้วย reduction
      </p>

      <CS15 title="P vs NP Cheat Sheet" sections={[
        { label: "P", value: "แก้ได้ใน poly time<br/>Sort, BFS, Dijkstra, GCD" },
        { label: "NP", value: "Verify ได้ใน poly time<br/>SAT, Clique, Knapsack" },
        { label: "NP-Hard", value: "‘≥ ยากที่สุดของ NP’<br/>อาจไม่อยู่ใน NP (เช่น Halting)" },
        { label: "NP-Complete", value: "NP-Hard ∩ NP<br/>SAT, 3-SAT, Clique, Vertex Cover" },
        { label: "P=NP?", value: "เชื่อว่า ≠ แต่ยังไม่มีพิสูจน์<br/>$1M สำหรับใครพิสูจน์ได้" },
      ]} />

      <PF15 items={[
        { trap: "คิดว่า ‘NP = Not Polynomial’ — ผิด!", fix: "NP = <b>Nondeterministic Polynomial</b> — verify ได้เร็ว, ไม่ได้แปลว่าแก้ไม่ได้เร็ว" },
        { trap: "บอกว่า NP-Hard ⊂ NP — ผิด", fix: "NP-Hard อาจ<b>ไม่</b>อยู่ใน NP (เช่น Halting problem)" },
        { trap: "พิสูจน์ NP-Complete แค่ ‘แก้ยาก’", fix: "ต้องแสดง (1) อยู่ใน NP, (2) ปัญหา NP-C ตัวอื่นลดมาได้" },
      ]} />

      <Quiz15 q={{
        question: "ปัญหา ‘หา shortest path ในกราฟไม่มีน้ำหนัก’ อยู่ในคลาสไหน?",
        options: ["NP-Complete", "NP-Hard เท่านั้น", "P (และ NP)", "EXP-Time"],
        answer: 2,
        explain: "BFS แก้ได้ใน O(V+E) → poly → P → และทุก P ⊆ NP"
      }} />

      <Quiz15 q={{
        question: "ถ้ามีใครพิสูจน์ว่า ‘3-SAT แก้ได้ใน O(n¹⁰)’ จะหมายความว่าอย่างไร?",
        options: [
          "3-SAT ออกจาก NP-Complete",
          "P = NP (ทุก NP problem แก้ได้ใน poly)",
          "Cryptography ทั้งหมด พัง",
          "ทั้ง B และ C"
        ],
        answer: 3,
        explain: "3-SAT เป็น NP-Complete → ลดทุก NP problem มาได้ → ถ้า 3-SAT ∈ P → ทั้ง NP ⊆ P → P=NP → กระทบ crypto (RSA, ECC) ทันที"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   69 — POLYNOMIAL REDUCTIONS
============================================================ */
Lessons15["reductions"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ <b>polynomial reduction A ≤ₚ B</b> — เครื่องมือสำคัญในการพิสูจน์ NP-Completeness
      </div>

      <h3>นิยาม — Polynomial-Time Reduction</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b>A ≤ₚ B</b> (A reduces to B in polynomial time) ⟺ มีฟังก์ชัน f: A → B ที่:
        <ul style={{ marginTop: 8 }}>
          <li><b>คำนวณได้ใน poly time</b></li>
          <li>x ∈ A ⟺ f(x) ∈ B (preserve answer)</li>
        </ul>
      </div>
      <p>
        แปลว่า: "ถ้าแก้ B ได้ → แก้ A ได้ด้วย" — หรือ "B ยากอย่างน้อยเท่ากับ A"
      </p>

      <h3>ผลทางความซับซ้อน</h3>
      <table className="cmp">
        <thead><tr><th>ถ้า A ≤ₚ B และ...</th><th>แล้ว...</th></tr></thead>
        <tbody>
          <tr><td>B ∈ P</td><td>A ∈ P (B แก้เร็ว → A ก็แก้เร็ว)</td></tr>
          <tr><td>A ∉ P</td><td>B ∉ P (B ต้องยาก ≥ A)</td></tr>
          <tr><td>A เป็น NP-Hard</td><td>B เป็น NP-Hard ด้วย</td></tr>
        </tbody>
      </table>

      <h3>วิธีพิสูจน์ NP-Completeness</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        เพื่อพิสูจน์ <b>B เป็น NP-Complete</b>:
        <ol style={{ marginTop: 8, color: 'var(--text-1)' }}>
          <li>แสดงว่า <b>B ∈ NP</b> (มี polynomial verifier)</li>
          <li>เลือก NP-Complete ที่รู้แล้ว A (เช่น 3-SAT)</li>
          <li>สร้าง reduction <b>A ≤ₚ B</b></li>
          <li>พิสูจน์ความถูกต้องของ reduction</li>
        </ol>
      </div>

      <WE15
        title="Reduction: 3-SAT ≤ₚ Clique"
        problem="พิสูจน์ว่า Clique เป็น NP-Hard โดย reduce จาก 3-SAT"
        steps={[
          { title: "Setup", body: "Input 3-SAT: φ = C₁ ∧ C₂ ∧ ... ∧ Cₘ\nแต่ละ Cᵢ = (lᵢ₁ ∨ lᵢ₂ ∨ lᵢ₃)\n\nต้องการสร้าง graph G ที่: φ satisfiable ⟺ G มี clique ขนาด m", why: "Decision version ของ Clique = ‘มี clique ≥ k ไหม’" },
          { title: "Construction", body: "Vertices: สร้าง vertex สำหรับทุก literal ในทุก clause (3m vertices)\nEdges: ใส่ edge ระหว่าง vertex u (clause i) กับ v (clause j) <b>ถ้า</b>:\n  • i ≠ j (ต่าง clause), <b>และ</b>\n  • u ไม่ใช่ negation ของ v", why: "Edge แทน ‘เลือกพร้อมกันได้’" },
          { title: "Forward (φ sat → clique)", body: "ถ้า φ satisfiable → มี truth assignment T\nในแต่ละ clause เลือก 1 literal ที่ T ทำให้เป็น true\n→ ได้ m vertices ที่ pairwise compatible → clique ขนาด m ✓", why: "Literals ที่ true พร้อมกันต้องไม่ conflict" },
          { title: "Backward (clique → φ sat)", body: "ถ้ามี clique ขนาด m → ต้องมาจาก m clauses ต่างกัน (1 ต่อ clause)\nไม่มี conflict → set ทุก literal ที่อยู่ใน clique เป็น true\n→ ทุก clause มี literal true → φ sat ✓", why: "Clique ใหญ่ ⟺ assignment ที่ satisfy" },
          { title: "Polynomial?", body: "Vertices = 3m, Edges = O(m²) → poly", why: "Construction รวดเร็ว" },
        ]}
        answer="∴ 3-SAT ≤ₚ Clique → Clique เป็น NP-Hard (และ ∈ NP → NP-Complete) ▢"
        takeaway="Reduction กลายเป็น <b>construction</b> ที่ preserve answer แบบสองทาง"
      />

      <WE15
        title="Reduction: Vertex Cover ≤ₚ Independent Set"
        problem="แสดงว่าทั้งสองยากเท่ากัน (duality)"
        steps={[
          { title: "Definitions", body: "<b>Vertex Cover (VC):</b> set S ⊆ V ที่ทุก edge มี endpoint อยู่ใน S\n<b>Independent Set (IS):</b> set I ⊆ V ที่ไม่มี edge ระหว่างกัน", why: "ปัญหาคู่กัน" },
          { title: "Key Observation", body: "<b>S เป็น VC ⟺ V \\ S เป็น IS</b>\nเพราะ: ถ้า edge (u,v) ทั้งสองอยู่นอก S → S ไม่ cover edge นี้ → ขัดแย้ง", why: "Complement = IS" },
          { title: "Reduction", body: "Question: ‘มี VC ขนาด ≤ k ไหม?’\n⟺ ‘มี IS ขนาด ≥ n-k ไหม?’\n\nReduction = ส่ง (G, k) → (G, n-k) — O(1)", why: "Trivial reduction" },
        ]}
        answer="VC ≤ₚ IS และ IS ≤ₚ VC — ทั้งคู่ NP-Complete ▢"
      />

      <h3>ห่วงโซ่ NP-Complete ที่สำคัญ</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0', fontFamily: 'monospace', fontSize: 14 }}>
        SAT (Cook 1971)<br/>
        ↓ Karp's reductions (1972)<br/>
        3-SAT → Clique → Independent Set → Vertex Cover<br/>
        3-SAT → 3-Dimensional Matching → Subset Sum → Knapsack<br/>
        Vertex Cover → Hamiltonian Cycle → TSP<br/>
        3-SAT → Graph Coloring (3-Color)
      </div>

      <CS15 title="Reduction Cheat Sheet" sections={[
        { label: "เขียน A ≤ₚ B แปลว่า", value: "‘แก้ B → แก้ A ได้’<br/>B ยากเท่ากับหรือมากกว่า A" },
        { label: "พิสูจน์ NP-Hard", value: "หา NP-Hard A ที่รู้แล้ว → reduce A ≤ₚ B" },
        { label: "พิสูจน์ NP-Complete", value: "(1) B ∈ NP + (2) NP-Hard" },
        { label: "ทิศทาง reduction", value: "<b>เรียบเทียบ:</b> reduce <b>จาก</b> ปัญหายาก <b>ไปสู่</b> ปัญหาใหม่<br/>(ไม่ใช่กลับกัน!)" },
      ]} />

      <PF15 items={[
        { trap: "ทิศทาง reduction ผิด — ‘ปัญหาใหม่ ≤ₚ ปัญหายาก’", fix: "ต้องเป็น <b>ปัญหายาก ≤ₚ ปัญหาใหม่</b> — เพื่อ ‘ปัญหาใหม่ยากเท่ายาก’" },
        { trap: "ลืม poly time", fix: "Construction ต้องเป็น poly — ถ้า exponential ไม่นับ" },
        { trap: "พิสูจน์ wrong direction (⟹ อย่างเดียว)", fix: "ต้องพิสูจน์ <b>⟺ ทั้งสองทาง</b>" },
      ]} />

      <Quiz15 q={{
        question: "ถ้าเรามี A ≤ₚ B และ B ∈ P สรุปได้ว่า?",
        options: ["A ∈ NP", "A ∈ P", "A เป็น NP-Hard", "ไม่สรุปได้"],
        answer: 1,
        explain: "B แก้เร็ว → ใช้ reduction แปลง A เป็น B แล้วแก้ → A ก็แก้เร็ว → A ∈ P"
      }} />

      <Quiz15 q={{
        question: "ถ้า A เป็น NP-Complete และ A ≤ₚ B (B ∈ NP) สรุปได้ว่า?",
        options: ["B ∈ P", "B เป็น NP-Complete", "B เป็น NP-Hard เท่านั้น", "ไม่สรุปได้"],
        answer: 1,
        explain: "A NP-Hard → B NP-Hard, B ∈ NP → B NP-Complete"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   70 — NP-COMPLETE CATALOG
============================================================ */
const NPC_PROBLEMS = [
  {
    name: "SAT (Boolean Satisfiability)",
    input: "Boolean formula φ in CNF",
    q: "มี assignment ที่ทำให้ φ = true ไหม?",
    why: "ปัญหา NP-Complete ตัวแรก (Cook 1971)",
    npc_by: "Cook-Levin theorem (proof from Turing machine encoding)"
  },
  {
    name: "3-SAT",
    input: "CNF formula ที่แต่ละ clause มี exactly 3 literals",
    q: "มี assignment ที่ satisfy ไหม?",
    why: "ใช้ในการ reduce ไปปัญหาอื่นบ่อย",
    npc_by: "SAT ≤ₚ 3-SAT (แปลง clause ใหญ่ให้เหลือ 3 ด้วย dummy vars)"
  },
  {
    name: "Clique",
    input: "Graph G, integer k",
    q: "มี clique ขนาด ≥ k ใน G ไหม?",
    why: "Subgraph ที่ทุก vertex เชื่อมกันทั้งหมด",
    npc_by: "3-SAT ≤ₚ Clique (ดู worked example ในบทก่อน)"
  },
  {
    name: "Independent Set",
    input: "Graph G, integer k",
    q: "มี IS ขนาด ≥ k ไหม? (vertices ที่ไม่มี edge ระหว่างกัน)",
    why: "Complement ของ Clique",
    npc_by: "Clique ≤ₚ IS (ใช้ complement graph)"
  },
  {
    name: "Vertex Cover",
    input: "Graph G, integer k",
    q: "มี cover ขนาด ≤ k ไหม? (set ที่ทุก edge มี endpoint)",
    why: "Complement ของ IS",
    npc_by: "IS ≤ₚ VC (V \\ IS = VC)"
  },
  {
    name: "Hamiltonian Cycle",
    input: "Graph G",
    q: "มี cycle ที่ผ่านทุก vertex พอดี 1 ครั้งไหม?",
    why: "ต่างจาก Euler cycle (ผ่านทุก edge)",
    npc_by: "Vertex Cover ≤ₚ Hamiltonian (gadget construction ซับซ้อน)"
  },
  {
    name: "TSP — Traveling Salesman",
    input: "Weighted graph, integer k",
    q: "มี cycle ที่ครอบทุก vertex และน้ำหนัก ≤ k ไหม?",
    why: "Logistics, manufacturing",
    npc_by: "Hamiltonian ≤ₚ TSP (weights 1/∞)"
  },
  {
    name: "Subset Sum",
    input: "Set S of integers, target T",
    q: "มี subset ที่ผลรวม = T ไหม?",
    why: "พื้นฐานของ cryptography",
    npc_by: "3-SAT ≤ₚ Subset Sum"
  },
  {
    name: "0/1 Knapsack (decision)",
    input: "Items (weight, value), capacity W, target value V",
    q: "เลือก subset ได้ value ≥ V โดย weight ≤ W ไหม?",
    why: "Classic optimization (DP O(nW) เป็น pseudo-poly)",
    npc_by: "Subset Sum ≤ₚ Knapsack"
  },
  {
    name: "Graph Coloring (k-Color)",
    input: "Graph G, integer k",
    q: "ระบายสี vertex ด้วย k สี โดย adjacent vertices สีต่างกันได้ไหม?",
    why: "k=2 อยู่ใน P (bipartite), k≥3 NP-C",
    npc_by: "3-SAT ≤ₚ 3-Color"
  },
  {
    name: "Set Cover",
    input: "Universe U, collection of subsets, integer k",
    q: "เลือก ≤ k subset ที่ union ครอบ U ได้ไหม?",
    why: "ลดได้จาก Vertex Cover (special case)",
    npc_by: "Vertex Cover ≤ₚ Set Cover"
  },
  {
    name: "3D Matching",
    input: "Triples (X×Y×Z), target k",
    q: "เลือก ≥ k triples ที่ไม่ใช้ element ซ้ำได้ไหม?",
    why: "Generalization ของ bipartite matching",
    npc_by: "3-SAT ≤ₚ 3DM (Karp 1972)"
  },
];

Lessons15["np-complete-problems"] = function () {
  const [pick, setPick] = useS15(0);
  const p = NPC_PROBLEMS[pick];

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📚 NP-Complete Catalog</div>
        ปัญหา NP-Complete ที่<b>เห็นบ่อยที่สุดในข้อสอบ</b> — รู้ให้ครบ แล้วจำว่ามาจาก reduction อะไร
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        {NPC_PROBLEMS.map((p, i) => (
          <button key={i} onClick={() => setPick(i)}
            style={{
              background: pick === i ? 'var(--accent)' : 'var(--bg-2)',
              color: pick === i ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
              fontWeight: pick === i ? 600 : 400
            }}>
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 18, borderRadius: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-2)', marginBottom: 10 }}>{p.name}</div>
        <div style={{ marginBottom: 10 }}><b style={{ color: 'var(--accent)' }}>Input:</b> {p.input}</div>
        <div style={{ marginBottom: 10 }}><b style={{ color: 'var(--accent)' }}>Decision Question:</b> {p.q}</div>
        <div style={{ marginBottom: 10 }}><b style={{ color: 'var(--accent)' }}>ทำไมสำคัญ:</b> {p.why}</div>
        <div style={{ padding: 10, background: 'rgba(168,139,250,0.1)', borderLeft: '3px solid #a78bfa', borderRadius: 6 }}>
          <b style={{ color: '#a78bfa' }}>NP-C proof:</b> {p.npc_by}
        </div>
      </div>

      <h3>แผนภาพ Karp's Reductions (1972)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 20, borderRadius: 10, textAlign: 'center', fontSize: 13, fontFamily: 'monospace', whiteSpace: 'pre' }}>
{`             SAT
              ↓
            3-SAT
       /      |       \\
   Clique   Subset Sum  3-Color
     ↓        ↓
     IS       Knapsack
     ↓
     VC
     ↓
   Hamiltonian
     ↓
    TSP`}
      </div>

      <h3>กลยุทธ์เลือก reduction ในข้อสอบ</h3>
      <table className="cmp">
        <thead><tr><th>ถ้าโจทย์เกี่ยวกับ...</th><th>ลองลดจาก</th></tr></thead>
        <tbody>
          <tr><td>Graph + เลือก vertex/edge</td><td>Vertex Cover, IS, Clique, Hamiltonian</td></tr>
          <tr><td>เลือก subset ของตัวเลข</td><td>Subset Sum, Knapsack</td></tr>
          <tr><td>Assign ค่า binary/multi-way</td><td>3-SAT, k-Color</td></tr>
          <tr><td>หา cycle/path สั้นสุด ครอบบางอย่าง</td><td>TSP, Hamiltonian</td></tr>
          <tr><td>Schedule/Pack/Cover</td><td>Bin Packing, Set Cover</td></tr>
        </tbody>
      </table>

      <PF15 items={[
        { trap: "0/1 Knapsack แก้ได้ O(nW) → คิดว่าเป็น P", fix: "O(nW) เป็น <b>pseudo-polynomial</b> — W ในไบนารีคือ log W bits → จริง ๆ exponential ใน input size" },
        { trap: "Graph Coloring k=2 → NP-C", fix: "k=2 (bipartite check) <b>อยู่ใน P</b> ด้วย BFS, NP-C เริ่ม k≥3" },
        { trap: "TSP มี approximation 2-approx → คิดว่าง่าย", fix: "Approximation มีเฉพาะ <b>metric TSP</b> (triangle inequality) — general TSP ไม่มี constant ratio approximation (ถ้า P≠NP)" },
      ]} />

      <Quiz15 q={{
        question: "Independent Set อยู่ใน P หรือ NP-Complete?",
        options: ["P (ใช้ greedy)", "NP-Complete (ทั่วไป)", "NP-Hard เท่านั้น", "EXPTIME"],
        answer: 1,
        explain: "IS ทั่วไปเป็น NP-Complete (reduce จาก Clique). มี special case ใน P เช่น tree, bipartite, interval graph"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   71 — APPROXIMATION ALGORITHMS
============================================================ */
Lessons15["approximation"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        ถ้าปัญหา NP-Hard แก้ optimal ไม่ได้ → ใช้ <b>approximation</b> ที่ใกล้ optimal และทำงานเร็ว
      </div>

      <h3>นิยาม — ρ-Approximation</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        Algorithm A เป็น <b>ρ-approximation</b> สำหรับ minimization problem ⟺<br/>
        <span style={{ fontFamily: 'monospace', fontSize: 14 }}>
          ∀ instance I: A(I) ≤ ρ · OPT(I)
        </span><br/><br/>
        ρ = 1 → optimal<br/>
        ρ = 2 → ผลลัพธ์แย่ที่สุดเป็น 2 เท่าของ optimal
      </div>

      <WE15
        title="2-Approx for Vertex Cover"
        problem="หา VC ขนาดเล็กสุด — NP-Hard"
        steps={[
          { title: "Algorithm", body: "C = ∅\nwhile มี edge ที่ uncovered:\n  เลือก edge (u, v) ใดก็ได้\n  เพิ่ม u และ v เข้า C\n  ลบ edge ที่ติด u หรือ v ออก\nreturn C", why: "Greedy แบบ ‘เผื่อ’" },
          { title: "Time", body: "O(V + E) — แต่ละ edge ดูครั้งเดียว", why: "Linear" },
          { title: "Approximation Ratio Proof", body: "ให้ M = edges ที่เลือก (matching)\n|C| = 2|M|\n\nใน OPT VC: ทุก edge ใน M ต้องมี ≥ 1 endpoint ใน OPT\n→ |OPT| ≥ |M|\n→ |C| = 2|M| ≤ 2|OPT| ✓", why: "Pigeon hole + property ของ matching" },
        ]}
        answer="2-approximation — VC ที่ได้ ≤ 2 × OPT ▢"
        takeaway="Greedy ที่ดูธรรมดา ให้ ratio คงที่ — ‘แย่กว่า optimal ไม่เกิน 2 เท่า’"
      />

      <WE15
        title="2-Approx for Metric TSP (Christofides → 1.5)"
        problem="Metric TSP — graph มี triangle inequality"
        steps={[
          { title: "Algorithm (MST-based)", body: "1. หา MST T ของกราฟ\n2. ทำ DFS ใน T → ได้ลำดับ vertex (พบซ้ำได้)\n3. ‘ตัด shortcut’ — ข้าม vertex ที่เคยเยี่ยมแล้ว", why: "ใช้ MST เป็น lower bound" },
          { title: "Ratio Proof", body: "Cost(MST) ≤ Cost(OPT TSP) — เพราะ TSP minus 1 edge = spanning tree\nCost(DFS walk) = 2·Cost(MST) — เดินไปกลับ\nCost(shortcut) ≤ Cost(walk) — triangle inequality\n\n→ ALG ≤ 2·MST ≤ 2·OPT", why: "ใช้ MST bound + triangle inequality" },
        ]}
        answer="2-approximation สำหรับ Metric TSP ▢ — Christofides (1976) ทำได้ 1.5-approx"
      />

      <h3>ตารางผลที่รู้</h3>
      <table className="cmp">
        <thead><tr><th>ปัญหา</th><th>Best Known Ratio</th><th>หมายเหตุ</th></tr></thead>
        <tbody>
          <tr><td>Vertex Cover</td><td>2</td><td>ไม่รู้ว่ามี &lt; 2 ไหม</td></tr>
          <tr><td>Metric TSP</td><td>1.5 (Christofides)</td><td>ล่าสุด 2020: 1.5 − ε</td></tr>
          <tr><td>Set Cover</td><td>ln n</td><td>Tight (under P ≠ NP)</td></tr>
          <tr><td>Knapsack (FPTAS)</td><td>1 + ε</td><td>polynomial in 1/ε</td></tr>
          <tr><td>General TSP</td><td>ไม่มี constant ratio</td><td>ถ้า P ≠ NP</td></tr>
          <tr><td>Max Independent Set</td><td>n^(1-ε) hard</td><td>เกือบไม่ approximate ได้</td></tr>
        </tbody>
      </table>

      <h3>ระดับความ ‘ดี’ ของ approximation</h3>
      <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li><b>PTAS (Polynomial-Time Approx Scheme):</b> ทำ ratio (1+ε) ใน poly time สำหรับทุก ε &gt; 0</li>
        <li><b>FPTAS:</b> PTAS ที่ poly ใน <b>1/ε</b> ด้วย — ดีที่สุด (Knapsack มี)</li>
        <li><b>APX-Hard:</b> ไม่มี PTAS (under P≠NP) — Vertex Cover, Max-3-SAT</li>
      </ul>

      <CS15 title="Approximation Cheat Sheet" sections={[
        { label: "ρ-approx", value: "min: ALG ≤ ρ·OPT (ρ ≥ 1)<br/>max: ALG ≥ OPT/ρ" },
        { label: "Vertex Cover", value: "2-approx ด้วย matching greedy" },
        { label: "Set Cover", value: "ln n-approx ด้วย greedy (เลือก subset ที่ครอบ uncovered มากสุด)" },
        { label: "Metric TSP", value: "2-approx ด้วย MST<br/>1.5-approx ด้วย Christofides" },
        { label: "Knapsack", value: "FPTAS — scaling + DP" },
      ]} />

      <Quiz15 q={{
        question: "ทำไม MST → 2-approx TSP ใช้ได้เฉพาะ <b>Metric</b> TSP?",
        options: [
          "Metric TSP มี edge น้อยกว่า",
          "ต้องการ triangle inequality เพื่อให้ shortcut ดีกว่าหรือเท่ากับ walk",
          "MST แก้ไม่ได้ใน general graph",
          "Metric TSP อยู่ใน P"
        ],
        answer: 1,
        explain: "Triangle inequality: w(u,v) ≤ w(u,x) + w(x,v) — ให้การ shortcut ไม่แย่ลงกว่าเดิม"
      }} />

      <Quiz15 q={{
        question: "ถ้า P ≠ NP, ปัญหาไหนพิสูจน์ว่า ‘ไม่มี constant-ratio approximation’?",
        options: ["Vertex Cover", "Set Cover", "Knapsack", "General TSP (non-metric)"],
        answer: 3,
        explain: "General TSP — เพราะถ้ามี c-approx → ใช้ตรวจ Hamiltonian cycle ได้ → P=NP"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart15 = Lessons15;
