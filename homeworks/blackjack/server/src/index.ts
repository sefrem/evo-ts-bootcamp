import express from "express";
import { createServer } from "http";
import { BroadcastOperator, Server } from "socket.io";

import { generateId } from "../utils/generateId";
import { gameService } from "./state/gameService";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

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
  client.on("newGame", (playerId) => {
    const roomName = generateId(5);
    const broadcastOperator: BroadcastOperator<DefaultEventsMap> = io.sockets.in(
      roomName
    );
    gameService.clientRooms[playerId] = roomName;
    client.emit("gameCode", roomName);

    gameService.initGame(roomName, playerId, broadcastOperator);
    client.join(roomName);
    gameService.setActivePlayer(playerId);
  });

  client.on("joinGame", ({ roomName, playerId }) => {
    const room = io.sockets.adapter.rooms.get(roomName);

    if (!room) {
      client.emit("unknownGame");
      return;
    }

    if (gameService.clientRooms[playerId] !== roomName) {
      gameService.addPlayer(roomName, playerId);
      gameService.clientRooms[playerId] = roomName;
    }

    client.join(roomName);

    io.sockets
      .in(roomName)
      .emit("gameStateInitial", gameService.getInitialState(roomName));
  });

  client.on("setBet", ({ playerId, chipValue }) => {
    gameService.setBet(playerId, chipValue);

    const roomName = gameService.getPlayerRoomName(playerId);

    io.sockets
      .in(roomName)
      .emit("gameStatePlayers", gameService.getPlayersState(playerId));
  });

  client.on("endBetting", (playerId) => {
    gameService.endBetting(playerId);

    const roomName = gameService.getPlayerRoomName(playerId);
    const activePlayerId = gameService.getActivePlayerId(playerId);
    // console.log("activePlayerId", activePlayerId);
    io.sockets.in(roomName).emit("gameStateActivePlayerId", activePlayerId);
  });

  // client.on("disconnecting", () => {
  //   client.rooms.forEach((roomName) => {
  //     const room = io.sockets.adapter.rooms.get(roomName);
  //     if (room.size === 1) {
  //       console.log("client room", room);
  //       room.delete(roomName);
  //       gameService.removeRoom(roomName);
  //     }
  //   });
  // });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
