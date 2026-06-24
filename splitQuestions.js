const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = '/Users/pragnesh/Desktop/MyDev/dsa-revisor/dsa-revisor';
const SRC = path.join(ROOT, 'src/data/questions.ts');
const OUT_DIR = path.join(ROOT, 'src/data/questions');

const sourceText = fs.readFileSync(SRC, 'utf8');
const sourceFile = ts.createSourceFile('questions.ts', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function nodeText(node) {
  return sourceText.slice(node.getStart(sourceFile), node.getEnd());
}

function getStringProperty(obj, name) {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === name && ts.isStringLiteral(prop.initializer)) {
      return prop.initializer.text;
    }
  }
  return null;
}

const helpers = [];
const topicQuestions = {};
const stubCalls = []; // { topicId, text: full stub({...}) call }
const fillerObjects = []; // { topicId, text: inner object }

function addQuestion(nodeKind, topicId, text, name = null) {
  if (!topicId) {
    console.warn('No topicId for', name || text.slice(0, 60));
    return;
  }
  if (!topicQuestions[topicId]) topicQuestions[topicId] = [];
  topicQuestions[topicId].push({ kind: nodeKind, name, text });
}

function collectNode(node) {
  // const declarations
  if (ts.isVariableStatement(node)) {
    for (const decl of node.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      const name = decl.name.text;
      const init = decl.initializer;
      if (!init) continue;
      if (name === 'C') {
        helpers.push({ name, text: nodeText(node) });
        continue;
      }
      if (['QUESTIONS', 'QUESTION_BY_ID', 'STUB_QUESTIONS'].includes(name)) continue;
      if (ts.isObjectLiteralExpression(init)) {
        const topicId = getStringProperty(init, 'topicId');
        addQuestion('const', topicId, nodeText(node), name);
      }
    }
    return;
  }

  // function declarations
  if (ts.isFunctionDeclaration(node)) {
    const name = node.name?.text;
    if (!name) return;
    if (['twoSumSortedTrace', 'slidingWindowTrace', 'range'].includes(name)) {
      helpers.push({ name, text: nodeText(node) });
    } else if (name === 'stub') {
      helpers.push({ name, text: nodeText(node), isStub: true });
    } else if (name === 'generateFillers') {
      // Extract fillers array inside function body
      node.forEachChild(function findFillers(n) {
        if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'fillers' && n.initializer && ts.isArrayLiteralExpression(n.initializer)) {
          for (const el of n.initializer.elements) {
            if (ts.isObjectLiteralExpression(el)) {
              const topicId = getStringProperty(el, 'topicId');
              const txt = nodeText(el);
              if (topicId) fillerObjects.push({ topicId, text: txt });
            }
          }
        }
        ts.forEachChild(n, findFillers);
      });
    }
    return;
  }
}

sourceFile.statements.forEach(collectNode);

// Also handle STUB_QUESTIONS array which is a top-level variable we skipped
sourceFile.statements.forEach((node) => {
  if (ts.isVariableStatement(node)) {
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === 'STUB_QUESTIONS' && decl.initializer && ts.isArrayLiteralExpression(decl.initializer)) {
        for (const el of decl.initializer.elements) {
          if (ts.isCallExpression(el) && ts.isIdentifier(el.expression) && el.expression.text === 'stub' && el.arguments.length === 1 && ts.isObjectLiteralExpression(el.arguments[0])) {
            const obj = el.arguments[0];
            const topicId = getStringProperty(obj, 'topicId');
            if (topicId) stubCalls.push({ topicId, text: nodeText(el) });
          }
        }
      }
    }
  }
});

console.log('Helpers:', helpers.map(h => h.name).join(', '));
console.log('Top-level questions by topic:', Object.keys(topicQuestions).map(k => `${k}:${topicQuestions[k].length}`).join(', '));
console.log('Stub calls:', stubCalls.length);
console.log('Filler objects:', fillerObjects.length);

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const topicFileNames = {
  arrays: 'arrays.ts',
  hashing: 'hashing.ts',
  'two-pointers': 'twoPointers.ts',
  'linked-lists': 'linkedLists.ts',
  'stacks-queues': 'stacksQueues.ts',
  trees: 'trees.ts',
  heaps: 'heaps.ts',
  graphs: 'graphs.ts',
  recursion: 'recursion.ts',
  dp: 'dp.ts',
  greedy: 'greedy.ts',
  'binary-search': 'binarySearch.ts',
  sorting: 'sorting.ts',
  bits: 'bits.ts',
};

// Write shared stub helper
const stubHelper = helpers.find(h => h.isStub);
if (!stubHelper) {
  console.error('stub helper not found');
  process.exit(1);
}
const utilsFile = `import type { Question, AnimationStep } from "./types";

${stubHelper.text}

export { stub };
`;
fs.writeFileSync(path.join(ROOT, 'src/data/question-utils.ts'), utilsFile);

// Collect all topic IDs that have any content
const allTopicIds = new Set([
  ...Object.keys(topicQuestions),
  ...stubCalls.map(s => s.topicId),
  ...fillerObjects.map(f => f.topicId),
]);

// Write per-topic files
for (const topicId of allTopicIds) {
  const items = topicQuestions[topicId] || [];
  const fileName = topicFileNames[topicId] || `${topicId}.ts`;
  const filePath = path.join(OUT_DIR, fileName);

  let lines = [];
  const needsAnim = topicId === 'two-pointers';
  lines.push(`import type { Question${needsAnim ? ', AnimationStep' : ''} } from "../types";`);
  const hasStubs = stubCalls.some(s => s.topicId === topicId) || fillerObjects.some(f => f.topicId === topicId);
  if (hasStubs) {
    lines.push(`import { stub } from "../question-utils";`);
  }
  if (needsAnim) {
    // helpers used by animated questions in this topic
    const C = helpers.find(h => h.name === 'C');
    const t1 = helpers.find(h => h.name === 'twoSumSortedTrace');
    const t2 = helpers.find(h => h.name === 'slidingWindowTrace');
    const range = helpers.find(h => h.name === 'range');
    if (C) lines.push(C.text);
    if (t1) lines.push(t1.text);
    if (t2) lines.push(t2.text);
    if (range) lines.push(range.text);
  }
  lines.push('');

  // const declarations
  for (const item of items.filter(i => i.kind === 'const')) {
    lines.push(item.text);
    lines.push('');
  }

  // stubs and fillers combined as an array
  const topicStubs = stubCalls.filter(s => s.topicId === topicId);
  const topicFillers = fillerObjects.filter(f => f.topicId === topicId);
  if (topicStubs.length || topicFillers.length) {
    lines.push('const STUB_QUESTIONS: Question[] = [');
    for (const s of topicStubs) lines.push(`  ${s.text},`);
    for (const f of topicFillers) lines.push(`  stub(${f.text}),`);
    lines.push('];');
    lines.push('');
  }

  lines.push('export const QUESTIONS: Question[] = [');
  for (const item of items.filter(i => i.kind === 'const')) {
    lines.push(`  ${item.name},`);
  }
  if (topicStubs.length || topicFillers.length) {
    lines.push('  ...STUB_QUESTIONS,');
  }
  lines.push('];');

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log('Wrote', filePath, `(${items.length} top-level + ${topicStubs.length + topicFillers.length} stubs)`);
}

// Write aggregator
const importLines = [];
const combineLines = [];
for (const topicId of Object.keys(topicFileNames).filter(k => topicQuestions[k] || stubCalls.some(s=>s.topicId===k) || fillerObjects.some(f=>f.topicId===k))) {
  const fileName = topicFileNames[topicId].replace(/\.ts$/, '');
  const varName = topicId.replace(/[^a-zA-Z0-9]/g, '') + 'Questions';
  importLines.push(`import { QUESTIONS as ${varName} } from "./questions/${fileName}";`);
  combineLines.push(`  ...${varName},`);
}

const aggregator = `// Aggregator for the per-topic question catalogs.
// Generated by the catalog splitter. Each topic file owns its own questions
// and any trace helpers specific to that topic.

import type { Question } from "./types";
${importLines.join('\n')}

export const QUESTIONS: Question[] = [
${combineLines.join('\n')}
];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q])
);
`;
fs.writeFileSync(SRC, aggregator);
console.log('Wrote aggregator', SRC);
