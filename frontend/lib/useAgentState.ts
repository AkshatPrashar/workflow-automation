'use client';
import { useState, useEffect } from 'react';
import { mockData, ApprovalItem } from './mockData';

export function useAgentState() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [stats, setStats] = useState(mockData.stats);
  const [lists, setLists] = useState({
    emails: mockData.emails,
    meetings: mockData.meetings,
    tasks: mockData.tasks,
  });

  useEffect(() => {
    // Initial load
    setApprovals(mockData.pending_approvals);

    // If API URL is set, poll
    if (process.env.NEXT_PUBLIC_API_URL) {
      const interval = setInterval(() => {
        // Mock polling logic
        console.log('Polling /api/state...');
      }, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  const approve = (id: string) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    // Optimistic UI updates could go here
  };

  const discard = (id: string) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  return { approvals, stats, lists, approve, discard };
}
