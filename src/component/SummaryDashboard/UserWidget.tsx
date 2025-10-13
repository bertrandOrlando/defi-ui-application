import registrationData from '../../data/vendorRegistration.json'
import agreementData from '../../data/vendorAgreement.json'
import { Box, IconButton, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';

const countStatuses = (data: any[], statusKey: string) => {
    return data.reduce((acc, item) => {
        const status = item[statusKey];
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
};

const LegendItem = ({ color, value, label }: { color: string, value: number, label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        <Typography variant="body2" sx={{ color: '#bdbdbd' }}>{label}</Typography>
    </Box>
);


const UserWidget = () => {
    const navigate = useNavigate();

    const verificationCounts = countStatuses(registrationData.vendorRegistration, 'verificationStatus');
    const agreementCounts = countStatuses(agreementData.vendoragreement, 'agreementStatus');

    const statusColorsVerification: { [key: string]: string } = {
        Verified: '#81c784', 
        Pending: '#ffa726',  
        Rejected: '#e57373',   
    };

    const statusColorsAgreement: { [key: string]: string } = {
        'Fulfilled': '#81c784', 
        'Not Fulfilled': '#e57373',   
    };

    const verificationChartData = Object.keys(verificationCounts).map((key) => ({
        value: verificationCounts[key],
        label: key,
        color: statusColorsVerification[key] || '#bdbdbd',
    }));

    const agreementChartData = Object.keys(agreementCounts).map((key) => ({
        value: agreementCounts[key],
        label: key,
        color: statusColorsAgreement[key] || '#bdbdbd',
    }));

    return (
        <Box sx={{ bgcolor: '#3c3c3c', p: 2, borderRadius: 2, height: '100%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    Users
                </Typography>
                <IconButton
                    onClick={() => navigate('/user-management')}
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
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#2D2D2E', borderRadius: 2}}>
                    <Box sx={{ flexShrink: 0 }} >
                        <PieChart 
                            series={[{ 
                                data: verificationChartData, 
                                innerRadius: 35,
                                outerRadius: 45,
                            }]}
                        height={120}
                        width={120}
                        hideLegend 
                        />
                    </Box>
                    <Box>
                        {verificationChartData.map(item => (
                            <LegendItem
                                key={item.label}
                                color={item.color}
                                value={item.value}
                                label={item.label}
                            />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#2D2D2E', borderRadius: 2}}>
                    <Box sx={{ flexShrink: 0 }} >
                        <PieChart 
                            series={[{ 
                                data: agreementChartData, 
                                innerRadius: 35,
                                outerRadius: 45,
                            }]}
                        height={120}
                        width={120}
                        hideLegend 
                        />
                    </Box>
                    <Box>
                        {agreementChartData.map(item => (
                            <LegendItem
                                key={item.label}
                                color={item.color}
                                value={item.value}
                                label={item.label}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UserWidget;