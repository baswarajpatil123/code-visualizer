# ⚡ Code Visualizer

> **Interactive Algorithm & Data Structure Visualizer Studio** — engineered for high-performance edge deployment on **Cloudflare Pages** (with 100% commercial and monetization support).

![Build Status](https://img.shields.io/badge/build-passing-emerald?style=for-the-badge&logo=github-actions)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Ready-F38020?style=for-the-badge&logo=cloudflare)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite_4-646CFF?style=for-the-badge&logo=vite)

---

## 🚀 Features

- 🎯 **Interactive Step-by-Step Playback**: Step Forward, Step Back, Play/Pause, Scrubber slider, and Speed multiplier (0.25x – 4x).
- 📊 **Dynamic Graphs & Canvases**:
  - **Prefix Sum Area Chart**: Live running sum plots with reference thresholds.
  - **Sorting Array Bars**: Animated comparison (`#f59e0b`), swap (`#ec4899`), pivot (`#06b6d4`), and sorted (`#10b981`) bar heights.
  - **Tree & Graph Canvas**: SVG layout for Binary Search Trees with live traversal sequence highlighting.
  - **2D Dynamic Programming Grid**: Cell-by-cell computation with formula overlays and item backpointers.
  - **LIFO Stack & FIFO Queue**: Animated visual frames with pointer tracking.
  - **Binary Search Pointers**: Low, Mid, High pointers with match celebration.
- 💻 **Multi-Language Code Explorer**: Tabbed code view with instant copy for **Python 3**, **JavaScript (ES6)**, **C++ (STL)**, and **Java 17**.
- ⏱️ **Complexity Inspector**: Real-time Best, Average, Worst time complexities and auxiliary space requirements.
- 🔊 **Audio Synthesizer**: Web Audio API frequency tones dynamically mapped to array bar values during sorting operations.
- 🌐 **Cloudflare Pages Edge-Ready**: Includes `public/_redirects` (SPA routing) and `public/_headers` (optimal CDN cache policies).

---

## 📚 Supported Algorithms & Data Structures

| Category | Algorithms & Data Structures | LeetCode / Complexity |
| :--- | :--- | :--- |
| **Subarrays & Prefix Sums** | • Longest Subarray with Equal 0s & 1s<br>• Subarray Sum Equals K<br>• Kadane's Algorithm (Max Subarray Sum) | LC 525 (Med)<br>LC 560 (Med)<br>LC 53 (Med) |
| **Sorting Algorithms** | • Merge Sort (Divide & Conquer)<br>• Quick Sort (In-Place Partition)<br>• Bubble Sort | $O(N \log N)$<br>$O(N \log N)$<br>$O(N^2)$ |
| **Trees & Graphs** | • Binary Search Tree (BST Insert, Delete, Search)<br>• Traversals: Inorder, Preorder, Postorder, Level-Order (BFS) | $O(\log N)$ |
| **Dynamic Programming** | • 0/1 Knapsack Problem (2D DP Grid)<br>• Longest Common Subsequence (LCS)<br>• Coin Change | $O(N \cdot W)$<br>$O(M \cdot N)$ |
| **Core Structures & Pointers** | • Stack (LIFO: Push, Pop, Peek)<br>• Queue (FIFO: Enqueue, Dequeue)<br>• Binary Search & Two Pointers | $O(1)$ ops<br>$O(1)$ ops<br>$O(\log N)$ |

---

## ☁️ Deploying to Cloudflare Pages (Recommended)

### Method 1: Git Integration (Dashboard)

1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Select your repository.
3. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Your application will be live globally on Cloudflare's edge CDN!

### Method 2: Direct CLI Deployment (Wrangler)

```bash
# Build production bundle
npm run build

# Deploy directly via Wrangler
npx wrangler pages deploy dist
```

> **Why Cloudflare Pages over Vercel for this project?**
> - **Commercial & Monetization Allowed**: Unlike Vercel's free Hobby tier (which strictly forbids ads, affiliate links, and commercial monetization), Cloudflare Pages allows commercial usage and monetization on its free plan.
> - **Unlimited Bandwidth**: Zero egress bandwidth costs.
> - **300+ Edge Data Centers**: Sub-millisecond TTFB globally.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Test production build locally
npm run build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏷️ How to Rename the Repository on GitHub

To rename the repository from `web-app-code` to `code-visualizer` on GitHub:
1. Navigate to `https://github.com/baswarajpatil123/web-app-code/settings`.
2. Under **General** → **Repository name**, change the name to `code-visualizer` (or `code-visualizer-studio`).
3. Click **Rename**. GitHub will automatically preserve all commit history and configure automatic URL redirects.
