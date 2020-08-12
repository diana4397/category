import {
    FETCH_CONTENT,
    FETCH_CONTENT_SUCCESS,
    ADD_UPDATE_CONTENT,
    ADD_UPDATE_CONTENT_SUCCESS
} from '../actions';

export const content = content => ({
    type: FETCH_CONTENT,
    payload: { content },
});

export const contentSuccess = content => ({
    type: FETCH_CONTENT_SUCCESS,
    payload: content,
});

export const addEditcontent = (content, history) => ({
    type: ADD_UPDATE_CONTENT,
    payload: { content, history },
});

export const addEditcontentSuccess = data => ({
    type: ADD_UPDATE_CONTENT_SUCCESS,
    payload: data,
});
