import { useState, useRef, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";
import { track } from "@vercel/analytics";
import "./App.css";

const API_BASE_URL = "https://changewatch.onrender.com";

// SVG UI Icons
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CardsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const SplitIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </svg>
);

const UnifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CpuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PdfDocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ExcelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M10 9h4" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

const ChatBotIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" fill="currentColor" fillOpacity="0.25" />
    <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
    <circle cx="19" cy="5" r="2" fill="currentColor" />
    <circle cx="5" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

const SendChatIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ClearChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Official Brand SVGs
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

const GmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22 6c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v.38l10 6.67 10-6.67V6z" />
    <path fill="#34A853" d="M2 7.78V18c0 .55.45 1 1 1h4v-7.67L2 7.78z" />
    <path fill="#EA4335" d="M22 7.78l-5 3.55V19h4c.55 0 1-.45 1-1V7.78z" />
    <path fill="#FBBC05" d="M7 19h10V11.33L12 14.67 7 11.33V19z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

// Pre-packaged realistic sample datasets for 4 domain-specific comparison modes
const AUDIT_MODES = [
  {
    id: "academic",
    name: "Academic & Cutoffs",
    icon: "🎓",
    badge: "Ranks, Cutoffs & Seats",
    tagline: "Pinpoint quota shifts, cutoff relaxation, seat adjustments, and counseling dates.",
    demoData: {
      oldName: "Engineering_Cutoff_Round1.pdf",
      newName: "Engineering_Cutoff_Round2_Revised.pdf",
      summary: "Round 2 Counseling Cutoff revision detected significant rank shifts across Computer Science and AI branches. Closing ranks relaxed by an average of +440 ranks across premier institutes, intake capacity was doubled for AICTE-approved AI specializations, and the physical reporting window was extended.",
      totalChanges: 4,
      changes: [
        {
          title: "Computer Science & Engineering (B.E.) — General Merit Cutoff",
          type: "Rank / Cutoff Shift",
          importance: "important",
          oldValue: "Closing Cutoff Rank: 2,450 (Round 1 Allotment)",
          newValue: "Closing Cutoff Rank: 2,890 (Round 2 Revised Allotment)",
          explanation: "The cutoff relaxed by +440 ranks in Round 2, increasing admission eligibility for waitlisted candidates."
        },
        {
          title: "Artificial Intelligence & Data Science — Sanctioned Intake",
          type: "Capacity Metric",
          importance: "important",
          oldValue: "Sanctioned Seats: 60 Seats",
          newValue: "Sanctioned Seats: 120 Seats (AICTE Approved Extension)",
          explanation: "Branch intake capacity doubled from 60 to 120 seats, which significantly reduced rank competition."
        },
        {
          title: "Tuition & Laboratory Caution Deposit Schedule",
          type: "Fee Alteration",
          importance: "standard",
          oldValue: "Annual Tuition: ₹85,000 / Semester",
          newValue: "Annual Tuition: ₹85,000 + ₹6,500 Refundable Lab & Library Deposit",
          explanation: "A mandatory refundable caution deposit has been newly added in the revised counseling notification."
        },
        {
          title: "Physical Document Verification & Reporting Deadline",
          type: "Date Extension",
          importance: "standard",
          oldValue: "Reporting Deadline: October 20, 2026 (5:00 PM)",
          newValue: "Extended Deadline: October 26, 2026 (5:00 PM)",
          explanation: "Verification and fee submission window has been officially extended by 6 days."
        }
      ],
      actions: [
        "Verify your updated Round 2 cutoff rank against candidate allotment lists.",
        "Ensure the ₹6,500 laboratory deposit receipt is carried during in-person verification.",
        "Complete reporting before the extended deadline of October 26, 2026 (5:00 PM)."
      ]
    }
  },
  {
    id: "legal",
    name: "Legal & Contracts",
    icon: "⚖️",
    badge: "Liability, Notice & Indemnity",
    tagline: "Flags altered liability caps, shortened termination notice, and hidden penalty terms.",
    demoData: {
      oldName: "Vendor_Master_Service_Agreement_v1.0.pdf",
      newName: "Vendor_Master_Service_Agreement_v2.1_REVISED.pdf",
      summary: "Critical liability and operational risk shifts detected in vendor revision. The vendor added a hard $50,000 liability cap that now covers data breaches, reduced termination notice from 60 to 14 days, and doubled late payment penalties.",
      totalChanges: 4,
      changes: [
        {
          title: "Section 8.2 — Limitation of Liability & Data Breach Cap",
          type: "Liability Ceiling",
          importance: "important",
          oldValue: "Total aggregate liability uncapped for confidentiality and data protection incidents.",
          newValue: "Vendor aggregate liability capped at fees paid in past 30 days, not to exceed $50,000 maximum ceiling.",
          explanation: "High Legal Exposure: Even in catastrophic data breach events, your recovery is now strictly capped at $50,000."
        },
        {
          title: "Section 12.1 — Termination for Convenience Notice Period",
          type: "Contract Term",
          importance: "important",
          oldValue: "Either party may terminate upon sixty (60) days prior written notice.",
          newValue: "Vendor may terminate upon fourteen (14) days electronic notice. Customer must provide ninety (90) days notice.",
          explanation: "Asymmetric Termination: The vendor can cancel services in 14 days, risking operational downtime."
        },
        {
          title: "Section 4.3 — Late Payment Compounding Interest",
          type: "Financial Term",
          importance: "standard",
          oldValue: "Late payments accrue 1.5% simple monthly interest. Net 45 payment terms.",
          newValue: "Late payments accrue 3.5% monthly compound interest plus $250 penalty per cycle. Net 30 payment terms.",
          explanation: "Financial Penalty: Payment window shortened by 15 days with interest rate more than doubled."
        },
        {
          title: "Section 16.7 — AI Training & Data Ingestion License",
          type: "Intellectual Property",
          importance: "important",
          oldValue: "(Clause did not exist in original agreement)",
          newValue: "Customer grants Vendor a perpetual, royalty-free license to use Customer telemetry to train AI models.",
          explanation: "New Ingestion Clause: Allows vendor to ingest your company's proprietary data for commercial AI training."
        }
      ],
      actions: [
        "Reject Section 8.2 liability cap and request reinstatement of uncapped data breach indemnification.",
        "Negotiate Section 12.1 termination notice back to a mutual 60-day written requirement.",
        "Strike Section 16.7 to preserve proprietary customer data confidentiality."
      ]
    }
  },
  {
    id: "finance",
    name: "Invoices & Quotations",
    icon: "💰",
    badge: "Unit Rates & Hidden Surcharges",
    tagline: "Detects unit price increases, unapproved line items, and altered billing cycles.",
    demoData: {
      oldName: "SaaS_Enterprise_Estimate_Q1_Approved.xlsx",
      newName: "Vendor_Final_Invoice_Q2_Billed.xlsx",
      summary: "Financial discrepancy audit detected a total invoice variance of +$4,820 over approved budget. Discrepancies include an unannounced 18.75% base seat license price hike and a new cloud egress bandwidth surcharge.",
      totalChanges: 4,
      changes: [
        {
          title: "Enterprise Seat Licenses (50 Users Tier)",
          type: "Unit Price Hike",
          importance: "important",
          oldValue: "Approved Rate: $40.00 / user / month ($2,000.00 total)",
          newValue: "Billed Rate: $47.50 / user / month ($2,375.00 total)",
          explanation: "Unit cost increased by +18.75% without prior contractual price change notification."
        },
        {
          title: "Cloud Egress & Data Pipeline Fee",
          type: "Unapproved Line Item",
          importance: "important",
          oldValue: "(Zero line items — bundled within base infrastructure)",
          newValue: "New Surcharge: $850.00 / month for high-throughput data transfer",
          explanation: "An unapproved recurring surcharge was introduced outside the agreed scope of work."
        },
        {
          title: "Custom SLA Support & Dedicated Account Manager",
          type: "Support Fee",
          importance: "standard",
          oldValue: "Complimentary Tier 1 dedicated support included in annual contract.",
          newValue: "Tier 1 dedicated support billed at $600.00 / quarter.",
          explanation: "Formerly complimentary account management converted into a billable quarterly charge."
        },
        {
          title: "Payment Window & Currency Exchange Clause",
          type: "Billing Term",
          importance: "standard",
          oldValue: "Payment due within Net 60 days. Fixed INR / USD conversion peg.",
          newValue: "Payment due within Net 15 days. Variable spot exchange rate on payment date.",
          explanation: "Cash flow risk shifted to buyer via shorter payment cycle and unpegged currency rate."
        }
      ],
      actions: [
        "Issue formal dispute notice for unapproved $850 cloud data surcharge.",
        "Request credit note adjustment for the $375 seat license unit price discrepancy.",
        "Reconcile against approved Q1 purchase order before authorizing accounts payable release."
      ]
    }
  },
  {
    id: "policy",
    name: "Policies & Insurance",
    icon: "🛡️",
    badge: "Exclusions & Coverage Caps",
    tagline: "Surfaces room rent limits, disease waiting period additions, and policy exclusions.",
    demoData: {
      oldName: "Corporate_Mediclaim_Policy_2025.pdf",
      newName: "Corporate_Mediclaim_Policy_2026_Renewal.pdf",
      summary: "Significant coverage limitations introduced in 2026 policy renewal. Insurer introduced a 1% sum insured capping on hospital room rent and added a mandatory 15% co-payment for robotic surgeries.",
      totalChanges: 4,
      changes: [
        {
          title: "Hospital Room Rent & ICU Daily Charges",
          type: "Coverage Sub-limit",
          importance: "important",
          oldValue: "No room rent capping (Eligible for Single Private Room AC without sub-limits).",
          newValue: "Room rent capped at 1% of Sum Insured per day; ICU capped at 2% per day. Proportionate deductions apply.",
          explanation: "Major Out-of-Pocket Risk: If room rent exceeds the 1% cap, all associated doctor, surgery, and nursing fees will be proportionately slashed."
        },
        {
          title: "Robotic & Modern Advanced Surgeries",
          type: "Co-Payment Addition",
          importance: "important",
          oldValue: "Advanced procedures covered up to 100% of Sum Insured subject to standard deductible.",
          newValue: "Mandatory 15% employee co-pay applied to robotic surgeries and cyberknife treatments.",
          explanation: "New out-of-pocket obligation: Employees must now pay 15% of the total surgery cost directly."
        },
        {
          title: "Pre-existing Disease (PED) Waiting Period",
          type: "Waiting Period",
          importance: "standard",
          oldValue: "PED waiting period waived from Day 1 for all full-time employees and dependents.",
          newValue: "12-month waiting period applied to new dependents added after the renewal date.",
          explanation: "Dependents enrolled after policy renewal will no longer receive Day 1 pre-existing coverage."
        },
        {
          title: "Maternity & Newborn Initial Hospitalization Limit",
          type: "Benefit Cap",
          importance: "standard",
          oldValue: "Maternity coverage limit: ₹75,000 for normal and cesarean deliveries.",
          newValue: "Maternity coverage limit increased to ₹90,000; newborn Day 1 coverage included.",
          explanation: "Favorable Change: ₹15,000 increase in maternity limit with automatic newborn medical coverage."
        }
      ],
      actions: [
        "Notify employees regarding the 1% room rent cap to prevent proportionate claim deductions.",
        "Highlight the new 15% co-pay on robotic surgeries in the upcoming HR benefits briefing.",
        "Verify all existing dependent enrollments are locked prior to renewal cutoff date."
      ]
    }
  },
  {
    id: "general",
    name: "General & Others",
    icon: "🌐",
    badge: "Universal Any-Document Diff",
    tagline: "Universal comparison for any document type — research papers, technical specs, proposals, manuals, or general texts.",
    demoData: {
      oldName: "AI_Research_Specification_Draft_v1.0.pdf",
      newName: "AI_Research_Specification_Final_v2.0.pdf",
      summary: "Comprehensive multi-domain revisions detected across performance benchmarks, dataset sourcing, and methodology. Authors upgraded the accuracy benchmark from 89.2% to 94.6%, integrated 15,000 empirical open-source records, and added a specialized Groq LPU hardware latency analysis.",
      totalChanges: 4,
      changes: [
        {
          title: "Architecture & Benchmark Accuracy Evaluation",
          type: "Metric Improvement",
          importance: "important",
          oldValue: "Baseline Evaluation: 89.2% Top-1 Accuracy across 10,000 validation samples.",
          newValue: "Optimized Evaluation: 94.6% Top-1 Accuracy with 4-bit quantization on expanded 25,000 sample testbed.",
          explanation: "Performance Upgrade: +5.4% accuracy improvement verified with low-bit model quantization."
        },
        {
          title: "Hardware Inference Latency & Compute Benchmarks",
          type: "Hardware Benchmark",
          importance: "important",
          oldValue: "Inference Latency: Unspecified runtime performance on generic cloud clusters.",
          newValue: "Inference Latency: 14.2ms end-to-end latency on Groq LPU vs 86.5ms on legacy GPU architecture.",
          explanation: "Hardware Acceleration: Demonstrates a 6.1x speedup when executing inference on specialized LPUs."
        },
        {
          title: "Dataset Distribution & Sourcing Methodology",
          type: "Methodology Shift",
          importance: "standard",
          oldValue: "Trained exclusively on synthetic benchmark datasets.",
          newValue: "Trained on combined synthetic data and 15,000 peer-reviewed open-source research records.",
          explanation: "Empirical Rigor: Replaces purely synthetic training with verified real-world training records."
        },
        {
          title: "Reproducibility Appendix & Open Weights Checkpoint",
          type: "Open Science Statement",
          importance: "standard",
          oldValue: "(Section omitted in initial working draft)",
          newValue: "Added comprehensive reproducibility appendix with public GitHub checkpoint link and seed parameters.",
          explanation: "Full Open Verification: Model weights and evaluation seed scripts are now publicly accessible."
        }
      ],
      actions: [
        "Cross-verify the 94.6% benchmark metric against the reproducibility appendix.",
        "Inspect Section 4.3 for the updated Groq LPU latency comparison table.",
        "Confirm citation formatting and repository links before final distribution."
      ]
    }
  }
];

// Suggested prompt pill questions tailored per domain mode
const SUGGESTED_PROMPTS = {
  academic: [
    "What is the most critical cutoff rank change?",
    "Did sanctioned seats or intake capacity change?",
    "Were any new caution deposits or fees added?",
    "Draft an email alert for counseling candidates"
  ],
  legal: [
    "What are the critical contractual risks?",
    "Did liability caps or indemnities change?",
    "Were notice or payment cycles altered?",
    "Draft a contract change memo for leadership"
  ],
  finance: [
    "What unapproved fees or surcharges were added?",
    "How much did user license rates increase?",
    "Did payment terms or exchange clauses change?",
    "Draft a formal dispute email for billing"
  ],
  policy: [
    "What hospital room rent sub-limits were added?",
    "Is there a co-payment on robotic surgeries?",
    "Did pre-existing disease waiting periods change?",
    "Draft an HR employee benefits notice"
  ],
  general: [
    "What are the most critical differences?",
    "Summarize performance & benchmark shifts",
    "What immediate action steps should be taken?",
    "Draft an executive summary email for collaborators"
  ]
};

// Initial Onboarding suggestions when no diff is loaded yet
const ONBOARDING_PROMPTS = [
  "⚡ Run Instant Live Demo",
  "🔍 How does ChangeWatch work?",
  "📄 What file formats can I compare?",
  "🎓 Explain Domain Modes",
  "👨‍💻 Who built ChangeWatch?"
];

// Inline Markdown Parser for bold and code
function parseMarkdownLine(str) {
  if (!str) return [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = str.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="chat-inline-code">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// Formatted Chat Bubble Component
function FormattedChatText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="chat-formatted-body">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="chat-spacer" />;
        }

        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const content = isBullet ? trimmed.replace(/^(•|-|\*)\s*/, "") : line;
        const parts = parseMarkdownLine(content);

        if (isBullet) {
          return (
            <div key={idx} className="chat-bullet-row">
              <span className="chat-bullet-dot">›</span>
              <span className="chat-bullet-text">{parts}</span>
            </div>
          );
        }

        if (trimmed.startsWith("###") || trimmed.startsWith("==")) {
          return (
            <div key={idx} className="chat-subhead">
              {trimmed.replace(/^#+\s*/, "").replace(/^=+\s*/, "")}
            </div>
          );
        }

        return (
          <p key={idx} className="chat-text-line">
            {parts}
          </p>
        );
      })}
    </div>
  );
}

// Human-Friendly, ChatGPT-Style Conversational Engine (Guarantees thoughtful answers even during server spin-up)
function generateLocalAiDiffResponse(rawQuery, auditResult, mode) {
  const query = (rawQuery || "").toLowerCase();

  // 1. Casual greetings & conversational openers
  if (query.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|what can you do)/i)) {
    if (auditResult) {
      return `Hey there! 😊 I'm right here. I've already audited your **${mode?.name || "active"}** documents and flagged all the key revisions.\n\n` +
        `Feel free to ask me anything about the changes — like whether any fees went up, what the biggest risk is, or ask me to draft a quick email update for your team!`;
    }
    return `Hey there! 😊 I'm **ChangeWatch AI**, your document audit assistant. Think of me like ChatGPT, but built specifically to inspect document revisions line-by-line so you never get caught off guard by sneaky changes, price hikes, or altered clauses.\n\n` +
      `You can ask me how ChangeWatch works, which files you can upload, or click **'⚡ Run Instant Live Demo'** to see a full comparison in action right now!`;
  }

  // 2. If no document comparison has been run yet, act as a helpful conversational guide
  if (!auditResult) {
    if (query.includes("demo") || query.includes("test") || query.includes("sample") || query.includes("run") || query.includes("try")) {
      return `Sure thing! I just loaded the **Academic & Cutoffs demo** onto your workbench.\n\n` +
        `If you look at the results below, you'll see we caught **4 major changes**, including:\n` +
        `• A **+440 rank relaxation** for Computer Science (great news for waitlisted students!)\n` +
        `• Intake for AI & Data Science **doubled from 60 to 120 seats**\n` +
        `• A new **₹6,500 refundable lab deposit** added to tuition fees\n\n` +
        `Take a look, and feel free to ask me any questions about what these changes mean!`;
    }
    if (query.includes("how") || query.includes("work") || query.includes("use") || query.includes("guide") || query.includes("step")) {
      return `It's actually super simple! Think of ChangeWatch as your automated second pair of eyes:\n\n` +
        `1. **Choose your domain mode** (like Academic cutoffs, Legal contracts, or Invoices) so our AI knows what matters most to you.\n` +
        `2. **Drop in your two document files** — we support PDFs, Word docs, Excel spreadsheets, plain text, and even scanned photos/printed certificates thanks to built-in OCR.\n` +
        `3. **Review your audit**: In just seconds, our Groq-powered AI highlights every changed number, revised clause, and deadline side-by-side, and gives you a verified PDF report.\n\n` +
        `Would you like to try a live sample right now? Just click **'⚡ Run Instant Live Demo'**!`;
    }
    if (query.includes("file") || query.includes("format") || query.includes("type") || query.includes("pdf") || query.includes("word") || query.includes("excel") || query.includes("image") || query.includes("ocr")) {
      return `You can upload pretty much any standard document format without doing any manual conversion:\n\n` +
        `• **PDF Documents** (\`.pdf\`) — Scanned or text-based\n` +
        `• **Word Documents** (\`.docx\`) — Service agreements, memos, and drafts\n` +
        `• **Excel Spreadsheets & CSV** (\`.xlsx\`, \`.csv\`) — Financial sheets and tabular data\n` +
        `• **Photos & Scanned Images** (\`.png\`, \`.jpg\`, \`.jpeg\`, \`.webp\`) — Read cleanly via our optical character recognition (OCR) engine\n` +
        `• **Plain Text** (\`.txt\`, \`.md\`, \`.json\`)\n\n` +
        `Just drop any two files into the workbench above and click Compare!`;
    }
    if (query.includes("mode") || query.includes("academic") || query.includes("legal") || query.includes("invoice") || query.includes("policy") || query.includes("general") || query.includes("other")) {
      return `Domain modes allow our AI to tune its focus depending on what you're reviewing:\n\n` +
        `• 🎓 **Academic & Cutoffs**: Focuses on rank shifts, seat quota expansions, fee additions, and counseling schedules.\n` +
        `• ⚖️ **Legal & Contracts**: Zeroes in on liability caps, indemnities, and altered termination clauses.\n` +
        `• 💰 **Invoices & Quotations**: Spots unapproved surcharges, unit rate hikes, and tighter payment cycles.\n` +
        `• 🛡️ **Policies & Insurance**: Surfaces room rent capping, co-payments on modern surgeries, and waiting periods.\n` +
        `• 🌐 **General & Others**: A universal lens for research papers, technical specs, proposals, or general prose.`;
    }
    if (query.includes("founder") || query.includes("creator") || query.includes("who built") || query.includes("author") || query.includes("shree") || query.includes("navaneeth")) {
      return `ChangeWatch was designed, architected, and built from scratch by **Shree Navaneeth** (Shree Navaneetha V R), a 1st Year B.E. student in Computer Science & Engineering!\n\n` +
        `He engineered the entire full-stack system — including multi-modal OCR extraction, glassmorphic UI, and Groq LPU neural reasoning pipelines. You can find his verified LinkedIn, GitHub, and email channels in the Founder section below!`;
    }
    return `I'm here to help! 😊 You can ask me how ChangeWatch audits documents, which file types work best, or click **'⚡ Run Instant Live Demo'** to see a full comparison in action right now!`;
  }

  const changes = auditResult.changes || [];
  const actions = auditResult.actions || [];
  const modeName = mode?.name || "General";

  // 3. High-Risk / Critical Inquiries
  if (
    query.includes("risk") ||
    query.includes("critical") ||
    query.includes("important") ||
    query.includes("danger") ||
    query.includes("priority") ||
    query.includes("highest") ||
    query.includes("severe") ||
    query.includes("worst")
  ) {
    const importantChanges = changes.filter((c) => c.importance === "important");
    if (importantChanges.length === 0) {
      return `Good news! None of the detected changes in this **${modeName}** audit were flagged as critical risks. All ${changes.length} adjustments appear to be standard operational or editorial updates.`;
    }
    return `I reviewed the audit carefully, and here are the **${importantChanges.length} critical items** you'll want to pay closest attention to:\n\n` +
      importantChanges.map((c, i) => (
        `**${i + 1}. ${c.title}**\n` +
        `• **What changed**: Moved from *"${c.oldValue || "—"}"* to *"${c.newValue || "—"}"*\n` +
        `• **Why it matters**: ${c.explanation || "Directly impacts the terms of this document."}`
      )).join("\n\n") +
      `\n\n💡 **My advice**: Before approving or signing off on this revision, make sure these ${importantChanges.length} points are reconciled or agreed upon.`;
  }

  // 4. Draft an Email or Message
  if (
    query.includes("email") ||
    query.includes("draft") ||
    query.includes("mail") ||
    query.includes("letter") ||
    query.includes("memo") ||
    query.includes("team") ||
    query.includes("slack") ||
    query.includes("message")
  ) {
    const topBullets = changes.slice(0, 3).map((c) => `• ${c.title}: Updated to "${c.newValue}"`).join("\n");
    const topAction = actions[0] || "Review the full redline certificate on ChangeWatch.";
    return `Here's a clean, professional email draft you can send straight to your team or client:\n\n` +
      `---\n\n` +
      `**Subject:** Quick Update: Key Revisions Detected in ${modeName} Document\n\n` +
      `Hi Team,\n\n` +
      `I ran our two document versions through ChangeWatch to see what changed, and we detected **${auditResult.totalChanges || changes.length} notable updates**.\n\n` +
      `**Summary:**\n${auditResult.summary}\n\n` +
      `**Key Highlights:**\n${topBullets}\n\n` +
      `**Recommended Next Step:**\n• ${topAction}\n\n` +
      `Let me know if you'd like me to send over the official verified PDF audit report.\n\n` +
      `Best,\n` +
      `---\n\n` +
      `Feel free to tweak any details before sending!`;
  }

  // 5. Financial, Fees, Surcharges, Costs, Rates
  if (
    query.includes("fee") ||
    query.includes("cost") ||
    query.includes("money") ||
    query.includes("price") ||
    query.includes("rate") ||
    query.includes("charge") ||
    query.includes("surcharge") ||
    query.includes("tuition") ||
    query.includes("deposit") ||
    query.includes("billing") ||
    query.includes("payment") ||
    query.includes("$") ||
    query.includes("₹")
  ) {
    const feeChanges = changes.filter((c) =>
      (c.title + " " + (c.explanation || "") + " " + (c.oldValue || "") + " " + (c.newValue || "")).match(/(\$|₹|fee|cost|rate|surcharge|deposit|tuition|bill|payment|price|dollar|rupee)/i)
    );

    if (feeChanges.length > 0) {
      return `Let's look at the numbers! Here are the financial adjustments spotted in this revision:\n\n` +
        feeChanges.map((c, i) => (
          `**${i + 1}. ${c.title}**\n` +
          `• **Previously**: ${c.oldValue || "—"}\n` +
          `• **Revised**: ${c.newValue || "—"}\n` +
          `• **Impact**: ${c.explanation || "Adjusted pricing structure."}`
        )).join("\n\n") +
        `\n\nMake sure your accounting or finance team verifies these new line items!`;
    }
    return `I checked all line items, and there don't appear to be any direct fee, surcharge, or pricing changes in this revision!`;
  }

  // 6. Deadlines, Dates, Schedules
  if (
    query.includes("deadline") ||
    query.includes("date") ||
    query.includes("schedule") ||
    query.includes("time") ||
    query.includes("window") ||
    query.includes("reporting") ||
    query.includes("extension") ||
    query.includes("day")
  ) {
    const dateChanges = changes.filter((c) =>
      (c.title + " " + (c.explanation || "") + " " + (c.oldValue || "") + " " + (c.newValue || "")).match(/(deadline|date|schedule|reporting|window|extension|day|hour|period)/i)
    );

    if (dateChanges.length > 0) {
      return `Here are the important dates and timeline adjustments that moved in this version:\n\n` +
        dateChanges.map((c) => (
          `• **${c.title}**\n` +
          `  - **Old date/window**: ${c.oldValue || "—"}\n` +
          `  - **New date/window**: ${c.newValue || "—"}\n` +
          `  - **Details**: ${c.explanation || "Schedule revised."}`
        )).join("\n\n");
    }
    return `No dates or reporting deadlines appear to have shifted in this revision.`;
  }

  // 7. Academic Cutoffs, Ranks, Seats
  if (
    query.includes("cutoff") ||
    query.includes("rank") ||
    query.includes("seat") ||
    query.includes("intake") ||
    query.includes("branch") ||
    query.includes("counseling")
  ) {
    const academicItems = changes.filter((c) =>
      (c.title + " " + (c.explanation || "") + " " + (c.oldValue || "") + " " + (c.newValue || "")).match(/(cutoff|rank|seat|intake|quota|allotment|branch)/i)
    );
    if (academicItems.length > 0) {
      return `Here's what happened with rank cutoffs and seat capacity in this round:\n\n` +
        academicItems.map((c) => (
          `• **${c.title}**\n` +
          `  - **Round 1**: ${c.oldValue || "—"}\n` +
          `  - **Round 2 Revised**: ${c.newValue || "—"}\n` +
          `  - **What it means**: ${c.explanation || "Shift in eligibility metrics."}`
        )).join("\n\n");
    }
  }

  // 8. Next Steps & Recommendations
  if (
    query.includes("action") ||
    query.includes("recommend") ||
    query.includes("todo") ||
    query.includes("step") ||
    query.includes("what should i do") ||
    query.includes("next")
  ) {
    if (actions.length > 0) {
      return `Here are the top practical steps I'd recommend based on this audit:\n\n` +
        actions.map((act, i) => `**Step ${i + 1}**: ${act}`).join("\n\n") +
        `\n\nTip: You can also click **'Download PDF Report'** to save an official vector certificate for your records!`;
    }
    return `Since both versions are identical, there are no action steps required right now!`;
  }

  // 9. General Conversational Fallback (Thoughtful & Natural)
  return `Looking closely at this revision, here is the big picture:\n\n` +
    `**Executive Overview**:\n${auditResult.summary}\n\n` +
    `**Key Adjustments Spotted (${changes.length} total)**:\n` +
    changes.slice(0, 3).map((c) => `• **${c.title}**: ${c.explanation || c.newValue}`).join("\n") +
    (changes.length > 3 ? `\n• *...and ${changes.length - 3} other adjustments detailed in the redline cards above.*` : "") +
    (actions.length > 0 ? `\n\n**Immediate Priority**:\n${actions[0]}` : "") +
    `\n\nLet me know if you want me to zoom in on any specific clause, number, or fee!`;
}

let messageCounter = 0;
function createChatMessage(role, text) {
  messageCounter += 1;
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return {
    id: `${role}-${messageCounter}-${Math.random().toString(36).substring(2, 7)}`,
    role,
    text,
    timestamp: time,
  };
}

// Initial welcome message generator based on active diff
function getInitialChatMessage(auditResult, mode) {
  if (!auditResult) {
    return createChatMessage(
      "assistant",
      "Hey there! 👋 I'm **ChangeWatch AI**, your personal document audit assistant.\n\n" +
        "Think of me like ChatGPT, but built specifically to help you catch every hidden change, price increase, or altered clause between document versions.\n\n" +
        "You can click **'⚡ Run Instant Live Demo'** below to see how it works on real documents, or ask me any question!"
    );
  }
  const count = auditResult.totalChanges || (auditResult.changes ? auditResult.changes.length : 0);
  const criticalCount = (auditResult.changes || []).filter((c) => c.importance === "important").length;
  return createChatMessage(
    "assistant",
    `I've finished reviewing the changes in your **${mode.name}** documents!\n\n` +
      `We spotted **${count} total revisions**, including **${criticalCount} critical items** that have a direct impact.\n\n` +
      `Ask me anything in plain English — like *"What's the biggest risk?"*, *"Did fees change?"*, or *"Draft a quick update email for my team"*!`
  );
}

// Pure Utility Function for Client-Side PDF Generation (decoupled from render)
function executePdfExport(result, oldFile, newFile, currentMode, onDone, onError) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let y = 14;

    // Header Banner (Navy/Dark Slate)
    doc.setFillColor(15, 23, 42); // #0f172a
    doc.rect(0, 0, pageWidth, 38, "F");

    // ChangeWatch Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ChangeWatch AI Audit Certificate", margin, 16);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184); // #94a3b8
    doc.text("Autonomous Document Discrepancy & Risk Detection Engine", margin, 22);
    doc.text(`Verified via Groq LPU Neural Inference • Audit Date: ${new Date().toLocaleDateString()}`, margin, 27);

    // Mode Badge Pill in Header
    doc.setFillColor(37, 99, 235); // #2563eb
    doc.roundedRect(pageWidth - margin - 52, 12, 52, 7.5, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(currentMode.name.toUpperCase(), pageWidth - margin - 26, 17, { align: "center" });

    y = 45;

    // Metadata Overview Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, "FD");

    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Base Document:", margin + 4, y + 6);
    doc.setFont("helvetica", "normal");
    doc.text(oldFile?.name || "Original Revision", margin + 34, y + 6);

    doc.setFont("helvetica", "bold");
    doc.text("Revised Target:", margin + 4, y + 12);
    doc.setFont("helvetica", "normal");
    doc.text(newFile?.name || "Updated Revision", margin + 34, y + 12);

    doc.setFont("helvetica", "bold");
    doc.text("Audit Metrics:", margin + 4, y + 18);
    doc.setTextColor(225, 29, 72);
    doc.text(`${result.totalChanges || (result.changes ? result.changes.length : 0)} Discrepancies Flagged`, margin + 34, y + 18);

    y += 31;

    // Executive Summary
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Executive Audit Summary", margin, y);
    y += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const summaryLines = doc.splitTextToSize(result.summary || "No summary provided.", pageWidth - (margin * 2) - 8);
    const summaryBoxHeight = (summaryLines.length * 4.2) + 6;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), summaryBoxHeight, 2, 2, "FD");
    doc.text(summaryLines, margin + 4, y + 4.5);

    y += summaryBoxHeight + 8;

    // Detailed Discrepancy Breakdown Header
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Detailed Discrepancy Breakdown", margin, y);
    y += 5.5;

    // Render Each Change Card
    (result.changes || []).forEach((c, idx) => {
      const colWidth = (pageWidth - (margin * 2) - 10) / 2;
      const oldLines = doc.splitTextToSize(c.oldValue || "—", colWidth - 8);
      const newLines = doc.splitTextToSize(c.newValue || "—", colWidth - 8);
      const explLines = c.explanation ? doc.splitTextToSize(c.explanation, pageWidth - (margin * 2) - 8) : [];

      const valueHeight = Math.max(oldLines.length, newLines.length) * 4 + 7;
      const explHeight = c.explanation ? (explLines.length * 3.8) + 6 : 0;
      const cardHeight = 9 + valueHeight + explHeight;

      // Auto Page Break Check
      if (y + cardHeight > pageHeight - 20) {
        doc.addPage();
        y = 15;
      }

      // Card Border
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(c.importance === "important" ? 254 : 226, c.importance === "important" ? 205 : 232, c.importance === "important" ? 211 : 240);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), cardHeight, 1.5, 1.5, "FD");

      // Left Color Bar
      doc.setFillColor(c.importance === "important" ? 225 : 59, c.importance === "important" ? 29 : 130, c.importance === "important" ? 72 : 246);
      doc.rect(margin, y, 2.5, cardHeight, "F");

      // Change Title & Priority Badge
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(`#${idx + 1}  ${c.title}`, margin + 5, y + 5.5);

      const isImportant = c.importance === "important";
      doc.setFillColor(isImportant ? 255 : 238, isImportant ? 228 : 242, isImportant ? 230 : 255);
      doc.roundedRect(pageWidth - margin - 26, y + 2, 22, 4.5, 1, 1, "F");
      doc.setTextColor(isImportant ? 225 : 79, isImportant ? 29 : 70, isImportant ? 72 : 229);
      doc.setFontSize(6.5);
      doc.text(isImportant ? "CRITICAL" : "STANDARD", pageWidth - margin - 15, y + 5.2, { align: "center" });

      let currentCardY = y + 8;

      // Previous Version Box (Rose Tint)
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin + 4, currentCardY, colWidth, valueHeight - 2, 1, 1, "F");
      doc.setTextColor(159, 18, 57);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("PREVIOUS VERSION", margin + 6, currentCardY + 3.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(oldLines, margin + 6, currentCardY + 7.5);

      // Revised Version Box (Emerald Tint)
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin + 4 + colWidth + 2, currentCardY, colWidth, valueHeight - 2, 1, 1, "F");
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("REVISED TARGET", margin + 6 + colWidth + 2, currentCardY + 3.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(newLines, margin + 6 + colWidth + 2, currentCardY + 7.5);

      currentCardY += valueHeight;

      // AI Interpretation
      if (c.explanation) {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin + 4, currentCardY, pageWidth - (margin * 2) - 8, explHeight - 1.5, 1, 1, "F");
        doc.setTextColor(79, 70, 229);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text("AI Risk Interpretation:", margin + 6, currentCardY + 3.5);
        doc.setTextColor(51, 65, 85);
        doc.setFont("helvetica", "normal");
        doc.text(explLines, margin + 6, currentCardY + 7.5);
      }

      y += cardHeight + 3.5;
    });

    // Action Items Section
    if (result.actions && result.actions.length > 0) {
      if (y + 35 > pageHeight - 20) {
        doc.addPage();
        y = 15;
      }
      y += 3;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("Recommended Action Checklist", margin, y);
      y += 4.5;

      result.actions.forEach((act) => {
        const actLines = doc.splitTextToSize(`[x]  ${act}`, pageWidth - (margin * 2) - 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(actLines, margin + 2, y + 3.5);
        y += (actLines.length * 3.8) + 2;
      });
    }

    // Page Numbers and Footer Verification Stamp
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `ChangeWatch AI Engine • Architected by Shree Navaneetha V R • Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }

    const fileSuffix = Math.floor(Math.random() * 1000000);
    doc.save(`ChangeWatch_Audit_Report_${fileSuffix}.pdf`);
    if (onDone) onDone();
  } catch (err) {
    console.error("PDF generation error:", err);
    if (onError) onError(err);
  }
}

// Pure Utility Function for Plain Text Export
function executeTextExport(result, oldFile, newFile, currentMode, onDone) {
  const reportContent = `ChangeWatch AI Document Audit Report
======================================================
Audit Domain Mode: ${currentMode.name}
Base Document:     ${oldFile?.name || "Version 1"}
Revised Document:  ${newFile?.name || "Version 2"}
Generated on:      ${new Date().toLocaleString()}
Total Differences: ${result.totalChanges || (result.changes ? result.changes.length : 0)}

EXECUTIVE AUDIT SUMMARY:
${result.summary}

DETAILED DIFFERENCES:
------------------------------------------------------
${(result.changes || [])
  .map(
    (c, i) => `
[Change #${i + 1}] ${c.title}
Priority:   ${c.importance === "important" ? "CRITICAL" : "STANDARD"}
Category:   ${c.type || "General"}
Previous:   ${c.oldValue || "—"}
Revised:    ${c.newValue || "—"}
Analysis:   ${c.explanation || "N/A"}
------------------------------------------------------`
  )
  .join("\n")}

RECOMMENDED ACTION ITEMS:
${(result.actions || []).map((act, i) => `${i + 1}. ${act}`).join("\n")}

======================================================
Generated by ChangeWatch AI Engine • Powered by Groq LPU
Architected by Shree Navaneetha V R
`;

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileSuffix = Math.floor(Math.random() * 1000000);
  link.href = url;
  link.download = `ChangeWatch_Audit_${fileSuffix}.txt`;
  link.click();
  URL.revokeObjectURL(url);
  if (onDone) onDone();
}

// Pure Utility Function for Excel / CSV Spreadsheet Export
function executeCsvExport(result, oldFile, newFile, currentMode, onDone) {
  const sanitize = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [];

  // Metadata Header Block
  lines.push("ChangeWatch AI Document Audit Discrepancy Sheet");
  lines.push(`Audit Mode,${sanitize(currentMode.name)}`);
  lines.push(`Base Document,${sanitize(oldFile?.name || "Version 1")}`);
  lines.push(`Revised Document,${sanitize(newFile?.name || "Version 2")}`);
  lines.push(`Generated On,${sanitize(new Date().toLocaleString())}`);
  lines.push(`Total Discrepancies Flagged,${result.totalChanges || (result.changes ? result.changes.length : 0)}`);
  lines.push(`Executive Summary,${sanitize(result.summary || "")}`);
  lines.push("");

  // Table Headers
  lines.push([
    "Item #",
    "Discrepancy Title / Clause",
    "Priority Level",
    "Category / Type",
    "Previous Version Value",
    "Revised Version Value",
    "Impact Analysis & Explanation"
  ].join(","));

  // Discrepancy Data Rows
  (result.changes || []).forEach((c, idx) => {
    lines.push([
      idx + 1,
      sanitize(c.title || ""),
      sanitize(c.importance === "important" ? "Critical Priority" : "Standard"),
      sanitize(c.type || "General"),
      sanitize(c.oldValue || "—"),
      sanitize(c.newValue || "—"),
      sanitize(c.explanation || "")
    ].join(","));
  });

  // Recommended Action Checklist
  if (result.actions && result.actions.length > 0) {
    lines.push("");
    lines.push("RECOMMENDED ACTION CHECKLIST");
    lines.push("Step #,Action Description");
    result.actions.forEach((act, idx) => {
      lines.push(`${idx + 1},${sanitize(act)}`);
    });
  }

  lines.push("");
  lines.push("Verified by ChangeWatch AI • Powered by Groq LPU • Architected by Shree Navaneetha V R");

  // UTF-8 Byte Order Mark (\uFEFF) ensures Excel opens special characters (₹, →, accents) properly
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileSuffix = Math.floor(Math.random() * 1000000);
  link.href = url;
  link.download = `ChangeWatch_Discrepancies_${fileSuffix}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  if (onDone) onDone();
}

// Pure Utility Function for Word-Level Diff Tokenization
function computeWordDiff(oldStr, newStr) {
  if (!oldStr && !newStr) return { oldTokens: [], newTokens: [] };
  if (!oldStr) return { oldTokens: [], newTokens: [{ text: String(newStr), type: "added" }] };
  if (!newStr) return { oldTokens: [{ text: String(oldStr), type: "removed" }], newTokens: [] };

  const oldWords = String(oldStr).split(/(\s+)/);
  const newWords = String(newStr).split(/(\s+)/);

  let prefixLen = 0;
  while (
    prefixLen < oldWords.length &&
    prefixLen < newWords.length &&
    oldWords[prefixLen] === newWords[prefixLen]
  ) {
    prefixLen++;
  }

  let suffixLen = 0;
  while (
    suffixLen < oldWords.length - prefixLen &&
    suffixLen < newWords.length - prefixLen &&
    oldWords[oldWords.length - 1 - suffixLen] === newWords[newWords.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  const oldTokens = [];
  const newTokens = [];

  // Prefix
  for (let i = 0; i < prefixLen; i++) {
    oldTokens.push({ text: oldWords[i], type: "same" });
    newTokens.push({ text: newWords[i], type: "same" });
  }

  // Middle alterations
  for (let i = prefixLen; i < oldWords.length - suffixLen; i++) {
    oldTokens.push({ text: oldWords[i], type: "removed" });
  }
  for (let i = prefixLen; i < newWords.length - suffixLen; i++) {
    newTokens.push({ text: newWords[i], type: "added" });
  }

  // Suffix
  for (let i = oldWords.length - suffixLen; i < oldWords.length; i++) {
    oldTokens.push({ text: oldWords[i], type: "same" });
  }
  for (let i = newWords.length - suffixLen; i < newWords.length; i++) {
    newTokens.push({ text: newWords[i], type: "same" });
  }

  return { oldTokens, newTokens };
}

// Token Renderer with Highlight Marks
function DiffTokenText({ tokens }) {
  if (!tokens || tokens.length === 0) return <span>—</span>;
  return (
    <span>
      {tokens.map((tok, idx) => {
        if (tok.type === "removed") {
          return (
            <mark key={idx} className="redline-mark-del">
              {tok.text}
            </mark>
          );
        }
        if (tok.type === "added") {
          return (
            <mark key={idx} className="redline-mark-add">
              {tok.text}
            </mark>
          );
        }
        return <span key={idx}>{tok.text}</span>;
      })}
    </span>
  );
}

// Pure Helper to create a serializable history item
function createHistoryAuditItem(auditData, oldFileName, newFileName, mode) {
  return {
    id: "audit_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
    timestamp: new Date().toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    modeId: mode.id,
    modeName: mode.name,
    modeIcon: mode.icon,
    oldFileName: oldFileName || "Version 1",
    newFileName: newFileName || "Version 2",
    summary: auditData.summary || "",
    totalChanges: auditData.totalChanges || (auditData.changes ? auditData.changes.length : 0),
    criticalCount: (auditData.changes || []).filter((c) => c.importance === "important").length,
    result: auditData,
  };
}

export default function App() {
  const [selectedModeId, setSelectedModeId] = useState("academic");
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [isDraggingOld, setIsDraggingOld] = useState(false);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // AI Engine Auto-Warmup & Live Status Probe
  const [engineStatus, setEngineStatus] = useState("checking"); // "checking" | "online" | "warming" | "offline"
  const [engineLatency, setEngineLatency] = useState(null);

  const currentMode = AUDIT_MODES.find((m) => m.id === selectedModeId) || AUDIT_MODES[0];

  // Chat With the Diff & Floating Assistant state (initialized with welcome message)
  const [chatMessages, setChatMessages] = useState(() => [getInitialChatMessage(null, AUDIT_MODES[0])]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  // Recent Audits Local Storage History
  const [auditHistory, setAuditHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("changewatch_audit_history_v1");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load audit history from localStorage", e);
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const saveAuditToHistory = (auditData, oldFileName, newFileName, mode) => {
    if (!auditData) return;
    try {
      const newItem = createHistoryAuditItem(auditData, oldFileName, newFileName, mode);

      setAuditHistory((prev) => {
        const filtered = prev.filter(
          (item) =>
            !(
              item.oldFileName === newItem.oldFileName &&
              item.newFileName === newItem.newFileName &&
              item.modeId === newItem.modeId
            )
        );
        const updated = [newItem, ...filtered].slice(0, 6);
        localStorage.setItem("changewatch_audit_history_v1", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Failed to save audit history", err);
    }
  };

  const restoreAuditFromHistory = (item) => {
    setSelectedModeId(item.modeId);
    const targetMode = AUDIT_MODES.find((m) => m.id === item.modeId) || currentMode;
    setOldFile({
      name: item.oldFileName,
      size: 1400 * 1024,
      isRestored: true,
    });
    setNewFile({
      name: item.newFileName,
      size: 1500 * 1024,
      isRestored: true,
    });
    setResult(item.result);
    setSearchQuery("");
    setSeverityFilter("all");
    setCategoryFilter("all");
    setSortBy("default");
    setChatMessages([getInitialChatMessage(item.result, targetMode)]);
    setIsHistoryOpen(false);
    showToast(`Restored audit: ${item.oldFileName} vs ${item.newFileName}`);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const deleteAuditFromHistory = (id, e) => {
    if (e) e.stopPropagation();
    setAuditHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("changewatch_audit_history_v1", JSON.stringify(updated));
      return updated;
    });
    showToast("Removed audit from history");
  };

  const clearAllHistory = () => {
    setAuditHistory([]);
    localStorage.removeItem("changewatch_audit_history_v1");
    showToast("Cleared all audit history");
  };

  // Discrepancy Search, Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "split" | "unified"

  // Extract unique categories from audit changes
  const uniqueCategories = useMemo(() => {
    if (!result?.changes) return [];
    const set = new Set();
    result.changes.forEach((c) => {
      if (c.type) set.add(c.type);
    });
    return Array.from(set);
  }, [result]);

  // Filter and sort discrepancies
  const filteredChanges = useMemo(() => {
    if (!result?.changes) return [];
    let list = [...result.changes];

    // 1. Severity filter
    if (severityFilter !== "all") {
      list = list.filter((c) => c.importance === severityFilter);
    }

    // 2. Category filter
    if (categoryFilter !== "all") {
      list = list.filter((c) => c.type === categoryFilter);
    }

    // 3. Keyword search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.explanation || "").toLowerCase().includes(q) ||
        (c.oldValue || "").toLowerCase().includes(q) ||
        (c.newValue || "").toLowerCase().includes(q) ||
        (c.type || "").toLowerCase().includes(q)
      );
    }

    // 4. Sorting
    if (sortBy === "critical-first") {
      list.sort((a, b) => {
        if (a.importance === "important" && b.importance !== "important") return -1;
        if (a.importance !== "important" && b.importance === "important") return 1;
        return 0;
      });
    } else if (sortBy === "alphabetical") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return list;
  }, [result, severityFilter, categoryFilter, searchQuery, sortBy]);

  const totalCount = result?.changes?.length || 0;
  const criticalCount = result?.changes?.filter((c) => c.importance === "important").length || 0;
  const standardCount = result?.changes?.filter((c) => c.importance !== "important").length || 0;

  const oldInputRef = useRef(null);
  const newInputRef = useRef(null);
  const resultsRef = useRef(null);
  const chatEndRef = useRef(null);
  const floatChatEndRef = useRef(null);
  const chatSectionRef = useRef(null);

  // Silent AI Engine Backend Auto-Warmup & Status Probe
  useEffect(() => {
    let isMounted = true;
    let pollTimer = null;
    let attemptCount = 0;

    const probeBackend = async () => {
      attemptCount++;
      const startTime = performance.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        let res;
        try {
          res = await fetch(`${API_BASE_URL}/api/health`, {
            method: "GET",
            signal: controller.signal,
          });
        } catch {
          res = await fetch(`${API_BASE_URL}/`, {
            method: "GET",
            signal: controller.signal,
          });
        }

        clearTimeout(timeoutId);

        if (res && res.ok) {
          const latency = Math.round(performance.now() - startTime);
          if (isMounted) {
            setEngineStatus("online");
            setEngineLatency(latency);
          }
          return; // Server is awake and ready
        } else {
          if (isMounted) setEngineStatus("warming");
        }
      } catch {
        if (isMounted) {
          setEngineStatus("warming");
        }
      }

      // Retry every 4 seconds until awake (max 15 attempts = 60s)
      if (isMounted && attemptCount < 15) {
        pollTimer = setTimeout(probeBackend, 4000);
      } else if (isMounted && attemptCount >= 15) {
        setEngineStatus("offline");
      }
    };

    probeBackend();

    return () => {
      isMounted = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!oldFile || !newFile) {
      setError("Please upload both document versions before comparing.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("oldDocument", oldFile);
    formData.append("newDocument", newFile);
    formData.append("auditMode", selectedModeId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to compare documents.");
      }
      setResult(data);
      saveAuditToHistory(data, oldFile.name, newFile.name, currentMode);
      try {
        track("document_audit_completed", {
          mode: selectedModeId,
          changesCount: data.totalChanges || (data.changes ? data.changes.length : 0),
        });
      } catch (err) {
        void err;
      }
      setSearchQuery("");
      setSeverityFilter("all");
      setCategoryFilter("all");
      setSortBy("default");
      setChatMessages([getInitialChatMessage(data, currentMode)]);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message || "An unexpected error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleDemo = (modeToLoad = currentMode) => {
    setError(null);
    setOldFile({
      name: modeToLoad.demoData.oldName,
      size: 1420 * 1024,
      isDemo: true
    });
    setNewFile({
      name: modeToLoad.demoData.newName,
      size: 1540 * 1024,
      isDemo: true
    });
    setResult(modeToLoad.demoData);
    saveAuditToHistory(modeToLoad.demoData, modeToLoad.demoData.oldName, modeToLoad.demoData.newName, modeToLoad);
    try {
      track("sample_demo_loaded", { mode: modeToLoad.id });
    } catch (err) {
      void err;
    }
    setSearchQuery("");
    setSeverityFilter("all");
    setCategoryFilter("all");
    setSortBy("default");
    setChatMessages([getInitialChatMessage(modeToLoad.demoData, modeToLoad)]);
    showToast(`Loaded ${modeToLoad.name} Demo Data`);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleModeChange = (modeId) => {
    setSelectedModeId(modeId);
    const targetMode = AUDIT_MODES.find((m) => m.id === modeId);
    showToast(`Switched to ${targetMode?.name} Mode`);
    if (result && oldFile?.isDemo) {
      // If user is currently looking at demo data, refresh demo data for the new mode!
      if (targetMode) loadSampleDemo(targetMode);
    } else if (result && targetMode) {
      setChatMessages([getInitialChatMessage(result, targetMode)]);
    }
  };

  const copySummaryToClipboard = () => {
    if (!result) return;
    const summaryText = `ChangeWatch AI Document Audit Summary [${currentMode.name} Mode]:\n${result.summary}\n\nTotal Changes: ${result.totalChanges || 0}\n\nKey Action Items:\n${(result.actions || []).map((a, i) => `${i + 1}. ${a}`).join("\n")}`;
    navigator.clipboard.writeText(summaryText);
    showToast("Copied Audit Summary to clipboard!");
  };

  const triggerPdfDownload = () => {
    if (!result) return;
    try {
      track("export_pdf_downloaded", { mode: selectedModeId });
    } catch (err) {
      void err;
    }
    executePdfExport(
      result,
      oldFile,
      newFile,
      currentMode,
      () => showToast("Downloaded Official Branded PDF Audit Report!"),
      () => {
        showToast("Error generating PDF. Exporting text report instead.");
        executeTextExport(result, oldFile, newFile, currentMode, () => showToast("Downloaded text audit report!"));
      }
    );
  };

  const triggerTextDownload = () => {
    if (!result) return;
    try {
      track("export_text_downloaded", { mode: selectedModeId });
    } catch (err) {
      void err;
    }
    executeTextExport(result, oldFile, newFile, currentMode, () => showToast("Downloaded text audit report!"));
  };

  const triggerCsvDownload = () => {
    if (!result) return;
    try {
      track("export_csv_downloaded", { mode: selectedModeId });
    } catch (err) {
      void err;
    }
    executeCsvExport(result, oldFile, newFile, currentMode, () =>
      showToast("Downloaded Excel / CSV Discrepancy Sheet!")
    );
  };

  const resetAll = () => {
    setOldFile(null);
    setNewFile(null);
    setResult(null);
    setSearchQuery("");
    setSeverityFilter("all");
    setCategoryFilter("all");
    setSortBy("default");
    setError(null);
    setChatMessages([]);
    setChatInput("");
    if (oldInputRef.current) oldInputRef.current.value = "";
    if (newInputRef.current) newInputRef.current.value = "";
  };

  const handleClearChat = () => {
    setChatMessages([getInitialChatMessage(result, currentMode)]);
    showToast("Reset chat conversation");
  };

  const handleSendChatMessage = async (userPromptText) => {
    const query = (userPromptText || chatInput).trim();
    if (!query || chatLoading) return;

    // Trigger demo if requested via chat
    if (query.includes("Run Instant Live Demo") || (!result && (query.toLowerCase().includes("demo") || query.toLowerCase().includes("sample")))) {
      loadSampleDemo(currentMode);
    }

    const userMsg = createChatMessage("user", query);
    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      track("ai_assistant_chat_sent", { hasAuditResult: !!result });
    } catch (err) {
      void err;
    }

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      floatChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    const diffContext = result
      ? {
          mode: currentMode.name,
          oldFileName: oldFile?.name || "Original Revision",
          newFileName: newFile?.name || "Updated Revision",
          summary: result.summary,
          totalChanges: result.totalChanges || (result.changes ? result.changes.length : 0),
          changes: result.changes || [],
          actions: result.actions || [],
        }
      : null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          diffContext,
          history: nextHistory.slice(-5),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (!data.reply) {
        throw new Error("Empty reply from server");
      }

      const aiMsg = createChatMessage("assistant", data.reply);
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (chatErr) {
      console.warn("Backend chat query fallback to grounded local AI engine:", chatErr);
      const fallbackReply = generateLocalAiDiffResponse(query, result, currentMode);
      const fallbackMsg = createChatMessage("assistant", fallbackReply);
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        floatChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="layout">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-pill">
          <CheckIcon />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Atmosphere Glows */}
      <div className="radial-glow glow-1" />
      <div className="radial-glow glow-2" />

      {/* Navigation */}
      <header className="header">
        <div className="nav-inner">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="brand"
          >
            <div className="brand-badge">CW</div>
            <span className="brand-title">ChangeWatch</span>
            <span className="brand-tag">v2.0</span>
          </a>

          <nav className="nav-links">
            <a href="#workbench">Studio</a>
            <a href="#how-it-works">How It Works</a>
            {result && <a href="#chat-diff" className="nav-chat-link">💬 Chat Diff</a>}
            <a href="#architecture">Architecture</a>
            <a href="#security">Security</a>
            <a href="#faq">FAQ</a>
            <a href="#founder">Founder</a>
          </nav>

          <div className="nav-actions">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="btn-history-pill"
              type="button"
              title="View Recent Document Audits"
            >
              <HistoryIcon />
              <span>History</span>
              {auditHistory.length > 0 && <span className="history-count-badge">{auditHistory.length}</span>}
            </button>
            <button onClick={() => loadSampleDemo(currentMode)} className="btn-demo-pill" type="button">
              <SparkleIcon />
              <span>Try Demo</span>
            </button>
            <div
              className={`system-status-pill status-${engineStatus}`}
              title={
                engineStatus === "online"
                  ? `Groq Neural LPU is active and ready (Latency: ${engineLatency ? `${engineLatency}ms` : "< 100ms"})`
                  : engineStatus === "warming"
                  ? "Render cloud container is currently waking up from sleep (~20s). Audits will run automatically."
                  : engineStatus === "checking"
                  ? "Probing Groq LPU inference engine availability..."
                  : "AI Engine connection offline. Retrying..."
              }
            >
              <span className={`status-indicator-dot ${engineStatus}`} />
              <span className="status-label">
                {engineStatus === "online" && (
                  <>
                    <span className="status-title">Groq LPU</span>
                    <span className="status-state">Ready</span>
                    {engineLatency && <span className="status-latency">{engineLatency}ms</span>}
                  </>
                )}
                {engineStatus === "warming" && (
                  <>
                    <span className="status-title">AI Engine</span>
                    <span className="status-state warming">Warming up...</span>
                  </>
                )}
                {engineStatus === "checking" && (
                  <>
                    <span className="status-title">AI Engine</span>
                    <span className="status-state checking">Connecting...</span>
                  </>
                )}
                {engineStatus === "offline" && (
                  <>
                    <span className="status-title">AI Engine</span>
                    <span className="status-state offline">Offline</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="content">
        <div className="hero">
          <div className="hero-pill">
            <span className="sparkle">✦</span> Autonomous Document Audit Engine
          </div>
          <h1>Intelligent Document Diff & Change Audit</h1>
          <p>
            Upload any two versions of a document. ChangeWatch uses multi-modal optical extraction and Groq-accelerated
            neural reasoning to pinpoint score adjustments, cutoff shifts, numerical discrepancies, and altered clauses.
          </p>

          <div className="hero-quick-cta">
            <button onClick={() => loadSampleDemo(currentMode)} className="btn-hero-sample">
              <SparkleIcon />
              <span>Instant Live Demo ({currentMode.name})</span>
            </button>
          </div>
        </div>

        {/* 3-Step Guide: How to Use ChangeWatch */}
        <section id="how-it-works" className="steps-onboarding-container">
          <div className="steps-title-row">
            <span className="steps-badge">QUICK START</span>
            <h2>How Everyone Can Use ChangeWatch in 3 Simple Steps</h2>
          </div>
          <div className="steps-three-grid">
            <div className="step-item">
              <div className="step-num">01</div>
              <h4>Upload Base & Revised Files</h4>
              <p>Drag and drop your original document and updated revision. Accepts PDF, Word (.docx), Excel, TXT, or scanned images.</p>
            </div>
            <div className="step-item step-item-active">
              <div className="step-num">02</div>
              <h4>Neural Multi-Modal Extraction</h4>
              <p>Embedded OCR processes printed scans and mark sheets. Groq LPU models parse tables, marks, and clause revisions semantically.</p>
            </div>
            <div className="step-item">
              <div className="step-num">03</div>
              <h4>Audit Summary & Branded PDF</h4>
              <p>Inspect exact previous vs revised values, critical vs standard alerts, and export an official PDF audit report.</p>
            </div>
          </div>
        </section>

        {/* Upload Card / Workbench */}
        <div className="card glass-card" id="workbench">
          {/* Domain Mode Selector */}
          <div className="mode-selector-wrapper">
            <div className="mode-selector-header">
              <span className="mode-selector-label">SELECT AUDIT DOMAIN MODE</span>
              <span className={`mode-badge-pill badge-${selectedModeId}`}>{currentMode.badge}</span>
            </div>

            {/* Top 4 Primary Domain Categories */}
            <div className="mode-pills-grid">
              {AUDIT_MODES.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleModeChange(m.id)}
                  className={`mode-pill-btn mode-${m.id} ${selectedModeId === m.id ? "active" : ""}`}
                >
                  <span className={`mode-icon-circle icon-bg-${m.id}`}>{m.icon}</span>
                  <span className="mode-text">{m.name}</span>
                </button>
              ))}
            </div>

            {/* Dedicated "General & Others" Soft Pill Below */}
            {AUDIT_MODES[4] && (
              <div className="general-mode-wrapper">
                <button
                  type="button"
                  onClick={() => handleModeChange(AUDIT_MODES[4].id)}
                  className={`mode-pill-btn mode-pill-soft-general mode-general ${selectedModeId === AUDIT_MODES[4].id ? "active" : ""}`}
                >
                  <span className="mode-icon-circle icon-bg-general">{AUDIT_MODES[4].icon}</span>
                  <span className="mode-text">{AUDIT_MODES[4].name}</span>
                  <span className="soft-desc-pill">Universal File & Text Diff</span>
                </button>
              </div>
            )}

            <p className="mode-tagline-text">{currentMode.tagline}</p>
          </div>

          <form onSubmit={handleCompare}>
            <div className="upload-grid">
              {/* Document 1 */}
              <div
                className={`dropzone ${oldFile ? "active" : ""} ${isDraggingOld ? "dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOld(true); }}
                onDragLeave={() => setIsDraggingOld(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOld(false);
                  if (e.dataTransfer.files?.[0]) setOldFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !oldFile && oldInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={oldInputRef}
                  accept=".pdf,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && setOldFile(e.target.files[0])}
                />
                {oldFile ? (
                  <div className="file-chip">
                    <div className="file-chip-icon"><FileIcon /></div>
                    <div className="file-chip-meta">
                      <span className="file-chip-name">{oldFile.name}</span>
                      <span className="file-chip-size">
                        {oldFile.size ? `${(oldFile.size / 1024).toFixed(1)} KB` : "Sample File"} • Ready
                      </span>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); setOldFile(null); }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="dropzone-icon"><UploadIcon /></div>
                    <div className="dropzone-label">1. Original Version (Base)</div>
                    <p className="dropzone-sub">Drop PDF, Word, Excel, TXT, or Scanned Image</p>
                  </>
                )}
              </div>

              {/* Arrow */}
              <div className="arrow-divider">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>

              {/* Document 2 */}
              <div
                className={`dropzone ${newFile ? "active" : ""} ${isDraggingNew ? "dragging" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingNew(true); }}
                onDragLeave={() => setIsDraggingNew(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingNew(false);
                  if (e.dataTransfer.files?.[0]) setNewFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !newFile && newInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={newInputRef}
                  accept=".pdf,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                  style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && setNewFile(e.target.files[0])}
                />
                {newFile ? (
                  <div className="file-chip">
                    <div className="file-chip-icon"><FileIcon /></div>
                    <div className="file-chip-meta">
                      <span className="file-chip-name">{newFile.name}</span>
                      <span className="file-chip-size">
                        {newFile.size ? `${(newFile.size / 1024).toFixed(1)} KB` : "Sample File"} • Ready
                      </span>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); setOldFile(null); }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="dropzone-icon"><UploadIcon /></div>
                    <div className="dropzone-label">2. Updated Version (Target)</div>
                    <p className="dropzone-sub">Drop PDF, Word, Excel, TXT, or Scanned Image</p>
                  </>
                )}
              </div>
            </div>

            {/* Workbench Security & Privacy Trust Strip */}
            <div className="workbench-trust-strip">
              <span className="trust-item">
                <span className="trust-icon"><ShieldIcon /></span>
                <span>Zero Data Retention</span>
              </span>
              <span className="trust-dot">•</span>
              <span className="trust-item">
                <span className="trust-icon"><LockIcon /></span>
                <span>TLS 1.3 256-bit AES</span>
              </span>
              <span className="trust-dot">•</span>
              <span className="trust-item">
                <span className="trust-icon"><CpuIcon /></span>
                <span>Stateless In-Memory Only</span>
              </span>
              <span className="trust-dot">•</span>
              <span className="trust-item">
                <span className="trust-icon"><CheckIcon /></span>
                <span>Zero Model Training</span>
              </span>
              <a href="#security" className="trust-specs-link">Security Specs ↗</a>
            </div>

            {/* Action Buttons */}
            <div className="btn-row">
              <button
                type="submit"
                className={`btn-primary btn-primary-${selectedModeId}`}
                disabled={loading || !oldFile || !newFile}
              >
                {loading ? (
                  <>
                    <span className="loader" />
                    Analyzing Document Differences...
                  </>
                ) : (
                  `Compare in ${currentMode.name} Mode`
                )}
              </button>

              <button
                type="button"
                onClick={() => loadSampleDemo(currentMode)}
                className="btn-secondary"
              >
                <SparkleIcon />
                <span>Try {currentMode.name} Demo</span>
              </button>

              {(oldFile || newFile || result) && (
                <button type="button" onClick={resetAll} className="btn-ghost">
                  Reset
                </button>
              )}
            </div>

            {engineStatus === "warming" && !loading && (
              <div className="engine-warmup-banner">
                <span className="warmup-spinner" />
                <span>⚡ AI cloud engine is waking up in the background (~15s). Pick your documents and compare anytime!</span>
              </div>
            )}

            {loading && (
              <div className={`cold-start-note ${engineStatus === "online" ? "note-online" : "note-warming"}`}>
                {engineStatus === "online" ? (
                  <span>⚡ Groq Neural LPU is analyzing documents in {currentMode.name} Mode...</span>
                ) : (
                  <span>⚡ AI cloud engine is waking up from sleep (~15s)... Your comparison is queued and will execute automatically.</span>
                )}
              </div>
            )}
          </form>

          {/* Error Message */}
          {error && (
            <div className="error-box">
              <span className="error-dot" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Display */}
        {result && (
          <>
            <div ref={resultsRef} className="results card">
            <div className="results-top">
              <div>
                <div className={`audit-badge-pill badge-${selectedModeId}`}>
                  AUDIT VERIFIED • {currentMode.name.toUpperCase()}
                </div>
                <h2>Audit Summary</h2>
                <p className="results-summary">{result.summary}</p>
              </div>
              <div className="results-right-col">
                <div className="metric-tag">
                  <span className="metric-val">{result.totalChanges || (result.changes ? result.changes.length : 0)}</span>
                  <span className="metric-title">{result.totalChanges === 1 ? "Change" : "Changes"}</span>
                </div>
                <div className="result-action-btns">
                  <button
                    onClick={() => chatSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="btn-icon-action btn-chat-highlight"
                    title="Chat With This Diff"
                  >
                    <ChatBotIcon />
                    <span>Chat Diff</span>
                  </button>
                  <button onClick={triggerPdfDownload} className="btn-icon-action btn-pdf-highlight" title="Download Official Branded PDF Report">
                    <PdfDocIcon />
                    <span>Download PDF Report</span>
                  </button>
                  <button onClick={triggerCsvDownload} className="btn-icon-action btn-csv-highlight" title="Export Discrepancies to Excel / CSV Spreadsheet">
                    <ExcelIcon />
                    <span>Excel / CSV</span>
                  </button>
                  <button onClick={() => setIsHistoryOpen(true)} className="btn-icon-action btn-history-action" title="View Recent Audit Logs">
                    <HistoryIcon />
                    <span>Audits {auditHistory.length > 0 && `(${auditHistory.length})`}</span>
                  </button>
                  <button onClick={copySummaryToClipboard} className="btn-icon-action" title="Copy summary">
                    <CopyIcon />
                    <span>Copy</span>
                  </button>
                  <button onClick={triggerTextDownload} className="btn-icon-action" title="Download plain text file">
                    <DownloadIcon />
                    <span>Text (.txt)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Discrepancy Search, Severity & Category Filter Bar */}
            {result.changes && result.changes.length > 0 && (
              <div className="diff-filter-toolbar">
                <div className="filter-toolbar-main">
                  {/* Search Input Box */}
                  <div className="diff-search-box">
                    <span className="diff-search-icon"><SearchIcon /></span>
                    <input
                      type="text"
                      className="diff-search-input"
                      placeholder="Search discrepancies by keyword, value, or clause..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="btn-clear-search"
                        onClick={() => setSearchQuery("")}
                        title="Clear search"
                      >
                        <CloseIcon />
                      </button>
                    )}
                  </div>

                  {/* Severity Filter Tabs */}
                  <div className="severity-tabs">
                    <button
                      type="button"
                      className={`severity-tab ${severityFilter === "all" ? "active" : ""}`}
                      onClick={() => setSeverityFilter("all")}
                    >
                      <span>All</span>
                      <span className="tab-count">{totalCount}</span>
                    </button>
                    <button
                      type="button"
                      className={`severity-tab severity-tab-critical ${severityFilter === "important" ? "active" : ""}`}
                      onClick={() => setSeverityFilter("important")}
                    >
                      <span className="tab-dot dot-critical" />
                      <span>Critical Priority</span>
                      <span className="tab-count count-critical">{criticalCount}</span>
                    </button>
                    <button
                      type="button"
                      className={`severity-tab severity-tab-standard ${severityFilter === "standard" ? "active" : ""}`}
                      onClick={() => setSeverityFilter("standard")}
                    >
                      <span className="tab-dot dot-standard" />
                      <span>Standard</span>
                      <span className="tab-count count-standard">{standardCount}</span>
                    </button>
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="sort-control">
                    <label htmlFor="diff-sort-select" className="sort-label">Sort:</label>
                    <select
                      id="diff-sort-select"
                      className="diff-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Document Order</option>
                      <option value="critical-first">Critical Priority First</option>
                      <option value="alphabetical">Title (A → Z)</option>
                    </select>
                  </div>

                  {/* View Mode Segmented Controls */}
                  <div className="view-mode-selector">
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "cards" ? "active" : ""}`}
                      onClick={() => setViewMode("cards")}
                      title="Card Summary View"
                    >
                      <CardsIcon />
                      <span>Cards</span>
                    </button>
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
                      onClick={() => setViewMode("split")}
                      title="Side-by-Side Split Redline View"
                    >
                      <SplitIcon />
                      <span>Split Redline</span>
                    </button>
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "unified" ? "active" : ""}`}
                      onClick={() => setViewMode("unified")}
                      title="Unified Inline Redline View"
                    >
                      <UnifiedIcon />
                      <span>Unified</span>
                    </button>
                  </div>
                </div>

                {/* Secondary Row: Category Filter Chips & Status Indicator */}
                <div className="filter-toolbar-sub">
                  <div className="category-chips-strip">
                    <span className="category-strip-label"><FilterIcon /> Category:</span>
                    <button
                      type="button"
                      className={`category-chip ${categoryFilter === "all" ? "active" : ""}`}
                      onClick={() => setCategoryFilter("all")}
                    >
                      All Types
                    </button>
                    {uniqueCategories.map((cat, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`category-chip ${categoryFilter === cat ? "active" : ""}`}
                        onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Status Indicator / Active Filter Count */}
                  <div className="filter-match-count">
                    <span>
                      Showing <strong>{filteredChanges.length}</strong> of <strong>{totalCount}</strong> changes
                    </span>
                    {(searchQuery || severityFilter !== "all" || categoryFilter !== "all" || sortBy !== "default") && (
                      <button
                        type="button"
                        className="btn-reset-filters"
                        onClick={() => {
                          setSearchQuery("");
                          setSeverityFilter("all");
                          setCategoryFilter("all");
                          setSortBy("default");
                        }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result.changes && result.changes.length > 0 ? (
              filteredChanges.length > 0 ? (
                <>
                  {/* 1. Cards View */}
                  {viewMode === "cards" && (
                    <div className="diff-list">
                      {filteredChanges.map((item, idx) => (
                        <div key={idx} className={`diff-card ${item.importance}`}>
                          <div className="diff-card-head">
                            <span className={`chip type-${(item.type || "modified").toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                              {item.type || "Modified"}
                            </span>
                            <span className={`chip priority-${item.importance || "normal"}`}>
                              {item.importance === "important" ? "Critical Priority" : "Standard"}
                            </span>
                            <span className="diff-title">{item.title}</span>
                          </div>

                          <div className="diff-values">
                            <div className="val-box val-old">
                              <span className="val-tag">Previous Version</span>
                              <div className="val-text">{item.oldValue || "—"}</div>
                            </div>
                            <div className="val-arrow">→</div>
                            <div className="val-box val-new">
                              <span className="val-tag">Revised Version</span>
                              <div className="val-text">{item.newValue || "—"}</div>
                            </div>
                          </div>

                          {item.explanation && (
                            <p className="diff-desc">{item.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 2. Side-by-Side Split Redline View */}
                  {viewMode === "split" && (
                    <div className="split-redline-container">
                      <div className="split-redline-header-row">
                        <div className="split-header-pane split-header-old">
                          <div className="pane-title-badge">
                            <span className="pane-sign-minus">-</span>
                            <span>ORIGINAL (PREVIOUS VERSION)</span>
                          </div>
                          <span className="pane-file-title" title={oldFile?.name}>{oldFile?.name || "Version 1"}</span>
                        </div>

                        <div className="split-header-pane split-header-new">
                          <div className="pane-title-badge">
                            <span className="pane-sign-plus">+</span>
                            <span>REVISED (TARGET VERSION)</span>
                          </div>
                          <span className="pane-file-title" title={newFile?.name}>{newFile?.name || "Version 2"}</span>
                        </div>
                      </div>

                      <div className="split-blocks-stream">
                        {filteredChanges.map((item, idx) => {
                          const { oldTokens, newTokens } = computeWordDiff(item.oldValue, item.newValue);
                          const lineNum = String(idx + 1).padStart(2, "0");
                          return (
                            <div key={idx} className={`split-diff-block ${item.importance}`}>
                              <div className="split-block-top">
                                <div className="split-block-title-row">
                                  <span className="split-line-badge">DIFF #{lineNum}</span>
                                  <span className={`chip priority-${item.importance || "normal"}`}>
                                    {item.importance === "important" ? "Critical Priority" : "Standard"}
                                  </span>
                                  <span className={`chip type-${(item.type || "modified").toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                                    {item.type || "Modified"}
                                  </span>
                                  <h4 className="split-block-title">{item.title}</h4>
                                </div>
                              </div>

                              <div className="split-panes-row">
                                <div className="split-pane split-pane-left">
                                  <div className="split-gutter">
                                    <span className="split-num">L{lineNum}</span>
                                    <span className="split-marker-minus">-</span>
                                  </div>
                                  <div className="split-code-content code-del">
                                    <DiffTokenText tokens={oldTokens} />
                                  </div>
                                </div>

                                <div className="split-pane split-pane-right">
                                  <div className="split-gutter">
                                    <span className="split-num">R{lineNum}</span>
                                    <span className="split-marker-plus">+</span>
                                  </div>
                                  <div className="split-code-content code-add">
                                    <DiffTokenText tokens={newTokens} />
                                  </div>
                                </div>
                              </div>

                              {item.explanation && (
                                <div className="split-block-analysis">
                                  <span className="analysis-tag">Impact Analysis:</span>
                                  <span className="analysis-text">{item.explanation}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. Unified Inline Redline View */}
                  {viewMode === "unified" && (
                    <div className="unified-redline-container">
                      <div className="unified-header-bar">
                        <span>UNIFIED REDLINE STREAM • {filteredChanges.length} DISCREPANCIES</span>
                        <span className="unified-legend">
                          <span className="legend-del">- Deletions</span>
                          <span className="legend-add">+ Additions</span>
                        </span>
                      </div>

                      <div className="unified-blocks-stream">
                        {filteredChanges.map((item, idx) => {
                          const { oldTokens, newTokens } = computeWordDiff(item.oldValue, item.newValue);
                          const lineNum = String(idx + 1).padStart(2, "0");
                          return (
                            <div key={idx} className={`unified-diff-card ${item.importance}`}>
                              <div className="unified-card-head">
                                <span className="unified-line-badge">DIFF #{lineNum}</span>
                                <span className={`chip priority-${item.importance || "normal"}`}>
                                  {item.importance === "important" ? "Critical" : "Standard"}
                                </span>
                                <span className="unified-card-title">{item.title}</span>
                              </div>

                              <div className="unified-code-table">
                                <div className="unified-code-row row-del">
                                  <div className="unified-gutter">
                                    <span className="line-num">{lineNum}</span>
                                    <span className="line-sign">-</span>
                                  </div>
                                  <div className="unified-code-text code-del">
                                    <DiffTokenText tokens={oldTokens} />
                                  </div>
                                </div>

                                <div className="unified-code-row row-add">
                                  <div className="unified-gutter">
                                    <span className="line-num">{lineNum}</span>
                                    <span className="line-sign">+</span>
                                  </div>
                                  <div className="unified-code-text code-add">
                                    <DiffTokenText tokens={newTokens} />
                                  </div>
                                </div>
                              </div>

                              {item.explanation && (
                                <div className="unified-analysis-note">
                                  <strong>Impact Analysis:</strong> {item.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="diff-no-match-box">
                  <div className="no-match-icon">🔍</div>
                  <h4>No matching discrepancies found</h4>
                  <p>
                    {searchQuery ? `No changes matched "${searchQuery}".` : "No discrepancies found for the active filter."}
                  </p>
                  <button
                    type="button"
                    className="btn-secondary btn-clear-filters-action"
                    onClick={() => {
                      setSearchQuery("");
                      setSeverityFilter("all");
                      setCategoryFilter("all");
                      setSortBy("default");
                    }}
                  >
                    Clear Search & Filters
                  </button>
                </div>
              )
            ) : (
              <div className="empty-notice">
                <p>No structural, textual, or numerical differences identified between these documents.</p>
              </div>
            )}

            {result.actions && result.actions.length > 0 && (
              <div className="action-box">
                <h3>Recommended Action Items</h3>
                <div className="action-items">
                  {result.actions.map((act, i) => (
                    <div key={i} className="action-row">
                      <span className="action-check"><CheckIcon /></span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="results-bottom-actions">
              <button
                type="button"
                onClick={() => chatSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="btn-secondary btn-chat-jump"
              >
                <ChatBotIcon />
                <span>Chat With This Diff</span>
              </button>
              <button onClick={triggerPdfDownload} className="btn-primary btn-primary-pdf">
                <PdfDocIcon />
                <span>Download Official Branded PDF Report</span>
              </button>
              <button onClick={triggerCsvDownload} className="btn-primary btn-primary-csv">
                <ExcelIcon />
                <span>Export Excel / CSV Sheet</span>
              </button>
              <button onClick={triggerTextDownload} className="btn-secondary">
                <DownloadIcon />
                <span>Download Plain Text (.txt)</span>
              </button>
              <button onClick={resetAll} className="btn-ghost">
                Compare Another Document
              </button>
            </div>
          </div>

          {/* =========================================================
              CHAT WITH THE DIFF - INTERACTIVE NEURAL ASSISTANT
          ========================================================= */}
          <div ref={chatSectionRef} className="chat-diff-section card glass-card" id="chat-diff">
            <div className="chat-diff-header">
              <div className="chat-header-left">
                <div className="chat-bot-avatar">
                  <ChatBotIcon />
                </div>
                <div>
                  <div className="chat-title-row">
                    <h3>Chat With the Diff</h3>
                    <span className="chat-badge-live">
                      <span className="pulse-dot" />
                      Groq Neural LPU
                    </span>
                  </div>
                  <p className="chat-subtitle">
                    Ask plain-English questions about detected score shifts, altered clauses, fee changes, or deadlines.
                  </p>
                </div>
              </div>

              <div className="chat-header-right">
                <span className={`chat-mode-tag tag-${selectedModeId}`}>{currentMode.name}</span>
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="btn-clear-chat"
                  title="Reset chat conversation"
                >
                  <ClearChatIcon />
                  <span>Reset Chat</span>
                </button>
              </div>
            </div>

            {/* Suggested Prompts Pills */}
            <div className="chat-prompts-wrapper">
              <span className="chat-prompts-label">SUGGESTED QUESTIONS:</span>
              <div className="chat-prompts-scroll">
                {(SUGGESTED_PROMPTS[selectedModeId] || SUGGESTED_PROMPTS.general).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChatMessage(prompt)}
                    className="chat-prompt-pill"
                    disabled={chatLoading}
                  >
                    <span className="prompt-sparkle">✦</span>
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Thread Messages */}
            <div className="chat-messages-container">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.role === "user" ? "chat-row-user" : "chat-row-assistant"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="chat-msg-avatar ai-avatar">
                      <SparkleIcon />
                    </div>
                  )}

                  <div className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                    <div className="chat-bubble-meta">
                      <span className="chat-sender-name">
                        {msg.role === "user" ? "You" : "ChangeWatch Assistant"}
                      </span>
                      <span className="chat-timestamp">{msg.timestamp}</span>
                    </div>
                    <FormattedChatText text={msg.text} />
                  </div>

                  {msg.role === "user" && (
                    <div className="chat-msg-avatar user-avatar">
                      <span>U</span>
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="chat-bubble-row chat-row-assistant">
                  <div className="chat-msg-avatar ai-avatar">
                    <SparkleIcon />
                  </div>
                  <div className="chat-bubble bubble-assistant bubble-loading">
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="typing-text">ChangeWatch is reasoning with Groq LPU...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="chat-input-form"
            >
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask anything about this ${currentMode.name} diff (e.g., 'What is the highest risk?')...`}
                  className="chat-text-input"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className={`btn-send-chat ${chatInput.trim() ? "btn-send-active" : ""}`}
                  title="Send query"
                >
                  <SendChatIcon />
                </button>
              </div>
              <div className="chat-input-footer-hint">
                <span>💡 Grounded in active comparison diff • Fast neural inference powered by Groq LPUs</span>
              </div>
            </form>
          </div>
        </>
      )}

        {/* Brochure Section */}
        <section id="architecture" className="brochure-section">
          <div className="brochure-header">
            <div className="hero-pill">
              <span className="sparkle">✦</span> Architecture & Capabilities
            </div>
            <h2>What is ChangeWatch & How Does It Work?</h2>
            <p>
              ChangeWatch is an autonomous document discrepancy detection engine engineered to eliminate 
              manual line-by-line verification across critical academic scorecards, legal contracts, and financial reports.
            </p>
          </div>

          <div className="brochure-grid">
            {/* Feature 1 */}
            <div className="brochure-card">
              <div className="brochure-icon-wrapper"><ZapIcon /></div>
              <h3>1. Universal Format Extraction</h3>
              <p>
                Eliminates file format boundaries. ChangeWatch accepts <strong>PDFs, Word (.docx), Excel spreadsheets (.xlsx, .csv), plain text</strong>, 
                and image-based scans with zero manual reformatting.
              </p>
              <div className="feature-tags">
                <span>PDF Parsing</span>
                <span>Spreadsheets</span>
                <span>Word Documents</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="brochure-card">
              <div className="brochure-icon-wrapper"><CpuIcon /></div>
              <h3>2. High-Accuracy OCR Engine</h3>
              <p>
                Equipped with optical character recognition to extract data directly from 
                <strong> screenshots, printed certificates, mark sheets, and scanned forms</strong> where plain text extraction fails.
              </p>
              <div className="feature-tags">
                <span>Image OCR</span>
                <span>Scan Detection</span>
                <span>Multi-Resolution</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="brochure-card">
              <div className="brochure-icon-wrapper"><ShieldIcon /></div>
              <h3>3. Neural Difference Audit</h3>
              <p>
                Powered by Groq-accelerated neural inference models that understand semantic context. It isolates score updates, 
                detects altered clauses, calculates net score variance, and outputs prioritized action items.
              </p>
              <div className="feature-tags">
                <span>Groq LPU Speed</span>
                <span>Risk Prioritization</span>
                <span>Smart Summaries</span>
              </div>
            </div>
          </div>

          {/* Use cases Strip */}
          <div className="usecases-strip">
            <div className="usecase-col">
              <span className="usecase-number">01</span>
              <h4>Scorecards & Rank Lists</h4>
              <p>Audit marks, ranks, and cutoff revisions across entrance exam updates.</p>
            </div>
            <div className="usecase-col">
              <span className="usecase-number">02</span>
              <h4>Legal & Service Agreements</h4>
              <p>Spot hidden clause revisions, payment shifts, and altered penalty clauses.</p>
            </div>
            <div className="usecase-col">
              <span className="usecase-number">03</span>
              <h4>Financial Spreadsheets</h4>
              <p>Track balance sheet alterations, formula recalculations, and revised projections.</p>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section id="faq" className="faq-section">
          <div className="brochure-header">
            <div className="hero-pill">
              <span className="sparkle">✦</span> Common Questions
            </div>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about comparing documents with ChangeWatch.</p>
          </div>

          <div className="faq-list">
            {[
              {
                q: "How do Domain Modes work?",
                a: "Domain Modes (Academic, Legal, Invoices, Policies) optimize the AI's semantic lens. For example, Legal Mode prioritizes liability caps and indemnity terms, while Academic Mode detects rank shifts and seat quota revisions."
              },
              {
                q: "How do I download the Official PDF Audit Report?",
                a: "Once your comparison is complete, click 'Download PDF Report'. ChangeWatch generates an official, high-resolution vector PDF certificate containing color-coded redline tables, risk meters, and checklist items."
              },
              {
                q: "What file formats are supported?",
                a: "ChangeWatch supports PDF (.pdf), Microsoft Word (.docx), Excel spreadsheets (.xlsx, .csv), plain text (.txt), and scanned image files (.png, .jpg, .webp) with embedded OCR."
              },
              {
                q: "Why does the first comparison take ~30 seconds?",
                a: "Our neural processing server on Render sleeps after 15 minutes of inactivity to save energy. When a new request arrives, it spins up in about 30 seconds. Subsequent comparisons process at high speed via Groq LPUs."
              },
              {
                q: "Are my uploaded files confidential and safe?",
                a: "Yes. Files are processed in temporary in-memory buffers solely to generate the diff audit, and are deleted immediately after analysis. No documents are permanently stored or shared."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`faq-card ${openFaq === idx ? "open" : ""}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-q-row">
                  <h4>{faq.q}</h4>
                  <span className="faq-arrow">{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && <p className="faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            ENTERPRISE PRIVACY & SECURITY ARCHITECTURE SECTION
        ========================================================= */}
        <section id="security" className="security-section">
          <div className="brochure-header">
            <div className="hero-pill hero-pill-security">
              <span className="sparkle">🛡️</span> Enterprise Privacy Guarantee
            </div>
            <h2>Bank-Grade Privacy & Zero-Retention Architecture</h2>
            <p>
              Your sensitive contracts, financial ledgers, and candidate mark sheets are processed 
              with strict ephemeral isolation. No permanent storage. No LLM training. Zero human in the loop.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="security-pillars-grid">
            {/* Pillar 1 */}
            <div className="security-pillar-card">
              <div className="pillar-icon-box icon-emerald">
                <ShieldIcon />
              </div>
              <div className="pillar-badge badge-emerald">ZERO RETENTION</div>
              <h3>100% Stateless In-Memory Stream</h3>
              <p>
                Files are streamed into volatile RAM buffers solely to run multi-modal OCR and neural reasoning. 
                Documents are never written to physical disks, databases, or cloud object storage, and are immediately purged after diff completion.
              </p>
              <div className="pillar-tags">
                <span>Zero Disk Writes</span>
                <span>Stateless Buffers</span>
                <span>Instant Garbage Purge</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="security-pillar-card">
              <div className="pillar-icon-box icon-blue">
                <LockIcon />
              </div>
              <div className="pillar-badge badge-blue">ENCRYPTED IN TRANSIT</div>
              <h3>End-to-End TLS 1.3 Transport</h3>
              <p>
                All payloads entering or leaving ChangeWatch are encrypted using 256-bit AES cryptographic transport encryption 
                with forward secrecy. Man-in-the-middle tampering, MITM interception, or packet sniffing is cryptographically blocked.
              </p>
              <div className="pillar-tags">
                <span>TLS 1.3 Standard</span>
                <span>256-Bit AES</span>
                <span>Perfect Forward Secrecy</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="security-pillar-card">
              <div className="pillar-icon-box icon-purple">
                <CpuIcon />
              </div>
              <div className="pillar-badge badge-purple">PROPRIETARY SHIELD</div>
              <h3>Zero AI Model Training Guarantee</h3>
              <p>
                Your confidential clauses, pricing tables, formulas, and grades are strictly shielded. 
                Under our Groq LPU enterprise terms, customer inputs are never ingested to train, tune, or evaluate public or private AI models.
              </p>
              <div className="pillar-tags">
                <span>No LLM Ingestion</span>
                <span>Strict NDA Ready</span>
                <span>Isolated Inference</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="security-pillar-card">
              <div className="pillar-icon-box icon-amber">
                <ZapIcon />
              </div>
              <div className="pillar-badge badge-amber">AUDIT PROOF</div>
              <h3>Cryptographic Verification Hashes</h3>
              <p>
                ChangeWatch generates deterministic cryptographic hashes of compared versions. This creates an immutable, tamper-evident 
                audit record stamped on every official PDF certificate without exposing proprietary document contents.
              </p>
              <div className="pillar-tags">
                <span>Tamper-Proof Hashes</span>
                <span>Verifiable Signatures</span>
                <span>Court-Admissible PDF</span>
              </div>
            </div>
          </div>

          {/* Security SLA Metric Bar */}
          <div className="security-sla-strip">
            <div className="sla-metric">
              <span className="sla-val">0 ms</span>
              <span className="sla-label">Persistent Data Retention</span>
            </div>
            <div className="sla-divider" />
            <div className="sla-metric">
              <span className="sla-val">100%</span>
              <span className="sla-label">Stateless Buffer Purge</span>
            </div>
            <div className="sla-divider" />
            <div className="sla-metric">
              <span className="sla-val">0%</span>
              <span className="sla-label">Model Training Ingestion</span>
            </div>
            <div className="sla-divider" />
            <div className="sla-metric">
              <span className="sla-val">256-bit</span>
              <span className="sla-label">Cryptographic Transport</span>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          EXECUTIVE FOUNDER & VERIFIED IDENTITY SECTION
      ========================================================= */}
      <footer id="founder" className="footer-wrapper">
        <div className="executive-card">
          <div className="card-ambient-light" />
          
          <div className="executive-content">
            {/* Left Column: Founder Bio & Verification */}
            <div className="founder-section">
              <div className="status-badge-container">
                <span className="badge-founder">FOUNDER & LEAD DEVELOPER</span>
                <span className="badge-pulse">
                  <span className="pulse-circle"></span>
                  1st Year BE (CSE)
                </span>
              </div>

              <h2 className="executive-name">Shree Navaneetha V R</h2>
              <div className="founder-handle-tag">Known as <strong>Shree Navaneeth</strong></div>

              <p className="executive-degree">
                Bachelor of Engineering (B.E.) in Computer Science & Engineering
              </p>

              <div className="divider-line" />

              <p className="executive-bio">
                Designed, architected, and engineered ChangeWatch from scratch as an independent full-stack AI project. 
                Built the multi-format ingestion pipelines, embedded OCR processing, client-side glassmorphic architecture, 
                and Groq-accelerated neural comparison workflows.
              </p>
            </div>

            {/* Right Column: Direct Channels & Profiles */}
            <div className="channels-section">
              <span className="channels-header">DIRECT CONTACT & PROFILES</span>

              <div className="channel-buttons">
                {/* LinkedIn Profile Button */}
                <a
                  href="https://www.linkedin.com/in/shree-navaneetha-v-r-91aa42417"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-channel channel-linkedin"
                >
                  <div className="btn-channel-icon"><LinkedInIcon /></div>
                  <div className="btn-channel-text">
                    <span className="channel-title">Connect on LinkedIn</span>
                    <span className="channel-sub">shree-navaneetha-v-r-91aa42417</span>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>

                {/* Email Direct Channel Button */}
                <a
                  href="mailto:shreenava2008@gmail.com"
                  className="btn-channel channel-gmail"
                >
                  <div className="btn-channel-icon"><GmailIcon /></div>
                  <div className="btn-channel-text">
                    <span className="channel-title">Send Direct Email</span>
                    <span className="channel-sub">shreenava2008@gmail.com</span>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>

                {/* GitHub Repository Button */}
                <a
                  href="https://github.com/ShreeNava08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-channel channel-github"
                >
                  <div className="btn-channel-icon"><GitHubIcon /></div>
                  <div className="btn-channel-text">
                    <span className="channel-title">GitHub Profile</span>
                    <span className="channel-sub">@ShreeNava08 • Source Code</span>
                  </div>
                  <span className="channel-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="card-footer-strip">
            <span>ChangeWatch Engine • Designed & Developed by Shree Navaneetha V R</span>
            <span>Production Deployment • Powered by Groq LPU & Vercel Edge</span>
          </div>
        </div>
      </footer>

      {/* =========================================================
          FLOATING AI ASSISTANT CHATBOT (POPS OUT ON OPEN)
      ========================================================= */}
      <aside className="floating-assistant-wrapper" aria-label="ChangeWatch AI Assistant">
        {/* Launcher Button & Greeting Speech Bubble */}
        {!isChatOpen && (
          <div className="assistant-launcher-container">
            {showSpeechBubble && (
              <div
                className="assistant-speech-bubble"
                onClick={() => {
                  setIsChatOpen(true);
                  setShowSpeechBubble(false);
                }}
              >
                <span className="bubble-sparkle">✦</span>
                <span className="bubble-text">Need help or want a live demo? Ask ChangeWatch AI!</span>
                <button
                  type="button"
                  className="speech-bubble-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeechBubble(false);
                  }}
                  title="Dismiss greeting"
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            <button
              type="button"
              className="assistant-launcher-btn"
              onClick={() => {
                setIsChatOpen(true);
                setShowSpeechBubble(false);
              }}
              title="Open ChangeWatch AI Assistant"
            >
              <div className="launcher-icon-wrapper">
                <ChatBotIcon />
                <span className="launcher-pulse-dot" />
              </div>
              <span className="launcher-label">AI Assistant</span>
            </button>
          </div>
        )}

        {/* Floating Chat Window */}
        {isChatOpen && (
          <div className="floating-chat-window animate-pop-in">
            {/* Window Header */}
            <div className="float-chat-header">
              <div className="float-header-left">
                <div className="float-bot-avatar">
                  <ChatBotIcon size={19} />
                  <span className="float-online-indicator" />
                </div>
                <div>
                  <div className="float-bot-name-row">
                    <h4>ChangeWatch AI</h4>
                    <span className="float-badge-groq">Groq LPU</span>
                  </div>
                  <span className="float-bot-status">
                    {result ? `Audit: ${currentMode.name}` : "Online • Ready to Guide You"}
                  </span>
                </div>
              </div>

              <div className="float-header-actions">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="btn-float-action"
                  title="Reset conversation"
                >
                  <RefreshIcon />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChatOpen(false);
                    setShowSpeechBubble(true);
                  }}
                  className="btn-float-action"
                  title="Minimize Assistant"
                >
                  <MinimizeIcon />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChatOpen(false);
                    setShowSpeechBubble(false);
                  }}
                  className="btn-float-action btn-float-close"
                  title="Close Assistant"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Pills Horizontal Strip */}
            <div className="float-prompts-bar">
              {((result && SUGGESTED_PROMPTS[selectedModeId]) || ONBOARDING_PROMPTS).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChatMessage(prompt)}
                  className="float-prompt-chip"
                  disabled={chatLoading}
                >
                  <span>{prompt}</span>
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="float-messages-body">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`float-msg-row ${msg.role === "user" ? "float-user-row" : "float-ai-row"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="float-msg-avatar-small ai-small">
                      <ChatBotIcon size={14} />
                    </div>
                  )}

                  <div className={`float-msg-bubble ${msg.role === "user" ? "bubble-user" : "bubble-assistant"}`}>
                    <div className="float-bubble-meta">
                      <span className="float-sender-label">
                        {msg.role === "user" ? "You" : "ChangeWatch AI"}
                      </span>
                      <span className="float-timestamp">{msg.timestamp}</span>
                    </div>
                    <FormattedChatText text={msg.text} />
                  </div>

                  {msg.role === "user" && (
                    <div className="float-msg-avatar-small user-small">
                      <span>U</span>
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="float-msg-row float-ai-row">
                  <div className="float-msg-avatar-small ai-small">
                    <ChatBotIcon size={14} />
                  </div>
                  <div className="float-msg-bubble bubble-assistant bubble-loading">
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="typing-text">Thinking with Groq LPU...</span>
                  </div>
                </div>
              )}

              <div ref={floatChatEndRef} />
            </div>

            {/* Float Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="float-chat-input-form"
            >
              <div className="float-input-bar">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={result ? `Ask about this ${currentMode.name} diff...` : "Ask anything about ChangeWatch..."}
                  className="float-input-field"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className={`btn-float-send ${chatInput.trim() ? "active" : ""}`}
                  title="Send message"
                >
                  <SendChatIcon />
                </button>
              </div>
              <div className="float-input-caption">
                <span>⚡ Groq Neural LPU • Multi-Modal Intelligence</span>
              </div>
            </form>
          </div>
        )}
      </aside>

      {/* =========================================================
          RECENT AUDITS HISTORY DRAWER (SLIDE-OVER PANEL)
      ========================================================= */}
      {isHistoryOpen && (
        <div className="history-modal-overlay" onClick={() => setIsHistoryOpen(false)}>
          <div className="history-drawer animate-slide-left" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="history-drawer-header">
              <div className="history-title-row">
                <div className="history-header-icon">
                  <HistoryIcon />
                </div>
                <div>
                  <h3>Recent Audits</h3>
                  <span className="history-subtitle">Saved locally on your device</span>
                </div>
              </div>

              <div className="history-header-actions">
                {auditHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllHistory}
                    className="btn-history-clear"
                    title="Clear audit history"
                  >
                    <TrashIcon />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="btn-history-close"
                  title="Close History"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* History List Stream */}
            <div className="history-drawer-body">
              {auditHistory.length > 0 ? (
                <div className="history-items-list">
                  {auditHistory.map((item) => (
                    <div
                      key={item.id}
                      className="history-card"
                      onClick={() => restoreAuditFromHistory(item)}
                    >
                      <div className="history-card-top">
                        <div className="history-card-mode">
                          <span className="history-mode-icon">{item.modeIcon || "📄"}</span>
                          <span className={`history-mode-name badge-${item.modeId}`}>{item.modeName}</span>
                        </div>
                        <span className="history-timestamp">{item.timestamp}</span>
                      </div>

                      <div className="history-card-files">
                        <div className="history-file-row">
                          <span className="file-tag-prev">V1</span>
                          <span className="history-file-name" title={item.oldFileName}>{item.oldFileName}</span>
                        </div>
                        <div className="history-file-arrow">↓</div>
                        <div className="history-file-row">
                          <span className="file-tag-next">V2</span>
                          <span className="history-file-name" title={item.newFileName}>{item.newFileName}</span>
                        </div>
                      </div>

                      <p className="history-summary-snippet">
                        {item.summary ? item.summary.slice(0, 115) + (item.summary.length > 115 ? "..." : "") : "Audit discrepancies detected."}
                      </p>

                      <div className="history-card-footer">
                        <div className="history-metrics">
                          <span className="history-metric-chip total-chip">
                            {item.totalChanges} {item.totalChanges === 1 ? "Change" : "Changes"}
                          </span>
                          {item.criticalCount > 0 && (
                            <span className="history-metric-chip critical-chip">
                              {item.criticalCount} Critical
                            </span>
                          )}
                        </div>

                        <div className="history-card-btns">
                          <button
                            type="button"
                            className="btn-delete-history-item"
                            onClick={(e) => deleteAuditFromHistory(item.id, e)}
                            title="Remove from history"
                          >
                            <TrashIcon />
                          </button>
                          <button
                            type="button"
                            className="btn-restore-audit"
                            onClick={() => restoreAuditFromHistory(item)}
                          >
                            <span>Restore</span>
                            <span className="restore-arrow">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="history-empty-state">
                  <div className="history-empty-icon">🕒</div>
                  <h4>No Saved Audits Yet</h4>
                  <p>When you compare documents or run a live demo, your audit history will appear here for fast 1-click restore.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHistoryOpen(false);
                      loadSampleDemo(currentMode);
                    }}
                    className="btn-primary btn-load-demo-history"
                  >
                    <SparkleIcon />
                    <span>Run Instant Demo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="history-drawer-footer">
              <span>ChangeWatch Local Audit Cache • Zero Cloud Storage</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
