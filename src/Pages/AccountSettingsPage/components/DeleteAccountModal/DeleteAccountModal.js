import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import buttonCss from '../../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import generalCss from '../../../../resources/styles/general.css';

class DeleteAccountModal extends Component {
  close = () => this.props.handleClose()

  handleDelete = () => this.props.handleDelete()

  render() {
    const { open, isAdmin } = this.props

    return (
        <Modal size='tiny' dimmer='inverted' open={open} onClose={this.close}>
          <Modal.Header>
            {isAdmin ? intl.get("removeAccountModalHeader") : intl.get("removeUserHeader")}
          </Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              {isAdmin ? intl.get("removeAccountModalDescription") : intl.get("removeUserDescription")}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.close}>
              {intl.get("close")}
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

export { DeleteAccountModal }