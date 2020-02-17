import React, { Component } from 'react';
import { Modal, Image } from 'semantic-ui-react';
import { PickerContainer } from '../../../components/picker';
import intl from 'react-intl-universal';
import { importActions } from '../../../actions';
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
                    let response = await this.fetchGooglePhotos(photos);
                    let tokens = this.state.tokens;
                    tokens.push(response.nextPageToken)
                    this.setState({ pickerOpen : true, pickerContent : response, photos: photos, tokens: tokens });
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
    

    fetchGooglePhotos = async (photos, token) => {
        const filters = new photos.Filters(true);
        const mediaTypeFilter = new photos.MediaTypeFilter(photos.MediaType.ALL_MEDIA);
        filters.setMediaTypeFilter(mediaTypeFilter);
        if (token) {
        let response = await photos.mediaItems.search(filters, 24, token);
        console.log(response, 'photos')
        return response;
        } else {
        let response = await photos.mediaItems.search(filters, 24);
        return response;
        }
    }

      handleGoogleLogin =  () => {
        window.gapi.auth2.getAuthInstance().signOut();
        this.handleSignInClick();
      }
    
      getNextPickerContent = async () => {
        try{
          let tokens = this.state.tokens;
          let response = await this.fetchGooglePhotos(this.state.photos, tokens[tokens.length-1]);
          tokens.push(response.nextPageToken)
          this.setState({ pickerContent : response, tokens: tokens });
        } catch(e){
          console.log("Get next content resulted error...");
          this.setState({ pickerOpen : false });
        }
          
      }
      
      getPreviousPickerContent = async () => {
        try{
          let tokens = this.state.tokens;
          tokens.pop();
          tokens.pop();
          let response = await this.fetchGooglePhotos(this.state.photos, tokens[tokens.length-1]);
          tokens.push(response.nextPageToken)
          this.setState({ pickerContent : response, tokens: tokens });
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
          <PickerContainer 
            content={this.state.pickerContent} 
            photos={this.state.photos} 
            next= {this.getNextPickerContent}
            previous = {this.getPreviousPickerContent}
            import = {this.uploadImportedContent}
            close = {this.closePicker}
            tokens = {this.state.tokens}
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