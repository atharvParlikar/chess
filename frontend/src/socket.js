import { io } from "socket.io-client";

const URL = "http://localhost:3000/1";

export const socket = io(URL);