import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Gogo = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './gogo')
);

const User = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './user')
);

const Content = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './content')
);


const Profile = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './profile')
);


const Category = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './category')
);

class App extends Component {
  render() {
    const { match } = this.props;
    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
              <Route
                path={`${match.url}/dashboard`}
                render={props => <Gogo {...props} />}
              />
              <Route
                path={`${match.url}/user`}
                render={props => <User {...props} />}
              />
              <Route
                path={`${match.url}/content`}
                render={props => <Content {...props} />}
              />
           
              <Route
                path={`${match.url}/category`}
                render={props => <Category {...props} />}
              />
              
              <Route
                path={`${match.url}/profile`}
                render={props => <Profile {...props} />}
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
