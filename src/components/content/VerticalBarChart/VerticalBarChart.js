import React, { Component } from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatSleepData, convertTime } from '../../../helpers/methods';
import { Image, Popup } from 'semantic-ui-react';
import styles from './VerticalBarChart.scss';
import intl from 'react-intl-universal';
import sleepLogo from '../../../resources/images/total-sleep.png';
import alertLogo from '../../../resources/images/alert.png';
import waitingLogo from '../../../resources/images/illustration-waiting-data.png';

class CustomTooltip extends Component {

    chooseSleepType = (data) => {
        switch (data.dataKey) {
          case intl.get('REM'):
            return convertTime(data.payload[intl.get('REM')]);
          case intl.get('deep'):
            return convertTime(data.payload[intl.get('deep')]);
          case intl.get('light'):
            return convertTime(data.payload[intl.get('light')]);
          case intl.get('awake'):
            return convertTime(data.payload[intl.get('awake')]);
        }
    }
  
    render() {
      const { active } = this.props;
      let isWaitingData = true;
      if (active) {
        const { payload } = this.props;

        payload.forEach(element => {
          if(element.value !== 0) {
            isWaitingData = false
          }
        });

        return (
          <div className={styles.container}>
            {payload.map(element => {
                return (
                <div style={{ color: element.fill }}>{`${element.dataKey} : `}{isWaitingData ? <div>{intl.get('waitingData')}</div> : this.chooseSleepType(element)}</div>)
            })}
          </div>
        );
      }
      return null;
    }
};


class VerticalBarChart extends Component{

  render() {
    const { data, text } = this.props;
    return(
    <div className={[styles.fontRoboto, styles.positionRelative].join(' ')}>
      <div className={[styles.marginBottom, styles.bold, styles.marginLeft20].join(' ')}>{text}</div>
      {data ?
      <div>
        {data.warnings.length !==0 && <div className={styles.alertIcon}><Popup content={intl.get("lackOfSleep", {hours: convertTime(parseInt(data.warnings[0].description, 10))} )} inverted trigger={<Image src={alertLogo} />} /></div>}
        <div className={styles.marginLeft20}>
          <div className={[styles.floatLeft, styles.marginRight15].join(' ')}><Image src={sleepLogo} /></div>
          <div >
            <div className={styles.averageTime}>
              {convertTime(data.averageSleepDurationInSeconds)}
            </div>
            <div className={styles.averageText}>
              {intl.get('averageSleep')}
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formatSleepData(data.summaries)}>
            <XAxis dataKey="startDateTime"/>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey={intl.get('REM')} barSize={15} stackId="v" fill="#A6CE39" />
            <Bar dataKey={intl.get('deep')} barSize={15} stackId="v" fill="#6950A1" />
            <Bar dataKey={intl.get('light')} barSize={15} stackId="v" fill="#51BF9D" />
            <Bar dataKey={intl.get('awake')} barSize={15} stackId="v" fill="#1B75BC" />
          </BarChart>
        </ResponsiveContainer>
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

export { VerticalBarChart };