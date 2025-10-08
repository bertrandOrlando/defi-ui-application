import { Box, MenuItem, Select, Typography } from "@mui/material";

const AlarmsWidget = () => {
    const selectStyles = {
        backgroundColor: '#2D2D2E',
        color: 'white',
        borderRadius: 2,
        '.MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
        '& .MuiSvgIcon-root': { color: 'white' },
        height: '40px',
    };

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
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#e5e7eb' }}>
                Alarms
            </Typography>

            {/* dropdown */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Select defaultValue="severity" size="small" sx={selectStyles}>
                    <MenuItem value="severity">Select Severity</MenuItem>
                </Select>
                <Select defaultValue="node" size="small" sx={selectStyles}>
                    <MenuItem value="node">Select Node Type</MenuItem>
                </Select>
            </Box>

            {/* chart */}
            <Box sx={{ bgcolor: '#2D2D2E', p: 2, borderRadius: 2 }}>
                <Typography sx={{ color: '#888' }}>
                    charts
                </Typography>
            </Box>
        </Box>
    );
};

export default AlarmsWidget;