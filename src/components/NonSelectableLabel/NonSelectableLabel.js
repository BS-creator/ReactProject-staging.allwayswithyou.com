import React, { Component } from 'react';
import styles from './NonSelectableLabel.scss';

class NonSelectableLabel extends Component {

  render() {
    const { label, text } = this.props;
    
    return (
        <div className="ui labeled input" >
            <div className="ui label label">{label}</div>
            <div className={[styles.text, styles.nonSelectable].join(' ')}>{text}</div>
        </div>
    );
  }
}

export { NonSelectableLabel };