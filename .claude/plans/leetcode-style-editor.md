# Plan: LeetCode-style coding workspace + centered animation

## Goal
Redesign the question page so it no longer shows animation and code on the right. Instead:
1. **Learn mode** — single-column, centered reading flow: Problem → Approach → Dry Run → Animation → Solution (collapsed in a station) → Stations.
2. **Coding mode** — a resizable split-pane (LeetCode-style): problem statement/explanation on the left, interactive code editor on the right, sidebar hidden.
3. A clear toggle between the two modes ("Start coding" / "Open animation").
4. Mobile gets a simplified tab switch between Learn and Code.

## Design decisions
- Use a URL query param `?mode=code` to drive the view. This makes the code view shareable and gives correct back/forward behavior.
- The code editor will be CodeMirror 6 (`codemirror` + `@codemirror/lang-javascript`). It is light, React-19 compatible, and gives line numbers + syntax highlighting.
- Code runs in a sandboxed `<iframe>` with `sandbox="allow-scripts"` and a tiny harness. Output is captured and displayed below the editor. No server execution.
- AnimationPlayer loses its right-side code panel; it becomes a pure visualization component.
- The existing reference solution moves into a new `SolutionStation` inside `StationStrip`, collapsed by default.
- The sidebar collapses automatically in desktop code mode to maximize editor space.

## Files to change

### New files
- `src/components/CodeWorkspace.tsx` — resizable split pane + mode toolbar.
- `src/components/CodeEditor.tsx` — CodeMirror 6 wrapper.
- `src/components/CodeRunner.tsx` — iframe sandbox + output panel.
- `src/components/stations/SolutionStation.tsx` — collapsed reference solution.

### Modified files
- `src/components/QuestionView.tsx` — add mode toggle, restructure single-column learn layout, embed `CodeWorkspace` in code mode.
- `src/components/animations/AnimationPlayer.tsx` — remove right-side code panel and variables/code view; keep canvas + controls + step description.
- `src/components/stations/StationStrip.tsx` — render `SolutionStation` with the official solution.
- `src/components/Shell.tsx` — accept a prop to collapse/hide the sidebar in code mode.
- `src/components/AppShell.tsx` — read `?mode=code` and pass sidebar visibility to `Shell`.
- `src/components/MobileBottomBar.tsx` — add a "Code" / "Learn" toggle.
- `src/app/globals.css` — add resize-handle cursor + drag styles.
- `package.json` — add `codemirror`, `@codemirror/lang-javascript`, `@codemirror/view`, `@codemirror/state`.

## Implementation order
1. Install CodeMirror dependencies.
2. Create `SolutionStation` and wire it into `StationStrip`.
3. Refactor `QuestionView` to single-column learn layout with `AnimationPlayer` centered after Dry Run.
4. Simplify `AnimationPlayer` (remove code panel).
5. Build `CodeEditor`, `CodeRunner`, and `CodeWorkspace`.
6. Add `?mode=code` handling in `AppShell`/`Shell` and the mode toggle in `QuestionView`.
7. Update `MobileBottomBar` for the mode toggle.
8. Run `npm run build` and verify all 168 routes still render.

## Open question
Should the "Open animation" button in code mode simply switch back to learn mode, or should it open a small floating animation panel without leaving code mode? The plan assumes it switches back (simpler and matches "animation is in the center after explanation"). If you want an inline overlay, tell me and I’ll adjust.
