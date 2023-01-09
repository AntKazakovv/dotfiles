import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppModule} from 'wlc-engine/modules/app/app.module';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';

import {BonusButtonsComponent} from './bonus-buttons.component';
import * as Params from './bonus-buttons.params';

describe('BonusButtonsComponent', () => {
    let component: BonusButtonsComponent;
    let fixture: ComponentFixture<BonusButtonsComponent>;
    let nativeElement: HTMLElement;
    let bonusSpy: jasmine.SpyObj<Bonus>;
    let injectParams: Params.IBonusButtonsCParams;
    let defaultParams: Params.IBonusButtonsCParams = Params.defaultParams;

    function resetProp(prop: string, value: boolean): void {
        (Object.getOwnPropertyDescriptor(bonusSpy, prop)?.get as jasmine.Spy).and.returnValue(value);
    }

    beforeEach(() => {
        bonusSpy = jasmine.createSpyObj<Bonus>('bonus', [], {
            'viewTarget': 'relative',
            'value': 100,
            'name': 'Super bonus',
            'description': 'Super bonus for you',
            'terms': 'Simple test',
            'canSubscribe': false,
            'inventoried': false,
            'canUnsubscribe': false,
            'isActive': false,
            'isDeposit': false,
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
        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [BonusButtonsComponent],
            providers: [
                {provide: 'injectParams', useValue: injectParams},
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
        resetProp('inventoried', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[text="Take"]')).toBeTruthy();
    });

    it('-> checking for the presence of an unsubscribeBtn', () => {
        resetProp('canUnsubscribe', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_unsubscribe"]')).toBeTruthy();
    });

    it('-> checking for the presence of an leaveBtn', () => {
        resetProp('isActive', true);
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[data-wlc-element="button_cancel"]')).toBeTruthy();
    });

    it('-> checking for the presence of an chooseBonusBtn', () => {
        component.ngOnInit();
        component.bonusItemTheme = 'default';
        component.isAuth = true;
        component.isChooseBtn = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[text="Choose"]')).toBeTruthy();
    });

    it('-> checking for the presence of an actionDepositBtn', () => {
        resetProp('canUnsubscribe', true);
        resetProp('isDeposit', true);
        component.ngOnInit();
        component.$params.useActionButtons = true;
        component.bonusItemTheme = 'promo';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[text="Deposit"]')).toBeTruthy();
    });

    it('-> checking for the presence of an actionPlayBtn', () => {
        resetProp('canUnsubscribe', true);
        resetProp('isActive', true);
        component.ngOnInit();
        component.$params.useActionButtons = true;
        component.bonusItemTheme = 'promo';
        component.isAuth = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[text="Play"]')).toBeTruthy();
    });

    it('-> checking for the presence of an actionRegisterBtn', () => {
        component.ngOnInit();
        component.bonusItemTheme = 'promo';
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[text="Sign up"]')).toBeTruthy();
    });

    it('-> checking for the presence of an registrationBtn', () => {
        component.ngOnInit();
        component.bonusItemTheme = 'long';
        fixture.detectChanges();

        expect(nativeElement.querySelector('button[text="Sign up"]')).toBeTruthy();
    });
});
