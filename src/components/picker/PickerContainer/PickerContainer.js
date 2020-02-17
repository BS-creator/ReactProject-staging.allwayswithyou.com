import React, { Component } from 'react';
import styles from './PickerContainer.scss';
import { AssetCard } from './pickerComponents';
import { Grid, Row, Col } from 'react-flexbox-grid';
import buttonCss from '../../../resources/styles/button.css';
import { Button } from 'semantic-ui-react';
import intl from 'react-intl-universal';

import loader from '../../../resources/images/loader.gif';

class PickerContainer extends Component {

  state = {
    selectedAssets : [],
    content: (this.props.content)?this.props.content.mediaItems:[]
  }
  componentWillReceiveProps(ppp) {
    console.log(ppp, 'pppp')
    this.setState({content: ppp.content.mediaItems});

  }
  handleSelect = (id) => {
    var assets = this.state.selectedAssets;
    const index = this.state.selectedAssets.indexOf(id);
    if ( index !== -1) {
      assets.splice(index, 1);
      this.setState({ selectedAssets : assets });
    }else {
      assets.push(id)
      this.setState({ selectedAssets: assets });
    }
  }

  importAssets = (assets) => {
    let chosenAssets = this.state.selectedAssets;
    console.log(chosenAssets);
    var retVal = chosenAssets.map(asset => {
      var url = asset.baseUrl;
      if(asset.mimeType.indexOf("image") !== -1){
        url = url.concat("=d")
      }else{
        url = url.concat("=dv")
      }
      return(
        {
          url : url,
          mime : asset.mimeType,
          metadata : asset.mediaMetadata,
          filename : asset.filename,
          importSource : this.props.source
        }
      )
    });
    this.props.import(retVal);
    this.closePicker();
  }

  searchAlbums = (e) => {
    console.log(e)
    let updatedList = this.props.content.mediaItems;
    updatedList = updatedList.filter(function(item){
      console.log(item, 'item')
      return item.filename.toLowerCase().search(
        e.target.value.toLowerCase()) !== -1;
    });
    this.setState({content: updatedList});
  }

  closePicker = async () => {
    this.setState({selectedAssets : []});
    await this.props.close();
  }

  render() {
    let content = null;
    //let tokens = this.props.tokens;
    if(this.state.content){
      content = this.state.content;
    }
    return (
      <div className={styles.pickerContainer} >
        <h2 className={styles.pickerHeading}>
          {intl.get("selectFiles")}  
          <div className="ui input">
            <input type="text" style={{fontSize: "14px",
            marginLeft: "45px",
            verticalAlign: "text-top"}}  placeholder="Search Photo" onChange={this.searchAlbums} />
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
                    
                      {
                        (content.length > 0) ?
                        content && 
                        content.map( (asset, id) => {
                          return (
                            
                              <Col key={id} md={3} xs={12} className={styles.container}>
                                <AssetCard 
                                  key={id} 
                                  asset={asset} 
                                  selectedAssets = {this.state.selectedAssets}
                                  handleClick={() => this.handleSelect(asset)}
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
                      onClick={()=> {this.importAssets(this.state.selectedAssets)}}
                      disabled = {this.state.selectedAssets.length === 0 ? true : false}
                      >{intl.get("importButton")}</Button>
                  </div>
            
          </div>
    );
  }
}

export { PickerContainer };