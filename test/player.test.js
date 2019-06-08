import fixtures from './fixtures'

describe('Player', () => {
  describe('asJson', () => {
    it('must return the player as json', () => {
      let player = fixtures('player');
      let expected = {
        player_number: 1,
        name: 'aaa',
        resigned: false
      };
      expect(player.asJson()).toEqual(expected);
    });
  });
});
