import axios from 'axios';

import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from './types';

const domain = 'http://localhost:8080'

export const login = (username, password) => async dispatch => {
    try {
        const res = await axios.post(`${domain}/api/user/login/`, {
            "username": username,
            "password": password
        });
        if (res.status === 200) {
            await localStorage.setItem('token', res.data.token);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
                username: username,
            });
        }
    }
    catch(e) {
        dispatch({
            type: LOGIN_FAIL,
            error: e.response
        });
    }
}


export const getUser = () => (dispatch) => {
    const token = getToken();

    axios.get(`${domain}/api/user/me/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: GET_USER_SUCCESS,
            payload: res.data,
        });
    }).catch((e) => {
        dispatch({
            type: GET_USER_FAIL,
            error: e.response
        });
    });
}


export const logout = () => dispatch => {
    const token = getToken();
    localStorage.clear();

    axios.post(`${domain}/api/user/logout/`, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        if (res.status === 200) {
            dispatch({
                type: LOGOUT_SUCCESS,
                payload: res.data
            });

            localStorage.removeItem('token');
        }
    }).catch((e) => {
        alert('Logout unsuccessful.')
    });
}

export const register = (email, username, password) => dispatch => {
    axios.post(`${domain}/api/user/register/`, {
        "username": username,
        "email": email,
        "password": password
    }).then((res) => {
        localStorage.setItem('token', res.data.token);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    }).catch((e) => {
        dispatch({
            type: REGISTER_FAIL,
            error: e.response.data.error
        });
    });
}

export const getToken = () => {
    return localStorage.getItem('token');
}