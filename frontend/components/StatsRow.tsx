import React from 'react';

interface StatsProps {
  stats: {
    processed_emails: number;
    meetings_scheduled: number;
    pending_tasks: number;
    ai_accuracy: number;
  };
}

export function StatsRow({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: AI Insights */}
      <div className="relative overflow-hidden bg-[#1A1D2E] border border-[#252840] rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(79,110,247,0.15)] transition-all group flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F6EF7]/10 to-[#7C5CFC]/20 opacity-50"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7C5CFC]/20 blur-3xl rounded-full"></div>
        <div className="relative z-10 flex justify-between items-start mb-6">
          <span className="text-xs font-semibold text-[#7C5CFC] uppercase tracking-widest bg-[#7C5CFC]/10 px-3 py-1 rounded-full border border-[#7C5CFC]/20">AI Insights</span>
          <svg className="w-5 h-5 text-[#8B8FA8] group-hover:text-[#F0F0F0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8v8M18 6L6 18" />
          </svg>
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-semibold text-[#F0F0F0] leading-tight mb-2">
            Your emails processed increased <span className="text-[#4F6EF7]">12%</span> this week.
          </h3>
          <p className="text-sm text-[#8B8FA8]">Agent saved you approx. 4.5 hours.</p>
        </div>
      </div>

      {/* Card 2: Emails Overview */}
      <div className="bg-[#1A1D2E] border border-[#252840] rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(79,110,247,0.15)] transition-all group">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-[#8B8FA8] font-medium text-sm">Emails Overview</h3>
          <svg className="w-5 h-5 text-[#8B8FA8] group-hover:text-[#F0F0F0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8v8M18 6L6 18" />
          </svg>
        </div>
        <div className="flex items-end space-x-3 mb-6">
          <div className="text-5xl font-bold text-[#F0F0F0] tracking-tight">{stats.processed_emails}</div>
          <div className="flex items-center text-xs font-semibold text-[#34C77B] bg-[#34C77B]/10 px-2 py-1 rounded-md border border-[#34C77B]/20 mb-1">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            12%
          </div>
        </div>
        <div className="flex space-x-2">
          <span className="text-xs font-medium text-[#8B8FA8] bg-[#141720] border border-[#252840] px-3 py-1 rounded-full">Outbound: 42</span>
          <span className="text-xs font-medium text-[#8B8FA8] bg-[#141720] border border-[#252840] px-3 py-1 rounded-full">Replies: 100</span>
        </div>
      </div>

      {/* Card 3: Tasks Done */}
      <div className="bg-[#1A1D2E] border border-[#252840] rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(79,110,247,0.15)] transition-all group flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-[#8B8FA8] font-medium text-sm">Tasks Done</h3>
          <svg className="w-5 h-5 text-[#8B8FA8] group-hover:text-[#F0F0F0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8v8M18 6L6 18" />
          </svg>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-5xl font-bold text-[#F0F0F0] tracking-tight">{stats.pending_tasks}</div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#252840]"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#4F6EF7]"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="75, 100"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#F0F0F0]">
              75%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
