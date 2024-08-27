import axios from 'axios';

import { API_PATH } from '../constants/index.js';

const pathify = (path) => {
  if (path === '/') {
    return API_PATH;
  }
  const url = new URL(path, API_PATH);
  return url.href;
};

const validateHeaders = (options) => {
  if (options.headers && Object.keys(options.headers).length === 0) {
    const modifiedOptions = { ...options };
    modifiedOptions.headers = { ...baseHeaders };
    return modifiedOptions;
  }
  return options;
};

const handleApiError = (e) => {
  console.log('🟢🟢🟢🟢🟢', e);
  if (!e.response) {
    console.error('Network or configuration issue.');
    throw { message: 'Network or configuration issue', status: 500 };
  }

  const statusCode = e.response.status;
  const errorMessage = e.response.data?.errorMessage || 'No error message provided.';

  console.error(`API Error: Status Code ${statusCode}, ErrorMessage: ${errorMessage}`);

  throw { errorMessage: errorMessage, status: statusCode };
};

const baseHeaders = {
  'Content-Type': 'application/json',
};

class API {
  static get = async (path, options) => {
    const token = localStorage.getItem('IRA_ACCESS_TOKEN');
    const authHeaders = token
      ? {
          ...baseHeaders,
          Authorization: `Bearer ${token}`,
        }
      : baseHeaders;

    try {
      const response = await axios.get(
        pathify(path),
        validateHeaders({
          headers: authHeaders,
          ...options,
        })
      );
      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };

  static post = async (path, data, options) => {
    const token = localStorage.getItem('IRA_ACCESS_TOKEN');
    const authHeaders = token
      ? {
          ...baseHeaders,
          Authorization: `Bearer ${token}`,
        }
      : baseHeaders;
    try {
      const response = await axios.post(
        pathify(path),
        data,
        validateHeaders({
          headers: authHeaders,
          ...options,
        })
      );
      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };

  static patch = async (path, data, options) => {
    const token = localStorage.getItem('IRA_ACCESS_TOKEN');
    console.log('🟢🟢🟢TOKEN🟢🟢', token);
    const authHeaders = token
      ? {
          ...baseHeaders,
          Authorization: `Bearer ${token}`,
        }
      : baseHeaders;
    try {
      const response = await axios.patch(
        pathify(path),
        data,
        validateHeaders({
          headers: authHeaders,
          ...options,
        })
      );
      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };

  static put = async (path, data, options) => {
    const token = localStorage.getItem('IRA_ACCESS_TOKEN');
    const authHeaders = token
      ? {
          ...baseHeaders,
          Authorization: `Bearer ${token}`,
        }
      : baseHeaders;
    try {
      const response = await axios.put(
        pathify(path),
        data,
        validateHeaders({
          headers: authHeaders,
          ...options,
        })
      );
      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };

  static delete = async (path, options) => {
    const token = localStorage.getItem('IRA_ACCESS_TOKEN');
    const authHeaders = token
      ? {
          ...baseHeaders,
          Authorization: `Bearer ${token}`,
        }
      : baseHeaders;
    try {
      const response = await axios.delete(
        pathify(path),
        validateHeaders({
          headers: authHeaders,
          ...options,
        })
      );
      return response.data;
    } catch (e) {
      handleApiError(e);
    }
  };
}

export { API };
