import { instance } from './init';

export const list = data => {
    return instance.post(`calculator/list`, data);
};

export const changeStatus = data => {
    return instance.post(`calculator/change-status`, data);
};

export const addUpdate = data => {
    return instance.post(`calculator/add-update`, data);
};

export const currencyCode = data => {
    return instance.get(`calculator/get-currency-code`, data);
};


