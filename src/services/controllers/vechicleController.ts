import {
  IPhotoRegister,
  IVehicleRegister,
} from '../../pages/NewApproach/interfaces';
import getRealm from '../realm';
import {
  getPhotoByVehicleId,
  IPhoto,
  removePhotoByVehicleId,
} from './photoController';

export interface IVehicle {
  id: string;
  approachId: string;
  plate: string;
}

export const createVehicle = async (vehicle: IVehicle) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria um veículo
  realm.write(() => {
    realm.create('Vehicle', vehicle);
  });

  return vehicle;
};

export const getVehicle = async (id: string) => {
  const realm = await getRealm();
  const vehicle = realm
    .objects<IVehicle>('Vehicle')
    .filtered(`id = '${id}'`)[0];
  const photos = realm
    .objects<IPhoto>('Photos')
    .filtered(`approachId = '${id}'`);
  return {vehicle, photos};
};

export const getVehicleByApproachId = async (id: string) => {
  const realm = await getRealm();
  const vehicles: IVehicleRegister[] = [];
  const vehicle = realm
    .objects<IVehicle>('Vehicle')
    .filtered(`approachId = '${id}'`);
  for await (const v of vehicle) {
    const photos: IPhotoRegister[] = [];
    const getPhotos = await getPhotoByVehicleId(v.id);
    for (let i = 0; i < getPhotos.length; i++) {
      photos.push({
        id: getPhotos[i].id,
        path: getPhotos[i].path,
        type: getPhotos[i].type,
      });
    }
    vehicles.push({id: v.id, plate: v.plate, photos});
  }
  return vehicles;
};

export const removeVehicleApproachById = async (id: string) => {
  const realm = await getRealm();
  const vehicle = realm
    .objects<IVehicle>('Vehicle')
    .filtered(`approachId = '${id}'`);
  if (vehicle.length > 0) {
    for await (const v of vehicle) {
      await removePhotoByVehicleId(v.id);
      realm.write(() => {
        realm.delete(v);
      });
    }
  }
};
