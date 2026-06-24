import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "sq-1",
    topicId: "stacks-queues",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["stack", "string"],
    problem: "Given a string `s` containing only the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. A string is valid if open brackets are closed by the same type of bracket in the correct order.",
    constraints: ["1 <= s.length <= 10⁴", "`s` consists of parentheses only '()[]{}'"],
    approach: "Use a stack as a 'last opened, first closed' tracker. Scan left to right: push every opening bracket, and on every closing bracket pop the top and check that it matches the expected partner. If a mismatch happens, or the stack still has leftovers at the end, the string is invalid.",
    dryRun: [
      "'()[]{}': push '(', pop on ')' -> match; push '[', pop on ']' -> match; push '{', pop on '}' -> match; stack empty -> true.",
      "'(]': push '(', see ']', pop '(' but expected '[' -> mismatch -> false."
    ],
    solution: `function isValid(s) {
  const m = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const c of s) {
    if (m[c]) {
      if (st.pop() !== m[c]) return false;
    } else {
      st.push(c);
    }
  }
  return st.length === 0;
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
    intuition: "The brute-force way is to keep trying to cancel matching pairs from the outside, but a fresh closing bracket can only match the most recent still-open bracket. A stack is exactly that history: it remembers the last thing opened so the next close can check it. Think of nesting dolls — you must close the most recently opened one first.",
    pitfalls: [
      { label: "Forgetting order", body: "A closing bracket must match the most recent unmatched opening bracket, not just any unmatched one. Use a stack, not a counter or hash map alone." },
      { label: "Empty stack pop", body: "If the string starts with a closing bracket, popping from an empty stack gives undefined. Always guard by checking the stack length or let undefined fail the comparison." },
      { label: "Leftover opens", body: "Even if every close matched, unclosed opens at the end make the string invalid. Remember to return stack.length === 0." }
    ],
    complexityReasoning: "We touch each character exactly once and do only constant-time push/pop/check operations per character, so the time is O(n). The stack can hold up to every opening bracket at once in the worst case (all opens before any closes), so the extra space is O(n).",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "What do you do when you see an opening bracket?", answer: "Push it onto the stack.", hint: "Open brackets are waiting for a future partner." },
      { prompt: "What is the final check after scanning the whole string?", answer: "Return whether the stack is empty.", hint: "Unmatched opens are invalid too." }
    ],
    interviewFraming: "Valid Parentheses is the classic 'use a stack for nesting' warm-up. In interviews it often leads to follow-ups such as generating all valid sequences of n pairs, finding the minimum number of brackets to add/remove to make a string valid, or validating strings that also contain other characters."
  },
  {
    id: "sq-2",
    topicId: "stacks-queues",
    title: "Min Stack",
    difficulty: "Medium",
    tags: ["stack", "design"],
    problem: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the `MinStack` class with these operations.",
    constraints: ["Methods called at least once", "All operations must run in O(1) time", "-2³¹ <= val <= 2³¹ - 1"],
    approach: "Keep a single stack where each entry stores both the pushed value and the minimum of the stack as it was just after that value was pushed. Alternatively maintain two synchronized stacks: one for values and one for running minimums. On pop, both are shrunk together.",
    dryRun: [
      "push(-2): stack becomes [{v:-2, m:-2}]; getMin() returns -2.",
      "push(0): current min stays -2; stack becomes [{v:-2,m:-2}, {v:0,m:-2}]; getMin() returns -2.",
      "push(-3): new min is -3; stack becomes [{v:-2,m:-2}, {v:0,m:-2}, {v:-3,m:-3}]; getMin() returns -3.",
      "pop(): removes -3; getMin() now reads -2 again."
    ],
    solution: `class MinStack {
  constructor() {
    this.s = [];
  }
  push(v) {
    const m = this.getMin();
    this.s.push({
      v,
      m: m === null || v < m ? v : m,
    });
  }
  pop() {
    this.s.pop();
  }
  top() {
    return this.s.at(-1).v;
  }
  getMin() {
    return this.s.at(-1)?.m ?? null;
  }
}`,
    timeComplexity: "O(1) per op",
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
    intuition: "If you only stored the current minimum, popping could destroy your only record of what the minimum used to be. The fix is to store the minimum alongside each value, so every element carries a snapshot of the stack's minimum at that moment. It is like writing the running lowest temperature on each page of a diary.",
    pitfalls: [
      { label: "Single min variable", body: "Storing only one global minimum fails after you pop that minimum. Always keep a per-level minimum or a synchronized min stack." },
      { label: "Comparing with undefined", body: "On the first push there is no previous minimum. Treat that case as 'new value is the new minimum' to avoid undefined comparisons." },
      { label: "top vs getMin", body: "`top` returns the pushed value, `getMin` returns the stored snapshot. Do not confuse them when reading from the same node." }
    ],
    complexityReasoning: "Each operation does a constant amount of work (one push/pop and a few comparisons), so every call is O(1). Because we cache the minimum with every element, we use O(n) total extra space for n pushes, which is the minimum possible since we must remember every element anyway.",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "After pushing -2, 0, -3, what is the running minimum stored with the value 0?", answer: "-2", hint: "The running minimum never increases when a larger value arrives." },
      { prompt: "What must be updated when `pop()` removes the current minimum?", answer: "Nothing; the element below it already stores the previous minimum.", hint: "Each node carries its own min snapshot." }
    ],
    interviewFraming: "Min Stack tests whether you understand that a stack can store richer state than just raw values. Follow-ups include a Max Stack, a queue with O(1) min (hint: two stacks), or a multiset-backed version with O(log n) but cleaner code."
  },
  {
    id: "sq-3",
    topicId: "stacks-queues",
    title: "Daily Temperatures",
    difficulty: "Medium",
    tags: ["stack", "monotonic"],
    problem: "Given an array of daily temperatures `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day with a warmer temperature, `answer[i]` is 0.",
    constraints: ["1 <= temperatures.length <= 10⁵", "30 <= temperatures[i] <= 100"],
    approach: "Walk through temperatures once. Maintain a monotonically decreasing stack of indices whose warmer future day is still unknown. When the current temperature is warmer than the temperature at the index on top of the stack, that top index has just found its answer, so pop it and record the day difference. Push the current index to wait for its own future warmer day.",
    dryRun: [
      "[73,74,75,71,69,72,76,73]",
      "i=0 (73): stack [] -> push 0. stack [0]",
      "i=1 (74): 74 > 73 -> pop 0, ans[0]=1. push 1. stack [1]",
      "i=2 (75): 75 > 74 -> pop 1, ans[1]=1. push 2. stack [2]",
      "i=3 (71): push 3. stack [2,3]",
      "i=4 (69): push 4. stack [2,3,4]",
      "i=5 (72): 72 > 69 -> pop 4, ans[4]=1. 72 > 71 -> pop 3, ans[3]=2. push 5. stack [2,5]",
      "i=6 (76): 76 > 72 -> pop 5, ans[5]=1. 76 > 75 -> pop 2, ans[2]=4. push 6. stack [6]",
      "i=7 (73): push 7. end; remaining indices get 0. answer [1,1,4,2,1,1,0,0]"
    ],
    solution: `function dailyTemperatures(t) {
  const st = [];
  const ans = new Array(t.length).fill(0);
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st.at(-1)]) {
      const j = st.pop();
      ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
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
    intuition: "A naive scan for every day would look ahead up to O(n) each time, wasting work by repeatedly comparing the same temperatures. The insight is that once today is warmer than yesterday, yesterday's search is done forever. A decreasing stack keeps a backlog of 'still waiting' days; each new warm day resolves every colder day before it in one batch. Picture people in a line asking 'when will a taller person arrive?' — a tall newcomer answers that question for everyone shorter standing in front of them.",
    pitfalls: [
      { label: "Storing values instead of indices", body: "You need indices to compute the day difference. Push indices and look up temperatures when comparing." },
      { label: "Equal temperatures", body: "The condition is strictly greater. Equal temperatures do not resolve each other; they stay in the stack." },
      { label: "Popping before pushing", body: "Resolve the stack top with the current day first, then push the current day. Reversing the order skips answers." },
      { label: "Filling the answer array", body: "Initialize the answer array with zeros so leftover indices stay 0 automatically." }
    ],
    complexityReasoning: "Each index is pushed exactly once and popped at most once. Every while-loop pop corresponds to a distinct index, so the total number of stack operations across the whole scan is O(n). The answer array and the stack together use O(n) extra space.",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "When can the index on top of the stack be resolved?", answer: "When the current temperature is strictly greater than the temperature at that index.", hint: "We are waiting for the next warmer day." },
      { prompt: "What value does a day receive if no warmer day ever appears?", answer: "0", hint: "Initialize the answer array with zeros." }
    ],
    interviewFraming: "Daily Temperatures is the textbook introduction to monotonic stacks. Interviewers often rephrase it as 'next greater element' for arrays, lists, or circular arrays, and may ask for the previous greater element by walking right-to-left."
  },
  {
    id: "sq-4",
    topicId: "stacks-queues",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    tags: ["stack"],
    problem: "You are given an array of strings `tokens` that represents an arithmetic expression in Reverse Polish Notation (postfix). Evaluate the expression and return the resulting integer.",
    constraints: ["1 <= tokens.length <= 10⁴", "tokens[i] is either an integer or one of '+', '-', '*', '/'", "Division truncates toward zero"],
    approach: "Scan the tokens left to right. When you see a number, push it onto the stack. When you see an operator, pop the top two numbers, apply the operator (the second popped is the left operand), and push the result back. The final number left on the stack is the answer.",
    dryRun: [
      "['2','1','+','3','*']",
      "push 2, push 1, see '+' -> pop 1 and 2 -> 2 + 1 = 3, push 3.",
      "push 3, see '*' -> pop 3 and 3 -> 3 * 3 = 9, push 9.",
      "result = 9."
    ],
    solution: `function evalRPN(tokens) {
  const st = [];
  for (const x of tokens) {
    if ("+-*/".includes(x)) {
      const b = st.pop();
      const a = st.pop();
      if (x === "+") st.push(a + b);
      else if (x === "-") st.push(a - b);
      else if (x === "*") st.push(a * b);
      else st.push(Math.trunc(a / b));
    } else {
      st.push(Number(x));
    }
  }
  return st[0];
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
    intuition: "Postfix notation is deliberately ordered so that every operator appears exactly when its two operands are already known. A stack is the natural memory for 'values that are waiting to be combined.' Instead of parsing parentheses or precedence, you just fold the numbers as you go.",
    pitfalls: [
      { label: "Operand order", body: "The first pop is the right operand, the second pop is the left operand. Subtraction and division are not commutative, so swapping gives the wrong sign." },
      { label: "Division truncation", body: "Use Math.trunc, not floor, because negative results truncate toward zero per the problem statement." },
      { label: "Token type check", body: "Numbers are strings in the input. Convert with Number(x) before pushing so operators later receive real numbers." }
    ],
    complexityReasoning: "Each token causes one stack push and each operator causes one pop, so every token is processed in constant time. The total time is O(n). The stack never holds more than about half the tokens at once, giving O(n) worst-case space.",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "For tokens ['4','13','5','/','+'], what is the first operation performed?", answer: "13 / 5 = 2 (truncated toward zero), because both operands are ready before the '/'.", hint: "Operators fold the two most recent values." },
      { prompt: "Why is a stack the right data structure here?", answer: "Because the last value pushed is always the next operand needed by an operator.", hint: "Postfix is LIFO-friendly." }
    ],
    interviewFraming: "RPN evaluation is a common parser-adjacent question. It can lead to follow-ups like converting infix to postfix, building an expression tree from postfix, or adding unary operators and variables."
  },
  {
    id: "sq-5",
    topicId: "stacks-queues",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    tags: ["deque", "sliding-window"],
    problem: "You are given an integer array `nums` and an integer `k`. Return the maximum value in each sliding window of size k moving from left to right across the array.",
    constraints: ["1 <= k <= nums.length <= 10⁵", "-10⁴ <= nums[i] <= 10⁴"],
    approach: "Maintain a deque (double-ended queue) of indices whose values are in decreasing order. For each new index, pop from the back every smaller value because it can never become a future maximum. Remove indices from the front once they leave the window. The front of the deque is always the current window's maximum.",
    dryRun: [
      "nums = [1,3,-1,-3,5,3,6,7], k = 3",
      "i=0 (1): deque [0]",
      "i=1 (3): 3 > 1 -> pop 0. deque [1]. window not full yet.",
      "i=2 (-1): push 2. deque [1,2]. front=1 -> output 3.",
      "i=3 (-3): front 1 still in window. push 3. deque [1,2,3]. front=1 -> output 3.",
      "i=4 (5): 5 > -3,-1,3 -> pop 3,2,1. remove front if out of window. deque [4]. front=4 -> output 5.",
      "i=5 (3): push 5. deque [4,5]. front=4 -> output 5.",
      "i=6 (6): 6 > 3 -> pop 5. 6 > 5 -> pop 4. deque [6]. front=6 -> output 6.",
      "i=7 (7): 7 > 6 -> pop 6. deque [7]. front=7 -> output 7. result [3,3,5,5,6,7]"
    ],
    solution: `function maxSlidingWindow(nums, k) {
  const deque = [];
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && nums[deque.at(-1)] < nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (deque[0] <= i - k) {
      deque.shift();
    }
    if (i >= k - 1) {
      out.push(nums[deque[0]]);
    }
  }
  return out;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
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
    intuition: "The naive approach recomputes the maximum for every window from scratch, doing O(k) work each time. The smarter idea is to keep a live leaderboard of candidates: a new big number immediately evicts every smaller older number because they can never outrank it. The front of the deque is the current champion, and we boot it only when it slides out of the window.",
    pitfalls: [
      { label: "Using a plain max-heap", body: "A heap gives O(log k) per window but cannot easily discard elements that left the window. A deque is simpler and O(n) here." },
      { label: "Forgetting out-of-window eviction", body: "Always remove the front index when it is <= i - k, or the deque will report stale maxima." },
      { label: "Popping equal values", body: "Use < (strictly less) from the back so equal values stay; they may be needed after the bigger one leaves." },
      { label: "Starting output too early", body: "Only start pushing to the result once i >= k - 1, i.e., the first full window is formed." }
    ],
    complexityReasoning: "Every index enters the deque once and leaves the deque once, so the total number of push/pop/shift operations across the whole array is O(n). The deque holds at most k indices at once, so the auxiliary space is O(k). The output itself does not count toward auxiliary space.",
    patternFamily: "Sliding Window",
    selfTest: [
      { prompt: "Why can we pop smaller values from the back of the deque?", answer: "Because the new value is both larger and newer, so the smaller old value can never be a future maximum.", hint: "A future window would always prefer the newer, larger value." },
      { prompt: "When does the front of the deque become invalid?", answer: "When its index is no longer inside the current window of size k.", hint: "The champion must still be on the field." }
    ],
    interviewFraming: "Sliding Window Maximum is the flagship 'monotonic deque' problem. Interviewers often ask variants such as the maximum of all subarrays of size k, minimum instead of maximum, or median-of-window (which requires a heap or two heaps)."
  },
  {
    id: "sq-6",
    topicId: "stacks-queues",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    tags: ["stack", "monotonic"],
    problem: "Given an array of integers `heights` representing the histogram's bar heights where each bar has width 1, return the area of the largest rectangle in the histogram.",
    constraints: ["1 <= heights.length <= 10⁵", "0 <= heights[i] <= 10⁴"],
    approach: "Use a monotonically increasing stack of bar indices. Extend the histogram with a sentinel 0 at the end. For each new height, while it is lower than the height at the stack top, pop that bar: its rectangle height is its own height and its width stretches from the previous stack index to the current index. Track the maximum area seen.",
    dryRun: [
      "heights = [2,1,5,6,2,3]",
      "Append sentinel 0 -> [2,1,5,6,2,3,0]",
      "i=0 (2): stack [] -> push 0. stack [0]",
      "i=1 (1): 1 < 2 -> pop 0, width = 1, area = 2*1 = 2. push 1. stack [1]",
      "i=2 (5): push 2. stack [1,2]",
      "i=3 (6): push 3. stack [1,2,3]",
      "i=4 (2): 2 < 6 -> pop 3, width = 4-2-1 = 1, area = 6*1 = 6. 2 < 5 -> pop 2, width = 4-1-1 = 2, area = 5*2 = 10. push 4. stack [1,4]",
      "i=5 (3): push 5. stack [1,4,5]",
      "i=6 (0): 0 < 3 -> pop 5, width = 6-4-1 = 1, area = 3*1 = 3. 0 < 2 -> pop 4, width = 6-1-1 = 4, area = 2*4 = 8. 0 < 1 -> pop 1, width = 6, area = 1*6 = 6. max area = 10."
    ],
    solution: `function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;
  for (let i = 0; i <= heights.length; i++) {
    const cur = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack.at(-1)] > cur) {
      const height = heights[stack.pop()];
      const width = stack.length
        ? i - stack.at(-1) - 1
        : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
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
    intuition: "Trying every pair of bars to find the minimum in between is O(n²). The trick is to fix a bar as the limiting height and ask how far it can stretch left and right before a shorter bar blocks it. A monotonic increasing stack records previous bars in order; when a shorter bar arrives, every taller bar before it just lost its right boundary, so we can compute its best rectangle then and there.",
    pitfalls: [
      { label: "Width calculation after pop", body: "After popping index t, the new stack top is the first bar to the left that is shorter, so width = i - newTop - 1. If the stack is empty, the rectangle spans all the way to index 0." },
      { label: "Sentinel height", body: "Append a 0 at the end so every bar is forced to be popped and evaluated. Without it, leftover bars in the stack never get an area computed." },
      { label: "Strict vs non-strict comparison", body: "Use > from the back so equal-height bars stay; popping them early can split a valid wide rectangle." },
      { label: "Confusing index and value", body: "The stack stores indices; compare heights[stack.at(-1)] to the current height, not stack.at(-1) directly." }
    ],
    complexityReasoning: "Each index is pushed once and popped once. Every popped index triggers one area calculation. Therefore the total work is proportional to n, giving O(n) time. The stack can hold at most n indices, so the space is O(n).",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "Why do we append a 0 to the end of the heights array?", answer: "To guarantee every bar is eventually popped and its maximum possible rectangle is evaluated.", hint: "Without a smaller bar at the end, leftover bars would never close." },
      { prompt: "After popping an index t, how do you compute the width of its rectangle?", answer: "If the stack is non-empty, width = i - stack.at(-1) - 1; otherwise width = i.", hint: "The new top is the first shorter bar to the left." }
    ],
    interviewFraming: "Largest Rectangle in Histogram is a favorite hard-stack question at top companies. It often appears as a building block inside 'Maximal Rectangle in a Binary Matrix', where each row's prefix sum becomes a histogram."
  },
  {
    id: "sq-7",
    topicId: "stacks-queues",
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    tags: ["stack", "design", "queue"],
    problem: "Implement a first-in-first-out (FIFO) queue using only two LIFO stacks. The queue should support `push`, `pop`, `peek`, and `empty` operations.",
    constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, peek, and empty", "All calls to pop and peek are valid"],
    approach: "Use two stacks: an input stack for pushes and an output stack for pops/peeks. When output is empty and a pop or peek is requested, transfer every element from input to output, which reverses the order to FIFO. The top of output then becomes the front of the queue.",
    dryRun: [
      "push(1): input [1], output []",
      "push(2): input [1,2], output []",
      "peek(): output empty, move input -> output [2,1], peek returns 1.",
      "pop(): output top is 1, pop returns 1; output [2].",
      "push(3): input [3], output [2].",
      "pop(): output not empty, pop returns 2; output [].",
      "empty(): both stacks empty -> true."
    ],
    solution: `class MyQueue {
  constructor() {
    this.input = [];
    this.output = [];
  }
  push(x) {
    this.input.push(x);
  }
  pop() {
    this.peek();
    return this.output.pop();
  }
  peek() {
    if (this.output.length === 0) {
      while (this.input.length) {
        this.output.push(this.input.pop());
      }
    }
    return this.output.at(-1);
  }
  empty() {
    return this.input.length === 0 && this.output.length === 0;
  }
}`,
    timeComplexity: "O(1) amortized per op",
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
    intuition: "A stack reverses order, so if you push everything into one stack and then dump it into a second stack, the second stack ends up in the original order. That reversed-again order is exactly what a queue needs. Imagine loading dishes into a cabinet and then moving them to a serving tray — the first dish in is now at the front of the tray.",
    pitfalls: [
      { label: "Transferring on every peek/pop", body: "Only move elements from input to output when output is empty. Repeated transfers destroy the amortized O(1) guarantee." },
      { label: "Forgetting to reverse", body: "Moving from input to output reverses the order. If you read from input directly, you get LIFO behavior, not FIFO." },
      { label: "Empty check", body: "The queue is empty only when both input and output stacks are empty. Checking just one stack is wrong." }
    ],
    complexityReasoning: "Each element is pushed to input once, moved to output once, and popped from output once. Those three O(1) operations happen once per element over its lifetime, so any sequence of m operations costs O(m) total, or O(1) amortized per operation. The two stacks together store at most n elements, so the space is O(n).",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "When do you move elements from the input stack to the output stack?", answer: "Only when the output stack is empty and a peek or pop is requested.", hint: "Avoid moving elements back and forth repeatedly." },
      { prompt: "Why does moving everything to the output stack produce FIFO order?", answer: "Because two reversals cancel out: the first stack reverses arrivals, and the second stack reverses them back.", hint: "Think of LIFO applied twice." }
    ],
    interviewFraming: "This is a classic design question testing whether you can compose two simple data structures to mimic a third. Follow-ups may ask you to implement a queue using a single stack with recursion, or to compare the trade-offs between the two-stack and linked-list approaches."
  },
  {
    id: "sq-8",
    topicId: "stacks-queues",
    title: "Implement Stack using Queues",
    difficulty: "Easy",
    tags: ["stack", "design", "queue"],
    problem: "Implement a last-in-first-out (LIFO) stack using only FIFO queues. The stack should support `push`, `pop`, `top`, and `empty` operations.",
    constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, top, and empty", "All calls to pop and top are valid"],
    approach: "Use one main queue. On every push, enqueue the new element, then rotate all older elements behind it by dequeuing and re-enqueuing them. The new element ends up at the front, which acts as the stack top. Pop and top simply read/remove from the front.",
    dryRun: [
      "push(1): queue [1]",
      "push(2): enqueue 2 -> [1,2], then rotate 1 to back -> [2,1]",
      "top(): front is 2 -> returns 2.",
      "pop(): front is 2, remove it -> queue [1].",
      "push(3): enqueue 3 -> [1,3], rotate 1 -> [3,1]",
      "top(): returns 3."
    ],
    solution: `class MyStack {
  constructor() {
    this.q = [];
  }
  push(x) {
    this.q.push(x);
    let size = this.q.length;
    while (size > 1) {
      this.q.push(this.q.shift());
      size--;
    }
  }
  pop() {
    return this.q.shift();
  }
  top() {
    return this.q[0];
  }
  empty() {
    return this.q.length === 0;
  }
}`,
    timeComplexity: "O(n) per push",
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
    intuition: "A queue always serves the oldest element first, but a stack needs the newest. The workaround is to rearrange the queue after every push so the newest element jumps to the front. All older elements take one lap around the back, preserving their relative order while the newcomer cuts the line.",
    pitfalls: [
      { label: "Wrong rotation count", body: "Rotate exactly q.length - 1 elements after pushing. Rotating too many or too few leaves the wrong element at the front." },
      { label: "Pop from the wrong end", body: "The front of the queue is now the stack top. Use shift, not pop, or you will break the LIFO illusion." },
      { label: "Two-queue confusion", body: "It is possible with two queues by always keeping one empty, but the single-queue rotation method is simpler and common. Pick one approach and stay consistent." }
    ],
    complexityReasoning: "Each push enqueues one element and then rotates the other n - 1 elements, so push is O(n). Pop, top, and empty are O(1) because the front is already the stack top. The queue stores all n elements, giving O(n) space.",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "How many older elements must move to the back after a push?", answer: "All of them — q.length - 1 elements.", hint: "Only the new element should stay at the front." },
      { prompt: "Which end of the queue represents the stack top?", answer: "The front of the queue.", hint: "After rotation, the newest value is at index 0." }
    ],
    interviewFraming: "This question checks your understanding of FIFO versus LIFO and your comfort with pointer manipulation. Interviewers may pair it with 'implement queue using stacks' and ask which direction is more efficient, or request a two-queue solution."
  },
  {
    id: "sq-9",
    topicId: "stacks-queues",
    title: "Next Greater Element I",
    difficulty: "Easy",
    tags: ["stack", "monotonic", "array"],
    problem: "Given two arrays `nums1` and `nums2` with no duplicates, where `nums1` is a subset of `nums2`, find the next greater element for each value in `nums1` within `nums2`. The next greater element of x is the first element to the right of x in `nums2` that is larger than x. If none exists, output -1.",
    constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10⁴", "All integers in `nums1` and `nums2` are unique"],
    approach: "Preprocess `nums2` with a monotonic decreasing stack so that for each element we know the next greater element to its right. Store those answers in a map keyed by value. Then simply look up each value in `nums1` in the map.",
    dryRun: [
      "nums2 = [4,1,2], nums1 = [1,3,5,2,4]",
      "Wait — correct example: nums1 = [4,1,2], nums2 = [1,3,4,2].",
      "Build map from nums2:",
      "i=0 (1): stack [1]",
      "i=1 (3): 3 > 1 -> pop 1, map[1]=3. push 3. stack [3]",
      "i=2 (4): 4 > 3 -> pop 3, map[3]=4. push 4. stack [4]",
      "i=3 (2): push 2. stack [4,2]",
      "end: map[4]=-1, map[2]=-1",
      "Answer for nums1 [4,1,2] -> [-1,3,-1]"
    ],
    solution: `function nextGreaterElement(nums1, nums2) {
  const map = new Map();
  const stack = [];
  for (const num of nums2) {
    while (stack.length && stack.at(-1) < num) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }
  while (stack.length) {
    map.set(stack.pop(), -1);
  }
  return nums1.map((x) => map.get(x));
}`,
    timeComplexity: "O(n + m)",
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
    intuition: "A brute-force lookup for each element in nums1 scans rightward through nums2 until it finds a bigger value, repeating work for overlapping subarrays. A decreasing stack collapses that: it remembers elements still looking for a greater neighbor, and each new number automatically answers that question for every smaller number before it. It is the same idea as Daily Temperatures, but keyed by value instead of index.",
    pitfalls: [
      { label: "Using nums1 order in the stack", body: "Build the answer map from nums2, not nums1, because the next-greater relationship is defined by position in nums2." },
      { label: "Forgetting leftovers", body: "Elements still in the stack after the scan have no greater element to their right, so map them to -1." },
      { label: "Duplicate values", body: "The problem states no duplicates, but in a variant with duplicates you would need to store indices, not values, as keys." }
    ],
    complexityReasoning: "Each element of nums2 is pushed and popped at most once from the stack, so preprocessing nums2 costs O(n) where n is nums2.length. Looking up every element of nums1 in the map costs O(m). The map and stack together hold at most n elements, giving O(n) space.",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "What does a decreasing stack store while scanning nums2?", answer: "Values that have not yet found their next greater element to the right.", hint: "They are waiting for a larger future number." },
      { prompt: "What do you do with elements still in the stack after the loop?", answer: "Map them to -1 because no greater element appears to their right.", hint: "The right boundary of nums2 has been reached." }
    ],
    interviewFraming: "Next Greater Element is the standard warm-up for monotonic-stack pattern recognition. It frequently leads to the circular-array version, the next-greater-to-the-left variant, or the follow-up where you must return the actual next greater element for every position in a single array."
  },
  {
    id: "sq-10",
    topicId: "stacks-queues",
    title: "Asteroid Collision",
    difficulty: "Medium",
    tags: ["stack", "array", "simulation"],
    problem: "We are given an array `asteroids` of integers representing asteroids in a row. The absolute value represents size, and the sign represents direction: positive means right, negative means left. Find the state of the asteroids after all collisions. If two asteroids meet, the smaller one explodes; if they are the same size, both explode. Two asteroids moving in the same direction do not collide.",
    constraints: ["2 <= asteroids.length <= 10⁴", "-1000 <= asteroids[i] <= 1000", "asteroids[i] != 0"],
    approach: "Simulate leftward asteroids against a stack of rightward asteroids. Iterate through the array: push positive asteroids onto the stack. For a negative asteroid, while the stack top is positive, resolve collisions by size. If the negative asteroid survives, push it; if it is destroyed, stop. Positive stack tops are safe until a negative asteroid arrives.",
    dryRun: [
      "asteroids = [5,10,-5]",
      "5: positive -> stack [5]",
      "10: positive -> stack [5,10]",
      "-5: top is 10 (positive). |-5| < 10 -> -5 explodes. stack stays [5,10].",
      "Result [5,10]",
      "",
      "asteroids = [10,2,-5]",
      "10 -> stack [10]",
      "2 -> stack [10,2]",
      "-5: 2 < 5 -> pop 2. 10 > 5 -> -5 explodes. stack [10].",
      "Result [10]"
    ],
    solution: `function asteroidCollision(asteroids) {
  const stack = [];
  for (const a of asteroids) {
    if (a > 0) {
      stack.push(a);
    } else {
      let destroyed = false;
      while (stack.length && stack.at(-1) > 0) {
        const top = stack.at(-1);
        if (top < -a) {
          stack.pop();
        } else if (top === -a) {
          stack.pop();
          destroyed = true;
          break;
        } else {
          destroyed = true;
          break;
        }
      }
      if (!destroyed) {
        stack.push(a);
      }
    }
  }
  return stack;
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
    intuition: "Collisions only happen when a left-moving asteroid catches up to a right-moving one to its left. Once two asteroids have passed each other in the same direction, or a left-moving one is behind another left-moving one, they will never meet. A stack of surviving right-moving asteroids naturally tracks exactly the set of asteroids that a newly arriving left-moving asteroid could possibly hit, in the correct order.",
    pitfalls: [
      { label: "Missing collision condition", body: "A negative asteroid only collides with a positive stack top. If the top is also negative, they move the same direction and do not meet." },
      { label: "Breaking too early", body: "If the negative asteroid is smaller than the top, it is destroyed and you must not push it. Track a destroyed flag carefully." },
      { label: "Equal size case", body: "When sizes are equal, both asteroids explode. Pop the top and mark the incoming one destroyed." },
      { label: "Positive asteroid always pushed", body: "Right-moving asteroids never collide with the stack top if the top is also right-moving, so just push them." }
    ],
    complexityReasoning: "Each asteroid is pushed onto the stack at most once and popped at most once. Even though a single negative asteroid can pop several positive ones, each pop corresponds to a distinct asteroid that never returns. Thus the total number of operations is O(n), and the stack holds at most n asteroids, giving O(n) space.",
    patternFamily: "Stack / Monotonic Stack",
    selfTest: [
      { prompt: "When does an incoming negative asteroid stop colliding?", answer: "When it is destroyed, when it destroys an equal-sized top, or when the stack top is non-positive.", hint: "Only positive tops can collide with a left-moving asteroid." },
      { prompt: "Do two positive asteroids ever collide?", answer: "No, they move in the same direction.", hint: "Same sign means same direction." }
    ],
    interviewFraming: "Asteroid Collision is a simulation question disguised as a stack problem. It tests whether you can recognize that only opposite-direction neighbors matter. Follow-ups may ask for the number of collisions, the time order of explosions, or a variant where asteroids can change direction."
  },
];
