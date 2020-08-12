import { instance } from './init';

export const message = () => {
    return instance.get(`message/list`);
};

export const addMessage = data => {
    return instance.post(`message/add-message`, data);
};
