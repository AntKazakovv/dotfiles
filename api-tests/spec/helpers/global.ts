import {IData} from 'wlc-engine/modules/core';

const projectUrl = process.env.PROJECT_URL || 'https://test-devcasino.egamings.com';

export type TLoginResponse = Record<'cookie', string>

export const fetch = require('node-fetch');

export const getRequestUrl = (request: string): string => {
    return projectUrl + request;
};

export const login = async (): Promise<TLoginResponse> => {
    const login = await fetch(getRequestUrl('/api/v1/auth'), {
        method: 'PUT',
        body: JSON.stringify({
            login: 'test@test.com',
            password: 'Test123!',
        }),
    });

    const cookie: string = login.headers.raw()['set-cookie'].map((entry: string) => {
        const parts = entry.split(';');
        return parts[0];
    }).join(';');

    return {
        cookie,
    };
};

export const logout = () => {
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
