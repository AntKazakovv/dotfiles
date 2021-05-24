import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PIQCashierComponent} from './piq-cashier.component';

describe('PIQCashierComponent', () => {
    let component: PIQCashierComponent;
    let fixture: ComponentFixture<PIQCashierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PIQCashierComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PIQCashierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
