import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import styles from './ResidentPage.scss';
import { ResidentForm } from './components';
import { userActions } from '../../actions';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import intl from 'react-intl-universal';

class ResidentPage extends Component {

  handleSubmit = (values) => {
    this.props.dispatch(userActions.completeRegistration(values));
  }
  
  render() {

    return (
      <Grid>
        <Grid.Column only='computer' computer={5}>
        </Grid.Column>
        <Grid.Column computer={6} mobile={16}>
          <h1 className={styles.header}>{intl.get("residentPageHeader")}</h1>
          <ResidentForm onSubmit={this.handleSubmit}/>
        </Grid.Column>
      </Grid>
    );
  }
}

const composedResidentPage = compose(withTracker, connect())(ResidentPage);
export { composedResidentPage as ResidentPage };
