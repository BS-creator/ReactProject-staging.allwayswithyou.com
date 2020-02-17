import React, { Component } from 'react';
import { Button, Modal, Form, Label } from 'semantic-ui-react';
import buttonCss from '../../../resources/styles/button.css';
import albumCardCss from '../../../resources/styles/albumCard.css';
import intl from 'react-intl-universal';
import generalCss from '../../../resources/styles/general.css';

const initialState = {
  name: null,
  description: ""
}

class AlbumCreateModal extends Component {

  constructor(props) {
    super(props);
    this.handleAlbumName = this.handleAlbumName.bind(this);
    this.handleAlbumDescripion = this.handleAlbumDescripion.bind(this);
  }

  state=initialState

  handleNewAlbumModalClose = () => {
    this.props.handleNewAlbumModalClose()
    this.setState(initialState)
  }

  handleCreateAlbum = () => {
    this.props.handleCreateAlbum(this.state.name, this.state.description)
    this.setState(initialState)
  }

  handleAlbumName = (e) => {
      if(e.target.value.length > 25){
          e.preventDefault();
          return;
      }

    this.setState({ name: e.target.value });
  }

  handleAlbumDescripion = (e) => {
      if(e.target.value.length > 100){
          e.preventDefault();
          return;
      }
    this.setState({ description: e.target.value });
  }

  render() {
    const { open } = this.props

    return (
        <Modal size='tiny' dimmer='inverted' open={open} onClose={this.handleNewAlbumModalClose}>
          <Modal.Header>{intl.get("createNewAlbum")}</Modal.Header>
          <Modal.Content image>
            <Modal.Description style={generalCss.fullWidth}>
              <Form>
                <Form.Field>
                  <label>{intl.get("albumName")}</label>
                  <input onChange={this.handleAlbumName} value={this.state.name}></input>
                  {this.state.name === "" ? <Label pointing style={albumCardCss.errorLabel} >{intl.get("emptyAlbumName")}</Label> : null}
                </Form.Field>
                <Form.Field>
                  <label>{intl.get("albumDescription")}</label>
                  <textarea onChange={this.handleAlbumDescripion} value={this.state.description}></textarea>
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button basic  onClick={this.handleNewAlbumModalClose}>
              {intl.get("close")}
            </Button>
            <Button
              disabled={this.state.name || this.state.description !== '' ? false : true}
              style={buttonCss.remove}
              onClick={this.handleCreateAlbum}
            >
              {intl.get("createButton")}
            </Button>
          </Modal.Actions>
        </Modal>
    )
  }
}

export { AlbumCreateModal }