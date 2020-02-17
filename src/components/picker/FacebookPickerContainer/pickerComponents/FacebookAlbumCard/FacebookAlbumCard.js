import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import styles from './FacebookAlbumCard.scss';
import facebookAlbumCardCss from './facebookAlbumCard.css';
import intl from 'react-intl-universal';

class FacebookAlbumCard extends Component {

  handleChange = (e) => {
    this.props.handleAlbumSelect(e);
  }

  handleAlbumImport = (e) => {
    this.props.handleAlbumImport(e);
  }

  render() {
    const { name, id } = this.props.asset;

    return (
      <Card 
        style={facebookAlbumCardCss.notSelected}
        >
        <div className={styles.defaultContent} onClick={this.props.handleClick}>
          <img src={this.props.asset.cover_photo} alt={''}/>
        </div>  
        <Card.Content extra style={facebookAlbumCardCss.footer}>
          <div className={styles.albumIcon}>
            {name}
          </div>
          <div>
          <div className={styles.uploaderPhoto} onClick={() => this.handleChange(id)}>...</div>
            <div className={styles.dropdownMenu} hidden={id === this.props.selectedAlbum ? false : true}>
              { !this.props.isAlbum &&
                <span onClick={() => this.handleAlbumImport(this.props.asset)}>{intl.get("importAlbum")}</span>
              }
              <span onClick={this.props.handleClick}>{intl.get("openAlbum")}</span>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export { FacebookAlbumCard };