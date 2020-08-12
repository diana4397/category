import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { FETCH_CONTENT, ADD_UPDATE_CONTENT } from '../actions';
import {
    contentSuccess,
    addEditcontentSuccess
} from './actions';
import { toastr } from 'react-redux-toastr';
import _ from 'lodash';
import { listContent,addUpdatecontent } from '../../services/category';

const contentListingRequest = async (data) => await listContent(data);

function* contentListing({ payload }) {

    console.log("payload",payload);
    try {
        const { data, error, message } = yield call(contentListingRequest,payload.content);
        if (data) {
            yield put(contentSuccess(data.reverse()));
        } else if (error) {
            toastr.error('Error', error);
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
            console.log('login failed :', message);
        }
    } catch (error) {
        console.log('login error : ', error);
    }
}

export function* watchContent() {
    yield takeEvery(FETCH_CONTENT, contentListing);
}

//ADD CMS
export function* watchAddEditContent() {
    yield takeEvery(ADD_UPDATE_CONTENT, addContentAction);
}

const requestAddContent = async content => await addUpdatecontent(content);

function* addContentAction({ payload }) {
    const { history } = payload;

    try {
        const { message, errors } = yield call(requestAddContent, payload.content);
        if (message) {
            yield put(addEditcontentSuccess({}));
            toastr.success(message);
            history.push(`/app/content`);
        } else if (errors) {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                history.push('/user/login');
            }
            yield put(addEditcontentSuccess({}));
            toastr.error(errors.message);
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                history.push('/user/login');
            }
            toastr.error(message.substring(7));
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        toastr.error('404 NOT FOUND.');
        history.push(`/app/content`);
    }
}



export default function* rootSaga() {
    yield all([
        fork(watchContent),
        fork(watchAddEditContent)
    ]);
}
