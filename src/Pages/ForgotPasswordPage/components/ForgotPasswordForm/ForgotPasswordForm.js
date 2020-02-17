import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { InputField } from 'react-semantic-redux-form';
import styles from './ForgotPasswordForm.scss';
import buttonCss from '../../../../resources/styles/button.css';
import intl from 'react-intl-universal'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'email'
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

class ForgotPasswordForm extends Component {

  render() {

    const { handleSubmit } = this.props;

    return (
      <div className={styles.paddingSides}>
        <Form onSubmit={handleSubmit}>
          <Field name='email' component={InputField}
            label={intl.get("emailAddress")}/>
          <div className={styles.expandButton}>
          <Form.Field control={Button}
            style={buttonCss.primary}
            type='submit'>
            {intl.get("resetMyPassword")}
          </Form.Field>
          </div>
        </Form>
      </div>
    );
  }
}



const ForgotPasswordReduxForm = connect()(reduxForm({ form: 'forgotPasswordForm', validate })(ForgotPasswordForm));
export { ForgotPasswordReduxForm as ForgotPasswordForm };