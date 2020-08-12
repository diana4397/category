import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const List = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './list')
);
const Create = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './create')
);
const Gogo = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Route
                exact
                path={`${match.url}/`}
                render={props => <List {...props} />}
            />
            <Route
                exact
                path={`${match.url}/edit/:id`}
                render={props => <Create {...props} />}
            />
            <Route
                exact
                path={`${match.url}/create`}
                render={props => <Create {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Gogo;
