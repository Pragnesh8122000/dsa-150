import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "h-1",
    topicId: "hashing",
    title: "Group Anagrams",
    difficulty: "Medium",
    tags: ["hashmap", "string", "sorting"],
    problem: `Group a list of strings so that all anagrams appear in the same bucket.
Two strings are anagrams if they contain the same characters with the same frequencies.`,
    constraints: ["1 <= strs.length <= 10⁴", "0 <= strs[i].length <= 100"],
    approach: `Use a normalized key for each word. Sorting the characters works as a canonical signature;
all anagrams collapse to the same key. Insert each word into a map keyed by that signature,
then return the grouped values.`,
    dryRun: [
      `Input: ["eat","tea","tan","ate","nat","bat"]`,
      `"eat", "tea", and "ate" all sort to "aet" and land in one bucket.`,
      `"tan" and "nat" sort to "ant"; "bat" sorts to "abt".`,
      `Result: [["eat","tea","ate"],["tan","nat"],["bat"]] (order of groups may vary).`,
    ],
    solution: "function groupAnagrams(strs) {\n  const m = new Map();\n  for (const s of strs) {\n    const k = s.split('').sort().join('');\n    (m.get(k) ?? m.set(k, []).get(k)).push(s);\n  }\n  return [...m.values()];\n}",
    timeComplexity: "O(n · k log k)",
    spaceComplexity: "O(n · k)",
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `If you sort the letters of every anagram, they all become the same string — like shuffling a deck of cards always gives the same sorted hand. A hash map lets us drop each word into the bucket that shares that sorted key in a single pass, turning a costly pairwise comparison into an O(1) lookup.`,
    pitfalls: [
      {
        label: "Using the raw string as the key",
        body: `Anagrams like "eat" and "tea" would end up in different buckets. Always normalize the key by sorting or counting characters.`,
      },
      {
        label: "Forgetting empty strings",
        body: `An empty string sorts to an empty string and still forms a valid group. Do not skip it.`,
      },
      {
        label: "Using a frequency array object directly as a Map key",
        body: `Arrays are compared by reference, not by value. Convert a character-count array to a canonical string before using it as a key.`,
      },
      {
        label: "Returning the map instead of its values",
        body: `The expected answer is the grouped lists, so return [...m.values()] or equivalent.`,
      },
    ],
    complexityReasoning: `Sorting each word costs O(k log k) where k is the maximum word length, and we do it for n words. Building the map and collecting the groups is linear in the total number of characters. The space is dominated by storing every character of every input string, plus the map keys.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `What key would you use for "listen" and "silent"?`,
        answer: `The sorted string "eilnst" (or an equivalent character-count signature).`,
      },
      {
        prompt: `Why not compare every word with every other word?`,
        answer: `That would be O(n² · k) and wasteful; sorting collapses all anagrams into one signature and gives O(n · k log k).`,
      },
    ],
    interviewFraming: `This is a classic warm-up that tests whether you normalize data before grouping. Interviewers often ask you to avoid sorting and use a fixed-size frequency array, then extend the problem to group by any custom equivalence relation.`,
  },
  {
    id: "h-2",
    topicId: "hashing",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    tags: ["hashset", "array"],
    problem: `Given an unsorted array of integers, return the length of the longest consecutive elements sequence.
Your algorithm must run in O(n) time.`,
    constraints: ["0 <= nums.length <= 10⁵"],
    approach: `Insert every number into a Set so membership tests are O(1). A number n is the start of a sequence only if n-1 is not in the set. From each start, walk upward while consecutive values exist and track the longest run.`,
    dryRun: [
      `Input: [100, 4, 200, 1, 3, 2]`,
      `Set = {100, 4, 200, 1, 3, 2}.`,
      `100, 4, and 200 are starts because 99, 3, and 199 are missing.`,
      `Starting from 1 gives 1 → 2 → 3 → 4, length 4. That is the maximum.`,
      `Output: 4`,
    ],
    solution: "function longestConsecutive(nums) {\n  const s = new Set(nums);\n  let best = 0;\n  for (const n of s) {\n    if (!s.has(n - 1)) {\n      let len = 1, x = n + 1;\n      while (s.has(x)) { x++; len++; }\n      best = Math.max(best, len);\n    }\n  }\n  return best;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `Sorting would give us the sequence order, but costs O(n log n) and ignores that we only care about adjacency. If we store every number in a set, we can check in O(1) whether a number is the start of a sequence (n-1 missing) and then walk forward only from those starts, so each number is visited at most twice.`,
    pitfalls: [
      {
        label: "Walking forward from every number",
        body: `That revisits sequences repeatedly and costs O(n²). Only start when n-1 is absent.`,
      },
      {
        label: "Using an array or list lookup instead of a Set",
        body: `Membership must be O(1) to hit the required time bound.`,
      },
      {
        label: "Updating best inside the inner walk incorrectly",
        body: `Extend the length while s.has(x), then compare the completed length to best.`,
      },
      {
        label: "Forgetting that duplicates do not extend a sequence",
        body: `A Set deduplicates input values automatically, so duplicate numbers do not create longer runs.`,
      },
    ],
    complexityReasoning: `Building the set takes O(n) time and space. The outer loop touches each element once, and the inner while loop only runs for sequence starts. Because a number is part of at most one consecutive run, the total work across all inner loops is O(n). Space is O(n) for the set.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `How do you know a number is the start of a sequence?`,
        answer: `The previous number (n - 1) is not in the set.`,
      },
      {
        prompt: `Why is the total work still O(n) even though there is a nested loop?`,
        answer: `Each number is only visited as part of its sequence start once; no sequence is re-walked.`,
      },
    ],
    interviewFraming: `Interviewers use this to see if you can trade space for O(n) time without sorting. A common follow-up is to return the actual sequence values, not just the length, or to do it in O(1) extra space for a sorted array.`,
  },
  {
    id: "h-3",
    topicId: "hashing",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    tags: ["hashmap", "heap", "bucket-sort"],
    problem: `Given an integer array and an integer k, return the k most frequent elements.
You may return the answer in any order.`,
    constraints: ["1 <= nums.length <= 10⁵"],
    approach: `First count how many times each value appears. Then place each value into a bucket indexed by its frequency. Scanning the highest buckets downward gives the most frequent elements in O(n) total time.`,
    dryRun: [
      `Input: [1,1,1,2,2,3], k = 2`,
      `Counts: 1→3, 2→2, 3→1.`,
      `Buckets[3] = [1], buckets[2] = [2], buckets[1] = [3].`,
      `Collect from the end: [1, 2]. Output: [1, 2].`,
    ],
    solution: "function topKFrequent(nums, k) {\n  const count = new Map();\n  for (const n of nums) count.set(n, (count.get(n)??0)+1);\n  const buckets = Array.from({length: nums.length+1}, () => []);\n  for (const [n,c] of count) buckets[c].push(n);\n  return buckets.flat().slice(-k).reverse();\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `Counting frequencies is the obvious first step, but sorting all unique elements by frequency would cost O(u log u). Bucket sort gives a shortcut: if an element appears f times, it belongs in bucket f, and we can collect the top k by scanning buckets from high frequency down.`,
    pitfalls: [
      {
        label: "Returning every element in a high-frequency bucket",
        body: `Stop after collecting k elements, even if the current bucket contains more.`,
      },
      {
        label: "Defaulting to a heap without considering the input bound",
        body: `A min-heap works, but bucket sort is O(n) here because frequency is bounded by n.`,
      },
      {
        label: "Ignoring bucket index 0",
        body: `No element appears 0 times, so bucket[0] is unused; create buckets of size n+1 to use frequency directly as an index.`,
      },
      {
        label: "Flattening and reversing the wrong slice",
        body: `Use .slice(-k) from the end of the flattened array and reverse so the highest frequencies come first.`,
      },
    ],
    complexityReasoning: `Counting takes one pass, O(n). Bucket sort is bounded by n because no frequency exceeds n. Collecting from the end is at most n elements. Space includes the count map and the buckets, both O(n) in the worst case.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `What goes in bucket[i]?`,
        answer: `All distinct numbers that appear exactly i times in the input.`,
      },
      {
        prompt: `After you flatten the buckets, which end gives the most frequent elements?`,
        answer: `The end of the flattened array, because bucket index equals frequency and higher indices are appended later.`,
      },
    ],
    interviewFraming: `This is the standard "frequency counting plus selection" problem. Follow-ups include solving it with a min-heap of size k, handling a stream of numbers, or returning elements sorted by value when frequencies tie.`,
  },
  {
    id: "h-4",
    topicId: "hashing",
    title: "Two Sum (Hash)",
    difficulty: "Easy",
    tags: ["hashmap", "array"],
    problem: `Given an array of integers and a target, return the indices of the two numbers that add up to target.
You may assume each input has exactly one solution, and you may not use the same element twice.`,
    constraints: ["Exactly one solution"],
    approach: `Walk through the array once. For each value, look for its complement (target - value) in a map of previously seen values. If the complement exists, return its index and the current index; otherwise store the current value and index.`,
    dryRun: [
      `Input: [2, 7, 11, 15], target = 9`,
      `i = 0: complement 7 is not in the map, so store 2 → 0.`,
      `i = 1: complement 2 is in the map at index 0. Return [0, 1].`,
    ],
    solution: "function twoSum(nums,t){const m=new Map();for(let i=0;i<nums.length;i++){const c=t-nums[i];if(m.has(c))return[m.get(c),i];m.set(nums[i],i);}}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `The brute force checks every pair, doing the same work over and over. If we remember each value we have seen and its index, then for the current number we can ask "have I already seen the complement?" instead of looking ahead.`,
    pitfalls: [
      {
        label: "Returning values instead of indices",
        body: `The problem asks for positions, so return [map.get(complement), currentIndex].`,
      },
      {
        label: "Checking for the complement after inserting the current number",
        body: `You might match the same element against itself. Always check first, then insert.`,
      },
      {
        label: "Using an object literal instead of a Map",
        body: `Object keys are strings and can mishandle values like -0. Map is safer for arbitrary numbers.`,
      },
      {
        label: "Assuming the array is sorted",
        body: `The hashmap solution works on unsorted input; do not pre-sort unless the follow-up asks for it.`,
      },
    ],
    complexityReasoning: `One pass through the array gives O(n) time. The map stores at most n entries, so space is O(n). There is no hidden cost; every lookup and insertion is O(1) on average.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `When you process nums[i], what value are you looking up in the map?`,
        answer: `target - nums[i], the complement needed to reach the target.`,
      },
      {
        prompt: `Why insert the current number only after checking for the complement?`,
        answer: `To avoid using the same index twice; the complement must come from earlier positions.`,
      },
    ],
    interviewFraming: `This is one of the most common opening questions. Expect follow-ups like returning all pairs, handling duplicates, or solving it with two pointers after sorting (which changes index semantics).`,
  },
  {
    id: "h-5",
    topicId: "hashing",
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    tags: ["hashmap", "prefix-sum"],
    problem: `Given an integer array and an integer k, return the total number of contiguous subarrays whose sum equals k.`,
    constraints: ["1 <= n <= 2·10⁴"],
    approach: `Instead of enumerating every subarray, use a running prefix sum. The number of earlier prefixes equal to (current prefix - k) tells you how many subarrays ending at the current index have sum k. Track prefix frequencies in a map.`,
    dryRun: [
      `Input: [1, 1, 1], k = 2`,
      `Map starts as {0: 1}. prefix = 0, count = 0.`,
      `i = 0: prefix = 1. map.get(1 - 2) = map.get(-1) = 0. Update map {0:1, 1:1}.`,
      `i = 1: prefix = 2. map.get(2 - 2) = map.get(0) = 1. count = 1. Update map {0:1, 1:1, 2:1}.`,
      `i = 2: prefix = 3. map.get(3 - 2) = map.get(1) = 1. count = 2. Update map {0:1, 1:1, 2:1, 3:1}.`,
      `Output: 2`,
    ],
    solution: "function subarraySum(nums,k){const m=new Map([[0,1]]);let p=0,c=0;for(const n of nums){p+=n;c+=m.get(p-k)??0;m.set(p,(m.get(p)??0)+1);}return c;}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `Instead of enumerating every subarray, notice that the sum from index 0 to r minus the sum from 0 to l-1 equals the sum of the subarray (l..r). If we track how many times each prefix sum has appeared, a new prefix instantly tells us how many earlier prefixes make a valid subarray.`,
    pitfalls: [
      {
        label: "Forgetting the initial prefix sum {0: 1}",
        body: `A subarray starting at index 0 has prefix k, and we need a previous 0 to match it.`,
      },
      {
        label: "Adding to the map before checking (prefix - k)",
        body: `We want to match earlier prefixes, not the current one. Check first, then update the map.`,
      },
      {
        label: "Using a plain object for large integer keys",
        body: `Map handles arbitrary integer keys better than an object literal.`,
      },
      {
        label: "Returning the count found but not updating the map",
        body: `Every prefix sum must be recorded so future indices can match it.`,
      },
    ],
    complexityReasoning: `We compute a running prefix sum in one pass, O(n). Each hashmap operation is average O(1). The map holds at most n+1 distinct prefix sums, so space is O(n). The algorithm never stores subarrays themselves.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `Why is the initial map entry {0: 1}?`,
        answer: `It represents a prefix sum of zero before the array starts, allowing subarrays that begin at index 0 to be counted.`,
      },
      {
        prompt: `At each element, what two things do you do with the current prefix sum?`,
        answer: `Add the count of (prefix - k) to the answer, then increment the count of the current prefix.`,
      },
    ],
    interviewFraming: `This tests understanding of prefix sums and hashmap frequency counts. Interviewers often follow up with counting subarrays divisible by k, or finding the longest subarray with sum k.`,
  },
  {
    id: "h-6",
    topicId: "hashing",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    tags: ["sliding-window", "hashmap"],
    problem: `You are given a string s and an integer k. You can replace at most k characters with any uppercase letter.
Return the length of the longest substring containing the same letter after at most k replacements.`,
    constraints: ["0 <= k <= s.length"],
    approach: `Maintain a sliding window and a frequency array for the 26 uppercase letters. The window is valid when (window length - max frequency in window) <= k, because that is the number of replacements needed. Expand the right edge; shrink the left only when the window becomes invalid.`,
    dryRun: [
      `Input: "ABAB", k = 2`,
      `Window grows to "ABAB". Max count is 2 (either A or B).`,
      `Length 4 - max 2 = 2 replacements, which equals k.`,
      `Output: 4`,
    ],
    solution: "function characterReplacement(s,k){\n  const c=new Array(26).fill(0);\n  let l=0,max=0;\n  for(let r=0;r<s.length;r++){\n    max=Math.max(max,++c[s.charCodeAt(r)-65]);\n    if(r-l+1-max>k){\n      c[s.charCodeAt(l)-65]--;\n      l++;\n    }\n  }\n  return s.length-l;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `The brute force would try every substring and count characters. A sliding window lets us grow the right edge while a frequency array tells us the most common character in the current window; if the rest can be flipped within k replacements, the window stays valid.`,
    pitfalls: [
      {
        label: "Shrinking the left edge too aggressively",
        body: `Only shrink when the number of replacements needed (length - max) exceeds k.`,
      },
      {
        label: "Recalculating the max frequency from scratch each step",
        body: `Keep max as a running value; even if it becomes slightly stale, the final answer is still correct.`,
      },
      {
        label: "Returning the current window size after shrinking",
        body: `The answer is s.length - l because l is the smallest valid left bound after the loop ends.`,
      },
      {
        label: "Forgetting uppercase-only input",
        body: `The solution uses 26 buckets indexed by charCodeAt - 65; it assumes uppercase English letters.`,
      },
    ],
    complexityReasoning: `The right pointer moves n times and the left pointer moves at most n times, so the window scan is O(n). The frequency array has constant size 26, so space is O(1) for the counters plus the input itself.`,
    patternFamily: "Sliding Window",
    selfTest: [
      {
        prompt: `How do you decide if the current window is valid?`,
        answer: `window length minus the count of the most frequent character in the window must be <= k.`,
      },
      {
        prompt: `Why can the stored max frequency be slightly stale without breaking the answer?`,
        answer: `A stale max only makes the window look harder to validate; the largest valid window was already recorded earlier.`,
      },
    ],
    interviewFraming: `Interviewers ask this to check sliding-window discipline with a constraint budget. Follow-ups include finding the longest substring where you can replace at most k of any character, or doing the same with lowercase letters and a general alphabet.`,
  },
  {
    id: "h-7",
    topicId: "hashing",
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    tags: ["array", "hashset", "two-pointers"],
    problem: `Given an array of n + 1 integers where each integer is in the range [1, n], there is exactly one duplicated number.
Return that duplicate.`,
    constraints: [
      "1 <= n <= 10⁵",
      "nums.length == n + 1",
      "1 <= nums[i] <= n",
    ],
    approach: `Use a Set to remember values we have already encountered. As soon as we encounter a value that is already in the set, we have found the duplicate. This is the most direct hashing solution; the follow-up asks for O(1) extra space using cycle detection.`,
    dryRun: [
      `Input: [1, 3, 4, 2, 2]`,
      `Seen: {} → add 1.`,
      `Seen: {1} → add 3.`,
      `Seen: {1, 3} → add 4.`,
      `Seen: {1, 3, 4} → add 2.`,
      `Next value is 2, already in the set. Return 2.`,
    ],
    solution: "function findDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return n;\n    seen.add(n);\n  }\n  return -1;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "input", value: "[1, 3, 4, 2, 2]" },
      { label: "expected", value: "2" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `The brute force uses nested loops or sorting, but the duplicate is the only value seen twice. A hashset records what we have already encountered; the moment we see a value for the second time, we have found our duplicate.`,
    pitfalls: [
      {
        label: "Modifying the input array as a marker trick",
        body: `Flipping signs at indices works only if mutation is allowed and the problem does not forbid it.`,
      },
      {
        label: "Ignoring the O(1)-space follow-up",
        body: `Interviewers often ask for no extra space. Know Floyd's cycle detection as an alternative.`,
      },
      {
        label: "Returning on first match without confirming it is a repeat",
        body: `Always check set membership before adding; the first time a value appears it is not the duplicate.`,
      },
      {
        label: "Misreading the constraint range",
        body: `Values are in [1, n], so they are valid array indices for the follow-up but not required for the hashset version.`,
      },
    ],
    complexityReasoning: `We scan the array once. Each set lookup and insertion is average O(1), so time is O(n). The set stores at most n distinct values, giving O(n) extra space. If the problem requires O(1) space, the two-pointer cycle-detection solution replaces the set.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `What do you do when the current number is already in the set?`,
        answer: `Return it immediately; it is the duplicate.`,
      },
      {
        prompt: `What is the space-conscious follow-up solution?`,
        answer: `Floyd's cycle detection (tortoise and hare), treating values as next pointers.`,
      },
    ],
    interviewFraming: `This often appears as a follow-up to "find the missing number." Interviewers will usually push for the O(1) extra-space solution using cycle detection, so be ready to explain both the hashset version and Floyd's algorithm.`,
  },
  {
    id: "h-8",
    topicId: "hashing",
    title: "Bulls and Cows",
    difficulty: "Medium",
    tags: ["hashmap", "string"],
    problem: `You are playing a guessing game. You are given the secret number and the friend's guess.
Write a function that returns a hint using the format "xAyB", where x is the number of bulls
(digits in the correct place) and y is the number of cows (digits in the wrong place but present in the secret).`,
    constraints: [
      "1 <= secret.length, guess.length <= 1000",
      "secret.length == guess.length",
      "secret and guess consist of digits only",
    ],
    approach: `First count bulls by comparing digits at the same index. For the remaining positions,
build a frequency map of secret digits that are not bulls. Then scan the unmatched guess digits
and consume a matching secret digit from the map to count cows.`,
    dryRun: [
      `Secret: "1807", Guess: "7810"`,
      `Bulls: index 1 has '8' in both strings, so bulls = 1.`,
      `Non-bull secret digits: [1, 0, 7]. Non-bull guess digits: [7, 1, 0].`,
      `Map counts: 1→1, 0→1, 7→1.`,
      `Match 7, 1, and 0 one by one; cows = 3.`,
      `Output: "1A3B"`,
    ],
    solution: "function getHint(secret, guess) {\n  let bulls = 0, cows = 0;\n  const count = new Map();\n  for (let i = 0; i < secret.length; i++) {\n    if (secret[i] === guess[i]) bulls++;\n    else count.set(secret[i], (count.get(secret[i]) ?? 0) + 1);\n  }\n  for (let i = 0; i < secret.length; i++) {\n    if (secret[i] !== guess[i]) {\n      const c = count.get(guess[i]);\n      if (c > 0) {\n        cows++;\n        count.set(guess[i], c - 1);\n      }\n    }\n  }\n  return bulls + 'A' + cows + 'B';\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    sampleInput: [
      { label: "input", value: `["1807", "7810"]` },
      { label: "expected", value: `"1A3B"` },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `A bull is easy: same digit in the same place. Cows are harder because we must match digits that appear in both strings but in different positions without reusing a secret digit twice. A frequency map of the secret's non-bull digits lets us know whether an unmatched guess digit still has a partner available.`,
    pitfalls: [
      {
        label: "Counting cows without excluding bulls first",
        body: `A bull should not also be available as a cow. Remove bulls before building the frequency map.`,
      },
      {
        label: "Decrementing the map while iterating the secret only",
        body: `First count unmatched secret digits, then match them against the unmatched guess digits in a second pass.`,
      },
      {
        label: "Treating cows as total matching digits minus bulls",
        body: `Multiplicity matters: "1122" vs "2211" needs careful per-digit counts, not a simple total.`,
      },
      {
        label: "Returning numbers in the wrong format",
        body: `The required output is "xAyB", where x is bulls and y is cows.`,
      },
    ],
    complexityReasoning: `We make two linear passes over the strings, each O(n). The map holds at most ten digit keys, so its size is constant. Thus time is O(n) and extra space is O(1) because the alphabet is fixed.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `Which digits do you put in the frequency map?`,
        answer: `Only secret digits that are not in the same position as the guess; bulls are excluded.`,
      },
      {
        prompt: `How do you avoid over-counting cows?`,
        answer: `Decrement the frequency map each time a guess digit consumes a matching secret digit.`,
      },
    ],
    interviewFraming: `This is a small but precise implementation problem common in phone screens. Follow-ups include handling larger alphabets, returning the actual matched positions, or generalizing to two arbitrary lists.`,
  },
  {
    id: "h-9",
    topicId: "hashing",
    title: "Isomorphic Strings",
    difficulty: "Easy",
    tags: ["hashmap", "string"],
    problem: `Given two strings s and t, determine if they are isomorphic.
Two strings are isomorphic if the characters in s can be replaced to get t, with each character mapping to exactly one character and no two characters mapping to the same character.`,
    constraints: [
      "1 <= s.length <= 5·10⁴",
      "s.length == t.length",
    ],
    approach: `Use two maps: one from s → t and one from t → s. Walk both strings together.
If an existing mapping conflicts with the current pair, the strings are not isomorphic.
Otherwise record the pair and continue.`,
    dryRun: [
      `s = "egg", t = "add"`,
      `e → a, g → d. Both consistent. Return true.`,
      `s = "foo", t = "bar"`,
      `f → b, o → a, then the second o should map to a (already does), but t[2] is r. Conflict. Return false.`,
    ],
    solution: "function isIsomorphic(s, t) {\n  if (s.length !== t.length) return false;\n  const s2t = new Map(), t2s = new Map();\n  for (let i = 0; i < s.length; i++) {\n    const a = s[i], b = t[i];\n    if (s2t.has(a) && s2t.get(a) !== b) return false;\n    if (t2s.has(b) && t2s.get(b) !== a) return false;\n    s2t.set(a, b);\n    t2s.set(b, a);\n  }\n  return true;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    sampleInput: [
      { label: "input", value: `["egg", "add"]` },
      { label: "expected", value: "true" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `Two strings are isomorphic if every character maps to exactly one partner, like translating an alphabet. A single map is not enough because two different source characters might both map to the same target character; you need a second map to enforce the reverse constraint.`,
    pitfalls: [
      {
        label: "Using only one direction of mapping",
        body: `"ab" and "aa" would incorrectly pass with a single map. Always check both directions.`,
      },
      {
        label: "Comparing lengths after starting the loop",
        body: `Check lengths first to avoid out-of-bounds issues and to fail fast.`,
      },
      {
        label: "Updating the maps before verifying consistency",
        body: `Verify that the current pair matches any existing mapping before writing the new pair.`,
      },
      {
        label: "Assuming only lowercase letters",
        body: `The map-based version works for any character; a fixed-size array would not.`,
      },
    ],
    complexityReasoning: `We make one simultaneous pass over both strings, doing two constant-time Map lookups per character. Time is O(n). The maps store at most one entry per distinct character in each string, so space is O(σ) where σ is the alphabet size (O(1) for ASCII).`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `Why do you need two maps instead of one?`,
        answer: `To prevent two different characters in s from mapping to the same character in t, which would break the one-to-one requirement.`,
      },
      {
        prompt: `What should happen when s[i] and t[i] disagree with an existing mapping?`,
        answer: `Return false immediately; the mapping is not consistent.`,
      },
    ],
    interviewFraming: `This tests bijective mapping, a concept reused in word patterns and encodings. Follow-ups include handling Unicode, allowing a many-to-one mapping, or extending the idea to group strings by the same "shape."`,
  },
  {
    id: "h-10",
    topicId: "hashing",
    title: "Word Pattern",
    difficulty: "Easy",
    tags: ["hashmap", "string"],
    problem: `Given a pattern and a string s, return true if s follows the same pattern.
A full match means there is a bijection between a letter in pattern and a non-empty word in s.`,
    constraints: [
      "1 <= pattern.length <= 300",
      "1 <= s.length <= 3000",
      "s contains lowercase English letters and spaces ' '",
      "s has no leading or trailing spaces and words are separated by a single space",
    ],
    approach: `Split s into words and first check that the counts match. Then use two maps to enforce a one-to-one mapping between pattern letters and words, just like isomorphic strings.`,
    dryRun: [
      `pattern = "abba", s = "dog cat cat dog"`,
      `a → dog, b → cat. Second a maps to dog, second b maps to cat. Return true.`,
      `pattern = "abba", s = "dog cat cat fish"`,
      `a → dog, b → cat, second a expects dog (ok), second b expects fish but b maps to cat. Return false.`,
    ],
    solution: "function wordPattern(pattern, s) {\n  const words = s.split(' ');\n  if (pattern.length !== words.length) return false;\n  const p2w = new Map(), w2p = new Map();\n  for (let i = 0; i < pattern.length; i++) {\n    const p = pattern[i], w = words[i];\n    if (p2w.has(p) && p2w.get(p) !== w) return false;\n    if (w2p.has(w) && w2p.get(w) !== p) return false;\n    p2w.set(p, w);\n    w2p.set(w, p);\n  }\n  return true;\n}",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "input", value: `["abba", "dog cat cat dog"]` },
      { label: "expected", value: "true" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    intuition: `This is the same idea as isomorphic strings, but one side is single letters and the other is whole words. Each letter in the pattern must map to exactly one word, and each word must map back to exactly one letter. Two hashmaps make the two-way check natural.`,
    pitfalls: [
      {
        label: "Forgetting to split the string on spaces",
        body: `Compare pattern letters to words, not to the whole string.`,
      },
      {
        label: "Using a single map",
        body: `A single map misses a word that maps to two different letters. Maintain maps in both directions.`,
      },
      {
        label: "Splitting with a regex that leaves empty strings",
        body: `Use s.split(' ') on the guaranteed single-space input; fancy regexes can create empty entries and length mismatches.`,
      },
      {
        label: "Updating the maps before checking consistency",
        body: `Verify existing mappings first; otherwise you may silently overwrite an earlier mapping.`,
      },
    ],
    complexityReasoning: `Splitting the string and walking the pattern are both linear in the number of characters. Each map operation is O(1) on average, and there are at most as many entries as distinct letters or words. The time is O(n) and space is O(n) for the split words and the maps.`,
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: `What is the first validation you should perform?`,
        answer: `Check that pattern.length equals words.length after splitting s by spaces.`,
      },
      {
        prompt: `If "dog" already maps to "a", what happens when pattern letter "b" also maps to "dog"?`,
        answer: `Return false; the mapping must be one-to-one in both directions.`,
      },
    ],
    interviewFraming: `Interviewers pose this right after isomorphic strings to see if you recognize the same two-map trick across different data types. A common follow-up is matching a pattern to a nested structure or allowing multi-word tokens.`,
  },
];
