import { Accordion, AccordionSummary, Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RiAlarmWarningLine } from 'react-icons/ri';
import { GoOrganization } from 'react-icons/go';
import alarms from '../../data/alarm.json'

const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
        case 'critical':
            return '#f44336';
        case 'warning':
            return '#ffa726';
        case 'minor':
            return '#66bb6a';
        default:
            return '#bdbdbd';
    }
}

const RightGrid = () => {
    const accordionStyle = {
        backgroundColor: '#474748', 
        color: 'white',
        boxShadow: 'none',
        '&:before' : { display: 'none' },
        '&.Mui-expanded' : { margin: '0 0 8px 0' },
    };

    const accordionSummaryStyles = {
        minHeight: '40px',
        '& .MuiAccordionSummary-content': { margin: '10px 0' },
        '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': { color: 'white' },
    };

    return (
        <Box sx={{ bgcolor: '#343536', p: 2, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* top section */}
            <Box sx={{ mb: 2}}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 2}}>
                    Last 24 Alarm                    
                </Typography>
                <Accordion sx={accordionStyle}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyles}>
                        <Typography sx={{ fontSize: '0.9rem', display: 'flex', gap: 1 }}><RiAlarmWarningLine />All Alarms</Typography>
                    </AccordionSummary>
                </Accordion>
                <Accordion sx={accordionStyle}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyles}>
                        <Typography sx={{ fontSize: '0.9rem', display: 'flex', gap: 1 }}><GoOrganization /> Enterprises</Typography>
                    </AccordionSummary>
                </Accordion>
            </Box>
            
            {/* list section */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto'}}>
                <List>
                    {alarms.map((alarm) => (
                        <ListItem key={alarm.id} sx={{ mb: 1, bgcolor: '#2d2d2e', borderRadius: 2}}>
                            <Box sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: getSeverityColor(alarm.severity),
                                mr: 2,
                                flexShrink: 0,
                                }}
                            />
                            <ListItemText
                                primary={`${alarm.enterpriseName} | ${alarm.coreName} `}
                                secondary={alarm.alarm}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontSize: '0.8rem',
                                        color: 'white'
                                    },
                                    '& .MuiListItemText-secondary': {
                                        fontSize: '0.7rem',
                                        color: '#bdbdbd',
                                    },
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default RightGrid;