import React from 'react';

export function TopBar({ isConnected = false }: { isConnected?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#1A1D2E] border border-[#252840] rounded-full text-sm font-medium text-[#F0F0F0] hover:border-[#4F6EF7] transition-colors">
          <span>This Month</span>
          <svg className="w-4 h-4 text-[#8B8FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#1A1D2E] border border-[#252840] rounded-full text-sm font-medium">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#34C77B] shadow-[0_0_8px_rgba(52,199,123,0.5)]' : 'bg-[#F05A5A] shadow-[0_0_8px_rgba(240,90,90,0.5)]'}`}></div>
          <span className={isConnected ? 'text-[#34C77B]' : 'text-[#F05A5A]'}>
            {isConnected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 text-sm font-medium text-[#8B8FA8] hover:text-[#F0F0F0] transition-colors">
          Manage Widgets
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#141720] border border-[#4F6EF7]/30 text-[#4F6EF7] rounded-full text-sm font-medium shadow-[0_0_15px_rgba(79,110,247,0.15)] hover:bg-[#4F6EF7]/10 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Widget</span>
        </button>
      </div>
    </div>
  );
}
