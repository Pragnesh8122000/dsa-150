import type { Topic } from "./types";

export const TOPICS: Topic[] = [
  {
    id: "arrays",
    name: "Arrays & Strings",
    shortName: "Arrays",
    icon: "[]",
    blurb: "The foundation. Contiguous memory, O(1) random access, O(n) search.",
    refresher:
      "Arrays store elements in contiguous memory. Access by index is O(1), insertion/deletion in the middle is O(n). Strings are arrays of characters in JS (immutable). Master the in-place two-pointer technique, prefix sums, and the sliding window pattern — these three cover ~60% of array/string interview questions.",
    keyPatterns: ["Two pointers", "Sliding window", "Prefix sums", "In-place swap", "Kadane's"],
    diagram: `<svg viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg" style="color:var(--accent)">
      <g font-family="monospace" font-size="14" fill="var(--text-primary)">
        <rect x="20" y="20" width="40" height="40" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="40" y="46" text-anchor="middle">3</text>
        <rect x="60" y="20" width="40" height="40" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="80" y="46" text-anchor="middle">7</text>
        <rect x="100" y="20" width="40" height="40" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="120" y="46" text-anchor="middle">2</text>
        <rect x="140" y="20" width="40" height="40" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="160" y="46" text-anchor="middle">9</text>
        <rect x="180" y="20" width="40" height="40" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="200" y="46" text-anchor="middle">1</text>
        <text x="40" y="80" text-anchor="middle" fill="var(--text-secondary)">0</text>
        <text x="80" y="80" text-anchor="middle" fill="var(--text-secondary)">1</text>
        <text x="120" y="80" text-anchor="middle" fill="var(--text-secondary)">2</text>
        <text x="160" y="80" text-anchor="middle" fill="var(--text-secondary)">3</text>
        <text x="200" y="80" text-anchor="middle" fill="var(--text-secondary)">4</text>
        <text x="220" y="40" text-anchor="start" fill="currentColor">← index 2 = arr[2]</text>
      </g>
    </svg>`,
  },
  {
    id: "hashing",
    name: "Hashing (Maps / Sets)",
    shortName: "Hashing",
    icon: "#",
    blurb: "O(1) average lookup, insert, delete. Your default tool for 'have I seen this?'.",
    refresher:
      "Hash maps trade a constant-time hash function for O(1) average operations. Use a Map when you need key→value, a Set when you only need membership. Collisions degrade performance — but in practice this is rare with good hash functions. Watch out for the 'count frequency' pattern: it's the basis of anagram checks, pair sums, and most substring problems.",
    keyPatterns: ["Frequency counter", "Complement lookup", "Group by key", "Memoization"],
  },
  {
    id: "two-pointers",
    name: "Two Pointers & Sliding Window",
    shortName: "Two Pointers",
    icon: "↔",
    blurb: "Reduce O(n²) brute force to O(n) by exploiting sortedness or window invariants.",
    refresher:
      "Two pointers: place one (or more) pointers at strategic positions and move them based on a condition. Works on sorted arrays (left/right converging) or in-place problems (slow/fast walkers). Sliding window: maintain a window [l, r) that satisfies a property, expanding r and contracting l to optimize. Both patterns are the workhorse of array/string interviews.",
    keyPatterns: ["Opposite ends (sorted)", "Slow/fast pointers", "Fixed window", "Variable window", "Cyclic sort"],
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    shortName: "Linked Lists",
    icon: "→",
    blurb: "Nodes with next pointers. O(1) insert/delete at head, O(n) random access.",
    refresher:
      "A linked list is a chain of nodes, each holding a value and a pointer to the next. In JS we usually build a ListNode class. The classic patterns: dummy-head node (saves edge-case code), slow/fast pointers (cycle detection, middle of list, kth from end), reversal (iterative with three pointers), and merge (dummy + two runners).",
    keyPatterns: ["Reverse", "Slow/fast", "Dummy head", "Merge", "Cycle detection"],
    diagram: `<svg viewBox="0 0 420 80" xmlns="http://www.w3.org/2000/svg" style="color:var(--accent)">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
      <g font-family="monospace" font-size="14" fill="var(--text-primary)">
        <rect x="10" y="25" width="60" height="30" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="25" y="45">1</text>
        <line x1="50" y1="45" x2="60" y2="45" stroke="currentColor" stroke-width="2"/>
        <circle cx="55" cy="45" r="3" fill="var(--surface-1)" stroke="currentColor"/>
        <line x1="70" y1="40" x2="100" y2="40" stroke="currentColor" stroke-width="2" marker-end="url(#arr)"/>
        <rect x="100" y="25" width="60" height="30" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="115" y="45">2</text>
        <line x1="140" y1="45" x2="150" y2="45" stroke="currentColor" stroke-width="2"/>
        <circle cx="145" cy="45" r="3" fill="var(--surface-1)" stroke="currentColor"/>
        <line x1="160" y1="40" x2="190" y2="40" stroke="currentColor" stroke-width="2" marker-end="url(#arr)"/>
        <rect x="190" y="25" width="60" height="30" fill="var(--surface-1)" stroke="currentColor" stroke-width="2"/>
        <text x="205" y="45">3</text>
        <line x1="230" y1="45" x2="240" y2="45" stroke="currentColor" stroke-width="2"/>
        <circle cx="235" cy="45" r="3" fill="var(--surface-1)" stroke="currentColor"/>
        <line x1="250" y1="40" x2="280" y2="40" stroke="currentColor" stroke-width="2" marker-end="url(#arr)"/>
        <text x="285" y="45" fill="var(--state-rejected)">null</text>
        <text x="20" y="20" fill="var(--text-secondary)">head</text>
      </g>
    </svg>`,
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    shortName: "Stacks/Queues",
    icon: "⇅",
    blurb: "LIFO and FIFO. Match parentheses, evaluate expressions, BFS, monotonic stacks.",
    refresher:
      "Stack: LIFO, push/pop O(1). Used for matching brackets, undo, DFS, and the powerful 'monotonic stack' pattern (next greater element). Queue: FIFO, enqueue/dequeue O(1). Used for BFS and level-order traversal. A deque (double-ended) adds O(1) push/pop on both ends — useful in sliding window maximum.",
    keyPatterns: ["Matching brackets", "Monotonic stack", "BFS with queue", "Deque for sliding window max"],
  },
  {
    id: "trees",
    name: "Trees (Binary Tree, BST, Traversals)",
    shortName: "Trees",
    icon: "T",
    blurb: "Hierarchical data. BST gives O(log n) search, but only when balanced.",
    refresher:
      "A binary tree node has up to two children. Traversals: inorder (left, root, right) yields sorted order in a BST; preorder (root, left, right) is good for serialization; postorder (left, right, root) is good for deletion. BFS/level-order uses a queue. Recursion is the natural fit — for any problem, first ask 'what does the left subtree return, what does the right subtree return?'",
    keyPatterns: ["DFS (pre/in/post)", "BFS level order", "BST insert/search", "Height & diameter", "LCA"],
    diagram: `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" style="color:var(--accent)">
      <g font-family="monospace" font-size="13" fill="var(--text-primary)" stroke="currentColor" stroke-width="2">
        <line x1="160" y1="30" x2="90" y2="80"/>
        <line x1="160" y1="30" x2="230" y2="80"/>
        <line x1="90" y1="80" x2="50" y2="130"/>
        <line x1="90" y1="80" x2="130" y2="130"/>
        <line x1="230" y1="80" x2="190" y2="130"/>
        <circle cx="160" cy="30" r="18" fill="var(--surface-1)"/><text x="160" y="34" text-anchor="middle" stroke="none">1</text>
        <circle cx="90" cy="80" r="18" fill="var(--surface-1)"/><text x="90" y="84" text-anchor="middle" stroke="none">2</text>
        <circle cx="230" cy="80" r="18" fill="var(--surface-1)"/><text x="230" y="84" text-anchor="middle" stroke="none">3</text>
        <circle cx="50" cy="130" r="18" fill="var(--surface-1)"/><text x="50" y="134" text-anchor="middle" stroke="none">4</text>
        <circle cx="130" cy="130" r="18" fill="var(--surface-1)"/><text x="130" y="134" text-anchor="middle" stroke="none">5</text>
        <circle cx="190" cy="130" r="18" fill="var(--surface-1)"/><text x="190" y="134" text-anchor="middle" stroke="none">6</text>
      </g>
    </svg>`,
  },
  {
    id: "heaps",
    name: "Heaps / Priority Queues",
    shortName: "Heaps",
    icon: "△",
    blurb: "O(log n) insert/extract-min. Top-K, two-way merge, Dijkstra.",
    refresher:
      "A binary heap is a complete binary tree where the parent is always smaller (min-heap) or larger (max-heap) than its children. In JS there's no built-in heap — you write a small class backed by an array, where parent of i is (i-1)/2 and children are 2i+1, 2i+2. The most common uses: 'k largest/smallest' (heap of size k) and merging sorted streams.",
    keyPatterns: ["Top-K elements", "Two-way merge", "Running median", "Dijkstra's shortest path"],
  },
  {
    id: "graphs",
    name: "Graphs (BFS, DFS, Topo, Union-Find)",
    shortName: "Graphs",
    icon: "◉",
    blurb: "Nodes and edges. Traversal, shortest path, cycle detection, connectivity.",
    refresher:
      "Represent as adjacency list (most common) or matrix. BFS with a queue finds shortest path in unweighted graphs and generates level-order. DFS (recursion or stack) for connected components, cycle detection, topological sort. Union-Find (DSU) answers 'are these two nodes connected?' in near-O(1) with path compression + union by rank — used in Kruskal's MST and accounts-merge problems.",
    keyPatterns: ["BFS shortest path", "DFS components", "Topological sort", "Union-Find / DSU", "Dijkstra"],
  },
  {
    id: "recursion",
    name: "Recursion & Backtracking",
    shortName: "Recursion",
    icon: "↻",
    blurb: "Solve a problem by solving smaller subproblems. Backtrack when you hit a dead end.",
    refresher:
      "Recursion: identify the base case, the recursive case, and what state to pass forward. Backtracking is recursion that builds a partial solution, explores one branch, and undoes the choice to try another. Classic template: 'choose → explore → unchoose'. Used in permutations, subsets, N-queens, word search, sudoku.",
    keyPatterns: ["Subset generation", "Permutations", "Combination sum", "Word search", "N-Queens"],
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    shortName: "DP",
    icon: "Σ",
    blurb: "Cache subproblem results. 1D for linear, 2D for grids/sequences, knapsack for selection.",
    refresher:
      "DP applies when (1) optimal substructure — optimal answer built from optimal sub-answers, and (2) overlapping subproblems — the same subproblem is solved many times. Two flavors: top-down (memoized recursion) and bottom-up (iterative table). Patterns: 1D (climbing stairs, house robber), 2D (grid paths, LCS, edit distance), knapsack (subset sum, partition equal), and unbounded knapsack (coin change).",
    keyPatterns: ["1D linear", "2D grid", "Knapsack 0/1", "Unbounded knapsack", "LCS / Edit distance"],
  },
  {
    id: "greedy",
    name: "Greedy Algorithms",
    shortName: "Greedy",
    icon: ">",
    blurb: "Make the locally optimal choice. Works when the choice doesn't break future options.",
    refresher:
      "Greedy picks the best-looking option at each step without re-considering. It works when the problem has the 'greedy choice property' — there's always an optimal solution that includes the greedy choice. Prove by exchange argument. Common: interval scheduling (sort by end), jump game (max reach), activity selection, Huffman coding.",
    keyPatterns: ["Interval scheduling", "Jump game", "Activity selection", "Minimum platforms"],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    shortName: "Binary Search",
    icon: "⌕",
    blurb: "O(log n) on a monotonic predicate. The trickiest part is getting the boundary right.",
    refresher:
      "Standard binary search: low=0, high=n-1, while low<=high, mid=(low+high)>>1, compare arr[mid] to target, halve the range. Edge cases are around 'where does low end up?'. Variations: lower_bound (first >= target), upper_bound (first > target), search on answer (binary search the answer space when the predicate is monotonic in the answer).",
    keyPatterns: ["Standard", "Lower/upper bound", "Search on answer", "Rotated sorted array"],
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    shortName: "Sorting",
    icon: "⇅",
    blurb: "Know the time/space trade-offs. In interviews, default to built-in sort and reason from there.",
    refresher:
      "Quick sort: average O(n log n), worst O(n²), in-place, not stable. Merge sort: O(n log n) worst, O(n) extra space, stable. Heap sort: O(n log n) all cases, in-place, not stable. Counting/radix sort: O(n+k) for small-integer keys. In JS, Array.prototype.sort is Tim sort (V8) — O(n log n) and stable since ES2019.",
    keyPatterns: ["Quick sort", "Merge sort", "Heap sort", "Counting sort", "Custom comparators"],
    complexityTable: [
      { name: "Bubble sort", time: "O(n²)", space: "O(1)", notes: "Educational only" },
      { name: "Selection sort", time: "O(n²)", space: "O(1)", notes: "Min swaps, unstable" },
      { name: "Insertion sort", time: "O(n²)", space: "O(1)", notes: "Fast on nearly-sorted" },
      { name: "Merge sort", time: "O(n log n)", space: "O(n)", notes: "Stable, predictable" },
      { name: "Quick sort", time: "O(n log n) avg", space: "O(log n)", notes: "In-place, not stable" },
      { name: "Heap sort", time: "O(n log n)", space: "O(1)", notes: "In-place, not stable" },
      { name: "Counting sort", time: "O(n + k)", space: "O(k)", notes: "Integer keys, k = range" },
      { name: "JS Array.sort (Tim)", time: "O(n log n)", space: "O(n)", notes: "Stable since ES2019" },
    ],
  },
  {
    id: "bits",
    name: "Bit Manipulation",
    shortName: "Bits",
    icon: "01",
    blurb: "XOR, AND, OR, shifts. O(1) tricks for unique elements, subsets, parity.",
    refresher:
      "Operators: & (AND), | (OR), ^ (XOR), ~ (NOT), <<, >>, >>>. XOR properties: a^a=0, a^0=a, commutative, associative. Useful tricks: find unique element among pairs (XOR all), swap without temp (a^=b, b^=a, a^=b), check power of two (n & (n-1) === 0), count set bits (Brian Kernighan's: n & (n-1) flips the lowest set bit).",
    keyPatterns: ["XOR tricks", "Masking", "Brian Kernighan count", "Power of two", "Subset via bitmask"],
  },
];

export const TOPIC_BY_ID: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t])
);
