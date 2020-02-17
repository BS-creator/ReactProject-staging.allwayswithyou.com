import { toast } from 'react-toastify';
import intl from 'react-intl-universal';
import { userService } from './user.service';
import { history } from '../helpers';

export const errorService = {
  handleError,
  handleFirebaseError
};

function handleError(error) {

  if (!error) {
    showToast('unknownError');
    return false;
  }

  if (error.response) {
    switch (error.response.status) {
      case 401:
        userService.logout();
        return true;
      case 403:
        history.push('/');
        return true;
      case 400:
      case 404:
      case 415:
      case 503:
        showToast(error.response.data.code || 'unknownError');
        break;
      default:
        showToast('unknownError');
        break;
    }

  } else if (error.message === 'Network Error') {
    showToast('networkError');
  } else {
    showToast('unknownError');
  }

  return false;
};

function handleFirebaseError(error)  {
  if (!error) {
    return;
  }

  const ignoreErrors = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];
  if (ignoreErrors.includes(error.code)) {
    return;
  }

  let errorCode = '';
console.log(error.code, 'hello world')
  switch (error.code) {
    case 'auth/invalid-email':
    case 'auth/wrong-password':
      errorCode = 'invalidUsernameOrPass';
      break;
    case 'auth/user-disabled':
      errorCode = 'userDisabled';
      break;
    case 'auth/user-not-found':
      errorCode = 'userNotFound';
      break;
    case 'auth/account-exists-with-different-credential':
      errorCode = 'accountExistsWithDifferentCredential';
      break;
    case 'auth/invalid-credential':
      errorCode = 'invalidCredential';
      break;
    case 'auth/operation-not-allowed':
      errorCode = 'operationNotAllowed';
      break;
    case 'auth/email-already-in-use':
      errorCode = 'emailInUse';
      break;
    case 'auth/weak-password':
      errorCode = 'weakPassword';
      break;
    case 'auth/user-mismatch':
      errorCode = 'userMismatch';
      break;
    default:
      errorCode = 'unknownError';
      break;
  }

  showToast(errorCode);
};

function showToast(toastCode) {
  const toastMessage = intl.get(toastCode);
  if (toastMessage && !toast.isActive(toastCode)) {
    toast.error(toastMessage, {
      toastId: toastCode
    });
  }
};
