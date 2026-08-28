import React, { useState, useEffect, useMemo } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles, Volume2, VolumeX, ArrowUpDown } from "lucide-react";

// Web Audio API helper for sound effects on comparison/swap
function playTone(freq = 440, type = "sine", duration = 0.08) {
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
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

// Generate Merge Sort Steps
function generateMergeSortSteps(initialArr) {
  const steps = [];
  const arr = [...initialArr];

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    desc: "Initial unsorted array before divide-and-conquer.",
    comparisons: 0,
    swaps: 0
  });

  let comparisons = 0;
  let swaps = 0;

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
        desc: `Placed value ${arr[k]} into index ${k}.`,
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
        desc: `Flushing remaining left element ${arr[k]} to index ${k}.`,
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
        desc: `Flushing remaining right element ${arr[k]} to index ${k}.`,
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
    desc: `✅ Merge Sort Complete! Array sorted in O(N log N) time.`,
    comparisons,
    swaps
  });

  return steps;
}

// Generate Quick Sort Steps
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
    desc: "Starting Quick Sort. Pivot selection and partitioning.",
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
      desc: `Chosen pivot value = ${pivotVal} at index ${high}.`,
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
          desc: `arr[${j}] < pivot: Swapped arr[${i}] and arr[${j}].`,
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
      desc: `Placed pivot ${pivotVal} into its final sorted position at index ${i + 1}.`,
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
    desc: `✅ Quick Sort Complete! Partitioning finished.`,
    comparisons,
    swaps
  });

  return steps;
}

// Generate Bubble Sort Steps
function generateBubbleSortSteps(initialArr) {
  const steps = [];
  const arr = [...initialArr];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const sortedIndices = [];

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    desc: "Starting Bubble Sort. Comparing adjacent pairs.",
    comparisons,
    swaps
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        arr: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices],
        desc: `Comparing adjacent arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
        comparisons,
        swaps
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        swaps++;
        steps.push({
          arr: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          desc: `Swapping ${arr[j + 1]} and ${arr[j]} since ${arr[j + 1]} < ${arr[j]}.`,
          comparisons,
          swaps
        });
      }
    }
    sortedIndices.push(n - 1 - i);
    if (!swapped) break;
  }

  steps.push({
    arr: [...arr],
    comparing: [],
    swapping: [],
    sorted: arr.map((_, i) => i),
    desc: `✅ Bubble Sort Complete!`,
    comparisons,
    swaps
  });

  return steps;
}

const DEFAULT_ARRAY = [42, 12, 88, 25, 65, 34, 91, 18, 50, 7];

export default function SortingViz({ algorithmId = "merge-sort" }) {
  const [arr, setArr] = useState(DEFAULT_ARRAY);
  const [customInput, setCustomInput] = useState(DEFAULT_ARRAY.join(", "));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Generate steps based on selected algorithm
  const steps = useMemo(() => {
    if (algorithmId === "quick-sort") return generateQuickSortSteps(arr);
    if (algorithmId === "bubble-sort") return generateBubbleSortSteps(arr);
    return generateMergeSortSteps(arr);
  }, [algorithmId, arr]);

  // Reset step counter on array or algorithm switch
  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
  }, [arr, algorithmId]);

  // Play audio frequency based on array values on each step
  useEffect(() => {
    if (!soundEnabled) return;
    const current = steps[stepIdx];
    if (current && (current.comparing?.length || current.swapping?.length)) {
      const idx = current.swapping[0] ?? current.comparing[0];
      const val = current.arr[idx] || 50;
      playTone(200 + val * 8, "sine", 0.05);
    }
  }, [stepIdx, soundEnabled, steps]);

  // Playback timer
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
    try {
      const parsed = customInput
        .split(/[,\s]+/)
        .map(x => parseInt(x.trim(), 10))
        .filter(x => !isNaN(x) && x >= 0);
      if (parsed.length > 1) {
        setArr(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 5) + 8;
    const newArr = Array.from({ length: len }, () => Math.floor(Math.random() * 90) + 10);
    setArr(newArr);
    setCustomInput(newArr.join(", "));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Controls & Presets */}
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
          <button
            onClick={handleRandomize}
            style={{
              background: "#080b14",
              color: "#38bdf8",
              border: "1px solid #0284c744",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
          >
            <Sparkles size={14} /> Randomize Array
          </button>
          <button
            onClick={() => setArr([...DEFAULT_ARRAY].reverse())}
            style={{
              background: "#080b14",
              color: "#f59e0b",
              border: "1px solid #f59e0b44",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Reversed (Worst-case)
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: soundEnabled ? "#10b98122" : "#080b14",
              color: soundEnabled ? "#34d399" : "#64748b",
              border: `1px solid ${soundEnabled ? "#10b981" : "#1e293b"}`,
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer"
            }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            Sound {soundEnabled ? "ON" : "OFF"}
          </button>
        </div>

        {/* Custom Input */}
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
              borderRadius: 6,
              color: "#e2e8f0",
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              width: 220
            }}
          />
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

      {/* Dynamic Animated Bars Visualization */}
      <div style={{
        background: "#0d1321",
        border: "1px solid #1a2740",
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}>
        {/* Top Header & Stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>
            <ArrowUpDown size={16} color="#10b981" />
            ANIMATED ARRAY BARS
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <div>
              <span style={{ color: "#64748b" }}>Comparisons: </span>
              <span style={{ color: "#fbbf24", fontWeight: 700 }}>{currentStep?.comparisons || 0}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Swaps/Writes: </span>
              <span style={{ color: "#ec4899", fontWeight: 700 }}>{currentStep?.swaps || 0}</span>
            </div>
          </div>
        </div>

        {/* Array Bars Container */}
        <div style={{
          height: 260,
          background: "#080b14",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "20px 24px 10px 24px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 12
        }}>
          {currentStep?.arr.map((val, idx) => {
            const isComparing = currentStep.comparing?.includes(idx);
            const isSwapping = currentStep.swapping?.includes(idx);
            const isPivot = currentStep.pivot === idx;
            const isSorted = currentStep.sorted?.includes(idx);

            let barColor = "#6366f1";
            let glow = "none";
            if (isSorted) {
              barColor = "#10b981";
            }
            if (isPivot) {
              barColor = "#06b6d4";
              glow = "0 0 14px rgba(6, 182, 212, 0.6)";
            }
            if (isComparing) {
              barColor = "#f59e0b";
              glow = "0 0 14px rgba(245, 158, 11, 0.6)";
            }
            if (isSwapping) {
              barColor = "#ec4899";
              glow = "0 0 14px rgba(236, 72, 153, 0.6)";
            }

            const barHeightPct = Math.max(12, Math.round((val / maxVal) * 100));

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  maxWidth: 50,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  gap: 8
                }}
              >
                {/* Bar Value on Top */}
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: isComparing || isSwapping || isPivot ? "#fff" : "#94a3b8",
                  transition: "color 0.2s"
                }}>
                  {val}
                </span>

                {/* Animated Bar */}
                <div
                  style={{
                    width: "100%",
                    height: `${barHeightPct}%`,
                    background: barColor,
                    borderRadius: "6px 6px 2px 2px",
                    transition: "height 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
                    boxShadow: glow
                  }}
                />

                {/* Index label */}
                <span style={{ fontSize: 10, color: "#475569", fontWeight: 600 }}>
                  {idx}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#6366f1" }} />
            <span style={{ color: "#94a3b8" }}>Default</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#f59e0b" }} />
            <span style={{ color: "#94a3b8" }}>Comparing</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#ec4899" }} />
            <span style={{ color: "#94a3b8" }}>Swapping / Writing</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#06b6d4" }} />
            <span style={{ color: "#94a3b8" }}>Pivot</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#10b981" }} />
            <span style={{ color: "#94a3b8" }}>Sorted</span>
          </div>
        </div>

        {/* Step Commentary */}
        <div style={{
          background: "#080b14",
          border: "1px solid #1e293b",
          borderRadius: 8,
          padding: "14px 18px",
          fontSize: 13,
          fontWeight: 600,
          color: "#e2e8f0"
        }}>
          {currentStep?.desc}
        </div>
      </div>

      {/* Playback Controls Strip */}
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
            title="Reset"
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
              background: isPlaying ? "#f59e0b" : "#10b981",
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
            {isPlaying ? "Pause" : "Sort"}
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

        {/* Step Scrubber Slider */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, maxWidth: 380 }}>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={stepIdx}
            onChange={e => setStepIdx(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: "#10b981", cursor: "pointer" }}
          />
          <span style={{ fontSize: 12, color: "#64748b", minWidth: 60, textAlign: "right" }}>
            {stepIdx + 1} / {steps.length}
          </span>
        </div>

        {/* Speed Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Speed:</span>
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? "#10b98122" : "transparent",
                color: speed === s ? "#34d399" : "#64748b",
                border: `1px solid ${speed === s ? "#10b981" : "transparent"}`,
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
