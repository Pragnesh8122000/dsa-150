import type { Question } from "../types";

const STUB_QUESTIONS: Question[] = [
  {
    id: "ll-1",
    topicId: "linked-lists",
    title: "Reverse Linked List",
    difficulty: "Easy",
    tags: ["linked-list"],
    problem: "Reverse a singly linked list.",
    constraints: ["0 <= list length <= 5000"],
    approach: "Iteratively rewire each node's next pointer to point backward. Maintain three pointers: previous (the new tail we are building), current (the node being flipped), and next (so we do not lose the rest of the list).",
    dryRun: [
      "List: 1 → 2 → 3 → 4 → null",
      "Step 1: flip 1.next to null; prev=1, cur=2",
      "Step 2: flip 2.next to 1; prev=2, cur=3",
      "Step 3: flip 3.next to 2; prev=3, cur=4",
      "Step 4: flip 4.next to 3; prev=4, cur=null",
      "Result: 4 → 3 → 2 → 1 → null",
    ],
    solution: "function reverse(head) {\n  let prev = null, cur = head;\n  while (cur) {\n    const nxt = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = nxt;\n  }\n  return prev;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,3,4]" },
      { label: "expected", value: "[4,3,2,1]" },
    ],
    vizMode: "array",
    intuition: "If you walk through the list and only ever look forward, you cannot go backward. The waste is that each node already knows its successor, but it has no memory of its predecessor. The fix is to reuse those same next pointers as we walk: temporarily remember where we were going, then redirect the current node to point back at the previous node. Imagine turning around every arrow signpost as you hike so the trail now points the opposite direction.",
    pitfalls: [
      {
        label: "Forgetting the next pointer",
        body: "If you set cur.next = prev before saving cur.next, you lose the rest of the list. Always cache nxt = cur.next first.",
      },
      {
        label: "Returning cur instead of prev",
        body: "When the loop ends, cur is null and prev is the new head. Return prev.",
      },
      {
        label: "Reversing in place on a shared list",
        body: "Mutating the list modifies it for all references. If the caller still needs the original list, clone it first or document the mutation.",
      },
    ],
    complexityReasoning: "We visit each of the n nodes exactly once and perform a constant amount of pointer work per node, so the time complexity is O(n). We only keep three extra pointers regardless of list size, so the space complexity is O(1). Recursion can also reverse a list but would cost O(n) call-stack space, so the iterative version is preferred when space is tight.",
    patternFamily: "Linked List",
    selfTest: [
      {
        prompt: "Before redirecting cur.next, what value must you save and why?",
        answer: "Save cur.next (often called nxt) so you can still reach the unprocessed portion of the list after breaking the old link.",
      },
      {
        prompt: "After the loop finishes, which pointer is the new head of the reversed list?",
        answer: "prev holds the new head because cur has walked off the end of the list and is now null.",
      },
    ],
    interviewFraming: "This is one of the most common warm-up questions in phone screens. Interviewers use it to check pointer hygiene before moving to harder problems. Likely follow-ups: reverse only a sublist, reverse k nodes at a time, or reverse the list recursively and explain the trade-offs.",
  },
  {
    id: "ll-2",
    topicId: "linked-lists",
    title: "Linked List Cycle",
    difficulty: "Easy",
    tags: ["linked-list", "two-pointers"],
    problem: "Detect if a linked list has a cycle.",
    constraints: ["0 <= list length <= 10⁴"],
    approach: "Use two pointers: slow moves one step at a time, fast moves two steps. If there is a cycle, fast will eventually lap slow from behind and they will meet. If fast reaches the end, the list is acyclic.",
    dryRun: [
      "List: 3 → 2 → 0 → -4 → (back to 2)",
      "s=3, f=3",
      "s=2, f=0",
      "s=0, f=2",
      "s=-4, f=-4  → meet, return true",
    ],
    solution: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[3,2,0,-4] with tail at index 1" },
      { label: "expected", value: "true" },
    ],
    vizMode: "array",
    intuition: "A naive approach stores every visited node in a set and checks for revisits, but that wastes extra memory. The two-pointer insight is that if the list is circular, a faster runner will always catch up to a slower runner on the loop, just like a quicker athlete lapping a slower one on a running track. If the track is straight, the faster runner reaches the finish line first.",
    pitfalls: [
      {
        label: "Missing the fast.next null check",
        body: "The loop condition must guard both fast and fast.next; otherwise fast.next.next can throw on the last node or a single-node list.",
      },
      {
        label: "Initializing slow and fast differently",
        body: "Start both at head. If you start them one step apart, a single-node list with no cycle could falsely meet.",
      },
      {
        label: "Using value equality instead of reference equality",
        body: "Nodes can have duplicate values. Check slow === fast (same object), not slow.val === fast.val.",
      },
      {
        label: "Assuming the meeting point is the cycle start",
        body: "The meeting point only proves a cycle exists. To find the cycle start, reset one pointer to head and advance both one step at a time.",
      },
    ],
    complexityReasoning: "Both pointers traverse the list at most once. If there is no cycle, fast hits the end in O(n) steps. If there is a cycle, fast enters the loop and catches slow within a number of steps proportional to the loop length, which is bounded by n. Only two pointers are stored, so the space is O(1).",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "Why does the fast pointer move two steps while slow moves one?",
        answer: "The speed difference guarantees that if both are on a cycle, fast will eventually close the gap and meet slow from behind.",
      },
      {
        prompt: "What is the safest loop condition to avoid runtime errors?",
        answer: "while (fast && fast.next). This ensures fast.next and fast.next.next are always safe to access.",
      },
    ],
    interviewFraming: "Cycle detection is a staple of linked-list rounds and is usually asked as a stepping stone to 'find the node where the cycle begins.' Follow-ups include proving why Floyd's algorithm works, finding the cycle length, and returning the entry node in O(1) space. Be ready to explain the mathematical reasoning behind resetting one pointer to the head.",
  },
  {
    id: "ll-3",
    topicId: "linked-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    tags: ["linked-list"],
    problem: "Merge two sorted lists into one sorted list.",
    constraints: ["0 <= len <= 50"],
    approach: "Create a dummy head so the first real node can be attached uniformly. Walk both lists with two pointers, always appending the smaller current node to the tail. When one list is exhausted, attach the remainder of the other list.",
    dryRun: [
      "a: 1 → 2 → 4",
      "b: 1 → 3 → 4",
      "pick a.1 → pick b.1 → pick a.2 → pick b.3 → pick a.4 → pick b.4",
      "Result: 1 → 1 → 2 → 3 → 4 → 4",
    ],
    solution: "function merge(a, b) {\n  const dummy = { next: null };\n  let tail = dummy;\n  while (a && b) {\n    if (a.val < b.val) {\n      tail.next = a;\n      a = a.next;\n    } else {\n      tail.next = b;\n      b = b.next;\n    }\n    tail = tail.next;\n  }\n  tail.next = a ?? b;\n  return dummy.next;\n}",
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,4] + [1,3,4]" },
      { label: "expected", value: "[1,1,2,3,4,4]" },
    ],
    vizMode: "array",
    intuition: "Because both lists are already sorted, the next smallest element of the result is always the smaller of the two current front elements. The brute-force way would copy everything into an array, sort it, and rebuild a list, which wastes both time and space. The insight is to treat the two lists like two piles of sorted cards and repeatedly take the smaller top card, attaching it directly without any temporary array.",
    pitfalls: [
      {
        label: "Forgetting the dummy head",
        body: "Without a dummy, the first append needs special-case logic. A dummy node lets every append, including the first, use tail.next uniformly.",
      },
      {
        label: "Not advancing tail",
        body: "After attaching a node, move tail = tail.next so the next node is appended to the end of the merged list.",
      },
      {
        label: "Advancing the wrong list",
        body: "Advance the list whose node was just appended, not both. Only the node we used should move forward.",
      },
      {
        label: "Losing the remainder of a list",
        body: "When one list becomes null, the other list is already sorted and should be attached in full with tail.next = a ?? b.",
      },
    ],
    complexityReasoning: "Each iteration consumes one node from either list a or list b, so we perform at most n + m iterations where n and m are the lengths of the two lists. All work inside the loop is constant time. The dummy node and a few pointers use O(1) extra space; the result reuses existing nodes, so no additional list nodes proportional to input size are allocated.",
    patternFamily: "Linked List",
    selfTest: [
      {
        prompt: "When list a runs out before list b, what single line finishes the merge?",
        answer: "tail.next = a ?? b, which attaches whichever remaining list is non-null.",
      },
      {
        prompt: "Why use a dummy head instead of returning the first appended node directly?",
        answer: "It removes the special case for the first node and keeps the append logic identical for every step.",
      },
    ],
    interviewFraming: "This is often the first linked-list question in a screen because it tests clean pointer handling without tricky edge cases. A common follow-up is to merge k sorted lists, which usually leads to a min-heap or divide-and-conquer approach. Another variant: merge two lists recursively and compare stack usage.",
  },
  {
    id: "ll-4",
    topicId: "linked-lists",
    title: "Reorder List",
    difficulty: "Medium",
    tags: ["linked-list", "two-pointers"],
    problem: "L0 → L1 → ... → Ln becomes L0 → Ln → L1 → Ln-1 → ...",
    constraints: ["1 <= len <= 5 * 10⁴"],
    approach: "Split the list around the middle using slow/fast pointers, reverse the second half, then interleave the two halves one node at a time.",
    dryRun: [
      "List: 1 → 2 → 3 → 4 → 5",
      "Mid split: first half 1 → 2 → 3, second half 4 → 5",
      "Reverse second half: 5 → 4",
      "Interleave: 1 → 5 → 2 → 4 → 3",
    ],
    solution: "function reorderList(head) {\n  if (!head || !head.next) return head;\n\n  // 1. Find middle (slow ends at the last node of the first half).\n  let slow = head, fast = head;\n  while (fast.next && fast.next.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n\n  // 2. Reverse the second half.\n  let prev = null, cur = slow.next;\n  slow.next = null;\n  while (cur) {\n    const nxt = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = nxt;\n  }\n\n  // 3. Merge the two halves alternately.\n  let first = head, second = prev;\n  while (second) {\n    const firstNext = first.next, secondNext = second.next;\n    first.next = second;\n    second.next = firstNext;\n    first = firstNext;\n    second = secondNext;\n  }\n\n  return head;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,3,4,5]" },
      { label: "expected", value: "[1,5,2,4,3]" },
    ],
    vizMode: "array",
    intuition: "The desired output alternates nodes from the start and the end, then the second and second-to-last, and so on. The brute-force way would store all nodes in an array and rebuild the list by index, costing O(n) extra space. The insight is that the second half of the list, when reversed, naturally gives us the end nodes in order. We can then zip the original first half and the reversed second half together like interlocking fingers.",
    pitfalls: [
      {
        label: "Forgetting to split the list",
        body: "Set slow.next = null before reversing the second half, or you will create a cycle or fail to terminate the first half correctly.",
      },
      {
        label: "Off-by-one middle position",
        body: "Advance fast with fast.next && fast.next.next so slow lands at the last node of the first half, not the first node of the second half, which keeps the merge balanced.",
      },
      {
        label: "Losing nodes during interleave",
        body: "Cache first.next and second.next before rewiring; otherwise you lose access to the unmerged remainder of each half.",
      },
      {
        label: "Handling even-length lists",
        body: "For an even number of nodes the two halves are equal length. The loop condition while (second) works for both even and odd lengths.",
      },
    ],
    complexityReasoning: "Finding the middle takes O(n), reversing the second half takes O(n), and merging the halves takes O(n). These are sequential passes, so the total time remains O(n). All operations rewire existing nodes and use only a handful of pointers, giving O(1) extra space.",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "After finding the middle, what must you do to the first half before reversing the second half?",
        answer: "Terminate the first half by setting slow.next = null so the two halves become independent lists.",
      },
      {
        prompt: "Why reverse the second half instead of traversing it backward directly?",
        answer: "A singly linked list cannot be traversed backward, so reversing gives us the end nodes in forward order for the interleave.",
      },
    ],
    interviewFraming: "Reorder List is a favorite because it combines three core linked-list techniques in one problem: slow/fast pointers, reversal, and merging. Expect follow-ups like 'do this without reversing' or 'reorder k groups at a time.' Be able to walk through each sub-procedure cleanly, because interviewers often ask you to explain the mid-finding step in isolation.",
  },
  {
    id: "ll-5",
    topicId: "linked-lists",
    title: "Remove Nth From End",
    difficulty: "Medium",
    tags: ["linked-list", "two-pointers"],
    problem: "Remove the n-th node from the end.",
    constraints: ["1 <= n <= len"],
    approach: "Create a dummy head, then advance a fast pointer n steps ahead. Move both slow and fast together until fast reaches the last node. At that point slow points to the node just before the target, so remove slow.next.",
    dryRun: [
      "List: 1 → 2 → 3 → 4 → 5, n = 2",
      "dummy → 1 → 2 → 3 → 4 → 5",
      "Advance fast n=2 steps: slow=dummy, fast=2",
      "Walk until fast.next is null: slow=3, fast=5",
      "Remove slow.next (4): 1 → 2 → 3 → 5",
    ],
    solution: "function removeNthFromEnd(head, n) {\n  const dummy = { next: head };\n  let slow = dummy, fast = dummy;\n  for (let i = 0; i < n; i++) fast = fast.next;\n  while (fast.next) {\n    slow = slow.next;\n    fast = fast.next;\n  }\n  slow.next = slow.next.next;\n  return dummy.next;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,3,4,5], n=2" },
      { label: "expected", value: "[1,2,3,5]" },
    ],
    vizMode: "array",
    intuition: "Counting from the end by first finding the length is straightforward but requires two passes over the list. The two-pointer trick collapses those passes into one: if fast is n nodes ahead of slow, then when fast hits the end, slow is automatically n nodes from the end. A dummy head lets this logic also handle removing the very first node without a special case.",
    pitfalls: [
      {
        label: "Forgetting the dummy head",
        body: "If the node to remove is the head itself, a dummy lets slow.next point to it just like any other node, avoiding an extra if-statement.",
      },
      {
        label: "Moving fast too far",
        body: "Advance fast exactly n times, not n+1. After the advance, the gap between slow and fast is n nodes.",
      },
      {
        label: "Stopping fast at the wrong node",
        body: "Loop while (fast.next), not while (fast), so that slow ends up on the predecessor of the node to remove.",
      },
      {
        label: "Not returning dummy.next",
        body: "If the head was removed, returning head would be wrong. Always return dummy.next, which is the real new head.",
      },
    ],
    complexityReasoning: "The fast pointer walks at most n steps to create the gap, then both pointers walk the remaining nodes together until fast reaches the tail. In total each node is visited at most once, so the time is O(n). We store only a few pointers and a dummy node, so the extra space is O(1).",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "How many steps do you initially advance the fast pointer?",
        answer: "Exactly n steps, creating a gap of n nodes between slow and fast.",
      },
      {
        prompt: "Why loop while (fast.next) instead of while (fast)?",
        answer: "So that slow stops on the node before the target, letting us remove slow.next directly.",
      },
    ],
    interviewFraming: "This is a classic one-pass linked-list trick that tests whether you understand dummy heads and pointer gaps. A frequent follow-up is 'remove the n-th node from the end in a single pass,' which is exactly this approach. Be prepared to explain why a dummy head simplifies edge cases and how the two-pointer invariant guarantees correctness.",
  },
  {
    id: "ll-6",
    topicId: "linked-lists",
    title: "Add Two Numbers",
    difficulty: "Medium",
    tags: ["linked-list", "math"],
    problem: "Two non-empty linked lists represent digits in reverse order. Return the sum as a linked list.",
    constraints: ["0 <= digit <= 9"],
    approach: "Walk both lists from the least significant digit, sum the corresponding values plus any carry, and append the ones digit to the result. Continue while either list has digits or a carry remains.",
    dryRun: [
      "l1: 2 → 4 → 3  (342)",
      "l2: 5 → 6 → 4  (465)",
      "2+5=7, carry 0 → 7",
      "4+6=10, carry 1 → 0",
      "3+4+1=8, carry 0 → 8",
      "Result: 7 → 0 → 8  (807)",
    ],
    solution: "function addTwoNumbers(l1, l2) {\n  const dummy = { next: null };\n  let tail = dummy, carry = 0;\n  while (l1 || l2 || carry) {\n    const sum = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;\n    tail.next = { val: sum % 10, next: null };\n    carry = sum >= 10 ? 1 : 0;\n    tail = tail.next;\n    l1 = l1?.next;\n    l2 = l2?.next;\n  }\n  return dummy.next;\n}",
    timeComplexity: "O(max(m, n))",
    spaceComplexity: "O(max(m, n))",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[2,4,3] + [5,6,4]" },
      { label: "expected", value: "[7,0,8]" },
      { label: "note", value: "342 + 465 = 807" },
    ],
    vizMode: "array",
    intuition: "The lists store digits backwards, which is actually convenient: the least significant digit is at the head, exactly where we naturally start scanning. The brute-force approach would convert each list to a number, add them, then build a new list, but that fails for huge lists and wastes memory. Instead, treat the lists like elementary-school addition done column by column, carrying the one to the next digit as you walk forward.",
    pitfalls: [
      {
        label: "Ignoring the final carry",
        body: "The loop must continue while l1, l2, or carry is non-zero, or you will miss an extra digit at the end such as 999 + 1 = 1000.",
      },
      {
        label: "Advancing a null pointer",
        body: "Use optional chaining (l1?.val, l1?.next) or explicit null checks so shorter lists do not cause errors.",
      },
      {
        label: "Computing carry incorrectly",
        body: "Carry is Math.floor(sum / 10), or since digits are 0-9 simply sum >= 10 ? 1 : 0. Do not use sum % 10 as the carry.",
      },
      {
        label: "Returning the dummy instead of dummy.next",
        body: "dummy is a placeholder. The real result starts at dummy.next.",
      },
    ],
    complexityReasoning: "We iterate until both input lists are exhausted and no carry remains, which takes at most max(m, n) + 1 iterations where m and n are the lengths of the two lists. Each iteration does O(1) work. The result list can be at most max(m, n) + 1 nodes long, so the output space is O(max(m, n)).",
    patternFamily: "Linked List",
    selfTest: [
      {
        prompt: "When one list is shorter than the other, what value should you contribute for its missing digit?",
        answer: "0, so the shorter number is effectively padded with leading zeros.",
      },
      {
        prompt: "What is the loop condition and why must it include carry?",
        answer: "while (l1 || l2 || carry) because a leftover carry can create an additional result digit.",
      },
    ],
    interviewFraming: "This problem tests careful iteration with two inputs of different lengths and a running carry. Interviewers often follow up with the harder variant where digits are stored forward (most significant digit first), which usually requires reversal or stack handling. Another follow-up: multiply two numbers represented as linked lists.",
  },
  {
    id: "ll-7",
    topicId: "linked-lists",
    title: "LRU Cache",
    difficulty: "Medium",
    tags: ["linked-list", "design", "hashmap"],
    problem: "Design an LRU (Least Recently Used) cache with O(1) get and put operations.",
    constraints: ["1 <= capacity <= 3000"],
    approach: "Combine a doubly linked list, which stores items from most-recent at the head to least-recent at the tail, with a hashmap mapping keys to list nodes. On get or put, move the accessed node to the head. When capacity is exceeded, evict the tail.",
    dryRun: [
      "LRUCache(2)",
      "put(1,1) → cache: [(1,1)]",
      "put(2,2) → cache: [(2,2), (1,1)]",
      "get(1) → 1; move 1 to front → cache: [(1,1), (2,2)]",
      "put(3,3) evicts key 2 → cache: [(3,3), (1,1)]",
      "get(2) → -1",
    ],
    solution: "class ListNode {\n  constructor(key, val) {\n    this.key = key;\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map(); // key -> ListNode\n    this.head = new ListNode(0, 0); // sentinel (most recent side)\n    this.tail = new ListNode(0, 0); // sentinel (least recent side)\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  _remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n\n  _addToHead(node) {\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n  }\n\n  _moveToHead(node) {\n    this._remove(node);\n    this._addToHead(node);\n  }\n\n  _popTail() {\n    const node = this.tail.prev;\n    this._remove(node);\n    return node;\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const node = this.map.get(key);\n    this._moveToHead(node);\n    return node.val;\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) {\n      const node = this.map.get(key);\n      node.val = value;\n      this._moveToHead(node);\n      return;\n    }\n    const node = new ListNode(key, value);\n    this.map.set(key, node);\n    this._addToHead(node);\n    if (this.map.size > this.capacity) {\n      const tail = this._popTail();\n      this.map.delete(tail.key);\n    }\n  }\n}",
    timeComplexity: "O(1)",
    spaceComplexity: "O(c)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "operations", value: "LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)" },
      { label: "expected", value: "1, -1" },
    ],
    vizMode: "array",
    intuition: "A cache needs two fast operations: find any key instantly, and know which item was used least recently. A hashmap alone gives O(1) lookups but cannot track usage order. A linked list alone tracks order but needs O(n) to find a key. The insight is to use both together: the hashmap finds the node in O(1), and the linked list maintains recency by moving that node to the front whenever it is touched. Eviction is then always the item at the back.",
    pitfalls: [
      {
        label: "Updating value without reordering",
        body: "Calling put on an existing key should update the value and move the node to the head, because it was just used.",
      },
      {
        label: "Evicting before inserting",
        body: "Insert the new node first, then check capacity. Evicting first can incorrectly remove the node you are about to update when size is already at capacity.",
      },
      {
        label: "Leaving stale map entries",
        body: "When you evict the tail node, delete its key from the map as well, or future get calls will return a detached node.",
      },
      {
        label: "Broken sentinel links",
        body: "Make sure head.next and tail.prev are always valid sentinels. Initialize them to point at each other and update all four pointers on every insertion and removal.",
      },
      {
        label: "Using a singly linked list",
        body: "Removing an arbitrary node in O(1) requires access to its previous node. A doubly linked list stores that predecessor pointer.",
      },
    ],
    complexityReasoning: "Hashmap get, set, and delete are O(1) average case. All linked-list operations (_remove, _addToHead, _moveToHead, _popTail) touch only a constant number of pointers, so they are also O(1). Therefore get and put are O(1). The cache holds at most capacity nodes plus two sentinel nodes, so the extra space is O(c), where c is the capacity.",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "What data structure tracks recency order, and what data structure gives O(1) key lookup?",
        answer: "A doubly linked list tracks recency; a hashmap gives O(1) lookup from key to node.",
        hint: "The two structures share the same node objects.",
      },
      {
        prompt: "When putting a brand-new key into a full cache, which node do you evict?",
        answer: "The least recently used node, which lives just before the tail sentinel.",
      },
    ],
    interviewFraming: "LRU Cache is a standard system-design-meets-data-structures question. Interviewers expect you to justify why a doubly linked list plus hashmap is needed and to implement the sentinel-node helper methods cleanly. Follow-ups include making it thread-safe, supporting TTL expiration, or persisting it to disk while keeping hot lookups fast.",
  },
  {
    id: "ll-8",
    topicId: "linked-lists",
    title: "Middle of the Linked List",
    difficulty: "Easy",
    tags: ["linked-list", "two-pointers"],
    problem: "Return the middle node of a linked list. If there are two middle nodes, return the second one.",
    constraints: ["1 <= list length <= 100"],
    approach: "Use a slow pointer that advances one step and a fast pointer that advances two steps. When fast reaches the end, slow is at the middle.",
    dryRun: [
      "List: 1 → 2 → 3 → 4 → 5",
      "s=1, f=1",
      "s=2, f=3",
      "s=3, f=5",
      "f.next is null, return 3",
    ],
    solution: "function middleNode(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,3,4,5]" },
      { label: "expected", value: "3" },
    ],
    vizMode: "array",
    intuition: "A naive way is to count all nodes first, then walk halfway back. That works but needs two passes. The two-pointer trick collapses the passes into one: when fast has walked twice as far as slow, slow must be halfway through the list. Picture a relay race where one runner moves at normal speed and another runs twice as fast; when the faster runner finishes, the slower runner is exactly at the midpoint.",
    pitfalls: [
      {
        label: "Wrong loop condition",
        body: "Use while (fast && fast.next) so fast.next.next is never accessed on a null or last node.",
      },
      {
        label: "Returning fast instead of slow",
        body: "fast ends up at the tail or beyond; slow is the pointer positioned at the middle node.",
      },
      {
        label: "Handling two middle nodes incorrectly",
        body: "For an even-length list, this invariant returns the second middle node because slow advances past the first middle when fast lands on the last node.",
      },
    ],
    complexityReasoning: "fast traverses at most n nodes, and each iteration moves it two steps while slow moves one. The number of loop iterations is proportional to n, so the time is O(n). Only two pointers are stored, giving O(1) extra space.",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "For a list of six nodes, which middle node does this algorithm return?",
        answer: "The second middle node (node 4), because slow is advanced while fast is still valid.",
      },
      {
        prompt: "What is the loop invariant that makes this algorithm work?",
        answer: "fast is always twice as far from the start as slow, so when fast can no longer advance, slow is at the middle.",
      },
    ],
    interviewFraming: "Finding the middle is a building block for many linked-list problems such as palindrome checks and reordering. It is often asked standalone or as the first step of a multi-part problem. Follow-ups: return the first middle node instead of the second, or use the same slow/fast technique to find the node at a given fraction of the list.",
  },
  {
    id: "ll-9",
    topicId: "linked-lists",
    title: "Odd Even Linked List",
    difficulty: "Medium",
    tags: ["linked-list"],
    problem: "Group all odd-positioned nodes together followed by all even-positioned nodes, in their original relative order.",
    constraints: ["1 <= list length <= 10⁴"],
    approach: "Partition the list in place by maintaining an odd pointer and an even pointer. Link odd nodes to the next odd node, even nodes to the next even node, then connect the tail of the odd list to the head of the even list.",
    dryRun: [
      "List: 1 → 2 → 3 → 4 → 5",
      "odd=1, even=2, evenHead=2",
      "odd.next = 3, odd = 3; even.next = 4, even = 4",
      "odd.next = 5, odd = 5; even.next = null, even = null",
      "odd.next = evenHead",
      "Result: 1 → 3 → 5 → 2 → 4",
    ],
    solution: "function oddEvenList(head) {\n  if (!head) return head;\n  let odd = head;\n  let even = head.next;\n  const evenHead = even;\n  while (even && even.next) {\n    odd.next = even.next;\n    odd = odd.next;\n    even.next = odd.next;\n    even = even.next;\n  }\n  odd.next = evenHead;\n  return head;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,3,4,5]" },
      { label: "expected", value: "[1,3,5,2,4]" },
    ],
    vizMode: "array",
    intuition: "The odd and even nodes are already in the order we want; we just need to skip over the opposite parity nodes while preserving the internal order of each group. The brute-force way would copy nodes into two arrays and splice them back, using O(n) extra space. The insight is that every odd node is followed by an even node, so odd.next is the next odd candidate and even.next is the next even candidate. We simply rewire the next pointers to hop over one node at a time.",
    pitfalls: [
      {
        label: "Forgetting to save evenHead",
        body: "Cache head.next before rewiring, because once you set odd.next = even.next you lose the start of the even list.",
      },
      {
        label: "Advancing pointers in the wrong order",
        body: "Update odd.next and move odd first, then use odd.next to update even.next and move even. Do not move even before odd is ready.",
      },
      {
        label: "Looping on odd instead of even",
        body: "Loop while (even && even.next) because even runs out first; using odd can skip the final rewire or step past the end.",
      },
      {
        label: "Leaving even.next dangling",
        body: "The last even node's next is naturally null after the loop, but verify by walking through both even and odd length lists.",
      },
    ],
    complexityReasoning: "Each iteration processes one odd and one even node, so the loop runs roughly n/2 times. Every operation inside is O(1), giving an overall O(n) time bound. We keep only four pointers (odd, even, evenHead, head), so the extra space is O(1).",
    patternFamily: "Linked List",
    selfTest: [
      {
        prompt: "Why must you cache evenHead before changing any next pointers?",
        answer: "The first even node is head.next. Once odd.next is rewired to skip over it, you need evenHead to remember where the even group starts for the final connection.",
      },
      {
        prompt: "What node does the final odd pointer connect to?",
        answer: "evenHead, the original head.next and start of the even-positioned group.",
      },
    ],
    interviewFraming: "Odd Even Linked List checks whether you can manipulate several pointers at once without losing references. It is less common as a standalone question but often appears as a follow-up to partitioning or reordering problems. Interviewers may ask for a version that groups by node value parity instead of position, which requires a different loop invariant.",
  },
  {
    id: "ll-10",
    topicId: "linked-lists",
    title: "Palindrome Linked List",
    difficulty: "Easy",
    tags: ["linked-list", "two-pointers"],
    problem: "Determine if a singly linked list is a palindrome.",
    constraints: ["0 <= list length <= 10⁵"],
    approach: "Find the middle of the list, reverse the second half, then compare the first half and the reversed second half node by node. Optionally restore the list afterward by reversing the second half back and reconnecting it.",
    dryRun: [
      "List: 1 → 2 → 2 → 1",
      "Middle is the second 2; split and reverse second half: 1 → 2",
      "Compare: 1 vs 1, 2 vs 2 → match",
      "Palindrome: true",
    ],
    solution: "function isPalindrome(head) {\n  if (!head || !head.next) return true;\n\n  // 1. Find the end of the first half.\n  let slow = head, fast = head;\n  while (fast.next && fast.next.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n\n  // 2. Reverse the second half.\n  let prev = null, cur = slow.next;\n  slow.next = null;\n  while (cur) {\n    const nxt = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = nxt;\n  }\n\n  // 3. Compare the two halves.\n  let left = head, right = prev;\n  let result = true;\n  while (right) {\n    if (left.val !== right.val) {\n      result = false;\n      break;\n    }\n    left = left.next;\n    right = right.next;\n  }\n\n  // 4. Restore the list (optional but polite).\n  cur = prev;\n  prev = null;\n  while (cur) {\n    const nxt = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = nxt;\n  }\n  slow.next = prev;\n\n  return result;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[1,2,2,1]" },
      { label: "expected", value: "true" },
    ],
    vizMode: "array",
    intuition: "A palindrome reads the same forward and backward. With an array you could use two indices from opposite ends, but a singly linked list cannot go backward. The waste is copying values into an array just to compare from both ends. The fix is to bring the back half to the front by reversing the second half of the list; now we can simply walk two forward pointers and compare them side by side.",
    pitfalls: [
      {
        label: "Wrong middle split for even length",
        body: "Use while (fast.next && fast.next.next) so slow ends at the last node of the first half, ensuring the second half is reversed cleanly for both even and odd lengths.",
      },
      {
        label: "Not terminating the first half",
        body: "Set slow.next = null before reversing so the first half is a clean list and the reversal does not loop back.",
      },
      {
        label: "Comparing unequal length halves",
        body: "For an odd-length palindrome the middle node is ignored. Loop while (right), not while (left && right), so the extra middle node on the left is skipped.",
      },
      {
        label: "Forgetting to restore the list",
        body: "Mutating the input list may surprise the interviewer or break later tests. Reverse the second half back and reconnect it to slow.next before returning.",
      },
    ],
    complexityReasoning: "Finding the middle is one linear pass, reversing the second half is at most n/2 steps, comparing the halves is at most n/2 steps, and restoring the list is another at most n/2 steps. Although there are four passes, they add up to O(n). Only a constant number of pointers are stored, so the extra space is O(1). A recursive or stack approach would use O(n) space.",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "After finding the middle, why do we reverse the second half instead of the first?",
        answer: "We need the back half in forward order so we can compare it from its original end toward its original start while walking the front half forward.",
      },
      {
        prompt: "For an odd-length list, which node is naturally ignored during comparison?",
        answer: "The exact middle node, because the right half starts just after it and is shorter by one node.",
      },
    ],
    interviewFraming: "Palindrome Linked List is popular because it elegantly combines middle-finding, reversal, and comparison, all while requiring O(1) extra space. Interviewers love asking for the follow-up that forbids using extra arrays. Another common follow-up: 'Can you do it recursively?' which trades O(n) stack space for a cleaner implementation.",
  },
];

export const QUESTIONS: Question[] = [
  ...STUB_QUESTIONS,
];
