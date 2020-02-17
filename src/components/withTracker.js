import React, { Component } from 'react';
import ReactGA from 'react-ga';

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = (page) => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      const { page } = this.props;
      trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.page;
      const nextPage = nextProps.page;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}

export { withTracker }