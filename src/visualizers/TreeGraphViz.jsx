import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, RotateCcw, Plus, Trash2, GitFork } from "lucide-react";
import CodeStepperPanel from "../components/CodeStepperPanel.jsx";
import { ALGORITHM_CODE_PHASES } from "../data/algorithmsData.js";

class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function insertNode(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insertNode(root.left, val);
  else if (val > root.val) root.right = insertNode(root.right, val);
  return root;
}

function buildBST(values) {
  let root = null;
  for (const v of values) {
    root = insertNode(root, v);
  }
  return root;
}

function calculateTreeLayout(root, x = 240, y = 35, offset = 90, level = 0) {
  if (!root) return null;
  return {
    val: root.val,
    x,
    y,
    level,
    left: calculateTreeLayout(root.left, x - offset, y + 55, Math.max(25, offset / 1.8), level + 1),
    right: calculateTreeLayout(root.right, x + offset, y + 55, Math.max(25, offset / 1.8), level + 1)
  };
}

function getInorderSteps(root) {
  const steps = [];
  const visited = [];

  function traverse(node) {
    if (!node) return;
    steps.push({ node: node.val, visited: [...visited], codePhase: "go_left", desc: `Visiting node ${node.val} → traversing left child.` });
    traverse(node.left);
    visited.push(node.val);
    steps.push({ node: node.val, visited: [...visited], codePhase: "visit_node", desc: `Processed node ${node.val} into Inorder list: [${visited.join(', ')}].` });
    traverse(node.right);
  }

  traverse(root);
  steps.push({ node: null, visited: [...visited], codePhase: "done", desc: `✅ Inorder Traversal Complete: [${visited.join(', ')}].` });
  return steps;
}

const DEFAULT_TREE_VALS = [50, 30, 70, 20, 40, 60, 80];

export default function TreeGraphViz({
  algorithmId = "bst",
  mode = "simple"
}) {
  const [treeVals, setTreeVals] = useState(DEFAULT_TREE_VALS);
  const [newNodeInput, setNewNodeInput] = useState("");
  const [traversalType, setTraversalType] = useState("inorder");
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const bstRoot = useMemo(() => buildBST(treeVals), [treeVals]);
  const treeLayout = useMemo(() => calculateTreeLayout(bstRoot), [bstRoot]);
  const traversalSteps = useMemo(() => getInorderSteps(bstRoot), [bstRoot]);

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [treeVals, traversalType]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= traversalSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const interval = setTimeout(() => {
      setStepIdx(idx => Math.min(idx + 1, traversalSteps.length - 1));
    }, 900 / speed);
    return () => clearTimeout(interval);
  }, [isPlaying, stepIdx, traversalSteps.length, speed]);

  const currentStep = traversalSteps[stepIdx] || traversalSteps[0];

  const handleAddNode = () => {
    const v = parseInt(newNodeInput, 10);
    if (!isNaN(v) && !treeVals.includes(v)) {
      setTreeVals([...treeVals, v]);
      setNewNodeInput("");
    }
  };

  const handleRemoveNode = () => {
    const v = parseInt(newNodeInput, 10);
    if (!isNaN(v)) {
      setTreeVals(treeVals.filter(x => x !== v));
      setNewNodeInput("");
    }
  };

  function renderTreeSVG(node) {
    if (!node) return null;
    const isCurrent = currentStep?.node === node.val;
    const isVisited = currentStep?.visited?.includes(node.val);

    let nodeColor = "#080b14";
    let borderColor = "#38bdf8";
    let textColor = "#e2e8f0";

    if (isVisited) {
      nodeColor = "#10b98122";
      borderColor = "#10b981";
      textColor = "#34d399";
    }
    if (isCurrent) {
      nodeColor = "#f59e0b33";
      borderColor = "#f59e0b";
      textColor = "#fbbf24";
    }

    return (
      <g key={node.val}>
        {node.left && <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="#1e293b" strokeWidth={2} />}
        {node.right && <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="#1e293b" strokeWidth={2} />}
        <circle cx={node.x} cy={node.y} r={18} fill={nodeColor} stroke={borderColor} strokeWidth={isCurrent ? 3 : 2} />
        <text x={node.x} y={node.y + 4} textAnchor="middle" fill={textColor} fontSize={11} fontWeight={700} fontFamily="'JetBrains Mono', monospace">
          {node.val}
        </text>
        {renderTreeSVG(node.left)}
        {renderTreeSVG(node.right)}
      </g>
    );
  }

  const liveVariables = useMemo(() => {
    const vars = {};
    if (currentStep?.node !== undefined && currentStep?.node !== null) vars["current_node"] = currentStep.node;
    if (currentStep?.visited) vars["visited_count"] = currentStep.visited.length;
    return vars;
  }, [currentStep]);

  const codeData = ALGORITHM_CODE_PHASES["bst"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Node Ops Strip */}
      <div style={{
        background: "#0a0d16",
        border: "1px solid #1a2035",
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            value={newNodeInput}
            onChange={e => setNewNodeInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddNode()}
            placeholder="Node val"
            style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 5, color: "#e2e8f0", padding: "5px 10px", fontSize: 11, width: 90 }}
          />
          <button onClick={handleAddNode} style={{ background: "#06b6d4", color: "#080b14", border: "none", borderRadius: 5, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
            <Plus size={12} /> Insert
          </button>
          <button onClick={handleRemoveNode} style={{ background: "#080b14", color: "#ef4444", border: "1px solid #ef444444", borderRadius: 5, padding: "5px 10px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
            <Trash2 size={12} /> Delete
          </button>
        </div>

        <span style={{ fontSize: 11, color: "#64748b" }}>Traversal: Inorder (Sorted Tree Order)</span>
      </div>

      {/* Main Grid: Split Layout in Advanced Mode */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mode === "advanced" ? "1fr 420px" : "1fr",
        gap: 16
      }}>
        {/* Left Column: SVG Tree Canvas */}
        <div style={{
          background: "#0a0d16",
          border: "1px solid #1a2035",
          borderRadius: 10,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 14
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <GitFork size={14} color="#06b6d4" /> BINARY SEARCH TREE CANVAS
            </span>
            <span>Step {stepIdx + 1} of {traversalSteps.length}</span>
          </div>

          <div style={{ height: 260, background: "#080b14", border: "1px solid #1e293b", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="100%" height="100%" viewBox="0 0 480 250">
              {renderTreeSVG(treeLayout)}
            </svg>
          </div>

          {/* Visited Sequence */}
          <div style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8" }}>INORDER OUTPUT:</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 28, alignItems: "center" }}>
              {currentStep?.visited?.map((v, i) => (
                <span key={i} style={{ background: "#10b98122", border: "1px solid #10b981", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "#34d399" }}>
                  {v}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#cbd5e1" }}>{currentStep?.desc}</div>
          </div>
        </div>

        {/* Right Column: Code Stepper Panel */}
        {mode === "advanced" && (
          <CodeStepperPanel
            codeLines={codeData}
            activePhase={currentStep?.codePhase}
            variables={liveVariables}
            title="BST Insertion & Traversal"
          />
        )}
      </div>

      {/* Playback Controls */}
      <div style={{ background: "#0a0d16", border: "1px solid #1a2035", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setStepIdx(0)} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: "#94a3b8", padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>
            <RotateCcw size={13} />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: isPlaying ? "#f59e0b" : "#06b6d4", border: "none", borderRadius: 5, color: "#080b14", padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? "Pause" : "Traverse"}
          </button>
          <button onClick={() => setStepIdx(i => Math.min(traversalSteps.length - 1, i + 1))} disabled={stepIdx >= traversalSteps.length - 1} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: stepIdx >= traversalSteps.length - 1 ? "#334155" : "#e2e8f0", padding: "6px 10px", cursor: stepIdx >= traversalSteps.length - 1 ? "not-allowed" : "pointer" }}>
            <SkipForward size={13} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, maxWidth: 360 }}>
          <input type="range" min={0} max={traversalSteps.length - 1} value={stepIdx} onChange={e => setStepIdx(parseInt(e.target.value, 10))} style={{ flex: 1, cursor: "pointer" }} />
          <span style={{ fontSize: 11, color: "#64748b", minWidth: 50, textAlign: "right" }}>{stepIdx + 1} / {traversalSteps.length}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{ background: speed === s ? "#06b6d422" : "transparent", color: speed === s ? "#38bdf8" : "#64748b", border: `1px solid ${speed === s ? "#06b6d4" : "transparent"}`, borderRadius: 3, padding: "1px 6px", fontSize: 10, cursor: "pointer" }}>
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
