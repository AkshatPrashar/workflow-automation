import React from 'react';
import { ApprovalItem } from '@/lib/mockData';

interface ApprovalPanelProps {
  approvals: ApprovalItem[];
  onApprove: (id: string) => void;
  onDiscard: (id: string) => void;
}

export function ApprovalPanel({ approvals, onApprove }: ApprovalPanelProps) {
  return (
    <div className="bg-[#1A1D2E] border border-[#252840] rounded-2xl hover:shadow-[0_0_20px_rgba(79,110,247,0.15)] transition-all group flex flex-col h-[500px] overflow-hidden">
      <div className="p-6 border-b border-[#252840] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#F0F0F0]">Pending Approvals</h2>
        <svg className="w-5 h-5 text-[#8B8FA8] group-hover:text-[#F0F0F0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8v8M18 6L6 18" />
        </svg>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {approvals.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#8B8FA8] text-sm">
            All caught up!
          </div>
        ) : (
          approvals.map((item) => (
            <div key={item.id} className="p-4 border-b border-[#252840] last:border-b-0 hover:bg-[#141720] rounded-xl transition-colors flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#141720] border border-[#252840] flex items-center justify-center text-[#4F6EF7]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[#F0F0F0] font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-[#8B8FA8] line-clamp-1">{item.details}</p>
                </div>
              </div>
              
              <button 
                onClick={() => onApprove(item.id)}
                className="ml-4 px-3 py-1.5 bg-[#34C77B]/10 border border-[#34C77B]/30 hover:bg-[#34C77B]/20 text-[#34C77B] text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Approve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
