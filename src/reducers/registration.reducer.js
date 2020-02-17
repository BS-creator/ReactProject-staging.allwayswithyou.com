import { userConstants } from '../constants';

const initialState = { isFetching: true }

export function registration(state = initialState, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return {
        isFetching: true,
      };
    case userConstants.REGISTER_SUCCESS:
      return {
        isFetching: false,
        registrationResponse: action.payload,
      };
    case userConstants.REGISTER_ERROR:
      return {};
    default:
      return state
  }
}
