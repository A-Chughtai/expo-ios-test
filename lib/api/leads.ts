import { apiRequest } from '@/lib/api-client';
import { LeadDetail, LeadSummary, PaginatedData } from '@/lib/api-types';

export function getLeads(params: { page?: number; limit?: number; order_direction?: 'asc' | 'desc' } = {}) {
  return apiRequest<PaginatedData<LeadSummary>>('/lead', {
    query: { limit: 15, order_direction: 'desc', page: 1, ...params },
  });
}

export function getLeadById(id: number) {
  return apiRequest<LeadDetail>(`/lead/${id}`);
}

export function rejectLead(id: number) {
  return apiRequest<Record<string, never>>(`/lead/${id}/reject`, { method: 'PUT' });
}
