import { Box, Button, Container, Typography } from "@mui/material";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import { Link } from "react-router-dom";
import Header from "../component/header";

const OutOfScopePage = ({ pageName = "This page" }) => {
  return (
    <>
    <Header className="fixed"/>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#282828",
          color: "#ffffff",
          textAlign: "center",
          p: 3,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <BuildCircleOutlinedIcon
              sx={{ fontSize: "6rem", color: "rgba(255, 255, 255, 0.5)" }}
            />
          </Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Feature Not Available
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mb: 4,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            The <strong>{pageName}</strong> feature is currently out of scope.
            It was not included in the project requirements and has not been
            developed.
          </Typography>
          <Button
            component={Link}
            to="/dashboard"
            variant="outlined"
            size="large"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.5)",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Return to Dashboard
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default OutOfScopePage;
