import type { Question } from "../types";

const buildTracePlaceholder = () => [
  {
    description: "Animation coming soon — this question is in the stub list.",
    variables: {},
    codeLine: 1,
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "gr-1",
    topicId: "greedy",
    title: "Jump Game",
    difficulty: "Medium",
    tags: ["greedy", "array"],
    problem:
      "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.",
    constraints: [
      "1 <= nums.length <= 10⁴",
      "0 <= nums[i] <= 10⁵",
    ],
    approach:
      "Track the farthest index reachable from positions 0..i. If the current index ever moves past `reach`, you are stuck. Otherwise update `reach = max(reach, i + nums[i])`.",
    dryRun: [
      "nums = [2,3,1,1,4]: reach becomes 2 at index 0, then 4 at index 1, so the end is reachable → true.",
      "nums = [3,2,1,0,4]: reach stays 3 through index 3, but index 4 is past reach → false.",
    ],
    solution: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "[2,3,1,1,4]" },
      { label: "expected", value: "true" },
    ],
    intuition:
      "The brute-force way would try every possible jump sequence, which explodes exponentially. The insight is that we do not care about the exact path; we only need to know the farthest index any position seen so far can open up. As long as our current index is inside that frontier, we keep expanding it. Think of it like a flood filling a pool: each step tells you how much farther the water can reach.",
    pitfalls: [
      {
        label: "Confusing index with jump length",
        body: "Update reach with `i + nums[i]`, not just `nums[i]`. The frontier is measured in absolute indices.",
      },
      {
        label: "Forgetting to fail on out-of-frontier",
        body: "If `i > reach` before updating, the current index is unreachable and you can return `false` immediately.",
      },
      {
        label: "Starting reach at nums[0]",
        body: "Initialize `reach = 0`; the first iteration will naturally update it with `0 + nums[0]`.",
      },
      {
        label: "Off-by-one on the final index",
        body: "Reaching the last index means `reach >= nums.length - 1`; the loop naturally handles this.",
      },
    ],
    complexityReasoning:
      "We visit each element once and do O(1) work per element, so the time is linear. We only store a few scalar variables (`reach`, `i`), so the extra space is constant even though the input array itself takes O(n) space.",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "For nums = [1,1,0,1], at which index does the frontier first fall behind the current index?",
        answer: "At index 3: reach becomes 2 after index 1, and 3 > 2, so we return false.",
        hint: "Track reach after each position.",
      },
      {
        prompt: "Why is it safe to update reach with `i + nums[i]` without remembering the path taken?",
        answer: "Because any index up to `reach` is reachable, so the farthest extension from those indices is also reachable.",
        hint: "The greedy invariant is that the frontier is always reachable.",
      },
      {
        prompt: "What is the earliest index where we can decide the last index is reachable?",
        answer: "As soon as `reach >= nums.length - 1` we know the end is reachable, though the algorithm keeps checking feasibility of earlier positions.",
        hint: "The end is inside the frontier.",
      },
    ],
    interviewFraming:
      "Jump Game is a classic warm-up because it tests whether you can spot an invariant instead of searching paths. Interviewers often ask it before a harder greedy problem or as a standalone 15-minute question. Be ready to prove by induction that the frontier is always reachable. Common follow-ups: return the minimum number of jumps (a separate greedy / BFS problem), or the path that achieves it.",
  },
  {
    id: "gr-2",
    topicId: "greedy",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    tags: ["greedy", "heap", "intervals"],
    problem:
      "Given an array of meeting time intervals where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.",
    constraints: [
      "1 <= intervals.length <= 10⁴",
      "0 <= start_i < end_i <= 10⁶",
    ],
    approach:
      "Sort all start times and all end times separately. Sweep through the starts in increasing order: if the current meeting starts before the earliest ending meeting finishes (`start < ends[endPtr]`), we need a new room; otherwise we reuse that room and advance the end pointer.",
    dryRun: [
      "intervals = [[0,30],[5,10],[15,20]]: starts = [0,5,15], ends = [10,20,30]. Room count goes 1, 2, then back to 1 after reusing the room freed at 10 → answer 2.",
      "intervals = [[7,10],[2,4]]: starts = [2,7], ends = [4,10]; room count 1, then 7 >= 4 so reuse → answer 1.",
    ],
    solution: `function minMeetingRooms(iv) {
  const s = iv.map(x => x[0]).sort((a, b) => a - b);
  const e = iv.map(x => x[1]).sort((a, b) => a - b);
  let rooms = 0;
  let end = 0;
  for (const start of s) {
    if (start >= e[end]) {
      end++;
    } else {
      rooms++;
    }
  }
  return rooms;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "[[0,30],[5,10],[15,20]]" },
      { label: "expected", value: "2" },
    ],
    intuition:
      "A brute-force approach would check every pair of meetings for overlap and build a conflict graph, which is too slow. The insight is that we only care about how many meetings are active at any moment, not which meetings collide with which. By ordering starts and ends, we can sweep a timeline: each start opens a room, each end frees a room. It is like counting how many trains are on the track at once.",
    pitfalls: [
      {
        label: "Sorting intervals as pairs",
        body: "Do not sort the original [start, end] pairs as a whole; you need two independent sorted lists of starts and ends.",
      },
      {
        label: "Reusing a room too greedily",
        body: "Only reuse when `start >= e[endPtr]`. Strict `<` means the meetings still overlap and need separate rooms.",
      },
      {
        label: "Forgetting to advance the end pointer when reusing",
        body: "When a room is reused, increment `end` so the next earliest finishing meeting becomes available.",
      },
      {
        label: "Confusing rooms with active count",
        body: "`rooms` tracks how many new rooms had to be opened; at any point the true active count is `rooms + (starts processed - ends processed)`.",
      },
      {
        label: "Off-by-one at equal start/end",
        body: "A meeting starting exactly when another ends can reuse the same room, so use `>=` not `>`.",
      },
    ],
    complexityReasoning:
      "Sorting two lists of size n costs O(n log n). The sweep visits each start once, doing O(1) work. The two sorted arrays plus the input dominate storage, giving O(n) extra space. If we used a min-heap instead, the asymptotics would be the same.",
    patternFamily: "Heap / Priority Queue",
    selfTest: [
      {
        prompt: "After processing all starts, what does `end` count?",
        answer: "`end` counts how many meetings have finished and freed a room, i.e., how many rooms we were able to reuse.",
        hint: "It tracks the position in the sorted ends array.",
      },
      {
        prompt: "Why can we sort starts and ends independently without losing overlap information?",
        answer: "A meeting's exact partner does not matter; only its start boundary and the current earliest finishing boundary matter for room count.",
        hint: "Think of a timeline sweep.",
      },
      {
        prompt: "For intervals [[1,5],[2,6],[8,10]], what is the maximum active meetings during the sweep?",
        answer: "2, between times 2 and 5, so the answer is 2.",
        hint: "Walk the sorted starts.",
      },
    ],
    interviewFraming:
      "Meeting Rooms II is the standard introduction to sweep-line / interval scheduling. It is common in phone screens and onsite rounds for companies like Amazon, Google, and Microsoft. Expect follow-ups: return the actual room schedules, handle streaming intervals, or merge with a calendar API. Mention the heap alternative and why two sorted arrays give the same complexity.",
  },
  {
    id: "gr-3",
    topicId: "greedy",
    title: "Gas Station",
    difficulty: "Medium",
    tags: ["greedy"],
    problem:
      "There are `n` gas stations along a circular route. `gas[i]` is the amount of gas at station `i`, and `cost[i]` is the cost to travel from station `i` to `i + 1`. Return the starting gas station's index if you can complete the circuit once, otherwise `-1`. If it exists, it is guaranteed to be unique.",
    constraints: [
      "n == gas.length == cost.length",
      "1 <= n <= 10⁵",
      "0 <= gas[i], cost[i] <= 10⁴",
    ],
    approach:
      "If the total gas in the circuit is less than the total cost, no start works. Otherwise, sweep once: keep a running tank. Whenever the tank drops below zero, the segment from the current start to `i` cannot be a valid prefix, so the next candidate start becomes `i + 1` and the tank resets to zero. The unique valid start is the final candidate.",
    dryRun: [
      "gas = [1,2,3,4,5], cost = [3,4,5,1,2]: total = 0, so a solution exists. The running tank dips below 0 at indices 0, 1, and 2, moving `start` to 3; from station 3 the tank stays non-negative and wraps around → answer 3.",
      "gas = [2,3,4], cost = [3,4,3]: total = -1, so answer is -1.",
    ],
    solution: `function canCompleteCircuit(gas, cost) {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total < 0 ? -1 : start;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]" },
      { label: "expected", value: "3" },
    ],
    intuition:
      "Trying every station as a start would be O(n²). The trick is to notice that if you run out of gas between stations a and b, every station in that range is a bad start: if you could not even make it from a, starting later inside the failing segment only gives you less gas at the beginning. So you can skip the whole failed segment and restart at b + 1. It is like a board game where landing on a losing stretch means you should not start anywhere inside that stretch.",
    pitfalls: [
      {
        label: "Skipping the total-gas check",
        body: "If `total < 0`, return -1 immediately; no single start can overcome a circuit-wide deficit.",
      },
      {
        label: "Resetting start when tank is exactly zero",
        body: "Only reset when `tank < 0`; a tank of zero means the current start is still viable at the boundary.",
      },
      {
        label: "Forgetting to reset tank",
        body: "Set `tank = 0` after moving `start` to `i + 1`; leftover negative gas belongs to the abandoned segment.",
      },
      {
        label: "Returning start without checking total",
        body: "Even if tank never drops below zero during the sweep, a negative total proves the circuit impossible.",
      },
      {
        label: "Confusing index wrap",
        body: "The algorithm does not literally drive around twice; the linear proof guarantees the candidate works for the circular continuation.",
      },
    ],
    complexityReasoning:
      "One pass over the arrays does constant work per station, so time is O(n). Only three scalar variables are stored regardless of input size, so extra space is O(1). The input arrays themselves occupy O(n) space.",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "If the running tank becomes negative at index 4, where is the next candidate start?",
        answer: "Index 5, and the tank resets to 0.",
        hint: "We skip the failing prefix entirely.",
      },
      {
        prompt: "Why is it valid to jump from a failing index i to i + 1 as the new start?",
        answer: "Any station inside the failed segment starts with less or equal gas than the original start and reaches the same failure point, so it cannot be valid.",
        hint: "Prove by induction on the segment.",
      },
      {
        prompt: "What two conditions guarantee that the returned start completes the circuit?",
        answer: "Total gas minus total cost is non-negative, and the tank never drops below zero after the chosen start.",
        hint: "The first condition is global feasibility, the second is local feasibility.",
      },
    ],
    interviewFraming:
      "Gas Station is a favorite for testing proof skills around greedy skipping. Interviewers often push back: 'Why can you skip the whole segment?' Be ready with the invariant argument. Follow-ups include finding all valid starting points when the total is sufficient, or extending to multiple laps and variable costs.",
  },
  {
    id: "gr-4",
    topicId: "greedy",
    title: "Hand of Straights",
    difficulty: "Medium",
    tags: ["greedy", "hashmap"],
    problem:
      "Alice has some number of cards and wants to rearrange them into groups of size `W` so that each group is `W` consecutive integers. Given an integer array `hand` and an integer `W`, return `true` if she can.",
    constraints: [
      "1 <= hand.length <= 10⁴",
      "0 <= hand[i] <= 10⁹",
      "1 <= W <= hand.length",
    ],
    approach:
      "If `hand.length` is not divisible by `W`, it is impossible. Sort the cards, then repeatedly take the smallest remaining card `x` and try to consume one copy each of `x, x+1, ..., x+W-1`. A frequency map lets us check availability and decrement counts in O(1).",
    dryRun: [
      "hand = [1,2,3,6,2,3,4,7,8], W = 3: sorted [1,2,2,3,3,4,6,7,8]. Group 1 starts at 1: needs 1,2,3; group 2 starts at 2: needs 2,3,4; group 3 starts at 6: needs 6,7,8. All counts sufficient → true.",
      "hand = [1,2,3,4,5], W = 4: length is not divisible by 4 → false.",
    ],
    solution: `function isNStraightHand(hand, W) {
  if (hand.length % W !== 0) return false;
  hand.sort((a, b) => a - b);
  const count = new Map();
  for (const x of hand) {
    count.set(x, (count.get(x) || 0) + 1);
  }
  for (const x of hand) {
    if (count.get(x) === 0) continue;
    for (let i = 0; i < W; i++) {
      const k = x + i;
      if ((count.get(k) || 0) <= 0) return false;
      count.set(k, count.get(k) - 1);
    }
  }
  return true;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "hand = [1,2,3,6,2,3,4,7,8], W = 3" },
      { label: "expected", value: "true" },
    ],
    intuition:
      "The brute-force way would try every possible grouping, which factorially explodes. The greedy insight is that the smallest unused card has no choice: it must be the beginning of a straight. Once we lock that first card, the rest of the straight is forced to be the next W - 1 consecutive integers. It is like organizing numbered tiles into runs; the lowest tile must start a run, or it will be left orphan.",
    pitfalls: [
      {
        label: "Forgetting the divisibility check",
        body: "If `hand.length % W !== 0`, return false before doing any heavy work.",
      },
      {
        label: "Skipping exhausted cards",
        body: "When iterating sorted cards, `continue` if the frequency of the current card is already zero; it has been used in an earlier group.",
      },
      {
        label: "Allowing negative counts",
        body: "Decrement only after confirming the needed card still has a positive count; otherwise the grouping fails.",
      },
      {
        label: "Sorting as strings",
        body: "Use numeric sort `(a, b) => a - b`; default string sort breaks multi-digit card values.",
      },
      {
        label: "Starting a group from a non-minimum card",
        body: "The greedy choice only works if we always begin the next straight from the smallest remaining card.",
      },
    ],
    complexityReasoning:
      "Sorting the n cards costs O(n log n). We then make one pass through them and, for each unused card, scan at most W consecutive values and update a hash map in O(1) per update. Because every card is decremented at most once, the inner work totals O(n). The map stores at most n distinct cards, so space is O(n).",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "For hand = [1,2,3,2,3,4] and W = 3, which card must start the first straight?",
        answer: "1, because it is the smallest remaining card and a straight of size 3 must include 1, 2, and 3.",
        hint: "The smallest card cannot be placed anywhere except as the first card of a group.",
      },
      {
        prompt: "Why do we need a frequency map instead of removing from an array?",
        answer: "We need O(1) lookups and decrements for arbitrary card values; removing from a sorted array would be O(n) per operation.",
        hint: "Think about the inner loop over x..x+W-1.",
      },
      {
        prompt: "What happens after we form a straight starting at x?",
        answer: "We decrement the counts of x, x+1, ..., x+W-1 by one and continue to the next smallest card with a positive count.",
        hint: "The map tracks remaining cards.",
      },
    ],
    interviewFraming:
      "Hand of Straights tests whether you can reduce a combinatorial grouping problem to a greedy frequency-count. It appears in onsite loops where interviewers want clean code with a hash map. Be ready to discuss why the smallest-card-first choice is safe. Common follow-ups: return the actual groups, allow wrapping straights, or handle duplicate counts efficiently with a TreeMap / SortedDict.",
  },
  {
    id: "gr-5",
    topicId: "greedy",
    title: "Partition Labels",
    difficulty: "Medium",
    tags: ["greedy", "string"],
    problem:
      "You are given a string `s`. We want to partition this string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.",
    constraints: [
      "1 <= s.length <= 500",
      "s consists of lowercase English letters.",
    ],
    approach:
      "First record the last occurrence of every character. Then sweep left to right, maintaining the end of the current partition. Expand that end whenever we see a character whose last occurrence is farther. When the sweep index reaches the current end, we close the partition and start a fresh one.",
    dryRun: [
      "s = \"ababcbacadefegdehijhklij\": last positions are a=8, b=5, c=7, d=14, e=15, f=11, g=13, h=19, i=22, j=23, k=18, l=21. Partition 0..8 has size 9; 9..15 has size 7; 16..23 has size 8 → [9,7,8].",
    ],
    solution: `function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) {
    last[s[i]] = i;
  }
  const out = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) {
      out.push(end - start + 1);
      start = i + 1;
    }
  }
  return out;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: `"ababcbacadefegdehijhklij"` },
      { label: "expected", value: "[9,7,8]" },
    ],
    intuition:
      "A naive approach tries every possible split and checks whether characters leak across pieces, which is exponential. The key observation is that a character defines a hard boundary: its last occurrence must be inside the same partition as its first occurrence. So each partition's end is the furthest last-occurrence among the characters we have seen so far. Once our sweep hits that furthest boundary, we can safely cut. Imagine coloring a rope: every color must stay inside one segment, so the segment must stretch at least to the farthest spot that color appears.",
    pitfalls: [
      {
        label: "Building partitions by first occurrence instead of last",
        body: "Use the last index of each character; the partition must cover every appearance of every character it contains.",
      },
      {
        label: "Updating end after checking for closure",
        body: "Update `end = max(end, last[s[i]])` before checking `i === end`; otherwise a far-away character is missed.",
      },
      {
        label: "Forgetting to reset start",
        body: "After closing a partition, set `start = i + 1` so the next size is measured from the correct origin.",
      },
      {
        label: "Using an array for last positions",
        body: "A map or object works for any character set; for lowercase letters an array of size 26 also works if indexed correctly.",
      },
      {
        label: "Off-by-one in size",
        body: "Size is `end - start + 1` because both ends are inclusive.",
      },
    ],
    complexityReasoning:
      "Two linear passes over the string give O(n) time. The last-occurrence map holds at most the size of the alphabet, which is a constant for lowercase English letters, so the auxiliary space is O(1). For arbitrary Unicode the map size is O(k) where k is the distinct characters, still bounded by n.",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "For s = \"abac\", what is the size of the first partition?",
        answer: "3, because 'a' last appears at index 2 and the partition must include indices 0..2.",
        hint: "Record last positions first.",
      },
      {
        prompt: "Why must each partition include the last occurrence of every character it contains?",
        answer: "The rule says each letter appears in at most one part, so all occurrences of that letter must be inside the same partition.",
        hint: "Reread the problem constraint.",
      },
      {
        prompt: "When do we close the current partition?",
        answer: "When the current index i equals the furthest last-occurrence end reached so far.",
        hint: "The boundary has caught up with the sweep.",
      },
    ],
    interviewFraming:
      "Partition Labels is a concise greedy problem that checks whether you can derive a boundary from character ranges. It is popular in Amazon and Meta phone screens. Interviewers may ask you to also return the actual substrings, or to solve it in one pass with a running max. Be ready to explain why the greedy boundary is optimal: you cut as soon as no character in the current window reappears later.",
  },
  {
    id: "gr-6",
    topicId: "greedy",
    title: "Assign Cookies",
    difficulty: "Easy",
    tags: ["greedy", "sorting"],
    problem:
      "Assume you are a great parent and want to give your children some cookies. Each child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that will satisfy the child. Each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, the child is content. Maximize the number of content children.",
    constraints: [
      "1 <= g.length <= 3 * 10⁴",
      "1 <= s.length <= 3 * 10⁴",
      "1 <= g[i], s[j] <= 2³¹ - 1",
    ],
    approach:
      "Sort both arrays. Use two pointers: try to satisfy the least greedy child with the smallest cookie that fits. If the current cookie is big enough, assign it and advance both pointers; otherwise discard the cookie and advance the cookie pointer.",
    dryRun: [
      "g = [1,2,3], s = [1,1]: child 1 gets the first cookie, child 2 needs a cookie of size 2 but only a size-1 cookie remains → 1 child content.",
      "g = [1,2], s = [1,2,3]: child 1 gets cookie 1, child 2 gets cookie 2 → 2 children content.",
    ],
    solution: `function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0;
  let j = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) {
      i++;
    }
    j++;
  }
  return i;
}`,
    timeComplexity: "O(n log n + m log m)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "g = [1,2,3], s = [1,1]" },
      { label: "expected", value: "1" },
    ],
    intuition:
      "The brute force would try every assignment permutation, which is huge. The greedy insight is to feed the least demanding child first with the smallest cookie that satisfies them, leaving larger cookies for greedier children. It is like handing out umbrellas: give the smallest person the smallest umbrella that still covers them, so the big ones stay for the tall people.",
    pitfalls: [
      {
        label: "Assigning the largest cookie first",
        body: "That can waste a big cookie on a small child and leave a greedy child unsatisfied.",
      },
      {
        label: "Only advancing the cookie pointer on a match",
        body: "Always advance j each loop; otherwise you reassign the same cookie.",
      },
      {
        label: "Forgetting to sort",
        body: "The greedy order only works after both arrays are sorted.",
      },
      {
        label: "Returning the cookie count instead of child count",
        body: "Return `i`, the number of satisfied children, not `j`.",
      },
      {
        label: "Strict comparison",
        body: "Use `>=`; a cookie equal to the greed factor is sufficient.",
      },
    ],
    complexityReasoning:
      "Sorting the greed and cookie arrays costs O(n log n + m log m). The two-pointer scan moves each pointer at most the length of its array, so the rest is O(n + m). We only use a few extra variables, so auxiliary space is O(1).",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "Why satisfy the least greedy child first rather than the most greedy?",
        answer: "Because a small cookie might be enough for the least greedy child, preserving larger cookies for children who need them.",
        hint: "Think about not wasting resources.",
      },
      {
        prompt: "What do we do when s[j] < g[i]?",
        answer: "Discard the current cookie by advancing j; it is too small for this and every future child.",
        hint: "The children only get greedier as i moves forward.",
      },
      {
        prompt: "For g = [1,2,3] and s = [1,2], how many children are content?",
        answer: "2: cookie 1 to child 1, cookie 2 to child 2; child 3 gets nothing.",
        hint: "Sort both arrays and walk the pointers.",
      },
    ],
    interviewFraming:
      "Assign Cookies is a gentle introduction to resource allocation greed. It appears in early-round interviews to verify you can reason about sorting plus a two-pointer scan. Follow-ups: what if cookies and children arrive online (streaming), or minimize total wasted cookie size. Mention the exchange argument: swapping an assignment never hurts when the smallest sufficient cookie is used.",
  },
  {
    id: "gr-7",
    topicId: "greedy",
    title: "Lemonade Change",
    difficulty: "Easy",
    tags: ["greedy"],
    problem:
      "At a lemonade stand, each lemonade costs $5. Customers are standing in a queue to buy from you, and order one at a time. Each customer will only buy one lemonade and pay with a $5, $10, or $20 bill. You must provide the correct change to each customer so that the net transaction is $5. Return `true` if you can provide correct change for every customer, or `false` otherwise.",
    constraints: [
      "1 <= bills.length <= 10⁵",
      "bills[i] is one of 5, 10, or 20",
    ],
    approach:
      "Keep counts of $5 and $10 bills. For each $5, no change. For $10, give one $5. For $20, prefer giving one $10 + one $5 over three $5s; only if that is impossible use three $5s.",
    dryRun: [
      "bills = [5,5,5,10,20]: after the first three $5 bills you have fives=3. The $10 uses one $5, leaving fives=2, tens=1. The $20 uses the $10 + one $5, leaving fives=1, tens=0 → true.",
      "bills = [5,5,10,10,20]: after two $5 bills fives=2. First $10 → fives=1, tens=1. Second $10 → fives=0, tens=2. The $20 needs $15 but there are no $5 bills → false.",
    ],
    solution: `function lemonadeChange(bills) {
  let fives = 0;
  let tens = 0;
  for (const bill of bills) {
    if (bill === 5) {
      fives++;
    } else if (bill === 10) {
      if (fives === 0) return false;
      fives--;
      tens++;
    } else {
      if (tens > 0 && fives > 0) {
        tens--;
        fives--;
      } else if (fives >= 3) {
        fives -= 3;
      } else {
        return false;
      }
    }
  }
  return true;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "bills = [5,5,5,10,20]" },
      { label: "expected", value: "true" },
    ],
    intuition:
      "Brute force would simulate every way to make change for each customer, which grows exponentially. The greedy idea is that larger bills are less flexible: a $10 can only break a $20, while a $5 can break both $10 and $20. So we always spend $10s before $5s when making change for $20, hoarding the more useful $5s. It is like saving small coins because they fit more vending machines.",
    pitfalls: [
      {
        label: "Giving three $5s before using a $10 for $20",
        body: "That wastes scarce $5s; prefer $10 + $5 if both are available.",
      },
      {
        label: "Forgetting $10 has no other use",
        body: "A $10 bill is only useful as part of $20 change; do not treat it like a $5.",
      },
      {
        label: "Returning false on $10 with no fives",
        body: "A $10 bill requires $5 change; immediately return false if fives is zero.",
      },
      {
        label: "Modifying counts in the wrong order",
        body: "First receive the customer's bill, then deduct change; do not deduct before counting the new bill.",
      },
      {
        label: "Missing the $20 three-fives fallback",
        body: "If no $10 is available, you can still make $15 with three $5 bills if you have enough.",
      },
    ],
    complexityReasoning:
      "We process each customer once and update a few counters, so time is O(n). We only store two integer counts, giving O(1) extra space regardless of the queue length.",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "A customer pays $20 and you have one $10 and one $5. What change should you give?",
        answer: "One $10 and one $5, because it preserves more flexible $5 bills.",
        hint: "Always spend larger bills first.",
      },
      {
        prompt: "Why is a $5 more valuable than a $10 in this problem?",
        answer: "A $5 can be used as change for both $10 and $20 payments, while a $10 can only help with $20 payments.",
        hint: "Count the ways each bill can be used.",
      },
      {
        prompt: "For bills = [5,10,5,20,5,10,10,20], can you make it through?",
        answer: "Yes: you accumulate enough $5 and $10 bills to cover the $20 bills.",
        hint: "Track fives and tens after each bill.",
      },
    ],
    interviewFraming:
      "Lemonade Change is a small but precise greedy problem about resource conservation; it tests whether you can identify which bills are more 'valuable' due to flexibility. It is common in phone screens and as a warm-up. Follow-ups: generalize to arbitrary bill denominations, minimize the number of bills kept on hand, or handle customers who can pay exact change only.",
  },
  {
    id: "gr-8",
    topicId: "greedy",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    tags: ["greedy", "intervals", "sorting"],
    problem:
      "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    constraints: [
      "1 <= intervals.length <= 10⁵",
      "intervals[i].length == 2",
      "0 <= start_i < end_i <= 10⁵",
    ],
    approach:
      "Sort intervals by end time. Sweep and keep track of the end time of the last kept interval. If the current interval starts before that end, it overlaps and must be removed; otherwise keep it and update `end`. Minimizing end leaves room for later intervals.",
    dryRun: [
      "intervals = [[1,2],[2,3],[3,4],[1,3]]: sorted by end = [[1,2],[2,3],[1,3],[3,4]]. Keep [1,2], end=2. [2,3] starts at 2 >= end, keep, end=3. [1,3] starts at 1 < 3, remove (count=1). [3,4] starts at 3 >= 3, keep. Answer 1.",
      "intervals = [[1,2],[1,2],[1,2]]: keep the first, remove the other two → answer 2.",
    ],
    solution: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let prevEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= prevEnd) {
      prevEnd = end;
    } else {
      removed++;
    }
  }
  return removed;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "[[1,2],[2,3],[3,4],[1,3]]" },
      { label: "expected", value: "1" },
    ],
    intuition:
      "Trying every subset of intervals to find the largest non-overlapping set is exponential. The greedy insight is to prefer intervals that finish early, because an early finish leaves more room for whatever comes next. Sort by end time and greedily keep the interval if it does not conflict with the last kept one. It is like booking meeting rooms: the meeting that ends soonest lets the next person start sooner.",
    pitfalls: [
      {
        label: "Sorting by start time",
        body: "Sorting by end time is what makes the greedy choice safe; start-time sorting can leave you stuck with a long interval.",
      },
      {
        label: "Using strict > instead of >= for start",
        body: "Intervals that touch at an endpoint are not overlapping, so `start >= prevEnd` is correct.",
      },
      {
        label: "Forgetting to update prevEnd on keep",
        body: "When you keep an interval, update `prevEnd` to its end time; otherwise the next comparison is wrong.",
      },
      {
        label: "Counting kept intervals instead of removed",
        body: "The question asks for removals; either increment `removed` directly or compute `n - kept`.",
      },
      {
        label: "Mutating the input unexpectedly",
        body: "Sorting mutates the input array; either copy it or note that the original is being rearranged.",
      },
    ],
    complexityReasoning:
      "Sorting the n intervals by end time dominates at O(n log n). The sweep visits each interval once with O(1) work. We store only `removed` and `prevEnd`, so auxiliary space is O(1).",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "Why do we sort by end time and not by start time?",
        answer: "An interval that ends early leaves more room for later intervals, so it is more likely to lead to the maximum number of kept intervals.",
        hint: "Think about which interval frees up the timeline fastest.",
      },
      {
        prompt: "For intervals [[1,3],[2,4],[3,5]], which interval is removed by the greedy algorithm?",
        answer: "[2,4], because [1,3] is kept first and [2,4] starts before its end; [3,5] then fits after [1,3].",
        hint: "Sort by end and sweep.",
      },
      {
        prompt: "Are [1,3] and [3,5] considered overlapping?",
        answer: "No, because [3,5] starts at 3, which is equal to the end of [1,3]; use >= to allow touching intervals.",
        hint: "The condition is `start >= prevEnd`.",
      },
    ],
    interviewFraming:
      "Non-overlapping Intervals is the canonical interval-scheduling greedy proof. Interviewers love asking for the proof: why is the earliest-ending interval safe to keep? Be ready with the exchange argument. Follow-ups: return the actual set of kept intervals, solve the weighted version (DP), or combine with Meeting Rooms II to maximize bookings.",
  },
  {
    id: "gr-9",
    topicId: "greedy",
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    tags: ["greedy", "intervals", "sorting"],
    problem:
      "There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array `points` where `points[i] = [xstart, xend]` denotes a balloon whose horizontal diameter stretches between `xstart` and `xend`. You do not know the exact y-coordinates. Arrows can be shot up directly vertically from different points along the x-axis. An arrow shot at x will burst any balloon with `xstart <= x <= xend`. Return the minimum number of arrows that must be shot to burst all balloons.",
    constraints: [
      "1 <= points.length <= 10⁵",
      "points[i].length == 2",
      "-2³¹ <= xstart < xend <= 2³¹ - 1",
    ],
    approach:
      "Sort balloons by end coordinate. Shoot an arrow at the end of the first balloon; it bursts every balloon whose start is <= that arrow position. When a balloon starts after the current arrow position, shoot a new arrow at its end and repeat.",
    dryRun: [
      "points = [[10,16],[2,8],[1,6],[7,12]]: sorted by end = [[1,6],[2,8],[7,12],[10,16]]. Arrow at 6 bursts [1,6] and [2,8]; [7,12] starts after 6, so new arrow at 12 bursts [7,12] and [10,16]. Answer 2.",
      "points = [[1,2],[3,4],[5,6],[7,8]]: no overlaps, 4 arrows.",
    ],
    solution: `function findMinArrowShots(points) {
  if (points.length === 0) return 0;
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let pos = points[0][1];
  for (let i = 1; i < points.length; i++) {
    if (points[i][0] > pos) {
      arrows++;
      pos = points[i][1];
    }
  }
  return arrows;
}`,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "[[10,16],[2,8],[1,6],[7,12]]" },
      { label: "expected", value: "2" },
    ],
    intuition:
      "The brute force would try every arrow position, but the geometry gives us a greedy shortcut. If we sort balloons by their right edge, shooting the arrow exactly at that right edge is the safest choice: it bursts every balloon that currently overlaps and is as far right as possible, so it can also catch balloons that extend just past this point. When a balloon starts to the right of our arrow, no previous arrow can hit it, so we must shoot again. It is like spraying paint: aim at the rightmost edge of the current cluster to cover as much as you can.",
    pitfalls: [
      {
        label: "Sorting by start coordinate",
        body: "Sorting by end coordinate lets the greedy arrow position cover the maximum future overlap.",
      },
      {
        label: "Using >= instead of > when checking start",
        body: "A balloon with `start === pos` is still burst by the arrow at `pos`; only a strictly greater start needs a new arrow.",
      },
      {
        label: "Forgetting the empty input",
        body: "Return 0 when there are no balloons.",
      },
      {
        label: "Shooting at the start instead of the end",
        body: "An arrow at the start of a cluster may miss balloons whose right edge is before it; the right edge is guaranteed to be inside all overlapping balloons in the sorted cluster.",
      },
      {
        label: "Mutating the input without copying",
        body: "The sort rearranges the input; note that or clone the array first.",
      },
    ],
    complexityReasoning:
      "Sorting by end coordinate costs O(n log n). A single linear scan then decides whether each balloon needs a new arrow, so the remaining time is O(n). We only store `arrows` and `pos`, giving O(1) auxiliary space.",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "Why is the right edge of the first balloon a good first arrow position?",
        answer: "Because any arrow that bursts the first balloon must be within its range, and choosing the rightmost point keeps the arrow as far right as possible to catch overlapping balloons.",
        hint: "Sort by end and think about coverage.",
      },
      {
        prompt: "For [[1,2],[2,3],[3,4]], how many arrows are needed?",
        answer: "3; the intervals only touch at endpoints, and an arrow at 2 cannot burst [3,4], so each needs its own arrow.",
        hint: "Check `start > pos`, not >=.",
      },
      {
        prompt: "When do we increment the arrow count?",
        answer: "When the current balloon's start is strictly greater than the position of the last arrow.",
        hint: "The arrow at pos bursts balloons with start <= pos.",
      },
    ],
    interviewFraming:
      "Burst Balloons is a disguised interval-greedy problem. Interviewers often present it as geometry to see if you recognize the scheduling pattern. Be ready to argue why aiming at the right edge is optimal. Follow-ups: balloons in 2D (rectangles), arrows with limited range, or maximum balloons burst by k arrows become NP-hard variants.",
  },
  {
    id: "gr-10",
    topicId: "greedy",
    title: "Candy",
    difficulty: "Hard",
    tags: ["greedy", "array"],
    problem:
      "There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`. You are giving candies to these children subject to the following requirements: each child must have at least one candy, and children with a higher rating get more candies than their neighbors. Return the minimum number of candies you need to have to distribute the candies to the children.",
    constraints: [
      "n == ratings.length",
      "1 <= n <= 2 * 10⁴",
      "0 <= ratings[i] <= 2 * 10⁴",
    ],
    approach:
      "Use two passes. Left-to-right: if `ratings[i] > ratings[i-1]`, give one more candy than the left neighbor. Right-to-left: if `ratings[i] > ratings[i+1]`, give at least one more than the right neighbor. Each child gets the maximum of the two required values.",
    dryRun: [
      "ratings = [1,0,2]: left pass gives [1,1,2]; right pass raises child 0 above child 1, so final candies are [2,1,2] and the total is 5.",
      "ratings = [1,2,2]: left pass gives [1,2,2]; right pass keeps child 1 at 2 because it must be at least one more than child 2 (2). Final [1,2,2], total 5.",
    ],
    solution: `function candy(ratings) {
  const n = ratings.length;
  const candies = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candies[i] = candies[i - 1] + 1;
    }
  }
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }
  return candies.reduce((a, b) => a + b, 0);
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    buildTrace: buildTracePlaceholder,
    sampleInput: [
      { label: "input", value: "ratings = [1,0,2]" },
      { label: "expected", value: "5" },
    ],
    intuition:
      "A naive approach would try every candy distribution, which is exponential. The problem has two independent local rules: each child must beat the left neighbor and beat the right neighbor. A single left-to-right pass only satisfies one side. The trick is to do two passes and give each child the maximum of the two requirements. It is like setting a fence height on a hill: it must be higher than the neighbor on either side, so you take the taller of the two side constraints.",
    pitfalls: [
      {
        label: "Only doing one pass",
        body: "A single left-to-right pass does not enforce the right-neighbor rule; you need a second right-to-left pass.",
      },
      {
        label: "Overwriting left-pass values",
        body: "Use `Math.max(candies[i], candies[i+1] + 1)` on the right pass to preserve stronger left-side requirements.",
      },
      {
        label: "Forgetting the one-candy baseline",
        body: "Initialize every child with 1 candy before applying any comparisons.",
      },
      {
        label: "Comparing in the wrong direction",
        body: "Left pass checks `ratings[i] > ratings[i-1]`; right pass checks `ratings[i] > ratings[i+1]`.",
      },
      {
        label: "Summing without long integers",
        body: "In languages with fixed ints, total candy can exceed 32-bit for large n; JS numbers handle it, but be aware in typed languages.",
      },
    ],
    complexityReasoning:
      "Two linear passes over the ratings array take O(n) time. We allocate an extra candies array of size n to store the two-pass constraints, giving O(n) auxiliary space. A O(1) space variant exists with peak/valley counting but is harder to get right in an interview.",
    patternFamily: "Greedy",
    selfTest: [
      {
        prompt: "Why do we need a right-to-left pass after the left-to-right pass?",
        answer: "Because a child may be higher rated than the right neighbor, which the left-to-right pass never considered.",
        hint: "Each pass handles one direction.",
      },
      {
        prompt: "For ratings = [1,3,2], what does the right-to-left pass change?",
        answer: "Left pass gives [1,2,1]; right-to-left sees child 1 (rating 3) > child 2 (rating 2), so candies[1] becomes max(2, 1+1) = 2. Final [1,2,1], total 4.",
        hint: "The max already satisfied it.",
      },
      {
        prompt: "What invariant does the final candies array satisfy?",
        answer: "Every child has at least one candy, and any child with a higher rating than a neighbor has more candies than that neighbor.",
        hint: "Both local comparisons hold.",
      },
    ],
    interviewFraming:
      "Candy is a classic two-pass greedy problem that trips up candidates who try to do everything in one sweep. It is common in Google and Meta loops because it tests local-to-global reasoning. Be ready to explain why the max of two passes is optimal. Follow-ups: O(1) space solution using mountain slopes, generalize to circular arrangement, or prove minimality.",
  },
];
