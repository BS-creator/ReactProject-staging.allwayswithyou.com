import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './RegistrationCompletePage.scss';
import { Button } from 'semantic-ui-react';
import { history } from '../../helpers';
import { compose } from 'recompose';
import { withTracker, CustomMenu } from '../../components';
import QRCode from 'qrcode.react';
import { accountActions, userActions } from '../../actions';
import buttonCss from '../../resources/styles/button.css';
import intl from 'react-intl-universal';

class RegistrationCompletePage extends Component {

  componentDidMount(){
    this.props.dispatch(accountActions.get());
  }

  handleClick = () => {
    this.props.dispatch(userActions.finishedWizardFlow());
    history.replace('/');
  }

  render() {

    const { isFetching, account } = this.props;

    return (
      !isFetching ? 
      <div>
      <CustomMenu/>
      <div className={styles.container}>
          <div className={styles.header}>
            <h1>
              {intl.get("registrationComplete")}
            </h1>
          </div>
          <div className={styles.centerAndWrap}>
            <div className={styles.appCode}>
              <h2>{intl.get("enterManually")}</h2>
              <div>
                <h4>
                  {intl.get("yourApplicationCode")}
                </h4>
                <div>
                  {`${account.applicationCode}`}
                </div>
              </div>
            </div>
            <div className={styles.diviner}>
              <div>
                {intl.get("or")}
              </div>
            </div>
            <div className={styles.QRCode}>
              <h2>{intl.get("scanUsingTheApp")}</h2>
              <div className={styles.content}>
                <QRCode value={account.applicationCode} />
              </div>
              <div className={styles.alignRight}>
                <Button style={buttonCss.primary}
                 onClick={this.handleClick}>
                  {intl.get("done")}
                </Button>
              </div>
            </div>
          </div>
      </div>
      </div>
        :
        null
    );
  }
}

function mapStateToProps(state) {
  const { accountSettings } = state;
  const { account, isFetching } = accountSettings;

  return {
    account,
    isFetching
  };
}

const composedRegistrationCompletePage = compose(withTracker , connect(mapStateToProps))(RegistrationCompletePage);
export { composedRegistrationCompletePage as RegistrationCompletePage };