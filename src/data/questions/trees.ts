import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "t-1",
    topicId: "trees",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    tags: ["tree", "dfs"],
    problem: "Invert a binary tree.",
    constraints: ["0 <= nodes <= 100"],
    approach:
      "DFS: swap the left and right children of the current node, then recurse on the new children. The swap is local; once every fork is flipped the whole tree is mirrored.",
    dryRun: ["[4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]"],
    solution: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
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
    intuition:
      "The brute force would be to build a brand new mirrored tree node by node. The insight is that mirroring is local: swapping the left and right child of every node produces the entire inverted tree. Think of it as flipping every fork in a family tree; once every fork is flipped, the whole tree is mirrored.",
    pitfalls: [
      {
        label: "Forgetting the base case",
        body: "Missing or mishandling null returns can leave dangling pointers or cause recursion errors.",
      },
      {
        label: "Mutating pointers before recursing",
        body: "If you overwrite root.left before you recurse into the original left child, you lose the subtree and corrupt the tree.",
      },
      {
        label: "Returning the wrong node",
        body: "Always return root after the swaps so parent calls receive the updated subtree.",
      },
    ],
    complexityReasoning:
      "We visit each of the n nodes exactly once and perform O(1) work (a pointer swap) per node, so time is O(n). The recursion stack follows the tree height h, giving O(h) auxiliary space; in the worst case a skewed tree is O(n) deep, but balanced trees use O(log n).",
    patternFamily: "Tree / BST",
    selfTest: [
      {
        prompt: "What do you do at the null node?",
        answer: "Return null; it is the base case that stops recursion.",
        hint: "Every leaf's missing child resolves here.",
      },
      {
        prompt: "After swapping the children, what is the next step?",
        answer: "Recurse on the new left and right children to invert their subtrees.",
      },
      {
        prompt: "Why does a post-order style work for inversion?",
        answer: "Because children must exist before we swap them, and their subtrees must be inverted after the swap.",
      },
    ],
    interviewFraming:
      "This is a warm-up question at top companies; it tests comfort with recursion and pointer mutation. Common follow-ups include doing it iteratively with a stack or queue, and extending the idea to an N-ary tree.",
  },
  {
    id: "t-2",
    topicId: "trees",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    tags: ["tree", "dfs"],
    problem: "Return max depth.",
    constraints: ["0 <= nodes <= 10⁴"],
    approach:
      "DFS: the depth of any node is 1 plus the deeper of its two children. A null node contributes 0, so a leaf correctly returns 1.",
    dryRun: ["[3,9,20,null,null,15,7] → 3"],
    solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
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
    intuition:
      "A natural first thought is to track depth manually with a global counter while traversing. The recursive insight is simpler: the depth of any node is 1 plus the deeper of its two children. Working bottom-up, each subtree reports its own height and the root adds one more level.",
    pitfalls: [
      {
        label: "Off-by-one at leaves",
        body: "A leaf is depth 1, not 0; return 1 + max(0, 0) for it.",
      },
      {
        label: "Returning 0 for a null node incorrectly",
        body: "The empty child of a leaf should indeed return 0 because it contributes no levels.",
      },
      {
        label: "Mixing depth and height",
        body: "Depth is root-to-node; here we compute height (leaf-to-node) bottom-up, so make sure the recurrence matches.",
      },
    ],
    complexityReasoning:
      "Every node is visited once and the work at each node is constant, so time is O(n). The call stack depth equals the height of the tree, h; skewed trees yield O(n) space while balanced trees use O(log n).",
    patternFamily: "Tree / BST",
    selfTest: [
      {
        prompt: "What does maxDepth(null) return?",
        answer: "0",
      },
      {
        prompt: "What is the recurrence for a non-null node?",
        answer: "1 + Math.max(maxDepth(left), maxDepth(right))",
      },
      {
        prompt: "How does the recursion combine two subtree answers?",
        answer: "It takes the larger of the two heights because the longest root-to-leaf path determines depth.",
      },
    ],
    interviewFraming:
      "This is a classic easy warm-up that quickly reveals whether a candidate is comfortable with recursion. Follow-ups often ask for an iterative BFS/DFS version or for minimum depth, which has a subtle edge case around root-only trees.",
  },
  {
    id: "t-3",
    topicId: "trees",
    title: "Level Order Traversal",
    difficulty: "Medium",
    tags: ["tree", "bfs"],
    problem: "Return level-order traversal as array of arrays.",
    constraints: ["0 <= nodes <= 2000"],
    approach:
      "BFS with a queue. Before processing a level, snapshot the current queue size, then dequeue exactly that many nodes while enqueueing their children. This naturally groups values by depth.",
    dryRun: ["[3,9,20,15,7] → [[3],[9,20],[15,7]]"],
    solution: `function levelOrder(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const sz = q.length;
    const lvl = [];
    for (let i = 0; i < sz; i++) {
      const n = q.shift();
      lvl.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(lvl);
  }
  return out;
}`,
    timeComplexity: "O(n)",
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
    intuition:
      "A naive DFS could record depth but would need extra bookkeeping to group values by level. The cleaner insight is to use a queue: process the whole current frontier of nodes together, and each frontier is exactly one level. This naturally buckets values by depth.",
    pitfalls: [
      {
        label: "Changing queue size mid-level",
        body: "Capture the current queue length before the inner loop; otherwise new children get mixed into the same level.",
      },
      {
        label: "Forgetting to enqueue children",
        body: "Only nodes pushed to the queue get visited later; missing a child leaves it out of the output.",
      },
      {
        label: "Returning empty for null root incorrectly",
        body: "An empty tree should return [], not [[]].",
      },
    ],
    complexityReasoning:
      "Each node is enqueued and dequeued exactly once, so time is O(n). The queue at any moment holds at most one level of nodes; for a full binary tree the last level has about n/2 nodes, giving O(n) space in the worst case.",
    patternFamily: "BFS / Level Order",
    selfTest: [
      {
        prompt: "Why is the outer while loop needed?",
        answer: "It keeps processing levels until the queue is empty.",
      },
      {
        prompt: "Why freeze sz = q.length at the start of each level?",
        answer: "It prevents newly enqueued children from being processed in the current level.",
      },
      {
        prompt: "What data structure is the natural fit for level order?",
        answer: "A queue (FIFO), typically an array used with push/shift.",
      },
    ],
    interviewFraming:
      "This is the textbook BFS-on-a-tree question and the foundation for many level-aware problems. Follow-ups include zigzag traversal, level averages, or finding the deepest leftmost value.",
  },
  {
    id: "t-4",
    topicId: "trees",
    title: "Validate BST",
    difficulty: "Medium",
    tags: ["tree", "dfs", "bst"],
    problem: "Check if a tree is a valid BST.",
    constraints: ["0 <= nodes <= 10⁴"],
    approach:
      "DFS with (min, max) bounds. Each node must lie strictly between the bounds inherited from its ancestors. A left child inherits the parent's value as the new max; a right child inherits it as the new min.",
    dryRun: ["[2,1,3] → true; [5,1,4,null,null,3,6] → false"],
    solution: `function isValidBST(r, lo = -Infinity, hi = Infinity) {
  if (!r) return true;
  if (r.val <= lo || r.val >= hi) return false;
  return isValidBST(r.left, lo, r.val) && isValidBST(r.right, r.val, hi);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
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
    intuition:
      "The brute force compares every node against every ancestor, which repeats work. The insight is to pass down an allowed range: each node must be within the (min, max) window created by its ancestors. A left child tightens the max; a right child tightens the min.",
    pitfalls: [
      {
        label: "Comparing only immediate parent",
        body: "A node may be smaller than its parent but larger than an ancestor on the right; bounds must include all ancestors.",
      },
      {
        label: "Using <= or >= instead of strict inequality",
        body: "BSTs disallow duplicate values in this definition, so use < and >.",
      },
      {
        label: "Forgetting to update both bounds",
        body: "When recursing right, the lower bound increases and the upper bound stays the same; ensure both are propagated.",
      },
    ],
    complexityReasoning:
      "Each node is checked once with O(1) work, so time is O(n). The recursion stack holds at most h frames, where h is the tree height, giving O(h) auxiliary space; skewed trees push this to O(n).",
    patternFamily: "Tree / BST",
    selfTest: [
      {
        prompt: "What are the initial min and max bounds for the root?",
        answer: "-Infinity and +Infinity",
      },
      {
        prompt: "What bound changes when you go to the left child?",
        answer: "The maximum becomes the parent's value; the minimum stays the same.",
      },
      {
        prompt: "When do you return false?",
        answer: "When the current node's value is not strictly between the min and max bounds.",
      },
    ],
    interviewFraming:
      "Interviewers love this question because the naive parent-only check is a common trap. Follow-ups include recovering a BST after swapping two nodes, or validating it iteratively using an in-order traversal.",
  },
  {
    id: "t-5",
    topicId: "trees",
    title: "Lowest Common Ancestor of a BST",
    difficulty: "Medium",
    tags: ["tree", "bst"],
    problem: "Find LCA in a BST.",
    constraints: ["0 <= nodes <= 10⁴"],
    approach:
      "Use the BST property: if both targets are smaller than the current node, move left; if both are larger, move right; otherwise the current node is the split point and is the LCA.",
    dryRun: ["root=6, p=2, q=8 → 6"],
    solution: `function lowestCommonAncestor(root, p, q) {
  let cur = root;
  while (cur) {
    if (p.val < cur.val && q.val < cur.val) cur = cur.left;
    else if (p.val > cur.val && q.val > cur.val) cur = cur.right;
    else return cur;
  }
}`,
    timeComplexity: "O(h)",
    spaceComplexity: "O(1)",
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
    intuition:
      "In a general tree you would need to find paths or recurse through both sides. In a BST, the search space collapses: if both targets are smaller than the current node, the LCA must be in the left subtree; if both are larger, it is in the right subtree; otherwise the current node is the split point and is the LCA.",
    pitfalls: [
      {
        label: "Treating it like a general binary tree",
        body: "The BST property lets you skip full subtree comparisons; failing to use it wastes time.",
      },
      {
        label: "Handling equal values wrong",
        body: "If one target equals the current node, that node is the LCA; do not move further.",
      },
      {
        label: "Loop termination bug",
        body: "The loop should stop at the split point; make sure you return the node instead of falling through to undefined.",
      },
    ],
    complexityReasoning:
      "We move one level down on each iteration, so we traverse at most the height of the tree. Time is O(h) where h is the height; for a balanced BST this is O(log n) and for a skewed tree it is O(n). Only a few pointers are stored, giving O(1) space.",
    patternFamily: "Tree / BST",
    selfTest: [
      {
        prompt: "When do you stop and return the current node?",
        answer: "When p and q are on different sides, or one of them equals the current node.",
      },
      {
        prompt: "What tells you to go left?",
        answer: "Both p and q values are smaller than the current node's value.",
      },
      {
        prompt: "What is the space complexity of the iterative version?",
        answer: "O(1) because we only keep a single current pointer.",
      },
    ],
    interviewFraming:
      "This is a standard medium-level tree question that tests whether you exploit the BST ordering. Follow-ups often ask for the LCA in a plain binary tree (no BST property), which requires path storage or a different recursive approach.",
  },
  {
    id: "t-6",
    topicId: "trees",
    title: "Construct Binary Tree from Preorder and Inorder",
    difficulty: "Medium",
    tags: ["tree", "recursion"],
    problem: "Build tree from preorder and inorder traversals.",
    constraints: ["1 <= n <= 3000"],
    approach:
      "The first element of preorder is the root. Find that value in inorder; everything left of it is the left subtree and everything right is the right subtree. Slice the preorder and inorder arrays accordingly and recurse.",
    dryRun: ["pre=[3,9,20,15,7], in=[9,3,15,20,7] → standard tree"],
    solution: `function buildTree(pre, ino) {
  if (!pre.length) return null;
  const r = { val: pre[0] };
  const i = ino.indexOf(pre[0]);
  r.left = buildTree(pre.slice(1, i + 1), ino.slice(0, i));
  r.right = buildTree(pre.slice(i + 1), ino.slice(i + 1));
  return r;
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(h)",
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
    intuition:
      "A naive approach tries every possible split independently, redoing searches. The insight is that preorder tells you the root, and inorder tells you how many nodes are in the left subtree. Once you know the root, the left and right portions of inorder determine the corresponding slices of preorder.",
    pitfalls: [
      {
        label: "Slice indices off by one",
        body: "Preorder's left slice runs from index 1 to i (inclusive) when the root is at 0, where i is the root position in inorder.",
      },
      {
        label: "Copying arrays for every call",
        body: "Array slices are simple but cost O(n²) overall; mention a hashmap index to reach O(n).",
      },
      {
        label: "Forgetting the base case",
        body: "When the traversal slice is empty, return null so the parent gets the correct child pointer.",
      },
    ],
    complexityReasoning:
      "With the naive inorder indexOf inside each call, every recursive step scans O(n) nodes and there are O(n) calls, so time is O(n²). Using a hashmap to find the inorder root index in O(1) reduces this to O(n). Space is dominated by the recursion stack, O(h), plus O(n) for the stored map in the optimized version.",
    patternFamily: "Tree / BST",
    selfTest: [
      {
        prompt: "What does the first element of preorder represent?",
        answer: "The root of the current subtree.",
      },
      {
        prompt: "In inorder, what separates left and right subtrees?",
        answer: "The root's position; everything left is the left subtree, right is the right subtree.",
      },
      {
        prompt: "How do you know the size of the left subtree?",
        answer: "The number of elements before the root in the inorder array.",
      },
    ],
    interviewFraming:
      "This question tests whether you understand how traversals encode structure, not just values. Follow-ups include building from postorder and inorder, or avoiding array slices with index ranges for O(n) time and O(h) extra space.",
  },
  {
    id: "t-7",
    topicId: "trees",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    tags: ["tree", "bfs", "design"],
    problem: "Encode tree to string and back.",
    constraints: ["0 <= n <= 10⁴"],
    approach:
      "Use pre-order DFS and include explicit null markers. During deserialization, consume tokens in the same order with a shared mutable index so each recursive call knows exactly which node to build next.",
    dryRun: ["[1,2,3,null,null,4,5] ↔ '1,2,3,null,null,4,5'"],
    solution: `function serialize(r) {
  if (!r) return "#";
  return r.val + "," + serialize(r.left) + "," + serialize(r.right);
}

function deserialize(s) {
  const t = s.split(",");
  const f = () => {
    const v = t.shift();
    return v === "#" ? null : { val: +v, left: f(), right: f() };
  };
  return f();
}`,
    timeComplexity: "O(n)",
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
    intuition:
      "The straightforward idea is to list nodes somehow and rebuild them later. The insight is to preserve structure with placeholders: recording null children lets the rebuild know exactly where each real node belongs, just like commas and empty seats in a seating chart.",
    pitfalls: [
      {
        label: "Missing null markers",
        body: "Without nulls you cannot tell whether a missing child is a left or right descendant; placeholders are essential.",
      },
      {
        label: "Rebuilding with the wrong traversal order",
        body: "Deserialization must consume tokens in the same order serialization produced them (here pre-order).",
      },
      {
        label: "Index going out of bounds",
        body: "Track a shared mutable index during recursion, or use a queue, so each call reads the next token exactly once.",
      },
    ],
    complexityReasoning:
      "Serialization visits every node once and outputs O(n) tokens, including nulls. Deserialization reads each token once and creates at most one node per real token. Both run in O(n) time. The serialized string and the recursion stack use O(n) space; a skewed tree deepens the stack to O(n).",
    patternFamily: "Tree / BST",
    selfTest: [
      {
        prompt: "Why do we serialize null children?",
        answer: "They preserve the tree shape so deserialization knows where real nodes belong.",
      },
      {
        prompt: "Which traversal is used in the recursive solution?",
        answer: "Pre-order: root, left, right.",
      },
      {
        prompt: "What shared state does the recursive deserialize need?",
        answer: "A mutable index or pointer into the token list so each call reads the next token.",
      },
    ],
    interviewFraming:
      "This is a design-heavy hard question that appears in system design contexts like file formats or distributed trees. Follow-ups include compact encodings, handling different node value types, or serializing N-ary trees.",
  },
  {
    id: "t-8",
    topicId: "trees",
    title: "Path Sum",
    difficulty: "Easy",
    tags: ["tree", "dfs"],
    problem: "True if root-to-leaf path sums to target.",
    constraints: ["0 <= n <= 5000"],
    approach:
      "DFS downward while subtracting each node's value from the target. A leaf matches only if its value equals the remaining target. Return true if either left or right path succeeds.",
    dryRun: ["[5,4,8,11,null,13,4,7,2], target=22 → true"],
    solution: `function hasPathSum(r, t) {
  if (!r) return false;
  if (!r.left && !r.right) return t === r.val;
  return hasPathSum(r.left, t - r.val) || hasPathSum(r.right, t - r.val);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
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
    intuition:
      "A brute force would enumerate every path separately and sum each one, which duplicates work. The insight is to subtract the current node's value from the target as you descend; a leaf matches exactly when its value equals the remaining target. This turns a path problem into a small local check.",
    pitfalls: [
      {
        label: "Checking non-leaf nodes",
        body: "Only leaves (nodes with no children) can end a valid root-to-leaf path.",
      },
      {
        label: "Subtracting in the wrong direction",
        body: "Pass t - node.val downward, not node.val - t, so the remaining target shrinks correctly.",
      },
      {
        label: "Short-circuit return logic",
        body: "Return true if either left or right path succeeds; use ||, not &&.",
      },
    ],
    complexityReasoning:
      "Each node is visited once and constant work is done, so time is O(n). The recursion stack depth is the tree height h, giving O(h) space; the worst case is O(n) for a completely skewed tree.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "What is the base case for an empty node?",
        answer: "Return false; an empty branch cannot complete a path.",
      },
      {
        prompt: "When do you return true?",
        answer: "At a leaf when its value equals the remaining target sum.",
      },
      {
        prompt: "What value do you pass to the recursive calls?",
        answer: "t - node.val, the remaining sum after subtracting the current node.",
      },
    ],
    interviewFraming:
      "This easy tree question is often used to check attention to the root-to-leaf requirement and to base cases. Follow-ups include counting all valid paths, allowing any start node, or finding the path itself.",
  },
  {
    id: "t-9",
    topicId: "trees",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    tags: ["tree", "dfs", "dp"],
    problem: "Max path sum (any node to any node).",
    constraints: ["1 <= n <= 3*10⁴"],
    approach:
      "DFS: for each node compute the best single downward gain from it (node + max positive child gain, or zero). Update a global best with the arch path node + left gain + right gain. Return the single-gain value to the parent.",
    dryRun: ["[-10,9,20,null,null,15,7] → 42"],
    solution: `function maxPathSum(r) {
  let best = -Infinity;
  const dfs = (n) => {
    if (!n) return 0;
    const l = Math.max(0, dfs(n.left));
    const rt = Math.max(0, dfs(n.right));
    best = Math.max(best, n.val + l + rt);
    return n.val + Math.max(l, rt);
  };
  dfs(r);
  return best;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
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
    intuition:
      "The naive approach enumerates every possible path, which is exponential. The insight is that the best path through a node is node.val plus the best positive contributions from its left and right subtrees. For the global answer we can either end at this node or use it as an arch; a single DFS pass records both.",
    pitfalls: [
      {
        label: "Counting negative gains",
        body: "A subtree gain below zero should be treated as zero; otherwise the path sum decreases.",
      },
      {
        label: "Updating the global answer with a single child",
        body: "The arch path that goes through the node can use both children, while the return value to the parent can only use one.",
      },
      {
        label: "Initializing best too high",
        body: "Start best at -Infinity so a tree of all negative values still returns the least bad single node.",
      },
    ],
    complexityReasoning:
      "Each node is evaluated once and only stores a single gain and best value, so time is O(n). The recursion stack depth equals the tree height h, which is O(log n) for balanced trees and O(n) for a skewed chain. The global variable is O(1) space.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "What does dfs(node) return to its parent?",
        answer: "The maximum downward path sum starting at this node and using at most one child.",
      },
      {
        prompt: "Why do we take Math.max(gain, 0)?",
        answer: "To ignore any subtree that would reduce the path sum.",
      },
      {
        prompt: "How is the global best updated at each node?",
        answer: "best = Math.max(best, node.val + leftGain + rightGain).",
      },
    ],
    interviewFraming:
      "This is a well-known hard question that combines recursion with a global state. It appears frequently at companies that value clean state management. Follow-ups include finding the actual path nodes, or extending the idea to graphs with cycles.",
  },
  {
    id: "t-10",
    topicId: "trees",
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    tags: ["tree", "bfs", "dfs"],
    problem:
      "Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.",
    constraints: ["0 <= nodes <= 100", "-100 <= Node.val <= 100"],
    approach:
      "BFS level-order traversal. At each level, process every node and record the value of the last node dequeued. That last node is the one visible from the right side.",
    dryRun: ["[1,2,3,null,5,null,4] → [1,3,4]"],
    solution: `function rightSideView(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const sz = q.length;
    let last = null;
    for (let i = 0; i < sz; i++) {
      const n = q.shift();
      last = n.val;
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(last);
  }
  return out;
}`,
    timeComplexity: "O(n)",
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
    intuition:
      "A first attempt might be to always prefer the right child, but that misses nodes that become visible because the right side is absent. The clean insight is to collect the last node of every level during level-order traversal; those are exactly the nodes visible from the right.",
    pitfalls: [
      {
        label: "Assuming rightmost child always visible",
        body: "A node can be visible even if it is on the left, when there is no node at the same level to its right.",
      },
      {
        label: "Enqueueing right before left in BFS",
        body: "For the BFS approach order does not matter because we capture the last dequeued node of the level; for DFS you must visit right first to record depth correctly.",
      },
      {
        label: "Using DFS without first-visit guard",
        body: "In DFS you should only record a value the first time you reach a new depth, otherwise left nodes overwrite right ones.",
      },
    ],
    complexityReasoning:
      "Every node is visited once, so time is O(n). The queue can hold up to one full level, which is O(n) in the worst case (a wide tree). The output list itself also grows with the tree height, O(h) ≤ O(n).",
    patternFamily: "BFS / Level Order",
    selfTest: [
      {
        prompt: "What node represents a level in the right side view?",
        answer: "The last node visited during a complete level-order traversal of that level.",
      },
      {
        prompt: "Why does the BFS answer not depend on enqueue order?",
        answer: "Because we take the final dequeued node of the level regardless of left/right enqueue order.",
      },
      {
        prompt: "What is a likely follow-up approach using DFS?",
        answer: "Visit right children first and record a value only the first time a new depth is reached.",
      },
    ],
    interviewFraming:
      "This is a common phone-screen question disguised as a BFS exercise; interviewers often ask for both BFS and DFS solutions. Follow-ups include the left-side view, the bottom view, or a vertical order traversal.",
  },
  {
    id: "t-11",
    topicId: "trees",
    title: "Same Tree",
    difficulty: "Easy",
    tags: ["tree", "dfs"],
    problem:
      "Given the roots of two binary trees p and q, write a function to check if they are the same. Two trees are considered the same if they are structurally identical and the nodes have the same value.",
    constraints: ["0 <= nodes <= 100", "-10⁴ <= Node.val <= 10⁴"],
    approach:
      "Recursively compare current nodes, then left subtrees, then right subtrees. If both nodes are null they match; if exactly one is null or the values differ, they do not.",
    dryRun: ["p=[1,2,3], q=[1,2,3] → true; p=[1,2], q=[1,null,2] → false"],
    solution: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
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
    intuition:
      "The brute force would flatten both trees and compare arrays, which wastes space and hides structural mismatches. The recursive insight is that two trees are the same exactly when their roots match and both subtrees match; this checks structure and values together.",
    pitfalls: [
      {
        label: "Checking values before nulls",
        body: "If both nodes are null they are equal; trying to read val on null causes a runtime error.",
      },
      {
        label: "Returning early on one mismatch",
        body: "Use && so both left and right are checked; do not stop after the first comparison.",
      },
      {
        label: "Forgetting structural equality",
        body: "Two trees with the same values but different shapes are not the same; nulls must align.",
      },
    ],
    complexityReasoning:
      "In the worst case we compare every node once, so time is O(n). The recursion stack depth is bounded by the tree height h, giving O(h) auxiliary space; a skewed tree reaches O(n).",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "What is the base case when both nodes are null?",
        answer: "Return true; empty subtrees are identical.",
      },
      {
        prompt: "When do you immediately return false?",
        answer: "When exactly one node is null, or their values differ.",
      },
      {
        prompt: "What recursive calls are needed after the root comparison?",
        answer: "Compare left with left and right with right.",
      },
    ],
    interviewFraming:
      "This is a simple but important building block used inside harder tree problems like subtree checking or diffing trees. Interviewers may ask for an iterative version with two stacks or to check symmetry instead of equality.",
  },
  {
    id: "t-12",
    topicId: "trees",
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    tags: ["tree", "dfs", "string"],
    problem:
      "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot.",
    constraints: ["0 <= root.nodes <= 2000", "0 <= subRoot.nodes <= 1000"],
    approach:
      "DFS on root. At every node, if its value matches subRoot's root value, run a same-tree check. If the same-tree check succeeds we are done; otherwise keep searching the left and right children of root.",
    dryRun: ["root=[3,4,5,1,2], subRoot=[4,1,2] → true"],
    solution: `function isSubtree(root, subRoot) {
  if (!subRoot) return true;
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    timeComplexity: "O(n * m)",
    spaceComplexity: "O(h)",
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
    intuition:
      "A naive idea is to flatten both trees to strings and compare substrings, which is fragile because serialization formats can collide. The cleaner approach is to reuse the same-tree check: walk through every node of root and ask whether a complete subtree starting there matches subRoot.",
    pitfalls: [
      {
        label: "Skipping the same-tree helper",
        body: "You need a full structural comparison, not just value checks, because shapes can differ.",
      },
      {
        label: "Returning early only at the root",
        body: "A matching subtree can start at any node of root, not just the top.",
      },
      {
        label: "Edge case when subRoot is empty",
        body: "Conventionally an empty tree is a subtree of every tree; handle it explicitly to avoid crashes.",
      },
    ],
    complexityReasoning:
      "For each of the n nodes in root we may run a same-tree check over the m nodes of subRoot, giving O(n * m) time in the worst case. The recursion stack for the outer DFS is at most the height of root, O(h), and the same-tree check adds another stack of O(h_subRoot), so combined auxiliary space is O(h).",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "When do you stop and return true?",
        answer: "When isSameTree(root, subRoot) returns true at the current node.",
      },
      {
        prompt: "What happens if the current node does not match subRoot?",
        answer: "Recurse on the left and right children of root to keep searching.",
      },
      {
        prompt: "Why is the worst-case time O(n * m)?",
        answer: "We may compare every node of root against all nodes of subRoot at many starting positions.",
      },
    ],
    interviewFraming:
      "This question is often used to test whether you can compose two recursive routines cleanly. Follow-ups include an O(n + m) solution using tree hashing or serialization, or handling duplicate values efficiently.",
  },
];
