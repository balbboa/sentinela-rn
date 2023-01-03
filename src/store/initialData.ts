import {
  IAddressRegister,
  IApproachRegister,
  IPeopleRegister,
} from '../pages/NewApproach/interfaces';

export const INITIAL_ADDRESS: IAddressRegister = {
  city: '',
  district: '',
  id: '',
  number: '',
  state: '',
  street: '',
};

export const INITIAL_APPROACH: IApproachRegister = {
  addres: INITIAL_ADDRESS,
  organizationsId: 0,
  description: '',
  id: '',
  location: {
    id: '',
    latitude: '',
    longitude: '',
  },
  peoples: [],
  photos: [],
  vehicles: [],
};

export const INITIAL_PEOPLE: IPeopleRegister = {
  address: INITIAL_ADDRESS,
  aka: '',
  birthday: '',
  document: '',
  filiation: 1,
  id: '',
  motherName: '',
  name: '',
  photos: [],
  sex: 'MASCULINO',
  organizationsId: 0,
};
