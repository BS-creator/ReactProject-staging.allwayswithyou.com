import { apiUrl } from '../helpers';
import axios from 'axios';

export const albumService = {
  createAlbum,
  get,
  getAll,
  remove,
  update,
  addAssets,
  removeAssets
};

function createAlbum(album) {
  return new Promise((resolve, reject) => {
    axios.post(apiUrl() + '/api/v1/Album', album).then(response => {
      const album = response.data;
      return resolve(album);
    }).catch(error => {
      return reject(error);
    });
  });
}

function get(id) {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Album/' + id).then(response => {
      const album = response.data;
      return resolve(album);
    }).catch(error => {
      return reject(error);
    });
  });
}

function getAll() {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Album').then(response => {
      const albums = response.data;
      return resolve(albums);
    }).catch(error => {
      return reject(error);
    });
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    axios.delete(apiUrl() + '/api/v1/Album?id=' + id).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

function update(albumId, albumUpdate) {
  const config = {
    headers: {
      'content-type': 'application/json',
    }
  }

  return new Promise((resolve, reject) => {
    axios.patch(apiUrl() + '/api/v1/Album/' + albumId, JSON.stringify(albumUpdate), config).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

function addAssets(albumId, assetIds) {
  const config = {
    headers: {
      'content-type': 'application/json',
    }
  }

  return new Promise((resolve, reject) => {
    axios.post(apiUrl() + '/api/v1/Album/' + albumId + '/Content', assetIds, config).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

function removeAssets(albumId, assetIds) {
  const config = {
    headers: {
      'content-type': 'application/json',
    }
  }

  let queryParams = `?${assetIds.map(assetId => { return `assetId=${assetId}` }).join("&")}`;

  return new Promise((resolve, reject) => {
    axios.delete(apiUrl() + '/api/v1/Album/' + albumId + '/Content' + queryParams, config).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}