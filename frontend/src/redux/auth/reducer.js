import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_ERROR,
    CHANGE_PASSWORD_SUCCESS,
    SOCIAL_LOGIN_USER,
    SOCIAL_LOGIN_USER_SUCCESS,
    SOCIAL_LOGIN_USER_ERROR
} from '../actions';

const INIT_STATE = {
    user: localStorage.getItem('user_id'),
    forgotUserMail: '',
    newPassword: '',
    resetPasswordCode: '',
    loading: false,
    error: '',
    change_pwd: ""
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload._id, error: '' };
        case LOGIN_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case SOCIAL_LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case SOCIAL_LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload._id, error: '' };
        case SOCIAL_LOGIN_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case FORGOT_PASSWORD:
            return { ...state, loading: true, error: '' };
        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: false, forgotUserMail: action.payload, error: '' };
        case FORGOT_PASSWORD_ERROR:
            return { ...state, loading: false, forgotUserMail: '', error: action.payload.message };
        case RESET_PASSWORD:
            return { ...state, loading: true, error: '' };
        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, newPassword: action.payload, resetPasswordCode: '', error: '' };
        case RESET_PASSWORD_ERROR:
            return { ...state, loading: false, newPassword: '', resetPasswordCode: '', error: action.payload.message };
        case REGISTER_USER:
            return { ...state, loading: true, error: '' };
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload.uid, error: '' };
        case REGISTER_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case LOGOUT_USER:
            return { ...state, user: null, error: '' };
        case CHANGE_PASSWORD:
            return { ...state, loading: true, error: '' };
        case CHANGE_PASSWORD_SUCCESS:
            return { ...state, loading: false, change_pwd: action.payload, error: '' };
        case CHANGE_PASSWORD_ERROR:
            return { ...state, loading: false, change_pwd: '', error: action.payload.message };
        default: return { ...state };
    }
}
