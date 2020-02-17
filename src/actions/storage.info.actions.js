import { storageInfoConstants } from '../constants';
import { storageInfoService } from '../services';

export const storageInfoActions = {
    get,
};

function get() {
    return dispatch => {
      dispatch(request());

      storageInfoService.get()
        .then(storageInfo => {
          dispatch(success(storageInfo));
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: storageInfoConstants.GET_STORAGE_INFO_REQUEST} }
  function success(payload) { return { type: storageInfoConstants.GET_STORAGE_INFO_SUCCESS, payload } }
  function failure(error) { return { type: storageInfoConstants.GET_STORAGE_INFO_ERROR, error } }
}