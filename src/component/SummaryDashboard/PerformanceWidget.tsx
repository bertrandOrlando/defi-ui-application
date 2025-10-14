import { Box, IconButton, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import performanceData from '../../data/performanceData.json';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from "react-router-dom";

const PerformanceWidget = () => {
    const navigate = useNavigate();
    const { uplinkDownlink, pduSessions } = performanceData;

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Performance
                </Typography>
                <IconButton
                    onClick={() => navigate('/performance-details')}
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

            {/* chart */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1}}>
                {/* uplink downlink chart */}
                <Box sx={{ bgcolor: '#2d2d2e', p: 2, borderRadius: 2}}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'medium', mb: 1 }}>
                        Uplink and Downlink (Mbps)
                    </Typography>
                    <BarChart
                        layout="horizontal"
                        yAxis={[{
                            scaleType: 'band',
                            data: ['Uplink', 'Downlink'],
                            tickLabelStyle: { fillOpacity: 0}
                        }]}
                        xAxis={[{ 
                            max: uplinkDownlink.max, 
                            tickLabelStyle: { fontSize: '0.75rem', fill: '#bdbdbd' },
                        }]}
                        series={[
                            { data: [uplinkDownlink.uplink], stack: 'A', label: 'Uplink' },
                            { data: [null, uplinkDownlink.downlink], stack: 'B', label: 'Downlink' },
                        ]}
                        colors={['#64b5f6', '#81c784']}
                        height={120}
                        grid={{ vertical: true }}
                        hideLegend
                        margin={{ top: 5, right: 20, bottom: 40, left: 20 }}
                    />
                    {/* bottom text */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: -2 }}>
                        <Typography variant="caption" sx={{ color: '#bdbdbd' }}>
                           <span style={{ fontWeight: 'bold', color: 'white' }}>{uplinkDownlink.uplink}</span> {uplinkDownlink.unit} Uplink
                        </Typography>
                         <Typography variant="caption" sx={{ color: '#bdbdbd' }}>
                           <span style={{ fontWeight: 'bold', color: 'white' }}>{uplinkDownlink.downlink}</span> {uplinkDownlink.unit} Downlink
                        </Typography>
                    </Box>
                </Box>
                
                {/* pdu session chart */}
                <Box sx={{ bgcolor: '#2D2D2E', p: 2, borderRadius: 2 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'medium', mb: 1 }}>
                        Active PDU Sessions
                    </Typography>
                    <BarChart
                        layout="horizontal"
                        yAxis={[{ scaleType: 'band', data: [''] }]}
                        xAxis={[{ 
                            max: pduSessions.max, 
                            tickLabelStyle: { fontSize: '0.75rem', fill: '#bdbdbd' },
                        }]}
                        series={[{ data: [pduSessions.active] }]}
                        colors={['#4db6ac']} 
                        height={80}
                        grid={{ vertical: true }}
                        hideLegend
                        margin={{ top: 5, right: 20, bottom: 40, left: 20 }}
                    />
                    <Typography variant="caption" sx={{ color: '#bdbdbd', display: 'block', mt: -2, ml: 1 }}>
                        <span style={{ fontWeight: 'bold', color: 'white' }}>{pduSessions.active}</span> {pduSessions.label}
                    </Typography>
                </Box>
            </Box>


        </Box>
    );
};

export default PerformanceWidget;