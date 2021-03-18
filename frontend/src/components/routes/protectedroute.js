import React, { useEffect } from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../actions/auth';

const ProtectedRoute = ({component: Component, ...params}) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => ({
        auth: state.auth,
    }));


    useEffect(() => {     
        if (!auth.isAuth || !auth.username) {
            dispatch(getUser());
        }
    });

    return (
    <Route
        {...params}
        render={props => {
            if (auth.isLoading) {
                return <h2>Loading...</h2>;
            } else if (!auth.isAuth && !localStorage.getItem('token')) {
                return <Redirect to="/login" />;
            } else {
                return <Component {...props} />;
            }
        }}
    />
    );
};

export default ProtectedRoute;