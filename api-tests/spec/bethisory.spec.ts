import {DateTime} from 'luxon';

import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

describe('/api/v1/bets', () => {
    const format = 'y-LL-dd\'\T\'HH:mm:ss';
    const startDate = DateTime.local().minus({months: 1}).toFormat(format);
    const endDate = DateTime.local().toFormat(format);
    const url = getRequestUrl(`/api/v1/bets?/&startDate=${startDate}&endDate=${endDate}`);
    const interfaceName = 'TBets';

    it('-> IBet', async (done: DoneFn): Promise<void> => {
        const headers = await login();
        fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: any) => {
                if (response.code !== 200) {
                    throw new Error(response.errors);
                }
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then(done);
            });
    });
});
