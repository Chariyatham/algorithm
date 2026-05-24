/* Lessons Part 8 — AVL, MST, KMP, Hash Collision, Huffman */

const { useState: useS8, useMemo: useM8, useEffect: useE8 } = React;
const { Quiz: Quiz8 } = window.LessonComponents;
const { WorkedExample: WE8, CheatSheet: CS8, Pitfalls: PF8 } = window.LearningKit;
const CodeViewToggle8 = window.CodeViewToggle;

const Lessons8 = {};

/* ============================================================
   CODE: AVL Tree (Full + Short)
============================================================ */
const AVL_CODE_FULL = [
  "struct Node {",                                                  // 0
  "  int val, height;",                                             // 1
  "  Node *l, *r;",                                                 // 2
  "  Node(int v) : val(v), height(1), l(nullptr), r(nullptr) {}",   // 3
  "};",                                                             // 4
  "",                                                               // 5
  "int height(Node* n) { return n ? n->height : 0; }",              // 6
  "void updateHeight(Node* n) {",                                   // 7
  "  n->height = 1 + max(height(n->l), height(n->r));",             // 8
  "}",                                                              // 9
  "int getBalance(Node* n) {",                                      // 10
  "  return n ? height(n->l) - height(n->r) : 0;",                  // 11
  "}",                                                              // 12
  "",                                                               // 13
  "Node* rotateRight(Node* y) {",                                   // 14
  "  Node* x = y->l;",                                              // 15
  "  Node* T = x->r;",                                              // 16
  "  x->r = y;",                                                    // 17
  "  y->l = T;",                                                    // 18
  "  updateHeight(y);",                                             // 19
  "  updateHeight(x);",                                             // 20
  "  return x;",                                                    // 21
  "}",                                                              // 22
  "Node* rotateLeft(Node* x) {",                                    // 23
  "  Node* y = x->r;",                                              // 24
  "  Node* T = y->l;",                                              // 25
  "  y->l = x;",                                                    // 26
  "  x->r = T;",                                                    // 27
  "  updateHeight(x);",                                             // 28
  "  updateHeight(y);",                                             // 29
  "  return y;",                                                    // 30
  "}",                                                              // 31
  "",                                                               // 32
  "Node* insert(Node* node, int v) {",                              // 33
  "  if (!node) return new Node(v);",                               // 34
  "  if (v < node->val) node->l = insert(node->l, v);",             // 35
  "  else if (v > node->val) node->r = insert(node->r, v);",        // 36
  "  else return node;     // duplicate ไม่แทรก",                     // 37
  "",                                                               // 38
  "  updateHeight(node);",                                          // 39
  "  int bf = getBalance(node);",                                   // 40
  "  // 4 imbalance cases",                                         // 41
  "  if (bf > 1 && v < node->l->val) return rotateRight(node); // LL", // 42
  "  if (bf < -1 && v > node->r->val) return rotateLeft(node); // RR", // 43
  "  if (bf > 1 && v > node->l->val) {                       // LR", // 44
  "    node->l = rotateLeft(node->l);",                             // 45
  "    return rotateRight(node);",                                  // 46
  "  }",                                                            // 47
  "  if (bf < -1 && v < node->r->val) {                       // RL", // 48
  "    node->r = rotateRight(node->r);",                            // 49
  "    return rotateLeft(node);",                                   // 50
  "  }",                                                            // 51
  "  return node;",                                                 // 52
  "}",                                                              // 53
];
const AVL_CODE_SHORT = [
  "Node* insert(Node* node, int v) {",                              // 0
  "  if (!node) return new Node(v);",                               // 1
  "  if (v < node->val) node->l = insert(node->l, v);",             // 2
  "  else if (v > node->val) node->r = insert(node->r, v);",        // 3
  "  else return node;",                                            // 4
  "",                                                               // 5
  "  updateHeight(node);              // ← helper",                  // 6
  "  int bf = getBalance(node);       // ← helper",                  // 7
  "  // 4 imbalance cases → rotate",                                // 8
  "  if (bf > 1 && v < node->l->val) return rotateRight(node);  // LL", // 9
  "  if (bf < -1 && v > node->r->val) return rotateLeft(node);  // RR", // 10
  "  if (bf > 1 && v > node->l->val) {                        // LR", // 11
  "    node->l = rotateLeft(node->l);",                             // 12
  "    return rotateRight(node);",                                  // 13
  "  }",                                                            // 14
  "  if (bf < -1 && v < node->r->val) {                        // RL", // 15
  "    node->r = rotateRight(node->r);",                            // 16
  "    return rotateLeft(node);",                                   // 17
  "  }",                                                            // 18
  "  return node;",                                                 // 19
  "}",                                                              // 20
];

/* ============================================================
   CODE: Prim's MST (Full + Short)
============================================================ */
const PRIM_CODE_FULL = [
  "#include <queue>",                                               // 0
  "#include <vector>",                                              // 1
  "using namespace std;",                                           // 2
  "typedef pair<int,int> pii;        // (weight, vertex)",          // 3
  "",                                                               // 4
  "int prim(vector<vector<pii>>& adj, int start) {",                // 5
  "  int n = adj.size();",                                          // 6
  "  vector<bool> inMST(n, false);",                                // 7
  "  priority_queue<pii, vector<pii>, greater<>> pq;",              // 8
  "  int total = 0;",                                               // 9
  "",                                                               // 10
  "  inMST[start] = true;",                                         // 11
  "  for (auto& [v, w] : adj[start])",                              // 12
  "    pq.push({w, v});",                                           // 13
  "",                                                               // 14
  "  while (!pq.empty()) {",                                        // 15
  "    auto [w, v] = pq.top(); pq.pop();",                          // 16
  "    if (inMST[v]) continue;",                                    // 17
  "",                                                               // 18
  "    inMST[v] = true;",                                           // 19
  "    total += w;",                                                // 20
  "    // add edge to MST",                                         // 21
  "    for (auto& [x, ww] : adj[v])",                               // 22
  "      if (!inMST[x]) pq.push({ww, x});",                         // 23
  "  }",                                                            // 24
  "  return total;",                                                // 25
  "}",                                                              // 26
];
// No "Short" — prim is already a single function

/* ============================================================
   CODE: KMP String Matching (Full + Short)
============================================================ */
const KMP_CODE_FULL = [
  "// Build LPS (Longest Proper Prefix-Suffix) array",              // 0
  "vector<int> computeLPS(const string& p) {",                      // 1
  "  int m = p.size();",                                            // 2
  "  vector<int> lps(m, 0);",                                       // 3
  "  int len = 0;",                                                 // 4
  "  for (int i = 1; i < m; ) {",                                   // 5
  "    if (p[i] == p[len]) {",                                      // 6
  "      lps[i++] = ++len;",                                        // 7
  "    } else if (len > 0) {",                                      // 8
  "      len = lps[len - 1];                // fall back",          // 9
  "    } else {",                                                   // 10
  "      lps[i++] = 0;",                                            // 11
  "    }",                                                          // 12
  "  }",                                                            // 13
  "  return lps;",                                                  // 14
  "}",                                                              // 15
  "",                                                               // 16
  "// Search pattern p in text t — returns all match positions",    // 17
  "vector<int> KMP(const string& t, const string& p) {",            // 18
  "  vector<int> lps = computeLPS(p);",                             // 19
  "  vector<int> matches;",                                         // 20
  "  int n = t.size(), m = p.size();",                              // 21
  "  int i = 0, j = 0;",                                            // 22
  "  while (i < n) {",                                              // 23
  "    if (t[i] == p[j]) { i++; j++; }",                            // 24
  "    if (j == m) {",                                              // 25
  "      matches.push_back(i - j);",                                // 26
  "      j = lps[j - 1];                    // continue search",    // 27
  "    } else if (i < n && t[i] != p[j]) {",                        // 28
  "      if (j > 0) j = lps[j - 1];         // fall back",          // 29
  "      else i++;",                                                // 30
  "    }",                                                          // 31
  "  }",                                                            // 32
  "  return matches;",                                              // 33
  "}",                                                              // 34
];
const KMP_CODE_SHORT = [
  "vector<int> KMP(const string& t, const string& p) {",            // 0
  "  vector<int> lps = computeLPS(p);     // ← helper",              // 1
  "  vector<int> matches;",                                         // 2
  "  int n = t.size(), m = p.size();",                              // 3
  "  int i = 0, j = 0;",                                            // 4
  "  while (i < n) {",                                              // 5
  "    if (t[i] == p[j]) { i++; j++; }",                            // 6
  "    if (j == m) {                       // found match",         // 7
  "      matches.push_back(i - j);",                                // 8
  "      j = lps[j - 1];                   // continue",            // 9
  "    } else if (i < n && t[i] != p[j]) { // mismatch",            // 10
  "      if (j > 0) j = lps[j - 1];        // fall back",           // 11
  "      else i++;",                                                // 12
  "    }",                                                          // 13
  "  }",                                                            // 14
  "  return matches;",                                              // 15
  "}",                                                              // 16
];

/* ============================================================
   CODE: Hash Table — Chaining + Probing
============================================================ */
const CHAIN_CODE_FULL = [
  "#include <list>",                                                // 0
  "#include <vector>",                                              // 1
  "using namespace std;",                                           // 2
  "",                                                               // 3
  "struct HashChain {",                                             // 4
  "  static const int SIZE = 11;",                                  // 5
  "  vector<list<pair<int,int>>> table;  // bucket = list of (key,val)", // 6
  "  HashChain() : table(SIZE) {}",                                 // 7
  "",                                                               // 8
  "  int hash(int key) { return key % SIZE; }",                     // 9
  "",                                                               // 10
  "  void insert(int key, int val) {",                              // 11
  "    int h = hash(key);",                                         // 12
  "    for (auto& kv : table[h])",                                  // 13
  "      if (kv.first == key) { kv.second = val; return; }",        // 14
  "    table[h].push_back({key, val});",                            // 15
  "  }",                                                            // 16
  "",                                                               // 17
  "  bool find(int key, int& out) {",                               // 18
  "    int h = hash(key);",                                         // 19
  "    for (auto& kv : table[h])",                                  // 20
  "      if (kv.first == key) { out = kv.second; return true; }",   // 21
  "    return false;",                                              // 22
  "  }",                                                            // 23
  "};",                                                             // 24
];
const CHAIN_CODE_SHORT = [
  "struct HashChain {",                                             // 0
  "  vector<list<pair<int,int>>> table;",                           // 1
  "  int hash(int key);                  // ← helper",               // 2
  "",                                                               // 3
  "  void insert(int key, int val) {",                              // 4
  "    auto& bucket = table[hash(key)];",                           // 5
  "    // update ถ้ามี key อยู่แล้ว, else push_back",                  // 6
  "    bucket.push_back({key, val});",                              // 7
  "  }",                                                            // 8
  "",                                                               // 9
  "  bool find(int key, int& out) {",                               // 10
  "    auto& bucket = table[hash(key)];",                           // 11
  "    // linear scan ใน bucket",                                    // 12
  "    return false;",                                              // 13
  "  }",                                                            // 14
  "};",                                                             // 15
];
const PROBE_CODE_FULL = [
  "struct HashProbe {",                                             // 0
  "  static const int SIZE = 11;",                                  // 1
  "  vector<int> keys, vals;",                                      // 2
  "  vector<bool> occupied;",                                       // 3
  "  HashProbe() : keys(SIZE, 0), vals(SIZE, 0), occupied(SIZE, false) {}", // 4
  "",                                                               // 5
  "  int hash(int key) { return key % SIZE; }",                     // 6
  "",                                                               // 7
  "  // Linear probing: ถ้า slot เต็ม → ลอง slot ถัดไป",              // 8
  "  void insert(int key, int val) {",                              // 9
  "    int h = hash(key);",                                         // 10
  "    while (occupied[h] && keys[h] != key)",                      // 11
  "      h = (h + 1) % SIZE;             // ← probe",               // 12
  "    keys[h] = key; vals[h] = val; occupied[h] = true;",          // 13
  "  }",                                                            // 14
  "",                                                               // 15
  "  bool find(int key, int& out) {",                               // 16
  "    int h = hash(key);",                                         // 17
  "    while (occupied[h]) {",                                      // 18
  "      if (keys[h] == key) { out = vals[h]; return true; }",      // 19
  "      h = (h + 1) % SIZE;",                                      // 20
  "    }",                                                          // 21
  "    return false;",                                              // 22
  "  }",                                                            // 23
  "};",                                                             // 24
];
const PROBE_CODE_SHORT = [
  "struct HashProbe {",                                             // 0
  "  vector<int> keys, vals;",                                      // 1
  "  vector<bool> occupied;",                                       // 2
  "  int hash(int key);                   // ← helper",              // 3
  "",                                                               // 4
  "  void insert(int key, int val) {",                              // 5
  "    int h = hash(key);",                                         // 6
  "    while (occupied[h] && keys[h] != key)",                      // 7
  "      h = (h + 1) % SIZE;            // linear probe",           // 8
  "    keys[h] = key; vals[h] = val; occupied[h] = true;",          // 9
  "  }",                                                            // 10
  "};",                                                             // 11
];

/* ============================================================
   CODE: Huffman Coding (Full + Short)
============================================================ */
const HUFFMAN_CODE_FULL = [
  "#include <queue>",                                               // 0
  "struct HNode {",                                                 // 1
  "  char ch; int freq;",                                           // 2
  "  HNode *l, *r;",                                                // 3
  "  HNode(char c, int f) : ch(c), freq(f), l(nullptr), r(nullptr) {}", // 4
  "};",                                                             // 5
  "",                                                               // 6
  "struct Cmp { bool operator()(HNode* a, HNode* b) { return a->freq > b->freq; } };", // 7
  "",                                                               // 8
  "HNode* buildTree(map<char,int>& freq) {",                        // 9
  "  priority_queue<HNode*, vector<HNode*>, Cmp> pq;",              // 10
  "  for (auto& [c, f] : freq) pq.push(new HNode(c, f));",          // 11
  "  while (pq.size() > 1) {",                                      // 12
  "    HNode* a = pq.top(); pq.pop();",                             // 13
  "    HNode* b = pq.top(); pq.pop();",                             // 14
  "    HNode* parent = new HNode(0, a->freq + b->freq);",           // 15
  "    parent->l = a; parent->r = b;",                              // 16
  "    pq.push(parent);",                                           // 17
  "  }",                                                            // 18
  "  return pq.top();",                                             // 19
  "}",                                                              // 20
  "",                                                               // 21
  "void getCodes(HNode* root, string code, map<char,string>& out) {", // 22
  "  if (!root) return;",                                           // 23
  "  if (!root->l && !root->r) {",                                  // 24
  "    out[root->ch] = code;",                                      // 25
  "    return;",                                                    // 26
  "  }",                                                            // 27
  "  getCodes(root->l, code + \"0\", out);",                        // 28
  "  getCodes(root->r, code + \"1\", out);",                        // 29
  "}",                                                              // 30
  "",                                                               // 31
  "map<char,string> huffmanCoding(map<char,int>& freq) {",          // 32
  "  HNode* root = buildTree(freq);",                               // 33
  "  map<char,string> codes;",                                      // 34
  "  getCodes(root, \"\", codes);",                                 // 35
  "  return codes;",                                                // 36
  "}",                                                              // 37
];
const HUFFMAN_CODE_SHORT = [
  "map<char,string> huffmanCoding(map<char,int>& freq) {",          // 0
  "  HNode* root = buildTree(freq);    // ← helper: min-heap merge", // 1
  "  map<char,string> codes;",                                      // 2
  "  getCodes(root, \"\", codes);      // ← helper: DFS traverse",  // 3
  "  return codes;                     // {ch → bit string}",       // 4
  "}",                                                              // 5
];



/* ============================================================
   AVL TREE
============================================================ */
function AVLViz() {
  const [vals, setVals] = useS8([30, 20, 40, 10, 25, 35, 50, 5]);
  const root = useM8(() => {
    let r = null;
    function ins(node, v) {
      if (!node) return { v, l: null, r: null, h: 1 };
      if (v < node.v) node.l = ins(node.l, v);
      else if (v > node.v) node.r = ins(node.r, v);
      const hl = node.l ? node.l.h : 0;
      const hr = node.r ? node.r.h : 0;
      node.h = 1 + Math.max(hl, hr);
      const bf = hl - hr;
      if (bf > 1 && v < node.l.v) return rotR(node);
      if (bf < -1 && v > node.r.v) return rotL(node);
      if (bf > 1 && v > node.l.v) { node.l = rotL(node.l); return rotR(node); }
      if (bf < -1 && v < node.r.v) { node.r = rotR(node.r); return rotL(node); }
      return node;
    }
    function rotR(y) { const x = y.l; y.l = x.r; x.r = y; fixH(y); fixH(x); return x; }
    function rotL(x) { const y = x.r; x.r = y.l; y.l = x; fixH(x); fixH(y); return y; }
    function fixH(n) { const hl = n.l ? n.l.h : 0; const hr = n.r ? n.r.h : 0; n.h = 1 + Math.max(hl, hr); }
    vals.forEach(v => { r = ins(r, v); });
    return r;
  }, [vals]);

  const layout = useM8(() => {
    const pos = {};
    function rec(node, l, r, d) {
      if (!node) return;
      const x = (l + r) / 2; pos[node.v] = { x, y: 40 + d * 60, h: node.h };
      rec(node.l, l, x, d + 1); rec(node.r, x, r, d + 1);
    }
    rec(root, 30, 580, 0);
    return pos;
  }, [root]);

  const edges = useM8(() => {
    const es = [];
    function rec(n) { if (!n) return; if (n.l) { es.push([n.v, n.l.v]); rec(n.l); } if (n.r) { es.push([n.v, n.r.v]); rec(n.r); } }
    rec(root); return es;
  }, [root]);

  const [input, setInput] = useS8('');
  return (
    <div className="dsv">
      <div className="ctrls">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="ตัวเลข เช่น 15,18" style={{ width: 160 }} />
        <button onClick={() => { const ns = input.split(',').map(s => +s.trim()).filter(n => !isNaN(n)); if (ns.length) { setVals([...vals, ...ns]); setInput(''); } }}>+ Insert</button>
        <button onClick={() => setVals([30, 20, 40, 10, 25, 35, 50, 5])}>🔄 Reset</button>
        <button onClick={() => setVals([])}>🗑️ Clear</button>
      </div>
      <svg width="610" height={Math.max(280, root ? 80 + 60 * height(root) : 100)} style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
        {edges.map(([a, b], i) => {
          const p1 = layout[a], p2 = layout[b];
          if (!p1 || !p2) return null;
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth="1.5" />;
        })}
        {Object.entries(layout).map(([v, p]) => (
          <g key={v}>
            <circle cx={p.x} cy={p.y} r="20" fill="var(--bg-3)" stroke="var(--accent)" strokeWidth="2" />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fill="var(--text-0)" fontWeight="600">{v}</text>
            <text x={p.x + 22} y={p.y - 12} fill="var(--accent-2)" fontSize="10">h={p.h}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
function height(n) { return n ? n.h : 0; }

Lessons8["avl-tree"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">AVL Tree — Self-balancing BST</div>
        BST ที่รับประกัน <b>balance factor (BF) ∈ {`{-1, 0, +1}`}</b> ทุก node<br />
        BF = height(left) − height(right) — ถ้า |BF| &gt; 1 → <b>rotate</b>
      </div>

      <h3>ทำไมต้อง balance?</h3>
      <p style={{ color: 'var(--text-1)' }}>BST ธรรมดา insert ตามลำดับ 1,2,3,4,5 → กลายเป็นเส้นตรง O(n)<br />AVL บังคับให้สูงต่ำกันไม่เกิน 1 → ทุก operation O(log n)</p>

      <h3>4 Cases ของ Rotation</h3>
      <table className="tbl">
        <thead><tr><th>Case</th><th>เมื่อ</th><th>Rotation</th></tr></thead>
        <tbody>
          <tr><td><b>LL</b></td><td>BF=+2, BF(left)≥0</td><td>Right rotate</td></tr>
          <tr><td><b>RR</b></td><td>BF=-2, BF(right)≤0</td><td>Left rotate</td></tr>
          <tr><td><b>LR</b></td><td>BF=+2, BF(left)&lt;0</td><td>Left-Right (rotate left ของ left ก่อน → rotate right)</td></tr>
          <tr><td><b>RL</b></td><td>BF=-2, BF(right)&gt;0</td><td>Right-Left (rotate right ของ right ก่อน → rotate left)</td></tr>
        </tbody>
      </table>

      <h3>🧪 ลอง insert ดู (balance ตัวเอง)</h3>
      <AVLViz />

      <WE8
        title="Insert 10, 20, 30 ใน AVL ที่ว่าง"
        problem="ดูว่าเกิด rotation ที่ไหน"
        steps={[
          { title: "Insert 10", body: "Tree: 10 (h=1, BF=0)\nไม่ต้อง rotate" },
          { title: "Insert 20", body: "Tree: 10 → r=20\nBF(10) = 0 - 1 = -1 ✓ ยัง balance" },
          { title: "Insert 30", body: "Tree: 10 → r=20 → r=30\nBF(10) = 0 - 2 = -2 ✗ ไม่ balance!\nเป็น <b>RR case</b> → Left rotate\nผลลัพธ์:\n        20\n       /  \\\n      10    30", why: "ทุก insert ต้องเช็ค BF ของบรรพบุรุษ" },
        ]}
        answer="Final tree: 20 เป็น root, 10 ซ้าย, 30 ขวา"
        takeaway="หลัง insert/delete ต้องเดินกลับขึ้นไป update height + เช็ค BF ตามทาง"
      />

      <h3>โค้ด AVL Insert + Rotations</h3>
      <CodeViewToggle8
        code={AVL_CODE_FULL}
        codeShort={AVL_CODE_SHORT}
        helperName="rotate/updateHeight/getBalance"
      />

      <CS8 title="AVL Tree" sections={[
        { label: "TIME", value: "Insert/Search/Delete: O(log n) garantee", mono: true },
        { label: "SPACE", value: "O(n) — เก็บทุก node + height" },
        { label: "VS RED-BLACK", value: "AVL: balance เคร่งกว่า → search เร็ว แต่ insert ช้า<br>RB: balance หลวมกว่า → insert/delete เร็วกว่า → ใช้ใน std::map" },
      ]} />

      <PF8 items={[
        { trap: "ลืม update height หลัง rotate", fix: "ต้อง update <b>y ก่อน x</b> (y กลายเป็นลูกของ x)" },
        { trap: "เช็ค BF แค่ node ที่ insert", fix: "ต้องเดินกลับขึ้น<b>ทุก parent</b> ตามทางจาก root ถึง insert point" },
        { trap: "LR case ใช้ rotate right อย่างเดียว", fix: "ต้อง 2 rotations: left ของ left child <b>ก่อน</b> right ของ unbalanced node" },
      ]} />

      <Quiz8 q="หลัง insert ลำดับ 30, 20, 10 ใน AVL — root จะเป็นใคร?"
        options={["30", "20", "10", "ต้อง rotate 2 ครั้ง"]}
        answer={1}
        explain="Insert 30 → 30. Insert 20 → 30(20,_). Insert 10 → unbalanced LL case → right rotate → root = 20"
      />
    </React.Fragment>
  );
};

/* ============================================================
   MST — Prim & Kruskal
============================================================ */
function PrimViz() {
  const edges = [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'F', 3]];
  const positions = { A: { x: 60, y: 80 }, B: { x: 200, y: 50 }, C: { x: 160, y: 160 }, D: { x: 320, y: 140 }, E: { x: 260, y: 250 }, F: { x: 420, y: 220 } };
  const [step, setStep] = useS8(0);
  const trace = useM8(() => {
    const adj = {};
    Object.keys(positions).forEach(k => adj[k] = []);
    edges.forEach(([u, v, w]) => { adj[u].push({ to: v, w }); adj[v].push({ to: u, w }); });
    const log = [];
    const inMST = new Set(['A']);
    const mstEdges = [];
    log.push({ inMST: [...inMST], mstEdges: [...mstEdges], cand: [], picked: null, note: "Start at A" });
    while (inMST.size < Object.keys(positions).length) {
      // collect candidates
      const cand = [];
      for (const u of inMST) for (const e of adj[u]) if (!inMST.has(e.to)) cand.push([u, e.to, e.w]);
      cand.sort((a, b) => a[2] - b[2]);
      const [u, v, w] = cand[0];
      log.push({ inMST: [...inMST], mstEdges: [...mstEdges], cand: [...cand], picked: [u, v, w], note: `Min cross edge: ${u}-${v} (w=${w})` });
      inMST.add(v); mstEdges.push([u, v, w]);
    }
    log.push({ inMST: [...inMST], mstEdges: [...mstEdges], cand: [], picked: null, note: `MST complete — total = ${mstEdges.reduce((s, e) => s + e[2], 0)}` });
    return log;
  }, []);
  const cur = trace[step] || trace[0];
  const mstSet = new Set(cur.mstEdges.map(([u, v]) => `${u}-${v}`).concat(cur.mstEdges.map(([u, v]) => `${v}-${u}`)));
  const pickedKey = cur.picked ? `${cur.picked[0]}-${cur.picked[1]}` : null;

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {step + 1}/{trace.length}</span>
        <button onClick={() => setStep(Math.min(trace.length - 1, step + 1))} disabled={step >= trace.length - 1}>▶</button>
      </div>
      <div className="callout" style={{ marginBottom: 10 }}>{cur.note}</div>
      <svg width="480" height="320" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
        {edges.map(([u, v, w], i) => {
          const a = positions[u], b = positions[v];
          const inMst = mstSet.has(`${u}-${v}`);
          const isPicked = pickedKey && (pickedKey === `${u}-${v}` || pickedKey === `${v}-${u}`);
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isPicked ? '#fbbf24' : inMst ? '#10b981' : '#475569'} strokeWidth={isPicked || inMst ? 3 : 1.5} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} fill="#cbd5e1" fontSize="11" fontFamily="monospace">{w}</text>
            </g>
          );
        })}
        {Object.entries(positions).map(([id, p]) => (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r="18" fill={cur.inMST.includes(id) ? '#10b981' : 'var(--bg-3)'} stroke="var(--accent)" strokeWidth="2" />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fill="#fff" fontWeight="600">{id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

Lessons8["mst"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Minimum Spanning Tree (MST)</div>
        ในกราฟ weighted connected undirected — หา <b>tree ที่เชื่อมทุก node ด้วย weight รวมน้อยสุด</b><br />
        มี V-1 edges
      </div>

      <h3>2 อัลกอริทึมหลัก</h3>
      <table className="tbl">
        <thead><tr><th></th><th>Prim</th><th>Kruskal</th></tr></thead>
        <tbody>
          <tr><td>เริ่มจาก</td><td>node เดียว</td><td>edge เรียงตาม weight</td></tr>
          <tr><td>ขยายโดย</td><td>เพิ่ม min-edge ที่ออกจาก MST set</td><td>เพิ่ม edge ที่ไม่ทำให้เกิด cycle</td></tr>
          <tr><td>Data structure</td><td>Min-heap</td><td>Union-Find (DSU)</td></tr>
          <tr><td>Time</td><td>O((V+E) log V)</td><td>O(E log E)</td></tr>
          <tr><td>เหมาะ</td><td>dense graph</td><td>sparse graph</td></tr>
        </tbody>
      </table>

      <h3>🌳 Prim's Algorithm — visualization</h3>
      <PrimViz />

      <h3>Prim's MST — C++ Code</h3>
      <CodeViewToggle8
        code={PRIM_CODE_FULL}
        helperName="std::priority_queue"
      />

      <h3>Kruskal Pseudocode</h3>
      <pre className="code">{`Kruskal(graph):
  sort edges by weight ascending
  init Union-Find: each node = own set
  for (u, v, w) in sorted edges:
    if find(u) != find(v):       // ไม่เกิด cycle
      union(u, v)
      MST.add((u, v, w))
    if MST.size == V-1: break`}</pre>

      <WE8
        title="Kruskal กับ edges: [(A-B,4),(A-C,2),(B-C,1),(B-D,5),(C-D,8),(D-E,3)]"
        problem="หา MST"
        steps={[
          { title: "Step 1: เรียง edges", body: "1. B-C (1)\n2. A-C (2)\n3. D-E (3)\n4. A-B (4)\n5. B-D (5)\n6. C-D (8)" },
          { title: "Step 2: B-C (1)", body: "find(B)=B, find(C)=C → ต่างกัน → <b>เพิ่ม</b>\nMST = {B-C}" },
          { title: "Step 3: A-C (2)", body: "find(A)=A, find(C)={B,C} → ต่าง → <b>เพิ่ม</b>\nMST = {B-C, A-C}" },
          { title: "Step 4: D-E (3)", body: "find(D)=D, find(E)=E → ต่าง → <b>เพิ่ม</b>\nMST = {B-C, A-C, D-E}" },
          { title: "Step 5: A-B (4)", body: "find(A)={A,B,C}, find(B)={A,B,C} → <b>เท่ากัน!</b> → cycle → <b>ข้าม</b>" },
          { title: "Step 6: B-D (5)", body: "find(B)={A,B,C}, find(D)={D,E} → ต่าง → <b>เพิ่ม</b>\nMST = {B-C, A-C, D-E, B-D} → ครบ V-1=4 edges" },
        ]}
        answer="MST edges: B-C(1) + A-C(2) + D-E(3) + B-D(5) = <b>weight รวม 11</b>"
        takeaway="Kruskal ใช้ Union-Find เพื่อตรวจ cycle อย่างเร็ว — find+union เกือบ O(1) ต่อ operation"
      />

      <CS8 title="MST" sections={[
        { label: "PROPERTIES", value: "1. ครอบคลุมทุก node (spanning)<br>2. ไม่มี cycle (tree)<br>3. V-1 edges<br>4. weight รวมน้อยสุด" },
        { label: "PRIM vs KRUSKAL", value: "Prim: เริ่ม node เดียว ขยายออก<br>Kruskal: ดู edge ทั่วโลก เรียงตาม weight" },
        { label: "APPLICATIONS", value: "Network design (cable, road)<br>Cluster analysis<br>Approximation TSP" },
      ]} />

      <PF8 items={[
        { trap: "MST มี cycle ได้", fix: "ผิด! MST = tree → ไม่มี cycle เป็นข้อบังคับ" },
        { trap: "Kruskal: เลือก edge ตามลำดับโดยไม่เช็ค cycle", fix: "ต้องเช็คด้วย Union-Find ก่อนเพิ่ม — ไม่งั้นเกิด cycle" },
        { trap: "บอกว่า MST unique เสมอ", fix: "<b>ไม่!</b> ถ้ามี edge weight ซ้ำ อาจมี MST หลายแบบที่ weight รวมเท่ากัน" },
      ]} />

      <Quiz8 q="กราฟมี V=10, E=15 ควรใช้ Prim หรือ Kruskal?"
        options={["Prim — ใช้ min-heap", "Kruskal — sparse graph", "ใช้อันไหนก็ได้", "BFS"]}
        answer={1}
        explain="E ≈ V → sparse → Kruskal เหมาะกว่า (E log E ≈ 15 × 4)"
      />
    </React.Fragment>
  );
};

/* ============================================================
   KMP / Rabin-Karp — String Matching
============================================================ */
function KMPViz() {
  const text = "ABABDABACDABABCABAB";
  const pat = "ABABCABAB";
  const lps = useM8(() => {
    const n = pat.length, l = Array(n).fill(0);
    let len = 0, i = 1;
    while (i < n) {
      if (pat[i] === pat[len]) { len++; l[i++] = len; }
      else if (len > 0) len = l[len - 1];
      else l[i++] = 0;
    }
    return l;
  }, [pat]);
  const trace = useM8(() => {
    const log = [];
    let i = 0, j = 0;
    while (i < text.length) {
      log.push({ i, j, action: text[i] === pat[j] ? 'match' : 'mismatch' });
      if (text[i] === pat[j]) { i++; j++; if (j === pat.length) { log.push({ i, j, action: 'found', pos: i - j }); j = lps[j - 1]; } }
      else if (j > 0) j = lps[j - 1];
      else i++;
      if (log.length > 30) break;
    }
    return log;
  }, []);
  const [step, setStep] = useS8(0);
  const cur = trace[step] || trace[0];

  return (
    <div className="dsv">
      <div className="ctrls">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>◀</button>
        <span style={{ color: 'var(--text-2)' }}>step {step + 1}/{trace.length}</span>
        <button onClick={() => setStep(Math.min(trace.length - 1, step + 1))} disabled={step >= trace.length - 1}>▶</button>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2 }}>
        <div>
          {text.split('').map((c, idx) => (
            <span key={idx} style={{
              padding: '2px 6px',
              background: idx === cur.i ? '#fbbf24' : 'transparent',
              color: idx === cur.i ? '#000' : 'var(--text-0)',
              borderRadius: 3
            }}>{c}</span>
          ))}
        </div>
        <div style={{ paddingLeft: (cur.i - cur.j) * 18 }}>
          {pat.split('').map((c, idx) => (
            <span key={idx} style={{
              padding: '2px 6px',
              background: idx === cur.j ? '#fbbf24' : idx < cur.j ? 'rgba(16,185,129,0.3)' : 'transparent',
              color: idx === cur.j ? '#000' : 'var(--text-1)',
              borderRadius: 3
            }}>{c}</span>
          ))}
        </div>
        <div style={{ marginTop: 10, color: 'var(--text-2)', fontSize: 12 }}>
          i={cur.i}, j={cur.j}, action=<b style={{ color: cur.action === 'match' ? '#10b981' : cur.action === 'found' ? 'var(--accent-2)' : '#f87171' }}>{cur.action}</b>
          {cur.action === 'found' && <> at pos <b>{cur.pos}</b></>}
        </div>
        <div style={{ marginTop: 10 }}>
          LPS array: [{lps.join(', ')}]
        </div>
      </div>
    </div>
  );
}

Lessons8["string-match"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">String Matching — KMP & Rabin-Karp</div>
        หา pattern P ใน text T ทุกตำแหน่ง — ปัญหาพื้นฐานของ search, compiler, bioinformatics
      </div>

      <h3>Naive Approach — O(nm)</h3>
      <pre className="code">{`// n = |T|, m = |P|
for i = 0..n-m:
  if T[i..i+m-1] == P:
    found at i
// worst: T="aaaaaa", P="aab" → O(nm)`}</pre>

      <h3>1. KMP (Knuth-Morris-Pratt) — O(n + m)</h3>
      <p>Insight: ใช้ <b>LPS array</b> (Longest Proper Prefix which is also Suffix) เพื่อหลีกเลี่ยงการเริ่มใหม่</p>
      <CodeViewToggle8
        code={KMP_CODE_FULL}
        codeShort={KMP_CODE_SHORT}
        helperName="computeLPS()"
      />

      <h3>🧪 KMP Animation</h3>
      <KMPViz />

      <h3>2. Rabin-Karp — O(n + m) avg, O(nm) worst</h3>
      <p>Insight: ใช้ <b>rolling hash</b> — เทียบ hash ของ window แทนเทียบทุกตัว</p>
      <pre className="code">{`// hash("abc") = a·b^2 + b·b^1 + c·b^0  (b = base, mod p)
hash_p = hash(P)
hash_t = hash(T[0..m-1])

for i = 0..n-m:
  if hash_t == hash_p:
    if T[i..i+m-1] == P: found(i)    // confirm — กัน collision
  hash_t = rollHash(hash_t, T[i], T[i+m])   // slide window O(1)`}</pre>

      <CS8 title="String Matching" sections={[
        { label: "NAIVE", value: "O(nm) worst<br>เขียนง่ายแต่ช้า", mono: true },
        { label: "KMP", value: "O(n + m) garantee<br>preprocessing LPS O(m)<br>ดีเมื่อ pattern ยาว", mono: true },
        { label: "RABIN-KARP", value: "O(n + m) avg<br>O(nm) worst — collision\nดีสำหรับ multi-pattern", mono: true },
        { label: "REAL WORLD", value: "grep, ctrl+F, plagiarism, DNA matching" },
      ]} />

      <PF8 items={[
        { trap: "Rabin-Karp ไม่ confirm หลัง hash match", fix: "ต้องเทียบ string จริงด้วย — เพราะ hash collision เกิดได้" },
        { trap: "KMP LPS = length of pattern เสมอ", fix: "LPS = ความยาวของ proper prefix-suffix ที่ตรงกันยาวสุด — ไม่ใช่ความยาว pattern" },
      ]} />

      <Quiz8 q="หา 'AB' ใน 'ABABABAB' — KMP เจอกี่ครั้ง?"
        options={["1", "2", "3", "4"]}
        answer={3}
        explain="ตำแหน่ง 0, 2, 4, 6 — เจอ 4 ครั้ง"
      />
    </React.Fragment>
  );
};

/* ============================================================
   HASH COLLISION — Linear Probing
============================================================ */
function ChainingViz() {
  const SIZE = 7;
  const [buckets, setBuckets] = useS8(Array.from({ length: SIZE }, () => []));
  const [input, setInput] = useS8('');
  const [flash, setFlash] = useS8({ bucket: -1, val: null });

  const insert = (val) => {
    const h = val % SIZE;
    const newB = buckets.map(b => [...b]);
    if (!newB[h].includes(val)) newB[h].push(val);
    setBuckets(newB);
    setFlash({ bucket: h, val });
    setTimeout(() => setFlash({ bucket: -1, val: null }), 800);
  };

  return (
    <div className="dsv">
      <div className="ctrls">
        <input type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="value" style={{ width: 80 }} />
        <button onClick={() => { const v = +input; if (!isNaN(v)) { insert(v); setInput(''); } }} style={{ background: 'var(--accent)', color: '#000', fontWeight: 600 }}>+ Insert</button>
        <button onClick={() => { setBuckets(Array.from({ length: SIZE }, () => [])); setFlash({ bucket: -1, val: null }); }}>🗑️ Clear</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>hash(k) = k mod {SIZE}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
        {buckets.map((bucket, i) => {
          const isFlash = flash.bucket === i;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ minWidth: 30, padding: '4px 8px', background: isFlash ? 'var(--accent)' : 'var(--bg-3)', color: isFlash ? '#000' : 'var(--text-2)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                [{i}]
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                {bucket.length === 0 ? (
                  <span style={{ color: 'var(--text-3)', fontSize: 12, fontStyle: 'italic' }}>(empty)</span>
                ) : bucket.map((v, j) => (
                  <React.Fragment key={j}>
                    {j > 0 && <span style={{ color: 'var(--accent-2)', fontSize: 16 }}>→</span>}
                    <div style={{
                      padding: '4px 10px',
                      background: flash.val === v && isFlash ? '#10b981' : 'rgba(94,234,212,0.2)',
                      border: '1px solid var(--accent-2)',
                      borderRadius: 4, fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                      color: flash.val === v && isFlash ? '#000' : 'var(--text-0)',
                      transition: 'all 0.25s'
                    }}>{v}</div>
                  </React.Fragment>
                ))}
              </div>
              {bucket.length > 1 && <span style={{ fontSize: 11, color: '#fbbf24' }}>⚡ collision (len {bucket.length})</span>}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 Chaining: ทุก bucket เก็บเป็น <b>linked list</b> — collision ก็แค่ append ตอนท้าย, search ต้องเดิน chain
      </div>
    </div>
  );
}

function ProbingViz() {
  const SIZE = 11;
  const [table, setTable] = useS8(Array(SIZE).fill(null));
  const [input, setInput] = useS8('');
  const [trace, setTrace] = useS8([]);

  const insert = (val) => {
    const h0 = val % SIZE;
    const newT = [...table];
    const log = [{ pos: h0, h0, val, action: 'start' }];
    let i = 0;
    while (i < SIZE) {
      const pos = (h0 + i) % SIZE;
      if (newT[pos] === null) {
        newT[pos] = val;
        log.push({ pos, h0, val, action: 'placed', step: i });
        break;
      } else {
        log.push({ pos, h0, val, action: 'collision', step: i });
      }
      i++;
    }
    setTable(newT); setTrace(log);
  };

  return (
    <div className="dsv">
      <div className="ctrls">
        <input type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="value" style={{ width: 80 }} />
        <button onClick={() => { const v = +input; if (!isNaN(v)) { insert(v); setInput(''); } }}>+ Insert</button>
        <button onClick={() => { setTable(Array(SIZE).fill(null)); setTrace([]); }}>🗑️ Clear</button>
        <span style={{ color: 'var(--text-2)' }}>hash(k) = k mod {SIZE}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        {table.map((v, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{i}</div>
            <div style={{ width: 44, height: 44, background: v === null ? 'var(--bg-2)' : 'var(--accent-2)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', color: v === null ? 'var(--text-3)' : '#000', fontWeight: 600 }}>{v ?? '-'}</div>
          </div>
        ))}
      </div>
      {trace.length > 0 && (
        <div style={{ background: 'var(--bg-1)', padding: 10, borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
          {trace.map((t, i) => (
            <div key={i} style={{ color: t.action === 'placed' ? '#10b981' : t.action === 'collision' ? '#fbbf24' : 'var(--text-2)' }}>
              {t.action === 'start' && `hash(${t.val}) = ${t.h0}`}
              {t.action === 'collision' && `  pos ${t.pos} occupied → probe next (step ${t.step})`}
              {t.action === 'placed' && `  ✓ placed at pos ${t.pos} (after ${t.step} probes)`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Lessons8["hash-collision"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Hash Table Collision Handling</div>
        เมื่อ 2 keys hash ไปช่องเดียวกัน — ต้องจัดการ! มี 2 แนวคิดหลัก
      </div>

      <h3>วิธี 1: Chaining</h3>
      <p>แต่ละช่องเป็น linked list — ใส่ key ที่ชนกันต่อท้าย</p>
      <CodeViewToggle8
        code={CHAIN_CODE_FULL}
        codeShort={CHAIN_CODE_SHORT}
        helperName="hash()"
      />

      <h4 style={{ color: 'var(--accent-2)' }}>🎬 Interactive Chaining — ลอง insert ดู bucket ยาวขึ้น</h4>
      <ChainingViz />

      <h3>วิธี 2: Open Addressing (Probing)</h3>
      <p>ใส่ในช่องอื่นถ้าช่องเดิมเต็ม — มี 3 แบบ</p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Linear Probing:</b> ลองช่องถัดไป → <code>(h + i) mod m</code></li>
        <li><b>Quadratic Probing:</b> ลองห่างขึ้นเรื่อย ๆ → <code>(h + i²) mod m</code></li>
        <li><b>Double Hashing:</b> ใช้ hash ตัวที่ 2 → <code>(h₁ + i·h₂) mod m</code></li>
      </ul>

      <h3>🧪 Linear Probing Live Demo</h3>
      <p>ลอง insert: 18, 41, 22, 44, 59, 32 (size=11, hash=k%11)</p>
      <CodeViewToggle8
        code={PROBE_CODE_FULL}
        codeShort={PROBE_CODE_SHORT}
        helperName="hash() + probe loop"
      />
      <ProbingViz />

      <WE8
        title="Insert 18, 41, 22, 44 ด้วย Linear Probing, m=11"
        problem="แสดงตำแหน่งที่ใส่"
        steps={[
          { title: "Insert 18", body: "hash(18) = 18 mod 11 = <b>7</b>\nช่อง 7 ว่าง → ใส่ที่ 7" },
          { title: "Insert 41", body: "hash(41) = 41 mod 11 = <b>8</b>\nช่อง 8 ว่าง → ใส่ที่ 8" },
          { title: "Insert 22", body: "hash(22) = 22 mod 11 = <b>0</b>\nช่อง 0 ว่าง → ใส่ที่ 0" },
          { title: "Insert 44", body: "hash(44) = 44 mod 11 = <b>0</b>\nช่อง 0 เต็ม (มี 22) → probe!\nช่อง 1 ว่าง → ใส่ที่ <b>1</b>" },
        ]}
        answer="Table: [22, 44, _, _, _, _, _, 18, 41, _, _]"
        takeaway="Linear probing ทำให้เกิด <b>clustering</b> — ช่องติดกันยาวขึ้น → search ช้า"
      />

      <h3>Load Factor (α)</h3>
      <p>α = n/m (จำนวน items / จำนวนช่อง)</p>
      <table className="tbl">
        <thead><tr><th>α</th><th>Chaining avg probes</th><th>Linear Probing avg probes</th></tr></thead>
        <tbody>
          <tr><td>0.5</td><td>1.5</td><td>2.5</td></tr>
          <tr><td>0.75</td><td>1.875</td><td>8.5</td></tr>
          <tr><td>0.9</td><td>1.95</td><td>50.5</td></tr>
        </tbody>
      </table>
      <p style={{ color: 'var(--text-1)' }}>⚠️ Open addressing แย่มากเมื่อ α &gt; 0.7 → ต้อง <b>rehash</b> (สร้าง table ใหญ่กว่าเดิม 2 เท่า)</p>

      <CS8 title="Hash Collision" sections={[
        { label: "CHAINING", value: "+ ง่าย, ลบง่าย<br>+ ทน α สูง<br>− memory เพิ่มจาก pointer<br>− cache ไม่ friendly" },
        { label: "OPEN ADDRESSING", value: "+ cache friendly<br>+ ไม่ใช้ pointer<br>− ลบยาก (ต้อง mark deleted)<br>− แย่เมื่อ α สูง" },
        { label: "REAL WORLD", value: "Python dict: open addressing<br>Java HashMap: chaining + tree when ยาว<br>C++ unordered_map: chaining" },
      ]} />

      <PF8 items={[
        { trap: "ลบใน open addressing แค่ set = null", fix: "ผิด! ต้อง mark เป็น 'deleted' (tombstone) — ไม่งั้น search หลังจากนั้นจะหยุดผิด" },
        { trap: "α &gt; 1 ใน open addressing", fix: "เป็นไปไม่ได้! ทุกช่องเต็ม → ต้อง rehash ก่อน" },
        { trap: "Linear probing ไม่มี clustering", fix: "<b>มี!</b> เรียก primary clustering — quadratic probing แก้ปัญหานี้" },
      ]} />

      <Quiz8 q="ถ้า table size=10, hash(k)=k%10 — insert 15, 25, 35 ตามลำดับ ด้วย linear probing ตำแหน่งของ 35 คือ?"
        options={["5", "6", "7", "0"]}
        answer={2}
        explain="15→pos 5; 25→pos 5 ชน→pos 6; 35→pos 5 ชน→6 ชน→ <b>7</b>"
      />
    </React.Fragment>
  );
};

/* ============================================================
   HUFFMAN CODING
============================================================ */
function HuffmanViz() {
  const freq = { A: 5, B: 9, C: 12, D: 13, E: 16, F: 45 };
  const tree = useM8(() => {
    const nodes = Object.entries(freq).map(([c, f]) => ({ c, f, l: null, r: null }));
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.f - b.f);
      const a = nodes.shift(), b = nodes.shift();
      nodes.push({ c: a.c + b.c, f: a.f + b.f, l: a, r: b });
    }
    return nodes[0];
  }, []);
  const codes = useM8(() => {
    const result = {};
    function rec(n, code) {
      if (!n.l && !n.r) { result[n.c] = code || '0'; return; }
      if (n.l) rec(n.l, code + '0');
      if (n.r) rec(n.r, code + '1');
    }
    rec(tree, '');
    return result;
  }, [tree]);

  function renderNode(n, x, y, dx) {
    if (!n) return null;
    const isLeaf = !n.l && !n.r;
    return (
      <g>
        {n.l && <line x1={x} y1={y} x2={x - dx} y2={y + 60} stroke="#475569" strokeWidth="1.5" />}
        {n.l && <text x={x - dx / 2 - 4} y={y + 30} fill="var(--accent)" fontSize="10">0</text>}
        {n.r && <line x1={x} y1={y} x2={x + dx} y2={y + 60} stroke="#475569" strokeWidth="1.5" />}
        {n.r && <text x={x + dx / 2 + 4} y={y + 30} fill="var(--accent)" fontSize="10">1</text>}
        {n.l && renderNode(n.l, x - dx, y + 60, dx / 2)}
        {n.r && renderNode(n.r, x + dx, y + 60, dx / 2)}
        <circle cx={x} cy={y} r="18" fill={isLeaf ? '#10b981' : 'var(--bg-3)'} stroke="var(--accent)" strokeWidth="2" />
        <text x={x} y={y - 2} textAnchor="middle" fill={isLeaf ? '#000' : 'var(--text-0)'} fontSize="11" fontWeight="700">{isLeaf ? n.c : ''}</text>
        <text x={x} y={y + 10} textAnchor="middle" fill={isLeaf ? '#000' : 'var(--accent-2)'} fontSize="9">{n.f}</text>
      </g>
    );
  }

  return (
    <div className="dsv">
      <div style={{ background: 'var(--bg-1)', padding: 10, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>frequencies:</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(freq).map(([c, f]) => (
            <div key={c} style={{ fontFamily: 'monospace' }}>{c}: <b>{f}</b></div>
          ))}
        </div>
      </div>
      <svg width="500" height="280" style={{ background: 'var(--bg-1)', borderRadius: 8, display: 'block' }}>
        {renderNode(tree, 250, 30, 120)}
      </svg>
      <div style={{ marginTop: 10, background: 'var(--bg-1)', padding: 10, borderRadius: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>Huffman codes:</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6 }}>
          {Object.entries(codes).sort().map(([c, code]) => (
            <div key={c} style={{ fontFamily: 'monospace', padding: '4px 8px', background: 'var(--bg-2)', borderRadius: 4 }}>
              <b style={{ color: '#10b981' }}>{c}</b> → {code}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Lessons8["huffman"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">Huffman Coding — Variable-length encoding</div>
        เข้ารหัสตัวอักษรด้วยจำนวน bit ไม่เท่ากัน:<br />
        ตัวที่<b>ใช้บ่อย</b> → รหัสสั้น &nbsp; ตัวที่<b>ใช้น้อย</b> → รหัสยาว<br />
        → ขนาดไฟล์ลดลง (lossless compression)
      </div>

      <h3>หลักการ — Greedy + Tree</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>นับความถี่ของแต่ละตัวอักษร</li>
        <li>สร้าง <b>min-heap</b> ของ node (1 node = 1 ตัวอักษร + freq)</li>
        <li>ดึง 2 ตัวความถี่ต่ำสุด → รวมเป็น node ใหม่ (freq รวม) → ใส่กลับใน heap</li>
        <li>ทำซ้ำจนเหลือ 1 node = root ของต้นไม้</li>
        <li>เดิน tree: ซ้าย=0, ขวา=1 → ได้รหัสของแต่ละตัวอักษร</li>
      </ol>

      <h3>🧪 Visualization</h3>
      <HuffmanViz />

      <h3>Huffman — C++ Code</h3>
      <CodeViewToggle8
        code={HUFFMAN_CODE_FULL}
        codeShort={HUFFMAN_CODE_SHORT}
        helperName="buildTree() + getCodes()"
      />

      <WE8
        title="Huffman กับ string 'BCAADDDCCACACAC' (freq: A=5, B=1, C=6, D=3)"
        problem="สร้าง code"
        steps={[
          { title: "Step 1: build heap", body: "[B:1, D:3, A:5, C:6]" },
          { title: "Step 2: combine 2 ตัวน้อยสุด", body: "B(1) + D(3) = BD(4)\nheap: [BD:4, A:5, C:6]" },
          { title: "Step 3: combine ต่อ", body: "BD(4) + A(5) = BDA(9)\nheap: [C:6, BDA:9]" },
          { title: "Step 4: combine สุดท้าย", body: "C(6) + BDA(9) = root(15)\n         root\n        /    \\\n       C      BDA\n             /    \\\n            BD     A\n           / \\\n          B   D" },
          { title: "Step 5: อ่าน code", body: "C: <b>0</b>\nA: <b>11</b>\nB: <b>100</b>\nD: <b>101</b>" },
          { title: "ลองเข้ารหัส 'CAB'", body: "C → 0, A → 11, B → 100\nรวม: <b>011100</b> (6 bits)\n\nถ้าใช้ fixed-length (2 bits/ตัว) = 6 bits เท่ากัน\nแต่กับ string ยาวจริง Huffman ดีกว่ามาก" },
        ]}
        answer="C=0, A=11, B=100, D=101 — total bits: 5×2 + 1×3 + 6×1 + 3×3 = <b>28 bits</b><br>ถ้า fixed 2 bits: 15 × 2 = 30 bits → Huffman ประหยัด 2 bits"
        takeaway="ยิ่งความถี่ต่างกันมาก Huffman ยิ่งประหยัด — uniform freq → ไม่ช่วย"
      />

      <h3>คุณสมบัติพิเศษ — Prefix-free</h3>
      <p style={{ color: 'var(--text-1)' }}>ไม่มี code ใดเป็น prefix ของ code อื่น → decode แบบ unique<br />
        เช่น A=0, B=10, C=11 → "010" = AB (ไม่กำกวม)<br />
        แต่ A=0, B=01 → "01" กำกวม (อาจเป็น AB หรือ B)
      </p>

      <CS8 title="Huffman Coding" sections={[
        { label: "TIME", value: "O(n log n) — n = unique chars<br>เนื่องจาก heap operations", mono: true },
        { label: "PROPERTIES", value: "1. Greedy + optimal<br>2. Variable-length<br>3. Prefix-free<br>4. Lossless" },
        { label: "REAL WORLD", value: "ZIP, GZIP<br>JPEG (DCT + Huffman)<br>MP3<br>PNG (deflate)" },
      ]} />

      <PF8 items={[
        { trap: "บอกว่า Huffman ดีกว่า fixed-length เสมอ", fix: "ผิด — ถ้า freq เท่ากันหมด → Huffman ≈ fixed-length" },
        { trap: "Huffman ใช้ DP", fix: "ไม่ — เป็น <b>Greedy</b> (เลือก 2 ตัวน้อยสุด)" },
        { trap: "Decode โดยไม่มี tree", fix: "ต้องส่ง tree (หรือ frequency table) ไปด้วย — ไม่งั้น decode ไม่ได้" },
      ]} />

      <Quiz8 q="ถ้า freq: A=10, B=10, C=10, D=10 — Huffman ให้รหัสยาวเฉลี่ยกี่ bits?"
        options={["1 bit", "2 bits", "3 bits", "4 bits"]}
        answer={1}
        explain="freq เท่ากัน → tree balance → 4 ตัว → 2 bits ต่อตัว (เท่ากับ fixed-length)"
      />
    </React.Fragment>
  );
};

window.LessonsPart8 = Lessons8;
