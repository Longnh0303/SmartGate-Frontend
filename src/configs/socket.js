import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_WS_URL;
const options = {
  transports: ["websocket"],
};
const socket = io(url, options);

export default socket;
