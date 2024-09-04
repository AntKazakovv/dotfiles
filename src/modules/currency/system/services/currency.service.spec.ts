import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';

import {
    ConfigService,
} from 'wlc-engine/modules/core';
import {TDisplayName, ICurrency} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

import {CurrencyService} from 'wlc-engine/modules/currency/system/services';

describe('CurrencyService', () => {
    let currencyService: CurrencyService;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    const currencies: ICurrency<TDisplayName>[] = [
        {
            ID: '0',
            Name: 'EUR',
            ExRate: '1.00000000',
            IsCryptoCurrency: false,
            DisplayName: {
                'en': 'Euro',
            },
            registration: true,
            Alias: 'EUR',
        }, {
            Alias: 'RUB',
            DisplayName: {en: null},
            ExRate: '99.65459779',
            ID: '1',
            IsCryptoCurrency: false,
            Name: 'RUB',
            registration: true,
        }, {
            Alias: 'USD',
            DisplayName: {en: 'USD'},
            ExRate: '1.2',
            ID: '2',
            IsCryptoCurrency: false,
            Name: 'USD',
            registration: false,
        },
        {
            Alias: 'SEK',
            DisplayName: null,
            ExRate: '2',
            ID: '3',
            IsCryptoCurrency: false,
            Name: 'SEK',
            registration: false,
        },
    ];

    beforeEach(() => {
        translateServiceSpy = jasmine.createSpyObj(
            'TranslateService',
            [],
            {'translate': {'currentLang': 'en'}},
        );
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get', 'set'],
            {
                'ready': Promise.resolve(),
            },
        );
        configServiceSpy.get.withArgs('appConfig.siteconfig.currencies').and.returnValues(currencies);
        configServiceSpy.get.withArgs('appConfig.siteconfig.isMultiWallet').and.returnValues(true);
        configServiceSpy.get.withArgs('$base.multiWallet.onlyFiat').and.returnValues(true);

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: TranslateService,
                    useValue: translateServiceSpy,
                },
            ],
        });

        currencyService = TestBed.inject(CurrencyService);

        return configServiceSpy.ready;
    });

    it('-> should be created', () => {
        expect(currencyService).toBeTruthy();
    });

    it('-> should set currencies', () => {
        expect(currencyService.currencies.length).toBe(4);
        expect(currencyService.regCurrencies.length).toBe(2);
    });

    it('-> should display name', () => {
        expect(currencyService.getDisplayName('EUR')).toBe('Euro');
        expect(currencyService.getDisplayName('RUB')).toBe('RUB');
        expect(currencyService.getDisplayName('SEK')).toBe('SEK');
    });
});
