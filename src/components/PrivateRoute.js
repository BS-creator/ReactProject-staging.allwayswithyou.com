import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        props.condition
            ? <Component {...props} />
            : <Redirect to={{ pathname: props.redirectPathname, state: { from: props.location } }} />
    )} />
)
