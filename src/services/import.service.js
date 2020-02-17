import { apiUrl } from '../helpers';
import axios from 'axios';

export const importService = {
  importAssets
};

function importAssets(assets, albumId) {
  var url = apiUrl() + '/api/v1/ImportMedia';
  if (albumId) {
    url = url.concat('/').concat(albumId);
  }
  return new Promise((resolve, reject) => {
    axios.post(url, assets).then(response => {
      const assets = response.data;
      return resolve(assets);
    }).catch(error => {
      return reject(error);
    });
  });
}
