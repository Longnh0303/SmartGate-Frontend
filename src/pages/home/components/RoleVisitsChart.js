// ** MUI Imports
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

// ** Component Import
import ReactApexcharts from "src/@core/components/react-apexcharts";
import OptionsMenu from "src/@core/components/option-menu";

//Api imports
import { useState, useEffect, useRef } from "react";
import { getPieChartStats } from "src/api/statistic";

const donutColors = {
  series1: "#fdd835",
  series2: "#00d4bd",
  series3: "#826bf8",
  series4: "#1FD5EB",
  series5: "#ffa1a1",
};

const ApexDonutChart = () => {
  const [selectedOption, setSelectedOption] = useState("Hôm nay");
  const [chartData, setChartData] = useState([]);
  const [renderKey, setRenderKey] = useState(0);

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
        const result = await getPieChartStats({ timeRange });
        setChartData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedOption]);

  useEffect(() => {
    setRenderKey((prevKey) => prevKey + 1);
  }, [chartData]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // ** Hook
  const theme = useTheme();

  const options = {
    stroke: { width: 0 },
    labels: ["Khách", "Sinh viên", "Giáo viên", "Nhân viên"],
    colors: [
      donutColors.series1,
      donutColors.series5,
      donutColors.series3,
      donutColors.series2,
    ],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${parseInt(val, 10)}%`,
    },
    legend: {
      position: "bottom",
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "1.2rem",
            },
            value: {
              fontSize: "1.2rem",
              color: theme.palette.text.secondary,
              formatter: (val) => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: "1.2rem",
              label: "Tổng số lượt",
              formatter: () =>
                chartData.reduce((acc, currentValue) => acc + currentValue, 0),
              color: theme.palette.text.primary,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: theme.typography.body1.fontSize,
                  },
                  value: {
                    fontSize: theme.typography.body1.fontSize,
                  },
                  total: {
                    fontSize: theme.typography.body1.fontSize,
                  },
                },
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Tỉ lệ loại thẻ"
        subheader="Các loại thẻ vào/ra trên toàn hệ thống"
        subheaderTypographyProps={{
          sx: { color: (theme) => `${theme.palette.text.disabled} !important` },
        }}
        action={
          <OptionsMenu
            options={["Hôm nay", "Tháng này", "Toàn bộ"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
            handleOptionSelect={handleOptionSelect}
          />
        }
      />
      <CardContent>
        {chartData.length > 0 && (
          <ReactApexcharts
            key={renderKey}
            type="donut"
            height={400}
            options={options}
            series={chartData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ApexDonutChart;
