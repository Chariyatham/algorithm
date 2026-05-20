/* Lessons Part 23 — STL Containers: overview, vector-deep, string, iterators, pair-tuple, stack-queue, deque, priority-queue */

const { useState: useS23, useMemo: useM23 } = React;
const { Quiz: Quiz23 } = window.LessonComponents;
const { WorkedExample: WE23, CheatSheet: CS23, Pitfalls: PF23 } = window.LearningKit;

const Lessons23 = {};

/* ============================================================
   Shared Viz — Vector Resize (capacity doubling animation)
============================================================ */
function VectorResizeViz() {
  const [size, setSize] = useS23(0);
  const [cap, setCap] = useS23(1);
  const [log, setLog] = useS23([]);
  const [highlight, setHighlight] = useS23(null);

  const push = () => {
    const newSize = size + 1;
    if (newSize > cap) {
      const newCap = cap * 2;
      setLog(l => [...l, { op: newSize, cost: newSize, resize: true, oldCap: cap, newCap }]);
      setCap(newCap);
      setHighlight('resize');
      setTimeout(() => setHighlight(null), 600);
    } else {
      setLog(l => [...l, { op: newSize, cost: 1, resize: false }]);
      setHighlight(newSize - 1);
      setTimeout(() => setHighlight(null), 400);
    }
    setSize(newSize);
  };

  const reset = () => { setSize(0); setCap(1); setLog([]); setHighlight(null); };

  const totalCost = log.reduce((s, x) => s + x.cost, 0);
  const avg = log.length ? (totalCost / log.length).toFixed(2) : '—';

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <button onClick={push} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>+ push_back</button>
        <button onClick={reset}>↺ Reset</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>
          size = <b style={{ color: 'var(--accent-2)' }}>{size}</b> /
          capacity = <b style={{ color: 'var(--accent)' }}>{cap}</b>
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--text-2)', fontSize: 12 }}>
          Avg cost/push = <b style={{ color: 'var(--accent-2)' }}>{avg}</b>
        </span>
      </div>

      {/* Bar layout */}
      <div style={{ display: 'flex', gap: 4, padding: 12, background: 'var(--bg-1)', borderRadius: 6, minHeight: 60, overflowX: 'auto' }}>
        {Array.from({ length: cap }).map((_, i) => {
          const filled = i < size;
          const isHi = highlight === i;
          const isResize = highlight === 'resize' && filled;
          return (
            <div key={i} style={{
              minWidth: 32, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: filled ? (isHi ? '#fbbf24' : (isResize ? 'rgba(248,113,113,0.5)' : 'rgba(94,234,212,0.25)')) : 'var(--bg-3)',
              border: '1px solid ' + (filled ? 'var(--accent-2)' : 'var(--border)'),
              borderRadius: 4, fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
              color: filled ? 'var(--text-0)' : 'var(--text-3)',
              transition: 'all 0.25s'
            }}>
              {filled ? (i + 1) : '·'}
            </div>
          );
        })}
      </div>

      {/* Last action info */}
      {log.length > 0 && (
        <div style={{ marginTop: 8, padding: 8, background: log[log.length - 1].resize ? 'rgba(248,113,113,0.1)' : 'rgba(94,234,212,0.08)', borderLeft: '3px solid ' + (log[log.length - 1].resize ? '#f87171' : 'var(--accent-2)'), borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
          {log[log.length - 1].resize ? (
            <span>⚡ <b>RESIZE!</b> capacity {log[log.length - 1].oldCap} → {log[log.length - 1].newCap}, copy {log[log.length - 1].cost - 1} elements + insert 1 → cost = <b>{log[log.length - 1].cost}</b></span>
          ) : (
            <span>✓ push #{log[log.length - 1].op} — cost = <b>{log[log.length - 1].cost}</b></span>
          )}
        </div>
      )}

      {/* Cost chart */}
      {log.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 4 }}>📊 Cost per push:</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60, padding: 4, background: 'var(--bg-1)', borderRadius: 4 }}>
            {log.slice(-30).map((l, i) => (
              <div key={i} title={`push #${l.op}: cost ${l.cost}`}
                style={{
                  flex: 1, minWidth: 8,
                  height: Math.max(4, Math.min(56, l.cost * 4)),
                  background: l.resize ? '#f87171' : 'var(--accent-2)',
                  borderRadius: 2
                }} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
            🔴 = resize (expensive) · 🟢 = normal O(1) · Total cost = {totalCost} · Avg = {avg}
          </div>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 ลอง push 16 ครั้ง — ดูว่า resize เกิดที่ index 1, 2, 4, 8, 16 (powers of 2) → cost รวมยังเป็น O(n)
      </div>
    </div>
  );
}

/* ============================================================
   stl-overview — Big picture ของ STL
============================================================ */
Lessons23["stl-overview"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 เป้าหมาย</div>
        เห็นภาพรวม STL ทั้งหมด ก่อนเจาะแต่ละ container — รู้ว่าตัวไหนใช้เมื่อไหร่
      </div>

      <h3>STL = 3 ส่วนหลัก</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '14px 0' }}>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, borderTop: '3px solid var(--accent)' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>📦</div>
          <b style={{ color: 'var(--accent)' }}>Containers</b>
          <div style={{ fontSize: 13, marginTop: 4 }}>vector, list, deque, stack, queue, priority_queue, set, map, unordered_*</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, borderTop: '3px solid var(--accent-2)' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🔁</div>
          <b style={{ color: 'var(--accent-2)' }}>Iterators</b>
          <div style={{ fontSize: 13, marginTop: 4 }}>.begin(), .end(), iterator categories (input/output/forward/...)</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, borderTop: '3px solid var(--accent-3)' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>⚙️</div>
          <b style={{ color: 'var(--accent-3)' }}>Algorithms</b>
          <div style={{ fontSize: 13, marginTop: 4 }}>sort, find, binary_search, lower_bound, accumulate, transform, ...</div>
        </div>
      </div>

      <h3>Container Comparison — Complete Table</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="cmp" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th>Container</th>
              <th>Order</th>
              <th>Access</th>
              <th>Insert/Erase</th>
              <th>Search</th>
              <th>Use case</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>vector</code></td><td>Insertion</td><td className="mono">O(1) [i]</td><td className="mono">O(n) middle, O(1) end</td><td className="mono">O(n)</td><td>Default array — ขนาด dynamic</td></tr>
            <tr><td><code>array</code></td><td>Fixed size</td><td className="mono">O(1) [i]</td><td>—</td><td className="mono">O(n)</td><td>Stack-allocated, ขนาดคงที่</td></tr>
            <tr><td><code>list</code></td><td>Insertion</td><td className="mono">O(n)</td><td className="mono">O(1) anywhere (มี iter)</td><td className="mono">O(n)</td><td>Doubly-linked, splice ได้</td></tr>
            <tr><td><code>deque</code></td><td>Insertion</td><td className="mono">O(1) [i]</td><td className="mono">O(1) both ends</td><td className="mono">O(n)</td><td>Sliding window, queue ที่ access ได้</td></tr>
            <tr><td><code>stack</code></td><td>LIFO</td><td className="mono">O(1) top</td><td className="mono">O(1)</td><td>—</td><td>DFS, parser, undo</td></tr>
            <tr><td><code>queue</code></td><td>FIFO</td><td className="mono">O(1) front</td><td className="mono">O(1)</td><td>—</td><td>BFS, scheduling</td></tr>
            <tr><td><code>priority_queue</code></td><td>Max-heap default</td><td className="mono">O(1) top</td><td className="mono">O(log n)</td><td>—</td><td>Dijkstra, top-K, scheduler</td></tr>
            <tr><td><code>set</code></td><td>Sorted</td><td className="mono">O(log n)</td><td className="mono">O(log n)</td><td className="mono">O(log n)</td><td>Unique sorted set, range queries</td></tr>
            <tr><td><code>multiset</code></td><td>Sorted</td><td className="mono">O(log n)</td><td className="mono">O(log n)</td><td className="mono">O(log n)</td><td>Sorted multiset (duplicates ok)</td></tr>
            <tr><td><code>map</code></td><td>Sorted by key</td><td className="mono">O(log n) [k]</td><td className="mono">O(log n)</td><td className="mono">O(log n)</td><td>Sorted key→value</td></tr>
            <tr><td><code>unordered_set</code></td><td>Hash</td><td className="mono">O(1) avg</td><td className="mono">O(1) avg</td><td className="mono">O(1) avg</td><td>Fast lookup, ไม่ต้อง sorted</td></tr>
            <tr><td><code>unordered_map</code></td><td>Hash</td><td className="mono">O(1) avg [k]</td><td className="mono">O(1) avg</td><td className="mono">O(1) avg</td><td>Fast key→value lookup</td></tr>
            <tr><td><code>bitset</code></td><td>Fixed bits</td><td className="mono">O(1)</td><td className="mono">O(1)</td><td className="mono">O(N/64)</td><td>Fast bit ops, ขนาด N constant</td></tr>
          </tbody>
        </table>
      </div>

      <h3>เลือก Container ยังไง? — Decision Tree</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontSize: 14, lineHeight: 1.8 }}>
        <b>1. ต้องการ key → value mapping?</b><br/>
        &nbsp;&nbsp;Yes + ต้อง sorted → <code>map</code><br/>
        &nbsp;&nbsp;Yes + แค่ lookup เร็ว → <code>unordered_map</code><br/>
        <br/>
        <b>2. ต้องการ unique values?</b><br/>
        &nbsp;&nbsp;Yes + sorted → <code>set</code><br/>
        &nbsp;&nbsp;Yes + fast lookup → <code>unordered_set</code><br/>
        <br/>
        <b>3. Sequence (มี duplicate, มี order)?</b><br/>
        &nbsp;&nbsp;เข้า/ออกท้ายอย่างเดียว → <code>vector</code> หรือ <code>stack</code><br/>
        &nbsp;&nbsp;เข้า/ออกหัว → <code>queue</code> หรือ <code>deque</code><br/>
        &nbsp;&nbsp;เข้า/ออกทั้ง 2 ปลาย → <code>deque</code><br/>
        &nbsp;&nbsp;หา max/min เร็ว → <code>priority_queue</code><br/>
        &nbsp;&nbsp;Insert ตรงกลางบ่อย → <code>list</code> (rarely needed)<br/>
      </div>

      <h3>Header Files</h3>
      <pre className="code-block">{`#include <vector>          // vector
#include <string>          // string
#include <deque>           // deque
#include <stack>           // stack
#include <queue>           // queue, priority_queue
#include <set>             // set, multiset
#include <map>             // map, multimap
#include <unordered_set>   // unordered_set
#include <unordered_map>   // unordered_map
#include <bitset>          // bitset
#include <utility>         // pair, make_pair, swap
#include <tuple>           // tuple, make_tuple
#include <algorithm>       // sort, find, lower_bound, etc.
#include <numeric>         // accumulate, iota, gcd
#include <functional>      // less, greater, function`}</pre>

      <CS23 title="STL Big Picture" sections={[
        { label: "Default sequence", value: "<code>vector</code> — เลือกเมื่อสงสัย" },
        { label: "Default ordered map", value: "<code>map</code> หรือ <code>unordered_map</code>" },
        { label: "FIFO/LIFO", value: "<code>queue</code> / <code>stack</code>" },
        { label: "Max/min ที่ insert ได้", value: "<code>priority_queue</code>" },
        { label: "Iterator", value: "common interface ของทุก container" },
        { label: "Algorithm", value: "ทำงานบน iterator → ใช้กับ container ใดก็ได้" },
      ]} />

      <Quiz23 q={{
        question: "ต้องการ ‘เก็บ unique IDs และเช็คว่ามีไหม’ บ่อย ๆ — ใช้ container ไหน?",
        options: ["vector", "set", "unordered_set", "ขึ้นกับว่าต้องการ sorted หรือไม่"],
        answer: 3,
        explain: "ถ้าต้อง iterate ตามลำดับ → <code>set</code> (O(log n)). ถ้าแค่ check/insert เร็วสุด → <code>unordered_set</code> (O(1) avg)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   stl-vector-deep — Vector ทั้งหมด
============================================================ */
Lessons23["stl-vector-deep"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 std::vector — Dynamic Array</div>
        Container ที่ใช้บ่อยที่สุด — เข้าใจให้ลึก จะใช้ทั้งชีวิต
      </div>

      <h3>1. การสร้าง</h3>
      <pre className="code-block">{`vector<int> v1;                 // empty
vector<int> v2(10);             // size 10, default value (0)
vector<int> v3(10, 7);          // size 10, all = 7
vector<int> v4 = {1, 2, 3, 4};  // initializer list
vector<int> v5(v4);             // copy from v4
vector<int> v6(v4.begin(), v4.end());  // from iterators

// 2D vector (matrix)
vector<vector<int>> matrix(rows, vector<int>(cols, 0));
// rows × cols, all zeros`}</pre>

      <h3>2. Access</h3>
      <pre className="code-block">{`v[i]              // O(1) — no bounds check (เร็ว)
v.at(i)           // O(1) — throw exception ถ้า out of bounds
v.front()         // first element (= v[0])
v.back()          // last element (= v[v.size()-1])
v.data()          // raw pointer (สำหรับ C interop)`}</pre>

      <h3>3. Modify</h3>
      <pre className="code-block">{`v.push_back(x);        // เพิ่มท้าย — amortized O(1)
v.pop_back();          // ลบท้าย — O(1)
v.emplace_back(args);  // construct in-place — เร็วกว่า push_back สำหรับ object ใหญ่

v.insert(v.begin() + 2, x);          // insert ที่ position 2 — O(n)
v.insert(v.begin(), {1, 2, 3});      // insert list ที่ต้น
v.erase(v.begin() + 1);              // erase index 1 — O(n)
v.erase(v.begin() + 1, v.begin() + 4);  // erase range [1, 4) — O(n)

v.clear();             // ลบทั้งหมด — O(n)
v.resize(20);          // ขยายเป็น 20 (เติม 0)
v.resize(20, -1);      // ขยายเป็น 20 (เติม -1)
v.assign(5, 9);        // [9, 9, 9, 9, 9] — เปลี่ยนทั้งหมด`}</pre>

      <h3>4. Size & Capacity</h3>
      <pre className="code-block">{`v.size()          // จำนวน element
v.empty()         // true ถ้า size == 0
v.capacity()      // ขนาด memory ที่ allocate (≥ size)
v.reserve(1000);  // pre-allocate capacity = 1000 → ลด resize
v.shrink_to_fit(); // ลด capacity ลงเท่า size (free unused memory)`}</pre>

      <h3>5. ทำไม push_back = amortized O(1)?</h3>

      <h4 style={{ marginTop: 14, color: 'var(--accent-2)' }}>🎬 Interactive — กด push_back ดู capacity ขยาย</h4>
      <VectorResizeViz />

      <WE23
        title="Vector Growth"
        problem="vector resize ยังไงเมื่อ push_back?"
        steps={[
          { title: "Capacity เริ่ม 0", body: "push_back x → capacity = 1, size = 1", why: "Allocate ใหม่" },
          { title: "เต็ม → ขยาย 2 เท่า", body: "push_back y → capacity = 2 (copy x), size = 2\npush_back z → capacity = 4 (copy x, y), size = 3", why: "Geometric growth" },
          { title: "Cost analysis", body: "Cost รวมของ n push_backs:\n  resize: 1+2+4+...+n = 2n\n  copy + insert: n\n  Total ≈ 3n → amortized 3 ต่อ push", why: "Geometric series sum" },
          { title: "Optimization", body: "<code>v.reserve(n)</code> ก่อน push n ครั้ง → ไม่ต้อง resize เลย\n→ 1 copy per element + 1 alloc = O(n) แทน 3n", why: "Hint capacity ล่วงหน้า" },
        ]}
        answer="push_back amortized O(1) (และเร็วขึ้นด้วย reserve) ▢"
      />

      <h3>6. Iteration</h3>
      <pre className="code-block">{`// 1. Index-based (รู้ index)
for (int i = 0; i < v.size(); i++) cout << v[i];

// 2. Iterator
for (auto it = v.begin(); it != v.end(); ++it) cout << *it;

// 3. Range-for (modern, recommended)
for (const auto& x : v) cout << x;        // อ่านอย่างเดียว
for (auto& x : v) x *= 2;                 // เปลี่ยนได้`}</pre>

      <h3>7. Useful tricks</h3>
      <pre className="code-block">{`// Initialize 2D vector
vector<vector<int>> g(n, vector<int>(m, 0));   // n × m zeros

// Swap วิธีลด memory (clear capacity)
vector<int>().swap(v);   // ปล่อย memory ทั้งหมด

// Remove all occurrences of value (erase-remove idiom)
v.erase(remove(v.begin(), v.end(), 5), v.end());

// Sort + unique (remove consecutive duplicates หลัง sort)
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// Min/max value
int mn = *min_element(v.begin(), v.end());
int mx = *max_element(v.begin(), v.end());

// Sum
int total = accumulate(v.begin(), v.end(), 0);`}</pre>

      <h3>8. Iterator Invalidation</h3>
      <div className="callout warn">
        <div className="ttl">⚠ Iterator Invalidation</div>
        เมื่อ vector resize (จาก push_back ที่ทำให้เต็ม capacity) → <b>iterators เก่าทั้งหมดใช้ไม่ได้</b><br/>
        Memory ถูก reallocate ที่ใหม่ — iterator ชี้ที่เก่าซึ่งโดน free แล้ว
      </div>
      <pre className="code-block">{`vector<int> v = {1, 2, 3};
auto it = v.begin();
v.push_back(99);          // อาจ resize!
cout << *it;              // ⚠ undefined — it อาจ invalidated

// Solution 1: ใช้ index แทน
int idx = 0;
v.push_back(99);
cout << v[idx];           // ✓ safe

// Solution 2: reserve ล่วงหน้า
v.reserve(100);
auto it = v.begin();
v.push_back(99);          // ไม่ resize → it ยัง valid
cout << *it;              // ✓`}</pre>

      <CS23 title="Vector Cheat Sheet" sections={[
        { label: "Create", value: "<code>vector&lt;T&gt; v(n, val);</code>" },
        { label: "Add", value: "<code>v.push_back(x)</code> — O(1) amortized" },
        { label: "Access", value: "<code>v[i]</code>, <code>v.front()</code>, <code>v.back()</code>" },
        { label: "Size", value: "<code>v.size()</code>, <code>v.empty()</code>" },
        { label: "Iterate", value: "<code>for (const auto&amp; x : v)</code>" },
        { label: "Sort", value: "<code>sort(v.begin(), v.end())</code>" },
        { label: "Reserve", value: "<code>v.reserve(n)</code> — เร็วขึ้นถ้ารู้ size" },
      ]} />

      <PF23 items={[
        { trap: "ใช้ <code>v[i]</code> ที่ i ≥ size → undefined", fix: "ใช้ <code>v.at(i)</code> ถ้าต้อง bound check (ช้ากว่าเล็กน้อย)" },
        { trap: "<code>vector&lt;bool&gt;</code> — special! ไม่ใช่ array of bool", fix: "ถ้าต้อง real bool array → ใช้ <code>vector&lt;char&gt;</code> หรือ <code>bitset</code>" },
        { trap: "ผ่าน vector by value → copy ทั้ง array (ช้า)", fix: "ผ่าน <code>const vector&lt;T&gt;&amp;</code> หรือ <code>vector&lt;T&gt;&amp;</code>" },
        { trap: "Iterator invalidation หลัง push_back", fix: "ใช้ index หรือ <code>reserve</code> ล่วงหน้า" },
      ]} />

      <Quiz23 q={{
        question: "vector มี size = 1000, capacity = 1024. push_back ครั้งต่อไป complexity?",
        options: ["O(1) — ไม่ resize", "O(n) — resize ทุกครั้ง", "O(log n)", "O(n²)"],
        answer: 0,
        explain: "capacity > size → ยังมีที่ว่าง → push_back O(1) ทันที. จะ resize เมื่อ size == capacity"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   stl-string — std::string deep
============================================================ */
Lessons23["stl-string"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 std::string — Smart C-string</div>
        Wrapper รอบ char array ที่ดูแล memory ให้ + มี method สะดวก
      </div>

      <h3>1. การสร้าง</h3>
      <pre className="code-block">{`#include <string>

string s1;                     // empty ""
string s2 = "hello";
string s3(5, 'a');             // "aaaaa"
string s4 = s2;                // copy
string s5(s2, 1, 3);           // substring จาก index 1, length 3 → "ell"
string s6 = to_string(42);     // "42"
int n = stoi("123");           // 123
double d = stod("3.14");       // 3.14`}</pre>

      <h3>2. Concatenation & Append</h3>
      <pre className="code-block">{`string a = "Hello", b = "World";
string c = a + " " + b;         // "Hello World"
a += " ";                       // "Hello "
a += b;                         // "Hello World"
a.append(b);                    // same as +=
a.append(3, '!');               // "Hello World!!!"`}</pre>

      <h3>3. Access</h3>
      <pre className="code-block">{`string s = "hello";
s[0]              // 'h' — O(1)
s.at(0)           // 'h' — bound checked
s.front()         // 'h'
s.back()          // 'o'
s.size()          // 5  (= s.length())
s.empty()         // false
s.c_str()         // const char* — สำหรับส่งให้ C function`}</pre>

      <h3>4. Substring & Find</h3>
      <pre className="code-block">{`string s = "hello world";

s.substr(6)           // "world" — จาก index 6 ถึงท้าย
s.substr(0, 5)        // "hello" — จาก 0, length 5
s.substr(6, 3)        // "wor"

s.find("world")       // 6 — first occurrence
s.find("xyz")         // string::npos (= -1, max size_t)
s.find('o')           // 4 — find char
s.find('o', 5)        // 7 — find from index 5
s.rfind('o')          // 7 — find from right

if (s.find("world") != string::npos) {
  cout << "found";
}`}</pre>

      <h3>5. Modify</h3>
      <pre className="code-block">{`string s = "hello";
s.push_back('!');         // "hello!"
s.pop_back();             // "hello"
s.insert(0, "Mr. ");      // "Mr. hello"
s.erase(0, 4);            // "hello" — erase 4 chars จาก 0
s.replace(0, 5, "world"); // replace [0, 5) → "world"
s.clear();                // ""`}</pre>

      <h3>6. Compare</h3>
      <pre className="code-block">{`string a = "apple", b = "banana";
a == b               // false
a < b                // true — lexicographic
a.compare(b)         // -1 (a < b), 0 (=), 1 (a > b)`}</pre>

      <h3>7. Conversion & Parsing</h3>
      <pre className="code-block">{`// Number → string
int n = 42;
string s = to_string(n);          // "42"

// string → number
int x = stoi("123");              // 123
long ll = stoll("9999999999");
double d = stod("3.14");

// stoi with base
int hex = stoi("ff", nullptr, 16);  // 255 (parse hex)

// Char conversion
char c = 'A';
int code = c;                     // 65 (ASCII)
char back = (char)(code + 1);     // 'B'

// Case
string s = "Hello";
for (char& c : s) c = tolower(c);  // "hello"
for (char& c : s) c = toupper(c);  // "HELLO"`}</pre>

      <h3>8. Iterate & Range-for</h3>
      <pre className="code-block">{`string s = "hello";
for (char c : s) cout << c;          // h e l l o
for (char& c : s) c = toupper(c);    // เปลี่ยน in-place

// Iterator
for (auto it = s.begin(); it != s.end(); ++it) cout << *it;`}</pre>

      <h3>9. Common Patterns</h3>
      <pre className="code-block">{`// Split string by delimiter
vector<string> split(const string& s, char delim) {
  vector<string> result;
  string cur;
  for (char c : s) {
    if (c == delim) { result.push_back(cur); cur.clear(); }
    else cur += c;
  }
  result.push_back(cur);
  return result;
}

// Reverse
reverse(s.begin(), s.end());

// Check palindrome
bool isPalin(const string& s) {
  int l = 0, r = s.size() - 1;
  while (l < r) if (s[l++] != s[r--]) return false;
  return true;
}

// Count occurrences of char
int cnt = count(s.begin(), s.end(), 'a');

// Sort chars
sort(s.begin(), s.end());`}</pre>

      <CS23 title="String Cheat Sheet" sections={[
        { label: "Length", value: "<code>s.size()</code> หรือ <code>s.length()</code>" },
        { label: "Substring", value: "<code>s.substr(start, len)</code>" },
        { label: "Find", value: "<code>s.find(str)</code> → <code>string::npos</code> ถ้าไม่เจอ" },
        { label: "Number ↔ String", value: "<code>to_string(n)</code>, <code>stoi(s)</code>, <code>stod(s)</code>" },
        { label: "Concat", value: "<code>a + b</code>, <code>a += b</code>, <code>a.append(b)</code>" },
        { label: "C-string", value: "<code>s.c_str()</code> ส่งให้ <code>printf</code> หรือ C API" },
      ]} />

      <PF23 items={[
        { trap: "Compare string ด้วย <code>strcmp(s.c_str(), \"...\")</code>", fix: "ใช้ <code>s == \"...\"</code> ตรง ๆ — โอเปอเรเตอร์ overload" },
        { trap: "<code>s += s + s;</code> สร้าง temporary string ใหญ่", fix: "ใช้ <code>s.append(s); s.append(s);</code> หรือ <code>s.reserve()</code> ก่อน" },
        { trap: "ลืม <code>string::npos</code> เป็น unsigned (-1 = max)", fix: "เทียบด้วย <code>== string::npos</code> ไม่ใช่ <code>== -1</code>" },
        { trap: "Index out of bound แต่ไม่ error (<code>s[i]</code>)", fix: "ใช้ <code>s.at(i)</code> ถ้าต้อง bound check" },
      ]} />

      <Quiz23 q={{
        question: "<code>s.find(\"x\")</code> คืนค่าอะไรเมื่อไม่เจอ?",
        options: ["<code>-1</code>", "<code>s.size()</code>", "<code>string::npos</code>", "throw exception"],
        answer: 2,
        explain: "<code>string::npos</code> = max value of size_t (unsigned) ≈ −1 ในการตีความ signed. แต่ต้องเทียบกับ <code>string::npos</code> ตรง ๆ"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   Shared Viz — Iterator Movement
============================================================ */
function IteratorViz() {
  const ARR = [10, 20, 30, 40, 50, 60];
  const [pos, setPos] = useS23(0);
  const [mode, setMode] = useS23('forward');
  const isEnd = pos === ARR.length;
  const startPos = mode === 'forward' ? 0 : ARR.length - 1;

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[['forward', '.begin() → .end()'], ['reverse', '.rbegin() → .rend()']].map(([k, l]) => (
          <button key={k} onClick={() => { setMode(k); setPos(k === 'forward' ? 0 : ARR.length - 1); }}
            style={{ background: mode === k ? 'var(--accent)' : 'var(--bg-3)', color: mode === k ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: mode === k ? 700 : 400 }}>
            {l}
          </button>
        ))}
      </div>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <button onClick={() => setPos(startPos)}>↺ begin</button>
        {mode === 'forward'
          ? <React.Fragment><button onClick={() => setPos(p => Math.max(0, p - 1))} disabled={pos === 0}>◀ --it</button><button onClick={() => setPos(p => Math.min(ARR.length, p + 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>++it ▶</button></React.Fragment>
          : <React.Fragment><button onClick={() => setPos(p => Math.min(ARR.length - 1, p + 1))} disabled={pos === ARR.length - 1}>--rit ◀</button><button onClick={() => setPos(p => Math.max(-1, p - 1))} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>++rit ▶</button></React.Fragment>
        }
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>
          pos = {pos}, *it = {pos >= 0 && pos < ARR.length ? ARR[pos] : <i>past-end</i>}
        </span>
      </div>

      <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 6 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
          {ARR.map((v, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ height: 20, fontSize: 18, color: 'var(--accent)' }}>
                {(mode === 'forward' && pos === i) || (mode === 'reverse' && pos === i) ? '↓' : ''}
              </div>
              <div style={{
                width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: pos === i ? 'var(--accent)' : 'var(--bg-3)',
                color: pos === i ? '#000' : 'var(--text-0)',
                border: '1px solid var(--border)', borderRadius: 4,
                fontFamily: 'monospace', fontWeight: 600, fontSize: 15
              }}>{v}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>[{i}]</div>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <div style={{ height: 20, fontSize: 14, color: '#f87171' }}>
              {((mode === 'forward' && pos === ARR.length) || (mode === 'reverse' && pos === -1)) ? '↓' : ''}
            </div>
            <div style={{
              width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: ((mode === 'forward' && pos === ARR.length) || (mode === 'reverse' && pos === -1)) ? 'rgba(248,113,113,0.3)' : 'var(--bg-3)',
              border: '1px dashed #f87171', borderRadius: 4,
              fontSize: 10, color: '#f87171', textAlign: 'center'
            }}>past-<br/>end</div>
            <div style={{ fontSize: 10, color: '#f87171' }}>{mode === 'forward' ? '.end()' : '.rend()'}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-1)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
        {mode === 'forward'
          ? <span>auto it = v.<b style={{ color: 'var(--accent-2)' }}>begin()</b>;  // pos 0<br />while (it != v.<b style={{ color: '#f87171' }}>end()</b>) {`{`} cout &lt;&lt; *it; ++it; {`}`}</span>
          : <span>auto rit = v.<b style={{ color: 'var(--accent-2)' }}>rbegin()</b>;  // pos {ARR.length - 1}<br />while (rit != v.<b style={{ color: '#f87171' }}>rend()</b>) {`{`} cout &lt;&lt; *rit; ++rit; {`}`}</span>
        }
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <code>end()</code> = <b>past-the-end</b> — ห้าม dereference. ใช้เพื่อเทียบ <code>it != v.end()</code> หยุด loop
      </div>
    </div>
  );
}

/* ============================================================
   stl-iterators — Iterator concepts & categories
============================================================ */
Lessons23["stl-iterators"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Iterator — Generic ‘pointer’ ของ STL</div>
        Iterator คือ object ที่ทำตัวคล้าย pointer — ใช้ <code>++</code>, <code>*</code>, <code>==</code> ได้<br/>
        ทำให้ <b>algorithm ตัวเดียวใช้กับทุก container</b>
      </div>

      <h3>1. แนวคิด</h3>
      <p>
        แทนที่จะรู้ว่า container เป็น vector / list / set ภายใน → algorithm <b>รับ iterator</b><br/>
        Iterator รู้วิธี "next" และ "ดึง element" จาก container ใด ๆ
      </p>

      <h3>🎬 Interactive — เดิน iterator ไป-กลับ ดู past-end</h3>
      <IteratorViz />

      <h3>2. การใช้พื้นฐาน</h3>
      <pre className="code-block">{`vector<int> v = {10, 20, 30};

auto it = v.begin();       // iterator ชี้ตัวแรก
cout << *it;               // 10 (dereference)
++it;                      // ขยับไปตัวถัดไป
cout << *it;               // 20

auto end = v.end();        // iterator "ผ่านตัวสุดท้าย" (past-the-end)
// end ไม่ใช่ตัวสุดท้าย แต่เป็น "ถัดจากตัวสุดท้าย"
// → ห้าม dereference end

while (it != v.end()) {
  cout << *it << " ";
  ++it;
}`}</pre>

      <h3>3. Iterator Categories (จากอ่อน → แข็ง)</h3>
      <table className="cmp">
        <thead><tr><th>Category</th><th>Operations</th><th>Container</th></tr></thead>
        <tbody>
          <tr><td>Input</td><td><code>++</code>, <code>*</code> (read), <code>==</code></td><td><code>istream_iterator</code></td></tr>
          <tr><td>Output</td><td><code>++</code>, <code>*</code> (write)</td><td><code>ostream_iterator</code></td></tr>
          <tr><td>Forward</td><td>+ multi-pass (อ่านซ้ำ ๆ ได้)</td><td><code>forward_list</code></td></tr>
          <tr><td>Bidirectional</td><td>+ <code>--</code></td><td><code>list, set, map</code></td></tr>
          <tr><td>Random Access</td><td>+ <code>it + n</code>, <code>it[n]</code>, <code>&lt; &gt;</code></td><td><code>vector, deque, array</code></td></tr>
        </tbody>
      </table>

      <div className="callout tip">
        <div className="ttl">💡 ทำไมสำคัญ?</div>
        Algorithm บางตัวต้องการ random access — เช่น <code>sort()</code><br/>
        → ใช้ <code>sort</code> กับ <code>list</code> ไม่ได้! (ต้องใช้ <code>list::sort()</code> method แทน)
      </div>

      <h3>4. begin / end variants</h3>
      <pre className="code-block">{`v.begin(), v.end()           // forward iterators
v.rbegin(), v.rend()          // reverse — เริ่มจากท้าย
v.cbegin(), v.cend()          // const — ห้าม modify
v.crbegin(), v.crend()        // const reverse

// Iterate backwards
for (auto it = v.rbegin(); it != v.rend(); ++it) {
  cout << *it;
}`}</pre>

      <h3>5. Range-for เบื้องหลังคือ Iterator</h3>
      <pre className="code-block">{`// Range-for syntax
for (auto x : v) { ... }

// คอมไพล์เป็น (เกือบ)
for (auto it = v.begin(); it != v.end(); ++it) {
  auto x = *it;
  { ... }
}`}</pre>

      <h3>6. Iterator Arithmetic (เฉพาะ Random Access)</h3>
      <pre className="code-block">{`vector<int> v = {1, 2, 3, 4, 5};

auto it = v.begin();
it + 2;              // ชี้ v[2]
it[3];               // = *(it + 3) = v[3]
v.end() - v.begin(); // = 5 (distance)

auto mid = v.begin() + v.size() / 2;
cout << *mid;        // v[2] = 3

// ใช้กับ list / set ไม่ได้! ต้องใช้ advance / distance
list<int> l = {1, 2, 3};
auto lit = l.begin();
advance(lit, 2);              // เลื่อนไป 2 (O(n) for list)
int d = distance(l.begin(), lit);  // = 2`}</pre>

      <h3>7. Common Iterator Patterns</h3>
      <pre className="code-block">{`// Find then erase
auto it = find(v.begin(), v.end(), 3);
if (it != v.end()) v.erase(it);

// Insert at sorted position
auto pos = lower_bound(v.begin(), v.end(), x);
v.insert(pos, x);

// Pass sub-range to algorithm
sort(v.begin() + 2, v.begin() + 7);   // sort indices [2, 7)

// Reverse iterator → normal iterator (for erase)
auto rit = v.rbegin();
v.erase((rit + 1).base());           // .base() converts r → forward`}</pre>

      <h3>8. Iterator Invalidation Summary</h3>
      <table className="cmp">
        <thead><tr><th>Container</th><th>Invalidated by</th></tr></thead>
        <tbody>
          <tr><td><code>vector</code></td><td>resize, push_back ที่เต็ม cap, insert, erase (จากจุด insert ไปขวา)</td></tr>
          <tr><td><code>deque</code></td><td>insert/erase ที่ไม่ใช่ปลาย</td></tr>
          <tr><td><code>list</code></td><td>เฉพาะ iterator ที่ชี้ element ที่ถูก erase</td></tr>
          <tr><td><code>set, map</code></td><td>เฉพาะ iterator ที่ชี้ element ที่ถูก erase</td></tr>
          <tr><td><code>unordered_*</code></td><td>rehash (auto เมื่อ load factor สูง)</td></tr>
        </tbody>
      </table>

      <CS23 title="Iterator Cheat Sheet" sections={[
        { label: "Dereference", value: "<code>*it</code> — get value" },
        { label: "Advance", value: "<code>++it</code>, <code>it++</code> (next)" },
        { label: "Range", value: "<code>[begin, end)</code> — end exclusive" },
        { label: "Categories", value: "input → forward → bidirectional → random access" },
        { label: "Reverse iter", value: "<code>v.rbegin()</code>, <code>v.rend()</code>" },
        { label: "Const iter", value: "<code>v.cbegin()</code> — ห้าม modify" },
      ]} />

      <PF23 items={[
        { trap: "Dereference <code>v.end()</code>", fix: "<code>end()</code> ‘ผ่านตัวสุดท้าย’ — ห้าม <code>*end()</code>" },
        { trap: "ใช้ iterator หลัง <code>push_back</code> ที่ resize", fix: "Iterator invalidated. ใช้ index หรือ <code>reserve</code> ก่อน" },
        { trap: "<code>sort(set.begin(), set.end())</code>", fix: "Set ใช้ bidirectional iterator — sort ต้อง random access. set sorted อยู่แล้ว ไม่ต้อง sort" },
        { trap: "<code>it + 5</code> กับ list iterator", fix: "List = bidirectional, ไม่ใช่ random access. ใช้ <code>advance(it, 5)</code>" },
      ]} />

      <Quiz23 q={{
        question: "ทำไม <code>sort(s.begin(), s.end())</code> ใช้ไม่ได้กับ <code>set</code>?",
        options: [
          "Set ไม่มี iterator",
          "Set ใช้ bidirectional iterator แต่ sort ต้องการ random access",
          "Set ห้าม modify",
          "ผิด — ใช้ได้"
        ],
        answer: 1,
        explain: "Sort needs random access (<code>it1 - it2</code>, <code>it + n</code>). Set's iterator = bidirectional → compile error. นอกจากนี้ set sorted อยู่แล้ว"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   stl-pair-tuple — pair, tuple, structured bindings
============================================================ */
Lessons23["stl-pair-tuple"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 pair & tuple — Group ค่าหลายตัวเป็น value เดียว</div>
        ใช้บ่อยมากใน algorithm — สำหรับ <code>map</code> entry, edge with weight, coordinate, multi-return
      </div>

      <h3>1. <code>pair</code> — 2 ค่า</h3>
      <pre className="code-block">{`#include <utility>

pair<int, string> p;
p.first = 1;
p.second = "hello";

// Initialize
pair<int, string> p1 = {1, "hi"};
pair<int, string> p2 = make_pair(2, "bye");
auto p3 = make_pair(3, "ok");          // auto deduce

// Access
cout << p1.first << " " << p1.second;

// Compare — lex order
pair<int, int> a = {1, 5}, b = {1, 3};
a > b      // true (1==1, 5>3)
a == b     // false`}</pre>

      <h3>2. Pair ใน Real Code</h3>
      <pre className="code-block">{`// Graph edge with weight
vector<pair<int, int>> adj[N];   // adj[u] = list of (neighbor, weight)
adj[u].push_back({v, w});

// Dijkstra priority queue
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
pq.push({dist, node});
auto [d, u] = pq.top(); pq.pop();    // structured binding!

// 2D coordinate
pair<int, int> point = {x, y};

// Map iteration
map<string, int> ages;
for (auto& [name, age] : ages) {     // structured binding
  cout << name << ": " << age << "\\n";
}`}</pre>

      <h3>3. <code>tuple</code> — 3+ ค่า</h3>
      <pre className="code-block">{`#include <tuple>

tuple<int, string, double> t = {1, "Alice", 3.14};
tuple<int, string, double> t2 = make_tuple(2, "Bob", 2.71);

// Access — get<index>(tuple)
cout << get<0>(t);        // 1
cout << get<1>(t);        // "Alice"
cout << get<2>(t);        // 3.14

// Modify
get<0>(t) = 100;`}</pre>

      <h3>4. Structured Bindings (C++17) — Magic syntax</h3>
      <pre className="code-block">{`pair<int, int> p = {3, 4};
auto [x, y] = p;             // x = 3, y = 4

tuple<int, string, double> t = {1, "Alice", 3.14};
auto [id, name, score] = t;  // unpack tuple

// ทำงานกับ struct ก็ได้!
struct Point { int x, y; };
Point pt{1, 2};
auto [px, py] = pt;          // px = 1, py = 2

// ทำงานกับ array
int arr[3] = {1, 2, 3};
auto [a, b, c] = arr;`}</pre>

      <h3>5. Multiple Return Values</h3>
      <pre className="code-block">{`// Return pair / tuple
pair<int, int> minMax(vector<int>& v) {
  int mn = *min_element(v.begin(), v.end());
  int mx = *max_element(v.begin(), v.end());
  return {mn, mx};
}

// Usage with structured binding
auto [mn, mx] = minMax(v);
cout << "min=" << mn << " max=" << mx;

// tuple for 3+ returns
tuple<int, int, double> stats(vector<int>& v) {
  int n = v.size();
  int sum = accumulate(v.begin(), v.end(), 0);
  double avg = (double)sum / n;
  return {n, sum, avg};
}

auto [count, total, mean] = stats(v);`}</pre>

      <h3>6. Sort by pair / tuple component</h3>
      <pre className="code-block">{`vector<pair<int, int>> v = {{3, 1}, {1, 2}, {2, 5}};

// Default sort — by first, tie-break by second
sort(v.begin(), v.end());
// [{1,2}, {2,5}, {3,1}]

// Sort by second
sort(v.begin(), v.end(), [](auto& a, auto& b) {
  return a.second < b.second;
});
// [{3,1}, {1,2}, {2,5}]

// Sort by first descending, second ascending
sort(v.begin(), v.end(), [](auto& a, auto& b) {
  if (a.first != b.first) return a.first > b.first;
  return a.second < b.second;
});`}</pre>

      <h3>7. <code>tie</code> — Old-school unpacking (pre-C++17)</h3>
      <pre className="code-block">{`pair<int, string> p = {1, "hi"};

int n; string s;
tie(n, s) = p;       // n = 1, s = "hi"

// ignore some values
tuple<int, int, int> t = {1, 2, 3};
int a, c;
tie(a, ignore, c) = t;   // a = 1, c = 3 (skip middle)

// C++17 — ใช้ structured bindings สวยกว่า
auto [x, y, z] = t;`}</pre>

      <CS23 title="pair / tuple Cheat Sheet" sections={[
        { label: "Create", value: "<code>{x, y}</code> หรือ <code>make_pair(x, y)</code>" },
        { label: "Access", value: "<code>p.first</code>, <code>get&lt;0&gt;(t)</code>" },
        { label: "Unpack (C++17)", value: "<code>auto [x, y] = p;</code>" },
        { label: "Sort", value: "Lex order by default (first → second)" },
        { label: "Use", value: "Map entry, edge+weight, multi-return, coordinate" },
      ]} />

      <Quiz23 q={{
        question: "<code>auto [x, y] = make_pair(1, 2);</code> ทำอะไร?",
        options: [
          "Error — ใช้กับ pair ไม่ได้",
          "x = pair, y = ignore",
          "x = 1, y = 2 (structured binding)",
          "x = make_pair, y = empty"
        ],
        answer: 2,
        explain: "Structured binding (C++17) แยก pair เป็น 2 ตัวแปร — สั้นและสวยกว่า <code>tie</code>"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   Shared Viz — Stack/Queue/Deque (3-mode push/pop)
============================================================ */
function StackQueueDequeViz() {
  const [mode, setMode] = useS23('stack');
  const [items, setItems] = useS23([10, 20, 30]);
  const [val, setVal] = useS23(40);
  const [lastOp, setLastOp] = useS23('');
  const [flash, setFlash] = useS23(-1);

  const reset = () => { setItems([10, 20, 30]); setLastOp(''); setFlash(-1); };
  const flashAt = (i) => { setFlash(i); setTimeout(() => setFlash(-1), 700); };

  const ops = {
    stack: {
      push: () => { setItems(s => [...s, val]); setLastOp(`push(${val}) → top`); flashAt(items.length); setVal(Math.floor(Math.random() * 90) + 10); },
      pop: () => { if (!items.length) return; setLastOp(`pop() = ${items[items.length - 1]}`); setItems(s => s.slice(0, -1)); },
      buttons: [['push (top)', 'push'], ['pop (top)', 'pop']],
      highlight: items.length - 1,
      label: 'TOP'
    },
    queue: {
      push: () => { setItems(s => [...s, val]); setLastOp(`push(${val}) → back`); flashAt(items.length); setVal(Math.floor(Math.random() * 90) + 10); },
      pop: () => { if (!items.length) return; setLastOp(`pop() = ${items[0]} (front)`); setItems(s => s.slice(1)); },
      buttons: [['push (back)', 'push'], ['pop (front)', 'pop']],
      highlight: 0,
      label: 'FRONT'
    },
    deque: {
      push_back: () => { setItems(s => [...s, val]); setLastOp(`push_back(${val})`); flashAt(items.length); setVal(Math.floor(Math.random() * 90) + 10); },
      push_front: () => { setItems(s => [val, ...s]); setLastOp(`push_front(${val})`); flashAt(0); setVal(Math.floor(Math.random() * 90) + 10); },
      pop_back: () => { if (!items.length) return; setLastOp(`pop_back() = ${items[items.length - 1]}`); setItems(s => s.slice(0, -1)); },
      pop_front: () => { if (!items.length) return; setLastOp(`pop_front() = ${items[0]}`); setItems(s => s.slice(1)); },
      buttons: [['push_front', 'push_front'], ['push_back', 'push_back'], ['pop_front', 'pop_front'], ['pop_back', 'pop_back']],
      label: 'BOTH'
    }
  };
  const m = ops[mode];

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {['stack', 'queue', 'deque'].map(k => (
          <button key={k} onClick={() => { setMode(k); reset(); }}
            style={{
              background: mode === k ? 'var(--accent)' : 'var(--bg-3)',
              color: mode === k ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: mode === k ? 700 : 400
            }}>{k.toUpperCase()}</button>
        ))}
      </div>

      <div className="ctrls" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 12 }}>val: <input type="number" value={val} onChange={e => setVal(+e.target.value || 0)} style={{ width: 60, padding: '2px 6px' }} /></label>
        {m.buttons.map(([label, fn]) => (
          <button key={fn} onClick={() => m[fn]()}
            style={{ background: fn.startsWith('push') ? 'var(--accent-2)' : '#f87171', color: '#000', fontWeight: 600 }}>
            {label}
          </button>
        ))}
        <button onClick={reset}>↺ Reset</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 14, background: 'var(--bg-1)', borderRadius: 6, minHeight: 80, overflowX: 'auto' }}>
        {mode === 'queue' && <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, marginRight: 4 }}>FRONT→</span>}
        {items.length === 0 ? (
          <span style={{ color: 'var(--text-3)', fontStyle: 'italic', fontSize: 12 }}>(empty)</span>
        ) : items.map((v, i) => {
          const isHi = mode === 'stack' && i === items.length - 1 ||
                       mode === 'queue' && i === 0 ||
                       flash === i;
          return (
            <div key={i} style={{
              minWidth: 44, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: flash === i ? '#fbbf24' : (isHi ? 'rgba(94,234,212,0.3)' : 'var(--bg-3)'),
              border: '1px solid ' + (isHi ? 'var(--accent-2)' : 'var(--border)'),
              borderRadius: 4, fontFamily: 'monospace', fontSize: 14, fontWeight: 600,
              color: flash === i ? '#000' : 'var(--text-0)',
              transition: 'all 0.25s'
            }}>{v}</div>
          );
        })}
        {mode === 'stack' && items.length > 0 && <span style={{ color: 'var(--accent-2)', fontSize: 11, fontWeight: 700, marginLeft: 8 }}>← TOP</span>}
        {mode === 'queue' && items.length > 0 && <span style={{ color: 'var(--text-2)', fontSize: 11, marginLeft: 4 }}>←BACK</span>}
      </div>

      {lastOp && (
        <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12, color: 'var(--accent-2)' }}>
          ► {lastOp}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 {mode === 'stack' && 'LIFO — เข้า/ออกทาง top เท่านั้น'}
        {mode === 'queue' && 'FIFO — เข้าทาง back, ออกทาง front'}
        {mode === 'deque' && 'Double-ended — เข้า/ออกได้ทั้ง 2 ปลาย'}
      </div>
    </div>
  );
}

/* ============================================================
   stl-stack-queue — std::stack & std::queue
============================================================ */
Lessons23["stl-stack-queue"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 std::stack & std::queue — adapter containers</div>
        ทั้งสองเป็น <b>adapter</b> ที่ wrap container อื่น (default = <code>deque</code>)<br/>
        Interface จำกัด → ใช้ง่าย ป้องกัน misuse
      </div>

      <h3>1. <code>std::stack</code> — LIFO</h3>
      <pre className="code-block">{`#include <stack>

stack<int> s;

s.push(10);
s.push(20);
s.push(30);
// Stack: [10, 20, 30]  ← top

cout << s.top();         // 30 (peek)
s.pop();                 // remove 30 (return void!)
cout << s.top();         // 20
cout << s.size();        // 2
cout << s.empty();       // false`}</pre>

      <h3>🎬 Interactive — กดดู Stack/Queue/Deque ทำงานต่างกันยังไง</h3>
      <StackQueueDequeViz />

      <div className="callout warn">
        <div className="ttl">⚠ pop() ไม่ return value!</div>
        <code>s.pop()</code> แค่ลบ — ถ้าจะใช้ค่าต้อง <code>s.top()</code> ก่อน<br/>
        Pattern: <code>auto x = s.top(); s.pop();</code>
      </div>

      <h3>2. Stack Use Cases</h3>
      <pre className="code-block">{`// 1. Reverse — push ทั้งหมดแล้ว pop
string s = "hello";
stack<char> st;
for (char c : s) st.push(c);
string rev;
while (!st.empty()) { rev += st.top(); st.pop(); }
// rev = "olleh"

// 2. Balanced Parentheses
bool isBalanced(string s) {
  stack<char> st;
  for (char c : s) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
      if (st.empty()) return false;
      char open = st.top(); st.pop();
      if ((c == ')' && open != '(') ||
          (c == ']' && open != '[') ||
          (c == '}' && open != '{')) return false;
    }
  }
  return st.empty();
}

// 3. DFS iterative
stack<int> st;
st.push(start);
while (!st.empty()) {
  int u = st.top(); st.pop();
  if (visited[u]) continue;
  visited[u] = true;
  for (int v : adj[u]) st.push(v);
}`}</pre>

      <h3>3. <code>std::queue</code> — FIFO</h3>
      <pre className="code-block">{`#include <queue>

queue<int> q;

q.push(10);              // enqueue (back)
q.push(20);
q.push(30);
// Queue: front → [10, 20, 30] ← back

cout << q.front();       // 10 (peek front)
cout << q.back();        // 30 (peek back)
q.pop();                 // remove 10 (front)
cout << q.front();       // 20
cout << q.size();        // 2`}</pre>

      <h3>4. Queue Use Cases</h3>
      <pre className="code-block">{`// 1. BFS — most common!
queue<int> q;
q.push(start);
visited[start] = true;
while (!q.empty()) {
  int u = q.front(); q.pop();
  for (int v : adj[u]) {
    if (!visited[v]) {
      visited[v] = true;
      q.push(v);
    }
  }
}

// 2. Level-order traversal of tree
queue<Node*> q;
q.push(root);
while (!q.empty()) {
  int sz = q.size();
  for (int i = 0; i < sz; i++) {  // ทำทั้ง level
    Node* node = q.front(); q.pop();
    cout << node->val;
    if (node->left) q.push(node->left);
    if (node->right) q.push(node->right);
  }
  cout << "\\n";   // newline per level
}

// 3. Sliding window (with monotonic deque - บทถัดไป)`}</pre>

      <h3>5. ทำไมไม่มี iterator?</h3>
      <p>
        <code>stack</code>/<code>queue</code> เป็น <b>adapter</b> ที่ตั้งใจ <b>จำกัด interface</b>:
      </p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Stack: เข้า/ออก top เท่านั้น</li>
        <li>Queue: เข้า back, ออก front เท่านั้น</li>
        <li>ไม่มี iterator, ไม่มี <code>[i]</code> — เพราะไม่ใช่ purpose</li>
        <li>ถ้าต้อง iterate → ใช้ <code>deque</code> โดยตรง</li>
      </ul>

      <h3>6. Stack vs Queue เทียบกัน</h3>
      <table className="cmp">
        <thead><tr><th></th><th>stack</th><th>queue</th></tr></thead>
        <tbody>
          <tr><td>Pattern</td><td>LIFO — Last In, First Out</td><td>FIFO — First In, First Out</td></tr>
          <tr><td>Insert</td><td><code>push()</code> top</td><td><code>push()</code> back</td></tr>
          <tr><td>Remove</td><td><code>pop()</code> top</td><td><code>pop()</code> front</td></tr>
          <tr><td>Peek</td><td><code>top()</code></td><td><code>front()</code> / <code>back()</code></td></tr>
          <tr><td>Use</td><td>DFS, parser, undo, recursion sim</td><td>BFS, scheduling, level-order</td></tr>
          <tr><td>Underlying</td><td><code>deque</code> default</td><td><code>deque</code> default</td></tr>
        </tbody>
      </table>

      <CS23 title="stack / queue Cheat Sheet" sections={[
        { label: "stack ops", value: "<code>push, pop, top, empty, size</code>" },
        { label: "queue ops", value: "<code>push, pop, front, back, empty, size</code>" },
        { label: "Pattern", value: "Always check <code>!empty()</code> ก่อน <code>top/front/pop</code>" },
        { label: "pop() void", value: "ใช้ <code>auto x = s.top(); s.pop();</code>" },
      ]} />

      <PF23 items={[
        { trap: "<code>s.pop()</code> แล้วใช้ค่า return — แต่มัน void!", fix: "ดึงค่าก่อน: <code>auto x = s.top(); s.pop();</code>" },
        { trap: "<code>s.top()</code> เมื่อ stack ว่าง → undefined", fix: "เช็ค <code>!s.empty()</code> ก่อนเสมอ" },
        { trap: "ต้องการ iterate stack/queue → หาไม่เจอ", fix: "ใช้ <code>deque</code> โดยตรง (เพราะ stack/queue ห่อ deque)" },
      ]} />

      <Quiz23 q={{
        question: "<code>stack&lt;int&gt; s; s.push(1); s.push(2); s.push(3); s.pop(); cout &lt;&lt; s.top();</code> output?",
        options: ["1", "2", "3", "Undefined"],
        answer: 1,
        explain: "Push 1, 2, 3 → stack [1, 2, 3] (top=3). Pop → [1, 2] (top=2). Print 2"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   stl-deque — Double-ended queue
============================================================ */
Lessons23["stl-deque"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 std::deque — Double-Ended Queue</div>
        Container ที่ <b>insert/remove ได้ทั้ง 2 ปลาย</b> ใน O(1) + access by index ได้
      </div>

      <h3>1. Deque vs Vector vs List</h3>
      <table className="cmp">
        <thead><tr><th>Op</th><th>vector</th><th>deque</th><th>list</th></tr></thead>
        <tbody>
          <tr><td>push_back</td><td className="mono">O(1) amortized</td><td className="mono">O(1) amortized</td><td className="mono">O(1)</td></tr>
          <tr><td>push_front</td><td className="mono">O(n)</td><td className="mono">O(1)</td><td className="mono">O(1)</td></tr>
          <tr><td>v[i]</td><td className="mono">O(1)</td><td className="mono">O(1)</td><td className="mono">O(n)</td></tr>
          <tr><td>insert middle</td><td className="mono">O(n)</td><td className="mono">O(n)</td><td className="mono">O(1) with iter</td></tr>
          <tr><td>Memory layout</td><td>Contiguous</td><td>Chunks (non-contig)</td><td>Linked nodes</td></tr>
        </tbody>
      </table>

      <h3>2. การใช้งาน</h3>
      <pre className="code-block">{`#include <deque>

deque<int> dq;

// Both ends operations
dq.push_back(10);          // [10]
dq.push_front(5);          // [5, 10]
dq.push_back(20);          // [5, 10, 20]
dq.push_front(1);          // [1, 5, 10, 20]

dq.pop_front();            // [5, 10, 20]
dq.pop_back();             // [5, 10]

// Access by index (เหมือน vector)
cout << dq[0];             // 5
cout << dq[1];             // 10

// Iterate
for (int x : dq) cout << x << " ";`}</pre>

      <h3>3. Use Cases</h3>
      <pre className="code-block">{`// 1. Sliding window maximum — Monotonic Deque
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
  deque<int> dq;            // เก็บ index, monotonic decreasing
  vector<int> result;
  for (int i = 0; i < nums.size(); i++) {
    // Remove out-of-window
    while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
    // Maintain monotonic decreasing
    while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) result.push_back(nums[dq.front()]);
  }
  return result;
}

// 2. Palindrome check (เปรียบเทียบทั้ง 2 ปลาย)
bool isPalin(string s) {
  deque<char> dq(s.begin(), s.end());
  while (dq.size() > 1) {
    if (dq.front() != dq.back()) return false;
    dq.pop_front();
    dq.pop_back();
  }
  return true;
}

// 3. BFS แบบ 0-1 BFS (edges weight 0 หรือ 1)
//   ใช้ deque แทน priority_queue — O(V+E) แทน O((V+E) log V)
deque<int> dq;
dq.push_front(start);
while (!dq.empty()) {
  int u = dq.front(); dq.pop_front();
  // ถ้า edge weight = 0: push_front
  // ถ้า edge weight = 1: push_back
}`}</pre>

      <h3>4. Internal Structure</h3>
      <p>
        Deque <b>ไม่ใช่ contiguous memory</b> เหมือน vector — เก็บเป็น <b>chunks of arrays</b><br/>
        → access index = 2 indirections (chunk → element) → ช้ากว่า vector เล็กน้อย<br/>
        แต่ <b>push_front O(1)</b> โดยไม่ต้อง shift element (เพราะมี chunk เปล่าด้านซ้าย)
      </p>

      <h3>5. เมื่อใช้ deque vs vector vs list?</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <b style={{ color: 'var(--accent)' }}>ใช้ vector เมื่อ:</b> sequential add/remove ที่ปลาย, ต้อง cache locality สูง, ต้อง pass to C API<br/><br/>
        <b style={{ color: 'var(--accent-2)' }}>ใช้ deque เมื่อ:</b> ต้อง push_front + access index, sliding window, queue-like operations<br/><br/>
        <b style={{ color: 'var(--accent-3)' }}>ใช้ list เมื่อ:</b> insert/erase ตรงกลาง <b>บ่อย</b> และมี iterator แล้ว (rare in practice)
      </div>

      <CS23 title="Deque Cheat Sheet" sections={[
        { label: "Both ends ops", value: "<code>push_front/back, pop_front/back</code>" },
        { label: "Random access", value: "<code>dq[i]</code> O(1)" },
        { label: "Use", value: "Sliding window, 0-1 BFS, palindrome" },
        { label: "vs vector", value: "ช้ากว่าเล็กน้อย (cache) แต่ push_front O(1)" },
      ]} />

      <Quiz23 q={{
        question: "ทำไมใช้ <code>deque</code> ใน Sliding Window Maximum ไม่ใช่ <code>vector</code>?",
        options: [
          "Deque เก็บ data ใน sorted order",
          "ต้อง pop_front + pop_back บ่อย — vector pop_front = O(n)",
          "Vector ไม่มี iterator",
          "Deque หา max ได้ O(1)"
        ],
        answer: 1,
        explain: "Sliding window ต้อง remove element ที่ออกจาก window (front) + maintain monotonic ที่ back → ต้อง O(1) ทั้งคู่ → deque"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   Shared Viz — Binary Heap Tree (max-heap)
============================================================ */
function HeapTreeViz() {
  const [heap, setHeap] = useS23([50, 30, 40, 10, 20, 35]);
  const [val, setVal] = useS23(45);
  const [lastOp, setLastOp] = useS23('');
  const [flash, setFlash] = useS23([]);

  const push = () => {
    const h = [...heap, val];
    const trace = [h.length - 1];
    let i = h.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (h[p] < h[i]) { [h[p], h[i]] = [h[i], h[p]]; trace.push(p); i = p; }
      else break;
    }
    setHeap(h);
    setFlash(trace);
    setLastOp(`push(${val}) → bubble up ${trace.length} step${trace.length > 1 ? 's' : ''}`);
    setVal(Math.floor(Math.random() * 100));
    setTimeout(() => setFlash([]), 1200);
  };

  const pop = () => {
    if (heap.length === 0) return;
    const popped = heap[0];
    const h = [...heap];
    h[0] = h[h.length - 1];
    h.pop();
    const trace = [0];
    let i = 0;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let max = i;
      if (l < h.length && h[l] > h[max]) max = l;
      if (r < h.length && h[r] > h[max]) max = r;
      if (max === i) break;
      [h[i], h[max]] = [h[max], h[i]];
      trace.push(max);
      i = max;
    }
    setHeap(h);
    setFlash(trace);
    setLastOp(`pop() → got ${popped}, sift down ${trace.length - 1} step${trace.length > 2 ? 's' : ''}`);
    setTimeout(() => setFlash([]), 1200);
  };

  const reset = () => { setHeap([50, 30, 40, 10, 20, 35]); setLastOp(''); setFlash([]); };

  // Compute tree layout
  const n = heap.length;
  const levels = Math.ceil(Math.log2(n + 1));
  const nodePositions = heap.map((v, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const nodesAtLevel = Math.pow(2, level);
    const x = ((posInLevel + 0.5) / nodesAtLevel) * 460 + 10;
    const y = 40 + level * 60;
    return { x, y, val: v, idx: i };
  });

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12 }}>value: <input type="number" value={val} onChange={e => setVal(+e.target.value || 0)} style={{ width: 60, padding: '2px 6px' }} /></label>
        <button onClick={push} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>push</button>
        <button onClick={pop} disabled={heap.length === 0} style={{ background: '#f87171', color: '#000', fontWeight: 600 }}>pop (max)</button>
        <button onClick={reset}>↺ Reset</button>
      </div>

      <svg width="100%" viewBox="0 0 480 280" style={{ background: 'var(--bg-1)', borderRadius: 6 }}>
        {/* Edges */}
        {nodePositions.map((node, i) => {
          if (i === 0) return null;
          const parent = nodePositions[Math.floor((i - 1) / 2)];
          return <line key={'e' + i} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} stroke="var(--border)" strokeWidth={1.5} />;
        })}
        {/* Nodes */}
        {nodePositions.map(node => {
          const isFlash = flash.includes(node.idx);
          return (
            <g key={'n' + node.idx}>
              <circle cx={node.x} cy={node.y} r={18}
                fill={isFlash ? '#fbbf24' : (node.idx === 0 ? 'rgba(94,234,212,0.3)' : 'var(--bg-3)')}
                stroke={isFlash ? '#fbbf24' : 'var(--accent-2)'} strokeWidth={isFlash ? 3 : 2} />
              <text x={node.x} y={node.y + 5} fill={isFlash ? '#000' : 'var(--text-0)'} fontSize="13" fontWeight="700" textAnchor="middle">{node.val}</text>
              <text x={node.x} y={node.y + 32} fill="var(--text-3)" fontSize="9" textAnchor="middle">[{node.idx}]</text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-1)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
        <div><b>Array view:</b> [{heap.join(', ')}]</div>
        {lastOp && <div style={{ color: 'var(--accent-2)', marginTop: 4 }}>► {lastOp}</div>}
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 Heap = complete binary tree เก็บใน array → parent ที่ <code>i</code> มี children ที่ <code>2i+1</code>, <code>2i+2</code>. Root = max
      </div>
    </div>
  );
}

/* ============================================================
   stl-priority-queue — Heap-based priority queue
============================================================ */
Lessons23["stl-priority-queue"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 std::priority_queue — Heap (default Max-Heap)</div>
        Container ที่ <b>top() = max</b> เสมอ (default) — push/pop O(log n), top O(1)<br/>
        ใช้บ่อยใน Dijkstra, Top-K, scheduler, A*
      </div>

      <h3>🎬 Interactive — Heap tree (push bubble up / pop sift down)</h3>
      <HeapTreeViz />

      <h3>1. Default: Max-Heap</h3>
      <pre className="code-block">{`#include <queue>

priority_queue<int> pq;

pq.push(3);
pq.push(7);
pq.push(1);
pq.push(5);

cout << pq.top();    // 7 (max)
pq.pop();
cout << pq.top();    // 5
pq.pop();
cout << pq.top();    // 3`}</pre>

      <h3>2. Min-Heap — 3 วิธี</h3>
      <pre className="code-block">{`// วิธี 1: ใช้ greater<>
priority_queue<int, vector<int>, greater<int>> pq;
pq.push(3); pq.push(7); pq.push(1);
cout << pq.top();    // 1 (min)

// วิธี 2: negate values
priority_queue<int> pq2;
pq2.push(-3); pq2.push(-7); pq2.push(-1);
cout << -pq2.top();  // 1 (negate back)

// วิธี 3 (C++17): greater<> (no type needed)
priority_queue<int, vector<int>, greater<>> pq3;`}</pre>

      <h3>3. Priority Queue ของ pair (Dijkstra)</h3>
      <pre className="code-block">{`// Min-heap of (distance, node)
priority_queue<
  pair<int, int>,
  vector<pair<int, int>>,
  greater<>
> pq;

pq.push({0, start});

while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;       // outdated entry
  for (auto& [v, w] : adj[u]) {
    if (dist[u] + w < dist[v]) {
      dist[v] = dist[u] + w;
      pq.push({dist[v], v});
    }
  }
}`}</pre>

      <h3>4. Custom Comparator (Lambda)</h3>
      <pre className="code-block">{`// Sort by string length, ties broken by alphabetical
auto cmp = [](const string& a, const string& b) {
  if (a.size() != b.size()) return a.size() > b.size();
  return a > b;
};

priority_queue<string, vector<string>, decltype(cmp)> pq(cmp);
// ⚠ ต้องส่ง cmp ให้ constructor

pq.push("apple");
pq.push("kiwi");
pq.push("orange");
// top = shortest, then alphabetically smallest`}</pre>

      <h3>5. Top-K Problems</h3>
      <pre className="code-block">{`// Top K largest in array
vector<int> topK(vector<int>& nums, int k) {
  priority_queue<int, vector<int>, greater<>> pq;  // min-heap of size k

  for (int x : nums) {
    pq.push(x);
    if (pq.size() > k) pq.pop();   // remove smallest
  }

  vector<int> result;
  while (!pq.empty()) {
    result.push_back(pq.top());
    pq.pop();
  }
  return result;
}
// Time: O(n log k), Space: O(k)`}</pre>

      <h3>6. Merge K Sorted Lists</h3>
      <pre className="code-block">{`// Merge k sorted vectors into 1 sorted vector
vector<int> mergeK(vector<vector<int>>& lists) {
  // (value, list_idx, element_idx)
  priority_queue<
    tuple<int, int, int>,
    vector<tuple<int, int, int>>,
    greater<>
  > pq;

  for (int i = 0; i < lists.size(); i++) {
    if (!lists[i].empty()) pq.push({lists[i][0], i, 0});
  }

  vector<int> result;
  while (!pq.empty()) {
    auto [val, li, ei] = pq.top(); pq.pop();
    result.push_back(val);
    if (ei + 1 < lists[li].size()) {
      pq.push({lists[li][ei + 1], li, ei + 1});
    }
  }
  return result;
}
// Time: O(N log k), N = total elements`}</pre>

      <h3>7. Internal — Binary Heap</h3>
      <p>
        Priority queue ใช้ <b>binary heap</b> เก็บใน array<br/>
        Parent ที่ index <code>i</code> → children ที่ <code>2i+1</code>, <code>2i+2</code>
      </p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><code>push</code>: append + bubble up → O(log n)</li>
        <li><code>pop</code>: swap top/last, remove last, sift down → O(log n)</li>
        <li><code>top</code>: array[0] → O(1)</li>
      </ul>

      <CS23 title="priority_queue Cheat Sheet" sections={[
        { label: "Default", value: "Max-heap — <code>priority_queue&lt;T&gt;</code>" },
        { label: "Min-heap", value: "<code>priority_queue&lt;T, vector&lt;T&gt;, greater&lt;&gt;&gt;</code>" },
        { label: "Ops", value: "<code>push/pop O(log n), top O(1)</code>" },
        { label: "Use", value: "Dijkstra, Top-K, merge sorted, A*" },
        { label: "Custom comp", value: "Pass comparator to constructor" },
      ]} />

      <PF23 items={[
        { trap: "Default คือ max-heap แต่นึกว่าเป็น min", fix: "ตรวจ! Default <code>priority_queue&lt;int&gt;</code> = max" },
        { trap: "Custom comparator declared ผิด", fix: "ต้องเขียน comparator return <code>true</code> เมื่อ a ‘ควรอยู่ล่างกว่า’ b (ตรงข้ามกับ sort!)" },
        { trap: "ลืม update-decrease key — push ซ้ำ", fix: "Standard pattern: check <code>if (d &gt; dist[u]) continue;</code> ใน Dijkstra" },
      ]} />

      <Quiz23 q={{
        question: "<code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;&gt;&gt; pq;</code> หลัง push 5, 2, 8 — top()?",
        options: ["8", "5", "2", "Undefined"],
        answer: 2,
        explain: "<code>greater&lt;&gt;</code> → min-heap → top = smallest = 2"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart23 = Lessons23;
