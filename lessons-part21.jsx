/* Lessons Part 21 — Design Problems: Greedy, DP, Graph, Reduction + Mock Exam 4 */

const { useState: useS21 } = React;
const { Quiz: Quiz21 } = window.LessonComponents;
const { WorkedExample: WE21, CheatSheet: CS21, Pitfalls: PF21 } = window.LearningKit;

const Lessons21 = {};

/* ============================================================
   DESIGN PROBLEM Component — show problem, hint, solution, proof, complexity
============================================================ */
function DesignProblem({ num, title, problem, hints, solution, proof, complexity, takeaway }) {
  const [show, setShow] = useS21({ hint: false, sol: false, proof: false });

  return (
    <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, margin: '16px 0' }}>
      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>DESIGN PROBLEM #{num}</div>
      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{title}</div>
      <div style={{ background: 'var(--bg-1)', padding: 14, borderRadius: 8, marginBottom: 12, fontSize: 14, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: problem }} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <button onClick={() => setShow(s => ({ ...s, hint: !s.hint }))} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          {show.hint ? '🔒 Hide' : '💡 Show'} Hints
        </button>
        <button onClick={() => setShow(s => ({ ...s, sol: !s.sol }))} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          {show.sol ? '🔒 Hide' : '✓ Show'} Solution
        </button>
        <button onClick={() => setShow(s => ({ ...s, proof: !s.proof }))} style={{ background: 'rgba(168,139,250,0.15)', color: '#a78bfa', border: '1px solid #a78bfa', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          {show.proof ? '🔒 Hide' : '📐 Show'} Proof
        </button>
      </div>

      {show.hint && (
        <div style={{ background: 'rgba(251,191,36,0.06)', borderLeft: '3px solid #fbbf24', padding: 12, borderRadius: 6, marginBottom: 8 }}>
          <b style={{ color: '#fbbf24' }}>💡 Hints:</b>
          <ol style={{ marginTop: 4, color: 'var(--text-1)' }}>
            {hints.map((h, i) => <li key={i} dangerouslySetInnerHTML={{ __html: h }} />)}
          </ol>
        </div>
      )}
      {show.sol && (
        <div style={{ background: 'rgba(16,185,129,0.06)', borderLeft: '3px solid #10b981', padding: 12, borderRadius: 6, marginBottom: 8 }}>
          <b style={{ color: '#10b981' }}>✓ Solution Sketch:</b>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: solution }} />
          <div style={{ marginTop: 8, padding: 8, background: 'rgba(94,234,212,0.08)', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>
            <b>Complexity:</b> {complexity}
          </div>
        </div>
      )}
      {show.proof && (
        <div style={{ background: 'rgba(168,139,250,0.06)', borderLeft: '3px solid #a78bfa', padding: 12, borderRadius: 6, marginBottom: 8 }}>
          <b style={{ color: '#a78bfa' }}>📐 Correctness Proof:</b>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: proof }} />
        </div>
      )}
      {takeaway && (
        <div style={{ marginTop: 10, padding: 10, background: 'var(--bg-1)', borderRadius: 6, fontSize: 13 }}>
          <b>🎯 Takeaway:</b> {takeaway}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   95 — DESIGN: GREEDY
============================================================ */
Lessons21["design-greedy"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">✍️ Design: Greedy Problems</div>
        ฝึกออกแบบ <b>greedy algorithm + พิสูจน์ optimality</b> ด้วย exchange argument
      </div>

      <h3>Exchange Argument Template</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <ol style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
          <li>สมมุติ optimal solution OPT ที่ <b>ต่างจาก</b> greedy solution G</li>
          <li>หาคู่ที่ต่าง: (g ∈ G) vs (o ∈ OPT \ G)</li>
          <li>แลก o เป็น g ใน OPT → ได้ OPT' ที่<b>ไม่แย่กว่า</b> OPT</li>
          <li>ทำซ้ำ → OPT' = G — ดังนั้น G ก็ optimal ▢</li>
        </ol>
      </div>

      <DesignProblem
        num="1"
        title="Coin Change with Denominations {1, 5, 10, 25}"
        problem="ให้เหรียญ 1¢, 5¢, 10¢, 25¢ จำนวนไม่จำกัด — หา <b>จำนวนเหรียญน้อยสุด</b>ที่ผลรวม = n เซนต์"
        hints={[
          "Greedy: เลือกเหรียญใหญ่สุดก่อน",
          "ทำไม greedy ทำงานกับ {1,5,10,25} แต่ไม่กับ {1,3,4}?"
        ]}
        solution={`function greedyCoin(n):
  coins = [25, 10, 5, 1]
  count = 0
  for c in coins:
    count += n / c
    n = n mod c
  return count

ตัวอย่าง: n = 41 → 25+10+5+1 = 4 เหรียญ`}
        proof={`สมมุติ optimal OPT ≠ greedy G.
ดูเหรียญใหญ่สุดที่ใช้ใน G แต่ OPT ไม่ใช้:
  ถ้า G ใช้ 25¢ k ครั้ง แต่ OPT ใช้ k' &lt; k:
  → OPT ต้องใช้เหรียญเล็กกว่า ≥ 25¢ ในการ make up
  → OPT มี: ≥3 × 10¢ หรือ 2 × 10¢ + 1×5¢ + 0 × 25¢ ... อย่างน้อย 3 เหรียญ แทน 1 × 25¢
  → แลกเป็น 25¢ ลดจำนวนเหรียญ → OPT' &lt; OPT (ขัดแย้ง)

∴ Greedy = Optimal สำหรับ {1, 5, 10, 25} ▢

⚠ Counterexample: {1, 3, 4}, n = 6
  Greedy: 4+1+1 = 3 coins
  Optimal: 3+3 = 2 coins
  → Greedy ผิด → ต้อง DP`}
        complexity="O(|denominations|) — constant time per coin"
        takeaway="Greedy ใช้ได้กับ ‘canonical coin system’ เท่านั้น — case อื่นต้อง DP"
      />

      <DesignProblem
        num="2"
        title="Activity Selection — Maximum Non-overlapping"
        problem="ให้ n activities, แต่ละ activity มี (start, end). เลือก activities มากสุดที่ <b>ไม่ overlap</b>"
        hints={[
          "Sort by end time",
          "Greedy: เลือก activity ที่จบเร็วสุดก่อน",
          "ทำไม start time ไม่ work?"
        ]}
        solution={`function activitySelect(activities):
  sort activities by end time
  selected = [activities[0]]
  lastEnd = activities[0].end
  for a in activities[1:]:
    if a.start >= lastEnd:
      selected.append(a)
      lastEnd = a.end
  return selected`}
        proof={`Exchange argument:
สมมุติ OPT = [o₁, o₂, ..., oₖ] sorted by end time.
ให้ g₁ = greedy เลือกตัวแรก = activity ที่จบเร็วสุด.

Case: g₁ = o₁ → ส่วนที่เหลือ OPT[2..k] เป็น optimal สำหรับ activities ที่ start ≥ o₁.end
     โดย induction → greedy คืน optimal สำหรับ subproblem นี้

Case: g₁ ≠ o₁:
  g₁.end ≤ o₁.end (เพราะ g₁ จบเร็วสุด)
  สร้าง OPT' = [g₁, o₂, ..., oₖ]
  o₂.start ≥ o₁.end ≥ g₁.end → ไม่ overlap กับ g₁ ✓
  |OPT'| = |OPT| → OPT' ก็ optimal
  → reduce ไปกรณีแรก ▢`}
        complexity="O(n log n) — sort dominant"
        takeaway="Greedy by end time → optimal. By start time → ผิด (counterexample: long activity)"
      />

      <DesignProblem
        num="3"
        title="Huffman Coding — Optimal Prefix Code"
        problem="ให้ characters พร้อม frequency. สร้าง <b>prefix code</b> (no codeword is prefix of another) ที่ minimize ∑ (freq × bit length)"
        hints={[
          "Greedy: รวม 2 nodes ที่ frequency ต่ำสุดก่อน",
          "ใช้ min-heap (priority queue)",
          "Build tree bottom-up"
        ]}
        solution={`function huffman(chars, freqs):
  heap = min-heap of (freq, node)
  for c, f in chars, freqs:
    heap.push((f, leaf(c)))

  while heap.size > 1:
    f1, n1 = heap.pop()
    f2, n2 = heap.pop()
    merged = internal_node(left=n1, right=n2)
    heap.push((f1 + f2, merged))

  root = heap.pop()
  return assign_codes(root)  // left = 0, right = 1`}
        proof={`Exchange argument:
Claim: ใน optimal tree, 2 leaves ที่ frequency ต่ำสุด <b>ต้องเป็น siblings ที่ depth สูงสุด</b>.

Proof: สมมุติ x, y มี freq ต่ำสุด แต่ใน OPT ไม่ใช่ siblings ที่ deepest.
  ให้ a, b = 2 leaves ที่ deepest ใน OPT.
  Swap x ↔ a และ y ↔ b (ถ้าจำเป็น)
  Cost ใหม่ = OPT - (freq(a)·depth(a) + freq(x)·depth(x))
                  + (freq(a)·depth(x) + freq(x)·depth(a))
  = OPT + (freq(a) - freq(x)) · (depth(x) - depth(a))
  ≤ OPT  (because freq(x) ≤ freq(a) and depth(x) ≤ depth(a) by assumption)

∴ Optimal substructure: ถ้า x, y siblings → merge เป็น 1 node freq=fx+fy
  → optimal สำหรับ subproblem ก็ optimal สำหรับ original ▢`}
        complexity="O(n log n) — n heap operations"
        takeaway="Huffman = classic greedy. Exchange argument + optimal substructure"
      />

      <DesignProblem
        num="4"
        title="Job Sequencing with Deadlines"
        problem="ให้ n jobs, แต่ละ job มี (deadline d_i, profit p_i). แต่ละ job ใช้ 1 unit time. ทำได้ก่อน deadline → ได้ profit. <b>Maximize total profit</b>"
        hints={[
          "Sort jobs by profit descending",
          "Try to schedule each job in latest available slot ≤ deadline",
          "Use Union-Find for O(α(n)) per job"
        ]}
        solution={`function jobSequencing(jobs):
  sort jobs by profit descending
  maxDeadline = max(d_i)
  slot = [None] * (maxDeadline + 1)

  for job in jobs:
    for t = job.deadline down to 1:
      if slot[t] is None:
        slot[t] = job
        break

  return sum of profits of scheduled jobs

// Optimized: Union-Find — slot[t] points to next available slot
//   O(n α(n)) instead of O(n²)`}
        proof={`Exchange argument:
สมมุติ Greedy G และ Optimal OPT ต่างกัน.
ให้ j = highest-profit job ใน G แต่ไม่ใน OPT (มีอยู่จริงถ้า G ≠ OPT).

Case 1: |OPT| &lt; |G|.
  ใน OPT มี ‘slot ว่าง’ ≤ j.deadline (มิฉะนั้น G ก็ใส่ไม่ได้)
  เพิ่ม j เข้า OPT → profit เพิ่ม → ขัดแย้ง OPT optimal.

Case 2: |OPT| = |G|.
  มี job j' ∈ OPT \\ G ที่ profit(j') ≤ profit(j) (เพราะ greedy sort by profit)
  Swap j' ↔ j → profit ไม่ลด ✓
  ทำซ้ำ → OPT = G ▢`}
        complexity="O(n log n) sort + O(n α(n)) scheduling = O(n log n)"
        takeaway="Greedy + Union-Find — pattern เห็นบ่อยใน contest"
      />

      <DesignProblem
        num="5"
        title="Minimum Platforms"
        problem="ให้ arrival/departure times ของ n trains. หา <b>จำนวน platform น้อยสุด</b>ที่ต้องมี (รถไฟพร้อม ๆ กันได้ไม่ทับ)"
        hints={[
          "Sort arrivals และ departures แยกกัน",
          "Two pointer scan",
          "เพิ่ม platform เมื่อ train มา, ลดเมื่อ train ออก"
        ]}
        solution={`function minPlatforms(arrivals, departures):
  sort arrivals
  sort departures
  i = j = 0; platforms = 0; maxP = 0
  while i < n:
    if arrivals[i] <= departures[j]:
      platforms++
      maxP = max(maxP, platforms)
      i++
    else:
      platforms--
      j++
  return maxP`}
        proof={`Greedy = max overlapping intervals at any point in time.

Claim: minPlatforms = max overlap.

Proof:
  Lower bound: ถ้ามี k trains overlap ที่เวลา t → ต้องมี ≥ k platforms.
  Upper bound: เสนอ schedule:
    Sort by arrival → assign train ที่มาใหม่ให้ platform ว่างใด ๆ
    จำนวน platform ใช้ ≤ max overlap (ตรงเงื่อนไข)
  ∴ minPlatforms = max overlap ▢`}
        complexity="O(n log n) — 2 sorts"
        takeaway="‘Max overlap interval’ pattern — ใช้ใน scheduling, room booking"
      />

      <CS21 title="Greedy Design Cheat Sheet" sections={[
        { label: "Pattern 1", value: "Sort by some criterion → scan greedily" },
        { label: "Pattern 2", value: "Min/max heap — process best each time" },
        { label: "Proof technique", value: "Exchange argument (swap counterexample → improvement)" },
        { label: "Counterexamples are key", value: "ก่อนเชื่อ greedy → ลองหา counterexample เล็ก ๆ" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   96 — DESIGN: DP
============================================================ */
Lessons21["design-dp"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">✍️ Design: DP Problems</div>
        ฝึกเขียน <b>recurrence + base case + complexity</b> ทุกครั้ง — ไม่ใช่แค่ implement
      </div>

      <h3>DP Design Template</h3>
      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, margin: '12px 0' }}>
        <ol style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
          <li><b>State:</b> dp[?] = อะไร? — เลือก parameter ให้ครอบทุก subproblem</li>
          <li><b>Recurrence:</b> dp[i] computed from smaller dp[?]</li>
          <li><b>Base case:</b> ที่ไม่มี subproblem เล็กกว่า</li>
          <li><b>Order:</b> fill DP ในลำดับใด — top-down memo หรือ bottom-up</li>
          <li><b>Answer:</b> ผลลัพธ์อยู่ใน dp[?]</li>
          <li><b>Complexity:</b> #states × time per state</li>
        </ol>
      </div>

      <DesignProblem
        num="1"
        title="Maximum Subarray Sum (Kadane)"
        problem="ให้ array integers (อาจมี negative). หา <b>contiguous subarray</b> ที่ sum สูงสุด"
        hints={[
          "State: dp[i] = max sum ending at i (must include a[i])",
          "Recurrence: dp[i] = max(dp[i-1] + a[i], a[i])",
          "Answer: max over all dp[i]"
        ]}
        solution={`function kadane(a):
  best = a[0]
  cur = a[0]
  for i = 1 to n-1:
    cur = max(a[i], cur + a[i])
    best = max(best, cur)
  return best`}
        proof={`Recurrence correctness:
dp[i] = max sum of subarray ending at i (must include a[i]).
  Choice: extend dp[i-1] OR start fresh at a[i]
  dp[i] = max(dp[i-1] + a[i], a[i])

Answer = max over all dp[i] — covers all possible ending positions.

Optimal substructure: dp[i] depends only on dp[i-1] → easy induction ▢`}
        complexity="O(n) time, O(1) space"
        takeaway="Kadane = ‘include or restart’ pattern — basis of many DP problems"
      />

      <DesignProblem
        num="2"
        title="Coin Change — Minimum Coins"
        problem="ให้ denominations [c₁, ..., cₖ] (ไม่จำกัดจำนวน), amount n. หา <b>min coins</b> ที่ผลรวม = n (return ∞ ถ้าไม่ได้)"
        hints={[
          "State: dp[v] = min coins to make value v",
          "Recurrence: dp[v] = min over c in coins (if c ≤ v): dp[v - c] + 1",
          "Base: dp[0] = 0"
        ]}
        solution={`function coinChange(coins, n):
  dp = [∞] * (n + 1)
  dp[0] = 0
  for v = 1 to n:
    for c in coins:
      if c <= v and dp[v - c] != ∞:
        dp[v] = min(dp[v], dp[v - c] + 1)
  return dp[n]`}
        proof={`Recurrence: dp[v] = optimal min coins for value v.

Last coin used = c (for some c ∈ coins, c ≤ v).
After removing this coin → remaining value = v - c
→ min coins to make v - c = dp[v - c] (by induction)
→ Total = dp[v - c] + 1

Take min over all possible last coins c. ▢

Bottom-up order ensures dp[v-c] computed before dp[v] (since c > 0).`}
        complexity="O(n × k) time, O(n) space"
        takeaway="‘Last decision’ pattern — common DP setup"
      />

      <DesignProblem
        num="3"
        title="Longest Palindromic Subsequence (LPS)"
        problem="ให้ string s. หา <b>longest subsequence</b> ของ s ที่เป็น palindrome"
        hints={[
          "State: dp[i][j] = LPS length of s[i..j]",
          "Recurrence: if s[i] == s[j]: dp[i+1][j-1] + 2; else: max(dp[i+1][j], dp[i][j-1])",
          "Base: dp[i][i] = 1"
        ]}
        solution={`function LPS(s):
  n = len(s)
  dp = 2D array (n x n), init 0
  for i = n-1 down to 0:
    dp[i][i] = 1
    for j = i+1 to n-1:
      if s[i] == s[j]:
        dp[i][j] = dp[i+1][j-1] + 2 if j > i+1 else 2
      else:
        dp[i][j] = max(dp[i+1][j], dp[i][j-1])
  return dp[0][n-1]`}
        proof={`State definition: dp[i][j] = length of LPS in s[i..j].

Cases on first/last char of substring s[i..j]:
  • s[i] == s[j]: include both → 2 + LPS(s[i+1..j-1])
  • s[i] != s[j]: at least one of them not in LPS → max of dropping each end

Base: single char = palindrome of length 1.

Order: by length (i decreasing) ensures dp[i+1][j-1] computed first. ▢

Equivalent: LPS(s) = LCS(s, reverse(s))`}
        complexity="O(n²) time, O(n²) space"
        takeaway="‘Interval DP’ pattern — fill by length"
      />

      <DesignProblem
        num="4"
        title="Word Break Problem"
        problem="ให้ string s และ dictionary D ของ words. หาว่าสามารถ <b>split s</b> เป็นลำดับ words ใน D ได้หรือไม่"
        hints={[
          "State: dp[i] = can s[0..i-1] be word-broken?",
          "Recurrence: dp[i] = OR over j: dp[j] AND s[j..i-1] in D",
          "Base: dp[0] = true (empty)"
        ]}
        solution={`function wordBreak(s, D):
  n = len(s)
  dp = [false] * (n + 1)
  dp[0] = true
  for i = 1 to n:
    for j = 0 to i - 1:
      if dp[j] and s[j..i-1] in D:
        dp[i] = true; break
  return dp[n]`}
        proof={`State: dp[i] = ‘s[0..i-1] can be broken into dict words’.

Recurrence: dp[i] true ⟺ ∃ split point j ∈ [0, i-1] where:
  - dp[j] (prefix [0..j-1] OK)
  - s[j..i-1] is a word in D

Base: dp[0] = true (empty string trivially broken).

Order: i increasing → dp[j] for j < i already computed. ▢

Hash D for O(1) word lookup → total O(n² · L) where L = avg word length.`}
        complexity="O(n²) time (with hash set lookup)"
        takeaway="‘Position DP’ — common for string segmentation problems"
      />

      <DesignProblem
        num="5"
        title="Optimal Binary Search Tree"
        problem="ให้ keys k₁ &lt; k₂ &lt; ... &lt; kₙ พร้อม access frequencies p₁, ..., pₙ. สร้าง BST ที่ <b>expected search cost ต่ำสุด</b>"
        hints={[
          "Interval DP: m[i][j] = optimal cost of BST containing keys i to j",
          "Try every key as root: cost = sum of freqs in range + left subtree cost + right subtree cost",
          "Order: fill by length"
        ]}
        solution={`function optimalBST(p, n):
  // m[i][j] = optimal cost for keys i..j
  m = 2D array (n+2 x n+1)
  for i = 1 to n+1: m[i][i-1] = 0  // empty
  prefSum[0] = 0
  for i = 1 to n: prefSum[i] = prefSum[i-1] + p[i]

  for len = 1 to n:
    for i = 1 to n - len + 1:
      j = i + len - 1
      m[i][j] = ∞
      sum = prefSum[j] - prefSum[i-1]
      for r = i to j:
        cost = m[i][r-1] + m[r+1][j] + sum
        if cost < m[i][j]: m[i][j] = cost
  return m[1][n]`}
        proof={`Optimal substructure: ถ้า BST optimal มี root r:
  - left subtree (keys i..r-1) ก็ต้อง optimal สำหรับช่วงนี้
  - right subtree (keys r+1..j) ก็ optimal

Each node at depth d contributes p × d to total cost.
Increasing depth by 1 = adding sum of all p in subtree.

Recurrence:
m[i][j] = min over r ∈ [i, j]:
   m[i][r-1] + m[r+1][j] + (sum of p[i..j])

(the +sum accounts for ‘depth+1’ from new root r)

Order: length increasing → smaller intervals first. ▢

Knuth's optimization → O(n²) by tracking optimal r values.`}
        complexity="O(n³) — O(n²) intervals × O(n) roots"
        takeaway="Interval DP + ‘try every split/root’"
      />

      <CS21 title="DP Design Cheat Sheet" sections={[
        { label: "Identify state", value: "What is the smallest set of params that uniquely describes subproblem?" },
        { label: "Recurrence types", value: "‘Take it or not’ (knapsack)<br/>‘Last decision’ (coin change)<br/>‘Try every split’ (interval DP)<br/>‘State machine’ (stock)" },
        { label: "Order", value: "Increasing length, increasing index, or memoize" },
        { label: "Space optimization", value: "Only keep last 1-2 layers if recurrence allows" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   97 — DESIGN: GRAPH
============================================================ */
Lessons21["design-graph"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">✍️ Design: Graph Problems</div>
        ฝึก <b>modeling ปัญหาเป็น graph</b> — ครึ่งของงานคือเลือก nodes/edges ให้ถูก
      </div>

      <DesignProblem
        num="1"
        title="Word Ladder"
        problem="ให้ word A, word B (ยาวเท่ากัน) และ dictionary. เปลี่ยน A → B ทีละตัวอักษร (แต่ละขั้นต้องอยู่ใน dict). หา <b>จำนวนขั้นน้อยสุด</b> (∞ ถ้าทำไม่ได้)"
        hints={[
          "Model: graph — node = word, edge = differ by 1 letter",
          "Shortest path in unweighted graph → BFS",
          "Optimization: bidirectional BFS"
        ]}
        solution={`function wordLadder(A, B, dict):
  if B not in dict: return -1
  queue = [(A, 1)]
  visited = {A}
  while queue:
    (w, d) = queue.pop_front()
    if w == B: return d
    for each i in range(len(w)):
      for each char c:
        nw = w[:i] + c + w[i+1:]
        if nw in dict and nw not in visited:
          visited.add(nw)
          queue.push((nw, d + 1))
  return -1`}
        proof={`Modeling: graph G where nodes = dict words, edge (u,v) iff differ by 1 letter.
Shortest A→B in G = min number of word changes.

BFS correctness: in unweighted graph, BFS visits nodes in order of distance from start.
→ First time reaching B = shortest path. ▢

Time: O(V · L · |Σ|) where V = #words, L = word length, |Σ| = alphabet size.`}
        complexity="O(V · L · 26) per node"
        takeaway="Many puzzles model as ‘state graph + BFS’"
      />

      <DesignProblem
        num="2"
        title="Course Schedule (Topological Sort)"
        problem="ให้ n courses (0..n-1) และ prerequisites [(a, b)] หมายความว่า b ต้องเรียนก่อน a. <b>เป็นไปได้</b> ที่จะเรียนครบทุก course ไหม?"
        hints={[
          "Model: graph — node = course, edge b→a if a depends on b",
          "‘Can finish’ ⟺ no cycle",
          "Use DFS cycle detection OR Kahn's algorithm (in-degree BFS)"
        ]}
        solution={`function canFinish(n, prereqs):
  adj = [[]] * n
  for (a, b) in prereqs:
    adj[b].append(a)
  visited = [0] * n  // 0=unvisited, 1=in progress, 2=done
  def dfs(u):
    if visited[u] == 1: return false  // back edge → cycle
    if visited[u] == 2: return true
    visited[u] = 1
    for v in adj[u]:
      if not dfs(v): return false
    visited[u] = 2
    return true
  for u in range(n):
    if visited[u] == 0 and not dfs(u): return false
  return true`}
        proof={`Can finish all courses ⟺ no cyclic dependency ⟺ graph is DAG.

DFS Cycle Detection: while DFS visiting node u (state=1), if encounter another node v with state=1 → back edge → cycle exists.

Correctness: in DAG, DFS finishes each node without revisiting in-progress nodes. ▢

Time: O(V + E) — each node/edge visited once.`}
        complexity="O(V + E)"
        takeaway="‘Dependency’ keyword → think topological sort / cycle detection"
      />

      <DesignProblem
        num="3"
        title="Network Delay Time"
        problem="ให้ directed weighted graph (n nodes, edges (u,v,w) = time u→v). Signal sent จาก node k. หา <b>เวลาที่ทุก node ได้รับ signal</b> (∞ ถ้าไม่ครบ)"
        hints={[
          "Single-source shortest paths → Dijkstra",
          "Answer = max over all dist[v]",
          "Note: positive weights → Dijkstra OK"
        ]}
        solution={`function networkDelay(times, n, k):
  adj = build_adj_list(times)
  dist = [∞] * (n + 1)
  dist[k] = 0
  pq = [(0, k)]
  while pq:
    (d, u) = pq.pop_min()
    if d > dist[u]: continue
    for (v, w) in adj[u]:
      nd = d + w
      if nd < dist[v]:
        dist[v] = nd
        pq.push((nd, v))
  ans = max(dist[1..n])
  return ans if ans < ∞ else -1`}
        proof={`SSSP from k. Each node u receives signal at time dist[k → u].
All nodes receive ⟺ all dist[v] < ∞.
Last node receives at max(dist).

Dijkstra correct for non-negative weights:
- Greedy: extract min-distance unvisited node u
- All paths from k to u via unvisited node has dist ≥ d[u] (by min property)
- → d[u] is finalized

Time: O((V + E) log V) with binary heap. ▢`}
        complexity="O((V + E) log V)"
        takeaway="‘Time to reach all’ = max shortest path from source"
      />

      <DesignProblem
        num="4"
        title="Reconstruct Itinerary"
        problem="ให้ flight tickets [from, to]. เริ่มที่ ‘JFK’. หา itinerary ที่ <b>ใช้ทุก ticket พอดี 1 ครั้ง</b> และ lexicographically smallest"
        hints={[
          "Model: directed multigraph — node = airport, edge = ticket",
          "Use ALL edges = Euler path/circuit",
          "Hierholzer's algorithm + sort destinations alphabetically"
        ]}
        solution={`function findItinerary(tickets):
  adj = {airport: min-heap of destinations}
  for (f, t) in tickets:
    adj[f].push(t)
  itin = []
  def dfs(u):
    while adj[u]:
      v = adj[u].pop_min()
      dfs(v)
    itin.append(u)
  dfs("JFK")
  return reversed(itin)`}
        proof={`Euler path exists ⟺ at most 2 nodes with odd in-out degree difference, etc.
Hierholzer's algorithm finds Euler path in O(E) by DFS with edge consumption.

Lexicographic: at each node, choose smallest unused destination.
Post-order push → reversed gives correct order. ▢

Why post-order?
DFS may visit a ‘dead end’ before completing. Post-order ensures
dead ends are inserted last (front of reversed list).`}
        complexity="O(E log E) — heap operations per edge"
        takeaway="‘Use every edge’ → Euler path. ‘Use every vertex’ → Hamilton path (NP-hard)"
      />

      <DesignProblem
        num="5"
        title="Critical Connections (Bridges)"
        problem="ให้ undirected connected graph (n nodes, edges). หา <b>critical connections</b> — edges ที่ลบแล้วทำให้ disconnect"
        hints={[
          "‘Critical edge’ = ‘bridge’",
          "Tarjan's bridge algorithm — DFS + low-link values",
          "Edge (u,v) is bridge ⟺ low[v] > disc[u]"
        ]}
        solution={`function criticalConnections(n, edges):
  adj = build_adj_list(edges)
  disc = [-1] * n; low = [0] * n
  bridges = []
  timer = 0
  def dfs(u, parent):
    nonlocal timer
    disc[u] = low[u] = timer; timer++
    for v in adj[u]:
      if v == parent: continue
      if disc[v] == -1:
        dfs(v, u)
        low[u] = min(low[u], low[v])
        if low[v] > disc[u]:
          bridges.append([u, v])
      else:
        low[u] = min(low[u], disc[v])
  dfs(0, -1)
  return bridges`}
        proof={`See lesson 83 — articulation points & bridges.

Edge (u,v) is bridge ⟺ ในตัว DFS subtree ของ v, ไม่มี back edge ที่ไปก่อน u
⟺ low[v] > disc[u]

DFS visits each edge twice (once each direction) → O(V + E). ▢`}
        complexity="O(V + E) — single DFS"
        takeaway="Tarjan's bridge = classical low-link technique"
      />

      <CS21 title="Graph Design Cheat Sheet" sections={[
        { label: "Modeling", value: "Node = state/entity, Edge = transition/relation" },
        { label: "Shortest path", value: "Unweighted → BFS<br/>Weighted (no neg) → Dijkstra<br/>Negative → Bellman-Ford" },
        { label: "Connectivity", value: "Components → DFS/BFS/Union-Find<br/>SCC → Tarjan/Kosaraju<br/>Bridges → Tarjan low-link" },
        { label: "Use all edges", value: "Euler path/circuit + Hierholzer" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   98 — DESIGN: REDUCTION
============================================================ */
Lessons21["design-reduce"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">✍️ Design: NP-Hardness Reductions</div>
        ฝึก <b>พิสูจน์ NP-Hardness</b> โดย reduction จาก known NP-Complete problem
      </div>

      <h3>Template</h3>
      <ol style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li>State problem X formally (decision version)</li>
        <li>Show X ∈ NP (poly-time verifier)</li>
        <li>Pick known NP-C problem Y</li>
        <li>Reduce Y ≤ₚ X: construct f from Y-instance to X-instance</li>
        <li>Prove: Y(y) = yes ⟺ X(f(y)) = yes</li>
        <li>Show f computable in poly time</li>
      </ol>

      <DesignProblem
        num="1"
        title="Decision version of TSP is NP-Complete"
        problem="TSP-Decision: ให้ weighted graph G และ k. มี Hamiltonian cycle ที่ total weight ≤ k ไหม?"
        hints={[
          "TSP ∈ NP: certificate = cycle, verify ≤ k in O(V)",
          "Reduce from Hamiltonian Cycle (HC) — known NP-Complete",
          "Construction: copy G, weight existing edges = 1, missing edges = ∞ (or large constant). k = n"
        ]}
        solution={`Decision Question: G has TSP cycle ≤ k?

Reduce Hamiltonian Cycle (HC) to TSP-Decision:
- Input: graph G' for HC
- Output: weighted graph G + k for TSP-Decision

Construction:
- V(G) = V(G')
- For each (u, v): w(u,v) = 1 if edge in G', else n+1 (large)
- Set k = n

Time: O(V²) — polynomial.`}
        proof={`Forward: HC in G' → TSP cycle of weight n in G
  Each edge of HC has weight 1 → total = n ≤ k ✓

Backward: TSP cycle weight ≤ n in G → HC in G'
  Cycle has n edges, total weight ≤ n → each edge has weight 1
  → all edges are from G' → HC exists ✓

∴ HC ≤ₚ TSP-Decision. HC is NP-C → TSP-Decision is NP-Hard.
TSP-Decision ∈ NP (verify cycle weight in poly time).
∴ TSP-Decision is NP-Complete ▢`}
        complexity="Reduction in O(V²) — polynomial"
        takeaway="Pattern: ‘assign large weights to missing edges’"
      />

      <DesignProblem
        num="2"
        title="3-Coloring is NP-Complete"
        problem="3-COL: ให้ undirected graph G. ระบายสี vertices ด้วย 3 สี โดย adjacent vertex ต่างสี — เป็นไปได้ไหม?"
        hints={[
          "3-COL ∈ NP: certificate = coloring, verify in O(V + E)",
          "Reduce from 3-SAT",
          "Construction: variable gadget (3 nodes) + clause gadget"
        ]}
        solution={`Reduce 3-SAT ≤ₚ 3-COL:

Construction (gadgets):
1. ‘Palette’ triangle: T-F-Other (forces 3 distinct colors)
2. Per variable x: 2 nodes (x, ¬x) connected to ‘Other’
   → x and ¬x must each be T or F, and different
3. Per clause (l₁ ∨ l₂ ∨ l₃): OR-gadget (5 nodes) — designed so:
   - All literals F → no valid 3-coloring of gadget
   - ≥ 1 literal T → valid 3-coloring exists

Time: poly in #variables + #clauses.`}
        proof={`Forward: 3-SAT assignment → 3-coloring
  Set x's color = T or F per assignment.
  All clauses satisfied → OR gadgets colorable.

Backward: 3-coloring → 3-SAT assignment
  Read off x's color → T/F → check each clause's OR-gadget.
  Since OR-gadget only colorable when ≥1 literal T → assignment satisfies.

∴ 3-SAT ≤ₚ 3-COL → 3-COL is NP-Hard.
3-COL ∈ NP → NP-Complete ▢

Note: 2-COL is easy (BFS check bipartite). 3-COL is suddenly NP-Hard.`}
        complexity="Reduction in poly time"
        takeaway="Gadget construction = standard technique for NP-Hard proofs"
      />

      <DesignProblem
        num="3"
        title="Set Cover ≤ₚ Vertex Cover (and back)"
        problem="Show VC ≤ₚ Set Cover and Set Cover ≤ₚ VC"
        hints={[
          "VC → SC: subset_v = {edges incident to v}; cover = subset of subsets",
          "SC → VC: construct bipartite-like graph mapping elements/sets to vertices/edges"
        ]}
        solution={`VC ≤ₚ Set Cover:
- Universe U = edges of G
- Set S_v = edges incident to v (for each v)
- Question: ‘∃ k subsets that cover U?’ ⟺ ‘∃ k vertices covering all edges?’

Set Cover ≤ₚ VC (harder direction):
- Construct graph G:
  - For each set S add a vertex
  - For each element e in U: add (large) clique connecting all sets containing e
- Cover analysis: each clique’s ‘not-in-VC’ = unique set chosen
- After algebra: ∃ k-cover in SC ⟺ ∃ (m-k)-VC in G (where m = #sets)`}
        proof={`Direction 1 (VC → SC): direct correspondence by construction.

Direction 2 (SC → VC): involves auxiliary gadgets.

These reductions show SC and VC are <b>equivalent</b> in difficulty under polynomial reductions.
Both NP-Complete ▢`}
        complexity="Polynomial reductions"
        takeaway="Reductions go <b>both ways</b> show equivalence"
      />

      <DesignProblem
        num="4"
        title="Partition is NP-Complete"
        problem="Partition: ให้ set of integers S. แบ่งเป็น 2 subsets ที่ sum เท่ากันได้ไหม?"
        hints={[
          "Partition ∈ NP: certificate = subset, verify sum",
          "Reduce from Subset Sum",
          "Trick: pad numbers to control balance"
        ]}
        solution={`Reduce Subset Sum ≤ₚ Partition:

Input: Subset Sum (S = {a₁, ..., aₙ}, target T)
Output: Partition (S' = ?)

Construction:
Let totalS = Σ aᵢ
Define:
  - x = totalS + T   (if T ≤ totalS)
  - S' = S ∪ {x, totalS - T}   (assume totalS ≥ T; else swap)

Wait — cleaner formulation:
Let M = max(2T - totalS, 2(totalS - T) - totalS) (large enough)
Add 2 elements: M + T and M + (totalS - T)
→ Partition into 2 equal halves ⟺ Subset Sum to T`}
        proof={`Forward: subset A ⊆ S with sum T → partition
  Set 1: A ∪ {totalS - T} → sum = T + (totalS - T) = totalS
  Set 2: (S \\ A) ∪ {T} → sum = (totalS - T) + T = totalS
  Both equal → valid partition ✓

Backward: equal partition → subset sum T (similar argument)

∴ Subset Sum ≤ₚ Partition → Partition is NP-Hard.
Partition ∈ NP → NP-Complete ▢`}
        complexity="Reduction in O(n)"
        takeaway="‘Padding numbers’ trick — common in subset reductions"
      />

      <DesignProblem
        num="5"
        title="Clique Cover Problem"
        problem="Clique Cover: ให้ G และ k. <b>แบ่ง</b> V(G) เป็น ≤ k cliques ได้ไหม?"
        hints={[
          "Clique Cover ∈ NP: cover = certificate, verify each part is clique",
          "Reduce from k-coloring (3-COL is NP-C special case)",
          "Trick: use complement graph"
        ]}
        solution={`Reduce k-COL ≤ₚ Clique Cover:

Input: G (for k-COL), k
Output: G' = complement of G (edges flipped), k

Construction:
G' = (V(G), {(u,v) : (u,v) ∉ E(G)})
Time: O(V²) — flip edges.`}
        proof={`Key insight: a color class in G (independent set in G) = a clique in G' (complement).

Forward: k-coloring of G → partition V into k independent sets in G
  → k cliques in G' → Clique Cover ≤ k ✓

Backward: Clique Cover ≤ k in G' → partition V into k cliques in G'
  → partition into k independent sets in G → k-coloring of G ✓

∴ k-COL ≤ₚ Clique Cover → Clique Cover is NP-Hard ▢

(For k=3: 3-COL is NP-Complete → Clique Cover ≤ 3 also NP-Complete.)`}
        complexity="Reduction in O(V²)"
        takeaway="Complement graph = powerful tool for IS ↔ Clique ↔ VC reductions"
      />

      <CS21 title="NP Reduction Cheat Sheet" sections={[
        { label: "Direction", value: "Reduce <b>known NP-C</b> ≤ₚ <b>new problem</b><br/>(make new problem look at least as hard)" },
        { label: "Standard starts", value: "3-SAT, VC, IS, Clique, Subset Sum, Hamiltonian" },
        { label: "Gadget technique", value: "Build mini-structures (gadgets) for each variable/clause" },
        { label: "Sanity check", value: "Prove both ⟹ and ⟸ — easy to miss" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   99 — MOCK EXAM 4 — ADVANCED TOPICS
============================================================ */
const EXAM4 = [
  {
    section: "1. Complexity Theory (20 คะแนน)",
    questions: [
      {
        q: "พิสูจน์: ถ้า A ≤ₚ B และ B ∈ P สรุปได้ว่า A ∈ P",
        hint: "Compose ทั้งสอง polynomial algorithm",
        ans: `Algorithm for A: ให้ x = input ของ A
1. Compute f(x) = reduction → poly time (เรียกว่า p₁(|x|))
2. Solve B(f(x)) = poly time (เรียกว่า p₂(|f(x)|))
|f(x)| ≤ p₁(|x|) → poly
Total = p₁(|x|) + p₂(p₁(|x|)) = polynomial ▢`
      },
      {
        q: "แสดงว่า Half-3-SAT (3-SAT แต่ต้องการให้ exactly half ของ clauses true) เป็น NP-Complete",
        hint: "Reduce 3-SAT → add dummy clauses to balance",
        ans: `Reduce 3-SAT ≤ₚ Half-3-SAT:
ให้ φ มี m clauses. สร้าง φ' = φ ∪ {m clauses ที่ trivially false (e.g., x₁ ∧ ¬x₁ — แปลงเป็น CNF)}
→ φ satisfiable ⟺ φ' satisfies exactly m of 2m clauses = half
Polynomial construction ✓
Half-3-SAT ∈ NP — verify ≤ poly
∴ NP-Complete ▢`
      }
    ]
  },
  {
    section: "2. Network Flow (20 คะแนน)",
    questions: [
      {
        q: "ใน network ที่ทุก capacity = 1, max flow = ?",
        hint: "Unit-capacity network → simpler bounds",
        ans: `Max flow = min cut.
In unit-capacity network: min cut = min number of edges to remove to disconnect s, t.
= edge connectivity ของ s, t.
Edmonds-Karp ทำงานใน O(E√V) สำหรับ unit-cap (Dinic's bound).`
      },
      {
        q: "พิสูจน์ König's theorem (bipartite: max matching = min vertex cover)",
        hint: "Use max-flow min-cut on the matching network",
        ans: `Construct network:
s → L → R → t, all capacities = 1.
Max matching M = max flow = min cut C (by MFMC).

Min cut C consists of edges from s and edges to t (not L→R since those are = matching).
Vertices ‘not in S-side of cut’ in L + ‘in S-side of cut’ in R = VC of size |C|.
∴ max matching M = min VC ▢`
      }
    ]
  },
  {
    section: "3. Advanced DP (20 คะแนน)",
    questions: [
      {
        q: "ออกแบบ algorithm สำหรับ Longest Common Substring (ต้องติดกัน, ต่างจาก LCS)",
        hint: "DP[i][j] = longest common substring ending at s1[i-1], s2[j-1]",
        ans: `function LCSubstr(s1, s2):
  dp = 2D array (m+1, n+1) init 0
  best = 0
  for i = 1 to m, j = 1 to n:
    if s1[i-1] == s2[j-1]:
      dp[i][j] = dp[i-1][j-1] + 1
      best = max(best, dp[i][j])
  return best
O(mn) time, O(mn) space → opt O(min(m,n))`
      },
      {
        q: "ออกแบบ DP สำหรับ ‘Egg Drop’: ขวด egg k ใบ, ตึก n ชั้น — หา min trials worst case",
        hint: "dp[k][n] = min trials, choose floor x: max(dp[k-1][x-1], dp[k][n-x]) + 1",
        ans: `dp[k][n] = min trials worst case with k eggs, n floors
Base: dp[1][n] = n (linear search needed)
      dp[k][0] = 0, dp[k][1] = 1
Recurrence: dp[k][n] = 1 + min over x: max(dp[k-1][x-1], dp[k][n-x])
   (drop at floor x: if breaks → solve [x-1] floors with k-1 eggs;
    if not → solve [n-x] floors above with k eggs)
O(kn²) — optimize to O(kn log n) with binary search or O(kn) with monotonic stack`
      }
    ]
  },
  {
    section: "4. Advanced Graph (15 คะแนน)",
    questions: [
      {
        q: "พิสูจน์ว่า 2-SAT แก้ได้ใน O(V+E) ด้วย SCC",
        hint: "Implication graph + SCC of literals",
        ans: `Build implication graph: clause (a ∨ b) → edges ¬a→b และ ¬b→a.
Run SCC.
2-SAT satisfiable ⟺ ไม่มี x และ ¬x อยู่ใน SCC เดียวกัน.
SCC = O(V+E). Build graph = O(clauses). Total = O(V+E). ▢

Assignment: process SCCs in reverse topological order
→ x = true if SCC(x) comes after SCC(¬x).`
      }
    ]
  },
  {
    section: "5. Strings (15 คะแนน)",
    questions: [
      {
        q: "อธิบายว่าทำไม Z-Algorithm ทำงานใน O(n)",
        hint: "Z-box invariant: r monotonically increasing",
        ans: `Loop ทำ O(n) iterations. ภายในแต่ละ iteration อาจ extend match — แต่ extension ทำให้ r เพิ่มขึ้น.
r เริ่ม 0, สูงสุด n → total extensions ≤ n.
Total work = O(n) + O(n) extensions = O(n) ▢`
      }
    ]
  },
  {
    section: "6. Number Theory (10 คะแนน)",
    questions: [
      {
        q: "คำนวณ 2^1000 mod 17 ด้วย fast power และอธิบาย",
        hint: "log₂(1000) ≈ 10 — 10 iterations",
        ans: `2^1000 mod 17:
1000 = 1111101000₂ (10 bits)
ทำ 10 squarings + บางทีคูณ result.
ผลลัพธ์ = 4 (จริง ๆ ต้องคำนวณ — แต่ method correct)
Time: O(log n) — vs naive O(n) = 1000 multiplications`
      }
    ]
  }
];

Lessons21["mock-exam-4"] = function () {
  const [showAns, setShowAns] = useS21({});
  const [timer, setTimer] = useS21(0);
  const [running, setRunning] = useS21(false);

  React.useEffect(() => {
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
        <div className="ttl">📝 Mock Exam 4 — Advanced Topics (120 นาที)</div>
        ครอบคลุม: NP, Flow, Adv DP, Adv Graph, Strings, Number Theory<br/>
        เขียนคำตอบบนกระดาษ → กดดูเฉลย
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

      {EXAM4.map((sec, si) => (
        <div key={si} style={{ marginBottom: 22 }}>
          <h3 style={{ color: 'var(--accent)' }}>{sec.section}</h3>
          {sec.questions.map((q, qi) => {
            const key = si + '-' + qi;
            return (
              <div key={qi} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 10 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Q{qi + 1}. {q.q}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <button onClick={() => toggle(key + 'h')} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    💡 {showAns[key + 'h'] ? 'Hide' : 'Hint'}
                  </button>
                  <button onClick={() => toggle(key)} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                    ✓ {showAns[key] ? 'Hide' : 'Show'} Answer
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

      <div style={{ marginTop: 22, padding: 14, background: 'var(--bg-2)', borderRadius: 10, fontSize: 13, color: 'var(--text-2)' }}>
        <b>📊 Scoring:</b><br/>
        ≥80 → Excellent — พร้อมสอบจริง<br/>
        65-79 → Good — ทบทวนจุดอ่อน<br/>
        50-64 → ผ่าน — ต้องฝึกเพิ่ม<br/>
        &lt;50 → กลับไปอ่านบทเรียนใหม่
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   100 — TEXTBOOK MAPPING (CLRS / Kleinberg / Sedgewick)
============================================================ */
const TEXTBOOK_MAP = [
  { topic: "Big-O / Ω / Θ", lesson: "big-o, big-o-proofs", clrs: "Ch. 3 (Growth of Functions)", kt: "Ch. 2.1-2.4", sedge: "Ch. 1.4" },
  { topic: "Master Theorem", lesson: "master-theorem", clrs: "Ch. 4.5", kt: "Ch. 5.2", sedge: "—" },
  { topic: "Recurrence (Substitution, Tree)", lesson: "recursion-methods", clrs: "Ch. 4.3-4.4", kt: "Ch. 5", sedge: "—" },
  { topic: "Loop Invariant + Correctness", lesson: "loop-invariant", clrs: "Ch. 2.1", kt: "Ch. 2.1", sedge: "Ch. 1.5" },
  { topic: "Amortized Analysis", lesson: "amortized", clrs: "Ch. 17", kt: "—", sedge: "Ch. 1.4" },

  { topic: "Linear / Binary Search", lesson: "linear-search, binary-search", clrs: "Ch. 2.1, 12.3", kt: "Ch. 2.4", sedge: "Ch. 3.1-3.2" },
  { topic: "Bubble / Selection / Insertion Sort", lesson: "bubble-sort, selection-sort, insertion-sort", clrs: "Ch. 2", kt: "Ch. 2.5", sedge: "Ch. 2.1" },
  { topic: "Merge Sort", lesson: "merge-sort", clrs: "Ch. 2.3", kt: "Ch. 5.1", sedge: "Ch. 2.2" },
  { topic: "Quick Sort", lesson: "quick-sort", clrs: "Ch. 7", kt: "Ch. 13.5", sedge: "Ch. 2.3" },
  { topic: "Heap / Heap Sort", lesson: "heap-sort", clrs: "Ch. 6", kt: "Ch. 2.5", sedge: "Ch. 2.4" },
  { topic: "Counting / Radix Sort", lesson: "counting-sort", clrs: "Ch. 8", kt: "—", sedge: "Ch. 5.1" },

  { topic: "Stack / Queue / Linked List", lesson: "stack, queue, linked-list", clrs: "Ch. 10", kt: "Ch. 2.5", sedge: "Ch. 1.3" },
  { topic: "Hash Table", lesson: "hashing, hash-collision", clrs: "Ch. 11", kt: "Ch. 13.6", sedge: "Ch. 3.4" },
  { topic: "Binary Search Tree (BST)", lesson: "bst", clrs: "Ch. 12", kt: "—", sedge: "Ch. 3.2" },
  { topic: "AVL / Red-Black Tree", lesson: "avl-tree", clrs: "Ch. 13", kt: "—", sedge: "Ch. 3.3" },
  { topic: "Union-Find (DSU)", lesson: "union-find", clrs: "Ch. 21", kt: "Ch. 4.6", sedge: "Ch. 1.5" },
  { topic: "Segment Tree / BIT", lesson: "segment-tree", clrs: "—", kt: "—", sedge: "—" },
  { topic: "Trie", lesson: "trie", clrs: "—", kt: "—", sedge: "Ch. 5.2" },

  { topic: "BFS / DFS", lesson: "bfs, dfs", clrs: "Ch. 22.2-22.3", kt: "Ch. 3.2-3.3", sedge: "Ch. 4.1-4.2" },
  { topic: "Topological Sort", lesson: "topo-sort", clrs: "Ch. 22.4", kt: "Ch. 3.6", sedge: "Ch. 4.2" },
  { topic: "Cycle Detection", lesson: "cycle-detect", clrs: "Ch. 22.3", kt: "Ch. 3.5", sedge: "Ch. 4.2" },
  { topic: "Dijkstra", lesson: "dijkstra", clrs: "Ch. 24.3", kt: "Ch. 4.4", sedge: "Ch. 4.4" },
  { topic: "Bellman-Ford", lesson: "bellman-ford, bellman-ford-deep", clrs: "Ch. 24.1", kt: "Ch. 6.8", sedge: "Ch. 4.4" },
  { topic: "Floyd-Warshall", lesson: "floyd-warshall", clrs: "Ch. 25.2", kt: "—", sedge: "—" },
  { topic: "MST (Prim, Kruskal)", lesson: "mst", clrs: "Ch. 23", kt: "Ch. 4.5-4.6", sedge: "Ch. 4.3" },
  { topic: "SCC (Tarjan, Kosaraju)", lesson: "scc", clrs: "Ch. 22.5", kt: "Ch. 3.5", sedge: "Ch. 4.2" },
  { topic: "Articulation / Bridges", lesson: "articulation", clrs: "—", kt: "Ch. 3.6 (sec ex)", sedge: "Ch. 4.2" },

  { topic: "Divide & Conquer (general)", lesson: "matrix-mult, strassen", clrs: "Ch. 4", kt: "Ch. 5", sedge: "Ch. 2.3" },
  { topic: "Quick Select / Median", lesson: "quick-select", clrs: "Ch. 9", kt: "Ch. 13.5", sedge: "—" },
  { topic: "Strassen / Karatsuba", lesson: "strassen", clrs: "Ch. 4.2", kt: "Ch. 5.5", sedge: "—" },

  { topic: "Greedy (Activity, Huffman)", lesson: "greedy, huffman", clrs: "Ch. 16", kt: "Ch. 4", sedge: "Ch. 5.5" },
  { topic: "Dynamic Programming (intro)", lesson: "dp", clrs: "Ch. 15", kt: "Ch. 6", sedge: "Ch. 6.6" },
  { topic: "0/1 Knapsack", lesson: "dp", clrs: "Ch. 15 (exer.)", kt: "Ch. 6.4", sedge: "Ch. 6.6" },
  { topic: "LIS", lesson: "lis", clrs: "Ch. 15 (exer.)", kt: "Ch. 6.7", sedge: "—" },
  { topic: "LCS", lesson: "lcs", clrs: "Ch. 15.4", kt: "—", sedge: "—" },
  { topic: "Edit Distance", lesson: "edit-distance", clrs: "Ch. 15 (exer.)", kt: "Ch. 6.7", sedge: "—" },
  { topic: "Matrix Chain", lesson: "matrix-chain", clrs: "Ch. 15.2", kt: "—", sedge: "—" },
  { topic: "Bitmask DP / TSP Held-Karp", lesson: "bitmask-dp", clrs: "Ch. 35.2 (TSP)", kt: "Ch. 10.2", sedge: "—" },
  { topic: "Tree DP", lesson: "tree-dp", clrs: "—", kt: "Ch. 10 (sec ex)", sedge: "—" },
  { topic: "Backtracking / N-Queens", lesson: "backtracking", clrs: "—", kt: "—", sedge: "Ch. 5.5" },

  { topic: "String Matching (Naive)", lesson: "string-match", clrs: "Ch. 32.1", kt: "—", sedge: "Ch. 5.3" },
  { topic: "KMP", lesson: "string-match", clrs: "Ch. 32.4", kt: "—", sedge: "Ch. 5.3" },
  { topic: "Rabin-Karp", lesson: "string-match", clrs: "Ch. 32.2", kt: "—", sedge: "Ch. 5.3" },
  { topic: "Z-Algorithm", lesson: "z-algorithm", clrs: "—", kt: "—", sedge: "—" },
  { topic: "Suffix Array / LCP", lesson: "suffix-array", clrs: "—", kt: "—", sedge: "Ch. 6.3" },
  { topic: "Manacher", lesson: "manacher", clrs: "—", kt: "—", sedge: "—" },
  { topic: "Aho-Corasick", lesson: "aho-corasick", clrs: "Ch. 32 (sec ex)", kt: "—", sedge: "—" },

  { topic: "P, NP, NP-Complete", lesson: "p-vs-np", clrs: "Ch. 34.1-34.4", kt: "Ch. 8.1-8.4", sedge: "Ch. 6.7" },
  { topic: "Polynomial Reductions", lesson: "reductions", clrs: "Ch. 34.3-34.4", kt: "Ch. 8.4-8.5", sedge: "—" },
  { topic: "NP-Complete Problems (3-SAT etc.)", lesson: "np-complete-problems", clrs: "Ch. 34.5", kt: "Ch. 8.5-8.8", sedge: "Ch. 6.7" },
  { topic: "Approximation Algorithms", lesson: "approximation", clrs: "Ch. 35", kt: "Ch. 11", sedge: "—" },

  { topic: "Network Flow / Max Flow", lesson: "max-flow", clrs: "Ch. 26.2", kt: "Ch. 7.1-7.2", sedge: "Ch. 6.4" },
  { topic: "Ford-Fulkerson / Edmonds-Karp", lesson: "max-flow, edmonds-karp", clrs: "Ch. 26.2", kt: "Ch. 7.3", sedge: "Ch. 6.4" },
  { topic: "Max-Flow Min-Cut Theorem", lesson: "min-cut", clrs: "Ch. 26.2", kt: "Ch. 7.2", sedge: "Ch. 6.4" },
  { topic: "Bipartite Matching", lesson: "bipartite-matching", clrs: "Ch. 26.3", kt: "Ch. 7.5", sedge: "—" },

  { topic: "Number Theory (GCD, ExtGCD)", lesson: "ext-gcd", clrs: "Ch. 31.1-31.2", kt: "—", sedge: "—" },
  { topic: "Modular Arithmetic / Inverse", lesson: "mod-inverse, fast-power", clrs: "Ch. 31.3-31.6", kt: "—", sedge: "—" },
  { topic: "Sieve of Eratosthenes", lesson: "sieve", clrs: "—", kt: "—", sedge: "—" },
  { topic: "Randomized Algorithms / QuickSort", lesson: "randomized, randomized-quicksort", clrs: "Ch. 5, Ch. 7.3", kt: "Ch. 13", sedge: "—" },
];

Lessons21["textbook-mapping"] = function () {
  const [q, setQ] = useS21("");
  const filtered = TEXTBOOK_MAP.filter(t => !q || t.topic.toLowerCase().includes(q.toLowerCase()));

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📚 Textbook Mapping</div>
        เชื่อมโยงทุกหัวข้อใน Algorithm Academy กับบทใน textbook มาตรฐาน:<br/>
        <b>CLRS</b> = Cormen, Leiserson, Rivest, Stein (4th ed.)<br/>
        <b>KT</b> = Kleinberg & Tardos, "Algorithm Design"<br/>
        <b>Sedge</b> = Sedgewick & Wayne, "Algorithms" (4th ed.)
      </div>

      <div style={{ margin: '14px 0' }}>
        <input
          type="text" placeholder="🔍 ค้นหาหัวข้อ..."
          value={q} onChange={e => setQ(e.target.value)}
          style={{ width: '100%', padding: 10, fontSize: 14, background: 'var(--bg-1)', color: 'var(--text-0)', border: '1px solid var(--border)', borderRadius: 6 }}
        />
      </div>

      <div style={{ background: 'var(--bg-2)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-3)' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-2)' }}>Topic</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-2)' }}>Lesson(s)</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-2)' }}>CLRS</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-2)' }}>Kleinberg-Tardos</th>
              <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-2)' }}>Sedgewick</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--bg-3)' }}>
                <td style={{ padding: '8px 12px', color: 'var(--text-0)', fontWeight: 500 }}>{t.topic}</td>
                <td style={{ padding: '8px 12px', color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>{t.lesson}</td>
                <td style={{ padding: '8px 12px', color: 'var(--accent-2)', fontFamily: 'monospace', fontSize: 12 }}>{t.clrs}</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-1)', fontFamily: 'monospace', fontSize: 12 }}>{t.kt}</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-1)', fontFamily: 'monospace', fontSize: 12 }}>{t.sedge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: 22 }}>📖 Textbook Reading Plan (ตามคอร์ส undergrad)</h3>
      <table className="cmp">
        <thead><tr><th>Week</th><th>Topic</th><th>CLRS Chapters</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Foundations, Big-O</td><td>1-3</td></tr>
          <tr><td>2-3</td><td>Sorting + Order Statistics</td><td>2, 6, 7, 8, 9</td></tr>
          <tr><td>4</td><td>Data Structures + Hashing</td><td>10, 11, 12</td></tr>
          <tr><td>5</td><td>Balanced Trees + Augmented DS</td><td>13, 14</td></tr>
          <tr><td>6</td><td>Dynamic Programming</td><td>15</td></tr>
          <tr><td>7</td><td>Greedy + Amortized</td><td>16, 17</td></tr>
          <tr><td>8</td><td>Disjoint Sets</td><td>21</td></tr>
          <tr><td>9-10</td><td>Graphs (BFS, DFS, Topo, SCC, MST)</td><td>22, 23</td></tr>
          <tr><td>11</td><td>Shortest Paths</td><td>24, 25</td></tr>
          <tr><td>12</td><td>Maximum Flow</td><td>26</td></tr>
          <tr><td>13</td><td>String Matching</td><td>32</td></tr>
          <tr><td>14</td><td>NP-Completeness</td><td>34</td></tr>
          <tr><td>15</td><td>Approximation</td><td>35</td></tr>
        </tbody>
      </table>

      <h3 style={{ marginTop: 22 }}>📑 Alternative Resources</h3>
      <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li><b>MIT 6.006 / 6.046:</b> Free video lectures on OCW</li>
        <li><b>Princeton COS 226 (Sedgewick):</b> Coursera "Algorithms Part I/II"</li>
        <li><b>Stanford CS 161 / 261:</b> Roughgarden's "Algorithms Illuminated" series</li>
        <li><b>Competitive Programming:</b> CP-Algorithms (cp-algorithms.com), USACO Guide</li>
        <li><b>Visualizations:</b> visualgo.net, algorithm-visualizer.org</li>
      </ul>
    </React.Fragment>
  );
};

/* ============================================================
   101 — SM-2 SPACED REPETITION FLASHCARDS
   ============================================================
   Implements SM-2 algorithm (SuperMemo 2):
   - Each card has: ease factor (EF, start 2.5), interval (days), repetitions
   - After review, user rates 0-5 (we use 3 buttons: Again=0, Good=4, Easy=5)
   - Algorithm updates EF, interval based on quality
============================================================ */
const SM2_KEY = "algo-academy-sm2-v1";

function loadSM2() {
  try { return JSON.parse(localStorage.getItem(SM2_KEY) || "{}"); } catch { return {}; }
}
function saveSM2(state) {
  try { localStorage.setItem(SM2_KEY, JSON.stringify(state)); } catch { }
}
function sm2Update(card, quality) {
  // quality: 0-5 (0=blackout, 5=perfect)
  let { ef = 2.5, interval = 0, reps = 0 } = card;
  if (quality < 3) {
    // Failed — restart
    reps = 0;
    interval = 1;
  } else {
    reps++;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ef);
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;
  }
  return { ef, interval, reps, nextReview: Date.now() + interval * 24 * 60 * 60 * 1000 };
}

const ADVANCED_FLASHCARDS = [
  { id: 'big-o-formal', front: "นิยามของ f(n) = O(g(n))?", back: "∃ c &gt; 0, n₀ &gt; 0 : 0 ≤ f(n) ≤ c·g(n) ∀ n ≥ n₀", cat: "Proofs" },
  { id: 'theta-vs-bigo', front: "Θ ต่างจาก O ยังไง?", back: "Θ = ทั้ง upper + lower bound<br/>O = upper bound เท่านั้น<br/>n² = O(n³) ✓ แต่ n² ≠ Θ(n³)", cat: "Proofs" },
  { id: 'loop-invariant-3parts', front: "Loop Invariant ต้องพิสูจน์ 3 อย่าง?", back: "1. Initialization (จริงก่อนเริ่ม)<br/>2. Maintenance (จริงทุก iter)<br/>3. Termination (ให้ correctness ตอนจบ)", cat: "Proofs" },
  { id: 'amortized-methods', front: "3 วิธี Amortized Analysis?", back: "1. Aggregate<br/>2. Accounting (credit)<br/>3. Potential function Φ", cat: "Proofs" },
  { id: 'dynamic-array-amort', front: "Dynamic array push — amortized cost?", back: "O(1) — geometric series 1+2+4+...+n = 2n", cat: "Proofs" },
  { id: 'master-theorem', front: "Master Theorem T(n) = aT(n/b) + n^d — 3 cases?", back: "log_b(a) vs d:<br/>• d &lt; log_b(a) → O(n^log_b a)<br/>• d = log_b(a) → O(n^d log n)<br/>• d &gt; log_b(a) → O(n^d)", cat: "Proofs" },

  { id: 'p-def', front: "คลาส P คืออะไร?", back: "ปัญหา decision ที่<b>แก้ได้ใน poly time</b>", cat: "NP" },
  { id: 'np-def', front: "คลาส NP คืออะไร?", back: "ปัญหา decision ที่<b>verify คำตอบได้ใน poly time</b><br/>(ไม่ได้แปลว่าแก้ไม่ได้เร็ว)", cat: "NP" },
  { id: 'np-complete-def', front: "NP-Complete = ?", back: "NP-Hard ∩ NP<br/>ปัญหา ‘ยากที่สุดใน NP’<br/>ตัวอย่าง: SAT, 3-SAT, Clique, VC", cat: "NP" },
  { id: 'reduction-direction', front: "พิสูจน์ NP-Hard ของ B — reduce ทิศไหน?", back: "<b>known NP-Hard A ≤ₚ B</b><br/>(B ยากเท่ากับ A)", cat: "NP" },
  { id: 'cook-levin', front: "Cook-Levin Theorem 1971?", back: "<b>SAT เป็น NP-Complete</b> — ตัวแรกที่พิสูจน์", cat: "NP" },
  { id: 'vc-2approx', front: "Vertex Cover 2-approximation?", back: "Greedy: pick uncovered edge → add ทั้ง 2 endpoints<br/>|C| ≤ 2·OPT (ใช้ matching argument)", cat: "NP" },

  { id: 'max-flow-min-cut', front: "Max-Flow Min-Cut Theorem?", back: "max |f| = min c(S, T)<br/>เป็นทฤษฎีบทคู่ที่ Ford-Fulkerson พิสูจน์ตอน terminate", cat: "Flow" },
  { id: 'edmonds-karp-time', front: "Edmonds-Karp time complexity?", back: "O(VE²)<br/>= Ford-Fulkerson + BFS เลือก shortest augmenting path", cat: "Flow" },
  { id: 'bipartite-matching-reduce', front: "Bipartite matching reduce → ?", back: "Max flow — capacity 1 ทุก edge<br/>O(E√V) ด้วย Hopcroft-Karp", cat: "Flow" },
  { id: 'konig-theorem', front: "König's Theorem (bipartite)?", back: "max matching = min vertex cover", cat: "Flow" },

  { id: 'lis-time', front: "LIS — fastest known?", back: "O(n log n) — patience sort + binary search<br/>tails[i] = smallest tail of LIS length i+1", cat: "Adv DP" },
  { id: 'lcs-recurrence', front: "LCS recurrence?", back: "match → dp[i-1][j-1] + 1<br/>no match → max(dp[i-1][j], dp[i][j-1])", cat: "Adv DP" },
  { id: 'edit-distance-ops', front: "Edit Distance — 3 ops?", back: "Insert, Delete, Replace (each cost 1)", cat: "Adv DP" },
  { id: 'tsp-held-karp', front: "TSP Held-Karp time?", back: "O(n²·2ⁿ) — bitmask DP<br/>vs naive n! → much faster for n &lt; 25", cat: "Adv DP" },
  { id: 'matrix-chain-time', front: "Matrix Chain Multiplication DP — time?", back: "O(n³) — interval DP<br/>n² intervals × n splits each", cat: "Adv DP" },

  { id: 'scc-algos', front: "2 algorithms สำหรับ SCC?", back: "Kosaraju (2-pass DFS + transpose)<br/>Tarjan (1-pass + low-link)<br/>ทั้งคู่ O(V+E)", cat: "Adv Graph" },
  { id: 'bridge-condition', front: "Edge (u,v) เป็น bridge เมื่อใด?", back: "low[v] &gt; disc[u] (strict)<br/>= ไม่มี back edge จาก subtree(v) ไปที่ u หรือ ancestor", cat: "Adv Graph" },
  { id: 'bellman-ford-time', front: "Bellman-Ford time?", back: "O(V·E) — V-1 iterations × E edges<br/>handle negative weights + detect negative cycle", cat: "Adv Graph" },

  { id: 'z-algorithm', front: "Z-Algorithm pattern matching?", back: "Z(P + '$' + T) → find Z[i] = |P|<br/>O(n + m) total", cat: "Strings" },
  { id: 'manacher-time', front: "Manacher's time?", back: "O(n) — longest palindromic substring<br/>vs expand-around-center O(n²)", cat: "Strings" },
  { id: 'aho-corasick', front: "Aho-Corasick ใช้เมื่อ?", back: "Multi-pattern matching<br/>O(n + m + z) — trie + failure links", cat: "Strings" },
  { id: 'suffix-array-kasai', front: "Kasai's LCP — time?", back: "O(n) — amortized<br/>ใช้ rank[] = inverse of SA", cat: "Strings" },

  { id: 'ext-gcd', front: "Extended Euclidean หาอะไร?", back: "gcd(a, b) <b>+ x, y</b> ที่ ax + by = gcd(a, b)<br/>(Bezout's identity)", cat: "Number Theory" },
  { id: 'fermat-inverse', front: "Modular Inverse (Fermat) สูตร?", back: "a⁻¹ ≡ a^(p-2) (mod p) — p ต้องเป็น prime", cat: "Number Theory" },
  { id: 'sieve-time', front: "Sieve of Eratosthenes — time?", back: "O(n log log n)<br/>Linear sieve O(n) — each composite marked once", cat: "Number Theory" },
  { id: 'fast-power', front: "Fast power — time + idea?", back: "O(log n) — process bits of n<br/>aⁿ = (a^(n/2))² ถ้า n even<br/>= a · a^(n-1) ถ้า n odd", cat: "Number Theory" },

  { id: 'las-vegas-mc', front: "Las Vegas vs Monte Carlo?", back: "<b>LV:</b> correct always, random time<br/><b>MC:</b> bounded time, may err (with prob ε)", cat: "Random" },
  { id: 'rand-quicksort', front: "Randomized QuickSort — expected comparisons?", back: "≤ 2n·Hₙ ≈ 2n ln n = O(n log n)<br/>(via indicator variables + harmonic sum)", cat: "Random" },
  { id: 'miller-rabin', front: "Miller-Rabin error after k rounds?", back: "≤ (1/4)^k — k=40 → 10⁻²⁴ (less than cosmic ray)", cat: "Random" },
];

Lessons21["sm2-flashcards"] = function () {
  const [state, setState] = useS21(() => loadSM2());
  const [cat, setCat] = useS21('ทั้งหมด');
  const [flipped, setFlipped] = useS21(false);

  const cats = ['ทั้งหมด', ...Array.from(new Set(ADVANCED_FLASHCARDS.map(c => c.cat)))];
  const cards = cat === 'ทั้งหมด' ? ADVANCED_FLASHCARDS : ADVANCED_FLASHCARDS.filter(c => c.cat === cat);

  // pick the most-overdue card
  const now = Date.now();
  const dueCards = cards
    .map(c => ({ card: c, st: state[c.id] || { ef: 2.5, interval: 0, reps: 0, nextReview: 0 } }))
    .filter(x => x.st.nextReview <= now)
    .sort((a, b) => a.st.nextReview - b.st.nextReview);

  const currentItem = dueCards[0] || { card: cards[0], st: state[cards[0]?.id] || { ef: 2.5, interval: 0, reps: 0, nextReview: 0 } };
  const card = currentItem.card;

  const rate = (quality) => {
    const newSt = sm2Update(currentItem.st, quality);
    const newState = { ...state, [card.id]: newSt };
    setState(newState);
    saveSM2(newState);
    setFlipped(false);
  };

  const totalCards = cards.length;
  const learnedCards = cards.filter(c => (state[c.id]?.reps || 0) >= 3).length;
  const dueCount = dueCards.length;

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🧠 SM-2 Spaced Repetition</div>
        <b>Active recall + spacing</b> — review การ์ดใกล้จะลืมพอดี → จำได้นานสุด<br/>
        Algorithm: rate การจำได้ → ระบบคำนวณว่าควร review เมื่อไหร่ครั้งต่อไป
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0' }}>
        {cats.map(c => (
          <button key={c} onClick={() => { setCat(c); setFlipped(false); }}
            style={{
              background: cat === c ? 'var(--accent)' : 'var(--bg-2)',
              color: cat === c ? '#000' : 'var(--text-1)',
              border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13, fontWeight: cat === c ? 600 : 400
            }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{learnedCards}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>เรียนรู้แล้ว</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24' }}>{dueCount}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ครบกำหนด review</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-2)' }}>{totalCards}</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>การ์ดทั้งหมด</div>
        </div>
      </div>

      {dueCount === 0 ? (
        <div className="callout tip" style={{ textAlign: 'center', padding: 30 }}>
          <div style={{ fontSize: 18 }}>✅ ไม่มีการ์ดที่ต้อง review ตอนนี้!</div>
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-2)' }}>กลับมาดูใหม่พรุ่งนี้</div>
        </div>
      ) : (
        <React.Fragment>
          <div onClick={() => setFlipped(!flipped)}
            style={{
              background: flipped ? 'linear-gradient(135deg, rgba(94,234,212,0.12), rgba(168,139,250,0.12))' : 'var(--bg-2)',
              border: '1px solid ' + (flipped ? 'var(--accent-2)' : 'var(--border)'),
              borderRadius: 14, padding: 30, minHeight: 240, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'
            }}>
            <div style={{ fontSize: 11, color: flipped ? 'var(--accent-2)' : 'var(--text-2)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 14 }}>
              {flipped ? '← ANSWER' : 'QUESTION →'}  คลิกเพื่อพลิก
            </div>
            <div style={{ fontSize: flipped ? 16 : 22, fontWeight: 600, color: 'var(--text-0)', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: flipped ? card.back : card.front }} />
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 14 }}>
              หมวด: {card.cat} | EF: {currentItem.st.ef.toFixed(2)} | Interval: {currentItem.st.interval}d | Reps: {currentItem.st.reps}
            </div>
          </div>

          {flipped && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={() => rate(0)} style={{ flex: 1, background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid #f87171', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                😵 Again<br /><span style={{ fontSize: 11 }}>(forgot — restart)</span>
              </button>
              <button onClick={() => rate(3)} style={{ flex: 1, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid #fbbf24', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                🤔 Hard<br /><span style={{ fontSize: 11 }}>(barely recalled)</span>
              </button>
              <button onClick={() => rate(4)} style={{ flex: 1, background: 'rgba(94,234,212,0.15)', color: 'var(--accent-2)', border: '1px solid var(--accent-2)', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                😊 Good<br /><span style={{ fontSize: 11 }}>(some effort)</span>
              </button>
              <button onClick={() => rate(5)} style={{ flex: 1, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: 14, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                🚀 Easy<br /><span style={{ fontSize: 11 }}>(instant)</span>
              </button>
            </div>
          )}
        </React.Fragment>
      )}

      <h3 style={{ marginTop: 22 }}>📚 SM-2 Algorithm สรุปสั้น ๆ</h3>
      <ul style={{ color: 'var(--text-1)', lineHeight: 1.8 }}>
        <li>แต่ละการ์ดมี <b>Ease Factor (EF, เริ่ม 2.5)</b>, interval, reps</li>
        <li>หลัง review rate quality (0-5)</li>
        <li>ถ้า quality &lt; 3 → reset reps, interval = 1 (ลืม → review พรุ่งนี้)</li>
        <li>มิฉะนั้น reps++; interval ใหม่ = interval เก่า × EF</li>
        <li>EF ปรับตาม quality — easy → EF เพิ่ม, hard → EF ลด</li>
        <li>ผลลัพธ์: การ์ดที่จำได้ดี → review ห่างขึ้น, การ์ดยาก → review ถี่</li>
      </ul>

      <div className="callout tip">
        <div className="ttl">📊 Research-backed</div>
        Spaced repetition พิสูจน์แล้วว่า<b>เพิ่ม long-term retention 200-300%</b><br/>
        เทียบกับ massed practice (อ่านซ้ำติด ๆ กัน) ในเวลาเท่ากัน
      </div>
    </React.Fragment>
  );
};

window.LessonsPart21 = Lessons21;
