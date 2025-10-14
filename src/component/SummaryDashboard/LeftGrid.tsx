import { Accordion, AccordionDetails, AccordionSummary, Box, List,  ListItem,  ListItemText,  Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import enterprises from '../../data/enterprise.json';

type LocationInfo = {
    city: string;
    cpes: string[];
};

type NestedStructure = {
    [enterprise: string]: {
        [core: string]: LocationInfo[];
    }
}

interface Enterprise {
    id: number;
    address: string;
    lat: number;
    long: number;
    enterprise: string;
    status: string;
    core: string;
    ran: string[];
    cpe: string[];
}


const COLOR_MAP = {
  cpe: "#079487",
};

const LeftGrid = () => {

    // ambil kota
    const getCityFromAddress = (address: string): string => {
        const parts = address.split(',');
        return parts.length > 1 ? parts[1].trim() : 'Unknown Location';
    };

    const groupedData = useMemo(() => {
        const structure: NestedStructure = {};
        enterprises.forEach((item: Enterprise) => {
            if(!structure[item.enterprise]){
                structure[item.enterprise] = {};
            }

            if(!structure[item.enterprise][item.core]) {
                structure[item.enterprise][item.core] = [];
            }

            const city = getCityFromAddress(item.address)
            structure[item.enterprise][item.core].push({
                city: city,
                cpes: item.cpe,
            });
        });
        return structure;
    }, []);

    const [expandedEnterprise, setExpandedEnterprise] = useState<string | false>('Enterprise A');
    const [expandedCore, setExpandedCore] = useState<string | false>('5G Core 1');

    const handleEnterpriseChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedEnterprise(isExpanded ? panel : false);
    };

    const handleCoreChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
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
                                        {groupedData[enterpriseName][coreName].map((location, index) => (
                                            <ListItem 
                                                key={`${location.city}-${index}`} 
                                                alignItems="flex-start" 
                                                sx={{ 
                                                    pl: 4, 
                                                    backgroundColor: '#2d2d2e', 
                                                    mb: 0.5, 
                                                    borderRadius: 1 
                                                }}>
                                                <ListItemText
                                                    primary={location.city}
                                                    secondary={
                                                        <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                                            {location.cpes.map(cpeName => (
                                                                <Box
                                                                    key={cpeName}
                                                                    component="span"
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        color: '#bdbdbd',
                                                                        fontSize: '0.75rem',
                                                                        px: 1.5,
                                                                        py: 0.5,
                                                                        borderRadius: '9999px',
                                                                        border: `1px solid ${COLOR_MAP.cpe}`,
                                                                    }}
                                                                >
                                                                    {cpeName}
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    }
                                                    sx={{
                                                        alignItems: 'flex-start',
                                                        '& .MuiListItemText-primary': {
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                            mb: 0.75,
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