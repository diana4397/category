import axios from 'axios';
import { BASE_URL, HEADER_TOKEN } from '../constants/defaultValues';
import Auth from './auth';

// import {convertFormData} from "./Utils";

/**
 * @return AxiosInstance
 */
class AxiosInsClass {
    // transformFormData = (data, headers) => {
    //     try {
    //         if (headers.hasOwnProperty('Content-Type') && headers["Content-Type"] == 'multipart/form-data') {
    //             if ((typeof FormData !== 'undefined') && !(data instanceof FormData)) {
    //                 data = convertFormData(JSON.parse(data));
    //             }
    //         }
    //     } catch (e) {
    //         console.log('Error in transform Axios Request', e);
    //     }
    //     return data;
    // };

    buildRequest = config => {
        const request = axios.create(config);

        // request.interceptors.request.use(config => {
        //     console.log('REQ', config);
        //     // Not able to get File Object
        //     // config.transformRequest[1] = this.transformFormData;
        //     // Do something before request is sent
        //     return config;
        // }, error => {
        //     // Do something with request error
        //     return Promise.reject(error);
        // });

        request.interceptors.response.use(
            response => {
                // console.log(response);
                if (response.statusText !== 'OK') {
                    let error = { error: 'Something went wrong !' };
                    if (response.status === 401) {
                        error = { error: 'Unauthorised' };
                    }
                    return Promise.reject(error);
                }
                // Do something with response data
                return response;
            },
            error => {
                // Do something with response error
                return Promise.reject(error);
            },
        );

        return request;
    };

    request(config) {
        const tmpConfig = {
            baseURL: BASE_URL,
            withCredentials: false,
            responseType: 'json',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                [HEADER_TOKEN]: Auth().Token(),
            },
        };
        const merged = {
            ...tmpConfig,
            ...config,
        };

        return this.buildRequest(merged);
    }

    requestWithOutToken(config) {
        const tmpConfig = {
            baseURL: BASE_URL,
            withCredentials: false,
            responseType: 'json',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const merged = {
            ...tmpConfig,
            ...config,
        };

        return this.buildRequest(merged);
    }
}

/**
 *
 * @param config
 * @returns {AxiosInstance}
 * @constructor
 */
export const AxiosRaw = config =>
    new AxiosInsClass().requestWithOutToken(config);

/**
 *
 * @param config
 * @returns {AxiosInstance}
 */
export default config => new AxiosInsClass().request(config);
