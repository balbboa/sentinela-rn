import getRealm from '../realm';

export interface IAddress {
  id: string;
  approachId?: string;
  peopleId?: string;
  street: string;
  district: string;
  number: string;
  city: string;
  state: string;
  createdAt: Date;
}

export const createAddress = async (address: IAddress) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria o endereço
  realm.write(() => {
    realm.create('Address', address);
  });

  return address;
};

export const getAddressByPeople = async (id: string) => {
  const realm = await getRealm();
  const address = realm
    .objects<IAddress>('Address')
    .filtered(`peopleId = '${id}'`)[0];
  return address;
};

export const getAddressByApproach = async (id: string): Promise<IAddress> => {
  const realm = await getRealm();
  const address = realm
    .objects<IAddress>('Address')
    .filtered(`approachId = '${id}'`)[0];
  return address;
};

export const removeAddressByApproachId = async (id: string) => {
  const realm = await getRealm();
  const address = realm.objects('Address').filtered(`approachId = '${id}'`)[0];
  if (address) {
    realm.write(() => {
      realm.delete(address);
    });
  }
};

export const removeAddressByPeopleId = async (id: string) => {
  const realm = await getRealm();
  const address = realm.objects('Address').filtered(`peopleId = '${id}'`)[0];
  if (address) {
    realm.write(() => {
      realm.delete(address);
    });
  }
};
