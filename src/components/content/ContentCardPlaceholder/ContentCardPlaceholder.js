import React, { Component } from 'react';
import styles from './ContentCardPlaceholder.scss';

class ContentCardPlaceholder extends Component {

    render() {

        const {width, height} = this.props;

        return (
            <div style={{ width : width ? width : '100%', height : height }} className={styles.rootBlock}></div>
        );
    }
}

export { ContentCardPlaceholder };