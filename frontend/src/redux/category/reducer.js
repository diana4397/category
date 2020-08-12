import {
    FETCH_Category,
    FETCH_Category_ERROR,
    FETCH_Category_SUCCESS,
    ADD_UPDATE_Category_ERROR,
    ADD_UPDATE_Category,
    ADD_UPDATE_Category_SUCCESS
} from '../actions';

const INIT_STATE = {
    category_list: [],
    error: "",
    Category_status_msg: ""
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_Category:
            return { ...state, loading: true };
        case FETCH_Category_SUCCESS:
            return { ...state, loading: false, category_list: action.payload };
        case FETCH_Category_ERROR:
            return { ...state, loading: false, category_list: "", error: action.payload };
        case ADD_UPDATE_Category_ERROR:
            return { ...state, loading: false, error: action.payload };
        case ADD_UPDATE_Category:
            return { ...state, loading: true };
        case ADD_UPDATE_Category_SUCCESS:
            return { ...state, loading: false, Category_status_msg: action.payload };
        default:
            return { ...state };
    }
}