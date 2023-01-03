import {PermissionsAndroid} from 'react-native';
import {getSession} from '../services/controllers/sessionController';
import {findUser} from '../services/controllers/userController';

// Formata a data
export const getFullDateUTC = (b = new Date()) => {
  const d = b.getDate() <= 9 ? `0${b.getDate()}` : b.getDate();
  const m = b.getMonth() + 1 <= 9 ? `0${b.getMonth() + 1}` : b.getMonth() + 1;
  return `${d}/${m}/${b.getFullYear()}`;
};

// Obtem o usuário logado da sessão.
export const getUserSession = async () => {
  const session = await getSession();
  const user = await findUser(session.userId);
  return user;
};

export const requestCameraPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'App Permissão de Câmera',
      message: 'O App precisa de acesso à câmera.',
      buttonNegative: 'Cancelar',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
};
