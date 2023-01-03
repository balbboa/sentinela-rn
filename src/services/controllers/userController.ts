import getRealm from '../realm';

// Interfaces
export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  registration: string;
  status: boolean;
  organizationName: string;
  organizationsId: number;
  token: string;
}
// Cria um novo usuário
export const createUser = async (user: IUser) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Cria o usuário
  realm.write(() => {
    realm.create('User', user);
  });

  return user;
};

// Edita um usuário
export const updateUser = async (user: IUser) => {
  // Inicia o Realm
  const realm = await getRealm();
  // Busca pelo o usuário
  const getUser = await findUser(user.id);
  // Se o usuário não existir é retornado um erro.
  if (getUser)
    realm.write(() => {
      // Atualiza o usuário
      getUser.id = user.id;
      getUser.name = user.name;
      getUser.email = user.email;
      getUser.organizationsId = user.organizationsId;
      getUser.password = user.password;
      getUser.registration = user.registration;
      getUser.status = user.status;
      getUser.organizationName = user.organizationName;
      getUser.token = user.token;
    });
  return getUser;
};

// Retorna um usuário ou undefined
export const findUser = async (id: number) => {
  // Inicia o Realm
  const realm = await getRealm();
  const user = realm.objects<IUser>('User').filtered(`id = '${id}'`)[0];
  return user;
};

// Retorna um usuário ou undefined
export const findUserByUsername = async (username: string) => {
  // Inicia o Realm
  const realm = await getRealm();
  const user = realm
    .objects<IUser>('User')
    .filtered(`email = '${username}'`)[0];
  return user;
};

// Retorna todos os usuarios do sistema
export const getUsers = async () => {
  // Inicia o Realm
  const realm = await getRealm();
  const user = realm.objects<IUser>('User');
  return user;
};
