# Canonical agent instructions

Status: ACTIVE in Module 3. Read context/STANDARDS.md and the selected scope in FEATURES.md before editing. STANDARDS.md is normative; report and repair conflicting instruction wording.

1. Use descriptive camelCase identifiers. Short conventional names like event or index are acceptable when their role is obvious; avoid arbitrary minimum lengths or vague abbreviations.
2. Separate HTML, CSS, and JavaScript into index.html, styles.css, and app.js. Add more files only when they clearly improve the structure.
3. Keep comments focused on why something matters instead of narrating the code line by line. Write them in present tense and remove temporary debug output before submission.
4. Write commit messages that describe the changed behavior and purpose.
5. Do not insert user input with innerHTML, and remove stray console.log statements before submission.
6. Do not commit or make destructive edits without explicit human approval.
7. If a rule conflicts with another instruction file, resolve the conflict intentionally and do not silently apply a different policy.

Root CLAUDE.md imports this file for Claude Code. VS Code Copilot uses the separate .github/copilot-instructions.md adapter. A location under /context alone is not a guarantee of automatic discovery.
