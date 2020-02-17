import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomMenu } from '../../components';
import styles from './MainMenuPage.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { history } from '../../helpers';
import { rfnProfileActions, accountActions } from '../../actions';
import { compose } from 'recompose';
import { withTracker, CustomCard, ContentCardPlaceholder } from '../../components';
import { CustomModal } from './components/CustomModal';
import intl from "react-intl-universal";
import '../../resources/styles/loading.css';

class MainMenuPage extends Component {

  componentDidMount() {
    this.props.dispatch(rfnProfileActions.get());
    this.props.dispatch(accountActions.get());
  }

  handleContentClick = () => {
    history.push('/content-management');
  }

  handleUsersManagementClick = () => {
    history.push('/users-management');
  }

  handleSettingsClick = () => {
    history.push('/settings');
  }

  handleProfileClick = () => {
    history.push('/resident-profile')
  }

  handleUsageStatsClick = () => {
    history.push('stats');
  }

  render() {
    const { rfn, isFetchingRfn, user, account } = this.props;

    return (
      <div>
        <CustomMenu/>
        
        {(user && !isFetchingRfn) ? 
        <div>
          <div className={rfn.locked ? styles.opacity : styles.noOpacity}>
          <h1 className={styles.header}>{intl.get("mainMenuPageHeader", {firstName:rfn.firstName, lastName:rfn.lastName})}</h1>
            {user.isAdmin ?  
            <Grid>
              <Row> 
                <Col  md={6} xs={12} className={styles.container}>
                  <CustomCard
                    id='mainMenuPage_customCard_1'
                    header={intl.get("contentHeader")}
                    image='Content'
                    description={intl.get("contentDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                    buttonText={intl.get("contentButton")}
                    handleClick={this.handleContentClick}
                    styles={styles}
                    isMainComponent={true}
                    isLocked = {rfn.locked}
                  />
                </Col>
                <Col  md={6} xs={12} className={styles.container}>
                  <CustomCard
                    id='mainMenuPage_customCard_2'
                    header={intl.get("rfnProfileHeader", {firstName:rfn.firstName, lastName:rfn.lastName})}
                    image='Profile'
                    description={intl.get("rfnProfileDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                    buttonText={intl.get("rfnProfileButton")}
                    handleClick={this.handleProfileClick}
                    styles={styles}
                    isMainComponent={true}
                    isLocked = {rfn.locked}
                  />
                </Col>
              </Row>
              <Row>
                <Col  md={4} xs={12} className={styles.container}>
                  <CustomCard
                    id='mainMenuPage_customCard_3'
                    header={intl.get("accountHeader")}
                    image='Settings'
                    description={intl.get("accountDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                    buttonText={intl.get("accountButton")}
                    handleClick={this.handleSettingsClick}
                    styles={styles}
                    isMainComponent={false}
                    isLocked = {rfn.locked}
                  />
                </Col>
                <Col  md={4} xs={12} className={styles.container}>
                    <CustomCard
                    id='mainMenuPage_customCard_4'
                    header={intl.get("usersManagementHeader")}
                    image='Users'
                    description={intl.get("usersDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                    buttonText={intl.get("usersButton")}
                    handleClick={this.handleUsersManagementClick}
                    styles={styles}
                    isMainComponent={false}
                    isLocked = {rfn.locked}
                  />
                </Col>
                <Col  md={4} xs={12} className={styles.container}>
                  <CustomCard
                    id='mainMenuPage_customCard_5'
                    header={intl.get("usageStatsHeader")}
                    image='Data-usage'
                    description={intl.get("usageStatsDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                    buttonText={intl.get("usageStatsButton")}
                    handleClick={this.handleUsageStatsClick}
                    styles={styles}
                    isMainComponent={false}
                    isLocked = {rfn.locked}
                  />
                </Col>
              </Row>
            </Grid> : 
              <Grid>
                <Row className={styles.centerMainContent}> 
                  <Col  md={8} xs={12} className={styles.container}>
                    <CustomCard
                      id='mainMenuPage_customCard_6'
                      header={intl.get("contentHeader")}
                      image='Content'
                      description={intl.get("contentDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                      buttonText={intl.get("contentButton")}
                      handleClick={this.handleContentClick}
                      styles={styles}
                      isMainComponent={true}
                      isLocked = {rfn.locked}
                    />
                  </Col>
                </Row>
                <Row className={styles.centerMainContent}>
                  <Col  md={4} xs={12} className={styles.container}>
                    <CustomCard
                      id='mainMenuPage_customCard_7'
                      header={intl.get("accountHeader")}
                      image='Settings'
                      description={intl.get("accountDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                      buttonText={intl.get("accountButton")}
                      handleClick={this.handleSettingsClick}
                      styles={styles}
                      isMainComponent={false}
                      isLocked = {rfn.locked}
                    />
                  </Col>
                  <Col  md={4} xs={12} className={styles.container}>
                    <CustomCard
                      id='mainMenuPage_customCard_8'
                      header={intl.get("usageStatsHeader")}
                      image='Data-usage'
                      description={intl.get("usageStatsDescription", {firstName:rfn.firstName, lastName:rfn.lastName})}
                      buttonText={intl.get("usageStatsButton")}
                      handleClick={this.handleUsageStatsClick}
                      styles={styles}
                      isMainComponent={false}
                      isLocked = {rfn.locked}
                    />
                  </Col>
                </Row>
              </Grid>
            }
          </div>
        </div>
        : 
        <div>
            <h1 className={styles.header}>{intl.get("mainMenuPageHeaderOnLoading")}</h1>
            <div class="loading">
                <Grid>
                    <Row> 
                        <Col  md={6} xs={12} className={styles.container}>
                            <ContentCardPlaceholder height={"375px"}/>
                        </Col>
                        <Col  md={6} xs={12} className={styles.container}>
                            <ContentCardPlaceholder height={"375px"}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col  md={4} xs={12} className={styles.container}>
                            <ContentCardPlaceholder height={"375px"}/>
                        </Col>
                        <Col  md={4} xs={12} className={styles.container}>
                            <ContentCardPlaceholder height={"375px"}/>
                        </Col>
                        <Col  md={4} xs={12} className={styles.container}>
                            <ContentCardPlaceholder height={"375px"}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
        }

        { rfn && account &&
            <CustomModal
            open = {rfn.locked}
            isCurrentUserAdmin = {user.isAdmin}
            />
        }
       
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { rfnProfile, authentication, paymentPlan, accountSettings, localeReducer } = state;
  const { rfn } = rfnProfile;
  const { user } = authentication;
  const isFetchingRfn = rfnProfile.isFetching;
  const { paymentPlans } = paymentPlan;
  const { account } = accountSettings;
  const { lang } = localeReducer;

  return {
    lang,
    rfn,
    isFetchingRfn,
    user,
    paymentPlans,
    account
  };
}

const composedMainMenuPage = compose(withTracker , connect(mapStateToProps))(MainMenuPage);
export { composedMainMenuPage as MainMenuPage };