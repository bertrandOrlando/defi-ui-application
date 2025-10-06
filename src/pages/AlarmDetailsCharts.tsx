import * as React from 'react';
import alarms from '../data/alarm.json';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

import Header from "../component/header";
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";

type Severity = 'Minor' | 'Warning' | 'Critical';
type Status = 'Active' | 'Open' | 'Closed';

type AlarmRec = {
  id: number;
  date: string;
  alarm: string;
  description: string;
  severity: Severity;
  status: Status;
  acknowledged: 0 | 1;
  nodeName: string;
  nodeId: number;
  noteType: string;
};

const COLORS = {
  bg: '#1f1f1f',
  card: '#2f3035',
  divider: 'rgba(0, 0, 0, 0.12)',
  text: '#e5e7eb',
  subtext: 'rgba(255,255,255,0.7)',
  major: '#e68029',  
  critical: '#c4515d',
  warning: '#079487',
  minor: '#edb127',
};

const isOpenStatus = (s: Status) => s === 'Open' || s === 'Active';

function countBySeverity(rows: AlarmRec[]) {
  return rows.reduce(
    (acc, r) => {
      acc[r.severity] = (acc[r.severity] ?? 0) + 1;
      return acc;
    },
    { Minor: 0, Warning: 0, Critical: 0 } as Record<Severity, number>
  );
}
const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0);

const LegendItem: React.FC<{ color: string; label: string; valuePct: number }> = ({ color, label, valuePct }) => (
  <div className="flex flex-col items-center min-w-[62px]">
    <div className="text-xs font-semibold" style={{ color: COLORS.text }}>{valuePct}%</div>
    <div className="inline-flex items-center gap-1 text-xs" style={{ color: COLORS.text }}>
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  </div>
);

const AlarmDetailsCharts: React.FC = () => {
  const rows = alarms as AlarmRec[];

  const openRows = rows.filter((r) => isOpenStatus(r.status));
  const closedRows = rows.filter((r) => r.status === 'Closed');

  const openCounts = countBySeverity(openRows);
  const closedCounts = countBySeverity(closedRows);

  const totalOpen = openRows.length;
  const totalClosed = closedRows.length;
  const total = rows.length;

  const openPie = [
    { id: 0, value: openCounts.Critical, label: 'Critical' },
    { id: 1, value: openCounts.Warning, label: 'Warning' },
    { id: 2, value: openCounts.Minor, label: 'Minor' },
  ];
  const closedPie = [
    { id: 0, value: closedCounts.Critical, label: 'Critical' },
    { id: 1, value: closedCounts.Warning, label: 'Warning' },
    { id: 2, value: closedCounts.Minor, label: 'Minor' },
  ];

  const barCategories = ['Critical', 'Warning', 'Minor'];
  const barDataOpen = [
    openCounts.Critical,
    openCounts.Warning,
    openCounts.Minor,
  ];

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg, color: COLORS.text }}>
      {/* Top bar */}
      <Header />
      {/* NEW: breadcrumb + page title row */}
       <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-1">
          <DynamicBreadcrumb />
          <h1 className="text-2xl font-semibold mt-1">Alarms Details</h1>
        </div>
      </div>
     

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          className="relative rounded-2xl p-6 border"
          style={{ background: COLORS.card, borderColor: COLORS.divider }}
        >
          {/* Total alarms header (top-left inside card) */}
          <div className="mb-4">
            <div className="text-3xl font-extrabold leading-tight">{total}</div>
            <div className="text-sm" style={{ color: COLORS.subtext }}>Total alarms</div>
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 1) Open Alarms Severity (%) — pie */}
            <div
              className="rounded-xl p-4 border md:col-span-3"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}
            >
              <div className="font-semibold mb-2">Open Alarms Severity (%)</div>
              <div className="flex justify-center">
                <PieChart
                  width={260}
                  height={210}
                  series={[{ data: openPie, innerRadius: 0, outerRadius: 80 }]}
                  colors={[COLORS.critical, COLORS.warning, COLORS.minor]}
                  sx={{
                    '& .MuiChartsLegend-root': { display: 'none' },
                    '& text': { fill: COLORS.text },
                  }}
                />
              </div>

              {/* custom legend with percentages */}
              <div className="mt-2 flex items-start justify-between text-xs">
                <LegendItem color={COLORS.critical} label="Critical" valuePct={pct(openCounts.Critical, totalOpen)} />
                <LegendItem color={COLORS.warning} label="Warning" valuePct={pct(openCounts.Warning, totalOpen)} />
                <LegendItem color={COLORS.minor} label="Minor" valuePct={pct(openCounts.Minor, totalOpen)} />
              </div>
            </div>

            {/* 2) Closed Alarms Severity (%) — donut */}
            <div
              className="rounded-xl p-4 border md:col-span-3"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}
            >
              <div className="font-semibold mb-2">Closed Alarms Severity (%)</div>
              <div className="flex justify-center">
                <PieChart
                  width={260}
                  height={210}
                  series={[{ data: closedPie, innerRadius: 50, outerRadius: 80, paddingAngle: 2 }]}
                  colors={[COLORS.critical, COLORS.warning, COLORS.minor]}
                  sx={{
                    '& .MuiChartsLegend-root': { display: 'none' },
                    '& text': { fill: COLORS.text },
                  }}
                />
              </div>
              <div className="mt-2 flex items-start justify-between text-xs">
                <LegendItem color={COLORS.critical} label="Critical" valuePct={pct(closedCounts.Critical, totalClosed)} />
                <LegendItem color={COLORS.warning} label="Warning" valuePct={pct(closedCounts.Warning, totalClosed)} />
                <LegendItem color={COLORS.minor} label="Minor" valuePct={pct(closedCounts.Minor, totalClosed)} />
              </div>
            </div>

            {/* 3) Open Alarms Severity (Quantity) — bar */}
            <div
              className="rounded-xl p-4 border md:col-span-6 flex flex-col items-center justify-center"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}
            >
              <div className="font-semibold mb-2 text-center">Open Alarms Severity (Quantity)</div>
              <BarChart
                width={520}
                height={230}
                xAxis={[
                  {
                    scaleType: 'band',
                    data: ['Critical', 'Warning', 'Minor'],
                    tickLabelStyle: { fill: COLORS.text }, 
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: { fill: COLORS.text }, 
                    tickMinStep: 2,                       
                  },
                ]}
                grid={{ vertical: false, horizontal: true }}
                series={[
                  { data: [barDataOpen[0], 0, 0], label: 'Critical', color: COLORS.critical },
                  { data: [0, barDataOpen[1], 0], label: 'Warning',  color: COLORS.warning  },
                  { data: [0, 0, barDataOpen[2]], label: 'Minor',    color: COLORS.minor    },
                ]}
                margin={{ left: 40, right: 10, top: 10, bottom: 30 }}
                sx={{
                  // remove legend
                  '& .MuiChartsLegend-root': { display: 'none' },
                  '& .MuiChartsAxis-left .MuiChartsAxis-line': { stroke: 'transparent' },
                  '& .MuiChartsAxis-bottom .MuiChartsAxis-line': { stroke: '#fff' },
                  '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.25)' },
                  '& .MuiBarElement-root': {rx: 8, ry: 8,},
                }}
              />
            </div>

            {/* 4) Closed Alarms Severity (Quantity)- otw*/}
            <div
              className="rounded-xl p-4 border md:col-span-3"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}
            >
              <div className="font-semibold mb-2">Closed Alarms Severity (Quantity)</div>
              <div className="h-[210px] flex items-center justify-center" style={{ color: COLORS.subtext }}>
                (Coming soon)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailsCharts;