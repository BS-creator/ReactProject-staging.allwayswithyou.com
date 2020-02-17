import { userConstants } from '../constants';

const initialState = { isFetching: true }

export function user(state = initialState, action) {
  switch (action.type) {
    case userConstants.GET_USERS_REQUEST:
      return {
        isFetching: true,
      };
    case userConstants.GET_USERS_SUCCESS:
      return {
        isFetching: false,
        users: action.payload.filter(user => !user.isAdmin),
      };
    case userConstants.GET_USERS_ERROR:
      return {};
    case userConstants.DELETE_USER_REQUEST:
      return {...state};
    case userConstants.DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case userConstants.DELETE_USER_ERROR:
      return {...state};
    default:
      return state
  }
}
