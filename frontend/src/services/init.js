import { BASE_URL, HEADER_TOKEN } from '../constants/defaultValues';
import Auth from '../helpers/auth';

const headers = () => {
    return {
        'Content-Type': 'application/json',
        [HEADER_TOKEN]: Auth().Token(),
    };
};

export const instance = {
    post: async (url, data) => {
        let options = {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(data),
        };
        return fetch(`${BASE_URL}${url}`, options)
            .then(response => {
                return response.json();
            })
            .then(resJson => {
                return resJson;
            });
    },
    put: async (url, data) => {
        let options = {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(data),
        };

        return fetch(`${BASE_URL}${url}`, options)
            .then(response => {
                return response.json();
            })
            .then(resJson => {
                return resJson;
            });
    },
    get: async (url, query) => {
        let options = {
            method: 'GET',
            headers: headers(),
        };
        return fetch(`${BASE_URL}${url}`, options)
            .then(response => {
                return response.json();
            })
            .then(resJson => {
                return resJson;
            });
    },
    delete: async (url, query) => {
        let options = {
            method: 'DELETE',
            headers: headers(),
        };

        return fetch(`${BASE_URL}${url}`, options)
            .then(response => {
                return response.json();
            })
            .then(resJson => {
                return resJson;
            });
    },
    postFormData: async (url, data) => {
        let options = {
            method: 'POST',
            headers: { [HEADER_TOKEN]: Auth().Token() },
            body: data,
        };
        return fetch(`${BASE_URL}${url}`, options)
            .then(response => {
                return response.json();
            })
            .then(resJson => {
                return resJson;
            });
    },
};
