import { useEffect, useState } from "react";
import socket from "src/configs/socket";
import toast from "react-hot-toast";
import { getRfidByCardId } from "src/api/rfid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { DialogActions } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Grid, Card, Button, Box, CardHeader } from "@mui/material";
import { getDevices } from "src/api/device";
import CustomTextField from "src/@core/components/mui/text-field";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CardContent from "@mui/material/CardContent";
// ** Custom Component Import
import Icon from "src/@core/components/icon";
import CustomAvatar from "src/@core/components/mui/avatar";

const userRoleObj = {
  teacher: { title: "Giảng viên" },
  student: { title: "Sinh viên" },
  employee: { title: "Nhân viên" },
  guest: { title: "Khách" },
};

const RealtimePage = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [cardInfo, setCardInfo] = useState([]);
  const [deviceList, setDeviceList] = useState(null);
  const [watchingDevice, setWatchingDevice] = useState("");
  const [latestCardIndex, setLatestCardIndex] = useState(null);
  const [openDialog, setOpenDialog] = useState(true);

  const joinRoom = (socket_room) => {
    socket.emit("request-join-room", socket_room);
  };

  const leaveRoom = (socket_room) => {
    socket.emit("request-leave-room", socket_room);
  };
  useEffect(() => {
    // Update latest card index when cardInfo changes
    if (cardInfo && cardInfo.length > 0) {
      setLatestCardIndex(cardInfo.length - 1);
    }
  }, [cardInfo]);
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await getDevices();
        setDeviceList(devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    socket.connect();
    // Lắng nghe sự kiện 'device_status' từ server
    socket.on("device_status", async (msg) => {
      switch (msg.type) {
        case "gate":
          setData(msg.data);
          setStatus(JSON.parse(msg.data.message));
          break;
        case "access":
          try {
            const card = await getRfidByCardId(msg.data.message.cardId);
            setCardInfo((prevCardInfo) => {
              let updatedCardInfo;
              if (prevCardInfo.length >= 4) {
                updatedCardInfo = [...prevCardInfo.slice(1), card];
              } else {
                updatedCardInfo = [...prevCardInfo, card];
              }
              return updatedCardInfo;
            });
          } catch (error) {
            console.error("Error fetching card information:", error);
          }
          break;
        case "error":
          toast.error(msg.data.message);
          break;
        default:
          break;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Chạy một lần khi component được mount

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeviceSelect = (event) => {
    setOpenDialog(false);
    const selectedValue = event.target.value;
    setWatchingDevice(selectedValue);
    const socket_room = `${selectedValue}_status`;
    joinRoom(socket_room);
  };

  const handleBack = () => {
    setOpenDialog(true);
    const socket_room = `${watchingDevice}_status`;
    leaveRoom(socket_room);
    setWatchingDevice("");
    setData(null);
    setStatus(null);
    setCardInfo([]);
  };
  return (
    <>
      {!data && (
        <>
          <Box sx={{ marginBottom: "22px" }}>
            <Button
              variant="contained"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
            >
              Chọn thiết bị
            </Button>
          </Box>
          <Card
            sx={{
              height: "75vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <img
                    src="/images/avatars/no-connection.png"
                    alt="Manager Avatar"
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: "bold", color: "red" }}
                  >
                    Thiết bị đang không hoạt động hoặc bạn chưa chọn thiết bị.
                    Vui lòng chọn một thiết bị để theo dõi.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
      {data && (
        <>
          <Box sx={{ marginBottom: "22px" }}>
            <Button
              variant="contained"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
            >
              Chọn thiết bị
            </Button>
          </Box>
          <Box>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <CustomAvatar
                      skin="light"
                      color="error"
                      sx={{ mb: 4, width: 42, height: 42 }}
                    >
                      <Icon icon="tabler:cpu" fontSize={24} />
                    </CustomAvatar>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                      {status.mac}
                    </Typography>
                    <Typography variant="body2">Thiết bị</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <CustomAvatar
                      skin="light"
                      color={status.status > 0 ? "warning" : "info"}
                      sx={{ mb: 4, width: 42, height: 42 }}
                    >
                      <Icon icon="tabler:elevator" fontSize={24} />
                    </CustomAvatar>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                      {status.status > 0 ? "Đang mở" : "Đang đóng"}
                    </Typography>
                    <Typography variant="body2">Trạng thái</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <CustomAvatar
                      skin="light"
                      color="success"
                      sx={{ mb: 4, width: 42, height: 42 }}
                    >
                      <Icon icon="tabler:wifi" fontSize={24} />
                    </CustomAvatar>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#4caf50",
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        ></span>
                        <span style={{ color: "#4caf50" }}>Đang hoạt động</span>
                      </span>
                    </Typography>
                    <Typography variant="body2">Kết nối mạng</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          {cardInfo && cardInfo.length > 0 && (
            <Box sx={{ marginTop: "22px" }}>
              <Grid container spacing={6}>
                {cardInfo.map((card, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <Card
                          className={
                            latestCardIndex === index ? "glowing-card" : ""
                          }
                          sx={{
                            boxShadow:
                              latestCardIndex === index
                                ? `0px 0px 10px 2px rgba(115, 103, 240, 1)` // Màu mới
                                : "none",
                          }}
                        >
                          <CardContent>
                            <Box sx={{ mb: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 4,
                                  color: "text.disabled",
                                  textTransform: "uppercase",
                                }}
                              >
                                Thông tin thẻ
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon fontSize="1.25rem" icon="tabler:id" />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Mã thẻ :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.cardId}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1.25rem"
                                    icon="tabler:browser-check"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Loại thẻ :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.role
                                      ? userRoleObj[card.role].title
                                      : ""}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1.25rem"
                                    icon="tabler:coins"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Số dư :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.balance} VNĐ
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ mb: 6 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 4,
                                  color: "text.disabled",
                                  textTransform: "uppercase",
                                }}
                              >
                                Thông tin người dùng
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon fontSize="1.25rem" icon="tabler:user" />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Chủ thẻ :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.name ? card.name : "-"}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1.25rem"
                                    icon="tabler:building"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Khoa/Phòng :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.department ? card.department : "-"}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1.25rem"
                                    icon="tabler:id-badge-2"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Mã SV/NV :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.usercode ? card.usercode : "-"}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  mb: 4,
                                  color: "text.disabled",
                                  textTransform: "uppercase",
                                }}
                              >
                                Thông tin phương tiện
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon fontSize="1.25rem" icon="tabler:car" />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Phương tiện :
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.carInfo ? card.carInfo : "-"}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1.25rem"
                                    icon="tabler:palette"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Màu xe:
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.carColor ? card.carColor : "-"}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon fontSize="1.25rem" icon="tabler:123" />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      color: "text.secondary",
                                    }}
                                  >
                                    Biển số xe:
                                  </Typography>
                                  <Typography sx={{ color: "text.secondary" }}>
                                    {card.licensePlates
                                      ? card.licensePlates
                                      : "-"}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
      {deviceList && (
        <Dialog open={openDialog}>
          <DialogTitle>Chọn một thiết bị để theo dõi</DialogTitle>
          <DialogContent>
            <CustomTextField
              select
              fullWidth
              value={watchingDevice}
              sx={{ mt: 4 }}
              onChange={handleDeviceSelect}
              SelectProps={{
                value: watchingDevice,
                onChange: handleDeviceSelect,
              }}
            >
              {deviceList.map((device) => (
                <MenuItem key={device.id} value={device.mac}>
                  {device.mac}
                </MenuItem>
              ))}
            </CustomTextField>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDialog}>
              Bỏ qua
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

RealtimePage.acl = {
  action: "read",
  subject: "real-time-page",
};

export default RealtimePage;
