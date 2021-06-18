import {Game} from './game.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {IGame, ICountriesRestrictions} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {UIRouter} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core';

const gameData: IGame = {
    ID: '1946537',
    Image: '/gstatic/games/betsoft/315/safari_sam_2.jpg',
    Url: '991/841',
    Name: { en: 'Safari Sam 2' },
    Description: [],
    MobileUrl: '991/841',
    Branded: 0,
    SuperBranded: 0,
    hasDemo: 1,
    CategoryID: ['16'],
    SortPerCategory: { 16: 0 },
    MerchantID: '975',
    SubMerchantID: null,
    AR: '4:3',
    IDCountryRestriction: '456',
    isRestricted: false,
    Sort: '101000',
    PageCode: '841',
    MobilePageCode: '841',
    MobileAndroidPageCode: '841',
    MobileWindowsPageCode: '841',
    ExternalCode: null,
    MobileExternalCode: null,
    ImageFullPath: 'https://static.egamings.com/games/betsoft/safari_sam_2.jpg',
    WorkingHours: null,
    IsVirtual: '0',
    TableID: '1946537',
    MobileAndroidUrl: '991/841',
    MobileWindowsUrl: '991/841',
    LaunchCode: '841',
};

const countriesRestrictions: ICountriesRestrictions = {
    0: {
        ID: '1',
        Name: 'Blacklisted terr.',
        IDMerchant: '992',
        Countries: ['aus', 'alb', 'dza', 'asm'],
        IsDefault: '1',
        IDParent: '0',
        IDApiTemplate: '0',
    },
    147: {
        ID: '456',
        Name: 'test_188793',
        IDMerchant: '991',
        Countries: ['asm', 'vir', 'gum', 'umi', 'pri', 'rus', 'mnp', 'usa'],
        IsDefault: '0',
        IDParent: '5',
        IDApiTemplate: '63',
    },
};


describe('Game', () => {
    const data: IGame = gameData;
    let router = new UIRouter();
    let config = new ConfigService(null, null, null);

    it('should create an instance', () => {
        expect(new Game(data, router, config)).toBeTruthy();
    });

    it('should get restriction', () => {
        const data: IGame = gameData;
        const game = new Game(data, router, config);
        const restrictions = GamesHelper.createRestrictions(countriesRestrictions);
        expect(game.gameRestricted(restrictions, ['rus'])).toEqual(false);
    });

    it('should get merchant name', () => {
        const data: IGame = gameData;
        const game = new Game(data, router, config);
        expect(game.getMerchantName()).toEqual('AmaticDirect');
    });
});
