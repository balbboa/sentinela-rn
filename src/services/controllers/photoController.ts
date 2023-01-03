import getRealm from '../realm';

export interface IPhoto {
  id: string;
  approachId?: string;
  peopleId?: string;
  vehicleId?: string;
  description?: string;
  path: string;
  type: string;
}

export const createPhoto = async (photo: IPhoto) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria a foto
  realm.write(() => {
    realm.create('Photo', photo);
  });

  return photo;
};

export const getPhoto = async (id: string) => {
  const realm = await getRealm();
  const photo = realm.objects<IPhoto>('Photo').filtered(`id = '${id}'`)[0];
  return photo;
};

export const getPhotoByApproachId = async (id: string) => {
  const realm = await getRealm();
  const photo = realm.objects<IPhoto>('Photo').filtered(`approachId = '${id}'`);
  return photo;
};

export const getPhotoByPeopleId = async (id: string) => {
  const realm = await getRealm();
  const photo = realm.objects<IPhoto>('Photo').filtered(`peopleId = '${id}'`);
  return photo;
};

export const getPhotoByVehicleId = async (id: string) => {
  const realm = await getRealm();
  const photo = realm.objects<IPhoto>('Photo').filtered(`vehicleId = '${id}'`);
  return photo;
};

export const removePhotoByPeopleId = async (id: string) => {
  const realm = await getRealm();
  const photo = realm.objects('Photo').filtered(`peopleId = '${id}'`);
  if (photo.length > 0) {
    realm.write(() => {
      realm.delete(photo);
    });
  }
};

export const removePhotoByApproachId = async (id: string) => {
  const realm = await getRealm();
  const photo = realm.objects('Photo').filtered(`approachId = '${id}'`);
  if (photo.length > 0) {
    realm.write(() => {
      realm.delete(photo);
    });
  }
};

export const removePhotoByVehicleId = async (id: string) => {
  const realm = await getRealm();
  const vehicle = realm.objects('Photo').filtered(`vehicleId = '${id}'`);
  if (vehicle.length > 0) {
    realm.write(() => {
      realm.delete(vehicle);
    });
  }
};
