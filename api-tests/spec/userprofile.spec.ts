import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

describe('/api/v1/profiles', () => {
    const url = getRequestUrl('/api/v1/profiles');
    const interfaceName = 'IUserProfile';

    it('-> IUserProfile', async (): Promise<void> => {
        const headers = await login();
        fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: {data: unknown}) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then();
            });
    });
});
