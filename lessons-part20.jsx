/* Lessons Part 20 — Number Theory + Randomized Algorithms */

const { useState: useS20, useMemo: useM20 } = React;
const { Quiz: Quiz20 } = window.LessonComponents;
const { WorkedExample: WE20, CheatSheet: CS20, Pitfalls: PF20 } = window.LearningKit;

const Lessons20 = {};

/* ============================================================
   89 — EXTENDED EUCLIDEAN
============================================================ */
function ExtGCDViz() {
  const [a, setA] = useS20(30);
  const [b, setB] = useS20(18);
  const result = useM20(() => {
    const trace = [];
    function ext(a, b, depth) {
      trace.push({ depth, a, b, op: 'call' });
      if (b === 0) {
        trace.push({ depth, a, b, op: 'base', g: a, x: 1, y: 0 });
        return { g: a, x: 1, y: 0 };
      }
      const r = ext(b, a % b, depth + 1);
      const x = r.y;
      const y = r.x - Math.floor(a / b) * r.y;
      trace.push({ depth, a, b, op: 'combine', g: r.g, x, y });
      return { g: r.g, x, y };
    }
    return { result: ext(a, b, 0), trace };
  }, [a, b]);

  return (
    <div className="dsv">
      <div className="ctrls">
        <label>a = <input type="number" value={a} onChange={e => setA(+e.target.value || 0)} style={{ width: 80 }} /></label>
        <label>b = <input type="number" value={b} onChange={e => setB(+e.target.value || 0)} style={{ width: 80 }} /></label>
        <span style={{ color: 'var(--accent-2)' }}>
          gcd = <b>{result.result.g}</b>, x = <b>{result.result.x}</b>, y = <b>{result.result.y}</b>
        </span>
      </div>
      <div style={{ background: 'var(--bg-2)', padding: 10, borderRadius: 8, marginTop: 10, fontFamily: 'monospace', fontSize: 12, maxHeight: 200, overflowY: 'auto' }}>
        {result.trace.map((t, i) => (
          <div key={i} style={{ paddingLeft: t.depth * 16, color: t.op === 'base' ? 'var(--accent-3)' : t.op === 'combine' ? 'var(--accent-2)' : 'var(--text-2)' }}>
            {t.op === 'call' && `→ ext(${t.a}, ${t.b})`}
            {t.op === 'base' && `← BASE: gcd=${t.g}, x=${t.x}, y=${t.y}`}
            {t.op === 'combine' && `← gcd=${t.g}, x=${t.x}, y=${t.y}  (verify: ${t.a}·${t.x} + ${t.b}·${t.y} = ${t.a * t.x + t.b * t.y})`}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, padding: 10, background: 'rgba(94,234,212,0.08)', borderLeft: '3px solid var(--accent-2)', borderRadius: 6, fontSize: 13 }}>
        <b>Bezout's identity:</b> {a}·{result.result.x} + {b}·{result.result.y} = {a * result.result.x + b * result.result.y} = gcd({a}, {b})
      </div>
    </div>
  );
}

Lessons20["ext-gcd"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔢 Extended Euclidean Algorithm</div>
        หา gcd(a, b) <b>+ สัมประสิทธิ์ x, y</b> ที่ <b>ax + by = gcd(a, b)</b><br/>
        (Bezout's identity) — พื้นฐานของ modular inverse, RSA
      </div>

      <h3>Visualizer</h3>
      <ExtGCDViz />

      <h3>Algorithm</h3>
      <pre className="code-block">{`function extGCD(a, b):
  if b == 0:
    return (gcd=a, x=1, y=0)   // a·1 + 0·0 = a ✓

  (g, x1, y1) = extGCD(b, a mod b)
  // g = gcd(b, a mod b) = gcd(a, b)
  // b·x1 + (a mod b)·y1 = g

  // a mod b = a - floor(a/b)·b
  // b·x1 + (a - floor(a/b)·b)·y1 = g
  // a·y1 + b·(x1 - floor(a/b)·y1) = g

  x = y1
  y = x1 - floor(a / b) * y1
  return (g, x, y)`}</pre>

      <WE20
        title="Trace: extGCD(30, 18)"
        problem="หา x, y ที่ 30x + 18y = gcd(30, 18) = 6"
        steps={[
          { title: "Step 1", body: "extGCD(30, 18) → recurse extGCD(18, 12)\n  (30 mod 18 = 12)", why: "" },
          { title: "Step 2", body: "extGCD(18, 12) → recurse extGCD(12, 6)", why: "" },
          { title: "Step 3", body: "extGCD(12, 6) → recurse extGCD(6, 0)", why: "" },
          { title: "Base", body: "extGCD(6, 0) returns (g=6, x=1, y=0)\nVerify: 6·1 + 0·0 = 6 ✓", why: "" },
          { title: "Backtrack 1: extGCD(12, 6)", body: "x = 0, y = 1 - floor(12/6)·0 = 1\nReturn (6, 0, 1)\nVerify: 12·0 + 6·1 = 6 ✓", why: "" },
          { title: "Backtrack 2: extGCD(18, 12)", body: "x = 1, y = 0 - floor(18/12)·1 = -1\nReturn (6, 1, -1)\nVerify: 18·1 + 12·(-1) = 6 ✓", why: "" },
          { title: "Backtrack 3: extGCD(30, 18)", body: "x = -1, y = 1 - floor(30/18)·(-1) = 2\nReturn (6, -1, 2)\nVerify: 30·(-1) + 18·2 = -30 + 36 = 6 ✓", why: "" },
        ]}
        answer="extGCD(30, 18) = (6, -1, 2) → 30·(-1) + 18·2 = 6 ▢"
      />

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Modular Inverse:</b> หา a⁻¹ mod m (เมื่อ gcd(a,m)=1)</li>
        <li><b>Chinese Remainder Theorem (CRT):</b> แก้ระบบ x ≡ aᵢ (mod mᵢ)</li>
        <li><b>RSA Cryptosystem:</b> หา private key d จาก ed ≡ 1 (mod φ(n))</li>
        <li><b>Diophantine equations:</b> ax + by = c มี solution ⟺ gcd(a,b) | c</li>
      </ul>

      <h3>Complexity</h3>
      <p>
        Recursion depth = O(log min(a, b)) — เหมือน Euclidean ปกติ<br/>
        Each step = O(1) → <b>Total: O(log min(a, b))</b>
      </p>

      <CS20 title="Extended Euclidean Cheat Sheet" sections={[
        { label: "Bezout", value: "ax + by = gcd(a, b) — มีเสมอ" },
        { label: "Recursion", value: "(g, y, x - ⌊a/b⌋·y) จาก extGCD(b, a mod b)" },
        { label: "Time", value: "O(log min(a, b))" },
        { label: "Use", value: "Modular inverse, CRT, RSA, Diophantine" },
      ]} />
    </React.Fragment>
  );
};

/* ============================================================
   90 — MODULAR INVERSE
============================================================ */
Lessons20["mod-inverse"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🔁 Modular Inverse — a⁻¹ mod m</div>
        หาค่า b ที่ <b>a · b ≡ 1 (mod m)</b><br/>
        Exists ⟺ gcd(a, m) = 1
      </div>

      <h3>วิธีที่ 1 — Extended Euclidean</h3>
      <pre className="code-block">{`a · x + m · y = gcd(a, m) = 1
→ a · x ≡ 1 (mod m)
→ x = a⁻¹ (mod m)

function modInverse(a, m):
  (g, x, _) = extGCD(a, m)
  if g != 1: return null    // no inverse
  return ((x mod m) + m) mod m   // ensure positive

Time: O(log m)`}</pre>

      <h3>วิธีที่ 2 — Fermat's Little Theorem (m prime)</h3>
      <pre className="code-block">{`If m is prime and gcd(a, m) = 1:
  a^(m-1) ≡ 1 (mod m)
  → a · a^(m-2) ≡ 1 (mod m)
  → a⁻¹ ≡ a^(m-2) (mod m)

function modInverseFermat(a, m):
  return fastPower(a, m-2, m)

Time: O(log m)`}</pre>

      <h3>วิธีที่ 3 — Euler's Theorem (m not prime)</h3>
      <pre className="code-block">{`If gcd(a, m) = 1:
  a^φ(m) ≡ 1 (mod m)
  → a⁻¹ ≡ a^(φ(m)-1) (mod m)

φ(m) = Euler's totient (count of i in [1, m] with gcd(i, m) = 1)
For prime p: φ(p) = p - 1`}</pre>

      <WE20
        title="หา 3⁻¹ mod 11 (m = 11 prime)"
        problem="คำนวณด้วย 2 วิธี"
        steps={[
          { title: "วิธี 1: Extended Euclidean", body: "extGCD(3, 11):\n  extGCD(11, 3) → extGCD(3, 2) → extGCD(2, 1) → extGCD(1, 0)\n  Base: (1, 1, 0)\n  Back: extGCD(2, 1): x=0, y=1-2·0=1 → (1, 0, 1)\n  Back: extGCD(3, 2): x=1, y=0-1·1=-1 → (1, 1, -1)\n  Back: extGCD(11, 3): x=-1, y=1-3·(-1)=4 → (1, -1, 4)\n  Back: extGCD(3, 11): x=4, y=-1-0·4=-1 → (1, 4, -1)\n  ∴ 3·4 + 11·(-1) = 12 - 11 = 1 ✓", why: "" },
          { title: "Inverse = 4", body: "3 · 4 = 12 = 11 + 1 ≡ 1 (mod 11) ✓", why: "" },
          { title: "วิธี 2: Fermat (m=11 prime)", body: "3⁻¹ = 3^(11-2) = 3⁹ mod 11\n3¹ = 3\n3² = 9\n3⁴ = 81 = 4 (mod 11)\n3⁸ = 16 = 5 (mod 11)\n3⁹ = 3⁸ · 3 = 15 = 4 (mod 11) ✓", why: "Fast power" },
        ]}
        answer="3⁻¹ mod 11 = 4 ▢"
      />

      <h3>เทียบ Extended Euclidean vs Fermat</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Extended Euclidean</th><th>Fermat's</th></tr></thead>
        <tbody>
          <tr><td>Time</td><td>O(log m)</td><td>O(log m) — fast power</td></tr>
          <tr><td>m needs to be prime</td><td>No</td><td>Yes</td></tr>
          <tr><td>Implementation</td><td>Recursive</td><td>Iterative loop</td></tr>
          <tr><td>Common use</td><td>General</td><td>Mod prime (competitive programming)</td></tr>
        </tbody>
      </table>

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Division in modular arithmetic:</b> a/b mod p = a · b⁻¹ mod p</li>
        <li><b>Combinatorics mod p:</b> C(n, k) mod p ใช้ inverse factorial</li>
        <li><b>RSA decryption:</b> d = e⁻¹ mod φ(n)</li>
        <li><b>Polynomial interpolation in modular arithmetic</b></li>
      </ul>

      <CS20 title="Modular Inverse Cheat Sheet" sections={[
        { label: "Definition", value: "a · a⁻¹ ≡ 1 (mod m)" },
        { label: "Exists when", value: "gcd(a, m) = 1" },
        { label: "Methods", value: "ExtGCD (general)<br/>Fermat: a^(p-2) mod p (p prime)<br/>Euler: a^(φ(m)-1) mod m" },
        { label: "Common", value: "p = 10⁹ + 7 (prime) → Fermat fast" },
      ]} />

      <Quiz20 q={{
        question: "5⁻¹ mod 7 = ?",
        options: ["1", "3", "5", "6"],
        answer: 1,
        explain: "5 · 3 = 15 = 7·2 + 1 → 5 · 3 ≡ 1 (mod 7)"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   91 — SIEVE OF ERATOSTHENES + LINEAR SIEVE
============================================================ */
function SieveViz() {
  const [n, setN] = useS20(30);
  const result = useM20(() => {
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    const marks = [];
    for (let i = 2; i * i <= n; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= n; j += i) {
          sieve[j] = false;
          marks.push({ p: i, num: j });
        }
      }
    }
    return { sieve, marks };
  }, [n]);
  return (
    <div className="dsv">
      <div className="ctrls">
        <label>n = <input type="number" value={n} onChange={e => setN(Math.max(2, +e.target.value || 2))} style={{ width: 80 }} /></label>
        <span style={{ color: 'var(--accent-2)' }}>Primes: <b>{result.sieve.filter(Boolean).length}</b></span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
        {result.sieve.map((isPrime, i) => i < 2 ? null : (
          <div key={i} style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isPrime ? 'rgba(16,185,129,0.2)' : 'var(--bg-3)',
            color: isPrime ? '#10b981' : 'var(--text-3)',
            border: '1px solid ' + (isPrime ? '#10b981' : 'var(--border)'),
            borderRadius: 4, fontFamily: 'monospace', fontWeight: 600, fontSize: 12,
            textDecoration: isPrime ? 'none' : 'line-through'
          }}>{i}</div>
        ))}
      </div>
    </div>
  );
}

Lessons20["sieve"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🌾 Sieve of Eratosthenes</div>
        หา primes ทั้งหมด ≤ n ใน O(n log log n) — เร็วมาก
      </div>

      <h3>Visualizer</h3>
      <SieveViz />

      <h3>Algorithm</h3>
      <pre className="code-block">{`function sieve(n):
  isPrime = [true] * (n + 1)
  isPrime[0] = isPrime[1] = false

  for i = 2 to sqrt(n):
    if isPrime[i]:
      for j = i*i to n step i:
        isPrime[j] = false   // mark multiples

  return [i for i in [2..n] if isPrime[i]]`}</pre>

      <h3>Why j = i*i (not 2*i)?</h3>
      <p>
        Smaller multiples of i (2i, 3i, ..., (i-1)i) ถูก mark ไปแล้วโดย primes น้อยกว่า i<br/>
        Optimization saves time — start at i² instead
      </p>

      <h3>Complexity Analysis</h3>
      <WE20
        title="Proof: Sieve = O(n log log n)"
        problem="หา time complexity"
        steps={[
          { title: "Inner loop count", body: "For each prime p ≤ n: inner loop runs n/p times", why: "" },
          { title: "Total operations", body: "Σ (n/p) for primes p ≤ n\n= n · Σ (1/p) for primes p ≤ n", why: "Sum over primes" },
          { title: "Prime harmonic series", body: "Σ (1/p) for primes p ≤ n ≈ log log n (Mertens)", why: "Number theory result" },
          { title: "Total", body: "n · log log n = O(n log log n)", why: "" },
        ]}
        answer="Sieve = O(n log log n) — แทบ linear ▢"
      />

      <h3>Linear Sieve — O(n)</h3>
      <pre className="code-block">{`function linearSieve(n):
  isPrime = [true] * (n + 1)
  primes = []
  smallestFactor = [0] * (n + 1)

  for i = 2 to n:
    if isPrime[i]:
      primes.append(i)
      smallestFactor[i] = i

    for p in primes:
      if p > smallestFactor[i] or i * p > n: break
      isPrime[i * p] = false
      smallestFactor[i * p] = p

  return primes

// Each composite is marked exactly once by its smallest prime factor → O(n)`}</pre>

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>List all primes ≤ N:</b> for cryptography, math contests</li>
        <li><b>Factorize numbers ≤ N quickly:</b> using smallest prime factor</li>
        <li><b>Count primes ≤ N:</b> prime-counting function π(N)</li>
        <li><b>Euler's totient for all i ≤ n:</b> using sieve-like approach</li>
      </ul>

      <h3>Segmented Sieve (for large N)</h3>
      <p>
        Memory limit: 10⁹ booleans = 1GB → too much<br/>
        <b>Segmented:</b> sieve [L, R] using primes ≤ √R precomputed<br/>
        → O(√R + (R-L) log log R) time, O(√R + (R-L)) space
      </p>

      <CS20 title="Sieve Cheat Sheet" sections={[
        { label: "Eratosthenes", value: "O(n log log n) time<br/>O(n) space" },
        { label: "Linear sieve", value: "O(n) time + smallest prime factor" },
        { label: "Segmented", value: "Sieve large [L, R] with small memory" },
        { label: "Trick", value: "Start j = i² (not 2i)" },
      ]} />

      <Quiz20 q={{
        question: "n = 100 — กี่ primes ≤ 100?",
        options: ["20", "25", "30", "35"],
        answer: 1,
        explain: "25 primes: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   92 — FAST POWER (EXPONENTIATION)
============================================================ */
Lessons20["fast-power"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">⚡ Fast Power — aⁿ ใน O(log n)</div>
        Naive: a × a × ... × a = O(n)<br/>
        Fast: ใช้ binary representation ของ n → O(log n)
      </div>

      <h3>Recursive</h3>
      <pre className="code-block">{`function fastPow(a, n):
  if n == 0: return 1
  if n % 2 == 0:
    half = fastPow(a, n / 2)
    return half * half
  else:
    return a * fastPow(a, n - 1)`}</pre>

      <h3>Iterative (preferred)</h3>
      <pre className="code-block">{`function fastPow(a, n):
  result = 1
  while n > 0:
    if n & 1:
      result *= a
    a *= a
    n >>= 1
  return result

// Modular version: result = (result * a) % mod, a = (a * a) % mod`}</pre>

      <WE20
        title="Trace: 3¹³ (binary: 1101)"
        problem="คำนวณ 3¹³"
        steps={[
          { title: "n = 13 = 1101₂", body: "Process bits from low to high", why: "Bits → which powers to multiply" },
          { title: "Iteration 1: bit 1 set", body: "result = 1 * 3 = 3\na = 3² = 9\nn = 6 (110₂)", why: "" },
          { title: "Iteration 2: bit 0", body: "result = 3 (unchanged)\na = 9² = 81\nn = 3 (11₂)", why: "" },
          { title: "Iteration 3: bit 1 set", body: "result = 3 * 81 = 243\na = 81² = 6561\nn = 1 (1₂)", why: "" },
          { title: "Iteration 4: bit 1 set", body: "result = 243 * 6561 = 1,594,323\nn = 0 → STOP", why: "" },
        ]}
        answer="3¹³ = 1,594,323 ▢ — ใช้ 4 multiplications แทน 13"
        takeaway="13 = 1+4+8 → 3¹³ = 3¹ · 3⁴ · 3⁸"
      />

      <h3>Modular Fast Power (สำคัญสุด)</h3>
      <pre className="code-block">{`function modPow(a, n, mod):
  a %= mod
  result = 1
  while n > 0:
    if n & 1:
      result = (result * a) % mod
    a = (a * a) % mod
    n >>= 1
  return result

// Time: O(log n) — independent of magnitude of a, n
// Used in: RSA, modular inverse via Fermat, fast Fibonacci`}</pre>

      <h3>Matrix Fast Power</h3>
      <p>
        Generalize: replace numbers with matrices, addition with matrix add<br/>
        Useful for linear recurrences (Fibonacci, Tribonacci, …)
      </p>
      <pre className="code-block">{`Fib recurrence: [F(n+1), F(n)] = [[1,1],[1,0]] · [F(n), F(n-1)]
→ [F(n), F(n-1)] = M^(n-1) · [F(1), F(0)]
→ F(n) computable in O(log n)`}</pre>

      <h3>Applications</h3>
      <ul style={{ color: 'var(--text-1)' }}>
        <li><b>Modular arithmetic:</b> a^n mod m</li>
        <li><b>RSA:</b> encryption/decryption</li>
        <li><b>Modular inverse (Fermat):</b> a^(p-2) mod p</li>
        <li><b>Fast Fibonacci, Tribonacci, …:</b> matrix exponentiation</li>
        <li><b>Counting walks in graph:</b> M^k = walks of length k</li>
      </ul>

      <CS20 title="Fast Power Cheat Sheet" sections={[
        { label: "Time", value: "O(log n) — for any n" },
        { label: "Loop trick", value: "Process bits of n: if bit set → multiply<br/>Always square a" },
        { label: "Modular", value: "Take mod after every multiply" },
        { label: "Matrix variant", value: "Linear recurrences in O(k³ log n)" },
      ]} />

      <Quiz20 q={{
        question: "2^100 mod 1000 ใช้ multiplications กี่ครั้ง (modular fast power)?",
        options: ["~7", "~14", "~50", "100"],
        answer: 0,
        explain: "log₂(100) ≈ 7 → ~7 squarings + บางทีคูณ result"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   93 — RANDOMIZED ALGORITHMS
============================================================ */
Lessons20["randomized"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">🎲 Randomized Algorithms</div>
        ใช้ random choice ระหว่าง computation → analyze <b>expected behavior</b>
      </div>

      <h3>2 ประเภทหลัก</h3>
      <table className="cmp">
        <thead><tr><th></th><th>Las Vegas</th><th>Monte Carlo</th></tr></thead>
        <tbody>
          <tr><td>คำตอบ</td><td>ถูกเสมอ ✓</td><td>อาจผิด (with prob ≤ ε)</td></tr>
          <tr><td>เวลา</td><td>Random (expected bounded)</td><td>Bounded (worst case)</td></tr>
          <tr><td>ตัวอย่าง</td><td>Randomized QuickSort, Randomized BFS</td><td>Miller-Rabin primality, Karger min-cut</td></tr>
          <tr><td>หยุดเมื่อไร</td><td>เจอคำตอบที่ verify ได้</td><td>หลังจำนวน iterations</td></tr>
        </tbody>
      </table>

      <h3>Las Vegas: Randomized QuickSort</h3>
      <pre className="code-block">{`function quickSort(arr, lo, hi):
  if lo >= hi: return
  pivot = arr[random(lo, hi)]   // RANDOM PIVOT
  i, j = partition(arr, lo, hi, pivot)
  quickSort(arr, lo, i - 1)
  quickSort(arr, j + 1, hi)

// Correct always (sorts correctly)
// Expected time: O(n log n) — proof in next lesson
// Worst case: O(n²) (still possible but probability ≈ 0)`}</pre>

      <h3>Monte Carlo: Miller-Rabin Primality Test</h3>
      <pre className="code-block">{`function millerRabin(n, k):
  // Test if n is prime with k random witnesses
  if n < 4: return n == 2 or n == 3
  if n % 2 == 0: return false

  // Write n - 1 = 2^r · d (d odd)
  d = n - 1; r = 0
  while d % 2 == 0:
    d /= 2; r++

  for _ in range(k):
    a = random(2, n - 2)
    x = modPow(a, d, n)
    if x == 1 or x == n - 1: continue

    composite = true
    for _ in range(r - 1):
      x = (x * x) % n
      if x == n - 1: composite = false; break

    if composite: return false  // definitely composite

  return true  // probably prime (error prob ≤ (1/4)^k)`}</pre>

      <WE20
        title="Error analysis of Miller-Rabin"
        problem="Bound the error probability"
        steps={[
          { title: "Composite witnesses", body: "For composite n: at least 3/4 of {a in [1, n-1]} are ‘witnesses’\n→ random a misses witness with prob ≤ 1/4", why: "Number theory result" },
          { title: "k iterations independent", body: "Error ≤ (1/4)^k", why: "Probability of all k missing witness" },
          { title: "k = 40", body: "(1/4)^40 = 2^(-80) ≈ 10⁻²⁴\n→ practically zero (less than cosmic ray bit flip!)", why: "" },
        ]}
        answer="Miller-Rabin with k=40 is more reliable than deterministic algorithms ▢"
      />

      <h3>Karger's Min Cut Algorithm</h3>
      <pre className="code-block">{`function karger(G):
  while |V| > 2:
    pick random edge (u, v)
    contract (u, v) into one vertex (allow multi-edges)
  return number of edges between the 2 remaining vertices

// Probability of finding min cut ≥ 2 / (n(n-1))
// Repeat O(n² log n) times → success prob 1 - 1/n
// Total time: O(n^4 log n) — slow but proven simple bound`}</pre>

      <h3>ทำไมต้องใช้ Randomized?</h3>
      <ol style={{ color: 'var(--text-1)' }}>
        <li><b>Simpler:</b> Las Vegas QuickSort ง่ายกว่า median-of-medians deterministic</li>
        <li><b>Faster on average:</b> RNG hash tables เร็วกว่า self-balancing tree</li>
        <li><b>Only known fast algorithm:</b> Polynomial identity testing</li>
        <li><b>Robust to adversarial input:</b> ไม่มี worst-case input ที่ adversary เลือกได้</li>
      </ol>

      <CS20 title="Randomized Cheat Sheet" sections={[
        { label: "Las Vegas", value: "Always correct, random time<br/>QuickSort, Quick Select" },
        { label: "Monte Carlo", value: "Bounded time, may err<br/>Miller-Rabin, Karger" },
        { label: "Expected analysis", value: "E[T] = Σ probability · time" },
        { label: "Boost reliability", value: "Repeat k times → error → (error)^k" },
      ]} />

      <Quiz20 q={{
        question: "Las Vegas vs Monte Carlo — ต่างกันยังไง?",
        options: [
          "LV เร็วกว่าเสมอ",
          "MC ผิดได้, LV ถูกเสมอแต่เวลาผันแปร",
          "MC ใช้ random, LV ใช้ deterministic",
          "MC ใช้ memory น้อยกว่า"
        ],
        answer: 1,
        explain: "LV: correct always, random time. MC: bounded time, may be wrong with small probability"
      }} />
    </React.Fragment>
  );
};

/* ============================================================
   94 — RANDOMIZED QUICKSORT ANALYSIS
============================================================ */
Lessons20["randomized-quicksort"] = function () {
  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📊 Randomized QuickSort — Expected O(n log n) Proof</div>
        ใช้ <b>indicator variables</b> นับจำนวน comparisons เฉลี่ย
      </div>

      <h3>Setup</h3>
      <p>
        ให้ z₁ &lt; z₂ &lt; ... &lt; zₙ คือ elements sorted<br/>
        <b>Indicator variable:</b> Xᵢⱼ = 1 ถ้า zᵢ และ zⱼ ถูก compare ระหว่างการทำงาน, 0 otherwise
      </p>

      <WE20
        title="Theorem: E[Total comparisons] = O(n log n)"
        problem="Prove using indicator variables"
        steps={[
          { title: "Total comparisons", body: "X = Σᵢ Σⱼ>ᵢ Xᵢⱼ\nE[X] = Σᵢ Σⱼ>ᵢ E[Xᵢⱼ] = Σᵢ Σⱼ>ᵢ Pr[zᵢ vs zⱼ compared]", why: "Linearity of expectation" },
          { title: "Key insight", body: "zᵢ และ zⱼ ถูก compare ⟺ <b>หนึ่งใน {zᵢ, ..., zⱼ} ถูกเลือกเป็น pivot ก่อน</b> ตัวอื่นในช่วงนี้", why: "Once a pivot is chosen between them, they separate" },
          { title: "Compute Pr", body: "ใน {zᵢ, ..., zⱼ}: มี (j - i + 1) elements\nFirst pivot chosen uniformly random\n→ Pr[zᵢ or zⱼ first] = 2 / (j - i + 1)\n→ Pr[compared] = 2 / (j - i + 1)", why: "Probability ที่หนึ่งใน 2 ปลายเลือกก่อน" },
          { title: "Sum", body: "E[X] = Σᵢ Σⱼ>ᵢ 2/(j-i+1)\n    = Σᵢ Σₖ=₂ⁿ⁻ⁱ⁺¹ 2/k\n    ≤ Σᵢ 2·Hₙ\n    = 2n · Hₙ\n    ≈ 2n · ln n\n    = <b>O(n log n)</b>", why: "Harmonic series Hₙ ≈ ln n" },
        ]}
        answer="E[QuickSort comparisons] ≤ 2n · Hₙ = O(n log n) ▢"
        takeaway="Worst case O(n²) ยังเกิดได้ — แต่ ‘probability ≈ 0’ ที่เลือก pivot แย่ตลอด"
      />

      <h3>เทียบ Deterministic Pivot Strategies</h3>
      <table className="cmp">
        <thead><tr><th>Pivot</th><th>Worst case</th><th>Avg case</th></tr></thead>
        <tbody>
          <tr><td>First element</td><td>O(n²) — sorted input</td><td>O(n log n)</td></tr>
          <tr><td>Last element</td><td>O(n²) — sorted</td><td>O(n log n)</td></tr>
          <tr><td>Median-of-3</td><td>O(n²) — crafted adversarial</td><td>O(n log n)</td></tr>
          <tr><td>Random</td><td>O(n²) — but Pr ≈ 0</td><td>O(n log n)</td></tr>
          <tr><td>Median-of-medians</td><td>O(n log n) guaranteed</td><td>O(n log n) (but slow constant)</td></tr>
        </tbody>
      </table>

      <h3>ทำไม Randomized แก้ ‘adversarial input’?</h3>
      <p>
        Deterministic pivot strategy → adversary รู้ algorithm → สร้าง input ที่ trigger worst case<br/>
        Randomized pivot → adversary ไม่รู้ random bits → ไม่สามารถ craft input ได้
      </p>

      <h3>Other Expected Analysis</h3>
      <table className="cmp">
        <thead><tr><th>Algorithm</th><th>Expected Time</th></tr></thead>
        <tbody>
          <tr><td>Randomized QuickSort</td><td>O(n log n)</td></tr>
          <tr><td>Randomized Quick Select</td><td>O(n)</td></tr>
          <tr><td>Hash Table insert/lookup</td><td>O(1)</td></tr>
          <tr><td>Treap (random priority)</td><td>O(log n) per op</td></tr>
          <tr><td>Skip List</td><td>O(log n) per op</td></tr>
        </tbody>
      </table>

      <CS20 title="Probabilistic Analysis Tools" sections={[
        { label: "Linearity of expectation", value: "E[X + Y] = E[X] + E[Y] — ไม่ต้อง independence!" },
        { label: "Indicator variables", value: "Xᵢ ∈ {0, 1}<br/>E[Xᵢ] = Pr[event]" },
        { label: "Harmonic sum", value: "Σ 1/k for k=1..n ≈ ln n" },
        { label: "Boost reliability", value: "Repeat k times → reduce error" },
      ]} />

      <Quiz20 q={{
        question: "ใน Randomized QuickSort, ความน่าจะเป็นที่ zᵢ และ zⱼ ถูก compare เป็น?",
        options: ["1 / (j - i)", "2 / (j - i + 1)", "1 / n", "1 / 2"],
        answer: 1,
        explain: "2 / (j - i + 1) — มี (j-i+1) elements ใน range, 2 คือปลาย (i หรือ j) ที่ต้องเลือกก่อน"
      }} />
    </React.Fragment>
  );
};

window.LessonsPart20 = Lessons20;
