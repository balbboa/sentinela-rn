import {
  IApproachRegister,
  IPeopleRegister,
} from '../pages/NewApproach/interfaces';

// Action do Redux para informar a quantidade de sincronizações
export const setSyncApproachLength = (
  syncApproachLength: number,
  newSyncApproachLength: number,
) => {
  return {
    type: 'SET_SYNC_APPROACH_LENGTH',
    syncApproachLength,
    newSyncApproachLength,
  };
};

// Action do Redux para alterar a abordagem
export const setApproach = (
  approach: IApproachRegister,
  newApproach: IApproachRegister,
) => {
  return {
    type: 'SET_APPROACH',
    approach,
    newApproach,
  };
};

// Action do Redux para pessoas

export const setPeople = (
  people: IPeopleRegister,
  newPeople: IPeopleRegister,
) => {
  return {
    type: 'SET_PEOPLE',
    people,
    newPeople,
  };
};
