import { Accordion, AccordionDetails, AccordionSummary, Box, List,  ListItem,  ListItemText,  Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import alarms from '../../data/alarm.json'

type NestedStructure = {
    [enterprise: string]: {
        [core: string]: {
            locationName: string, nodeName: string 
        }[];
    }
}

const LeftGrid = () => {
    const groupedData = useMemo(() => {
        const structure: NestedStructure = {};
        alarms.forEach(alarm => {
            if(!structure[alarm.enterpriseName]){
                structure[alarm.enterpriseName] = {};
            }
            if(!structure[alarm.enterpriseName][alarm.coreName]) {
                structure[alarm.enterpriseName][alarm.coreName] = [];
            }
            const coreLocations = structure[alarm.enterpriseName][alarm.coreName];
            if (!coreLocations.some(loc => loc.nodeName === alarm.nodeName)) {
                coreLocations.push({ locationName: alarm.locationName, nodeName: alarm.nodeName });
            }
        });
        return structure;
    }, []);

    const [expandedEnterprise, setExpandedEnterprise] = useState<string | false>('Enterprise A');
    const [expandedCore, setExpandedCore] = useState<string | false>('5G Core 1');

    const handleEnterpriseChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedEnterprise(isExpanded ? panel : false);
    };

    const handleCoreChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedCore(isExpanded ? panel : false);
    };

    const  accordionStyle = {
        color: 'white',
        boxShadow: 'none',
        '&:before' : {
            display: 'none'
        },
        '&.Mui-expanded' : {
            margin: 0,
        },
    };

    const accordionSummaryStyles = {
        '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
            color: 'white',
        },
    };

    return (
        <Box sx={{ borderRadius: 2, height: '100%', overflow: 'hidden'}}>
            {Object.keys(groupedData).map((enterpriseName) => (
                <Accordion
                    key={enterpriseName}
                    expanded={expandedEnterprise === enterpriseName}
                    onChange={handleEnterpriseChange(enterpriseName)}
                    sx={{ ...accordionStyle, backgroundColor: '#343536'}}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyles}>
                        <Typography sx={{ fontSize: '0.9rem' }}>{enterpriseName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1}}>
                        {Object.keys(groupedData[enterpriseName]).map((coreName) => (
                            <Accordion
                                key={coreName}
                                expanded={expandedCore === coreName}
                                onChange={handleCoreChange(coreName)}
                                sx={{ ...accordionStyle, backgroundColor: '#4a4a4b'}}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ 
                                        ...accordionSummaryStyles, 
                                        '&.Mui-expanded': {
                                            backgroundColor: '#355393'
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontSize: '0.9rem' }}>{coreName}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0}}>
                                    <List component="div" disablePadding>
                                        {groupedData[enterpriseName][coreName].map((location) => (
                                            <ListItem key={location.nodeName} sx={{ pl: 4, backgroundColor: '#2d2d2e', mb: 0.5, borderRadius: 1}}>
                                                <ListItemText
                                                    primary={location.locationName}
                                                    secondary={location.nodeName}
                                                    sx={{
                                                        '& .MuiListItemText-primary': {
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                        },
                                                        '& .MuiListItemText-secondary': {
                                                            fontSize: '0.7rem',
                                                            color: '#bdbdbd'
                                                        },
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default LeftGrid;