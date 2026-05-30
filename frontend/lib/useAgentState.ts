'use client';
import { useState, useEffect } from 'react';
import { mockData, ApprovalItem } from './mockData';

export function useAgentState() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockData.pending_approvals);
  const [stats, setStats] = useState(mockData.stats);
  const [lists, setLists] = useState({
    emails: mockData.emails,
    meetings: mockData.meetings,
    tasks: mockData.tasks,
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchState = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/state`);
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        
        if (data.pending_approvals) setApprovals(data.pending_approvals);
        if (data.stats) setStats(data.stats);
        
        setLists(prev => ({
          emails: data.emails || prev.emails,
          meetings: data.meetings || prev.meetings,
          tasks: data.tasks || prev.tasks,
        }));
        
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to fetch from API, falling back to mock data', err);
        setIsConnected(false);
      }
    };

    if (process.env.NEXT_PUBLIC_API_URL) {
      fetchState();
      interval = setInterval(fetchState, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const approve = async (id: string) => {
    // Optimistic update
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    
    if (process.env.NEXT_PUBLIC_API_URL && isConnected) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action_id: id })
        });
      } catch (err) {
        console.error('Approve API failed', err);
      }
    }
  };

  const discard = async (id: string) => {
    // Optimistic update
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    
    if (process.env.NEXT_PUBLIC_API_URL && isConnected) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action_id: id })
        });
      } catch (err) {
        console.error('Discard API failed', err);
      }
    }
  };

  return { approvals, stats, lists, approve, discard, isConnected };
}
