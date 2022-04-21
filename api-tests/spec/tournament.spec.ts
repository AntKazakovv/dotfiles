import {
    fetch,
    getRequestUrl,
} from './helpers/global';

describe('/api/v1/tournaments', () => {
    const url = getRequestUrl('/api/v1/tournaments');
    const interfaceName = 'ITournamentResponse';

    it('-> ITournament', (done: DoneFn): void => {
        fetch(url)
            .then((res: any) => res.json())
            .then((response: unknown) => {
                (expect(interfaceName) as any).toBeImplemented(response);
            })
            .catch((err: unknown) => fail(err))
            .finally(() => {
                done();
            });
    });
});
