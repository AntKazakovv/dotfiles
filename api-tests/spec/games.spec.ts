import {
    fetch,
    getRequestUrl,
} from './helpers/global';

describe('/api/v1/games', () => {
    const url = getRequestUrl('/api/v1/games?slim=true');
    const interfaceName = 'TGamesResponse';

    it('-> IGames', (done: DoneFn): void => {
        fetch(url)
            .then((res: any) => res.json())
            .then((response: unknown) => {
                expect(interfaceName).toBeImplemented(response);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                done();
            });
    });
});
