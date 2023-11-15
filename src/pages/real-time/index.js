import { useEffect, useState } from "react";
import socket from "src/configs/socket";
import toast from "react-hot-toast";
import { getRfidByCardId } from "src/api/rfid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Grid, Card, Button } from "@mui/material";

const YourComponent = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);

  const joinRoom = () => {
    socket.emit("request-join-room", "24:dc:c3:a7:3a:78_status");
  };

  useEffect(() => {
    // Lắng nghe sự kiện 'mqttMessage' từ server
    socket.on("device_status", async (msg) => {
      console.log(msg)
      switch (msg.type) {
        case "gate":
          setData(msg.data);
          setStatus(JSON.parse(msg.data.message));
          break;
        case "access":
          try {
            setCardInfo(null);
            const card = await getRfidByCardId(msg.data.cardId);
            setCardInfo(card);

            // Schedule the reset after 3 seconds
            setTimeout(() => {
              setCardInfo(null);
            }, 3000);
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

  return (
    <>
      <Button onClick={joinRoom}>joinRoom</Button>
      {data && (
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <Card>
              <Typography>MAC: {status.mac}</Typography>
              <Typography>Trạng thái: {status.status}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card></Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card></Card>
          </Grid>
        </Grid>
      )}
      {cardInfo && (
        <Dialog open={cardInfo !== null}>
          <DialogTitle>Card Information</DialogTitle>
          <DialogContent>
            <Typography variant="body1">CardId: {cardInfo.cardId}</Typography>
            <Typography variant="body1">Name: {cardInfo.name}</Typography>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default YourComponent;
