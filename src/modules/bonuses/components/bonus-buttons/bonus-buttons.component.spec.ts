import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {MockComponent} from 'ng-mocks';
import {UIRouter} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';

import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusButtonsComponent} from 'wlc-engine/modules/bonuses/components/bonus-buttons/bonus-buttons.component';
import {
    ConfigService,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {ButtonComponent} from 'wlc-engine/modules/core/components/button/button.component';

import * as Params from './bonus-buttons.params';

describe('BonusButtonsComponent', () => {
    let component: BonusButtonsComponent;
    let fixture: ComponentFixture<BonusButtonsComponent>;
    let nativeElement: HTMLElement;
    let bonusSpy: jasmine.SpyObj<Bonus>;
    let injectParams: Params.IBonusButtonsCParams;
    let defaultParams: Params.IBonusButtonsCParams = Params.defaultParams;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let modalServiceSpy: jasmine.SpyObj<ModalService>;
    let bonusesServiceSpy: jasmine.SpyObj<BonusesService>;
    let routerSpy: jasmine.SpyObj<UIRouter>;

    function resetProp(prop: string, value: boolean): void {
        (Object.getOwnPropertyDescriptor(bonusSpy, prop)?.get as jasmine.Spy).and.returnValue(value);
    }

    beforeEach(() => {
        bonusSpy = jasmine.createSpyObj<Bonus>('bonus', [], {
            'viewTarget': 'relative',
            'value$': new BehaviorSubject(100),
            'name': 'Super bonus',
            'description': 'Super bonus for you',
            'terms': 'Simple test',
            'showOnly': false,
            'canSubscribe': false,
            'canInventory': false,
            'canUnsubscribe': false,
            'canLeave': false,
            'canDeposit': false,
            'canPlay': false,
            'canOpen': false,
            'isUnavailableForActivation': false,
        });
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-bonus-buttons',
            btnsParams: {
                subscribeBtnParams: {},
                unsubscribeBtnParams: {},
                cancelBtnParams: {},
            },
        };
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['get'],
            {ready: Promise.resolve()},
        );
        eventServiceSpy = jasmine.createSpyObj(
            'EventService',
            ['emit', 'subscribe'],
        );
        modalServiceSpy = jasmine.createSpyObj(
            'ModalService',
            ['showModal', 'getActiveModal', 'hideModal'],
        );
        bonusesServiceSpy = jasmine.createSpyObj(
            'BonusesService',
            [
                'takeInventory',
                'subscribeBonus',
                'clearPromoBonus',
                'cancelBonus',
                'unsubscribeBonus',
                'filterBonuses',
            ],
        );

        TestBed.configureTestingModule({
            declarations: [BonusButtonsComponent, MockComponent(ButtonComponent)],
            providers: [
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: ModalService,
                    useValue: modalServiceSpy,
                },
                {
                    provide: BonusesService,
                    useValue: bonusesServiceSpy,
                },
                {
                    provide: UIRouter,
                    useValue: routerSpy,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BonusButtonsComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;
        component.bonus = bonusSpy;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('-> checking for the presence of an attribute', () => {
        expect(nativeElement.getAttribute('data-wlc-element')).toBe(injectParams.wlcElement);
    });

    it('-> checking for the presence of an class', () => {
        const classes = nativeElement.getAttribute('class');

        expect(classes.includes(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--type-${injectParams.type}`)).toBeTrue();
    });

    it('-> checking for the presence of an joinBtn', () => {
        resetProp('canSubscribe', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_subscribe"]')).toBeTruthy();
    });

    it('-> checking for the presence of an inventoriedBtn', () => {
        resetProp('canInventory', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_take"]')).toBeTruthy();
    });

    it('-> checking for the presence of an unsubscribeBtn', () => {
        resetProp('canUnsubscribe', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        component.$params.isInsideModal = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_unsubscribe"]')).toBeTruthy();
    });

    it('-> checking for the presence of an leaveBtn', () => {
        resetProp('canLeave', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_cancel"]')).toBeTruthy();
    });

    it('-> checking for the presence of an openBtn', () => {
        resetProp('canOpen', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_open-lootbox"]')).toBeTruthy();
    });

    it('-> checking for the presence of an chooseBonusBtn', () => {
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        component.isChooseBtn = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_choose"]')).toBeTruthy();
    });

    it('-> checking for the presence of an actionDepositBtn', () => {
        resetProp('canDeposit', true);
        component.ngOnInit();
        component.$params.useActionButtons = true;
        component.bonusItemTheme = 'promo';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_deposit"]')).toBeTruthy();
    });

    it('-> checking for the presence of an actionPlayBtn', () => {
        resetProp('canPlay', true);
        component.ngOnInit();
        component.$params.useActionButtons = true;
        component.bonusItemTheme = 'promo';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_play"]')).toBeTruthy();
    });

    it('-> checking for the presence of an actionRegisterBtn', () => {
        component.ngOnInit();
        component.bonusItemTheme = 'promo';
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_register"]')).toBeTruthy();
    });

    it('-> checking for the presence of an registrationBtn', () => {
        component.ngOnInit();
        component.bonusItemTheme = 'long';
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_register"]')).toBeTruthy();
    });

    it('-> checking for the Read more button represence for showOnly bonus', () => {
        resetProp('showOnly', true);
        component.ngOnInit();
        component.$params.isInsideModal = false;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_read-more"]')).toBeTruthy();
    });

    it('-> checking for the Read more button represence for empty btns bonus', async () => {
        component.ngOnInit();
        await fixture.whenStable();
        component.isAuth = true;
        component.$params.isInsideModal = false;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_read-more"]')).toBeTruthy();
    });

    it('-> checking for the Read more button represence for isUnavailableForActivation bonus', async () => {
        resetProp('canDeposit', true);
        resetProp('canPlay', true);
        resetProp('canInventory', true);
        resetProp('canOpen', true);
        resetProp('isUnavailableForActivation', true);
        component.ngOnInit();
        await fixture.whenStable(); //waiting for the property isEmpty to be set
        component.isAuth = true;
        component.$params.isInsideModal = false;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_read-more"]')).toBeTruthy();
    });

    it('-> checking for the Close button inside modal represence for showOnly bonus', () => {
        resetProp('showOnly', true);
        component.ngOnInit();
        component.$params.isInsideModal = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_close"]')).toBeTruthy();
    });

    it('-> checking for the Close button inside modal represence for empty btns bonus', async () => {
        component.ngOnInit();
        await fixture.whenStable(); //waiting for the property isEmpty to be set
        component.isAuth = true;
        component.$params.isInsideModal = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_close"]')).toBeTruthy();
    });

    it('-> checking for the Close button represence for isUnavailableForActivation bonus', async () => {
        resetProp('canDeposit', true);
        resetProp('canPlay', true);
        resetProp('canInventory', true);
        resetProp('canOpen', true);
        resetProp('isUnavailableForActivation', true);
        component.ngOnInit();
        await fixture.whenStable(); //waiting for the property isEmpty to be set
        component.isAuth = true;
        component.$params.isInsideModal = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_close"]')).toBeTruthy();
    });
});
