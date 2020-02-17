import { analyticsApiUrl, apiUrl } from '../helpers';
import axios from 'axios';

export const statsServices = {
  get,
  getUploadersStats
};

function get(payload) {

  return new Promise((resolve, reject) => {
    axios.get(analyticsApiUrl() + '/api/v1/Report?start=' + payload.start + '&end=' + payload.end).then(response => {
      const stats = response.data;
      return resolve({stats, payload});
    }).catch(error => {
      return reject(error);
    });
  });
}

function getUploadersStats(payload) {

  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Uploaders?start=' + payload.start + '&end=' + payload.end).then(response => {
      const stats = response.data;
      return resolve({stats, payload});
    }).catch(error => {
      return reject(error);
    });
  });
}