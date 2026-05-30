'use client';

import { useAgentState } from '../../lib/useAgentState';
import { Sidebar } from '../../components/Sidebar';
import { TopBar } from '../../components/TopBar';
import { StatsRow } from '../../components/StatsRow';
import { ModuleColumn } from '../../components/ModuleColumn';
import { ApprovalPanel } from '../../components/ApprovalPanel';

export default function Dashboard() {
  const { approvals, stats, lists, approve, discard, isConnected } = useAgentState();

  return (
    <div className="flex min-h-screen bg-[#0F1117]">
      <Sidebar />
      
      <div className="ml-[220px] flex-1">
        <div className="max-w-6xl mx-auto py-8 px-8">
          <TopBar isConnected={isConnected} />
          
          <StatsRow stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ModuleColumn title="Emails" items={lists.emails} />
            </div>
            
            <div className="lg:col-span-1">
              <ApprovalPanel 
                approvals={approvals} 
                onApprove={approve} 
                onDiscard={discard} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
