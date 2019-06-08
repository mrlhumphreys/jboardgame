import Player from '../src/player'

describe('Player', () => {
  describe('asJson', () => {
    it('must return the player as json', () => {
      let player = new Player({ 
        player_number: 1,
        name: 'aaa',
        resigned: false
      });
      let expected = {
        player_number: 1,
        name: 'aaa',
        resigned: false
      };
      expect(player.asJson()).toEqual(expected);
    });
  });
});
