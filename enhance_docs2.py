import re
import glob

# 1. Update CSS
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_css = """/* Code Blocks Container */
.code-block-container {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--card-border);
  background: #0b0c10;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.code-block-header {
  background: #16181d;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--card-border);
}
.code-filename {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #9ca3af;
}
.copy-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: #9ca3af;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
}
.copy-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}
.copy-btn svg {
  width: 14px;
  height: 14px;
}
.code-block-container pre {
  margin: 0;
}
.code-block-container .hljs {
  background: transparent !important;
  border: none !important;
  padding: 1.25rem 1.5rem !important;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
}
"""

if "/* Code Blocks Container */" not in css:
    css = re.sub(r"/\* Code Blocks Styling Override for Highlight\.js \*/.*?(?=\n\n|\Z)", new_css, css, flags=re.DOTALL)
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)

# 2. Add copy function to script.js
with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

copy_script = """
    // Copy code block functionality
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.closest('.code-block-container').querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied`;
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
        });
    });
"""
if "// Copy code block functionality" not in script_content:
    script_content = script_content.replace('updateDossierScroll();\n});', 'updateDossierScroll();\n' + copy_script + '\n});')
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(script_content)

# 3. Process HTML files
html_files = glob.glob('doc_*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'code-block-container' not in content:
        def replacer(match):
            inner = match.group(1)
            filename = "Code"
            m = re.match(r'^\s*<strong>(?://|#)\s*(.*?)</strong>\s*\n', inner)
            if m:
                filename = m.group(1).strip()
                inner = inner[m.end():]
            
            html = f'''<div class="code-block-container">
  <div class="code-block-header">
    <span class="code-filename">{filename}</span>
    <button class="copy-btn">
       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy
    </button>
  </div>
  <pre><code class="language-javascript">{inner}</code></pre>
</div>'''
            return html

        content = re.sub(r'<pre><code>(.*?)</code></pre>', replacer, content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Added code block headers and copy functionality.")
