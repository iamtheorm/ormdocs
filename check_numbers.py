import re
from bs4 import BeautifulSoup

with open('doc_storyblok.html', 'r') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

for text in soup.stripped_strings:
    if re.search(r'\b[0-9]\b', text):
        print(text)
