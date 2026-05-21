/* Lessons Part 31 — Platform Features
   C++ Error Decoder (Thai), C++ OOP, Templates, Modern C++,
   Past Exam Archive, Per-Lesson Practice Hub, PWA Install */

const { useState: useS31, useMemo: useM31, useEffect: useE31 } = React;
const { Quiz: Quiz31 } = window.LessonComponents;

const Lessons31 = {};

/* ============================================================
   147 — C++ Error Decoder (Thai)
============================================================ */
const ERROR_PATTERNS = [
  {
    pat: /undefined reference to (.+)/i,
    title: "Undefined reference",
    th: "Linker หาฟังก์ชัน/ตัวแปรไม่เจอ — มี declaration แต่ไม่มี definition",
    fix: [
      "เช็คว่าได้เขียน body ฟังก์ชันหรือยัง (ไม่ใช่แค่ prototype)",
      "ถ้าใช้หลายไฟล์ .cpp — compile ทุกไฟล์รวมกัน: g++ a.cpp b.cpp",
      "ถ้าเรียก main() ผิด signature — ต้อง int main()",
      "ถ้าใช้ library เช่น math: เพิ่ม -lm"
    ]
  },
  {
    pat: /expected initializer before|expected unqualified-id|expected ';' after/i,
    title: "Expected initializer / ';' / unqualified-id",
    th: "Compiler งงกับ syntax — มักลืม ; ปิดประโยค หรือ syntax ของ class/function ผิด",
    fix: [
      "ตรวจ ; ทุกบรรทัด — โดยเฉพาะหลัง } ของ class/struct",
      "เช็คเครื่องหมาย () และ {} ปิดถูกไหม",
      "ถ้าเขียน function definition ระวัง: ไม่ใส่ ; ท้าย function body",
      "Header guard #endif อยู่ครบไหม"
    ]
  },
  {
    pat: /no operator [\"'].*[\"'] matches|invalid operands of types/i,
    title: "Invalid operands / No matching operator",
    th: "ใช้ operator กับ type ที่ไม่รองรับ — เช่น cout &lt;&lt; vector",
    fix: [
      "ตรวจ type ของ operand ทั้ง 2 ฝั่ง",
      "vector ใช้ cout ตรง ๆ ไม่ได้ — เขียน loop หรือใช้ <fmt>",
      "string + int ไม่ได้ตรง ๆ — ใช้ to_string(int)",
      "Custom class: overload operator (เช่น operator&lt;&lt;)"
    ]
  },
  {
    pat: /redefinition of|previously declared here/i,
    title: "Redefinition",
    th: "ประกาศตัวแปร/class ซ้ำใน scope เดียว",
    fix: [
      "ใน header — ใช้ #pragma once หรือ include guard",
      "อย่า include .cpp file (include เฉพาะ .h)",
      "ตรวจว่าไม่มีตัวแปรชื่อซ้ำใน scope เดียว"
    ]
  },
  {
    pat: /control reaches end of non-void function|no return statement/i,
    title: "Control reaches end of non-void function",
    th: "ฟังก์ชันที่ return type ≠ void แต่บางทางออกไม่ได้ return ค่า",
    fix: [
      "ใส่ return ทุก branch ของ if/else",
      "ถ้ามี throw หรือ exit — compiler อาจไม่รู้ ใช้ [[noreturn]] attribute",
      "ถ้าเป็น recursion — ตรวจ base case ทุก path"
    ]
  },
  {
    pat: /comparison between signed and unsigned|narrowing conversion/i,
    title: "Signed/unsigned comparison / Narrowing",
    th: "เปรียบเทียบ int (signed) กับ size_t (unsigned) — UB ถ้า int ติดลบ",
    fix: [
      "Cast int → (int)v.size() หรือเก็บ size ใน int ก่อน",
      "ใช้ size_t i = 0; แทน int i = 0; เมื่อใช้กับ vector",
      "หรือใช้ ranged for: for (auto& x : v)"
    ]
  },
  {
    pat: /expected (?:'.+'|.+) before/i,
    title: "Expected ... before ...",
    th: "Parser เจอ token ที่ไม่คาดคิด — ส่วนมากคือ syntax ผิดบรรทัด<b>ก่อนหน้า</b> error",
    fix: [
      "เช็ค semicolon ; ที่ลืม (บรรทัดก่อน error)",
      "เช็คว่าวงเล็บ () [] {} ปิดถูกต้อง",
      "เช็คว่า include header ถูก เช่น <string> ก่อนใช้ string",
      "เช็คว่าได้เขียน namespace std หรือ std::"
    ]
  },
  {
    pat: /was not declared in this scope/i,
    title: "Was not declared in this scope",
    th: "Compiler ไม่รู้จักตัวแปร/ฟังก์ชันนี้ใน scope ปัจจุบัน",
    fix: [
      "เช็ค typo (cin/cout/endl ฯลฯ พิมพ์ถูกไหม)",
      "ลืม #include header — เช่น cout ต้อง <iostream>",
      "ลืม using namespace std; หรือไม่ใช้ std::",
      "ตัวแปรอยู่ใน scope อื่น (block อื่น)"
    ]
  },
  {
    pat: /no matching function for call to/i,
    title: "No matching function for call to",
    th: "เรียกฟังก์ชันด้วย argument ที่ไม่ตรง overload ใด ๆ",
    fix: [
      "เช็คจำนวน argument",
      "เช็ค type — เช่นส่ง string ให้ฟังก์ชันที่รับ int",
      "ถ้าเป็น template ของ STL — เช็คว่า iterator type ถูกไหม"
    ]
  },
  {
    pat: /segmentation fault|sigsegv/i,
    title: "Segmentation Fault (runtime)",
    th: "เข้าถึง memory ที่ไม่ใช่ของเรา — โปรแกรมหยุดทำงาน",
    fix: [
      "Array index เกินขอบเขต — a[i] เมื่อ i ≥ n หรือ i < 0",
      "Null pointer dereference — *p ที่ p = nullptr",
      "Stack overflow จาก recursion ลึกเกิน",
      "ใช้ vector แล้ว push_back ขณะ iterate"
    ]
  },
  {
    pat: /invalid use of incomplete type|forward declaration/i,
    title: "Invalid use of incomplete type",
    th: "ใช้ class ที่ยังไม่ได้ define เต็ม (มีแค่ forward declaration)",
    fix: [
      "Include header ที่มี class definition เต็ม",
      "ตรวจ circular include — ใช้ forward declaration บางที่",
      "เพิ่ม #ifndef include guard"
    ]
  },
  {
    pat: /array (?:bound|subscript|out of range)/i,
    title: "Array out of bound",
    th: "เข้าถึง array นอกขอบเขต",
    fix: [
      "เช็คเงื่อนไข loop: i < n (ไม่ใช่ i <= n)",
      "ใช้ vector::at(i) แทน v[i] เพื่อ throw exception แทน UB",
      "Print n และ i ก่อน access เพื่อ debug"
    ]
  },
  {
    pat: /reference to .+ is ambiguous|ambiguous overload/i,
    title: "Ambiguous",
    th: "Compiler ไม่รู้จะเลือก overload ไหน",
    fix: [
      "Cast argument ให้ชัด: (int)x หรือ static_cast<int>(x)",
      "ใช้ std::min<int>(a, b) ระบุ template parameter",
      "เปลี่ยนชื่อฟังก์ชันให้ unique"
    ]
  },
  {
    pat: /assignment of read-only|cannot assign to|const/i,
    title: "Const violation",
    th: "พยายามแก้ค่าตัวแปรที่ประกาศเป็น const",
    fix: [
      "เอา const ออกถ้าจำเป็นต้องแก้",
      "ใช้ตัวแปรอื่น copy ออกมาก่อนแก้",
      "ถ้าผ่าน parameter — เปลี่ยน const T& เป็น T& (แต่คิดให้รอบคอบ)"
    ]
  },
  {
    pat: /stack overflow/i,
    title: "Stack Overflow (recursion ลึกเกิน)",
    th: "Recursion เรียกตัวเองลึกเกินจน stack เต็ม (โดยปกติ ~10^6 frames)",
    fix: [
      "เช็ค base case — ลืม return ตอน n=0/1 หรือเปล่า",
      "เช็คว่า recursion ลด state จริง ๆ (ไม่ใช่ infinite recursion)",
      "เปลี่ยน recursion → iteration ใช้ stack ของเราเอง",
      "เพิ่ม stack size: ulimit -s unlimited (Linux)"
    ]
  },
  {
    pat: /multiple definition|first defined here/i,
    title: "Multiple definition",
    th: "ฟังก์ชัน/ตัวแปรเดียวกันถูก define หลายที่",
    fix: [
      "ใช้ inline ใน header สำหรับ function",
      "ใช้ extern ใน header + define 1 ที่ใน .cpp",
      "เพิ่ม include guard #ifndef/#define/#endif หรือ #pragma once"
    ]
  },
  {
    pat: /no member named/i,
    title: "No member named",
    th: "Class/struct นี้ไม่มี member ที่เรียก",
    fix: [
      "เช็ค typo — push_back ไม่ใช่ pushback",
      "เช็คว่าเป็น method ของ class ที่ถูก — vector vs list",
      "เช็คว่า include header ที่นิยาม member"
    ]
  },
  {
    pat: /Time Limit Exceeded|TLE/i,
    title: "Time Limit Exceeded (Runtime)",
    th: "โปรแกรมรันเกินเวลาที่กำหนด — algorithm ช้าเกินไป",
    fix: [
      "เช็ค time complexity — n=10^6 แค่ O(n log n) ผ่าน, O(n²) ไม่ผ่าน",
      "ใช้ fast I/O: ios_base::sync_with_stdio(false); cin.tie(NULL);",
      "ใช้ '\\n' แทน endl (endl flush buffer — ช้า)",
      "Replace vector<int> ที่ใช้บ่อยด้วย array"
    ]
  },
  {
    pat: /Memory Limit Exceeded|MLE/i,
    title: "Memory Limit Exceeded",
    th: "ใช้ memory เกิน limit",
    fix: [
      "ลด array size — เช็คว่าจองเกินจำเป็นไหม",
      "ใช้ rolling array สำหรับ DP (เก็บแค่ 2 rows)",
      "vector<vector<int>> ใหญ่ → ใช้ static array ถ้า size รู้แล้ว",
      "ถ้า n=10^7 ใช้ int (4 bytes) → 40 MB"
    ]
  },
  {
    pat: /Wrong Answer|WA/i,
    title: "Wrong Answer (Logic Error)",
    th: "Output ผิด — bug ใน algorithm หรือ edge case ไม่ครอบคลุม",
    fix: [
      "ตรวจ edge case: n=0, n=1, max input",
      "ตรวจ overflow — ใช้ long long ถ้าผลคูณใหญ่",
      "Print ตัวแปรสำคัญ debug ก่อน trace",
      "Run ตัวอย่าง input ที่ให้ใน problem — ตรงกับ expected ไหม?",
      "เขียน brute force แล้วเทียบกับ solution บน input เล็ก"
    ]
  },
  {
    pat: /division by zero|divide by zero/i,
    title: "Division by zero",
    th: "หารด้วย 0 — UB ใน C++ (อาจ crash หรือ output มั่ว)",
    fix: [
      "เช็ค denominator ก่อนหาร: if (b != 0) c = a/b;",
      "Mod ด้วย 0 ก็ผิดเหมือนกัน",
      "ระวังหารด้วยตัวแปรที่ยังไม่ init"
    ]
  },
  {
    pat: /unused variable|declared but not used/i,
    title: "Unused variable (warning)",
    th: "ตัวแปร declared แต่ไม่ใช้ — warning ไม่ผิด แต่ควรลบ",
    fix: [
      "ลบตัวแปร",
      "ถ้าตั้งใจ — ใช้ (void)x; เพื่อ suppress",
      "Function parameter ที่ไม่ใช้ — ลบชื่อ: void f(int /*x*/)"
    ]
  },
  {
    pat: /reference to local|address of local|dangling/i,
    title: "Dangling reference / Address of local",
    th: "Return reference ของตัวแปร local — หลัง function จบ memory นั้นไม่มีแล้ว",
    fix: [
      "Return by value แทน reference",
      "ถ้าต้อง return ref — ใช้ static หรือ heap (smart pointer)",
      "ระวัง: vector ที่ return จาก function — temp object → ใช้ const ref ใน loop"
    ]
  },
  {
    pat: /implicit conversion|narrowing conversion from/i,
    title: "Implicit/narrowing conversion (warning)",
    th: "Compiler แปลง type อัตโนมัติ — อาจสูญเสียข้อมูล",
    fix: [
      "double → int ตัด decimal — ใช้ static_cast<int> ให้ชัด",
      "long long → int อาจ overflow",
      "ใช้ {} init จะไม่ยอมให้ narrowing"
    ]
  },
  {
    pat: /infinite recursion|recursive call to/i,
    title: "Infinite recursion (warning)",
    th: "Compiler ตรวจเจอ recursion ที่ไม่มี base case ชัด",
    fix: [
      "เช็ค base case — return เมื่อ n=0/1",
      "ระวัง recursion ที่ลด n ผิดทาง (เช่น n+1 แทน n−1)",
      "Tail call optimization ไม่รับประกัน — large depth ก็ stack overflow"
    ]
  },
  {
    pat: /vector subscript out of range|deque iterator|debug assertion/i,
    title: "Vector subscript out of range (MSVC runtime)",
    th: "MSVC debug mode ตรวจ v[i] ตอน runtime — index หลุดขอบเขต",
    fix: [
      "เช็ค i ก่อน access: if (i >= 0 && i < v.size())",
      "ใช้ v.at(i) จะ throw exception แทน UB",
      "ดู iter ที่ใช้หลัง v.push_back — invalidate แล้ว"
    ]
  },
  {
    pat: /linker command failed|ld: symbol\(s\) not found/i,
    title: "Linker error",
    th: "Linker ทำงานล้มเหลว — มักเพราะ missing library หรือ undefined symbol",
    fix: [
      "เพิ่ม library: -lm (math), -lpthread (thread)",
      "ถ้าใช้ class แยกไฟล์ — compile ทุก .cpp",
      "เช็คว่ามี main() ใน 1 ไฟล์"
    ]
  },
];

Lessons31["error-decoder"] = function () {
  const [input, setInput] = useS31('');
  const matches = useM31(() => {
    if (!input.trim()) return [];
    return ERROR_PATTERNS.filter(e => e.pat.test(input));
  }, [input]);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔍 C++ Error Decoder (ภาษาไทย)</div>
        วาง error message ที่ได้จาก g++/clang แล้วผมจะอธิบายเป็นภาษาไทย + วิธีแก้
      </div>

      <textarea value={input} onChange={e => setInput(e.target.value)}
        placeholder="วาง error message เช่น 'error: 'cout' was not declared in this scope' หรือ 'Segmentation fault'"
        style={{
          width: '100%', minHeight: 100, background: 'var(--bg-2)', color: 'var(--text-0)',
          border: '1px solid var(--border)', borderRadius: 8, padding: 10,
          fontFamily: 'monospace', fontSize: 13, resize: 'vertical'
        }} />

      {input.trim() && matches.length === 0 && (
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 8, marginTop: 10, color: 'var(--text-2)' }}>
          🤔 ไม่เจอ pattern ที่ตรง — ลองวางบรรทัดที่ขึ้นต้นด้วย <code>error:</code> หรือ <code>warning:</code> เฉพาะส่วน หรือคำสำคัญ เช่น "segmentation", "undefined reference"
        </div>
      )}

      {matches.map((m, i) => (
        <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginTop: 12, borderLeft: '4px solid var(--accent)' }}>
          <h4 style={{ marginTop: 0, color: 'var(--accent)' }}>{m.title}</h4>
          <div style={{ color: 'var(--text-1)', marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: m.th }} />
          <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 6 }}>💡 วิธีแก้:</div>
          <ul style={{ color: 'var(--text-1)', marginTop: 0 }}>
            {m.fix.map((f, j) => <li key={j}>{f}</li>)}
          </ul>
        </div>
      ))}

      <h3 style={{ marginTop: 20 }}>📚 Error ที่เจอบ่อย (พร้อม mini example)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
        {ERROR_PATTERNS.slice(0, 6).map((m, i) => (
          <button key={i} onClick={() => setInput(m.pat.source.replace(/[\\^$.*+?()[\]{}|]/g, '').replace(/i$/, '').slice(0, 50))}
            style={{
              textAlign: 'left', background: 'var(--bg-3)', color: 'var(--text-0)',
              padding: 10, border: 'none', borderRadius: 8, cursor: 'pointer'
            }}>
            <b style={{ color: 'var(--accent)' }}>{m.title}</b>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{m.th.replace(/<[^>]+>/g, '').slice(0, 70)}...</div>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   148 — C++ OOP (Class, Inheritance, Virtual)
============================================================ */
Lessons31["cpp-oop"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 C++ OOP — Class & Object</div>
        Class, constructor/destructor, inheritance, virtual — รากของ STL และทุก library
      </div>

      <h3>1. Class basics</h3>
      <CodeBlock code={[
        "class Point {",
        "public:",
        "  int x, y;",
        "  Point(int a, int b) : x(a), y(b) {}   // constructor (initializer list)",
        "  ~Point() {}                            // destructor",
        "  double dist() const {                  // const = ไม่แก้ state",
        "    return sqrt(x*x + y*y);",
        "  }",
        "private:",
        "  int hidden = 0;                        // เข้าถึงจากนอก class ไม่ได้",
        "};",
        "",
        "Point p(3, 4);",
        "cout << p.dist();  // 5",
      ]} />

      <h3>2. RAII (Resource Acquisition Is Initialization)</h3>
      <p>Constructor <b>acquire</b> resource, destructor <b>release</b> — แม้ throw exception ก็ release อัตโนมัติ</p>
      <CodeBlock code={[
        "class FileReader {",
        "  FILE* f;",
        "public:",
        "  FileReader(const char* path) { f = fopen(path, \"r\"); }",
        "  ~FileReader() { if (f) fclose(f); }   // ปิดไฟล์อัตโนมัติ",
        "};",
        "",
        "{",
        "  FileReader r(\"data.txt\");  // เปิด",
        "  // ใช้งาน...",
        "}  // r ออก scope → destructor ปิดไฟล์",
      ]} />

      <h3>3. Inheritance</h3>
      <CodeBlock code={[
        "class Shape {",
        "public:",
        "  virtual double area() const = 0;  // pure virtual = abstract",
        "  virtual ~Shape() = default;        // virtual dtor สำคัญใน inheritance",
        "};",
        "",
        "class Circle : public Shape {",
        "  double r;",
        "public:",
        "  Circle(double r) : r(r) {}",
        "  double area() const override { return 3.14 * r * r; }",
        "};",
        "",
        "class Square : public Shape {",
        "  double s;",
        "public:",
        "  Square(double s) : s(s) {}",
        "  double area() const override { return s * s; }",
        "};",
      ]} />

      <h3>4. Polymorphism (virtual dispatch)</h3>
      <CodeBlock code={[
        "vector<Shape*> shapes = { new Circle(5), new Square(3) };",
        "for (Shape* s : shapes)",
        "  cout << s->area() << ' ';  // เรียก override ที่ถูกต้องตาม runtime type",
        "// output: 78.5 9",
      ]} />

      <h3>5. Access Specifiers</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Access</th><th>เข้าถึงจากใน class</th><th>derived class</th><th>นอก class</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>public</td><td>✓</td><td>✓</td><td>✓</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>protected</td><td>✓</td><td>✓</td><td>✗</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>private</td><td>✓</td><td>✗</td><td>✗</td></tr>
        </tbody>
      </table>

      <h3>6. Rule of 3/5/0</h3>
      <p>ถ้า class จัดการ resource (เปิด file, จองมัน memory) — ต้อง define อย่างน้อย 3:</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Destructor</li>
        <li>Copy constructor</li>
        <li>Copy assignment</li>
        <li>(C++11) Move constructor + Move assignment → Rule of 5</li>
        <li><b>Rule of 0:</b> ใช้ smart pointer / RAII members → ไม่ต้อง define เลย (ดีที่สุด)</li>
      </ul>

      <h3>เทียบ struct vs class</h3>
      <p>ใน C++ struct = class ที่ <b>default public</b> (class default private) — เลือกใช้ตามความตั้งใจ</p>

      <Quiz31
        q="ทำไม base class ที่มี derived class ต้องมี virtual destructor?"
        options={[
          "เพื่อให้ compile เร็วขึ้น",
          "เพื่อให้ delete ผ่าน base pointer เรียก derived dtor ได้ถูกต้อง",
          "เพื่อ override constructor",
          "ไม่จำเป็น"
        ]}
        answer={1}
        explain="`delete basePtr` จะเรียกแค่ base dtor ถ้าไม่ virtual — leak resource ใน derived"
      />
    </React.Fragment>
  );
};

/* ============================================================
   149 — C++ Templates
============================================================ */
Lessons31["cpp-templates"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 C++ Templates — Generic Programming</div>
        Template = "ฟังก์ชัน/class ที่ทำงานได้กับหลาย type" — รากของ STL
      </div>

      <h3>1. Function Template</h3>
      <CodeBlock code={[
        "template <typename T>",
        "T maxOf(T a, T b) {",
        "  return a > b ? a : b;",
        "}",
        "",
        "maxOf(3, 5);          // T = int → 5",
        "maxOf(2.5, 3.7);      // T = double → 3.7",
        "maxOf(string(\"a\"), string(\"b\"));  // T = string → \"b\"",
      ]} />

      <h3>2. Class Template</h3>
      <CodeBlock code={[
        "template <typename T>",
        "class Stack {",
        "  vector<T> data;",
        "public:",
        "  void push(T x) { data.push_back(x); }",
        "  T pop() { T t = data.back(); data.pop_back(); return t; }",
        "  bool empty() const { return data.empty(); }",
        "};",
        "",
        "Stack<int> si;",
        "Stack<string> ss;",
      ]} />

      <h3>3. Multiple Template Parameters</h3>
      <CodeBlock code={[
        "template <typename K, typename V>",
        "struct Pair {",
        "  K key;",
        "  V value;",
        "};",
        "",
        "Pair<string, int> p {\"age\", 25};",
      ]} />

      <h3>4. Non-type Template Parameters</h3>
      <CodeBlock code={[
        "template <typename T, size_t N>",
        "class FixedArray {",
        "  T data[N];",
        "public:",
        "  T& operator[](size_t i) { return data[i]; }",
        "  size_t size() const { return N; }",
        "};",
        "",
        "FixedArray<int, 10> arr;  // size fixed ที่ compile time",
      ]} />

      <h3>5. Template Specialization</h3>
      <CodeBlock code={[
        "template <typename T>",
        "void print(T x) { cout << x; }",
        "",
        "// specialize สำหรับ bool",
        "template <>",
        "void print<bool>(bool x) { cout << (x ? \"true\" : \"false\"); }",
        "",
        "print(5);      // 5",
        "print(true);   // true (ไม่ใช่ 1)",
      ]} />

      <h3>6. Variadic Template (C++11+)</h3>
      <CodeBlock code={[
        "template <typename... Args>",
        "void log(Args... args) {",
        "  ((cout << args << ' '), ...);  // fold expression (C++17)",
        "}",
        "",
        "log(1, \"hello\", 3.14);  // 1 hello 3.14",
      ]} />

      <h3>7. Concepts (C++20)</h3>
      <CodeBlock code={[
        "#include <concepts>",
        "",
        "template <typename T>",
        "concept Numeric = std::integral<T> || std::floating_point<T>;",
        "",
        "template <Numeric T>",
        "T sum(T a, T b) { return a + b; }",
        "",
        "sum(1, 2);       // ✓",
        "sum(\"a\", \"b\");   // ❌ compile error — ไม่ใช่ Numeric",
      ]} />

      <h3>เมื่อไหร่ใช้ Template?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>เขียน library generic — รู้ไม่แน่ว่า user จะใช้ type อะไร</li>
        <li>Custom data structure (Stack/Queue/Tree ของตัวเอง)</li>
        <li>Algorithm generic (ทำงานบน int, string, custom type)</li>
      </ul>

      <h3>ข้อเสีย</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Compile time นานขึ้น (instantiate ทุก type)</li>
        <li>Error message ยาวมาก เข้าใจยาก (C++20 concepts ช่วยได้)</li>
        <li>Binary ใหญ่ขึ้น</li>
      </ul>

      <Quiz31
        q="ทำไม STL ใช้ template?"
        options={[
          "เพื่อให้เร็วขึ้น",
          "เพื่อให้ container/algorithm ทำงานกับทุก type โดยไม่ต้องเขียนซ้ำ",
          "เพราะ compile ง่ายกว่า inheritance",
          "เพื่อ encapsulation"
        ]}
        answer={1}
        explain="vector<int>, vector<string>, vector<Point> — code เดียวรองรับทุก type — แทน inheritance + virtual ที่ช้ากว่า"
      />
    </React.Fragment>
  );
};

/* ============================================================
   150 — Modern C++ (Move, constexpr, ranges, smart pointers)
============================================================ */
Lessons31["cpp-modern-deep"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Modern C++ — C++11/14/17/20</div>
        Features ที่ทุก library ใหม่ใช้ — ต้องอ่านโค้ดได้
      </div>

      <h3>1. Move Semantics & rvalue references</h3>
      <CodeBlock code={[
        "vector<int> makeVec() {",
        "  vector<int> v(1000000);",
        "  return v;  // ในอดีต copy 1M elements!",
        "}",
        "",
        "vector<int> w = makeVec();  // C++11: move — pointer swap แค่ O(1)",
        "",
        "// std::move บอก compiler ว่า \"ใช้ resource ของ src — เอาไปทำ junk ก็ได้\"",
        "vector<int> a = {1, 2, 3};",
        "vector<int> b = std::move(a);  // a ว่างเปล่าหลังนี้",
      ]} />

      <h3>2. Lvalue vs Rvalue</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Term</th><th>คือ</th><th>ตัวอย่าง</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>lvalue</td><td>มีชื่อ + ที่อยู่</td><td>x, arr[i]</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>rvalue</td><td>temporary, ไม่มีชื่อ</td><td>3+5, f(), std::move(x)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>T&</td><td>lvalue ref</td><td>int& x = a;</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>T&&</td><td>rvalue ref</td><td>void f(int&& x);</td></tr>
        </tbody>
      </table>

      <h3>3. Smart Pointers</h3>
      <CodeBlock code={[
        "#include <memory>",
        "",
        "// unique_ptr — สิทธิ์ ownership คนเดียว, ปล่อยอัตโนมัติ",
        "auto p = make_unique<Node>(42);",
        "// p->val, *p — ใช้เหมือน pointer",
        "// ไม่ต้อง delete — destructor จัดการเอง",
        "",
        "// shared_ptr — หลายคน share, ref count",
        "auto s1 = make_shared<int>(5);",
        "auto s2 = s1;  // count = 2",
        "// เมื่อ count = 0 → delete อัตโนมัติ",
        "",
        "// weak_ptr — ไม่นับ count (กัน cycle ใน shared_ptr)",
      ]} />

      <h3>4. constexpr</h3>
      <CodeBlock code={[
        "constexpr int fib(int n) {",
        "  return n <= 1 ? n : fib(n-1) + fib(n-2);",
        "}",
        "",
        "constexpr int F10 = fib(10);  // คำนวณตอน compile!",
        "int arr[fib(5)];               // ขนาด array ตอน compile",
      ]} />

      <h3>5. auto + decltype</h3>
      <CodeBlock code={[
        "auto x = 5;                    // int",
        "auto v = vector<int>{1,2,3};   // vector<int>",
        "auto it = v.begin();           // iterator",
        "",
        "// trailing return type",
        "template <typename T, typename U>",
        "auto add(T a, U b) -> decltype(a + b) { return a + b; }",
        "",
        "// C++14: return type deduction",
        "auto add(auto a, auto b) { return a + b; }",
      ]} />

      <h3>6. Structured Bindings (C++17)</h3>
      <CodeBlock code={[
        "map<string, int> m {{\"a\", 1}, {\"b\", 2}};",
        "for (auto& [key, val] : m)",
        "  cout << key << \"=\" << val << endl;",
        "",
        "// แทน .first .second",
        "pair<int, int> p {3, 4};",
        "auto [x, y] = p;",
      ]} />

      <h3>7. std::optional (C++17)</h3>
      <CodeBlock code={[
        "optional<int> find(int x) {",
        "  if (x > 0) return x * 2;",
        "  return nullopt;",
        "}",
        "",
        "auto r = find(5);",
        "if (r) cout << *r;        // 10",
        "else cout << \"not found\";",
      ]} />

      <h3>8. Ranges (C++20)</h3>
      <CodeBlock code={[
        "#include <ranges>",
        "",
        "vector<int> v {1, 2, 3, 4, 5, 6};",
        "auto evens = v | views::filter([](int x){ return x % 2 == 0; })",
        "               | views::transform([](int x){ return x * x; });",
        "// evens = lazy view ของ {4, 16, 36}",
      ]} />

      <h3>9. std::format (C++20)</h3>
      <CodeBlock code={[
        "#include <format>",
        "",
        "string s = std::format(\"{} + {} = {}\", 2, 3, 5);",
        "// s = \"2 + 3 = 5\"",
        "// แทน printf — type-safe + เร็ว",
      ]} />

      <Quiz31
        q="std::move(x) ทำอะไร?"
        options={[
          "ย้าย x ไปยังที่อยู่อื่น",
          "Cast x เป็น rvalue ref — บอก compiler ว่า x ปล่อยให้ขโมยได้",
          "Delete x",
          "Copy x"
        ]}
        answer={1}
        explain="std::move คือ static_cast<T&&>(x) — เป็น hint ให้เลือก move constructor/assignment"
      />
    </React.Fragment>
  );
};

/* ============================================================
   151 — Past Exam Archive (Thai University Style)
============================================================ */
const PAST_EXAMS = [
  {
    school: 'จุฬาฯ (CHU)',
    code: '2110355 — Algorithms',
    year: 'Mock style — Midterm format',
    color: 'var(--pink)',
    problems: [
      {
        q: 'พิสูจน์ว่า 3n² + 5n + 7 = Θ(n²) โดยใช้นิยาม (∃c₁,c₂,n₀)',
        topic: 'Big-O proof',
        ans: 'ใช้ c₁=3, c₂=15, n₀=1 — แสดง 3n² ≤ 3n²+5n+7 ≤ 15n² สำหรับ n≥1'
      },
      {
        q: 'แก้ T(n) = 2T(n/2) + n log n ด้วย Master Theorem (ถ้าใช้ได้) หรือ recursion tree',
        topic: 'Recurrence',
        ans: 'Master case 2 (extended): f(n) = n log n = Θ(n^(log_b a) · log n) → T(n) = Θ(n log² n)'
      },
      {
        q: 'เขียน pseudo code Merge Sort + พิสูจน์ Loop Invariant ของ Merge subroutine',
        topic: 'Merge Sort + correctness',
        ans: 'Invariant: หลังรอบที่ k ใน merge — a[start..start+k) มี k ตัวที่เรียงและน้อยสุดของ L,R ที่เหลือ'
      },
    ]
  },
  {
    school: 'มก. (KU)',
    code: '01418111 — Algorithm Design',
    year: 'Mock style — Final format',
    color: 'var(--accent-3)',
    problems: [
      {
        q: 'ออกแบบ greedy algorithm หาจำนวนเหรียญน้อยที่สุดที่รวมได้ N บาท (มี 1, 5, 10, 20, 50, 100) + พิสูจน์ optimality',
        topic: 'Greedy + proof',
        ans: 'เลือกเหรียญใหญ่สุดที่ ≤ N ก่อนเสมอ — Exchange argument: ถ้า optimal ไม่ใช้เหรียญใหญ่สุด → แลกได้คำตอบดีกว่า/เท่า'
      },
      {
        q: 'Coin change ที่มีเหรียญ {1, 3, 4} N=6 — greedy ดังกล่าวล้มเหลวที่ N=6 อย่างไร? เขียน DP แก้',
        topic: 'DP',
        ans: 'Greedy: 4+1+1=3 เหรียญ แต่ optimal: 3+3=2 เหรียญ. DP: dp[v] = min over coin c of dp[v-c]+1'
      },
      {
        q: 'อธิบาย Dijkstra ทำไมใช้กับ negative weight ไม่ได้ + ยกตัวอย่างกราฟ',
        topic: 'Graph',
        ans: 'Dijkstra สมมติ "ถึง node u ครั้งแรก = dist สั้นสุด" — negative edge หลังจากนั้นทำให้ shorter path มาทีหลังได้'
      },
    ]
  },
  {
    school: 'มจธ. (KMUTT)',
    code: 'CSC290 — Data Structures & Algorithms',
    year: 'Mock style — Midterm format',
    color: 'var(--accent)',
    problems: [
      {
        q: 'Trace Quick Sort บน [8,3,1,7,0,10,2] เลือก pivot = ตัวขวาสุด แสดงทุก partition step',
        topic: 'Sort trace',
        ans: 'Pivot=2: [1,0,2,7,8,10,3] → ซ้าย [1,0] ขวา [7,8,10,3] → … → [0,1,2,3,7,8,10]'
      },
      {
        q: 'เขียน AVL Tree insert 30, 20, 10 — แสดง rotation + height แต่ละขั้น',
        topic: 'AVL',
        ans: 'Insert 30 → root. Insert 20 → ซ้าย. Insert 10 → ซ้ายของซ้าย → LL case → right rotate ที่ root'
      },
      {
        q: 'Hash table size 7, h(k) = k mod 7, ใส่ 50, 700, 76, 85, 92, 73, 101 — แสดง linear probing',
        topic: 'Hash',
        ans: '50→1, 700→0, 76→6, 85→1(coll)→2, 92→1(coll)→2(coll)→3, 73→3(coll)→4, 101→3(coll)→4(coll)→5'
      },
    ]
  },
  {
    school: 'ลาดกระบัง (KMITL)',
    code: '01076022 — Algorithm Analysis',
    year: 'Mock style — Final format',
    color: 'var(--warn)',
    problems: [
      {
        q: 'ออกแบบ DP สำหรับ Longest Palindromic Subsequence — เขียน recurrence + complexity',
        topic: 'DP',
        ans: 'dp[i][j] = LPS ของ s[i..j]. ถ้า s[i]=s[j]: dp[i-1][j-1]+2. มิฉะนั้น max(dp[i+1][j], dp[i][j-1]). O(n²)'
      },
      {
        q: 'พิสูจน์ว่า Vertex Cover ≤ₚ Independent Set (Polynomial Reduction)',
        topic: 'NP / Reduction',
        ans: 'V \\ S เป็น Independent Set ⟺ S เป็น Vertex Cover. ใช้ reduction: ใช้ IS solver บน G, ตอบ V \\ IS เป็น VC'
      },
      {
        q: 'อธิบาย Max-Flow Min-Cut Theorem พร้อมตัวอย่างกราฟ s-t',
        topic: 'Network Flow',
        ans: 'max flow = min cut (s-t). พิสูจน์ผ่าน residual graph: เมื่อ algo หยุด — set ที่ reachable จาก s ใน residual เป็น min cut'
      },
    ]
  },
];

Lessons31["past-exams"] = function () {
  const [selected, setSelected] = useS31(0);
  const [showAns, setShowAns] = useS31({});

  const exam = PAST_EXAMS[selected];

  const toggleAns = (i) => setShowAns(s => ({ ...s, [i]: !s[i] }));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📚 Past Exam Archive — Thai University Style</div>
        ข้อสอบ style จากมหาลัยไทย — เน้น proof, trace, design (ไม่ใช่ multiple choice เท่านั้น)
      </div>

      <div style={{ background: 'rgba(251,191,36,0.12)', borderLeft: '4px solid var(--warn)', padding: 12, borderRadius: 8, marginBottom: 14 }}>
        <b style={{ color: 'var(--warn)' }}>⚠️ Disclaimer:</b> โจทย์ในนี้เป็น <b>mock style-based</b> ที่อิงรูปแบบข้อสอบทั่วไปของแต่ละมหาลัย <b>ไม่ใช่ข้อสอบจริง</b> ของปีไหน ๆ — ใช้ฝึกสไตล์การตอบ ไม่ใช่ "ข้อสอบที่หลุดออกมา" หากต้องการข้อสอบจริงให้ขอที่ภาควิชา/รุ่นพี่
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {PAST_EXAMS.map((e, i) => (
          <button key={i} onClick={() => { setSelected(i); setShowAns({}); }}
            style={{
              background: selected === i ? e.color : 'var(--bg-3)',
              color: selected === i ? '#000' : 'var(--text-0)',
              padding: '8px 14px', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600
            }}>
            {e.school}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 14, borderLeft: `4px solid ${exam.color}` }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: exam.color }}>{exam.school}</div>
        <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>{exam.code} — {exam.year}</div>
      </div>

      {exam.problems.map((p, i) => (
        <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ background: 'var(--bg-3)', padding: '4px 8px', borderRadius: 4, fontSize: 12, color: 'var(--accent)' }}>{p.topic}</span>
            <span style={{ color: 'var(--text-2)', fontSize: 12 }}>ข้อ {i + 1}</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-0)', marginBottom: 10 }}>{p.q}</div>
          <button onClick={() => toggleAns(i)}
            style={{
              background: 'var(--bg-3)', color: 'var(--accent)', border: 'none',
              padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13
            }}>
            {showAns[i] ? '🙈 ซ่อนเฉลย' : '👁 ดูเฉลย'}
          </button>
          {showAns[i] && (
            <div style={{ background: 'var(--bg-3)', padding: 12, borderRadius: 8, marginTop: 10, color: 'var(--text-1)', fontSize: 13.5, lineHeight: 1.7 }}>
              <b style={{ color: 'var(--accent-3)' }}>💡 แนวทาง:</b> {p.ans}
            </div>
          )}
        </div>
      ))}

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginTop: 14, borderLeft: '4px solid var(--warn)' }}>
        <h4 style={{ marginTop: 0 }}>💡 Tips สอบ style ไทย</h4>
        <ul style={{ color: 'var(--text-1)' }}>
          <li><b>เขียนทุก step</b> — อาจารย์ให้คะแนน partial</li>
          <li><b>เขียน Big-O + เหตุผล</b> ไม่ใช่แค่ตอบเลข</li>
          <li><b>Proof:</b> เริ่มด้วย "จะพิสูจน์ว่า…" → ตั้งสมมติ → ทำตามลำดับ → "∴"</li>
          <li><b>Trace:</b> เขียนตารางทุก iteration ห้ามข้าม</li>
          <li><b>Design:</b> เริ่มด้วยใจความ idea ก่อน pseudocode</li>
        </ul>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   152 — Per-Lesson Practice Hub (External Problem Links)
============================================================ */
const PRACTICE_BANK = [
  { topic: 'Big-O', easy: 'CSES 1068 — Weird Algorithm', medium: 'CF Round 716 A-B', hard: 'CSES 1083 — Missing Number', cfTag: 'implementation', leetcode: 'easy/485' },
  { topic: 'Binary Search', easy: 'LeetCode 704', medium: 'LeetCode 33 (rotated)', hard: 'CSES 2422 — Subarray Sums II', cfTag: 'binary-search', leetcode: 'easy/704' },
  { topic: 'Bubble/Selection/Insertion', easy: 'CSES 1621 — Distinct Numbers', medium: 'LeetCode 75 (sort colors)', hard: '—', cfTag: 'sortings', leetcode: 'easy/912' },
  { topic: 'Merge Sort', easy: 'LeetCode 912', medium: 'CSES 1162 — Inversions', hard: 'CF EDU Step 6 (Inversions K)', cfTag: 'divide-and-conquer', leetcode: 'med/912' },
  { topic: 'Quick Sort', easy: 'LeetCode 215 (Quickselect)', medium: 'LeetCode 215', hard: 'CSES 1090 — Apartments', cfTag: 'sortings', leetcode: 'med/215' },
  { topic: 'Stack/Queue', easy: 'LeetCode 20 (parens)', medium: 'LeetCode 739 (temps)', hard: 'CSES 1645 — Nearest Smaller Values', cfTag: 'data-structures', leetcode: 'easy/20' },
  { topic: 'Hash Table', easy: 'LeetCode 1 (Two Sum)', medium: 'LeetCode 49 (anagrams)', hard: 'CSES 1640 — Sum of Two Values', cfTag: 'hashing', leetcode: 'easy/1' },
  { topic: 'Binary Tree / BST', easy: 'LeetCode 104 (depth)', medium: 'LeetCode 98 (validate BST)', hard: 'LeetCode 99 (recover BST)', cfTag: 'trees', leetcode: 'easy/104' },
  { topic: 'Hashing/KMP', easy: 'LeetCode 28 (strStr)', medium: 'CSES 1753 — String Matching', hard: 'CSES 1733 — Finding Periods', cfTag: 'string-suffix-structures', leetcode: 'easy/28' },
  { topic: 'BFS/DFS', easy: 'LeetCode 200 (islands)', medium: 'CSES 1666 — Building Roads', hard: 'CSES 1675 — Road Reparation (MST)', cfTag: 'dfs-and-similar', leetcode: 'med/200' },
  { topic: 'Topological Sort', easy: 'LeetCode 207 (Course Schedule)', medium: 'LeetCode 210', hard: 'CSES 1679 — Course Schedule', cfTag: 'graphs', leetcode: 'med/207' },
  { topic: 'Dijkstra', easy: 'LeetCode 743 (Network Delay)', medium: 'CSES 1671 — Shortest Routes I', hard: 'CSES 1195 — Flight Discount', cfTag: 'shortest-paths', leetcode: 'med/743' },
  { topic: 'Bellman-Ford/Floyd', easy: 'CSES 1672 — Shortest Routes II', medium: 'CSES 1197 — Cycle Finding', hard: 'LeetCode 787 (cheapest flights)', cfTag: 'shortest-paths', leetcode: 'med/787' },
  { topic: 'MST (Prim/Kruskal)', easy: 'CSES 1675 — Road Reparation', medium: 'LeetCode 1584 (min cost connect points)', hard: 'CF 1095F', cfTag: 'graphs', leetcode: 'med/1584' },
  { topic: 'Union-Find', easy: 'LeetCode 547 (provinces)', medium: 'LeetCode 684 (redundant)', hard: 'CSES 1676 — Road Construction', cfTag: 'dsu', leetcode: 'med/547' },
  { topic: 'Trie', easy: 'LeetCode 208 (implement)', medium: 'LeetCode 211', hard: 'LeetCode 212 (word search II)', cfTag: 'trees', leetcode: 'med/208' },
  { topic: 'Segment Tree / BIT', easy: 'CSES 1646 — Static Range Sum', medium: 'CSES 1648 — Dynamic Range Sum', hard: 'CSES 1144 — Salary Queries', cfTag: 'data-structures', leetcode: 'hard/307' },
  { topic: 'Greedy', easy: 'LeetCode 455 (cookies)', medium: 'LeetCode 55 (jump game)', hard: 'CSES 1629 — Tasks and Deadlines', cfTag: 'greedy', leetcode: 'easy/455' },
  { topic: 'DP — 1D', easy: 'LeetCode 70 (climb stairs)', medium: 'LeetCode 198 (rob)', hard: 'CSES 1633 — Dice Combinations', cfTag: 'dp', leetcode: 'easy/70' },
  { topic: 'DP — 2D / Knapsack', easy: 'LeetCode 416 (partition equal)', medium: 'CSES 1158 — Book Shop', hard: 'CSES 1745 — Money Sums', cfTag: 'dp', leetcode: 'med/416' },
  { topic: 'LIS/LCS', easy: 'LeetCode 1143 (LCS)', medium: 'LeetCode 300 (LIS)', hard: 'CSES 1145 — Increasing Subsequence', cfTag: 'dp', leetcode: 'med/300' },
  { topic: 'Backtracking', easy: 'LeetCode 78 (subsets)', medium: 'LeetCode 46 (permutations)', hard: 'LeetCode 51 (N-Queens)', cfTag: 'brute-force', leetcode: 'med/46' },
  { topic: 'Bitmask DP', easy: 'CSES 1653 — Hamiltonian flights', medium: 'CSES 1690 — Counting Tilings', hard: 'CSES 1093 — Two Sets II', cfTag: 'bitmasks', leetcode: 'hard/691' },
  { topic: 'Tree DP', easy: 'LeetCode 543 (diameter)', medium: 'CSES 1130 — Tree Matching', hard: 'CSES 1132 — Tree Diameter', cfTag: 'trees', leetcode: 'easy/543' },
  { topic: 'Number Theory', easy: 'CSES 1083', medium: 'CSES 1095 — Exponentiation', hard: 'CSES 1722 — Counting Reorders', cfTag: 'number-theory', leetcode: 'easy/204' },
];

const PRACTICE_KEY = 'algo-academy-practice-solved-v1';

Lessons31["practice-hub"] = function () {
  const [filter, setFilter] = useS31('');
  const [solved, setSolved] = useS31(() => {
    try { return JSON.parse(localStorage.getItem(PRACTICE_KEY) || '{}'); } catch { return {}; }
  });
  useE31(() => { try { localStorage.setItem(PRACTICE_KEY, JSON.stringify(solved)); } catch {} }, [solved]);

  const filtered = useM31(() => {
    const q = filter.toLowerCase();
    if (!q) return PRACTICE_BANK;
    return PRACTICE_BANK.filter(p => p.topic.toLowerCase().includes(q));
  }, [filter]);

  const toggleSolved = (topic, lvl) => {
    const k = `${topic}:${lvl}`;
    setSolved(s => ({ ...s, [k]: !s[k] }));
  };

  const totalCount = PRACTICE_BANK.length * 3;
  const solvedCount = Object.values(solved).filter(Boolean).length;

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🧪 Practice Hub — โจทย์ฝึก online ตามหัวข้อ</div>
        ลิงก์โจทย์จาก <b>Codeforces / AtCoder / LeetCode / CSES</b> แยกตาม level — ทำหลังเรียนแต่ละบท
      </div>

      <div style={{ background: 'rgba(251,191,36,0.12)', borderLeft: '4px solid var(--warn)', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
        <b style={{ color: 'var(--warn)' }}>📌 หมายเหตุ:</b> รายชื่อโจทย์เป็น <b>แนะนำ</b> โดยอ้างอิงโจทย์ที่ดังในแต่ละ topic — link เป็น tag/search ไปยังเว็บนั้น ๆ (ไม่ใช่ link ตรง). ติ๊ก "✓ solved" เพื่อบันทึก progress (เก็บใน localStorage)
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <input value={filter} onChange={e => setFilter(e.target.value)}
          placeholder="🔍 ค้น topic เช่น 'dp', 'graph', 'hash'..."
          style={{
            flex: 1, padding: 10, background: 'var(--bg-2)', color: 'var(--text-0)',
            border: '1px solid var(--border)', borderRadius: 8, fontSize: 14
          }} />
        <div style={{ background: 'var(--bg-3)', padding: '8px 14px', borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }}>
          ✓ {solvedCount} / {totalCount} ({Math.round(solvedCount / totalCount * 100)}%)
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map((p, i) => (
          <div key={i} style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10, borderLeft: '4px solid var(--accent)' }}>
            <h4 style={{ marginTop: 0, color: 'var(--accent)' }}>{p.topic}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              {['easy', 'medium', 'hard'].map(lvl => {
                const k = `${p.topic}:${lvl}`;
                const done = !!solved[k];
                const colors = {
                  easy: { bg: 'rgba(52,211,153,0.2)', col: 'var(--accent-3)' },
                  medium: { bg: 'rgba(251,191,36,0.2)', col: 'var(--warn)' },
                  hard: { bg: 'rgba(248,113,113,0.2)', col: 'var(--danger)' },
                };
                return (
                  <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={done} onChange={() => toggleSolved(p.topic, lvl)} />
                    <span style={{ background: colors[lvl].bg, color: colors[lvl].col, padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{lvl.toUpperCase().slice(0, 3)}</span>
                    <span style={{ color: 'var(--text-1)', textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>{p[lvl]}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <a href={`https://codeforces.com/problemset?tags=${encodeURIComponent(p.cfTag)}`} target="_blank" rel="noreferrer"
                style={{ background: 'var(--bg-3)', color: 'var(--text-0)', padding: '4px 8px', borderRadius: 4, fontSize: 11, textDecoration: 'none' }}>
                CF tag: {p.cfTag}
              </a>
              <a href={`https://leetcode.com/problemset/?search=${encodeURIComponent(p.topic)}`} target="_blank" rel="noreferrer"
                style={{ background: 'var(--bg-3)', color: 'var(--text-0)', padding: '4px 8px', borderRadius: 4, fontSize: 11, textDecoration: 'none' }}>
                LC
              </a>
              <a href="https://cses.fi/problemset/" target="_blank" rel="noreferrer"
                style={{ background: 'var(--bg-3)', color: 'var(--text-0)', padding: '4px 8px', borderRadius: 4, fontSize: 11, textDecoration: 'none' }}>
                CSES
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginTop: 20 }}>
        <h4 style={{ marginTop: 0 }}>📖 แนะนำลำดับฝึก</h4>
        <ol style={{ color: 'var(--text-1)' }}>
          <li><b>CSES Problem Set</b> — 300+ ข้อจัดตาม topic ครอบคลุมทุกอย่าง (cses.fi/problemset)</li>
          <li><b>USACO Guide</b> — แนวทาง competitive (usaco.guide)</li>
          <li><b>LeetCode Top 150</b> — สำหรับ interview</li>
          <li><b>Codeforces Div 2/3</b> — ทำ contest จริง สัปดาห์ละ 1</li>
          <li><b>AtCoder Beginner Contest (ABC)</b> — เหมาะกับ Beginner — Med</li>
        </ol>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   153 — PWA Install + Offline Status
============================================================ */
Lessons31["pwa-install"] = function () {
  const [installable, setInstallable] = useS31(false);
  const [installed, setInstalled] = useS31(false);
  const [deferred, setDeferred] = useS31(null);
  const [online, setOnline] = useS31(navigator.onLine);
  const [swStatus, setSwStatus] = useS31('checking');

  useE31(() => {
    const onBefore = (e) => { e.preventDefault(); setDeferred(e); setInstallable(true); };
    const onInst = () => setInstalled(true);
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    window.addEventListener('beforeinstallprompt', onBefore);
    window.addEventListener('appinstalled', onInst);
    window.addEventListener('online', onOn);
    window.addEventListener('offline', onOff);
    // check sw
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        setSwStatus(reg ? 'active' : 'none');
      }).catch(() => setSwStatus('error'));
    } else {
      setSwStatus('unsupported');
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore);
      window.removeEventListener('appinstalled', onInst);
      window.removeEventListener('online', onOn);
      window.removeEventListener('offline', onOff);
    };
  }, []);

  const doInstall = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferred(null); setInstallable(false);
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📱 PWA — ติดตั้งเป็นแอป + ใช้ Offline</div>
        เว็บนี้รองรับ <b>Progressive Web App</b> — ติดตั้งบนเครื่องแล้วใช้แบบไม่ต้องเปิด browser + ใช้ offline หลังเข้าครั้งแรก
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 14 }}>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Connection</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: online ? 'var(--accent-3)' : 'var(--danger)', marginTop: 6 }}>
            {online ? '🟢 Online' : '🔴 Offline'}
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Service Worker</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: swStatus === 'active' ? 'var(--accent-3)' : 'var(--warn)', marginTop: 6 }}>
            {swStatus === 'active' ? '✓ Active' : swStatus === 'none' ? '⏳ Not registered' : swStatus === 'unsupported' ? '✗ Browser ไม่รองรับ' : '⏳ Checking'}
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Install</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: installed ? 'var(--accent-3)' : 'var(--text-2)', marginTop: 6 }}>
            {installed ? '✓ Installed' : installable ? '⬇ Ready' : '—'}
          </div>
        </div>
      </div>

      {installable && !installed && (
        <button onClick={doInstall} style={{
          background: 'var(--accent)', color: '#000', padding: '14px 28px',
          fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 14
        }}>📲 ติดตั้งเป็นแอป</button>
      )}

      <h3>วิธีติดตั้งด้วยตัวเอง</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Chrome (Desktop):</b> คลิกไอคอน install บน address bar ⊕</li>
        <li><b>Chrome (Android):</b> เมนู ⋮ → "Install app"</li>
        <li><b>Safari (iOS):</b> ปุ่ม Share → "Add to Home Screen"</li>
        <li><b>Edge:</b> เมนู … → "Apps" → "Install this site as an app"</li>
      </ul>

      <h3>ประโยชน์</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>เปิดเร็วขึ้น (cache แล้ว)</li>
        <li>ใช้ <b>ห้องสอบที่ไม่มีเน็ต</b>ได้ (หลังเข้าครั้งแรก)</li>
        <li>เปิดเหมือนแอปเต็มจอ — ไม่มี address bar</li>
        <li>ไอคอนใน home screen / launcher</li>
      </ul>

      <h3>โครงไฟล์ที่ทำให้เป็น PWA</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><code>manifest.webmanifest</code> — ชื่อแอป, ไอคอน, theme</li>
        <li><code>sw.js</code> — Service Worker จัดการ cache</li>
        <li><code>&lt;link rel="manifest"&gt;</code> ใน index.html</li>
        <li>HTTPS (หรือ localhost)</li>
      </ol>
    </React.Fragment>
  );
};

window.LessonsPart31 = Lessons31;
