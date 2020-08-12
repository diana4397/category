import { instance } from './init';

export const rolelisting = data => {
    return instance.post(`role/get-roles`, data);
};
export const changestatus = data => {
    return instance.post(`role/change-role-status`, data);
};
export const addUpdateRole = data => {
    return instance.post(`role/add-update-role`, data);
};