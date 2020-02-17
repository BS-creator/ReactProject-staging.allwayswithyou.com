import React, { Component } from 'react';
import { convertTime, format24HoursSleepData } from '../../../helpers/methods';
import sleepLogo from '../../../resources/images/total-sleep.png';
import waitingLogo from '../../../resources/images/illustration-waiting-data.png';
import styles from './HorizontalBarChart.scss';
import intl from 'react-intl-universal';
import HSBar from "react-horizontal-stacked-bar-chart";
import { Image, Popup } from 'semantic-ui-react';
import moment from 'moment';

class HorizontalBarChart extends Component {
  render() {
      const { last24HoursSleepReport } = this.props;
      let formated24HoursData = last24HoursSleepReport && format24HoursSleepData(last24HoursSleepReport);

    return(
      <div>
        <div className={[styles.marginBottom, styles.bold, styles.marginLeft20].join(' ')}>{intl.get('last24Hours')}</div>
        {formated24HoursData ?
          <div>
            <div className={[styles.floatLeft, styles.marginRight15].join(' ')}><Image src={sleepLogo} /></div>
            <div >
              <div className={styles.averageTime}>
                {last24HoursSleepReport && convertTime(last24HoursSleepReport.durationInSeconds)}
              </div>
              <div className={styles.averageText}>
                {intl.get('totalSleep')}
              </div>
            </div>
            <div className={[styles.paddingRight, styles.marginTop57].join(' ')}>
              <Popup content= {``} trigger={
              <div>
                {formated24HoursData && formated24HoursData.map(format24HoursSleepDataElement => {
                return <HSBar height={30} data={format24HoursSleepDataElement.formatedSleeps} />
              })}
              </div>}>
                <div style={{ color: '#A6CE39' }}>{intl.get('REM')}: {last24HoursSleepReport && convertTime(last24HoursSleepReport.remSleepDurationInSeconds)}</div>
                <div style={{ color: '#6950A1' }}>{intl.get('deep')}: {last24HoursSleepReport && convertTime(last24HoursSleepReport.deepSleepDurationInSeconds)}</div>
                <div style={{ color: '#51BF9D' }}>{intl.get('light')}: {last24HoursSleepReport && convertTime(last24HoursSleepReport.lightSleepDurationInSeconds)}</div>
                <div style={{ color: '#1B75BC' }}>{intl.get('awake')}: {last24HoursSleepReport && convertTime(last24HoursSleepReport.awakeDurationInSeconds)}</div>
              </Popup>
              <div className={[styles.displayInlineBlock, styles.widthMax].join(' ')}>
                <div className={styles.displayInlineBlock}>{last24HoursSleepReport && moment.unix(last24HoursSleepReport.sleeps[0].startTimeInSeconds).format("HH:mm")}</div>
                <div className={[styles.displayInlineBlock, styles.floatRight].join(' ')}>{last24HoursSleepReport && moment.unix(last24HoursSleepReport.sleeps[last24HoursSleepReport.sleeps.length - 1 ].endTimeInSeconds).format("HH:mm")}</div>
              </div>
              <div className={styles.legend}>
                <div style={{ backgroundColor: '#A6CE39' }} className={[styles.displayInlineBlock, styles.rect14].join(' ')}></div> <div className={[styles.displayInlineBlock, styles.marginRight10].join(' ')}>{intl.get('REM')}</div>
                <div style={{ backgroundColor: '#6950A1' }} className={[styles.displayInlineBlock, styles.rect14].join(' ')}></div> <div className={[styles.displayInlineBlock, styles.marginRight10].join(' ')}>{intl.get('deep')}</div>
                <div style={{ backgroundColor: '#51BF9D' }} className={[styles.displayInlineBlock, styles.rect14].join(' ')}></div> <div className={[styles.displayInlineBlock, styles.marginRight10].join(' ')}>{intl.get('light')}</div>
                <div style={{ backgroundColor: '#1B75BC' }} className={[styles.displayInlineBlock, styles.rect14].join(' ')}></div> <div className={[styles.displayInlineBlock, styles.marginRight10].join(' ')}>{intl.get('awake')}</div>
              </div>
            </div>
          </div>
          :
          <div>
            <div className={styles.marginTop}><Image className={styles.marginAuto} src={waitingLogo} /></div>
            <div className={styles.waitingDataText}>{intl.get('waitingData')}</div>
          </div>
        }
      </div>
    )
  }
}

export { HorizontalBarChart };