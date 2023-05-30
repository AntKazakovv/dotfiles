import {
    ICountries,
    ICountry,
    IData,
} from 'wlc-engine/modules/core';
import {
    getRequestUrl,
    fetchWithRetryNoAuth,
    checkIfSuccess,
    printWarn,
} from './helpers/global';

describe('/api/v1/countries', () => {
    const url = getRequestUrl('/api/v1/countries');
    const interfaceName = 'ICountries';
    const interfaceNameList = 'ICountry';
    let response: IData<ICountries>;

    beforeAll(async (): Promise<void> => {
        try {
            response = await fetchWithRetryNoAuth<IData<ICountries>>(url, interfaceName);
            checkIfSuccess(response);
        } catch (err: unknown) {
            fail(err);
        }
    });

    it('-> ICountries', (): void => {
        expect(interfaceName).toBeImplemented(response.data);
    });

    it('-> ICountry', (): void => {
        if (response.data?.countries?.length) {
            response.data.countries.forEach((element: ICountry): void => {
                expect(interfaceNameList).toBeImplemented(element);
            });
        } else {
            printWarn('Countries list is empty');
        }
    });
});
