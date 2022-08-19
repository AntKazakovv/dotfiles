import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

import {TBonusesHistory} from 'wlc-engine/modules/bonuses';
import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/bonuses', () => {
    const url = getRequestUrl('/api/v1/bonuses?&type=history');
    const interfaceName = 'TBonusesHistory';

    it('-> TBonusesHistory', async (): Promise<void> => {
        const headers = await login();
        await fetch(url, {headers})
            .then((res: Response) => res.json())
            .then((response: IData<TBonusesHistory>) => {
                if (response.code !== 200) {
                    throw response.errors;
                }
                expect(interfaceName).toBeImplemented(response.data);
                if (response.data?.length === 0) {
                    console.warn('\x1b[31m%s\x1b[0m', '\n  WARN: Bonus history is empty');
                }
            })
            .catch((err: Error) => fail(err))
            .finally(() => {
                logout().then();
            });
    });
});
