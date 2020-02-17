import React, { Component } from 'react';
import { Modal, Image } from 'semantic-ui-react';
import intl from 'react-intl-universal';
import { albumActions, importActions } from '../../../actions';
import { connect } from 'react-redux';
import { withTracker } from '../../../components';
import { compose } from 'recompose';
import { FacebookPickerContainer } from '../../../components/picker';
import logo from '../../../resources/images/facebook.svg';
import styles from './ContentUploadModal.scss';
import { toast } from 'react-toastify';

const FACEBOOK_PHOTOS = "FacebookPhotos";

class FbAllPhotos {
	constructor() {
		this.fbAlbumsPhotosObj = {};
	}

	get fullObj() {
		return this.fbAlbumsPhotosObj
	}

	getAlbums(limitAlbums, winCallback, failCallback) {
		window.FB.api('/me/?fields=albums.limit(' + limitAlbums + '){name, picture{url}, cover_photo, count}', response => {
			if(response && response.error) { //If response exists and error
				if(typeof failCallback === 'function') failCallback('error');
				return;
			} else if(!response || !response.hasOwnProperty('albums')) {
				if(typeof failCallback === 'function') failCallback('noResponse');
				return winCallback();
			}

			response.albums.data = response.albums.data.filter( item => { return item.count > 0;});
            response.albums.data.forEach(album => {
                album.cover_photo = album.picture.data.url; //All we need is picture
			});

			this.fbAlbumsPhotosObj = response.albums;

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj);
		});
	}

	async getMoreAlbums(winCallback, failCallback) {
		if(!this.fbAlbumsPhotosObj.paging.hasOwnProperty('next')) { //If there are no more albums
			if(typeof failCallback === 'function') failCallback('noMore');
			return;
		}

		try {
			let response = await fetch(this.fbAlbumsPhotosObj.paging.next);
			if(!response.ok) throw new Error('Server error');
			response = await response.json();

            response.data = response.data.filter( item => { return item.count > 0;});
			response.data.forEach(album => {
				album.cover_photo = album.picture.data.url; //All we need is picture
			});

			this.fbAlbumsPhotosObj.data = response.data; // next albums
			this.fbAlbumsPhotosObj.paging = response.paging; //Set paging to new values

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj);
		} catch(error) {
			if(typeof failCallback === 'function') failCallback('error');
			return;
		}
  }
  
  async getPreviousAlbums(winCallback, failCallback) {
		if(!this.fbAlbumsPhotosObj.paging.hasOwnProperty('previous')) { //If there are no more albums
			if(typeof failCallback === 'function') failCallback('noMore');
			return;
		}

		try {
			let response = await fetch(this.fbAlbumsPhotosObj.paging.previous);
			if(!response.ok) throw new Error('Server error');
			response = await response.json();

            response.data = response.data.filter( item => { return item.count > 0;});
			response.data.forEach(album => {
				album.cover_photo = album.picture.data.url; //All we need is picture
			});

			this.fbAlbumsPhotosObj.data = response.data; // previous albums
			this.fbAlbumsPhotosObj.paging = response.paging; //Set paging to new values

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj);
		} catch(error) {
			if(typeof failCallback === 'function') failCallback('error');
			return;
		}
  }
  
  getAllPhotosInAlbum(albumId, winCallback, failCallback) {
		const index = this.fbAlbumsPhotosObj.data.findIndex(album => album.id === albumId); //Get index of album. Loose checking due to id as string

		if(index === -1) {
			if(typeof failCallback === 'function') failCallback('noAlbum');
			return;
		}

		window.FB.api(albumId + '/?fields=photos{picture,images,created_time}', response => {
			if(response && response.error) { //If response exists and error
				if(typeof failCallback === 'function') failCallback('error');
				return;
			} else if(!response || !response.hasOwnProperty('photos')) {
				if(typeof failCallback === 'function') failCallback('noResponse');
				return;
			}

			response.photos.data.forEach(photo => {
				photo.picture_full = photo.images[0].source; //[0] is the largest image
				delete photo.images; //Only need one full image
			});

			this.fbAlbumsPhotosObj.data[index].photos = response.photos;

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj.data[index].photos);
		});
	}

  getPhotosInAlbum(albumId, limitPics, winCallback, failCallback) {
		const index = this.fbAlbumsPhotosObj.data.findIndex(album => album.id === albumId); //Get index of album. Loose checking due to id as string

		if(index === -1) {
			if(typeof failCallback === 'function') failCallback('noAlbum');
			return;
		}

		window.FB.api(albumId + '/?fields=photos.limit(' + limitPics + '){picture,images,created_time}', response => {
			if(response && response.error) { //If response exists and error
				if(typeof failCallback === 'function') failCallback('error');
				return;
			} else if(!response || !response.hasOwnProperty('photos')) {
				if(typeof failCallback === 'function') failCallback('noResponse');
				return;
			}

			response.photos.data.forEach(photo => {
				photo.picture_full = photo.images[0].source; //[0] is the largest image
				delete photo.images; //Only need one full image
			});

			this.fbAlbumsPhotosObj.data[index].photos = response.photos;

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj.data[index].photos);
		});
	}

	async getMorePhotosInAlbum(albumId, winCallback, failCallback) {
		const index = this.fbAlbumsPhotosObj.data.findIndex(album => album.id === albumId); //Get index of album. //Get index of album. Loose checking due to id as string

		if(index === -1) { //If there are no more albums
			if(typeof failCallback === 'function') failCallback('noAlbum');
			return;
		} else if(!this.fbAlbumsPhotosObj.data[index].photos.paging.hasOwnProperty('next')) { //If there are no more albums
			if(typeof failCallback === 'function') failCallback('noMore');
			return;
		}

		try {
			let response = await fetch(this.fbAlbumsPhotosObj.data[index].photos.paging.next);
			if(!response.ok) throw new Error('Server error');
			response = await response.json();

			response.data.forEach(photo => {
				photo.picture_full = photo.images[0].source; //[0] is the largest image
				delete photo.images; //Don't need the rest, only one
			});

			this.fbAlbumsPhotosObj.data[index].photos.data = response.data; //next photos in album
			this.fbAlbumsPhotosObj.data[index].photos.paging = response.paging; //Set paging to new values

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj.data[index].photos);
		} catch(error) {
			if(typeof failCallback === 'function') failCallback('error');
			return;
		}
  }
  
  async getPreviousPhotosInAlbum(albumId, winCallback, failCallback) {
		const index = this.fbAlbumsPhotosObj.data.findIndex(album => album.id === albumId); //Get index of album. //Get index of album. Loose checking due to id as string

		if(index === -1) { //If there are no more albums
			if(typeof failCallback === 'function') failCallback('noAlbum');
			return;
		} else if(!this.fbAlbumsPhotosObj.data[index].photos.paging.hasOwnProperty('previous')) { //If there are no more albums
			if(typeof failCallback === 'function') failCallback('noMore');
			return;
		}

		try {
			let response = await fetch(this.fbAlbumsPhotosObj.data[index].photos.paging.previous);
			if(!response.ok) throw new Error('Server error');
			response = await response.json();

			response.data.forEach(photo => {
				photo.picture_full = photo.images[0].source; //[0] is the largest image
				delete photo.images; //Don't need the rest, only one
			});

			this.fbAlbumsPhotosObj.data[index].photos.data = response.data; //previous photos in album
			this.fbAlbumsPhotosObj.data[index].photos.paging = response.paging; //Set paging to new values

			if(typeof winCallback === 'function') winCallback(this.fbAlbumsPhotosObj.data[index].photos);
		} catch(error) {
			if(typeof failCallback === 'function') failCallback('error');
			return;
		}
	}
}

class FacebookUploadModal extends Component {

  state = {
    open: false,
    pickerOpen : false,
    pickerFacebookContent: null,
    photos : null,
    tokens : [],
    facebookPickerOpen: false,
    facebookPagingNext: null,
    facebookPagingPrevious: null,
    album: null,
  }
      
    
      constructor(props){
        super(props);

        //this.facebookProvider = new firebase.auth.FacebookAuthProvider();
        this.fb = new FbAllPhotos();
      }
    
      componentDidMount() {
        this.loadFbLoginApi();
      }
    
      
    
      loadFbLoginApi = () => {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId            : process.env.REACT_APP_FACEBOOK_APP_ID,
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.2',
            status: true
          });
        };
    
        (function(d, s, id){
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) {return;}
           js = d.createElement(s); js.id = id;
           js.src = "https://connect.facebook.net/en_US/sdk.js";
           fjs.parentNode.insertBefore(js, fjs);
         }(document, 'script', 'facebook-jssdk'));
      }
    
      uploadImportedContent = (assets) => {
        this.props.dispatch(importActions.importAssets(assets, this.props.album, this.props.closeFunction, this.props.successCallback));
      }
    
      closeFacebookPicker = () => {
        this.setState({ facebookPickerOpen : false, pickerFacebookContent: null, facebookPagingNext: null, facebookPagingPrevious: null });
        this.handleFacebookLogout();
      }
    
      handleFacebookImport = () => {
        window.FB.getLoginStatus(response => {
            if(response.status === 'unknown'){
              this.handleLoginWithFacebook();
            } else if(response.status === 'connected'){
              this.handleFacebookAlbums();
            } 
          });
      }
    
      handleLoginWithFacebook = () => {
        window.FB.login(function(response) {
          if(response.status === 'connected'){
           this.handleFacebookAlbums();
          } else {
            toast.warning(intl.get('fbLoginErrorMessage'));
          }
        }.bind(this), { 
            scope: 'user_photos'
        });
      }
    
      handleFacebookLogout = () => {
        window.FB.logout();
      }
    
      handleFacebookAlbums = () => {
        this.fb.getAlbums(100, response => {
          if(response){
            this.setState({ facebookPickerOpen : true, pickerFacebookContent : response.data, facebookPagingNext: response.paging.next, facebookPagingPrevious: response.paging.previous, album: null });
          }
          else {
            this.setState({ facebookPickerOpen : true });
          }
        });
      }
    
      handleFacebookPhotos = (album) => {
        this.fb.getPhotosInAlbum(album.id, 12 , response => {
          if(response){
            this.setState({ pickerFacebookContent : response.data, facebookPagingNext: response.paging.next, facebookPagingPrevious: response.paging.previous, album: album });
          }
        });
      }
    
      getNextFacebookPickerContent = (album) => {
        if(!album){
          this.fb.getMoreAlbums(response => {
            if(response){
              this.setState({ pickerFacebookContent : response.data, facebookPagingNext: response.paging.next, facebookPagingPrevious: response.paging.previous });
            }
          });
        } else {
          this.fb.getMorePhotosInAlbum(album, response => {
            if(response){
              this.setState({ pickerFacebookContent : response.data, facebookPagingNext: response.paging.next, facebookPagingPrevious: response.paging.previous });
            }
          });
        }
         
      }
    
      getPreviousFacebookPickerContent = (album) => {
        if(!album){
          this.fb.getPreviousAlbums(response => {
            if(response){
              this.setState({ pickerFacebookContent : response.data, facebookPagingPrevious: response.paging.previous, facebookPagingNext: response.paging.next });
            }
          });
        } else {
          this.fb.getPreviousPhotosInAlbum(album, response => {
            if(response){
              this.setState({ pickerFacebookContent : response.data, facebookPagingNext: response.paging.next, facebookPagingPrevious: response.paging.previous });
            }
        });
        }
      }
    
      handleWholeAlbumImport = (album) => {
        var fbAlbum = {
          name: album.name
        }
        
        this.fb.getAllPhotosInAlbum(album.id,  response => {
            if(response){
              let allPhotos = response.data.map( photos =>{
                return ({ 
                  url: photos.picture_full, 
                  metadata: { 
                    createdTime: photos.created_time
                  },
                  importSource: FACEBOOK_PHOTOS 
                });
              });
    
              this.props.dispatch(albumActions.createAlbum(fbAlbum, true, allPhotos, this.props.closeFunction));
            }
        });
        this.closeFacebookPicker();
      }

      close = () => this.setState({ open: false })

  
    render() {

        const { importDisabled } = this.props;
  
      return (
        <Modal
          open={this.state.facebookPickerOpen}
          //onOpen={this.state.facebookPickerOpen}
          onClose={this.close}
          size='small'
          trigger={
             <button 
                id='contentUploadModal_btnFacebookConnect'
                disabled={importDisabled}
                className="ui left floated facebook compact button" 
                onClick={this.handleFacebookImport}>
                    <Image className={styles.importButtonLogo} src={logo} /> 
                    <span  className={styles.verticalAlignMiddle} >{intl.get("connect")}</span>
            </button>
          }
        >
           <FacebookPickerContainer 
              content = {this.state.pickerFacebookContent}
              handlePhotos = {(e) => this.handleFacebookPhotos(e)} 
              handleAlbums = {() => this.handleFacebookImport()}
              next = {(e) => this.getNextFacebookPickerContent(e)}
              previous = {(e) => this.getPreviousFacebookPickerContent(e)}
              import = {this.uploadImportedContent}
              closeFacebookPicker = {this.closeFacebookPicker}
              tokens = {this.state.facebookPagingNext}
              previousToken = {this.state.facebookPagingPrevious}
              source = {FACEBOOK_PHOTOS}
              album = {this.state.album}
              handleWholeAlbumImport = {(e) => this.handleWholeAlbumImport(e)}
              isAlbum = {false}
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

  const connectedFacebookUploadModal = compose(withTracker, connect(mapStateToProps))(FacebookUploadModal) ;

  export { connectedFacebookUploadModal as FacebookUploadModal }