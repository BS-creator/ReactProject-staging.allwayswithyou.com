import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTracker } from '../../components';
import { CustomMenu, VerticalBarChart, HorizontalBarChart, ContentViewComponent } from '../../components';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styles from './StatsPage.scss';
import { statsActions } from '../../actions/stats.actions';
import { Checkbox } from 'semantic-ui-react';
import { userSettingsActions, sleepActions, rfnProfileActions } from '../../actions';
import intl from 'react-intl-universal';
import moment from 'moment';
import { sumTime, formatContentViewData, calculateStartTimeForContentView } from '../../helpers/methods';

class StatsPage extends Component {

  constructor() {
    super();

    this.state = {
      showTable : false
    }
  }

  componentDidMount() {
      
    var end = new Date();
    
    this.props.dispatch(rfnProfileActions.get());
    this.props.dispatch(statsActions.get({ 
        start: calculateStartTimeForContentView('last24Hours').toISOString(), 
        end: end.toISOString(), 
        period: 'last24Hours'}));
    this.props.dispatch(statsActions.get({ 
        start: calculateStartTimeForContentView('last7Days').toISOString(),
        end: end.toISOString(), 
        period: 'last7Days'}));
    this.props.dispatch(statsActions.get({ 
        start: calculateStartTimeForContentView('last4Weeks').toISOString(), 
        end: end.toISOString(), 
        period: 'last4Weeks'}));
    this.props.dispatch(statsActions.get({ 
        start: calculateStartTimeForContentView('last6Months').toISOString(), 
        end: end.toISOString(), 
        period: 'last6Months'}));

    this.props.dispatch(statsActions.getUploadersStats({ 
        start: calculateStartTimeForContentView('last24Hours').toISOString(), 
        end: end.toISOString(), 
        period: 'last24Hours'}));
    this.props.dispatch(statsActions.getUploadersStats({ 
        start: calculateStartTimeForContentView('last7Days').toISOString(), 
        end: end.toISOString(), 
        period: 'last7Days'}));
    this.props.dispatch(statsActions.getUploadersStats({ 
        start: calculateStartTimeForContentView('last4Weeks').toISOString(), 
        end: end.toISOString(), 
        period: 'last4Weeks'}));
    this.props.dispatch(statsActions.getUploadersStats({ 
        start: calculateStartTimeForContentView('last6Months').toISOString(), 
        end: end.toISOString(), 
        period: 'last6Months'}));
    
    this.props.dispatch(userSettingsActions.get());

  }

  componentWillReceiveProps(nextProps) {

    if (this.props.rfn !== nextProps.rfn) {
        const { rfn } = nextProps;
        if(rfn && rfn.externalDataUsers && rfn.externalDataUsers.length > 0){
            this.props.dispatch(sleepActions.getLast24HoursSleepReport({calendarDate: moment().format('YYYY-MM-DD'), userId: rfn.externalDataUsers[0].userId}));
            this.props.dispatch(sleepActions.getSleepReport({periodUnit: 0, periodMeasure: 7, userId: rfn.externalDataUsers[0].userId }));
            this.props.dispatch(sleepActions.getSleepReport({periodUnit: 1, periodMeasure: 4, userId: rfn.externalDataUsers[0].userId }));
            this.props.dispatch(sleepActions.getSleepReport({periodUnit: 2, periodMeasure: 6, userId: rfn.externalDataUsers[0].userId }));
        }
        
    }

    if (this.props.lang !== nextProps.lang) {
        if (this.props.rfn !== nextProps.rfn) {
            const { rfn } = nextProps;
            if(rfn && rfn.externalDataUsers && rfn.externalDataUsers.length > 0){
                this.props.dispatch(sleepActions.getLast24HoursSleepReport({calendarDate: moment().format('YYYY-MM-DD'), userId: rfn.externalDataUsers[0].userId}));
                this.props.dispatch(sleepActions.getSleepReport({periodUnit: 0, periodMeasure: 7, userId: rfn.externalDataUsers[0].userId}));
                this.props.dispatch(sleepActions.getSleepReport({periodUnit: 1, periodMeasure: 4, userId: rfn.externalDataUsers[0].userId}));
                this.props.dispatch(sleepActions.getSleepReport({periodUnit: 2, periodMeasure: 6, userId: rfn.externalDataUsers[0].userId}));
            }
        }
    }
  }

  render() {
    const { 
      last24HoursSleepReport,
      last7DaysSleepReport,
      last4WeeksSleepReport,
      last6MonthSleepReport,
      uploadsForLast24Hours,
      uploadsForLast7Days, 
      uploadsForLast4Weeks, 
      uploadsForLast6Months,
      statsForLast24Hours,
      statsForLast7Days, 
      statsForLast4Weeks, 
      statsForLast6Months,
      rfn  } = this.props;

    return (
      <div>
        <CustomMenu />
            {rfn && rfn.externalDataUsers && rfn.externalDataUsers.length>0 ?
                <div>
                    <Grid>
                        <h1 className={styles.header}>{intl.get("totalSleepReport")}</h1>
                    </Grid>
                    <Grid>
                        <Row> 
                            <Col md={3} xs={12} className={styles.container}>
                            <HorizontalBarChart last24HoursSleepReport={last24HoursSleepReport} />
                            </Col>
                            <Col  md={3} xs={12} style={{padding: 10}} className={styles.container}>
                            {last7DaysSleepReport && <VerticalBarChart text={intl.get('last7Days')} data={last7DaysSleepReport} />}
                            </Col>
                            <Col  md={3} xs={12} style={{padding: 10}} className={styles.container}>
                            {last4WeeksSleepReport && <VerticalBarChart text={intl.get('last4Weeks')} data={last4WeeksSleepReport} />}
                            </Col>
                            <Col  md={3} xs={12} style={{padding: 10}} className={styles.container}>
                            {last6MonthSleepReport && <VerticalBarChart text={intl.get('last6Months')} data={last6MonthSleepReport} />}
                            </Col>
                        </Row>
                    </Grid>
                </div>
                :
                <Grid>
                    <h2>{intl.get("noServicesConnected")}</h2>
                </Grid>
                }
            <Grid>
              <h1 style={{ marginTop: 10 }} className={styles.header}>{intl.get("contentViewingTime")}</h1>
            </Grid>
            <Grid>
              <Row className={[styles.marginLeft20, styles.marginBottom10].join(' ')}>
                <Col>
                <Checkbox 
                  toggle 
                  label={intl.get("tableView")}
                  checked={this.state.showTable} 
                  onChange={ (e, data) => { this.setState({ showTable: data.checked }); }}
                  />
                </Col>
              </Row>
            </Grid>
            <Grid>
              <Row>
                <Col md={3} xs={12} className={styles.container}>
                  {statsForLast24Hours && uploadsForLast24Hours && <ContentViewComponent showTable={this.state.showTable} totalViewTime={sumTime(statsForLast24Hours)} data={formatContentViewData(JSON.parse(JSON.stringify(uploadsForLast24Hours)))} text={intl.get('last24Hours')} />}
                </Col>
                <Col md={3} xs={12} className={styles.container}>
                  {statsForLast7Days && uploadsForLast7Days && <ContentViewComponent showTable={this.state.showTable} totalViewTime={sumTime(statsForLast7Days)} data={formatContentViewData(JSON.parse(JSON.stringify(uploadsForLast7Days)))} text={intl.get('last7Days')} />}
                </Col>
                <Col md={3} xs={12} className={styles.container}>
                  {statsForLast4Weeks && uploadsForLast4Weeks && <ContentViewComponent showTable={this.state.showTable} totalViewTime={sumTime(statsForLast4Weeks)} data={formatContentViewData(JSON.parse(JSON.stringify(uploadsForLast4Weeks)))} text={intl.get('last4Weeks')} />}
                </Col>
                <Col md={3} xs={12} className={styles.container}>
                  {statsForLast6Months && uploadsForLast6Months && <ContentViewComponent showTable={this.state.showTable} totalViewTime={sumTime(statsForLast6Months)} data={formatContentViewData(JSON.parse(JSON.stringify(uploadsForLast6Months)))} text={intl.get('last6Months')} />}
                </Col>
              </Row>
            </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { report, userSettings, localeReducer, sleep, rfnProfile } = state;
  const { isFetching, stats, uploaders, uploadsForLast24Hours, uploadsForLast7Days, uploadsForLast4Weeks, uploadsForLast6Months, statsForLast24Hours, statsForLast7Days, statsForLast4Weeks, statsForLast6Months } = report;
  const { settings } = userSettings;
  const { lang } = localeReducer;
  const { isFetchingSleepReport, last24HoursSleepReport, last7DaysSleepReport, last4WeeksSleepReport, last6MonthSleepReport } = sleep;
  const { rfn } = rfnProfile;

  return {
    isFetching,
    stats,
    uploaders,
    settings,
    lang,
    isFetchingSleepReport,
    last24HoursSleepReport,
    last7DaysSleepReport,
    last4WeeksSleepReport,
    last6MonthSleepReport,
    uploadsForLast24Hours,
    uploadsForLast7Days, 
    uploadsForLast4Weeks, 
    uploadsForLast6Months,
    statsForLast24Hours,
    statsForLast7Days, 
    statsForLast4Weeks, 
    statsForLast6Months,
    rfn
  };
}

const composedStatsPage = compose(withTracker, connect(mapStateToProps))(StatsPage);
export { composedStatsPage as StatsPage };