import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update dossier banner spans
    # Find dossier banner
    banner_match = re.search(r'(<div class="dossier-banner">)(.*?)(</div>)', content, flags=re.DOTALL)
    if banner_match:
        inner_content = banner_match.group(2)
        # Add <span class="dot"></span> only if not present
        if '<span class="dot">' not in inner_content:
            inner_content = re.sub(r'(<span>)(.*?)(</span>)', r'\1<span class="dot"></span> \2\3', inner_content)
            content = content[:banner_match.start(2)] + inner_content + content[banner_match.end(2):]

    # 2. Remove section markers
    content = re.sub(r'\s*<div class="section-marker">\d+</div>', '', content)

    # 3. Remove mini-labels
    content = re.sub(r'\s*<p class="mini-label">.*?</p>', '', content)

    # 4. Move aside to right
    # Extract aside
    aside_match = re.search(r'(<aside class="section-rail">.*?</aside>)\s*(<article class="article research-note reveal">)', content, flags=re.DOTALL)
    if aside_match:
        aside_html = aside_match.group(1)
        # Remove from original position
        content = content[:aside_match.start(1)] + aside_match.group(2) + content[aside_match.end(2):]
        # Insert after </article>
        content = re.sub(r'(</article>)', r'\1\n        ' + aside_html, content)

    # 5. Update rail heading
    content = re.sub(r'<div class="rail-heading"><span>Dossier Map</span></div>', r'<div class="rail-heading"><span>ON THIS PAGE</span></div>', content)

    # 6. Remove numbering and bolding from toc links
    content = re.sub(r'(<a href="#section-\d+"[^>]*>)<span>\d+</span><strong>(.*?)</strong>(</a>)', r'\1\2\3', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in glob.glob('doc_*.html'):
    if f == 'doc_storyblok.html':
        continue # Already did this one
    process_file(f)
    print("Processed", f)

