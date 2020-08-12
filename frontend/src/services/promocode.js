import { instance } from './init';

export const list = data => {
    return instance.post(`promocode/list`, data);
};

export const changeStatus = data => {
    return instance.post(`promocode/change-status`, data);
};

export const addUpdate = data => {
    return instance.post(`promocode/add-update`, data);
};


