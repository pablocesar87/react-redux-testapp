import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import '@styles/main.scss';

const Layout = ({ children }) => (
  <div>
    <div className="page-wrapper">
      <Head>
        <title key="title">Example Title</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1"
        />
        <meta
          name="format-detection"
          content="telephone=no"
        />
      </Head>
      <main>
        {children}
      </main>
    </div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
