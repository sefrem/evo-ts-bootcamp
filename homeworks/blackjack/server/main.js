/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\r\n}) : (function(o, m, k, k2) {\r\n    if (k2 === undefined) k2 = k;\r\n    o[k2] = m[k];\r\n}));\r\nvar __exportStar = (this && this.__exportStar) || function(m, exports) {\r\n    for (var p in m) if (p !== \"default\" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n__exportStar(__webpack_require__(/*! ./server */ \"./server.ts\"), exports);\r\n\n\n//# sourceURL=webpack://server/./index.ts?");

/***/ }),

/***/ "./server.ts":
/*!*******************!*\
  !*** ./server.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst socket_io_1 = __webpack_require__(/*! socket.io */ \"socket.io\");\r\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./utils/index.ts\");\r\nconst gameService_1 = __webpack_require__(/*! ./src/state/gameService */ \"./src/state/gameService.ts\");\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst port = Number(process.env.PORT) || 8080;\r\nconst appRoot = __webpack_require__(/*! app-root-path */ \"app-root-path\");\r\n// const app = express();\r\n// const httpServer = createServer(app);\r\n// const io = new Server(httpServer);\r\nconst app = express();\r\nconst http = __webpack_require__(/*! http */ \"http\");\r\nconst httpServer = http.createServer(app);\r\nconst io = new socket_io_1.Server(httpServer, {\r\n    cors: {\r\n        origin: '*',\r\n        methods: ['GET', 'POST'],\r\n    },\r\n});\r\n// const io = require('socket.io')(httpServer);\r\napp.get('/', (req, res) => res.sendFile(appRoot + '/client/public/index.html'));\r\n// app.listen(port, () => console.log(`Listening on port ${port}`));\r\n// app.use(function (req, res, next) {\r\n//     res.header('Access-Control-Allow-Origin', '*');\r\n//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');\r\n//\r\n//     // Add this\r\n//     if (req.method === 'OPTIONS') {\r\n//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');\r\n//         res.header('Access-Control-Max-Age', '120');\r\n//         return res.status(200).json({});\r\n//     }\r\n//\r\n//     next();\r\n// });\r\nio.on('connection', (client) => {\r\n    client.on('newGame', (playerId) => {\r\n        const roomName = utils_1.generateId(5);\r\n        const broadcastOperator = io.sockets.in(roomName);\r\n        gameService_1.gameService.setPlayerRoom(playerId, roomName);\r\n        client.emit('gameCode', roomName);\r\n        gameService_1.gameService.initGame(roomName, playerId, broadcastOperator);\r\n        client.join(roomName);\r\n        gameService_1.gameService.setActivePlayer(playerId);\r\n    });\r\n    client.on('joinGame', ({ playerId, roomName }) => {\r\n        const room = io.sockets.adapter.rooms.get(roomName);\r\n        if (!room) {\r\n            client.emit('unknownGame');\r\n            return;\r\n        }\r\n        if (gameService_1.gameService.getPlayerRoomName(playerId) !== roomName) {\r\n            gameService_1.gameService.addPlayer(roomName, playerId);\r\n            gameService_1.gameService.setPlayerRoom(playerId, roomName);\r\n        }\r\n        client.join(roomName);\r\n        io.sockets.in(roomName).emit('gameStateInitial', gameService_1.gameService.getInitialState(roomName));\r\n    });\r\n    client.on('setBet', ({ playerId, chipValue }) => {\r\n        gameService_1.gameService.setBet(playerId, chipValue);\r\n    });\r\n    client.on('endBetting', (playerId) => {\r\n        gameService_1.gameService.endBetting(playerId);\r\n    });\r\n    client.on('hit', (playerId) => gameService_1.gameService.hit(playerId));\r\n    client.on('stand', (playerId) => gameService_1.gameService.stand(playerId));\r\n    io.sockets.adapter.on('leave-room', (room) => {\r\n        const size = io.sockets.adapter.rooms.get(room).size;\r\n        if (size === 0) {\r\n            gameService_1.gameService.removeRoom(room);\r\n        }\r\n    });\r\n});\r\n// io.listen(port, () => console.log(`socket server is listening on ${port}`));\r\nhttpServer.listen(port, () => console.log(`Listening on port ${port}`));\r\n\n\n//# sourceURL=webpack://server/./server.ts?");

/***/ }),

/***/ "./src/state/broadcastService.ts":
/*!***************************************!*\
  !*** ./src/state/broadcastService.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.BroadcastService = void 0;\r\nclass BroadcastService {\r\n    constructor(broadcastOperator) {\r\n        this.broadcastOperator = broadcastOperator;\r\n    }\r\n    emitStatus(status) {\r\n        this.broadcastOperator.emit('gameStateStatus', status);\r\n    }\r\n    emitPlayers(players) {\r\n        this.broadcastOperator.emit('gameStatePlayers', players);\r\n    }\r\n    emitActivePlayerId(activePlayerId) {\r\n        this.broadcastOperator.emit('gameStateActivePlayerId', activePlayerId);\r\n    }\r\n    emitDealer(dealer) {\r\n        this.broadcastOperator.emit('gameStateDealer', dealer);\r\n    }\r\n    emitCountdownTimer(timer) {\r\n        this.broadcastOperator.emit('gameStateCountdownTimer', timer);\r\n    }\r\n}\r\nexports.BroadcastService = BroadcastService;\r\n\n\n//# sourceURL=webpack://server/./src/state/broadcastService.ts?");

/***/ }),

/***/ "./src/state/gameService.ts":
/*!**********************************!*\
  !*** ./src/state/gameService.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.gameService = void 0;\r\nconst gameState_1 = __webpack_require__(/*! ./gameState */ \"./src/state/gameState.ts\");\r\nclass GameService {\r\n    constructor() {\r\n        this.clientRooms = {};\r\n        this.state = {};\r\n    }\r\n    initGame(roomName, playerId, broadcastOperator) {\r\n        this.state[roomName] = new gameState_1.GameState(broadcastOperator);\r\n        this.state[roomName].initGame(playerId);\r\n    }\r\n    getInitialState(roomName) {\r\n        return this.state[roomName].getInitialState();\r\n    }\r\n    addPlayer(roomName, playerId) {\r\n        this.state[roomName].addPlayer(playerId);\r\n    }\r\n    setActivePlayer(playerId) {\r\n        this.getPlayerRoom(playerId).setActivePlayer(playerId);\r\n    }\r\n    setBet(playerId, chipValue) {\r\n        this.getPlayerRoom(playerId).setBet(playerId, chipValue);\r\n    }\r\n    endBetting(playerId) {\r\n        this.getPlayerRoom(playerId).endBetting();\r\n    }\r\n    hit(playerId) {\r\n        this.getPlayerRoom(playerId).hit();\r\n    }\r\n    stand(playerId) {\r\n        this.getPlayerRoom(playerId).stand();\r\n    }\r\n    getPlayerRoom(playerId) {\r\n        const roomName = this.clientRooms[playerId];\r\n        return this.state[roomName];\r\n    }\r\n    setPlayerRoom(playerId, roomName) {\r\n        this.clientRooms[playerId] = roomName;\r\n    }\r\n    getPlayerRoomName(playerId) {\r\n        return this.clientRooms[playerId];\r\n    }\r\n    removeRoom(roomName) {\r\n        if (this.state[roomName]) {\r\n            delete this.state[roomName];\r\n        }\r\n    }\r\n}\r\nexports.gameService = new GameService();\r\n\n\n//# sourceURL=webpack://server/./src/state/gameService.ts?");

/***/ }),

/***/ "./src/state/gameState.ts":
/*!********************************!*\
  !*** ./src/state/gameState.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.GameState = void 0;\r\nconst types_1 = __webpack_require__(/*! ../types */ \"./src/types.ts\");\r\nconst utils_1 = __webpack_require__(/*! ../../utils */ \"./utils/index.ts\");\r\nconst broadcastService_1 = __webpack_require__(/*! ./broadcastService */ \"./src/state/broadcastService.ts\");\r\nconst initialDealerState = {\r\n    id: 0,\r\n    name: 'Dealer',\r\n    hand: [],\r\n    score: 0,\r\n    roundStatus: '',\r\n};\r\nclass GameState {\r\n    constructor(broadcastOperator) {\r\n        this.deck = [];\r\n        this.dealer = initialDealerState;\r\n        this.playersIds = [];\r\n        this.activePlayerId = '';\r\n        this.status = types_1.GameStatus.idle;\r\n        this.players = [];\r\n        this.broadcastService = new broadcastService_1.BroadcastService(broadcastOperator);\r\n    }\r\n    getInitialState() {\r\n        return {\r\n            dealer: this.dealer,\r\n            players: this.players,\r\n            activePlayerId: this.activePlayerId,\r\n            status: this.status,\r\n        };\r\n    }\r\n    initGame(playerId) {\r\n        this.addPlayer(playerId);\r\n        this.deck = utils_1.shuffleArray(utils_1.createDeck());\r\n    }\r\n    addPlayer(playerId) {\r\n        this.players.push({\r\n            id: playerId,\r\n            name: 'SomeTestName',\r\n            hand: [],\r\n            score: 0,\r\n            chips: {\r\n                '10': 5,\r\n                '25': 4,\r\n                '50': 3,\r\n                '100': 2,\r\n            },\r\n            roundStatus: '',\r\n            bet: [],\r\n        });\r\n        this.playersIds.push(playerId);\r\n    }\r\n    setActivePlayer(playerId) {\r\n        this.activePlayerId = playerId;\r\n    }\r\n    setBet(playerId, chipValue) {\r\n        if (playerId !== this.activePlayerId)\r\n            return;\r\n        if (this.status !== types_1.GameStatus.idle)\r\n            return;\r\n        const player = this.getPlayerById(playerId);\r\n        if ((player === null || player === void 0 ? void 0 : player.chips[chipValue]) === 0)\r\n            return;\r\n        player.bet.push(chipValue);\r\n        this.removePlayerChip(chipValue);\r\n        this.broadcastService.emitPlayers(this.players);\r\n    }\r\n    endBetting() {\r\n        if (!this.setNextPlayer()) {\r\n            this.status = types_1.GameStatus.playing;\r\n            this.broadcastService.emitStatus(this.status);\r\n            this.deal();\r\n        }\r\n        this.broadcastService.emitActivePlayerId(this.activePlayerId);\r\n    }\r\n    hit() {\r\n        const activePlayer = this.getActivePlayer();\r\n        activePlayer.hand.push(this.getCardFromTop());\r\n        this.updateActivePlayerScore();\r\n        this.broadcastService.emitPlayers(this.players);\r\n        if (activePlayer.score > 21) {\r\n            this.handlePlayerBusted();\r\n        }\r\n    }\r\n    stand() {\r\n        if (!this.setNextPlayer()) {\r\n            this.dealerPlay();\r\n            return;\r\n        }\r\n        this.updateActivePlayerScore();\r\n        this.broadcastService.emitPlayers(this.players);\r\n        this.broadcastService.emitActivePlayerId(this.activePlayerId);\r\n    }\r\n    handlePlayerBusted() {\r\n        this.setBusted(this.activePlayerId);\r\n        setTimeout(() => {\r\n            this.removePlayerBet(this.activePlayerId);\r\n            this.broadcastService.emitPlayers(this.players);\r\n        }, 500);\r\n        setTimeout(() => {\r\n            if (!this.setNextPlayer()) {\r\n                this.dealerPlay();\r\n            }\r\n            this.broadcastService.emitActivePlayerId(this.activePlayerId);\r\n        }, 1000);\r\n    }\r\n    dealerPlay() {\r\n        this.setActivePlayer('');\r\n        this.updateDealerScore();\r\n        this.broadcastService.emitActivePlayerId(this.activePlayerId);\r\n        this.broadcastService.emitDealer(this.dealer);\r\n        if (this.checkIfAllBusted()) {\r\n            this.resetGame();\r\n            return;\r\n        }\r\n        const dealerInterval = setInterval(() => {\r\n            if (this.dealer.score >= 17) {\r\n                clearInterval(dealerInterval);\r\n                this.checkGameEnd();\r\n                return;\r\n            }\r\n            this.dealerHit();\r\n            this.broadcastService.emitDealer(this.dealer);\r\n        }, 500);\r\n    }\r\n    checkGameEnd() {\r\n        const dealerScore = this.dealer.score;\r\n        if (!dealerScore)\r\n            return;\r\n        this.players.forEach(({ id, score, roundStatus }) => {\r\n            if (roundStatus === 'busted') {\r\n                return;\r\n            }\r\n            if (dealerScore <= 21 && score <= 21) {\r\n                if (dealerScore > score) {\r\n                    this.removePlayerBet(id);\r\n                    this.setPlayerLose(id);\r\n                    this.broadcastService.emitPlayers(this.players);\r\n                    return;\r\n                }\r\n                if (score > dealerScore) {\r\n                    this.updateChipsPlayerWon(id);\r\n                    this.setPlayerWin(id);\r\n                    this.broadcastService.emitPlayers(this.players);\r\n                    return;\r\n                }\r\n            }\r\n            if (dealerScore > 21) {\r\n                if (this.dealer) {\r\n                    this.dealer.roundStatus = 'busted';\r\n                    this.broadcastService.emitDealer(this.dealer);\r\n                }\r\n                this.setDealerBusted();\r\n                this.setPlayerWin(id);\r\n                this.updateChipsPlayerWon(id);\r\n                this.broadcastService.emitPlayers(this.players);\r\n                return;\r\n            }\r\n            if (dealerScore === score) {\r\n                this.updateChipsStandoff(id);\r\n                this.setPlayerStandoff(id);\r\n                this.broadcastService.emitPlayers(this.players);\r\n                return;\r\n            }\r\n        });\r\n        this.resetGame();\r\n    }\r\n    resetGame() {\r\n        let nextGameTimer = 5;\r\n        const countdownTimer = setInterval(() => {\r\n            nextGameTimer -= 1;\r\n            this.broadcastService.emitCountdownTimer(nextGameTimer);\r\n            if (nextGameTimer <= 0) {\r\n                this.resetPlayers();\r\n                this.resetDealer();\r\n                this.deck = utils_1.shuffleArray(utils_1.createDeck());\r\n                this.setActivePlayer(this.playersIds[0]);\r\n                this.status = types_1.GameStatus.idle;\r\n                clearInterval(countdownTimer);\r\n                this.broadcastService.emitPlayers(this.players);\r\n                this.broadcastService.emitDealer(this.dealer);\r\n                this.broadcastService.emitActivePlayerId(this.activePlayerId);\r\n                this.broadcastService.emitStatus(this.status);\r\n            }\r\n        }, 1000);\r\n    }\r\n    resetPlayers() {\r\n        this.players = this.players.map(player => (Object.assign(Object.assign({}, player), { hand: [], bet: [], score: 0, roundStatus: '' })));\r\n    }\r\n    resetDealer() {\r\n        if (this.dealer) {\r\n            this.dealer.hand = [];\r\n            this.dealer.score = 0;\r\n            this.dealer.roundStatus = '';\r\n        }\r\n    }\r\n    updateChipsPlayerWon(playerId) {\r\n        const player = this.getPlayerById(playerId);\r\n        player.bet.forEach(value => {\r\n            player.chips[value] += 2;\r\n        });\r\n    }\r\n    updateChipsStandoff(playerId) {\r\n        const player = this.getPlayerById(playerId);\r\n        player.bet.forEach(value => {\r\n            player.chips[value] += 1;\r\n        });\r\n    }\r\n    dealerHit() {\r\n        this.dealer.hand.push(this.getCardFromTop());\r\n        this.updateDealerScore();\r\n    }\r\n    checkIfAllBusted() {\r\n        return this.players.every(({ roundStatus }) => roundStatus === 'busted');\r\n    }\r\n    updateDealerScore() {\r\n        this.dealer.score = utils_1.countScoreInHand(this.dealer.hand);\r\n    }\r\n    updateActivePlayerScore() {\r\n        const activePlayer = this.getActivePlayer();\r\n        activePlayer.score = utils_1.countScoreInHand(activePlayer.hand);\r\n    }\r\n    deal() {\r\n        const players = this.players.slice(-this.players.length);\r\n        for (let i = 0; i < 2; i++) {\r\n            setTimeout(() => {\r\n                for (let j = 0; j <= players.length; j++) {\r\n                    setTimeout(() => {\r\n                        if (j === players.length) {\r\n                            this.dealer.hand.push(this.getCardFromTop());\r\n                            this.broadcastService.emitDealer(this.dealer);\r\n                        }\r\n                        else {\r\n                            players[j].hand.push(this.getCardFromTop());\r\n                            players[j].score = utils_1.countScoreInHand(players[j].hand);\r\n                            this.broadcastService.emitPlayers(this.players);\r\n                        }\r\n                    }, j * 500);\r\n                }\r\n            }, i * 500 * (this.playersIds.length + 1));\r\n        }\r\n        this.setActivePlayer(this.playersIds[0]);\r\n        this.broadcastService.emitActivePlayerId(this.activePlayerId);\r\n    }\r\n    getCardFromTop() {\r\n        return this.deck.splice(0, 1)[0];\r\n    }\r\n    // Set the next player as active and return false if it was the last one\r\n    setNextPlayer() {\r\n        if (!this.activePlayerId)\r\n            return false;\r\n        const activePlayerIndex = this.playersIds.indexOf(this.activePlayerId);\r\n        if (activePlayerIndex === this.playersIds.length - 1) {\r\n            return false;\r\n        }\r\n        else {\r\n            this.activePlayerId = this.playersIds[activePlayerIndex + 1];\r\n            return true;\r\n        }\r\n    }\r\n    removePlayerChip(chipValue) {\r\n        this.getActivePlayer().chips[chipValue]--;\r\n    }\r\n    getActivePlayer() {\r\n        return this.getPlayerById(this.activePlayerId);\r\n    }\r\n    getPlayerById(playerId) {\r\n        return this.players.find(({ id }) => id === playerId);\r\n    }\r\n    setBusted(playerId) {\r\n        this.getPlayerById(playerId).roundStatus = 'busted';\r\n    }\r\n    removePlayerBet(playerId) {\r\n        this.getPlayerById(playerId).bet = [];\r\n    }\r\n    setPlayerWin(playerId) {\r\n        this.getPlayerById(playerId).roundStatus = 'win';\r\n    }\r\n    setPlayerLose(playerId) {\r\n        this.getPlayerById(playerId).roundStatus = 'lose';\r\n    }\r\n    setPlayerStandoff(playerId) {\r\n        this.getPlayerById(playerId).roundStatus = 'standoff';\r\n    }\r\n    setDealerBusted() {\r\n        this.dealer.roundStatus = 'busted';\r\n    }\r\n}\r\nexports.GameState = GameState;\r\n\n\n//# sourceURL=webpack://server/./src/state/gameState.ts?");

/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.GameStatus = void 0;\r\nvar GameStatus;\r\n(function (GameStatus) {\r\n    GameStatus[\"idle\"] = \"idle\";\r\n    GameStatus[\"playing\"] = \"playing\";\r\n    GameStatus[\"over\"] = \"over\";\r\n})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));\r\n\n\n//# sourceURL=webpack://server/./src/types.ts?");

/***/ }),

/***/ "./utils/countScoreInHand.ts":
/*!***********************************!*\
  !*** ./utils/countScoreInHand.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.countScoreInHand = void 0;\r\nfunction countScoreInHand(hand) {\r\n    let score = 0;\r\n    let acesCounter = 0;\r\n    hand.forEach(({ rank }) => {\r\n        if (typeof rank === \"number\") {\r\n            score += rank;\r\n        }\r\n        if (typeof rank === \"string\") {\r\n            if (rank === \"A\") {\r\n                acesCounter++;\r\n            }\r\n            else {\r\n                score += 10;\r\n            }\r\n        }\r\n    });\r\n    while (acesCounter > 0) {\r\n        if (score + 11 > 21) {\r\n            score += 1;\r\n        }\r\n        else {\r\n            score += 11;\r\n        }\r\n        acesCounter--;\r\n    }\r\n    return score;\r\n}\r\nexports.countScoreInHand = countScoreInHand;\r\n\n\n//# sourceURL=webpack://server/./utils/countScoreInHand.ts?");

/***/ }),

/***/ "./utils/createDeck.ts":
/*!*****************************!*\
  !*** ./utils/createDeck.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.createDeck = void 0;\r\nfunction createDeck() {\r\n    const deck = [];\r\n    const ranks = [\"A\", \"K\", \"Q\", \"J\", 10, 9, 8, 7, 6, 5, 4, 3, 2];\r\n    const suits = [\"spades\", \"hearts\", \"diamonds\", \"clubs\"];\r\n    ranks.forEach((rank) => {\r\n        suits.forEach((suit) => {\r\n            deck.push({ rank, suit });\r\n        });\r\n    });\r\n    return deck;\r\n}\r\nexports.createDeck = createDeck;\r\n\n\n//# sourceURL=webpack://server/./utils/createDeck.ts?");

/***/ }),

/***/ "./utils/generateId.ts":
/*!*****************************!*\
  !*** ./utils/generateId.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.generateId = void 0;\r\nfunction generateId(length) {\r\n    let result = \"\";\r\n    const characters = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\";\r\n    const charactersLength = characters.length;\r\n    for (let i = 0; i <= length; i++) {\r\n        result += characters.charAt(Math.floor(Math.random() * charactersLength));\r\n    }\r\n    return result;\r\n}\r\nexports.generateId = generateId;\r\n\n\n//# sourceURL=webpack://server/./utils/generateId.ts?");

/***/ }),

/***/ "./utils/index.ts":
/*!************************!*\
  !*** ./utils/index.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.shuffleArray = exports.generateId = exports.createDeck = exports.countScoreInHand = void 0;\r\nconst countScoreInHand_1 = __webpack_require__(/*! ./countScoreInHand */ \"./utils/countScoreInHand.ts\");\r\nObject.defineProperty(exports, \"countScoreInHand\", ({ enumerable: true, get: function () { return countScoreInHand_1.countScoreInHand; } }));\r\nconst createDeck_1 = __webpack_require__(/*! ./createDeck */ \"./utils/createDeck.ts\");\r\nObject.defineProperty(exports, \"createDeck\", ({ enumerable: true, get: function () { return createDeck_1.createDeck; } }));\r\nconst generateId_1 = __webpack_require__(/*! ./generateId */ \"./utils/generateId.ts\");\r\nObject.defineProperty(exports, \"generateId\", ({ enumerable: true, get: function () { return generateId_1.generateId; } }));\r\nconst shuffleArray_1 = __webpack_require__(/*! ./shuffleArray */ \"./utils/shuffleArray.ts\");\r\nObject.defineProperty(exports, \"shuffleArray\", ({ enumerable: true, get: function () { return shuffleArray_1.shuffleArray; } }));\r\n\n\n//# sourceURL=webpack://server/./utils/index.ts?");

/***/ }),

/***/ "./utils/shuffleArray.ts":
/*!*******************************!*\
  !*** ./utils/shuffleArray.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.shuffleArray = void 0;\r\nfunction shuffleArray(arr) {\r\n    const array = [...arr];\r\n    for (let i = array.length - 1; i > 0; i--) {\r\n        const j = Math.floor(Math.random() * (i + 1));\r\n        [array[i], array[j]] = [array[j], array[i]];\r\n    }\r\n    return array;\r\n}\r\nexports.shuffleArray = shuffleArray;\r\n\n\n//# sourceURL=webpack://server/./utils/shuffleArray.ts?");

/***/ }),

/***/ "app-root-path":
/*!********************************!*\
  !*** external "app-root-path" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("app-root-path");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.ts");
/******/ 	
/******/ })()
;