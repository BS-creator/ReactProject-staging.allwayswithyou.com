import React, { Component } from 'react';
import { Tooltip, Legend, BarChart, Bar, XAxis,   ResponsiveContainer } from 'recharts';
import { Image, Popup } from 'semantic-ui-react';
import styles from './ContentViewComponent.scss';
import intl from 'react-intl-universal';
import contentTime from '../../../resources/images/content-time.png';
import waitingLogo from '../../../resources/images/illustration-waiting-data.png';
import { Table } from 'semantic-ui-react';
import { cutLongString, formatContentViewDataForDiagram, cutLongName } from '../../../helpers/methods';

class ContentViewComponent extends Component{

  render() {
    const { data, text, totalViewTime, showTable } = this.props;
    return(
      <div className={[styles.fontRoboto, styles.positionRelative].join(' ')}>
        <div className={[styles.marginBottom, styles.bold, styles.marginLeft20].join(' ')}>{text}</div>
        {data && data.length === 0 ?
        <div>
          <div className={styles.marginTop}><Image className={styles.marginAuto} src={waitingLogo} /></div>
          <div className={styles.waitingDataText}>{intl.get('waitingData')}</div>
        </div>
        :
        <div>
          <div className={styles.marginLeft20}>
            <div className={[styles.floatLeft, styles.marginRight15].join(' ')}><Image src={contentTime} /></div>
            <div >
              <div className={styles.averageTime}>
                {totalViewTime}
              </div>
              <div className={styles.averageText}>
                {intl.get('totalTime')}
              </div>
            </div>
          </div>
            <div>
              { showTable ?
              <Table unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className={[styles.tableHeader, styles.cellStyle]}>{cutLongString(intl.get("familyMember"))}</Table.HeaderCell>
                    <Table.HeaderCell className={[styles.tableHeader, styles.cellStyle]}>{cutLongString(intl.get("photos"))}</Table.HeaderCell>
                    <Table.HeaderCell className={[styles.tableHeader, styles.cellStyle]}>{cutLongString(intl.get("videos"))}</Table.HeaderCell>
                    <Table.HeaderCell className={[styles.tableHeader, styles.cellStyle]}>{cutLongString(intl.get("audios"))}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    data.map((x, index) => {
                      return (
                        <Table.Row key={index}>
                          {x.displayName.length > 7 ? <Popup content={x.displayName} trigger={<Table.Cell className={styles.cellStyle}>{cutLongName(x.displayName)}</Table.Cell>} /> : <Table.Cell className={styles.cellStyle}>{x.displayName}</Table.Cell>}
                          <Table.Cell className={styles.cellStyle}>{x[intl.get('photos')]}</Table.Cell>
                          <Table.Cell className={styles.cellStyle}>{x[intl.get('videos')]}</Table.Cell>
                          <Table.Cell className={styles.cellStyle}>{x[intl.get('audios')]}</Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
              :
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={formatContentViewDataForDiagram(JSON.parse(JSON.stringify(data)))}>
                  <XAxis dy={10} interval={0} angle={-45} dataKey="displayName" tickFormatter={label => cutLongString(label)} />
                  <Tooltip />
                  <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar dataKey={intl.get('photos')} barSize={15} stackId="v" fill="#6950a1" />
                  <Bar dataKey={intl.get('videos')} barSize={15} stackId="v" fill="#51bf9d" />
                  <Bar dataKey={intl.get('audios')} barSize={15} stackId="v" fill="#a6ce39" />
                </BarChart>
              </ResponsiveContainer>
              }
            </div>
        </div>
        }
      </div>
    )
  }
}

export { ContentViewComponent };