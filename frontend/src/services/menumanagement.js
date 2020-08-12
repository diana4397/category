import { instance } from './init';

export const menuListing = data => {
    return instance.get(`menu/get-all-menus`, data);
};