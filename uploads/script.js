// Shared utilities for all topic pages
(function () {
  'use strict';

  // Simple syntax highlighter for C++ snippets
  const KEYWORDS = new Set([
    'int', 'void', 'bool', 'char', 'double', 'float', 'long', 'short', 'unsigned', 'signed',
    'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
    'class', 'struct', 'public', 'private', 'protected', 'const', 'static', 'auto',
    'true', 'false', 'nullptr', 'NULL', 'new', 'delete', 'this', 'using', 'namespace',
    'include', 'define', 'typedef', 'template', 'typename', 'sizeof', 'operator',
    'try', 'catch', 'throw', 'virtual', 'override'
  ]);
  const TYPES = new Set([
    'string', 'vector', 'pair', 'map', 'set', 'unordered_map', 'unordered_set',
    'queue', 'stack', 'priority_queue', 'deque', 'list', 'array', 'tuple',
    'size_t', 'cin', 'cout', 'endl', 'std'
  ]);

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(code) {
    // Tokenise line-by-line so comments stay isolated
    const lines = code.split('\n');
    return lines.map(line => {
      // strip comment
      let comment = '';
      const cIdx = findCommentStart(line);
      if (cIdx >= 0) {
        comment = line.slice(cIdx);
        line = line.slice(0, cIdx);
      }
      // Tokenize the non-comment portion
      let out = '';
      let i = 0;
      while (i < line.length) {
        const c = line[i];
        // string
        if (c === '"') {
          let j = i + 1;
          while (j < line.length && line[j] !== '"') {
            if (line[j] === '\\') j++;
            j++;
          }
          out += '<span class="str">' + escHtml(line.slice(i, j + 1)) + '</span>';
          i = j + 1;
          continue;
        }
        // char
        if (c === "'") {
          let j = i + 1;
          while (j < line.length && line[j] !== "'") {
            if (line[j] === '\\') j++;
            j++;
          }
          out += '<span class="str">' + escHtml(line.slice(i, j + 1)) + '</span>';
          i = j + 1;
          continue;
        }
        // number
        if (/\d/.test(c)) {
          let j = i;
          while (j < line.length && /[\d.]/.test(line[j])) j++;
          out += '<span class="num">' + line.slice(i, j) + '</span>';
          i = j;
          continue;
        }
        // identifier
        if (/[A-Za-z_]/.test(c)) {
          let j = i;
          while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
          const word = line.slice(i, j);
          // peek next non-space char to detect function call
          let k = j;
          while (k < line.length && line[k] === ' ') k++;
          const isCall = line[k] === '(';
          if (KEYWORDS.has(word)) {
            out += '<span class="kw">' + word + '</span>';
          } else if (TYPES.has(word)) {
            out += '<span class="ty">' + word + '</span>';
          } else if (isCall) {
            out += '<span class="fn">' + word + '</span>';
          } else {
            out += escHtml(word);
          }
          i = j;
          continue;
        }
        // preprocessor # at line start
        if (c === '#' && /^\s*#/.test(line)) {
          let j = i;
          while (j < line.length && line[j] !== ' ') j++;
          out += '<span class="kw">' + escHtml(line.slice(i, j)) + '</span>';
          i = j;
          continue;
        }
        out += escHtml(c);
        i++;
      }
      if (comment) out += '<span class="cm">' + escHtml(comment) + '</span>';
      return out;
    }).join('\n');
  }

  function findCommentStart(line) {
    let inStr = false, ch;
    for (let i = 0; i < line.length; i++) {
      ch = line[i];
      if (ch === '"' && line[i - 1] !== '\\') inStr = !inStr;
      if (!inStr && ch === '/' && line[i + 1] === '/') return i;
    }
    return -1;
  }

  function applyHighlight() {
    document.querySelectorAll('pre code.cpp').forEach(el => {
      if (el.dataset.hl === '1') return;
      el.innerHTML = highlight(el.textContent);
      el.dataset.hl = '1';
    });
  }

  // Sleep utility for animations
  window.sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Generate random integer array (for sorting demos)
  window.randArray = (n, lo = 5, hi = 99) => {
    const a = [];
    for (let i = 0; i < n; i++) a.push(lo + Math.floor(Math.random() * (hi - lo + 1)));
    return a;
  };

  // Render a bar chart from array values into a container
  window.renderBars = (container, arr, classes = []) => {
    const max = Math.max(...arr, 1);
    container.innerHTML = '';
    container.classList.add('bar-row');
    arr.forEach((v, i) => {
      const b = document.createElement('div');
      b.className = 'bar' + (classes[i] ? ' ' + classes[i] : '');
      b.style.height = (8 + (v / max) * 92) + '%';
      const lab = document.createElement('span');
      lab.className = 'v';
      lab.textContent = v;
      b.appendChild(lab);
      container.appendChild(b);
    });
  };

  document.addEventListener('DOMContentLoaded', applyHighlight);
})();
