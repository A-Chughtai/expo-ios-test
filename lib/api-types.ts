// Shared TypeScript types mirroring the ATOM API response envelope and core entities,
// derived from docs/Atom Mobile App.postman_collection.json sample responses.

export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  currentPage: number;
  limit: number;
  nextPage: number | null;
  total: number;
  data: T[];
}

export type ForeignIdType = 'LEAD' | 'CHANGE_REQUEST';

export interface AuthTokens {
  access: { token: string; expires: string };
  refresh: { token: string; expires: string };
}

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  username: string;
  profile_picture: string | null;
  official_mobile?: string;
  personal_mobile?: string;
  department?: { id: number; name: string };
  sub_department?: { id: number; name: string };
  designation?: { id: number; name: string };
  region?: { id: number; name: string }[];
  segments?: { id: number; name: string }[];
}

export interface LeadStage {
  id: number;
  name: string;
  label: string;
  component?: string;
  role: string;
  sub_role?: string | null;
}

export interface LeadSummary {
  id: number;
  fiscal_year: string;
  kam_initials: string;
  reference_no: string;
  customer_type: 'NEW' | 'EXISTING';
  total_bandwidth: string | null;
  estimated_mrc: number | null;
  estimated_nrc: number | null;
  final_mrc?: number | null;
  final_nrc?: number | null;
  status: 'PENDING' | 'WIN' | 'REJECTED' | 'KILLED' | string;
  creation_time: string;
  current_stage: LeadStage | null;
  customer: { id: number; legal_name: string };
  user: { id: number; full_name: string };
  currency?: { id: number | null; name: string | null };
}

export interface LeadProduct {
  id: number;
  is_standard: boolean | null;
  product: { id: number; name: string };
}

export interface LeadDetail extends LeadSummary {
  customer_id: number;
  currency_id: number | null;
  user_id: number;
  rack_space: string | null;
  is_contract: boolean | null;
  is_sof: boolean | null;
  estimated_closure_date: string | null;
  proposal_submission_date: string | null;
  proposal_title: string | null;
  poc_id: number | null;
  poc?: { id: number; name: string };
  products: LeadProduct[];
  attachment?: {
    id: number;
    url: string;
    name: string;
    document_type: string;
    creation_time: string;
  }[];
}

export interface CommercialLineItem {
  id: number;
  product_id: number;
  commercial_offer_id: number;
  total_bandwidth: number | null;
  total_rackspace: number | null;
  total_poi: number | null;
  estimated_mrc: string | null;
  estimated_nrc: string | null;
  total_lastmile_mrc: string | null;
  total_lastmile_nrc: string | null;
  total_others_nrc: string | null;
  product_mrc: string | null;
  nrc_margin: string | null;
  quoted_mrc: string | null;
  quoted_nrc: string | null;
  quoted_others: string | null;
  total_mrc: string | null;
  total_nrc: string | null;
  is_standard: boolean | null;
  product: { id: number; name: string };
}

export interface CommercialOffer {
  id: number;
  lead_id: number | null;
  change_request_id: number | null;
  foreign_id: number;
  foreign_id_type: ForeignIdType;
  total_bandwidth: number | null;
  total_poi: number | null;
  estimated_mrc: string | null;
  estimated_nrc: string | null;
  total_lastmile_mrc: number | null;
  total_lastmile_nrc: number | null;
  quoted_mrc: string | null;
  quoted_nrc: string | null;
  revised: boolean | null;
  vpc_approved: boolean | null;
  customer_accept: boolean | null;
  line_item: CommercialLineItem[];
}

export interface WorkflowTrackingEntry {
  id: number;
  label: string;
  description: string | null;
  component: string | null;
  name: string;
  workflow_id: number;
  workflow: { id: number; name: string };
  status: 'PROCESSED' | 'PENDING' | string;
  user: { id: number; full_name: string; profile_picture: string | null } | null;
  permission: { id: number; role: string; sub_role: string | null } | null;
  time: string;
  isLastStage: boolean | null;
  previous_stage: number | null;
  next_stage: number | null;
}

export interface WorkflowComment {
  id: number;
  workflow_stage_id: number;
  foreign_id: number;
  foreign_id_type: ForeignIdType;
  comment: string;
  creation_time: string;
  stage: { id: number; name: string; component: string | null };
  user_created: { id: number; full_name: string; profile_picture: string | null };
}

export interface DashboardCount {
  total_lead: number;
  pending_lead: number;
  win_lead: number;
  kill_lead: number;
  customer: number;
  circuit: number;
}
