import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles, Volume2, VolumeX, ArrowUpDown } from "lucide-react";
import CodeStepperPanel from "../components/CodeStepperPanel.jsx";
import { ALGORITHM_CODE_PHASES } from "../data/algorithmsData.js";

function playTone(freq = 440, type = "sine", duration = 0.06) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function generateMergeSortSteps(initialArr) {
  const steps = [];
  const arr = [...initialArr];
  let comparisons = 0, swaps = 0;

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    codePhase: "divide",
    desc: "Initial unsorted array. Preparing divide-and-conquer splitting.",
    comparisons,
    swaps
  });

  function merge(start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      comparisons++;
      steps.push({
        arr: [...arr],
        comparing: [start + i, mid + 1 + j],
        swapping: [],
        sorted: [],
        codePhase: "compare",
        desc: `Comparing left[${i}] (${left[i]}) with right[${j}] (${right[j]}).`,
        comparisons,
        swaps
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
        swaps++;
      }

      steps.push({
        arr: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        codePhase: "swapping",
        desc: `Placed ${arr[k]} into sorted index ${k}.`,
        comparisons,
        swaps
      });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        arr: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        codePhase: "swapping",
        desc: `Flushing remaining left ${arr[k]} to index ${k}.`,
        comparisons,
        swaps
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        arr: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        codePhase: "swapping",
        desc: `Flushing remaining right ${arr[k]} to index ${k}.`,
        comparisons,
        swaps
      });
      j++;
      k++;
    }
  }

  function mergeSortHelper(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);
    merge(start, mid, end);
  }

  mergeSortHelper(0, arr.length - 1);

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    sorted: arr.map((_, i) => i),
    codePhase: "done",
    desc: `✅ Merge Sort Complete in O(N log N) time.`,
    comparisons,
    swaps
  });

  return steps;
}

function generateQuickSortSteps(initialArr) {
  const steps = [];
  const arr = [...initialArr];
  let comparisons = 0, swaps = 0;

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    pivot: null,
    sorted: [],
    codePhase: "pivot",
    desc: "Starting Quick Sort. Partitioning arrays around pivot.",
    comparisons,
    swaps
  });

  function partition(low, high) {
    const pivotVal = arr[high];
    let i = low - 1;

    steps.push({
      arr: [...arr],
      comparing: [],
      swapping: [],
      pivot: high,
      sorted: [],
      codePhase: "pivot",
      desc: `Chosen pivot = ${pivotVal} at index ${high}.`,
      comparisons,
      swaps
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        arr: [...arr],
        comparing: [j, high],
        swapping: [],
        pivot: high,
        sorted: [],
        codePhase: "comparing",
        desc: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivotVal}).`,
        comparisons,
        swaps
      });

      if (arr[j] < pivotVal) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        steps.push({
          arr: [...arr],
          comparing: [],
          swapping: [i, j],
          pivot: high,
          sorted: [],
          codePhase: "swapping",
          desc: `Swapped arr[${i}] and arr[${j}] since ${arr[j]} < pivot.`,
          comparisons,
          swaps
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    steps.push({
      arr: [...arr],
      comparing: [],
      swapping: [i + 1, high],
      pivot: i + 1,
      sorted: [i + 1],
      codePhase: "swapping",
      desc: `Placed pivot ${pivotVal} into final sorted position at index ${i + 1}.`,
      comparisons,
      swaps
    });

    return i + 1;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, arr.length - 1);

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    pivot: null,
    sorted: arr.map((_, i) => i),
    codePhase: "done",
    desc: `✅ Quick Sort Complete!`,
    comparisons,
    swaps
  });

  return steps;
}

const DEFAULT_ARRAY = [42, 12, 88, 25, 65, 34, 91, 18, 50, 7];

export default function SortingViz({
  algorithmId = "merge-sort",
  mode = "simple"
}) {
  const [arr, setArr] = useState(DEFAULT_ARRAY);
  const [customInput, setCustomInput] = useState(DEFAULT_ARRAY.join(", "));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const steps = useMemo(() => {
    if (algorithmId === "quick-sort") return generateQuickSortSteps(arr);
    return generateMergeSortSteps(arr);
  }, [algorithmId, arr]);

  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [arr, algorithmId]);

  useEffect(() => {
    if (!soundEnabled) return;
    const current = steps[stepIdx];
    if (current && (current.comparing?.length || current.swapping?.length)) {
      const idx = current.swapping[0] ?? current.comparing[0];
      const val = current.arr[idx] || 50;
      playTone(200 + val * 8, "sine", 0.05);
    }
  }, [stepIdx, soundEnabled, steps]);

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
  const maxVal = Math.max(...(currentStep?.arr || [100]));

  const handleApplyCustom = () => {
    const parsed = customInput
      .split(/[,\s]+/)
      .map(x => parseInt(x.trim(), 10))
      .filter(x => !isNaN(x) && x >= 0);
    if (parsed.length > 1) setArr(parsed);
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 4) + 7;
    const newArr = Array.from({ length: len }, () => Math.floor(Math.random() * 90) + 10);
    setArr(newArr);
    setCustomInput(newArr.join(", "));
  };

  const liveVariables = useMemo(() => {
    const vars = {
      comparisons: currentStep?.comparisons || 0,
      swaps: currentStep?.swaps || 0
    };
    if (currentStep?.comparing?.length) vars["comparing_idx"] = currentStep.comparing;
    if (currentStep?.swapping?.length) vars["writing_idx"] = currentStep.swapping;
    if (currentStep?.pivot !== null && currentStep?.pivot !== undefined) vars["pivot_idx"] = currentStep.pivot;
    return vars;
  }, [currentStep]);

  const codeData = ALGORITHM_CODE_PHASES[algorithmId] || ALGORITHM_CODE_PHASES["merge-sort"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Controls Strip */}
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
          <button
            onClick={handleRandomize}
            style={{
              background: "#0d1321",
              color: "#38bdf8",
              border: "1px solid #0284c744",
              borderRadius: 5,
              padding: "5px 12px",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
          >
            <Sparkles size={12} /> Randomize
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: soundEnabled ? "#10b98122" : "#080b14",
              color: soundEnabled ? "#34d399" : "#64748b",
              border: `1px solid ${soundEnabled ? "#10b981" : "#1e293b"}`,
              borderRadius: 5,
              padding: "5px 10px",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: "pointer"
            }}
          >
            {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            Sound {soundEnabled ? "ON" : "OFF"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleApplyCustom()}
            placeholder="e.g. 40, 10, 80, 20"
            style={{
              background: "#080b14",
              border: "1px solid #1e293b",
              borderRadius: 5,
              color: "#e2e8f0",
              padding: "5px 10px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              width: 180
            }}
          />
          <button
            onClick={handleApplyCustom}
            style={{
              background: "#10b981",
              color: "#080b14",
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
        {/* Left Column: Visual Array Bars */}
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
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpDown size={14} color="#10b981" /> ANIMATED ARRAY BARS
            </span>
            <div style={{ display: "flex", gap: 14 }}>
              <span>Comparisons: <strong style={{ color: "#fbbf24" }}>{currentStep?.comparisons || 0}</strong></span>
              <span>Swaps: <strong style={{ color: "#ec4899" }}>{currentStep?.swaps || 0}</strong></span>
            </div>
          </div>

          {/* Bar chart canvas */}
          <div style={{
            height: 240,
            background: "#080b14",
            border: "1px solid #1e293b",
            borderRadius: 6,
            padding: "16px 20px 8px 20px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 10
          }}>
            {currentStep?.arr.map((val, idx) => {
              const isComparing = currentStep.comparing?.includes(idx);
              const isSwapping = currentStep.swapping?.includes(idx);
              const isPivot = currentStep.pivot === idx;
              const isSorted = currentStep.sorted?.includes(idx);

              let barColor = "#6366f1";
              if (isSorted) barColor = "#10b981";
              if (isPivot) barColor = "#06b6d4";
              if (isComparing) barColor = "#f59e0b";
              if (isSwapping) barColor = "#ec4899";

              const barHeightPct = Math.max(12, Math.round((val / maxVal) * 100));

              return (
                <div key={idx} style={{ flex: 1, maxWidth: 46, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8" }}>{val}</span>
                  <div style={{
                    width: "100%",
                    height: `${barHeightPct}%`,
                    background: barColor,
                    borderRadius: "4px 4px 1px 1px",
                    transition: "height 0.2s ease, background 0.2s ease"
                  }} />
                  <span style={{ fontSize: 9, color: "#475569" }}>{idx}</span>
                </div>
              );
            })}
          </div>

          <div style={{
            background: "#080b14",
            border: "1px solid #1e293b",
            borderRadius: 6,
            padding: "12px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "#e2e8f0"
          }}>
            {currentStep?.desc}
          </div>
        </div>

        {/* Right Column: Code Stepper Panel */}
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
          <button onClick={() => setStepIdx(0)} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: "#94a3b8", padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>
            <RotateCcw size={13} />
          </button>
          <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx === 0} style={{ background: "#0d1321", border: "1px solid #1e293b", borderRadius: 5, color: stepIdx === 0 ? "#334155" : "#e2e8f0", padding: "6px 10px", cursor: stepIdx === 0 ? "not-allowed" : "pointer" }}>
            <SkipBack size={13} />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: isPlaying ? "#f59e0b" : "#10b981", border: "none", borderRadius: 5, color: "#080b14", padding: "6px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? "Pause" : "Sort"}
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
          {[0.5, 1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{ background: speed === s ? "#10b98122" : "transparent", color: speed === s ? "#34d399" : "#64748b", border: `1px solid ${speed === s ? "#10b981" : "transparent"}`, borderRadius: 3, padding: "1px 6px", fontSize: 10, cursor: "pointer" }}>
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
