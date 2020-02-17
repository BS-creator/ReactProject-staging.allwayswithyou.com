import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './ContentManagementPage.scss';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { history } from '../../helpers';
import { compose } from 'recompose';
import { CustomMenu, withTracker, CustomCard } from '../../components';
import intl from "react-intl-universal";

class ContentManagementPage extends Component {

  handleRedirect = (nextPage) => {
    history.push('/' + nextPage);
  }

  render() {

    return (
      <div>
        <div>
          <CustomMenu />

          <h1 className={styles.header}>{intl.get('contentHeader')}</h1>
          <Grid>
            <Row>
              <Col md={6} xs={12} className={styles.container}>
                <CustomCard
                  id='mainMenuPage_customCard_1'
                  header={intl.get('albumsHeader')}
                  image='Albums'
                  description={intl.get('albumsDescription')}
                  buttonText={intl.get('albumsButton')}
                  handleClick={() => this.handleRedirect('albums')}
                  styles={styles}
                  isMainComponent={true}
                />
              </Col>

              <Col md={6} xs={12} className={styles.container}>
                <CustomCard
                  id='mainMenuPage_customCard_2'
                  header={intl.get('assetsHeader')}
                  image='Content'
                  description={intl.get('assetsDescription')}
                  buttonText={intl.get('assetsButton')}
                  handleClick={() => this.handleRedirect('assets')}
                  styles={styles}
                  isMainComponent={true}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

const composedContentManagementPage = compose(withTracker, connect(mapStateToProps))(ContentManagementPage);
export { composedContentManagementPage as ContentManagementPage };