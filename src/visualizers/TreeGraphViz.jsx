import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, RotateCcw, Plus, Search, Trash2, GitFork } from "lucide-react";

// Binary Search Tree Node class helper
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

// Compute (x, y) coordinates for SVG rendering of BST
function calculateTreeLayout(root, x = 320, y = 40, offset = 120, level = 0) {
  if (!root) return null;
  return {
    val: root.val,
    x,
    y,
    level,
    left: calculateTreeLayout(root.left, x - offset, y + 60, Math.max(30, offset / 1.8), level + 1),
    right: calculateTreeLayout(root.right, x + offset, y + 60, Math.max(30, offset / 1.8), level + 1)
  };
}

// Traversal generators for BST
function getInorderSteps(root) {
  const steps = [];
  const visited = [];

  function traverse(node) {
    if (!node) return;
    steps.push({ node: node.val, visited: [...visited], desc: `Visiting node ${node.val} → traversing left child.` });
    traverse(node.left);
    visited.push(node.val);
    steps.push({ node: node.val, visited: [...visited], desc: `Processed node ${node.val} into Inorder list: [${visited.join(', ')}].` });
    traverse(node.right);
  }

  traverse(root);
  steps.push({ node: null, visited: [...visited], desc: `✅ Inorder Traversal Complete (Sorted Order): [${visited.join(', ')}].` });
  return steps;
}

function getPreorderSteps(root) {
  const steps = [];
  const visited = [];

  function traverse(node) {
    if (!node) return;
    visited.push(node.val);
    steps.push({ node: node.val, visited: [...visited], desc: `Processed root node ${node.val} first into Preorder list: [${visited.join(', ')}].` });
    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);
  steps.push({ node: null, visited: [...visited], desc: `✅ Preorder Traversal Complete: [${visited.join(', ')}].` });
  return steps;
}

function getPostorderSteps(root) {
  const steps = [];
  const visited = [];

  function traverse(node) {
    if (!node) return;
    steps.push({ node: node.val, visited: [...visited], desc: `Visiting node ${node.val} → going left & right children first.` });
    traverse(node.left);
    traverse(node.right);
    visited.push(node.val);
    steps.push({ node: node.val, visited: [...visited], desc: `Processed node ${node.val} into Postorder list: [${visited.join(', ')}].` });
  }

  traverse(root);
  steps.push({ node: null, visited: [...visited], desc: `✅ Postorder Traversal Complete: [${visited.join(', ')}].` });
  return steps;
}

function getLevelOrderSteps(root) {
  const steps = [];
  if (!root) return steps;
  const queue = [root];
  const visited = [];

  while (queue.length > 0) {
    const node = queue.shift();
    visited.push(node.val);
    steps.push({
      node: node.val,
      visited: [...visited],
      desc: `Dequeued node ${node.val}. Level-order sequence: [${visited.join(', ')}].`
    });
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  steps.push({ node: null, visited: [...visited], desc: `✅ Level-order (BFS) Traversal Complete: [${visited.join(', ')}].` });
  return steps;
}

const DEFAULT_TREE_VALS = [50, 30, 70, 20, 40, 60, 80];

export default function TreeGraphViz({ algorithmId = "bst" }) {
  const [treeVals, setTreeVals] = useState(DEFAULT_TREE_VALS);
  const [newNodeInput, setNewNodeInput] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [traversalType, setTraversalType] = useState("inorder");
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Rebuild BST
  const bstRoot = useMemo(() => buildBST(treeVals), [treeVals]);
  const treeLayout = useMemo(() => calculateTreeLayout(bstRoot), [bstRoot]);

  // Compute traversal steps
  const traversalSteps = useMemo(() => {
    if (traversalType === "preorder") return getPreorderSteps(bstRoot);
    if (traversalType === "postorder") return getPostorderSteps(bstRoot);
    if (traversalType === "levelorder") return getLevelOrderSteps(bstRoot);
    return getInorderSteps(bstRoot);
  }, [bstRoot, traversalType]);

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

  // Helper to render tree nodes and edges recursively
  function renderTreeSVG(node) {
    if (!node) return null;

    const isCurrent = currentStep?.node === node.val;
    const isVisited = currentStep?.visited?.includes(node.val);
    const isSearched = searchVal !== "" && parseInt(searchVal, 10) === node.val;

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
    if (isSearched) {
      nodeColor = "#ec489933";
      borderColor = "#ec4899";
      textColor = "#f472b6";
    }

    return (
      <g key={node.val}>
        {/* Edge to Left Child */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#1e293b"
            strokeWidth={2}
          />
        )}
        {/* Edge to Right Child */}
        {node.right && (
          <line
            x1={node.x}
            y1={node.right.x}
            y2={node.right.y}
            stroke="#1e293b"
            strokeWidth={2}
          />
        )}
        {/* Node Circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r={20}
          fill={nodeColor}
          stroke={borderColor}
          strokeWidth={isCurrent || isSearched ? 3 : 2}
          style={{ transition: "all 0.25s ease" }}
        />
        {/* Node Value */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fill={textColor}
          fontSize={12}
          fontWeight={700}
          fontFamily="'JetBrains Mono', monospace"
        >
          {node.val}
        </text>

        {renderTreeSVG(node.left)}
        {renderTreeSVG(node.right)}
      </g>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Node Operation Strip */}
      <div style={{
        background: "#0d1321",
        border: "1px solid #1a2740",
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16
      }}>
        {/* Insert / Remove input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="number"
            value={newNodeInput}
            onChange={e => setNewNodeInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddNode()}
            placeholder="Node value"
            style={{
              background: "#080b14",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: "#e2e8f0",
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              width: 100
            }}
          />
          <button
            onClick={handleAddNode}
            style={{
              background: "#06b6d4",
              color: "#080b14",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
          >
            <Plus size={14} /> Insert
          </button>
          <button
            onClick={handleRemoveNode}
            style={{
              background: "#080b14",
              color: "#ef4444",
              border: "1px solid #ef444444",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>

        {/* Traversal Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Traversal:</span>
          {[
            { id: "inorder", label: "Inorder (Sorted)" },
            { id: "preorder", label: "Preorder (Root First)" },
            { id: "postorder", label: "Postorder (Bottom-Up)" },
            { id: "levelorder", label: "Level-Order (BFS)" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTraversalType(t.id)}
              style={{
                background: traversalType === t.id ? "#06b6d422" : "#080b14",
                color: traversalType === t.id ? "#38bdf8" : "#94a3b8",
                border: `1px solid ${traversalType === t.id ? "#06b6d4" : "#1e293b"}`,
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Tree SVG Canvas */}
      <div style={{
        background: "#0d1321",
        border: "1px solid #1a2740",
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>
            <GitFork size={16} color="#06b6d4" />
            BINARY SEARCH TREE CANVAS
          </div>

          <span style={{ fontSize: 12, color: "#64748b" }}>
            Step {stepIdx + 1} of {traversalSteps.length}
          </span>
        </div>

        {/* SVG Tree Viewport */}
        <div style={{
          height: 300,
          background: "#080b14",
          border: "1px solid #1e293b",
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <svg width="100%" height="100%" viewBox="0 0 640 280">
            {renderTreeSVG(treeLayout)}
          </svg>
        </div>

        {/* Traversal Output Sequence */}
        <div style={{
          background: "#080b14",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>
              TRAVERSAL OUTPUT SEQUENCE:
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              {currentStep?.visited?.length || 0} nodes visited
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minHeight: 32, alignItems: "center" }}>
            {currentStep?.visited?.map((v, i) => (
              <div
                key={i}
                style={{
                  background: "#10b98122",
                  border: "1px solid #10b981",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#34d399",
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {v}
              </div>
            ))}
            {(!currentStep?.visited || currentStep.visited.length === 0) && (
              <span style={{ fontSize: 12, color: "#475569" }}>Click Play to start traversal...</span>
            )}
          </div>

          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>
            {currentStep?.desc}
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{
        background: "#0a0d16",
        border: "1px solid #1a2035",
        borderRadius: 12,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setStepIdx(0)}
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: "#94a3b8",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "#f59e0b" : "#06b6d4",
              border: "none",
              borderRadius: 6,
              color: "#080b14",
              padding: "8px 18px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "Pause" : "Traverse"}
          </button>
          <button
            onClick={() => setStepIdx(i => Math.min(traversalSteps.length - 1, i + 1))}
            disabled={stepIdx >= traversalSteps.length - 1}
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: stepIdx >= traversalSteps.length - 1 ? "#334155" : "#e2e8f0",
              padding: "8px 12px",
              cursor: stepIdx >= traversalSteps.length - 1 ? "not-allowed" : "pointer"
            }}
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 380 }}>
          <input
            type="range"
            min={0}
            max={traversalSteps.length - 1}
            value={stepIdx}
            onChange={e => setStepIdx(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: "#06b6d4", cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, color: "#64748b", minWidth: 60, textAlign: "right" }}>
            {stepIdx + 1} / {traversalSteps.length}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? "#06b6d422" : "transparent",
                color: speed === s ? "#38bdf8" : "#64748b",
                border: `1px solid ${speed === s ? "#06b6d4" : "transparent"}`,
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 11,
                cursor: "pointer"
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
