import { instance } from './init';

export const settings = () => {
    return instance.get(`settings/list`);
};

export const addEditSettings = data => {
    return instance.post(`settings/add-update`, data);
};
