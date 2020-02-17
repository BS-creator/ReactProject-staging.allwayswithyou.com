import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { InputField } from 'react-semantic-redux-form';
import styles from './InviteForm.scss';
import buttonCss from '../../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import generalCss from '../../../../resources/styles/general.css';

const required = value => value ? undefined : intl.get("required");
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  intl.get("invalidEmail") : undefined;

class InviteForm extends Component {

  render() {

    const { handleSubmit } = this.props;

    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <div className={styles.invite}>
            <div style={generalCss.fullWidth}>
              <div>
                <Field name='email' component={InputField}
                label={intl.get("emailAddress")} validate={[required, email]}/>
              </div>
              <small className={styles.smallText}>{intl.get("neverShare")}</small>
            </div>
            <div className={styles.btn}>           
                <Form.Field control={Button} 
                style={buttonCss.primary}
                type='submit'>
                {intl.get("invite")}
              </Form.Field>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { localeReducer } = state;
  const { lang } = localeReducer;

  return {
    lang
  }
}



const InviteReduxForm = connect(mapStateToProps)(reduxForm({ form: 'inviteForm'})(InviteForm));
export { InviteReduxForm as InviteForm };