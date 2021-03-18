import {
    CREATE_CHATROOM_SUCCESS,
    CREATE_CHATROOM_FAIL,
    JOIN_CHATROOM_SUCCESS,
    JOIN_CHATROOM_FAIL,
    DELETE_CHATROOMS_SUCCESS,
    DELETE_CHATROOMS_FAIL
} from './types';

import axios from 'axios';

const domain = 'http://localhost:8080'

export const createChatroom = (name) => async dispatch => {
    const token = getToken();

    axios.post(`${domain}/api/chatroom/create-chatroom/`, {
        name: name
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: CREATE_CHATROOM_SUCCESS,
        })
    }).catch((e) => {
        dispatch({
            type: CREATE_CHATROOM_FAIL,
        })
    })
}

export const joinChatroom = (name) => async dispatch => {
    const token = getToken();

    axios.post(`${domain}/api/chatroom/join-chatroom/`, {
        name: name
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: JOIN_CHATROOM_SUCCESS,
        })
    }).catch((e) => {
        dispatch({
            type: JOIN_CHATROOM_FAIL,
        })
    })
}

export const deleteAllChatrooms = () => async dispatch => {
    const token = getToken();

    axios.delete(`${domain}/api/chatroom/all-chatrooms/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: DELETE_CHATROOMS_SUCCESS,
            payload: res.data.message
        })
    }).catch((e) => {
        dispatch({
            type: DELETE_CHATROOMS_FAIL,
        })
    })
}


export const getToken = () => {
    return localStorage.getItem('token');
}