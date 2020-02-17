import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './AssetCard.scss';
import assetCardCss from './assetCard.css';
import { fileService } from '../../../../../services';
import audioThumb from '../../../../../resources/images/Audio.svg';
import './file-name-style-override.css';
import generalCss from '../../../../../resources/styles/general.css';

import Photos from 'googlephotos';

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
  constructor (props) {
    super(props);
    // this.handleDblClick = this.handleDblClick.bind(this);
  }
  componentDidMount() {
      this.getThumb();
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(this.props.asset, nextProps.asset)
  //   console.log("called")
  //   if (this.props.asset.id != nextProps.asset.id) {

  //   } 
  // }

  getThumb = async() => {
    if (this.state.image === null) {
      let token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
      let photos = new Photos(token);
      const response = await photos.mediaItems.search(this.props.asset.id, 1);
      console.log(response)
      let img = (response.hasOwnProperty("mediaItems")) ? response.mediaItems[0].baseUrl : null
      this.setState({image: img})
    }
  }

  handleDblClick(albumId) {
    console.log(albumId, "handledblclick")
    this.props.doubleClick(albumId)
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
        onDoubleClick={this.handleDblClick.bind(this, this.props.asset.id)}
        >
        <div className={styles.defaultContent} >
          <img src={this.state.image} style={this.state.audio ? generalCss.padding15 : {}} alt={''}/>
        </div>
        <div className={[styles.audioFileName, "no-radius"]}>
            {this.state.audio &&
              <div className={styles.audioFileNameText}>{asset.title}</div>
            }
        </div>
        <h4 style={{textAlign:"center"}}>{asset.title}</h4>
      </Card>
    );
  }
}

export { AssetCard };