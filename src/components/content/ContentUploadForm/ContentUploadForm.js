import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './ContentUploadForm.scss';
import { post } from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Button, Checkbox, Icon } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { apiUrl, history } from '../../../helpers';
import { contentActions, storageInfoActions, albumActions } from '../../../actions';
import ReactGA from 'react-ga';
import buttonCss from '../../../resources/styles/button.css';
import colorsCss from '../../../resources/styles/colors.css';
import { Line } from 'rc-progress';
import intl from 'react-intl-universal';

class ContentUploadForm extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      files: null,
      fileName: intl.get("noFileChosen"),
      checked: false,
      progress: 0,
      isUploading: false,
      fileStatus: ''
    };

    this.state = this.initialState;
  }

  onChangeSubmit = (files) => {
    this.setState({ isUploading: true });
    const self = this;
    this.props.dispatch(contentActions.uploadRequest());
    this.fileUpload(files, this.props.uploadInAlbum).then((response) => {
      if (response.data) {
        const assets = response.data;
        const uploadedAssets = assets.filter(asset => asset.uploaded);

        if (this.props.uploadInAlbum) {
          self.props.dispatch(albumActions.assetsUpload(uploadedAssets));
        } else {
          self.props.dispatch(contentActions.uploadSuccess(uploadedAssets));
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

        if (assets.length === uploadedAssets.length) {
          if (assets.length === 0) {
            toast.error(intl.get('errorProccessingFiles'));
          } else if (assets.length === 1) {
            toast.success(intl.get('fileSuccessfullyUploaded',
              response.data[0].name.length > 30 ? { contentName: response.data[0].name.substring(0, 29).concat('...') } : { contentName: response.data[0].name })
            );

            // ReactGA.event({
            //   category: 'content',
            //   action: 'content uploaded'
            // });
            ReactGA.ga('send', 'event', "content", 'content uploaded', {
              'dimension1': JSON.stringify(uploadTimestamps),
              'dimension2': JSON.stringify(fileSizes),
              'dimension3': JSON.stringify(fileTypes),
              'dimension4': assets.length
            });
          } else {
            toast.success(intl.get('filesUploadedSuccessfully'));

            ReactGA.event({
              category: 'content',
              action: 'content uploaded'
            });
          }
        } else {
          if (assets.length === 1) {
            toast.error(intl.get(assets[0].message));
          } else {
            toast.warning(intl.get('UnprocessableFiles'));

            ReactGA.event({
              category: 'content',
              action: 'content uploaded'
            });
          }
        }

        if (this.props.isFirstTimeLogin !== null && !this.state.isUploading && this.state.progress === 0) {
          this.handleNext();
        }

      }
    }).catch(error => {
      self.props.dispatch(contentActions.uploadError(error));
      self.setState(self.initialState);
    });
  }

  onChange = (e) => {
    this.onChangeSubmit(e.target.files);
  }

  fileUpload = (files, albumId) => {
    const self = this;
    const url = `${apiUrl()}/api/v1/Content`;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    formData.append('albumId', albumId);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        if (progressEvent.loaded !== progressEvent.total) {
          const fileStatus = files.length === 1 ? intl.get("uploadingFile") : intl.get("uploadingFiles");
          self.setState({ progress: progressEvent.loaded / progressEvent.total * 100, fileStatus });
        }
        else {
          const fileStatus = files.length === 1 ? intl.get("fileUploaded") : intl.get("filesUploaded");
          self.setState({ progress: 100, fileStatus });
        }
      }
    }
    return post(url, formData, config);
  }

  handleCheckbox = () => {
    this.setState({ checked: !this.state.checked });
  }

  onChangeHandle = (e) => {
    if (e.target.files.length !== 0) {
      const fileName = e.target.files.length === 1 ? e.target.files[0].name : `${e.target.files.length} ${intl.get("files")}`

      this.setState({ files: Array.from(e.target.files), fileName });
    }
  }

  handleNext = () => {
    history.push('/users-management');
  }

  render() {
    const { isFirstTimeLogin } = this.props;

    return (
      <div>
        {isFirstTimeLogin !== null ?
          <Grid>
            <Row className={styles.content}>
              <Col mdOffset={2} md={8}>
                <div className={styles.uploadContent}>
                  <div className={styles.chooseFile}>
                    <label htmlFor="file" className="ui icon button basic">
                      <i className="file icon"></i>
                      {intl.get("chooseFile")}</label>
                    <label>{this.state.fileName}</label>
                    <input multiple accept=".jpg,.jpeg,.png,.gif,.tiff,.webp,video/*,.mp3,.ogg,.aac,.wav" type="file" id="file" onChange={this.onChangeHandle} className={styles.displayNone} />
                    <br />
                  </div>
                  <div className={styles.uploading}>
                    <Checkbox
                      label={{ children: <p>{intl.get("agreeThatContent")} <a href="https://www.allwayswithyou.com/legal/terms-and-conditions">{intl.get("these")}</a> {intl.get("conditions")}</p> }}
                      checked={this.state.checked}
                      onChange={this.handleCheckbox}
                    />
                    <br />
                    <div className={styles.upload}>
                      {this.state.progress !== 0 &&
                        <div>
                          <Line percent={this.state.progress} strokeWidth="3" trailWidth="3" strokeColor={colorsCss.green} trailColor={colorsCss.grey} />
                          <div>{this.state.fileStatus}</div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col mdOffset={1} md={10}>
                <div className={styles.buttons}>
                  <Button onClick={this.handleNext}
                    style={Object.assign({}, buttonCss.secondary, buttonCss.skip)} >
                    {intl.get("skip")}
                  </Button>
                  <Button onClick={() => this.onChangeSubmit(this.state.files)} style={buttonCss.primary}
                    disabled={!this.state.files || !this.state.checked || this.state.isUploading}>
                    {intl.get("upload")}
                  </Button>
                </div>
                <div className={styles.progressBar}>
                  <Line percent="50" strokeWidth="4" trailWidth="4" strokeColor={colorsCss.green} trailColor={colorsCss.grey} />
                </div>
              </Col>
            </Row>
          </Grid>
          :
          <div className={styles.upload}>
            {!this.state.isUploading ?
              <div>
                <label htmlFor="file" style={buttonCss.upload}>
                  {intl.get("upload")}</label>
                <input multiple accept=".jpg,.jpeg,.png,.gif,.tiff,.webp,video/*,.mp3,.ogg,.aac,.wav" type="file" id="file" onChange={this.onChange} className={styles.displayNone} />
              </div>
              :
              <div>
                <label htmlFor="file" style={buttonCss.uploading}>
                  <Icon loading name="spinner" size="large" /></label>
                <input className={styles.displayNone} />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

const connectedContentUploadForm = connect()(ContentUploadForm);
export { connectedContentUploadForm as ContentUploadForm };

