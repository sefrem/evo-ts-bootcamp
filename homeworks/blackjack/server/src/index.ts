import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { generateId } from "../utils/generateId";
import { gameState } from "./state/game";

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

io.on("reconnect", () => {});

io.on("connection", (client) => {
  client.on("newGame", (clientId) => {
    const roomName = generateId(5);
    gameState.clientRooms[clientId] = roomName;
    client.emit("gameCode", roomName);

    gameState.initGame(roomName, clientId);
    client.join(roomName);
    gameState.setActivePlayer(clientId);
  });

  client.on("joinGame", ({ roomName, clientId }) => {
    const room = io.sockets.adapter.rooms.get(roomName);

    if (!room) {
      client.emit("unknownGame");
      return;
    }

    if (gameState.clientRooms[clientId] !== roomName) {
      gameState.addPlayer(roomName, clientId);
      gameState.clientRooms[clientId] = roomName;
    }

    client.join(roomName);

    io.sockets
      .in(roomName)
      .emit("gameState", gameState.getInitialState(roomName));
  });

  // client.on("disconnecting", () => {
  //   client.rooms.forEach((roomName) => {
  //     const room = io.sockets.adapter.rooms.get(roomName);
  //     if (room.size === 1) {
  //       console.log("client room", room);
  //       room.delete(roomName);
  //       gameState.removeRoom(roomName);
  //     }
  //   });
  // });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
