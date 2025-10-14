import { Box, TextField} from "@mui/material";
import UserWidget from "./UserWidget";
import SystemWidget from "./SystemWidget";
import PerformanceWidget from "./PerformanceWidget";
import AlarmsWidget from "./AlarmsWidget";

const CenterGrid = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* search bar */}
            <Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="search"
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#555' },
                            '&:hover fieldset': { borderColor: '#777' },
                            '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                        },
                    }}
                />
            </Box>

            {/* mid widget */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                }}
            >
                <Box sx={{ flexGrow: 1, minWidth: '300px', flexBasis: {xs: '100%', md: '30%' } }}>
                    <UserWidget />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: '300px', flexBasis: {xs: '100%', md: '60%' } }}>
                    <SystemWidget />
                </Box>
            </Box>
            
            {/* bottom widget */}
            <Box sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,    
                }}
            >
                <Box sx={{ flexGrow: 1, minWidth: '300px', flexBasis: {xs: '100%', md: '50%' } }}>
                    <PerformanceWidget />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: '300px', flexBasis: {xs: '100%', md: '40%' } }}>
                    <AlarmsWidget />
                </Box>
            </Box>
        </Box>
    );
};

export default CenterGrid;