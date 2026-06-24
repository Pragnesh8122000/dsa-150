import type { Question, AnimationStep } from "../types";

function placeholderTrace(): AnimationStep[] {
  return [
    {
      description: "Animation coming soon — this question is in the stub list.",
      variables: {},
      codeLine: 1,
    },
  ];
}

const SINGLE_NUMBER: Question = {
  id: "bi-1",
  topicId: "bits",
  title: "Single Number",
  difficulty: "Easy",
  tags: ["bits", "xor"],
  problem:
    "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
  constraints: [
    "1 <= nums.length <= 3 * 10⁴",
    "-3 * 10⁴ <= nums[i] <= 3 * 10⁴",
    "Every element appears twice except one.",
  ],
  approach:
    "XOR every element together. Because `x ^ x == 0` and `x ^ 0 == x`, every duplicate pair cancels out. The remaining value is the unique number. The XOR operation is associative and commutative, so order does not matter.",
  dryRun: [
    "nums = [4, 1, 2, 1, 2]",
    "x = 0",
    "x ^= 4 → 4",
    "x ^= 1 → 5",
    "x ^= 2 → 7",
    "x ^= 1 → 6",
    "x ^= 2 → 4",
    "Return 4",
  ],
  solution: `function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0);
}`,
  timeComplexity: "O(n) — one pass through the array.",
  spaceComplexity: "O(1) — only an accumulator is stored.",

  intuition:
    "The brute-force way is a hash set or nested loop, costing extra memory or O(n²) time. The insight is that XOR is its own inverse: applying it twice with the same value wipes it out. It is like matching socks — every pair disappears, and only the odd sock is left.",
  pitfalls: [
    {
      label: "Forgetting the 0 identity",
      body: "Start the accumulator at 0. XOR with 0 leaves a value unchanged, so the first real number is stored correctly.",
    },
    {
      label: "Trying to sort first",
      body: "Sorting works but costs O(n log n). XOR gives the answer in a single pass with no extra space.",
    },
    {
      label: "Assuming more than one unique number",
      body: "This trick only works when exactly one element appears an odd number of times and everything else appears an even number of times.",
    },
  ],
  complexityReasoning:
    "We visit each element exactly once and perform a single XOR per element. That is O(n) time. The reduce call only holds one running value, so the extra space is O(1), regardless of input size.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "What is `5 ^ 5`?",
      answer: "0 — any number XORed with itself cancels out.",
    },
    {
      prompt: "`nums = [7, 3, 5, 3, 7]`. After XORing the first four elements, what is the accumulator?",
      answer: "5 — the two 7s and the two 3s cancel, leaving 5.",
    },
  ],
  interviewFraming:
    "Single Number is the classic XOR warm-up. Follow-ups include finding the single number when every other element appears three times, finding two single numbers, or solving it with a hash map if the interviewer bans bitwise tricks.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "nums", value: "[4, 1, 2, 1, 2]" },
    { label: "expected", value: "4" },
  ],
};

const NUMBER_OF_1_BITS: Question = {
  id: "bi-2",
  topicId: "bits",
  title: "Number of 1 Bits",
  difficulty: "Easy",
  tags: ["bits"],
  problem:
    "Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).",
  constraints: [
    "0 <= n <= 2³¹ - 1",
    "The input is treated as an unsigned 32-bit integer.",
  ],
  approach:
    "Use Brian Kernighan's trick: `n & (n - 1)` clears the lowest set bit. Repeat until `n` becomes zero, counting how many clears were needed. Each iteration removes exactly one '1' bit.",
  dryRun: [
    "n = 11 → binary 1011",
    "n & (n - 1) = 1011 & 1010 = 1010 → count 1, n = 10",
    "1010 & 1001 = 1000 → count 2, n = 8",
    "1000 & 0111 = 0000 → count 3, n = 0",
    "Return 3",
  ],
  solution: `function hammingWeight(n) {
  let count = 0;
  while (n) {
    n &= n - 1;
    count++;
  }
  return count;
}`,
  timeComplexity: "O(k) where k is the number of set bits.",
  spaceComplexity: "O(1) — only a counter.",

  intuition:
    "Checking every bit from 0 to 31 works but does unnecessary work when `n` is sparse. Brian Kernighan's idea is to leap directly to the next set bit by turning off the lowest '1'. It is like plucking leaves off a plant one at a time instead of inspecting every stem.",
  pitfalls: [
    {
      label: "Looping 32 times unconditionally",
      body: "A naive `while (n)` with `n >>>= 1` is still O(32), but the Brian Kernighan version skips trailing zeros and runs only as many times as there are set bits.",
    },
    {
      label: "Using signed right shift",
      body: "In JavaScript, use unsigned right shift (`>>>=`) if you shift the number. Here we use `n &= n - 1`, which does not depend on the shift direction, so it is safe for the given constraint.",
    },
    {
      label: "Forgetting to count before clearing",
      body: "Increment the counter inside the loop, after the clear operation. The loop stops when `n` is zero, so the count must be recorded while `n` is still non-zero.",
    },
  ],
  complexityReasoning:
    "Each loop iteration removes one set bit, so the number of iterations equals the Hamming weight. For a 32-bit integer that is at most 32, which is O(1) in disguise, but it is often written as O(k). Only the counter and the running `n` are stored.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "`n = 8` (binary 1000). How many loop iterations run?",
      answer: "One — there is only a single set bit, and one clear makes the number zero.",
    },
    {
      prompt: "What does `n & (n - 1)` do to the lowest set bit of `n`?",
      answer: "It flips it to 0, leaving all higher bits unchanged.",
    },
  ],
  interviewFraming:
    "Hamming weight is a common low-level interview topic. Follow-ups include counting set bits for every number from 0 to n, using a lookup table for speed, or explaining hardware popcount instructions.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "n", value: "11" },
    { label: "expected", value: "3" },
  ],
};

const SUBSETS_BITMASK: Question = {
  id: "bi-3",
  topicId: "bits",
  title: "Subsets via Bitmask",
  difficulty: "Medium",
  tags: ["bits", "recursion"],
  problem:
    "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
  constraints: [
    "1 <= nums.length <= 10",
    "-10 <= nums[i] <= 10",
    "All the numbers of `nums` are unique.",
  ],
  approach:
    "Treat each subset as a binary mask of length `nums.length`. A `1` at position `i` means `nums[i]` is included. Enumerate every mask from 0 to `2ⁿ - 1` and build the corresponding subset. This generates the power set iteratively without recursion.",
  dryRun: [
    "nums = [1, 2, 3]",
    "mask 0 (000) → []",
    "mask 1 (001) → [1]",
    "mask 2 (010) → [2]",
    "mask 3 (011) → [1, 2]",
    "mask 4 (100) → [3]",
    "mask 5 (101) → [1, 3]",
    "mask 6 (110) → [2, 3]",
    "mask 7 (111) → [1, 2, 3]",
    "Return all 8 subsets",
  ],
  solution: `function subsets(nums) {
  const n = nums.length;
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        subset.push(nums[i]);
      }
    }
    result.push(subset);
  }
  return result;
}`,
  timeComplexity: "O(n · 2ⁿ) — there are 2ⁿ subsets and each can be up to length n.",
  spaceComplexity: "O(n) auxiliary, excluding the output list.",

  intuition:
    "The brute force way uses backtracking, choosing to include or skip each element. A bitmask encodes that same yes/no choice directly: each bit is a toggle. Instead of recursion, we simply count from 0 to `2ⁿ - 1` and read the binary digits as a membership list.",
  pitfalls: [
    {
      label: "Wrong mask range",
      body: "Use `mask < (1 << n)`, not `<=`. There are exactly `2ⁿ` masks, numbered 0 through `2ⁿ - 1`.",
    },
    {
      label: "Checking the wrong bit position",
      body: "`(mask >> i) & 1` checks bit `i`. Make sure `i` matches the index in `nums`.",
    },
    {
      label: "Forgetting the empty subset",
      body: "Mask 0 produces the empty subset. It is a valid part of the power set and must be included.",
    },
    {
      label: "Using `1 << n` when n is large",
      body: "For this problem `n <= 10`, so `1 << n` fits safely in a 32-bit integer. For larger `n` you would need a different approach.",
    },
  ],
  complexityReasoning:
    "There are `2ⁿ` possible subsets. For each one we scan `n` bits and may append up to `n` elements, giving O(n · 2ⁿ) time. The current subset array holds at most `n` elements, so the auxiliary space is O(n), not counting the output itself.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "`nums = [0]`. How many subsets are produced, and what are they?",
      answer: "Two: `[]` and `[0]`, corresponding to masks 0 and 1.",
    },
    {
      prompt: "What mask selects `nums[2]` for an array of length 4?",
      answer: "`1 << 2`, which is binary `0100` = 4.",
    },
  ],
  interviewFraming:
    "Bitmask subset generation is a tidy alternative to backtracking when `n` is small. Interviewers often follow up with `Subsets II` (duplicates allowed), generating k-sized subsets, or printing subsets in lexicographic order.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "nums", value: "[1, 2, 3]" },
    { label: "expected", value: "[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]" },
  ],
};

const REVERSE_BITS: Question = {
  id: "bi-4",
  topicId: "bits",
  title: "Reverse Bits",
  difficulty: "Easy",
  tags: ["bits"],
  problem:
    "Reverse the bits of a given 32-bit unsigned integer. For example, given input `00000010100101000001111010011100`, the output should be `00110001011100000010100101000000`.",
  constraints: [
    "0 <= n <= 2³² - 1",
    "The input must be treated as an unsigned 32-bit value.",
  ],
  approach:
    "Iterate 32 times. In each step, shift the result one position left and append the least significant bit of `n` using `n & 1`. Then shift `n` one position right with an unsigned shift. After the loop, mask the result back to unsigned 32-bit.",
  dryRun: [
    "n = 43261596 → binary ...00000010100101000001111010011100",
    "result = 0",
    "After 32 iterations, the collected reversed bits form",
    "00110001011100000010100101000000 = 964176192",
    "Return 964176192",
  ],
  solution: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}`,
  timeComplexity: "O(1) — exactly 32 iterations.",
  spaceComplexity: "O(1) — a few scalar variables.",

  intuition:
    "The obvious way is to convert the number to a binary string, reverse it, and convert back. That works but allocates a string. The bitwise method builds the reversed number directly: we grab bits from the right end of `n` and append them to the left end of `result`, like reversing a tape one frame at a time.",
  pitfalls: [
    {
      label: "Using signed right shift",
      body: "Use `n >>>= 1` (unsigned) instead of `n >>= 1` (signed). Otherwise the sign bit can propagate and corrupt the reversal.",
    },
    {
      label: "Forgetting the final unsigned mask",
      body: "Return `result >>> 0` to force the value back into the unsigned 32-bit range, especially when the reversed bit pattern has its top bit set.",
    },
    {
      label: "Wrong number of iterations",
      body: "The problem specifies 32 bits. Loop exactly 32 times, not until `n` reaches zero, or the leading zeros of the original number will be lost.",
    },
  ],
  complexityReasoning:
    "The loop always runs 32 times, which is a constant. Each iteration does O(1) shifts, ANDs, and ORs. Only `result` and the loop counter are stored, so the space is constant.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "In one loop iteration, which bit of `n` is appended to `result`?",
      answer: "The least significant bit, extracted with `n & 1`.",
    },
    {
      prompt: "Why must we use an unsigned right shift on `n`?",
      answer: "A signed shift could keep a 1 in the top bit forever, breaking the reversal of leading zeros.",
    },
  ],
  interviewFraming:
    "Reverse Bits tests careful shift discipline. Follow-ups include reversing bytes, swapping odd and even bits, or doing the reversal without a loop using masks and parallel swaps.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "n", value: "43261596" },
    { label: "expected", value: "964176192" },
  ],
};

const MISSING_NUMBER: Question = {
  id: "bi-5",
  topicId: "bits",
  title: "Missing Number",
  difficulty: "Easy",
  tags: ["bits", "math"],
  problem:
    "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
  constraints: [
    "n == nums.length",
    "1 <= n <= 10⁴",
    "0 <= nums[i] <= n",
    "All the numbers of `nums` are unique.",
  ],
  approach:
    "XOR every index `i` and every value `nums[i]`, plus the number `n` itself. Every value that appears in the array is paired with its matching index and cancels out. The missing index remains in the accumulator.",
  dryRun: [
    "nums = [3, 0, 1], n = 3",
    "x = 3",
    "i = 0: x ^= 0 ^ 3 → x = 0",
    "i = 1: x ^= 1 ^ 0 → x = 1",
    "i = 2: x ^= 2 ^ 1 → x = 3 ^ 1 = 2",
    "Return 2",
  ],
  solution: `function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) {
    x ^= i ^ nums[i];
  }
  return x;
}`,
  timeComplexity: "O(n) — one pass.",
  spaceComplexity: "O(1) — only the running XOR value.",

  intuition:
    "A hash set or the arithmetic sum formula both work, but the sum formula can overflow in languages with fixed-width integers. XOR sidesteps overflow and uses the same cancellation idea as Single Number: each present value is XORed once as a value and once as an index, so they vanish. The missing number has no partner.",
  pitfalls: [
    {
      label: "Initial XOR value wrong",
      body: "Start `x` at `nums.length`, which is the missing candidate `n`. Then every index `i` cancels its matching value `nums[i]`.",
    },
    {
      label: "Assuming the array is sorted",
      body: "The XOR approach works on an unsorted array because XOR is commutative; the order of cancellation does not matter.",
    },
    {
      label: "Using XOR when duplicates exist",
      body: "This trick relies on every present number appearing exactly once. If duplicates exist, use a different approach such as a frequency map.",
    },
  ],
  complexityReasoning:
    "We loop through the array once, doing a constant amount of XOR work per element. The accumulator is a single integer, so the extra space is O(1). The XOR of all indices and values plus `n` always leaves the missing number.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "`nums = [0, 1]`. What is the missing number?",
      answer: "2 — the array has length 2, so the full range is [0, 2].",
    },
    {
      prompt: "Why does `x` start at `nums.length` instead of 0?",
      answer: "Because the range includes the value `n` itself, but there is no index `n` in the loop to XOR it away. Starting at `n` accounts for that extra candidate.",
    },
  ],
  interviewFraming:
    "Missing Number is a warm-up with three classic solutions: sum formula, XOR, and in-place swapping. Be ready to discuss overflow risks of the sum formula and when each method is safest.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "nums", value: "[3, 0, 1]" },
    { label: "expected", value: "2" },
  ],
};

const SUM_OF_TWO_INTEGERS: Question = {
  id: "bi-6",
  topicId: "bits",
  title: "Sum of Two Integers (No + or -)",
  difficulty: "Medium",
  tags: ["bits"],
  problem:
    "Given two integers `a` and `b`, return their sum without using the `+` or `-` operators.",
  constraints: [
    "-1000 <= a, b <= 1000",
    "Do not use `+` or `-` in the solution logic.",
  ],
  approach:
    "Use bitwise operations to mimic full-adder behavior. `a ^ b` gives the sum without carry. `(a & b) << 1` gives the carry. Repeat until there is no carry left. Because JavaScript numbers are 64-bit floats, we mask values to 32 bits so the unsigned two's-complement loop terminates correctly.",
  dryRun: [
    "a = 1, b = 2",
    "sum without carry = 1 ^ 2 = 3",
    "carry = (1 & 2) << 1 = 0",
    "No carry left → return 3",
    "",
    "a = 5, b = 7",
    "sum = 5 ^ 7 = 2, carry = (5 & 7) << 1 = 10",
    "sum = 2 ^ 10 = 8, carry = (2 & 10) << 1 = 4",
    "sum = 8 ^ 4 = 12, carry = (8 & 4) << 1 = 0",
    "Return 12",
  ],
  solution: `function getSum(a, b) {
  const MASK = 0xFFFFFFFF;
  const SIGN = 0x80000000;

  let ua = a < 0 ? a + 0x100000000 : a;
  let ub = b < 0 ? b + 0x100000000 : b;

  while (ub !== 0) {
    const carry = (ua & ub) << 1;
    ua = ua ^ ub;
    ub = carry & MASK;
  }

  return ua >= SIGN ? ua - 0x100000000 : ua;
}`,
  timeComplexity: "O(1) — at most a constant number of 32-bit carry propagations.",
  spaceComplexity: "O(1) — a few scalar variables.",

  intuition:
    "A hardware adder does two things: it adds each bit pair, and it carries the overflow to the next position. XOR gives the bit-wise sum ignoring carries, and `AND << 1` gives the carries. Repeating those two operations until the carry disappears rebuilds ordinary addition using only bitwise operators.",
  pitfalls: [
    {
      label: "Infinite loop with negative numbers",
      body: "In JavaScript, unmasked bitwise operations can produce a carry that never clears because numbers are 64-bit floats. Convert inputs to unsigned 32-bit values, mask the carry, and convert the final result back to signed.",
    },
    {
      label: "Forgetting to mask the carry",
      body: "Always apply `& MASK` to the carry so it stays within 32 bits. Otherwise it can escape the loop condition and loop forever.",
    },
    {
      label: "Returning an unsigned result for negative answers",
      body: "After the loop, convert the unsigned result back to signed using the sign-bit check so negative sums are returned correctly.",
    },
  ],
  complexityReasoning:
    "Each loop iteration propagates the carry one position left, and a 32-bit integer has at most 32 positions. That makes the loop bounded by a constant. All operations inside are O(1), and only a handful of integers are stored.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "What does `a ^ b` compute in this algorithm?",
      answer: "The sum of `a` and `b` ignoring any carry bits.",
    },
    {
      prompt: "What does `(a & b) << 1` compute?",
      answer: "The carry bits that must be added in the next iteration.",
    },
  ],
  interviewFraming:
    "This problem tests whether you understand how addition is built from logic gates. Follow-ups include subtraction without `-`, multiplication without `*`, or handling arbitrary-width integers.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "a", value: "5" },
    { label: "b", value: "7" },
    { label: "expected", value: "12" },
  ],
};

const COUNTING_BITS: Question = {
  id: "bi-7",
  topicId: "bits",
  title: "Counting Bits",
  difficulty: "Easy",
  tags: ["bits", "dp"],
  problem:
    "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` in the range `0 <= i <= n`, `ans[i]` is the number of 1's in the binary representation of `i`.",
  constraints: [
    "0 <= n <= 10⁵",
    "The answer array has length `n + 1`.",
  ],
  approach:
    "Build the answer with dynamic programming. The key recurrence is `popcount(i) = popcount(i & (i - 1)) + 1`, because `i & (i - 1)` clears the lowest set bit of `i`. We already know the popcount for that smaller number, so we add one for the cleared bit.",
  dryRun: [
    "n = 5",
    "ans[0] = 0",
    "i = 1: 1 & 0 = 0 → ans[1] = ans[0] + 1 = 1",
    "i = 2: 2 & 1 = 0 → ans[2] = ans[0] + 1 = 1",
    "i = 3: 3 & 2 = 2 → ans[3] = ans[2] + 1 = 2",
    "i = 4: 4 & 3 = 0 → ans[4] = ans[0] + 1 = 1",
    "i = 5: 5 & 4 = 4 → ans[5] = ans[4] + 1 = 2",
    "Return [0, 1, 1, 2, 1, 2]",
  ],
  solution: `function countBits(n) {
  const ans = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i & (i - 1)] + 1;
  }
  return ans;
}`,
  timeComplexity: "O(n) — one pass from 1 to n.",
  spaceComplexity: "O(n) — the output array of length n + 1.",

  intuition:
    "The naive plan runs Brian Kernighan on every number from 0 to n, which is O(n log n). The smarter plan reuses earlier answers. Every number `i` can be turned into a smaller number by removing its lowest set bit; we have already counted the bits of that smaller number, so we just add the bit we removed.",
  pitfalls: [
    {
      label: "Off-by-one loop bounds",
      body: "The answer covers `0` through `n`, inclusive. Loop `i` from `1` to `n` and make sure the array is sized `n + 1`.",
    },
    {
      label: "Using `ans[i - 1] + 1`",
      body: "Subtracting 1 does not necessarily clear a set bit. Use `i & (i - 1)`, which is guaranteed to remove exactly one set bit.",
    },
    {
      label: "Forgetting `ans[0] = 0`",
      body: "Zero has no set bits. Initialize the array with zeros, or explicitly set `ans[0]` before the loop.",
    },
  ],
  complexityReasoning:
    "We compute each of the `n + 1` entries once, and each computation is a constant-time lookup plus one bitwise operation. That gives O(n) time. The output array itself stores `n + 1` integers, so the space is O(n), which is required for the answer.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "For `i = 8` (binary 1000), what is `i & (i - 1)`?",
      answer: "0 — subtracting 1 from a power of two clears the only set bit.",
    },
    {
      prompt: "`n = 7`. What is `ans[7]`?",
      answer: "3 — 7 is `111`, so it has three set bits.",
    },
  ],
  interviewFraming:
    "Counting Bits is a favorite DP-meets-bitwise problem. Follow-ups include computing the popcount for a specific range, doing it in parallel for all 32-bit integers, or optimizing with a lookup table.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "n", value: "5" },
    { label: "expected", value: "[0, 1, 1, 2, 1, 2]" },
  ],
};

const RANGE_BITWISE_AND: Question = {
  id: "bi-8",
  topicId: "bits",
  title: "Bitwise AND of Numbers Range",
  difficulty: "Medium",
  tags: ["bits"],
  problem:
    "Given two integers `left` and `right` that represent the range `[left, right]`, return the bitwise AND of all numbers in this range (inclusive).",
  constraints: [
    "0 <= left <= right <= 2³¹ - 1",
    "The range is inclusive on both ends.",
  ],
  approach:
    "The AND of a range keeps only the bits that stay the same for every number in the range. Common suffix bits eventually change as the numbers increase, so they become 0. Repeatedly shift both `left` and `right` right until they are equal; count the shifts. The common prefix is then shifted back left to its original position.",
  dryRun: [
    "left = 5 → 101, right = 7 → 111",
    "shift right: left = 2 (10), right = 3 (11), shifts = 1",
    "shift right: left = 1 (1), right = 1 (1), shifts = 2",
    "left == right, shift back: 1 << 2 = 100 = 4",
    "Return 4",
  ],
  solution: `function rangeBitwiseAnd(left, right) {
  let shifts = 0;
  while (left !== right) {
    left >>= 1;
    right >>= 1;
    shifts++;
  }
  return left << shifts;
}`,
  timeComplexity: "O(log right) — at most 31 shifts for 32-bit integers.",
  spaceComplexity: "O(1) — only the shift counter.",

  intuition:
    "Walking through the whole range can be enormous. The insight is that a range AND is asking for the longest binary prefix shared by `left` and `right`. Any bit below that prefix flips from 0 to 1 somewhere inside the range, so that bit must become 0 in the final answer. Strip the differing suffixes by shifting right, then restore the common prefix.",
  pitfalls: [
    {
      label: "Iterating the entire range",
      body: "For large ranges this is far too slow. The prefix-shifting approach finds the answer in logarithmic time without touching every number.",
    },
    {
      label: "Forgetting to count shifts",
      body: "You need to remember how many times you shifted so you can move the common prefix back to the correct position at the end.",
    },
    {
      label: "Using unsigned shift inconsistently",
      body: "Both `left` and `right` are non-negative in the constraints, so signed right shift is safe here. In a language or problem with negative values, be careful about sign extension.",
    },
  ],
  complexityReasoning:
    "Each loop iteration halves both numbers by shifting right, so the number of iterations is bounded by the number of bits, about 31 for the given constraint. That is O(log right). Only the shift counter and the two running values are stored, giving O(1) space.",
  patternFamily: "Bit Manipulation",
  selfTest: [
    {
      prompt: "`left = 5`, `right = 7`. After one right shift, what are the new values and how many shifts have been recorded?",
      answer: "left becomes 2, right becomes 3, and shifts = 1.",
    },
    {
      prompt: "`left = 1`, `right = 2147483647`. What is the result?",
      answer: "0 — the two numbers share no common binary prefix, so every bit is cleared in the range AND.",
    },
  ],
  interviewFraming:
    "This problem tests whether you understand that a range AND depends on the common binary prefix, not on every number in between. Follow-ups include range OR, range XOR, or finding the most significant bit shared by two numbers.",

  buildTrace: placeholderTrace,
  sampleInput: [
    { label: "left", value: "5" },
    { label: "right", value: "7" },
    { label: "expected", value: "4" },
  ],
};

export const QUESTIONS: Question[] = [
  SINGLE_NUMBER,
  NUMBER_OF_1_BITS,
  SUBSETS_BITMASK,
  REVERSE_BITS,
  MISSING_NUMBER,
  SUM_OF_TWO_INTEGERS,
  COUNTING_BITS,
  RANGE_BITWISE_AND,
];
