import { apiUrl } from '../helpers';
import axios from 'axios';

export const paymentService = {
  pay
};

function pay(payment) {
  return new Promise((resolve, reject) => {
    axios.post(apiUrl() + '/api/v1/Payment', payment).then((response) => {
      return resolve(response.data);
    }).catch(error => {
      return reject(error);
    });
  });
}
