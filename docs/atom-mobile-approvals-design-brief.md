# ATOM CRM — Management Approvals Mobile App

## Design brief for Claude Design

This document is a reference for designing a mobile application. Treat it as the source
of truth for what the app does, who uses it, which screens exist, and how it must look.
The visual direction is fixed: reuse ATOM CRM's existing orange-and-white identity, but
express it through modern mobile patterns. Do not introduce a new brand palette.

---

## 1. What this app is

ATOM CRM is Transworld's telecom sales/OSS-BSS platform (built by vendor Softech
Technologies). It runs a long, custom B2B sales pipeline — from lead creation through
commercial approval, contracting, provisioning, and circuit activation.

This mobile app is **not** a full CRM client. It is a focused **approvals app** for
senior management. Its single job: let an executive approver review a deal that is
waiting on their sign-off and act on it — approve, reject, or send it back — from their
phone, wherever they are.

Everything the app shows exists to support that one decision. The app never creates
leads, never edits operator data, and never touches provisioning. It is read-mostly,
with a small, high-stakes set of write actions.

### The product in one sentence
> A fast, trustworthy mobile inbox of deals awaiting my approval, each opening to a clear
> decision screen with the numbers, the context, and three actions.

---

## 2. Who uses it

Approvers only. The full CRM has ~11 department roles; this app serves the management
approval roles.

**Tier 1 — core scope (executive approvals):**
- VP Business Development (labelled `VPC` / `VPBD` in ATOM)
- EVP Finance (labelled `VPF`)
- CEO

**Tier 2 — likely later phase (departmental manager/head gates):**
- KAM Manager · Segment Head · CEG Head (contracts/commercial ops) · Engineering Access
  Manager · Finance (invoice validation) · Price Review Committee (PRC)

> Design for Tier 1 first. Structure the screens so Tier 2 roles can be added without a
> redesign — the queue and detail screens are the same shape for every approver; only the
> data and the label of the current stage change.

Each user sees only the deals assigned to their role at a stage they own. Role-scoping is
enforced server-side; the app renders whatever the backend returns for the signed-in user.

---

## 3. The one architectural rule that shapes the UI

The pipeline is **conditionally routed**. A deal's set of approval steps is computed
per-deal from decision flags (e.g. "VPF approval required: yes/no", "LM required",
"solution design required"). Two deals do not necessarily pass through the same approvers.

**Consequence for design:** the approval-chain component must render the *live, resolved*
chain for the specific deal — only the steps that actually apply to it — with the current
user's step highlighted. Never draw a fixed, hardcoded sequence of steps. Show "where this
deal is, who has signed, who is left, and where I fit."

---

## 4. Visual identity (fixed)

Reuse ATOM's identity. The hex values below are sampled from the web app screenshots and
are close approximations — the design should treat them as the intended palette, and exact
values can be confirmed against the live app's CSS.

### Palette

| Role | Name | Hex (approx) | Usage |
|---|---|---|---|
| Primary | ATOM orange | `#F26522` | Primary buttons, active nav, section header bars, stepper (done/current), key accents |
| Primary tint | Orange wash | `#FDECE3` | Selected/active row background, subtle highlights |
| Page | Cool gray | `#EEF1F5` | App background behind cards |
| Surface | White | `#FFFFFF` | Cards, sheets, list rows |
| Text primary | Ink | `#1F2733` | Headings, values |
| Text secondary | Slate | `#6B7280` | Labels, captions, metadata |
| Border | Hairline | `#E5E7EB` | Dividers, card borders, table lines |

### Semantic / status colors (carry over from ATOM exactly — users already read them this way)

| Meaning | Hex (approx) | Where seen in ATOM |
|---|---|---|
| Pending | `#F5A623` (amber) | "PENDING" pipeline badge |
| Won / Approved / Success | `#27AE60` (green) | "WON" badge, timeline check marks, "Approved By VPBD" chips |
| Killed / Rejected / Danger | `#E24B4A` (red) | "KILLED" badge |
| Active / Info | `#2D9CDB` (blue) | "ACTIVE" customer pill, back-office role badges |

### Role-badge colors (reuse ATOM's convention)
- Sales / KAM → orange
- Back-office & engineering (CEG, ENGINEERING, IT) → blue
- Pre-sales / neutral → gray
- Management / executive approver → use the primary orange at full strength, or a distinct
  deep tone, so exec steps stand apart from operator steps in the chain.

### Typography
- Use a clean, modern sans (e.g. Inter, or the platform system font) at a clear mobile
  scale. ATOM's web UI uses a neutral sans; keep that spirit — legibility over character,
  because this app is dense with numbers and money.
- Two weights: regular for body/labels, medium/semibold for values, headings, and the
  currency figures that drive decisions. Numbers (MRC, NRC, margins) are the hero content —
  give them typographic weight.
- Sentence case throughout. Currency shown as ATOM shows it: `PKR 8,599` / `USD 2,347`.

### Form language
- Rounded cards (12px), generous padding, comfortable tap targets (min 44px).
- Solid flat fills, hairline borders, no heavy shadows or gradients.
- A persistent bottom action bar on the decision screen (thumb-reachable), not a button
  buried at the end of a long scroll.

---

## 5. Screens

### 5.1 Sign in
Corporate SSO / biometric unlock. The app itself must not collect or store raw passwords —
authentication goes through the organization's SSO. Biometric (Face/Touch) re-unlock on
return for speed.

### 5.2 Home — Approval queue (the hero screen)
A prioritized list of deals awaiting *my* approval. This is where the user lands and spends
most of their time; optimize for fast triage.

Each list item (card) shows:
- Reference no (format `YY-KAMinitials-Customer-NNNN`, e.g. `26-UAG-Multinet Pakistan-7392`)
- Customer legal name
- Current stage = the approval I'm being asked for (e.g. "VPC Approval — Commercial Offer")
- Product(s) (e.g. ICONNECT) and headline value (Total MRC)
- Owning KAM
- Time waiting / age (surfaces bottlenecks; supports urgency)
- A small status/urgency indicator

Behaviors: pull-to-refresh, sort (oldest-waiting / highest-value), filter by stage, a count
badge of pending items. Empty state = a calm "You're all caught up" invitation, not an error.

### 5.3 Approval detail (the decision screen)
Opens from a queue card. One screen, scrollable, with a fixed action bar. Sections, in order
of decision priority:

1. **Header** — reference, customer, current stage, overall status chip.
2. **Approval chain** — the resolved per-deal stepper (§3). Completed steps with approver +
   timestamp; current step (me) highlighted; remaining steps muted. This is the trust anchor.
3. **Commercials (primary decision data)** — the line-item table:
   product · bandwidth · Lastmile MRC/NRC (cost) · MRC/NRC margin · Offer MRC/NRC · totals.
   Emphasize **margin** and **Total MRC** — these are what the approver actually judges.
   Carry over ATOM's green "Approved By VPBD" / "Commercials Accepted By Customer" chips.
4. **Context (collapsible, read-only)** —
   - *Customer details*: legal name, NTN, segment, entity (e.g. TES), region, industry, POC.
   - *CRF / last-mile list*: per site — CRF#, city, connectivity (primary/backup),
     bandwidth, vendor and vendor MRC/NRC, POP. (Explains where the cost/margin comes from.)
5. **Timeline** — read-only audit trail of every completed stage (role, person, timestamp).
6. **Comments** — thread of notes captured across workflow stages; read, and add a comment.

Fixed action bar: **Approve · Reject · Send back**. Where the current step owns a routing
decision (e.g. "VPF approval required: yes/no"), surface that as an explicit control here.

### 5.4 Approve
Confirmation sheet: a compact summary of what's being approved (customer, stage, Total MRC),
optional comment, and a single clear "Approve" confirm. Success returns to the queue with the
item removed and a toast ("Approved").

### 5.5 Reject / Send back
A sheet with a required reason. Distinguish the two outcomes clearly:
- **Reject** = stop the deal (terminal for this approval).
- **Send back** = return to a prior stage for rework, with a mandatory comment explaining what
  to fix. Provide quick-pick reason templates to minimize typing on mobile.

### 5.6 Notifications
Push when a deal enters my queue; deep-link straight into its approval detail. In-app list of
recent notifications. The reference no is the stable deep-link key.

### 5.7 Dashboard (optional, minimal)
A lightweight glance — not a port of the web dashboard. If included: my pending-approval count
(hero), then a scrollable strip of KPI cards (Won MRC, Pending Leads, Win Rate, Contracted BW).
Omit the dense web widgets (treemap, revenue line chart, donut) — they don't aid an approval.

### 5.8 Profile / settings
Signed-in identity and role, notification preferences, biometric toggle, sign out.

---

## 6. Data entities (for wiring screens to real fields)

- **Lead / deal**: reference, customer, segment, entity, region, owning KAM, product(s),
  current stage, overall status (pending/won/killed), resolved approval chain.
- **Commercial line item**: product, bandwidth, lastmile MRC, lastmile NRC, other NRC,
  product MRC, MRC margin, NRC margin, offer MRC, offer NRC; roll-up Total MRC / Total NRC.
- **CRF (Circuit Request Form)** = one site/circuit: CRF#, city, access team/region,
  connectivity (primary/secondary), bandwidth/rackspace, GPON flag, POP city/location,
  vendor, vendor MRC/NRC, link type.
- **Approval step**: stage name, role, required (yes/no), status, actor, timestamp, comment.
- **Customer**: legal name, customer number, NTN, address, segment, industry, entity,
  region/city, billing type, service lock-in; POC list (name, designation, contact, email, CNIC).
- **Comment**: author, role, stage, timestamp, text.

---

## 7. UX principles

- **Triage-first.** The user's job is to clear a queue. Every tap from queue → decision →
  done should be minimal. The queue is the home, not a dashboard.
- **Numbers are the content.** Money and margin get the strongest type. Everything else
  supports them.
- **Trust through transparency.** Always show the resolved approval chain and the audit
  trail — an approver must see who signed before them and what was agreed.
- **Minimal typing.** Reason templates and quick-picks for reject/send-back. Comments optional
  on approve, required on reject/send-back.
- **Deep-linkable.** Push notification → exact approval screen, keyed on reference no.
- **Read-tolerant, write-careful.** Reading works fast and can degrade gracefully; the three
  write actions are deliberate, confirmed, and reflected immediately in the queue.
- **Consistent verbs.** A control says what it does and keeps that word through the flow
  (button "Approve" → toast "Approved").

---

## 8. Glossary (so labels are understood, not renamed)

Keep ATOM's terms on screen where users already know them; this glossary is for the designer's
understanding, not for relabeling the UI.

- **MRC** — Monthly Recurring Charge (recurring revenue). **NRC** — Non-Recurring Charge (one-time).
- **KAM** — Key Account Manager (sales owner of the deal).
- **LM** — Last Mile (final physical link to the customer site). **CRF** — Circuit Request Form
  (one site/circuit line item). **POP** — Point of Presence (network node). **GPON** — fiber
  access technology.
- **SOF** — Service Order Form (formal order document).
- **VPC / VPBD** — VP Business Development. **VPF** — (E)VP Finance. **PRC** — Price Review
  Committee. **CEG** — commercial/contracts group (`.HEAD` = its head). **C-OPS** — Commercial
  Operations. **SEGMENT** — segment head/team.
- **NTN** — National Tax Number (company). **CNIC** — national ID (individual, Pakistan).
- **POC** — Point of Contact (person at the customer). **Entity** — the selling Transworld legal
  entity (e.g. TES). **Segment** — customer market segment (e.g. SME/Corporate).
- **Circuit** — one provisioned connection. **BW** — bandwidth (Mbps).
- Status badges: **Pending / Won / Killed** (pipeline), **Active** (customer).

---

## 9. Out of scope

- Creating or editing leads; any operator data entry.
- All pipeline phases other than the management-approval gates: sales/qualify work,
  fulfilment/invoicing/last-mile ordering, provisioning/testing/activation.
- Trouble tickets, change requests, invoicing, VLAN utilization, HRM, configuration.
- Full analytics — only the optional minimal glance in §5.7.

---

## 10. Open questions to confirm before/while building (not blockers for design)

1. **Scope:** Tier 1 only, or Tier 1 + Tier 2? (Affects roles, not screen shapes.)
2. **Routing rules:** what makes VPF or CEO approval "required" for a deal (value? margin
   floor? term?). The app consumes these flags; it does not compute them.
3. **API:** does ATOM expose a role-scoped lead list and accept approve/reject/send-back
   actions? Screen data maps to §6 entities.

---

*Design note: ATOM orange (`#F26522`) is the brand, used with intent. Keep surrounding UI quiet
and disciplined so the money, the margin, and the three actions are what stand out. Modern mobile
patterns — bottom action bar, sheets, collapsible context, biometric unlock — over a familiar
ATOM palette.*
