import express from 'express';
import { createServer } from 'http';
import { BroadcastOperator, Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { generateId } from '../utils';
import { gameService } from './state/gameService';
import { ChipsValues } from './types';

const port = process.env.PORT || 4001;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', client => {
    client.on('newGame', (playerId: string) => {
        const roomName = generateId(5);
        const broadcastOperator: BroadcastOperator<DefaultEventsMap> = io.sockets.in(roomName);
        gameService.setPlayerRoom(playerId, roomName);
        client.emit('gameCode', roomName);

        gameService.initGame(roomName, playerId, broadcastOperator);
        client.join(roomName);
        gameService.setActivePlayer(playerId);
    });

    client.on('joinGame', ({ playerId, roomName }: { playerId: string; roomName: string }) => {
        const room = io.sockets.adapter.rooms.get(roomName);

        if (!room) {
            client.emit('unknownGame');
            return;
        }

        if (gameService.getPlayerRoomName(playerId) !== roomName) {
            gameService.addPlayer(roomName, playerId);
            gameService.setPlayerRoom(playerId, roomName);
        }

        client.join(roomName);

        io.sockets.in(roomName).emit('gameStateInitial', gameService.getInitialState(roomName));
    });

    client.on('setBet', ({ playerId, chipValue }: { playerId: string; chipValue: ChipsValues }) => {
        gameService.setBet(playerId, chipValue);
    });

    client.on('endBetting', (playerId: string) => {
        gameService.endBetting(playerId);
    });

    client.on('hit', (playerId: string) => gameService.hit(playerId));

    client.on('stand', (playerId: string) => gameService.stand(playerId));

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
