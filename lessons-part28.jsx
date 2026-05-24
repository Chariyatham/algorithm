/* Lessons Part 28 — Missing Algorithms (university-level extra) — COMPLETE EDITION
   Sparse Table, 2-SAT, LCA, String Hashing, Game Theory,
   Convex Hull, A*, FFT, Mo's, HLD/Centroid, Treap
   ทุกบทมี viz/animation + 2-3 quizzes + pitfalls */

const { useState: useS28, useMemo: useM28, useEffect: useE28 } = React;
const { Quiz: Quiz28 } = window.LessonComponents;
const CodeViewToggle28 = window.CodeViewToggle;

const Lessons28 = {};

/* ============================================================
   CODE: Sparse Table (Full + Short)
============================================================ */
const SPARSE_FULL = [
  "// Sparse Table for range min (idempotent op)",                  // 0
  "// preprocess O(n log n), query O(1)",                           // 1
  "const int LOG = 20;",                                            // 2
  "vector<vector<int>> st;       // st[k][i] = min of a[i..i+2^k-1]",// 3
  "vector<int> lg;                // floor(log2(i))",                // 4
  "",                                                               // 5
  "void buildSparseTable(vector<int>& a) {",                        // 6
  "  int n = a.size();",                                            // 7
  "  lg.assign(n + 1, 0);",                                         // 8
  "  for (int i = 2; i <= n; i++) lg[i] = lg[i/2] + 1;",            // 9
  "  st.assign(LOG, vector<int>(n));",                              // 10
  "  st[0] = a;",                                                   // 11
  "  for (int k = 1; (1 << k) <= n; k++)",                          // 12
  "    for (int i = 0; i + (1 << k) <= n; i++)",                    // 13
  "      st[k][i] = min(st[k-1][i],",                               // 14
  "                     st[k-1][i + (1 << (k-1))]);",               // 15
  "}",                                                              // 16
  "",                                                               // 17
  "int rangeMin(int l, int r) {",                                   // 18
  "  int k = lg[r - l + 1];",                                       // 19
  "  return min(st[k][l], st[k][r - (1 << k) + 1]);",               // 20
  "}",                                                              // 21
];
const SPARSE_SHORT = [
  "buildSparseTable(a);              // ← helper: O(n log n)",      // 0
  "int ans = rangeMin(l, r);         // ← helper: O(1) per query",  // 1
];

/* ============================================================
   CODE: 2-SAT (Full + Short)
============================================================ */
const TWO_SAT_FULL = [
  "// 2-SAT via implication graph + Tarjan SCC",                    // 0
  "// var i ∈ {0..n-1} encoded as: i (true), i+n (false)",          // 1
  "struct TwoSAT {",                                                // 2
  "  int n;",                                                       // 3
  "  vector<vector<int>> adj, adjT;",                               // 4
  "  TwoSAT(int n) : n(n), adj(2*n), adjT(2*n) {}",                 // 5
  "",                                                               // 6
  "  void addClause(int a, bool va, int b, bool vb) {",             // 7
  "    int la = a + (va ? 0 : n);",                                 // 8
  "    int lb = b + (vb ? 0 : n);",                                 // 9
  "    int na = a + (va ? n : 0);",                                 // 10
  "    int nb = b + (vb ? n : 0);",                                 // 11
  "    // (a or b) ⇒ (¬a → b) and (¬b → a)",                        // 12
  "    adj[na].push_back(lb); adjT[lb].push_back(na);",             // 13
  "    adj[nb].push_back(la); adjT[la].push_back(nb);",             // 14
  "  }",                                                            // 15
  "",                                                               // 16
  "  vector<bool> assignment;",                                     // 17
  "  vector<int> comp;",                                            // 18
  "",                                                               // 19
  "  bool solve() {",                                               // 20
  "    runSCC(adj, adjT, comp);          // ← Kosaraju or Tarjan",  // 21
  "    assignment.assign(n, false);",                               // 22
  "    for (int i = 0; i < n; i++) {",                              // 23
  "      if (comp[i] == comp[i + n]) return false;  // UNSAT",      // 24
  "      assignment[i] = comp[i] > comp[i + n];",                   // 25
  "    }",                                                          // 26
  "    return true;",                                               // 27
  "  }",                                                            // 28
  "};",                                                             // 29
];
const TWO_SAT_SHORT = [
  "TwoSAT sat(n);",                                                 // 0
  "for (auto& cl : clauses)",                                       // 1
  "  sat.addClause(cl.a, cl.va, cl.b, cl.vb); // ← helper",          // 2
  "if (sat.solve())                          // ← helper: SCC",     // 3
  "  // sat.assignment[i] = value",                                 // 4
  "else /* UNSAT */;",                                              // 5
];

/* ============================================================
   CODE: LCA Binary Lifting (Full + Short)
============================================================ */
const LCA_FULL = [
  "// Binary lifting LCA — preprocess O(n log n), query O(log n)", // 0
  "const int LOG = 20;",                                            // 1
  "vector<vector<int>> up;",                                        // 2
  "vector<int> depth;",                                              // 3
  "",                                                                // 4
  "void dfsLCA(int u, int p, int d, vector<vector<int>>& adj) {",  // 5
  "  up[0][u] = p; depth[u] = d;",                                  // 6
  "  for (int v : adj[u]) if (v != p) dfsLCA(v, u, d+1, adj);",     // 7
  "}",                                                                // 8
  "",                                                                // 9
  "void preprocess(int n, int root, vector<vector<int>>& adj) {",  // 10
  "  up.assign(LOG, vector<int>(n, root));",                        // 11
  "  depth.assign(n, 0);",                                          // 12
  "  dfsLCA(root, root, 0, adj);          // ← helper",              // 13
  "  for (int k = 1; k < LOG; k++)",                                // 14
  "    for (int v = 0; v < n; v++)",                                // 15
  "      up[k][v] = up[k-1][ up[k-1][v] ];",                        // 16
  "}",                                                                // 17
  "",                                                                // 18
  "int lca(int u, int v) {",                                        // 19
  "  if (depth[u] < depth[v]) swap(u, v);",                         // 20
  "  int diff = depth[u] - depth[v];",                              // 21
  "  for (int k = 0; k < LOG; k++)",                                // 22
  "    if ((diff >> k) & 1) u = up[k][u];",                         // 23
  "  if (u == v) return u;",                                        // 24
  "  for (int k = LOG - 1; k >= 0; k--)",                           // 25
  "    if (up[k][u] != up[k][v]) {",                                // 26
  "      u = up[k][u]; v = up[k][v];",                              // 27
  "    }",                                                          // 28
  "  return up[0][u];",                                             // 29
  "}",                                                              // 30
];
const LCA_SHORT = [
  "preprocess(n, root, adj);         // ← helper: O(n log n)",      // 0
  "int ancestor = lca(u, v);         // ← helper: O(log n)",        // 1
  "int distUV = depth[u] + depth[v] - 2 * depth[ancestor];",        // 2
];

/* ============================================================
   CODE: Convex Hull (Andrew's monotone chain)
============================================================ */
const CONVEX_HULL_FULL = [
  "// Cross product: +ccw, -cw, 0 collinear",                       // 0
  "long long cross(P O, P A, P B) {",                               // 1
  "  return (long long)(A.x - O.x) * (B.y - O.y)",                  // 2
  "       - (long long)(A.y - O.y) * (B.x - O.x);",                 // 3
  "}",                                                              // 4
  "",                                                               // 5
  "vector<P> convexHull(vector<P> pts) {",                          // 6
  "  sort(pts.begin(), pts.end());",                                // 7
  "  int n = pts.size(), k = 0;",                                   // 8
  "  vector<P> hull(2 * n);",                                       // 9
  "  // Lower hull",                                                // 10
  "  for (int i = 0; i < n; i++) {",                                // 11
  "    while (k >= 2 && cross(hull[k-2], hull[k-1], pts[i]) <= 0) k--;", // 12
  "    hull[k++] = pts[i];",                                        // 13
  "  }",                                                            // 14
  "  // Upper hull",                                                // 15
  "  int t = k + 1;",                                               // 16
  "  for (int i = n - 2; i >= 0; i--) {",                           // 17
  "    while (k >= t && cross(hull[k-2], hull[k-1], pts[i]) <= 0) k--;", // 18
  "    hull[k++] = pts[i];",                                        // 19
  "  }",                                                            // 20
  "  hull.resize(k - 1);",                                          // 21
  "  return hull;",                                                 // 22
  "}",                                                              // 23
];
const CONVEX_HULL_SHORT = [
  "vector<P> convexHull(vector<P> pts) {",                          // 0
  "  sort(pts.begin(), pts.end());",                                // 1
  "  // Lower hull: pop เมื่อ cross() ≤ 0",                          // 2
  "  // Upper hull: pop เมื่อ cross() ≤ 0",                          // 3
  "  // ใช้ cross() ← helper เพื่อตัดสิน turn",                       // 4
  "  return hull;             // O(n log n)",                       // 5
  "}",                                                              // 6
];

/* ============================================================
   CODE: A* Search (Full + Short)
============================================================ */
const A_STAR_FULL = [
  "// A* = Dijkstra + heuristic h(n) (admissible & consistent)",    // 0
  "double heuristic(Cell a, Cell goal) {",                          // 1
  "  return abs(a.x - goal.x) + abs(a.y - goal.y); // Manhattan",  // 2
  "}",                                                              // 3
  "",                                                               // 4
  "vector<Cell> reconstructPath(map<Cell,Cell>& came, Cell goal) { // 5",
  "  vector<Cell> path = {goal};",                                  // 6
  "  while (came.count(path.back()))",                              // 7
  "    path.push_back(came[path.back()]);",                         // 8
  "  reverse(path.begin(), path.end());",                           // 9
  "  return path;",                                                 // 10
  "}",                                                              // 11
  "",                                                               // 12
  "vector<Cell> astar(Cell start, Cell goal, Grid& grid) {",        // 13
  "  priority_queue<pair<double,Cell>> pq;",                        // 14
  "  map<Cell, double> g;",                                         // 15
  "  map<Cell, Cell> came;",                                        // 16
  "  pq.push({-heuristic(start, goal), start});",                   // 17
  "  g[start] = 0;",                                                // 18
  "",                                                               // 19
  "  while (!pq.empty()) {",                                        // 20
  "    Cell u = pq.top().second; pq.pop();",                        // 21
  "    if (u == goal) return reconstructPath(came, goal);",         // 22
  "    for (Cell v : neighbors(u, grid)) {",                        // 23
  "      double tentG = g[u] + dist(u, v);",                        // 24
  "      if (!g.count(v) || tentG < g[v]) {",                       // 25
  "        g[v] = tentG;",                                          // 26
  "        came[v] = u;",                                           // 27
  "        pq.push({-(tentG + heuristic(v, goal)), v});",           // 28
  "      }",                                                        // 29
  "    }",                                                          // 30
  "  }",                                                            // 31
  "  return {};",                                                   // 32
  "}",                                                              // 33
];
const A_STAR_SHORT = [
  "vector<Cell> astar(Cell start, Cell goal, Grid& grid) {",        // 0
  "  // f(n) = g(n) + h(n)",                                        // 1
  "  // explore lowest f first via priority_queue",                 // 2
  "  // h(n) = heuristic() ← helper",                               // 3
  "  // ถึง goal → reconstructPath() ← helper",                      // 4
  "  return path;             // O(b^d) worst",                     // 5
  "}",                                                              // 6
];

/* ============================================================
   CODE: FFT (Cooley-Tukey radix-2)
============================================================ */
const FFT_FULL = [
  "using cd = complex<double>;",                                    // 0
  "const double PI = acos(-1.0);",                                  // 1
  "",                                                               // 2
  "void fft(vector<cd>& a, bool invert) {",                         // 3
  "  int n = a.size();",                                            // 4
  "  if (n == 1) return;",                                          // 5
  "  vector<cd> a0(n/2), a1(n/2);",                                 // 6
  "  for (int i = 0; 2*i < n; i++) {",                              // 7
  "    a0[i] = a[2*i];",                                            // 8
  "    a1[i] = a[2*i + 1];",                                        // 9
  "  }",                                                            // 10
  "  fft(a0, invert);                  // recurse",                 // 11
  "  fft(a1, invert);                  // recurse",                 // 12
  "  double ang = 2 * PI / n * (invert ? -1 : 1);",                 // 13
  "  cd w(1), wn(cos(ang), sin(ang));",                             // 14
  "  for (int i = 0; 2*i < n; i++) {",                              // 15
  "    a[i] = a0[i] + w * a1[i];",                                  // 16
  "    a[i + n/2] = a0[i] - w * a1[i];",                            // 17
  "    if (invert) { a[i] /= 2; a[i + n/2] /= 2; }",                // 18
  "    w *= wn;",                                                   // 19
  "  }",                                                            // 20
  "}",                                                              // 21
  "",                                                               // 22
  "vector<long long> multiply(vector<long long>& a, vector<long long>& b) {", // 23
  "  vector<cd> fa(a.begin(), a.end()), fb(b.begin(), b.end());",   // 24
  "  int n = 1;",                                                   // 25
  "  while (n < (int)(a.size() + b.size())) n <<= 1;",              // 26
  "  fa.resize(n); fb.resize(n);",                                  // 27
  "  fft(fa, false); fft(fb, false);",                              // 28
  "  for (int i = 0; i < n; i++) fa[i] *= fb[i];",                  // 29
  "  fft(fa, true);",                                               // 30
  "  vector<long long> result(n);",                                 // 31
  "  for (int i = 0; i < n; i++) result[i] = round(fa[i].real());", // 32
  "  return result;",                                               // 33
  "}",                                                              // 34
];
const FFT_SHORT = [
  "vector<long long> multiply(vector<long long>& a, vector<long long>& b) {", // 0
  "  // polynomial mult: O(n²) → O(n log n) ผ่าน FFT",               // 1
  "  fft(fa, false); fft(fb, false);   // ← helper: forward",        // 2
  "  // pointwise multiply",                                        // 3
  "  fft(fa, true);                    // ← helper: inverse",        // 4
  "  return result;",                                               // 5
  "}",                                                              // 6
];

/* ============================================================
   CODE: Mo's Algorithm (Full + Short)
============================================================ */
const MO_FULL = [
  "// Mo's algorithm — offline range queries O((N+Q)√N)",           // 0
  "struct Query { int l, r, idx; };",                               // 1
  "int blockSize;",                                                 // 2
  "",                                                               // 3
  "bool cmp(const Query& a, const Query& b) {",                     // 4
  "  if (a.l / blockSize != b.l / blockSize)",                      // 5
  "    return a.l / blockSize < b.l / blockSize;",                  // 6
  "  return a.r < b.r;",                                            // 7
  "}",                                                              // 8
  "",                                                               // 9
  "int curAnswer = 0;",                                             // 10
  "void add(int idx) { /* update curAnswer */ }",                   // 11
  "void remove(int idx) { /* update curAnswer */ }",                // 12
  "",                                                               // 13
  "vector<int> mo(vector<int>& a, vector<Query>& queries) {",       // 14
  "  blockSize = (int)sqrt((double)a.size());",                     // 15
  "  sort(queries.begin(), queries.end(), cmp);",                   // 16
  "  vector<int> ans(queries.size());",                             // 17
  "  int l = 0, r = -1;",                                           // 18
  "  for (auto& q : queries) {",                                    // 19
  "    while (r < q.r) add(++r);          // ← helper",              // 20
  "    while (l > q.l) add(--l);          // ← helper",              // 21
  "    while (r > q.r) remove(r--);       // ← helper",              // 22
  "    while (l < q.l) remove(l++);       // ← helper",              // 23
  "    ans[q.idx] = curAnswer;",                                    // 24
  "  }",                                                            // 25
  "  return ans;",                                                  // 26
  "}",                                                              // 27
];
const MO_SHORT = [
  "vector<int> mo(vector<int>& a, vector<Query>& queries) {",       // 0
  "  blockSize = sqrt(a.size());",                                  // 1
  "  sort(queries, cmp);                // ← key trick (block sort)",// 2
  "  for (auto& q : queries) {",                                    // 3
  "    moveLR(l, r, q.l, q.r);          // ← helper: add/remove",   // 4
  "    ans[q.idx] = curAnswer;",                                    // 5
  "  }",                                                            // 6
  "  return ans;             // O((N+Q)·√N)",                       // 7
  "}",                                                              // 8
];

/* ============================================================
   CODE: HLD + Centroid Decomposition (Full + Short)
============================================================ */
const HLD_FULL = [
  "// Heavy-Light Decomposition — path query O(log² n)",            // 0
  "vector<int> parent, depth, heavy, head, pos;",                   // 1
  "int curPos = 0;",                                                // 2
  "",                                                               // 3
  "int dfsSize(int u, vector<vector<int>>& adj) {",                 // 4
  "  int size = 1, maxSubtree = 0;",                                // 5
  "  for (int v : adj[u]) if (v != parent[u]) {",                   // 6
  "    parent[v] = u; depth[v] = depth[u] + 1;",                    // 7
  "    int subSize = dfsSize(v, adj);",                             // 8
  "    size += subSize;",                                           // 9
  "    if (subSize > maxSubtree) { maxSubtree = subSize; heavy[u] = v; }", // 10
  "  }",                                                            // 11
  "  return size;",                                                 // 12
  "}",                                                              // 13
  "",                                                               // 14
  "void decompose(int u, int h, vector<vector<int>>& adj) {",       // 15
  "  head[u] = h; pos[u] = curPos++;",                              // 16
  "  if (heavy[u] != -1) decompose(heavy[u], h, adj);",             // 17
  "  for (int v : adj[u])",                                         // 18
  "    if (v != parent[u] && v != heavy[u])",                       // 19
  "      decompose(v, v, adj);",                                    // 20
  "}",                                                              // 21
  "",                                                               // 22
  "int queryPath(int u, int v) {",                                  // 23
  "  int res = 0;",                                                 // 24
  "  while (head[u] != head[v]) {",                                 // 25
  "    if (depth[head[u]] < depth[head[v]]) swap(u, v);",           // 26
  "    res = combine(res, segQuery(pos[head[u]], pos[u]));",        // 27
  "    u = parent[head[u]];",                                       // 28
  "  }",                                                            // 29
  "  if (depth[u] > depth[v]) swap(u, v);",                         // 30
  "  return combine(res, segQuery(pos[u], pos[v]));",               // 31
  "}",                                                              // 32
];
const HLD_SHORT = [
  "dfsSize(root, adj);            // ← helper: compute heavy child",// 0
  "decompose(root, root, adj);    // ← helper: build chains",       // 1
  "int answer = queryPath(u, v);  // ← helper: O(log² n)",          // 2
];
const CENTROID_FULL = [
  "// Centroid Decomposition — D&C on tree",                        // 0
  "vector<int> subtreeSize;",                                       // 1
  "vector<bool> removed;",                                          // 2
  "",                                                               // 3
  "int computeSize(int u, int p, vector<vector<int>>& adj) {",      // 4
  "  subtreeSize[u] = 1;",                                          // 5
  "  for (int v : adj[u])",                                         // 6
  "    if (v != p && !removed[v])",                                 // 7
  "      subtreeSize[u] += computeSize(v, u, adj);",                // 8
  "  return subtreeSize[u];",                                       // 9
  "}",                                                              // 10
  "",                                                               // 11
  "int findCentroid(int u, int p, int treeSize, vector<vector<int>>& adj) {", // 12
  "  for (int v : adj[u])",                                         // 13
  "    if (v != p && !removed[v] && subtreeSize[v] > treeSize / 2)",// 14
  "      return findCentroid(v, u, treeSize, adj);",                // 15
  "  return u;",                                                    // 16
  "}",                                                              // 17
  "",                                                               // 18
  "void decompose(int u, vector<vector<int>>& adj) {",              // 19
  "  int n = computeSize(u, -1, adj);                  // ← helper", // 20
  "  int c = findCentroid(u, -1, n, adj);              // ← helper", // 21
  "  removed[c] = true;",                                           // 22
  "  solve(c, adj);                       // process through c",    // 23
  "  for (int v : adj[c])",                                         // 24
  "    if (!removed[v]) decompose(v, adj); // recurse — depth O(log n)", // 25
  "}",                                                              // 26
];
const CENTROID_SHORT = [
  "void decompose(int u, vector<vector<int>>& adj) {",              // 0
  "  int n = computeSize(u, -1, adj);    // ← helper",               // 1
  "  int c = findCentroid(u, -1, n, adj);// ← helper",               // 2
  "  removed[c] = true;",                                           // 3
  "  solve(c, adj);                      // process through c",     // 4
  "  for (int v : adj[c])",                                         // 5
  "    if (!removed[v]) decompose(v, adj); // recurse",             // 6
  "}",                                                              // 7
];

/* ============================================================
   CODE: Treap (Full + Short)
============================================================ */
const TREAP_FULL = [
  "// Treap = Tree + Heap by random priority",                      // 0
  "struct Node {",                                                  // 1
  "  int key, prio, size;",                                         // 2
  "  Node *l, *r;",                                                 // 3
  "  Node(int k) : key(k), prio(rand()), size(1), l(nullptr), r(nullptr) {}", // 4
  "};",                                                             // 5
  "",                                                               // 6
  "int sz(Node* t) { return t ? t->size : 0; }",                    // 7
  "void updSize(Node* t) { if (t) t->size = 1 + sz(t->l) + sz(t->r); }", // 8
  "",                                                               // 9
  "void split(Node* t, int k, Node*& l, Node*& r) {",               // 10
  "  if (!t) { l = r = nullptr; return; }",                         // 11
  "  if (t->key <= k) {",                                           // 12
  "    split(t->r, k, t->r, r);",                                   // 13
  "    l = t;",                                                     // 14
  "  } else {",                                                     // 15
  "    split(t->l, k, l, t->l);",                                   // 16
  "    r = t;",                                                     // 17
  "  }",                                                            // 18
  "  updSize(t);",                                                  // 19
  "}",                                                              // 20
  "",                                                               // 21
  "Node* merge(Node* l, Node* r) {",                                // 22
  "  if (!l || !r) return l ? l : r;",                              // 23
  "  if (l->prio > r->prio) {",                                     // 24
  "    l->r = merge(l->r, r);",                                     // 25
  "    updSize(l); return l;",                                      // 26
  "  } else {",                                                     // 27
  "    r->l = merge(l, r->l);",                                     // 28
  "    updSize(r); return r;",                                      // 29
  "  }",                                                            // 30
  "}",                                                              // 31
  "",                                                               // 32
  "Node* insert(Node* root, int key) {",                            // 33
  "  Node *l, *r;",                                                 // 34
  "  split(root, key, l, r);",                                      // 35
  "  return merge(merge(l, new Node(key)), r);",                    // 36
  "}",                                                              // 37
];
const TREAP_SHORT = [
  "Node* insert(Node* root, int key) {",                            // 0
  "  Node *l, *r;",                                                 // 1
  "  split(root, key, l, r);            // ← helper: by key",       // 2
  "  return merge(                      // ← helper: by priority", // 3
  "    merge(l, new Node(key)), r);",                               // 4
  "}                                    // expected O(log n)",      // 5
];

/* ============================================================
   Helper — simple stepper for SVG-based visualizers
============================================================ */
function useS28Step(framesLen) {
  const [idx, setIdx] = useS28(0);
  const [playing, setPlaying] = useS28(false);
  useE28(() => { setIdx(0); setPlaying(false); }, [framesLen]);
  useE28(() => {
    if (!playing || idx >= framesLen - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 850);
    return () => clearTimeout(t);
  }, [playing, idx, framesLen]);
  return {
    idx, playing, setIdx,
    play: () => { if (idx >= framesLen - 1) setIdx(0); setPlaying(true); },
    pause: () => setPlaying(false),
    step: () => { setPlaying(false); setIdx(i => Math.min(framesLen - 1, i + 1)); },
    back: () => { setPlaying(false); setIdx(i => Math.max(0, i - 1)); },
    reset: () => { setPlaying(false); setIdx(0); },
    toggle: () => setPlaying(p => !p),
  };
}

function StepBar28({ s, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, background: 'var(--bg-3)', padding: 8, borderRadius: 8 }}>
      <button onClick={s.reset}>↺</button>
      <button onClick={s.back} disabled={s.idx === 0}>◀</button>
      <button onClick={s.toggle} style={{ background: 'var(--accent)', color: '#000', fontWeight: 700 }}>{s.playing ? '⏸' : '▶'}</button>
      <button onClick={s.step} disabled={s.idx >= total - 1}>▶|</button>
      <span style={{ fontFamily: 'monospace', fontSize: 11, marginLeft: 'auto' }}>{s.idx + 1}/{total}</span>
    </div>
  );
}

/* ============================================================
   125 — Sparse Table / RMQ O(1)
============================================================ */
function SparseTableViz() {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6];
  const [L, setL] = useS28(2);
  const [R, setR] = useS28(6);
  const n = arr.length;
  const LOG = Math.floor(Math.log2(n)) + 1;
  const st = Array.from({ length: LOG }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) st[0][i] = arr[i];
  for (let k = 1; k < LOG; k++) {
    for (let i = 0; i + (1 << k) <= n; i++) {
      st[k][i] = Math.min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
    }
  }
  const lo = Math.min(L, R), hi = Math.max(L, R);
  const len = hi - lo + 1;
  const k = Math.floor(Math.log2(len));
  const part1 = { L: lo, R: lo + (1 << k) - 1 };
  const part2 = { L: hi - (1 << k) + 1, R: hi };
  const ans = Math.min(st[k][lo], st[k][hi - (1 << k) + 1]);

  return (
    <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {arr.map((v, i) => (
          <div key={i} style={{
            width: 36, height: 36, lineHeight: '36px', textAlign: 'center',
            background: (i >= part1.L && i <= part1.R) || (i >= part2.L && i <= part2.R) ? 'var(--accent)' : 'var(--bg-3)',
            color: (i >= part1.L && i <= part1.R) || (i >= part2.L && i <= part2.R) ? '#000' : 'var(--text-0)',
            borderRadius: 6, fontWeight: 700, fontFamily: 'monospace',
            border: i === lo || i === hi ? '2px solid var(--warn)' : 'none'
          }}>{v}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center', fontSize: 13 }}>
        <label>L: <input type="number" min="0" max={n - 1} value={L} onChange={e => setL(+e.target.value)} style={{ width: 50 }} /></label>
        <label>R: <input type="number" min="0" max={n - 1} value={R} onChange={e => setR(+e.target.value)} style={{ width: 50 }} /></label>
        <span style={{ color: 'var(--text-2)' }}>len = {len}, k = floor(log₂ {len}) = {k}, 2^k = {1 << k}</span>
      </div>
      <div style={{ background: 'var(--bg-3)', padding: 10, borderRadius: 6, fontFamily: 'monospace', fontSize: 13 }}>
        min(st[{k}][{part1.L}], st[{k}][{part2.L}]) = min({st[k][part1.L]}, {st[k][part2.L]}) = <b style={{ color: 'var(--accent-3)' }}>{ans}</b>
      </div>
      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ fontFamily: 'monospace', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr><th style={{ padding: 4, color: 'var(--text-3)' }}>k\\i</th>
              {arr.map((_, i) => <th key={i} style={{ padding: 4, width: 30, color: 'var(--text-2)' }}>{i}</th>)}
            </tr>
          </thead>
          <tbody>
            {st.map((row, kk) => (
              <tr key={kk}>
                <td style={{ padding: 4, color: 'var(--text-2)' }}>{kk}<span style={{ color: 'var(--text-3)' }}> (len {1 << kk})</span></td>
                {row.map((v, i) => {
                  const valid = i + (1 << kk) <= n;
                  const hi = kk === k && (i === part1.L || i === part2.L);
                  return (
                    <td key={i} style={{
                      padding: 4, textAlign: 'center',
                      background: hi ? 'var(--warn)' : valid ? 'var(--bg-3)' : 'transparent',
                      color: hi ? '#000' : valid ? 'var(--accent)' : 'var(--text-3)',
                      borderRadius: 4
                    }}>{valid ? v : '·'}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Lessons28["sparse-table"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Sparse Table — Range Min/Max Query O(1)</div>
        ตอบ query <code>min(L..R)</code> ในเวลา <b>O(1)</b> หลัง preprocess O(n log n)
      </div>

      <h3>หลักการ</h3>
      <p>เก็บ <code>st[k][i] = min ของช่วงยาว 2^k เริ่มที่ i</code></p>
      <p>Query [L, R]: หา k = floor(log2(R−L+1)) แล้ว <code>min(st[k][L], st[k][R−2^k+1])</code></p>
      <p>2 ช่วงนี้ <b>ซ้อนทับ</b>กันได้ — เพราะ min เป็น <b>idempotent</b> (min(a,a)=a) ไม่กระทบคำตอบ</p>

      <h3>ลองปรับ L/R ดูคำตอบ</h3>
      <SparseTableViz />

      <h3>Sparse Table — C++ Code</h3>
      <CodeViewToggle28
        code={SPARSE_FULL}
        codeShort={SPARSE_SHORT}
        helperName="buildSparseTable() + rangeMin()"
      />

      <h3>โค้ดเต็ม</h3>
      <CodeBlock code={[
        "int LOG = log2(n) + 1;",
        "vector<vector<int>> st(LOG, vector<int>(n));",
        "for (int i = 0; i < n; i++) st[0][i] = a[i];",
        "for (int k = 1; k < LOG; k++)",
        "  for (int i = 0; i + (1<<k) <= n; i++)",
        "    st[k][i] = min(st[k-1][i], st[k-1][i + (1<<(k-1))]);",
        "",
        "int query(int L, int R) {",
        "  int k = __lg(R - L + 1);",
        "  return min(st[k][L], st[k][R - (1<<k) + 1]);",
        "}",
      ]} />

      <h3>เทียบกับ Segment Tree</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Property</th><th>Segment Tree</th><th>Sparse Table</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Build</td><td>O(n)</td><td>O(n log n)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Query</td><td>O(log n)</td><td><b>O(1)</b></td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Update</td><td>O(log n)</td><td>ไม่ได้</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>เหมาะกับ</td><td>idempotent + non-idempotent</td><td>idempotent (min/max/gcd) เท่านั้น</td></tr>
        </tbody>
      </table>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', marginTop: 14, padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>ใช้กับ <b>sum</b> ไม่ได้ — sum ไม่ idempotent (สอง overlap คือ double-count)</li>
          <li><b>Update ไม่ได้</b> — ถ้าต้อง update ระหว่าง query ใช้ Segment Tree / BIT</li>
          <li><b>Memory</b> = O(n log n) — n=10⁶ ใช้ ~20× ของ array</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/segment-tree" style={{ color: 'var(--accent)' }}>Segment Tree & BIT</a> (บท 63) — เมื่อต้อง update + query</p>

      <Quiz28
        q="ทำไม Sparse Table query ได้ O(1)?"
        options={[
          "เพราะเก็บ pre-compute ทุก ๆ query",
          "เพราะ 2 ช่วง 2^k ซ้อนทับครอบคลุม [L,R] และ min/max idempotent",
          "เพราะใช้ hash",
          "เพราะใช้ binary search"
        ]}
        answer={1}
        explain="คำตอบที่ถูก: idempotent ทำให้ overlap ไม่เป็นปัญหา"
      />
      <Quiz28
        q="สามารถใช้ Sparse Table หา 'sum ใน [L,R]' ได้ไหม?"
        options={[
          "ใช้ได้ — เพียงเปลี่ยน min เป็น +",
          "ใช้ไม่ได้ — sum ไม่ idempotent (overlap = double-count)",
          "ใช้ได้แต่ช้ากว่า",
          "ใช้ได้แต่ทุก query"
        ]}
        answer={1}
        explain="ใช้ prefix sum (O(1) ก็เพียงพอ) — Sparse Table ใช้กับ min/max/gcd/and/or เท่านั้น"
      />
      <Quiz28
        q="Memory ของ Sparse Table?"
        options={["O(n)", "O(n log n)", "O(n²)", "O(2^n)"]}
        answer={1}
        explain="ตาราง st มี ~log n แถว แต่ละแถวมี n cells"
      />
    </React.Fragment>
  );
};

/* ============================================================
   126 — 2-SAT (with Implication Graph viz)
============================================================ */
function TwoSatViz() {
  // Example: (x1 ∨ x2) ∧ (¬x1 ∨ x3) ∧ (¬x2 ∨ ¬x3)
  // 6 nodes: x1=0, ¬x1=1, x2=2, ¬x2=3, x3=4, ¬x3=5
  const labels = ['x₁', '¬x₁', 'x₂', '¬x₂', 'x₃', '¬x₃'];
  const pos = [
    { x: 60, y: 60 }, { x: 60, y: 200 },
    { x: 220, y: 60 }, { x: 220, y: 200 },
    { x: 380, y: 60 }, { x: 380, y: 200 },
  ];
  // (x1 ∨ x2): ¬x1→x2, ¬x2→x1 → (1→2), (3→0)
  // (¬x1 ∨ x3): x1→x3, ¬x3→¬x1 → (0→4), (5→1)
  // (¬x2 ∨ ¬x3): x2→¬x3, x3→¬x2 → (2→5), (4→3)
  const edges = [
    { u: 1, v: 2, c: '(x₁∨x₂)' }, { u: 3, v: 0, c: '(x₁∨x₂)' },
    { u: 0, v: 4, c: '(¬x₁∨x₃)' }, { u: 5, v: 1, c: '(¬x₁∨x₃)' },
    { u: 2, v: 5, c: '(¬x₂∨¬x₃)' }, { u: 4, v: 3, c: '(¬x₂∨¬x₃)' },
  ];
  const [showCl, setShowCl] = useS28(-1);
  const showing = showCl === -1 ? edges : edges.filter((_, i) => Math.floor(i / 2) === showCl);

  return (
    <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
        Formula: <b style={{ color: 'var(--accent)' }}>(x₁ ∨ x₂) ∧ (¬x₁ ∨ x₃) ∧ (¬x₂ ∨ ¬x₃)</b>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {['ทุก clause', '(x₁∨x₂)', '(¬x₁∨x₃)', '(¬x₂∨¬x₃)'].map((l, i) => (
          <button key={i} onClick={() => setShowCl(i - 1)}
            style={{
              padding: '4px 10px', fontSize: 12,
              background: showCl === i - 1 ? 'var(--accent)' : 'var(--bg-3)',
              color: showCl === i - 1 ? '#000' : 'var(--text-0)',
              border: 'none', borderRadius: 4, cursor: 'pointer'
            }}>{l}</button>
        ))}
      </div>
      <svg viewBox="0 0 440 260" width="100%" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
        <defs>
          <marker id="ah28" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" />
          </marker>
        </defs>
        {showing.map((e, i) => {
          const a = pos[e.u], b = pos[e.v];
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 12;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--accent)" strokeWidth="1.8" markerEnd="url(#ah28)" opacity="0.7" />
              <text x={mx} y={my} fontSize="9" fill="var(--text-3)" textAnchor="middle">{e.c}</text>
            </g>
          );
        })}
        {pos.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={22} fill={i % 2 === 0 ? 'var(--bg-3)' : 'rgba(248,113,113,0.2)'} stroke="var(--border)" strokeWidth="1.5" />
            <text x={p.x} y={p.y + 5} fontSize="14" fontWeight="700" fill="var(--text-0)" textAnchor="middle">{labels[i]}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
        แต่ละ clause (a ∨ b) สร้าง 2 ขอบ: <code>¬a → b</code> และ <code>¬b → a</code>
      </div>
    </div>
  );
}

Lessons28["two-sat"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 2-SAT — Boolean Satisfiability (clause ขนาด 2)</div>
        ปกติ 3-SAT NP-Complete แต่ <b>2-SAT แก้ได้ O(N+M)</b> ด้วย SCC
      </div>

      <h3>นิยาม</h3>
      <p>ให้ clauses รูปแบบ <code>(a ∨ b)</code> — จะมีค่า true/false ให้ตัวแปรไหม ที่ทุก clause = true</p>

      <h3>เทคนิคหลัก: Implication Graph</h3>
      <p>(a ∨ b) ↔ (¬a → b) ∧ (¬b → a) — "ถ้า a เป็น false แล้ว b ต้อง true"</p>

      <h3>Visualization — Implication Graph</h3>
      <TwoSatViz />

      <h3>2-SAT — C++ Code</h3>
      <CodeViewToggle28
        code={TWO_SAT_FULL}
        codeShort={TWO_SAT_SHORT}
        helperName="addClause() + solve() (SCC)"
      />

      <h3>Algorithm (Tarjan SCC-based)</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>สร้าง implication graph 2n nodes (x และ ¬x)</li>
        <li>หา <b>SCC</b> ด้วย Tarjan / Kosaraju</li>
        <li>ถ้า x และ ¬x อยู่ <b>SCC เดียวกัน</b> → <b>UNSAT</b> (ขัดแย้งกัน — ทั้งคู่ต้อง true แล้วก็ทั้งคู่ false)</li>
        <li>SAT: ตัวแปร x = true ถ้า <code>comp[x] &gt; comp[¬x]</code> (SCC ของ x มาทีหลังใน reverse topological)</li>
      </ol>

      <h3>โค้ดเต็ม (พร้อม comment)</h3>
      <CodeBlock code={[
        "// indexing convention:",
        "//   ตัวแปร x_i (i=0..n-1)",
        "//   x_i  = node 2i",
        "//   ¬x_i = node 2i+1",
        "",
        "vector<vector<int>> adj(2*n), radj(2*n);",
        "",
        "// helper: ใส่ literal — (positive ? 2i : 2i+1)",
        "auto lit = [](int i, bool pos) { return 2*i + (pos ? 0 : 1); };",
        "auto neg = [](int v) { return v ^ 1; };  // toggle 0↔1",
        "",
        "// add clause (a ∨ b) — a, b เป็น literal (เลขหลัง lit())",
        "auto addClause = [&](int a, int b) {",
        "  adj[neg(a)].push_back(b);   // ¬a → b",
        "  adj[neg(b)].push_back(a);   // ¬b → a",
        "  radj[b].push_back(neg(a));",
        "  radj[a].push_back(neg(b));",
        "};",
        "",
        "// ตัวอย่าง: (x_0 ∨ ¬x_1)",
        "// addClause(lit(0, true), lit(1, false));",
        "",
        "// รัน Kosaraju หรือ Tarjan → comp[v]",
        "// ตรวจ: ถ้า comp[2i] == comp[2i+1] สำหรับ i ใด → UNSAT",
        "// SAT: x_i = (comp[2i] > comp[2i+1])",
      ]} />

      <h3>ใช้แก้ปัญหาไหน?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Selection กับเงื่อนไขคู่:</b> "ถ้า A เลือก X แล้ว B ต้องเลือก Y"</li>
        <li><b>Painting 2 สี</b> + adjacency constraints</li>
        <li><b>Scheduling</b> ที่มีคู่ conflict</li>
        <li><b>Decision problems</b> ที่แต่ละตัวมี 2 ตัวเลือก + เงื่อนไขเป็น clause 2 literal</li>
      </ul>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>"At most 1 of A, B":</b> = (¬A ∨ ¬B) — สังเกตว่าเป็น 2-SAT</li>
          <li><b>"Exactly 1 of A, B":</b> = (A ∨ B) ∧ (¬A ∨ ¬B) — 2 clauses</li>
          <li><b>Implication a → b</b> = clause (¬a ∨ b)</li>
          <li>3 literals = NP-Complete แล้ว ห้ามรวมเป็น (a ∨ b ∨ c)</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/scc" style={{ color: 'var(--accent)' }}>SCC — Tarjan &amp; Kosaraju (บท 82)</a> — algorithm หลักใน 2-SAT</p>
      <p>📚 <a href="#/p-vs-np" style={{ color: 'var(--accent)' }}>P, NP, NP-Hard (บท 68)</a> — ทำไม 3-SAT ยาก</p>

      <Quiz28
        q="2-SAT แก้ได้ poly time แต่ 3-SAT NP-Complete — ต่างที่ไหน?"
        options={[
          "2-SAT มี implication graph + SCC structure — 3-SAT ไม่มี",
          "3-SAT มี literal มากกว่า",
          "Compiler ไม่รองรับ 3-SAT",
          "2-SAT มีตัวแปรน้อยกว่าเสมอ"
        ]}
        answer={0}
        explain="(a∨b) เปลี่ยนเป็น 2 implications ได้ตรง ๆ — 3-SAT (a∨b∨c) ไม่มีโครงสร้างเช่นนี้"
      />
      <Quiz28
        q="เงื่อนไข SAT ของ 2-SAT คือ?"
        options={[
          "ทุก SCC มีขนาด 1",
          "ไม่มี i ที่ x_i และ ¬x_i อยู่ SCC เดียวกัน",
          "Implication graph เป็น DAG",
          "Number of SCCs = 2n"
        ]}
        answer={1}
        explain="ถ้า x_i ↔ ¬x_i ใน SCC เดียวกัน หมายถึง x_i → ¬x_i และ ¬x_i → x_i — ขัดแย้ง"
      />
      <Quiz28
        q="Clause (¬a ∨ ¬b) แปลว่า?"
        options={[
          "ทั้ง a และ b ต้อง false",
          "ห้ามทั้ง a และ b เป็น true พร้อมกัน (at most 1)",
          "เลือก a หรือ b",
          "a = b"
        ]}
        answer={1}
        explain="ถ้า a=true และ b=true ทั้งคู่ → ¬a∨¬b = false∨false = false. ดังนั้น 'อย่างน้อย 1 คนต้อง false'"
      />
    </React.Fragment>
  );
};

/* ============================================================
   127 — LCA — Binary Lifting (with tree + jump table viz)
============================================================ */
function LCAViz() {
  // tree:  0
  //       / \
  //      1   2
  //     /|   |\
  //    3 4   5 6
  //   /     |
  //  7      8
  const parent = [-1, 0, 0, 1, 1, 2, 2, 3, 5];
  const depth = [0, 1, 1, 2, 2, 2, 2, 3, 3];
  const pos = [
    { x: 250, y: 40 },
    { x: 130, y: 110 }, { x: 370, y: 110 },
    { x: 70, y: 180 }, { x: 190, y: 180 }, { x: 310, y: 180 }, { x: 430, y: 180 },
    { x: 50, y: 250 }, { x: 310, y: 250 },
  ];
  const n = parent.length;
  const LOG = 4;
  // up[v][k] = 2^k th ancestor
  const up = Array.from({ length: n }, () => new Array(LOG).fill(-1));
  for (let v = 0; v < n; v++) up[v][0] = parent[v];
  for (let k = 1; k < LOG; k++)
    for (let v = 0; v < n; v++)
      up[v][k] = up[v][k - 1] >= 0 ? up[up[v][k - 1]][k - 1] : -1;

  const [u, setU] = useS28(7);
  const [v, setV] = useS28(8);

  // run LCA with frames
  const frames = useM28(() => {
    let a = u, b = v;
    const fs = [];
    fs.push({ a, b, msg: `เริ่ม: u=${u} (depth ${depth[u]}), v=${v} (depth ${depth[v]})`, hi: [u, v] });
    if (depth[a] < depth[b]) { [a, b] = [b, a]; fs.push({ a, b, msg: 'swap ให้ a ลึกกว่า', hi: [a, b] }); }
    let diff = depth[a] - depth[b];
    for (let k = 0; k < LOG; k++) {
      if ((diff >> k) & 1) {
        const old = a;
        a = up[a][k];
        fs.push({ a, b, msg: `ยก a ขึ้น 2^${k} = ${1 << k} ครั้ง: ${old} → ${a}`, hi: [a, b] });
      }
    }
    if (a === b) {
      fs.push({ a, b, msg: `a == b → LCA = ${a}`, hi: [a], lca: a });
      return fs;
    }
    for (let k = LOG - 1; k >= 0; k--) {
      if (up[a][k] !== up[b][k]) {
        fs.push({ a: up[a][k], b: up[b][k], msg: `ยกทั้งคู่ขึ้น 2^${k} (up[${a}][${k}]=${up[a][k]}, up[${b}][${k}]=${up[b][k]}) — ต่างกัน → ยก`, hi: [up[a][k], up[b][k]] });
        a = up[a][k]; b = up[b][k];
      }
    }
    fs.push({ a: up[a][0], b: up[a][0], msg: `parent ของ a (และ b) = LCA = ${up[a][0]}`, hi: [up[a][0]], lca: up[a][0] });
    return fs;
  }, [u, v]);

  const s = useS28Step(frames.length);
  const f = frames[s.idx] || {};

  return (
    <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: 10, alignItems: 'center' }}>
        <label>u: <select value={u} onChange={e => setU(+e.target.value)}>
          {pos.map((_, i) => <option key={i} value={i}>{i}</option>)}
        </select></label>
        <label>v: <select value={v} onChange={e => setV(+e.target.value)}>
          {pos.map((_, i) => <option key={i} value={i}>{i}</option>)}
        </select></label>
      </div>
      <StepBar28 s={s} total={frames.length} />
      <svg viewBox="0 0 500 300" width="100%" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
        {parent.map((p, i) => {
          if (p < 0) return null;
          return <line key={i} x1={pos[i].x} y1={pos[i].y} x2={pos[p].x} y2={pos[p].y} stroke="var(--border)" strokeWidth="1.5" />;
        })}
        {pos.map((p, i) => {
          const isHi = (f.hi || []).includes(i);
          const isLca = f.lca === i;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={20}
                fill={isLca ? 'var(--accent-3)' : isHi ? 'var(--warn)' : 'var(--bg-3)'}
                stroke="var(--border)" strokeWidth="1.5" />
              <text x={p.x} y={p.y + 5} fontSize="13" fontWeight="700" fill={isLca || isHi ? '#000' : 'var(--text-0)'} textAnchor="middle">{i}</text>
              <text x={p.x + 22} y={p.y - 12} fontSize="9" fill="var(--text-3)" fontFamily="monospace">d={depth[i]}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ background: 'var(--bg-3)', padding: 8, borderRadius: 6, marginTop: 8, fontFamily: 'monospace', fontSize: 12, minHeight: 32 }}>
        💬 {f.msg}
      </div>
      <h4 style={{ marginTop: 14 }}>up[v][k] table</h4>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ fontFamily: 'monospace', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead><tr><th style={{ padding: 4, color: 'var(--text-3)' }}>v\\k</th>{Array.from({ length: LOG }, (_, k) => <th key={k} style={{ padding: 4, color: 'var(--accent)', width: 40 }}>2^{k}={1 << k}</th>)}</tr></thead>
          <tbody>
            {up.map((row, vv) => (
              <tr key={vv}>
                <td style={{ padding: 4, color: 'var(--accent-2)' }}>{vv}</td>
                {row.map((x, k) => <td key={k} style={{ padding: 4, textAlign: 'center', background: 'var(--bg-3)', color: x < 0 ? 'var(--text-3)' : 'var(--text-0)' }}>{x < 0 ? '−' : x}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Lessons28["lca"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 LCA — บรรพบุรุษร่วมต่ำสุด</div>
        หา <b>node ที่เป็นบรรพบุรุษของทั้ง u และ v ที่อยู่ลึกที่สุด</b>
      </div>

      <h3>ใช้แก้ปัญหาอะไร?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>ระยะทางบน tree: <code>dist(u,v) = depth(u) + depth(v) − 2·depth(LCA)</code></li>
        <li>Sum/min บน path u → v (combine กับ HLD)</li>
        <li>k-th ancestor query</li>
        <li>Tree ↔ Euler tour ↔ RMQ</li>
      </ul>

      <h3>Binary Lifting</h3>
      <p>เก็บ <code>up[v][k] = บรรพบุรุษลำดับที่ 2^k ของ v</code></p>
      <p>Pre-compute: <code>up[v][k] = up[ up[v][k−1] ][k−1]</code> — "ขึ้น 2^k = ขึ้น 2^(k−1) สองครั้ง"</p>

      <h3>Visualization — Tree + Jump Table</h3>
      <LCAViz />

      <h3>LCA Binary Lifting — C++ Code</h3>
      <CodeViewToggle28
        code={LCA_FULL}
        codeShort={LCA_SHORT}
        helperName="preprocess() + lca()"
      />

      <h3>โค้ดเต็ม</h3>
      <CodeBlock code={[
        "int LOG = 20;",
        "vector<vector<int>> up;  // up[v][k]",
        "vector<int> depth;",
        "",
        "void dfs(int v, int p) {",
        "  up[v][0] = p;",
        "  for (int k = 1; k < LOG; k++)",
        "    up[v][k] = up[v][k-1] >= 0 ? up[ up[v][k-1] ][k-1] : -1;",
        "  for (int u : adj[v]) if (u != p) {",
        "    depth[u] = depth[v] + 1;",
        "    dfs(u, v);",
        "  }",
        "}",
        "",
        "int lca(int u, int v) {",
        "  if (depth[u] < depth[v]) swap(u, v);",
        "  int diff = depth[u] - depth[v];",
        "  for (int k = 0; k < LOG; k++)",
        "    if ((diff >> k) & 1) u = up[u][k];",
        "  if (u == v) return u;",
        "  for (int k = LOG - 1; k >= 0; k--)",
        "    if (up[u][k] != up[v][k]) {",
        "      u = up[u][k]; v = up[v][k];",
        "    }",
        "  return up[u][0];",
        "}",
      ]} />

      <h3>Complexity</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Op</th><th>Binary Lifting</th><th>Euler Tour + Sparse Table</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Preprocess</td><td>O(n log n)</td><td>O(n log n)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Query</td><td>O(log n)</td><td><b>O(1)</b></td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Implementation</td><td>ง่าย</td><td>ซับซ้อนกว่า</td></tr>
        </tbody>
      </table>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8, marginTop: 14 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>LOG ต้อง ≥ ⌈log₂ n⌉ — ถ้าน้อยกว่า bug</li>
          <li>Root parent = −1 ต้อง handle เมื่อ ancestor หลุด root</li>
          <li>ระวัง <b>node เลขจาก 0 หรือ 1</b> — ต้องสอดคล้องทั้ง code</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/tree-decomp" style={{ color: 'var(--accent)' }}>HLD + Centroid</a> (บท 134) — ใช้ LCA combine กับ Segment Tree หา sum/min บน path</p>
      <p>📚 <a href="#/sparse-table" style={{ color: 'var(--accent)' }}>Sparse Table</a> (บท 125) — สำหรับ LCA O(1) ด้วย Euler tour + RMQ</p>

      <Quiz28
        q="dist(u,v) บน tree = ?"
        options={[
          "depth(u) + depth(v)",
          "depth(u) − depth(v)",
          "depth(u) + depth(v) − 2·depth(LCA)",
          "depth(LCA)"
        ]}
        answer={2}
        explain="path u→LCA + LCA→v = (depth(u)−depth(LCA)) + (depth(v)−depth(LCA))"
      />
      <Quiz28
        q="ทำไม binary lifting ใช้ O(log n) ตอน query?"
        options={[
          "เพราะมี n nodes",
          "เพราะ depth สูงสุด ≤ n, ใช้ binary representation = log n bits",
          "เพราะใช้ DFS",
          "เพราะ tree balanced"
        ]}
        answer={1}
        explain="ระยะที่ต้องยก ≤ n สามารถเขียนเป็นผลรวมของ 2^k = log n เทอม"
      />
      <Quiz28
        q="ถ้า LOG ตั้งน้อยกว่า ⌈log₂ n⌉ จะเกิดอะไร?"
        options={[
          "เร็วขึ้น",
          "Compile error",
          "Query อาจไม่ครอบคลุม — bug: ขึ้นไม่ถึง LCA",
          "Memory ลด"
        ]}
        answer={2}
        explain="ถ้า diff มี bit สูงกว่า LOG → ยกได้ไม่ครบ depth — คำตอบผิด"
      />
    </React.Fragment>
  );
};

/* ============================================================
   128 — String Hashing (Polynomial Rolling Hash)
============================================================ */
Lessons28["string-hashing"] = function () {
  const [s, setS] = useS28("hello");
  const [pat, setPat] = useS28("ell");

  const hash = useM28(() => {
    const P = 31, MOD = 1e9 + 7;
    let h = 0, pw = 1;
    const out = [];
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i) - 96;
      h = (h + c * pw) % MOD;
      out.push({ i, c, ch: s[i], pw, h });
      pw = (pw * P) % MOD;
    }
    return out;
  }, [s]);

  // find pat in s using hash
  const matches = useM28(() => {
    const P = 31, MOD = 1e9 + 7;
    if (!pat || !s || pat.length > s.length) return [];
    let ph = 0, pw = 1;
    for (let i = 0; i < pat.length; i++) {
      ph = (ph + (pat.charCodeAt(i) - 96) * pw) % MOD;
      pw = (pw * P) % MOD;
    }
    const found = [];
    let sh = 0, p1 = 1;
    for (let i = 0; i < pat.length; i++) {
      sh = (sh + (s.charCodeAt(i) - 96) * p1) % MOD;
      p1 = (p1 * P) % MOD;
    }
    // shift window: compare ph * P^i with sh for each window
    let curPw = 1;
    for (let i = 0; i + pat.length <= s.length; i++) {
      // hash of substring at i is sh; compare with ph * curPw
      const target = (ph * curPw) % MOD;
      if (sh === target) found.push(i);
      if (i + pat.length < s.length) {
        sh = (sh + (s.charCodeAt(i + pat.length) - 96) * p1) % MOD;
        p1 = (p1 * P) % MOD;
        sh = (sh - (s.charCodeAt(i) - 96) * curPw + MOD * MOD) % MOD;
        curPw = (curPw * P) % MOD;
      }
    }
    return found;
  }, [s, pat]);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Polynomial Rolling Hash</div>
        แทน string เป็นเลข — เปรียบเทียบ substring O(1) หลัง O(n) preprocess
      </div>

      <h3>สูตร</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', fontSize: 14 }}>
        <div>H(s) = (s[0]·P⁰ + s[1]·P¹ + s[2]·P² + …) mod M</div>
        <div style={{ marginTop: 8, color: 'var(--text-2)' }}>
          // P = prime ใหญ่กว่า alphabet (เช่น 31, 53)<br/>
          // M = prime ใหญ่ (เช่น 10⁹+7, 10⁹+9)
        </div>
      </div>

      <h3>ทดลอง — string = "{s}"</h3>
      <input value={s} onChange={e => setS(e.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12))}
        style={{ padding: 6, fontFamily: 'monospace', marginBottom: 10 }} placeholder="พิมพ์ a-z" />
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 6 }}>i</th><th>ch</th><th>val (ch−'a'+1)</th><th>P^i</th><th>hash sofar</th></tr>
        </thead>
        <tbody>
          {hash.map(h => (
            <tr key={h.i} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: 6, color: 'var(--text-2)' }}>{h.i}</td>
              <td style={{ color: 'var(--accent)' }}>{h.ch}</td>
              <td>{h.c}</td>
              <td>{h.pw}</td>
              <td style={{ color: 'var(--accent-3)' }}>{h.h}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Pattern Matching ด้วย Hash (Rabin-Karp)</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <span>หา pattern:</span>
        <input value={pat} onChange={e => setPat(e.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8))}
          style={{ padding: 6, fontFamily: 'monospace' }} placeholder="pattern" />
        <span style={{ color: 'var(--text-2)' }}>ใน "{s}"</span>
      </div>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <div style={{ marginBottom: 8 }}>
          {s.split('').map((c, i) => {
            const isMatch = matches.some(m => i >= m && i < m + pat.length);
            return (
              <span key={i} style={{
                display: 'inline-block', width: 26, textAlign: 'center', padding: 4,
                background: isMatch ? 'var(--accent-3)' : 'var(--bg-3)',
                color: isMatch ? '#000' : 'var(--text-0)',
                margin: 1, borderRadius: 4, fontWeight: 700
              }}>{c}</span>
            );
          })}
        </div>
        <div style={{ color: 'var(--text-1)', fontSize: 13 }}>
          พบที่ตำแหน่ง: {matches.length > 0 ? matches.join(', ') : 'ไม่พบ'}
        </div>
      </div>

      <h3>Substring Hash (สำหรับ prefix hash)</h3>
      <CodeBlock code={[
        "// prefix hash: H[i] = hash ของ s[0..i)",
        "// hash ของ substring s[l..r) :",
        "//   (H[r] - H[l] + M) % M * inverse(P^l) % M",
        "// หรือใช้สูตรอีกแบบ:",
        "//   H[r] - H[l] * P^(r-l)  (สำหรับ powers จากซ้าย→ขวา)",
      ]} />

      <h3>Double Hashing (ป้องกัน collision)</h3>
      <p>ใช้ <b>2 hash function</b> (P,M) คนละคู่ → probability collision ≈ 1/M² (ปลอดภัยสำหรับ test ทั่วไป)</p>

      <h3>ใช้แก้ปัญหา</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Rabin-Karp</b> — pattern matching เร็วเฉลี่ย O(n)</li>
        <li>หา substring ที่ซ้ำกัน</li>
        <li>Longest palindromic substring (binary search + hash)</li>
        <li>Tree isomorphism (hash subtree)</li>
        <li>Distinct substring counting</li>
      </ul>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>ห้ามใช้ MOD เล็ก</b> (เช่น 10⁶) — เจอ collision เยอะ</li>
          <li><b>ห้ามใช้ P ที่หารด้วย alphabet ลงตัว</b> → hash ของ 'a','aa','aaa' เท่ากันได้</li>
          <li>ใน contest มี <b>anti-hash test</b> ที่ออกแบบให้ชนกัน → ใช้ <b>random P</b> ตอน run-time</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/string-match" style={{ color: 'var(--accent)' }}>KMP & Rabin-Karp</a> (บท 17c) — pattern matching แบบ deterministic</p>
      <p>📚 <a href="#/z-algorithm" style={{ color: 'var(--accent)' }}>Z-Algorithm</a> (บท 85)</p>

      <Quiz28
        q="ทำไมต้องใช้ Double Hashing?"
        options={[
          "ทำให้เร็วขึ้น",
          "ลดโอกาส hash collision ที่ขโมยคำตอบ",
          "ประหยัด memory",
          "Compile ง่ายขึ้น"
        ]}
        answer={1}
        explain="single hash โดน adversarial test ชนกันได้ ใช้ 2 hash ทำให้ probability ชนกันต่ำมาก"
      />
      <Quiz28
        q="ถ้า P=26 และ alphabet = 26 (a-z, val 0-25) จะเกิดอะไร?"
        options={[
          "เร็วขึ้น",
          "Hash collision จาก 'aa' = 0+0·26 = 0 = '' — เลือก val 1-26 ดีกว่า",
          "ใช้ไม่ได้เลย",
          "ไม่เกี่ยว"
        ]}
        answer={1}
        explain="ถ้า val ของ 'a'=0 หลายตัว 'a' จะ hash เป็น 0 หมด — เริ่ม val ที่ 1"
      />
      <Quiz28
        q="Substring hash O(1) ทำได้เพราะ?"
        options={[
          "เก็บทุก substring",
          "เก็บ prefix hash + P^i แล้วใช้ subtraction",
          "ใช้ KMP",
          "ใช้ Trie"
        ]}
        answer={1}
        explain="H[r] − H[l] · P^(r−l) เป็น O(1) คำนวณ"
      />
    </React.Fragment>
  );
};

/* ============================================================
   129 — Game Theory (Nim + Grundy)
============================================================ */
function GrundyTable() {
  // take-away game: pile of n, take 1, 2, or 3 stones → g(n) = n mod 4
  const rows = Array.from({ length: 10 }, (_, n) => ({
    n, g: n % 4, who: n % 4 === 0 ? 'P2 (current player loses)' : 'P1'
  }));
  return (
    <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <thead style={{ background: 'var(--bg-3)' }}>
        <tr><th style={{ padding: 6 }}>pile n</th><th>g(n)</th><th>winner</th></tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.n} style={{ borderTop: '1px solid var(--border)' }}>
            <td style={{ padding: 6 }}>{r.n}</td>
            <td style={{ color: r.g === 0 ? 'var(--danger)' : 'var(--accent-3)' }}>{r.g}</td>
            <td>{r.who}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Lessons28["game-theory"] = function () {
  const [piles, setPiles] = useS28([3, 4, 5]);
  const xor = piles.reduce((a, b) => a ^ b, 0);
  const winner = xor === 0 ? "P2 (Bob) — losing position สำหรับ Alice" : "P1 (Alice)";

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Combinatorial Game Theory</div>
        ผู้เล่น 2 คน เดินสลับ ผู้ที่เดินไม่ได้แพ้ — ใครชนะ ถ้าทั้งคู่เล่นแบบ <b>perfect</b>?
      </div>

      <h3>Nim Game</h3>
      <p>มี <b>k pile</b> ของหิน แต่ละรอบเลือก pile แล้วเอาหินออก ≥ 1 ก้อน</p>

      <h3>Nim Theorem (Bouton 1901)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, fontFamily: 'monospace', fontSize: 15 }}>
        <div>P1 ชนะ ⟺ XOR ทุก pile ≠ 0</div>
        <div>P2 ชนะ ⟺ XOR = 0 (losing position สำหรับคนที่จะเดิน)</div>
      </div>

      <h3>ทดลอง</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        {piles.map((p, i) => (
          <input key={i} type="number" min="0" max="20" value={p}
            onChange={e => {
              const np = [...piles];
              np[i] = Math.max(0, Math.min(20, +e.target.value || 0));
              setPiles(np);
            }} style={{ width: 60 }} />
        ))}
        <button onClick={() => setPiles([...piles, 0])} style={{ padding: '4px 10px', background: 'var(--bg-3)', border: 'none', borderRadius: 4, color: 'var(--text-0)' }}>+ pile</button>
        {piles.length > 1 && <button onClick={() => setPiles(piles.slice(0, -1))} style={{ padding: '4px 10px', background: 'var(--bg-3)', border: 'none', borderRadius: 4, color: 'var(--danger)' }}>− pile</button>}
      </div>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        XOR = {piles.join(' ⊕ ')} = <b style={{ color: xor === 0 ? 'var(--danger)' : 'var(--accent-3)' }}>{xor}</b>
        <div style={{ marginTop: 6 }}>ผู้ชนะ: <b style={{ color: 'var(--accent)' }}>{winner}</b></div>
      </div>

      <h3>Visualization — Nim piles</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', justifyContent: 'center' }}>
          {piles.map((p, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 2, marginBottom: 4 }}>
                {Array.from({ length: p }, (_, j) => (
                  <div key={j} style={{ width: 30, height: 8, background: 'var(--accent)', borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ color: 'var(--text-2)', fontSize: 12, fontFamily: 'monospace' }}>pile {i}: {p}</div>
              <div style={{ color: 'var(--accent-2)', fontSize: 11, fontFamily: 'monospace' }}>= {p.toString(2)}₂</div>
            </div>
          ))}
        </div>
      </div>

      <h3>Sprague-Grundy Theorem</h3>
      <p>ทุก impartial game ≡ <b>Nim pile เดียว</b>ที่มี Grundy number = mex ของ subgame</p>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <div>g(state) = mex {`{g(next1), g(next2), …}`}</div>
        <div style={{ marginTop: 4, color: 'var(--text-2)' }}>mex = minimum excludant — เลขที่ไม่อยู่ใน set</div>
        <div style={{ marginTop: 8 }}>เกมรวม: G = g₁ ⊕ g₂ ⊕ … — ถ้า G = 0 → losing</div>
      </div>

      <h3>โค้ดคำนวณ Grundy</h3>
      <CodeBlock code={[
        "int grundy(int state) {",
        "  if (memo[state] != -1) return memo[state];",
        "  set<int> s;",
        "  for (int next : transitions(state))",
        "    s.insert(grundy(next));",
        "  int mex = 0;",
        "  while (s.count(mex)) mex++;",
        "  return memo[state] = mex;",
        "}",
      ]} />

      <h3>ตัวอย่าง: Take-away game (เอาได้ 1, 2, หรือ 3 ก้อน)</h3>
      <p>Grundy g(n) = n mod 4 — pile เป็น 0 mod 4 → losing</p>
      <GrundyTable />

      <h3>เกมที่นิยมในข้อสอบ</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Nim:</b> g(n) = n</li>
        <li><b>Take-away game:</b> g(n) = n mod 4 (ถ้าเอาได้ 1-3)</li>
        <li><b>Wythoff's game:</b> 2 pile, เอาจาก 1 หรือเท่ากันจาก 2 — golden ratio</li>
        <li><b>Green Hackenbush:</b> ตัดกิ่ง tree — XOR path</li>
        <li><b>Misère Nim:</b> เปลี่ยนกฎ "คนเดินสุดท้าย <b>แพ้</b>" — strategy ต่างเล็กน้อย</li>
      </ul>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>Sprague-Grundy <b>ใช้กับ impartial</b> (ทั้ง 2 ผู้เล่นเดินได้เหมือนกัน) — Chess/Checkers ไม่ใช่ (สีต่าง)</li>
          <li>Misère version <b>ไม่ใช่</b> XOR ตรง ๆ ใน Nim — ระวัง</li>
          <li>"empty pile" → g = 0 (terminal)</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/randomized" style={{ color: 'var(--accent)' }}>Randomized Algorithms (บท 93)</a> — ใช้ probability ใน mixed strategy</p>
      <p>📚 <a href="#/bitmask-dp" style={{ color: 'var(--accent)' }}>Bitmask DP (บท 80)</a> — state ของ game บางเกมเป็น bitmask</p>

      <Quiz28
        q="Nim 3 pile (5, 7, 3) — ใครชนะ?"
        options={["P1 (Alice)", "P2 (Bob)", "เสมอ", "ไม่มีคำตอบ"]}
        answer={0}
        explain="5⊕7⊕3 = 101⊕111⊕011 = 001 = 1 ≠ 0 → P1 ชนะ"
      />
      <Quiz28
        q="g(n) สำหรับ Take-away game (เอา 1-3) เมื่อ n=12?"
        options={["0", "1", "3", "4"]}
        answer={0}
        explain="12 mod 4 = 0 → losing position"
      />
      <Quiz28
        q="Grundy number ของเกมรวม G₁ + G₂?"
        options={[
          "g(G₁) + g(G₂)",
          "g(G₁) ⊕ g(G₂)",
          "max(g(G₁), g(G₂))",
          "g(G₁) × g(G₂)"
        ]}
        answer={1}
        explain="Sprague-Grundy: เกมรวม = XOR ของ Grundy แต่ละเกม"
      />
    </React.Fragment>
  );
};

/* ============================================================
   130 — Convex Hull (Andrew's Monotone Chain) — step-by-step
============================================================ */
function ConvexHullViz() {
  const pts = useM28(() => [
    { x: 60, y: 200 }, { x: 100, y: 100 }, { x: 150, y: 180 },
    { x: 200, y: 60 }, { x: 250, y: 140 }, { x: 300, y: 90 },
    { x: 340, y: 200 }, { x: 200, y: 240 }, { x: 130, y: 220 },
  ], []);

  const sorted = useM28(() => [...pts].sort((a, b) => a.x - b.x || a.y - b.y), [pts]);

  const frames = useM28(() => {
    const cross = (O, A, B) => (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
    const fs = [];
    fs.push({ stack: [], phase: 'sort', cur: -1, msg: 'Sort points ตาม (x, y) จากซ้ายล่าง' });
    // lower hull
    const lower = [];
    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      fs.push({ stack: [...lower], phase: 'lower', cur: i, msg: `Lower: พิจารณา point ${i}` });
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
        fs.push({ stack: [...lower], phase: 'lower', cur: i, msg: `Lower: pop (เลี้ยวขวา/ตรง)` });
      }
      lower.push(p);
      fs.push({ stack: [...lower], phase: 'lower', cur: i, msg: `Lower: push point ${i}` });
    }
    // upper hull
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      fs.push({ stack: [...lower, ...upper], phase: 'upper', cur: i, msg: `Upper: พิจารณา point ${i}` });
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
        fs.push({ stack: [...lower, ...upper], phase: 'upper', cur: i, msg: `Upper: pop` });
      }
      upper.push(p);
      fs.push({ stack: [...lower, ...upper], phase: 'upper', cur: i, msg: `Upper: push point ${i}` });
    }
    const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];
    fs.push({ stack: hull, phase: 'done', cur: -1, msg: `เสร็จ! Hull = ${hull.length} จุด` });
    return fs;
  }, [sorted]);

  const s = useS28Step(frames.length);
  const f = frames[s.idx] || { stack: [], cur: -1 };

  return (
    <div>
      <StepBar28 s={s} total={frames.length} />
      <svg viewBox="0 0 400 280" width="100%" style={{ background: 'var(--bg-2)', borderRadius: 10 }}>
        {f.stack.length >= 2 && (
          <polyline points={f.stack.map(p => `${p.x},${p.y}`).join(' ')}
            fill={f.phase === 'done' ? 'rgba(52,211,153,0.15)' : 'none'}
            stroke="var(--accent)" strokeWidth="2" strokeDasharray={f.phase === 'done' ? '0' : '4 2'} />
        )}
        {pts.map((p, i) => {
          const sortedIdx = sorted.indexOf(p);
          const isCur = sortedIdx === f.cur;
          const inStack = f.stack.includes(p);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={isCur ? 8 : 5}
                fill={isCur ? 'var(--warn)' : inStack ? 'var(--accent)' : 'var(--text-3)'} />
              <text x={p.x + 10} y={p.y - 10} fontSize="10"
                fill={isCur ? 'var(--warn)' : inStack ? 'var(--accent)' : 'var(--text-2)'} fontFamily="monospace">
                {sortedIdx}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ background: 'var(--bg-3)', padding: 8, borderRadius: 6, marginTop: 8, fontFamily: 'monospace', fontSize: 12, minHeight: 32 }}>
        💬 {f.msg}
      </div>
    </div>
  );
}

Lessons28["convex-hull"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Convex Hull — เปลือกนูนของชุดจุด</div>
        หา <b>polygon นูนเล็กที่สุด</b>ที่คลุมจุดทั้งหมด — O(n log n)
      </div>

      <h3>Cross Product (เกณฑ์เลี้ยว)</h3>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 8, fontFamily: 'monospace' }}>
        <div>cross(O, A, B) = (A.x − O.x)(B.y − O.y) − (A.y − O.y)(B.x − O.x)</div>
        <div style={{ marginTop: 8 }}>
          &gt; 0 → เลี้ยวซ้าย (CCW) — เก็บไว้<br/>
          &lt; 0 → เลี้ยวขวา (CW) — pop ออก<br/>
          = 0 → collinear (เลือกตามคำตอบที่ต้องการ — รวม/ไม่รวม)
        </div>
      </div>

      <h3>Andrew's Monotone Chain — Step-by-Step Build</h3>
      <ConvexHullViz />

      <h3>Convex Hull — C++ Code (Andrew's monotone chain)</h3>
      <CodeViewToggle28
        code={CONVEX_HULL_FULL}
        codeShort={CONVEX_HULL_SHORT}
        helperName="cross()"
      />

      <h3>Algorithm</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>Sort จุดตาม (x, y)</li>
        <li><b>Lower hull:</b> ลากซ้าย→ขวา — pop ถ้าเลี้ยวขวา/ตรง</li>
        <li><b>Upper hull:</b> ลากขวา→ซ้าย — pop ถ้าเลี้ยวขวา/ตรง</li>
        <li>รวม lower + upper (ไม่ซ้ำจุดมุม 2 จุด)</li>
      </ol>

      <h3>โค้ดเต็ม</h3>
      <CodeBlock code={[
        "struct P { long long x, y; };",
        "bool operator<(P a, P b) { return a.x < b.x || (a.x == b.x && a.y < b.y); }",
        "",
        "ll cross(P O, P A, P B) {",
        "  return (A.x-O.x)*(B.y-O.y) - (A.y-O.y)*(B.x-O.x);",
        "}",
        "",
        "vector<P> hull(vector<P> p) {",
        "  sort(p.begin(), p.end());",
        "  int n = p.size(), k = 0;",
        "  vector<P> h(2 * n);",
        "  // lower",
        "  for (int i = 0; i < n; i++) {",
        "    while (k >= 2 && cross(h[k-2], h[k-1], p[i]) <= 0) k--;",
        "    h[k++] = p[i];",
        "  }",
        "  // upper",
        "  int t = k + 1;",
        "  for (int i = n - 2; i >= 0; i--) {",
        "    while (k >= t && cross(h[k-2], h[k-1], p[i]) <= 0) k--;",
        "    h[k++] = p[i];",
        "  }",
        "  h.resize(k - 1);",
        "  return h;",
        "}",
      ]} />

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>Collision detection (เกม)</li>
        <li>Smallest enclosing rectangle / circle</li>
        <li>Convex Hull Trick (DP optimization)</li>
        <li>GIS — boundary ของพื้นที่</li>
        <li>Pattern recognition</li>
      </ul>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>Cross product <b>overflow</b> — ใช้ long long ถ้า coordinate ใหญ่</li>
          <li><b>Collinear points:</b> ใช้ &lt;= หรือ &lt; ขึ้นกับว่าจะเก็บจุดตรงกลาง edge หรือไม่</li>
          <li><b>Duplicate points</b> — sort + unique ก่อน</li>
          <li>n &lt; 3 → handle เป็น special case</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 Convex Hull Trick — DP optimization technique (advanced)</p>
      <p>📚 Rotating Calipers — diameter ของ convex polygon</p>

      <Quiz28
        q="Convex Hull complexity (Andrew's monotone chain)?"
        options={["O(n)", "O(n log n)", "O(n²)", "O(n³)"]}
        answer={1}
        explain="sort = O(n log n) — ส่วน build hull เป็น linear (amortized: ทุกจุด push/pop ≤ 1 ครั้ง)"
      />
      <Quiz28
        q="cross(O, A, B) &gt; 0 หมายถึง?"
        options={[
          "เลี้ยวขวา",
          "เลี้ยวซ้าย (CCW)",
          "Collinear",
          "Parallel"
        ]}
        answer={1}
        explain="positive cross = CCW turn — convex hull เก็บ CCW เท่านั้น"
      />
      <Quiz28
        q="ทำไมต้องใช้ long long ใน cross product?"
        options={[
          "เพื่อให้เร็ว",
          "Coord เลขใหญ่ คูณกันแล้ว overflow int (10^9 × 10^9 = 10^18)",
          "เพื่อ precision",
          "ไม่จำเป็น"
        ]}
        answer={1}
        explain="ถ้า coord ถึง 10^9 cross product = ~10^18 — เกิน int (~2×10^9)"
      />
    </React.Fragment>
  );
};

/* ============================================================
   131 — A* Search (with grid pathfinding viz)
============================================================ */
function AStarViz() {
  const GRID_W = 12, GRID_H = 8;
  const [walls, setWalls] = useS28(new Set([
    '4,2', '4,3', '4,4', '4,5', '4,6',
    '7,1', '7,2', '7,3', '7,5', '7,6'
  ].map(s => s)));
  const start = '1,4';
  const goal = '10,4';

  const heuristic = (a, b) => {
    const [ax, ay] = a.split(',').map(Number);
    const [bx, by] = b.split(',').map(Number);
    return Math.abs(ax - bx) + Math.abs(ay - by);
  };

  const result = useM28(() => {
    const g = { [start]: 0 };
    const parent = {};
    const closed = new Set();
    const order = [];
    // priority queue (binary heap simplistic)
    const open = [{ f: heuristic(start, goal), node: start }];
    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const { node: u } = open.shift();
      if (closed.has(u)) continue;
      closed.add(u);
      order.push(u);
      if (u === goal) break;
      const [x, y] = u.split(',').map(Number);
      const nbrs = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [nx, ny] of nbrs) {
        if (nx < 0 || ny < 0 || nx >= GRID_W || ny >= GRID_H) continue;
        const v = `${nx},${ny}`;
        if (walls.has(v) || closed.has(v)) continue;
        const ng = g[u] + 1;
        if (g[v] === undefined || ng < g[v]) {
          g[v] = ng; parent[v] = u;
          open.push({ f: ng + heuristic(v, goal), node: v });
        }
      }
    }
    // reconstruct path
    const path = [];
    if (closed.has(goal)) {
      let cur = goal;
      while (cur) { path.unshift(cur); cur = parent[cur]; }
    }
    return { closed, g, order, path };
  }, [walls]);

  const s = useS28Step(result.order.length);
  const visibleClosed = new Set(result.order.slice(0, s.idx + 1));

  const toggleWall = (key) => {
    if (key === start || key === goal) return;
    const w = new Set(walls);
    if (w.has(key)) w.delete(key); else w.add(key);
    setWalls(w);
  };

  return (
    <div>
      <StepBar28 s={s} total={result.order.length} />
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>
        คลิก cell เพื่อ toggle กำแพง | สี: 🟦 start 🟩 goal ⬛ wall 🟨 explored 🟧 path
      </div>
      <div style={{ display: 'inline-block', background: 'var(--bg-2)', padding: 8, borderRadius: 10 }}>
        {Array.from({ length: GRID_H }, (_, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {Array.from({ length: GRID_W }, (_, x) => {
              const k = `${x},${y}`;
              const isStart = k === start, isGoal = k === goal;
              const isWall = walls.has(k);
              const isClosed = visibleClosed.has(k);
              const inPath = s.idx === result.order.length - 1 && result.path.includes(k);
              const g = result.g[k];
              const bg = isStart ? 'var(--accent-2)' : isGoal ? 'var(--accent-3)' : isWall ? '#000' : inPath ? 'var(--warn)' : isClosed ? 'rgba(125,211,252,0.3)' : 'var(--bg-3)';
              return (
                <div key={x} onClick={() => toggleWall(k)} style={{
                  width: 32, height: 32, lineHeight: '32px', textAlign: 'center',
                  background: bg, fontSize: 10, fontFamily: 'monospace',
                  border: '1px solid var(--bg-1)', cursor: 'pointer',
                  color: isWall ? '#fff' : 'var(--text-2)'
                }}>{isStart ? 'S' : isGoal ? 'G' : isClosed && g !== undefined ? g : ''}</div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        Explored {visibleClosed.size} cells | Path = {result.path.length > 0 ? result.path.length - 1 + ' steps' : 'ไม่พบ'}
      </div>
    </div>
  );
}

Lessons28["a-star"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 A* — Pathfinding ที่ฉลาด</div>
        Dijkstra + <b>heuristic</b> — ใช้ใน เกม, GPS, AI planning
      </div>

      <h3>Idea</h3>
      <p>แทนที่ priority = g(n) (cost ที่มา) ของ Dijkstra → ใช้ <b>f(n) = g(n) + h(n)</b></p>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>g(n)</b> = cost จาก start ถึง n (รู้แน่ ๆ)</li>
        <li><b>h(n)</b> = heuristic — เดา cost จาก n ถึง goal (ต้องไม่เกินจริง = "admissible")</li>
      </ul>

      <h3>Grid Pathfinding Visualization — Manhattan heuristic</h3>
      <AStarViz />

      <h3>A* Search — C++ Code</h3>
      <CodeViewToggle28
        code={A_STAR_FULL}
        codeShort={A_STAR_SHORT}
        helperName="heuristic() + reconstructPath()"
      />

      <h3>Heuristic ที่นิยม (บน grid)</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Movement</th><th>Heuristic</th><th>สูตร</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>4 ทิศ</td><td>Manhattan</td><td>|x₁−x₂| + |y₁−y₂|</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>8 ทิศ</td><td>Euclidean</td><td>√((x₁−x₂)² + (y₁−y₂)²)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>King (8 ทิศ cost เท่ากัน)</td><td>Chebyshev</td><td>max(|dx|, |dy|)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>ใด ๆ (zero)</td><td>= 0</td><td>= Dijkstra</td></tr>
        </tbody>
      </table>

      <h3>โค้ด</h3>
      <CodeBlock code={[
        "// state: (f, g, node)",
        "priority_queue<tuple<int,int,int>, ...> pq;",
        "g[start] = 0;",
        "pq.push({h(start, goal), 0, start});",
        "",
        "while (!pq.empty()) {",
        "  auto [f, gn, u] = pq.top(); pq.pop();",
        "  if (u == goal) return gn;",
        "  if (gn > g[u]) continue;",
        "  for (auto [v, w] : adj[u]) {",
        "    if (g[u] + w < g[v]) {",
        "      g[v] = g[u] + w;",
        "      pq.push({g[v] + h(v, goal), g[v], v});",
        "    }",
        "  }",
        "}",
      ]} />

      <h3>Admissible vs Consistent</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Admissible:</b> h(n) ≤ true_cost(n, goal) — รับประกัน optimal</li>
        <li><b>Consistent:</b> h(n) ≤ w(n,n') + h(n') — ไม่ต้อง re-expand → เร็วกว่า</li>
        <li>Consistent ⇒ Admissible (เสมอ)</li>
      </ul>

      <h3>เทียบ Dijkstra</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Algo</th><th>Explore</th><th>Optimal?</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>BFS</td><td>ทุกทิศเท่ากัน</td><td>ใช่ (unweighted)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Dijkstra</td><td>ทุก node ที่ cost น้อยสุด</td><td>ใช่ (no neg)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>A*</td><td>เน้นไปทาง goal</td><td>ใช่ (h admissible)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Greedy BFS</td><td>เน้น h อย่างเดียว</td><td>ไม่</td></tr>
        </tbody>
      </table>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>ใช้ Euclidean กับ grid 4-directions → h <b>overestimate</b> path → optimal ไม่รับประกัน (ใช้ Manhattan แทน)</li>
          <li>Heuristic ต้อง ≤ จริงเสมอ — ถ้าไม่แน่ใจใช้ Dijkstra (h=0)</li>
          <li>Open set ต้อง <b>priority queue</b> ที่ลำดับตาม f</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/dijkstra" style={{ color: 'var(--accent)' }}>Dijkstra (บท 26)</a> — A* + h=0</p>
      <p>📚 <a href="#/bfs" style={{ color: 'var(--accent)' }}>BFS (บท 22)</a> — unweighted shortest path</p>

      <Quiz28
        q="h(n) = 0 สำหรับทุก n → A* กลายเป็น?"
        options={["BFS", "DFS", "Dijkstra", "Greedy"]}
        answer={2}
        explain="ถ้า h(n)=0 → f(n)=g(n) — เท่ากับ Dijkstra ทุกประการ"
      />
      <Quiz28
        q="ทำไม Manhattan heuristic admissible บน grid 4-directions?"
        options={[
          "เพราะ Manhattan เร็ว",
          "เพราะ |dx|+|dy| คือ minimum path length ถ้าไม่มี wall — ใช้มากกว่าจริงไม่ได้",
          "เพราะใช้กับ Dijkstra ได้",
          "ไม่ admissible"
        ]}
        answer={1}
        explain="ระยะจริงเดิน 4 ทิศ ≥ Manhattan distance เสมอ"
      />
      <Quiz28
        q="A* admissible heuristic ≠ optimal — ขัดแย้งกับทฤษฎีไหม?"
        options={[
          "ใช่ A* ไม่ optimal เสมอ",
          "ไม่ — A* with admissible h รับประกัน optimal เสมอ",
          "ขึ้นกับ implementation",
          "ขึ้นกับ graph"
        ]}
        answer={1}
        explain="ทฤษฎี: A* with admissible h **รับประกัน optimal** — แต่ไม่ admissible อาจไม่ optimal"
      />
    </React.Fragment>
  );
};

/* ============================================================
   132 — FFT (with polynomial multiplication demo)
============================================================ */
function FFTViz() {
  // small polynomial multiplication demo
  const A = [3, 1, 2]; // 3 + x + 2x²
  const B = [2, 0, 1]; // 2 + x²
  const result = new Array(A.length + B.length - 1).fill(0);
  for (let i = 0; i < A.length; i++)
    for (let j = 0; j < B.length; j++)
      result[i + j] += A[i] * B[j];

  const fmt = (p) => p.map((c, i) => `${c}${i === 0 ? '' : `x${i === 1 ? '' : '^' + i}`}`).filter(s => !s.startsWith('0')).join(' + ') || '0';

  return (
    <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
      <h4 style={{ marginTop: 0, color: 'var(--accent)' }}>Polynomial Multiplication Example</h4>
      <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 1.8 }}>
        <div>A(x) = <span style={{ color: 'var(--accent)' }}>{fmt(A)}</span></div>
        <div>B(x) = <span style={{ color: 'var(--accent-2)' }}>{fmt(B)}</span></div>
        <div>C(x) = A·B = <span style={{ color: 'var(--accent-3)' }}>{fmt(result)}</span></div>
      </div>
      <div style={{ marginTop: 14, fontSize: 13, color: 'var(--text-1)' }}>
        <div><b>Naive:</b> O(n²) — for each i,j: c[i+j] += a[i]·b[j]</div>
        <div style={{ marginTop: 4 }}><b>FFT:</b> O(n log n) — Coefficient → Value (via DFT) → Pointwise multiply → Value → Coefficient (Inverse DFT)</div>
      </div>
      <div style={{ marginTop: 14, background: 'var(--bg-3)', padding: 10, borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
        <div>Step 1: A → evaluate at n-th roots of unity</div>
        <div>Step 2: B → evaluate at n-th roots of unity</div>
        <div>Step 3: C(ωᵏ) = A(ωᵏ) · B(ωᵏ) <span style={{ color: 'var(--text-3)' }}>← element-wise O(n)</span></div>
        <div>Step 4: C → interpolate กลับ coefficient (Inverse FFT)</div>
      </div>
    </div>
  );
}

function ButterflyDiagram() {
  // simple 4-point butterfly diagram
  return (
    <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
      <h4 style={{ marginTop: 0 }}>4-point FFT Butterfly</h4>
      <svg viewBox="0 0 360 220" width="100%" style={{ background: 'var(--bg-1)', borderRadius: 8 }}>
        {/* input nodes */}
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <circle cx={40} cy={30 + i * 50} r={14} fill="var(--bg-3)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={40} y={34 + i * 50} fontSize="11" fill="var(--text-0)" textAnchor="middle">a[{i}]</text>
          </g>
        ))}
        {/* stage 1: bit reverse */}
        {[
          { from: 0, to: 0 }, { from: 2, to: 1 }, { from: 1, to: 2 }, { from: 3, to: 3 }
        ].map((e, i) => (
          <line key={i} x1={54} y1={30 + e.from * 50} x2={146} y2={30 + e.to * 50} stroke="var(--text-3)" strokeWidth="1" />
        ))}
        {/* mid */}
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <circle cx={160} cy={30 + i * 50} r={14} fill="var(--bg-3)" stroke="var(--accent-2)" strokeWidth="1.5" />
            <text x={160} y={34 + i * 50} fontSize="10" fill="var(--text-2)" textAnchor="middle">×</text>
          </g>
        ))}
        {/* stage 2 butterflies */}
        {[
          { f: 0, t: 0 }, { f: 0, t: 1 }, { f: 1, t: 0 }, { f: 1, t: 1 },
          { f: 2, t: 2 }, { f: 2, t: 3 }, { f: 3, t: 2 }, { f: 3, t: 3 }
        ].map((e, i) => (
          <line key={i} x1={174} y1={30 + e.f * 50} x2={266} y2={30 + e.t * 50} stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
        ))}
        {/* output */}
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <circle cx={280} cy={30 + i * 50} r={14} fill="var(--bg-3)" stroke="var(--accent-3)" strokeWidth="1.5" />
            <text x={280} y={34 + i * 50} fontSize="11" fill="var(--text-0)" textAnchor="middle">A[{i}]</text>
          </g>
        ))}
        <text x={40} y={210} fontSize="10" fill="var(--text-3)" textAnchor="middle">input</text>
        <text x={160} y={210} fontSize="10" fill="var(--text-3)" textAnchor="middle">bit reverse</text>
        <text x={280} y={210} fontSize="10" fill="var(--text-3)" textAnchor="middle">output</text>
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
        2-point butterfly: (a, b) → (a + ωᵏ·b, a − ωᵏ·b). log₂(n) stages — แต่ละ stage O(n).
      </div>
    </div>
  );
}

Lessons28["fft"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 FFT — Fast Fourier Transform</div>
        คูณ polynomial / convolution ใน <b>O(n log n)</b> แทน O(n²)
      </div>

      <h3>ปัญหาที่แก้</h3>
      <p>ให้ <code>A(x) = a₀ + a₁x + a₂x² + …</code>, <code>B(x) = b₀ + b₁x + …</code></p>
      <p>คูณ <code>C = A·B</code> — Naive O(n²)</p>

      <FFTViz />

      <h3>FFT — C++ Code (Cooley-Tukey radix-2)</h3>
      <CodeViewToggle28
        code={FFT_FULL}
        codeShort={FFT_SHORT}
        helperName="fft() recursive"
      />

      <h3>Idea หลัก</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Coefficient representation</b> a₀, a₁, … → <b>Value representation</b> โดยประเมินที่ n จุด</li>
        <li>การคูณใน <b>value rep</b> = element-wise (O(n))</li>
        <li>กลับ value → coefficient ด้วย Inverse FFT</li>
        <li>เลือก n จุด = <b>n-th roots of unity</b> — มี recursive structure → divide & conquer</li>
      </ol>

      <h3>Butterfly Diagram</h3>
      <ButterflyDiagram />

      <h3>Cooley-Tukey (recursive)</h3>
      <CodeBlock code={[
        "using cd = complex<double>;",
        "const double PI = acos(-1);",
        "",
        "void fft(vector<cd>& a, bool inv) {",
        "  int n = a.size();",
        "  if (n == 1) return;",
        "  vector<cd> a0(n/2), a1(n/2);",
        "  for (int i = 0; 2*i < n; i++) {",
        "    a0[i] = a[2*i]; a1[i] = a[2*i + 1];",
        "  }",
        "  fft(a0, inv); fft(a1, inv);",
        "  double ang = 2*PI/n * (inv ? -1 : 1);",
        "  cd w(1), wn(cos(ang), sin(ang));",
        "  for (int i = 0; 2*i < n; i++) {",
        "    a[i] = a0[i] + w*a1[i];",
        "    a[i + n/2] = a0[i] - w*a1[i];",
        "    if (inv) { a[i] /= 2; a[i+n/2] /= 2; }",
        "    w *= wn;",
        "  }",
        "}",
      ]} />

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>คูณเลขใหญ่ 10⁶ หลัก (BigInt)</li>
        <li>Convolution: <code>c[i] = Σ a[j]·b[i−j]</code></li>
        <li>String matching with wildcards</li>
        <li>Signal processing — time → frequency domain</li>
        <li>Image compression (DCT ใน JPEG)</li>
        <li>Polynomial root finding</li>
      </ul>

      <h3>NTT (Number Theoretic Transform)</h3>
      <p>FFT แต่ใช้ <b>modular arithmetic</b> แทน complex numbers — ไม่มี floating error, เหมาะกับ modular contest (mod prime ที่มี primitive root, เช่น 998244353)</p>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>n ต้องเป็น 2 ยกกำลัง</b> — pad ด้วย 0 ถ้าไม่ใช่</li>
          <li><b>Floating precision</b> — สำหรับ coefficient ใหญ่ใช้ NTT</li>
          <li><b>Size ของ output</b> = len(A) + len(B) − 1 — pad ให้ ≥ ขนาดนี้</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/matrix-mult" style={{ color: 'var(--accent)' }}>Matrix Multiplication (บท 19)</a> — รากของ Strassen และ DAC</p>
      <p>📚 <a href="#/mod-inverse" style={{ color: 'var(--accent)' }}>Modular Inverse (บท 90)</a> — ใช้ใน NTT</p>

      <Quiz28
        q="คูณ polynomial degree n ด้วย FFT ใช้เวลา?"
        options={["O(n)", "O(n log n)", "O(n²)", "O(n^1.58)"]}
        answer={1}
        explain="2 FFT + element-wise + 1 inverse FFT = O(n log n)"
      />
      <Quiz28
        q="ทำไม FFT ต้องการ n = 2^k?"
        options={[
          "เพื่อให้เร็ว",
          "เพราะ recursive divide ครึ่งต้องลงตัว",
          "เพราะ memory",
          "ไม่จำเป็น"
        ]}
        answer={1}
        explain="Cooley-Tukey แบ่ง odd/even ทุก step — ต้องลงตัว"
      />
      <Quiz28
        q="ต่างของ FFT กับ NTT?"
        options={[
          "เหมือนกันทุกประการ",
          "FFT ใช้ complex (floating), NTT ใช้ modular integer (exact)",
          "NTT เร็วกว่าเสมอ",
          "FFT ทำได้แค่ real numbers"
        ]}
        answer={1}
        explain="NTT ทำใน Z/pZ ใช้ primitive root — ไม่มี floating error"
      />
    </React.Fragment>
  );
};

/* ============================================================
   133 — Mo's Algorithm (with pointer movement viz)
============================================================ */
function MoViz() {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  const queries = [
    { l: 2, r: 5, id: 0 }, { l: 0, r: 3, id: 1 },
    { l: 5, r: 9, id: 2 }, { l: 1, r: 7, id: 3 },
    { l: 3, r: 8, id: 4 }
  ];
  const n = arr.length;
  const BLOCK = Math.ceil(Math.sqrt(n));
  const sorted = [...queries].sort((a, b) => {
    if (Math.floor(a.l / BLOCK) !== Math.floor(b.l / BLOCK)) return Math.floor(a.l / BLOCK) - Math.floor(b.l / BLOCK);
    return (Math.floor(a.l / BLOCK) & 1) ? a.r - b.r : b.r - a.r;
  });

  const frames = useM28(() => {
    let L = 0, R = -1;
    const fs = [];
    for (const q of sorted) {
      while (R < q.r) { R++; fs.push({ L, R, q, op: `add ${R}` }); }
      while (L > q.l) { L--; fs.push({ L, R, q, op: `add ${L}` }); }
      while (R > q.r) { fs.push({ L, R, q, op: `remove ${R}` }); R--; }
      while (L < q.l) { fs.push({ L, R, q, op: `remove ${L}` }); L++; }
      fs.push({ L, R, q, op: `✓ ตอบ query ${q.id}: [${q.l},${q.r}]`, ans: true });
    }
    return fs;
  }, []);

  const s = useS28Step(frames.length);
  const f = frames[s.idx] || {};

  return (
    <div>
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>BLOCK = ⌈√{n}⌉ = {BLOCK}. Mo's order:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontFamily: 'monospace', fontSize: 12 }}>
          {sorted.map((q, i) => (
            <span key={i} style={{
              background: f.q && f.q.id === q.id ? 'var(--warn)' : 'var(--bg-3)',
              color: f.q && f.q.id === q.id ? '#000' : 'var(--text-1)',
              padding: '3px 8px', borderRadius: 4
            }}>Q{q.id}: [{q.l},{q.r}]</span>
          ))}
        </div>
      </div>
      <StepBar28 s={s} total={frames.length} />
      <div style={{ background: 'var(--bg-2)', padding: 12, borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {arr.map((v, i) => {
            const inRange = i >= f.L && i <= f.R;
            const isL = i === f.L, isR = i === f.R;
            return (
              <div key={i} style={{
                width: 36, height: 36, lineHeight: '36px', textAlign: 'center',
                background: inRange ? 'var(--accent)' : 'var(--bg-3)',
                color: inRange ? '#000' : 'var(--text-0)',
                borderRadius: 6, fontWeight: 700, fontFamily: 'monospace',
                border: isL || isR ? '2px solid var(--warn)' : 'none'
              }}>{v}</div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 4, fontFamily: 'monospace', fontSize: 11 }}>
          {arr.map((_, i) => (
            <span key={i} style={{ width: 36, textAlign: 'center', color: i === f.L ? 'var(--warn)' : i === f.R ? 'var(--warn)' : 'var(--text-3)' }}>
              {i === f.L && i === f.R ? 'L=R' : i === f.L ? 'L' : i === f.R ? 'R' : ''}
            </span>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--bg-3)', padding: 8, borderRadius: 6, marginTop: 8, fontFamily: 'monospace', fontSize: 13, minHeight: 32, color: f.ans ? 'var(--accent-3)' : 'var(--text-0)' }}>
        💬 {f.op}
      </div>
    </div>
  );
}

Lessons28["mos-algorithm"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Mo's Algorithm</div>
        ตอบ Q queries แบบ <b>offline</b> ในเวลา <b>O((N+Q)·√N)</b> — เร็วพอสำหรับโจทย์ที่ Segment Tree ทำไม่ได้
      </div>

      <h3>ปัญหาตัวอย่าง</h3>
      <p>มี array N ตัว และ Q query (L, R): "มีกี่ค่าที่ต่างกันใน a[L..R]?"</p>
      <p>Segment Tree ทำได้ยาก (distinct ไม่ใช่ associative) — Mo's แก้ได้</p>

      <h3>Idea</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>Sort queries ด้วย key <code>(L/√N, R)</code> — เรียก <b>Mo's order</b></li>
        <li>ใช้ pointers L, R ปัจจุบัน — เลื่อนทีละขั้น add/remove element</li>
        <li>Total pointer movements: O((N+Q)·√N)</li>
      </ol>

      <h3>Visualization — Pointer L, R เคลื่อนไหว</h3>
      <MoViz />

      <h3>Mo's Algorithm — C++ Code</h3>
      <CodeViewToggle28
        code={MO_FULL}
        codeShort={MO_SHORT}
        helperName="add() / remove()"
      />

      <h3>โค้ดโครง</h3>
      <CodeBlock code={[
        "int BLOCK = sqrt(n);",
        "sort(queries.begin(), queries.end(), [&](Q a, Q b) {",
        "  if (a.l/BLOCK != b.l/BLOCK) return a.l/BLOCK < b.l/BLOCK;",
        "  // alternating R direction → fewer movements",
        "  return (a.l/BLOCK & 1) ? a.r < b.r : a.r > b.r;",
        "});",
        "",
        "int L = 0, R = -1;",
        "for (auto& q : queries) {",
        "  while (R < q.r) add(++R);",
        "  while (L > q.l) add(--L);",
        "  while (R > q.r) remove(R--);",
        "  while (L < q.l) remove(L++);",
        "  ans[q.idx] = currentAnswer;",
        "}",
      ]} />

      <h3>การวิเคราะห์ Complexity</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>R movements ใน block เดียว:</b> R เลื่อนไปอย่างเดียว ≤ N ภายในแต่ละ block → รวมทุก block: O(N · √N)</li>
        <li><b>L movements:</b> ภายใน block, L เลื่อนได้ ≤ √N → รวม: O(Q · √N)</li>
        <li><b>Switch block:</b> R reset ครั้งใหญ่สุด N — มี √N block — O(N · √N)</li>
        <li>รวม: <b>O((N + Q) · √N)</b></li>
      </ul>

      <h3>เทคนิคเสริม</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Mo's on Tree</b> — แปลง tree เป็น Euler tour ก่อน</li>
        <li><b>Mo's with Updates</b> — เพิ่มมิติ time → O(N^(5/3))</li>
        <li><b>Hilbert order</b> — sort ดีกว่าให้เร็วกว่าเดิม</li>
      </ul>

      <h3>เมื่อไหร่ใช้ Mo?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>✅ Offline ได้ (รู้ query ทั้งหมดก่อน)</li>
        <li>✅ add/remove element ทำได้ O(1) หรือ O(log N)</li>
        <li>❌ ต้อง online → ใช้ persistent / wavelet tree</li>
        <li>❌ Update array → ต้องใช้ Mo's with Updates</li>
      </ul>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li>ระวังลำดับ <b>4 while loops</b> — add ก่อน remove (ป้องกัน R &lt; L invalid)</li>
          <li>เริ่มต้น L=0, R=−1 (range ว่าง)</li>
          <li>Alternating R direction (zig-zag) ช่วยลด ~2× constant</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/segment-tree" style={{ color: 'var(--accent)' }}>Segment Tree (บท 63)</a> — online range query alternative</p>
      <p>📚 <a href="#/sparse-table" style={{ color: 'var(--accent)' }}>Sparse Table (บท 125)</a> — O(1) สำหรับ idempotent</p>

      <Quiz28
        q="Mo's complexity?"
        options={["O(N log N)", "O((N+Q)√N)", "O(N·Q)", "O((N+Q) log N)"]}
        answer={1}
        explain="แต่ละ block: R เลื่อนรวม N · √N block, L เลื่อนรวม √N · Q → รวม (N+Q)√N"
      />
      <Quiz28
        q="ลำดับ 4 while loops ที่ปลอดภัยคือ?"
        options={[
          "remove ก่อน add",
          "add ก่อน remove",
          "ไม่สำคัญ",
          "L ก่อน R"
        ]}
        answer={1}
        explain="ถ้า remove ก่อน → R อาจน้อยกว่า L ชั่วคราว (invalid) — add ก่อนทำให้ range valid ตลอด"
      />
      <Quiz28
        q="Mo's ใช้ได้กับ query แบบใด?"
        options={[
          "Online queries เท่านั้น",
          "Offline + add/remove O(1) per element",
          "Update queries เท่านั้น",
          "ทุก query ใช้ได้"
        ]}
        answer={1}
        explain="ต้องรู้ทุก query ก่อน + ต้อง add/remove element เร็ว"
      />
    </React.Fragment>
  );
};

/* ============================================================
   134 — HLD + Centroid Decomposition (with tree viz)
============================================================ */
function HLDViz() {
  // small tree, mark heavy edges
  const parent = [-1, 0, 0, 1, 1, 2, 3, 3, 6];
  const pos = [
    { x: 250, y: 40 },
    { x: 140, y: 110 }, { x: 360, y: 110 },
    { x: 80, y: 180 }, { x: 200, y: 180 }, { x: 360, y: 180 },
    { x: 60, y: 250 }, { x: 130, y: 250 }, { x: 60, y: 320 },
  ];
  // compute subtree size
  const children = parent.map(() => []);
  parent.forEach((p, v) => { if (p >= 0) children[p].push(v); });
  const size = new Array(parent.length).fill(0);
  function dfsSize(v) {
    size[v] = 1;
    for (const u of children[v]) { dfsSize(u); size[v] += size[u]; }
  }
  dfsSize(0);
  // heavy child = max subtree
  const heavy = parent.map((_, v) => {
    let h = -1, mx = 0;
    for (const u of children[v]) if (size[u] > mx) { mx = size[u]; h = u; }
    return h;
  });

  return (
    <svg viewBox="0 0 460 360" width="100%" style={{ background: 'var(--bg-2)', borderRadius: 10 }}>
      {parent.map((p, v) => {
        if (p < 0) return null;
        const isHeavy = heavy[p] === v;
        return <line key={v} x1={pos[v].x} y1={pos[v].y} x2={pos[p].x} y2={pos[p].y}
          stroke={isHeavy ? 'var(--accent-3)' : 'var(--text-3)'}
          strokeWidth={isHeavy ? 4 : 1.5} />;
      })}
      {pos.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={20} fill="var(--bg-3)" stroke="var(--border)" strokeWidth="1.5" />
          <text x={p.x} y={p.y + 5} fontSize="13" fontWeight="700" fill="var(--text-0)" textAnchor="middle">{i}</text>
          <text x={p.x + 22} y={p.y - 10} fontSize="9" fill="var(--text-3)" fontFamily="monospace">sz={size[i]}</text>
        </g>
      ))}
      <text x={20} y={350} fontSize="11" fill="var(--accent-3)">▬ heavy edge (subtree ใหญ่สุด)</text>
      <text x={200} y={350} fontSize="11" fill="var(--text-3)">▬ light edge</text>
    </svg>
  );
}

function CentroidViz() {
  // small tree
  const parent = [-1, 0, 0, 1, 2, 2];
  const pos = [
    { x: 200, y: 40 },
    { x: 100, y: 110 }, { x: 300, y: 110 },
    { x: 100, y: 180 }, { x: 250, y: 180 }, { x: 350, y: 180 },
  ];
  const n = parent.length;
  const children = parent.map(() => []);
  parent.forEach((p, v) => { if (p >= 0) children[p].push(v); });

  // find centroid: node where max subtree ≤ n/2
  function findCentroid(root) {
    const sz = new Array(n).fill(0);
    function size(v, p) {
      sz[v] = 1;
      for (const u of children[v]) if (u !== p) sz[v] += size(u, v);
      return sz[v];
    }
    size(root, -1);
    let c = root;
    function dfs(v, p) {
      for (const u of children[v]) if (u !== p && sz[u] > n / 2) { sz[v] = n - sz[u]; sz[u] = n; c = u; dfs(u, v); return; }
    }
    dfs(root, -1);
    return c;
  }
  const cen = findCentroid(0);

  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ background: 'var(--bg-2)', borderRadius: 10 }}>
      {parent.map((p, v) => {
        if (p < 0) return null;
        return <line key={v} x1={pos[v].x} y1={pos[v].y} x2={pos[p].x} y2={pos[p].y} stroke="var(--text-3)" strokeWidth="1.5" />;
      })}
      {pos.map((p, i) => {
        const isCen = i === cen;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={isCen ? 24 : 18}
              fill={isCen ? 'var(--accent-3)' : 'var(--bg-3)'}
              stroke={isCen ? 'var(--accent-3)' : 'var(--border)'} strokeWidth={isCen ? 3 : 1.5} />
            <text x={p.x} y={p.y + 5} fontSize="13" fontWeight="700" fill={isCen ? '#000' : 'var(--text-0)'} textAnchor="middle">{i}</text>
          </g>
        );
      })}
      <text x={cen} y={230} fontSize="11" fill="var(--accent-3)">Centroid = node {cen} (max subtree ≤ n/2 = {Math.floor(n / 2)})</text>
    </svg>
  );
}

Lessons28["tree-decomp"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Tree Decomposition (HLD + Centroid)</div>
        เครื่องมือ <b>แตก tree</b> เพื่อตอบ query ที่ Segment Tree ไม่ตรง ๆ
      </div>

      <h3>1. Heavy-Light Decomposition (HLD)</h3>
      <p>แตก tree เป็น <b>heavy paths</b> — สำหรับแต่ละ node เลือก child ที่ subtree ใหญ่สุดเป็น <b>heavy</b></p>
      <p>Path บน tree ผ่าน <b>O(log N) heavy paths</b> เท่านั้น → ใช้ Segment Tree บน array linear</p>

      <h3>Visualization — Heavy Edges</h3>
      <HLDViz />

      <h3>HLD — C++ Code</h3>
      <CodeViewToggle28
        code={HLD_FULL}
        codeShort={HLD_SHORT}
        helperName="dfsSize() + decompose()"
      />

      <h3>Algorithm HLD</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>DFS หา subtree size ของทุก node</li>
        <li>กำหนด heavy child = child ที่ subtree ใหญ่สุด</li>
        <li>DFS อีกครั้ง เรียง node ตาม heavy edge (linearization) → ได้ position[v]</li>
        <li>เก็บ <b>top[v]</b> = bottom ของ heavy path ที่ v อยู่</li>
        <li>Query path u→v: while top[u] != top[v] → query segtree บน path สั้น → ปีนขึ้น parent ของ top → loop</li>
      </ol>

      <h3>Complexity HLD</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>Op</th><th>Time</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Build</td><td>O(N)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Path query</td><td>O(log² N)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Path update (sum)</td><td>O(log² N)</td></tr>
        </tbody>
      </table>

      <h3>2. Centroid Decomposition</h3>
      <p><b>Centroid</b> = node ที่ตัดออกแล้ว subtree ใหญ่สุด ≤ N/2</p>

      <h3>Visualization — Centroid Highlight</h3>
      <CentroidViz />

      <h3>Centroid Decomposition — C++ Code</h3>
      <CodeViewToggle28
        code={CENTROID_FULL}
        codeShort={CENTROID_SHORT}
        helperName="computeSize() + findCentroid()"
      />

      <p>Recursive: ตัด centroid → แก้ subproblem 2 ฝั่ง → centroid tree ลึก O(log N)</p>

      <h3>ใช้ทำอะไร?</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>HLD:</b> Sum/min/max บน path u→v, edge update + path query</li>
        <li><b>Centroid:</b> นับ path ที่ผ่านเงื่อนไข (length = K, sum = X), distance counting</li>
        <li>Tree distance queries</li>
      </ul>

      <h3>เทคนิคที่เกี่ยวข้อง</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Euler Tour</b> — array → subtree query ด้วย Fenwick/Segtree</li>
        <li><b>Small-to-Large merging</b> — รวม subtree O(N log² N)</li>
        <li><b>Auxiliary tree (virtual tree)</b> — เก็บแค่ K nodes สำคัญ</li>
      </ul>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>HLD:</b> edge vs vertex weights — ระวัง LCA อย่ารวม weight ของ LCA สำหรับ edge case</li>
          <li><b>Centroid:</b> centroid <b>ไม่ใช่</b> LCA — สับสนบ่อย</li>
          <li>HLD path query <b>ต้อง swap u,v</b> ให้ top[u] ลึกกว่าก่อน combine</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/lca" style={{ color: 'var(--accent)' }}>LCA (บท 127)</a> — ใช้รวมกับ HLD</p>
      <p>📚 <a href="#/segment-tree" style={{ color: 'var(--accent)' }}>Segment Tree (บท 63)</a> — เป็น backend ของ HLD</p>

      <Quiz28
        q="ทำไม centroid decomposition tree มี depth O(log N)?"
        options={[
          "เพราะ tree balanced",
          "ทุกครั้งที่ตัด centroid subtree ใหญ่สุด ≤ N/2",
          "เพราะใช้ AVL",
          "เพราะ DFS"
        ]}
        answer={1}
        explain="N → N/2 → N/4 → … → 1 ใช้ log N ขั้น"
      />
      <Quiz28
        q="ทำไม HLD path query = O(log² N)?"
        options={[
          "Path ผ่าน O(log N) heavy paths × Segtree query O(log N)",
          "เพราะ recursion",
          "เพราะ DFS",
          "ผิด — เป็น O(log N)"
        ]}
        answer={0}
        explain="O(log N) heavy paths × O(log N) per segtree query = O(log² N)"
      />
      <Quiz28
        q="Heavy edge หา? "
        options={[
          "Edge ที่ weight สูง",
          "Edge ไปยัง child ที่มี subtree ใหญ่สุด",
          "Edge บน path s-t",
          "Edge ของ centroid"
        ]}
        answer={1}
        explain="heavy child = child ที่ size ของ subtree มากสุด"
      />
    </React.Fragment>
  );
};

/* ============================================================
   135 — Treap (with split/merge viz)
============================================================ */
function TreapViz() {
  // small treap example
  const nodes = [
    { key: 5, prio: 30, x: 200, y: 50 },
    { key: 3, prio: 25, x: 100, y: 130 },
    { key: 8, prio: 28, x: 300, y: 130 },
    { key: 2, prio: 15, x: 50, y: 210 },
    { key: 4, prio: 20, x: 150, y: 210 },
    { key: 7, prio: 10, x: 250, y: 210 },
    { key: 9, prio: 18, x: 350, y: 210 },
  ];
  const parent = [-1, 0, 0, 1, 1, 2, 2];
  const [k, setK] = useS28(4);
  // visualize split(t, k): nodes with key ≤ k go left, else right
  const isLeft = (i) => nodes[i].key <= k;

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <label>Split key = </label>
        <input type="number" value={k} onChange={e => setK(+e.target.value)} style={{ width: 60 }} min="0" max="15" />
      </div>
      <svg viewBox="0 0 420 260" width="100%" style={{ background: 'var(--bg-2)', borderRadius: 10 }}>
        {parent.map((p, v) => {
          if (p < 0) return null;
          return <line key={v} x1={nodes[v].x} y1={nodes[v].y} x2={nodes[p].x} y2={nodes[p].y} stroke="var(--text-3)" strokeWidth="1.5" />;
        })}
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={n.x - 28} y={n.y - 22} width={56} height={44} rx={6}
              fill={isLeft(i) ? 'rgba(125,211,252,0.25)' : 'rgba(248,113,113,0.25)'}
              stroke={isLeft(i) ? 'var(--accent)' : 'var(--danger)'} strokeWidth="1.5" />
            <text x={n.x} y={n.y - 4} fontSize="13" fontWeight="700" fill="var(--text-0)" textAnchor="middle">k={n.key}</text>
            <text x={n.x} y={n.y + 12} fontSize="10" fill="var(--text-2)" textAnchor="middle" fontFamily="monospace">p={n.prio}</text>
          </g>
        ))}
      </svg>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
        🟦 จะไปอยู่ใน <b>L</b> (key ≤ {k}) | 🟥 จะไปอยู่ใน <b>R</b> (key &gt; {k})
      </div>
    </div>
  );
}

Lessons28["treap"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎯 Treap = Tree + Heap</div>
        BST ที่ <b>balanced เฉลี่ย</b> ด้วย random priority — ง่ายกว่า AVL/RBT
      </div>

      <h3>Property</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li>เป็น <b>BST</b> ตาม key</li>
        <li>เป็น <b>Heap</b> ตาม random priority (parent มี priority สูงกว่า children)</li>
        <li>โครงสร้างถูกกำหนดโดย (key, priority) เฉพาะตัว</li>
      </ul>

      <h3>Visualization — เห็น split(t, k)</h3>
      <TreapViz />

      <h3>Treap — C++ Code</h3>
      <CodeViewToggle28
        code={TREAP_FULL}
        codeShort={TREAP_SHORT}
        helperName="split() + merge()"
      />

      <h3>Operations หลัก: Split + Merge</h3>
      <CodeBlock code={[
        "struct Node { int key, prio, val; Node *l, *r; };",
        "",
        "// split(t, k) → (l, r): l = ทุก node key ≤ k, r = ที่เหลือ",
        "void split(Node* t, int k, Node*& l, Node*& r) {",
        "  if (!t) { l = r = nullptr; return; }",
        "  if (t->key <= k) { split(t->right, k, t->right, r); l = t; }",
        "  else { split(t->left, k, l, t->left); r = t; }",
        "}",
        "",
        "// merge(l, r): สมมติทุก key ใน l < ทุก key ใน r",
        "Node* merge(Node* l, Node* r) {",
        "  if (!l || !r) return l ? l : r;",
        "  if (l->prio > r->prio) {",
        "    l->right = merge(l->right, r); return l;",
        "  } else {",
        "    r->left = merge(l, r->left); return r;",
        "  }",
        "}",
      ]} />

      <h3>Insert / Erase</h3>
      <CodeBlock code={[
        "// Insert(t, key, prio):",
        "//   split(t, key, l, r);",
        "//   newNode = {key, prio};",
        "//   t = merge(merge(l, newNode), r);",
        "",
        "// Erase(t, key):",
        "//   split(t, key-1, l, mid);  // l = keys < key",
        "//   split(mid, key, killed, r);  // killed = the node",
        "//   delete killed;",
        "//   t = merge(l, r);",
      ]} />

      <h3>Implicit Treap (treat key เป็น index)</h3>
      <p>เก็บ <b>size ของ subtree</b> แทน key → ใช้แทน <b>array</b> ที่ insert/erase ตรงกลางได้ O(log N)</p>
      <p>ทำได้: reverse sub-array, sum sub-array, rotate — ทรงพลังมาก</p>

      <h3>เทียบกับ Self-Balancing BST อื่น ๆ</h3>
      <table style={{ width: '100%', background: 'var(--bg-2)', borderRadius: 10, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--bg-3)' }}>
          <tr><th style={{ padding: 8 }}>BST</th><th>Code length</th><th>Performance</th></tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>AVL</td><td>กลาง</td><td>strict balance, query เร็ว</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Red-Black</td><td>ยาว</td><td>insert เร็ว (used in STL set)</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Treap</td><td><b>สั้น</b></td><td>expected O(log N) — เขียนใน contest ได้</td></tr>
          <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: 8 }}>Splay</td><td>กลาง</td><td>amortized O(log N), self-adjusting</td></tr>
        </tbody>
      </table>

      <div className="callout" style={{ background: 'rgba(248,113,113,0.1)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8 }}>
        <b style={{ color: 'var(--danger)' }}>⚠️ Pitfalls</b>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>ใช้ rand() ดีพอ</b> — มี 32-bit range — แต่ <b>mt19937</b> ดีกว่า</li>
          <li><b>Implicit treap update size</b> — หลัง split/merge ต้อง update size ของ node ที่เปลี่ยน</li>
          <li>ใช้ <b>persistent treap</b> ทำให้ rollback ได้</li>
        </ul>
      </div>

      <h3>ดูเพิ่ม</h3>
      <p>📚 <a href="#/bst" style={{ color: 'var(--accent)' }}>BST (บท 17)</a> — basic concept</p>
      <p>📚 <a href="#/avl-tree" style={{ color: 'var(--accent)' }}>AVL Tree (บท 17b)</a> — strict balance alternative</p>
      <p>📚 <a href="#/stl-set-map" style={{ color: 'var(--accent)' }}>std::set/map (บท 15b)</a> — Red-Black tree (built-in)</p>

      <Quiz28
        q="ทำไม Treap height = O(log N) คาดหวัง?"
        options={[
          "เพราะ AVL rotate",
          "เพราะ random priority สร้าง heap ≡ insert random order BST",
          "เพราะ red-black coloring",
          "เพราะ explicit rebalance"
        ]}
        answer={1}
        explain="Treap ≡ insert ในลำดับ random ของ priority → expected height O(log N)"
      />
      <Quiz28
        q="split(t, k) แยกอะไร?"
        options={[
          "Tree ตาม priority",
          "Tree เป็น 2 ส่วน: key ≤ k และ key > k",
          "ลบ key k",
          "เพิ่ม key k"
        ]}
        answer={1}
        explain="คำตอบ: split คือ partition tree ตาม key — keep BST + heap property"
      />
      <Quiz28
        q="Implicit Treap ใช้แทนอะไรได้?"
        options={[
          "Hash table",
          "Array ที่ insert/erase กลางได้ O(log N)",
          "Heap",
          "Linked list"
        ]}
        answer={1}
        explain="ใช้ size แทน key — index-based access แบบ array แต่ insert กลาง = O(log N)"
      />
    </React.Fragment>
  );
};

window.LessonsPart28 = Lessons28;
