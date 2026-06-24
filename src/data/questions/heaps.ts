import type { Question } from "../types";

const HP_1: Question = {
  id: "hp-1",
  topicId: "heaps",
  title: "Kth Largest Element in a Stream",
  difficulty: "Easy",
  tags: ["heap", "design"],
  problem:
    "Design a class `KthLargest` that finds the `k`th largest element in a stream. The constructor accepts an integer `k` and an integer array `nums`. The `add(val)` method inserts `val` into the stream and returns the `k`th largest element. The `k`th largest is the `k`th largest in sorted order, not the `k`th distinct element.",
  constraints: [
    "1 <= k <= 10⁴",
    "0 <= nums.length <= 10⁴",
    "-10⁴ <= nums[i] <= 10⁴",
    "-10⁴ <= val <= 10⁴",
    "At most 10⁴ calls will be made to `add`.",
  ],
  approach:
    "Maintain a min-heap of size at most `k`. The root of that heap is the `k`th largest because the heap holds exactly the `k` largest values seen so far, and the smallest among them is the `k`th largest overall. On initialization, insert every number from `nums` and pop until the heap has `k` items. On `add`, insert the new value and pop if the size exceeds `k`, then return the root.",
  dryRun: [
    "k = 3, nums = [4, 5, 8, 2]",
    "After init the heap keeps [4, 5, 8]; root = 4.",
    "add(5): heap becomes [5, 5, 8]; return 5.",
    "add(10): heap becomes [5, 8, 10]; return 5.",
    "add(9): heap becomes [8, 9, 10]; return 8.",
    "add(4): heap stays [8, 9, 10]; return 8.",
  ],
  solution: `class MinHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p] <= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let smallest = i;
        if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
        if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return out;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}

class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.h = new MinHeap(nums);
    while (this.h.size() > this.k) this.h.pop();
  }
  add(val) {
    this.h.push(val);
    if (this.h.size() > this.k) this.h.pop();
    return this.h.peek();
  }
}`,
  timeComplexity: "O(log k) per `add`; O(m log k) to build from `nums` of length m.",
  spaceComplexity: "O(k)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The brute-force move is to sort the whole stream after every `add`, which is O(n log n) per call. We only need the `k`th largest, not a full sorted list. A min-heap of size `k` is like a top-k trophy case: the smallest trophy inside the case is exactly the `k`th largest overall, and anything smaller than it can be thrown away immediately.",
  pitfalls: [
    {
      label: "Keeping the whole stream sorted",
      body: "That turns every `add` into O(n log n). We only need k items, so cap the heap at k.",
    },
    {
      label: "Using a max-heap",
      body: "A max-heap returns the largest element, not the kth largest. Use a min-heap so the root is the kth largest.",
    },
    {
      label: "Forgetting to trim the heap during init",
      body: "Seed the heap with `nums`, then pop until the size is `k` so the root is immediately correct.",
    },
    {
      label: "Returning before trimming",
      body: "Always push first, then pop if the size exceeds `k`, then return the top.",
    },
  ],
  complexityReasoning:
    "Each push or pop on a heap of size at most `k` costs O(log k). Initialization processes each starting number once, giving O(m log k). Every `add` is one push and at most one pop. The heap never holds more than `k` items, so the extra space is O(k).",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "k = 2, nums = [3, 1]. What is in the heap after initialization?",
      answer: "[1, 3] with top 1, which is the 2nd largest.",
      hint: "Keep only the two largest values.",
    },
    {
      prompt: "`add(4)` is called. What happens and what is returned?",
      answer: "Push 4 -> heap [1, 3, 4], pop to size 2 -> [3, 4], return 3.",
      hint: "Push first, trim if too big, then read the root.",
    },
    {
      prompt: "Why is the root of a min-heap the kth largest, not the largest?",
      answer: "Because we intentionally keep exactly the k largest elements; the smallest among them is the kth largest overall.",
      hint: "Think of it as the 'weakest qualifier' in the top-k set.",
    },
  ],
  interviewFraming:
    "This is a classic 'streaming top-k' warm-up. Interviewers often ask it as the first half of a larger design problem: maintain the median, or the top-k trending items. The follow-up is usually to do it in one pass with O(k) memory and prove why a full sort is unnecessary.",

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
};

const HP_2: Question = {
  id: "hp-2",
  topicId: "heaps",
  title: "Last Stone Weight",
  difficulty: "Easy",
  tags: ["heap"],
  problem:
    "You have a collection of stones with positive integer weights. Each turn, choose the two heaviest stones and smash them together. If the weights are equal, both are destroyed. If they differ, the lighter one is destroyed and the heavier one is reduced by the lighter weight's value and put back. Continue until at most one stone remains. Return its weight, or 0 if no stones remain.",
  constraints: [
    "1 <= stones.length <= 30",
    "1 <= stones[i] <= 1000",
  ],
  approach:
    "Use a max-heap to always retrieve the two heaviest stones in O(log n) time. Smash them, and if a survivor remains, push its new weight back into the heap. Repeat until fewer than two stones are left.",
  dryRun: [
    "stones = [2, 7, 4, 1, 8, 1]",
    "Pop 8 and 7, push 1. Heap: [1, 1, 1, 2, 4].",
    "Pop 4 and 2, push 2. Heap: [1, 1, 1, 2].",
    "Pop 2 and 1, push 1. Heap: [1, 1, 1].",
    "Pop 1 and 1, both destroyed. Heap: [1].",
    "Return 1.",
  ],
  solution: `class MaxHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p] >= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let biggest = i;
        if (l < n && this.heap[l] > this.heap[biggest]) biggest = l;
        if (r < n && this.heap[r] > this.heap[biggest]) biggest = r;
        if (biggest === i) break;
        [this.heap[i], this.heap[biggest]] = [this.heap[biggest], this.heap[i]];
        i = biggest;
      }
    }
    return out;
  }
  size() { return this.heap.length; }
}

function lastStoneWeight(stones) {
  const h = new MaxHeap(stones);
  while (h.size() > 1) {
    const a = h.pop();
    const b = h.pop();
    if (a !== b) h.push(a - b);
  }
  return h.size() ? h.pop() : 0;
}`,
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The brute-force move is to scan the array each round to find the two biggest stones, which is O(n²). A max-heap is a priority line that always hands you the heaviest stone instantly. Each smash removes the top two and possibly reinserts one, so the heap does the heavy lifting.",
  pitfalls: [
    {
      label: "Forgetting to handle the empty-heap case",
      body: "If the last two stones are equal, the heap becomes empty. Return 0 in that case, not an undefined top.",
    },
    {
      label: "Using a min-heap without negating values",
      body: "A min-heap returns the smallest stone, which is the opposite of what you need. Either negate values or implement a max-heap.",
    },
    {
      label: "Pushing zero back into the heap",
      body: "If the two stones are equal, both are destroyed. Only push the difference if it is positive.",
    },
    {
      label: "Not reinserting the survivor",
      body: "After smashing x and y with x > y, the new stone x - y must go back into the heap for the next round.",
    },
  ],
  complexityReasoning:
    "Building the heap from n stones is O(n) with heapify or O(n log n) if we push one by one; either is fine for these constraints. Each round performs two pops and possibly one push, each O(log n), and there are at most n rounds. Total time is O(n log n). The heap stores at most n stones, so the space is O(n).",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "stones = [2, 7, 4, 1, 8, 1]. What are the first two stones popped?",
      answer: "8 and 7.",
      hint: "The heap always gives the heaviest stones first.",
    },
    {
      prompt: "After smashing 8 and 7, what is pushed back and what does the heap contain?",
      answer: "Push 1. The heap contains [1, 1, 1, 2, 4] in some heap order.",
      hint: "Subtract the smaller from the larger.",
    },
    {
      prompt: "What is returned when only one stone remains?",
      answer: "Its weight, or 0 if no stones remain.",
      hint: "Check the heap size before popping.",
    },
  ],
  interviewFraming:
    "This is a straightforward heap exercise that tests whether you know how to use a priority queue instead of repeated scanning. Follow-ups might ask you to return the remaining stones sorted, to limit the number of smashes, or to simulate the process with a multiset or balanced BST instead of a heap.",

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
};

const HP_3: Question = {
  id: "hp-3",
  topicId: "heaps",
  title: "Task Scheduler",
  difficulty: "Medium",
  tags: ["heap", "greedy"],
  problem:
    "Given an array of CPU tasks where each task is represented by an uppercase letter, and a non-negative cooling interval `n`, return the minimum number of units of time needed to finish all tasks. Each task takes one unit of time. Between any two same tasks, there must be at least `n` units of time during which they are either different tasks or idle.",
  constraints: [
    "1 <= tasks.length <= 10⁴",
    "0 <= n <= 100",
    "tasks[i] is an uppercase English letter.",
  ],
  approach:
    "Count the frequency of each task type. Use a max-heap keyed by remaining count so we always execute the most frequent remaining task first. Process tasks in cycles of length `n + 1`: pop up to `n + 1` tasks, decrement their counts, store survivors, and add the cycle length to the time. If the heap empties and no survivors remain, the final cycle is shorter, so only add the tasks actually executed that round.",
  dryRun: [
    "tasks = ['A','A','A','B','B','B'], n = 2",
    "Frequencies: A=3, B=3. Max-heap: [3A, 3B].",
    "Cycle 1: run A and B (2 tasks), push back 2A and 2B. Time += 3.",
    "Cycle 2: run A and B, push back 1A and 1B. Time += 3 -> 6.",
    "Cycle 3: run A and B, no survivors. Time += 2 -> 8.",
    "Return 8.",
  ],
  solution: `class MaxHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p][0] >= this.heap[i][0]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let biggest = i;
        if (l < n && this.heap[l][0] > this.heap[biggest][0]) biggest = l;
        if (r < n && this.heap[r][0] > this.heap[biggest][0]) biggest = r;
        if (biggest === i) break;
        [this.heap[i], this.heap[biggest]] = [this.heap[biggest], this.heap[i]];
        i = biggest;
      }
    }
    return out;
  }
  size() { return this.heap.length; }
  isEmpty() { return this.heap.length === 0; }
}

function leastInterval(tasks, n) {
  const freq = new Map();
  for (const t of tasks) freq.set(t, (freq.get(t) || 0) + 1);

  const heap = new MaxHeap();
  for (const [task, count] of freq) heap.push([count, task]);

  let time = 0;
  while (!heap.isEmpty()) {
    const temp = [];
    let cycle = n + 1;

    while (cycle > 0 && !heap.isEmpty()) {
      const [count, task] = heap.pop();
      if (count - 1 > 0) temp.push([count - 1, task]);
      time++;
      cycle--;
    }

    for (const item of temp) heap.push(item);
    if (!heap.isEmpty()) time += cycle; // idle slots
  }
  return time;
}`,
  timeComplexity: "O(n log 26), effectively O(n)",
  spaceComplexity: "O(26), effectively O(1)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The brute-force schedule tries every ordering, but the real insight is to always do the most frequent remaining task first because it is the bottleneck. A max-heap stores task counts and hands us the currently busiest task. We execute up to `n + 1` tasks per cycle; any unused slots in a non-final cycle become idle time.",
  pitfalls: [
    {
      label: "Treating all tasks as equally urgent",
      body: "Always pick the task with the highest remaining count first. A less frequent task can wait without increasing the total time.",
    },
    {
      label: "Forgetting to push leftover counts back",
      body: "After a task is used in a cycle, decrement its count. If it still has work left, reinsert it into the heap.",
    },
    {
      label: "Adding idle time after the final cycle",
      body: "Only add unused cycle slots if there are still tasks waiting. If the heap is empty after a cycle, the remaining slots were not actually needed.",
    },
    {
      label: "Off-by-one in the cycle length",
      body: "A cooldown of n means the same task needs n other tasks between two occurrences, so each cycle can hold at most n + 1 distinct tasks.",
    },
    {
      label: "Counting tasks instead of time units",
      body: "Each task takes one unit. Increment time once per task executed, then add idle slots for the rest of the cycle.",
    },
  ],
  complexityReasoning:
    "There are at most 26 distinct tasks. Building the frequency map is O(n). Every cycle removes at most n + 1 tasks from the heap and reinserts at most n + 1 survivors, each O(log 26) which is effectively constant. The number of cycles is bounded by n, the total number of tasks, so the overall time is O(n). The heap and map hold at most 26 entries, giving O(1) extra space.",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "tasks = ['A','A','A','B','B','B'], n = 2. After the first cycle, what counts are pushed back?",
      answer: "A:2 and B:2.",
      hint: "Both tasks were used once.",
    },
    {
      prompt: "Why do we add idle slots only when the heap is not empty?",
      answer: "Because idle time is only meaningful if more work remains. If the final cycle finishes all tasks, unused slots are not required.",
      hint: "Check whether there are survivors before padding.",
    },
    {
      prompt: "What is the length of one cycle when n = 2?",
      answer: "3 (n + 1).",
      hint: "Cooling interval plus one slot for the task itself.",
    },
  ],
  interviewFraming:
    "This problem is the standard 'schedule with cooldown' question. It often leads to follow-ups: what if tasks have different lengths, what if there are multiple CPUs, or how would you solve it with a greedy formula instead of a heap? Be ready to explain the max-heap version first, then derive the `(maxCount - 1) * (n + 1) + numberOfMaxCount` formula as a constant-space optimization.",

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
};

const HP_4: Question = {
  id: "hp-4",
  topicId: "heaps",
  title: "Find Median from Data Stream",
  difficulty: "Hard",
  tags: ["heap", "design"],
  problem:
    "Implement the `MedianFinder` class. `MedianFinder()` initializes the object. `addNum(num)` adds the integer `num` from the data stream to the data structure. `findMedian()` returns the median of all numbers added so far. If the count of numbers is even, the median is the average of the two middle values. At least one number will have been added before `findMedian` is called.",
  constraints: [
    "-10⁵ <= num <= 10⁵",
    "There will be at least one element in the data structure before calling `findMedian`.",
    "At most 5 * 10⁴ calls will be made to `addNum` and `findMedian`.",
  ],
  approach:
    "Maintain two heaps: a max-heap `lo` for the smaller half of the numbers and a min-heap `hi` for the larger half. Every element in `lo` must be <= every element in `hi`. After each insertion, rebalance so that `lo` is equal in size to `hi` or exactly one element larger. If the total count is odd, the median is the top of `lo`; otherwise it is the average of the two tops.",
  dryRun: [
    "addNum(1): lo = [1], hi = []. Median = 1.",
    "addNum(2): put 2 in lo, move max(2) to hi. lo = [1], hi = [2]. Median = (1 + 2) / 2 = 1.5.",
    "addNum(3): put 3 in lo, move max(3) to hi. lo = [1], hi = [2, 3]. Sizes wrong.",
    "Rebalance: move min(2) from hi back to lo. lo = [2, 1], hi = [3]. Median = 2.",
  ],
  solution: `class MinHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p] <= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let smallest = i;
        if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
        if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return out;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}

class MaxHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p] >= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let biggest = i;
        if (l < n && this.heap[l] > this.heap[biggest]) biggest = l;
        if (r < n && this.heap[r] > this.heap[biggest]) biggest = r;
        if (biggest === i) break;
        [this.heap[i], this.heap[biggest]] = [this.heap[biggest], this.heap[i]];
        i = biggest;
      }
    }
    return out;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}

class MedianFinder {
  constructor() {
    this.lo = new MaxHeap(); // smaller half
    this.hi = new MinHeap(); // larger half
  }
  addNum(num) {
    this.lo.push(num);
    this.hi.push(this.lo.pop());
    if (this.lo.size() < this.hi.size()) {
      this.lo.push(this.hi.pop());
    }
  }
  findMedian() {
    if (this.lo.size() > this.hi.size()) return this.lo.peek();
    return (this.lo.peek() + this.hi.peek()) / 2;
  }
}`,
  timeComplexity: "O(log n) per `addNum`, O(1) per `findMedian`.",
  spaceComplexity: "O(n)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The median is the middle of a sorted list. Keeping the whole list sorted on every insert is O(n). Instead, split the numbers into two halves: a max-heap for the lower half and a min-heap for the upper half. If the heaps are balanced, the median is either the top of the bigger heap or the average of both tops, and insertion is just a few heap operations.",
  pitfalls: [
    {
      label: "Balancing the wrong way",
      body: "After adding to `lo` and moving its max to `hi`, if `hi` becomes larger, move `hi`'s min back to `lo`. This keeps `lo` equal to or one larger than `hi`.",
    },
    {
      label: "Averaging integers without handling odd/even",
      body: "If the total count is odd, return the top of the larger heap. If even, return the average of the two tops. Avoid integer division by using `/ 2` on the sum.",
    },
    {
      label: "Forgetting both heaps are needed",
      body: "A single heap only gives a min or max, not the middle. You need the boundary between the two halves.",
    },
    {
      label: "Using a slow sort",
      body: "Array.prototype.sort after every add costs O(n log n). Two heaps give O(log n) per insertion.",
    },
  ],
  complexityReasoning:
    "Every `addNum` performs at most three heap pushes/pops, each O(log n) because the combined size of both heaps is n. `findMedian` only peeks at the roots, which is O(1). The heaps together store every inserted number, so the space is O(n).",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "addNum(1), addNum(2). What are the heap sizes and what is findMedian?",
      answer: "lo size 1, hi size 1, median = (1 + 2) / 2 = 1.5.",
      hint: "When sizes are equal, average the two tops.",
    },
    {
      prompt: "addNum(3) is called next. Which heap becomes larger and what is the median?",
      answer: "lo becomes size 2 with top 2; hi size 1 with top 3. Median is 2.",
      hint: "Rebalance after the insertion so lo is one larger.",
    },
    {
      prompt: "Why do we insert into `lo` first and then move its max to `hi`?",
      answer: "It guarantees every element in `lo` is <= every element in `hi`.",
      hint: "`lo` is a max-heap, so its top is the largest of the lower half.",
    },
  ],
  interviewFraming:
    "This is the textbook online-median problem and appears in system-design interviews as part of 'find the median of a stream.' Follow-ups include finding the kth percentile, supporting deletions, or approximating with histograms/count-sort when the value range is small.",

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
};

const HP_5: Question = {
  id: "hp-5",
  topicId: "heaps",
  title: "Kth Largest Element in an Array",
  difficulty: "Medium",
  tags: ["heap", "quickselect", "sorting"],
  problem:
    "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in sorted order, not the `k`th distinct element. Can you solve it without fully sorting the array?",
  constraints: [
    "1 <= k <= nums.length <= 10⁵",
    "-10⁴ <= nums[i] <= 10⁴",
  ],
  approach:
    "Use a min-heap of size `k` as a running top-k filter. Iterate through `nums`, push each value, and pop the smallest whenever the heap grows larger than `k`. After the pass, the root is the `k`th largest. This avoids sorting the whole array and uses only O(k) extra space.",
  dryRun: [
    "nums = [3, 2, 1, 5, 6, 4], k = 2",
    "Push 3: heap [3].",
    "Push 2: heap [2, 3].",
    "Push 1: heap [1, 3, 2] -> pop -> [2, 3].",
    "Push 5: heap [2, 5, 3] -> pop -> [3, 5].",
    "Push 6: heap [3, 6, 5] -> pop -> [5, 6].",
    "Push 4: heap [4, 6, 5] -> pop -> [5, 6].",
    "Return 5.",
  ],
  solution: `class MinHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p] <= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let smallest = i;
        if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
        if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return out;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}

function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const num of nums) {
    heap.push(num);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}`,
  timeComplexity: "O(n log k)",
  spaceComplexity: "O(k)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "Sorting everything gives the answer but wastes time if only the kth largest matters. A min-heap of size k acts like a top-k club: every new candidate challenges the weakest member at the door. If it is larger, it gets in and the weakest is evicted. The weakest inside is exactly the kth largest overall.",
  pitfalls: [
    {
      label: "Sorting the whole array",
      body: "`nums.sort((a,b)=>a-b)[nums.length - k]` works but is O(n log n). A heap is O(n log k) and often faster when k is small.",
    },
    {
      label: "Using a max-heap incorrectly",
      body: "If you put all n items in a max-heap and pop k times, that is O(n + k log n). It works but uses more space than a size-k min-heap.",
    },
    {
      label: "Returning the wrong root",
      body: "With a size-k min-heap, the root is the kth largest. With a size-k max-heap, the root would be the largest among an arbitrary subset.",
    },
    {
      label: "Forgetting the heap trim step",
      body: "After each push, pop while size > k so the heap never grows beyond k.",
    },
  ],
  complexityReasoning:
    "We look at each of the n numbers once and do at most one push and one pop per element on a heap of size at most k. Push/pop on a heap costs O(log k), so total time is O(n log k). The heap holds k items, giving O(k) extra space.",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "nums = [3, 2, 1, 5, 6, 4], k = 2. After processing 3, 2, 1, what is the root?",
      answer: "2.",
      hint: "The heap keeps the two largest seen so far.",
    },
    {
      prompt: "After processing 5, what is the heap?",
      answer: "[3, 5] (root 3).",
      hint: "Push 5, then evict the smallest of the three largest.",
    },
    {
      prompt: "What is the final answer?",
      answer: "5.",
      hint: "The root after the full pass is the 2nd largest.",
    },
  ],
  interviewFraming:
    "This is one of the most common heap questions and a favorite follow-up to sorting. Interviewers often ask: can you do it in O(n) average time? That is Quickselect. Be ready to discuss the trade-off: Quickselect is theoretically faster but can have poor worst-case behavior unless you use median-of-medians; the min-heap solution is simpler and deterministic.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "nums", value: "[3, 2, 1, 5, 6, 4]" },
    { label: "k", value: "2" },
    { label: "expected", value: "5" },
  ],
};

const HP_6: Question = {
  id: "hp-6",
  topicId: "heaps",
  title: "K Closest Points to Origin",
  difficulty: "Medium",
  tags: ["heap", "sorting", "math"],
  problem:
    "Given an array of points where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`. The distance between two points is the Euclidean distance. You may return the answer in any order. The answer is guaranteed to be unique except for order.",
  constraints: [
    "1 <= k <= points.length <= 10⁴",
    "-10⁴ <= xi, yi <= 10⁴",
  ],
  approach:
    "Use a max-heap of size `k` keyed by squared Euclidean distance. For each point, push `[distance, point]` and pop the farthest point whenever the heap exceeds size `k`. At the end the heap contains the `k` closest points. We use squared distance to avoid unnecessary `Math.sqrt` calls; the ordering is preserved.",
  dryRun: [
    "points = [[1, 3], [-2, 2]], k = 1",
    "Distance of [1, 3] = 1*1 + 3*3 = 10.",
    "Distance of [-2, 2] = (-2)*(-2) + 2*2 = 8.",
    "Heap holds [[10, [1, 3]]], then pushes [8, [-2, 2]].",
    "Size exceeds k, pop farthest [10, [1, 3]].",
    "Return [[-2, 2]].",
  ],
  solution: `class MaxHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p][0] >= this.heap[i][0]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let biggest = i;
        if (l < n && this.heap[l][0] > this.heap[biggest][0]) biggest = l;
        if (r < n && this.heap[r][0] > this.heap[biggest][0]) biggest = r;
        if (biggest === i) break;
        [this.heap[i], this.heap[biggest]] = [this.heap[biggest], this.heap[i]];
        i = biggest;
      }
    }
    return out;
  }
  size() { return this.heap.length; }
}

function kClosest(points, k) {
  const heap = new MaxHeap();
  for (const p of points) {
    const d2 = p[0] * p[0] + p[1] * p[1];
    heap.push([d2, p]);
    if (heap.size() > k) heap.pop();
  }
  const result = [];
  while (heap.size() > 0) result.push(heap.pop()[1]);
  return result.reverse();
}`,
  timeComplexity: "O(n log k)",
  spaceComplexity: "O(k)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "Sorting all points by distance is O(n log n). We only need the k closest, so we can use a max-heap of size k as a reject-the-farthest filter. For each point we compare its squared distance to the worst point currently in our heap and evict the farther one. We never compute square roots because ordering is preserved under squaring for non-negative distances.",
  pitfalls: [
    {
      label: "Computing actual sqrt",
      body: "You do not need Math.sqrt for comparisons. Squared distance (x*x + y*y) has the same order and avoids floating-point work.",
    },
    {
      label: "Using a min-heap instead of a max-heap",
      body: "A min-heap would give the closest point first, but we need to know the farthest of our chosen k so we can evict it. Use a max-heap keyed by distance.",
    },
    {
      label: "Forgetting points can be returned in any order",
      body: "The problem usually does not require sorting the final k points; returning the heap contents is enough.",
    },
    {
      label: "Distances with negative coordinates",
      body: "Squaring removes the sign, so (-2, 2) has the same distance as (2, 2). Just use x*x + y*y.",
    },
  ],
  complexityReasoning:
    "Each of the n points causes one heap push and possibly one pop on a heap that never holds more than k items. Heap operations cost O(log k), so total time is O(n log k). We store k points and their distances, giving O(k) space.",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "points = [[1, 3], [-2, 2]], k = 1. What are the squared distances?",
      answer: "10 and 8.",
      hint: "Compute x*x + y*y for each.",
    },
    {
      prompt: "Which point stays in the max-heap after both are processed?",
      answer: "[-2, 2], because its distance 8 is smaller than 10.",
      hint: "The heap evicts the farthest point when it exceeds size k.",
    },
    {
      prompt: "Why can we use squared distance instead of Euclidean distance?",
      answer: "Because for non-negative numbers, squaring preserves ordering; the closest point by squared distance is also the closest by actual distance.",
      hint: "Square root is a monotonic function on [0, infinity).",
    },
  ],
  interviewFraming:
    "This is the classic top-k-by-distance problem. Interviewers may ask for the k farthest points, or for points closest to an arbitrary target instead of the origin. The heap approach is expected; the advanced follow-up is a Quickselect variant that partitions by distance in O(n) average time.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "points", value: "[[1, 3], [-2, 2]]" },
    { label: "k", value: "1" },
    { label: "expected", value: "[[-2, 2]]" },
  ],
};

const HP_7: Question = {
  id: "hp-7",
  topicId: "heaps",
  title: "Reorganize String",
  difficulty: "Medium",
  tags: ["heap", "greedy", "hashmap"],
  problem:
    "Given a string `s`, rearrange its characters so that no two adjacent characters are the same. Return any valid rearrangement, or an empty string if it is impossible.",
  constraints: [
    "1 <= s.length <= 500",
    "s consists of lowercase English letters.",
  ],
  approach:
    "Count the frequency of each character. If any frequency exceeds `(s.length + 1) / 2`, return '' because the most frequent character cannot be separated. Otherwise, repeatedly place the most frequent remaining character, temporarily hold it out for one position so it never appears twice in a row, and reinsert it if it still has remaining occurrences.",
  dryRun: [
    "s = 'aab'",
    "Frequencies: a=2, b=1. Heap: [2a, 1b].",
    "Pop a (2), append 'a', hold [1, 'a'] out.",
    "Pop b (1), append 'b', reinsert [1, 'a'], hold [0, 'b'].",
    "Pop a (1), append 'a', hold [0, 'a'].",
    "Heap empty. Return 'aba'.",
  ],
  solution: `class MaxHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p][0] >= this.heap[i][0]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let biggest = i;
        if (l < n && this.heap[l][0] > this.heap[biggest][0]) biggest = l;
        if (r < n && this.heap[r][0] > this.heap[biggest][0]) biggest = r;
        if (biggest === i) break;
        [this.heap[i], this.heap[biggest]] = [this.heap[biggest], this.heap[i]];
        i = biggest;
      }
    }
    return out;
  }
  isEmpty() { return this.heap.length === 0; }
}

function reorganizeString(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);

  const max = Math.max(...freq.values());
  if (max > Math.ceil(s.length / 2)) return "";

  const heap = new MaxHeap();
  for (const [c, count] of freq) heap.push([count, c]);

  let result = "";
  let prev = null; // [count, char] waiting to be reinserted
  while (!heap.isEmpty()) {
    const [count, char] = heap.pop();
    result += char;
    if (prev && prev[0] > 0) heap.push(prev);
    prev = [count - 1, char];
  }
  return result;
}`,
  timeComplexity: "O(n log 26), effectively O(n)",
  spaceComplexity: "O(26), effectively O(1) excluding output",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The obstacle is the most frequent character: if it appears more than half the time (rounded up), there is no way to separate every pair. Once we know it is possible, we can greedily place the most frequent remaining character, then temporarily ban it from the next slot so it never sits next to itself. A max-heap makes 'most frequent' an O(log 26) operation.",
  pitfalls: [
    {
      label: "Missing the impossibility check",
      body: "If any character count exceeds (n + 1) / 2, return ''. For example 'aaab' cannot be rearranged.",
    },
    {
      label: "Reinserting the same character immediately",
      body: "After using a character, hold it out for one turn. Reinserting it right away could create adjacent duplicates.",
    },
    {
      label: "Using a max-heap of only presence",
      body: "Characters have frequencies. Store [count, char] and decrement the count each time the character is placed.",
    },
    {
      label: "Returning a string of the wrong length",
      body: "The result must use every character exactly once. Make sure you place each occurrence, not just each distinct character.",
    },
  ],
  complexityReasoning:
    "Counting characters is O(n). There are at most 26 distinct letters, so the heap never holds more than 26 items. Each placement does one pop and at most one push, costing O(log 26) which is effectively constant. Therefore total time is O(n). The frequency map and heap are O(26) extra space, plus O(n) for the output string.",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "s = 'aab'. What is the first character placed and what is held out?",
      answer: "Place 'a' and hold out 'a' with one occurrence remaining.",
      hint: "Pick the most frequent character.",
    },
    {
      prompt: "s = 'aaab'. Why is it impossible?",
      answer: "'a' appears 3 times, which is more than (4 + 1) / 2 = 2. There are not enough other characters to separate the a's.",
      hint: "Check the frequency bound.",
    },
    {
      prompt: "After placing 'b' in 'aab', what gets pushed back into the heap?",
      answer: "The held-out 'a' with count 1, because it still has an occurrence left.",
      hint: "Reinsert the previous character only if it still has remaining count.",
    },
  ],
  interviewFraming:
    "This is a popular greedy-heap question because the impossibility test is easy to miss. Interviewers often extend it to 'Rearrange String k Distance Apart,' where the same character must be at least k slots apart. That version usually needs a queue to track cooldowns along with the heap.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "s", value: '"aab"' },
    { label: "expected", value: '"aba"' },
  ],
};

const HP_8: Question = {
  id: "hp-8",
  topicId: "heaps",
  title: "Minimum Cost to Connect Sticks",
  difficulty: "Medium",
  tags: ["heap", "greedy"],
  problem:
    "You have some sticks with positive integer lengths. Connect two sticks at a time; the cost of each connection equals the sum of their lengths. Repeat until all sticks are connected into one. Return the minimum total cost to connect all the sticks.",
  constraints: [
    "1 <= sticks.length <= 10⁴",
    "1 <= sticks[i] <= 10⁴",
  ],
  approach:
    "Always connect the two smallest available sticks. Use a min-heap to retrieve them in O(log n) time. Pop the two smallest, add their sum to the total cost, push the combined stick back, and repeat until only one stick remains. This greedy choice is optimal because short sticks are reused in more future sums.",
  dryRun: [
    "sticks = [2, 4, 3]",
    "Heap: [2, 3, 4]. Pop 2 and 3, cost += 5, push 5. Heap: [4, 5].",
    "Pop 4 and 5, cost += 9, push 9. Heap: [9].",
    "Total cost = 5 + 9 = 14.",
    "Return 14.",
  ],
  solution: `class MinHeap {
  constructor(arr = []) {
    this.heap = [];
    for (const x of arr) this.push(x);
  }
  push(v) {
    this.heap.push(v);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[p] <= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const out = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last !== undefined) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const l = i * 2 + 1, r = i * 2 + 2, n = this.heap.length;
        let smallest = i;
        if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
        if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return out;
  }
  size() { return this.heap.length; }
}

function connectSticks(sticks) {
  const heap = new MinHeap(sticks);
  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.pop();
    const b = heap.pop();
    const sum = a + b;
    cost += sum;
    heap.push(sum);
  }
  return cost;
}`,
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "Think of each stick length as a weight and every connection as permanently adding that combined weight to the total. The sticks that are connected early get added into many future sums, so we want cheap, short sticks to be added many times and long sticks as few times as possible. Always picking the two smallest is the greedy choice that minimizes the total accumulated cost.",
  pitfalls: [
    {
      label: "Connecting the two largest sticks first",
      body: "That makes big sums early and they get counted again later. Always pick the two smallest.",
    },
    {
      label: "Forgetting to push the combined stick back",
      body: "After connecting two sticks, the resulting stick is still in the pool and can be connected again.",
    },
    {
      label: "Stopping when two sticks remain",
      body: "You must continue until only one stick is left. The last connection cost must be added too.",
    },
    {
      label: "Using a max-heap",
      body: "You need the smallest items each time, so a min-heap is required.",
    },
  ],
  complexityReasoning:
    "Building the heap is O(n) with heapify or O(n log n) if we push one by one. Each connection removes two sticks and inserts one, reducing the heap size by one. We do this n - 1 times, and each heap operation costs O(log n). Total time is O(n log n). The heap holds at most n stick lengths, so the space is O(n).",
  patternFamily: "Heap / Priority Queue",
  selfTest: [
    {
      prompt: "sticks = [2, 4, 3]. What is the first connection and cost?",
      answer: "Connect 2 and 3 for cost 5; the new stick pool is [4, 5].",
      hint: "Pop the two smallest.",
    },
    {
      prompt: "What is the second connection and total cost?",
      answer: "Connect 4 and 5 for cost 9; total cost = 5 + 9 = 14.",
      hint: "Add each connection cost.",
    },
    {
      prompt: "Why do we always pick the two smallest sticks?",
      answer: "Because shorter sticks will be included in more future sums; delaying large sticks reduces the total.",
      hint: "It is the same idea as Huffman coding.",
    },
  ],
  interviewFraming:
    "This is essentially the Huffman coding problem in disguise. Interviewers may call it 'minimum cost to connect ropes' or ask you to prove the greedy choice with an exchange argument. Follow-ups include handling already-sorted input optimally, or solving it with a multiset instead of a heap.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "sticks", value: "[2, 4, 3]" },
    { label: "expected", value: "14" },
  ],
};

export const QUESTIONS: Question[] = [
  HP_1,
  HP_2,
  HP_3,
  HP_4,
  HP_5,
  HP_6,
  HP_7,
  HP_8,
];
