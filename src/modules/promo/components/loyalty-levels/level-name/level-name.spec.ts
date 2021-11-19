import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {LoyaltyLevelModel} from 'wlc-engine/modules/promo/system/models/loyalty-level.model';
import {LevelNameComponent} from 'wlc-engine/modules/promo/components/loyalty-levels/level-name/level-name.component';
import {
    ILevelNameParams,
    defaultParams,
} from 'wlc-engine/modules/promo/components/loyalty-levels/level-name/level-name.params';

describe('LevelNameComponent', () => {
    let component: LevelNameComponent;
    let fixture: ComponentFixture<LevelNameComponent>;
    let nativeElement: HTMLElement;

    const testLevel: LoyaltyLevelModel = new LoyaltyLevelModel({
        service: 'test',
        method: 'test',
    }, {
        Level: '1',
        Name: 'Level 1',
        NextLevelPoints: '120',
        Coef: '1',
        ConfirmPoints: '100',
        Image: '',
        Description: 'Description',
    });
    const injectParams: ILevelNameParams = {
        wlcElement: 'test-wlc-element',
        theme: 'default',
        level: testLevel,
    };

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [LevelNameComponent],
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

    it('-> checking icon if level hav description', () => {
        expect(component.$params.level.description).toBeTruthy();
        expect(nativeElement.querySelector(`.${defaultParams.class}-icon__description`)).toBeTruthy();
    });
});
