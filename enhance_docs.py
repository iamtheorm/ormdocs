import re
import glob

# 1. Update style.css with callout styles and code block tweaks
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '/* Callouts */' not in css:
    callout_css = """
/* Callouts */
.callout {
  margin: 2rem 0;
  border-left: 4px solid var(--accent-color);
  background: rgba(168, 85, 247, 0.1);
  border-radius: 0 8px 8px 0;
  overflow: hidden;
}

[data-theme="light"] .callout {
  background: rgba(168, 85, 247, 0.05);
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--accent-color);
  padding: 1.25rem 1.25rem 0.5rem;
}

.callout-content {
  padding: 0 1.25rem 1.25rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.callout.tip {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}
[data-theme="light"] .callout.tip {
  background: rgba(59, 130, 246, 0.05);
}
.callout.tip .callout-header {
  color: #3b82f6;
}

.callout.warning {
  border-left-color: #eab308;
  background: rgba(234, 179, 8, 0.1);
}
[data-theme="light"] .callout.warning {
  background: rgba(234, 179, 8, 0.05);
}
.callout.warning .callout-header {
  color: #eab308;
}

/* Code Blocks Styling Override for Highlight.js */
.hljs {
  background: #16181d !important; /* matching dark theme container */
  padding: 1.5rem !important;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  border: 1px solid var(--card-border);
}
"""
    css += callout_css
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)

# 2. Update HTML files
html_files = glob.glob('doc_*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Highlight.js injection
    if '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">' not in content:
        content = content.replace('</head>', '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">\n</head>')
    
    if 'highlight.js' not in content:
        content = content.replace('</body>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>\n    <script>hljs.highlightAll();</script>\n</body>')
    
    # Strip manual spans
    def strip_spans(match):
        inner = match.group(0)
        inner = re.sub(r'<span class="token-[^"]+">', '', inner)
        inner = re.sub(r'</span>', '', inner)
        return inner

    content = re.sub(r'<pre><code>.*?</code></pre>', strip_spans, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Injected Highlight.js and Callout CSS.")
