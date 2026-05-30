'use client';
import { useState, useEffect, useRef } from 'react';
import { ApprovalItem, Item } from './mockData';

export function useAgentState() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [stats, setStats] = useState({
    processed_emails: 0,
    meetings_scheduled: 0,
    pending_tasks: 0,
    ai_accuracy: 0
  });
  const [lists, setLists] = useState<{ emails: Item[], meetings: Item[], tasks: Item[] }>({
    emails: [],
    meetings: [],
    tasks: [],
  });
  const [isConnected, setIsConnected] = useState(false);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const authenticate = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) return false;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'demo@workflow.com', password: 'demo123' })
        });
        
        if (!res.ok) throw new Error('Authentication failed');
        
        const data = await res.json();
        // Support common JWT payload structures
        tokenRef.current = data.token || data.access_token;
        return true;
      } catch (err) {
        console.error('Login failed:', err);
        setIsConnected(false);
        return false;
      }
    };

    const fetchState = async () => {
      if (!process.env.NEXT_PUBLIC_API_URL) return;
      
      // Ensure we have a token before attempting to fetch protected routes
      if (!tokenRef.current) {
        const authed = await authenticate();
        if (!authed) return;
      }
      
      try {
        const headers = {
          'Authorization': `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json'
        };

        // 1. Fetch real emails from the new endpoint
        const emailsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails`, { headers });
        if (!emailsRes.ok) throw new Error('Emails fetch failed');
        const emailsData = await emailsRes.json();
        
        // 2. We still fetch the /api/state for the other dashboard items (approvals, stats, meetings)
        try {
          const stateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/state`, { headers });
          if (stateRes.ok) {
            const data = await stateRes.json();
            if (data.pending_approvals) setApprovals(data.pending_approvals);
            if (data.stats) setStats(data.stats);
            setLists(prev => ({
              ...prev,
              meetings: data.meetings || prev.meetings,
              tasks: data.tasks || prev.tasks,
            }));
          }
        } catch (e) {
          console.warn('Could not fetch /api/state', e);
        }

        // Update the emails list independently using the real /emails endpoint
        setLists(prev => ({
          ...prev,
          emails: Array.isArray(emailsData) ? emailsData : (emailsData.emails || [])
        }));
        
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to fetch from API:', err);
        setIsConnected(false);
        // Clear token if it failed (might be expired), forcing a re-auth on next poll
        tokenRef.current = null;
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
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    
    if (process.env.NEXT_PUBLIC_API_URL && tokenRef.current) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/approve`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenRef.current}`
          },
          body: JSON.stringify({ action_id: id })
        });
      } catch (err) {
        console.error('Approve API failed', err);
      }
    }
  };

  const discard = async (id: string) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    
    if (process.env.NEXT_PUBLIC_API_URL && tokenRef.current) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discard`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenRef.current}`
          },
          body: JSON.stringify({ action_id: id })
        });
      } catch (err) {
        console.error('Discard API failed', err);
      }
    }
  };

  return { approvals, stats, lists, approve, discard, isConnected };
}
