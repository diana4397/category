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

export const usersList = usersList => ({
    type: USERS_LISTING,
    payload: { usersList },
});

export const usersListSuccess = usersList => ({
    type: USERS_LISTING_SUCCESS,
    payload: usersList,
});

export const changeUserStatus = (user, history) => ({
    type: CHANGE_USER_STATUS,
    payload: { user, history },
});

export const changeUserStatusSuccess = user => ({
    type: CHANGE_USER_STATUS_SUCCESS,
    payload: user,
});

export const adminProfile = usersList => ({
    type: FETCH_ADMIN_PROFILE,
    payload: { usersList },
});

export const adminProfileSuccess = usersList => ({
    type: FETCH_ADMIN_PROFILE_SUCCESS,
    payload: usersList,
});

export const addUpdateAdminProfile = (usersList,history) => ({
    type: ADD_UPDATE_ADMIN_PROFILE,
    payload: { usersList,history },
});

export const addUpdateAdminProfileSuccess = usersList => ({
    type: ADD_UPDATE_ADMIN_PROFILE_SUCCESS,
    payload: usersList,
});

