import { Accordion, AccordionDetails, AccordionSummary, Box, List,  ListItem,  ListItemText,  Typography } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LeftGrid = () => {
    const [expanded, setExpanded] = useState<string | false>('enterpriseA');

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    }

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
            {/* enterprise A */}
            <Accordion
                expanded={expanded === 'enterpriseA'}
                onChange={handleChange('enterpriseA')}
                sx={{ ...accordionStyle, backgroundColor: '#343536'}}
            >
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyles}>
                    <Typography sx={{ fontSize: '0.9rem'}}>Enterprise A</Typography>
                </AccordionSummary>                
                <AccordionDetails sx={{ p: 1 }}>
                    {/* 5G Core 1 */}
                    <Accordion 
                        defaultExpanded 
                        sx={{ ...accordionStyle, backgroundColor: '#4a4a4b'}}>
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />} 
                            sx={{ 
                                ...accordionSummaryStyles,
                                '&.Mui-expanded': {
                                    backgroundColor: '#355393',
                                },
                            }}>
                            <Typography sx={{ fontSize: '0.9rem', borderRadius: 3}}>5G Core 1</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0}}>
                            <List component="div" disablePadding>
                                <ListItem
                                    sx={{
                                        pl: 4,
                                        backgroundColor: '#2d2d2e',
                                    }}
                                >
                                    <ListItemText
                                        primary="Kamataka"
                                        secondary="gNB-Bir-1"
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: '#bdbdbd',
                                                fontSize: '0.7rem',
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem
                                    sx={{
                                        pl: 4,
                                        backgroundColor: '#2d2d2e',
                                    }}
                                >
                                    <ListItemText
                                        primary="Texas"
                                        secondary="gNB-Texas-1"
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: '#bdbdbd',
                                                fontSize: '0.7rem',
                                            },
                                        }}
                                    />
                                </ListItem>
                                <ListItem
                                    sx={{
                                        pl: 4,
                                        backgroundColor: '#2d2d2e',
                                    }}
                                >
                                    <ListItemText
                                        primary="Ohio"
                                        secondary="gNB-Ohio-1"
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: '#bdbdbd',
                                                fontSize: '0.7rem',
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        defaultExpanded
                        sx={{ ...accordionStyle, backgroundColor: '#4a4a4b'}}>
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />} 
                            sx={{ 
                                ...accordionSummaryStyles,
                                '&.Mui-expanded': {
                                    backgroundColor: '#355393',
                                },
                            }}>
                            <Typography sx={{ fontSize: '0.9rem', borderRadius: 3}}>5G Core 2</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0}}>
                            <List component="div" disablePadding>
                                <ListItem
                                    sx={{
                                        pl: 4,
                                        backgroundColor: '#2d2d2e',
                                    }}
                                >
                                    <ListItemText
                                        primary="Washington"
                                        secondary="gNB-Washington-1"
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                            },
                                            '& .MuiListItemText-secondary': {
                                                color: '#bdbdbd',
                                                fontSize: '0.7rem',
                                            },
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </AccordionDetails>
            </Accordion>
            <Accordion
                expanded={expanded === 'enterpriseB'}
                onChange={handleChange('enterpriseB')}
                sx={{ ...accordionStyle, backgroundColor: '#343536'}}
            >
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyles}>
                    <Typography sx={{ fontSize: '0.9rem'}}>Enterprise B</Typography>
                </AccordionSummary> 
            </Accordion>
        </Box>
    );
};

export default LeftGrid;