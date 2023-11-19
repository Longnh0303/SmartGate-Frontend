// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import CardHeader from "@mui/material/CardHeader";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import OptionsMenu from "src/@core/components/option-menu";

// ** Icon Imports
import Icon from "src/@core/components/icon";

//APi imports
import { useState, useEffect } from "react";
import { getAccessStats } from "src/api/statistic";

const AnalyticsVisits = () => {
  const [accessData, setAccessData] = useState({
    totalAccess: 0,
    gateInStats: 0,
    gateOutStats: 0,
  });

  const [selectedOption, setSelectedOption] = useState("All Time");

  const getTimeRange = (selectedOption) => {
    switch (selectedOption) {
      case "Today":
        return "daily";
      case "This Month":
        return "monthly";
      case "All Time":
        return "alltime";
      default:
        return "alltime";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeRange = getTimeRange(selectedOption);
        const result = await getAccessStats({ timeRange });
        setAccessData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedOption]); // Chạy lại effect khi selectedOption thay đổi

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedOption = "All Time"; // Thay đổi giá trị mặc định nếu cần
        const timeRange = getTimeRange(selectedOption);
        const result = await getAccessStats({ timeRange });
        setAccessData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader
        action={
          <OptionsMenu
            options={["Today", "This Month", "All Time"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
            handleOptionSelect={handleOptionSelect}
          />
        }
      />
      <CardContent sx={{ p: (theme) => `${theme.spacing(5)} !important` }}>
        <Box
          sx={{
            gap: 2,
            mb: 2,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              Tổng số lượt vào/ra
            </Typography>
            <Typography variant="h4">{accessData.totalAccess} lượt</Typography>
          </div>
        </Box>
        <Box
          sx={{
            mb: 3.5,
            gap: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ py: 2.25, display: "flex", flexDirection: "column" }}>
            <Box sx={{ mb: 2.5, display: "flex", alignItems: "center" }}>
              <CustomAvatar
                skin="light"
                color="info"
                variant="rounded"
                sx={{ mr: 1.5, height: 24, width: 24 }}
              >
                <Icon icon="tabler:door-enter" fontSize="1.125rem" />
              </CustomAvatar>
              <Typography sx={{ color: "text.secondary" }}>Vào</Typography>
            </Box>
            <Typography variant="h5">
              {accessData.gateInStats > 0
                ? (
                    (accessData.gateInStats / accessData.totalAccess) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              {accessData.gateInStats} lượt
            </Typography>
          </Box>
          <Divider flexItem sx={{ m: 0 }} orientation="vertical">
            <CustomAvatar
              skin="light"
              color="secondary"
              sx={{
                height: 24,
                width: 24,
                fontSize: "0.6875rem",
                color: "text.secondary",
              }}
            >
              VS
            </CustomAvatar>
          </Divider>
          <Box
            sx={{
              py: 2.25,
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 2.5, display: "flex", alignItems: "center" }}>
              <Typography sx={{ mr: 1.5, color: "text.secondary" }}>
                Ra
              </Typography>
              <CustomAvatar
                skin="light"
                variant="rounded"
                sx={{ height: 24, width: 24 }}
              >
                <Icon icon="tabler:door-exit" fontSize="1.125rem" />
              </CustomAvatar>
            </Box>
            <Typography variant="h5">
              {accessData.gateOutStats > 0
                ? (
                    (accessData.gateOutStats / accessData.totalAccess) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </Typography>
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              {accessData.gateOutStats} lượt
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          value={
            accessData.gateInStats > 0
              ? (accessData.gateInStats / accessData.totalAccess) * 100
              : 50
          }
          color="info"
          variant="determinate"
          sx={{
            height: 10,
            "&.MuiLinearProgress-colorInfo": {
              backgroundColor: "primary.main",
            },
            "& .MuiLinearProgress-bar": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AnalyticsVisits;
