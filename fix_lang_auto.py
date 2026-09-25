import glob

html_files = glob.glob('doc_*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the language class to allow auto-detection
    content = content.replace('class="language-typescript"', '')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Removed strict language classes for auto-detection.")
