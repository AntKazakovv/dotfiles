import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {BonusModalComponent} from './bonus-modal.component';
import {Bonus} from 'wlc-engine/modules/bonuses';
import * as Params from './bonus-modal.params';

describe('BonusModalComponent', () => {
    let component: BonusModalComponent;
    let fixture: ComponentFixture<BonusModalComponent>;
    let nativeElement: HTMLElement;
    let bonusSpy: jasmine.SpyObj<Bonus>;
    let injectParams: Params.IBonusModalCParams;
    let defaultParams: Params.IBonusModalCParams = Params.defaultParams;

    beforeEach(() => {
        bonusSpy = jasmine.createSpyObj<Bonus>('bonus', ['getImageByType'], {
            'viewTarget': 'relative',
            'imageOtherUrl': '',
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
            iconType: 'svg',
            bgImage: '/gstatic/wlc/bonuses/modal-bonus-default.png',
        };
        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [BonusModalComponent],
            providers: [
                {provide: 'injectParams', useValue: injectParams},
            ],
            schemas: [NO_ERRORS_SCHEMA],
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
