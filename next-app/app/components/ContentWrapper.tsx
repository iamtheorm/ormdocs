"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function ContentWrapper({ content, toc, slug }) {
  useEffect(() => {
    if (!document.getElementById('prism-css')) {
      const prismCss = document.createElement('link');
      prismCss.id = 'prism-css';
      prismCss.rel = 'stylesheet';
      prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
      document.head.appendChild(prismCss);
    }

    const loadScript = (src) => new Promise(resolve => {
        if(document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        document.body.appendChild(s);
    });

    document.querySelectorAll('.article pre').forEach(pre => {
        if (pre.parentElement.classList.contains('code-block-wrapper')) return;
        
        let filename = 'terminal';
        if (pre.previousElementSibling && pre.previousElementSibling.tagName === 'P') {
            const strongTag = pre.previousElementSibling.querySelector('strong');
            if (strongTag && strongTag.textContent.includes('.')) {
                filename = strongTag.textContent;
            }
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper my-8 rounded-lg overflow-hidden border border-gray-800 bg-[#0b0c10] shadow-2xl';
        
        const header = document.createElement('div');
        header.className = 'bg-[#16181d] px-4 py-2.5 border-b border-gray-800 flex justify-between items-center';
        
        const filenameSpan = document.createElement('span');
        filenameSpan.className = 'text-xs font-mono text-gray-400';
        filenameSpan.textContent = filename;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700';
        copyBtn.title = 'Copy code';
        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(pre.textContent).then(() => {
                copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                }, 2000);
            });
        });
        
        header.appendChild(filenameSpan);
        header.appendChild(copyBtn);
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        
        const codeContainer = document.createElement('div');
        codeContainer.className = 'p-4 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed';
        codeContainer.appendChild(pre);
        wrapper.appendChild(codeContainer);
        
        pre.style.background = 'transparent';
        pre.style.padding = '0';
        pre.style.margin = '0';
    });

    document.querySelectorAll('.article pre code').forEach(block => {
        if (!block.className.includes('language-')) block.classList.add('language-javascript');
    });

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js').then(() => {
        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js')
        ]).then(() => {
            if (window.Prism) Prism.highlightAll();
        });
    });
  }, [slug]);

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-[#0b0c10] relative">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 lg:py-12 pb-32">
          {/* Breadcrumb */}
          <div className="flex items-center text-gray-500 gap-2 mb-8 text-sm">
            <Link href="/" className="hover:text-gray-300 transition-colors">Portfolio</Link>
            <ChevronRight size={14} />
            <span className="text-gray-300">{slug.toUpperCase()}</span>
          </div>
          
          <div className="article" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </main>
      
      {/* Right Sidebar TOC */}
      <aside className="hidden xl:block w-64 bg-[#0b0c10] border-l border-gray-800 py-8 px-6 shrink-0 overflow-y-auto">
        <h4 className="text-sm font-bold text-white mb-4">On this page</h4>
        <div className="toc-container text-sm space-y-2.5 flex flex-col gap-2" dangerouslySetInnerHTML={{ __html: toc }} />
      </aside>
    </>
  );
}
