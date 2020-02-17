export const apiUrl = () => {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');

  if(r.test(process.env.REACT_APP_API_URL)){
    return process.env.REACT_APP_API_URL;
  }else{
    // return window.location.origin + process.env.REACT_APP_API_URL;
    return "https://staging.allwayswithyou.com" + process.env.REACT_APP_API_URL;
  }
}

export const analyticsApiUrl = () => {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');

  if(r.test(process.env.REACT_APP_ANALYTICS_API_URL)){
    return process.env.REACT_APP_ANALYTICS_API_URL;
  }else{
    // return window.location.origin + process.env.REACT_APP_ANALYTICS_API_URL;
    return "https://staging.allwayswithyou.com" + process.env.REACT_APP_ANALYTICS_API_URL;
  }
}

export const config = {
    firebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      googleClientId: process.env.REACT_APP_FIREBASE_GOOGLE_CLIENT_ID,
      facebookAppId: process.env.REACT_APP_FACEBOOK_APP_ID
  }
};