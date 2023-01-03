import jwt_decode from 'jwt-decode';

export const parseJwt = (token: string) => {
  return jwt_decode(token);
};
