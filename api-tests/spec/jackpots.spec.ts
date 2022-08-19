import {
    fetch,
    getRequestUrl,
} from './helpers/global';

import {IJackpot} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/jackpots', () => {
    const url = getRequestUrl('/api/v1/jackpots');
    const interfaceName = 'IJackpot';

    it('-> IJackpot', async (): Promise<void> => {
        await fetch(url)
            .then((res: Response) => res.json())
            .then((response: IData<IJackpot[]>) => {
                if (response.code !== 200) {
                    throw response.errors;
                }

                if (response.data?.length === 0) {
                    console.warn('\x1b[31m%s\x1b[0m', '\n  WARN: Jackpots are empty.');
                } else {
                    response.data?.forEach((element: IJackpot): void => {
                        expect(interfaceName).toBeImplemented(element);
                    });
                }
            })
            .catch((err: unknown) => fail(err))
            .finally().then();
    });
});
