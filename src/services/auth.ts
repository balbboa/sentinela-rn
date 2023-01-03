// Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// Controllers
import {getSession} from './controllers/sessionController';
import {findUser} from './controllers/userController';
// JWT
import {parseJwt} from './jwt';

// Verifica se o token da API está válido
export const isAuthenticated = async () => {
  const token = await getToken();
  try {
    if (token) {
      const {expires_in}: any = parseJwt(token);
      if (Date.now() >= expires_in * 1000) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log('Erro no isAuthenticated');
  }
};

// Retorna o Token
export const getToken = async () => {
  const session = await getSession();
  const user = await findUser(session.userId);
  return user.token;
};

// Verifica se existe uma sessão
export const isSession = async () => {
  try {
    await getSession();
    return true;
  } catch (error) {
    console.log('======Erro na sessão======');
    console.log(error);
    console.log('======end======');
    return false;
  }
};
