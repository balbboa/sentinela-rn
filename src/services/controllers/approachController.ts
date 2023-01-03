import {
  IPeopleRegister,
  IPhotoRegister,
  IVehicleRegister,
} from '../../pages/NewApproach/interfaces';
import getRealm from '../realm';
import {
  createAddress,
  getAddressByApproach,
  IAddress,
  removeAddressByApproachId,
} from './addressController';
import {
  createPeople,
  getPeoplesByApproachId,
  IPeople,
  removePeopleByApproachId,
} from './peopleController';
import {
  createPhoto,
  getPhotoByApproachId,
  IPhoto,
  removePhotoByApproachId,
} from './photoController';
import {
  createVehicle,
  getVehicleByApproachId,
  IVehicle,
  removeVehicleApproachById,
} from './vechicleController';
// UUID
import uuid from 'react-native-uuid';
export interface IApproach {
  id: string;
  userId: number;
  description: string;
  latitude: string;
  longitude: string;
  organizationsId: number;
  address: IAddress;
  photos: IPhotoRegister[];
  people: IPeopleRegister[];
  vehicles: IVehicleRegister[];
  createdAt: Date;
}

export const createApproach = async (approach: IApproach) => {
  // Inicia o Realm
  const realm = await getRealm();
  const approachId = String(uuid.v4());
  // Cria a pessoa
  realm.write(() => {
    realm.create('Approach', {
      id: approachId,
      userId: approach.userId,
      description: approach.description,
      organizationsId: approach.organizationsId,
      latitude: approach.latitude,
      longitude: approach.longitude,
      createdAt: new Date(),
    });
  });

  await createAddress({
    city: approach.address.city,
    district: approach.address.district,
    createdAt: new Date(),
    id: String(uuid.v4()),
    number: approach.address.number,
    state: approach.address.state,
    street: approach.address.street,
    approachId: approachId,
  });

  for await (const photo of approach.photos) {
    await createPhoto({
      id: String(uuid.v4()),
      description: photo.description,
      path: photo.path,
      approachId: approachId,
      type: photo.type,
    });
  }

  for await (const people of approach.people) {
    const peopleId = String(uuid.v4());
    await createPeople({
      aka: people.aka,
      organizationsId: people.organizationsId,
      approachId: approachId,
      birthday: people.birthday,
      id: peopleId,
      name: people.name,
      motherName: people.motherName,
      sex: people.sex,
      filiation: people.filiation,
      document: people.document,
    });
    for await (const photo of people.photos) {
      await createPhoto({
        id: String(uuid.v4()),
        path: photo.path,
        peopleId: peopleId,
        type: photo.type,
      });
    }

    await createAddress({
      city: people.address.city,
      district: people.address.district,
      createdAt: new Date(),
      id: String(uuid.v4()),
      number: people.address.number,
      state: people.address.state,
      street: people.address.street,
      peopleId: peopleId,
    });
  }

  for await (const vehicle of approach.vehicles) {
    const vehicleId = String(uuid.v4());
    await createVehicle({
      id: vehicleId,
      approachId: approachId,
      plate: vehicle.plate,
    });
    for await (const photo of vehicle.photos) {
      await createPhoto({
        id: String(uuid.v4()),
        path: photo.path,
        vehicleId: vehicleId,
        type: photo.type,
      });
    }
  }

  return approach;
};

export const getApproach = async (id: string) => {
  const realm = await getRealm();
  const approach = realm
    .objects<IApproach>('Approach')
    .filtered(`id = '${id}'`)[0];
  const photos = realm
    .objects<IPhoto>('Photos')
    .filtered(`approachId = '${id}'`);
  const address = realm
    .objects<IAddress>('Address')
    .filtered(`approachId = '${id}'`)[0];
  const people = realm
    .objects<IPeople>('People')
    .filtered(`approachId = '${id}'`);
  const vechicle = realm
    .objects<IVehicle>('Vechicle')
    .filtered(`approachId = '${id}'`);
  return {approach, address, people, vechicle, photos};
};

interface IApproachRealm {
  id: string;
  userId: number;
  organizationsId: number;
  description: string;
  latitude: string;
  longitude: string;
  createdAt: Date;
}

export const getApproachs = async () => {
  const realm = await getRealm();
  const approachs = realm.objects<IApproachRealm>('Approach');
  const getApproach: IApproach[] = [];
  for await (const approach of approachs) {
    // Endereço
    const address = await getAddressByApproach(approach.id);
    // Fotos
    const getPhotos = await getPhotoByApproachId(approach.id);
    const photos: IPhotoRegister[] = [];
    for await (const photo of getPhotos) {
      photos.push({
        id: photo.id,
        path: photo.path,
        type: photo.type,
        description: photo.description,
      });
    }
    // Pessoas
    const people = await getPeoplesByApproachId(approach.id);
    const vehicle = await getVehicleByApproachId(approach.id);
    getApproach.push({
      address: address,
      organizationsId: approach.organizationsId,
      id: approach.id,
      description: approach.description,
      userId: approach.userId,
      latitude: approach.latitude,
      longitude: approach.longitude,
      photos: photos,
      people: people,
      vehicles: vehicle,
      createdAt: approach.createdAt,
    });
  }

  return getApproach;
};

export const removeApproachById = async (id: string) => {
  const realm = await getRealm();
  const approach = realm
    .objects<IApproach>('Approach')
    .filtered(`id = '${id}'`);
  if (approach.length) {
    for await (const a of approach) {
      await removeAddressByApproachId(a.id);
      await removePeopleByApproachId(a.id);
      await removePhotoByApproachId(a.id);
      await removeVehicleApproachById(a.id);
      realm.write(() => {
        realm.delete(a);
      });
    }
  }
};
