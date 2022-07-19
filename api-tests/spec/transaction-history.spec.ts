import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

import {ITransaction} from 'wlc-engine/modules/finances';
import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/transactions', () => {
    const url = getRequestUrl('/api/v1/transactions?');
    const interfaceName = 'ITransaction';

    it('-> ITransaction', async (done: DoneFn): Promise<void> => {
        const headers = await login();
        fetch(url, {headers})
            .then((res: Response) => res.json())
            .then((response: IData<ITransaction[]>) => {
                if (response.code !== 200) {
                    throw response.errors;
                }
                response.data?.forEach(element => {
                    expect(interfaceName).toBeImplemented(element);
                });
                if (response.data?.length === 0) {
                    console.warn('\x1b[31m%s\x1b[0m', '\n  WARN: Transaction history is empty');
                }
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then(done);
            });
    });
});
