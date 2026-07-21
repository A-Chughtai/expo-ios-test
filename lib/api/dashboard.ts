import { apiRequest } from '@/lib/api-client';
import { DashboardCount } from '@/lib/api-types';

export function getDashboardCount() {
  return apiRequest<DashboardCount>('/dashboard/count');
}
