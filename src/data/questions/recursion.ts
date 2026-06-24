import type { Question } from "../types";
import { stub } from "../question-utils";

const STUB_QUESTIONS: Question[] = [
  stub({
    id: "r-1",
    topicId: "recursion",
    title: "Subsets",
    difficulty: "Medium",
    tags: ["backtracking", "array"],
    problem:
      "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    constraints: [
      "1 <= nums.length <= 10",
      "All the numbers of `nums` are unique.",
      "-10 <= nums[i] <= 10",
    ],
    approach:
      "Build a binary decision tree. At index `i`, first recurse without `nums[i]`, then add `nums[i]` to the current list and recurse again. When `i` reaches the end of the array, store a copy of the current list. This systematically toggles every element in or out and produces all 2^n subsets without duplicates.",
    dryRun: [
      "nums = [1, 2, 3]",
      "Start with cur = []",
      "Skip 1, skip 2, skip 3 → record []",
      "Skip 1, skip 2, take 3 → record [3]",
      "Skip 1, take 2, skip 3 → record [2]",
      "Skip 1, take 2, take 3 → record [2, 3]",
      "Take 1, skip 2, skip 3 → record [1]",
      "Take 1, skip 2, take 3 → record [1, 3]",
      "Take 1, take 2, skip 3 → record [1, 2]",
      "Take 1, take 2, take 3 → record [1, 2, 3]",
      "Return all 8 subsets.",
    ],
    solution: `function subsets(nums) {
  const out = [], cur = [];
  const bt = (i) => {
    if (i === nums.length) {
      out.push([...cur]);
      return;
    }
    bt(i + 1);              // do not take nums[i]
    cur.push(nums[i]);      // take nums[i]
    bt(i + 1);
    cur.pop();              // undo for the next branch
  };
  bt(0);
  return out;
}`,
    timeComplexity: "O(n·2ⁿ)",
    spaceComplexity: "O(n) excluding output",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move would be nested loops, one per element, but the number of loops depends on the input size and quickly becomes impossible to write. The insight is that each element makes the same tiny decision: am I in the current subset or not? Recursion turns that decision into a tree whose leaves are exactly the 2^n subsets. It is like toggling a row of light switches — every switch has two states, and you record the final pattern after the last switch.",
    pitfalls: [
      {
        label: "Pushing the shared `cur` array into `out`",
        body: "`out.push(cur)` stores a reference to the same mutable array. Every branch later mutates it, so all recorded subsets would end up equal. Always store a snapshot with `[...cur]`.",
      },
      {
        label: "Forgetting to pop after the take branch",
        body: "After `cur.push(nums[i])` and the recursive call, run `cur.pop()` before the next iteration. Otherwise the skip branch will incorrectly see `nums[i]` already inside.",
      },
      {
        label: "Mixing up the two recursive calls",
        body: "The first call explores all subsets that do not contain `nums[i]`; the second explores subsets that do. Keep the order consistent so the dry-run matches the code.",
      },
      {
        label: "Thinking the output order matters",
        body: "The problem accepts any order. As long as every subset appears exactly once, the solution is correct.",
      },
    ],
    complexityReasoning:
      "There are 2^n possible subsets, and the recursion visits each one exactly once. When we reach a leaf we spend O(n) time to copy the current list of at most n elements. That gives O(n·2^n) total time. The recursion depth is at most n, and the `cur` array holds at most n numbers, so the auxiliary space is O(n) excluding the output list.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "nums = [1, 2]. After the first call `bt(1)` returns from the 'skip 1' branch, what is inside `cur`?",
        answer: "`cur` is still empty.",
        hint: "That branch never pushed anything.",
      },
      {
        prompt: "At the base case `i === nums.length`, why do we push `[...cur]` instead of `cur`?",
        answer: "`cur` is reused across branches; a copy captures the subset for that specific leaf.",
        hint: "Think about shared mutable state.",
      },
      {
        prompt: "How many base-case calls happen for an input of length n?",
        answer: "2^n, one for each binary in/out sequence.",
        hint: "Each element has exactly two choices.",
      },
    ],
    interviewFraming:
      "Subsets is the canonical binary-decision-tree warm-up. It often appears as a subproblem in power-set questions, bitmask dynamic programming, or grouping problems. Common follow-ups include handling duplicate input values (sort and skip equal neighbors) and returning only subsets of a specific size.",
  }),

  stub({
    id: "r-2",
    topicId: "recursion",
    title: "Permutations",
    difficulty: "Medium",
    tags: ["backtracking"],
    problem:
      "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
    constraints: [
      "1 <= nums.length <= 6",
      "-10 <= nums[i] <= 10",
      "All the integers of `nums` are unique.",
    ],
    approach:
      "Maintain a current permutation and a `used` set of indices. For each position in the permutation, try every index that has not been used yet: mark it used, append the value, recurse, then remove the value and unmark the index. When the current list reaches the same length as `nums`, store a copy as a complete permutation.",
    dryRun: [
      "nums = [1, 2, 3]",
      "Pick index 0 → cur = [1]",
      "  Pick index 1 → cur = [1, 2]",
      "    Pick index 2 → cur = [1, 2, 3] → record",
      "  Backtrack, pick index 2 → cur = [1, 3]",
      "    Pick index 1 → cur = [1, 3, 2] → record",
      "Backtrack to top, pick index 1 first, then explore all orderings starting with 2",
      "Then pick index 2 first and explore all orderings starting with 3",
      "Return all 6 permutations.",
    ],
    solution: `function permute(nums) {
  const out = [], cur = [];
  const used = new Set();
  const bt = () => {
    if (cur.length === nums.length) {
      out.push([...cur]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;
      used.add(i);
      cur.push(nums[i]);
      bt();
      cur.pop();
      used.delete(i);
    }
  };
  bt();
  return out;
}`,
    timeComplexity: "O(n·n!)",
    spaceComplexity: "O(n) excluding output",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force plan is to generate every arrangement of indices and check that none repeat; that is exactly n! work. The recursive insight is to build the permutation one seat at a time: choose any unused number for the next position, then ask the same question for the remaining seats. It is like seating guests one chair at a time — once a chair is filled you never reuse that guest, but you try every remaining guest in the next chair.",
    pitfalls: [
      {
        label: "Pushing `cur` by reference into `out`",
        body: "`out.push(cur)` makes every recorded permutation point to the same array. Use `[...cur]` to capture a snapshot.",
      },
      {
        label: "Forgetting to unmark `used` after recursion",
        body: "The index must be available for other branches. Delete it from `used` immediately after `cur.pop()`.",
      },
      {
        label: "Using a Set of values when duplicates exist",
        body: "This solution assumes distinct integers. If `nums` can contain duplicates, track by index or sort and skip equal values to avoid duplicate permutations.",
      },
      {
        label: "Checking `used` after the recursive call",
        body: "The `continue` must happen before you push and recurse. After the call the element is already popped.",
      },
    ],
    complexityReasoning:
      "There are n! permutations of n distinct elements. We spend O(n) time to copy each complete permutation, giving O(n·n!) total time. The recursion depth is n, and the `used` set plus `cur` list together hold at most n entries, so the extra space is O(n) excluding output.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "For nums = [1, 2, 3], after choosing index 0 then index 2, what must happen before trying index 1 at the second level?",
        answer: "Remove index 2 from `used` and pop it from `cur`.",
        hint: "Backtrack undoes the last choice.",
      },
      {
        prompt: "Why can't we reuse an index that is already in `cur`?",
        answer: "Because a permutation uses each element exactly once.",
        hint: "Reusing would create a shorter or invalid sequence.",
      },
      {
        prompt: "When do we record a complete permutation?",
        answer: "When `cur.length === nums.length`.",
        hint: "That means every element has a seat.",
      },
    ],
    interviewFraming:
      "Permutations tests whether you can manage a used-state during depth-first search. Interviewers often ask for the next lexicographic permutation iteratively, or for permutations of a string with duplicates, where you need deduplication logic. Be ready to explain why the total count is n!.",
  }),

  stub({
    id: "r-3",
    topicId: "recursion",
    title: "Word Search",
    difficulty: "Medium",
    tags: ["backtracking", "matrix"],
    problem:
      "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontal or vertical neighbors), and the same letter cell may not be used more than once.",
    constraints: [
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "`board` and `word` consist of only lowercase and uppercase English letters.",
    ],
    approach:
      "Run a depth-first search from every cell. If the cell matches the current word character, temporarily mark it visited with a sentinel, then recurse on the four neighbors for the next character. After exploring all neighbors, restore the original character so other starting cells can use it. Return true as soon as the entire word is matched.",
    dryRun: [
      "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'",
      "Start DFS at (0,0): 'A' matches word[0]",
      "  Neighbor (0,1): 'B' matches word[1]",
      "    Neighbor (0,2): 'C' matches word[2]",
      "      Neighbor (1,2): 'C' matches word[3]",
      "        Neighbor (1,1): 'F' does not match word[4] 'E' — backtrack",
      "        Neighbor (2,2): 'E' matches word[4]",
      "          Neighbor (2,1): 'D' matches word[5]",
      "          All characters matched → return true",
    ],
    solution: `function exist(board, word) {
  const m = board.length, n = board[0].length;
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || j < 0 || i >= m || j >= n || board[i][j] !== word[k]) {
      return false;
    }
    const tmp = board[i][j];
    board[i][j] = '#';
    const found =
      dfs(i + 1, j, k + 1) ||
      dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) ||
      dfs(i, j - 1, k + 1);
    board[i][j] = tmp;
    return found;
  };
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}`,
    timeComplexity: "O(m·n·4^L)",
    spaceComplexity: "O(L)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to start from every cell and walk every possible path of length L, which explodes very fast. The insight is to make one letter decision at a time and abandon a path the moment the next letter does not match. We reuse the board itself as a visited marker, so we do not need an extra matrix. It is like tracing a word through a maze: if the next corridor has the wrong letter, back out immediately instead of finishing the path.",
    pitfalls: [
      {
        label: "Not marking visited cells",
        body: "Without a sentinel, the search can loop forever or reuse the same cell twice in one path. Mark the cell before recursing and restore it after.",
      },
      {
        label: "Marking visited but forgetting to restore the letter",
        body: "After backtracking, set `board[i][j]` back to its original value so other DFS starts see the correct board.",
      },
      {
        label: "Reading the board before checking bounds",
        body: "Always check `i` and `j` are valid and that `board[i][j]` matches `word[k]` before doing anything else.",
      },
      {
        label: "Starting DFS from only one cell",
        body: "The word can begin anywhere. Loop over every `(i, j)` and start a DFS from each.",
      },
      {
        label: "Using a separate visited matrix and not resetting it",
        body: "A separate matrix works, but you must reset the cell after recursion just like the board sentinel. Mutating the board in place is simpler here.",
      },
    ],
    complexityReasoning:
      "We may start a search from any of the m·n cells. In the worst case, each step branches in four directions, so the search tree has up to 4^L nodes for a word of length L. The total time is therefore O(m·n·4^L). The recursion stack can be as deep as the word length L, and we modify the board in place, so the extra space is O(L).",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "We match 'A' at (0,0). Before exploring neighbors, what do we change on the board?",
        answer: "Set board[0][0] to a sentinel like '#' to mark it visited.",
        hint: "This prevents the current path from reusing the cell.",
      },
      {
        prompt: "After trying all four neighbors, what must we do with the sentinel?",
        answer: "Restore the original letter so other paths can use this cell.",
        hint: "Backtracking means undoing local changes.",
      },
      {
        prompt: "Why start DFS from every cell?",
        answer: "The word may begin anywhere in the grid.",
        hint: "The first letter is not pinned to a corner.",
      },
    ],
    interviewFraming:
      "Word Search is a classic board backtracking problem. In interviews it is often extended to find multiple words at once (Word Search II), which is solved with a Trie and DFS. Be prepared to discuss pruning: if the first letter of the word is not on the board, return false immediately.",
  }),

  stub({
    id: "r-4",
    topicId: "recursion",
    title: "Combination Sum",
    difficulty: "Medium",
    tags: ["backtracking"],
    problem:
      "Given an array of distinct positive integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may use the same number from `candidates` an unlimited number of times.",
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of `candidates` are distinct.",
      "1 <= target <= 40",
    ],
    approach:
      "Sort the candidates so we can stop early once the running sum exceeds the target. Recurse with a `start` index: for each candidate from `start` onward, add it to the current list, recurse with the same `start` (reuse allowed), then remove it. When the running sum equals the target, store a copy of the current list.",
    dryRun: [
      "candidates = [2, 3, 6, 7], target = 7",
      "Start: sum = 0",
      "Pick 2 → sum = 2",
      "  Pick 2 → sum = 4",
      "    Pick 3 → sum = 7 → record [2, 2, 3]",
      "    Pick 6 → sum = 10 > 7 → stop exploring this branch",
      "  Pick 3 → sum = 5",
      "    Pick 3 → sum = 8 > 7 → stop",
      "  Pick 6 → sum = 8 > 7 → stop",
      "Pick 7 → sum = 7 → record [7]",
      "Return [[2, 2, 3], [7]].",
    ],
    solution: `function combinationSum(candidates, target) {
  const out = [], cur = [];
  candidates.sort((a, b) => a - b);
  const bt = (start, sum) => {
    if (sum === target) {
      out.push([...cur]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (sum + candidates[i] > target) break;
      cur.push(candidates[i]);
      bt(i, sum + candidates[i]);
      cur.pop();
    }
  };
  bt(0, 0);
  return out;
}`,
    timeComplexity: "O(n^(t/min))",
    spaceComplexity: "O(t/min)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to enumerate every possible multiset of candidates; that set is enormous. The insight is to sort the candidates so that once the running sum exceeds the target, every later candidate in the loop is also too big and we can break. We also keep a start index so combinations stay in non-decreasing order and remain unique. It is like making exact change with an unlimited supply of coins — try each coin in order and stop adding once the total is too large.",
    pitfalls: [
      {
        label: "Forgetting to sort candidates",
        body: "Without sorting, the loop cannot break early when `sum + candidates[i] > target`. Sorting is what makes the pruning valid.",
      },
      {
        label: "Using `i + 1` instead of `i` as the next start",
        body: "`bt(i + 1, ...)` would forbid reusing the same candidate. The problem allows unlimited reuse, so the next call must still be allowed to pick `candidates[i]`.",
      },
      {
        label: "Pushing `cur` directly into `out`",
        body: "Always store `[...cur]`. The shared array keeps changing as backtracking runs.",
      },
      {
        label: "Not pruning when `sum` already equals `target`",
        body: "Record the combination immediately at `sum === target` and return. Going deeper can only add positive numbers and overshoot.",
      },
      {
        label: "Duplicate combinations when candidates have repeated values",
        body: "The standard constraints say candidates are distinct. If duplicates are possible, skip equal candidates after the first occurrence in the loop to avoid duplicate answers.",
      },
    ],
    complexityReasoning:
      "The recursion tree's branching factor is at most n, and its depth is at most `target / min(candidates)` because each addition consumes at least the smallest candidate. That gives an upper bound of O(n^(t/min)) nodes in the worst case. The current combination holds at most t/min elements and the recursion stack matches that depth, so the extra space is O(t/min) excluding output.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "candidates = [2, 3, 6, 7], target = 7, current sum = 4. Which candidates can we try next?",
        answer: "2 and 3. 6 would give sum 10, which exceeds 7, so we break.",
        hint: "Candidates are sorted; stop once the sum would exceed target.",
      },
      {
        prompt: "Why do we pass `i` (not `i + 1`) into the recursive call?",
        answer: "Because the same candidate may be reused unlimited times.",
        hint: "The start index controls which candidates are still available.",
      },
      {
        prompt: "What condition triggers recording a combination?",
        answer: "When `sum === target`.",
        hint: "At that point the current list is a valid answer.",
      },
    ],
    interviewFraming:
      "Combination Sum is the standard unbounded-knapsack-style backtracking problem. A common follow-up is Combination Sum II, where each candidate may be used only once; that changes the start index to `i + 1` and requires skipping duplicate candidates. Another twist is returning the combination that uses the minimum number of elements.",
  }),

  stub({
    id: "r-5",
    topicId: "recursion",
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    tags: ["backtracking", "string"],
    problem:
      "Given a string `digits` containing digits from 2-9, return all possible letter combinations that the number could represent. Return an empty array for an empty input.",
    constraints: [
      "0 <= digits.length <= 4",
      "digits[i] is a digit in the range ['2', '9'].",
    ],
    approach:
      "Map each digit to its corresponding letters. Recurse through the digit string one position at a time, appending every possible letter for the current digit to the partial string before moving to the next digit. When the partial string has the same length as `digits`, add it to the output.",
    dryRun: [
      "digits = '23'",
      "Map: 2 → 'abc', 3 → 'def'",
      "Choose 'a' from digit 2, then try 'd','e','f' from digit 3 → 'ad', 'ae', 'af'",
      "Choose 'b' from digit 2 → 'bd', 'be', 'bf'",
      "Choose 'c' from digit 2 → 'cd', 'ce', 'cf'",
      "Return ['ad','ae','af','bd','be','bf','cd','ce','cf'].",
    ],
    solution: `function letterCombinations(digits) {
  if (!digits.length) return [];
  const map = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };
  const out = [];
  const bt = (i, cur) => {
    if (i === digits.length) {
      out.push(cur);
      return;
    }
    for (const c of map[digits[i]]) {
      bt(i + 1, cur + c);
    }
  };
  bt(0, '');
  return out;
}`,
    timeComplexity: "O(n·4ⁿ)",
    spaceComplexity: "O(n)",

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move would be nested loops, one loop per digit, but the number of digits varies with the input. The insight is to treat each digit as another level of choices; recursion walks through the digit string and appends each mapped letter to the partial string. It is like an old phone keypad — press each digit, then try every letter it represents before moving to the next digit.",
    pitfalls: [
      {
        label: "Returning anything other than `[]` for empty input",
        body: "If `digits` is the empty string there are zero combinations. Explicitly return `[]` before starting the recursion.",
      },
      {
        label: "Using the wrong digit-to-letter mapping",
        body: "Digits 7 and 9 map to four letters; all others map to three. Double-check the mapping table.",
      },
      {
        label: "Collecting results before the base case",
        body: "Only push to `out` when `i === digits.length`. Before that the string is incomplete.",
      },
      {
        label: "Building combinations iteratively without a prefix",
        body: "If you prefer iteration, carry the current prefix through a queue or array. The recursive version naturally carries it as `cur`.",
      },
    ],
    complexityReasoning:
      "For each of the n digits we branch up to 4 times (for digits 7 and 9). The total number of output strings is at most 4^n, and we spend O(n) to build each string by concatenation. Therefore the total time is O(n·4^n). The recursion depth is n and the current string holds at most n characters, so the extra space is O(n) excluding output.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "digits = '23'. At the first recursive level, how many branches does the function create?",
        answer: "3 — one for each letter 'a', 'b', 'c' mapped to digit 2.",
        hint: "Look at the digit map.",
      },
      {
        prompt: "When do we push `cur` into `out`?",
        answer: "When `i === digits.length`, i.e., we have processed every digit.",
        hint: "Only complete strings are valid.",
      },
      {
        prompt: "What should the function return if `digits` is ''?",
        answer: "An empty array `[]`.",
        hint: "There are zero digits, so no combinations.",
      },
    ],
    interviewFraming:
      "This is a gentle introduction to generating Cartesian products by recursion. Interviewers might generalize it to generating all words from a custom keypad or all paths in a digit-to-string mapping. The same recursive pattern applies whenever each position has a small fixed list of choices.",
  }),
];

const NEW_QUESTIONS: Question[] = [
  {
    id: "r-6",
    topicId: "recursion",
    title: "Generate Parentheses",
    difficulty: "Medium",
    tags: ["backtracking", "string"],
    problem:
      "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    constraints: ["1 <= n <= 8"],
    approach:
      "Build each string from left to right. At every step you may add an opening parenthesis if you have not already used `n` of them, and you may add a closing parenthesis only if it would not exceed the number of opening parentheses placed so far. When both counts reach `n`, the string is complete and valid.",
    dryRun: [
      "n = 3",
      "Start: ''",
      "Add '(' → '(' (open=1, close=0)",
      "Add '(' → '((' (open=2)",
      "Add ')' → '(()' (open=2, close=1)",
      "Add '(' → '(()(' (open=3)",
      "Add ')' → '(()()' (close=2)",
      "Add ')' → '(()())' (close=3) → valid",
      "After exploring all branches, return ['((()))','(()())','(())()','()(())','()()()'].",
    ],
    solution: `function generateParenthesis(n) {
  const out = [];
  const bt = (open, close, cur) => {
    if (open === n && close === n) {
      out.push(cur);
      return;
    }
    if (open < n) bt(open + 1, close, cur + '(');
    if (close < open) bt(open, close + 1, cur + ')');
  };
  bt(0, 0, '');
  return out;
}`,
    timeComplexity: "O(4ⁿ / √n)",
    spaceComplexity: "O(n) excluding output",
    sampleInput: [
      { label: "n", value: "3" },
      { label: "expected", value: "['((()))','(()())','(())()','()(())','()()()']" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to generate every string of 2n brackets and then filter the valid ones; there are 2^(2n) candidates and most are invalid. The insight is to only add a bracket that keeps the prefix valid so far: add '(' if you haven't used all opens, and add ')' only if it wouldn't exceed the opens already placed. It is like building a balanced staircase — you can always add an upward step, but a downward step is only safe if you are above ground.",
    pitfalls: [
      {
        label: "Adding a closing parenthesis whenever `close < n`",
        body: "A closing parenthesis is only valid if `close < open`. Adding it merely because fewer than n have been used can create invalid prefixes like ')('.",
      },
      {
        label: "Forgetting the base case",
        body: "When `open === n && close === n` the string is complete. Push it and return so the recursion terminates.",
      },
      {
        label: "Collecting strings at the wrong time",
        body: "Only record a string at the base case. Partial strings should keep recursing.",
      },
      {
        label: "Using a global variable that is not reset",
        body: "Declare `out` inside the function so each fresh call starts with an empty list.",
      },
    ],
    complexityReasoning:
      "The number of valid strings is the nth Catalan number C_n, approximately 4^n / (n^(3/2) · √π). For each valid string we build a length-2n character sequence, so the total time is O(n · C_n), often simplified to O(4^n / √n). The recursion depth never exceeds 2n and the current string holds at most 2n characters, so the extra space is O(n) excluding the output list.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "n = 2, current string = '(' with open = 1, close = 0. What two choices are legal?",
        answer: "Add another '(' (open < 2) or add ')' (close < open).",
        hint: "Both counts are below n, and close is less than open.",
      },
      {
        prompt: "When can we no longer add an opening bracket?",
        answer: "When `open` already equals `n`.",
        hint: "We only have n pairs.",
      },
      {
        prompt: "Why can't we add ')' whenever `close < n`?",
        answer: "Because a closing bracket is only valid if it matches a previously unmatched '('.",
        hint: "`close` must stay less than or equal to `open`.",
      },
    ],
    interviewFraming:
      "Generate Parentheses is the classic Catalan-number backtracking problem. Interviewers often use it to test whether you can encode the validity constraint incrementally. A natural follow-up is to return only the kth valid sequence in lexicographic order, which forces you to count branches before recursing.",
  },

  {
    id: "r-7",
    topicId: "recursion",
    title: "N-Queens",
    difficulty: "Hard",
    tags: ["backtracking"],
    problem:
      "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Return all distinct solutions to the puzzle.",
    constraints: ["1 <= n <= 9"],
    approach:
      "Place queens one row at a time. For each row, try every column that is not already occupied and not on an attacked diagonal. Use sets to track occupied columns and the two diagonal families (`row - col` and `row + col`). When a queen has been placed in every row, copy the board into the result list and backtrack to find more solutions.",
    dryRun: [
      "n = 4",
      "Row 0: place queen at col 1 → board ['.Q..','....','....','....']",
      "Row 1: cols 0 and 2 attacked by diagonals; col 3 safe. Place at col 3.",
      "Row 2: col 0 safe. Place at col 0.",
      "Row 3: only col 2 is safe. Board complete.",
      "Record ['.Q..','...Q','Q...','..Q.'] and backtrack.",
      "Eventually find the second solution ['..Q.','Q...','...Q','.Q..'].",
    ],
    solution: `function solveNQueens(n) {
  const out = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col

  const bt = (row) => {
    if (row === n) {
      out.push(board.map((r) => r.join('')));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      board[row][col] = 'Q';
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      bt(row + 1);
      board[row][col] = '.';
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  };

  bt(0);
  return out;
}`,
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n²)",
    sampleInput: [
      { label: "n", value: "4" },
      {
        label: "expected",
        value: "[['.Q..','...Q','Q...','..Q.'], ['..Q.','Q...','...Q','.Q..']]",
      },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to try every placement of n queens on n² squares, an astronomical number. The insight is to place exactly one queen per row and only consider columns (and diagonals) that are not attacked by queens already placed. It is like seating one student per row in a classroom so no two can see each other along straight or diagonal sight lines.",
    pitfalls: [
      {
        label: "Checking only rows and columns",
        body: "Queens also attack along diagonals. You must track both diagonal families with `row - col` and `row + col`.",
      },
      {
        label: "Using one diagonal set but ignoring the other",
        body: "`row - col` is constant on one diagonal direction and `row + col` is constant on the other. Both are needed.",
      },
      {
        label: "Forgetting to reset the board and sets when backtracking",
        body: "After returning from `bt(row + 1)`, restore `board[row][col]` to '.' and remove the column and diagonal keys from the sets.",
      },
      {
        label: "Copying the board incorrectly at the base case",
        body: "Each solution must be an array of strings of length n. Use `board.map(r => r.join(''))` to copy, not `board` itself.",
      },
      {
        label: "Returning after the first solution",
        body: "The problem asks for all solutions. Continue backtracking after recording each valid board.",
      },
    ],
    complexityReasoning:
      "In the worst case we try up to n columns in row 0, n-1 columns in row 1, and so on, giving an upper bound of O(n!) nodes in the search tree before pruning. Pruning reduces this in practice. At each solution we copy an n×n board, adding O(n²) work per answer. The recursion stack is at most n deep and the tracking sets hold at most n entries each, so the auxiliary space is O(n²) including the working board.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "A queen is at (1, 1). At row 3, which column is on the same main diagonal (row - col)?",
        answer: "Column 3, because 1 - 1 = 0 and 3 - 3 = 0.",
        hint: "Main diagonal cells share the same `row - col` value.",
      },
      {
        prompt: "After placing a queen, what three things must we mark before recursing?",
        answer: "The column, the `row - col` diagonal, and the `row + col` diagonal.",
        hint: "Queens attack along all three lines.",
      },
      {
        prompt: "Why do we place exactly one queen per row?",
        answer: "Two queens in the same row would attack each other, so a valid solution can have at most one per row.",
        hint: "This collapses the search to one decision per row.",
      },
    ],
    interviewFraming:
      "N-Queens is the standard test of constraint-tracking during backtracking. Expect follow-ups like counting solutions only (N-Queens II), solving on larger boards with bitmasks, or using branch-and-bound to prune more aggressively. Be ready to explain why the row-by-row approach is safe and how the two diagonal families map to unique keys.",
  },

  {
    id: "r-8",
    topicId: "recursion",
    title: "N-Queens II",
    difficulty: "Hard",
    tags: ["backtracking"],
    problem:
      "Given an integer `n`, return the number of distinct solutions to the n-queens puzzle.",
    constraints: ["1 <= n <= 9"],
    approach:
      "Use the same row-by-row backtracking as N-Queens, but instead of copying the board at the base case, simply increment a counter. This avoids the cost of building and storing every solution and reduces memory usage.",
    dryRun: [
      "n = 4",
      "Explore placements row by row, tracking attacked columns and diagonals.",
      "Find the first valid board and increment the counter.",
      "Backtrack and find the second valid board, increment again.",
      "No more valid boards remain. Return 2.",
    ],
    solution: `function totalNQueens(n) {
  let count = 0;
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col

  const bt = (row) => {
    if (row === n) {
      count++;
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;
      }
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      bt(row + 1);
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  };

  bt(0);
  return count;
}`,
    timeComplexity: "O(n!)",
    spaceComplexity: "O(n)",
    sampleInput: [
      { label: "n", value: "4" },
      { label: "expected", value: "2" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move enumerates all boards and then counts them. The insight is identical to N-Queens, but because we only need a count we don't need to copy the board at each solution. It is like counting safe seat arrangements without taking a photograph of each one.",
    pitfalls: [
      {
        label: "Copying the board at the base case",
        body: "This problem only asks for the count. Replace the board-copy step with `count++`.",
      },
      {
        label: "Using a global counter that is not reset",
        body: "Declare `count` inside the function so repeated calls start from zero.",
      },
      {
        label: "Diagonal bookkeeping errors",
        body: "Same as N-Queens: remember `row - col` for one diagonal and `row + col` for the other, and unmark both on backtrack.",
      },
      {
        label: "Forgetting to unmark sets",
        body: "Remove the column and diagonal keys after returning from recursion so later branches can reuse them.",
      },
    ],
    complexityReasoning:
      "Same as N-Queens: the row-by-row search has an upper bound of O(n!) nodes in the recursion tree before pruning. Because we do not copy the board at each solution, the work per valid leaf is O(n) to place the queens, and the total auxiliary space is O(n) for the recursion stack and the three tracking sets.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "At the base case `row === n`, what single operation replaces copying the board?",
        answer: "Increment `count`.",
        hint: "We only need the number of solutions.",
      },
      {
        prompt: "For n = 4, how many solutions are there?",
        answer: "2.",
        hint: "Try placing queens on a 4×4 board.",
      },
      {
        prompt: "Why is the space usage lower than N-Queens?",
        answer: "We don't store every solution board; we only keep tracking sets and a counter.",
        hint: "Output size dominated in the original problem.",
      },
    ],
    interviewFraming:
      "N-Queens II removes output storage and focuses purely on counting valid configurations. Interviewers may ask you to optimize the count using bitmasks or symmetry arguments such as rotations and reflections. It is also a good exercise in ensuring your backtracking bookkeeping does not accidentally count duplicate or invalid placements.",
  },

  {
    id: "r-9",
    topicId: "recursion",
    title: "Sudoku Solver",
    difficulty: "Hard",
    tags: ["backtracking", "matrix"],
    problem:
      "Write a program to solve a Sudoku puzzle by filling the empty cells. The board is a 9×9 grid where empty cells are '.'. You may assume the given board has exactly one solution. Modify the board in place.",
    constraints: [
      "board.length == 9",
      "board[i].length == 9",
      "board[i][j] is a digit or '.'.",
      "The input board has exactly one solution.",
    ],
    approach:
      "Find the next empty cell ('.'). Try digits '1' through '9'. For each digit, verify that it does not already appear in the same row, column, or 3×3 box. If valid, place it and recurse. If the recursion solves the rest of the board, propagate success upward. Otherwise reset the cell to '.' and try the next digit.",
    dryRun: [
      "Locate the first empty cell, for example board[0][2].",
      "Try '1': check its row, column, and 3×3 box. If valid, place it.",
      "Recurse to the next empty cell.",
      "If a digit eventually leads to a dead end, reset the cell to '.' and backtrack.",
      "When no empty cells remain, the board is solved in place.",
    ],
    solution: `function solveSudoku(board) {
  const isValid = (r, c, num) => {
    const boxR = 3 * Math.floor(r / 3);
    const boxC = 3 * Math.floor(c / 3);
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === num) return false;
      if (board[i][c] === num) return false;
      const br = boxR + Math.floor(i / 3);
      const bc = boxC + (i % 3);
      if (board[br][bc] === num) return false;
    }
    return true;
  };

  const solve = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== '.') continue;
        for (let num = 1; num <= 9; num++) {
          const ch = String(num);
          if (!isValid(r, c, ch)) continue;
          board[r][c] = ch;
          if (solve()) return true;
          board[r][c] = '.';
        }
        return false;
      }
    }
    return true;
  };

  solve();
}`,
    timeComplexity: "O(9^e)",
    spaceComplexity: "O(e)",
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

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to try every digit in every empty cell, a 9^e nightmare for e empty cells. The insight is to fill cells one by one and backtrack the moment a digit breaks a row, column, or 3×3 box constraint. It is like solving a crossword in pencil — try a letter, and if it creates a conflict, erase it and try the next.",
    pitfalls: [
      {
        label: "Comparing numbers instead of strings",
        body: "The board stores characters '1' through '9'. Convert `num` to a string with `String(num)` before comparing or placing.",
      },
      {
        label: "Checking the 3×3 box with wrong coordinates",
        body: "The box starts at `3 * Math.floor(row / 3)` and `3 * Math.floor(col / 3)`. Loop over the nine cells inside that box.",
      },
      {
        label: "Not resetting a cell to '.' after failure",
        body: "If the recursive call returns false, restore the cell to '.' before trying the next digit. Otherwise stale digits corrupt the search.",
      },
      {
        label: "Skipping the in-place requirement",
        body: "The problem asks you to solve the board in place. Do not return a new board; modify the input `board`.",
      },
      {
        label: "Forgetting to propagate a solved result upward",
        body: "Once `solve()` returns true, return true immediately so the outer recursion stops trying more digits.",
      },
    ],
    complexityReasoning:
      "If there are e empty cells, the worst-case search tree branches up to 9 ways per empty cell, giving O(9^e) time before the one-solution guarantee and Sudoku constraints prune it. Each validity test scans a fixed 9 cells (row, column, and box), which is O(1) for the constant board size. The recursion stack can be as deep as e, and the board itself is 81 cells, so the auxiliary space is O(81), effectively O(1) for a fixed Sudoku grid.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "We are trying digit '5' at an empty cell. What three regions must be clear of '5'?",
        answer: "The row, the column, and the 3×3 box containing the cell.",
        hint: "Sudoku rules apply to all three regions.",
      },
      {
        prompt: "After placing a digit and recursing, the deeper call returns false. What do we do with the current cell?",
        answer: "Reset it to '.' and try the next digit.",
        hint: "Backtrack means undoing the tentative placement.",
      },
      {
        prompt: "When does the recursion stop?",
        answer: "When there are no empty cells left, meaning the board is solved.",
        hint: "The base case is an empty-cell search that finds none.",
      },
    ],
    interviewFraming:
      "Sudoku Solver is the go-to example of constraint propagation by backtracking. In interviews it is rarely asked as a full coding problem, but the pattern appears in scheduling, map coloring, and crossword generation. A common optimization question is to pick empty cells with the fewest legal digits first (minimum remaining values) to prune faster.",
  },

  {
    id: "r-10",
    topicId: "recursion",
    title: "Combinations",
    difficulty: "Medium",
    tags: ["backtracking"],
    problem:
      "Given two integers `n` and `k`, return all possible combinations of `k` numbers out of the range [1, n]. You may return the answer in any order.",
    constraints: [
      "1 <= n <= 20",
      "1 <= k <= n",
    ],
    approach:
      "Build each combination in strictly increasing order. Recurse with a `start` value: for each candidate from `start` to `n`, add it to the current list, recurse with `start + 1`, then remove it. Stop and record when the current list reaches length `k`. This ordering prevents the same combination from appearing in multiple permutations.",
    dryRun: [
      "n = 4, k = 2",
      "Start at 1: take 1, then choose next from [2, 3, 4] → [1,2], [1,3], [1,4]",
      "Start at 2: take 2, choose next from [3, 4] → [2,3], [2,4]",
      "Start at 3: take 3, choose next from [4] → [3,4]",
      "Return [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]].",
    ],
    solution: `function combine(n, k) {
  const out = [], cur = [];
  const bt = (start) => {
    if (cur.length === k) {
      out.push([...cur]);
      return;
    }
    for (let i = start; i <= n; i++) {
      cur.push(i);
      bt(i + 1);
      cur.pop();
    }
  };
  bt(1);
  return out;
}`,
    timeComplexity: "O(k · C(n, k))",
    spaceComplexity: "O(k) excluding output",
    sampleInput: [
      { label: "n", value: "4" },
      { label: "k", value: "2" },
      {
        label: "expected",
        value: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]",
      },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to list every subset of [1, n] and keep those of size k. The insight is to build each combination in sorted order by always choosing the next number from a later position; this prevents duplicates and lets us stop early when not enough numbers remain. It is like picking a committee of k from n people lined up — once you skip someone, you never reach back to ask them again.",
    pitfalls: [
      {
        label: "Not increasing the start index",
        body: "If you recurse with the same `start`, the same number can be picked repeatedly and combinations can appear in different orders. Use `i + 1` to enforce increasing order.",
      },
      {
        label: "Pushing `cur` by reference into `out`",
        body: "Always store `[...cur]`. The shared array is mutated during backtracking.",
      },
      {
        label: "Recording at the wrong depth",
        body: "Only record when `cur.length === k`. Stopping earlier or later produces wrong-sized combinations.",
      },
      {
        label: "Iterating past `n` or stopping before `n`",
        body: "The loop must be inclusive of `n` because the range is [1, n]. Write `i <= n`, not `i < n`.",
      },
      {
        label: "Allowing out-of-order combinations",
        body: "The start index is what guarantees each combination is built in increasing order. Do not sort or shuffle the result afterward; enforce order during recursion.",
      },
    ],
    complexityReasoning:
      "There are C(n, k) valid combinations, and we spend O(k) time to copy each one into the output, giving O(k · C(n, k)) total time. The recursion depth never exceeds k, and the current list holds at most k numbers, so the auxiliary space excluding output is O(k).",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "n = 4, k = 3. After choosing 2 as the first number, what is the latest second number we can still choose?",
        answer: "3, because we need one more number after it (4).",
        hint: "We need enough remaining numbers to reach size k.",
      },
      {
        prompt: "Why do we recurse with `i + 1` rather than `i`?",
        answer: "Because each number can be used at most once and the combination must stay in increasing order.",
        hint: "Combinations are unordered sets; order is enforced by the start index.",
      },
      {
        prompt: "When do we record a combination?",
        answer: "When `cur.length === k`.",
        hint: "That means the committee is fully selected.",
      },
    ],
    interviewFraming:
      "Combinations is the cleanest template for choose-k-out-of-n backtracking. Interviewers often layer constraints on top: each chosen number must satisfy a predicate, or the combination must sum to a target. The same start-index technique prevents duplicates in Combination Sum II and similar problems.",
  },

  {
    id: "r-11",
    topicId: "recursion",
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    tags: ["backtracking", "dp"],
    problem:
      "Given a string `s`, partition `s` so that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.",
    constraints: [
      "1 <= s.length <= 16",
      "`s` contains lowercase English letters only.",
    ],
    approach:
      "From the current position `start`, try every ending position `end`. If the substring `s.slice(start, end + 1)` is a palindrome, add it to the current partition and recurse from `end + 1`. When `start` reaches the end of the string, store a copy of the partition. A small two-pointer helper checks whether a substring is a palindrome.",
    dryRun: [
      "s = 'aab'",
      "start = 0: substring 'a' is a palindrome → recurse start = 1 with ['a']",
      "  start = 1: 'a' is a palindrome → recurse start = 2 with ['a','a']",
      "    start = 2: 'b' is a palindrome → start = 3 → record ['a','a','b']",
      "  start = 1: 'ab' is not a palindrome → skip",
      "Backtrack to start = 0: 'aa' is a palindrome → recurse start = 2 with ['aa']",
      "  start = 2: 'b' is a palindrome → record ['aa','b']",
      "Return [['a','a','b'], ['aa','b']].",
    ],
    solution: `function partition(s) {
  const out = [], cur = [];
  const isPal = (l, r) => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++;
      r--;
    }
    return true;
  };

  const bt = (start) => {
    if (start === s.length) {
      out.push([...cur]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (!isPal(start, end)) continue;
      cur.push(s.slice(start, end + 1));
      bt(end + 1);
      cur.pop();
    }
  };

  bt(0);
  return out;
}`,
    timeComplexity: "O(n · 2ⁿ)",
    spaceComplexity: "O(n²)",
    sampleInput: [
      { label: "s", value: '"aab"' },
      { label: "expected", value: "[['a','a','b'], ['aa','b']]" },
    ],
    buildTrace: () => [
      {
        description: "Animation coming soon — this question is in the stub list.",
        variables: {},
        codeLine: 1,
      },
    ],

    // ─── Phase 2 learning stations ────────────────────────────────────────────
    intuition:
      "The brute-force move is to cut the string at every possible position and check each piece. The insight is to extend the current piece one character at a time; if it forms a palindrome, commit it and recursively partition the rest. It is like slicing a loaf only at spots where the slice itself reads the same forwards and backwards.",
    pitfalls: [
      {
        label: "Treating every substring as a palindrome",
        body: "Always verify with a helper before adding a substring to the current partition. 'ab' is not a palindrome.",
      },
      {
        label: "Forgetting to pop before trying a longer end",
        body: "After `cur.push(...)` and `bt(end + 1)`, call `cur.pop()` before the loop moves to `end + 1`. Otherwise longer substrings start from the wrong prefix.",
      },
      {
        label: "Missing single-character palindromes",
        body: "A single letter is always a palindrome. The loop starts at `end = start`, so the one-character case is covered.",
      },
      {
        label: "Pushing `cur` by reference into `out`",
        body: "Use `[...cur]` at the base case so each recorded partition is independent.",
      },
      {
        label: "Recomputing palindrome checks from scratch",
        body: "The two-pointer helper is fine for the constraints, but for larger strings you can precompute a palindrome table with dynamic programming.",
      },
    ],
    complexityReasoning:
      "At each position we can either cut or extend the current piece, leading to at most 2^n partition decisions in the worst case. Checking a candidate substring for palindrome costs O(length) with the two-pointer helper, giving O(n·2^n) total time. Precomputing a palindrome table reduces the check to O(1) but does not reduce the number of partitions we must output. The recursion depth is at most n and the current partition holds at most n strings, so the auxiliary space is O(n²) if you count the stored substrings or O(n) for the stack alone.",
    patternFamily: "DFS / Recursion",
    selfTest: [
      {
        prompt: "s = 'aab', start = 1. Which ending positions give palindromes?",
        answer: "Only end = 1 ('a'). 'ab' is not a palindrome.",
        hint: "Check both ends of each substring.",
      },
      {
        prompt: "After pushing a palindrome substring and recursing, what must we do before the next iteration of `end`?",
        answer: "Pop the substring from `cur`.",
        hint: "Backtrack undoes the last partition piece.",
      },
      {
        prompt: "When do we record a complete partition?",
        answer: "When `start === s.length`, meaning every character has been covered.",
        hint: "The base case is reaching the end of the string.",
      },
    ],
    interviewFraming:
      "Palindrome Partitioning is a classic backtracking problem that also hints at dynamic programming (precomputing palindromes). A common follow-up asks for the minimum number of cuts needed to partition the string into palindromes, which is a DP optimization over the same search space. Be ready to discuss the trade-off between clean recursive checks and an O(n²) palindrome table.",
  },
];

export const QUESTIONS: Question[] = [
  ...STUB_QUESTIONS,
  ...NEW_QUESTIONS,
];
