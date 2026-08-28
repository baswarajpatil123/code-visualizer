import React, { useState } from "react";
import { CATEGORIES, ALGORITHMS } from "./data/algorithmsData.js";
import SubarrayViz from "./visualizers/SubarrayViz.jsx";
import SortingViz from "./visualizers/SortingViz.jsx";
import TreeGraphViz from "./visualizers/TreeGraphViz.jsx";
import DynamicProgrammingViz from "./visualizers/DynamicProgrammingViz.jsx";
import DataStructuresViz from "./visualizers/DataStructuresViz.jsx";
import { 
  Layers, ArrowDownUp, Network, Grid3X3, Box, 
  Code2, Clock, HardDrive, Copy, Check, ExternalLink,
  Zap, Cloud, ChevronDown
} from "lucide-react";

const ICONS_MAP = {
  Layers: Layers,
  ArrowDownUp: ArrowDownUp,
  Network: Network,
  Grid3X3: Grid3X3,
  Box: Box
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("subarrays");
  const [activeAlgoId, setActiveAlgoId] = useState("longest-equal-subarray");
  const [activeCodeLang, setActiveCodeLang] = useState("python");
  const [copied, setCopied] = useState(false);

  // Available algorithms for current category
  const categoryAlgos = Object.values(ALGORITHMS).filter(a => a.categoryId === activeCategory);
  const currentAlgo = ALGORITHMS[activeAlgoId] || categoryAlgos[0] || Object.values(ALGORITHMS)[0];

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    const firstInCat = Object.values(ALGORITHMS).find(a => a.categoryId === catId);
    if (firstInCat) {
      setActiveAlgoId(firstInCat.id);
    }
  };

  const handleCopyCode = () => {
    const snippet = currentAlgo.code[activeCodeLang];
    if (snippet) {
      navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render Visualizer Component based on category
  const renderVisualizer = () => {
    switch (activeCategory) {
      case "subarrays":
        return <SubarrayViz algorithmId={currentAlgo.id} />;
      case "sorting":
        return <SortingViz algorithmId={currentAlgo.id} />;
      case "trees-graphs":
        return <TreeGraphViz algorithmId={currentAlgo.id} />;
      case "dp":
        return <DynamicProgrammingViz algorithmId={currentAlgo.id} />;
      case "data-structures":
        return <DataStructuresViz algorithmId={currentAlgo.id} />;
      default:
        return <SubarrayViz algorithmId={currentAlgo.id} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b14",
      color: "#e2e8f0",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Top Main Navbar */}
      <header style={{
        background: "#0a0d16cc",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a2035",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 24px"
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20
        }}>
          {/* Logo & Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(99, 102, 241, 0.5)"
            }}>
              <Code2 size={20} color="#fff" />
            </div>
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 0.5,
                background: "linear-gradient(to right, #fff, #94a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                CODE VISUALIZER
              </div>
              <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, letterSpacing: 1 }}>
                INTERACTIVE ALGORITHM STUDIO
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "4px 0" }}>
            {CATEGORIES.map(cat => {
              const IconComp = ICONS_MAP[cat.icon] || Box;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  style={{
                    background: isActive ? `${cat.color}18` : "transparent",
                    border: `1px solid ${isActive ? cat.color : "transparent"}`,
                    color: isActive ? "#fff" : "#94a3b8",
                    borderRadius: 8,
                    padding: "7px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                >
                  <IconComp size={15} color={isActive ? cat.color : "#64748b"} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cloudflare Badge & GitHub Link */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              background: "#f3802015",
              border: "1px solid #f3802044",
              borderRadius: 6,
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: "#f38020"
            }}>
              <Cloud size={13} /> Cloudflare Ready
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Algorithm Header Banner */}
        <div style={{
          background: "linear-gradient(180deg, #0d1321, #0a0e1a)",
          border: "1px solid #1a2740",
          borderRadius: 14,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          {/* Algorithm Sub-navigation & Details */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {/* Algorithm Selector Dropdown */}
                <div style={{ position: "relative" }}>
                  <select
                    value={activeAlgoId}
                    onChange={e => setActiveAlgoId(e.target.value)}
                    style={{
                      background: "#080b14",
                      border: "1px solid #6366f1",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "8px 32px 8px 14px",
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: "'Syne', sans-serif",
                      cursor: "pointer",
                      appearance: "none"
                    }}
                  >
                    {categoryAlgos.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} color="#818cf8" style={{ position: "absolute", right: 10, top: 12, pointerEvents: "none" }} />
                </div>

                {/* Difficulty Badge */}
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: currentAlgo.difficulty === "Easy" ? "#10b98122" : currentAlgo.difficulty === "Medium" ? "#f59e0b22" : "#ef444422",
                  color: currentAlgo.difficulty === "Easy" ? "#34d399" : currentAlgo.difficulty === "Medium" ? "#fbbf24" : "#f87171",
                  border: `1px solid ${currentAlgo.difficulty === "Easy" ? "#10b981" : currentAlgo.difficulty === "Medium" ? "#f59e0b" : "#ef4444"}`
                }}>
                  {currentAlgo.difficulty}
                </span>

                {/* Tag Badge */}
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: "#1e293b",
                  color: "#94a3b8"
                }}>
                  {currentAlgo.badge}
                </span>
              </div>

              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                {currentAlgo.summary}
              </p>
            </div>

            {/* Complexity Cards */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {/* Time Complexity */}
              <div style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 10,
                padding: "10px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 140
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b", fontWeight: 700 }}>
                  <Clock size={13} color="#6366f1" /> TIME COMPLEXITY
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>
                  Avg: {currentAlgo.timeComplexity.average}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  Worst: {currentAlgo.timeComplexity.worst}
                </div>
              </div>

              {/* Space Complexity */}
              <div style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 10,
                padding: "10px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 140
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b", fontWeight: 700 }}>
                  <HardDrive size={13} color="#10b981" /> SPACE COMPLEXITY
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#34d399", fontFamily: "'JetBrains Mono', monospace" }}>
                  {currentAlgo.spaceComplexity}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  Auxiliary Memory
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Visualizer Canvas Area */}
        <section style={{ width: "100%" }}>
          {renderVisualizer()}
        </section>

        {/* Multi-Language Code Inspector */}
        <section style={{
          background: "#0d1321",
          border: "1px solid #1a2740",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Code Header Bar */}
          <div style={{
            background: "#0a0d16",
            borderBottom: "1px solid #1a2035",
            padding: "0 20px",
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16
          }}>
            {/* Language Tabs */}
            <div style={{ display: "flex", height: "100%" }}>
              {[
                { id: "python", label: "Python 3" },
                { id: "javascript", label: "JavaScript (ES6)" },
                { id: "cpp", label: "C++ (STL)" },
                { id: "java", label: "Java 17" }
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setActiveCodeLang(lang.id)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeCodeLang === lang.id ? "2px solid #6366f1" : "2px solid transparent",
                    color: activeCodeLang === lang.id ? "#fff" : "#64748b",
                    padding: "0 16px",
                    height: "100%",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 6,
                color: copied ? "#34d399" : "#94a3b8",
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer"
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          {/* Syntax Highlighted Code Box */}
          <pre style={{
            margin: 0,
            padding: "20px 24px",
            background: "#080b14",
            color: "#e2e8f0",
            fontSize: 13,
            lineHeight: 1.7,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            overflowX: "auto"
          }}>
            <code>
              {currentAlgo.code[activeCodeLang] || "# Implementation coming soon..."}
            </code>
          </pre>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1a2035",
        background: "#0a0d16",
        padding: "24px",
        marginTop: 40,
        textAlign: "center",
        fontSize: 12,
        color: "#64748b"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <strong style={{ color: "#94a3b8" }}>Code Visualizer</strong> · Built for high performance & commercial monetization on Cloudflare Pages.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>⚡ Edge Deployed</span>
            <span>🔒 Zero Vercel Restrictions</span>
            <span>🚀 100% Free Bandwidth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
