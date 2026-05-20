/* Lessons Part 25 — C++ Sandbox + Learning Paths + Mock Exam 5 (Thai Uni style) */

const { useState: useS25, useEffect: useE25, useMemo: useM25 } = React;
const { Quiz: Quiz25 } = window.LessonComponents;
const { CheatSheet: CS25 } = window.LearningKit;

const Lessons25 = {};

/* ============================================================
   cpp-sandbox — C++ Online Compiler (link to Wandbox/Godbolt)
============================================================ */
const CPP_TEMPLATES = {
  "hello": {
    label: "👋 Hello World",
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Algorithm Academy!\\n";
    return 0;
}`
  },
  "vector-sort": {
    label: "📊 Vector + Sort",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<int> a = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    sort(a.begin(), a.end());

    for (int x : a) cout << x << " ";
    cout << "\\n";
    return 0;
}`
  },
  "bfs": {
    label: "🕸️ BFS Shortest Path",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 6;
    vector<vector<int>> adj(n);
    vector<pair<int,int>> edges = {{0,1},{0,2},{1,3},{2,3},{3,4},{4,5}};
    for (auto [u,v] : edges) { adj[u].push_back(v); adj[v].push_back(u); }

    int start = 0;
    vector<int> dist(n, -1);
    dist[start] = 0;
    queue<int> q; q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }

    for (int i = 0; i < n; i++) cout << "dist[" << i << "] = " << dist[i] << "\\n";
    return 0;
}`
  },
  "dijkstra": {
    label: "🚀 Dijkstra",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n = 5;
    vector<vector<pair<int,int>>> adj(n);  // {neighbor, weight}
    vector<tuple<int,int,int>> edges = {
        {0,1,4},{0,2,1},{2,1,2},{1,3,1},{2,3,5},{3,4,3}
    };
    for (auto [u,v,w] : edges) { adj[u].push_back({v,w}); adj[v].push_back({u,w}); }

    int src = 0;
    vector<int> dist(n, INT_MAX); dist[src] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }

    for (int i = 0; i < n; i++) cout << "dist[" << i << "] = " << dist[i] << "\\n";
    return 0;
}`
  },
  "dp-knapsack": {
    label: "🎒 0/1 Knapsack DP",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> wt = {2, 3, 4, 5};
    vector<int> val = {3, 4, 5, 6};
    int W = 8;
    int n = wt.size();

    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (w >= wt[i-1]) dp[i][w] = max(dp[i][w], dp[i-1][w-wt[i-1]] + val[i-1]);
        }
    }
    cout << "Max value: " << dp[n][W] << "\\n";
    return 0;
}`
  },
  "lis": {
    label: "📈 Longest Increasing Subseq (O(n log n))",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> a = {10, 9, 2, 5, 3, 7, 101, 18};
    vector<int> tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    cout << "LIS length: " << tails.size() << "\\n";
    return 0;
}`
  },
  "kmp": {
    label: "🔤 KMP Pattern Match",
    code: `#include <bits/stdc++.h>
using namespace std;

vector<int> buildLPS(const string& p) {
    int m = p.size();
    vector<int> lps(m, 0);
    int k = 0;
    for (int i = 1; i < m; i++) {
        while (k > 0 && p[k] != p[i]) k = lps[k-1];
        if (p[k] == p[i]) k++;
        lps[i] = k;
    }
    return lps;
}

int main() {
    string t = "ABABDABACDABABCABABCABAB";
    string p = "ABABCABAB";
    vector<int> lps = buildLPS(p);
    int n = t.size(), m = p.size(), q = 0;
    for (int i = 0; i < n; i++) {
        while (q > 0 && p[q] != t[i]) q = lps[q-1];
        if (p[q] == t[i]) q++;
        if (q == m) {
            cout << "Found at index " << i - m + 1 << "\\n";
            q = lps[q-1];
        }
    }
    return 0;
}`
  },
  "blank": {
    label: "📝 Blank (เขียนเอง)",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // เขียนโค้ดของคุณที่นี่

    return 0;
}`
  }
};

Lessons25["cpp-sandbox"] = function () {
  const [tplKey, setTplKey] = useS25('hello');
  const [code, setCode] = useS25(CPP_TEMPLATES.hello.code);

  useE25(() => { setCode(CPP_TEMPLATES[tplKey].code); }, [tplKey]);

  // Wandbox needs base64 URL — use simpler "share by query string" via godbolt
  const openWandbox = () => {
    const data = { code, options: "warning,gnu++17", compiler: "gcc-head", "compiler-option-raw": "-std=c++17 -O2" };
    fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {
      // fallback: open Wandbox new page with code in URL
      const url = 'https://wandbox.org/permlink/' + btoa(code).slice(0, 12);
      window.open('https://wandbox.org/', '_blank');
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('✓ Copied! Paste ใน online compiler ที่เปิด tab ใหม่');
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('✓ Copied!');
    });
  };

  const openIn = (site) => {
    copyCode();
    setTimeout(() => {
      if (site === 'godbolt') window.open('https://godbolt.org/', '_blank');
      if (site === 'wandbox') window.open('https://wandbox.org/', '_blank');
      if (site === 'onlinegdb') window.open('https://www.onlinegdb.com/online_c++_compiler', '_blank');
      if (site === 'coliru') window.open('https://coliru.stacked-crooked.com/', '_blank');
    }, 200);
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">💻 C++ Online Compiler Sandbox</div>
        เลือก template หรือเขียนโค้ดเอง → กดเปิดใน online compiler (Wandbox, Godbolt, OnlineGDB, Coliru)<br/>
        <i>โค้ดจะถูก copy ให้อัตโนมัติ — แค่ paste ที่ compiler ใหม่</i>
      </div>

      <h3>1. เลือก Template</h3>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        {Object.entries(CPP_TEMPLATES).map(([k, v]) => (
          <button key={k} onClick={() => setTplKey(k)}
            style={{
              background: tplKey === k ? 'var(--accent)' : 'var(--bg-2)',
              color: tplKey === k ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 16, cursor: 'pointer', fontSize: 12,
              fontWeight: tplKey === k ? 600 : 400
            }}>
            {v.label}
          </button>
        ))}
      </div>

      <h3>2. แก้โค้ด (หรือ paste โค้ดของคุณ)</h3>
      <textarea value={code} onChange={e => setCode(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%', minHeight: 380, padding: 12,
          background: '#0a0e14', color: 'var(--text-0)',
          border: '1px solid var(--border)', borderRadius: 6,
          fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5,
          resize: 'vertical'
        }} />

      <h3>3. รันที่ Online Compiler</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, margin: '12px 0' }}>
        <button onClick={() => openIn('godbolt')} style={{ background: 'rgba(94,234,212,0.15)', color: 'var(--accent-2)', border: '1px solid var(--accent-2)', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          🔬 Godbolt (Compiler Explorer)<br /><span style={{ fontSize: 11 }}>ดู assembly + multi-compiler</span>
        </button>
        <button onClick={() => openIn('wandbox')} style={{ background: 'rgba(168,139,250,0.15)', color: '#a78bfa', border: '1px solid #a78bfa', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          🪄 Wandbox<br /><span style={{ fontSize: 11 }}>เร็ว + share link</span>
        </button>
        <button onClick={() => openIn('onlinegdb')} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          🐞 OnlineGDB<br /><span style={{ fontSize: 11 }}>มี debugger ในตัว</span>
        </button>
        <button onClick={() => openIn('coliru')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          ☁️ Coliru<br /><span style={{ fontSize: 11 }}>เรียบง่าย, custom flags</span>
        </button>
      </div>

      <button onClick={copyCode} style={{ background: 'var(--accent)', color: '#000', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
        📋 Copy code อย่างเดียว
      </button>

      <h3 style={{ marginTop: 22 }}>📝 Tips การใช้</h3>
      <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li><b>Godbolt</b> — ดี ถ้าอยากดู assembly หรือเทียบ optimization (-O0 vs -O3) — แต่ ไม่มี input stdin</li>
        <li><b>Wandbox</b> — เร็วและ share link ได้ดี — เหมาะถ้าจะส่งโค้ดให้คนอื่นดู</li>
        <li><b>OnlineGDB</b> — มี <b>debugger</b> step-through (กด Debug แทน Run) — ดีมากตอน learning</li>
        <li><b>Coliru</b> — custom command line + เร็ว — ดีถ้าต้องการ specific compiler flags</li>
        <li><b>Local install</b> — ระยะยาวควรลง <code>g++</code>/<code>clang</code> เอง — ใช้ VS Code + Code Runner extension</li>
      </ul>

      <CS25 title="C++ Compile Flags ที่ควรรู้" sections={[
        { label: "Standard", value: "<code>-std=c++17</code> หรือ <code>-std=c++20</code>" },
        { label: "Optimization", value: "<code>-O2</code> สำหรับ contest (เร็ว)<br/><code>-O0</code> สำหรับ debug" },
        { label: "Warnings", value: "<code>-Wall -Wextra</code> — เปิดทุก warning" },
        { label: "Debug", value: "<code>-g</code> — debug symbols (ใช้ gdb)<br/><code>-fsanitize=address</code> — ตรวจ memory error" },
        { label: "Contest typical", value: "<code>g++ -std=c++17 -O2 -Wall sol.cpp -o sol</code>" },
      ]} />

      <div className="callout warn" style={{ marginTop: 16 }}>
        <div className="ttl">⚠ ทำไมไม่มี ‘Run in Browser’ จริง?</div>
        การรัน C++ ใน browser ต้องใช้ <b>Emscripten</b> compile clang เป็น WebAssembly (~30MB)<br/>
        ทำให้เว็บโหลดช้ามาก — แนวคิดดีกว่าคือ <b>เปิด tab ใหม่ไปยัง compiler ออนไลน์ที่ออปติไมซ์แล้ว</b>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   learning-paths — เส้นทางการเรียนตามเป้าหมาย
============================================================ */
const PATHS = {
  "1month": {
    icon: "🚀",
    title: "Crash Course 1 เดือน",
    desc: "เรียน 1-2 ชม/วัน → cover algorithm พื้นฐาน",
    weeks: [
      { week: "Week 1", goal: "Foundations + Basic Sort/Search", lessons: ["foundations", "cpp-io", "what-is-algo", "big-o", "linear-search", "binary-search", "bubble-sort", "selection-sort", "insertion-sort"] },
      { week: "Week 2", goal: "Recursion + DAC Sorts + Data Structures", lessons: ["recursion", "merge-sort", "quick-sort", "stack", "queue", "linked-list", "hashing", "hash-collision"] },
      { week: "Week 3", goal: "Trees + Graph Basics", lessons: ["tree-basic", "bst", "heap-sort", "graph-rep", "bfs", "dfs", "topo-sort", "dijkstra"] },
      { week: "Week 4", goal: "Advanced + Practice", lessons: ["greedy", "dp", "backtracking", "mst", "practice-bank", "mock-exam"] },
    ]
  },
  "3month": {
    icon: "📚",
    title: "Complete Course 3 เดือน",
    desc: "เรียนแบบลึก + ฝึกพิสูจน์ + ทำโจทย์ครบ",
    weeks: [
      { week: "Month 1 (Weeks 1-4)", goal: "🎓 Foundations & C++/STL", lessons: ["foundations", "cpp-io", "cpp-pointers", "cpp-memory", "cpp-modern", "stl-overview", "stl-vector-deep", "stl-string", "stl-iterators", "stl-stack-queue", "stl-priority-queue", "stl-set-map", "stl-unordered", "stl-algorithms", "cpp-lambda"] },
      { week: "Month 2 (Weeks 5-8)", goal: "📐 Algorithm + Proofs", lessons: ["big-o", "big-o-proofs", "master-theorem", "recursion-methods", "loop-invariant", "amortized", "merge-sort", "quick-sort", "heap-sort", "recursion", "exhaustive", "backtracking", "greedy", "dp"] },
      { week: "Month 3 (Weeks 9-12)", goal: "🌐 Graph + Advanced", lessons: ["graph-rep", "bfs", "dfs", "dijkstra", "bellman-ford", "floyd-warshall", "mst", "scc", "articulation", "max-flow", "min-cut", "lis", "lcs", "edit-distance", "p-vs-np", "mock-exam-4"] },
    ]
  },
  "midterm": {
    icon: "📝",
    title: "Midterm Prep (1-2 สัปดาห์)",
    desc: "เน้น Big-O, Sort, Search, Recursion, DAC — หัวข้อ midterm มาตรฐาน",
    weeks: [
      { week: "Phase 1: Concepts", goal: "ทบทวน core theory", lessons: ["big-o", "big-o-proofs", "master-theorem", "recursion-methods", "loop-invariant", "recursion"] },
      { week: "Phase 2: Algorithms", goal: "Sort + Search ทุกตัว", lessons: ["linear-search", "binary-search", "bubble-sort", "selection-sort", "insertion-sort", "merge-sort", "quick-sort", "heap-sort", "quick-select", "strassen"] },
      { week: "Phase 3: Practice", goal: "Mock + Cheat Sheet", lessons: ["flashcards", "sm2-flashcards", "mock-exam", "mock-exam-2", "timed-drill", "print-cheatsheet"] },
    ]
  },
  "final": {
    icon: "🎓",
    title: "Final Prep (2-3 สัปดาห์)",
    desc: "Graph + DP + Greedy + Backtracking + NP — Final exam typical",
    weeks: [
      { week: "Phase 1: Graph", goal: "Graph algorithm ทั้งหมด", lessons: ["graph-rep", "bfs", "dfs", "cycle-detect", "topo-sort", "dijkstra", "bellman-ford", "floyd-warshall", "mst"] },
      { week: "Phase 2: Optimization", goal: "DP + Greedy + BT", lessons: ["greedy", "dp", "backtracking", "exhaustive", "lis", "lcs", "edit-distance", "matrix-chain"] },
      { week: "Phase 3: Advanced", goal: "NP + String + Bonus", lessons: ["p-vs-np", "reductions", "np-complete-problems", "approximation", "string-match", "huffman"] },
      { week: "Phase 4: Mock", goal: "จับเวลาสอบ", lessons: ["mock-exam-3", "mock-exam-4", "mock-exam-5", "timed-drill", "design-greedy", "design-dp", "design-graph"] },
    ]
  },
  "contest": {
    icon: "🏆",
    title: "Competitive Programming",
    desc: "เตรียมแข่ง — Codeforces Div 2, ACPC, ICPC",
    weeks: [
      { week: "Phase 1: STL + Speed", goal: "เร็ว + ใช้ STL คล่อง", lessons: ["cpp-io", "stl-overview", "stl-vector-deep", "stl-set-map", "stl-priority-queue", "stl-algorithms", "cpp-lambda", "stl-bitset"] },
      { week: "Phase 2: Number Theory + DP", goal: "Math + DP tricks", lessons: ["ext-gcd", "mod-inverse", "fast-power", "sieve", "lis", "lcs", "edit-distance", "matrix-chain", "bitmask-dp", "tree-dp"] },
      { week: "Phase 3: Graph", goal: "Flow + SCC + Strings", lessons: ["max-flow", "edmonds-karp", "bipartite-matching", "scc", "articulation", "z-algorithm", "suffix-array", "manacher", "aho-corasick"] },
      { week: "Phase 4: Practice", goal: "Solve 50+ problems", lessons: ["practice-bank", "problems", "design-greedy", "design-dp", "design-graph", "design-reduce"] },
    ]
  },
};

Lessons25["learning-paths"] = function () {
  const [pathKey, setPathKey] = useS25('1month');
  const [progress, setProgress] = useS25(() => {
    try { return JSON.parse(localStorage.getItem('algo-academy-progress-v1') || '{}'); } catch { return {}; }
  });

  const path = PATHS[pathKey];

  const navTo = (id) => {
    window.location.hash = '/' + id;
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🗺️ Learning Paths</div>
        เลือก<b>เป้าหมาย</b> ของคุณ → ระบบจัดลำดับบทเรียนให้ตามลำดับที่ดีที่สุด<br/>
        ติด ✓ บทไหนแล้วทำต่อบทอื่นได้เลย
      </div>

      <h3>เลือกเส้นทาง</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, margin: '14px 0' }}>
        {Object.entries(PATHS).map(([k, p]) => (
          <button key={k} onClick={() => setPathKey(k)}
            style={{
              background: pathKey === k ? 'var(--accent)' : 'var(--bg-2)',
              color: pathKey === k ? '#000' : 'var(--text-1)',
              border: '1px solid ' + (pathKey === k ? 'var(--accent)' : 'var(--border)'),
              padding: 14, borderRadius: 10, cursor: 'pointer',
              textAlign: 'left'
            }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{p.desc}</div>
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: 22 }}>{path.icon} {path.title}</h3>
      <div style={{ color: 'var(--text-2)', marginBottom: 14 }}>{path.desc}</div>

      {path.weeks.map((w, wi) => {
        const completed = w.lessons.filter(id => progress[id]).length;
        const pct = Math.round((completed / w.lessons.length) * 100);
        return (
          <div key={wi} style={{ background: 'var(--bg-2)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{w.week}</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{w.goal}</div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 14 }}>
                <b style={{ color: pct === 100 ? '#10b981' : 'var(--accent-2)' }}>{completed}/{w.lessons.length}</b>
                <span style={{ color: 'var(--text-3)', marginLeft: 6 }}>({pct}%)</span>
              </div>
            </div>
            <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
              <div style={{ width: pct + '%', height: '100%', background: pct === 100 ? '#10b981' : 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {w.lessons.map(id => {
                const lesson = (window.ALL_LESSONS || []).find(l => l.id === id);
                const isDone = progress[id];
                if (!lesson) {
                  return (
                    <div key={id} style={{ padding: '4px 10px', background: 'var(--bg-3)', borderRadius: 4, fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace', textDecoration: 'line-through' }}>
                      {id} (missing)
                    </div>
                  );
                }
                return (
                  <button key={id} onClick={() => navTo(id)}
                    style={{
                      padding: '4px 10px',
                      background: isDone ? 'rgba(16,185,129,0.15)' : 'var(--bg-3)',
                      color: isDone ? '#10b981' : 'var(--text-1)',
                      border: '1px solid ' + (isDone ? '#10b981' : 'var(--border)'),
                      borderRadius: 4, fontSize: 12, cursor: 'pointer',
                      fontWeight: isDone ? 600 : 400
                    }}>
                    {isDone ? '✓' : '○'} {lesson.title}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="callout tip" style={{ marginTop: 16 }}>
        <div className="ttl">💡 วิธีใช้</div>
        คลิกบทใดบทหนึ่ง → เรียนเสร็จ → กลับมาที่นี่ → จะเห็น ✓ (ใช้ progress จาก localStorage)
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   mock-exam-5 — Thai University Style Past Exam
============================================================ */
const EXAM5 = [
  {
    section: "ส่วนที่ 1 — Big-O & Recurrence (25 คะแนน)",
    questions: [
      {
        q: "(จุฬาฯ style) วิเคราะห์ time complexity ของฟังก์ชันนี้:<br/><pre style='margin:8px 0;background:#0a0e14;padding:10px;border-radius:4px'>int f(int n) {\n  int s = 0;\n  for (int i = 1; i < n; i *= 2)\n    for (int j = 0; j < i; j++)\n      s++;\n  return s;\n}</pre>",
        hint: "Outer loop = log n, inner = 1, 2, 4, 8, ... → sum = n",
        ans: `Outer: i = 1, 2, 4, 8, ..., n/2 (รวม log₂ n ครั้ง)
Inner: j = 0 ถึง i-1, ทำ i ครั้ง

Total operations = 1 + 2 + 4 + 8 + ... + n/2 = n - 1
≈ O(n)

📊 พิสูจน์: Σ_{k=0}^{log n - 1} 2^k = 2^(log n) - 1 = n - 1 → O(n)`
      },
      {
        q: "(มก. style) แก้ recurrence T(n) = 4T(n/2) + n² ด้วย Master Theorem",
        hint: "a=4, b=2, d=2 → log_b(a) = log₂4 = 2 = d → Case 2",
        ans: `Master Theorem: T(n) = aT(n/b) + n^d
a = 4, b = 2, d = 2

log_b(a) = log₂(4) = 2 = d

→ Case 2: T(n) = O(n^d · log n) = O(n² log n)

✓ Answer: T(n) = O(n² log n)`
      },
      {
        q: "พิสูจน์ด้วย <b>induction</b> ว่า T(n) = T(n-1) + n เป็น O(n²)",
        hint: "Guess T(n) ≤ cn² และพิสูจน์ inductive step",
        ans: `Guess: T(n) ≤ cn² สำหรับ c บางตัว, ทุก n ≥ n₀

Inductive Hypothesis (IH): T(k) ≤ ck² สำหรับ k < n

Inductive Step:
  T(n) = T(n-1) + n
       ≤ c(n-1)² + n         (by IH)
       = cn² - 2cn + c + n
       = cn² - (2c-1)n + c
       ≤ cn²   ⟺   (2c-1)n ≥ c
       ⟺ n ≥ c/(2c-1)

เลือก c ≥ 1, n₀ = c/(2c-1) = 1 (เมื่อ c=1)

∴ T(n) ≤ n² สำหรับ n ≥ 1 → T(n) = O(n²) ▢`
      }
    ]
  },
  {
    section: "ส่วนที่ 2 — Sort & Search (20 คะแนน)",
    questions: [
      {
        q: "(มจธ. style) แสดง trace ของ Quick Sort บน array [5, 2, 8, 1, 9, 3] เมื่อใช้ <b>last element เป็น pivot</b>",
        hint: "Partition รอบแรกใช้ pivot = 3 → [2, 1, 3, 5, 9, 8]",
        ans: `Round 1: pivot = 3
  scan: 5 > 3 (skip), 2 < 3 (swap left), 8 > 3, 1 < 3 (swap)
  → [2, 1, 3, 8, 9, 5]  (pivot at index 2)
  → recurse left [2, 1] + right [8, 9, 5]

Round 2 (left [2, 1]): pivot = 1
  → [1, 2]

Round 2 (right [8, 9, 5]): pivot = 5
  → [5, 9, 8] → [5, 8, 9] after recursion

Final: [1, 2, 3, 5, 8, 9]

⚠ Pitfall: ถ้า array sorted → pivot ปลายเป็น max ทุกครั้ง → O(n²) worst case`
      },
      {
        q: "ทำไม Binary Search ต้องการ <b>sorted array</b>?",
        hint: "Decision rule (a[mid] < x?) ต้อง preserve invariant",
        ans: `Binary Search ใช้ decision rule: ‘ถ้า a[mid] < x → ไปครึ่งขวา; else ไปครึ่งซ้าย’

Invariant: ถ้า x อยู่ใน array → x อยู่ใน a[lo..hi]

Sorted ทำให้ decision rule นี้ ‘ตัด’ ครึ่งที่ x ไม่ได้อยู่ได้แน่นอน:
  ถ้า a[mid] < x → ครึ่งซ้าย (รวม mid) ทั้งหมด ≤ a[mid] < x → x ไม่อยู่ → ตัดทิ้งได้

ถ้า unsorted: a[mid] < x ไม่บอกอะไรเกี่ยวกับครึ่งซ้าย/ขวาเลย → ตัดไม่ได้
→ Binary Search ผิดแน่นอน`
      }
    ]
  },
  {
    section: "ส่วนที่ 3 — Greedy & DP (20 คะแนน)",
    questions: [
      {
        q: "(ลาดกระบัง style) <b>Activity Selection</b> — มี activities: (1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11), (8,12), (2,14), (12,16). หา max non-overlapping",
        hint: "Sort by finish time → greedy เลือกตัวที่จบก่อน",
        ans: `Sort by finish time:
(1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11), (2,14), (8,12), (12,16)

Greedy:
  ✓ (1,4)     — first
  ✗ (3,5)     — start 3 < lastEnd 4
  ✗ (0,6)     — start 0 < 4
  ✓ (5,7)     — start 5 ≥ 4 → take, lastEnd = 7
  ✗ (3,9), (5,9), (6,10) — all start < 7
  ✓ (8,11)    — start 8 ≥ 7 → take, lastEnd = 11
  ✗ (2,14), (8,12)
  ✓ (12,16)   — start 12 ≥ 11 → take

Answer: {(1,4), (5,7), (8,11), (12,16)} = 4 activities ▢`
      },
      {
        q: "พิสูจน์ <b>0/1 Knapsack</b> recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])",
        hint: "2 choices: take หรือ skip item i",
        ans: `dp[i][w] = max value โดยใช้ item 1..i, capacity w

สำหรับ item i:
  Choice 1: ไม่หยิบ → dp[i-1][w]
  Choice 2: หยิบ (ถ้า w ≥ wt[i]) → val[i] + dp[i-1][w - wt[i]]

→ dp[i][w] = max(Choice 1, Choice 2)

Optimal substructure: คำตอบของ subproblem (item 1..i-1, cap w หรือ w-wt[i]) ก็ต้อง optimal
→ valid DP

Time: O(n × W), Space: O(n × W) → opt O(W) ด้วย 1D rolling

⚠ Pseudo-poly: poly ใน n, W แต่ W ใน binary = log W bits → input size jpeg`
      }
    ]
  },
  {
    section: "ส่วนที่ 4 — Graph (20 คะแนน)",
    questions: [
      {
        q: "Trace Dijkstra จาก node A บน graph: A-B(4), A-C(2), B-C(1), B-D(5), C-D(8), C-E(10), D-E(2)",
        hint: "Priority queue + relax. dist[A]=0, process min ทุกครั้ง",
        ans: `Initial: dist = {A:0, B:∞, C:∞, D:∞, E:∞}, PQ = [(0,A)]

1. Pop (0,A): relax neighbors
   dist[B] = 4 (via A), push (4,B)
   dist[C] = 2 (via A), push (2,C)

2. Pop (2,C): relax
   dist[B] = min(4, 2+1) = 3, push (3,B)
   dist[D] = 2+8 = 10, push (10,D)
   dist[E] = 2+10 = 12, push (12,E)

3. Pop (3,B): relax
   dist[D] = min(10, 3+5) = 8, push (8,D)

4. Pop (4,B): dist[B]=3 < 4 → skip (outdated)

5. Pop (8,D): relax
   dist[E] = min(12, 8+2) = 10, push (10,E)

6. Pop (10,D): outdated, skip
7. Pop (10,E): relax, no improvement
8. Pop (12,E): outdated, skip

Final: dist = {A:0, B:3, C:2, D:8, E:10}`
      },
      {
        q: "(จุฬาฯ style) อะไรคือ <b>SCC</b>? อธิบาย Kosaraju's algorithm สั้น ๆ",
        hint: "2-pass DFS + transpose",
        ans: `SCC (Strongly Connected Component) = กลุ่ม vertices ที่ทุกคู่ u,v มี path u→v และ v→u

Kosaraju's algorithm (O(V+E)):
  Pass 1: DFS บน G เก็บ finish times → push เข้า stack เมื่อ done
  Pass 2: Build G^T (transpose — reverse edges)
          DFS บน G^T โดยลำดับจาก stack
          แต่ละ DFS tree = 1 SCC

Why it works: vertex finish หลังสุดใน G อยู่ใน ‘source SCC’ ของ condensation DAG
→ ใน G^T มันเป็น ‘sink’ → DFS ไม่หลุดออกจาก SCC

ใช้ใน: 2-SAT (O(V+E)), dependency analysis`
      }
    ]
  },
  {
    section: "ส่วนที่ 5 — NP & Reductions (15 คะแนน)",
    questions: [
      {
        q: "พิสูจน์ว่า <b>Vertex Cover ≤ₚ Independent Set</b>",
        hint: "Complement: S เป็น VC ⟺ V\\S เป็น IS",
        ans: `Claim: S เป็น VC ของ G ⟺ V \\ S เป็น IS ของ G

Proof:
  S เป็น VC ⟺ ทุก edge (u,v) มี u ∈ S หรือ v ∈ S
            ⟺ ไม่มี edge ที่ทั้ง u, v ∉ S
            ⟺ ไม่มี edge ภายใน V \\ S
            ⟺ V \\ S เป็น IS ▢

Reduction (instance):
  Input VC: (G, k) → Output IS: (G, |V| - k)
  ‘∃ VC ≤ k’ ⟺ ‘∃ IS ≥ |V| - k’

Time: O(1) — แค่คำนวณ |V| - k

∴ VC ≤ₚ IS. และ IS NP-Complete → VC NP-Complete ▢`
      }
    ]
  }
];

Lessons25["mock-exam-5"] = function () {
  const [showAns, setShowAns] = useS25({});
  const [timer, setTimer] = useS25(0);
  const [running, setRunning] = useS25(false);

  useE25(() => {
    if (!running) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const toggle = (key) => setShowAns(s => ({ ...s, [key]: !s[key] }));
  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <React.Fragment>
      <div className="callout warn">
        <div className="ttl">📝 Mock Exam 5 — Thai University Style (120 นาที)</div>
        ข้อสอบ style จุฬาฯ / มก. / มจธ. / ลาดกระบัง — เน้น<b>เขียนพิสูจน์</b>, <b>trace algorithm</b>, <b>เขียน recurrence + analysis</b>
        <br/><b>คะแนนรวม: 100</b> · ไม่จำกัด resources (open book)
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0' }}>
        <button onClick={() => setRunning(r => !r)} style={{ background: running ? '#f87171' : '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏸ หยุด' : '▶ เริ่มจับเวลา'}
        </button>
        <span style={{ fontFamily: 'monospace', fontSize: 20, color: timer >= 120 * 60 ? '#f87171' : 'var(--text-0)' }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} / 120:00
        </span>
        <button onClick={() => { setTimer(0); setRunning(false); }} style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>Reset</button>
      </div>

      {EXAM5.map((sec, si) => (
        <div key={si} style={{ marginBottom: 22 }}>
          <h3 style={{ color: 'var(--accent)' }}>{sec.section}</h3>
          {sec.questions.map((q, qi) => {
            const key = si + '-' + qi;
            return (
              <div key={qi} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: 'Q' + (qi + 1) + '. ' + q.q }} />
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <button onClick={() => toggle(key + 'h')} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    💡 {showAns[key + 'h'] ? 'Hide' : 'Hint'}
                  </button>
                  <button onClick={() => toggle(key)} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    ✓ {showAns[key] ? 'Hide' : 'Show'} Solution
                  </button>
                </div>
                {showAns[key + 'h'] && (
                  <div style={{ padding: 10, background: 'rgba(251,191,36,0.06)', borderLeft: '3px solid #fbbf24', borderRadius: 4, fontSize: 13, marginBottom: 6 }}>
                    💡 {q.hint}
                  </div>
                )}
                {showAns[key] && (
                  <div style={{ padding: 10, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981', borderRadius: 4, fontSize: 13, whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}>
                    {q.ans}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 22, padding: 14, background: 'var(--bg-2)', borderRadius: 10, fontSize: 13 }}>
        <b style={{ color: 'var(--accent)' }}>📊 Grading Rubric</b><br/>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>Proof</b> — ต้องมี <i>logic ครบ</i> (premise → step → conclusion) ไม่ใช่แค่ตอบสุดท้าย</li>
          <li><b>Trace</b> — ต้อง trace ทีละ step ที่สำคัญ (PQ pops, table fills, etc.)</li>
          <li><b>Analysis</b> — Big-O <b>ต้องอธิบายที่มา</b> (n² loops, geometric series, etc.)</li>
          <li><b>Pseudocode</b> — ห้ามใช้ <code>std::sort()</code> เป็นกล่องดำ — ต้องเขียน algorithm จริง</li>
        </ul>
        <b style={{ color: 'var(--accent)' }}>คะแนน:</b><br/>
        85+ Excellent · 70-84 Good · 55-69 Pass · &lt;55 ทบทวนใหม่
      </div>
    </React.Fragment>
  );
};

window.LessonsPart25 = Lessons25;
