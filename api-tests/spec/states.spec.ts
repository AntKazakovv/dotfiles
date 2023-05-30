import {
    IData,
    IStates,
} from 'wlc-engine/modules/core';
import {
    getRequestUrl,
    fetchWithRetryNoAuth,
    checkIfSuccess,
    printWarn,
} from './helpers/global';

describe('/api/v1/states', () => {
    const url = getRequestUrl('/api/v1/states');
    const interfaceName = 'IStates';
    const interfaceNameList = 'TStates';
    let response: IData<IStates>;

    beforeAll(async (): Promise<void> => {
        try {
            response = await fetchWithRetryNoAuth<IData<IStates>>(url, interfaceName);
            checkIfSuccess(response);
        } catch (err: unknown) {
            fail(err);
        }
    });

    it('-> IStates', (): void => {
        expect(interfaceName).toBeImplemented(response.data);
    });

    it('-> TStates', (): void => {
        if (response.data?.states) {
            expect(interfaceNameList).toBeImplemented(response.data.states);
        } else {
            printWarn('States list is empty');
        }
    });
});
