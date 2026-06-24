export interface Pattern {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  blurb: string;
  tagMatchers: string[];
}

/** Pattern families used to group questions beyond their topic taxonomy.
 *  A question may appear under multiple patterns if its tags match. */
export const PATTERNS: Pattern[] = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    shortName: "Two Pointers",
    icon: "↔",
    blurb: "Shrink the search space by walking inward from both ends or with slow/fast runners.",
    tagMatchers: ["two-pointers"],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    shortName: "Sliding Window",
    icon: "▭",
    blurb: "Maintain a subarray/substring window and slide its edges to satisfy a constraint.",
    tagMatchers: ["sliding-window"],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    shortName: "Binary Search",
    icon: "⌕",
    blurb: "Halve a sorted space, or search on a monotonic predicate when the answer itself is a range.",
    tagMatchers: ["binary-search"],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    shortName: "DP",
    icon: "Σ",
    blurb: "Cache overlapping subproblems to turn exponential recursion into polynomial iteration.",
    tagMatchers: ["dp"],
  },
  {
    id: "greedy",
    name: "Greedy",
    shortName: "Greedy",
    icon: ">",
    blurb: "Make the locally optimal choice and prove it never blocks a global optimum.",
    tagMatchers: ["greedy"],
  },
  {
    id: "hashmap",
    name: "Hash Map / Set",
    shortName: "Hashing",
    icon: "#",
    blurb: "Trade space for O(1) lookups: frequency counts, complement checks, and grouping.",
    tagMatchers: ["hashmap", "hashset"],
  },
  {
    id: "heap",
    name: "Heap / Priority Queue",
    shortName: "Heap",
    icon: "△",
    blurb: "Keep a running top-k or merge sorted streams with O(log n) insert/extract.",
    tagMatchers: ["heap"],
  },
  {
    id: "stack",
    name: "Stack / Monotonic Stack",
    shortName: "Stack",
    icon: "⇅",
    blurb: "LIFO matching, undo paths, and monotonic structures for next-greater problems.",
    tagMatchers: ["stack", "monotonic"],
  },
  {
    id: "bfs",
    name: "BFS / Level Order",
    shortName: "BFS",
    icon: "◉",
    blurb: "Explore layer by layer to find shortest paths or process nodes by distance.",
    tagMatchers: ["bfs", "topological-sort"],
  },
  {
    id: "dfs",
    name: "DFS / Recursion",
    shortName: "DFS",
    icon: "↻",
    blurb: "Dive deep first — components, paths, tree traversals, and backtracking.",
    tagMatchers: ["dfs", "recursion", "backtracking"],
  },
  {
    id: "linked-list",
    name: "Linked List",
    shortName: "Linked List",
    icon: "→",
    blurb: "Pointer manipulation, dummy heads, reversal, and slow/fast detection.",
    tagMatchers: ["linked-list"],
  },
  {
    id: "tree",
    name: "Tree / BST",
    shortName: "Tree",
    icon: "T",
    blurb: "Hierarchical traversal, BST properties, and recursive subtree reasoning.",
    tagMatchers: ["tree", "bst"],
  },
  {
    id: "graph",
    name: "Graph",
    shortName: "Graph",
    icon: "◎",
    blurb: "Adjacency traversals, union-find, and connectivity on nodes and edges.",
    tagMatchers: ["graph", "union-find"],
  },
  {
    id: "sorting",
    name: "Sorting",
    shortName: "Sorting",
    icon: "⇅",
    blurb: "Order data deliberately, then reason from the sorted structure.",
    tagMatchers: ["sorting"],
  },
  {
    id: "bits",
    name: "Bit Manipulation",
    shortName: "Bits",
    icon: "01",
    blurb: "O(1) tricks with masks, XOR, and shifts for parity, sets, and states.",
    tagMatchers: ["bits"],
  },
];

export const PATTERN_BY_ID: Record<string, Pattern> = Object.fromEntries(
  PATTERNS.map((p) => [p.id, p])
);
