export const CATEGORIES = [
  {
    id: "subarrays",
    label: "Subarrays & Prefix Sums",
    icon: "Layers",
    color: "#6366f1",
    desc: "Prefix running sums, hashmap lookups, Kadane's and sliding windows."
  },
  {
    id: "sorting",
    label: "Sorting Algorithms",
    icon: "ArrowDownUp",
    color: "#10b981",
    desc: "Visual divide-and-conquer, pivot partitions, swaps, and heap building."
  },
  {
    id: "trees-graphs",
    label: "Trees & Graphs",
    icon: "Network",
    color: "#06b6d4",
    desc: "Interactive BST nodes, tree traversals, BFS/DFS, and Dijkstra shortest paths."
  },
  {
    id: "dp",
    label: "Dynamic Programming",
    icon: "Grid3X3",
    color: "#ec4899",
    desc: "2D and 1D DP table lookups, state transitions, Knapsack, LCS, and Coin Change."
  },
  {
    id: "data-structures",
    label: "Core Data Structures",
    icon: "Box",
    color: "#f59e0b",
    desc: "Stack LIFO frames, FIFO queues, Linked List pointer manipulation, and Two Pointers."
  }
];

export const ALGORITHMS = {
  "longest-equal-subarray": {
    id: "longest-equal-subarray",
    categoryId: "subarrays",
    title: "Longest Subarray with Equal 0s and 1s",
    difficulty: "Medium",
    badge: "LeetCode 525",
    summary: "Map 0 to −1 and 1 to +1. When the running sum repeats, the subarray between those two points contains an equal number of zeros and ones.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      python: `def findMaxLength(nums):
    prefix_map = {0: -1}  # sum -> first seen index
    running_sum = 0
    max_len = 0
    best_start, best_end = -1, -1

    for i, num in enumerate(nums):
        running_sum += 1 if num == 1 else -1
        
        if running_sum in prefix_map:
            length = i - prefix_map[running_sum]
            if length > max_len:
                max_len = length
                best_start = prefix_map[running_sum] + 1
                best_end = i
        else:
            prefix_map[running_sum] = i
            
    return max_len, (best_start, best_end)`,
      javascript: `function findMaxLength(nums) {
  const map = new Map();
  map.set(0, -1);
  let runningSum = 0;
  let maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    runningSum += nums[i] === 1 ? 1 : -1;
    if (map.has(runningSum)) {
      maxLen = Math.max(maxLen, i - map.get(runningSum));
    } else {
      map.set(runningSum, i);
    }
  }
  return maxLen;
}`,
      cpp: `int findMaxLength(vector<int>& nums) {
    unordered_map<int, int> prefixMap;
    prefixMap[0] = -1;
    int runningSum = 0, maxLen = 0;
    
    for (int i = 0; i < nums.size(); ++i) {
        runningSum += (nums[i] == 1) ? 1 : -1;
        if (prefixMap.count(runningSum)) {
            maxLen = max(maxLen, i - prefixMap[runningSum]);
        } else {
            prefixMap[runningSum] = i;
        }
    }
    return maxLen;
}`,
      java: `public int findMaxLength(int[] nums) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, -1);
    int sum = 0, maxLen = 0;
    
    for (int i = 0; i < nums.length; i++) {
        sum += (nums[i] == 1) ? 1 : -1;
        if (map.containsKey(sum)) {
            maxLen = Math.max(maxLen, i - map.get(sum));
        } else {
            map.put(sum, i);
        }
    }
    return maxLen;
}`
    }
  },

  "subarray-sum-k": {
    id: "subarray-sum-k",
    categoryId: "subarrays",
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    badge: "LeetCode 560",
    summary: "Find total number of continuous subarrays whose sum equals K by maintaining running prefix sum frequencies in a hash table.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      python: `def subarraySum(nums, k):
    count = 0
    current_sum = 0
    prefix_counts = {0: 1}

    for num in nums:
        current_sum += num
        target = current_sum - k
        if target in prefix_counts:
            count += prefix_counts[target]
        prefix_counts[current_sum] = prefix_counts.get(current_sum, 0) + 1
        
    return count`,
      javascript: `function subarraySum(nums, k) {
  let count = 0, sum = 0;
  const map = new Map([[0, 1]]);

  for (const num of nums) {
    sum += num;
    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}`,
      cpp: `int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixFreq = {{0, 1}};
    int count = 0, currentSum = 0;
    for (int num : nums) {
        currentSum += num;
        if (prefixFreq.count(currentSum - k)) {
            count += prefixFreq[currentSum - k];
        }
        prefixFreq[currentSum]++;
    }
    return count;
}`,
      java: `public int subarraySum(int[] nums, int k) {
    int count = 0, sum = 0;
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1);
    for (int num : nums) {
        sum += num;
        count += map.getOrDefault(sum - k, 0);
        map.put(sum, map.getOrDefault(sum, 0) + 1);
    }
    return count;
}`
    }
  },

  "kadane": {
    id: "kadane",
    categoryId: "subarrays",
    title: "Kadane's Algorithm (Max Subarray Sum)",
    difficulty: "Medium",
    badge: "LeetCode 53",
    summary: "Determine the contiguous subarray within a one-dimensional numerical array which has the largest sum in O(N) time.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def maxSubArray(nums):
    current_sum = max_sum = nums[0]
    best_start = best_end = 0
    temp_start = 0

    for i in range(1, len(nums)):
        if nums[i] > current_sum + nums[i]:
            current_sum = nums[i]
            temp_start = i
        else:
            current_sum += nums[i]

        if current_sum > max_sum:
            max_sum = current_sum
            best_start = temp_start
            best_end = i

    return max_sum, best_start, best_end`,
      javascript: `function maxSubArray(nums) {
  let cur = nums[0], max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    int currentSum = nums[0], maxSum = nums[0];
    for (size_t i = 1; i < nums.size(); ++i) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
      java: `public int maxSubArray(int[] nums) {
    int cur = nums[0], max = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        max = Math.max(max, cur);
    }
    return max;
}`
    }
  },

  "merge-sort": {
    id: "merge-sort",
    categoryId: "sorting",
    title: "Merge Sort",
    difficulty: "Medium",
    badge: "O(N log N) Stable",
    summary: "A divide-and-conquer algorithm that recursively splits arrays into halves, sorts them, and merges sorted subarrays together.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    code: {
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`,
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}`,
      java: `public static void mergeSort(int[] a, int n) {
    if (n < 2) return;
    int mid = n / 2;
    int[] l = Arrays.copyOfRange(a, 0, mid);
    int[] r = Arrays.copyOfRange(a, mid, n);
    mergeSort(l, mid);
    mergeSort(r, n - mid);
    merge(a, l, r, mid, n - mid);
}`
    }
  },

  "quick-sort": {
    id: "quick-sort",
    categoryId: "sorting",
    title: "Quick Sort",
    difficulty: "Medium",
    badge: "In-Place Partition",
    summary: "Selects a pivot element and partitions the array into values smaller and larger than the pivot, recursively sorting each side in-place.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    code: {
      python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) swap(arr[++i], arr[j]);
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      java: `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
    }
  },

  "bubble-sort": {
    id: "bubble-sort",
    categoryId: "sorting",
    title: "Bubble Sort",
    difficulty: "Easy",
    badge: "Comparison Sort",
    summary: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`
    }
  },

  "bst": {
    id: "bst",
    categoryId: "trees-graphs",
    title: "Binary Search Tree (BST)",
    difficulty: "Medium",
    badge: "Tree Data Structure",
    summary: "Node-based binary tree data structure with the property that keys in left subtrees are smaller and keys in right subtrees are greater. Supports Inorder, Preorder, Postorder, and Level-order traversals.",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def insert_bst(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    elif val > root.val:
        root.right = insert_bst(root.right, val)
    return root

def inorder(root, res):
    if root:
        inorder(root.left, res)
        res.append(root.val)
        inorder(root.right, res)`,
      javascript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
function insert(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;
}`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}`
    }
  },

  "graph-bfs-dfs": {
    id: "graph-bfs-dfs",
    categoryId: "trees-graphs",
    title: "Graph Search & Dijkstra",
    difficulty: "Hard",
    badge: "Shortest Path & Traversal",
    summary: "Breadth-First Search (Queue), Depth-First Search (Stack/Recursion), and Dijkstra's Shortest Path algorithm on weighted directed/undirected graphs.",
    timeComplexity: { best: "O(V + E)", average: "O(E log V)", worst: "O(E log V)" },
    spaceComplexity: "O(V + E)",
    code: {
      python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > distances[u]:
            continue
        for v, weight in graph[u]:
            if distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
                heapq.heappush(pq, (distances[v], v))
    return distances`,
      javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
      cpp: `vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    vector<int> dist(V, 1e9);
    dist[S] = 0;
    pq.push({0, S});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      java: `public int[] dijkstra(int V, ArrayList<ArrayList<ArrayList<Integer>>> adj, int S) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[S] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.add(new int[]{S, 0});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0], d = curr[1];
        if (d > dist[u]) continue;
        for (ArrayList<Integer> edge : adj.get(u)) {
            int v = edge.get(0), w = edge.get(1);
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}`
    }
  },

  "knapsack-01": {
    id: "knapsack-01",
    categoryId: "dp",
    title: "0/1 Knapsack Problem",
    difficulty: "Medium",
    badge: "2D Dynamic Programming",
    summary: "Given weights and values of N items, determine the maximum value that can be put in a knapsack of capacity W by considering whether to include or exclude each item.",
    timeComplexity: { best: "O(N · W)", average: "O(N · W)", worst: "O(N · W)" },
    spaceComplexity: "O(N · W)",
    code: {
      python: `def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                )
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W]`,
      javascript: `function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`,
      cpp: `int knapsack(int W, vector<int>& wt, vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; ++i) {
        for (int w = 0; w <= W; ++w) {
            if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`,
      java: `public static int knapSack(int W, int[] wt, int[] val, int n) {
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`
    }
  },

  "lcs": {
    id: "lcs",
    categoryId: "dp",
    title: "Longest Common Subsequence (LCS)",
    difficulty: "Medium",
    badge: "String DP Matrix",
    summary: "Find the length of the longest subsequence present in both strings, tracing back diagonally on matching characters or taking the max of adjacent subproblems.",
    timeComplexity: { best: "O(m · n)", average: "O(m · n)", worst: "O(m · n)" },
    spaceComplexity: "O(m · n)",
    code: {
      python: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]`,
      javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
      cpp: `int longestCommonSubsequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
      java: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`
    }
  },

  "stack-queue": {
    id: "stack-queue",
    categoryId: "data-structures",
    title: "Stack (LIFO) & Queue (FIFO)",
    difficulty: "Easy",
    badge: "Linear Structures",
    summary: "Visual simulation of Stack (Last-In-First-Out) with push, pop, peek operations and Queue (First-In-First-Out) with enqueue and dequeue operations.",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    code: {
      python: `class Stack:
    def __init__(self): self.items = []
    def push(self, val): self.items.append(val)
    def pop(self): return self.items.pop() if self.items else None
    def peek(self): return self.items[-1] if self.items else None

class Queue:
    def __init__(self): self.items = []
    def enqueue(self, val): self.items.append(val)
    def dequeue(self): return self.items.pop(0) if self.items else None`,
      javascript: `class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}
class Queue {
  constructor() { this.items = []; }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }
}`,
      cpp: `stack<int> s;
s.push(10);
s.push(20);
int topVal = s.top();
s.pop();

queue<int> q;
q.push(10);
int frontVal = q.front();
q.pop();`,
      java: `Stack<Integer> stack = new Stack<>();
stack.push(10);
int top = stack.peek();
stack.pop();

Queue<Integer> queue = new LinkedList<>();
queue.offer(10);
int front = queue.poll();`
    }
  },

  "binary-search": {
    id: "binary-search",
    categoryId: "data-structures",
    title: "Binary Search & Two Pointers",
    difficulty: "Easy",
    badge: "O(log N) Search",
    summary: "Search a target value in a sorted array by dividing the search interval in half with low, mid, and high pointers.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def binary_search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      javascript: `function binarySearch(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      cpp: `int binarySearch(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      java: `public int binarySearch(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    }
  }
};
