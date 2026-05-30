export interface Item {
  id: string;
  title: string;
  subtitle: string;
  status: 'pending' | 'completed' | 'processing' | 'failed' | 'draft';
  timestamp: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: string;
  details: string;
  timestamp: string;
}

export const mockData = {
  emails: [
    { id: 'e1', title: 'Q3 Report Summary', subtitle: 'From: Sarah Jenkins', status: 'completed', timestamp: '10 mins ago' },
    { id: 'e2', title: 'Vendor Negotiation', subtitle: 'From: Acme Corp', status: 'processing', timestamp: '1 hr ago' },
  ] as Item[],
  meetings: [
    { id: 'm1', title: 'Product Sync', subtitle: 'Prepared 3 Action Items', status: 'completed', timestamp: '2 hrs ago' },
    { id: 'm2', title: 'Design Review', subtitle: 'Drafting notes...', status: 'processing', timestamp: '3 hrs ago' },
  ] as Item[],
  tasks: [
    { id: 't1', title: 'Update JIRA Ticket #441', subtitle: 'Added bug details', status: 'completed', timestamp: '5 mins ago' },
    { id: 't2', title: 'Schedule Team Lunch', subtitle: 'Calendar invite drafted', status: 'draft', timestamp: '30 mins ago' },
  ] as Item[],
  pending_approvals: [
    { id: 'a1', title: 'Send Email Response', type: 'Email', details: 'Reply to Sarah regarding Q3 report metrics.', timestamp: 'Just now' },
    { id: 'a2', title: 'Schedule Meeting', type: 'Calendar', details: 'Sync with Marketing team on Tuesday.', timestamp: '5 mins ago' },
    { id: 'a3', title: 'Close JIRA Ticket', type: 'Task', details: 'Mark bug #441 as resolved.', timestamp: '10 mins ago' },
  ] as ApprovalItem[],
  stats: {
    emailsProcessed: 142,
    draftsReady: 8,
    actionItems: 24,
    tasksCreated: 15,
  }
};
