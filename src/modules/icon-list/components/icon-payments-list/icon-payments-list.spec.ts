import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {IconPaymentsListComponent} from './icon-payments-list.component';
import {IIconPaymentsListCParams} from './icon-payments-list.params';
import {
    ConfigService,
    EventService,
    IPaysystem,
} from 'wlc-engine/modules/core';

describe('IconPaymentsListComponent', () => {

    let component: IconPaymentsListComponent;
    let fixture: ComponentFixture<IconPaymentsListComponent>;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let nativeElement: HTMLElement;

    const payments: IPaysystem[] = [
        {
            Name: 'AccentPay 2 Cards',
            Init: 'AccentPay2',
        },
        {
            Name: 'Inpay Withdraw',
            Init: 'Inpay',
        },
        {
            Name: 'PayCryptos Bitcoin',
            Init: 'Cryptspay',
        },
    ].map((v) => createPaymentMock(v));

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
        ConfigServiceSpy.get.withArgs('appConfig.siteconfig.payment_systems').and.returnValues([...payments]);
        eventServiceSpy = jasmine.createSpyObj('EventService', ['subscribe']);

        TestBed.configureTestingModule({
            declarations: [IconPaymentsListComponent],
            providers: [
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
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

    const uniquePaySystems = ['NonExisting', 'Unique'];

    it('-> empty `include` list should not depend to payments systems list length', () => {
        component.$params.include = [];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.items.length).toBe(payments.length);
        });
    });

    it('-> length should be increased by unique systems', () => {
        component.$params.include = [...uniquePaySystems];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const expectedLength = payments.length + uniquePaySystems.length;
            expect(component.items.length).toBe(expectedLength);
        });
    });

    it('-> should not constraint if there are no exclusions', () => {
        component.$params.exclude = [];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.items.length).toBe(payments.length);
        });
    });

    it('-> should keep the icons list empty if `exclude` equals "all"', () => {
        component.$params.exclude = ['all'];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.items.length).toBe(0);
        });
    });

    it('-> length should be less according to the exclusions', () => {
        component.$params.exclude = [payments[0].Name.toLocaleLowerCase()];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const lengthAfterExclusion = payments.length - component.$params.exclude.length;
            expect(component.items.length).toBe(lengthAfterExclusion);
        });
    });

    it('-> if there are no items nothing will be shown', () => {
        component.items = [];
        expect(nativeElement.nodeValue).toBe(null);
    });

    it('-> `[wlc-icon-list]` component should be mounted', () => {
        const iconListEl = nativeElement.querySelector('wlc-icon-list');
        expect(iconListEl).toBeDefined();
    });
});

type PayMockFrom = Pick<IPaysystem, 'Name' | 'Init'>;

function createPaymentMock({Name, Init}: PayMockFrom): IPaysystem {
    return {
        Name,
        Init,
        Alias: {
            en:'',
            ru:'',
            fr:'',
            de:'',
            ar:'',
            it:'',
            ja:'',
        },
    };
}
