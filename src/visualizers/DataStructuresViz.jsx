import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Box, ArrowRight, CornerLeftDown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function DataStructuresViz({ algorithmId = "stack-queue" }) {
  // Mode toggle: "stack", "queue", "binary-search"
  const [subMode, setSubMode] = useState(algorithmId === "binary-search" ? "binary-search" : "stack");

  // Stack state
  const [stackItems, setStackItems] = useState([10, 25, 40, 85]);
  const [stackInput, setStackInput] = useState("");
  const [stackMessage, setStackMessage] = useState("Ready for stack operations.");

  // Queue state
  const [queueItems, setQueueItems] = useState([15, 30, 45, 60]);
  const [queueInput, setQueueInput] = useState("");
  const [queueMessage, setQueueMessage] = useState("Ready for queue operations.");

  // Binary Search state
  const [bsArray, setBsArray] = useState([4, 9, 15, 23, 38, 45, 52, 67, 78, 89, 94]);
  const [targetVal, setTargetVal] = useState(45);
  const [bsStepIdx, setBsStepIdx] = useState(0);
  const [bsPlaying, setBsPlaying] = useState(false);

  // Generate Binary Search Steps
  const bsSteps = useMemo(() => {
    const steps = [];
    let low = 0, high = bsArray.length - 1;
    let found = false;

    steps.push({
      low,
      high,
      mid: Math.floor((low + high) / 2),
      status: "init",
      desc: `Search target ${targetVal} within range [0..${high}].`
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midVal = bsArray[mid];

      if (midVal === targetVal) {
        steps.push({
          low,
          high,
          mid,
          status: "found",
          desc: `🎯 Target ${targetVal} FOUND at index ${mid}!`
        });
        found = true;
        break;
      } else if (midVal < targetVal) {
        steps.push({
          low,
          high,
          mid,
          status: "too_low",
          desc: `arr[mid=${mid}] (${midVal}) < target (${targetVal}) → Adjusting low = ${mid + 1}.`
        });
        low = mid + 1;
      } else {
        steps.push({
          low,
          high,
          mid,
          status: "too_high",
          desc: `arr[mid=${mid}] (${midVal}) > target (${targetVal}) → Adjusting high = ${mid - 1}.`
        });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        low,
        high,
        mid: -1,
        status: "not_found",
        desc: `❌ Target ${targetVal} does not exist in array (low > high).`
      });
    }

    return steps;
  }, [bsArray, targetVal]);

  useEffect(() => {
    setBsStepIdx(0);
    setBsPlaying(false);
  }, [bsArray, targetVal, subMode]);

  useEffect(() => {
    if (!bsPlaying) return;
    if (bsStepIdx >= bsSteps.length - 1) {
      setBsPlaying(false);
      return;
    }
    const interval = setTimeout(() => {
      setBsStepIdx(idx => Math.min(idx + 1, bsSteps.length - 1));
    }, 1000);
    return () => clearTimeout(interval);
  }, [bsPlaying, bsStepIdx, bsSteps.length]);

  // Trigger confetti on binary search found
  const curBsStep = bsSteps[bsStepIdx] || bsSteps[0];
  useEffect(() => {
    if (curBsStep?.status === "found") {
      try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } }); } catch (e) {}
    }
  }, [curBsStep?.status]);

  // Stack operations
  const handlePush = () => {
    const v = parseInt(stackInput, 10);
    if (!isNaN(v)) {
      if (stackItems.length >= 8) {
        setStackMessage("⚠️ Stack Overflow: Maximum capacity reached.");
        return;
      }
      setStackItems([...stackItems, v]);
      setStackMessage(`Pushed ${v} onto stack. Top of stack is now ${v}.`);
      setStackInput("");
    }
  };

  const handlePop = () => {
    if (stackItems.length === 0) {
      setStackMessage("⚠️ Stack Underflow: Stack is empty.");
      return;
    }
    const popped = stackItems[stackItems.length - 1];
    setStackItems(stackItems.slice(0, -1));
    setStackMessage(`Popped ${popped} from stack.`);
  };

  const handlePeek = () => {
    if (stackItems.length === 0) {
      setStackMessage("Stack is empty. Nothing to peek.");
      return;
    }
    setStackMessage(`Top element is ${stackItems[stackItems.length - 1]}.`);
  };

  // Queue operations
  const handleEnqueue = () => {
    const v = parseInt(queueInput, 10);
    if (!isNaN(v)) {
      if (queueItems.length >= 8) {
        setQueueMessage("⚠️ Queue Overflow: Queue is full.");
        return;
      }
      setQueueItems([...queueItems, v]);
      setQueueMessage(`Enqueued ${v} to rear.`);
      setQueueInput("");
    }
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) {
      setQueueMessage("⚠️ Queue Underflow: Queue is empty.");
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems(queueItems.slice(1));
    setQueueMessage(`Dequeued ${dequeued} from front.`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Submode Switcher Tabs */}
      <div style={{
        background: "#0d1321",
        border: "1px solid #1a2740",
        borderRadius: 12,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { id: "stack", label: "Stack (LIFO)" },
            { id: "queue", label: "Queue (FIFO)" },
            { id: "binary-search", label: "Binary Search & Pointers" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubMode(tab.id)}
              style={{
                background: subMode === tab.id ? "#f59e0b22" : "#080b14",
                color: subMode === tab.id ? "#fbbf24" : "#94a3b8",
                border: `1px solid ${subMode === tab.id ? "#f59e0b" : "#1e293b"}`,
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* STACK VISUALIZER */}
      {subMode === "stack" && (
        <div style={{
          background: "#0d1321",
          border: "1px solid #1a2740",
          borderRadius: 12,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          {/* Operations bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <input
              type="number"
              value={stackInput}
              onChange={e => setStackInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handlePush()}
              placeholder="Value"
              style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 6,
                color: "#e2e8f0",
                padding: "6px 12px",
                fontSize: 12,
                width: 90
              }}
            />
            <button
              onClick={handlePush}
              style={{
                background: "#f59e0b",
                color: "#080b14",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Push
            </button>
            <button
              onClick={handlePop}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Pop
            </button>
            <button
              onClick={handlePeek}
              style={{
                background: "#080b14",
                color: "#94a3b8",
                border: "1px solid #1e293b",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              Peek
            </button>
            <button
              onClick={() => setStackItems([])}
              style={{
                background: "#080b14",
                color: "#64748b",
                border: "1px solid #1e293b",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>

          {/* Visual Vertical Stack Frame */}
          <div style={{
            minHeight: 260,
            background: "#080b14",
            border: "2px dashed #1e293b",
            borderRadius: 8,
            padding: "20px",
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            gap: 8,
            position: "relative"
          }}>
            {stackItems.map((val, idx) => {
              const isTop = idx === stackItems.length - 1;
              return (
                <div
                  key={idx}
                  style={{
                    width: 220,
                    height: 42,
                    background: isTop ? "#f59e0b22" : "#0d1321",
                    border: `2px solid ${isTop ? "#f59e0b" : "#1e293b"}`,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    fontWeight: 700,
                    color: isTop ? "#fbbf24" : "#e2e8f0",
                    transition: "all 0.25s ease",
                    boxShadow: isTop ? "0 0 12px rgba(245, 158, 11, 0.3)" : "none"
                  }}
                >
                  <span style={{ fontSize: 11, color: "#64748b" }}>[{idx}]</span>
                  <span style={{ fontSize: 16 }}>{val}</span>
                  {isTop ? (
                    <span style={{ fontSize: 10, background: "#f59e0b", color: "#080b14", padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>
                      TOP
                    </span>
                  ) : <div style={{ width: 30 }} />}
                </div>
              );
            })}
            {stackItems.length === 0 && (
              <span style={{ color: "#475569", fontSize: 13, margin: "auto" }}>
                Stack is currently empty
              </span>
            )}
          </div>

          <div style={{
            background: "#080b14",
            border: "1px solid #1e293b",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 13,
            color: "#fbbf24"
          }}>
            {stackMessage}
          </div>
        </div>
      )}

      {/* QUEUE VISUALIZER */}
      {subMode === "queue" && (
        <div style={{
          background: "#0d1321",
          border: "1px solid #1a2740",
          borderRadius: 12,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          {/* Operations bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <input
              type="number"
              value={queueInput}
              onChange={e => setQueueInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEnqueue()}
              placeholder="Value"
              style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 6,
                color: "#e2e8f0",
                padding: "6px 12px",
                fontSize: 12,
                width: 90
              }}
            />
            <button
              onClick={handleEnqueue}
              style={{
                background: "#06b6d4",
                color: "#080b14",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Enqueue (Rear)
            </button>
            <button
              onClick={handleDequeue}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Dequeue (Front)
            </button>
            <button
              onClick={() => setQueueItems([])}
              style={{
                background: "#080b14",
                color: "#64748b",
                border: "1px solid #1e293b",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>

          {/* Visual Horizontal FIFO Line */}
          <div style={{
            minHeight: 180,
            background: "#080b14",
            border: "2px dashed #1e293b",
            borderRadius: 8,
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            overflowX: "auto"
          }}>
            {queueItems.map((val, idx) => {
              const isFront = idx === 0;
              const isRear = idx === queueItems.length - 1;
              return (
                <div
                  key={idx}
                  style={{
                    minWidth: 64,
                    height: 80,
                    background: isFront ? "#06b6d422" : isRear ? "#f59e0b22" : "#0d1321",
                    border: `2px solid ${isFront ? "#06b6d4" : isRear ? "#f59e0b" : "#1e293b"}`,
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    transition: "all 0.25s ease"
                  }}
                >
                  <span style={{ fontSize: 10, color: "#64748b" }}>[{idx}]</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>{val}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: isFront ? "#38bdf8" : isRear ? "#fbbf24" : "transparent" }}>
                    {isFront ? "FRONT" : isRear ? "REAR" : "·"}
                  </span>
                </div>
              );
            })}
            {queueItems.length === 0 && (
              <span style={{ color: "#475569", fontSize: 13, margin: "auto" }}>
                Queue is currently empty
              </span>
            )}
          </div>

          <div style={{
            background: "#080b14",
            border: "1px solid #1e293b",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 13,
            color: "#38bdf8"
          }}>
            {queueMessage}
          </div>
        </div>
      )}

      {/* BINARY SEARCH VISUALIZER */}
      {subMode === "binary-search" && (
        <div style={{
          background: "#0d1321",
          border: "1px solid #1a2740",
          borderRadius: 12,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          {/* Target input strip */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Target Value:</span>
            <input
              type="number"
              value={targetVal}
              onChange={e => setTargetVal(parseInt(e.target.value, 10) || 0)}
              style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 6,
                color: "#f59e0b",
                padding: "6px 12px",
                fontSize: 13,
                fontWeight: 700,
                width: 80,
                textAlign: "center"
              }}
            />
            <span style={{ fontSize: 12, color: "#64748b" }}>Preset Targets:</span>
            {[15, 45, 89, 99].map(t => (
              <button
                key={t}
                onClick={() => setTargetVal(t)}
                style={{
                  background: targetVal === t ? "#f59e0b22" : "#080b14",
                  color: targetVal === t ? "#fbbf24" : "#94a3b8",
                  border: `1px solid ${targetVal === t ? "#f59e0b" : "#1e293b"}`,
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 11,
                  cursor: "pointer"
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sorted Array with Low, Mid, High Pointers */}
          <div style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: "16px 4px",
            alignItems: "center"
          }}>
            {bsArray.map((val, idx) => {
              const isLow = curBsStep?.low === idx;
              const isHigh = curBsStep?.high === idx;
              const isMid = curBsStep?.mid === idx;
              const inRange = idx >= curBsStep?.low && idx <= curBsStep?.high;

              let bgColor = inRange ? "#080b14" : "#06080f";
              let borderColor = inRange ? "#1e293b" : "#111827";
              let textColor = inRange ? "#e2e8f0" : "#334155";

              if (isMid) {
                bgColor = curBsStep.status === "found" ? "#10b98133" : "#f59e0b22";
                borderColor = curBsStep.status === "found" ? "#10b981" : "#f59e0b";
                textColor = curBsStep.status === "found" ? "#34d399" : "#fbbf24";
              }

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 50
                  }}
                >
                  {/* Top Pointer Tags */}
                  <div style={{ height: 18, display: "flex", gap: 2 }}>
                    {isLow && <span style={{ fontSize: 9, background: "#38bdf8", color: "#080b14", padding: "1px 4px", borderRadius: 3, fontWeight: 800 }}>L</span>}
                    {isHigh && <span style={{ fontSize: 9, background: "#ec4899", color: "#fff", padding: "1px 4px", borderRadius: 3, fontWeight: 800 }}>H</span>}
                  </div>

                  {/* Cell */}
                  <div
                    style={{
                      width: 50,
                      height: 52,
                      background: bgColor,
                      border: `2px solid ${borderColor}`,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: textColor,
                      transition: "all 0.25s ease",
                      boxShadow: isMid ? "0 0 12px rgba(245, 158, 11, 0.4)" : "none"
                    }}
                  >
                    {val}
                  </div>

                  {/* Index and Mid Label */}
                  <span style={{ fontSize: 10, color: isMid ? "#fbbf24" : "#475569", fontWeight: 600 }}>
                    {isMid ? "MID" : `[${idx}]`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Commentary */}
          <div style={{
            background: "#080b14",
            border: `1px solid ${curBsStep?.status === "found" ? "#10b981" : "#1e293b"}`,
            borderRadius: 8,
            padding: "14px 18px",
            fontSize: 13,
            fontWeight: 600,
            color: "#e2e8f0"
          }}>
            {curBsStep?.desc}
          </div>

          {/* Controls */}
          <div style={{
            background: "#0a0d16",
            border: "1px solid #1a2035",
            borderRadius: 8,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setBsStepIdx(0)}
                style={{
                  background: "#0d1321",
                  border: "1px solid #1e293b",
                  borderRadius: 6,
                  color: "#94a3b8",
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: "pointer"
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setBsPlaying(!bsPlaying)}
                style={{
                  background: bsPlaying ? "#f59e0b" : "#6366f1",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                  padding: "6px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                {bsPlaying ? <Pause size={14} /> : <Play size={14} />}
                {bsPlaying ? "Pause" : "Search"}
              </button>
              <button
                onClick={() => setBsStepIdx(i => Math.min(bsSteps.length - 1, i + 1))}
                disabled={bsStepIdx >= bsSteps.length - 1}
                style={{
                  background: "#0d1321",
                  border: "1px solid #1e293b",
                  borderRadius: 6,
                  color: bsStepIdx >= bsSteps.length - 1 ? "#334155" : "#e2e8f0",
                  padding: "6px 12px",
                  fontSize: 12,
                  cursor: bsStepIdx >= bsSteps.length - 1 ? "not-allowed" : "pointer"
                }}
              >
                <SkipForward size={14} />
              </button>
            </div>

            <span style={{ fontSize: 12, color: "#64748b" }}>
              Step {bsStepIdx + 1} of {bsSteps.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
