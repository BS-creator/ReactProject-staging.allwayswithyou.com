import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { authentication } from './authentication.reducer';
import { invitation } from './invitation.reducer';
import { rfnProfile } from './rfn.profile.reducer';
import { user } from './user.reducer';
import { content } from './content.reducer';
import { accountSettings } from './account.reducer';
import { storageInfo } from './storage.info.reducer';
import { userSettings } from './user.settings.reducer';
import { fileReducer } from './file.reducer';
import { report } from './stats.reducer';
import { albums } from './album.reducer';
import { paymentPlan } from './paymentPlan.reducer';
import { localeReducer } from './locale.reducer';
import { sleep } from './sleep.reducer';

const appReducer = combineReducers({
  authentication,
  invitation,
  rfnProfile,
  content,
  user,
  accountSettings,
  storageInfo,
  userSettings,
  form: formReducer,
  fileReducer,
  report,
  albums,
  paymentPlan,
  localeReducer,
  sleep
});

const rootReducer = (state, action) => {
  if (action.type === 'NOT_LOGGED_IN') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;