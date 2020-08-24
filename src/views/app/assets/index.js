import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MyCollectionsPage = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './my-collections')
);
const NewCardPage = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-content" */ './new-card')
);
const MyCardsPage = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-content" */ './my-cards')
);
const TransactionPage = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-content" */ './transactions')
);

const Register = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/new-collection`} />
      <Route
        path={`${match.url}/new-card`}
        render={props => <NewCardPage {...props} />}
      />
      <Route
        path={`${match.url}/my-collections`}
        render={props => <MyCollectionsPage {...props} />}
      />
      <Route
        path={`${match.url}/my-cards`}
        render={props => <MyCardsPage {...props} />}
      />
      <Route
        path={`${match.url}/transactions`}
        render={props => <TransactionPage {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Register;
