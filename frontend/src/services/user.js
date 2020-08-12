import { instance } from './init';

export const login = data => {
    return instance.post(`user/login`, data);
};

export const register = data => {
    return instance.post(`user/register`, data);
};

export const google = data => {
    return instance.post(`user/google`, data);
};

export const changeUserStatus = data => {
    return instance.post(`user/change-user-status`, data);
};

export const users = data => {
    return instance.get(`user/get-users`, data);
};

export const adminProfile = data => {
    return instance.post(`user/get-profile`, data);
};

export const updateadminProfile = data => {
    return instance.post(`user/update`, data);
};

export const AdminforgotPassword = data =>{
    return instance.post(`user/forgot-password`,data);
}

export const changePassword = data =>{
    return instance.post(`user/change-password`,data);
}

export const transactionHistory = data =>{
    return instance.post(`user/get-payment-transaction-history`,data);
}

export const addHostPayment = data =>{
    return instance.post(`user/add-host-payment`,data);
}

export const getdashboard = data =>{
    return instance.post(`user/get-dashboard-data`,data);
}

