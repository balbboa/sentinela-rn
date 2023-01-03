// Abordagem
export interface IApproachRegister {
  id: string;
  addres: IAddressRegister;
  location: ILocationRegister;
  description: string;
  organizationsId: number;
  photos: IPhotoRegister[];
  peoples: IPeopleRegister[];
  vehicles: IVehicleRegister[];
}

// Endereço
export interface IAddressRegister {
  id: string;
  street: string;
  district: string;
  number: string;
  city: string;
  state: string;
}

// Localização
export interface ILocationRegister {
  id: string;
  latitude: string;
  longitude: string;
}

// Pessoas
export interface IPeopleRegister {
  id: string;
  name: string;
  aka: string;
  motherName: string;
  sex: string;
  birthday: string;
  filiation: number;
  document: string;
  organizationsId: number;
  address: IAddressRegister;
  photos: IPhotoRegister[];
}

//Veículos
export interface IVehicleRegister {
  id: string;
  plate: string;
  photos: IPhotoRegister[];
}

// Fotos
export interface IPhotoRegister {
  id: string;
  description?: string;
  path: string;
  type: string;
}
