import {Response} from 'node-fetch';

import {IData} from 'wlc-engine/modules/core';

const projectUrl = process.env.PROJECT_URL || 'https://qa-coretest.egamings.com';

export const testUser = {
    email: 'test@test.com',
    password: 'Test123!',
    firstName: 'John',
    lastName: 'Silver',
    currency: 'RUB',
    countryCode: 'rus',
};

export type TLoginResponse = Record<'cookie', string>;

export const fetch = require('node-fetch');

export const getRequestUrl = (request: string): string => {
    return projectUrl + request;
};

let cookieCache: string = '';
export const login = async (): Promise<TLoginResponse> => {
    if (cookieCache) {
        return {cookie: cookieCache};
    }

    let login = await loginRequest();

    if (login.status !== 200) {
        if (login.status !== 403) {
            login.json().then((response: IData) => console.warn(response));
        } else {
            const response = await createUser();
            if (response.status === 200) {
                login = await loginRequest();
            } else {
                response.json().then((response: IData) => console.warn(response));
            }
        }
    }

    cookieCache = login.headers.raw()['set-cookie'].map((entry: string) => {
        const parts = entry.split(';');
        return parts[0];
    }).join(';');

    return {
        cookie: cookieCache,
    };
};

export const logout = (): Promise<Response> => {
    cookieCache = '';
    return fetch(getRequestUrl('/api/v1/auth'), {
        method: 'DELETE',
    });
};

export const checkIfSuccess = (response: IData): void => {
    if (response.code !== 200) {
        throw response.errors;
    };
};

export const printWarn = (text: string): void => {
    console.warn('\x1b[31m%s\x1b[0m', `\n  WARN: ${text}`);
};

export const checkIfObject = (response: IData): void => {
    if (typeof response.data !== 'object'
        || Array.isArray(response.data)
        || response.data === null)
    {
        throw Error('response.data is not an object');
    };
};

export const fetchWithRetryNoAuth = async <T>(url: string, interfaceName: string, triesLeft = 3): Promise<T> => {
    const res = await fetch(url);

    if (res.status === 500 && triesLeft > 0) {
        return fetchWithRetryNoAuth(url, interfaceName, triesLeft - 1);
    } else {
        return res.json();
    }
};

const loginRequest = (): Promise<Response> => {
    return fetch(getRequestUrl('/api/v1/auth'), {
        method: 'PUT',
        body: JSON.stringify({
            login: testUser.email,
            password: testUser.password,
        }),
    });
};

const createUser = (): Promise<Response> => {
    return fetch(getRequestUrl('/api/v1/profiles'), {
        method: 'POST',
        body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
            passwordRepeat: testUser.password,
            currency: testUser.currency,
            countryCode: testUser.countryCode,
        }),
    });
};
