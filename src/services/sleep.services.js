import { analyticsApiUrl } from '../helpers';
import axios from 'axios';

export const sleepServices = {
    getLast24HoursSleepReport,
    getSleepReport
};

function getLast24HoursSleepReport(payload) {
  return new Promise((resolve, reject) => {
    axios.get(analyticsApiUrl() + '/api/v1/SleepSummary?calendarDate=' + payload.calendarDate + '&userId=' + payload.userId).then(response => {
      const sleep = response.data;
      return resolve(sleep);
    }).catch(error => {
      return reject(error);
    });
  });
}

function getSleepReport(payload) {
  return new Promise((resolve, reject) => {
    axios.get(analyticsApiUrl() + '/api/v1/SleepSummary/Period?periodUnit=' + payload.periodUnit + '&periodMeasure=' + payload.periodMeasure + '&userId=' + payload.userId).then(response => {
      const sleep = response.data;
      return resolve({sleep, payload});
    }).catch(error => {
      return reject(error);
    });
  });
}