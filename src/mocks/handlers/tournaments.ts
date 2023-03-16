import {
    datatype,
    lorem,
} from 'faker';
import {DateTime} from 'luxon';
import {
    MockedRequest,
    ResponseComposition,
    RestContext,
} from 'msw';

import {ITournament} from 'wlc-engine/modules/tournaments';

export const tournamentsHandler = async (
    req: MockedRequest,
    res: ResponseComposition<any>,
    ctx: RestContext,
) => {

    let result;

    try {
        const originalResponse = await ctx.fetch(req);
        result = await originalResponse.json();
    } catch (e) {};

    if (!result?.data?.length) {
        const data: ITournament[] = [];

        for (let i = 0; i < 10; i++) {
            data.push({
                ID: datatype.number(),
                Series: '',
                Name: lorem.sentence(2),
                Description: lorem.paragraph(),
                Selected: datatype.number(),
                Qualified: datatype.number(),
                WinnerBy: 'bets',
                WinToBetRatio: '0.00',
                PointsTotal: datatype.float().toString(),
                PointsLimit: datatype.number().toString(),
                PointsLimitMin: datatype.number().toString(),
                FeeType: 'balance',
                FeeAmount: {
                    EUR: datatype.number().toString(),
                    Currency: datatype.number().toString(),
                },
                Qualification: datatype.number().toString(),
                BetMin: {},
                BetMax: {},
                Repeat: 'once',
                Target: 'loyalty',
                Type: 'relative',
                Value: datatype.number().toString(),
                Starts: DateTime
                    .now()
                    .minus({
                        day: datatype.number(10),
                    })
                    .toFormat('yyyy-MM-dd HH:mm:ss'),
                Ends: DateTime
                    .now()
                    .plus({
                        day: datatype.number(10),
                    })
                    .toFormat('yyyy-MM-dd HH:mm:ss'),
                Status: '1',
                Games: {
                    Games: [],
                    Categories: [],
                    Merchants: [],
                    GamesBL: [],
                    CategoriesBL: [],
                    MerchantsBL: [],
                },
                FreeroundGames: '',
                RemainingTime: datatype.number(),
                CurrentTime: datatype.number(),
                TotalFounds: {
                    EUR: datatype.number().toString(),
                    Currency: datatype.number().toString(),
                },
                WinningSpread: {
                    Percent: [
                        '100',
                    ],
                    EUR: [
                        datatype.number(),
                    ],
                    Currency: [
                        datatype.number(),
                    ],
                },
                Terms: lorem.paragraph(),
                Image: '',
                'Image_promo': '',
                'Image_dashboard': '',
                'Image_description': '',
                'Image_other': '',
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
