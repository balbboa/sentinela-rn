import getRealm from '../realm';
// Interfaces
import {findUser} from './userController';

export interface ISession {
  id: string;
  userId: number;
  organizationsId: number;
  remember: boolean;
  created_at: Date;
}

// Cria um uma nova sessão
export const createSession = async (session: ISession) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria a sessão
  realm.write(() => {
    realm.create('Session', session);
  });
  return session;
};

// Retorna uma sessão ou undefined
export const getSession = async () => {
  // Inicia o Realm
  const realm = await getRealm();
  const session = realm.objects<ISession>('Session')[0];
  return session;
};

// Remove as sessões do celular
export const destroySessions = async () => {
  // Inicia o Realm
  const realm = await getRealm();
  const sessions = realm.objects('Session');
  if (sessions.length > 0) {
    realm.write(() => {
      realm.delete(realm.objects('Session'));
    });
  }
};
