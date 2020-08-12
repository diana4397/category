import { instance } from './init';

export const list = data => {
    return instance.post(`subadmin/list`, data);
};

export const changeSubadminStatus = data => {
    return instance.post(`subadmin/change-status`, data);
};

export const addUpdate = data => {
    return instance.post(`subadmin/add-update`, data);
};


