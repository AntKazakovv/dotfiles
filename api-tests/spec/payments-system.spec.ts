import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

describe('/api/v1/paymentSystems', () => {
    const url = getRequestUrl('/api/v1/paymentSystems');
    const interfaceName = 'TPaymentSystems';

    it('-> IPaymentSystem unauth', (done: DoneFn): void => {
        fetch(url)
            .then((res: any) => res.json())
            .then((response: {data: unknown}) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                done();
            });
    });

    it('-> IPaymentSystem auth', async (done: DoneFn): Promise<void> => {
        const headers = await login();
        fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: {data: unknown}) => {
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then(done);
            });
    });
});
