import { combineReducers } from 'redux';
import auth from './auth.js';
import chatroom from './chatroom';

const rootReducer = combineReducers({
    auth,
    chatroom,
})

export default rootReducer;