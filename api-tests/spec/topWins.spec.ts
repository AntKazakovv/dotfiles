import {DateTime} from 'luxon';

import {
    getRequestUrl,
    checkIfSuccess,
    fetch,
} from './helpers/global';

import {IData} from 'wlc-engine/modules/core';
import {TWinnersData} from 'wlc-engine/modules/promo/system/services/winners/winners.service';

describe('/api/v1/stats/topWins', () => {
    const url = getRequestUrl('/api/v1/stats/topWins?slim=1');
    const interfaceName = 'TWinnersData';

    it('-> IWinnerData', async (): Promise<void> => {
        await fetch(url)
            .then((res: Response) => res.json())
            .then((res: IData<TWinnersData>) => {
                checkIfSuccess(res);
                expect(interfaceName).toBeImplemented(res.data);
            })
            .catch(fail);
    });

    it('-> IWinnerData by limit', async (): Promise<void> => {
        const limit = 20;
        await fetch(`${url}&limit=${limit}`)
            .then((res: Response) => res.json())
            .then((res: IData<TWinnersData>) => {
                checkIfSuccess(res);
                expect(res?.data?.length).toBeLessThanOrEqual(limit);
            })
            .catch(fail);
    });

    it('-> IWinnerData by min', async (): Promise<void> => {
        const min = 60;
        await fetch(`${url}&min=${min}`)
            .then((res: Response) => res.json())
            .then((res: IData<TWinnersData>) => {
                checkIfSuccess(res);
                if (res.data) {
                    for (let win of res.data) {
                        expect(win.AmountEUR).toBeGreaterThanOrEqual(min);
                    }
                }
            })
            .catch(fail);
    });

    it('-> IWinnerData by date', async (): Promise<void> => {
        const format = 'y-LL-dd\'\T\'HH:mm:ss';
        const startDate = DateTime.local().minus({months: 1});
        const endDate = DateTime.local();

        await fetch(`${url}&startDate=${startDate.toFormat(format)}&endDate=${endDate.toFormat(format)}`)
            .then((res: Response) => res.json())
            .then((res: IData<TWinnersData>) => {
                checkIfSuccess(res);
                if (res.data) {
                    for (let win of res.data) {
                        expect(DateTime.fromSQL(win.Date).toMillis()).toBeGreaterThanOrEqual(startDate.toMillis());
                        expect(DateTime.fromSQL(win.Date).toMillis()).toBeLessThanOrEqual(endDate.toMillis());
                    }
                }
            })
            .catch(fail);
    });
});
