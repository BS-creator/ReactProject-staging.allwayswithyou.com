import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { AlbumPickerContainer } from '../../picker';
import { connect } from 'react-redux';
import buttonCss from '../../../resources/styles/button.css';
import { contentActions, albumActions } from '../../../actions';
import { Button } from 'semantic-ui-react';
import intl from 'react-intl-universal';

class AlbumAddAssetsModal extends Component {
  state = {
    open: false,
    pickerOpen: false,
    pickerContent: null
  }

  componentDidMount() {
    this.props.dispatch(contentActions.get());
  }

  handleAddAssets = (assets) => {
    this.props.dispatch(albumActions.addAssetsToAlbum(this.props.albumId, assets));
  }

  closePicker = () => {
    this.setState({ pickerOpen: false });
  }

  close = () => this.setState({ pickerOpen: false })

  render() {
    const { assets, isFetching, albumAssets } = this.props;
    let assetsNotInAlbum = [];

    if (!isFetching && assets && albumAssets) {
      assetsNotInAlbum = assets.filter(function (el) {
        return albumAssets.every(function (f) {
          return f.id !== el.id
        });
      });
    }

    return (
      <Modal
        open={this.state.pickerOpen}
        onOpen={() => this.setState({ pickerOpen: true })}
        onClose={() => this.setState({ pickerOpen: false })}
        size='small'
        trigger={
          <Button
            id='albumPage_btnAddFiles'
            style={buttonCss.primary}
            disabled={assetsNotInAlbum.length === 0}>
            {intl.get('addFiles')}
          </Button>
        }
      >
        {!isFetching && assets && albumAssets &&
          <AlbumPickerContainer
            assets={assetsNotInAlbum}
            onAddAssets={this.handleAddAssets}
            close={this.closePicker}
          />
        }
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  const { content, localeReducer } = state;
  const { assets, isFetching } = content;
  const { lang } = localeReducer

  return {
    lang,
    assets,
    isFetching
  };
}

const connectedAlbumAddAssetsModal = connect(mapStateToProps)(AlbumAddAssetsModal);

export { connectedAlbumAddAssetsModal as AlbumAddAssetsModal }