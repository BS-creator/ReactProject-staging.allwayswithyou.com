import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './Pages/App';
import { Provider } from 'react-redux';
import { store } from './helpers';
import './resources/semantic/semantic-override.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import { config } from './helpers';
import axios from 'axios';
import { StripeProvider } from 'react-stripe-elements';
import ReactGA from 'react-ga';
import { errorService } from './services';

//firebase init
firebase.initializeApp(config.firebaseConfig);

//axios interceptors
axios.interceptors.request.use(async (config) => {
  const accessToken = await firebase.auth().currentUser.getIdToken();
  if (accessToken) {
    config.headers.Authorization = 'Bearer ' + accessToken;
  }

  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use((response) => {
  // response data
  return response;
}, (error) => {
  // response error
  const isHandled = errorService.handleError(error);

  if (isHandled) {
    return Promise.resolve(error);
  }

  return Promise.reject(error);
});

//analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE, { debug: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' });

ReactDOM.render(
  <Provider store={store}>
    <StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
      <App />
    </StripeProvider>
  </Provider>,
  document.getElementById('root')
);
