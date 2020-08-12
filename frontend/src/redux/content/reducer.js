import {
    FETCH_CONTENT,
    FETCH_CONTENT_SUCCESS,
    ADD_UPDATE_CONTENT,
    ADD_UPDATE_CONTENT_SUCCESS
} from '../actions';

const INIT_STATE = {
    contentList: [],
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_CONTENT:
            return { ...state, loading: true };
        case FETCH_CONTENT_SUCCESS:
            return { ...state, loading: false, contentList: action.payload };
        case ADD_UPDATE_CONTENT:
            return { ...state, loading: true };
        case ADD_UPDATE_CONTENT_SUCCESS:
            return { ...state, loading: false, cms: action.payload };
        default:
            return { ...state };
    }
};
