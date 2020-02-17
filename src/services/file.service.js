import { apiUrl } from '../helpers';
import axios from 'axios';

export const fileService = {
    post,
    getImage,
};

function getImage(url){
  return new Promise((resolve, reject) => {
    axios.get(url, { responseType: 'arraybuffer' }).then(response => {
      const image = response.data;
      return resolve(image);
    }).catch(error => {
      return reject(error);
    });
  });
}

function post(file){

  const formData = new FormData();
  formData.append('file', file);

  const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
  }

  return new Promise((resolve, reject) => {
    axios.post(apiUrl() + '/api/v1/File', formData, config).then(response => {
      const success = response.data;  
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}