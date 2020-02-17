import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomMenu } from '../../components';
import styles from './AccountSettingsPage.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { accountActions, userActions, userSettingsActions, paymentPlanActions } from '../../actions';
import { Form, Dropdown, Button, Icon, Label } from 'semantic-ui-react';
import { PaymentComponent } from './components';
import { Elements } from 'react-stripe-elements';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import QRCode from 'qrcode.react';
import { fileService } from '../../services';
import { UploadPhoto, CustomModal } from '../../components';
import buttonCss from '../../resources/styles/button.css';
import errorCss from '../../resources/styles/error.css';
import intl from 'react-intl-universal';
import { NonSelectableLabel } from '../../components/NonSelectableLabel';

const validateSkypeId = (skypeId) => {
  if (skypeId) {
    const regex = /^[A-Za-z\d,\-._]{6,32}$|^live:[A-Za-z\d,\-._]{1,32}$/;
    return regex.test(skypeId);
  } else {
    return true;
  }
}

class AccountSettingsPage extends Component {

  state = {
    paymentPlanOptions: [],
    selectedPaymentPlan: null,
    coupon: "",
    name: "",
    skypeId: "",
    invalidSkypeId: false,
    subscribed: false,
    editable: false,
    open: false
  }

  componentDidMount() {
    this.props.dispatch(accountActions.get());
    this.props.dispatch(userSettingsActions.get());
    this.props.dispatch(paymentPlanActions.getPaymentPlans());
  }

  componentWillReceiveProps(nextProps) {
    const name = nextProps.user.displayName;
    const subscribed = nextProps.settings.subscribed;
    const skypeId = nextProps.user.skypeId;

    if (name && this.state.name !== name) {
      this.setState({ name: name });
    }

    if (subscribed && this.state.subscribed !== subscribed) {
      this.setState({ subscribed: subscribed });
    }

    if (skypeId && this.state.skypeId !== skypeId) {
      this.setState({ skypeId: skypeId });
    }

    const { paymentPlans, account } = nextProps;

    if (paymentPlans && account) {
      const paymentPlanOptions = Array.from(paymentPlans, pp => {
        return {
          key: pp.id,
          value: pp.id,
          text: pp.nickname,
          currency: pp.currency,
          interval: pp.interval
        }
      });

      let selectedPaymentPlan = null;
      if (account.payment) {
        selectedPaymentPlan = paymentPlanOptions.find(pp => pp.key === account.payment.paymentPlanId);
      }

      this.setState({ paymentPlanOptions: paymentPlanOptions, selectedPaymentPlan: selectedPaymentPlan });
    }
  }

  handlePaymentPlanChange = (e, paymentPlan) => {
    let { paymentPlanOptions, selectedPaymentPlan } = this.state;

    if (!selectedPaymentPlan || (selectedPaymentPlan && selectedPaymentPlan.key !== paymentPlan.value)) {
      selectedPaymentPlan = paymentPlanOptions.find(pp => pp.key === paymentPlan.value);

      this.setState({ selectedPaymentPlan: selectedPaymentPlan });
    }

  }

  handleEditable = (e) => {
    this.setState({ editable: true });
  }

  handleEditSave = (e) => {
    this.setState({ editable: false });

    const { name, subscribed, skypeId } = this.state;
    let { settings, user } = this.props;

    if (subscribed !== settings.subscribed) {
      settings.subscribed = subscribed;
      this.props.dispatch(userSettingsActions.update(settings));
    }

    if (name !== user.displayName || skypeId !== user.skypeId) {
      user.displayName = name;
      user.skypeId = skypeId;

      if (validateSkypeId(user.skypeId)) {
        this.props.dispatch(userActions.update(user));
      }
      else {
        this.setState({ invalidSkypeId: true, editable: true })
      }
    }
  }

  handlePersonalDataChange = (e, data) => {
    this.setState({ name: e.target.value });
  }

  handleCouponChange = (e, data) => {
    this.setState({ coupon: e.target.value });
  }

  handleSkypeIdChange = (e, data) => {
    this.setState({ skypeId: e.target.value, invalidSkypeId: false });
  }

  handleUpload = (photo) => {
    fileService.post(photo).then(profilePictureUrl => {
      let { user } = this.props;
      user.profilePictureUrl = profilePictureUrl;

      this.props.dispatch(userActions.update(user));
    }).catch(e => {
      console.log(e);
    })
  }

  handleSubscribe = (e, data) => {
    this.setState({ subscribed: !this.state.subscribed });
  }

  handleDeleteAccount = () => {
    this.props.dispatch(accountActions.remove());
    this.handleDeleteClick();
  }

  handleDeleteClick = () => {
    this.setState({ open: !this.state.open });
  }

  handleDownloadClick = () => {
    this.props.dispatch(accountActions.downloadData());
  }

  render() {
    const { user, isFetching, account, downloadInProgress } = this.props;
    const { selectedPaymentPlan, paymentPlanOptions } = this.state;

    return (
      <div>
        <CustomMenu />
        {user.rfnId && !isFetching && account &&
          <div>
            <h1 className={styles.header}>{intl.get("accountHeader")}</h1>
            <Grid>
              <Row>
                <Col mdOffset={4} md={4}>
                  <UploadPhoto photo={this.props.profilePicture} onUpload={this.handleUpload} theWidth="auto" />
                </Col>
                <Col mdOffset={4} md={4}>

                  <Form>
                    <Form.Group>
                      <div className={styles.alignRight}>
                        <Form.Field control={Button}
                          style={buttonCss.edit}
                          onClick={this.handleEditable}>
                          <Icon className={styles.btnIcon} name='pencil' />
                          {intl.get("edit")}
                        </Form.Field>
                      </div>
                    </Form.Group>

                    <Form.Field>
                      <label>{intl.get("displayName")}</label>
                      <input value={this.state.name} onChange={this.handlePersonalDataChange} name="name" readOnly={!this.state.editable} />
                    </Form.Field>

                    <Form.Field>
                      <label>{intl.get("skypeId")}</label>
                      <input value={this.state.skypeId} onChange={this.handleSkypeIdChange} name='skypeId' placeholder={intl.get("skypeIdPlaceholder")} readOnly={this.state.editable ? false : true} />
                      {this.state.invalidSkypeId &&
                        <Label error pointing style={errorCss.accountErrorLabel} >{intl.get("validSkypeId")}</Label>
                      }
                    </Form.Field>

                    <Form.Field>
                      <input type="checkbox" id="subscribeCheckbox" className={styles.checkbox} onChange={this.handleSubscribe} checked={this.state.subscribed}
                        disabled={this.state.editable ? false : true} />
                      <label className={styles.subscribeLabel} htmlFor="subscribeCheckbox">{intl.get("subscribe")}</label>
                    </Form.Field>

                    <Form.Group>
                      <div className={styles.alignRight}>
                        <Form.Field
                          control={Button}
                          style={buttonCss.primary}
                          type='submit'
                          disabled={!this.state.editable || (this.props.settings.subscribed === this.state.subscribed && this.props.user.displayName === this.state.name && this.props.user.skypeId === this.state.skypeId)}
                          onClick={this.handleEditSave}
                        >
                          {intl.get("save")}
                        </Form.Field>
                      </div>
                    </Form.Group>

                    <Form.Field>
                      <label>{intl.get("applicationCode")}</label>
                      <NonSelectableLabel label={'#'} text={account.applicationCode} />
                    </Form.Field>

                    <Form.Field>
                      <label>{intl.get("emailAddress")}</label>
                      <NonSelectableLabel label={'@'} text={user.email} />
                    </Form.Field>

                    <Form.Field>
                      <label>{intl.get("QRCode")}</label>
                      <div className={styles.QRCode}>
                        <QRCode value={account.applicationCode} />
                      </div>
                    </Form.Field>

                    {user.isAdmin &&
                      <Form.Field>
                        {(selectedPaymentPlan && account.payment && account.payment.cardLast4) &&
                          <Form.Field>
                            <label>{intl.get("subscriptionInfo")}</label>
                            <NonSelectableLabel label={selectedPaymentPlan.currency.toUpperCase()} text={intl.get("accountPaymentCard", { paymentInterval: selectedPaymentPlan.interval, paymentCard: account.payment.cardLast4 })} />
                          </Form.Field>
                        }

                        {(!account.payment || !account.payment.cardLast4) &&
                          <Form.Field>
                            <label>{intl.get("coupon")}</label>
                            <input value={this.state.coupon} onChange={this.handleCouponChange} name="coupon" />
                          </Form.Field>
                        }

                        <Form.Field>
                          <label>{intl.get("paymentPlan")}</label>
                          <Dropdown
                            placeholder={intl.get("selectYourPaymentPlan")}
                            selection
                            options={paymentPlanOptions}
                            defaultValue={selectedPaymentPlan ? selectedPaymentPlan.value : null}
                            onChange={this.handlePaymentPlanChange} />
                        </Form.Field>

                      </Form.Field>
                    }

                    <Form.Group className={styles.accountButtons}>
                      <div>
                        {downloadInProgress ?
                          <Form.Field control={Button}
                            style={buttonCss.delete}
                            disabled={true}
                          >
                            <Icon loading name="spinner" size="large" />
                          </Form.Field>
                          :
                          <Form.Field control={Button}
                            style={buttonCss.delete}
                            onClick={this.handleDownloadClick}
                          >
                            <Icon className={styles.btnIcon} name='cloud download' />
                            {intl.get("downloadData")}
                          </Form.Field>
                        }
                      </div>
                      <div>
                        <Form.Field control={Button}
                          style={buttonCss.delete}
                          onClick={this.handleDeleteClick}
                        >
                          <Icon className={styles.btnIcon} name='trash alternate outline' />
                          {intl.get("deleteAccount")}
                        </Form.Field>
                      </div>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Grid>
            {user.isAdmin &&
              <div className={styles.paymentDetails}>
                <Grid>
                  <Row>
                    <Col mdOffset={4} md={4}>
                      <Elements>
                        <PaymentComponent paymentPlan={selectedPaymentPlan} coupon={this.state.coupon} />
                      </Elements>
                    </Col>
                  </Row>
                </Grid>
              </div>
            }
          </div>
        }

        <CustomModal
          open={this.state.open}
          handleClose={this.handleDeleteClick}
          handleDelete={this.handleDeleteAccount}
          header={intl.get('deleteAccount')}
          description={intl.get('deleteAccountDescription')}
          mainButtonText={intl.get('delete')}
        />
      </div >
    )
  }
}

function mapStateToProps(state) {
  const { authentication, accountSettings, userSettings, fileReducer, paymentPlan, localeReducer } = state;
  const { user } = authentication;
  const { settings } = userSettings;
  const { account, downloadInProgress } = accountSettings;
  const { profilePicture } = fileReducer;
  const { paymentPlans } = paymentPlan;
  const { lang } = localeReducer

  const isFetching = userSettings.isFetching && accountSettings.isFetching && paymentPlan.isFetching;

  return {
    lang,
    user,
    account,
    settings,
    paymentPlans,
    isFetching,
    profilePicture,
    downloadInProgress
  };
}

const composedAccountSettingsPage = compose(withTracker, connect(mapStateToProps))(AccountSettingsPage);
export { composedAccountSettingsPage as AccountSettingsPage };
