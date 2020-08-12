import {
    CHANGE_USER_STATUS,
    CHANGE_USER_STATUS_SUCCESS,
    USERS_LISTING,
    USERS_LISTING_SUCCESS,
    ADD_UPDATE_ADMIN_PROFILE_SUCCESS,
    ADD_UPDATE_ADMIN_PROFILE,
    FETCH_ADMIN_PROFILE,
    FETCH_ADMIN_PROFILE_SUCCESS
} from '../actions';

const INIT_STATE = {
    usersList: [],
    loading: false,
    user: {},
    data: "",
    profile: {},
    profile_msg: "",
    transaction_data: [],
    payment_msg: "",
    payment_status: false,
    dashboard_data: {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case USERS_LISTING:
            return { ...state, loading: true };
        case USERS_LISTING_SUCCESS:
            return { ...state, loading: false, usersList: action.payload };
        case CHANGE_USER_STATUS:
            return { ...state, loading: true };
        case CHANGE_USER_STATUS_SUCCESS:
            return { ...state, loading: false, user: action.payload };
        case FETCH_ADMIN_PROFILE:
            return { ...state, loading: true };
        case FETCH_ADMIN_PROFILE_SUCCESS:
            return { ...state, loading: false, profile: action.payload };
        case ADD_UPDATE_ADMIN_PROFILE:
            return { ...state, loading: true };
        case ADD_UPDATE_ADMIN_PROFILE_SUCCESS:
            return { ...state, loading: false, profile: action.payload.data, profile_msg: action.payload.message };
        default:
            return { ...state };
    }
}