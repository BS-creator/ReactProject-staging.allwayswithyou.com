import { rfnProfileConstants } from '../constants';

const initialState = { isFetching: true }

export function rfnProfile(state = initialState, action) {
  switch (action.type) {
    case rfnProfileConstants.GET_RFN_PROFILE_REQUEST:
      return {
        isFetching: true,
      };
    case rfnProfileConstants.GET_RFN_PROFILE_SUCCESS:
      return {
        isFetching: false,
        rfn: action.payload,
      };
    case rfnProfileConstants.GET_RFN_PROFILE_ERROR:
      return {};
    case rfnProfileConstants.PUT_RFN_PROFILE_REQUEST:
      return {
        ...state,
      };
    case rfnProfileConstants.PUT_RFN_PROFILE_SUCCESS:
      return {
        ...state,
        rfn: action.payload,
      };
    case rfnProfileConstants.PUT_RFN_PROFILE_ERROR:
      return {
        ...state
      };
    default:
      return state
  }
}
