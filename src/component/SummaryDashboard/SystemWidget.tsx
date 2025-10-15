import { Box, Typography, Select, MenuItem, IconButton } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { FaHdd, FaMicrochip, FaMemory } from 'react-icons/fa';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import systemData from '../../data/systemUsage.json';
import { useNavigate } from 'react-router-dom';

const GaugeBackground = () => {
    const ticks = Array.from({ length: 60 }); 
    const radius = 55;
    const center = 60;

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                {ticks.map((_, i) => {
                    const angle = (i / ticks.length) * 360;
                    const startX = center + radius * Math.cos(angle * Math.PI / 180);
                    const startY = center + radius * Math.sin(angle * Math.PI / 180);
                    const endX = center + (radius - 10) * Math.cos(angle * Math.PI / 180);
                    const endY = center + (radius - 10) * Math.sin(angle * Math.PI / 180);
                    return <line key={i} x1={startX} y1={startY} x2={endX} y2={endY} stroke="#555" strokeWidth="1.5" />;
                })}
            </svg>
        </Box>
    );
};

const GaugeChart = ({ data, icon }: { data: any, icon: React.ReactNode }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ position: 'relative', width: 120, height: 120 }}>
            {/* tick */}
            <GaugeBackground />

            {/* chart */}
            <PieChart
                series={[{
                    data: [
                        { id: 0, value: data.percent, color: data.color },
                        { id: 1, value: 100 - data.percent, color: 'transparent' }
                    ],
                    innerRadius: 40,
                }]}
                width={120}
                height={120}
                slotProps={{ legend: { sx: { display: 'none' } } }}
                sx={{
                    '& .MuiPieArc-root': {
                        stroke: 'none !important',
                    }
                }}
            />

            {/* center chart text */}
            <Box
                sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{`${data.percent}%`}</Typography>
                <Typography variant="caption" sx={{ color: '#bdbdbd' }}>{data.label}</Typography>
            </Box>
        </Box>

        {/* detail text */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {data.total} {data.bottomLabel}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#bdbdbd' }}>
                    {data.used} {data.unit} used
                </Typography>
            </Box>
        </Box>
    </Box>
);

const SystemWidget = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: '#3c3c3c', p: 3, borderRadius: 2, height: '100%' }}>
            {/* title */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    System (5GCore1)
                </Typography>
                <IconButton
                    onClick={() => navigate('/system')}
                    size="small"
                    sx={{
                        color: '#2D2D2E',
                        backgroundColor: '#e5e7eb',
                        '&:hover': {
                            backgroundColor: '#e5e7eb',
                            border: '1px solid',
                            borderColor: '#355393',
                        },
                    }}
                >
                    <ArrowForwardIos sx={{ fontSize: '0.9rem' }} />
                </IconButton>
            </Box>

            {/* dropdown */}
            <Select
                fullWidth
                defaultValue="select"
                size="small"
                sx={{
                    mb: 3, backgroundColor: '#282828', color: 'white', borderRadius: 2,
                    '.MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '& .MuiSvgIcon-root': { color: 'white' },
                }}
            >
                <MenuItem value="select">Select</MenuItem>
            </Select>

            {/* chart box */}
            <Box sx={{ 
                    display: 'flex', 
                    backgroundColor: '#2D2D2E',
                    borderRadius: 2,
                    justifyContent: 'space-around', 
                    alignItems: 'flex-start', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    p: 2
                }}>
                <GaugeChart data={systemData.memory} icon={<FaMemory size={20} />} />
                <GaugeChart data={systemData.cpu} icon={<FaMicrochip size={20} />} />
                <GaugeChart data={systemData.storage} icon={<FaHdd size={20} />} />
            </Box>
        </Box>
    );
};

export default SystemWidget;
