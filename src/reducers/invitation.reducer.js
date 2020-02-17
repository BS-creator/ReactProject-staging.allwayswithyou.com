import { invitationConstants } from '../constants';

const initialState = { isFetching: true }

export function invitation(state = initialState, action) {
  switch (action.type) {
    case invitationConstants.GET_ALL_INVITATIONS_REQUEST:
      return {
        isFetching: true,
      };
    case invitationConstants.GET_ALL_INVITATIONS_SUCCESS:
      return {
        isFetching: false,
        invitations: action.payload.filter(invitation => !invitation.approved),
      };
    case invitationConstants.GET_ALL_INVITATIONS_ERROR:
      return {};
    case invitationConstants.CREATE_INVITATION_REQUEST:
      return {...state};
    case invitationConstants.CREATE_INVITATION_SUCCESS:
      return {
        ...state,
        invitations: [...state.invitations, action.payload]
      };
    case invitationConstants.CREATE_INVITATION_ERROR:
      return {...state};
    case invitationConstants.PUT_INVITATION_REQUEST:
      return {
        ...state
      };
    case invitationConstants.PUT_INVITATION_SUCCESS:
      return {
        ...state
      };
    case invitationConstants.PUT_INVITATION_ERROR:
      return {
        ...state
      };  
    case invitationConstants.DELETE_INVITATION_REQUEST:
      return {...state};
    case invitationConstants.DELETE_INVITATION_SUCCESS:
      return {
        ...state,
        invitations: state.invitations.filter(invitation => invitation.id !== action.payload)
      };
    case invitationConstants.DELETE_INVITATION_ERROR:
      return {...state};
    default:
      return state
  }
}
