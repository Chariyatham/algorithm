/* Lessons Part 22 — C++ Foundations Deep: I/O, Pointers, Memory Model, Modern C++ */

const { useState: useS22, useMemo: useM22 } = React;
const { Quiz: Quiz22 } = window.LessonComponents;
const { WorkedExample: WE22, CheatSheet: CS22, Pitfalls: PF22 } = window.LearningKit;

const Lessons22 = {};

/* ============================================================
   Shared Viz — Memory Diagram (stack + heap + pointer arrows)
============================================================ */
function MemoryDiagramViz() {
  const STEPS = [
    { code: '// เริ่ม — stack ว่าง', stack: [], heap: [], arrow: null, hi: null },
    { code: 'int x = 42;', stack: [{ name: 'x', val: 42, addr: '0x100' }], heap: [], arrow: null, hi: 'x' },
    { code: 'int* p = &x;', stack: [{ name: 'x', val: 42, addr: '0x100' }, { name: 'p', val: '0x100', addr: '0x108' }], heap: [], arrow: { from: 1, to: 0 }, hi: 'p' },
    { code: '*p = 100;  // เขียนผ่าน pointer', stack: [{ name: 'x', val: 100, addr: '0x100' }, { name: 'p', val: '0x100', addr: '0x108' }], heap: [], arrow: { from: 1, to: 0 }, hi: 'x' },
    { code: 'int* q = new int(7);  // heap', stack: [{ name: 'x', val: 100, addr: '0x100' }, { name: 'p', val: '0x100', addr: '0x108' }, { name: 'q', val: '0xH00', addr: '0x110' }], heap: [{ val: 7, addr: '0xH00' }], arrow: { from: 1, to: 0 }, arrow2: { from: 2, to: 0, heap: true }, hi: 'q' },
    { code: 'delete q;  // ปล่อย heap', stack: [{ name: 'x', val: 100, addr: '0x100' }, { name: 'p', val: '0x100', addr: '0x108' }, { name: 'q', val: 'dangling', addr: '0x110' }], heap: [], arrow: { from: 1, to: 0 }, hi: 'q' },
  ];
  const [step, setStep] = useS22(0);
  const cur = STEPS[step];

  const stackY = (i) => 50 + i * 36;
  const heapY = (i) => 50 + i * 36;

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 8 }}>
        <button onClick={() => setStep(0)}>↺ Reset</button>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>◀ ก่อนหน้า</button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>ถัดไป ▶</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Step {step + 1} / {STEPS.length}</span>
      </div>

      <div style={{ background: 'var(--bg-1)', padding: 10, borderRadius: 6, marginBottom: 10, fontFamily: 'monospace', fontSize: 14, color: 'var(--accent-2)', minHeight: 22 }}>
        <span style={{ color: 'var(--text-3)' }}>&gt; </span>{cur.code}
      </div>

      <svg width="100%" viewBox="0 0 480 280" style={{ background: 'var(--bg-1)', borderRadius: 6 }}>
        <defs>
          <marker id="arrh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#fbbf24" />
          </marker>
        </defs>
        {/* Stack region */}
        <rect x={20} y={20} width={200} height={250} fill="rgba(94,234,212,0.05)" stroke="var(--accent-2)" strokeWidth={1.5} rx={6} />
        <text x={120} y={15} fill="var(--accent-2)" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="2">STACK</text>
        {cur.stack.map((s, i) => {
          const isHi = cur.hi === s.name;
          return (
            <g key={i}>
              <rect x={30} y={stackY(i)} width={130} height={28} rx={4}
                fill={isHi ? 'rgba(94,234,212,0.3)' : 'var(--bg-3)'}
                stroke={isHi ? 'var(--accent-2)' : 'var(--border)'} strokeWidth={isHi ? 2 : 1} />
              <text x={40} y={stackY(i) + 18} fill="var(--text-0)" fontSize="13" fontFamily="monospace">
                {s.name} = {s.val}
              </text>
              <text x={165} y={stackY(i) + 18} fill="var(--text-3)" fontSize="10" fontFamily="monospace">{s.addr}</text>
            </g>
          );
        })}

        {/* Heap region */}
        <rect x={280} y={20} width={180} height={250} fill="rgba(168,139,250,0.05)" stroke="#a78bfa" strokeWidth={1.5} rx={6} strokeDasharray="4,3" />
        <text x={370} y={15} fill="#a78bfa" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="2">HEAP</text>
        {cur.heap.map((h, i) => (
          <g key={i}>
            <rect x={290} y={heapY(i)} width={130} height={28} rx={4}
              fill="rgba(168,139,250,0.2)" stroke="#a78bfa" strokeWidth={2} />
            <text x={300} y={heapY(i) + 18} fill="var(--text-0)" fontSize="13" fontFamily="monospace">
              value = {h.val}
            </text>
            <text x={425} y={heapY(i) + 18} fill="var(--text-3)" fontSize="10" fontFamily="monospace">{h.addr}</text>
          </g>
        ))}

        {/* Arrow: pointer (within stack) */}
        {cur.arrow && (
          <line
            x1={70} y1={stackY(cur.arrow.from) + 14}
            x2={70} y2={stackY(cur.arrow.to) + 14}
            stroke="#fbbf24" strokeWidth={2} markerEnd="url(#arrh)"
          />
        )}
        {/* Arrow: pointer to heap */}
        {cur.arrow2 && (
          <line
            x1={160} y1={stackY(cur.arrow2.from) + 14}
            x2={290} y2={heapY(0) + 14}
            stroke="#fbbf24" strokeWidth={2} markerEnd="url(#arrh)"
          />
        )}
      </svg>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <b>Stack</b> = auto cleanup ตอนออก scope · <b>Heap</b> = ต้อง <code>delete</code> เอง · <b>Arrow</b> = pointer ชี้ไปยัง address
      </div>
    </div>
  );
}

/* ============================================================
   cpp-io — I/O แบบลึก (cin/cout/getline/format)
============================================================ */
Lessons22["cpp-io"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ I/O ของ C++ ลึกพอใช้สอบ/แข่ง — รับ input หลายแบบ, จัด format output, ทำให้ I/O เร็ว
      </div>

      <h3>1. cout — Output</h3>
      <pre className="code-block">{`#include <iostream>
using namespace std;

int main() {
  cout << "Hello" << endl;       // \\n + flush
  cout << "Hello\\n";              // \\n เร็วกว่า (ไม่ flush)
  cout << 42 << " " << 3.14 << "\\n";
  // ส่ง 4 ค่า: "42 3.14"
}`}</pre>

      <div className="callout tip">
        <div className="ttl">💡 endl vs \\n</div>
        <b><code>endl</code></b> = <code>"\\n"</code> + <code>flush</code> (เขียนลง buffer ทันที)<br/>
        <b><code>"\\n"</code></b> = แค่ขึ้นบรรทัด — เร็วกว่ามากใน loop ที่ print เยอะ
      </div>

      <h3>2. cin — Input</h3>
      <pre className="code-block">{`int a, b;
cin >> a >> b;                  // อ่าน 2 ตัวเลขคั่นด้วย whitespace

string s;
cin >> s;                       // อ่าน 1 word (หยุดที่ space)

string line;
getline(cin, line);             // อ่านทั้งบรรทัด (จนถึง \\n)

// ⚠️ Pitfall: cin >> n; getline(cin, line);
// → getline จะอ่าน "" (newline ค้างจาก cin >> n)
// แก้: cin.ignore(); ก่อน getline`}</pre>

      <h3>3. รับ input จนหมด (Loop)</h3>
      <pre className="code-block">{`// แบบที่ 1: รู้จำนวน
int n; cin >> n;
vector<int> a(n);
for (int i = 0; i < n; i++) cin >> a[i];

// แบบที่ 2: รับจนหมด file (EOF)
int x;
while (cin >> x) {
  // process x
}
// cin >> x return false เมื่อ EOF หรือ parse fail

// แบบที่ 3: รับทั้งบรรทัด หลายบรรทัด
string line;
while (getline(cin, line)) {
  // process line
}`}</pre>

      <h3>4. cin.fail() — เช็คว่า input ผิดประเภท</h3>
      <pre className="code-block">{`int x;
cin >> x;
if (cin.fail()) {
  cout << "Invalid input!\\n";
  cin.clear();                   // reset error flag
  cin.ignore(10000, '\\n');       // throw away bad input
}`}</pre>

      <h3>5. Format Output (&lt;iomanip&gt;)</h3>
      <pre className="code-block">{`#include <iomanip>

double pi = 3.14159265;
cout << fixed << setprecision(2) << pi;
// → "3.14"

cout << setw(10) << 42;
// → "        42"  (right-aligned in 10 cols)

cout << setfill('0') << setw(4) << 7;
// → "0007"

cout << hex << 255 << "\\n";       // → "ff"
cout << oct << 8 << "\\n";         // → "10"
cout << dec << 100 << "\\n";       // → "100" (back to decimal)`}</pre>

      <h3>6. Fast I/O — สำหรับ contest</h3>
      <pre className="code-block">{`int main() {
  ios_base::sync_with_stdio(false);   // ตัดการ sync กับ C I/O
  cin.tie(NULL);                       // ไม่ flush cout ก่อน cin

  // ตอนนี้ cin/cout เร็วเท่า scanf/printf
}`}</pre>

      <div className="callout warn">
        <div className="ttl">⚠ คำเตือน sync_with_stdio(false)</div>
        ห้ามใช้ <code>printf/scanf</code> ปนกับ <code>cout/cin</code> หลัง <code>sync_with_stdio(false)</code><br/>
        จะ output ผิดลำดับเพราะแยก buffer
      </div>

      <WE22
        title="Worked Example — อ่าน n + array, print เป็น space-separated"
        problem="Input: 3<br/>4 1 7<br/><br/>Output: 1 4 7"
        steps={[
          { title: "อ่าน n", body: "int n; cin >> n;", why: "ตัวเลขแรกบอกขนาด" },
          { title: "อ่าน array", body: "vector<int> a(n);\nfor (int i = 0; i < n; i++) cin >> a[i];", why: "ใช้ vector(n) สร้าง 0-filled แล้ว overwrite" },
          { title: "Sort", body: "sort(a.begin(), a.end());", why: "STL sort O(n log n)" },
          { title: "Print", body: "for (int i = 0; i < n; i++)\n  cout << a[i] << (i+1<n ? ' ' : '\\n');", why: "เว้น space ระหว่าง, newline ท้าย" },
        ]}
        answer="โค้ดข้างบนทำงานครบ — เพิ่ม sync_with_stdio(false) ถ้า n ใหญ่"
      />

      <CS22 title="C++ I/O Cheat Sheet" sections={[
        { label: "Output", value: "<code>cout &lt;&lt; x &lt;&lt; \"\\\\n\";</code><br/>หลีกเลี่ยง <code>endl</code> ใน loop" },
        { label: "Input number", value: "<code>cin &gt;&gt; x;</code> — skip whitespace" },
        { label: "Input line", value: "<code>getline(cin, s);</code>" },
        { label: "Until EOF", value: "<code>while (cin &gt;&gt; x) { ... }</code>" },
        { label: "Format float", value: "<code>cout &lt;&lt; fixed &lt;&lt; setprecision(2)</code>" },
        { label: "Fast I/O", value: "<code>ios::sync_with_stdio(false);<br/>cin.tie(NULL);</code>" },
      ]} />

      <PF22 items={[
        { trap: "ใช้ <code>endl</code> ใน loop ที่ print 10⁶ ครั้ง", fix: "ใช้ <code>\"\\\\n\"</code> แทน → เร็วขึ้น 5-10 เท่า" },
        { trap: "<code>cin &gt;&gt; n; getline(cin, s);</code> อ่าน s ว่าง", fix: "เพิ่ม <code>cin.ignore();</code> ระหว่างกลาง" },
        { trap: "ใช้ <code>cout</code> ปน <code>printf</code> หลัง sync_with_stdio(false)", fix: "เลือกใช้ฝั่งใดฝั่งหนึ่งให้ตลอด" },
        { trap: "ลืม include <code>&lt;iomanip&gt;</code>", fix: "<code>setprecision/setw/setfill</code> อยู่ใน <code>&lt;iomanip&gt;</code> ไม่ใช่ <code>&lt;iostream&gt;</code>" },
      ]} />

      <Quiz22 q={{
        question: "ทำไม fast I/O (<code>sync_with_stdio(false) + cin.tie(NULL)</code>) ช่วย contest?",
        options: [
          "ลด memory usage",
          "ตัด overhead ของ C/C++ I/O sync และ flush อัตโนมัติ",
          "ทำให้ algorithm เร็วขึ้น",
          "ช่วยให้โค้ดสั้นลง"
        ],
        answer: 1,
        explain: "Default <code>cin</code> sync กับ <code>scanf</code> และ flush <code>cout</code> ก่อนทุก <code>cin</code> → overhead เยอะ. ตัด 2 อย่างนี้ → I/O เร็วเท่า scanf/printf"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   cpp-pointers — Pointers vs References (ลึก)
============================================================ */
Lessons22["cpp-pointers"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ pointer / reference / address — พื้นฐานที่ทำให้เข้าใจ linked list, tree, vector resize, function pass-by
      </div>

      <h3>1. Memory & Address</h3>
      <p>
        ทุกตัวแปรในโปรแกรมมี <b>address</b> (ที่อยู่ในหน่วยความจำ)<br/>
        <b>Pointer</b> = ตัวแปรที่เก็บ address ของตัวแปรอื่น
      </p>
      <pre className="code-block">{`int x = 42;
int* p = &x;        // p เก็บ address ของ x
                    // & = "address of"

cout << x;          // 42
cout << &x;         // 0x7fff... (address)
cout << p;          // เหมือนกัน
cout << *p;         // 42 ("dereference" — ค่าที่ address นี้)`}</pre>

      <h3>🎬 Interactive — เดิน step ดู memory เปลี่ยน</h3>
      <MemoryDiagramViz />

      <h3>2. nullptr — Pointer ว่าง</h3>
      <pre className="code-block">{`int* p = nullptr;     // ไม่ชี้ไปไหน
if (p != nullptr) {   // ตรวจก่อน dereference
  cout << *p;
}

// ❌ ห้าม: cout << *p;  // segfault ถ้า p = nullptr`}</pre>

      <h3>3. Reference (<code>&</code>) — alias ของตัวแปร</h3>
      <pre className="code-block">{`int x = 10;
int& r = x;           // r เป็นชื่อเล่นของ x
r = 20;               // ⟺ x = 20
cout << x;            // 20

// vs pointer:
int* p = &x;
*p = 30;              // ⟺ x = 30 (ต้อง * ทุกครั้ง)`}</pre>

      <h3>Pointer vs Reference</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Pointer (<code>int*</code>)</th><th>Reference (<code>int&amp;</code>)</th></tr></thead>
        <tbody>
          <tr><td>Re-assign</td><td>✓ ได้ — ชี้ไปตัวอื่น</td><td>✗ ไม่ได้ — ผูกตลอดชีวิต</td></tr>
          <tr><td>Null</td><td>✓ <code>nullptr</code></td><td>✗ ต้อง init ที่ตัวจริง</td></tr>
          <tr><td>Dereference syntax</td><td><code>*p</code>, <code>p-&gt;</code></td><td>ใช้ตรง ๆ เหมือนตัวแปร</td></tr>
          <tr><td>Use case</td><td>Dynamic structures (linked list, tree), <code>nullptr</code> sentinel</td><td>Pass-by-ref, range-for, simpler aliases</td></tr>
        </tbody>
      </table>

      <h3>4. Pass-by-value vs Pass-by-reference vs Pass-by-pointer</h3>
      <pre className="code-block">{`void byValue(int x) { x = 100; }           // copy — caller ไม่เปลี่ยน
void byReference(int& x) { x = 100; }      // alias — caller เปลี่ยน
void byPointer(int* p) { *p = 100; }       // ผ่าน address — caller เปลี่ยน

int main() {
  int a = 5, b = 5, c = 5;
  byValue(a);                              // a still 5
  byReference(b);                          // b = 100
  byPointer(&c);                           // c = 100
}`}</pre>

      <h3>5. Pointer Arithmetic — Pointers กับ Arrays</h3>
      <pre className="code-block">{`int arr[5] = {10, 20, 30, 40, 50};
int* p = arr;          // arr "decay" เป็น pointer ไปยัง arr[0]

cout << *p;            // 10
cout << *(p + 2);      // 30 — p+2 ชี้ไปยัง arr[2]
cout << p[2];          // 30 — syntax สั้นกว่า

// ⟺ arr[i] == *(arr + i)`}</pre>

      <h3>6. Pointer ไป Struct — <code>-&gt;</code> operator</h3>
      <pre className="code-block">{`struct Node {
  int val;
  Node* next;
};

Node* head = new Node{10, nullptr};
cout << (*head).val;    // 10
cout << head->val;      // 10 — สั้นกว่า

head->next = new Node{20, nullptr};
cout << head->next->val;  // 20`}</pre>

      <WE22
        title="Linked List Insertion at Head"
        problem="ใส่ value ใหม่ที่หัวของ linked list"
        steps={[
          { title: "Setup", body: "struct Node {\n  int val;\n  Node* next;\n};\nNode* head = nullptr;", why: "head = nullptr คือ list ว่าง" },
          { title: "Insert(3)", body: "Node* n = new Node{3, head};\nhead = n;", why: "สร้าง node ใหม่ ให้ next ชี้ไป head เก่า แล้ว update head" },
          { title: "Insert(5)", body: "n = new Node{5, head};\nhead = n;\n// List: 5 → 3", why: "ทำซ้ำ — O(1) ต่อครั้ง" },
          { title: "Traverse", body: "for (Node* p = head; p; p = p->next) {\n  cout << p->val;\n}", why: "loop จนกว่า p = nullptr (จบ list)" },
        ]}
        answer="Insert at head = O(1) ▢ — ใช้ pointer ทำงานเป็นหลัก"
        takeaway="pointer = ทำให้ data structure ‘ยืดได้’ และเชื่อมต่อกันได้แบบ dynamic"
      />

      <CS22 title="Pointer Cheat Sheet" sections={[
        { label: "Declare", value: "<code>int* p = &x;</code>" },
        { label: "Dereference", value: "<code>*p</code> = ค่าที่ address" },
        { label: "Member access", value: "<code>p-&gt;field</code> = <code>(*p).field</code>" },
        { label: "Array equiv", value: "<code>arr[i]</code> = <code>*(arr+i)</code>" },
        { label: "Null check", value: "<code>if (p) ... </code> หรือ <code>if (p != nullptr)</code>" },
        { label: "Reference", value: "<code>int&amp; r = x;</code> — bind once, no nullptr" },
      ]} />

      <PF22 items={[
        { trap: "Dereference <code>nullptr</code> → segfault", fix: "ตรวจ <code>if (p)</code> ก่อนใช้เสมอ" },
        { trap: "Reference ไม่ init: <code>int&amp; r;</code>", fix: "Reference ต้อง bind ตอนสร้าง — <code>int&amp; r = x;</code>" },
        { trap: "Return reference ของ local variable", fix: "Local ตายเมื่อ function จบ → dangling reference. คืน by value แทน" },
        { trap: "เปรียบเทียบ pointer ด้วย ==", fix: "เทียบ <b>address</b> ไม่ใช่ค่า. ถ้าอยาก เทียบค่าใช้ <code>*p1 == *p2</code>" },
      ]} />

      <Quiz22 q={{
        question: "ถ้า <code>int x = 5; int* p = &amp;x; *p = 10;</code> ค่าของ x?",
        options: ["5", "10", "address ของ x", "undefined"],
        answer: 1,
        explain: "<code>*p = 10</code> เปลี่ยนค่าที่ p ชี้ไป (ซึ่งคือ x) → x = 10"
      }} />

      <Quiz22 q={{
        question: "ข้อใดถูกต้อง?",
        options: [
          "Reference สามารถ re-bind ไปตัวแปรอื่นได้",
          "Pointer ต้อง init ที่ตัวจริงตอนสร้าง ห้าม nullptr",
          "<code>arr[i]</code> ⟺ <code>*(arr + i)</code>",
          "ใช้ <code>.field</code> กับ pointer ได้เลย"
        ],
        answer: 2,
        explain: "Array indexing เป็น syntactic sugar ของ pointer arithmetic — ข้ออื่นผิด: reference bind ครั้งเดียว, pointer สร้างเป็น nullptr ได้, ต้องใช้ <code>-&gt;</code> หรือ <code>(*p).</code>"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   cpp-memory — Stack vs Heap, new/delete, Smart Pointers
============================================================ */
Lessons22["cpp-memory"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เข้าใจ <b>memory model</b> ของ C++ — ทำไม vector ดีกว่า array ดิบ, อะไรคือ memory leak, ทำไม recursion ลึกแล้วเจ๊ง
      </div>

      <h3>1. 2 ส่วนของ memory: Stack vs Heap</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Stack</th><th>Heap</th></tr></thead>
        <tbody>
          <tr><td>Allocate</td><td>อัตโนมัติ (local var, function call)</td><td>Manual ด้วย <code>new</code>/<code>malloc</code></td></tr>
          <tr><td>Deallocate</td><td>อัตโนมัติ (เมื่อออก scope)</td><td>Manual <code>delete</code>/<code>free</code> ↯</td></tr>
          <tr><td>ขนาด</td><td>เล็ก (1-8 MB เริ่มต้น)</td><td>ใหญ่ (เกือบ RAM ทั้งหมด)</td></tr>
          <tr><td>ความเร็ว</td><td>เร็วมาก (pointer bump)</td><td>ช้ากว่า (อาจ search free block)</td></tr>
          <tr><td>Lifetime</td><td>จำกัดที่ scope</td><td>จนกว่าจะ <code>delete</code></td></tr>
          <tr><td>ตัวอย่าง</td><td><code>int x; vector&lt;int&gt; v;</code></td><td><code>int* p = new int(5);</code></td></tr>
        </tbody>
      </table>

      <h3>🎬 Interactive — Stack/Heap step-by-step</h3>
      <MemoryDiagramViz />

      <h3>2. ตัวอย่าง — Stack</h3>
      <pre className="code-block">{`void foo() {
  int x = 5;              // stack
  int arr[100];           // stack — 400 bytes
  vector<int> v(10);      // v object บน stack
                          // (vector internally point ไป heap!)
} // ออก scope — x, arr ถูกลบอัตโนมัติ`}</pre>

      <h3>3. ตัวอย่าง — Heap</h3>
      <pre className="code-block">{`int* p = new int(42);        // heap — 4 bytes
*p = 100;
cout << *p;                   // 100
delete p;                     // ⚠ ต้อง delete เอง

// Array บน heap
int* arr = new int[1000];     // heap — 4000 bytes
arr[0] = 5;
delete[] arr;                 // ⚠ delete[] (ไม่ใช่ delete)`}</pre>

      <div className="callout warn">
        <div className="ttl">⚠ Memory Leak</div>
        ถ้า <code>new</code> แล้วลืม <code>delete</code> → memory <b>รั่ว</b> — โปรแกรมยิ่งรันยิ่งกิน RAM<br/>
        Program สั้น ๆ อาจไม่เห็นผล แต่ server หรือ long-running app จะค่อย ๆ ตาย
      </div>

      <h3>4. Stack Overflow</h3>
      <pre className="code-block">{`// Recursion ลึก
void recurse(int n) {
  int local[100];           // 400 bytes ต่อ call
  if (n > 0) recurse(n - 1);
}

int main() {
  recurse(1000000);          // 💥 stack overflow
  // 10⁶ × 400 bytes = 400 MB > stack size
}`}</pre>

      <p>วิธีแก้:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>ลด depth → ใช้ iteration แทน</li>
        <li>ใช้ heap allocation: <code>vector&lt;int&gt; local(100)</code> แทน <code>int local[100]</code></li>
        <li>เพิ่ม stack size (compiler/OS flag) — ทางสุดท้าย</li>
      </ul>

      <h3>5. ทำไม vector ดีกว่า raw array</h3>
      <pre className="code-block">{`// Raw array บน stack (ขนาดคงที่)
int arr[10];           // size fixed, อยู่ใน stack

// Raw array บน heap (size dynamic แต่ต้อง manage เอง)
int* arr2 = new int[n];
// ... ต้อง delete[] arr2 เอง

// Vector — ดีที่สุด
vector<int> v(n);       // dynamic size, auto cleanup
v.push_back(5);         // resize อัตโนมัติ
// ออก scope → destructor เรียก delete[] ให้`}</pre>

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b style={{ color: 'var(--accent)' }}>Vector internally:</b>
        <ul style={{ marginTop: 4, color: 'var(--text-1)' }}>
          <li>เก็บ pointer ไป heap array</li>
          <li>เมื่อ <code>push_back</code> เต็ม capacity → allocate 2× ใหม่, copy, delete[] เก่า</li>
          <li>เมื่อ vector ถูกทำลาย (RAII) → destructor ลบ heap array ให้</li>
        </ul>
      </div>

      <h3>6. RAII — Resource Acquisition Is Initialization</h3>
      <p>
        C++ idiom: ผูก <b>resource ownership</b> เข้ากับ <b>object lifetime</b><br/>
        → constructor allocate, destructor deallocate<br/>
        → ออก scope = release อัตโนมัติ (no leak!)
      </p>

      <h3>7. Smart Pointers — Auto memory management</h3>
      <pre className="code-block">{`#include <memory>

// unique_ptr — owner เดียว, ไม่ copy ได้ (move only)
unique_ptr<int> p = make_unique<int>(42);
cout << *p;
// ออก scope → auto delete

// shared_ptr — multiple owners (reference count)
shared_ptr<int> sp = make_shared<int>(100);
shared_ptr<int> sp2 = sp;   // ตอนนี้ 2 owners
// ออก scope ทั้ง 2 → ตอนนั้นค่อย delete

// weak_ptr — ไม่ขึ้น ref count (ป้องกัน cycle)
weak_ptr<int> wp = sp;
if (auto p = wp.lock()) {   // ตรวจว่า object ยังอยู่
  cout << *p;
}`}</pre>

      <WE22
        title="ทำไมไม่ใช้ new/delete แล้วใช้ smart pointer?"
        problem="เทียบ raw pointer vs smart pointer"
        steps={[
          { title: "Raw pointer (ผิดง่าย)", body: "int* p = new int(5);\nif (some_error) return;   // ⚠ leak! ลืม delete\n// ...\ndelete p;", why: "ทุก return/throw ต้อง delete — ลืมง่าย" },
          { title: "Smart pointer (ปลอดภัย)", body: "auto p = make_unique<int>(5);\nif (some_error) return;   // ✓ ไม่ leak — auto delete ตอนออก scope\n// ...\n// ไม่ต้อง delete", why: "RAII ทำให้ resource จัดการอัตโนมัติ" },
        ]}
        answer="Smart pointer = ‘เขียน C++ สมัยใหม่ที่ปลอดภัย’ ▢"
      />

      <CS22 title="Memory Cheat Sheet" sections={[
        { label: "Stack", value: "<code>int x;</code> — auto cleanup, fast, small" },
        { label: "Heap", value: "<code>new T(...)</code> — manual <code>delete</code>, large" },
        { label: "Vector", value: "<code>vector&lt;T&gt;</code> — heap-backed, auto cleanup (RAII)" },
        { label: "Smart ptr", value: "<code>unique_ptr/shared_ptr</code> — RAII for raw pointers" },
        { label: "Avoid", value: "<code>new/delete</code> ใน code สมัยใหม่ — ใช้ container/smart ptr แทน" },
      ]} />

      <PF22 items={[
        { trap: "Allocate ใหญ่บน stack: <code>int arr[10000000];</code>", fix: "Stack มี ~8MB → 10⁷ ints = 40MB → overflow. ใช้ <code>vector&lt;int&gt; arr(10000000)</code>" },
        { trap: "<code>new[]</code> แต่ <code>delete</code> (ไม่ใช่ <code>delete[]</code>)", fix: "Array บน heap ต้อง <code>delete[]</code> เสมอ" },
        { trap: "Double delete: <code>delete p; delete p;</code>", fix: "Undefined behavior — set <code>p = nullptr</code> หลัง <code>delete</code> ก็ได้" },
        { trap: "Return pointer ของ local variable", fix: "Local อยู่ใน stack — ออก scope = ลบ → dangling pointer. คืน by value หรือ <code>new</code> ที่ heap" },
      ]} />

      <Quiz22 q={{
        question: "ทำไม <code>vector&lt;int&gt; v(1000000)</code> ไม่ stack overflow แต่ <code>int arr[1000000]</code> overflow?",
        options: [
          "vector มี optimization พิเศษ",
          "vector เก็บ data ใน heap (แค่ object เล็ก ๆ บน stack)",
          "arr ต้องคูณ sizeof(int) — vector ไม่ต้อง",
          "vector ใช้ memory น้อยกว่า"
        ],
        answer: 1,
        explain: "Vector object บน stack มีแค่ pointer + 2 ints (~24 bytes) — data จริงอยู่ใน heap ที่ใหญ่กว่ามาก. Raw array <code>int arr[N]</code> อยู่บน stack ทั้งก้อน"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   cpp-modern — auto, range-for, structured bindings, init-if
============================================================ */
Lessons22["cpp-modern"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เรียน feature ของ <b>Modern C++ (C++11/14/17)</b> ที่ทำให้โค้ดสั้น อ่านง่าย ปลอดภัยขึ้น
      </div>

      <h3>1. <code>auto</code> — Type inference</h3>
      <pre className="code-block">{`// แบบเก่า — ยาว
vector<pair<int, string>>::iterator it = v.begin();
map<string, vector<int>>::iterator it2 = m.find("foo");

// แบบใหม่ — auto deduce
auto it = v.begin();
auto it2 = m.find("foo");

// ใช้กับตัวเลข ก็ได้แต่ไม่ค่อยจำเป็น
auto x = 42;        // int
auto y = 3.14;      // double
auto s = "hello";   // const char* (ระวัง! ไม่ใช่ string)
auto str = "hi"s;   // string (มี s suffix, C++14)`}</pre>

      <div className="callout warn">
        <div className="ttl">⚠ Pitfall: auto + container</div>
        <pre style={{ margin: 0 }}>{`for (auto x : vec) { ... }`}</pre>
        → <code>x</code> เป็น <b>copy</b> ของ element<br/>
        <pre style={{ margin: 0, marginTop: 8 }}>{`for (auto& x : vec) { ... }`}</pre>
        → <code>x</code> เป็น <b>reference</b> (เปลี่ยน vec ได้)<br/>
        <pre style={{ margin: 0, marginTop: 8 }}>{`for (const auto& x : vec) { ... }`}</pre>
        → read-only reference (ไม่ copy, ไม่เปลี่ยน) — <b>recommended</b>
      </div>

      <h3>2. Range-based for loop</h3>
      <pre className="code-block">{`vector<int> v = {1, 2, 3, 4, 5};

// แบบเก่า
for (int i = 0; i < v.size(); i++) {
  cout << v[i] << " ";
}

// Range-for
for (int x : v) {
  cout << x << " ";
}

// อ่านอย่างเดียว — ใช้ const auto& (ไม่ copy)
for (const auto& x : v) {
  cout << x << " ";
}

// แก้ค่า — ใช้ auto& (reference)
for (auto& x : v) {
  x *= 2;       // เปลี่ยน v
}`}</pre>

      <h3>3. Structured Bindings (C++17)</h3>
      <pre className="code-block">{`// pair / tuple
pair<int, string> p = {1, "hello"};
auto [num, str] = p;
cout << num << " " << str;       // 1 hello

// Iterate map — สวยมาก
map<string, int> scores = {{"alice", 90}, {"bob", 85}};
for (const auto& [name, score] : scores) {
  cout << name << ": " << score << "\\n";
}

// Multiple return values
tuple<int, int, int> getRGB() { return {255, 100, 50}; }
auto [r, g, b] = getRGB();`}</pre>

      <h3>4. Init-if / Init-switch (C++17)</h3>
      <pre className="code-block">{`// แบบเก่า
auto it = m.find("key");
if (it != m.end()) {
  cout << it->second;
}
// it ยัง alive อยู่หลัง if (pollute scope)

// แบบใหม่ — init ใน if
if (auto it = m.find("key"); it != m.end()) {
  cout << it->second;
}
// it ตายเมื่อออก if`}</pre>

      <h3>5. Uniform Initialization <code>{}</code></h3>
      <pre className="code-block">{`int x{42};                          // = int x = 42
vector<int> v{1, 2, 3, 4};          // initialize list
pair<int, string> p{1, "hi"};       // works for pair
struct Point { int x, y; };
Point pt{3, 4};                     // aggregate init

// ⚠ ระวัง — vector vs initializer_list
vector<int> a(5, 2);   // [2, 2, 2, 2, 2] — size=5, fill=2
vector<int> b{5, 2};   // [5, 2] — initializer list 2 elements`}</pre>

      <h3>6. Lambda functions (preview — บทถัดไปลึกกว่า)</h3>
      <pre className="code-block">{`auto add = [](int a, int b) { return a + b; };
cout << add(2, 3);             // 5

// Capture
int n = 10;
auto multByN = [n](int x) { return x * n; };
cout << multByN(5);            // 50

// ใช้กับ sort
vector<int> v = {3, 1, 4, 1, 5};
sort(v.begin(), v.end(), [](int a, int b) { return a > b; });
// [5, 4, 3, 1, 1]`}</pre>

      <h3>7. <code>nullptr</code> แทน NULL/0</h3>
      <pre className="code-block">{`int* p = nullptr;       // C++11 — type-safe
int* q = NULL;          // C-style — เป็น (void*)0 หรือ 0
int* r = 0;             // ใช้ได้แต่อ่านยาก

// nullptr แก้ปัญหา overload ambiguity
void foo(int x);
void foo(int* p);
foo(NULL);              // ⚠ ambiguous (NULL = 0 = int)
foo(nullptr);           // ✓ ชัดเจน — เลือก foo(int*)`}</pre>

      <h3>8. <code>using</code> แทน <code>typedef</code></h3>
      <pre className="code-block">{`// C-style
typedef vector<pair<int, int>> AdjList;

// C++11
using AdjList = vector<pair<int, int>>;

// Template alias (typedef ทำไม่ได้)
template<typename T>
using Graph = vector<vector<T>>;

Graph<int> g(10);       // ⟺ vector<vector<int>> g(10);`}</pre>

      <WE22
        title="Modern C++ — เขียนใหม่ของเดิม"
        problem="แก้โค้ดเก่าให้ใช้ modern features"
        steps={[
          { title: "Before (C++98 style)", body: "vector<pair<string, int>> v;\nv.push_back(make_pair(\"a\", 1));\nfor (vector<pair<string, int>>::iterator it = v.begin(); it != v.end(); ++it) {\n  cout << it->first << \" \" << it->second << \"\\n\";\n}", why: "verbose, ยาว" },
          { title: "After (Modern)", body: "vector<pair<string, int>> v;\nv.emplace_back(\"a\", 1);                 // emplace สร้าง in-place\nfor (const auto& [name, val] : v) {     // structured binding\n  cout << name << \" \" << val << \"\\n\";\n}", why: "สั้น อ่านง่าย ไม่ copy" },
        ]}
        answer="Modern C++ → ลดบรรทัด, อ่านง่ายขึ้น, performance ดีขึ้น ▢"
      />

      <CS22 title="Modern C++ Cheat Sheet" sections={[
        { label: "auto", value: "<code>auto x = expr;</code> — type deduce" },
        { label: "Range-for", value: "<code>for (const auto&amp; x : v)</code>" },
        { label: "Structured binding", value: "<code>auto [k, v] = pair;</code>" },
        { label: "Init-if", value: "<code>if (auto x = f(); x.ok())</code>" },
        { label: "Uniform init", value: "<code>vector&lt;int&gt; v{1,2,3};</code>" },
        { label: "nullptr", value: "ใช้แทน <code>NULL</code> เสมอ" },
        { label: "using alias", value: "<code>using T = vector&lt;int&gt;;</code>" },
      ]} />

      <PF22 items={[
        { trap: "<code>for (auto x : bigVector)</code> copy ทั้ง element ทุกรอบ", fix: "ใช้ <code>const auto&amp;</code> ถ้าแค่อ่าน" },
        { trap: "<code>auto</code> กับ string literal: <code>auto s = \"hi\";</code> ได้ <code>const char*</code> ไม่ใช่ <code>string</code>", fix: "<code>string s = \"hi\";</code> หรือ <code>auto s = \"hi\"s;</code> (C++14)" },
        { trap: "<code>vector&lt;int&gt; v{5, 2}</code> สร้าง list 2 ตัว ไม่ใช่ size 5", fix: "ใช้ <code>vector&lt;int&gt; v(5, 2)</code> ด้วย <code>()</code> เพื่อ size + fill" },
        { trap: "ใช้ <code>auto</code> มากเกินจนอ่านยาก", fix: "ถ้า type สำคัญต่อความเข้าใจ → เขียน type ตรง ๆ" },
      ]} />

      <Quiz22 q={{
        question: "ข้อใดให้ vector ขนาด 5 ทุกตัวเป็น 0?",
        options: [
          "<code>vector&lt;int&gt; v{5};</code>",
          "<code>vector&lt;int&gt; v(5);</code>",
          "<code>vector&lt;int&gt; v[5];</code>",
          "<code>vector&lt;int&gt; v = 5;</code>"
        ],
        answer: 1,
        explain: "<code>v(5)</code> = size 5, default-fill (0 for int). <code>v{5}</code> = initializer list [5]. ระวังความต่างของ () vs {}!"
      }} />

      <Quiz22 q={{
        question: "<code>for (auto&amp; [k, v] : myMap)</code> ทำอะไร?",
        options: [
          "Loop ผ่าน keys อย่างเดียว",
          "Loop ผ่าน values อย่างเดียว",
          "Loop ผ่าน pairs โดย destructure เป็น k, v (เปลี่ยน v ได้)",
          "Error — ใช้ไม่ได้กับ map"
        ],
        answer: 2,
        explain: "Structured binding + reference → ได้ k (const ของ key) และ v (mutable reference ของ value)"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart22 = Lessons22;
