import { userConstants } from '../constants';
import { userService } from '../services';
import { fileActions } from '../actions';
import { history } from '../helpers';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga';
import intl from 'react-intl-universal';

export const userActions = {
  login,
  logout,
  notLoggedIn,
  completeRegistration,
  get,
  remove,
  update,
  finishedWizardFlow,
  dismissNotification
};

function login(from) {
  return dispatch => {
    dispatch(request());

    userService.login()
      .then(user => {
        dispatch(fileActions.resetProfilePicture());
        dispatch(success(user));
        if (user.profilePictureUrl) {
          dispatch(fileActions.get(user.profilePictureUrl));
        }

        if (user.rfnId) {
          if (user.isFirstLogin) {
            ReactGA.event({
              category: 'invitation accepted',
              action: 'invitation accepted',
              label: user.rfnId
            });
            history.replace('/profile');
          } else {
            if (from.includes('/login')) {
              var urlParams = new URLSearchParams(window.location.search);
              if (!urlParams.has('redirectUrl')) {
                history.replace('/');
              } else {
                history.replace(urlParams.get("redirectUrl"));
              }
            }
          }
        } else {
          dispatch(startedWizardFlow());
          history.replace('/profile');
        }
      }).catch(error => {
        dispatch(failure(error));
      });
  
  };

  function request() { return { type: userConstants.LOGIN_REQUEST } }
  function success(payload) { return { type: userConstants.LOGIN_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.LOGIN_ERROR, error } }
  function startedWizardFlow() { return { type: userConstants.STARTED_WIZARD_FLOW } }
}

function finishedWizardFlow() {
  ReactGA.event({
    category: 'wizard flow completed',
    action: 'wizard flow completed'
  });
  return { type: userConstants.FINISHED_WIZARD_FLOW };
}

function logout() {
  localStorage.setItem('lang', 'en-US');
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function notLoggedIn() {
  return { type: userConstants.NOT_LOGGED_IN }
}

function completeRegistration(details) {
  return dispatch => {
    dispatch(request());

    userService.completeRegistration(details)
      .then(response => {
        dispatch(success(response.account.admin));
        ReactGA.event({
          category: 'registration complete',
          action: 'registration complete'
        });
        history.replace('/assets');
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.LOGIN_REQUEST } }
  function success(payload) { return { type: userConstants.LOGIN_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.LOGIN_ERROR, error } }
}

function get() {
  return dispatch => {
    dispatch(request());

    userService.get()
      .then(users => {
        dispatch(success(users));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.GET_USERS_REQUEST } }
  function success(payload) { return { type: userConstants.GET_USERS_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.GET_USERS_ERROR, error } }
}

function remove(id) {
  return dispatch => {
    dispatch(request());

    userService.remove(id)
      .then(() => {
        dispatch(success(id));
        toast.success(intl.get('userHasBeenRemovedFromTheGroup'));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.DELETE_USER_REQUEST } }
  function success(payload) { return { type: userConstants.DELETE_USER_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.DELETE_USER_ERROR, error } }
}

function update(user) {
  return dispatch => {
    dispatch(request());

    userService.update(user)
      .then(user => {
        dispatch(success(user));
        if (user.profilePictureUrl) {
          dispatch(fileActions.get(user.profilePictureUrl));
        }

        toast.success(intl.get('userProfileUpdated'));

        ReactGA.event({
          category: 'user profile update',
          action: 'successful user profile update'
        });
      }).catch(error => {
        dispatch(failure(error));
        ReactGA.event({
          category: 'user profile update',
          action: 'unsuccessful user profile update'
        });
      });
  };

  function request() { return { type: userConstants.UPDATE_USER_REQUEST } }
  function success(payload) { return { type: userConstants.UPDATE_USER_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.UPDATE_USER_ERROR, error } }
}

function dismissNotification(id) {
  return dispatch => {
    dispatch(request());

    userService.dismissNotification(id)
      .then(response => {
        dispatch(success());
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.DISMISS_NOTIFICATION_REQUEST } }
  function success() { return { type: userConstants.DISMISS_NOTIFICATION_SUCCESS } }
  function failure(error) { return { type: userConstants.DISMISS_NOTIFICATION_ERROR, error } }
}
