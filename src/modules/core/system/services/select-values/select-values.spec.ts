import {TestBed} from '@angular/core/testing';

import _each from 'lodash-es/each';
import {BehaviorSubject, filter} from 'rxjs';
import dayjs from 'dayjs';
import {
    ConfigService,
    EventService,
    GlobalHelper,
    ICountry,
    IIndexing,
    InjectionService,
    ISelectOptions,
    SelectValuesService,
} from 'wlc-engine/modules/core';

import {ICurrency} from 'wlc-engine/modules/finances';
import {
    TDateList,
    IPhoneLimits,
} from 'wlc-engine/modules/core/system/services/select-values/select-values.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services';

describe('SelectValuesService', () => {

    let selectValuesService: SelectValuesService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let InjectionServiceSpy: jasmine.SpyObj<InjectionService>;
    let gameCatalogServiceSpy: jasmine.SpyObj<GamesCatalogService>;
    let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;

    const currencies: IIndexing<ICurrency> = {
        1: {ID: '1', Name: 'EUR', ExRate: '1.00000000', registration: true, Alias: 'EUR'},
        9: {ID: '9', Name: 'CAD', ExRate: '1.48336482', registration: false, Alias: 'CAD'},
        3: {ID: '3', Name: 'USD', ExRate: '1.17865291', registration: true, Alias: 'USD'},
        2: {ID: '2', Name: 'RUB', ExRate: '89.28111768', registration: true, Alias: 'RUB'},
    };
    const countries = new BehaviorSubject<ICountry[]>([
        {value: 'ago', title: 'Angola', phoneCode: '244', iso2: 'ao'},
        {value: 'ago', title: 'Angola', phoneCode: '244', iso2: 'ao'},
        {value: 'bmu', title: 'Bermuda (UK)', phoneCode: '1', iso2: 'bm'},
    ]);
    const testMerchants = [
        {
            alias: 'AirDice',
            id: 905,
            image: GlobalHelper.gstaticUrl + '/merchants/airdice.jpg',
            menuId: 'airdice',
            name: 'AirDice',
            parentId: 0,
        },
        {
            alias: 'ExtremeLive',
            id: 961,
            image: GlobalHelper.gstaticUrl + '/merchants/extremelive.jpg',
            menuId: 'extremelive',
            name: 'ExtremeLive',
            parentId: 0,
        },
        {
            alias: 'Apollo',
            id: 950,
            image: GlobalHelper.gstaticUrl + '/merchants/apollo.jpg',
            menuId: 'apollo',
            name: 'Apollo',
            parentId: 0,
        },
        {
            alias: 'RevolverGaming',
            id: 902,
            image: GlobalHelper.gstaticUrl + '/merchants/revolvergaming.jpg',
            menuId: 'revolvergaming',
            name: 'RevolverGaming',
            parentId: 0,
        },
    ];

    const checkFormatValues = (result: BehaviorSubject<ISelectOptions[]>): void => {
        _each(result.getValue(), (el: ISelectOptions) => {
            expect(el).toEqual(
                {
                    title: el.title,
                    value: el.value,
                },
            );
        });
    };

    beforeEach(() => {
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get', 'set'],
            {
                'ready': Promise.resolve(),
            },
        );
        configServiceSpy.get.and.returnValues({});
        configServiceSpy.get.withArgs('appConfig.siteconfig.currencies').and.returnValues(currencies);
        configServiceSpy.get.withArgs('$base.registration.currencySort').and.returnValues(['RUB']);
        configServiceSpy.get.withArgs('countries').and.returnValues(countries);
        configServiceSpy.get.withArgs('$modules.user.formElements.showIcon.use').and.returnValues(true);
        configServiceSpy.get.withArgs('$base.rewritingCurrencyName').and.returnValues({});

        gameCatalogServiceSpy = jasmine.createSpyObj(
            'GamesCatalogService',
            ['getAvailableMerchants'],
            {
                'ready': Promise.resolve(),
            },
        );

        currencyServiceSpy = jasmine.createSpyObj(
            'CurrencyService',
            [],
            {'regCurrencies': [
                {DisplayName: 'EUR', ID: '1', Name: 'EUR', ExRate: '1.00000000', Alias: 'EUR'},
                {DisplayName: 'USD', ID: '3', Name: 'USD', ExRate: '1.17865291', Alias: 'USD'},
                {DisplayName: 'RUB', ID: '2', Name: 'RUB', ExRate: '89.28111768', Alias: 'RUB'},
            ]},
        );

        InjectionServiceSpy = jasmine.createSpyObj(
            'InjectionService',
            ['getService'],
        );
        InjectionServiceSpy.getService.and.callFake((name: string): Promise<any> => {
            if (name === 'games.games-catalog-service') {
                return Promise.resolve(gameCatalogServiceSpy);
            }
            if (name === 'currency.currency-service') {
                return Promise.resolve(currencyServiceSpy);
            }
        });

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: InjectionService,
                    useValue: InjectionServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
            ],
        });

        selectValuesService = TestBed.inject(SelectValuesService);

        return configServiceSpy.ready;
    });


    it('-> should be created', () => {
        expect(selectValuesService).toBeTruthy();
    });

    it('-> should prepare currencies. If no available currencies, method will work', (done) => {
        const prepareCurrencyResult = new BehaviorSubject([
            {
                title: 'RUB',
                value: 'RUB',
            },
            {
                title: 'EUR',
                value: 'EUR',
            },
            {
                title: 'USD',
                value: 'USD',
            },
        ]);
        const prepareCurrency = selectValuesService.prepareCurrency();
        prepareCurrency.pipe(filter((v) => !!v.length)).subscribe((currencies) => {
            expect(currencies.length).toBe(3);
            expect(currencies).toEqual(prepareCurrencyResult.getValue());
            done();
        });
    });

    it('-> should get date list', () => {
        const values: TDateList[] = ['days', 'months', 'years'];
        const results: number[] = [31, 12, dayjs().year() - 18 - 1900];
        _each(values, (value: TDateList, index: number) => {
            const dateList: BehaviorSubject<ISelectOptions[]> = selectValuesService.getDateList(value);
            const dateListLength = dateList.getValue().length;
            expect(dateListLength).toBe(results[index]);
            checkFormatValues(dateList);
        });
    });

    it('-> should filter phone codes', () => {
        const phoneCodesResult = new BehaviorSubject([
            {
                title: '+1',
                value: '+1',
            },
            {
                title: '+244',
                value: '+244',
            },
        ]);
        const phoneCodes = selectValuesService.getPhoneCodes();
        expect(phoneCodes.value.length).toBe(2);
        expect(phoneCodes.getValue()).toEqual(phoneCodesResult.getValue());
    });

    it('-> should get pep list', () => {
        const pepList: BehaviorSubject<ISelectOptions[]> = selectValuesService.getPepList();
        checkFormatValues(pepList);
    });

    it('-> should get phone limit', () => {
        const phoneLimits: IPhoneLimits = selectValuesService.getPhoneLimitsDefault();
        _each(phoneLimits, (el) => {
            expect(el.maxLength || el.minLength).toBeTruthy();
            if (el.minLength && el.maxLength) {
                expect(el.minLength <= el.maxLength).toBeTruthy();
            }
        });
    });

    it('-> should get merchants list', async () => {
        gameCatalogServiceSpy.getAvailableMerchants = jasmine.createSpy().and.returnValues(testMerchants);
        const merchants = await selectValuesService.getMerchantsList();
        const resultMerchants: ISelectOptions[] = [
            {
                title: 'All',
                value: 'all',
            },
            {
                title: 'AirDice',
                value: 'AirDice',
            },
            {
                title: 'Apollo',
                value: 'Apollo',
            },
            {
                title: 'ExtremeLive',
                value: 'ExtremeLive',
            },
            {
                title: 'RevolverGaming',
                value: 'RevolverGaming',
            },
        ];

        merchants.subscribe((el) => {
            if (el.length === 1) {
                expect(el).toEqual([
                    {
                        title: 'All',
                        value: 'all',
                    },
                ]);
            } else {
                expect(el).toEqual(resultMerchants);
            }
        });
        checkFormatValues(merchants);
    });
});
