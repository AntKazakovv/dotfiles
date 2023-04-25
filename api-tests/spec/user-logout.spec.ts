import {
    checkIfSuccess,
    logout,
} from './helpers/global';
import {Response} from 'node-fetch';

import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/auth userLogout', () => {

    it('-> Successful exit', async (): Promise<void> => {
        await logout()
            .then((res: Response) => res.json())
            .then((res: IData<any>) => {
                checkIfSuccess(res);
                expect(res.data.result?.loggedIn).toBe('0');
            })
            .catch(fail);
    });

    it('-> Check delete cookie', async (): Promise<void> => {
        const result: Response = await logout();
        const cookies: string[] = result.headers.raw()['set-cookie'].map((entry: string) => {
            const parts = entry.split(';');
            return parts[0];
        });

        if (!cookies.includes('rememberUser=deleted')) {
            fail('cookie not removed');
        }
    });
});
