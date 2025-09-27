import { useState } from "react";
import { Box, Breadcrumbs, Button, Link, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import { HiOutlineClipboardDocumentCheck } from 'react-icons/hi2';
import Header from "../component/header"
import DynamicBreadcrumb from "../component/dynamicBreadCrumbs";
import deviceCertificationData from '../data/deviceCertification.json';
import vendorAgreementData from '../data/vendorAgreement.json';
import vendorRegistrationData from '../data/vendorRegistration.json';

/**
 * TO DO:
 * - Update JSON when doing Action
 * - Optional : Link Document
 */
interface vendorAgreement {
    email: string,
    name: string,
    companyName: string,
    verificationStatus: string,
    tocStatus: string,
    agreementStatus: string,
    viewAgreementDocs: string
}

interface vendorRegistration {
    email: string, 
    name: string, 
    companyName: string, 
    verificationStatus: string
}

interface ConditionalTableProps {
    activeTab: number;
    agreementData: vendorAgreement[];
    registrationData: vendorRegistration[];
    onAgree: (email: string) => void;
    onVerify: (email: string, status: 'Verified' | 'Rejected') => void;
}

const StatusBubble = ({ status }: { status: string }) => {
    const statusColors: { [key: string]: string } = {
        'Verified': '#4caf50',
        'Fulfilled': '#4caf50',
        'Accepted': '#4caf50',
        'Pending': '#ff9800',
        'Rejected': '#f44336',
        'Not Accepted': '#f44336',
        'Not Fulfilled': '#f44336',
    };

    const bubbleStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '16px',
        backgroundColor: statusColors[status] || '#5a5a5a',
        color: 'white',
        fontsize: '0.7rem',
        fontWeight: '500'
    };
    
    return (
        <Box component="span" sx={bubbleStyle}>
            {status}
        </Box>
    );
}

const ConditionalTable = ({ activeTab, agreementData, registrationData, onAgree, onVerify}: ConditionalTableProps) => {
    
    const stripeColor = '#343536';
    const cellStyle = {
        color: 'white',
        borderBottom: 'none',
        fontSize: '0.75rem',
        padding: '12px'
    };
    const firstCellStyle = { ...cellStyle, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px'};
    const lastCellStyle = { ...cellStyle, borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}
    
    switch (activeTab) {
        case 0:
            const certRow = deviceCertificationData.deviceCertification;
            return (
                <TableBody>
                    {certRow.map((row) => (
                        <TableRow 
                            key={row.requestId}
                            sx={{ '&:nth-of-type(odd)': { backgroundColor: stripeColor } }} >
                            <TableCell sx={firstCellStyle}>{row.requestId}</TableCell>
                            <TableCell sx={cellStyle}>{row.type}</TableCell>
                            <TableCell sx={cellStyle}>{row.deviceManufacturer}</TableCell>
                            <TableCell sx={cellStyle}>{row.deviceModel}</TableCell>
                            <TableCell sx={cellStyle}>{row.deviceMarket}</TableCell>
                            <TableCell sx={cellStyle}>{row.deviceSubmitted}</TableCell>
                            <TableCell sx={cellStyle}>{row.status}</TableCell>
                            <TableCell sx={cellStyle}>{row.dataCertified || 'N/A'}</TableCell>
                            <TableCell sx={lastCellStyle}>{row.submitterId}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            );
        case 1:
            return (
                <TableBody>
                    {agreementData.map((row) => (
                        <TableRow 
                            key={row.email}
                            sx={{ '&:nth-of-type(odd)': { backgroundColor: stripeColor } }}>
                            <TableCell sx={firstCellStyle}>{row.email}</TableCell>
                            <TableCell sx={cellStyle}>{row.name}</TableCell>
                            <TableCell sx={cellStyle}>{row.companyName}</TableCell>
                            <TableCell sx={cellStyle}><StatusBubble status={row.verificationStatus} /></TableCell>
                            <TableCell sx={cellStyle}><StatusBubble status={row.tocStatus} /></TableCell>
                            <TableCell sx={cellStyle}><StatusBubble status={row.agreementStatus} /></TableCell>
                            <TableCell sx={cellStyle}>
                                <Link 
                                    href="https://www.topcoder.com/challenges/61fc66fe-80ad-4ead-9717-78bdbf55f009?tab=details" 
                                    underline="always"
                                    target="_blank"><HiOutlineClipboardDocumentCheck/> {row.viewAgreementDocs}</Link>
                            </TableCell>
                            <TableCell sx={lastCellStyle}>
                                <Button variant="contained" size="small" onClick={() => onAgree(row.email)} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>
                                    Fullfill
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            );
        case 2:
            return (
                <TableBody>
                    {registrationData.map((row) => (
                        <TableRow 
                            key={row.email}
                            sx={{ '&:nth-of-type(odd)': { backgroundColor: stripeColor } }}>
                            <TableCell sx={firstCellStyle}>{row.email}</TableCell>
                            <TableCell sx={cellStyle}>{row.name}</TableCell>
                            <TableCell sx={cellStyle}>{row.companyName}</TableCell>
                            <TableCell sx={cellStyle}><StatusBubble status={row.verificationStatus} /></TableCell>
                            <TableCell sx={lastCellStyle}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="contained" color="success" size="small" onClick={() => onVerify(row.email, 'Verified')} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>
                                        Verify
                                    </Button>
                                    <Button variant="contained" color="error" size="small" onClick={() => onVerify(row.email, 'Rejected')} sx={{ textTransform: 'none', fontSize: '0.7rem' }}>
                                        Reject
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            );
        default:
            return <TableBody><TableRow><TableCell>No Data Found</TableCell></TableRow></TableBody>
    }
};


const VendorManagement = () => {
    
    const [activeTab, setActiveTab] = useState(0);
    const [agreementData, setAgreementData] = useState<vendorAgreement[]>(vendorAgreementData.vendoragreement);
    const [registrationData, setRegistrationData] = useState<vendorRegistration[]>(vendorRegistrationData.vendorRegistration);
    
    const handleAgreement = (email: string) => {
        setAgreementData(prevData => 
            prevData.map(vendor =>
                vendor.email === email ? { ...vendor, agreementStatus: 'Fulfilled' } : vendor
            )
        );
    };

    const handleVerification = (email: string, newStatus: 'Verified' | 'Rejected') => {
        setRegistrationData(prevData => 
            prevData.map(vendor => 
                vendor.email === email ? { ...vendor, verificationStatus: newStatus} : vendor
            )
        );
    };

    const handleTabChange = (event : React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const tabTitles = [
        'Manage Device Certification',
        'Manage Vendor Agreement',
        'Manage Vendor Registration',
    ];

    const getHeaders = (tabIndex: number) => {
        switch (tabIndex) {
            case 0: return ['Request ID', 'Type', 'Device Manufacturer', 'Device Model', 'Device Market', 'Device Submitted', 'Status', 'Data Certified', 'Submitter ID'];
            case 1: return ['Email', 'Name', 'Company Name', 'Verification Status', 'TOC Status', 'Agreement Status', 'View Agreement', 'Agreement Action'];
            case 2: return ['Email', 'Name', 'Company Name', 'Verification Status', 'Verification Action'];
            default: return [];
        }
    }

    return (
        <div className="min-h-screen bg-[#282828] text-white">
            <Header />

            <main className="container mx-auto p-8">
                {/* breadcrumbs */}
                <DynamicBreadcrumb />

                {/* page title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold'}}>
                        Vendor Management
                    </Typography>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: '50%'}} />
                </Box>

                {/* table */}
                <Paper sx={{ mt: 2, p : 1.5, backgroundColor: '#343536', borderRadius: 2 }}>
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
                            <Table aria-label="vendor data table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#746fa7'}}>
                                        {getHeaders(activeTab).map((headCell) => (
                                            <TableCell 
                                                key={headCell}
                                                sx={{ 
                                                    color: 'white', 
                                                    fontWeight: 'semi-bold', 
                                                    borderBottom: 'none', 
                                                    fontSize: '0.75rem', 
                                                    padding: '12px'}}>
                                                {headCell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <ConditionalTable 
                                    activeTab={activeTab}
                                    agreementData={agreementData}
                                    registrationData={registrationData}
                                    onAgree={handleAgreement}
                                    onVerify={handleVerification}
                                />
                            </Table>
                        </TableContainer>
                    </Box>
                </Paper>            
            </main>    
        </div>
    );
};

export default VendorManagement;