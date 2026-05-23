/* Lessons Part 7 — Inject Worked Examples + Cheat Sheets + Pitfalls into existing lessons */

const { WorkedExample, CheatSheet, Pitfalls } = window.LearningKit;

/* For every lesson that has extra content, we wrap the original lesson and append. */
const ENRICH = {};

/* ============================================================
   BIG-O — derivation drills
============================================================ */
ENRICH["big-o"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Examples — Derive Big-O</h3>

      <WorkedExample
        title="Ex 1: ลูปคู่ไม่สมมาตร"
        problem="หา Big-O: <code>for(i=0;i&lt;n;i++) for(j=i;j&lt;n;j++) cnt++;</code>"
        steps={[
          { title: "นับ inner loop เมื่อ i = 0", body: "j = 0..n-1 → ทำ <b>n</b> ครั้ง" },
          { title: "นับ inner loop เมื่อ i = 1", body: "j = 1..n-1 → ทำ <b>n-1</b> ครั้ง" },
          { title: "นับทุก iteration ของ outer", body: "i=0: n\ni=1: n-1\ni=2: n-2\n...\ni=n-1: 1\n\nรวม = n + (n-1) + (n-2) + ... + 1" },
          { title: "ใช้สูตร arithmetic series", body: "1 + 2 + ... + n = <b>n(n+1)/2</b>", why: "summation พื้นฐาน — ต้องจำให้ขึ้นใจ" },
          { title: "Simplify", body: "n(n+1)/2 = n²/2 + n/2\nตัด constant และ lower order → <b>n²</b>" },
        ]}
        answer="<b>O(n²)</b> — ลูปคู่แบบ triangular ก็ยังคง O(n²) เหมือนลูปคู่ปกติ"
        takeaway="ลูปคู่ใด ๆ ที่ inner loop ขึ้นกับ n → O(n²) ไม่ว่า bound จะเริ่มจาก i, i+1, หรือ 0"
      />

      <WorkedExample
        title="Ex 2: log loop"
        problem="หา Big-O: <code>for(i=1;i&lt;n;i*=2) for(j=0;j&lt;i;j++) cnt++;</code>"
        steps={[
          { title: "ดู outer loop", body: "i = 1, 2, 4, 8, ..., n → ทำ <b>log₂n</b> ครั้ง" },
          { title: "inner loop ทำกี่ครั้งในแต่ละ iteration?", body: "i=1: 1\ni=2: 2\ni=4: 4\ni=8: 8\n...\ni=n/2: n/2" },
          { title: "รวมทุก iteration", body: "1 + 2 + 4 + 8 + ... + n/2\n= geometric series", why: "sum ของ 2⁰ + 2¹ + ... + 2^k" },
          { title: "ใช้สูตร geometric series", body: "1 + 2 + 4 + ... + 2^k = <b>2^(k+1) - 1</b>\nเมื่อ 2^k = n/2 → k = log n - 1\n→ ≈ <b>n - 1</b>" },
        ]}
        answer="<b>O(n)</b> — แม้ outer จะเป็น log n แต่ inner เพิ่มเป็น geometric → รวมกลายเป็น O(n)"
        takeaway="อย่าคูณ outer × inner เลย — ต้องคิด summation จริง"
      />

      <h3 style={{ marginTop: 30 }}>📋 Cheat Sheet — Big-O</h3>
      <CheatSheet title="Big-O Quick Reference" sections={[
        { label: "GROWTH RATE", value: "O(1) &lt; O(log n) &lt; O(√n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(n³) &lt; O(2ⁿ) &lt; O(n!)", mono: true },
        { label: "SUMMATION FORMULAS", value: "1+2+..+n = n(n+1)/2 = O(n²)<br>1+2+4+..+2ⁿ = 2^(n+1)-1 = O(2ⁿ)<br>1+1/2+1/4+.. ≤ 2 (constant)<br>log 1 + log 2 + .. + log n = O(n log n)" },
        { label: "RULES", value: "1. ตัด constant: 5n → O(n)<br>2. ตัด lower order: n² + n → O(n²)<br>3. log มี base อะไรไม่สำคัญ<br>4. ลูปติดกัน: max ของแต่ละลูป<br>5. ลูปซ้อน: คูณกัน (ระวัง summation)" },
        { label: "FOR n = 1,000,000", value: "O(1) ≈ 0 ms<br>O(log n) ≈ 0 ms (20 ops)<br>O(n) ≈ 1 ms<br>O(n log n) ≈ 20 ms<br>O(n²) ≈ 17 min<br>O(2ⁿ) ≈ ☠️ จักรวาลจะหายไปก่อน" },
      ]} />

      <Pitfalls items={[
        { trap: "บอกว่า <code>for(i=0;i&lt;n*n;i++)</code> เป็น O(n) เพราะ <b>1 ลูป</b>", fix: "ผิด! ดู bound — ลูปทำ n² ครั้ง → <b>O(n²)</b> แม้จะเขียนเป็นลูปเดียว" },
        { trap: "บอก <code>for(i=n;i&gt;0;i/=2)</code> เป็น O(n) เพราะลด i", fix: "ผิด! i หาร 2 ทุกครั้ง → log n ครั้ง → <b>O(log n)</b>" },
        { trap: "นึกว่า log n × log n = log n²", fix: "ผิด! log n × log n = (log n)² ไม่ใช่ log n² (ซึ่ง = 2 log n = O(log n))" },
        { trap: "ตอบ Best case ของ Bubble Sort = O(n²) เสมอ", fix: "ผิด! Bubble Sort ที่ใช้ flag <b>หยุดได้ early</b> ถ้าไม่มี swap → Best = O(n)" },
        { trap: "นับ recursion ผิด: T(n) = T(n-1) + n เหมือน T(n) = nT(n-1)", fix: "ระวัง! T(n-1) + n = O(n²) แต่ nT(n-1) = O(n!) — ต่างกันมหาศาล" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   BUBBLE SORT
============================================================ */
ENRICH["bubble-sort"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example — Bubble Sort ทีละ pass</h3>
      <WorkedExample
        title="Bubble Sort กับ [5, 1, 4, 2, 8]"
        problem="แสดง pass แรก ๆ ของ bubble sort"
        steps={[
          { title: "Pass 1 — เริ่ม", body: "[<b>5, 1</b>, 4, 2, 8] → 5 &gt; 1 → swap\n[1, <b>5, 4</b>, 2, 8] → 5 &gt; 4 → swap\n[1, 4, <b>5, 2</b>, 8] → 5 &gt; 2 → swap\n[1, 4, 2, <b>5, 8</b>] → 5 &lt; 8 → keep\n→ <b>[1, 4, 2, 5, 8]</b>", why: "ตัวมากสุด (8 อยู่แล้วท้าย) ลอยไปขวา" },
          { title: "Pass 2", body: "[<b>1, 4</b>, 2, 5, 8] → keep\n[1, <b>4, 2</b>, 5, 8] → swap\n[1, 2, <b>4, 5</b>, 8] → keep\n→ <b>[1, 2, 4, 5, 8]</b>", why: "ข้อมูลเรียงแล้ว แต่ algorithm ยังไม่รู้" },
          { title: "Pass 3 — optimization", body: "ถ้าไม่มี swap ใน pass ใด → หยุดได้\nPass 3: ตรวจสอบ → ไม่มี swap → <b>หยุด!</b>", why: "นี่คือเหตุผล Best case = O(n) — ไม่ต้องครบ n-1 pass" },
        ]}
        answer="[1, 2, 4, 5, 8] — ใช้ 3 pass (1 ทำงาน + 1 ปิดงาน + 1 verify)"
        takeaway="ใช้ flag <code>swapped</code> ตรวจ — ไม่ swap ใน pass ใด ก็หยุดได้ทันที"
      />

      <h3>📋 Cheat Sheet — Bubble Sort</h3>
      <CheatSheet title="Bubble Sort" sections={[
        { label: "TIME", value: "Worst: O(n²)<br>Avg: O(n²)<br>Best: O(n) — เรียงแล้ว + ใช้ flag", mono: true },
        { label: "SPACE", value: "O(1) — in-place", mono: true },
        { label: "STABLE?", value: "ใช่ ✓ — ไม่ swap คู่ที่เท่ากัน" },
        { label: "เมื่อไหร่ใช้?", value: "เกือบไม่เคย — ใช้สอน เพราะเข้าใจง่าย<br>ของจริงใช้ Insertion (สำหรับ n เล็ก)" },
      ]} />

      <Pitfalls items={[
        { trap: "บอก best case = O(n²) เสมอ", fix: "ถ้าไม่มี flag → ใช่ O(n²); แต่ <b>มี flag</b> → O(n)" },
        { trap: "ลืมใส่ <code>swapped = false</code> ก่อนแต่ละ pass", fix: "ต้อง reset ทุก pass — ไม่งั้นจะออกผิด" },
        { trap: "เขียน inner loop เป็น <code>j &lt; n</code> เสมอ", fix: "ใช้ <code>j &lt; n - i - 1</code> — ตัวท้าย i ตัว เรียงแล้ว ไม่ต้องเช็คอีก" },
        { trap: "บอกว่า bubble = unstable", fix: "Bubble <b>stable</b> เพราะใช้ <code>&gt;</code> ไม่ใช่ <code>≥</code> — คู่เท่าจะไม่ swap" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   INSERTION SORT
============================================================ */
ENRICH["insertion-sort"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example</h3>
      <WorkedExample
        title="Insertion Sort กับ [5, 2, 4, 6, 1, 3]"
        problem="แสดงการ insert ทุก step"
        steps={[
          { title: "i = 1, key = 2", body: "[<b>5</b>, <u>2</u>, 4, 6, 1, 3]\nเลื่อน 5 ขวา → ใส่ 2 ที่ตำแหน่ง 0\n→ [<b>2, 5</b>, 4, 6, 1, 3]" },
          { title: "i = 2, key = 4", body: "[2, <b>5</b>, <u>4</u>, 6, 1, 3]\nเลื่อน 5 ขวา → ใส่ 4 ที่ 1\n→ [2, <b>4, 5</b>, 6, 1, 3]" },
          { title: "i = 3, key = 6", body: "[2, 4, <b>5</b>, <u>6</u>, ...] 6 &gt; 5 → ไม่เลื่อน\n→ [2, 4, 5, <b>6</b>, 1, 3]" },
          { title: "i = 4, key = 1", body: "[2, 4, 5, 6, <u>1</u>, 3] เลื่อน 6,5,4,2 ทั้งหมดขวา\n→ [<b>1</b>, 2, 4, 5, 6, 3]", why: "case แย่ — เลื่อนทุกตัว" },
          { title: "i = 5, key = 3", body: "[1, 2, 4, 5, 6, <u>3</u>] เลื่อน 6,5,4 ขวา ใส่ 3 ที่ 2\n→ [1, 2, <b>3</b>, 4, 5, 6]" },
        ]}
        answer="[1, 2, 3, 4, 5, 6]"
        takeaway="key เปรียบเทียบกับ left subarray ที่<b>เรียงแล้ว</b> ไปทางซ้าย — เหมือนเรียงไพ่ในมือ"
      />

      <CheatSheet title="Insertion Sort" sections={[
        { label: "TIME", value: "Worst: O(n²) — reversed<br>Avg: O(n²)<br>Best: O(n) — sorted แล้ว", mono: true },
        { label: "STABLE?", value: "ใช่ ✓" },
        { label: "เมื่อไหร่ใช้?", value: "n เล็ก (n &lt; 50)<br>ข้อมูล nearly sorted<br>ใช้เป็น subroutine ของ Quicksort/Timsort" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   MERGE SORT
============================================================ */
ENRICH["merge-sort"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example</h3>
      <WorkedExample
        title="Merge Sort กับ [38, 27, 43, 3, 9, 82, 10]"
        problem="แสดง recursion tree + merge phase"
        steps={[
          { title: "Divide phase", body: "[38,27,43,3,9,82,10]\n├── [38,27,43,3]\n│   ├── [38,27]\n│   │   ├── [38]\n│   │   └── [27]\n│   └── [43,3]\n│       ├── [43]\n│       └── [3]\n└── [9,82,10]\n    ├── [9,82]\n    └── [10]", why: "แบ่งครึ่งจนเหลือตัวเดียว = base case" },
          { title: "Merge level 1", body: "[38] + [27] → <b>[27,38]</b>\n[43] + [3]  → <b>[3,43]</b>\n[9] + [82]  → <b>[9,82]</b>", why: "merge สอง array เรียงแล้ว = O(n)" },
          { title: "Merge level 2", body: "[27,38] + [3,43] → <b>[3,27,38,43]</b>\n[9,82] + [10]  → <b>[9,10,82]</b>" },
          { title: "Merge level 3 (สุดท้าย)", body: "[3,27,38,43] + [9,10,82]\n\nเปรียบเทียบหัว ๆ:\n3 ≤ 9 → 3\n27 vs 9 → 9\n27 vs 10 → 10\n27 vs 82 → 27\n...\n→ <b>[3,9,10,27,38,43,82]</b>" },
          { title: "Complexity", body: "Recursion: T(n) = 2T(n/2) + n\nMaster: a=2, b=2, d=1, log₂2=1=d → <b>Case 2</b>\n→ <b>O(n log n)</b>", why: "merge ทำ O(n) ทุก level, มี log n level" },
        ]}
        answer="[3, 9, 10, 27, 38, 43, 82] — O(n log n)"
        takeaway="Merge Sort เร็วเพราะแม้ระดับสุดท้ายต้องดู n ตัว แต่ tree ลึกแค่ log n level"
      />

      <CheatSheet title="Merge Sort" sections={[
        { label: "TIME", value: "ทุกกรณี: O(n log n)", mono: true },
        { label: "SPACE", value: "O(n) — ใช้ tmp array", mono: true },
        { label: "STABLE?", value: "ใช่ ✓ — เลือก a[i] เมื่อ a[i] ≤ a[j]" },
        { label: "เมื่อไหร่ใช้?", value: "ต้องการ stable + O(n log n) garantee<br>External sort (ข้อมูลใหญ่กว่า RAM)<br>Linked list (ไม่ต้องการ random access)" },
      ]} />

      <Pitfalls items={[
        { trap: "ใส่ <code>&lt;</code> ใน merge → unstable", fix: "ใช้ <code>≤</code> เพื่อเลือกตัวซ้ายก่อนเมื่อเท่ากัน → stable" },
        { trap: "คิดว่า in-place", fix: "ผิด! ต้องการ O(n) extra space สำหรับ tmp" },
        { trap: "ลืม merge step สุดท้ายว่ายังต้อง copy ตัวเหลือ", fix: "หลัง while loop ต้องมี 2 while เพื่อ copy ตัวที่เหลือฝั่งใดฝั่งหนึ่ง" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   QUICK SORT
============================================================ */
ENRICH["quick-sort"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example</h3>
      <WorkedExample
        title="Quick Sort กับ [10, 80, 30, 90, 40, 50, 70] — pivot = ตัวสุดท้าย"
        problem="แสดง partition step"
        steps={[
          { title: "Partition: pivot = 70", body: "i = -1 (boundary ของ &lt; pivot)\nj=0: 10 ≤ 70 → i=0, swap a[0] กับ a[0]\nj=1: 80 &gt; 70 → ข้าม\nj=2: 30 ≤ 70 → i=1, swap a[1] กับ a[2] → [10,30,80,90,40,50,70]\nj=3: 90 &gt; 70 → ข้าม\nj=4: 40 ≤ 70 → i=2, swap a[2] กับ a[4] → [10,30,40,90,80,50,70]\nj=5: 50 ≤ 70 → i=3, swap a[3] กับ a[5] → [10,30,40,50,80,90,70]\nสุดท้าย swap a[i+1] กับ pivot → swap a[4] กับ a[6]\n→ <b>[10,30,40,50,70,90,80]</b>" },
          { title: "หลัง partition", body: "ซ้ายของ 70: [10, 30, 40, 50] (≤ 70)\npivot: <b>70</b>\nขวาของ 70: [90, 80] (&gt; 70)" },
          { title: "Recurse ฝั่งซ้าย [10,30,40,50]", body: "pivot = 50 → partition → [10,30,40,50]\nrecurse ซ้าย [10,30,40] → ... → [10,30,40]" },
          { title: "Recurse ฝั่งขวา [90,80]", body: "pivot = 80 → partition → [80,90]" },
          { title: "Final", body: "<b>[10, 30, 40, 50, 70, 80, 90]</b>" },
        ]}
        answer="[10, 30, 40, 50, 70, 80, 90]"
        takeaway="Lomuto partition: i ชี้ขอบเขตของตัว ≤ pivot — ทุก swap ขยายขอบเขตทีละ 1"
      />

      <CheatSheet title="Quick Sort" sections={[
        { label: "TIME", value: "Avg: O(n log n)<br>Worst: O(n²) — pivot ไม่ดี (sorted/reversed)<br>Best: O(n log n)", mono: true },
        { label: "SPACE", value: "O(log n) — recursion stack", mono: true },
        { label: "STABLE?", value: "ไม่ ✗ — swap ทำลายลำดับเดิม" },
        { label: "วิธีกัน worst case", value: "1. Random pivot<br>2. Median-of-three (เลือก pivot จาก first/mid/last)<br>3. Introsort (สลับเป็น Heap Sort เมื่อ depth ลึกเกิน)" },
      ]} />

      <Pitfalls items={[
        { trap: "ใช้ pivot = ตัวสุดท้าย ใน sorted array", fix: "Worst case O(n²)! ต้อง random หรือ median-of-three" },
        { trap: "Recurse แค่ฝั่งเดียวลืมเก็บอีกฝั่ง", fix: "ต้องเรียก quicksort ทั้ง 2 ฝั่ง: <code>qs(lo, p-1); qs(p+1, hi);</code>" },
        { trap: "พูดว่า Quick Sort เร็วกว่า Merge Sort เสมอ", fix: "ผิดในบาง case — sorted/reversed input quick worst case แย่กว่า merge" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   BINARY SEARCH
============================================================ */
ENRICH["binary-search"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example</h3>
      <WorkedExample
        title="Binary Search หา 23 ใน [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]"
        problem="แสดงทุก iteration"
        steps={[
          { title: "Iter 1: lo=0, hi=9", body: "mid = (0+9)/2 = <b>4</b>\na[4] = 16\n16 &lt; 23 → <b>ไปฝั่งขวา</b>\nlo = mid + 1 = 5", why: "target ใหญ่กว่า → ตัด left half ทิ้ง" },
          { title: "Iter 2: lo=5, hi=9", body: "mid = (5+9)/2 = <b>7</b>\na[7] = 56\n56 &gt; 23 → <b>ไปฝั่งซ้าย</b>\nhi = mid - 1 = 6" },
          { title: "Iter 3: lo=5, hi=6", body: "mid = (5+6)/2 = <b>5</b>\na[5] = <b>23</b> ✓\n<b>FOUND!</b> ตำแหน่ง 5" },
        ]}
        answer="พบที่ index 5 — ใช้ 3 iterations (≈ log₂10)"
        takeaway="ทุก iteration ตัดครึ่ง search space — n=10 → 3 iter, n=1M → 20 iter, n=1B → 30 iter"
      />

      <CheatSheet title="Binary Search" sections={[
        { label: "TIME", value: "O(log n) — แบ่งครึ่งทุกครั้ง", mono: true },
        { label: "REQUIREMENT", value: "ข้อมูล<b>ต้องเรียง</b>แล้ว<br>random access ได้ (array, ไม่ใช่ linked list)" },
        { label: "RECURRENCE", value: "T(n) = T(n/2) + O(1)<br>= O(log n)", mono: true },
        { label: "VARIANT", value: "lower_bound: หา ≥ x ตัวแรก<br>upper_bound: หา &gt; x ตัวแรก<br>Interpolation: ประมาณตำแหน่งจากค่า" },
      ]} />

      <Pitfalls items={[
        { trap: "เขียน <code>mid = (lo+hi)/2</code> ใน C/Java", fix: "<b>Integer overflow</b> ถ้า lo+hi &gt; INT_MAX! ใช้ <code>lo + (hi-lo)/2</code>" },
        { trap: "ลืม <code>= mid + 1</code> หรือ <code>= mid - 1</code>", fix: "ถ้าเขียน <code>lo = mid</code> → infinite loop เมื่อ lo = hi - 1" },
        { trap: "ใช้กับข้อมูลไม่เรียง", fix: "ผลลัพธ์ undefined — ต้องเรียงก่อนเสมอ" },
        { trap: "ใช้ <code>while(lo &lt; hi)</code> หรือ <code>while(lo &lt;= hi)</code>?", fix: "Standard: <code>lo &lt;= hi</code> + return -1 ใน loop ออก<br>หรือ <code>lo &lt; hi</code> + check หลัง loop (lower_bound style)" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   DP
============================================================ */
ENRICH["dp"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example: 0/1 Knapsack</h3>
      <WorkedExample
        title="0/1 Knapsack: W=5, items=[(w=1,v=1),(w=2,v=4),(w=3,v=5),(w=4,v=7)]"
        problem="หาค่า v รวมสูงสุด ที่ w รวม ≤ 5"
        steps={[
          { title: "Define table M[i][w]", body: "M[i][w] = ค่าสูงสุด เมื่อใช้ของ i ตัวแรก ในกระเป๋าขนาด w\nสร้าง M (5 row × 6 col)" },
          { title: "Base case: M[0][w] = 0", body: "ไม่หยิบของเลย → 0\nรอบแรก (item 0): ทุก w = 0" },
          { title: "Recurrence", body: "M[i][w] = max(\n  M[i-1][w],                     // ไม่หยิบ item i\n  M[i-1][w - wᵢ] + vᵢ           // หยิบ (ถ้า wᵢ ≤ w)\n)" },
          { title: "เติม row 1 (item: w=1, v=1)", body: "w=0: max(0, -) = 0\nw=1: max(0, M[0][0]+1) = 1\nw=2: max(0, M[0][1]+1) = 1\nw=3: 1, w=4: 1, w=5: 1" },
          { title: "เติม row 2 (item: w=2, v=4)", body: "w=0: 0\nw=1: M[1][1] = 1 (น้ำหนักไม่พอ)\nw=2: max(M[1][2]=1, M[1][0]+4) = <b>4</b>\nw=3: max(1, M[1][1]+4) = <b>5</b>\nw=4: max(1, M[1][2]+4) = <b>5</b>\nw=5: max(1, M[1][3]+4) = <b>5</b>" },
          { title: "เติม row 3 (item: w=3, v=5)", body: "w=3: max(M[2][3]=5, M[2][0]+5) = 5\nw=4: max(M[2][4]=5, M[2][1]+5) = <b>6</b>\nw=5: max(M[2][5]=5, M[2][2]+5) = <b>9</b> 🎯" },
          { title: "เติม row 4 (item: w=4, v=7)", body: "w=4: max(M[3][4]=6, M[3][0]+7) = 7\nw=5: max(M[3][5]=9, M[3][1]+7) = <b>9</b>", why: "เลือก item 2+3 ดีกว่า item 4 + item 0" },
          { title: "Trace back", body: "M[4][5] = 9 = M[3][5] (ไม่ใช่ M[3][1]+7) → ไม่หยิบ item 4\nM[3][5] = 9 = M[2][2]+5 → <b>หยิบ item 3</b>\nM[2][2] = 4 = M[1][0]+4 → <b>หยิบ item 2</b>\nM[1][0] = 0 → ไม่หยิบ item 1" },
        ]}
        answer="ค่าสูงสุด = <b>9</b> — หยิบ item 2 (w=2,v=4) + item 3 (w=3,v=5) → w=5, v=9"
        takeaway="DP table 2D — แต่ละช่องคิดจากช่องบน (ไม่หยิบ) หรือ ช่องบน-ซ้าย (หยิบ)"
      />

      <CheatSheet title="Dynamic Programming" sections={[
        { label: "WHEN TO USE", value: "1. Optimal substructure<br>2. Overlapping sub-problems" },
        { label: "STEPS", value: "1. นิยาม dp[i] / dp[i][j]<br>2. หา recurrence<br>3. base case<br>4. order ของ filling<br>5. trace back ถ้าต้องการ solution" },
        { label: "TOP-DOWN vs BOTTOM-UP", value: "<b>Top-down (memo):</b> recursion + cache<br>เขียนง่าย, อาจ stack overflow<br><br><b>Bottom-up (tabulation):</b> loop เติมตาราง<br>เร็วกว่า, ไม่ stack overflow" },
        { label: "CLASSIC PROBLEMS", value: "Fibonacci, Knapsack, LCS, LIS<br>Coin Change, Edit Distance<br>Matrix Chain, Subset Sum" },
      ]} />

      <Pitfalls items={[
        { trap: "Order ของ loop ผิด → ใช้ค่าที่ยังไม่เติม", fix: "ตรวจ recurrence: ถ้า dp[i] ใช้ dp[i-1] → loop i จากเล็กไปใหญ่" },
        { trap: "ใช้ Greedy แก้ 0/1 Knapsack", fix: "Greedy ผิดสำหรับ 0/1 — ใช้ DP เท่านั้น (Fractional ใช้ Greedy ได้)" },
        { trap: "ลืมว่าต้อง trace back เพื่อหาคำตอบจริง", fix: "ค่า dp[n][W] = max value, แต่ items ที่เลือก ต้อง backtrack จากตาราง" },
        { trap: "Top-down memo ไม่ check cache ก่อน", fix: "ทุก function แรกต้อง: <code>if (memo[n] != -1) return memo[n];</code>" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   GREEDY
============================================================ */
ENRICH["greedy"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example: Activity Selection</h3>
      <WorkedExample
        title="Activity Selection: เลือกกิจกรรมไม่ทับซ้อนได้สูงสุด"
        problem="กิจกรรม (start, finish): A=(1,4) B=(3,5) C=(0,6) D=(5,7) E=(3,9) F=(5,9) G=(6,10) H=(8,11) I=(8,12) J=(2,14) K=(12,16)"
        steps={[
          { title: "Step 1: เรียงตาม finish time", body: "A(1,4), B(3,5), C(0,6), D(5,7), E(3,9), F(5,9), G(6,10), H(8,11), I(8,12), J(2,14), K(12,16)", why: "Greedy choice = เลือกตัวที่จบเร็วสุดก่อน — ทำให้เหลือเวลาเลือกอื่นมากสุด" },
          { title: "Step 2: เลือก A (จบที่ 4)", body: "selected = [A]\nlast_finish = 4" },
          { title: "Step 3: ตัวต่อไปต้อง start ≥ 4", body: "B(3,5): start=3 &lt; 4 → ข้าม\nC(0,6): start=0 &lt; 4 → ข้าม\n<b>D(5,7): start=5 ≥ 4 → เลือก ✓</b>\nlast_finish = 7" },
          { title: "Step 4: ต่อ — start ≥ 7", body: "E(3,9): &lt; 7 ข้าม\nF(5,9): &lt; 7 ข้าม\n<b>G(6,10): start=6 &lt; 7 ข้าม</b>\n<b>H(8,11): start=8 ≥ 7 ✓</b>\nlast_finish = 11" },
          { title: "Step 5: ต่อ — start ≥ 11", body: "I(8,12), J(2,14): start &lt; 11 ข้าม\n<b>K(12,16): ✓</b>\nlast_finish = 16" },
          { title: "ผลสุดท้าย", body: "selected = [A, D, H, K] → <b>4 activities</b>" },
        ]}
        answer="เลือกได้ 4 activities: A(1,4), D(5,7), H(8,11), K(12,16)"
        takeaway="Greedy choice: เรียงตาม finish time → เลือกตัวจบเร็วสุดที่ไม่ขัดกับที่เลือกแล้ว"
      />

      <CheatSheet title="Greedy" sections={[
        { label: "WHEN TO USE", value: "1. Greedy choice property<br>2. Optimal substructure" },
        { label: "WORKS FOR", value: "Activity Selection<br>Fractional Knapsack<br>Huffman Coding<br>Job Sequencing<br>Tape Storage<br>Dijkstra (with min-heap)<br>MST (Prim, Kruskal)" },
        { label: "DOESN'T WORK FOR", value: "0/1 Knapsack ✗<br>Coin Change (non-canonical) ✗<br>Longest Path ✗<br>→ ต้องใช้ DP แทน" },
        { label: "HOW TO DESIGN", value: "1. หาว่าจะ sort ตามอะไร<br>(ratio? finish time? deadline?)<br>2. iterate + เลือกถ้าไม่ขัด<br>3. <b>พิสูจน์</b>ว่า greedy ให้ optimal" },
      ]} />

      <Pitfalls items={[
        { trap: "ใช้ Greedy ทุกปัญหา optimization", fix: "Greedy ใช้ได้แค่บางปัญหา — ถ้าให้ตัวอย่าง counterexample ได้ → ต้อง DP" },
        { trap: "Activity Selection — เรียงตาม start time", fix: "ผิด! ต้องเรียงตาม <b>finish time</b> ถึงจะ optimal" },
        { trap: "Coin Change ใช้ Greedy เสมอ", fix: "ใช้ได้กับ canonical (1,5,10,25); ผิดกับ {1,3,4} จ่าย 6 (Greedy=3 เหรียญ, DP=2)" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   BFS
============================================================ */
ENRICH["bfs"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example</h3>
      <WorkedExample
        title="BFS จาก node 0 ในกราฟ"
        problem="adj = {0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1,5], 5:[2,4]}"
        steps={[
          { title: "Init", body: "queue = [0]\nvisited = {0}\norder = []" },
          { title: "Pop 0", body: "order = [0]\nneighbors: 1, 2 → ยังไม่ visited\nadd → queue = [1,2], visited = {0,1,2}" },
          { title: "Pop 1", body: "order = [0,1]\nneighbors: 0 (visited), 3, 4\nadd → queue = [2,3,4], visited += {3,4}" },
          { title: "Pop 2", body: "order = [0,1,2]\nneighbors: 0 (v), 5\nadd → queue = [3,4,5], visited += {5}" },
          { title: "Pop 3, 4, 5", body: "ทุก neighbor visited แล้ว → ไม่ add\norder = [0,1,2,3,4,5]" },
        ]}
        answer="BFS order: <b>0 → 1 → 2 → 3 → 4 → 5</b><br>level 0: {0}, level 1: {1,2}, level 2: {3,4,5}"
        takeaway="BFS ใช้ queue → เยี่ยมระดับต่อระดับ → shortest path ใน unweighted graph"
      />

      <CheatSheet title="BFS" sections={[
        { label: "DATA STRUCTURE", value: "Queue (FIFO)<br>visited set/array" },
        { label: "TIME / SPACE", value: "O(V + E) time<br>O(V) space", mono: true },
        { label: "USES", value: "Shortest path (unweighted)<br>Level-order tree traversal<br>Bipartite check<br>Connected components<br>Web crawling" },
        { label: "PSEUDOCODE", value: "Q.push(start); visited[start]=T<br>while !Q.empty():<br>&nbsp;&nbsp;u = Q.pop()<br>&nbsp;&nbsp;for v in adj[u]:<br>&nbsp;&nbsp;&nbsp;&nbsp;if !visited[v]:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visited[v]=T<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Q.push(v)", mono: true },
      ]} />

      <Pitfalls items={[
        { trap: "Mark visited <b>หลัง</b> pop ออกจาก queue", fix: "ผิด! ต้อง mark <b>ตอน push</b> เข้า queue ไม่งั้นจะ push ซ้ำ" },
        { trap: "ใช้ DFS หาว่าเส้นทางสั้นสุด", fix: "ใช้ <b>BFS</b> สำหรับ unweighted shortest path — DFS ไม่การันตี shortest" },
        { trap: "ในกราฟ undirected ลืมว่า edge ทั้ง 2 ทาง", fix: "adj list ต้องมีทั้ง adj[u] += v และ adj[v] += u" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   DFS
============================================================ */
ENRICH["dfs"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example</h3>
      <WorkedExample
        title="DFS จาก node 0 (recursion)"
        problem="กราฟเดียวกับ BFS — adj = {0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1,5], 5:[2,4]}"
        steps={[
          { title: "DFS(0)", body: "visit 0 → order=[0]\nไป neighbor แรก = 1" },
          { title: "DFS(1)", body: "visit 1 → order=[0,1]\nneighbors: 0(v), 3, 4 → ไป 3" },
          { title: "DFS(3)", body: "visit 3 → order=[0,1,3]\nneighbor: 1(v) → return back to DFS(1)" },
          { title: "DFS(1) — กลับมาทำต่อ neighbor 4", body: "ไป 4 → DFS(4)" },
          { title: "DFS(4)", body: "visit 4 → order=[0,1,3,4]\nneighbors: 1(v), 5 → ไป 5" },
          { title: "DFS(5)", body: "visit 5 → order=[0,1,3,4,5]\nneighbors: 2, 4(v) → ไป 2" },
          { title: "DFS(2)", body: "visit 2 → order=[0,1,3,4,5,2]\nneighbors: 0(v), 5(v) → return" },
        ]}
        answer="DFS order: <b>0 → 1 → 3 → 4 → 5 → 2</b>"
        takeaway="DFS ลึกก่อน — เปรียบเทียบ BFS [0,1,2,3,4,5] vs DFS [0,1,3,4,5,2]"
      />

      <CheatSheet title="DFS" sections={[
        { label: "DATA STRUCTURE", value: "Stack (LIFO) หรือ Recursion" },
        { label: "TIME / SPACE", value: "O(V + E) time<br>O(V) space (recursion stack)", mono: true },
        { label: "USES", value: "Cycle detection<br>Topological sort<br>Connected components<br>Backtracking<br>Path finding (any path)<br>Strongly connected components" },
        { label: "PSEUDOCODE", value: "DFS(u):<br>&nbsp;&nbsp;visited[u] = true<br>&nbsp;&nbsp;for v in adj[u]:<br>&nbsp;&nbsp;&nbsp;&nbsp;if !visited[v]:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DFS(v)", mono: true },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   RECURSION
============================================================ */
ENRICH["recursion"] = function () {
  return (
    <React.Fragment>
      <h3 style={{ marginTop: 30 }}>🔬 Worked Example: Tower of Hanoi</h3>
      <WorkedExample
        title="Tower of Hanoi — n=3 จาก peg A → C ใช้ B"
        problem="ย้าย disk n ตัวจากเสา A ไป C ใช้เสา B เป็น aux โดย: ครั้งละ 1 disk, ห้ามวาง disk ใหญ่บน disk เล็ก"
        steps={[
          { title: "Recurrence", body: "T(n) = ย้าย n-1 ไปกลาง + ย้าย 1 ตัวสุดท้าย + ย้าย n-1 จากกลางไปปลาย\nT(n) = T(n-1) + 1 + T(n-1) = 2T(n-1) + 1\nT(1) = 1" },
          { title: "n=3 — เริ่ม", body: "A: [3,2,1]   B: []   C: []" },
          { title: "ย้าย 2 disk แรก จาก A → B (ใช้ C)", body: "1. A→C: A[3,2] B[] C[1]\n2. A→B: A[3] B[2] C[1]\n3. C→B: A[3] B[2,1] C[]" },
          { title: "ย้าย disk 3 จาก A → C", body: "4. A→C: A[] B[2,1] C[3]" },
          { title: "ย้าย 2 disk จาก B → C (ใช้ A)", body: "5. B→A: A[1] B[2] C[3]\n6. B→C: A[1] B[] C[3,2]\n7. A→C: A[] B[] C[3,2,1] ✓" },
        ]}
        answer="ใช้ <b>2³ - 1 = 7</b> moves<br>T(n) = 2T(n-1)+1 → <b>O(2ⁿ)</b>"
        takeaway="n=64 → 1.8×10¹⁹ moves — ตำนาน Hanoi: ถ้าย้าย 1 sec/move ใช้ 580,000 ล้านปี"
      />
    </React.Fragment>
  );
};

/* Compose enrich into final lesson components — ค้นใน part 1-31 ทั้งหมด */
const _ALL_PARTS_P7 = Array.from({ length: 31 }, (_, i) => 'LessonsPart' + (i + 1));
const _origLessons = {};
_ALL_PARTS_P7.forEach(k => { if (window[k]) Object.assign(_origLessons, window[k]); });

Object.keys(ENRICH).forEach(id => {
  const Original = _origLessons[id];
  const Extra = ENRICH[id];
  if (Original) {
    const Wrapped = function () {
      return (
        <React.Fragment>
          <Original />
          <Extra />
        </React.Fragment>
      );
    };
    // Inject back into ตรง part ที่ host lesson นี้
    for (const k of _ALL_PARTS_P7) {
      if (window[k] && window[k][id]) { window[k][id] = Wrapped; break; }
    }
  }
});
