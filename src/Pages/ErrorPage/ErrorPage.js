import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { CustomMenu } from '../../components';
import generalCss from '../../resources/styles/general.css';

class ErrorPage extends Component {

  render() {
    const { displayedMessage } = this.props
    
    return (
      <div>
        <CustomMenu />
        <h1 style={generalCss.errorPageHeading}>{intl.get(displayedMessage)}</h1>
      </div>

    );
  }
}

export { ErrorPage };
