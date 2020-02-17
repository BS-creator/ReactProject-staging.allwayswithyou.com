import React, { Component } from 'react';
import styles from './AlbumPickerContainer.scss';
import { AssetCard } from './pickerComponents';
import { Grid, Row, Col } from 'react-flexbox-grid';
import buttonCss from '../../../resources/styles/button.css';
import { Button } from 'semantic-ui-react';
import intl from 'react-intl-universal';


class AlbumPickerContainer extends Component {

  state = {
    selectedAssets: []
  }

  handleSelect = (id) => {
    var assets = this.state.selectedAssets;
    const index = this.state.selectedAssets.indexOf(id);
    if (index !== -1) {
      assets.splice(index, 1);
      this.setState({ selectedAssets: assets });
    } else {
      assets.push(id)
      this.setState({ selectedAssets: assets });
    }
  }

  handleAddAssets = () => {
    this.props.onAddAssets(this.state.selectedAssets);

    this.closePicker();
  }

  closePicker = async () => {
    this.setState({ selectedAssets: [] });
    await this.props.close();
  }

  render() {
    const { assets } = this.props;

    return (
      <div className={styles.pickerContainer} >
        <h2 className={styles.pickerHeading}>{intl.get('selectFiles')}ok</h2>
        <Button
          style={buttonCss.secondary}
          className={styles.pickerCloseButton}
          onClick={async () => await this.closePicker()}
        >X</Button>
        <div className={styles.content} >
          <Grid>
            <div className={styles.contentContainer} >
              <div>
                <Row>
                  {assets.map(asset => {
                    return (

                      <Col key={asset.id} md={3} xs={12} className={styles.container}>
                        <AssetCard
                          key={asset.id}
                          asset={asset}
                          selectedAssets={this.state.selectedAssets}
                          handleClick={() => this.handleSelect(asset)}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </div>
          </Grid>

        </div>
        <div className={styles.pickerButtonsContainer}>
          <Button
            style={buttonCss.primary}
            className={styles.importButton}
            onClick={() => { this.handleAddAssets() }}
            disabled={this.state.selectedAssets.length === 0}
            content={intl.get('addFiles')} />
        </div>

      </div>
    );
  }
}

export { AlbumPickerContainer };