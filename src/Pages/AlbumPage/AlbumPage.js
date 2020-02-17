import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomMenu } from '../../components';
import styles from './AlbumPage.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { albumActions } from '../../actions';
import { CustomModal, ContentCard, StorageInfo, AlbumAddAssetsModal } from '../../components/content';
import Moment from 'react-moment';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import { Button, Icon } from 'semantic-ui-react';
import buttonCss from '../../resources/styles/button.css';
import { history } from '../../helpers';
import albumCardCss from '../../resources/styles/albumCard.css';
import editIcon from '../../resources/images/edit-icon.png';
import deleteIcon from '../../resources/images/delete-icon.png';
import checkIcon from '../../resources/images/check-icon.png';
import closeIcon from '../../resources/images/close-icon.png'
import intl from 'react-intl-universal';
import { ContentUploadModal } from '../../components/content/ContentUploadModal/ContentUploadModal';
import generalCss from '../../resources/styles/general.css';
import '../../resources/styles/loading.css';
import { ContentCardPlaceholder } from '../../components';

class AlbumPage extends Component {

  state = {
    isRemoveAssetsModalOpen: false,
    isDeleteAlbumModalOpen: false,
    selectedAssets: [],
    updatedAlbumDescription: null,
    updatedAlbumName: null,
    isAlbumNameEditable: false,
    isAlbumDescriptionEditable: false,
    inputFocus: false
  }

  componentDidMount() {
    this.props.dispatch(albumActions.get(this.props.params.albumId));
  }

  renderAssetDescription = (asset) => {
    return (
      <div>
        {intl.get("uploadedBy")} {asset.uploader.displayName} {intl.get("on")} <Moment format='LLLL'>{asset.created}</Moment>.
      </div>
    );
  }

  handleTitleClick = () => {
    history.replace('/albums');
  }

  handleDeleteAlbumModalOpen = () => {
    this.setState({ isDeleteAlbumModalOpen: true });
  }

  handleDeleteAlbumModalClose = () => {
    this.setState({ isDeleteAlbumModalOpen: false });
  }

  handleDeleteAlbum = () => {
    this.props.dispatch(albumActions.remove(this.props.album.id));
    this.setState({ isDeleteAlbumModalOpen: false });
  }

  handleRemoveAssetsModalClose = () => {
    this.setState({ isRemoveAssetsModalOpen: false });
  }

  handleRemoveAssetsModalOpen = () => {
    this.setState({ isRemoveAssetsModalOpen: true });
  }

  handleRemoveAssets = () => {
    this.props.dispatch(albumActions.removeAssetsFromAlbum(this.props.album.id, this.state.selectedAssets));
    this.setState({ isRemoveAssetsModalOpen: false, selectedAssets: [] });
  }

  handleAssetSelection = (asset) => {
    let assets = [...this.state.selectedAssets];
    const index = assets.findIndex(a => a.assetId === asset.id && a.assetUploaderId === asset.uploaderId);

    if (index === -1) {
      assets.push({ assetId: asset.id, assetUploaderId: asset.uploaderId });
    } else {
      assets.splice(index, 1);
    }

    this.setState({ selectedAssets: assets });
  }

  handleUpdateAlbum(update) {
    this.props.dispatch(albumActions.update(this.props.album.id, update));
  }

  handleAlbumNameEditable = () => {
    this.setState({ isAlbumNameEditable: true, inputFocus: true, updatedAlbumName: this.props.album.name });
  }

  handleCloseAlbumNameEdit = () => {
    this.setState({ isAlbumNameEditable: false, inputFocus: false });
  }

  handleAlbumNameChange = (e) => {
      if(e.target.value.length > 25){
          e.preventDefault();
          return;
      }

    this.setState({ updatedAlbumName: e.target.value })
  }

  handleAlbumNameKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleAlbumNameUpdate(e.target.value);
    } else if (e.keyCode === 27) {
      this.handleCloseAlbumNameEdit();
    }
  }

  handleAlbumNameUpdate = (newName) => {
    if (/\S/.test(newName)) {
      if (newName !== "" && newName !== this.props.album.name && newName !== null) {
        const updateOperation = [{
          'op': 'replace',
          'path': '/name',
          'value': newName
        }];

        this.handleUpdateAlbum(updateOperation);
      }

      this.setState({ updatedAlbumName: newName, isAlbumNameEditable: false })
    }
  }

  handleAlbumDescriptionEditable = (e) => {
    this.setState({ isAlbumDescriptionEditable: true, inputFocus: true });
  }

  handleCloseAlbumDescriptionEdit = (e) => {
    this.setState({ isAlbumDescriptionEditable: false, inputFocus: false })
  }

  handleAlbumDescriptionChange = (e) => {
      if(e.target.value.length > 100){
          e.preventDefault();
          return;
      }
    this.setState({ updatedAlbumDescription: e.target.value })
  }

  handleAlbumDescriptionKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleAlbumDescriptionUpdate(e.target.value);
    } else if (e.keyCode === 27) {
      this.handleCloseAlbumDescriptionEdit();
    }
  }

  handleAlbumDescriptionUpdate = (newDescription) => {
    if (/\S/.test(newDescription)) {
      if (newDescription !== this.props.album.description) {
        const updateOperation = [{
          'op': 'replace',
          'path': '/description',
          'value': newDescription
        }];

        this.handleUpdateAlbum(updateOperation);
      }

      this.setState({ updatedAlbumDescription: newDescription, isAlbumDescriptionEditable: false });
    }
  }

  successfulImportCallback = () => {
    this.props.dispatch(albumActions.get(this.props.params.albumId));
  }

  successfulAddAssetsCallback = (albumId) => {
    this.props.dispatch(albumActions.get(albumId));
  }

  render() {
    const { user, album, isFetching } = this.props;
    const { isAlbumNameEditable, updatedAlbumName, isAlbumDescriptionEditable, updatedAlbumDescription, inputFocus, selectedAssets, isDeleteAlbumModalOpen, isRemoveAssetsModalOpen } = this.state;

    const removeEnabled = selectedAssets.length > 0 && (user.isAdmin || selectedAssets.every(a => a.assetUploaderId === user.id));
    const addEnabled = selectedAssets.length === 0;

    return (
      <div>
        <CustomMenu />

        {isFetching ?
            <div>
                <Grid>
                    <Col mdOffset={2} md={8} className={styles.header}>
                    <div style={generalCss.pointerCursor}>
                        <h1>{intl.get('albumsHeader')}</h1>
                    </div>

                    <div style={generalCss.marginHorizontal5}>
                        <h1>{intl.get("divider")}</h1>
                    </div>
                    </Col>
                </Grid>

                <Grid>
                    <Col mdOffset={6} md={6} className={styles.columns}>
                        <div>
                            <div className={styles.upload}>
                                <Button 
                                    disabled={true} 
                                    style={buttonCss.primary} 
                                    onClick={() => {}} > 
                                        <Icon inverted name='plus'/> {intl.get("upload")}
                                </Button>
                            </div>

                            <div>
                                <Button
                                    style={buttonCss.primary}
                                    disabled={true}
                                    onClick={() => {}}>
                                    {intl.get('addFiles')}
                                </Button>
                                
                                <Button
                                    style={buttonCss.primary}
                                    disabled={true}
                                    onClick={() => {}}>
                                    {intl.get("remove")}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Grid>

                <StorageInfo />

                <Grid>
                    <Col mdOffset={2} md={8} className={styles.albumDescription}>
                        <div>
                            <Row>
                                <Col md={10} xs={9} style={albumCardCss.textAreaModified}>
                                    {intl.get("albumDescription")}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Grid>
                <div className="loading">
                    <div className={styles.content}>
                        <Grid>
                            <div className={styles.contentContainer}>
                                <Row>
                                    <Col md={4} xs={12} className={styles.container}>
                                        <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                                    </Col>
                                    <Col md={4} xs={12} className={styles.container}>
                                        <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                                    </Col>
                                    <Col md={4} xs={12}  className={styles.container}>
                                        <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                                    </Col>
                                </Row>
                            </div>
                        </Grid>
                    </div>
                </div>
          </div>
          :
          <div>
            {album ?

              <div>
                <div>
                  <div>
                    <Grid>
                      <Col mdOffset={2} md={8} className={styles.header}>
                        <div style={generalCss.pointerCursor}>
                          <a id='albumPage_header' onClick={this.handleTitleClick}><h1>{intl.get('albumsHeader')}</h1></a>
                        </div>

                        <div style={generalCss.marginHorizontal5}>
                          <h1>{intl.get("divider")}</h1>
                        </div>

                        <div>
                          {isAlbumNameEditable ?

                            <form className={styles.textAlign}>
                              <input
                                name='albumName'
                                type='text'
                                size={updatedAlbumName === null || updatedAlbumName === "" ? 10 : updatedAlbumName.length - 3}
                                onKeyDown={this.handleAlbumNameKeyDown}
                                readOnly={!isAlbumNameEditable}
                                autoFocus={inputFocus}
                                defaultValue={album.name}
                                onChange={this.handleAlbumNameChange}
                                className={styles.fieldInputSelected}
                                value={this.state.updatedAlbumName}
                              />

                              {(user.isAdmin || user.id === album.creatorId) &&
                                <div className={styles.albumNameButtons}>
                                  <span id='albumPage_btnConfirmAlbumName' className={styles.pointerCursor} onClick={() => this.handleAlbumNameUpdate(updatedAlbumName)}><img src={checkIcon} alt="" /></span>
                                  <span id='albumPage_btnCloseEditAlbumName' className={styles.pointerCursor} onClick={this.handleCloseAlbumNameEdit}><img src={closeIcon} alt="" /></span>
                                </div>
                              }
                            </form>
                            :
                            <div className={styles.albumName}>
                              <div className={styles.fieldInput}>
                                {album.name}
                              </div>
                              {(user.isAdmin || user.id === album.creatorId) &&
                                <div className={styles.albumNameButtons}>
                                  <span id='albumPage_btnEditName' className={styles.pointerCursor} title={intl.get('editAlbumName')} onClick={this.handleAlbumNameEditable}><img src={editIcon} alt="" /></span>
                                  <span id='albumPage_btnDeleteAlbum' className={styles.pointerCursor} title={intl.get('deleteAlbum')} onClick={this.handleDeleteAlbumModalOpen}><img src={deleteIcon} alt="" /></span>
                                </div>
                              }
                            </div>
                          }
                        </div>

                      </Col>
                    </Grid>

                    <Grid>

                      <Col mdOffset={6} md={6} className={styles.columns}>
                        <div>
                          <div id='albumPage_btnUploadContentForm' className={styles.upload}>

                            <ContentUploadModal
                              isSelectedContent={this.state.selectedAssets && this.state.selectedAssets.length > 0}
                              uploadInAlbum={album.id}
                              isFirstTimeLogin={null}
                              successCallback={this.successfulImportCallback}
                            />

                          </div>

                          <div>
                            <AlbumAddAssetsModal
                              isSelectedContent={this.state.isSelectedContent}
                              albumId={album.id}
                              albumAssets={album.assets}
                              successCallback={this.successfulAddAssetsCallback}
                              enabled={addEnabled}
                            />
                            
                            <Button
                              id='albumPage_btnRemoveSelectedAssets'
                              style={buttonCss.primary}
                              disabled={!removeEnabled}
                              onClick={this.handleRemoveAssetsModalOpen}>
                              {intl.get("remove")}
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Grid>

                    <StorageInfo />

                    <Grid>
                      <Col mdOffset={2} md={8} className={styles.albumDescription}>
                        <div>
                          {isAlbumDescriptionEditable ?
                            <form>
                              <Row>
                                <Col md={10} xs={9}>
                                  <input
                                    name='albumDescription'
                                    type='text'
                                    onKeyDown={this.handleAlbumDescriptionKeyDown}
                                    readOnly={!isAlbumDescriptionEditable}
                                    defaultValue={album.description}
                                    autoFocus={inputFocus}
                                    onChange={this.handleAlbumDescriptionChange}
                                    style={albumCardCss.textAreaModified}
                                    value={this.state.updatedAlbumDescription}
                                  />
                                </Col >

                                {(user.isAdmin || user.id === album.creatorId) &&
                                  <Col md={2} xs={3}>
                                    <span id='albumPage_btnConfirmAlbumDescription' className={styles.pointerCursor} onClick={() => this.handleAlbumDescriptionUpdate(updatedAlbumDescription)}><img src={checkIcon} alt="" /></span>
                                    <span id='albumPage_btnCloseEditAlbumDescription' className={styles.pointerCursor} onClick={this.handleCloseAlbumDescriptionEdit}><img src={closeIcon} alt="" /></span>
                                  </Col>
                                }
                              </Row>
                            </form>
                            :
                            <Row>
                              <Col md={10} xs={9} style={album.description ? albumCardCss.textArea : albumCardCss.textAreaModified}>
                                {album.description && album.description !== "" ? album.description : intl.get("albumDescription")}
                              </Col>
                              {(user.isAdmin || user.id === album.creatorId) &&
                                <Col md={2} xs={3}>
                                  <span id='albumPage_btnEditDescription' className={styles.pointerCursor} title={intl.get('editAlbumDescription')} onClick={this.handleAlbumDescriptionEditable}><img src={editIcon} alt="" /></span>
                                  <span id='albumPage_btnClearDescription' className={styles.pointerCursor} title={intl.get('clearAlbumDescription')} onClick={() => this.handleAlbumDescriptionUpdate(null)}><img src={deleteIcon} alt="" /></span>
                                </Col>
                              }
                            </Row>
                          }
                        </div>
                      </Col>
                    </Grid>

                    <div className={styles.content}>
                      <Grid>
                        <div className={styles.contentContainer}>
                          <Row>
                            {album.assets != null && album.assets.map(asset => {
                              return (
                                <Col id={`albumPage_${asset.id}`} key={asset.id} md={4} xs={12} className={styles.container}>
                                  <ContentCard
                                    assets={selectedAssets}
                                    assetId={asset.id}
                                    assetUploaderId={asset.uploaderId}
                                    handleSelect={() => this.handleAssetSelection(asset)}
                                    image={asset.thumbnailUrl}
                                    assetName={asset.name}
                                    assetType={asset.mime}
                                    description={this.renderAssetDescription(asset)}
                                    buttonText={intl.get("delete")}
                                    uploaderPhoto={asset.uploader.profilePictureUrl}
                                    styles={styles}
                                  />
                                </Col>
                              )
                            }
                            )}
                          </Row>
                        </div>
                      </Grid>
                    </div>
                  </div>

                  <CustomModal
                    open={isRemoveAssetsModalOpen}
                    handleClose={this.handleRemoveAssetsModalClose}
                    handleDelete={this.handleRemoveAssets}
                    header={intl.get('removeContentFromAlbumModalHeader')}
                    description={intl.get('removeContentFromAlbumModalDescription', { num: selectedAssets.length })}
                    mainButtonText={intl.get('remove')}
                  />

                  <CustomModal
                    open={isDeleteAlbumModalOpen}
                    handleClose={this.handleDeleteAlbumModalClose}
                    handleDelete={this.handleDeleteAlbum}
                    header={intl.get('deleteAlbum')}
                    description={intl.get('deleteAlbumDescription', { albumName: album ? album.name : '' })}
                    mainButtonText={intl.get('delete')}
                  />

                </div>

              </div>
              :
              <div>
                <h1 style={generalCss.errorPageHeading}>{intl.get("albumNotFound")}</h1>
              </div>
            }

          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { authentication, albums } = state;
  const { album, isFetching } = albums;
  const { user } = authentication;

  return {
    album,
    isFetching,
    user
  };
}

const composedAlbumPage = compose(withTracker, connect(mapStateToProps))(AlbumPage);
export { composedAlbumPage as AlbumPage };
