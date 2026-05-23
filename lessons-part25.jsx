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
/* ============================================================
   KMUTNB Mock Mid — syllabus 040613206 ถึงสัปดาห์ 8
   ครอบคลุม: Big-O analysis, Asymptotic + L'Hôpital, Sort/Search,
              D&C (Quick Select, Maxima Set, Karatsuba, Strassen),
              Backtracking (Permutation, Subset Sum, N-Queens, Knapsack),
              intro Greedy (Coin Change)
============================================================ */
const EXAM_KMUTNB_MID = [
  {
    section: "ส่วนที่ 1 — การวิเคราะห์ T(n) (20 คะแนน)",
    questions: [
      {
        q: "หา T(n) ของโค้ดต่อไปนี้ (5 คะแนน):<br/><pre style='margin:8px 0;background:#0a0e14;padding:10px;border-radius:4px'>sum = 0;\nfor (i = 0; i &lt; n; i++)\n  for (j = 0; j &lt; i*i; j++)\n    for (k = 0; k &lt; j; k++)\n      sum++;</pre>",
        hint: "inner sum = Σⱼ j = i²(i²-1)/2, outer = Σᵢ i⁴/2",
        ans: `Inner สุด: k จาก 0 ถึง j-1 → j ครั้ง
ตัวที่สอง: Σ_{j=0}^{i²-1} j = (i²-1)·i²/2 ≈ i⁴/2

ตัวนอก: Σ_{i=0}^{n-1} i⁴/2 = (1/2) · Σi⁴

จากสูตร Σi⁴ = n(n+1)(2n+1)(3n²+3n-1)/30 ≈ n⁵/5

∴ T(n) = (1/2) · n⁵/5 ≈ n⁵/10

✓ O(n⁵)`
      },
      {
        q: "หา T(n) (5 คะแนน):<br/><pre style='margin:8px 0;background:#0a0e14;padding:10px;border-radius:4px'>count = 1;\nwhile (n &gt; 1) {\n  count += 1;\n  n = n / 3;\n}</pre>",
        hint: "หาร 3 ทุกรอบ → log₃ n รอบ",
        ans: `รอบที่ k: n = n₀ / 3^k
หยุดเมื่อ n / 3^k ≤ 1 → 3^k ≥ n₀ → k ≥ log₃ n₀

∴ T(n) = log₃ n + constant = O(log n)

📌 หมายเหตุ: ฐาน log ไม่สำคัญใน Big-O (เปลี่ยนฐานได้ด้วย constant)`
      },
      {
        q: "เรียงฟังก์ชันต่อไปนี้จาก<b>เติบโตช้าสุด</b>ไปเร็วสุด (5 คะแนน):<br/>5n³ + 2n² + 30, &nbsp; 7 log n, &nbsp; 10n, &nbsp; n¹⁰⁰, &nbsp; 5,000,000, &nbsp; 0.5n³, &nbsp; n^(1/3), &nbsp; 100·2ⁿ",
        hint: "constant &lt; log &lt; root &lt; linear &lt; polynomial &lt; exponential",
        ans: `Hierarchy:
1. 5,000,000           (constant, O(1))
2. 7 log n             (logarithmic)
3. n^(1/3)             (root — sub-linear)
4. 10n                 (linear)
5. 0.5n³               (cubic — ต่ำกว่า 5n³ เพราะ coefficient ไม่นับ แต่ตรงนี้ทั้งคู่ O(n³) → เท่ากันใน Big-O)
6. 5n³ + 2n² + 30      (cubic — เท่ากับข้อ 5 ใน Θ(n³))
7. n¹⁰⁰                (polynomial degree 100)
8. 100·2ⁿ              (exponential — ชนะทุก polynomial)

✓ Big-O hierarchy: O(1) ≪ O(log n) ≪ O(√n) ≪ O(n) ≪ O(n³) ≪ O(n¹⁰⁰) ≪ O(2ⁿ)`
      },
      {
        q: "ใช้กฎโลปิตา (L'Hôpital) เปรียบเทียบ T₁ = 1000 log n กับ T₂ = n (5 คะแนน)",
        hint: "limit ratio → ∞/∞ → derivative",
        ans: `lim_{n→∞} (1000 log₂ n) / n  →  ∞/∞ form

ใช้ L'Hôpital — derivative:
  f'(n) = 1000 / (n · ln 2)
  g'(n) = 1

→ lim = lim [1000/(n·ln 2)] / 1 = (1000/ln 2) · lim 1/n = 0

∴ T₁ ∈ o(T₂) → 1000 log n เติบโตช้ากว่า n เสมอ (ไม่ว่า constant ใหญ่แค่ไหน)`
      },
    ]
  },
  {
    section: "ส่วนที่ 2 — Recurrence + พิสูจน์ Asymptotic (15 คะแนน)",
    questions: [
      {
        q: "แก้ recurrence T(n) = 2T(n/2) + c โดยวิธี backward substitution (T(1) = 1) (8 คะแนน)",
        hint: "แทนค่าซ้ำ k ครั้ง จน n/2^k = 1",
        ans: `T(n) = 2T(n/2) + c
     = 2[2T(n/4) + c] + c
     = 4T(n/4) + 2c + c
     = 4[2T(n/8) + c] + 2c + c
     = 8T(n/8) + 4c + 2c + c
     = 2^k · T(n/2^k) + c·(2^(k-1) + ... + 2 + 1)
     = 2^k · T(n/2^k) + c·(2^k - 1)

หยุดเมื่อ n/2^k = 1 → k = log₂ n → 2^k = n

T(n) = n · T(1) + c·(n - 1)
     = n + cn - c
     = (1+c)·n - c

∴ T(n) = O(n) ▢`
      },
      {
        q: "พิสูจน์จากนิยามว่า 100n + 5 = O(n²) — หา c, n₀ (7 คะแนน)",
        hint: "ต้องการ 100n + 5 ≤ c·n² ∀ n ≥ n₀",
        ans: `ต้องการหา c > 0, n₀ ≥ 1 ที่:
  100n + 5 ≤ c·n²  ∀ n ≥ n₀

หาร n² ทั้งสองข้าง:
  100/n + 5/n² ≤ c

สำหรับ n = 1: 100/1 + 5/1 = 105 ≤ c → ต้องการ c ≥ 105

เลือก c = 105, n₀ = 1:
  100·1 + 5 = 105 ≤ 105·1² = 105  ✓
  100·n + 5 ≤ 100·n² + 5·n² = 105·n²  ∀ n ≥ 1  ✓

∴ 100n + 5 = O(n²) ด้วย c = 105, n₀ = 1 ▢`
      },
    ]
  },
  {
    section: "ส่วนที่ 3 — Sort & Search Trace (20 คะแนน)",
    questions: [
      {
        q: "Trace <b>Shell Sort</b> ของ arr = [16, 25, 2, 54, 36, 9, 12, 66] โดยใช้ Sedgewick {1, 3, 5, 7, 11, ...} (8 คะแนน)",
        hint: "gap ≤ n/2: ลอง 5, 3, 2, 1 ทีละรอบ",
        ans: `Initial:           16 25 2 54 36 9 12 66

gap=5: groups (0,5)(1,6)(2,7)(3)(4)
  (16,9)→9,16  (25,12)→12,25  (2,66)→OK
  → 9 12 2 54 36 16 25 66

gap=3: groups (0,3,6)(1,4,7)(2,5)
  (9,54,25)→9,25,54  (12,36,66)→OK  (2,16)→OK
  → 9 12 2 25 36 16 54 66

gap=2: groups (0,2,4,6)(1,3,5,7)
  (9,2,36,54)→2,9,36,54  (12,25,16,66)→12,16,25,66
  → 2 12 9 16 36 25 54 66

gap=1: insertion sort
  → 2 9 12 16 25 36 54 66  ✓ sorted`
      },
      {
        q: "Trace <b>Binary Search</b> ค้นหา target = 5 ใน [2,5,5,5,6,6,8,9,9,9] (สมาชิกซ้ำ) — แสดง low, high, mid, A[mid] เพื่อหา <b>firstIndex</b> ของ 5 (6 คะแนน)",
        hint: "เมื่อเจอ → ไปฝั่งซ้ายต่อ; เก็บ result ไว้",
        ans: `index:  0 1 2 3 4 5 6 7 8 9
A:       2 5 5 5 6 6 8 9 9 9
target = 5

result | low | high | mid | A[mid]
  -1   |  0  |   9  |  4  |  6     → A[mid] > target, high = mid - 1 = 3
  -1   |  0  |   3  |  1  |  5     → A[mid] == target, result = 1, high = mid - 1 = 0
   1   |  0  |   0  |  0  |  2     → A[mid] < target, low = mid + 1 = 1
   1   |  1  |   0  |  -  |  -     → low > high, exit

✓ firstIndex = 1`
      },
      {
        q: "Trace <b>Quick Sort</b> partition ของ arr = [25, 57, 48, 37, 12, 92, 86, 33] ใช้ A[left] = 25 เป็น pivot (median of three ไม่ใช้ ในข้อนี้) (6 คะแนน)",
        hint: "up เลื่อนซ้าย (จาก right) เมื่อ A[up] > pivot; down เลื่อนขวา (จาก left) เมื่อ A[down] < pivot",
        ans: `pivot = 25 (A[left]), down = 0, up = 7
Initial:  25 57 48 37 12 92 86 33

down เลื่อนขวาเรื่อยๆ — 57 > 25 หยุดที่ down=1
up เลื่อนซ้ายเรื่อยๆ — 33,86,92 > 25; 12 < 25 หยุดที่ up=4

down < up → swap A[1] และ A[4]:
  25 12 48 37 57 92 86 33

ต่อ — down: 48 > 25 หยุดที่ down=2
up: 57 > 25, ต่อ; 37 > 25, ต่อ; 12 < 25 หยุดที่ up=1

up < down → exit, swap A[left] กับ A[up]:
  12 25 48 37 57 92 86 33

✓ pivot 25 อยู่ที่ตำแหน่ง 1 — ฝั่งซ้าย (≤25): {12}, ฝั่งขวา (>25): {48,37,57,92,86,33}`
      },
    ]
  },
  {
    section: "ส่วนที่ 4 — Divide & Conquer (25 คะแนน)",
    questions: [
      {
        q: "Trace <b>Quick Select k=4</b> ของ arr = [1, 5, 10, 4, 8, 2, 6, 9, 20] (3-way partition L/E/G, pivot = ตัวแรก) (10 คะแนน)",
        hint: "ลด k ตามขนาด L, E, G ที่ข้ามไป",
        ans: `n=9, k=4 (หาเลขน้อยสุดอันดับ 4)

Round 1: pivot=1, A=[1,5,10,4,8,2,6,9,20]
  L = {} (ไม่มีตัวน้อยกว่า 1)
  E = {1}
  G = {5,10,4,8,2,6,9,20}
  |L| = 0, |L|+|E| = 1
  k=4 > 1 → ไปฝั่ง G, k' = 4 - 1 = 3

Round 2: pivot=5, G=[5,10,4,8,2,6,9,20], k=3
  L = {4, 2}
  E = {5}
  G = {10, 8, 6, 9, 20}
  |L| = 2, |L|+|E| = 3
  k=3 ≤ |L|+|E| = 3 → pivot คือคำตอบ

✓ คำตอบ: 5

(พิสูจน์: เรียง [1,2,4,5,6,8,9,10,20] → อันดับ 4 = 5 ✓)`
      },
      {
        q: "ใช้ <b>Karatsuba</b> คำนวณ 342 × 231 — แสดงทุก step (8 คะแนน)",
        hint: "แบ่ง X = 3·100 + 42, Y = 2·100 + 31. คำนวณ z₀, z₂, z₁",
        ans: `n = 3 (3 หลัก) → m = ⌈n/2⌉ = 2 → 10^m = 100

X = 342: a = 3, b = 42  (X = 3·100 + 42)
Y = 231: c = 2, d = 31  (Y = 2·100 + 31)

z₂ = a·c = 3·2 = 6
z₀ = b·d = 42·31 = 1302
z₁ = (a+b)·(c+d) - z₂ - z₀
   = (3+42)·(2+31) - 6 - 1302
   = 45 · 33 - 1308
   = 1485 - 1308 = 177

X·Y = z₂·10^(2m) + z₁·10^m + z₀
    = 6·10000 + 177·100 + 1302
    = 60000 + 17700 + 1302
    = 79002

✓ Check: 342 × 231 = 79002 ✓
จำนวนการคูณ = 3 (z₂, z₀, (a+b)(c+d)) — ลดจาก 4 ของ schoolbook`
      },
      {
        q: "วาด recursive tree ของ <b>Maxima Set</b> สำหรับ P = {(1,4),(2,6),(3,1),(4,5),(5,7),(6,9),(7,2),(8,6),(9,3)} (7 คะแนน)",
        hint: "Sort by x → split median → recurse แต่ละฝั่ง → combine ตัดที่ถูก dominate",
        ans: `Sorted by x: (1,4)(2,6)(3,1)(4,5)(5,7)(6,9)(7,2)(8,6)(9,3) (n=9)

Tree:
                  maxima(P, 9 points)
                   /              \\
            maxima(S₁=4)        maxima(S₂=5)
            /        \\           /         \\
        m({P1,P2})  m({P3,P4})  m({P5,P6,P7}) m({P8,P9})
        = {(2,6)}   = {(4,5)}   = {(6,9),(7,2)}  = {(8,6),(9,3)}

        merge L = {(2,6),(4,5)}
        merge R = {(6,9),(8,6),(9,3)}

  Combine:
    M₁ = {(2,6),(4,5)}, M₂ = {(6,9),(8,6),(9,3)}
    max y ใน M₂ = 9
    (2,6).y = 6 < 9 → ถูก dominate → ตัด
    (4,5).y = 5 < 9 → ถูก dominate → ตัด
    M₁' = {} (ว่าง)

✓ Maxima set = {} ∪ {(6,9),(8,6),(9,3)} = {(6,9),(8,6),(9,3)}`
      },
    ]
  },
  {
    section: "ส่วนที่ 5 — Backtracking (15 คะแนน)",
    questions: [
      {
        q: "วาด <b>solution tree</b> ของ Subset Sum: A = {25, 10, 9, 2}, k = 12 (binary encoding) — ทำเครื่องหมายคำตอบทุกตัว (8 คะแนน)",
        hint: "ใช้ binary representation: x_i = 1 (เอา) หรือ 0 (ไม่เอา) — มี backtracking pruning เมื่อ sum > k",
        ans: `Encoding: X = (x₁, x₂, x₃, x₄) แทน {25, 10, 9, 2}
                                 root
                          x₁=0 /      \\ x₁=1
                              /          \\
                           sum=0       sum=25 ✗ (>12 → prune)
                       x₂=0 / \\ x₂=1
                          /      \\
                       sum=0    sum=10
                  x₃=0 / \\x₃=1   x₃=0/ \\x₃=1
                     /     \\        /     \\
                   0       9       10     19 ✗
              x₄=0/\\x₄=1 0/\\x₄=1 0/\\x₄=1
                /   \\   /    \\  /    \\
               0    2   9    11  10   12 ✓ {10,2}

              ต่อจากกิ่ง 9: x₄=1 → 11
              ต่อจากกิ่ง 19: prune (>12)

✓ คำตอบเซตย่อย: {10, 2} → 10+2 = 12
  (อีกข้อที่เป็นไปได้ {9,2,1} ไม่อยู่ใน A นี้ - มีแค่ {10,2})`
      },
      {
        q: "เขียน pseudocode <b>4-Queens</b> ด้วย backtracking — แสดงเงื่อนไข safe() (7 คะแนน)",
        hint: "Check ทุกคู่ (i,j): |i-j| ≠ |X[i]-X[j]| (diagonal) และ X[i] ≠ X[j] (same column)",
        ans: `void place(int X[], int row, int n) {
  if (row == n) { print(X); return; }
  for (int col = 0; col < n; col++) {
    X[row] = col;
    if (safe(X, row)) {       // pruning
      place(X, row + 1, n);
    }
  }
}

bool safe(int X[], int row) {
  for (int i = 0; i < row; i++) {
    // same column?
    if (X[i] == X[row]) return false;
    // same diagonal? |row - i| == |X[row] - X[i]|
    if (abs(X[row] - X[i]) == abs(row - i)) return false;
  }
  return true;
}

สำหรับ n=4 — คำตอบ: (1,3,0,2) และ (2,0,3,1) — 2 solutions`
      },
    ]
  },
  {
    section: "ส่วนที่ 6 — Greedy intro (5 คะแนน)",
    questions: [
      {
        q: "Coin Change: เหรียญ {1, 3, 4}, ทอน 6 บาท — แสดงผลของ Greedy และ Optimal; อธิบายทำไม Greedy ไม่ได้ optimal ทุกครั้ง (5 คะแนน)",
        hint: "Greedy: เอามากที่สุดก่อน. Optimal: ลองทุกแบบ.",
        ans: `Greedy (เลือกใหญ่สุดก่อน):
  6 - 4 = 2 → 1 เหรียญ (4)
  2 - 1 = 1 → 1 เหรียญ (1)
  1 - 1 = 0 → 1 เหรียญ (1)
  รวม: 3 เหรียญ

Optimal:
  6 = 3 + 3 → 2 เหรียญ ✓

เหตุผล:
  Greedy ทำการเลือก local-best ในแต่ละขั้น — เมื่อเลือก 4 แล้ว เหลือ 2 ซึ่งต้องใช้ 2 เหรียญ
  แต่ถ้าเลือก 3 ก่อน เหลือ 3 ซึ่งใช้ 1 เหรียญ (3)

  Greedy ใช้ได้เมื่อเซตเหรียญมี <b>Greedy Choice Property</b> เช่น {1, 5, 10, 25} ของ US/THB
  แต่ {1, 3, 4} ไม่มีคุณสมบัตินี้ — ต้องใช้ DP แทน

✓ Optimal substructure: dp[i] = min(dp[i-c] + 1) ∀ c ∈ coins`
      },
    ]
  },
];

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

/* ============================================================
   KMUTNB Mock Final — syllabus 040613206 รวมทุกเรื่อง 17 สัปดาห์
   เน้น Greedy + DP เพิ่มเติมจาก Mid + integration
============================================================ */
const EXAM_KMUTNB_FINAL = [
  {
    section: "ส่วนที่ 1 — Analysis review (15 คะแนน)",
    questions: [
      {
        q: "หา T(n) ของ <code>void f(int n) { for(i=0;i&lt;n;i++) sum++; for(j=0;j&lt;n*n;j++) val+=n; }</code> (5 คะแนน)",
        hint: "2 loop ติดกัน → บวก ไม่ใช่คูณ",
        ans: `Loop 1: i = 0 ถึง n-1 → n ครั้ง
Loop 2: j = 0 ถึง n²-1 → n² ครั้ง (basic op: val += n)

T(n) = n + n² = n²(1 + 1/n) → O(n²)

📌 ระวัง: เป็น "+ ตัวที่โตเร็วกว่า" ไม่ใช่ "×"`
      },
      {
        q: "ใช้ Master Theorem แก้ T(n) = 8T(n/2) + n³ (5 คะแนน)",
        hint: "a=8, b=2, d=3 → log_b(a) = 3 = d → Case 2",
        ans: `Master Theorem: T(n) = aT(n/b) + Θ(n^d), a=8, b=2, d=3

log_b(a) = log₂8 = 3 = d → Case 2

→ T(n) = Θ(n^d · log n) = Θ(n³ log n)

📌 นี่คือ recurrence ของ matrix mult แบบ DAC ปกติ (ก่อน Strassen)
   Strassen ทำให้เป็น a=7 → log₂7 ≈ 2.807 > d=2 → Case 3 → O(n^2.807)`
      },
      {
        q: "พิสูจน์ว่า n² + 50 log n = Θ(n²) (5 คะแนน)",
        hint: "หาทั้ง O และ Ω",
        ans: `Upper bound (Big-O):
  n² + 50 log n ≤ n² + 50·n²    (เพราะ log n ≤ n ≤ n² เมื่อ n ≥ 1)
                = 51·n²
  → c₂ = 51, n₀ = 1 ✓

Lower bound (Big-Ω):
  n² + 50 log n ≥ n²     (เพราะ 50 log n ≥ 0 เมื่อ n ≥ 1)
  → c₁ = 1, n₀ = 1 ✓

รวม: 1·n² ≤ n² + 50 log n ≤ 51·n² ∀ n ≥ 1

∴ n² + 50 log n = Θ(n²) ▢`
      },
    ]
  },
  {
    section: "ส่วนที่ 2 — D&C Sort + Strassen (15 คะแนน)",
    questions: [
      {
        q: "Trace Merge Sort ของ [16, 25, 2, 54, 36, 9, 12, 66] แสดง split + merge ทุกขั้น (8 คะแนน)",
        hint: "Split ถึง singleton → merge bottom-up",
        ans: `Split:
  [16,25,2,54,36,9,12,66]
   → [16,25,2,54] | [36,9,12,66]
   → [16,25] | [2,54] | [36,9] | [12,66]
   → [16][25] | [2][54] | [36][9] | [12][66]

Merge:
  [16][25] → [16,25]
  [2][54]  → [2,54]
  [36][9]  → [9,36]
  [12][66] → [12,66]

  [16,25] + [2,54] → [2,16,25,54]
  [9,36] + [12,66] → [9,12,36,66]

  [2,16,25,54] + [9,12,36,66]:
    2 vs 9 → 2
    16 vs 9 → 9
    16 vs 12 → 12
    16 vs 36 → 16
    25 vs 36 → 25
    54 vs 36 → 36
    54 vs 66 → 54
    เหลือ 66

  → [2, 9, 12, 16, 25, 36, 54, 66] ✓ sorted`
      },
      {
        q: "ใช้ <b>Strassen</b> คูณเมตริกซ์ A·B เมื่อ A = [[1,3],[7,5]], B = [[6,8],[4,2]] — คำนวณ M₁..M₇ และเทอม C (7 คะแนน)",
        hint: "M₁=(A₁₁+A₂₂)(B₁₁+B₂₂) ... C₁₁ = M₁+M₄-M₅+M₇",
        ans: `2×2 matrix → ไม่ต้อง recurse (n=1 ใน sub-block)
  A = [[1,3],[7,5]]  B = [[6,8],[4,2]]
  A₁₁=1, A₁₂=3, A₂₁=7, A₂₂=5
  B₁₁=6, B₁₂=8, B₂₁=4, B₂₂=2

M₁ = (A₁₁+A₂₂)(B₁₁+B₂₂) = (1+5)(6+2) = 6·8 = 48
M₂ = (A₂₁+A₂₂)·B₁₁     = (7+5)·6 = 12·6 = 72
M₃ = A₁₁·(B₁₂-B₂₂)     = 1·(8-2) = 6
M₄ = A₂₂·(B₂₁-B₁₁)     = 5·(4-6) = -10
M₅ = (A₁₁+A₁₂)·B₂₂     = (1+3)·2 = 8
M₆ = (A₂₁-A₁₁)(B₁₁+B₁₂) = (7-1)(6+8) = 6·14 = 84
M₇ = (A₁₂-A₂₂)(B₂₁+B₂₂) = (3-5)(4+2) = -2·6 = -12

C₁₁ = M₁+M₄-M₅+M₇ = 48-10-8-12 = 18
C₁₂ = M₃+M₅       = 6+8 = 14
C₂₁ = M₂+M₄       = 72-10 = 62
C₂₂ = M₁-M₂+M₃+M₆ = 48-72+6+84 = 66

✓ C = [[18,14],[62,66]]
✓ Check ปกติ: [[1·6+3·4, 1·8+3·2],[7·6+5·4, 7·8+5·2]] = [[18,14],[62,66]] ✓

จำนวนการคูณ = 7 (M₁..M₇)`
      },
    ]
  },
  {
    section: "ส่วนที่ 3 — Backtracking (15 คะแนน)",
    questions: [
      {
        q: "<b>0/1 Knapsack with Backtracking</b>: V={12,5,4,2}, W={8,7,4,2}, capacity=18 — แสดง solution tree แบบ binary + ผลลัพธ์ (8 คะแนน)",
        hint: "ไล่ตัวแปร x₁,x₂,x₃,x₄ ∈ {0,1}. pruning เมื่อ total weight > capacity.",
        ans: `Items: (V,W) = (12,8), (5,7), (4,4), (2,2). cap = 18

ไล่ binary code (x₁ x₂ x₃ x₄):
  ✓ พิจารณาเฉพาะที่ w_sum ≤ 18

(1,1,1,1): w=8+7+4+2=21 > 18  ✗ prune
(1,1,1,0): w=19 > 18           ✗ prune
(1,1,0,1): w=17 ≤ 18, v=12+5+2=19 ✓
(1,1,0,0): w=15, v=17
(1,0,1,1): w=14, v=18
(1,0,1,0): w=12, v=16
(1,0,0,1): w=10, v=14
(1,0,0,0): w=8,  v=12
(0,1,1,1): w=13, v=11
(0,1,1,0): w=11, v=9
(0,1,0,1): w=9,  v=7
(0,1,0,0): w=7,  v=5
(0,0,1,1): w=6,  v=6
(0,0,1,0): w=4,  v=4
(0,0,0,1): w=2,  v=2
(0,0,0,0): w=0,  v=0

🏆 Max V = 19 ที่ x = (1,1,0,1) — เลือกสินค้า 1, 2, 4`
      },
      {
        q: "<b>Rod Cutting</b> (backtracking variant): ตัดสายไฟยาว 8 m ตามรายการ {2, 3, 5} m — หาวิธีที่ใช้เส้นน้อยสุด (7 คะแนน)",
        hint: "Recursive ลอง subtract แต่ละ length ที่เหลือ ≥ 0 → ใช้ backtracking",
        ans: `เป้าหมาย: ตัด 8 ด้วย {2, 3, 5} ใช้จำนวนเส้นน้อยสุด

Backtracking tree (target ลดลงเรื่อยๆ):
  cut 2: 8→6
    cut 2: 6→4
      cut 2: 4→2
        cut 2: 2→0  ✓ 4 เส้น (2+2+2+2)
      cut 3: 4→1   ✗
    cut 3: 6→3
      cut 3: 3→0   ✓ 3 เส้น (2+3+3)
    cut 5: 6→1     ✗
  cut 3: 8→5
    cut 5: 5→0     ✓ 2 เส้น (3+5)   ← min!
    cut 3: 5→2
      cut 2: 2→0   ✓ 3 เส้น (3+3+2)
  cut 5: 8→3
    cut 3: 3→0     ✓ 2 เส้น (5+3)   ← min ก็ได้ผลเดียวกัน

🏆 น้อยสุด: 2 เส้น (3+5)
รายการตัด เรียงน้อยไปมาก: 3 5`
      },
    ]
  },
  {
    section: "ส่วนที่ 4 — Greedy (20 คะแนน)",
    questions: [
      {
        q: "<b>Fractional Knapsack</b>: n=4, W=25, items (weight, value) = (18,25), (15,24), (10,5), (5,8). หาคำตอบ (8 คะแนน)",
        hint: "density (v/w) sort: สูง→ต่ำ",
        ans: `density:
  Item 4: 8/5  = 1.60
  Item 2: 24/15 = 1.60
  Item 1: 25/18 ≈ 1.39
  Item 3: 5/10  = 0.50

เรียง (ถ้าเท่ากันเลือกตัวไหนก่อนก็ได้): 4, 2, 1, 3

ใส่:
  Item 4 (w=5,  v=8):  cap=25 → cap=20, v_total=8
  Item 2 (w=15, v=24): cap=20 → cap=5, v_total=32
  Item 1 (w=18, v=25): cap=5 < 18 → fraction = 5/18
                       value = 25·(5/18) ≈ 6.94, v_total ≈ 38.94
  Item 3: cap = 0, ไม่เอา

✓ Selection: x = (0.28, 1.00, 0.00, 1.00)
✓ Total value ≈ 38.94`
      },
      {
        q: "<b>Huffman Coding</b> สำหรับ text = \"HUFFMANCODES\" — สร้าง Huffman tree + binary code + ถอดรหัส \"110010111001111\" (12 คะแนน)",
        hint: "นับความถี่, build tree จาก min-heap, code = path (0=left, 1=right)",
        ans: `Frequency ใน "HUFFMANCODES" (12 chars):
  F: 2, H:1, U:1, M:1, A:1, N:1, C:1, O:1, D:1, E:1, S:1
  รวม 11 ตัวอักษรแตกต่างกัน — F ความถี่ 2, ที่เหลือ 1

Build tree (merge 2 ตัวความถี่ต่ำสุดจนเหลือ 1 root):
  เริ่มจาก nodes ความถี่ 1 ทั้งหมด + F(2)

  รอบ 1: merge H(1)+U(1) → HU(2)
  รอบ 2: merge M(1)+A(1) → MA(2)
  รอบ 3: merge N(1)+C(1) → NC(2)
  รอบ 4: merge O(1)+D(1) → OD(2)
  รอบ 5: merge E(1)+S(1) → ES(2)
  รอบ 6: merge F(2)+HU(2) → FHU(4)
  รอบ 7: merge MA(2)+NC(2) → MANC(4)
  รอบ 8: merge OD(2)+ES(2) → ODES(4)
  รอบ 9: merge FHU(4)+MANC(4) → FHUMANC(8)
  รอบ 10: merge FHUMANC(8)+ODES(4) → root(12)

(โครงสร้าง tree จะแตกต่างกันขึ้นกับลำดับ tie-break แต่ encoding ยาวเท่ากัน)

Binary codes (one valid assignment, depth ≤ 4):
  F=000, H=0010, U=0011, M=0100, A=0101, N=0110, C=0111,
  O=10, D=11, E=หรือ S=...  (ขึ้นกับ tree shape)

ถอดรหัส "110010111001111": อ่านทีละ bit จาก root
  1-1 0-0-1-0 1-1-1 0-0-1 1-1-1 ... — ขึ้นกับ tree

📌 คำตอบแน่นอนขึ้นกับลำดับ merge — ในการสอบจริง <b>วาด tree ของตัวเอง</b> และอธิบาย encoding/decoding ตาม tree นั้น`
      },
    ]
  },
  {
    section: "ส่วนที่ 5 — Dynamic Programming (25 คะแนน)",
    questions: [
      {
        q: "<b>Subset Sum DP</b> — ตัวอย่างจากชีท DP1: A = {3, 4, 5, 2}, k = 6. เติมตาราง T/F ทุกช่อง (10 คะแนน)",
        hint: "Sum(i,j) = Sum(i-1,j) || Sum(i-1, j-A[i-1])",
        ans: `Recurrence:
  Sum(i, j) = Sum(i-1, j)                          (ไม่เอา A[i-1])
           OR Sum(i-1, j - A[i-1])                 (เอา A[i-1], ถ้า A[i-1] ≤ j)
  Base: Sum(i, 0) = T, Sum(0, j>0) = F

ตาราง (rows = items added, cols = target k):

  A[i-1]/k |  0  1  2  3  4  5  6
  -----------------------------
  {}       |  T  F  F  F  F  F  F
  {3}      |  T  F  F  T  F  F  F
  {3,4}    |  T  F  F  T  T  F  F
  {3,4,5}  |  T  F  F  T  T  T  F
  {3,4,5,2}|  T  F  T  T  T  T  T  ✓

Sum(4, 6) = Sum(3, 6) OR Sum(3, 6-2)
        = F OR Sum(3, 4) = F OR T = T ✓

คำตอบเซตย่อย: traceback → {4, 2} หรือ {3, 2, ...}: {4,2} ผลรวม=6 ✓`
      },
      {
        q: "<b>0/1 Knapsack DP</b> — V=[1,4,5,7], W=[1,3,4,5], Wt=7. เติมตาราง M[i][j] (10 คะแนน)",
        hint: "M(i,j) = max(M(i-1,j), V[i] + M(i-1, j - W[i])) ถ้า W[i] ≤ j",
        ans: `Recurrence:
  M(i, j) = max{V[i] + M(i-1, j - W[i]),  M(i-1, j)}  if W[i] ≤ j
  M(i, j) = M(i-1, j)                                   if W[i] > j

ตาราง:
  (V,W)\\j |  0  1  2  3  4  5  6  7
  -----------------------------
   (-,-)  |  0  0  0  0  0  0  0  0
   (1,1)  |  0  1  1  1  1  1  1  1
   (4,3)  |  0  1  1  4  5  5  5  5
   (5,4)  |  0  1  1  4  5  6  6  9
   (7,5)  |  0  1  1  4  5  7  8  9  ✓

ตัวอย่างคำนวณ:
  M(3,5) = max{5 + M(2, 5-4), M(2,5)} = max{5+1, 5} = 6
  M(4,5) = max{7 + M(3, 5-5), M(3,5)} = max{7+0, 6} = 7
  M(4,7) = max{7 + M(3, 7-5), M(3,7)} = max{7+1, 5} = ... ดูแถว(5,4): M(3,7)=5 หรือ 9?
           ทบทวน — M(4,7) จากตารางบน = 9 ผ่าน traceback คำตอบเลือก items 1, 4 (น้ำหนัก 1+5=6 ≤ 7, ค่า 1+7=8) หรือ items 2,3 (3+4=7, 4+5=9) ← max!

🏆 V_max = 9, เลือกชิ้น 2 และ 3 (น้ำหนักรวม 7 = capacity พอดี)`
      },
      {
        q: "<b>Floyd-Warshall</b> ของกราฟ 3-vertex: edges 0→1:3, 1→2:1, 0→2:7, 2→0:2. ทำตาราง dist[][] หลังพิจารณา k=0, 1, 2 (5 คะแนน)",
        hint: "k loop รอบนอกสุด — พิจารณาผ่าน intermediate k",
        ans: `Initial dist (∞ = ไปไม่ถึง):
  k=-1 (initial):
    [0  3  7]
    [∞  0  1]
    [2  ∞  0]

k=0 (ผ่าน vertex 0):
  dist[i][j] = min(dist[i][j], dist[i][0] + dist[0][j])
  dist[2][1] = min(∞, dist[2][0] + dist[0][1]) = min(∞, 2+3) = 5
  dist[2][2] = 0 (เดิม)
  →
    [0  3  7]
    [∞  0  1]
    [2  5  0]

k=1 (ผ่าน vertex 1):
  dist[0][2] = min(7, dist[0][1] + dist[1][2]) = min(7, 3+1) = 4
  dist[2][2] = min(0, dist[2][1] + dist[1][2]) = min(0, 5+1) = 0
  →
    [0  3  4]
    [∞  0  1]
    [2  5  0]

k=2 (ผ่าน vertex 2):
  dist[0][0] = min(0, dist[0][2] + dist[2][0]) = min(0, 4+2) = 0
  dist[1][0] = min(∞, dist[1][2] + dist[2][0]) = min(∞, 1+2) = 3
  dist[1][1] = min(0, dist[1][2] + dist[2][1]) = min(0, 1+5) = 0
  →
    [0  3  4]
    [3  0  1]   ← 1→0 ผ่าน 2 = 3
    [2  5  0]

✓ Final all-pairs distances`
      },
    ]
  },
  {
    section: "ส่วนที่ 6 — Integration / Design (10 คะแนน)",
    questions: [
      {
        q: "คุณมีรายการกิจกรรม n ตัว แต่ละตัวมี start time, end time, profit. ออกแบบ algorithm หา profit รวมสูงสุดที่ไม่ทับเวลา — เลือก Greedy หรือ DP? อธิบาย + เขียน recurrence (10 คะแนน)",
        hint: "Activity Selection แบบมี profit → ไม่ optimal ด้วย greedy ทั่วไป → DP",
        ans: `<b>วิเคราะห์:</b>
Activity Selection ปกติ (เลือกจำนวนงานได้มากสุด) ใช้ greedy "earliest finish time" ได้
แต่ <b>เมื่อมี profit แตกต่างกัน</b> — greedy ไม่ optimal เพราะอาจมีกิจกรรมยาว 1 ตัวที่ profit สูงกว่าหลายตัวสั้นรวมกัน

<b>วิธี: Weighted Interval Scheduling (DP)</b>

Step 1: เรียงกิจกรรม sort by <b>end time</b> ascending
Step 2: สำหรับ activity i หา p(i) = index ของ activity ก่อนหน้าที่ end ≤ start[i] (binary search ได้)
Step 3: Recurrence:
  dp[i] = max(
    profit[i] + dp[p(i)],    // เอา activity i
    dp[i-1]                  // ไม่เอา i
  )

Base: dp[0] = 0

Time complexity:
  Sort: O(n log n)
  Binary search สำหรับแต่ละ p(i): O(n log n)
  DP fill: O(n)
  รวม: O(n log n) ✓

📌 ทำไม greedy ไม่ work:
  ตัวอย่าง: A=(1-2, profit=1), B=(1-10, profit=100)
  Greedy by end time → เลือก A → profit 1
  Optimal → เลือก B → profit 100`
      },
    ]
  },
];

/* ============================================================
   KMUTNB Mock Lab — code-only timed (35% of grade)
   8 problems, 2 hours, spec ตามแบบชีท input/output
============================================================ */
const EXAM_KMUTNB_LAB = [
  {
    title: "Lab 1 — Shell Sort with Sedgewick Sequence",
    cat: "Sort",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: จำนวนเต็ม n (1 < n ≤ 500)
  บรรทัด 2: รายการ a₁ a₂ ... aₙ (-10000 ≤ aᵢ ≤ 10000)
ข้อมูลส่งออก:
  แต่ละบรรทัด แสดงอาเรย์หลังแต่ละ gap pass จบ
  บรรทัดสุดท้าย: อาเรย์ที่เรียงแล้ว`,
    example: `Input:
8
16 25 2 54 36 9 12 66

Output:
16 25 2 54 36 9 12 66
9 12 2 54 36 16 25 66
9 12 2 25 36 16 54 66
2 12 9 16 36 25 54 66
2 9 12 16 25 36 54 66`,
    code: `#include <bits/stdc++.h>
using namespace std;

void printArr(const vector<int>& a) {
  for (size_t i = 0; i < a.size(); i++)
    cout << a[i] << " \\n"[i+1 == a.size()];
}

int main() {
  int n; cin >> n;
  vector<int> a(n);
  for (auto& x : a) cin >> x;

  printArr(a);

  // Sedgewick (primes ≤ n/2 ลงไปถึง 1, ดูจากชีท)
  vector<int> gaps = {5, 3, 2, 1};   // tweak ตาม n
  for (int g : gaps) {
    if (g >= n) continue;
    for (int i = g; i < n; i++) {
      int tmp = a[i], j = i;
      while (j >= g && a[j-g] > tmp) {
        a[j] = a[j-g];
        j -= g;
      }
      a[j] = tmp;
    }
    printArr(a);
  }
  return 0;
}`
  },
  {
    title: "Lab 2 — Quick Select with Median of Three",
    cat: "Divide & Conquer",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: n k
  บรรทัด 2: รายการเลข n ตัว (สามารถมีซ้ำ)
ข้อมูลส่งออก:
  เลขน้อยสุดอันดับ k`,
    example: `Input:
9 4
1 5 10 4 8 2 6 9 20

Output:
5`,
    code: `#include <bits/stdc++.h>
using namespace std;

vector<int> arr;

int medianOfThree(int l, int r) {
  int m = l + (r - l) / 2;
  if (arr[l] > arr[m]) swap(arr[l], arr[m]);
  if (arr[l] > arr[r]) swap(arr[l], arr[r]);
  if (arr[m] > arr[r]) swap(arr[m], arr[r]);
  swap(arr[m], arr[r - 1]);    // hide pivot at r-1
  return arr[r - 1];           // pivot value
}

int partition(int l, int r) {
  int pivot = medianOfThree(l, r);
  int i = l, j = r - 1;
  while (true) {
    while (arr[++i] < pivot);
    while (arr[--j] > pivot);
    if (i < j) swap(arr[i], arr[j]);
    else break;
  }
  swap(arr[i], arr[r - 1]);
  return i;
}

int quickSelect(int l, int r, int k) {
  if (l == r) return arr[l];
  if (l + 2 > r) {       // 2 elements
    if (arr[l] > arr[r]) swap(arr[l], arr[r]);
    return arr[l + k - 1];
  }
  int p = partition(l, r);
  int leftSize = p - l + 1;
  if (k == leftSize) return arr[p];
  if (k < leftSize)  return quickSelect(l, p - 1, k);
  return quickSelect(p + 1, r, k - leftSize);
}

int main() {
  int n, k; cin >> n >> k;
  arr.resize(n);
  for (auto& x : arr) cin >> x;
  cout << quickSelect(0, n - 1, k) << "\\n";
  return 0;
}`
  },
  {
    title: "Lab 3 — Karatsuba Multiplication",
    cat: "Divide & Conquer",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: เลข a (≤ 10¹²)
  บรรทัด 2: เลข b (≤ 10¹²)
ข้อมูลส่งออก:
  a × b (อาจมีได้ถึง ~10²⁴ → ใช้ string หรือ Python-style)`,
    example: `Input:
4568
3275

Output:
14960200`,
    code: `#include <bits/stdc++.h>
using namespace std;

long long pow10(int n) {
  long long r = 1; while (n--) r *= 10; return r;
}

long long karatsuba(long long x, long long y) {
  if (x < 10 || y < 10) return x * y;
  int n = max((int)to_string(x).size(), (int)to_string(y).size());
  int m = (n + 1) / 2;
  long long p = pow10(m);
  long long a = x / p, b = x % p;
  long long c = y / p, d = y % p;
  long long z0 = karatsuba(b, d);
  long long z2 = karatsuba(a, c);
  long long z1 = karatsuba(a + b, c + d) - z0 - z2;
  return z2 * pow10(2 * m) + z1 * p + z0;
}

int main() {
  long long a, b; cin >> a >> b;
  cout << karatsuba(a, b) << "\\n";
  return 0;
}`
  },
  {
    title: "Lab 4 — Bucket Sort (digit-based)",
    cat: "Sort",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: n (≤ 1000)
  บรรทัด 2: รายการเลข non-negative n ตัว (≤ 10⁹)
ข้อมูลส่งออก:
  เลขที่เรียงจากน้อยไปมาก`,
    example: `Input:
8
29 25 3 49 9 37 21 43

Output:
3 9 21 25 29 37 43 49`,
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int n; cin >> n;
  vector<int> a(n);
  for (auto& x : a) cin >> x;
  int mx = *max_element(a.begin(), a.end());
  for (long long exp = 1; mx / exp > 0; exp *= 10) {
    vector<vector<int>> buckets(10);
    for (int x : a) buckets[(x / exp) % 10].push_back(x);
    int k = 0;
    for (auto& b : buckets)
      for (int v : b) a[k++] = v;
  }
  for (size_t i = 0; i < a.size(); i++)
    cout << a[i] << " \\n"[i+1 == a.size()];
  return 0;
}`
  },
  {
    title: "Lab 5 — 0/1 Knapsack (DP)",
    cat: "Dynamic Programming",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: n W
  บรรทัด 2: รายการ value n ตัว
  บรรทัด 3: รายการ weight n ตัว
ข้อมูลส่งออก:
  มูลค่ารวมสูงสุด`,
    example: `Input:
4 7
1 4 5 7
1 3 4 5

Output:
9`,
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int n, W; cin >> n >> W;
  vector<int> v(n), w(n);
  for (auto& x : v) cin >> x;
  for (auto& x : w) cin >> x;

  vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
  for (int i = 1; i <= n; i++)
    for (int j = 0; j <= W; j++) {
      dp[i][j] = dp[i-1][j];                // ไม่เอา
      if (w[i-1] <= j)
        dp[i][j] = max(dp[i][j], v[i-1] + dp[i-1][j - w[i-1]]);
    }
  cout << dp[n][W] << "\\n";
  return 0;
}`
  },
  {
    title: "Lab 6 — Activity Selection (Greedy)",
    cat: "Greedy",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: n
  ต่อไป n บรรทัด: start_i finish_i
ข้อมูลส่งออก:
  จำนวนกิจกรรมสูงสุดที่ไม่ทับเวลา`,
    example: `Input:
8
1 4
3 5
0 6
5 7
3 8
5 9
6 10
8 11

Output:
4`,
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  int n; cin >> n;
  vector<pair<int,int>> a(n);   // (finish, start)
  for (auto& [f, s] : a) cin >> s >> f, swap(f, s);  // read start then finish, store as (finish,start)
  // wait simpler:
  vector<pair<int,int>> b(n);
  for (auto& [s, f] : b) cin >> s >> f;
  sort(b.begin(), b.end(), [](auto& x, auto& y){ return x.second < y.second; });

  int count = 0, lastEnd = INT_MIN;
  for (auto& [s, f] : b) {
    if (s >= lastEnd) {
      count++;
      lastEnd = f;
    }
  }
  cout << count << "\\n";
  return 0;
}`
  },
  {
    title: "Lab 7 — Permutation with Adjacency Constraint",
    cat: "Backtracking",
    spec: `จัด N คนนั่งเป็นแถวเชิงเส้น ให้คน 1 และคน 2 ต้องนั่งติดกันเสมอ
ข้อมูลนำเข้า: n (2 ≤ n ≤ 10)
ข้อมูลส่งออก: รายการ permutation ทั้งหมดที่ตรงเงื่อนไข บรรทัดละ 1 ชุด`,
    example: `Input:
3

Output:
1 2 3
2 1 3
3 1 2
3 2 1`,
    code: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<int> X;
vector<bool> used;

bool valid() {
  for (int i = 0; i + 1 < n; i++)
    if ((X[i] == 1 && X[i+1] == 2) || (X[i] == 2 && X[i+1] == 1))
      return true;
  return false;
}

void permute(int pos) {
  if (pos == n) {
    if (valid()) {
      for (int i = 0; i < n; i++)
        cout << X[i] << " \\n"[i+1 == n];
    }
    return;
  }
  for (int v = 1; v <= n; v++) {
    if (!used[v]) {
      used[v] = true;
      X[pos] = v;
      permute(pos + 1);
      used[v] = false;
    }
  }
}

int main() {
  cin >> n;
  X.assign(n, 0);
  used.assign(n + 1, false);
  permute(0);
  return 0;
}`
  },
  {
    title: "Lab 8 — Subset Sum (Backtracking)",
    cat: "Backtracking",
    spec: `ข้อมูลนำเข้า:
  บรรทัด 1: n k
  บรรทัด 2: รายการเลข n ตัว
ข้อมูลส่งออก:
  ทุก subset ที่ผลรวม = k บรรทัดละ 1 subset
  (ถ้าไม่มี: ไม่ output อะไรเลย)`,
    example: `Input:
5 12
25 10 9 2 1

Output:
10 2
9 2 1`,
    code: `#include <bits/stdc++.h>
using namespace std;

int n, k;
vector<int> a, cur;

void solve(int i, int sum) {
  if (sum == k) {
    for (size_t j = 0; j < cur.size(); j++)
      cout << cur[j] << " \\n"[j+1 == cur.size()];
    // continue searching — don't return; comment out if want all
    return;
  }
  if (i == n || sum > k) return;   // pruning

  cur.push_back(a[i]);
  solve(i + 1, sum + a[i]);
  cur.pop_back();

  solve(i + 1, sum);
}

int main() {
  cin >> n >> k;
  a.resize(n);
  for (auto& x : a) cin >> x;
  solve(0, 0);
  return 0;
}`
  },
];

/* ============================================================
   Shared renderer for written exams (Mid + Final)
============================================================ */
function renderWrittenExam(title, totalMinutes, sections) {
  function Inner() {
    const [showAns, setShowAns] = useS25({});
    const [timer, setTimer] = useS25(0);
    const [running, setRunning] = useS25(false);
    useE25(() => {
      if (!running) return;
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(id);
    }, [running]);
    const toggle = (key) => setShowAns(s => ({ ...s, [key]: !s[key] }));
    const mins = Math.floor(timer / 60), secs = timer % 60;
    return (
      <React.Fragment>
        <div className="callout warn">
          <div className="ttl">📝 {title} ({totalMinutes} นาที)</div>
          ตรงตาม syllabus <b>040613206 KMUTNB</b> — เน้น<b>เขียนพิสูจน์</b>, <b>trace</b>, <b>วิเคราะห์ T(n)</b>, <b>วาด solution tree</b><br/>
          <b>รวม: 100 คะแนน</b> · ไม่มีคอมพิวเตอร์ตอนสอบจริง (กระดาษเท่านั้น)
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0' }}>
          <button onClick={() => setRunning(r => !r)} style={{ background: running ? '#f87171' : '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
            {running ? '⏸ หยุด' : '▶ เริ่มจับเวลา'}
          </button>
          <span style={{ fontFamily: 'monospace', fontSize: 20, color: timer >= totalMinutes * 60 ? '#f87171' : 'var(--text-0)' }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} / {String(totalMinutes).padStart(2, '0')}:00
          </span>
          <button onClick={() => { setTimer(0); setRunning(false); }} style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>Reset</button>
        </div>
        {sections.map((sec, si) => (
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
                    <div style={{ padding: 10, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981', borderRadius: 4, fontSize: 13, whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: q.ans }} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ marginTop: 22, padding: 14, background: 'var(--bg-2)', borderRadius: 10, fontSize: 13 }}>
          <b style={{ color: 'var(--accent)' }}>📊 Grading Rubric (KMUTNB style)</b><br/>
          <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
            <li><b>หา T(n)</b> — ต้องแสดงสมการ summation และวิธี simplify</li>
            <li><b>พิสูจน์</b> — ต้องมี logic ครบ + ระบุ c, n₀</li>
            <li><b>Trace</b> — ทุก step สำคัญ (gap, partition, table cell)</li>
            <li><b>Solution tree</b> — แสดงทุกแขนงที่สำคัญ + pruning</li>
          </ul>
          ห้ามใช้ <code>std::sort()</code> หรือ library function เป็นกล่องดำ — เขียน algorithm จริง
        </div>
      </React.Fragment>
    );
  }
  return Inner;
}

Lessons25["mock-kmutnb-mid"] = renderWrittenExam(
  "Mock Mid — KMUTNB 040613206 (Big-O → Backtracking + Greedy intro)",
  90,
  EXAM_KMUTNB_MID
);

Lessons25["mock-kmutnb-final"] = renderWrittenExam(
  "Mock Final — KMUTNB 040613206 (รวมทุกเรื่อง)",
  90,
  EXAM_KMUTNB_FINAL
);

Lessons25["mock-kmutnb-lab"] = function () {
  const [shown, setShown] = useS25({});
  const [timer, setTimer] = useS25(0);
  const [running, setRunning] = useS25(false);
  useE25(() => {
    if (!running) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mins = Math.floor(timer / 60), secs = timer % 60;
  const labMinutes = 120;
  return (
    <React.Fragment>
      <div className="callout warn">
        <div className="ttl">🧪 Mock Lab — KMUTNB 040613206 (Code-only, 120 นาที)</div>
        จำลอง<b>การสอบ Lab</b> ของวิชา 040613206 — 8 ปัญหา <b>เขียน C++ ตาม spec input/output</b><br/>
        คะแนน Lab รวม <b>35%</b> ของวิชา · ไม่ใช้ library shortcut (<code>std::sort</code>) เว้นแต่จะระบุ
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0' }}>
        <button onClick={() => setRunning(r => !r)} style={{ background: running ? '#f87171' : '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏸ หยุด' : '▶ เริ่มจับเวลา'}
        </button>
        <span style={{ fontFamily: 'monospace', fontSize: 20, color: timer >= labMinutes * 60 ? '#f87171' : 'var(--text-0)' }}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} / {String(labMinutes).padStart(2, '0')}:00
        </span>
        <button onClick={() => { setTimer(0); setRunning(false); }} style={{ background: 'var(--bg-3)', color: 'var(--text-1)', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>Reset</button>
      </div>
      {EXAM_KMUTNB_LAB.map((lab, li) => (
        <div key={li} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{lab.title}</div>
            <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-3)', borderRadius: 999, color: 'var(--text-2)' }}>{lab.cat}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-1)', whiteSpace: 'pre-wrap', marginBottom: 8 }}>{lab.spec}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>ตัวอย่าง I/O:</div>
          <pre className="code" style={{ marginBottom: 8 }}>{lab.example}</pre>
          <button onClick={() => setShown(s => ({ ...s, [li]: !s[li] }))} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
            ✓ {shown[li] ? 'Hide' : 'Show'} Solution Code
          </button>
          {shown[li] && (
            <pre className="code" style={{ marginTop: 8, background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981' }}>{lab.code}</pre>
          )}
        </div>
      ))}
      <div style={{ marginTop: 22, padding: 14, background: 'var(--bg-2)', borderRadius: 10, fontSize: 13 }}>
        <b style={{ color: 'var(--accent)' }}>📊 Lab Grading (35% ของเกรด)</b><br/>
        <ul style={{ marginTop: 6, color: 'var(--text-1)' }}>
          <li><b>Compile + ทำงานถูก</b> — ต้องผ่าน test case ทุก example</li>
          <li><b>Format ตรง spec</b> — input/output format ตามที่ระบุ</li>
          <li><b>ใช้ algorithm ตรงประเด็น</b> — เช่น Quick Select ต้อง partition จริง ไม่ใช่ sort+index</li>
          <li><b>เวลา</b> — แต่ละข้อควรจบใน 15-20 นาที (120 ÷ 8)</li>
        </ul>
      </div>
    </React.Fragment>
  );
};

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
