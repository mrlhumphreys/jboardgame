import fixtures from './fixtures'
import Match from '../src/match'

describe('Match', () => {
  describe('initialize', () => {
    describe('with no winner', () => {
      it('sets the notification to a players turn message', () => {
        let match = fixtures('match');
        expect(match.notification).toEqual('aaa to move');
      });
    });

    describe('with winner', () => {
      it('sets the notification to winner message', () => {
        let match = fixtures('winnerMatch');
        expect(match.notification).toEqual('bbb wins');
      });
    });
  });

  describe('asJson', () => {
    it('must return the match serialized as json', () => {
      let match = fixtures('match');
      expect(match.asJson).toEqual({
        id: 1,
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
        let match = fixtures('winnerMatch');
        expect(match.winner).toEqual(2);
      });
    });

    describe('with no one winning on the board', () => {
      it('must return null', () => {
        let match = fixtures('match');
        expect(match.winner).toBe(null);
      });
    });

    describe('with someone resigning', () => {
      it('must return the number of the player who did not resign', () => {
        let match = fixtures('resignedMatch');
        expect(match.winner).toEqual(2);
      });
    });
  });
});
