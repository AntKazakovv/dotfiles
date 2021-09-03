import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {ILimits} from 'wlc-engine/modules/core/components/amount-limit/amount-limit.params';
import {AmountLimitComponent} from './amount-limit.component';
import {defaultParams} from  './amount-limit.params';

describe('AmountLimitComponent', () => {
    let component: AmountLimitComponent;
    let fixture: ComponentFixture<AmountLimitComponent>;
    let nativeElement: HTMLElement;

    const injectParams = {
        wlcElement: 'test-wlc-element',
        minValue: 10,
        maxValue: 10000,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [AmountLimitComponent],
            providers: [{
                provide: 'injectParams',
                useValue: injectParams,
            }],
        }).compileComponents();

        fixture = TestBed.createComponent(AmountLimitComponent);
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
        const classes = nativeElement.getAttribute('class');

        expect(classes.includes(`${defaultParams.class}--theme-default`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--theme-mod-default`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--type-default`)).toBeTrue();
    });

    it('-> showLimits: test return value', () => {
        expect(component.limits).toEqual({
            min: injectParams.minValue,
            max: injectParams.maxValue,
        });

        const testShowLimits: ILimits = {
            min: 100,
            max: 200,
        };
        component.$params.showLimits = testShowLimits;
        component.setLimits();
        expect(component.limits).toEqual(testShowLimits);

        component.$params.showLimits = false;
        component.setLimits();
        expect(component.limits).toEqual({
            min: injectParams.minValue,
            max: injectParams.maxValue,
        });
    });

});
