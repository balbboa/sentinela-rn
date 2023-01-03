import {
  IPeopleRegister,
  IPhotoRegister,
} from '../../pages/NewApproach/interfaces';
import getRealm from '../realm';
import {getAddressByPeople, IAddress} from './addressController';
import {getPhotoByPeopleId, IPhoto} from './photoController';

export interface IPeople {
  id: string;
  approachId: string;
  organizationsId: number;
  name: string;
  aka: string;
  motherName: string;
  sex: string;
  birthday: string;
  filiation: number;
  document: string;
}

export const createPeople = async (people: IPeople) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria a pessoa
  realm.write(() => {
    realm.create('People', people);
  });

  return people;
};

export const getPeople = async (id: string) => {
  const realm = await getRealm();
  const people = realm.objects<IPeople>('People').filtered(`id = '${id}'`)[0];
  const photos = realm.objects<IPhoto>('Photos').filtered(`peopleId = '${id}'`);
  const address = realm
    .objects<IAddress>('Address')
    .filtered(`peopleId = '${id}'`)[0];
  return {
    people,
    photos,
    address,
  };
};

export const getPeoplesByApproachId = async (id: string) => {
  const realm = await getRealm();
  const peoples: IPeopleRegister[] = [];
  const people = realm
    .objects<IPeople>('People')
    .filtered(`approachId = '${id}'`);
  for await (const p of people) {
    const address = await getAddressByPeople(p.id);
    const photos: IPhotoRegister[] = [];
    const getPhotos = await getPhotoByPeopleId(p.id);
    for (let i = 0; i < getPhotos.length; i++) {
      photos.push({
        id: getPhotos[i].id,
        path: getPhotos[i].path,
        type: getPhotos[i].type,
      });
    }
    peoples.push({
      address: address,
      organizationsId: p.organizationsId,
      id: p.id,
      name: p.name,
      aka: p.aka,
      motherName: p.motherName,
      sex: p.sex,
      birthday: p.birthday,
      filiation: p.filiation,
      document: p.document,
      photos: photos,
    });
  }

  return peoples;
};

export const removePeopleById = async (id: string) => {
  const realm = await getRealm();
  const people = realm.objects('People').filtered(`id = '${id}'`);
  if (people.length > 0) {
    realm.write(() => {
      realm.delete(people);
    });
  }
};

export const removePeopleByApproachId = async (id: string) => {
  const realm = await getRealm();
  const people = realm
    .objects<IPeople>('People')
    .filtered(`approachId = '${id}'`);
  if (people.length > 0) {
    for await (const p of people) {
      const address = realm.objects('Address').filtered(`peopleId = '${p.id}'`);
      const photo = realm.objects('Photo').filtered(`peopleId = '${p.id}'`);
      realm.write(() => {
        realm.delete(photo);
        realm.delete(address);
        realm.delete(p);
      });
    }
  }
};
