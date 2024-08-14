import {
    datatype,
    fake,
    finance,
    address,
} from 'faker';
import dayjs from 'dayjs';
import {
    MockedRequest,
    MockedResponse,
    ResponseComposition,
    RestContext,
} from 'msw';
import {MockHelper} from 'wlc-engine/mocks/helpers/mock.helper';
import {IWinnerData} from 'wlc-engine/modules/promo';

export const winsHandler = async (
    req: MockedRequest,
    res: ResponseComposition<any>,
    ctx: RestContext): Promise<MockedResponse<IWinnerData[]>> => {
    let result;

    try {
        const originalResponse = await ctx.fetch(req);
        result = await originalResponse.json();
    } catch (e) {}

    if (!result?.data?.length) {
        const data: IWinnerData[] = [];

        for (let i = 0; i < 10; i++) {
            data.push({
                GameID: await MockHelper.getRandomGameID(),
                GameTableID: await MockHelper.getRandomGameID(true),
                AmountEUR: datatype.number(),
                Amount: datatype.number(),
                Date: dayjs()
                    .add(-1 * datatype.number(10), 'day')
                    .add(-1 * datatype.number(60), 'hour')
                    .add(-1 * datatype.number(60), 'second')
                    .format('YYYY-MM-DD HH:mm:ss'),
                ScreenName: fake('{{name.firstName}} *****'),
                Currency: finance.currencyCode(),
                CountryIso2: address.countryCode('alpha-2').toLowerCase(),
                CountryIso3: address.countryCode('alpha-3').toLowerCase(),
                ID: datatype.uuid(),
            });
        }

        result = {
            code: 200,
            status: 'success',
            data,
        };
    }

    return res(ctx.json(result));
};
