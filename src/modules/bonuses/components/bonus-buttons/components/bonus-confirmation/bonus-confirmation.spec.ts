import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import * as Translate from '@ngx-translate/core';
import {
    MockComponent,
    MockPipe,
} from 'ng-mocks';

import {
    CurrencyComponent,
    IconComponent,
} from 'wlc-engine/modules/core';
import {LoaderComponent} from 'wlc-engine/modules/core/components/loader/loader.component';

import {
    BonusConfirmationComponent,
} from 'wlc-engine/modules/bonuses/components/bonus-buttons/components/bonus-confirmation/bonus-confirmation.component';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {BonusCancellationInfo} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus-cancellation-info.model';

import * as Params from './bonus-confirmation.params';

describe('BonusConfirmationComponent', () => {
    let fixture: ComponentFixture<BonusConfirmationComponent>;
    let nativeElement: HTMLElement;
    let component: BonusConfirmationComponent;
    let injectParams: Params.IBonusConfirmationParams;
    let bonusesServiceSpy: jasmine.SpyObj<BonusesService>;
    let bonusInfoSpy: jasmine.SpyObj<BonusCancellationInfo>;

    beforeEach(() => {
        bonusesServiceSpy = jasmine.createSpyObj(
            'BonusesService',
            ['getCancelInformation'],
        );

        bonusInfoSpy = jasmine.createSpyObj<BonusCancellationInfo>(
            ' bonusInfo',
            [],
            {
                bonusBalanceDecrease: '2',
                realBalanceDecrease: '4',
                currency: 'EUR',
            });

        injectParams = {
            class: 'wlc-bonus-confirmation',
            wlcElement: 'wlc-bonus-confirmation',
        };

        TestBed.configureTestingModule({
            declarations: [
                BonusConfirmationComponent,
                MockComponent(IconComponent),
                MockComponent(CurrencyComponent),
                MockComponent(LoaderComponent),
                MockPipe(Translate.TranslatePipe),
            ],
            providers: [
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
                {
                    provide: BonusesService,
                    useValue: bonusesServiceSpy,
                },
            ],
        }).compileComponents();

        bonusesServiceSpy.getCancelInformation.and.resolveTo(bonusInfoSpy);

        fixture = TestBed.createComponent(BonusConfirmationComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create BonusConfirmationComponent', () => {
        expect(component).toBeDefined();
    });

    it('-> bonus balance displayed', async () => {
        await component.ngOnInit();
        fixture.detectChanges();
        expect(nativeElement.querySelector('[wlc-currency]')
            .getAttribute('ng-reflect-value'))
            .toEqual('2');
    });

    it('-> real balance displayed', async () => {
        await component.ngOnInit();
        fixture.detectChanges();
        expect(nativeElement.querySelectorAll('[wlc-currency]').item(1)
            .getAttribute('ng-reflect-value'))
            .toEqual('4');
    });
});
