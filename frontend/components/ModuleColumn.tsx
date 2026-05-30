import React from 'react';
import { Item } from '@/lib/mockData';

interface ModuleColumnProps {
  title: string;
  items: Item[];
}

export function ModuleColumn({ title, items }: ModuleColumnProps) {
  return (
    <div className="bg-[#1A1D2E] border border-[#252840] rounded-2xl hover:shadow-[0_0_20px_rgba(79,110,247,0.15)] transition-all group flex flex-col h-[500px]">
      <div className="p-6 border-b border-[#252840] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#F0F0F0]">{title}</h2>
        <svg className="w-5 h-5 text-[#8B8FA8] group-hover:text-[#F0F0F0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8v8M18 6L6 18" />
        </svg>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#252840] text-xs font-medium text-[#8B8FA8]">
              <th className="py-3 px-6 font-medium">SENDER</th>
              <th className="py-3 px-6 font-medium">SUBJECT</th>
              <th className="py-3 px-6 font-medium">TIME</th>
              <th className="py-3 px-6 font-medium text-right">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#252840] hover:bg-[#141720] transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-[#F0F0F0]">
                  {item.subtitle.replace('From: ', '').replace('Prepared ', '') || 'System'}
                </td>
                <td className="py-4 px-6 text-sm text-[#8B8FA8]">
                  {item.title}
                </td>
                <td className="py-4 px-6 text-sm text-[#8B8FA8]">
                  {item.timestamp}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md border ${
                    item.status === 'completed' ? 'text-[#34C77B] bg-[#34C77B]/10 border-[#34C77B]/20' : 
                    item.status === 'processing' ? 'text-[#4F6EF7] bg-[#4F6EF7]/10 border-[#4F6EF7]/20' :
                    item.status === 'failed' ? 'text-[#F05A5A] bg-[#F05A5A]/10 border-[#F05A5A]/20' :
                    'text-[#F5C842] bg-[#F5C842]/10 border-[#F5C842]/20'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="p-6 text-[#8B8FA8] text-sm text-center">No items to display</div>
        )}
      </div>
    </div>
  );
}
