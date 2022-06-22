import {
    datatype,
    fake,
    finance,
    address,
} from 'faker';
import {DateTime} from 'luxon';

import {MockHelper} from 'wlc-engine/mocks/helpers/mock.helper';
import {IWinnerData} from 'wlc-engine/modules/promo';

export const winsHandler = async (req, res, ctx) => {
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
                AmountEUR: datatype.number(),
                Amount: datatype.number(),
                Date: DateTime
                    .now()
                    .minus({
                        day: datatype.number(10),
                        hour: datatype.number(60),
                        second: datatype.number(60),
                    })
                    .toFormat('yyyy-MM-dd HH:mm:ss'),
                Name: fake('{{name.firstName}} *****'),
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
