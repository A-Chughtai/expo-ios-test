import { apiRequest } from '@/lib/api-client';
import { ForeignIdType, WorkflowComment, WorkflowTrackingEntry } from '@/lib/api-types';

export function getTrackingTimeline(params: {
  foreignId: number;
  foreignIdType: ForeignIdType;
  workflowId: number;
}) {
  return apiRequest<{ timeline: WorkflowTrackingEntry[] }>('/workflow/tracking-timeline', {
    query: {
      foreign_id: params.foreignId,
      foreign_id_type: params.foreignIdType,
      workflow_id: params.workflowId,
    },
  });
}

export function getComments(foreignId: number, foreignIdType: ForeignIdType) {
  return apiRequest<WorkflowComment[]>('/workflow/comment', {
    query: { foreign_id: foreignId, foreign_id_type: foreignIdType },
  });
}

export function addComment(params: {
  foreignId: number;
  foreignIdType: ForeignIdType;
  workflowStageId: number;
  comment: string;
}) {
  return apiRequest<Record<string, never>>('/workflow/comment', {
    method: 'POST',
    body: {
      foreign_id: params.foreignId,
      foreign_id_type: params.foreignIdType,
      workflow_stage_id: String(params.workflowStageId),
      comment: params.comment,
    },
  });
}

export function sendBack(params: {
  foreignId: number;
  foreignIdType: ForeignIdType;
  workflowId: number;
  workflowStageId: number;
  reason: string;
}) {
  return apiRequest<Record<string, never>>('/workflow/create-back-tracking', {
    method: 'POST',
    body: {
      foreign_id: params.foreignId,
      foreign_id_type: params.foreignIdType,
      workflow_id: String(params.workflowId),
      workflow_stage_id: String(params.workflowStageId),
      value: params.reason,
    },
  });
}

export function rejectTracking(params: {
  foreignId: number;
  foreignIdType: ForeignIdType;
  workflowId: number;
  workflowStageId: number;
  reason: string;
}) {
  return apiRequest<Record<string, never>>('/workflow/create-reject-tracking', {
    method: 'POST',
    body: {
      foreign_id: params.foreignId,
      foreign_id_type: params.foreignIdType,
      workflow_id: String(params.workflowId),
      workflow_stage_id: String(params.workflowStageId),
      value: params.reason,
    },
  });
}
