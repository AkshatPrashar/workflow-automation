'use client';
import { useState, useEffect } from 'react';
import { ApprovalItem } from './mockData'; // Keeping this import just for the ApprovalItem type if it exists there, but actually let's define it or assume it's exported. Wait, mockData.ts has the type.

export function useAgentState() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [stats, setStats] = useState({
    processed_emails: 0,
    meetings_scheduled: 0,
    pending_tasks: 0,
    ai_accuracy: 0
  });
  const [lists, setLists] = useState({
    emails: [],
    meetings: [],
    tasks: [],
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
        console.error('Failed to fetch from API', err);
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
    
    if (process.env.NEXT_PUBLIC_API_URL) {
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
    
    if (process.env.NEXT_PUBLIC_API_URL) {
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
