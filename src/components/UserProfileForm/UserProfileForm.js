import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { InputField, CheckboxField } from 'react-semantic-redux-form';
import styles from './UserProfileForm.scss';
import { UploadPhoto } from '../UploadPhoto';
import { userActions } from '../../actions';
import intl from 'react-intl-universal'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'firstName',
    'lastName',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = intl.get("required")
    }
  })

  return errors
}

class UserProfileForm extends Component {

  handleReset = () => {
    this.props.dispatch(reset('profileForm'));
    this.props.dispatch(userActions.logout());
  }

  handleUpload = (photo) => {
    this.props.onUpload(photo);
  }

  render() {

    const { handleSubmit } = this.props;
    
    return (
      <div>
        <Form onSubmit={handleSubmit}>
          <div className={styles.flexForm}>
            <div>
              <div className={styles.field}>
                <Field name='firstName' component={InputField}
                  label={intl.get("firstName")}/>
              </div>

              <div className={styles.field}>
                <Field name='lastName' component={InputField}
                  label={intl.get("lastName")}/>
              </div>
            </div>

            <UploadPhoto photo={this.props.profilePicture} onUpload={this.handleUpload} theWidth="200px"/>
          </div>

          <div className={styles.field}>
            <Field name='subscribed' component={CheckboxField}
              label={intl.get("subscribe")}/>
          </div>
          
          <Form.Group>
            <Form.Field control={Button} basic
            type='reset' onClick={this.handleReset}>
            {intl.get("cancel")}
            </Form.Field>
            <div className={styles.alignRight}>
              <Form.Field control={Button} basic color="green"
              type='submit'>
              {intl.get("next")}
              </Form.Field>
            </div>  
          </Form.Group>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, fileReducer } = state;
  const { user, isFetching } = authentication;
  const { profilePicture } = fileReducer;

  let initialValues = {};
  if(!isFetching){
    if(user.displayName){
      const parts =  user.displayName.split(" ");
      initialValues = {
        firstName: parts[0],
        lastName: parts[1]
      }
    }
  }

  return {
    user,
    initialValues,
    profilePicture
  };
}

const UserProfileReduxForm = connect(mapStateToProps)(reduxForm({ form: 'profileForm', validate })(UserProfileForm));
export { UserProfileReduxForm as UserProfileForm };