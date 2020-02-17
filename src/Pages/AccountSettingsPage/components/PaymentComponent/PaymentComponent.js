import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accountActions } from '../../../../actions';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements';
import './PaymentComponent.css';
import { Form, Button, Input, Loader } from 'semantic-ui-react';
import styles from './PaymentComponent.scss';
import { toast } from 'react-toastify';
import buttonCss from '../../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import generalCss from '../../../../resources/styles/general.css';
import stripeElementsCss from './stripeElements.css';

class PaymentComponent extends Component {

  state = {
    name: '',
    isValid: true,
    paymentInProcess: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatePaymentDataInProgress === false) {
      this._numberElement.clear();
      this._expiryElement.clear();
      this._cvcElement.clear();
      this.setState({ name: '', paymentInProcess: false });
    }
  }

  handleSubmit = () => {

    //event.preventDefault();

    const { paymentPlan, coupon } = this.props;
    const { name } = this.state;

    if (!paymentPlan) {
      toast.error(intl.get('plaseSelectPaymentPlan'));
      return;
    }

    this.setState({ paymentInProcess: true });

    this.props.stripe.createToken({ name }).then(({ token }) => {
      this.props.dispatch(accountActions.updatePaymentData({ tokenId: token.id, paymentPlanId: paymentPlan.key, couponId: coupon }));
    }).catch(() => {
      this.setState({ paymentInProcess: false });
      toast.error(intl.get('invalidPaymentDetails'));
    });

  };

  handleChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    return (
      <div>
        <h2>{intl.get("paymentDetails")}</h2>
        <Form>
          <Form.Field>
            <label>{intl.get("cardholderName")}</label>
            <Input value={this.state.name} onChange={this.handleChange} placeholder={intl.get("yourName")} />
          </Form.Field>
          <Form.Field>
            <label>{intl.get("cardNumber")}</label>
            <CardNumberElement style={stripeElementsCss.stripeElement} onReady={(c) => this._numberElement = c} placeholder='XXXX XXXX XXXX XXXX' />
          </Form.Field>
          <Form.Field>
            <label>{intl.get("expirationDate")}</label>
            <CardExpiryElement placeholder={intl.get("expDate")} style={stripeElementsCss.stripeElement} onReady={(c) => this._expiryElement = c} />
          </Form.Field>
          <div style={generalCss.displayFlex}>
            <Form.Field className={styles.codeSize}>
              <label>{intl.get("securityCode")}</label>
              <CardCVCElement style={stripeElementsCss.stripeElement} onReady={(c) => this._cvcElement = c} />
            </Form.Field>
            <div className={styles.alignRight}>
              <Button
                onClick={() => this.handleSubmit()}
                style={buttonCss.remove}
              >
                {intl.get("save")}
              </Button>
            </div>
          </div>
          <Loader active={this.state.paymentInProcess} />
        </Form>
      </div>
    );
  }
};

function mapStateToProps(state) {
  const { updatePaymentDataInProgress } = state.accountSettings;
  return {
    updatePaymentDataInProgress
  }
}

const injectedPaymentComponent = injectStripe(PaymentComponent);
const connectedPaymentComponent = connect(mapStateToProps)(injectedPaymentComponent);
export { connectedPaymentComponent as PaymentComponent };