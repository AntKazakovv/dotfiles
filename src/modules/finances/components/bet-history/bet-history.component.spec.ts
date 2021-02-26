import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BetHistoryComponent} from './transaction-history.component';

describe('TransactionHistoryComponent', () => {
    let component: BetHistoryComponent;
    let fixture: ComponentFixture<BetHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BetHistoryComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BetHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
