import {
    fetch,
    getRequestUrl,
} from './helpers/global';

import {IBootstrap} from 'wlc-engine/modules/core/system/interfaces';

describe('/api/v1/bootstrap', () => {
    const url = getRequestUrl('/api/v1/bootstrap');
    const interfaceName = 'IBootstrap';

    it('-> IBootstrap', async (): Promise<void> => {
        await fetch(url).then((res: any) => res.json())
            .then((response: IBootstrap) => {
                expect(interfaceName).toBeImplemented(response);
            })
            .catch((err: unknown) => fail(err))
            .finally().then();
    });
});
