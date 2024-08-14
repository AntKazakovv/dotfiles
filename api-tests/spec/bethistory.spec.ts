import dayjs from 'dayjs';

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
    const format = 'YYYY-MM-DDTHH:mm:ss';
    const startDate = dayjs().add(-1, 'month').format(format);
    const endDate = dayjs().format(format);
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
