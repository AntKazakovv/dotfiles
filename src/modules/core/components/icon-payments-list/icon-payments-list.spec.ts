import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {IconPaymentsListComponent} from './icon-payments-list.component';
import {defaultParams, IIconPaymentsListCParams} from './icon-payments-list.params';
import {ConfigService, IPaysystem} from 'wlc-engine/modules/core';

describe('IconPaymentsListComponent', () => {
    let component: IconPaymentsListComponent;
    let fixture: ComponentFixture<IconPaymentsListComponent>;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let nativeElement: HTMLElement;

    const payments: IPaysystem[] = [
        {
            'Name': 'AccentPay 2 Cards',
            'Init': 'AccentPay2',
            'Alias': {
                'en':'',
                'ru':'',
                'fr':'',
                'de':'',
                'ar':'',
                'it':'',
                'ja':'',
            },
        },
        {
            'Name': 'Inpay Withdraw',
            'Init': 'Inpay',
            'Alias': {
                'en':'',
                'ru':'',
                'fr':'',
                'de':'',
                'ar':'',
                'it':'',
                'ja':'',
            },
        },
        {
            'Name': 'PayCryptos Bitcoin',
            'Init': 'Cryptspay',
            'Alias': {
                'en':'',
                'ru':'',
                'fr':'',
                'de':'',
                'ar':'',
                'it':'',
                'ja':'',
            },
        },
    ];

    const injectParams: IIconPaymentsListCParams = {
        wlcElement: 'wlc-icon-payments-list',
        theme: 'default',
        themeMod: 'default',
        iconComponentParams: {
            theme: 'payments',
            watchForScroll: true,
            wlcElement: 'block_payments',
            colorIconBg: 'dark',
            hideImgOnError: true,
        },
    };

    beforeEach(() => {
        ConfigServiceSpy = jasmine.createSpyObj('ConfigService', ['load', 'get', 'set'], {
            'ready': Promise.resolve(),
        });
        ConfigServiceSpy.get.and.returnValues();
        ConfigServiceSpy.get.withArgs('appConfig.siteconfig.payment_systems').and.returnValues({payments});

        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [IconPaymentsListComponent],
            providers: [
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
                },
            ],
        }).overrideComponent(IconPaymentsListComponent, {
            set: {
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: injectParams,
                    },
                ],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(IconPaymentsListComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;

        fixture.detectChanges();
    });

    it('-> should be created', () => {
        expect(component).toBeTruthy();
    });

    it('-> checking for the presence of an attribute', () => {
        expect(nativeElement.getAttribute('data-wlc-element')).toEqual(injectParams.wlcElement);
    });

    it('-> checking for the presence of an class', () => {
        const classes = nativeElement.classList;

        expect(classes.contains(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.contains(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toBeTrue();
        expect(classes.contains(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    // TODO ticket #262281
});
