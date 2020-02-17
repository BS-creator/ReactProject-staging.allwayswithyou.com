import React, { Component } from 'react';
import { Form, Button, TextArea, Icon, Label } from 'semantic-ui-react';
import { UploadPhoto } from '../../../../components';
import styles from './ResidentProfileForm.scss';
import { fileService } from '../../../../services';
import { rfnProfileActions } from '../../../../actions';
import buttonCss from '../../../../resources/styles/button.css';
import { compose } from 'recompose';
import { withTracker } from '../../../../components';
import { connect } from 'react-redux';
import errorCss from '../../../../resources/styles/error.css';
import intl from 'react-intl-universal';
import generalCss from '../../../../resources/styles/general.css';

const validateSkypeId = (skypeId) => {
  var regex = /^[A-Za-z\d,\-._]{6,32}$|^live:[A-Za-z\d,\-._]{1,32}$/;
  if(skypeId != null){
    return regex.test(skypeId);
  }else{
    return true;
  }
}

class ResidentProfileForm extends Component {

  state = {
    rfn: null,
    loaded: false,
    disable: true,
    invalidSkypeId: false
  }

  handleReset = () => {
    const rfn = JSON.parse(JSON.stringify(this.props.rfn));
    this.setState({ rfn });
  }

  handleSubmit = () => {
    if(validateSkypeId(this.state.rfn.skypeId)){
      this.props.onSubmit(this.state.rfn);
      this.setState({disable:true, invalidSkypeId: false});
    }
    else {
      this.setState({invalidSkypeId: true})
    }
  }

  handleLiveWithDemoOrAlz = (condition) => {
    const { rfn } = {...this.state};
    rfn.liveWithDemOrAlz = condition;
    this.setState({ rfn });
  }

  handleUsedMobileDevice = (condition) => {
    const { rfn } = {...this.state};
    rfn.usedMobileDevice = condition;
    this.setState({ rfn });
  }

  handleHearOrVisualDifficulties = (condition) => {
    const { rfn } = {...this.state};
    rfn.hearOrVisualDifficulties = condition;
    this.setState({ rfn });
  }

  handleLikesChange = (value) => {
    const { rfn } = {...this.state};
    rfn.likes = value;
    this.setState({ rfn });
  }

  handleDislikesChange = (value) => {
    const { rfn } = {...this.state};
    rfn.dislikes = value;
    this.setState({ rfn });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.rfn){
      if(!prevState.loaded){
        prevState.rfn = JSON.parse(JSON.stringify(nextProps.rfn));
        prevState.loaded = true;
      }

      return prevState;
    }else{
      return prevState;
    }
  }

  handleClick(){
    this.setState({disable:!this.state.disable});
  }

  handleFirstNameChange = (e) => {
    const { rfn } = {...this.state};
    rfn.firstName = e.target.value;
    this.setState({ rfn });
  }

  handleLastNameChange = (e) => {
    const { rfn } = {...this.state};
    rfn.lastName = e.target.value;
    this.setState({ rfn });
  }

  handleUpload = (photo) => {
    fileService.post(photo).then(profilePictureUrl => {
      let dto = this.props.rfn;
      dto = {
        ...dto,
        profilePictureUrl : profilePictureUrl
      };

      this.props.dispatch(rfnProfileActions.put(dto));

      const { rfn } = {...this.state};
      rfn.profilePictureUrl = profilePictureUrl;
      this.setState({ rfn });
    })
    .catch(e => {
      console.log(e);
    })
  }

  handleSkypeIdChange = (e) => {
    const { rfn } = {...this.state};
    rfn.skypeId = e.target.value;
    this.setState({ rfn, invalidSkypeId: false });
  }

  render() {
    const { isFetching, rfn, rfnProfilePicture } = this.props;

    return (
      <div className={styles.paddingSides}>
        {!isFetching &&
        <div>
          <UploadPhoto photo={rfnProfilePicture} onUpload={this.handleUpload} theWidth="auto"/>
        <Form>
          <Form.Field>
            { this.state.disable ?
            <div className={styles.question}>
              <div>
                <div style={generalCss.displayGrid}>
                  <label>{intl.get("firstName")}</label>
                  <label className={styles.displayName}>{rfn.firstName}</label> 
                </div>
                <div style={generalCss.displayGrid}>
                  <label>{intl.get("lastName")}</label>
                  <label className={styles.displayName}>{rfn.lastName}</label> 
                </div>
                <div style={generalCss.displayGrid}>
                  <label>{intl.get("skypeId")}</label>
                  <label className={styles.displayName}>{rfn.skypeId != null ? rfn.skypeId : intl.get("skypeIdPlaceholder")}</label> 
                </div>
              </div>
              <div>
                <Form.Field control={Button}
                  style={buttonCss.edit}
                  onClick={this.handleClick.bind(this)}>
                  <Icon className={styles.btnIcon} name='pencil'/>
                  {intl.get("edit")}
                </Form.Field>
              </div>
            </div>
            :
            <div className={styles.question}>
              <div style={generalCss.width80Percent}>
                <div className={styles.questionField}>
                  <label>{intl.get("firstName")}</label>
                  <Form.Input type='text' name='firstName' defaultValue={rfn.firstName} onChange={this.handleFirstNameChange.bind(this)}/>
                </div>
                <div className={styles.questionField}>
                  <label>{intl.get("lastName")}</label>
                  <Form.Input type='text' name='lastName' defaultValue={rfn.lastName} onChange={this.handleLastNameChange.bind(this)}/>
                </div>
                <div className={styles.questionField}>
                  <label>{intl.get("skypeId")}</label>
                  <Form.Input type='text' name='skypeId' placeholder={intl.get("skypeIdPlaceholder")} defaultValue={rfn.skypeId} onChange={this.handleSkypeIdChange.bind(this)}/>
                  { this.state.invalidSkypeId &&
                    <Label error pointing style={errorCss.rfnErrorLabel} >{intl.get("validSkypeId")}</Label>
                  }
                </div>
              </div>
            </div>
            }
          </Form.Field>
          
          <Form.Field className={styles.skypeId}>
            { rfn.skypeId !== null ?
              <a href={"skype:" + rfn.skypeId + "?call"}><Icon style={buttonCss.skypeButton} name="skype"/>{intl.get("callRfn", {firstName: rfn.firstName, lastName:rfn.lastName})}</a> 
              :
              <span className={styles.disabledLink}><Icon style={buttonCss.skypeButton} name="skype"/>{intl.get("callRfn", {firstName: rfn.firstName, lastName:rfn.lastName})}</span>
            }
          </Form.Field>

          <Form.Field>
            <div className={styles.question}>
            <label>{intl.get("liveWithDemOrAlzLabel", {firstName: rfn.firstName, lastName: rfn.lastName} )}</label>
            <Button.Group>
              <Button
                basic={!(this.state.rfn.liveWithDemOrAlz !== null && !this.state.rfn.liveWithDemOrAlz)}
                style={buttonCss.no}
                onClick={() => {this.handleLiveWithDemoOrAlz(false)}}>
                {intl.get("no")}
              </Button>
              <Button
                basic={!(this.state.rfn.liveWithDemOrAlz !== null && this.state.rfn.liveWithDemOrAlz)}
                style={buttonCss.yes}
                onClick={() => {this.handleLiveWithDemoOrAlz(true)}}>
                {intl.get("yes")}
              </Button>
            </Button.Group>
            </div>
          </Form.Field>

          <Form.Field>
            <div className={styles.question}>
            <label>{intl.get("usedMobileDeviceLabel", {firstName: rfn.firstName, lastName: rfn.lastName} )}</label>
            <Button.Group>
              <Button
                basic={!(this.state.rfn.usedMobileDevice !== null && !this.state.rfn.usedMobileDevice)}
                style={buttonCss.no}
                onClick={() => {this.handleUsedMobileDevice(false)}}>
                {intl.get("no")}
              </Button>
              <Button
                basic={!(this.state.rfn.usedMobileDevice !== null && this.state.rfn.usedMobileDevice)}
                style={buttonCss.yes}
                onClick={() => {this.handleUsedMobileDevice(true)}}>
                {intl.get("yes")}
              </Button>
            </Button.Group>
            </div>
          </Form.Field>

          <Form.Field>
            <div className={styles.question}>
            <label>{intl.get("hearOrVisualDifficultiesLabel", {firstName: rfn.firstName, lastName: rfn.lastName} )}</label>
            <Button.Group>
              <Button
                basic={!(this.state.rfn.hearOrVisualDifficulties !== null && !this.state.rfn.hearOrVisualDifficulties)}
                style={buttonCss.no}
                onClick={() => {this.handleHearOrVisualDifficulties(false)}}>
                {intl.get("no")}
              </Button>
              <Button
                basic={!(this.state.rfn.hearOrVisualDifficulties !== null && this.state.rfn.hearOrVisualDifficulties)}
                style={buttonCss.yes}
                onClick={() => {this.handleHearOrVisualDifficulties(true)}}>
                {intl.get("yes")}
              </Button>
            </Button.Group>
            </div>
          </Form.Field>

          <Form.Field>
            <label>{intl.get("likesLabel", {firstName: rfn.firstName, lastName:rfn.lastName})}</label>
            <TextArea
              placeholder={intl.get("likesPlaceholder")}
              value={this.state.rfn.likes}
              onChange={(e, {value}) => this.handleLikesChange(value)}
              rows={4}
            />
          </Form.Field>

          <Form.Field>
            <label>{intl.get("dislikesLabel", {firstName: rfn.firstName, lastName:rfn.lastName})}</label>
            <TextArea
              placeholder={intl.get("likesPlaceholder")}
              value={this.state.rfn.dislikes}
              onChange={(e, {value}) => this.handleDislikesChange(value)}
              rows={4}
            />
          </Form.Field>

          <Form.Group>
            <div className={styles.alignRight}>
            <Form.Field
              control={Button}
              style={buttonCss.primary}
              type='submit'
              disabled = {JSON.stringify(this.state.rfn) === JSON.stringify(this.props.rfn)}
              onClick = {this.handleSubmit}
            >
              {intl.get("save")}
            </Form.Field>
            </div>
          </Form.Group>
        </Form>
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { fileReducer, localeReducer } = state;
  const { rfnProfilePicture } = fileReducer;
  const { lang } = localeReducer

  return {
    rfnProfilePicture,
    lang
  };
}

const composedResidentProfileForm = compose(withTracker , connect(mapStateToProps))(ResidentProfileForm);
export { composedResidentProfileForm as ResidentProfileForm };