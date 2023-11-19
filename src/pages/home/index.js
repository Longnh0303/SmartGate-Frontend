// ** MUI Imports
import Grid from "@mui/material/Grid";
import AnalyticsVisits from "./components/AnalyticsVisits";
import AutoMoney from "./components/AutoMoney";
import RoleVisitsChart from "./components/RoleVisitsChart";
import VisitsChart from "./components/VisitsChart";

const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <AnalyticsVisits></AnalyticsVisits>
          </Grid>
          <Grid item xs={6} sm={2}>
            <AutoMoney></AutoMoney>
          </Grid>
          <Grid item xs={6} sm={2}>
            <AutoMoney></AutoMoney>
          </Grid>
          <Grid item xs={6} sm={2}>
            <AutoMoney></AutoMoney>
          </Grid>
          <Grid item xs={6} sm={2}>
            <AutoMoney></AutoMoney>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <RoleVisitsChart></RoleVisitsChart>
          </Grid>
          <Grid item xs={12} sm={6}>
            <VisitsChart></VisitsChart>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Home.acl = {
  action: "read",
  subject: "home-page",
};

export default Home;
