import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { CustomMenu } from '../../components';
import styles from './UsersManagement.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { InviteForm } from './components/InviteForm';
import { Button } from 'semantic-ui-react';
import { invitationActions, rfnProfileActions } from '../../actions';
import { compose } from 'recompose';
import { withTracker, CustomModal } from '../../components';
import { history } from '../../helpers';
import { Line } from 'rc-progress';
import buttonCss from '../../resources/styles/button.css';
import colorsCss from '../../resources/styles/colors.css';
import intl from 'react-intl-universal';
import { userActions } from '../../actions';

class UsersManagement extends Component {

  state = {
    openInvite: false,
    openUser: false,
    pendingForRemoval: null,
    disable: false
  }

  handleSubmit = (values) => {

    const { rfn } = this.props;

    this.props.dispatch(invitationActions.invite(values, rfn));
    this.props.dispatch(reset('inviteForm'));
  }

  handleDeleteInvitation = () => {
    this.props.dispatch(invitationActions.cancel(this.state.pendingForRemoval.id));
    this.setState({ openInvite: false, disable: !this.state.disable, pendingForRemoval: null });
  }

  handleDeleteUser = () => {
    this.props.dispatch(userActions.remove(this.state.pendingForRemoval.id));
    this.setState({ openUser: false, pendingForRemoval: null, disable: !this.state.disable });
  }

  componentDidMount() {
    this.props.dispatch(userActions.get());
    this.props.dispatch(rfnProfileActions.get());
    this.props.dispatch(invitationActions.getAll());
  }

  handleNext = () => {
    history.replace('/registration-complete');
  }

  handleReinvite = (values) => {

    const { rfn } = this.props;

    this.props.dispatch(invitationActions.reinvite(values, rfn));
    this.setState({ disable: !this.state.disable, pendingForRemoval: null });
  }

  handleClick = (user) => {
    if (this.state.pendingForRemoval !== null) {
      if (this.state.pendingForRemoval !== user) {
        this.setState({ pendingForRemoval: user });
      }
      else {
        this.setState({ pendingForRemoval: null, disable: !this.state.disable });
      }
    }
    else {
      this.setState({ pendingForRemoval: user, disable: !this.state.disable });
    }
  }

  handleOpenInvite = (ivnite) => {
    this.setState({ openInvite: true, pendingForRemoval: ivnite });
  }
  handleOpenUser = (user) => {
    this.setState({ openUser: true, pendingForRemoval: user });
  }

  handleClose = () => {
    this.setState({ openInvite: false, openUser: false });
  }

  render() {
    const { isFetchingInvitations, invitations, isFetchingRfn, isFirstTimeLogin, users, isFetching, rfn } = this.props;

    return (
      <div>
        {!isFetchingInvitations && !isFetchingRfn && !isFetching &&
          <div>
            <CustomMenu />
            <h1 className={styles.header}>{intl.get('usersManagementWizardHeader', { firstName: rfn.firstName, lastName: rfn.lastName })}</h1>
            <Grid className={styles.paddingSides}>
              <Row>
                <Col mdOffset={3} md={6}>
                  <h4>{intl.get('enterEmail')}</h4><br />
                </Col>
              </Row>
              <Row>
                <Col mdOffset={3} md={6}>
                  <InviteForm onSubmit={this.handleSubmit} />
                </Col>
              </Row>
            </Grid>
            <div className={styles.allUsers}>
              <h1 className={styles.header}>{isFirstTimeLogin ? intl.get('pendingInvites') : intl.get("usersHeader")}</h1>

              {users.length !== 0 &&
                <Grid className={styles.paddingSides}>
                  <Row>
                    <Col mdOffset={3} md={12}>
                      <div className={styles.paddingSides}>
                        <h4>{intl.get("activeUsers")}</h4>
                        {users.map(user => {
                          return (
                            <div className={styles.usersField} key={user.id}>
                              <Row>
                                <Col md={6} className={styles.paddingUsers}>
                                  <div className={this.state.pendingForRemoval !== user ? styles.content : styles.selected} onClick={this.handleClick.bind(this, user)}>
                                    {user.displayName ? `${user.displayName} (${user.email})` : user.email}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <div >
                                    {this.state.disable && this.state.pendingForRemoval === user ?
                                      <div className={styles.cancel} >
                                        <Button className={styles.removeButton} onClick={() => this.handleOpenUser(this.state.pendingForRemoval)}>{intl.get("remove")}</Button>
                                      </div> : null
                                    }
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          )
                        })
                        }
                      </div>
                    </Col>
                  </Row>
                </Grid>
              }

              {invitations.length !== 0 &&
                <Grid className={styles.paddingSides}>
                  <Row>
                    <Col mdOffset={3} md={12}>
                      <div className={styles.paddingSides}>
                        {!isFirstTimeLogin && <h4>{intl.get("pendingInvites")}</h4>}
                        {invitations.map(invitation => {
                          return (
                            <div className={styles.usersField} key={invitation.id}>
                              <Row>
                                <Col md={6} className={styles.paddingUsers}>
                                  <div className={this.state.pendingForRemoval !== invitation ? styles.content : styles.selected} onClick={this.handleClick.bind(this, invitation)}>
                                    {invitation.email}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  {this.state.disable && this.state.pendingForRemoval === invitation ?
                                    <div className={styles.cancel}>
                                      <Button className={styles.resendButton} onClick={() => this.handleReinvite(this.state.pendingForRemoval)}>{intl.get("resend")}</Button>
                                      <Button className={styles.removeButton} onClick={() => this.handleOpenInvite(this.state.pendingForRemoval)}>{intl.get("remove")}</Button>
                                    </div> : null
                                  }
                                </Col>
                              </Row>
                            </div>
                          )
                        })
                        }
                      </div>
                    </Col>
                  </Row>
                </Grid>
              }
            </div>
            {isFirstTimeLogin &&
              <Grid>
                <Col mdOffset={3} md={6}>
                  <div className={styles.progressBar}>
                    <div>
                      <div className={styles.btn}>
                        <Button onClick={this.handleNext}
                          style={Object.assign({}, buttonCss.secondary, buttonCss.skip)} >
                          {intl.get("skip")}
                        </Button>
                        <Button onClick={this.handleNext}
                          style={buttonCss.primary} >
                          {intl.get("next")}
                        </Button>
                      </div>
                      <Line percent="75" strokeWidth="4" trailWidth="4" strokeColor={colorsCss.green} trailColor={colorsCss.grey} />
                    </div>
                  </div>
                </Col>
              </Grid>
            }
          </div>
        }

        <CustomModal
          open={this.state.openInvite}
          handleClose={this.handleClose}
          handleDelete={this.handleDeleteInvitation}
          header={intl.get('removeInviteHeader')}
          description={intl.get('removeInviteDescription', { email: this.state.pendingForRemoval ? this.state.pendingForRemoval.email : '' })}
          mainButtonText={intl.get('remove')}
        />

        <CustomModal
          open={this.state.openUser}
          handleClose={this.handleClose}
          handleDelete={this.handleDeleteUser}
          header={intl.get('removeUserHeader')}
          description={intl.get('removeUserDescription', { email: this.state.pendingForRemoval ? this.state.pendingForRemoval.email : '' })}
          mainButtonText={intl.get('remove')}
        />

      </div>

    );
  }
}

function mapStateToProps(state) {
  const { invitation, rfnProfile, authentication, localeReducer, user } = state;
  const { invitations } = invitation;
  const { rfn } = rfnProfile;
  const isFetchingInvitations = invitation.isFetching;
  const isFetchingRfn = rfnProfile.isFetching;
  const { isFirstTimeLogin } = authentication;
  const { lang } = localeReducer;
  const { users, isFetching } = user;

  return {
    lang,
    invitations,
    isFetchingInvitations,
    rfn,
    isFetchingRfn,
    isFirstTimeLogin,
    isFetching,
    users
  };
}

const composedUsersManagement = compose(withTracker, connect(mapStateToProps))(UsersManagement);
export { composedUsersManagement as UsersManagement };