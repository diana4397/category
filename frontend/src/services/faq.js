import { instance } from './init';

export const list = data => {
    return instance.post(`faq/list`, data);
};

export const changeStatus = data => {
    return instance.post(`faq/change-status`, data);
};

export const addUpdate = data => {
    return instance.post(`faq/add-update`, data);
};


