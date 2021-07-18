import MockedSocket from 'socket.io-mock';
import { GameState, initialDealerState } from '../state/gameState';
import { Card } from '../types';

const socket = new MockedSocket();

const PLAYER_ONE = '1';
const PLAYER_TWO = '2';
const mockDeck: Card[] = [
    { rank: '10', suit: 'clubs' },
    { rank: 'A', suit: 'spades' },
    { rank: 'K', suit: 'hearts' },
    { rank: 'Q', suit: 'diamonds' },
    { rank: 'J', suit: 'clubs' },
    { rank: '10', suit: 'spades' },
];

describe('Testing gameState logic', () => {
    const gameState = new GameState(socket);
    jest.setTimeout(15000);
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('asserts that the gameState is created and has initial dealer state', () => {
        expect(gameState.dealer).toEqual(initialDealerState);
    });

    it('asserts that after the gameState initialization state contains a player and a deck is created', () => {
        gameState.initGame(PLAYER_ONE);
        expect(gameState.players[0]).toEqual(
            expect.objectContaining({
                id: PLAYER_ONE,
            }),
        );
    });

    it('asserts that the deck is created after initialization', () => {
        expect(gameState['deck'].length).toEqual(52);
    });

    it('asserts that adding a player adds a player with the given id', () => {
        gameState.addPlayer(PLAYER_TWO);
        expect(gameState.players[1]).toEqual(
            expect.objectContaining({
                id: PLAYER_TWO,
            }),
        );
    });

    it('asserts that the ids of new players have been stored', () => {
        expect(gameState.playersIds).toEqual([PLAYER_ONE, PLAYER_TWO]);
    });

    it('asserts the deal method deals the correct cards in correct order to both players and dealer', done => {
        gameState['deck'] = mockDeck;
        jest.spyOn(GameState.prototype, 'getCardFromTop').mockImplementation(function (this: GameState) {
            return this['deck'].splice(0, 1)[0];
        });

        gameState['deal']();

        setTimeout(() => {
            const player1 = gameState['getPlayerById']('1');
            const player2 = gameState['getPlayerById']('2');
            expect(gameState.dealer.hand).toEqual([
                { rank: 'K', suit: 'hearts' },
                { rank: '10', suit: 'spades' },
            ]);
            expect(player1.hand[0]).toEqual({ rank: '10', suit: 'clubs' });
            expect(player1.hand[1]).toEqual({ rank: 'Q', suit: 'diamonds' });
            expect(player2.hand[0]).toEqual({ rank: 'A', suit: 'spades' });
            expect(player2.hand[1]).toEqual({ rank: 'J', suit: 'clubs' });
            gameState['createDeck']();
            done();
        }, 8000);
    });

    it('asserts that the active player is the first one', () => {
        expect(gameState.activePlayerId).toBe('1');
    });

    it('asserts that setting a bet adds the bet value to the player', () => {
        gameState.setBet('1', '50');
        expect(gameState['getPlayerById']('1').bet[0]).toBe('50');
    });

    it('asserts that the score of each player updates correctly', () => {
        const player1 = gameState['getPlayerById']('1');
        const player2 = gameState['getPlayerById']('2');
        expect(player1.score).toBe(20);
        expect(player2.score).toBe(21);
    });

    it('asserts stand changes active player to the next one', () => {
        const initialActivePlayer = gameState['getActivePlayer']();
        gameState.stand();
        const alteredActivePlayer = gameState['getActivePlayer']();
        expect(initialActivePlayer.id).not.toEqual(alteredActivePlayer.id);
    });
});
