import React from 'react';
import App, { Container } from 'next/app';
// eslint-disable-next-line no-unused-vars
import Router from 'next/router';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import cookie from 'cookie';

import configureStore from '@store/store';
import { getMe } from '@actions/auth';

import request from '@utils/request';

import Layout from '@common/containers/Layout';

class MyApp extends App {
  static async getInitialProps({
    Component,
    ctx,
  }) {
    const {
      req,
      res, // eslint-disable-line no-unused-vars
      isServer,
      store,
    } = ctx;

    if (req && isServer) {
      let token = null;

      if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);

        token = cookies.token || null;
      }

      if (token) {
        request.setAuthHeader(token);

        try {
          await store.dispatch(getMe());
        } catch (error) {
          request.clearAuthToken();
        }
      } else {
        request.clearAuthToken();
      }
    }

    // const userId = store.getState().auth.me.id;

    // if (Component.isAuthenticated && !userId) {
    //   if (isServer && res) {
    //     res.writeHead(302, {
    //       Location: '/login',
    //     });
    //     res.end();
    //     res.finished = true;
    //   } else {
    //     Router.replace('/login');
    //   }
    // }

    return {
      pageProps: {
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      },
      pathname: (req && req.url) || ctx.pathname,
    };
  }

  render() {
    const {
      Component,
      pageProps,
      store,
    } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(configureStore)(MyApp);
