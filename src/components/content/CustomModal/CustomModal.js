import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import buttonCss from '../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import generalCss from '../../../resources/styles/general.css';

class CustomModal extends Component {
  close = () => this.props.handleClose()

  handleDelete = () => this.props.handleDelete()

  render() {
    const { open, header, description, mainButtonText, secondaryButtonText  } = this.props

    return (
        <Modal size='tiny' dimmer='inverted' open={open} onClose={this.close}>
          <Modal.Header>{header}</Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              <p>{description}</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.close}>
              {secondaryButtonText || intl.get('cancel')}
            </Button>
            <Button
              style={buttonCss.remove}
              onClick={this.handleDelete}>
              {mainButtonText}
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export { CustomModal }