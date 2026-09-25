import Link from 'next/link';

export default function Home() {
  const docs = ['aws', 'fastapi', 'langgraph', 'n8n', 'opencv', 'swift', 'storyblok'];
  
  return (
    <main className="flex-1 overflow-y-auto bg-[#0b0c10] p-10 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      
      <div className="text-center max-w-2xl relative z-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 tracking-tight">
          DocEng Portfolio
        </h1>
        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
          Welcome to the new Next.js powered documentation hub. Select a dossier below to view its completely revamped Storyblok-inspired architecture.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {docs.map(doc => (
            <Link 
              key={doc}
              href={`/${doc}`}
              className="bg-[#16181d] border border-gray-800 hover:border-purple-500/50 p-6 rounded-xl shadow-lg hover:shadow-purple-500/10 transition-all group flex flex-col items-center justify-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-purple-500/20 flex items-center justify-center text-gray-400 group-hover:text-purple-400 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <span className="font-semibold text-gray-300 group-hover:text-white uppercase tracking-wider text-sm">{doc}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
