import Player from '../src/player'
import { buildNotification, matchAsJson, winner, buildPlayers, buildLastAction } from '../src/match'

describe('Match', () => {
  describe('buildPlayers', () => {
    it('returns an array of players', () => {
      let players = [
        { name: 'aaa', player_number: 1, resigned: false },
        { name: 'bbb', player_number: 2, resigned: false }
      ];
      expect(buildPlayers(players).every(function(p) { return p.constructor === Player })).toBe(true);
    });
  });

  describe('buildLastAction', () => {
    describe('with nothing', () => {
      it('returns empty object', () => {
        expect(buildLastAction(undefined)).toEqual(null);
      });
    });

    describe('with something', () => {
      it('returns the thing', () => {
        expect(buildLastAction({kind: 'move'})).toEqual({kind: 'move'});

      });
    });
  });

  describe('buildNotification', () => {
    describe('with no winner', () => {
      it('returns the players turn message', () => {
        let match = { 
          winner: null, 
          gameState: {
            currentPlayerNumber: 1
          },
          players: [
            { name: 'aaa', playerNumber: 1, resigned: false }, 
            { name: 'bbb', playerNumber: 2, resigned: false } 
          ] 
        };
        expect(buildNotification(match)).toEqual('aaa to move');
      });
    });

    describe('with winner', () => {
      it('returns the winner message', () => {
        let match = { 
          winner: 2, 
          players: [
            { name: 'aaa', playerNumber: 1, resigned: false }, 
            { name: 'bbb', playerNumber: 2, resigned: false } 
          ] 
        };
        expect(buildNotification(match, null)).toEqual('bbb wins');
      });
    });
  });

  describe('matchAsJson', () => {
    it('must return the match serialized as json', () => {
      let match = {
        id: 1,
        gameState: {
          asJson: {}
        },
        players: [
          new Player({name: 'aaa', player_number: 1, resigned: false}),
          new Player({name: 'bbb', player_number: 2, resigned: false}) 
        ],
        lastAction: {},
        notification: 'aaa to move'
      };

      expect(matchAsJson(match)).toEqual({
        id: 1,
        game_state: {},
        players: [
          { name: 'aaa', player_number: 1, resigned: false },
          { name: 'bbb', player_number: 2, resigned: false }
        ],
        last_action: {},
        notification: 'aaa to move'
      });
    });
  });

  describe('winner', () => {
    describe('with someone winning on the board', () => {
      it('must return the player number of the winner', () => {
        let match = { 
          gameState: {
            winner: 2 
          },
          players: [
            { name: 'aaa', playerNumber: 1, resigned: false }, 
            { name: 'bbb', playerNumber: 2, resigned: false } 
          ] 
        };
        expect(winner(match)).toEqual(2);
      });
    });

    describe('with no one winning on the board', () => {
      it('must return null', () => {
        let match = { 
          gameState: {
            winner: null 
          },
          players: [
            { name: 'aaa', playerNumber: 1, resigned: false }, 
            { name: 'bbb', playerNumber: 2, resigned: false } 
          ] 
        };
        expect(winner(match)).toBe(null);
      });
    });

    describe('with someone resigning', () => {
      it('must return the number of the player who did not resign', () => {
        let match = { 
          gameState: {
            winner: null 
          },
          players: [
            { name: 'aaa', playerNumber: 1, resigned: true }, 
            { name: 'bbb', playerNumber: 2, resigned: false } 
          ] 
        };
        expect(winner(match)).toEqual(2);
      });
    });
  });
});
