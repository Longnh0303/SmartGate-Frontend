// ** React Imports
import { useState, useEffect, useCallback, useRef } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { DataGrid } from "@mui/x-data-grid";

//Api imports
import { getHistory } from "src/api/history";

// ** Custom Table Components Imports
import TableHeader from "./components/TableHeader";
import { convertTime } from "src/utils/base";

const userRoleObj = {
  teacher: { title: "Giảng viên" },
  student: { title: "Sinh viên" },
  employee: { title: "Nhân viên" },
  guest: { title: "Khách" },
};

const HistoryList = () => {
  //Data column
  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      field: "CarId",
      headerName: "Mã thẻ",
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
      flex: 0.15,
      minWidth: 150,
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
      flex: 0.15,
      minWidth: 150,
      field: "role",
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
            {row.role ? userRoleObj[row.role].title : ""}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 200,
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
            {row.done ? `${row.new_balance} VNĐ` : `${row.old_balance} VNĐ`}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: "gate_in",
      headerName: "Cổng vào",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.gateIn ? row.gateIn : ""}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: "gate_out",
      headerName: "Cổng ra",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.gateOut ? row.gateOut : "Chưa ra"}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: "check_in",
      headerName: "Thời gian vào",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {convertTime(row.time_check_in)}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      field: "check_out",
      minWidth: 180,
      headerName: "Thời gian ra",
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {row.time_check_out ? convertTime(row.time_check_in) : "Chưa ra"}
          </Typography>
        );
      },
    },
  ];

  // ** State
  const [value, setValue] = useState("");
  const [rowData, setRowData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const valueRef = useRef(null);

  // ** Hooks
  const fetchData = useCallback(async () => {
    try {
      const params = { searchTerm: valueRef.current };
      const response = await getHistory(params);
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

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Lịch sử vào/ra" />
          <Divider sx={{ m: "0 !important" }} />
          <TableHeader value={value} handleFilter={handleFilter} />
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
    </Grid>
  );
};

HistoryList.acl = {
  action: "read",
  subject: "history-page",
};

export default HistoryList;
