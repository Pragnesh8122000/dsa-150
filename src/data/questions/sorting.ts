import type { Question } from "../types";
import { stub } from "../question-utils";

const STUB_QUESTIONS: Question[] = [
  stub({
    id: "so-1",
    topicId: "sorting",
    title: "Sort an Array (Merge Sort)",
    difficulty: "Medium",
    tags: ["sorting", "merge-sort"],
    problem:
      "Sort an array of integers in ascending order. Your algorithm should run in O(n log n) time.",
    constraints: ["1 <= nums.length <= 5 * 10⁴"],
    approach:
      "Recursively split the array in half until pieces are size 0 or 1, then merge two sorted halves by repeatedly taking the smaller front element.",
    dryRun: [
      "[5, 2, 3, 1] split into [5, 2] and [3, 1]",
      "[5, 2] splits into [5] and [2], then merges into [2, 5]",
      "[3, 1] splits into [3] and [1], then merges into [1, 3]",
      "merge [2, 5] and [1, 3] → [1, 2, 3, 5]",
    ],
    solution: `function sortArray(nums) {
  if (nums.length < 2) return nums;
  const m = nums.length >> 1;
  const l = sortArray(nums.slice(0, m));
  const r = sortArray(nums.slice(m));
  const out = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length) {
    out.push(l[i] < r[j] ? l[i++] : r[j++]);
  }
  return out.concat(l.slice(i)).concat(r.slice(j));
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    intuition:
      "Brute force compares every pair and repeatedly swaps, giving O(n²). Merge sort notices that merging two already-sorted lists is cheap: you only ever look at the front of each list. By recursively splitting the array in half, sorting each half, and merging, we turn global ordering into a series of cheap local merges, like sorting a deck by splitting it into piles, sorting each pile, and then merging the piles one card at a time.",
    pitfalls: [
      {
        label: "Missing base case",
        body:
          "Forgetting to return when nums.length < 2 causes infinite recursion. The recursion must bottom out on arrays of size 0 or 1.",
      },
      {
        label: "Wrong comparison direction",
        body:
          "Using > instead of < when choosing l[i] vs r[j] drops or duplicates elements. Always pick the smaller front value.",
      },
      {
        label: "Forgetting to concatenate leftovers",
        body:
          "After the main merge loop, one half still has unused elements. Return out.concat(leftovers), not just out.",
      },
      {
        label: "Claiming O(1) space",
        body:
          "Standard merge sort uses O(n) auxiliary space for the temporary halves. In-place merge sort is much harder and not what this basic implementation achieves.",
      },
    ],
    complexityReasoning:
      "Each recursion level touches every element once during a merge, costing O(n). There are O(log n) levels because we halve the array each time. Multiplying gives O(n log n) time. Space is O(n) for the temporary left/right slices created during merges, plus O(log n) recursion stack.",
    patternFamily: "Sorting",
    selfTest: [
      {
        prompt:
          "After splitting [5, 2, 3, 1] into [5, 2] and [3, 1], what is the next recursive step for [5, 2]?",
        answer: "Split it into [5] and [2], then merge them into [2, 5].",
        hint: "Base case is length < 2.",
      },
      {
        prompt:
          "When merging [2, 5] and [1, 3], which element is picked first and why?",
        answer: "1, because 1 < 2 (the front of the right half is smaller).",
        hint: "Compare the first not-yet-used element of each half.",
      },
      {
        prompt: "How many total merge levels does an array of size n have?",
        answer: "O(log n).",
        hint: "Each level halves the subarray size.",
      },
    ],
    interviewFraming:
      "Merge sort is the canonical O(n log n) comparison sort interviewers expect when a built-in sort is not enough. Common follow-ups: implement bottom-up iterative merge sort, sort a linked list in O(1) extra space, or count inversions while merging. Be ready to explain stability and why quicksort's worst case is O(n²) while merge sort stays O(n log n).",
  }),

  stub({
    id: "so-2",
    topicId: "sorting",
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    tags: ["sorting", "two-pointers"],
    problem:
      "Sort an array containing only the values 0, 1, and 2 in-place so that all 0s come first, then 1s, then 2s.",
    constraints: ["0 <= n <= 300", "values are only 0, 1, or 2"],
    approach:
      "Use three pointers — low, mid, and high. Everything before low is 0, everything after high is 2, and mid scans the unknown middle section. Swap 0s to the low region and 2s to the high region, leaving 1s in the middle.",
    dryRun: [
      "[2, 0, 2, 1, 1, 0], low=0, mid=0, high=5",
      "a[mid]=2 → swap with a[high], high=4; array becomes [0, 0, 2, 1, 1, 2]",
      "a[mid]=0 → swap with a[low], low=1, mid=1",
      "continue until mid passes high",
      "final [0, 0, 1, 1, 2, 2]",
    ],
    solution: `function sortColors(a) {
  let l = 0, m = 0, r = a.length - 1;
  while (m <= r) {
    if (a[m] === 0) {
      [a[l], a[m]] = [a[m], a[l]];
      l++;
      m++;
    } else if (a[m] === 1) {
      m++;
    } else {
      [a[m], a[r]] = [a[r], a[m]];
      r--;
    }
  }
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    intuition:
      "A counting approach works but uses extra space. The Dutch national flag insight is that the array only has three classes, so we can partition it into three zones in a single pass by maintaining two boundaries: a 0-zone at the front and a 2-zone at the back. It is like sorting books on a shelf by color when there are only three colors: keep a red section at the left, a blue section at the right, and walk through the middle deciding where each book belongs.",
    pitfalls: [
      {
        label: "Advancing mid after a 2-swap blindly",
        body:
          "When a 2 is swapped to the end, the value that moved into mid is unknown and must be inspected again. Do not increment mid.",
      },
      {
        label: "Not advancing low with mid on a 0-swap",
        body:
          "A 0 swapped from the middle came from ahead of mid and is already processed, so both low and mid should move forward.",
      },
      {
        label: "Off-by-one boundary",
        body:
          "The loop should run while mid <= high. Using < can leave the element at high unclassified.",
      },
      {
        label: "Returning a new array",
        body:
          "The problem asks for an in-place sort. Mutate the input array and do not return a copy unless the prompt explicitly allows it.",
      },
    ],
    complexityReasoning:
      "mid moves from left to right at most n steps, and every swap places at least one element into its final zone. There are no nested loops, so time is O(n). Only three index variables are stored, so extra space is O(1).",
    patternFamily: "Two Pointers",
    selfTest: [
      {
        prompt:
          "mid sees a 2 at the current position. Which pointer moves and in which direction?",
        answer: "Swap a[mid] with a[high] and decrement high.",
        hint: "2 belongs at the right end.",
      },
      {
        prompt:
          "mid sees a 0 that is not at low. After swapping, which pointers advance?",
        answer: "Both low and mid advance.",
        hint: "The value swapped into mid came from an already-scanned area.",
      },
      {
        prompt: "Why do we stop when mid > high?",
        answer:
          "Every element from mid onward has been classified and placed in its correct zone.",
        hint: "The unknown region shrinks from both ends.",
      },
    ],
    interviewFraming:
      "This is a disguised partitioning problem; interviewers use it to test whether you can reason with multiple pointers and invariants. Follow-ups often ask to sort four colors, to implement the same idea as the partition step of quicksort, or to prove the loop invariant rigorously.",
  }),

  stub({
    id: "so-3",
    topicId: "sorting",
    title: "Top K Frequent Words",
    difficulty: "Medium",
    tags: ["sorting", "hashmap", "heap"],
    problem:
      "Given an array of strings words and an integer k, return the k most frequent strings. If frequencies are equal, sort lexicographically.",
    constraints: ["1 <= words.length <= 500", "1 <= k <= number of unique words"],
    approach:
      "Count frequencies with a map, then sort the unique entries by descending frequency and ascending word on ties, and take the first k.",
    dryRun: [
      "words = ['i','love','leetcode','i','love','coding'], k=2",
      "count: i→2, love→2, leetcode→1, coding→1",
      "sort by (-freq, word): i, love, coding, leetcode",
      "slice first k=2 → ['i', 'love']",
    ],
    solution: `function topKFrequent(words, k) {
  const m = new Map();
  for (const w of words) {
    m.set(w, (m.get(w) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, k)
    .map((x) => x[0]);
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    intuition:
      "The naive way is to sort all words alphabetically and then scan for runs, which is O(n log n) and still needs tie-breaking. A cleaner insight: we only care about frequency, so build a frequency table first. Once each word has a score, we can sort the unique words by score, not all n occurrences. This is like tallying votes and then ranking candidates by vote count, with alphabetical order as a tie-breaker.",
    pitfalls: [
      {
        label: "Sorting the raw word array",
        body:
          "Sorting every occurrence is slower and harder to break ties correctly. Count first, then sort unique entries.",
      },
      {
        label: "Wrong tie-breaker order",
        body:
          "Lexicographic order should only break ties, not override higher frequency. The comparator is (-freq, word).",
      },
      {
        label: "Ignoring the heap follow-up",
        body:
          "This sort solution is fine for small n. In an interview, mention that a min-heap of size k reduces time to O(n log k).",
      },
      {
        label: "localeCompare surprises",
        body:
          "The input words are lowercase here, so localeCompare is safe. With mixed case, discuss whether the problem expects case-sensitive ordering.",
      },
    ],
    complexityReasoning:
      "Counting is O(n). Let u be the number of unique words; sorting them is O(u log u), bounded by O(n log n) since u ≤ n. The slice and map operations are O(k) and O(u). Extra space is O(u) for the frequency map and the sorted array of entries.",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt: "Two words have the same frequency. Which one comes first?",
        answer: "The lexicographically smaller word.",
        hint: "The sort comparator uses localeCompare as a tie-breaker.",
      },
      {
        prompt: "What data structure stores the tally of each word?",
        answer: "A Map (hash map) from word to count.",
        hint: "We increment a counter for every occurrence.",
      },
      {
        prompt: "After sorting, what slice operation returns the top k?",
        answer: "slice(0, k).",
        hint: "Take the first k entries from the sorted unique list.",
      },
    ],
    interviewFraming:
      "This is the standard intro to frequency-count plus top-k ordering. Interviewers often follow up with 'what if n is huge?' to push you toward a min-heap of size k, or 'what if the stream is infinite?' for online algorithms. Be ready to discuss O(n log k) heap versus O(n log n) sort trade-offs.",
  }),

  stub({
    id: "so-4",
    topicId: "sorting",
    title: "Merge Intervals",
    difficulty: "Medium",
    tags: ["sorting", "intervals"],
    problem:
      "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of non-overlapping intervals that cover all the input intervals.",
    constraints: ["1 <= intervals.length <= 10⁴", "0 <= start_i <= end_i <= 10⁴"],
    approach:
      "Sort intervals by start time. Walk through them while maintaining a current interval. If the next interval starts after current ends, push current to the result and start a new current; otherwise extend current's end to the maximum of both ends.",
    dryRun: [
      "intervals = [[1,3],[2,6],[8,10],[15,18]]",
      "sort by start: same order",
      "merge [1,3] and [2,6] because 2 <= 3 → current becomes [1,6]",
      "[8,10] starts after 6 → push [1,6] and start current = [8,10]",
      "push remaining [8,10] and [15,18]",
      "result = [[1,6],[8,10],[15,18]]",
    ],
    solution: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  let cur = intervals[0];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] > cur[1]) {
      out.push(cur);
      cur = intervals[i];
    } else {
      cur[1] = Math.max(cur[1], intervals[i][1]);
    }
  }
  if (cur) out.push(cur);
  return out;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    intuition:
      "If intervals are jumbled, checking every pair is O(n²). The fix is to sort by start time. Once sorted, any overlap must involve the interval immediately after the current one, because a later interval cannot start before the current one. It is like aligning train schedules by departure time: after sorting, you only need to check whether the next train leaves before the current trip ends.",
    pitfalls: [
      {
        label: "Skipping the sort",
        body:
          "Without sorting by start time, you must compare every pair. The linear scan only works because the list is ordered.",
      },
      {
        label: "Wrong overlap test",
        body:
          "Use intervals[i][0] > cur[1] to decide non-overlap. Adjacent intervals like [1,2] and [3,4] do not overlap, so do not merge them unless the problem says so.",
      },
      {
        label: "Forgetting max on merge",
        body:
          "When intervals overlap, cur[1] must become the larger of the two ends. Do not blindly assign intervals[i][1].",
      },
      {
        label: "Missing the final interval",
        body:
          "The last current interval is still pending after the loop. Always push it before returning.",
      },
    ],
    complexityReasoning:
      "Sorting dominates: O(n log n) time. The linear scan is O(n). Output space is O(n) in the worst case, and the sort may use O(log n) to O(n) auxiliary space depending on the engine. The algorithm itself only stores a few variables besides the output.",
    patternFamily: "Sorting",
    selfTest: [
      {
        prompt:
          "After sorting [[1,3],[2,6],[8,10],[15,18]], which two intervals overlap first?",
        answer: "[1,3] and [2,6], because 2 <= 3.",
        hint: "Check if next.start <= current.end.",
      },
      {
        prompt: "Current interval is [1,6] and next is [8,10]. What happens?",
        answer: "[1,6] is added to output and current becomes [8,10].",
        hint: "They do not overlap.",
      },
      {
        prompt: "Current is [1,6] and next is [5,10]. What is the merged end?",
        answer: "10, the maximum of 6 and 10.",
        hint: "Expand the current end to cover the overlapping interval.",
      },
    ],
    interviewFraming:
      "Merge intervals appears constantly in scheduling, calendar, and range problems. Follow-ups include interval intersection, insert interval, minimum number of intervals to remove to avoid overlap, and interval scheduling maximization. The key phrase interviewers listen for is 'sort by start time, then scan linearly.'",
  }),

  stub({
    id: "so-5",
    topicId: "sorting",
    title: "Insert Interval",
    difficulty: "Medium",
    tags: ["sorting", "intervals"],
    problem:
      "Given a set of non-overlapping intervals sorted by start time, insert a new interval and merge if necessary.",
    constraints: ["0 <= intervals.length <= 10⁴", "intervals is sorted by start_i"],
    approach:
      "Walk through the sorted list in three phases: add all intervals ending before newInterval starts; merge overlapping intervals by expanding newInterval's start and end; push the merged newInterval; append the rest.",
    dryRun: [
      "intervals = [[1,3],[6,9]], newInterval = [2,5]",
      "first phase: no interval ends before 2",
      "merge [1,3] because 3 >= 2 → newInterval becomes [1,5]",
      "next [6,9] starts at 6 > 5 → push [1,5]",
      "append [6,9]",
      "result = [[1,5],[6,9]]",
    ],
    solution: `function insert(intervals, newInterval) {
  const res = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i]);
    i++;
  }
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  res.push(newInterval);
  while (i < intervals.length) {
    res.push(intervals[i]);
    i++;
  }
  return res;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    intuition:
      "Because the existing intervals are already sorted and disjoint, we do not need to re-sort; we just need to find where the new interval belongs. Think of it as sliding a new meeting into an already tidy calendar: everything before it stays, anything that clashes gets absorbed, and everything after it shifts right unchanged.",
    pitfalls: [
      {
        label: "Strict vs non-strict boundary",
        body:
          "The first phase uses intervals[i][1] < newInterval[0] (strictly before). Using <= would incorrectly merge adjacent intervals.",
      },
      {
        label: "Forgetting to shrink the start",
        body:
          "When merging, newInterval[0] may need to decrease to the earlier overlapping start. Update both ends with min and max.",
      },
      {
        label: "Dropping trailing intervals",
        body:
          "After the merge zone, do not forget the second while loop that appends the remaining intervals unchanged.",
      },
      {
        label: "Mutating the caller's interval",
        body:
          "The solution mutates newInterval in place. In an interview, mention that copying it first avoids surprising side effects.",
      },
    ],
    complexityReasoning:
      "We make one pass over the intervals, so time is O(n). The output may hold up to n + 1 intervals, so space is O(n) besides the input. No sorting is needed because the input is already sorted.",
    patternFamily: "Sorting",
    selfTest: [
      {
        prompt:
          "When does an existing interval get pushed to the result unchanged in the first phase?",
        answer: "When its end is strictly less than newInterval's start.",
        hint: "It lies completely before the new interval.",
      },
      {
        prompt:
          "An existing interval [4,7] overlaps newInterval [2,5]. What does the merged interval become?",
        answer: "[2,7], because start = min(2,4) and end = max(5,7).",
        hint: "Expand both ends to cover both intervals.",
      },
      {
        prompt: "What is the overall time complexity and why?",
        answer: "O(n), because we scan the sorted list once.",
        hint: "No re-sorting step is required.",
      },
    ],
    interviewFraming:
      "Insert interval is the incremental version of merge intervals; it tests whether you can exploit an already-sorted structure instead of re-sorting. Common follow-ups: implement with binary search to locate the merge zone in O(log n) plus O(n) for output shift, or batch-insert multiple intervals efficiently.",
  }),

  stub({
    id: "so-6",
    topicId: "sorting",
    title: "Largest Number",
    difficulty: "Medium",
    tags: ["sorting", "greedy"],
    problem:
      "Given a list of non-negative integers, arrange them such that they form the largest possible number and return it as a string.",
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 10⁹"],
    approach:
      "Convert numbers to strings and sort with a custom comparator: order a before b if a+b is larger than b+a. Join the sorted strings. If the largest piece is '0', the whole answer is '0'.",
    dryRun: [
      "nums = [10, 2]",
      "strings = ['10','2']",
      "compare '102' vs '210'; '210' is bigger so 2 comes before 10",
      "result = '21'",
      "for [3,30,34,5,9] the result is '9534330'",
    ],
    solution: `function largestNumber(nums) {
  const arr = nums.map(String);
  arr.sort((a, b) => {
    const ab = a + b;
    const ba = b + a;
    if (ab > ba) return -1;
    if (ab < ba) return 1;
    return 0;
  });
  if (arr[0] === "0") return "0";
  return arr.join("");
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    intuition:
      "Normal numeric sorting fails because the largest number is not built from the largest individual digits; it depends on how numbers concatenate. The insight is to treat each number as a string and compare the two possible orders a+b and b+a. It is like choosing which of two book titles should come first so that the combined title reads as large as possible.",
    pitfalls: [
      {
        label: "Numeric or length sort",
        body:
          "Sorting by numeric value or string length does not produce the right concatenated order. Always compare a+b against b+a.",
      },
      {
        label: "All-zeros edge case",
        body:
          "If the first string after sorting is '0', return '0'. Otherwise you would produce a string like '00' instead of the integer 0.",
      },
      {
        label: "Returning a number",
        body:
          "The answer can exceed 64-bit limits. Return a string, not a number, to preserve leading zeros and avoid overflow.",
      },
      {
        label: "Invalid comparator",
        body:
          "The comparator must be antisymmetric and transitive. Returning (b+a) - (a+b) as a number can overflow; compare strings instead.",
      },
    ],
    complexityReasoning:
      "Let k be the average number of digits. Converting all numbers is O(n k). The sort compares O(n log n) pairs, and each concatenation comparison is O(k), giving O(n k log n) time. Storing the string array uses O(n k) space. Since k is small for the given constraints, this is effectively O(n log n).",
    patternFamily: "Sorting",
    selfTest: [
      {
        prompt: "Why not simply sort the numbers in descending numeric order for [10,2]?",
        answer: "Because '21' > '102'; numeric sort would give '102'.",
        hint: "Compare concatenated strings.",
      },
      {
        prompt: "nums = [0, 0]. What is the correct output and why?",
        answer: "'0', because the largest number formed by zeros is zero, not '00'.",
        hint: "Check if the first string after sorting is '0'.",
      },
      {
        prompt: "What does the comparator return when a+b equals b+a?",
        answer: "0, meaning a and b are equivalent in order.",
        hint: "The two concatenated results are the same length and characters.",
      },
    ],
    interviewFraming:
      "Largest Number is a favorite for testing custom comparators and edge-case handling. Follow-ups: prove the comparator defines a valid ordering, generalize to forming the smallest number, or handle signed integers or decimal points.",
  }),

  stub({
    id: "so-7",
    topicId: "sorting",
    title: "Relative Sort Array",
    difficulty: "Easy",
    tags: ["sorting", "hashmap", "counting-sort"],
    problem:
      "Given two arrays arr1 and arr2, sort the elements of arr1 such that the relative ordering of items matches arr2. Elements not in arr2 should be placed at the end in ascending order.",
    constraints: [
      "1 <= arr1.length, arr2.length <= 1000",
      "0 <= arr1[i], arr2[i] <= 1000",
    ],
    approach:
      "Count frequencies of values in arr1. Then emit elements in the order they appear in arr2, repeated according to their counts. Finally emit the remaining elements in ascending order.",
    dryRun: [
      "arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6,7,19]",
      "count: 1→1, 2→3, 3→2, 4→1, 6→1, 7→1, 9→1, 19→1",
      "emit in arr2 order: 2,2,2,1,4,3,3,9,6,7,19",
      "no leftovers",
      "result = [2,2,2,1,4,3,3,9,6,7,19]",
    ],
    solution: `function relativeSortArray(arr1, arr2) {
  const count = {};
  for (const x of arr1) {
    count[x] = (count[x] || 0) + 1;
  }
  const res = [];
  for (const x of arr2) {
    while (count[x] > 0) {
      res.push(x);
      count[x]--;
    }
    delete count[x];
  }
  const rest = [];
  for (const x in count) {
    const k = parseInt(x, 10);
    for (let i = 0; i < count[x]; i++) {
      rest.push(k);
    }
  }
  rest.sort((a, b) => a - b);
  return res.concat(rest);
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    intuition:
      "A full sort of arr1 would destroy the special order demanded by arr2. The trick is to use arr2 as a priority list: count how many times each value appears in arr1, then play them back in the order arr2 prescribes. It is like preparing a playlist where some songs must follow a requested order and the rest can play alphabetically at the end.",
    pitfalls: [
      {
        label: "Sorting arr1 directly",
        body:
          "A normal sort orders all values numerically and ignores the relative order required by arr2. Count first, then emit by priority.",
      },
      {
        label: "Leaving spent entries in the count map",
        body:
          "After emitting all copies of an arr2 value, remove it from the map or set its count to zero. Otherwise it may reappear in the leftover section.",
      },
      {
        label: "Sorting leftover keys as strings",
        body:
          "Object keys are strings. Convert them back to numbers with parseInt before sorting, or '10' will sort before '2'.",
      },
      {
        label: "Handling missing arr2 values",
        body:
          "If arr2 contains a value not present in arr1, the while loop simply does nothing because count[x] is undefined/zero.",
      },
    ],
    complexityReasoning:
      "Counting arr1 is O(n). Processing arr2 is O(m + n) because we emit each arr1 element exactly once. Sorting the leftover values is O(r log r) where r is the number of distinct leftover values, bounded by O(n log n). Space is O(n) for the count map and output.",
    patternFamily: "Hash Map / Set",
    selfTest: [
      {
        prompt:
          "arr2 contains 4 before 3. How many times does 4 appear in the output?",
        answer: "As many times as it appears in arr1, determined by the count map.",
        hint: "Use the count map to emit duplicates.",
      },
      {
        prompt: "A value appears in arr1 but not in arr2. Where does it go?",
        answer: "In the leftover section, sorted in ascending order.",
        hint: "Iterate over remaining keys after processing arr2.",
      },
      {
        prompt: "Why is a normal sort insufficient?",
        answer:
          "It would sort all values numerically and ignore the relative order required by arr2.",
        hint: "Think about the priority list given by arr2.",
      },
    ],
    interviewFraming:
      "Relative sort is the textbook example of sorting by a custom priority instead of a natural comparator. Interviewers may follow up with: 'What if arr2 is huge?' (use a Map instead of an array count), or 'What if values are not bounded?' (use a hash map and a comparison sort for leftovers). It also previews counting sort.",
  }),

  stub({
    id: "so-8",
    topicId: "sorting",
    title: "Minimum Absolute Difference",
    difficulty: "Easy",
    tags: ["sorting"],
    problem:
      "Given an array of distinct integers, find all pairs of elements with the minimum absolute difference and return them in ascending order.",
    constraints: ["2 <= arr.length <= 10⁵", "-10⁶ <= arr[i] <= 10⁶"],
    approach:
      "Sort the array. The minimum difference must be between adjacent elements in the sorted order. Scan once, track the smallest difference, and collect every adjacent pair that achieves it.",
    dryRun: [
      "arr = [4,2,1,3]",
      "sort → [1,2,3,4]",
      "adjacent diffs: 1, 1, 1",
      "min = 1",
      "pairs: [1,2], [2,3], [3,4]",
    ],
    solution: `function minimumAbsDifference(arr) {
  arr.sort((a, b) => a - b);
  let min = Infinity;
  const res = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const d = arr[i + 1] - arr[i];
    if (d < min) {
      min = d;
      res.length = 0;
      res.push([arr[i], arr[i + 1]]);
    } else if (d === min) {
      res.push([arr[i], arr[i + 1]]);
    }
  }
  return res;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    intuition:
      "In an unsorted array, the closest pair could be anywhere, so checking every pair is O(n²). The insight is that once the array is sorted, the closest neighbors of any element are right next to it. It is like lining up people by height: the smallest height gap must be between two people standing next to each other.",
    pitfalls: [
      {
        label: "Brute-force pair scan",
        body:
          "Checking all pairs without sorting leads to O(n²). Sort first, then only compare neighbors.",
      },
      {
        label: "Not clearing the result list",
        body:
          "When a new smaller difference is found, reset res.length = 0 before adding the new pair. Old pairs no longer have the minimum.",
      },
      {
        label: "Unsorted output",
        body:
          "Both the pairs and the overall list should be sorted. Since we scan a sorted array and add pairs left-to-right, this happens naturally.",
      },
      {
        label: "Using Math.abs unnecessarily",
        body:
          "After sorting, arr[i+1] - arr[i] is already non-negative, so Math.abs is safe but unnecessary.",
      },
    ],
    complexityReasoning:
      "Sorting takes O(n log n). A single linear scan finds adjacent minimums in O(n). The total time is O(n log n). We store the output list, which is O(n) in the worst case, plus O(1) extra variables.",
    patternFamily: "Sorting",
    selfTest: [
      {
        prompt:
          "After sorting [4,2,1,3], what is the first adjacent pair to check?",
        answer: "[1,2], with difference 1.",
        hint: "Sort first, then scan neighbors.",
      },
      {
        prompt:
          "Why is it enough to check only adjacent elements in the sorted array?",
        answer: "For any non-adjacent pair there is a closer or equal adjacent pair between them.",
        hint: "Sorting brings closest values together.",
      },
      {
        prompt:
          "If a new smaller difference is found, what must happen to the result list?",
        answer:
          "It must be cleared before adding the new pair, because old pairs no longer have the minimum difference.",
        hint: "Only pairs with the current minimum should remain.",
      },
    ],
    interviewFraming:
      "This problem teaches the fundamental sorting trick: 'sort first, then scan neighbors' for closest-pair and gap problems. Follow-ups include finding the k-th smallest difference, minimum difference between any two elements in a BST, and closest pair of points in 2D.",
  }),
];

export const QUESTIONS: Question[] = [
  ...STUB_QUESTIONS,
];
