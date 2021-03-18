import { StarRateTwoTone } from '@material-ui/icons';
import {
    CREATE_CHATROOM_SUCCESS,
    CREATE_CHATROOM_FAIL,
    JOIN_CHATROOM_SUCCESS,
    JOIN_CHATROOM_FAIL,
    DELETE_CHATROOMS_SUCCESS,
    DELETE_CHATROOMS_FAIL
} from '../actions/types.js';

const initialState = {
    chatRoomFound: false,
    message: ""
}

export default function chatroom(state = initialState, action) {
    switch (action.type) {
        case CREATE_CHATROOM_SUCCESS:
            return {
                ...state,
                chatRoomFound: true,
            }
        case CREATE_CHATROOM_FAIL:
            return {
                ...state,
                chatRoomFound: false,
            }
        case JOIN_CHATROOM_SUCCESS:
            return {
                ...state,
                chatRoomFound: true,
            }
        case JOIN_CHATROOM_FAIL:
            return {
                ...state,
                chatRoomFound: false,
            }
        case DELETE_CHATROOMS_SUCCESS:
            return {
                ...state,
                message: action.payload
            }
        case DELETE_CHATROOMS_FAIL:
            return {
                ...state,
                message: ""
            }
        default:
            return state;
    }
}