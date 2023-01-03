import getRealm from '../realm';

export interface IFiliation {
  id: number;
  name: string;
}

export const createFiliation = async (filiation: IFiliation) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria a filiação
  realm.write(() => {
    realm.create('Filiation', filiation);
  });

  return filiation;
};

export const getFiliations = async () => {
  // Inicia o Realm
  const realm = await getRealm();
  const filiations = realm.objects<IFiliation>('Filiation');
  return filiations;
};

export const removeAllFiliations = async () => {
  const realm = await getRealm();
  const filiations = realm.objects('Filiation');
  if (filiations.length > 0) {
    realm.write(() => {
      realm.delete(realm.objects('Filiation'));
    });
  }
};
