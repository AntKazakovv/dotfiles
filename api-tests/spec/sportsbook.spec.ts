import {IData} from 'wlc-engine/modules/core';
import {
    fetchWithRetryNoAuth,
    getRequestUrl,
} from './helpers/global';
import {IBetradarGame} from 'wlc-engine/modules/sportsbook';
import {IPopularEventsData} from 'wlc-engine/modules/sportsbook';

describe('/api/v1/sportsbook', () => {
    const url = getRequestUrl('/api/v1/sportsbook/widgets?lang=en&widget=daily-match&action=widgets');
    const url2 = getRequestUrl('/api/v1/sportsbook/widgets?lang=en&widget=popular-events&action=widgets');
    const interfaceDailyName = 'IBetradarGame';
    const interfacePopularName = 'IPopularEventsData';

    it('-> IBetradarGame', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<IData<IBetradarGame>>(url, interfaceDailyName);
            expect(interfaceDailyName).toBeImplemented(response.data);
        } catch (err: unknown) {
            fail(err);
        }
    });

    it('-> IPopularEventsData', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<IData<IPopularEventsData>>(url2, interfacePopularName);
            expect(interfacePopularName).toBeImplemented(response.data);
        } catch (err: unknown) {
            fail(err);
        }
    });
});
