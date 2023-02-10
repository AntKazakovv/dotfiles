import {
    fetchWithRetryNoAuth,
    getRequestUrl,
} from './helpers/global';

import {IBootstrap} from 'wlc-engine/modules/core/system/interfaces';

describe('/api/v1/bootstrap', () => {
    const url = getRequestUrl('/api/v1/bootstrap');
    const interfaceName = 'IBootstrap';

    it('-> IBootstrap', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<IBootstrap>(url, interfaceName);
            expect(interfaceName).toBeImplemented(response);
        } catch (err: unknown) {
            fail(err);
        }
    });
});
