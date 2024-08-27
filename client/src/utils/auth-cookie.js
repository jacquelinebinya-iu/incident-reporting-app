import * as Cookies from 'js-cookie';

import { JWT_TOKEN } from '../constants';

export const setSessionCookie = (token) => {
  Cookies.remove(JWT_TOKEN);
  Cookies.set(JWT_TOKEN, token, { expires: 7 });
};

export const getSessionCookie = () => {
  const jwtToken = Cookies.get(JWT_TOKEN);

  if (jwtToken === undefined) {
    return {};
  } else {
    return JSON.parse(jwtToken);
  }
};

export const removeSessionCookie = () => {};
