import React, { Component } from 'react';
import styles from './AlbumContainer.scss';
import { AssetCard } from './pickerComponents';
import { Grid, Row, Col } from 'react-flexbox-grid';
import buttonCss from '../../../resources/styles/button.css';
import { Button } from 'semantic-ui-react';
import intl from 'react-intl-universal';

import loader from '../../../resources/images/loader.gif';

class AlbumContainer extends Component {

  state = {
    selectedAssets: [],
    query: "",
    albumList: this.props.albumList
  }
  // constructor (props) {
  //   super(props)
  //   console.log()
  // }

  // componentDidMount() {
  //   console.log(this.props.albumList, 'didmoutn')
  //   this.setState({albumList: this.props.albumList});
  //   console.log('didmoutn')
  // }
  componentWillReceiveProps(ppp) {
    console.log(ppp, 'pppp')
    this.setState({albumList: ppp.albumList});

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

  handleAddAlbums = () => {
    const selectedAlbums = this.state.selectedAssets
    this.props.onAddAlbums(selectedAlbums);

    this.closePicker();
  }

  searchAlbums = (e) => {
    console.log(e)
    let updatedList = this.props.albumList;
    updatedList = updatedList.filter(function(item){
      console.log(item, 'item')
      return item.title.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({albumList: updatedList});
  }

  closePicker = async () => {
    this.setState({ selectedAssets: [] });
    await this.props.close();
  }

  render() {
    const { albumList } = this.state;
    console.log(albumList, "AlbumContainer")
    console.log(this.props.tokens)
    return (
      <div className={styles.pickerContainer} >
        <h2 className={styles.pickerHeading}> 
          <span onClick={this.props.showAlbums}></span> 
          {intl.get('selectFiles')}
          <div className="ui input">
            <input type="text" style={{fontSize: "14px",
            marginLeft: "45px",
            verticalAlign: "text-top"}}  placeholder="Search Album" onChange={this.searchAlbums} />
          </div>

        </h2>
        <Button
          style={buttonCss.secondary}
          className={styles.pickerCloseButton}
          onClick={async () => await this.closePicker()}
        >X</Button>
        <div style={{marginTop:"10px"}} className={styles.content} >
          <Grid>
            <div className={styles.contentContainer} >
              <div>
                <Row>
                  { (albumList.length > 0)?
                    albumList.map(asset => {
                      return (

                        <Col key={asset.id} md={3} xs={12} className={styles.container}>
                          <AssetCard
                            key={asset.id}
                            asset={asset}
                            selectedAssets={this.state.selectedAssets}
                            handleClick={() => this.handleSelect(asset)}
                            doubleClick={this.props.openPhotos}
                          />
                        </Col>
                      );
                    })
                    :
                    <img src={loader} style={{width: "120px", margin: "auto"}} />
                  }
                </Row>
              </div>
            </div>
          </Grid>

        </div>
        <div className={styles.pickerButtonsContainer}>
          <Button 
            style={buttonCss.primary} 
            className={styles.paginationButton} 
            onClick={this.props.previous}
            disabled = {this.props.tokens.length === 0 || this.props.tokens.length === 1 ? true : false}
            >{intl.get("previousPage")}</Button>
          <Button 
            style={buttonCss.primary} 
            className={styles.paginationButton} 
            onClick={this.props.next}
            disabled = {this.props.tokens[this.props.tokens.length-1] ? false : true}
            >{intl.get("nextPage")}</Button>

          <Button
            style={buttonCss.primary}
            className={styles.importButton}
            onClick={() => { this.handleAddAlbums() }}
            disabled={this.state.selectedAssets.length === 0}
            content={"Import"} />
        </div>

      </div>
    );
  }
}

export { AlbumContainer };