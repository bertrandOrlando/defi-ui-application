import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Header from "../component/header"
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";

import userData from "../data/users.json";
import roleData from "../data/roles.json";

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

interface RawUser {
  userId: string;
  name?: string;
  email: string;
  roleId: string | number;
  updatedBy: string;
  lastSignIn?: string;
  isDeleted?: string | boolean;
}

interface User {
  id: string;
  name?: string;
  email: string;
  roleId: string;
  updatedBy: string;
  updatedAt: string;
}

interface Role {
  roleId: string;
  roleName: string;
}

interface Permission {
  group: string;
  name: string;
}

const roles: Role[] = roleData.roles || [];

const parsedDate = (dateInput?: string) => {
  if (!dateInput) return new Date();
  const parts = dateInput.split("-");
  if (parts.length !== 3) return new Date();
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
};

const loadedUsers = (userData.users || []) as RawUser[];

const finalUsers: User[] = loadedUsers
  .filter((u) => {
    if (u.isDeleted === undefined) return true;
    return u.isDeleted === "false" || u.isDeleted === false;
  })
  .map((u) => ({
    id: String(u.userId),
    name: u.name,
    email: u.email,
    roleId: String(u.roleId),
    updatedBy: u.updatedBy,
    updatedAt: parsedDate(u.lastSignIn).toISOString(),
  }));

export default function UserManagement() {
  const [tab, setTab] = useState<number>(0);
  
  // User Management States
  const [users, setUsers] = useState<User[]>(finalUsers);
  const [userSearch, setUserSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [userSuccessOpen, setUserSuccessOpen] = useState(false);
  const [addedUser, setAddedUser] = useState<{
    email: string;
    roleId: string;
  } | null>(null);
  const [userErrorOpen, setUserErrorOpen] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");

  // User Group Management States
  const [groups, setGroups] = useState<Role[]>(roles);
  const [groupSearch, setGroupSearch] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<Permission[]>([]);
  const [groupSuccessOpen, setGroupSuccessOpen] = useState(false);
  const [tempCount, setTempCount] = useState(0);
  const [createdGroupName, setCreatedGroupName] = useState("");
  const [groupErrorOpen, setGroupErrorOpen] = useState(false);
  const [groupErrorMessage, setGroupErrorMessage] = useState("");

  // User Management Handlers
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleAddUser = () => {
    if (email && roleId) {
      // Check if email already exists
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        setUserErrorMessage(`Email "${email}" sudah terdaftar. Gunakan email yang berbeda.`);
        setUserErrorOpen(true);
        return;
      }

      const nextId = (users.length + 1).toString().padStart(3, "0");
      const newUser: User = {
        id: nextId,
        name: email.split("@")[0],
        email,
        roleId,
        updatedBy: "Alice Johnson",
        updatedAt: new Date().toISOString(),
      };

      setUsers([...users, newUser]);
      setAddedUser({ email, roleId });
      setOpen(false);
      setUserSuccessOpen(true);

      setEmail("");
      setRoleId("");
      setUserSearch("");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setRoleId("");
  };

  const getRoleName = (id: string) => {
    const r = roles.find((role) => role.roleId === id);
    return r ? r.roleName : "Unknown";
  };

  // User Group Management Handlers
  const handleDelete = (roleId: string) => {
    setGroups(groups.filter((g) => g.roleId !== roleId));
  };

  const handleEdit = (roleName: string, index: number) => {
    setEditIndex(index);
    setEditValue(roleName);
  };

  const handleSaveEdit = (index: number) => {
    // Check if new name already exists (excluding current group)
    const nameExists = groups.some(
      (g, i) => i !== index && g.roleName.toLowerCase() === editValue.toLowerCase()
    );

    if (nameExists) {
      setGroupErrorMessage(`User Group "${editValue}" sudah ada. Gunakan nama yang berbeda.`);
      setGroupErrorOpen(true);
      return;
    }

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
    // Check if group name is empty
    if (!groupName.trim()) {
      setGroupErrorMessage("Nama User Group tidak boleh kosong.");
      setGroupErrorOpen(true);
      return;
    }

    // Check if group name already exists
    const nameExists = groups.some(
      (g) => g.roleName.toLowerCase() === groupName.toLowerCase()
    );

    if (nameExists) {
      setGroupErrorMessage(`User Group "${groupName}" sudah ada. Gunakan nama yang berbeda.`);
      setGroupErrorOpen(true);
      return;
    }

    const count = selected.length;
    const newRoleId = (groups.length + 1).toString();

    const newGroup: Role = {
      roleId: newRoleId,
      roleName: groupName,
    };

    setGroups([...groups, newGroup]);
    setTempCount(count);
    setCreatedGroupName(groupName);
    setGroupSuccessOpen(true);
    setCreateOpen(false);
    setSelected([]);
    setGroupName("");
  };

  const filteredGroups = groups.filter((g) =>
    g.roleName.toLowerCase().includes(groupSearch.toLowerCase())
  );

return (
    <Box
      sx={{
        bgcolor: "#121212",
        width: "100%",
        maxWidth: "100vw",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        m: 0,
        p: 0,
        overflowX: "hidden",
        position: "relative",
      }}
    >
         <Header />
      
  <main className="container mx-auto p-1">
</main>
 {/* Breadcrumb + Title */}
      <div className="px-4">
        <div className="flex flex-col gap-1">
          <DynamicBreadcrumb />
            <Typography variant="h5" sx={{ mt: 1, mb: 3, fontWeight: "bold" }}>
          User Management <span style={{ color: "limegreen" }}>●</span>
        </Typography>

        </div>
      </div>



      
      <Box sx={{ flex: 1, p: 3, overflow: "auto", color: "#fff" }}>
  
       
        <Tabs
          value={tab}
          onChange={(_event: React.SyntheticEvent, newValue: number) => {
            setTab(newValue);
          }}
          sx={{ mb: 2 }}
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

        {/* User Management Tab */}
        {tab === 0 && (
          <Box
            sx={{
              mt: 2,
              bgcolor: "#2d2d2e",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                User Management
              </Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  size="small"
                  placeholder="Search by Email"
                  variant="outlined"
                  value={userSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserSearch(e.target.value)
                  }
                  sx={{
                    input: { color: "white" },
                    bgcolor: "#2a2a2a",
                    borderRadius: 1,
                    width: 300,
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
                  sx={{ bgcolor: "#1976d2", textTransform: "none" }}
                  onClick={() => setOpen(true)}
                >
                  Add New User
                </Button>
              </Box>
            </Box>

            <TableContainer
              sx={{
                bgcolor: "#1e1e1e",
                border: "1px solid #333",
                borderRadius: "10px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#8a5480" }}>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      USER EMAIL
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      ROLE
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        borderBottom: "none",
                      }}
                    >
                      UPDATE BY
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        borderBottom: "none",
                      }}
                    >
                      DELETE USER
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .filter((u) =>
                      u.email.toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map((user, index) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          bgcolor: index % 2 === 0 ? "#343536" : "transparent",
                          borderRadius: "10px",
                        }}
                      >
                        <TableCell
                          sx={{ color: "white", borderBottom: "none" }}
                        >
                          {user.email}
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", borderBottom: "none" }}
                        >
                          {getRoleName(user.roleId)}
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", borderBottom: "none" }}
                        >
                          {user.updatedBy} on{" "}
                          {new Date(user.updatedAt).toLocaleString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            borderBottom: "none",
                          }}
                        >
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* User Group Management Tab */}
        {tab === 1 && (
          <Box sx={{ bgcolor: "#1e1e1e", borderRadius: "12px", p: 3 }}>
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
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
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
        )}
      </Box>

      {/* Add New User Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: "#2c2c2c",
            color: "white",
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#1e1e1e", color: "white" },
            }}
            InputLabelProps={{
              style: { color: "gray" },
            }}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Select Group User"
            variant="filled"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#1e1e1e", color: "white" },
            }}
            InputLabelProps={{
              style: { color: "gray" },
            }}
          >
            {roles.map((r) => (
              <MenuItem key={r.roleId} value={r.roleId}>
                {r.roleName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              bgcolor: "#1e1e1e",
              color: "white",
              "&:hover": { bgcolor: "#2a2a2a" },
            }}
          >
            Close
          </Button>
          <Button onClick={handleAddUser} variant="contained" color="primary">
            Add New User
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Success Dialog */}
      <Dialog
        open={userSuccessOpen}
        onClose={() => setUserSuccessOpen(false)}
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
            User has been added
          </Typography>
          {addedUser && (
            <Typography variant="body2" color="gray">
              Email <b>{addedUser.email}</b> has been added as{" "}
              <b>{getRoleName(addedUser.roleId)}</b> Role
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* User Error Dialog */}
      <Dialog
        open={userErrorOpen}
        onClose={() => setUserErrorOpen(false)}
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
          <ErrorOutlineIcon sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
          <Typography variant="h6" gutterBottom color="white">
            Gagal Menambahkan User
          </Typography>
          <Typography variant="body2" color="gray">
            {userErrorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setUserErrorOpen(false)}
            variant="contained"
            sx={{ bgcolor: "#1976d2" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group Detail Dialog */}
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
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            color: "white",
            m: 0,
            p: 0,
          },
        }}
      >
        <DialogContent>
          <Box sx={{ ml: -2 }}>
         <Header />
        </Box>
        <main className="container mx-auto p-1">
                 <Typography variant="body2" color="white" sx={{ mt: 2, mb: 1 }}>
            Dashboard / User Management <span style={{ color: "#f39c12" }}>/ Create New User Group</span>
          </Typography>
         <Typography variant="h5" sx={{ mt: 1, mb: 3, fontWeight: "bold" }}>           
         Create New User Group 
          </Typography>
             
        </main>

          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
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

            <Box flex={1}>
             <Card sx={{ bgcolor: "#1e1e1e", p: 2, color: "white" }}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
    }}
  >
    <Typography variant="subtitle1" color="white">
      Permissions Group & Name
    </Typography>

    {/* Search Field */}
    <TextField
      size="small"
      placeholder="Search by Group Name"
      value={groupSearch}
      onChange={(e) => setGroupSearch(e.target.value)}
      sx={{
        bgcolor: "#2d2d2d",
        borderRadius: 1,
        width: 250,
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
  </Box>

  <List>
    {permissionsData
      .filter((group) =>
        group.group.toLowerCase().includes(groupSearch.toLowerCase())
      )
      .map((group, i) => (
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
        </DialogContent>
      </Dialog>

      {/* Group Success Dialog */}
      <Dialog
        open={groupSuccessOpen}
        onClose={() => setGroupSuccessOpen(false)}
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

      {/* Group Error Dialog */}
      <Dialog
        open={groupErrorOpen}
        onClose={() => setGroupErrorOpen(false)}
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
          <ErrorOutlineIcon sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
          <Typography variant="h6" gutterBottom color="white">
            Gagal Membuat User Group
          </Typography>
          <Typography variant="body2" color="gray">
            {groupErrorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setGroupErrorOpen(false)}
            variant="contained"
            sx={{ bgcolor: "#1976d2" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}