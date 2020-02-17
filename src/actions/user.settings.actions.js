import { userConstants } from '../constants';
import { userSettingsService } from '../services';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga';
import intl from 'react-intl-universal';

export const userSettingsActions = {
  get,
  create,
  update,
};

function get() {
  return dispatch => {
    dispatch(request());

    userSettingsService.get()
      .then(settings => {
        dispatch(success(settings));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.GET_USER_SETTINGS_REQUEST } }
  function success(payload) { return { type: userConstants.GET_USER_SETTINGS_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.GET_USER_SETTINGS_ERROR, error } }
}

function create(settings) {
  return dispatch => {
    dispatch(request());

    userSettingsService.create(settings)
      .then(settings => {
        dispatch(success(settings));
        ReactGA.event({
          category: 'user profile create',
          action: 'user profile created'
        });
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.CREATE_USER_SETTINGS_REQUEST } }
  function success(payload) { return { type: userConstants.CREATE_USER_SETTINGS_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.CREATE_USER_SETTINGS_ERROR, error } }
}

function update(settings) {
  return dispatch => {
    dispatch(request());

    userSettingsService.update(settings)
      .then(settings => {
        dispatch(success(settings));
        toast.success(intl.get('subscriptionUpdateMessage'));

        ReactGA.event({
          category: 'user profile update',
          action: 'user profile updated'
        });
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: userConstants.UPDATE_USER_SETTINGS_REQUEST } }
  function success(payload) { return { type: userConstants.UPDATE_USER_SETTINGS_SUCCESS, payload } }
  function failure(error) { return { type: userConstants.UPDATE_USER_SETTINGS_ERROR, error } }
}
