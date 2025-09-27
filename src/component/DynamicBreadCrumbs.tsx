import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const pathToTitle = (path: string) => {
    if(!path) return '';
    return path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const DynamicBreadcrumb = () => {
    const location = useLocation();

    const currPage = location.pathname.substring(1); 
    const currTitle = pathToTitle(currPage);

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'white', fontSize: '10px' }}>
            <Link
                component={RouterLink}
                underline="hover"
                color="inherit"
                to="/dashboard"
            >
                Dashboard
            </Link>

            {currPage !== 'dashboard' && (
                <Typography sx={{ color: 'orange', fontSize: '10px'}}>
                    {currTitle}
                </Typography>
            )}
        </Breadcrumbs>
    );
};

export default DynamicBreadcrumb;