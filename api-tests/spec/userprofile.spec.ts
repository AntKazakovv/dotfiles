import {
    fetch,
    getRequestUrl,
    login,
    logout,
    checkIfSuccess,
    TLoginResponse,
    testUser,
} from './helpers/global';

import {IUserProfile} from 'wlc-engine/modules/core';

describe('/api/v1/profiles', () => {
    const url = getRequestUrl('/api/v1/profiles');
    const interfaceName = 'IUserProfile';

    it('-> PATCH', async (): Promise<void> => {
        const headers: TLoginResponse = await login();

        await fetch(url, {
            headers,
            method: 'PATCH',
            body: JSON.stringify({
                password: testUser.password,
                newPassword: testUser.password,
                newPasswordRepeat: testUser.password,
            }),
        })
            .then((res: any) => res.json())
            .then(checkIfSuccess)
            .catch(fail)
            .finally(logout);
    });

    it('-> POST', async (): Promise<void> => {
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                login: 'randomTestLogin',
                password: testUser.password,
                passwordRepeat: testUser.password,
                currency: testUser.currency,
            }),
        })
            .then((res: any) => res.json())
            .then((response: any) => {
                if (response.code === 200) {
                    throw new Error('An existing user has been registered');
                }

                if (response.code !== 200 && !response?.errors?.login) {
                    throw new Error('Something wrong');
                }
            });
    });

    it('-> PUT', async (): Promise<void> => {
        const headers: TLoginResponse = await login();
        const userProfileChanges = JSON.stringify({
            login: 'testLogin',
            email: testUser.email,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            countryCode: testUser.countryCode,
            currency: testUser.currency,
            password: testUser.password,
            currentPassword: testUser.password,
            newPassword: testUser.password,
            newPasswordRepeat: testUser.password,
        });

        await fetch(url, {
            headers,
            method: 'PUT',
            body: userProfileChanges,
        })
            .then((res: any) => res.json())
            .then(checkIfSuccess)
            .catch(fail)
            .finally(logout);
    });

    it('-> GET', async (): Promise<void> => {
        const headers = await login();
        fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: {data: IUserProfile}) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then();
            });
    });
});
