import { apiUrl } from '../helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import { userService } from '../services';
import FileDownload from 'js-file-download';
import intl from 'react-intl-universal';

export const accountService = {
  get,
  remove,
  downloadData
};

function get() {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Account').then(response => {
      const account = response.data;

      return resolve(account);
    }).catch(error => {
      return reject(error);
    });
  });
}

function remove() {
  return new Promise((resolve, reject) => {
    axios.delete(apiUrl() + '/api/v1/Account').then(response => {
      const success = response.data;
      userService.logout();
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

function downloadData() {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Content/download', { responseType: 'blob' }).then(response => {
      if (response.status === 204) {
        toast.info(intl.get('downloadDataNoContentMessage'));
      } else if (response.data) {
        FileDownload(response.data, 'data.zip');
      }

      return resolve();
    }).catch(error => {
      return reject(error);
    });
  });
}
