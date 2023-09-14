import {DateTime} from 'luxon';

import {
    fetch,
    getRequestUrl,
    login,
    logout,
    checkIfSuccess,
} from './helpers/global';

import {IData} from 'wlc-engine/modules/core';
import {TBets} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';

describe('/api/v1/bets', () => {
    const format = 'y-LL-dd\'\T\'HH:mm:ss';
    const startDate = DateTime.local().minus({months: 1}).toFormat(format);
    const endDate = DateTime.local().toFormat(format);
    const url = getRequestUrl(`/api/v1/bets?/&startDate=${startDate}&endDate=${endDate}`);
    const interfaceName = 'TBets';

    it('-> IBet', async (): Promise<void> => {
        const headers = await login();
        await fetch(url, {headers})
            .then((res: any) => res.json())
            .then((response: IData<TBets>) => {
                checkIfSuccess(response);
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then();
            });
    });
});
