const columns = [
  {
    flex: 0.25,
    minWidth: 290,
    field: "full_name",
    headerName: "Name",
    renderCell: (params) => {
      const { row } = params;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderClient(params)}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {row.full_name}
            </Typography>
            <Typography noWrap variant="caption">
              {row.email}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.175,
    type: "date",
    minWidth: 120,
    headerName: "Date",
    field: "start_date",
    valueGetter: (params) => new Date(params.value),
    renderCell: (params) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {params.row.start_date}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 110,
    field: "salary",
    headerName: "Salary",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {params.row.salary}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    field: "age",
    minWidth: 80,
    headerName: "Age",
    renderCell: (params) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {params.row.age}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 140,
    field: "status",
    headerName: "Status",
    renderCell: (params) => {
      const status = statusObj[params.row.status];

      return (
        <CustomChip
          rounded
          size="small"
          skin="light"
          color={status.color}
          label={status.title}
          sx={{ "& .MuiChip-label": { textTransform: "capitalize" } }}
        />
      );
    },
  },
  {
    flex: 0.125,
    minWidth: 140,
    field: "actions",
    headerName: "Actions",
    renderCell: (params) => {
      return (
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => getFullName(params)}
        >
          Get Name
        </Button>
      );
    },
  },
];

export default columns;
