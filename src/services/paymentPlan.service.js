import { apiUrl } from '../helpers';
import axios from 'axios';

export const paymentPlanService = {
    getPaymentPlans
};

function getPaymentPlans(){
    return new Promise((resolve, reject) => {
        axios.get(apiUrl() + '/api/v1/PaymentPlan').then(response => {
          return resolve(response.data);
        }).catch(error => {
          return reject(error);
        });
      });
}