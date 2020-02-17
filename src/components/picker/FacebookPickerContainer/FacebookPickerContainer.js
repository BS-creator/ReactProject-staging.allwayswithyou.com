import React, { Component } from 'react';
import styles from './FacebookPickerContainer.scss';
import { FacebookAlbumCard, FacebookPhotoCard } from './pickerComponents';
import { Grid, Row, Col } from 'react-flexbox-grid';
import buttonCss from '../../../resources/styles/button.css';
import { Button } from 'semantic-ui-react';
import intl from 'react-intl-universal';

class FacebookPickerContainer extends Component {

  state = {
    selectedAssets : [],
    isAlbum: false,
    selectedAlbum: null
  }

  handleSelect = (id) => {
    var assets = this.state.selectedAssets;
    const index = this.state.selectedAssets.indexOf(id);
    if ( index !== -1) {
      assets.splice(index, 1);
      this.setState({ selectedAssets : assets });
    }else {
      assets.push(id)
      this.setState({ selectedAssets: assets });
    }
  }

  importAssets = () => {
    let chosenPhotos = this.state.selectedAssets.map( asset =>{
      return ({ 
        url: asset.picture_full, 
        metadata: { 
          createdTime: asset.created_time
        },
        importSource: this.props.source 
      });
    });

    this.props.import(chosenPhotos);
    this.closeFacebookPicker();
  }

  handlePhotos = (album) => {
    this.setState({isAlbum: !this.state.isAlbum, selectedAlbum: null});
    this.props.handlePhotos(album);
  }

  closeFacebookPicker = async () => {
    this.setState({selectedAssets : [], isAlbum: false });
    await this.props.closeFacebookPicker();
  }

  handleBack = () => {
    this.setState({isAlbum: false, selectedAssets: []});
    this.props.handleAlbums();
  }

  handleWholeAlbumImport = (e) => {
   this.props.handleWholeAlbumImport(e);
  }

  handleSelectAlbum = (albumId) => {
    if(this.state.selectedAlbum !== null){
      if(this.state.selectedAlbum !== albumId){
        this.setState({selectedAlbum: albumId});
      }
      else {
        this.setState({selectedAlbum: null});
      }
    }
    else {
      this.setState({selectedAlbum: albumId});
    }
  }

  render() {
    let content = null;

    if(this.props.content){
      content = this.props.content;
    }

    return (
      <div className={styles.pickerContainer} >
        { !this.state.isAlbum ? 
          <h2 className={styles.pickerHeading}>{intl.get("selectAlbum")}</h2>
          :
          <h2 className={styles.pickerHeading}>{intl.get("selectFiles")} {this.props.album !== null && intl.get("fromAlbumName", {albumName: this.props.album.name})}</h2>
        }
        <Button 
          style={buttonCss.secondary}
          className={styles.pickerCloseButton} 
          onClick={async () => await this.closeFacebookPicker()}
          >X</Button>
        <div className={styles.content} >
              { content !== null ? 
              <Grid>
                <div className={styles.contentContainer} >
            
                    { !this.state.isAlbum ?
                    <Row>
                      {content && 
                        content.map( (album, id) => {
                          return (
                            
                              <Col key={id} md={3} xs={12} className={styles.container}>
                                <FacebookAlbumCard 
                                  key={id} 
                                  asset={album} 
                                  selectedAlbum = {this.state.selectedAlbum}
                                  handleAlbumSelect = {(e)=> this.handleSelectAlbum(e)}
                                  handleClick={() => this.handlePhotos(album)}
                                  handleAlbumImport = {(e) => this.handleWholeAlbumImport(e)}
                                  isAlbum = {this.props.isAlbum}
                                  />
                              </Col>
                          );
                      })}
                    </Row>
                    :
                    <Row>
                    {content && 
                      content.map( (photo, id) => {
                        return (
                          
                            <Col key={id} md={3} xs={12} className={styles.container}>
                              <FacebookPhotoCard 
                                key={id} 
                                asset={photo} 
                                selectedAssets = {this.state.selectedAssets}
                                handleClick={() => this.handleSelect(photo)}
                                />
                            </Col>
                        );
                    })}
                  </Row>
                    }
                
                </div>
              </Grid>
              :
              <Grid className={styles.noContent}>
                  {intl.get("noContent")}
              </Grid>
              }
            </div>
            <div className={styles.pickerButtonsContainer}>
                  { this.state.isAlbum &&
                    <Button
                      style={buttonCss.primary}
                      className={styles.backButton} 
                      onClick={this.handleBack}
                    >{intl.get("back")}</Button>
                  }
                    <Button 
                      style={buttonCss.primary} 
                      className={styles.paginationButton} 
                      onClick={() => this.props.album ? this.props.previous(this.props.album.id) : this.props.previous()}
                      disabled = {this.props.previousToken == null}
                      >{intl.get("previousPage")}</Button>
                    <Button 
                      style={buttonCss.primary} 
                      className={styles.paginationButton} 
                      onClick={() => this.props.album ? this.props.next(this.props.album.id) :  this.props.next(null)}
                      disabled = {this.props.tokens == null}
                      >{intl.get("nextPage")}</Button>

                    { this.state.isAlbum &&
                       <Button 
                      style={buttonCss.primary} 
                      className={styles.importButton} 
                      onClick={()=> {this.importAssets()}}
                      disabled = {this.state.selectedAssets.length === 0 ? true : false}
                      >{intl.get("importButton")}</Button>
                    }
                  </div>
          </div>
    );
  }
}

export { FacebookPickerContainer };