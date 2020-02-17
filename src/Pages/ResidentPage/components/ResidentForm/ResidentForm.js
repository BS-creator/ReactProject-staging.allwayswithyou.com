import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Checkbox, Button } from 'semantic-ui-react';
import { InputField, SelectField } from 'react-semantic-redux-form';
import styles from './ResidentForm.scss';
import { yearOptions } from '../../../../resources/arrays';
import { userActions } from '../../../../actions';
import { Line } from 'rc-progress';
import buttonCss from '../../../../resources/styles/button.css';
import colorsCss from '../../../../resources/styles/colors.css';
import intl from 'react-intl-universal'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'firstName',
    'lastName',
    'yearOfBirth',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = intl.get("required")
    }
  })
  return errors
}

class ResidentForm extends Component {

  state = {checked: false}

  handleChange = () => {
    this.setState({ checked: !this.state.checked });
  }

  handleReset = () => {
    this.props.dispatch(reset('residentForm'));
    this.props.dispatch(userActions.logout());
  }

  render() {
    
    const { handleSubmit } = this.props;
    
    return (
      <div className={styles.paddingSides}>
        <Form onSubmit={handleSubmit} >
          <Field name='firstName' component={InputField}
            label={intl.get("firstName")}/>

          <Field name='lastName' component={InputField}
            label={intl.get("lastName")}/>

          <Field name="yearOfBirth" component={SelectField}
            label={intl.get("yearOfBirth")}
            options={yearOptions()}/>

          <Form.Field>
            <Checkbox
              label={{  children: <p>{intl.get("bySigningUp")} <a href="https://www.allwayswithyou.com/legal/terms-and-conditions">{intl.get("termsAndConditions")}</a>.</p> }}
              checked={this.state.checked}
              onChange={this.handleChange}
            />
          </Form.Field>

          <Form.Group>
            <Form.Field control={Button} basic
              type='reset' onClick={this.handleReset}>
              {intl.get("cancel")}
            </Form.Field>
             <div className={styles.alignRight}>
            <Form.Field control={Button} disabled={!this.state.checked}
              style={buttonCss.secondary}
              type='submit'>
              {intl.get("register")}
            </Form.Field>
            </div> 
          </Form.Group>

          <div className={styles.progressBar}>
            <Line percent="25" strokeWidth="4" trailWidth="4" strokeColor={colorsCss.green} trailColor={colorsCss.grey}/>
          </div>

        </Form>
      </div>
    );
  }
}

const ResidentReduxForm = connect()(reduxForm({ form: 'residentForm', validate })(ResidentForm));
export { ResidentReduxForm as ResidentForm };