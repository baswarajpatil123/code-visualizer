export const CATEGORIES = [
  {
    id: "subarrays",
    label: "Subarrays & Prefix Sums",
    icon: "Layers",
    color: "#6366f1"
  },
  {
    id: "sorting",
    label: "Sorting Algorithms",
    icon: "ArrowDownUp",
    color: "#10b981"
  },
  {
    id: "trees-graphs",
    label: "Trees & BST",
    icon: "Network",
    color: "#06b6d4"
  },
  {
    id: "dp",
    label: "Dynamic Programming",
    icon: "Grid3X3",
    color: "#ec4899"
  },
  {
    id: "data-structures",
    label: "Core Structures",
    icon: "Box",
    color: "#f59e0b"
  }
];

export const ALGORITHM_CODE_PHASES = {
  "longest-equal-subarray": {
    python: [
      { text: "def findMaxLength(nums):", phase: null },
      { text: "    prefix_map = {0: -1}  # sum → first index", phase: "init" },
      { text: "    running_sum = 0", phase: "init" },
      { text: "    max_len = 0", phase: "init" },
      { text: "    for i, num in enumerate(nums):", phase: "loop" },
      { text: "        running_sum += 1 if num == 1 else -1", phase: "sum" },
      { text: "        if running_sum in prefix_map:", phase: "hit" },
      { text: "            length = i - prefix_map[running_sum]", phase: "hit" },
      { text: "            if length > max_len:", phase: "update" },
      { text: "                max_len = length", phase: "update" },
      { text: "        else:", phase: "miss" },
      { text: "            prefix_map[running_sum] = i", phase: "miss" },
      { text: "    return max_len", phase: "done" }
    ],
    javascript: [
      { text: "function findMaxLength(nums) {", phase: null },
      { text: "  const map = new Map([[0, -1]]);", phase: "init" },
      { text: "  let runningSum = 0, maxLen = 0;", phase: "init" },
      { text: "  for (let i = 0; i < nums.length; i++) {", phase: "loop" },
      { text: "    runningSum += nums[i] === 1 ? 1 : -1;", phase: "sum" },
      { text: "    if (map.has(runningSum)) {", phase: "hit" },
      { text: "      maxLen = Math.max(maxLen, i - map.get(runningSum));", phase: "update" },
      { text: "    } else {", phase: "miss" },
      { text: "      map.set(runningSum, i);", phase: "miss" },
      { text: "    }", phase: null },
      { text: "  }", phase: null },
      { text: "  return maxLen;", phase: "done" },
      { text: "}", phase: null }
    ],
    cpp: [
      { text: "int findMaxLength(vector<int>& nums) {", phase: null },
      { text: "    unordered_map<int, int> prefixMap = {{0, -1}};", phase: "init" },
      { text: "    int runningSum = 0, maxLen = 0;", phase: "init" },
      { text: "    for (int i = 0; i < nums.size(); ++i) {", phase: "loop" },
      { text: "        runningSum += (nums[i] == 1) ? 1 : -1;", phase: "sum" },
      { text: "        if (prefixMap.count(runningSum)) {", phase: "hit" },
      { text: "            maxLen = max(maxLen, i - prefixMap[runningSum]);", phase: "update" },
      { text: "        } else {", phase: "miss" },
      { text: "            prefixMap[runningSum] = i;", phase: "miss" },
      { text: "        }", phase: null },
      { text: "    }", phase: null },
      { text: "    return maxLen;", phase: "done" },
      { text: "}", phase: null }
    ]
  },

  "subarray-sum-k": {
    python: [
      { text: "def subarraySum(nums, k):", phase: null },
      { text: "    count = 0; current_sum = 0", phase: "init" },
      { text: "    prefix_counts = {0: 1}", phase: "init" },
      { text: "    for num in nums:", phase: "loop" },
      { text: "        current_sum += num", phase: "sum" },
      { text: "        target = current_sum - k", phase: "target" },
      { text: "        if target in prefix_counts:", phase: "target" },
      { text: "            count += prefix_counts[target]", phase: "count_update" },
      { text: "        prefix_counts[current_sum] = prefix_counts.get(current_sum, 0) + 1", phase: "map_update" },
      { text: "    return count", phase: "done" }
    ],
    javascript: [
      { text: "function subarraySum(nums, k) {", phase: null },
      { text: "  let count = 0, sum = 0;", phase: "init" },
      { text: "  const map = new Map([[0, 1]]);", phase: "init" },
      { text: "  for (const num of nums) {", phase: "loop" },
      { text: "    sum += num;", phase: "sum" },
      { text: "    if (map.has(sum - k)) {", phase: "target" },
      { text: "      count += map.get(sum - k);", phase: "count_update" },
      { text: "    }", phase: null },
      { text: "    map.set(sum, (map.get(sum) || 0) + 1);", phase: "map_update" },
      { text: "  }", phase: null },
      { text: "  return count;", phase: "done" },
      { text: "}", phase: null }
    ]
  },

  "kadane": {
    python: [
      { text: "def maxSubArray(nums):", phase: null },
      { text: "    cur_sum = max_sum = nums[0]", phase: "init" },
      { text: "    for i in range(1, len(nums)):", phase: "loop" },
      { text: "        # Restart fresh if num is bigger than cur + num", phase: null },
      { text: "        cur_sum = max(nums[i], cur_sum + nums[i])", phase: "restart" },
      { text: "        max_sum = max(max_sum, cur_sum)", phase: "max_update" },
      { text: "    return max_sum", phase: "done" }
    ],
    javascript: [
      { text: "function maxSubArray(nums) {", phase: null },
      { text: "  let cur = nums[0], max = nums[0];", phase: "init" },
      { text: "  for (let i = 1; i < nums.length; i++) {", phase: "loop" },
      { text: "    cur = Math.max(nums[i], cur + nums[i]);", phase: "restart" },
      { text: "    max = Math.max(max, cur);", phase: "max_update" },
      { text: "  }", phase: null },
      { text: "  return max;", phase: "done" },
      { text: "}", phase: null }
    ]
  },

  "merge-sort": {
    python: [
      { text: "def merge_sort(arr):", phase: null },
      { text: "    if len(arr) <= 1: return arr", phase: "divide" },
      { text: "    mid = len(arr) // 2", phase: "divide" },
      { text: "    left = merge_sort(arr[:mid])", phase: "divide" },
      { text: "    right = merge_sort(arr[mid:])", phase: "divide" },
      { text: "    # Merge both sorted halves", phase: "compare" },
      { text: "    while i < len(left) and j < len(right):", phase: "compare" },
      { text: "        if left[i] <= right[j]:", phase: "compare" },
      { text: "            res.append(left[i]); i += 1", phase: "swapping" },
      { text: "        else:", phase: null },
      { text: "            res.append(right[j]); j += 1", phase: "swapping" },
      { text: "    return res + left[i:] + right[j:]", phase: "done" }
    ]
  },

  "quick-sort": {
    python: [
      { text: "def quick_sort(arr, low, high):", phase: null },
      { text: "    if low < high:", phase: null },
      { text: "        pi = partition(arr, low, high)", phase: "pivot" },
      { text: "        quick_sort(arr, low, pi - 1)", phase: null },
      { text: "        quick_sort(arr, pi + 1, high)", phase: null },
      { text: "def partition(arr, low, high):", phase: "pivot" },
      { text: "    pivot = arr[high]", phase: "pivot" },
      { text: "    for j in range(low, high):", phase: "comparing" },
      { text: "        if arr[j] < pivot:", phase: "comparing" },
      { text: "            arr[i], arr[j] = arr[j], arr[i]", phase: "swapping" },
      { text: "    arr[i+1], arr[high] = arr[high], arr[i+1]", phase: "swapping" },
      { text: "    return i + 1", phase: "done" }
    ]
  },

  "bubble-sort": {
    python: [
      { text: "def bubble_sort(arr):", phase: null },
      { text: "    n = len(arr)", phase: "init" },
      { text: "    for i in range(n):", phase: "outer_loop" },
      { text: "        for j in range(0, n - i - 1):", phase: "comparing" },
      { text: "            if arr[j] > arr[j + 1]:", phase: "comparing" },
      { text: "                arr[j], arr[j+1] = arr[j+1], arr[j]", phase: "swapping" },
      { text: "    return arr", phase: "done" }
    ]
  },

  "bst": {
    python: [
      { text: "def insert_bst(root, val):", phase: null },
      { text: "    if not root: return TreeNode(val)", phase: "check_null" },
      { text: "    if val < root.val:", phase: "go_left" },
      { text: "        root.left = insert_bst(root.left, val)", phase: "go_left" },
      { text: "    elif val > root.val:", phase: "go_right" },
      { text: "        root.right = insert_bst(root.right, val)", phase: "go_right" },
      { text: "    return root", phase: "done" },
      { text: "def inorder(root, res):", phase: "visit_node" },
      { text: "    if root:", phase: null },
      { text: "        inorder(root.left, res)", phase: "go_left" },
      { text: "        res.append(root.val)", phase: "visit_node" },
      { text: "        inorder(root.right, res)", phase: "go_right" }
    ]
  },

  "knapsack-01": {
    python: [
      { text: "def knapsack(weights, values, W):", phase: null },
      { text: "    dp = [[0] * (W + 1) for _ in range(n + 1)]", phase: "init" },
      { text: "    for i in range(1, n + 1):", phase: "loop_item" },
      { text: "        for w in range(W + 1):", phase: "loop_cap" },
      { text: "            if weights[i-1] <= w:", phase: "include" },
      { text: "                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])", phase: "include" },
      { text: "            else:", phase: "exclude" },
      { text: "                dp[i][w] = dp[i-1][w]", phase: "exclude" },
      { text: "    return dp[n][W]", phase: "done" }
    ]
  },

  "binary-search": {
    python: [
      { text: "def binary_search(nums, target):", phase: null },
      { text: "    low, high = 0, len(nums) - 1", phase: "init" },
      { text: "    while low <= high:", phase: "loop" },
      { text: "        mid = (low + high) // 2", phase: "mid_calc" },
      { text: "        if nums[mid] == target:", phase: "check_match" },
      { text: "            return mid", phase: "found" },
      { text: "        elif nums[mid] < target:", phase: "too_low" },
      { text: "            low = mid + 1", phase: "too_low" },
      { text: "        else:", phase: "too_high" },
      { text: "            high = mid - 1", phase: "too_high" },
      { text: "    return -1", phase: "not_found" }
    ]
  }
};
