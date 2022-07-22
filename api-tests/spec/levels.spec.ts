
import {
    checkIfObject,
    checkIfSuccess,
    fetch,
    getRequestUrl,
    printWarn,
} from './helpers/global';

import {IData} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ILevel} from 'wlc-engine/modules/promo/system/interfaces/level.interface';

describe('/api/v1/loyalty/levels', () => {

    it('-> ILevel', async (done: DoneFn): Promise<void> => {

        const url = getRequestUrl('/api/v1/loyalty/levels');
        const interfaceName = 'ILevel';

        await fetch(url)
            .then((res: Response) => res.json())
            .then((response: IData<IIndexing<ILevel>>) => {
                checkIfSuccess(response);
                checkIfObject(response);

                if (response.data && Object.keys(response.data).length) {
                    for (const element in response.data) {
                        expect(interfaceName).toBeImplemented(response.data[element]);
                    }
                } else {
                    printWarn('Levels are empty.');
                }
            })
            .catch(fail)
            .finally(done);
    });
});
