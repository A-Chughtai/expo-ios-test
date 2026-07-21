import { apiRequest } from '@/lib/api-client';
import { ForeignIdType } from '@/lib/api-types';

// VPC/VPF approval on a sale order (§5.4 Approve). 204 on success.
export function approveSaleOrder(params: {
  foreignId: number;
  foreignIdType: ForeignIdType;
  vpcApproved?: boolean;
  vpfApproved?: boolean;
}) {
  return apiRequest<Record<string, never>>('/sale-order', {
    method: 'PATCH',
    query: { foreign_id: params.foreignId, foreign_id_type: params.foreignIdType },
    body: {
      ...(params.vpcApproved !== undefined ? { vpc_approved: params.vpcApproved } : {}),
      ...(params.vpfApproved !== undefined ? { vpf_approved: params.vpfApproved } : {}),
    },
  });
}
