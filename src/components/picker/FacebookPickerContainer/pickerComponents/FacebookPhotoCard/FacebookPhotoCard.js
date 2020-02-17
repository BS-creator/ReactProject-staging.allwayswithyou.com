import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './FacebookPhotoCard.scss';
import facebookPhotoCardCss from './facebookPhotoCard.css';

class FacebookPhotoCard extends Component {
  render() {
    const selectedAssets = this.props.selectedAssets.map( el => {
      return el.id;
    });
    return (
      <Card 
        style={ selectedAssets.indexOf(this.props.asset.id) !== -1 ? facebookPhotoCardCss.selected : facebookPhotoCardCss.notSelected}
        onClick={this.props.handleClick}
        >
        <div className={styles.defaultContent}>
          <img src={this.props.asset.picture_full} alt={''}/>
        </div>
      </Card>
    );
  }
}

export { FacebookPhotoCard };