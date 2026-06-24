import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "dp-1",
    topicId: "dp",
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["dp", "1d"],
    problem:
      "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    constraints: [
      "1 <= n <= 45",
      "Each move is either 1 or 2 steps.",
    ],
    approach:
      "At every step you could have arrived from one step below or two steps below, so the number of ways to reach step `i` is the sum of the ways to reach the two previous steps. This is the Fibonacci recurrence. We only need the previous two values, so we keep two rolling variables instead of an array.",
    dryRun: [
      "n = 4 → 5 ways: 1111, 112, 121, 211, 22",
    ],
    solution: `function climbStairs(n) {
  if (n < 3) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Imagine you are at the top of the stairs and wonder how you got there. Your last move was either a single step from the step below or a double step from two steps below. Those two groups of paths are completely separate, so the total ways to reach the top equals the ways to reach those two earlier steps added together. The same reasoning repeats at every step, which means the answer builds upward from tiny base cases.",
    pitfalls: [
      {
        label: "Wrong base cases",
        body: "For n = 1 the answer is 1 (one single step), and for n = 2 the answer is 2 (1+1 or 2). Returning n handles both, but returning 1 for n = 2 loses the (2) path.",
      },
      {
        label: "Using naive recursion without memoization",
        body: "A plain recursive Fibonacci recomputes the same subproblems exponentially many times. Use iteration or memoization to stay at O(n).",
      },
      {
        label: "Updating rolling variables out of order",
        body: "When rolling (a, b) forward, the new b must use the old a and old b together. Use destructuring [a, b] = [b, a + b] so both values update simultaneously.",
      },
    ],
    complexityReasoning:
      "We iterate once from 3 to n, doing O(1) work per step, so the running time is O(n). Only two integers are stored no matter how large n gets, giving O(1) extra space. The problem bound n ≤ 45 keeps the result within a normal JavaScript number.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What are climbStairs(1) and climbStairs(2)?",
        answer: "1 and 2. For one step there is only the single step; for two steps you can take (1,1) or (2).",
      },
      {
        prompt: "Why is dp[i] = dp[i-1] + dp[i-2] the right recurrence?",
        answer: "Every valid path to step i ends with either a single step from i-1 or a double step from i-2, and those two groups do not overlap.",
      },
    ],
    interviewFraming:
      "This is the standard introduction to dynamic programming because the recurrence is easy to spot. Interviewers use it to check whether you recognize overlapping subproblems and can optimize space. Common follow-ups include allowing 1, 2, or 3 steps per move, or using matrix exponentiation to reach O(log n) time.",

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
  },
  {
    id: "dp-2",
    topicId: "dp",
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["dp", "unbounded-knapsack"],
    problem:
      "You are given coins of different denominations and a total amount of money. Write a function to compute the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return -1.",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2³¹ - 1",
      "0 <= amount <= 10⁴",
    ],
    approach:
      "Build a `dp` array where `dp[i]` is the minimum number of coins needed to make amount `i`. Initialize every entry to Infinity except `dp[0] = 0`. For every amount from 1 to the target, try every coin that fits and keep the smallest count.",
    dryRun: [
      "coins = [1, 5, 10, 25], amount = 41 → 4 coins (25 + 10 + 5 + 1)",
    ],
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    timeComplexity: "O(amount · n)",
    spaceComplexity: "O(amount)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A greedy approach would grab the biggest coin first, but that can fail — for coins [1, 3, 4] and amount 6, greedy picks 4+1+1 (three coins) while the optimal answer is 3+3 (two coins). Dynamic programming fixes this by solving every smaller amount first. To make amount i, we look at every coin that fits and ask: what is the cheapest way to make i minus that coin, plus one more coin?",
    pitfalls: [
      {
        label: "Infinity initialization mistakes",
        body: "Use Infinity so Math.min correctly keeps smaller counts. A large sentinel like Number.MAX_SAFE_INTEGER works too, but Infinity is clearer and avoids accidental wrap-around.",
      },
      {
        label: "Forgetting dp[0] = 0",
        body: "Zero coins make amount 0. Without this base case, every amount stays Infinity because the recurrence can never bootstrap.",
      },
      {
        label: "Returning Infinity instead of -1",
        body: "If dp[amount] is still Infinity after the loops, the amount is impossible. Convert that sentinel to -1 before returning.",
      },
      {
        label: "Treating it as 0/1 knapsack",
        body: "Each coin can be used unlimited times, so the inner loop iterates over coins normally. Do not iterate amount backwards, which is the pattern for items used at most once.",
      },
    ],
    complexityReasoning:
      "There are amount + 1 states, and for each state we scan all n coins, so the time is O(amount · n). We store one number per amount, giving O(amount) space. A one-dimensional array is enough because each state only depends on earlier amounts.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What does dp[i] represent in this problem?",
        answer: "The minimum number of coins needed to make amount i.",
      },
      {
        prompt: "Why is dp[0] initialized to 0?",
        answer: "Zero coins are needed to make amount 0, and that base case lets the recurrence build up every larger amount.",
      },
    ],
    interviewFraming:
      "Coin Change is the textbook unbounded-knapsack DP problem. Interviewers often ask it before moving to harder variants such as counting the number of ways to make change, printing one valid combination, or solving with BFS where each edge represents adding a coin.",

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
  },
  {
    id: "dp-3",
    topicId: "dp",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    tags: ["dp", "2d", "string"],
    problem:
      "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    constraints: [
      "1 <= text1.length, text2.length <= 1000",
      "text1 and text2 consist of only lowercase English characters.",
    ],
    approach:
      "Build a 2D table on the prefixes of both strings. If the current characters match, the subsequence length grows by one from the diagonal. Otherwise, carry forward the best result from either dropping the current character of the first string or the second string.",
    dryRun: [
      "text1 = 'abcde', text2 = 'ace' → 3 ('ace')",
    ],
    solution: `function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A subsequence keeps characters in order but can skip characters, so comparing whole strings directly is messy. Instead, compare prefixes: the longest common subsequence of the first i characters of one string and the first j characters of the other is either one more than the answer for i-1 and j-1 (when the new characters match) or the better of dropping one character from either side.",
    pitfalls: [
      {
        label: "Off-by-one index confusion",
        body: "dp[i][j] usually represents the prefixes ending at text1[i-1] and text2[j-1]. Keep the string indices one behind the table indices to avoid shifting errors.",
      },
      {
        label: "Reversing rows and columns",
        body: "The outer loop typically walks the first string and the inner loop walks the second. Either orientation works, but pick one and stay consistent in your reasoning.",
      },
      {
        label: "Returning the wrong corner",
        body: "The answer lives at dp[m][n], the bottom-right corner that covers both full strings, not dp[m-1][n-1].",
      },
      {
        label: "Forgetting to add 1 on a match",
        body: "When text1[i-1] === text2[j-1], the new common character extends the diagonal value by exactly one.",
      },
    ],
    complexityReasoning:
      "There are (m+1)(n+1) table cells, and each cell is filled in O(1) time by inspecting at most three neighbors. Therefore the time complexity is O(m · n). The full table also needs O(m · n) space, though it can be compressed to O(min(m, n)) if you only reconstruct the length.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What happens when text1[i-1] === text2[j-1]?",
        answer: "dp[i][j] becomes dp[i-1][j-1] + 1 because the matching character extends the LCS of the shorter prefixes.",
      },
      {
        prompt: "What does it mean to take max(dp[i-1][j], dp[i][j-1])?",
        answer: "We are choosing whether to drop the current character of text1 or text2, and keeping the better LCS length found so far.",
      },
    ],
    interviewFraming:
      "LCS appears in diff utilities, version control, and bioinformatics. In interviews it tests whether you can set up a 2D recurrence. Common follow-ups ask you to reconstruct the actual subsequence, reduce space to one row, or adapt the idea to edit distance.",

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
  },
  {
    id: "dp-4",
    topicId: "dp",
    title: "0/1 Knapsack",
    difficulty: "Medium",
    tags: ["dp", "knapsack"],
    problem:
      "You are given `items`, where each item has a weight and a value, and a knapsack with maximum capacity `W`. Determine the maximum total value you can carry if each item may be used at most once.",
    constraints: [
      "1 <= items.length <= 100",
      "1 <= weight, value <= 1000",
      "1 <= W <= 10⁴",
    ],
    approach:
      "Maintain a 1D array `dp[w]` that stores the best value achievable with capacity `w`. For each item, update the table from high capacity down to the item's weight. The backward walk guarantees each item is only considered once.",
    dryRun: [
      "items = [[1,1],[3,4],[4,5],[5,7]], W = 7 → 9 (items of value 4 and 5, total weight 7)",
    ],
    solution: `function knapsack(items, W) {
  const dp = new Array(W + 1).fill(0);

  for (const [weight, value] of items) {
    for (let w = W; w >= weight; w--) {
      dp[w] = Math.max(dp[w], dp[w - weight] + value);
    }
  }
  return dp[W];
}`,
    timeComplexity: "O(n · W)",
    spaceComplexity: "O(W)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "For every item we face a binary choice: take it or leave it. If we take it, we free up capacity equal to its weight and add its value to whatever we could already achieve with the remaining capacity. Dynamic programming records the best value for every possible capacity, so when we consider a new item we can immediately look up the answer for the leftover weight.",
    pitfalls: [
      {
        label: "Iterating capacity forwards",
        body: "Forward iteration would let the same item be reused multiple times, turning 0/1 knapsack into unbounded knapsack. Always walk capacity backwards.",
      },
      {
        label: "Confusing weight and value",
        body: "The dp index is capacity (weight), and the stored value is total worth. Do not use value as an array index unless the problem asks for a minimum-weight-to-value variant.",
      },
      {
        label: "Initializing with -Infinity",
        body: "For maximizing value with capacity, 0 is the correct base because an empty knapsack has zero value. -Infinity is only needed when you must exactly fill the capacity.",
      },
      {
        label: "Ignoring items that do not fit",
        body: "Start the inner loop at the item's weight, not at 0. If an item does not fit, the best value for that capacity simply stays the same.",
      },
    ],
    complexityReasoning:
      "There are n items and W capacity states. Each item triggers one pass over the capacity array, so the total time is O(n · W). We only need a one-dimensional array of length W+1, giving O(W) space. This is pseudo-polynomial because W is a numeric input, not the number of bits needed to represent it.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "Why does the inner loop run from W down to weight?",
        answer: "A backward pass ensures each item is used at most once. A forward pass would reuse the same item because updated smaller capacities would be read again in the same iteration.",
      },
      {
        prompt: "What does dp[w] store?",
        answer: "The maximum total value achievable using some subset of the processed items with total weight at most w.",
      },
    ],
    interviewFraming:
      "0/1 Knapsack is the foundational DP pattern behind many disguised problems. Interviewers may ask you to track which items were chosen, handle multiple constraints, or recognize it in problems about partitioning arrays or scheduling with budgets.",

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
  },
  {
    id: "dp-5",
    topicId: "dp",
    title: "Unique Paths",
    difficulty: "Medium",
    tags: ["dp", "2d", "grid"],
    problem:
      "A robot is located at the top-left corner of a `m x n` grid and can only move either down or right. The robot is trying to reach the bottom-right corner. How many possible unique paths are there?",
    constraints: [
      "1 <= m, n <= 100",
    ],
    approach:
      "The number of ways to reach a cell is the sum of the ways to reach the cell above it and the cell to its left. The first row and first column each have exactly one path. We can compress the table to a single rolling row.",
    dryRun: [
      "m = 3, n = 7 → 28",
    ],
    solution: `function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(n)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Think of every path as a sequence of moves: exactly (m-1) downs and (n-1) rights. From a local view, the robot can only enter a cell from above or from the left, so the number of ways to finish at that cell is simply the sum of those two predecessor counts. The whole grid fills itself once the top and left edges are seeded with 1s.",
    pitfalls: [
      {
        label: "Forgetting the first row and column",
        body: "There is exactly one way to reach every cell in the first row (only right moves) and the first column (only down moves). Miss this and the whole table stays wrong.",
      },
      {
        label: "Using a 2D array when 1D suffices",
        body: "Each row only needs values from the current row and the previous row. A single rolling array updated left-to-right gives the same answer with O(n) space.",
      },
      {
        label: "Updating the array right-to-left",
        body: "When using a 1D array, the current cell needs the value at j-1 from the same row, which must already be updated. Walk left to right.",
      },
    ],
    complexityReasoning:
      "There are m rows and n columns, and each cell is computed once in O(1) time from two neighbors, so the time is O(m · n). A 1D rolling array stores n values, giving O(n) extra space. The combinatorics shortcut also exists — (m+n-2 choose m-1) — but the DP version is more flexible when obstacles appear.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "Why is every cell in the first row initialized to 1?",
        answer: "The robot can only reach those cells by moving right repeatedly, so there is exactly one path to each of them.",
      },
      {
        prompt: "What is the recurrence for dp[i][j]?",
        answer: "dp[i][j] = dp[i-1][j] + dp[i][j-1], the sum of paths from the cell above and the cell to the left.",
      },
    ],
    interviewFraming:
      "Unique Paths is the grid DP warm-up. Interviewers often follow with obstacles, minimum path sum, or a variation where some moves cost more. It tests whether you can seed base cases correctly and compress a 2D recurrence.",

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
  },
  {
    id: "dp-6",
    topicId: "dp",
    title: "House Robber",
    difficulty: "Medium",
    tags: ["dp", "1d"],
    problem:
      "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400",
    ],
    approach:
      "At each house, either rob it and add its money to the best score from two houses back, or skip it and keep the best score from the previous house. Two rolling variables store the best totals for the previous two positions.",
    dryRun: [
      "nums = [1, 2, 3, 1] → 4 (rob house 0 and house 2)",
    ],
    solution: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const n of nums) {
    const current = Math.max(prev1, prev2 + n);
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Stand in front of a house and ask: should I rob it or not? If I rob it, I cannot have robbed the house just before it, so my total is this house's money plus the best I could do two houses ago. If I skip it, my total is simply the best I could do one house ago. The decision at each house only depends on the previous two answers, so two variables are enough.",
    pitfalls: [
      {
        label: "Mutating the input array",
        body: "Overwriting nums[i] to store the DP value works but is bad practice and may break tests that reuse the input. Use separate variables or a separate array.",
      },
      {
        label: "Empty array edge case",
        body: "The loop naturally returns 0 for an empty array because prev1 starts at 0, but verify your base cases when reading the problem constraints.",
      },
      {
        label: "Wrong variable order in the roll",
        body: "After computing current, update prev2 to the old prev1 and prev1 to current. If you update prev1 first, you lose the value needed for prev2.",
      },
    ],
    complexityReasoning:
      "We make a single pass over the array and do O(1) work per house, so the running time is O(n). Only two integers are kept regardless of n, giving O(1) extra space. This is a classic example of compressing a 1D DP recurrence into rolling variables.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What is the recurrence for the maximum money up to house i?",
        answer: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Either skip the house or rob it and add the best score from two houses back.",
      },
      {
        prompt: "Why do we only need two variables?",
        answer: "The recurrence for house i only looks at i-1 and i-2, so older values can be discarded.",
      },
    ],
    interviewFraming:
      "House Robber tests whether you can spot a simple state transition. It is often a stepping stone to the circular version (House Robber II) and the tree version, where the recurrence moves from a linear array to a binary tree post-order traversal.",

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
  },
  {
    id: "dp-7",
    topicId: "dp",
    title: "House Robber II (Circle)",
    difficulty: "Medium",
    tags: ["dp", "1d"],
    problem:
      "You are a professional robber planning to rob houses along a street. The houses are arranged in a circle, meaning the first and last houses are adjacent. Return the maximum amount of money you can rob without alerting the police.",
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 1000",
    ],
    approach:
      "The circular layout forces a choice: either the first house is robbed or the last house is robbed, but never both. Split the problem into two linear House Robber runs, one on houses 0 to n-2 and one on houses 1 to n-1, then take the larger result.",
    dryRun: [
      "nums = [2, 3, 2] → 3 (rob house 1)",
    ],
    solution: `function rob2(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return Math.max(robLinear(nums, 0, nums.length - 2), robLinear(nums, 1, nums.length - 1));

  function robLinear(arr, start, end) {
    let prev2 = 0, prev1 = 0;
    for (let i = start; i <= end; i++) {
      const current = Math.max(prev1, prev2 + arr[i]);
      prev2 = prev1;
      prev1 = current;
    }
    return prev1;
  }
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "In the straight-line version, the first and last houses are independent. In the circular version they become neighbors, so a valid robbery must either avoid the first house or avoid the last house. We can try both scenarios by running the same linear DP twice on two slightly shorter streets and picking the better score.",
    pitfalls: [
      {
        label: "Ignoring the n = 1 edge case",
        body: "If there is only one house, there is no neighbor to worry about, so the answer is simply that house's money. Returning 0 here would be wrong.",
      },
      {
        label: "Running the same helper without bounds",
        body: "The helper must accept start and end indices. Calling it on the full array would allow robbing both the first and last houses simultaneously, breaking the circular constraint.",
      },
      {
        label: "Double counting when n = 2",
        body: "With two houses in a circle, they are adjacent, so you can only rob one. The max of the two linear runs correctly returns the larger single value.",
      },
    ],
    complexityReasoning:
      "We run two linear passes, each visiting at most n houses once and doing O(1) work per house. Therefore the total time stays O(n). We reuse the same two rolling variables for both passes, so the extra space remains O(1).",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "Why are there two separate linear runs?",
        answer: "The first run excludes the last house, and the second run excludes the first house. Together they cover every valid circular robbery plan.",
      },
      {
        prompt: "What happens when nums.length === 1?",
        answer: "There is no circular adjacency issue, so we return nums[0] immediately.",
      },
    ],
    interviewFraming:
      "This is a common follow-up to House Robber because it forces you to break a constraint into cases. Be ready to explain why two linear passes are exhaustive. Further twists include a binary tree street (House Robber III) or weighted intervals.",

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
  },
  {
    id: "dp-8",
    topicId: "dp",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    tags: ["dp", "binary-search"],
    problem:
      "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    constraints: [
      "0 <= nums.length <= 2500",
      "-10⁴ <= nums[i] <= 10⁴",
    ],
    approach:
      "Use patience sorting: maintain an array `tails` where `tails[len]` is the smallest ending value of an increasing subsequence of length len+1. For each number, binary-search the first tail that is greater than or equal to it and replace that tail. The length of `tails` is the LIS length.",
    dryRun: [
      "nums = [10, 9, 2, 5, 3, 7, 101, 18] → 4 (e.g., [2, 3, 7, 101])",
    ],
    solution: `function lengthOfLIS(nums) {
  const tails = [];

  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    tails[lo] = x;
  }
  return tails.length;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A naive DP tries every earlier element as a predecessor, giving O(n²). The trick is to ask a different question: for each possible subsequence length, what is the smallest ending value we can achieve? A smaller ending value is always better because it leaves more room for future numbers to extend the sequence. We keep those best endings sorted and use binary search to update them.",
    pitfalls: [
      {
        label: "Using upper_bound instead of lower_bound",
        body: "We want the first tail that is >= x so we can replace it. If we use strict >, equal values would extend the sequence, breaking the strictly increasing requirement.",
      },
      {
        label: "Thinking tails itself is the LIS",
        body: "The length of tails equals the LIS length, but the actual contents of tails are not necessarily a valid increasing subsequence of the input. Use them only for bookkeeping.",
      },
      {
        label: "Off-by-one in binary search bounds",
        body: "hi starts at tails.length, not tails.length - 1, because x may be larger than every existing tail and extend the array by one.",
      },
      {
        label: "Empty input",
        body: "If nums is empty, the loop never runs and tails.length is 0, which is the correct answer.",
      },
    ],
    complexityReasoning:
      "Each of the n elements triggers a binary search over tails, whose size is at most n, so each insertion costs O(log n). That gives O(n log n) total time. The tails array stores at most one value per possible subsequence length, so the extra space is O(n).",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What does tails[k] represent?",
        answer: "The smallest possible ending value of an increasing subsequence of length k + 1.",
      },
      {
        prompt: "Why do we binary search for the first tail >= x?",
        answer: "Replacing that tail preserves the same subsequence length but with a smaller ending value, making future extensions easier.",
      },
    ],
    interviewFraming:
      "LIS is the classic example of improving a DP with binary search. Be ready to explain both the O(n²) DP and the O(n log n) patience-sorting trick. Follow-ups often ask you to reconstruct an actual LIS, count the number of LIS sequences, or solve the problem in an online stream.",

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
  },
  {
    id: "dp-9",
    topicId: "dp",
    title: "Edit Distance",
    difficulty: "Hard",
    tags: ["dp", "2d", "string"],
    problem:
      "Given two strings `word1` and `word2`, return the minimum number of operations required to convert word1 to word2. You have three operations: insert a character, delete a character, or replace a character.",
    constraints: [
      "0 <= word1.length, word2.length <= 500",
      "word1 and word2 consist of lowercase English letters.",
    ],
    approach:
      "Build a DP table over all prefixes. `dp[i][j]` is the minimum edits to convert the first i characters of word1 into the first j characters of word2. If the current characters match, no new operation is needed; otherwise take the cheapest of insert, delete, or replace.",
    dryRun: [
      "word1 = 'horse', word2 = 'ros' → 3 (replace h with r, remove r, remove e)",
    ],
    solution: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // delete
          dp[i][j - 1],     // insert
          dp[i - 1][j - 1]  // replace
        );
      }
    }
  }
  return dp[m][n];
}`,
    timeComplexity: "O(m · n)",
    spaceComplexity: "O(m · n)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Think of building the answer one character at a time from the fronts of both strings. If the next characters already match, nothing needs to change and we move both pointers forward. If they differ, we have three choices: delete a character from word1, insert a character into word1, or replace one character to match. We pick whichever leaves the rest of the problem in the cheapest state.",
    pitfalls: [
      {
        label: "Wrong base-case initialization",
        body: "dp[i][0] equals i because converting word1's first i characters to an empty string requires i deletions. dp[0][j] equals j because building j characters from scratch needs j insertions.",
      },
      {
        label: "Confusing insert and delete directions",
        body: "dp[i-1][j] means we deleted word1[i-1] and still need to match j characters of word2. dp[i][j-1] means we inserted word2[j-1] into word1 and now need to match one more character.",
      },
      {
        label: "Skipping the match case",
        body: "When word1[i-1] === word2[j-1], the cost does not increase. Do not add 1; carry the diagonal value forward unchanged.",
      },
      {
        label: "Returning dp[m-1][n-1]",
        body: "The table has an extra leading row and column for the empty prefix, so the answer is at dp[m][n], not the raw string indices.",
      },
    ],
    complexityReasoning:
      "The table has (m+1)(n+1) entries. Filling each entry needs O(1) time by comparing two characters and taking the minimum of three neighbors, so the total time is O(m · n). We store the full table, giving O(m · n) space. It can be reduced to two rows, O(n), if only the final distance is required.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What are the three options when word1[i-1] !== word2[j-1]?",
        answer: "Delete word1[i-1] (dp[i-1][j]), insert word2[j-1] (dp[i][j-1]), or replace word1[i-1] with word2[j-1] (dp[i-1][j-1]).",
      },
      {
        prompt: "What does dp[i][0] = i mean in plain English?",
        answer: "Turning the first i characters of word1 into an empty string takes i deletions.",
      },
    ],
    interviewFraming:
      "Edit Distance is a fundamental string DP that shows up in spell checkers, DNA alignment, and diff algorithms. Interviewers may ask you to explain each operation, reconstruct the actual sequence of edits, or optimize space to O(min(m, n)).",

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
  },
  {
    id: "dp-10",
    topicId: "dp",
    title: "Decode Ways",
    difficulty: "Medium",
    tags: ["dp", "string"],
    problem:
      "A message containing letters from A-Z can be encoded into numbers using the mapping '1' -> A, '2' -> B, ..., '26' -> Z. Given a string s containing only digits, return the number of ways to decode it.",
    constraints: [
      "1 <= s.length <= 100",
      "s contains only digits and may contain leading zeros only if they are not valid encodings.",
    ],
    approach:
      "At each position, the current digit can form a single-letter decode if it is not '0'. The current and previous digits together can form a double-letter decode if their value is between 10 and 26. The total ways to reach position i is the sum of the valid previous states.",
    dryRun: [
      "s = '226' → 3 ('BBF', 'BZ', 'VF')",
    ],
    solution: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;

  let prev2 = 1; // ways to decode empty prefix
  let prev1 = 1; // ways to decode first character

  for (let i = 2; i <= s.length; i++) {
    let current = 0;
    const oneDigit = s[i - 1];
    const twoDigits = Number(s.slice(i - 2, i));

    if (oneDigit !== '0') current += prev1;
    if (twoDigits >= 10 && twoDigits <= 26) current += prev2;

    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Walk through the digit string left to right. At each new digit you can either start a fresh one-digit letter (unless the digit is '0', since no letter maps to zero) or pair it with the previous digit to make a two-digit letter (only if the pair is between 10 and 26). The number of ways to decode up to position i is just the sum of the ways from those two valid earlier positions.",
    pitfalls: [
      {
        label: "Ignoring leading zero",
        body: "If the string starts with '0' there are zero valid decodings. Return 0 immediately before entering the loop.",
      },
      {
        label: "Treating '0' as a single digit",
        body: "A standalone '0' is never valid. It can only appear as part of '10' or '20', so the one-digit branch must skip it.",
      },
      {
        label: "Wrong bounds for two-digit decode",
        body: "Valid two-digit letters are 10 through 26. Values like '01', '02', or '27' are not allowed, so check the numeric range carefully.",
      },
      {
        label: "Rolling variable order",
        body: "After computing current, shift prev2 to the old prev1 and prev1 to current. Updating in the wrong order loses one of the needed history values.",
      },
    ],
    complexityReasoning:
      "We scan the string once and perform O(1) work per character, so the time is O(n). Only the previous two counts are needed, giving O(1) extra space. The original array version uses O(n) space but is not necessary here.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "When does the current digit contribute a single-digit decode?",
        answer: "When s[i-1] is not '0', because every non-zero digit maps to a letter A through I.",
      },
      {
        prompt: "What two-digit values are valid?",
        answer: "10 through 26, because the alphabet mapping stops at '26' = Z.",
      },
    ],
    interviewFraming:
      "Decode Ways is a standard DP-on-string problem. Interviewers like it because it looks like a simple counting problem but has subtle edge cases around zeros. Follow-ups include returning all possible decodings, handling a custom mapping, or counting modulo a large prime.",

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
  },
  {
    id: "dp-11",
    topicId: "dp",
    title: "Word Break",
    difficulty: "Medium",
    tags: ["dp", "string", "hashmap"],
    problem:
      "Given a string `s` and a dictionary of strings `wordDict`, return true if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "All characters are lowercase English letters.",
    ],
    approach:
      "Create a boolean array `dp` where `dp[i]` means the prefix `s[0..i-1]` can be segmented. `dp[0]` is true for the empty prefix. For each position i, look at every earlier position j; if `dp[j]` is true and the substring `s[j..i-1]` is in the dictionary, then `dp[i]` becomes true.",
    dryRun: [
      "s = 'leetcode', wordDict = ['leet', 'code'] → true ('leet' + 'code')",
      "s = 'applepenapple', wordDict = ['apple', 'pen'] → true",
      "s = 'catsandog', wordDict = ['cats', 'dog', 'sand', 'and', 'cat'] → false",
    ],
    solution: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    timeComplexity: "O(n² · L)",
    spaceComplexity: "O(n + D)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Think of the string as a sentence we are trying to chop into dictionary words. If we already know that the first j characters form a valid sentence, the only remaining question is whether the next chunk, from j to i-1, is also a word. By checking every possible split point, we gradually prove which prefixes are breakable and reuse those proofs for longer prefixes.",
    pitfalls: [
      {
        label: "Forgetting dp[0] = true",
        body: "The empty prefix is trivially breakable and serves as the foundation. Without it, no later dp[i] can ever become true.",
      },
      {
        label: "Checking the substring in O(L) each time",
        body: "Use a Set for O(1) lookups. Scanning the entire wordDict array inside the inner loop turns a clean solution into an unnecessary bottleneck.",
      },
      {
        label: "Off-by-one in slice indices",
        body: "dp[i] covers s[0..i-1], so the candidate word ending at i starts at j and is s.slice(j, i). Do not use inclusive end indices.",
      },
      {
        label: "Not breaking early",
        body: "Once you find a valid split at position i, you can stop the inner loop. Continuing to search does not change dp[i] from true.",
      },
    ],
    complexityReasoning:
      "There are n+1 prefix states. For each state we try up to n split points, and each substring lookup in the Set costs O(L) where L is the average word length. That gives O(n² · L) time in the worst case. We store the dp array of size O(n) and the dictionary Set of size O(D), where D is the total number of dictionary words.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "What does dp[i] represent in Word Break?",
        answer: "It is true if the prefix s[0..i-1] can be segmented entirely into dictionary words.",
      },
      {
        prompt: "Why convert wordDict into a Set?",
        answer: "Set lookups are O(1) on average, so checking whether a substring is a dictionary word is fast.",
      },
    ],
    interviewFraming:
      "Word Break is a classic DP plus hash-set combination. Interviewers often follow up with Word Break II, which asks you to return all valid segmentations and requires backtracking on top of the same DP table. Another twist is asking for the minimum number of dictionary words used.",

    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "s", value: "leetcode" },
      { label: "wordDict", value: "['leet','code']" },
      { label: "expected", value: "true" },
    ],
  },
  {
    id: "dp-12",
    topicId: "dp",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    tags: ["dp", "array"],
    problem:
      "Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return the product.",
    constraints: [
      "1 <= nums.length <= 2 · 10⁴",
      "-10 <= nums[i] <= 10",
      "The product of any prefix or suffix fits in a 32-bit integer.",
    ],
    approach:
      "A negative number can turn a small product into a large one, so we must track both the maximum and minimum product ending at each position. For each number, update the max and min by considering the number by itself, the number times the previous max, and the number times the previous min. If the number is negative, swap max and min before multiplying.",
    dryRun: [
      "nums = [2, 3, -2, 4] → 6 (subarray [2, 3])",
      "nums = [-2, 0, -1] → 0 (subarray [0])",
      "nums = [-2, 3, -4] → 24 (subarray [-2, 3, -4])",
    ],
    solution: `function maxProduct(nums) {
  let maxSoFar = nums[0];
  let minSoFar = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    if (n < 0) {
      [maxSoFar, minSoFar] = [minSoFar, maxSoFar];
    }
    maxSoFar = Math.max(n, maxSoFar * n);
    minSoFar = Math.min(n, minSoFar * n);
    result = Math.max(result, maxSoFar);
  }
  return result;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "With sums, the best subarray ending here is either extended from the previous best or restarted at the current element. Products are trickier because multiplying by a negative number flips large to small and small to large. That means we need to remember both extremes: the biggest positive product and the most negative product ending at the previous position. Either one could become the new champion after the next multiplication.",
    pitfalls: [
      {
        label: "Only tracking the maximum product",
        body: "A deeply negative product can become the maximum after multiplying by a negative number. You must also track the minimum product.",
      },
      {
        label: "Forgetting to swap on negative numbers",
        body: "When the current number is negative, the old maximum becomes the new minimum candidate and vice versa. Swap before updating.",
      },
      {
        label: "Starting the result from 0",
        body: "Initialize result, maxSoFar, and minSoFar from nums[0]. Starting from 0 would incorrectly return 0 for arrays where all products are negative.",
      },
      {
        label: "Restarting too aggressively",
        body: "The current element alone is already considered inside Math.max and Math.min, so there is no need for a separate reset branch.",
      },
    ],
    complexityReasoning:
      "We make one pass over the array and perform O(1) work per element, so the total time is O(n). We store only three scalar variables regardless of input size, giving O(1) extra space.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "Why do we track the minimum product as well as the maximum?",
        answer: "A negative minimum can become a new maximum after multiplying by another negative number.",
      },
      {
        prompt: "What happens when nums[i] is negative?",
        answer: "We swap maxSoFar and minSoFar before updating, because multiplying by a negative flips their roles.",
      },
    ],
    interviewFraming:
      "Maximum Product Subarray is the natural sibling to maximum subarray (Kadane). Interviewers ask it to see if you understand that a local minimum can become a global maximum. Follow-ups include finding the actual subarray indices, handling modulo arithmetic, or generalizing to arrays with zeros and negative numbers.",

    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "nums", value: "[2, 3, -2, 4]" },
      { label: "expected", value: "6" },
    ],
  },
  {
    id: "dp-13",
    topicId: "dp",
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    tags: ["dp", "knapsack"],
    problem:
      "Given a non-empty array `nums` containing only positive integers, determine if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
    constraints: [
      "1 <= nums.length <= 200",
      "1 <= nums[i] <= 100",
      "The sum of all elements is at most 10⁴.",
    ],
    approach:
      "If the total sum is odd, equal partition is impossible. Otherwise the goal is to find a subset that sums to total / 2. This is exactly 0/1 knapsack: each number is an item with weight equal to its value, and the knapsack capacity is total / 2. Use a boolean dp array and walk capacity backwards.",
    dryRun: [
      "nums = [1, 5, 11, 5] → true (subsets [1, 5, 5] and [11])",
      "nums = [1, 2, 3, 5] → false (total 11 is odd)",
    ],
    solution: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;

  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const n of nums) {
    for (let w = target; w >= n; w--) {
      dp[w] = dp[w] || dp[w - n];
    }
  }
  return dp[target];
}`,
    timeComplexity: "O(n · target)",
    spaceComplexity: "O(target)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "If we want two equal-sum subsets, each subset must sum to half of the total. First check whether the total is even; if it is odd, the answer is automatically false. The remaining task is to decide whether some numbers add up to that half. That is a yes-or-no knapsack problem where every number can be used once and the capacity is exactly half the total.",
    pitfalls: [
      {
        label: "Forgetting the odd-sum early exit",
        body: "If the total sum is odd, no integer partition can split it into two equal integers. Return false immediately.",
      },
      {
        label: "Iterating capacity forwards",
        body: "A forward pass lets the same number be reused multiple times. This is 0/1 knapsack, so walk capacity backwards to enforce the use-at-most-once rule.",
      },
      {
        label: "Using max instead of OR",
        body: "Here we only care whether a sum is reachable, not the maximum value. Use boolean OR to combine choices.",
      },
      {
        label: "Wrong target calculation",
        body: "Target is total / 2, not total. Both subsets must sum to the same value, and that value is exactly half of the combined total.",
      },
    ],
    complexityReasoning:
      "We have n items and a target capacity of total / 2. Each item triggers one backward pass over the capacity array, so the time is O(n · target). The boolean dp array of length target + 1 gives O(target) space. Since target is bounded by 5000 in the constraints, this is efficient.",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "Why is the problem equivalent to 0/1 knapsack?",
        answer: "We need to pick a subset of numbers that sums to total/2, where each number can be chosen at most once.",
      },
      {
        prompt: "What does dp[w] represent?",
        answer: "Whether it is possible to form the sum w using some subset of the numbers processed so far.",
      },
    ],
    interviewFraming:
      "Partition Equal Subset Sum is a classic disguise for 0/1 knapsack. Interviewers may ask why the odd-sum check is valid or push you toward related problems like minimum difference partition or counting partitions. Recognizing the knapsack pattern is the key skill being tested.",

    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "nums", value: "[1, 5, 11, 5]" },
      { label: "expected", value: "true" },
    ],
  },
  {
    id: "dp-14",
    topicId: "dp",
    title: "Palindromic Substrings",
    difficulty: "Medium",
    tags: ["dp", "string"],
    problem:
      "Given a string `s`, return the number of palindromic substrings in it. A string is a palindrome when it reads the same backward as forward. A substring is a contiguous sequence of characters within the string.",
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of lowercase English letters.",
    ],
    approach:
      "A single character is a palindrome, and a palindrome grows outward when its inner substring is a palindrome and the outer characters match. We use expand-around-center: for every possible center (including between characters for even-length palindromes), count how many palindromes radiate from it.",
    dryRun: [
      "s = 'abc' → 3 ('a', 'b', 'c')",
      "s = 'aaa' → 6 ('a', 'a', 'a', 'aa', 'aa', 'aaa')",
      "s = 'abba' → 6 ('a', 'b', 'b', 'a', 'bb', 'abba')",
    ],
    solution: `function countSubstrings(s) {
  let count = 0;

  for (let i = 0; i < s.length; i++) {
    count += expandFromCenter(s, i, i);     // odd length
    count += expandFromCenter(s, i, i + 1); // even length
  }
  return count;

  function expandFromCenter(str, left, right) {
    let local = 0;
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      local++;
      left--;
      right++;
    }
    return local;
  }
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A palindrome is symmetric around its center. If you already know that the substring from left+1 to right-1 is a palindrome, and the characters at left and right match, then the bigger substring from left to right is also a palindrome. Instead of building a full table, we can simply try every center and expand outward as long as the two boundary characters stay equal. Each successful expansion is one new palindromic substring.",
    pitfalls: [
      {
        label: "Forgetting even-length centers",
        body: "Palindromes like 'aa' have a center between the two a's. You must call the expand helper with both (i, i) for odd length and (i, i + 1) for even length.",
      },
      {
        label: "Counting duplicates incorrectly",
        body: "Each distinct (left, right) pair is a distinct substring. Every successful expansion adds exactly one to the count, even when the characters repeat.",
      },
      {
        label: "Bounds check order in expansion",
        body: "Check left >= 0 && right < length before comparing characters. Accessing str[-1] or str[length] returns undefined and breaks the comparison.",
      },
      {
        label: "Using O(n³) brute force",
        body: "Generating every substring and checking it separately is too slow. Expanding around a center shares work between overlapping palindromes and stays at O(n²).",
      },
    ],
    complexityReasoning:
      "There are 2n - 1 possible centers: n single-character centers and n - 1 between-character centers. In the worst case, such as a string of all identical characters, each expansion can scan up to n characters. Therefore the total time is O(n²). We only store a few indices and counters, so the extra space is O(1).",
    patternFamily: "Dynamic Programming",
    selfTest: [
      {
        prompt: "How many center positions does a string of length n have?",
        answer: "2n - 1: one at each character for odd-length palindromes, and one between each pair of characters for even-length palindromes.",
      },
      {
        prompt: "When do we stop expanding?",
        answer: "When the left or right index goes out of bounds, or when str[left] no longer equals str[right].",
      },
    ],
    interviewFraming:
      "Palindromic Substrings is the gentle introduction to palindrome DP. Interviewers commonly follow up with Longest Palindromic Substring, which uses the same expansion idea, or Palindrome Partitioning, which asks for the minimum cuts. Be ready to sketch both the O(n²) expand-around-center and the O(n²) DP table approaches.",

    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "s", value: "aaa" },
      { label: "expected", value: "6" },
    ],
  },
];
