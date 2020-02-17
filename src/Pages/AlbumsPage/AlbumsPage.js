import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Button, Icon } from 'semantic-ui-react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import intl from 'react-intl-universal';
import Sticky from 'react-sticky-el';
import { albumActions } from '../../actions';
import { AlbumCard, CustomMenu, withTracker, ContentCardPlaceholder } from '../../components';
import { AlbumCreateModal } from '../../components/content/AlbumCreateModal';
import { history } from '../../helpers';
import styles from './AlbumsPage.scss';
import buttonCss from '../../resources/styles/button.css';
import generalCss from '../../resources/styles/general.css';
import '../../resources/styles/loading.css';
import { ContentUploadModal } from '../../components/content/ContentUploadAlbumsModal/ContentUploadModal';

class AlbumsPage extends Component {

  state = {
    openNewAlbumModal: false,
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
    this.props.dispatch(albumActions.getAll());
  }

  handleCreateAlbum = (name, description) => {
    this.props.dispatch(albumActions.createAlbum({ name, description }));
    this.handleNewAlbumModalClose();
  }

  handleTitleClick = () => {
    history.replace('/content-management');
  }

  handleAlbum = (id) => {
    history.push('/albums/'.concat(id));
  }

  handleNewAlbumModal = () => {
    this.setState({ openNewAlbumModal: true })
  }

  handleNewAlbumModalClose = () => {
    this.setState({ openNewAlbumModal: false })
  }

  successfulImportCallback = () => {
    this.props.dispatch(albumActions.get(this.props.params.albumId));
  }

  render() {
    const { albums, isFetchingAllAlbums } = this.props;

    const isFetched = (albums !== undefined && !isFetchingAllAlbums);

    return (
      <div>
        <div>
          <Sticky stickyClassName={styles.stickyContent}>
            <CustomMenu />

            <Grid>
              <Col mdOffset={2} md={8} className={styles.header}>
                <div style={generalCss.pointerCursor}>
                  <a id='albumsPage_contentManagementLink' onClick={this.handleTitleClick}><h1>{intl.get('contentHeader')}</h1></a>
                </div>

                <div style={generalCss.marginHorizontal5}>
                  <h1>{intl.get('divider')}</h1>
                </div>

                <div>
                  <h1>{intl.get('albumsHeader')}</h1>
                </div>
              </Col>

              <Col mdOffset={2} md={8} className={styles.columns}>
                <div className={styles.rightColumn}>
                  <Button
                    id='contentPage_btnAddNewAlbum'
                    style={buttonCss.primary}
                    disabled={this.state.isSelectedContent}
                    onClick={() => this.handleNewAlbumModal()}
                    icon={<Icon inverted name='plus' />}
                    content={intl.get("album")} />

                  <ContentUploadModal
                    isSelectedContent={this.state.selectedAssets && this.state.selectedAssets.length > 0}
                    isFirstTimeLogin={null}
                    successCallback={this.successfulImportCallback}
                  />
                </div>

              </Col>
              
            </Grid>
          </Sticky>

          <div className={styles.content}>
            {isFetched ?
              <Grid>
                <div className={styles.contentContainer}>
                  <div>
                    <Row>
                      {albums.map(album => {
                        return (
                          <Col id={`contentPage_album_${album.id}`} key={album.id} md={4} xs={12} className={styles.container}>
                            <AlbumCard
                              albumId={album.id}
                              name={album.name}
                              description={album.description}
                              handleClick={() => this.handleAlbum(album.id)}
                              image={album.creator.profilePictureUrl}
                              uploaders={album.uploaders}
                            />
                          </Col>
                        )
                      })
                      }

                    </Row>
                  </div>
                </div>
              </Grid>
            :
            <div className="loading">
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
                            <Col md={4} xs={12}  className={styles.container}>
                                <ContentCardPlaceholder height={"240px"} width = {"290px"}/>
                            </Col>
                        </Row>
                    </div>
                    </div>
                </Grid>
            </div>
            }
          </div>

          <AlbumCreateModal
            open={this.state.openNewAlbumModal}
            handleNewAlbumModalClose={this.handleNewAlbumModalClose}
            handleCreateAlbum={this.handleCreateAlbum}
          />

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { albums, isFetchingAllAlbums } = state.albums;

  return {
    albums,
    isFetchingAllAlbums
  };
}

const composedAlbumsPage = compose(withTracker, connect(mapStateToProps))(AlbumsPage);
export { composedAlbumsPage as AlbumsPage };
