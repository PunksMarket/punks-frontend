import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const DiscoverPage = React.lazy(() =>
  import(/* webpackChunkName: "discover-page" */ './discover')
);
const CollectionsPage = React.lazy(() =>
  import(/* webpackChunkName: "discover-page" */ './collections')
);
const Assets = React.lazy(() =>
  import(/* webpackChunkName: "register-page" */ './assets/index')
);
const ChainDiscover = React.lazy(() =>
  import(/* webpackChunkName: "register-page" */ './chaindiscover')
);

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/collections`} />
              <Route
                path={`${match.url}/collections`}
                render={props => <CollectionsPage {...props} />}
              />
              <Route
                path={`${match.url}/assets`}
                render={props => <Assets {...props} />}
              />
              <Route
                path={`${match.url}/chain-discover`}
                render={props => <ChainDiscover {...props} />}
              />
              <Route
                path={`${match.url}/collection/:id/:mode`}
                render={props => <DiscoverPage {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
