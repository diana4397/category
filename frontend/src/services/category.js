import { instance } from './init';

export const list = data => {
    return instance.post(`category/list`, data);
};

export const changeStatus = data => {
    return instance.post(`category/change-status`, data);
};

export const addUpdate = data => {
    return instance.post(`category/add-update`, data);
};

export const listContent = data => {
    return instance.post(`category/list-content`, data);
};

export const addUpdatecontent = data => {
    return instance.postFormData(`category/add-update-content`, data);
};


