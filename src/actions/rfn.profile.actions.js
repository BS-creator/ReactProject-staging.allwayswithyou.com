import { rfnProfileConstants } from '../constants';
import { rfnService } from '../services';
import { fileActions } from '../actions';
import ReactGA from 'react-ga';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';

export const rfnProfileActions = {
    get,
    put,
};

function get() {
    return dispatch => {
      dispatch(request());

      rfnService.get()
        .then(rfn => {
          dispatch(success(rfn));
          if(rfn.profilePictureUrl){
            dispatch(fileActions.getRfnImage(rfn.profilePictureUrl));
        }
        }).catch(error => {
          dispatch(failure(error));
        });
  };

  function request() { return { type: rfnProfileConstants.GET_RFN_PROFILE_REQUEST} }
  function success(payload) { return { type: rfnProfileConstants.GET_RFN_PROFILE_SUCCESS, payload } }
  function failure(error) { return { type: rfnProfileConstants.GET_RFN_PROFILE_ERROR, error } }
}

function put(rfn) {
  return dispatch => {
    dispatch(request());
    
    rfnService.put(rfn)
      .then(rfn => {
        
        dispatch(success(rfn));
        if(rfn.profilePictureUrl){
          dispatch(fileActions.getRfnImage(rfn.profilePictureUrl));
        }
        ReactGA.event({
          category: 'rfn profile',
          action: 'rfn profile updated'
        });

        toast.success(intl.get('rfnsProfileHasBeenUpdated', {firstName: rfn.firstName, lastName:rfn.lastName}));
      }).catch(error => {
        dispatch(failure(error));
      });
};

function request() { return { type: rfnProfileConstants.PUT_RFN_PROFILE_REQUEST} }
function success(payload) { return { type: rfnProfileConstants.PUT_RFN_PROFILE_SUCCESS, payload } }
function failure(error) { return { type: rfnProfileConstants.PUT_RFN_PROFILE_ERROR, error } }
}