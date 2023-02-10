import {
    fetchWithRetryNoAuth,
    getRequestUrl,
    printWarn,
} from './helpers/global';

import {IJackpot} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/jackpots', () => {
    const url = getRequestUrl('/api/v1/jackpots');
    const interfaceName = 'IJackpot';

    it('-> IJackpot', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<IData<IJackpot[]>>(url, interfaceName);

            if (response.code !== 200) {
                throw response.errors;
            }

            if (!response.data?.length) {
                printWarn('Jackpots are empty.');
            } else {
                response.data?.forEach((element: IJackpot): void => {
                    expect(interfaceName).toBeImplemented(element);
                });
            }
        } catch (err: unknown) {
            fail(err);
        }
    });
});
