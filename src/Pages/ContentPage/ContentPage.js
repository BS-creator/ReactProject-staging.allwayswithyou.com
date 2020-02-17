import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CustomMenu, ContentCardPlaceholder } from '../../components';
import styles from './ContentPage.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { contentActions, rfnProfileActions } from '../../actions';
import { ContentUploadForm, CustomModal, ContentCard, StorageInfo } from '../../components';
import Moment from 'react-moment';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import { Button, Icon } from 'semantic-ui-react';
import { history } from '../../helpers';
import buttonCss from '../../resources/styles/button.css';
import generalCss from '../../resources/styles/general.css';
import intl from 'react-intl-universal';
import Sticky from 'react-sticky-el';
import { ContentUploadModal } from '../../components/content/ContentUploadModal/ContentUploadModal';
import '../../resources/styles/loading.css';

const renderDescription = (user, date) => {
  return (
    <div>
      {intl.get("uploadedBy")} {user} {intl.get("on")} <Moment format='LLLL'>{date}</Moment>.
    </div>
  );
}

class ContentPage extends Component {

  state = {
    open: false,
    pendingForRemoval: null,
    isSelectedContent: false,
    uploadInAlbum: "",
    selectedAssets: []
  }

  componentDidMount() {
    this.props.dispatch(rfnProfileActions.get());
    this.props.dispatch(contentActions.get());
  }

  handleTitleClick = () => {
    history.replace('/content-management');
  }

  handleOpen = (asset) => {
    this.setState({ open: true, pendingForRemoval: asset[0].assetId });
  }

  handleClose = () => {
    this.setState({ open: false, pendingForRemoval: null });
  }

  handleDelete = () => {
    var assetIds = this.state.selectedAssets.map(selectedAsset => selectedAsset.assetId);

    this.props.dispatch(contentActions.remove(assetIds));
    this.setState({ open: false, pendingForRemoval: null, selectedAssets: [], isSelectedContent: false });
  }

  handleSelectedAsset = (asset) => {
    var assets = this.state.selectedAssets;
    const index = this.state.selectedAssets.findIndex(a => a.assetId === asset.id && a.assetUploaderId === asset.uploaderId);

    if (index !== -1) {
      assets.splice(index, 1);
      this.setState({ selectedAssets: assets });
    }
    else {
      assets.push({ assetId: asset.id, assetUploaderId: asset.uploaderId })
      this.setState({ selectedAssets: assets });
    }

    if (this.state.selectedAssets.length > 0) {
      this.setState({ isSelectedContent: true });
    }
    else {
      this.setState({ isSelectedContent: false });
    }
  }

  render() {
    const { assets,
      isFetching,
      user,
      isFirstTimeLogin,
      rfn,
      isFetchingRfn,
    } = this.props;

    const { selectedAssets } = this.state;

    const isFetched = assets !== undefined && !isFetching;
    const deleteEnabled = selectedAssets.length > 0 && (user.isAdmin || selectedAssets.every(a => a.assetUploaderId === user.id));

    return (
      <div>
        {isFirstTimeLogin ?
          <div>
            <CustomMenu />
            {!isFetchingRfn &&
              <h1 className={styles.header}>{intl.get("contentPageHeader", { firstName: rfn.firstName, lastName: rfn.lastName })}</h1>
            }
            <Grid>
              <Col mdOffset={2} md={8}>
                <ContentUploadForm
                  uploadInAlbum={this.state.uploadInAlbum}
                  isFirstTimeLogin={isFirstTimeLogin.toString()}
                />
              </Col>
            </Grid>
          </div>

          :

          <div>
            <Sticky stickyClassName={styles.stickyContent}>
              <CustomMenu />

              <Col mdOffset={2} md={8} className={styles.header}>
                <div style={generalCss.pointerCursor}>
                  <a id='albumsPage_contentManagementLink' onClick={this.handleTitleClick}><h1>{intl.get('contentHeader')}</h1></a>
                </div>

                <div style={generalCss.marginHorizontal5}>
                  <h1>{intl.get('divider')}</h1>
                </div>

                <div>
                  <h1>{intl.get('assetsHeader')}</h1>
                </div>

              </Col>

              <Grid>
                <Col mdOffset={2} md={8} className={styles.columns}>
                  <div className={styles.leftColumn}>
                  </div>

                  <div>
                    <div className={styles.rightColumn}>
                      <ContentUploadModal isSelectedContent={this.state.isSelectedContent} />
                      <Button
                        id='contentPage_btnDeleteSelectedAssets'
                        style={buttonCss.primary}
                        disabled={!deleteEnabled}
                        onClick={() => this.handleOpen(this.state.selectedAssets)}
                        icon={<Icon name='delete' />}
                        content={intl.get("delete")} />
                    </div>
                  </div>
                </Col>
              </Grid>

              <div className={styles.storageInfo}>
                <StorageInfo />
              </div>
            </Sticky>

            <div className={styles.content}>
              {isFetched ?
                <Grid>
                  <div className={styles.contentContainer}>
                    <div>
                      <Row>
                         {assets.map(asset => {
                          return (
                            <Col id={`contentPage_asset_${asset.id}`} key={asset.id} md={4} xs={12} className={styles.container}>
                              <ContentCard
                                assets={this.state.selectedAssets}
                                assetId={asset.id}
                                assetUploaderId={asset.uploaderId}
                                handleSelect={() => this.handleSelectedAsset(asset)}
                                image={asset.thumbnailUrl}
                                assetName={asset.name}
                                assetType={asset.mime}
                                description={renderDescription(asset.uploader.displayName, asset.created)}
                                buttonText={intl.get("delete")}
                                styles={styles}
                                uploaderPhoto={asset.uploader.profilePictureUrl}
                              />
                            </Col>
                          )
                        }
                        )}
                      </Row>
                    </div>
                  </div>
                </Grid>
                :
                <div class="loading">
                    <Grid>
                        <div className={styles.contentContainer}>
                            <div>
                                <Row>
                                    <Col md={4} xs={12} className={styles.container}>
                                        <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                                    </Col>

                                    <Col md={4} xs={12} className={styles.container}>
                                        <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                                    </Col>

                                    <Col md={4} xs={12} className={styles.container}>
                                        <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Grid>
                </div>
              }
            </div>

            <CustomModal
              open={this.state.open}
              handleClose={this.handleClose}
              handleDelete={this.handleDelete}
              header={intl.get('deleteContentModalHeader')}
              description={intl.get('deleteContentModalDescription', {num: selectedAssets.length})}
              mainButtonText={intl.get('delete')}
            />

          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { content, authentication, rfnProfile } = state;
  const { assets, isFetching } = content;
  const { user, isFirstTimeLogin } = authentication;
  const { rfn } = rfnProfile;
  const isFetchingRfn = rfnProfile.isFetching;

  return {
    assets,
    isFetching,
    user,
    isFirstTimeLogin,
    rfn,
    isFetchingRfn
  };
}

const composedContentPage = compose(withTracker, connect(mapStateToProps))(ContentPage);
export { composedContentPage as ContentPage };
