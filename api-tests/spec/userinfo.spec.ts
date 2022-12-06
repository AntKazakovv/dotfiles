import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

import {IUserInfo} from 'wlc-engine/modules/core';

describe('/api/v1/userInfo', () => {
    const url = getRequestUrl('/api/v1/userInfo?lang=en');
    const interfaceName = 'IUserInfo';

    it('-> IUserInfo', async (): Promise<void> => {
        const headers = await login();
        await fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: {data: IUserInfo}) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then();
            });
    });
});
