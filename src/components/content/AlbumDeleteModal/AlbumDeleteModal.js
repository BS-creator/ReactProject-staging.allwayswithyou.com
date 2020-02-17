import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import buttonCss from '../../../resources/styles/button.css';
import generalCss from '../../../resources/styles/general.css';
import intl from 'react-intl-universal';

class AlbumDeleteModal extends Component {
  close = () => this.props.handleClose()

  handleDelete = () => this.props.handleDelete()

  render() {
    const { open, album } = this.props

    return (
        <Modal size='tiny' dimmer='inverted' open={open} onClose={this.close}>
          <Modal.Header>{intl.get("deleteAlbum")}</Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              <p>{intl.get("deleteAlbumModal", album ? {album: album.name} : null)}</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.close}>
              {intl.get("cancel")}
            </Button>
            <Button
              style={buttonCss.remove}
              onClick={this.handleDelete}
            >
              {intl.get("delete")}
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export { AlbumDeleteModal }