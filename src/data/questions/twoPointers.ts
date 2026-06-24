import type { Question, AnimationStep } from "../types";

const C = {
  pointerL: "#5EEAD4",  // teal — matches --state-active (i, L, lo, left)
  pointerR: "#F472B6",  // pink — matches --state-active-alt (j, R, hi, right)
  pointerShrink: "#FBBF24",  // amber — pointer during shrink operation
  matched: "#34D399",   // emerald — successful match
  matchedSoft: "rgba(52, 211, 153, 0.18)",
} as const;

function twoSumSortedTrace(arr: number[], target: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let left = 0;
  let right = arr.length - 1;
  steps.push({
    description: `Sorted array. Start with left=0, right=${arr.length - 1}. We want arr[left] + arr[right] == ${target}.`,
    variables: { left, right, sum: arr[left] + arr[right] },
    highlights: { pointers: [
      { name: "L", index: left, color: C.pointerL },
      { name: "R", index: right, color: C.pointerR },
    ]},
    codeLine: 2,
  });
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      steps.push({
        description: `Sum = ${arr[left]} + ${arr[right]} = ${sum}. Match! Return [${left}, ${right}].`,
        variables: { left, right, sum },
        highlights: {
          pointers: [
            { name: "L", index: left, color: C.matched },
            { name: "R", index: right, color: C.matched },
          ],
          cells: [left, right],
        },
        codeLine: 5,
      });
      return steps;
    }
    if (sum < target) {
      steps.push({
        description: `Sum ${sum} < ${target}. Need a bigger sum — move L right.`,
        variables: { left, right, sum, action: "left++" },
        highlights: { pointers: [
          { name: "L", index: left, color: C.pointerL },
          { name: "R", index: right, color: C.pointerR },
        ]},
        codeLine: 7,
      });
      left++;
    } else {
      steps.push({
        description: `Sum ${sum} > ${target}. Need a smaller sum — move R left.`,
        variables: { left, right, sum, action: "right--" },
        highlights: { pointers: [
          { name: "L", index: left, color: C.pointerL },
          { name: "R", index: right, color: C.pointerR },
        ]},
        codeLine: 9,
      });
      right--;
    }
  }
  steps.push({
    description: `Pointers crossed — no pair found.`,
    variables: { left, right },
    codeLine: 11,
  });
  return steps;
}

function slidingWindowTrace(arr: number[], target: number): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let left = 0;
  let sum = 0;
  let bestLen = 0;
  steps.push({
    description: `Empty window. left=0, sum=0, bestLen=0.`,
    variables: { left, sum, bestLen },
    highlights: { pointers: [{ name: "L", index: left, color: C.pointerL }], window: [left, left] },
    codeLine: 2,
  });
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    steps.push({
      description: `Expand: add arr[${right}]=${arr[right]} to sum. sum=${sum}, window=[${left}, ${right + 1}).`,
      variables: { left, right, sum, bestLen },
      highlights: {
        pointers: [
          { name: "L", index: left, color: C.pointerL },
          { name: "R", index: right, color: C.pointerR },
        ],
        window: [left, right + 1],
      },
      codeLine: 4,
    });
    while (sum > target && left <= right) {
      steps.push({
        description: `sum ${sum} > target ${target}. Shrink: subtract arr[${left}]=${arr[left]}.`,
        variables: { left, right, sum, removing: arr[left] },
        highlights: {
          pointers: [
            { name: "L", index: left, color: C.pointerShrink },
            { name: "R", index: right, color: C.pointerR },
          ],
          window: [left, right + 1],
        },
        codeLine: 6,
      });
      sum -= arr[left];
      left++;
      steps.push({
        description: `After shrink: left=${left}, sum=${sum}, window=[${left}, ${right + 1}).`,
        variables: { left, right, sum },
        highlights: {
          pointers: [
            { name: "L", index: left, color: C.pointerL },
            { name: "R", index: right, color: C.pointerR },
          ],
          window: [left, right + 1],
        },
        codeLine: 8,
      });
    }
    const len = right - left + 1;
    if (len > bestLen) {
      bestLen = len;
      steps.push({
        description: `Window length ${len} > bestLen ${bestLen - len + len - 1} → update bestLen=${bestLen}.`,
        variables: { left, right, sum, bestLen, len },
        highlights: {
          pointers: [
            { name: "L", index: left, color: C.matched },
            { name: "R", index: right, color: C.matched },
          ],
          window: [left, right + 1],
        },
        codeLine: 10,
      });
    }
  }
  steps.push({
    description: `Done. Longest subarray with sum ≤ ${target} has length ${bestLen}.`,
    variables: { bestLen },
    codeLine: 12,
  });
  return steps;
}

function range(a: number, b: number) {
  const r: number[] = [];
  for (let i = a; i < b; i++) r.push(i);
  return r;
}

const TWO_SUM_SORTED: Question = {
  id: "tp-1",
  topicId: "two-pointers",
  title: "Two Sum II — Input Array Is Sorted",
  difficulty: "Medium",
  tags: ["two-pointers", "array", "binary-search"],
  problem:
    "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers (1-indexed). You may assume that each input has exactly one solution, and you may not use the same element twice.",
  constraints: [
    "2 <= numbers.length <= 3 * 10⁴",
    "-1000 <= numbers[i] <= 1000",
    "numbers is sorted in non-decreasing order",
    "-1000 <= target <= 1000",
    "Only one valid answer exists.",
  ],
  approach:
    "Place one pointer at the start and one at the end. At each step, the current sum tells us which pointer to move: if sum is too small, the left pointer must come right (every value to its left is even smaller); if sum is too big, the right pointer must come left. This works because the array is sorted — moving a pointer never skips a candidate that could have matched. Each pointer moves at most n times, so the total work is O(n).",
  dryRun: [
    "numbers = [2, 7, 11, 15], target = 9",
    "L=0, R=3 → 2+15=17 > 9, move R left.",
    "L=0, R=2 → 2+11=13 > 9, move R left.",
    "L=0, R=1 → 2+7=9 == 9 ✓ Return [1, 2] (1-indexed).",
  ],
  solution: `function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    }
    if (sum < target) {
      left++;   // need a bigger sum
    } else {
      right--;  // need a smaller sum
    }
  }
  return [-1, -1];
}`,
  timeComplexity: "O(n) — each pointer moves at most n times.",
  spaceComplexity: "O(1) — only two indices stored.",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The brute-force move is to try every pair: O(n²). But the array is already sorted, and that ordering is the cheat code. If the current sum is too small, every value to the left of the left pointer is even smaller, so moving the right pointer left would be hopeless. The only productive move is to drag the left pointer right and ask for a bigger number. The same logic flips when the sum is too big. Each step permanently throws away a chunk of the search space.",
  pitfalls: [
    {
      label: "Returning 0-indexed indices",
      body: "The problem asks for 1-indexed positions. The easy fix is to return [left + 1, right + 1], not the raw pointers.",
    },
    {
      label: "Moving the wrong pointer",
      body: "If sum < target, move left++. If sum > target, move right--. Swapping them walks away from the answer because sortedness no longer helps.",
    },
    {
      label: "Forgetting the sorted precondition",
      body: "This pointer dance only works because the array is sorted. If it isn't, you'd need a hash map or you'd have to sort first (and adjust index tracking).",
    },
  ],
  complexityReasoning:
    "There is no nested loop. The left pointer only marches right and the right pointer only marches left. Together they cross the array once, so the total number of pointer moves is at most n. We store only two indices, so the extra space is constant.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "numbers = [1, 3, 4, 5, 7], target = 6. L=0, R=4. Sum = 1+7 = 8. What do you do next?",
      answer: "Move R left (sum is too big; shrinking width might lower the area, but only a smaller value can help).",
      hint: "The array is sorted, so values to the right of R are only larger.",
    },
    {
      prompt: "Sum is now 1+5 = 6, a perfect match. What should you return?",
      answer: "[1, 4] (1-indexed).",
      hint: "Don't forget to add one to each pointer.",
    },
  ],
  interviewFraming:
    "This is the classic 'sorted array two-pointer' warm-up. The usual follow-up is: what if the array is not sorted? The honest answer is a hash map in one pass, or sort + two pointers if the interviewer lets you modify indices. Another twist: find three numbers that sum to zero (3Sum), which fixes one index and runs two pointers on the rest.",

  buildTrace: () => twoSumSortedTrace([2, 7, 11, 15], 9),
  sampleInput: [
    { label: "numbers", value: "[2, 7, 11, 15]" },
    { label: "target", value: "9" },
    { label: "expected", value: "[1, 2]" },
  ],
};

const CONTAINER_WITH_MOST_WATER: Question = {
  id: "tp-2",
  topicId: "two-pointers",
  title: "Container With Most Water",
  difficulty: "Medium",
  tags: ["two-pointers", "greedy", "array"],
  problem:
    "Given `n` non-negative integers `height` where each represents a point at coordinate `(i, height[i])`, find two lines that together with the x-axis form a container that holds the most water.",
  constraints: [
    "2 <= height.length <= 10⁵",
    "0 <= height[i] <= 10⁴",
  ],
  approach:
    "Brute force is O(n²) — try every pair. The two-pointer trick: start with the widest container (left=0, right=n-1). Its area is `min(height[L], height[R]) * (R - L)`. To possibly beat it we must move the shorter side — moving the taller side can only reduce width without increasing height. This is a greedy exchange argument: any optimal solution that keeps the shorter side fixed is no better than one that replaces it.",
  dryRun: [
    "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
    "L=0, R=8 → area = min(1,7) * 8 = 8. Move L (shorter).",
    "L=1, R=8 → area = min(8,7) * 7 = 49. Move R (shorter).",
    "L=1, R=7 → area = min(8,3) * 6 = 18. Move R.",
    "L=1, R=6 → area = min(8,8) * 5 = 40. Move R (tie — pick either).",
    "L=1, R=5 → area = min(8,4) * 4 = 16. Move R.",
    "L=1, R=4 → area = min(8,5) * 3 = 15. Move R.",
    "L=1, R=3 → area = min(8,2) * 2 = 4.  Move R.",
    "L=1, R=2 → area = min(8,6) * 1 = 6.  Move R.",
    "L==R → stop. Best = 49.",
  ],
  solution: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    best = Math.max(best, h * w);

    // Move the shorter side inward — moving the taller
    // can only reduce width without gaining height.
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return best;
}`,
  timeComplexity: "O(n) — single pass, each pointer moves at most n times.",
  spaceComplexity: "O(1).",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "Start with the widest possible container. Its area is width × min(left height, right height). To ever beat that area you need to find a taller boundary, because any inward move shrinks the width. The shorter boundary is the bottleneck, so it is the only one worth replacing. Moving the taller boundary can't increase height and definitely loses width — a guaranteed downgrade. That's the greedy exchange argument hiding inside the loop.",
  pitfalls: [
    {
      label: "Moving both pointers at once",
      body: "Only the shorter side can possibly unlock a better area. Move one pointer per step, then recompute the area before deciding again.",
    },
    {
      label: "Using max instead of min for height",
      body: "Water spills over the shorter line. The container height is always min(height[left], height[right]).",
    },
    {
      label: "Tie-breaking anxiety",
      body: "When heights are equal, either pointer can move first. The proof still works because both boundaries are bottlenecks; just stay consistent.",
    },
  ],
  complexityReasoning:
    "Each comparison does O(1) work, and each step advances exactly one pointer. The pointers start at the ends and move inward until they meet, so there are at most n steps total. No auxiliary data structures are needed.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "height = [3, 1, 2, 4, 5]. L=0, R=4. Area = min(3,5) × 4 = 12. Which pointer should move?",
      answer: "Move L right (the shorter side).",
      hint: "The shorter line is the bottleneck; moving the taller line cannot help.",
    },
    {
      prompt: "L is now at index 1 (height 1) and R stays at 4 (height 5). Area = 1 × 3 = 3. What pointer moves now?",
      answer: "Still move L right — it is still the shorter side.",
    },
  ],
  interviewFraming:
    "Interviewers love asking you to justify why the greedy move is safe. Be ready to give the exchange argument: any optimal container can be transformed into one that moves the shorter pointer without losing area. Common follow-ups include the O(n²) brute-force check, handling parallel vertical walls, or the variation where you must pick exactly k lines.",

  buildTrace: () => {
    const h = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const steps: AnimationStep[] = [];
    let L = 0, R = h.length - 1, best = 0;
    steps.push({
      description: `Start with widest possible container: L=0, R=${R}.`,
      variables: { L, R, width: R - L, best },
      highlights: { pointers: [
        { name: "L", index: L, color: C.pointerL },
        { name: "R", index: R, color: C.pointerR },
      ]},
      codeLine: 2,
    });
    while (L < R) {
      const width = R - L;
      const minH = Math.min(h[L], h[R]);
      const area = minH * width;
      const newBest = Math.max(best, area);
      steps.push({
        description: `h[L]=${h[L]}, h[R]=${h[R]}. minH=${minH}, width=${width}, area=${area}${newBest > best ? " ← new best" : ""}.`,
        variables: { L, R, h_L: h[L], h_R: h[R], area, best: newBest },
        highlights: { pointers: [
          { name: "L", index: L, color: C.pointerL },
          { name: "R", index: R, color: C.pointerR },
        ], cells: newBest > best ? [L, R] : [] },
        codeLine: 6,
      });
      best = newBest;
      if (h[L] < h[R]) {
        L++;
        steps.push({
          description: `height[L]=${h[L - 1]} < height[R]=${h[R]}. Move L → ${L}.`,
          variables: { L, R, best, action: "L++" },
          highlights: { pointers: [
            { name: "L", index: L, color: C.pointerL },
            { name: "R", index: R, color: C.pointerR },
          ]},
          codeLine: 10,
        });
      } else {
        R--;
        steps.push({
          description: `height[R]=${h[R + 1]} ≤ height[L]=${h[L]}. Move R → ${R}.`,
          variables: { L, R, best, action: "R--" },
          highlights: { pointers: [
            { name: "L", index: L, color: C.pointerL },
            { name: "R", index: R, color: C.pointerR },
          ]},
          codeLine: 12,
        });
      }
    }
    steps.push({
      description: `Pointers crossed. Maximum area = ${best}.`,
      variables: { best },
      codeLine: 14,
    });
    return steps;
  },
  vizMode: "bar",
  sampleInput: [
    { label: "height", value: "[1, 8, 6, 2, 5, 4, 8, 3, 7]" },
    { label: "expected", value: "49" },
  ],
};

const LONGEST_SUBARRAY: Question = {
  id: "sw-1",
  topicId: "two-pointers",
  title: "Longest Subarray With Sum ≤ Target (Sliding Window)",
  difficulty: "Medium",
  tags: ["sliding-window", "two-pointers", "array"],
  problem:
    "Given an array of non-negative integers `nums` and an integer `target`, return the length of the longest contiguous subarray whose sum is less than or equal to `target`.",
  constraints: [
    "1 <= nums.length <= 10⁵",
    "0 <= nums[i] <= 10⁴",
    "0 <= target <= 10⁹",
  ],
  approach:
    "Classic variable sliding window. Maintain a window [left, right) with sum ≤ target. Expand `right` to grow the window, then shrink `left` while the invariant is violated. Each index is added and removed at most once → O(n) total. Why is this safe? Because the array is non-negative, growing the window can only increase the sum, so once sum > target the only fix is to shrink from the left. After each expansion, the current window is the largest valid one ending at `right-1`, so we can update the answer.",
  dryRun: [
    "nums = [2, 1, 4, 1, 1, 1, 6], target = 7",
    "right=0: sum=2, best=1",
    "right=1: sum=3, best=2",
    "right=2: sum=7, best=3",
    "right=3: sum=8 > 7 → shrink left once → sum=6, left=1, best=3",
    "right=4: sum=7, best=4",
    "right=5: sum=8 > 7 → shrink once → sum=7, left=2, best=4",
    "right=6: sum=13 > 7 → shrink three times → sum=7, left=5, best=4",
    "Return 4",
  ],
  solution: `function longestSubarray(nums, target) {
  let left = 0;
  let sum = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];          // expand

    while (sum > target) {       // shrink until valid
      sum -= nums[left];
      left++;
    }

    // window [left, right] is the longest valid ending at right
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  timeComplexity: "O(n) — each index enters and leaves the window at most once.",
  spaceComplexity: "O(1).",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "The obvious plan is to enumerate every contiguous subarray, but that is O(n²). The smarter observation is that valid subarrays overlap heavily. If a window from left to right already sums to ≤ target, extending it by one element only adds one value. And if that extension breaks the limit, the fix is always to shrink from the left — because every element is non-negative, removing from the right would only make the sum smaller, but it would also waste the work we just did. Slide the edges instead of recomputing from scratch.",
  pitfalls: [
    {
      label: "Ignoring the non-negative precondition",
      body: "This sliding-window shrink logic relies on non-negativity. With negative numbers, shrinking from the left can actually increase the sum, so you'd need a prefix-sum + hashmap approach instead.",
    },
    {
      label: "Updating best before the shrink",
      body: "After expanding, the window might be invalid. Always run the shrink loop first, then record the length of the now-valid window.",
    },
    {
      label: "Using a set instead of a running sum",
      body: "Sets track membership, not totals. Maintain a running `sum` variable and adjust it when elements enter or leave the window.",
    },
  ],
  complexityReasoning:
    "The right pointer visits each index exactly once as it expands. The left pointer also only moves forward during shrinks. Together they traverse the array at most twice in total, which is still O(n). Only a few scalar variables are stored.",
  patternFamily: "Sliding Window",
  selfTest: [
    {
      prompt: "nums = [2, 1, 4, 1], target = 5. After adding index 2, sum = 7. What is the first thing you do?",
      answer: "Shrink from the left: subtract nums[0]=2, left becomes 1, sum becomes 5.",
      hint: "The window is currently invalid; fix it before updating the answer.",
    },
    {
      prompt: "Window is now [1, 2] with sum 5. What do you record?",
      answer: "best = max(best, 3), because the valid window length is 3.",
    },
  ],
  interviewFraming:
    "This is the textbook variable-size sliding window. The follow-up that breaks the template: what if numbers can be negative? Then the monotonic shrink guarantee disappears and you usually pivot to a prefix-sum map looking for subarrays of sum exactly k. Be ready to explain why non-negativity is load-bearing.",

  buildTrace: () => slidingWindowTrace([2, 1, 4, 1, 1, 1, 6], 7),
  sampleInput: [
    { label: "nums", value: "[2, 1, 4, 1, 1, 1, 6]" },
    { label: "target", value: "7" },
    { label: "expected", value: "4" },
  ],
};

const MIN_WINDOW_SUBSTRING: Question = {
  id: "sw-2",
  topicId: "two-pointers",
  title: "Minimum Window Substring",
  difficulty: "Hard",
  tags: ["sliding-window", "hashmap", "string"],
  problem:
    "Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If no such substring exists, return ''.",
  constraints: [
    "1 <= s.length, t.length <= 10⁵",
    "s and t consist of uppercase and lowercase English letters.",
  ],
  approach:
    "Maintain a window [left, right) and a `need` map (counts of chars required in t). Also track `have` = number of chars in the current window that meet their required count. Expand `right` until `have` equals the number of distinct chars in t — window is now 'valid'. Then shrink `left` as far as possible while keeping it valid, recording the minimum. Repeat. Two passes are amortized: each pointer moves at most n times.",
  dryRun: [
    "s = 'ADOBECODEBANC', t = 'ABC'",
    "Expand to 'ADOBEC' (indices 0..5), valid (has A,B,C).",
    "Shrink: drop 'A' → 'DOBEC' invalid (missing A). Stop.",
    "Expand right until the window is valid again: 'DOBECODEBAB' (1..10).",
    "Shrink as far as possible: drop 'D','O','B','E' → 'CODEBAB' valid (len 6).",
    "Continue expanding and shrinking; eventually find 'BANC' (9..12) with len 4.",
    "Return 'BANC'.",
  ],
  solution: `function minWindow(s, t) {
  if (t.length > s.length) return "";

  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  let have = 0;                 // chars whose count is satisfied
  const required = need.size;
  const window = new Map();

  let left = 0, best = [0, Infinity];

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) ?? 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) have++;

    while (have === required) {
      // window is valid — try to shrink
      if (right - left < best[1] - best[0]) best = [left, right];

      const lc = s[left];
      window.set(lc, window.get(lc) - 1);
      if (need.has(lc) && window.get(lc) < need.get(lc)) have--;
      left++;
    }
  }

  return best[1] === Infinity ? "" : s.slice(best[0], best[1] + 1);
}`,
  timeComplexity: "O(|s| + |t|).",
  spaceComplexity: "O(|s| + |t|) for the maps.",

  // ─── Phase 2 learning stations ────────────────────────────────────────────
  intuition:
    "You need every character from t, including duplicates, inside some slice of s. The brute force would check every substring: O(n²·m). Two pointers are faster because the valid region expands until it covers t, then contracts from the left as far as possible without losing coverage. Every expansion fixes a missing character; every contraction trims fat. The smallest valid window seen during the whole scan is the answer.",
  pitfalls: [
    {
      label: "Treating t as a set of characters",
      body: "Duplicates matter. If t needs two 'A's, the window must contain two 'A's. A frequency map (need) is required, not a Set.",
    },
    {
      label: "Updating `have` on any occurrence",
      body: "Only increment `have` when a needed character reaches its exact required count. Likewise, only decrement it when the count drops below the required count after a left shrink.",
    },
    {
      label: "Forgetting to restore the window map on shrink",
      body: "When you drop s[left] from the window, decrement its count in the window map. If it was a needed char and now falls short, reduce `have`.",
    },
    {
      label: "Slice off-by-one",
      body: "The best window is stored as [left, right] inclusive. When you return s.slice(best[0], best[1] + 1), don't drop the final character.",
    },
  ],
  complexityReasoning:
    "Building the need map costs O(|t|). Both pointers walk through s once, doing O(1) map work per step because the alphabet is fixed. That gives O(|s| + |t|) time. The two maps together store at most the distinct characters of t plus the characters in the current window, which is bounded by O(|s| + |t|).",
  patternFamily: "Sliding Window",
  selfTest: [
    {
      prompt: "s = 'ADOBECODEBANC', t = 'ABC'. After expanding to 'ADOBEC' (indices 0..5), is the window valid?",
      answer: "Yes — it contains at least one A, one B, and one C.",
      hint: "Check the frequency map, not just presence.",
    },
    {
      prompt: "The window is valid. What is the next goal?",
      answer: "Shrink from the left as much as possible while keeping the window valid, then record the smallest length.",
      hint: "A valid window can usually be made smaller; don't stop at the first one.",
    },
  ],
  interviewFraming:
    "This is the canonical 'smallest subarray covering a target set' problem. Interviewers often rephrase it as: find the shortest subarray containing all values from a given set, or the shortest substring with all distinct characters. The same need/have two-map template applies. A common optimization is to use a fixed-size array of 128 or 256 instead of Maps when the alphabet is known.",

  buildTrace: () => {
    const s = "ADOBECODEBANC";
    const t = "ABC";
    const steps: AnimationStep[] = [];
    const need = new Map<string, number>();
    for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
    const window = new Map<string, number>();
    let have = 0;
    const required = need.size;
    let left = 0;
    let best = [0, Infinity];
    steps.push({
      description: `need={A:1,B:1,C:1}, required=${required}. Expand right pointer.`,
      variables: { left, right: -1, have, bestLen: Infinity },
      highlights: { window: [left, left] },
      codeLine: 12,
    });
    for (let right = 0; right < s.length; right++) {
      const c = s[right];
      window.set(c, (window.get(c) ?? 0) + 1);
      if (need.has(c) && window.get(c) === need.get(c)) have++;
      steps.push({
        description: `right=${right}, add '${c}'. have=${have}/${required}. window='${s.slice(left, right + 1)}'.`,
        variables: { left, right, have, char: c, windowStr: s.slice(left, right + 1) },
        highlights: { window: [left, right + 1] },
        codeLine: 14,
      });
      while (have === required) {
        if (right - left < best[1] - best[0]) {
          best = [left, right];
        }
        steps.push({
          description: `Valid! Try shrink: best candidate = '${s.slice(best[0], best[1] + 1)}' (len ${best[1] - best[0] + 1}).`,
          variables: { left, right, bestStart: best[0], bestEnd: best[1] },
          highlights: { window: [left, right + 1], cells: range(left, right + 1) },
          codeLine: 19,
        });
        const lc = s[left];
        window.set(lc, window.get(lc)! - 1);
        if (need.has(lc) && window.get(lc)! < need.get(lc)!) have--;
        left++;
        steps.push({
          description: `Drop '${lc}' from left. left=${left}. have=${have}/${required}.`,
          variables: { left, right, have, dropped: lc },
          highlights: { window: [left, right + 1] },
          codeLine: 22,
        });
      }
    }
    steps.push({
      description: `Done. Minimum window = '${s.slice(best[0], best[1] + 1)}'.`,
      variables: { answer: s.slice(best[0], best[1] + 1) },
      codeLine: 26,
    });
    return steps;
  },
  sampleInput: [
    { label: "s", value: '"ADOBECODEBANC"' },
    { label: "t", value: '"ABC"' },
    { label: "expected", value: '"BANC"' },
  ],
};

const THREE_SUM: Question = {
  id: "tp-3",
  topicId: "two-pointers",
  title: "3Sum",
  difficulty: "Medium",
  tags: ["two-pointers", "sorting"],
  problem:
    "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.",
  constraints: [
    "0 <= nums.length <= 3000",
    "-10⁵ <= nums[i] <= 10⁵",
  ],
  approach:
    "Sort the array. Fix the first element `i`, then run a two-pointer search on the subarray to its right looking for a pair that sums to `-nums[i]`. Because the array is sorted, the pair search is O(n). Skip duplicate values for `i`, and after finding a valid pair skip duplicate values for `l` and `r` so the result contains only unique triplets.",
  dryRun: [
    "nums = [-1, 0, 1, 2, -1, -4]",
    "After sorting: [-4, -1, -1, 0, 1, 2]",
    "i=0 (-4): l=1, r=5 → -4 + -1 + 2 = -3 < 0 → l++",
    "i=0: l=2, r=5 → -4 + -1 + 2 = -3 < 0 → l++",
    "i=0: l=3, r=5 → -4 + 0 + 2 = -2 < 0 → l++",
    "i=0: l=4, r=5 → -4 + 1 + 2 = -1 < 0 → l++ (exhausted)",
    "i=1 (-1): l=2, r=5 → -1 + -1 + 2 = 0 ✓ record [-1, -1, 2]",
    "skip duplicates, then l=3, r=4 → -1 + 0 + 1 = 0 ✓ record [-1, 0, 1]",
    "i=2 is duplicate of i=1 → skip",
    "i=3 (0): l=4, r=5 → 0 + 1 + 2 = 3 > 0 → r-- (exhausted)",
    "Return [[-1, -1, 2], [-1, 0, 1]]",
  ],
  solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let l = i + 1;
    let r = nums.length - 1;

    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        out.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++;
        r--;
      } else if (s < 0) {
        l++;
      } else {
        r--;
      }
    }
  }
  return out;
}`,
  timeComplexity: "O(n²) — sorting is O(n log n), and the nested two-pointer scan is O(n²).",
  spaceComplexity: "O(1) excluding the output array (the sort may use O(log n) stack).",

  intuition:
    "Trying every triplet directly costs three nested loops: O(n³). The fix is the same sorted-array cheat code used in Two Sum II. Sort `nums`, lock one element, and the remaining two-sum problem becomes a two-pointer walk. Skipping duplicates after each match guarantees the output has no repeated triplets without extra hashing.",
  pitfalls: [
    {
      label: "Forgetting to sort",
      body: "Two pointers only work because the subarray is sorted. Sort `nums` first, and remember that the original indices are lost — the problem only asks for values.",
    },
    {
      label: "Duplicate triplets",
      body: "Skip equal values when advancing `i`, `l`, or `r`. After recording a triplet, move `l` and `r` past any repeated values before continuing the search.",
    },
    {
      label: "Moving only one pointer after a match",
      body: "A valid triplet means both `l` and `r` must move inward to look for the next distinct pair. Moving just one pointer can revisit the same combination.",
    },
    {
      label: "Using i <= nums.length - 2 as the loop bound",
      body: "You need at least two elements after `i` for `l` and `r`. Use `i < nums.length - 2`.",
    },
  ],
  complexityReasoning:
    "Sorting costs O(n log n). For each of the n choices of `i`, the inner while loop moves `l` right and `r` left at most n positions total. That makes the pair search O(n) per `i`, or O(n²) overall. The O(n log n) sort is swallowed by the O(n²) term. Only the output array and a few scalar variables are stored.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "nums = [-4, -1, -1, 0, 1, 2]. i = 0, l = 1, r = 5. Sum = -3. Which pointer moves?",
      answer: "Move l right; we need a larger sum to reach 0.",
      hint: "The array is sorted, so increasing l raises the sum.",
    },
    {
      prompt: "A triplet [-1, -1, 2] is found. What must happen before continuing the two-pointer scan?",
      answer: "Advance l and r past any duplicate values, then move both inward.",
      hint: "The goal is unique triplets; repeated -1s or 2s would generate the same answer.",
    },
  ],
  interviewFraming:
    "3Sum is the direct follow-up to Two Sum II. Interviewers often ask you to first solve the unsorted Two Sum, then extend to 3Sum, then 4Sum or k-Sum. Be ready to discuss why sorting + two pointers beats a hash set when only values (not indices) are required, and how duplicate skipping keeps the output clean.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "nums", value: "[-1, 0, 1, 2, -1, -4]" },
    { label: "expected", value: "[[-1, -1, 2], [-1, 0, 1]]" },
  ],
};

const TRAPPING_RAIN_WATER: Question = {
  id: "tp-4",
  topicId: "two-pointers",
  title: "Trapping Rain Water",
  difficulty: "Hard",
  tags: ["two-pointers", "stack", "dp"],
  problem:
    "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
  constraints: [
    "1 <= height.length <= 2 * 10⁴",
    "0 <= height[i] <= 10⁵",
  ],
  approach:
    "Use two pointers starting at the ends and maintain the tallest bar seen from the left (`leftMax`) and from the right (`rightMax`). Always process the shorter side: water trapped at that boundary is `maxSoFar - height[i]`. Move that pointer inward. This is safe because the water level at a position is controlled by the lower of the highest bars on its two sides; by always moving from the currently shorter side, `leftMax` or `rightMax` is the limiting wall, so the trapped water can be computed immediately.",
  dryRun: [
    "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
    "l=0, r=11: h[l]=0 < h[r]=1 → leftMax=0, water += 0, l=1",
    "l=1, r=11: h[l]=1 ≥ h[r]=1 → rightMax=1, water += 0, r=10",
    "l=1, r=10: h[l]=1 < h[r]=2 → leftMax=1, water += 0, l=2",
    "l=2, r=10: h[l]=0 < h[r]=2 → leftMax=1, water += 1, l=3",
    "l=3, r=10: h[l]=2 ≥ h[r]=2 → rightMax=2, water += 0, r=9",
    "... continue inward ...",
    "Total trapped water = 6",
  ],
  solution: `function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (l < r) {
    if (height[l] < height[r]) {
      leftMax = Math.max(leftMax, height[l]);
      water += leftMax - height[l];
      l++;
    } else {
      rightMax = Math.max(rightMax, height[r]);
      water += rightMax - height[r];
      r--;
    }
  }
  return water;
}`,
  timeComplexity: "O(n) — each pointer moves at most n times.",
  spaceComplexity: "O(1).",

  intuition:
    "The brute-force way asks, for every bar, 'what is the highest bar to my left and right?' That is O(n²). The two-pointer shortcut notices that you only ever need the smaller of those two maxima. If the left side is currently lower, its water level is already decided by `leftMax`; no future bar on the right can lower it because `height[r]` is at least as tall. So compute the water at `l` and move inward. The same logic applies symmetrically on the right.",
  pitfalls: [
    {
      label: "Processing the taller side first",
      body: "Always move the shorter side. Moving the taller side might use a max that is not the limiting wall, producing the wrong water volume.",
    },
    {
      label: "Updating max after computing water",
      body: "Update `leftMax` or `rightMax` before subtracting the current height. The current bar itself can become the new max, in which case it traps no water.",
    },
    {
      label: "Forgetting each bar has width 1",
      body: "The trapped water above a bar is (limiting wall height - bar height) × 1. The width is constant, so the code only tracks height differences.",
    },
    {
      label: "Returning a negative contribution",
      body: "Using `Math.max(leftMax - height[l], 0)` is not needed here because `leftMax` is always at least `height[l]` after the update step.",
    },
  ],
  complexityReasoning:
    "The two pointers start at opposite ends and move toward each other until they meet. Each step advances exactly one pointer, so there are at most n iterations. All work inside the loop is O(1), giving O(n) time. Only four scalar variables are stored, so the space is constant.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "height[l] = 1 and height[r] = 3, with leftMax = 1 and rightMax = 3. Which side do you process?",
      answer: "Process the left side because height[l] < height[r]. Water added = leftMax - height[l] = 0, then l++.",
      hint: "The shorter side determines the limiting water level.",
    },
    {
      prompt: "After moving left, the new height[l] is 0 and leftMax is still 1. How much water is added?",
      answer: "1 unit — leftMax (1) minus the current bar height (0).",
    },
  ],
  interviewFraming:
    "Trapping Rain Water is a favorite because it has three standard solutions: two pointers, a stack, and prefix/suffix max arrays. Be ready to compare them. The two-pointer version is the most space-efficient; the stack version is easier to extend to 2-D trapping or irregular widths.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "height", value: "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]" },
    { label: "expected", value: "6" },
  ],
};

const VALID_PALINDROME: Question = {
  id: "tp-5",
  topicId: "two-pointers",
  title: "Valid Palindrome",
  difficulty: "Easy",
  tags: ["two-pointers", "string"],
  problem:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
  constraints: [
    "1 <= s.length <= 2 * 10⁵",
    "s consists only of printable ASCII characters.",
  ],
  approach:
    "Walk two pointers inward from the ends of the string. Skip any character that is not a letter or digit. Compare the lowercase versions of the two valid characters. If they ever differ, return false. If the pointers meet or cross, the string is a palindrome.",
  dryRun: [
    "s = 'A man, a plan, a canal: Panama'",
    "l=0 ('A'), r=28 ('a') → both alphanumeric, lowercase equal → l++, r--",
    "l moves past spaces and comma to 'm', r moves past space to 'm' → equal",
    "Continue mirroring inward until pointers cross",
    "All mirrored pairs match → return true",
  ],
  solution: `function isPalindrome(s) {
  let l = 0;
  let r = s.length - 1;

  while (l < r) {
    while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;
    while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;

    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;

    l++;
    r--;
  }
  return true;
}`,
  timeComplexity: "O(n) — each character is visited at most once by each pointer.",
  spaceComplexity: "O(1).",

  intuition:
    "A palindrome is symmetric: the first character must equal the last, the second must equal the second-to-last, and so on. Two pointers check this symmetry directly. Punctuation and case do not count, so we skip non-alphanumeric characters and compare lowercased letters.",
  pitfalls: [
    {
      label: "Comparing before skipping punctuation",
      body: "Always advance the pointer past non-alphanumeric characters before comparing. If you compare a space to a letter you will get a false mismatch.",
    },
    {
      label: "Case-sensitive comparison",
      body: "Convert both characters to the same case (usually lowercase) before comparing.",
    },
    {
      label: "Moving only one pointer on a match",
      body: "After a successful comparison, move both pointers inward. Moving only one pointer will misalign the mirrored positions.",
    },
    {
      label: "Treating digits as non-alphanumeric",
      body: "The problem counts digits as alphanumeric. The regex [a-zA-Z0-9] keeps both letters and digits.",
    },
  ],
  complexityReasoning:
    "The left pointer only moves right and the right pointer only moves left. Each character is inspected at most once by each pointer, so the total work is linear. The regex test operates on a single character and is O(1). Only the two pointers and loop variables are stored.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "s = 'race a car'. After skipping the spaces, what is the first pair of characters compared?",
      answer: "'r' and 'r' — they match, so both pointers move inward.",
      hint: "Start from the ends and ignore spaces.",
    },
    {
      prompt: "Continuing 'race a car', the next meaningful pair is 'a' and 'a', then 'c' and 'c'. What happens next?",
      answer: "The left pointer lands on 'e' while the right pointer lands on nothing (or a space to skip), so pointers cross and the function returns false because 'e' has no mirror.",
      hint: "Palindromes need perfect mirroring; an unmatched middle letter breaks it.",
    },
  ],
  interviewFraming:
    "Valid Palindrome is a gentle two-pointer opener. Follow-ups include doing it in-place on a character array, handling Unicode, or processing a stream where you cannot random-access. The stream version often uses a deque or a recursive stack.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "s", value: '"A man, a plan, a canal: Panama"' },
    { label: "expected", value: "true" },
  ],
};

const LONGEST_REPEATING_CHAR_REPLACE: Question = {
  id: "sw-3",
  topicId: "two-pointers",
  title: "Longest Repeating Character Replacement",
  difficulty: "Medium",
  tags: ["sliding-window"],
  problem:
    "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times. Return the length of the longest substring containing the same letter you can get after performing the operations.",
  constraints: [
    "1 <= s.length <= 10⁵",
    "0 <= k <= s.length",
    "s consists of only uppercase English letters.",
  ],
  approach:
    "Maintain a variable-size sliding window and a frequency map of characters inside it. The number of changes needed to make every character in the window the same is `windowLength - maxFrequencyInWindow`. Expand `right` while the window is valid (needed changes ≤ k). If it becomes invalid, shrink from `left` until it is valid again. Track the maximum valid window length. `maxFrequencyInWindow` may be stale from an earlier window, but that only makes the window look stricter; it never produces a larger answer than the true one.",
  dryRun: [
    "s = 'AABABBA', k = 1",
    "right=0 ('A'): count{A:1}, maxCount=1, len=1, best=1",
    "right=1 ('A'): count{A:2}, maxCount=2, len=2, best=2",
    "right=2 ('B'): count{A:2,B:1}, maxCount=2, changes=1 ≤ 1, len=3, best=3",
    "right=3 ('A'): count{A:3,B:1}, maxCount=3, changes=1 ≤ 1, len=4, best=4",
    "right=4 ('B'): count{A:3,B:2}, maxCount=3, changes=2 > 1 → shrink left, drop 'A'",
    "after shrink: count{A:2,B:2}, changes=2 > 1 → shrink again, drop 'A'",
    "after shrink: count{A:1,B:2}, changes=2 > 1 → shrink again, drop 'B'",
    "now valid: count{A:1,B:2}, len=2, best still 4",
    "... continue ...",
    "Return 4",
  ],
  solution: `function characterReplacement(s, k) {
  const count = new Map();
  let left = 0;
  let maxCount = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    count.set(c, (count.get(c) ?? 0) + 1);
    maxCount = Math.max(maxCount, count.get(c));

    while (right - left + 1 - maxCount > k) {
      const lc = s[left];
      count.set(lc, count.get(lc) - 1);
      left++;
    }

    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  timeComplexity: "O(n) — each pointer visits every character at most once.",
  spaceComplexity: "O(1) — at most 26 uppercase English letters in the map.",

  intuition:
    "The brute-force way tries every substring and counts its most frequent character: O(n²). The sliding-window shortcut reuses the frequency table as the window grows. The cost to make the whole window uniform is simply how many characters are not already the majority. If that cost exceeds `k`, shrink from the left until the window is affordable again.",
  pitfalls: [
    {
      label: "Updating best while the window is invalid",
      body: "Run the shrink loop first, then record `best`. Recording an invalid window would include characters you cannot afford to change.",
    },
    {
      label: "Recomputing maxCount from scratch",
      body: "You can keep `maxCount` as the maximum frequency ever seen. It may become stale, but that only makes the window look smaller and never breaks correctness. Recomputing is also fine for a 26-letter alphabet.",
    },
    {
      label: "Forgetting k = 0",
      body: "When k is 0, no replacements are allowed. The algorithm still works: the window is valid only when all characters inside it are already the same.",
    },
    {
      label: "Off-by-one window length",
      body: "The current window length is `right - left + 1`. Needed changes = length - maxCount. Double-check this formula before comparing to k.",
    },
  ],
  complexityReasoning:
    "The right pointer scans the string once. The left pointer only moves forward during shrinks, so it also visits each character at most once. Map operations are O(1) because the alphabet has a fixed size of 26. The total time is linear, and the map holds at most 26 entries.",
  patternFamily: "Sliding Window",
  selfTest: [
    {
      prompt: "s = 'AABABBA', k = 1. After window 'AABA' (indices 0..3), what is maxCount and how many changes are needed?",
      answer: "maxCount = 3 (three A's), window length = 4, changes = 1, which is ≤ k.",
      hint: "Count each character inside the window.",
    },
    {
      prompt: "Why is it safe for maxCount to be stale from an earlier, larger window?",
      answer: "A stale maxCount can only make the current window look like it needs more changes, which may shrink the window. It never lets an invalid window pass as valid.",
    },
  ],
  interviewFraming:
    "This is the canonical 'budgeted uniform substring' sliding-window problem. Interviewers may follow up with lowercase letters, a different replacement budget per character, or the related problem of finding the longest substring with at most k distinct characters.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "s", value: '"AABABBA"' },
    { label: "k", value: "1" },
    { label: "expected", value: "4" },
  ],
};

const BOATS_TO_SAVE_PEOPLE: Question = {
  id: "tp-6",
  topicId: "two-pointers",
  title: "Boats to Save People",
  difficulty: "Medium",
  tags: ["two-pointers", "greedy", "sorting"],
  problem:
    "You are given an array `people` where `people[i]` is the weight of the i-th person, and an integer `limit` that represents the maximum weight a boat can carry. Each boat carries at most two people and the sum of their weights must be at most `limit`. Return the minimum number of boats needed to carry every person.",
  constraints: [
    "1 <= people.length <= 5 * 10⁴",
    "1 <= people[i] <= limit <= 3 * 10⁴",
  ],
  approach:
    "Sort `people`. Place the heaviest remaining person at the right end. If the lightest remaining person (left end) can fit in the same boat, pair them and move both pointers inward. Otherwise the heavy person must sail alone, so move only the right pointer inward. This greedy pairing is optimal: if the heaviest person can share a boat with anyone, sharing it with the lightest leaves the most capacity for everyone else.",
  dryRun: [
    "people = [3, 2, 2, 1], limit = 3",
    "After sorting: [1, 2, 2, 3]",
    "left=0 (1), right=3 (3): sum = 4 > 3 → heavy person sails alone, boats=1, right=2",
    "left=0 (1), right=2 (2): sum = 3 ≤ 3 → pair them, boats=2, left=1, right=1",
    "left=1 (2), right=1 (2): sum = 2 ≤ 3 → one boat, boats=3, left=2, right=0",
    "Pointers crossed → return 3",
  ],
  solution: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let left = 0;
  let right = people.length - 1;
  let boats = 0;

  while (left <= right) {
    if (people[left] + people[right] <= limit) {
      left++;   // light person shares this boat
    }
    right--;    // heavy person is always placed
    boats++;
  }
  return boats;
}`,
  timeComplexity: "O(n log n) — dominated by sorting; the two-pointer scan is O(n).",
  spaceComplexity: "O(1) extra, or O(log n) if the sort uses stack.",

  intuition:
    "If every boat could carry only one person, the answer would simply be the number of people. The only savings come from pairing two people on the same boat. Sorting by weight lets us test the most constrained person — the heaviest — first. If even the lightest person cannot join them, nobody can, so that heavy person must go alone. Otherwise, pairing the lightest with the heaviest is the safest way to preserve boat capacity for the rest.",
  pitfalls: [
    {
      label: "Forgetting to sort",
      body: "The greedy pairing relies on knowing the current lightest and heaviest people. Sort `people` before running the two-pointer loop.",
    },
    {
      label: "Using < instead of <= in the while condition",
      body: "A single person in the middle still needs a boat. The loop should run while left <= right, not left < right.",
    },
    {
      label: "Not decrementing right when pairing",
      body: "The right pointer always moves inward because the heavy person is placed on a boat, alone or paired. Only `left` moves conditionally.",
    },
    {
      label: "Assuming two people per boat is always better",
      body: "A greedy pairing only works when the pair's total weight is within limit. Never force a pair that exceeds it.",
    },
  ],
  complexityReasoning:
    "Sorting the weights costs O(n log n). After sorting, the left pointer only moves right and the right pointer only moves left, so the pairing scan is linear. Together that is O(n log n). We store only three scalar variables, giving O(1) extra space (excluding any space the sort implementation uses internally).",
  patternFamily: "Greedy",
  selfTest: [
    {
      prompt: "people = [1, 2, 2, 3], limit = 3. Why does the heaviest person (3) sail alone?",
      answer: "3 + 1 = 4 > limit, and 1 is the lightest person available. If the lightest cannot join, no one can.",
      hint: "Check whether the lightest remaining person fits with the heaviest.",
    },
    {
      prompt: "After the heavy person sails alone, what are the new pointer positions and how many boats have been used?",
      answer: "left stays 0, right becomes 2, boats = 1.",
    },
  ],
  interviewFraming:
    "Boats to Save People is a classic greedy two-pointer problem. The interviewer may ask you to prove why pairing the heaviest with the lightest is optimal, or may change the boat capacity to three people and ask for a new strategy.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "people", value: "[3, 2, 2, 1]" },
    { label: "limit", value: "3" },
    { label: "expected", value: "3" },
  ],
};

const SUM_OF_SQUARE_NUMBERS: Question = {
  id: "tp-7",
  topicId: "two-pointers",
  title: "Sum of Square Numbers",
  difficulty: "Medium",
  tags: ["two-pointers", "math"],
  problem:
    "Given a non-negative integer `c`, decide whether there exist two integers `a` and `b` such that `a² + b² = c`.",
  constraints: [
    "0 <= c <= 2³¹ - 1",
  ],
  approach:
    "Start with `a = 0` and `b = floor(sqrt(c))`. Compare `a² + b²` to `c`. If they are equal, return true. If the sum is too small, increment `a` to increase it. If the sum is too large, decrement `b` to decrease it. Because `a` only grows and `b` only shrinks, the pointers cross after at most `sqrt(c)` steps.",
  dryRun: [
    "c = 5",
    "a = 0, b = 2 → 0² + 2² = 4 < 5 → a++",
    "a = 1, b = 2 → 1² + 2² = 5 == 5 → return true",
    "",
    "c = 3",
    "a = 0, b = 1 → 0² + 1² = 1 < 3 → a++",
    "a = 1, b = 1 → 1² + 1² = 2 < 3 → a++",
    "a = 2, b = 1 → pointers crossed → return false",
  ],
  solution: `function judgeSquareSum(c) {
  let a = 0;
  let b = Math.floor(Math.sqrt(c));

  while (a <= b) {
    const sum = a * a + b * b;
    if (sum === c) return true;
    if (sum < c) {
      a++;
    } else {
      b--;
    }
  }
  return false;
}`,
  timeComplexity: "O(√c) — a and b each travel at most √c steps.",
  spaceComplexity: "O(1).",

  intuition:
    "The brute force tries every `a` and `b` up to √c, which is O(c) work. A smarter view: as `a` grows, `a²` grows; as `b` shrinks, `b²` shrinks. That sorted behavior lets us use two pointers on the virtual list of squares, just like Two Sum II on a sorted array.",
  pitfalls: [
    {
      label: "Using a < b instead of a <= b",
      body: "a and b are allowed to be equal (for example, c = 2 = 1² + 1²). Use <= so the loop checks the single-square case before concluding.",
    },
    {
      label: "Integer overflow in strongly typed languages",
      body: "For c near 2³¹, √c is about 46340, so a² + b² fits in a 64-bit integer. In JavaScript this is safe; in C++ or Java use a long long or cast before squaring.",
    },
    {
      label: "Stopping too early",
      body: "If the pointers cross without a match, return false. Do not stop the first time the sum is smaller than c; you must try increasing a.",
    },
  ],
  complexityReasoning:
    "`a` starts at 0 and can only increase up to √c. `b` starts at √c and can only decrease to 0. Each loop step moves exactly one pointer, so there are at most 2√c + 1 iterations. All arithmetic is O(1), and only two integers are stored.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "c = 50. a = 0, b = 7. Sum = 0 + 49 = 49. What is the next move?",
      answer: "Increment a; the sum is slightly smaller than 50.",
      hint: "We need a larger total, and only a can grow from this side.",
    },
    {
      prompt: "c = 50, a = 1, b = 7. Sum = 1 + 49 = 50. What do you return?",
      answer: "true — a² + b² exactly equals c.",
    },
  ],
  interviewFraming:
    "This is Two Sum on the implicit list of perfect squares. A follow-up might ask for an arithmetic-only proof using properties of sums of two squares, or a hash-set version that stores every square up to √c.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "c", value: "5" },
    { label: "expected", value: "true" },
  ],
};

const REVERSE_STRING: Question = {
  id: "tp-8",
  topicId: "two-pointers",
  title: "Reverse String",
  difficulty: "Easy",
  tags: ["two-pointers", "string"],
  problem:
    "Write a function that reverses a string. The input string is given as an array of characters `s`. You must modify the array in-place with O(1) extra memory.",
  constraints: [
    "1 <= s.length <= 10⁵",
    "s[i] is a printable ASCII character.",
  ],
  approach:
    "Place one pointer at the beginning and one at the end. Swap the characters at the two pointers, then move both pointers toward the center. Stop when the pointers meet or cross. This reverses the array in-place using only constant extra space.",
  dryRun: [
    "s = ['h','e','l','l','o']",
    "swap s[0]='h' and s[4]='o' → ['o','e','l','l','h']",
    "swap s[1]='e' and s[3]='l' → ['o','l','l','e','h']",
    "left=2, right=2 → pointers meet, stop",
    "Result: ['o','l','l','e','h']",
  ],
  solution: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}`,
  timeComplexity: "O(n) — about n/2 swaps.",
  spaceComplexity: "O(1) — the swap uses only temporary variables.",

  intuition:
    "Reversing by copying into a new array is easy but costs O(n) extra space. Two pointers mirror the string from the outside in, swapping each pair directly inside the original array. After the pointers meet, every character has been exchanged with its symmetric counterpart.",
  pitfalls: [
    {
      label: "Using <= in the loop condition",
      body: "When left == right you are at the middle element; swapping it with itself is harmless but unnecessary. Use < and let the middle element stay put.",
    },
    {
      label: "Returning a new array",
      body: "The problem asks for in-place mutation. The function should not return a new array; it modifies s directly.",
    },
    {
      label: "Off-by-one starting index",
      body: "right should start at s.length - 1, the last valid index, not at s.length.",
    },
  ],
  complexityReasoning:
    "Each swap handles two elements, so the loop runs about n/2 times. Every operation inside is O(1), giving O(n) total time. The swap itself uses destructuring assignment but only allocates a couple of temporary references, so the extra space is constant.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "s = ['a','b','c','d']. After the first swap, what does the array look like and where are the pointers?",
      answer: "['d','b','c','a'] with left=1 and right=2.",
      hint: "Swap the outer pair, then move both pointers inward.",
    },
    {
      prompt: "For an array of length 5, how many swaps are performed?",
      answer: "Two swaps; the middle element never moves.",
    },
  ],
  interviewFraming:
    "Reverse String is the simplest in-place two-pointer exercise. Follow-ups include reversing only letters while keeping punctuation in place, reversing the words in a sentence, or reversing a linked list by rewiring pointers.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "s", value: '["h","e","l","l","o"]' },
    { label: "expected", value: '["o","l","l","e","h"]' },
  ],
};

const TWO_SUM_LESS_THAN_K: Question = {
  id: "tp-9",
  topicId: "two-pointers",
  title: "Two Sum Less Than K",
  difficulty: "Easy",
  tags: ["two-pointers", "array", "sorting"],
  problem:
    "Given an array `nums` of integers and an integer `k`, return the maximum value of `nums[i] + nums[j]` where `i < j` and the sum is strictly less than `k`. If no such pair exists, return -1.",
  constraints: [
    "1 <= nums.length <= 100",
    "1 <= nums[i] <= 10⁴",
    "1 <= k <= 2 * 10⁴",
  ],
  approach:
    "Sort `nums`. Use two pointers: `left` at the start and `right` at the end. If `nums[left] + nums[right] < k`, it is a valid pair and the sum is the best candidate seen so far; move `left` right to try for a larger valid sum. Otherwise the sum is too large, so move `right` left to reduce it. Because the array is sorted, every move is forced and no valid pair is skipped.",
  dryRun: [
    "nums = [34, 23, 1, 24, 75, 33, 54, 8], k = 60",
    "After sorting: [1, 8, 23, 24, 33, 34, 54, 75]",
    "left=0 (1), right=7 (75): sum=76 >= 60 → right--",
    "left=0 (1), right=6 (54): sum=55 < 60 → best=55, left++",
    "left=1 (8), right=6 (54): sum=62 >= 60 → right--",
    "left=1 (8), right=5 (34): sum=42 < 60 → best stays 55, left++",
    "left=2 (23), right=5 (34): sum=57 < 60 → best=57, left++",
    "left=3 (24), right=5 (34): sum=58 < 60 → best=58, left++",
    "left=4 (33), right=5 (34): sum=67 >= 60 → right--",
    "left=4 (33), right=4 (33): pointers meet → stop",
    "Return 58",
  ],
  solution: `function twoSumLessThanK(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length - 1;
  let best = -1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum < k) {
      best = Math.max(best, sum);
      left++;
    } else {
      right--;
    }
  }
  return best;
}`,
  timeComplexity: "O(n log n) — dominated by sorting; the scan is O(n).",
  spaceComplexity: "O(1) extra, or O(log n) if the sort uses stack.",

  intuition:
    "The brute force checks every pair: O(n²). Once the array is sorted, the problem becomes a two-pointer variant of Two Sum II. A small sum means the current pair is valid, so we record it and ask if we can do better by increasing the smaller value. A large sum means we must decrease the larger value. The sorted order guarantees we never skip a better candidate.",
  pitfalls: [
    {
      label: "Returning a sum equal to k",
      body: "The problem requires the sum to be strictly less than k. Only update best when sum < k, not when sum <= k.",
    },
    {
      label: "Moving right when the sum is valid",
      body: "If sum < k, the pair is valid and moving right would throw away larger valid sums. Move left instead to try to increase the sum.",
    },
    {
      label: "Initializing best to 0",
      body: "If no valid pair exists, the answer is -1. Initialize best to -1 so an all-invalid case is reported correctly.",
    },
    {
      label: "Forgetting to sort",
      body: "The two-pointer logic depends on sorted order. Sort nums first, and remember that indices are not part of the answer.",
    },
  ],
  complexityReasoning:
    "Sorting costs O(n log n). After sorting, the left pointer only moves right and the right pointer only moves left, so the scan is linear. The total time is O(n log n). Only three scalar variables are stored, giving O(1) extra space.",
  patternFamily: "Two Pointers",
  selfTest: [
    {
      prompt: "nums = [1, 8, 23, 24, 33, 34, 54, 75], k = 60. left=0, right=6, sum=55. What do you record and which pointer moves?",
      answer: "Record best=55 and move left right; the current pair is valid, and a larger small value might give a larger valid sum.",
      hint: "A valid sum is a candidate; try to improve it by raising the smaller end.",
    },
    {
      prompt: "nums = [10, 20, 30], k = 25. What does the algorithm return?",
      answer: "-1, because the smallest pair sum (10 + 20 = 30) is already >= k.",
    },
  ],
  interviewFraming:
    "This is a warm-up that tests whether you can adapt the sorted two-pointer template to a 'less than' constraint. Natural follow-ups include counting all pairs with sum less than k, or finding the pair whose sum is closest to k without exceeding it.",

  buildTrace: () => [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ],
  sampleInput: [
    { label: "nums", value: "[34, 23, 1, 24, 75, 33, 54, 8]" },
    { label: "k", value: "60" },
    { label: "expected", value: "58" },
  ],
};

export const QUESTIONS: Question[] = [
  TWO_SUM_SORTED,
  CONTAINER_WITH_MOST_WATER,
  LONGEST_SUBARRAY,
  MIN_WINDOW_SUBSTRING,
  THREE_SUM,
  TRAPPING_RAIN_WATER,
  VALID_PALINDROME,
  LONGEST_REPEATING_CHAR_REPLACE,
  BOATS_TO_SAVE_PEOPLE,
  SUM_OF_SQUARE_NUMBERS,
  REVERSE_STRING,
  TWO_SUM_LESS_THAN_K,
];
