"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface CodeBlockProps {
  code: string;
  highlightLine?: number | null;
  language?: string;
  filename?: string;
  maxHeight?: string;
}

// Tiny JS-only tokenizer — no Prism/highlight.js. Output is span-wrapped tokens
// that get colored by the .tk-* classes in globals.css.
function tokenize(line: string): { type: string; text: string }[] {
  const tokens: { type: string; text: string }[] = [];
  const keywords = new Set([
    "function", "const", "let", "var", "if", "else", "return", "while", "for", "of", "in",
    "new", "class", "extends", "this", "true", "false", "null", "undefined", "import", "export",
    "from", "default", "switch", "case", "break", "continue", "do", "throw", "try", "catch",
    "typeof", "instanceof", "void", "delete", "yield", "async", "await", "static", "super",
  ]);
  const builtins = new Set([
    "Array", "Map", "Set", "Math", "Object", "Number", "String", "Boolean", "JSON", "Promise",
    "console", "Infinity", "NaN", "Symbol", "RegExp", "Date", "Error",
  ]);

  let i = 0;
  let buf = "";
  const flush = (t: string) => {
    if (buf) tokens.push({ type: t, text: buf });
    buf = "";
  };

  while (i < line.length) {
    const c = line[i];
    if (c === "/" && line[i + 1] === "/") {
      flush("op");
      tokens.push({ type: "cmt", text: line.slice(i) });
      i = line.length;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      flush("op");
      const quote = c;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++;
        j++;
      }
      tokens.push({ type: "str", text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c)) {
      flush("op");
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push({ type: "num", text: line.slice(i, j) });
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      flush("op");
      let j = i;
      while (j < line.length && /[A-Za-z0-9_$]/.test(line[j])) j++;
      const w = line.slice(i, j);
      let t = "var";
      if (keywords.has(w)) t = "kw";
      else if (w === "true" || w === "false" || w === "null" || w === "undefined") t = "const";
      else if (builtins.has(w)) t = "fn";
      else if (line[j] === "(") t = "fn";
      tokens.push({ type: t, text: w });
      i = j;
      continue;
    }
    buf += c;
    i++;
  }
  flush("op");
  return tokens;
}

export default function CodeBlock({ code, highlightLine, language = "javascript", filename, maxHeight }: CodeBlockProps) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--surface-1)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] px-3 py-1.5">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex h-2 w-2 gap-0.5">
            <span className="h-2 w-2 rounded-full bg-[color:var(--surface-4)]" />
            <span className="h-2 w-2 rounded-full bg-[color:var(--surface-4)]" />
            <span className="h-2 w-2 rounded-full bg-[color:var(--surface-4)]" />
          </span>
          <span className="font-mono text-muted">{filename ?? language}</span>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] text-muted transition-colors hover:bg-[color:var(--surface-3)] hover:text-[color:var(--text-primary)] active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span>Copied</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        ref={(el) => {
          if (el && highlightLine != null) {
            const target = el.querySelector(`[data-line="${highlightLine}"]`) as HTMLElement | null;
            if (target) {
              const parent = el;
              const tTop = target.offsetTop;
              const pTop = parent.scrollTop;
              const tBot = tTop + target.offsetHeight;
              const pBot = pTop + parent.clientHeight;
              if (tTop < pTop + 16 || tBot > pBot - 16) {
                parent.scrollTo({ top: Math.max(0, tTop - parent.clientHeight / 3), behavior: "smooth" });
              }
            }
          }
        }}
        className="overflow-auto px-1 py-2"
        style={{ maxHeight: maxHeight ?? "none" }}
      >
        <pre className="m-0 font-mono text-[13px] leading-[1.65]">
          {lines.map((line, idx) => {
            const isHl = highlightLine === idx + 1;
            return (
              <div
                key={idx}
                data-line={idx + 1}
                className={`group relative flex rounded-sm px-2 transition-colors ${
                  isHl ? "bg-[color:var(--accent-soft)]" : ""
                }`}
              >
                {/* Active line left-border — 2px accent rail */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-1 bottom-1 w-0.5 rounded-full transition-opacity ${
                    isHl ? "bg-[color:var(--accent)] opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  className={`mr-3 w-6 shrink-0 select-none text-right text-[10px] tabular ${
                    isHl ? "text-[color:var(--accent)]" : "text-[color:var(--text-tertiary)]"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="whitespace-pre text-[13px]">
                  {tokenize(line || " ").map((t, i) => (
                    <span key={i} className={`tk-${t.type}`}>
                      {t.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      </motion.div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
