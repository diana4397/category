import { instance } from './init';

export const location = () => {
    return instance.post(`location/list`);
};

export const addEditLocation = data => {
    return instance.post(`location/add-update-location`, data);
};

export const getLocation = data => {
    return instance.post(`location/list`, data);
};

export const deleteLocation = data => {
    return instance.post(`location/change-status`, data);
};
