import dayjs from 'dayjs';

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
        const format = 'YYYY-MM-DDTHH:mm:ss';
        const startDate = dayjs().add(-1, 'month');
        const endDate = dayjs();

        await fetch(`${url}&startDate=${startDate.format(format)}&endDate=${endDate.format(format)}`)
            .then((res: Response) => res.json())
            .then((res: IData<TWinnersData>) => {
                checkIfSuccess(res);
                if (res.data) {
                    for (let win of res.data) {
                        expect(dayjs(win.Date, 'YYYY-MM-DD HH:mm:ss').unix()).toBeGreaterThanOrEqual(startDate.unix());
                        expect(dayjs(win.Date, 'YYYY-MM-DD HH:mm:ss').unix()).toBeLessThanOrEqual(endDate.unix());
                    }
                }
            })
            .catch(fail);
    });
});
