/* Lessons Part 24 — STL Set/Map, Unordered, Algorithms, Lambda, Bitset */

const { useState: useS24 } = React;
const { Quiz: Quiz24 } = window.LessonComponents;
const { WorkedExample: WE24, CheatSheet: CS24, Pitfalls: PF24 } = window.LearningKit;

const Lessons24 = {};

/* ============================================================
   Shared Viz — BST Insertion (visualize set/map ordered tree)
============================================================ */
function BSTInsertViz() {
  const [tree, setTree] = useS24(null);
  const [val, setVal] = useS24(50);
  const [path, setPath] = useS24([]);
  const [info, setInfo] = useS24('');

  const insert = () => {
    const newTree = tree ? JSON.parse(JSON.stringify(tree)) : null;
    const p = [];
    if (!newTree) {
      setTree({ val, l: null, r: null });
      setPath([val]);
      setInfo(`Tree ว่าง → val ${val} เป็น root`);
      return;
    }
    let node = newTree;
    while (true) {
      p.push(node.val);
      if (val === node.val) { setInfo(`val ${val} มีอยู่แล้ว — set ไม่เก็บ duplicate`); setPath(p); return; }
      if (val < node.val) {
        if (!node.l) { node.l = { val, l: null, r: null }; break; }
        node = node.l;
      } else {
        if (!node.r) { node.r = { val, l: null, r: null }; break; }
        node = node.r;
      }
    }
    p.push(val);
    setTree(newTree);
    setPath(p);
    setInfo(`insert(${val}) → เดิน ${p.length - 1} step (${p.slice(0, -1).join(' → ')})`);
    setVal(Math.floor(Math.random() * 100));
  };

  const remove = () => {
    if (!tree) return;
    const removeNode = (node, x) => {
      if (!node) return null;
      if (x < node.val) { node.l = removeNode(node.l, x); return node; }
      if (x > node.val) { node.r = removeNode(node.r, x); return node; }
      if (!node.l) return node.r;
      if (!node.r) return node.l;
      // Find min in right subtree
      let min = node.r;
      while (min.l) min = min.l;
      node.val = min.val;
      node.r = removeNode(node.r, min.val);
      return node;
    };
    const t = JSON.parse(JSON.stringify(tree));
    setTree(removeNode(t, val));
    setInfo(`erase(${val})`);
    setPath([]);
  };

  const reset = () => {
    // build sample tree
    let t = null;
    [50, 30, 70, 20, 40, 60, 80, 10, 35].forEach(v => {
      const ins = (node, x) => {
        if (!node) return { val: x, l: null, r: null };
        if (x < node.val) node.l = ins(node.l, x);
        else if (x > node.val) node.r = ins(node.r, x);
        return node;
      };
      t = ins(t, v);
    });
    setTree(t); setPath([]); setInfo('Reset tree');
  };

  // Compute positions via in-order traversal
  const computePositions = (node, depth = 0, posRef = { p: 0 }) => {
    if (!node) return [];
    const left = computePositions(node.l, depth + 1, posRef);
    const x = posRef.p++ * 45 + 25;
    const y = 30 + depth * 50;
    const right = computePositions(node.r, depth + 1, posRef);
    return [...left, { val: node.val, x, y, depth }, ...right];
  };
  const positions = computePositions(tree);
  const posMap = Object.fromEntries(positions.map(p => [p.val, p]));

  // Compute edges
  const edges = [];
  const collectEdges = (node) => {
    if (!node) return;
    if (node.l) { edges.push([node.val, node.l.val]); collectEdges(node.l); }
    if (node.r) { edges.push([node.val, node.r.val]); collectEdges(node.r); }
  };
  collectEdges(tree);

  const width = Math.max(360, positions.length * 45 + 50);

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12 }}>val: <input type="number" value={val} onChange={e => setVal(+e.target.value || 0)} style={{ width: 60, padding: '2px 6px' }} /></label>
        <button onClick={insert} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>insert</button>
        <button onClick={remove} style={{ background: '#f87171', color: '#000', fontWeight: 600 }}>erase</button>
        <button onClick={reset}>↺ Sample Tree</button>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--bg-1)', borderRadius: 6, padding: 4 }}>
        <svg width={width} viewBox={`0 0 ${width} 280`}>
          {edges.map(([u, v], i) => {
            const pu = posMap[u], pv = posMap[v];
            if (!pu || !pv) return null;
            return <line key={i} x1={pu.x} y1={pu.y} x2={pv.x} y2={pv.y} stroke="var(--border)" strokeWidth={1.5} />;
          })}
          {positions.map(p => {
            const onPath = path.includes(p.val);
            const isNew = path.length > 0 && p.val === path[path.length - 1];
            return (
              <g key={p.val}>
                <circle cx={p.x} cy={p.y} r={16}
                  fill={isNew ? '#10b981' : (onPath ? '#fbbf24' : 'var(--bg-3)')}
                  stroke={onPath ? '#fbbf24' : 'var(--accent-2)'} strokeWidth={2} />
                <text x={p.x} y={p.y + 4} fill={onPath ? '#000' : 'var(--text-0)'} fontSize="12" fontWeight="700" textAnchor="middle">{p.val}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {info && (
        <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-1)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontSize: 12, color: 'var(--accent-2)' }}>
          ► {info}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <code>std::set</code> ใช้ Red-Black Tree (balanced BST) → insert/find/erase = O(log n) — เดินตามกฎ: <b>เล็กไปซ้าย, ใหญ่ไปขวา</b>
      </div>
    </div>
  );
}

/* ============================================================
   stl-set-map — Ordered set & map (RB-tree)
============================================================ */
Lessons24["stl-set-map"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 set & map — Sorted Containers (Red-Black Tree)</div>
        เก็บ element <b>เรียงตลอด</b> + O(log n) operations<br/>
        ใช้เมื่อ: ต้อง iterate sorted, range query, หา just-greater/less
      </div>

      <h3>🎬 Interactive — ดู insert ใน BST (set ภายในก็ทำงานแบบนี้)</h3>
      <BSTInsertViz />

      <h3>1. <code>std::set</code> — Unique Sorted Set</h3>
      <pre className="code-block">{`#include <set>

set<int> s;

s.insert(3);
s.insert(1);
s.insert(4);
s.insert(1);              // duplicate — ignored

// Sorted automatically: {1, 3, 4}

// Check existence
if (s.count(3)) cout << "found";       // O(log n)
if (s.find(3) != s.end()) cout << "y"; // O(log n)

// Remove
s.erase(3);               // by value
s.erase(s.begin());       // by iterator

// Iterate (sorted order)
for (int x : s) cout << x;     // 1 4

// Size
s.size(), s.empty();

// First / last
cout << *s.begin();       // smallest
cout << *s.rbegin();      // largest
// (set ไม่มี front()/back() — ใช้ iterator)`}</pre>

      <h3>2. <code>std::multiset</code> — Allow Duplicates</h3>
      <pre className="code-block">{`multiset<int> ms;
ms.insert(3); ms.insert(1); ms.insert(3);
// {1, 3, 3}

ms.count(3);              // 2

// ⚠ erase(value) ลบ ทุก occurrence
ms.erase(3);              // {1}

// ลบแค่ 1 ตัว → ใช้ iterator
auto it = ms.find(3);
if (it != ms.end()) ms.erase(it);  // ลบแค่ตัวเดียว`}</pre>

      <h3>3. <code>std::map</code> — Key → Value (sorted by key)</h3>
      <pre className="code-block">{`#include <map>

map<string, int> ages;

ages["alice"] = 30;       // insert/update
ages["bob"] = 25;
ages.insert({"carol", 28});

cout << ages["alice"];    // 30

// ⚠ Pitfall: ages["dave"] เมื่อ "dave" ไม่มี → สร้าง entry value=0!
// ดูว่ามี key ไหม → ใช้ count หรือ find
if (ages.count("dave")) cout << ages["dave"];

// Iterate (sorted by key)
for (auto& [name, age] : ages) {
  cout << name << ": " << age << "\\n";
}

// Erase
ages.erase("bob");

// Size, etc.
ages.size();`}</pre>

      <h3>4. Powerful: <code>lower_bound</code> / <code>upper_bound</code></h3>
      <pre className="code-block">{`set<int> s = {1, 3, 5, 7, 9};

// lower_bound(x) → first element ≥ x
auto it1 = s.lower_bound(4);   // ชี้ 5
auto it2 = s.lower_bound(5);   // ชี้ 5
auto it3 = s.lower_bound(10);  // s.end()

// upper_bound(x) → first element > x
auto it4 = s.upper_bound(5);   // ชี้ 7

// Find just-greater than x
auto next = s.upper_bound(x);
if (next != s.end()) cout << *next;

// Find just-less than x
auto it = s.lower_bound(x);
if (it != s.begin()) {
  --it;
  cout << *it;            // largest < x
}`}</pre>

      <h3>5. Use Cases</h3>
      <pre className="code-block">{`// 1. Online median — 2 multisets
multiset<int> lo;            // smaller half
multiset<int> hi;            // larger half
// maintain: |lo| == |hi| or |lo| == |hi|+1
// median = *lo.rbegin() (or avg with hi)

// 2. Sliding window: find median / unique count
multiset<int> window;
for (int i = 0; i < n; i++) {
  window.insert(a[i]);
  if (i >= k) window.erase(window.find(a[i-k]));  // ลบเฉพาะ 1 ตัว
}

// 3. Interval scheduling — sort by end + map[end] → start
//    หา ‘แท่งถัดไป’ ที่ start ≥ end ปัจจุบัน → lower_bound

// 4. Word frequency
map<string, int> freq;
for (string& w : words) freq[w]++;     // auto-create เริ่ม 0`}</pre>

      <h3>6. Internal: Red-Black Tree</h3>
      <p>
        ทั้ง <code>set</code> และ <code>map</code> ใช้ <b>Red-Black Tree</b> (self-balancing BST):
      </p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Height = O(log n) เสมอ</li>
        <li>Insert / erase / find = O(log n)</li>
        <li>Iterate sorted = O(n)</li>
        <li>Cache locality แย่กว่า vector (pointer chasing)</li>
      </ul>

      <CS24 title="set/map Cheat Sheet" sections={[
        { label: "Insert", value: "<code>s.insert(x)</code>, <code>m[k] = v</code>" },
        { label: "Find", value: "<code>s.count(x)</code>, <code>s.find(x)</code>" },
        { label: "Sort order", value: "อัตโนมัติ — iterate = sorted" },
        { label: "Range", value: "<code>lower_bound</code>, <code>upper_bound</code>" },
        { label: "Time", value: "All ops O(log n)" },
        { label: "vs unordered_", value: "ช้ากว่า แต่ sorted + range query" },
      ]} />

      <PF24 items={[
        { trap: "<code>map[\"key\"]</code> เมื่อ key ไม่มี → สร้าง entry value=0", fix: "ใช้ <code>m.count(\"key\")</code> หรือ <code>m.find(\"key\")</code> เพื่อ check ก่อน" },
        { trap: "<code>multiset.erase(value)</code> ลบทั้งหมด", fix: "ใช้ <code>ms.erase(ms.find(value))</code> เพื่อลบ 1 ตัว" },
        { trap: "ใช้ set ของ struct ที่ไม่มี <code>operator&lt;</code>", fix: "Define <code>operator&lt;</code> หรือ pass custom comparator" },
        { trap: "Iterate map แล้ว modify ผ่าน <code>auto p</code>", fix: "ใช้ <code>auto&amp; [k, v]</code> เพื่อ reference (key ก็ยัง const)" },
      ]} />

      <Quiz24 q={{
        question: "<code>set&lt;int&gt; s = {5, 1, 3, 7, 9}; auto it = s.lower_bound(4); cout &lt;&lt; *it;</code>",
        options: ["3", "4", "5", "Undefined"],
        answer: 2,
        explain: "<code>lower_bound(4)</code> = first element ≥ 4 = 5 (sorted: 1,3,5,7,9)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   stl-unordered — Hash-based set/map
============================================================ */
Lessons24["stl-unordered"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 unordered_set & unordered_map — Hash Table</div>
        O(1) average — เร็วกว่า set/map แต่<b>ไม่มี order</b> + worst case O(n)
      </div>

      <h3>1. การใช้งาน — เหมือน set/map</h3>
      <pre className="code-block">{`#include <unordered_set>
#include <unordered_map>

unordered_set<int> us;
us.insert(3); us.insert(1); us.insert(4);
// {1, 3, 4} ในลำดับ random (ขึ้นกับ hash)

us.count(3);              // 1 — O(1) avg
us.erase(3);              // O(1) avg

unordered_map<string, int> um;
um["foo"] = 1;
um["bar"] = 2;
for (auto& [k, v] : um) cout << k << "=" << v << "\\n";
// ลำดับ random`}</pre>

      <h3>2. เมื่อใช้ unordered vs ordered?</h3>
      <table className="cmp">
        <thead><tr><th></th><th>set / map (RB-tree)</th><th>unordered_set / unordered_map (hash)</th></tr></thead>
        <tbody>
          <tr><td>Insert/Find/Erase</td><td className="mono">O(log n)</td><td className="mono">O(1) avg, O(n) worst</td></tr>
          <tr><td>Iterate</td><td>Sorted O(n)</td><td>Unsorted O(n)</td></tr>
          <tr><td>Range query</td><td>✓ (lower/upper_bound)</td><td>✗</td></tr>
          <tr><td>Memory</td><td>เล็กกว่า</td><td>ใหญ่กว่า (load factor &lt; 1)</td></tr>
          <tr><td>Cache locality</td><td>แย่ (tree pointers)</td><td>แย่กว่า (hash table)</td></tr>
          <tr><td>Adversary attack</td><td>ปลอดภัย</td><td>เสี่ยง — input ออกแบบทำให้ collision เยอะ</td></tr>
        </tbody>
      </table>

      <div className="callout warn">
        <div className="ttl">⚠ Anti-Hash Attack (Codeforces)</div>
        <code>unordered_map</code> ใน g++ ใช้ hash function ที่<b>คาดเดาได้</b><br/>
        ใน contest มีคน craft input ทำให้ collision เยอะ → O(n) ต่อ op → TLE<br/>
        แก้: ใช้ custom hash หรือ <code>map</code>
      </div>

      <h3>3. Custom Hash</h3>
      <pre className="code-block">{`// Anti-collision hash for competitive programming
struct CustomHash {
  size_t operator()(uint64_t x) const {
    static const uint64_t SEED = chrono::steady_clock::now().time_since_epoch().count();
    x ^= SEED;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
  }
};

unordered_map<int, int, CustomHash> safe_map;`}</pre>

      <h3>4. Hash ของ pair / struct (custom)</h3>
      <pre className="code-block">{`// pair<int, int> ไม่มี hash default
struct PairHash {
  template<class T1, class T2>
  size_t operator()(const pair<T1, T2>& p) const {
    return hash<T1>{}(p.first) ^ (hash<T2>{}(p.second) << 1);
  }
};

unordered_set<pair<int, int>, PairHash> coords;
coords.insert({1, 2});`}</pre>

      <h3>5. Common Use Cases</h3>
      <pre className="code-block">{`// 1. Frequency count
unordered_map<int, int> freq;
for (int x : arr) freq[x]++;

// 2. Two Sum O(n)
vector<int> twoSum(vector<int>& nums, int target) {
  unordered_map<int, int> seen;     // value → index
  for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (seen.count(complement)) {
      return {seen[complement], i};
    }
    seen[nums[i]] = i;
  }
  return {};
}

// 3. Group / dedupe
unordered_set<string> uniqueWords(words.begin(), words.end());

// 4. Memoization (DP)
unordered_map<long long, int> memo;
int dp(int a, int b) {
  long long key = (long long)a * 100000 + b;
  if (memo.count(key)) return memo[key];
  // ...
  return memo[key] = result;
}`}</pre>

      <h3>6. Load Factor + Rehash</h3>
      <pre className="code-block">{`um.bucket_count();          // จำนวน buckets
um.load_factor();           // size / buckets
um.max_load_factor();       // threshold (default 1.0)
um.rehash(100);             // force rehash to ≥ 100 buckets
um.reserve(100);            // hint expected size

// Auto rehash เมื่อ load > max_load_factor
// rehash = O(n) — invalidate iterators
// → ถ้ารู้ size ล่วงหน้า: reserve!`}</pre>

      <CS24 title="unordered_set/map Cheat Sheet" sections={[
        { label: "Speed", value: "O(1) avg, O(n) worst (collision)" },
        { label: "No order", value: "Iterate = random ลำดับ" },
        { label: "When use", value: "ต้องการ fast lookup, ไม่ต้อง sorted" },
        { label: "Anti-attack", value: "Custom hash ใน contest" },
        { label: "Reserve", value: "<code>um.reserve(n)</code> ลด rehash" },
        { label: "Avoid", value: "<code>unordered_*</code> เมื่อต้อง range query" },
      ]} />

      <Quiz24 q={{
        question: "เมื่อใดควรใช้ <code>map</code> แทน <code>unordered_map</code>?",
        options: [
          "เมื่อต้องการเร็วสุด",
          "เมื่อต้องการ iterate sorted หรือ range query",
          "เมื่อ key เป็น string",
          "ไม่มีกรณีที่ map ดีกว่า"
        ],
        answer: 1,
        explain: "Map ให้ sorted iteration + lower/upper_bound. ถ้าไม่ต้องการ 2 อย่างนี้ → unordered_map เร็วกว่า"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   stl-algorithms — Algorithms library (sort, find, accumulate, etc.)
============================================================ */
Lessons24["stl-algorithms"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 &lt;algorithm&gt; & &lt;numeric&gt; — Generic Algorithms</div>
        ฟังก์ชันที่ทำงานบน <b>iterator range</b> [begin, end) → ใช้กับ container ใดก็ได้
      </div>

      <h3>1. Sorting</h3>
      <pre className="code-block">{`#include <algorithm>

vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

sort(v.begin(), v.end());                  // ascending: {1,1,2,3,4,5,6,9}
sort(v.begin(), v.end(), greater<>());     // descending
sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); // custom

// Stable sort — preserve order ของ equal elements
stable_sort(v.begin(), v.end());

// Partial sort — top k sorted, rest unspecified
partial_sort(v.begin(), v.begin() + 3, v.end());  // top 3 sorted

// nth_element — kth smallest in place (O(n) avg)
nth_element(v.begin(), v.begin() + k, v.end());
// v[k] = kth smallest, v[<k] ≤ v[k], v[>k] ≥ v[k]
// (rest unsorted)`}</pre>

      <h3>2. Searching</h3>
      <pre className="code-block">{`// Linear find
auto it = find(v.begin(), v.end(), 5);
if (it != v.end()) cout << "found at " << it - v.begin();

// Predicate find
auto it = find_if(v.begin(), v.end(), [](int x) { return x > 100; });

// Binary search (require sorted!)
bool exists = binary_search(v.begin(), v.end(), 5);

// lower_bound: first element ≥ x — O(log n)
auto lo = lower_bound(v.begin(), v.end(), 5);

// upper_bound: first element > x
auto hi = upper_bound(v.begin(), v.end(), 5);

// equal_range — [lower, upper)
auto [lo2, hi2] = equal_range(v.begin(), v.end(), 5);
cout << "count of 5 = " << hi2 - lo2;`}</pre>

      <h3>3. Counting & Aggregation</h3>
      <pre className="code-block">{`#include <numeric>

count(v.begin(), v.end(), 5);              // count occurrences of 5
count_if(v.begin(), v.end(), [](int x) { return x > 10; });

// Sum
int total = accumulate(v.begin(), v.end(), 0);
long long bigTotal = accumulate(v.begin(), v.end(), 0LL);  // long long init!

// Custom reduce
int product = accumulate(v.begin(), v.end(), 1, multiplies<>());

// Max / min
int mx = *max_element(v.begin(), v.end());
int mn = *min_element(v.begin(), v.end());
auto [it_min, it_max] = minmax_element(v.begin(), v.end());

// All / any / none
all_of(v.begin(), v.end(), [](int x) { return x > 0; });
any_of(v.begin(), v.end(), [](int x) { return x < 0; });
none_of(v.begin(), v.end(), [](int x) { return x == 0; });`}</pre>

      <h3>4. Modify</h3>
      <pre className="code-block">{`// Reverse
reverse(v.begin(), v.end());

// Rotate — left rotate by n
rotate(v.begin(), v.begin() + 2, v.end());
// [3,4,5,6,7,1,2] (was [1..7])

// Shuffle (random)
random_device rd; mt19937 g(rd());
shuffle(v.begin(), v.end(), g);

// Unique (consecutive duplicates) — must sort first
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// Fill
fill(v.begin(), v.end(), 0);

// Iota — fill with sequential values
iota(v.begin(), v.end(), 1);     // {1, 2, 3, 4, 5, ...}

// Copy
vector<int> dst(v.size());
copy(v.begin(), v.end(), dst.begin());

// Transform — apply function to each element
vector<int> doubled(v.size());
transform(v.begin(), v.end(), doubled.begin(), [](int x) { return x * 2; });

// Replace
replace(v.begin(), v.end(), 5, 50);    // replace 5 with 50
replace_if(v.begin(), v.end(), [](int x) { return x < 0; }, 0);

// Remove — actually doesn't shrink! ใช้ erase-remove idiom
v.erase(remove(v.begin(), v.end(), 5), v.end());`}</pre>

      <h3>5. Permutations</h3>
      <pre className="code-block">{`// next_permutation — generate ทุก permutation
sort(v.begin(), v.end());
do {
  // process v
} while (next_permutation(v.begin(), v.end()));

// prev_permutation — reverse
sort(v.rbegin(), v.rend());
do {
  // process
} while (prev_permutation(v.begin(), v.end()));`}</pre>

      <h3>6. Set Operations (require sorted)</h3>
      <pre className="code-block">{`vector<int> a = {1, 2, 3, 4, 5}, b = {3, 4, 5, 6, 7};
vector<int> result(a.size() + b.size());

// Union
auto it = set_union(a.begin(), a.end(), b.begin(), b.end(), result.begin());
result.resize(it - result.begin());
// {1, 2, 3, 4, 5, 6, 7}

// Intersection
result.assign(min(a.size(), b.size()), 0);
it = set_intersection(a.begin(), a.end(), b.begin(), b.end(), result.begin());
result.resize(it - result.begin());
// {3, 4, 5}

// Difference (a - b)
set_difference(a.begin(), a.end(), b.begin(), b.end(), result.begin());
// {1, 2}`}</pre>

      <WE24
        title="Erase-Remove Idiom"
        problem="ทำไม <code>v.remove(5)</code> ไม่มี? และทำไมต้อง <code>v.erase(remove(...), v.end())</code>?"
        steps={[
          { title: "remove ไม่ลบจริง", body: "<code>remove(begin, end, val)</code> shift elements ที่ไม่ใช่ val ไปด้านหน้า\nคืน iterator ที่ ‘ขอบสิ้นสุดใหม่’\n→ size ไม่เปลี่ยน, ส่วนท้ายเป็น ‘zombie’", why: "Algorithm บนtemplate ไม่ทราบ container — ลบ size เปลี่ยนไม่ได้" },
          { title: "ทำไม", body: "<code>algorithm</code> ออกแบบให้ใช้กับ iterator range ใดก็ได้ — รวมถึง raw array ที่ ‘ลบ’ ไม่ได้", why: "Generic design" },
          { title: "Solution: erase-remove", body: "v.erase(\n  remove(v.begin(), v.end(), 5),   // ขอบใหม่\n  v.end()                            // ตัดทิ้งจากขอบใหม่ถึง end เดิม\n);", why: "Container's erase() ลบจริง" },
          { title: "C++20: erase / erase_if", body: "v.erase_if(v, [](int x) { return x == 5; });\n// สั้นกว่าและชัดเจน", why: "" },
        ]}
        answer="erase-remove idiom = วิธีลบ element ด้วยค่า / predicate ใน vector ▢"
      />

      <h3>7. Cheat Table — Useful one-liners</h3>
      <table className="cmp">
        <thead><tr><th>ต้องการ</th><th>โค้ด</th></tr></thead>
        <tbody>
          <tr><td>Sort descending</td><td><code>sort(v.rbegin(), v.rend())</code></td></tr>
          <tr><td>หา max</td><td><code>*max_element(v.begin(), v.end())</code></td></tr>
          <tr><td>sum</td><td><code>accumulate(v.begin(), v.end(), 0LL)</code></td></tr>
          <tr><td>ลบ duplicates</td><td><code>sort + unique + erase</code></td></tr>
          <tr><td>random shuffle</td><td><code>shuffle(v.begin(), v.end(), mt19937(seed))</code></td></tr>
          <tr><td>หาว่ามีตัว neg</td><td><code>{"any_of(v.begin(), v.end(), [](int x){return x<0;})"}</code></td></tr>
          <tr><td>เปลี่ยนทุกตัวเป็น × 2</td><td><code>for (auto&amp; x : v) x *= 2;</code></td></tr>
          <tr><td>kth smallest</td><td><code>nth_element(v.begin(), v.begin()+k, v.end()); v[k];</code></td></tr>
        </tbody>
      </table>

      <CS24 title="Algorithm Header Cheat Sheet" sections={[
        { label: "Sort", value: "<code>sort, stable_sort, partial_sort, nth_element</code>" },
        { label: "Search", value: "<code>find, find_if, binary_search, lower/upper_bound</code>" },
        { label: "Aggregate", value: "<code>count, accumulate, min/max_element</code>" },
        { label: "Predicate", value: "<code>all_of, any_of, none_of</code>" },
        { label: "Modify", value: "<code>reverse, rotate, fill, transform, replace</code>" },
        { label: "Remove", value: "<code>v.erase(remove(b, e, v), v.end())</code>" },
        { label: "Permute", value: "<code>next_permutation, prev_permutation</code>" },
      ]} />

      <PF24 items={[
        { trap: "<code>accumulate(v.begin(), v.end(), 0)</code> overflow เมื่อ sum &gt; 2^31", fix: "ใช้ init = <code>0LL</code> (long long) → <code>accumulate(v.begin(), v.end(), 0LL)</code>" },
        { trap: "<code>remove</code> ไม่ลบจริง", fix: "Erase-remove idiom: <code>v.erase(remove(...), v.end())</code>" },
        { trap: "<code>binary_search</code> บน array ที่ไม่ sorted", fix: "ต้อง <code>sort</code> ก่อน — มิฉะนั้น result undefined" },
        { trap: "Custom comparator แล้ว <code>return a &lt;= b</code> (strict ผิด)", fix: "ต้อง <code>return a &lt; b</code> (strict less than) ตาม STL requirement" },
      ]} />

      <Quiz24 q={{
        question: "<code>nth_element(v.begin(), v.begin() + 3, v.end())</code> ทำอะไร?",
        options: [
          "Sort เฉพาะ 3 ตัวแรก",
          "Sort ตั้งแต่ index 3 ไป",
          "ทำให้ v[3] = 4th smallest, v[0..2] ≤ v[3], v[4..] ≥ v[3] (ที่เหลือไม่ sorted)",
          "Erase 3 elements"
        ],
        answer: 2,
        explain: "<code>nth_element</code> = partial sort สำหรับ kth element เท่านั้น — O(n) avg vs sort O(n log n)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   cpp-lambda — Lambda functions
============================================================ */
Lessons24["cpp-lambda"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Lambda Functions — Inline Anonymous Functions</div>
        เขียน function ตรงในที่ที่ใช้ — สั้น สะอาด ไม่ต้องประกาศแยก
      </div>

      <h3>1. Syntax</h3>
      <pre className="code-block">{`[capture](params) -> return_type { body }
//   |       |          |          |
//   |       |          |          + body
//   |       |          + return type (optional, auto deduce)
//   |       + parameters เหมือน function ปกติ
//   + capture clause`}</pre>

      <h3>2. Basic Examples</h3>
      <pre className="code-block">{`// Simplest
auto greet = []() { cout << "Hello\\n"; };
greet();      // call

// With params
auto add = [](int a, int b) { return a + b; };
cout << add(2, 3);    // 5

// With explicit return type
auto divide = [](double a, double b) -> double {
  if (b == 0) return 0;
  return a / b;
};`}</pre>

      <h3>3. Capture Clause</h3>
      <pre className="code-block">{`int x = 10, y = 20;

// [] — no capture (cannot access x, y)
auto f1 = []() { /* cannot use x, y */ };

// [x] — capture x by value (snapshot)
auto f2 = [x]() { cout << x; };       // sees 10 even if x changes later

// [&x] — capture x by reference (live)
auto f3 = [&x]() { x++; };
f3();   // x = 11 outside

// [=] — capture ALL local by value
auto f4 = [=]() { cout << x << " " << y; };

// [&] — capture ALL local by reference
auto f5 = [&]() { x++; y++; };

// Mixed: [=, &x] — all by value EXCEPT x by reference
auto f6 = [=, &x]() { x++; cout << y; };

// Mixed: [&, x] — all by reference EXCEPT x by value
auto f7 = [&, x]() { y++; cout << x; };

// [this] — capture this (for class methods)
class C {
  int n = 5;
  auto f() { return [this]() { return n; }; }
};`}</pre>

      <h3>4. Common Use Cases</h3>
      <pre className="code-block">{`// 1. Sort with custom comparator
vector<pair<string, int>> v;
sort(v.begin(), v.end(), [](auto& a, auto& b) {
  return a.second > b.second;   // by value descending
});

// 2. Algorithm predicates
auto evens = count_if(v.begin(), v.end(),
  [](int x) { return x % 2 == 0; });

// 3. Callback
function<int(int)> f = [](int x) { return x * 2; };
cout << f(5);   // 10

// 4. Capturing local state
int threshold = 10;
auto countAbove = [threshold](vector<int>& v) {
  return count_if(v.begin(), v.end(),
    [threshold](int x) { return x > threshold; });
};

// 5. Inline recursion (needs std::function)
function<int(int)> fib = [&](int n) {
  return n < 2 ? n : fib(n-1) + fib(n-2);
};

// 6. priority_queue custom comparator
auto cmp = [](pair<int,int>& a, pair<int,int>& b) {
  return a.first > b.first;
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);`}</pre>

      <h3>5. Generic Lambda (C++14)</h3>
      <pre className="code-block">{`// Parameters เป็น auto → ใช้กับ type ใดก็ได้
auto add = [](auto a, auto b) { return a + b; };
add(1, 2);              // int
add(1.5, 2.5);          // double
add("Hello "s, "World"s); // string concat

// ใช้กับ structured binding
sort(v.begin(), v.end(), [](const auto& a, const auto& b) {
  return a.first < b.first;
});`}</pre>

      <h3>6. Mutable Lambda</h3>
      <pre className="code-block">{`int counter = 0;
auto inc = [counter]() mutable {
  counter++;            // ถ้าไม่มี mutable จะ error เพราะ [counter] = const copy
  cout << counter;
};
inc();    // 1
inc();    // 2
cout << counter;   // 0 — outer ไม่เปลี่ยน (เพราะ capture by value)`}</pre>

      <h3>7. Storing Lambdas</h3>
      <pre className="code-block">{`// Each lambda has UNIQUE type (auto-generated)
auto f1 = [](int x) { return x; };
auto f2 = [](int x) { return x; };
// decltype(f1) != decltype(f2)!

// เก็บใน vector — ต้อง std::function
#include <functional>
vector<function<int(int)>> funcs;
funcs.push_back([](int x) { return x + 1; });
funcs.push_back([](int x) { return x * 2; });
for (auto& f : funcs) cout << f(5);   // 6 10`}</pre>

      <WE24
        title="Lambda เทียบกับ function pointer / functor"
        problem="3 วิธี pass ‘comparator’ ให้ sort"
        steps={[
          { title: "1. Function pointer (C-style)", body: "bool cmp(int a, int b) { return a > b; }\nsort(v.begin(), v.end(), cmp);", why: "ใช้ได้แต่ verbose, ไม่ capture state ได้" },
          { title: "2. Functor (class with operator())", body: "struct Cmp {\n  bool operator()(int a, int b) const { return a > b; }\n};\nsort(v.begin(), v.end(), Cmp());", why: "Capture state ได้ผ่าน member variable แต่ยาว" },
          { title: "3. Lambda (modern)", body: "sort(v.begin(), v.end(),\n  [](int a, int b) { return a > b; });", why: "สั้น, capture state ตรง ๆ" },
        ]}
        answer="Lambda = winner สำหรับ in-place comparator ▢"
      />

      <CS24 title="Lambda Cheat Sheet" sections={[
        { label: "Syntax", value: "<code>[cap](args) -&gt; ret { body }</code>" },
        { label: "[]", value: "no capture" },
        { label: "[=]", value: "all by value" },
        { label: "[&]", value: "all by reference" },
        { label: "[x, &y]", value: "x by value, y by reference" },
        { label: "mutable", value: "เปลี่ยน captured-by-value ใน lambda" },
        { label: "generic", value: "<code>[](auto x){...}</code> (C++14)" },
        { label: "Store", value: "<code>function&lt;ret(args)&gt;</code>" },
      ]} />

      <PF24 items={[
        { trap: "<code>[&]</code> capture local ที่ตายไปแล้ว → dangling", fix: "ระวัง lifetime — ถ้า lambda เอาออกจาก scope ใช้ <code>[=]</code>" },
        { trap: "ลืม <code>mutable</code> เมื่อต้องแก้ capture-by-value", fix: "เพิ่ม <code>mutable</code> หลัง params" },
        { trap: "เก็บ lambda ใน vector → type ไม่ match", fix: "ใช้ <code>vector&lt;function&lt;sig&gt;&gt;</code>" },
        { trap: "Recursive lambda ตรง ๆ ไม่ได้", fix: "ใช้ <code>std::function</code> + capture <code>[&amp;]</code>" },
      ]} />

      <Quiz24 q={{
        question: "<code>int n = 5; auto f = [n](int x) { return x + n; }; n = 10; cout &lt;&lt; f(1);</code>",
        options: ["6", "11", "Error", "Undefined"],
        answer: 0,
        explain: "<code>[n]</code> = capture by value (snapshot ตอนสร้าง lambda) → n ใน lambda ยัง 5 แม้ outer n = 10 → f(1) = 1+5 = 6"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   Shared Viz — Bitset Grid (interactive bits + ops)
============================================================ */
function BitsetViz() {
  const N = 16;
  const [a, setA] = useS24([1,0,1,1,0,0,1,0,1,1,0,0,1,0,1,0]); // 16 bits
  const [b, setB] = useS24([1,1,0,0,1,0,1,0,1,0,1,1,0,1,0,1]);
  const [lastOp, setLastOp] = useS24('');

  const toInt = (arr) => arr.reduce((s, x, i) => s + (x ? Math.pow(2, N - 1 - i) : 0), 0);
  const cnt = (arr) => arr.filter(x => x).length;

  const flip = (i, which) => {
    if (which === 'a') { const na = [...a]; na[i] = na[i] ? 0 : 1; setA(na); setLastOp(`a.flip(${N-1-i}) → bit ${N-1-i} toggled`); }
    else { const nb = [...b]; nb[i] = nb[i] ? 0 : 1; setB(nb); setLastOp(`b.flip(${N-1-i})`); }
  };
  const op = (which) => {
    if (which === 'AND') { setA(a.map((x, i) => x & b[i])); setLastOp('a = a & b'); }
    if (which === 'OR') { setA(a.map((x, i) => x | b[i])); setLastOp('a = a | b'); }
    if (which === 'XOR') { setA(a.map((x, i) => x ^ b[i])); setLastOp('a = a ^ b'); }
    if (which === 'NOT') { setA(a.map(x => x ? 0 : 1)); setLastOp('a = ~a'); }
    if (which === 'SHL') { const na = [...a.slice(1), 0]; setA(na); setLastOp('a = a << 1'); }
    if (which === 'SHR') { const na = [0, ...a.slice(0, -1)]; setA(na); setLastOp('a = a >> 1'); }
  };

  const renderBits = (bits, label, color, which) => (
    <div>
      <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>
        {label} = {bits.join('')} (decimal: {toInt(bits)}, count: {cnt(bits)})
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {bits.map((bit, i) => (
          <div key={i} onClick={() => flip(i, which)}
            title={`bit ${N - 1 - i}`}
            style={{
              width: 22, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: bit ? color : 'var(--bg-3)',
              color: bit ? '#000' : 'var(--text-3)',
              border: '1px solid var(--border)', borderRadius: 3,
              fontFamily: 'monospace', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.15s'
            }}>{bit}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
        {bits.map((_, i) => (
          <div key={i} style={{ width: 22, fontSize: 8, color: 'var(--text-3)', textAlign: 'center', fontFamily: 'monospace' }}>{N - 1 - i}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 6, marginBottom: 10 }}>
        {renderBits(a, 'a', 'var(--accent-2)', 'a')}
        <div style={{ marginTop: 14 }}>{renderBits(b, 'b', '#a78bfa', 'b')}</div>
      </div>

      <div className="ctrls" style={{ flexWrap: 'wrap' }}>
        <button onClick={() => op('AND')} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>a & b (AND)</button>
        <button onClick={() => op('OR')}>a | b (OR)</button>
        <button onClick={() => op('XOR')}>a ^ b (XOR)</button>
        <button onClick={() => op('NOT')}>~a (NOT)</button>
        <button onClick={() => op('SHL')}>a &lt;&lt; 1</button>
        <button onClick={() => op('SHR')}>a &gt;&gt; 1</button>
      </div>

      {lastOp && (
        <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
          ► {lastOp}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 คลิกบิตเพื่อ flip · ใช้ปุ่มเพื่อทำ bitwise ops · bit index 0 = ขวาสุด (LSB)
      </div>
    </div>
  );
}

/* ============================================================
   stl-bitset — Fast bit operations
============================================================ */
Lessons24["stl-bitset"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 std::bitset&lt;N&gt; — Fixed-size bit array</div>
        เก็บ N bits แน่นในหน่วยความจำ (N/8 bytes) — ops O(N/64) — เร็วกว่า <code>vector&lt;bool&gt;</code>
      </div>

      <h3>🎬 Interactive — กดบิตเพื่อ flip + ลอง AND/OR/XOR/shift</h3>
      <BitsetViz />

      <h3>1. การสร้าง</h3>
      <pre className="code-block">{`#include <bitset>

bitset<32> b;                 // 32 bits, all 0
bitset<8> b2(13);             // from int — 00001101
bitset<8> b3("10110010");     // from string
bitset<8> b4(0b11001100);     // binary literal

cout << b2;                   // "00001101"
cout << b2.to_string();       // same
cout << b2.to_ulong();        // 13
cout << b2.to_ullong();       // 13 (unsigned long long)`}</pre>

      <h3>2. Operations</h3>
      <pre className="code-block">{`bitset<8> b("10110010");

// Access
b[0]              // 0 (rightmost bit!)
b[7]              // 1 (leftmost = highest)
b.test(3)         // bit at index 3 = 0

// Set / reset / flip
b.set(0);         // bit 0 = 1
b.set(0, true);   // same
b.reset(7);       // bit 7 = 0
b.flip(2);        // toggle bit 2
b.set();          // set all to 1
b.reset();        // reset all to 0
b.flip();         // toggle all

// Query
b.count()         // จำนวน 1 bits
b.size()          // 8 (= N)
b.any()           // true ถ้ามี 1
b.none()          // true ถ้าไม่มี 1
b.all()           // true ถ้าทุกตัวเป็น 1`}</pre>

      <h3>3. Bitwise Operations</h3>
      <pre className="code-block">{`bitset<8> a("10110010");
bitset<8> b("11001100");

a & b             // AND: 10000000
a | b             // OR:  11111110
a ^ b             // XOR: 01111110
~a                // NOT: 01001101
a << 2            // shift left: 11001000
a >> 1            // shift right: 01011001`}</pre>

      <h3>4. ใช้แทน Sieve of Eratosthenes (เร็วกว่า)</h3>
      <pre className="code-block">{`const int N = 10000000;
bitset<N+1> isPrime;
isPrime.set();    // initial: all true
isPrime[0] = isPrime[1] = 0;

for (int i = 2; i * i <= N; i++) {
  if (isPrime[i]) {
    for (int j = i * i; j <= N; j += i) isPrime[j] = 0;
  }
}

cout << isPrime.count();  // count of primes ≤ N`}</pre>

      <h3>5. Subset Enumeration (Bitmask DP)</h3>
      <pre className="code-block">{`// ใช้เป็น set แบบ bitmask
int n = 5;     // 5 elements
for (int mask = 0; mask < (1 << n); mask++) {
  bitset<5> b(mask);
  cout << b << " | popcount = " << b.count() << "\\n";
}

// Faster than vector<bool>:
// vector<bool>: 1 byte per bit (or compressed but slow)
// bitset: tightly packed, SIMD-friendly`}</pre>

      <h3>6. <code>__builtin_popcount</code> (g++ extension)</h3>
      <pre className="code-block">{`int x = 0b10110010;
__builtin_popcount(x);       // count 1 bits = 4
__builtin_popcountll(xll);   // long long version
__builtin_clz(x);            // count leading zeros (UB if x=0)
__builtin_ctz(x);            // count trailing zeros (UB if x=0)
__builtin_parity(x);         // 1 if odd # of 1s

// Equivalent to:
bitset<32>(x).count();       // popcount
__lg(x);                     // floor(log2(x)) (gcc)`}</pre>

      <h3>7. <code>bitset</code> vs <code>vector&lt;bool&gt;</code> vs raw bits</h3>
      <table className="cmp">
        <thead><tr><th></th><th>bitset&lt;N&gt;</th><th>vector&lt;bool&gt;</th><th>raw <code>int</code></th></tr></thead>
        <tbody>
          <tr><td>Size</td><td>Compile-time fixed</td><td>Runtime dynamic</td><td>32/64 bits</td></tr>
          <tr><td>Memory</td><td>N/8 bytes</td><td>Compressed (1 bit/elem)</td><td>4/8 bytes</td></tr>
          <tr><td>Speed</td><td>Fast (SIMD-friendly)</td><td>Slower (special access)</td><td>Fastest</td></tr>
          <tr><td>Bit ops</td><td>Built-in</td><td>Manual</td><td>Manual</td></tr>
          <tr><td>Use</td><td>Sieve, DP bitmask &gt; 64</td><td>Generic, dynamic</td><td>Bitmask DP ≤ 64 bits</td></tr>
        </tbody>
      </table>

      <CS24 title="bitset Cheat Sheet" sections={[
        { label: "Create", value: "<code>bitset&lt;N&gt; b;</code> — N is compile-time" },
        { label: "Access", value: "<code>b[i]</code> — index 0 = LSB" },
        { label: "Set/Reset/Flip", value: "<code>set, reset, flip</code> (with/without idx)" },
        { label: "Query", value: "<code>count, any, none, all, test</code>" },
        { label: "Ops", value: "<code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code>" },
        { label: "Convert", value: "<code>to_string, to_ulong, to_ullong</code>" },
      ]} />

      <Quiz24 q={{
        question: "<code>bitset&lt;8&gt; b(13); cout &lt;&lt; b;</code> ออกอะไร?",
        options: ["13", "1101", "00001101", "00001110"],
        answer: 2,
        explain: "13 = 1101₂ → padded to 8 bits → 00001101. <code>cout</code> ของ bitset แสดงจากซ้าย (MSB) ไปขวา (LSB)"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart24 = Lessons24;
