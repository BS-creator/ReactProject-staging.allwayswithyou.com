import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './AlbumCard.scss';
import { fileService } from '../../../services';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTracker } from '../../';
import album from '../../../resources/images/album-icon.png';
import albumCardCss from '../../../resources/styles/albumCard.css';
import avatar from '../../../resources/images/Users.svg';

function _imageEncode (arrayBuffer) {
  let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer),function(p,c){return p+String.fromCharCode(c)},''))
  let mimetype="image/jpeg"
  return "data:"+mimetype+";base64,"+b64encoded
}

class AlbumCard extends Component {

  state = {
    uploaders : []
  };

  componentDidMount() {
    const {uploaders} = this.props;
    
    if( uploaders !== null){
      const len = uploaders.length;
      for(let i=0; i<len ; i++){
        let el = uploaders[i];
        if(el.profilePictureUrl){
          fileService.getImage(el.profilePictureUrl.concat('?type=profilephoto')).then(image => {
            let currentUploaders = this.state.uploaders;
            currentUploaders.push({image : _imageEncode(image), id : el.id})
            this.setState({ uploaders : currentUploaders});
          });
        }else{
          let currentUploaders = this.state.uploaders;
          currentUploaders.push({image : avatar, id : el.id})
          this.setState({ uploaders : currentUploaders});
        }
        
      }
    } 
  }

  handleClick = () => {
    this.props.handleClick();
  }

  render() {
    const { name, description, albumId } = this.props;
    const { uploaders } = this.state;

    //let up = uploaders.concat(uploaders).concat(uploaders).concat(uploaders);

    return (
      <Card key={albumId} onClick={this.handleClick} style={albumCardCss.notSelect}> 
          <Card.Content extra className={styles.title}>
            <Card.Header style={albumCardCss.header}>
              {name}
            </Card.Header>
          </Card.Content>
        <Card.Content className={styles.defaultContent}>
          <Card.Description className={styles.description}>
            {description}
          </Card.Description>
            <div className={styles.albumIcon}>
              <img src={album} alt={''}/>
            </div>
            <div className={styles.uploaderPhotos}>
            {uploaders.length !== 0 && uploaders.map((uploader, i) => {
              return (
                <div className={styles.uploaderPhoto} key={i}>
                  <img src={uploader.image} alt={''} />
                </div>
              )
            })}
            </div>
            
        </Card.Content>
      </Card>
    );
  }
}


function mapStateToProps(state) {
  const { albums } = state;
  const { album } = albums;

  return {
    album
  };
}

const composedAlbumCard = compose(withTracker, connect(mapStateToProps))(AlbumCard);
export { composedAlbumCard as AlbumCard };