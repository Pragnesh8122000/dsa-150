import type { Question } from "../types";

const PLACEHOLDER_TRACE = () => [
  {
    description: "Animation coming soon — this question is in the stub list.",
    variables: {},
    codeLine: 1,
  },
];

const PLACEHOLDER_INPUT = [
  { label: "input", value: "see problem statement" },
  { label: "expected", value: "see problem statement" },
];

export const QUESTIONS: Question[] = [
  {
    id: "arr-1",
    topicId: "arrays",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["array", "hashmap"],
    problem:
      "Return indices of the two numbers such that they add up to target.",
    constraints: [
      "2 <= nums.length <= 10⁴",
      "Exactly one solution exists.",
    ],
    approach:
      "Single-pass hash map: for each num, check whether target - num was already seen. If it was, return the stored index and the current index; otherwise store the current value and its index. This trades a little extra space for an O(n) pass instead of checking every pair.",
    dryRun: [
      "nums = [2, 7, 11, 15], target = 9",
      "i=0: map is empty, store 2→0.",
      "i=1: target-7 = 2 is in map at index 0. Return [0, 1].",
    ],
    solution: `function twoSum(nums, target) {
  const m = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (m.has(complement)) {
      return [m.get(complement), i];
    }
    m.set(nums[i], i);
  }
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "The naive approach tries every pair of indices, which wastes time because most pairs are irrelevant. The key insight is that, as you walk through the array once, the only number that can complete the current element is target minus that element. A hash map lets you ask 'did I already see my partner?' in O(1) time.",
    pitfalls: [
      {
        label: "Returning values instead of indices",
        body: "The problem asks for indices. Store indices in the map, not the numbers themselves.",
      },
      {
        label: "Adding before checking",
        body: "Check the map before storing the current element, otherwise you might pair an index with itself when target equals 2 * nums[i].",
      },
      {
        label: "Using an object instead of a Map",
        body: "Objects coerce keys to strings and miss negative or large numeric keys. Use Map for reliable index lookup.",
      },
    ],
    complexityReasoning:
      "We visit each element exactly once and do only O(1) hash-map work per element, giving O(n) time. The map holds at most n entries, so the extra space is O(n).",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "nums = [3, 2, 4], target = 6. At i = 1 (value 2), what is the complement and is it in the map?",
        answer: "complement = 4. It is not in the map yet, so store 2 → 1.",
        hint: "The map only contains values from earlier indices at this point.",
      },
      {
        prompt: "At i = 2 (value 4), what happens?",
        answer: "complement = 2 is in the map at index 1, so return [1, 2].",
      },
    ],
    interviewFraming:
      "Two Sum is the default hash-map warm-up. Follow-ups include the sorted-array version (use two pointers), finding all unique pairs that sum to zero (3Sum), and handling duplicates or the case where no solution exists.",
  },

  {
    id: "arr-2",
    topicId: "arrays",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    tags: ["array", "greedy"],
    problem: "Maximize profit from one buy/sell.",
    constraints: ["1 <= prices.length <= 10⁵"],
    approach:
      "Track the minimum price seen so far and the maximum profit achievable by selling at the current price. For each day, profit is price - minSoFar; update the best if this profit is larger, and update minSoFar if the price is lower.",
    dryRun: [
      "prices = [7, 1, 5, 3, 6, 4]",
      "day 0: min=7, best=0",
      "day 1: min=1, best=0",
      "day 2: profit=5-1=4, best=4",
      "day 3: profit=3-1=2, best=4",
      "day 4: profit=6-1=5, best=5",
      "day 5: profit=4-1=3, best=5",
      "Return 5.",
    ],
    solution: `function maxProfit(prices) {
  let minSoFar = Infinity;
  let best = 0;
  for (const p of prices) {
    minSoFar = Math.min(minSoFar, p);
    best = Math.max(best, p - minSoFar);
  }
  return best;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "Trying every buy/sell pair takes O(n²). Instead, notice that the best selling price for any day is simply today's price minus the cheapest price seen before today. One forward pass keeps both pieces of information: the cheapest entry point and the best profit so far.",
    pitfalls: [
      {
        label: "Initializing best to a large negative number",
        body: "Profit can never be negative if you are allowed to skip the transaction, so initialize best to 0.",
      },
      {
        label: "Updating best before updating the minimum",
        body: "Compute today's profit using the minimum from before today, then update both min and best. The order inside the loop does not matter mathematically, but be clear that you are not buying and selling on the same day.",
      },
      {
        label: "Buying after selling",
        body: "The problem allows at most one transaction. The loop's minSoFar should be the cheapest price up to the current day, not after a fictional sale.",
      },
    ],
    complexityReasoning:
      "Each price is examined once and only two scalar variables are maintained, so the time is O(n) and the extra space is O(1).",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "prices = [5, 4, 3, 2, 1]. What is the maximum profit?",
        answer: "0. The price only decreases, so the best move is not to trade.",
        hint: "best starts at 0 and never increases.",
      },
      {
        prompt: "prices = [2, 4, 1]. At price 1, what is minSoFar?",
        answer: "minSoFar = 1. The best profit remains 2 from buying at 2 and selling at 4.",
      },
    ],
    interviewFraming:
      "This is the simplest stock DP/greedy problem. Classic follow-ups add cooldowns, multiple transactions, transaction fees, or at most k transactions, all of which build on the same 'state machine over the cheapest price' idea.",
  },

  {
    id: "arr-3",
    topicId: "arrays",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    tags: ["array", "prefix"],
    problem:
      "Return an array where ans[i] is the product of all elements except nums[i]. No division.",
    constraints: ["2 <= nums.length <= 10⁵"],
    approach:
      "Compute the product of every element to the left of i and every element to the right of i. The answer at i is leftProduct[i] * rightProduct[i]. This can be done in two passes with O(1) extra space besides the output array by keeping running products.",
    dryRun: [
      "nums = [1, 2, 3, 4]",
      "First pass (left products): ans = [1, 1, 2, 6]",
      "Second pass (right products): right = 1; i=3 ans=6*1=6, right=4",
      "i=2 ans=2*4=8, right=12; i=1 ans=1*12=12, right=24; i=0 ans=1*24=24",
      "Return [24, 12, 8, 6].",
    ],
    solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const ans = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) {
    ans[i] *= left;
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    ans[i] *= right;
    right *= nums[i];
  }
  return ans;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) excl. output",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "A brute-force recomputation for each index costs O(n²). The waste is that neighboring answers share almost the same factors. If you know the product of everything left of i and everything right of i, you can multiply them to get the answer for i in O(1). One forward pass records the left products and a backward pass completes them with the right products.",
    pitfalls: [
      {
        label: "Using division",
        body: "The problem explicitly forbids division, and division would also break if any element is zero.",
      },
      {
        label: "Forgetting the initial 1",
        body: "The left product of the first element and the right product of the last element are both 1, not 0.",
      },
      {
        label: "Counting the output array as extra space",
        body: "The required output does not count toward space complexity. The algorithm uses only a few scalar variables besides the output.",
      },
    ],
    complexityReasoning:
      "Two linear passes each visit every index once, so the time is O(n). Only the output array and two running-product variables are stored, giving O(1) extra space.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "nums = [2, 3, 4]. After the forward pass, what is ans?",
        answer: "ans = [1, 2, 6] — the products of all elements strictly to the left of each index.",
      },
      {
        prompt: "During the backward pass at i = 1, right = 4. What is ans[1]?",
        answer: "ans[1] becomes 2 * 4 = 8.",
      },
    ],
    interviewFraming:
      "This tests whether you can decompose a problem into prefix and suffix information. Follow-ups ask for the same result with nested loops or matrices, or with the constraint that you must handle zeros explicitly.",
  },

  {
    id: "arr-4",
    topicId: "arrays",
    title: "Maximum Subarray (Kadane's)",
    difficulty: "Medium",
    tags: ["array", "dp"],
    problem: "Find contiguous subarray with largest sum.",
    constraints: ["1 <= nums.length <= 10⁵"],
    approach:
      "Kadane's algorithm keeps the maximum sum of a subarray ending at the current index. At each step, either extend the previous subarray or start fresh from the current element. The overall best is the maximum of all these ending-here values.",
    dryRun: [
      "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
      "i=0: cur=-2, best=-2",
      "i=1: cur=max(1, -2+1)=1, best=1",
      "i=2: cur=max(-3, 1-3)=-2, best=1",
      "i=3: cur=max(4, -2+4)=4, best=4",
      "i=4: cur=4-1=3, best=4",
      "i=5: cur=3+2=5, best=5",
      "i=6: cur=5+1=6, best=6",
      "i=7: cur=6-5=1, best=6",
      "i=8: cur=max(4,1+4)=5, best=6",
      "Return 6.",
    ],
    solution: `function maxSubArray(nums) {
  let cur = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "Checking every contiguous subarray takes O(n²). Kadane's trick is to ask a simpler question: what is the best subarray that ends right here? If the best ending at the previous position is negative, it drags any extension down, so we drop it and start anew. Otherwise we extend. The global answer is the best of these local answers.",
    pitfalls: [
      {
        label: "Initializing best to 0",
        body: "If the array is all negative, the maximum subarray is the largest (least negative) element. Initialize cur and best to nums[0].",
      },
      {
        label: "Updating best before recomputing cur",
        body: "Recompute cur for the current index first, then compare it with best. Otherwise you may record an outdated value.",
      },
      {
        label: "Confusing cur with the answer",
        body: "cur is the best sum ending at the current index; best is the maximum seen anywhere. Both must be tracked.",
      },
    ],
    complexityReasoning:
      "One pass over the array with constant work per element gives O(n) time. Only two variables are stored, so the extra space is O(1).",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "nums = [-5, -2, -8]. After processing index 1, what are cur and best?",
        answer: "cur = max(-2, -5 + -2) = -2; best = max(-5, -2) = -2.",
      },
      {
        prompt: "nums = [1, 2, -1, 3]. At index 3, what is cur?",
        answer: "cur = max(3, (1+2-1)+3) = 5. best becomes 5.",
      },
    ],
    interviewFraming:
      "Kadane's is the go-to example of turning a quadratic enumeration into a linear scan. Interviewers may ask for the subarray indices, a divide-and-conquer O(n log n) solution, or the 2D version (maximum sum rectangle).",
  },

  {
    id: "arr-5",
    topicId: "arrays",
    title: "Valid Anagram",
    difficulty: "Easy",
    tags: ["hashmap", "string"],
    problem: "Determine if t is an anagram of s.",
    constraints: ["1 <= s.length, t.length <= 5 * 10⁴"],
    approach:
      "Count the occurrences of each character in s, then decrement the counts for each character in t. If every count ends at zero and the lengths match, the strings are anagrams. For lowercase English letters, a fixed-size array of length 26 is enough.",
    dryRun: [
      "s = 'anagram', t = 'nagaram'",
      "After counting s: [3,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0]",
      "After canceling t all counts return to 0.",
      "Return true.",
    ],
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++;
    counts[t.charCodeAt(i) - 97]--;
  }
  return counts.every(x => x === 0);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "Anagrams contain exactly the same characters with exactly the same frequencies. Sorting both strings also works, but counting is faster: you only need one pass and a small table instead of an O(n log n) sort.",
    pitfalls: [
      {
        label: "Forgetting the length check",
        body: "If lengths differ, the strings cannot be anagrams. Check it before counting to avoid extra work.",
      },
      {
        label: "Using a Set instead of counts",
        body: "A Set only records presence. Anagrams care about frequency, so you need a counter or frequency array.",
      },
      {
        label: "Wrong char code offset",
        body: "Lowercase 'a' is char code 97. Subtract 97, not the digit value of the character.",
      },
    ],
    complexityReasoning:
      "We make one pass over the strings and do O(1) work per character. The counter array has a fixed size of 26, so the extra space is O(1).",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "s = 'rat', t = 'car'. After the loop, are all counts zero?",
        answer: "No. The 'r' count is 0, but 'a' and 't'/'c' leave non-zero values, so it returns false.",
      },
      {
        prompt: "Why is the space complexity O(1) even though we allocate an array?",
        answer: "The array always has 26 entries, no matter how long the strings are.",
      },
    ],
    interviewFraming:
      "Anagram problems often lead to grouping anagrams or finding the minimum number of character changes. Be ready to extend the counter idea to arbitrary alphabets using a Map, or to Unicode code points.",
  },

  {
    id: "arr-6",
    topicId: "arrays",
    title: "Contains Duplicate",
    difficulty: "Easy",
    tags: ["hashset"],
    problem: "True if any value appears at least twice.",
    constraints: ["1 <= n <= 10⁵"],
    approach:
      "Use a Set to track the values we have seen. If the size of the Set is smaller than the array length, at least one value was repeated. Alternatively, return true as soon as a duplicate is found while iterating.",
    dryRun: [
      "nums = [1, 2, 3, 1]",
      "Set after scanning: {1, 2, 3}. size=3, length=4 → duplicate exists.",
      "Return true.",
    ],
    solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "The brute-force check compares every pair, but once you have seen a number you only need to know whether you ever see it again. A Set gives O(1) membership checks, turning the problem into a single pass.",
    pitfalls: [
      {
        label: "Returning false for an empty array incorrectly",
        body: "An empty array has no duplicates, so the function correctly returns false.",
      },
      {
        label: "Using .length on a Set wrong",
        body: "Sets use .size, not .length. If you compare sizes, use new Set(nums).size !== nums.length.",
      },
      {
        label: "Modifying the array while checking",
        body: "Do not mutate the input while iterating; it can skip elements or corrupt the Set logic.",
      },
    ],
    complexityReasoning:
      "Each element is inserted and looked up once in a hash set, costing O(1) amortized per operation. In the worst case the set stores all n elements, so space is O(n).",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "nums = [1, 2, 3, 4]. What does the function return and why?",
        answer: "false. Every insertion succeeds; no duplicate is found.",
      },
      {
        prompt: "nums = [1, 1, 1]. When does the function return?",
        answer: "It returns true at the second element because 1 is already in the Set.",
      },
    ],
    interviewFraming:
      "This is the simplest frequency problem. Follow-ups constrain the duplicate distance: 'is there a duplicate within k indices?' or 'is there a duplicate whose values differ by at most t?' Those variants need a sliding window or bucket approach.",
  },

  {
    id: "arr-7",
    topicId: "arrays",
    title: "Rotate Array",
    difficulty: "Medium",
    tags: ["array", "in-place"],
    problem: "Rotate right by k steps in-place.",
    constraints: ["0 <= k <= 10⁵"],
    approach:
      "Reverse the whole array, then reverse the first k elements, then reverse the remaining n-k elements. The three reversals move the last k elements to the front while preserving their order and keeping the rest in original order. All work is done in-place.",
    dryRun: [
      "nums = [1, 2, 3, 4, 5, 6, 7], k = 3",
      "Reverse all: [7, 6, 5, 4, 3, 2, 1]",
      "Reverse first 3: [5, 6, 7, 4, 3, 2, 1]",
      "Reverse last 4: [5, 6, 7, 1, 2, 3, 4]",
    ],
    solution: `function rotate(nums, k) {
  function reverse(arr, start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }
  k %= nums.length;
  if (k === 0) return;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "A copy-based rotation is simple but uses O(n) extra space. The triple-reverse trick achieves the same result without allocating a new array: reversing everything flips the tail to the front (but backwards), and the two smaller reversals fix the direction of each chunk.",
    pitfalls: [
      {
        label: "Forgetting k %= n",
        body: "If k is larger than the array length, rotating by k is the same as rotating by k mod n. Failing to reduce it can cause unnecessary work or out-of-bounds indices.",
      },
      {
        label: "Off-by-one in the second reverse",
        body: "After the full reverse, reverse indices 0 through k-1, not 0 through k.",
      },
      {
        label: "Returning a new array",
        body: "The problem asks for an in-place rotation. The function should mutate nums and not return anything.",
      },
    ],
    complexityReasoning:
      "Each of the three reversals touches every element at most once, so the total time is O(n). The reversal helper swaps in place, so the extra space is O(1).",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "nums = [1, 2, 3, 4, 5], k = 2. What does the array look like after the first full reverse?",
        answer: "[5, 4, 3, 2, 1].",
      },
      {
        prompt: "After reversing indices 0..1, then 2..4, what is the final array?",
        answer: "[4, 5, 1, 2, 3].",
      },
    ],
    interviewFraming:
      "Rotation problems test in-place array manipulation. Follow-ups include rotating a linked list, rotating a matrix, or rotating left instead of right (just adjust the reverse ranges).",
  },

  {
    id: "arr-8",
    topicId: "arrays",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    tags: ["array", "two-pointers"],
    problem: "Merge nums2 into nums1 in-place, both sorted.",
    constraints: ["0 <= m + n <= 200"],
    approach:
      "Merge from the back of the arrays. Compare the largest unused elements of nums1 and nums2 and write the larger one at the current back position of nums1. This avoids overwriting elements in nums1 that have not yet been merged.",
    dryRun: [
      "nums1 = [1, 2, 3, 0, 0, 0], m = 3; nums2 = [2, 5, 6], n = 3",
      "k=5: nums1[2]=3 vs nums2[2]=6 → write 6",
      "k=4: 3 vs 5 → write 5",
      "k=3: 3 vs 2 → write 3",
      "k=2: 2 vs 2 → write 2 (from nums2)",
      "k=1: 2 vs (none) → write 2",
      "k=0: 1 → write 1",
      "nums1 = [1, 2, 2, 3, 5, 6].",
    ],
    solution: `function merge(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
}`,
    timeComplexity: "O(m + n)",
    spaceComplexity: "O(1)",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "Merging from the front would overwrite the original values of nums1 before they are copied. Starting from the back is safe because the destination positions are the trailing zeros that are not needed as source data. The largest remaining element is always placed next.",
    pitfalls: [
      {
        label: "Merging from the front",
        body: "Writing from the beginning of nums1 destroys values that still need to be compared. Always fill from the back.",
      },
      {
        label: "Forgetting to copy remaining nums2 elements",
        body: "When nums1 is exhausted, all remaining nums2 values must still be copied. The loop condition while (j >= 0) handles this.",
      },
      {
        label: "Index underflow in nums1",
        body: "Only compare nums1[i] when i >= 0. The condition i >= 0 && nums1[i] > nums2[j] protects against underflow.",
      },
    ],
    complexityReasoning:
      "Each element from nums1 and nums2 is moved at most once, so the total number of writes is m + n. No additional arrays are allocated, giving O(1) extra space.",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "nums1 = [4, 5, 6, 0, 0, 0], m=3; nums2 = [1, 2, 3], n=3. What is the first value written at the back?",
        answer: "6, because nums1[2]=6 is larger than nums2[2]=3.",
      },
      {
        prompt: "After all of nums1 is exhausted, what happens?",
        answer: "The remaining nums2 values are copied into the front of nums1.",
      },
    ],
    interviewFraming:
      "This is the classic 'merge in-place' exercise. It often leads to merging k sorted arrays or sorted linked lists, where a min-heap becomes the natural next tool.",
  },

  {
    id: "arr-9",
    topicId: "arrays",
    title: "Longest Substring Without Repeating Chars",
    difficulty: "Medium",
    tags: ["sliding-window", "hashset"],
    problem: "Length of longest substring with all unique chars.",
    constraints: ["0 <= s.length <= 5 * 10⁴"],
    approach:
      "Maintain a sliding window [left, right] and a Set of characters inside it. Expand right one character at a time. If the new character is already in the window, shrink from the left until it is unique again. The largest valid window length seen is the answer.",
    dryRun: [
      "s = 'abcabcbb'",
      "r=0: window='a', best=1",
      "r=1: window='ab', best=2",
      "r=2: window='abc', best=3",
      "r=3: 'a' is in window → shrink left twice → window='bca', best=3",
      "r=4: 'b' in window → shrink → window='cab', best=3",
      "r=5: 'c' in window → shrink → window='abc', best=3",
      "r=6,7: more shrinks, best stays 3.",
      "Return 3.",
    ],
    solution: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, α))",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "Checking every substring is O(n²). A sliding window avoids recomputation: when a duplicate enters at the right edge, only characters at the left edge need to leave until the window is unique again. Each character enters and leaves the window at most once.",
    pitfalls: [
      {
        label: "Updating best before shrinking",
        body: "After adding s[right], the window may contain a duplicate. Run the shrink loop first, then update best with the now-valid window length.",
      },
      {
        label: "Resetting the whole window on duplicate",
        body: "Only remove characters from the left until the duplicate is gone. Jumping left all the way to right+1 discards valid windows and breaks the linear proof.",
      },
      {
        label: "Off-by-one in window length",
        body: "The length of a window from left to right inclusive is right - left + 1.",
      },
    ],
    complexityReasoning:
      "Both pointers move strictly forward and each character is added and removed from the Set at most once, so the total work is O(n). The Set holds at most the distinct characters in the current window, bounded by the alphabet size.",
    patternFamily: "Sliding Window",
    selfTest: [
      {
        prompt: "s = 'pwwkew'. At r = 2 (third 'w'), how many times do we shrink?",
        answer: "Once: remove 'p' so the window becomes 'ww', then remove the first 'w' so it becomes 'w'.",
      },
      {
        prompt: "After the shrink, what is the window and best?",
        answer: "window = 'w' (left=2, right=2), best remains 2 from the earlier 'wke'.",
      },
    ],
    interviewFraming:
      "This is the canonical variable-size sliding-window problem. Follow-ups include allowing at most k character replacements, finding the longest substring with k distinct characters, or the same problem on arrays instead of strings.",
  },

  {
    id: "arr-10",
    topicId: "arrays",
    title: "Spiral Matrix",
    difficulty: "Medium",
    tags: ["matrix"],
    problem: "Return elements of matrix in spiral order.",
    constraints: ["1 <= m, n <= 10"],
    approach:
      "Keep four boundary variables: top, bottom, left, right. Traverse the top row left-to-right, then the right column top-to-bottom, then the bottom row right-to-left (if a row remains), then the left column bottom-to-top (if a column remains). After each direction, shrink the corresponding boundary. Stop when boundaries cross.",
    dryRun: [
      "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
      "top row 0 → 1,2,3; top=1",
      "right col 2 → 6,9; right=1",
      "bottom row 2 → 8,7; bottom=1",
      "left col 0 → 4; left=1",
      "top row 1 → 5; top=2",
      "boundaries cross, stop.",
      "Return [1,2,3,6,9,8,7,4,5].",
    ],
    solution: `function spiralOrder(matrix) {
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) out.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) out.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);
      left++;
    }
  }
  return out;
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(1) excl. output",
    buildTrace: PLACEHOLDER_TRACE,
    sampleInput: PLACEHOLDER_INPUT,

    intuition:
      "The spiral is just four straight traversals repeated: across the top, down the right, across the bottom, up the left. After finishing a side, move the corresponding boundary inward so the next loop works on a smaller rectangle. The trick is remembering to check whether the opposite side still exists before traversing it.",
    pitfalls: [
      {
        label: "Forgetting to shrink a boundary",
        body: "After traversing the top row, increment top. Otherwise the same row is visited again.",
      },
      {
        label: "Traversing a row or column twice in a single layer",
        body: "For non-square matrices, the final layer may be a single row or column. The top <= bottom and left <= right guards prevent revisiting the same cells.",
      },
      {
        label: "Using matrix[0].length without checking emptiness",
        body: "The constraints guarantee at least one row, but in an interview always consider an empty matrix edge case.",
      },
    ],
    complexityReasoning:
      "Each cell is visited exactly once, so the time is O(m · n). Only the output list and a few boundary variables are stored, giving O(1) extra space.",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "matrix = [[1,2,3,4],[5,6,7,8]]. After the top and right traversals, what are top and right?",
        answer: "top = 1, right = 2. The bottom traversal then reads 7, 6.",
      },
      {
        prompt: "Why do we need if (top <= bottom) before the bottom row traversal?",
        answer: "A single-row matrix would otherwise re-traverse the same row that was already consumed by the top traversal.",
      },
    ],
    interviewFraming:
      "Spiral traversal is a favorite matrix warm-up. Follow-ups include generating a spiral matrix of size n × n, rotating an image by 90 degrees, and traversing diagonals or layers of a matrix.",
  },

  {
    id: "arr-11",
    topicId: "arrays",
    title: "Move Zeroes",
    difficulty: "Easy",
    tags: ["array", "two-pointers"],
    problem:
      "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.",
    constraints: [
      "1 <= nums.length <= 10⁴",
      "-2³¹ <= nums[i] <= 2³¹ - 1",
    ],
    approach:
      "Use a slow pointer for the next position to write a non-zero value and a fast pointer to scan the array. Every time the fast pointer finds a non-zero value, write it at the slow pointer and advance slow. After the scan, fill the remaining positions from slow to the end with zeros.",
    dryRun: [
      "nums = [0, 1, 0, 3, 12]",
      "i=0: value 0 → skip",
      "i=1: value 1 → nums[0]=1, write=1",
      "i=2: value 0 → skip",
      "i=3: value 3 → nums[1]=3, write=2",
      "i=4: value 12 → nums[2]=12, write=3",
      "Fill nums[3] and nums[4] with 0.",
      "Result: [1, 3, 12, 0, 0].",
    ],
    solution: `function moveZeroes(nums) {
  let write = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[write] = nums[i];
      write++;
    }
  }
  for (let i = write; i < nums.length; i++) {
    nums[i] = 0;
  }
}`,
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
      { label: "input", value: "[0, 1, 0, 3, 12]" },
      { label: "expected", value: "[1, 3, 12, 0, 0]" },
    ],
    vizMode: "array",

    intuition:
      "Copying the non-zero values into a new array is easy but uses extra space. The insight is that the non-zero values already appear in the correct relative order; we just need to overwrite the array once with them and then pad the tail with zeros. Two pointers separate 'what we have seen' from 'where we should write next'.",
    pitfalls: [
      {
        label: "Swapping instead of overwriting",
        body: "A swap-based version works but is slightly slower and harder to explain. The overwrite-then-fill approach is clearer and still in-place.",
      },
      {
        label: "Filling zeros before the scan finishes",
        body: "Wait until all non-zero values are written, then fill from the write pointer onward. Filling early overwrites values you have not processed yet.",
      },
      {
        label: "Forgetting to advance write",
        body: "Increment the write pointer every time a non-zero value is placed; otherwise all non-zero values pile up at index 0.",
      },
    ],
    complexityReasoning:
      "The fast pointer visits every element once and the fill loop visits the remaining positions once. Each element is moved at most twice, so the time is O(n). Only the write pointer is extra, giving O(1) space.",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt: "nums = [1, 0, 2, 0, 3]. After scanning index 2, what is write?",
        answer: "write = 2. nums currently looks like [1, 2, 2, 0, 3] (the second 2 is temporary).",
      },
      {
        prompt: "What does the array look like after the fill loop?",
        answer: "[1, 2, 3, 0, 0].",
      },
    ],
    interviewFraming:
      "Move Zeroes is a standard two-pointer in-place reordering question. Follow-ups ask you to move all zeros to one side in one pass, or to partition by a pivot while preserving order (the stable partition pattern).",
  },

  {
    id: "arr-12",
    topicId: "arrays",
    title: "Majority Element",
    difficulty: "Easy",
    tags: ["array", "hashmap", "boyer-moore"],
    problem:
      "Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume the majority element always exists in the array.",
    constraints: [
      "n == nums.length",
      "1 <= n <= 5 * 10⁴",
      "The majority element always exists.",
    ],
    approach:
      "A hash map gives the answer in one pass but uses O(n) space. Boyer-Moore voting reduces this to O(1) space: maintain a candidate and a count. Increment the count when you see the candidate, decrement otherwise; when the count reaches zero, pick the current element as the new candidate. The majority element survives as the final candidate.",
    dryRun: [
      "nums = [2, 2, 1, 1, 1, 2, 2]",
      "candidate=2, count=1",
      "i=1: 2 == candidate → count=2",
      "i=2: 1 != candidate → count=1",
      "i=3: 1 != candidate → count=0, candidate=1",
      "i=4: 1 == candidate → count=1",
      "i=5: 2 != candidate → count=0, candidate=2",
      "i=6: 2 == candidate → count=1",
      "Return 2.",
    ],
    solution: `function majorityElement(nums) {
  let candidate = nums[0];
  let count = 0;
  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += num === candidate ? 1 : -1;
  }
  return candidate;
}`,
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
      { label: "input", value: "[2, 2, 1, 1, 1, 2, 2]" },
      { label: "expected", value: "2" },
    ],
    vizMode: "array",

    intuition:
      "If every non-majority element were paired with a majority element, the majority would still have spare occurrences because it appears more than half the time. Boyer-Moore voting simulates that pairing: equal votes cancel out, and the element that wins the overall election is the majority.",
    pitfalls: [
      {
        label: "Assuming the first element is the answer",
        body: "The first element is only the initial candidate. The count must be allowed to drop to zero and switch candidates later.",
      },
      {
        label: "Not verifying the candidate",
        body: "The problem guarantees a majority, so a second pass is unnecessary here. In an interview, mention that in real usage you should verify the candidate with a final pass.",
      },
      {
        label: "Counting from 1 incorrectly",
        body: "Initialize count to 0, then let the first iteration set candidate and count together. Starting count at 1 and skipping the first element works too, but it is easier to make an off-by-one mistake.",
      },
    ],
    complexityReasoning:
      "One linear pass updates only the candidate and a counter, so the time is O(n) and the extra space is O(1). A hash-map version would also be O(n) time but O(n) space.",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "nums = [3, 3, 4, 2, 4, 4, 2, 4, 4]. What is the candidate after the first five elements?",
        answer: "After 3,3,4,2,4 the count is 0 and the candidate is 4 (count resets at the last 4).",
      },
      {
        prompt: "Why does a two-pass verification matter if the problem guarantees a majority?",
        answer: "It matters for variants where the guarantee is removed. The algorithm always returns a candidate, but that candidate may not be a true majority without verification.",
      },
    ],
    interviewFraming:
      "Majority Element is a great place to show off the Boyer-Moore optimization after mentioning the hash-map baseline. Follow-ups include finding elements that appear more than n/3 times, or finding the majority in a data stream where you can only store O(1) state.",
  },

  {
    id: "arr-13",
    topicId: "arrays",
    title: "Find All Numbers Disappeared in an Array",
    difficulty: "Easy",
    tags: ["array", "hashset", "in-place"],
    problem:
      "Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums. Each number in nums appears once or twice.",
    constraints: [
      "n == nums.length",
      "1 <= n <= 10⁵",
      "1 <= nums[i] <= n",
    ],
    approach:
      "Use the array itself as a hash set by marking indices. For each value v, flip the sign of the value at index v - 1 to negative. After the first pass, any index whose value is still positive means the number index + 1 is missing. This uses O(1) extra space and O(n) time.",
    dryRun: [
      "nums = [4, 3, 2, 7, 8, 2, 3, 1]",
      "Mark index 3, 2, 1, 6, 7, 1, 2, 0 by flipping signs.",
      "After marking: [-4, -3, -2, -7, 8, -2, -3, -1]",
      "Only index 4 remains positive → missing number is 5.",
      "Return [5].",
    ],
    solution: `function findDisappearedNumbers(nums) {
  const missing = [];
  for (let i = 0; i < nums.length; i++) {
    const idx = Math.abs(nums[i]) - 1;
    if (nums[idx] > 0) {
      nums[idx] *= -1;
    }
  }
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      missing.push(i + 1);
    }
  }
  return missing;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) excl. output",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[4, 3, 2, 7, 8, 2, 3, 1]" },
      { label: "expected", value: "[5]" },
    ],
    vizMode: "array",

    intuition:
      "The values are guaranteed to be valid indices in disguise: every nums[i] is between 1 and n. Instead of allocating a separate seen set, we can use the sign bit at position nums[i] - 1 as a free marker. Positive means 'never visited'; negative means 'the number index + 1 was seen'.",
    pitfalls: [
      {
        label: "Using nums[i] directly as an index",
        body: "Values are 1-based, so the corresponding index is nums[i] - 1, not nums[i].",
      },
      {
        label: "Flipping an already flipped value back to positive",
        body: "Only flip if the value is currently positive. If it is already negative, the corresponding number has already been marked.",
      },
      {
        label: "Forgetting Math.abs when reading a visited value",
        body: "After the first pass some values are negative. Use Math.abs(nums[i]) to map back to the correct index.",
      },
    ],
    complexityReasoning:
      "Two linear passes visit every element once, so the time is O(n). The only extra structure is the output list; the sign flips happen in the input array, giving O(1) extra space.",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "nums = [1, 1]. What indices are flipped and what is the answer?",
        answer: "Index 0 is flipped twice (only the first time counts). Index 1 is never flipped, so the missing number is 2.",
      },
      {
        prompt: "Why is it safe to mutate the input array?",
        answer: "The problem allows O(1) extra space solutions, and the sign of a value carries the 'seen' information without destroying the original magnitude.",
      },
    ],
    interviewFraming:
      "This question tests the 'use the array as a hash table' trick. Follow-ups include finding duplicates, finding the first missing positive, and doing the same with values in the range [0, n - 1].",
  },

  {
    id: "arr-14",
    topicId: "arrays",
    title: "Replace Elements with Greatest Element on Right Side",
    difficulty: "Easy",
    tags: ["array"],
    problem:
      "Given an array arr, replace every element in that array with the greatest element among the elements to its right, and replace the last element with -1.",
    constraints: [
      "1 <= arr.length <= 10⁴",
      "1 <= arr[i] <= 10⁵",
    ],
    approach:
      "Traverse from right to left while keeping the maximum value seen so far. At each position i, write maxSoFar into the answer, then update maxSoFar to include arr[i]. The last position always receives -1 because there is no element to its right.",
    dryRun: [
      "arr = [17, 18, 5, 4, 6, 1]",
      "i=5: ans[5] = -1, max = 1",
      "i=4: ans[4] = 1, max = max(1, 6) = 6",
      "i=3: ans[3] = 6, max = max(6, 4) = 6",
      "i=2: ans[2] = 6, max = max(6, 5) = 6",
      "i=1: ans[1] = 6, max = max(6, 18) = 18",
      "i=0: ans[0] = 18, max = max(18, 17) = 18",
      "Return [18, 6, 6, 6, 1, -1].",
    ],
    solution: `function replaceElements(arr) {
  const n = arr.length;
  const ans = new Array(n);
  let maxSoFar = -1;
  for (let i = n - 1; i >= 0; i--) {
    ans[i] = maxSoFar;
    maxSoFar = Math.max(maxSoFar, arr[i]);
  }
  return ans;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) excl. output",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[17, 18, 5, 4, 6, 1]" },
      { label: "expected", value: "[18, 6, 6, 6, 1, -1]" },
    ],
    vizMode: "array",

    intuition:
      "The brute-force way recomputes the maximum of the suffix for each index, which is O(n²). Walking backwards is smarter: the greatest element on the right of i is either the greatest element on the right of i + 1 or arr[i + 1] itself. Keep that suffix maximum in one variable as you move left.",
    pitfalls: [
      {
        label: "Updating maxSoFar before writing ans[i]",
        body: "ans[i] should be the greatest element strictly to the right of i. Record the current max first, then include arr[i] for the next position to the left.",
      },
      {
        label: "Initializing maxSoFar to 0",
        body: "The last element has no right neighbor, so it becomes -1. Initialize maxSoFar to -1 to handle that case automatically.",
      },
      {
        label: "Walking left-to-right",
        body: "Left-to-right does not give you the future maximum in time. Right-to-left lets each step reuse the suffix maximum already computed.",
      },
    ],
    complexityReasoning:
      "One pass from right to left performs O(1) work per element, so time is O(n). Only the output array and maxSoFar are stored, giving O(1) extra space.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "arr = [400]. What is the answer?",
        answer: "[-1]. There are no elements to the right of the only element.",
      },
      {
        prompt: "arr = [5, 4, 3, 2, 1]. At i = 1, what is maxSoFar before writing ans[1]?",
        answer: "maxSoFar is 2 (the max of elements to the right of index 1). ans[1] becomes 2, then maxSoFar updates to 4.",
      },
    ],
    interviewFraming:
      "This is a gentle introduction to suffix/precomputation patterns. It often leads to rain-water trapping, trapping rainwater with a stack, or product-of-array-except-self style problems where future information is needed efficiently.",
  },

  {
    id: "arr-15",
    topicId: "arrays",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    tags: ["matrix", "array"],
    problem:
      "Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. You must do it in place.",
    constraints: [
      "m == matrix.length",
      "n == matrix[0].length",
      "1 <= m, n <= 200",
      "-2³¹ <= matrix[i][j] <= 2³¹ - 1",
    ],
    approach:
      "Use the first row and first column of the matrix as markers. First determine whether the first row and first column themselves need to be zeroed. Then scan the rest of the matrix: whenever matrix[i][j] is 0, set matrix[i][0] and matrix[0][j] to 0. In a second pass, zero any cell whose row or column marker is 0. Finally zero the first row and column if needed.",
    dryRun: [
      "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
      "First row has no 0; first col has no 0.",
      "Mark: matrix[1][0]=0 and matrix[0][1]=0 because matrix[1][1]=0.",
      "Second pass zeroes row 1 and column 1.",
      "Result: [[1,0,1],[0,0,0],[1,0,1]].",
    ],
    solution: `function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let firstRowHasZero = false;
  let firstColHasZero = false;

  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowHasZero = true;
      break;
    }
  }
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColHasZero = true;
      break;
    }
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  if (firstRowHasZero) {
    for (let j = 0; j < n; j++) matrix[0][j] = 0;
  }
  if (firstColHasZero) {
    for (let i = 0; i < m; i++) matrix[i][0] = 0;
  }
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "[[1,1,1],[1,0,1],[1,1,1]]" },
      { label: "expected", value: "[[1,0,1],[0,0,0],[1,0,1]]" },
    ],
    vizMode: "array",

    intuition:
      "The obvious solution records every zero position in a set, but that uses O(m + n) extra space. Since the first row and column already touch every other cell, they can double as row and column markers. We just need two extra booleans to remember whether those two boundaries themselves should be zeroed.",
    pitfalls: [
      {
        label: "Zeroing the first row or column too early",
        body: "If you zero the markers before scanning the rest of the matrix, you lose the original information. Record the two booleans first, mark the rest, zero the interior, then handle the boundaries last.",
      },
      {
        label: "Missing a zero in the first row or column",
        body: "Scan the first row and column separately. A zero there means the whole corresponding boundary must become zero, but it also needs to propagate into the interior through the marker cells.",
      },
      {
        label: "Treating markers as final values during the interior pass",
        body: "When scanning interior cells (i >= 1, j >= 1), only look at matrix[i][0] and matrix[0][j] as markers. Do not interpret a marker of 0 as a reason to zero the entire matrix prematurely.",
      },
    ],
    complexityReasoning:
      "We make a constant number of passes over the matrix, each visiting every cell once. The total time is therefore O(m · n). Only two boolean flags are used beyond the matrix itself, so the extra space is O(1).",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "matrix = [[0,1],[1,1]]. What are firstRowHasZero and firstColHasZero?",
        answer: "Both true. The first row and first column both contain the original 0.",
      },
      {
        prompt: "After marking interior zeros but before zeroing boundaries, what value propagates into matrix[1][1] in the example above?",
        answer: "matrix[1][0] becomes 0 because matrix[1][0] was already 0, so matrix[1][1] is zeroed in the interior pass. The boundary pass then zeroes the entire first row and column.",
      },
    ],
    interviewFraming:
      "Set Matrix Zeroes is the classic matrix in-place marker problem. A common first acceptable answer uses hash sets for rows and columns; the follow-up is the O(1) space version shown here. Interviewers may also ask for a single-pass variant or the same idea on sparse matrices.",
  },
];
