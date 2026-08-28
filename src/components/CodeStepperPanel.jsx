import React, { useState } from "react";
import { Code2, Copy, Check, Terminal } from "lucide-react";

// Multi-language keyword sets for syntax highlighting
const KEYWORDS = new Set([
  "def", "return", "for", "if", "else", "in", "and", "or", "not", "True", "False",
  "None", "elif", "while", "import", "from", "as", "class", "with", "pass", "break",
  "continue", "yield", "lambda", "try", "except", "finally", "raise",
  "function", "const", "let", "var", "new", "this", "null", "undefined",
  "int", "void", "vector", "auto", "public", "private", "struct", "class", "static", "bool"
]);

// Tokenizes and highlights a single line of code
function SyntaxLine({ text, lit }) {
  if (!text) return <span>&nbsp;</span>;
  const base = lit ? "#e2e8f0" : "#334155";
  const kw = lit ? "#c084fc" : "#1e293b";
  const str = lit ? "#86efac" : "#1a2e22";
  const com = lit ? "#64748b" : "#1e293b";
  const num = lit ? "#fbbf24" : "#2a2010";

  const tokens = text.split(/(\s+|[()[\]{},:#=<>+\-*/%!]|"[^"]*"|'[^']*'|#.*$|\/\/.*$|\b[a-zA-Z_]\w*\b|\b\d+\b)/);

  return (
    <span>
      {tokens.map((tok, i) => {
        if (KEYWORDS.has(tok)) return <span key={i} style={{ color: kw, fontWeight: lit ? 700 : 400 }}>{tok}</span>;
        if (/^["']/.test(tok)) return <span key={i} style={{ color: str }}>{tok}</span>;
        if (/^#|^\/\//.test(tok)) return <span key={i} style={{ color: com, fontStyle: "italic" }}>{tok}</span>;
        if (/^\d+$/.test(tok)) return <span key={i} style={{ color: num }}>{tok}</span>;
        return <span key={i} style={{ color: base }}>{tok}</span>;
      })}
    </span>
  );
}

export default function CodeStepperPanel({
  codeLines = {},
  activePhase = null,
  variables = {},
  title = "Algorithm Code"
}) {
  const [lang, setLang] = useState("python");
  const [copied, setCopied] = useState(false);

  const lines = codeLines[lang] || codeLines["python"] || [];

  const handleCopy = () => {
    const rawText = lines.map(l => (typeof l === "string" ? l : l.text)).join("\n");
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "#0a0d16",
      border: "1px solid #1a2035",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: 480,
      overflow: "hidden"
    }}>
      {/* Header with Language Tabs */}
      <div style={{
        background: "#080b14",
        borderBottom: "1px solid #1a2035",
        padding: "0 14px",
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10
      }}>
        {/* Language switcher */}
        <div style={{ display: "flex", height: "100%" }}>
          {[
            { id: "python", label: "Python" },
            { id: "javascript", label: "JS" },
            { id: "cpp", label: "C++" },
            { id: "java", label: "Java" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setLang(t.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: lang === t.id ? "2px solid #6366f1" : "2px solid transparent",
                color: lang === t.id ? "#e2e8f0" : "#475569",
                padding: "0 10px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            background: "none",
            border: "1px solid #1e293b",
            borderRadius: 4,
            color: copied ? "#34d399" : "#64748b",
            padding: "3px 8px",
            fontSize: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code Line Stepper View */}
      <div style={{
        flex: 1,
        padding: "16px 12px",
        overflowY: "auto",
        background: "#080b14",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 12,
        lineHeight: 1.7
      }}>
        {lines.map((lineObj, idx) => {
          const text = typeof lineObj === "string" ? lineObj : lineObj.text;
          const phase = typeof lineObj === "string" ? null : lineObj.phase;
          const isLit = activePhase && phase && (activePhase === phase || (Array.isArray(phase) && phase.includes(activePhase)));

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "1px 8px",
                borderRadius: 4,
                background: isLit ? "#6366f118" : "transparent",
                borderLeft: isLit ? "3px solid #6366f1" : "3px solid transparent",
                transition: "all 0.2s ease"
              }}
            >
              <span style={{
                color: isLit ? "#818cf8" : "#1e293b",
                fontSize: 10,
                minWidth: 20,
                textAlign: "right",
                userSelect: "none"
              }}>
                {idx + 1}
              </span>
              <div style={{ flex: 1, overflowX: "auto", whiteSpace: "pre" }}>
                <SyntaxLine text={text} lit={isLit} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Variable Inspector Strip */}
      {Object.keys(variables).length > 0 && (
        <div style={{
          background: "#080b14",
          borderTop: "1px solid #1a2035",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
          <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
            <Terminal size={12} color="#6366f1" /> WATCH VARIABLES
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(variables).map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: "#0d1321",
                  border: "1px solid #1e293b",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                <span style={{ color: "#818cf8" }}>{k}</span>
                <span style={{ color: "#475569" }}>: </span>
                <span style={{ color: "#34d399", fontWeight: 700 }}>
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
