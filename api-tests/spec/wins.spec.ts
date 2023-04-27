import {
    fetchWithRetryNoAuth,
    getRequestUrl,
    checkIfSuccess,
} from './helpers/global';

import {IData} from 'wlc-engine/modules/core';
import {TWinnersData} from 'wlc-engine/modules/promo/system/services/winners/winners.service';

describe('/api/v1/wins', () => {
    const url = getRequestUrl('/api/v1/wins?slim=1');
    const interfaceName = 'TWinnersData';

    it('-> IWinnerData', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<IData<TWinnersData>>(url, interfaceName);
            checkIfSuccess(response);
            expect(interfaceName).toBeImplemented(response.data);
        } catch (err: unknown) {
            fail(err);
        }
    });

    it('-> IWinnerData by limit', async (): Promise<void> => {
        try {
            const limit = 20;
            const response = await fetchWithRetryNoAuth<IData<TWinnersData>>(
                `${url}&limit=${limit}`,
                interfaceName,
            );
            checkIfSuccess(response);
            expect(response?.data?.length).toBeLessThanOrEqual(limit);
        } catch (err: unknown) {
            fail(err);
        }
    });

    it('-> IWinnerData by min', async (): Promise<void> => {
        try {
            const min = 60;
            const response = await fetchWithRetryNoAuth<IData<TWinnersData>>(
                `${url}&min=${min}`,
                interfaceName,
            );
            checkIfSuccess(response);
            if (response.data) {
                for (let win of response.data) {
                    expect(win.AmountEUR).toBeGreaterThanOrEqual(min);
                }
            }
        } catch (err: unknown) {
            fail(err);
        }
    });
});
