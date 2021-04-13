import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {JackpotsSliderComponent} from 'wlc-engine/modules/promo/components/jackpots-slider/jackpots-slider.component';

describe('JackpotsSliderComponent', () => {
    let component: JackpotsSliderComponent;
    let fixture: ComponentFixture<JackpotsSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ JackpotsSliderComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JackpotsSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
