import { apiUrl } from '../helpers';
import axios from 'axios';

export const storageInfoService = {
    get,
};

function get(){
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/StorageInfo').then(response => {
      const storageInfo = response.data;

      return resolve(storageInfo);
    }).catch(error => {
      return reject(error);
    });
  });
}
