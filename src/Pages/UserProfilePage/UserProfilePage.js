import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styles from './UserProfilePage.scss';
import { UserProfileForm } from '../../components';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import { history } from '../../helpers';
import { fileService } from '../../services';
import { userSettingsActions, userActions } from '../../actions';
import intl from 'react-intl-universal';

class UserProfilePage extends Component {

  state = {
    photo: null,
    profilePictureChanged: false
  }

  handleSubmit = (values) => {
    const { user } = this.props;
    const { photo } = this.state;
    const { firstName, lastName, subscribed } = values;

    this.props.dispatch(userSettingsActions.create({ userId: user.id, subscribed }));

    if(photo){
      fileService.post(photo).then(profilePictureUrl => {
        const dto = {
          ...user.displayName !== `${firstName} ${lastName}` && { displayName : `${firstName} ${lastName}` },
          profilePictureUrl : profilePictureUrl
        };

        this.props.dispatch(userActions.update(dto));
        this.setState({ profilePictureChanged: false});
        if(user.isAdmin){
          history.replace('/resident');  
        }else{
          history.replace('/');  
        } 
      })
      .catch(e => {
        console.log(e);
      })
    }else{
      if(user.displayName !== `${firstName} ${lastName}`){
        const dto = {
          displayName: `${firstName} ${lastName}`
        }

        this.props.dispatch(userActions.update(dto));
        if(user.isAdmin){
          history.replace('/resident');  
        }else{
          history.replace('/');  
        }
      }
      else{
        if(user.isAdmin){
          history.replace('/resident');  
        }else{
          history.replace('/');
        }
      }
    }
  }

  handleUpload = (photo) => {
    this.setState({ photo, profilePictureChanged: true });
  }

  render() {

    const { user, isFetching } = this.props;

    return (
      !isFetching &&
      <Grid>
        <Row>
          <Col mdOffset={3} md={6}>
            {user.isAdmin
            ?
              <div className={styles.header}>
                <h1>{intl.get("userProfileAdminHeader")}</h1>
                <small>{intl.get("userProfileAdminDescription")}</small>
              </div>
            :
              <h1 className={styles.header}>{intl.get("userProfileHeader")}</h1>
            }
            <UserProfileForm
              onSubmit={this.handleSubmit}
              user={user}
              onUpload={this.handleUpload}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user, isFetching } = authentication;

  return {
    user,
    isFetching
  };
}


const composedUserProfilePage = compose(withTracker , connect(mapStateToProps))(UserProfilePage);
export { composedUserProfilePage as UserProfilePage };
