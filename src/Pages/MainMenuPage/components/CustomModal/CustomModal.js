import React, { Component } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTracker } from '../../../../components';
import { PaymentComponent } from '../../../AccountSettingsPage/components';
import { Elements } from 'react-stripe-elements';
import styles from '../CustomModal/CustomModal.scss';
import { paymentPlanActions } from '../../../../actions';
import intl from 'react-intl-universal'
import generalCss from '../../../../resources/styles/general.css';

class CustomModal extends Component {

  state = {
    isFetchingPaymentPlans: true,
    paymentPlanOptions: [],
    selectedPaymentPlan: null,
    coupon: ""
  }

  componentDidMount() {
    this.props.dispatch(paymentPlanActions.getPaymentPlans());
  }

  componentWillReceiveProps(nextProps) {
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

  handleCouponChange = (e, data) => {
    this.setState({ coupon: e.target.value });
  }

  render() {
    const { open, isCurrentUserAdmin, account } = this.props

    return (
        <div hidden={!open} className={isCurrentUserAdmin ? styles.modal : styles.modalNotAdmin}>
          <div className={styles.title}>{intl.get("freeTrialEnded")}</div>
            { isCurrentUserAdmin ?
              <div>
              <div className={styles.titleDescriptionAdmin}>{intl.get("freeTrialEndedAdminText")}</div>
              <div>
                <div className={styles.dropdownMargin}>
                <Form>
                  <Form.Field style={generalCss.maxWidth170}>
                    <label>{intl.get("coupon")}</label>
                    <input value={this.state.coupon} onChange={this.handleCouponChange} name="coupon" />
                  </Form.Field>
                  <Form.Field>
                    <label>{intl.get("paymentPlan")}</label>
                    <Dropdown style={generalCss.fullWidth}
                      placeholder={intl.get("paymentPlans")}
                      selection
                      options={this.state.paymentPlanOptions}
                      value={this.state.selectedPaymentPlan ? this.state.selectedPaymentPlan.value : null}
                      onChange={this.handlePaymentPlanChange}
                    />
                  </Form.Field>
                </Form>
                </div>
                <div>
                  <Elements>
                    <PaymentComponent paymentPlan={this.state.selectedPaymentPlan} coupon={this.state.coupon}/>
                  </Elements>
                </div>
              </div>
              </div>
              :
              <div className={styles.titleDescription}>
                {intl.get("freeTrialEndedText")}
                <a href={"mailto:" + account.admin.email}>{account.admin.email}</a>
              </div>
            }
        </div>
    )
  }
}

function mapStateToProps(state) {
  const { account } = state.accountSettings;
  const { paymentPlans } = state.paymentPlan;

  return {
    account,
    paymentPlans
  };
} 

const composedCustomModal = compose(withTracker, connect(mapStateToProps))(CustomModal);
export { composedCustomModal as CustomModal };