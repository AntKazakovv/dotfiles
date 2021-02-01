import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PromoSuccessComponent} from './promo-success.component';

describe('PromoSuccessComponent', () => {
    let component: PromoSuccessComponent;
    let fixture: ComponentFixture<PromoSuccessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PromoSuccessComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PromoSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
