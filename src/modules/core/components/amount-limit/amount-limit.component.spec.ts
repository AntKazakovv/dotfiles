import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AmountLimitComponent} from './amount-limit.component';

describe('AmountLimitComponent', () => {
    let component: AmountLimitComponent;
    let fixture: ComponentFixture<AmountLimitComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AmountLimitComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AmountLimitComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
