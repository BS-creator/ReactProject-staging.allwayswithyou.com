import { contentConstants } from '../constants';
import { contentService } from '../services';
import { storageInfoActions } from './storage.info.actions';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';
import ReactGA from 'react-ga';

export const contentActions = {
  uploadRequest,
  uploadSuccess,
  uploadError,
  remove,
  get,
};

function uploadRequest() {
  return dispatch => {
    dispatch(request());
  };

  function request() { return { type: contentConstants.UPLOAD_CONTENT_REQUEST } }
}

function uploadSuccess(assets) {
  return dispatch => {
    dispatch(success(assets));
  };

  function success(payload) { return { type: contentConstants.UPLOAD_CONTENT_SUCCESS, payload } }
}

function uploadError(error) {
  return dispatch => {
    dispatch(failure(error));
  };

  function failure(error) { return { type: contentConstants.UPLOAD_CONTENT_ERROR, error } }
}

function remove(assetIds) {
  return dispatch => {
    dispatch(request());

    contentService.remove(assetIds)
      .then(() => {
        dispatch(storageInfoActions.get());
        ReactGA.event({
          category: 'content',
          action: 'content removed'
        });

        dispatch(success(assetIds));
        toast.success(intl.get('contentHasBeenRemoved'));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: contentConstants.DELETE_CONTENT_REQUEST } }
  function success(payload) { return { type: contentConstants.DELETE_CONTENT_SUCCESS, payload } }
  function failure(error) { return { type: contentConstants.DELETE_CONTENT_ERROR, error } }
}

function get() {
  return dispatch => {
    dispatch(request());

    contentService.get()
      .then(content => {
        dispatch(success(content));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function request() { return { type: contentConstants.GET_CONTENT_REQUEST } }
  function success(payload) { return { type: contentConstants.GET_CONTENT_SUCCESS, payload } }
  function failure(error) { return { type: contentConstants.GET_CONTENT_ERROR, error } }
}