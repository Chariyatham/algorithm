/* Lessons Part 19 — Advanced Strings: Z-algorithm, Suffix Array, Manacher, Aho-Corasick */

const { useState: useS19, useMemo: useM19 } = React;
const CodeViewToggle19 = window.CodeViewToggle;

/* ============================================================
   CODE: Z-Algorithm (Full + Short)
============================================================ */
const Z_FULL = [
  "// Z[i] = ความยาว substring เริ่มที่ i ที่ตรงกับ prefix ของ s",       // 0
  "vector<int> zFunction(const string& s) {",                       // 1
  "  int n = s.size();",                                            // 2
  "  vector<int> z(n, 0);",                                         // 3
  "  int l = 0, r = 0;            // current Z-box [l..r)",         // 4
  "  for (int i = 1; i < n; i++) {",                                // 5
  "    if (i < r) {",                                               // 6
  "      // ใช้ค่า Z จาก mirror",                                     // 7
  "      z[i] = min(r - i, z[i - l]);",                             // 8
  "    }",                                                          // 9
  "    // ขยาย match",                                              // 10
  "    while (i + z[i] < n && s[z[i]] == s[i + z[i]])",             // 11
  "      z[i]++;",                                                  // 12
  "    // อัพเดต Z-box ถ้าขยายไปไกลกว่า",                              // 13
  "    if (i + z[i] > r) {",                                        // 14
  "      l = i;",                                                   // 15
  "      r = i + z[i];",                                            // 16
  "    }",                                                          // 17
  "  }",                                                            // 18
  "  return z;",                                                    // 19
  "}",                                                              // 20
];
const Z_SHORT = [
  "vector<int> zFunction(const string& s) {",                       // 0
  "  // Single linear pass with Z-box optimization",                // 1
  "  // (mirror lookup + extend + update box) — no helpers",        // 2
  "  // Time O(n) — see Full mode",                                 // 3
  "  return z;",                                                    // 4
  "}",                                                              // 5
];

/* ============================================================
   CODE: Z-Algorithm Pattern Matching (Full + Short)
============================================================ */
const Z_MATCH_FULL = [
  "vector<int> findPattern(const string& text, const string& pat) {", // 0
  "  // Concat: pat + '$' + text  ($ ไม่อยู่ใน alphabet)",            // 1
  "  string combined = pat + \"$\" + text;",                        // 2
  "  vector<int> z = zFunction(combined);",                         // 3
  "  vector<int> matches;",                                         // 4
  "  int m = pat.size();",                                          // 5
  "  // Z[i] == m → เจอ match ที่ตำแหน่ง i - m - 1 ใน text",          // 6
  "  for (int i = m + 1; i < (int)combined.size(); i++)",           // 7
  "    if (z[i] == m)",                                             // 8
  "      matches.push_back(i - m - 1);",                            // 9
  "  return matches;",                                              // 10
  "}",                                                              // 11
];
const Z_MATCH_SHORT = [
  "vector<int> findPattern(const string& text, const string& pat) {", // 0
  "  string combined = pat + \"$\" + text;",                        // 1
  "  vector<int> z = zFunction(combined);  // ← helper",            // 2
  "  // หา position ที่ z[i] == |pat|",                              // 3
  "  // → match at i - |pat| - 1",                                  // 4
  "  return matches;",                                              // 5
  "}",                                                              // 6
];

/* ============================================================
   CODE: Suffix Array + LCP Kasai (Full + Short)
============================================================ */
const SUFFIX_ARRAY_FULL = [
  "// O(n log² n) — sort suffixes by first 2^k chars iteratively",  // 0
  "vector<int> buildSA(const string& s) {",                         // 1
  "  int n = s.size();",                                            // 2
  "  vector<int> sa(n), rank(n), tmp(n);",                          // 3
  "  for (int i = 0; i < n; i++) { sa[i] = i; rank[i] = s[i]; }",   // 4
  "",                                                               // 5
  "  for (int k = 1; k < n; k *= 2) {",                             // 6
  "    auto cmp = [&](int a, int b) {",                             // 7
  "      if (rank[a] != rank[b]) return rank[a] < rank[b];",        // 8
  "      int ra = a+k < n ? rank[a+k] : -1;",                       // 9
  "      int rb = b+k < n ? rank[b+k] : -1;",                       // 10
  "      return ra < rb;",                                          // 11
  "    };",                                                         // 12
  "    sort(sa.begin(), sa.end(), cmp);",                           // 13
  "    tmp[sa[0]] = 0;",                                            // 14
  "    for (int i = 1; i < n; i++)",                                // 15
  "      tmp[sa[i]] = tmp[sa[i-1]] + (cmp(sa[i-1], sa[i]) ? 1 : 0);", // 16
  "    rank = tmp;",                                                // 17
  "  }",                                                            // 18
  "  return sa;",                                                   // 19
  "}",                                                              // 20
  "",                                                               // 21
  "// Kasai's algorithm — LCP[i] = lcp(SA[i-1], SA[i]), O(n)",      // 22
  "vector<int> buildLCP(const string& s, vector<int>& sa) {",       // 23
  "  int n = s.size();",                                            // 24
  "  vector<int> rank(n), lcp(n);",                                 // 25
  "  for (int i = 0; i < n; i++) rank[sa[i]] = i;",                 // 26
  "  int h = 0;",                                                   // 27
  "  for (int i = 0; i < n; i++) {",                                // 28
  "    if (rank[i] > 0) {",                                         // 29
  "      int j = sa[rank[i] - 1];",                                 // 30
  "      while (i+h < n && j+h < n && s[i+h] == s[j+h]) h++;",      // 31
  "      lcp[rank[i]] = h;",                                        // 32
  "      if (h > 0) h--;",                                          // 33
  "    }",                                                          // 34
  "  }",                                                            // 35
  "  return lcp;",                                                  // 36
  "}",                                                              // 37
];
const SUFFIX_ARRAY_SHORT = [
  "// Build Suffix Array + LCP in 2 steps",                         // 0
  "vector<int> sa = buildSA(s);          // ← helper: O(n log² n)", // 1
  "vector<int> lcp = buildLCP(s, sa);    // ← helper: Kasai O(n)",  // 2
  "// sa[i] = start position of i-th smallest suffix",              // 3
  "// lcp[i] = longest common prefix of sa[i-1] and sa[i]",         // 4
];

/* ============================================================
   CODE: Manacher (Full + Short)
============================================================ */
const MANACHER_FULL = [
  "// Manacher: longest palindromic substring in O(n)",             // 0
  "string manacher(const string& s) {",                             // 1
  "  // Insert # between chars to handle odd/even uniformly",       // 2
  "  string t = \"^#\";",                                           // 3
  "  for (char c : s) { t += c; t += '#'; }",                       // 4
  "  t += '$';",                                                    // 5
  "  int n = t.size();",                                            // 6
  "  vector<int> p(n, 0);",                                         // 7
  "  int c = 0, r = 0;            // center, right boundary",       // 8
  "",                                                               // 9
  "  for (int i = 1; i < n - 1; i++) {",                            // 10
  "    int mirror = 2 * c - i;",                                    // 11
  "    if (i < r) p[i] = min(r - i, p[mirror]);",                   // 12
  "    while (t[i + (1 + p[i])] == t[i - (1 + p[i])])",             // 13
  "      p[i]++;",                                                  // 14
  "    if (i + p[i] > r) {",                                        // 15
  "      c = i; r = i + p[i];",                                     // 16
  "    }",                                                          // 17
  "  }",                                                            // 18
  "",                                                               // 19
  "  // Find max p[i] and extract palindrome",                      // 20
  "  int maxLen = 0, centerIdx = 0;",                               // 21
  "  for (int i = 1; i < n - 1; i++)",                              // 22
  "    if (p[i] > maxLen) { maxLen = p[i]; centerIdx = i; }",       // 23
  "  int start = (centerIdx - maxLen) / 2;",                        // 24
  "  return s.substr(start, maxLen);",                              // 25
  "}",                                                              // 26
];
const MANACHER_SHORT = [
  "string manacher(const string& s) {",                             // 0
  "  string t = preprocess(s);        // ← helper: insert #",        // 1
  "  vector<int> p = expandRadii(t);  // ← helper: mirror + expand",// 2
  "  return extractLongest(s, p);     // ← helper: max p[i]",       // 3
  "}             // O(n) total",                                    // 4
];

/* ============================================================
   CODE: Aho-Corasick (Full + Short)
============================================================ */
const AHO_FULL = [
  "// Aho-Corasick: multi-pattern matching in O(n + m + z)",        // 0
  "struct ACNode {",                                                // 1
  "  map<char, int> next;",                                         // 2
  "  int fail = 0;",                                                // 3
  "  vector<int> output;       // patterns ending here",            // 4
  "};",                                                             // 5
  "vector<ACNode> trie(1);     // index 0 = root",                  // 6
  "",                                                               // 7
  "void addPattern(const string& p, int id) {",                     // 8
  "  int u = 0;",                                                   // 9
  "  for (char c : p) {",                                           // 10
  "    if (!trie[u].next.count(c)) {",                              // 11
  "      trie[u].next[c] = trie.size();",                           // 12
  "      trie.push_back({});",                                      // 13
  "    }",                                                          // 14
  "    u = trie[u].next[c];",                                       // 15
  "  }",                                                            // 16
  "  trie[u].output.push_back(id);",                                // 17
  "}",                                                              // 18
  "",                                                               // 19
  "void buildFailureLinks() {",                                     // 20
  "  queue<int> q;",                                                // 21
  "  for (auto& [c, v] : trie[0].next) q.push(v);",                 // 22
  "  while (!q.empty()) {",                                         // 23
  "    int u = q.front(); q.pop();",                                // 24
  "    for (auto& [c, v] : trie[u].next) {",                        // 25
  "      int f = trie[u].fail;",                                    // 26
  "      while (f && !trie[f].next.count(c)) f = trie[f].fail;",    // 27
  "      trie[v].fail = trie[f].next.count(c) && trie[f].next[c] != v", // 28
  "                     ? trie[f].next[c] : 0;",                    // 29
  "      // merge output ของ fail node (matches ทุก suffix pattern)", // 30
  "      for (int id : trie[trie[v].fail].output)",                 // 31
  "        trie[v].output.push_back(id);",                          // 32
  "      q.push(v);",                                               // 33
  "    }",                                                          // 34
  "  }",                                                            // 35
  "}",                                                              // 36
  "",                                                               // 37
  "vector<pair<int,int>> search(const string& text) {",             // 38
  "  vector<pair<int,int>> hits;     // (position, pattern_id)",    // 39
  "  int u = 0;",                                                   // 40
  "  for (int i = 0; i < (int)text.size(); i++) {",                 // 41
  "    char c = text[i];",                                          // 42
  "    while (u && !trie[u].next.count(c)) u = trie[u].fail;",      // 43
  "    if (trie[u].next.count(c)) u = trie[u].next[c];",            // 44
  "    for (int id : trie[u].output) hits.push_back({i, id});",     // 45
  "  }",                                                            // 46
  "  return hits;",                                                 // 47
  "}",                                                              // 48
];
const AHO_SHORT = [
  "void buildAhoCorasick(vector<string>& patterns) {",              // 0
  "  for (int i = 0; i < patterns.size(); i++)",                    // 1
  "    addPattern(patterns[i], i);     // ← helper: insert to trie",// 2
  "  buildFailureLinks();              // ← helper: BFS layer",     // 3
  "}",                                                              // 4
  "",                                                               // 5
  "vector<pair<int,int>> search(const string& text) {",             // 6
  "  // walk text char-by-char, follow fail links on mismatch",     // 7
  "  // emit all hits via output sets",                             // 8
  "  return hits;             // O(n + total |P| + z)",             // 9
  "}",                                                              // 10
];
const { Quiz: Quiz19 } = window.LessonComponents;
const { WorkedExample: WE19, CheatSheet: CS19, Pitfalls: PF19 } = window.LearningKit;

const Lessons19 = {};

/* ============================================================
   Shared Viz — Manacher (palindrome center expand)
============================================================ */
function ManacherViz() {
  const [s, setS] = useS19("abacaba");
  const t = '^#' + s.split('').join('#') + '#$';
  const [center, setCenter] = useS19(1);

  // compute palindrome radius at center (in t coords)
  const radius = useM19(() => {
    let r = 0;
    while (t[center - 1 - r] === t[center + 1 + r] && center - 1 - r >= 0 && center + 1 + r < t.length) r++;
    return r;
  }, [center, t]);

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <input value={s} onChange={e => { setS(e.target.value); setCenter(1); }} style={{ width: 200, padding: '4px 8px', background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
        <button onClick={() => setCenter(c => Math.max(1, c - 1))}>◀</button>
        <button onClick={() => setCenter(c => Math.min(t.length - 2, c + 1))}>▶</button>
        <span style={{ color: 'var(--text-2)', fontSize: 12 }}>center idx = {center}, radius = <b style={{ color: 'var(--accent-2)' }}>{radius}</b></span>
      </div>

      <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 6, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', minWidth: 'min-content' }}>
          {t.split('').map((c, i) => {
            const isCenter = i === center;
            const inRange = Math.abs(i - center) <= radius && i !== 0 && i !== t.length - 1;
            const isBound = i === 0 || i === t.length - 1;
            return (
              <div key={i} style={{
                width: 24, height: 32, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: isBound ? 'transparent' : (isCenter ? 'var(--accent)' : (inRange ? 'rgba(94,234,212,0.2)' : 'var(--bg-3)')),
                color: isCenter ? '#000' : (c === '#' ? 'var(--text-3)' : 'var(--text-0)'),
                border: isBound ? 'none' : '1px solid ' + (isCenter ? 'var(--accent)' : (inRange ? 'var(--accent-2)' : 'var(--border)')),
                borderRadius: 4, fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s'
              }}>
                <div>{c}</div>
                <div style={{ fontSize: 8, color: 'var(--text-3)' }}>{i}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 }}>
        t (with separators): "{t}"<br />
        palindrome at center {center} = "{t.slice(center - radius, center + radius + 1).replace(/#/g, '')}" (len {radius})
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 Insert <code>#</code> ทุก char → odd/even palindrome เป็น odd หมด. radius ขยายจาก center จน mismatch
      </div>
    </div>
  );
}

/* ============================================================
   Shared Viz — Aho-Corasick (trie + failure links)
============================================================ */
function AhoCorasickViz() {
  // Patterns: he, she, his, hers (classic Aho-Corasick example)
  // Compute trie nodes + failure links statically
  const nodes = [
    { id: 0, label: 'root', ch: '', x: 200, y: 30, fail: null, output: null },
    { id: 1, label: 'h', ch: 'h', x: 120, y: 90, fail: 0, output: null },
    { id: 2, label: 'he', ch: 'e', x: 90, y: 150, fail: 0, output: 'he' },
    { id: 3, label: 'her', ch: 'r', x: 60, y: 210, fail: 0, output: null },
    { id: 4, label: 'hers', ch: 's', x: 30, y: 270, fail: 8, output: 'hers' },
    { id: 5, label: 'hi', ch: 'i', x: 150, y: 150, fail: 0, output: null },
    { id: 6, label: 'his', ch: 's', x: 150, y: 210, fail: 8, output: 'his' },
    { id: 7, label: 's', ch: 's', x: 280, y: 90, fail: 0, output: null },
    { id: 8, label: 'sh', ch: 'h', x: 280, y: 150, fail: 1, output: null },
    { id: 9, label: 'she', ch: 'e', x: 280, y: 210, fail: 2, output: 'she' },
  ];
  const trieEdges = [[0,1],[1,2],[2,3],[3,4],[1,5],[5,6],[0,7],[7,8],[8,9]];
  const [showFail, setShowFail] = useS19(true);

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div className="dsv" style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 12 }}>
      <div className="ctrls" style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Patterns: <b>he, she, his, hers</b></span>
        <button onClick={() => setShowFail(f => !f)} style={{ background: showFail ? 'var(--accent)' : 'var(--bg-3)', color: showFail ? '#000' : 'var(--text-1)' }}>{showFail ? '✓' : '○'} Show failure links</button>
      </div>

      <svg width="100%" viewBox="0 0 360 310" style={{ background: 'var(--bg-1)', borderRadius: 6 }}>
        <defs>
          <marker id="ac-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--text-2)" />
          </marker>
          <marker id="ac-fail" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* Trie edges */}
        {trieEdges.map(([u, v], i) => {
          const pu = nodeMap[u], pv = nodeMap[v];
          return (
            <g key={'te' + i}>
              <line x1={pu.x} y1={pu.y + 12} x2={pv.x} y2={pv.y - 12} stroke="var(--text-2)" strokeWidth={1.5} />
              <text x={(pu.x + pv.x) / 2 + 5} y={(pu.y + pv.y) / 2} fill="var(--accent)" fontSize="11" fontWeight="700">{pv.ch}</text>
            </g>
          );
        })}

        {/* Failure links (yellow dashed) */}
        {showFail && nodes.map(n => {
          if (n.fail === null) return null;
          const fail = nodeMap[n.fail];
          return (
            <line key={'fl' + n.id}
              x1={n.x} y1={n.y} x2={fail.x} y2={fail.y}
              stroke="#fbbf24" strokeWidth={1} strokeDasharray="3,3" opacity={0.6}
              markerEnd="url(#ac-fail)" />
          );
        })}

        {/* Nodes */}
        {nodes.map(n => (
          <g key={'n' + n.id}>
            <circle cx={n.x} cy={n.y} r={14}
              fill={n.id === 0 ? 'rgba(168,139,250,0.3)' : (n.output ? 'rgba(16,185,129,0.3)' : 'var(--bg-3)')}
              stroke={n.output ? '#10b981' : 'var(--accent-2)'} strokeWidth={n.output ? 2.5 : 2} />
            <text x={n.x} y={n.y + 4} fill="var(--text-0)" fontSize="11" fontWeight="700" textAnchor="middle">{n.id}</text>
            {n.output && <text x={n.x} y={n.y + 30} fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">{n.output}</text>}
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(220, 250)">
          <text x={0} y={0} fill="var(--text-2)" fontSize="10">▬ trie edge</text>
          <text x={0} y={14} fill="#fbbf24" fontSize="10">⤍ failure link</text>
          <text x={0} y={28} fill="#10b981" fontSize="10">● pattern end</text>
        </g>
      </svg>

      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        💡 <b>Failure link</b> = longest proper suffix ของ current path ที่<b>เป็น prefix</b> ของ pattern ใด ๆ → ใช้ "jump" เมื่อ mismatch
      </div>
    </div>
  );
}

/* ============================================================
   85 — Z-ALGORITHM
============================================================ */
function ZAlgViz() {
  const [s, setS] = useS19("aabxaayaab");
  const result = useM19(() => {
    const n = s.length;
    const z = new Array(n).fill(0);
    let l = 0, r = 0;
    for (let i = 1; i < n; i++) {
      if (i < r) z[i] = Math.min(r - i, z[i - l]);
      while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
      if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    return z;
  }, [s]);

  return (
    <div className="dsv">
      <div className="ctrls">
        <input value={s} onChange={e => setS(e.target.value)} style={{ width: 200, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
      </div>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13, marginTop: 10 }}>
        <thead>
          <tr><th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>i</th>
            {s.split('').map((_, i) => <th key={i} style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)', minWidth: 30 }}>{i}</th>)}</tr>
        </thead>
        <tbody>
          <tr><th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>s[i]</th>
            {s.split('').map((c, i) => <td key={i} style={{ padding: '6px 10px', textAlign: 'center', background: 'var(--bg-2)', border: '1px solid var(--bg-3)' }}>{c}</td>)}</tr>
          <tr><th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--accent-2)' }}>Z[i]</th>
            {result.map((z, i) => <td key={i} style={{ padding: '6px 10px', textAlign: 'center', background: z > 0 ? 'rgba(94,234,212,0.15)' : 'var(--bg-2)', color: z > 0 ? 'var(--accent-2)' : 'var(--text-2)', border: '1px solid var(--bg-3)', fontWeight: 600 }}>{z}</td>)}</tr>
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
        Z[i] = length of longest substring starting at i that matches prefix of s (Z[0] = 0 by convention)
      </div>
    </div>
  );
}

Lessons19["z-algorithm"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⚡ Z-Algorithm — O(n) Pattern Matching</div>
        คำนวณ <b>Z-array</b>: Z[i] = ยาวสุดของ substring starting at i ที่ตรงกับ prefix ของ s
      </div>

      <h3>Interactive Visualizer</h3>
      <ZAlgViz />

      <h3>ทำไม O(n)?</h3>
      <p>
        ใช้ <b>Z-box</b> [l, r] — interval ของ prefix ที่ match ล่าสุด<br/>
        ทุก iteration จะ <b>extend r forward เท่านั้น</b> → r monotonic → amortized O(n)
      </p>

      <h3>Z-Function — C++ Code</h3>
      <CodeViewToggle19
        code={Z_FULL}
        codeShort={Z_SHORT}
        helperName="Z-box (no separate helper)"
      />

      <WE19
        title="Trace: s = 'aabxaayaab'"
        problem="คำนวณ Z-array"
        steps={[
          { title: "i=1 ('a' vs 'a')", body: "match 1 char ('a'), then 'a' vs 'b' mismatch\n→ Z[1] = 1, l=1, r=2", why: "Direct comparison" },
          { title: "i=2 ('a' vs 'a')", body: "Wait, s[2]='b' vs s[0]='a' → no match\nZ[2] = 0", why: "No prefix match" },
          { title: "i=3 ('x')", body: "s[3]='x' vs s[0]='a' → Z[3] = 0", why: "" },
          { title: "i=4 ('a')", body: "s[4]='a' s[5]='a' s[6]='y' vs s[0]='a' s[1]='a' s[2]='b' → match 2\nZ[4] = 2, l=4, r=6", why: "Match aa, mismatch at 3rd" },
          { title: "i=5 (inside Z-box)", body: "i=5 &lt; r=6: z[5-l] = z[1] = 1\nz[5] = min(r-i, z[1]) = min(1, 1) = 1\nTry extend: s[6]='y' vs s[1]='a' no\nZ[5] = 1", why: "Reuse Z[1]" },
          { title: "i=7 (จุดสำคัญ — ‘aab’ matches)", body: "s[7]='a' s[8]='a' s[9]='b' vs s[0..2]='a' 'a' 'b' → match 3\nZ[7] = 3, l=7, r=10", why: "Full prefix match" },
        ]}
        answer="Z = [0, 1, 0, 0, 2, 1, 0, 3, 0, 0] ▢"
        takeaway="Z-box trick = key to O(n)"
      />

      <h3>Pattern Matching via Z-Algorithm — C++ Code</h3>
      <CodeViewToggle19
        code={Z_MATCH_FULL}
        codeShort={Z_MATCH_SHORT}
        helperName="zFunction()"
      />

      <h3>Z-Algorithm vs KMP</h3>
      <table className="cmp">
        <thead><tr><th></th><th>KMP</th><th>Z-Algorithm</th></tr></thead>
        <tbody>
          <tr><td>Time</td><td>O(n + m)</td><td>O(n + m)</td></tr>
          <tr><td>Preprocessing</td><td>Failure/LPS array</td><td>Z-array</td></tr>
          <tr><td>Pattern shape</td><td>Online (stream)</td><td>Offline (need full text)</td></tr>
          <tr><td>Implementation</td><td>Tricky (LPS)</td><td>Simpler (single function)</td></tr>
          <tr><td>Use case</td><td>String matching</td><td>String matching, periodicity, palindrome variants</td></tr>
        </tbody>
      </table>

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>String matching:</b> as shown above</li>
        <li><b>Periodicity:</b> smallest period of s = smallest p such that Z[p] ≥ n - p</li>
        <li><b>Longest palindromic prefix:</b> combined = s + '#' + reverse(s)</li>
        <li><b>Number of occurrences:</b> count i where Z[i] ≥ |P|</li>
      </ul>

      <CS19 title="Z-Algorithm Cheat Sheet" sections={[
        { label: "Z[i]", value: "Longest substring starting at i matching prefix" },
        { label: "Time", value: "O(n) due to Z-box invariant" },
        { label: "Pattern match", value: "Z(P + '$' + T) → find Z[i] = |P|" },
        { label: "Z-box [l, r]", value: "Right-most matched prefix interval" },
      ]} />

      <Quiz19 q={{
        question: "Z[0] เป็นเท่าใดตามนิยาม?",
        options: ["0 (by convention)", "len(s)", "1", "Undefined"],
        answer: 0,
        explain: "Z[0] = 0 by convention (เพราะ ‘substring เริ่มที่ 0 match prefix’ = ทั้ง s ซึ่งไม่มีประโยชน์)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   86 — SUFFIX ARRAY + LCP (KASAI)
============================================================ */
function SuffixArrayViz() {
  const [s, setS] = useS19("banana");
  const result = useM19(() => {
    const n = s.length;
    const suffixes = [];
    for (let i = 0; i < n; i++) suffixes.push({ idx: i, suf: s.slice(i) });
    suffixes.sort((a, b) => a.suf.localeCompare(b.suf));
    const sa = suffixes.map(x => x.idx);
    // LCP via Kasai
    const rank = new Array(n).fill(0);
    for (let i = 0; i < n; i++) rank[sa[i]] = i;
    const lcp = new Array(n).fill(0);
    let h = 0;
    for (let i = 0; i < n; i++) {
      if (rank[i] > 0) {
        const j = sa[rank[i] - 1];
        while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
        lcp[rank[i]] = h;
        if (h > 0) h--;
      } else h = 0;
    }
    return { sa, suffixes, lcp };
  }, [s]);

  return (
    <div className="dsv">
      <div className="ctrls">
        <input value={s} onChange={e => setS(e.target.value)} style={{ width: 200, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
      </div>
      <table style={{ fontFamily: 'monospace', fontSize: 13, marginTop: 10, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>Rank</th>
            <th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>SA[i]</th>
            <th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>Suffix</th>
            <th style={{ background: 'var(--bg-3)', padding: '6px 10px', color: 'var(--text-2)' }}>LCP[i]</th>
          </tr>
        </thead>
        <tbody>
          {result.suffixes.map((x, i) => (
            <tr key={i}>
              <td style={{ padding: '4px 10px', textAlign: 'center', background: 'var(--bg-2)', border: '1px solid var(--bg-3)' }}>{i}</td>
              <td style={{ padding: '4px 10px', textAlign: 'center', background: 'var(--bg-2)', color: 'var(--accent)', fontWeight: 600, border: '1px solid var(--bg-3)' }}>{x.idx}</td>
              <td style={{ padding: '4px 10px', background: 'var(--bg-2)', border: '1px solid var(--bg-3)' }}>{x.suf}</td>
              <td style={{ padding: '4px 10px', textAlign: 'center', background: result.lcp[i] > 0 ? 'rgba(94,234,212,0.1)' : 'var(--bg-2)', color: result.lcp[i] > 0 ? 'var(--accent-2)' : 'var(--text-2)', fontWeight: 600, border: '1px solid var(--bg-3)' }}>{result.lcp[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Lessons19["suffix-array"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📚 Suffix Array + LCP</div>
        <b>SA[i]</b> = starting index of i-th smallest suffix (sorted lexicographically)<br/>
        <b>LCP[i]</b> = longest common prefix of SA[i-1] and SA[i]<br/>
        Together: powerful preprocessing for many string queries
      </div>

      <h3>Interactive</h3>
      <SuffixArrayViz />

      <h3>Construction</h3>
      <table className="cmp">
        <thead><tr><th>Algorithm</th><th>Time</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>Naive (sort all suffixes)</td><td>O(n² log n)</td><td>Easy to code</td></tr>
          <tr><td>Manber-Myers (doubling)</td><td>O(n log² n)</td><td>Common contest implementation</td></tr>
          <tr><td>SA-IS (suffix automaton inspired)</td><td>O(n)</td><td>State of the art</td></tr>
          <tr><td>DC3 (Skew algorithm)</td><td>O(n)</td><td>Karkkainen-Sanders</td></tr>
        </tbody>
      </table>

      <h3>Suffix Array + LCP — C++ Code</h3>
      <CodeViewToggle19
        code={SUFFIX_ARRAY_FULL}
        codeShort={SUFFIX_ARRAY_SHORT}
        helperName="buildSA() + buildLCP()"
      />

      <WE19
        title="Why is Kasai's O(n)?"
        problem="Prove time complexity"
        steps={[
          { title: "Key invariant", body: "After processing index i: h = LCP value for rank[i]\nFor next i+1: h decreases by ≤ 1, then extends", why: "Kasai's clever observation" },
          { title: "Amortized analysis", body: "Total h increases ≤ n (h ≤ n always)\nTotal h decreases ≤ n (decrease by 1 per i)\n→ Total work = O(n)", why: "" },
        ]}
        answer="Kasai's = O(n) ▢"
      />

      <h3>Applications</h3>
      <table className="cmp">
        <thead><tr><th>Application</th><th>Method</th></tr></thead>
        <tbody>
          <tr><td>Pattern search (count occurrences)</td><td>Binary search on SA — O(m log n) per query</td></tr>
          <tr><td>Longest Repeated Substring</td><td>max(LCP[i]) — direct</td></tr>
          <tr><td>Longest Common Substring of 2 strings</td><td>Concat s1 + '#' + s2 → max LCP between suffixes from different strings</td></tr>
          <tr><td>Distinct substrings count</td><td>Σ (n - SA[i] - LCP[i]) for i</td></tr>
          <tr><td>Bowtie / BWA aligners (bioinformatics)</td><td>FM-Index = SA + BWT</td></tr>
        </tbody>
      </table>

      <WE19
        title="Distinct Substrings Count"
        problem="นับจำนวน distinct substring ของ s"
        steps={[
          { title: "Observation", body: "Total substrings = n(n+1)/2 (including duplicates)\nDistinct = total - duplicates", why: "" },
          { title: "Per suffix", body: "Suffix SA[i] contributes (n - SA[i]) substrings (all prefixes)\nDuplicate with previous suffix = LCP[i] substrings\n→ contributes (n - SA[i] - LCP[i])", why: "Substract overlap" },
          { title: "Sum", body: "Total distinct = Σ (n - SA[i] - LCP[i]) for i = 0..n-1", why: "Linear time" },
        ]}
        answer="O(n) after SA + LCP build ▢"
      />

      <CS19 title="Suffix Array Cheat Sheet" sections={[
        { label: "SA[i]", value: "i-th smallest suffix's starting index" },
        { label: "LCP[i]", value: "LCP(SA[i-1], SA[i])" },
        { label: "Build", value: "Manber-Myers O(n log² n)<br/>SA-IS O(n)" },
        { label: "LCP build", value: "Kasai O(n) using rank[]" },
        { label: "Pattern search", value: "Binary search O(m log n)" },
      ]} />

      <PF19 items={[
        { trap: "Sort suffixes naively → string copy ทั้ง", fix: "ใช้ <b>indices + comparator</b> ไม่ใช่ string objects" },
        { trap: "ไม่ใช้ sentinel — boundary issues", fix: "Append '$' หรือ '#' (alphabet smaller than all) เพื่อ unique suffix lengths" },
        { trap: "Confusing rank vs SA", fix: "<b>SA[i]</b> = idx ของ rank i<br/><b>rank[i]</b> = rank ของ suffix เริ่มที่ idx i" },
      ]} />

      <Quiz19 q={{
        question: "For s = 'banana', LCP array values?",
        options: [
          "[0, 1, 3, 0, 0, 2]",
          "[0, 1, 3, 0, 2, 0]",
          "[0, 1, 3, 2, 0, 1]",
          "[0, 3, 1, 0, 0, 2]"
        ],
        answer: 0,
        explain: "Sorted suffixes: 'a' (5), 'ana' (3), 'anana' (1), 'banana' (0), 'na' (4), 'nana' (2). LCPs: 0, 1 (a vs ana), 3 (ana vs anana), 0 (anana vs banana), 0 (banana vs na), 2 (na vs nana)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   87 — MANACHER (LONGEST PALINDROME)
============================================================ */
Lessons19["manacher"] = function () {
  const [s, setS] = useS19("babad");
  const result = useM19(() => {
    // Process with separators: "babad" → "^#b#a#b#a#d#$"
    const t = '^#' + s.split('').join('#') + '#$';
    const n = t.length;
    const p = new Array(n).fill(0);
    let c = 0, r = 0;
    for (let i = 1; i < n - 1; i++) {
      const mirror = 2 * c - i;
      if (i < r) p[i] = Math.min(r - i, p[mirror]);
      while (t[i + (1 + p[i])] === t[i - (1 + p[i])]) p[i]++;
      if (i + p[i] > r) { c = i; r = i + p[i]; }
    }
    let maxLen = 0, centerIdx = 0;
    for (let i = 1; i < n - 1; i++) {
      if (p[i] > maxLen) { maxLen = p[i]; centerIdx = i; }
    }
    const start = (centerIdx - maxLen) / 2;
    const palindrome = s.substr(start, maxLen);
    return { t, p, palindrome, maxLen };
  }, [s]);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔄 Manacher — Longest Palindromic Substring in O(n)</div>
        Naive: O(n²) checking each center<br/>
        Manacher: O(n) using mirror property
      </div>

      <div className="dsv">
        <div className="ctrls">
          <input value={s} onChange={e => setS(e.target.value)} style={{ width: 200, padding: '4px 8px', background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 4 }} />
          <span style={{ color: 'var(--accent-2)' }}>Longest palindrome: <b>{result.palindrome || '∅'}</b> (length {result.maxLen})</span>
        </div>
      </div>

      <h3>🎬 Interactive — เลื่อน center ดู palindrome radius</h3>
      <ManacherViz />

      <h3>Manacher — C++ Code</h3>
      <CodeViewToggle19
        code={MANACHER_FULL}
        codeShort={MANACHER_SHORT}
        helperName="preprocess/expandRadii/extract"
      />

      <WE19
        title="Why O(n)?"
        problem="Same amortized argument as Z-algorithm"
        steps={[
          { title: "r is monotonically increasing", body: "Every iteration either:\n1. Don't extend (cheap)\n2. Extend → r increases", why: "Z-box invariant" },
          { title: "Total extension work", body: "r increases by ≥1 per extension, capped at n\n→ Total extensions ≤ n", why: "" },
          { title: "Total time", body: "n iterations + n extensions = O(n)", why: "" },
        ]}
        answer="Manacher = O(n) ▢"
      />

      <h3>Why Separators?</h3>
      <p>
        Without separators: "aba" (odd) and "abba" (even) need different handling.<br/>
        With separators "#a#b#a#" and "#a#b#b#a#": both centers fall on actual chars or separators uniformly.
      </p>

      <h3>Comparison</h3>
      <table className="cmp">
        <thead><tr><th>Method</th><th>Time</th><th>Note</th></tr></thead>
        <tbody>
          <tr><td>Brute force (check all substrings)</td><td>O(n³)</td><td>Trivial</td></tr>
          <tr><td>Expand around centers</td><td>O(n²)</td><td>Simple, common</td></tr>
          <tr><td>DP (dp[i][j] = is palindrome)</td><td>O(n²) time + O(n²) space</td><td>Easy to remember</td></tr>
          <tr><td>Manacher</td><td>O(n)</td><td>Optimal</td></tr>
        </tbody>
      </table>

      <CS19 title="Manacher's Cheat Sheet" sections={[
        { label: "Time", value: "O(n) — optimal" },
        { label: "Trick", value: "Insert '#' between every char + boundary chars" },
        { label: "p[i]", value: "Palindrome radius centered at t[i]" },
        { label: "Mirror", value: "p[i] = min(r-i, p[mirror]) reuses earlier computation" },
      ]} />

      <Quiz19 q={{
        question: "Longest palindrome substring of 'babad'?",
        options: ["bab หรือ aba", "bba", "abab", "babad"],
        answer: 0,
        explain: "Both 'bab' and 'aba' are valid (length 3) — Manacher returns first found"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   88 — AHO-CORASICK (MULTI-PATTERN)
============================================================ */
Lessons19["aho-corasick"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🌳 Aho-Corasick — Multi-Pattern Matching</div>
        Match <b>หลาย patterns</b> ใน text พร้อมกัน — O(n + m + z) <br/>
        (n = text len, m = total pattern len, z = number of matches)
      </div>

      <h3>ปัญหา</h3>
      <p>
        ให้ patterns {`{P1, P2, ..., Pk}`} และ text T<br/>
        หา <b>ทุกตำแหน่ง</b> ที่ Pi ปรากฏใน T<br/><br/>
        Naive: run KMP k times = O(kn + total_pattern) — ช้าเมื่อ k ใหญ่<br/>
        Aho-Corasick: O(n + total_pattern + z) — แทบเป็น text length เท่านั้น
      </p>

      <h3>🎬 Interactive — Trie + Failure Links visualization</h3>
      <AhoCorasickViz />

      <h3>Algorithm Structure</h3>
      <ol style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li><b>Build Trie</b> from all patterns</li>
        <li><b>Build Failure Links</b> (BFS) — เหมือน KMP failure function</li>
        <li><b>Build Output Links</b> — pattern ที่จบที่ node ใด หรือ ancestor</li>
        <li><b>Scan text</b> — เดิน trie + failure link เมื่อ mismatch</li>
      </ol>

      <h3>Aho-Corasick — C++ Code (Build + Scan ครบ)</h3>
      <CodeViewToggle19
        code={AHO_FULL}
        codeShort={AHO_SHORT}
        helperName="addPattern + buildFailureLinks"
      />

      <WE19
        title="Trace: patterns={he, she, his, hers}, T='ushers'"
        problem="Find all occurrences"
        steps={[
          { title: "Build Trie", body: "Root\n├─ h → e* (he)\n│       └─ r → s* (hers)\n├─ s → h → e* (she)\n├─ h → i → s* (his)", why: "Common prefixes shared" },
          { title: "Build failure links (BFS)", body: "fail(he) = e? no e child of root → root\nfail(she.s) = root\nfail(she.sh) = h (root.h)\nfail(she.she) = he (h.e)\nfail(hers) follows similar pattern", why: "" },
          { title: "Scan 'ushers'", body: "u: root (no u)\ns: root → s\nh: s → sh\ne: sh → she*  → report 'she' at i=3\n   Also follow failure: she.fail = he* → report 'he' at i=3\nr: she → hers? follow fail to he → hers\ns: hers → hers* → report 'hers' at i=5", why: "" },
        ]}
        answer="Matches: 'she' at i=3, 'he' at i=3, 'hers' at i=5 ▢"
      />

      <h3>Applications</h3>
      <table className="cmp">
        <thead><tr><th>Domain</th><th>Use</th></tr></thead>
        <tbody>
          <tr><td>fgrep / spam filter</td><td>Match multiple keywords</td></tr>
          <tr><td>Intrusion Detection (Snort)</td><td>Match attack signatures</td></tr>
          <tr><td>Bioinformatics</td><td>Find DNA motifs</td></tr>
          <tr><td>Plagiarism detection</td><td>Match many phrases</td></tr>
          <tr><td>Compiler tokenizer (variant)</td><td>Match many keywords</td></tr>
        </tbody>
      </table>

      <h3>Why O(n + m + z)?</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li>Build trie: O(m)</li>
        <li>Build failure: O(m) — amortized (each node visited O(1) times)</li>
        <li>Scan: O(n) — each char advances current at most 1, fails decrease depth (amortized)</li>
        <li>Report: O(z) — z = total matches</li>
      </ol>

      <CS19 title="Aho-Corasick Cheat Sheet" sections={[
        { label: "Time", value: "O(n + m + z) total — linear in everything" },
        { label: "Space", value: "O(m × |Σ|) for trie" },
        { label: "Failure link", value: "Longest proper suffix that is also prefix of some pattern" },
        { label: "Output link", value: "Next pattern-ending ancestor via failure chain" },
      ]} />

      <PF19 items={[
        { trap: "ลืม output links → miss overlapping matches", fix: "Pattern ‘he’ และ ‘she’ ทั้งคู่จบที่ ‘she’ — ต้อง follow output chain" },
        { trap: "Failure link = root เสมอ", fix: "Failure link คือ <b>longest proper suffix</b> ที่อยู่ใน trie — อาจไม่ใช่ root" },
        { trap: "Naively rebuild for each query", fix: "Trie + links สร้างครั้งเดียว — query ได้หลายครั้ง" },
      ]} />

      <Quiz19 q={{
        question: "Aho-Corasick เร็วกว่า KMP รัน k ครั้ง เมื่อใด?",
        options: [
          "เมื่อ k = 1",
          "เมื่อ patterns มี common prefixes",
          "เมื่อ k มาก หรือ patterns share characters",
          "ทุกกรณี"
        ],
        answer: 2,
        explain: "AC shines เมื่อ k ใหญ่ — แชร์ trie + failure links → scan text ครั้งเดียว แทนที่จะ k ครั้ง"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart19 = Lessons19;
