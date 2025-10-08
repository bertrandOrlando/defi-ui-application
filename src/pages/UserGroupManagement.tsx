import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../component/header";

// data
import roleData from "../data/roles.json";

interface Role {
  roleId: string;
  roleName: string;
}

const roles: Role[] = roleData.roles || [];

export default function UserGroupManagement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);

  const [groups, setGroups] = useState(
    roles.map((r) => r.roleName) // ambil dari roles.json
  );

  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleDelete = (name: string) => {
    setGroups(groups.filter((g) => g !== name));
  };

  const handleEdit = (name: string, index: number) => {
    setEditIndex(index);
    setEditValue(name);
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...groups];
    updated[index] = editValue;
    setGroups(updated);
    setEditIndex(null);
    setEditValue("");
  };

  const handleViewDetail = (name: string) => {
    const role = roles.find((r) => r.roleName === name);
    setSelectedRole(role || null);
    setDetailOpen(true);
  };

  const filteredGroups = groups.filter((g) =>
    g.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ p: 3, flexShrink: 0, position: "relative" }}>
        <Header />

        {/* Breadcrumb */}
        <Typography variant="body2" color="white" sx={{ mt: 3, mb: 1 }}>
          Dashboard / <span style={{ color: "#f39c12" }}>User Management</span>
        </Typography>

        {/* Page Title */}
        <Typography variant="h5" sx={{ mt: 3, mb: 4, fontWeight: "bold" }}>
          User Management <span style={{ color: "limegreen" }}>●</span>
        </Typography>

        {/* Tabs */}
        <Box
          sx={{
            bgcolor: "#1e1e1e",
            p: 1,
            borderRadius: "10px",
            mb: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              if (v === 0) navigate("/user-management");
            }}
          >
            <Tab
              label="User Management"
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "#1976d2",
                  borderRadius: "6px 6px 0 0",
                },
                "&:hover": {
                  bgcolor: "#2196f3",
                },
              }}
            />
            <Tab
              label="User Group Management"
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "#1976d2",
                  borderRadius: "6px 6px 0 0",
                },
                "&:hover": {
                  bgcolor: "#2196f3",
                },
              }}
            />
          </Tabs>
        </Box>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          px: 3,
          pb: 3,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            bgcolor: "#1e1e1e",
            borderRadius: "12px",
            p: 3,
            height: "100%",
          }}
        >
          {/* Header + Search + Button in one row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              mt: 3,
            }}
          >
            <Typography variant="h6">User Group Management</Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  bgcolor: "#2d2d2d",
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "gray" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  textTransform: "none",
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "#1565c0" },
                }}
                onClick={() => navigate("/create-user-group")}
              >
                Create New User Group
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer
            sx={{
              bgcolor: "#1e1e1e",
              borderRadius: "10px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#8e44ad" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    USER GROUP
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold" }}
                    align="right"
                  >
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGroups.map((g, i) => (
                  <TableRow
                    key={i}
                    sx={{ bgcolor: i % 2 === 0 ? "#2d2d2d" : "#1e1e1e" }}
                  >
                    <TableCell sx={{ color: "white" }}>
                      {editIndex === i ? (
                        <TextField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          size="small"
                          sx={{
                            bgcolor: "#2d2d2d",
                            input: { color: "white" },
                          }}
                        />
                      ) : (
                        g
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {/* Tombol Detail */}
                      <IconButton
                        sx={{ color: "gray" }}
                        onClick={() => handleViewDetail(g)}
                      >
                        <ArticleIcon />
                      </IconButton>

                      {/* Tombol Hapus */}
                      <IconButton
                        sx={{ color: "tomato" }}
                        onClick={() => handleDelete(g)}
                      >
                        <DeleteIcon />
                      </IconButton>

                      {/* Tombol Edit */}
                      {editIndex === i ? (
                        <Button
                          size="small"
                          sx={{ color: "limegreen" }}
                          onClick={() => handleSaveEdit(i)}
                        >
                          Save
                        </Button>
                      ) : (
                        <IconButton
                          sx={{ color: "gray" }}
                          onClick={() => handleEdit(g, i)}
                        >
                          <EditNoteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)}>
        <DialogTitle>User Group Detail</DialogTitle>
        <DialogContent>
          {selectedRole ? (
            <Box>
              <Typography>Role ID: {selectedRole.roleId}</Typography>
              <Typography>Role Name: {selectedRole.roleName}</Typography>
            </Box>
          ) : (
            <Typography>No Data Found</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
