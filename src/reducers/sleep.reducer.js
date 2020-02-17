import { sleepConstants } from '../constants/sleep.constants';
import moment from 'moment';

import 'moment/locale/sr';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/ro';
import 'moment/locale/en-gb';

const initialState = { 
    isFetchingSleepReport: false,
    last24HoursSleepReport: null,
    last7DaysSleepReport: null,
    last4WeeksSleepReport: null,
    last6MonthSleepReport: null
}

export function sleep(state = initialState, action) {

  switch (localStorage.getItem('lang')) {
    case 'en-US': 
      moment.locale('en-gb')
      break;
    case 'fr-FR': 
      moment.locale('fr')
      break;
    case 'de-DE': 
      moment.locale('de')
      break;
    case 'sr-RS': 
      moment.locale('sr')
      break;
    case 'ro-RO': 
      moment.locale('ro')
      break;
    default: 
      moment.locale('en-gb')
      break;
  }

  switch (action.type) {
    case sleepConstants.GET_LAST_24_HOURS_SLEEP_REPORT_REQUEST:
      return {
        isFetchingSleepReport: true,
        last24HoursSleepReport: null
      };
    case sleepConstants.GET_LAST_24_HOURS_SLEEP_REPORT_SUCCESS:
      return {
        ...state,
        isFetchingSleepReport: false,
        last24HoursSleepReport: action.payload
      };
    case sleepConstants.GET_LAST_24_HOURS_SLEEP_REPORT_ERROR:
      return {
        isFetchingSleepReport: false,
        last24HoursSleepReport: null
      };

    case sleepConstants.GET_SLEEP_REPORT_REQUEST:
      return {
        isFetchingSleepReport: true
      };
    case sleepConstants.GET_SLEEP_REPORT_SUCCESS:
        if(action.payload.payload.periodUnit === 0 && action.payload.payload.periodMeasure === 7) {
            const last7DaysSleepReport = action.payload.sleep;
            last7DaysSleepReport.summaries.forEach(summary => {
              summary.startDateTime = moment(summary.startDateTime).format('dd')
            });
            return {
                ...state,
                isFetchingSleepReport: false,
                last7DaysSleepReport: last7DaysSleepReport,
                
              };
        } else if(action.payload.payload.periodUnit === 1 && action.payload.payload.periodMeasure === 4) {
          const last4WeeksSleepReport = action.payload.sleep;
            last4WeeksSleepReport.summaries.forEach((summary, index) => {
              if(index === 0){
                summary.startDateTime = moment(summary.startDateTime).format('DD/MM')
              } else if(index === 3) {
                summary.startDateTime = moment().format('DD/MM')
              } else {
                delete summary.startDateTime;
              }
            });
            return {
                ...state,
                isFetchingSleepReport: false,
                last4WeeksSleepReport: last4WeeksSleepReport
              };
        }else if(action.payload.payload.periodUnit === 2 && action.payload.payload.periodMeasure === 6) {
          const last6MonthSleepReport = action.payload.sleep;
            last6MonthSleepReport.summaries.forEach(summary => {
              summary.startDateTime = moment(summary.startDateTime).format('MMM')
            });
            return {
                ...state,
                isFetchingSleepReport: false,
                last6MonthSleepReport: last6MonthSleepReport
              };
        }
    case sleepConstants.GET_SLEEP_REPORT_ERROR:
      return {
        isFetchingSleepReport: false,
        last7DaysSleepReport: [],
        last4WeeksSleepReport: [],
        last6MonthSleepReport: []
      };
    default:
      return state
  }
}
