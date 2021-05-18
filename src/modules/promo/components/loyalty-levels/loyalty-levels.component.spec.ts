import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoyaltyLevelsComponent} from './loyalty-levels.component';

describe('LoyaltyLevelsComponent', () => {
    let component: LoyaltyLevelsComponent;
    let fixture: ComponentFixture<LoyaltyLevelsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoyaltyLevelsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoyaltyLevelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
