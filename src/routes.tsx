import React, { useContext, lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  COLLECTIONS,
  MY_COLLECTIONS, NEW_CARD,
} from 'settings/constants';
import AuthProvider, { AuthContext } from 'context/auth';
import { InLineLoader } from 'components/InlineLoader/InlineLoader';
const AdminLayout = lazy(() => import('containers/Layout/Layout'));
const NotFound = lazy(() => import('containers/NotFound/NotFound'));

const Collections = lazy(() => import('containers/Collections/Collections'));
const NewCollections = lazy(() => import('containers/NewCollections/NewCollections'));
const NewCard = lazy(() => import('containers/NewCardForm/NewCardForm'));

function PrivateRoute({ children, ...rest }) {
  const { address } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
          !!address ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Routes = () => {
  return (
      <>
        <AuthProvider>
          <Suspense fallback={<InLineLoader />}>
            <Switch>

              <PrivateRoute path={MY_COLLECTIONS}>
                <AdminLayout>
                  <Suspense fallback={<InLineLoader />}>
                    <NewCollections />
                  </Suspense>
                </AdminLayout>
              </PrivateRoute>

              <PrivateRoute path={NEW_CARD}>
                <AdminLayout>
                  <Suspense fallback={<InLineLoader />}>
                    <NewCard />
                  </Suspense>
                </AdminLayout>
              </PrivateRoute>

              <AdminLayout>
                <Route exact={true} path={COLLECTIONS}>
                  <Collections />
                </Route>
              </AdminLayout>
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </AuthProvider>
        </>
  );
};

export default Routes;
