import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import CodeStepperPanel from "../components/CodeStepperPanel.jsx";
import { ALGORITHM_CODE_PHASES } from "../data/algorithmsData.js";

export default function DataStructuresViz({
  algorithmId = "binary-search",
  mode = "simple"
}) {
  const [subMode, setSubMode] = useState("binary-search");

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

  const bsSteps = useMemo(() => {
    const steps = [];
    let low = 0, high = bsArray.length - 1;
    let found = false;

    steps.push({
      low,
      high,
      mid: Math.floor((low + high) / 2),
      status: "init",
      codePhase: "init",
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
          codePhase: "found",
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
          codePhase: "too_low",
          desc: `arr[${mid}] (${midVal}) < ${targetVal} → low = ${mid + 1}.`
        });
        low = mid + 1;
      } else {
        steps.push({
          low,
          high,
          mid,
          status: "too_high",
          codePhase: "too_high",
          desc: `arr[${mid}] (${midVal}) > ${targetVal} → high = ${mid - 1}.`
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
        codePhase: "not_found",
        desc: `❌ Target ${targetVal} not found in array.`
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

  const curBsStep = bsSteps[bsStepIdx] || bsSteps[0];

  const handlePush = () => {
    const v = parseInt(stackInput, 10);
    if (!isNaN(v) && stackItems.length < 8) {
      setStackItems([...stackItems, v]);
      setStackMessage(`Pushed ${v} onto stack.`);
      setStackInput("");
    }
  };

  const handlePop = () => {
    if (stackItems.length > 0) {
      const popped = stackItems[stackItems.length - 1];
      setStackItems(stackItems.slice(0, -1));
      setStackMessage(`Popped ${popped} from stack.`);
    }
  };

  const handleEnqueue = () => {
    const v = parseInt(queueInput, 10);
    if (!isNaN(v) && queueItems.length < 8) {
      setQueueItems([...queueItems, v]);
      setQueueMessage(`Enqueued ${v} to rear.`);
      setQueueInput("");
    }
  };

  const handleDequeue = () => {
    if (queueItems.length > 0) {
      const dequeued = queueItems[0];
      setQueueItems(queueItems.slice(1));
      setQueueMessage(`Dequeued ${dequeued} from front.`);
    }
  };

  const liveVariables = useMemo(() => {
    const vars = { target: targetVal };
    if (curBsStep?.low !== undefined) vars["low"] = curBsStep.low;
    if (curBsStep?.mid !== undefined) vars["mid"] = curBsStep.mid;
    if (curBsStep?.high !== undefined) vars["high"] = curBsStep.high;
    if (curBsStep?.mid >= 0 && bsArray[curBsStep.mid] !== undefined) vars["nums[mid]"] = bsArray[curBsStep.mid];
    return vars;
  }, [curBsStep, targetVal, bsArray]);

  const codeData = ALGORITHM_CODE_PHASES["binary-search"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Submode Switcher Tabs */}
      <div style={{
        background: "#0a0d16",
        border: "1px solid #1a2035",
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        {[
          { id: "binary-search", label: "Binary Search & Pointers" },
          { id: "stack", label: "Stack (LIFO)" },
          { id: "queue", label: "Queue (FIFO)" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubMode(tab.id)}
            style={{
              background: subMode === tab.id ? "#f59e0b22" : "#080b14",
              color: subMode === tab.id ? "#fbbf24" : "#94a3b8",
              border: `1px solid ${subMode === tab.id ? "#f59e0b" : "#1e293b"}`,
              borderRadius: 5,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Split Layout in Advanced Mode */}
      <div style={{
        display: "grid",
        gridTemplateColumns: (mode === "advanced" && subMode === "binary-search") ? "1fr 420px" : "1fr",
        gap: 16
      }}>
        {/* Left Column: Visual Structure */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* BINARY SEARCH VIEW */}
          {subMode === "binary-search" && (
            <div style={{
              background: "#0a0d16",
              border: "1px solid #1a2035",
              borderRadius: 10,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>Target Value:</span>
                <input
                  type="number"
                  value={targetVal}
                  onChange={e => setTargetVal(parseInt(e.target.value, 10) || 0)}
                  style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 5, color: "#f59e0b", padding: "4px 8px", fontSize: 12, fontWeight: 700, width: 60, textAlign: "center" }}
                />
                {[15, 45, 89].map(t => (
                  <button key={t} onClick={() => setTargetVal(t)} style={{ background: targetVal === t ? "#f59e0b22" : "#080b14", color: targetVal === t ? "#fbbf24" : "#94a3b8", border: `1px solid ${targetVal === t ? "#f59e0b" : "#1e293b"}`, borderRadius: 4, padding: "3px 8px", fontSize: 10, cursor: "pointer" }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Sorted Array Cells */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 2px", alignItems: "center" }}>
                {bsArray.map((val, idx) => {
                  const isLow = curBsStep?.low === idx;
                  const isHigh = curBsStep?.high === idx;
                  const isMid = curBsStep?.mid === idx;
                  const inRange = idx >= curBsStep?.low && idx <= curBsStep?.high;

                  let bg = inRange ? "#080b14" : "#06080f";
                  let border = inRange ? "1px solid #1e293b" : "1px solid #111827";
                  let color = inRange ? "#e2e8f0" : "#334155";

                  if (isMid) {
                    bg = curBsStep.status === "found" ? "#10b98133" : "#f59e0b22";
                    border = curBsStep.status === "found" ? "2px solid #10b981" : "2px solid #f59e0b";
                    color = curBsStep.status === "found" ? "#34d399" : "#fbbf24";
                  }

                  return (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 44 }}>
                      <div style={{ height: 14, display: "flex", gap: 2 }}>
                        {isLow && <span style={{ fontSize: 8, background: "#38bdf8", color: "#080b14", padding: "1px 3px", borderRadius: 2, fontWeight: 800 }}>L</span>}
                        {isHigh && <span style={{ fontSize: 8, background: "#ec4899", color: "#fff", padding: "1px 3px", borderRadius: 2, fontWeight: 800 }}>H</span>}
                      </div>
                      <div style={{ width: 44, height: 46, background: bg, border, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color }}>
                        {val}
                      </div>
                      <span style={{ fontSize: 9, color: isMid ? "#fbbf24" : "#475569" }}>{isMid ? "MID" : `[${idx}]`}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
                {curBsStep?.desc}
              </div>
            </div>
          )}

          {/* STACK VIEW */}
          {subMode === "stack" && (
            <div style={{ background: "#0a0d16", border: "1px solid #1a2035", borderRadius: 10, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" value={stackInput} onChange={e => setStackInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handlePush()} placeholder="Val" style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 5, color: "#e2e8f0", padding: "4px 8px", fontSize: 11, width: 70 }} />
                <button onClick={handlePush} style={{ background: "#f59e0b", color: "#080b14", border: "none", borderRadius: 5, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Push</button>
                <button onClick={handlePop} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Pop</button>
              </div>

              <div style={{ minHeight: 220, background: "#080b14", border: "1px dashed #1e293b", borderRadius: 6, padding: "16px", display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 6 }}>
                {stackItems.map((val, idx) => {
                  const isTop = idx === stackItems.length - 1;
                  return (
                    <div key={idx} style={{ width: 180, height: 36, background: isTop ? "#f59e0b22" : "#0d1321", border: `1px solid ${isTop ? "#f59e0b" : "#1e293b"}`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", color: isTop ? "#fbbf24" : "#e2e8f0", fontWeight: 700, fontSize: 13 }}>
                      <span style={{ fontSize: 10, color: "#64748b" }}>[{idx}]</span>
                      <span>{val}</span>
                      {isTop && <span style={{ fontSize: 8, background: "#f59e0b", color: "#080b14", padding: "1px 4px", borderRadius: 3 }}>TOP</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: "#fbbf24" }}>{stackMessage}</div>
            </div>
          )}

          {/* QUEUE VIEW */}
          {subMode === "queue" && (
            <div style={{ background: "#0a0d16", border: "1px solid #1a2035", borderRadius: 10, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" value={queueInput} onChange={e => setQueueInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEnqueue()} placeholder="Val" style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 5, color: "#e2e8f0", padding: "4px 8px", fontSize: 11, width: 70 }} />
                <button onClick={handleEnqueue} style={{ background: "#06b6d4", color: "#080b14", border: "none", borderRadius: 5, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Enqueue</button>
                <button onClick={handleDequeue} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 5, padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Dequeue</button>
              </div>

              <div style={{ minHeight: 140, background: "#080b14", border: "1px dashed #1e293b", borderRadius: 6, padding: "16px", display: "flex", alignItems: "center", gap: 8, overflowX: "auto" }}>
                {queueItems.map((val, idx) => (
                  <div key={idx} style={{ minWidth: 54, height: 64, background: idx === 0 ? "#06b6d422" : "#0d1321", border: `1px solid ${idx === 0 ? "#06b6d4" : "#1e293b"}`, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <span style={{ fontSize: 9, color: "#64748b" }}>[{idx}]</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{val}</span>
                    <span style={{ fontSize: 8, color: idx === 0 ? "#38bdf8" : "#64748b" }}>{idx === 0 ? "FRONT" : idx === queueItems.length - 1 ? "REAR" : ""}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#38bdf8" }}>{queueMessage}</div>
            </div>
          )}
        </div>

        {/* Right Column: Code Stepper Panel (in Advanced Mode for Binary Search) */}
        {mode === "advanced" && subMode === "binary-search" && (
          <CodeStepperPanel
            codeLines={codeData}
            activePhase={curBsStep?.codePhase}
            variables={liveVariables}
            title="Binary Search"
          />
        )}
      </div>

      {/* Binary search playback footer if binary search active */}
      {subMode === "binary-search" && (
        <div style={{ background: "#0a0d16", border: "1px solid #1a2035", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setBsStepIdx(0)} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 4, color: "#94a3b8", padding: "4px 8px", fontSize: 10, cursor: "pointer" }}><RotateCcw size={11} /></button>
            <button onClick={() => setBsPlaying(!bsPlaying)} style={{ background: bsPlaying ? "#f59e0b" : "#6366f1", border: "none", borderRadius: 4, color: "#fff", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              {bsPlaying ? <Pause size={11} /> : <Play size={11} />} {bsPlaying ? "Pause" : "Search"}
            </button>
            <button onClick={() => setBsStepIdx(i => Math.min(bsSteps.length - 1, i + 1))} disabled={bsStepIdx >= bsSteps.length - 1} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 4, color: bsStepIdx >= bsSteps.length - 1 ? "#334155" : "#e2e8f0", padding: "4px 8px", cursor: bsStepIdx >= bsSteps.length - 1 ? "not-allowed" : "pointer" }}><SkipForward size={11} /></button>
          </div>
          <span style={{ fontSize: 10, color: "#64748b" }}>Step {bsStepIdx + 1} of {bsSteps.length}</span>
        </div>
      )}
    </div>
  );
}
