import {
    login,
    logout,
    TLoginResponse,
    getRequestUrl,
    checkIfSuccess,
    fetch,
    printWarn,
} from './helpers/global';

import {
    IBootstrap,
    IData,
} from 'wlc-engine/modules/core';

describe('/api/v1/acceptTermsOfService', () => {
    let headers: TLoginResponse;

    beforeAll(async (): Promise<void> => {
        headers = await login();
    });

    afterAll(async (): Promise<void> => {
        await logout();
    });

    it('-> check other API failed before accept terms', async (): Promise<void> => {
        await fetch(getRequestUrl('/api/v1/jackpots'), {headers})
            .then((res: any) => res.json())
            .then((resJson: IData<any>) => {
                if (resJson.code !== 200) {
                    expect(resJson.errors?.[0]).toEqual('You need to accept terms of service');
                }
            })
            .catch(fail);
    });

    it('-> accept new terms', async (): Promise<void> => {
        await fetch(getRequestUrl('/api/v1/bootstrap'))
            .then((res: Response) => res.json())
            .then(async (res: IBootstrap) => {
                if (res.siteconfig.termsOfService) {
                    await fetch(getRequestUrl('/api/v1/acceptTermsOfService'), {
                        headers,
                        method: 'POST',
                    })
                        .then((res: any) => res.json())
                        .then(checkIfSuccess)
                        .catch(fail);
                } else {
                    printWarn('The project does not have the termsOfService parameter');
                }
            });
    });
});
