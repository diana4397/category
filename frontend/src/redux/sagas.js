import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import userSagas from './user/saga';
import contentSagas from './content/saga';
import category from './category/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    userSagas(),
    contentSagas(),
    category(),
  ]);
}
