import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import styles from './SignInPage.scss';
import { reset } from 'redux-form';
import { SignInForm } from './components';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import ReactGA from 'react-ga';
import googleIcon from '../../resources/images/btn_google_light_normal_ios.svg';
import facebookIcon from '../../resources/images/facebook.svg';
import intl from 'react-intl-universal';
import { errorService } from '../../services';

class SignInPage extends Component {

  constructor(props) {
    super(props);

    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.facebookProvider = new firebase.auth.FacebookAuthProvider();

    this.state = {
      verificationEmailSent: false,
      userEmail: '',
      visible: false,
    };
  }

  handleGoogleLogin = () => {
    firebase.auth().signInWithPopup(this.googleProvider)
      .then((user) => {
        ReactGA.event({
          category: 'authentication',
          action: 'google sign in',
          value: user.email
        });
      })
      .catch((error) => {
        errorService.handleFirebaseError(error);
      });
  }

  handleFacebookLogin = () => {
    firebase.auth().signInWithPopup(this.facebookProvider)
      .then((user) => {
        ReactGA.event({
          category: 'authentication',
          action: 'facebook sign in',
          value: user.email
        });
      })
      .catch((error) => {
        errorService.handleFirebaseError(error);
      });
  }

  handleSubmit = (values) => {
    const self = this;
    //firebase register api
    firebase.auth().signInWithEmailAndPassword(values.email, values.password)
      .then((user) => {
        ReactGA.event({
          category: 'authentication',
          action: 'email sign in',
          value: user.email
        });
        self.props.dispatch(reset('signInForm'));
      })
      .catch((error) => {
        errorService.handleFirebaseError(error);
      });
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col mdOffset={4} md={4}>
              <h1 className={styles.header}>{intl.get("signIn")}</h1>
              <SignInForm onSubmit={this.handleSubmit} />
              <br />
              <button className={styles.customBtn} onClick={this.handleGoogleLogin}>
                <span className={styles.icon}><img src={googleIcon} alt="" /></span>
                <div className={styles.buttonText}>Sign in with Google</div>
              </button>
              <button className={styles.customBtnFacebook} onClick={this.handleFacebookLogin}>
                <span className={styles.facebookIcon}><img src={facebookIcon} alt="" /></span>
                <div className={styles.buttonText}>Sign in with Facebook</div>
              </button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const composedSignInPage = compose(withTracker, connect())(SignInPage);
export { composedSignInPage as SignInPage };
