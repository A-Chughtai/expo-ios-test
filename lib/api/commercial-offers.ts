import { apiRequest } from '@/lib/api-client';
import { CommercialLineItem, CommercialOffer, ForeignIdType } from '@/lib/api-types';

export function getCommercialOffers(foreignId: number, foreignIdType: ForeignIdType) {
  return apiRequest<CommercialOffer[]>('/commercial-offer/', {
    query: { foreign_id: foreignId, foreign_id_type: foreignIdType },
  });
}

export function getCommercialOfferLineItems(foreignId: number, foreignIdType: ForeignIdType) {
  return apiRequest<{
    sum: Record<string, number>;
    record: CommercialLineItem[];
  }>('/commercial-offer/line-item', {
    query: { foreign_id: foreignId, foreign_id_type: foreignIdType },
  });
}
