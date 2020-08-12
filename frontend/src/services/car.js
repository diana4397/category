import { instance } from './init';

export const list = data => {
    return instance.post(`car/list`, data);
};

export const changeStatus = data => {
    return instance.post(`car/change-status`, data);
};

export const addUpdate = data => {
    return instance.postFormData(`car/add-update`, data);
};

export const getOdometerData = data => {
    return instance.get(`car/get-odometer-data`, data);
};
export const getAdvanceNotice = data => {
    return instance.get(`car/get-advance-notice-data`, data);
};
export const getLongestTrip = data => {
    return instance.get(`car/get-longest-trip-data`, data);
};
export const getShortesttrip = data => {
    return instance.get(`car/get-shortest-trip-data`, data);
};
export const carApproved = data => {
    return instance.post(`car/car-status`, data);
};



