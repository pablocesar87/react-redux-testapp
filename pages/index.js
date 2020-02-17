import React from 'react';

import { connect } from 'react-redux';

import configureStore from '@store/store';

import Home from '@routes/Home/containers/Home';

class HomePage extends React.Component {
  static getInitialProps() {
    return {};
  }

  render() {
    return (
      <Home />
    );
  }
}

export default connect(configureStore)(HomePage);
