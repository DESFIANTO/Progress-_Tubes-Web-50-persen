import { AuthToken } from '@/modules/auth/auth-token';
import Axios from 'axios';
import config from '@/config';
import { getLanguageCode } from '@/i18n';

const authAxios = Axios.create({
  baseURL: config.backendUrl,
  paramsSerializer: {
    indexes:false
  },
});

authAxios.interceptors.request.use(
  async function(options) {
    const token = await AuthToken.get();

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    options.headers['Accept-Language'] = getLanguageCode();

    return options;
  },
  function(error) {
    console.log('Request error: ', error);
    return Promise.reject(error);
  },
);

export default authAxios;
