import { WorkflowTrackingEntry } from '@/lib/api-types';

// The executive approval-gate stage names confirmed against ATOM's workflow engine PDFs
// (docs/Atom - Regular Leads - Workflow 1016.pdf, docs/Atom - Change Requests - Workflow 2015.pdf).
// The design brief's "CEO" role maps to "President Approval" in the actual workflow.
const APPROVAL_GATE_NAMES = ['VPC_APPROVAL', 'VPF_APPROVAL', 'PRESIDENT_APPROVAL'];

export interface ApprovalChainStep {
  id: number;
  label: string;
  role: string;
  status: 'done' | 'current' | 'upcoming';
  approver: string | null;
  timestamp: string | null;
}

// Builds the *resolved, per-deal* approval chain (brief §3): only steps that actually apply to
// this deal, in order, with the current user's step highlighted. Never a fixed hardcoded sequence.
export function resolveApprovalChain(
  timeline: WorkflowTrackingEntry[],
  currentUserId: number | undefined
): ApprovalChainStep[] {
  const gateEntries = timeline.filter((entry) =>
    APPROVAL_GATE_NAMES.some((gate) => entry.name?.toUpperCase().includes(gate.replace('_APPROVAL', '')))
  );

  return gateEntries.map((entry) => {
    const isDone = entry.status === 'PROCESSED';
    const isCurrentUsersStep = !isDone && entry.user?.id === currentUserId;
    return {
      id: entry.id,
      label: entry.label,
      role: entry.permission?.role ?? '',
      status: isDone ? 'done' : isCurrentUsersStep ? 'current' : 'upcoming',
      approver: isDone ? entry.user?.full_name ?? null : null,
      timestamp: isDone ? entry.time : null,
    };
  });
}
