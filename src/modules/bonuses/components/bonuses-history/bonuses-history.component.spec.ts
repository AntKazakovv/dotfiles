import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BonusesHistoryComponent} from './bonuses-history.component';

describe('BonusesHistoryComponent', () => {
    let component: BonusesHistoryComponent;
    let fixture: ComponentFixture<BonusesHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BonusesHistoryComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BonusesHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
