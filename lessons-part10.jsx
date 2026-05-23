/* Lessons Part 10 — Code Solutions Bank + Mock Exam 2 & 3 + Timed Drill */

const { useState: useS10, useMemo: useM10, useEffect: useE10, useRef: useR10 } = React;

const Lessons10 = {};

/* ============================================================
   CODE SOLUTIONS BANK — full C++ solutions for PDF assignments
============================================================ */
const CODE_SOLUTIONS = [
  {
    id: "frac-knapsack",
    title: "Fractional Knapsack (Greedy)",
    cat: "Greedy",
    problem: "W=25, items w=[18,15,10,5] v=[25,24,5,8]\nหาสัดส่วน item ที่เลือก (0.00-1.00) + total value\nOutput: 0.28 1.00 0.00 1.00 / 38.94",
    approach: "เรียง index ตาม v/w จากมากไปน้อย → ใส่ทีละชิ้น ถ้าไม่ครบ → หั่น",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

int main() {
  int n; double W;
  cin >> n >> W;
  vector<double> w(n), v(n);
  for (int i = 0; i < n; i++) cin >> w[i];
  for (int i = 0; i < n; i++) cin >> v[i];

  // index sorted by v/w descending
  vector<int> idx(n);
  for (int i = 0; i < n; i++) idx[i] = i;
  sort(idx.begin(), idx.end(), [&](int a, int b) {
    return v[a]/w[a] > v[b]/w[b];
  });

  vector<double> frac(n, 0.0);
  double total = 0, rem = W;
  for (int i : idx) {
    if (rem >= w[i]) { frac[i] = 1.0; total += v[i]; rem -= w[i]; }
    else { frac[i] = rem / w[i]; total += v[i] * frac[i]; break; }
  }

  cout << fixed << setprecision(2);
  for (int i = 0; i < n; i++) cout << frac[i] << " \\n"[i==n-1];
  cout << total << endl;
  return 0;
}`,
    complexity: "O(n log n) จาก sort"
  },
  {
    id: "tape-storage",
    title: "Tape Storage (Greedy)",
    cat: "Greedy",
    problem: "n ไฟล์ ความยาว li\nหาวิธีเรียงไฟล์ให้ Mean Retrieval Time (MRT) น้อยสุด\nMRT = (l1 + (l1+l2) + (l1+l2+l3) + ...)/n",
    approach: "เรียงจากสั้นไปยาว — ทำให้ไฟล์สั้นถูกอ่านบ่อย ลด MRT รวม",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

int main() {
  int n; cin >> n;
  vector<int> a(n);
  for (int i = 0; i < n; i++) cin >> a[i];

  sort(a.begin(), a.end());   // เรียงน้อย → มาก

  double sum = 0, cumul = 0;
  for (int i = 0; i < n; i++) {
    cumul += a[i];
    sum += cumul;
  }
  cout << fixed << setprecision(2) << sum / n << endl;
  return 0;
}`,
    complexity: "O(n log n)"
  },
  {
    id: "train-platform",
    title: "Train Platform (Greedy)",
    cat: "Greedy",
    problem: "n รถไฟ แต่ละขบวนมี (arrival, departure)\nหาจำนวน platform น้อยสุดที่ไม่ delay",
    approach: "แยก arrival และ departure → sort ทั้งคู่ → 2 pointer: ถ้ามี arrival ก่อน departure → ต้อง +platform; ถ้า departure ก่อน → -1",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
  int n; cin >> n;
  vector<double> arr(n), dep(n);
  for (int i = 0; i < n; i++) cin >> arr[i] >> dep[i];

  sort(arr.begin(), arr.end());
  sort(dep.begin(), dep.end());

  int i = 0, j = 0, cur = 0, ans = 0;
  while (i < n) {
    if (arr[i] < dep[j]) { cur++; ans = max(ans, cur); i++; }
    else { cur--; j++; }
  }
  cout << ans << endl;
  return 0;
}`,
    complexity: "O(n log n)"
  },
  {
    id: "01-knapsack",
    title: "0/1 Knapsack (DP)",
    cat: "DP",
    problem: "n items (wi, vi), bag W\nหา max value โดยที่ w รวม ≤ W (หยิบหรือไม่หยิบ)",
    approach: "DP table M[i][j] = max value ของ items 1..i กับ capacity j\nM[i][j] = max(M[i-1][j], vi + M[i-1][j-wi])",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
  int n, W;
  cin >> n >> W;
  vector<int> w(n+1), v(n+1);
  for (int i = 1; i <= n; i++) cin >> w[i];
  for (int i = 1; i <= n; i++) cin >> v[i];

  vector<vector<int>> M(n+1, vector<int>(W+1, 0));
  for (int i = 1; i <= n; i++) {
    for (int j = 0; j <= W; j++) {
      M[i][j] = M[i-1][j];                  // ไม่หยิบ
      if (w[i] <= j)
        M[i][j] = max(M[i][j], v[i] + M[i-1][j-w[i]]);
    }
  }
  cout << M[n][W] << endl;

  // trace back items
  int j = W;
  vector<int> picked;
  for (int i = n; i >= 1; i--) {
    if (M[i][j] != M[i-1][j]) { picked.push_back(i); j -= w[i]; }
  }
  reverse(picked.begin(), picked.end());
  for (int x : picked) cout << x << " ";
  return 0;
}`,
    complexity: "Time O(nW), Space O(nW)"
  },
  {
    id: "subset-sum",
    title: "Subset Sum (Backtracking)",
    cat: "Backtracking",
    problem: "หา subset ของ A ที่ผลรวม = target ทั้งหมด\nเช่น A={25,10,9,2,1}, target=12 → {10,2},{9,2,1}",
    approach: "DFS: ที่ index i เลือก 'เอา' หรือ 'ไม่เอา' a[i]\nPrune ถ้า sum > target หรือ i หมด",
    code: `#include <iostream>
#include <vector>
using namespace std;

vector<int> A, cur;
int target;

void solve(int i, int sum) {
  if (sum == target) {
    for (int x : cur) cout << x << " ";
    cout << endl;
    return;
  }
  if (sum > target || i == A.size()) return;
  // เอา a[i]
  cur.push_back(A[i]);
  solve(i+1, sum + A[i]);
  cur.pop_back();
  // ไม่เอา
  solve(i+1, sum);
}

int main() {
  cin >> target;
  int x;
  while (cin >> x) A.push_back(x);
  solve(0, 0);
  return 0;
}`,
    complexity: "O(2ⁿ) worst — แต่ prune ช่วย"
  },
  {
    id: "exhaust-knapsack",
    title: "Exhaustive Knapsack",
    cat: "Exhaustive",
    problem: "n items, bag k → max value (brute force)\nลองทุก subset เลือก subset ที่ valid และ value สูงสุด",
    approach: "Iterate 2ⁿ subsets ผ่าน bitmask — สำหรับ n เล็ก (n ≤ 20)",
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
  int n, k;
  cin >> k >> n;             // หรือรับตามที่อาจารย์กำหนด
  vector<int> v(n), w(n);
  for (int i = 0; i < n; i++) cin >> v[i];
  for (int i = 0; i < n; i++) cin >> w[i];

  int best = 0;
  for (int mask = 0; mask < (1 << n); mask++) {
    int sumW = 0, sumV = 0;
    for (int i = 0; i < n; i++)
      if (mask & (1 << i)) { sumW += w[i]; sumV += v[i]; }
    if (sumW <= k) best = max(best, sumV);
  }
  cout << best << endl;
  return 0;
}`,
    complexity: "O(n · 2ⁿ)"
  },
  {
    id: "n-queens",
    title: "N-Queens (Backtracking)",
    cat: "Backtracking",
    problem: "วาง queen n ตัวบนบอร์ด n×n โดยไม่กินกัน\nแสดงทุก solution",
    approach: "วาง 1 queen ต่อแถว — ลอง col 0..n-1 ตรวจ safe (column, diagonal) → recurse",
    code: `#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

int n;
vector<int> board;
int count_ = 0;

bool safe(int row, int col) {
  for (int i = 0; i < row; i++)
    if (board[i] == col || abs(board[i] - col) == row - i)
      return false;
  return true;
}

void place(int row) {
  if (row == n) {
    count_++;
    cout << "Solution " << count_ << ": ";
    for (int x : board) cout << x+1 << " ";
    cout << endl;
    return;
  }
  for (int col = 0; col < n; col++) {
    if (safe(row, col)) {
      board[row] = col;
      place(row + 1);
      board[row] = -1;
    }
  }
}

int main() {
  cin >> n;
  board.assign(n, -1);
  place(0);
  cout << "Total: " << count_ << endl;
  return 0;
}`,
    complexity: "O(n!) worst — แต่ prune ทำให้เร็วกว่ามาก"
  },
  {
    id: "permutation",
    title: "Permutation (Exhaustive)",
    cat: "Exhaustive",
    problem: "แสดง permutation ของ n เลข เรียงแบบ lexicographic\nเช่น 3 → 1 2 3 / 1 3 2 / 2 1 3 / 2 3 1 / 3 1 2 / 3 2 1",
    approach: "next_permutation() จาก STL — หรือ recursion swap",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
  int n; cin >> n;
  vector<int> a(n);
  for (int i = 0; i < n; i++) a[i] = i + 1;

  do {
    for (int x : a) cout << x << " ";
    cout << endl;
  } while (next_permutation(a.begin(), a.end()));
  return 0;
}`,
    complexity: "O(n! · n)"
  },
  {
    id: "quick-select",
    title: "Quick Select (DAC)",
    cat: "DAC",
    problem: "หาเลขน้อยสุดอันดับ k ใน array (ไม่ต้อง sort)\nเช่น k=3 ใน [1,5,10,4,8,2,6] → 4",
    approach: "Partition แบบ 3-way (L, E, G) — recurse แค่ฝั่งที่มี k",
    code: `#include <iostream>
#include <vector>
using namespace std;

int quickSelect(vector<int>& a, int k) {
  if (a.size() == 1) return a[0];
  int pivot = a[0];
  vector<int> L, E, G;
  for (int x : a) {
    if (x < pivot) L.push_back(x);
    else if (x == pivot) E.push_back(x);
    else G.push_back(x);
  }
  if (k <= (int)L.size()) return quickSelect(L, k);
  if (k <= (int)(L.size() + E.size())) return pivot;
  return quickSelect(G, k - L.size() - E.size());
}

int main() {
  int n, k;
  cin >> n >> k;
  vector<int> a(n);
  for (int i = 0; i < n; i++) cin >> a[i];
  cout << quickSelect(a, k) << endl;
  return 0;
}`,
    complexity: "O(n) avg, O(n²) worst"
  },
  {
    id: "cut-wire",
    title: "Cut Wire Exhaustive",
    cat: "Exhaustive",
    problem: "ตัดสายไฟ L เมตร เป็นชิ้นความยาว [2,3,5] โดยจำนวนชิ้นน้อยสุด ไม่มีเศษ\nL=8: 3+5 = 2 ชิ้น",
    approach: "Try ทุก combination หรือใช้ DP คล้าย coin change",
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main() {
  int L, m;
  cin >> L >> m;
  vector<int> lens(m);
  for (int i = 0; i < m; i++) cin >> lens[i];

  // DP: dp[i] = min pieces to make i; INT_MAX if impossible
  vector<int> dp(L+1, INT_MAX);
  dp[0] = 0;
  for (int i = 1; i <= L; i++)
    for (int l : lens)
      if (i >= l && dp[i-l] != INT_MAX)
        dp[i] = min(dp[i], dp[i-l] + 1);

  cout << (dp[L] == INT_MAX ? -1 : dp[L]) << endl;
  return 0;
}`,
    complexity: "O(L · m)"
  },
  {
    id: "merge-sort",
    title: "Merge Sort (DAC)",
    cat: "DAC",
    problem: "Sort array แบบ stable O(n log n) ทุกกรณี",
    approach: "Divide ครึ่ง → sort แต่ละครึ่ง → merge",
    code: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& a, int l, int m, int r) {
  vector<int> tmp;
  int i = l, j = m + 1;
  while (i <= m && j <= r) {
    if (a[i] <= a[j]) tmp.push_back(a[i++]);
    else tmp.push_back(a[j++]);
  }
  while (i <= m) tmp.push_back(a[i++]);
  while (j <= r) tmp.push_back(a[j++]);
  for (int k = 0; k < (int)tmp.size(); k++) a[l+k] = tmp[k];
}

void mergeSort(vector<int>& a, int l, int r) {
  if (l >= r) return;
  int m = l + (r - l) / 2;
  mergeSort(a, l, m);
  mergeSort(a, m+1, r);
  merge(a, l, m, r);
}

int main() {
  int n; cin >> n;
  vector<int> a(n);
  for (int i = 0; i < n; i++) cin >> a[i];
  mergeSort(a, 0, n-1);
  for (int x : a) cout << x << " ";
  return 0;
}`,
    complexity: "O(n log n) ทุกกรณี, space O(n)"
  },
  {
    id: "binary-search-rec",
    title: "Binary Search Recursive",
    cat: "Search",
    problem: "หา target ใน sorted array — return index หรือ -1",
    approach: "Recursive: เปรียบ mid → recurse left/right",
    code: `#include <iostream>
#include <vector>
using namespace std;

int bs(vector<int>& a, int l, int r, int x) {
  if (l > r) return -1;
  int m = l + (r - l) / 2;
  if (a[m] == x) return m;
  if (a[m] < x) return bs(a, m+1, r, x);
  return bs(a, l, m-1, x);
}

int main() {
  int n, x; cin >> n >> x;
  vector<int> a(n);
  for (int i = 0; i < n; i++) cin >> a[i];
  cout << bs(a, 0, n-1, x) << endl;
}`,
    complexity: "O(log n)"
  },
  {
    id: "dijkstra",
    title: "Dijkstra Shortest Path",
    cat: "Graph",
    problem: "หา shortest path จาก source ไปทุก node\nGraph weighted (no negative)",
    approach: "Priority queue + relaxation\ndist[src] = 0; pop min; update neighbors",
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

int main() {
  int n, m, src;
  cin >> n >> m >> src;
  vector<vector<pair<int,int>>> adj(n);  // {to, w}
  for (int i = 0; i < m; i++) {
    int u, v, w; cin >> u >> v >> w;
    adj[u].push_back({v, w});
    adj[v].push_back({u, w});   // undirected
  }

  vector<int> dist(n, INT_MAX);
  dist[src] = 0;
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  pq.push({0, src});

  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push({dist[v], v});
      }
    }
  }

  for (int i = 0; i < n; i++)
    cout << i << ": " << (dist[i] == INT_MAX ? -1 : dist[i]) << endl;
  return 0;
}`,
    complexity: "O((V+E) log V)"
  },
  {
    id: "bfs",
    title: "BFS Shortest Path (Unweighted)",
    cat: "Graph",
    problem: "หา shortest path จาก src ไป dst (จำนวน edge น้อยสุด)",
    approach: "Queue + visited — เยี่ยมระดับต่อระดับ",
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
  int n, m, src, dst;
  cin >> n >> m >> src >> dst;
  vector<vector<int>> adj(n);
  for (int i = 0; i < m; i++) {
    int u, v; cin >> u >> v;
    adj[u].push_back(v);
    adj[v].push_back(u);
  }

  vector<int> dist(n, -1);
  dist[src] = 0;
  queue<int> q; q.push(src);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) if (dist[v] == -1) {
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  cout << dist[dst] << endl;
  return 0;
}`,
    complexity: "O(V + E)"
  },
  {
    id: "topo-sort",
    title: "Topological Sort (Kahn)",
    cat: "Graph",
    problem: "เรียง vertex ของ DAG ให้ edge u→v มี u อยู่ก่อน v",
    approach: "Kahn: queue ของ node ที่ indeg=0 → ลด indeg ของเพื่อนบ้าน",
    code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
  int n, m; cin >> n >> m;
  vector<vector<int>> adj(n);
  vector<int> indeg(n, 0);
  for (int i = 0; i < m; i++) {
    int u, v; cin >> u >> v;
    adj[u].push_back(v);
    indeg[v]++;
  }

  queue<int> q;
  for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);

  vector<int> order;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
  }

  if ((int)order.size() != n) cout << "CYCLE!" << endl;
  else for (int x : order) cout << x << " ";
  return 0;
}`,
    complexity: "O(V + E)"
  },
  {
    id: "matrix-mult",
    title: "Matrix Multiplication (Naive)",
    cat: "DAC",
    problem: "C = A × B, where A is p×q, B is q×k",
    approach: "Triple loop O(n³)",
    code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
  int p, q, k;
  cin >> p >> q >> k;
  vector<vector<int>> A(p, vector<int>(q));
  vector<vector<int>> B(q, vector<int>(k));
  for (int i = 0; i < p; i++)
    for (int j = 0; j < q; j++) cin >> A[i][j];
  for (int i = 0; i < q; i++)
    for (int j = 0; j < k; j++) cin >> B[i][j];

  vector<vector<int>> C(p, vector<int>(k, 0));
  for (int i = 0; i < p; i++)
    for (int j = 0; j < k; j++)
      for (int x = 0; x < q; x++)
        C[i][j] += A[i][x] * B[x][j];

  for (auto& row : C) {
    for (int x : row) cout << x << " ";
    cout << endl;
  }
  return 0;
}`,
    complexity: "O(p·q·k) → O(n³) เมื่อ matrix square"
  },
  // ============================================================
  // จาก "รวม code midterm.pdf" — เฉลย C++ ที่ instructor KMUTNB ให้
  // ============================================================
  {
    id: "shell-sort-midterm",
    title: "Shell Sort (รวม code midterm)",
    cat: "Sort",
    problem: "เรียงข้อมูลด้วย Shell Sort พร้อมพิมพ์อาเรย์หลังแต่ละ gap pass",
    approach: "ใช้ gap sequence (Shell's n/2 ÷ 2 หรือ Knuth/Sedgewick) — เป็น Insertion Sort ที่กระโดดทีละ gap",
    code: `#include <iostream>
#include <vector>
using namespace std;

void shellSort(vector<int>& arr) {
  int n = arr.size();
  for (int gap = n / 2; gap > 0; gap /= 2) {
    for (int i = gap; i < n; i++) {
      int temp = arr[i];
      int j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    // พิมพ์อาเรย์หลังแต่ละ gap (ตามชีท)
    cout << "Array after gap " << gap << ": ";
    for (int x : arr) cout << x << " ";
    cout << "\\n";
  }
}

int main() {
  vector<int> arr = {16, 25, 2, 54, 36, 9, 12, 66};
  shellSort(arr);
  return 0;
}`,
    complexity: "O(n^1.3) - O(n²) ขึ้นกับ gap sequence"
  },
  {
    id: "quick-sort-median-midterm",
    title: "Quick Sort with Median-of-Three (รวม code midterm)",
    cat: "Sort",
    problem: "Quick Sort ที่ใช้ median-of-three pivot — กัน worst case O(n²) เมื่อข้อมูล sorted",
    approach: "เรียง a[low], a[mid], a[high] ก่อน → median อยู่ที่ a[mid] → swap ไป a[high-1] → ใช้เป็น pivot",
    code: `#include <iostream>
#include <vector>
using namespace std;

void printArray(const vector<int>& a) {
  for (int x : a) cout << x << " ";
  cout << "\\n";
}

int medianOfThree(vector<int>& arr, int low, int high) {
  int mid = low + (high - low) / 2;
  if (arr[low] > arr[mid]) swap(arr[low], arr[mid]);
  if (arr[low] > arr[high]) swap(arr[low], arr[high]);
  if (arr[mid] > arr[high]) swap(arr[mid], arr[high]);
  swap(arr[mid], arr[high - 1]);   // hide pivot at high-1
  return arr[high - 1];
}

int partitionMedian(vector<int>& arr, int low, int high) {
  int pivot = medianOfThree(arr, low, high);
  int i = low, j = high - 1;
  while (true) {
    while (arr[++i] < pivot);
    while (arr[--j] > pivot);
    if (i < j) swap(arr[i], arr[j]);
    else break;
  }
  swap(arr[i], arr[high - 1]);   // restore pivot
  return i;
}

void quickSortMedian(vector<int>& arr, int low, int high) {
  if (low + 2 <= high) {
    int pi = partitionMedian(arr, low, high);
    cout << "Pivot index: " << pi << ", Pivot value: " << arr[pi] << "\\n";
    cout << "Array state: "; printArray(arr);
    quickSortMedian(arr, low, pi - 1);
    quickSortMedian(arr, pi + 1, high);
  } else if (low < high) {
    if (arr[low] > arr[high]) swap(arr[low], arr[high]);
  }
}

int main() {
  vector<int> arr = {5, 2, 9, 1, 5, 6};
  quickSortMedian(arr, 0, arr.size() - 1);
  cout << "Sorted: "; printArray(arr);
  return 0;
}`,
    complexity: "average O(n log n) — worst-case ยัง O(n²) แต่หา input ที่ trigger ยากขึ้น"
  },
  {
    id: "quick-select-median-midterm",
    title: "Quick Select with Median-of-Three (รวม code midterm)",
    cat: "D&C",
    problem: "หาเลขน้อยสุดอันดับ k ใน arr — ใช้ partition แบบ median-of-three",
    approach: "เหมือน Quick Sort แต่ recurse เฉพาะฝั่งที่มี k → average O(n)",
    code: `#include <iostream>
#include <vector>
using namespace std;

int medianOfThree(vector<int>& arr, int low, int high) {
  int mid = low + (high - low) / 2;
  if (arr[low] > arr[mid]) swap(arr[low], arr[mid]);
  if (arr[low] > arr[high]) swap(arr[low], arr[high]);
  if (arr[mid] > arr[high]) swap(arr[mid], arr[high]);
  swap(arr[mid], arr[high - 1]);
  return arr[high - 1];
}

int partition(vector<int>& arr, int low, int high) {
  int pivot = medianOfThree(arr, low, high);
  int i = low, j = high - 1;
  while (true) {
    while (arr[++i] < pivot);
    while (arr[--j] > pivot);
    if (i < j) swap(arr[i], arr[j]);
    else break;
  }
  swap(arr[i], arr[high - 1]);
  return i;
}

int quickSelect(vector<int>& arr, int low, int high, int k) {
  if (low == high) return arr[low];
  if (low + 2 > high) {
    if (arr[low] > arr[high]) swap(arr[low], arr[high]);
    return arr[low + k - 1];
  }
  int p = partition(arr, low, high);
  int leftSize = p - low + 1;
  if (k == leftSize) return arr[p];     // case k = Pivot position
  if (k < leftSize)
    return quickSelect(arr, low, p - 1, k);
  return quickSelect(arr, p + 1, high, k - leftSize);
}

int main() {
  int n, k; cin >> n >> k;
  vector<int> arr(n);
  for (int& x : arr) cin >> x;
  cout << quickSelect(arr, 0, n - 1, k) << "\\n";
  return 0;
}`,
    complexity: "average O(n), worst O(n²)"
  },
  {
    id: "karatsuba-midterm",
    title: "Karatsuba Integer Multiplication (รวม code midterm)",
    cat: "D&C",
    problem: "คูณเลข 2 ตัว a, b — ใช้ Karatsuba ลดจำนวนการคูณจาก 4 → 3 ครั้ง per level",
    approach: "X·Y = z₂·10^(2m) + z₁·10^m + z₀ โดย z₁ = (a+b)(c+d) − z₂ − z₀",
    code: `#include <iostream>
#include <string>
using namespace std;

long long pow10(int n) {
  long long r = 1; while (n--) r *= 10; return r;
}

long long karatsuba(long long x, long long y, int depth = 0) {
  string indent(depth * 2, ' ');
  cout << indent << "Karatsuba(" << x << ", " << y << ")\\n";

  if (x < 10 || y < 10) {
    cout << indent << "Base: " << x << "*" << y << " = " << x*y << "\\n";
    return x * y;
  }

  int n = max((int)to_string(x).size(), (int)to_string(y).size());
  if (n % 2) ++n;
  int m = n / 2;
  long long p = pow10(m);

  long long a = x / p, b = x % p;
  long long c = y / p, d = y % p;

  cout << indent << "Split x=" << x << " → (" << a << ", " << b << ")\\n";
  cout << indent << "Split y=" << y << " → (" << c << ", " << d << ")\\n";

  long long z2 = karatsuba(a, c, depth + 1);
  long long z0 = karatsuba(b, d, depth + 1);
  long long z1 = karatsuba(a + b, c + d, depth + 1) - z2 - z0;

  long long result = z2 * pow10(2*m) + z1 * p + z0;
  cout << indent << "Result: " << result << "\\n";
  return result;
}

int main() {
  long long a, b; cin >> a >> b;
  cout << karatsuba(a, b) << "\\n";
  return 0;
}`,
    complexity: "O(n^log₂3) ≈ O(n^1.585) เมื่อ n = #digits — ดีกว่า schoolbook O(n²)"
  },
  {
    id: "strassen-midterm",
    title: "Strassen Matrix Multiplication (รวม code midterm)",
    cat: "D&C",
    problem: "คูณเมตริกซ์ A·B โดยใช้ Strassen — 7 multiplications แทน 8 ของ DAC ปกติ",
    approach: "M₁..M₇ ครอบคลุม C₁₁ C₁₂ C₂₁ C₂₂ — ต้อง pad matrix ให้เป็น 2^k × 2^k ก่อน",
    code: `#include <iostream>
#include <vector>
using namespace std;
using Mat = vector<vector<long long>>;

int nextPow2(int x) { int p = 1; while (p < x) p <<= 1; return p; }

Mat resize(const Mat& m, int n) {
  Mat r(n, vector<long long>(n, 0));
  for (size_t i = 0; i < m.size(); i++)
    for (size_t j = 0; j < m[0].size(); j++)
      r[i][j] = m[i][j];
  return r;
}

Mat add(const Mat& A, const Mat& B) {
  int n = A.size();
  Mat C(n, vector<long long>(n));
  for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) C[i][j] = A[i][j] + B[i][j];
  return C;
}

Mat sub(const Mat& A, const Mat& B) {
  int n = A.size();
  Mat C(n, vector<long long>(n));
  for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) C[i][j] = A[i][j] - B[i][j];
  return C;
}

Mat strassen(const Mat& A, const Mat& B) {
  int n = A.size();
  if (n == 1) return {{A[0][0] * B[0][0]}};

  int k = n / 2;
  Mat A11(k, vector<long long>(k)), A12(k, vector<long long>(k)),
      A21(k, vector<long long>(k)), A22(k, vector<long long>(k));
  Mat B11(k, vector<long long>(k)), B12(k, vector<long long>(k)),
      B21(k, vector<long long>(k)), B22(k, vector<long long>(k));
  for (int i = 0; i < k; i++) for (int j = 0; j < k; j++) {
    A11[i][j] = A[i][j];        A12[i][j] = A[i][j+k];
    A21[i][j] = A[i+k][j];      A22[i][j] = A[i+k][j+k];
    B11[i][j] = B[i][j];        B12[i][j] = B[i][j+k];
    B21[i][j] = B[i+k][j];      B22[i][j] = B[i+k][j+k];
  }

  Mat M1 = strassen(add(A11, A22), add(B11, B22));
  Mat M2 = strassen(add(A21, A22), B11);
  Mat M3 = strassen(A11, sub(B12, B22));
  Mat M4 = strassen(A22, sub(B21, B11));
  Mat M5 = strassen(add(A11, A12), B22);
  Mat M6 = strassen(sub(A21, A11), add(B11, B12));
  Mat M7 = strassen(sub(A12, A22), add(B21, B22));

  Mat C11 = add(sub(add(M1, M4), M5), M7);
  Mat C12 = add(M3, M5);
  Mat C21 = add(M2, M4);
  Mat C22 = add(sub(add(M1, M3), M2), M6);

  Mat C(n, vector<long long>(n));
  for (int i = 0; i < k; i++) for (int j = 0; j < k; j++) {
    C[i][j] = C11[i][j];        C[i][j+k] = C12[i][j];
    C[i+k][j] = C21[i][j];      C[i+k][j+k] = C22[i][j];
  }
  return C;
}

int main() {
  // ตัวอย่าง 2×2
  Mat A = {{1,3},{7,5}};
  Mat B = {{6,8},{4,2}};
  Mat C = strassen(A, B);
  for (auto& row : C) {
    for (auto x : row) cout << x << " ";
    cout << "\\n";
  }
  return 0;
}`,
    complexity: "O(n^log₂7) ≈ O(n^2.807)"
  },
  {
    id: "maxima-set-midterm",
    title: "Maxima Set DAC (รวม code midterm)",
    cat: "D&C",
    problem: "หา maxima set ของ n จุดบน plane (จุดที่ไม่ถูก dominate)",
    approach: "Sort by x → split mid → recurse → combine โดยตัด M₁ ที่ถูก M₂ dominate",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Point { long long x, y; };

static bool lexLess(const Point& a, const Point& b) {
  if (a.x != b.x) return a.x < b.x;
  return a.y < b.y;
}

vector<Point> maximaSet(vector<Point> S) {
  if (S.size() <= 1) return S;
  sort(S.begin(), S.end(), lexLess);

  // split at median by x
  int m = S.size() / 2;
  vector<Point> L(S.begin(), S.begin() + m);
  vector<Point> G(S.begin() + m, S.end());

  auto M1 = maximaSet(L);
  auto M2 = maximaSet(G);

  // combine: ตัดจาก M1 จุดที่ถูก M2 dominate (q.y > r.y ใด ๆ)
  long long maxY = 0;
  for (auto& q : M2) maxY = max(maxY, q.y);

  vector<Point> result;
  for (auto& r : M1) if (r.y > maxY) result.push_back(r);
  result.insert(result.end(), M2.begin(), M2.end());
  return result;
}

int main() {
  // ตัวอย่างชีท: P = {(1,4),(2,6),(3,1),(4,5),(5,7),(6,9),(7,2),(8,6),(9,3)}
  vector<Point> S = {{1,4},{2,6},{3,1},{4,5},{5,7},{6,9},{7,2},{8,6},{9,3}};
  auto M = maximaSet(S);
  for (auto& p : M) cout << "(" << p.x << "," << p.y << ")\\n";
  return 0;
}`,
    complexity: "O(n log n) — recursion T(n) = 2T(n/2) + O(n)"
  },
  {
    id: "binary-search-rec-midterm",
    title: "Binary Search (Iter + Recursive) — รวม code midterm",
    cat: "Search",
    problem: "ค้นหา target ใน sorted array — iterative + recursive version",
    approach: "Recursive: T(n) = T(n/2) + c → O(log n). Iterative: while loop เดียวกัน",
    code: `#include <iostream>
#include <vector>
using namespace std;

// iterative
int binarySearch(const vector<int>& arr, int target) {
  int l = 0, r = arr.size() - 1;
  while (l <= r) {
    int mid = l + (r - l) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}

// recursive
int binarySearchRec(const vector<int>& arr, int l, int r, int target) {
  if (l > r) return -1;
  int mid = l + (r - l) / 2;
  if (arr[mid] == target) return mid;
  if (arr[mid] < target)
    return binarySearchRec(arr, mid + 1, r, target);
  return binarySearchRec(arr, l, mid - 1, target);
}

int main() {
  vector<int> a = {1, 3, 5, 7, 9, 11, 13, 15};
  cout << binarySearch(a, 7) << " " << binarySearchRec(a, 0, a.size()-1, 7) << "\\n";
  return 0;
}`,
    complexity: "O(log n) ทั้งสอง — recursion มี call stack O(log n)"
  },
  {
    id: "interpolation-search-midterm",
    title: "Interpolation Search (Iter + Recursive) — รวม code midterm",
    cat: "Search",
    problem: "ค้นหา target ใน sorted array โดยประมาณตำแหน่งจากค่า — ดีกว่า binary เมื่อข้อมูลกระจายสม่ำเสมอ",
    approach: "pos = low + ((high-low)·(target-A[low]))/(A[high]-A[low])",
    code: `#include <iostream>
#include <vector>
using namespace std;

int interpolationSearch(const vector<int>& a, int target) {
  int low = 0, high = a.size() - 1;
  while (low <= high && target >= a[low] && target <= a[high]) {
    if (low == high) {
      if (a[low] == target) return low;
      return -1;
    }
    int pos = low + ((double)(high - low) / (a[high] - a[low])) * (target - a[low]);
    if (a[pos] == target) return pos;
    if (a[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}

int interpolationSearchRec(const vector<int>& a, int low, int high, int target) {
  if (low <= high && target >= a[low] && target <= a[high]) {
    if (low == high) return (a[low] == target) ? low : -1;
    int pos = low + ((double)(high - low) / (a[high] - a[low])) * (target - a[low]);
    if (a[pos] == target) return pos;
    if (a[pos] < target) return interpolationSearchRec(a, pos+1, high, target);
    return interpolationSearchRec(a, low, pos-1, target);
  }
  return -1;
}

int main() {
  vector<int> a = {10, 12, 13, 16, 18, 19, 20, 21, 22, 23, 24, 33};
  cout << interpolationSearch(a, 22) << "\\n";
  return 0;
}`,
    complexity: "O(log log n) เมื่อข้อมูลกระจายสม่ำเสมอ, O(n) worst"
  },
  {
    id: "find-min-max-dac-midterm",
    title: "Find Min/Max — Iter + Recursive + DAC (รวม code midterm)",
    cat: "D&C",
    problem: "หาค่าน้อยสุด/มากสุดใน array 3 แบบ: linear, recursive (linear), DAC",
    approach: "linear: O(n). recursive linear: T(n) = T(n-1) + c → O(n). DAC: T(n) = 2T(n/2) + c → O(n)",
    code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// linear iterative
int findMin(const vector<int>& a) {
  int m = a[0];
  for (int x : a) if (x < m) m = x;
  return m;
}

// recursive (linear)
int findMinRec(const vector<int>& a, int n) {
  if (n == 1) return a[0];
  int rest = findMinRec(a, n - 1);
  return min(rest, a[n-1]);
}

// DAC
int findMinDAC(const vector<int>& a, int l, int r) {
  if (l == r) return a[l];
  int mid = l + (r - l) / 2;
  int lm = findMinDAC(a, l, mid);
  int rm = findMinDAC(a, mid + 1, r);
  return min(lm, rm);
}

int main() {
  vector<int> a = {7, 3, 9, 1, 5, 8};
  cout << findMin(a) << " "
       << findMinRec(a, a.size()) << " "
       << findMinDAC(a, 0, a.size()-1) << "\\n";
  return 0;
}`,
    complexity: "ทั้งหมด O(n) — comparisons เท่ากัน แต่ DAC tree-shaped recursion"
  },
  {
    id: "merge-sort-trace-midterm",
    title: "Merge Sort พร้อม trace (รวม code midterm)",
    cat: "Sort",
    problem: "Merge Sort + พิมพ์ split/merge step ทุกชั้น (ตามชีท)",
    approach: "Divide → recurse → merge. trace by print before/after each merge",
    code: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& a, int l, int m, int r) {
  int n1 = m - l + 1, n2 = r - m;
  vector<int> L(n1), R(n2);
  for (int i = 0; i < n1; i++) L[i] = a[l + i];
  for (int j = 0; j < n2; j++) R[j] = a[m + 1 + j];

  cout << "Merging [";
  for (int x : L) cout << x << " ";
  cout << "] + [";
  for (int x : R) cout << x << " ";
  cout << "]\\n";

  int i = 0, j = 0, k = l;
  while (i < n1 && j < n2)
    a[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
  while (i < n1) a[k++] = L[i++];
  while (j < n2) a[k++] = R[j++];

  cout << "  → ";
  for (int p = l; p <= r; p++) cout << a[p] << " ";
  cout << "\\n";
}

void mergeSort(vector<int>& a, int l, int r) {
  if (l >= r) return;
  int m = l + (r - l) / 2;
  mergeSort(a, l, m);
  mergeSort(a, m + 1, r);
  merge(a, l, m, r);
}

int main() {
  vector<int> a = {16, 25, 2, 54, 36, 9, 12, 66};
  mergeSort(a, 0, a.size() - 1);
  cout << "Sorted: ";
  for (int x : a) cout << x << " ";
  return 0;
}`,
    complexity: "O(n log n) — comparison-based, stable"
  },
];

Lessons10["code-solutions"] = function () {
  const [cat, setCat] = useS10('all');
  const [open, setOpen] = useS10({});
  const [copied, setCopied] = useS10(null);
  const cats = ['all', ...Array.from(new Set(CODE_SOLUTIONS.map(s => s.cat)))];
  const list = cat === 'all' ? CODE_SOLUTIONS : CODE_SOLUTIONS.filter(s => s.cat === cat);

  const copy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">💾 Code Solutions Bank — เฉลยโค้ดเต็ม</div>
        เฉลยโค้ด C++ <b>ครบทุก assignment</b> ที่อาจารย์มอบให้ — copy ไปส่งได้เลย<br />
        แต่ละข้อมี: <b>โจทย์ · approach · code · complexity</b>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '14px 0' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ background: cat === c ? 'var(--accent)' : 'var(--bg-2)', color: cat === c ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 16, cursor: 'pointer', fontSize: 13, fontWeight: cat === c ? 600 : 400 }}>
            {c.toUpperCase()} ({c === 'all' ? CODE_SOLUTIONS.length : CODE_SOLUTIONS.filter(s => s.cat === c).length})
          </button>
        ))}
      </div>

      {list.map(s => (
        <div key={s.id} style={{ background: 'var(--bg-2)', borderRadius: 10, marginBottom: 12, overflow: 'hidden' }}>
          <div onClick={() => setOpen({ ...open, [s.id]: !open[s.id] })}
            style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: open[s.id] ? '1px solid var(--border)' : 'none' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{s.cat.toUpperCase()}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-0)' }}>{s.title}</div>
            </div>
            <span style={{ color: 'var(--text-2)', transform: open[s.id] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s' }}>▶</span>
          </div>
          {open[s.id] && (
            <div style={{ padding: 14 }}>
              <div style={{ background: 'var(--bg-1)', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--accent-2)', fontWeight: 700, marginBottom: 4 }}>📋 PROBLEM</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{s.problem}</div>
              </div>
              <div style={{ background: 'var(--bg-1)', padding: 10, borderRadius: 6, marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, marginBottom: 4 }}>💡 APPROACH</div>
                <div style={{ fontSize: 13, color: 'var(--text-1)', whiteSpace: 'pre-wrap' }}>{s.approach}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={() => copy(s.id, s.code)}
                  style={{ position: 'absolute', right: 8, top: 8, background: copied === s.id ? '#10b981' : 'var(--bg-3)', color: copied === s.id ? '#000' : 'var(--text-1)', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600, zIndex: 1 }}>
                  {copied === s.id ? '✓ Copied!' : '📋 Copy'}
                </button>
                <pre className="code" style={{ marginTop: 0 }}>{s.code}</pre>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-2)' }}>
                <b style={{ color: 'var(--accent-2)' }}>Complexity:</b> {s.complexity}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="callout success">
        <div className="ttl">⚠️ Tips ใช้โค้ด</div>
        <ul style={{ margin: 0 }}>
          <li>อ่าน <b>approach</b> ให้เข้าใจก่อน copy — อาจารย์มักถาม "ทำไมถึงทำงั้น"</li>
          <li>ปรับ input/output format ให้ตรงโจทย์ของอาจารย์</li>
          <li>เพิ่ม comment เป็นภาษาตัวเอง — แสดงว่าเข้าใจจริง</li>
          <li>ลอง trace ด้วย sample input ก่อนส่ง</li>
        </ul>
      </div>
    </React.Fragment>
  );
};

/* ============================================================
   MOCK EXAM 2 & 3 — additional sets
============================================================ */
const MOCK_2 = [
  { q: "1. หา Big-O: <code>for(i=0;i&lt;n;i++) for(j=1;j&lt;n;j*=2) sum++;</code>", pts: 6, a: "O(n log n)", explain: "outer n, inner log n" },
  { q: "2. หา Big-O: <code>for(i=n;i&gt;1;i/=2) sum++;</code>", pts: 5, a: "O(log n)", explain: "i หาร 2 ทุกครั้ง" },
  { q: "3. Master Theorem: T(n) = 3T(n/3) + n", pts: 6, a: "O(n log n)", explain: "log₃3 = 1 = d → Case 2" },
  { q: "4. T(n) = 4T(n/2) + n²", pts: 6, a: "O(n² log n)", explain: "log₂4 = 2 = d → Case 2" },
  { q: "5. Recurrence: T(n) = T(n-1) + n²", pts: 6, a: "O(n³)", explain: "1² + 2² + ... + n² = n(n+1)(2n+1)/6 = O(n³)" },
  { q: "6. Insertion sort [29,10,14,37,13] หลัง 2 pass", pts: 6, a: "[10,14,29,37,13]", explain: "i=1: insert 10; i=2: insert 14" },
  { q: "7. Binary search หา 16 ใน [2,5,8,12,16,23,38,56,72,91] กี่ comparison?", pts: 5, a: "2 ครั้ง", explain: "mid=4(16) เจอ! (lo+hi)/2 = 4" },
  { q: "8. Quick sort partition [7,2,1,6,8,5,3,4] pivot=4", pts: 8, a: "[2,1,3,4,8,5,7,6]", explain: "≤4: 2,1,3; pivot=4; >4: 8,5,7,6" },
  { q: "9. Merge sorted [2,5,8] + [1,3,6,9]", pts: 5, a: "[1,2,3,5,6,8,9]", explain: "เปรียบหัวเลือกตัวน้อย" },
  { q: "10. Quick Select k=4 ใน [10,5,2,8,1,7,3] pivot=ตัวแรก", pts: 10, a: "5", explain: "pivot=10: L=[5,2,8,1,7,3], E=[10], G=[]. k=4 ≤ |L|=6 → recurse L; pivot=5: L=[2,1,3], E=[5], G=[8,7]. |L|=3, |L|+|E|=4. k=4>3 และ k=4≤4 → ตอบ pivot = 5 (ตรวจ sorted [1,2,3,5,7,8,10] อันดับ 4 = 5)" },
  { q: "11. Strassen recurrence?", pts: 4, a: "T(n) = 7T(n/2) + n² → O(n^2.807)", explain: "Master: a=7,b=2,d=2; log₂7≈2.807>d → Case 1 → O(n^log₂7)" },
  { q: "12. Karatsuba recurrence?", pts: 4, a: "T(n) = 3T(n/2) + n → O(n^1.585)", explain: "Master: a=3,b=2,d=1; log₂3≈1.585>d → Case 1 → O(n^log₂3)" },
  { q: "13. Fibonacci F(10) = ?", pts: 4, a: "55", explain: "0,1,1,2,3,5,8,13,21,34,55" },
  { q: "14. Heap sort: build max-heap จาก [4,10,3,5,1]", pts: 8, a: "[10,5,3,4,1]", explain: "เริ่ม heapify จาก index n/2-1 = 1: max(10,5,1)=10 → swap 10,4 → re-heapify subtree" },
  { q: "15. Stable sort กี่ตัวจาก Bubble/Selection/Insertion/Merge/Quick/Heap?", pts: 5, a: "3 ตัว — Bubble, Insertion, Merge", explain: "Selection/Quick/Heap ไม่ stable" },
  { q: "16. Recurrence Tower of Hanoi n disks?", pts: 4, a: "T(n)=2T(n-1)+1 = 2ⁿ-1", explain: "ย้าย n-1 จาก src→aux (T(n-1)), ย้าย disk ใหญ่สุด src→dst (1), ย้าย n-1 aux→dst (T(n-1)) → 2T(n-1)+1" },
  { q: "17. DFS [adj 0:[1,2], 1:[3], 2:[3,4], 3:[], 4:[]] จาก 0 — order?", pts: 8, a: "0,1,3,2,4", explain: "ลงลึก 0→1→3 → backtrack → 2→3(visited)→4" },
];

const MOCK_3 = [
  { q: "1. Fractional Knapsack W=20, items v=[60,100,120] w=[10,20,30] → max value?", pts: 10, a: "110", explain: "v/w = 6, 5, 4 → ใส่ item 1 เต็ม (w=10, v=60), W เหลือ 10; ใส่ item 2 เศษ 10/20 = 0.5 → v=50; รวม 60+50 = 110" },
  { q: "2. 0/1 Knapsack: W=10, w=[3,4,5,6], v=[2,3,4,5] → max?", pts: 12, a: "8", explain: "เลือก item 2 (w=4,v=3) + item 4 (w=6,v=5) → w=10, v=8 (best); subset อื่น: {1,4}=w9,v7; {2,3}=w9,v7; {1,2,3}=w12 เกิน" },
  { q: "3. Activity Selection (s,f): (1,3),(2,5),(4,7),(1,8),(5,9),(8,10) — กี่กิจกรรม?", pts: 10, a: "3", explain: "เรียงตาม f: (1,3),(2,5),(4,7),(1,8),(5,9),(8,10). เลือก: (1,3)→(4,7)→(8,10) = 3" },
  { q: "4. Train platform [(2.0,2.5),(2.1,3.4),(3.0,4.0),(3.2,4.5)] — กี่ platform?", pts: 10, a: "3", explain: "เวลา 2.1-2.5: 2 พร้อมกัน; เพิ่ม 3.0 ตอน 2.1-3.4 ยังอยู่ = 2; เพิ่ม 3.2 ตอน 3.0-3.4 ยังอยู่ = 3" },
  { q: "5. Coin Change {1,5,10,25} จ่าย 67 — Greedy vs DP optimal?", pts: 6, a: "Greedy: 25+25+10+5+1+1 = 6 เหรียญ (optimal)", explain: "Canonical coin → Greedy = DP" },
  { q: "6. N-Queens n=4 → กี่ solutions และเซตคืออะไร?", pts: 6, a: "2: (2,4,1,3), (3,1,4,2)", explain: "(c1,c2,c3,c4) = column ของ queen แต่ละ row; ลอง 4!=24 placement แต่ผ่าน safe() แค่ 2 — เป็น mirror image ของกัน" },
  { q: "7. Subset sum {3,4,5,2,1} target=8 — กี่เซต?", pts: 8, a: "3 → {3,4,1},{3,5},{5,2,1}", explain: "pair: {3,5}; triples: {3,4,1},{5,2,1}; quads: ผลรวมน้อยสุด 1+2+3+4=10 >8 → ไม่มี" },
  { q: "8. Permutation ของ 4 ตัวมีกี่แบบ?", pts: 4, a: "24 (4!)", explain: "n! = 4×3×2×1 = 24" },
  { q: "9. BFS หา shortest path 0→5 ใน {0:[1,2],1:[3],2:[3,4],3:[5],4:[5]} ยาวเท่าไร?", pts: 8, a: "3 (0→2→4→5 หรือ 0→1→3→5)", explain: "BFS เยี่ยมระดับ — level 3 เจอ 5" },
  { q: "10. Cycle in directed graph {A→B, B→C, C→A, C→D}?", pts: 6, a: "มี (A→B→C→A)", explain: "DFS เจอ back edge C→A" },
  { q: "11. Topological sort {A→B, A→C, B→D, C→D, D→E}?", pts: 8, a: "A,B,C,D,E (หรือ A,C,B,D,E)", explain: "indeg A=0 เริ่ม; B,C parallel; D หลังทั้ง B,C; E สุดท้าย" },
  { q: "12. Dijkstra A→D ใน graph A→B(2), A→C(5), B→C(1), B→D(4), C→D(2) — shortest?", pts: 10, a: "5 (A→B→C→D = 2+1+2)", explain: "เทียบ A→B→D=6, A→C→D=7" },
  { q: "13. MST ของ K4 (4 nodes, ทุก edge=1) — weight รวม?", pts: 6, a: "3", explain: "V-1 = 3 edges, ทุก edge=1 → 3" },
  { q: "14. AVL: insert ลำดับ 10, 20, 30 → root?", pts: 6, a: "20 (RR rotation)", explain: "BF(10) = -2 → left rotate" },
  { q: "15. AVL: insert ลำดับ 30, 20, 10 → root?", pts: 6, a: "20 (LL rotation)", explain: "BF(30) = +2 → right rotate" },
  { q: "16. Hash linear probing m=11, insert 18,41,22,44 — table position ของ 44?", pts: 8, a: "1", explain: "44%11=0 ชน 22 → probe → 1 ว่าง" },
  { q: "17. KMP LPS ของ 'ABABAB'?", pts: 8, a: "[0,0,1,2,3,4]", explain: "longest proper prefix-suffix ของแต่ละ prefix" },
  { q: "18. Huffman freq {A:45, B:13, C:12, D:16, E:9, F:5} — code length รวม (ของทุกตัว 1 ครั้ง)?", pts: 10, a: "1+3+3+3+4+4 = 18 bits", explain: "build tree min-heap" },
];

Lessons10["mock-exam-2"] = function () {
  return MockExamView(MOCK_2, "Mock Midterm Set 2", 90);
};
Lessons10["mock-exam-3"] = function () {
  return MockExamView(MOCK_3, "Mock Final Set 2", 90);
};

function MockExamView(exam, title, mins) {
  const [showA, setShowA] = useS10({});
  const [seconds, setSeconds] = useS10(0);
  const [running, setRunning] = useS10(false);

  useE10(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const totalPts = exam.reduce((s, q) => s + q.pts, 0);

  return (
    <React.Fragment>
      <div className="callout info">
        <div className="ttl">📝 {title} — {mins} นาที, {totalPts} คะแนน</div>
        ทำโดยจับเวลา + ห้ามเปิดเฉลย → ตรวจหลังหมดเวลา → ดูข้อผิดและย้อนไปอ่านบท
      </div>

      <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 28, fontFamily: 'monospace', color: seconds > mins * 60 ? '#f87171' : 'var(--accent-2)', fontWeight: 700 }}>⏱️ {fmt(seconds)}</div>
        <button onClick={() => setRunning(!running)}
          style={{ background: running ? 'var(--bg-3)' : 'var(--accent)', color: running ? 'var(--text-0)' : '#000', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={() => { setSeconds(0); setRunning(false); setShowA({}); }}
          style={{ background: 'transparent', color: 'var(--text-2)', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
          🔄 Reset
        </button>
        <span style={{ color: 'var(--text-2)', fontSize: 13 }}>เป้า: {mins} นาที</span>
      </div>

      {exam.map((q, i) => (
        <div key={i} style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: q.q }} />
            <span style={{ background: 'var(--bg-3)', padding: '2px 10px', borderRadius: 12, fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{q.pts}</span>
          </div>
          {!showA[i] ? (
            <button onClick={() => setShowA({ ...showA, [i]: true })}
              style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
              ดูเฉลย
            </button>
          ) : (
            <div style={{ marginTop: 8, padding: 10, background: 'var(--bg-1)', borderRadius: 6, borderLeft: '3px solid #10b981' }}>
              <div style={{ color: '#10b981', fontWeight: 600, fontFamily: 'monospace' }}>✓ {q.a}</div>
              {q.explain && <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>{q.explain}</div>}
            </div>
          )}
        </div>
      ))}
    </React.Fragment>
  );
}

/* ============================================================
   TIMED DRILL — จับเวลาแก้โจทย์
============================================================ */
const TIMED_PROBLEMS = [
  { topic: "Big-O", q: "T(n) = 8T(n/2) + n³", a: "O(n³ log n)", time: 60, hint: "Master: log₂8=3=d → Case 2" },
  { topic: "Big-O", q: "for(i=1;i&lt;n;i*=2) for(j=0;j&lt;n;j++) cnt++;", a: "O(n log n)", time: 60, hint: "outer log, inner n" },
  { topic: "Sort", q: "Bubble sort 1 pass [3,8,2,5,1]", a: "[3,2,5,1,8]", time: 90, hint: "8 ลอยไปขวา" },
  { topic: "Sort", q: "Quick sort partition [4,1,7,3,9,5] pivot=5", a: "[4,1,3,5,9,7]", time: 120, hint: "≤5 ซ้าย, >5 ขวา" },
  { topic: "Search", q: "Binary search 23 ใน [5,10,15,20,25,30] กี่ครั้ง?", a: "3", time: 90, hint: "mid=2(15) → mid=4(25) → mid=3(20)? → 23 ไม่อยู่ → -1" },
  { topic: "DAC", q: "Quick Select k=2 ใน [5,1,8,3,2] pivot=ตัวแรก (5)", a: "2", time: 180, hint: "L=[1,3,2], E=[5], G=[8]. k=2 ≤ |L|=3 → recurse L" },
  { topic: "DAC", q: "Strassen ลด multiplication จาก 8 → ?", a: "7", time: 30, hint: "M1-M7" },
  { topic: "Greedy", q: "Coin {1,5,10,25} จ่าย 42 — กี่เหรียญ?", a: "5 (25+10+5+1+1)", time: 60, hint: "" },
  { topic: "Greedy", q: "Activity (1,4),(3,5),(0,6),(5,7),(8,9),(5,9) เรียงตาม f — เลือกได้กี่?", a: "3 — (1,4),(5,7),(8,9)", time: 180, hint: "" },
  { topic: "DP", q: "Fibonacci F(8)", a: "21", time: 60, hint: "0,1,1,2,3,5,8,13,21" },
  { topic: "DP", q: "0/1 Knapsack W=4, w=[2,3], v=[3,4] — max?", a: "4", time: 180, hint: "เลือก item 2 (w=3,v=4)" },
  { topic: "Graph", q: "BFS จาก 0 ใน {0:[1,2],1:[3],2:[3]}", a: "0,1,2,3", time: 90, hint: "ระดับต่อระดับ" },
  { topic: "Graph", q: "Dijkstra: A→B(3), A→C(1), C→B(1), B→D(4), C→D(6) — A→D?", a: "6 (A→C→B→D = 1+1+4)", time: 180, hint: "" },
  { topic: "Backtracking", q: "Permutation ของ {1,2,3} กี่แบบ?", a: "6", time: 30, hint: "3!" },
  { topic: "Backtracking", q: "Subset {2,4,1} target=5 กี่เซต?", a: "1 → {4,1}", time: 120, hint: "" },
];

Lessons10["timed-drill"] = function () {
  const [topic, setTopic] = useS10('all');
  const [duration, setDuration] = useS10(10);   // minutes
  const [phase, setPhase] = useS10('setup');   // setup / running / done
  const [pool, setPool] = useS10([]);
  const [idx, setIdx] = useS10(0);
  const [score, setScore] = useS10({ correct: 0, wrong: 0, skipped: 0 });
  const [seconds, setSeconds] = useS10(0);
  const [showA, setShowA] = useS10(false);
  const startTimeRef = useR10(null);

  useE10(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsed);
      if (elapsed >= duration * 60) setPhase('done');
    }, 500);
    return () => clearInterval(t);
  }, [phase, duration]);

  const topics = ['all', ...Array.from(new Set(TIMED_PROBLEMS.map(p => p.topic)))];

  const start = () => {
    const filtered = topic === 'all' ? TIMED_PROBLEMS : TIMED_PROBLEMS.filter(p => p.topic === topic);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setIdx(0); setScore({ correct: 0, wrong: 0, skipped: 0 }); setSeconds(0); setShowA(false);
    startTimeRef.current = Date.now();
    setPhase('running');
  };

  const next = (result) => {
    setScore(s => ({ ...s, [result]: s[result] + 1 }));
    setShowA(false);
    if (idx + 1 >= pool.length) setPhase('done');
    else setIdx(idx + 1);
  };

  if (phase === 'setup') {
    return (
      <React.Fragment>
        <div className="callout info">
          <div className="ttl">⏱️ Timed Drill — จับเวลาแก้โจทย์</div>
          จำลองสถานการณ์สอบ — มีเวลาจำกัด แก้โจทย์ให้ได้เยอะที่สุด<br />
          ใช้ฝึก<b>ตอบเร็ว</b> ในข้อสอบที่มี time pressure
        </div>

        <h3>🎯 เลือกหมวด</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {topics.map(t => (
            <button key={t} onClick={() => setTopic(t)}
              style={{ background: topic === t ? 'var(--accent)' : 'var(--bg-2)', color: topic === t ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: topic === t ? 600 : 400 }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <h3>⏰ เวลาที่ใช้</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {[5, 10, 15, 20, 30].map(d => (
            <button key={d} onClick={() => setDuration(d)}
              style={{ background: duration === d ? 'var(--accent-2)' : 'var(--bg-2)', color: duration === d ? '#000' : 'var(--text-1)', border: '1px solid var(--border)', padding: '8px 20px', borderRadius: 20, cursor: 'pointer', fontWeight: duration === d ? 600 : 400 }}>
              {d} นาที
            </button>
          ))}
        </div>

        <button onClick={start} style={{ background: 'var(--accent)', color: '#000', padding: '12px 32px', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
          🚀 เริ่ม Drill ({duration} นาที)
        </button>
      </React.Fragment>
    );
  }

  const remain = duration * 60 - seconds;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (phase === 'running') {
    const q = pool[idx];
    return (
      <React.Fragment>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          <div style={{ background: remain < 60 ? 'rgba(248,113,113,0.2)' : 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: remain < 60 ? '#f87171' : 'var(--accent-2)', fontFamily: 'monospace' }}>⏱️ {fmt(remain)}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>เหลือ</div>
          </div>
          <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{score.correct}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ถูก ✓</div>
          </div>
          <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f87171' }}>{score.wrong}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ผิด ✗</div>
          </div>
          <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-2)' }}>{score.skipped}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>ข้าม</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-2)', padding: 18, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{q.topic.toUpperCase()} · #{idx + 1}/{pool.length}</span>
            <span style={{ fontSize: 11, color: 'var(--text-2)' }}>เป้า: {q.time}s</span>
          </div>
          <div style={{ fontSize: 18, fontFamily: 'monospace', marginBottom: 14, whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: q.q }} />

          {!showA ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowA(true)} style={{ flex: 1, background: 'var(--accent)', color: '#000', padding: 12, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                💡 ดูคำตอบ
              </button>
              <button onClick={() => next('skipped')} style={{ background: 'var(--bg-3)', color: 'var(--text-1)', padding: 12, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                ⏭ ข้าม
              </button>
            </div>
          ) : (
            <React.Fragment>
              <div style={{ padding: 14, background: 'rgba(16,185,129,0.1)', borderLeft: '3px solid #10b981', borderRadius: 6, marginBottom: 10 }}>
                <div style={{ color: '#10b981', fontWeight: 700, fontFamily: 'monospace', fontSize: 16 }}>✓ {q.a}</div>
                {q.hint && <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 6 }}>{q.hint}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => next('correct')} style={{ flex: 1, background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid #10b981', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  ✓ ตอบถูก
                </button>
                <button onClick={() => next('wrong')} style={{ flex: 1, background: 'rgba(248,113,113,0.2)', color: '#f87171', border: '1px solid #f87171', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  ✗ ตอบไม่ถูก
                </button>
              </div>
            </React.Fragment>
          )}
        </div>

        <button onClick={() => setPhase('done')} style={{ marginTop: 14, background: 'transparent', color: 'var(--text-2)', padding: 8, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
          🛑 หยุดก่อนเวลา
        </button>
      </React.Fragment>
    );
  }

  // done
  const total = score.correct + score.wrong + score.skipped;
  const acc = total ? Math.round(100 * score.correct / total) : 0;
  return (
    <React.Fragment>
      <div className="callout success">
        <div className="ttl">🎉 หมดเวลา!</div>
        คุณทำได้ <b>{total}</b> ข้อ ใน <b>{fmt(seconds)}</b>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, margin: '14px 0' }}>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#10b981' }}>{score.correct}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>ถูก</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f87171' }}>{score.wrong}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>ผิด</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-2)' }}>{score.skipped}</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>ข้าม</div>
        </div>
        <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent-2)' }}>{acc}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Accuracy</div>
        </div>
      </div>

      <div className="callout">
        <b>เฉลี่ย:</b> {total > 0 ? fmt(Math.round(seconds / total)) : '—'}/ข้อ<br />
        <b>เป้าหมาย:</b> ทำให้ accuracy ≥ 80% และเวลา/ข้อ ≤ 60s
      </div>

      <button onClick={() => setPhase('setup')} style={{ background: 'var(--accent)', color: '#000', padding: '12px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginTop: 14 }}>
        🔄 เริ่มใหม่
      </button>
    </React.Fragment>
  );
};

window.LessonsPart10 = Lessons10;
