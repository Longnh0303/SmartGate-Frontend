// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

const TableHeader = (props) => {
  // ** Props
  const { handleFilter, toggle, value } = props;

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
        Thêm người dùng
      </Button>
      <Box
        sx={{
          rowGap: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder="Tìm kiếm"
          onChange={(e) => handleFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: "flex" }}>
                <Icon fontSize="1.25rem" icon="tabler:search" />
              </Box>
            ),
            endAdornment: (
              <IconButton
                size="small"
                title="Clear"
                aria-label="Clear"
                onClick={() => {
                  handleFilter("");
                }}
              >
                <Icon fontSize="1.25rem" icon="tabler:x" />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default TableHeader;
