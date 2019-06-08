import exists from '../src/exists'
import Match from '../src/match'
import Player from '../src/player'

const fixtureDefinitions = {
  player: {
    klass: Player,
    args: {
      player_number: 1,
      name: 'aaa',
      resigned: false
    }
  },
  match: {
    klass: Match,
    args: {
      id: 1,
      game_state: {
        currentPlayerNumber: 1,
        winner: null
      },
      players: [
        { name: 'aaa', player_number: 1, resigned: false },
        { name: 'bbb', player_number: 2, resigned: false }
      ],
      last_action: {},
      notification: null
    }
  },
  winnerMatch: {
    klass: Match,
    args: {
      id: 1,
      game_state: {
        currentPlayerNumber: 1,
        winner: 2 
      },
      players: [
        { name: 'aaa', player_number: 1, resigned: false },
        { name: 'bbb', player_number: 2, resigned: false }
      ],
      last_action: {},
      notification: null
    }
  },
  resignedMatch: {
    klass: Match,
    args: {
      id: 1,
      game_state: {
        currentPlayerNumber: 1,
        winner: null
      },
      players: [
        { name: 'aaa', player_number: 1, resigned: true },
        { name: 'bbb', player_number: 2, resigned: false }
      ],
      last_action: {},
      notification: null
    }
  }
}

const deepMerge = function(aObject, bObject) {
  let cObject = {};
  
  let aObjectKeys = [];
  let bObjectKeys = [];

  if (exists(aObject)) {
    aObjectKeys = Object.keys(aObject);
  }

  if (exists(bObject)) {
    bObjectKeys = Object.keys(bObject);
  }

  let keys = [...new Set([...aObjectKeys, ...bObjectKeys])]; 

  keys.forEach(function(k) {
    let aValue = undefined;
    let bValue = undefined;

    if (exists(aObject)) {
      aValue = aObject[k];
    }

    if (exists(bObject)) {
      bValue = bObject[k];
    }

    let cValue = undefined;
    
    if (exists(bValue)) {
      if (bValue.constructor === Object) {
        cValue = deepMerge(aValue, bValue);
      } else {
        cValue = bValue;
      }
    } else {
      cValue = aValue;
    }

    aObject[k] = cValue;
  });

  return cObject;
};

const fixtures = function(name, customArgs) {
  let definition = fixtureDefinitions[name];
  let args = undefined;

  if (definition.args.constructor === Array) {
    if (exists(customArgs)) {
      args = customArgs;
    } else {
      args = definition.args;
    }
  } else {
    if (exists(customArgs)) {
      args = deepMerge(definition.args, customArgs);
    } else {
      args = Object.assign({}, definition.args);
    }
  }

  return new definition.klass(args);
};

export default fixtures
