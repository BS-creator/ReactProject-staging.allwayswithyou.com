import { apiUrl } from '../helpers';
import axios from 'axios';

export const rfnService = {
    get,
    put,
};

function get(){
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Rfn').then(response => {
      const rfn = response.data;
      return resolve(rfn);
    }).catch(error => {
      return reject(error);
    });
  });
}

function put(rfn){
  return new Promise((resolve, reject) => {
    axios.put(apiUrl() + '/api/v1/Rfn', rfn).then(response => {
      const rfn = response.data;
      return resolve(rfn);
    }).catch(error => {
      return reject(error);
    });
  });
}
