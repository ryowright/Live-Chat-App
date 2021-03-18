import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
} from '../actions/types.js';

const initialState = {
    isAuth: false,
    isRegistered: false,
    resetEmail: false,
    resetPassword: false,
    token: localStorage.getItem('token'),
    isLoading: false,
    username: null,
    error: null,
}

export default function auth(state = initialState, action) {
    switch (action.type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuth: true,
                isRegistered: true
            }
        case REGISTER_FAIL:
            return {
                ...state,
                error: action.error
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuth: true,
                username: action.username,
                token: action.payload.token
            };
        case GET_USER_SUCCESS:
            return {
                ...state,
                isAuth: true,
                username: action.payload.username,
            };
        case GET_USER_FAIL:
            return {
                ...state,
                error: action.error,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                error: action.error
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuth: false,
            };
        case PASSWORD_RESET_SUCCESS:
            return {
                ...state,
                error: null,
                resetPassword: true,
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                error: null,
                resetEmail: true,
            };
        case PASSWORD_RESET_FAIL:
        case FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                error: action.error,
            };

        case UPDATE_USER_SUCCESS:
            return {
                ...state,
            }

        case UPDATE_USER_FAIL:
            return {
                ...state,
                error: action.error,
            }

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isAuth: false,
            }
        
        case DELETE_USER_FAIL:
            return {
                ...state,
                error: action.error,
            }
        default:
            return state;
    }
}