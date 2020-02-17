import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { history, sendVerificationEmail } from '../helpers';
import { userActions } from '../actions';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const self = this;

      firebase.auth().onAuthStateChanged(authUser => {
        if (authUser) {
          
          if (authUser.providerData[0].providerId === 'password' && !authUser.emailVerified) {
            try {
              firebase.database().ref('verification-sent').child('user/' + authUser.uid).once('value', function (snapshot) {
                if (!snapshot.val()) {
                  sendVerificationEmail(authUser).then(() => {}).catch((e) => { console.log(e); });
                }
              });
            } catch (ex) {
              sendVerificationEmail(authUser).then(() => {}).catch((e) => { console.log(e); });
            } finally {
              self.props.dispatch(userActions.login(window.location.href));
            }
          } else {
            self.props.dispatch(userActions.login(window.location.href));
          }
        } else {
          self.props.dispatch(userActions.notLoggedIn());
          const pathname = window.location.pathname.replace(process.env.PUBLIC_URL, "");
          const r = new RegExp('(/register|/forgot-password|/login)/?', 'i');

          if (!r.test(pathname)) {
            history.replace('/login');
          }
        }
      });
    }

    render() {
      const { isFetching } = this.props;

      return (
        !isFetching &&
        <Component />
      );
    }
  }

  function mapStateToProps(state) {
    const { authentication } = state;
    const { isFetching } = authentication;
  
    return {
      isFetching
    };
  }
  

  return connect(mapStateToProps)(WithAuthentication);
}

export { withAuthentication };