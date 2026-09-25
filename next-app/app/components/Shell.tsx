"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, Settings, ChevronRight, ChevronDown, Search, Menu, X, Info } from 'lucide-react';

export const SidebarLeft = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleSidebar} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0b0c10] border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black text-xl">D</div>
            <span className="text-xl font-bold text-white tracking-tight">DocEng</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={toggleSidebar}><X size={20} /></button>
        </div>
        <div className="p-4 border-b border-gray-800 shrink-0">
          <div className="bg-[#16181d] border border-gray-700 rounded-md flex items-center px-3 py-2 text-gray-400">
            <Search size={16} className="mr-2" />
            <span className="text-sm">Search docs...</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 py-2 cursor-pointer text-gray-300">
              <span className="text-sm font-semibold">Technical Dossiers</span>
              <ChevronDown size={16} />
            </div>
            <div className="mt-1 space-y-0.5 ml-2 border-l border-gray-800 pl-2">
              {['aws', 'fastapi', 'langgraph', 'n8n', 'opencv', 'swift', 'storyblok'].map(slug => {
                const isActive = pathname === `/${slug}`;
                return (
                  <Link key={slug} href={`/${slug}`} className={`block px-3 py-1.5 text-sm cursor-pointer rounded-md transition-colors ${isActive ? 'font-medium text-[#00b3b0] bg-[#00b3b0]/10 border border-[#00b3b0]/20 relative' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                    {isActive && <div className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#00b3b0] rounded-r-full"></div>}
                    {slug.toUpperCase()} Documentation
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0c10] text-gray-300 font-sans">
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-gray-800 bg-[#0b0c10]/95 backdrop-blur z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center font-bold text-black">D</div>
          <span className="font-bold text-white tracking-tight">DocEng</span>
        </div>
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white"><Menu size={24} /></button>
      </div>
      <div className="flex w-full h-full pt-16 md:pt-0">
        <SidebarLeft isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        {children}
      </div>
    </div>
  );
}
