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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../component/header"
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";

// data
import userData from "../data/users.json";
import roleData from "../data/roles.json";

//users dari file json
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

const roles: Role[] = (roleData as any).roles || [];

const parsedDate = (dateInput?: string) => {
  if (!dateInput) return new Date();
  const parts = dateInput.split("-");
  if (parts.length !== 3) return new Date();
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
};

const loadedUsers = ((userData as any).users || []) as RawUser[];

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
  const [users, setUsers] = useState<User[]>(finalUsers);
  const [search, setSearch] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [addedUser, setAddedUser] = useState<{ email: string; roleId: string } | null>(
    null
  );

  const navigate = useNavigate();

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleAddUser = () => {
    if (email && roleId) {//Kalau salah satunya kosong, user tidak ditambahkan.
      const nextId = (users.length + 1).toString().padStart(3, "0");
      const newUser: User = {
        id: nextId,
        name: email.split("@")[0], // default nama
        email,
        roleId,
        updatedBy: "Alice Johnson",
        updatedAt: new Date().toISOString(),
      };

      setUsers([...users, newUser]);
      setAddedUser({ email, roleId });
      setOpen(false);
      setSuccessOpen(true);

      setEmail("");
      setRoleId("");
      setSearch("");
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

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        width: "100vw",
        height: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        m: 0,
        p: 0,
        overflowX: "hidden",
      }}
    >

       <Header />
       <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 5, mt: 1 }}>
  <DynamicBreadcrumb />
</Box>
      {/* Content container */}
      <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>

        {/* Page Title */}
        <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
          User Management <span style={{ color: "limegreen" }}>●</span>
        </Typography>
        

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_event: React.SyntheticEvent, newValue: number) => {//_event: _ artinya parameter itu tidak dipakai.
            setTab(newValue);
            if (newValue === 1) {
              navigate("/user-group-management");
            }else{
                 setTab(newValue); 
            }
          }}
          sx={{ mt: 2 }}//margin-top.
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

        {/* User Management */}
        {tab === 0 && (
          <Box
            sx={{
              mt: 2,
              bgcolor: "#1e1e1e",
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
  {/* Label kiri */}
  <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
    User Management
  </Typography>

  {/* Bagian kanan (Search + Button) */}
  <Box display="flex" alignItems="center" gap={2}>
    <TextField
      size="small"
      placeholder="Search by Email"
      variant="outlined"
      value={search}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value)
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


            {/* Table */}
            <TableContainer
              sx={{
                bgcolor: "#1e1e1e",
                border: "1px solid #333",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#7b1fa2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      USER EMAIL
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      ROLE
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      UPDATE BY
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      DELETE USER
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .filter((u) =>
                      u.email.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          bgcolor: "#2a2a2a",
                          "&:nth-of-type(even)": { bgcolor: "#252525" },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>
                          {user.email}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {getRoleName(user.roleId)}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {user.updatedBy} on{" "}
                          {new Date(user.updatedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
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
      </Box>

      {/* Popup Add New User */}
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
    </Box>
  );
}
