import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Grid3X3, CheckCircle2 } from "lucide-react";
import CodeStepperPanel from "../components/CodeStepperPanel.jsx";
import { ALGORITHM_CODE_PHASES } from "../data/algorithmsData.js";

const KNAPSACK_PRESETS = [
  { label: "Classic (W=7)", weights: [1, 3, 4, 5], values: [1, 4, 5, 7], capacity: 7 },
  { label: "Small (W=5)", weights: [2, 1, 3, 2], values: [12, 10, 20, 15], capacity: 5 }
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
    codePhase: "init",
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
        codePhase: chosen === "include" ? "include" : "exclude",
        desc: chosen === "include"
          ? `Item ${i} (wt=${wt}, val=${val}) INCLUDED! dp[${i}][${w}] = ${val} + dp[${i-1}][${w-wt}] = ${dp[i][w]}.`
          : `Item ${i} (wt=${wt}) EXCLUDED: dp[${i}][${w}] = ${dp[i][w]}.`,
        formula: wt <= w 
          ? `dp[${i}][${w}] = max(${val} + dp[${i-1}][${w-wt}], dp[${i-1}][${w}]) = ${dp[i][w]}` 
          : `dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`
      });
    }
  }

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
    codePhase: "done",
    desc: `✅ Max Knapsack Value = ${dp[n][W]} with capacity ${W}.`,
    formula: `Selected items: ${selectedItems.map(it => `Item ${it.item} (val=${it.value})`).join(", ")}`
  });

  return steps;
}

export default function DynamicProgrammingViz({
  algorithmId = "knapsack-01",
  mode = "simple"
}) {
  const [presetIdx, setPresetIdx] = useState(0);
  const currentPreset = KNAPSACK_PRESETS[presetIdx];
  const [weights, setWeights] = useState(currentPreset.weights);
  const [values, setValues] = useState(currentPreset.values);
  const [capacity, setCapacity] = useState(currentPreset.capacity);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = useMemo(() => generateKnapsackSteps(weights, values, capacity), [weights, values, capacity]);

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

  const liveVariables = useMemo(() => {
    const vars = {};
    if (currentStep?.activeI !== undefined) vars["i (item)"] = currentStep.activeI;
    if (currentStep?.activeW !== undefined) vars["w (cap)"] = currentStep.activeW;
    if (currentStep?.wt !== undefined) vars["weight"] = currentStep.wt;
    if (currentStep?.val !== undefined) vars["value"] = currentStep.val;
    return vars;
  }, [currentStep]);

  const codeData = ALGORITHM_CODE_PHASES["knapsack-01"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Preset Control Strip */}
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
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>PRESETS:</span>
          {KNAPSACK_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => { setPresetIdx(idx); setWeights(p.weights); setValues(p.values); setCapacity(p.capacity); }}
              style={{
                background: presetIdx === idx ? "#ec489922" : "#0d1321",
                color: presetIdx === idx ? "#f472b6" : "#94a3b8",
                border: `1px solid ${presetIdx === idx ? "#ec4899" : "#1e293b"}`,
                borderRadius: 5,
                padding: "5px 10px",
                fontSize: 11,
                cursor: "pointer"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Capacity:</span>
          <input
            type="number"
            min={1}
            max={10}
            value={capacity}
            onChange={e => setCapacity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 5, color: "#ec4899", padding: "5px 8px", fontSize: 11, width: 50, textAlign: "center", fontWeight: 700 }}
          />
        </div>
      </div>

      {/* Main Grid: Split Layout in Advanced Mode */}
      <div style={{
        display: "grid",
        gridTemplateColumns: mode === "advanced" ? "1fr 420px" : "1fr",
        gap: 16
      }}>
        {/* Left Column: 2D DP Matrix Visualizer */}
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
              <Grid3X3 size={14} color="#ec4899" /> 2D DP MATRIX [Item × Capacity]
            </span>
            <span>Step {stepIdx + 1} of {steps.length}</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "separate", borderSpacing: "5px", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ color: "#64748b", fontSize: 10, padding: 6, textAlign: "left" }}>Item \ Cap</th>
                  {Array.from({ length: capacity + 1 }).map((_, c) => (
                    <th key={c} style={{ color: currentStep?.activeW === c ? "#ec4899" : "#64748b", fontSize: 10, padding: "6px 8px", textAlign: "center" }}>
                      W={c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStep?.dp.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ fontSize: 11, color: currentStep.activeI === rIdx ? "#f472b6" : "#94a3b8", padding: "6px 8px", whiteSpace: "nowrap" }}>
                      {rIdx === 0 ? "0 (None)" : `It ${rIdx} (wt=${weights[rIdx-1]}, v=${values[rIdx-1]})`}
                    </td>
                    {row.map((cellVal, cIdx) => {
                      const isActive = currentStep.activeI === rIdx && currentStep.activeW === cIdx;
                      let bg = "#080b14", border = "1px solid #1e293b", color = "#64748b";
                      if (cellVal > 0) color = "#e2e8f0";
                      if (isActive) { bg = "#ec489933"; border = "2px solid #ec4899"; color = "#f472b6"; }
                      return (
                        <td key={cIdx} style={{ textAlign: "center", padding: "8px 10px", background: bg, border, borderRadius: 5, fontSize: 12, fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>
                          {cellVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: "#080b14", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{currentStep?.desc}</div>
            <div style={{ fontSize: 11, color: "#f472b6", fontFamily: "'JetBrains Mono', monospace" }}>{currentStep?.formula}</div>
          </div>

          {currentStep?.selectedItems && (
            <div style={{ background: "#10b98111", border: "1px solid #10b981", borderRadius: 6, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} color="#10b981" />
              <div style={{ fontSize: 11, color: "#34d399", fontWeight: 700 }}>
                OPTIMAL ITEMS: {currentStep.selectedItems.map(it => `Item ${it.item} (val=${it.value})`).join(" + ")}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Stepper Panel */}
        {mode === "advanced" && (
          <CodeStepperPanel
            codeLines={codeData}
            activePhase={currentStep?.codePhase}
            variables={liveVariables}
            title="0/1 Knapsack DP"
          />
        )}
      </div>

      {/* Playback Controls */}
      <div style={{ background: "#0a0d16", border: "1px solid #1a2035", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setStepIdx(0)} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: "#94a3b8", padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>
            <RotateCcw size={13} />
          </button>
          <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx === 0} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: stepIdx === 0 ? "#334155" : "#e2e8f0", padding: "6px 10px", cursor: stepIdx === 0 ? "not-allowed" : "pointer" }}>
            <SkipBack size={13} />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: isPlaying ? "#f59e0b" : "#ec4899", border: "none", borderRadius: 5, color: "#fff", padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? "Pause" : "Solve DP"}
          </button>
          <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} disabled={stepIdx >= steps.length - 1} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: stepIdx >= steps.length - 1 ? "#334155" : "#e2e8f0", padding: "6px 10px", cursor: stepIdx >= steps.length - 1 ? "not-allowed" : "pointer" }}>
            <SkipForward size={13} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, maxWidth: 360 }}>
          <input type="range" min={0} max={steps.length - 1} value={stepIdx} onChange={e => setStepIdx(parseInt(e.target.value, 10))} style={{ flex: 1, cursor: "pointer" }} />
          <span style={{ fontSize: 11, color: "#64748b", minWidth: 50, textAlign: "right" }}>{stepIdx + 1} / {steps.length}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{ background: speed === s ? "#ec489922" : "transparent", color: speed === s ? "#f472b6" : "#64748b", border: `1px solid ${speed === s ? "#ec4899" : "transparent"}`, borderRadius: 3, padding: "1px 6px", fontSize: 10, cursor: "pointer" }}>
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
