
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    SOCIAL_LOGIN_USER
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError,
    socialLoginError,
    socialLoginSuccess,
    forgotPasswordSuccess,
    forgotPasswordError,
    resetPasswordSuccess,
    resetPasswordError,
    changePasswordError,
    changePasswordSuccess
} from './actions';

import {
    login,
    AdminforgotPassword,
    changePassword,
    register,
    google
} from '../../services/user.js';
import { toastr } from 'react-redux-toastr';
import _ from 'lodash';
// import { BASE_URL } from '../../constants/defaultValues';
// import AxiosInsClass from "../../helpers/axios";


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password, user_type) =>
    await login({ email, password, user_type });


function* loginWithEmailPassword({ payload }) {
    console.log("payload============>",payload);
    const { email, password, user_type } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(
            loginWithEmailPasswordAsync,
            email,
            password,
            user_type,
        );
        let userData = loginUser && !_.isEmpty(loginUser.data);
        userData = userData && loginUser.data;
        // const response = loginUser.errors;
        console.log("login in saga",loginUser)
        if (userData && !userData.message) {
            console.log(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('user_id', userData._id);
            localStorage.setItem('token', JSON.stringify(loginUser.token));
            yield put(loginUserSuccess(userData));
            history.push('/')
            //toastr.success('Success', 'Login successfully.');
           
        } else {
            yield put(loginUserError(loginUser.errors[0].msg))
            // const message = response.message;
            // toastr.error('Error', loginUser.errors[0].msg);
            // console.log('login failed :', message);
        }
    } catch (error) {
        console.log('login error : ', error);
    }
}

export function* watchSocialLoginUser() {
    yield takeEvery(SOCIAL_LOGIN_USER, socialLogin);
}

const socialLoginAsync = async (data) =>
    await google(data);


function* socialLogin({ payload }) {
    const { history } = payload;
    try {
        const loginUser = yield call(
            socialLoginAsync,
            payload.user
        );
        let userData = loginUser && !_.isEmpty(loginUser.data);
        userData = userData && loginUser.data;
        // const response = loginUser.errors;
        console.log("login in saga",loginUser)
        if (userData && !userData.message) {
            console.log(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('user_id', JSON.stringify(userData._id));
            localStorage.setItem('token', JSON.stringify(loginUser.token));
            yield put(loginUserSuccess(userData));
            history.push('/')
            //toastr.success('Success', 'Login successfully.');
           
        } else {
            yield put(loginUserError(loginUser.errors[0].msg))
            // const message = response.message;
            // toastr.error('Error', loginUser.errors[0].msg);
            // console.log('login failed :', message);
        }
    } catch (error) {
        console.log('login error : ', error);
    }
}



export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (user) =>
    await register(user);

function* registerWithEmailPassword({ payload }) {
    console.log("payload==================>",payload)
    const { history } = payload
    try {
        const registerUser = yield call(registerWithEmailPasswordAsync,payload.user);
        console.log("register user========>",registerUser);
        if(registerUser.status){
            history.push('/user/login')
        } else{
            toastr.error('Error', 'Invalid credentials');
            yield put(registerUserError(registerUser));
        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
    await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
}

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem('user_id');
    } catch (error) {
    }
}

export function* watchForgotPassword() {
    yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const requestForgotPassword = async data => await AdminforgotPassword(data);


function* forgotPassword({ payload }) {
    try {
        const forgotPasswordStatus = yield call(requestForgotPassword, payload.forgotUserMail);
        if (forgotPasswordStatus.status) {
            yield put(forgotPasswordSuccess(forgotPasswordStatus.message));
        } else {
            yield put(forgotPasswordError(forgotPasswordStatus.message));
        }
    } catch (error) {
        yield put(forgotPasswordError(error));

    }
}


export function* watchResetPassword() {
    yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
    return await auth.confirmPasswordReset(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
}

function* resetPassword({ payload }) {
    const { newPassword, resetPasswordCode } = payload;
    try {
        const resetPasswordStatus = yield call(resetPasswordAsync, resetPasswordCode, newPassword);
        if (!resetPasswordStatus) {
            yield put(resetPasswordSuccess("success"));
        } else {
            yield put(resetPasswordError(resetPasswordStatus.message));
        }
    } catch (error) {
        yield put(resetPasswordError(error));

    }
}

export function* watchChangePassword() {
    yield takeEvery(CHANGE_PASSWORD, changePasswordAction);
}

const requestChangePassword = async category => await changePassword(category);

function* changePasswordAction({payload} ) {
    console.log("payload============> in chane",payload);
    const {  history } = payload;
    try {
        const {  message, errors,status } = yield call(
            requestChangePassword,
            payload.data,
        );
        if (status) {
            yield put(changePasswordSuccess(message));
        } else if (errors) {
            
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                history.push('/user/login');
            } else {
                yield put(changePasswordError(message));
            }
            
        } else {
            if (message === 'Failed to authenticate token.') {
                console.log("in here")
                localStorage.clear();
                window.location.href = "/user/login";
            } else{
                yield put(changePasswordError(message));
            }
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgotPassword),
        fork(watchResetPassword),
        fork(watchChangePassword),
        fork(watchSocialLoginUser)
    ]);
}