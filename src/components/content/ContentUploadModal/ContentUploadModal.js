import React, { Component } from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';
import buttonCss from '../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import Dropzone from 'react-dropzone';
import { contentActions, storageInfoActions, albumActions } from '../../../actions';
import ReactGA from 'react-ga';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../helpers';
import { post } from 'axios';
import { connect } from 'react-redux';
import styles from './ContentUploadModal.scss';
import { FacebookUploadModal, GoogleUploadModal } from '../ContentUploadModal';
import generalCss from '../../../resources/styles/general.css';
import { BrowserView, MobileView } from "react-device-detect";
import contentUploadModalCss from './contentUploadModal.css';

class ContentUploadModal extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      files:null,
      progress: 0,
      isUploading: false,
      fileStatus: '',
      openUploadModal: false
    };
    
    this.state = this.initialState;
  }

   fileInputRef = React.createRef();

  onChangeSubmit = (files) => {
    this.setState({ isUploading: true });
    const self = this;
    this.props.dispatch(contentActions.uploadRequest());
    toast.info(intl.get("fileImportStart"));
    this.fileUpload(files, this.props.uploadInAlbum).then((response)=>{
      if(response.data){
        const assets = response.data;
        const uploadedAssets = assets.filter(asset => asset.uploaded);
        
        if(this.props.uploadInAlbum){
          self.props.dispatch(albumActions.assetsUpload(uploadedAssets));
        }else{
          self.props.dispatch(contentActions.uploadSuccess({assets : uploadedAssets, albumId : this.props.uploadInAlbum}));
        }
        self.props.dispatch(storageInfoActions.get());
        self.setState(self.initialState);
        
        //check if all content has been uploaded

        let uploadTimestamps = assets.map(x => {
          return x.created;
        });

        let fileSizes = assets.map(x => {
          return x.metadata.size;
        });

        let fileTypes = assets.map(x => {
          return x.mime;
        });

        if(assets.length === uploadedAssets.length){
          if(assets.length === 0){
            toast.error(intl.get("errorProccessingFiles"));
          }else if(assets.length === 1){
            toast.success(intl.get("filesUploadedSuccessfully"));

            ReactGA.ga('send', 'event', "content", 'content uploaded', {
              'dimension1': JSON.stringify(uploadTimestamps),
              'dimension2': JSON.stringify(fileSizes),
              'dimension3': JSON.stringify(fileTypes),
              'dimension4': assets.length
            });
          }else{
            toast.success(intl.get("filesUploadedSuccessfully"));
            ReactGA.event({
              category: 'content',
              action: 'content uploaded'
            });
          }
        }else{
          if(assets.length === 1){
            toast.error(intl.get([assets[0].message]));
          }else{
            toast.warning(intl.get(['UnprocessableFiles']));
            ReactGA.event({
              category: 'content',
              action: 'content uploaded'
            });
          }
        }
      }
    }).catch(error => {
      self.props.dispatch(contentActions.uploadError(error));
      self.setState(self.initialState);
    });
  }

  fileUpload = (files, albumId) => {
    const self = this;
    const url = `${apiUrl()}/api/v1/Content`;
    const formData = new FormData();
    
    for(let i = 0; i < files.length; i++){
      formData.append('files', files[i]);
    }

    albumId && formData.append('albumId', albumId);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          if(progressEvent.loaded !== progressEvent.total){
            const fileStatus = files.length === 1 ? intl.get("uploadingFile") : intl.get("uploadingFiles");
            self.setState({ progress: progressEvent.loaded / progressEvent.total * 100, fileStatus });
          }
          else{
            const fileStatus = files.length === 1 ? intl.get("fileUploaded") : intl.get("filesUploaded");
            self.setState({ progress: 100, fileStatus });
          }
        }
    }
    return post(url, formData, config);
  }

  onChangeHandle = (e) => {
    if(e.target.files.length !== 0){
      this.setState({files: Array.from(e.target.files)});
    }
  }

  handleDropzoneFiles = (e) => {
    this.setState({files: e })
  }

  handleUploadModalClose = () => {
    this.setState({openUploadModal: false, files: null})
  }
  
  handleUploadModal = () => {
    this.setState({openUploadModal: true})
  }

  removeFileFromUpload = (index) => {
    let reducedFiles = this.state.files;
    reducedFiles.splice(index, 1);
    this.setState({files : reducedFiles});
  }

  render() {
    const { isSelectedContent } = this.props;

    return (
        <Modal size='tiny' dimmer='inverted'  open={this.state.openUploadModal}  trigger={<Button id='allContentPage_btnUpload' disabled={isSelectedContent} style={buttonCss.primary} onClick={this.handleUploadModal} > <Icon inverted name='plus'/> {intl.get("upload")}</Button>} onClose={() => this.setState({openUploadModal : false})}>
          <Modal.Header>{intl.get("uploadContent")}</Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              <p>{intl.get("uploadContentDescription")}</p>
                <BrowserView>
                    <Dropzone
                        id='contentUploadModal_dropzone'
                        className={styles.dropZone}
                        accept="image/*,video/*,audio/*"
                        multiple={true}
                        onDrop={this.handleDropzoneFiles}
                    >
                        <div className={styles.dropZoneText}>
                        {intl.get('uploadContentDropzone')}
                        </div>
                        
                        <input id='contentUploadModal_inputField' multiple accept=".jpg,.jpeg,.png,.gif,.tiff,.webp,video/*,.mp3,.ogg,.aac,.wav" type="file"  onChange={this.onChangeHandle} className={styles.displayNone}></input>
                    </Dropzone>
                </BrowserView>
                <MobileView>
                    <input ref={this.fileInputRef} id='contentUploadModalMobile_inputField' multiple accept="image/*,video/*,audio/*" type="file"  onChange={this.onChangeHandle} className={styles.displayNone}></input>
                    <Button
                        
                        onClick={() => this.fileInputRef.current.click()}
                        style={buttonCss.primary}
                    >
                    {intl.get("selectFiles")}
                    </Button>
                    
                </MobileView>
              {this.state.files && this.state.files.length > 0 ?
                <div className={styles.chosenFilesBlockRoot}> 
                  <div  className={styles.chosenFilesBlock}> 
                    {this.state.files.map((fn, index) => (
                      <div key={index}>
                        <Icon className={styles.btnIcon} name='close icon' onClick={() => {this.removeFileFromUpload(index)}} />
                        {fn.name}
                      </div>
                    ))}
                  </div>
                </div>
                :
                null
              }
            </Modal.Description>
          </Modal.Content>
            <BrowserView>
                <Modal.Actions style={generalCss.paddingBottom50}>
                    <FacebookUploadModal importDisabled = {this.props.contentUploadInProgress} closeFunction={this.handleUploadModalClose} album={this.props.uploadInAlbum} successCallback={this.props.successCallback}/>
                    <GoogleUploadModal importDisabled = {this.props.contentUploadInProgress} closeFunction={this.handleUploadModalClose} album={this.props.uploadInAlbum} successCallback={this.props.successCallback}/>
                    <Button
                        id='contentUploadModal_btnUpload'
                        floated='right'
                        disabled={!this.state.files || this.state.isUploading }
                        onClick={() => this.onChangeSubmit(this.state.files)}
                        style={contentUploadModalCss.contentUploadButtonBrowser}
                    >
                        {intl.get("upload")}
                    </Button>
                    <Button id='contentUploadModal_btnClose' floated='right' onClick={this.handleUploadModalClose}>
                        {intl.get("close")}
                    </Button>
                </Modal.Actions>
            </BrowserView>

            <MobileView>
                <Modal.Actions>
                    <div className={styles.modalActionsRow}>
                        <FacebookUploadModal importDisabled = {this.props.contentUploadInProgress} closeFunction={this.handleUploadModalClose} album={this.props.uploadInAlbum} successCallback={this.props.successCallback}/>
                        <GoogleUploadModal importDisabled = {this.props.contentUploadInProgress} closeFunction={this.handleUploadModalClose} album={this.props.uploadInAlbum} successCallback={this.props.successCallback}/>
                    </div>
                    <div className={[styles.modalActionsRow, styles.modalActionsRowTopBorder].join(' ')}>
                        <Button id='contentUploadModal_btnClose' onClick={this.handleUploadModalClose}>
                            {intl.get("close")}
                        </Button>

                        <Button
                            id='contentUploadModal_btnUpload'
                            disabled={!this.state.files || this.state.isUploading }
                            style={buttonCss.remove}
                            onClick={() => this.onChangeSubmit(this.state.files)}
                        >
                            {intl.get("upload")}
                        </Button>
                    </div>
                </Modal.Actions>
            </MobileView>
            
        </Modal>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mapStateToProps(state) {
    const { content } = state;
    const { contentUploadInProgress } = content;
  
    return {
        contentUploadInProgress
    };
}

const connectedContentUploadModal = connect(mapStateToProps, mapDispatchToProps)(ContentUploadModal);
export { connectedContentUploadModal as ContentUploadModal };