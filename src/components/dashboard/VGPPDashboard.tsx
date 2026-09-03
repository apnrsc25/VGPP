"use client"



import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import {
  Sun, Moon, ChevronRight, MapPin, AlertTriangle,
  CheckCircle2, Clock, TrendingUp, Info,
  Users, Building2, Landmark, FileCheck, FileX, RotateCcw,
  LayoutGrid, GitBranch, PieChart as PieIcon, X, ArrowRight,
} from "lucide-react";

import { getAuthSession } from "@/config/auth";

type Tone = "success" | "warning" | "danger" | "info" | "primary" | "accent";
type TabId = "overview" | "pipeline" | "geo" | "trends";
type GeoLevel = "national" | "state" | "district";

interface StateRow { name: string; districts: number; blocks: number; panchayats: number; submitted: number; completion: number; }
interface DistrictRow { name: string; blocks: number; panchayats: number; submitted: number; completion: number; }
interface BlockRow { name: string; panchayats: number; submitted: number; completion: number; }
type GeoRow = StateRow | DistrictRow | BlockRow;
interface GeoPathItem { label: string; level: GeoLevel; data?: StateRow | DistrictRow; }
interface VGPPDashboardProps { proposalId?: string; }
interface BadgeProps { tone?: Tone; children: React.ReactNode; icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>; }
interface KpiCardProps { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number }>; label: string; value: React.ReactNode; sublabel?: string; tone?: "primary" | "accent" | "success" | "info"; }
interface ProgressBarProps { pct: number; tone?: "primary" | "success" | "warning" | "danger" | "accent"; height?: number; }
interface TabButtonProps { active: boolean; onClick: () => void; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; children: React.ReactNode; }
interface SectionHeaderProps { eyebrow?: string; title: string; description?: string; right?: React.ReactNode; }
interface AlertRowProps { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number }>; tone: "warning" | "danger" | "success"; title: string; desc: string; }
interface Segment { label: string; value: number; color: string; }
interface PipelineStageBarProps { title: string; hindi?: string; total: number; segments: Segment[]; note?: string; }
interface OwnWorksRowProps { label: string; hindi: string; value: number; of: number; tone: "accent" | "success"; }

/* ============================== MOCK DATA ==============================
   Illustrative figures only — sized to the stated scale (2.5L Panchayats,
   6,000 Blocks, 700 Districts). Numbers are hand-set so every total
   reconciles across cards, funnels and charts.
========================================================================= */

const NATIONAL = { panchayats: 250000, blocks: 6000, districts: 700 };

// Panchayat-level 5-step funnel (VGPP process)
const STEP_FUNNEL = [
  { id: 1, key: "संपदा", en: "Source Availability", count: 231000 },
  { id: 2, key: "संभावना", en: "Gather Requirements", count: 198500 },
  { id: 3, key: "समीक्षा", en: "Panchayat Familiarization", count: 171200 },
  { id: 4, key: "स्थानांकन", en: "VGPP Planning", count: 138600 },
  { id: 5, key: "संकल्प", en: "Resolution (GSR submitted)", count: 104300 },
];

// Three-tier approval pipeline
const PIPELINE = {
  submitted: 104300,
  block: { approved: 68400, returned: 17900, pending: 18000, ownWorksAdded: 5100 },
  district: { approved: 41250, returned: 9150, pending: 18000, ownWorksAdded: 2300 },
};

const AGING_BUCKETS = [
  { bucket: "0–15 days", count: 14200 },
  { bucket: "16–30 days", count: 9800 },
  { bucket: "31–60 days", count: 7400 },
  { bucket: "60+ days", count: 4600 },
];

const RETURN_REASONS = [
  { reason: "Incomplete geotagging", pct: 32 },
  { reason: "Theme / sub-theme mismatch", pct: 24 },
  { reason: "Duplicate or overlapping asset", pct: 19 },
  { reason: "Beneficiary details incomplete", pct: 14 },
  { reason: "Other", pct: 11 },
];

const THEME_SPLIT = [
  { theme: "Water Security", pct: 34, works: 601800 },
  { theme: "Rural Infrastructure", pct: 27, works: 477900 },
  { theme: "Livelihood Assets", pct: 23, works: 407200 },
  { theme: "Climate Resilience", pct: 16, works: 283500 },
];

const MONTHLY_TREND = [
  { month: "Apr", submitted: 4200, approved: 1100 },
  { month: "May", submitted: 11800, approved: 3900 },
  { month: "Jun", submitted: 22600, approved: 9800 },
  { month: "Jul", submitted: 37500, approved: 17200 },
  { month: "Aug", submitted: 54100, approved: 26400 },
  { month: "Sep", submitted: 68900, approved: 34700 },
  { month: "Oct", submitted: 81200, approved: 41300 },
  { month: "Nov", submitted: 91700, approved: 47600 },
  { month: "Dec", submitted: 98400, approved: 52100 },
  { month: "Jan", submitted: 101600, approved: 55800 },
  { month: "Feb", submitted: 103400, approved: 58900 },
  { month: "Mar", submitted: 104300, approved: 61250 },
];

const STATES = [
  { name: "Uttar Pradesh", districts: 75, blocks: 826, panchayats: 58758, submitted: 21200, completion: 36 },
  { name: "Bihar", districts: 38, blocks: 534, panchayats: 8053, submitted: 3600, completion: 45 },
  { name: "Madhya Pradesh", districts: 55, blocks: 313, panchayats: 23000, submitted: 11900, completion: 52 },
  { name: "Maharashtra", districts: 36, blocks: 355, panchayats: 27900, submitted: 17000, completion: 61 },
  { name: "Rajasthan", districts: 50, blocks: 352, panchayats: 11300, submitted: 6550, completion: 58 },
  { name: "West Bengal", districts: 23, blocks: 341, panchayats: 3317, submitted: 2350, completion: 71 },
  { name: "Karnataka", districts: 31, blocks: 236, panchayats: 6000, submitted: 4560, completion: 76 },
  { name: "Tamil Nadu", districts: 38, blocks: 385, panchayats: 12524, submitted: 10270, completion: 82 },
  { name: "Odisha", districts: 30, blocks: 314, panchayats: 6798, submitted: 3330, completion: 49 },
  { name: "Andhra Pradesh", districts: 26, blocks: 670, panchayats: 12918, submitted: 7100, completion: 55 },
];

// Deterministic pseudo-random generator so drill-down numbers stay stable
function seededSplit(seed: string, total: number, n: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const weights = Array.from({ length: n }, (_, i) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return 0.4 + ((h % 1000) / 1000);
  });
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.max(1, Math.round((w / sum) * total)));
}

function districtsForState(state: StateRow): DistrictRow[] {
  const n = Math.min(6, Math.max(3, Math.round(state.districts / 12)));
  const panchayatSplit = seededSplit(state.name + "-d", state.panchayats, n);
  const blockSplit = seededSplit(state.name + "-b", state.blocks, n);
  const submittedSplit = seededSplit(state.name + "-s", state.submitted, n);
  return Array.from({ length: n }, (_, i) => ({
    name: `${state.name.slice(0, 4)} District ${i + 1}`,
    blocks: blockSplit[i],
    panchayats: panchayatSplit[i],
    submitted: Math.min(submittedSplit[i], panchayatSplit[i]),
    completion: Math.min(97, Math.max(12, Math.round((submittedSplit[i] / panchayatSplit[i]) * 100))),
  }));
}

function blocksForDistrict(district: DistrictRow): BlockRow[] {
  const n = Math.min(5, Math.max(3, Math.round(district.blocks / 3)));
  const panchayatSplit = seededSplit(district.name + "-bp", district.panchayats, n);
  const submittedSplit = seededSplit(district.name + "-bs", district.submitted, n);
  return Array.from({ length: n }, (_, i) => ({
    name: `${district.name.split(" ")[0]} Block ${i + 1}`,
    panchayats: panchayatSplit[i],
    submitted: Math.min(submittedSplit[i], panchayatSplit[i]),
    completion: Math.min(98, Math.max(10, Math.round((submittedSplit[i] / panchayatSplit[i]) * 100))),
  }));
}

/* ============================== DESIGN TOKENS ============================== */

const TOKEN_STYLES = `
  :root {
    --bg: #F1F4F1; --surface: #FFFFFF; --surface-2: #F7F9F7; --border: #DDE3DC;
    --ink: #152420; --ink-muted: #5B6B63; --ink-faint: #8A968F;
    --primary: #0F5D52; --primary-ink: #FFFFFF; --primary-tint: #E4F0EC;
    --accent: #B8791E; --accent-tint: #F5E9D4;
    --success: #3F8B52; --success-tint: #E6F2E8;
    --warning: #C68A1F; --warning-tint: #FBF0DC;
    --danger: #A8422B; --danger-tint: #F7E5DF;
    --info: #3E6E8E; --info-tint: #E5EEF3;
    --shadow: 0 1px 2px rgba(21,36,32,0.06), 0 1px 0 rgba(21,36,32,0.04);
  }
  .dark {
    --bg: #0B1614; --surface: #12201D; --surface-2: #0F1B18; --border: #22352F;
    --ink: #E9F2EE; --ink-muted: #93A79E; --ink-faint: #64766D;
    --primary: #47B39C; --primary-ink: #06110F; --primary-tint: #163932;
    --accent: #E0B24F; --accent-tint: #362912;
    --success: #64C17E; --success-tint: #133224;
    --warning: #E0B24F; --warning-tint: #362912;
    --danger: #E37A5E; --danger-tint: #3A1E17;
    --info: #7BB0CE; --info-tint: #132530;
    --shadow: 0 1px 2px rgba(0,0,0,0.35), 0 1px 0 rgba(0,0,0,0.2);
  }
  .vgpp-root { background: var(--bg); color: var(--ink); }
  .vgpp-card { background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); }
  .vgpp-tick { stroke: var(--border); }
  .vgpp-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
  .vgpp-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

const COLORS = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
};

const PIE_COLORS = ["#0F5D52", "#B8791E", "#3E6E8E", "#A8422B"];

const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);
const fmtLakh = (n: number) => {
  if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `${n}`;
};

/* ============================== SMALL UI PRIMITIVES ============================== */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--ink-faint)" }}>
      {children}
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, right }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>{title}</h2>
        {description && <p className="text-sm mt-1 max-w-2xl" style={{ color: "var(--ink-muted)" }}>{description}</p>}
      </div>
      {right}
    </div>
  );
}

function Badge({ tone = "info", children, icon: Icon }: BadgeProps) {
  const map = {
    success: { bg: "var(--success-tint)", fg: "var(--success)" },
    warning: { bg: "var(--warning-tint)", fg: "var(--warning)" },
    danger: { bg: "var(--danger-tint)", fg: "var(--danger)" },
    info: { bg: "var(--info-tint)", fg: "var(--info)" },
    primary: { bg: "var(--primary-tint)", fg: "var(--primary)" },
  };
  const c = map[tone as keyof typeof map];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, sublabel, tone = "primary" }: KpiCardProps) {
  const c = {
    primary: "var(--primary)", accent: "var(--accent)", success: "var(--success)", info: "var(--info)",
  }[tone];
  const tint = {
    primary: "var(--primary-tint)", accent: "var(--accent-tint)", success: "var(--success-tint)", info: "var(--info-tint)",
  }[tone];
  return (
    <div className="vgpp-card rounded-lg p-4 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--ink-faint)" }}>{label}</div>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: tint }}>
          <Icon size={16} style={{ color: c }} strokeWidth={2.25} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold tabular-nums" style={{ color: "var(--ink)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {value}
        </div>
        {sublabel && <div className="text-xs mt-1" style={{ color: "var(--ink-muted)" }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ pct, tone = "primary", height = 6 }: ProgressBarProps) {
  const c = { primary: "var(--primary)", success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)", accent: "var(--accent)" }[tone];
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: "var(--border)", height }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: c }} />
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
      style={{
        background: active ? "var(--primary-tint)" : "transparent",
        color: active ? "var(--primary)" : "var(--ink-muted)",
      }}
    >
      <Icon size={16} strokeWidth={2.25} />
      {children}
    </button>
  );
}

/* ============================== SIGNATURE VISUAL: SCALE & FLOW FUNNEL ============================== */

function ScaleFlowFunnel() {
  const stages = [
    {
      label: "Panchayat", hindi: "पंचायत", total: NATIONAL.panchayats, pass: PIPELINE.submitted,
      passLabel: "GSR submitted", tone: "primary",
    },
    {
      label: "Block", hindi: "खंड", total: PIPELINE.submitted, pass: PIPELINE.block.approved,
      passLabel: "approved by Block", tone: "accent", added: PIPELINE.block.ownWorksAdded,
    },
    {
      label: "District", hindi: "ज़िला", total: PIPELINE.block.approved, pass: PIPELINE.district.approved,
      passLabel: "approved by District", tone: "success", added: PIPELINE.district.ownWorksAdded,
    },
  ];
  const maxWidth = 100;
  const widths = stages.map((s, i) => maxWidth - i * 18);

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2">
      {stages.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center py-5 px-4 rounded-lg" style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              width: "100%",
            }}>
              <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--ink-faint)" }}>
                {s.label} · {s.hindi}
              </div>
              <div
                className="mt-2 mx-auto rounded-md flex items-center justify-center font-semibold tabular-nums"
                style={{
                  width: `${widths[i]}%`,
                  minWidth: 120,
                  background: { primary: "var(--primary-tint)", accent: "var(--accent-tint)", success: "var(--success-tint)" }[s.tone],
                  color: { primary: "var(--primary)", accent: "var(--accent)", success: "var(--success)" }[s.tone],
                  padding: "14px 8px",
                  fontSize: 22,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {fmtLakh(s.total)}
              </div>
              <div className="text-[11px] mt-1 text-center" style={{ color: "var(--ink-faint)" }}>total in scope</div>

              <div className="w-full mt-4">
                <div className="flex items-baseline justify-between text-xs mb-1">
                  <span style={{ color: "var(--ink-muted)" }}>{s.passLabel}</span>
                  <span className="font-semibold tabular-nums" style={{ color: "var(--ink)" }}>{fmt(s.pass)}</span>
                </div>
                <ProgressBar pct={(s.pass / s.total) * 100} tone={s.tone === "accent" ? "accent" : s.tone} />
                <div className="text-[11px] mt-1" style={{ color: "var(--ink-faint)" }}>
                  {((s.pass / s.total) * 100).toFixed(1)}% pass-through
                </div>
              </div>

              {s.added != null && (
                <div className="mt-3 w-full pt-3" style={{ borderTop: "1px dashed var(--border)" }}>
                  <div className="text-[11px] flex items-center gap-1" style={{ color: "var(--ink-faint)" }}>
                    <ArrowRight size={11} />
                    + {fmt(s.added)} own works added at this tier
                  </div>
                </div>
              )}
            </div>
          </div>
          {i < stages.length - 1 && (
            <div className="hidden md:flex items-center justify-center px-1">
              <ArrowRight size={18} style={{ color: "var(--ink-faint)" }} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================== OVERVIEW TAB ============================== */

function OverviewTab() {
  const totalPending = PIPELINE.block.pending + PIPELINE.district.pending;
  const totalReturned = PIPELINE.block.returned + PIPELINE.district.returned;
  const overallCompletion = ((PIPELINE.district.approved / NATIONAL.panchayats) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Users} label="Panchayats" value={fmt(NATIONAL.panchayats)} sublabel="onboarded nationwide" tone="primary" />
        <KpiCard icon={Building2} label="Blocks" value={fmt(NATIONAL.blocks)} sublabel="reviewing / adding works" tone="accent" />
        <KpiCard icon={Landmark} label="Districts" value={fmt(NATIONAL.districts)} sublabel="final approving authority" tone="info" />
        <KpiCard icon={CheckCircle2} label="Fully Approved" value={`${overallCompletion}%`} sublabel={`${fmt(PIPELINE.district.approved)} plans closed`} tone="success" />
      </div>

      <div className="vgpp-card rounded-lg p-5">
        <SectionHeader
          eyebrow="Governance Hierarchy"
          title="Scale & approval flow"
          description="Every plan originates at Panchayat level and is reviewed upward through Block and District. Each tier can also add its own works using the same five-step process."
        />
        <ScaleFlowFunnel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="vgpp-card rounded-lg p-5 lg:col-span-2">
          <SectionHeader eyebrow="Panchayat Level · पंचदृष्टि" title="Five-step planning progress" />
          <div className="flex flex-col gap-3">
            {STEP_FUNNEL.map((s, i) => {
              const pct = (s.count / NATIONAL.panchayats) * 100;
              const dropFromPrev = i === 0 ? null : (((STEP_FUNNEL[i - 1].count - s.count) / STEP_FUNNEL[i - 1].count) * 100).toFixed(1);
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ background: "var(--primary-tint)", color: "var(--primary)" }}
                  >
                    {s.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between text-sm mb-1">
                      <span className="font-medium truncate" style={{ color: "var(--ink)" }}>
                        {s.en} <span style={{ color: "var(--ink-faint)" }}>· {s.key}</span>
                      </span>
                      <span className="tabular-nums font-semibold ml-2 shrink-0" style={{ color: "var(--ink)" }}>{fmt(s.count)}</span>
                    </div>
                    <ProgressBar pct={pct} tone="primary" />
                  </div>
                  <div className="w-16 text-right text-xs shrink-0" style={{ color: dropFromPrev ? "var(--danger)" : "var(--ink-faint)" }}>
                    {dropFromPrev ? `−${dropFromPrev}%` : `${pct.toFixed(0)}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="vgpp-card rounded-lg p-5 flex flex-col gap-4">
          <SectionHeader eyebrow="Needs Attention" title="Operational alerts" />
          <AlertRow
            icon={Clock}
            tone="warning"
            title={`${fmt(totalPending)} plans awaiting review`}
            desc="Pending across Block and District queues"
          />
          <AlertRow
            icon={RotateCcw}
            tone="danger"
            title={`${fmt(totalReturned)} returned for correction`}
            desc="Sent back to a lower tier for rework"
          />
          <AlertRow
            icon={AlertTriangle}
            tone="danger"
            title={`${fmt(AGING_BUCKETS[3].count)} pending beyond 60 days`}
            desc="Oldest queue items — review first"
          />
          <AlertRow
            icon={TrendingUp}
            tone="success"
            title={`${fmt(MONTHLY_TREND[MONTHLY_TREND.length - 1].submitted - MONTHLY_TREND[MONTHLY_TREND.length - 2].submitted)} new submissions`}
            desc="Added in the last reporting month"
          />
        </div>
      </div>
    </div>
  );
}

function AlertRow({ icon: Icon, tone, title, desc }: AlertRowProps) {
  const c = { warning: "var(--warning)", danger: "var(--danger)", success: "var(--success)" }[tone];
  const bg = { warning: "var(--warning-tint)", danger: "var(--danger-tint)", success: "var(--success-tint)" }[tone];
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={15} style={{ color: c }} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>{title}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--ink-muted)" }}>{desc}</div>
      </div>
    </div>
  );
}

/* ============================== APPROVAL PIPELINE TAB ============================== */

function PipelineStageBar({ title, hindi, total, segments, note }: PipelineStageBarProps) {
  return (
    <div className="vgpp-card rounded-lg p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{title}</div>
          {hindi && <div className="text-xs" style={{ color: "var(--ink-faint)" }}>{hindi}</div>}
        </div>
        <div className="text-xs" style={{ color: "var(--ink-muted)" }}>{fmt(total)} total</div>
      </div>
      <div className="w-full h-4 rounded-full overflow-hidden flex" style={{ background: "var(--border)" }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }} title={`${seg.label}: ${fmt(seg.value)}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span style={{ color: "var(--ink-muted)" }}>{seg.label}</span>
            <span className="font-semibold tabular-nums" style={{ color: "var(--ink)" }}>{fmt(seg.value)}</span>
            <span style={{ color: "var(--ink-faint)" }}>({((seg.value / total) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
      {note && <div className="text-xs mt-3 pt-3 flex items-start gap-1.5" style={{ borderTop: "1px dashed var(--border)", color: "var(--ink-faint)" }}>
        <Info size={12} className="mt-0.5 shrink-0" /> {note}
      </div>}
    </div>
  );
}

function PipelineTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="vgpp-card rounded-lg p-5">
        <SectionHeader
          eyebrow="Three-Tier Workflow"
          title="Panchayat → Block → District"
          description="A plan submitted at Panchayat level must clear review at both Block and District before it is final. Either tier may return a plan for correction, which restarts the cycle at the level below."
        />
        <div className="flex items-center gap-2 flex-wrap text-xs" style={{ color: "var(--ink-muted)" }}>
          <Badge tone="primary" icon={FileCheck}>Submitted</Badge>
          <ArrowRight size={13} style={{ color: "var(--ink-faint)" }} />
          <Badge tone="success" icon={CheckCircle2}>Approved</Badge>
          <span>/</span>
          <Badge tone="danger" icon={FileX}>Returned</Badge>
          <span>/</span>
          <Badge tone="warning" icon={Clock}>Pending</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PipelineStageBar
          title="Panchayat → Block review"
          hindi="ग्राम पंचायत → खंड पंचायत"
          total={PIPELINE.submitted}
          segments={[
            { label: "Approved", value: PIPELINE.block.approved, color: COLORS.success },
            { label: "Pending", value: PIPELINE.block.pending, color: COLORS.warning },
            { label: "Returned", value: PIPELINE.block.returned, color: COLORS.danger },
          ]}
          note="Returned items go back to the originating Panchayat for correction, deletion, or modification."
        />
        <PipelineStageBar
          title="Block → District review"
          hindi="खंड पंचायत → ज़िला पंचायत"
          total={PIPELINE.block.approved}
          segments={[
            { label: "Approved", value: PIPELINE.district.approved, color: COLORS.success },
            { label: "Pending", value: PIPELINE.district.pending, color: COLORS.warning },
            { label: "Returned", value: PIPELINE.district.returned, color: COLORS.danger },
          ]}
          note="Returned items go back to Block, which may forward the correction request to the source Panchayat."
        />
        <div className="vgpp-card rounded-lg p-5 flex flex-col">
          <div className="text-sm font-semibold mb-3" style={{ color: "var(--ink)" }}>Own works added per tier</div>
          <div className="flex-1 flex flex-col justify-center gap-4">
            <OwnWorksRow label="Block-initiated" hindi="खंड द्वारा जोड़े गए" value={PIPELINE.block.ownWorksAdded} of={PIPELINE.block.approved} tone="accent" />
            <OwnWorksRow label="District-initiated" hindi="ज़िला द्वारा जोड़े गए" value={PIPELINE.district.ownWorksAdded} of={PIPELINE.district.approved} tone="success" />
          </div>
          <div className="text-xs mt-4 pt-3 flex items-start gap-1.5" style={{ borderTop: "1px dashed var(--border)", color: "var(--ink-faint)" }}>
            <Info size={12} className="mt-0.5 shrink-0" />
            Block and District run the same five-step process to add their own works, which merge into the plan they approve.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="vgpp-card rounded-lg p-5">
          <SectionHeader eyebrow="Queue Health" title="Pending review — age distribution" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AGING_BUCKETS} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="vgpp-tick" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "var(--ink-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--ink-muted)" }} axisLine={false} tickLine={false} tickFormatter={fmtLakh} />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {AGING_BUCKETS.map((b, i) => (
                  <Cell key={i} fill={i >= 2 ? COLORS.danger : i === 1 ? COLORS.warning : COLORS.info} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="vgpp-card rounded-lg p-5">
          <SectionHeader eyebrow="Root Causes" title="Top reasons for return" />
          <div className="flex flex-col gap-3 mt-1">
            {RETURN_REASONS.map((r) => (
              <div key={r.reason}>
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <span style={{ color: "var(--ink)" }}>{r.reason}</span>
                  <span className="font-semibold tabular-nums" style={{ color: "var(--ink-muted)" }}>{r.pct}%</span>
                </div>
                <ProgressBar pct={r.pct} tone="danger" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnWorksRow({ label, hindi, value, of, tone }: OwnWorksRowProps) {
  const c = { accent: "var(--accent)", success: "var(--success)" }[tone];
  const tint = { accent: "var(--accent-tint)", success: "var(--success-tint)" }[tone];
  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0" style={{ background: tint }}>
        <span className="text-sm font-semibold tabular-nums" style={{ color: c }}>{fmtLakh(value)}</span>
      </div>
      <div>
        <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>{label}</div>
        <div className="text-xs" style={{ color: "var(--ink-faint)" }}>{hindi}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--ink-muted)" }}>{((value / of) * 100).toFixed(1)}% of tier's approved total</div>
      </div>
    </div>
  );
}

/* ============================== GEOGRAPHIC DRILLDOWN TAB ============================== */

function GeoTab() {
  const [path, setPath] = useState<GeoPathItem[]>([{ label: "All India", level: "national" }]);
  const current = path[path.length - 1];

  const rows = useMemo(() => {
    if (current.level === "national") {
      return [...STATES].sort((a, b) => b.completion - a.completion);
    }
    if (current.level === "state") {
      return current.data ? districtsForState(current.data as StateRow) : [];
    }
    if (current.level === "district") {
      return current.data ? blocksForDistrict(current.data as DistrictRow) : [];
    }
    return [];
  }, [current]);

  const columns = current.level === "national"
    ? ["Districts", "Blocks", "Panchayats", "Submitted"]
    : current.level === "state"
      ? ["Blocks", "Panchayats", "Submitted"]
      : ["Panchayats", "Submitted"];

  const drillInto = (row: GeoRow) => {
    if (current.level === "national") setPath([...path, { label: row.name, level: "state", data: row }]);
    else if (current.level === "state") setPath([...path, { label: row.name, level: "district", data: row }]);
  };

  const best = rows[0];
  const worst = rows[rows.length - 1];

  return (
    <div className="flex flex-col gap-6">
      <div className="vgpp-card rounded-lg p-5">
        <SectionHeader
          eyebrow="Drill Down"
          title="Geographic performance"
          description="Follow the hierarchy from national rollup down to individual blocks. Figures below the state level are illustrative estimates for template purposes."
          right={
            <div className="flex items-center gap-1 text-sm flex-wrap justify-end" style={{ color: "var(--ink-muted)" }}>
              {path.map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={14} style={{ color: "var(--ink-faint)" }} />}
                  <button
                    onClick={() => setPath(path.slice(0, i + 1))}
                    className="hover:underline"
                    style={{ color: i === path.length - 1 ? "var(--primary)" : "var(--ink-muted)", fontWeight: i === path.length - 1 ? 600 : 400 }}
                  >
                    {p.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          }
        />

        {rows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg p-4 flex items-center gap-3" style={{ background: "var(--success-tint)" }}>
              <CheckCircle2 size={20} style={{ color: "var(--success)" }} />
              <div>
                <div className="text-xs" style={{ color: "var(--ink-muted)" }}>Best performing</div>
                <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{best?.name} · {best?.completion}%</div>
              </div>
            </div>
            <div className="rounded-lg p-4 flex items-center gap-3" style={{ background: "var(--danger-tint)" }}>
              <AlertTriangle size={20} style={{ color: "var(--danger)" }} />
              <div>
                <div className="text-xs" style={{ color: "var(--ink-muted)" }}>Needs support</div>
                <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{worst?.name} · {worst?.completion}%</div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto vgpp-scrollbar">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="text-left font-semibold py-2 pr-3" style={{ color: "var(--ink-faint)" }}>
                  {current.level === "national" ? "State" : current.level === "state" ? "District" : "Block"}
                </th>
                {columns.map((c) => (
                  <th key={c} className="text-right font-semibold py-2 px-3 whitespace-nowrap" style={{ color: "var(--ink-faint)" }}>{c}</th>
                ))}
                <th className="text-left font-semibold py-2 pl-3" style={{ color: "var(--ink-faint)" }}>Completion</th>
                {current.level !== "district" && <th className="w-8"></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className={current.level !== "district" ? "cursor-pointer" : ""}
                  onClick={() => current.level !== "district" && drillInto(row)}
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="py-2.5 pr-3 font-medium flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
                    <MapPin size={13} style={{ color: "var(--ink-faint)" }} /> {row.name}
                  </td>
                  {current.level === "national" && (
                    <>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.districts)}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.blocks)}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.panchayats)}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.submitted)}</td>
                    </>
                  )}
                  {current.level === "state" && (
                    <>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.blocks)}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.panchayats)}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.submitted)}</td>
                    </>
                  )}
                  {current.level === "district" && (
                    <>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.panchayats)}</td>
                      <td className="text-right py-2.5 px-3 tabular-nums" style={{ color: "var(--ink-muted)" }}>{fmt(row.submitted)}</td>
                    </>
                  )}
                  <td className="py-2.5 pl-3 w-40">
                    <div className="flex items-center gap-2">
                      <ProgressBar pct={row.completion} tone={row.completion >= 65 ? "success" : row.completion >= 40 ? "warning" : "danger"} />
                      <span className="text-xs tabular-nums w-9 text-right" style={{ color: "var(--ink-muted)" }}>{row.completion}%</span>
                    </div>
                  </td>
                  {current.level !== "district" && (
                    <td className="text-right pl-1">
                      <ChevronRight size={16} style={{ color: "var(--ink-faint)" }} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================== THEME & TRENDS TAB ============================== */

function TrendsTab() {
  const [showApproved, setShowApproved] = useState(true);
  const totalWorks = THEME_SPLIT.reduce((a, b) => a + b.works, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="vgpp-card rounded-lg p-5 lg:col-span-2">
          <SectionHeader eyebrow="Portfolio Mix" title="Works by scheme theme" description={`${fmt(totalWorks)} works identified nationally`} />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={THEME_SPLIT} dataKey="pct" nameKey="theme" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {THEME_SPLIT.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip
                formatter={(v: number, _n: string, p: { payload: { works: number; theme: string } }) => [`${v}% · ${fmt(p.payload.works)} works`, p.payload.theme]}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {THEME_SPLIT.map((t, i) => (
              <div key={t.theme} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                <span style={{ color: "var(--ink-muted)" }} className="truncate">{t.theme}</span>
                <span className="font-semibold ml-auto" style={{ color: "var(--ink)" }}>{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="vgpp-card rounded-lg p-5 lg:col-span-3">
          <SectionHeader
            eyebrow="Financial Year Velocity"
            title="Cumulative submissions vs. approvals"
            right={
              <button
                onClick={() => setShowApproved((v) => !v)}
                className="text-xs px-2.5 py-1 rounded-md font-medium"
                style={{ background: "var(--primary-tint)", color: "var(--primary)" }}
              >
                {showApproved ? "Hide" : "Show"} approved line
              </button>
            }
          />
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_TREND} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.success} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.success} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="vgpp-tick" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--ink-muted)" }} axisLine={false} tickLine={false} tickFormatter={fmtLakh} />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="submitted" stroke={COLORS.primary} fill="url(#subGrad)" strokeWidth={2} name="Submitted" />
              {showApproved && <Area type="monotone" dataKey="approved" stroke={COLORS.success} fill="url(#appGrad)" strokeWidth={2} name="Approved" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "pipeline", label: "Approval Pipeline", icon: GitBranch },
  { id: "geo", label: "Geographic Drilldown", icon: MapPin },
  { id: "trends", label: "Theme & Trends", icon: PieIcon },
];

export default function VGPPDashboard({ proposalId = "" }: VGPPDashboardProps) {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [tab, setTab] = useState("overview");
  const [showInfo, setShowInfo] = useState(true);
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");

    const authSession = getAuthSession();

    if (!authSession) {
      router.push(
        proposalId
          ? `/login?proposalId=${encodeURIComponent(proposalId)}`
          : "/login"
      );

      return;
    }

    const role = (authSession as { role?: string }).role;

    if (role === "Planner") {
      if (!proposalId) {
        setError(
          "Proposal ID is missing. Please start planning from the proposal."
        );

        return;
      }

      router.push(
        `/proposal/${proposalId}/availability`
      );

      return;
    }

    if (
      role === "National Admin" ||
      role === "State Admin" ||
      role === "District Admin" ||
      role === "Block Admin" ||
      role === "Approver"
    ) {
      if (!proposalId) {
        setError(
          "Proposal ID is missing. Please start from the proposal."
        );

        return;
      }

      router.push(
        `/location?proposalId=${encodeURIComponent(proposalId)}`
      );

      return;
    }

    setError("Your account does not have a valid role.");
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <style>{TOKEN_STYLES}</style>
      <div className="vgpp-root min-h-screen font-sans" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <div className="flex flex-col lg:flex-row">

          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r p-4 flex lg:flex-col gap-1" style={{ borderColor: "var(--border)" }}>
            <div className="hidden lg:flex flex-col mb-5 px-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm" style={{ background: "var(--primary)", color: "var(--primary-ink)" }}>
                  VG
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>VGPP MIS</div>
                  <div className="text-[11px]" style={{ color: "var(--ink-faint)" }}>पंचदृष्टि · Rollout Monitor</div>
                </div>
              </div>
            </div>
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-1">
              {TABS.map((t) => (
                <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} icon={t.icon}>
                  <span className="whitespace-nowrap">{t.label}</span>
                </TabButton>
              ))}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b flex-wrap" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--ink-muted)" }}>
                <span className="px-2 py-1 rounded-md font-medium" style={{ background: "var(--primary-tint)", color: "var(--primary)" }}>
                  FY 2025–26
                </span>
                <span>Last synced 12 minutes ago</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md" style={{ background: "var(--accent-tint)", color: "var(--accent)" }}>
                  <Info size={13} />
                  Illustrative data for template purposes
                </div>
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="w-8 h-8 rounded-md flex items-center justify-center vgpp-card"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <Moon size={15} style={{ color: "var(--ink-muted)" }} /> : <Sun size={15} style={{ color: "var(--ink-muted)" }} />}
                </button>
              </div> */}
            </div>

            {/* {showInfo && (
              <div className="mx-5 mt-4 rounded-lg px-4 py-3 flex items-start gap-3" style={{ background: "var(--info-tint)" }}>
                <Info size={16} style={{ color: "var(--info)" }} className="mt-0.5 shrink-0" />
                <div className="text-xs flex-1" style={{ color: "var(--ink-muted)" }}>
                  <span className="font-medium" style={{ color: "var(--ink)" }}>Bird's-eye view: </span>
                  this dashboard rolls up all three planning tiers — Panchayat, Block, and District — so a state or ministry-level reviewer can spot bottlenecks without opening individual plans.
                </div>
                <button onClick={() => setShowInfo(false)} aria-label="Dismiss">
                  <X size={14} style={{ color: "var(--ink-faint)" }} />
                </button>
              </div>
            )} */}

            <main className="p-5">
              {tab === "overview" && <OverviewTab />}
              {tab === "pipeline" && <PipelineTab />}
              {tab === "geo" && <GeoTab />}
              {tab === "trends" && <TrendsTab />}

              {error && (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-[#e8caca] bg-[#fff5f3] px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-[#a8422b]">
                      Unable to continue
                    </div>

                    <div className="mt-0.5 text-xs text-[#8b5a50]">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="group inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold shadow-sm transition cursor-pointer hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-ink)",
                  }}
                >
                  Continue to Planning

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
