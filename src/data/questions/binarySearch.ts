import type { Question } from "../types";

export const QUESTIONS: Question[] = [
  {
    id: "bs-1",
    topicId: "binary-search",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["binary-search", "array"],
    problem:
      "Given a sorted integer array `nums` that has been rotated at some unknown pivot point, and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not. The array contains no duplicates.",
    constraints: ["1 <= nums.length <= 5000"],
    approach:
      "Use binary search, but the rotation means one half is always sorted. Compare `nums[lo]` to `nums[mid]`. If the left half is sorted and `target` lies inside it, move `hi` left; otherwise move `lo` right. If the right half is sorted, apply the symmetric rule.",
    dryRun: [
      "nums = [4,5,6,7,0,1,2], target = 0",
      "lo=0, hi=6, mid=3 (7). Left half [4..7] is sorted; target is not in it → lo=4.",
      "lo=4, hi=6, mid=5 (1). nums[4]=0 <= nums[5]=1, left half sorted; target=0 is in it → hi=5.",
      "lo=4, hi=5, mid=4 (0). Match → return 4.",
    ],
    solution: `function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {
      // left half is sorted
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half is sorted
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Brute force would scan the whole array in O(n), ignoring the fact that one half is always sorted. The insight is to look at the middle and ask which side is in order — then check whether the target can live there. It is like flipping through a rotated phone book: once you know which side is in order, you can discard the other half just like normal binary search.",
    pitfalls: [
      {
        label: "Comparing the target against the unsorted half",
        body: "Only compare target against the half that is guaranteed sorted. A value on the unsorted side tells you nothing useful about where target lies.",
      },
      {
        label: "Confusing `lo <= mid` with `lo < mid`",
        body: "Use `nums[lo] <= nums[mid]` to decide which half is sorted. Equal values happen when the window has shrunk to a single element and that element is the mid.",
      },
      {
        label: "Forgetting to include `nums[mid]` in the sorted-half range",
        body: "When the right half is sorted, the range `(nums[mid], nums[hi]]` is valid, so `target > nums[mid]` not `target >= nums[mid]`. The symmetric left-half range is `[nums[lo], nums[mid])`.",
      },
      {
        label: "Assuming the array is fully sorted",
        body: "A normal binary search would compare target directly to mid and move one direction. In a rotated array you must first identify the sorted half.",
      },
    ],
    complexityReasoning:
      "Every iteration computes one mid index and discards exactly half of the remaining range, so the number of iterations is bounded by log2 of the array length. All work inside the loop is a constant number of comparisons and assignments. Only a few scalar variables are stored, so the extra space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "nums = [4,5,6,7,0,1,2], target = 0. lo=0, hi=6, mid=3 (7). Which half is sorted and what do you do?",
        answer:
          "The left half [4..7] is sorted. Target 0 is not in [4,7], so move lo to mid+1 (4).",
        hint: "Compare nums[lo] to nums[mid].",
      },
      {
        prompt:
          "nums = [6,7,0,1,2,4,5], target = 6. lo=0, hi=6, mid=3 (1). Which half is sorted?",
        answer:
          "The right half [1..5] is sorted because nums[lo]=6 > nums[mid]=1. Target 6 is not in [1,5], so move lo to mid+1.",
        hint: "When nums[lo] > nums[mid], the rotation is in the left half.",
      },
    ],
    interviewFraming:
      "This is the classic 'binary search on a broken sorted array' problem. Interviewers often follow up with duplicates (Search in Rotated Sorted Array II), which breaks the clean half-is-sorted test and requires an extra equality check. Another twist is finding the pivot index first, then binary searching in the appropriate half.",
  },

  {
    id: "bs-2",
    topicId: "binary-search",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    tags: ["binary-search", "search-on-answer"],
    problem:
      "Koko wants to finish all banana piles before the guards come back in `h` hours. Given an array `piles` where `piles[i]` is the number of bananas in the i-th pile, return the minimum integer eating speed `k` (bananas per hour) such that Koko finishes within `h` hours. Each hour she picks one pile and eats `k` bananas from it; if the pile has fewer than `k` bananas, she eats the whole pile and waits the rest of the hour.",
    constraints: ["1 <= piles.length <= 10⁴"],
    approach:
      "The answer lies between 1 banana per hour and the largest pile (which can be finished in one hour). For a candidate speed `k`, compute the total hours needed with `ceil(pile / k)` and check if it is at most `h`. Binary search on `k`: if `k` works, try a smaller speed; otherwise try a larger one.",
    dryRun: [
      "piles = [3,6,7,11], h = 8",
      "lo=1, hi=11. mid=6 → hours = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2 = 6 ≤ 8. Feasible → hi=6, ans=6.",
      "lo=1, hi=6. mid=3 → hours = 1+2+3+4 = 10 > 8. Infeasible → lo=4.",
      "lo=4, hi=6. mid=5 → hours = 1+2+2+3 = 8 ≤ 8. Feasible → hi=5, ans=5.",
      "lo=4, hi=5. mid=4 → hours = 1+2+2+3 = 8 ≤ 8. Feasible → hi=4, ans=4.",
      "lo=4, hi=4 → answer = 4.",
    ],
    solution: `function minEatingSpeed(piles, h) {
  let lo = 1;
  let hi = Math.max(...piles);
  let ans = hi;

  const canFinish = (k) => {
    const hours = piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);
    return hours <= h;
  };

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canFinish(mid)) {
      ans = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return ans;
}`,
    timeComplexity: "O(n log M)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Brute force would try every possible speed from 1 upward, which is slow. The trick is to notice that the predicate 'can Koko finish in h hours at speed k?' is monotonic: if speed `k` works, every faster speed also works. That monotonicity turns the problem into a binary-search-on-the-answer problem. Instead of searching the input array, we search the space of possible speeds.",
    pitfalls: [
      {
        label: "Starting lo at 0",
        body: "A speed of 0 would cause division by zero. The smallest meaningful speed is 1 banana per hour.",
      },
      {
        label: "Forgetting to round up",
        body: "Each pile takes `ceil(pile / k)` hours, not `floor`. A pile of 7 bananas at speed 3 still needs 3 hours, not 2.",
      },
      {
        label: "Not recording the best feasible answer",
        body: "Whenever `canFinish(mid)` is true, `mid` is a candidate answer. Store it before shrinking the search space to the left.",
      },
      {
        label: "Using a nested loop for the feasibility check",
        body: "The feasibility check should be a single linear scan of `piles`. A nested loop would turn the binary search into O(n² log M).",
      },
    ],
    complexityReasoning:
      "Each feasibility check scans every pile once, doing O(1) arithmetic per pile, so it costs O(n). The binary search runs on the range of speeds from 1 to `M = max(piles)`, which needs O(log M) iterations. Multiplying gives O(n log M) time. Only a few scalar variables and the accumulator are stored, so the extra space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "piles = [3,6,7,11], h = 8. Candidate speed k = 3 gives 10 hours. Is it feasible?",
        answer: "No. 10 hours is greater than h=8, so we must increase the speed.",
        hint: "The total hours must be ≤ h.",
      },
      {
        prompt:
          "After discovering k=6 is feasible, which half of the search space do you keep?",
        answer:
          "The left half (smaller speeds), because we want the minimum feasible speed.",
        hint: "Feasible means 'try to do better', so shrink hi.",
      },
    ],
    interviewFraming:
      "This is the textbook example of 'binary search on the answer.' The follow-up usually asks you to generalize: given a monotonic predicate, how do you frame a minimization or maximization problem as a binary search? Be ready to name the predicate and prove it is monotonic. A harder variant asks for the minimum speed under a stricter time constraint or with multiple eaters.",
  },

  {
    id: "bs-3",
    topicId: "binary-search",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    tags: ["binary-search"],
    problem:
      "Given a sorted array that has been rotated between 1 and n times, find the minimum element. The array contains no duplicates.",
    constraints: ["1 <= n <= 5000"],
    approach:
      "Binary search by comparing `nums[mid]` to `nums[hi]`. If `nums[mid] > nums[hi]`, the pivot (and minimum) is in the right half, so move `lo = mid + 1`. Otherwise `mid` is already in the sorted right half or is the minimum itself, so move `hi = mid`. Stop when `lo == hi` and return that element.",
    dryRun: [
      "nums = [3,4,5,1,2]",
      "lo=0, hi=4, mid=2 (5). nums[2]=5 > nums[4]=2 → minimum is in right half → lo=3.",
      "lo=3, hi=4, mid=3 (1). nums[3]=1 <= nums[4]=2 → hi=3.",
      "lo=3, hi=3 → return nums[3] = 1.",
    ],
    solution: `function findMin(nums) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return nums[lo];
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A linear scan finds the minimum in O(n), but it ignores the sorted structure that is still hiding in the array. Even after rotation, one half is always sorted. The minimum is the only element that is smaller than its left neighbor, so comparing the middle to the right boundary tells you whether the minimum is to the right or is already at or left of mid.",
    pitfalls: [
      {
        label: "Comparing mid to lo instead of hi",
        body: "Compare `nums[mid]` to `nums[hi]`. Comparing to `nums[lo]` does not reliably reveal which half contains the minimum when the array is rotated.",
      },
      {
        label: "Using `lo <= hi` and shrinking to `hi = mid - 1`",
        body: "Use `lo < hi` and `hi = mid`. Because `mid` can be the minimum, you must not skip it by subtracting one.",
      },
      {
        label: "Returning mid instead of lo",
        body: "After the loop ends with `lo == hi`, the answer is `nums[lo]`. The original `mid` variable may point to an earlier, larger value.",
      },
      {
        label: "Forgetting the no-duplicates guarantee",
        body: "With duplicates, `nums[mid] == nums[hi]` makes the choice ambiguous and requires shrinking `hi--`. This version assumes distinct values.",
      },
    ],
    complexityReasoning:
      "Each iteration halves the remaining search range because it moves either `lo` past `mid` or `hi` to `mid`. That gives at most log2 n iterations. All operations inside the loop are O(1), and only three indices are stored, so the time is O(log n) and the extra space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "nums = [4,5,6,7,0,1,2]. lo=0, hi=6, mid=3 (7). Which direction do you move?",
        answer: "Right, because nums[3]=7 > nums[6]=2, so the minimum is in the right half.",
        hint: "When mid is greater than the right boundary, the pivot is to the right.",
      },
      {
        prompt:
          "nums = [11,13,15,17] (not rotated). lo=0, hi=3, mid=1 (13). What happens?",
        answer:
          "nums[1] <= nums[3], so hi becomes 1. The loop continues leftward until lo=hi=0 and returns 11.",
        hint: "A fully sorted array also works; the 'right half' is sorted, so hi keeps moving left.",
      },
    ],
    interviewFraming:
      "This is a warm-up for rotated-array binary search. The natural follow-up is allowing duplicates (Find Minimum in Rotated Sorted Array II), where equality between mid and hi forces a linear-ish fallback. Another twist is finding the pivot index itself, which is equivalent to finding the index of the minimum.",
  },

  {
    id: "bs-4",
    topicId: "binary-search",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    tags: ["binary-search", "matrix"],
    problem:
      "Given an `m x n` integer matrix where every row and every column is sorted in ascending order, determine whether a `target` value is present in the matrix.",
    constraints: ["1 <= m,n <= 100"],
    approach:
      "Treat the matrix as a single sorted array of length m × n. Map a virtual index `mid` to `matrix[Math.floor(mid / n)][mid % n]`, then run ordinary binary search. If the virtual element matches target, return true; otherwise move the virtual window left or right.",
    dryRun: [
      "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
      "m=3, n=4. lo=0, hi=11, mid=5 → matrix[1][1] = 11. 11 > 3 → hi=4.",
      "lo=0, hi=4, mid=2 → matrix[0][2] = 5. 5 > 3 → hi=1.",
      "lo=0, hi=1, mid=0 → matrix[0][0] = 1. 1 < 3 → lo=1.",
      "lo=1, hi=1, mid=1 → matrix[0][1] = 3. Match → true.",
    ],
    solution: `function searchMatrix(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let lo = 0;
  let hi = rows * cols - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / cols)][mid % cols];

    if (val === target) return true;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`,
    timeComplexity: "O(log(mn))",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force way checks every cell: O(m·n). But the whole matrix is sorted if you read it row by row, because each row starts where the previous row left off. That means a value in the middle of the virtual flattened array splits the matrix into smaller values (top-left) and larger values (bottom-right). Binary search on the virtual index finds the target in logarithmic time.",
    pitfalls: [
      {
        label: "Mixing up row and column conversion",
        body: "For virtual index `mid`, row = `Math.floor(mid / cols)` and col = `mid % cols`. Using the row count instead of the column count in the modulus gives the wrong cell.",
      },
      {
        label: "Binary searching rows and columns separately",
        body: "A separate binary search on each row is O(m log n), which is correct but slower. The virtual-index trick achieves O(log(mn)).",
      },
      {
        label: "Forgetting the matrix could have one row or one column",
        body: "The virtual-index formula still works when `rows == 1` or `cols == 1`. Test those edge cases mentally.",
      },
      {
        label: "Assuming the matrix starts in the top-right and using a staircase walk",
        body: "A staircase walk from the top-right is another valid O(m+n) solution, but it is not the binary-search approach the question usually expects. Pick one and stick to it.",
      },
    ],
    complexityReasoning:
      "Flattening the matrix conceptually produces a sorted array of length m·n. Binary search on this array halves the candidate set every iteration, giving O(log(mn)) time. The conversion from virtual index to row and column is O(1), and only a few scalar variables are stored, so the extra space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "matrix = [[1,3,5],[7,9,11]], target = 9. Virtual array length is 6. First mid is 2. Which cell is that?",
        answer: "row = floor(2/3) = 0, col = 2 % 3 = 2 → matrix[0][2] = 5.",
        hint: "Divide by the number of columns, not rows.",
      },
      {
        prompt: "matrix[0][2] = 5 is less than 9. Which direction do you move?",
        answer: "Move lo to mid+1; all virtual indices ≤ 2 hold values ≤ 5, which cannot be 9.",
        hint: "The virtual array is sorted, so ordinary binary-search rules apply.",
      },
    ],
    interviewFraming:
      "Interviewers often ask this question in two phases: first the O(m+n) staircase solution, then the O(log(mn)) binary-search solution. Be ready to explain both. A common follow-up is a matrix where rows are sorted but columns are not, which breaks the virtual-index binary search and forces a row-by-row search.",
  },

  {
    id: "bs-5",
    topicId: "binary-search",
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    tags: ["binary-search", "design", "hashmap"],
    problem:
      "Design a time-based key-value store. `set(key, value, timestamp)` stores `value` with `key` at time `timestamp`. `get(key, timestamp)` returns the value at the largest timestamp less than or equal to `timestamp` for that key. If no such value exists, return the empty string. Timestamps for `set` calls for any key are strictly increasing.",
    constraints: ["0 <= timestamp <= 10⁷"],
    approach:
      "Maintain a map from each key to an array of `[timestamp, value]` pairs in insertion order (which is increasing by timestamp). For `get`, binary-search that array for the rightmost timestamp that is ≤ the query timestamp and return its value.",
    dryRun: [
      "set('foo','bar',1); set('foo','baz',3);",
      "get('foo',0) → '' (no timestamp ≤ 0).",
      "get('foo',1) → 'bar' (exact match).",
      "get('foo',2) → 'bar' (largest timestamp ≤ 2 is 1).",
      "get('foo',3) → 'baz' (exact match).",
      "get('foo',4) → 'baz' (largest timestamp ≤ 4 is 3).",
    ],
    solution: `class TimeMap {
  constructor() {
    this.map = new Map();
  }

  set(key, value, timestamp) {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push([timestamp, value]);
  }

  get(key, timestamp) {
    const list = this.map.get(key) ?? [];
    let lo = 0;
    let hi = list.length - 1;
    let ans = "";

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid][0] <= timestamp) {
        ans = list[mid][1];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }
}`,
    timeComplexity: "O(log n) get",
    spaceComplexity: "O(n)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "input", value: "see problem statement" },
      { label: "expected", value: "see problem statement" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A hash map alone gives O(1) access by key, but timestamps add an ordering problem. If every `set` appends with a strictly increasing timestamp, the values for a key form a sorted timeline. That makes a binary search the fastest way to find the latest event before a query time. It is like asking, 'What was the last setting before midnight?' in a sorted log.",
    pitfalls: [
      {
        label: "Using `lower_bound` semantics instead of `upper_bound`",
        body: "We need the largest timestamp that is ≤ the query, not the smallest timestamp that is ≥ it. When `list[mid][0] <= timestamp`, record the value and move right (`lo = mid + 1`).",
      },
      {
        label: "Not initializing the answer string",
        body: "If the query timestamp is earlier than every stored timestamp, `get` should return `''`. Initialize `ans` to the empty string and only overwrite it on valid matches.",
      },
      {
        label: "Assuming timestamps are unique across all keys",
        body: "Timestamps are only guaranteed increasing per key. Each key must have its own sorted list; do not store all values in one global timeline.",
      },
      {
        label: "Forgetting to create the list for a new key",
        body: "On `set`, make sure the key exists in the map before pushing. Otherwise you will try to push into `undefined`.",
      },
    ],
    complexityReasoning:
      "`set` appends to the end of an array, which is amortized O(1). `get` performs a binary search over the list of values for that key; if a key has n entries, that is O(log n). In total, all stored `[timestamp, value]` pairs across every key sum to the number of `set` calls, so the space is O(n) where n is the total number of stored pairs.",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "Values for 'foo' are [[1,'bar'],[5,'baz']]. get('foo',4) asks for the largest timestamp ≤ 4. What do you return?",
        answer: "'bar', because timestamp 1 is the latest stored timestamp that is ≤ 4.",
        hint: "We want the entry just before or at the query time, not the next one.",
      },
      {
        prompt:
          "During binary search, you see list[mid][0] = 3 and the query timestamp is 7. Should you record the answer and move left or right?",
        answer:
          "Record the answer and move right (lo = mid + 1); there might be an even later timestamp that is still ≤ 7.",
        hint: "A valid mid is a candidate, but a better candidate could exist to its right.",
      },
    ],
    interviewFraming:
      "This question tests whether you can combine a hash map with binary search to handle time-ordered data. Follow-ups usually increase complexity: what if timestamps are not strictly increasing and you must insert in the middle? Then you might use a balanced tree or a sorted list with binary insertion. Another variant asks for `get` to return the value at the exact timestamp or the nearest one, which changes the comparison logic slightly.",
  },

  // ─── NEW QUESTIONS ──────────────────────────────────────────────────────────

  {
    id: "bs-6",
    topicId: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    tags: ["binary-search"],
    problem:
      "Given a sorted integer array `nums` and an integer `target`, return the index of `target` if it exists in `nums`, otherwise return `-1`.",
    constraints: [
      "1 <= nums.length <= 10⁴",
      "-10⁴ <= nums[i], target <= 10⁴",
      "nums is sorted in non-decreasing order.",
    ],
    approach:
      "Maintain a window `[lo, hi]` of possible indices. Repeatedly pick the middle index. If it matches the target, return it. If the middle value is too small, the target can only be to the right; otherwise it can only be to the left. Stop when the window is empty.",
    dryRun: [
      "nums = [-1,0,3,5,9,12], target = 9",
      "lo=0, hi=5, mid=2 (3). 3 < 9 → lo=3.",
      "lo=3, hi=5, mid=4 (9). Match → return 4.",
    ],
    solution: `function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "nums", value: "[-1,0,3,5,9,12]" },
      { label: "target", value: "9" },
      { label: "expected", value: "4" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Brute force would check every index in order, which takes linear time. The sorted order lets you eliminate half the array at a glance: the middle element is either the target, or it tells you the target must be on one side because everything on the other side is too small or too large. It is like guessing a number between 1 and 100 by always asking if it is above or below the middle.",
    pitfalls: [
      {
        label: "Using `(lo + hi) / 2` without overflow protection",
        body: "In languages with fixed-size integers, `lo + hi` can overflow. Use `lo + ((hi - lo) >> 1)` instead. JavaScript numbers are safe here, but the safer form is still good practice.",
      },
      {
        label: "Using `<` instead of `<=` in the loop",
        body: "If `lo == hi` and that index holds the target, a `lo < hi` loop will skip it. Use `lo <= hi` so the final single-element window is checked.",
      },
      {
        label: "Moving `lo` or `hi` to `mid` instead of `mid ± 1`",
        body: "If `nums[mid]` is not the target, it can be excluded from the next window. Move `lo = mid + 1` or `hi = mid - 1` to avoid an infinite loop.",
      },
      {
        label: "Returning the value instead of the index",
        body: "The problem asks for the index of the target. Return `mid`, not `nums[mid]`. If the target is missing, return `-1`.",
      },
    ],
    complexityReasoning:
      "Each iteration halves the number of candidate indices, so the loop runs at most log2 n times. The work inside each iteration is O(1): one comparison and one midpoint calculation. Only the `lo`, `hi`, and `mid` indices are stored, giving O(1) extra space.",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "nums = [1,2,3,4,5], target = 2. lo=0, hi=4, mid=2 (3). What is the next step?",
        answer:
          "3 > 2, so the target must be to the left. Set hi = mid - 1 = 1.",
        hint: "Exclude the middle element because it is too large.",
      },
      {
        prompt:
          "nums = [1,2,3,4,5], target = 6. When does the loop end and what is returned?",
        answer:
          "The loop ends when lo > hi (lo=5, hi=4), and the function returns -1.",
        hint: "An empty window means the target is not present.",
      },
    ],
    interviewFraming:
      "This is the purest form of binary search and a common five-minute warm-up. The real test is usually an edge-case check: empty array, single element, target at either end, or duplicates. Interviewers also like to ask for the first or last occurrence of a duplicate target, which requires carefully adjusting the boundary and the equality branch.",
  },

  {
    id: "bs-7",
    topicId: "binary-search",
    title: "First Bad Version",
    difficulty: "Easy",
    tags: ["binary-search"],
    problem:
      "You are given `n` versions of a product labeled `1` through `n`. The latest version is bad, and all versions after the first bad version are also bad. You have an API `isBadVersion(version)` that returns `true` if the version is bad. Find and return the first bad version.",
    constraints: ["1 <= bad <= n <= 2³¹ - 1"],
    approach:
      "Versions are monotonic: all versions before the first bad one are good, and all from the first bad onward are bad. Binary search for the leftmost version that returns `true`. Keep a window `[lo, hi]` and shrink based on whether `isBadVersion(mid)` is true or false.",
    dryRun: [
      "n = 5, first bad = 4",
      "lo=1, hi=5, mid=3. isBadVersion(3) = false → first bad is to the right → lo=4.",
      "lo=4, hi=5, mid=4. isBadVersion(4) = true → first bad is at or to the left → hi=4.",
      "lo=4, hi=4 → return 4.",
    ],
    solution: `function firstBadVersion(n) {
  let lo = 1;
  let hi = n;

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (isBadVersion(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "n", value: "5" },
      { label: "first bad", value: "4" },
      { label: "expected", value: "4" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A linear scan from version 1 upward would eventually hit the first bad version in O(n), but it ignores the monotonic guarantee. Once you know `isBadVersion(x)` is true, every later version is also bad. That monotonic predicate is exactly what binary search needs: it finds the boundary between good and bad in logarithmic time.",
    pitfalls: [
      {
        label: "Using `lo <= hi` with `hi = mid - 1`",
        body: "The answer is the leftmost `true`. If `mid` is bad, it could be the first bad version, so you must keep it in the search space with `hi = mid`. Use `lo < hi` and exit when they meet.",
      },
      {
        label: "Overflow in the midpoint calculation",
        body: "`n` can be as large as 2³¹ - 1. Use `lo + ((hi - lo) >> 1)` instead of `(lo + hi) >> 1` to avoid overflow in strongly typed languages. JavaScript is safe, but the safer form is preferred.",
      },
      {
        label: "Moving `lo = mid` instead of `mid + 1` when good",
        body: "If `isBadVersion(mid)` is false, `mid` and everything before it are good and can be excluded. Move `lo` to `mid + 1`, not `mid`.",
      },
      {
        label: "Returning `hi` at the end",
        body: "Both pointers converge to the first bad version, but the loop invariant is designed so that `lo` is the answer. Return `lo` for clarity.",
      },
    ],
    complexityReasoning:
      "Each call to `isBadVersion` is treated as O(1). The binary search halves the version range every iteration, so there are O(log n) calls. Only `lo`, `hi`, and `mid` are stored, giving O(1) extra space.",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "n = 10, first bad = 7. lo=1, hi=10, mid=5. isBadVersion(5) = false. What is the next window?",
        answer: "lo = mid + 1 = 6; the first bad version must be after 5.",
        hint: "A good version tells you the answer is strictly to the right.",
      },
      {
        prompt:
          "Continuing: lo=6, hi=10, mid=8. isBadVersion(8) = true. What is the next window?",
        answer:
          "hi = mid = 8; the first bad version is at 8 or to its left.",
        hint: "A bad version tells you the answer is at mid or earlier.",
      },
    ],
    interviewFraming:
      "This problem is the canonical 'binary search on a boolean predicate.' Interviewers often use it to check whether you can identify monotonicity and search for a boundary instead of a value. Follow-ups usually generalize the predicate: given any `isValid(x)` that is false then true, find the transition point, which appears in capacity planning and scheduling problems.",
  },

  {
    id: "bs-8",
    topicId: "binary-search",
    title: "Peak Index in a Mountain Array",
    difficulty: "Medium",
    tags: ["binary-search"],
    problem:
      "An array `arr` is a mountain array if it has length at least 3 and there exists an index `i` with `0 < i < arr.length - 1` such that `arr[0] < arr[1] < ... < arr[i]` and `arr[i] > arr[i+1] > ... > arr[arr.length-1]`. Return the peak index `i`.",
    constraints: [
      "3 <= arr.length <= 10⁵",
      "0 <= arr[i] <= 10⁶",
      "arr is a mountain array.",
    ],
    approach:
      "The array strictly increases up to the peak and strictly decreases after it. Compare `arr[mid]` to `arr[mid + 1]`. If `arr[mid] < arr[mid + 1]`, the peak is to the right; otherwise `mid` is at or to the left of the peak. Binary search until `lo == hi`.",
    dryRun: [
      "arr = [0,2,1,0]",
      "lo=0, hi=3, mid=1. arr[1]=2 > arr[2]=1 → peak is at or left of mid → hi=1.",
      "lo=0, hi=1, mid=0. arr[0]=0 < arr[1]=2 → peak is to the right → lo=1.",
      "lo=1, hi=1 → return 1.",
    ],
    solution: `function peakIndexInMountainArray(arr) {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "arr", value: "[0,2,1,0]" },
      { label: "expected", value: "1" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "A linear scan would find the peak in O(n) by looking for the first place the array stops increasing. Binary search works because the mountain shape is monotonic on each side. The neighbor to the right of any element tells you whether you are still climbing or already descending, so you can discard the wrong half.",
    pitfalls: [
      {
        label: "Comparing `arr[mid]` to `arr[mid - 1]`",
        body: "Compare `arr[mid]` to `arr[mid + 1]`. The right neighbor is guaranteed to exist while `lo < hi`, because `mid < hi`. Comparing to the left neighbor risks out-of-bounds when `mid == 0`.",
      },
      {
        label: "Using `lo <= hi` and `hi = mid - 1`",
        body: "`mid` itself could be the peak, so keep it in the search space with `hi = mid`. Use `lo < hi` and exit when they converge.",
      },
      {
        label: "Returning the peak value instead of its index",
        body: "The problem asks for the index `i`, not the value `arr[i]`. Return `lo` after the loop.",
      },
      {
        label: "Forgetting the array is strictly increasing then strictly decreasing",
        body: "The strict ordering guarantees `arr[mid] < arr[mid+1]` means the peak is to the right. With flat plateaus the rule would break.",
      },
    ],
    complexityReasoning:
      "Each iteration halves the remaining index range by moving either `lo` past `mid` or `hi` to `mid`. There are at most log2 n iterations, each doing one array comparison. Only three indices are stored, so the extra space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "arr = [0,1,2,3,4,3,2,1]. lo=0, hi=7, mid=3 (3). What do you compare and which direction do you move?",
        answer:
          "Compare arr[3]=3 to arr[4]=4. Because 3 < 4, we are still climbing → lo = mid + 1 = 4.",
        hint: "A right neighbor that is larger means the peak is to the right.",
      },
      {
        prompt:
          "arr = [0,1,2,3,4,3,2,1]. lo=4, hi=7, mid=5 (3). What is the next move?",
        answer:
          "arr[5]=3 < arr[6]=2 is false (3 > 2), so we are descending → hi = mid = 5.",
        hint: "When the right neighbor is smaller, mid is at or left of the peak.",
      },
    ],
    interviewFraming:
      "This is a clean example of binary search on a local maximum. Follow-ups often remove the strict monotonicity and ask for any peak element in an unsorted array, or for the maximum element in a bitonic (mountain) sequence. The same compare-with-neighbor idea also appears in finding local minima and in binary-search variants on unimodal functions.",
  },

  {
    id: "bs-9",
    topicId: "binary-search",
    title: "Find Kth Smallest Pair Distance",
    difficulty: "Hard",
    tags: ["binary-search", "array"],
    problem:
      "Given an integer array `nums` and an integer `k`, return the k-th smallest distance among all pairs in `nums`. The distance of a pair is the absolute difference between their values.",
    constraints: [
      "n == nums.length",
      "2 <= n <= 10⁴",
      "0 <= nums[i] <= 10⁶",
      "1 <= k <= n * (n - 1) / 2",
    ],
    approach:
      "Sort `nums`. For a candidate distance `d`, count how many pairs have distance ≤ d using a sliding window: for each `right`, advance `left` until `nums[right] - nums[left] <= d`. That count is monotonic in `d`, so binary search the smallest `d` whose count is at least `k`.",
    dryRun: [
      "nums = [1,3,1], k = 2",
      "sorted: [1,1,3]. Pair distances: 0, 2, 2.",
      "lo=0, hi=2, mid=1. Count pairs ≤ 1: only the equal pair (1,1) → count=1 < 2 → lo=2.",
      "lo=2, hi=2 → answer = 2.",
    ],
    solution: `function smallestDistancePair(nums, k) {
  nums.sort((a, b) => a - b);
  let lo = 0;
  let hi = nums[nums.length - 1] - nums[0];

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let count = 0;
    let left = 0;

    for (let right = 0; right < nums.length; right++) {
      while (nums[right] - nums[left] > mid) left++;
      count += right - left;
    }

    if (count < k) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}`,
    timeComplexity: "O(n log n + n log W)",
    spaceComplexity: "O(1) auxiliary",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "nums", value: "[1,3,1]" },
      { label: "k", value: "2" },
      { label: "expected", value: "2" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "There can be O(n²) pairs, so enumerating them all is too slow. The trick is to flip the question: instead of asking 'what is the k-th distance?' we ask 'how many pairs have distance at most d?' That count grows monotonically as d grows, so we can binary search d. Sorting the array lets us count those pairs in linear time with a sliding window, because all valid pairs ending at `right` start somewhere between `left` and `right`.",
    pitfalls: [
      {
        label: "Forgetting to sort first",
        body: "The sliding-window count only works if equal or near-equal values are adjacent. Sort `nums` before counting.",
      },
      {
        label: "Counting pairs with a nested loop",
        body: "For each `right`, the number of valid pairs is `right - left` after advancing `left`. Do not add nested loops, or the count step becomes O(n²).",
      },
      {
        label: "Binary-searching on the unsorted index instead of distance",
        body: "The search space is the range of possible distances, from 0 to `max(nums) - min(nums)`. Binary search that numeric range, not the array indices.",
      },
      {
        label: "Moving `hi` to `mid - 1` when count is large enough",
        body: "If `count >= k`, `mid` is a possible answer. Keep it in the search space with `hi = mid`. Move `lo` only when `count < k`.",
      },
    ],
    complexityReasoning:
      "Sorting the array costs O(n log n). The binary search runs over the distance range `W = max(nums) - min(nums)`, taking O(log W) iterations. Each iteration counts valid pairs by sweeping the array once with a sliding window, which is O(n). That gives O(n log n + n log W) time. Only a few scalar variables are used beyond the sorted input, so the auxiliary space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "nums = [1,1,3], k = 2. sorted = [1,1,3]. For candidate d = 1, how many pairs have distance ≤ 1?",
        answer:
          "1 pair: the two 1s. The pairs (1,3) have distance 2, which is > 1.",
        hint: "Use a sliding window: for right=1, left stays 0 → 1 pair.",
      },
      {
        prompt:
          "For d = 1 the count is 1, which is less than k = 2. Which direction do you move the binary-search window?",
        answer:
          "Increase the candidate distance: lo = mid + 1. We need a larger distance to include more pairs.",
        hint: "A small count means the k-th distance is bigger than the current candidate.",
      },
    ],
    interviewFraming:
      "This is an advanced 'binary search on the answer' problem combined with a monotonic counting subproblem. Interviewers ask it to see if you can avoid the O(n²) enumeration and instead recognize monotonicity. Follow-ups include counting pairs with distance exactly d, handling duplicates, or generalizing to the k-th smallest absolute difference in a stream.",
  },

  {
    id: "bs-10",
    topicId: "binary-search",
    title: "Split Array Largest Sum",
    difficulty: "Hard",
    tags: ["binary-search", "dp"],
    problem:
      "Given an integer array `nums` and an integer `m`, split the array into `m` non-empty contiguous subarrays. Return the minimum possible value of the largest sum among those subarrays.",
    constraints: [
      "1 <= nums.length <= 1000",
      "0 <= nums[i] <= 10⁶",
      "1 <= m <= min(50, nums.length)",
    ],
    approach:
      "The answer is the largest subarray sum, which must be at least the largest single element and at most the total sum of all elements. For a candidate largest-sum `cap`, greedily form subarrays: keep adding elements until adding the next one would exceed `cap`, then start a new subarray. If the number of subarrays needed is at most `m`, `cap` is feasible and we try a smaller value; otherwise we need a larger cap. Binary search the smallest feasible cap.",
    dryRun: [
      "nums = [7,2,5,10,8], m = 2",
      "lo = 10 (max element), hi = 32 (total sum).",
      "cap = 21: greedy gives [7,2,5,10] would exceed 21 at 10, so split before 10 → [7,2,5] and [10,8]. 2 subarrays ≤ m → feasible → hi=21.",
      "cap = 18: greedy gives [7,2,5]=14, add 10 → 24 > 18 split, then [10,8]=18. 2 subarrays ≤ m → feasible → hi=18.",
      "cap = 17: greedy gives [7,2,5]=14, add 10 → 24 > 17 split, [10]=10, add 8 → 18 > 17 split. 3 subarrays > m → infeasible → lo=18.",
      "lo = 18, hi = 18 → answer = 18.",
    ],
    solution: `function splitArray(nums, m) {
  let lo = Math.max(...nums);
  let hi = nums.reduce((sum, x) => sum + x, 0);

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let splits = 1;
    let currentSum = 0;

    for (const x of nums) {
      if (currentSum + x > mid) {
        splits++;
        currentSum = x;
      } else {
        currentSum += x;
      }
    }

    if (splits <= m) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}`,
    timeComplexity: "O(n log S)",
    spaceComplexity: "O(1)",
    buildTrace: () => [
      {
        description:
          "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],
    sampleInput: [
      { label: "nums", value: "[7,2,5,10,8]" },
      { label: "m", value: "2" },
      { label: "expected", value: "18" },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "Brute force tries every way to split the array into m parts, which is exponential. The smarter view is to search the answer directly: the largest subarray sum must lie between the biggest single number and the sum of all numbers. For any guess, you can check in one linear scan whether that guess is feasible by being greedy. Greedy works because making each subarray as full as possible without exceeding the cap never uses more splits than necessary.",
    pitfalls: [
      {
        label: "Setting lo to 0 or 1",
        body: "The largest subarray sum must be at least the maximum element, because that element must appear in some subarray. Set `lo = Math.max(...nums)`.",
      },
      {
        label: "Starting with `splits = 0`",
        body: "The first subarray already counts as one split. Initialize `splits = 1` before scanning, not 0.",
      },
      {
        label: "Using `< m` instead of `<= m` in the feasibility test",
        body: "Using fewer splits than allowed is fine because you can always split a valid subarray further. Check `splits <= m`.",
      },
      {
        label: "Making a subarray empty to fit the cap",
        body: "Every subarray must be non-empty. If a single element already exceeds the cap, the cap is infeasible, but that cannot happen because `lo` starts at the max element.",
      },
    ],
    complexityReasoning:
      "The feasibility check scans the array once, doing O(1) work per element, so it is O(n). The binary search runs on the range of possible largest sums, from `max(nums)` to `sum(nums)`, which is O(log S) iterations. Multiplying gives O(n log S) time. Only a few scalar variables are stored, so the extra space is O(1).",
    patternFamily: "Binary Search",
    selfTest: [
      {
        prompt:
          "nums = [7,2,5,10,8], m = 2. Candidate cap = 18. After scanning [7,2,5] the running sum is 14. What happens when you see 10?",
        answer:
          "14 + 10 = 24 > 18, so we start a new subarray and set currentSum = 10.",
        hint: "Exceeding the cap forces a new split.",
      },
      {
        prompt:
          "The greedy scan finishes with 2 subarrays and cap = 18. Is the answer necessarily 18?",
        answer:
          "Not yet — it means 18 is feasible, so we shrink the search space to look for a smaller feasible cap.",
        hint: "Binary search on the answer keeps going until lo == hi.",
      },
    ],
    interviewFraming:
      "This problem is the classic 'binary search on the answer' with a greedy feasibility check. Interviewers often pair it with a dynamic-programming follow-up: what if the subarrays do not have to be contiguous? The contiguous version is greedy-checkable; the unconstrained version usually requires DP. Be ready to prove why greedily filling each subarray minimizes the number of splits for a given cap.",
  },
];
