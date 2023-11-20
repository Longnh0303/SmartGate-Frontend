import { useState, useEffect } from "react";
import { getDevices } from "src/api/device";
import { getColumnChartStats } from "src/api/statistic";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import ReactApexcharts from "src/@core/components/react-apexcharts";
import OptionsMenu from "src/@core/components/option-menu";

const ApexColumnChart = () => {
  const [chartData, setChartData] = useState([]);
  const [category, setCategory] = useState([]);
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
        const result = await getColumnChartStats({ timeRange });
        const devices = await getDevices();
        const categoryList = devices.map((device) => device.mac);
        setCategory(categoryList);
        setChartData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedOption]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const theme = useTheme();

  const options = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: category,
    },
    yaxis: {
      title: {
        text: "Values",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#fdd835", "#00d4bd"],
  };

  const series = [
    {
      name: "Vào/ra(Lượt)",
      data: chartData.map((item) => item.data[0]), // Lấy dữ liệu số lượt vào/ra từ chartData
    },
    {
      name: "Số tiền (nghìn VNĐ)",
      data: chartData.map((item) => item.data[1] / 1000), // Chia dữ liệu số tiền cho 1000 để đơn vị là nghìn VNĐ
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Thống kê hoạt động"
        subheader="Số lượt vào/ra và số tiền đã thu"
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
        <ReactApexcharts
          type="bar"
          height={400}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  );
};

export default ApexColumnChart;
