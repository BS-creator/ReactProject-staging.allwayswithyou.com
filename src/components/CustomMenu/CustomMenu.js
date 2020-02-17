import React, { Component } from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import { history } from '../../helpers';
import logo from '../../resources/images/ALWAYS_Symbol_RGB_NEG.png';
import { localeActions } from "../../actions";
import intl from 'react-intl-universal';
import generalCss from '../../resources/styles/general.css';

const languageOptions = [
  {
    code: "en-US",
    label: "EN",
  },
  {
    code: "de-DE",
    label: "DE"
  },
  {
    code: "fr-FR",
    label: "FR"
  },
  {
    code: "ro-RO",
    label: "RO"
  },
  {
    code: "sr-RS",
    label: "SR"
  },
];

class CustomMenu extends Component {

  handleHome = (e, { name }) => {
    this.setState({ activeItem: name });

    history.push('/');
  }

  handleLogout = (e, { name }) => {
    this.setState({ activeItem: name });

    this.props.logout();
  }

  handleTranslation = lang => {
    this.props.localSet(lang);

  };

  render() {

    const selectedLanguage = languageOptions.find(lo => lo.code === this.props.lang);

    return (
      <Menu secondary inverted style={generalCss.alwyBackgroundColor}>
        <Menu.Item name='home'
          onClick={this.handleHome}>
          <Image style={generalCss.height20} src={logo} />
        </Menu.Item>

        <Dropdown item text={selectedLanguage.label}>
          <Dropdown.Menu>
            {languageOptions.map((lo, i) => (
              <Dropdown.Item
                key={i}
                onClick={this.handleTranslation.bind(this, lo.code)} >
                {lo.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item position='right' name='log out' style={generalCss.height45}
          onClick={this.handleLogout}>
          {intl.get("logOut")}
        </Menu.Item>
      </Menu>
    )
  }
}

function mapStateToProps(state) {
  const { authentication, localeReducer } = state;
  const { user } = authentication;
  const { lang } = localeReducer;

  return {
    lang,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    localSet: lang => dispatch(localeActions.localSet(lang)),
    logout: () => dispatch(userActions.logout())
  };
}

const connectedMenu = connect(mapStateToProps, mapDispatchToProps)(CustomMenu);
export { connectedMenu as CustomMenu };