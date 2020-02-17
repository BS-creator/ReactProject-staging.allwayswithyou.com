import { fileConstants } from '../constants';
import { fileService } from '../services';

export const fileActions = {
  get,
  getRfnImage,
  resetProfilePicture
};

function _imageEncode(arrayBuffer) {
  let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer), function (p, c) { return p + String.fromCharCode(c) }, ''))
  let mimetype = "image/jpeg"
  return "data:" + mimetype + ";base64," + b64encoded
}

function get(imageUrl) {
  return dispatch => {
    fileService.getImage(imageUrl.concat('?type=profilephoto'))
      .then((image) => {
        dispatch(success(_imageEncode(image)));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function success(image) { return { type: fileConstants.GET_PROFILE_PICTURE_SUCCESS, profilePicture: image } }
  function failure(error) { return { type: fileConstants.GET_PROFILE_PICTURE_FAILURE, profilePicture: null, error } }
}

function getRfnImage(imageUrl) {
  return dispatch => {
    fileService.getImage(imageUrl.concat('?type=profilephoto'))
      .then((image) => {
        dispatch(success(_imageEncode(image)));
      }).catch(error => {
        dispatch(failure(error));
      });
  };

  function success(image) { return { type: fileConstants.GET_RFN_PROFILE_PICTURE_SUCCESS, profilePicture: image } }
  function failure(error) { return { type: fileConstants.GET_RFN_PROFILE_PICTURE_FAILURE, profilePicture: null, error } }
}

function resetProfilePicture() {
  return dispatch => {
    dispatch(reset());
  };

  function reset() { return { type: fileConstants.RESET_PROFILE_PICTURE } }
}
