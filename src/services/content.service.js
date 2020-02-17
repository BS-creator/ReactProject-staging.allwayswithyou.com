import { apiUrl } from '../helpers';
import axios from 'axios';

export const contentService = {
  get,
  remove,
};

function get() {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Content').then(response => {
      const content = response.data;
      return resolve(content);
    }).catch(error => {
      return reject(error);
    });
  });
}

function remove(assetIds) {
  let queryParams = `?${assetIds.map(assetId => { return `assetId=${assetId}` }).join("&")}`;

  return new Promise((resolve, reject) => {
    axios.delete(apiUrl() + '/api/v1/Content' + queryParams).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}