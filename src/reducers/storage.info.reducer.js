import { storageInfoConstants } from '../constants';

const initialState = { isFetching: true }

export function storageInfo(state = initialState, action) {
  switch (action.type) {
    case storageInfoConstants.GET_STORAGE_INFO_REQUEST:
      return {
        ...state,
      };
    case storageInfoConstants.GET_STORAGE_INFO_SUCCESS:
      return {
        isFetching: false,
        info: action.payload,
      };
    case storageInfoConstants.GET_STORAGE_INFO_ERROR:
      return {};
    default:
      return state
  }
}
