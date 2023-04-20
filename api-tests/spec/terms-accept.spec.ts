
import {
    login,
    logout,
    TLoginResponse,
    getRequestUrl,
    checkIfSuccess,
    fetch,
} from './helpers/global';

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
            .then((resJson: {errors?: [string]}) => {
                expect(resJson.errors?.[0]).toEqual('You need to accept terms of service');
            })
            .catch(fail);
    });

    it('-> accept new terms', async (): Promise<void> => {

        await fetch(getRequestUrl('/api/v1/acceptTermsOfService'), {
            headers,
            method: 'POST',
        })
            .then((res: any) => res.json())
            .then(checkIfSuccess)
            .catch(fail);
    });
});
