"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from "@codemirror/view";
import { EditorState, Compartment, type Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "@/context/ThemeContext";

interface CodeEditorProps {
  initialValue: string;
  onChange?: (value: string) => void;
  className?: string;
  readOnly?: boolean;
}

const themeCompartment = new Compartment();

function buildTheme(resolvedTheme: "dark" | "light"): Extension {
  if (resolvedTheme === "dark") return oneDark;

  return EditorView.theme(
    {
      "&.cm-editor": {
        backgroundColor: "var(--surface-0)",
        color: "var(--text-primary)",
      },
      ".cm-gutters": {
        backgroundColor: "var(--surface-1)",
        color: "var(--text-tertiary)",
        borderRight: "1px solid var(--border-subtle)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "var(--surface-2)",
        color: "var(--text-secondary)",
      },
      ".cm-activeLine": { backgroundColor: "var(--surface-2)" },
      ".cm-selectionBackground": { backgroundColor: "var(--accent-soft)" },
      ".cm-cursor": { borderLeftColor: "var(--accent)" },
      ".cm-content": { caretColor: "var(--accent)" },
    },
    { dark: false }
  );
}

export default function CodeEditor({ initialValue, onChange, className = "", readOnly = false }: CodeEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const { resolvedTheme } = useTheme();

  // Keep the latest onChange callback without re-creating the editor.
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!ref.current || viewRef.current) return;

    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
      javascript({ jsx: false, typescript: false }),
      themeCompartment.of(buildTheme(resolvedTheme)),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChangeRef.current) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorState.readOnly.of(readOnly),
      EditorView.theme(
        {
          "&": { fontSize: "13.5px" },
          ".cm-scroller": { fontFamily: "var(--font-mono), ui-monospace, monospace", lineHeight: "1.6" },
        },
        { dark: resolvedTheme === "dark" }
      ),
    ];

    const state = EditorState.create({ doc: initialValue, extensions });
    const view = new EditorView({ state, parent: ref.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only create on mount. External content resets are handled by changing the `key` prop on the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconfigure theme when it changes, without destroying the editor or losing focus.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartment.reconfigure(buildTheme(resolvedTheme)),
    });
  }, [resolvedTheme]);

  return <div ref={ref} className={`h-full w-full overflow-hidden rounded-lg ${className}`} />;
}
