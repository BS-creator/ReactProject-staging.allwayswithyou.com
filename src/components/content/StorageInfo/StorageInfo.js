import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { storageInfoActions } from '../../../actions';
import styles from './StorageInfo.scss';
import { Popup } from 'semantic-ui-react';
import intl from 'react-intl-universal';

const byteToGigabyte = (bytes) => {
  return bytes/1073741824;
}

const byteToMegabyte = (bytes) => {
  return (bytes/1048576).toFixed(2);
}

const getSpacePercentage = (assetTypeSpace, totalSpace) => {
  if(assetTypeSpace === 0){
    return `${0}`;
  }

  return `${assetTypeSpace/totalSpace*100}`;
}

function Progress(props) {
  const { assetSize, totalSpace, assetType, progressClass } = props;

  return (
    <Popup position='top center' trigger={
      <div 
        style={{ width:  `${getSpacePercentage(assetSize, totalSpace)}%`, height: 'inherit'}} 
        className={progressClass}/>
      } header={assetType} content={`${byteToMegabyte(assetSize)} ${intl.get("MB")}`}/>);
}

class StorageInfo extends Component {

  componentDidMount() {
    this.props.dispatch(storageInfoActions.get());
  }

  render() {
    const { info, isFetching } = this.props;

    return (
      isFetching ?
        <Grid>
            <Row>
                <Col mdOffset={2} md={8}>
                    <div className={styles.inline}>
                    <div className={styles.progressBar}>
                    </div>
                        <div className={styles.totalSpace}>{intl.get("GB")}</div>
                    </div>
                </Col>
            </Row>
        </Grid>
      :
      <Grid>
        <Row>
          <Col mdOffset={2} md={8}>
            <div className={styles.inline}>
              <div className={styles.progressBar}>
                <Progress
                  assetSize={info.imagesSize}
                  totalSpace={info.totalSpace}
                  assetType={intl.get("photos")}
                  progressClass={styles.photosProgressColor}
                />
                <Progress
                  assetSize={info.videosSize}
                  totalSpace={info.totalSpace}
                  assetType={intl.get("videos")}
                  progressClass={styles.videosProgressColor}
                />
                <Progress
                  assetSize={info.audiosSize}
                  totalSpace={info.totalSpace}
                  assetType={intl.get("audios")}
                  progressClass={styles.audiosProgressColor}
                />
                <Progress
                  assetSize={info.freeSpace}
                  totalSpace={info.totalSpace}
                  assetType={intl.get("free")}
                  progressClass={styles.freeProgressColor}
                />
              </div>
              <div className={styles.totalSpace}>{byteToGigabyte(info.totalSpace)} {intl.get("GB")}</div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const { storageInfo } = state;
  const { info, isFetching } = storageInfo;

  return {
    info,
    isFetching
  };
}

const connectedStorageInfo = connect(mapStateToProps)(StorageInfo);
export { connectedStorageInfo as StorageInfo };