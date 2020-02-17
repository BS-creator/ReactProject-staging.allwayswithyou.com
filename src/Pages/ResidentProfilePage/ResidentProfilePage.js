import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomMenu } from '../../components';
import styles from './ResidentProfilePage.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { ResidentProfileForm } from './components';
import { rfnProfileActions } from '../../actions';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import intl from 'react-intl-universal'

class ResidentProfilePage extends Component {

  state={
    rfn: null
  }

  componentDidMount(){
    const { rfn } = this.props;
    if(rfn == null){
      this.props.dispatch(rfnProfileActions.get());
    }
  }

  handleSubmit = (values) => {
    this.props.dispatch(rfnProfileActions.put(values));
  }

  render() {

    const { rfn, isFetching, rfnProfilePicture } = this.props;

    return (
      <div>
        {!isFetching && 
        <div>
          <CustomMenu/>
          <h1 className={styles.header}>{intl.get("rfnProfileHeader", {firstName:rfn.firstName, lastName:rfn.lastName})}</h1>
          <Grid className={styles.paddingSides}>
            <Row>
              <Col mdOffset={3} md={6}>
                <ResidentProfileForm
                  rfn={rfn}
                  rfnProfilePicture = {rfnProfilePicture}
                  isFetching={isFetching}
                  onSubmit={this.handleSubmit}
                />
              </Col>
            </Row>
          </Grid>
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { rfnProfile, fileReducer, localeReducer } = state;
  const { rfn, isFetching } = rfnProfile;
  const { rfnProfilePicture } = fileReducer;
  const { lang } = localeReducer;
  if(rfn){
    rfn.likes = rfn.likes || '';
    rfn.dislikes = rfn.dislikes || '';
  }

  return {
    rfn,
    isFetching,
    rfnProfilePicture,
    lang
  };
}

const composedResidentProfilePage = compose(withTracker , connect(mapStateToProps))(ResidentProfilePage);
export { composedResidentProfilePage as ResidentProfilePage };