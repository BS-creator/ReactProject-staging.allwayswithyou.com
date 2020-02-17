import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { InputField } from 'react-semantic-redux-form';
import styles from './SignInForm.scss';
import buttonCss from '../../../../resources/styles/button.css';
import intl from 'react-intl-universal'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'email',
    'password',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = intl.get("required")
    }
  })

  if(values['email'] && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values['email'])){
    errors['email'] = intl.get("invalidEmail");
  }

  return errors
}

class SignInForm extends Component {

  handleReset = () => {
    this.props.dispatch(reset('signInForm'));
  }

  render() {

    const { handleSubmit } = this.props;

    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <Field name='email' component={InputField}
            label={intl.get("emailAddress")}/>

          <Field name='password' component={InputField} label={intl.get("passwordOne")} type='password'/>

          <Form.Group>
            <Form.Field control={Button}
              type='reset' onClick={this.handleReset}>
              {intl.get("cancel")}
            </Form.Field>
            <div className={styles.alignRight}>
            <Form.Field control={Button}
              style={buttonCss.primary}
              type='submit'>
              {intl.get("signIn")}
            </Form.Field>
            </div>
          </Form.Group>
          <Form.Field>
            <div>{intl.get("dontHaveAccount")} <a href={`${process.env.PUBLIC_URL}/register`}>{intl.get("signUp")}</a></div>
          </Form.Field>
          <Form.Field>
            <div><a href={`${process.env.PUBLIC_URL}/forgot-password`}>{intl.get("forgotPassword")}</a></div>
          </Form.Field>
        </Form>
      </div>
    );
  }
}

const SignInReduxForm = connect()(reduxForm({ form: 'signInForm', validate })(SignInForm));
export { SignInReduxForm as SignInForm };