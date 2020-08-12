import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { CHANGE_USER_STATUS, USERS_LISTING, FETCH_ADMIN_PROFILE, ADD_UPDATE_ADMIN_PROFILE,} from '../actions';
import { changeUserStatusSuccess, usersListSuccess, addUpdateAdminProfileSuccess, adminProfileSuccess,} from './actions';
import { changeUserStatus, users, adminProfile, updateadminProfile} from '../../services/user';

import { toastr } from 'react-redux-toastr';

const requestusersListing = async data => await users(data);
function* usersListing({ payload }) {
    try {
        const { data, error, message } = yield call(
            requestusersListing,
            payload.usersList,
        );
        if (data.length > 0) {
            yield put(usersListSuccess(data.reverse()));
        } else if (error) {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }

            if (error === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
            toastr.error('Error', error);
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            } else {
                yield put(usersListSuccess(data));
            }
            console.log('login failed :', message.substring(7));
        }
    } catch (error) {
        console.log('login error in user: ', error);
    }
}
export function* watchUsers() {
    yield takeEvery(USERS_LISTING, usersListing);
}

const requestChangeUserStatus = async user => await changeUserStatus(user);

function* changeUserStatusAction({ payload }) {
    const { user, history } = payload;

    try {
        const { message, error, status } = yield call(
            requestChangeUserStatus,
            user,
        );
        console.log("status", status)
        if (status) {
            yield put(changeUserStatusSuccess({ message }));
            history.push(`/app/user`);
        } else if (error) {
            if (error.message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
            yield put(changeUserStatusSuccess({}));
            toastr.error(error.message);
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
            toastr.error(message.substring(7));
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        toastr.error('404 NOT FOUND.');
        history.push(`/app/users`);
    }
}
export function* watchChangeUserStatus() {
    yield takeEvery(CHANGE_USER_STATUS, changeUserStatusAction);
}

const requestAdminProfileListing = async data => await adminProfile(data);
function* adminProfileListing({ payload }) {
    try {
        const { data, error, message } = yield call(
            requestAdminProfileListing,
            payload.usersList,
        );
        if (data.length > 0) {
            yield put(adminProfileSuccess(data));
        } else if (error) {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }

            if (error === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
            toastr.error('Error', error);
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            } else {
                yield put(adminProfileSuccess(data));
            }
            console.log('login failed :', message.substring(7));
        }
    } catch (error) {
        console.log('login error in user: ', error);
    }
}
export function* watchAdminProfile() {
    yield takeEvery(FETCH_ADMIN_PROFILE, adminProfileListing);
}

// Update Admin Profile

const requestAdminProfileUpdate = async data => await updateadminProfile(data);
function* adminProfileUpdate({ payload }) {
    try {
        const response = yield call(
            requestAdminProfileUpdate,
            payload.usersList,
        );
        console.log("response",response)
        if (response.status) {
            localStorage.setItem('user', JSON.stringify(response.user));
            yield put(addUpdateAdminProfileSuccess(response));
            
        } else if (response.error) {
            if (response.message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }

            if (response.error === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
            toastr.error('Error', response.error);
        } else {
            if (response.message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            } else {
                yield put(addUpdateAdminProfileSuccess(response));
            }
            console.log('login failed :',response.message.substring(7));
        }
    } catch (error) {
        console.log('login error in user: ', error);
    }
}
export function* watchAdminProfileUpdate() {
    yield takeEvery(ADD_UPDATE_ADMIN_PROFILE, adminProfileUpdate);
}









export default function* rootSaga() {
    yield all([
        fork(watchUsers),
        fork(watchChangeUserStatus),
        fork(watchAdminProfile),
        fork(watchAdminProfileUpdate),
    ]);
}


