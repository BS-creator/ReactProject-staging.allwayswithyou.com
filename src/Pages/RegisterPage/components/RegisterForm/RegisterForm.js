import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button, Checkbox } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import ReactGA from 'react-ga';
import { InputField } from 'react-semantic-redux-form';
import styles from './RegisterForm.scss';
import { history } from '../../../../helpers';
import buttonCss from '../../../../resources/styles/button.css';
import googleIcon from '../../../../resources/images/btn_google_light_normal_ios.svg';
import facebookIcon from '../../../../resources/images/facebook.svg';
import intl from 'react-intl-universal'

const emailFieldName = 'email';
const passwordFieldName = 'password';

const validate = values => {
  const errors = {};
  const requiredFields = [
    emailFieldName,
    passwordFieldName
  ];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = intl.get("required")
    }
  });

  if (values[emailFieldName] && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[emailFieldName])) {
    errors[emailFieldName] = intl.get("invalidEmail");
  }

  if (!values[passwordFieldName] || values[passwordFieldName].length < 8) {
    errors[passwordFieldName] = intl.get("passwordTooShort");
  } else if (!(/([a-zA-Z]+)/.test(values[passwordFieldName]) && /([^a-zA-Z\s]+)/.test(values[passwordFieldName]))) {
    errors[passwordFieldName] = intl.get("passwordShouldContain");
  }

  return errors;
}

class RegisterForm extends Component {

  constructor(props) {
    super(props);

    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.facebookProvider = new firebase.auth.FacebookAuthProvider();

    this.state = { checked: false };
  }

  handleChange = () => {
    this.setState({ checked: !this.state.checked });
  }

  handleReset = () => {
    this.props.dispatch(reset('registerForm'));
    history.replace('/login');
  }

  handleGoogleRegistration = () => {
    firebase.auth().signInWithPopup(this.googleProvider).then((user) => {
      ReactGA.event({
        category: 'authentication',
        action: 'google sign in',
        value: user.email
      });
    });
  }

  handleFacebookRegistration = () => {
    firebase.auth().signInWithPopup(this.facebookProvider).then((user) => {
      ReactGA.event({
        category: 'authentication',
        action: 'facebook sign in',
        value: user.email
      });
    });
  }

  render() {

    const { handleSubmit } = this.props;

    return (
      <div className={styles.paddingSides}>
        <Form onSubmit={handleSubmit}>

          <div className={styles.field}>
            <div>
              <Field name={emailFieldName} component={InputField}
                label={intl.get("emailAddress")} />
            </div>
            <small className={styles.smallText}>{intl.get("neverShareEmail")}</small>
          </div>

          <div className={styles.field}>
            <div>
              <Field name={passwordFieldName} component={InputField} label={intl.get("passwordOne")} type='password' />
            </div>
            <small className={styles.smallText}>{intl.get("passwordMustBe")}</small>
          </div>

          <div className={styles.field}>
            <Form.Field>
              <Checkbox
                label={{ children: <p>{intl.get("subscribe")}.</p> }}
                checked={this.state.checked}
                onChange={this.handleChange}
              />
            </Form.Field>
          </div>

          <Form.Group>
            <Form.Field control={Button} basic
              type='reset' onClick={this.handleReset}>
              {intl.get("cancel")}
            </Form.Field>
            <div className={styles.alignRight}>
              <Form.Field control={Button}
                style={buttonCss.secondary}
                type='submit'>
                {intl.get("register")}
              </Form.Field>
            </div>
          </Form.Group>
        </Form>
        <h3>OR</h3>
        <div>
          <button className={styles.customBtn} onClick={this.handleGoogleRegistration}>
            <span className={styles.icon}><img src={googleIcon} alt="" /></span>
            <div className={styles.buttonText}>Register with Google</div>
          </button>
          <button className={styles.customBtnFacebook} onClick={this.handleFacebookRegistration}>
            <span className={styles.facebookIcon}><img src={facebookIcon} alt="" /></span>
            <div className={styles.buttonText}>Register with Facebook</div>
          </button>
        </div>
      </div>
    );
  }
}

const RegisterReduxForm = connect()(reduxForm({ form: 'registerForm', validate })(RegisterForm));
export { RegisterReduxForm as RegisterForm };