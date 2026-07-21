import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApprovalChain } from '@/components/approval-chain';
import { Collapsible } from '@/components/ui/collapsible';
import { MoneyText } from '@/components/money-text';
import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/contexts/session-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ApiError } from '@/lib/api-client';
import { resolveApprovalChain } from '@/lib/approval-chain';
import { getCommercialOfferLineItems } from '@/lib/api/commercial-offers';
import { getLeadById } from '@/lib/api/leads';
import { addComment, getComments, getTrackingTimeline } from '@/lib/api/workflow';
import {
  CommercialLineItem,
  LeadDetail,
  WorkflowComment,
  WorkflowTrackingEntry,
} from '@/lib/api-types';

export default function ApprovalDetailScreen() {
  const { referenceNo, leadId } = useLocalSearchParams<{ referenceNo: string; leadId: string }>();
  const router = useRouter();
  const { user } = useSession();

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [lineItems, setLineItems] = useState<CommercialLineItem[]>([]);
  const [timeline, setTimeline] = useState<WorkflowTrackingEntry[]>([]);
  const [comments, setComments] = useState<WorkflowComment[]>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');
  const success = useThemeColor({}, 'success');

  const numericLeadId = Number(leadId);

  const load = useCallback(async () => {
    if (!numericLeadId) return;
    try {
      setError(null);
      const [leadData, lineItemData, timelineData, commentsData] = await Promise.all([
        getLeadById(numericLeadId),
        getCommercialOfferLineItems(numericLeadId, 'LEAD').catch(() => ({ record: [] })),
        getTrackingTimeline({ foreignId: numericLeadId, foreignIdType: 'LEAD', workflowId: 1 }).catch(
          () => ({ timeline: [] })
        ),
        getComments(numericLeadId, 'LEAD').catch(() => []),
      ]);
      setLead(leadData);
      setLineItems(lineItemData.record);
      setTimeline(timelineData.timeline);
      setComments(commentsData);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load this approval.');
    } finally {
      setIsLoading(false);
    }
  }, [numericLeadId]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitComment() {
    if (!commentDraft.trim() || !numericLeadId) return;
    const stageId = lead?.current_stage?.id;
    if (!stageId) return;
    try {
      await addComment({
        foreignId: numericLeadId,
        foreignIdType: 'LEAD',
        workflowStageId: stageId,
        comment: commentDraft.trim(),
      });
      setCommentDraft('');
      const refreshed = await getComments(numericLeadId, 'LEAD');
      setComments(refreshed);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not add comment.');
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={tint} />
      </SafeAreaView>
    );
  }

  if (error && !lead) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: background }]}>
        <Text style={{ color: danger, textAlign: 'center', paddingHorizontal: 24 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!lead) return null;

  const chainSteps = resolveApprovalChain(timeline, user?.id);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBlock}>
          <Text style={[styles.reference, { color: secondaryColor }]}>{referenceNo}</Text>
          <ThemedText type="title" numberOfLines={2}>
            {lead.customer?.legal_name}
          </ThemedText>
          <View style={styles.headerMetaRow}>
            {lead.current_stage && (
              <Text style={[styles.stage, { color: tint }]}>{lead.current_stage.label}</Text>
            )}
            <StatusBadge status={lead.status} />
          </View>
        </View>

        <Section title="Approval chain" surface={surface} border={border} textColor={textColor}>
          <ApprovalChain steps={chainSteps} />
        </Section>

        <Section title="Commercials" surface={surface} border={border} textColor={textColor}>
          {lineItems.length === 0 ? (
            <Text style={{ color: secondaryColor }}>No commercial line items found.</Text>
          ) : (
            lineItems.map((item) => (
              <View key={item.id} style={[styles.lineItem, { borderColor: border }]}>
                <Text style={[styles.lineItemProduct, { color: textColor }]}>
                  {item.product?.name}
                </Text>
                <View style={styles.lineItemRow}>
                  <Text style={{ color: secondaryColor, fontSize: 13 }}>
                    Bandwidth: {item.total_bandwidth ?? '—'} Mbps
                  </Text>
                </View>
                <View style={styles.lineItemRow}>
                  <View style={styles.lineItemColumn}>
                    <Text style={{ color: secondaryColor, fontSize: 12 }}>Lastmile MRC</Text>
                    <MoneyText value={item.total_lastmile_mrc} />
                  </View>
                  <View style={styles.lineItemColumn}>
                    <Text style={{ color: secondaryColor, fontSize: 12 }}>MRC margin</Text>
                    <MoneyText value={item.nrc_margin} />
                  </View>
                </View>
                <View style={styles.lineItemRow}>
                  <View style={styles.lineItemColumn}>
                    <Text style={{ color: secondaryColor, fontSize: 12 }}>Offer MRC</Text>
                    <MoneyText value={item.quoted_mrc} emphasis="hero" />
                  </View>
                  <View style={styles.lineItemColumn}>
                    <Text style={{ color: secondaryColor, fontSize: 12 }}>Total MRC</Text>
                    <MoneyText value={item.total_mrc} emphasis="hero" />
                  </View>
                </View>
              </View>
            ))
          )}
        </Section>

        <Section title="Context" surface={surface} border={border} textColor={textColor} padded={false}>
          <View style={styles.collapsibleWrap}>
            <Collapsible title="Customer details">
              <DetailRow label="Legal name" value={lead.customer?.legal_name} secondaryColor={secondaryColor} textColor={textColor} />
              <DetailRow label="Customer type" value={lead.customer_type} secondaryColor={secondaryColor} textColor={textColor} />
              <DetailRow label="Fiscal year" value={lead.fiscal_year} secondaryColor={secondaryColor} textColor={textColor} />
              <DetailRow label="KAM initials" value={lead.kam_initials} secondaryColor={secondaryColor} textColor={textColor} />
            </Collapsible>
          </View>
          <View style={styles.collapsibleWrap}>
            <Collapsible title={`Products (${lead.products?.length ?? 0})`}>
              {lead.products?.map((p) => (
                <DetailRow
                  key={p.id}
                  label={p.product.name}
                  value={p.is_standard ? 'Standard' : 'Non-standard'}
                  secondaryColor={secondaryColor}
                  textColor={textColor}
                />
              ))}
            </Collapsible>
          </View>
        </Section>

        <Section title="Timeline" surface={surface} border={border} textColor={textColor}>
          {timeline.length === 0 ? (
            <Text style={{ color: secondaryColor }}>No timeline entries yet.</Text>
          ) : (
            timeline.map((entry) => (
              <View key={entry.id} style={[styles.timelineRow, { borderColor: border }]}>
                <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }}>
                  {entry.label}
                </Text>
                <Text style={{ color: secondaryColor, fontSize: 12 }}>
                  {entry.user?.full_name ?? 'Unassigned'} ·{' '}
                  {entry.time ? new Date(entry.time).toLocaleString() : '—'}
                </Text>
              </View>
            ))
          )}
        </Section>

        <Section title="Comments" surface={surface} border={border} textColor={textColor}>
          {comments.map((c) => (
            <View key={c.id} style={[styles.commentRow, { borderColor: border }]}>
              <Text style={{ color: textColor, fontWeight: '600', fontSize: 13 }}>
                {c.user_created?.full_name}
              </Text>
              <Text style={{ color: textColor, fontSize: 14, marginTop: 2 }}>{c.comment}</Text>
              <Text style={{ color: secondaryColor, fontSize: 11, marginTop: 2 }}>
                {new Date(c.creation_time).toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.commentInputRow}>
            <TextInput
              style={[styles.commentInput, { borderColor: border, color: textColor }]}
              value={commentDraft}
              onChangeText={setCommentDraft}
              placeholder="Add a comment…"
              placeholderTextColor={secondaryColor}
              multiline
            />
            <Pressable
              style={[styles.commentSubmit, { backgroundColor: tint, opacity: commentDraft.trim() ? 1 : 0.5 }]}
              disabled={!commentDraft.trim()}
              onPress={submitComment}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Post</Text>
            </Pressable>
          </View>
        </Section>
      </ScrollView>

      <View style={[styles.actionBar, { backgroundColor: surface, borderColor: border }]}>
        <Pressable
          style={[styles.actionButton, styles.sendBackButton, { borderColor: border }]}
          onPress={() =>
            router.push(
              `/approval/${referenceNo}/send-back?leadId=${leadId}&stageId=${lead.current_stage?.id ?? ''}`
            )
          }>
          <Text style={{ color: textColor, fontWeight: '600' }}>Send back</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.rejectButton, { borderColor: danger }]}
          onPress={() => router.push(`/approval/${referenceNo}/reject?leadId=${leadId}`)}>
          <Text style={{ color: danger, fontWeight: '600' }}>Reject</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.approveButton, { backgroundColor: success }]}
          onPress={() => router.push(`/approval/${referenceNo}/approve?leadId=${leadId}`)}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Approve</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
  surface,
  border,
  textColor,
  padded = true,
}: {
  title: string;
  children: React.ReactNode;
  surface: string;
  border: string;
  textColor: string;
  padded?: boolean;
}) {
  return (
    <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <View style={padded ? undefined : styles.unpaddedBody}>{children}</View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  secondaryColor,
  textColor,
}: {
  label: string;
  value?: string | null;
  secondaryColor: string;
  textColor: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={{ color: secondaryColor, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: textColor, fontSize: 13, fontWeight: '500' }}>{value ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100, gap: 16 },
  headerBlock: { gap: 4 },
  reference: { fontSize: 12, fontWeight: '500' },
  headerMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  stage: { fontSize: 14, fontWeight: '600' },
  section: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
  },
  unpaddedBody: { gap: 10 },
  collapsibleWrap: { marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  lineItem: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, gap: 6 },
  lineItemProduct: { fontWeight: '600', fontSize: 14 },
  lineItemRow: { flexDirection: 'row', gap: 24 },
  lineItemColumn: { gap: 2 },
  timelineRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, gap: 2 },
  commentRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, gap: 2 },
  commentInputRow: { marginTop: 4, gap: 8 },
  commentInput: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
  },
  commentSubmit: {
    alignSelf: 'flex-end',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  sendBackButton: { borderWidth: 1 },
  rejectButton: { borderWidth: 1.5 },
  approveButton: {},
});
