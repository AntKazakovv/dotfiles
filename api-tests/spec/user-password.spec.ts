import {
    fetch,
    getRequestUrl,
    logout,
    login,
    TLoginResponse,
    testUser,
    checkIfSuccess,
} from './helpers/global';

describe('/api/v1/user/userPassword', () => {
    const url = getRequestUrl('/api/v1/userPassword');

    it('-> PATCH success (newPassword)', async (): Promise<void> => {
        const headers: TLoginResponse = await login();

        await fetch(url, {
            headers,
            method: 'PATCH',
            body: JSON.stringify({
                password: testUser.password,
                newPassword: testUser.password,
            }),
        })
            .then((res: any) => res.json())
            .then(checkIfSuccess)
            .catch(fail)
            .finally(logout);
    });

    it('-> PATCH invalid password (newPassword)', async (): Promise<void> => {
        const headers: TLoginResponse = await login();

        await fetch(url, {
            headers,
            method: 'PATCH',
            body: JSON.stringify({
                password: 'invalidPassword',
                newPassword: testUser.password,
            }),
        })
            .then((res: any) => res.json())
            .then((resJson: {code: number}) => expect(resJson.code).toEqual(400))
            .catch(fail)
            .finally(logout);
    });

    it('-> PATCH Must login (newPassword)', async (): Promise<void> => {

        await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                password: testUser.password,
                newPassword: testUser.password,
            }),
        })
            .then((res: any) => res.json())
            .then((resJson: {code: number}) => expect(resJson.code).toEqual(401))
            .catch(fail);
    });

    it('-> POST success (passwordRestore - recovery link to email)', async (): Promise<void> => {

        await fetch(url, {method: 'POST'})
            .then((res: any) => res.json())
            .then(checkIfSuccess)
            .catch(fail);
    });
});
