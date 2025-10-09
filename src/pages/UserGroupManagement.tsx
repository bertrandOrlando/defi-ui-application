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
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../component/header";
import roleData from "../data/roles.json";

interface Role {
  roleId: string;
  roleName: string;
}

const roles: Role[] = (roleData as any).roles || [];

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
  { group: "Network Planning", items: ["Network Planning View"] },
  { group: "Service Flow Design", items: ["Service Flow Design View"] },
  { group: "Policy Configuration", items: ["Policy Configuration View"] },
];

interface Permission {
  group: string;
  name: string;
}

export default function UserGroupManagement() {
  const [tab,] = useState(1);
  const [groups, setGroups] = useState<Role[]>(roles);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Create Group Dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<Permission[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [tempCount, setTempCount] = useState(0);
  const [createdGroupName, setCreatedGroupName] = useState("");

  const handleDelete = (roleId: string) => {
    setGroups(groups.filter((g) => g.roleId !== roleId));
  };

  const handleEdit = (roleName: string, index: number) => {
    setEditIndex(index);
    setEditValue(roleName);
  };

  const handleSaveEdit = (index: number) => {
    const updated = [...groups];
    updated[index].roleName = editValue;
    setGroups(updated);
    setEditIndex(null);
    setEditValue("");
  };

  const handleViewDetail = (role: Role) => {
    setSelectedRole(role);
    setDetailOpen(true);
  };

  const handleToggle = (group: string, name: string) => {
    const exists = selected.some((p) => p.group === group && p.name === name);
    if (exists) {
      setSelected(selected.filter((p) => !(p.group === group && p.name === name)));
    } else {
      setSelected([...selected, { group, name }]);
    }
  };

  const handleRemove = (group: string, name: string) => {
    setSelected(selected.filter((p) => !(p.group === group && p.name === name)));
  };

  const handleClearAll = () => setSelected([]);

  const handleSubmit = () => {
    const count = selected.length;
    const newRoleId = (groups.length + 1).toString();

    const newGroup: Role = {
      roleId: newRoleId,
      roleName: groupName,
    };

    setGroups([...groups, newGroup]);
    setTempCount(count);
    setCreatedGroupName(groupName);
    setSuccessOpen(true);
    setCreateOpen(false);
    setSelected([]);
    setGroupName("");
  };

  const filteredGroups = groups.filter((g) =>
    g.roleName.toLowerCase().includes(search.toLowerCase())
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
      <Box sx={{ p: 3 }}>
        <Header />
        <Typography variant="body2" color="white" sx={{ mt: 3, mb: 1 }}>
          Dashboard / <span style={{ color: "#f39c12" }}>User Management</span>
        </Typography>
        <Typography variant="h5" sx={{ mt: 3, mb: 4, fontWeight: "bold" }}>
          User Management <span style={{ color: "limegreen" }}>●</span>
        </Typography>

        {/* Tabs */}
        <Box sx={{ bgcolor: "#1e1e1e", p: 1, borderRadius: "10px", mb: 3 }}>
          <Tabs value={tab}>
            <Tab
              label="User Management"
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "white",
                  bgcolor: "#1976d2",
                  borderRadius: "6px 6px 0 0",
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
              }}
            />
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ flex: 1, px: 3, pb: 3 }}>
        <Box sx={{ bgcolor: "#1e1e1e", borderRadius: "12px", p: 3 }}>
          {/* Header + Search + Button */}
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
                onClick={() => setCreateOpen(true)}
              >
                Create New User Group
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
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
                          sx={{ bgcolor: "#2d2d2d", input: { color: "white" } }}
                        />
                      ) : (
                        g.roleName
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        sx={{ color: "gray" }}
                        onClick={() => handleViewDetail(g)}
                      >
                        <ArticleIcon />
                      </IconButton>

                      <IconButton
                        sx={{ color: "tomato" }}
                        onClick={() => handleDelete(g.roleId)}
                      >
                        <DeleteIcon />
                      </IconButton>

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
                          onClick={() => handleEdit(g.roleName, i)}
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

      {/* Create Group Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            color: "white",
            borderRadius: 2,
            width: "90vw",
            maxWidth: 1000,
            p: 3,
          },
        }}
      >
        <DialogContent>
          <Typography variant="h4" fontWeight="bold" mb={3} color="white">
            Create New User Group
          </Typography>

          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
            {/* Left */}
            <Box flex={1}>
              <Card sx={{ bgcolor: "#1e1e1e", p: 2, color: "white" }}>
                <Typography variant="subtitle1" mb={2} color="white">
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
                  }}
                />

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1" color="white">
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
                      <Typography variant="body2" color="white">
                        {perm.group} - {perm.name}
                      </Typography>
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
                  <Button sx={{ color: "#fff", mr: 2 }} onClick={() => setCreateOpen(false)}>
                    Cancel
                  </Button>
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

            {/* Right */}
            <Box flex={1}>
              <Card sx={{ bgcolor: "#1e1e1e", p: 2, color: "white" }}>
                <Typography variant="subtitle1" mb={2} color="white">
                  Permissions Group & Name
                </Typography>
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
                            primaryTypographyProps={{
                              style: { color: "white" },
                            }}
                          />
                        </ListItem>
                      ))}
                    </Box>
                  ))}
                </List>
              </Card>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* SUCCESS POPUP */}
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
        <DialogContent sx={{ color: "white" }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: "limegreen", mb: 2 }} />
          <Typography variant="h6" gutterBottom color="white">
            User Group Successfully Added
          </Typography>
          <Typography variant="body1" color="white">
            <b>{createdGroupName}</b> has been created with {tempCount} permissions.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
