import Header from "../component/header";
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";
import { Box, Grid, Typography } from "@mui/material";
import LeftGrid from "../component/SummaryDashboard/LeftGrid";
import RightGrid from "../component/SummaryDashboard/RightGrid";
import CenterGrid from "../component/SummaryDashboard/CenterGrid";

const SummaryDashboard = () => {

    return (
        <div className="min-h-screen bg-[#282828] text-white">
            <Header/>

            <main className="container mx-auto p-8">
                <DynamicBreadcrumb />
                {/* page title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold'}}>
                        Service Assurance
                    </Typography>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%'}} />
                </Box>

                {/* main dashboard */}
                <Grid
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: 2,
                        p: 1,
                        alignItems: 'start'
                    }}
                >
                    {/* left grid column */}
                    <Grid sx={{ gridColumn: 'span 2'}}>
                        <LeftGrid />
                    </Grid>

                    {/* Center grid column */}
                    <Grid sx={{ gridColumn: 'span 8'}}>
                        <CenterGrid />
                    </Grid>

                    {/* right grid colum */}
                    <Grid sx={{ gridColumn: 'span 2'}}>
                        <RightGrid />
                    </Grid>
                </Grid>
            </main>
        </div>
    );
};

export default SummaryDashboard;