import { instance } from './init';

export const cms = () => {
    return instance.post(`cms/list`);
};

export const addEditCms = data => {
    return instance.post(`cms/add_update`, data);
};

export const getCms = data => {
    return instance.post(`cms/detail`, data);
};
