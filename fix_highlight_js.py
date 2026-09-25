import glob

html_files = glob.glob('doc_*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The CSS is there, but not the JS
    if 'highlight.min.js' not in content:
        content = content.replace('</body>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>\n    <script>hljs.highlightAll();</script>\n</body>')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Injected JS!")
