import {
    checkIfSuccess,
    fetch,
    getRequestUrl,
    login,
    logout,
    printWarn,
    TLoginResponse,
} from './helpers/global';

import {
    IFavourite,
    IGames,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IData} from 'wlc-engine/modules/core';

describe('/api/v1/favorites', () => {
    let headers: TLoginResponse;
    let gameID: IFavourite['game_id'];
    const interfaceName = 'IFavourite';
    const favouritesUrl = '/api/v1/favorites/';
    const maxRequestRetry = 3;

    beforeAll(async (): Promise<void> => {
        headers = await login();

        for (let retry = maxRequestRetry; retry > 0; retry--) {
            try {
                gameID = await fetch(getRequestUrl('/api/v1/games?slim=true'))
                    .then((res: Response) => res.json())
                    .then((response: IData<IGames>) => {
                        checkIfSuccess(response);
                        const anyGameId = response.data?.games[0]?.ID;
                        if (anyGameId) {
                            retry = 0;
                            return anyGameId;
                        } else if (!retry) {
                            printWarn('Games not found');
                        }
                    });
            } catch (error) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL * maxRequestRetry);

    afterAll(async (): Promise<void> => {
        await logout().then();
    });

    it('-> IFavourite add game', async (): Promise<void> => {
        if (!gameID) {
            printWarn('Test skipped');
            return;
        }

        await postGameId(favouritesUrl + gameID)
            .then((res: Response) => res.json())
            .then((response: IData<IFavourite>) => {
                checkIfSuccess(response);
                expect(interfaceName).toBeImplemented(response.data);
            })
            .catch(fail)
            .finally();
    });

    it('-> IFavourite games list', async (): Promise<void> => {
        if (!gameID) {
            printWarn('Test skipped');
            return;
        }

        for (let retry = maxRequestRetry; retry > 0; retry--) {
            try {
                await fetch(getRequestUrl(favouritesUrl), {headers})
                    .then((res: Response) => res.json())
                    .then((response: IData<IFavourite[]>) => {
                        checkIfSuccess(response);
                        if (response.data?.length) {
                            response.data.forEach((value: IFavourite) => {
                                expect(interfaceName).toBeImplemented(value);
                            });
                            retry = 0;
                        } else {
                            throw Error('Favourites is empty');
                        }
                    });
            } catch (error) {
                if (retry < 2) {
                    printWarn((error as Error).message + ' and cant add game to favourites');
                    return;
                }
                await postGameId(favouritesUrl + gameID).catch(fail);
            }
        }
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL * maxRequestRetry);

    const postGameId = async (url: string): Promise<any> => {
        return fetch(getRequestUrl(url),
            {
                headers,
                method: 'POST',
            });
    };
});
