// ** React Imports
import { useState, useEffect, useCallback, useRef } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";
import UserDialog from "./components/Dialog";

// ** Icon Imports
import Icon from "src/@core/components/icon";

//Api imports
import { getDevices } from "src/api/device";

// ** Custom Table Components Imports
import TableHeader from "./components/TableHeader";
import AddUserDrawer from "./components/AddDeviceDrawer";
import { convertTime } from "src/utils/base";

const RowOptions = ({ row, setRow, setOpenUpdate, setOpenDelete }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
    setRow(row);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleRowOptionsClose();
    setOpenDelete(true);
  };
  const handleUpdate = () => {
    handleRowOptionsClose();
    setOpenUpdate(true);
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
        <MenuItem onClick={handleUpdate} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:edit" fontSize={20} />
          Cập nhật
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:trash" fontSize={20} />
          Xoá
        </MenuItem>
      </Menu>
    </>
  );
};

const DeviceList = () => {
  //Data column
  const columns = [
    {
      flex: 0.1,
      minWidth: 150,
      field: "mac",
      headerName: "Địa chỉ MAC",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.mac}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: "describe",
      headerName: "Mô tả",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.describe}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: "createdAt", // Corrected field name
      headerName: "Ngày tạo",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {convertTime(row.createdAt)}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      sortable: false,
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: "Thao tác",
      renderCell: ({ row }) => (
        <RowOptions
          row={row}
          setRow={setRow}
          setOpenUpdate={setOpenUpdate}
          setOpenDelete={setOpenDelete}
        />
      ),
    },
  ];

  // ** State
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [row, setRow] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const valueRef = useRef(null);

  // ** Hooks
  const fetchData = useCallback(async () => {
    try {
      const response = await getDevices();
      setRowData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Danh sách thiết bị" />
          <Divider sx={{ m: "0 !important" }} />
          <TableHeader toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={rowData}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <AddUserDrawer
        fetchData={fetchData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />
      <UserDialog
        openUpdate={openUpdate}
        toggleUpdate={setOpenUpdate}
        row={row}
        refresh={fetchData}
        openDelete={openDelete}
        toggleDelete={setOpenDelete}
      ></UserDialog>
    </Grid>
  );
};

export default DeviceList;
