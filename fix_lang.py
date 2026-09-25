import glob

html_files = glob.glob('doc_*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace language-javascript with language-typescript for better JSX/TSX support
    content = content.replace('class="language-javascript"', 'class="language-typescript"')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated language classes.")
