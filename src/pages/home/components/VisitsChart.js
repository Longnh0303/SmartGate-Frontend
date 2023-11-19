// ** MUI Imports
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

// ** Component Import
import ReactApexcharts from "src/@core/components/react-apexcharts";
import OptionsMenu from "src/@core/components/option-menu";

const ApexColumnChart = () => {
  // ** Hook
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
        columnWidth: "40%", // Điều chỉnh khoảng cách giữa các cột, giảm để các cột gần nhau hơn
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
      categories: ["Port 1", "Port 2"],
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
      name: "Port 1",
      data: [85, null], // Dữ liệu cột thứ nhất và cột thứ hai để tách rời
    },
    {
      name: "Port 2",
      data: [null, 60], // Dữ liệu cột thứ nhất và cột thứ hai để tách rời
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Port Values"
        subheader="Values for Port 1 and Port 2"
        subheaderTypographyProps={{
          sx: { color: (theme) => `${theme.palette.text.disabled} !important` },
        }}
        action={
          <OptionsMenu
            options={["Last Week", "Last Month", "Last Year"]}
            iconButtonProps={{ size: "small", sx: { color: "text.disabled" } }}
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
