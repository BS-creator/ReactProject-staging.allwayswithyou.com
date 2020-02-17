import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import styles from './UploadPhoto.scss';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';

class UploadPhoto extends Component {

  state = {
    preview: null,
    maxSize: 512000 //500kb
  }

  handleUpload = (files) => {
    if (files.length === 1 && files[0].size < this.state.maxSize) {
      this.setState({ preview: URL.createObjectURL(files[0]) });
      this.props.onUpload(files[0]);
    }
    else {
      toast.error(intl.get('maxSizePhoto'));
      return;
    }
  }

  render() {
    const { photo } = this.props;
    const { preview } = this.state;
    const src = preview ? preview : photo ? photo : require('../../resources/images/AddUser.svg');

    return (
      <Dropzone
        disableClick={this.props.disable}
        style={{ width: this.props.theWidth }}
        className={styles.pointerCursor}
        accept="image/*"
        multiple={false}
        onDrop={this.handleUpload}
        maxSize={this.state.maxSize}
      >
        <div className={styles.textAlign}>{intl.get("profilePhoto")}</div>
        <div className={styles.profilePhoto} style={{ backgroundImage: `url(${src})` }}>
        </div>
      </Dropzone>
    );
  }
}

export { UploadPhoto };