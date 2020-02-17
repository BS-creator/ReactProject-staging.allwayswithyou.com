import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styles from './ForgotPasswordPage.scss';
import { ForgotPasswordForm } from './components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { toast } from 'react-toastify';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import { history } from '../../helpers';
import intl from 'react-intl-universal';

class ForgotPasswordPage extends Component {

  handleSubmit = (values) => {
    const self = this;
    //firebase forgot password api
    firebase.auth().sendPasswordResetEmail(values.email).then(() => {
      self.props.dispatch(reset('forgotPasswordForm'));
      toast.success(intl.get('passwordSuccessfullyReset'));

      history.replace('/login');
    });
  }

  render() {

    return (
      <Grid>
        <Row>
          <Col mdOffset={4} md={4}>
            <h1 className={styles.header}>{intl.get("forgotPasswordPageHeader")}</h1>
            <ForgotPasswordForm onSubmit={this.handleSubmit}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const composedForgotPasswordPage = compose(withTracker , connect())(ForgotPasswordPage);
export { composedForgotPasswordPage as ForgotPasswordPage };
