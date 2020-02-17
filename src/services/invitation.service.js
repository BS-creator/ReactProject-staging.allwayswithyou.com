import { apiUrl } from '../helpers';
import axios from 'axios';
 
export const invitationService = {
    invite,
    reinvite,
    cancel,
    getAll,
};

function invite(invitation, rfn){
    return new Promise((resolve, reject) => {
        axios.post(apiUrl() + '/api/v1/Invitation', invitation).then(response => {
          const invitation = response.data;
          return resolve(invitation);
        }).catch(error => {
          return reject(error);
        });
      });    
}

function reinvite(invitation, rfn){
  return new Promise((resolve, reject) => {
      axios.put(apiUrl() + '/api/v1/Invitation', invitation).then(response => {
        const invitation = response.data;
        return resolve(invitation);
      }).catch(error => {
        return reject(error);
      });
    });    
}

function cancel(id){
  return new Promise((resolve, reject) => {
      axios.delete(apiUrl() + '/api/v1/Invitation?id=' + id).then(response => {
        const success = response.data;
        return resolve(success);
      }).catch(error => {
        return reject(error);
      });
    });    
}

function getAll(){
  return new Promise((resolve, reject) => {
    axios.get(apiUrl() + '/api/v1/Invitation').then(response => {
      const invitations = response.data;
      return resolve(invitations);
    }).catch(error => {
      return reject(error);
    });
  });
}
