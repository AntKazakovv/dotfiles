import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {MockComponent} from 'ng-mocks';

import {BonusButtonsComponent} from 'wlc-engine/modules/bonuses/components/bonus-buttons/bonus-buttons.component';
import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {DynamicHtmlComponent} from 'wlc-engine/modules/compiler';
import {ConfigService} from 'wlc-engine/modules/core';
import {AccordionComponent} from 'wlc-engine/modules/core/components/accordion/accordion.component';

import {BonusModalComponent} from './bonus-modal.component';

import * as Params from './bonus-modal.params';

describe('BonusModalComponent', () => {
    let component: BonusModalComponent;
    let fixture: ComponentFixture<BonusModalComponent>;
    let nativeElement: HTMLElement;
    let bonusSpy: jasmine.SpyObj<Bonus>;
    let injectParams: Params.IBonusModalCParams;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let defaultParams: Params.IBonusModalCParams = Params.defaultParams;

    beforeEach(() => {
        configServiceSpy = jasmine.createSpyObj('ConfigService', ['get']);

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
        });
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            wlcElement: 'wlc-bonus-modal',
            bonus: bonusSpy,
        };
        TestBed.configureTestingModule({
            declarations: [
                BonusModalComponent,
                MockComponent(AccordionComponent),
                MockComponent(DynamicHtmlComponent),
                MockComponent(BonusButtonsComponent),
                MockComponent(BonusItemComponent),
            ],
            providers: [
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {provide: 'injectParams', useValue: injectParams},
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BonusModalComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;
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
        expect(classes.includes(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    it('-> checking info block', () => {
        expect(nativeElement.querySelector(`.${defaultParams.class}__name`).textContent)
            .toBe(bonusSpy.name);
        expect(nativeElement.querySelector(`.${defaultParams.class}__description`)).toBeDefined();
        expect(nativeElement.querySelector(`.${defaultParams.class}__terms `)).toBeDefined();
    });
});
