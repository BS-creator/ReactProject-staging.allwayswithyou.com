import React, { Component } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../../helpers';
import { SignInPage } from '../SignInPage';
import { MainMenuPage } from '../MainMenuPage';
import { ResidentPage } from '../ResidentPage';
import { UsersManagement } from '../UsersManagement';
import { ResidentProfilePage } from '../ResidentProfilePage';
import { ContentPage } from '../ContentPage';
import { ContentManagementPage } from '../ContentManagementPage';
import { ToastContainer, toast } from 'react-toastify';
import '../../resources/styles/react-toastify-override.css';
import { compose } from 'recompose';
import { withAuthentication } from '../../components';
import { RegisterPage } from '../RegisterPage';
import { AccountSettingsPage } from '../AccountSettingsPage';
import { ForgotPasswordPage } from '../ForgotPasswordPage';
import { RegistrationCompletePage } from '../RegistrationCompletePage';
import { UserProfilePage } from '../UserProfilePage';
import { StatsPage } from '../StatsPage';
import { AlbumPage } from '../AlbumPage';
import { AlbumsPage } from '../AlbumsPage';
import { ErrorPage } from '../ErrorPage';
import { Message } from 'semantic-ui-react'
import { userActions } from '../../actions';
import intl from "react-intl-universal";

const locales = {
  "en-US": require("../../resources/strings/en-US.json"),
  "sr-RS": require("../../resources/strings/sr-RS.json"),
  "ro-RO": require("../../resources/strings/ro-RO.json"),
  "de-DE": require("../../resources/strings/de-DE.json"),
  "fr-FR": require("../../resources/strings/fr-FR.json"),
};

class App extends Component {

  state = {
    initializeLocale: false
  }

  componentDidMount() {
    this.loadLocales(this.props.lang);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.loadLocales(nextProps.lang);
    }
  }

  loadLocales(lang) {
    intl.init({
      currentLocale: lang,
      locales,
    }).then(() => {
      this.setState({ initializeLocale: true });
    });
  }

  state = {
    initializeLocale: false
  }

  componentDidMount() {
    this.loadLocales(this.props.lang);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.loadLocales(nextProps.lang);
    }
  }

  loadLocales(lang) {
    intl.init({
      currentLocale: lang,
      locales,
    }).then(() => {
      this.setState({ initializeLocale: true });
    });
  }

  state = {
    initializeLocale: false
  }

  componentDidMount() {
    this.loadLocales(this.props.lang);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.loadLocales(nextProps.lang);
    }
  }

  loadLocales(lang) {
    intl.init({
      currentLocale: lang,
      locales,
    }).then(() => {
      this.setState({ initializeLocale: true });
    });
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  handleDismiss = (notification) => {
    this.props.dispatch(userActions.dismissNotification(notification.id));
  }

  render() {
    const { user, isFirstTimeLogin } = this.props;

    return (
      this.state.initializeLocale &&
      <Router history={history}>
        <div>
          {(user && user.notification) &&
            <Message warning onDismiss={() => this.handleDismiss(user.notification)}>
              {user.notification.numberOfDays === 1 ? intl.get("trialExpirationOneDayMessage") : intl.get("trialExpirationMessage", { numberOfDays: user.notification.numberOfDays })}
            </Message>
          }

          <Switch>
            <Route exact path="/" render={({ match }) => (
              (user && user.rfnId) ?
                <MainMenuPage page={match.url} />
                : null
            )} />
            <Route exact path="/resident" render={({ match }) => (
              user && user.rfnId === null
                ? <ResidentPage page={match.url} />
                : <ErrorPage page={match.url} displayedMessage={'doNotHavePermission'} />
            )} />
            <Route exact path="/users-management" render={({ match }) => (
              user && user.rfnId && user.isAdmin
                ? <UsersManagement page={match.url} />
                : <ErrorPage page={match.url} displayedMessage={'doNotHavePermission'} />
            )} />
            <Route exact path="/resident-profile" render={({ match }) => (
              user && user.rfnId && user.isAdmin
                ? <ResidentProfilePage page={match.url} />
                : <ErrorPage page={match.url} displayedMessage={'doNotHavePermission'} />
            )} />
             <Route path="/content-management" render={({ match }) => (
              (user && user.rfnId) ?
                <ContentManagementPage page={match.url} params={match.params} />
                : null
            )} />
            <Route path="/assets" render={({ match }) => (
              (user && user.rfnId) ?
                <ContentPage page={match.url} params={match.params} />
                : null
            )} />
            <Route exact path="/albums" render={({ match }) => (
              (user && user.rfnId) ?
                <AlbumsPage page={match.url} params={match.params} />
                : null
            )} />
            <Route exact path="/albums/:albumId" render={({ match }) => (
              (user && user.rfnId) ?
                <AlbumPage page={match.url} params={match.params} />
                : null
            )} />
            <Route exact path="/register" render={({ match }) => (
              user == null
                ? <RegisterPage page={match.url} />
                : user.rfnId == null ? <Redirect to="/profile" /> : <Redirect to="/" />
            )} />
            <Route exact path="/forgot-password" render={({ match }) => (
              (user == null) ?
                <ForgotPasswordPage page={match.url} />
                : null
            )} />
            <Route exact path="/settings" render={({ match }) => (
              (user && user.rfnId) ?
                <AccountSettingsPage page={match.url} />
                : null
            )} />
            <Route exact path="/registration-complete" render={({ match }) => (
              (user && user.rfnId && user.isAdmin && isFirstTimeLogin) ?
                <RegistrationCompletePage page={match.url} />
                : null
            )} />
            <Route exact path="/profile" render={({ match }) => (
              user ?
                <UserProfilePage page={match.url} />
                : null
            )} />
            <Route exact path="/stats" render={({ match }) => (
              user ?
                <StatsPage page={match.url} />
                : null
            )} />
            <Route exact path="/login" render={({ match }) => (<SignInPage page={match.url} />)} />
            <Route exact path="*" render={({ match }) => (
              user ?
                <ErrorPage page={match.url} displayedMessage={'pageNotFound'} />
                : null
            )} />

          </Switch>

          <ToastContainer
            autoClose={3000}
            position={toast.POSITION.BOTTOM_RIGHT}
            hideProgressBar={true}
            newestOnTop={true}
          />

        </div>

      </Router>

    );
  }
}


function mapStateToProps(state) {
  const { authentication, localeReducer } = state;
  const { user, isFirstTimeLogin } = authentication;
  const { lang } = localeReducer;

  return {
    lang,
    user,
    isFirstTimeLogin
  };
}

const composedApp = compose(withAuthentication, connect(mapStateToProps))(App);
export { composedApp as App };
