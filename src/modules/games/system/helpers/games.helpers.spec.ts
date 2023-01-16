import {IIndexing} from 'wlc-engine/modules/core';
import {
    GamesHelper,
    ISeparateSortGamesOptions,
} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';


describe('GamesHelper -> sortGamesGeneral', () => {

    const sorts: IIndexing<Partial<IAllSortsItemResponse>> = {
        1: {
            globalByCountries: {'rus': 1},
            globalByLanguages: {'ru': 2},
        },
        2: {
            globalByCountries: {'rus': 0},
            globalByLanguages: {'ru': 3},
            localByCountries: {'rus': 100},
            localByLanguages: {'ru': 103},
        },
        3: {
            globalByCountries: {'rus': 3},
            globalByLanguages: {'ru': 1},
            localByLanguages: {'ru': 101},
        },
        4: {
            globalByLanguages: {'ru': 0},
        },
    };

    const cases = [
        {
            games: [{ID: 1}, {ID: 2}, {ID: 3}, {ID: 4}],
            options: {
                sortSetting: {direction: {}}, language: 'ru', country: 'rus',
            } as ISeparateSortGamesOptions,
            expected: [{ID: 2}, {ID: 3}, {ID: 1}, {ID: 4}],
        },
    ];

    for (let index = 0; index < cases.length; index++) {
        const testCase = cases[index];
        it(`-> ${index}`, async (): Promise<void> => {
            GamesHelper.sortGamesGeneral(testCase.games, sorts, testCase.options);

            expect(testCase.games).toEqual(testCase.expected);
        });
    }
});

describe('GamesHelper -> sortGamesInCategory', () => {

    const sorts: IIndexing<Partial<IAllSortsItemResponse>> = {
        1946305: {
            global: '100005',
            local: '100001',
            globalByCategories: {16: 0},
            localByCategories: {16: 0},
            localPerCategoriesByCountries: {16: {'rus': 200}},
        },
        1958931: {
            global: '100005',
            local: '100002',
            globalByCategories: {16: 0},
            localByCategories: {16: 0},
            localByCountries: {'rus': 100},
        },
        2253642: {
            global: '100006',
            local: '100004',
            globalByCategories: {16: 0},
            localByCategories: {16: 300},
        },
        2213856: {
            global: '100009',
            local: '9900009',
            globalByCategories: {16: 0},
            localByCategories: {16: 0},
        },
        1474987: {
            global: '100991',
            globalByCategories: {16: 0},
            globalPerCategoriesByCountries: {16: {'rus': 100}},
        },
        1679452: {
            global: '100410',
            globalByCategories: {16: 0},
            globalByCountries: {'rus': 50},
        },
        2179700: {
            global: '101014',
            local: '101014',
            globalByCategories: {1364: 0, 16: 150},
            localByCategories: {16: 0, 35: 0},
        },
        1556365: {
            global: '9900050',
            local: '100037',
            globalByCategories: {1364: 0, 16: 0},
            localByCategories: {16: 0},
        },
        3172: {
            global: '100682',
            local: '100681',
            globalByCategories: {16: 0, 4: 0},
            localByCategories: {16: 0, 4: 0},
            localPerCategoriesByCountries: {16: {'bra': 500}},
        },
        1478167: {
            global: '100047',
            local: '100031',
            globalByCategories: {1364: 0, 13: 0, 16: 0},
            localByCategories: {13: 0, 16: 0},
            localByCountries: {'bra': 150},
        },
    };

    const cases = [
        {
            games: [
                {ID: 1946305}, {ID: 1958931}, {ID: 2253642}, {ID: 2213856}, {ID: 1474987},
                {ID: 1679452}, {ID: 2179700}, {ID: 1556365}, {ID: 3172}, {ID: 1478167},
            ],
            options: {
                sortSetting: {direction: {}}, language: 'ru', country: 'rus', categoryId: 16,
            } as ISeparateSortGamesOptions,
            expected: [
                {ID: 1946305}, {ID: 1958931}, {ID: 2253642}, {ID: 2213856}, {ID: 2179700},
                {ID: 3172}, {ID: 1556365}, {ID: 1478167}, {ID: 1474987}, {ID: 1679452},
            ],
        },
    ];

    for (let index = 0; index < cases.length; index++) {
        const testCase = cases[index];
        it(`-> ${index}`, async (): Promise<void> => {
            GamesHelper.sortGamesInCategory(testCase.games, sorts, testCase.options);

            expect(testCase.games).toEqual(testCase.expected);
        });
    }
});

describe('GamesHelper -> sortGamesInCategory -> category 1471', () => {

    const sorts: IIndexing<Partial<IAllSortsItemResponse>> = {
        1714963: {
            //Starz Megaways
            global: '10625',
            local: '10625',
            globalByCategories: {16: 0},
            localByCategories: {1471: 1000},
            localPerCategoriesByCountries: {1471: {rus: 100}},
        },
        1784887: {
            //Curse of the Werewolf Megaways
            global: '11410',
            globalByCategories: {16: 0},
            localByCategories: {1471: 1000, 1539: 1000},
        },
        1821057: {
            //Twin Spin Megaways
            global: '21023',
            globalByCategories: {16: 0},
            localByCategories: {1471: 1000},
        },
        1841091: {
            //Christmas Carol Megaways
            global: '20786',
            globalByCategories: {16: 0},
            localByCategories: {1471: 1000, 1539: 1000},
        },
        1884574: {
            // Fruit Shop Megaways
            global: '100684',
            globalByCategories: {16: 0},
            localByCategories: {1471: 1000},
        },
        1899086: {
            // Big Bucks Bandits Megaways
            global: '20091',
            globalByCategories: {13: 0, 16: 0},
            localByCategories: {13: 0, 1471: 0, 1539: 0, 16: 0},
        },
        2057925: {
            // Chilli Heat MEGAWAYS
            global: '100152',
            globalByCategories: {16: 0},
            localByCategories: {1471: 0, 1539: 0, 16: 0},
        },
        2131932: {
            // Crystal Caverns MEGAWAYS
            global: '100195', globalByCategories: {16: 0},
            localByCategories: {1471: 1000, 1539: 0, 16: 0},
        },
        2182268: {
            // Elemental Gems Megaways
            global: '100200',
            globalByCategories: {16: 0},
            localByCategories: {1471: 953, 16: 0, 35: 1000},
        },
    };

    const cases = [
        {
            games: [
                {ID: 1714963}, {ID: 1784887}, {ID: 1821057}, {ID: 1841091}, {ID: 1884574},
                {ID: 1899086}, {ID: 2057925}, {ID: 2131932}, {ID: 2182268},
            ],
            options: {
                sortSetting: {direction: {}}, language: 'en', country: 'arm', categoryId: 1471,
            } as ISeparateSortGamesOptions,
            expected: [
                {ID: 1714963}, {ID: 1884574}, {ID: 2131932}, {ID: 1821057}, {ID: 1841091},
                {ID: 1784887}, {ID: 2182268}, {ID: 2057925}, {ID: 1899086},
            ],
        },
    ];

    for (let index = 0; index < cases.length; index++) {
        const testCase = cases[index];
        // eslint-disable-next-line sonarjs/no-identical-functions
        it(`-> ${index}`, async (): Promise<void> => {
            GamesHelper.sortGamesInCategory(testCase.games, sorts, testCase.options);

            expect(testCase.games).toEqual(testCase.expected);
        });
    }
});
