import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './ContentCard.scss';
import { fileService } from '../../../services';
import asset from '../../../resources/images/asset-icon.png';
import avatar from '../../../resources/images/Users.svg';
import albumCardCss from '../../../resources/styles/albumCard.css';
import audioThumb from '../../../resources/images/Audio.svg';
import audioIcon from '../../../resources/images/audio-icon.png';

function _imageEncode (arrayBuffer) {
  let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
  let mimetype="image/jpeg"
  return "data:"+mimetype+";base64,"+b64encoded
}

class ContentCard extends Component {

  state = {
    loaded: false,
    image: null,
    uploaderPhoto: null,
    uploaderPhotoLoaded: false
  };

  componentDidMount() {
    if(this.props.image !== null){
      fileService.getImage(this.props.image).then(image => {
        this.setState({ loaded: true, image: _imageEncode(image)});
      })
    }
    else{
      this.setState({ loaded: true, image: audioThumb});
    }

    if(this.props.uploaderPhoto !== null){
      fileService.getImage(this.props.uploaderPhoto.concat('?type=profilephoto')).then(uploaderPhoto => {
        this.setState({ uploaderPhotoLoaded: true, uploaderPhoto: _imageEncode(uploaderPhoto)});
      })
    } else {
      this.setState({ uploaderPhotoLoaded: true, uploaderPhoto: avatar});
    }
  }

  handleSelect = () => {
    this.props.handleSelect();
  }

  render() {
    const { description, assets, assetId, assetUploaderId, assetName, assetType } = this.props;
    const { loaded, uploaderPhotoLoaded, image, uploaderPhoto } = this.state;

    return (
      <Card onClick={this.handleSelect} 
        style={assets.findIndex(a => a.assetId === assetId && a.assetUploaderId === assetUploaderId) !== -1 ? albumCardCss.select : albumCardCss.notSelect}>
        <div className={styles.defaultContent}>
          {loaded && <img src={image} className={this.props.image != null ? '' : styles.audioPadding } alt={description}/>}
        </div>
        <Card.Content extra className={styles.info}>
          <div className={styles.albumIcon}>
            <img src={this.props.image !== null ? asset : audioIcon} alt={''}/>
          </div>
          <div className={styles.audioFileName}>
            {assetType.startsWith("audio") &&
              <div className={styles.audioFileNameText}>{assetName}</div>
            }
          </div>
          <div className={styles.uploaderPhoto}>
          { uploaderPhotoLoaded && <img src={uploaderPhoto} alt={''}/>}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export { ContentCard };