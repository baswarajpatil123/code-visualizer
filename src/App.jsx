import React, { useState } from "react";
import SimpleViz from "./visualizers/SimpleViz.jsx";
import DeepViz from "./visualizers/DeepViz.jsx";
import SortingViz from "./visualizers/SortingViz.jsx";
import TreeGraphViz from "./visualizers/TreeGraphViz.jsx";
import DynamicProgrammingViz from "./visualizers/DynamicProgrammingViz.jsx";
import DataStructuresViz from "./visualizers/DataStructuresViz.jsx";

const VIEWS = [
  {
    id: "simple",
    label: "Quick Visual",
    icon: "⚡",
    tag: "BEGINNER",
    title: "Longest Equal Subarray",
    desc: "Step through color-coded array cells with running sum & prefix map tracking",
    component: SimpleViz,
  },
  {
    id: "deep",
    label: "Deep Dive",
    icon: "🔬",
    tag: "ADVANCED",
    title: "Prefix Sum & Python Breakdown",
    desc: "Line-by-line Python execution + Dynamic area chart + Algorithm insights",
    component: DeepViz,
  },
  {
    id: "sorting",
    label: "Sorting Studio",
    icon: "📊",
    tag: "ALGORITHMS",
    title: "Merge, Quick & Bubble Sort",
    desc: "Animated array bars with comparison/swap counters and audio synthesis",
    component: SortingViz,
  },
  {
    id: "trees",
    label: "Trees & BST",
    icon: "🌳",
    tag: "DATA STRUCTURES",
    title: "Binary Search Tree Canvas",
    desc: "Interactive SVG canvas with live Insert, Delete, Search, and In/Pre/Post/Level traversals",
    component: TreeGraphViz,
  },
  {
    id: "dp",
    label: "Dynamic Programming",
    icon: "🧩",
    tag: "DP MATRIX",
    title: "0/1 Knapsack Problem",
    desc: "Interactive 2D DP matrix with item capacity calculation and optimal backtracking",
    component: DynamicProgrammingViz,
  },
  {
    id: "structures",
    label: "Stack & Queue",
    icon: "📦",
    tag: "CORE STRUCTURES",
    title: "Stack, Queue & Binary Search",
    desc: "LIFO vertical stack frames, FIFO horizontal line, and Binary Search pointers",
    component: DataStructuresViz,
  },
];

export default function App() {
  const [active, setActive] = useState("simple");
  const [showPicker, setShowPicker] = useState(false);

  const activeViewObj = VIEWS.find(v => v.id === active) || VIEWS[0];
  const ActiveComponent = activeViewObj.component;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b14",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace"
    }}>
      {/* Top Navigation Bar */}
      <nav style={{
        background: "#0a0d16",
        borderBottom: "1px solid #1a2035",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Brand label & mode picker toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            onClick={() => setShowPicker(true)}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: "#e2e8f0",
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6366f1",
              boxShadow: "0 0 8px #6366f1"
            }} />
            CODE VISUALIZER
          </div>
        </div>

        {/* View Selection Tabs */}
        <div style={{ display: "flex", height: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
          {VIEWS.map(v => {
            const isCurrent = active === v.id;
            return (
              <button
                key={v.id}
                onClick={() => { setActive(v.id); setShowPicker(false); }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 11,
                  fontWeight: 600,
                  color: isCurrent ? "#e2e8f0" : "#4a5a70",
                  padding: "0 12px",
                  height: "100%",
                  borderBottom: isCurrent ? "2px solid #6366f1" : "2px solid transparent",
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{v.icon}</span>
                <span>{v.label}</span>
                <span style={{
                  fontSize: 8,
                  background: isCurrent ? "#6366f122" : "#0d1321",
                  color: isCurrent ? "#818cf8" : "#2d3f60",
                  border: `1px solid ${isCurrent ? "#6366f144" : "#1a2035"}`,
                  borderRadius: 3,
                  padding: "1px 5px",
                  letterSpacing: 0.5,
                }}>
                  {v.tag}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mode Picker Overlay Modal (triggered on logo click or optional) */}
      {showPicker && (
        <div
          onClick={() => setShowPicker(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: 48,
            background: "#080b14dd",
            backdropFilter: "blur(8px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 720, width: "100%" }}
          >
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: "#e2e8f0", textAlign: "center", marginBottom: 6 }}>
              Select Visualizer
            </div>
            <div style={{ fontSize: 11, color: "#4a5a70", textAlign: "center", marginBottom: 24, letterSpacing: 1 }}>
              EXPLORE ALGORITHMS & DATA STRUCTURES
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
              {VIEWS.map(v => (
                <button
                  key={v.id}
                  onClick={() => { setActive(v.id); setShowPicker(false); }}
                  style={{
                    background: active === v.id ? "#0f1528" : "#0d1321",
                    border: `1px solid ${active === v.id ? "#6366f1" : "#1a2740"}`,
                    borderRadius: 10,
                    padding: "18px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#0f1528"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = active === v.id ? "#6366f1" : "#1a2740";
                    e.currentTarget.style.background = active === v.id ? "#0f1528" : "#0d1321";
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{v.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: "#e2e8f0", marginBottom: 3 }}>
                    {v.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#818cf8", letterSpacing: 1, marginBottom: 8 }}>
                    {v.tag}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                    {v.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Visualizer View */}
      <div style={{ padding: "16px 20px" }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
