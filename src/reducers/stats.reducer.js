import { statsConstants } from '../constants';

const initialState = { 
  uploadsForLast24Hours: [],
  uploadsForLast7Days: [], 
  uploadsForLast4Weeks: [], 
  uploadsForLast6Months: [],
  statsForLast24Hours: [],
  statsForLast7Days: [], 
  statsForLast4Weeks: [], 
  statsForLast6Months: [],
  isFetching: true }

export function report(state = initialState, action) {
  switch (action.type) {
    case statsConstants.GET_STATS_REQUEST:
      return {
        isFetching: true,
      };
    case statsConstants.GET_STATS_SUCCESS:
      switch (action.payload.payload.period) {
        case 'last24Hours':
          return {
            ...state,
            isFetching: false,
            statsForLast24Hours: action.payload.stats,
          };
        case 'last7Days':
          return {
            ...state,
            isFetching: false,
            statsForLast7Days: action.payload.stats,
          };
          
        case 'last4Weeks':
          return {
            ...state,
            isFetching: false,
            statsForLast4Weeks: action.payload.stats,
          };
          
        case 'last6Months':
          return {
            ...state,
            isFetching: false,
            statsForLast6Months: action.payload.stats,
          };
          
        default:
          break;
      }
    case statsConstants.GET_STATS_ERROR:
      return {};
    case statsConstants.GET_UPLOADERS_INFO_REQUEST:
      return {
        isFetching: true,
      };
    case statsConstants.GET_UPLOADERS_INFO_SUCCESS:
      switch (action.payload.payload.period) {
        case 'last24Hours':
          return {
            ...state,
            isFetching: false,
            uploadsForLast24Hours: action.payload.stats,
          };
        case 'last7Days':
          return {
            ...state,
            isFetching: false,
            uploadsForLast7Days: action.payload.stats,
          };
          
        case 'last4Weeks':
          return {
            ...state,
            isFetching: false,
            uploadsForLast4Weeks: action.payload.stats,
          };
          
        case 'last6Months':
          return {
            ...state,
            isFetching: false,
            uploadsForLast6Months: action.payload.stats,
          };
          
        default:
          break;
      }
    case statsConstants.GET_UPLOADERS_INFO_ERROR:
      return {};   
    default:
      return state
  }
}
