import React, { useState } from "react";
import SubarrayViz from "./visualizers/SubarrayViz.jsx";
import SortingViz from "./visualizers/SortingViz.jsx";
import TreeGraphViz from "./visualizers/TreeGraphViz.jsx";
import DynamicProgrammingViz from "./visualizers/DynamicProgrammingViz.jsx";
import DataStructuresViz from "./visualizers/DataStructuresViz.jsx";
import SimpleViz from "./visualizers/SimpleViz.jsx";
import DeepViz from "./visualizers/DeepViz.jsx";
import { 
  Layers, ArrowDownUp, Network, Grid3X3, Box, 
  Sparkles, Code2, ChevronDown
} from "lucide-react";

const ALGORITHMS_CATALOG = [
  {
    id: "longest-equal-subarray",
    categoryId: "subarrays",
    categoryLabel: "Subarrays",
    title: "Longest Equal Subarray (0s & 1s)",
    tag: "LC 525",
    difficulty: "Medium",
    desc: "Map 0 to -1 and 1 to +1. Repeated prefix sums identify balanced subarrays.",
    component: SubarrayViz
  },
  {
    id: "subarray-sum-k",
    categoryId: "subarrays",
    categoryLabel: "Subarrays",
    title: "Subarray Sum Equals K",
    tag: "LC 560",
    difficulty: "Medium",
    desc: "Count subarrays summing to K using prefix sum frequency map.",
    component: SubarrayViz
  },
  {
    id: "kadane",
    categoryId: "subarrays",
    categoryLabel: "Subarrays",
    title: "Kadane's (Max Subarray Sum)",
    tag: "LC 53",
    difficulty: "Medium",
    desc: "Find contiguous subarray with maximum sum in O(N) linear time.",
    component: SubarrayViz
  },
  {
    id: "merge-sort",
    categoryId: "sorting",
    categoryLabel: "Sorting",
    title: "Merge Sort",
    tag: "O(N log N)",
    difficulty: "Medium",
    desc: "Divide and conquer array halves recursively and merge in sorted order.",
    component: SortingViz
  },
  {
    id: "quick-sort",
    categoryId: "sorting",
    categoryLabel: "Sorting",
    title: "Quick Sort",
    tag: "In-Place",
    difficulty: "Medium",
    desc: "Partition elements around a pivot and recursively sort partitions.",
    component: SortingViz
  },
  {
    id: "bst",
    categoryId: "trees",
    categoryLabel: "Trees",
    title: "Binary Search Tree (BST)",
    tag: "Tree Canvas",
    difficulty: "Medium",
    desc: "Interactive BST node operations and animated tree traversals.",
    component: TreeGraphViz
  },
  {
    id: "knapsack-01",
    categoryId: "dp",
    categoryLabel: "Dynamic Prog",
    title: "0/1 Knapsack Problem",
    tag: "2D Matrix",
    difficulty: "Medium",
    desc: "Compute max value with capacity W using 2D DP state table.",
    component: DynamicProgrammingViz
  },
  {
    id: "binary-search",
    categoryId: "structures",
    categoryLabel: "Structures",
    title: "Binary Search & Pointers",
    tag: "O(log N)",
    difficulty: "Easy",
    desc: "Low, Mid, High pointer tracking in sorted array with Stack/Queue ops.",
    component: DataStructuresViz
  }
];

export default function App() {
  const [activeAlgoId, setActiveAlgoId] = useState("longest-equal-subarray");
  const [viewMode, setViewMode] = useState("advanced"); // "simple" or "advanced"

  const currentAlgo = ALGORITHMS_CATALOG.find(a => a.id === activeAlgoId) || ALGORITHMS_CATALOG[0];
  const ComponentToRender = currentAlgo.component;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b14",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace"
    }}>
      {/* Top Sticky Navigation Bar */}
      <header style={{
        background: "#0a0d16",
        borderBottom: "1px solid #1a2035",
        padding: "0 20px",
        height: 50,
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.4)"
          }}>
            <Code2 size={15} color="#fff" />
          </div>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: "#e2e8f0",
            letterSpacing: 0.5,
            whiteSpace: "nowrap"
          }}>
            CODE VISUALIZER
          </span>
        </div>

        {/* Algorithm Dropdown Quick Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <select
              value={activeAlgoId}
              onChange={e => setActiveAlgoId(e.target.value)}
              style={{
                background: "#0d1321",
                border: "1px solid #1e293b",
                borderRadius: 6,
                color: "#e2e8f0",
                padding: "6px 28px 6px 12px",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                appearance: "none",
                outline: "none"
              }}
            >
              {ALGORITHMS_CATALOG.map(algo => (
                <option key={algo.id} value={algo.id}>
                  [{algo.categoryLabel}] {algo.title}
                </option>
              ))}
            </select>
            <ChevronDown size={14} color="#818cf8" style={{ position: "absolute", right: 8, top: 10, pointerEvents: "none" }} />
          </div>

          {/* Simple vs Advanced (Side-by-Side Code) Mode Switcher */}
          <div style={{
            display: "flex",
            background: "#080b14",
            border: "1px solid #1a2035",
            borderRadius: 6,
            padding: 2
          }}>
            <button
              onClick={() => setViewMode("simple")}
              style={{
                background: viewMode === "simple" ? "#6366f1" : "transparent",
                color: viewMode === "simple" ? "#fff" : "#64748b",
                border: "none",
                borderRadius: 4,
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.15s"
              }}
            >
              ⚡ Simple View
            </button>
            <button
              onClick={() => setViewMode("advanced")}
              style={{
                background: viewMode === "advanced" ? "#6366f1" : "transparent",
                color: viewMode === "advanced" ? "#fff" : "#64748b",
                border: "none",
                borderRadius: 4,
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.15s"
              }}
            >
              🔬 Advanced (Code Side-by-Side)
            </button>
          </div>
        </div>
      </header>

      {/* Main Algorithm Viewport */}
      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "20px" }}>
        {/* Header Info */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#e2e8f0",
              margin: 0
            }}>
              {currentAlgo.title}
            </h1>
            <span style={{
              fontSize: 10,
              background: "#6366f122",
              color: "#818cf8",
              border: "1px solid #6366f144",
              borderRadius: 4,
              padding: "2px 6px",
              fontWeight: 700
            }}>
              {currentAlgo.tag}
            </span>
          </div>

          <div style={{ fontSize: 11, color: "#64748b" }}>
            {viewMode === "advanced" ? "Synchronized Live Code Stepper Active" : "Simplified Visual Only Mode"}
          </div>
        </div>

        {/* Render Active Algorithm with Mode Prop */}
        <ComponentToRender
          algorithmId={currentAlgo.id}
          mode={viewMode}
        />
      </main>
    </div>
  );
}
