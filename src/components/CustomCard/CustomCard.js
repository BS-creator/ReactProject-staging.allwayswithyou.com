import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import buttonCss from '../../resources/styles/button.css';
import customCardCss from './customCard.css';

class CustomCard extends Component {

  handleClick = () => {
    this.props.handleClick();
  }

  render() {
    const { header, description, buttonText, styles, image, isLocked, isMainComponent } = this.props;

    return (
      <Card style={customCardCss.card}>
        { isLocked ? 
            <div className={styles.defaultContent} style={isLocked ? customCardCss.cursor : customCardCss.pointer}>
             <img style={customCardCss.image} src={require(`../../resources/images/${image}.svg`)} alt={header}/>
           </div>
          :
          <div onClick={this.handleClick} className={styles.defaultContent}>
            <img style={customCardCss.image} src={require(`../../resources/images/${image}.svg`)} alt={header}/>
          </div>
        }

        <Card.Content style={isLocked ? customCardCss.disableContent : customCardCss.content}>
          <Card.Header style={customCardCss.header}>{header}</Card.Header>
          <Card.Description style={customCardCss.description}>
            {description}
          </Card.Description>
           <Card.Content style={customCardCss.btn}>
                <Button id='mainMenuPage_contentButtons' style={isMainComponent ? buttonCss.primary : buttonCss.mainPageButton} onClick={this.handleClick} disabled={isLocked}>
            {isMainComponent ? buttonText : buttonText.toUpperCase()}
          </Button>
        </Card.Content>
        </Card.Content>
      </Card>
    );
  }
}

export { CustomCard };