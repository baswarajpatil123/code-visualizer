import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles, HelpCircle, BarChart2 } from "lucide-react";

const PRESETS = {
  "longest-equal-subarray": [
    { label: "Default (Alternating)", arr: [0, 1, 0, 0, 1, 1, 0, 1, 1, 0] },
    { label: "Leading Zeros", arr: [0, 0, 0, 1, 1, 1, 0, 1] },
    { label: "All Ones & Zeros", arr: [1, 1, 0, 0, 1, 1, 0, 0] },
    { label: "Odd Length", arr: [0, 1, 1, 0, 1] },
    { label: "No Equal", arr: [1, 1, 1, 1] }
  ],
  "subarray-sum-k": [
    { label: "Default (Target K=3)", arr: [1, 2, 3, -2, 2, 1, -1, 3], k: 3 },
    { label: "All Positive (K=5)", arr: [1, 4, 2, 3, 5, 1], k: 5 },
    { label: "With Zeros (K=0)", arr: [1, -1, 0, 1, -1], k: 0 }
  ],
  "kadane": [
    { label: "LeetCode Default", arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
    { label: "All Negative", arr: [-8, -3, -6, -2, -5, -4] },
    { label: "All Positive", arr: [5, 4, 1, 7, 8] },
    { label: "Alternating Sign", arr: [3, -2, 5, -1, 4] }
  ]
};

// Generate steps for Longest Equal Subarray
function solveEqualSubarray(arr) {
  const steps = [];
  const map = { 0: -1 };
  let sum = 0, maxLen = 0, bestStart = -1, bestEnd = -1;

  steps.push({
    i: -1,
    phase: "init",
    sum: 0,
    map: { ...map },
    candidate: null,
    maxLen: 0,
    bestStart: -1,
    bestEnd: -1,
    desc: "Initialize prefix hashmap with sum 0 at index −1. Net 0 represents balanced 0s and 1s.",
    insight: "Trick: Map 0 → -1 and 1 → +1. Whenever a running sum repeats, the subarray between them is balanced!"
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
      desc: `Index ${i}: element = ${arr[i]} (${val > 0 ? '+1' : '−1'}). Running sum: ${sum}.`,
      insight: `Current running sum = ${sum}. Checking if ${sum} was seen in prefix map.`
    };

    if (map[sum] !== undefined) {
      const len = i - map[sum];
      step.candidate = { start: map[sum] + 1, end: i, len };
      step.desc += ` Sum ${sum} was previously seen at index ${map[sum]}! Subarray [${map[sum] + 1}..${i}] has length ${len}.`;
      step.insight = `Repeated prefix sum! Subarray between index ${map[sum] + 1} and ${i} has net sum 0 (equal 0s & 1s).`;

      if (len > maxLen) {
        maxLen = len;
        bestStart = map[sum] + 1;
        bestEnd = i;
        step.isNewBest = true;
        step.desc += " 🏆 New Maximum Found!";
      }
    } else {
      map[sum] = i;
      step.desc += ` Sum ${sum} is new → recorded at index ${i}.`;
      step.insight = `First time seeing prefix sum ${sum}. Storing index ${i} to maximize subarray length in future occurrences.`;
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
    sum,
    map: { ...map },
    candidate: null,
    maxLen,
    bestStart,
    bestEnd,
    desc: `✅ Finished! Longest balanced subarray is [${bestStart}..${bestEnd}] with length ${maxLen}.`,
    insight: maxLen > 0 ? `Balanced subarray: [${arr.slice(bestStart, bestEnd + 1).join(', ')}]` : "No balanced subarray found."
  });

  return steps;
}

// Generate steps for Subarray Sum Equals K
function solveSubarraySumK(arr, k = 3) {
  const steps = [];
  const map = { 0: 1 };
  let sum = 0, count = 0;

  steps.push({
    i: -1,
    sum: 0,
    count: 0,
    map: { ...map },
    desc: `Target K = ${k}. Initialize prefix sum map with {0: 1} to handle subarrays starting at index 0.`,
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
      map: { ...map },
      desc: `Index ${i} (${arr[i]}): Running sum = ${sum}. Target needed (sum - K) = ${sum} - ${k} = ${target}.`,
      insight: matches > 0 
        ? `Found ${matches} previous prefix sum(s) of ${target}! Subarrays summing to ${k} increased by +${matches}.` 
        : `Target ${target} not in hashmap. Count remains ${count}.`
    });

    count = newCount;
    map[sum] = (map[sum] || 0) + 1;
  }

  steps.push({
    i: arr.length,
    sum,
    count,
    map: { ...map },
    desc: `✅ Complete! Total continuous subarrays with sum ${k} = ${count}.`,
    insight: `Total subarrays found = ${count}.`
  });

  return steps;
}

// Generate steps for Kadane's algorithm
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
    desc: `Initialize current sum = ${arr[0]}, max sum = ${arr[0]} at index 0.`,
    insight: "Kadane's: At each index, decide whether to start a new subarray or extend current one."
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
      desc: `Index ${i} (value ${val}): curSum = max(${val}, ${cur - val} + ${val}) = ${cur}.`,
      insight: restart 
        ? `Previous sum was negative, so starting fresh subarray at index ${i}.` 
        : `Extending current subarray with value ${val}.`
    });
  }

  steps.push({
    i: arr.length,
    cur,
    max,
    start,
    end,
    desc: `✅ Maximum Subarray Sum is ${max} across index range [${start}..${end}].`,
    insight: `Optimal Subarray: [${arr.slice(start, end + 1).join(', ')}] with sum ${max}.`
  });

  return steps;
}

export default function SubarrayViz({ algorithmId = "longest-equal-subarray" }) {
  const presets = PRESETS[algorithmId] || PRESETS["longest-equal-subarray"];
  const [arr, setArr] = useState(presets[0].arr);
  const [targetK, setTargetK] = useState(presets[0].k ?? 3);
  const [customInput, setCustomInput] = useState(presets[0].arr.join(", "));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showGraph, setShowGraph] = useState(true);

  // Re-generate steps when array or targetK changes
  const steps = useMemo(() => {
    if (algorithmId === "longest-equal-subarray") return solveEqualSubarray(arr);
    if (algorithmId === "subarray-sum-k") return solveSubarraySumK(arr, targetK);
    if (algorithmId === "kadane") return solveKadane(arr);
    return solveEqualSubarray(arr);
  }, [algorithmId, arr, targetK]);

  // Reset playback on algorithm switch or array change
  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [arr, algorithmId, targetK]);

  // Auto-play timer
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

  // Chart data for prefix sum graph
  const chartData = useMemo(() => {
    let running = 0;
    const data = [{ index: -1, label: "Start", sum: 0, active: stepIdx === 0 }];
    for (let j = 0; j < arr.length; j++) {
      if (algorithmId === "longest-equal-subarray") {
        running += arr[j] === 1 ? 1 : -1;
      } else {
        running += arr[j];
      }
      data.push({
        index: j,
        label: `i=${j}`,
        val: arr[j],
        sum: running,
        active: j === currentStep?.i
      });
    }
    return data;
  }, [arr, algorithmId, currentStep?.i, stepIdx]);

  const handleApplyCustom = () => {
    try {
      const parsed = customInput
        .split(/[,\s]+/)
        .map(x => parseInt(x.trim(), 10))
        .filter(x => !isNaN(x));
      if (parsed.length > 0) {
        setArr(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 6) + 6;
    let newArr;
    if (algorithmId === "longest-equal-subarray") {
      newArr = Array.from({ length: len }, () => Math.round(Math.random()));
    } else if (algorithmId === "kadane") {
      newArr = Array.from({ length: len }, () => Math.floor(Math.random() * 20) - 9);
    } else {
      newArr = Array.from({ length: len }, () => Math.floor(Math.random() * 10) - 3);
    }
    setArr(newArr);
    setCustomInput(newArr.join(", "));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Control Strip & Presets */}
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
        {/* Preset Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setArr(p.arr);
                if (p.k !== undefined) setTargetK(p.k);
                setCustomInput(p.arr.join(", "));
              }}
              style={{
                background: JSON.stringify(arr) === JSON.stringify(p.arr) ? "#6366f122" : "#080b14",
                color: JSON.stringify(arr) === JSON.stringify(p.arr) ? "#818cf8" : "#94a3b8",
                border: `1px solid ${JSON.stringify(arr) === JSON.stringify(p.arr) ? "#6366f1" : "#1e293b"}`,
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={handleRandomize}
            style={{
              background: "#080b14",
              color: "#38bdf8",
              border: "1px solid #0284c744",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
          >
            <Sparkles size={14} /> Random
          </button>
        </div>

        {/* Custom Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleApplyCustom()}
            placeholder="e.g. 0, 1, 0, 1, 1"
            style={{
              background: "#080b14",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: "#e2e8f0",
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              width: 180
            }}
          />
          {algorithmId === "subarray-sum-k" && (
            <input
              type="number"
              value={targetK}
              onChange={e => setTargetK(parseInt(e.target.value, 10) || 0)}
              title="Target K"
              style={{
                background: "#080b14",
                border: "1px solid #1e293b",
                borderRadius: 6,
                color: "#f59e0b",
                padding: "6px 8px",
                fontSize: 12,
                width: 60,
                textAlign: "center"
              }}
            />
          )}
          <button
            onClick={handleApplyCustom}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Set
          </button>
        </div>
      </div>

      {/* Array Visual Elements View */}
      <div style={{
        background: "#0d1321",
        border: "1px solid #1a2740",
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 1 }}>
            ARRAY ELEMENTS & POINTER INSPECTION
          </span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Step {stepIdx + 1} of {steps.length}
          </span>
        </div>

        {/* Array Cells */}
        <div style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "10px 4px",
          alignItems: "center"
        }}>
          {arr.map((val, idx) => {
            const isCurrent = idx === currentStep?.i;
            let isInBest = false;
            if (algorithmId === "longest-equal-subarray") {
              isInBest = currentStep?.bestStart <= idx && idx <= currentStep?.bestEnd;
            } else if (algorithmId === "kadane") {
              isInBest = currentStep?.start <= idx && idx <= currentStep?.end;
            }
            const isCandidate = currentStep?.candidate && idx >= currentStep.candidate.start && idx <= currentStep.candidate.end;

            let bgColor = "#080b14";
            let borderColor = "#1e293b";
            let textColor = "#94a3b8";

            if (isCurrent) {
              borderColor = "#6366f1";
              bgColor = "#6366f122";
              textColor = "#e2e8f0";
            }
            if (isCandidate) {
              borderColor = "#f59e0b";
              bgColor = "#f59e0b22";
              textColor = "#fbbf24";
            }
            if (isInBest && currentStep?.maxLen > 0) {
              borderColor = "#10b981";
              bgColor = "#10b98122";
              textColor = "#34d399";
            }

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 52
                }}
              >
                <span style={{ fontSize: 10, color: isCurrent ? "#818cf8" : "#475569", fontWeight: 600 }}>
                  [{idx}]
                </span>
                <div
                  style={{
                    width: 52,
                    height: 56,
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: textColor,
                    transition: "all 0.25s ease",
                    boxShadow: isCurrent ? "0 0 12px rgba(99, 102, 241, 0.4)" : "none"
                  }}
                >
                  {val}
                </div>
                {/* Pointer indicator */}
                <div style={{ height: 16, display: "flex", alignItems: "center" }}>
                  {isCurrent && (
                    <span style={{ fontSize: 10, background: "#6366f1", color: "#fff", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                      i={idx}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Commentary Banner */}
        <div style={{
          background: "#080b14",
          border: `1px solid ${currentStep?.isNewBest ? "#10b981" : "#1e293b"}`,
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>
            {currentStep?.desc}
          </div>
          <div style={{ fontSize: 12, color: "#818cf8", display: "flex", alignItems: "center", gap: 6 }}>
            <HelpCircle size={14} /> {currentStep?.insight}
          </div>
        </div>

        {/* Hashmap State / Stats Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Prefix Hashmap View */}
          <div style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>
              PREFIX SUM HASHMAP
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(currentStep?.map || {}).map(([sKey, sVal]) => (
                <div
                  key={sKey}
                  style={{
                    background: currentStep?.sum === Number(sKey) ? "#6366f133" : "#0d1321",
                    border: `1px solid ${currentStep?.sum === Number(sKey) ? "#6366f1" : "#1a2740"}`,
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 11,
                    display: "flex",
                    gap: 6
                  }}
                >
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>sum {sKey}</span>
                  <span style={{ color: "#64748b" }}>→</span>
                  <span style={{ color: "#34d399", fontWeight: 700 }}>{algorithmId === "subarray-sum-k" ? `count ${sVal}` : `idx ${sVal}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Running Stats */}
          <div style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 8, padding: 14, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            {algorithmId === "longest-equal-subarray" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#64748b" }}>Best Subarray Length:</span>
                  <span style={{ color: "#34d399", fontWeight: 700 }}>{currentStep?.maxLen || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#64748b" }}>Best Range:</span>
                  <span style={{ color: "#818cf8", fontWeight: 700 }}>
                    {currentStep?.maxLen > 0 ? `[${currentStep.bestStart}..${currentStep.bestEnd}]` : "None"}
                  </span>
                </div>
              </>
            )}
            {algorithmId === "subarray-sum-k" && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#64748b" }}>Subarrays Summing to K={targetK}:</span>
                <span style={{ color: "#34d399", fontWeight: 700, fontSize: 16 }}>{currentStep?.count || 0}</span>
              </div>
            )}
            {algorithmId === "kadane" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#64748b" }}>Current Running Sum:</span>
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>{currentStep?.cur}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "#64748b" }}>Global Max Sum:</span>
                  <span style={{ color: "#34d399", fontWeight: 700, fontSize: 16 }}>{currentStep?.max}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Prefix Sum Dynamic Graph View */}
      {showGraph && (
        <div style={{
          background: "#0d1321",
          border: "1px solid #1a2740",
          borderRadius: 12,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>
              <BarChart2 size={16} color="#6366f1" />
              DYNAMIC PREFIX SUM GRAPH
            </div>
            <span style={{ fontSize: 11, color: "#64748b" }}>
              Horizontal lines at same height indicate identical prefix sums!
            </span>
          </div>

          <div style={{ height: 180, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" />
                {currentStep?.sum !== undefined && (
                  <ReferenceLine y={currentStep.sum} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: `Current Sum: ${currentStep.sum}`, fill: "#f59e0b", fontSize: 11 }} />
                )}
                <Area type="monotone" dataKey="sum" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSum)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Playback Controls Scrubber */}
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
        {/* Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setStepIdx(0)}
            title="Reset to beginning"
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
            onClick={() => setStepIdx(i => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
            title="Previous Step"
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: stepIdx === 0 ? "#334155" : "#e2e8f0",
              padding: "8px 12px",
              cursor: stepIdx === 0 ? "not-allowed" : "pointer"
            }}
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "#f59e0b" : "#6366f1",
              border: "none",
              borderRadius: 6,
              color: "#fff",
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
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
            disabled={stepIdx >= steps.length - 1}
            title="Next Step"
            style={{
              background: "#0d1321",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: stepIdx >= steps.length - 1 ? "#334155" : "#e2e8f0",
              padding: "8px 12px",
              cursor: stepIdx >= steps.length - 1 ? "not-allowed" : "pointer"
            }}
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Step Scrubber Slider */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 380 }}>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={stepIdx}
            onChange={e => setStepIdx(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: "#6366f1", cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, color: "#64748b", minWidth: 60, textAlign: "right" }}>
            {stepIdx + 1} / {steps.length}
          </span>
        </div>

        {/* Speed Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2, 3].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? "#6366f122" : "transparent",
                color: speed === s ? "#818cf8" : "#64748b",
                border: `1px solid ${speed === s ? "#6366f1" : "transparent"}`,
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
