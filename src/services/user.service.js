import firebase from 'firebase/app';
import 'firebase/auth';
import { apiUrl } from '../helpers';
import axios from 'axios';

export const userService = {
  login,
  logout,
  completeRegistration,
  get,
  remove,
  update,
  dismissNotification
};

function login() {
  return new Promise((resolve, reject) => {
    axios.post(apiUrl() + '/api/v1/User', null).then(response => {
      const user = response.data;
      return resolve(user);
    }).catch(error => {
      firebase.auth().signOut().then(() => {
        return reject(error);
      });
    });
  });
}

function logout() {
  firebase.auth().signOut();
}

function completeRegistration(details) {
  return new Promise((resolve, reject) => {
    axios.post(apiUrl() + '/api/v1/Registration', details).then(response => {
      const code = response.data;
      return resolve(code);
    }).catch(error => {
      return reject(error);
    });
  });
}

function get() {
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/User').then(response => {
      const users = response.data;
      return resolve(users);
    }).catch(error => {
      return reject(error);
    });
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    axios.delete(apiUrl() + '/api/v1/User?id=' + id).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

function update(user) {
  return new Promise((resolve, reject) => {
    axios.put(apiUrl() + '/api/v1/User', user).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

function dismissNotification(id) {
  return new Promise((resolve, reject) => {
    axios.patch(apiUrl() + '/api/v1/User/notifications/' + id).then(response => {
      const success = response.data;
      return resolve(success);
    }).catch(error => {
      return reject(error);
    });
  });
}

