import {IData} from 'wlc-engine/modules/core';
import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';
import {TPaymentSystems} from 'wlc-engine/modules/finances';

describe('/api/v1/paymentSystems', () => {
    const url = getRequestUrl('/api/v1/paymentSystems');
    const interfaceName = 'TPaymentSystems';

    it('-> IPaymentSystem unauth', async (): Promise<void> => {
        await fetch(url)
            .then((res: any) => res.json())
            .then((response: IData<TPaymentSystems>) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally().then();
    });

    it('-> IPaymentSystem auth', async (): Promise<void> => {
        const headers = await login();
        await fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: IData<TPaymentSystems>) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then();
            });
    });
});
