import { Box, MenuItem, Select, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import alarms from '../../data/alarm.json';

const CustomChart = () => {
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
    
    const rows = alarms as AlarmRec[];

    const closedRows = rows.filter((r) => r.status === 'Closed');

    const closedCounts = countBySeverity(closedRows);

    const totalClosed = closedRows.length;

    return (
        <Box>
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
            
                    // Warning (paling dalam)
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
        </Box>
    )
}

const AlarmsWidget = () => {
    const selectStyles = {
        backgroundColor: '#2D2D2E',
        color: 'white',
        borderRadius: 2,
        '.MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
        '& .MuiSvgIcon-root': { color: 'white' },
        height: '40px',
    };

    return (
        <Box sx={{ 
            bgcolor: '#3c3c3c',
            p: 2,
            borderRadius: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            {/* title */}
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#e5e7eb' }}>
                Alarms
            </Typography>

            {/* dropdown */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Select defaultValue="severity" size="small" sx={selectStyles}>
                    <MenuItem value="severity">Select Severity</MenuItem>
                </Select>
                <Select defaultValue="node" size="small" sx={selectStyles}>
                    <MenuItem value="node">Select Node Type</MenuItem>
                </Select>
            </Box>

            {/* chart */}
            <Box sx={{ bgcolor: '#2D2D2E', p: 2, borderRadius: 2 }}>
                <CustomChart />
            </Box>
        </Box>
    );
};

export default AlarmsWidget;