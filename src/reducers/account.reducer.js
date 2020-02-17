import { accountConstants } from '../constants';

const initialState = { isFetching: true, updatePaymentDataInProgress: false, downloadInProgress: false }

export function accountSettings(state = initialState, action) {
  switch (action.type) {
    case accountConstants.GET_ACCOUNT_REQUEST:
      return {
        isFetching: true,
      };
    case accountConstants.GET_ACCOUNT_SUCCESS:
      return {
        isFetching: false,
        account: action.payload,
      };
    case accountConstants.GET_ACCOUNT_ERROR:
      return {};
    case accountConstants.UPDATE_PAYMENT_DATA_REQUEST:
      return {
        ...state,
        updatePaymentDataInProgress: true
      };
    case accountConstants.UPDATE_PAYMENT_DATA_SUCCESS:
      return {
        ...state,
        updatePaymentDataInProgress: false
      };
    case accountConstants.UPDATE_PAYMENT_DATA_ERROR:
      return {
        ...state,
        updatePaymentDataInProgress: false
      };
    case accountConstants.DOWNLOAD_DATA_REQUEST: 
      return {
        ...state,
        downloadInProgress: true
      };
    case accountConstants.DOWNLOAD_DATA_SUCCESS: 
      return {
        ...state,
        downloadInProgress: false
      };
    case accountConstants.DOWNLOAD_DATA_ERROR: 
      return {
        ...state,
        downloadInProgress: false
      };
    case accountConstants.DELETE_ACCOUNT_REQUEST:
      return {...state};
    case accountConstants.DELETE_ACCOUNT_SUCCESS:
      return {};
    case accountConstants.DELETE_ACCOUNT_ERROR:
      return {...state};
    default:
      return state
  }
}
