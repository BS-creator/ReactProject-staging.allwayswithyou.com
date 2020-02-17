import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styles from './RegisterPage.scss';
import { RegisterForm } from './components';
import firebase from 'firebase/app';
import 'firebase/auth';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import ReactGA from 'react-ga';
import intl from 'react-intl-universal';
import { errorService } from '../../services';

class RegisterPage extends Component {

  handleSubmit = (values) => {
    const self = this;
    //firebase register api
    firebase.auth().createUserWithEmailAndPassword(values.email, values.password).then(() => {
        self.props.dispatch(reset('registerForm'));
        ReactGA.event({
          category: 'registration',
          action: 'successful registration'
        });
      }).catch(error => {
      errorService.handleFirebaseError(error);
      ReactGA.event({
        category: 'registration',
        action: 'unsuccessful registration'
      });
    });
  }

  render() {

    return (
      <Grid>
        <Row>
          <Col mdOffset={3} md={6}>
            <h1 className={styles.header}>{intl.get("registerPageHeader")}</h1>
            <RegisterForm onSubmit={this.handleSubmit}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const composedRegisterPage = compose(withTracker , connect())(RegisterPage);
export { composedRegisterPage as RegisterPage };
