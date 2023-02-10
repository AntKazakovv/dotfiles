
import {
    checkIfObject,
    checkIfSuccess,
    fetchWithRetryNoAuth,
    getRequestUrl,
    printWarn,
} from './helpers/global';

import {IData} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ILevel} from 'wlc-engine/modules/loyalty/system/interfaces';

describe('/api/v1/loyalty/levels', () => {
    const url = getRequestUrl('/api/v1/loyalty/levels');
    const interfaceName = 'ILevel';

    it('-> ILevel', async (): Promise<void> => {
        try {
            const response = await fetchWithRetryNoAuth<IData<IIndexing<ILevel>>>(url, interfaceName);

            checkIfSuccess(response);
            checkIfObject(response);

            if (response.data && Object.keys(response.data).length) {
                for (const element in response.data) {
                    expect(interfaceName).toBeImplemented(response.data[element]);
                }
            } else {
                printWarn('Levels are empty.');
            }
        } catch (err: unknown) {
            fail(err);
        }
    });
});
