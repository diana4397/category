import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { FETCH_Category,ADD_UPDATE_Category} from '../actions';
import { categorylistError,categorylistSuccess,addUpdatecategoryError,addUpdatecategorySuccess} from './actions';
import { list,addUpdate } from '../../services/category';
import { toastr } from 'react-redux-toastr';

/**FETCH CAR TYPE */
const requestCategoryListing = async data => await list(data);

function* CategoryListing({ payload }) {
    try {
        const { data, error, message,status } = yield call(
            requestCategoryListing,
            payload.category,
        );
        if (status) {
            yield put(categorylistSuccess(data));
        } else if (error) {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }

            if (error === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }
             else{
                yield put(categorylistError(error));
            }
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            } else{
                yield put(categorylistSuccess(data));
            }
        }
    } catch (error) {
        console.log('login error in user: ', error);
    }
}

export function* watchCategory() {
    yield takeEvery(FETCH_Category, CategoryListing);
}

const requestCategoryAddupdate = async data => await addUpdate(data);
function* addUpdateCategoryList({ payload }) {
    console.log("payload in sub",payload);
    try {
        const { error, message,status } = yield call(
            requestCategoryAddupdate,
            payload.category,
        );
        if (status) {
            payload.history.push('/app/category');
            yield put(addUpdatecategorySuccess(message));
        } else if (error) {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            }

            if (error === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            } else{
                yield put(addUpdatecategoryError(error));
            }
            toastr.error('Error', error);
        } else {
            if (message === 'Failed to authenticate token.') {
                localStorage.clear();
                window.location.href = "/user/login";
            } else{
                console.log('login failed :', message);
                yield put(addUpdatecategoryError(message));
            }
            
        }
    } catch (error) {
        console.log('login error in user: ', error);
    }
}
export function* watchAddUpdateCategory() {
    yield takeEvery(ADD_UPDATE_Category, addUpdateCategoryList);
}

/**ADD UPDATE CAR TYPE END*/


export default function* rootSaga() {
    yield all([fork(watchCategory),
        fork(watchAddUpdateCategory)
    ]);
}

