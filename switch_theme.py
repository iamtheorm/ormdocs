import glob
import re

html_files = glob.glob('doc_*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Switch highlight.js theme to Dracula
    content = content.replace('atom-one-dark.min.css', 'dracula.min.css')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Switched to Dracula theme.")
