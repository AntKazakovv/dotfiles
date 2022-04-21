import {
    fetch,
    getRequestUrl,
} from './helpers/global';

describe('/api/v1/bootstrap', () => {
    const url = getRequestUrl('/api/v1/bootstrap');
    const interfaceName = 'IBootstrap';

    it('-> IBootstrap', (done: DoneFn): void => {
        fetch(url).then((res: any) => res.json())
            .then((response: unknown) => {
                (expect(interfaceName) as any).toBeImplemented(response);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                done();
            });
    });
});
