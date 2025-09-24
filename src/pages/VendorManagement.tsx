import { useState } from "react";
import Header from "../component/header"
import { Box, Breadcrumbs, Link, Paper, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";


const mockData = [
  { id: 'DI172391983', type: 'Integrated', manufacturer: 'EDMI', model: 'ECM-5t', market: 'Market Name A', submitted: '17/23/2023 12:00:00 AM', status: 'Testing', certified: '17/23/2023 12:00:00 AM', submitter: 'AN20291904@wipro.com' },
  { id: 'AZ379191983', type: 'Integrated', manufacturer: 'EDMI', model: 'ECM-5t', market: 'Market Name A', submitted: '17/23/2023 12:00:00 AM', status: 'RFI', certified: '17/23/2023 12:00:00 AM', submitter: 'AN20291904@wipro.com' },
  { id: 'DI172391983', type: 'Integrated', manufacturer: 'EDMI', model: 'ECM-5t', market: 'Market Name B', submitted: '17/23/2023 12:00:00 AM', status: 'Testing', certified: '17/23/2023 12:00:00 AM', submitter: 'AN20291904@wipro.com' },
  { id: 'AZ379191983', type: 'Integrated', manufacturer: 'EDMI', model: 'ECM-5t', market: 'Market Name B', submitted: '17/23/2023 12:00:00 AM', status: 'RFI', certified: '17/23/2023 12:00:00 AM', submitter: 'AN20291904@wipro.com' },
];

const VendorManagement = () => {
    
    const [activeTab, setActiveTab] = useState(0);
    
    const handleTabChange = (event : React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const tabTitles = [
        'Manage Device Certification',
        'Manage Vendor Agreement',
        'Manage Vendor Registration',
    ];

    return (
        <div className="min-h-screen bg-[#282828] text-white">
            <Header />

            <main className="container mx-auto p-8">
                {/* breadcrumbs */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'white', fontSize: '10px' }}>
                    <Link underline="hover" color="inherit" href="/dashboard">
                        Dashboard
                    </Link>
                    <Typography sx={{color: 'orange', fontSize: '10px'}}>
                        Vendor Management
                    </Typography>
                </Breadcrumbs>

                {/* page title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold'}}>
                        Vendor Management
                    </Typography>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%'}} />
                </Box>

                {/* table */}
                <Paper sx={{ mt: 2, p : 1.5, backgroundColor: '#343536', borderRadius: 2 }}>
                    <Box>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="vendor management tabs"
                            sx={{
                                minHeight: 'auto',
                                '& .MuiTabs-indicator': {
                                    display: 'none'
                                },
                                '& .MuiTab-root': {
                                    backgroundColor: '#5a5a5a',
                                    color: "#a0a0a0",
                                    textTransform: 'none',
                                    fontSize: '0.8rem',
                                    padding: '8px 10px',
                                    minHeight: 'auto',
                                    marginRight: '-5px',
                                    borderRadius: '4px',
                                    '&.Mui-selected': {
                                        backgroundColor: '#355493',
                                        color: 'white'
                                    },
                                },
                            }}
                        >
                            <Tab label = "Manage Device Certification"/>
                            <Tab label = "Manage Vendor Agreement"/>
                            <Tab label = "Manage Vendor Registration"/>
                        </Tabs>
                        
                        <Box sx={{ mt: 1, p : 1.5, backgroundColor: '#2d2d2e', borderRadius: 2 }}>            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                                <Typography sx={{ color: 'white', fontWeight: 'semi-bold'}}>
                                    {tabTitles[activeTab]}
                                </Typography>
                            </Box>

                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="vendor data table">
                                    <TableHead sx={{ backgroundColor: '#746fa7'}}>
                                        <TableRow>
                                            {[
                                                'Request ID', 
                                                'Type', 
                                                'Device Manufacturer', 
                                                'Device Model No.', 
                                                'Device Market Name', 
                                                'Device Submitted', 
                                                'Status', 
                                                'Data Certified', 
                                                'Submitter ID'].map((headCell) => (
                                                    <TableCell key={headCell} sx={{ color: '#d0d0d0', fontWeight: 'bold', borderBottom: 'none' }}>{headCell}</TableCell>
                                                ))}
                                        </TableRow>
                                    </TableHead>
                                    
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Paper>
                
            </main>    
        </div>
    );
};

export default VendorManagement;