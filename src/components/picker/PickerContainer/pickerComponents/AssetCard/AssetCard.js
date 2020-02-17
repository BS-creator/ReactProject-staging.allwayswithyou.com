import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './AssetCard.scss';
import assetCardCss from './assetCard.css';

class AssetCard extends Component {
  render() {
    const selectedAssets = this.props.selectedAssets.map( el => {
      return el.id;
    });
    return (
      <Card 
        style={ selectedAssets.indexOf(this.props.asset.id) !== -1 ? assetCardCss.selected : assetCardCss.notSelected}
        onClick={this.props.handleClick}
        >
        <div className={styles.defaultContent}>
          <img src={this.props.asset.baseUrl} alt={''}/>
        </div>
        <h4 style={{textAlign:"center"}}>{this.props.asset.filename}</h4>

      </Card>
    );
  }
}

export { AssetCard };