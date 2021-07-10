import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { generateId } from "../utils/generateId";
import { gameState } from "./game";

const port = process.env.PORT || 4001;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// const state: Record<string, State> = {};
// const clientRooms: Record<string, string> = {};

io.on("connection", (client) => {
  console.log("New client is connected", client.id);

  client.on("newGame", () => {
    const roomName = generateId(5);
    gameState.clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);

    gameState.initGame(roomName);
    const room = gameState.state[roomName];

    const newGameData = {
      dealer: room.dealer,
      players: room.players,
      playerId: 1,
    };

    client.join(roomName);
    client.emit("initState", newGameData);
  });

  client.on("joinGame", (roomName) => {
    const room = io.sockets.adapter.rooms.get(roomName);

    client.join(roomName);

    gameState.addPlayer(roomName);

    client.emit("addPlayer", 2);

    io.sockets.in(roomName).emit("gameState", gameState.state[roomName]);
  });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
