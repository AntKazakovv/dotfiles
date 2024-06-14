import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {TranslateService} from '@ngx-translate/core';
import {MockComponent} from 'ng-mocks';

import {TooltipComponent} from 'wlc-engine/modules/core';
import {LoyaltyLevelModel} from 'wlc-engine/modules/loyalty/system/models/loyalty-level.model';
import {LevelNameComponent} from './level-name.component';
import {
    defaultParams,
    ILevelNameCParams,
} from './level-name.params';

describe('LevelNameComponent', () => {
    let component: LevelNameComponent;
    let fixture: ComponentFixture<LevelNameComponent>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    let nativeElement: HTMLElement;

    const testLevel: LoyaltyLevelModel = new LoyaltyLevelModel({
        service: 'test',
        method: 'test',
    }, {
        Level: '1',
        Name: 'Level 1',
        CurrentLevelPoints: '50',
        NextLevelPoints: '120',
        Coef: '1',
        ConfirmPoints: '100',
        Image: '',
        Description: 'Description',
    }, false, translateServiceSpy);

    const injectParams: ILevelNameCParams = {
        wlcElement: 'test-wlc-element',
        theme: 'default',
        level: testLevel,
    };

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [
                LevelNameComponent,
                MockComponent(TooltipComponent),
            ],
            providers: [
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LevelNameComponent);
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
        expect(nativeElement.classList.contains(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(nativeElement.classList.contains(`${defaultParams.class}--theme-mod-default`)).toBeTrue();
        expect(nativeElement.classList.contains(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    it('-> checking correct output level name', () => {
        expect(nativeElement.querySelector(`.${defaultParams.class}-text`).textContent).toBe(testLevel.name);
    });

    it('-> checking icon if level has description', () => {
        expect(component.$params.level.description).toBeTruthy();
        expect(nativeElement.querySelector(`.${defaultParams.class}-tooltip`)).toBeTruthy();
    });
});
