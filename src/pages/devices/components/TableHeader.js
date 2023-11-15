// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// ** Custom Component Import

// ** Icon Imports
import Icon from "src/@core/components/icon";

const TableHeader = (props) => {
  // ** Props
  const { toggle } = props;

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button onClick={toggle} variant="contained" sx={{ "& svg": { mr: 2 } }}>
        <Icon fontSize="1.125rem" icon="tabler:plus" />
        Thêm thiết bị mới
      </Button>
      <Box
        sx={{
          rowGap: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      ></Box>
    </Box>
  );
};

export default TableHeader;
