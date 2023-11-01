// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import CustomTextField from "src/@core/components/mui/text-field";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

//Api imports
import { getUsers } from "src/api/user";

// ** Custom Table Components Imports
import TableHeader from "./components/TableHeader";
import AddUserDrawer from "./components/AddUserDrawer";

// ** renders client column
const userRoleObj = {
  manager: { icon: "tabler:device-laptop", color: "secondary" },
  operator: { icon: "tabler:chart-pie-2", color: "primary" },
};

// ** renders client column
const renderClient = (row) => {
  if (row.avatar) {
    return (
      <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    );
  } else {
    return (
      <CustomAvatar
        skin="light"
        color={row.avatarColor}
        sx={{
          mr: 2.5,
          width: 38,
          height: 38,
          fontWeight: 500,
          fontSize: (theme) => theme.typography.body1.fontSize,
        }}
      >
        {getInitials(row.username ? row.username : "John Doe")}
      </CustomAvatar>
    );
  }
};

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteUser(id));
    handleRowOptionsClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="tabler:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem
          component={Link}
          sx={{ "& svg": { mr: 2 } }}
          href="/apps/user/view/account"
          onClick={handleRowOptionsClose}
        >
          <Icon icon="tabler:eye" fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:edit" fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:trash" fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: "username",
    headerName: "User Name",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderClient(row)}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {row.username}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: "email",
    headerName: "Email",
    renderCell: ({ row }) => {
      return (
        <Typography
          noWrap
          sx={{
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          {row.email}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "role",
    minWidth: 170,
    headerName: "Role",
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomAvatar
            skin="light"
            sx={{ mr: 4, width: 30, height: 30 }}
            color={userRoleObj[row.role].color || "primary"}
          >
            <Icon icon={userRoleObj[row.role].icon} />
          </CustomAvatar>
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            {row.role}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: "createdAt", // Corrected field name
    headerName: "Ngày tạo",
    renderCell: ({ row }) => {
      const date = new Date(row.createdAt);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      return (
        <Typography
          noWrap
          sx={{
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          {formattedDate}
        </Typography>
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
];

const UserList = () => {
  // ** State
  const [value, setValue] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // ** Hooks
  const fetchData = useCallback(async () => {
    try {
      const response = await getUsers();
      setRowData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Search Filters" />
          <Divider sx={{ m: "0 !important" }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={rowData}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default UserList;
