import React, { Component } from 'react';
import { Button, Modal, Form, Dropdown } from 'semantic-ui-react';
import buttonCss from '../../../resources/styles/button.css';
import intl from 'react-intl-universal';
import generalCss from '../../../resources/styles/general.css';

class MoveToAlbumModal extends Component {

  state = {
    selectedContent: ''
  }

  handleMoveToModalClose = () => this.props.handleMoveToModalClose()

  handleChange = (e, data) => {
    this.setState({selectedContent : data.value})
  }

  handleMoveToAlbum = () => this.props.handleMoveAssetsToAlbum(this.state.selectedContent);
  
  render() {
    const { open, dropdownOptions } = this.props

    return (
        <Modal size='tiny' dimmer='inverted' open={open} onClose={this.handleMoveToModalClose}>
          <Modal.Header>{intl.get("moveContentToAlbum")}</Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              <p>{intl.get("chooseAlbum")}</p>
                <Form>
                  <Form.Field>
                    <label>{intl.get("albumName")}</label>
                    <Dropdown selectOnBlur={false} placeholder={intl.get("selectAnAlbum")} selection options={dropdownOptions} onChange={this.handleChange} />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic  onClick={this.handleMoveToModalClose}>
              {intl.get("close")}
            </Button>
            <Button
              disabled={this.state.selectedContent !== '' ? false : true}
              style={buttonCss.remove}
              onClick={this.handleMoveToAlbum}
            >
              {intl.get("moveButton")}
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export { MoveToAlbumModal }