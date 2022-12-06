import {
    fetch,
    getRequestUrl,
} from './helpers/global';

import {ITournamentResponse} from 'wlc-engine/modules/tournaments';

describe('/api/v1/tournaments', () => {
    const url = getRequestUrl('/api/v1/tournaments');
    const interfaceName = 'ITournamentResponse';

    it('-> ITournament', async (): Promise<void> => {
        await fetch(url)
            .then((res: any) => res.json())
            .then((response: ITournamentResponse) => {
                expect(interfaceName).toBeImplemented(response);
            })
            .catch((err: unknown) => fail(err))
            .finally().then();
    });
});
