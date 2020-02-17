import { invitationConstants } from '../constants';
import { invitationService } from '../services';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';
import ReactGA from 'react-ga';

export const invitationActions = {
    invite,
    reinvite,
    cancel,
    getAll,
};

function invite(invitation, rfn) {
    return dispatch => {
        dispatch(request());

        invitationService.invite(invitation, rfn)
          .then(invitation => {
            ReactGA.event({
              category: 'invitation',
              action: 'invitation sent',
              label : rfn.id
            });

            dispatch(success(invitation));
            toast.success(intl.get('userHasBeenInvited', {email: invitation.email, firstName: rfn.firstName, lastName: rfn.lastName}));
          }).catch(error => {
            dispatch(failure(error));
          });
    };

    function request() { return { type: invitationConstants.CREATE_INVITATION_REQUEST} }
    function success(payload) { return { type: invitationConstants.CREATE_INVITATION_SUCCESS, payload } }
    function failure(error) { return { type: invitationConstants.CREATE_INVITATION_ERROR, error } }
}

function reinvite(invitation, rfn) {
  return dispatch => {
      dispatch(request());

      invitationService.reinvite(invitation, rfn)
        .then(invitation => {
          ReactGA.event({
            category: 'reinvitation',
            action: 'reinvitation sent',
            label : rfn.id
          });

          dispatch(success(invitation));
          toast.success(intl.get('userHasBeenInvited', {email: invitation.email, firstName: rfn.firstName, lastName: rfn.lastName}));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: invitationConstants.PUT_INVITATION_REQUEST} }
  function success(payload) { return { type: invitationConstants.PUT_INVITATION_SUCCESS, payload } }
  function failure(error) { return { type: invitationConstants.PUT_INVITATION_ERROR, error } }
}

function cancel(id) {
    return dispatch => {
      dispatch(request());

      invitationService.cancel(id)
        .then(() => {
          ReactGA.event({
            category: 'invite',
            action: 'invitation canceled'
          });

          dispatch(success(id));
          toast.success(intl.get('usersInviteHasBeenCanceled'));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: invitationConstants.DELETE_INVITATION_REQUEST} }
  function success(payload) { return { type: invitationConstants.DELETE_INVITATION_SUCCESS, payload } }
  function failure(error) { return { type: invitationConstants.DELETE_INVITATION_ERROR, error } }
}

function getAll() {
    return dispatch => {
      dispatch(request());

      invitationService.getAll()
        .then(invitations => {
          dispatch(success(invitations));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: invitationConstants.GET_ALL_INVITATIONS_REQUEST} }
  function success(payload) { return { type: invitationConstants.GET_ALL_INVITATIONS_SUCCESS, payload } }
  function failure(error) { return { type: invitationConstants.GET_ALL_INVITATIONS_ERROR, error } }
}