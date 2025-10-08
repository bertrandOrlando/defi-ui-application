import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemText,

  Dialog,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "../component/header"


interface Permission {
  group: string;
  name: string;
}

const permissionsData = [
  {
    group: "Reporting & Analytics",
    items: [
      "Reporting & Analytics View",
      "Analytics Log",
      "Analytics Administrator",
    ],
  },
  {
    group: "Service Assurance",
    items: ["Service Assurance View", "Service Assurance Analytics"],
  },
  {
    group: "Network Planning",
    items: ["Network Planning View"],
  },
  {
    group: "Service Flow Design",
    items: ["Service Flow Design View"],
  },
  {
    group: "Policy Configuration",
    items: ["Policy Configuration View"],
  },
];

export default function CreateUserGroup() {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<Permission[]>([
    { group: "Reporting & Analytics", name: "Reporting & Analytics View" },
    { group: "Reporting & Analytics", name: "Analytics Log" },
    { group: "Network Planning", name: "Network Planning View" },
  ]);

  const [successOpen, setSuccessOpen] = useState(false);
  const [tempCount, setTempCount] = useState(0);


  const handleToggle = (group: string, name: string) => {//cek box
    const exists = selected.some((p) => p.group === group && p.name === name);
    if (exists) {
      setSelected(
        selected.filter((p) => !(p.group === group && p.name === name))
      );
    } else {
      //Jika belum ada, tambahkan permission baru
      setSelected([...selected, { group, name }]);
    }
  };

  const handleRemove = (group: string, name: string) => {
    setSelected(
      selected.filter((p) => !(p.group === group && p.name === name))
    );
  };

  const handleClearAll = () => setSelected([]);

  const handleSubmit = () => {
  const count = selected.length; 
  setSuccessOpen(true);
  setTempCount(count); 
  setSelected([]);
};


  return (
    <Box
      sx={{
        bgcolor: "#121212",
        color: "white",
        width: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",
        p: 3,
        boxSizing: "border-box",
      }}
    >
             <Header />
         <Typography variant="body2" color="gray" sx={{ mt: 2, mb: 1 }}>
            Dashboard / User Management <span style={{ color: "#f39c12" }}>/ Create New User Group</span>
          </Typography>
    

      <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "white" }}>
        Create New User Group
      </Typography>

      {/* Flex container */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
        {/* Left Panel */}
        <Box flex={1}>
          <Card sx={{ bgcolor: "#1e1e1e", p: 2 }}>
            <Typography variant="subtitle1" mb={2} sx={{ color: "white" }}>
              User Group Name
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
              }}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="subtitle1" sx={{ color: "white" }}>
                Permission Preview
              </Typography>
              <Button onClick={handleClearAll} sx={{ color: "white" }}>
                Clear All
              </Button>
            </Box>

            <Box sx={{ bgcolor: "#121212", p: 2, borderRadius: 1 }}>
              {selected.map((perm, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1, borderBottom: "1px solid #333", pb: 1 }}
                >
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {perm.group} - {perm.name}
                  </Typography>
                  {/* hapus permission yang udah ada di preview */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(perm.group, perm.name)}
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button sx={{ color: "#fff", mr: 2 }}>Cancel</Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Right Panel */}
        <Box flex={1}>
          <Card sx={{ bgcolor: "#1e1e1e", p: 2 }}>
            <Typography variant="subtitle1" mb={2} sx={{ color: "white" }}>
              Permissions Group & Name
            </Typography>
            <TextField
              placeholder="Search by Group Name"
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#666" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
              }}
            />

            <List>
              {permissionsData.map((group, i) => (
                <Box key={i} sx={{ bgcolor: "#2a2a2a", mb: 2, borderRadius: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      bgcolor: "#1976d2",
                      p: 1,
                      borderRadius: "4px 4px 0 0",
                      color: "white",
                    }}
                  >
                    {group.group}
                  </Typography>
                  {group.items.map((item, idx) => (
                   <ListItem
  key={idx}
  secondaryAction={
    <Checkbox
      edge="end"
      checked={selected.some(
        (p) => p.group === group.group && p.name === item
      )}
      onChange={() => handleToggle(group.group, item)}
      sx={{ color: "white" }}
    />
  }
>
  <ListItemText
    primary={item}
    primaryTypographyProps={{ style: { color: "white" } }}
  />
</ListItem>

                  ))}
                </Box>
              ))}
            </List>
          </Card>
        </Box>
      </Box>

      {/* Popup Success */}
      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#2c2c2c",
            color: "white",
            borderRadius: 2,
            minWidth: 400,
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <DialogContent>
          <CheckCircleIcon sx={{ fontSize: 60, color: "limegreen", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            User group has been added
          </Typography>
         <Typography variant="body2" color="gray">
   <b>{groupName}</b> Role has been added with {tempCount} permissions.
</Typography>

        </DialogContent>
      </Dialog>
    </Box>
  );
}
