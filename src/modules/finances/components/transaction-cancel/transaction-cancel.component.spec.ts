import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransactionCancelComponent} from './transaction-cancel.component';

describe('TransactionCancelComponent', () => {
    let component: TransactionCancelComponent;
    let fixture: ComponentFixture<TransactionCancelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransactionCancelComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TransactionCancelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
