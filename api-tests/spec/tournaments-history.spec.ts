import {
    fetch,
    getRequestUrl,
    login,
    logout,
} from './helpers/global';

import {
    ITournamentHistory,
    ITopTournamentUsers,
} from 'wlc-engine/modules/tournaments';
import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/tournaments?type=history', () => {
    const historyUrl = getRequestUrl('/api/v1/tournaments?type=history');
    const historyInterface = 'ITournamentHistory';
    const statInterface = 'ITopTournamentUsers';
    const statUrlStart = '/api/v1/tournaments/';
    const statUrlEnd = '/top?lang=en&start=0';
    const tournamentsID: ITournamentHistory['ID'][] = [];

    it('-> ITournamentHistory', async (): Promise<void> => {
        const headers = await login();
        fetch(historyUrl, {headers})
            .then((res: Response) => res.json())
            .then((response: IData<ITournamentHistory[]>) => {
                if (response.code !== 200) {
                    throw response.errors;
                }
                if (response.data?.length === 0) {
                    console.warn('\x1b[31m%s\x1b[0m', '\n  WARN: Tournament history is empty');
                } else {
                    response.data?.forEach((element: ITournamentHistory): void => {
                        expect(historyInterface).toBeImplemented(element);
                        tournamentsID.push(element.ID);
                    });
                }
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                logout().then();
            });
    });

    it('-> ITournamentHistoryStat', async (): Promise<void> => {
        if (!tournamentsID.length) {
            return;
        }
        const headers = await login();
        tournamentsID.forEach(element => {
            const statRequest = getRequestUrl(statUrlStart + element + statUrlEnd);
            fetch(statRequest, {headers})
                .then((res: Response) => res.json())
                .then((response: IData<ITopTournamentUsers>) => {
                    if (response.code !== 200) {
                        throw response.errors;
                    }
                    expect(statInterface).toBeImplemented(response.data);
                })
                .catch((err: unknown) => fail(err))
                .finally(() => {
                    logout().then();
                });
        });
    });
});
