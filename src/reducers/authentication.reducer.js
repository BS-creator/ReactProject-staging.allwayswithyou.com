import { userConstants } from '../constants';

const initialState = { isFetching: true, isFirstTimeLogin: false }

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.payload,
      };
    case userConstants.LOGIN_ERROR:
      return {};
    case userConstants.LOGOUT:
      return {};
    case userConstants.NOT_LOGGED_IN:
      return {
        ...state,
        isFetching: false,
        user: null
      };
    case userConstants.STARTED_WIZARD_FLOW:
      return {
        ...state,
        isFirstTimeLogin: true,
      };
    case userConstants.FINISHED_WIZARD_FLOW:
      return {
        ...state,
        isFirstTimeLogin: false,
      }
    case userConstants.UPDATE_USER_REQUEST:
      return { ...state };
    case userConstants.UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload
      };
    case userConstants.UPDATE_USER_ERROR:
      return { ...state };
    case userConstants.DISMISS_NOTIFICATION_SUCCESS:
      let user = {...state.user};
      user.notification = null;
      return {
        ...state,
        user: user
      }
    default:
      return state;
  }
}
