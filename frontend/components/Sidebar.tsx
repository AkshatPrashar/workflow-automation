import React from 'react';

export function Sidebar() {
  const navItems = [
    { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: true },
    { name: 'Emails', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', active: false },
    { name: 'Meetings', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', active: false },
    { name: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', active: false },
    { name: 'Calendar', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', active: false },
  ];

  return (
    <div className="fixed left-0 top-0 w-[220px] h-screen bg-[#141720] border-r border-[#252840] flex flex-col pt-6 pb-8 px-4 z-40">
      <div className="flex items-center space-x-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-[#4F6EF7] flex items-center justify-center shadow-[0_0_15px_rgba(79,110,247,0.4)]">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#F0F0F0]">WorkFlow</h1>
      </div>
      
      <div className="mb-8 px-2">
        <p className="text-[#8B8FA8] text-xs uppercase tracking-widest font-semibold mb-1">Welcome back!</p>
        <p className="text-[#F0F0F0] font-medium text-sm">Agent Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button 
            key={item.name} 
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-[#4F6EF7]/20 text-[#4F6EF7]' : 'text-[#8B8FA8] hover:bg-[#1A1D2E] hover:text-[#F0F0F0]'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
