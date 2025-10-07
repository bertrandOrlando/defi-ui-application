import * as React from 'react';
import alarms from '../data/alarm.json';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

import Header from "../component/header";
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";

type Severity = 'Minor' | 'Warning' | 'Critical' | 'Major';
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
    { Minor: 0, Warning: 0, Critical: 0, Major: 0 } as Record<Severity, number>
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
    { id: 1, value: openCounts.Major, label: 'Major' },
    { id: 2, value: openCounts.Warning, label: 'Warning' },
    { id: 3, value: openCounts.Minor, label: 'Minor' },
  ];

  const closedPie = [
    { id: 0, value: closedCounts.Critical, label: 'Critical' },
    { id: 1, value: closedCounts.Major, label: 'Major' },
    { id: 2, value: closedCounts.Warning, label: 'Warning' },
    { id: 3, value: closedCounts.Minor, label: 'Minor' },
  ];

  const barCategories = ['Critical', 'Major', 'Warning', 'Minor'];
  const barDataOpen = [
    openCounts.Critical,
    openCounts.Major,
    openCounts.Warning,
    openCounts.Minor,
  ];

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg, color: COLORS.text }}>
      <Header />

      {/* Breadcrumb + Title */}
      <div className="px-4">
        <div className="flex flex-col gap-1">
          <DynamicBreadcrumb />
          <h1 className="text-2xl font-semibold mt-1">Alarms Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        <div
          className="relative rounded-2xl p-6 border"
          style={{ background: COLORS.card, borderColor: COLORS.divider }}
        >
          {/* Total */}
          <div className="mb-4">
            <div className="text-3xl font-extrabold leading-tight">{total}</div>
            <div className="text-sm" style={{ color: COLORS.subtext }}>Total alarms</div>
          </div>

          {/* Charts Container -> Changed to Flexbox */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Open Pie (1fr) */}
            <div className="rounded-xl p-4 border min-w-[300px] lg:flex-1"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}>
              <div className="mb-2 text-center">Open Alarms Severity (%)</div>
              <div className="flex justify-center">
                <PieChart
                  width={240}
                  height={200}
                  series={[{ data: openPie, innerRadius: 0, outerRadius: 80 }]}
                  colors={[COLORS.critical, COLORS.major, COLORS.warning, COLORS.minor]}
                  sx={{
                    '& .MuiChartsLegend-root': { display: 'none' },
                    '& text': { fill: COLORS.text },
                    '& path': { stroke: '#000', strokeWidth: 1 },
                  }}
                />
              </div>

              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                <LegendItem color={COLORS.critical} label="Critical" valuePct={pct(openCounts.Critical, totalOpen)} />
                <LegendItem color={COLORS.major} label="Major" valuePct={pct(openCounts.Major, totalOpen)} />
                <LegendItem color={COLORS.warning} label="Warning" valuePct={pct(openCounts.Warning, totalOpen)} />
                <LegendItem color={COLORS.minor} label="Minor" valuePct={pct(openCounts.Minor, totalOpen)} />
              </div>
            </div>

            {/* Closed Pie (1fr) */}
            <div className="rounded-xl p-4 border min-w-[300px] lg:flex-1"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}>
              <div className="mb-2 text-center">Closed Alarms Severity (%)</div>
              <div className="relative flex items-center justify-center">
                <PieChart
                  width={240}
                  height={200}
                  series={[{ data: closedPie, innerRadius: 60, outerRadius: 80, paddingAngle: 0 }]}
                  colors={[COLORS.critical, COLORS.major, COLORS.warning, COLORS.minor]}
                  sx={{
                    '& .MuiChartsLegend-root': { display: 'none' },
                    '& text': { fill: COLORS.text },
                    '& path': { stroke: '#000', strokeWidth: 1 },
                  }}
                />
                <div className="absolute text-center pointer-events-none">
                  <div className="text-2xl font-extrabold">{totalClosed}</div>
                  <div className="text-xs" style={{ color: COLORS.subtext }}>Total</div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                <LegendItem color={COLORS.critical} label="Critical" valuePct={pct(closedCounts.Critical, totalClosed)} />
                <LegendItem color={COLORS.major} label="Major" valuePct={pct(closedCounts.Major, totalClosed)} />
                <LegendItem color={COLORS.warning} label="Warning" valuePct={pct(closedCounts.Warning, totalClosed)} />
                <LegendItem color={COLORS.minor} label="Minor" valuePct={pct(closedCounts.Minor, totalClosed)} />
              </div>
            </div>

            {/* Bar Chart (2fr) */}
            <div
              className="rounded-xl p-4 pb-0 border min-w-0 lg:flex-[2] flex flex-col items-start justify-start"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}
            >
              <div className="mb-2 text-left w-full">Open Alarms Severity (Quantity)</div>
              <div className="flex-1 w-full h-[240px]">
                <BarChart
                  xAxis={[{ scaleType: 'band', data: barCategories, tickLabelStyle: { fill: COLORS.text } }]}
                  yAxis={[{ tickLabelStyle: { fill: COLORS.text }, tickMinStep: 2, width: 20 }]}
                  grid={{ vertical: false, horizontal: true }}
                  series={[
                    { id: 'Critical', data: [barDataOpen[0], 0, 0, 0], color: COLORS.critical, stack: 'qty' },
                    { id: 'Major', data: [0, barDataOpen[1], 0, 0], color: COLORS.major, stack: 'qty' },
                    { id: 'Warning', data: [0, 0, barDataOpen[2], 0], color: COLORS.warning, stack: 'qty' },
                    { id: 'Minor', data: [0, 0, 0, barDataOpen[3]], color: COLORS.minor, stack: 'qty' },
                  ]}
                  margin={{ left: 0, right: 0, top: 8, bottom: 22 }}
                  sx={{
                    '& .MuiChartsLegend-root': { display: 'none' },
                    '& .MuiChartsAxis-left .MuiChartsAxis-line': { stroke: 'transparent' },
                    '& .MuiChartsAxis-bottom .MuiChartsAxis-line': { stroke: '#fff' },
                    '& .MuiChartsGrid-line': { stroke: 'rgba(255,255,255,0.25)' },
                    '& .MuiBarElement-root': { rx: 8, ry: 8 },
                    '& text': { fill: COLORS.text },
                  }}
                />
              </div>
            </div>

            {/* Closed Alarms Severity (Quantity) — semicircle gauge */}
            <div
              className="rounded-xl p-4 border min-w-[280px] lg:flex-1"
              style={{ background: COLORS.bg, borderColor: COLORS.divider }}
            >
              <div className="mb-2 text-center">Closed Alarms Severity (Quantity)</div>

              <div className="relative flex items-center justify-center">
                <PieChart
                width={265}
                height={200}
                series={[
                  // Critical 
                  ((p) => ({
                    data: [
                      { id: 'crit-rem', value: Math.max(100 - p, 0.0001), color: '#2a2b2f' },
                      { id: 'crit',     value: Math.max(p, 0.0001),       color: COLORS.critical },
                    ],
                    innerRadius: 86, outerRadius: 104,   
                    startAngle: 110, endAngle: -110,
                    paddingAngle: 0,                      
                    cornerRadius: 6,
                    cx: 130, cy: 120,
                  }))(pct(closedCounts.Critical, totalClosed)),

                  // Major
                  ((p) => ({
                    data: [
                      { id: 'maj-rem', value: Math.max(100 - p, 0.0001), color: '#2a2b2f' },
                      { id: 'maj',     value: Math.max(p, 0.0001),       color: COLORS.major },
                    ],
                    innerRadius: 68, outerRadius: 82,     
                    startAngle: 110, endAngle: -110,
                    paddingAngle: 0,
                    cornerRadius: 6,
                    cx: 130, cy: 120,
                  }))(pct(closedCounts.Major, totalClosed)),

                  // Minor
                  ((p) => ({
                    data: [
                      { id: 'min-rem', value: Math.max(100 - p, 0.0001), color: '#2a2b2f' },
                      { id: 'min',     value: Math.max(p, 0.0001),       color: COLORS.minor },
                    ],
                    innerRadius: 50, outerRadius: 64,
                    startAngle: 110, endAngle: -110,
                    paddingAngle: 0,
                    cornerRadius: 6,
                    cx: 130, cy: 120,
                  }))(pct(closedCounts.Minor, totalClosed)),

                  // Warning (innermost)
                  ((p) => ({
                    data: [
                      { id: 'warn-rem', value: Math.max(100 - p, 0.0001), color: '#2a2b2f' },
                      { id: 'warn',     value: Math.max(p, 0.0001),       color: COLORS.warning },
                    ],
                    innerRadius: 32, outerRadius: 46,
                    startAngle: 110, endAngle: -110,
                    paddingAngle: 0,
                    cornerRadius: 6,
                    cx: 130, cy: 120,
                  }))(pct(closedCounts.Warning, totalClosed)),
                ]}
                sx={{
                  '& .MuiChartsLegend-root': { display: 'none' },
                  '& text': { fill: COLORS.text },
                  '& path': { stroke: '#000', strokeWidth: 1 },
                }}
              />
                {/* Center total */}
                <div className="absolute text-center pointer-events-none translate-y-6">
                  <div className="text-2xl font-extrabold">{totalClosed}</div>
                  <div className="text-xs" style={{ color: COLORS.subtext }}>Total</div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                <LegendItem color={COLORS.critical} label="Critical" valuePct={pct(closedCounts.Critical, totalClosed)} />
                <LegendItem color={COLORS.major}    label="Major"    valuePct={pct(closedCounts.Major, totalClosed)} />
                <LegendItem color={COLORS.minor}    label="Minor"    valuePct={pct(closedCounts.Minor, totalClosed)} />
                <LegendItem color={COLORS.warning}  label="Warning"  valuePct={pct(closedCounts.Warning, totalClosed)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailsCharts;