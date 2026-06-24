import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "g-1",
    topicId: "graphs",
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["graph", "bfs", "dfs"],
    problem: "Count connected components of 1s in a grid. Two 1s belong to the same island if they are horizontally or vertically adjacent.",
    constraints: ["1 <= m, n <= 300", "grid[i][j] is '0' or '1'"],
    approach: "Walk through every cell. When you hit an unvisited '1', kick off a DFS (or BFS) to paint the entire island as visited, then increment the island counter. Marking visited in-place lets you avoid a separate visited matrix.",
    dryRun: [
      "[[1,1,0],[0,1,0],[0,0,1]]: DFS from (0,0) covers the L-shaped island; the last 1 forms a second island → 2",
    ],
    solution: `function numIslands(g) {
  let c = 0;
  const m = g.length, n = g[0].length;
  const dfs = (i, j) => {
    if (i < 0 || j < 0 || i >= m || j >= n || g[i][j] !== '1') return;
    g[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (g[i][j] === '1') {
        c++;
        dfs(i, j);
      }
    }
  }
  return c;
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    intuition: "The brute-force approach would compare every pair of land cells to see if they are connected, which is O((m·n)²). The insight is that a single DFS or BFS from any land cell visits exactly one whole island, so we only need to start a search from each unvisited land cell. Think of it like the paint-bucket tool in an image editor: one click floods the entire blob.",
    pitfalls: [
      { label: "Forgetting to mark visited", body: "If you do not flip '1' to '0' or use a visited set, the same island will be counted over and over again." },
      { label: "Mixing types", body: "The grid stores characters '1' and '0', not numbers 1 and 0. Compare with === '1' to avoid silent mismatches." },
      { label: "Out-of-bounds recursion", body: "Always check i and j against 0, m, and n before reading the grid, or the recursive calls will crash." },
      { label: "Diagonal adjacency", body: "Only up/down/left/right count as connected in this problem; do not add the four diagonal directions." },
    ],
    complexityReasoning: "Every cell is visited at most once during all DFS calls combined, and each visit inspects four neighbors. That gives O(m·n) time. The recursion stack (or BFS queue) can hold an entire island in the worst case, and the grid itself is O(m·n), so the auxiliary space is O(m·n).",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "You find a '1' that has not been visited. What should you do next?", answer: "Start a DFS or BFS from it, mark every reachable '1' as visited, and increment the island counter by one." },
      { prompt: "Why is it safe to mutate the input grid to '0' here?", answer: "It saves a separate visited matrix. In interviews, ask whether the input may be modified; if not, use a visited set or matrix instead." },
    ],
    interviewFraming: "This is the classic grid-connected-components warm-up. Interviewers often use it to test whether you can model a matrix as a graph. Follow-ups include returning the largest island area, the island perimeter, or solving it without recursion to avoid stack overflow on huge grids.",
  },
  {
    id: "g-2",
    topicId: "graphs",
    title: "Course Schedule",
    difficulty: "Medium",
    tags: ["graph", "topological-sort", "bfs"],
    problem: "You must take numCourses courses labeled 0 to numCourses - 1. Some courses have prerequisites. Return true if you can finish all courses, otherwise false.",
    constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
    approach: "Model courses as nodes and prerequisites as directed edges. A valid schedule exists exactly when the directed graph has no cycle. Use Kahn's algorithm: repeatedly remove nodes with indegree zero, decrement neighbor indegrees, and check whether every node was processed.",
    dryRun: [
      "numCourses=2, prerequisites=[[1,0]]: course 0 has indegree 0, so take it; then course 1 has indegree 0; both processed → true",
      "numCourses=2, prerequisites=[[1,0],[0,1]]: each course waits on the other; the queue empties before processing both → false",
    ],
    solution: `function canFinish(n, prereq) {
  const g = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of prereq) {
    g[b].push(a);
    indeg[a]++;
  }
  const q = [];
  for (let i = 0; i < n; i++) {
    if (indeg[i] === 0) q.push(i);
  }
  let done = 0;
  while (q.length) {
    const u = q.shift();
    done++;
    for (const v of g[u]) {
      if (--indeg[v] === 0) q.push(v);
    }
  }
  return done === n;
}`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    intuition: "Trying every possible course ordering would take factorial time. The insight is that prerequisites form a directed graph, and a valid schedule exists exactly when that graph has no directed cycle. Kahn's algorithm peels off courses with no remaining prerequisites layer by layer, like stripping the outer layers of an onion.",
    pitfalls: [
      { label: "Edge direction", body: "prerequisite [a, b] means 'b before a', so the edge is b → a. Building it backward breaks the topological order." },
      { label: "Indegree bookkeeping", body: "Remember to increment indegree[a] when you add edge b → a, and decrement it when b is processed." },
      { label: "Early return", body: "Do not return true as soon as the queue empties the first time; count processed nodes and compare to n at the end." },
      { label: "Empty prerequisites", body: "If prerequisites is empty, every course has indegree 0 and the answer is trivially true." },
    ],
    complexityReasoning: "Building the adjacency list and indegree array scans all prerequisites once, O(E). Each node enters the queue at most once and each edge is relaxed once, O(V + E). The graph, indegree array, and queue together store O(V + E) items.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "What does an indegree of zero mean in this problem?", answer: "The course has no remaining prerequisites and can be taken now." },
      { prompt: "When can you conclude the schedule is impossible?", answer: "When the queue is empty but fewer than n courses have been processed, because a directed cycle remains." },
    ],
    interviewFraming: "This is the canonical topological-sort interview question. The usual follow-up is Course Schedule II, where you must return the actual order. Other follow-ups include detecting the smallest set of courses that create a cycle or handling courses with multiple prerequisites.",
  },
  {
    id: "g-3",
    topicId: "graphs",
    title: "Number of Connected Components",
    difficulty: "Medium",
    tags: ["graph", "union-find"],
    problem: "You have n nodes labeled 0 to n - 1 and a list of undirected edges. Return the number of connected components in the graph.",
    constraints: ["0 <= n <= 10^5", "0 <= edges.length <= 2 · 10^5"],
    approach: "Use the Union-Find (Disjoint Set Union) data structure. Each edge unions the two endpoints. After all unions, the number of distinct root parents is the number of connected components.",
    dryRun: [
      "n=5, edges=[[0,1],[1,2],[3,4]]: {0,1,2} merge into one root, {3,4} merge into another → 2 components",
    ],
    solution: `function countComponents(n, edges) {
  const p = Array.from({ length: n }, (_, i) => i);
  const find = x => p[x] === x ? x : (p[x] = find(p[x]), p[x]);
  for (const [a, b] of edges) {
    p[find(a)] = find(b);
  }
  return new Set(Array.from({ length: n }, (_, i) => find(i))).size;
}`,
    timeComplexity: "O(V + E · α(V))",
    spaceComplexity: "O(V)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    intuition: "A brute-force approach would run DFS from every node to every other node, O(V²). The insight is that edges glue nodes together into groups. If we maintain a parent pointer for each node and merge groups whenever an edge appears, we can count distinct groups in nearly linear time. Union-Find turns the connectivity question into 'do two nodes share the same root?'.",
    pitfalls: [
      { label: "Missing path compression", body: "Without path compression in find, union-find degrades toward O(V) per operation. Always flatten the path: p[x] = find(p[x])." },
      { label: "Unioning non-roots", body: "Union the roots returned by find(a) and find(b), not a and b directly, or you will break the tree structure." },
      { label: "Counting parents instead of roots", body: "After all unions, run find on every node and count distinct roots; raw parent values may still point to intermediate nodes." },
      { label: "Empty graph", body: "If n > 0 and edges is empty, every node is its own component, so the answer is n." },
    ],
    complexityReasoning: "With path compression, each find or union is amortized inverse-Ackermann time, effectively constant. We perform O(E) unions and O(V) finds, giving O(V + E · α(V)) total time. The parent array stores O(V) entries.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "After processing all edges, how do you count components?", answer: "Run find on every node and count the number of distinct roots." },
      { prompt: "Why use union-find here instead of DFS?", answer: "Union-find handles dynamic connectivity efficiently and is especially clean when edges are given as a flat list." },
    ],
    interviewFraming: "This tests whether you know union-find as a connectivity tool. Follow-ups include counting components online as edges arrive, or applying the same structure in Kruskal's minimum spanning tree algorithm.",
  },
  {
    id: "g-4",
    topicId: "graphs",
    title: "Clone Graph",
    difficulty: "Medium",
    tags: ["graph", "dfs", "hashmap"],
    problem: "Given a reference of a node in a connected undirected graph, return a deep copy of the graph. Each node has a value and a list of neighbors.",
    constraints: ["0 <= number of nodes <= 100", "1 <= Node.val <= 100"],
    approach: "DFS from the start node. Maintain a map from each original node to its copy. When you see a node for the first time, create its copy, store it in the map, then recursively copy its neighbors. If a node is already in the map, reuse the stored copy.",
    dryRun: [
      "adjList = [[2,4],[1,3],[2,4],[1,3]]: copy node 1, then copy 2 and 4; when copying 2, reuse copied 1 and copy 3; cycle is broken by the map",
    ],
    solution: `function clone(n) {
  if (!n) return null;
  const m = new Map();
  const dfs = o => {
    if (m.has(o)) return m.get(o);
    const c = new Node(o.val);
    m.set(o, c);
    for (const x of o.neighbors) {
      c.neighbors.push(dfs(x));
    }
    return c;
  };
  return dfs(n);
}`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    intuition: "Blindly creating copies would lead to infinite recursion because undirected edges create cycles: node 1 copies node 2, which copies node 1, which copies node 2 forever. The insight is memoization: map each original node to its copy the first time you see it. That way cycles reuse existing copies and every neighbor pointer points to the right cloned node.",
    pitfalls: [
      { label: "No memoization", body: "Without a map, you create a new copy every time you see a node, causing exponential blow-up or infinite recursion on cycles." },
      { label: "Map insertion timing", body: "Add the copy to the map immediately after creating it, before recursing on neighbors, otherwise cycles cause stack overflow." },
      { label: "Null graph", body: "Return null if the input node is null; many LeetCode-style classes assume a non-null start node." },
      { label: "Copying references", body: "Copy the value and build a fresh neighbors array; do not reuse the original neighbors array or you will share nodes." },
    ],
    complexityReasoning: "Each node is visited once and each edge is traversed twice, once from each endpoint, so time is O(V + E). The map holds at most one entry per node, and the recursion stack depth is at most V, so auxiliary space is O(V) besides the output graph.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "You encounter a neighbor that is already in the map. What do you do?", answer: "Reuse the existing copy from the map; do not create a new node." },
      { prompt: "When should you insert the new copy into the map?", answer: "Immediately after creating it and before recursing on its neighbors, so cycles terminate." },
    ],
    interviewFraming: "This appears in system-design and serialization interviews where you must clone arbitrary object graphs. Follow-ups include cloning a binary tree with random pointers, or cloning graphs that contain both directed and undirected edges.",
  },
  {
    id: "g-5",
    topicId: "graphs",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    tags: ["graph", "bfs", "dfs"],
    problem: "Given an m x n matrix of non-negative heights, find the cells from which water can flow to both the Pacific and Atlantic oceans. Water flows from a cell to neighboring cells with equal or lower height.",
    constraints: ["1 <= m, n <= 150", "0 <= heights[i][j] <= 10^5"],
    approach: "Reverse the flow. Run a multi-source BFS (or DFS) starting from every cell touching the Pacific ocean border, marking all cells that can reach the Pacific. Repeat for the Atlantic. A cell can flow to both oceans if it is reachable in both searches.",
    dryRun: [
      "standard example: Pacific reaches the left/top edges and anything downhill from them; Atlantic reaches the right/bottom edges; the intersection is the answer list",
    ],
    solution: `function pacificAtlantic(h) {
  const m = h.length, n = h[0].length;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const bfs = starts => {
    const v = Array.from({ length: m }, () => new Array(n).fill(false));
    const q = [...starts];
    for (const [i, j] of starts) v[i][j] = true;
    while (q.length) {
      const [i, j] = q.shift();
      for (const [di, dj] of dirs) {
        const ni = i + di, nj = j + dj;
        if (ni >= 0 && nj >= 0 && ni < m && nj < n && !v[ni][nj] && h[ni][nj] >= h[i][j]) {
          v[ni][nj] = true;
          q.push([ni, nj]);
        }
      }
    }
    return v;
  };
  const pStarts = [], aStarts = [];
  for (let j = 0; j < n; j++) {
    pStarts.push([0, j]);
    aStarts.push([m - 1, j]);
  }
  for (let i = 0; i < m; i++) {
    pStarts.push([i, 0]);
    aStarts.push([i, n - 1]);
  }
  const p = bfs(pStarts);
  const a = bfs(aStarts);
  const out = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (p[i][j] && a[i][j]) out.push([i, j]);
    }
  }
  return out;
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    intuition: "Starting a DFS from every cell to both oceans would repeat the same downhill paths many times. The insight is to reverse the search: start from the ocean borders and walk inland only to cells that are at least as tall. A cell can reach an ocean exactly when that ocean's search reaches it. It is like flood-filling from two coastlines and finding where the floods meet.",
    pitfalls: [
      { label: "Search direction", body: "Searching from every cell works but is slower; the efficient trick is to search from the borders inward." },
      { label: "Height comparison", body: "When reversing the flow, water moves from the current cell to a neighbor that is greater than or equal in height. Using > instead of >= blocks equal-height paths." },
      { label: "Incomplete border queues", body: "Both the Pacific and Atlantic queues must include the full edge of the matrix, including the four corners." },
      { label: "Intersecting too early", body: "Do not add a cell to the answer until both reachability matrices have been fully computed." },
    ],
    complexityReasoning: "Each cell is enqueued at most once per ocean search, and each edge is checked a constant number of times. That gives O(m·n) time. We store two visited matrices and two queues, each bounded by O(m·n), so the space is O(m·n).",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "Why start BFS from the ocean borders instead of from each cell?", answer: "It avoids repeating the same downhill paths; reversing the search lets each cell be visited once per ocean." },
      { prompt: "What height condition lets water flow from a new cell to the current one in the reversed search?", answer: "The new cell's height must be greater than or equal to the current cell's height." },
    ],
    interviewFraming: "This is a disguised multi-source BFS problem. Interviewers use it to test whether you can flip the perspective from 'cell reaches ocean' to 'ocean reaches cell.' Follow-ups include returning the number of such cells, adding obstacles, or solving it in-place with a single bit-packed visited matrix.",
  },
  {
    id: "g-6",
    topicId: "graphs",
    title: "Redundant Connection",
    difficulty: "Medium",
    tags: ["graph", "union-find"],
    problem: "You are given a tree with one extra edge added. The input edges form a connected undirected graph with n nodes and n edges. Return the edge that can be removed so that the result is a tree.",
    constraints: ["3 <= n <= 1000", "edges[i].length == 2", "1 <= edges[i][j] <= n"],
    approach: "Process edges one by one with Union-Find. The first edge whose two endpoints already share a root closes a cycle and is the redundant edge. Union all earlier edges as you go.",
    dryRun: [
      "[[1,2],[1,3],[2,3]]: union 1-2, union 1-3; edge 2-3 connects two nodes already in the same set → [2,3]",
    ],
    solution: `function findRedundant(edges) {
  const p = Array.from({ length: edges.length + 1 }, (_, i) => i);
  const f = x => p[x] === x ? x : (p[x] = f(p[x]), p[x]);
  for (const [a, b] of edges) {
    if (f(a) === f(b)) return [a, b];
    p[f(a)] = f(b);
  }
}`,
    timeComplexity: "O(n · α(n))",
    spaceComplexity: "O(n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    intuition: "A tree with n nodes has exactly n - 1 edges, so adding one extra edge always creates exactly one cycle. The brute-force approach would remove each edge and check connectivity, O(n²). The insight is to process edges in order with union-find; the first edge whose endpoints are already connected is the one that closes the cycle.",
    pitfalls: [
      { label: "First vs last redundant edge", body: "Read the problem carefully: some variants want the last edge in input order that creates a cycle. Most standard versions ask for the first." },
      { label: "1-indexed nodes", body: "Nodes are 1-indexed in this problem; size the parent array to edges.length + 1 so index n is valid." },
      { label: "Path compression", body: "Flatten the parent array during find; otherwise the union tree becomes a linked list and performance degrades." },
      { label: "Multiple cycles", body: "The input is a tree plus one edge, so there is exactly one cycle. If you see more than one candidate, revisit the problem statement." },
    ],
    complexityReasoning: "We process each of the n edges once. Each union or find is amortized inverse-Ackermann time with path compression. Therefore total time is O(n · α(n)), and the parent array uses O(n) space.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "What does it mean if find(a) === find(b) before unioning them?", answer: "a and b are already connected, so this edge creates a cycle and is redundant." },
      { prompt: "How many extra edges does a tree-plus-one-edge graph have?", answer: "Exactly one extra edge beyond n - 1, creating exactly one cycle." },
    ],
    interviewFraming: "This is the simplest union-find cycle-detection problem. Follow-ups include returning all edges that could be removed, or finding the redundant edge with the smallest weight in a weighted graph.",
  },
  {
    id: "g-7",
    topicId: "graphs",
    title: "Flood Fill",
    difficulty: "Easy",
    tags: ["graph", "bfs", "dfs", "matrix"],
    problem: "An image is represented by an m x n grid of integers. Given a starting pixel (sr, sc) and a new color, replace the color of the starting pixel and all horizontally or vertically connected pixels that have the same starting color with the new color.",
    constraints: ["1 <= m, n <= 50", "0 <= image[i][j], newColor < 2^16", "0 <= sr < m", "0 <= sc < n"],
    approach: "DFS or BFS from the starting pixel. Record the original color, then change every reachable same-color neighbor to the new color. If the starting pixel already has the new color, return the image immediately to avoid an infinite loop.",
    dryRun: [
      "image = [[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, newColor=2: the connected region of 1s becomes 2s → [[2,2,2],[2,2,0],[2,0,1]]",
    ],
    solution: `function floodFill(image, sr, sc, newColor) {
  const m = image.length, n = image[0].length;
  const oldColor = image[sr][sc];
  if (oldColor === newColor) return image;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= m || c >= n || image[r][c] !== oldColor) return;
    image[r][c] = newColor;
    for (const [dr, dc] of dirs) dfs(r + dr, c + dc);
  };
  dfs(sr, sc);
  return image;
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "image", value: "[[1,1,1],[1,1,0],[1,0,1]]" },
      { label: "sr", value: "1" },
      { label: "sc", value: "1" },
      { label: "newColor", value: "2" },
      { label: "expected", value: "[[2,2,2],[2,2,0],[2,0,1]]" },
    ],
    intuition: "Manually tracing every connected same-color cell would be tedious and error-prone. The insight is that flood fill is exactly DFS or BFS on a grid where edges exist between same-color neighbors. It works just like the paint-bucket tool in an image editor: one click recolors the entire connected region.",
    pitfalls: [
      { label: "Losing the original color", body: "Save image[sr][sc] in oldColor before you overwrite it; otherwise you cannot tell which neighbors belong to the region." },
      { label: "Same color edge case", body: "If newColor equals oldColor, return the image unchanged. Otherwise the start pixel keeps matching oldColor and recursion never terminates." },
      { label: "Out-of-bounds calls", body: "Check r and c against 0, m, and n before reading image[r][c]." },
      { label: "Wrong neighbor test", body: "Only recolor a neighbor if its current color equals oldColor, not if it equals newColor." },
    ],
    complexityReasoning: "In the worst case every cell matches the original color, so each cell is visited once. Four neighbor checks per cell give O(m·n) time. The recursion stack or queue holds at most one connected component, up to O(m·n) space.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "The starting pixel already has the new color. What should happen?", answer: "Return the image unchanged; otherwise the algorithm would loop forever." },
      { prompt: "What condition lets you recolor a neighbor?", answer: "It is in bounds and its current color equals the original starting color." },
    ],
    interviewFraming: "Flood fill is a gentle introduction to grid DFS. Follow-ups include counting the size of the filled region, filling only if the region does not touch the border, or implementing it iteratively with an explicit stack to avoid recursion limits.",
  },
  {
    id: "g-8",
    topicId: "graphs",
    title: "01 Matrix",
    difficulty: "Medium",
    tags: ["graph", "bfs", "matrix"],
    problem: "Given a binary matrix, return the distance of the nearest 0 for each cell. The distance between two adjacent cells is 1.",
    constraints: ["1 <= m, n <= 10^4", "m · n <= 10^5", "matrix[i][j] is 0 or 1"],
    approach: "Multi-source BFS. Enqueue all 0 cells with distance 0. Repeatedly dequeue a cell and relax its four neighbors: if a neighbor's stored distance is larger than current distance + 1, update it and enqueue it. This finds the shortest distance from each 1 to the nearest 0.",
    dryRun: [
      "[[0,0,0],[0,1,0],[1,1,1]]: all 0s start in the queue; the center 1 is distance 1 from a 0; the bottom-right 1 is distance 1 from the center 1, so distance 2 → [[0,0,0],[0,1,0],[1,2,1]]",
    ],
    solution: `function updateMatrix(mat) {
  const m = mat.length, n = mat[0].length;
  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const q = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        dist[i][j] = 0;
        q.push([i, j]);
      }
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const [i, j] = q.shift();
    for (const [di, dj] of dirs) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && nj >= 0 && ni < m && nj < n && dist[ni][nj] > dist[i][j] + 1) {
        dist[ni][nj] = dist[i][j] + 1;
        q.push([ni, nj]);
      }
    }
  }
  return dist;
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[[0,0,0],[0,1,0],[1,1,1]]" },
      { label: "expected", value: "[[0,0,0],[0,1,0],[1,2,1]]" },
    ],
    intuition: "Running BFS from every 1 to find the nearest 0 would take O((m·n)²) time because the searches overlap heavily. The insight is to start BFS from all 0s simultaneously. The first time the wavefront reaches a 1 cell is the shortest distance to any 0, like ripples expanding from multiple stones dropped in a pond.",
    pitfalls: [
      { label: "Per-source BFS", body: "Running BFS from each 1 separately times out on large inputs; always enqueue all 0s first." },
      { label: "Missing source distances", body: "Initialize the distance of every 0 cell to 0 and mark them visited before the BFS loop starts." },
      { label: "Overwriting with larger distances", body: "Only update a neighbor if the new distance is strictly smaller; otherwise you might re-enqueue a cell unnecessarily." },
      { label: "Using DFS", body: "DFS does not naturally yield shortest distances on unweighted grids; use BFS for shortest path." },
    ],
    complexityReasoning: "Every cell enters the queue at most once because its distance only decreases from Infinity to its final value. Each cell checks four neighbors, so time is O(m·n). The queue and distance matrix each store O(m·n) items.",
    patternFamily: "BFS / Level Order",
    selfTest: [
      { prompt: "Why enqueue all 0 cells before the BFS loop starts?", answer: "They are all sources at distance 0, letting the wavefront expand from every 0 at once." },
      { prompt: "When can you be sure a 1 cell's distance is finalized?", answer: "The first time it is dequeued from the BFS queue, because BFS explores by increasing distance." },
    ],
    interviewFraming: "This is the classic multi-source BFS shortest-distance problem. Follow-ups include finding the largest distance from water on an island map, or solving it with dynamic programming when only horizontal and vertical moves are allowed.",
  },
  {
    id: "g-9",
    topicId: "graphs",
    title: "Rotting Oranges",
    difficulty: "Medium",
    tags: ["graph", "bfs", "matrix"],
    problem: "You are given an m x n grid where each cell is empty (0), a fresh orange (1), or a rotten orange (2). Every minute, any fresh orange that is horizontally or vertically adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or -1 if impossible.",
    constraints: ["2 <= m, n <= 10", "grid[i][j] is 0, 1, or 2"],
    approach: "Multi-source level-order BFS. Enqueue all initially rotten oranges. Process the entire current level of the queue before incrementing the minute counter. Track the number of fresh oranges and decrement it as oranges rot. If any fresh orange remains when the queue is empty, return -1.",
    dryRun: [
      "[[2,1,1],[1,1,0],[0,1,1]]: minute 0 rots neighbors of the top-left 2; minute 1 rots the next layer; after 4 minutes all oranges are rotten → 4",
    ],
    solution: `function orangesRotting(grid) {
  const m = grid.length, n = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) q.push([i, j]);
      else if (grid[i][j] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (q.length && fresh > 0) {
    const size = q.length;
    for (let s = 0; s < size; s++) {
      const [i, j] = q.shift();
      for (const [di, dj] of dirs) {
        const ni = i + di, nj = j + dj;
        if (ni >= 0 && nj >= 0 && ni < m && nj < n && grid[ni][nj] === 1) {
          grid[ni][nj] = 2;
          fresh--;
          q.push([ni, nj]);
        }
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[[2,1,1],[1,1,0],[0,1,1]]" },
      { label: "expected", value: "4" },
    ],
    intuition: "Simulating minute by minute by scanning the whole grid repeatedly works but wastes effort. The insight is that all currently rotten oranges rot their neighbors at the same time, so one level of BFS equals exactly one minute. Process all rotten oranges of the current minute together, then move to the next minute.",
    pitfalls: [
      { label: "State codes", body: "0 is empty, 1 is fresh, 2 is rotten. Do not swap the meaning of 1 and 2 when enqueueing or counting." },
      { label: "Fresh count", body: "Track fresh oranges globally. If fresh > 0 after BFS ends, some oranges are unreachable and the answer is -1." },
      { label: "Minute counting", body: "Increment minutes after processing an entire level of the queue, not inside the inner loop over neighbors." },
      { label: "No rotten oranges", body: "If there are fresh oranges but no rotten ones, they will never rot; the answer is -1, not 0." },
    ],
    complexityReasoning: "Each cell enters the queue at most once, and each cell checks four neighbors. That gives O(m·n) time. The queue can hold all cells in the worst case, so space is O(m·n).",
    patternFamily: "BFS / Level Order",
    selfTest: [
      { prompt: "How do you represent one minute passing in BFS?", answer: "Process all nodes currently in the queue as one level before processing their newly rotten children." },
      { prompt: "When should you return -1?", answer: "When BFS finishes and the fresh-orange count is still greater than zero." },
    ],
    interviewFraming: "This tests level-order BFS and state simulation. Follow-ups include adding barriers that block rot, returning the position of the last orange to rot, or allowing diagonal rot.",
  },
  {
    id: "g-10",
    topicId: "graphs",
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["graph", "bfs", "string"],
    problem: "Given beginWord, endWord, and a dictionary wordList, return the length of the shortest transformation sequence from beginWord to endWord such that only one letter can be changed at each step and every intermediate word exists in wordList. Return 0 if no such sequence exists.",
    constraints: ["1 <= beginWord.length <= 10", "endWord.length == beginWord.length", "1 <= wordList.length <= 5000"],
    approach: "Treat each word as a graph node and connect two words with an edge if they differ by exactly one letter. BFS from beginWord gives the shortest path. For efficiency, generate all 26 possible one-letter mutations of the current word and check membership in a word set. Remove visited words from the set to avoid cycles.",
    dryRun: [
      "beginWord='hit', endWord='cog', wordList=['hot','dot','dog','lot','log','cog']: hit → hot → dot → dog → cog, length 5",
    ],
    solution: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  while (q.length) {
    const [word, steps] = q.shift();
    if (word === endWord) return steps;
    for (let i = 0; i < word.length; i++) {
      for (let c = 0; c < 26; c++) {
        const next = word.slice(0, i) + String.fromCharCode(97 + c) + word.slice(i + 1);
        if (wordSet.has(next)) {
          wordSet.delete(next);
          q.push([next, steps + 1]);
        }
      }
    }
  }
  return 0;
}`,
    timeComplexity: "O(N · L · 26)",
    spaceComplexity: "O(N)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "beginWord", value: "'hit'" },
      { label: "endWord", value: "'cog'" },
      { label: "wordList", value: "['hot','dot','dog','lot','log','cog']" },
      { label: "expected", value: "5" },
    ],
    intuition: "Trying every possible word sequence without structure would explode combinatorially. The insight is to model the problem as an unweighted graph: each word is a node, and a one-letter change is an edge. The shortest transformation sequence is then the shortest path in this graph, which BFS finds optimally.",
    pitfalls: [
      { label: "Expensive neighbor generation", body: "Comparing the current word to every word in the list is O(N·L²). Instead, generate the L·26 possible one-letter changes and check the set in O(1)." },
      { label: "Not removing visited words", body: "Delete a word from wordSet when you enqueue it; otherwise you will revisit words and create cycles or longer paths." },
      { label: "Path length off-by-one", body: "The answer counts the number of words in the sequence, including beginWord and endWord. Start the step count at 1." },
      { label: "Missing endWord", body: "If endWord is not in wordList, return 0 immediately." },
    ],
    complexityReasoning: "There are N words of length L. For each dequeued word we try L·26 mutations and check set membership in O(1). In the worst case every word is dequeued once, giving O(N·L·26) time. The set and queue store up to N words, so space is O(N).",
    patternFamily: "BFS / Level Order",
    selfTest: [
      { prompt: "How do you generate neighbors of a word efficiently?", answer: "Replace each position with 'a' through 'z' and check if the result exists in the word set." },
      { prompt: "Why remove a word from the set once it is visited?", answer: "To prevent revisiting it and creating cycles or longer paths." },
    ],
    interviewFraming: "Word Ladder is a standard BFS-on-strings interview problem. Follow-ups include returning all shortest paths (Word Ladder II), using bidirectional BFS to reduce the search space, or handling wildcard characters.",
  },
  {
    id: "g-11",
    topicId: "graphs",
    title: "Accounts Merge",
    difficulty: "Medium",
    tags: ["graph", "dfs", "union-find"],
    problem: "Given a list of accounts where each account is [name, email1, email2, ...], merge accounts that share at least one email. Return the merged accounts as [name, sortedEmails...], where sortedEmails is the list of emails in the merged account sorted lexicographically.",
    constraints: ["1 <= accounts.length <= 1000", "2 <= accounts[i].length <= 10", "Emails are lowercase and unique within one account"],
    approach: "Build an undirected graph where emails are nodes and all emails within the same account are connected. DFS from each unvisited email to collect its connected component, sort the component's emails, and prepend the account name. Alternatively, solve with union-find on emails.",
    dryRun: [
      "[['John','a@x','b@x'],['John','a@x','c@x'],['Mary','d@x'],['John','e@x']]: 'a@x' links 'b@x' and 'c@x', forming one John component; 'e@x' is separate; 'd@x' is Mary's → merged lists",
    ],
    solution: `function accountsMerge(accounts) {
  const graph = new Map();
  const nameOf = new Map();
  for (const [name, ...emails] of accounts) {
    const first = emails[0];
    nameOf.set(first, name);
    if (!graph.has(first)) graph.set(first, new Set());
    for (let i = 1; i < emails.length; i++) {
      const email = emails[i];
      nameOf.set(email, name);
      if (!graph.has(email)) graph.set(email, new Set());
      graph.get(first).add(email);
      graph.get(email).add(first);
    }
  }
  const visited = new Set();
  const dfs = email => {
    visited.add(email);
    const comp = [email];
    for (const nxt of graph.get(email) || []) {
      if (!visited.has(nxt)) comp.push(...dfs(nxt));
    }
    return comp;
  };
  const res = [];
  for (const email of graph.keys()) {
    if (!visited.has(email)) {
      const comp = dfs(email).sort();
      res.push([nameOf.get(email), ...comp]);
    }
  }
  return res;
}`,
    timeComplexity: "O(N · K log K)",
    spaceComplexity: "O(N · K)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "accounts", value: "[['John','johnsmith@mail.com','john_newyork@mail.com'],['John','johnsmith@mail.com','john00@mail.com'],['Mary','mary@mail.com'],['John','johnnybravo@mail.com']]" },
      { label: "expected", value: "merged lists with shared emails combined" },
    ],
    intuition: "Comparing every pair of accounts for shared emails would be O(N²). The insight is that emails are the real glue: two accounts belong to the same person if their emails sit in the same connected component. Build a graph of emails linked by account, then each connected component is one merged person.",
    pitfalls: [
      { label: "Merging by name", body: "Two accounts can share a name but belong to different people. Merge only when emails overlap." },
      { label: "Missing sorted output", body: "Sort each component's emails lexicographically before returning; the problem usually requires it." },
      { label: "Incomplete graph edges", body: "Within one account, connect the first email to every other email. Because the graph is undirected, this links all emails in the account transitively." },
      { label: "Single-email accounts", body: "An account with only one email still forms a component of size one and should be returned as-is." },
    ],
    complexityReasoning: "Building the graph touches every email in every account once, O(total emails). Sorting each connected component dominates the time, O(total emails · log K) where K is the largest component size. The graph and visited set store all emails, O(total emails) space.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "What should be the nodes in the graph: accounts or emails?", answer: "Emails; edges connect emails that appear in the same account." },
      { prompt: "Two accounts have the same name but no shared email. Should they merge?", answer: "No; names are not unique identifiers." },
    ],
    interviewFraming: "This tests graph construction from real-world data. Follow-ups include solving the same problem with union-find, merging accounts using additional fields like phone numbers, or handling accounts with inconsistent names.",
  },
  {
    id: "g-12",
    topicId: "graphs",
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    tags: ["graph", "dp", "heap"],
    problem: "There are n cities connected by flights in the form [from, to, price]. Given src, dst, and k, find the cheapest price from src to dst with at most k stops. If there is no such route, return -1. A stop is an intermediate city, so up to k stops means up to k + 1 flights.",
    constraints: ["1 <= n <= 100", "0 <= flights.length <= n · (n - 1) / 2", "0 <= k <= n - 1"],
    approach: "Use the Bellman-Ford dynamic-programming idea. Maintain a distance array where dist[city] is the cheapest known cost to reach that city. Relax every edge for k + 1 rounds, using a copy of the distance array each round so that relaxations only use paths from the previous round. Return dist[dst] if it is finite, otherwise -1.",
    dryRun: [
      "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1: with 1 stop you can go 0→1→3 for 700; 0→2→3 is 300 but uses 2 stops, which exceeds k → 700",
    ],
    solution: `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i <= k; i++) {
    const next = [...dist];
    for (const [u, v, w] of flights) {
      if (dist[u] !== Infinity && next[v] > dist[u] + w) {
        next[v] = dist[u] + w;
      }
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`,
    timeComplexity: "O(K · E)",
    spaceComplexity: "O(n)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "n", value: "4" },
      { label: "flights", value: "[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]" },
      { label: "src", value: "0" },
      { label: "dst", value: "3" },
      { label: "k", value: "1" },
      { label: "expected", value: "700" },
    ],
    intuition: "Enumerating every path of up to k + 1 edges would be exponential. The insight is the Bellman-Ford dynamic-programming idea: after relaxing edges t times, we know the cheapest cost using at most t flights. Repeatedly ask, 'Can I improve a price by taking one more flight?' and copy the distance array each round to respect the stop limit.",
    pitfalls: [
      { label: "Stops vs edges", body: "k stops means k + 1 flights, so run k + 1 relaxation rounds, not k." },
      { label: "In-place updates", body: "Use a fresh copy of the distance array each round. Updating in place would let a path discovered in this round contribute to another path in the same round, breaking the stop constraint." },
      { label: "Wrong return value", body: "Return -1 when dist[dst] is still Infinity, not the cheapest price ever seen to dst." },
      { label: "Source initialization", body: "Set dist[src] = 0 before relaxing; all other entries start at Infinity." },
    ],
    complexityReasoning: "We run k + 1 relaxation rounds over all E flights, so time is O(K · E). We only need two distance arrays of length n (or one with a copy), giving O(n) space.",
    patternFamily: "Graph",
    selfTest: [
      { prompt: "If k = 1, what is the maximum number of flights allowed?", answer: "k + 1 = 2 flights, because one stop means one intermediate city." },
      { prompt: "Why make a copy of the distance array each round?", answer: "To ensure this round only uses distances from at most the previous number of edges, not distances discovered within the same round." },
    ],
    interviewFraming: "This is a graph shortest-path problem with an extra constraint on the number of edges. Follow-ups include using Dijkstra with stops as part of the state, finding the cheapest path with exactly k stops, or generalizing to multi-criteria routing.",
  },
];
