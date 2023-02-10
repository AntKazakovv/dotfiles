import {
    fetchWithRetryNoAuth,
    getRequestUrl,
} from './helpers/global';

import {TGamesResponse} from 'wlc-engine/modules/games/system/interfaces';

describe('/api/v1/games', () => {
    const url = getRequestUrl('/api/v1/games?slim=true');
    const interfaceName = 'TGamesResponse';

    it('-> IGames', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<TGamesResponse>(url, interfaceName);
            expect(interfaceName).toBeImplemented(response);
        } catch (err: unknown) {
            fail(err);
        }
    });
});
