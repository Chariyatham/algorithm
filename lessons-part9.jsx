/* Lessons Part 9 — Practice Bank, Notes, Streak, Mastery, Search, Sandbox, Print */

const { useState: useS9, useMemo: useM9, useEffect: useE9, useRef: useR9 } = React;

const Lessons9 = {};

/* ============================================================
   PRACTICE BANK — by topic
============================================================ */
const PRACTICE = {
  "Big-O": [
    { d: "easy", q: "for(i=0;i<n;i++) sum++;", a: "O(n)", h: "ลูปเดียววน n ครั้ง" },
    { d: "easy", q: "for(i=0;i<n;i++) for(j=0;j<n;j++) sum++;", a: "O(n²)", h: "ลูปซ้อน n × n" },
    { d: "easy", q: "for(i=1;i<n;i*=2) sum++;", a: "O(log n)", h: "i ทวีคูณ → log₂n ครั้ง" },
    { d: "med", q: "for(i=0;i<n;i++) for(j=i;j<n;j++) sum++;", a: "O(n²)", h: "1+2+..+n = n(n+1)/2 ตัด constant" },
    { d: "med", q: "for(i=1;i<n;i*=2) for(j=0;j<i;j++) sum++;", a: "O(n)", h: "geometric: 1+2+4+..+n/2 ≈ n" },
    { d: "med", q: "for(i=0;i<n*n;i++) sum++;", a: "O(n²)", h: "อย่ามองว่าเป็นลูปเดียวเลย ดู bound ที่ n²" },
    { d: "hard", q: "T(n) = T(n-1) + n", a: "O(n²)", h: "T(n) = 1+2+..+n = O(n²)" },
    { d: "hard", q: "T(n) = 2T(n/2) + n", a: "O(n log n)", h: "Master Theorem: a=2,b=2,d=1, log_b a = 1 = d → Case 2" },
    { d: "hard", q: "T(n) = 7T(n/2) + n²", a: "O(n^2.807)", h: "Strassen: log₂7 ≈ 2.807 > 2 = d → Case 1" },
    { d: "hard", q: "T(n) = T(n-1) + T(n-2) + 1", a: "O(2ⁿ)", h: "Fibonacci recurrence; ≈ φⁿ" },
    { d: "hard", q: "for(i=1;i<n;i*=2) for(j=1;j<i;j*=2) sum++;", a: "O((log n)²)", h: "outer log n, inner log i — รวม Σ log i = O((log n)²)" },
  ],
  "Sort": [
    { d: "easy", q: "Best case ของ Bubble Sort (ใช้ flag) คืออะไร?", a: "O(n)", h: "ถ้า array เรียงแล้ว ทำ pass เดียวไม่มี swap → หยุด" },
    { d: "easy", q: "Worst case ของ Quick Sort?", a: "O(n²)", h: "เกิดเมื่อ pivot ไม่ดี (เช่น sorted input, pivot=ตัวสุดท้าย)" },
    { d: "easy", q: "Bubble sort 1 pass บน [5,1,4,2,8]", a: "[1,4,2,5,8]", h: "ตัวมากลอยไปขวา — 5 ขยับขวาสุด (8 อยู่แล้ว)" },
    { d: "med", q: "Insertion sort [29,10,14,37,13] หลัง 2 passes", a: "[10,14,29,37,13]", h: "i=1: ใส่ 10 หน้า; i=2: ใส่ 14 ระหว่าง 10,29" },
    { d: "med", q: "Selection sort [64,25,12,22,11] รอบ 1", a: "[11,25,12,22,64]", h: "หา min=11, swap กับ a[0]=64" },
    { d: "med", q: "Quick sort partition [10,80,30,90,40,50,70] pivot=70 (Lomuto)", a: "[10,30,40,50,70,90,80]", h: "ตัวที่ ≤ 70 ไปซ้าย, > 70 ไปขวา; pivot ลงตำแหน่ง" },
    { d: "med", q: "Merge sort: merge [1,4,7] + [2,5,6]", a: "[1,2,4,5,6,7]", h: "เปรียบหัวกัน เลือกตัวน้อย" },
    { d: "hard", q: "Sort ที่ stable + O(n log n) garantee?", a: "Merge Sort", h: "Quick ไม่เสถียร, Heap ไม่เสถียร, Merge เสถียรและ O(n log n) ทุกกรณี" },
    { d: "hard", q: "Quick sort pivot=ตัวแรก [6,2,8,1,5] หลัง partition?", a: "L=[2,1,5], pivot=6, R=[8]", h: "หา ≤ 6: 2,1,5 → ซ้าย" },
  ],
  "Search": [
    { d: "easy", q: "Binary search หา 22 ใน [5,8,12,16,22,30,40] ใช้กี่ครั้ง?", a: "2 ครั้ง", h: "mid=3(16)<22→ขวา, mid=5(30)>22→ซ้าย, mid=4(22) ✓ (3 comparisons)" },
    { d: "easy", q: "Best case Linear search?", a: "O(1)", h: "เจอที่ตำแหน่งแรก" },
    { d: "med", q: "Interpolation search ใช้กับข้อมูลแบบใดถึงเร็วสุด?", a: "เรียงและกระจายสม่ำเสมอ", h: "ถ้าไม่สม่ำเสมอ → O(n)" },
    { d: "med", q: "BS ใน array 1M element ใช้กี่ iter max?", a: "20 iter", h: "log₂(10⁶) ≈ 20" },
    { d: "hard", q: "หา smallest element ≥ x (lower_bound) ใน sorted [1,3,5,7,9], x=4", a: "5 (index 2)", h: "modified BS: เก็บ candidate ทุกครั้งที่ mid ≥ x" },
  ],
  "DAC": [
    { d: "easy", q: "Master Theorem T(n)=2T(n/2)+n", a: "O(n log n)", h: "a=2,b=2,d=1, log₂2=1=d → Case 2" },
    { d: "easy", q: "Strassen multiplication count?", a: "7", h: "ลด 8 → 7 (M1-M7)" },
    { d: "med", q: "Karatsuba T(n) recurrence?", a: "T(n) = 3T(n/2) + n", h: "3 sub-multiply (ไม่ใช่ 4); O(n^1.585)" },
    { d: "med", q: "Quick Select k=3 ใน [7,2,5,1,9] pivot=7", a: "5", h: "L=[2,5,1], E=[7], G=[9]. k=3 ≤ |L|=3 → recurse L" },
    { d: "hard", q: "Matrix mult naive vs DAC vs Strassen complexity?", a: "O(n³) vs O(n³) vs O(n^2.807)", h: "DAC ปกติยัง 8T(n/2)+n² = O(n³)" },
  ],
  "Greedy/DP": [
    { d: "easy", q: "Fractional Knapsack: W=20, items=(w=5,v=10)(w=8,v=24)(w=10,v=25) — strategy?", a: "เรียง v/w จากมาก ใส่ตามลำดับ", h: "v/w = 2, 3, 2.5 → ใส่ 2(8,24) → 3(10,25) → ใส่ 1: 2/5 ของชิ้น 1" },
    { d: "easy", q: "0/1 Knapsack ใช้ Greedy ได้ไหม?", a: "ไม่ได้ ใช้ DP", h: "Counter: W=10, items=(5,10)(6,12)(5,10). Greedy v/w เลือก 1 ตัว = 10; DP เลือก 2 = 20" },
    { d: "med", q: "Activity Selection เรียงตามอะไร?", a: "Finish time", h: "Greedy choice: เลือกตัวจบเร็วสุด เพื่อเหลือเวลามากสุด" },
    { d: "med", q: "Coin {1,3,4} จ่าย 6 — Greedy vs DP?", a: "Greedy 3 เหรียญ (4+1+1); DP 2 เหรียญ (3+3)", h: "Greedy ไม่ optimal ใน non-canonical coin system" },
    { d: "hard", q: "0/1 Knapsack W=5, items=(w=1,v=1)(w=2,v=4)(w=3,v=5)(w=4,v=7) → max v?", a: "9", h: "เลือก item 2 + 3: w=5, v=9" },
    { d: "hard", q: "LCS ของ 'ABCBDAB' และ 'BDCABA' ยาวกี่ตัว?", a: "4 (BCBA หรือ BDAB)", h: "DP: dp[i][j] = LCS ของ X[0..i-1], Y[0..j-1]" },
  ],
  "Graph": [
    { d: "easy", q: "BFS ใช้ DS?", a: "Queue", h: "FIFO → เยี่ยมระดับต่อระดับ" },
    { d: "easy", q: "DFS ใช้ DS?", a: "Stack หรือ Recursion", h: "LIFO → ลึกก่อน" },
    { d: "med", q: "หา shortest path unweighted ใช้อะไร?", a: "BFS", h: "Dijkstra สำหรับ weighted" },
    { d: "med", q: "Topological sort ใช้กับกราฟแบบไหน?", a: "DAG (Directed Acyclic)", h: "ถ้ามี cycle → topo sort ไม่ได้" },
    { d: "med", q: "Dijkstra ใช้กับ weight ติดลบได้ไหม?", a: "ไม่ได้ — ใช้ Bellman-Ford แทน", h: "Greedy choice พังเมื่อมี negative" },
    { d: "hard", q: "MST: Prim O(?) ด้วย min-heap", a: "O((V+E) log V)", h: "ทุก node extract-min + decrease-key" },
    { d: "hard", q: "Cycle detection ใน undirected graph?", a: "DFS + parent tracking (ถ้า neighbor visited แต่ไม่ใช่ parent → cycle)", h: "ต่างจาก directed ที่ใช้ recStack" },
    { d: "hard", q: "Floyd-Warshall complexity?", a: "O(V³)", h: "3 loops nested — all pairs shortest path" },
  ],
  "Backtracking": [
    { d: "easy", q: "Permutation ของ {A,B,C} กี่แบบ?", a: "6 (3!)", h: "ABC, ACB, BAC, BCA, CAB, CBA" },
    { d: "easy", q: "Subset ของ {1,2,3} กี่เซต?", a: "8 (2³)", h: "รวม empty set" },
    { d: "med", q: "N-Queens n=4 กี่ solutions?", a: "2", h: "(2,4,1,3) และ (3,1,4,2)" },
    { d: "med", q: "Backtracking ต่างจาก Brute force?", a: "Backtracking ตัดกิ่ง (prune) เมื่อรู้ว่าไม่ valid", h: "Brute force ลองทุกแบบ; BT มี pruning" },
    { d: "hard", q: "Sudoku 9×9 brute force vs backtracking?", a: "Brute 9^81; BT ตัดเร็ว (เช็ค row/col/box ก่อนใส่)", h: "9^81 ≈ 10^77 — backtracking ใช้ได้จริง" },
    { d: "hard", q: "Subset Sum: หาเซตย่อยของ {3,4,1,2,5} ที่ sum=8 มีกี่เซต?", a: "3 → {3,4,1},{3,5},{1,2,5}", h: "DFS + pruning ถ้า sum > target" },
  ],
};

Lessons9["practice-bank"] = function () {
  const [topic, setTopic] = useS9('Big-O');
  const [diff, setDiff] = useS9('all');
  const [showA, setShowA] = useS9({});
  const items = useM9(() => PRACTICE[topic].filter(x => diff === 'all' || x.d === diff), [topic, diff]);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🧪 Practice Bank — โจทย์แยกหัวข้อ</div>
        50+ โจทย์รวมทุกหัวข้อ — easy/medium/hard มี hint และเฉลย — ลองคิดก่อนเปิดเฉลย!
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {Object.keys(PRACTICE).map(t => (
          <button key={t} onClick={() => { setTopic(t); setShowA({}); }}
            style={{ background: topic === t ? 'var(--accent)' : 'var(--bg-2)', color: topic === t ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13, fontWeight: topic === t ? 600 : 400 }}>
            {t} ({PRACTICE[t].length})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['all', 'easy', 'med', 'hard'].map(d => (
          <button key={d} onClick={() => setDiff(d)}
            style={{ background: diff === d ? 'var(--accent-2)' : 'var(--bg-3)', color: diff === d ? '#000' : 'var(--text-2)', border: 'none', padding: '4px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: diff === d ? 600 : 400 }}>
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      {items.map((it, i) => {
        const k = topic + '-' + i;
        const colors = { easy: '#10b981', med: '#fbbf24', hard: '#f87171' };
        return (
          <div key={k} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>ข้อ {i + 1}</span>
              <span style={{ background: colors[it.d], color: '#000', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{it.d.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-0)', whiteSpace: 'pre-wrap', marginBottom: 8 }}>{it.q}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {!showA[k] && (
                <React.Fragment>
                  <button onClick={() => setShowA({ ...showA, [k]: 'hint' })} style={{ background: 'transparent', color: '#fbbf24', border: '1px solid #fbbf24', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>💡 Hint</button>
                  <button onClick={() => setShowA({ ...showA, [k]: 'ans' })} style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>✓ เฉลย</button>
                </React.Fragment>
              )}
              {showA[k] === 'hint' && (
                <button onClick={() => setShowA({ ...showA, [k]: 'ans' })} style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>✓ เฉลย</button>
              )}
            </div>
            {showA[k] === 'hint' && (
              <div style={{ marginTop: 8, padding: 8, background: 'rgba(251,191,36,0.08)', borderLeft: '3px solid #fbbf24', borderRadius: 4, fontSize: 13, color: 'var(--text-1)' }}>💡 {it.h}</div>
            )}
            {showA[k] === 'ans' && (
              <div style={{ marginTop: 8, padding: 8, background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', borderRadius: 4, fontSize: 13 }}>
                <div style={{ color: '#10b981', fontWeight: 600, fontFamily: 'monospace' }}>✓ {it.a}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12, marginTop: 4 }}>{it.h}</div>
              </div>
            )}
          </div>
        );
      })}
    </React.Fragment>
  );
};

/* ============================================================
   DAILY STREAK
============================================================ */
Lessons9["daily-streak"] = function () {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useS9(() => {
    try { return JSON.parse(localStorage.getItem('algo-streak') || '{}'); } catch { return {}; }
  });
  const [picked, setPicked] = useS9([]);
  const [showA, setShowA] = useS9({});

  useE9(() => { localStorage.setItem('algo-streak', JSON.stringify(data)); }, [data]);

  // Generate today's 5 random questions (deterministic per day)
  const todayQs = useM9(() => {
    const all = Object.entries(PRACTICE).flatMap(([t, items]) => items.map(it => ({ ...it, topic: t })));
    // Seed by date
    const seed = today.split('-').join('') | 0;
    const out = [];
    const used = new Set();
    let s = seed;
    while (out.length < 5 && used.size < all.length) {
      s = (s * 9301 + 49297) % 233280;
      const idx = Math.abs(s) % all.length;
      if (!used.has(idx)) { used.add(idx); out.push(all[idx]); }
    }
    return out;
  }, [today]);

  const todayDone = data[today] ? data[today].correct : 0;
  const streak = useM9(() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (data[key] && data[key].correct >= 3) s++;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [data]);

  const totalDone = Object.values(data).filter(x => x.correct >= 3).length;
  const markDone = (i, correct) => {
    setShowA({ ...showA, [i]: true });
    if (correct) {
      setData(d => ({ ...d, [today]: { correct: (d[today]?.correct || 0) + 1, total: 5, ts: Date.now() } }));
    }
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔥 Daily Streak — ฝึก 5 ข้อ/วัน</div>
        งานวิจัยพบ <b>spaced repetition</b> + <b>daily habit</b> ดีกว่าอ่านทีเดียว 2-3 เท่า — 15-20 นาที/วัน ก็พอ
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fbbf24' }}>{streak}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>🔥 Current Streak (วัน)</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{todayDone}/5</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>วันนี้ ({today})</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-2)' }}>{totalDone}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>วันที่ทำได้ครบ</div>
        </div>
      </div>

      {todayDone >= 3 && <div className="callout success" style={{ marginBottom: 14 }}>🎉 วันนี้ผ่านแล้ว! streak +1 — กลับมาทำพรุ่งนี้นะ</div>}

      <h3>📝 โจทย์ของวันนี้</h3>
      {todayQs.map((q, i) => (
        <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{q.topic.toUpperCase()} · {q.d.toUpperCase()}</span>
            <span style={{ color: 'var(--text-2)', fontSize: 12 }}>#{i + 1}</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{q.q}</div>
          {!showA[i] ? (
            <button onClick={() => setShowA({ ...showA, [i]: true })} style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>เฉลย</button>
          ) : (
            <React.Fragment>
              <div style={{ padding: 8, background: 'rgba(16,185,129,0.08)', borderLeft: '3px solid #10b981', borderRadius: 4 }}>
                <div style={{ color: '#10b981', fontWeight: 600, fontFamily: 'monospace' }}>✓ {q.a}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 12, marginTop: 4 }}>{q.h}</div>
              </div>
              {showA[i] === true && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <button onClick={() => markDone(i, false)} style={{ flex: 1, background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid #f87171', padding: 8, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✗ ตอบไม่ถูก</button>
                  <button onClick={() => markDone(i, true)} style={{ flex: 1, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: 8, borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>✓ ตอบถูก</button>
                </div>
              )}
              {showA[i] && showA[i] !== true && (
                <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-3)' }}>บันทึกแล้ว</div>
              )}
            </React.Fragment>
          )}
        </div>
      ))}

      <h3 style={{ marginTop: 20 }}>📅 7 วันที่ผ่านมา</h3>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const k = d.toISOString().slice(0, 10);
          const done = data[k]?.correct >= 3;
          return (
            <div key={k} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', background: done ? 'rgba(16,185,129,0.15)' : 'var(--bg-2)', borderRadius: 6, border: `1px solid ${done ? '#10b981' : 'var(--border)'}` }}>
              <div style={{ fontSize: 10, color: 'var(--text-2)' }}>{['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'][d.getDay()]}</div>
              <div style={{ fontSize: 20 }}>{done ? '🔥' : '·'}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{k.slice(5)}</div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   NOTES — per lesson
============================================================ */
function NotesPanel() {
  const route = window.location.hash.replace(/^#\/?/, '') || 'home';
  const [notes, setNotes] = useS9(() => {
    try { return JSON.parse(localStorage.getItem('algo-notes') || '{}'); } catch { return {}; }
  });
  const [open, setOpen] = useS9(false);
  const text = notes[route] || '';
  const save = (v) => {
    const next = { ...notes, [route]: v };
    setNotes(next);
    localStorage.setItem('algo-notes', JSON.stringify(next));
  };
  if (route === 'home') return null;
  return (
    <React.Fragment>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 100,
        background: open ? '#fbbf24' : 'var(--accent)', color: '#000', border: 'none',
        padding: '10px 14px', borderRadius: 22, cursor: 'pointer', fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)', fontSize: 13
      }}>
        📓 Notes {text && '•'}
      </button>
      {open && (
        <div style={{ position: 'fixed', right: 16, bottom: 70, zIndex: 100, width: 360, background: 'var(--bg-2)', border: '1px solid var(--accent)', borderRadius: 12, padding: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>📓 NOTES — {route}</div>
          <textarea value={text} onChange={e => save(e.target.value)}
            placeholder="โน้ตของคุณ — เก็บใน browser อัตโนมัติ&#10;ตัวอย่าง: สูตร summation, mnemonic, ตัวอย่างที่อาจารย์ให้..."
            style={{ width: '100%', height: 200, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6, padding: 8, fontSize: 13, fontFamily: 'monospace', resize: 'vertical' }} />
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>💾 บันทึกอัตโนมัติ · {text.length} chars</div>
        </div>
      )}
    </React.Fragment>
  );
}

/* ============================================================
   GLOBAL SEARCH (Cmd+K)
============================================================ */
function GlobalSearch() {
  const [open, setOpen] = useS9(false);
  const [q, setQ] = useS9('');
  const inputRef = useR9(null);
  useE9(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useE9(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const results = useM9(() => {
    if (!q) return [];
    const ql = q.toLowerCase();
    return (window.ALL_LESSONS || []).filter(l =>
      l.title.toLowerCase().includes(ql) ||
      l.id.toLowerCase().includes(ql) ||
      (l.desc || '').toLowerCase().includes(ql)
    ).slice(0, 12);
  }, [q]);

  if (!open) return null;
  return (
    <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 600, background: 'var(--bg-1)', borderRadius: 12, padding: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="ค้นหาบทเรียน... (ESC ปิด)"
          style={{ width: '100%', padding: 12, fontSize: 16, background: 'var(--bg-2)', color: 'var(--text-0)', border: '1px solid var(--accent-2)', borderRadius: 8 }} />
        <div style={{ marginTop: 10, maxHeight: '60vh', overflowY: 'auto' }}>
          {results.map(l => (
            <div key={l.id} onClick={() => { window.location.hash = '/' + l.id; setOpen(false); }}
              style={{ padding: 10, cursor: 'pointer', borderRadius: 6, transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontWeight: 600 }}>{l.num} · {l.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{l.desc}</div>
            </div>
          ))}
          {q && results.length === 0 && <div style={{ padding: 10, color: 'var(--text-3)', textAlign: 'center' }}>ไม่พบ</div>}
          {!q && <div style={{ padding: 10, color: 'var(--text-3)', fontSize: 13 }}>พิมพ์เพื่อค้น — กด <kbd>Cmd/Ctrl + K</kbd> ที่ไหนก็ได้</div>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TOPIC MASTERY
============================================================ */
Lessons9["mastery"] = function () {
  const progress = useM9(() => {
    try { return JSON.parse(localStorage.getItem('algo-academy-progress-v1') || '{}'); } catch { return {}; }
  }, []);
  const streak = useM9(() => {
    try { return JSON.parse(localStorage.getItem('algo-streak') || '{}'); } catch { return {}; }
  }, []);
  const notes = useM9(() => {
    try { return JSON.parse(localStorage.getItem('algo-notes') || '{}'); } catch { return {}; }
  }, []);

  const sections = (window.CURRICULUM || []).map(s => ({
    ...s,
    done: s.lessons.filter(l => progress[l.id]).length,
    total: s.lessons.length,
    pct: Math.round(100 * s.lessons.filter(l => progress[l.id]).length / s.lessons.length)
  }));

  const totalDone = Object.values(progress).filter(Boolean).length;
  const totalAll = (window.ALL_LESSONS || []).length;
  const totalPct = Math.round(100 * totalDone / Math.max(1, totalAll));
  const noteCount = Object.values(notes).filter(v => v && v.trim()).length;
  const streakCount = Object.values(streak).filter(v => v.correct >= 3).length;

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📈 Topic Mastery — ภาพรวมการเรียน</div>
        ติดตามว่าหัวข้อไหนแน่น/อ่อน — เก็บใน localStorage ไม่ส่งไหน
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent-2)' }}>{totalPct}%</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>เรียนแล้วรวม</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{totalDone}/{totalAll}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fbbf24' }}>{streakCount}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>วัน streak สะสม</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{noteCount}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>บทที่จดโน้ต</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{sections.filter(s => s.pct === 100).length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>หมวดเรียนจบ</div>
        </div>
      </div>

      <h3>📊 Mastery แต่ละหมวด</h3>
      {sections.map(s => (
        <div key={s.id} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-0)', fontWeight: 500 }}>{s.title}</span>
            <span style={{ color: s.pct === 100 ? '#10b981' : 'var(--text-2)', fontFamily: 'monospace' }}>{s.done}/{s.total} · {s.pct}%</span>
          </div>
          <div style={{ background: 'var(--bg-1)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ background: s.pct === 100 ? '#10b981' : s.pct >= 50 ? 'var(--accent-2)' : '#fbbf24', height: '100%', width: s.pct + '%', transition: 'width .5s' }}></div>
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>💡 แนะนำขั้นต่อไป</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10 }}>
        {(() => {
          const weakest = sections.filter(s => s.pct < 100).sort((a, b) => a.pct - b.pct)[0];
          if (!weakest) return <div style={{ color: '#10b981' }}>🎉 เรียนครบทุกหมวดแล้ว! ไปฝึก Mock Exam ต่อได้เลย</div>;
          const nextLesson = weakest.lessons.find(l => !progress[l.id]);
          return (
            <React.Fragment>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>หมวดที่ยังต้องเรียน:</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{weakest.title} — {weakest.pct}%</div>
              {nextLesson && (
                <a href={'#/' + nextLesson.id} style={{ display: 'inline-block', background: 'var(--accent)', color: '#000', padding: '8px 14px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
                  → {nextLesson.num} · {nextLesson.title}
                </a>
              )}
            </React.Fragment>
          );
        })()}
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   CODE SANDBOX (Claude-powered)
============================================================ */
Lessons9["sandbox"] = function () {
  const AI_OK = typeof window.claude?.complete === 'function';
  if (!AI_OK) {
    return (
      <div className="callout warn">
        <div className="ttl">💻 Code Sandbox · ต้องใช้ AI</div>
        บทนี้ใช้ AI ของ Claude ในการรัน/วิเคราะห์ C++ ซึ่งใช้ได้บน <b>claude.ai</b> เท่านั้น<br/>
        ถ้าต้องการเขียนและรันโค้ดจริงๆ ลอง <a href="#/playground" style={{ color: 'var(--accent)' }}>Code Playground (JS)</a> ในเมนูหลัก —
        เขียน JavaScript รันใน browser ได้ฟรีไม่ต้องใช้ AI
      </div>
    );
  }
  const [code, setCode] = useS9(`// เขียน C++ algorithm ที่นี่
#include <iostream>
#include <vector>
using namespace std;

int main() {
  vector<int> a = {5, 2, 8, 1, 9, 3};
  // bubble sort
  for (int i = 0; i < a.size(); i++)
    for (int j = 0; j < a.size()-1-i; j++)
      if (a[j] > a[j+1]) swap(a[j], a[j+1]);

  for (int x : a) cout << x << " ";
  return 0;
}`);
  const [output, setOutput] = useS9('');
  const [loading, setLoading] = useS9(false);
  const [mode, setMode] = useS9('run');

  const ask = async () => {
    setLoading(true);
    setOutput('');
    try {
      let prompt = '';
      if (mode === 'run') {
        prompt = `ทำตัวเหมือน C++ compiler/interpreter — รัน code นี้แล้วบอกผลลัพธ์ที่ออกทาง stdout เท่านั้น (ไม่ต้องอธิบาย ไม่ต้องใส่ความเห็น ไม่ต้องใส่ markdown):\n\n${code}`;
      } else if (mode === 'analyze') {
        prompt = `วิเคราะห์ time complexity ของ C++ code นี้ ทีละบรรทัด — บอกว่าแต่ละ loop เป็น O(?) แล้วสรุปรวม Big-O เป็นภาษาไทย กระชับ:\n\n${code}`;
      } else if (mode === 'review') {
        prompt = `รีวิว code C++ นี้ — หาบั๊ก, edge case, แนะนำการเขียนที่ดีกว่า, สังเกต pattern (D&C/DP/Greedy/etc) ตอบเป็นภาษาไทย กระชับ:\n\n${code}`;
      } else if (mode === 'trace') {
        prompt = `Trace การทำงานของ C++ code นี้ทีละ step — แสดงค่าตัวแปร สำคัญในแต่ละรอบ loop ตอบเป็นภาษาไทย:\n\n${code}`;
      }
      const r = await window.claude.complete(prompt);
      setOutput(r);
    } catch (e) {
      setOutput('Error: ' + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">💻 Code Sandbox — รัน/วิเคราะห์/รีวิว C++</div>
        เขียนโค้ดได้เลย — มี Claude คอยช่วยรัน trace, วิเคราะห์ Big-O, รีวิวบั๊ก
      </div>

      <textarea value={code} onChange={e => setCode(e.target.value)}
        style={{ width: '100%', height: 280, fontFamily: 'monospace', fontSize: 13, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, resize: 'vertical' }} />

      <div style={{ display: 'flex', gap: 6, margin: '10px 0', flexWrap: 'wrap' }}>
        {[
          { id: 'run', label: '▶ Run', desc: 'รันและดู output' },
          { id: 'analyze', label: '📐 Big-O', desc: 'วิเคราะห์ complexity' },
          { id: 'trace', label: '🔬 Trace', desc: 'เดิน step-by-step' },
          { id: 'review', label: '🔍 Review', desc: 'หาบั๊ก + แนะนำ' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            style={{ background: mode === m.id ? 'var(--accent)' : 'var(--bg-2)', color: mode === m.id ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: mode === m.id ? 600 : 400 }}
            title={m.desc}>{m.label}</button>
        ))}
        <button onClick={ask} disabled={loading} style={{ background: 'var(--accent-2)', color: '#000', border: 'none', padding: '8px 20px', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: loading ? 0.5 : 1 }}>
          {loading ? '⏳ กำลังคิด...' : '⚡ ทำเลย'}
        </button>
      </div>

      {output && (
        <div style={{ background: 'var(--bg-1)', borderLeft: '3px solid var(--accent-2)', padding: 14, borderRadius: 6, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {output}
        </div>
      )}

      <div className="callout" style={{ marginTop: 14 }}>
        <b>💡 Tip:</b> โหมด <b>Big-O</b> ดี ใช้เช็คคำตอบของตัวเองตอนทำการบ้าน — โหมด <b>Trace</b> ช่วยตอน debug
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   PRINT CHEAT SHEETS
============================================================ */
Lessons9["print-cheatsheet"] = function () {
  const print = () => window.print();
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🖨️ Print Cheat Sheets</div>
        รวม cheat sheet ของทุกบทหลักเป็น 1 หน้าเดียว — ใช้ทบทวนนาทีสุดท้ายก่อนสอบ<br />
        กดปุ่ม print แล้ว save as PDF
      </div>
      <button onClick={print} style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
        🖨️ Print / Save as PDF
      </button>

      <div className="print-area" style={{ background: 'var(--bg-1)', padding: 18, borderRadius: 10 }}>
        <h2 style={{ marginTop: 0 }}>📋 Algorithm Cheat Sheet</h2>

        <h3>Big-O ที่ต้องจำ</h3>
        <table className="tbl">
          <tbody>
            <tr><td>เร็วสุด</td><td>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ) &lt; O(n!)</td></tr>
            <tr><td>Sort ทุกตัว</td><td>Bubble/Selection/Insertion O(n²) · Merge/Quick/Heap O(n log n)</td></tr>
            <tr><td>Search</td><td>Linear O(n) · Binary O(log n) · Interpolation O(log log n) avg</td></tr>
            <tr><td>BST balance</td><td>Insert/Search/Delete O(log n) · Skewed O(n)</td></tr>
            <tr><td>Hash Table</td><td>Avg O(1) · Worst O(n)</td></tr>
            <tr><td>Graph BFS/DFS</td><td>O(V + E)</td></tr>
            <tr><td>Dijkstra (heap)</td><td>O((V+E) log V)</td></tr>
            <tr><td>Floyd-Warshall</td><td>O(V³)</td></tr>
            <tr><td>MST Prim/Kruskal</td><td>O(E log V) / O(E log E)</td></tr>
          </tbody>
        </table>

        <h3>Master Theorem — T(n) = a·T(n/b) + O(n^d)</h3>
        <table className="tbl">
          <tbody>
            <tr><td>d &lt; log_b a</td><td>O(n^log_b a)</td></tr>
            <tr><td>d = log_b a</td><td>O(n^d log n)</td></tr>
            <tr><td>d &gt; log_b a</td><td>O(n^d)</td></tr>
          </tbody>
        </table>

        <h3>Recurrence Quick Ref</h3>
        <table className="tbl">
          <tbody>
            <tr><td>2T(n/2) + n</td><td>O(n log n) — Merge Sort</td></tr>
            <tr><td>2T(n/2) + 1</td><td>O(n) — findMax DAC</td></tr>
            <tr><td>T(n/2) + 1</td><td>O(log n) — Binary Search</td></tr>
            <tr><td>3T(n/2) + n</td><td>O(n^1.585) — Karatsuba</td></tr>
            <tr><td>7T(n/2) + n²</td><td>O(n^2.807) — Strassen</td></tr>
            <tr><td>T(n-1) + n</td><td>O(n²)</td></tr>
            <tr><td>2T(n-1) + 1</td><td>O(2ⁿ) — Hanoi</td></tr>
            <tr><td>T(n-1) + T(n-2)</td><td>O(2ⁿ) — Fibonacci</td></tr>
          </tbody>
        </table>

        <h3>Sort Compare</h3>
        <table className="tbl">
          <thead><tr><th></th><th>Best</th><th>Avg</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
          <tbody>
            <tr><td>Bubble</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✓</td></tr>
            <tr><td>Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✗</td></tr>
            <tr><td>Insertion</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✓</td></tr>
            <tr><td>Merge</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>✓</td></tr>
            <tr><td>Quick</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td>✗</td></tr>
            <tr><td>Heap</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>✗</td></tr>
          </tbody>
        </table>

        <h3>Paradigm Decision</h3>
        <table className="tbl">
          <tbody>
            <tr><td>Optimal substructure + overlapping</td><td>DP</td></tr>
            <tr><td>Greedy choice property</td><td>Greedy</td></tr>
            <tr><td>Sub-problems independent + balanced</td><td>Divide & Conquer</td></tr>
            <tr><td>ลองทุกแบบ + ตัดกิ่ง</td><td>Backtracking</td></tr>
            <tr><td>ลองทุกแบบไม่ตัด</td><td>Exhaustive</td></tr>
          </tbody>
        </table>

        <h3>Summations</h3>
        <ul>
          <li>1 + 2 + ... + n = n(n+1)/2 = O(n²)</li>
          <li>1 + 2 + 4 + ... + 2ⁿ = 2^(n+1) - 1 = O(2ⁿ)</li>
          <li>1 + 1/2 + 1/4 + ... ≤ 2 = O(1)</li>
          <li>log 1 + log 2 + ... + log n = O(n log n)</li>
          <li>1² + 2² + ... + n² = n(n+1)(2n+1)/6 = O(n³)</li>
        </ul>

        <h3>Common Gotchas</h3>
        <ul>
          <li>Bubble best = O(n) <b>เฉพาะ</b> ใช้ flag</li>
          <li>mid = lo + (hi-lo)/2 (กัน overflow ใน C/Java)</li>
          <li>Mark visited <b>ตอน push</b> ใน BFS ไม่ใช่ pop</li>
          <li>Greedy ใช้ 0/1 Knapsack ไม่ได้ — ต้อง DP</li>
          <li>Dijkstra ใช้ weight ติดลบไม่ได้ — ต้อง Bellman-Ford</li>
          <li>Topological sort ใช้กับ DAG เท่านั้น</li>
        </ul>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; padding: 0; }
          .print-area .tbl { font-size: 11px; }
          .sidebar, .topbar, .lesson-head, .lesson-meta, .lesson-nav, button { display: none !important; }
        }
      `}</style>
    </React.Fragment>
  );
};

window.LessonsPart9 = Lessons9;
window.NotesPanel = NotesPanel;
window.GlobalSearch = GlobalSearch;
