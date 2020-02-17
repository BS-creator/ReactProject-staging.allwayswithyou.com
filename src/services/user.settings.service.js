import { apiUrl } from '../helpers';
import axios from 'axios';

export const userSettingsService = {
    get,
    create,
    update,
};

function get(){
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/UserSettings').then(response => {
      const settings = response.data;
      return resolve(settings);
    }).catch(error => {
      return reject(error);
    });
  });
}

function create(settings){
  return new Promise((resolve, reject) => {
      axios.post(apiUrl() + '/api/v1/UserSettings', settings).then(response => {
        const success = response.data;
        return resolve(success);
      }).catch(error => {
        return reject(error);
      });
    });    
}

function update(settings){
  return new Promise((resolve, reject) => {
      axios.put(apiUrl() + '/api/v1/UserSettings', settings).then(response => {
        const success = response.data;
        return resolve(success);
      }).catch(error => {
        return reject(error);
      });
    });    
}