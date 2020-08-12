import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Update = React.lazy(() =>
    import(/* webpackChunkName: "start" */ './update')
);
const Gogo = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Route
                exact
                path={`${match.url}/`}
                render={props => <Update {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Gogo;
