const projectUrl = process.env.PROJECT_URL || 'https://test-devcasino.egamings.com';

export const fetch = require('node-fetch');

export const getRequestUrl = (request: string): string => {
    return projectUrl + request;
};

export const login = async () => {
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
