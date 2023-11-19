// ** MUI Imports
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

// ** Custom Component Import
import Icon from "src/@core/components/icon";
import CustomAvatar from "src/@core/components/mui/avatar";
import OptionsMenu from "src/@core/components/option-menu";

//APi imports
import { useState, useEffect } from "react";
import { getTotalVehicle } from "src/api/statistic";

const CardStatsVertical = () => {
  const [totalMoneyData, setTotalMoneyData] = useState({
    totalCount: 0,
  });

  const [selectedOption, setSelectedOption] = useState("Hôm nay");

  const getTimeRange = (selectedOption) => {
    switch (selectedOption) {
      case "Hôm nay":
        return "daily";
      case "Tháng này":
        return "monthly";
      case "Toàn bộ":
        return "alltime";
      default:
        return "alltime";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeRange = getTimeRange(selectedOption);
        const result = await getTotalVehicle({ timeRange });
        setTotalMoneyData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedOption]); // Chạy lại effect khi selectedOption thay đổi

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <Card>
      <CardHeader
        action={
          <OptionsMenu
            options={["Hôm nay", "Tháng này", "Toàn bộ"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
            handleOptionSelect={handleOptionSelect}
          />
        }
      />
      <CardContent
        sx={{
          mt: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <CustomAvatar
          skin="light"
          variant="rounded"
          color="info"
          sx={{ mb: 3.5, width: 44, height: 44 }}
        >
          <Icon icon="tabler:car" fontSize="1.75rem" />
        </CustomAvatar>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Số phương tiện
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: "text.disabled" }}>
          {selectedOption}
        </Typography>
        <Typography sx={{ mb: 3.5, color: "text.secondary" }}>
          {totalMoneyData.totalCount} phương tiện
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;
