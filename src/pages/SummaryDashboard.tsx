import Header from "../component/header";
import { Box, Breadcrumbs, Drawer, IconButton, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import LeftGrid from "../component/SummaryDashboard/LeftGrid";
import RightGrid from "../component/SummaryDashboard/RightGrid";
import CenterGrid from "../component/SummaryDashboard/CenterGrid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';

const CustomBreadCrumbs = () => {
    const navigate = useNavigate();

    const linkStyles = {
        cursor: 'pointer',
        color: 'white',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
        fontSize: '10px',
    };

    return (
        <Breadcrumbs>
            <Link
                sx={linkStyles}
                onClick={() => navigate('/dashboard')}
            >
                Dashboard
            </Link>
            <Link
                sx={linkStyles}
                onClick={() => navigate('/service-assurance')}
            >
                Service Assurance
            </Link>
            <Typography sx={{ color: 'orange', fontSize: '10px' }}>
                Summary
            </Typography>
        </Breadcrumbs>
    );
}

const SummaryDashboard = () => {
    const [isLeftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const [isRightDrawerOpen, setRightDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className="min-h-screen bg-[#282828] text-white">
            <Header/>

            <main className="container mx-auto p-8">
                <CustomBreadCrumbs />
                {/* page title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold'}}>
                        Service Assurance
                    </Typography>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%'}} />
                </Box>

                {/* main dashboard */}
                {isMobile ? (
                    <Box sx={{ position: 'relative', pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2}}>
                            <IconButton onClick={() => setLeftDrawerOpen(true)} sx={{ color: 'white'}}>
                                <MenuIcon />
                                <Typography sx={{ ml: 1, fontSize: '0.9rem'}}>Menu</Typography>
                            </IconButton>
                            <IconButton onClick={() => setRightDrawerOpen(true)} sx={{ color: 'white'}}>
                                <TuneIcon />
                                <Typography sx={{ ml: 1, fontSize: '0.9rem'}}>Alarm</Typography>
                            </IconButton>
                        </Box>

                        {/* left grid drawer */}
                        <Drawer anchor="left" open={isLeftDrawerOpen} onClose={() => setLeftDrawerOpen(false)}>
                            <Box sx={{ width: 250, height: '100%', bgcolor: '#282828' }}>
                                <LeftGrid />
                            </Box>
                        </Drawer>

                        {/* right grid drawer */}
                        <Drawer anchor="right" open={isRightDrawerOpen} onClose={() => setRightDrawerOpen(false)}>
                            <Box sx={{ width: 280, height: '100%', bgcolor: '#343536' }}>
                                <RightGrid />
                            </Box>
                        </Drawer>

                        {/* center grid */}
                        <CenterGrid />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            p: 1,
                            alignItems: 'start'
                        }}
                    >
                        {/* left grid column */}
                        <Box sx={{ width: '16.66%' }}>
                            <LeftGrid />
                        </Box>

                        {/* Center grid column */}
                        <Box sx={{ width: '66.67%' }}>
                            <CenterGrid />
                        </Box>

                        {/* right grid colum */}
                        <Box sx={{ width: '16.66%' }}>
                            <RightGrid />
                        </Box>
                    </Box>
                )}
                
            </main>
        </div>
    );
};

export default SummaryDashboard;