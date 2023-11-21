import { io } from "socket.io-client";

const url = process.env.NEXT_PUBLIC_WS_URL;
const options = {
  withCredentials: true,
};
const socket = io(url, options);

export default socket;
