import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './AssetCard.scss';
import assetCardCss from './assetCard.css';
import { fileService } from '../../../../../services';
import audioThumb from '../../../../../resources/images/Audio.svg';
import './file-name-style-override.css';
import generalCss from '../../../../../resources/styles/general.css';

function _imageEncode (arrayBuffer) {
  let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
  let mimetype="image/jpeg"
  return "data:"+mimetype+";base64,"+b64encoded
}

class AssetCard extends Component {
  state = {
    loaded: false,
    image: null,
    uploaderPhoto: null,
    uploaderPhotoLoaded: false,
    audio : false
  };

  componentDidMount() {
    if(this.props.asset.thumbnailUrl !== null){
      fileService.getImage(this.props.asset.thumbnailUrl).then(image => {
        this.setState({ loaded: true, image: _imageEncode(image), audio : false});
      })
    }
    else{
      this.setState({ loaded: true, image: audioThumb, audio : true});
    }
  }

  render() {
    const selectedAssets = this.props.selectedAssets.map( el => {
      return el.id;
    });

    const { asset } = this.props;

    return (
      <Card 
        style={ selectedAssets.indexOf(this.props.asset.id) !== -1 ? assetCardCss.selected : assetCardCss.notSelected}
        onClick={this.props.handleClick}
        >
        <div className={styles.defaultContent} >
          <img src={this.state.image} style={this.state.audio ? generalCss.padding15 : {}} alt={''}/>
        </div>
        <div className={[styles.audioFileName, "no-radius"]}>
            {this.state.audio &&
              <div className={styles.audioFileNameText}>{asset.name}</div>
            }
        </div>
      </Card>
    );
  }
}

export { AssetCard };