import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles, HelpCircle, BarChart2 } from "lucide-react";
import CodeStepperPanel from "../components/CodeStepperPanel.jsx";
import { ALGORITHM_CODE_PHASES } from "../data/algorithmsData.js";

const PRESETS = {
  "longest-equal-subarray": [
    { label: "Default", arr: [0, 1, 0, 0, 1, 1, 0, 1, 1, 0] },
    { label: "Leading Zeros", arr: [0, 0, 0, 1, 1, 1, 0, 1] },
    { label: "All Ones & Zeros", arr: [1, 1, 0, 0, 1, 1, 0, 0] },
    { label: "No Equal", arr: [1, 1, 1, 1] }
  ],
  "subarray-sum-k": [
    { label: "Default (K=3)", arr: [1, 2, 3, -2, 2, 1, -1, 3], k: 3 },
    { label: "Positive (K=5)", arr: [1, 4, 2, 3, 5, 1], k: 5 }
  ],
  "kadane": [
    { label: "LeetCode Default", arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
    { label: "All Negative", arr: [-8, -3, -6, -2, -5, -4] }
  ]
};

// Equal Subarray Steps Generator
function solveEqualSubarray(arr) {
  const steps = [];
  const map = { 0: -1 };
  let sum = 0, maxLen = 0, bestStart = -1, bestEnd = -1;

  steps.push({
    i: -1,
    phase: "init",
    codePhase: "init",
    sum: 0,
    map: { ...map },
    candidate: null,
    maxLen: 0,
    bestStart: -1,
    bestEnd: -1,
    desc: "Initialize prefix hashmap with sum 0 at index −1. Net 0 represents balanced 0s and 1s.",
    insight: "Trick: Map 0 → -1 and 1 → +1. Repeated prefix sum = balanced subarray between them!"
  });

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i] === 1 ? 1 : -1;
    sum += val;

    const step = {
      i,
      val,
      sum,
      map: { ...map },
      candidate: null,
      maxLen,
      bestStart,
      bestEnd,
      isNewBest: false,
      codePhase: "sum",
      desc: `Index ${i}: element = ${arr[i]} (${val > 0 ? '+1' : '−1'}). Running sum: ${sum}.`,
      insight: `Current running sum = ${sum}. Checking if ${sum} was seen before.`
    };

    if (map[sum] !== undefined) {
      const len = i - map[sum];
      step.candidate = { start: map[sum] + 1, end: i, len };
      step.codePhase = "hit";
      step.desc += ` Sum ${sum} was previously seen at index ${map[sum]}! Subarray [${map[sum] + 1}..${i}] has length ${len}.`;
      step.insight = `Repeated prefix sum! Subarray between index ${map[sum] + 1} and ${i} has net sum 0.`;

      if (len > maxLen) {
        maxLen = len;
        bestStart = map[sum] + 1;
        bestEnd = i;
        step.isNewBest = true;
        step.codePhase = "update";
        step.desc += " 🏆 New Maximum Found!";
      }
    } else {
      map[sum] = i;
      step.codePhase = "miss";
      step.desc += ` Sum ${sum} is new → recorded at index ${i}.`;
      step.insight = `First time seeing prefix sum ${sum}. Storing index ${i} to maximize future subarray length.`;
    }

    step.map = { ...map };
    step.maxLen = maxLen;
    step.bestStart = bestStart;
    step.bestEnd = bestEnd;
    steps.push(step);
  }

  steps.push({
    i: arr.length,
    phase: "done",
    codePhase: "done",
    sum,
    map: { ...map },
    candidate: null,
    maxLen,
    bestStart,
    bestEnd,
    desc: `✅ Finished! Longest balanced subarray is [${bestStart}..${bestEnd}] with length ${maxLen}.`,
    insight: maxLen > 0 ? `Subarray: [${arr.slice(bestStart, bestEnd + 1).join(', ')}]` : "No balanced subarray found."
  });

  return steps;
}

// Subarray Sum Equals K Steps Generator
function solveSubarraySumK(arr, k = 3) {
  const steps = [];
  const map = { 0: 1 };
  let sum = 0, count = 0;

  steps.push({
    i: -1,
    sum: 0,
    count: 0,
    codePhase: "init",
    map: { ...map },
    desc: `Target K = ${k}. Initialize prefix sum map with {0: 1}.`,
    insight: `Looking for prefix sum equal to (runningSum - K) at each step.`
  });

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    const target = sum - k;
    const matches = map[target] || 0;
    const newCount = count + matches;

    steps.push({
      i,
      val: arr[i],
      sum,
      target,
      matches,
      count: newCount,
      codePhase: matches > 0 ? "count_update" : "target",
      map: { ...map },
      desc: `Index ${i} (${arr[i]}): Running sum = ${sum}. Target needed = ${sum} - ${k} = ${target}.`,
      insight: matches > 0 
        ? `Found ${matches} previous prefix sum(s) of ${target}! Total count = ${newCount}.` 
        : `Target ${target} not in hashmap. Count remains ${count}.`
    });

    count = newCount;
    map[sum] = (map[sum] || 0) + 1;
  }

  steps.push({
    i: arr.length,
    sum,
    count,
    codePhase: "done",
    map: { ...map },
    desc: `✅ Complete! Total continuous subarrays with sum ${k} = ${count}.`,
    insight: `Total subarrays found = ${count}.`
  });

  return steps;
}

// Kadane's Steps Generator
function solveKadane(arr) {
  const steps = [];
  let cur = arr[0], max = arr[0];
  let start = 0, end = 0, tempStart = 0;

  steps.push({
    i: 0,
    cur,
    max,
    start: 0,
    end: 0,
    codePhase: "init",
    desc: `Initialize current sum = ${arr[0]}, max sum = ${arr[0]} at index 0.`,
    insight: "Kadane's: Decide whether to start a new subarray or extend current one."
  });

  for (let i = 1; i < arr.length; i++) {
    const val = arr[i];
    const restart = val > cur + val;
    cur = Math.max(val, cur + val);
    if (restart) tempStart = i;

    let isNewMax = false;
    if (cur > max) {
      max = cur;
      start = tempStart;
      end = i;
      isNewMax = true;
    }

    steps.push({
      i,
      val,
      cur,
      max,
      start,
      end,
      restart,
      isNewMax,
      codePhase: isNewMax ? "max_update" : restart ? "restart" : "loop",
      desc: `Index ${i} (val ${val}): curSum = ${cur}, maxSum = ${max}.`,
      insight: restart 
        ? `Starting fresh subarray at index ${i}.` 
        : `Extending current subarray with value ${val}.`
    });
  }

  steps.push({
    i: arr.length,
    cur,
    max,
    start,
    end,
    codePhase: "done",
    desc: `✅ Maximum Subarray Sum is ${max} across [${start}..${end}].`,
    insight: `Optimal Subarray: [${arr.slice(start, end + 1).join(', ')}] with sum ${max}.`
  });

  return steps;
}

export default function SubarrayViz({
  algorithmId = "longest-equal-subarray",
  mode = "simple"
}) {
  const presets = PRESETS[algorithmId] || PRESETS["longest-equal-subarray"];
  const [arr, setArr] = useState(presets[0].arr);
  const [targetK, setTargetK] = useState(presets[0].k ?? 3);
  const [customInput, setCustomInput] = useState(presets[0].arr.join(", "));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = useMemo(() => {
    if (algorithmId === "longest-equal-subarray") return solveEqualSubarray(arr);
    if (algorithmId === "subarray-sum-k") return solveSubarraySumK(arr, targetK);
    if (algorithmId === "kadane") return solveKadane(arr);
    return solveEqualSubarray(arr);
  }, [algorithmId, arr, targetK]);

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [arr, algorithmId, targetK]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const interval = setTimeout(() => {
      setStepIdx(idx => Math.min(idx + 1, steps.length - 1));
    }, 1000 / speed);
    return () => clearTimeout(interval);
  }, [isPlaying, stepIdx, steps.length, speed]);

  const currentStep = steps[stepIdx] || steps[0];

  const chartData = useMemo(() => {
    let running = 0;
    const data = [{ label: "·", sum: 0 }];
    for (let j = 0; j < arr.length; j++) {
      running += (algorithmId === "longest-equal-subarray" ? (arr[j] === 1 ? 1 : -1) : arr[j]);
      data.push({ label: `${j}`, sum: running });
    }
    return data;
  }, [arr, algorithmId]);

  const handleApplyCustom = () => {
    const parsed = customInput
      .split(/[,\s]+/)
      .map(x => parseInt(x.trim(), 10))
      .filter(x => !isNaN(x));
    if (parsed.length > 0) setArr(parsed);
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 5) + 6;
    const newArr = algorithmId === "longest-equal-subarray"
      ? Array.from({ length: len }, () => Math.round(Math.random()))
      : Array.from({ length: len }, () => Math.floor(Math.random() * 16) - 7);
    setArr(newArr);
    setCustomInput(newArr.join(", "));
  };

  // Variable watcher for Code panel
  const liveVariables = useMemo(() => {
    const vars = {};
    if (currentStep?.i !== undefined) vars["i"] = currentStep.i;
    if (currentStep?.val !== undefined) vars["val"] = currentStep.val;
    if (currentStep?.sum !== undefined) vars["running_sum"] = currentStep.sum;
    if (currentStep?.maxLen !== undefined) vars["max_len"] = currentStep.maxLen;
    if (currentStep?.count !== undefined) vars["count"] = currentStep.count;
    if (currentStep?.cur !== undefined) vars["cur_sum"] = currentStep.cur;
    if (currentStep?.max !== undefined) vars["max_sum"] = currentStep.max;
    return vars;
  }, [currentStep]);

  const codeData = ALGORITHM_CODE_PHASES[algorithmId] || ALGORITHM_CODE_PHASES["longest-equal-subarray"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Preset & Input Strip */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>PRESETS:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => { setArr(p.arr); if (p.k !== undefined) setTargetK(p.k); setCustomInput(p.arr.join(", ")); }}
              style={{
                background: JSON.stringify(arr) === JSON.stringify(p.arr) ? "#6366f122" : "#0d1321",
                color: JSON.stringify(arr) === JSON.stringify(p.arr) ? "#818cf8" : "#94a3b8",
                border: `1px solid ${JSON.stringify(arr) === JSON.stringify(p.arr) ? "#6366f1" : "#1e293b"}`,
                borderRadius: 5,
                padding: "5px 10px",
                fontSize: 11,
                cursor: "pointer"
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={handleRandomize}
            style={{
              background: "#0d1321",
              color: "#38bdf8",
              border: "1px solid #0284c744",
              borderRadius: 5,
              padding: "5px 10px",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
          >
            <Sparkles size={12} /> Random
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleApplyCustom()}
            placeholder="e.g. 0, 1, 0, 1"
            style={{
              background: "#080b14",
              border: "1px solid #1e293b",
              borderRadius: 5,
              color: "#e2e8f0",
              padding: "5px 10px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              width: 170
            }}
          />
          <button
            onClick={handleApplyCustom}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Set
          </button>
        </div>
      </div>

      {/* Main Grid: Split Layout in Advanced Mode */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mode === "advanced" ? "1fr 420px" : "1fr",
        gap: 16
      }}>
        {/* Left Column: Visual Representation & Graphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Array Cell Blocks */}
          <div style={{
            background: "#0a0d16",
            border: "1px solid #1a2035",
            borderRadius: 10,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", fontWeight: 700 }}>
              <span>ARRAY CELLS & STATE</span>
              <span>Step {stepIdx + 1} of {steps.length}</span>
            </div>

            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 2px", alignItems: "center" }}>
              {arr.map((val, idx) => {
                const isCurrent = idx === currentStep?.i;
                let inBest = false;
                if (algorithmId === "longest-equal-subarray") {
                  inBest = currentStep?.bestStart <= idx && idx <= currentStep?.bestEnd;
                } else if (algorithmId === "kadane") {
                  inBest = currentStep?.start <= idx && idx <= currentStep?.end;
                }

                let cellBg = "#080b14";
                let borderColor = "#1e293b";
                let textColor = "#94a3b8";

                if (isCurrent) {
                  borderColor = "#6366f1";
                  cellBg = "#6366f122";
                  textColor = "#e2e8f0";
                }
                if (inBest && currentStep?.maxLen > 0) {
                  borderColor = "#10b981";
                  cellBg = "#10b98122";
                  textColor = "#34d399";
                }

                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 46 }}>
                    <span style={{ fontSize: 9, color: isCurrent ? "#818cf8" : "#475569", fontWeight: 700 }}>[{idx}]</span>
                    <div style={{
                      width: 46,
                      height: 48,
                      background: cellBg,
                      border: `2px solid ${borderColor}`,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: textColor,
                      transition: "all 0.2s"
                    }}>
                      {val}
                    </div>
                    {isCurrent && (
                      <span style={{ fontSize: 8, background: "#6366f1", color: "#fff", padding: "1px 4px", borderRadius: 3, fontWeight: 800 }}>
                        i={idx}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Commentary Banner */}
            <div style={{
              background: "#080b14",
              border: "1px solid #1e293b",
              borderRadius: 6,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{currentStep?.desc}</div>
              <div style={{ fontSize: 11, color: "#818cf8", display: "flex", alignItems: "center", gap: 5 }}>
                <HelpCircle size={13} /> {currentStep?.insight}
              </div>
            </div>

            {/* Prefix Hashmap View */}
            <div style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>PREFIX SUM MAP:</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(currentStep?.map || {}).map(([k, v]) => (
                  <div key={k} style={{
                    background: currentStep?.sum === Number(k) ? "#6366f133" : "#0d1321",
                    border: `1px solid ${currentStep?.sum === Number(k) ? "#6366f1" : "#1a2740"}`,
                    borderRadius: 4,
                    padding: "3px 8px",
                    fontSize: 11
                  }}>
                    <span style={{ color: "#38bdf8", fontWeight: 700 }}>sum {k}</span>: <span style={{ color: "#34d399" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area Chart View */}
          <div style={{
            background: "#0a0d16",
            border: "1px solid #1a2035",
            borderRadius: 10,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#64748b" }}>
              <BarChart2 size={14} color="#6366f1" /> DYNAMIC PREFIX SUM AREA GRAPH
            </div>
            <div style={{ height: 160, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ background: "#080b14", border: "1px solid #1e293b", fontSize: 11 }} />
                  {currentStep?.sum !== undefined && (
                    <ReferenceLine y={currentStep.sum} stroke="#f59e0b" strokeDasharray="2 2" />
                  )}
                  <Area type="monotone" dataKey="sum" stroke="#6366f1" fill="#6366f133" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Code Stepper Panel (Advanced Mode) */}
        {mode === "advanced" && (
          <CodeStepperPanel
            codeLines={codeData}
            activePhase={currentStep?.codePhase}
            variables={liveVariables}
            title={algorithmId}
          />
        )}
      </div>

      {/* Playback Controls Scrubber */}
      <div style={{
        background: "#0a0d16",
        border: "1px solid #1a2035",
        borderRadius: 10,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setStepIdx(0)}
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 5,
              color: "#94a3b8",
              padding: "6px 10px",
              fontSize: 11,
              cursor: "pointer"
            }}
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() => setStepIdx(i => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 5,
              color: stepIdx === 0 ? "#334155" : "#e2e8f0",
              padding: "6px 10px",
              cursor: stepIdx === 0 ? "not-allowed" : "pointer"
            }}
          >
            <SkipBack size={13} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "#f59e0b" : "#6366f1",
              border: "none",
              borderRadius: 5,
              color: "#fff",
              padding: "6px 14px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
            disabled={stepIdx >= steps.length - 1}
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 5,
              color: stepIdx >= steps.length - 1 ? "#334155" : "#e2e8f0",
              padding: "6px 10px",
              cursor: stepIdx >= steps.length - 1 ? "not-allowed" : "pointer"
            }}
          >
            <SkipForward size={13} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, maxWidth: 360 }}>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={stepIdx}
            onChange={e => setStepIdx(parseInt(e.target.value, 10))}
            style={{ flex: 1, cursor: "pointer" }}
          />
          <span style={{ fontSize: 11, color: "#64748b", minWidth: 50, textAlign: "right" }}>
            {stepIdx + 1} / {steps.length}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? "#6366f122" : "transparent",
                color: speed === s ? "#818cf8" : "#64748b",
                border: `1px solid ${speed === s ? "#6366f1" : "transparent"}`,
                borderRadius: 3,
                padding: "1px 6px",
                fontSize: 10,
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
