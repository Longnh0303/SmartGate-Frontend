// ** React Imports
import { useState, useEffect, useCallback, useRef } from "react";

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
import { DataGrid } from "@mui/x-data-grid";
import UserDialog from "./components/Dialog";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

//Api imports
import { getRfid } from "src/api/rfid";
// ** Custom Table Components Imports
import TableHeader from "./components/TableHeader";
import AddUserDrawer from "./components/AddRfidDrawer";
import { convertTime } from "src/utils/base";

// ** renders client column
const userRoleObj = {
  teacher: { title: "Giảng viên" },
  student: { title: "Sinh viên" },
  employee: { title: "Nhân viên" },
  guest: { title: "Khách" },
};

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

const RfidList = () => {
  //Data column
  const columns = [
    {
      flex: 0.1,
      minWidth: 150,
      field: "cardId",
      headerName: "Id Thẻ",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.cardId}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 140,
      field: "balance",
      headerName: "Số dư",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.balance} VNĐ
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: "name",
      headerName: "Chủ thẻ",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      field: "role",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      headerName: "Loại thẻ",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {userRoleObj[row.role].title}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      field: "department",
      minWidth: 200,
      headerName: "Khoa/Phòng",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.department}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      field: "usercode",
      minWidth: 160,
      headerName: "Mã sinh viên/nhân viên",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.usercode}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      field: "carInfo",
      minWidth: 200,
      headerName: "Phương tiện",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.carInfo}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      field: "carColor",
      minWidth: 100,
      headerName: "Màu xe",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.carColor}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      field: "licensePlates",
      minWidth: 140,
      headerName: "Biển số xe",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.licensePlates}
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
  const [value, setValue] = useState("");
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
      const params = { searchTerm: valueRef.current };
      const response = await getRfid(params);
      setRowData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueRef.current]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = useCallback((val) => {
    setValue(val);
    valueRef.current = val;
}, []);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Danh sách thẻ RFID" />
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

export default RfidList;
