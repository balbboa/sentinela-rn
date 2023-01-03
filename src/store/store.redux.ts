import {legacy_createStore as createStore} from 'redux';
import {INITIAL_APPROACH} from './initialData';

const reducer = (state = INITIAL_APPROACH, action: any) => {
  if (action.type === 'SET_APPROACH') {
    return {
      ...state,
      approach: action.newApproach,
    };
  }
  if (action.type === 'SET_SYNC_APPROACH_LENGTH') {
    return {
      ...state,
      syncApproachLength: action.newSyncApproachLength,
    };
  }
  if (action.type === 'SET_PEOPLE') {
    return {
      ...state,
      people: action.newPeople,
    };
  }
  return state;
};

const store = createStore(reducer);

export default store;
