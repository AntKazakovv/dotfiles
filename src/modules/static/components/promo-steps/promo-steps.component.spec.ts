import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PromoStepsComponent} from './promo-steps.component';

describe('PromoStepsComponent', () => {
    let component: PromoStepsComponent;
    let fixture: ComponentFixture<PromoStepsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PromoStepsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PromoStepsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
