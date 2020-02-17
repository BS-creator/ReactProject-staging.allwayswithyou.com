import { userConstants } from '../constants';

const initialState = { 
  isFetching: true,
  settings : {
    subscribed : false
  }
}

export function userSettings(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_USER_SETTINGS_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case userConstants.GET_USER_SETTINGS_SUCCESS:
      return {
        isFetching: false,
        settings: action.payload,
      };
      case userConstants.GET_USER_SETTINGS_ERROR:
      return {
        ...state
      };  
    case userConstants.CREATE_USER_SETTINGS_REQUEST:
      return {
        ...state,
      };
    case userConstants.CREATE_USER_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
      };
    case userConstants.CREATE_USER_SETTINGS_ERROR:
      return {
        ...state,
      };
      case userConstants.UPDATE_USER_SETTINGS_REQUEST:
      return {
        ...state,
      };
    case userConstants.UPDATE_USER_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
      };
    case userConstants.UPDATE_USER_SETTINGS_ERROR:
      return {
        ...state,
      };
    default:
      return state
  }
}
