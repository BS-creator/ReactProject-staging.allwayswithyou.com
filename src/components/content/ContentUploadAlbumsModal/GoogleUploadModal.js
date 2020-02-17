import React, { Component } from 'react';
import { Modal, Image } from 'semantic-ui-react';
import { PickerContainer } from '../../../components/picker';
import { AlbumContainer } from '../../../components/picker';
import intl from 'react-intl-universal';
import { importActions } from '../../../actions';
import { albumActions } from '../../../actions';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import Photos from 'googlephotos';
import { withTracker } from '../../../components';
import { compose } from 'recompose';
import { utilityConstants } from '../../../constants';
import logo from '../../../resources/images/google-photos.svg';
import styles from './ContentUploadModal.scss';

const GOOGLE_PHOTOS = "GooglePhotos";


class GoogleUploadModal extends Component {
    state = {
        open: false,
        pickerOpen : false,
        pickerContent : null,
        photos : null,
        tokens : [],
        albumList : [],
        albumTokens : [],
        albums : null,
        showAlbum: true,
        albumPhotos : null
      }
      
    
      constructor(props){
        super(props);
    
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
      }
    
      componentDidMount() {
        this.loadGapi();
      }
    
      loadGapi = () => {
        this.googleLoginScript = document.createElement("script");
        this.googleLoginScript.src = "https://apis.google.com/js/client.js";
    
        this.googleLoginScript.onload = () => {
              window.gapi.load('client:auth2', () => {
              window.gapi.client.setApiKey("");
              // window.gapi.client.init({
              //   apiKey: process.env.REACT_APP_FIREBASE_API_KEY, //'AIzaSyB8urqDZZXL_dW7RRqr_wRbou6IzE5Rtq4',
              //   clientId: process.env.REACT_APP_FIREBASE_GOOGLE_CLIENT_ID, //'905749881575-45je8lgobcabs3ksduihu414u5vvv5b7.apps.googleusercontent.com',
              //   scope: 'https://www.googleapis.com/auth/photoslibrary.readonly'
              // }).then(() => {
                window.gapi.client.init({
                  apiKey: "jlqIdeROdP78bPb9iPSwpHyF", //'AIzaSyB8urqDZZXL_dW7RRqr_wRbou6IzE5Rtq4',
                  clientId: "162823069203-1d7nspe9ur60h4r76qfcvlak8gd0qi91.apps.googleusercontent.com", //'905749881575-45je8lgobcabs3ksduihu414u5vvv5b7.apps.googleusercontent.com',
                  scope: 'https://www.googleapis.com/auth/photoslibrary.readonly'
                }).then(() => {
                // Listen for sign-in state changes.
                window.gapi.auth2.getAuthInstance().isSignedIn.listen(async (isSignedIn) => {
                  // When signin status changes, this function is called.
                  if (isSignedIn) {
                    let token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
                    let photos = new Photos(token);
                    
                    let albums = await this.fetchGoogleAlbums(photos);
                    let albumTokens = this.state.albumTokens;
                    albumTokens.push(albums.nextPageToken)
                    
                    this.setState({ pickerOpen : true, albumPhotos: photos, albumList : albums.albums, albumTokens });
                  }
                });
              });           
          });
        }
        document.body.appendChild(this.googleLoginScript);
      }
      
      handleSignInClick = (event) => {
        window.gapi.auth2.getAuthInstance().signIn();
      }

      fetchGoogleAlbums = async (photos, token) => {
        if (token) {
          const response = await photos.albums.list(12, token);
          console.log(response, "tokentokenawesome")
          return response;
        } else {
          const response = await photos.albums.list(12);
          console.log(response, "notokennotokenawesome")
          return response;
        }
      }

      getPhotosByAlbum = async (albumId) => {
        
        let token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        let photos = new Photos(token);
        console.log(albumId)
        let response = await this.fetchGooglePhotos(photos, false, albumId);
        let tokens = this.state.tokens;
        tokens.push(response.nextPageToken)

        this.setState({ pickerOpen : true, pickerContent : response, photos: photos, tokens: tokens });

      }

      fetchGooglePhotos = async (photos, token, albumId) => {
          console.log(albumId)
          // const filters = new photos.Filters(true);
          // const mediaTypeFilter = new photos.MediaTypeFilter(photos.MediaType.ALL_MEDIA);
          // filters.setMediaTypeFilter(mediaTypeFilter);
          if (token) {
            console.log(token)
            // let response = await photos.mediaItems.search(filters, utilityConstants.PICKER_PAGE_SIZE, token);
            const response = await photos.mediaItems.search(albumId, utilityConstants.PICKER_PAGE_SIZE, token);
            console.log(response, "tokentokenawesome")
            return response;
          } else {
            // let response = await photos.mediaItems.search(filters, utilityConstants.PICKER_PAGE_SIZE);
            const response = await photos.mediaItems.search(albumId, utilityConstants.PICKER_PAGE_SIZE);
            console.log(response, "notokennotokenawesome")
            return response;
          }
      }

      handleGoogleLogin =  () => {
        window.gapi.auth2.getAuthInstance().signOut();
        this.handleSignInClick();
      }
    
      getNextPickerContent = async () => {
        try{
          let tokens = this.state.albumTokens;
          let response = await this.fetchGoogleAlbums(this.state.albumPhotos, tokens[tokens.length-1]);
          tokens.push(response.nextPageToken)
          this.setState({ albumList : response.albums, albumTokens: tokens });
        } catch(e){
          console.log("Get next content resulted error...");
          this.setState({ pickerOpen : false });
        }
          
      }
      
      getPreviousPickerContent = async () => {
        try{
          let tokens = this.state.albumTokens;
          tokens.pop();
          tokens.pop();
          let response = await this.fetchGoogleAlbums(this.state.albumPhotos, tokens[tokens.length-1]);
          tokens.push(response.nextPageToken)
          this.setState({ albumList : response.albums, albumTokens: tokens });
        } catch(e){
          console.log("Get previous content resulted error...");
          this.setState({ pickerOpen : false });
        }
      }
    
      uploadImportedContent = (assets) => {
        this.props.dispatch(importActions.importAssets(assets, this.props.album, this.props.closeFunction, this.props.successCallback));
      }
    
      closePicker = () => {
        this.setState({ pickerOpen : false, tokens : []});
        window.gapi.auth2.getAuthInstance().signOut();
      }

      openPhotos = (albumId) => {
        // console.log(albumId, "openPhotos")
        // let tokens = this.state.tokens;
        // tokens.pop();
        // this.getPhotosByAlbum(albumId);
        // this.setState({showAlbum: false})
      }

      onAddAlbums = async (selectedAlbums) => {
        // this.props.dispatch(albumActions.createAlbum({ name, description }));

        console.log(selectedAlbums, "selectedAlbums")
        let token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        let photos = new Photos(token);
        for (var i = 0; i < selectedAlbums.length; i++) {
          let item = selectedAlbums[i]
          console.log(item.id)
          let response = await this.fetchGooglePhotos(photos, false, item.id);
          let chosenAssets = response.mediaItems;
          
          console.log(chosenAssets, "chosenAssets");
          var retVal = chosenAssets.map(asset => {
            var url = asset.baseUrl;
            if(asset.mimeType.indexOf("image") !== -1){
              url = url.concat("=d")
            }else{
              url = url.concat("=dv")
            }
            return(
              {
                url : url,
                mime : asset.mimeType,
                metadata : asset.mediaMetadata,
                filename : asset.filename,
                importSource : this.props.source
              }
            )
          });
          await this.props.dispatch(albumActions.createAlbum({ name:item.title, description:"Album Description" }, true, retVal));

          console.log(response, "in for loop response")
        }

        this.closePicker();
        
      }

      backToAlbum = () => {
        this.setState({showAlbum: true})
      }
    
    close = () => this.setState({ pickerOpen: false })
  
    render() {
        
        const { importDisabled } = this.props;

      return (
        <Modal
          open={this.state.pickerOpen}
          onOpen={() => this.setState({pickerOpen: true})}
          onClose={() => this.setState({pickerOpen: false})}
          size='small'
          trigger={
            <button 
                id='contentUploadModal_btnGoogleConnect' 
                disabled={importDisabled}
                className="ui left floated basic compact button" 
                onClick={this.handleGoogleLogin}>
                    <Image className={styles.importButtonLogo} src={logo} /> 
                    <span className={styles.importButtonText} >{intl.get("connect")}</span>
            </button>
          }
        >
          <AlbumContainer 
          albumList={this.state.albumList} 
          openPhotos={this.openPhotos}
          next= {this.getNextPickerContent}
          previous = {this.getPreviousPickerContent}
          onAddAlbums={this.onAddAlbums}
          import = {this.uploadImportedContent}
          close = {this.closePicker}
          tokens = {this.state.albumTokens}
          source = {GOOGLE_PHOTOS}
        />
      </Modal>
      )
    }
  }

  function mapStateToProps(state) {
    const {  authentication } = state;
    const { isFirstTimeLogin } = authentication;
  
    return {
      isFirstTimeLogin
    };
  }

  const connectedGoogleUploadModal = compose(withTracker, connect(mapStateToProps))(GoogleUploadModal) ;

  export { connectedGoogleUploadModal as GoogleUploadModal }