import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import buttonCss from '../../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import generalCss from '../../../../resources/styles/general.css';

class CustomModalUsers extends Component {
  close = () => this.props.handleClose()

  handleDelete = () => this.props.handleDelete()

  render() {
    const { open, email } = this.props

    return (
        <Modal size='tiny' dimmer='inverted' open={open} onClose={this.close}>
          <Modal.Header>{intl.get("removeAccount")}</Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              <p>{intl.get("areYouSure")} {email} {intl.get("theirContentWillStay")}</p>
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
              {intl.get("remove")}
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export { CustomModalUsers }