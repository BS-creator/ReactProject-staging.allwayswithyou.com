import { fileConstants } from '../constants';

const initialState = { 
    profilePicture : null,
    rfnProfilePicture : null
 }

export function fileReducer(state = initialState, action) {
  switch (action.type) {
    case fileConstants.GET_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        profilePicture: action.profilePicture
      };
    case fileConstants.GET_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        profilePicture: action.profilePicture
      };
    case fileConstants.GET_RFN_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        rfnProfilePicture: action.profilePicture
      };
    case fileConstants.GET_RFN_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        rfnProfilePicture: action.profilePicture
      };
    case fileConstants.RESET_PROFILE_PICTURE:
      return {
        ...state,
        profilePicture: null
      };

      default:
      return state
  }
}