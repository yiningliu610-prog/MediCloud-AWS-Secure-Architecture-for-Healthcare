import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';

export function renderCodeBlock(code, language, options = {}) {
  const { title = '', highlightLines = [] } = options;
  const grammar = Prism.languages[language] || Prism.languages.clike;
  const highlighted = Prism.highlight(code.trim(), grammar, language);

  // Split into lines and apply highlighting
  const lines = highlighted.split('\n').map((line, i) => {
    const lineNum = i + 1;
    const isHighlighted = highlightLines.includes(lineNum);
    return `<span class="block ${isHighlighted ? 'line-highlight' : ''} hover:bg-slate-700/30"><span class="inline-block w-8 text-right mr-4 text-slate-600 select-none text-xs">${lineNum}</span>${line}</span>`;
  }).join('');

  return `
    <div class="code-block bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/50 group">
      ${title ? `
        <div class="px-4 py-2.5 bg-slate-700/30 text-sm text-slate-400 flex justify-between items-center border-b border-slate-700/50">
          <span class="font-medium">${title}</span>
          <span class="text-xs uppercase tracking-wider text-slate-500">${language}</span>
        </div>` : ''}
      <pre class="!bg-transparent"><code class="language-${language}">${lines}</code></pre>
    </div>`;
}
