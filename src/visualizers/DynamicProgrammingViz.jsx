import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Grid3X3, CheckCircle2 } from "lucide-react";

const KNAPSACK_PRESETS = [
  {
    label: "Classic (W=7)",
    weights: [1, 3, 4, 5],
    values: [1, 4, 5, 7],
    capacity: 7
  },
  {
    label: "Small (W=5)",
    weights: [2, 1, 3, 2],
    values: [12, 10, 20, 15],
    capacity: 5
  },
  {
    label: "Uniform (W=6)",
    weights: [2, 3, 4],
    values: [3, 4, 5],
    capacity: 6
  }
];

function generateKnapsackSteps(weights, values, capacity) {
  const n = weights.length;
  const W = capacity;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  const steps = [];

  steps.push({
    dp: dp.map(row => [...row]),
    activeI: 0,
    activeW: 0,
    dependExclude: null,
    dependInclude: null,
    chosen: null,
    desc: "Initialize DP table with base case: 0 items or 0 capacity yields 0 value.",
    formula: "dp[0][w] = 0 and dp[i][0] = 0"
  });

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];

    for (let w = 1; w <= W; w++) {
      let excludeVal = dp[i - 1][w];
      let includeVal = -1;
      let chosen = "exclude";

      const dependExclude = { r: i - 1, c: w };
      let dependInclude = null;

      if (wt <= w) {
        includeVal = val + dp[i - 1][w - wt];
        dependInclude = { r: i - 1, c: w - wt };
        if (includeVal > excludeVal) {
          dp[i][w] = includeVal;
          chosen = "include";
        } else {
          dp[i][w] = excludeVal;
        }
      } else {
        dp[i][w] = excludeVal;
        chosen = "too_heavy";
      }

      steps.push({
        dp: dp.map(row => [...row]),
        activeI: i,
        activeW: w,
        itemIdx: i - 1,
        wt,
        val,
        dependExclude,
        dependInclude,
        excludeVal,
        includeVal,
        chosen,
        desc: chosen === "include"
          ? `Item ${i} (wt=${wt}, val=${val}) INCLUDED! dp[${i}][${w}] = ${val} + dp[${i-1}][${w-wt}] (${val} + ${dp[i-1][w-wt]}) = ${dp[i][w]}.`
          : chosen === "exclude"
          ? `Item ${i} (wt=${wt}, val=${val}) EXCLUDED: Exclude value (${excludeVal}) >= Include value (${includeVal}).`
          : `Item ${i} (wt=${wt}) is heavier than current capacity ${w} → Must exclude (carry over ${excludeVal}).`,
        formula: wt <= w 
          ? `dp[${i}][${w}] = max(${val} + dp[${i-1}][${w-wt}], dp[${i-1}][${w}]) = ${dp[i][w]}` 
          : `dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`
      });
    }
  }

  // Backtrack selected items
  const selectedItems = [];
  let curW = W;
  for (let i = n; i > 0; i--) {
    if (dp[i][curW] !== dp[i - 1][curW]) {
      selectedItems.push({ item: i, weight: weights[i - 1], value: values[i - 1] });
      curW -= weights[i - 1];
    }
  }

  steps.push({
    dp: dp.map(row => [...row]),
    activeI: n,
    activeW: W,
    selectedItems,
    desc: `✅ Maximum Knapsack Value is ${dp[n][W]} with capacity ${W}! Backtracking optimal items.`,
    formula: `Optimal items: ${selectedItems.map(it => `Item ${it.item} (val=${it.value})`).join(", ")}`
  });

  return steps;
}

export default function DynamicProgrammingViz() {
  const [presetIdx, setPresetIdx] = useState(0);
  const currentPreset = KNAPSACK_PRESETS[presetIdx];
  const [weights, setWeights] = useState(currentPreset.weights);
  const [values, setValues] = useState(currentPreset.values);
  const [capacity, setCapacity] = useState(currentPreset.capacity);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = useMemo(() => {
    return generateKnapsackSteps(weights, values, capacity);
  }, [weights, values, capacity]);

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [weights, values, capacity]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const interval = setTimeout(() => {
      setStepIdx(idx => Math.min(idx + 1, steps.length - 1));
    }, 700 / speed);
    return () => clearTimeout(interval);
  }, [isPlaying, stepIdx, steps.length, speed]);

  const currentStep = steps[stepIdx] || steps[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Preset Control Strip */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Presets:</span>
          {KNAPSACK_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPresetIdx(idx);
                setWeights(p.weights);
                setValues(p.values);
                setCapacity(p.capacity);
              }}
              style={{
                background: presetIdx === idx ? "#ec489922" : "#080b14",
                color: presetIdx === idx ? "#f472b6" : "#94a3b8",
                border: `1px solid ${presetIdx === idx ? "#ec4899" : "#1e293b"}`,
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Capacity Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Capacity (W):</span>
          <input
            type="number"
            min={1}
            max={12}
            value={capacity}
            onChange={e => setCapacity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            style={{
              background: "#080b14",
              border: "1px solid #1e293b",
              borderRadius: 6,
              color: "#ec4899",
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
              width: 60,
              textAlign: "center"
            }}
          />
        </div>
      </div>

      {/* 2D DP Matrix Visualizer */}
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
            <Grid3X3 size={16} color="#ec4899" />
            2D DYNAMIC PROGRAMMING MATRIX [Item × Capacity]
          </div>

          <span style={{ fontSize: 12, color: "#64748b" }}>
            Step {stepIdx + 1} of {steps.length}
          </span>
        </div>

        {/* DP Table */}
        <div style={{ overflowX: "auto", padding: "8px 0" }}>
          <table style={{ borderCollapse: "separate", borderSpacing: "6px", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ color: "#64748b", fontSize: 11, padding: 8, textAlign: "left" }}>Item \ Cap</th>
                {Array.from({ length: capacity + 1 }).map((_, c) => (
                  <th
                    key={c}
                    style={{
                      color: currentStep?.activeW === c ? "#ec4899" : "#64748b",
                      fontSize: 11,
                      padding: "8px 12px",
                      textAlign: "center",
                      background: currentStep?.activeW === c ? "#ec489911" : "transparent",
                      borderRadius: 4
                    }}
                  >
                    W={c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentStep?.dp.map((row, rIdx) => {
                const isCurrentRow = currentStep.activeI === rIdx;
                const rowLabel = rIdx === 0 ? "None" : `Item ${rIdx} (wt=${weights[rIdx - 1]}, val=${values[rIdx - 1]})`;

                return (
                  <tr key={rIdx}>
                    <td style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isCurrentRow ? "#f472b6" : "#94a3b8",
                      padding: "8px 12px",
                      whiteSpace: "nowrap",
                      background: isCurrentRow ? "#ec489911" : "transparent",
                      borderRadius: 4
                    }}>
                      {rowLabel}
                    </td>

                    {row.map((cellVal, cIdx) => {
                      const isActiveCell = currentStep.activeI === rIdx && currentStep.activeW === cIdx;
                      const isExcludeDep = currentStep.dependExclude?.r === rIdx && currentStep.dependExclude?.c === cIdx;
                      const isIncludeDep = currentStep.dependInclude?.r === rIdx && currentStep.dependInclude?.c === cIdx;

                      let cellBg = "#080b14";
                      let border = "1px solid #1e293b";
                      let textColor = "#64748b";

                      if (cellVal > 0) textColor = "#e2e8f0";

                      if (isExcludeDep) {
                        cellBg = "#38bdf822";
                        border = "2px solid #38bdf8";
                        textColor = "#38bdf8";
                      }
                      if (isIncludeDep) {
                        cellBg = "#10b98122";
                        border = "2px solid #10b981";
                        textColor = "#34d399";
                      }
                      if (isActiveCell) {
                        cellBg = "#ec489933";
                        border = "2px solid #ec4899";
                        textColor = "#f472b6";
                      }

                      return (
                        <td
                          key={cIdx}
                          style={{
                            textAlign: "center",
                            padding: "10px 14px",
                            background: cellBg,
                            border,
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 700,
                            color: textColor,
                            fontFamily: "'JetBrains Mono', monospace",
                            transition: "all 0.2s ease"
                          }}
                        >
                          {cellVal}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Step Formula & Explanation */}
        <div style={{
          background: "#080b14",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "14px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
            {currentStep?.desc}
          </div>
          <div style={{ fontSize: 12, color: "#f472b6", fontFamily: "'JetBrains Mono', monospace" }}>
            {currentStep?.formula}
          </div>
        </div>

        {/* Backtracked optimal items if complete */}
        {currentStep?.selectedItems && (
          <div style={{
            background: "#10b98111",
            border: "1px solid #10b981",
            borderRadius: 8,
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <CheckCircle2 size={20} color="#10b981" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#34d399" }}>
                SELECTED KNAPSACK ITEMS:
              </div>
              <div style={{ fontSize: 12, color: "#e2e8f0", marginTop: 2 }}>
                {currentStep.selectedItems.map(it => `Item ${it.item} (Weight: ${it.weight}, Value: ${it.value})`).join(" + ")}
              </div>
            </div>
          </div>
        )}
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
            onClick={() => setStepIdx(i => Math.max(0, i - 1))}
            disabled={stepIdx === 0}
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
              background: isPlaying ? "#f59e0b" : "#ec4899",
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
            {isPlaying ? "Pause" : "Solve DP"}
          </button>
          <button
            onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
            disabled={stepIdx >= steps.length - 1}
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

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 380 }}>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={stepIdx}
            onChange={e => setStepIdx(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: "#ec4899", cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, color: "#64748b", minWidth: 60, textAlign: "right" }}>
            {stepIdx + 1} / {steps.length}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? "#ec489922" : "transparent",
                color: speed === s ? "#f472b6" : "#64748b",
                border: `1px solid ${speed === s ? "#ec4899" : "transparent"}`,
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
