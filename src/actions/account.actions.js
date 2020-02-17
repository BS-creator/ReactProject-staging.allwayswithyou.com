import { accountConstants } from '../constants';
import { accountService, paymentService } from '../services';
import ReactGA from 'react-ga';
import { rfnProfileActions } from './rfn.profile.actions';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';

export const accountActions = {
  get,
  updatePaymentData,
  remove,
  downloadData
};

function get() {
  return dispatch => {
    dispatch(request());

    accountService.get()
      .then(account => {
        dispatch(success(account));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: accountConstants.GET_ACCOUNT_REQUEST } }
  function success(payload) { return { type: accountConstants.GET_ACCOUNT_SUCCESS, payload } }
  function failure(error) { return { type: accountConstants.GET_ACCOUNT_ERROR, error } }
}

function updatePaymentData(paymentData) {
  return dispatch => {
    dispatch(request());

    paymentService.pay(paymentData)
      .then(response => {
        dispatch(accountActions.get());
        dispatch(rfnProfileActions.get());
        dispatch(success(response));

        toast.success(intl.get('paymentSuccessful'));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: accountConstants.UPDATE_PAYMENT_DATA_REQUEST } }
  function success(payload) { return { type: accountConstants.UPDATE_PAYMENT_DATA_SUCCESS, payload } }
  function failure(error) { return { type: accountConstants.UPDATE_PAYMENT_DATA_ERROR, error } }
}

function remove() {
  return dispatch => {
    dispatch(request());

    accountService.remove()
      .then(() => {
        ReactGA.event({
          category: 'account',
          action: 'account  removed'
        });
        dispatch(success());
      }).catch(error => {
        dispatch(failure(error));
      });
};

  function request() { return { type: accountConstants.DELETE_ACCOUNT_REQUEST} }
  function success() { return { type: accountConstants.DELETE_ACCOUNT_SUCCESS } }
  function failure(error) { return { type: accountConstants.DELETE_ACCOUNT_ERROR, error } }
}

function downloadData() {
  return dispatch => {
    dispatch(request());

    accountService.downloadData()
      .then(account => {
        dispatch(success(account));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: accountConstants.DOWNLOAD_DATA_REQUEST } }
  function success(payload) { return { type: accountConstants.DOWNLOAD_DATA_SUCCESS, payload } }
  function failure(error) { return { type: accountConstants.DOWNLOAD_DATA_ERROR, error } }
}